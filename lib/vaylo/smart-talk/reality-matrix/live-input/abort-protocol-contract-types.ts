/**
 * Abort Protocol Contract Types (Phase 8.2M-3).
 *
 * Defines the typed abort protocol contract that a named human operator and
 * reviewer must satisfy to confirm an abort path exists before any real
 * operator pilot run can be authorized.
 *
 * This module does NOT:
 * - read process.env
 * - execute a real abort
 * - modify a kill switch or runtime abort hook
 * - authorize a real pilot run
 * - persist any records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - modify API routes or UI
 *
 * This contract only validates that an abort path is specified before a future
 * pilot can be authorized. It is not a runtime kill switch implementation.
 *
 * Safety invariants on AbortProtocolContractInput (all literal):
 * - realAbortExecuted: false
 * - killSwitchModifiedByContract: false
 * - runtimeAbortHookModifiedByContract: false
 * - containsRealUserInput: false
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsModelOutput: false
 * - containsSecret: false
 * - containsEnvValue: false
 * - containsApiKey: false
 * - containsUserPii: false
 * - containsDocumentContent: false
 * - persistenceUsed: false
 * - publicRuntimeEnabled: false
 * - liveLLMCalled: false
 * - emittedToUserNow: false
 * - userVisibleOutputAllowed: false
 * - neverUserVisible: true
 *
 * Safety invariants on AbortProtocolContractResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realAbortExecuted: false
 * - realUserInputProcessed: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - envValueStored: false
 * - secretStored: false
 * - apiKeyStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByAbortProtocol: false
 * - killSwitchModifiedByContract: false
 * - runtimeAbortHookModifiedByContract: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ──────────────────────────────────────────────────────────────────

export type AbortProtocolContractStatus = "valid" | "rejected";

// ── Abort trigger conditions ────────────────────────────────────────────────

export type AbortProtocolTrigger =
  | "operator_manual_abort"
  | "reviewer_manual_abort"
  | "kill_switch_enabled"
  | "unexpected_runtime_output"
  | "user_visible_output_attempted"
  | "live_llm_unexpectedly_called"
  | "persistence_attempt_detected"
  | "public_runtime_attempt_detected"
  | "raw_text_leak_detected"
  | "secret_or_env_value_leak_detected"
  | "pii_leak_detected"
  | "document_content_leak_detected"
  | "unsafe_legal_certainty_detected"
  | "automatic_deadline_claim_detected"
  | "missing_manual_review_detected"
  | "monitoring_uncertain"
  | "operator_uncertain"
  | "reviewer_uncertain";

// ── Abort stop actions ──────────────────────────────────────────────────────

export type AbortProtocolStopAction =
  | "stop_current_run"
  | "block_user_visible_output"
  | "block_persistence"
  | "block_live_llm_continuation"
  | "block_public_runtime"
  | "mark_run_invalid"
  | "require_manual_review"
  | "require_post_run_audit"
  | "require_incident_note"
  | "require_next_phase_blocked_until_review";

// ── Checklist items ─────────────────────────────────────────────────────────

export type AbortProtocolChecklistItem =
  | "kill_switch_path_attested"
  | "operator_manual_abort_path_attested"
  | "reviewer_manual_abort_path_attested"
  | "abort_triggers_reviewed"
  | "stop_actions_reviewed"
  | "user_visible_output_block_on_abort_attested"
  | "persistence_block_on_abort_attested"
  | "live_llm_continuation_block_on_abort_attested"
  | "public_runtime_block_on_abort_attested"
  | "manual_review_required_after_abort_attested"
  | "post_run_audit_required_after_abort_attested"
  | "incident_note_required_after_abort_attested"
  | "operator_abort_acknowledged"
  | "reviewer_abort_acknowledged"
  | "rollback_or_stop_confirmation_required"
  | "no_runtime_abort_execution_performed"
  | "no_persistence_performed"
  | "no_public_runtime_enabled";

// ── Rejection reasons ───────────────────────────────────────────────────────

export type AbortProtocolRejectionReason =
  | "environment_attestation_not_ready"
  | "missing_pilot_session_id"
  | "missing_operator_identity_reference"
  | "missing_reviewer_identity_reference"
  | "missing_abort_trigger"
  | "missing_stop_action"
  | "missing_required_checklist_item"
  | "missing_operator_acknowledgment"
  | "missing_reviewer_acknowledgment"
  | "missing_rollback_or_stop_confirmation"
  | "invalid_abort_monitoring_mode"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_document_content_detected"
  | "forbidden_model_output_detected"
  | "real_user_input_detected"
  | "real_abort_execution_detected"
  | "persistence_claim_detected"
  | "live_llm_claim_detected"
  | "public_runtime_claim_detected"
  | "user_visible_output_claim_detected"
  | "unsafe_abort_note_detected";

// ── Monitoring mode ─────────────────────────────────────────────────────────

export type AbortMonitoringMode =
  | "manual_operator_monitoring"
  | "manual_operator_and_reviewer_monitoring";

// ── Contract input ──────────────────────────────────────────────────────────

/**
 * Input for the abort protocol contract.
 *
 * Carries only protocol metadata: pilot session ID, operator/reviewer human
 * IDs, trigger conditions, stop actions, checklist confirmations, and
 * acknowledgment statements.
 *
 * All content, env-value, secret, and runtime-safety flags are literal `false`.
 * No abort is executed. No kill switch is modified. No persistence occurs.
 */
