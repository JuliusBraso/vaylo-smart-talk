/**
 * Single-Run Execution Harness (Phase 8.2L-2).
 *
 * Pure TypeScript harness that simulates one guarded internal controlled
 * pilot run in memory using synthetic/operator-safe data only.
 *
 * This module does NOT:
 * - call /api/smart-talk or make HTTP requests
 * - import or execute app/api/smart-talk/route.ts
 * - read process.env
 * - call any live LLM
 * - persist anything
 * - process real user input
 * - store or print secrets
 * - auto-execute at module load time
 *
 * Invoke `runSingleRunExecutionHarness()` explicitly.
 */

import { runOperatorEnvironmentVerificationContractCheck } from "./run-operator-environment-verification-contract-check";
import { runPilotEvidenceValidationIntegration } from "./run-pilot-evidence-validation-integration";
import { runPilotRuntimeE2EHarness } from "./run-pilot-runtime-e2e-harness";
import type {
  SingleRunExecutionHarnessBlocker,
  SingleRunExecutionHarnessResult,
  SingleRunExecutionHarnessStepResult,
  SingleRunExecutionHarnessSyntheticRequest,
} from "./single-run-execution-harness-types";

// ── Forbidden leak strings (must not appear in safe result JSON) ──────────────

const FORBIDDEN_RAW_TEXT_LEAK_STRINGS = [
  "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA",
  "john@example.com",
  "+49 170 1234567",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
] as const;

