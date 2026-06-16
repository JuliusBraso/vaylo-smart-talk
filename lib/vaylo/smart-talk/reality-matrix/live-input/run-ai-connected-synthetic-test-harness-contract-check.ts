/**
 * AI-Connected Synthetic Test Harness Contract Check (Phase 8.3G).
 *
 * Validates the AI-Connected Synthetic Test Harness Contract input and produces
 * an `AiConnectedSyntheticTestHarnessContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runUserVisibleOutputAuthorizationContractCheck() (8.3F) and verify
 *      all prerequisite invariants.
 *   2. Build a synthetic safe harness contract input and validate it (must be
 *      accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * ISOLATION NOTE:
 *   This module does NOT import, call, or wrap:
 *   - lib/vaylo/smart-talk/run-smart-talk.ts
 *   - lib/vaylo/smart-talk/extract-text-from-image.ts
 *   - app/api/smart-talk/route.ts
 *   - fetch() / any HTTP client
 *   - any live LLM SDK (OpenAI, Anthropic, Gemini, etc.)
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output or store model output
 * - emit user-visible output
 * - execute the synthetic test harness
 * - authorize public runtime, live LLM runtime, persistence, global output,
 *   Branch C, run-smart-talk.ts, or OCR runtime
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runAiConnectedSyntheticTestHarnessContractCheck()` explicitly.
 */

