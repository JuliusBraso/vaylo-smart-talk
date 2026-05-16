import type {
  ClaimAuthorization,
  EvidenceGateDecision,
  EvidenceGateInput,
  NamespacedClaimId,
  NamespacedRealityId,
  RealityAuthorization,
  RuleEvaluationRecord,
} from "../evidence-gates-types";

import { buildGateAuditTrace } from "./build-audit-trace";
import {
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_SAFETY_POSTURE,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
} from "./constants";

function namespacedClaim(claimType: string): NamespacedClaimId {
  return `claim:${claimType}` as NamespacedClaimId;
}

function namespacedReality(reality: string): NamespacedRealityId {
  return `reality:${reality}` as NamespacedRealityId;
}

/**
 * Evidence Gate evaluator entry point (8.2C-1 **skeleton**).
 *
 * **Conservative default:** no claim is `allowed`. Matrix `allowedClaims` are surfaced only as
 * `uncertain` for traceability — not authorization. No regex, no proximity, no deadline math.
 */
export function evaluateEvidenceGates(input: EvidenceGateInput): EvidenceGateDecision {
  const matrixMismatchFlag =
    !!input.matrix &&
    (input.matrix.documentType !== input.matrixDocumentType ||
      input.matrix.schemaVersion !== input.matrixSchemaVersion);

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
        notes:
          "Skeleton: claim not authorized — full cue/lane/proximity pipeline not implemented (EVIDENCE_GATES_SPEC.md).",
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

  const ruleEvaluations: RuleEvaluationRecord[] = [
    {
      evidenceRuleId: TRACE_STAGE_SKELETON_NO_RUNTIME,
      outcome: "uncertain",
      subexpressionNotes: `Evaluator ${EVIDENCE_GATE_EVALUATOR_VERSION}: ${SKELETON_SAFETY_POSTURE}`,
    },
  ];

  const trace = buildGateAuditTrace({
    input,
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
    ],
    notes: [
      "Production authorization is INACTIVE.",
      "Cue hits in input are recorded but not used to allow claims.",
      matrixMismatchFlag
        ? "WARNING: input.matrix documentType/schemaVersion does not match flat fields on EvidenceGateInput."
        : "Matrix snapshot optional; when absent, only flat matrixDocumentType/matrixSchemaVersion are traced.",
    ],
  });

  return { input, trace };
}
