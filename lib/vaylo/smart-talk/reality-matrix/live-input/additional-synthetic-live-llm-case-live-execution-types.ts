/**
 * Additional Synthetic Live LLM Case Live Execution Types (Phase 8.3V).
 *
 * Defines the typed live execution layer for one additional synthetic case:
 * `synthetic_explicit_payment_deadline`. This phase MAY perform exactly one
 * live LLM call if OPENAI_API_KEY is present; if missing, execution is
 * blocked safely without fake success.
 *
 * Key invariants (literal types):
 *   - `killSwitchArmedBeforeCall: true`
 *   - `killSwitchDisarmedAfterCall: true`
 *   - `singleCallCounterBefore: 0`
 *   - `singleCallCounterAfter: 1`
 *   - `callCount: 1`
 *   - `apiKeyPresenceChecked: true`
 *   - `apiKeyValueLogged: false`
 *   - `apiKeyValueReturned: false`
 *   - `promptConstructedInMemoryOnly: true`
 *   - `promptTextLogged: false`
 *   - `promptTextStored: false`
 *   - `promptTextReturned: false`
 *   - `liveLLMCallPerformed: true`
 *   - `modelOutputReceived: true`
 *   - `modelOutputMarkedUntrusted: true`
 *   - `modelOutputLogged: false`
 *   - `modelOutputStored: false`
 *   - `modelOutputReturned: false`
 *   - `metadataOnlyCaptured: true`
 *   - `postCallGovernanceRecheckRequired: true`
 *   - `postCallAuditRequired: true`
 *   - All dangerous readiness flags: `false`
 *   - `neverUserVisible: true`
 *
 * Positive gates produced (only when `accepted`):
 *   - `readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck: true`
 *   - `readyForAdditionalSyntheticLiveLlmCasePostCallAudit: true`
 *
 * Status:
 *   - "executed" — all invariants pass; one live call performed
 *   - "blocked"  — dry-run authorization not ready, API key missing, or call safely skipped
 *   - "rejected" — at least one unsafe invariant violated
 *
 * Builds on Phase 8.3U (Additional Synthetic Live LLM Case Dry-Run Authorization).
 *
 * ISOLATION NOTE:
 *   Branch C / run-smart-talk.ts / extract-text-from-image.ts remain `false`.
 *   No real input, public runtime, persistence, or user-visible output.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionStatus =
  | "executed"
  | "blocked"
  | "rejected";

// ── Provider / Model / Case / Mode ────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionProvider = "openai";
export type AdditionalSyntheticLiveLlmCaseLiveExecutionModel = "gpt_4o_mini";
export type AdditionalSyntheticLiveLlmCaseLiveExecutionCaseId =
  "synthetic_explicit_payment_deadline";
export type AdditionalSyntheticLiveLlmCaseLiveExecutionMode =
  "one_synthetic_payment_deadline_live_call";

// ── Execution steps ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionStep =
  | "dry_run_authorization_verified"
  | "selected_case_verified"
  | "provider_verified"
  | "model_verified"
  | "kill_switch_verified_armed"
  | "single_call_counter_verified_zero_before_call"
  | "api_key_presence_checked_without_value_logging"
  | "synthetic_payment_prompt_constructed_in_memory_only"
  | "prompt_text_not_logged"
  | "prompt_text_not_stored"
  | "live_llm_call_performed_once"
  | "model_output_received_untrusted"
  | "model_output_not_logged"
  | "model_output_not_stored"
  | "metadata_only_captured"
  | "single_call_counter_verified_one_after_call"
  | "kill_switch_disarmed_after_call"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "real_document_input_blocked"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required";

// ── Metadata fields ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionMetadataField =
  | "execution_id"
  | "authorization_id"
  | "selected_case_id"
  | "provider_id"
  | "model_id"
  | "execution_mode"
  | "api_key_presence_confirmed"
  | "api_key_value_logged_false"
  | "api_key_value_returned_false"
  | "prompt_text_logged_false"
  | "prompt_text_stored_false"
  | "prompt_text_returned_false"
  | "model_output_received_boolean"
  | "model_output_marked_untrusted"
  | "model_output_logged_false"
  | "model_output_stored_false"
  | "model_output_returned_false"
  | "call_count"
  | "counter_before"
  | "counter_after"
  | "kill_switch_before"
  | "kill_switch_after"
  | "metadata_only_capture"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "real_document_input_blocked";

// ── Expected observations ─────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionExpectedObservation =
  | "payment_amount_identified_as_document_stated"
  | "payment_deadline_identified_as_document_stated"
  | "no_additional_deadline_invented"
  | "legal_certainty_not_claimed"
  | "coercive_payment_language_avoided"
  | "consequence_uncertainty_preserved"
  | "complete_document_check_recommended"
  | "model_output_marked_untrusted"
  | "governance_recheck_required"
  | "post_call_audit_required"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "real_document_input_blocked";

// ── Execution blockers ────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionBlocker =
  | "dry_run_authorization_not_ready"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "kill_switch_not_armed"
  | "single_call_counter_not_zero"
  | "api_key_missing"
  | "api_key_value_exposure_detected"
  | "prompt_logging_detected"
  | "prompt_storage_detected"
  | "model_output_logging_detected"
  | "model_output_storage_detected"
  | "more_than_one_call_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "user_visible_output_attempted"
  | "persistence_attempted"
  | "public_runtime_attempted"
  | "real_document_input_attempted"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionChecklistItem =
  | "dry_run_authorization_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "kill_switch_armed_reviewed"
  | "single_call_counter_zero_reviewed"
  | "api_key_presence_check_reviewed"
  | "synthetic_prompt_in_memory_only_reviewed"
  | "prompt_not_logged_reviewed"
  | "prompt_not_stored_reviewed"
  | "one_call_limit_reviewed"
  | "model_output_untrusted_reviewed"
  | "model_output_not_logged_reviewed"
  | "model_output_not_stored_reviewed"
  | "metadata_only_capture_reviewed"
  | "counter_after_call_reviewed"
  | "kill_switch_disarm_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "no_real_input_reviewed"
  | "no_real_document_input_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseLiveExecutionRejectionReason =
  | "dry_run_authorization_not_ready"
  | "selected_case_invalid"
  | "invalid_provider"
  | "invalid_model"
  | "invalid_execution_mode"
  | "missing_execution_step"
  | "missing_metadata_field"
  | "missing_expected_observation"
  | "missing_execution_blocker"
  | "missing_checklist_item"
  | "kill_switch_not_armed"
  | "single_call_counter_not_zero_before_call"
  | "single_call_counter_not_one_after_call"
  | "api_key_missing"
  | "api_key_value_logged"
  | "api_key_value_returned"
  | "prompt_text_logged"
  | "prompt_text_stored"
  | "prompt_text_returned"
  | "model_output_logged"
  | "model_output_stored"
  | "model_output_returned"
  | "more_than_one_call_attempted"
  | "live_call_not_completed"
  | "model_output_not_received"
  | "model_output_not_untrusted"
  | "metadata_only_capture_missing"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "user_visible_output_attempted"
  | "persistence_attempted"
  | "public_runtime_attempted"
  | "real_document_input_attempted"
  | "real_operator_pilot_attempted"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_execution_note_detected";

// ── Live execution input ──────────────────────────────────────────────────────

/**
 * Input for the Additional Synthetic Live LLM Case Live Execution validation.
 *
 * New literal invariants vs Phase 8.3U:
 * - `killSwitchArmedBeforeCall: true`
 * - `killSwitchDisarmedAfterCall: true`
 * - `singleCallCounterBefore: 0`
 * - `singleCallCounterAfter: 1`
 * - `callCount: 1`
 * - `liveLLMCallPerformed: true`
 * - `modelOutputReceived: true`
 * - `modelOutputMarkedUntrusted: true`
 * - `metadataOnlyCaptured: true`
 * - `promptConstructedInMemoryOnly: true`
 */
