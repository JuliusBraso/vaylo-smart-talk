/**
 * Additional Synthetic Live LLM Case Contract Types (Phase 8.3S).
 *
 * Defines the typed contract layer for one additional synthetic live LLM case:
 * `synthetic_explicit_payment_deadline`.
 *
 * This phase is CONTRACT ONLY:
 *   - Does NOT call a live LLM (`liveLLMCalledInContract: false` — literal)
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT import any LLM SDK
 *   - Does NOT process real input
 *   - Does NOT authorize real document input (`readyForRealDocumentInput: false` — literal)
 *   - Does NOT authorize public runtime (`readyForPublicLaunch: false` — literal)
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Future execution requires a separate execution plan AND dry-run authorization
 *
 * New fields vs Phase 8.3R:
 *   - `contractOnly: true` (literal)
 *   - `futureExecutionPlanRequired: true` (literal)
 *   - `futureDryRunAuthorizationRequired: true` (literal)
 *   - `oneFutureLiveLlmCallOnly: true` (literal)
 *   - `killSwitchRequiredForFutureCall: true` (literal)
 *   - `singleCallCounterRequiredForFutureCall: true` (literal)
 *   - `liveLLMCalledInContract: false` (literal)
 *   - `promptTextAvailableInContract: false` (literal)
 *   - `modelOutputAvailableInContract: false` (literal)
 *   - `AdditionalSyntheticLiveLlmCasePromptPolicy` enum
 *
 * Key invariants (literal types):
 *   - `contractOnly: true`
 *   - `futureExecutionPlanRequired: true`
 *   - `futureDryRunAuthorizationRequired: true`
 *   - `oneFutureLiveLlmCallOnly: true`
 *   - `killSwitchRequiredForFutureCall: true`
 *   - `singleCallCounterRequiredForFutureCall: true`
 *   - `liveLLMCalledInContract: false`
 *   - `additionalLiveLLMCallsExecuted: false`
 *   - All dangerous readiness flags: `false`
 *   - All real/raw/OCR/file/public/dependency flags: `false`
 *   - `neverUserVisible: true`
 *
 * Positive gates produced (only when `accepted`):
 *   - `readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true`
 *   - `selectedSyntheticCaseContractAccepted: true`
 *
 * Status:
 *   - "accepted" — all invariants pass
 *   - "blocked"  — expansion planning prerequisite not satisfied
 *   - "rejected" — at least one unsafe contract violation
 *
 * Builds on Phase 8.3R (Synthetic Live LLM Pilot Expansion Planning).
 *
 * ISOLATION NOTE:
 *   Branch C / run-smart-talk.ts / extract-text-from-image.ts flags remain
 *   literal `false`. These components are NOT called.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractStatus = "accepted" | "blocked" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractScope =
  | "contract_only"
  | "expansion_planning_verified"
  | "selected_synthetic_case_only"
  | "explicit_payment_deadline_case"
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
  | "no_real_document_input";

// ── Case / Provider / Model ───────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseId = "synthetic_explicit_payment_deadline";

export type AdditionalSyntheticLiveLlmCaseProvider = "openai";

export type AdditionalSyntheticLiveLlmCaseModel = "gpt_4o_mini";

// ── Risk classes ──────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseRiskClass =
  | "low_to_medium_payment_deadline"
  | "medium_financial_consequence_uncertainty"
  | "hallucination_deadline_trap"
  | "coercive_next_step_trap";

// ── Prompt policies ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePromptPolicy =
  | "synthetic_only_prompt"
  | "no_real_authority_name"
  | "no_real_person_name"
  | "no_real_address"
  | "no_iban"
  | "no_steuer_id"
  | "no_aktenzeichen"
  | "no_real_phone_or_email"
  | "explicit_payment_deadline_allowed"
  | "synthetic_amount_allowed"
  | "consequences_must_remain_uncertain"
  | "no_legal_certainty"
  | "no_coercive_you_must_language"
  | "output_must_be_marked_untrusted"
  | "governance_recheck_required"
  | "user_visible_output_blocked";

// ── Expected behaviors ────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExpectedBehavior =
  | "identify_payment_amount_as_document_stated"
  | "identify_payment_deadline_as_document_stated"
  | "preserve_uncertainty_about_consequences"
  | "do_not_invent_additional_deadlines"
  | "do_not_claim_legal_certainty"
  | "avoid_coercive_next_steps"
  | "recommend_checking_complete_document"
  | "mark_output_untrusted"
  | "require_post_call_governance_recheck"
  | "require_post_call_audit"
  | "keep_user_visible_output_blocked"
  | "keep_persistence_blocked"
  | "keep_public_runtime_blocked";

// ── Requirements ──────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractRequirement =
  | "require_expansion_planning_passed"
  | "require_selected_case_explicit_payment_deadline"
  | "require_provider_openai"
  | "require_model_gpt_4o_mini"
  | "require_contract_only"
  | "require_future_execution_plan"
  | "require_future_dry_run_authorization"
  | "require_one_future_call_limit"
  | "require_kill_switch_for_future_call"
  | "require_single_call_counter_for_future_call"
  | "require_synthetic_prompt_policy"
  | "require_prompt_non_logging"
  | "require_model_output_non_logging"
  | "require_metadata_only_capture"
  | "require_model_output_untrusted_marker"
  | "require_post_call_governance_recheck"
  | "require_post_call_audit"
  | "require_no_real_input"
  | "require_runtime_isolation"
  | "require_no_user_visible_output"
  | "require_no_persistence"
  | "require_no_public_runtime"
  | "require_no_general_live_llm_runtime"
  | "require_no_real_document_input";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractBlocker =
  | "expansion_planning_not_ready"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "contract_attempted_live_call"
  | "future_call_limit_missing"
  | "future_execution_plan_missing"
  | "future_dry_run_authorization_missing"
  | "prompt_policy_missing"
  | "prompt_or_model_output_available"
  | "prompt_or_model_output_logged"
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
  | "real_document_input_authorized";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractChecklistItem =
  | "expansion_planning_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "contract_only_reviewed"
  | "future_execution_plan_reviewed"
  | "future_dry_run_authorization_reviewed"
  | "one_future_call_limit_reviewed"
  | "kill_switch_future_call_reviewed"
  | "counter_future_call_reviewed"
  | "synthetic_prompt_policy_reviewed"
  | "prompt_non_logging_reviewed"
  | "model_output_non_logging_reviewed"
  | "metadata_only_capture_reviewed"
  | "untrusted_output_marker_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "runtime_isolation_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "next_phase_execution_plan_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseContractRejectionReason =
  | "expansion_planning_not_ready"
  | "missing_contract_scope"
  | "missing_prompt_policy"
  | "missing_risk_class"
  | "missing_expected_behavior"
  | "missing_requirement"
  | "missing_blocker"
  | "missing_checklist_item"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "contract_attempted_live_call"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "future_execution_plan_missing"
  | "future_dry_run_authorization_missing"
  | "one_future_call_limit_missing"
  | "prompt_text_available"
  | "model_output_available"
  | "prompt_or_model_output_logged"
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
  | "real_operator_pilot_authorized"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_contract_note_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the Additional Synthetic Live LLM Case Contract validation.
 *
 * New fields vs Phase 8.3R:
 * - `contractOnly: true` — this phase does not execute (literal)
 * - `futureExecutionPlanRequired: true` — next phase is an execution plan (literal)
 * - `futureDryRunAuthorizationRequired: true` — dry-run authorization gates execution (literal)
 * - `oneFutureLiveLlmCallOnly: true` — one-call limit for future execution (literal)
 * - `killSwitchRequiredForFutureCall: true` — kill-switch must be armed (literal)
 * - `singleCallCounterRequiredForFutureCall: true` — counter tracks 0→1 (literal)
 * - `liveLLMCalledInContract: false` — no live call in this contract (literal)
 * - `promptTextAvailableInContract: false` — no prompt available (literal)
 * - `modelOutputAvailableInContract: false` — no output available (literal)
 */
