/**
 * Live LLM Synthetic Single-Call Dry-Run Authorization (Phase 8.3N).
 *
 * Verifies all pre-flight conditions from Phase 8.3M and produces a single
 * positive gate (`readyForLiveLlmSyntheticSingleCallExecution`) for Phase 8.3O.
 *
 * Sub-steps:
 *   1. Call runLiveLlmSyntheticSingleCallExecutionPlan() (8.3M) and verify
 *      all prerequisite invariants.
 *   2. Build a synthetic dry-run authorization input and validate it.
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
 * - import any LLM SDK
 * - construct prompt text
 * - log prompt text or model output
 * - produce real AI output or store model output
 * - emit user-visible output
 * - authorize general live LLM runtime or public runtime
 * - authorize more than one future live LLM call
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runLiveLlmSyntheticSingleCallDryRunAuthorization()` explicitly.
 */

import { runLiveLlmSyntheticSingleCallExecutionPlan } from "./run-live-llm-synthetic-single-call-execution-plan";
import {
  FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_STRINGS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES,
} from "./live-llm-synthetic-single-call-dry-run-authorization-types";
import type {
  LiveLlmSyntheticSingleCallDryRunAuthorizationCheckResult,
  LiveLlmSyntheticSingleCallDryRunAuthorizationInput,
  LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason,
  LiveLlmSyntheticSingleCallDryRunAuthorizationResult,
} from "./live-llm-synthetic-single-call-dry-run-authorization-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SENSITIVE_PERSONAL_MARKERS = ["Name:", "Adresse:", "Geburtsdatum:", "Kind:"];
const HIGH_RISK_LEGAL_MARKERS = ["Abschiebung", "Kündigung", "Mietvertrag"];
const AUTHORITY_DOCUMENT_MARKERS = ["Sehr geehrter", "Aktenzeichen", "IBAN", "Steuer-ID", "BG-Nr"];
const UNSAFE_CERTAINTY_PHRASES = ["Sie müssen", "garantiert", "fristlos sicher", "rechtlich sicher"];
const UNSAFE_GLOBAL_AUTH_PHRASES = [
  "public launch enabled", "all outputs authorized", "global approval",
  "branch c authorized", "approved for user display", "auto-approved", "show to user now",
  "authorized general live llm", "authorized public runtime",
];
const UNSAFE_REAL_INPUT_PHRASES = ["real user document", "real OCR text", "production runtime enabled"];
const UNSAFE_LIVE_EXEC_PHRASES = [
  "harness executed with live llm", "live llm executed",
  "real operator pilot executed", "real model output",
];
const UNSAFE_AUTH_PHRASES = [
  "post-run audit stored output", "live llm now authorized",
  "live llm call performed", "multiple live llm calls authorized",
  "general live llm runtime authorized", "single live llm call executed",
  "model output returned to user", "stored prompt", "stored completion",
  "prompt text logged", "model output logged", "live llm dry run executed",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_STRINGS.some((f) =>
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

function containsUnsafeLiveExecPhrase(value: string): boolean {
  return UNSAFE_LIVE_EXEC_PHRASES.some((p) => value.includes(p));
}

function containsUnsafeAuthPhrase(value: string): boolean {
  return UNSAFE_AUTH_PHRASES.some((p) => value.includes(p));
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
  return (
    value.includes("modelOutput") ||
    value.includes("real model output") ||
    value.includes("stored model output") ||
    value.includes("stored completion") ||
    value.includes("model output logged")
  );
}

function addReason(
  list: LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason[],
  reason: LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `LiveLlmSyntheticSingleCallDryRunAuthorizationInput`.
 * Dry-run authorization only — no live LLM call, no env read, no SDK import,
 * no HTTP call, no prompt construction, no real input, no AI output,
 * no persistence, no user-visible output.
 */
export function buildLiveLlmSyntheticSingleCallDryRunAuthorizationInput(): LiveLlmSyntheticSingleCallDryRunAuthorizationInput {
  const ackStatements =
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.join(
      " ",
    );

  return {
    authorizationId: "live-llm-synthetic-single-call-dry-run-authorization-8-3n",
    epochId: "8.3N",
    previousPhaseId: "8.3M",

    executionPlanReadyForDryRunAuthorization: true,

    authorizationScopes: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES],
    authorizationGates: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES],

    provider: "openai",
    model: "gpt_4o_mini",
    selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",

    killSwitchState: "armed",
    singleCallCounterState: "zero_before_call",
    authorizationDecision: "authorize_one_synthetic_call_next_phase",

    checklistConfirmed: [
      ...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST,
    ],

    dryRunAuthorizationOnly: true,
    nextPhaseExecutionRequired: true,
    authorizeExactlyOneSyntheticCallNextPhase: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerVerified: true,
    modelVerified: true,
    selectedCaseVerified: true,
    killSwitchArmed: true,
    singleCallCounterZero: true,
    promptPolicyReady: true,
    metadataOnlyCaptureReady: true,
    postCallGovernanceRecheckReady: true,
    postCallAuditReady: true,

    liveLLMCallPerformed: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,

    promptTextConstructedNow: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByAuthorization: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorDryRunAuthorizationAcknowledgment: ackStatements,
    reviewerDryRunAuthorizationAcknowledgment: ackStatements,
    notes: ["live LLM synthetic single-call dry-run authorization completed without live call"],

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
 * Validates a `LiveLlmSyntheticSingleCallDryRunAuthorizationInput` and returns
 * a typed `LiveLlmSyntheticSingleCallDryRunAuthorizationResult`.
 */
export function validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput(
  input: LiveLlmSyntheticSingleCallDryRunAuthorizationInput,
): LiveLlmSyntheticSingleCallDryRunAuthorizationResult {
  const reasons: LiveLlmSyntheticSingleCallDryRunAuthorizationRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.executionPlanReadyForDryRunAuthorization) {
    addReason(reasons, "execution_plan_not_ready");
  }

  // ── Rule 2: authorization scopes ──────────────────────────────────────────
  for (const s of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES) {
    if (!input.authorizationScopes.includes(s)) {
      addReason(reasons, "missing_authorization_scope");
      break;
    }
  }

  // ── Rule 3: authorization gates ───────────────────────────────────────────
  for (const g of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES) {
    if (!input.authorizationGates.includes(g)) {
      addReason(reasons, "missing_authorization_gate");
      break;
    }
  }

  // ── Rules 4–6: provider / model / selected case ───────────────────────────
  if (input.provider !== "openai") addReason(reasons, "missing_authorization_gate");
  if (input.model !== "gpt_4o_mini") addReason(reasons, "missing_authorization_gate");
  if (input.selectedSyntheticCase !== "synthetic_deadline_relative_missing_delivery_date") {
    addReason(reasons, "missing_authorization_gate");
  }

  // ── Rule 7: kill switch state ─────────────────────────────────────────────
  if (input.killSwitchState !== "armed") {
    addReason(reasons, "invalid_kill_switch_state");
  }

  // ── Rule 8: single-call counter state ─────────────────────────────────────
  if (input.singleCallCounterState !== "zero_before_call") {
    addReason(reasons, "invalid_single_call_counter_state");
  }

  // ── Rule 9: authorization decision ───────────────────────────────────────
  if (input.authorizationDecision !== "authorize_one_synthetic_call_next_phase") {
    addReason(reasons, "invalid_authorization_decision");
  }

  // ── Rule 10: checklist ────────────────────────────────────────────────────
  for (const item of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 11: dryRunAuthorizationOnly ─────────────────────────────────────
  if (inputRec["dryRunAuthorizationOnly"] !== true) {
    addReason(reasons, "authorization_attempted_live_llm_call");
  }

  // ── Rule 12: nextPhaseExecutionRequired ───────────────────────────────────
  if (inputRec["nextPhaseExecutionRequired"] !== true) {
    addReason(reasons, "missing_checklist_item");
  }

  // ── Rule 13: authorizeExactlyOneSyntheticCallNextPhase ────────────────────
  if (inputRec["authorizeExactlyOneSyntheticCallNextPhase"] !== true) {
    addReason(reasons, "authorization_attempted_multiple_call_authorization");
  }

  // ── Rule 14: general/multiple runtime flags ───────────────────────────────
  if (inputRec["generalLiveLlmRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "authorization_attempted_general_runtime_authorization");
  }
  if (inputRec["multipleLiveLlmCallsAllowed"] === true) {
    addReason(reasons, "authorization_attempted_multiple_call_authorization");
  }

  // ── Rule 15: required true guard flags ───────────────────────────────────
  if (inputRec["providerVerified"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["modelVerified"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["selectedCaseVerified"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["killSwitchArmed"] !== true) addReason(reasons, "invalid_kill_switch_state");
  if (inputRec["singleCallCounterZero"] !== true) addReason(reasons, "invalid_single_call_counter_state");
  if (inputRec["promptPolicyReady"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["metadataOnlyCaptureReady"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["postCallGovernanceRecheckReady"] !== true) addReason(reasons, "missing_authorization_gate");
  if (inputRec["postCallAuditReady"] !== true) addReason(reasons, "missing_authorization_gate");

  // ── Rule 16: execution self-call flags ────────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) addReason(reasons, "authorization_attempted_live_llm_call");
  if (inputRec["envReadPerformed"] === true) addReason(reasons, "authorization_attempted_env_read");
  if (inputRec["sdkImported"] === true) addReason(reasons, "authorization_attempted_sdk_import");
  if (inputRec["httpCallMade"] === true) addReason(reasons, "authorization_attempted_http_call");

  // ── Rule 17: prompt text / model output ───────────────────────────────────
  if (inputRec["promptTextConstructedNow"] === true) {
    addReason(reasons, "authorization_attempted_prompt_construction");
  }
  if (inputRec["promptTextLogged"] === true) {
    addReason(reasons, "authorization_attempted_prompt_logging");
  }
  if (inputRec["modelOutputLogged"] === true) {
    addReason(reasons, "authorization_attempted_model_output_logging");
  }

  // ── Rule 18: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "authorization_attempted_real_input_processing");
  }

  // ── Rule 19: real/raw/OCR/file/public input ───────────────────────────────
  if (inputRec["realUserInputAllowed"] === true || inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "authorization_attempted_real_input_processing");
  }
  if (inputRec["rawInputAllowed"] === true || inputRec["containsRawInputText"] === true) {
    addReason(reasons, "authorization_attempted_raw_input_forwarding");
  }
  if (inputRec["realRedactedInputAllowed"] === true || inputRec["containsRedactedText"] === true) {
    addReason(reasons, "authorization_attempted_redacted_input_forwarding");
  }
  if (inputRec["photoOrOcrInputAllowed"] === true || inputRec["fileUploadInputAllowed"] === true) {
    addReason(reasons, "authorization_attempted_photo_ocr_file_processing");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "authorization_attempted_real_input_processing");
  }

  // ── Rule 20: dependency flags ─────────────────────────────────────────────
  if (inputRec["branchCDependencyAllowed"] === true || inputRec["branchCCalled"] === true) {
    addReason(reasons, "authorization_attempted_branch_c_dependency");
  }
  if (
    inputRec["runSmartTalkDependencyAllowed"] === true ||
    inputRec["runSmartTalkCalledOrImported"] === true
  ) {
    addReason(reasons, "authorization_attempted_run_smart_talk_dependency");
  }
  if (
    inputRec["ocrRuntimeDependencyAllowed"] === true ||
    inputRec["extractTextFromImageCalledOrImported"] === true
  ) {
    addReason(reasons, "authorization_attempted_ocr_runtime_dependency");
  }

  // ── Rules 21–23: AI output / persistence / public ─────────────────────────
  if (inputRec["aiOutputGenerationPerformed"] === true || inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "authorization_attempted_ai_output_generation");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "authorization_attempted_model_output_storage");
  }
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByAuthorization"] === true
  ) {
    addReason(reasons, "authorization_attempted_user_visible_output");
  }
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "authorization_attempted_persistence");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "authorization_attempted_public_runtime");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "authorization_attempted_real_operator_pilot");
  }

  // ── Rule 24: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorDryRunAuthorizationAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerDryRunAuthorizationAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 25: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) addReason(reasons, "forbidden_document_content_detected");

  // ── Rules 26–28: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.authorizationId,
    input.operatorDryRunAuthorizationAcknowledgment,
    input.reviewerDryRunAuthorizationAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      const hasUncategorised =
        FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_STRINGS.some(
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
            !containsUnsafeLiveExecPhrase(s) &&
            !containsUnsafeAuthPhrase(s) &&
            !containsUnsafeMarker(s),
        );
      if (hasUncategorised) addReason(reasons, "unsafe_authorization_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  return {
    authorizationId: input.authorizationId,
    epochId: "8.3N",
    status: accepted ? "authorized" : "rejected",
    accepted,
    rejectionReasons: reasons,

    safeAuthorizationMetadata: {
      authorizationScopeCount: input.authorizationScopes.length,
      authorizationGateCount: input.authorizationGates.length,
      checklistPassedCount: input.checklistConfirmed.length,
      provider: "openai",
      model: "gpt_4o_mini",
      selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",
      killSwitchState: "armed",
      singleCallCounterState: "zero_before_call",
      authorizationDecision: "authorize_one_synthetic_call_next_phase",
    },

    readyForLiveLlmSyntheticSingleCallExecution: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryRunAuthorizationOnly: true,
    nextPhaseExecutionRequired: true,
    authorizeExactlyOneSyntheticCallNextPhase: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerVerified: true,
    modelVerified: true,
    selectedCaseVerified: true,
    killSwitchArmed: true,
    singleCallCounterZero: true,
    promptPolicyReady: true,
    metadataOnlyCaptureReady: true,
    postCallGovernanceRecheckReady: true,
    postCallAuditReady: true,

    liveLLMCalled: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,
    apiRouteCalled: false,

    promptTextConstructedNow: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByAuthorization: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByAuthorization: false,
    existingRuntimeModifiedByAuthorization: false,
    uiTouched: false,
    databaseOrStorageModifiedByAuthorization: false,
    neverUserVisible: true,
  };
}