export interface AdditionalSyntheticLiveLlmCaseLiveExecutionInput {
  readonly executionId: string;
  readonly epochId: "8.3V";
  readonly previousPhaseId: "8.3U";

  readonly dryRunAuthorizationReadyForLiveExecution: boolean;

  readonly selectedCase: AdditionalSyntheticLiveLlmCaseLiveExecutionCaseId;
  readonly provider: AdditionalSyntheticLiveLlmCaseLiveExecutionProvider;
  readonly model: AdditionalSyntheticLiveLlmCaseLiveExecutionModel;
  readonly executionMode: AdditionalSyntheticLiveLlmCaseLiveExecutionMode;

  readonly executionSteps: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionStep[];
  readonly metadataFields: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionMetadataField[];
  readonly expectedObservations: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionExpectedObservation[];
  readonly executionBlockers: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionBlocker[];
  readonly checklistConfirmed: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionChecklistItem[];

  readonly killSwitchArmedBeforeCall: true;
  readonly killSwitchDisarmedAfterCall: true;
  readonly singleCallCounterBefore: 0;
  readonly singleCallCounterAfter: 1;
  readonly callCount: 1;

  readonly apiKeyPresenceChecked: true;
  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly liveLLMCallPerformed: true;
  readonly modelOutputReceived: true;
  readonly modelOutputMarkedUntrusted: true;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;
  readonly realDocumentInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorLiveExecutionAcknowledgment: string;
  readonly reviewerLiveExecutionAcknowledgment: string;
  readonly notes: readonly string[];