export interface AdditionalSyntheticLiveLlmCaseContractInput {
  readonly contractId: string;
  readonly epochId: "8.3S";
  readonly previousPhaseId: "8.3R";

  readonly expansionPlanningReadyForAdditionalCaseContract: boolean;

  readonly scopes: readonly AdditionalSyntheticLiveLlmCaseContractScope[];
  readonly selectedCase: AdditionalSyntheticLiveLlmCaseId;
  readonly provider: AdditionalSyntheticLiveLlmCaseProvider;
  readonly model: AdditionalSyntheticLiveLlmCaseModel;
  readonly riskClasses: readonly AdditionalSyntheticLiveLlmCaseRiskClass[];
  readonly promptPolicies: readonly AdditionalSyntheticLiveLlmCasePromptPolicy[];
  readonly expectedBehaviors: readonly AdditionalSyntheticLiveLlmCaseExpectedBehavior[];
  readonly requirements: readonly AdditionalSyntheticLiveLlmCaseContractRequirement[];
  readonly blockers: readonly AdditionalSyntheticLiveLlmCaseContractBlocker[];
  readonly checklistConfirmed: readonly AdditionalSyntheticLiveLlmCaseContractChecklistItem[];

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInContract: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true;
  readonly selectedSyntheticCaseContractAccepted: true;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextAvailableInContract: false;
  readonly modelOutputAvailableInContract: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

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

