/**
 * Evidence Gate evaluator skeleton (Phase 8.2C-1).
 * Pure functions — not wired to Smart Talk, OCR, or APIs.
 */

export {
  DEFAULT_SKELETON_CONFIDENCE,
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_AUDIT_RULE_EVALUATION_ID,
  SKELETON_SAFETY_POSTURE,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
} from "./constants";

export {
  TRACE_STAGE_AUDIT_TRACE_BUILT,
  TRACE_STAGE_CLAIM_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_CUE_HITS_NORMALIZED,
  TRACE_STAGE_EVIDENCE_RULES_RESOLVED,
  TRACE_STAGE_INPUT_RECEIVED,
  TRACE_STAGE_PROXIMITY_SKELETON,
  TRACE_STAGE_REALITY_AUTHORIZATION_DRY_RUN,
  TRACE_STAGE_SEVERITY_DERIVATION_DRY_RUN,
  TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION,
  TRACE_STAGE_STABILIZER_CANDIDATE_DRY_RUN,
  TRACE_STAGE_TRAP_ACTIVATION_DRY_RUN,
} from "./trace-constants";

export { buildGateAuditTrace } from "./build-audit-trace";
export { evaluateRuleExpression, terminalKey } from "./evaluate-rule-expression";
export { evaluateProximityConstraints } from "./evaluate-proximity-constraints";
export type { EvaluateProximityConstraintsParams } from "./evaluate-proximity-constraints";
export type {
  ProximityAnchorType,
  ProximityConstraint,
  ProximityEvaluationResult,
  ProximityObservation,
  ProximityRelationship,
} from "./proximity-types";
export { evaluateEvidenceGates } from "./evaluate-evidence-gates";
export { resolveEvidenceRules } from "./resolve-evidence-rules";
export { resolveClaimRules } from "./resolve-claim-rules";
export type { ResolveClaimRulesOutput, ResolveClaimRulesParams } from "./resolve-claim-rules";
export { resolveRealityAuthorizations } from "./resolve-reality-authorizations";
export type {
  ResolveRealityAuthorizationsParams,
} from "./resolve-reality-authorizations";
export { resolveTrapActivations } from "./resolve-trap-activations";
export type { ResolveTrapActivationsParams } from "./resolve-trap-activations";
export { resolveStabilizerCandidates } from "./resolve-stabilizer-candidates";
export type { ResolveStabilizerCandidatesParams } from "./resolve-stabilizer-candidates";
export { resolveSeverityDerivations } from "./resolve-severity-derivations";
export type { ResolveSeverityDerivationsParams } from "./resolve-severity-derivations";
