/** Evidence Gate evaluator package version (skeleton). */
export const EVIDENCE_GATE_EVALUATOR_VERSION = "8.2c-10-stabilizer-dry-run-v1";

/** Skeleton does not emit numeric authorization confidence. */
export const DEFAULT_SKELETON_CONFIDENCE = 0;

/**
 * Default safety posture: no claim may be treated as production-authorized until
 * cue detection, lane binding, proximity, and matrix rule evaluation are implemented.
 */
export const SKELETON_SAFETY_POSTURE =
  "no_claim_authorization_without_full_gate_evaluation";

/**
 * Placeholder `RuleEvaluationRecord.evidenceRuleId` when no matrix evidence rules were evaluated —
 * must not be confused with a real matrix `EvidenceRule.id` or a trace stage label.
 */
export const SKELETON_AUDIT_RULE_EVALUATION_ID = "skeleton_no_evidence_rule_resolution_row";

export {
  TRACE_STAGE_AUDIT_TRACE_BUILT,
  TRACE_STAGE_CLAIM_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_CUE_HITS_NORMALIZED,
  TRACE_STAGE_EVIDENCE_RULES_RESOLVED,
  TRACE_STAGE_INPUT_RECEIVED,
  TRACE_STAGE_PROXIMITY_SKELETON,
  TRACE_STAGE_REALITY_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
  TRACE_STAGE_STABILIZER_CANDIDATE_DRY_RUN,
  TRACE_STAGE_TRAP_ACTIVATION_DRY_RUN,
} from "./trace-constants";
