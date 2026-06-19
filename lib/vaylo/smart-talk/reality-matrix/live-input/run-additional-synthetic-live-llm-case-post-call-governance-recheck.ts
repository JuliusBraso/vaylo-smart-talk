/**
 * Additional Synthetic Live LLM Case Post-Call Governance Recheck — Phase 8.3W.
 *
 * This module is METADATA-ONLY POST-CALL GOVERNANCE RECHECK.
 * It verifies the execution metadata from Phase 8.3V for:
 *   `synthetic_explicit_payment_deadline`
 *
 * This module does NOT:
 *   - Call OpenAI directly or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Inspect model output content
 *   - Reconstruct prompt text
 *   - Process real user input
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *
 * The live LLM call was performed in Phase 8.3V. This phase only reviews the
 * resulting boolean metadata — it never touches prompt text or model output.
 */

import { runAdditionalSyntheticLiveLlmCaseLiveExecution } from "./run-additional-synthetic-live-llm-case-live-execution";
import {
  type AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput,
  type AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckResult,
  type AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckCheckResult,
  type AdditionalSyntheticLiveLlmCasePostCallGovernanceRejectionReason,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_SCOPES,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_FINDINGS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_REQUIREMENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_BLOCKERS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_CHECKLIST,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS,
  FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_STRINGS,
} from "./additional-synthetic-live-llm-case-post-call-governance-recheck-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_STRINGS.some((f) =>
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
    /\bTelefon\b/i,
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
    // "real document" alone is excluded — it appears as "real documents" in ack statement 5.
    // Specific dangerous form is caught below and by FORBIDDEN_STRINGS.
    "real document input",
    "real invoice",
    "real mahnung",
    "real payment notice",
    // "model output", "prompt text", "public runtime" are excluded because they appear in
    // required acknowledgment statements 2, 3, and 5 respectively. All specific dangerous
    // variants (e.g. "model output logged", "prompt text logged", "public runtime ready",
    // "payment model output inspected") are in FORBIDDEN_STRINGS.
    "payment model output inspected",
    "payment prompt reconstructed",
    "payment answer approved for user",
    "real payment document rechecked",
    "public payment runtime rechecked",
    "payment output ready for display",
    "production payment recheck passed",
    "real document payment governance passed",
    "live llm call performed",
    "live llm call executed",
    "payment execution persisted",
    "payment output displayed",
    "public payment runtime enabled",
    "real payment user visible",
    "production payment runtime enabled",
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
 * Builds a canonical `AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput`.
 *
 * Default params represent a successful 8.3V execution result ready for recheck.
 * When params indicate the execution was not ready or failed, blocking fields are
 * set to `false` using `as unknown as T` so the validator correctly detects them.
 */
