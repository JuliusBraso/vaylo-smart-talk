/**
 * Additional Synthetic Live LLM Case Execution Plan Types (Phase 8.3T).
 *
 * Defines the typed execution plan layer for one additional synthetic case:
 * `synthetic_explicit_payment_deadline`. This phase is EXECUTION PLAN ONLY —
 * it does not execute a live LLM call and does not construct final prompt text.
 *
 * This phase is EXECUTION PLAN ONLY:
 *   - Does NOT call a live LLM (`liveLLMCalledInExecutionPlan: false` — literal)
 *   - Does NOT construct final prompt text (`promptTextConstructedNow: false` — literal)
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT import any LLM SDK
 *   - Does NOT process real input
 *   - Does NOT authorize real document input (`readyForRealDocumentInput: false` — literal)
 *   - Does NOT authorize public runtime (`readyForPublicLaunch: false` — literal)
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Future execution requires dry-run authorization (`futureDryRunAuthorizationRequired: true`)
 *
 * New fields vs Phase 8.3S:
 *   - `executionPlanOnly: true` (literal)
 *   - `promptTextConstructedNow: false` (literal)
 *   - `promptTextAvailableInExecutionPlan: false` (literal)
 *   - `modelOutputAvailableInExecutionPlan: false` (literal)
 *   - `executionMode: AdditionalSyntheticLiveLlmCaseExecutionMode`
 *   - `preflightSteps`, `promptComponents`, `promptBlockers`, `metadataCaptureFields`,
 *     `executionGates`, `executionBlockers` lists
 *
 * Key invariants (literal types):
 *   - `executionPlanOnly: true`
 *   - `futureDryRunAuthorizationRequired: true`
 *   - `oneFutureLiveLlmCallOnly: true`
 *   - `killSwitchRequiredForFutureCall: true`
 *   - `singleCallCounterRequiredForFutureCall: true`
 *   - `liveLLMCalledInExecutionPlan: false`
 *   - `additionalLiveLLMCallsExecuted: false`
 *   - `promptTextConstructedNow: false`
 *   - `promptTextAvailableInExecutionPlan: false`
 *   - `modelOutputAvailableInExecutionPlan: false`
 *   - All dangerous readiness flags: `false`
 *   - `neverUserVisible: true`
 *
 * Positive gates produced (only when `accepted`):
 *   - `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: true`
 *   - `additionalSyntheticCaseExecutionPlanAccepted: true`
 *
 * Status:
 *   - "planned"  — all invariants pass
 *   - "blocked"  — contract prerequisite not satisfied
 *   - "rejected" — at least one unsafe violation
 *
 * Builds on Phase 8.3S (Additional Synthetic Live LLM Case Contract).
 *
 * ISOLATION NOTE:
 *   Branch C / run-smart-talk.ts / extract-text-from-image.ts remain `false`.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionPlanStatus = "planned" | "blocked" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionPlanScope =
  | "execution_plan_only"
  | "contract_verified"
  | "selected_synthetic_case_only"
  | "explicit_payment_deadline_case"
  | "one_future_call_only"
  | "dry_run_authorization_required_next"
  | "kill_switch_required"
  | "single_call_counter_required"
  | "prompt_policy_defined"
  | "prompt_blockers_defined"
  | "metadata_capture_defined"
  | "execution_gates_defined"
  | "execution_blockers_defined"
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
  | "no_real_document_input";

// ── Provider / Model / Case ───────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionPlanProvider = "openai";
export type AdditionalSyntheticLiveLlmCaseExecutionPlanModel = "gpt_4o_mini";
export type AdditionalSyntheticLiveLlmCaseExecutionPlanCaseId =
  "synthetic_explicit_payment_deadline";

// ── Execution mode ────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionMode =
  | "preflight_plan_only"
  | "dry_run_authorization_allowed_next_phase";

// ── Preflight steps ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionPreflightStep =
  | "contract_verified"
  | "selected_case_verified"
  | "provider_verified"
  | "model_verified"
  | "synthetic_prompt_policy_reviewed"
  | "prompt_blockers_reviewed"
  | "no_real_input_verified"
  | "no_branch_c_verified"
  | "no_run_smart_talk_verified"
  | "no_ocr_runtime_verified"
  | "kill_switch_required_before_future_call"
  | "single_call_counter_required_before_future_call"
  | "api_key_presence_check_deferred_to_execution"
  | "prompt_text_construction_deferred_to_execution"
  | "prompt_text_logging_blocked"
  | "model_output_logging_blocked"
  | "metadata_only_capture_planned"
  | "post_call_governance_recheck_planned"
  | "post_call_audit_planned"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked";

// ── Prompt components ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePromptComponent =
  | "synthetic_payment_notice_marker"
  | "synthetic_amount_marker"
  | "explicit_payment_deadline_marker"
  | "synthetic_payment_context_marker"
  | "no_real_authority_marker"
  | "no_real_person_marker"
  | "no_address_marker"
  | "no_iban_marker"
  | "no_steuer_id_marker"
  | "no_aktenzeichen_marker"
  | "no_real_phone_email_marker"
  | "document_stated_deadline_only_instruction"
  | "no_legal_certainty_instruction"
  | "no_additional_deadline_invention_instruction"
  | "no_coercive_payment_instruction"
  | "consequence_uncertainty_instruction"
  | "untrusted_output_instruction"
  | "governance_recheck_instruction"
  | "user_visible_output_block_instruction";

// ── Prompt blockers ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCasePromptBlocker =
  | "real_authority_name_blocked"
  | "real_person_name_blocked"
  | "real_address_blocked"
  | "iban_blocked"
  | "steuer_id_blocked"
  | "aktenzeichen_blocked"
  | "real_phone_or_email_blocked"
  | "real_invoice_blocked"
  | "real_mahnung_blocked"
  | "real_payment_notice_blocked"
  | "real_document_content_blocked"
  | "legal_certainty_instruction_blocked"
  | "coercive_you_must_pay_blocked"
  | "public_runtime_payload_blocked"
  | "branch_c_payload_blocked"
  | "run_smart_talk_payload_blocked"
  | "ocr_runtime_payload_blocked"
  | "raw_input_payload_blocked"
  | "redacted_real_input_payload_blocked"
  | "model_output_payload_blocked";

// ── Metadata capture fields ───────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseMetadataCaptureField =
  | "execution_plan_id"
  | "selected_case_id"
  | "provider_id"
  | "model_id"
  | "execution_mode"
  | "contract_dependency_verified"
  | "one_future_call_only"
  | "kill_switch_required"
  | "single_call_counter_required"
  | "prompt_text_logged_false"
  | "prompt_text_stored_false"
  | "model_output_logged_false"
  | "model_output_stored_false"
  | "metadata_only_capture_required"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "real_document_input_blocked";

// ── Execution gates ───────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionGate =
  | "contract_gate"
  | "selected_case_gate"
  | "provider_gate"
  | "model_gate"
  | "one_future_call_gate"
  | "dry_run_authorization_gate"
  | "kill_switch_gate"
  | "single_call_counter_gate"
  | "synthetic_prompt_policy_gate"
  | "prompt_blocker_gate"
  | "prompt_non_logging_gate"
  | "model_output_non_logging_gate"
  | "metadata_capture_gate"
  | "post_call_governance_recheck_gate"
  | "post_call_audit_gate"
  | "no_real_input_gate"
  | "runtime_isolation_gate"
  | "no_user_visible_output_gate"
  | "no_persistence_gate"
  | "no_public_runtime_gate"
  | "no_real_document_input_gate";

// ── Execution blockers ────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionBlocker =
  | "contract_not_ready"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "execution_plan_attempted_live_call"
  | "dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
  | "prompt_policy_missing"
  | "prompt_blockers_missing"
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

export type AdditionalSyntheticLiveLlmCaseExecutionPlanChecklistItem =
  | "contract_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "execution_plan_only_reviewed"
  | "dry_run_authorization_next_reviewed"
  | "one_future_call_limit_reviewed"
  | "kill_switch_requirement_reviewed"
  | "counter_requirement_reviewed"
  | "prompt_components_reviewed"
  | "prompt_blockers_reviewed"
  | "metadata_capture_reviewed"
  | "execution_gates_reviewed"
  | "execution_blockers_reviewed"
  | "prompt_non_logging_reviewed"
  | "model_output_non_logging_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "runtime_isolation_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "next_phase_dry_run_authorization_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseExecutionPlanRejectionReason =
  | "contract_not_ready"
  | "missing_execution_plan_scope"
  | "missing_preflight_step"
  | "missing_prompt_component"
  | "missing_prompt_blocker"
  | "missing_metadata_capture_field"
  | "missing_execution_gate"
  | "missing_execution_blocker"
  | "missing_checklist_item"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "invalid_execution_mode"
  | "execution_plan_attempted_live_call"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "dry_run_authorization_missing"
  | "future_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
  | "prompt_text_constructed_now"
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
  | "unsafe_execution_plan_note_detected";

// ── Execution plan input ──────────────────────────────────────────────────────

/**
 * Input for the Additional Synthetic Live LLM Case Execution Plan validation.
 *
 * New fields vs Phase 8.3S:
 * - `executionPlanOnly: true` (literal)
 * - `promptTextConstructedNow: false` (literal) — no prompt built in this phase
 * - `promptTextAvailableInExecutionPlan: false` (literal)
 * - `modelOutputAvailableInExecutionPlan: false` (literal)
 * - `executionMode` — must be preflight_plan_only or dry_run_authorization_allowed_next_phase
 * - `preflightSteps`, `promptComponents`, `promptBlockers`, `metadataCaptureFields`,
 *   `executionGates`, `executionBlockers` — structured plan lists
 */
