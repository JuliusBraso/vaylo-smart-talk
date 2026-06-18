/**
 * Live LLM Synthetic Single-Call Execution Plan (Phase 8.3M).
 *
 * Validates the Live LLM Synthetic Single-Call Execution Plan input and
 * produces a `LiveLlmSyntheticSingleCallExecutionPlanCheckResult`.
 *
 * Sub-steps:
 *   1. Call runLiveLlmSyntheticSingleCallContract() (8.3L) and verify all
 *      prerequisite invariants.
 *   2. Build a synthetic execution plan input and validate it.
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
 * Invoke `runLiveLlmSyntheticSingleCallExecutionPlan()` explicitly.
 */

import { runLiveLlmSyntheticSingleCallContract } from "./run-live-llm-synthetic-single-call-contract";
import {
  FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_STRINGS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS,
} from "./live-llm-synthetic-single-call-execution-plan-types";
import type {
  LiveLlmSyntheticSingleCallExecutionPlanCheckResult,
  LiveLlmSyntheticSingleCallExecutionPlanInput,
  LiveLlmSyntheticSingleCallExecutionPlanResult,
  LiveLlmSyntheticSingleCallExecutionPlanRejectionReason,
} from "./live-llm-synthetic-single-call-execution-plan-types";

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
];
const UNSAFE_REAL_INPUT_PHRASES = ["real user document", "real OCR text", "production runtime enabled"];
const UNSAFE_LIVE_EXEC_PHRASES = [
  "harness executed with live llm", "live llm executed",
  "real operator pilot executed", "real model output",
];
const UNSAFE_PLAN_PHRASES = [
  "post-run audit stored output", "live llm now authorized",
  "live llm call performed", "multiple live llm calls authorized",
  "general live llm runtime authorized", "single live llm call executed",
  "model output returned to user", "stored prompt", "stored completion",
  "prompt text logged", "model output logged", "live llm dry run executed",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_STRINGS.some((f) =>
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

function containsUnsafePlanPhrase(value: string): boolean {
  return UNSAFE_PLAN_PHRASES.some((p) => value.includes(p));
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
  list: LiveLlmSyntheticSingleCallExecutionPlanRejectionReason[],
  reason: LiveLlmSyntheticSingleCallExecutionPlanRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `LiveLlmSyntheticSingleCallExecutionPlanInput`.
 * Execution plan only — no live LLM call, no env read, no SDK import,
 * no HTTP call, no prompt construction, no real input, no AI output,
 * no persistence, no user-visible output.
 */
export function buildLiveLlmSyntheticSingleCallExecutionPlanInput(): LiveLlmSyntheticSingleCallExecutionPlanInput {
  const ackStatements =
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    planId: "live-llm-synthetic-single-call-execution-plan-8-3m",
    epochId: "8.3M",
    previousPhaseId: "8.3L",

    singleCallContractReadyForExecutionPlan: true,

    executionMode: "preflight_plan_only",
    provider: "openai",
    model: "gpt_4o_mini",
    selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",

    preflightSteps: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS],
    promptComponents: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS],
    promptBlockers: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS],
    metadataCapture: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE],
    executionGates: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES],
    executionBlockers: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS],
    checklistConfirmed: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST],

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchProcedureRequired: true,
    singleCallCounterProcedureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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
    userVisibleOutputAuthorizedByPlan: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorExecutionPlanAcknowledgment: ackStatements,
    reviewerExecutionPlanAcknowledgment: ackStatements,
    notes: ["live LLM synthetic single-call execution plan completed without live call"],

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
 * Validates a `LiveLlmSyntheticSingleCallExecutionPlanInput` and returns a
 * typed `LiveLlmSyntheticSingleCallExecutionPlanResult`.
 */
