import type {
  ClaimAuthorization,
  NamespacedClaimId,
  NamespacedRealityId,
  RealityAuthorization,
  RuleEvaluationResult,
  TrapActivation,
} from "../evidence-gates-types";
import type { ClaimType, HallucinationTrap, RealityType, UniversalDocumentRealityMatrix } from "../types";

const DRY_TRAP_BASE = {
  dryRun: true as const,
  neverUserVisible: true as const,
  authorizationMode: "dry_run" as const,
  sourceKind: "hallucination_trap" as const,
};

/**
 * Payment / escalation reality types used only as a **structural** anchor for enforcement-cluster traps.
 * No document text — aligns with matrix `supportedRealities` vocabulary only.
 */
const ESCALATION_PAYMENT_REALITY_ANCHORS = new Set<RealityType>([
  "reminder_notice",
  "overdue_payment_notice",
  "repeated_payment_request",
  "payment_deadline_present",
  "payment_followup_notice",
  "possible_late_fee_notice",
  "escalation_warning_present",
  "final_reminder_notice",
  "payment_due",
]);

/**
 * Trap `kind` values that require an escalation/payment reality anchor when `relatedClaimTypes`
 * overlaps `candidate_allowed` (conservative dry-run bridge).
 */
const ENFORCEMENT_CLUSTER_TRAP_KINDS = new Set<string>([
  "invoice_to_enforcement",
  "mahnung_to_vollstreckung",
  "mahnung_to_gerichtsvollzieher",
  "payment_reminder_to_account_seizure",
  "generic_escalation_to_legal_disaster",
  "letzte_mahnung_to_active_enforcement",
  "weitere_schritte_to_forced_collection",
  "overdue_payment_to_eviction",
  "overdue_payment_to_salary_garnishment",
  "late_fee_to_criminal_case",
  "steuerbescheid_to_enforcement",
  "rechtsbehelfsbelehrung_to_active_threat",
]);