export interface AdditionalSyntheticLiveLlmCaseExecutionPlanInput {
  readonly executionPlanId: string;
  readonly epochId: "8.3T";
  readonly previousPhaseId: "8.3S";

  readonly contractReadyForExecutionPlan: boolean;

  readonly scopes: readonly AdditionalSyntheticLiveLlmCaseExecutionPlanScope[];
  readonly provider: AdditionalSyntheticLiveLlmCaseExecutionPlanProvider;
  readonly model: AdditionalSyntheticLiveLlmCaseExecutionPlanModel;
  readonly selectedCase: AdditionalSyntheticLiveLlmCaseExecutionPlanCaseId;
  readonly executionMode: AdditionalSyntheticLiveLlmCaseExecutionMode;

  readonly preflightSteps: readonly AdditionalSyntheticLiveLlmCaseExecutionPreflightStep[];
  readonly promptComponents: readonly AdditionalSyntheticLiveLlmCasePromptComponent[];
  readonly promptBlockers: readonly AdditionalSyntheticLiveLlmCasePromptBlocker[];
  readonly metadataCaptureFields: readonly AdditionalSyntheticLiveLlmCaseMetadataCaptureField[];
  readonly executionGates: readonly AdditionalSyntheticLiveLlmCaseExecutionGate[];
  readonly executionBlockers: readonly AdditionalSyntheticLiveLlmCaseExecutionBlocker[];
  readonly checklistConfirmed: readonly AdditionalSyntheticLiveLlmCaseExecutionPlanChecklistItem[];

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: true;
  readonly additionalSyntheticCaseExecutionPlanAccepted: true;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInExecutionPlan: false;
  readonly modelOutputAvailableInExecutionPlan: false;
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

