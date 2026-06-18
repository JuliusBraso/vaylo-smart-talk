/**
 * Live LLM Synthetic Single-Call Execution Types (Phase 8.3O).
 *
 * Defines the typed execution layer for exactly one controlled live LLM call
 * with one synthetic case. This phase is the first in the chain to actually
 * call a live LLM — but only via a tightly gated, single-call, synthetic-only,
 * metadata-capture-only path.
 *
 * Critical invariants that differ from previous phases:
 *   - `liveLLMCallPerformed: true` — the call IS made (if API key present)
 *   - `modelOutputReceived: boolean` — may be true if call succeeded
 *   - `modelOutputMarkedUntrusted: true` — model output is ALWAYS untrusted
 *   - `modelOutputLogged: false` — model output is NEVER logged (literal)
 *   - `modelOutputStored: false` — model output is NEVER stored (literal)
 *   - `modelOutputReturned: false` — model output is NEVER returned (literal)
 *   - `promptTextLogged: false` — prompt text is NEVER logged (literal)
 *   - `promptTextStored: false` — prompt text is NEVER stored (literal)
 *   - `promptTextReturned: false` — prompt text is NEVER returned (literal)
 *   - `promptConstructedInMemoryOnly: true` — prompt lives in memory only
 *   - `metadataOnlyCaptured: true` — only metadata is captured
 *   - `callCount: 1` — exactly one call (literal)
 *   - `singleCallCounterBefore: 0` — counter zero before call (literal)
 *   - `singleCallCounterAfter: 1` — counter one after call (literal)
 *   - `killSwitchArmedBeforeCall: true` — kill switch armed (literal)
 *   - `killSwitchDisarmedAfterCall: true` — kill switch disarmed after (literal)
 *   - `postCallGovernanceRecheckRequired: true` — recheck required
 *   - `postCallAuditRequired: true` — audit required
 *
 * Safety invariants that remain identical to previous phases:
 *   - `syntheticInputOnly: true`
 *   - All real/raw/OCR/file/public input channels: `false`
 *   - All existing runtime dependency flags: `false`
 *   - All user-visible/persistence/public/pilot flags: `false`
 *   - `readyForLiveLLMRuntime: false` (general LLM runtime still not authorized)
 *   - `neverUserVisible: true`
 *
 * Builds on Phase 8.3N (Live LLM Synthetic Single-Call Dry-Run Authorization).
 *
 * ISOLATION NOTE:
 *   All flags for Branch C / run-smart-talk.ts / extract-text-from-image.ts
 *   remain literal `false` in every interface. These components are NOT called.
 *
 * Status:
 *   - "executed"  — API key present, call completed, metadata captured
 *   - "blocked"   — API key missing; call safely skipped; no unsafe violation
 *   - "rejected"  — an unsafe contract violation was detected
 *
 * The positive gate produced: `readyForPostCallGovernanceRecheck` and
 * `readyForPostCallAudit` (true only when `accepted`).
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionStatus =
  | "executed"
  | "blocked"
  | "rejected";

// ── Provider / model / case / mode ────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionProvider = "openai";
export type LiveLlmSyntheticSingleCallExecutionModel = "gpt_4o_mini";
export type LiveLlmSyntheticSingleCallExecutionCase =
  "synthetic_deadline_relative_missing_delivery_date";
export type LiveLlmSyntheticSingleCallExecutionMode = "one_synthetic_live_call";

// ── Execution steps ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionStep =
  | "dry_run_authorization_verified"
  | "kill_switch_verified_armed"
  | "single_call_counter_verified_zero_before_call"
  | "provider_verified"
  | "model_verified"
  | "selected_case_verified"
  | "api_key_presence_checked_without_value_logging"
  | "prompt_constructed_in_memory_only"
  | "prompt_text_not_logged"
  | "live_llm_call_performed_once"
  | "model_output_received_untrusted"
  | "model_output_not_logged"
  | "model_output_not_stored"
  | "metadata_only_captured"
  | "single_call_counter_verified_one_after_call"
  | "kill_switch_disarmed_after_call"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked"
  | "post_call_governance_recheck_required"
  | "post_call_audit_required";

// ── Metadata fields ───────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionMetadataField =
  | "provider_id"
  | "model_id"
  | "synthetic_case_id"
  | "execution_id"
  | "call_authorization_id"
  | "api_key_presence_confirmed"
  | "api_key_value_logged_false"
  | "prompt_text_logged_false"
  | "prompt_text_stored_false"
  | "model_output_logged_false"
  | "model_output_stored_false"
  | "call_count"
  | "counter_before"
  | "counter_after"
  | "kill_switch_before"
  | "kill_switch_after"
  | "model_output_untrusted"
  | "governance_recheck_required"
  | "post_call_audit_required"
  | "user_visible_output_blocked"
  | "persistence_blocked"
  | "public_runtime_blocked";

// ── Expected observations ─────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionExpectedObservation =
  | "uncertainty_preserved"
  | "relative_deadline_not_calculated_as_certainty"
  | "delivery_date_required"
  | "legal_certainty_not_claimed"
  | "deadline_claim_requires_evidence"
  | "model_output_marked_untrusted"
  | "governance_recheck_required"
  | "user_visible_output_blocked";

// ── Execution blockers ────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionBlocker =
  | "dry_run_authorization_not_ready"
  | "kill_switch_not_armed"
  | "single_call_counter_not_zero"
  | "provider_invalid"
  | "model_invalid"
  | "selected_case_invalid"
  | "api_key_missing"
  | "api_key_value_exposure_detected"
  | "prompt_logging_detected"
  | "model_output_logging_detected"
  | "model_output_storage_detected"
  | "more_than_one_call_detected"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "user_visible_output_attempted"
  | "persistence_attempted"
  | "public_runtime_attempted"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing";

// ── Checklist ─────────────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionChecklistItem =
  | "dry_run_authorization_reviewed"
  | "provider_model_case_reviewed"
  | "kill_switch_armed_reviewed"
  | "single_call_counter_zero_reviewed"
  | "api_key_presence_check_reviewed"
  | "prompt_in_memory_only_reviewed"
  | "prompt_not_logged_reviewed"
  | "one_call_limit_reviewed"
  | "model_output_untrusted_reviewed"
  | "model_output_not_logged_reviewed"
  | "model_output_not_stored_reviewed"
  | "metadata_only_capture_reviewed"
  | "counter_after_call_reviewed"
  | "kill_switch_disarm_reviewed"
  | "post_call_governance_recheck_reviewed"
  | "post_call_audit_reviewed"
  | "no_real_input_reviewed"
  | "existing_runtime_isolation_reviewed"
  | "no_user_visible_output_reviewed"
  | "no_persistence_reviewed"
  | "no_public_runtime_reviewed";

// ── Rejection reasons ─────────────────────────────────────────────────────────

export type LiveLlmSyntheticSingleCallExecutionRejectionReason =
  | "dry_run_authorization_not_ready"
  | "invalid_provider"
  | "invalid_model"
  | "invalid_selected_case"
  | "invalid_execution_mode"
  | "missing_execution_step"
  | "missing_metadata_field"
  | "missing_expected_observation"
  | "missing_execution_blocker"
  | "missing_checklist_item"
  | "kill_switch_not_armed"
  | "single_call_counter_not_zero_before_call"
  | "single_call_counter_not_one_after_call"
  | "api_key_missing"
  | "api_key_value_logged"
  | "prompt_text_logged"
  | "prompt_text_stored"
  | "model_output_logged"
  | "model_output_stored"
  | "more_than_one_call_attempted"
  | "branch_c_dependency_detected"
  | "run_smart_talk_dependency_detected"
  | "ocr_runtime_dependency_detected"
  | "real_input_detected"
  | "raw_input_detected"
  | "real_redacted_input_detected"
  | "ocr_photo_file_input_detected"
  | "public_request_detected"
  | "ai_output_generated_without_untrusted_mark"
  | "user_visible_output_attempted"
  | "persistence_attempted"
  | "public_runtime_attempted"
  | "real_operator_pilot_attempted"
  | "post_call_governance_recheck_missing"
  | "post_call_audit_missing"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_redacted_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "unsafe_execution_note_detected";

// ── Execution input ───────────────────────────────────────────────────────────

/**
 * Input for the Live LLM Synthetic Single-Call Execution validation.
 *
 * Key differences from Phase 8.3N:
 * - `liveLLMCallPerformed: true` — the call IS made (literal, if API key present)
 * - `callCount: 1` — exactly one call (literal)
 * - `singleCallCounterBefore: 0` — zero before call (literal)
 * - `singleCallCounterAfter: 1` — one after call (literal)
 * - `modelOutputMarkedUntrusted: true` — always untrusted (literal)
 * - `modelOutputLogged/Stored/Returned: false` — never logged/stored/returned
 * - `promptTextLogged/Stored/Returned: false` — never logged/stored/returned
 * - `metadataOnlyCaptured: true` — only metadata captured (literal)
 *
 * When API key is absent at runtime, fields that require the call to have
 * completed will be set to their failure values via casting, triggering
 * `api_key_missing` rejection and `blocked` status.
 */
