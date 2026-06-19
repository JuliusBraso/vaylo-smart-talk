/**
 * Additional Synthetic Live LLM Case Dry-Run Authorization — Phase 8.3U.
 *
 * This module is DRY-RUN AUTHORIZATION ONLY. It does NOT:
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
 * It authorizes ONLY the next phase to execute exactly one synthetic call:
 *   `synthetic_explicit_payment_deadline`
 */

import { runAdditionalSyntheticLiveLlmCaseExecutionPlan } from "./run-additional-synthetic-live-llm-case-execution-plan";
import {
  type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput,
  type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationResult,
  type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCheckResult,
  type AdditionalSyntheticLiveLlmCaseDryRunAuthorizationRejectionReason,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_SCOPES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_GATES,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_CHECKLIST,
  REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS,
  FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_STRINGS,
} from "./additional-synthetic-live-llm-case-dry-run-authorization-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_STRINGS.some((f) =>
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
    // "real document" alone is intentionally excluded because it appears in the
    // required governance statement "real documents...remain blocked".
    // Specific dangerous forms are caught by the entries below.
    "real document input",
    "real invoice",
    "real mahnung",
    "real payment notice",
    // "public runtime" and "model output" are intentionally excluded because they appear
    // in required governance statements ("public runtime...remain blocked",
    // "model output must remain unavailable"). Specific dangerous variants are caught
    // by containsForbiddenString().
    // "live llm call" alone is intentionally excluded because it appears in ack statement 3
    // ("...one synthetic live LLM call."). Dangerous claims of actual execution are caught
    // by "live llm call performed" / "live llm call executed" and by FORBIDDEN_STRINGS
    // entries "live llm executed" and "harness executed with live llm".
    "live llm call performed",
    "live llm call executed",
    "prompt constructed",
    "payment live execution authorized",
    "payment live call executed",
    "payment prompt available",
    "payment model output available",
    "real payment document authorized",
    "real invoice authorized",
    "public payment runtime authorized",
    "user-visible payment output authorized",
    "payment production runtime ready",
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
 * Builds a canonical `AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput`.
 *
 * When `executionPlanReady` is `false`, the input will be created with
 * `executionPlanReadyForDryRunAuthorization: false` to exercise the "blocked" path.
 * All literal-typed safety fields are always set to their required safe values.
 */