  readonly operatorAdditionalCaseContractAcknowledgment: string;
  readonly reviewerAdditionalCaseContractAcknowledgment: string;
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

// ── Contract result ───────────────────────────────────────────────────────────

/**
 * Result of validating an `AdditionalSyntheticLiveLlmCaseContractInput`.
 *
 * Positive gates (true only when accepted):
 *   - `readyForAdditionalSyntheticLiveLlmCaseExecutionPlan`
 *   - `selectedSyntheticCaseContractAccepted`
 *
 * All dangerous readiness flags remain literal `false`.
 */
export interface AdditionalSyntheticLiveLlmCaseContractResult {
  readonly contractId: string;
  readonly epochId: "8.3S";
  readonly status: AdditionalSyntheticLiveLlmCaseContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AdditionalSyntheticLiveLlmCaseContractRejectionReason[];

  readonly safeAdditionalCaseContractMetadata: {
    readonly scopeCount: number;
    readonly selectedCase: AdditionalSyntheticLiveLlmCaseId;
    readonly provider: AdditionalSyntheticLiveLlmCaseProvider;
    readonly model: AdditionalSyntheticLiveLlmCaseModel;
    readonly riskClassCount: number;
    readonly promptPolicyCount: number;
    readonly expectedBehaviorCount: number;
    readonly requirementCount: number;
    readonly blockerCount: number;
    readonly checklistPassedCount: number;
    readonly contractOnly: true;
    readonly oneFutureLiveLlmCallOnly: true;
  };

  readonly readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: boolean;
  readonly selectedSyntheticCaseContractAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInContract: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextAvailableInContract: false;
  readonly modelOutputAvailableInContract: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

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

