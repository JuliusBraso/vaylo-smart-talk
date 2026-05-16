/**
 * Stable `GateAuditTrace.traceMetadata.stages` labels (Phase 8.2C-7).
 * Do not rename casually — tests and dashboards may depend on these strings.
 */
export const TRACE_STAGE_INPUT_RECEIVED = "input_received";
export const TRACE_STAGE_CUE_HITS_NORMALIZED = "cue_hits_normalized";
export const TRACE_STAGE_EVIDENCE_RULES_RESOLVED = "evidence_rules_resolved";
export const TRACE_STAGE_CLAIM_AUTHORIZATION_DRY_RUN = "claim_authorization_dry_run";
export const TRACE_STAGE_REALITY_AUTHORIZATION_DRY_RUN = "reality_authorization_dry_run";
export const TRACE_STAGE_TRAP_ACTIVATION_DRY_RUN = "trap_activation_dry_run";
export const TRACE_STAGE_STABILIZER_CANDIDATE_DRY_RUN = "stabilizer_candidate_dry_run";
export const TRACE_STAGE_SEVERITY_DERIVATION_DRY_RUN = "severity_derivation_dry_run";
export const TRACE_STAGE_PROXIMITY_SKELETON = "proximity_skeleton";
export const TRACE_STAGE_AUDIT_TRACE_BUILT = "audit_trace_built";
export const TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION = "skeleton_no_production_authorization";

/**
 * @deprecated Prefer {@link TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION}. Alias retained for imports.
 */
export const TRACE_STAGE_SKELETON_NO_RUNTIME = TRACE_STAGE_SKELETON_NO_PRODUCTION_AUTHORIZATION;
