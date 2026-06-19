/**
 * Additional Synthetic Live LLM Case Post-Call Audit — Phase 8.3X.
 *
 * This module is METADATA-ONLY POST-CALL AUDIT.
 * It audits 8.3W and 8.3V metadata only for:
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
 * Architecture debt note: this phase calls
 * runAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck() (8.3W), which in
 * turn calls runAdditionalSyntheticLiveLlmCaseLiveExecution() (8.3V). Future
 * post-call audit phases should accept a pre-computed / cached metadata result
 * object instead of re-invoking the dependency chain, to avoid re-executing
 * live calls during audit/recheck.
 */

import { runAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck } from "./run-additional-synthetic-live-llm-case-post-call-governance-recheck";
import {
  type AdditionalSyntheticLiveLlmCasePostCallAuditInput,
  type AdditionalSyntheticLiveLlmCasePostCallAuditResult,
  type AdditionalSyntheticLiveLlmCasePostCallAuditCheckResult,
  type AdditionalSyntheticLiveLlmCasePostCallAuditRejectionReason,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_SCOPES,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_FINDINGS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_REQUIREMENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_BLOCKERS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_CHECKLIST,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES,
  FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_STRINGS,
} from "./additional-synthetic-live-llm-case-post-call-audit-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_STRINGS.some((f) =>
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
  // Generic terms ("model output", "prompt text", "public runtime", "real documents")
  // are excluded here because they appear in required acknowledgment statements 2, 3, and 5.
  // Specific dangerous variants are caught by FORBIDDEN_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_STRINGS.
  const unsafe = [
    "real authority",
    "real person",
    "real address",
    "real document input",
    "real invoice",
    "real mahnung",
    "real payment notice",
    "payment model output audited",
    "payment prompt audited",
    "payment answer approved for user",
    "real payment document audited",
    "public payment runtime audited",
    "payment output ready for display",
    "production payment audit passed",
    "real document payment audit passed",
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
 * Builds a canonical `AdditionalSyntheticLiveLlmCasePostCallAuditInput`.
 *
 * Default params represent a successful 8.3W result ready for audit.
 * When params indicate the recheck was not ready or failed, blocking flags are
 * set to `false` using `as unknown as T` so the validator correctly detects them.
 */
export function buildAdditionalSyntheticLiveLlmCasePostCallAuditInput(params?: {
  readonly postCallGovernanceRecheckReady?: boolean;
  readonly postCallGovernanceRecheckAllPassed?: boolean;
}): AdditionalSyntheticLiveLlmCasePostCallAuditInput {
  const recheckReady = params?.postCallGovernanceRecheckReady ?? true;
  const recheckAllPassed = params?.postCallGovernanceRecheckAllPassed ?? true;

  return {
    auditId: "additional-synthetic-live-llm-case-post-call-audit-8-3x",
    epochId: "8.3X",
    previousPhaseId: "8.3W",

    postCallGovernanceRecheckReadyForAudit: recheckReady,
    postCallGovernanceRecheckAllPassed: recheckAllPassed,

    selectedCase: "synthetic_explicit_payment_deadline",
    provider: "openai",
    model: "gpt_4o_mini",

    scopes: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_SCOPES,
    findings: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_FINDINGS,
    requirements: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_REQUIREMENTS,
    blockers: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_BLOCKERS,
    checklistConfirmed: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_CHECKLIST,

    postCallAuditOnly: true,
    metadataOnlyAudit: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByAudit: false,
    liveLLMCalledAgainByAudit: false,

    postCallGovernanceRecheckPassed: true,
    liveExecutionPassed: true,

    liveLLMCalled: true,
    liveLLMCalledExactlyOnce: true,
    modelOutputReceived: true,
    modelOutputMarkedUntrusted: true,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallGovernanceRecheckRequired: true,
    postCallAuditRequired: true,

    additionalSyntheticCasePostCallAuditPassed: true,
    readyForNextSyntheticCasePlanning: true,
    readyForControlledRealDocumentAuthorizationPlanning: true,

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
    userVisibleOutputAuthorizedByAudit: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,
    technicalDebtNotes: REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES,

    operatorPostCallAuditAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS.join(" "),
    reviewerPostCallAuditAcknowledgment:
      REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS.join(" "),

    notes: [
      "additional synthetic explicit payment deadline post-call audit completed using metadata only",
      "second synthetic live LLM case is closed with governance audit",
      "ready for next synthetic case planning or controlled real document authorization planning only",
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
  new Set<AdditionalSyntheticLiveLlmCasePostCallAuditRejectionReason>([
    "post_call_governance_recheck_not_ready",
    "post_call_governance_recheck_not_passed",
  ]);

/**
 * Validates an `AdditionalSyntheticLiveLlmCasePostCallAuditInput`.
 *
 * Status semantics:
 *   "passed"  — all checks pass; post-call audit accepted.
 *   "blocked" — governance recheck prerequisite not satisfied (safe prevention).
 *   "rejected" — at least one unsafe invariant violated.
 */
export function validateAdditionalSyntheticLiveLlmCasePostCallAuditInput(
  input: AdditionalSyntheticLiveLlmCasePostCallAuditInput,
): AdditionalSyntheticLiveLlmCasePostCallAuditResult {
  const r = asRec(input);
  const reasons: AdditionalSyntheticLiveLlmCasePostCallAuditRejectionReason[] = [];

  // 1. Governance recheck prerequisites
  if (!input.postCallGovernanceRecheckReadyForAudit) {
    reasons.push("post_call_governance_recheck_not_ready");
  }
  if (!input.postCallGovernanceRecheckAllPassed) {
    reasons.push("post_call_governance_recheck_not_passed");
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
  for (const scope of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_SCOPES) {
    if (!input.scopes.includes(scope)) {
      reasons.push("missing_audit_scope");
      break;
    }
  }
  for (const finding of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_FINDINGS) {
    if (!input.findings.includes(finding)) {
      reasons.push("missing_finding");
      break;
    }
  }
  for (const req of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_REQUIREMENTS) {
    if (!input.requirements.includes(req)) {
      reasons.push("missing_requirement");
      break;
    }
  }
  for (const blocker of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_BLOCKERS) {
    if (!input.blockers.includes(blocker)) {
      reasons.push("missing_blocker");
      break;
    }
  }
  for (const item of REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      reasons.push("missing_checklist_item");
      break;
    }
  }

  // 4. Audit-only flags
  if (r["postCallAuditOnly"] !== true) {
    reasons.push("direct_openai_call_detected_in_audit");
  }
  if (r["metadataOnlyAudit"] !== true) {
    reasons.push("model_output_content_inspection_detected");
  }
  if (r["modelOutputContentInspected"] !== false) {
    reasons.push("model_output_content_inspection_detected");
  }
  if (r["promptTextReconstructed"] !== false) {
    reasons.push("prompt_reconstruction_detected");
  }
  if (r["directOpenAiCallMadeByAudit"] !== false) {
    reasons.push("direct_openai_call_detected_in_audit");
  }
  if (r["liveLLMCalledAgainByAudit"] !== false) {
    reasons.push("direct_openai_call_detected_in_audit");
  }

  // 5. Governance recheck / live execution passed
  if (r["postCallGovernanceRecheckPassed"] !== true) {
    reasons.push("post_call_governance_recheck_not_passed");
  }
  if (r["liveExecutionPassed"] !== true) {
    reasons.push("live_execution_not_passed");
  }

  // 6. Live call outcome
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

  // 7. API key non-exposure
  if (r["apiKeyValueLogged"] !== false) {
    reasons.push("api_key_value_logged");
  }
  if (r["apiKeyValueReturned"] !== false) {
    reasons.push("api_key_value_returned");
  }

  // 8. Prompt non-exposure
  if (r["promptTextAvailableForAudit"] !== false) {
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

  // 9. Model output non-exposure
  if (r["modelOutputAvailableForAudit"] !== false) {
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

  // 10. Metadata / recheck / audit
  if (r["metadataOnlyCaptured"] !== true) {
    reasons.push("metadata_only_capture_missing");
  }
  if (r["postCallGovernanceRecheckRequired"] !== true) {
    reasons.push("post_call_governance_recheck_missing");
  }
  if (r["postCallAuditRequired"] !== true) {
    reasons.push("post_call_audit_missing");
  }

  // 11. Positive audit gates
  if (r["additionalSyntheticCasePostCallAuditPassed"] !== true) {
    reasons.push("missing_checklist_item");
  }
  if (r["readyForNextSyntheticCasePlanning"] !== true) {
    reasons.push("missing_checklist_item");
  }
  if (r["readyForControlledRealDocumentAuthorizationPlanning"] !== true) {
    reasons.push("missing_checklist_item");
  }

  // 12. Dangerous readiness must be false
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

  // 13. Input policy flags
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

  // 14. Branch C / runSmartTalk / OCR
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

  // 15. User-visible output
  if (r["userVisibleOutputEmitted"] !== false) {
    reasons.push("user_visible_output_detected");
  }
  if (r["userVisibleOutputAuthorizedByAudit"] !== false) {
    reasons.push("user_visible_output_detected");
  }

  // 16. Persistence / public / pilot
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

  // 17. Technical debt tracking
  if (r["broadEslintDebtTracked"] !== true) {
    reasons.push("technical_debt_not_tracked");
  }
  if (r["postCallCachedMetadataDebtTracked"] !== true) {
    reasons.push("technical_debt_not_tracked");
  }
  const debtNotes = Array.isArray(input.technicalDebtNotes) ? input.technicalDebtNotes : [];
  const missingBroadNote = !debtNotes.some((n) =>
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES[0]
      ? n.includes(
          REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES[0].slice(0, 40),
        )
      : false,
  );
  const missingCachedNote = !debtNotes.some((n) =>
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES[1]
      ? n.includes(
          REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_DEBT_NOTES[1].slice(0, 40),
        )
      : false,
  );
  if (missingBroadNote || missingCachedNote) {
    reasons.push("technical_debt_not_tracked");
  }

  // 18. Each acknowledgment field must independently contain all required statements
  const opAck =
    typeof input.operatorPostCallAuditAcknowledgment === "string"
      ? input.operatorPostCallAuditAcknowledgment
      : "";
  const revAck =
    typeof input.reviewerPostCallAuditAcknowledgment === "string"
      ? input.reviewerPostCallAuditAcknowledgment
      : "";
  const opAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !opAck.includes(stmt),
    );
  const revAckMissing =
    REQUIRED_ADDITIONAL_SYNTHETIC_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !revAck.includes(stmt),
    );
  if (opAckMissing || revAckMissing) {
    reasons.push("missing_checklist_item");
  }

  // 19. contains* flags
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

  // 20. Scan all string fields for forbidden content
  if (scanStrings([...input.notes, opAck, revAck, ...debtNotes])) {
    reasons.push("unsafe_audit_note_detected");
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
    auditId: input.auditId,
    epochId: "8.3X",
    status,
    accepted,
    rejectionReasons: uniqueReasons,

    safeAuditMetadata: {
      selectedCase: "synthetic_explicit_payment_deadline",
      provider: "openai",
      model: "gpt_4o_mini",
      scopeCount: input.scopes.length,
      findingCount: input.findings.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: accepted ? input.checklistConfirmed.length : 0,
      metadataOnlyAudit: true,
      postCallGovernanceRecheckPassed: true,
      liveExecutionPassed: true,
      liveLLMCalledExactlyOnce: true,
      modelOutputMarkedUntrusted: true,
      modelOutputContentInspected: false,
      promptTextReconstructed: false,
      broadEslintDebtTracked: true,
      postCallCachedMetadataDebtTracked: true,
    },

    additionalSyntheticCasePostCallAuditPassed: accepted,
    readyForNextSyntheticCasePlanning: accepted,
    readyForControlledRealDocumentAuthorizationPlanning: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    postCallAuditOnly: true,
    metadataOnlyAudit: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByAudit: false,
    liveLLMCalledAgainByAudit: false,

    postCallGovernanceRecheckPassed: true,
    liveExecutionPassed: true,

    liveLLMCalled: accepted,
    liveLLMCalledExactlyOnce: accepted,
    modelOutputReceived: accepted,
    modelOutputMarkedUntrusted: accepted,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
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
    userVisibleOutputAuthorizedByAudit: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteCalledByAudit: false,
    apiRouteModifiedByAudit: false,
    existingRuntimeModifiedByAudit: false,
    uiTouched: false,
    databaseOrStorageModifiedByAudit: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    neverUserVisible: true,
  };
}

// ── Main runner ───────────────────────────────────────────────────────────────

/**
 * Phase 8.3X — Additional Synthetic Live LLM Case Post-Call Audit.
 *
 * 1. Calls `runAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck()` (8.3W) as dependency.
 * 2. Verifies all governance recheck safety invariants from 8.3W metadata.
 * 3. Validates the audit input using the local validator.
 * 4. Runs tamper cases (local validator only — no additional live calls, no OpenAI).
 *
 * NOT auto-executed on module load.
 */
export async function runAdditionalSyntheticLiveLlmCasePostCallAudit(): Promise<AdditionalSyntheticLiveLlmCasePostCallAuditCheckResult> {
  // ── 1. Dependency: Phase 8.3W ───────────────────────────────────────────────
  const recheckResult = await runAdditionalSyntheticLiveLlmCasePostCallGovernanceRecheck();

  const r8w = asRec(recheckResult);

  const prerequisiteOk =
    recheckResult.allPassed === true &&
    r8w["liveExecutionReadyForPostCallGovernanceRecheck"] === true &&
    r8w["additionalSyntheticCasePostCallGovernanceRecheckPassed"] === true &&
    r8w["readyForAdditionalSyntheticLiveLlmCasePostCallAudit"] === true &&
    r8w["readyForLiveLLMRuntime"] === false &&
    r8w["readyForConnectedAiRuntimeExecution"] === false &&
    r8w["readyForRealOperatorPilotRun"] === false &&
    r8w["readyForPilotRunNow"] === false &&
    r8w["readyForPublicLaunch"] === false &&
    r8w["readyForPersistence"] === false &&
    r8w["readyForRealDocumentInput"] === false &&
    r8w["readyForUserVisibleOutput"] === false &&
    r8w["postCallGovernanceRecheckOnly"] === true &&
    r8w["metadataOnlyRecheck"] === true &&
    r8w["modelOutputContentInspected"] === false &&
    r8w["promptTextReconstructed"] === false &&
    r8w["directOpenAiCallMadeByRecheck"] === false &&
    r8w["liveLLMCalledAgainByRecheck"] === false &&
    r8w["liveLLMCalled"] === true &&
    r8w["liveLLMCalledExactlyOnce"] === true &&
    r8w["modelOutputReceived"] === true &&
    r8w["modelOutputMarkedUntrusted"] === true &&
    r8w["apiKeyValueLogged"] === false &&
    r8w["apiKeyValueReturned"] === false &&
    r8w["promptTextAvailableForRecheck"] === false &&
    r8w["promptTextLogged"] === false &&
    r8w["promptTextStored"] === false &&
    r8w["promptTextReturned"] === false &&
    r8w["modelOutputAvailableForRecheck"] === false &&
    r8w["modelOutputLogged"] === false &&
    r8w["modelOutputStored"] === false &&
    r8w["modelOutputReturned"] === false &&
    r8w["metadataOnlyCaptured"] === true &&
    r8w["postCallGovernanceRecheckRequired"] === true &&
    r8w["postCallAuditRequired"] === true &&
    r8w["syntheticInputOnly"] === true &&
    r8w["realUserInputAllowed"] === false &&
    r8w["rawInputAllowed"] === false &&
    r8w["realRedactedInputAllowed"] === false &&
    r8w["photoOrOcrInputAllowed"] === false &&
    r8w["fileUploadInputAllowed"] === false &&
    r8w["publicAnonymousInputAllowed"] === false &&
    r8w["realDocumentInputAllowed"] === false &&
    r8w["branchCDependencyAllowed"] === false &&
    r8w["runSmartTalkDependencyAllowed"] === false &&
    r8w["ocrRuntimeDependencyAllowed"] === false &&
    r8w["branchCCalled"] === false &&
    r8w["runSmartTalkCalledOrImported"] === false &&
    r8w["extractTextFromImageCalledOrImported"] === false &&
    r8w["userVisibleOutputEmitted"] === false &&
    r8w["persistenceUsed"] === false &&
    r8w["publicRuntimeEnabled"] === false &&
    r8w["neverUserVisible"] === true;

  // ── 2. Build and validate canonical audit input ──────────────────────────────
  const canonicalInput = buildAdditionalSyntheticLiveLlmCasePostCallAuditInput({
    postCallGovernanceRecheckReady: prerequisiteOk,
    postCallGovernanceRecheckAllPassed: prerequisiteOk,
  });
  const mainResult = validateAdditionalSyntheticLiveLlmCasePostCallAuditInput(canonicalInput);

  const mainPassed = mainResult.accepted && mainResult.status === "passed";

  // ── 3. Tamper cases (local validator only — no extra live calls) ─────────────

  type TamperFn = (
    base: AdditionalSyntheticLiveLlmCasePostCallAuditInput,
  ) => AdditionalSyntheticLiveLlmCasePostCallAuditInput;

  function tamper(overrides: Record<string, unknown>): TamperFn {
    return (base) =>
      ({
        ...base,
        ...overrides,
      }) as unknown as AdditionalSyntheticLiveLlmCasePostCallAuditInput;
  }

  const base = buildAdditionalSyntheticLiveLlmCasePostCallAuditInput({
    postCallGovernanceRecheckReady: true,
    postCallGovernanceRecheckAllPassed: true,
  });

  const tamperCases: Array<{ label: string; fn: TamperFn }> = [
    // Group 1: Governance recheck prerequisites
    {
      label: "postCallGovernanceRecheckReady false",
      fn: tamper({ postCallGovernanceRecheckReadyForAudit: false }),
    },
    {
      label: "postCallGovernanceRecheckAllPassed false",
      fn: tamper({ postCallGovernanceRecheckAllPassed: false }),
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
      fn: tamper({ scopes: base.scopes.filter((s) => s !== "post_call_audit") }),
    },
    {
      label: "missing finding",
      fn: tamper({
        findings: base.findings.filter((f) => f !== "post_call_governance_recheck_passed"),
      }),
    },
    {
      label: "missing requirement",
      fn: tamper({
        requirements: base.requirements.filter(
          (req) => req !== "require_post_call_governance_recheck_passed",
        ),
      }),
    },
    {
      label: "missing blocker",
      fn: tamper({
        blockers: base.blockers.filter((b) => b !== "post_call_governance_recheck_not_ready"),
      }),
    },
    {
      label: "missing checklist item",
      fn: tamper({
        checklistConfirmed: base.checklistConfirmed.filter(
          (c) => c !== "post_call_governance_recheck_result_reviewed",
        ),
      }),
    },

    // Group 4: Audit-only flags
    {
      label: "postCallAuditOnly false",
      fn: tamper({ postCallAuditOnly: false as unknown as true }),
    },
    {
      label: "metadataOnlyAudit false",
      fn: tamper({ metadataOnlyAudit: false as unknown as true }),
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
      label: "directOpenAiCallMadeByAudit true",
      fn: tamper({ directOpenAiCallMadeByAudit: true as unknown as false }),
    },
    {
      label: "liveLLMCalledAgainByAudit true",
      fn: tamper({ liveLLMCalledAgainByAudit: true as unknown as false }),
    },

    // Group 5: Governance recheck / live execution passed flags
    {
      label: "postCallGovernanceRecheckPassed false",
      fn: tamper({ postCallGovernanceRecheckPassed: false as unknown as true }),
    },
    {
      label: "liveExecutionPassed false",
      fn: tamper({ liveExecutionPassed: false as unknown as true }),
    },

    // Group 6: Live call outcome
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

    // Group 7: API key non-exposure
    {
      label: "apiKeyValueLogged true",
      fn: tamper({ apiKeyValueLogged: true as unknown as false }),
    },
    {
      label: "apiKeyValueReturned true",
      fn: tamper({ apiKeyValueReturned: true as unknown as false }),
    },

    // Group 8: Prompt non-exposure
    {
      label: "promptTextAvailableForAudit true",
      fn: tamper({ promptTextAvailableForAudit: true as unknown as false }),
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

    // Group 9: Model output non-exposure
    {
      label: "modelOutputAvailableForAudit true",
      fn: tamper({ modelOutputAvailableForAudit: true as unknown as false }),
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

    // Group 10: Metadata / recheck / audit
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

    // Group 11: Positive audit gates
    {
      label: "additionalSyntheticCasePostCallAuditPassed false",
      fn: tamper({ additionalSyntheticCasePostCallAuditPassed: false }),
    },
    {
      label: "readyForNextSyntheticCasePlanning false",
      fn: tamper({ readyForNextSyntheticCasePlanning: false }),
    },
    {
      label: "readyForControlledRealDocumentAuthorizationPlanning false",
      fn: tamper({ readyForControlledRealDocumentAuthorizationPlanning: false }),
    },

    // Group 12: Dangerous readiness true (8 cases)
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

    // Group 13: Input policy flags
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

    // Group 14: Branch C / runSmartTalk / OCR
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

    // Group 15: User-visible output
    {
      label: "userVisibleOutputEmitted true",
      fn: tamper({ userVisibleOutputEmitted: true as unknown as false }),
    },
    {
      label: "userVisibleOutputAuthorizedByAudit true",
      fn: tamper({ userVisibleOutputAuthorizedByAudit: true as unknown as false }),
    },

    // Group 16: Persistence / public / pilot
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

    // Group 17: Technical debt tracking
    {
      label: "broadEslintDebtTracked false",
      fn: tamper({ broadEslintDebtTracked: false as unknown as true }),
    },
    {
      label: "postCallCachedMetadataDebtTracked false",
      fn: tamper({ postCallCachedMetadataDebtTracked: false as unknown as true }),
    },
    {
      label: "technicalDebtNotes missing broad ESLint note",
      fn: tamper({
        technicalDebtNotes: [
          "Post-call phases should move to supplied or cached metadata result pattern before stronger batch/runtime integration.",
        ],
      }),
    },
    {
      label: "technicalDebtNotes missing cached metadata note",
      fn: tamper({
        technicalDebtNotes: [
          "Broad ESLint has pre-existing issues in scripts/sync-i18n.ts, scripts/verify-db-schema.ts, and run-manual-review-capture-model-check.ts.",
        ],
      }),
    },

    // Group 18: Missing acknowledgments
    {
      label: "missing operator acknowledgment",
      fn: tamper({ operatorPostCallAuditAcknowledgment: "" }),
    },
    {
      label: "missing reviewer acknowledgment",
      fn: tamper({ reviewerPostCallAuditAcknowledgment: "" }),
    },

    // Group 19: contains* flags true
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

    // Group 20: Forbidden strings in notes
    {
      label: "notes: payment model output audited",
      fn: tamper({ notes: ["payment model output audited"] }),
    },
    {
      label: "notes: payment prompt audited",
      fn: tamper({ notes: ["payment prompt audited"] }),
    },
    {
      label: "notes: payment answer approved for user",
      fn: tamper({ notes: ["payment answer approved for user"] }),
    },
    {
      label: "notes: real payment document audited",
      fn: tamper({ notes: ["real payment document audited"] }),
    },
    {
      label: "notes: public payment runtime audited",
      fn: tamper({ notes: ["public payment runtime audited"] }),
    },
    {
      label: "notes: payment output ready for display",
      fn: tamper({ notes: ["payment output ready for display"] }),
    },
    {
      label: "notes: production payment audit passed",
      fn: tamper({ notes: ["production payment audit passed"] }),
    },
    {
      label: "notes: real document payment audit passed",
      fn: tamper({ notes: ["real document payment audit passed"] }),
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

    // Group 21: neverUserVisible false
    {
      label: "neverUserVisible false",
      fn: tamper({ neverUserVisible: false as unknown as true }),
    },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const { label, fn } of tamperCases) {
    const tampered = fn(base);
    const result = validateAdditionalSyntheticLiveLlmCasePostCallAuditInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${label}`);
    }
  }

  // ── 4. Compose final check result ────────────────────────────────────────────
  const allPassed = prerequisiteOk && mainPassed && allTamperRejected;

  return {
    checkId: "8.3X",
    allPassed,
    postCallGovernanceRecheckReadyForAudit: prerequisiteOk,
    additionalSyntheticCasePostCallAuditPassed: allPassed,
    tamperCasesRejected: allTamperRejected,

    readyForNextSyntheticCasePlanning: allPassed,
    readyForControlledRealDocumentAuthorizationPlanning: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    postCallAuditOnly: true,
    metadataOnlyAudit: true,
    modelOutputContentInspected: false,
    promptTextReconstructed: false,
    directOpenAiCallMadeByAudit: false,
    liveLLMCalledAgainByAudit: false,

    postCallGovernanceRecheckPassed: allPassed,
    liveExecutionPassed: allPassed,

    liveLLMCalled: allPassed,
    liveLLMCalledExactlyOnce: allPassed,
    modelOutputReceived: allPassed,
    modelOutputMarkedUntrusted: allPassed,

    apiKeyValueLogged: false,
    apiKeyValueReturned: false,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
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
    userVisibleOutputAuthorizedByAudit: false,

    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    neverUserVisible: true,

    notes: [
      `Phase 8.3X: prerequisiteOk=${String(prerequisiteOk)}, mainPassed=${String(mainPassed)}, allTamperRejected=${String(allTamperRejected)}`,
      `tamperCaseCount=${String(tamperCases.length)}`,
      ...tamperFailures,
    ],
  };
}
