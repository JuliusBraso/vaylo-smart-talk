import type {
  ClaimAuthorization,
  NamespacedRealityId,
  RealityAuthorization,
  RuleEvaluationResult,
} from "../evidence-gates-types";
import type { ClaimType, EvidenceLevel, RealityType, UniversalDocumentRealityMatrix } from "../types";

const DRY_RUN_BASE = {
  dryRun: true as const,
  authorizationMode: "dry_run" as const,
  neverUserVisible: true as const,
};

const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  speculative: 1,
  contextual: 2,
  strongly_supported: 3,
  explicit: 4,
};

function namespacedReality(reality: RealityType): NamespacedRealityId {
  return `reality:${reality}` as NamespacedRealityId;
}

function candidateAllowedClaimTypes(authorizations: readonly ClaimAuthorization[]): ReadonlySet<ClaimType> {
  const s = new Set<ClaimType>();
  for (const a of authorizations) {
    if (a.disposition !== "candidate_allowed") continue;
    if (!a.namespaceId.startsWith("claim:")) continue;
    s.add(a.namespaceId.slice("claim:".length) as ClaimType);
  }
  return s;
}

function intersects(a: readonly ClaimType[] | undefined, b: ReadonlySet<ClaimType>): boolean {
  if (!a?.length) return false;
  return a.some((x) => b.has(x));
}

function matchedEvery<T>(xs: readonly T[], pred: (x: T) => boolean): boolean {
  return xs.length > 0 && xs.every(pred);
}

function isRealitySeverityBlockedWhenClaimsPresent(
  matrix: UniversalDocumentRealityMatrix,
  reality: RealityType,
  candidateAllowed: ReadonlySet<ClaimType>,
): boolean {
  if (candidateAllowed.size === 0) return false;
  for (const sr of matrix.severityRules) {
    const blocked = sr.blockedWhenRealities;
    if (!blocked?.includes(reality)) continue;
    const triggers = sr.claimTypesThatMayTrigger;
    if (!triggers?.length) continue;
    if (intersects(triggers, candidateAllowed)) return true;
  }
  return false;
}

function isRealityClaimAlignedViaSeverity(
  matrix: UniversalDocumentRealityMatrix,
  reality: RealityType,
  candidateAllowed: ReadonlySet<ClaimType>,
): boolean {
  if (candidateAllowed.size === 0) return true;
  for (const sr of matrix.severityRules) {
    const rt = sr.realitiesThatMayTrigger;
    if (!rt?.includes(reality)) continue;
    const triggers = sr.claimTypesThatMayTrigger;
    if (!triggers?.length) return true;
    if (intersects(triggers, candidateAllowed)) return true;
  }
  return false;
}

function evidenceRuleRowId(r: RuleEvaluationResult): string | undefined {
  return r.evidenceRuleId ?? r.ruleId;
}

function minConfidence(results: readonly RuleEvaluationResult[]): number {
  const vals = results
    .map((r) => r.confidence)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
  if (vals.length === 0) return 0;
  return Math.min(...vals);
}

