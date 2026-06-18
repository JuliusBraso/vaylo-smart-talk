/**
 * Additional Synthetic Live LLM Case Dry-Run Authorization Types (Phase 8.3U).
 *
 * Defines the typed dry-run authorization layer for one additional synthetic case:
 * `synthetic_explicit_payment_deadline`. This phase is DRY-RUN AUTHORIZATION ONLY —
 * it verifies the 8.3T execution plan and issues a single positive gate that
 * permits exactly one future live LLM call in the next phase.
 *
 * This phase is DRY-RUN AUTHORIZATION ONLY:
 *   - Does NOT call a live LLM (`liveLLMCalledInDryRunAuthorization: false` — literal)
 *   - Does NOT construct final prompt text (`promptTextConstructedNow: false` — literal)
 *   - Does NOT read process.env
 *   - Does NOT call fetch()
 *   - Does NOT import any LLM SDK
 *   - Does NOT process real input
 *   - Does NOT authorize real document input (`readyForRealDocumentInput: false` — literal)
 *   - Does NOT authorize public runtime (`readyForPublicLaunch: false` — literal)
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Authorizes ONLY the next phase to execute exactly one future call
 *     (`authorizeExactlyOneSyntheticCaseCallNextPhase: true`)
 *
 * Key invariants (literal types):
 *   - `dryRunAuthorizationOnly: true`
 *   - `authorizeExactlyOneSyntheticCaseCallNextPhase: true`
 *   - `futureLiveExecutionRequired: true`
 *   - `oneFutureLiveLlmCallOnly: true`
 *   - `killSwitchRequiredForFutureCall: true`
 *   - `singleCallCounterRequiredForFutureCall: true`
 *   - `liveLLMCalledInDryRunAuthorization: false`
 *   - `additionalLiveLLMCallsExecuted: false`
 *   - `promptTextConstructedNow: false`
 *   - `promptTextAvailableInDryRunAuthorization: false`
 *   - `modelOutputAvailableInDryRunAuthorization: false`
 *   - `metadataOnlyCaptureRequired: true`
 *   - `postCallGovernanceRecheckRequired: true`
 *   - `postCallAuditRequired: true`
 *   - All dangerous readiness flags: `false`
 *   - `neverUserVisible: true`
 *
 * Positive gates produced (only when `accepted`):
 *   - `readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true`
 *   - `additionalSyntheticCaseDryRunAuthorizationAccepted: true`
 *
 * Status:
 *   - "authorized" — all invariants pass
 *   - "blocked"    — execution plan prerequisite not satisfied
 *   - "rejected"   — at least one unsafe violation
 *
 * Builds on Phase 8.3T (Additional Synthetic Live LLM Case Execution Plan).
 *
 * ISOLATION NOTE:
 *   Branch C / run-smart-talk.ts / extract-text-from-image.ts remain `false`.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationStatus =
  | "authorized"
  | "blocked"
  | "rejected";

// ── Scopes ────────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationScope =
  | "dry_run_authorization_only"
  | "execution_plan_verified"
  | "selected_synthetic_case_only"
  | "explicit_payment_deadline_case"
  | "authorize_next_phase_one_call_only"
  | "provider_model_verified"
  | "kill_switch_required"
  | "single_call_counter_required"
  | "prompt_construction_deferred"
  | "prompt_logging_blocked"
  | "model_output_logging_blocked"
  | "metadata_capture_required"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required"
  | "no_live_call_in_authorization"
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

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationProvider = "openai";
export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationModel = "gpt_4o_mini";
export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCaseId =
  "synthetic_explicit_payment_deadline";

// ── Authorization decision ────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationDecision =
  | "authorize_one_synthetic_case_call_next_phase"
  | "reject";

// ── Authorization gates ───────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationGate =
  | "execution_plan_gate"
  | "selected_case_gate"
  | "provider_gate"
  | "model_gate"
  | "one_future_call_gate"
  | "kill_switch_gate"
  | "single_call_counter_gate"
  | "prompt_construction_deferred_gate"
  | "prompt_logging_block_gate"
  | "model_output_logging_block_gate"
  | "metadata_capture_gate"
  | "post_call_governance_recheck_gate"
  | "post_call_audit_gate"
  | "no_real_input_gate"
  | "runtime_isolation_gate"
  | "no_user_visible_output_gate"
  | "no_persistence_gate"
  | "no_public_runtime_gate"
  | "no_real_document_input_gate";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationChecklistItem =
  | "execution_plan_reviewed"
  | "selected_case_reviewed"
  | "provider_model_reviewed"
  | "dry_run_authorization_only_reviewed"
  | "one_future_call_limit_reviewed"
  | "kill_switch_requirement_reviewed"
  | "single_call_counter_requirement_reviewed"
  | "prompt_construction_deferred_reviewed"
  | "prompt_non_logging_reviewed"
  | "model_output_non_logging_reviewed"
  | "metadata_capture_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "runtime_isolation_reviewed"
  | "no_real_input_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed"
  | "no_real_document_input_reviewed"
  | "next_phase_live_execution_required";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationRejectionReason =
  | "execution_plan_not_ready"
  | "missing_authorization_scope"
  | "missing_authorization_gate"
  | "missing_checklist_item"
  | "selected_case_invalid"
  | "provider_invalid"
  | "model_invalid"
  | "invalid_authorization_decision"
  | "authorization_attempted_live_call"
  | "process_env_read_attempted"
  | "sdk_import_attempted"
  | "http_call_attempted"
  | "future_call_limit_missing"
  | "kill_switch_missing"
  | "single_call_counter_missing"
  | "prompt_text_constructed_now"
  | "prompt_text_available"
  | "model_output_available"
  | "prompt_or_model_output_logged"
  | "metadata_capture_missing"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
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
  | "unsafe_authorization_note_detected";

// ── Dry-run authorization input ───────────────────────────────────────────────

/**
 * Input for the Additional Synthetic Live LLM Case Dry-Run Authorization.
 *
 * New fields vs Phase 8.3T:
 * - `dryRunAuthorizationOnly: true` (literal)
 * - `authorizeExactlyOneSyntheticCaseCallNextPhase: true` (literal)
 * - `futureLiveExecutionRequired: true` (literal)
 * - `metadataOnlyCaptureRequired: true` (literal)
 * - `postCallGovernanceRecheckRequired: true` (literal)
 * - `postCallAuditRequired: true` (literal)
 * - `promptTextAvailableInDryRunAuthorization: false` (literal)
 * - `modelOutputAvailableInDryRunAuthorization: false` (literal)
 * - `authorizationDecision` — must be "authorize_one_synthetic_case_call_next_phase"
 * - Simplified structure: scopes + gates + checklist (no plan-specific lists)
 */