export function buildAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput(params?: {
  readonly executionPlanReady?: boolean;
}): AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput {
  return {
    authorizationId: "additional-synthetic-live-llm-case-dry-run-authorization-8-3u",
    epochId: "8.3U",
    previousPhaseId: "8.3T",

    executionPlanReadyForDryRunAuthorization: params?.executionPlanReady ?? true,

    scopes: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_SCOPES,
    gates: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_GATES,
    checklistConfirmed: REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_CHECKLIST,

    selectedCase: "synthetic_explicit_payment_deadline",
    provider: "openai",
    model: "gpt_4o_mini",
    authorizationDecision: "authorize_one_synthetic_case_call_next_phase",

    dryRunAuthorizationOnly: true,
    authorizeExactlyOneSyntheticCaseCallNextPhase: true,
    futureLiveExecutionRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInDryRunAuthorization: false,
    additionalLiveLLMCallsExecuted: false,

    readyForAdditionalSyntheticLiveLlmCaseLiveExecution: true,
    additionalSyntheticCaseDryRunAuthorizationAccepted: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    promptTextConstructedNow: false,
    promptTextAvailableInDryRunAuthorization: false,
    modelOutputAvailableInDryRunAuthorization: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    metadataOnlyCaptureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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

    operatorDryRunAuthorizationAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.join(" "),
    reviewerDryRunAuthorizationAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.join(" "),

    notes: [
      "additional synthetic explicit payment deadline dry-run authorization completed without live call",
      "next phase is authorized to execute exactly one synthetic OpenAI API call only",
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

const BLOCKING_REJECTION_REASONS =
  new Set<AdditionalSyntheticLiveLlmCaseDryRunAuthorizationRejectionReason>([
    "execution_plan_not_ready",
  ]);

/**
 * Validates an `AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput`.
 *
 * Status semantics:
 *   "authorized" — all checks pass; dry-run authorization accepted.
 *   "blocked"    — execution plan prerequisite not satisfied (safe prevention).
 *   "rejected"   — at least one unsafe invariant violated.
 */
export function validateAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput(
  input: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput,
): AdditionalSyntheticLiveLlmCaseDryRunAuthorizationResult {
  const r = asRec(input);
  const reasons: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationRejectionReason[] = [];

  // 1. Execution plan prerequisite
  if (!input.executionPlanReadyForDryRunAuthorization) {
    reasons.push("execution_plan_not_ready");
  }

  // 2a. Required scopes
  for (const scope of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_SCOPES) {
    if (!input.scopes.includes(scope)) {
      reasons.push("missing_authorization_scope");
      break;
    }
  }

  // 2b. Required gates
  for (const gate of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_GATES) {
    if (!input.gates.includes(gate)) {
      reasons.push("missing_authorization_gate");
      break;
    }
  }

  // 2c. Required checklist
  for (const item of REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      reasons.push("missing_checklist_item");
      break;
    }
  }

  // 3. Selected case
  if (r["selectedCase"] !== "synthetic_explicit_payment_deadline") {
    reasons.push("selected_case_invalid");
  }

  // 4. Provider
  if (r["provider"] !== "openai") {
    reasons.push("provider_invalid");
  }

  // 5. Model
  if (r["model"] !== "gpt_4o_mini") {
    reasons.push("model_invalid");
  }

  // 6. Authorization decision
  if (r["authorizationDecision"] !== "authorize_one_synthetic_case_call_next_phase") {
    reasons.push("invalid_authorization_decision");
  }

  // 7. dryRunAuthorizationOnly
  if (r["dryRunAuthorizationOnly"] !== true) {
    reasons.push("authorization_attempted_live_call");
  }

  // 8. authorizeExactlyOneSyntheticCaseCallNextPhase
  if (r["authorizeExactlyOneSyntheticCaseCallNextPhase"] !== true) {
    reasons.push("future_call_limit_missing");
  }

  // 9. futureLiveExecutionRequired
  if (r["futureLiveExecutionRequired"] !== true) {
    reasons.push("future_call_limit_missing");
  }

  // 10. oneFutureLiveLlmCallOnly
  if (r["oneFutureLiveLlmCallOnly"] !== true) {
    reasons.push("future_call_limit_missing");
  }

  // 11. killSwitchRequiredForFutureCall
  if (r["killSwitchRequiredForFutureCall"] !== true) {
    reasons.push("kill_switch_missing");
  }

  // 12. singleCallCounterRequiredForFutureCall
  if (r["singleCallCounterRequiredForFutureCall"] !== true) {
    reasons.push("single_call_counter_missing");
  }

  // 13. liveLLMCalledInDryRunAuthorization must be false
  if (r["liveLLMCalledInDryRunAuthorization"] !== false) {
    reasons.push("authorization_attempted_live_call");
  }

  // 14. additionalLiveLLMCallsExecuted must be false
  if (r["additionalLiveLLMCallsExecuted"] !== false) {
    reasons.push("authorization_attempted_live_call");
  }

  // 15. Positive gates required
  if (r["readyForAdditionalSyntheticLiveLlmCaseLiveExecution"] !== true) {
    reasons.push("future_call_limit_missing");
  }
  if (r["additionalSyntheticCaseDryRunAuthorizationAccepted"] !== true) {
    reasons.push("missing_checklist_item");
  }

  // 16. Dangerous readiness must be false
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

  // 17. promptTextConstructedNow must be false
  if (r["promptTextConstructedNow"] !== false) {
    reasons.push("prompt_text_constructed_now");
  }

  // 18. Prompt/model output availability and logging
  if (r["promptTextAvailableInDryRunAuthorization"] !== false) {
    reasons.push("prompt_text_available");
  }
  if (r["modelOutputAvailableInDryRunAuthorization"] !== false) {
    reasons.push("model_output_available");
  }
  if (r["promptTextLogged"] !== false) {
    reasons.push("prompt_or_model_output_logged");
  }
  if (r["modelOutputLogged"] !== false) {
    reasons.push("prompt_or_model_output_logged");
  }

  // 19. metadataOnlyCaptureRequired
  if (r["metadataOnlyCaptureRequired"] !== true) {
    reasons.push("metadata_capture_missing");
  }

  // 20. postCallGovernanceRecheckRequired
  if (r["postCallGovernanceRecheckRequired"] !== true) {
    reasons.push("post_call_governance_recheck_missing");
  }

  // 21. postCallAuditRequired
  if (r["postCallAuditRequired"] !== true) {
    reasons.push("post_call_audit_missing");
  }

  // 22. syntheticInputOnly
  if (r["syntheticInputOnly"] !== true) {
    reasons.push("real_input_detected");
  }

  // 23. Real/raw/redacted/OCR/file/public input flags
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

  // 24. Branch C / runSmartTalk / OCR flags
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

  // 25. User-visible output
  if (r["userVisibleOutputEmitted"] !== false) {
    reasons.push("user_visible_output_detected");
  }

  // 26. Persistence / public / pilot flags
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

  // 27. Each acknowledgment field must independently contain all required statements
  // (checking both independently prevents a tamper on one from being masked by the other)
  const opAck =
    typeof input.operatorDryRunAuthorizationAcknowledgment === "string"
      ? input.operatorDryRunAuthorizationAcknowledgment
      : "";
  const revAck =
    typeof input.reviewerDryRunAuthorizationAcknowledgment === "string"
      ? input.reviewerDryRunAuthorizationAcknowledgment
      : "";
  const opAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !opAck.includes(stmt),
    );
  const revAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_LIVE_LLM_CASE_DRY_RUN_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !revAck.includes(stmt),
    );
  if (opAckMissing || revAckMissing) {
    reasons.push("missing_checklist_item");
  }

  // 28. contains* flags
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

  // 29–30. Scan string fields for forbidden content
  if (scanStrings([...input.notes, opAck, revAck])) {
    reasons.push("unsafe_authorization_note_detected");
  }

  // neverUserVisible
  if (r["neverUserVisible"] !== true) {
    reasons.push("user_visible_output_detected");
  }

  const uniqueReasons = [...new Set(reasons)];
  const accepted = uniqueReasons.length === 0;
  const isBlocked =
    !accepted && uniqueReasons.every((rr) => BLOCKING_REJECTION_REASONS.has(rr));

  const status = accepted ? "authorized" : isBlocked ? "blocked" : "rejected";

  return {
    authorizationId: input.authorizationId,
    epochId: "8.3U",
    status,
    accepted,
    rejectionReasons: uniqueReasons,

    safeAuthorizationMetadata: {
      scopeCount: input.scopes.length,
      gateCount: input.gates.length,
      checklistPassedCount: accepted ? input.checklistConfirmed.length : 0,
      selectedCase: "synthetic_explicit_payment_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      authorizationDecision: accepted
        ? input.authorizationDecision
        : "authorize_one_synthetic_case_call_next_phase",
      dryRunAuthorizationOnly: true,
      oneFutureLiveLlmCallOnly: true,
    },

    readyForAdditionalSyntheticLiveLlmCaseLiveExecution: accepted,
    additionalSyntheticCaseDryRunAuthorizationAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    dryRunAuthorizationOnly: true,
    authorizeExactlyOneSyntheticCaseCallNextPhase: true,
    futureLiveExecutionRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInDryRunAuthorization: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextConstructedNow: false,
    promptTextAvailableInDryRunAuthorization: false,
    modelOutputAvailableInDryRunAuthorization: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    metadataOnlyCaptureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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

    apiRouteModifiedByAuthorization: false,
    existingRuntimeModifiedByAuthorization: false,
    uiTouched: false,
    databaseOrStorageModifiedByAuthorization: false,
    neverUserVisible: true,
  };
}

