import type {
  ClaimAuthorization,
  EvidenceGateInput,
  GateAuditTrace,
  RealityAuthorization,
  RuleEvaluationRecord,
  SeverityCandidate,
  StabilizerCandidate,
  TrapActivation,
} from "../evidence-gates-types";

import {
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_SAFETY_POSTURE,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
} from "./constants";

export interface BuildGateAuditTraceParams {
  readonly input: EvidenceGateInput;
  readonly claimDecisions: readonly ClaimAuthorization[];
  readonly realityDecisions: readonly RealityAuthorization[];
  readonly ruleEvaluations: readonly RuleEvaluationRecord[];
  readonly traps: readonly TrapActivation[];
  readonly stabilizerCandidates: readonly StabilizerCandidate[];
  readonly severity: SeverityCandidate;
  readonly matrixMismatchFlag?: boolean;
  readonly unsupportedFeatures: readonly string[];
  readonly notes: readonly string[];
}

/**
 * Assembles a `GateAuditTrace` for the evaluator skeleton.
 * Every evaluation path must produce a trace — even when all authorizations are empty.
 */
export function buildGateAuditTrace(params: BuildGateAuditTraceParams): GateAuditTrace {
  return {
    matrixDocumentType: params.input.matrixDocumentType,
    matrixSchemaVersion: params.input.matrixSchemaVersion,
    matrixMismatchFlag: params.matrixMismatchFlag,
    cueHits: params.input.cueHits,
    ruleEvaluations: params.ruleEvaluations,
    claimDecisions: params.claimDecisions,
    realityDecisions: params.realityDecisions,
    traps: params.traps,
    stabilizerCandidates: params.stabilizerCandidates,
    severity: params.severity,
    traceMetadata: {
      evaluatorVersion: EVIDENCE_GATE_EVALUATOR_VERSION,
      stages: [
        "input_validation",
        TRACE_STAGE_SKELETON_NO_RUNTIME,
        "audit_trace_assembled",
      ],
      safetyPosture: SKELETON_SAFETY_POSTURE,
      unsupportedFeatures: params.unsupportedFeatures,
      notes: params.notes,
    },
  };
}
