import type {
  ClaimAuthorization,
  EvidenceGateDecision,
  EvidenceGateInput,
  NamespacedClaimId,
  NamespacedRealityId,
  RealityAuthorization,
  RuleEvaluationRecord,
  RuleEvaluationResult,
} from "../evidence-gates-types";

import { buildGateAuditTrace } from "./build-audit-trace";
import {
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_AUDIT_RULE_EVALUATION_ID,
  SKELETON_SAFETY_POSTURE,
} from "./constants";
import { normalizeCueHits } from "./normalize-cue-hits";
import { resolveClaimRules } from "./resolve-claim-rules";
import { resolveEvidenceRules } from "./resolve-evidence-rules";

function namespacedClaim(claimType: string): NamespacedClaimId {
  return `claim:${claimType}` as NamespacedClaimId;
}

function namespacedReality(reality: string): NamespacedRealityId {
  return `reality:${reality}` as NamespacedRealityId;
}

function ruleResolutionToRecord(r: RuleEvaluationResult): RuleEvaluationRecord {
  const missing = r.missingRequiredCueIds?.length ? `; missing=${r.missingRequiredCueIds.join(",")}` : "";
  const id = r.evidenceRuleId ?? r.ruleId;
  return {
    evidenceRuleId: id ?? "unknown_evidence_rule",
    outcome: r.matched ? "pass" : "fail",
    contributingHitIndices: r.contributingCueHitIndices,
    subexpressionNotes: `${r.reason}${missing}`,
  };
}

/**
 * Evidence Gate evaluator entry point (8.2C-1 skeleton through **8.2C-5 claim dry-run**).
 *
 * **Production posture:** `trace.claimDecisions` still carries matrix `allowedClaims` as **`uncertain`**
 * only (never `allowed`). **`trace.dryRunClaimAuthorizations`** holds `candidate_*` + `dryRun: true`
 * — audit-only, not Smart Talk or user-visible authorization.
 */
export function evaluateEvidenceGates(input: EvidenceGateInput): EvidenceGateDecision {
  const normalizedCueHits = normalizeCueHits(input.cueHits);

  const matrixMismatchFlag =
    !!input.matrix &&
    (input.matrix.documentType !== input.matrixDocumentType ||
      input.matrix.schemaVersion !== input.matrixSchemaVersion);

  const evidenceRuleResolutionResults =
    input.matrix && input.matrix.evidenceRules.length > 0
      ? resolveEvidenceRules({ rules: input.matrix.evidenceRules, cueHits: normalizedCueHits })
      : undefined;

  const ruleEvaluations: RuleEvaluationRecord[] =
    evidenceRuleResolutionResults !== undefined && evidenceRuleResolutionResults.length > 0
      ? evidenceRuleResolutionResults.map(ruleResolutionToRecord)
      : [
          {
            evidenceRuleId: SKELETON_AUDIT_RULE_EVALUATION_ID,
            outcome: "uncertain",
            subexpressionNotes: `Evaluator ${EVIDENCE_GATE_EVALUATOR_VERSION}: ${SKELETON_SAFETY_POSTURE}`,
          },
        ];

  const dryRunOutcome =
    input.matrix && input.matrix.allowedClaims.length > 0
      ? resolveClaimRules({
          claimRules: input.matrix.allowedClaims,
          evidenceRuleResults: evidenceRuleResolutionResults ?? [],
          forbiddenClaimTypes: input.matrix.forbiddenClaims,
        })
      : undefined;

  const dryRunClaimAuthorizations = dryRunOutcome?.authorizations;
  const dryRunClaimUnsupported = dryRunOutcome?.unsupportedFeatures ?? [];

  const uncertainClaimNotes = dryRunClaimAuthorizations?.some((r) => r.disposition === "candidate_allowed")
    ? "Skeleton: production claim not authorized — dry-run shows candidate_allowed in trace only (8.2C-5); Smart Talk / user-visible claims remain inactive."
    : evidenceRuleResolutionResults !== undefined && evidenceRuleResolutionResults.some((r) => r.matched)
      ? "Skeleton: claim not authorized — at least one evidence rule matched in trace (8.2C-4), but claim authorization / OR paths / proximity remain inactive (EVIDENCE_GATES_SPEC.md)."
      : "Skeleton: claim not authorized — full cue/lane/proximity pipeline for claim authorization not implemented (EVIDENCE_GATES_SPEC.md).";

  const uncertainClaims: ClaimAuthorization[] = [];
  const seenTypes = new Set<string>();
  if (input.matrix) {
    for (const row of input.matrix.allowedClaims) {
      if (!row.allowed) continue;
      if (seenTypes.has(row.claimType)) continue;
      seenTypes.add(row.claimType);
      uncertainClaims.push({
        namespaceId: namespacedClaim(row.claimType),
        disposition: "uncertain",
        blockReason: "skeleton_no_runtime_authorization",
        notes: uncertainClaimNotes,
      });
    }
  }

  const blockedRealityRows: RealityAuthorization[] = [];
  if (input.matrix) {
    for (const r of input.matrix.blockedRealities) {
      blockedRealityRows.push({
        namespaceId: namespacedReality(r),
        disposition: "blocked",
        blockReason: "matrix_blocked_surface",
        notes: "Matrix declares this reality must not be asserted for this document class.",
      });
    }
  }

  const trace = buildGateAuditTrace({
    input,
    normalizedCueHits,
    evidenceRuleResolutionResults,
    dryRunClaimAuthorizations,
    claimDecisions: uncertainClaims,
    realityDecisions: blockedRealityRows,
    ruleEvaluations,
    traps: [],
    stabilizerCandidates: [],
    severity: {
      band: "none",
      derivedFromRuleIds: [],
    },
    matrixMismatchFlag: matrixMismatchFlag || undefined,
    unsupportedFeatures: [
      "cue_detection",
      "lane_binding",
      "proximity_windows",
      "forbidden_claim_resolution",
      "trap_engine",
      "severity_precedence_engine",
      "claim_authorization_from_cue_hits",
      "claim_authorization_from_matched_evidence_rules",
      "or_within_single_evidence_rule_not_supported",
      "claim_authorization_dry_run_v1_not_production",
      ...dryRunClaimUnsupported,
    ],
    notes: [
      "Production authorization is INACTIVE.",
      `Cue hits (8.2C-3): ${normalizedCueHits.length} normalized; trace lists structural fields only — never used to allow claims.`,
      evidenceRuleResolutionResults !== undefined
        ? `Evidence rules (8.2C-4): ${evidenceRuleResolutionResults.length} evaluated; pass/fail is observational only — claims remain uncertain.`
        : input.matrix && input.matrix.evidenceRules.length === 0
          ? "Evidence rules (8.2C-4): matrix declares no evidence rules — resolution skipped."
          : "Evidence rules (8.2C-4): skipped — no matrix snapshot on input.",
      dryRunClaimAuthorizations !== undefined
        ? `Claim dry-run (8.2C-5): ${dryRunClaimAuthorizations.length} ClaimRule rows evaluated — candidate_* rows are trace-only, not production.`
        : "Claim dry-run (8.2C-5): skipped — no ClaimRule rows on matrix.",
      matrixMismatchFlag
        ? "WARNING: input.matrix documentType/schemaVersion does not match flat fields on EvidenceGateInput."
        : "Matrix snapshot optional; when absent, only flat matrixDocumentType/matrixSchemaVersion are traced.",
    ],
  });

  return { input, trace };
}