export interface AbortProtocolContractInput {
  readonly contractId: string;
  readonly pilotSessionId: string;

  readonly environmentAttestationReady: boolean;
  readonly operatorHumanId: string;
  readonly reviewerHumanId: string;

  readonly abortMonitoringMode: AbortMonitoringMode;
  readonly requiredAbortTriggers: readonly AbortProtocolTrigger[];
  readonly requiredStopActions: readonly AbortProtocolStopAction[];
  readonly checklistConfirmed: readonly AbortProtocolChecklistItem[];

  readonly operatorAbortAcknowledgment: string;
  readonly reviewerAbortAcknowledgment: string;
  readonly rollbackOrStopConfirmation: string;
  readonly notes: readonly string[];

  readonly realAbortExecuted: false;
  readonly killSwitchModifiedByContract: false;
  readonly runtimeAbortHookModifiedByContract: false;

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

  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly liveLLMCalled: false;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;

  readonly neverUserVisible: true;
}

// ── Contract result ─────────────────────────────────────────────────────────

/**
 * Result of validating an `AbortProtocolContractInput`.
 *
 * `safeAbortProtocolMetadata` stores only safe, non-sensitive metadata.
 * No env values, secrets, API keys, PII, or document content are stored.
 *
 * Planning readiness flags may be `true` only when `accepted === true`.
 * `readyForRealOperatorPilotRun` is always `false`.
 */
export interface AbortProtocolContractResult {
  readonly contractId: string;
  readonly status: AbortProtocolContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly AbortProtocolRejectionReason[];

