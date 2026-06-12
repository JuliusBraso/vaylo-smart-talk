/**
 * Post-Execution Audit Types (Phase 8.2L-4).
 *
 * Defines the typed contract for the formal post-execution audit of the
 * guarded internal controlled pilot execution chain (8.2L-0 through 8.2L-3).
 *
 * This module does NOT:
 * - persist audit records
 * - store raw text, redacted text, model output, secrets, PII, or document content
 * - call any live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes or UI
 *
 * Safety invariants on PostExecutionAuditResult (all literal types):
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - readyForPhotoOcrRuntime: false
 * - readyForPaymentRuntime: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - secretStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByPostExecutionAudit: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Verdict ────────────────────────────────────────────────────────────────────

export type PostExecutionAuditVerdict = "closed_with_warnings" | "blocked";

// ── Layer IDs ──────────────────────────────────────────────────────────────────

export type PostExecutionAuditLayerId =
  | "phase_8_2l_0_execution_plan"
  | "phase_8_2l_1_operator_environment_verification_contract"
  | "phase_8_2l_2_single_run_execution_harness"
  | "phase_8_2l_3_manual_review_capture_model";

// ── Blockers ───────────────────────────────────────────────────────────────────

export type PostExecutionAuditBlocker =
  | "execution_plan_not_ready"
  | "operator_environment_verification_failed"
  | "single_run_execution_harness_failed"
  | "manual_review_capture_failed"
  | "post_execution_audit_side_effect_detected"
  | "raw_text_storage_detected"
  | "redacted_text_storage_detected"
  | "full_draft_text_storage_detected"
  | "model_output_storage_detected"
  | "secret_storage_detected"
  | "user_pii_storage_detected"
  | "document_content_storage_detected"
  | "persistence_detected"
  | "dna_save_detected"
  | "offline_save_detected"
  | "live_llm_detected"
  | "public_runtime_detected"
  | "user_visible_output_detected"
  | "api_route_modification_detected"
  | "http_call_detected";

// ── Open items ─────────────────────────────────────────────────────────────────

export type PostExecutionAuditOpenItem =
  | "real_operator_environment_not_executed"
  | "real_pilot_run_not_executed"
  | "live_llm_runtime_still_blocked"
  | "public_runtime_still_blocked"
  | "persistence_still_blocked"
  | "photo_ocr_runtime_still_blocked"
  | "payment_runtime_still_blocked"
  | "multilingual_runtime_still_blocked"
  | "production_monitoring_still_missing"
  | "production_abuse_controls_not_yet_finalized";

// ── Layer result ───────────────────────────────────────────────────────────────

export interface PostExecutionAuditLayerResult {
  readonly layerId: PostExecutionAuditLayerId;
  readonly present: boolean;
  readonly passed: boolean;
  readonly notes: readonly string[];
}

// ── Audit result ───────────────────────────────────────────────────────────────

/**
 * The complete post-execution audit result for the 8.2L chain.
 *
 * `readyForControlledPilotExecutionClosure` is the only readiness flag that
 * may be true. It signals that 8.2L-5 controlled pilot execution closure may
 * begin. It does NOT mean the pilot runs now or is public.
 *
 * All other readiness flags and safety invariants are literal types.
 */
export interface PostExecutionAuditResult {
  readonly auditId: "8.2L-4";
  readonly auditVersion: "post-execution-audit-v1";
  readonly verdict: PostExecutionAuditVerdict;

  readonly layerResults: readonly PostExecutionAuditLayerResult[];
  readonly blockers: readonly PostExecutionAuditBlocker[];
  readonly openItems: readonly PostExecutionAuditOpenItem[];

  readonly executionPlanPassed: boolean;
  readonly operatorEnvironmentVerificationPassed: boolean;
  readonly singleRunExecutionHarnessPassed: boolean;
  readonly manualReviewCaptureModelPassed: boolean;

  readonly readyForControlledPilotExecutionClosure: boolean;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly readyForPhotoOcrRuntime: false;
  readonly readyForPaymentRuntime: false;

  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly secretStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByPostExecutionAudit: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}
