/**
 * Operator Environment Verification Contract Check (Phase 8.2L-1).
 *
 * Pure TypeScript implementation of the operator environment verification
 * contract. Provides:
 *
 * - `buildSyntheticOperatorEnvironmentVerificationInput()` — safe synthetic
 *   input for contract testing with all operator booleans set correctly.
 * - `validateOperatorEnvironmentVerificationInput()` — validates an operator-
 *   provided input against the full verification contract rules.
 * - `runOperatorEnvironmentVerificationContractCheck()` — runs the 8.2L-0
 *   plan check, builds and validates the synthetic input, and returns an
 *   aggregate check result.
 *
 * This module does NOT:
 * - read process.env
 * - print or store real environment variable values
 * - store or print secret values
 * - run the pilot
 * - call /api/smart-talk or any HTTP endpoint
 * - call any live LLM
 * - persist anything
 * - modify API routes or UI
 * - auto-execute at module load time
 *
 * Invoke `runOperatorEnvironmentVerificationContractCheck()` explicitly.
 */

import {
  REQUIRED_OPERATOR_ENVIRONMENT_CHECKLIST,
  REQUIRED_OPERATOR_ENVIRONMENT_VARIABLES,
} from "./operator-environment-verification-contract-types";
import type {
  OperatorEnvironmentVerificationEnvVarAttestation,
  OperatorEnvironmentVerificationEnvVarName,
  OperatorEnvironmentVerificationFailureReason,
  OperatorEnvironmentVerificationInput,
  OperatorEnvironmentVerificationResult,
} from "./operator-environment-verification-contract-types";
import { runGuardedInternalControlledPilotExecutionPlanCheck } from "./run-guarded-internal-controlled-pilot-execution-plan-check";

// ── Return type ───────────────────────────────────────────────────────────────