// ── Main runner ───────────────────────────────────────────────────────────────

/**
 * Phase 8.3U — Additional Synthetic Live LLM Case Dry-Run Authorization.
 *
 * Calls `runAdditionalSyntheticLiveLlmCaseExecutionPlan()` (8.3T) as a dependency,
 * verifies its output, then validates the dry-run authorization input and runs a
 * comprehensive set of tamper cases (all using the local validator only).
 *
 * NOT auto-executed on module load.
 */
export async function runAdditionalSyntheticLiveLlmCaseDryRunAuthorization(): Promise<AdditionalSyntheticLiveLlmCaseDryRunAuthorizationCheckResult> {
  // ── 1. Dependency: Phase 8.3T ───────────────────────────────────────────────
  const executionPlanResult = await runAdditionalSyntheticLiveLlmCaseExecutionPlan();

  const r8t = asRec(executionPlanResult);

  const prerequisiteOk =
    executionPlanResult.allPassed === true &&
    r8t["readyForAdditionalSyntheticLiveLlmCaseDryRunAuthorization"] === true &&
    r8t["additionalSyntheticCaseExecutionPlanAccepted"] === true &&
    r8t["readyForLiveLLMRuntime"] === false &&
    r8t["readyForConnectedAiRuntimeExecution"] === false &&
    r8t["readyForRealOperatorPilotRun"] === false &&
    r8t["readyForPilotRunNow"] === false &&
    r8t["readyForPublicLaunch"] === false &&
    r8t["readyForPersistence"] === false &&
    r8t["readyForRealDocumentInput"] === false &&
    r8t["readyForUserVisibleOutput"] === false &&
    r8t["executionPlanOnly"] === true &&
    r8t["futureDryRunAuthorizationRequired"] === true &&
    r8t["oneFutureLiveLlmCallOnly"] === true &&
    r8t["killSwitchRequiredForFutureCall"] === true &&
    r8t["singleCallCounterRequiredForFutureCall"] === true &&
    r8t["liveLLMCalledInExecutionPlan"] === false &&
    r8t["additionalLiveLLMCallsExecuted"] === false &&
    r8t["promptTextConstructedNow"] === false &&
    r8t["promptTextAvailableInExecutionPlan"] === false &&
    r8t["modelOutputAvailableInExecutionPlan"] === false &&
    r8t["promptTextLogged"] === false &&
    r8t["modelOutputLogged"] === false &&
    r8t["syntheticInputOnly"] === true &&
    r8t["branchCDependencyAllowed"] === false &&
    r8t["runSmartTalkDependencyAllowed"] === false &&
    r8t["ocrRuntimeDependencyAllowed"] === false &&
    r8t["branchCCalled"] === false &&
    r8t["runSmartTalkCalledOrImported"] === false &&
    r8t["extractTextFromImageCalledOrImported"] === false &&
    r8t["userVisibleOutputEmitted"] === false &&
    r8t["persistenceUsed"] === false &&
    r8t["publicRuntimeEnabled"] === false &&
    r8t["realOperatorPilotExecuted"] === false &&
    r8t["neverUserVisible"] === true;

  // ── 2. Build and validate canonical input ───────────────────────────────────
  const canonicalInput = buildAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput({
    executionPlanReady: prerequisiteOk,
  });
  const mainResult =
    validateAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput(canonicalInput);

  const mainPassed = mainResult.accepted && mainResult.status === "authorized";

  // ── 3. Tamper cases (local validator only) ──────────────────────────────────

  type TamperFn = (
    base: AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput,
  ) => AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput;

  function tamper(overrides: Record<string, unknown>): TamperFn {
    return (base) =>
      ({
        ...base,
        ...overrides,
      }) as unknown as AdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput;
  }

  const base = buildAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput({
    executionPlanReady: true,
  });

  const tamperCases: Array<{ label: string; fn: TamperFn }> = [
    // Group 1: Execution plan prerequisite
    {
      label: "executionPlanReady false",
      fn: tamper({ executionPlanReadyForDryRunAuthorization: false }),
    },

    // Group 2: Missing scope/gate/checklist
    {
      label: "missing scope",
      fn: tamper({ scopes: base.scopes.filter((s) => s !== "dry_run_authorization_only") }),
    },
    {
      label: "missing gate",
      fn: tamper({ gates: base.gates.filter((g) => g !== "execution_plan_gate") }),
    },
    {
      label: "missing checklist item",
      fn: tamper({
        checklistConfirmed: base.checklistConfirmed.filter(
          (c) => c !== "execution_plan_reviewed",
        ),
      }),
    },

    // Group 3: Provider / model / case / decision
    {
      label: "wrong selectedCase",
      fn: tamper({ selectedCase: "synthetic_deadline_relative_missing_delivery_date" }),
    },
    { label: "wrong provider", fn: tamper({ provider: "anthropic" }) },
    { label: "wrong model", fn: tamper({ model: "gpt_4_turbo" }) },
    {
      label: "invalid authorizationDecision",
      fn: tamper({ authorizationDecision: "reject" }),
    },

    // Group 4: Literal invariants
    { label: "dryRunAuthorizationOnly false", fn: tamper({ dryRunAuthorizationOnly: false }) },
    {
      label: "authorizeExactlyOneSyntheticCaseCallNextPhase false",
      fn: tamper({ authorizeExactlyOneSyntheticCaseCallNextPhase: false }),
    },
    {
      label: "futureLiveExecutionRequired false",
      fn: tamper({ futureLiveExecutionRequired: false }),
    },
    {
      label: "oneFutureLiveLlmCallOnly false",
      fn: tamper({ oneFutureLiveLlmCallOnly: false }),
    },
    {
      label: "killSwitchRequiredForFutureCall false",
      fn: tamper({ killSwitchRequiredForFutureCall: false }),
    },
    {
      label: "singleCallCounterRequiredForFutureCall false",
      fn: tamper({ singleCallCounterRequiredForFutureCall: false }),
    },
    {
      label: "liveLLMCalledInDryRunAuthorization true",
      fn: tamper({ liveLLMCalledInDryRunAuthorization: true as unknown as false }),
    },
    {
      label: "additionalLiveLLMCallsExecuted true",
      fn: tamper({ additionalLiveLLMCallsExecuted: true as unknown as false }),
    },

    // Group 5: Positive gates missing
    {
      label: "readyForAdditionalSyntheticLiveLlmCaseLiveExecution false",
      fn: tamper({
        readyForAdditionalSyntheticLiveLlmCaseLiveExecution: false as unknown as true,
      }),
    },
    {
      label: "additionalSyntheticCaseDryRunAuthorizationAccepted false",
      fn: tamper({ additionalSyntheticCaseDryRunAuthorizationAccepted: false as unknown as true }),
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

    // Group 7: Prompt text / model output
    {
      label: "promptTextConstructedNow true",
      fn: tamper({ promptTextConstructedNow: true as unknown as false }),
    },
    {
      label: "promptTextAvailableInDryRunAuthorization true",
      fn: tamper({ promptTextAvailableInDryRunAuthorization: true as unknown as false }),
    },
    {
      label: "modelOutputAvailableInDryRunAuthorization true",
      fn: tamper({ modelOutputAvailableInDryRunAuthorization: true as unknown as false }),
    },
    {
      label: "promptTextLogged true",
      fn: tamper({ promptTextLogged: true as unknown as false }),
    },
    {
      label: "modelOutputLogged true",
      fn: tamper({ modelOutputLogged: true as unknown as false }),
    },

    // Group 8: Metadata / recheck / audit required
    {
      label: "metadataOnlyCaptureRequired false",
      fn: tamper({ metadataOnlyCaptureRequired: false as unknown as true }),
    },
    {
      label: "postCallGovernanceRecheckRequired false",
      fn: tamper({ postCallGovernanceRecheckRequired: false as unknown as true }),
    },
    {
      label: "postCallAuditRequired false",
      fn: tamper({ postCallAuditRequired: false as unknown as true }),
    },

    // Group 9: Input policy flags
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

    // Group 10: Branch C / runSmartTalk / OCR
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

    // Group 11: Persistence / public / pilot
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

    // Group 12: Missing acknowledgments
    {
      label: "missing operator acknowledgment",
      fn: tamper({ operatorDryRunAuthorizationAcknowledgment: "" }),
    },
    {
      label: "missing reviewer acknowledgment",
      fn: tamper({ reviewerDryRunAuthorizationAcknowledgment: "" }),
    },

    // Group 13: contains* true
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

    // Group 14: Forbidden strings in notes
    {
      label: "notes: payment live execution authorized globally",
      fn: tamper({ notes: ["payment live execution authorized globally"] }),
    },
    {
      label: "notes: payment live call executed",
      fn: tamper({ notes: ["payment live call executed"] }),
    },
    {
      label: "notes: payment prompt available",
      fn: tamper({ notes: ["payment prompt available"] }),
    },
    {
      label: "notes: payment model output available",
      fn: tamper({ notes: ["payment model output available"] }),
    },
    {
      label: "notes: real payment document authorized",
      fn: tamper({ notes: ["real payment document authorized"] }),
    },
    {
      label: "notes: real invoice authorized",
      fn: tamper({ notes: ["real invoice authorized"] }),
    },
    {
      label: "notes: public payment runtime authorized",
      fn: tamper({ notes: ["public payment runtime authorized"] }),
    },
    {
      label: "notes: user-visible payment output authorized",
      fn: tamper({ notes: ["user-visible payment output authorized"] }),
    },
    {
      label: "notes: payment production runtime ready",
      fn: tamper({ notes: ["payment production runtime ready"] }),
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
      label: "notes: production live runtime ready",
      fn: tamper({ notes: ["production live runtime ready"] }),
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
      label: "notes: payment execution live now",
      fn: tamper({ notes: ["payment execution live now"] }),
    },
    {
      label: "notes: PII email",
      fn: tamper({ notes: ["test@example.com"] }),
    },
    {
      label: "notes: approved for user display",
      fn: tamper({ notes: ["approved for user display"] }),
    },
    // Group 15: neverUserVisible false
    {
      label: "neverUserVisible false",
      fn: tamper({ neverUserVisible: false as unknown as true }),
    },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const { label, fn } of tamperCases) {
    const tampered = fn(base);
    const result = validateAdditionalSyntheticLiveLlmCaseDryRunAuthorizationInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${label}`);
    }
  }

  // ── 4. Compose final check result ───────────────────────────────────────────
  const allPassed = prerequisiteOk && mainPassed && allTamperRejected;

  return {
    checkId: "8.3U",
    allPassed,
    executionPlanReadyForDryRunAuthorization: prerequisiteOk,
    additionalSyntheticLiveLlmCaseDryRunAuthorizationAccepted: mainPassed,
    tamperCasesRejected: allTamperRejected,

    readyForAdditionalSyntheticLiveLlmCaseLiveExecution: allPassed,
    additionalSyntheticCaseDryRunAuthorizationAccepted: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    dryRunAuthorizationOnly: true,
    authorizeExactlyOneSyntheticCaseCallNextPhase: true,
    futureLiveExecutionRequired: true,
    oneFutureLiveLlmCallOnly: true,
    killSwitchRequiredForFutureCall: true,
    singleCallCounterRequiredForFutureCall: true,

    liveLLMCalledInDryRunAuthorization: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextConstructedNow: false,
    promptTextAvailableInDryRunAuthorization: false,
    modelOutputAvailableInDryRunAuthorization: false,
    promptTextLogged: false,
    modelOutputLogged: false,

    metadataOnlyCaptureRequired: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

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
      `Phase 8.3U: prerequisiteOk=${String(prerequisiteOk)}, mainPassed=${String(mainPassed)}, allTamperRejected=${String(allTamperRejected)}`,
      `tamperCaseCount=${String(tamperCases.length)}`,
      ...tamperFailures,
    ],
  };
}