import { runUserVisibleOutputAuthorizationContractCheck } from "./run-user-visible-output-authorization-contract-check";
import {
  BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES,
  FORBIDDEN_AI_CONNECTED_SYNTHETIC_HARNESS_STRINGS,
  REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES,
  REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES,
  REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST,
  REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS,
  REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES,
  REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES,
} from "./ai-connected-synthetic-test-harness-contract-types";
import type {
  AiConnectedSyntheticTestHarnessContractCheckResult,
  AiConnectedSyntheticTestHarnessContractInput,
  AiConnectedSyntheticTestHarnessContractResult,
  AiConnectedSyntheticTestHarnessRejectionReason,
  SyntheticHarnessBlockedInputClass,
  SyntheticHarnessChecklistItem,
  SyntheticHarnessInputClass,
  SyntheticHarnessPrecondition,
  SyntheticHarnessScope,
} from "./ai-connected-synthetic-test-harness-contract-types";

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
const UNSAFE_CERTAINTY_PHRASES = [
  "Sie müssen",
  "garantiert",
  "fristlos sicher",
  "rechtlich sicher",
];
const UNSAFE_GLOBAL_AUTH_PHRASES = [
  "public launch enabled",
  "all outputs authorized",
  "global approval",
  "branch c authorized",
  "approved for user display",
  "auto-approved",
  "show to user now",
];
const UNSAFE_REAL_INPUT_PHRASES = [
  "real user document",
  "real OCR text",
  "production runtime enabled",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_AI_CONNECTED_SYNTHETIC_HARNESS_STRINGS.some((f) =>
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

function containsUnsafeCertaintyPhrase(value: string): boolean {
  return UNSAFE_CERTAINTY_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeGlobalAuthPhrase(value: string): boolean {
  return UNSAFE_GLOBAL_AUTH_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeRealInputPhrase(value: string): boolean {
  return UNSAFE_REAL_INPUT_PHRASES.some((p) => value.includes(p));
}

function containsSecretLike(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    value.includes("sk-") ||
    value.includes("apiKey") ||
    value.includes("internalSecret") ||
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.includes("password")
  );
}

function containsEnvAssignmentLike(value: string): boolean {
  return (
    value.includes("process.env") ||
    value.includes("OPENAI_API_KEY=") ||
    value.includes("VAYLO_INTERNAL_RUNTIME_SECRET=")
  );
}

function containsRawTextMarker(value: string): boolean {
  return value.includes("rawInputText") || value.includes("fullDraftText");
}

function containsRedactedTextMarker(value: string): boolean {
  return value.includes("redactedText");
}

function containsModelOutputMarker(value: string): boolean {
  return value.includes("modelOutput");
}

function addReason(
  list: AiConnectedSyntheticTestHarnessRejectionReason[],
  reason: AiConnectedSyntheticTestHarnessRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `AiConnectedSyntheticTestHarnessContractInput` for
 * use in the harness check. No harness is executed. No LLM is called. No
 * existing runtime path is touched. No real input is processed.
 */
export function buildSyntheticAiConnectedSyntheticTestHarnessContractInput(): AiConnectedSyntheticTestHarnessContractInput {
  const ackStatements =
    REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_ACKNOWLEDGMENT_STATEMENTS.join(
      " ",
    );

  return {
    contractId: "ai-connected-synthetic-test-harness-contract-8-3g",
    epochId: "8.3G",
    previousPhaseId: "8.3F",

    userVisibleOutputAuthorizationReady: true,

    scopes: [...REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES],
    syntheticInputClasses: [...REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES],
    blockedInputClasses: [...BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES],
    preconditions: [...REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS],
    adapterPolicies: [...REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES],
    expectedOutcomes: [...REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES],
    checklistConfirmed: [...REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST],

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    dedicatedSyntheticAdapterRequired: true,
    futureExecutionPlanRequired: true,
    adapterExecutionPerformedNow: false,

    branchCAuthorized: false,
    runSmartTalkAuthorized: false,
    ocrRuntimeAuthorized: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCallPerformed: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByContract: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorSyntheticHarnessAcknowledgment: ackStatements,
    reviewerSyntheticHarnessAcknowledgment: ackStatements,
    notes: [
      "synthetic safe ai-connected synthetic test harness contract without harness execution",
    ],

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

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `AiConnectedSyntheticTestHarnessContractInput` and returns a
 * typed `AiConnectedSyntheticTestHarnessContractResult`.
 */
export function validateAiConnectedSyntheticTestHarnessContractInput(
  input: AiConnectedSyntheticTestHarnessContractInput,
): AiConnectedSyntheticTestHarnessContractResult {
  const reasons: AiConnectedSyntheticTestHarnessRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: userVisibleOutputAuthorizationReady ───────────────────────────
  if (!input.userVisibleOutputAuthorizationReady) {
    addReason(reasons, "user_visible_authorization_contract_not_ready");
  }

  // ── Rule 2: scopes ────────────────────────────────────────────────────────
  for (const scope of REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES) {
    if (!input.scopes.includes(scope)) {
      addReason(reasons, "missing_scope");
      break;
    }
  }

  // ── Rule 3: synthetic input classes ───────────────────────────────────────
  for (const cls of REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES) {
    if (!input.syntheticInputClasses.includes(cls)) {
      addReason(reasons, "missing_synthetic_input_class");
      break;
    }
  }

  // ── Rule 4: blocked input classes ─────────────────────────────────────────
  for (const cls of BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES) {
    if (!input.blockedInputClasses.includes(cls)) {
      addReason(reasons, "missing_blocked_input_class");
      break;
    }
  }

  // ── Rule 5: preconditions ─────────────────────────────────────────────────
  for (const pre of REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS) {
    if (!input.preconditions.includes(pre)) {
      addReason(reasons, "missing_precondition");
      break;
    }
  }

  // ── Rule 6: adapter policies ──────────────────────────────────────────────
  for (const pol of REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES) {
    if (!input.adapterPolicies.includes(pol)) {
      addReason(reasons, "missing_adapter_policy");
      break;
    }
  }

  // ── Rule 7: expected outcomes ─────────────────────────────────────────────
  for (const out of REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES) {
    if (!input.expectedOutcomes.includes(out)) {
      addReason(reasons, "missing_expected_outcome");
      break;
    }
  }

  // ── Rule 8: checklist ─────────────────────────────────────────────────────
  for (const item of REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 9: syntheticInputOnly ────────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "missing_scope");
  }

  // ── Rule 10: real/raw/ocr/file/public input blocked ───────────────────────
  if (inputRec["realUserInputAllowed"] === true) {
    addReason(reasons, "real_input_allowed_detected");
  }
  if (inputRec["rawInputAllowed"] === true) {
    addReason(reasons, "raw_input_allowed_detected");
  }
  if (inputRec["realRedactedInputAllowed"] === true) {
    addReason(reasons, "real_redacted_input_allowed_detected");
  }
  if (inputRec["photoOrOcrInputAllowed"] === true) {
    addReason(reasons, "photo_or_ocr_input_allowed_detected");
  }
  if (inputRec["fileUploadInputAllowed"] === true) {
    addReason(reasons, "file_upload_input_allowed_detected");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "public_input_allowed_detected");
  }

  // ── Rule 11: adapter/execution plan flags ─────────────────────────────────
  if (inputRec["dedicatedSyntheticAdapterRequired"] !== true) {
    addReason(reasons, "unsafe_adapter_authorization_detected");
  }
  if (inputRec["futureExecutionPlanRequired"] !== true) {
    addReason(reasons, "missing_future_execution_plan_requirement");
  }
  if (inputRec["adapterExecutionPerformedNow"] === true) {
    addReason(reasons, "unsafe_adapter_authorization_detected");
  }

  // ── Rule 12: adapter authorization blocks ─────────────────────────────────
  if (inputRec["branchCAuthorized"] === true) {
    addReason(reasons, "unsafe_adapter_authorization_detected");
  }
  if (inputRec["runSmartTalkAuthorized"] === true) {
    addReason(reasons, "unsafe_adapter_authorization_detected");
  }
  if (inputRec["ocrRuntimeAuthorized"] === true) {
    addReason(reasons, "unsafe_adapter_authorization_detected");
  }

  // ── Rule 13: call flags ───────────────────────────────────────────────────
  if (inputRec["branchCCalled"] === true) {
    addReason(reasons, "branch_c_call_claim_detected");
  }
  if (inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "run_smart_talk_call_claim_detected");
  }
  if (inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "ocr_runtime_call_claim_detected");
  }

  // ── Rule 14: LLM / AI-output / model flags ────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_claim_detected");
  }
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }

  // ── Rule 15: user-visible output flags ────────────────────────────────────
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByContract"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rule 16: persistence flags ────────────────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "persistence_claim_detected");
  }

  // ── Rule 17: public runtime / pilot flags ─────────────────────────────────
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "real_operator_pilot_claim_detected");
  }

  // ── Rule 17b: contains* real-input flag ───────────────────────────────────
  if (inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "real_input_allowed_detected");
  }

  // ── Rule 18: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorSyntheticHarnessAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerSyntheticHarnessAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 18b: contains* content flags ────────────────────────────────────
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
    inputRec["containsFullDraftText"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsRedactedText"] === true) {
    addReason(reasons, "forbidden_redacted_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 19–21: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorSyntheticHarnessAcknowledgment,
    input.reviewerSyntheticHarnessAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
      const hasUncategorised =
        FORBIDDEN_AI_CONNECTED_SYNTHETIC_HARNESS_STRINGS.some(
          (f) =>
            s.includes(f) &&
            !containsSecretLike(s) &&
            !containsEnvAssignmentLike(s) &&
            !containsRawTextMarker(s) &&
            !containsRedactedTextMarker(s) &&
            !containsModelOutputMarker(s) &&
            !containsUnsafeCertaintyPhrase(s) &&
            !containsUnsafeGlobalAuthPhrase(s) &&
            !containsUnsafeRealInputPhrase(s) &&
            !containsUnsafeMarker(s),
        );
      if (hasUncategorised) addReason(reasons, "unsafe_synthetic_harness_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_synthetic_harness_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3G",
    status,
    accepted,
    rejectionReasons: reasons,

    safeSyntheticHarnessMetadata: {
      scopeCount: input.scopes.length,
      syntheticInputClassCount: input.syntheticInputClasses.length,
      blockedInputClassCount: input.blockedInputClasses.length,
      preconditionCount: input.preconditions.length,
      adapterPolicyCount: input.adapterPolicies.length,
      expectedOutcomeCount: input.expectedOutcomes.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForAiConnectedSyntheticTestHarnessExecutionPlan: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    adapterExecutionPerformedNow: false,
    branchCAuthorized: false,
    runSmartTalkAuthorized: false,
    ocrRuntimeAuthorized: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCalled: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByContract: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedBySyntheticHarnessContract: false,
    existingRuntimeModifiedBySyntheticHarnessContract: false,
    uiTouched: false,
    databaseOrStorageModifiedBySyntheticHarnessContract: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the AI-Connected Synthetic Test Harness Contract check for Phase 8.3G.
 *
 * Calls `runUserVisibleOutputAuthorizationContractCheck()` (8.3F), validates a
 * synthetic safe harness input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT generate AI output.
 * Does NOT emit user-visible output. Does NOT execute the harness.
 * Does NOT modify DB/storage.
 */
export function runAiConnectedSyntheticTestHarnessContractCheck(): AiConnectedSyntheticTestHarnessContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3F user-visible authorization contract ──────────────

  const uvAuthResult = runUserVisibleOutputAuthorizationContractCheck();
  const uvRec = asRec(uvAuthResult);

  const userVisibleOutputAuthorizationReady =
    uvAuthResult.allPassed === true &&
    uvRec["readyForAiConnectedSyntheticTestHarnessContract"] === true &&
    uvRec["readyForLiveLLMRuntime"] !== true &&
    uvRec["readyForConnectedAiRuntimeExecution"] !== true &&
    uvRec["readyForRealOperatorPilotRun"] !== true &&
    uvRec["readyForPilotRunNow"] !== true &&
    uvRec["readyForPublicLaunch"] !== true &&
    uvRec["readyForPersistence"] !== true &&
    uvRec["userVisibleOutputAuthorizedByContract"] !== true &&
    uvRec["emittedToUserNow"] !== true &&
    uvRec["aiOutputGenerated"] !== true &&
    uvRec["modelOutputStored"] !== true &&
    uvRec["persistenceUsed"] !== true &&
    uvRec["liveLLMCalled"] !== true &&
    uvRec["realInputProcessed"] !== true &&
    uvRec["rawInputForwarded"] !== true &&
    uvRec["redactedInputForwardingExecuted"] !== true &&
    uvRec["globalAuthorizationAllowed"] !== true &&
    uvRec["publicRuntimeAuthorizationAllowed"] !== true &&
    uvRec["liveLlmRuntimeAuthorizationAllowed"] !== true &&
    uvRec["persistenceAuthorizationAllowed"] !== true &&
    uvRec["branchCAuthorizationAllowed"] !== true &&
    uvRec["runSmartTalkCalledOrImported"] !== true &&
    uvRec["publicBranchCCalled"] !== true &&
    uvRec["extractTextFromImageCalledOrImported"] !== true &&
    uvRec["publicRuntimeEnabled"] !== true &&
    uvRec["neverUserVisible"] === true;

  notes.push(
    `userVisibleOutputAuthorizationReady: ${String(userVisibleOutputAuthorizationReady)}`,
  );
  notes.push(
    `uvAuthResult.allPassed: ${String(uvAuthResult.allPassed)}`,
  );
  notes.push(
    `readyForAiConnectedSyntheticTestHarnessContract: ${String(uvRec["readyForAiConnectedSyntheticTestHarnessContract"])}`,
  );

  // ── Step 2: Validate the synthetic harness contract input ─────────────────

  const syntheticInput =
    buildSyntheticAiConnectedSyntheticTestHarnessContractInput();
  const syntheticResult =
    validateAiConnectedSyntheticTestHarnessContractInput(syntheticInput);
  const syntheticAiConnectedHarnessContractAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticAiConnectedHarnessContractAccepted: ${String(syntheticAiConnectedHarnessContractAccepted)}`,
  );
  if (!syntheticAiConnectedHarnessContractAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof AiConnectedSyntheticTestHarnessContractInput]: AiConnectedSyntheticTestHarnessContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AiConnectedSyntheticTestHarnessContractResult {
    return validateAiConnectedSyntheticTestHarnessContractInput({
      ...syntheticInput,
      ...overrides,
    } as AiConnectedSyntheticTestHarnessContractInput);
  }

  const partialScopes =
    REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_SCOPES.length - 1,
    ) as unknown as SyntheticHarnessScope[];
  const partialSyntheticClasses =
    REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES.length - 1,
    ) as unknown as SyntheticHarnessInputClass[];
  const partialBlockedClasses =
    BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES.slice(
      0,
      BLOCKED_AI_CONNECTED_SYNTHETIC_INPUT_CLASSES.length - 1,
    ) as unknown as SyntheticHarnessBlockedInputClass[];
  const partialPreconditions =
    REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_PRECONDITIONS.length - 1,
    ) as unknown as SyntheticHarnessPrecondition[];
  const partialPolicies =
    REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_ADAPTER_POLICIES.length - 1,
    );
  const partialOutcomes =
    REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_EXPECTED_OUTCOMES.length - 1,
    );
  const partialChecklist =
    REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST.slice(
      0,
      REQUIRED_AI_CONNECTED_SYNTHETIC_HARNESS_CHECKLIST.length - 1,
    ) as unknown as SyntheticHarnessChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: AiConnectedSyntheticTestHarnessContractResult;
  }> = [
    // 1. userVisibleOutputAuthorizationReady false
    { label: "userVisibleOutputAuthorizationReady=false", result: tamper({ userVisibleOutputAuthorizationReady: false }) },
    // 2. missing scope
    { label: "missing scope", result: tamper({ scopes: partialScopes }) },
    // 3. missing synthetic input class
    { label: "missing synthetic input class", result: tamper({ syntheticInputClasses: partialSyntheticClasses }) },
    // 4. missing blocked input class
    { label: "missing blocked input class", result: tamper({ blockedInputClasses: partialBlockedClasses }) },
    // 5. missing precondition
    { label: "missing precondition", result: tamper({ preconditions: partialPreconditions }) },
    // 6. missing adapter policy
    { label: "missing adapter policy", result: tamper({ adapterPolicies: partialPolicies }) },
    // 7. missing expected outcome
    { label: "missing expected outcome", result: tamper({ expectedOutcomes: partialOutcomes }) },
    // 8. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 9. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, syntheticInputOnly: false as unknown as true }) },
    // 10. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, realUserInputAllowed: true as unknown as false }) },
    // 11. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, rawInputAllowed: true as unknown as false }) },
    // 12. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, realRedactedInputAllowed: true as unknown as false }) },
    // 13. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 14. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, fileUploadInputAllowed: true as unknown as false }) },
    // 15. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 16. dedicatedSyntheticAdapterRequired false
    { label: "dedicatedSyntheticAdapterRequired=false", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, dedicatedSyntheticAdapterRequired: false as unknown as true }) },
    // 17. futureExecutionPlanRequired false
    { label: "futureExecutionPlanRequired=false", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, futureExecutionPlanRequired: false as unknown as true }) },
    // 18. adapterExecutionPerformedNow true
    { label: "adapterExecutionPerformedNow=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, adapterExecutionPerformedNow: true as unknown as false }) },
    // 19. branchCAuthorized true
    { label: "branchCAuthorized=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, branchCAuthorized: true as unknown as false }) },
    // 20. runSmartTalkAuthorized true
    { label: "runSmartTalkAuthorized=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, runSmartTalkAuthorized: true as unknown as false }) },
    // 21. ocrRuntimeAuthorized true
    { label: "ocrRuntimeAuthorized=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, ocrRuntimeAuthorized: true as unknown as false }) },
    // 22. branchCCalled true
    { label: "branchCCalled=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, branchCCalled: true as unknown as false }) },
    // 23. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 24. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 25. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 26. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 27. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 28. modelOutputStored true
    { label: "modelOutputStored=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 29. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 30. userVisibleOutputAuthorizedByContract true
    { label: "userVisibleOutputAuthorizedByContract=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, userVisibleOutputAuthorizedByContract: true as unknown as false }) },
    // 31. persistenceUsed true
    { label: "persistenceUsed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 32. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 33. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 34. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 35. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 36. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorSyntheticHarnessAcknowledgment: "partial only" }) },
    // 37. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerSyntheticHarnessAcknowledgment: "partial only" }) },
    // 38. containsSecret true
    { label: "containsSecret=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 39. containsEnvValue true
    { label: "containsEnvValue=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 40. containsApiKey true
    { label: "containsApiKey=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 41. containsRawInputText true
    { label: "containsRawInputText=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 42. containsRedactedText true
    { label: "containsRedactedText=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 43. containsModelOutput true
    { label: "containsModelOutput=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 44. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 45. containsUserPii true
    { label: "containsUserPii=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 46. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateAiConnectedSyntheticTestHarnessContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 47. notes: "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 48. notes: "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 49. notes: "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 50. notes: "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 51. notes: "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 52. notes: "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 53. notes: email
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 54. notes: phone
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 55. notes: "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 56. notes: "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 57. notes: "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 58. notes: "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 59. notes: "public launch enabled"
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    // 60. notes: "all outputs authorized"
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    // 61. notes: "global approval"
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    // 62. notes: "branch c authorized"
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    // 63. notes: "real user document"
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document found"] }) },
    // 64. notes: "real OCR text"
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text present"] }) },
    // 65. notes: "production runtime enabled"
    { label: 'notes: "production runtime enabled"', result: tamper({ notes: ["production runtime enabled"] }) },
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
    userVisibleOutputAuthorizationReady &&
    syntheticAiConnectedHarnessContractAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3G",
    allPassed,
    userVisibleOutputAuthorizationReady,
    syntheticAiConnectedHarnessContractAccepted,
    tamperCasesRejected,

    readyForAiConnectedSyntheticTestHarnessExecutionPlan: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    adapterExecutionPerformedNow: false,
    branchCAuthorized: false,
    runSmartTalkAuthorized: false,
    ocrRuntimeAuthorized: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,
    neverUserVisible: true,

    notes,
  };
}
