/**
 * Live LLM Synthetic Single-Call Execution Plan Types (Phase 8.3M).
 *
 * Defines the typed pre-flight execution plan for a future, separate phase
 * (8.3N) that may perform exactly ONE controlled live LLM call with ONE
 * synthetic case.
 *
 * This phase is EXECUTION PLAN ONLY. It does NOT:
 * - call a live LLM
 * - read process.env
 * - import any LLM SDK
 * - make HTTP requests
 * - construct prompt text
 * - log prompt text or model output
 * - process real user input
 * - generate AI output
 * - persist data
 * - emit user-visible output
 * - authorize general live LLM runtime
 * - authorize more than one future live LLM call
 *
 * The plan specifies:
 *   - Kill-switch arm/disarm procedure
 *   - Single-call counter initialize/verify procedure
 *   - Env presence check policy (no value logging)
 *   - Prompt component requirements and blockers
 *   - Metadata-only capture plan
 *   - Execution gates and blockers
 *   - Post-call governance recheck and audit requirements
 *
 * Builds on Phase 8.3L (Live LLM Synthetic Single-Call Contract).
 *
 * Selected provider: openai
 * Selected model:    gpt_4o_mini
 * Selected case:     synthetic_deadline_relative_missing_delivery_date
 *
 * ISOLATION NOTE:
 *   All flags for Branch C / run-smart-talk.ts / extract-text-from-image.ts
 *   remain literal `false` in every interface.
 *
 * Key literal invariants on all three interfaces:
 *   - `executionPlanOnly: true`
 *   - `futureDryRunAuthorizationRequired: true`
 *   - `futureSingleLiveLlmSyntheticCallOnly: true`
 *   - `generalLiveLlmRuntimeAuthorizationAllowed: false`
 *   - `multipleLiveLlmCallsAllowed: false`
 *   - `providerAllowlisted: true`, `modelAllowlisted: true`
 *   - `killSwitchProcedureRequired: true`
 *   - `singleCallCounterProcedureRequired: true`
 *   - `postCallGovernanceRecheckRequired: true`
 *   - `postCallAuditRequired: true`
 *   - `liveLLMCallPerformed: false` / `liveLLMCalled: false`
 *   - `envReadPerformed: false`
 *   - `sdkImported: false`
 *   - `httpCallMade: false`
 *   - `promptTextConstructedNow: false`
 *   - `promptTextLogged: false`
 *   - `modelOutputLogged: false`
 *   - All real/raw/OCR/file/public input channels: `false`
 *   - All existing runtime dependency flags: `false`
 *   - All AI-output/model/persistence/public/user-visible flags: `false`
 *   - `neverUserVisible: true`
 *
 * The only new positive gate: `readyForLiveLlmSyntheticSingleCallDryRunAuthorization`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanStatus = "valid" | "rejected";

// ── Execution mode ────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionMode =
  | "preflight_plan_only"
  | "dry_run_authorization_allowed_next_phase";

// ── Preflight steps ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallPreflightStep =
  | "single_call_contract_reviewed"
  | "provider_model_selection_reviewed"
  | "selected_synthetic_case_reviewed"
  | "kill_switch_arm_required"
  | "kill_switch_disarm_required_after_call"
  | "single_call_counter_initialize_required"
  | "single_call_counter_must_equal_zero_before_call"
  | "single_call_counter_must_equal_one_after_call"
  | "env_presence_check_required_next_phase"
  | "env_values_must_not_be_logged"
  | "sdk_or_http_client_must_be_isolated_next_phase"
  | "prompt_policy_enforced"
  | "prompt_text_must_not_be_logged"
  | "model_output_must_not_be_logged"
  | "model_output_must_not_be_persisted"
  | "metadata_only_capture_required"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required";

// ── Prompt components ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanPromptComponent =
  | "synthetic_case_id"
  | "synthetic_case_marker"
  | "synthetic_task_instruction"
  | "uncertainty_preservation_instruction"
  | "deadline_uncertainty_instruction"
  | "no_legal_certainty_instruction"
  | "output_schema_marker"
  | "governance_recheck_marker"
  | "untrusted_model_output_marker";

// ── Prompt blockers ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanPromptBlocker =
  | "real_document_text"
  | "raw_user_text"
  | "real_redacted_text"
  | "ocr_text"
  | "uploaded_file_content"
  | "public_request_text"
  | "pii"
  | "secret"
  | "env_value"
  | "legal_certainty_instruction"
  | "deadline_certainty_instruction"
  | "user_visible_return_instruction"
  | "persistence_instruction"
  | "branch_c_payload"
  | "run_smart_talk_payload"
  | "ocr_runtime_payload";

// ── Metadata capture plan ─────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanMetadataCapture =
  | "provider_id"
  | "model_id"
  | "synthetic_case_id"
  | "call_authorization_id"
  | "single_call_counter_before"
  | "single_call_counter_after"
  | "kill_switch_state_before"
  | "kill_switch_state_after"
  | "prompt_policy_version"
  | "prompt_text_logged_false"
  | "model_output_logged_false"
  | "model_output_stored_false"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "governance_recheck_required"
  | "post_call_audit_required";

// ── Execution gates ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanGate =
  | "authorization_contract_gate"
  | "kill_switch_gate"
  | "provider_allowlist_gate"
  | "model_allowlist_gate"
  | "single_call_counter_gate"
  | "synthetic_case_gate"
  | "prompt_policy_gate"
  | "blocked_payload_gate"
  | "no_branch_c_gate"
  | "no_run_smart_talk_gate"
  | "no_ocr_runtime_gate"
  | "metadata_only_capture_gate"
  | "post_call_governance_recheck_gate"
  | "post_call_audit_gate"
  | "no_user_visible_output_gate"
  | "no_persistence_gate"
  | "no_public_runtime_gate";

// ── Execution blockers ────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanBlocker =
  | "contract_not_ready"
  | "kill_switch_missing"
  | "kill_switch_not_armed"
  | "single_call_counter_missing"
  | "single_call_counter_not_zero"
  | "provider_not_allowlisted"
  | "model_not_allowlisted"
  | "invalid_synthetic_case"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "prompt_policy_violation"
  | "blocked_payload_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "user_visible_output_attempted"
  | "persistence_attempted"
  | "public_runtime_attempted"
  | "model_output_storage_attempted"
  | "missing_post_call_governance_recheck"
  | "missing_post_call_audit";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanChecklistItem =
  | "execution_mode_reviewed"
  | "preflight_steps_reviewed"
  | "prompt_components_reviewed"
  | "prompt_blockers_reviewed"
  | "metadata_capture_reviewed"
  | "execution_gates_reviewed"
  | "execution_blockers_reviewed"
  | "provider_model_case_reviewed"
  | "kill_switch_procedure_reviewed"
  | "single_call_counter_procedure_reviewed"
  | "no_env_value_logging_reviewed"
  | "no_prompt_logging_reviewed"
  | "no_model_output_logging_reviewed"
  | "no_model_output_storage_reviewed"
  | "no_real_input_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "post_call_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "next_phase_dry_run_authorization_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionPlanRejectionReason =
  | "single_call_contract_not_ready"
  | "invalid_execution_mode"
  | "missing_preflight_step"
  | "missing_prompt_component"
  | "missing_prompt_blocker"
  | "missing_metadata_capture"
  | "missing_execution_gate"
  | "missing_execution_blocker"
  | "missing_checklist_item"
  | "invalid_provider"
  | "invalid_model"
  | "invalid_selected_synthetic_case"
  | "planning_attempted_live_llm_call"
  | "planning_attempted_env_read"
  | "planning_attempted_sdk_import"
  | "planning_attempted_http_call"
  | "planning_attempted_general_runtime_authorization"
  | "planning_attempted_multiple_call_authorization"
  | "planning_attempted_real_input_processing"
  | "planning_attempted_raw_input_forwarding"
  | "planning_attempted_redacted_input_forwarding"
  | "planning_attempted_photo_ocr_file_processing"
  | "planning_attempted_branch_c_dependency"
  | "planning_attempted_run_smart_talk_dependency"
  | "planning_attempted_ocr_runtime_dependency"
  | "planning_attempted_ai_output_generation"
  | "planning_attempted_model_output_storage"
  | "planning_attempted_user_visible_output"
  | "planning_attempted_persistence"
  | "planning_attempted_public_runtime"
  | "planning_attempted_real_operator_pilot"
  | "missing_kill_switch_procedure"
  | "missing_single_call_counter_procedure"
  | "missing_post_call_governance_recheck"
  | "missing_post_call_audit"
  | "unsafe_execution_plan_note_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected";

// ── Execution plan input ──────────────────────────────────────────────────────

/**
 * Input for the Live LLM Synthetic Single-Call Execution Plan validation.
 *
 * `executionPlanOnly: true` — this phase defines a plan, not execution.
 * `futureDryRunAuthorizationRequired: true` — Phase 8.3N must explicitly
 *   authorize before any actual call can proceed.
 * `futureSingleLiveLlmSyntheticCallOnly: true` — exactly one future call.
 * `promptTextConstructedNow: false` — prompt is not built in this phase.
 * `promptTextLogged: false` — prompt text is never logged.
 * `modelOutputLogged: false` — model output is never logged.
 *
 * `readyForLiveLlmSyntheticSingleCallDryRunAuthorization` is the only new
 * positive gate produced by Phase 8.3M.
 */
