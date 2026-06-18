/**
 * Additional Synthetic Live LLM Case Contract (Phase 8.3S).
 *
 * A contract-only layer that defines the requirements for executing exactly one
 * future synthetic live LLM call for `synthetic_explicit_payment_deadline`.
 * Builds on Phase 8.3R (Synthetic Live LLM Pilot Expansion Planning).
 *
 * What this module does:
 *   1. Verifies Phase 8.3R expansion planning result via dependency call.
 *   2. Defines the selected case, provider, model, risk classes, prompt
 *      policies, and expected behaviors for a future execution plan.
 *   3. Enforces that an execution plan AND dry-run authorization are required
 *      before any live call may be attempted.
 *   4. Validates all contract safety invariants.
 *   5. Runs tamper cases without making extra live calls.
 *
 * What this module does NOT do:
 *   - Does NOT call OpenAI or any live LLM (`liveLLMCalledInContract: false`)
 *   - Does NOT call fetch()
 *   - Does NOT read process.env
 *   - Does NOT import any LLM SDK
 *   - Does NOT process real input
 *   - Does NOT authorize real payment notices, invoices, or Mahnungen
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Does NOT call Branch C, run-smart-talk.ts, or OCR runtime
 *   - Does NOT auto-execute at module load
 *
 * ISOLATION NOTE:
 *   This module does NOT import, call, or wrap:
 *   - lib/vaylo/smart-talk/run-smart-talk.ts
 *   - lib/vaylo/smart-talk/extract-text-from-image.ts
 *   - app/api/smart-talk/route.ts
 *   - any LLM SDK
 *
 * NOTE: Calling `runAdditionalSyntheticLiveLlmCaseContract()` invokes
 * `runSyntheticLiveLlmPilotExpansionPlanning()` (8.3R) → `runPostCallAudit()`
 * (8.3Q) → the full 8.3P/8.3O chain. This may cause one live OpenAI call when
 * OPENAI_API_KEY is present. Phase 8.3S itself contains NO fetch(), no
 * process.env read, and no direct OpenAI call.
 */