export interface AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput {
  readonly authorizationId: string;
  readonly epochId: "8.3U";
  readonly previousPhaseId: "8.3T";

  readonly executionPlanReadyForDryRunAuthorization: boolean;

  readonly scopes: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationScope[];
  readonly gates: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationGate[];
  readonly checklistConfirmed: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationChecklistItem[];

  readonly selectedCase: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCaseId;
  readonly provider: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationProvider;
  readonly model: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationModel;
  readonly authorizationDecision: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationDecision;

  readonly dryRunAuthorizationOnly: true;
  readonly authorizeExactlyOneSyntheticCaseCallNextPhase: true;
  readonly futureLiveExecutionRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true;
  readonly additionalSyntheticCaseDryRunAuthorizationAccepted: true;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInDryRunAuthorization: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly metadataOnlyCaptureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

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

// ── Dry-run authorization result ──────────────────────────────────────────────

/**
 * Result of validating an `AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput`.
 *
 * Positive gates (true only when accepted):
 *   - `readyForAdditionalSyntheticLiveLlmCaseLiveExecution`
 *   - `additionalSyntheticCaseDryRunAuthorizationAccepted`
 *
 * All dangerous readiness flags remain literal `false`.
 */
export interface AdditionalSyntheticLiveLlmCaseDryRunAuthorizationResult {
  readonly authorizationId: string;
  readonly epochId: "8.3U";
  readonly status: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationRejectionReason[];

  readonly safeAuthorizationMetadata: {
    readonly scopeCount: number;
    readonly gateCount: number;
    readonly checklistPassedCount: number;
    readonly selectedCase: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCaseId;
    readonly provider: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationProvider;
    readonly model: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationModel;
    readonly authorizationDecision: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationDecision;
    readonly dryRunAuthorizationOnly: true;
    readonly oneFutureLiveLlmCallOnly: true;
  };

  readonly readyForAdditionalSyntheticLiveLlmCaseLiveExecution: boolean;
  readonly additionalSyntheticCaseDryRunAuthorizationAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly dryRunAuthorizationOnly: true;
  readonly authorizeExactlyOneSyntheticCaseCallNextPhase: true;
  readonly futureLiveExecutionRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInDryRunAuthorization: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly metadataOnlyCaptureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

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

