/**
 * Real Environment Attestation Contract Types (Phase 8.2M-2).
 *
 * Defines the typed attestation-only contract that a named human operator and
 * reviewer must satisfy to confirm environment readiness before any real
 * operator pilot run.
 *
 * This module does NOT:
 * - read process.env
 * - inspect, print, or store real environment values or secrets
 * - authorize a real pilot run
 * - persist attestation records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - modify API routes or UI
 *
 * The attestation model allows an operator to confirm by checklist that
 * required environment variables are present and correctly configured,
 * without this code ever reading, printing, or storing the actual values.
 *
 * Safety invariants on RealEnvironmentAttestationInput (all literal):
 * - envValuesReadByCode: false
 * - envValuesPrinted: false
 * - envValuesStored: false
 * - secretValuesPrinted: false
 * - secretValuesStored: false
 * - containsEnvValue: false
 * - containsSecret: false
 * - containsApiKey: false
 * - containsRealUserInput: false
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsModelOutput: false
 * - containsUserPii: false
 * - containsDocumentContent: false
 * - persistenceUsed: false
 * - publicRuntimeEnabled: false
 * - liveLLMCalled: false
 * - emittedToUserNow: false
 * - userVisibleOutputAllowed: false
 * - neverUserVisible: true
 *
 * Safety invariants on RealEnvironmentAttestationResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
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
 * - apiRouteModifiedByEnvironmentAttestation: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type RealEnvironmentAttestationStatus = "valid" | "rejected";

// ── Environment name ───────────────────────────────────────────────────────────

export type RealEnvironmentName =
  | "local_development"
  | "vercel_preview"
  | "vercel_production"
  | "internal_test_environment";

// ── Required env var names ─────────────────────────────────────────────────────

export type RequiredRealPilotEnvironmentVariableName =
  | "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME"
  | "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT"
  | "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH"
  | "VAYLO_INTERNAL_RUNTIME_SECRET"
  | "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST"
  | "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST"
  | "OPENAI_API_KEY"
  | "OPENAI_SMART_TALK_MODEL";

// ── Checklist items ────────────────────────────────────────────────────────────

export type RealEnvironmentAttestationChecklistItem =
  | "env_names_reviewed_without_values"
  | "internal_runtime_flag_attested"
  | "controlled_text_pilot_flag_attested"
  | "kill_switch_default_attested"
  | "internal_runtime_secret_presence_attested"
  | "operator_allowlist_presence_attested"
  | "scenario_allowlist_presence_attested"
  | "openai_key_presence_attested"
  | "smart_talk_model_presence_attested"
  | "no_env_values_read_by_code"
  | "no_env_values_printed"
  | "no_env_values_stored"
  | "no_secrets_printed"
  | "no_secrets_stored"
  | "no_public_runtime_enabled"
  | "no_live_llm_call_performed"
  | "no_persistence_performed"
  | "abort_possible_if_env_uncertain";

// ── Rejection reasons ──────────────────────────────────────────────────────────

export type RealEnvironmentAttestationRejectionReason =
  | "identity_contract_not_ready"
  | "missing_environment_name"
  | "missing_operator_identity_reference"
  | "missing_reviewer_identity_reference"
  | "missing_pilot_session_id"
  | "missing_required_env_name_attestation"
  | "missing_required_checklist_item"
  | "env_value_read_claim_detected"
  | "env_value_print_claim_detected"
  | "env_value_storage_claim_detected"
  | "secret_value_detected"
  | "secret_print_claim_detected"
  | "secret_storage_claim_detected"
  | "forbidden_env_value_detected"
  | "forbidden_secret_detected"
  | "forbidden_api_key_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_document_content_detected"
  | "real_user_input_detected"
  | "persistence_claim_detected"
  | "live_llm_claim_detected"
  | "public_runtime_claim_detected"
  | "user_visible_output_claim_detected"
  | "unsafe_attestation_note_detected";

// ── Attestation input ──────────────────────────────────────────────────────────

/**
 * Input for the real environment attestation contract.
 *
 * Carries only attestation metadata: env var names (not values), checklist
 * confirmations, operator/reviewer human IDs, and attestation statements.
 *
 * All env-value, secret, content, and runtime-safety flags are literal `false`.
 * No actual environment values or secrets are carried.
 */
export interface RealEnvironmentAttestationInput {
  readonly attestationId: string;
  readonly pilotSessionId: string;
  readonly environmentName: RealEnvironmentName;

  readonly identityContractReady: boolean;
  readonly operatorHumanId: string;
  readonly reviewerHumanId: string;