function weakestEvidenceLevel(results: readonly RuleEvaluationResult[]): EvidenceLevel | undefined {
  let best: EvidenceLevel | undefined;
  let bestRank = 99;
  for (const r of results) {
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

export interface ResolveRealityAuthorizationsParams {
  readonly matrix: UniversalDocumentRealityMatrix;
  readonly evidenceRuleResults: readonly RuleEvaluationResult[];
  readonly claimAuthorizations: readonly ClaimAuthorization[];
}

/**
 * Reality authorization **dry-run** (8.2C-8): bounded procedural hypotheses only — not production
 * supported realities, not Smart Talk, not user-visible truth.
 *
 * Pure: no `documentText`, regex, cue inference, or trap/stabilizer engines.
 */
export function resolveRealityAuthorizations(
  params: ResolveRealityAuthorizationsParams,
): RealityAuthorization[] {
  const { matrix, evidenceRuleResults, claimAuthorizations } = params;
  const out: RealityAuthorization[] = [];
  const blockedSet = new Set(matrix.blockedRealities);
  const emitted = new Set<RealityType>();

  const candidateAllowed = candidateAllowedClaimTypes(claimAuthorizations);

  const matchedAny = evidenceRuleResults.filter((r) => r.matched);
  const matchedNonSpec = matchedAny.filter(
    (r) => r.evidenceLevel !== undefined && r.evidenceLevel !== "speculative",
  );
  const satisfiedIds = matchedNonSpec.map((r) => evidenceRuleRowId(r)).filter((id): id is string => !!id);
  const supportConfidence = minConfidence(matchedNonSpec);
  const supportEvidenceLevel = weakestEvidenceLevel(matchedNonSpec);

  for (const r of matrix.blockedRealities) {
    emitted.add(r);
    out.push({
      ...DRY_RUN_BASE,
      namespaceId: namespacedReality(r),
      disposition: "candidate_blocked",
      blockReason: "reality_blocked_by_matrix",
      dryRunReason: "reality_blocked_by_matrix",
      confidence: 1,
      notes: "8.2C-8 dry-run: matrix blockedRealities — authoritative no-assert surface (not production truth).",
    });
  }

  for (const r of matrix.supportedRealities) {
    if (emitted.has(r)) continue;
    emitted.add(r);

    if (blockedSet.has(r)) {
      out.push({
        ...DRY_RUN_BASE,
        namespaceId: namespacedReality(r),
        disposition: "candidate_blocked",
        blockReason: "reality_blocked_by_matrix",
        dryRunReason: "reality_blocked_by_matrix",
        confidence: 1,
        notes: "8.2C-8 dry-run: reality appears in blockedRealities — blocked wins over supported list.",
      });
      continue;
    }

    if (matchedNonSpec.length === 0) {
      if (matchedAny.length === 0) {
        out.push({
          ...DRY_RUN_BASE,
          namespaceId: namespacedReality(r),
          disposition: "candidate_uncertain",
          blockReason: "insufficient_evidence_level",
          dryRunReason: "dry_run_no_matched_non_speculative_evidence",
          confidence: 0,
          notes: "8.2C-8 dry-run: no matched evidence rules — reality remains a hypothesis only.",
        });
      } else {
        const allSpeculative = matchedEvery(
          matchedAny,
          (x) => x.evidenceLevel !== undefined && x.evidenceLevel === "speculative",
        );
        out.push({
          ...DRY_RUN_BASE,
          namespaceId: namespacedReality(r),
          disposition: "candidate_uncertain",
          blockReason: allSpeculative ? "speculative_evidence_not_authorizing" : "insufficient_evidence_level",
          dryRunReason: allSpeculative
            ? "speculative_evidence_not_authorizing_reality"
            : "dry_run_matched_evidence_insufficient_for_reality",
          confidence: 0,
          notes: allSpeculative
            ? "8.2C-8 dry-run: matched evidence is speculative-only — cannot candidate_supported."
            : "8.2C-8 dry-run: matched evidence lacks non-speculative evidenceLevel — cannot candidate_supported.",
        });
      }
      continue;
    }

    if (isRealitySeverityBlockedWhenClaimsPresent(matrix, r, candidateAllowed)) {
      out.push({
        ...DRY_RUN_BASE,
        namespaceId: namespacedReality(r),
        disposition: "candidate_uncertain",
        blockReason: "dry_run_severity_blocks_reality",
        dryRunReason: "dry_run_severity_contradiction",
        confidence: 0,
        satisfiedRuleIds: satisfiedIds,
        evidenceLevel: supportEvidenceLevel,
        notes: "8.2C-8 dry-run: SeverityRule blockedWhenRealities applies given candidate_allowed claims — not candidate_supported.",
      });
      continue;
    }

    if (!isRealityClaimAlignedViaSeverity(matrix, r, candidateAllowed)) {
      out.push({
        ...DRY_RUN_BASE,
        namespaceId: namespacedReality(r),
        disposition: "candidate_uncertain",
        blockReason: "dry_run_claim_reality_bridge_pending",
        dryRunReason: "dry_run_claims_present_reality_bridge_not_declared",
        confidence: 0,
        satisfiedRuleIds: satisfiedIds,
        evidenceLevel: supportEvidenceLevel,
        notes: "8.2C-8 dry-run: candidate_allowed claims exist but no severity bridge declares this reality for those claims — conservative uncertain.",
      });
      continue;
    }

    out.push({
      ...DRY_RUN_BASE,
      namespaceId: namespacedReality(r),
      disposition: "candidate_supported",
      dryRunReason: "dry_run_supporting_evidence_present",
      confidence: supportConfidence,
      evidenceLevel: supportEvidenceLevel,
      satisfiedRuleIds: satisfiedIds,
      notes:
        "8.2C-8 dry-run: non-speculative matched evidence + matrix/severity gates — NOT production supported reality or legal truth.",
    });
  }

  return out;
}
