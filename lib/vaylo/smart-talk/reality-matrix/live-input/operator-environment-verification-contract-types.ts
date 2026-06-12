/**
 * Operator Environment Verification Contract Types (Phase 8.2L-1).
 *
 * Defines the typed contract for operator environment verification before
 * any guarded internal controlled pilot run.
 *
 * This module does NOT:
 * - read process.env
 * - print or store environment variable values
 * - store secret values
 * - run the pilot
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 *
 * The operator verification contract works exclusively on:
 * - environment variable names (not values)
 * - operator-provided boolean attestations
 * - pass/fail decision based on those booleans alone
 *
 * Safety invariants on all result types:
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realEnvValuesRead: false
 * - envValuesStored: false
 * - secretValuesStored: false
 * - secretValuesPrinted: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByVerification: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Verification status ───────────────────────────────────────────────────────

export type OperatorEnvironmentVerificationStatus =
  | "not_started"
  | "failed"
  | "passed";

// ── Env var names ─────────────────────────────────────────────────────────────

/**
 * The names of the required environment variables.
 * Values are never read, stored, or printed by this contract.
 */
export type OperatorEnvironmentVerificationEnvVarName =
  | "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME"
  | "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT"
  | "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH"
  | "VAYLO_INTERNAL_RUNTIME_SECRET"
  | "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST"
  | "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST";

// ── Operator checklist items ──────────────────────────────────────────────────

export type OperatorEnvironmentVerificationChecklistItem =
  | "internal_runtime_feature_flag_confirmed_true"
  | "controlled_text_pilot_flag_confirmed_true"
  | "kill_switch_confirmed_not_true"
  | "internal_runtime_secret_confirmed_configured"
  | "internal_runtime_secret_not_printed"
  | "internal_runtime_secret_not_stored"
  | "allowlist_confirmed_configured"
  | "allowlist_contains_operator_id"
  | "scenario_allowlist_confirmed_configured"
  | "scenario_allowlist_contains_declared_scenario_id"
  | "guard_phrase_confirmed_available"
  | "no_public_tester_confirmed"
  | "no_real_sensitive_document_confirmed"
  | "no_live_llm_confirmed"
  | "no_persistence_confirmed"
  | "no_dna_save_confirmed"
  | "no_offline_save_confirmed"
  | "abort_criteria_confirmed_understood";

// ── Failure reasons ───────────────────────────────────────────────────────────

export type OperatorEnvironmentVerificationFailureReason =
  | "missing_required_env_var_attestation"
  | "internal_runtime_feature_flag_not_confirmed_true"
  | "controlled_text_pilot_flag_not_confirmed_true"
  | "kill_switch_not_confirmed_disabled"
  | "internal_runtime_secret_not_confirmed_configured"
  | "internal_runtime_secret_printed_or_stored"
  | "allowlist_not_confirmed_configured"
  | "operator_id_not_confirmed_allowlisted"
  | "scenario_allowlist_not_confirmed_configured"
  | "scenario_id_not_confirmed_allowlisted"
  | "guard_phrase_not_confirmed_available"
  | "public_tester_risk_not_cleared"
  | "real_sensitive_document_risk_not_cleared"
  | "live_llm_risk_not_cleared"
  | "persistence_risk_not_cleared"
  | "dna_save_risk_not_cleared"
  | "offline_save_risk_not_cleared"
  | "abort_criteria_not_confirmed"
  | "closure_audit_not_confirmed_ready"
  | "execution_plan_not_confirmed_ready";

// ── Env var attestation ───────────────────────────────────────────────────────

/**
 * An operator attestation for a single required environment variable.
 *
 * The operator confirms:
 * - the variable is present (`operatorConfirmedPresent`)
 * - what state they believe it to be in (`operatorConfirmedExpectedState`)
 *
 * Critically:
 * - `valueStored: false` — no value is stored here
 * - `valuePrinted: false` — no value is printed here
 * - `secretValueStored: false` — no secret is stored here
 * - `secretValuePrinted: false` — no secret is printed here
 */
