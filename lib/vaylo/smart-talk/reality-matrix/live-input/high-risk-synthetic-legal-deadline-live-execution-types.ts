/**
 * Types for Phase 8.3AC — High-Risk Synthetic Legal Deadline Live Execution.
 *
 * This phase executes EXACTLY ONE synthetic live LLM call for:
 *   `synthetic_high_risk_widerspruch_deadline`
 *
 * The call is permitted only when:
 *   - 8.3AB dry-run authorization passed
 *   - Kill switch (HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_ENABLED = "true") is active
 *   - OPENAI_API_KEY is present
 *   - Single-call counter is 0
 *
 * This phase does NOT:
 *   - Use real user input (OCR / photo / file / document)
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Log, store, or return prompt text or model output
 *   - Authorize exact deadline calculation, delivery-date invention, legal certainty,
 *     or coercive legal instructions
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public runtime
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionStatus =
  | "accepted"
  | "blocked"
  | "rejected";

// ── Case / provider / model / apiModel / sourceKind ───────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionCaseId =
  "synthetic_high_risk_widerspruch_deadline";

export type HighRiskSyntheticLegalDeadlineLiveExecutionProvider = "openai";

export type HighRiskSyntheticLegalDeadlineLiveExecutionModel = "gpt_4o_mini";

export type HighRiskSyntheticLegalDeadlineLiveExecutionApiModel = "gpt-4o-mini";

export type HighRiskSyntheticLegalDeadlineLiveExecutionSourceKind =
  "synthetic_high_risk_legal_deadline_never_user_visible";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionScope =
  | "live_execution"
  | "dry_run_authorization_verified"
  | "high_risk_synthetic_case"
  | "legal_deadline_case"
  | "widerspruch_deadline_case"
  | "delivery_date_dependency_case"
  | "exactly_one_live_call"
  | "kill_switch_enforced"
  | "single_call_counter_enforced"
  | "metadata_only_capture"
  | "model_output_untrusted"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
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
  | "no_real_document_input"
  | "no_legal_advice_output"
  | "no_exact_deadline_calculation";

// ── Requirements ──────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionRequirement =
  | "require_8_3ab_dry_run_authorization_passed"
  | "require_selected_case_high_risk_widerspruch_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_api_model_gpt_4o_mini"
  | "require_source_kind_never_user_visible"
  | "require_kill_switch_enabled"
  | "require_api_key_present"
  | "require_call_count_before_zero"
  | "require_call_count_after_one"
  | "require_exactly_one_live_call"
  | "require_metadata_only_capture"
  | "require_model_output_untrusted"
  | "require_prompt_not_logged_stored_returned"
  | "require_model_output_not_logged_stored_returned"
  | "require_api_key_not_logged_returned"
  | "require_future_governance_recheck"
  | "require_future_post_call_audit"
  | "require_no_exact_deadline_without_delivery_date"
  | "require_no_delivery_date_invention"
  | "require_no_final_date_invention"
  | "require_no_legal_certainty"
  | "require_no_deadline_invention"
  | "require_no_coercive_instruction"
  | "require_no_real_input"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_real_document_input"
  | "require_technical_debt_tracking";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionBlocker =
  | "dry_run_authorization_not_ready"
  | "dry_run_authorization_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "kill_switch_missing_or_disabled"
  | "api_key_missing"
  | "call_count_before_not_zero"
  | "call_count_after_not_one"
  | "no_live_call_detected"
  | "multiple_live_calls_detected"
  | "metadata_only_capture_missing"
  | "model_output_not_received"
  | "model_output_not_untrusted"
  | "prompt_text_logged"
  | "prompt_text_stored"
  | "prompt_text_returned"
  | "model_output_logged"
  | "model_output_stored"
  | "model_output_returned"
  | "api_key_value_logged"
  | "api_key_value_returned"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
  | "exact_deadline_authorized_without_delivery_date"
  | "delivery_date_invention_authorized"
  | "final_date_invention_authorized"
  | "legal_certainty_authorized"
  | "coercive_legal_instruction_authorized"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "persistence_detected"
  | "user_visible_output_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized"
  | "technical_debt_not_tracked";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionChecklistItem =
  | "dry_run_authorization_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "api_model_reviewed"
  | "source_kind_reviewed"
  | "kill_switch_reviewed"
  | "api_key_presence_reviewed_without_exposure"
  | "single_call_counter_reviewed"
  | "exactly_one_live_call_reviewed"
  | "metadata_only_capture_reviewed"
  | "model_output_untrusted_reviewed"
  | "prompt_non_exposure_reviewed"
  | "model_output_non_exposure_reviewed"
  | "api_key_non_exposure_reviewed"
  | "post_call_governance_recheck_required_reviewed"
  | "post_call_audit_required_reviewed"
  | "no_exact_deadline_without_delivery_date_reviewed"
  | "no_delivery_date_invention_reviewed"
  | "no_final_date_invention_reviewed"
  | "no_legal_certainty_reviewed"
  | "no_coercive_instruction_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "technical_debt_reviewed"
  | "next_phase_post_call_governance_recheck_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineLiveExecutionRejectionReason =
  | "dry_run_authorization_not_ready"
  | "dry_run_authorization_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "kill_switch_missing_or_disabled"
  | "api_key_missing"
  | "call_count_before_not_zero"
  | "call_count_after_not_one"
  | "no_live_call_detected"
  | "multiple_live_calls_detected"
  | "metadata_only_capture_missing"
  | "model_output_not_received"
  | "model_output_not_untrusted"
  | "prompt_text_logged"
  | "prompt_text_stored"
  | "prompt_text_returned"
  | "model_output_logged"
  | "model_output_stored"
  | "model_output_returned"
  | "api_key_value_logged"
  | "api_key_value_returned"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
  | "exact_deadline_authorized_without_delivery_date"
  | "delivery_date_invention_authorized"
  | "final_date_invention_authorized"
  | "legal_certainty_authorized"
  | "coercive_legal_instruction_authorized"
  | "real_input_detected"
  | "raw_input_detected"
  | "redacted_real_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "persistence_detected"
  | "user_visible_output_detected"
  | "public_runtime_detected"
  | "general_live_llm_runtime_authorized"
  | "real_document_input_authorized"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_live_execution_note_detected"
  | "technical_debt_not_tracked";

// ── Input ─────────────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineLiveExecutionInput {
  readonly liveExecutionId: string;
  readonly epochId: "8.3AC";
  readonly previousPhaseId: "8.3AB";

  readonly dryRunAuthorizationReadyForLiveExecution: boolean;
  readonly dryRunAuthorizationAllPassed: boolean;

  readonly selectedCase: HighRiskSyntheticLegalDeadlineLiveExecutionCaseId;
  readonly provider: HighRiskSyntheticLegalDeadlineLiveExecutionProvider;
  readonly model: HighRiskSyntheticLegalDeadlineLiveExecutionModel;
  readonly apiModel: HighRiskSyntheticLegalDeadlineLiveExecutionApiModel;
  readonly sourceKind: HighRiskSyntheticLegalDeadlineLiveExecutionSourceKind;

  readonly scopes: readonly HighRiskSyntheticLegalDeadlineLiveExecutionScope[];
  readonly requirements: readonly HighRiskSyntheticLegalDeadlineLiveExecutionRequirement[];
  readonly blockers: readonly HighRiskSyntheticLegalDeadlineLiveExecutionBlocker[];
  readonly checklistConfirmed: readonly HighRiskSyntheticLegalDeadlineLiveExecutionChecklistItem[];

  readonly killSwitchPresent: boolean;
  readonly killSwitchEnabled: boolean;
  readonly apiKeyPresent: boolean;

  readonly callCountBefore: number;
  readonly callCountAfter: number;
  readonly liveLLMCallPerformed: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;

  readonly promptConstructedInMemoryOnly: boolean;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputContentInspected: false;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;
  readonly modelOutputAvailableInResult: false;

  readonly metadataOnlyCaptured: boolean;

  readonly liveExecutionOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly metadataOnlyFutureCaptureRequired: true;
  readonly futureModelOutputMustBeMarkedUntrusted: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

  readonly highRiskSyntheticLegalDeadlineLiveExecutionAccepted: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallAudit: false;

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
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly broadEslintDebtTracked: true;
  readonly postCallCachedMetadataDebtTracked: true;
  readonly technicalDebtNotes: readonly string[];

  readonly operatorHighRiskLiveExecutionAcknowledgment: string;
  readonly reviewerHighRiskLiveExecutionAcknowledgment: string;
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

export interface HighRiskSyntheticLegalDeadlineLiveExecutionResult {
  readonly liveExecutionId: string;
  readonly epochId: "8.3AC";
  readonly status: HighRiskSyntheticLegalDeadlineLiveExecutionStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly HighRiskSyntheticLegalDeadlineLiveExecutionRejectionReason[];

  readonly safeLiveExecutionMetadata: {
    readonly selectedCase: HighRiskSyntheticLegalDeadlineLiveExecutionCaseId;
    readonly provider: HighRiskSyntheticLegalDeadlineLiveExecutionProvider;
    readonly model: HighRiskSyntheticLegalDeadlineLiveExecutionModel;
    readonly apiModel: HighRiskSyntheticLegalDeadlineLiveExecutionApiModel;
    readonly sourceKind: HighRiskSyntheticLegalDeadlineLiveExecutionSourceKind;
    readonly scopeCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly killSwitchPresent: boolean;
    readonly killSwitchEnabled: boolean;
    readonly apiKeyPresent: boolean;
    readonly callCountBefore: number;
    readonly callCountAfter: number;
    readonly liveLLMCallPerformed: boolean;
    readonly liveLLMCalledExactlyOnce: boolean;
    readonly promptConstructedInMemoryOnly: boolean;
    readonly modelOutputReceived: boolean;
    readonly modelOutputMarkedUntrusted: boolean;
    readonly modelOutputContentInspected: false;
    readonly modelOutputAvailableInResult: false;
    readonly metadataOnlyCaptured: boolean;
    readonly deliveryDateRequiredForExactDeadline: true;
    readonly exactDeadlineCalculationAuthorized: false;
    readonly deliveryDateInventionAuthorized: false;
    readonly finalDateInventionAuthorized: false;
    readonly legalCertaintyAuthorized: false;
    readonly coerciveLegalInstructionAuthorized: false;
    readonly broadEslintDebtTracked: true;
    readonly postCallCachedMetadataDebtTracked: true;
  };

  readonly highRiskSyntheticLegalDeadlineLiveExecutionAccepted: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallAudit: false;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;
  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly liveExecutionOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly metadataOnlyFutureCaptureRequired: true;
  readonly futureModelOutputMustBeMarkedUntrusted: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

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
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteModifiedByLiveExecution: false;
  readonly existingRuntimeModifiedByLiveExecution: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByLiveExecution: false;

  readonly broadEslintDebtTracked: true;
  readonly postCallCachedMetadataDebtTracked: true;

  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineLiveExecutionCheckResult {
  readonly checkId: "8.3AC";
  readonly allPassed: boolean;
  readonly dryRunAuthorizationReadyForLiveExecution: boolean;
  readonly highRiskSyntheticLegalDeadlineLiveExecutionAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForHighRiskSyntheticLegalDeadlinePostCallGovernanceRecheck: boolean;
  readonly readyForHighRiskSyntheticLegalDeadlinePostCallAudit: false;

  readonly killSwitchPresent: boolean;
  readonly killSwitchEnabled: boolean;
  readonly apiKeyPresent: boolean;
  readonly callCountBefore: number;
  readonly callCountAfter: number;
  readonly liveLLMCallPerformed: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;
  readonly promptConstructedInMemoryOnly: boolean;
  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputContentInspected: false;
  readonly modelOutputAvailableInResult: false;
  readonly metadataOnlyCaptured: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;
  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly liveExecutionOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly metadataOnlyFutureCaptureRequired: true;
  readonly futureModelOutputMustBeMarkedUntrusted: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

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

  readonly broadEslintDebtTracked: true;
  readonly postCallCachedMetadataDebtTracked: true;

  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_SCOPES: readonly HighRiskSyntheticLegalDeadlineLiveExecutionScope[] =
  [
    "live_execution",
    "dry_run_authorization_verified",
    "high_risk_synthetic_case",
    "legal_deadline_case",
    "widerspruch_deadline_case",
    "delivery_date_dependency_case",
    "exactly_one_live_call",
    "kill_switch_enforced",
    "single_call_counter_enforced",
    "metadata_only_capture",
    "model_output_untrusted",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
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
    "no_legal_advice_output",
    "no_exact_deadline_calculation",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_REQUIREMENTS: readonly HighRiskSyntheticLegalDeadlineLiveExecutionRequirement[] =
  [
    "require_8_3ab_dry_run_authorization_passed",
    "require_selected_case_high_risk_widerspruch_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_api_model_gpt_4o_mini",
    "require_source_kind_never_user_visible",
    "require_kill_switch_enabled",
    "require_api_key_present",
    "require_call_count_before_zero",
    "require_call_count_after_one",
    "require_exactly_one_live_call",
    "require_metadata_only_capture",
    "require_model_output_untrusted",
    "require_prompt_not_logged_stored_returned",
    "require_model_output_not_logged_stored_returned",
    "require_api_key_not_logged_returned",
    "require_future_governance_recheck",
    "require_future_post_call_audit",
    "require_no_exact_deadline_without_delivery_date",
    "require_no_delivery_date_invention",
    "require_no_final_date_invention",
    "require_no_legal_certainty",
    "require_no_deadline_invention",
    "require_no_coercive_instruction",
    "require_no_real_input",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_no_real_document_input",
    "require_technical_debt_tracking",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_BLOCKERS: readonly HighRiskSyntheticLegalDeadlineLiveExecutionBlocker[] =
  [
    "dry_run_authorization_not_ready",
    "dry_run_authorization_not_passed",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "api_model_invalid",
    "source_kind_invalid",
    "kill_switch_missing_or_disabled",
    "api_key_missing",
    "call_count_before_not_zero",
    "call_count_after_not_one",
    "no_live_call_detected",
    "multiple_live_calls_detected",
    "metadata_only_capture_missing",
    "model_output_not_received",
    "model_output_not_untrusted",
    "prompt_text_logged",
    "prompt_text_stored",
    "prompt_text_returned",
    "model_output_logged",
    "model_output_stored",
    "model_output_returned",
    "api_key_value_logged",
    "api_key_value_returned",
    "post_call_governance_recheck_missing",
    "post_call_audit_missing",
    "exact_deadline_authorized_without_delivery_date",
    "delivery_date_invention_authorized",
    "final_date_invention_authorized",
    "legal_certainty_authorized",
    "coercive_legal_instruction_authorized",
    "real_input_detected",
    "raw_input_detected",
    "redacted_real_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "persistence_detected",
    "user_visible_output_detected",
    "public_runtime_detected",
    "general_live_llm_runtime_authorized",
    "real_document_input_authorized",
    "technical_debt_not_tracked",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_CHECKLIST: readonly HighRiskSyntheticLegalDeadlineLiveExecutionChecklistItem[] =
  [
    "dry_run_authorization_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "api_model_reviewed",
    "source_kind_reviewed",
    "kill_switch_reviewed",
    "api_key_presence_reviewed_without_exposure",
    "single_call_counter_reviewed",
    "exactly_one_live_call_reviewed",
    "metadata_only_capture_reviewed",
    "model_output_untrusted_reviewed",
    "prompt_non_exposure_reviewed",
    "model_output_non_exposure_reviewed",
    "api_key_non_exposure_reviewed",
    "post_call_governance_recheck_required_reviewed",
    "post_call_audit_required_reviewed",
    "no_exact_deadline_without_delivery_date_reviewed",
    "no_delivery_date_invention_reviewed",
    "no_final_date_invention_reviewed",
    "no_legal_certainty_reviewed",
    "no_coercive_instruction_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "technical_debt_reviewed",
    "next_phase_post_call_governance_recheck_required",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_DEBT_NOTES: readonly string[] =
  [
    "Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts.",
    "Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration.",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase performs exactly one high-risk synthetic legal deadline live LLM call only when the kill switch is enabled.",
    "I acknowledge that exact deadline calculation is not authorized without a delivery or Bekanntgabe date.",
    "I acknowledge that delivery-date invention, final-date invention, legal certainty, and coercive legal instructions remain blocked.",
    "I acknowledge that model output is captured only as metadata and is immediately marked untrusted.",
    "I acknowledge that real documents, persistence, user-visible output, and public runtime remain blocked.",
  ] as const;

export const FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_LIVE_EXECUTION_STRINGS: readonly string[] =
  [
    // Core safety strings (inherited)
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
    "Sehr geehrte",
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
    "payment model output inspected",
    "payment prompt reconstructed",
    "payment answer approved for user",
    "real payment document rechecked",
    "public payment runtime rechecked",
    "payment output ready for display",
    "production payment recheck passed",
    "real document payment governance passed",
    "payment model output audited",
    "payment prompt audited",
    "real payment document audited",
    "public payment runtime audited",
    "production payment audit passed",
    "real document payment audit passed",
    // Legal deadline strings (inherited from 8.3Y/8.3AA/8.3AB)
    "exact Widerspruch deadline calculated",
    "legal deadline guaranteed",
    "you must file Widerspruch by",
    "Widerspruch legally certain",
    "real Bescheid processed",
    "real legal deadline authorized",
    "public legal deadline runtime ready",
    "user-visible legal advice ready",
    "production legal advice enabled",
    "Rechtsbehelfsbelehrung vollständig geprüft",
    "genauer Fristablauf berechnet",
    "delivery date inferred",
    "final Widerspruch date inferred",
    "execution prompt sent",
    "live legal deadline call executed",
    "dry-run authorized exact deadline",
    "dry-run authorized legal certainty",
    "dry-run authorized user-visible advice",
    // New in 8.3AC
    "live execution returned model output",
    "live execution logged prompt",
    "live execution logged model output",
    "live execution exposed API key",
  ] as const;