export function buildAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput(params?: {
  readonly liveExecutionReady?: boolean;
  readonly liveExecutionAllPassed?: boolean;
}): AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput {
  const executionReady = params?.liveExecutionReady ?? true;
  const executionAllPassed = params?.liveExecutionAllPassed ?? true;

  return {
    recheckId: "additional-synthetic-live-llm-case-post-call-governance-recheck-8-3w",
    epochId: "8.3W",
    previousPhaseId: "8.3V",

    liveExecutionReadyForPostCallGovernanceRecheck: executionReady,
    liveExecutionAllPassed: executionAllPassed,

    selectedCase: "synthetic_explicit_payment_deadline",
    provider: "openai",
    model: "gpt_4o_mini",

    scopes: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_SCOPES,
    findings: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_FINDINGS,
    requirements: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_REQUIREMENTS,
    blockers: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_BLOCKERS,
    checklistConfirmed: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_CHECKLIST,

    postCallGovernanceRecheckOnly: true,
    metadataOnlyRecheck: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByRecheck: false,
    liveLLMCalledAgainByRecheck: false,

    liveLLMCalled: true,
    liveLLMCalledExactlyOnce: true,
    modelOutputReceived: true,
    modelOutputMarkedUntrusted: true,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForRecheck: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForRecheck: false,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    additionalSyntheticCasePostCallGovernanceRecheckPassed: true,
    readyForAdditionalSyntheticLiveLlmCasePostCallAudit: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByRecheck: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorPostCallGovernanceRecheckAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS.join(" "),
    reviewerPostCallGovernanceRecheckAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS.join(" "),

    notes: [
      "additional synthetic explicit payment deadline post-call governance recheck completed using metadata only",
      "LLM output remains unavailable and marked untrusted; raw response was discarded in 8.3V",
      "ready for post-call audit only",
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
  new Set<AdditionalSyntheticLiveLlmCasePostCallGovernanceRejectionReason>([
    "live_execution_not_ready",
    "live_execution_not_passed",
  ]);

/**
 * Validates an `AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput`.
 *
 * Status semantics:
 *   "passed"  — all checks pass; post-call governance recheck accepted.
 *   "blocked" — live execution prerequisite not satisfied (safe prevention).
 *   "rejected" — at least one unsafe invariant violated.
 */
export function validateAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput(
  input: AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput,
): AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckResult {
  const r = asRec(input);
  const reasons: AdditionalSyntheticLiveLlmCasePostCallGovernanceRejectionReason[] = [];

  // 1. Live execution prerequisites
  if (!input.liveExecutionReadyForPostCallGovernanceRecheck) {
    reasons.push("live_execution_not_ready");
  }
  if (!input.liveExecutionAllPassed) {
    reasons.push("live_execution_not_passed");
  }

  // 2. Selected case / provider / model
  if (r["selectedCase"] !== "synthetic_explicit_payment_deadline") {
    reasons.push("selected_case_invalid");
  }
  if (r["provider"] !== "openai") {
    reasons.push("provider_invalid");
  }
  if (r["model"] !== "gpt_4o_mini") {
    reasons.push("model_invalid");
  }

  // 3. Required lists
  for (const scope of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_RECHECK_SCOPES) {
    if (!input.scopes.includes(scope)) {
      reasons.push("missing_recheck_scope");
      break;
    }
  }
  for (const finding of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_FINDINGS) {
    if (!input.findings.includes(finding)) {
      reasons.push("missing_finding");
      break;
    }
  }
  for (const req of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_REQUIREMENTS) {
    if (!input.requirements.includes(req)) {
      reasons.push("missing_requirement");
      break;
    }
  }
  for (const blocker of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_BLOCKERS) {
    if (!input.blockers.includes(blocker)) {
      reasons.push("missing_blocker");
      break;
    }
  }
  for (const item of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      reasons.push("missing_checklist_item");
      break;
    }
  }

  // 4. Recheck-only flags
  if (r["postCallGovernanceRecheckOnly"] !== true) {
    reasons.push("direct_openai_call_detected_in_recheck");
  }
  if (r["metadataOnlyRecheck"] !== true) {
    reasons.push("model_output_content_inspection_detected");
  }
  if (r["modelOutputContentInspected"] !== false) {
    reasons.push("model_output_content_inspection_detected");
  }
  if (r["promptTextReconstructed"] !== false) {
    reasons.push("prompt_reconstruction_detected");
  }
  if (r["directOpenAiCallMadeByRecheck"] !== false) {
    reasons.push("direct_openai_call_detected_in_recheck");
  }
  if (r["liveLLMCalledAgainByRecheck"] !== false) {
    reasons.push("direct_openai_call_detected_in_recheck");
  }

  // 5. Live call outcome
  if (r["liveLLMCalled"] !== true) {
    reasons.push("live_llm_not_called");
  }
  if (r["liveLLMCalledExactlyOnce"] !== true) {
    reasons.push("live_llm_not_called_exactly_once");
  }
  if (r["modelOutputReceived"] !== true) {
    reasons.push("model_output_not_received");
  }
  if (r["modelOutputMarkedUntrusted"] !== true) {
    reasons.push("model_output_not_untrusted");
  }

  // 6. API key non-exposure
  if (r["apiKeyValueLogged"] !== false) {
    reasons.push("api_key_value_logged");
  }
  if (r["apiKeyValueReturned"] !== false) {
    reasons.push("api_key_value_returned");
  }

  // 7. Prompt non-exposure
  if (r["promptTextAvailableForRecheck"] !== false) {
    reasons.push("prompt_text_logged");
  }
  if (r["promptTextLogged"] !== false) {
    reasons.push("prompt_text_logged");
  }
  if (r["promptTextStored"] !== false) {
    reasons.push("prompt_text_stored");
  }
  if (r["promptTextReturned"] !== false) {
    reasons.push("prompt_text_returned");
  }

  // 8. Model output non-exposure
  if (r["modelOutputAvailableForRecheck"] !== false) {
    reasons.push("model_output_logged");
  }
  if (r["modelOutputLogged"] !== false) {
    reasons.push("model_output_logged");
  }
  if (r["modelOutputStored"] !== false) {
    reasons.push("model_output_stored");
  }
  if (r["modelOutputReturned"] !== false) {
    reasons.push("model_output_returned");
  }

  // 9. Metadata / recheck / audit
  if (r["metadataOnlyCaptured"] !== true) {
    reasons.push("metadata_only_capture_missing");
  }
  if (r["postCallGovernanceRecheckRequired"] !== true) {
    reasons.push("post_call_governance_recheck_missing");
  }
  if (r["postCallAuditRequired"] !== true) {
    reasons.push("post_call_audit_missing");
  }

  // 10. Positive recheck gates
  if (r["additionalSyntheticCasePostCallGovernanceRecheckPassed"] !== true) {
    reasons.push("missing_checklist_item");
  }
  if (r["readyForAdditionalSyntheticLiveLlmCasePostCallAudit"] !== true) {
    reasons.push("missing_checklist_item");
  }

  // 11. Dangerous readiness must be false
  if (r["readyForLiveLLMRuntime"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
  }
  if (r["readyForConnectedAiRuntimeExecution"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
  }
  if (r["readyForRealOperatorPilotRun"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
  }
  if (r["readyForPilotRunNow"] !== false) {
    reasons.push("general_live_llm_runtime_authorized");
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

  // 12. Input policy flags
  if (r["syntheticInputOnly"] !== true) {
    reasons.push("synthetic_input_only_missing");
  }
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
  if (r["realDocumentInputAllowed"] !== false) {
    reasons.push("real_document_input_authorized");
  }

  // 13. Branch C / runSmartTalk / OCR
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

  // 14. User-visible output
  if (r["userVisibleOutputEmitted"] !== false) {
    reasons.push("user_visible_output_detected");
  }
  if (r["userVisibleOutputAuthorizedByRecheck"] !== false) {
    reasons.push("user_visible_output_detected");
  }

  // 15. Persistence / public / pilot
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
    reasons.push("general_live_llm_runtime_authorized");
  }

  // 16. Each acknowledgment field must independently contain all required statements
  const opAck =
    typeof input.operatorPostCallGovernanceRecheckAcknowledgment === "string"
      ? input.operatorPostCallGovernanceRecheckAcknowledgment
      : "";
  const revAck =
    typeof input.reviewerPostCallGovernanceRecheckAcknowledgment === "string"
      ? input.reviewerPostCallGovernanceRecheckAcknowledgment
      : "";
  const opAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !opAck.includes(stmt),
    );
  const revAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_GOVERNANCE_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !revAck.includes(stmt),
    );
  if (opAckMissing || revAckMissing) {
    reasons.push("missing_checklist_item");
  }

  // 17. contains* flags
  if (r["containsRealUserInput"] !== false) {
    reasons.push("real_input_detected");
  }
  if (r["containsRawInputText"] !== false) {
    reasons.push("forbidden_raw_text_detected");
  }
  if (r["containsRedactedText"] !== false) {
    reasons.push("forbidden_redacted_text_detected");
  }
  if (r["containsFullDraftText"] !== false) {
    reasons.push("prompt_text_logged");
  }
  if (r["containsModelOutput"] !== false) {
    reasons.push("forbidden_model_output_detected");
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

  // 18. Scan string fields for forbidden content
  if (scanStrings([...input.notes, opAck, revAck])) {
    reasons.push("unsafe_recheck_note_detected");
  }

  // neverUserVisible
  if (r["neverUserVisible"] !== true) {
    reasons.push("user_visible_output_detected");
  }

  const uniqueReasons = [...new Set(reasons)];
  const accepted = uniqueReasons.length === 0;
  const isBlocked =
    !accepted && uniqueReasons.every((rr) => BLOCKING_REJECTION_REASONS.has(rr));

  const status = accepted ? "passed" : isBlocked ? "blocked" : "rejected";

  return {
    recheckId: input.recheckId,
    epochId: "8.3W",
    status,
    accepted,
    rejectionReasons: uniqueReasons,

    safeRecheckMetadata: {
      selectedCase: "synthetic_explicit_payment_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      scopeCount: input.scopes.length,
      findingCount: input.findings.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: accepted ? input.checklistConfirmed.length : 0,
      metadataOnlyRecheck: true,
      liveLLMCalledExactlyOnce: true,
      modelOutputMarkedUntrusted: true,
      modelOutputContentInspected: false,
      promptTextReconstructed: false,
    },

    additionalSyntheticCasePostCallGovernanceRecheckPassed: accepted,
    readyForAdditionalSyntheticLiveLlmCasePostCallAudit: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    postCallGovernanceRecheckOnly: true,
    metadataOnlyRecheck: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByRecheck: false,
    liveLLMCalledAgainByRecheck: false,

    liveLLMCalled: accepted,
    liveLLMCalledExactlyOnce: accepted,
    modelOutputReceived: accepted,
    modelOutputMarkedUntrusted: accepted,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForRecheck: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForRecheck: false,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByRecheck: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteCalledByRecheck: false,
    apiRouteModifiedByRecheck: false,
    existingRuntimeModifiedByRecheck: false,
    uiTouched: false,
    databaseOrStorageModifiedByRecheck: false,
    neverUserVisible: true,
  };
}

// ── Main runner ───────────────────────────────────────────────────────────────

/**
 * Phase 8.3W — Additional Synthetic Live LLM Case Post-Call Governance Recheck.
 *
 * 1. Calls `runAdditionalSyntheticLiveLlmCaseLiveExecution()` (8.3V) as dependency.
 * 2. Verifies all execution safety invariants from 8.3V metadata.
 * 3. Validates the recheck input using the local validator.
 * 4. Runs tamper cases (local validator only — no additional live calls, no OpenAI).
 *
 * NOT auto-executed on module load.
 */
export async function runAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck(): Promise<AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckCheckResult> {
  // ── 1. Dependency: Phase 8.3V ───────────────────────────────────────────────
  const liveExecResult = await runAdditionalSyntheticLiveLlmCaseLiveExecution();

  const r8v = asRec(liveExecResult);

  const prerequisiteOk =
    liveExecResult.allPassed === true &&
    r8v["dryRunAuthorizationReadyForLiveExecution"] === true &&
    r8v["additionalSyntheticLiveLlmCaseLiveExecutionAccepted"] === true &&
    r8v["readyForAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck"] === true &&
    r8v["readyForAdditionalSyntheticLiveLlmCasePostCallAudit"] === true &&
    r8v["liveLLMCalled"] === true &&
    r8v["liveLLMCalledExactlyOnce"] === true &&
    r8v["modelOutputReceived"] === true &&
    r8v["modelOutputMarkedUntrusted"] === true &&
    r8v["apiKeyValueLogged"] === false &&
    r8v["apiKeyValueReturned"] === false &&
    r8v["promptConstructedInMemoryOnly"] === true &&
    r8v["promptTextLogged"] === false &&
    r8v["promptTextStored"] === false &&
    r8v["promptTextReturned"] === false &&
    r8v["modelOutputLogged"] === false &&
    r8v["modelOutputStored"] === false &&
    r8v["modelOutputReturned"] === false &&
    r8v["metadataOnlyCaptured"] === true &&
    r8v["postCallGovernanceRecheckRequired"] === true &&
    r8v["postCallAuditRequired"] === true &&
    r8v["syntheticInputOnly"] === true &&
    r8v["realUserInputAllowed"] === false &&
    r8v["rawInputAllowed"] === false &&
    r8v["realRedactedInputAllowed"] === false &&
    r8v["photoOrOcrInputAllowed"] === false &&
    r8v["fileUploadInputAllowed"] === false &&
    r8v["publicAnonymousInputAllowed"] === false &&
    r8v["realDocumentInputAllowed"] === false &&
    r8v["branchCDependencyAllowed"] === false &&
    r8v["runSmartTalkDependencyAllowed"] === false &&
    r8v["ocrRuntimeDependencyAllowed"] === false &&
    r8v["branchCCalled"] === false &&
    r8v["runSmartTalkCalledOrImported"] === false &&
    r8v["extractTextFromImageCalledOrImported"] === false &&
    r8v["userVisibleOutputEmitted"] === false &&
    r8v["persistenceUsed"] === false &&
    r8v["publicRuntimeEnabled"] === false &&
    r8v["readyForLiveLLMRuntime"] === false &&
    r8v["readyForConnectedAiRuntimeExecution"] === false &&
    r8v["readyForRealOperatorPilotRun"] === false &&
    r8v["readyForPilotRunNow"] === false &&
    r8v["readyForPublicLaunch"] === false &&
    r8v["readyForPersistence"] === false &&
    r8v["readyForRealDocumentInput"] === false &&
    r8v["readyForUserVisibleOutput"] === false &&
    r8v["neverUserVisible"] === true;

  // ── 2. Build and validate canonical input ───────────────────────────────────
  const canonicalInput = buildAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput({
    liveExecutionReady: prerequisiteOk,
    liveExecutionAllPassed: prerequisiteOk,
  });
  const mainResult =
    validateAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput(canonicalInput);

  const mainPassed = mainResult.accepted && mainResult.status === "passed";

  // ── 3. Tamper cases (local validator only — no extra live calls) ─────────────

  type TamperFn = (
    base: AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput,
  ) => AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput;

  function tamper(overrides: Record<string, unknown>): TamperFn {
    return (base) =>
      ({
        ...base,
        ...overrides,
      }) as unknown as AdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput;
  }

  const base = buildAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput({
    liveExecutionReady: true,
    liveExecutionAllPassed: true,
  });

  const tamperCases: Array<{ label: string; fn: TamperFn }> = [
    // Group 1: Live execution prerequisites
    {
      label: "liveExecutionReady false",
      fn: tamper({ liveExecutionReadyForPostCallGovernanceRecheck: false }),
    },
    {
      label: "liveExecutionAllPassed false",
      fn: tamper({ liveExecutionAllPassed: false }),
    },

    // Group 2: Case / provider / model
    {
      label: "wrong selectedCase",
      fn: tamper({ selectedCase: "synthetic_deadline_relative_missing_delivery_date" }),
    },
    { label: "wrong provider", fn: tamper({ provider: "anthropic" }) },
    { label: "wrong model", fn: tamper({ model: "gpt_4_turbo" }) },

    // Group 3: Missing required lists
    {
      label: "missing scope",
      fn: tamper({
        scopes: base.scopes.filter((s) => s !== "post_call_governance_recheck"),
      }),
    },
    {
      label: "missing finding",
      fn: tamper({
        findings: base.findings.filter((f) => f !== "live_execution_completed"),
      }),
    },
    {
      label: "missing requirement",
      fn: tamper({
        requirements: base.requirements.filter(
          (req) => req !== "require_live_execution_all_passed",
        ),
      }),
    },
    {
      label: "missing blocker",
      fn: tamper({
        blockers: base.blockers.filter((b) => b !== "live_execution_not_ready"),
      }),
    },
    {
      label: "missing checklist item",
      fn: tamper({
        checklistConfirmed: base.checklistConfirmed.filter(
          (c) => c !== "live_execution_result_reviewed",
        ),
      }),
    },

    // Group 4: Recheck-only flags
    {
      label: "postCallGovernanceRecheckOnly false",
      fn: tamper({ postCallGovernanceRecheckOnly: false as unknown as true }),
    },
    {
      label: "metadataOnlyRecheck false",
      fn: tamper({ metadataOnlyRecheck: false as unknown as true }),
    },
    {
      label: "modelOutputContentInspected true",
      fn: tamper({ modelOutputContentInspected: true as unknown as false }),
    },
    {
      label: "promptTextReconstructed true",
      fn: tamper({ promptTextReconstructed: true as unknown as false }),
    },
    {
      label: "directOpenAiCallMadeByRecheck true",
      fn: tamper({ directOpenAiCallMadeByRecheck: true as unknown as false }),
    },
    {
      label: "liveLLMCalledAgainByRecheck true",
      fn: tamper({ liveLLMCalledAgainByRecheck: true as unknown as false }),
    },

    // Group 5: Live call outcome
    {
      label: "liveLLMCalled false",
      fn: tamper({ liveLLMCalled: false as unknown as true }),
    },
    {
      label: "liveLLMCalledExactlyOnce false",
      fn: tamper({ liveLLMCalledExactlyOnce: false as unknown as true }),
    },
    {
      label: "modelOutputReceived false",
      fn: tamper({ modelOutputReceived: false as unknown as true }),
    },
    {
      label: "modelOutputMarkedUntrusted false",
      fn: tamper({ modelOutputMarkedUntrusted: false as unknown as true }),
    },

    // Group 6: API key non-exposure
    {
      label: "apiKeyValueLogged true",
      fn: tamper({ apiKeyValueLogged: true as unknown as false }),
    },
    {
      label: "apiKeyValueReturned true",
      fn: tamper({ apiKeyValueReturned: true as unknown as false }),
    },

    // Group 7: Prompt non-exposure
    {
      label: "promptTextAvailableForRecheck true",
      fn: tamper({ promptTextAvailableForRecheck: true as unknown as false }),
    },
    {
      label: "promptTextLogged true",
      fn: tamper({ promptTextLogged: true as unknown as false }),
    },
    {
      label: "promptTextStored true",
      fn: tamper({ promptTextStored: true as unknown as false }),
    },
    {
      label: "promptTextReturned true",
      fn: tamper({ promptTextReturned: true as unknown as false }),
    },

    // Group 8: Model output non-exposure
    {
      label: "modelOutputAvailableForRecheck true",
      fn: tamper({ modelOutputAvailableForRecheck: true as unknown as false }),
    },
    {
      label: "modelOutputLogged true",
      fn: tamper({ modelOutputLogged: true as unknown as false }),
    },
    {
      label: "modelOutputStored true",
      fn: tamper({ modelOutputStored: true as unknown as false }),
    },
    {
      label: "modelOutputReturned true",
      fn: tamper({ modelOutputReturned: true as unknown as false }),
    },

    // Group 9: Metadata / recheck / audit
    {
      label: "metadataOnlyCaptured false",
      fn: tamper({ metadataOnlyCaptured: false as unknown as true }),
    },
    {
      label: "postCallGovernanceRecheckRequired false",
      fn: tamper({ postCallGovernanceRecheckRequired: false as unknown as true }),
    },
    {
      label: "postCallAuditRequired false",
      fn: tamper({ postCallAuditRequired: false as unknown as true }),
    },

    // Group 10: Positive recheck gates
    {
      label: "additionalSyntheticCasePostCallGovernanceRecheckPassed false",
      fn: tamper({ additionalSyntheticCasePostCallGovernanceRecheckPassed: false }),
    },
    {
      label: "readyForAdditionalSyntheticLiveLlmCasePostCallAudit false",
      fn: tamper({ readyForAdditionalSyntheticLiveLlmCasePostCallAudit: false }),
    },

    // Group 11: Dangerous readiness true
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

    // Group 12: Input policy flags
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
    {
      label: "realDocumentInputAllowed true",
      fn: tamper({ realDocumentInputAllowed: true as unknown as false }),
    },

    // Group 13: Branch C / runSmartTalk / OCR
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

    // Group 14: User-visible output
    {
      label: "userVisibleOutputEmitted true",
      fn: tamper({ userVisibleOutputEmitted: true as unknown as false }),
    },
    {
      label: "userVisibleOutputAuthorizedByRecheck true",
      fn: tamper({ userVisibleOutputAuthorizedByRecheck: true as unknown as false }),
    },

    // Group 15: Persistence / public / pilot
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

    // Group 16: Missing acknowledgments
    {
      label: "missing operator acknowledgment",
      fn: tamper({ operatorPostCallGovernanceRecheckAcknowledgment: "" }),
    },
    {
      label: "missing reviewer acknowledgment",
      fn: tamper({ reviewerPostCallGovernanceRecheckAcknowledgment: "" }),
    },

    // Group 17: contains* flags true
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

    // Group 18: Forbidden strings in notes
    {
      label: "notes: payment model output inspected",
      fn: tamper({ notes: ["payment model output inspected"] }),
    },
    {
      label: "notes: payment prompt reconstructed",
      fn: tamper({ notes: ["payment prompt reconstructed"] }),
    },
    {
      label: "notes: payment answer approved for user",
      fn: tamper({ notes: ["payment answer approved for user"] }),
    },
    {
      label: "notes: real payment document rechecked",
      fn: tamper({ notes: ["real payment document rechecked"] }),
    },
    {
      label: "notes: public payment runtime rechecked",
      fn: tamper({ notes: ["public payment runtime rechecked"] }),
    },
    {
      label: "notes: payment output ready for display",
      fn: tamper({ notes: ["payment output ready for display"] }),
    },
    {
      label: "notes: production payment recheck passed",
      fn: tamper({ notes: ["production payment recheck passed"] }),
    },
    {
      label: "notes: real document payment governance passed",
      fn: tamper({ notes: ["real document payment governance passed"] }),
    },
    {
      label: "notes: OPENAI_API_KEY=",
      fn: tamper({ notes: ["OPENAI_API_KEY=abc"] }),
    },
    {
      label: "notes: sk-key",
      fn: tamper({ notes: ["sk-abc1234567890"] }),
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
      label: "notes: IBAN",
      fn: tamper({ notes: ["IBAN: DE12 3456 7890"] }),
    },
    {
      label: "notes: Sehr geehrter",
      fn: tamper({ notes: ["Sehr geehrter Herr Mustermann"] }),
    },
    {
      label: "notes: Telefon",
      fn: tamper({ notes: ["Telefon: 0800 123456789"] }),
    },
    {
      label: "notes: you must pay",
      fn: tamper({ notes: ["you must pay now"] }),
    },
    {
      label: "notes: prompt text logged",
      fn: tamper({ notes: ["prompt text logged"] }),
    },
    {
      label: "notes: model output logged",
      fn: tamper({ notes: ["model output logged"] }),
    },
    {
      label: "notes: public runtime ready",
      fn: tamper({ notes: ["public runtime ready"] }),
    },
    {
      label: "notes: real document input ready",
      fn: tamper({ notes: ["real document input ready"] }),
    },
    {
      label: "notes: authorized public runtime",
      fn: tamper({ notes: ["authorized public runtime"] }),
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
      label: "notes: audit persisted",
      fn: tamper({ notes: ["audit persisted"] }),
    },
    {
      label: "notes: additional live calls executed",
      fn: tamper({ notes: ["additional live calls executed"] }),
    },

    // Group 19: neverUserVisible false
    {
      label: "neverUserVisible false",
      fn: tamper({ neverUserVisible: false as unknown as true }),
    },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const { label, fn } of tamperCases) {
    const tampered = fn(base);
    const result =
      validateAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheckInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${label}`);
    }
  }

  // ── 4. Compose final check result ────────────────────────────────────────────
  const allPassed = prerequisiteOk && mainPassed && allTamperRejected;

  return {
    checkId: "8.3W",
    allPassed,
    liveExecutionReadyForPostCallGovernanceRecheck: prerequisiteOk,
    additionalSyntheticCasePostCallGovernanceRecheckPassed: allPassed,
    tamperCasesRejected: allTamperRejected,

    readyForAdditionalSyntheticLiveLlmCasePostCallAudit: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    postCallGovernanceRecheckOnly: true,
    metadataOnlyRecheck: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByRecheck: false,
    liveLLMCalledAgainByRecheck: false,

    liveLLMCalled: allPassed,
    liveLLMCalledExactlyOnce: allPassed,
    modelOutputReceived: allPassed,
    modelOutputMarkedUntrusted: allPassed,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForRecheck: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForRecheck: false,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    syntheticInputOnly: true,
    realUserInputAllowed: false,
    rawInputAllowed: false,
    realRedactedInputAllowed: false,
    photoOrOcrInputAllowed: false,
    fileUploadInputAllowed: false,
    publicAnonymousInputAllowed: false,
    realDocumentInputAllowed: false,

    branchCDependencyAllowed: false,
    runSmartTalkDependencyAllowed: false,
    ocrRuntimeDependencyAllowed: false,

    branchCCalled: false,
    runSmartTalkCalledOrImported: false,
    extractTextFromImageCalledOrImported: false,

    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByRecheck: false,

    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,
    neverUserVisible: true,

    notes: [
      `Phase 8.3W: prerequisiteOk=${String(prerequisiteOk)}, mainPassed=${String(mainPassed)}, allTamperRejected=${String(allTamperRejected)}`,
      `tamperCaseCount=${String(tamperCases.length)}`,
      ...tamperFailures,
    ],
  };
}
