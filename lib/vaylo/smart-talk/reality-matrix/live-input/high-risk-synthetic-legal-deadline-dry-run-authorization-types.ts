/**
 * Types for Phase 8.3AB — High-Risk Synthetic Legal Deadline Dry-Run Authorization.
 *
 * This phase is DRY-RUN AUTHORIZATION ONLY.
 * It does NOT:
 *   - Call OpenAI or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Finalize or send the API prompt
 *   - Inspect model output
 *   - Process real user input (OCR / photo / file)
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Calculate an exact legal deadline
 *   - Invent a delivery date or final Widerspruch date
 *   - Authorize legal certainty
 *   - Issue coercive legal instructions
 *
 * It creates the dry-run authorization gate for one future synthetic live LLM call for:
 *   `synthetic_high_risk_widerspruch_deadline`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationStatus =
  | "accepted"
  | "blocked"
  | "rejected";

// ── Case / provider / model / apiModel / sourceKind ───────────────────────────

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationCaseId =
  "synthetic_high_risk_widerspruch_deadline";

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationProvider = "openai";

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationModel = "gpt_4o_mini";

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationApiModel = "gpt-4o-mini";

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationSourceKind =
  "synthetic_high_risk_legal_deadline_never_user_visible";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationScope =
  | "dry_run_authorization_only"
  | "execution_plan_verified"
  | "high_risk_synthetic_case"
  | "legal_deadline_case"
  | "widerspruch_deadline_case"
  | "delivery_date_dependency_case"
  | "authorize_one_future_synthetic_live_call_only"
  | "kill_switch_required"
  | "single_call_counter_required"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "metadata_only_capture_required"
  | "output_untrusted_until_recheck"
  | "no_live_call_in_dry_run_authorization"
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

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationRequirement =
  | "require_8_3aa_execution_plan_passed"
  | "require_selected_case_high_risk_widerspruch_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_api_model_gpt_4o_mini"
  | "require_source_kind_never_user_visible"
  | "require_dry_run_authorization_only"
  | "require_one_future_synthetic_live_call_only"
  | "require_kill_switch"
  | "require_single_call_counter"
  | "require_metadata_only_future_capture"
  | "require_future_model_output_untrusted"
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

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationBlocker =
  | "execution_plan_not_ready"
  | "execution_plan_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "missing_scope"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "dry_run_authorization_attempted_live_call"
  | "direct_openai_call_attempted"
  | "prompt_finalized_for_call"
  | "model_output_available"
  | "one_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
  | "metadata_only_capture_missing"
  | "future_model_output_untrusted_missing"
  | "future_governance_recheck_missing"
  | "future_post_call_audit_missing"
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

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationChecklistItem =
  | "execution_plan_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "api_model_reviewed"
  | "source_kind_reviewed"
  | "high_risk_deadline_reviewed"
  | "delivery_date_dependency_reviewed"
  | "no_exact_deadline_without_delivery_date_reviewed"
  | "no_delivery_date_invention_reviewed"
  | "no_final_date_invention_reviewed"
  | "no_legal_certainty_reviewed"
  | "no_coercive_instruction_reviewed"
  | "one_future_call_limit_reviewed"
  | "kill_switch_reviewed"
  | "single_call_counter_reviewed"
  | "metadata_only_capture_reviewed"
  | "future_model_output_untrusted_reviewed"
  | "future_governance_recheck_required_reviewed"
  | "future_post_call_audit_required_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "technical_debt_reviewed"
  | "next_phase_live_execution_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineDryRunAuthorizationRejectionReason =
  | "execution_plan_not_ready"
  | "execution_plan_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "missing_scope"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "dry_run_authorization_attempted_live_call"
  | "direct_openai_call_attempted"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "prompt_finalized_for_call"
  | "model_output_available"
  | "one_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
  | "metadata_only_capture_missing"
  | "future_model_output_untrusted_missing"
  | "future_governance_recheck_missing"
  | "future_post_call_audit_missing"
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
  | "technical_debt_not_tracked"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_dry_run_authorization_note_detected";

// ── Input ─────────────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineDryRunAuthorizationInput {
  readonly dryRunAuthorizationId: string;
  readonly epochId: "8.3AB";
  readonly previousPhaseId: "8.3AA";

  readonly executionPlanReadyForDryRunAuthorization: boolean;
  readonly executionPlanAllPassed: boolean;

  readonly selectedCase: HighRiskSyntheticLegalDeadlineDryRunAuthorizationCaseId;
  readonly provider: HighRiskSyntheticLegalDeadlineDryRunAuthorizationProvider;
  readonly model: HighRiskSyntheticLegalDeadlineDryRunAuthorizationModel;
  readonly apiModel: HighRiskSyntheticLegalDeadlineDryRunAuthorizationApiModel;
  readonly sourceKind: HighRiskSyntheticLegalDeadlineDryRunAuthorizationSourceKind;

  readonly scopes: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationScope[];
  readonly requirements: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationRequirement[];
  readonly blockers: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationBlocker[];
  readonly checklistConfirmed: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationChecklistItem[];

  readonly dryRunAuthorizationOnly: true;
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

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly directOpenAiCallMadeByDryRunAuthorization: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;

  readonly readyForHighRiskSyntheticLegalDeadlineLiveExecution: boolean;
  readonly highRiskSyntheticLegalDeadlineDryRunAuthorizationAccepted: boolean;

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

  readonly operatorHighRiskDryRunAuthorizationAcknowledgment: string;
  readonly reviewerHighRiskDryRunAuthorizationAcknowledgment: string;
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

export interface HighRiskSyntheticLegalDeadlineDryRunAuthorizationResult {
  readonly dryRunAuthorizationId: string;
  readonly epochId: "8.3AB";
  readonly status: HighRiskSyntheticLegalDeadlineDryRunAuthorizationStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationRejectionReason[];

  readonly safeDryRunAuthorizationMetadata: {
    readonly selectedCase: HighRiskSyntheticLegalDeadlineDryRunAuthorizationCaseId;
    readonly provider: HighRiskSyntheticLegalDeadlineDryRunAuthorizationProvider;
    readonly model: HighRiskSyntheticLegalDeadlineDryRunAuthorizationModel;
    readonly apiModel: HighRiskSyntheticLegalDeadlineDryRunAuthorizationApiModel;
    readonly sourceKind: HighRiskSyntheticLegalDeadlineDryRunAuthorizationSourceKind;
    readonly scopeCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly dryRunAuthorizationOnly: true;
    readonly highRiskSyntheticCase: true;
    readonly legalDeadlineCase: true;
    readonly deliveryDateRequiredForExactDeadline: true;
    readonly exactDeadlineCalculationAuthorized: false;
    readonly deliveryDateInventionAuthorized: false;
    readonly finalDateInventionAuthorized: false;
    readonly legalCertaintyAuthorized: false;
    readonly coerciveLegalInstructionAuthorized: false;
    readonly broadEslintDebtTracked: true;
    readonly postCallCachedMetadataDebtTracked: true;
  };

  readonly readyForHighRiskSyntheticLegalDeadlineLiveExecution: boolean;
  readonly highRiskSyntheticLegalDeadlineDryRunAuthorizationAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly dryRunAuthorizationOnly: true;
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

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly directOpenAiCallMadeByDryRunAuthorization: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;

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

  readonly apiRouteModifiedByDryRunAuthorization: false;
  readonly existingRuntimeModifiedByDryRunAuthorization: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByDryRunAuthorization: false;

  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineDryRunAuthorizationCheckResult {
  readonly checkId: "8.3AB";
  readonly allPassed: boolean;
  readonly executionPlanReadyForDryRunAuthorization: boolean;
  readonly highRiskSyntheticLegalDeadlineDryRunAuthorizationAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForHighRiskSyntheticLegalDeadlineLiveExecution: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly dryRunAuthorizationOnly: true;
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

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly directOpenAiCallMadeByDryRunAuthorization: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;

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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_SCOPES: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationScope[] =
  [
    "dry_run_authorization_only",
    "execution_plan_verified",
    "high_risk_synthetic_case",
    "legal_deadline_case",
    "widerspruch_deadline_case",
    "delivery_date_dependency_case",
    "authorize_one_future_synthetic_live_call_only",
    "kill_switch_required",
    "single_call_counter_required",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "metadata_only_capture_required",
    "output_untrusted_until_recheck",
    "no_live_call_in_dry_run_authorization",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_REQUIREMENTS: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationRequirement[] =
  [
    "require_8_3aa_execution_plan_passed",
    "require_selected_case_high_risk_widerspruch_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_api_model_gpt_4o_mini",
    "require_source_kind_never_user_visible",
    "require_dry_run_authorization_only",
    "require_one_future_synthetic_live_call_only",
    "require_kill_switch",
    "require_single_call_counter",
    "require_metadata_only_future_capture",
    "require_future_model_output_untrusted",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_BLOCKERS: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationBlocker[] =
  [
    "execution_plan_not_ready",
    "execution_plan_not_passed",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "api_model_invalid",
    "source_kind_invalid",
    "missing_scope",
    "missing_requirement",
    "missing_blocker",
    "missing_checklist_item",
    "dry_run_authorization_attempted_live_call",
    "direct_openai_call_attempted",
    "prompt_finalized_for_call",
    "model_output_available",
    "one_call_limit_missing",
    "kill_switch_missing",
    "single_call_counter_missing",
    "metadata_only_capture_missing",
    "future_model_output_untrusted_missing",
    "future_governance_recheck_missing",
    "future_post_call_audit_missing",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_CHECKLIST: readonly HighRiskSyntheticLegalDeadlineDryRunAuthorizationChecklistItem[] =
  [
    "execution_plan_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "api_model_reviewed",
    "source_kind_reviewed",
    "high_risk_deadline_reviewed",
    "delivery_date_dependency_reviewed",
    "no_exact_deadline_without_delivery_date_reviewed",
    "no_delivery_date_invention_reviewed",
    "no_final_date_invention_reviewed",
    "no_legal_certainty_reviewed",
    "no_coercive_instruction_reviewed",
    "one_future_call_limit_reviewed",
    "kill_switch_reviewed",
    "single_call_counter_reviewed",
    "metadata_only_capture_reviewed",
    "future_model_output_untrusted_reviewed",
    "future_governance_recheck_required_reviewed",
    "future_post_call_audit_required_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "technical_debt_reviewed",
    "next_phase_live_execution_required",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_DEBT_NOTES: readonly string[] =
  [
    "Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts.",
    "Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration.",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase performs high-risk synthetic legal deadline dry-run authorization only.",
    "I acknowledge that exact deadline calculation is not authorized without a delivery or Bekanntgabe date.",
    "I acknowledge that delivery-date invention, final-date invention, legal certainty, and coercive legal instructions remain blocked.",
    "I acknowledge that no live LLM call, real input, persistence, or user-visible output occurs in this phase.",
    "I acknowledge that real documents and public runtime remain blocked.",
  ] as const;

export const FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DRY_RUN_AUTHORIZATION_STRINGS: readonly string[] =
  [
    // Inherited core safety strings
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
    // Legal deadline strings inherited from 8.3AA
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
    // New in 8.3AB
    "dry-run authorized exact deadline",
    "dry-run authorized legal certainty",
    "dry-run authorized user-visible advice",
  ] as const;