export function validateLiveLlmSyntheticSingleCallExecutionPlanInput(
  input: LiveLlmSyntheticSingleCallExecutionPlanInput,
): LiveLlmSyntheticSingleCallExecutionPlanResult {
  const reasons: LiveLlmSyntheticSingleCallExecutionPlanRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.singleCallContractReadyForExecutionPlan) {
    addReason(reasons, "single_call_contract_not_ready");
  }

  // ── Rule 2: execution mode ────────────────────────────────────────────────
  if (
    input.executionMode !== "preflight_plan_only" &&
    input.executionMode !== "dry_run_authorization_allowed_next_phase"
  ) {
    addReason(reasons, "invalid_execution_mode");
  }

  // ── Rules 3–5: provider / model / selected case ───────────────────────────
  if (input.provider !== "openai") addReason(reasons, "invalid_provider");
  if (input.model !== "gpt_4o_mini") addReason(reasons, "invalid_model");
  if (input.selectedSyntheticCase !== "synthetic_deadline_relative_missing_delivery_date") {
    addReason(reasons, "invalid_selected_synthetic_case");
  }

  // ── Rules 6–12: required list completeness ────────────────────────────────
  for (const s of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS) {
    if (!input.preflightSteps.includes(s)) { addReason(reasons, "missing_preflight_step"); break; }
  }
  for (const c of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS) {
    if (!input.promptComponents.includes(c)) { addReason(reasons, "missing_prompt_component"); break; }
  }
  for (const b of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS) {
    if (!input.promptBlockers.includes(b)) { addReason(reasons, "missing_prompt_blocker"); break; }
  }
  for (const m of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE) {
    if (!input.metadataCapture.includes(m)) { addReason(reasons, "missing_metadata_capture"); break; }
  }
  for (const g of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES) {
    if (!input.executionGates.includes(g)) { addReason(reasons, "missing_execution_gate"); break; }
  }
  for (const bl of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS) {
    if (!input.executionBlockers.includes(bl)) { addReason(reasons, "missing_execution_blocker"); break; }
  }
  for (const item of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) { addReason(reasons, "missing_checklist_item"); break; }
  }

  // ── Rule 13: executionPlanOnly ────────────────────────────────────────────
  if (inputRec["executionPlanOnly"] !== true) {
    addReason(reasons, "planning_attempted_live_llm_call");
  }

  // ── Rule 14: futureDryRunAuthorizationRequired ────────────────────────────
  if (inputRec["futureDryRunAuthorizationRequired"] !== true) {
    addReason(reasons, "missing_checklist_item");
  }

  // ── Rule 15: futureSingleLiveLlmSyntheticCallOnly ─────────────────────────
  if (inputRec["futureSingleLiveLlmSyntheticCallOnly"] !== true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 16: general/multiple runtime flags ───────────────────────────────
  if (inputRec["generalLiveLlmRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "planning_attempted_general_runtime_authorization");
  }
  if (inputRec["multipleLiveLlmCallsAllowed"] === true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 17: required true guard flags ───────────────────────────────────
  if (inputRec["providerAllowlisted"] !== true) addReason(reasons, "invalid_provider");
  if (inputRec["modelAllowlisted"] !== true) addReason(reasons, "invalid_model");
  if (inputRec["killSwitchProcedureRequired"] !== true) addReason(reasons, "missing_kill_switch_procedure");
  if (inputRec["singleCallCounterProcedureRequired"] !== true) addReason(reasons, "missing_single_call_counter_procedure");
  if (inputRec["postCallGovernanceRecheckRequired"] !== true) addReason(reasons, "missing_post_call_governance_recheck");
  if (inputRec["postCallAuditRequired"] !== true) addReason(reasons, "missing_post_call_audit");

  // ── Rule 18: execution self-call flags ────────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) addReason(reasons, "planning_attempted_live_llm_call");
  if (inputRec["envReadPerformed"] === true) addReason(reasons, "planning_attempted_env_read");
  if (inputRec["sdkImported"] === true) addReason(reasons, "planning_attempted_sdk_import");
  if (inputRec["httpCallMade"] === true) addReason(reasons, "planning_attempted_http_call");

  // ── Rule 19: prompt text / model output logging ───────────────────────────
  if (inputRec["promptTextConstructedNow"] === true) addReason(reasons, "unsafe_execution_plan_note_detected");
  if (inputRec["promptTextLogged"] === true) addReason(reasons, "unsafe_execution_plan_note_detected");
  if (inputRec["modelOutputLogged"] === true) addReason(reasons, "unsafe_execution_plan_note_detected");

  // ── Rule 20: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "planning_attempted_real_input_processing");
  }

  // ── Rule 21: real/raw/OCR/file/public input ───────────────────────────────
  if (inputRec["realUserInputAllowed"] === true || inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "planning_attempted_real_input_processing");
  }
  if (inputRec["rawInputAllowed"] === true || inputRec["containsRawInputText"] === true) {
    addReason(reasons, "planning_attempted_raw_input_forwarding");
  }
  if (inputRec["realRedactedInputAllowed"] === true || inputRec["containsRedactedText"] === true) {
    addReason(reasons, "planning_attempted_redacted_input_forwarding");
  }
  if (inputRec["photoOrOcrInputAllowed"] === true || inputRec["fileUploadInputAllowed"] === true) {
    addReason(reasons, "planning_attempted_photo_ocr_file_processing");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "planning_attempted_real_input_processing");
  }

  // ── Rule 22: dependency flags ─────────────────────────────────────────────
  if (inputRec["branchCDependencyAllowed"] === true || inputRec["branchCCalled"] === true) {
    addReason(reasons, "planning_attempted_branch_c_dependency");
  }
  if (inputRec["runSmartTalkDependencyAllowed"] === true || inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_run_smart_talk_dependency");
  }
  if (inputRec["ocrRuntimeDependencyAllowed"] === true || inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_ocr_runtime_dependency");
  }

  // ── Rules 23–25: AI output / persistence / public ─────────────────────────
  if (inputRec["aiOutputGenerationPerformed"] === true || inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "planning_attempted_ai_output_generation");
  }
  if (inputRec["modelOutputStored"] === true) addReason(reasons, "planning_attempted_model_output_storage");
  if (inputRec["userVisibleOutputEmitted"] === true || inputRec["userVisibleOutputAuthorizedByPlan"] === true) {
    addReason(reasons, "planning_attempted_user_visible_output");
  }
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "planning_attempted_persistence");
  }
  if (inputRec["publicRuntimeEnabled"] === true) addReason(reasons, "planning_attempted_public_runtime");
  if (inputRec["realOperatorPilotExecuted"] === true) addReason(reasons, "planning_attempted_real_operator_pilot");

  // ── Rule 26: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorExecutionPlanAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerExecutionPlanAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }

  // ── Rule 27: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) addReason(reasons, "forbidden_document_content_detected");

  // ── Rules 28–30: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.planId,
    input.operatorExecutionPlanAcknowledgment,
    input.reviewerExecutionPlanAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
      if (containsUnsafePlanPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
      const hasUncategorised = FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_STRINGS.some(
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
          !containsUnsafePlanPhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (hasUncategorised) addReason(reasons, "unsafe_execution_plan_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
    if (containsUnsafePlanPhrase(s)) addReason(reasons, "unsafe_execution_plan_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  return {
    planId: input.planId,
    epochId: "8.3M",
    status: accepted ? "valid" : "rejected",
    accepted,
    rejectionReasons: reasons,

    safeExecutionPlanMetadata: {
      provider: "openai",
      model: "gpt_4o_mini",
      selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",
      preflightStepCount: input.preflightSteps.length,
      promptComponentCount: input.promptComponents.length,
      promptBlockerCount: input.promptBlockers.length,
      metadataCaptureCount: input.metadataCapture.length,
      executionGateCount: input.executionGates.length,
      executionBlockerCount: input.executionBlockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForLiveLlmSyntheticSingleCallDryRunAuthorization: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchProcedureRequired: true,
    singleCallCounterProcedureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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
    userVisibleOutputAuthorizedByPlan: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByExecutionPlan: false,
    existingRuntimeModifiedByExecutionPlan: false,
    uiTouched: false,
    databaseOrStorageModifiedByExecutionPlan: false,
    neverUserVisible: true,
  };
}

// ── Execution plan check ──────────────────────────────────────────────────────

/**
 * Runs the Live LLM Synthetic Single-Call Execution Plan check for Phase 8.3M.
 *
 * Calls `runLiveLlmSyntheticSingleCallContract()` (8.3L), builds and validates
 * a synthetic safe execution plan input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT read env. Does NOT import any SDK.
 * Does NOT construct prompt text. Does NOT log prompt text or model output.
 * Does NOT produce real AI output. Does NOT emit user-visible output.
 * Does NOT modify DB/storage. Does NOT authorize general live LLM runtime.
 */
export function runLiveLlmSyntheticSingleCallExecutionPlan(): LiveLlmSyntheticSingleCallExecutionPlanCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3L single-call contract ──────────────────────────────

  const contractResult = runLiveLlmSyntheticSingleCallContract();
  const contractRec = asRec(contractResult);

  const contractReady =
    contractResult.allPassed === true &&
    contractRec["readyForLiveLlmSyntheticSingleCallExecutionPlan"] === true &&
    contractRec["readyForLiveLLMRuntime"] !== true &&
    contractRec["readyForConnectedAiRuntimeExecution"] !== true &&
    contractRec["readyForRealOperatorPilotRun"] !== true &&
    contractRec["readyForPilotRunNow"] !== true &&
    contractRec["readyForPublicLaunch"] !== true &&
    contractRec["readyForPersistence"] !== true &&
    contractRec["contractOnly"] === true &&
    contractRec["futureExecutionPlanRequired"] === true &&
    contractRec["futureSingleLiveLlmSyntheticCallOnly"] === true &&
    contractRec["generalLiveLlmRuntimeAuthorizationAllowed"] !== true &&
    contractRec["multipleLiveLlmCallsAllowed"] !== true &&
    contractRec["providerAllowlisted"] === true &&
    contractRec["modelAllowlisted"] === true &&
    contractRec["killSwitchRequired"] === true &&
    contractRec["singleCallCounterRequired"] === true &&
    contractRec["postCallGovernanceRecheckRequired"] === true &&
    contractRec["postCallAuditRequired"] === true &&
    contractRec["liveLLMCalled"] !== true &&
    contractRec["envReadPerformed"] !== true &&
    contractRec["sdkImported"] !== true &&
    contractRec["httpCallMade"] !== true &&
    contractRec["syntheticInputOnly"] === true &&
    contractRec["realUserInputAllowed"] !== true &&
    contractRec["rawInputAllowed"] !== true &&
    contractRec["realRedactedInputAllowed"] !== true &&
    contractRec["photoOrOcrInputAllowed"] !== true &&
    contractRec["fileUploadInputAllowed"] !== true &&
    contractRec["publicAnonymousInputAllowed"] !== true &&
    contractRec["branchCDependencyAllowed"] !== true &&
    contractRec["runSmartTalkDependencyAllowed"] !== true &&
    contractRec["ocrRuntimeDependencyAllowed"] !== true &&
    contractRec["branchCCalled"] !== true &&
    contractRec["runSmartTalkCalledOrImported"] !== true &&
    contractRec["extractTextFromImageCalledOrImported"] !== true &&
    contractRec["aiOutputGenerated"] !== true &&
    contractRec["modelOutputStored"] !== true &&
    contractRec["userVisibleOutputEmitted"] !== true &&
    contractRec["persistenceUsed"] !== true &&
    contractRec["publicRuntimeEnabled"] !== true &&
    contractRec["realOperatorPilotExecuted"] !== true &&
    contractRec["neverUserVisible"] === true;

  notes.push(`contractReady: ${String(contractReady)}`);
  notes.push(`contractResult.allPassed: ${String(contractResult.allPassed)}`);
  notes.push(`readyForLiveLlmSyntheticSingleCallExecutionPlan: ${String(contractRec["readyForLiveLlmSyntheticSingleCallExecutionPlan"])}`);

  // ── Step 2: Validate the execution plan input ─────────────────────────────

  const planInput = buildLiveLlmSyntheticSingleCallExecutionPlanInput();
  const planResult = validateLiveLlmSyntheticSingleCallExecutionPlanInput(planInput);
  const planAccepted = planResult.accepted;

  notes.push(`planAccepted: ${String(planAccepted)}`);
  notes.push(`planStatus: ${planResult.status}`);
  if (!planResult.accepted) {
    notes.push(`rejectionReasons: ${planResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof LiveLlmSyntheticSingleCallExecutionPlanInput]: LiveLlmSyntheticSingleCallExecutionPlanInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): LiveLlmSyntheticSingleCallExecutionPlanResult {
    return validateLiveLlmSyntheticSingleCallExecutionPlanInput({
      ...planInput,
      ...overrides,
    } as LiveLlmSyntheticSingleCallExecutionPlanInput);
  }

  const partialPreflight = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PREFLIGHT_STEPS.length - 1);
  const partialComponents = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_COMPONENTS.length - 1);
  const partialBlockers = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_BLOCKERS.length - 1);
  const partialMeta = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_METADATA_CAPTURE.length - 1);
  const partialGates = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GATES.length - 1);
  const partialExecBlockers = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_BLOCKERS.length - 1);
  const partialChecklist = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_PLAN_CHECKLIST.length - 1);

  const tamperCases: Array<{ label: string; result: LiveLlmSyntheticSingleCallExecutionPlanResult }> = [
    // 1. singleCallContractReadyForExecutionPlan false
    { label: "contractReady=false", result: tamper({ singleCallContractReadyForExecutionPlan: false }) },
    // 2. invalid executionMode
    { label: "invalid executionMode", result: tamper({ executionMode: "invalid_mode" as unknown as "preflight_plan_only" }) },
    // 3. invalid provider
    { label: "invalid provider", result: tamper({ provider: "gemini" as unknown as "openai" }) },
    // 4. invalid model
    { label: "invalid model", result: tamper({ model: "gpt_4_turbo" as unknown as "gpt_4o_mini" }) },
    // 5. invalid selectedSyntheticCase
    { label: "invalid selectedSyntheticCase", result: tamper({ selectedSyntheticCase: "synthetic_safe_low_risk_payment_notice" as unknown as "synthetic_deadline_relative_missing_delivery_date" }) },
    // 6. missing preflight step
    { label: "missing preflight step", result: tamper({ preflightSteps: partialPreflight }) },
    // 7. missing prompt component
    { label: "missing prompt component", result: tamper({ promptComponents: partialComponents }) },
    // 8. missing prompt blocker
    { label: "missing prompt blocker", result: tamper({ promptBlockers: partialBlockers }) },
    // 9. missing metadata capture
    { label: "missing metadata capture", result: tamper({ metadataCapture: partialMeta }) },
    // 10. missing execution gate
    { label: "missing execution gate", result: tamper({ executionGates: partialGates }) },
    // 11. missing execution blocker
    { label: "missing execution blocker", result: tamper({ executionBlockers: partialExecBlockers }) },
    // 12. missing checklist item
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 13. executionPlanOnly false
    { label: "executionPlanOnly=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, executionPlanOnly: false as unknown as true }) },
    // 14. futureDryRunAuthorizationRequired false
    { label: "futureDryRunAuthorizationRequired=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, futureDryRunAuthorizationRequired: false as unknown as true }) },
    // 15. futureSingleLiveLlmSyntheticCallOnly false
    { label: "futureSingleLiveLlmSyntheticCallOnly=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, futureSingleLiveLlmSyntheticCallOnly: false as unknown as true }) },
    // 16. generalLiveLlmRuntimeAuthorizationAllowed true
    { label: "generalLiveLlmRuntimeAuthorizationAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, generalLiveLlmRuntimeAuthorizationAllowed: true as unknown as false }) },
    // 17. multipleLiveLlmCallsAllowed true
    { label: "multipleLiveLlmCallsAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, multipleLiveLlmCallsAllowed: true as unknown as false }) },
    // 18. providerAllowlisted false
    { label: "providerAllowlisted=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, providerAllowlisted: false as unknown as true }) },
    // 19. modelAllowlisted false
    { label: "modelAllowlisted=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, modelAllowlisted: false as unknown as true }) },
    // 20. killSwitchProcedureRequired false
    { label: "killSwitchProcedureRequired=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, killSwitchProcedureRequired: false as unknown as true }) },
    // 21. singleCallCounterProcedureRequired false
    { label: "singleCallCounterProcedureRequired=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, singleCallCounterProcedureRequired: false as unknown as true }) },
    // 22. postCallGovernanceRecheckRequired false
    { label: "postCallGovernanceRecheckRequired=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, postCallGovernanceRecheckRequired: false as unknown as true }) },
    // 23. postCallAuditRequired false
    { label: "postCallAuditRequired=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, postCallAuditRequired: false as unknown as true }) },
    // 24. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, liveLLMCallPerformed: true as unknown as false }) },
    // 25. envReadPerformed true
    { label: "envReadPerformed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, envReadPerformed: true as unknown as false }) },
    // 26. sdkImported true
    { label: "sdkImported=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, sdkImported: true as unknown as false }) },
    // 27. httpCallMade true
    { label: "httpCallMade=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, httpCallMade: true as unknown as false }) },
    // 28. promptTextConstructedNow true
    { label: "promptTextConstructedNow=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, promptTextConstructedNow: true as unknown as false }) },
    // 29. promptTextLogged true
    { label: "promptTextLogged=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, promptTextLogged: true as unknown as false }) },
    // 30. modelOutputLogged true
    { label: "modelOutputLogged=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, modelOutputLogged: true as unknown as false }) },
    // 31. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, syntheticInputOnly: false as unknown as true }) },
    // 32. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, realUserInputAllowed: true as unknown as false }) },
    // 33. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, rawInputAllowed: true as unknown as false }) },
    // 34. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, realRedactedInputAllowed: true as unknown as false }) },
    // 35. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 36. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, fileUploadInputAllowed: true as unknown as false }) },
    // 37. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 38. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, branchCDependencyAllowed: true as unknown as false }) },
    // 39. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 40. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 41. branchCCalled true
    { label: "branchCCalled=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, branchCCalled: true as unknown as false }) },
    // 42. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 43. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 44. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 45. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, aiOutputGenerated: true as unknown as false }) },
    // 46. modelOutputStored true
    { label: "modelOutputStored=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, modelOutputStored: true as unknown as false }) },
    // 47. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 48. userVisibleOutputAuthorizedByPlan true
    { label: "userVisibleOutputAuthorizedByPlan=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, userVisibleOutputAuthorizedByPlan: true as unknown as false }) },
    // 49. persistenceUsed true
    { label: "persistenceUsed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, persistenceUsed: true as unknown as false }) },
    // 50. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, dnaSavePerformed: true as unknown as false }) },
    // 51. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, offlineSavePerformed: true as unknown as false }) },
    // 52. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, publicRuntimeEnabled: true as unknown as false }) },
    // 53. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 54. missing operator ack
    { label: "missing operator ack", result: tamper({ operatorExecutionPlanAcknowledgment: "partial" }) },
    // 55. missing reviewer ack
    { label: "missing reviewer ack", result: tamper({ reviewerExecutionPlanAcknowledgment: "partial" }) },
    // 56. containsSecret true
    { label: "containsSecret=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsSecret: true as unknown as false }) },
    // 57. containsEnvValue true
    { label: "containsEnvValue=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsEnvValue: true as unknown as false }) },
    // 58. containsApiKey true
    { label: "containsApiKey=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsApiKey: true as unknown as false }) },
    // 59. containsRawInputText true
    { label: "containsRawInputText=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsRawInputText: true as unknown as false }) },
    // 60. containsRedactedText true
    { label: "containsRedactedText=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsRedactedText: true as unknown as false }) },
    // 61. containsModelOutput true
    { label: "containsModelOutput=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsModelOutput: true as unknown as false }) },
    // 62. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsDocumentContent: true as unknown as false }) },
    // 63. containsUserPii true
    { label: "containsUserPii=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsUserPii: true as unknown as false }) },
    // 64. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateLiveLlmSyntheticSingleCallExecutionPlanInput({ ...planInput, containsRealUserInput: true as unknown as false }) },
    // 65–96: notes with forbidden strings
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
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    { label: 'notes: "production runtime enabled"', result: tamper({ notes: ["production runtime enabled"] }) },
    { label: 'notes: "harness executed with live llm"', result: tamper({ notes: ["harness executed with live llm"] }) },
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    { label: 'notes: "real operator pilot executed"', result: tamper({ notes: ["real operator pilot executed"] }) },
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
    { label: 'notes: "post-run audit stored output"', result: tamper({ notes: ["post-run audit stored output"] }) },
    { label: 'notes: "live llm now authorized"', result: tamper({ notes: ["live llm now authorized"] }) },
    { label: 'notes: "live llm call performed"', result: tamper({ notes: ["live llm call performed"] }) },
    { label: 'notes: "multiple live llm calls authorized"', result: tamper({ notes: ["multiple live llm calls authorized"] }) },
    { label: 'notes: "general live llm runtime authorized"', result: tamper({ notes: ["general live llm runtime authorized"] }) },
    { label: 'notes: "single live llm call executed"', result: tamper({ notes: ["single live llm call executed"] }) },
    { label: 'notes: "model output returned to user"', result: tamper({ notes: ["model output returned to user"] }) },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "stored completion"', result: tamper({ notes: ["stored completion"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    { label: 'notes: "live llm dry run executed"', result: tamper({ notes: ["live llm dry run executed"] }) },
  ];

  let allTamperRejected = true;
  for (const tc of tamperCases) {
    if (tc.result.accepted) {
      notes.push(`TAMPER CASE NOT REJECTED: ${tc.label}`);
      allTamperRejected = false;
    }
  }
  const tamperCasesRejected = allTamperRejected;
  notes.push(`tamperCasesRejected: ${String(tamperCasesRejected)} (${String(tamperCases.length)} cases)`);

  // ── Final result ──────────────────────────────────────────────────────────

  const allPassed = contractReady && planAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3M",
    allPassed,
    singleCallContractReadyForExecutionPlan: contractReady,
    liveLlmSyntheticSingleCallExecutionPlanAccepted: planAccepted,
    tamperCasesRejected,

    readyForLiveLlmSyntheticSingleCallDryRunAuthorization: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchProcedureRequired: true,
    singleCallCounterProcedureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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
