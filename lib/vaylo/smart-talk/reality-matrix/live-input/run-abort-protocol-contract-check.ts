/**
 * Abort Protocol Contract Check (Phase 8.2M-3).
 *
 * Validates typed abort protocol contract inputs and produces an
 * `AbortProtocolContractCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-2 real environment attestation contract is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - read process.env
 * - execute a real abort
 * - modify a kill switch or runtime abort hook
 * - authorize or execute a real pilot run
 * - persist abort records
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runAbortProtocolContractCheck()` explicitly.
 */

import { runRealEnvironmentAttestationContractCheck } from "./run-real-environment-attestation-contract-check";
import {
  FORBIDDEN_ABORT_PROTOCOL_STRINGS,
  REQUIRED_ABORT_PROTOCOL_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_ABORT_PROTOCOL_CHECKLIST,
  REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS,
  REQUIRED_ABORT_PROTOCOL_TRIGGERS,
} from "./abort-protocol-contract-types";
import type {
  AbortMonitoringMode,
  AbortProtocolChecklistItem,
  AbortProtocolContractCheckResult,
  AbortProtocolContractInput,
  AbortProtocolContractResult,
  AbortProtocolRejectionReason,
  AbortProtocolStopAction,
  AbortProtocolTrigger,
} from "./abort-protocol-contract-types";

// ── Helpers ─────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_MONITORING_MODES: readonly AbortMonitoringMode[] = [
  "manual_operator_monitoring",
  "manual_operator_and_reviewer_monitoring",
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SECRET_LIKE_PATTERNS = ["secret", "token", "password"];

const AUTHORITY_DOCUMENT_MARKERS = [
  "Sehr geehrter",
  "Aktenzeichen",
  "IBAN",
  "Steuer-ID",
  "BG-Nr",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_ABORT_PROTOCOL_STRINGS.some((f) => value.includes(f));
}

function containsSecretLike(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    value.includes("sk-") ||
    value.includes("apiKey") ||
    value.includes("internalSecret") ||
    SECRET_LIKE_PATTERNS.some((p) => lower.includes(p))
  );
}