export interface OperatorEnvironmentVerificationContractCheckResult {
  readonly checkId: "8.2L-1";
  readonly allPassed: boolean;
  readonly planCheckPassed: boolean;
  readonly syntheticVerificationPassed: boolean;
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
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function addFailure(
  list: OperatorEnvironmentVerificationFailureReason[],
  reason: OperatorEnvironmentVerificationFailureReason,
): void {
  if (!list.includes(reason)) {
    list.push(reason);
  }
}

// ── Lookup tables ─────────────────────────────────────────────────────────────

type ExpectedState = OperatorEnvironmentVerificationEnvVarAttestation["operatorConfirmedExpectedState"];

const EXPECTED_ENV_VAR_STATES: Record<OperatorEnvironmentVerificationEnvVarName, ExpectedState> = {
  VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME: "true",
  VAYLO_ENABLE_CONTROLLED_TEXT_PILOT: "true",
  VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH: "not_true",
  VAYLO_INTERNAL_RUNTIME_SECRET: "configured_non_empty",
  VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST: "configured_csv_allowlist",
  VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST: "configured_csv_allowlist",
};

const ENV_VAR_FAILURE_MAP: Record<
  OperatorEnvironmentVerificationEnvVarName,
  OperatorEnvironmentVerificationFailureReason
> = {
  VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME: "internal_runtime_feature_flag_not_confirmed_true",
  VAYLO_ENABLE_CONTROLLED_TEXT_PILOT: "controlled_text_pilot_flag_not_confirmed_true",
  VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH: "kill_switch_not_confirmed_disabled",
  VAYLO_INTERNAL_RUNTIME_SECRET: "internal_runtime_secret_not_confirmed_configured",
  VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST: "allowlist_not_confirmed_configured",
  VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST: "scenario_allowlist_not_confirmed_configured",
};

// ── Synthetic input builder ───────────────────────────────────────────────────

/**
 * Builds a safe synthetic operator verification input.
 *
 * All operator booleans are set correctly for a passing verification.
 * No real environment variable values are included.
 * No secrets are included.
 * This input is for contract testing only.
 */
export function buildSyntheticOperatorEnvironmentVerificationInput(): OperatorEnvironmentVerificationInput {
  const attestations: OperatorEnvironmentVerificationEnvVarAttestation[] = [
    {
      name: "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "true",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
    {
      name: "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "true",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
    {
      name: "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "not_true",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
    {
      name: "VAYLO_INTERNAL_RUNTIME_SECRET",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "configured_non_empty",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
    {
      name: "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "configured_csv_allowlist",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
    {
      name: "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
      operatorConfirmedPresent: true,
      operatorConfirmedExpectedState: "configured_csv_allowlist",
      valueStored: false,
      valuePrinted: false,
      secretValueStored: false,
      secretValuePrinted: false,
      neverUserVisible: true,
    },
  ];

  return {
    verificationId: "operator-env-verification-8-2l-1",
    operatorId: "internal-reviewer-1",
    pilotRunId: "pilot-run-8-2l-1",
    pilotScenarioId: "pilot_invoice_basic",

    closureAuditReady: true,
    executionPlanReadyForOperatorEnvVerification: true,

    envVarAttestations: attestations,
    checklistConfirmed: [
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
    ],

    noRealEnvValuesProvided: true,
    noSecretValuesProvided: true,
    noPilotRunExecuted: true,
    noHttpCallMade: true,
    noLiveLLMCalled: true,
    noPersistenceUsed: true,
    noUserVisibleOutput: true,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `OperatorEnvironmentVerificationInput` against the full
 * verification contract rules.
 *
 * Applies 14 validation rules covering:
 * - closure audit and execution plan readiness
 * - env var attestation coverage and correctness
 * - no secret storage or printing
 * - operator checklist completeness
 * - safety invariant checks (defensive, via asRec cast)
 *
 * Returns an `OperatorEnvironmentVerificationResult` with literal-false
 * safety invariants. Does NOT read process.env. Does NOT store secrets.
 */
export function validateOperatorEnvironmentVerificationInput(
  input: OperatorEnvironmentVerificationInput,
): OperatorEnvironmentVerificationResult {
  const failures: OperatorEnvironmentVerificationFailureReason[] = [];

  // ── Rules 1–2: prerequisite checks ───────────────────────────────────────

  if (!input.closureAuditReady) {
    addFailure(failures, "closure_audit_not_confirmed_ready");
  }

  if (!input.executionPlanReadyForOperatorEnvVerification) {
    addFailure(failures, "execution_plan_not_confirmed_ready");
  }

  // ── Rules 3–6: env var attestation checks ────────────────────────────────

  const attestedNames = input.envVarAttestations.map((a) => a.name);

  const requiredEnvVarsCovered = REQUIRED_OPERATOR_ENVIRONMENT_VARIABLES.every(
    (varName) => attestedNames.includes(varName),
  );

  if (!requiredEnvVarsCovered) {
    addFailure(failures, "missing_required_env_var_attestation");
  }

  for (const varName of REQUIRED_OPERATOR_ENVIRONMENT_VARIABLES) {
    const attestation = input.envVarAttestations.find((a) => a.name === varName);

    if (!attestation) {
      // Already captured by requiredEnvVarsCovered check above
      continue;
    }

    // Rule 4: must be confirmed present
    if (!attestation.operatorConfirmedPresent) {
      addFailure(failures, "missing_required_env_var_attestation");
    }

    // Rule 5: no secret or value stored/printed (defensive via asRec)
    const attRec = asRec(attestation);
    if (
      attRec["valueStored"] === true ||
      attRec["valuePrinted"] === true ||
      attRec["secretValueStored"] === true ||
      attRec["secretValuePrinted"] === true
    ) {
      addFailure(failures, "internal_runtime_secret_printed_or_stored");
    }

    // Rule 6: expected state must match
    const expectedState = EXPECTED_ENV_VAR_STATES[varName];
    if (attestation.operatorConfirmedExpectedState !== expectedState) {
      addFailure(failures, ENV_VAR_FAILURE_MAP[varName]);
    }
  }

  // ── Rules 7–14: checklist and safety invariant checks ────────────────────

  const confirmed = input.checklistConfirmed;

  // Operator ID allowlisted
  if (!confirmed.includes("allowlist_contains_operator_id")) {
    addFailure(failures, "operator_id_not_confirmed_allowlisted");
  }

  // Scenario ID allowlisted
  if (!confirmed.includes("scenario_allowlist_contains_declared_scenario_id")) {
    addFailure(failures, "scenario_id_not_confirmed_allowlisted");
  }

  // Guard phrase
  if (!confirmed.includes("guard_phrase_confirmed_available")) {
    addFailure(failures, "guard_phrase_not_confirmed_available");
  }

  // No public tester
  if (!confirmed.includes("no_public_tester_confirmed")) {
    addFailure(failures, "public_tester_risk_not_cleared");
  }

  // No real sensitive document
  if (!confirmed.includes("no_real_sensitive_document_confirmed")) {
    addFailure(failures, "real_sensitive_document_risk_not_cleared");
  }

  // No live LLM (checklist + safety invariant)
  const inputRec = asRec(input);
  if (
    !confirmed.includes("no_live_llm_confirmed") ||
    inputRec["noLiveLLMCalled"] !== true
  ) {
    addFailure(failures, "live_llm_risk_not_cleared");
  }

  // No persistence (checklist + safety invariant)
  if (
    !confirmed.includes("no_persistence_confirmed") ||
    inputRec["noPersistenceUsed"] !== true
  ) {
    addFailure(failures, "persistence_risk_not_cleared");
  }

  // No DNA save
  if (!confirmed.includes("no_dna_save_confirmed")) {
    addFailure(failures, "dna_save_risk_not_cleared");
  }

  // No offline save
  if (!confirmed.includes("no_offline_save_confirmed")) {
    addFailure(failures, "offline_save_risk_not_cleared");
  }

  // Abort criteria understood
  if (!confirmed.includes("abort_criteria_confirmed_understood")) {
    addFailure(failures, "abort_criteria_not_confirmed");
  }

  // ── Coverage summaries ────────────────────────────────────────────────────

  const requiredChecklistCovered = REQUIRED_OPERATOR_ENVIRONMENT_CHECKLIST.every(
    (item) => confirmed.includes(item),
  );

  // ── Verdict ───────────────────────────────────────────────────────────────

  const passed = failures.length === 0;

  return {
    verificationId: input.verificationId,
    status: passed ? "passed" : "failed",
    passed,
    failureReasons: failures,

    requiredEnvVarsCovered,
    requiredChecklistCovered,

    readyForSingleRunExecutionHarness: passed,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realEnvValuesRead: false,
    envValuesStored: false,
    secretValuesStored: false,
    secretValuesPrinted: false,

    liveLLMCalled: false,
    apiRouteModifiedByVerification: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Aggregate check ───────────────────────────────────────────────────────────

/**
 * Runs the full 8.2L-1 operator environment verification contract check.
 *
 * Steps:
 * 1. Calls `runGuardedInternalControlledPilotExecutionPlanCheck()` (8.2L-0).
 * 2. Builds a synthetic `OperatorEnvironmentVerificationInput`.
 * 3. Validates it via `validateOperatorEnvironmentVerificationInput()`.
 * 4. Returns an aggregate result with all safety invariants as literal types.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runOperatorEnvironmentVerificationContractCheck(): OperatorEnvironmentVerificationContractCheckResult {
  const notes: string[] = [];

  // Step 1: verify 8.2L-0 plan check passes
  const planCheck = runGuardedInternalControlledPilotExecutionPlanCheck();
  const planCheckPassed = planCheck.allPassed;

  notes.push(
    `8.2L-0 plan check allPassed: ${String(planCheckPassed)}`,
    `8.2L-0 closureAuditReady: ${String(planCheck.closureAuditReady)}`,
    `8.2L-0 planReadyForOperatorEnvVerification: ${String(planCheck.planReadyForOperatorEnvVerification)}`,
  );

  if (!planCheckPassed) {
    notes.push("FAIL: 8.2L-0 plan check did not pass");
  } else {
    notes.push("PASS: 8.2L-0 plan check passed");
  }

  // Step 2 & 3: build and validate synthetic input
  const syntheticInput = buildSyntheticOperatorEnvironmentVerificationInput();
  const verificationResult = validateOperatorEnvironmentVerificationInput(syntheticInput);
  const syntheticVerificationPassed = verificationResult.passed;

  notes.push(
    `synthetic verification status: ${verificationResult.status}`,
    `failureReasons.length: ${String(verificationResult.failureReasons.length)}`,
    `requiredEnvVarsCovered: ${String(verificationResult.requiredEnvVarsCovered)}`,
    `requiredChecklistCovered: ${String(verificationResult.requiredChecklistCovered)}`,
    `readyForSingleRunExecutionHarness: ${String(verificationResult.readyForSingleRunExecutionHarness)}`,
  );

  if (!syntheticVerificationPassed) {
    notes.push(
      `FAIL: synthetic verification failed with reasons: ${verificationResult.failureReasons.join(", ")}`,
    );
  } else {
    notes.push("PASS: synthetic verification passed");
  }

  const allPassed = planCheckPassed && syntheticVerificationPassed;

  return {
    checkId: "8.2L-1",
    allPassed,
    planCheckPassed,
    syntheticVerificationPassed,
    readyForSingleRunExecutionHarness: verificationResult.readyForSingleRunExecutionHarness,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    realEnvValuesRead: false,
    envValuesStored: false,
    secretValuesStored: false,
    secretValuesPrinted: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    notes,
  };
}
