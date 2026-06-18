/**
 * Live LLM Synthetic Single-Call Dry-Run Authorization Types (Phase 8.3N).
 *
 * Defines the typed authorization layer that verifies all pre-flight
 * conditions from Phase 8.3M and produces a single positive gate
 * (`readyForLiveLlmSyntheticSingleCallExecution`) for Phase 8.3O.
 *
 * This phase is DRY-RUN AUTHORIZATION ONLY. It does NOT:
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
 * What this phase authorizes:
 *   - Exactly one synthetic live LLM call in Phase 8.3O
 *   - Only when kill switch is armed
 *   - Only when single-call counter is zero
 *   - Only with provider openai, model gpt_4o_mini, selected case
 *     synthetic_deadline_relative_missing_delivery_date
 *   - Only with all prompt blockers, metadata-only capture, post-call
 *     governance recheck, and post-call audit confirmed ready
 *
 * Builds on Phase 8.3M (Live LLM Synthetic Single-Call Execution Plan).
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
 *   - `dryRunAuthorizationOnly: true`
 *   - `nextPhaseExecutionRequired: true`
 *   - `authorizeExactlyOneSyntheticCallNextPhase: true`
 *   - `generalLiveLlmRuntimeAuthorizationAllowed: false`
 *   - `multipleLiveLlmCallsAllowed: false`
 *   - `providerVerified: true`, `modelVerified: true`, `selectedCaseVerified: true`
 *   - `killSwitchArmed: true`
 *   - `singleCallCounterZero: true`
 *   - `promptPolicyReady: true`
 *   - `metadataOnlyCaptureReady: true`
 *   - `postCallGovernanceRecheckReady: true`
 *   - `postCallAuditReady: true`
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
 * The only new positive gate: `readyForLiveLlmSyntheticSingleCallExecution`
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallDryRunAuthorizationStatus =
  | "authorized"
  | "rejected";

// ── Authorization scope ───────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallDryRunAuthorizationScope =
  | "authorize_next_phase_one_synthetic_call_only"
  | "selected_synthetic_case_only"
  | "provider_model_verified"
  | "kill_switch_armed"
  | "single_call_counter_zero"
  | "metadata_only_capture_ready"
  | "post_call_governance_recheck_ready"
  | "post_call_audit_ready"
  | "no_general_live_llm_runtime"
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
  | "no_public_runtime";

// ── Authorization gates ───────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallDryRunAuthorizationGate =
  | "execution_plan_gate"
  | "provider_gate"
  | "model_gate"
  | "selected_case_gate"
  | "kill_switch_gate"
  | "single_call_counter_gate"
  | "prompt_policy_gate"
  | "prompt_logging_block_gate"
  | "model_output_logging_block_gate"
  | "metadata_capture_gate"
  | "post_call_governance_recheck_gate"
  | "post_call_audit_gate"
  | "no_real_input_gate"
  | "no_branch_c_gate"
  | "no_run_smart_talk_gate"
  | "no_ocr_runtime_gate"
  | "no_user_visible_output_gate"
  | "no_persistence_gate"
  | "no_public_runtime_gate";

// ── Kill switch state ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallKillSwitchState = "armed";

// ── Single-call counter state ─────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallCounterState = "zero_before_call";

// ── Authorization decision ────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallAuthorizationDecision =
  | "authorize_one_synthetic_call_next_phase"
  | "reject";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallDryRunAuthorizationChecklistItem =
  | "execution_plan_reviewed"
  | "provider_verified"
  | "model_verified"
  | "selected_case_verified"
  | "kill_switch_armed_reviewed"
  | "single_call_counter_zero_reviewed"
  | "prompt_policy_reviewed"
  | "prompt_text_not_constructed_now_reviewed"
  | "prompt_text_not_logged_reviewed"
  | "model_output_not_logged_reviewed"
  | "metadata_only_capture_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "no_real_input_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "no_persistence_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_public_runtime_reviewed"
  | "next_phase_single_call_execution_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason =
  | "execution_plan_not_ready"
  | "missing_authorization_scope"
  | "missing_authorization_gate"
  | "invalid_kill_switch_state"
  | "invalid_single_call_counter_state"
  | "invalid_authorization_decision"
  | "missing_checklist_item"
  | "authorization_attempted_live_llm_call"
  | "authorization_attempted_env_read"
  | "authorization_attempted_sdk_import"
  | "authorization_attempted_http_call"
  | "authorization_attempted_prompt_construction"
  | "authorization_attempted_prompt_logging"
  | "authorization_attempted_model_output_logging"
  | "authorization_attempted_general_runtime_authorization"
  | "authorization_attempted_multiple_call_authorization"
  | "authorization_attempted_real_input_processing"
  | "authorization_attempted_raw_input_forwarding"
  | "authorization_attempted_redacted_input_forwarding"
  | "authorization_attempted_photo_ocr_file_processing"
  | "authorization_attempted_branch_c_dependency"
  | "authorization_attempted_run_smart_talk_dependency"
  | "authorization_attempted_ocr_runtime_dependency"
  | "authorization_attempted_ai_output_generation"
  | "authorization_attempted_model_output_storage"
  | "authorization_attempted_user_visible_output"
  | "authorization_attempted_persistence"
  | "authorization_attempted_public_runtime"
  | "authorization_attempted_real_operator_pilot"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_authorization_note_detected";

// ── Authorization input ───────────────────────────────────────────────────────

/**
 * Input for the Live LLM Synthetic Single-Call Dry-Run Authorization.
 *
 * `dryRunAuthorizationOnly: true` — this phase authorizes, not executes.
 * `nextPhaseExecutionRequired: true` — Phase 8.3O must explicitly execute.
 * `authorizeExactlyOneSyntheticCallNextPhase: true` — exactly one call.
 * `killSwitchArmed: true` — kill switch must be armed before proceeding.
 * `singleCallCounterZero: true` — counter verified at zero.
 * `promptTextConstructedNow: false` — prompt not built in this phase.
 * `promptTextLogged: false` — prompt text is never logged.
 * `modelOutputLogged: false` — model output is never logged.
 *
 * `readyForLiveLlmSyntheticSingleCallExecution` is the only new positive
 * gate produced by Phase 8.3N.
 */