function containsEnvAssignmentLike(value: string): boolean {
  return value.includes("process.env") || value.includes("OPENAI_API_KEY=") || value.includes("VAYLO_INTERNAL_RUNTIME_SECRET=");
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsDocumentMarker(value: string): boolean {
  return AUTHORITY_DOCUMENT_MARKERS.some((m) => value.includes(m));
}

function containsRawTextMarker(value: string): boolean {
  return (
    value.includes("rawInputText") ||
    value.includes("redactedText") ||
    value.includes("fullDraftText") ||
    value.includes("SYNTHETIC_TEXT_NEVER_REAL_USER_DATA")
  );
}

function containsModelOutputMarker(value: string): boolean {
  return value.includes("modelOutput");
}

function addReason(
  list: AbortProtocolRejectionReason[],
  reason: AbortProtocolRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ─────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `AbortProtocolContractInput` for use in the
 * harness check. Contains no real abort execution, no env values, no secrets,
 * and no sensitive content.
 */
export function buildSyntheticAbortProtocolContractInput(): AbortProtocolContractInput {
  const acknowledgmentStatements =
    REQUIRED_ABORT_PROTOCOL_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "abort-protocol-contract-8-2m-3",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",

    environmentAttestationReady: true,
    operatorHumanId: "operator-internal-001",
    reviewerHumanId: "reviewer-internal-001",

    abortMonitoringMode: "manual_operator_and_reviewer_monitoring",
    requiredAbortTriggers: [...REQUIRED_ABORT_PROTOCOL_TRIGGERS],
    requiredStopActions: [...REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS],
    checklistConfirmed: [...REQUIRED_ABORT_PROTOCOL_CHECKLIST],

    operatorAbortAcknowledgment: acknowledgmentStatements,
    reviewerAbortAcknowledgment: acknowledgmentStatements,
    rollbackOrStopConfirmation:
      "I confirm rollback or stop confirmation is required before any future pilot can continue.",
    notes: ["synthetic safe abort protocol attestation without runtime execution"],

    realAbortExecuted: false,
    killSwitchModifiedByContract: false,
    runtimeAbortHookModifiedByContract: false,

    containsRealUserInput: false,
    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsModelOutput: false,
    containsSecret: false,
    containsEnvValue: false,
    containsApiKey: false,
    containsUserPii: false,
    containsDocumentContent: false,

    persistenceUsed: false,
    publicRuntimeEnabled: false,
    liveLLMCalled: false,
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,

    neverUserVisible: true,
  };
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates an `AbortProtocolContractInput` and returns a typed
 * `AbortProtocolContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateAbortProtocolContractInput(
  input: AbortProtocolContractInput,
): AbortProtocolContractResult {
  const reasons: AbortProtocolRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: environmentAttestationReady must be true ─────────────────────
  if (!input.environmentAttestationReady) {
    addReason(reasons, "environment_attestation_not_ready");
  }

  // ── Rule 2: non-empty pilotSessionId ─────────────────────────────────────
  if (!input.pilotSessionId || input.pilotSessionId.trim() === "") {
    addReason(reasons, "missing_pilot_session_id");
  }

  // ── Rule 3: non-empty operatorHumanId ────────────────────────────────────
  if (!input.operatorHumanId || input.operatorHumanId.trim() === "") {
    addReason(reasons, "missing_operator_identity_reference");
  }

  // ── Rule 4: non-empty reviewerHumanId ────────────────────────────────────
  if (!input.reviewerHumanId || input.reviewerHumanId.trim() === "") {
    addReason(reasons, "missing_reviewer_identity_reference");
  }

  // ── Rule 5: valid monitoring mode ────────────────────────────────────────
  if (!VALID_MONITORING_MODES.includes(input.abortMonitoringMode)) {
    addReason(reasons, "invalid_abort_monitoring_mode");
  }

  // ── Rule 6: all required abort triggers present ──────────────────────────
  for (const trigger of REQUIRED_ABORT_PROTOCOL_TRIGGERS) {
    if (!input.requiredAbortTriggers.includes(trigger)) {
      addReason(reasons, "missing_abort_trigger");
      break;
    }
  }

  // ── Rule 7: all required stop actions present ────────────────────────────
  for (const action of REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS) {
    if (!input.requiredStopActions.includes(action)) {
      addReason(reasons, "missing_stop_action");
      break;
    }
  }

  // ── Rule 8: all required checklist items confirmed ───────────────────────
  for (const item of REQUIRED_ABORT_PROTOCOL_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 9: operator acknowledgment includes all required statements ──────
  for (const stmt of REQUIRED_ABORT_PROTOCOL_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorAbortAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_operator_acknowledgment");
      break;
    }
  }

  // ── Rule 10: reviewer acknowledgment includes all required statements ─────
  for (const stmt of REQUIRED_ABORT_PROTOCOL_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerAbortAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_reviewer_acknowledgment");
      break;
    }
  }

  // ── Rule 11: rollback/stop confirmation non-empty and mentions rollback/stop
  if (
    !input.rollbackOrStopConfirmation ||
    input.rollbackOrStopConfirmation.trim() === "" ||
    (!input.rollbackOrStopConfirmation.toLowerCase().includes("rollback") &&
      !input.rollbackOrStopConfirmation.toLowerCase().includes("stop"))
  ) {
    addReason(reasons, "missing_rollback_or_stop_confirmation");
  }

  // ── Rule 12: abort execution / kill switch / runtime hook flags ───────────
  if (
    inputRec["realAbortExecuted"] === true ||
    inputRec["killSwitchModifiedByContract"] === true ||
    inputRec["runtimeAbortHookModifiedByContract"] === true
  ) {
    addReason(reasons, "real_abort_execution_detected");
  }

  // ── Rule 13: contains* content flags ─────────────────────────────────────
  if (inputRec["containsSecret"] === true) {
    addReason(reasons, "forbidden_secret_detected");
  }
  if (inputRec["containsEnvValue"] === true) {
    addReason(reasons, "forbidden_env_value_detected");
  }
  if (inputRec["containsApiKey"] === true) {
    addReason(reasons, "forbidden_api_key_detected");
  }
  if (inputRec["containsUserPii"] === true) {
    addReason(reasons, "forbidden_pii_detected");
  }
  if (
    inputRec["containsRawInputText"] === true ||
    inputRec["containsRedactedText"] === true ||
    inputRec["containsFullDraftText"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }
  if (inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "real_user_input_detected");
  }

  // ── Rule 14: runtime safety flags ────────────────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["liveLLMCalled"] === true) {
    addReason(reasons, "live_llm_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }
  if (
    inputRec["emittedToUserNow"] === true ||
    inputRec["userVisibleOutputAllowed"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rules 15-18: scan string fields for forbidden content ─────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.pilotSessionId,
    input.operatorHumanId,
    input.reviewerHumanId,
    input.operatorAbortAcknowledgment,
    input.reviewerAbortAcknowledgment,
    input.rollbackOrStopConfirmation,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) {
        addReason(reasons, "forbidden_secret_detected");
      }
      if (containsEnvAssignmentLike(s)) {
        addReason(reasons, "forbidden_env_value_detected");
      }
      if (containsRawTextMarker(s)) {
        addReason(reasons, "forbidden_raw_text_detected");
      }
      if (containsModelOutputMarker(s)) {
        addReason(reasons, "forbidden_model_output_detected");
      }
      if (containsDocumentMarker(s)) {
        addReason(reasons, "forbidden_document_content_detected");
      }
      // Catch-all for any forbidden string not categorised above
      const anyUncategorised = FORBIDDEN_ABORT_PROTOCOL_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsDocumentMarker(s),
      );
      if (anyUncategorised) {
        addReason(reasons, "unsafe_abort_note_detected");
      }
    }

    if (containsPiiPattern(s)) {
      addReason(reasons, "forbidden_pii_detected");
    }

    if (containsDocumentMarker(s) && !reasons.includes("forbidden_document_content_detected")) {
      addReason(reasons, "forbidden_document_content_detected");
    }

    // Detect env-assignment-like patterns and authority markers not caught above
    if (containsEnvAssignmentLike(s) && !reasons.includes("forbidden_env_value_detected")) {
      addReason(reasons, "forbidden_env_value_detected");
    }
    if (containsSecretLike(s) && !reasons.includes("forbidden_secret_detected")) {
      addReason(reasons, "forbidden_secret_detected");
    }
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    status,
    accepted,
    rejectionReasons: reasons,

    safeAbortProtocolMetadata: {
      pilotSessionId: input.pilotSessionId,
      operatorHumanId: input.operatorHumanId,
      reviewerHumanId: input.reviewerHumanId,
      abortMonitoringMode: input.abortMonitoringMode,
      requiredAbortTriggersCount: input.requiredAbortTriggers.length,
      requiredStopActionsCount: input.requiredStopActions.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForRealInputPolicy: accepted,
    readyForEvidencePolicy: accepted,
    readyForPostRunAuditPlanning: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realAbortExecuted: false,
    realUserInputProcessed: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    envValueStored: false,
    secretStored: false,
    apiKeyStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByAbortProtocol: false,
    killSwitchModifiedByContract: false,
    runtimeAbortHookModifiedByContract: false,
    uiTouched: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Contract check ───────────────────────────────────────────────────────────

/**
 * Runs the full Abort Protocol Contract check for Phase 8.2M-3.
 *
 * Calls `runRealEnvironmentAttestationContractCheck()` (8.2M-2), validates a
 * synthetic safe abort protocol input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT execute a real abort. Does NOT modify a kill switch or runtime hook.
 */
export function runAbortProtocolContractCheck(): AbortProtocolContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-2 environment attestation contract ───────────

  const envCheck = runRealEnvironmentAttestationContractCheck();
  const envRec = asRec(envCheck);

  const environmentAttestationReady =
    envCheck.allPassed === true &&
    envRec["readyForAbortProtocol"] === true &&
    envRec["readyForRealOperatorPilotRun"] !== true &&
    envRec["readyForPilotRunNow"] !== true &&
    envRec["readyForPublicLaunch"] !== true &&
    envRec["readyForLiveLLMRuntime"] !== true &&
    envRec["readyForPersistence"] !== true &&
    envRec["realPilotRunExecuted"] !== true &&
    envRec["realUserInputProcessed"] !== true &&
    envRec["envValuesReadByCode"] !== true &&
    envRec["envValuesPrinted"] !== true &&
    envRec["envValuesStored"] !== true &&
    envRec["secretValuesPrinted"] !== true &&
    envRec["secretValuesStored"] !== true &&
    envRec["liveLLMCalled"] !== true &&
    envRec["persistenceUsed"] !== true &&
    envRec["emittedToUserNow"] !== true &&
    envRec["neverUserVisible"] === true;

  notes.push(`environmentAttestationReady: ${String(environmentAttestationReady)}`);
  notes.push(`envCheck.allPassed: ${String(envCheck.allPassed)}`);
  notes.push(`envCheck.readyForAbortProtocol: ${String(envRec["readyForAbortProtocol"])}`);

  // ── Step 2: Validate the synthetic safe abort protocol input ──────────────

  const syntheticInput = buildSyntheticAbortProtocolContractInput();
  const syntheticResult = validateAbortProtocolContractInput(syntheticInput);
  const syntheticAbortProtocolAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticAbortProtocolAccepted: ${String(syntheticAbortProtocolAccepted)}`,
  );
  if (!syntheticAbortProtocolAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof AbortProtocolContractInput]: AbortProtocolContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AbortProtocolContractResult {
    return validateAbortProtocolContractInput({
      ...syntheticInput,
      ...overrides,
    } as AbortProtocolContractInput);
  }

  const partialTriggers = REQUIRED_ABORT_PROTOCOL_TRIGGERS.slice(
    0,
    REQUIRED_ABORT_PROTOCOL_TRIGGERS.length - 1,
  ) as unknown as AbortProtocolTrigger[];

  const partialStopActions = REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS.slice(
    0,
    REQUIRED_ABORT_PROTOCOL_STOP_ACTIONS.length - 1,
  ) as unknown as AbortProtocolStopAction[];

  const partialChecklist = REQUIRED_ABORT_PROTOCOL_CHECKLIST.slice(
    0,
    REQUIRED_ABORT_PROTOCOL_CHECKLIST.length - 1,
  ) as unknown as AbortProtocolChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: AbortProtocolContractResult;
  }> = [
    // 1. environmentAttestationReady false
    {
      label: "environmentAttestationReady=false",
      result: tamper({ environmentAttestationReady: false }),
    },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operatorHumanId
    { label: "empty operatorHumanId", result: tamper({ operatorHumanId: "" }) },
    // 4. empty reviewerHumanId
    { label: "empty reviewerHumanId", result: tamper({ reviewerHumanId: "" }) },
    // 5. missing one required abort trigger
    {
      label: "missing abort trigger",
      result: tamper({ requiredAbortTriggers: partialTriggers }),
    },
    // 6. missing one required stop action
    {
      label: "missing stop action",
      result: tamper({ requiredStopActions: partialStopActions }),
    },
    // 7. missing one checklist item
    {
      label: "missing checklist item",
      result: tamper({ checklistConfirmed: partialChecklist }),
    },
    // 8. missing operator acknowledgment
    {
      label: "missing operator acknowledgment",
      result: tamper({ operatorAbortAcknowledgment: "partial acknowledgment only" }),
    },
    // 9. missing reviewer acknowledgment
    {
      label: "missing reviewer acknowledgment",
      result: tamper({ reviewerAbortAcknowledgment: "partial acknowledgment only" }),
    },
    // 10. missing rollbackOrStopConfirmation
    {
      label: "missing rollbackOrStopConfirmation",
      result: tamper({ rollbackOrStopConfirmation: "" }),
    },
    // 11. invalid abortMonitoringMode
    {
      label: "invalid abortMonitoringMode",
      result: tamper({
        abortMonitoringMode: "unknown_mode" as unknown as AbortMonitoringMode,
      }),
    },
    // 12. realAbortExecuted true
    {
      label: "realAbortExecuted=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        realAbortExecuted: true as unknown as false,
      }),
    },
    // 13. killSwitchModifiedByContract true
    {
      label: "killSwitchModifiedByContract=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        killSwitchModifiedByContract: true as unknown as false,
      }),
    },
    // 14. runtimeAbortHookModifiedByContract true
    {
      label: "runtimeAbortHookModifiedByContract=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        runtimeAbortHookModifiedByContract: true as unknown as false,
      }),
    },
    // 15. containsSecret true
    {
      label: "containsSecret=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 16. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 17. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 18. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 19. notes includes "process.env"
    {
      label: 'notes: "process.env"',
      result: tamper({ notes: ["process.env here"] }),
    },
    // 20. notes includes "OPENAI_API_KEY="
    {
      label: 'notes: "OPENAI_API_KEY="',
      result: tamper({ notes: ["OPENAI_API_KEY=abc123"] }),
    },
    // 21. notes includes "sk-"
    {
      label: 'notes: "sk-"',
      result: tamper({ notes: ["sk-supersecret"] }),
    },
    // 22. notes includes "john@example.com"
    {
      label: "notes: email",
      result: tamper({ notes: ["contact john@example.com"] }),
    },
    // 23. notes includes "+49 170 1234567"
    {
      label: "notes: phone",
      result: tamper({ notes: ["call +49 170 1234567"] }),
    },
    // 24. notes includes "Aktenzeichen"
    {
      label: 'notes: "Aktenzeichen"',
      result: tamper({ notes: ["Aktenzeichen: 123"] }),
    },
    // 25. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 26. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 27. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 28. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 29. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validateAbortProtocolContractInput({
        ...syntheticInput,
        emittedToUserNow: true as unknown as false,
      }),
    },
  ];

  let allTamperRejected = true;
  for (const tc of tamperCases) {
    if (tc.result.accepted) {
      notes.push(`TAMPER CASE NOT REJECTED: ${tc.label}`);
      allTamperRejected = false;
    }
  }
  const tamperCasesRejected = allTamperRejected;
  notes.push(
    `tamperCasesRejected: ${String(tamperCasesRejected)} (${String(tamperCases.length)} cases)`,
  );

  // ── Final result ──────────────────────────────────────────────────────────

  const allPassed =
    environmentAttestationReady &&
    syntheticAbortProtocolAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-3",
    allPassed,
    environmentAttestationReady,
    syntheticAbortProtocolAccepted,
    tamperCasesRejected,

    readyForRealInputPolicy: allPassed,
    readyForEvidencePolicy: allPassed,
    readyForPostRunAuditPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realAbortExecuted: false,
    realUserInputProcessed: false,
    killSwitchModifiedByContract: false,
    runtimeAbortHookModifiedByContract: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
