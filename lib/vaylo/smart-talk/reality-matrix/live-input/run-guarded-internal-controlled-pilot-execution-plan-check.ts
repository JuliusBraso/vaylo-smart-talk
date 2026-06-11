/**
 * Guarded Internal Controlled Pilot Execution Plan Check (Phase 8.2L-0).
 *
 * Pure TypeScript plan consistency check. Verifies that:
 * - The 8.2K-5 closure audit is ready (readyForControlledPilotExecution: true)
 * - The 8.2L-0 plan constant has all required fields set correctly
 * - All 6 required env var names are represented in the plan
 * - All 16 abort criteria are represented in the plan
 * - readyForPilotRunNow is false
 * - readyForOperatorEnvVerification is true
 *
 * This module does NOT:
 * - execute the pilot
 * - call /api/smart-talk
 * - read real process.env values
 * - print or store secrets
 * - call any live LLM
 * - persist anything
 * - modify API routes or UI
 * - auto-execute at module load time
 *
 * Invoke `runGuardedInternalControlledPilotExecutionPlanCheck()` explicitly.
 */

import {
  GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1,
} from "./guarded-internal-controlled-pilot-execution-plan-types";
import { runGuardedPilotRuntimeClosureAudit } from "./run-guarded-pilot-runtime-closure-audit";

// ── Return type ───────────────────────────────────────────────────────────────

