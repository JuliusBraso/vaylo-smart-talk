/**
 * Additional Synthetic Live LLM Case Execution Plan — Phase 8.3T.
 *
 * This module is EXECUTION PLAN ONLY. It does NOT:
 *   - Call a live LLM
 *   - Call OpenAI or fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Process real user input
 *   - Construct the final API prompt text
 *   - Inspect / log / store model output
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *
 * It defines a typed execution plan for one future synthetic call:
 *   `synthetic_explicit_payment_deadline`
 *
 * The next phase must perform Dry-Run Authorization (8.3U) before any call.
 */

import { runAdditionalSyntheticLiveLlmCaseContract } from "./run-additional-synthetic-live-llm-case-contract";
import {
  type AdditionalSyntheticLiveLlmCaseExecutionPlanInput,
  type AdditionalSyntheticLiveLlmCaseExecutionPlanResult,
  type AdditionalSyntheticLiveLlmCaseExecutionPlanCheckResult,
  type AdditionalSyntheticLiveLlmCaseExecutionPlanRejectionReason,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_SCOPES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PREFLIGHT_STEPS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_COMPONENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_BLOCKERS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_METADATA_CAPTURE_FIELDS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_GATES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_BLOCKERS,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_CHECKLIST,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS,
  FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_STRINGS,
} from "./additional-synthetic-live-llm-case-execution-plan-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_STRINGS.some((f) =>
    lower.includes(f.toLowerCase()),
  );
}

function containsPiiPattern(text: string): boolean {
  const patterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    /\+?[0-9]{7,}/,
    /\bIBAN\b/i,
    /\bSteuer-?ID\b/i,
    /\bAktenzeichen\b/i,
  ];
  return patterns.some((p) => p.test(text));
}

function containsSecretLike(text: string): boolean {
  const patterns = [/sk-[A-Za-z0-9]{10,}/, /OPENAI_API_KEY/, /Bearer\s+[A-Za-z0-9._-]{10,}/];
  return patterns.some((p) => p.test(text));
}

function containsUnsafeMarker(text: string): boolean {
  const unsafe = [
    "real authority",
    "real person",
    "real address",
    "real document",
    "real invoice",
    "real mahnung",
    "real payment notice",
    "public runtime",
    "live llm call",
    "prompt constructed",
    "model output",
    "payment execution live",
    "payment prompt constructed",
    "payment model output",
    "real payment notice ready",
    "real invoice ready",
    "public payment explanation",
    "payment output user visible",
    "real document payment runtime",
    "synthetic payment call executed",
  ];
  const lower = text.toLowerCase();
  return unsafe.some((m) => lower.includes(m));
}

function scanStrings(texts: readonly string[]): boolean {
  for (const t of texts) {
    if (
      containsForbiddenString(t) ||
      containsPiiPattern(t) ||
      containsSecretLike(t) ||
      containsUnsafeMarker(t)
    ) {
      return true;
    }
  }
  return false;
}

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds a canonical `AdditionalSyntheticLiveLlmCaseExecutionPlanInput`.
 *
 * When `contractReady` is `false`, the input will be created with
 * `contractReadyForExecutionPlan: false` to exercise the "blocked" path.
 * The literal-typed fields (`executionPlanOnly`, `liveLLMCalledInExecutionPlan`,
 * etc.) are always set to their required safe values.
 */