export interface OperatorEnvironmentVerificationEnvVarAttestation {
  readonly name: OperatorEnvironmentVerificationEnvVarName;
  readonly operatorConfirmedPresent: boolean;
  readonly operatorConfirmedExpectedState:
    | "true"
    | "not_true"
    | "configured_non_empty"
    | "configured_csv_allowlist";
  readonly valueStored: false;
  readonly valuePrinted: false;
  readonly secretValueStored: false;
  readonly secretValuePrinted: false;
  readonly neverUserVisible: true;
}

// ── Verification input ────────────────────────────────────────────────────────

/**
 * The operator-provided verification input.
 *
 * Contains only booleans, attestation metadata, and checklist confirmations.
 * No actual environment variable values, no secrets.
 */
export interface OperatorEnvironmentVerificationInput {
  readonly verificationId: string;
  readonly operatorId: string;
  readonly pilotRunId: string;
  readonly pilotScenarioId: string;

  readonly closureAuditReady: boolean;
  readonly executionPlanReadyForOperatorEnvVerification: boolean;

  readonly envVarAttestations: readonly OperatorEnvironmentVerificationEnvVarAttestation[];
  readonly checklistConfirmed: readonly OperatorEnvironmentVerificationChecklistItem[];

  readonly noRealEnvValuesProvided: true;
  readonly noSecretValuesProvided: true;
  readonly noPilotRunExecuted: true;
  readonly noHttpCallMade: true;
  readonly noLiveLLMCalled: true;
  readonly noPersistenceUsed: true;
  readonly noUserVisibleOutput: true;

  readonly neverUserVisible: true;
}

// ── Verification result ───────────────────────────────────────────────────────

/**
 * The result of validating an `OperatorEnvironmentVerificationInput`.
 *
 * `readyForSingleRunExecutionHarness` is the only readiness flag that may be
 * true. It signals that 8.2L-2 single-run execution harness planning may begin.
 * It does NOT mean the pilot runs now — `readyForPilotRunNow` remains `false`.
 *
 * All safety invariant flags are literal types.
 */
export interface OperatorEnvironmentVerificationResult {
  readonly verificationId: string;
  readonly status: OperatorEnvironmentVerificationStatus;
  readonly passed: boolean;
  readonly failureReasons: readonly OperatorEnvironmentVerificationFailureReason[];

  readonly requiredEnvVarsCovered: boolean;
  readonly requiredChecklistCovered: boolean;

  readonly readyForSingleRunExecutionHarness: boolean;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realEnvValuesRead: false;
  readonly envValuesStored: false;
  readonly secretValuesStored: false;
  readonly secretValuesPrinted: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByVerification: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Required constants ────────────────────────────────────────────────────────

/**
 * All required environment variable names for the guarded pilot runtime.
 * Contains names only — no values, no secrets.
 */
export const REQUIRED_OPERATOR_ENVIRONMENT_VARIABLES: ReadonlyArray<OperatorEnvironmentVerificationEnvVarName> =
  [
    "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
    "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
    "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
    "VAYLO_INTERNAL_RUNTIME_SECRET",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
    "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
  ];

/**
 * All required operator checklist items.
 * Every item must be confirmed by the operator before a pilot run is attempted.
 */
export const REQUIRED_OPERATOR_ENVIRONMENT_CHECKLIST: ReadonlyArray<OperatorEnvironmentVerificationChecklistItem> =
  [
    "internal_runtime_feature_flag_confirmed_true",
    "controlled_text_pilot_flag_confirmed_true",
    "kill_switch_confirmed_not_true",
    "internal_runtime_secret_confirmed_configured",
    "internal_runtime_secret_not_printed",
    "internal_runtime_secret_not_stored",
    "allowlist_confirmed_configured",
    "allowlist_contains_operator_id",
    "scenario_allowlist_confirmed_configured",
    "scenario_allowlist_contains_declared_scenario_id",
    "guard_phrase_confirmed_available",
    "no_public_tester_confirmed",
    "no_real_sensitive_document_confirmed",
    "no_live_llm_confirmed",
    "no_persistence_confirmed",
    "no_dna_save_confirmed",
    "no_offline_save_confirmed",
    "abort_criteria_confirmed_understood",
  ];