  readonly apiRouteModifiedByContract: false;
  readonly existingRuntimeModifiedByContract: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByContract: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAdditionalSyntheticLiveLlmCaseContract()` (Phase 8.3S).
 *
 * `allPassed` is true when:
 * 1. The 8.3R expansion planning prerequisite is verified.
 * 2. The contract input is accepted.
 * 3. All tamper cases are rejected.
 *
 * Positive gates: `readyForAdditionalSyntheticLiveLlmCaseExecutionPlan` and
 * `selectedSyntheticCaseContractAccepted`.
 */
export interface AdditionalSyntheticLiveLlmCaseContractCheckResult {
  readonly checkId: "8.3S";
  readonly allPassed: boolean;
  readonly expansionPlanningReadyForAdditionalCaseContract: boolean;
  readonly additionalSyntheticLiveLlmCaseContractAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: boolean;
  readonly selectedSyntheticCaseContractAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInContract: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextAvailableInContract: false;
  readonly modelOutputAvailableInContract: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly syntheticInputOnly: true;
  readonly realUserInputAllowed: false;
  readonly rawInputAllowed: false;
  readonly realRedactedInputAllowed: false;
  readonly photoOrOcrInputAllowed: false;
  readonly fileUploadInputAllowed: false;
  readonly publicAnonymousInputAllowed: false;

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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES: readonly AdditionalSyntheticLiveLlmCaseContractScope[] =
  [
    "contract_only",
    "expansion_planning_verified",
    "selected_synthetic_case_only",
    "explicit_payment_deadline_case",
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
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES: readonly AdditionalSyntheticLiveLlmCaseRiskClass[] =
  [
    "low_to_medium_payment_deadline",
    "medium_financial_consequence_uncertainty",
    "hallucination_deadline_trap",
    "coercive_next_step_trap",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES: readonly AdditionalSyntheticLiveLlmCasePromptPolicy[] =
  [
    "synthetic_only_prompt",
    "no_real_authority_name",
    "no_real_person_name",
    "no_real_address",
    "no_iban",
    "no_steuer_id",
    "no_aktenzeichen",
    "no_real_phone_or_email",
    "explicit_payment_deadline_allowed",
    "synthetic_amount_allowed",
    "consequences_must_remain_uncertain",
    "no_legal_certainty",
    "no_coercive_you_must_language",
    "output_must_be_marked_untrusted",
    "governance_recheck_required",
    "user_visible_output_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS: readonly AdditionalSyntheticLiveLlmCaseExpectedBehavior[] =
  [
    "identify_payment_amount_as_document_stated",
    "identify_payment_deadline_as_document_stated",
    "preserve_uncertainty_about_consequences",
    "do_not_invent_additional_deadlines",
    "do_not_claim_legal_certainty",
    "avoid_coercive_next_steps",
    "recommend_checking_complete_document",
    "mark_output_untrusted",
    "require_post_call_governance_recheck",
    "require_post_call_audit",
    "keep_user_visible_output_blocked",
    "keep_persistence_blocked",
    "keep_public_runtime_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS: readonly AdditionalSyntheticLiveLlmCaseContractRequirement[] =
  [
    "require_expansion_planning_passed",
    "require_selected_case_explicit_payment_deadline",
    "require_provider_openai",
    "require_model_gpt_4o_mini",
    "require_contract_only",
    "require_future_execution_plan",
    "require_future_dry_run_authorization",
    "require_one_future_call_limit",
    "require_kill_switch_for_future_call",
    "require_single_call_counter_for_future_call",
    "require_synthetic_prompt_policy",
    "require_prompt_non_logging",
    "require_model_output_non_logging",
    "require_metadata_only_capture",
    "require_model_output_untrusted_marker",
    "require_post_call_governance_recheck",
    "require_post_call_audit",
    "require_no_real_input",
    "require_runtime_isolation",
    "require_no_user_visible_output",
    "require_no_persistence",
    "require_no_public_runtime",
    "require_no_general_live_llm_runtime",
    "require_no_real_document_input",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS: readonly AdditionalSyntheticLiveLlmCaseContractBlocker[] =
  [
    "expansion_planning_not_ready",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "contract_attempted_live_call",
    "future_call_limit_missing",
    "future_execution_plan_missing",
    "future_dry_run_authorization_missing",
    "prompt_policy_missing",
    "prompt_or_model_output_available",
    "prompt_or_model_output_logged",
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
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST: readonly AdditionalSyntheticLiveLlmCaseContractChecklistItem[] =
  [
    "expansion_planning_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "contract_only_reviewed",
    "future_execution_plan_reviewed",
    "future_dry_run_authorization_reviewed",
    "one_future_call_limit_reviewed",
    "kill_switch_future_call_reviewed",
    "counter_future_call_reviewed",
    "synthetic_prompt_policy_reviewed",
    "prompt_non_logging_reviewed",
    "model_output_non_logging_reviewed",
    "metadata_only_capture_reviewed",
    "untrusted_output_marker_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "runtime_isolation_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "next_phase_execution_plan_required",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is a contract only and does not call a live LLM.",
    "I acknowledge that the selected case is synthetic_explicit_payment_deadline only.",
    "I acknowledge that the next phase must create an execution plan before any future call.",
    "I acknowledge that real documents, public runtime, persistence, and user-visible output remain blocked.",
    "I acknowledge that model output must remain untrusted and require governance recheck after future execution.",
  ] as const;

export const FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_STRINGS: readonly string[] = [
  // Inherited from 8.3R (70)
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
  // New in 8.3S (9)
  "real payment notice",
  "real invoice",
  "real Mahnung",
  "IBAN:",
  "Zahlungspflicht sicher",
  "you must pay",
  "payment legally required",
  "public payment runtime ready",
  "real document payment test ready",
] as const;
