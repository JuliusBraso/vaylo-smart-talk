/**
 * Connected AI Runtime Authorization Plan Check (Phase 8.3A).
 *
 * Validates the typed Connected AI Runtime Authorization Plan input and
 * produces a `ConnectedAiRuntimeAuthorizationPlanCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-7 real operator pilot authorization closure passed.
 *   2. Build a synthetic safe plan input and validate it (must reach status
 *      `"ready_for_live_llm_boundary_contract"`).
 *   3. Return the final plan check result.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM (OpenAI, Gemini, Anthropic, or any other)
 * - authorize live LLM runtime
 * - generate AI output
 * - process actual user input or forward raw input
 * - authorize user-visible output
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow
 * - authorize public launch
 * - authorize persistence
 * - modify UI
 * - make HTTP requests
 * - auto-execute at module load time
 *
 * Invoke `runConnectedAiRuntimeAuthorizationPlanCheck()` explicitly.
 */

import { runRealOperatorPilotAuthorizationClosure } from "./run-real-operator-pilot-authorization-closure";
import {
  CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES,
  CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS,
  CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_NOTES,
  CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_PREREQUISITES,
  FORBIDDEN_CONNECTED_AI_RUNTIME_AUTHORIZATION_PLAN_STRINGS,
} from "./connected-ai-runtime-authorization-plan-types";
import type {
  ConnectedAiRuntimeAuthorizationBlocker,
  ConnectedAiRuntimeAuthorizationPlanCheckResult,
  ConnectedAiRuntimeAuthorizationPlanInput,
  ConnectedAiRuntimeAuthorizationPlanResult,
} from "./connected-ai-runtime-authorization-plan-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SENSITIVE_PERSONAL_MARKERS = [
  "Name:",
  "Adresse:",
  "Geburtsdatum:",
  "Kind:",
];

const HIGH_RISK_LEGAL_MARKERS = ["Abschiebung", "Kündigung", "Mietvertrag"];