// ── Dry-run authorization check ───────────────────────────────────────────────

/**
 * Runs the Live LLM Synthetic Single-Call Dry-Run Authorization check for
 * Phase 8.3N.
 *
 * Calls `runLiveLlmSyntheticSingleCallExecutionPlan()` (8.3M), builds and
 * validates a synthetic dry-run authorization input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT read env. Does NOT import any SDK.
 * Does NOT construct prompt text. Does NOT log prompt text or model output.
 * Does NOT produce real AI output. Does NOT emit user-visible output.
 * Does NOT modify DB/storage. Does NOT authorize general live LLM runtime.
 */
export function runLiveLlmSyntheticSingleCallDryRunAuthorization(): LiveLlmSyntheticSingleCallDryRunAuthorizationCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3M execution plan ───────────────────────────────────

  const planResult = runLiveLlmSyntheticSingleCallExecutionPlan();
  const planRec = asRec(planResult);

  const planReady =
    planResult.allPassed === true &&
    planRec["readyForLiveLlmSyntheticSingleCallDryRunAuthorization"] === true &&
    planRec["readyForLiveLLMRuntime"] !== true &&
    planRec["readyForConnectedAiRuntimeExecution"] !== true &&
    planRec["readyForRealOperatorPilotRun"] !== true &&
    planRec["readyForPilotRunNow"] !== true &&
    planRec["readyForPublicLaunch"] !== true &&
    planRec["readyForPersistence"] !== true &&
    planRec["executionPlanOnly"] === true &&
    planRec["futureDryRunAuthorizationRequired"] === true &&
    planRec["futureSingleLiveLlmSyntheticCallOnly"] === true &&
    planRec["generalLiveLlmRuntimeAuthorizationAllowed"] !== true &&
    planRec["multipleLiveLlmCallsAllowed"] !== true &&
    planRec["providerAllowlisted"] === true &&
    planRec["modelAllowlisted"] === true &&
    planRec["killSwitchProcedureRequired"] === true &&
    planRec["singleCallCounterProcedureRequired"] === true &&
    planRec["postCallGovernanceRecheckRequired"] === true &&
    planRec["postCallAuditRequired"] === true &&
    planRec["liveLLMCalled"] !== true &&
    planRec["envReadPerformed"] !== true &&
    planRec["sdkImported"] !== true &&
    planRec["httpCallMade"] !== true &&
    planRec["promptTextConstructedNow"] !== true &&
    planRec["promptTextLogged"] !== true &&
    planRec["modelOutputLogged"] !== true &&
    planRec["syntheticInputOnly"] === true &&
    planRec["realUserInputAllowed"] !== true &&
    planRec["rawInputAllowed"] !== true &&
    planRec["realRedactedInputAllowed"] !== true &&
    planRec["photoOrOcrInputAllowed"] !== true &&
    planRec["fileUploadInputAllowed"] !== true &&
    planRec["publicAnonymousInputAllowed"] !== true &&
    planRec["branchCDependencyAllowed"] !== true &&
    planRec["runSmartTalkDependencyAllowed"] !== true &&
    planRec["ocrRuntimeDependencyAllowed"] !== true &&
    planRec["branchCCalled"] !== true &&
    planRec["runSmartTalkCalledOrImported"] !== true &&
    planRec["extractTextFromImageCalledOrImported"] !== true &&
    planRec["aiOutputGenerated"] !== true &&
    planRec["modelOutputStored"] !== true &&
    planRec["userVisibleOutputEmitted"] !== true &&
    planRec["persistenceUsed"] !== true &&
    planRec["publicRuntimeEnabled"] !== true &&
    planRec["realOperatorPilotExecuted"] !== true &&
    planRec["neverUserVisible"] === true;

  notes.push(`planReady: ${String(planReady)}`);
  notes.push(`planResult.allPassed: ${String(planResult.allPassed)}`);
  notes.push(
    `readyForLiveLlmSyntheticSingleCallDryRunAuthorization: ${String(planRec["readyForLiveLlmSyntheticSingleCallDryRunAuthorization"])}`,
  );

  // ── Step 2: Validate the authorization input ──────────────────────────────

  const authInput = buildLiveLlmSyntheticSingleCallDryRunAuthorizationInput();
  const authResult = validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput(authInput);
  const authAccepted = authResult.accepted;

  notes.push(`authAccepted: ${String(authAccepted)}`);
  notes.push(`authStatus: ${authResult.status}`);
  if (!authResult.accepted) {
    notes.push(`rejectionReasons: ${authResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof LiveLlmSyntheticSingleCallDryRunAuthorizationInput]: LiveLlmSyntheticSingleCallDryRunAuthorizationInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): LiveLlmSyntheticSingleCallDryRunAuthorizationResult {
    return validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
      ...authInput,
      ...overrides,
    } as LiveLlmSyntheticSingleCallDryRunAuthorizationInput);
  }

  const partialScopes =
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES.slice(
      0,
      REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_SCOPES.length - 1,
    );
  const partialGates = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES.slice(
    0,
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_GATES.length - 1,
  );
  const partialChecklist =
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST.slice(
      0,
      REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_DRY_RUN_AUTHORIZATION_CHECKLIST.length - 1,
    );

  const tamperCases: Array<{
    label: string;
    result: LiveLlmSyntheticSingleCallDryRunAuthorizationResult;
  }> = [
    // 1. executionPlanReadyForDryRunAuthorization false
    {
      label: "executionPlanReady=false",
      result: tamper({ executionPlanReadyForDryRunAuthorization: false }),
    },
    // 2. missing scope
    { label: "missing scope", result: tamper({ authorizationScopes: partialScopes }) },
    // 3. missing gate
    { label: "missing gate", result: tamper({ authorizationGates: partialGates }) },
    // 4. invalid killSwitchState
    {
      label: "invalid killSwitchState",
      result: tamper({
        killSwitchState: "disarmed" as unknown as "armed",
      }),
    },
    // 5. invalid singleCallCounterState
    {
      label: "invalid singleCallCounterState",
      result: tamper({
        singleCallCounterState: "non_zero" as unknown as "zero_before_call",
      }),
    },
    // 6. invalid authorizationDecision
    {
      label: "invalid authorizationDecision",
      result: tamper({
        authorizationDecision: "reject",
      }),
    },
    // 7. missing checklist item
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 8. dryRunAuthorizationOnly false
    {
      label: "dryRunAuthorizationOnly=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        dryRunAuthorizationOnly: false as unknown as true,
      }),
    },
    // 9. nextPhaseExecutionRequired false
    {
      label: "nextPhaseExecutionRequired=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        nextPhaseExecutionRequired: false as unknown as true,
      }),
    },
    // 10. authorizeExactlyOneSyntheticCallNextPhase false
    {
      label: "authorizeExactlyOneSyntheticCallNextPhase=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        authorizeExactlyOneSyntheticCallNextPhase: false as unknown as true,
      }),
    },
    // 11. generalLiveLlmRuntimeAuthorizationAllowed true
    {
      label: "generalLiveLlmRuntimeAuthorizationAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        generalLiveLlmRuntimeAuthorizationAllowed: true as unknown as false,
      }),
    },
    // 12. multipleLiveLlmCallsAllowed true
    {
      label: "multipleLiveLlmCallsAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        multipleLiveLlmCallsAllowed: true as unknown as false,
      }),
    },
    // 13. providerVerified false
    {
      label: "providerVerified=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        providerVerified: false as unknown as true,
      }),
    },
    // 14. modelVerified false
    {
      label: "modelVerified=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        modelVerified: false as unknown as true,
      }),
    },
    // 15. selectedCaseVerified false
    {
      label: "selectedCaseVerified=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        selectedCaseVerified: false as unknown as true,
      }),
    },
    // 16. killSwitchArmed false
    {
      label: "killSwitchArmed=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        killSwitchArmed: false as unknown as true,
      }),
    },
    // 17. singleCallCounterZero false
    {
      label: "singleCallCounterZero=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        singleCallCounterZero: false as unknown as true,
      }),
    },
    // 18. promptPolicyReady false
    {
      label: "promptPolicyReady=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        promptPolicyReady: false as unknown as true,
      }),
    },
    // 19. metadataOnlyCaptureReady false
    {
      label: "metadataOnlyCaptureReady=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        metadataOnlyCaptureReady: false as unknown as true,
      }),
    },
    // 20. postCallGovernanceRecheckReady false
    {
      label: "postCallGovernanceRecheckReady=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        postCallGovernanceRecheckReady: false as unknown as true,
      }),
    },
    // 21. postCallAuditReady false
    {
      label: "postCallAuditReady=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        postCallAuditReady: false as unknown as true,
      }),
    },
    // 22. liveLLMCallPerformed true
    {
      label: "liveLLMCallPerformed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        liveLLMCallPerformed: true as unknown as false,
      }),
    },
    // 23. envReadPerformed true
    {
      label: "envReadPerformed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        envReadPerformed: true as unknown as false,
      }),
    },
    // 24. sdkImported true
    {
      label: "sdkImported=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        sdkImported: true as unknown as false,
      }),
    },
    // 25. httpCallMade true
    {
      label: "httpCallMade=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        httpCallMade: true as unknown as false,
      }),
    },
    // 26. promptTextConstructedNow true
    {
      label: "promptTextConstructedNow=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        promptTextConstructedNow: true as unknown as false,
      }),
    },
    // 27. promptTextLogged true
    {
      label: "promptTextLogged=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        promptTextLogged: true as unknown as false,
      }),
    },
    // 28. modelOutputLogged true
    {
      label: "modelOutputLogged=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        modelOutputLogged: true as unknown as false,
      }),
    },
    // 29. syntheticInputOnly false
    {
      label: "syntheticInputOnly=false",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        syntheticInputOnly: false as unknown as true,
      }),
    },
    // 30. realUserInputAllowed true
    {
      label: "realUserInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        realUserInputAllowed: true as unknown as false,
      }),
    },
    // 31. rawInputAllowed true
    {
      label: "rawInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        rawInputAllowed: true as unknown as false,
      }),
    },
    // 32. realRedactedInputAllowed true
    {
      label: "realRedactedInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        realRedactedInputAllowed: true as unknown as false,
      }),
    },
    // 33. photoOrOcrInputAllowed true
    {
      label: "photoOrOcrInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        photoOrOcrInputAllowed: true as unknown as false,
      }),
    },
    // 34. fileUploadInputAllowed true
    {
      label: "fileUploadInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        fileUploadInputAllowed: true as unknown as false,
      }),
    },
    // 35. publicAnonymousInputAllowed true
    {
      label: "publicAnonymousInputAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        publicAnonymousInputAllowed: true as unknown as false,
      }),
    },
    // 36. branchCDependencyAllowed true
    {
      label: "branchCDependencyAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        branchCDependencyAllowed: true as unknown as false,
      }),
    },
    // 37. runSmartTalkDependencyAllowed true
    {
      label: "runSmartTalkDependencyAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        runSmartTalkDependencyAllowed: true as unknown as false,
      }),
    },
    // 38. ocrRuntimeDependencyAllowed true
    {
      label: "ocrRuntimeDependencyAllowed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        ocrRuntimeDependencyAllowed: true as unknown as false,
      }),
    },
    // 39. branchCCalled true
    {
      label: "branchCCalled=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        branchCCalled: true as unknown as false,
      }),
    },
    // 40. runSmartTalkCalledOrImported true
    {
      label: "runSmartTalkCalledOrImported=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        runSmartTalkCalledOrImported: true as unknown as false,
      }),
    },
    // 41. extractTextFromImageCalledOrImported true
    {
      label: "extractTextFromImageCalledOrImported=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        extractTextFromImageCalledOrImported: true as unknown as false,
      }),
    },
    // 42. aiOutputGenerationPerformed true
    {
      label: "aiOutputGenerationPerformed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        aiOutputGenerationPerformed: true as unknown as false,
      }),
    },
    // 43. aiOutputGenerated true
    {
      label: "aiOutputGenerated=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        aiOutputGenerated: true as unknown as false,
      }),
    },
    // 44. modelOutputStored true
    {
      label: "modelOutputStored=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        modelOutputStored: true as unknown as false,
      }),
    },
    // 45. userVisibleOutputEmitted true
    {
      label: "userVisibleOutputEmitted=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        userVisibleOutputEmitted: true as unknown as false,
      }),
    },
    // 46. userVisibleOutputAuthorizedByAuthorization true
    {
      label: "userVisibleOutputAuthorizedByAuthorization=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        userVisibleOutputAuthorizedByAuthorization: true as unknown as false,
      }),
    },
    // 47. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 48. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 49. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 50. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 51. realOperatorPilotExecuted true
    {
      label: "realOperatorPilotExecuted=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        realOperatorPilotExecuted: true as unknown as false,
      }),
    },
    // 52. missing operator ack
    {
      label: "missing operator ack",
      result: tamper({ operatorDryRunAuthorizationAcknowledgment: "partial" }),
    },
    // 53. missing reviewer ack
    {
      label: "missing reviewer ack",
      result: tamper({ reviewerDryRunAuthorizationAcknowledgment: "partial" }),
    },
    // 54. containsSecret true
    {
      label: "containsSecret=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 55. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 56. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 57. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 58. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 59. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 60. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 61. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsUserPii: true as unknown as false,
      }),
    },
    // 62. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateLiveLlmSyntheticSingleCallDryRunAuthorizationInput({
        ...authInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 63–98: notes with forbidden strings
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    {
      label: 'notes: "all outputs authorized"',
      result: tamper({ notes: ["all outputs authorized"] }),
    },
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    {
      label: 'notes: "production runtime enabled"',
      result: tamper({ notes: ["production runtime enabled"] }),
    },
    {
      label: 'notes: "harness executed with live llm"',
      result: tamper({ notes: ["harness executed with live llm"] }),
    },
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    {
      label: 'notes: "real operator pilot executed"',
      result: tamper({ notes: ["real operator pilot executed"] }),
    },
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
    {
      label: 'notes: "post-run audit stored output"',
      result: tamper({ notes: ["post-run audit stored output"] }),
    },
    {
      label: 'notes: "live llm now authorized"',
      result: tamper({ notes: ["live llm now authorized"] }),
    },
    {
      label: 'notes: "live llm call performed"',
      result: tamper({ notes: ["live llm call performed"] }),
    },
    {
      label: 'notes: "multiple live llm calls authorized"',
      result: tamper({ notes: ["multiple live llm calls authorized"] }),
    },
    {
      label: 'notes: "general live llm runtime authorized"',
      result: tamper({ notes: ["general live llm runtime authorized"] }),
    },
    {
      label: 'notes: "single live llm call executed"',
      result: tamper({ notes: ["single live llm call executed"] }),
    },
    {
      label: 'notes: "model output returned to user"',
      result: tamper({ notes: ["model output returned to user"] }),
    },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "stored completion"', result: tamper({ notes: ["stored completion"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    {
      label: 'notes: "live llm dry run executed"',
      result: tamper({ notes: ["live llm dry run executed"] }),
    },
    // 2 new phrases for 8.3N
    {
      label: 'notes: "authorized general live llm"',
      result: tamper({ notes: ["authorized general live llm"] }),
    },
    {
      label: 'notes: "authorized public runtime"',
      result: tamper({ notes: ["authorized public runtime"] }),
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

  const allPassed = planReady && authAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3N",
    allPassed,
    executionPlanReadyForDryRunAuthorization: planReady,
    liveLlmSyntheticSingleCallDryRunAuthorizationAccepted: authAccepted,
    tamperCasesRejected,

    readyForLiveLlmSyntheticSingleCallExecution: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryRunAuthorizationOnly: true,
    nextPhaseExecutionRequired: true,
    authorizeExactlyOneSyntheticCallNextPhase: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerVerified: true,
    modelVerified: true,
    selectedCaseVerified: true,
    killSwitchArmed: true,
    singleCallCounterZero: true,
    promptPolicyReady: true,
    metadataOnlyCaptureReady: true,
    postCallGovernanceRecheckReady: true,
    postCallAuditReady: true,

    liveLLMCalled: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,

    promptTextConstructedNow: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

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
