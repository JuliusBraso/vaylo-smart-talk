/**
 * Post-Execution Audit (Phase 8.2L-4).
 *
 * Formally audits the complete 8.2L controlled pilot execution chain:
 *   8.2L-0 — execution plan check
 *   8.2L-1 — operator environment verification contract check
 *   8.2L-2 — single-run execution harness
 *   8.2L-3 — manual review capture model check
 *
 * Returns a `PostExecutionAuditResult` with verdict `"closed_with_warnings"`
 * if all four layers pass, or `"blocked"` if any layer fails or any
 * safety invariant is violated.
 *
 * This module does NOT:
 * - persist audit records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - import or execute app/api/smart-talk/route.ts
 * - read process.env
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runPostExecutionAudit()` explicitly.
 */

import { runGuardedInternalControlledPilotExecutionPlanCheck } from "./run-guarded-internal-controlled-pilot-execution-plan-check";
import { runManualReviewCaptureModelCheck } from "./run-manual-review-capture-model-check";
import { runOperatorEnvironmentVerificationContractCheck } from "./run-operator-environment-verification-contract-check";
import { runSingleRunExecutionHarness } from "./run-single-run-execution-harness";
import type {
  PostExecutionAuditBlocker,
  PostExecutionAuditLayerResult,
  PostExecutionAuditOpenItem,
  PostExecutionAuditResult,
} from "./post-execution-audit-types";

// ── Helper ─────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function addBlocker(
  list: PostExecutionAuditBlocker[],
  blocker: PostExecutionAuditBlocker,
): void {
  if (!list.includes(blocker)) {
    list.push(blocker);
  }
}

// ── Audit implementation ───────────────────────────────────────────────────────