export interface LiveLlmSyntheticSingleCallDryRunAuthorizationInput {
  readonly authorizationId: string;
  readonly epochId: "8.3N";
  readonly previousPhaseId: "8.3M";

  readonly executionPlanReadyForDryRunAuthorization: boolean;

  readonly authorizationScopes: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationScope[];
  readonly authorizationGates: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationGate[];

  readonly provider: "openai";
  readonly model: "gpt_4o_mini";
  readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";

  readonly killSwitchState: LiveLlmSyntheticSingleCallKillSwitchState;
  readonly singleCallCounterState: LiveLlmSyntheticSingleCallCounterState;
  readonly authorizationDecision: LiveLlmSyntheticSingleCallAuthorizationDecision;

  readonly checklistConfirmed: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationChecklistItem[];

  readonly dryRunAuthorizationOnly: true;
  readonly nextPhaseExecutionRequired: true;
  readonly authorizeExactlyOneSyntheticCallNextPhase: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerVerified: true;
  readonly modelVerified: true;
  readonly selectedCaseVerified: true;
  readonly killSwitchArmed: true;
  readonly singleCallCounterZero: true;
  readonly promptPolicyReady: true;
  readonly metadataOnlyCaptureReady: true;
  readonly postCallGovernanceRecheckReady: true;
  readonly postCallAuditReady: true;

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
  readonly userVisibleOutputAuthorizedByAuthorization: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorDryRunAuthorizationAcknowledgment: string;
  readonly reviewerDryRunAuthorizationAcknowledgment: string;
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

// ── Authorization result ──────────────────────────────────────────────────────

/**
 * Result of validating a `LiveLlmSyntheticSingleCallDryRunAuthorizationInput`.
 *
 * `readyForLiveLlmSyntheticSingleCallExecution` is `true` only when
 * `accepted`. This is the only new positive gate produced by Phase 8.3N.
 *
 * `safeAuthorizationMetadata` contains only counts, allowed enum values,
 * and state values — no raw text, no secrets, no env values.
 */
export interface LiveLlmSyntheticSingleCallDryRunAuthorizationResult {
  readonly authorizationId: string;
  readonly epochId: "8.3N";
  readonly status: LiveLlmSyntheticSingleCallDryRunAuthorizationStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason[];

  readonly safeAuthorizationMetadata: {
    readonly authorizationScopeCount: number;
    readonly authorizationGateCount: number;
    readonly checklistPassedCount: number;
    readonly provider: "openai";
    readonly model: "gpt_4o_mini";
    readonly selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date";
    readonly killSwitchState: LiveLlmSyntheticSingleCallKillSwitchState;
    readonly singleCallCounterState: LiveLlmSyntheticSingleCallCounterState;
    readonly authorizationDecision: LiveLlmSyntheticSingleCallAuthorizationDecision;
  };

