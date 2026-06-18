/**
 * Live LLM Synthetic Single-Call Contract (Phase 8.3L).
 *
 * Validates the Live LLM Synthetic Single-Call Contract input and produces a
 * `LiveLlmSyntheticSingleCallContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runLiveLlmSyntheticAuthorizationPlanning() (8.3K) and verify all
 *      prerequisite invariants.
 *   2. Build a synthetic contract input and validate it (must be accepted).
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
 * Invoke `runLiveLlmSyntheticSingleCallContract()` explicitly.
 */

import { runLiveLlmSyntheticAuthorizationPlanning } from "./run-live-llm-synthetic-authorization-planning";
import {
  FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_STRINGS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES,
} from "./live-llm-synthetic-single-call-contract-types";
import type {
  LiveLlmSyntheticSingleCallContractCheckResult,
  LiveLlmSyntheticSingleCallContractInput,
  LiveLlmSyntheticSingleCallContractResult,
  LiveLlmSyntheticSingleCallRejectionReason,
} from "./live-llm-synthetic-single-call-contract-types";

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
const UNSAFE_CONTRACT_PHRASES = [
  "post-run audit stored output", "live llm now authorized",
  "live llm call performed", "multiple live llm calls authorized",
  "general live llm runtime authorized", "single live llm call executed",
  "model output returned to user", "stored prompt", "stored completion",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_STRINGS.some((f) => value.includes(f));
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

function containsUnsafeContractPhrase(value: string): boolean {
  return UNSAFE_CONTRACT_PHRASES.some((p) => value.includes(p));
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
    value.includes("stored completion")
  );
}

function addReason(
  list: LiveLlmSyntheticSingleCallRejectionReason[],
  reason: LiveLlmSyntheticSingleCallRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `LiveLlmSyntheticSingleCallContractInput`.
 * Contract only — no live LLM call, no env read, no SDK import, no HTTP call,
 * no real input, no AI output, no persistence, no user-visible output.
 */
export function buildLiveLlmSyntheticSingleCallContractInput(): LiveLlmSyntheticSingleCallContractInput {
  const ackStatements =
    REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "live-llm-synthetic-single-call-contract-8-3l",
    epochId: "8.3L",
    previousPhaseId: "8.3K",

    authorizationPlanningReadyForSingleCallContract: true,

    scopes: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES],
    provider: "openai",
    model: "gpt_4o_mini",
    selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",
    promptPolicies: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES],
    executionGuards: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS],
    blockedPayloads: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS],
    postCallMetadata: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA],
    recheckRequirements: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST],

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchRequired: true,
    singleCallCounterRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    liveLLMCallPerformed: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,

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
    userVisibleOutputAuthorizedByContract: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorSingleCallContractAcknowledgment: ackStatements,
    reviewerSingleCallContractAcknowledgment: ackStatements,
    notes: ["live LLM synthetic single-call contract completed without live call"],

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
 * Validates a `LiveLlmSyntheticSingleCallContractInput` and returns a typed
 * `LiveLlmSyntheticSingleCallContractResult`.
 */
