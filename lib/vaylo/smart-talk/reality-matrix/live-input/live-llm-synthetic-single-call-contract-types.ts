/**
 * Live LLM Synthetic Single-Call Contract Types (Phase 8.3L).
 *
 * Defines the typed contract layer specifying the exact requirements for a
 * future, separate phase (8.3M) that may perform exactly ONE controlled live
 * LLM call with ONE synthetic case.
 *
 * This phase is CONTRACT ONLY. It does NOT:
 * - call a live LLM
 * - read process.env
 * - import any LLM SDK
 * - make HTTP requests
 * - process real user input
 * - generate AI output
 * - persist data
 * - emit user-visible output
 * - authorize general live LLM runtime
 * - authorize more than one future live LLM call
 *
 * Selected provider: openai
 * Selected model:    gpt_4o_mini
 * Selected case:     synthetic_deadline_relative_missing_delivery_date
 *
 * The future execution (Phase 8.3M) must be:
 *   - one call only (single-call counter enforced)
 *   - synthetic input only (no real user input)
 *   - provider/model allowlisted (openai / gpt_4o_mini)
 *   - guarded by kill switch
 *   - isolated from Branch C / run-smart-talk.ts / OCR runtime
 *   - no raw/real redacted input
 *   - no OCR/file/photo input
 *   - no public request
 *   - no user-visible output
 *   - no persistence (no prompt logging, no model output storage)
 *   - metadata-only capture
 *   - model output treated as untrusted
 *   - post-call governance recheck required
 *   - post-call audit required
 *
 * Builds on Phase 8.3K (Live LLM Synthetic Authorization Planning).
 *
 * ISOLATION NOTE:
 *   Phase 8.3B isolated `app/api/smart-talk/route.ts` Branch C,
 *   `lib/vaylo/smart-talk/run-smart-talk.ts`, and
 *   `lib/vaylo/smart-talk/extract-text-from-image.ts` from the governance
 *   chain. All related flags remain literal `false` in every interface here.
 *
 * Key literal invariants on input AND result AND check-result interfaces:
 *   - `contractOnly: true`
 *   - `futureExecutionPlanRequired: true`
 *   - `futureSingleLiveLlmSyntheticCallOnly: true`
 *   - `generalLiveLlmRuntimeAuthorizationAllowed: false`
 *   - `multipleLiveLlmCallsAllowed: false`
 *   - `providerAllowlisted: true`
 *   - `modelAllowlisted: true`
 *   - `killSwitchRequired: true`
 *   - `singleCallCounterRequired: true`
 *   - `postCallGovernanceRecheckRequired: true`
 *   - `postCallAuditRequired: true`
 *   - `liveLLMCallPerformed: false` / `liveLLMCalled: false`
 *   - `envReadPerformed: false`
 *   - `sdkImported: false`
 *   - `httpCallMade: false`
 *   - All real/raw/OCR/file/public input channels: `false`
 *   - All existing runtime dependency flags: `false`
 *   - All AI-output/model/persistence/public/user-visible flags: `false`
 *   - `neverUserVisible: true`
 *
 * The only new positive gate: `readyForLiveLlmSyntheticSingleCallExecutionPlan`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallContractStatus = "valid" | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallScope =
  | "one_call_only"
  | "one_synthetic_case_only"
  | "synthetic_input_only"
  | "no_real_user_input"
  | "no_raw_input"
  | "no_real_redacted_input"
  | "no_photo_or_ocr_input"
  | "no_file_upload_input"
  | "no_public_request_input"
  | "no_branch_c_runtime"
  | "no_run_smart_talk_runtime"
  | "no_ocr_runtime"
  | "no_general_live_llm_runtime"
  | "no_persistence"
  | "no_user_visible_output"
  | "metadata_only_capture"
  | "model_output_untrusted"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required";

// ── Provider / Model / Case ───────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallProvider = "openai";

export type LiveLlmSyntheticSingleCallModel = "gpt_4o_mini";

export type LiveLlmSyntheticSingleCallSelectedCase =
  "synthetic_deadline_relative_missing_delivery_date";

// ── Prompt policies ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallPromptPolicy =
  | "synthetic_prompt_template_required"
  | "synthetic_case_marker_required"
  | "no_real_document_text"
  | "no_raw_text"
  | "no_real_redacted_text"
  | "no_ocr_text"
  | "no_file_content"
  | "no_public_request_text"
  | "no_pii"
  | "no_secret"
  | "no_deadline_certainty_instruction"
  | "no_legal_certainty_instruction"
  | "uncertainty_preservation_instruction_required"
  | "model_must_be_told_output_is_untrusted"
  | "output_must_be_structured_for_governance_recheck";

// ── Execution guards ──────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionGuard =
  | "kill_switch_required"
  | "provider_allowlist_required"
  | "model_allowlist_required"
  | "single_call_counter_required"
  | "operator_ack_required"
  | "reviewer_ack_required"
  | "execution_phase_must_validate_env_presence_without_logging_value"
  | "execution_phase_must_not_log_prompt_text"
  | "execution_phase_must_not_log_model_output"
  | "execution_phase_must_not_store_model_output"
  | "execution_phase_must_capture_metadata_only"
  | "execution_phase_must_run_post_call_governance_recheck"
  | "execution_phase_must_run_post_call_audit";

// ── Blocked payloads ──────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallBlockedPayload =
  | "real_user_document"
  | "real_user_photo"
  | "real_ocr_text"
  | "real_raw_text"
  | "real_redacted_text"
  | "uploaded_file_content"
  | "public_request_content"
  | "private_user_pii"
  | "secrets_or_api_keys"
  | "full_document_text"
  | "production_runtime_payload"
  | "existing_branch_c_payload"
  | "run_smart_talk_payload"
  | "ocr_runtime_payload";

// ── Post-call metadata ────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallPostCallMetadata =
  | "provider_id"
  | "model_id"
  | "synthetic_case_id"
  | "single_call_counter"
  | "kill_switch_state"
  | "call_authorization_id"
  | "prompt_policy_version"
  | "governance_recheck_required"
  | "post_call_audit_required"
  | "no_prompt_text_logged"
  | "no_model_output_logged"
  | "no_model_output_stored"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked";

// ── Recheck requirements ──────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallRecheckRequirement =
  | "mark_model_output_untrusted"
  | "run_reality_matrix_recheck"
  | "run_evidence_gate_recheck"
  | "run_hallucination_trap_recheck"
  | "run_deadline_claim_recheck"
  | "run_uncertainty_preservation_recheck"
  | "run_manual_review_before_user_visible_policy"
  | "keep_user_visible_output_blocked"
  | "keep_persistence_blocked"
  | "keep_public_runtime_blocked";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallChecklistItem =
  | "authorization_planning_reviewed"
  | "scope_reviewed"
  | "provider_reviewed"
  | "model_reviewed"
  | "selected_synthetic_case_reviewed"
  | "prompt_policy_reviewed"
  | "execution_guards_reviewed"
  | "blocked_payloads_reviewed"
  | "post_call_metadata_reviewed"
  | "recheck_requirements_reviewed"
  | "one_call_limit_reviewed"
  | "kill_switch_reviewed"
  | "no_real_input_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "no_persistence_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_public_runtime_reviewed"
  | "next_phase_execution_plan_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallRejectionReason =
  | "authorization_planning_not_ready"
  | "missing_scope"
  | "invalid_provider"
  | "invalid_model"
  | "invalid_selected_synthetic_case"
  | "missing_prompt_policy"
  | "missing_execution_guard"
  | "missing_blocked_payload"
  | "missing_post_call_metadata"
  | "missing_recheck_requirement"
  | "missing_checklist_item"
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
  | "missing_kill_switch_guard"
  | "missing_single_call_counter_guard"
  | "missing_post_call_governance_recheck"
  | "missing_post_call_audit"
  | "unsafe_contract_note_detected"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected";

// ── Contract input ────────────────────────────────────────────────────────────

/**
 * Input for the Live LLM Synthetic Single-Call Contract validation.
 *
 * `contractOnly: true` — this phase is contract definition, not execution.
 * `futureExecutionPlanRequired: true` — an execution plan (8.3M) must follow.
 * `futureSingleLiveLlmSyntheticCallOnly: true` — exactly one future call.
 * `generalLiveLlmRuntimeAuthorizationAllowed: false` — literal; blocked.
 * `multipleLiveLlmCallsAllowed: false` — literal; blocked.
 * `killSwitchRequired: true` — literal; mandatory.
 * `singleCallCounterRequired: true` — literal; mandatory.
 * `liveLLMCallPerformed: false` — literal; this phase makes no call.
 *
 * `readyForLiveLlmSyntheticSingleCallExecutionPlan` is the only positive gate
 * produced by this phase (set to `true` only when the contract is accepted).
 */