  readonly operatorExecutionPlanAcknowledgment: string;
  readonly reviewerExecutionPlanAcknowledgment: string;
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

// ── Execution plan result ─────────────────────────────────────────────────────

/**
 * Result of validating an `AdditionalSyntheticLiveLlmCaseExecutionPlanInput`.
 *
 * Positive gates (true only when accepted):
 *   - `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization`
 *   - `additionalSyntheticCaseExecutionPlanAccepted`
 *
 * All dangerous readiness flags remain literal `false`.
 */
export interface AdditionalSyntheticLiveLlmCaseExecutionPlanResult {
  readonly executionPlanId: string;
  readonly epochId: "8.3T";
  readonly status: AdditionalSyntheticLiveLlmCaseExecutionPlanStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AdditionalSyntheticLiveLlmCaseExecutionPlanRejectionReason[];

  readonly safeExecutionPlanMetadata: {
    readonly scopeCount: number;
    readonly provider: AdditionalSyntheticLiveLlmCaseExecutionPlanProvider;
    readonly model: AdditionalSyntheticLiveLlmCaseExecutionPlanModel;
    readonly selectedCase: AdditionalSyntheticLiveLlmCaseExecutionPlanCaseId;
    readonly executionMode: AdditionalSyntheticLiveLlmCaseExecutionMode;
    readonly preflightStepCount: number;
    readonly promptComponentCount: number;
    readonly promptBlockerCount: number;
    readonly metadataCaptureFieldCount: number;
    readonly executionGateCount: number;
    readonly executionBlockerCount: number;
    readonly checklistPassedCount: number;
    readonly executionPlanOnly: true;
    readonly oneFutureLiveLlmCallOnly: true;
  };