  readonly apiRouteModifiedByAuthorization: false;
  readonly existingRuntimeModifiedByAuthorization: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByAuthorization: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runAdditionalSyntheticLiveLlmCaseDryRunAuthorization()` (Phase 8.3U).
 *
 * `allPassed` is true when:
 * 1. The 8.3T execution plan prerequisite is verified.
 * 2. The dry-run authorization input is accepted.
 * 3. All tamper cases are rejected.
 *
 * Positive gates: `readyForAdditionalSyntheticLiveLlmCaseLiveExecution`
 * and `additionalSyntheticCaseDryRunAuthorizationAccepted`.
 */
export interface AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCheckResult {
  readonly checkId: "8.3U";
  readonly allPassed: boolean;
  readonly executionPlanReadyForDryRunAuthorization: boolean;
  readonly additionalSyntheticLiveLlmCaseDryRunAuthorizationAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAdditionalSyntheticLiveLlmCaseLiveExecution: boolean;
  readonly additionalSyntheticCaseDryRunAuthorizationAccepted: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;
  readonly readyForRealDocumentInput: false;
  readonly readyForUserVisibleOutput: false;

  readonly dryRunAuthorizationOnly: true;
  readonly authorizeExactlyOneSyntheticCaseCallNextPhase: true;
  readonly futureLiveExecutionRequired: true;
  readonly oneFutureLiveLlmCallOnly: true;
  readonly killSwitchRequiredForFutureCall: true;
  readonly singleCallCounterRequiredForFutureCall: true;

  readonly liveLLMCalledInDryRunAuthorization: false;
  readonly additionalLiveLLMCallsExecuted: false;

  readonly promptTextConstructedNow: false;
  readonly promptTextAvailableInDryRunAuthorization: false;
  readonly modelOutputAvailableInDryRunAuthorization: false;
  readonly promptTextLogged: false;
  readonly modelOutputLogged: false;

  readonly metadataOnlyCaptureRequired: true;
  readonly postCallGovernanceRecheckRequired: true;
  readonly postCallAuditRequired: true;

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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_SCOPES: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationScope[] =
  [
    "dry_run_authorization_only",
    "execution_plan_verified",
    "selected_synthetic_case_only",
    "explicit_payment_deadline_case",
    "authorize_next_phase_one_call_only",
    "provider_model_verified",
    "kill_switch_required",
    "single_call_counter_required",
    "prompt_construction_deferred",
    "prompt_logging_blocked",
    "model_output_logging_blocked",
    "metadata_capture_required",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
    "no_live_call_in_authorization",
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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_GATES: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationGate[] =
  [
    "execution_plan_gate",
    "selected_case_gate",
    "provider_gate",
    "model_gate",
    "one_future_call_gate",
    "kill_switch_gate",
    "single_call_counter_gate",
    "prompt_construction_deferred_gate",
    "prompt_logging_block_gate",
    "model_output_logging_block_gate",
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

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_CHECKLIST: readonly AdditionalSyntheticLiveLlmCaseDryRunAuthorizationChecklistItem[] =
  [
    "execution_plan_reviewed",
    "selected_case_reviewed",
    "provider_model_reviewed",
    "dry_run_authorization_only_reviewed",
    "one_future_call_limit_reviewed",
    "kill_switch_requirement_reviewed",
    "single_call_counter_requirement_reviewed",
    "prompt_construction_deferred_reviewed",
    "prompt_non_logging_reviewed",
    "model_output_non_logging_reviewed",
    "metadata_capture_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "runtime_isolation_reviewed",
    "no_real_input_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
    "no_real_document_input_reviewed",
    "next_phase_live_execution_required",
  ] as const;

export const REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase is dry-run authorization only and does not call a live LLM.",
    "I acknowledge that the selected case is synthetic_explicit_payment_deadline only.",
    "I acknowledge that only the next phase may execute exactly one synthetic live LLM call.",
    "I acknowledge that prompt text and model output must remain unavailable in this authorization phase.",
    "I acknowledge that real documents, public runtime, persistence, and user-visible output remain blocked.",
  ] as const;

export const FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_STRINGS: readonly string[] =
  [
    // Inherited from 8.3T (88)
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
    // New in 8.3U (9)
    "payment live execution authorized globally",
    "payment live call executed",
    "payment prompt available",
    "payment model output available",
    "real payment document authorized",
    "real invoice authorized",
    "public payment runtime authorized",
    "user-visible payment output authorized",
    "payment production runtime ready",
  ] as const;