import { runSyntheticLiveLlmPilotExpansionPlanning } from "./run-synthetic-live-llm-pilot-expansion-planning";
import {
  FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_STRINGS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES,
} from "./additional-synthetic-live-llm-case-contract-types";
import type {
  AdditionalSyntheticLiveLlmCaseContractCheckResult,
  AdditionalSyntheticLiveLlmCaseContractInput,
  AdditionalSyntheticLiveLlmCaseContractRejectionReason,
  AdditionalSyntheticLiveLlmCaseContractResult,
} from "./additional-synthetic-live-llm-case-contract-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SENSITIVE_PERSONAL_MARKERS = ["Name:", "Adresse:", "Geburtsdatum:", "Kind:"];
const HIGH_RISK_LEGAL_MARKERS = ["Abschiebung", "Kündigung", "Mietvertrag"];
const AUTHORITY_DOCUMENT_MARKERS = ["Sehr geehrter", "Aktenzeichen", "IBAN", "Steuer-ID", "BG-Nr"];
const UNSAFE_CERTAINTY_PHRASES = [
  "Sie müssen",
  "garantiert",
  "fristlos sicher",
  "rechtlich sicher",
  "Zahlungspflicht sicher",
  "you must pay",
  "payment legally required",
];
const UNSAFE_GLOBAL_AUTH_PHRASES = [
  "public launch enabled",
  "all outputs authorized",
  "global approval",
  "branch c authorized",
  "approved for user display",
  "auto-approved",
  "show to user now",
  "authorized public runtime",
  "real user output approved",
  "public runtime ready",
  "real input pilot ready",
  "user visible output ready",
  "real document input ready",
  "synthetic outputs approved for users",
  "production live runtime ready",
  "public payment runtime ready",
  "real document payment test ready",
];
const UNSAFE_REAL_INPUT_PHRASES = [
  "real user document",
  "real OCR text",
  "production runtime enabled",
  "real payment notice",
  "real invoice",
  "real Mahnung",
];
const UNSAFE_LIVE_EXEC_PHRASES = [
  "harness executed with live llm",
  "live llm executed",
  "real operator pilot executed",
  "real model output",
  "second live llm call",
  "additional live calls executed",
];
const UNSAFE_EXECUTION_PHRASES = [
  "post-run audit stored output",
  "live llm now authorized",
  "multiple live llm calls authorized",
  "general live llm runtime authorized",
  "model output returned to user",
  "stored prompt",
  "stored completion",
  "prompt text logged",
  "model output logged",
  "model output reviewed",
  "prompt reviewed",
  "audit persisted",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_STRINGS.some((f) =>
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

function containsUnsafeExecutionPhrase(value: string): boolean {
  return UNSAFE_EXECUTION_PHRASES.some((p) => value.includes(p));
}

function containsSecretLike(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    value.includes("sk-") ||
    value.includes("apiKey:") ||
    value.includes("Authorization: Bearer") ||
    lower.includes("secret") ||
    lower.includes("token") ||
    lower.includes("password")
  );
}

function containsEnvAssignmentLike(value: string): boolean {
  return (
    value.includes("process.env.OPENAI_API_KEY") ||
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
    value.includes("model output logged") ||
    value.includes("model output reviewed")
  );
}

function addReason(
  list: AdditionalSyntheticLiveLlmCaseContractRejectionReason[],
  reason: AdditionalSyntheticLiveLlmCaseContractRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds an `AdditionalSyntheticLiveLlmCaseContractInput` representing
 * the contract for `synthetic_explicit_payment_deadline`.
 *
 * Default params represent the successful contract path.
 * When `expansionPlanningReady: false`, the validator returns "blocked".
 */
export function buildAdditionalSyntheticLiveLlmCaseContractInput(params?: {
  readonly expansionPlanningReady?: boolean;
}): AdditionalSyntheticLiveLlmCaseContractInput {
  const planningReady = params?.expansionPlanningReady ?? true;
  const ackStatements =
    REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "additional-synthetic-live-llm-case-contract-8-3s",
    epochId: "8.3S",
    previousPhaseId: "8.3R",

    expansionPlanningReadyForAdditionalCaseContract: planningReady,

    scopes: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES],
    selectedCase: "synthetic_explicit_payment_deadline",
    provider: "openai",
    model: "gpt_4o_mini",
    riskClasses: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES],
    promptPolicies: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES],
    expectedBehaviors: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS],
    requirements: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS],
    blockers: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS],
    checklistConfirmed: [...REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST],

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInContract: false,
    additionalLiveLLMCallsExecuted: false,

    readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: true,
    selectedSyntheticCaseContractAccepted: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    promptTextAvailableInContract: false,
    modelOutputAvailableInContract: false,
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

    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorAdditionalCaseContractAcknowledgment: ackStatements,
    reviewerAdditionalCaseContractAcknowledgment: ackStatements,
    notes: [
      "additional synthetic live LLM case contract accepted for explicit payment deadline",
      "real document payment testing remains unauthorized",
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
  } as AdditionalSyntheticLiveLlmCaseContractInput;
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `AdditionalSyntheticLiveLlmCaseContractInput`.
 *
 * Status:
 * - "accepted" — all invariants pass
 * - "blocked"  — only expansion_planning_not_ready
 * - "rejected" — any other violation
 */