export interface LiveLlmSyntheticSingleCallExecutionPlanInput {
  readonly planId: string;
  readonly epochId: "8.3M";
  readonly previousPhaseId: "8.3L";

  readonly singleCallContractReadyForExecutionPlan: boolean;

  readonly executionMode: LiveLlmSyntheticSingleCallExecutionMode;
  readonly provider: "openai";
  readonly model: "gpt_4o_mini";
  readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";

  readonly preflightSteps: readonly LiveLlmSyntheticSingleCallPreflightStep[];
  readonly promptComponents: readonly LiveLlmSyntheticSingleCallExecutionPlanPromptComponent[];
  readonly promptBlockers: readonly LiveLlmSyntheticSingleCallExecutionPlanPromptBlocker[];
  readonly metadataCapture: readonly LiveLlmSyntheticSingleCallExecutionPlanMetadataCapture[];
  readonly executionGates: readonly LiveLlmSyntheticSingleCallExecutionPlanGate[];
  readonly executionBlockers: readonly LiveLlmSyntheticSingleCallExecutionPlanBlocker[];
  readonly checklistConfirmed: readonly LiveLlmSyntheticSingleCallExecutionPlanChecklistItem[];

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchProcedureRequired: true;
  readonly singleCallCounterProcedureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCallPerformed: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