export function validateLiveLlmSyntheticSingleCallContractInput(
  input: LiveLlmSyntheticSingleCallContractInput,
): LiveLlmSyntheticSingleCallContractResult {
  const reasons: LiveLlmSyntheticSingleCallRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.authorizationPlanningReadyForSingleCallContract) {
    addReason(reasons, "authorization_planning_not_ready");
  }

  // ── Rule 2: scopes ────────────────────────────────────────────────────────
  for (const s of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES) {
    if (!input.scopes.includes(s)) {
      addReason(reasons, "missing_scope"); break;
    }
  }

  // ── Rules 3–5: provider / model / selected case ───────────────────────────
  if (input.provider !== "openai") {
    addReason(reasons, "invalid_provider");
  }
  if (input.model !== "gpt_4o_mini") {
    addReason(reasons, "invalid_model");
  }
  if (input.selectedSyntheticCase !== "synthetic_deadline_relative_missing_delivery_date") {
    addReason(reasons, "invalid_selected_synthetic_case");
  }

  // ── Rules 6–11: required list completeness ────────────────────────────────
  for (const p of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES) {
    if (!input.promptPolicies.includes(p)) {
      addReason(reasons, "missing_prompt_policy"); break;
    }
  }
  for (const g of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS) {
    if (!input.executionGuards.includes(g)) {
      addReason(reasons, "missing_execution_guard"); break;
    }
  }
  for (const b of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS) {
    if (!input.blockedPayloads.includes(b)) {
      addReason(reasons, "missing_blocked_payload"); break;
    }
  }
  for (const m of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA) {
    if (!input.postCallMetadata.includes(m)) {
      addReason(reasons, "missing_post_call_metadata"); break;
    }
  }
  for (const r of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS) {
    if (!input.recheckRequirements.includes(r)) {
      addReason(reasons, "missing_recheck_requirement"); break;
    }
  }
  for (const item of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }

  // ── Rule 12: contractOnly ─────────────────────────────────────────────────
  if (inputRec["contractOnly"] !== true) {
    addReason(reasons, "planning_attempted_live_llm_call");
  }

  // ── Rule 13: futureExecutionPlanRequired ──────────────────────────────────
  if (inputRec["futureExecutionPlanRequired"] !== true) {
    addReason(reasons, "missing_checklist_item");
  }

  // ── Rule 14: futureSingleLiveLlmSyntheticCallOnly ─────────────────────────
  if (inputRec["futureSingleLiveLlmSyntheticCallOnly"] !== true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 15: general/multiple runtime flags ───────────────────────────────
  if (inputRec["generalLiveLlmRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "planning_attempted_general_runtime_authorization");
  }
  if (inputRec["multipleLiveLlmCallsAllowed"] === true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 16: required true guard flags ───────────────────────────────────
  if (inputRec["providerAllowlisted"] !== true) {
    addReason(reasons, "invalid_provider");
  }
  if (inputRec["modelAllowlisted"] !== true) {
    addReason(reasons, "invalid_model");
  }
  if (inputRec["killSwitchRequired"] !== true) {
    addReason(reasons, "missing_kill_switch_guard");
  }
  if (inputRec["singleCallCounterRequired"] !== true) {
    addReason(reasons, "missing_single_call_counter_guard");
  }
  if (inputRec["postCallGovernanceRecheckRequired"] !== true) {
    addReason(reasons, "missing_post_call_governance_recheck");
  }
  if (inputRec["postCallAuditRequired"] !== true) {
    addReason(reasons, "missing_post_call_audit");
  }

  // ── Rule 17: contract self-execution flags ────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "planning_attempted_live_llm_call");
  }
  if (inputRec["envReadPerformed"] === true) {
    addReason(reasons, "planning_attempted_env_read");
  }
  if (inputRec["sdkImported"] === true) {
    addReason(reasons, "planning_attempted_sdk_import");
  }
  if (inputRec["httpCallMade"] === true) {
    addReason(reasons, "planning_attempted_http_call");
  }

  // ── Rule 18: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "planning_attempted_real_input_processing");
  }

  // ── Rule 19: real/raw/OCR/file/public input ───────────────────────────────
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

  // ── Rule 20: dependency flags ─────────────────────────────────────────────
  if (inputRec["branchCDependencyAllowed"] === true || inputRec["branchCCalled"] === true) {
    addReason(reasons, "planning_attempted_branch_c_dependency");
  }
  if (inputRec["runSmartTalkDependencyAllowed"] === true || inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_run_smart_talk_dependency");
  }
  if (inputRec["ocrRuntimeDependencyAllowed"] === true || inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_ocr_runtime_dependency");
  }

  // ── Rules 21–23: AI output / persistence / public ─────────────────────────
  if (inputRec["aiOutputGenerationPerformed"] === true || inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "planning_attempted_ai_output_generation");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "planning_attempted_model_output_storage");
  }
  if (inputRec["userVisibleOutputEmitted"] === true || inputRec["userVisibleOutputAuthorizedByContract"] === true) {
    addReason(reasons, "planning_attempted_user_visible_output");
  }
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "planning_attempted_persistence");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "planning_attempted_public_runtime");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "planning_attempted_real_operator_pilot");
  }

  // ── Rule 24: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorSingleCallContractAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerSingleCallContractAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
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
    input.contractId,
    input.operatorSingleCallContractAcknowledgment,
    input.reviewerSingleCallContractAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      if (containsUnsafeContractPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      const hasUncategorised = FORBIDDEN_LIVE_LLM_SYNTHETIC_SINGLE_CALL_STRINGS.some(
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
          !containsUnsafeContractPhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (hasUncategorised) addReason(reasons, "unsafe_contract_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
    if (containsUnsafeContractPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  return {
    contractId: input.contractId,
    epochId: "8.3L",
    status: accepted ? "valid" : "rejected",
    accepted,
    rejectionReasons: reasons,

    safeSingleCallContractMetadata: {
      scopeCount: input.scopes.length,
      provider: input.provider,
      model: input.model,
      selectedSyntheticCase: input.selectedSyntheticCase,
      promptPolicyCount: input.promptPolicies.length,
      executionGuardCount: input.executionGuards.length,
      blockedPayloadCount: input.blockedPayloads.length,
      postCallMetadataCount: input.postCallMetadata.length,
      recheckRequirementCount: input.recheckRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForLiveLlmSyntheticSingleCallExecutionPlan: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchRequired: true,
    singleCallCounterRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    liveLLMCalled: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,
    apiRouteCalled: false,

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
    userVisibleOutputAuthorizedByContract: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByContract: false,
    existingRuntimeModifiedByContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByContract: false,
    neverUserVisible: true,
  };
}

// ── Single-call contract check ────────────────────────────────────────────────

/**
 * Runs the Live LLM Synthetic Single-Call Contract check for Phase 8.3L.
 *
 * Calls `runLiveLlmSyntheticAuthorizationPlanning()` (8.3K), builds and
 * validates a synthetic safe contract input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT read env. Does NOT import any SDK.
 * Does NOT produce real AI output. Does NOT emit user-visible output.
 * Does NOT modify DB/storage. Does NOT authorize general live LLM runtime.
 */
export function runLiveLlmSyntheticSingleCallContract(): LiveLlmSyntheticSingleCallContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3K authorization planning ────────────────────────────

  const planningResult = runLiveLlmSyntheticAuthorizationPlanning();
  const planningRec = asRec(planningResult);

  const authorizationPlanningReady =
    planningResult.allPassed === true &&
    planningRec["readyForLiveLlmSyntheticSingleCallContract"] === true &&
    planningRec["readyForLiveLLMRuntime"] !== true &&
    planningRec["readyForConnectedAiRuntimeExecution"] !== true &&
    planningRec["readyForRealOperatorPilotRun"] !== true &&
    planningRec["readyForPilotRunNow"] !== true &&
    planningRec["readyForPublicLaunch"] !== true &&
    planningRec["readyForPersistence"] !== true &&
    planningRec["planningOnly"] === true &&
    planningRec["futureSingleSyntheticCallOnly"] === true &&
    planningRec["generalLiveLlmRuntimeAuthorizationAllowed"] !== true &&
    planningRec["multipleLiveLlmCallsAllowed"] !== true &&
    planningRec["providerAllowlistRequired"] === true &&
    planningRec["modelAllowlistRequired"] === true &&
    planningRec["killSwitchRequired"] === true &&
    planningRec["postCallGovernanceRecheckRequired"] === true &&
    planningRec["postCallAuditRequired"] === true &&
    planningRec["liveLLMCalled"] !== true &&
    planningRec["envReadPerformed"] !== true &&
    planningRec["sdkImported"] !== true &&
    planningRec["httpCallMade"] !== true &&
    planningRec["syntheticInputOnly"] === true &&
    planningRec["realUserInputAllowed"] !== true &&
    planningRec["rawInputAllowed"] !== true &&
    planningRec["realRedactedInputAllowed"] !== true &&
    planningRec["photoOrOcrInputAllowed"] !== true &&
    planningRec["fileUploadInputAllowed"] !== true &&
    planningRec["publicAnonymousInputAllowed"] !== true &&
    planningRec["branchCDependencyAllowed"] !== true &&
    planningRec["runSmartTalkDependencyAllowed"] !== true &&
    planningRec["ocrRuntimeDependencyAllowed"] !== true &&
    planningRec["branchCCalled"] !== true &&
    planningRec["runSmartTalkCalledOrImported"] !== true &&
    planningRec["extractTextFromImageCalledOrImported"] !== true &&
    planningRec["aiOutputGenerated"] !== true &&
    planningRec["modelOutputStored"] !== true &&
    planningRec["userVisibleOutputEmitted"] !== true &&
    planningRec["persistenceUsed"] !== true &&
    planningRec["publicRuntimeEnabled"] !== true &&
    planningRec["realOperatorPilotExecuted"] !== true &&
    planningRec["neverUserVisible"] === true;

  notes.push(`authorizationPlanningReady: ${String(authorizationPlanningReady)}`);
  notes.push(`planningResult.allPassed: ${String(planningResult.allPassed)}`);
  notes.push(`readyForLiveLlmSyntheticSingleCallContract: ${String(planningRec["readyForLiveLlmSyntheticSingleCallContract"])}`);

  // ── Step 2: Validate the contract input ───────────────────────────────────

  const contractInput = buildLiveLlmSyntheticSingleCallContractInput();
  const contractResult = validateLiveLlmSyntheticSingleCallContractInput(contractInput);
  const contractAccepted = contractResult.accepted;

  notes.push(`contractAccepted: ${String(contractAccepted)}`);
  notes.push(`contractStatus: ${contractResult.status}`);
  if (!contractResult.accepted) {
    notes.push(`rejectionReasons: ${contractResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof LiveLlmSyntheticSingleCallContractInput]: LiveLlmSyntheticSingleCallContractInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): LiveLlmSyntheticSingleCallContractResult {
    return validateLiveLlmSyntheticSingleCallContractInput({
      ...contractInput,
      ...overrides,
    } as LiveLlmSyntheticSingleCallContractInput);
  }

  const partialScopes = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_SCOPES.length - 1,
  );
  const partialPrompts = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_PROMPT_POLICIES.length - 1,
  );
  const partialGuards = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_EXECUTION_GUARDS.length - 1,
  );
  const partialBlocked = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_BLOCKED_PAYLOADS.length - 1,
  );
  const partialMeta = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_POST_CALL_METADATA.length - 1,
  );
  const partialRecheck = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_RECHECK_REQUIREMENTS.length - 1,
  );
  const partialChecklist = REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST.slice(
    0, REQUIRED_LIVE_LLM_SYNTHETIC_SINGLE_CALL_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{ label: string; result: LiveLlmSyntheticSingleCallContractResult }> = [
    // 1. authorizationPlanningReadyForSingleCallContract false
    { label: "authorizationPlanningReady=false", result: tamper({ authorizationPlanningReadyForSingleCallContract: false }) },
    // 2. missing scope
    { label: "missing scope", result: tamper({ scopes: partialScopes }) },
    // 3. invalid provider
    { label: "invalid provider", result: tamper({ provider: "invalid" as unknown as "openai" }) },
    // 4. invalid model
    { label: "invalid model", result: tamper({ model: "gpt_4_turbo" as unknown as "gpt_4o_mini" }) },
    // 5. invalid selectedSyntheticCase
    { label: "invalid selectedSyntheticCase", result: tamper({ selectedSyntheticCase: "synthetic_safe_low_risk_payment_notice" as unknown as "synthetic_deadline_relative_missing_delivery_date" }) },
    // 6. missing prompt policy
    { label: "missing prompt policy", result: tamper({ promptPolicies: partialPrompts }) },
    // 7. missing execution guard
    { label: "missing execution guard", result: tamper({ executionGuards: partialGuards }) },
    // 8. missing blocked payload
    { label: "missing blocked payload", result: tamper({ blockedPayloads: partialBlocked }) },
    // 9. missing post-call metadata
    { label: "missing post-call metadata", result: tamper({ postCallMetadata: partialMeta }) },
    // 10. missing recheck requirement
    { label: "missing recheck requirement", result: tamper({ recheckRequirements: partialRecheck }) },
    // 11. missing checklist item
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 12. contractOnly false
    { label: "contractOnly=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, contractOnly: false as unknown as true }) },
    // 13. futureExecutionPlanRequired false
    { label: "futureExecutionPlanRequired=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, futureExecutionPlanRequired: false as unknown as true }) },
    // 14. futureSingleLiveLlmSyntheticCallOnly false
    { label: "futureSingleLiveLlmSyntheticCallOnly=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, futureSingleLiveLlmSyntheticCallOnly: false as unknown as true }) },
    // 15. generalLiveLlmRuntimeAuthorizationAllowed true
    { label: "generalLiveLlmRuntimeAuthorizationAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, generalLiveLlmRuntimeAuthorizationAllowed: true as unknown as false }) },
    // 16. multipleLiveLlmCallsAllowed true
    { label: "multipleLiveLlmCallsAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, multipleLiveLlmCallsAllowed: true as unknown as false }) },
    // 17. providerAllowlisted false
    { label: "providerAllowlisted=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, providerAllowlisted: false as unknown as true }) },
    // 18. modelAllowlisted false
    { label: "modelAllowlisted=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, modelAllowlisted: false as unknown as true }) },
    // 19. killSwitchRequired false
    { label: "killSwitchRequired=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, killSwitchRequired: false as unknown as true }) },
    // 20. singleCallCounterRequired false
    { label: "singleCallCounterRequired=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, singleCallCounterRequired: false as unknown as true }) },
    // 21. postCallGovernanceRecheckRequired false
    { label: "postCallGovernanceRecheckRequired=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, postCallGovernanceRecheckRequired: false as unknown as true }) },
    // 22. postCallAuditRequired false
    { label: "postCallAuditRequired=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, postCallAuditRequired: false as unknown as true }) },
    // 23. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, liveLLMCallPerformed: true as unknown as false }) },
    // 24. envReadPerformed true
    { label: "envReadPerformed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, envReadPerformed: true as unknown as false }) },
    // 25. sdkImported true
    { label: "sdkImported=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, sdkImported: true as unknown as false }) },
    // 26. httpCallMade true
    { label: "httpCallMade=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, httpCallMade: true as unknown as false }) },
    // 27. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, syntheticInputOnly: false as unknown as true }) },
    // 28. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, realUserInputAllowed: true as unknown as false }) },
    // 29. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, rawInputAllowed: true as unknown as false }) },
    // 30. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, realRedactedInputAllowed: true as unknown as false }) },
    // 31. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 32. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, fileUploadInputAllowed: true as unknown as false }) },
    // 33. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 34. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, branchCDependencyAllowed: true as unknown as false }) },
    // 35. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 36. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 37. branchCCalled true
    { label: "branchCCalled=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, branchCCalled: true as unknown as false }) },
    // 38. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 39. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 40. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 41. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, aiOutputGenerated: true as unknown as false }) },
    // 42. modelOutputStored true
    { label: "modelOutputStored=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, modelOutputStored: true as unknown as false }) },
    // 43. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 44. userVisibleOutputAuthorizedByContract true
    { label: "userVisibleOutputAuthorizedByContract=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, userVisibleOutputAuthorizedByContract: true as unknown as false }) },
    // 45. persistenceUsed true
    { label: "persistenceUsed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, persistenceUsed: true as unknown as false }) },
    // 46. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, dnaSavePerformed: true as unknown as false }) },
    // 47. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, offlineSavePerformed: true as unknown as false }) },
    // 48. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, publicRuntimeEnabled: true as unknown as false }) },
    // 49. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 50. missing operator ack
    { label: "missing operator ack", result: tamper({ operatorSingleCallContractAcknowledgment: "partial" }) },
    // 51. missing reviewer ack
    { label: "missing reviewer ack", result: tamper({ reviewerSingleCallContractAcknowledgment: "partial" }) },
    // 52. containsSecret true
    { label: "containsSecret=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsSecret: true as unknown as false }) },
    // 53. containsEnvValue true
    { label: "containsEnvValue=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsEnvValue: true as unknown as false }) },
    // 54. containsApiKey true
    { label: "containsApiKey=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsApiKey: true as unknown as false }) },
    // 55. containsRawInputText true
    { label: "containsRawInputText=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsRawInputText: true as unknown as false }) },
    // 56. containsRedactedText true
    { label: "containsRedactedText=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsRedactedText: true as unknown as false }) },
    // 57. containsModelOutput true
    { label: "containsModelOutput=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsModelOutput: true as unknown as false }) },
    // 58. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsDocumentContent: true as unknown as false }) },
    // 59. containsUserPii true
    { label: "containsUserPii=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsUserPii: true as unknown as false }) },
    // 60. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateLiveLlmSyntheticSingleCallContractInput({ ...contractInput, containsRealUserInput: true as unknown as false }) },
    // 61–91: notes with forbidden strings
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

  const allPassed = authorizationPlanningReady && contractAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3L",
    allPassed,
    authorizationPlanningReadyForSingleCallContract: authorizationPlanningReady,
    liveLlmSyntheticSingleCallContractAccepted: contractAccepted,
    tamperCasesRejected,

    readyForLiveLlmSyntheticSingleCallExecutionPlan: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureSingleLiveLlmSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlisted: true,
    modelAllowlisted: true,
    killSwitchRequired: true,
    singleCallCounterRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    liveLLMCalled: false,
    envReadPerformed: false,
    sdkImported: false,
    httpCallMade: false,

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