/**
 * Runs the post-execution audit for the 8.2L chain.
 *
 * Calls each of the four 8.2L phase check functions, verifies their results
 * against the required invariants, builds layer results, collects blockers,
 * and returns a `PostExecutionAuditResult`.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runPostExecutionAudit(): PostExecutionAuditResult {
  const blockers: PostExecutionAuditBlocker[] = [];
  const layerResults: PostExecutionAuditLayerResult[] = [];

  // ── Layer 1: Execution Plan (8.2L-0) ──────────────────────────────────────

  const planCheck = runGuardedInternalControlledPilotExecutionPlanCheck();
  const planRec = asRec(planCheck);

  const planPassed =
    planCheck.allPassed &&
    planRec["planDoesNotRunPilot"] === true &&
    planRec["readyForPilotRunNow"] !== true &&
    planRec["readyForPublicLaunch"] !== true &&
    planRec["readyForLiveLLMRuntime"] !== true &&
    planRec["readyForPersistence"] !== true &&
    planRec["liveLLMCalled"] !== true &&
    planRec["persistenceUsed"] !== true &&
    planRec["emittedToUserNow"] !== true;

  layerResults.push({
    layerId: "phase_8_2l_0_execution_plan",
    present: true,
    passed: planPassed,
    notes: [
      `allPassed: ${String(planCheck.allPassed)}`,
      `closureAuditReady: ${String(planCheck.closureAuditReady)}`,
      `planReadyForOperatorEnvVerification: ${String(planCheck.planReadyForOperatorEnvVerification)}`,
      `planDoesNotRunPilot: ${String(planRec["planDoesNotRunPilot"])}`,
    ],
  });

  if (!planPassed) {
    addBlocker(blockers, "execution_plan_not_ready");
  }
  if (planRec["liveLLMCalled"] === true) addBlocker(blockers, "live_llm_detected");
  if (planRec["persistenceUsed"] === true) addBlocker(blockers, "persistence_detected");
  if (planRec["emittedToUserNow"] === true) addBlocker(blockers, "user_visible_output_detected");

  // ── Layer 2: Operator Environment Verification (8.2L-1) ───────────────────

  const operatorCheck = runOperatorEnvironmentVerificationContractCheck();
  const operatorRec = asRec(operatorCheck);

  const operatorPassed =
    operatorCheck.allPassed &&
    operatorCheck.readyForSingleRunExecutionHarness &&
    operatorRec["readyForPilotRunNow"] !== true &&
    operatorRec["readyForPublicLaunch"] !== true &&
    operatorRec["readyForLiveLLMRuntime"] !== true &&
    operatorRec["readyForPersistence"] !== true &&
    operatorRec["realEnvValuesRead"] !== true &&
    operatorRec["envValuesStored"] !== true &&
    operatorRec["secretValuesStored"] !== true &&
    operatorRec["secretValuesPrinted"] !== true &&
    operatorRec["liveLLMCalled"] !== true &&
    operatorRec["persistenceUsed"] !== true &&
    operatorRec["emittedToUserNow"] !== true;

  layerResults.push({
    layerId: "phase_8_2l_1_operator_environment_verification_contract",
    present: true,
    passed: operatorPassed,
    notes: [
      `allPassed: ${String(operatorCheck.allPassed)}`,
      `readyForSingleRunExecutionHarness: ${String(operatorCheck.readyForSingleRunExecutionHarness)}`,
      `planCheckPassed: ${String(operatorCheck.planCheckPassed)}`,
      `syntheticVerificationPassed: ${String(operatorCheck.syntheticVerificationPassed)}`,
      `realEnvValuesRead: ${String(operatorRec["realEnvValuesRead"])}`,
      `secretValuesStored: ${String(operatorRec["secretValuesStored"])}`,
    ],
  });

  if (!operatorPassed) {
    addBlocker(blockers, "operator_environment_verification_failed");
  }
  if (operatorRec["liveLLMCalled"] === true) addBlocker(blockers, "live_llm_detected");
  if (operatorRec["persistenceUsed"] === true) addBlocker(blockers, "persistence_detected");
  if (operatorRec["emittedToUserNow"] === true) addBlocker(blockers, "user_visible_output_detected");
  if (operatorRec["realEnvValuesRead"] === true || operatorRec["secretValuesStored"] === true) {
    addBlocker(blockers, "secret_storage_detected");
  }

  // ── Layer 3: Single-Run Execution Harness (8.2L-2) ────────────────────────

  const harness = runSingleRunExecutionHarness();
  const harnessRec = asRec(harness);

  const harnessPassed =
    harness.status === "completed_synthetic_single_run" &&
    harness.blockers.length === 0 &&
    harness.readyForManualReviewCaptureModel &&
    harnessRec["readyForPilotRunNow"] !== true &&
    harnessRec["readyForPublicLaunch"] !== true &&
    harnessRec["readyForLiveLLMRuntime"] !== true &&
    harnessRec["readyForPersistence"] !== true &&
    harnessRec["httpCallMade"] !== true &&
    harnessRec["apiRouteCalled"] !== true &&
    harnessRec["liveLLMCalled"] !== true &&
    harnessRec["persistenceUsed"] !== true &&
    harnessRec["dnaSavePerformed"] !== true &&
    harnessRec["offlineSavePerformed"] !== true &&
    harnessRec["emittedToUserNow"] !== true;

  layerResults.push({
    layerId: "phase_8_2l_2_single_run_execution_harness",
    present: true,
    passed: harnessPassed,
    notes: [
      `status: ${harness.status}`,
      `blockers.length: ${String(harness.blockers.length)}`,
      `readyForManualReviewCaptureModel: ${String(harness.readyForManualReviewCaptureModel)}`,
      `rawTextLeakCheckPassed: ${String(harness.rawTextLeakCheckPassed)}`,
      `secretLeakCheckPassed: ${String(harness.secretLeakCheckPassed)}`,
      `noLiveLLMCheckPassed: ${String(harness.noLiveLLMCheckPassed)}`,
      `noPersistenceCheckPassed: ${String(harness.noPersistenceCheckPassed)}`,
    ],
  });

  if (!harnessPassed) {
    addBlocker(blockers, "single_run_execution_harness_failed");
  }
  if (harnessRec["liveLLMCalled"] === true) addBlocker(blockers, "live_llm_detected");
  if (harnessRec["persistenceUsed"] === true) addBlocker(blockers, "persistence_detected");
  if (harnessRec["dnaSavePerformed"] === true) addBlocker(blockers, "dna_save_detected");
  if (harnessRec["offlineSavePerformed"] === true) addBlocker(blockers, "offline_save_detected");
  if (harnessRec["emittedToUserNow"] === true) addBlocker(blockers, "user_visible_output_detected");
  if (harnessRec["httpCallMade"] === true || harnessRec["apiRouteCalled"] === true) {
    addBlocker(blockers, "http_call_detected");
  }
  if (!harness.rawTextLeakCheckPassed) addBlocker(blockers, "raw_text_storage_detected");
  if (!harness.secretLeakCheckPassed) addBlocker(blockers, "secret_storage_detected");

  // ── Layer 4: Manual Review Capture Model (8.2L-3) ─────────────────────────

  const reviewCheck = runManualReviewCaptureModelCheck();
  const reviewRec = asRec(reviewCheck);

  const reviewPassed =
    reviewCheck.allPassed &&
    reviewCheck.singleRunHarnessReady &&
    reviewCheck.syntheticReviewAccepted &&
    reviewCheck.tamperCasesRejected &&
    reviewCheck.readyForPostExecutionAudit &&
    reviewRec["readyForPilotRunNow"] !== true &&
    reviewRec["readyForPublicLaunch"] !== true &&
    reviewRec["readyForLiveLLMRuntime"] !== true &&
    reviewRec["readyForPersistence"] !== true &&
    reviewRec["liveLLMCalled"] !== true &&
    reviewRec["persistenceUsed"] !== true &&
    reviewRec["dnaSavePerformed"] !== true &&
    reviewRec["offlineSavePerformed"] !== true &&
    reviewRec["emittedToUserNow"] !== true;

  layerResults.push({
    layerId: "phase_8_2l_3_manual_review_capture_model",
    present: true,
    passed: reviewPassed,
    notes: [
      `allPassed: ${String(reviewCheck.allPassed)}`,
      `singleRunHarnessReady: ${String(reviewCheck.singleRunHarnessReady)}`,
      `syntheticReviewAccepted: ${String(reviewCheck.syntheticReviewAccepted)}`,
      `tamperCasesRejected: ${String(reviewCheck.tamperCasesRejected)}`,
      `readyForPostExecutionAudit: ${String(reviewCheck.readyForPostExecutionAudit)}`,
    ],
  });

  if (!reviewPassed) {
    addBlocker(blockers, "manual_review_capture_failed");
  }
  if (reviewRec["liveLLMCalled"] === true) addBlocker(blockers, "live_llm_detected");
  if (reviewRec["persistenceUsed"] === true) addBlocker(blockers, "persistence_detected");
  if (reviewRec["dnaSavePerformed"] === true) addBlocker(blockers, "dna_save_detected");
  if (reviewRec["offlineSavePerformed"] === true) addBlocker(blockers, "offline_save_detected");
  if (reviewRec["emittedToUserNow"] === true) addBlocker(blockers, "user_visible_output_detected");

  // ── Open items (always present) ────────────────────────────────────────────

  const openItems: readonly PostExecutionAuditOpenItem[] = [
    "real_operator_environment_not_executed",
    "real_pilot_run_not_executed",
    "live_llm_runtime_still_blocked",
    "public_runtime_still_blocked",
    "persistence_still_blocked",
    "photo_ocr_runtime_still_blocked",
    "payment_runtime_still_blocked",
    "multilingual_runtime_still_blocked",
    "production_monitoring_still_missing",
    "production_abuse_controls_not_yet_finalized",
  ];

  // ── Verdict ────────────────────────────────────────────────────────────────

  const verdict =
    blockers.length === 0
      ? ("closed_with_warnings" as const)
      : ("blocked" as const);

  return {
    auditId: "8.2L-4",
    auditVersion: "post-execution-audit-v1",
    verdict,

    layerResults,
    blockers,
    openItems,

    executionPlanPassed: planPassed,
    operatorEnvironmentVerificationPassed: operatorPassed,
    singleRunExecutionHarnessPassed: harnessPassed,
    manualReviewCaptureModelPassed: reviewPassed,

    readyForControlledPilotExecutionClosure: blockers.length === 0,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    readyForPhotoOcrRuntime: false,
    readyForPaymentRuntime: false,

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
    apiRouteModifiedByPostExecutionAudit: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}