  readonly promptTextConstructedNow: false;
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

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlan: false;

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
 * Result of validating a `LiveLlmSyntheticSingleCallExecutionPlanInput`.
 *
 * `readyForLiveLlmSyntheticSingleCallDryRunAuthorization` is `true` only when
 * `accepted`. This is the only new positive gate produced by Phase 8.3M.
 *
 * `safeExecutionPlanMetadata` contains only counts and allowed enum values.
 */
export interface LiveLlmSyntheticSingleCallExecutionPlanResult {
  readonly planId: string;
  readonly epochId: "8.3M";
  readonly status: LiveLlmSyntheticSingleCallExecutionPlanStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmSyntheticSingleCallExecutionPlanRejectionReason[];

  readonly safeExecutionPlanMetadata: {
    readonly provider: "openai";
    readonly model: "gpt_4o_mini";
    readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";
    readonly preflightStepCount: number;
    readonly promptComponentCount: number;
    readonly promptBlockerCount: number;
    readonly metadataCaptureCount: number;
    readonly executionGateCount: number;
    readonly executionBlockerCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForLiveLlmSyntheticSingleCallDryRunAuthorization: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchProcedureRequired: true;
  readonly singleCallCounterProcedureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;
  readonly apiRouteCalled: false;

  readonly promptTextConstructedNow: false;
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

  readonly aiOutputGenerationPerformed: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly userVisibleOutputAuthorizedByPlan: false;

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
 * Result of `runLiveLlmSyntheticSingleCallExecutionPlan()` (Phase 8.3M).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3L single-call contract dependency is verified.
 * 2. The execution plan input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForLiveLlmSyntheticSingleCallDryRunAuthorization` is the only new
 * positive gate.
 */
export interface LiveLlmSyntheticSingleCallExecutionPlanCheckResult {
  readonly checkId: "8.3M";
  readonly allPassed: boolean;
  readonly singleCallContractReadyForExecutionPlan: boolean;
  readonly liveLlmSyntheticSingleCallExecutionPlanAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForLiveLlmSyntheticSingleCallDryRunAuthorization: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly executionPlanOnly: true;
  readonly futureDryRunAuthorizationRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchProcedureRequired: true;
  readonly singleCallCounterProcedureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

  readonly promptTextConstructedNow: false;
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

  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly userVisibleOutputEmitted: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS: readonly LiveLlmSyntheticSingleCallPreflightStep[] =
  [
    "single_call_contract_reviewed",
    "provider_model_selection_reviewed",
    "selected_synthetic_case_reviewed",
    "kill_switch_arm_required",
    "kill_switch_disarm_required_after_call",
    "single_call_counter_initialize_required",
    "single_call_counter_must_equal_zero_before_call",
    "single_call_counter_must_equal_one_after_call",
    "env_presence_check_required_next_phase",
    "env_values_must_not_be_logged",
    "sdk_or_http_client_must_be_isolated_next_phase",
    "prompt_policy_enforced",
    "prompt_text_must_not_be_logged",
    "model_output_must_not_be_logged",
    "model_output_must_not_be_persisted",
    "metadata_only_capture_required",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS: readonly LiveLlmSyntheticSingleCallExecutionPlanPromptComponent[] =
  [
    "synthetic_case_id",
    "synthetic_case_marker",
    "synthetic_task_instruction",
    "uncertainty_preservation_instruction",
    "deadline_uncertainty_instruction",
    "no_legal_certainty_instruction",
    "output_schema_marker",
    "governance_recheck_marker",
    "untrusted_model_output_marker",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS: readonly LiveLlmSyntheticSingleCallExecutionPlanPromptBlocker[] =
  [
    "real_document_text",
    "raw_user_text",
    "real_redacted_text",
    "ocr_text",
    "uploaded_file_content",
    "public_request_text",
    "pii",
    "secret",
    "env_value",
    "legal_certainty_instruction",
    "deadline_certainty_instruction",
    "user_visible_return_instruction",
    "persistence_instruction",
    "branch_c_payload",
    "run_smart_talk_payload",
    "ocr_runtime_payload",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE: readonly LiveLlmSyntheticSingleCallExecutionPlanMetadataCapture[] =
  [
    "provider_id",
    "model_id",
    "synthetic_case_id",
    "call_authorization_id",
    "single_call_counter_before",
    "single_call_counter_after",
    "kill_switch_state_before",
    "kill_switch_state_after",
    "prompt_policy_version",
    "prompt_text_logged_false",
    "model_output_logged_false",
    "model_output_stored_false",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "governance_recheck_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES: readonly LiveLlmSyntheticSingleCallExecutionPlanGate[] =
  [
    "authorization_contract_gate",
    "kill_switch_gate",
    "provider_allowlist_gate",
    "model_allowlist_gate",
    "single_call_counter_gate",
    "synthetic_case_gate",
    "prompt_policy_gate",
    "blocked_payload_gate",
    "no_branch_c_gate",
    "no_run_smart_talk_gate",
    "no_ocr_runtime_gate",
    "metadata_only_capture_gate",
    "post_call_governance_recheck_gate",
    "post_call_audit_gate",
    "no_user_visible_output_gate",
    "no_persistence_gate",
    "no_public_runtime_gate",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS: readonly LiveLlmSyntheticSingleCallExecutionPlanBlocker[] =
  [
    "contract_not_ready",
    "kill_switch_missing",
    "kill_switch_not_armed",
    "single_call_counter_missing",
    "single_call_counter_not_zero",
    "provider_not_allowlisted",
    "model_not_allowlisted",
    "invalid_synthetic_case",
    "real_input_detected",
    "raw_input_detected",
    "real_redacted_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "prompt_policy_violation",
    "blocked_payload_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "user_visible_output_attempted",
    "persistence_attempted",
    "public_runtime_attempted",
    "model_output_storage_attempted",
    "missing_post_call_governance_recheck",
    "missing_post_call_audit",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST: readonly LiveLlmSyntheticSingleCallExecutionPlanChecklistItem[] =
  [
    "execution_mode_reviewed",
    "preflight_steps_reviewed",
    "prompt_components_reviewed",
    "prompt_blockers_reviewed",
    "metadata_capture_reviewed",
    "execution_gates_reviewed",
    "execution_blockers_reviewed",
    "provider_model_case_reviewed",
    "kill_switch_procedure_reviewed",
    "single_call_counter_procedure_reviewed",
    "no_env_value_logging_reviewed",
    "no_prompt_logging_reviewed",
    "no_model_output_logging_reviewed",
    "no_model_output_storage_reviewed",
    "no_real_input_reviewed",
    "existing_runtime_isolation_reviewed",
    "post_call_recheck_reviewed",
    "post_call_audit_reviewed",
    "next_phase_dry_run_authorization_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is an execution plan only and does not call a live LLM.",
    "I acknowledge that the next phase must explicitly authorize one synthetic dry-run live LLM call before execution.",
    "I acknowledge that prompt text and model output must not be logged or persisted.",
    "I acknowledge that real input, OCR, files, public requests, Branch C, run-smart-talk.ts, and persistence remain blocked.",
    "I acknowledge that live LLM runtime and public launch are not authorized by this execution plan.",
  ] as const;

export const FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_STRINGS: readonly string[] =
  [
    "sk-",
    "OPENAI_API_KEY=",
    "VAYLO_INTERNAL_RUNTIME_SECRET=",
    "process.env",
    "apiKey",
    "internalSecret",
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
    "live llm call performed",
    "multiple live llm calls authorized",
    "general live llm runtime authorized",
    "single live llm call executed",
    "model output returned to user",
    "stored prompt",
    "stored completion",
    "prompt text logged",
    "model output logged",
    "live llm dry run executed",
  ] as const;
