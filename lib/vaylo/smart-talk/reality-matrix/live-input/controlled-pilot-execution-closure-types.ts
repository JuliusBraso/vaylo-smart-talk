/**
 * Controlled Pilot Execution Closure Types (Phase 8.2L-5).
 *
 * Defines the typed contract for the formal closure audit of the 8.2L
 * Guarded Internal Controlled Pilot Execution epoch.
 *
 * This module does NOT:
 * - run a real pilot
 * - persist closure records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes or UI
 *
 * Safety invariants on ControlledPilotExecutionClosureResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - readyForPhotoOcrRuntime: false
 * - readyForFileUploadRuntime: false
 * - readyForPaymentRuntime: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - secretStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - realPilotRunExecuted: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByClosure: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Verdict ────────────────────────────────────────────────────────────────────

export type ControlledPilotExecutionClosureVerdict =
  | "closed_with_warnings"
  | "blocked";

// ── Layer IDs ──────────────────────────────────────────────────────────────────

export type ControlledPilotExecutionClosureLayerId =
  | "phase_8_2l_0_execution_plan"
  | "phase_8_2l_1_operator_environment_verification_contract"
  | "phase_8_2l_2_single_run_execution_harness"
  | "phase_8_2l_3_manual_review_capture_model"
  | "phase_8_2l_4_post_execution_audit";

// ── Blockers ───────────────────────────────────────────────────────────────────

export type ControlledPilotExecutionClosureBlocker =
  | "execution_plan_not_ready"
  | "operator_environment_verification_not_ready"
  | "single_run_execution_harness_not_ready"
  | "manual_review_capture_not_ready"
  | "post_execution_audit_not_ready"
  | "post_execution_audit_blocked"
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
  | "http_call_detected"
  | "real_pilot_execution_detected"
  | "closure_side_effect_detected";

// ── Open items ─────────────────────────────────────────────────────────────────

export type ControlledPilotExecutionClosureOpenItem =
  | "real_operator_environment_not_executed"
  | "real_pilot_run_not_executed"
  | "live_llm_runtime_still_blocked"
  | "public_runtime_still_blocked"
  | "persistence_still_blocked"
  | "photo_ocr_runtime_still_blocked"
  | "file_upload_runtime_still_blocked"
  | "payment_runtime_still_blocked"
  | "multilingual_runtime_still_blocked"
  | "production_monitoring_still_missing"
  | "production_abuse_controls_not_yet_finalized"
  | "real_user_pilot_policy_not_yet_defined"
  | "legal_disclaimer_runtime_not_yet_finalized"
  | "completeness_warning_runtime_not_yet_finalized";

// ── Layer result ───────────────────────────────────────────────────────────────

export interface ControlledPilotExecutionClosureLayerResult {
  readonly layerId: ControlledPilotExecutionClosureLayerId;
  readonly present: boolean;
  readonly passed: boolean;
  readonly notes: readonly string[];
}

// ── Closure result ─────────────────────────────────────────────────────────────

/**
 * The complete closure result for the 8.2L epoch.
 *
 * `readyForNextEpochPlanning` is the only readiness flag that may be true.
 * It signals that planning for the next epoch (e.g. 8.2M or equivalent) may
 * begin. It does NOT authorize a real operator pilot run, public launch,
 * live LLM, or persistence.
 *
 * All other readiness flags and all safety/content-storage invariants are
 * literal types that cannot be changed without a TypeScript compile error.
 */
export interface ControlledPilotExecutionClosureResult {
  readonly closureId: "8.2L-5";
  readonly closureVersion: "controlled-pilot-execution-closure-v1";
  readonly verdict: ControlledPilotExecutionClosureVerdict;

  readonly layerResults: readonly ControlledPilotExecutionClosureLayerResult[];
  readonly blockers: readonly ControlledPilotExecutionClosureBlocker[];
  readonly openItems: readonly ControlledPilotExecutionClosureOpenItem[];

  readonly executionPlanPassed: boolean;
  readonly operatorEnvironmentVerificationPassed: boolean;
  readonly singleRunExecutionHarnessPassed: boolean;
  readonly manualReviewCaptureModelPassed: boolean;
  readonly postExecutionAuditPassed: boolean;

  readonly readyForNextEpochPlanning: boolean;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly readyForPhotoOcrRuntime: false;
  readonly readyForFileUploadRuntime: false;
  readonly readyForPaymentRuntime: false;

  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly secretStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly realPilotRunExecuted: false;
  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByClosure: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}
