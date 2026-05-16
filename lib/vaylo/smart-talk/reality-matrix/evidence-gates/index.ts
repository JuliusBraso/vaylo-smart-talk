/**
 * Evidence Gate evaluator skeleton (Phase 8.2C-1).
 * Pure functions — not wired to Smart Talk, OCR, or APIs.
 */

export {
  DEFAULT_SKELETON_CONFIDENCE,
  EVIDENCE_GATE_EVALUATOR_VERSION,
  SKELETON_SAFETY_POSTURE,
  TRACE_STAGE_SKELETON_NO_RUNTIME,
} from "./constants";

export { buildGateAuditTrace } from "./build-audit-trace";
export { evaluateRuleExpression } from "./evaluate-rule-expression";
export { evaluateEvidenceGates } from "./evaluate-evidence-gates";
export { resolveEvidenceRules } from "./resolve-evidence-rules";