  readonly attestedEnvVarNames: readonly RequiredRealPilotEnvironmentVariableName[];
  readonly checklistConfirmed: readonly RealEnvironmentAttestationChecklistItem[];
  readonly operatorAttestationStatement: string;
  readonly reviewerAttestationStatement: string;
  readonly attestedAtIso: string;
  readonly notes: readonly string[];

  readonly envValuesReadByCode: false;
  readonly envValuesPrinted: false;
  readonly envValuesStored: false;
  readonly secretValuesPrinted: false;
  readonly secretValuesStored: false;
  readonly containsEnvValue: false;
  readonly containsSecret: false;
  readonly containsApiKey: false;

  readonly containsRealUserInput: false;
  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsUserPii: false;
  readonly containsDocumentContent: false;

  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly liveLLMCalled: false;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;

  readonly neverUserVisible: true;
}

// ── Attestation result ─────────────────────────────────────────────────────────

/**
 * Result of validating a `RealEnvironmentAttestationInput`.
 *
 * `safeEnvironmentMetadata` stores only safe, non-sensitive metadata.
 * No env values, secrets, API keys, PII, or document content are stored.
 *
 * Planning readiness flags may be `true` only when `accepted === true`.
 */
export interface RealEnvironmentAttestationResult {
  readonly attestationId: string;
  readonly status: RealEnvironmentAttestationStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly RealEnvironmentAttestationRejectionReason[];

  readonly safeEnvironmentMetadata: {
    readonly pilotSessionId: string;
    readonly environmentName: RealEnvironmentName;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly attestedEnvVarNames: readonly RequiredRealPilotEnvironmentVariableName[];
    readonly checklistPassedCount: number;
    readonly attestedAtIso: string;
  };

  readonly readyForAbortProtocol: boolean;
  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
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
  readonly apiRouteModifiedByEnvironmentAttestation: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ───────────────────────────────────────────────────────────────

/**
 * Result of `runRealEnvironmentAttestationContractCheck()` (Phase 8.2M-2).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-1 identity contract is ready.
 * 2. The synthetic attestation input is accepted.
 * 3. All tamper cases are rejected.
 *
 * All env-value and secret literal flags are always `false`.
 */
export interface RealEnvironmentAttestationCheckResult {
  readonly checkId: "8.2M-2";
  readonly allPassed: boolean;
  readonly identityContractReady: boolean;
  readonly syntheticAttestationAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForAbortProtocol: boolean;
  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly envValuesReadByCode: false;
  readonly envValuesPrinted: false;
  readonly envValuesStored: false;
  readonly secretValuesPrinted: false;
  readonly secretValuesStored: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ─────────────────────────────────────────────────────────

export const REQUIRED_REAL_PILOT_ENV_VAR_NAMES: readonly RequiredRealPilotEnvironmentVariableName[] =
  [
    "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
    "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
    "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
    "VAYLO_INTERNAL_RUNTIME_SECRET",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
    "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
    "OPENAI_API_KEY",
    "OPENAI_SMART_TALK_MODEL",
  ] as const;

export const REQUIRED_REAL_ENVIRONMENT_ATTESTATION_CHECKLIST: readonly RealEnvironmentAttestationChecklistItem[] =
  [
    "env_names_reviewed_without_values",
    "internal_runtime_flag_attested",
    "controlled_text_pilot_flag_attested",
    "kill_switch_default_attested",
    "internal_runtime_secret_presence_attested",
    "operator_allowlist_presence_attested",
    "scenario_allowlist_presence_attested",
    "openai_key_presence_attested",
    "smart_talk_model_presence_attested",
    "no_env_values_read_by_code",
    "no_env_values_printed",
    "no_env_values_stored",
    "no_secrets_printed",
    "no_secrets_stored",
    "no_public_runtime_enabled",
    "no_live_llm_call_performed",
    "no_persistence_performed",
    "abort_possible_if_env_uncertain",
  ] as const;

/**
 * Strings that must never appear in any attestation field, statement, or notes.
 * Includes env assignments, secret markers, raw/draft text markers, PII, and
 * document content markers.
 */
export const FORBIDDEN_REAL_ENVIRONMENT_ATTESTATION_STRINGS: readonly string[] =
  [
    "sk-",
    "OPENAI_API_KEY=",
    "OPENAI_SMART_TALK_MODEL=",
    "VAYLO_INTERNAL_RUNTIME_SECRET=",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST=",
    "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST=",
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

export const REQUIRED_REAL_ENVIRONMENT_ATTESTATION_STATEMENTS: readonly string[] =
  [
    "I confirm the required environment variable names were reviewed without exposing values.",
    "I confirm no environment values or secrets were read, printed, or stored by this contract.",
    "I understand this does not authorize real pilot execution.",
    "I understand public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;