function isEnforcementClusterTrap(trap: HallucinationTrap): boolean {
  if (trap.relatedClaimTypes?.includes("enforcement_risk")) return true;
  return ENFORCEMENT_CLUSTER_TRAP_KINDS.has(trap.kind);
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

function supportingEvidenceRuleIds(rows: readonly RuleEvaluationResult[]): readonly string[] {
  const out: string[] = [];
  for (const r of rows) {
    const id = evidenceRuleRowId(r);
    if (id) out.push(id);
  }
  return out;
}

function minConfidence(rows: readonly RuleEvaluationResult[]): number {
  const vals = rows
    .map((r) => r.confidence)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
  if (vals.length === 0) return 0;
  return Math.min(...vals);
}

function candidateAllowedClaimMap(
  authorizations: readonly ClaimAuthorization[],
): ReadonlyMap<ClaimType, NamespacedClaimId> {
  const m = new Map<ClaimType, NamespacedClaimId>();
  for (const a of authorizations) {
    if (a.disposition !== "candidate_allowed") continue;
    if (!a.namespaceId.startsWith("claim:")) continue;
    const ct = a.namespaceId.slice("claim:".length) as ClaimType;
    m.set(ct, a.namespaceId);
  }
  return m;
}

function supportedRealityTypeSet(authorizations: readonly RealityAuthorization[]): ReadonlySet<RealityType> {
  const s = new Set<RealityType>();
  for (const r of authorizations) {
    if (r.disposition !== "candidate_supported") continue;
    if (!r.namespaceId.startsWith("reality:")) continue;
    s.add(r.namespaceId.slice("reality:".length) as RealityType);
  }
  return s;
}

function escalationRealityNamespaces(
  authorizations: readonly RealityAuthorization[],
): readonly NamespacedRealityId[] {
  return authorizations
    .filter((r) => r.disposition === "candidate_supported")
    .filter((r) => {
      if (!r.namespaceId.startsWith("reality:")) return false;
      const rt = r.namespaceId.slice("reality:".length) as RealityType;
      return ESCALATION_PAYMENT_REALITY_ANCHORS.has(rt);
    })
    .map((r) => r.namespaceId);
}

function trapRow(
  trap: HallucinationTrap,
  disposition: TrapActivation["disposition"],
  reason: string,
  confidence: number,
  extras: Partial<TrapActivation> = {},
): TrapActivation {
  return {
    trapId: trap.id,
    trapKind: trap.kind,
    disposition,
    rationale: `8.2C-9 dry-run trap governance: ${reason} (trapId=${trap.id}).`,
    ...DRY_TRAP_BASE,
    ...extras,
    reason,
    confidence,
  };
}

export interface ResolveTrapActivationsParams {
  readonly matrix: UniversalDocumentRealityMatrix;
  readonly evidenceRuleResults: readonly RuleEvaluationResult[];
  readonly claimAuthorizations: readonly ClaimAuthorization[];
  readonly realityAuthorizations: readonly RealityAuthorization[];
}

/**
 * Hallucination trap **dry-run** activations (8.2C-9): observability only — no runtime suppression,
 * no Smart Talk wiring, no `documentText` / regex / OCR, no explanation rewriting.
 *
 * Uses only matrix trap declarations, matched evidence rule rows, and prior **dry-run** claim/reality
 * candidates (`candidate_*`).
 */
export function resolveTrapActivations(params: ResolveTrapActivationsParams): TrapActivation[] {
  const { matrix, evidenceRuleResults, claimAuthorizations, realityAuthorizations } = params;
  const out: TrapActivation[] = [];

  const claimByType = candidateAllowedClaimMap(claimAuthorizations);
  const candidateAllowedTypes = new Set(claimByType.keys());
  const supportedRealityTypes = supportedRealityTypeSet(realityAuthorizations);
  const escalationRealityNs = escalationRealityNamespaces(realityAuthorizations);

  const nonSpec = matchedNonSpeculative(evidenceRuleResults);
  const anyMatched = hasAnyMatchedEvidence(evidenceRuleResults);
  const supportRuleIds = supportingEvidenceRuleIds(nonSpec);
  const supportConf = minConfidence(nonSpec);

  for (const trap of matrix.hallucinationTraps) {
    const related = trap.relatedClaimTypes ?? [];
    if (related.length === 0) {
      out.push(
        trapRow(trap, "candidate_not_triggered", "dry_run_trap_no_related_claim_types", 0, {
          notes: "8.2C-9: trap declares no relatedClaimTypes — dry-run activation skipped (structural inert).",
        }),
      );
      continue;
    }

    const overlapTypes = related.filter((ct) => candidateAllowedTypes.has(ct));
    if (overlapTypes.length === 0) {
      out.push(
        trapRow(trap, "candidate_not_triggered", "dry_run_no_overlapping_candidate_claims", 0, {
          notes: "8.2C-9: no candidate_allowed claims intersect trap.relatedClaimTypes.",
        }),
      );
      continue;
    }

    const supportingClaimIds = overlapTypes.map((ct) => claimByType.get(ct)!).filter(Boolean);

    if (!anyMatched) {
      out.push(
        trapRow(trap, "candidate_uncertain", "dry_run_no_evidence_anchor", 0, {
          supportingClaimIds,
          notes: "8.2C-9: claim overlap without any matched evidence rules — cannot candidate_triggered.",
        }),
      );
      continue;
    }

    if (nonSpec.length === 0) {
      out.push(
        trapRow(trap, "candidate_uncertain", "speculative_evidence_not_triggering_trap", 0, {
          supportingClaimIds,
          notes: "8.2C-9: no non-speculative matched evidence — mandatory uncertain, not candidate_triggered.",
        }),
      );
      continue;
    }

    if (isEnforcementClusterTrap(trap)) {
      const hasRealityAnchor = [...ESCALATION_PAYMENT_REALITY_ANCHORS].some((rt) => supportedRealityTypes.has(rt));
      if (!hasRealityAnchor) {
        out.push(
          trapRow(trap, "candidate_uncertain", "dry_run_trap_enforcement_cluster_without_reality_anchor", 0, {
            supportingClaimIds,
            supportingEvidenceRuleIds: supportRuleIds,
            reason: "dry_run_trap_enforcement_cluster_without_reality_anchor",
            notes:
              "8.2C-9: enforcement-cluster trap with claim overlap + non-speculative evidence but no supported escalation/payment reality candidate — conservative uncertain.",
          }),
        );
        continue;
      }

      out.push(
        trapRow(trap, "candidate_triggered", "dry_run_claim_reality_pattern_detected", supportConf, {
          supportingClaimIds,
          supportingRealityIds: escalationRealityNs.length > 0 ? escalationRealityNs : undefined,
          supportingEvidenceRuleIds: supportRuleIds,
          notes:
            "8.2C-9: enforcement-cluster trap — dry_run_claim_reality_pattern_detected — NOT runtime suppression.",
        }),
      );
      continue;
    }

    out.push(
      trapRow(trap, "candidate_triggered", "dry_run_related_claim_with_evidence_signal", supportConf, {
        supportingClaimIds,
        supportingEvidenceRuleIds: supportRuleIds,
        notes:
          "8.2C-9: relatedClaimTypes overlap with candidate_allowed + non-speculative matched evidence — governance signal only.",
      }),
    );
  }

  return out;
}