  readonly safeAbortProtocolMetadata: {
    readonly pilotSessionId: string;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly abortMonitoringMode: AbortMonitoringMode;
    readonly requiredAbortTriggersCount: number;
    readonly requiredStopActionsCount: number;
    readonly checklistPassedCount: number;
  };

  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realAbortExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly envValueStored: false;
  readonly secretStored: false;
  readonly apiKeyStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByAbortProtocol: false;
  readonly killSwitchModifiedByContract: false;
  readonly runtimeAbortHookModifiedByContract: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ────────────────────────────────────────────────────────────

/**
 * Result of `runAbortProtocolContractCheck()` (Phase 8.2M-3).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-2 environment attestation is ready.
 * 2. The synthetic abort protocol input is accepted.
 * 3. All tamper cases are rejected.
 *
 * All abort-execution, kill-switch, env-value, and secret literal flags are
 * always `false`. No real abort is executed. No kill switch is modified.
 */
export interface AbortProtocolContractCheckResult {
  readonly checkId: "8.2M-3";
  readonly allPassed: boolean;
  readonly environmentAttestationReady: boolean;
  readonly syntheticAbortProtocolAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realAbortExecuted: false;
  readonly realUserInputProcessed: false;
  readonly killSwitchModifiedByContract: false;
  readonly runtimeAbortHookModifiedByContract: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ──────────────────────────────────────────────────────

/** All abort trigger conditions that must be included in a valid contract. */
export const REQUIRED_ABORT_PROTOCOL_TRIGGERS: readonly AbortProtocolTrigger[] =
  [
    "operator_manual_abort",
    "reviewer_manual_abort",
    "kill_switch_enabled",
    "unexpected_runtime_output",
    "user_visible_output_attempted",
    "live_llm_unexpectedly_called",
    "persistence_attempt_detected",
    "public_runtime_attempt_detected",
    "raw_text_leak_detected",
    "secret_or_env_value_leak_detected",
    "pii_leak_detected",
    "document_content_leak_detected",
    "unsafe_legal_certainty_detected",
    "automatic_deadline_claim_detected",
    "missing_manual_review_detected",
    "monitoring_uncertain",
    "operator_uncertain",
    "reviewer_uncertain",
  ] as const;

/** All stop actions that must be included in a valid contract. */
export const REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS: readonly AbortProtocolStopAction[] =
  [
    "stop_current_run",
    "block_user_visible_output",
    "block_persistence",
    "block_live_llm_continuation",
    "block_public_runtime",
    "mark_run_invalid",
    "require_manual_review",
    "require_post_run_audit",
    "require_incident_note",
    "require_next_phase_blocked_until_review",
  ] as const;

/** All checklist items that must be confirmed in a valid contract. */
export const REQUIRED_ABORT_PROTOCOL_CHECKLIST: readonly AbortProtocolChecklistItem[] =
  [
    "kill_switch_path_attested",
    "operator_manual_abort_path_attested",
    "reviewer_manual_abort_path_attested",
    "abort_triggers_reviewed",
    "stop_actions_reviewed",
    "user_visible_output_block_on_abort_attested",
    "persistence_block_on_abort_attested",
    "live_llm_continuation_block_on_abort_attested",
    "public_runtime_block_on_abort_attested",
    "manual_review_required_after_abort_attested",
    "post_run_audit_required_after_abort_attested",
    "incident_note_required_after_abort_attested",
    "operator_abort_acknowledged",
    "reviewer_abort_acknowledged",
    "rollback_or_stop_confirmation_required",
    "no_runtime_abort_execution_performed",
    "no_persistence_performed",
    "no_public_runtime_enabled",
  ] as const;

/**
 * Required statements that must appear in both operator and reviewer
 * abort acknowledgments.
 */
export const REQUIRED_ABORT_PROTOCOL_ACKNOWLEDGMENT_STATEMENTS: readonly string[] =
  [
    "I acknowledge that I can manually abort the future pilot run at any point.",
    "I acknowledge that user-visible output remains blocked on abort.",
    "I acknowledge that persistence remains blocked on abort.",
    "I acknowledge that post-run audit is required after abort.",
  ] as const;

/**
 * Strings that must never appear in any abort protocol field, acknowledgment,
 * confirmation, or notes. Includes env assignments, secret markers,
 * raw/draft text markers, PII, and document content markers.
 */
export const FORBIDDEN_ABORT_PROTOCOL_STRINGS: readonly string[] = [
  "sk-",
  "OPENAI_API_KEY=",
  "VAYLO_INTERNAL_RUNTIME_SECRET=",
  "process.env",
  "apiKey",
  "internalSecret",
  "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
  "IBAN",
  "Steuer-ID",
  "Aktenzeichen",
  "Sehr geehrter",
  "BG-Nr",
  "john@example.com",
  "+49 170 1234567",
] as const;