export interface LiveLlmSyntheticSingleCallContractInput {
  readonly contractId: string;
  readonly epochId: "8.3L";
  readonly previousPhaseId: "8.3K";

  readonly authorizationPlanningReadyForSingleCallContract: boolean;

  readonly scopes: readonly LiveLlmSyntheticSingleCallScope[];
  readonly provider: LiveLlmSyntheticSingleCallProvider;
  readonly model: LiveLlmSyntheticSingleCallModel;
  readonly selectedSyntheticCase: LiveLlmSyntheticSingleCallSelectedCase;
  readonly promptPolicies: readonly LiveLlmSyntheticSingleCallPromptPolicy[];
  readonly executionGuards: readonly LiveLlmSyntheticSingleCallExecutionGuard[];
  readonly blockedPayloads: readonly LiveLlmSyntheticSingleCallBlockedPayload[];
  readonly postCallMetadata: readonly LiveLlmSyntheticSingleCallPostCallMetadata[];
  readonly recheckRequirements: readonly LiveLlmSyntheticSingleCallRecheckRequirement[];
  readonly checklistConfirmed: readonly LiveLlmSyntheticSingleCallChecklistItem[];

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchRequired: true;
  readonly singleCallCounterRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCallPerformed: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

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
  readonly userVisibleOutputAuthorizedByContract: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorSingleCallContractAcknowledgment: string;
  readonly reviewerSingleCallContractAcknowledgment: string;
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
 * Result of validating a `LiveLlmSyntheticSingleCallContractInput`.
 *
 * `readyForLiveLlmSyntheticSingleCallExecutionPlan` is `true` only when
 * `accepted`. This is the only new positive gate produced by Phase 8.3L.
 *
 * `safeSingleCallContractMetadata` contains only counts and allowed enum
 * values — no user content, no secrets, no env values, no model output.
 */
export interface LiveLlmSyntheticSingleCallContractResult {
  readonly contractId: string;
  readonly epochId: "8.3L";
  readonly status: LiveLlmSyntheticSingleCallContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmSyntheticSingleCallRejectionReason[];

  readonly safeSingleCallContractMetadata: {
    readonly scopeCount: number;
    readonly provider: LiveLlmSyntheticSingleCallProvider;
    readonly model: LiveLlmSyntheticSingleCallModel;
    readonly selectedSyntheticCase: LiveLlmSyntheticSingleCallSelectedCase;
    readonly promptPolicyCount: number;
    readonly executionGuardCount: number;
    readonly blockedPayloadCount: number;
    readonly postCallMetadataCount: number;
    readonly recheckRequirementCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForLiveLlmSyntheticSingleCallExecutionPlan: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchRequired: true;
  readonly singleCallCounterRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;
  readonly apiRouteCalled: false;

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
  readonly userVisibleOutputAuthorizedByContract: false;

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
 * Result of `runLiveLlmSyntheticSingleCallContract()` (Phase 8.3L).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3K authorization planning dependency is verified.
 * 2. The contract input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForLiveLlmSyntheticSingleCallExecutionPlan` is the only positive gate.
 */
export interface LiveLlmSyntheticSingleCallContractCheckResult {
  readonly checkId: "8.3L";
  readonly allPassed: boolean;
  readonly authorizationPlanningReadyForSingleCallContract: boolean;
  readonly liveLlmSyntheticSingleCallContractAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForLiveLlmSyntheticSingleCallExecutionPlan: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly contractOnly: true;
  readonly futureExecutionPlanRequired: true;
  readonly futureSingleLiveLlmSyntheticCallOnly: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerAllowlisted: true;
  readonly modelAllowlisted: true;
  readonly killSwitchRequired: true;
  readonly singleCallCounterRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

  readonly liveLLMCalled: false;
  readonly envReadPerformed: false;
  readonly sdkImported: false;
  readonly httpCallMade: false;

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

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES: readonly LiveLlmSyntheticSingleCallScope[] =
  [
    "one_call_only",
    "one_synthetic_case_only",
    "synthetic_input_only",
    "no_real_user_input",
    "no_raw_input",
    "no_real_redacted_input",
    "no_photo_or_ocr_input",
    "no_file_upload_input",
    "no_public_request_input",
    "no_branch_c_runtime",
    "no_run_smart_talk_runtime",
    "no_ocr_runtime",
    "no_general_live_llm_runtime",
    "no_persistence",
    "no_user_visible_output",
    "metadata_only_capture",
    "model_output_untrusted",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES: readonly LiveLlmSyntheticSingleCallPromptPolicy[] =
  [
    "synthetic_prompt_template_required",
    "synthetic_case_marker_required",
    "no_real_document_text",
    "no_raw_text",
    "no_real_redacted_text",
    "no_ocr_text",
    "no_file_content",
    "no_public_request_text",
    "no_pii",
    "no_secret",
    "no_deadline_certainty_instruction",
    "no_legal_certainty_instruction",
    "uncertainty_preservation_instruction_required",
    "model_must_be_told_output_is_untrusted",
    "output_must_be_structured_for_governance_recheck",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS: readonly LiveLlmSyntheticSingleCallExecutionGuard[] =
  [
    "kill_switch_required",
    "provider_allowlist_required",
    "model_allowlist_required",
    "single_call_counter_required",
    "operator_ack_required",
    "reviewer_ack_required",
    "execution_phase_must_validate_env_presence_without_logging_value",
    "execution_phase_must_not_log_prompt_text",
    "execution_phase_must_not_log_model_output",
    "execution_phase_must_not_store_model_output",
    "execution_phase_must_capture_metadata_only",
    "execution_phase_must_run_post_call_governance_recheck",
    "execution_phase_must_run_post_call_audit",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS: readonly LiveLlmSyntheticSingleCallBlockedPayload[] =
  [
    "real_user_document",
    "real_user_photo",
    "real_ocr_text",
    "real_raw_text",
    "real_redacted_text",
    "uploaded_file_content",
    "public_request_content",
    "private_user_pii",
    "secrets_or_api_keys",
    "full_document_text",
    "production_runtime_payload",
    "existing_branch_c_payload",
    "run_smart_talk_payload",
    "ocr_runtime_payload",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA: readonly LiveLlmSyntheticSingleCallPostCallMetadata[] =
  [
    "provider_id",
    "model_id",
    "synthetic_case_id",
    "single_call_counter",
    "kill_switch_state",
    "call_authorization_id",
    "prompt_policy_version",
    "governance_recheck_required",
    "post_call_audit_required",
    "no_prompt_text_logged",
    "no_model_output_logged",
    "no_model_output_stored",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS: readonly LiveLlmSyntheticSingleCallRecheckRequirement[] =
  [
    "mark_model_output_untrusted",
    "run_reality_matrix_recheck",
    "run_evidence_gate_recheck",
    "run_hallucination_trap_recheck",
    "run_deadline_claim_recheck",
    "run_uncertainty_preservation_recheck",
    "run_manual_review_before_user_visible_policy",
    "keep_user_visible_output_blocked",
    "keep_persistence_blocked",
    "keep_public_runtime_blocked",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST: readonly LiveLlmSyntheticSingleCallChecklistItem[] =
  [
    "authorization_planning_reviewed",
    "scope_reviewed",
    "provider_reviewed",
    "model_reviewed",
    "selected_synthetic_case_reviewed",
    "prompt_policy_reviewed",
    "execution_guards_reviewed",
    "blocked_payloads_reviewed",
    "post_call_metadata_reviewed",
    "recheck_requirements_reviewed",
    "one_call_limit_reviewed",
    "kill_switch_reviewed",
    "no_real_input_reviewed",
    "existing_runtime_isolation_reviewed",
    "no_persistence_reviewed",
    "no_user_visible_output_reviewed",
    "no_public_runtime_reviewed",
    "next_phase_execution_plan_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is a contract only and does not call a live LLM.",
    "I acknowledge that any future execution may perform only one synthetic live LLM call.",
    "I acknowledge that real input, OCR, files, public requests, Branch C, run-smart-talk.ts, and persistence remain blocked.",
    "I acknowledge that future model output must be treated as untrusted and governance-rechecked.",
    "I acknowledge that live LLM runtime and public launch are not authorized by this contract.",
  ] as const;

export const FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_STRINGS: readonly string[] =
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
  ] as const;