export interface GuardedInternalControlledPilotExecutionPlanCheckResult {
  readonly checkId: "8.2L-0";
  readonly allPassed: boolean;
  readonly closureAuditReady: boolean;
  readonly planReadyForOperatorEnvVerification: boolean;
  readonly planDoesNotRunPilot: true;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Helper ────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

// ── Check implementation ──────────────────────────────────────────────────────

/**
 * Runs the 8.2L-0 plan consistency check.
 *
 * Verifies the 8.2K-5 closure audit result and the 8.2L-0 plan constant
 * without executing the pilot, calling the API, or reading real env values.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runGuardedInternalControlledPilotExecutionPlanCheck(): GuardedInternalControlledPilotExecutionPlanCheckResult {
  const notes: string[] = [];
  let allPassed = true;

  // ── Verify 8.2K-5 closure audit ──────────────────────────────────────────

  const closureAudit = runGuardedPilotRuntimeClosureAudit();
  const closureRec = asRec(closureAudit);

  const closureReadyForExecution = closureAudit.readyForControlledPilotExecution;
  const closurePublicLaunchSafe = closureRec["readyForPublicLaunch"] !== true;
  const closureLiveLLMSafe = closureRec["readyForLiveLLMRuntime"] !== true;
  const closurePersistenceSafe = closureRec["readyForPersistence"] !== true;
  const closureBlockersEmpty = closureAudit.blockers.length === 0;

  const closureAuditReady =
    closureReadyForExecution &&
    closurePublicLaunchSafe &&
    closureLiveLLMSafe &&
    closurePersistenceSafe &&
    closureBlockersEmpty;

  notes.push(
    `8.2K-5 closure audit verdict: ${String(closureAudit.verdict)}`,
    `readyForControlledPilotExecution: ${String(closureReadyForExecution)}`,
    `blockers.length: ${String(closureAudit.blockers.length)}`,
    `closure publicLaunch/liveLLM/persistence safe: ${String(closurePublicLaunchSafe && closureLiveLLMSafe && closurePersistenceSafe)}`,
  );

  if (!closureAuditReady) {
    allPassed = false;
    notes.push("FAIL: 8.2K-5 closure audit is not ready for controlled pilot execution");
  } else {
    notes.push("PASS: 8.2K-5 closure audit ready");
  }

  // ── Verify plan constant ──────────────────────────────────────────────────

  const plan = GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1;
  const planRec = asRec(plan);

  const planIdOk = planRec["planId"] === "8.2L-0";
  const planStatusOk = planRec["status"] === "ready_for_phase_8_2l_1";
  const planClosureIdOk = planRec["requiredClosureAuditId"] === "8.2K-5";
  const planRequiredReadyOk = planRec["requiredReadyForControlledPilotExecution"] === true;
  const planNotRunningNow = planRec["readyForPilotRunNow"] !== true;
  const planEnvVerificationOk = planRec["readyForOperatorEnvVerification"] === true;
  const planPublicLaunchSafe = planRec["readyForPublicLaunch"] !== true;
  const planLiveLLMSafe = planRec["readyForLiveLLMRuntime"] !== true;
  const planPersistenceSafe = planRec["readyForPersistence"] !== true;
  const planNeverUserVisible = planRec["neverUserVisible"] === true;

  const planConstantOk =
    planIdOk &&
    planStatusOk &&
    planClosureIdOk &&
    planRequiredReadyOk &&
    planNotRunningNow &&
    planEnvVerificationOk &&
    planPublicLaunchSafe &&
    planLiveLLMSafe &&
    planPersistenceSafe &&
    planNeverUserVisible;

  notes.push(
    `planId === "8.2L-0": ${String(planIdOk)}`,
    `status === "ready_for_phase_8_2l_1": ${String(planStatusOk)}`,
    `requiredClosureAuditId === "8.2K-5": ${String(planClosureIdOk)}`,
    `requiredReadyForControlledPilotExecution === true: ${String(planRequiredReadyOk)}`,
    `readyForPilotRunNow !== true: ${String(planNotRunningNow)}`,
    `readyForOperatorEnvVerification === true: ${String(planEnvVerificationOk)}`,
    `plan safety invariants ok: ${String(planPublicLaunchSafe && planLiveLLMSafe && planPersistenceSafe && planNeverUserVisible)}`,
  );

  if (!planConstantOk) {
    allPassed = false;
    notes.push("FAIL: plan constant verification failed");
  } else {
    notes.push("PASS: plan constant verified");
  }

  // ── Verify required env var names are represented ─────────────────────────

  const envVarNames = plan.requiredEnvVars as ReadonlyArray<string>;
  const requiredNames = [
    "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
    "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
    "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
    "VAYLO_INTERNAL_RUNTIME_SECRET",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
    "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
  ] as const;

  const allEnvVarsPresent = requiredNames.every((name) => envVarNames.includes(name));

  notes.push(
    `requiredEnvVars count: ${String(envVarNames.length)} (expected 6)`,
    `all required env var names present: ${String(allEnvVarsPresent)}`,
  );

  if (!allEnvVarsPresent) {
    allPassed = false;
    notes.push("FAIL: one or more required env var names missing from plan");
  } else {
    notes.push("PASS: all required env var names represented");
  }

  // ── Verify all abort criteria are represented ─────────────────────────────

  const abortCriteria = plan.abortCriteria as ReadonlyArray<string>;
  const requiredAbortCriteria = [
    "closure_audit_not_ready",
    "missing_required_env",
    "kill_switch_enabled",
    "internal_secret_missing_or_unverified",
    "operator_not_allowlisted",
    "scenario_not_allowlisted",
    "unexpected_live_llm_call",
    "unexpected_persistence",
    "unexpected_dna_save",
    "unexpected_offline_save",
    "unexpected_user_visible_output",
    "raw_text_echo_detected",
    "secret_echo_detected",
    "public_runtime_path_used",
    "non_internal_request_used",
    "manual_reviewer_unavailable",
  ] as const;

  const allAbortCriteriaPresent = requiredAbortCriteria.every((c) =>
    abortCriteria.includes(c),
  );

  notes.push(
    `abortCriteria count: ${String(abortCriteria.length)} (expected 16)`,
    `all required abort criteria present: ${String(allAbortCriteriaPresent)}`,
  );

  if (!allAbortCriteriaPresent) {
    allPassed = false;
    notes.push("FAIL: one or more required abort criteria missing from plan");
  } else {
    notes.push("PASS: all required abort criteria represented");
  }

  // ── Result ────────────────────────────────────────────────────────────────

  return {
    checkId: "8.2L-0",
    allPassed,
    closureAuditReady,
    planReadyForOperatorEnvVerification: planEnvVerificationOk,
    planDoesNotRunPilot: true,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
    notes,
  };
}
