import type {
  ClaimAuthorization,
  NamespacedClaimId,
  NamespacedRealityId,
  RealityAuthorization,
  RuleEvaluationResult,
  SeverityDerivation,
  TrapActivation,
} from "../evidence-gates-types";
import type { ClaimType, EvidenceLevel, RealityType, SeverityRule, UniversalDocumentRealityMatrix } from "../types";

const DRY: Pick<SeverityDerivation, "dryRun" | "authorizationMode" | "neverUserVisible" | "sourceKind"> = {
  dryRun: true,
  authorizationMode: "dry_run",
  neverUserVisible: true,
  sourceKind: "severity_derivation",
};

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  speculative: 1,
  contextual: 2,
  strongly_supported: 3,
  explicit: 4,
};

function namespacedClaim(claimType: ClaimType): NamespacedClaimId {
  return `claim:${claimType}` as NamespacedClaimId;
}

function namespacedReality(reality: RealityType): NamespacedRealityId {
  return `reality:${reality}` as NamespacedRealityId;
}

function evidenceRuleRowId(r: RuleEvaluationResult): string | undefined {
  return r.evidenceRuleId ?? r.ruleId;
}

function matchedNonSpeculative(results: readonly RuleEvaluationResult[]): RuleEvaluationResult[] {
  return results.filter(
    (r) => r.matched && r.evidenceLevel !== undefined && r.evidenceLevel !== "speculative",
  );
}

function hasAnyMatchedEvidence(results: readonly RuleEvaluationResult[]): boolean {
  return results.some((r) => r.matched);
}

function intersectsClaimTypes(a: readonly ClaimType[] | undefined, b: ReadonlySet<ClaimType>): boolean {
  if (!a?.length) return false;
  return a.some((x) => b.has(x));
}

function claimAuthByType(rows: readonly ClaimAuthorization[]): Map<ClaimType, ClaimAuthorization> {
  const m = new Map<ClaimType, ClaimAuthorization>();
  for (const a of rows) {
    if (!a.namespaceId.startsWith("claim:")) continue;
    m.set(a.namespaceId.slice("claim:".length) as ClaimType, a);
  }
  return m;
}

function realityAuthByType(rows: readonly RealityAuthorization[]): Map<RealityType, RealityAuthorization> {
  const m = new Map<RealityType, RealityAuthorization>();
  for (const a of rows) {
    if (!a.namespaceId.startsWith("reality:")) continue;
    m.set(a.namespaceId.slice("reality:".length) as RealityType, a);
  }
  return m;
}

function candidateAllowedClaimTypes(rows: readonly ClaimAuthorization[]): Set<ClaimType> {
  const s = new Set<ClaimType>();
  for (const a of rows) {
    if (a.disposition !== "candidate_allowed") continue;
    if (!a.namespaceId.startsWith("claim:")) continue;
    s.add(a.namespaceId.slice("claim:".length) as ClaimType);
  }
  return s;
}

function nonSpecEvidenceById(results: readonly RuleEvaluationResult[]): Map<string, RuleEvaluationResult> {
  const m = new Map<string, RuleEvaluationResult>();
  for (const r of matchedNonSpeculative(results)) {
    const id = evidenceRuleRowId(r);
    if (id) m.set(id, r);
  }
  return m;
}

function minConfidence(rows: readonly RuleEvaluationResult[]): number {
  const vals = rows
    .map((r) => r.confidence)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
  if (vals.length === 0) return 0;
  return Math.min(...vals);
}

