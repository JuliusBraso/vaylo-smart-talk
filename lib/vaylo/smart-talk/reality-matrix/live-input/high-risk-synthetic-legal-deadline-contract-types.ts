/**
 * Types for Phase 8.3Z — High-Risk Synthetic Legal Deadline Contract.
 *
 * This phase is CONTRACT ONLY.
 * It does NOT:
 *   - Call OpenAI or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Construct the final API prompt text
 *   - Inspect model output
 *   - Process real user input
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Calculate an exact legal deadline
 *   - Invent a delivery date or final Widerspruch date
 *   - Authorize legal certainty
 *   - Issue coercive legal instructions
 *
 * It contracts one future synthetic live LLM call for:
 *   `synthetic_high_risk_widerspruch_deadline`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractStatus =
  | "accepted"
  | "blocked"
  | "rejected";

// ── Case / provider / model ───────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractCaseId =
  "synthetic_high_risk_widerspruch_deadline";

export type HighRiskSyntheticLegalDeadlineContractProvider = "openai";

export type HighRiskSyntheticLegalDeadlineContractModel = "gpt_4o_mini";

// ── Risk classes ──────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractRiskClass =
  | "high_risk_legal_deadline"
  | "delivery_date_dependency"
  | "legal_certainty_trap"
  | "hallucinated_deadline_trap"
  | "coercive_action_trap"
  | "incomplete_document_context"
  | "user_harm_if_wrong";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractScope =
  | "contract_only"
  | "planning_verified"
  | "high_risk_synthetic_case"
  | "legal_deadline_case"
  | "widerspruch_deadline_case"
  | "delivery_date_dependency_case"
  | "one_future_call_only"
  | "execution_plan_required_next"
  | "dry_run_authorization_required_after_plan"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "no_live_call_in_contract"
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

// ── Prompt policies ───────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractPromptPolicy =
  | "synthetic_only"
  | "synthetic_authority_marker_only"
  | "no_real_authority_name"
  | "no_real_person_name"
  | "no_real_address"
  | "no_aktenzeichen"
  | "no_steuer_id"
  | "no_real_phone_or_email"
  | "no_real_document_text"
  | "include_widerspruch_phrase"
  | "include_relative_deadline_phrase"
  | "omit_delivery_date"
  | "omit_complete_legal_instruction"
  | "delivery_date_required_for_exact_deadline"
  | "no_exact_deadline_calculation_allowed"
  | "no_delivery_date_invention_allowed"
  | "no_final_date_invention_allowed"
  | "no_legal_certainty_allowed"
  | "no_coercive_legal_action_instruction"
  | "output_untrusted_until_recheck"
  | "governance_recheck_required"
  | "post_call_audit_required"
  | "user_visible_output_blocked";

// ── Expected behaviors ────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractExpectedBehavior =
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

export type HighRiskSyntheticLegalDeadlineContractRequirement =
  | "require_8_3y_planning_passed"
  | "require_selected_case_high_risk_widerspruch_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_contract_only"
  | "require_high_risk_deadline_risk_classes"
  | "require_delivery_date_dependency_policy"
  | "require_no_exact_deadline_without_delivery_date"
  | "require_no_delivery_date_invention"
  | "require_no_final_date_invention"
  | "require_no_legal_certainty"
  | "require_no_deadline_invention"
  | "require_no_coercive_instruction"
  | "require_synthetic_only_case"
  | "require_prompt_policy"
  | "require_expected_behaviors"
  | "require_future_execution_plan"
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

// ── Blockers ─────────────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractBlocker =
  | "planning_not_ready"
  | "planning_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "missing_scope"
  | "missing_risk_class"
  | "missing_prompt_policy"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "contract_attempted_live_call"
  | "direct_openai_call_attempted"
  | "prompt_text_constructed_now"
  | "model_output_available"
  | "future_execution_plan_missing"
  | "future_dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "future_kill_switch_missing"
  | "future_single_call_counter_missing"
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

export type HighRiskSyntheticLegalDeadlineContractChecklistItem =
  | "planning_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "high_risk_deadline_risk_reviewed"
  | "delivery_date_dependency_reviewed"
  | "no_exact_deadline_without_delivery_date_reviewed"
  | "no_delivery_date_invention_reviewed"
  | "no_final_date_invention_reviewed"
  | "no_legal_certainty_reviewed"
  | "no_deadline_invention_reviewed"
  | "no_coercive_instruction_reviewed"
  | "synthetic_only_policy_reviewed"
  | "prompt_policy_reviewed"
  | "expected_behaviors_reviewed"
  | "future_execution_plan_required_reviewed"
  | "future_dry_run_authorization_required_reviewed"
  | "future_one_call_limit_reviewed"
  | "future_kill_switch_reviewed"
  | "future_single_call_counter_reviewed"
  | "future_governance_recheck_required_reviewed"
  | "future_post_call_audit_required_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "technical_debt_reviewed"
  | "next_phase_execution_plan_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type HighRiskSyntheticLegalDeadlineContractRejectionReason =
  | "planning_not_ready"
  | "planning_not_passed"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "missing_scope"
  | "missing_risk_class"
  | "missing_prompt_policy"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "contract_attempted_live_call"
  | "direct_openai_call_attempted"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "prompt_text_constructed_now"
  | "model_output_available"
  | "future_execution_plan_missing"
  | "future_dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "future_kill_switch_missing"
  | "future_single_call_counter_missing"
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
  | "unsafe_contract_note_detected";

// ── Input ─────────────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineContractInput {
  readonly contractId: string;
  readonly epochId: "8.3Z";
  readonly previousPhaseId: "8.3Y";

  readonly planningReadyForContract: boolean;
  readonly planningAllPassed: boolean;

  readonly selectedCase: HighRiskSyntheticLegalDeadlineContractCaseId;
  readonly provider: HighRiskSyntheticLegalDeadlineContractProvider;
  readonly model: HighRiskSyntheticLegalDeadlineContractModel;

  readonly scopes: readonly HighRiskSyntheticLegalDeadlineContractScope[];
  readonly riskClasses: readonly HighRiskSyntheticLegalDeadlineContractRiskClass[];
  readonly promptPolicies: readonly HighRiskSyntheticLegalDeadlineContractPromptPolicy[];
  readonly expectedBehaviors: readonly HighRiskSyntheticLegalDeadlineContractExpectedBehavior[];
  readonly requirements: readonly HighRiskSyntheticLegalDeadlineContractRequirement[];
  readonly blockers: readonly HighRiskSyntheticLegalDeadlineContractBlocker[];
  readonly checklistConfirmed: readonly HighRiskSyntheticLegalDeadlineContractChecklistItem[];

  readonly contractOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureExecutionPlanRequired: true;
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

  readonly liveLLMCalledInContract: false;
  readonly directOpenAiCallMadeByContract: false;
  readonly promptTextConstructedNow: false;
  readonly modelOutputAvailableInContract: false;

  readonly readyForHighRiskSyntheticLegalDeadlineExecutionPlan: boolean;
  readonly highRiskSyntheticLegalDeadlineContractAccepted: boolean;

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

  readonly operatorHighRiskContractAcknowledgment: string;
  readonly reviewerHighRiskContractAcknowledgment: string;
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

export interface HighRiskSyntheticLegalDeadlineContractResult {
  readonly contractId: string;
  readonly epochId: "8.3Z";
  readonly status: HighRiskSyntheticLegalDeadlineContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly HighRiskSyntheticLegalDeadlineContractRejectionReason[];

  readonly safeContractMetadata: {
    readonly selectedCase: HighRiskSyntheticLegalDeadlineContractCaseId;
    readonly provider: HighRiskSyntheticLegalDeadlineContractProvider;
    readonly model: HighRiskSyntheticLegalDeadlineContractModel;
    readonly scopeCount: number;
    readonly riskClassCount: number;
    readonly promptPolicyCount: number;
    readonly expectedBehaviorCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly contractOnly: true;
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

  readonly readyForHighRiskSyntheticLegalDeadlineExecutionPlan: boolean;
  readonly highRiskSyntheticLegalDeadlineContractAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly contractOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureExecutionPlanRequired: true;
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

  readonly liveLLMCalledInContract: false;
  readonly directOpenAiCallMadeByContract: false;
  readonly promptTextConstructedNow: false;
  readonly modelOutputAvailableInContract: false;

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

  readonly apiRouteModifiedByContract: false;
  readonly existingRuntimeModifiedByContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByContract: false;

  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

export interface HighRiskSyntheticLegalDeadlineContractCheckResult {
  readonly checkId: "8.3Z";
  readonly allPassed: boolean;
  readonly planningReadyForContract: boolean;
  readonly highRiskSyntheticLegalDeadlineContractAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForHighRiskSyntheticLegalDeadlineExecutionPlan: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly contractOnly: true;
  readonly highRiskSyntheticCase: true;
  readonly legalDeadlineCase: true;
  readonly deliveryDateRequiredForExactDeadline: true;

  readonly futureExecutionPlanRequired: true;
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

  readonly liveLLMCalledInContract: false;
  readonly directOpenAiCallMadeByContract: false;
  readonly promptTextConstructedNow: false;
  readonly modelOutputAvailableInContract: false;

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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_SCOPES: readonly HighRiskSyntheticLegalDeadlineContractScope[] =
  [
    "contract_only",
    "planning_verified",
    "high_risk_synthetic_case",
    "legal_deadline_case",
    "widerspruch_deadline_case",
    "delivery_date_dependency_case",
    "one_future_call_only",
    "execution_plan_required_next",
    "dry_run_authorization_required_after_plan",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "no_live_call_in_contract",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_RISK_CLASSES: readonly HighRiskSyntheticLegalDeadlineContractRiskClass[] =
  [
    "high_risk_legal_deadline",
    "delivery_date_dependency",
    "legal_certainty_trap",
    "hallucinated_deadline_trap",
    "coercive_action_trap",
    "incomplete_document_context",
    "user_harm_if_wrong",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_PROMPT_POLICIES: readonly HighRiskSyntheticLegalDeadlineContractPromptPolicy[] =
  [
    "synthetic_only",
    "synthetic_authority_marker_only",
    "no_real_authority_name",
    "no_real_person_name",
    "no_real_address",
    "no_aktenzeichen",
    "no_steuer_id",
    "no_real_phone_or_email",
    "no_real_document_text",
    "include_widerspruch_phrase",
    "include_relative_deadline_phrase",
    "omit_delivery_date",
    "omit_complete_legal_instruction",
    "delivery_date_required_for_exact_deadline",
    "no_exact_deadline_calculation_allowed",
    "no_delivery_date_invention_allowed",
    "no_final_date_invention_allowed",
    "no_legal_certainty_allowed",
    "no_coercive_legal_action_instruction",
    "output_untrusted_until_recheck",
    "governance_recheck_required",
    "post_call_audit_required",
    "user_visible_output_blocked",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_EXPECTED_BEHAVIORS: readonly HighRiskSyntheticLegalDeadlineContractExpectedBehavior[] =
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_REQUIREMENTS: readonly HighRiskSyntheticLegalDeadlineContractRequirement[] =
  [
    "require_8_3y_planning_passed",
    "require_selected_case_high_risk_widerspruch_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_contract_only",
    "require_high_risk_deadline_risk_classes",
    "require_delivery_date_dependency_policy",
    "require_no_exact_deadline_without_delivery_date",
    "require_no_delivery_date_invention",
    "require_no_final_date_invention",
    "require_no_legal_certainty",
    "require_no_deadline_invention",
    "require_no_coercive_instruction",
    "require_synthetic_only_case",
    "require_prompt_policy",
    "require_expected_behaviors",
    "require_future_execution_plan",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_BLOCKERS: readonly HighRiskSyntheticLegalDeadlineContractBlocker[] =
  [
    "planning_not_ready",
    "planning_not_passed",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "missing_scope",
    "missing_risk_class",
    "missing_prompt_policy",
    "missing_expected_behavior",
    "missing_requirement",
    "missing_blocker",
    "missing_checklist_item",
    "contract_attempted_live_call",
    "direct_openai_call_attempted",
    "prompt_text_constructed_now",
    "model_output_available",
    "future_execution_plan_missing",
    "future_dry_run_authorization_missing",
    "future_call_limit_missing",
    "future_kill_switch_missing",
    "future_single_call_counter_missing",
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

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_CHECKLIST: readonly HighRiskSyntheticLegalDeadlineContractChecklistItem[] =
  [
    "planning_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "high_risk_deadline_risk_reviewed",
    "delivery_date_dependency_reviewed",
    "no_exact_deadline_without_delivery_date_reviewed",
    "no_delivery_date_invention_reviewed",
    "no_final_date_invention_reviewed",
    "no_legal_certainty_reviewed",
    "no_deadline_invention_reviewed",
    "no_coercive_instruction_reviewed",
    "synthetic_only_policy_reviewed",
    "prompt_policy_reviewed",
    "expected_behaviors_reviewed",
    "future_execution_plan_required_reviewed",
    "future_dry_run_authorization_required_reviewed",
    "future_one_call_limit_reviewed",
    "future_kill_switch_reviewed",
    "future_single_call_counter_reviewed",
    "future_governance_recheck_required_reviewed",
    "future_post_call_audit_required_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "technical_debt_reviewed",
    "next_phase_execution_plan_required",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_DEBT_NOTES: readonly string[] =
  [
    "Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts.",
    "Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration.",
  ] as const;

export const REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase contracts a high-risk synthetic legal deadline case only.",
    "I acknowledge that exact deadline calculation is not authorized without a delivery or Bekanntgabe date.",
    "I acknowledge that delivery-date invention, final-date invention, legal certainty, and coercive legal instructions remain blocked.",
    "I acknowledge that no live LLM call, real input, persistence, or user-visible output occurs in this phase.",
    "I acknowledge that real documents and public runtime remain blocked.",
  ] as const;

export const FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CONTRACT_STRINGS: readonly string[] = [
  // Inherited from 8.3Y (133)
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
  // New in 8.3Z (2)
  "delivery date inferred",
  "final Widerspruch date inferred",
] as const;
