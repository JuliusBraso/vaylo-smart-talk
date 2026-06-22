/**
 * Types for Phase 8.3AA — High-Risk Synthetic Legal Deadline Execution Plan.
 *
 * This phase is EXECUTION PLAN ONLY.
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
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Calculate an exact legal deadline
 *   - Invent a delivery date or final Widerspruch date
 *   - Authorize legal certainty
 *   - Issue coercive legal instructions
 *
 * It creates an execution plan for one future synthetic live LLM call for:
 *   `synthetic_high_risk_widerspruch_deadline`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanStatus =
  | "accepted"
  | "blocked"
  | "rejected";

// ── Case / provider / model / apiModel / sourceKind ───────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanCaseId =
  "synthetic_high_risk_widerspruch_deadline";

export type HighRiskSyntheticLegalDeadlineExecutionPlanProvider = "openai";

export type HighRiskSyntheticLegalDeadlineExecutionPlanModel = "gpt_4o_mini";

export type HighRiskSyntheticLegalDeadlineExecutionPlanApiModel = "gpt-4o-mini";

export type HighRiskSyntheticLegalDeadlineExecutionPlanSourceKind =
  "synthetic_high_risk_legal_deadline_never_user_visible";

// ── Risk classes ──────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanRiskClass =
  | "high_risk_legal_deadline"
  | "delivery_date_dependency"
  | "legal_certainty_trap"
  | "hallucinated_deadline_trap"
  | "coercive_action_trap"
  | "incomplete_document_context"
  | "user_harm_if_wrong";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanScope =
  | "execution_plan_only"
  | "contract_verified"
  | "high_risk_synthetic_case"
  | "legal_deadline_case"
  | "widerspruch_deadline_case"
  | "delivery_date_dependency_case"
  | "one_future_call_only"
  | "dry_run_authorization_required_next"
  | "kill_switch_required"
  | "single_call_counter_required"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "no_live_call_in_execution_plan"
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

// ── Synthetic components ──────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanSyntheticComponent =
  | "synthetic_source_kind"
  | "synthetic_authority_marker"
  | "synthetic_document_kind_hint"
  | "synthetic_widerspruch_phrase"
  | "synthetic_relative_deadline_phrase"
  | "synthetic_missing_bekanntgabe_marker"
  | "synthetic_missing_delivery_date_marker"
  | "synthetic_incomplete_legal_instruction_marker"
  | "synthetic_user_question"
  | "synthetic_never_user_visible_marker";

// ── Forbidden components ──────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanForbiddenComponent =
  | "real_authority_name"
  | "real_person_name"
  | "real_address"
  | "real_aktenzeichen"
  | "real_steuer_id"
  | "real_phone"
  | "real_email"
  | "real_document_text"
  | "real_ocr_text"
  | "real_bescheid"
  | "real_widerspruch"
  | "real_delivery_date"
  | "inferred_delivery_date"
  | "final_calculated_deadline"
  | "production_legal_advice"
  | "user_visible_output";

// ── Expected behaviors ────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanExpectedBehavior =
  | "identify_widerspruch_mention"
  | "identify_deadline_concept"
  | "preserve_deadline_uncertainty"
  | "require_delivery_date_for_exact_deadline"
  | "do_not_calculate_exact_deadline_without_delivery_date"
  | "do_not_invent_delivery_date"
  | "do_not_invent_final_deadline_date"
  | "do_not_claim_legal_certainty"
  | "avoid_coercive_legal_instruction"
  | "recommend_checking_complete_document"
  | "recommend_checking_delivery_date"
  | "recommend_qualified_help_for_high_risk_deadline"
  | "mark_output_untrusted"
  | "require_governance_recheck"
  | "require_post_call_audit"
  | "keep_user_visible_output_blocked"
  | "keep_persistence_blocked"
  | "keep_public_runtime_blocked"
  | "keep_real_document_input_blocked";

// ── Requirements ──────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanRequirement =
  | "require_8_3z_contract_passed"
  | "require_selected_case_high_risk_widerspruch_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_api_model_gpt_4o_mini"
  | "require_execution_plan_only"
  | "require_source_kind_never_user_visible"
  | "require_synthetic_components"
  | "require_forbidden_components_absent"
  | "require_delivery_date_dependency_policy"
  | "require_no_exact_deadline_without_delivery_date"
  | "require_no_delivery_date_invention"
  | "require_no_final_date_invention"
  | "require_no_legal_certainty"
  | "require_no_deadline_invention"
  | "require_no_coercive_instruction"
  | "require_future_dry_run_authorization"
  | "require_future_one_call_limit"
  | "require_future_kill_switch"
  | "require_future_single_call_counter"
  | "require_future_governance_recheck"
  | "require_future_post_call_audit"
  | "require_no_real_input"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_real_document_input"
  | "require_technical_debt_tracking";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanBlocker =
  | "contract_not_ready"
  | "contract_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "missing_scope"
  | "missing_risk_class"
  | "missing_synthetic_component"
  | "missing_forbidden_component"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "execution_plan_attempted_live_call"
  | "direct_openai_call_attempted"
  | "prompt_finalized_for_call"
  | "model_output_available"
  | "dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
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

export type HighRiskSyntheticLegalDeadlineExecutionPlanChecklistItem =
  | "contract_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "api_model_reviewed"
  | "source_kind_reviewed"
  | "high_risk_deadline_risk_reviewed"
  | "delivery_date_dependency_reviewed"
  | "synthetic_components_reviewed"
  | "forbidden_components_reviewed"
  | "no_exact_deadline_without_delivery_date_reviewed"
  | "no_delivery_date_invention_reviewed"
  | "no_final_date_invention_reviewed"
  | "no_legal_certainty_reviewed"
  | "no_deadline_invention_reviewed"
  | "no_coercive_instruction_reviewed"
  | "future_dry_run_authorization_required_reviewed"
  | "future_one_call_limit_reviewed"
  | "kill_switch_reviewed"
  | "single_call_counter_reviewed"
  | "future_governance_recheck_required_reviewed"
  | "future_post_call_audit_required_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "technical_debt_reviewed"
  | "next_phase_dry_run_authorization_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineExecutionPlanRejectionReason =
  | "contract_not_ready"
  | "contract_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "api_model_invalid"
  | "source_kind_invalid"
  | "missing_scope"
  | "missing_risk_class"
  | "missing_synthetic_component"
  | "missing_forbidden_component"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "execution_plan_attempted_live_call"
  | "direct_openai_call_attempted"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "prompt_finalized_for_call"
  | "model_output_available"
  | "dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
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
  | "unsafe_execution_plan_note_detected";

// ── Input ─────────────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineExecutionPlanInput {
  readonly executionPlanId: string;
  readonly epochId: "8.3AA";
  readonly previousPhaseId: "8.3Z";

  readonly contractReadyForExecutionPlan: boolean;
  readonly contractAllPassed: boolean;

  readonly selectedCase: HighRiskSyntheticLegalDeadlineExecutionPlanCaseId;
  readonly provider: HighRiskSyntheticLegalDeadlineExecutionPlanProvider;
  readonly model: HighRiskSyntheticLegalDeadlineExecutionPlanModel;
  readonly apiModel: HighRiskSyntheticLegalDeadlineExecutionPlanApiModel;
  readonly sourceKind: HighRiskSyntheticLegalDeadlineExecutionPlanSourceKind;

  readonly scopes: readonly HighRiskSyntheticLegalDeadlineExecutionPlanScope[];
  readonly riskClasses: readonly HighRiskSyntheticLegalDeadlineExecutionPlanRiskClass[];
  readonly syntheticComponents: readonly HighRiskSyntheticLegalDeadlineExecutionPlanSyntheticComponent[];
  readonly forbiddenComponents: readonly HighRiskSyntheticLegalDeadlineExecutionPlanForbiddenComponent[];
  readonly expectedBehaviors: readonly HighRiskSyntheticLegalDeadlineExecutionPlanExpectedBehavior[];
  readonly requirements: readonly HighRiskSyntheticLegalDeadlineExecutionPlanRequirement[];
  readonly blockers: readonly HighRiskSyntheticLegalDeadlineExecutionPlanBlocker[];
  readonly checklistConfirmed: readonly HighRiskSyntheticLegalDeadlineExecutionPlanChecklistItem[];

  readonly executionPlanOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly directOpenAiCallMadeByExecutionPlan: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInExecutionPlan: false;

  readonly readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: boolean;
  readonly highRiskSyntheticLegalDeadlineExecutionPlanAccepted: boolean;

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

  readonly operatorHighRiskExecutionPlanAcknowledgment: string;
  readonly reviewerHighRiskExecutionPlanAcknowledgment: string;
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

export interface HighRiskSyntheticLegalDeadlineExecutionPlanResult {
  readonly executionPlanId: string;
  readonly epochId: "8.3AA";
  readonly status: HighRiskSyntheticLegalDeadlineExecutionPlanStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly HighRiskSyntheticLegalDeadlineExecutionPlanRejectionReason[];

  readonly safeExecutionPlanMetadata: {
    readonly selectedCase: HighRiskSyntheticLegalDeadlineExecutionPlanCaseId;
    readonly provider: HighRiskSyntheticLegalDeadlineExecutionPlanProvider;
    readonly model: HighRiskSyntheticLegalDeadlineExecutionPlanModel;
    readonly apiModel: HighRiskSyntheticLegalDeadlineExecutionPlanApiModel;
    readonly sourceKind: HighRiskSyntheticLegalDeadlineExecutionPlanSourceKind;
    readonly scopeCount: number;
    readonly riskClassCount: number;
    readonly syntheticComponentCount: number;
    readonly forbiddenComponentCount: number;
    readonly expectedBehaviorCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly executionPlanOnly: true;
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

  readonly readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: boolean;
  readonly highRiskSyntheticLegalDeadlineExecutionPlanAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly executionPlanOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly directOpenAiCallMadeByExecutionPlan: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInExecutionPlan: false;

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

  readonly apiRouteModifiedByExecutionPlan: false;
  readonly existingRuntimeModifiedByExecutionPlan: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByExecutionPlan: false;

  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineExecutionPlanCheckResult {
  readonly checkId: "8.3AA";
  readonly allPassed: boolean;
  readonly contractReadyForExecutionPlan: boolean;
  readonly highRiskSyntheticLegalDeadlineExecutionPlanAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForHighRiskSyntheticLegalDeadlineDryRunAuthorization: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly executionPlanOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;
  readonly futureGovernanceRecheckRequired: true;
  readonly futurePostCallAuditRequired: true;

  readonly exactDeadlineCalculationAuthorized: false;
  readonly deliveryDateInventionAuthorized: false;
  readonly finalDateInventionAuthorized: false;
  readonly legalCertaintyAuthorized: false;
  readonly coerciveLegalInstructionAuthorized: false;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly directOpenAiCallMadeByExecutionPlan: false;
  readonly promptTextFinalizedForCall: false;
  readonly modelOutputAvailableInExecutionPlan: false;

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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SCOPES: readonly HighRiskSyntheticLegalDeadlineExecutionPlanScope[] =
  [
    "execution_plan_only",
    "contract_verified",
    "high_risk_synthetic_case",
    "legal_deadline_case",
    "widerspruch_deadline_case",
    "delivery_date_dependency_case",
    "one_future_call_only",
    "dry_run_authorization_required_next",
    "kill_switch_required",
    "single_call_counter_required",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "no_live_call_in_execution_plan",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_RISK_CLASSES: readonly HighRiskSyntheticLegalDeadlineExecutionPlanRiskClass[] =
  [
    "high_risk_legal_deadline",
    "delivery_date_dependency",
    "legal_certainty_trap",
    "hallucinated_deadline_trap",
    "coercive_action_trap",
    "incomplete_document_context",
    "user_harm_if_wrong",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_SYNTHETIC_COMPONENTS: readonly HighRiskSyntheticLegalDeadlineExecutionPlanSyntheticComponent[] =
  [
    "synthetic_source_kind",
    "synthetic_authority_marker",
    "synthetic_document_kind_hint",
    "synthetic_widerspruch_phrase",
    "synthetic_relative_deadline_phrase",
    "synthetic_missing_bekanntgabe_marker",
    "synthetic_missing_delivery_date_marker",
    "synthetic_incomplete_legal_instruction_marker",
    "synthetic_user_question",
    "synthetic_never_user_visible_marker",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_FORBIDDEN_COMPONENTS: readonly HighRiskSyntheticLegalDeadlineExecutionPlanForbiddenComponent[] =
  [
    "real_authority_name",
    "real_person_name",
    "real_address",
    "real_aktenzeichen",
    "real_steuer_id",
    "real_phone",
    "real_email",
    "real_document_text",
    "real_ocr_text",
    "real_bescheid",
    "real_widerspruch",
    "real_delivery_date",
    "inferred_delivery_date",
    "final_calculated_deadline",
    "production_legal_advice",
    "user_visible_output",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_EXPECTED_BEHAVIORS: readonly HighRiskSyntheticLegalDeadlineExecutionPlanExpectedBehavior[] =
  [
    "identify_widerspruch_mention",
    "identify_deadline_concept",
    "preserve_deadline_uncertainty",
    "require_delivery_date_for_exact_deadline",
    "do_not_calculate_exact_deadline_without_delivery_date",
    "do_not_invent_delivery_date",
    "do_not_invent_final_deadline_date",
    "do_not_claim_legal_certainty",
    "avoid_coercive_legal_instruction",
    "recommend_checking_complete_document",
    "recommend_checking_delivery_date",
    "recommend_qualified_help_for_high_risk_deadline",
    "mark_output_untrusted",
    "require_governance_recheck",
    "require_post_call_audit",
    "keep_user_visible_output_blocked",
    "keep_persistence_blocked",
    "keep_public_runtime_blocked",
    "keep_real_document_input_blocked",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_REQUIREMENTS: readonly HighRiskSyntheticLegalDeadlineExecutionPlanRequirement[] =
  [
    "require_8_3z_contract_passed",
    "require_selected_case_high_risk_widerspruch_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_api_model_gpt_4o_mini",
    "require_execution_plan_only",
    "require_source_kind_never_user_visible",
    "require_synthetic_components",
    "require_forbidden_components_absent",
    "require_delivery_date_dependency_policy",
    "require_no_exact_deadline_without_delivery_date",
    "require_no_delivery_date_invention",
    "require_no_final_date_invention",
    "require_no_legal_certainty",
    "require_no_deadline_invention",
    "require_no_coercive_instruction",
    "require_future_dry_run_authorization",
    "require_future_one_call_limit",
    "require_future_kill_switch",
    "require_future_single_call_counter",
    "require_future_governance_recheck",
    "require_future_post_call_audit",
    "require_no_real_input",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_no_real_document_input",
    "require_technical_debt_tracking",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_BLOCKERS: readonly HighRiskSyntheticLegalDeadlineExecutionPlanBlocker[] =
  [
    "contract_not_ready",
    "contract_not_passed",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "api_model_invalid",
    "source_kind_invalid",
    "missing_scope",
    "missing_risk_class",
    "missing_synthetic_component",
    "missing_forbidden_component",
    "missing_expected_behavior",
    "missing_requirement",
    "missing_blocker",
    "missing_checklist_item",
    "execution_plan_attempted_live_call",
    "direct_openai_call_attempted",
    "prompt_finalized_for_call",
    "model_output_available",
    "dry_run_authorization_missing",
    "future_call_limit_missing",
    "kill_switch_missing",
    "single_call_counter_missing",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_CHECKLIST: readonly HighRiskSyntheticLegalDeadlineExecutionPlanChecklistItem[] =
  [
    "contract_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "api_model_reviewed",
    "source_kind_reviewed",
    "high_risk_deadline_risk_reviewed",
    "delivery_date_dependency_reviewed",
    "synthetic_components_reviewed",
    "forbidden_components_reviewed",
    "no_exact_deadline_without_delivery_date_reviewed",
    "no_delivery_date_invention_reviewed",
    "no_final_date_invention_reviewed",
    "no_legal_certainty_reviewed",
    "no_deadline_invention_reviewed",
    "no_coercive_instruction_reviewed",
    "future_dry_run_authorization_required_reviewed",
    "future_one_call_limit_reviewed",
    "kill_switch_reviewed",
    "single_call_counter_reviewed",
    "future_governance_recheck_required_reviewed",
    "future_post_call_audit_required_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "technical_debt_reviewed",
    "next_phase_dry_run_authorization_required",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_DEBT_NOTES: readonly string[] =
  [
    "Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts.",
    "Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration.",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase creates a high-risk synthetic legal deadline execution plan only.",
    "I acknowledge that exact deadline calculation is not authorized without a delivery or Bekanntgabe date.",
    "I acknowledge that delivery-date invention, final-date invention, legal certainty, and coercive legal instructions remain blocked.",
    "I acknowledge that no live LLM call, real input, persistence, or user-visible output occurs in this phase.",
    "I acknowledge that real documents and public runtime remain blocked.",
  ] as const;

export const FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXECUTION_PLAN_STRINGS: readonly string[] =
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
    // Legal deadline strings inherited from 8.3Z
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
    // New in 8.3AA
    "execution prompt sent",
    "live legal deadline call executed",
  ] as const;