function weakestEvidenceLevel(rows: readonly RuleEvaluationResult[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 99;
  for (const r of rows) {
    const el = r.evidenceLevel;
    if (!el) continue;
    const rk = EVIDENCE_RANK[el];
    if (rk < bestRank) {
      bestRank = rk;
      best = el;
    }
  }
  return best;
}

function evidenceMeetsMinimum(weakest: EvidenceLevel | undefined, minimum: EvidenceLevel): boolean {
  if (!weakest) return false;
  return EVIDENCE_RANK[weakest] >= EVIDENCE_RANK[minimum];
}

function satisfiedIdSets(rows: readonly { satisfiedRuleIds?: readonly string[] }[]): Set<string>[] {
  return rows.map((r) => new Set(r.satisfiedRuleIds ?? []));
}

function intersectSets(sets: readonly Set<string>[]): Set<string> {
  if (sets.length === 0) return new Set();
  let acc = new Set(sets[0]!);
  for (let i = 1; i < sets.length; i++) {
    const next = new Set<string>();
    const s = sets[i]!;
    for (const x of acc) {
      if (s.has(x)) next.add(x);
    }
    acc = next;
  }
  return acc;
}

function trapGovernanceIds(traps: readonly TrapActivation[]): string[] {
  return traps
    .filter((t) => t.disposition === "candidate_triggered" || t.disposition === "candidate_uncertain")
    .map((t) => t.trapId);
}

function trapGovernanceActive(traps: readonly TrapActivation[]): boolean {
  return trapGovernanceIds(traps).length > 0;
}

function severityBlockedWhenConflict(
  sr: SeverityRule,
  realityByType: Map<RealityType, RealityAuthorization>,
  allowedClaims: ReadonlySet<ClaimType>,
): boolean {
  const blockedWhen = sr.blockedWhenRealities;
  if (!blockedWhen?.length) return false;
  const triggers = sr.claimTypesThatMayTrigger;
  if (!triggers?.length) return false;
  if (!intersectsClaimTypes(triggers, allowedClaims)) return false;
  for (const br of blockedWhen) {
    const auth = realityByType.get(br);
    if (auth?.disposition === "candidate_supported") return true;
  }
  return false;
}

export interface ResolveSeverityDerivationsParams {
  readonly matrix: UniversalDocumentRealityMatrix;
  readonly evidenceRuleResults: readonly RuleEvaluationResult[];
  readonly claimAuthorizations: readonly ClaimAuthorization[];
  readonly realityAuthorizations: readonly RealityAuthorization[];
  readonly trapActivations: readonly TrapActivation[];
}

/**
 * Severity **dry-run** derivations (8.2C-11): trace-only governance candidates — not runtime escalation,
 * not `trace.severity` wiring, not Smart Talk, not UI urgency.
 *
 * Uses only matrix `SeverityRule` rows plus structured dry-run outputs (claims, realities, traps, evidence ids).
 * No `documentText`, regex, tone inference, or cue synthesis.
 */
export function resolveSeverityDerivations(params: ResolveSeverityDerivationsParams): SeverityDerivation[] {
  const { matrix, evidenceRuleResults, claimAuthorizations, realityAuthorizations, trapActivations } = params;
  const rules = matrix.severityRules;
  if (rules.length === 0) return [];

  const claimByType = claimAuthByType(claimAuthorizations);
  const realityByType = realityAuthByType(realityAuthorizations);
  const allowedClaimTypes = candidateAllowedClaimTypes(claimAuthorizations);

  const nonSpec = matchedNonSpeculative(evidenceRuleResults);
  const anyMatched = hasAnyMatchedEvidence(evidenceRuleResults);
  const speculativeOnly = anyMatched && nonSpec.length === 0;
  const evidenceById = nonSpecEvidenceById(evidenceRuleResults);
  const trapsConstrain = trapGovernanceActive(trapActivations);
  const governanceTrapIds = trapGovernanceIds(trapActivations);

  const out: SeverityDerivation[] = [];

  for (const sr of rules) {
    const band = sr.severity;
    const base = {
      severityRuleId: sr.id,
      derivedSeverityBand: band,
      ...DRY,
    };

    const triggerRealities = sr.realitiesThatMayTrigger ?? [];
    const triggerClaims = sr.claimTypesThatMayTrigger ?? [];
    const hasR = triggerRealities.length > 0;
    const hasC = triggerClaims.length > 0;

    if (!hasR && !hasC) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_severity_rule_missing_anchors",
        confidence: 0,
        notes:
          "8.2C-11: SeverityRule declares neither realitiesThatMayTrigger nor claimTypesThatMayTrigger — cannot derive dry-run severity from structured signals.",
      });
      continue;
    }

    let supportingRealityIds: NamespacedRealityId[] | undefined;
    let supportingClaimIds: NamespacedClaimId[] | undefined;

    let blockedAnchor = false;
    for (const rt of triggerRealities) {
      const ra = realityByType.get(rt);
      if (ra?.disposition === "candidate_blocked" && ra.blockReason === "reality_blocked_by_matrix") {
        blockedAnchor = true;
        supportingRealityIds = [...(supportingRealityIds ?? []), namespacedReality(rt)];
      }
    }
    if (blockedAnchor) {
      out.push({
        ...base,
        disposition: "candidate_blocked",
        reason: "matrix_blocked_reality_blocks_severity_anchor",
        confidence: 1,
        ...(supportingRealityIds?.length ? { supportingRealityIds } : {}),
        notes:
          "8.2C-11: a trigger reality is matrix-blocked — candidate_derived forbidden; matrix-declared surface.",
      });
      continue;
    }

    let realityAnchorFail = false;
    const realityRows: RealityAuthorization[] = [];
    for (const rt of triggerRealities) {
      const ra = realityByType.get(rt);
      if (!ra || ra.disposition !== "candidate_supported") {
        realityAnchorFail = true;
        break;
      }
      realityRows.push(ra);
    }
    if (hasR && realityAnchorFail) {
      supportingRealityIds = triggerRealities.map(namespacedReality);
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_severity_reality_anchor_not_candidate_supported",
        confidence: 0,
        supportingRealityIds,
        notes:
          "8.2C-11: every trigger reality must be dry-run candidate_supported — structured anchor not satisfied.",
      });
      continue;
    }
    if (hasR) {
      supportingRealityIds = triggerRealities.map(namespacedReality);
    }

    let claimAnchorFail = false;
    const claimRows: ClaimAuthorization[] = [];
    for (const ct of triggerClaims) {
      const ca = claimByType.get(ct);
      if (!ca || ca.disposition !== "candidate_allowed") {
        claimAnchorFail = true;
        break;
      }
      claimRows.push(ca);
    }
    if (hasC && claimAnchorFail) {
      const blockedConflict = triggerClaims.some((ct) => claimByType.get(ct)?.disposition === "candidate_blocked");
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: blockedConflict
          ? "dry_run_blocked_claims_conflict_severity"
          : "dry_run_severity_claim_anchor_not_candidate_allowed",
        confidence: 0,
        supportingClaimIds: triggerClaims.map(namespacedClaim),
        notes:
          "8.2C-11: every trigger claim must be dry-run candidate_allowed — forbidden/blocked/uncertain claims forbid candidate_derived.",
      });
      continue;
    }
    if (hasC) {
      supportingClaimIds = triggerClaims.map(namespacedClaim);
    }

    if (severityBlockedWhenConflict(sr, realityByType, allowedClaimTypes)) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_severity_blocked_when_realities_conflict",
        confidence: 0,
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes:
          "8.2C-11: blockedWhenRealities + candidate_allowed overlap on this SeverityRule — do not force escalation.",
      });
      continue;
    }

    if (speculativeOnly) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "speculative_evidence_not_deriving_severity",
        confidence: 0,
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes: "8.2C-11: matched evidence is speculative-only — candidate_derived forbidden.",
      });
      continue;
    }

    const sets: Set<string>[] = [];
    if (hasC) sets.push(...satisfiedIdSets(claimRows));
    if (hasR) sets.push(...satisfiedIdSets(realityRows));
    const evidenceIdSet = intersectSets(sets);

    if (evidenceIdSet.size === 0) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_insufficient_evidence_bridge_for_severity",
        confidence: 0,
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes:
          "8.2C-11: no intersecting satisfied evidence rule ids across supporting dry-run anchors — candidate_derived forbidden.",
      });
      continue;
    }

    const supportingResults: RuleEvaluationResult[] = [];
    for (const id of evidenceIdSet) {
      const row = evidenceById.get(id);
      if (row) supportingResults.push(row);
    }
    if (supportingResults.length !== evidenceIdSet.size) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_severity_supporting_evidence_row_missing",
        confidence: 0,
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes:
          "8.2C-11: satisfiedRuleIds reference evidence rule ids not present in matched non-speculative resolution — conservative uncertain.",
      });
      continue;
    }

    const weakest = weakestEvidenceLevel(supportingResults);
    if (!evidenceMeetsMinimum(weakest, sr.minimumEvidenceLevel)) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "minimum_evidence_not_met_severity",
        confidence: 0,
        supportingEvidenceRuleIds: [...evidenceIdSet].sort(),
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes: "8.2C-11: supporting non-speculative evidence does not meet SeverityRule.minimumEvidenceLevel.",
      });
      continue;
    }

    const bridgeConfidence = minConfidence(supportingResults);
    const supportingEvidenceRuleIds = [...evidenceIdSet].sort();

    if (trapsConstrain) {
      out.push({
        ...base,
        disposition: "candidate_uncertain",
        reason: "dry_run_trap_governance_constrains_severity",
        confidence: 0,
        supportingEvidenceRuleIds,
        supportingTrapIds: governanceTrapIds,
        ...(supportingClaimIds ? { supportingClaimIds } : {}),
        ...(supportingRealityIds ? { supportingRealityIds } : {}),
        notes:
          "8.2C-11: trap dry-run candidate_triggered / candidate_uncertain present — severity must not strengthen; governance-only.",
      });
      continue;
    }

    out.push({
      ...base,
      disposition: "candidate_derived",
      reason: "dry_run_structured_support_present",
      confidence: bridgeConfidence,
      supportingEvidenceRuleIds,
      ...(supportingClaimIds ? { supportingClaimIds } : {}),
      ...(supportingRealityIds ? { supportingRealityIds } : {}),
      notes:
        "8.2C-11: structured dry-run anchors + non-speculative evidence bridge — trace-only; not runtime/UI/Smart Talk escalation.",
    });
  }

  return out;
}