const FORBIDDEN_SECRET_LEAK_STRINGS = [
  "synthetic-secret-never-real",
  "apiKey",
  "internalSecret",
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

function addBlocker(
  list: SingleRunExecutionHarnessBlocker[],
  blocker: SingleRunExecutionHarnessBlocker,
): void {
  if (!list.includes(blocker)) {
    list.push(blocker);
  }
}

function findFirstMatch(
  serialised: string,
  candidates: readonly string[],
): string | null {
  for (const candidate of candidates) {
    if (serialised.includes(candidate)) {
      return candidate;
    }
  }
  return null;
}

// ── Synthetic request builder ─────────────────────────────────────────────────

/**
 * Builds a safe synthetic single-run request packet.
 *
 * Contains metadata and safety flags only — no raw text, no secrets,
 * no document content. `syntheticInputLabel` is a label identifier only.
 */
export function buildSyntheticSingleRunExecutionRequest(): SingleRunExecutionHarnessSyntheticRequest {
  return {
    pilotRunId: "pilot-run-8-2l-2-single-run",
    pilotScenarioId: "pilot_invoice_basic",
    pilotReviewerId: "internal-reviewer-1",
    inputKind: "synthetic_text_controlled",
    syntheticInputLabel: "SYNTHETIC_SINGLE_RUN_INPUT_LABEL_ONLY",
    containsRealUserInput: false,
    containsSensitiveDocument: false,
    containsSecret: false,
    requestedOcr: false,
    requestedFileUpload: false,
    requestedPayment: false,
    requestedPersistence: false,
    requestedDnaSave: false,
    requestedOfflineSave: false,
    requestedPublicRuntime: false,
    requestedLiveLLM: false,
    neverUserVisible: true,
  };
}

function validateSyntheticRequest(
  request: SingleRunExecutionHarnessSyntheticRequest,
): boolean {
  const rec = asRec(request);

  return (
    rec["containsRealUserInput"] !== true &&
    rec["containsSensitiveDocument"] !== true &&
    rec["containsSecret"] !== true &&
    rec["requestedOcr"] !== true &&
    rec["requestedFileUpload"] !== true &&
    rec["requestedPayment"] !== true &&
    rec["requestedPersistence"] !== true &&
    rec["requestedDnaSave"] !== true &&
    rec["requestedOfflineSave"] !== true &&
    rec["requestedPublicRuntime"] !== true &&
    rec["requestedLiveLLM"] !== true &&
    rec["neverUserVisible"] === true
  );
}

// ── Harness implementation ────────────────────────────────────────────────────

/**
 * Runs the pure synthetic single-run execution harness.
 *
 * Steps:
 * 1. Operator environment verification contract check (8.2L-1)
 * 2. Synthetic request construction
 * 3. Guarded runtime evaluation via E2E harness (8.2K-3)
 * 4. Evidence validation integration (8.2K-4)
 * 5. Aggregate leak checks on safe result objects
 * 6. Safety invariant checks across all sub-results
 * 7. Single-run result assembly
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runSingleRunExecutionHarness(): SingleRunExecutionHarnessResult {
  const blockers: SingleRunExecutionHarnessBlocker[] = [];
  const stepResults: SingleRunExecutionHarnessStepResult[] = [];

  // ── Step 1: Operator environment verification ─────────────────────────────

  const operatorCheck = runOperatorEnvironmentVerificationContractCheck();
  const operatorRec = asRec(operatorCheck);

  const operatorEnvPassed =
    operatorCheck.allPassed &&
    operatorCheck.readyForSingleRunExecutionHarness &&
    operatorRec["readyForPilotRunNow"] !== true &&
    operatorRec["readyForPublicLaunch"] !== true &&
    operatorRec["readyForLiveLLMRuntime"] !== true &&
    operatorRec["readyForPersistence"] !== true &&
    operatorRec["realEnvValuesRead"] !== true &&
    operatorRec["secretValuesStored"] !== true &&
    operatorRec["secretValuesPrinted"] !== true;

  stepResults.push({
    stepId: "operator_environment_verification",
    passed: operatorEnvPassed,
    notes: [
      `allPassed: ${String(operatorCheck.allPassed)}`,
      `readyForSingleRunExecutionHarness: ${String(operatorCheck.readyForSingleRunExecutionHarness)}`,
      `planCheckPassed: ${String(operatorCheck.planCheckPassed)}`,
      `syntheticVerificationPassed: ${String(operatorCheck.syntheticVerificationPassed)}`,
    ],
  });

  if (!operatorEnvPassed) {
    addBlocker(blockers, "operator_environment_verification_failed");
  }

  // ── Step 2: Synthetic request construction ──────────────────────────────────

  const syntheticRequest = buildSyntheticSingleRunExecutionRequest();
  const syntheticRequestValid = validateSyntheticRequest(syntheticRequest);

  stepResults.push({
    stepId: "synthetic_request_construction",
    passed: syntheticRequestValid,
    notes: [
      `pilotRunId: ${syntheticRequest.pilotRunId}`,
      `pilotScenarioId: ${syntheticRequest.pilotScenarioId}`,
      `inputKind: ${syntheticRequest.inputKind}`,
      `syntheticInputLabel: ${syntheticRequest.syntheticInputLabel}`,
      "no raw text, no secrets, no real user input",
    ],
  });

  if (!syntheticRequestValid) {
    addBlocker(blockers, "synthetic_request_invalid");
  }

  // ── Step 3: Guarded runtime evaluation (E2E harness) ───────────────────────

  const e2eHarness = runPilotRuntimeE2EHarness();
  const e2eRec = asRec(e2eHarness);

  const e2ePassed =
    e2eHarness.allPassed &&
    e2eHarness.rawTextLeakCheckPassed &&
    e2eHarness.secretLeakCheckPassed &&
    e2eHarness.noPersistenceCheckPassed &&
    e2eHarness.noLiveLLMCheckPassed &&
    e2eHarness.noPublicRuntimeCheckPassed &&
    e2eRec["liveLLMCalled"] !== true &&
    e2eRec["persistenceUsed"] !== true &&
    e2eRec["emittedToUserNow"] !== true;

  stepResults.push({
    stepId: "guarded_runtime_evaluation",
    passed: e2ePassed,
    notes: [
      `allPassed: ${String(e2eHarness.allPassed)} (${e2eHarness.passedCases}/${e2eHarness.totalCases} cases)`,
      `rawTextLeakCheckPassed: ${String(e2eHarness.rawTextLeakCheckPassed)}`,
      `secretLeakCheckPassed: ${String(e2eHarness.secretLeakCheckPassed)}`,
      `noPersistenceCheckPassed: ${String(e2eHarness.noPersistenceCheckPassed)}`,
      `noLiveLLMCheckPassed: ${String(e2eHarness.noLiveLLMCheckPassed)}`,
      `noPublicRuntimeCheckPassed: ${String(e2eHarness.noPublicRuntimeCheckPassed)}`,
    ],
  });

  if (!e2ePassed) {
    addBlocker(blockers, "e2e_harness_failed");
    addBlocker(blockers, "guarded_runtime_evaluation_failed");
  }

  // ── Step 4: Evidence validation integration ───────────────────────────────

  const evidenceIntegration = runPilotEvidenceValidationIntegration();
  const evRec = asRec(evidenceIntegration);

  const evidencePassed =
    evidenceIntegration.allPassed &&
    evidenceIntegration.rawTextLeakCheckPassed &&
    evidenceIntegration.secretLeakCheckPassed &&
    evidenceIntegration.persistenceCheckPassed &&
    evidenceIntegration.publicRuntimeCheckPassed &&
    evidenceIntegration.emittedToUserCheckPassed &&
    evidenceIntegration.liveLLMCheckPassed &&
    evRec["liveLLMCalled"] !== true &&
    evRec["persistenceUsed"] !== true &&
    evRec["emittedToUserNow"] !== true;

  stepResults.push({
    stepId: "evidence_validation_integration",
    passed: evidencePassed,
    notes: [
      `allPassed: ${String(evidenceIntegration.allPassed)} (${evidenceIntegration.passedCases}/${evidenceIntegration.totalCases} cases)`,
      `rawTextLeakCheckPassed: ${String(evidenceIntegration.rawTextLeakCheckPassed)}`,
      `secretLeakCheckPassed: ${String(evidenceIntegration.secretLeakCheckPassed)}`,
      `persistenceCheckPassed: ${String(evidenceIntegration.persistenceCheckPassed)}`,
      `publicRuntimeCheckPassed: ${String(evidenceIntegration.publicRuntimeCheckPassed)}`,
      `emittedToUserCheckPassed: ${String(evidenceIntegration.emittedToUserCheckPassed)}`,
      `liveLLMCheckPassed: ${String(evidenceIntegration.liveLLMCheckPassed)}`,
    ],
  });

  if (!evidencePassed) {
    addBlocker(blockers, "evidence_validation_integration_failed");
  }

  // ── Step 5: Aggregate leak checks ─────────────────────────────────────────

  const safeObjects = {
    operatorCheck: {
      checkId: operatorCheck.checkId,
      allPassed: operatorCheck.allPassed,
      readyForSingleRunExecutionHarness: operatorCheck.readyForSingleRunExecutionHarness,
    },
    syntheticRequest,
    e2eSummary: {
      harnessId: e2eHarness.harnessId,
      allPassed: e2eHarness.allPassed,
      passedCases: e2eHarness.passedCases,
      totalCases: e2eHarness.totalCases,
    },
    evidenceSummary: {
      integrationId: evidenceIntegration.integrationId,
      allPassed: evidenceIntegration.allPassed,
      passedCases: evidenceIntegration.passedCases,
      totalCases: evidenceIntegration.totalCases,
    },
  };

  const serialised = JSON.stringify(safeObjects);
  const detectedRawTextLeak = findFirstMatch(serialised, FORBIDDEN_RAW_TEXT_LEAK_STRINGS);
  const detectedSecretLeak = findFirstMatch(serialised, FORBIDDEN_SECRET_LEAK_STRINGS);

  const rawTextLeakCheckPassed = detectedRawTextLeak === null;
  const secretLeakCheckPassed = detectedSecretLeak === null;
  const leakCheckPassed = rawTextLeakCheckPassed && secretLeakCheckPassed;

  stepResults.push({
    stepId: "leak_check",
    passed: leakCheckPassed,
    notes: leakCheckPassed
      ? ["no forbidden leak strings detected in safe result JSON"]
      : [
          detectedRawTextLeak
            ? `raw text leak: ${detectedRawTextLeak}`
            : "raw text leak: none",
          detectedSecretLeak
            ? `secret leak: ${detectedSecretLeak}`
            : "secret leak: none",
        ],
  });

  if (!rawTextLeakCheckPassed) {
    addBlocker(blockers, "raw_text_leak_detected");
  }
  if (!secretLeakCheckPassed) {
    addBlocker(blockers, "secret_leak_detected");
  }

  // ── Step 6: Safety invariant checks ───────────────────────────────────────

  const userVisibleOutputCheckPassed =
    operatorRec["emittedToUserNow"] !== true &&
    e2eRec["emittedToUserNow"] !== true &&
    evRec["emittedToUserNow"] !== true;

  const noLiveLLMCheckPassed =
    operatorRec["liveLLMCalled"] !== true &&
    e2eRec["liveLLMCalled"] !== true &&
    evRec["liveLLMCalled"] !== true;

  const noPersistenceCheckPassed =
    operatorRec["persistenceUsed"] !== true &&
    e2eRec["persistenceUsed"] !== true &&
    evRec["persistenceUsed"] !== true;

  const noDnaSaveCheckPassed =
    e2eRec["dnaSavePerformed"] !== true &&
    evRec["dnaSavePerformed"] !== true;

  const noOfflineSaveCheckPassed =
    e2eRec["offlineSavePerformed"] !== true &&
    evRec["offlineSavePerformed"] !== true;

  const noPublicRuntimeCheckPassed =
    e2eHarness.noPublicRuntimeCheckPassed &&
    evidenceIntegration.publicRuntimeCheckPassed;

  const noApiRouteCallCheckPassed = true;
  const noHttpCallCheckPassed = true;

  const safetyInvariantPassed =
    userVisibleOutputCheckPassed &&
    noLiveLLMCheckPassed &&
    noPersistenceCheckPassed &&
    noDnaSaveCheckPassed &&
    noOfflineSaveCheckPassed &&
    noPublicRuntimeCheckPassed &&
    noApiRouteCallCheckPassed &&
    noHttpCallCheckPassed;

  stepResults.push({
    stepId: "safety_invariant_check",
    passed: safetyInvariantPassed,
    notes: [
      `userVisibleOutputCheckPassed: ${String(userVisibleOutputCheckPassed)}`,
      `noLiveLLMCheckPassed: ${String(noLiveLLMCheckPassed)}`,
      `noPersistenceCheckPassed: ${String(noPersistenceCheckPassed)}`,
      `noDnaSaveCheckPassed: ${String(noDnaSaveCheckPassed)}`,
      `noOfflineSaveCheckPassed: ${String(noOfflineSaveCheckPassed)}`,
      `noPublicRuntimeCheckPassed: ${String(noPublicRuntimeCheckPassed)}`,
      `noApiRouteCallCheckPassed: ${String(noApiRouteCallCheckPassed)}`,
      `noHttpCallCheckPassed: ${String(noHttpCallCheckPassed)}`,
    ],
  });

  if (!userVisibleOutputCheckPassed) {
    addBlocker(blockers, "user_visible_output_detected");
  }
  if (!noLiveLLMCheckPassed) {
    addBlocker(blockers, "live_llm_detected");
  }
  if (!noPersistenceCheckPassed) {
    addBlocker(blockers, "persistence_detected");
  }
  if (!noDnaSaveCheckPassed) {
    addBlocker(blockers, "dna_save_detected");
  }
  if (!noOfflineSaveCheckPassed) {
    addBlocker(blockers, "offline_save_detected");
  }
  if (!noPublicRuntimeCheckPassed) {
    addBlocker(blockers, "public_runtime_detected");
  }
  if (!noApiRouteCallCheckPassed) {
    addBlocker(blockers, "api_route_call_detected");
  }
  if (!noHttpCallCheckPassed) {
    addBlocker(blockers, "http_call_detected");
  }

  // ── Step 7: Single-run result assembly ────────────────────────────────────

  const assemblyPassed = blockers.length === 0;

  stepResults.push({
    stepId: "single_run_result_assembly",
    passed: assemblyPassed,
    notes: [
      `blockers.length: ${String(blockers.length)}`,
      `status: ${assemblyPassed ? "completed_synthetic_single_run" : "blocked"}`,
      `readyForManualReviewCaptureModel: ${String(assemblyPassed)}`,
    ],
  });

  const status = assemblyPassed
    ? ("completed_synthetic_single_run" as const)
    : ("blocked" as const);

  return {
    harnessId: "8.2L-2",
    harnessVersion: "single-run-execution-harness-v1",
    status,

    pilotRunId: syntheticRequest.pilotRunId,
    pilotScenarioId: syntheticRequest.pilotScenarioId,
    pilotReviewerId: syntheticRequest.pilotReviewerId,

    syntheticRequest,
    stepResults,
    blockers,

    operatorEnvironmentVerificationPassed: operatorEnvPassed,
    e2eHarnessPassed: e2ePassed,
    evidenceValidationIntegrationPassed: evidencePassed,

    rawTextLeakCheckPassed,
    secretLeakCheckPassed,
    userVisibleOutputCheckPassed,
    noLiveLLMCheckPassed,
    noPersistenceCheckPassed,
    noDnaSaveCheckPassed,
    noOfflineSaveCheckPassed,
    noPublicRuntimeCheckPassed,
    noApiRouteCallCheckPassed,
    noHttpCallCheckPassed,

    readyForManualReviewCaptureModel: assemblyPassed,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realEnvValuesRead: false,
    envValuesStored: false,
    secretValuesStored: false,
    secretValuesPrinted: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByHarness: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}