  readonly readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: boolean;
  readonly additionalSyntheticCaseExecutionPlanAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInExecutionPlan: false;
  readonly modelOutputAvailableInExecutionPlan: false;
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

  readonly apiRouteModifiedByExecutionPlan: false;
  readonly existingRuntimeModifiedByExecutionPlan: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByExecutionPlan: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAdditionalSyntheticLiveLlmCaseExecutionPlan()` (Phase 8.3T).
 *
 * `allPassed` is true when:
 * 1. The 8.3S contract prerequisite is verified.
 * 2. The execution plan input is accepted.
 * 3. All tamper cases are rejected.
 *
 * Positive gates: `readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization`
 * and `additionalSyntheticCaseExecutionPlanAccepted`.
 */
export interface AdditionalSyntheticLiveLlmCaseExecutionPlanCheckResult {
  readonly checkId: "8.3T";
  readonly allPassed: boolean;
  readonly contractReadyForExecutionPlan: boolean;
  readonly additionalSyntheticLiveLlmCaseExecutionPlanAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: boolean;
  readonly additionalSyntheticCaseExecutionPlanAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInExecutionPlan: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInExecutionPlan: false;
  readonly modelOutputAvailableInExecutionPlan: false;
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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_SCOPES: readonly AdditionalSyntheticLiveLlmCaseExecutionPlanScope[] =
  [
    "execution_plan_only",
    "contract_verified",
    "selected_synthetic_case_only",
    "explicit_payment_deadline_case",
    "one_future_call_only",
    "dry_run_authorization_required_next",
    "kill_switch_required",
    "single_call_counter_required",
    "prompt_policy_defined",
    "prompt_blockers_defined",
    "metadata_capture_defined",
    "execution_gates_defined",
    "execution_blockers_defined",
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
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PREFLIGHT_STEPS: readonly AdditionalSyntheticLiveLlmCaseExecutionPreflightStep[] =
  [
    "contract_verified",
    "selected_case_verified",
    "provider_verified",
    "model_verified",
    "synthetic_prompt_policy_reviewed",
    "prompt_blockers_reviewed",
    "no_real_input_verified",
    "no_branch_c_verified",
    "no_run_smart_talk_verified",
    "no_ocr_runtime_verified",
    "kill_switch_required_before_future_call",
    "single_call_counter_required_before_future_call",
    "api_key_presence_check_deferred_to_execution",
    "prompt_text_construction_deferred_to_execution",
    "prompt_text_logging_blocked",
    "model_output_logging_blocked",
    "metadata_only_capture_planned",
    "post_call_governance_recheck_planned",
    "post_call_audit_planned",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_COMPONENTS: readonly AdditionalSyntheticLiveLlmCasePromptComponent[] =
  [
    "synthetic_payment_notice_marker",
    "synthetic_amount_marker",
    "explicit_payment_deadline_marker",
    "synthetic_payment_context_marker",
    "no_real_authority_marker",
    "no_real_person_marker",
    "no_address_marker",
    "no_iban_marker",
    "no_steuer_id_marker",
    "no_aktenzeichen_marker",
    "no_real_phone_email_marker",
    "document_stated_deadline_only_instruction",
    "no_legal_certainty_instruction",
    "no_additional_deadline_invention_instruction",
    "no_coercive_payment_instruction",
    "consequence_uncertainty_instruction",
    "untrusted_output_instruction",
    "governance_recheck_instruction",
    "user_visible_output_block_instruction",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_BLOCKERS: readonly AdditionalSyntheticLiveLlmCasePromptBlocker[] =
  [
    "real_authority_name_blocked",
    "real_person_name_blocked",
    "real_address_blocked",
    "iban_blocked",
    "steuer_id_blocked",
    "aktenzeichen_blocked",
    "real_phone_or_email_blocked",
    "real_invoice_blocked",
    "real_mahnung_blocked",
    "real_payment_notice_blocked",
    "real_document_content_blocked",
    "legal_certainty_instruction_blocked",
    "coercive_you_must_pay_blocked",
    "public_runtime_payload_blocked",
    "branch_c_payload_blocked",
    "run_smart_talk_payload_blocked",
    "ocr_runtime_payload_blocked",
    "raw_input_payload_blocked",
    "redacted_real_input_payload_blocked",
    "model_output_payload_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_METADATA_CAPTURE_FIELDS: readonly AdditionalSyntheticLiveLlmCaseMetadataCaptureField[] =
  [
    "execution_plan_id",
    "selected_case_id",
    "provider_id",
    "model_id",
    "execution_mode",
    "contract_dependency_verified",
    "one_future_call_only",
    "kill_switch_required",
    "single_call_counter_required",
    "prompt_text_logged_false",
    "prompt_text_stored_false",
    "model_output_logged_false",
    "model_output_stored_false",
    "metadata_only_capture_required",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "real_document_input_blocked",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_GATES: readonly AdditionalSyntheticLiveLlmCaseExecutionGate[] =
  [
    "contract_gate",
    "selected_case_gate",
    "provider_gate",
    "model_gate",
    "one_future_call_gate",
    "dry_run_authorization_gate",
    "kill_switch_gate",
    "single_call_counter_gate",
    "synthetic_prompt_policy_gate",
    "prompt_blocker_gate",
    "prompt_non_logging_gate",
    "model_output_non_logging_gate",
    "metadata_capture_gate",
    "post_call_governance_recheck_gate",
    "post_call_audit_gate",
    "no_real_input_gate",
    "runtime_isolation_gate",
    "no_user_visible_output_gate",
    "no_persistence_gate",
    "no_public_runtime_gate",
    "no_real_document_input_gate",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_BLOCKERS: readonly AdditionalSyntheticLiveLlmCaseExecutionBlocker[] =
  [
    "contract_not_ready",
    "selected_case_invalid",
    "provider_invalid",
    "model_invalid",
    "execution_plan_attempted_live_call",
    "dry_run_authorization_missing",
    "future_call_limit_missing",
    "kill_switch_missing",
    "single_call_counter_missing",
    "prompt_policy_missing",
    "prompt_blockers_missing",
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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_CHECKLIST: readonly AdditionalSyntheticLiveLlmCaseExecutionPlanChecklistItem[] =
  [
    "contract_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "execution_plan_only_reviewed",
    "dry_run_authorization_next_reviewed",
    "one_future_call_limit_reviewed",
    "kill_switch_requirement_reviewed",
    "counter_requirement_reviewed",
    "prompt_components_reviewed",
    "prompt_blockers_reviewed",
    "metadata_capture_reviewed",
    "execution_gates_reviewed",
    "execution_blockers_reviewed",
    "prompt_non_logging_reviewed",
    "model_output_non_logging_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "runtime_isolation_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "next_phase_dry_run_authorization_required",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is an execution plan only and does not call a live LLM.",
    "I acknowledge that the selected case is synthetic_explicit_payment_deadline only.",
    "I acknowledge that the next phase must perform dry-run authorization before any future call.",
    "I acknowledge that prompt text and model output must remain unavailable in this execution plan.",
    "I acknowledge that real documents, public runtime, persistence, and user-visible output remain blocked.",
  ] as const;

export const FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_STRINGS: readonly string[] =
  [
    // Inherited from 8.3S (79)
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
    // New in 8.3T (9)
    "payment execution live now",
    "synthetic payment call executed",
    "payment prompt constructed",
    "payment model output",
    "real payment notice ready",
    "real invoice ready",
    "public payment explanation ready",
    "payment output user visible",
    "real document payment runtime",
  ] as const;