export interface LiveLlmSyntheticSingleCallExecutionInput {
  readonly executionId: string;
  readonly epochId: "8.3O";
  readonly previousPhaseId: "8.3N";

  readonly dryRunAuthorizationReadyForExecution: boolean;

  readonly provider: LiveLlmSyntheticSingleCallExecutionProvider;
  readonly model: LiveLlmSyntheticSingleCallExecutionModel;
  readonly selectedSyntheticCase: LiveLlmSyntheticSingleCallExecutionCase;
  readonly executionMode: LiveLlmSyntheticSingleCallExecutionMode;

  readonly executionSteps: readonly LiveLlmSyntheticSingleCallExecutionStep[];
  readonly metadataFields: readonly LiveLlmSyntheticSingleCallExecutionMetadataField[];
  readonly expectedObservations: readonly LiveLlmSyntheticSingleCallExecutionExpectedObservation[];
  readonly executionBlockers: readonly LiveLlmSyntheticSingleCallExecutionBlocker[];
  readonly checklistConfirmed: readonly LiveLlmSyntheticSingleCallExecutionChecklistItem[];

  readonly killSwitchArmedBeforeCall: true;
  readonly killSwitchDisarmedAfterCall: true;
  readonly singleCallCounterBefore: 0;
  readonly singleCallCounterAfter: 1;
  readonly callCount: 1;

