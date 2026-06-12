/**
 * Real Operator Pilot Authorization Plan Check (Phase 8.2M-0).
 *
 * Verifies the 8.2L controlled pilot execution closure and formally opens the
 * 8.2M planning epoch by producing a `RealOperatorPilotAuthorizationPlanCheckResult`.
 *
 * This module does NOT:
 * - authorize or execute a real operator pilot run
 * - persist records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - read process.env
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runRealOperatorPilotAuthorizationPlanCheck()` explicitly.
 */

import { runControlledPilotExecutionClosure } from "./run-controlled-pilot-execution-closure";
import {
  BLOCKED_REAL_OPERATOR_PILOT_CAPABILITIES,
  REAL_OPERATOR_PILOT_AUTHORIZATION_OPEN_ITEMS,
  REQUIRED_REAL_OPERATOR_PILOT_AUTHORIZATION_PREREQUISITES,
} from "./real-operator-pilot-authorization-plan-types";
import type { RealOperatorPilotAuthorizationPlanCheckResult } from "./real-operator-pilot-authorization-plan-types";

// ── Helper ─────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

// ── Plan check implementation ──────────────────────────────────────────────────

/**
 * Runs the Real Operator Pilot Authorization Plan check for the 8.2M-0 phase.
 *
 * Calls `runControlledPilotExecutionClosure()` (8.2L-5), verifies its result
 * against all required invariants, sets planning readiness flags, and returns
 * a `RealOperatorPilotAuthorizationPlanCheckResult`.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runRealOperatorPilotAuthorizationPlanCheck(): RealOperatorPilotAuthorizationPlanCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2L controlled pilot execution closure ─────────────

  const closure = runControlledPilotExecutionClosure();
  const closureRec = asRec(closure);

  // Required closure invariants — all checked defensively
  const closureVerdictOk = closure.verdict === "closed_with_warnings";
  const closureNoBlockers = closure.blockers.length === 0;
  const closureReadyForPlanning = closure.readyForNextEpochPlanning === true;

  // Safety invariants that must remain false / true
  const closureRealPilotFalse = closureRec["readyForRealOperatorPilotRun"] !== true;
  const closurePilotNowFalse = closureRec["readyForPilotRunNow"] !== true;
  const closurePublicFalse = closureRec["readyForPublicLaunch"] !== true;
  const closureLLMFalse = closureRec["readyForLiveLLMRuntime"] !== true;
  const closurePersistenceFalse = closureRec["readyForPersistence"] !== true;
  const closurePhotoOcrFalse = closureRec["readyForPhotoOcrRuntime"] !== true;
  const closureFileUploadFalse = closureRec["readyForFileUploadRuntime"] !== true;
  const closurePaymentFalse = closureRec["readyForPaymentRuntime"] !== true;
  const closureRealPilotRunFalse = closureRec["realPilotRunExecuted"] !== true;
  const closureHttpFalse = closureRec["httpCallMade"] !== true;
  const closureApiCalledFalse = closureRec["apiRouteCalled"] !== true;
  const closureLiveLLMFalse = closureRec["liveLLMCalled"] !== true;
  const closurePersistenceUsedFalse = closureRec["persistenceUsed"] !== true;
  const closureDnaFalse = closureRec["dnaSavePerformed"] !== true;
  const closureOfflineFalse = closureRec["offlineSavePerformed"] !== true;
  const closureEmittedFalse = closureRec["emittedToUserNow"] !== true;
  const closureNeverVisible = closureRec["neverUserVisible"] === true;

  // Content storage must all be false
  const closureRawTextFalse = closureRec["rawTextStored"] !== true;
  const closureRedactedFalse = closureRec["redactedTextStored"] !== true;
  const closureDraftFalse = closureRec["fullDraftTextStored"] !== true;
  const closureModelOutputFalse = closureRec["modelOutputStored"] !== true;
  const closureSecretFalse = closureRec["secretStored"] !== true;
  const closurePiiFalse = closureRec["userPiiStored"] !== true;
  const closureDocFalse = closureRec["documentContentStored"] !== true;

  notes.push(`closure.verdict: ${closure.verdict}`);
  notes.push(`closure.blockers.length: ${String(closure.blockers.length)}`);
  notes.push(`closure.readyForNextEpochPlanning: ${String(closure.readyForNextEpochPlanning)}`);
  notes.push(`closureVerdictOk: ${String(closureVerdictOk)}`);
  notes.push(`closureNoBlockers: ${String(closureNoBlockers)}`);
  notes.push(`closureReadyForPlanning: ${String(closureReadyForPlanning)}`);
  notes.push(`closureLiveLLMFalse: ${String(closureLiveLLMFalse)}`);
  notes.push(`closurePersistenceUsedFalse: ${String(closurePersistenceUsedFalse)}`);
  notes.push(`closureNeverVisible: ${String(closureNeverVisible)}`);

  // All safety invariants must pass for the previous epoch to be verified
  const previousEpochClosureVerified =
    closureVerdictOk &&
    closureNoBlockers &&
    closureReadyForPlanning &&
    closureRealPilotFalse &&
    closurePilotNowFalse &&
    closurePublicFalse &&
    closureLLMFalse &&
    closurePersistenceFalse &&
    closurePhotoOcrFalse &&
    closureFileUploadFalse &&
    closurePaymentFalse &&
    closureRealPilotRunFalse &&
    closureHttpFalse &&
    closureApiCalledFalse &&
    closureLiveLLMFalse &&
    closurePersistenceUsedFalse &&
    closureDnaFalse &&
    closureOfflineFalse &&
    closureEmittedFalse &&
    closureNeverVisible &&
    closureRawTextFalse &&
    closureRedactedFalse &&
    closureDraftFalse &&
    closureModelOutputFalse &&
    closureSecretFalse &&
    closurePiiFalse &&
    closureDocFalse;

  const previousEpochVerdictAccepted = closureVerdictOk;
  const previousEpochReadyForNextPlanning = closure.readyForNextEpochPlanning === true;

  notes.push(`previousEpochClosureVerified: ${String(previousEpochClosureVerified)}`);

  // ── Step 2: Set planning readiness flags ───────────────────────────────────

  const readyForOperatorIdentityContract = previousEpochClosureVerified;
  const readyForRealEnvironmentAttestationContract = previousEpochClosureVerified;
  const readyForAbortProtocol = previousEpochClosureVerified;
  const readyForRealInputPolicy = previousEpochClosureVerified;
  const readyForEvidencePolicy = previousEpochClosureVerified;
  const readyForPostRunAuditPlanning = previousEpochClosureVerified;

  // ── Step 3: Determine status ───────────────────────────────────────────────

  const status = previousEpochClosureVerified
    ? ("ready_for_phase_8_2m_1" as const)
    : ("blocked" as const);

  notes.push(`status: ${status}`);
  notes.push(
    `readyForOperatorIdentityContract: ${String(readyForOperatorIdentityContract)}`,
  );

  // ── Return result ──────────────────────────────────────────────────────────

  return {
    planId: "8.2M-0",
    planVersion: "real-operator-pilot-authorization-plan-v1",
    status,

    prerequisites: REQUIRED_REAL_OPERATOR_PILOT_AUTHORIZATION_PREREQUISITES,
    blockedCapabilities: BLOCKED_REAL_OPERATOR_PILOT_CAPABILITIES,
    openItems: REAL_OPERATOR_PILOT_AUTHORIZATION_OPEN_ITEMS,

    previousEpochClosureVerified,
    previousEpochVerdictAccepted,
    previousEpochReadyForNextPlanning,

    readyForOperatorIdentityContract,
    readyForRealEnvironmentAttestationContract,
    readyForAbortProtocol,
    readyForRealInputPolicy,
    readyForEvidencePolicy,
    readyForPostRunAuditPlanning,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    readyForPhotoOcrRuntime: false,
    readyForFileUploadRuntime: false,
    readyForPaymentRuntime: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    secretStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByPlan: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