const AUTHORITY_DOCUMENT_MARKERS = [
  "Sehr geehrter",
  "Aktenzeichen",
  "IBAN",
  "Steuer-ID",
  "BG-Nr",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_CONNECTED_AI_RUNTIME_AUTHORIZATION_PLAN_STRINGS.some((f) =>
    value.includes(f),
  );
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsUnsafeMarker(value: string): boolean {
  return (
    SENSITIVE_PERSONAL_MARKERS.some((m) => value.includes(m)) ||
    HIGH_RISK_LEGAL_MARKERS.some((m) => value.includes(m)) ||
    AUTHORITY_DOCUMENT_MARKERS.some((m) => value.includes(m))
  );
}

function addBlocker(
  list: ConnectedAiRuntimeAuthorizationBlocker[],
  blocker: ConnectedAiRuntimeAuthorizationBlocker,
): void {
  if (!list.includes(blocker)) list.push(blocker);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `ConnectedAiRuntimeAuthorizationPlanInput` for
 * use in the harness check. Contains no live LLM calls, no AI output, no
 * user content, no env values, no secrets, and no sensitive content.
 */
export function buildSyntheticConnectedAiRuntimeAuthorizationPlanInput(): ConnectedAiRuntimeAuthorizationPlanInput {
  return {
    planId: "connected-ai-runtime-authorization-plan-8-3a",
    epochId: "8.3A",
    previousEpochId: "8.2M",

    realOperatorPilotAuthorizationClosed: true,
    connectedAiPlanningAuthorized: true,

    prerequisites: [...CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_PREREQUISITES],
    openItems: [...CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS],
    nextPhases: [...CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES],

    liveLLMRuntimeAlreadyCalled: false,
    realInputAlreadyProcessed: false,
    rawInputAlreadyForwarded: false,
    aiOutputAlreadyGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    notes: [...CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_NOTES],
    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `ConnectedAiRuntimeAuthorizationPlanInput` and returns a typed
 * `ConnectedAiRuntimeAuthorizationPlanResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateConnectedAiRuntimeAuthorizationPlanInput(
  input: ConnectedAiRuntimeAuthorizationPlanInput,
): ConnectedAiRuntimeAuthorizationPlanResult {
  const blockers: ConnectedAiRuntimeAuthorizationBlocker[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: realOperatorPilotAuthorizationClosed must be true ─────────────
  if (!input.realOperatorPilotAuthorizationClosed) {
    addBlocker(blockers, "real_operator_pilot_authorization_not_closed");
  }

  // ── Rule 2: connectedAiPlanningAuthorized must be true ────────────────────
  if (!input.connectedAiPlanningAuthorized) {
    addBlocker(blockers, "connected_ai_planning_not_authorized");
  }

  // ── Rule 3: all required prerequisites present ────────────────────────────
  for (const prereq of CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_PREREQUISITES) {
    if (!input.prerequisites.includes(prereq)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
      break;
    }
  }

  // ── Rule 4: all required open items present ───────────────────────────────
  for (const item of CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS) {
    if (!input.openItems.includes(item)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
      break;
    }
  }

  // ── Rule 5: all required next phases present ──────────────────────────────
  for (const phase of CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES) {
    if (!input.nextPhases.includes(phase)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
      break;
    }
  }

  // ── Rule 6: all runtime / AI-output / content safety flags ───────────────
  if (inputRec["liveLLMRuntimeAlreadyCalled"] === true) {
    addBlocker(blockers, "live_llm_runtime_already_called");
  }
  if (inputRec["realInputAlreadyProcessed"] === true) {
    addBlocker(blockers, "real_input_already_processed");
  }
  if (inputRec["rawInputAlreadyForwarded"] === true) {
    addBlocker(blockers, "raw_input_already_forwarded");
  }
  if (inputRec["aiOutputAlreadyGenerated"] === true) {
    addBlocker(blockers, "ai_output_already_generated");
  }
  if (inputRec["modelOutputStored"] === true) {
    addBlocker(blockers, "model_output_stored");
  }
  if (inputRec["persistenceUsed"] === true) {
    addBlocker(blockers, "persistence_used");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addBlocker(blockers, "public_runtime_enabled");
  }
  if (inputRec["emittedToUserNow"] === true) {
    addBlocker(blockers, "user_visible_output_emitted");
  }

  // ── Rule 7: required notes must be present ────────────────────────────────
  for (const required of CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_NOTES) {
    const found = input.notes.some((n) => n.includes(required));
    if (!found) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
      break;
    }
  }

  // ── Rules 8–10: scan string fields for forbidden / unsafe content ─────────
  const allTextFields: string[] = [
    input.planId,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
    if (containsPiiPattern(s)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
    if (containsUnsafeMarker(s)) {
      addBlocker(blockers, "unsafe_runtime_flag_detected");
    }
  }

  // ── Structural validity ───────────────────────────────────────────────────
  const isStructurallyInvalid =
    !input.planId ||
    input.planId.trim() === "" ||
    input.epochId !== "8.3A" ||
    input.previousEpochId !== "8.2M";

  const status = isStructurallyInvalid
    ? ("invalid" as const)
    : blockers.length === 0
      ? ("ready_for_live_llm_boundary_contract" as const)
      : ("blocked" as const);

  const readyForLiveLLMBoundaryContract =
    status === "ready_for_live_llm_boundary_contract";

  const allPrerequisitesPresent =
    CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_PREREQUISITES.every((p) =>
      input.prerequisites.includes(p),
    );
  const allOpenItemsPresent =
    CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS.every((i) =>
      input.openItems.includes(i),
    );
  const allNextPhasesPresent =
    CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES.every((p) =>
      input.nextPhases.includes(p),
    );

  return {
    planId: input.planId,
    epochId: "8.3A",
    status,
    blockers,
    openItems: CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS,
    nextPhases: CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES,

    readyForLiveLLMBoundaryContract,
    readyForRedactedInputForwardingContract: false,
    readyForAiOutputGovernanceRecheckContract: false,
    readyForManualReviewBeforeUserVisibleOutputContract: false,
    readyForAiConnectedSyntheticTestHarness: false,
    readyForAiConnectedPostRunAudit: false,

    readyForLiveLLMRuntime: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByConnectedAiPlan: false,
    uiTouched: false,
    databaseOrStorageModifiedByConnectedAiPlan: false,
    neverUserVisible: true,

    safetySummary: {
      realOperatorPilotAuthorizationClosed: input.realOperatorPilotAuthorizationClosed,
      connectedAiPlanningAuthorized: input.connectedAiPlanningAuthorized,
      allPrerequisitesPresent,
      allOpenItemsPresent,
      allNextPhasesPresent,
      liveLLMRuntimeStillBlocked: inputRec["liveLLMRuntimeAlreadyCalled"] !== true,
      userVisibleOutputStillBlocked: inputRec["emittedToUserNow"] !== true,
      persistenceStillBlocked: inputRec["persistenceUsed"] !== true,
      publicRuntimeStillBlocked: inputRec["publicRuntimeEnabled"] !== true,
    },
  };
}

// ── Plan check ────────────────────────────────────────────────────────────────

/**
 * Runs the Connected AI Runtime Authorization Plan check for Phase 8.3A.
 *
 * Calls `runRealOperatorPilotAuthorizationClosure()` (8.2M-7), validates a
 * synthetic safe plan input, and returns the final plan check result.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT call any live LLM. Does NOT authorize live LLM runtime.
 * Does NOT generate AI output. Does NOT store user content.
 * Does NOT modify DB/storage.
 */
export function runConnectedAiRuntimeAuthorizationPlanCheck(): ConnectedAiRuntimeAuthorizationPlanCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.2M-7 real operator pilot authorization closure ────────

  const closureCheck = runRealOperatorPilotAuthorizationClosure();
  const crRec = asRec(closureCheck);

  const previousEpochClosureVerified =
    closureCheck.allPassed === true &&
    crRec["readyForNextEpochPlanning"] === true &&
    crRec["readyForConnectedAiRuntimeAuthorizationPlanning"] === true &&
    crRec["readyForRealOperatorPilotRuntimeExecutionPlanning"] === true &&
    crRec["readyForRealOperatorPilotRun"] !== true &&
    crRec["readyForPilotRunNow"] !== true &&
    crRec["readyForPublicLaunch"] !== true &&
    crRec["readyForLiveLLMRuntime"] !== true &&
    crRec["readyForPersistence"] !== true &&
    crRec["realPilotRunExecuted"] !== true &&
    crRec["realUserInputProcessed"] !== true &&
    crRec["rawInputForwarded"] !== true &&
    crRec["auditExecutionPerformed"] !== true &&
    crRec["auditPersistencePerformed"] !== true &&
    crRec["evidencePersistencePerformed"] !== true &&
    crRec["userContentStored"] !== true &&
    crRec["liveLLMCalled"] !== true &&
    crRec["persistenceUsed"] !== true &&
    crRec["dnaSavePerformed"] !== true &&
    crRec["offlineSavePerformed"] !== true &&
    crRec["publicRuntimeEnabled"] !== true &&
    crRec["emittedToUserNow"] !== true &&
    crRec["neverUserVisible"] === true;

  notes.push(`previousEpochClosureVerified: ${String(previousEpochClosureVerified)}`);
  notes.push(`closureCheck.allPassed: ${String(closureCheck.allPassed)}`);
  notes.push(
    `readyForConnectedAiRuntimeAuthorizationPlanning: ${String(crRec["readyForConnectedAiRuntimeAuthorizationPlanning"])}`,
  );

  // ── Step 2: Build and validate the synthetic plan input ───────────────────

  const syntheticInput = buildSyntheticConnectedAiRuntimeAuthorizationPlanInput();
  const planResult = validateConnectedAiRuntimeAuthorizationPlanInput(syntheticInput);

  notes.push(`planResult.status: ${planResult.status}`);
  notes.push(`planResult.blockers.length: ${String(planResult.blockers.length)}`);
  notes.push(`planResult.openItems.length: ${String(planResult.openItems.length)}`);
  notes.push(`planResult.nextPhases.length: ${String(planResult.nextPhases.length)}`);
  notes.push(
    `planResult.readyForLiveLLMBoundaryContract: ${String(planResult.readyForLiveLLMBoundaryContract)}`,
  );

  // ── Step 3: Determine allPassed ───────────────────────────────────────────

  const allPassed =
    previousEpochClosureVerified &&
    planResult.status === "ready_for_live_llm_boundary_contract" &&
    planResult.blockers.length === 0 &&
    planResult.readyForLiveLLMBoundaryContract === true &&
    planResult.readyForLiveLLMRuntime === false &&
    planResult.readyForRealOperatorPilotRun === false &&
    planResult.readyForPilotRunNow === false &&
    planResult.readyForPublicLaunch === false &&
    planResult.readyForPersistence === false &&
    planResult.liveLLMCalled === false &&
    planResult.aiOutputGenerated === false &&
    planResult.modelOutputStored === false &&
    planResult.neverUserVisible === true;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3A",
    allPassed,
    previousEpochClosureVerified,
    planResult,

    readyForLiveLLMBoundaryContract: allPassed,
    readyForConnectedAiRuntimeExecution: false,
    readyForLiveLLMRuntime: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    neverUserVisible: true,
    notes,
  };
}