export function validateAdditionalSyntheticLiveLlmCaseContractInput(
  input: AdditionalSyntheticLiveLlmCaseContractInput,
): AdditionalSyntheticLiveLlmCaseContractResult {
  const reasons: AdditionalSyntheticLiveLlmCaseContractRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.expansionPlanningReadyForAdditionalCaseContract) {
    addReason(reasons, "expansion_planning_not_ready");
  }

  // ── Rule 2: required list completeness ────────────────────────────────────
  for (const s of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES) {
    if (!input.scopes.includes(s)) { addReason(reasons, "missing_contract_scope"); break; }
  }
  for (const r of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES) {
    if (!input.riskClasses.includes(r)) { addReason(reasons, "missing_risk_class"); break; }
  }
  for (const p of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES) {
    if (!input.promptPolicies.includes(p)) { addReason(reasons, "missing_prompt_policy"); break; }
  }
  for (const b of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS) {
    if (!input.expectedBehaviors.includes(b)) { addReason(reasons, "missing_expected_behavior"); break; }
  }
  for (const r of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS) {
    if (!input.requirements.includes(r)) { addReason(reasons, "missing_requirement"); break; }
  }
  for (const b of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS) {
    if (!input.blockers.includes(b)) { addReason(reasons, "missing_blocker"); break; }
  }
  for (const c of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST) {
    if (!input.checklistConfirmed.includes(c)) { addReason(reasons, "missing_checklist_item"); break; }
  }

  // ── Rules 3–5: selected case / provider / model ───────────────────────────
  if (input.selectedCase !== "synthetic_explicit_payment_deadline") {
    addReason(reasons, "selected_case_invalid");
  }
  if (input.provider !== "openai") addReason(reasons, "provider_invalid");
  if (input.model !== "gpt_4o_mini") addReason(reasons, "model_invalid");

  // ── Rule 6: contractOnly ──────────────────────────────────────────────────
  if (inputRec["contractOnly"] !== true) addReason(reasons, "unsafe_contract_note_detected");

  // ── Rule 7: futureExecutionPlanRequired ───────────────────────────────────
  if (inputRec["futureExecutionPlanRequired"] !== true) {
    addReason(reasons, "future_execution_plan_missing");
  }

  // ── Rule 8: futureDryRunAuthorizationRequired ─────────────────────────────
  if (inputRec["futureDryRunAuthorizationRequired"] !== true) {
    addReason(reasons, "future_dry_run_authorization_missing");
  }

  // ── Rule 9: oneFutureLiveLlmCallOnly ─────────────────────────────────────
  if (inputRec["oneFutureLiveLlmCallOnly"] !== true) {
    addReason(reasons, "one_future_call_limit_missing");
  }

  // ── Rule 10: killSwitchRequiredForFutureCall ──────────────────────────────
  if (inputRec["killSwitchRequiredForFutureCall"] !== true) {
    addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Rule 11: singleCallCounterRequiredForFutureCall ───────────────────────
  if (inputRec["singleCallCounterRequiredForFutureCall"] !== true) {
    addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Rule 12: liveLLMCalledInContract ──────────────────────────────────────
  if (inputRec["liveLLMCalledInContract"] === true) {
    addReason(reasons, "contract_attempted_live_call");
  }

  // ── Rule 13: additionalLiveLLMCallsExecuted ───────────────────────────────
  if (inputRec["additionalLiveLLMCallsExecuted"] === true) {
    addReason(reasons, "contract_attempted_live_call");
  }

  // ── Rule 14: positive gates must be true ──────────────────────────────────
  if (inputRec["readyForAdditionalSyntheticLiveLlmCaseExecutionPlan"] !== true) {
    addReason(reasons, "unsafe_contract_note_detected");
  }
  if (inputRec["selectedSyntheticCaseContractAccepted"] !== true) {
    addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Rule 15: dangerous readiness flags must be false ─────────────────────
  if (inputRec["readyForLiveLLMRuntime"] === true) {
    addReason(reasons, "general_live_llm_runtime_authorized");
  }
  if (inputRec["readyForPublicLaunch"] === true) addReason(reasons, "public_runtime_detected");
  if (inputRec["readyForRealDocumentInput"] === true) {
    addReason(reasons, "real_document_input_authorized");
  }
  if (inputRec["readyForUserVisibleOutput"] === true) {
    addReason(reasons, "user_visible_output_detected");
  }
  if (
    inputRec["readyForConnectedAiRuntimeExecution"] === true ||
    inputRec["readyForRealOperatorPilotRun"] === true ||
    inputRec["readyForPilotRunNow"] === true ||
    inputRec["readyForPersistence"] === true
  ) {
    addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Rule 16: prompt/model output ─────────────────────────────────────────
  if (inputRec["promptTextAvailableInContract"] === true) {
    addReason(reasons, "prompt_text_available");
  }
  if (inputRec["modelOutputAvailableInContract"] === true) {
    addReason(reasons, "model_output_available");
  }
  if (inputRec["promptTextLogged"] === true || inputRec["modelOutputLogged"] === true) {
    addReason(reasons, "prompt_or_model_output_logged");
  }

  // ── Rule 17: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) addReason(reasons, "real_input_detected");

  // ── Rule 18: real/raw/redacted/OCR/file/public ────────────────────────────
  if (inputRec["realUserInputAllowed"] === true || inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "real_input_detected");
  }
  if (inputRec["rawInputAllowed"] === true || inputRec["containsRawInputText"] === true) {
    addReason(reasons, "raw_input_detected");
  }
  if (inputRec["realRedactedInputAllowed"] === true || inputRec["containsRedactedText"] === true) {
    addReason(reasons, "redacted_real_input_detected");
  }
  if (inputRec["photoOrOcrInputAllowed"] === true || inputRec["fileUploadInputAllowed"] === true) {
    addReason(reasons, "ocr_photo_file_input_detected");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) addReason(reasons, "public_request_detected");

  // ── Rule 19: Branch C / runSmartTalk / OCR ───────────────────────────────
  if (inputRec["branchCDependencyAllowed"] === true || inputRec["branchCCalled"] === true) {
    addReason(reasons, "branch_c_dependency_detected");
  }
  if (
    inputRec["runSmartTalkDependencyAllowed"] === true ||
    inputRec["runSmartTalkCalledOrImported"] === true
  ) {
    addReason(reasons, "run_smart_talk_dependency_detected");
  }
  if (
    inputRec["ocrRuntimeDependencyAllowed"] === true ||
    inputRec["extractTextFromImageCalledOrImported"] === true
  ) {
    addReason(reasons, "ocr_runtime_dependency_detected");
  }

  // ── Rule 20: user-visible output ──────────────────────────────────────────
  if (inputRec["userVisibleOutputEmitted"] === true) {
    addReason(reasons, "user_visible_output_detected");
  }

  // ── Rule 21: persistence / public / pilot ─────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "persistence_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) addReason(reasons, "public_runtime_detected");
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "real_operator_pilot_authorized");
  }

  // ── Rule 22: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorAdditionalCaseContractAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerAdditionalCaseContractAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 23: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 24–25: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorAdditionalCaseContractAcknowledgment,
    input.reviewerAdditionalCaseContractAcknowledgment,
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
      if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
      const hasUncategorised = FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_STRINGS.some(
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
          !containsUnsafeExecutionPhrase(s) &&
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
    if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_contract_note_detected");
  }

  // ── Determine status ──────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const isBlocked =
    !accepted &&
    reasons.length === 1 &&
    reasons[0] === "expansion_planning_not_ready";

  const status: AdditionalSyntheticLiveLlmCaseContractResult["status"] = accepted
    ? "accepted"
    : isBlocked
      ? "blocked"
      : "rejected";

  return {
    contractId: input.contractId,
    epochId: "8.3S",
    status,
    accepted,
    rejectionReasons: reasons,

    safeAdditionalCaseContractMetadata: {
      scopeCount: input.scopes.length,
      selectedCase: "synthetic_explicit_payment_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      riskClassCount: input.riskClasses.length,
      promptPolicyCount: input.promptPolicies.length,
      expectedBehaviorCount: input.expectedBehaviors.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      contractOnly: true,
      oneFutureLiveLlmCallOnly: true,
    },

    readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: accepted,
    selectedSyntheticCaseContractAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInContract: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextAvailableInContract: false,
    modelOutputAvailableInContract: false,
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

    userVisibleOutputEmitted: false,
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

// ── Main contract function ────────────────────────────────────────────────────

/**
 * Runs the Additional Synthetic Live LLM Case Contract for Phase 8.3S.
 *
 * 1. Calls runSyntheticLiveLlmPilotExpansionPlanning() (8.3R) as dependency.
 *    NOTE: This may trigger the full chain including one live OpenAI call when
 *    OPENAI_API_KEY is present. 8.3S itself contains no fetch(), no
 *    process.env read, and no direct OpenAI call.
 * 2. Verifies all 8.3R safety invariants.
 * 3. Builds and validates the contract input.
 * 4. Runs tamper cases without making extra live calls.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export async function runAdditionalSyntheticLiveLlmCaseContract(): Promise<AdditionalSyntheticLiveLlmCaseContractCheckResult> {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3R expansion planning result ─────────────────────────

  const planningResult = await runSyntheticLiveLlmPilotExpansionPlanning();
  const planningRec = asRec(planningResult);

  const planningReady =
    planningResult.allPassed === true &&
    planningRec["readyForAdditionalSyntheticLiveLlmCaseContract"] === true &&
    planningRec["readyForSyntheticPilotCaseSetDesign"] === true &&
    planningRec["readyForLiveLLMRuntime"] !== true &&
    planningRec["readyForConnectedAiRuntimeExecution"] !== true &&
    planningRec["readyForRealOperatorPilotRun"] !== true &&
    planningRec["readyForPilotRunNow"] !== true &&
    planningRec["readyForPublicLaunch"] !== true &&
    planningRec["readyForPersistence"] !== true &&
    planningRec["readyForRealDocumentInput"] !== true &&
    planningRec["readyForUserVisibleOutput"] !== true &&
    planningRec["metadataOnlyPlanning"] === true &&
    planningRec["syntheticOnlyExpansion"] === true &&
    planningRec["additionalCaseContractRequired"] === true &&
    planningRec["liveLLMCalledAgain"] !== true &&
    planningRec["additionalLiveLLMCallsExecuted"] !== true &&
    planningRec["promptTextAvailableForPlanning"] !== true &&
    planningRec["modelOutputAvailableForPlanning"] !== true &&
    planningRec["promptTextLogged"] !== true &&
    planningRec["modelOutputLogged"] !== true &&
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
    planningRec["userVisibleOutputEmitted"] !== true &&
    planningRec["persistenceUsed"] !== true &&
    planningRec["publicRuntimeEnabled"] !== true &&
    planningRec["realOperatorPilotExecuted"] !== true &&
    planningRec["neverUserVisible"] === true;

  notes.push(`planningReady: ${String(planningReady)}`);
  notes.push(`planningResult.allPassed: ${String(planningResult.allPassed)}`);
  notes.push(
    `readyForAdditionalCaseContract: ${String(planningRec["readyForAdditionalSyntheticLiveLlmCaseContract"])}`,
  );

  // ── Step 2/3: Build and validate contract input ───────────────────────────

  let contractInput: AdditionalSyntheticLiveLlmCaseContractInput;

  if (!planningReady) {
    notes.push("expansion planning prerequisite failed — building blocked contract input");
    contractInput = buildAdditionalSyntheticLiveLlmCaseContractInput({
      expansionPlanningReady: false,
    });
  } else {
    contractInput = buildAdditionalSyntheticLiveLlmCaseContractInput({
      expansionPlanningReady: true,
    });
  }

  const contractResult = validateAdditionalSyntheticLiveLlmCaseContractInput(contractInput);
  const contractAccepted = contractResult.accepted;

  notes.push(`contractAccepted: ${String(contractAccepted)}`);
  notes.push(`contractStatus: ${contractResult.status}`);
  if (!contractResult.accepted) {
    notes.push(`rejectionReasons: ${contractResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 4: Tamper cases — local validator only, NO extra live calls ───────

  const tamperBase = buildAdditionalSyntheticLiveLlmCaseContractInput({
    expansionPlanningReady: true,
  });

  type MutableInput = {
    -readonly [K in keyof AdditionalSyntheticLiveLlmCaseContractInput]: AdditionalSyntheticLiveLlmCaseContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AdditionalSyntheticLiveLlmCaseContractResult {
    return validateAdditionalSyntheticLiveLlmCaseContractInput({
      ...tamperBase,
      ...overrides,
    } as AdditionalSyntheticLiveLlmCaseContractInput);
  }

  const partialScopes = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CONTRACT_SCOPES.length - 1,
  );
  const partialRisk = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_RISK_CLASSES.length - 1,
  );
  const partialPrompt = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_POLICIES.length - 1,
  );
  const partialBehaviors = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXPECTED_BEHAVIORS.length - 1,
  );
  const partialReqs = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_REQUIREMENTS.length - 1,
  );
  const partialBlockers = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_BLOCKERS.length - 1,
  );
  const partialChecklist = REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST.slice(
    0, REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{
    label: string;
    result: AdditionalSyntheticLiveLlmCaseContractResult;
  }> = [
    // 1. planningReady false
    { label: "planningReady=false", result: tamper({ expansionPlanningReadyForAdditionalCaseContract: false }) },
    // 2. missing scope
    { label: "missing scope", result: tamper({ scopes: partialScopes }) },
    // 3. missing risk class
    { label: "missing risk class", result: tamper({ riskClasses: partialRisk }) },
    // 4. missing prompt policy
    { label: "missing prompt policy", result: tamper({ promptPolicies: partialPrompt }) },
    // 5. missing expected behavior
    { label: "missing expected behavior", result: tamper({ expectedBehaviors: partialBehaviors }) },
    // 6. missing requirement
    { label: "missing requirement", result: tamper({ requirements: partialReqs }) },
    // 7. missing blocker
    { label: "missing blocker", result: tamper({ blockers: partialBlockers }) },
    // 8. missing checklist
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 9. wrong selectedCase
    {
      label: "wrong selectedCase",
      result: tamper({
        selectedCase: "synthetic_deadline_relative_missing_delivery_date" as unknown as "synthetic_explicit_payment_deadline",
      }),
    },
    // 10. wrong provider
    { label: "wrong provider", result: tamper({ provider: "anthropic" as unknown as "openai" }) },
    // 11. wrong model
    { label: "wrong model", result: tamper({ model: "gpt_4" as unknown as "gpt_4o_mini" }) },
    // 12. contractOnly false
    {
      label: "contractOnly=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        contractOnly: false as unknown as true,
      }),
    },
    // 13. futureExecutionPlanRequired false
    {
      label: "futureExecutionPlanRequired=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        futureExecutionPlanRequired: false as unknown as true,
      }),
    },
    // 14. futureDryRunAuthorizationRequired false
    {
      label: "futureDryRunAuthorizationRequired=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        futureDryRunAuthorizationRequired: false as unknown as true,
      }),
    },
    // 15. oneFutureLiveLlmCallOnly false
    {
      label: "oneFutureLiveLlmCallOnly=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        oneFutureLiveLlmCallOnly: false as unknown as true,
      }),
    },
    // 16. killSwitchRequiredForFutureCall false
    {
      label: "killSwitchRequired=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        killSwitchRequiredForFutureCall: false as unknown as true,
      }),
    },
    // 17. singleCallCounterRequired false
    {
      label: "singleCallCounterRequired=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        singleCallCounterRequiredForFutureCall: false as unknown as true,
      }),
    },
    // 18. liveLLMCalledInContract true
    {
      label: "liveLLMCalledInContract=true",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        liveLLMCalledInContract: true as unknown as false,
      }),
    },
    // 19. additionalLiveLLMCallsExecuted true
    {
      label: "additionalLiveLLMCallsExecuted=true",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        additionalLiveLLMCallsExecuted: true as unknown as false,
      }),
    },
    // 20. readyForAdditionalCaseExecutionPlan false
    {
      label: "readyForAdditionalCaseExecutionPlan=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: false as unknown as true,
      }),
    },
    // 21. selectedSyntheticCaseContractAccepted false
    {
      label: "selectedSyntheticCaseContractAccepted=false",
      result: validateAdditionalSyntheticLiveLlmCaseContractInput({
        ...tamperBase,
        selectedSyntheticCaseContractAccepted: false as unknown as true,
      }),
    },
    // 22-29: dangerous readiness true
    { label: "readyForLiveLLMRuntime=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForLiveLLMRuntime: true as unknown as false }) },
    { label: "readyForConnectedAi=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForConnectedAiRuntimeExecution: true as unknown as false }) },
    { label: "readyForRealOperatorPilot=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForRealOperatorPilotRun: true as unknown as false }) },
    { label: "readyForPilotRunNow=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForPilotRunNow: true as unknown as false }) },
    { label: "readyForPublicLaunch=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForPublicLaunch: true as unknown as false }) },
    { label: "readyForPersistence=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForPersistence: true as unknown as false }) },
    { label: "readyForRealDocumentInput=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForRealDocumentInput: true as unknown as false }) },
    { label: "readyForUserVisibleOutput=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, readyForUserVisibleOutput: true as unknown as false }) },
    // 30. promptTextAvailableInContract true
    { label: "promptTextAvailable=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, promptTextAvailableInContract: true as unknown as false }) },
    // 31. modelOutputAvailableInContract true
    { label: "modelOutputAvailable=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, modelOutputAvailableInContract: true as unknown as false }) },
    // 32. promptTextLogged true
    { label: "promptTextLogged=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, promptTextLogged: true as unknown as false }) },
    // 33. modelOutputLogged true
    { label: "modelOutputLogged=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, modelOutputLogged: true as unknown as false }) },
    // 34. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, syntheticInputOnly: false as unknown as true }) },
    // 35-40: real/raw/redacted/OCR/file/public
    { label: "realUserInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, realUserInputAllowed: true as unknown as false }) },
    { label: "rawInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, rawInputAllowed: true as unknown as false }) },
    { label: "realRedactedInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, realRedactedInputAllowed: true as unknown as false }) },
    { label: "photoOrOcrInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, photoOrOcrInputAllowed: true as unknown as false }) },
    { label: "fileUploadInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, fileUploadInputAllowed: true as unknown as false }) },
    { label: "publicAnonymousInputAllowed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, publicAnonymousInputAllowed: true as unknown as false }) },
    // 41-46: Branch C / runSmartTalk / OCR
    { label: "branchCDep=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, branchCDependencyAllowed: true as unknown as false }) },
    { label: "runSmartTalkDep=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, runSmartTalkDependencyAllowed: true as unknown as false }) },
    { label: "ocrRuntimeDep=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    { label: "branchCCalled=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, branchCCalled: true as unknown as false }) },
    { label: "runSmartTalkCalled=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, runSmartTalkCalledOrImported: true as unknown as false }) },
    { label: "extractTextCalled=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 47-52: persistence / public / pilot
    { label: "userVisibleOutputEmitted=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, userVisibleOutputEmitted: true as unknown as false }) },
    { label: "persistenceUsed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, persistenceUsed: true as unknown as false }) },
    { label: "dnaSavePerformed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, dnaSavePerformed: true as unknown as false }) },
    { label: "offlineSavePerformed=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, offlineSavePerformed: true as unknown as false }) },
    { label: "publicRuntimeEnabled=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, publicRuntimeEnabled: true as unknown as false }) },
    { label: "realOperatorPilotExecuted=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, realOperatorPilotExecuted: true as unknown as false }) },
    // 53-54: acknowledgments
    { label: "missing operator ack", result: tamper({ operatorAdditionalCaseContractAcknowledgment: "partial" }) },
    { label: "missing reviewer ack", result: tamper({ reviewerAdditionalCaseContractAcknowledgment: "partial" }) },
    // 55-63: contains*
    { label: "containsSecret=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsSecret: true as unknown as false }) },
    { label: "containsEnvValue=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsEnvValue: true as unknown as false }) },
    { label: "containsApiKey=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsApiKey: true as unknown as false }) },
    { label: "containsRawInputText=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsRawInputText: true as unknown as false }) },
    { label: "containsRedactedText=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsRedactedText: true as unknown as false }) },
    { label: "containsModelOutput=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsModelOutput: true as unknown as false }) },
    { label: "containsDocumentContent=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsDocumentContent: true as unknown as false }) },
    { label: "containsUserPii=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsUserPii: true as unknown as false }) },
    { label: "containsRealUserInput=true", result: validateAdditionalSyntheticLiveLlmCaseContractInput({ ...tamperBase, containsRealUserInput: true as unknown as false }) },
    // 64+: notes with forbidden strings
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=val"] }) },
    { label: 'notes: "process.env.OPENAI_API_KEY"', result: tamper({ notes: ["process.env.OPENAI_API_KEY"] }) },
    { label: 'notes: "apiKey:"', result: tamper({ notes: ["apiKey: abc"] }) },
    { label: 'notes: "Authorization: Bearer"', result: tamper({ notes: ["Authorization: Bearer x"] }) },
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    { label: 'notes: "IBAN"', result: tamper({ notes: ["IBAN: DE12345"] }) },
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    { label: 'notes: "Sie müssen"', result: tamper({ notes: ["Sie müssen zahlen"] }) },
    { label: 'notes: "you must pay"', result: tamper({ notes: ["you must pay now"] }) },
    { label: 'notes: "payment legally required"', result: tamper({ notes: ["payment legally required"] }) },
    { label: 'notes: "Zahlungspflicht sicher"', result: tamper({ notes: ["Zahlungspflicht sicher"] }) },
    { label: 'notes: "real payment notice"', result: tamper({ notes: ["real payment notice"] }) },
    { label: 'notes: "real invoice"', result: tamper({ notes: ["real invoice"] }) },
    { label: 'notes: "real Mahnung"', result: tamper({ notes: ["real Mahnung"] }) },
    { label: 'notes: "public payment runtime ready"', result: tamper({ notes: ["public payment runtime ready"] }) },
    { label: 'notes: "real document payment test ready"', result: tamper({ notes: ["real document payment test ready"] }) },
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output reviewed"', result: tamper({ notes: ["model output reviewed"] }) },
    { label: 'notes: "audit persisted"', result: tamper({ notes: ["audit persisted"] }) },
    { label: 'notes: "public runtime ready"', result: tamper({ notes: ["public runtime ready"] }) },
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    { label: 'notes: "real operator pilot executed"', result: tamper({ notes: ["real operator pilot executed"] }) },
    { label: 'notes: "general live llm runtime authorized"', result: tamper({ notes: ["general live llm runtime authorized"] }) },
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    { label: 'notes: "additional live calls executed"', result: tamper({ notes: ["additional live calls executed"] }) },
    { label: 'notes: "real document input ready"', result: tamper({ notes: ["real document input ready"] }) },
    { label: 'notes: "production live runtime ready"', result: tamper({ notes: ["production live runtime ready"] }) },
    { label: 'notes: "authorized public runtime"', result: tamper({ notes: ["authorized public runtime"] }) },
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

  const allPassed = planningReady && contractAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  if (!planningReady) {
    notes.push("contract blocked: expansion planning prerequisite not satisfied");
  }

  return {
    checkId: "8.3S",
    allPassed,
    expansionPlanningReadyForAdditionalCaseContract: planningReady,
    additionalSyntheticLiveLlmCaseContractAccepted: contractAccepted,
    tamperCasesRejected,

    readyForAdditionalSyntheticLiveLlmCaseExecutionPlan: allPassed,
    selectedSyntheticCaseContractAccepted: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    contractOnly: true,
    futureExecutionPlanRequired: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInContract: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextAvailableInContract: false,
    modelOutputAvailableInContract: false,
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

    userVisibleOutputEmitted: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,
    neverUserVisible: true,

    notes,
  };
}
