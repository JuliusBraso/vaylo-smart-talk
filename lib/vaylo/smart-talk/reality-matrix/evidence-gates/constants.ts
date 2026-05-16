/** Evidence Gate evaluator package version (skeleton). */
export const EVIDENCE_GATE_EVALUATOR_VERSION = "8.2c-4-evidence-rules-v1";

/** Skeleton does not emit numeric authorization confidence. */
export const DEFAULT_SKELETON_CONFIDENCE = 0;

/**
 * Default safety posture: no claim may be treated as production-authorized until
 * cue detection, lane binding, proximity, and matrix rule evaluation are implemented.
 */
export const SKELETON_SAFETY_POSTURE =
  "no_claim_authorization_without_full_gate_evaluation";

/** Audit / trace stage id when no rule pipeline has run. */
export const TRACE_STAGE_SKELETON_NO_RUNTIME = "skeleton_no_runtime_authorization";