  readonly apiKeyPresenceChecked: true;
  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly liveLLMCallPerformed: true;
  readonly modelOutputReceived: true;
  readonly modelOutputMarkedUntrusted: true;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;
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
  readonly userVisibleOutputAuthorizedByExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly operatorExecutionAcknowledgment: string;
  readonly reviewerExecutionAcknowledgment: string;
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

// ── Execution result ──────────────────────────────────────────────────────────

/**
 * Result of validating a `LiveLlmSyntheticSingleCallExecutionInput`.
 *
 * `readyForPostCallGovernanceRecheck` and `readyForPostCallAudit` are the
 * positive gates produced by Phase 8.3O.
 *
 * `liveLLMCalled` and `liveLLMCalledExactlyOnce` are true only when accepted.
 * `modelOutputLogged/Stored/Returned: false` are literal — they can never be true.
 * `metadataOnlyCaptured: true` is literal — metadata capture is always enforced.
 */
export interface LiveLlmSyntheticSingleCallExecutionResult {
  readonly executionId: string;
  readonly epochId: "8.3O";
  readonly status: LiveLlmSyntheticSingleCallExecutionStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly LiveLlmSyntheticSingleCallExecutionRejectionReason[];

  readonly safeExecutionMetadata: {
    readonly provider: LiveLlmSyntheticSingleCallExecutionProvider;
    readonly model: LiveLlmSyntheticSingleCallExecutionModel;
    readonly selectedSyntheticCase: LiveLlmSyntheticSingleCallExecutionCase;
    readonly executionMode: LiveLlmSyntheticSingleCallExecutionMode;
    readonly callCount: 1;
    readonly singleCallCounterBefore: 0;
    readonly singleCallCounterAfter: 1;
    readonly killSwitchArmedBeforeCall: true;
    readonly killSwitchDisarmedAfterCall: true;
    readonly apiKeyPresenceConfirmed: boolean;
    readonly modelOutputMarkedUntrusted: boolean;
    readonly metadataOnlyCaptured: boolean;
    readonly executionStepCount: number;
    readonly metadataFieldCount: number;
    readonly expectedObservationCount: number;
    readonly executionBlockerCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForPostCallGovernanceRecheck: boolean;
  readonly readyForPostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;

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
  readonly userVisibleOutputAuthorizedByExecution: false;

  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly realOperatorPilotExecuted: false;

  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByExecution: false;
  readonly existingRuntimeModifiedByExecution: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByExecution: false;
  readonly neverUserVisible: true;
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runLiveLlmSyntheticSingleCallExecution()` (Phase 8.3O).
 *
 * `allPassed` is true when all three sub-checks pass:
 * 1. The 8.3N dry-run authorization dependency is verified.
 * 2. The execution input is accepted.
 * 3. All tamper cases are rejected.
 *
 * `readyForPostCallGovernanceRecheck` and `readyForPostCallAudit` are the
 * positive gates. All other dangerous flags remain false.
 *
 * `liveLLMCalled` and `liveLLMCalledExactlyOnce` are true only when allPassed.
 */
export interface LiveLlmSyntheticSingleCallExecutionCheckResult {
  readonly checkId: "8.3O";
  readonly allPassed: boolean;
  readonly dryRunAuthorizationReadyForExecution: boolean;
  readonly liveLlmSyntheticSingleCallExecutionAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForPostCallGovernanceRecheck: boolean;
  readonly readyForPostCallAudit: boolean;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly liveLLMCalled: boolean;
  readonly liveLLMCalledExactlyOnce: boolean;

  readonly apiKeyValueLogged: false;
  readonly apiKeyValueReturned: false;

  readonly promptConstructedInMemoryOnly: true;
  readonly promptTextLogged: false;
  readonly promptTextStored: false;
  readonly promptTextReturned: false;

  readonly modelOutputReceived: boolean;
  readonly modelOutputMarkedUntrusted: boolean;
  readonly modelOutputLogged: false;
  readonly modelOutputStored: false;
  readonly modelOutputReturned: false;

  readonly metadataOnlyCaptured: true;

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

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_STEPS: readonly LiveLlmSyntheticSingleCallExecutionStep[] =
  [
    "dry_run_authorization_verified",
    "kill_switch_verified_armed",
    "single_call_counter_verified_zero_before_call",
    "provider_verified",
    "model_verified",
    "selected_case_verified",
    "api_key_presence_checked_without_value_logging",
    "prompt_constructed_in_memory_only",
    "prompt_text_not_logged",
    "live_llm_call_performed_once",
    "model_output_received_untrusted",
    "model_output_not_logged",
    "model_output_not_stored",
    "metadata_only_captured",
    "single_call_counter_verified_one_after_call",
    "kill_switch_disarmed_after_call",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
    "post_call_governance_recheck_required",
    "post_call_audit_required",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_METADATA_FIELDS: readonly LiveLlmSyntheticSingleCallExecutionMetadataField[] =
  [
    "provider_id",
    "model_id",
    "synthetic_case_id",
    "execution_id",
    "call_authorization_id",
    "api_key_presence_confirmed",
    "api_key_value_logged_false",
    "prompt_text_logged_false",
    "prompt_text_stored_false",
    "model_output_logged_false",
    "model_output_stored_false",
    "call_count",
    "counter_before",
    "counter_after",
    "kill_switch_before",
    "kill_switch_after",
    "model_output_untrusted",
    "governance_recheck_required",
    "post_call_audit_required",
    "user_visible_output_blocked",
    "persistence_blocked",
    "public_runtime_blocked",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_EXPECTED_OBSERVATIONS: readonly LiveLlmSyntheticSingleCallExecutionExpectedObservation[] =
  [
    "uncertainty_preserved",
    "relative_deadline_not_calculated_as_certainty",
    "delivery_date_required",
    "legal_certainty_not_claimed",
    "deadline_claim_requires_evidence",
    "model_output_marked_untrusted",
    "governance_recheck_required",
    "user_visible_output_blocked",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS: readonly LiveLlmSyntheticSingleCallExecutionBlocker[] =
  [
    "dry_run_authorization_not_ready",
    "kill_switch_not_armed",
    "single_call_counter_not_zero",
    "provider_invalid",
    "model_invalid",
    "selected_case_invalid",
    "api_key_missing",
    "api_key_value_exposure_detected",
    "prompt_logging_detected",
    "model_output_logging_detected",
    "model_output_storage_detected",
    "more_than_one_call_detected",
    "branch_c_dependency_detected",
    "run_smart_talk_dependency_detected",
    "ocr_runtime_dependency_detected",
    "real_input_detected",
    "raw_input_detected",
    "real_redacted_input_detected",
    "ocr_photo_file_input_detected",
    "public_request_detected",
    "user_visible_output_attempted",
    "persistence_attempted",
    "public_runtime_attempted",
    "post_call_governance_recheck_missing",
    "post_call_audit_missing",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_CHECKLIST: readonly LiveLlmSyntheticSingleCallExecutionChecklistItem[] =
  [
    "dry_run_authorization_reviewed",
    "provider_model_case_reviewed",
    "kill_switch_armed_reviewed",
    "single_call_counter_zero_reviewed",
    "api_key_presence_check_reviewed",
    "prompt_in_memory_only_reviewed",
    "prompt_not_logged_reviewed",
    "one_call_limit_reviewed",
    "model_output_untrusted_reviewed",
    "model_output_not_logged_reviewed",
    "model_output_not_stored_reviewed",
    "metadata_only_capture_reviewed",
    "counter_after_call_reviewed",
    "kill_switch_disarm_reviewed",
    "post_call_governance_recheck_reviewed",
    "post_call_audit_reviewed",
    "no_real_input_reviewed",
    "existing_runtime_isolation_reviewed",
    "no_user_visible_output_reviewed",
    "no_persistence_reviewed",
    "no_public_runtime_reviewed",
  ] as const;

export const REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that this phase performs exactly one synthetic live LLM call.",
    "I acknowledge that no real input, OCR, files, public requests, Branch C, run-smart-talk.ts, or persistence are allowed.",
    "I acknowledge that prompt text and model output must not be logged, returned, or persisted.",
    "I acknowledge that model output is untrusted and requires governance recheck.",
    "I acknowledge that this phase does not authorize public runtime or user-visible output.",
  ] as const;

export const FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_STRINGS: readonly string[] = [
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
] as const;

/** Rejection reasons that indicate a blocked (not unsafe) execution. */
export const BLOCKING_REJECTION_REASONS = new Set<LiveLlmSyntheticSingleCallExecutionRejectionReason>(
  [
    "api_key_missing",
    "single_call_counter_not_zero_before_call",
    "single_call_counter_not_one_after_call",
    "more_than_one_call_attempted",
    "dry_run_authorization_not_ready",
  ],
);
