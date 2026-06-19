/**
 * Types for Phase 8.3W — Additional Synthetic Live LLM Case Post-Call Governance Recheck.
 *
 * This phase is METADATA-ONLY POST-CALL GOVERNANCE RECHECK.
 * It does NOT:
 *   - Call OpenAI directly or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Inspect model output content
 *   - Reconstruct prompt text
 *   - Process real user input
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *
 * It verifies 8.3V execution metadata only for:
 *   `synthetic_explicit_payment_deadline`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckStatus =
  | "passed"
  | "blocked"
  | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckScope =
  | "post_call_governance_recheck"
  | "live_execution_metadata_verified"
  | "selected_synthetic_case_verified"
  | "provider_model_verified"
  | "exactly_one_call_verified"
  | "model_output_untrusted_verified"
  | "metadata_only_capture_verified"
  | "prompt_non_logging_verified"
  | "model_output_non_logging_verified"
  | "api_key_non_exposure_verified"
  | "no_model_output_content_inspection"
  | "no_prompt_text_reconstruction"
  | "no_direct_openai_call_in_recheck"
  | "no_real_input"
  | "no_raw_input"
  | "no_redacted_real_input"
  | "no_photo_ocr_file_input"
  | "no_public_request"
  | "no_branch_c"
  | "no_run_smart_talk"
  | "no_ocr_runtime"
  | "no_persistence"
  | "no_user_visible_output"
  | "no_public_runtime"
  | "no_general_live_llm_runtime"
  | "no_real_document_input";

// ── Provider / Model / Case ───────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceProvider = "openai";

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceModel = "gpt_4o_mini";

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceCaseId =
  "synthetic_explicit_payment_deadline";

// ── Findings ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceFinding =
  | "live_execution_completed"
  | "selected_case_matched"
  | "provider_model_matched"
  | "exactly_one_call_confirmed"
  | "api_key_value_not_exposed"
  | "prompt_text_not_exposed"
  | "model_output_received"
  | "model_output_marked_untrusted"
  | "model_output_not_exposed"
  | "metadata_only_capture_confirmed"
  | "post_call_governance_recheck_required_confirmed"
  | "post_call_audit_required_confirmed"
  | "synthetic_only_input_confirmed"
  | "real_input_absent"
  | "branch_c_absent"
  | "run_smart_talk_absent"
  | "ocr_runtime_absent"
  | "user_visible_output_absent"
  | "persistence_absent"
  | "public_runtime_absent"
  | "real_document_input_absent"
  | "dangerous_readiness_absent";

// ── Requirements ──────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceRequirement =
  | "require_live_execution_all_passed"
  | "require_selected_case_explicit_payment_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_live_llm_called_exactly_once"
  | "require_model_output_received"
  | "require_model_output_marked_untrusted"
  | "require_api_key_value_not_logged_or_returned"
  | "require_prompt_text_not_logged_stored_returned"
  | "require_model_output_not_logged_stored_returned"
  | "require_metadata_only_capture"
  | "require_post_call_governance_recheck_required"
  | "require_post_call_audit_required"
  | "require_synthetic_input_only"
  | "require_no_real_input"
  | "require_no_ocr_photo_file_input"
  | "require_runtime_isolation"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_general_live_llm_runtime"
  | "require_no_real_document_input"
  | "require_no_model_output_content_inspection"
  | "require_no_prompt_reconstruction";

// ── Blockers ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceBlocker =
  | "live_execution_not_ready"
  | "live_execution_not_passed"
  | "selected_case_mismatch"
  | "provider_mismatch"
  | "model_mismatch"
  | "no_live_call_detected"
  | "multiple_live_calls_detected"
  | "model_output_not_received"
  | "model_output_not_untrusted"
  | "api_key_value_exposed"
  | "prompt_text_exposed"
  | "model_output_exposed"
  | "metadata_only_capture_missing"
  | "post_call_governance_recheck_requirement_missing"
  | "post_call_audit_requirement_missing"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized"
  | "model_output_content_inspection_detected"
  | "prompt_reconstruction_detected"
  | "direct_openai_call_detected_in_recheck";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceChecklistItem =
  | "live_execution_result_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "exactly_one_call_reviewed"
  | "api_key_non_exposure_reviewed"
  | "prompt_non_exposure_reviewed"
  | "model_output_untrusted_reviewed"
  | "model_output_non_exposure_reviewed"
  | "metadata_only_capture_reviewed"
  | "post_call_governance_requirement_reviewed"
  | "post_call_audit_requirement_reviewed"
  | "synthetic_input_only_reviewed"
  | "no_real_input_reviewed"
  | "no_ocr_photo_file_reviewed"
  | "runtime_isolation_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_general_live_llm_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "no_model_output_content_inspection_reviewed"
  | "no_prompt_reconstruction_reviewed"
  | "next_phase_post_call_audit_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePostCallGovernanceRejectionReason =
  | "live_execution_not_ready"
  | "live_execution_not_passed"
  | "missing_recheck_scope"
  | "missing_finding"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "live_llm_not_called"
  | "live_llm_not_called_exactly_once"
  | "model_output_not_received"
  | "model_output_not_untrusted"
  | "api_key_value_logged"
  | "api_key_value_returned"
  | "prompt_text_logged"
  | "prompt_text_stored"
  | "prompt_text_returned"
  | "model_output_logged"
  | "model_output_stored"
  | "model_output_returned"
  | "metadata_only_capture_missing"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
  | "synthetic_input_only_missing"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "user_visible_output_detected"
  | "persistence_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized"
  | "model_output_content_inspection_detected"
  | "prompt_reconstruction_detected"
  | "direct_openai_call_detected_in_recheck"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_recheck_note_detected";

// ── Input ─────────────────────────────────────────────────────────────────────

export interface AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput {
  readonly recheckId: string;
  readonly epochId: "8.3W";
  readonly previousPhaseId: "8.3V";

  readonly liveExecutionReadyForPostCallGovernanceRecheck: boolean;
  readonly liveExecutionAllPassed: boolean;

  readonly selectedCase: AdditionalSyntheticLiveLlmCasePostCallGovernanceCaseId;
  readonly provider: AdditionalSyntheticLiveLlmCasePostCallGovernanceProvider;
  readonly model: AdditionalSyntheticLiveLlmCasePostCallGovernanceModel;

  readonly scopes: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckScope[];
  readonly findings: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceFinding[];
  readonly requirements: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceRequirement[];
  readonly blockers: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceBlocker[];
  readonly checklistConfirmed: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceChecklistItem[];

  readonly postCallGovernanceRecheckOnly: true;
  readonly metadataOnlyRecheck: true;
  readonly modelOutputContentInspected: false;
  readonly promptTextReconstructed: false;
  readonly directOpenAiCallMadeByRecheck: false;
  readonly liveLLMCalledAgainByRecheck: false;

  readonly liveLLMCalled: true;
  readonly liveLLMCalledExactlyOnce: true;
  readonly modelOutputReceived: true;
  readonly modelOutputMarkedUntrusted: true;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptTextAvailableForRecheck: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForRecheck: false;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly additionalSyntheticCasePostCallGovernanceRecheckPassed: boolean;
  readonly readyForAdditionalSyntheticLiveLlmCasePostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

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
  readonly userVisibleOutputAuthorizedByRecheck: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorPostCallGovernanceRecheckAcknowledgment: string;
  readonly reviewerPostCallGovernanceRecheckAcknowledgment: string;
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

// ── Result ────────────────────────────────────────────────────────────────────

export interface AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckResult {
  readonly recheckId: string;
  readonly epochId: "8.3W";
  readonly status: AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceRejectionReason[];

  readonly safeRecheckMetadata: {
    readonly selectedCase: AdditionalSyntheticLiveLlmCasePostCallGovernanceCaseId;
    readonly provider: AdditionalSyntheticLiveLlmCasePostCallGovernanceProvider;
    readonly model: AdditionalSyntheticLiveLlmCasePostCallGovernanceModel;
    readonly scopeCount: number;
    readonly findingCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly metadataOnlyRecheck: true;
    readonly liveLLMCalledExactlyOnce: true;
    readonly modelOutputMarkedUntrusted: true;
    readonly modelOutputContentInspected: false;
    readonly promptTextReconstructed: false;
  };

  readonly additionalSyntheticCasePostCallGovernanceRecheckPassed: boolean;
  readonly readyForAdditionalSyntheticLiveLlmCasePostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly postCallGovernanceRecheckOnly: true;
  readonly metadataOnlyRecheck: true;
  readonly modelOutputContentInspected: false;
  readonly promptTextReconstructed: false;
  readonly directOpenAiCallMadeByRecheck: false;
  readonly liveLLMCalledAgainByRecheck: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptTextAvailableForRecheck: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForRecheck: false;
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
  readonly userVisibleOutputAuthorizedByRecheck: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteCalledByRecheck: false;
  readonly apiRouteModifiedByRecheck: false;
  readonly existingRuntimeModifiedByRecheck: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByRecheck: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckCheckResult {
  readonly checkId: "8.3W";
  readonly allPassed: boolean;
  readonly liveExecutionReadyForPostCallGovernanceRecheck: boolean;
  readonly additionalSyntheticCasePostCallGovernanceRecheckPassed: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCasePostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly postCallGovernanceRecheckOnly: true;
  readonly metadataOnlyRecheck: true;
  readonly modelOutputContentInspected: false;
  readonly promptTextReconstructed: false;
  readonly directOpenAiCallMadeByRecheck: false;
  readonly liveLLMCalledAgainByRecheck: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptTextAvailableForRecheck: false;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputAvailableForRecheck: false;
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
  readonly userVisibleOutputAuthorizedByRecheck: false;

  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_SCOPES: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckScope[] =
  [
    "post_call_governance_recheck",
    "live_execution_metadata_verified",
    "selected_synthetic_case_verified",
    "provider_model_verified",
    "exactly_one_call_verified",
    "model_output_untrusted_verified",
    "metadata_only_capture_verified",
    "prompt_non_logging_verified",
    "model_output_non_logging_verified",
    "api_key_non_exposure_verified",
    "no_model_output_content_inspection",
    "no_prompt_text_reconstruction",
    "no_direct_openai_call_in_recheck",
    "no_real_input",
    "no_raw_input",
    "no_redacted_real_input",
    "no_photo_ocr_file_input",
    "no_public_request",
    "no_branch_c",
    "no_run_smart_talk",
    "no_ocr_runtime",
    "no_persistence",
    "no_user_visible_output",
    "no_public_runtime",
    "no_general_live_llm_runtime",
    "no_real_document_input",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_FINDINGS: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceFinding[] =
  [
    "live_execution_completed",
    "selected_case_matched",
    "provider_model_matched",
    "exactly_one_call_confirmed",
    "api_key_value_not_exposed",
    "prompt_text_not_exposed",
    "model_output_received",
    "model_output_marked_untrusted",
    "model_output_not_exposed",
    "metadata_only_capture_confirmed",
    "post_call_governance_recheck_required_confirmed",
    "post_call_audit_required_confirmed",
    "synthetic_only_input_confirmed",
    "real_input_absent",
    "branch_c_absent",
    "run_smart_talk_absent",
    "ocr_runtime_absent",
    "user_visible_output_absent",
    "persistence_absent",
    "public_runtime_absent",
    "real_document_input_absent",
    "dangerous_readiness_absent",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_REQUIREMENTS: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceRequirement[] =
  [
    "require_live_execution_all_passed",
    "require_selected_case_explicit_payment_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_live_llm_called_exactly_once",
    "require_model_output_received",
    "require_model_output_marked_untrusted",
    "require_api_key_value_not_logged_or_returned",
    "require_prompt_text_not_logged_stored_returned",
    "require_model_output_not_logged_stored_returned",
    "require_metadata_only_capture",
    "require_post_call_governance_recheck_required",
    "require_post_call_audit_required",
    "require_synthetic_input_only",
    "require_no_real_input",
    "require_no_ocr_photo_file_input",
    "require_runtime_isolation",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_no_general_live_llm_runtime",
    "require_no_real_document_input",
    "require_no_model_output_content_inspection",
    "require_no_prompt_reconstruction",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_BLOCKERS: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceBlocker[] =
  [
    "live_execution_not_ready",
    "live_execution_not_passed",
    "selected_case_mismatch",
    "provider_mismatch",
    "model_mismatch",
    "no_live_call_detected",
    "multiple_live_calls_detected",
    "model_output_not_received",
    "model_output_not_untrusted",
    "api_key_value_exposed",
    "prompt_text_exposed",
    "model_output_exposed",
    "metadata_only_capture_missing",
    "post_call_governance_recheck_requirement_missing",
    "post_call_audit_requirement_missing",
    "real_input_detected",
    "raw_input_detected",
    "redacted_real_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "user_visible_output_detected",
    "persistence_detected",
    "public_runtime_detected",
    "general_live_llm_runtime_authorized",
    "real_document_input_authorized",
    "model_output_content_inspection_detected",
    "prompt_reconstruction_detected",
    "direct_openai_call_detected_in_recheck",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_CHECKLIST: readonly AdditionalSyntheticLiveLlmCasePostCallGovernanceChecklistItem[] =
  [
    "live_execution_result_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "exactly_one_call_reviewed",
    "api_key_non_exposure_reviewed",
    "prompt_non_exposure_reviewed",
    "model_output_untrusted_reviewed",
    "model_output_non_exposure_reviewed",
    "metadata_only_capture_reviewed",
    "post_call_governance_requirement_reviewed",
    "post_call_audit_requirement_reviewed",
    "synthetic_input_only_reviewed",
    "no_real_input_reviewed",
    "no_ocr_photo_file_reviewed",
    "runtime_isolation_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_general_live_llm_runtime_reviewed",
    "no_real_document_input_reviewed",
    "no_model_output_content_inspection_reviewed",
    "no_prompt_reconstruction_reviewed",
    "next_phase_post_call_audit_required",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase performs metadata-only post-call governance recheck.",
    "I acknowledge that model output content is not inspected, logged, returned, displayed, or persisted.",
    "I acknowledge that prompt text is not reconstructed, logged, returned, displayed, or persisted.",
    "I acknowledge that no direct OpenAI call is made by this recheck phase.",
    "I acknowledge that real documents, public runtime, persistence, and user-visible output remain blocked.",
  ] as const;

export const FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_STRINGS: readonly string[] =
  [
    // Inherited from 8.3V (106)
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
    "real payment document processed",
    "real invoice processed",
    "real Mahnung processed",
    "payment model output returned",
    "payment output displayed",
    "public payment runtime enabled",
    "real payment user visible",
    "payment execution persisted",
    "production payment runtime enabled",
    // New in 8.3W (8)
    "payment model output inspected",
    "payment prompt reconstructed",
    "payment answer approved for user",
    "real payment document rechecked",
    "public payment runtime rechecked",
    "payment output ready for display",
    "production payment recheck passed",
    "real document payment governance passed",
  ] as const;