export function buildAdditionalSyntheticLiveLlmCaseExecutionPlanInput(params?: {
  readonly contractReady?: boolean;
}): AdditionalSyntheticLiveLlmCaseExecutionPlanInput {
  return {
    executionPlanId: "additional-synthetic-live-llm-case-execution-plan-8-3t",
    epochId: "8.3T",
    previousPhaseId: "8.3S",

    contractReadyForExecutionPlan: params?.contractReady ?? true,

    scopes: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_SCOPES,
    provider: "openai",
    model: "gpt_4o_mini",
    selectedCase: "synthetic_explicit_payment_deadline",
    executionMode: "preflight_plan_only",

    preflightSteps: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PREFLIGHT_STEPS,
    promptComponents: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_COMPONENTS,
    promptBlockers: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_BLOCKERS,
    metadataCaptureFields: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_METADATA_CAPTURE_FIELDS,
    executionGates: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_GATES,
    executionBlockers: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_BLOCKERS,
    checklistConfirmed: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_CHECKLIST,

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInExecutionPlan: false,
    additionalLiveLLMCallsExecuted: false,

    readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: true,
    additionalSyntheticCaseExecutionPlanAccepted: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    promptTextConstructedNow: false,
    promptTextAvailableInExecutionPlan: false,
    modelOutputAvailableInExecutionPlan: false,
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

    operatorExecutionPlanAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS[0],
    reviewerExecutionPlanAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS[2],

    notes: [
      "additional synthetic explicit payment deadline execution plan completed without live call",
      "future dry-run authorization required before execution",
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

const BLOCKING_REJECTION_REASONS = new Set<AdditionalSyntheticLiveLlmCaseExecutionPlanRejectionReason>(
  ["contract_not_ready"],
);

/**
 * Validates an `AdditionalSyntheticLiveLlmCaseExecutionPlanInput`.
 *
 * Status semantics:
 *   "planned"  — all checks pass; execution plan accepted.
 *   "blocked"  — contract prerequisite not satisfied (safe prevention).
 *   "rejected" — at least one unsafe invariant violated.
 */
export function validateAdditionalSyntheticLiveLlmCaseExecutionPlanInput(
  input: AdditionalSyntheticLiveLlmCaseExecutionPlanInput,
): AdditionalSyntheticLiveLlmCaseExecutionPlanResult {
  const r = asRec(input);
  const reasons: AdditionalSyntheticLiveLlmCaseExecutionPlanRejectionReason[] = [];

  // 1. Contract prerequisite
  if (!input.contractReadyForExecutionPlan) {
    reasons.push("contract_not_ready");
  }

  // 2a. Required scopes
  for (const scope of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_SCOPES) {
    if (!input.scopes.includes(scope)) {
      reasons.push("missing_execution_plan_scope");
      break;
    }
  }

  // 2b. Required preflight steps
  for (const step of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PREFLIGHT_STEPS) {
    if (!input.preflightSteps.includes(step)) {
      reasons.push("missing_preflight_step");
      break;
    }
  }

  // 2c. Required prompt components
  for (const comp of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_COMPONENTS) {
    if (!input.promptComponents.includes(comp)) {
      reasons.push("missing_prompt_component");
      break;
    }
  }

  // 2d. Required prompt blockers
  for (const blocker of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_PROMPT_BLOCKERS) {
    if (!input.promptBlockers.includes(blocker)) {
      reasons.push("missing_prompt_blocker");
      break;
    }
  }

  // 2e. Required metadata capture fields
  for (const field of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_METADATA_CAPTURE_FIELDS) {
    if (!input.metadataCaptureFields.includes(field)) {
      reasons.push("missing_metadata_capture_field");
      break;
    }
  }

  // 2f. Required execution gates
  for (const gate of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_GATES) {
    if (!input.executionGates.includes(gate)) {
      reasons.push("missing_execution_gate");
      break;
    }
  }

  // 2g. Required execution blockers
  for (const eb of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_BLOCKERS) {
    if (!input.executionBlockers.includes(eb)) {
      reasons.push("missing_execution_blocker");
      break;
    }
  }

  // 2h. Required checklist
  for (const item of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      reasons.push("missing_checklist_item");
      break;
    }
  }

  // 3. Provider
  if (r["provider"] !== "openai") {
    reasons.push("provider_invalid");
  }

  // 4. Model
  if (r["model"] !== "gpt_4o_mini") {
    reasons.push("model_invalid");
  }

  // 5. Selected case
  if (r["selectedCase"] !== "synthetic_explicit_payment_deadline") {
    reasons.push("selected_case_invalid");
  }

  // 6. Execution mode
  const validModes: readonly string[] = [
    "preflight_plan_only",
    "dry_run_authorization_allowed_next_phase",
  ];
  if (!validModes.includes(r["executionMode"] as string)) {
    reasons.push("invalid_execution_mode");
  }

  // 7. executionPlanOnly
  if (r["executionPlanOnly"] !== true) {
    reasons.push("execution_plan_attempted_live_call");
  }

  // 8. futureDryRunAuthorizationRequired
  if (r["futureDryRunAuthorizationRequired"] !== true) {
    reasons.push("dry_run_authorization_missing");
  }

  // 9. oneFutureLiveLlmCallOnly
  if (r["oneFutureLiveLlmCallOnly"] !== true) {
    reasons.push("future_call_limit_missing");
  }

  // 10. killSwitchRequiredForFutureCall
  if (r["killSwitchRequiredForFutureCall"] !== true) {
    reasons.push("kill_switch_missing");
  }

  // 11. singleCallCounterRequiredForFutureCall
  if (r["singleCallCounterRequiredForFutureCall"] !== true) {
    reasons.push("single_call_counter_missing");
  }

  // 12. liveLLMCalledInExecutionPlan must be false
  if (r["liveLLMCalledInExecutionPlan"] !== false) {
    reasons.push("execution_plan_attempted_live_call");
  }

  // 13. additionalLiveLLMCallsExecuted must be false
  if (r["additionalLiveLLMCallsExecuted"] !== false) {
    reasons.push("execution_plan_attempted_live_call");
  }

  // 14. Positive gates required
  if (r["readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization"] !== true) {
    reasons.push("dry_run_authorization_missing");
  }
  if (r["additionalSyntheticCaseExecutionPlanAccepted"] !== true) {
    reasons.push("missing_checklist_item");
  }

  // 15. Dangerous readiness must be false
  if (r["readyForLiveLLMRuntime"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
  }
  if (r["readyForConnectedAiRuntimeExecution"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
  }
  if (r["readyForRealOperatorPilotRun"] !== false) {
    reasons.push("real_operator_pilot_authorized");
  }
  if (r["readyForPilotRunNow"] !== false) {
    reasons.push("real_operator_pilot_authorized");
  }
  if (r["readyForPublicLaunch"] !== false) {
    reasons.push("public_runtime_detected");
  }
  if (r["readyForPersistence"] !== false) {
    reasons.push("persistence_detected");
  }
  if (r["readyForRealDocumentInput"] !== false) {
    reasons.push("real_document_input_authorized");
  }
  if (r["readyForUserVisibleOutput"] !== false) {
    reasons.push("user_visible_output_detected");
  }

  // 16. promptTextConstructedNow must be false
  if (r["promptTextConstructedNow"] !== false) {
    reasons.push("prompt_text_constructed_now");
  }

  // 17. Prompt/model output availability and logging
  if (r["promptTextAvailableInExecutionPlan"] !== false) {
    reasons.push("prompt_text_available");
  }
  if (r["modelOutputAvailableInExecutionPlan"] !== false) {
    reasons.push("model_output_available");
  }
  if (r["promptTextLogged"] !== false) {
    reasons.push("prompt_or_model_output_logged");
  }
  if (r["modelOutputLogged"] !== false) {
    reasons.push("prompt_or_model_output_logged");
  }

  // 18. syntheticInputOnly
  if (r["syntheticInputOnly"] !== true) {
    reasons.push("real_input_detected");
  }

  // 19. Real/raw/redacted/OCR/file/public input flags
  if (r["realUserInputAllowed"] !== false) {
    reasons.push("real_input_detected");
  }
  if (r["rawInputAllowed"] !== false) {
    reasons.push("raw_input_detected");
  }
  if (r["realRedactedInputAllowed"] !== false) {
    reasons.push("redacted_real_input_detected");
  }
  if (r["photoOrOcrInputAllowed"] !== false) {
    reasons.push("ocr_photo_file_input_detected");
  }
  if (r["fileUploadInputAllowed"] !== false) {
    reasons.push("ocr_photo_file_input_detected");
  }
  if (r["publicAnonymousInputAllowed"] !== false) {
    reasons.push("public_request_detected");
  }

  // 20. Branch C / runSmartTalk / OCR flags
  if (r["branchCDependencyAllowed"] !== false) {
    reasons.push("branch_c_dependency_detected");
  }
  if (r["runSmartTalkDependencyAllowed"] !== false) {
    reasons.push("run_smart_talk_dependency_detected");
  }
  if (r["ocrRuntimeDependencyAllowed"] !== false) {
    reasons.push("ocr_runtime_dependency_detected");
  }
  if (r["branchCCalled"] !== false) {
    reasons.push("branch_c_dependency_detected");
  }
  if (r["runSmartTalkCalledOrImported"] !== false) {
    reasons.push("run_smart_talk_dependency_detected");
  }
  if (r["extractTextFromImageCalledOrImported"] !== false) {
    reasons.push("ocr_runtime_dependency_detected");
  }

  // 21. User-visible output
  if (r["userVisibleOutputEmitted"] !== false) {
    reasons.push("user_visible_output_detected");
  }

  // 22. Persistence / public / pilot flags
  if (r["persistenceUsed"] !== false) {
    reasons.push("persistence_detected");
  }
  if (r["dnaSavePerformed"] !== false) {
    reasons.push("persistence_detected");
  }
  if (r["offlineSavePerformed"] !== false) {
    reasons.push("persistence_detected");
  }
  if (r["publicRuntimeEnabled"] !== false) {
    reasons.push("public_runtime_detected");
  }
  if (r["realOperatorPilotExecuted"] !== false) {
    reasons.push("real_operator_pilot_authorized");
  }

  // 23. Acknowledgments contain all required statements
  const opAck = typeof input.operatorExecutionPlanAcknowledgment === "string"
    ? input.operatorExecutionPlanAcknowledgment
    : "";
  const revAck = typeof input.reviewerExecutionPlanAcknowledgment === "string"
    ? input.reviewerExecutionPlanAcknowledgment
    : "";
  const allAcks = [...input.notes, opAck, revAck];
  const acksMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_EXECUTION_PLAN_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !allAcks.some((a) => a.includes(stmt)),
    );
  if (acksMissing) {
    reasons.push("missing_checklist_item");
  }

  // 24. contains* flags
  if (r["containsRealUserInput"] !== false) {
    reasons.push("real_input_detected");
  }
  if (r["containsRawInputText"] !== false) {
    reasons.push("raw_input_detected");
  }
  if (r["containsRedactedText"] !== false) {
    reasons.push("redacted_real_input_detected");
  }
  if (r["containsFullDraftText"] !== false) {
    reasons.push("prompt_text_available");
  }
  if (r["containsModelOutput"] !== false) {
    reasons.push("model_output_available");
  }
  if (r["containsSecret"] !== false) {
    reasons.push("forbidden_secret_detected");
  }
  if (r["containsEnvValue"] !== false) {
    reasons.push("forbidden_env_value_detected");
  }
  if (r["containsApiKey"] !== false) {
    reasons.push("forbidden_api_key_detected");
  }
  if (r["containsUserPii"] !== false) {
    reasons.push("forbidden_pii_detected");
  }
  if (r["containsDocumentContent"] !== false) {
    reasons.push("forbidden_document_content_detected");
  }

  // 25–26. Scan string fields
  if (scanStrings([...input.notes, opAck, revAck])) {
    reasons.push("unsafe_execution_plan_note_detected");
  }

  // neverUserVisible
  if (r["neverUserVisible"] !== true) {
    reasons.push("user_visible_output_detected");
  }

  const uniqueReasons = [...new Set(reasons)];
  const accepted = uniqueReasons.length === 0;
  const isBlocked =
    !accepted && uniqueReasons.every((rr) => BLOCKING_REJECTION_REASONS.has(rr));

  const status = accepted ? "planned" : isBlocked ? "blocked" : "rejected";

  return {
    executionPlanId: input.executionPlanId,
    epochId: "8.3T",
    status,
    accepted,
    rejectionReasons: uniqueReasons,

    safeExecutionPlanMetadata: {
      scopeCount: input.scopes.length,
      provider: "openai",
      model: "gpt_4o_mini",
      selectedCase: "synthetic_explicit_payment_deadline",
      executionMode: accepted ? input.executionMode : "preflight_plan_only",
      preflightStepCount: input.preflightSteps.length,
      promptComponentCount: input.promptComponents.length,
      promptBlockerCount: input.promptBlockers.length,
      metadataCaptureFieldCount: input.metadataCaptureFields.length,
      executionGateCount: input.executionGates.length,
      executionBlockerCount: input.executionBlockers.length,
      checklistPassedCount: accepted ? input.checklistConfirmed.length : 0,
      executionPlanOnly: true,
      oneFutureLiveLlmCallOnly: true,
    },

    readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: accepted,
    additionalSyntheticCaseExecutionPlanAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInExecutionPlan: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextConstructedNow: false,
    promptTextAvailableInExecutionPlan: false,
    modelOutputAvailableInExecutionPlan: false,
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

    apiRouteModifiedByExecutionPlan: false,
    existingRuntimeModifiedByExecutionPlan: false,
    uiTouched: false,
    databaseOrStorageModifiedByExecutionPlan: false,
    neverUserVisible: true,
  };
}

// ── Main runner ───────────────────────────────────────────────────────────────

/**
 * Phase 8.3T — Additional Synthetic Live LLM Case Execution Plan.
 *
 * Calls `runAdditionalSyntheticLiveLlmCaseContract()` (8.3S) as a dependency,
 * verifies its output, then validates the execution plan input and runs a
 * comprehensive set of tamper cases (all using the local validator only).
 *
 * NOT auto-executed on module load.
 */
export async function runAdditionalSyntheticLiveLlmCaseExecutionPlan(): Promise<AdditionalSyntheticLiveLlmCaseExecutionPlanCheckResult> {
  // ── 1. Dependency: Phase 8.3S ───────────────────────────────────────────────
  const contractResult = await runAdditionalSyntheticLiveLlmCaseContract();

  const r8s = asRec(contractResult);

  const prerequisiteOk =
    contractResult.allPassed === true &&
    r8s["readyForAdditionalSyntheticLiveLlmCaseExecutionPlan"] === true &&
    r8s["selectedSyntheticCaseContractAccepted"] === true &&
    r8s["readyForLiveLLMRuntime"] === false &&
    r8s["readyForConnectedAiRuntimeExecution"] === false &&
    r8s["readyForRealOperatorPilotRun"] === false &&
    r8s["readyForPilotRunNow"] === false &&
    r8s["readyForPublicLaunch"] === false &&
    r8s["readyForPersistence"] === false &&
    r8s["readyForRealDocumentInput"] === false &&
    r8s["readyForUserVisibleOutput"] === false &&
    r8s["contractOnly"] === true &&
    r8s["futureExecutionPlanRequired"] === true &&
    r8s["futureDryRunAuthorizationRequired"] === true &&
    r8s["oneFutureLiveLlmCallOnly"] === true &&
    r8s["killSwitchRequiredForFutureCall"] === true &&
    r8s["singleCallCounterRequiredForFutureCall"] === true &&
    r8s["liveLLMCalledInContract"] === false &&
    r8s["additionalLiveLLMCallsExecuted"] === false &&
    r8s["promptTextAvailableInContract"] === false &&
    r8s["modelOutputAvailableInContract"] === false &&
    r8s["promptTextLogged"] === false &&
    r8s["modelOutputLogged"] === false &&
    r8s["syntheticInputOnly"] === true &&
    r8s["branchCDependencyAllowed"] === false &&
    r8s["runSmartTalkDependencyAllowed"] === false &&
    r8s["ocrRuntimeDependencyAllowed"] === false &&
    r8s["branchCCalled"] === false &&
    r8s["runSmartTalkCalledOrImported"] === false &&
    r8s["extractTextFromImageCalledOrImported"] === false &&
    r8s["userVisibleOutputEmitted"] === false &&
    r8s["persistenceUsed"] === false &&
    r8s["publicRuntimeEnabled"] === false &&
    r8s["realOperatorPilotExecuted"] === false &&
    r8s["neverUserVisible"] === true;

  // ── 2. Build and validate canonical input ───────────────────────────────────
  const canonicalInput = buildAdditionalSyntheticLiveLlmCaseExecutionPlanInput({
    contractReady: prerequisiteOk,
  });
  const mainResult = validateAdditionalSyntheticLiveLlmCaseExecutionPlanInput(canonicalInput);

  const mainPassed = mainResult.accepted && mainResult.status === "planned";

  // ── 3. Tamper cases (local validator only) ──────────────────────────────────

  type TamperFn = (base: AdditionalSyntheticLiveLlmCaseExecutionPlanInput) => AdditionalSyntheticLiveLlmCaseExecutionPlanInput;

  function tamper(overrides: Record<string, unknown>): TamperFn {
    return (base) => ({ ...base, ...overrides } as unknown as AdditionalSyntheticLiveLlmCaseExecutionPlanInput);
  }

  const base = buildAdditionalSyntheticLiveLlmCaseExecutionPlanInput({ contractReady: true });

  const tamperCases: Array<{ label: string; fn: TamperFn }> = [
    // Group 1: Contract prerequisite
    { label: "contractReady false", fn: tamper({ contractReadyForExecutionPlan: false }) },

    // Group 2: Missing scope/preflight/prompt component/prompt blocker/metadata/gate/blocker/checklist
    {
      label: "missing scope",
      fn: tamper({ scopes: base.scopes.filter((s) => s !== "execution_plan_only") }),
    },
    {
      label: "missing preflight step",
      fn: tamper({ preflightSteps: base.preflightSteps.filter((s) => s !== "contract_verified") }),
    },
    {
      label: "missing prompt component",
      fn: tamper({
        promptComponents: base.promptComponents.filter(
          (c) => c !== "synthetic_payment_notice_marker",
        ),
      }),
    },
    {
      label: "missing prompt blocker",
      fn: tamper({
        promptBlockers: base.promptBlockers.filter((b) => b !== "real_authority_name_blocked"),
      }),
    },
    {
      label: "missing metadata capture field",
      fn: tamper({
        metadataCaptureFields: base.metadataCaptureFields.filter(
          (f) => f !== "execution_plan_id",
        ),
      }),
    },
    {
      label: "missing execution gate",
      fn: tamper({ executionGates: base.executionGates.filter((g) => g !== "contract_gate") }),
    },
    {
      label: "missing execution blocker",
      fn: tamper({
        executionBlockers: base.executionBlockers.filter((b) => b !== "contract_not_ready"),
      }),
    },
    {
      label: "missing checklist item",
      fn: tamper({
        checklistConfirmed: base.checklistConfirmed.filter((c) => c !== "contract_reviewed"),
      }),
    },

    // Group 3: Provider / model / case / mode
    { label: "wrong provider", fn: tamper({ provider: "anthropic" }) },
    { label: "wrong model", fn: tamper({ model: "gpt_4_turbo" }) },
    {
      label: "wrong selectedCase",
      fn: tamper({ selectedCase: "synthetic_deadline_relative_missing_delivery_date" }),
    },
    { label: "invalid executionMode", fn: tamper({ executionMode: "live_execution" }) },

    // Group 4: Literal invariants
    { label: "executionPlanOnly false", fn: tamper({ executionPlanOnly: false }) },
    {
      label: "futureDryRunAuthorizationRequired false",
      fn: tamper({ futureDryRunAuthorizationRequired: false }),
    },
    { label: "oneFutureLiveLlmCallOnly false", fn: tamper({ oneFutureLiveLlmCallOnly: false }) },
    {
      label: "killSwitchRequiredForFutureCall false",
      fn: tamper({ killSwitchRequiredForFutureCall: false }),
    },
    {
      label: "singleCallCounterRequiredForFutureCall false",
      fn: tamper({ singleCallCounterRequiredForFutureCall: false }),
    },
    {
      label: "liveLLMCalledInExecutionPlan true",
      fn: tamper({ liveLLMCalledInExecutionPlan: true as unknown as false }),
    },
    {
      label: "additionalLiveLLMCallsExecuted true",
      fn: tamper({ additionalLiveLLMCallsExecuted: true as unknown as false }),
    },

    // Group 5: Positive gates missing
    {
      label: "readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization false",
      fn: tamper({
        readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization:
          false as unknown as true,
      }),
    },
    {
      label: "additionalSyntheticCaseExecutionPlanAccepted false",
      fn: tamper({ additionalSyntheticCaseExecutionPlanAccepted: false as unknown as true }),
    },

    // Group 6: Dangerous readiness true
    {
      label: "readyForLiveLLMRuntime true",
      fn: tamper({ readyForLiveLLMRuntime: true as unknown as false }),
    },
    {
      label: "readyForConnectedAiRuntimeExecution true",
      fn: tamper({ readyForConnectedAiRuntimeExecution: true as unknown as false }),
    },
    {
      label: "readyForRealOperatorPilotRun true",
      fn: tamper({ readyForRealOperatorPilotRun: true as unknown as false }),
    },
    {
      label: "readyForPilotRunNow true",
      fn: tamper({ readyForPilotRunNow: true as unknown as false }),
    },
    {
      label: "readyForPublicLaunch true",
      fn: tamper({ readyForPublicLaunch: true as unknown as false }),
    },
    {
      label: "readyForPersistence true",
      fn: tamper({ readyForPersistence: true as unknown as false }),
    },
    {
      label: "readyForRealDocumentInput true",
      fn: tamper({ readyForRealDocumentInput: true as unknown as false }),
    },
    {
      label: "readyForUserVisibleOutput true",
      fn: tamper({ readyForUserVisibleOutput: true as unknown as false }),
    },

    // Group 7: Prompt text / model output availability
    {
      label: "promptTextConstructedNow true",
      fn: tamper({ promptTextConstructedNow: true as unknown as false }),
    },
    {
      label: "promptTextAvailableInExecutionPlan true",
      fn: tamper({ promptTextAvailableInExecutionPlan: true as unknown as false }),
    },
    {
      label: "modelOutputAvailableInExecutionPlan true",
      fn: tamper({ modelOutputAvailableInExecutionPlan: true as unknown as false }),
    },
    {
      label: "promptTextLogged true",
      fn: tamper({ promptTextLogged: true as unknown as false }),
    },
    {
      label: "modelOutputLogged true",
      fn: tamper({ modelOutputLogged: true as unknown as false }),
    },

    // Group 8: Input policy flags
    {
      label: "syntheticInputOnly false",
      fn: tamper({ syntheticInputOnly: false as unknown as true }),
    },
    {
      label: "realUserInputAllowed true",
      fn: tamper({ realUserInputAllowed: true as unknown as false }),
    },
    {
      label: "rawInputAllowed true",
      fn: tamper({ rawInputAllowed: true as unknown as false }),
    },
    {
      label: "realRedactedInputAllowed true",
      fn: tamper({ realRedactedInputAllowed: true as unknown as false }),
    },
    {
      label: "photoOrOcrInputAllowed true",
      fn: tamper({ photoOrOcrInputAllowed: true as unknown as false }),
    },
    {
      label: "fileUploadInputAllowed true",
      fn: tamper({ fileUploadInputAllowed: true as unknown as false }),
    },
    {
      label: "publicAnonymousInputAllowed true",
      fn: tamper({ publicAnonymousInputAllowed: true as unknown as false }),
    },

    // Group 9: Branch C / runSmartTalk / OCR dependency flags
    {
      label: "branchCDependencyAllowed true",
      fn: tamper({ branchCDependencyAllowed: true as unknown as false }),
    },
    {
      label: "runSmartTalkDependencyAllowed true",
      fn: tamper({ runSmartTalkDependencyAllowed: true as unknown as false }),
    },
    {
      label: "ocrRuntimeDependencyAllowed true",
      fn: tamper({ ocrRuntimeDependencyAllowed: true as unknown as false }),
    },
    {
      label: "branchCCalled true",
      fn: tamper({ branchCCalled: true as unknown as false }),
    },
    {
      label: "runSmartTalkCalledOrImported true",
      fn: tamper({ runSmartTalkCalledOrImported: true as unknown as false }),
    },
    {
      label: "extractTextFromImageCalledOrImported true",
      fn: tamper({ extractTextFromImageCalledOrImported: true as unknown as false }),
    },

    // Group 10: Persistence / public / pilot
    {
      label: "userVisibleOutputEmitted true",
      fn: tamper({ userVisibleOutputEmitted: true as unknown as false }),
    },
    {
      label: "persistenceUsed true",
      fn: tamper({ persistenceUsed: true as unknown as false }),
    },
    {
      label: "dnaSavePerformed true",
      fn: tamper({ dnaSavePerformed: true as unknown as false }),
    },
    {
      label: "offlineSavePerformed true",
      fn: tamper({ offlineSavePerformed: true as unknown as false }),
    },
    {
      label: "publicRuntimeEnabled true",
      fn: tamper({ publicRuntimeEnabled: true as unknown as false }),
    },
    {
      label: "realOperatorPilotExecuted true",
      fn: tamper({ realOperatorPilotExecuted: true as unknown as false }),
    },

    // Group 11: Missing acknowledgments
    {
      label: "missing operator acknowledgment",
      fn: tamper({ operatorExecutionPlanAcknowledgment: "" }),
    },
    {
      label: "missing reviewer acknowledgment",
      fn: tamper({ reviewerExecutionPlanAcknowledgment: "" }),
    },

    // Group 12: contains* true
    {
      label: "containsRealUserInput true",
      fn: tamper({ containsRealUserInput: true as unknown as false }),
    },
    {
      label: "containsRawInputText true",
      fn: tamper({ containsRawInputText: true as unknown as false }),
    },
    {
      label: "containsRedactedText true",
      fn: tamper({ containsRedactedText: true as unknown as false }),
    },
    {
      label: "containsFullDraftText true",
      fn: tamper({ containsFullDraftText: true as unknown as false }),
    },
    {
      label: "containsModelOutput true",
      fn: tamper({ containsModelOutput: true as unknown as false }),
    },
    {
      label: "containsSecret true",
      fn: tamper({ containsSecret: true as unknown as false }),
    },
    {
      label: "containsEnvValue true",
      fn: tamper({ containsEnvValue: true as unknown as false }),
    },
    {
      label: "containsApiKey true",
      fn: tamper({ containsApiKey: true as unknown as false }),
    },
    {
      label: "containsUserPii true",
      fn: tamper({ containsUserPii: true as unknown as false }),
    },
    {
      label: "containsDocumentContent true",
      fn: tamper({ containsDocumentContent: true as unknown as false }),
    },

    // Group 13: Forbidden strings in notes
    {
      label: "notes: payment execution live now",
      fn: tamper({ notes: ["payment execution live now"] }),
    },
    {
      label: "notes: synthetic payment call executed",
      fn: tamper({ notes: ["synthetic payment call executed"] }),
    },
    {
      label: "notes: payment prompt constructed",
      fn: tamper({ notes: ["payment prompt constructed"] }),
    },
    {
      label: "notes: payment model output",
      fn: tamper({ notes: ["payment model output"] }),
    },
    {
      label: "notes: real payment notice ready",
      fn: tamper({ notes: ["real payment notice ready"] }),
    },
    {
      label: "notes: real invoice ready",
      fn: tamper({ notes: ["real invoice ready"] }),
    },
    {
      label: "notes: public payment explanation ready",
      fn: tamper({ notes: ["public payment explanation ready"] }),
    },
    {
      label: "notes: payment output user visible",
      fn: tamper({ notes: ["payment output user visible"] }),
    },
    {
      label: "notes: real document payment runtime",
      fn: tamper({ notes: ["real document payment runtime"] }),
    },
    {
      label: "notes: sk-key",
      fn: tamper({ notes: ["sk-abc1234567890"] }),
    },
    {
      label: "notes: OPENAI_API_KEY",
      fn: tamper({ notes: ["OPENAI_API_KEY=abc"] }),
    },
    {
      label: "notes: live llm executed",
      fn: tamper({ notes: ["live llm executed"] }),
    },
    {
      label: "notes: real payment notice",
      fn: tamper({ notes: ["real payment notice"] }),
    },
    {
      label: "notes: real invoice",
      fn: tamper({ notes: ["real invoice"] }),
    },
    {
      label: "notes: IBAN:",
      fn: tamper({ notes: ["IBAN: DE12 3456 7890"] }),
    },
    {
      label: "notes: you must pay",
      fn: tamper({ notes: ["you must pay now"] }),
    },
    {
      label: "notes: payment legally required",
      fn: tamper({ notes: ["payment legally required"] }),
    },
    {
      label: "notes: model output returned to user",
      fn: tamper({ notes: ["model output returned to user"] }),
    },
    {
      label: "notes: prompt text logged",
      fn: tamper({ notes: ["prompt text logged"] }),
    },
    {
      label: "notes: public runtime ready",
      fn: tamper({ notes: ["public runtime ready"] }),
    },
    {
      label: "notes: general live llm runtime authorized",
      fn: tamper({ notes: ["general live llm runtime authorized"] }),
    },
    {
      label: "notes: real document input ready",
      fn: tamper({ notes: ["real document input ready"] }),
    },
    {
      label: "notes: additional live calls executed",
      fn: tamper({ notes: ["additional live calls executed"] }),
    },
    {
      label: "notes: real document payment test ready",
      fn: tamper({ notes: ["real document payment test ready"] }),
    },
    {
      label: "notes: PII email",
      fn: tamper({ notes: ["test@example.com"] }),
    },
    {
      label: "notes: approved for user display",
      fn: tamper({ notes: ["approved for user display"] }),
    },
    {
      label: "notes: authorized public runtime",
      fn: tamper({ notes: ["authorized public runtime"] }),
    },
    {
      label: "notes: Zahlungspflicht sicher",
      fn: tamper({ notes: ["Zahlungspflicht sicher"] }),
    },
    {
      label: "notes: audit persisted",
      fn: tamper({ notes: ["audit persisted"] }),
    },
    {
      label: "notes: production live runtime ready",
      fn: tamper({ notes: ["production live runtime ready"] }),
    },
    // Group 14: neverUserVisible false
    {
      label: "neverUserVisible false",
      fn: tamper({ neverUserVisible: false as unknown as true }),
    },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const { label, fn } of tamperCases) {
    const tampered = fn(base);
    const result = validateAdditionalSyntheticLiveLlmCaseExecutionPlanInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${label}`);
    }
  }

  // ── 4. Compose final check result ───────────────────────────────────────────
  const allPassed = prerequisiteOk && mainPassed && allTamperRejected;

  return {
    checkId: "8.3T",
    allPassed,
    contractReadyForExecutionPlan: prerequisiteOk,
    additionalSyntheticLiveLlmCaseExecutionPlanAccepted: mainPassed,
    tamperCasesRejected: allTamperRejected,

    readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization: allPassed,
    additionalSyntheticCaseExecutionPlanAccepted: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    executionPlanOnly: true,
    futureDryRunAuthorizationRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInExecutionPlan: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextConstructedNow: false,
    promptTextAvailableInExecutionPlan: false,
    modelOutputAvailableInExecutionPlan: false,
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

    notes: [
      `Phase 8.3T: prerequisiteOk=${String(prerequisiteOk)}, mainPassed=${String(mainPassed)}, allTamperRejected=${String(allTamperRejected)}`,
      `tamperCaseCount=${String(tamperCases.length)}`,
      ...tamperFailures,
    ],
  };
}
