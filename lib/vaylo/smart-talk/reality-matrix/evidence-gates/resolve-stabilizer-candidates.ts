import type {
  ClaimAuthorization,
  NamespacedClaimId,
  NamespacedRealityId,
  RealityAuthorization,
  StabilizerCandidate,
  TrapActivation,
} from "../evidence-gates-types";
import type { UniversalDocumentRealityMatrix } from "../types";

const DRY_STABILIZER_BASE = {
  dryRun: true as const,
  neverUserVisible: true as const,
  authorizationMode: "dry_run" as const,
  sourceKind: "stabilizer" as const,
};

function dryRunStableStabilizerId(ruleId: string): string {
  return `dry_run_stabilizer:${ruleId}`;
}

function hasRiskTraps(traps: readonly TrapActivation[]): boolean {
  return traps.some((t) => t.disposition === "candidate_triggered" || t.disposition === "candidate_uncertain");
}

function riskTrapSupportingIds(traps: readonly TrapActivation[]): readonly string[] {
  return traps
    .filter((t) => t.disposition === "candidate_triggered" || t.disposition === "candidate_uncertain")
    .map((t) => t.trapId);
}

function riskTrapConfidence(traps: readonly TrapActivation[]): number {
  const risky = traps.filter((t) => t.disposition === "candidate_triggered" || t.disposition === "candidate_uncertain");
  const vals = risky
    .map((t) => t.confidence)
    .filter((c): c is number => typeof c === "number" && Number.isFinite(c));
  if (vals.length === 0) return 0.25;
  return Math.min(...vals);
}

function supportingCandidateAllowedClaims(rows: readonly ClaimAuthorization[]): readonly NamespacedClaimId[] {
  return rows.filter((c) => c.disposition === "candidate_allowed").map((c) => c.namespaceId);
}

function supportingCandidateSupportedRealities(rows: readonly RealityAuthorization[]): readonly NamespacedRealityId[] {
  return rows.filter((r) => r.disposition === "candidate_supported").map((r) => r.namespaceId);
}

export interface ResolveStabilizerCandidatesParams {
  readonly matrix: UniversalDocumentRealityMatrix;
  readonly claimAuthorizations: readonly ClaimAuthorization[];
  readonly realityAuthorizations: readonly RealityAuthorization[];
  readonly trapActivations: readonly TrapActivation[];
}

/**
 * Stabilizer **dry-run** candidates (8.2C-10): trace-only governance hints — **not** user-visible wording,
 * **not** Smart Talk output, **not** explanation rewrites, **not** runtime emission.
 *
 * Pure: no `documentText`, regex, OCR, or semantic parsing of matrix example strings.
 */
export function resolveStabilizerCandidates(params: ResolveStabilizerCandidatesParams): StabilizerCandidate[] {
  const { matrix, claimAuthorizations, realityAuthorizations, trapActivations } = params;

  if (matrix.stabilizers.length === 0) return [];
  if (matrix.blockedRealities.length === 0) return [];
  if (!hasRiskTraps(trapActivations)) return [];

  const overInterpretationRisk =
    claimAuthorizations.some((c) => c.disposition === "candidate_allowed") ||
    realityAuthorizations.some((r) => r.disposition === "candidate_supported");
  if (!overInterpretationRisk) return [];

  const trapIds = riskTrapSupportingIds(trapActivations);
  const conf = riskTrapConfidence(trapActivations);
  const claimIds = supportingCandidateAllowedClaims(claimAuthorizations);
  const realityIds = supportingCandidateSupportedRealities(realityAuthorizations);

  const out: StabilizerCandidate[] = [];
  for (const rule of matrix.stabilizers) {
    const sid = dryRunStableStabilizerId(rule.id);
    out.push({
      stabilizerRuleId: rule.id,
      stabilizerId: sid,
      rationale: `8.2C-10 dry-run stabilizer governance candidate; catalog rule id=${rule.id} — matrix example wordings are not emitted here.`,
      ...DRY_STABILIZER_BASE,
      reason: "dry_run_stabilizer_governance_bundle_met",
      confidence: conf,
      supportingTrapIds: trapIds,
      ...(claimIds.length > 0 ? { supportingClaimIds: claimIds } : {}),
      ...(realityIds.length > 0 ? { supportingRealityIds: realityIds } : {}),
      notes:
        "8.2C-10: Stabilizer candidate ≠ user message ≠ legal conclusion ≠ safety guarantee. Observability only.",
    });
  }

  return out;
}