  readonly containsRealUserInput: false;
  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsSecret: false;
  readonly containsEnvValue: false;
  readonly containsApiKey: false;
  readonly containsUserPii: false;
  readonly containsDocumentContent: false;

  readonly neverUserVisible: true;
}

// ── Live execution result ─────────────────────────────────────────────────────

export interface AdditionalSyntheticLiveLlmCaseLiveExecutionResult {
  readonly executionId: string;
  readonly epochId: "8.3V";
  readonly status: AdditionalSyntheticLiveLlmCaseLiveExecutionStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionRejectionReason[];

  readonly safeExecutionMetadata: {
    readonly selectedCase: AdditionalSyntheticLiveLlmCaseLiveExecutionCaseId;
    readonly provider: AdditionalSyntheticLiveLlmCaseLiveExecutionProvider;
    readonly model: AdditionalSyntheticLiveLlmCaseLiveExecutionModel;
    readonly executionMode: AdditionalSyntheticLiveLlmCaseLiveExecutionMode;
    readonly callCount: 1;
    readonly singleCallCounterBefore: 0;
    readonly singleCallCounterAfter: 1;
    readonly killSwitchArmedBeforeCall: true;
    readonly killSwitchDisarmedAfterCall: true;
    readonly apiKeyPresenceConfirmed: boolean;
    readonly modelOutputMarkedUntrusted: boolean;
    readonly metadataOnlyCaptured: boolean;
    readonly executionStepCount: number;
    readonly metadataFieldCount: number;
    readonly expectedObservationCount: number;
    readonly executionBlockerCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck: boolean;
  readonly readyForAdditionalSyntheticLiveLlmCasePostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;
  readonly realDocumentInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByExecution: false;
  readonly existingRuntimeModifiedByExecution: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByExecution: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface AdditionalSyntheticLiveLlmCaseLiveExecutionCheckResult {
  readonly checkId: "8.3V";
  readonly allPassed: boolean;
  readonly dryRunAuthorizationReadyForLiveExecution: boolean;
  readonly additionalSyntheticLiveLlmCaseLiveExecutionAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck: boolean;
  readonly readyForAdditionalSyntheticLiveLlmCasePostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;
  readonly realDocumentInputAllowed: false;

  readonly branchCDependencyAllowed: false;
  readonly runSmartTalkDependencyAllowed: false;
  readonly ocrRuntimeDependencyAllowed: false;

  readonly branchCCalled: false;
  readonly runSmartTalkCalledOrImported: false;
  readonly extractTextFromImageCalledOrImported: false;

  readonly userVisibleOutputEmitted: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_STEPS: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionStep[] =
  [
    "dry_run_authorization_verified",
    "selected_case_verified",
    "provider_verified",
    "model_verified",
    "kill_switch_verified_armed",
    "single_call_counter_verified_zero_before_call",
    "api_key_presence_checked_without_value_logging",
    "synthetic_payment_prompt_constructed_in_memory_only",
    "prompt_text_not_logged",
    "prompt_text_not_stored",
    "live_llm_call_performed_once",
    "model_output_received_untrusted",
    "model_output_not_logged",
    "model_output_not_stored",
    "metadata_only_captured",
    "single_call_counter_verified_one_after_call",
    "kill_switch_disarmed_after_call",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "real_document_input_blocked",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_METADATA_FIELDS: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionMetadataField[] =
  [
    "execution_id",
    "authorization_id",
    "selected_case_id",
    "provider_id",
    "model_id",
    "execution_mode",
    "api_key_presence_confirmed",
    "api_key_value_logged_false",
    "api_key_value_returned_false",
    "prompt_text_logged_false",
    "prompt_text_stored_false",
    "prompt_text_returned_false",
    "model_output_received_boolean",
    "model_output_marked_untrusted",
    "model_output_logged_false",
    "model_output_stored_false",
    "model_output_returned_false",
    "call_count",
    "counter_before",
    "counter_after",
    "kill_switch_before",
    "kill_switch_after",
    "metadata_only_capture",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "real_document_input_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_EXPECTED_OBSERVATIONS: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionExpectedObservation[] =
  [
    "payment_amount_identified_as_document_stated",
    "payment_deadline_identified_as_document_stated",
    "no_additional_deadline_invented",
    "legal_certainty_not_claimed",
    "coercive_payment_language_avoided",
    "consequence_uncertainty_preserved",
    "complete_document_check_recommended",
    "model_output_marked_untrusted",
    "governance_recheck_required",
    "post_call_audit_required",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "real_document_input_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_BLOCKERS: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionBlocker[] =
  [
    "dry_run_authorization_not_ready",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "kill_switch_not_armed",
    "single_call_counter_not_zero",
    "api_key_missing",
    "api_key_value_exposure_detected",
    "prompt_logging_detected",
    "prompt_storage_detected",
    "model_output_logging_detected",
    "model_output_storage_detected",
    "more_than_one_call_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "real_input_detected",
    "raw_input_detected",
    "real_redacted_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "user_visible_output_attempted",
    "persistence_attempted",
    "public_runtime_attempted",
    "real_document_input_attempted",
    "post_call_governance_recheck_missing",
    "post_call_audit_missing",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_CHECKLIST: readonly AdditionalSyntheticLiveLlmCaseLiveExecutionChecklistItem[] =
  [
    "dry_run_authorization_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "kill_switch_armed_reviewed",
    "single_call_counter_zero_reviewed",
    "api_key_presence_check_reviewed",
    "synthetic_prompt_in_memory_only_reviewed",
    "prompt_not_logged_reviewed",
    "prompt_not_stored_reviewed",
    "one_call_limit_reviewed",
    "model_output_untrusted_reviewed",
    "model_output_not_logged_reviewed",
    "model_output_not_stored_reviewed",
    "metadata_only_capture_reviewed",
    "counter_after_call_reviewed",
    "kill_switch_disarm_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "no_real_input_reviewed",
    "no_real_document_input_reviewed",
    "existing_runtime_isolation_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase performs exactly one synthetic live LLM call.",
    "I acknowledge that the selected case is synthetic_explicit_payment_deadline only.",
    "I acknowledge that no real input, OCR, files, public requests, Branch C, run-smart-talk.ts, persistence, or user-visible output are allowed.",
    "I acknowledge that prompt text and model output must not be logged, returned, displayed, or persisted.",
    "I acknowledge that model output is untrusted and requires governance recheck plus audit.",
  ] as const;

export const FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_LIVE_EXECUTION_STRINGS: readonly string[] =
  [
    // Inherited from 8.3U (97)
    "sk-",
    "OPENAI_API_KEY=",
    "VAYLO_INTERNAL_RUNTIME_SECRET=",
    "process.env.OPENAI_API_KEY",
    "apiKey:",
    "Authorization: Bearer",
    "rawInputText",
    "redactedText",
    "fullDraftText",
    "modelOutput",
    "stored user input",
    "stored redacted text",
    "stored model output",
    "IBAN",
    "Steuer-ID",
    "Aktenzeichen",
    "Sehr geehrter",
    "BG-Nr",
    "john@example.com",
    "+49 170 1234567",
    "Name:",
    "Adresse:",
    "Geburtsdatum:",
    "Kind:",
    "Mietvertrag",
    "Kündigung",
    "Abschiebung",
    "Sie müssen",
    "garantiert",
    "fristlos sicher",
    "rechtlich sicher",
    "approved for user display",
    "auto-approved",
    "show to user now",
    "public launch enabled",
    "all outputs authorized",
    "global approval",
    "branch c authorized",
    "real user document",
    "real OCR text",
    "production runtime enabled",
    "harness executed with live llm",
    "live llm executed",
    "real operator pilot executed",
    "real model output",
    "post-run audit stored output",
    "live llm now authorized",
    "multiple live llm calls authorized",
    "general live llm runtime authorized",
    "model output returned to user",
    "stored prompt",
    "stored completion",
    "prompt text logged",
    "model output logged",
    "authorized public runtime",
    "model output reviewed",
    "prompt reviewed",
    "second live llm call",
    "real user output approved",
    "audit persisted",
    "public runtime ready",
    "real input pilot ready",
    "user visible output ready",
    "real document input ready",
    "additional live calls executed",
    "synthetic outputs approved for users",
    "production live runtime ready",
    "real payment notice",
    "real invoice",
    "real Mahnung",
    "IBAN:",
    "Zahlungspflicht sicher",
    "you must pay",
    "payment legally required",
    "public payment runtime ready",
    "real document payment test ready",
    "payment execution live now",
    "synthetic payment call executed",
    "payment prompt constructed",
    "payment model output",
    "real payment notice ready",
    "real invoice ready",
    "public payment explanation ready",
    "payment output user visible",
    "real document payment runtime",
    "payment live execution authorized globally",
    "payment live call executed",
    "payment prompt available",
    "payment model output available",
    "real payment document authorized",
    "real invoice authorized",
    "public payment runtime authorized",
    "user-visible payment output authorized",
    "payment production runtime ready",
    // New in 8.3V (9)
    "real payment document processed",
    "real invoice processed",
    "real Mahnung processed",
    "payment model output returned",
    "payment output displayed",
    "public payment runtime enabled",
    "real payment user visible",
    "payment execution persisted",
    "production payment runtime enabled",
  ] as const;