  readonly readyForLiveLlmSyntheticSingleCallExecution: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly dryRunAuthorizationOnly: true;
  readonly nextPhaseExecutionRequired: true;
  readonly authorizeExactlyOneSyntheticCallNextPhase: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerVerified: true;
  readonly modelVerified: true;
  readonly selectedCaseVerified: true;
  readonly killSwitchArmed: true;
  readonly singleCallCounterZero: true;
  readonly promptPolicyReady: true;
  readonly metadataOnlyCaptureReady: true;
  readonly postCallGovernanceRecheckReady: true;
  readonly postCallAuditReady: true;

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
  readonly userVisibleOutputAuthorizedByAuthorization: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteModifiedByAuthorization: false;
  readonly existingRuntimeModifiedByAuthorization: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByAuthorization: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runLiveLlmSyntheticSingleCallDryRunAuthorization()` (Phase 8.3N).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3M execution plan dependency is verified.
 * 2. The dry-run authorization input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForLiveLlmSyntheticSingleCallExecution` is the only new positive gate.
 */
export interface LiveLlmSyntheticSingleCallDryRunAuthorizationCheckResult {
  readonly checkId: "8.3N";
  readonly allPassed: boolean;
  readonly executionPlanReadyForDryRunAuthorization: boolean;
  readonly liveLlmSyntheticSingleCallDryRunAuthorizationAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForLiveLlmSyntheticSingleCallExecution: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly dryRunAuthorizationOnly: true;
  readonly nextPhaseExecutionRequired: true;
  readonly authorizeExactlyOneSyntheticCallNextPhase: true;
  readonly generalLiveLlmRuntimeAuthorizationAllowed: false;
  readonly multipleLiveLlmCallsAllowed: false;

  readonly providerVerified: true;
  readonly modelVerified: true;
  readonly selectedCaseVerified: true;
  readonly killSwitchArmed: true;
  readonly singleCallCounterZero: true;
  readonly promptPolicyReady: true;
  readonly metadataOnlyCaptureReady: true;
  readonly postCallGovernanceRecheckReady: true;
  readonly postCallAuditReady: true;

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

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationScope[] =
  [
    "authorize_next_phase_one_synthetic_call_only",
    "selected_synthetic_case_only",
    "provider_model_verified",
    "kill_switch_armed",
    "single_call_counter_zero",
    "metadata_only_capture_ready",
    "post_call_governance_recheck_ready",
    "post_call_audit_ready",
    "no_general_live_llm_runtime",
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
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationGate[] =
  [
    "execution_plan_gate",
    "provider_gate",
    "model_gate",
    "selected_case_gate",
    "kill_switch_gate",
    "single_call_counter_gate",
    "prompt_policy_gate",
    "prompt_logging_block_gate",
    "model_output_logging_block_gate",
    "metadata_capture_gate",
    "post_call_governance_recheck_gate",
    "post_call_audit_gate",
    "no_real_input_gate",
    "no_branch_c_gate",
    "no_run_smart_talk_gate",
    "no_ocr_runtime_gate",
    "no_user_visible_output_gate",
    "no_persistence_gate",
    "no_public_runtime_gate",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST: readonly LiveLlmSyntheticSingleCallDryRunAuthorizationChecklistItem[] =
  [
    "execution_plan_reviewed",
    "provider_verified",
    "model_verified",
    "selected_case_verified",
    "kill_switch_armed_reviewed",
    "single_call_counter_zero_reviewed",
    "prompt_policy_reviewed",
    "prompt_text_not_constructed_now_reviewed",
    "prompt_text_not_logged_reviewed",
    "model_output_not_logged_reviewed",
    "metadata_only_capture_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "no_real_input_reviewed",
    "existing_runtime_isolation_reviewed",
    "no_persistence_reviewed",
    "no_user_visible_output_reviewed",
    "no_public_runtime_reviewed",
    "next_phase_single_call_execution_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase authorizes only the next phase to execute one synthetic live LLM call.",
    "I acknowledge that this phase does not call a live LLM.",
    "I acknowledge that kill switch and single-call counter must remain enforced.",
    "I acknowledge that prompt text and model output must not be logged or persisted.",
    "I acknowledge that live LLM runtime and public launch are not authorized by this phase.",
  ] as const;

export const FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_STRINGS: readonly string[] =
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
    "authorized general live llm",
    "authorized public runtime",
  ] as const;
