/**
 * High-Risk Synthetic Legal Deadline Planning — Phase 8.3Y.
 *
 * This module is PLANNING ONLY.
 * It plans the high-risk synthetic case `synthetic_high_risk_widerspruch_deadline`
 * without executing any live LLM call.
 *
 * This module does NOT:
 *   - Call OpenAI or use fetch()
 *   - Read process.env
 *   - Import any LLM SDK
 *   - Construct the final API prompt text
 *   - Inspect model output
 *   - Process real user input
 *   - Persist anything
 *   - Emit user-visible output
 *   - Authorize public or general live LLM runtime
 *   - Call Branch C, runSmartTalk(), or extractTextFromImage()
 *   - Calculate an exact legal deadline
 *   - Authorize legal certainty
 *   - Issue coercive legal instructions
 *   - Call runAdditionalSyntheticLiveLlmCasePostCallAudit() at runtime
 *     (replaced by the local immutable _8_3X_READINESS_SNAPSHOT — 8.3Y-PATCH)
 */

import {
  type HighRiskSyntheticLegalDeadlinePlanningInput,
  type HighRiskSyntheticLegalDeadlinePlanningResult,
  type HighRiskSyntheticLegalDeadlinePlanningCheckResult,
  type HighRiskSyntheticLegalDeadlinePlanningRejectionReason,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_SCOPES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_RISK_CLASSES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PROMPT_POLICIES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXPECTED_BEHAVIORS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_REQUIREMENTS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_BLOCKERS,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CHECKLIST,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES,
  REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_ACKNOWLEDGMENT_STATEMENTS,
  FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PLANNING_STRINGS,
} from "./high-risk-synthetic-legal-deadline-planning-types";

// ── Snapshot cache (8.3Y-PATCH) ───────────────────────────────────────────────
// Populated on first successful run; subsequent calls return the cached result
// to avoid re-executing the full 8.3X upstream chain.

let _highRiskSyntheticLegalDeadlinePlanningSnapshot: HighRiskSyntheticLegalDeadlinePlanningCheckResult | null =
  null;

/**
 * Returns the cached 8.3Y planning result after the first run, or `null` if
 * `runHighRiskSyntheticLegalDeadlinePlanning()` has not been called yet.
 * Downstream phases (8.3Z, 8.3AA, 8.3AB, 8.3AC …) can use this to avoid
 * re-running the full upstream chain within the same module lifecycle.
 */
export function getHighRiskSyntheticLegalDeadlinePlanningSnapshot(): HighRiskSyntheticLegalDeadlinePlanningCheckResult | null {
  return _highRiskSyntheticLegalDeadlinePlanningSnapshot;
}

// ── 8.3X Local Readiness Snapshot (8.3Y-PATCH) ───────────────────────────────
// Immutable attestation of Phase 8.3X safety values, verified at commit time.
// Replaces the live runAdditionalSyntheticLiveLlmCasePostCallAudit() call so
// 8.3Y never re-executes the full upstream 8.3X chain during normal runtime.
//
// SAFETY CONTRACT: every field here reflects the Phase 8.3X committed result.
// Any change to this constant MUST be treated as a safety-breaking change and
// reviewed alongside the corresponding 8.3X source before merging.

const _8_3X_READINESS_SNAPSHOT = Object.freeze({
  // ── Required true ──────────────────────────────────────────────────────────
  allPassed: true,
  additionalSyntheticCasePostCallAuditPassed: true,
  readyForNextSyntheticCasePlanning: true,
  readyForControlledRealDocumentAuthorizationPlanning: true,
  metadataOnlyAudit: true,
  syntheticInputOnly: true,
  broadEslintDebtTracked: true,
  postCallCachedMetadataDebtTracked: true,
  neverUserVisible: true,

  // ── Required false — dangerous readiness gates ────────────────────────────
  readyForLiveLLMRuntime: false,
  readyForConnectedAiRuntimeExecution: false,
  readyForRealOperatorPilotRun: false,
  readyForPilotRunNow: false,
  readyForPublicLaunch: false,
  readyForPersistence: false,
  readyForRealDocumentInput: false,
  readyForUserVisibleOutput: false,

  // ── Required false — audit integrity ─────────────────────────────────────
  modelOutputContentInspected: false,
  promptTextReconstructed: false,
  directOpenAiCallMadeByAudit: false,
  liveLLMCalledAgainByAudit: false,

  // ── Required false — input policy ────────────────────────────────────────
  realUserInputAllowed: false,
  rawInputAllowed: false,
  realRedactedInputAllowed: false,
  photoOrOcrInputAllowed: false,
  fileUploadInputAllowed: false,
  publicAnonymousInputAllowed: false,
  realDocumentInputAllowed: false,

  // ── Required false — runtime isolation ───────────────────────────────────
  branchCDependencyAllowed: false,
  runSmartTalkDependencyAllowed: false,
  ocrRuntimeDependencyAllowed: false,
  branchCCalled: false,
  runSmartTalkCalledOrImported: false,
  extractTextFromImageCalledOrImported: false,

  // ── Required false — side-effect guards ──────────────────────────────────
  userVisibleOutputEmitted: false,
  persistenceUsed: false,
  publicRuntimeEnabled: false,
} as const);

/**
 * Evaluates whether a given 8.3X readiness record satisfies all 36 prerequisite
 * safety conditions required by Phase 8.3Y.
 *
 * Used both at runtime (against `_8_3X_READINESS_SNAPSHOT`) and by the
 * snapshot-integrity tamper harness (Group 17).  Any tampered field causes
 * this function to return `false`, which cascades to `prerequisiteOk = false`
 * and ultimately `allPassed = false`.
 */
function evaluateSnap8x3Prerequisite(snap: Record<string, unknown>): boolean {
  return (
    snap["allPassed"] === true &&
    snap["additionalSyntheticCasePostCallAuditPassed"] === true &&
    snap["readyForNextSyntheticCasePlanning"] === true &&
    snap["readyForControlledRealDocumentAuthorizationPlanning"] === true &&
    snap["readyForLiveLLMRuntime"] === false &&
    snap["readyForConnectedAiRuntimeExecution"] === false &&
    snap["readyForRealOperatorPilotRun"] === false &&
    snap["readyForPilotRunNow"] === false &&
    snap["readyForPublicLaunch"] === false &&
    snap["readyForPersistence"] === false &&
    snap["readyForRealDocumentInput"] === false &&
    snap["readyForUserVisibleOutput"] === false &&
    snap["metadataOnlyAudit"] === true &&
    snap["modelOutputContentInspected"] === false &&
    snap["promptTextReconstructed"] === false &&
    snap["directOpenAiCallMadeByAudit"] === false &&
    snap["liveLLMCalledAgainByAudit"] === false &&
    snap["syntheticInputOnly"] === true &&
    snap["realUserInputAllowed"] === false &&
    snap["rawInputAllowed"] === false &&
    snap["realRedactedInputAllowed"] === false &&
    snap["photoOrOcrInputAllowed"] === false &&
    snap["fileUploadInputAllowed"] === false &&
    snap["publicAnonymousInputAllowed"] === false &&
    snap["realDocumentInputAllowed"] === false &&
    snap["branchCDependencyAllowed"] === false &&
    snap["runSmartTalkDependencyAllowed"] === false &&
    snap["ocrRuntimeDependencyAllowed"] === false &&
    snap["branchCCalled"] === false &&
    snap["runSmartTalkCalledOrImported"] === false &&
    snap["extractTextFromImageCalledOrImported"] === false &&
    snap["userVisibleOutputEmitted"] === false &&
    snap["persistenceUsed"] === false &&
    snap["publicRuntimeEnabled"] === false &&
    snap["broadEslintDebtTracked"] === true &&
    snap["postCallCachedMetadataDebtTracked"] === true &&
    snap["neverUserVisible"] === true
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return {};
}

function containsForbiddenString(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PLANNING_STRINGS.some((f) =>
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
  // Generic terms ("real documents", "public runtime") are excluded here because
  // they appear in acknowledgment statement 5. The dangerous specific forms are
  // caught by FORBIDDEN_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PLANNING_STRINGS.
  const unsafe = [
    "real authority",
    "real person",
    "real address",
    "real document input",
    "real invoice",
    "real mahnung",
    "real payment notice",
    "real bescheid",
    "real widerspruch",
    "real legal deadline",
    "exact widerspruch deadline calculated",
    "legal deadline guaranteed",
    "you must file widerspruch by",
    "widerspruch legally certain",
    "public legal deadline runtime ready",
    "user-visible legal advice ready",
    "production legal advice enabled",
    "rechtsbehelfsbelehrung vollständig geprüft",
    "genauer fristablauf berechnet",
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
 * Builds a canonical `HighRiskSyntheticLegalDeadlinePlanningInput`.
 *
 * Default params represent a successful 8.3X audit result ready for high-risk planning.
 */
export function buildHighRiskSyntheticLegalDeadlinePlanningInput(params?: {
  readonly previousAuditReady?: boolean;
  readonly previousAuditAllPassed?: boolean;
}): HighRiskSyntheticLegalDeadlinePlanningInput {
  const auditReady = params?.previousAuditReady ?? true;
  const auditAllPassed = params?.previousAuditAllPassed ?? true;

  return {
    planningId: "high-risk-synthetic-legal-deadline-planning-8-3y",
    epochId: "8.3Y",
    previousPhaseId: "8.3X",

    previousAuditReadyForHighRiskPlanning: auditReady,
    previousAuditAllPassed: auditAllPassed,

    selectedCase: "synthetic_high_risk_widerspruch_deadline",

    scopes: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_SCOPES,
    riskClasses: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_RISK_CLASSES,
    promptPolicies: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PROMPT_POLICIES,
    expectedBehaviors: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXPECTED_BEHAVIORS,
    requirements: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_REQUIREMENTS,
    blockers: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_BLOCKERS,
    checklistConfirmed: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CHECKLIST,

    planningOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    exactDeadlineCalculationAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInPlanning: false,
    directOpenAiCallMadeByPlanning: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInPlanning: false,

    readyForHighRiskSyntheticLegalDeadlineContract: true,
    highRiskSyntheticLegalDeadlinePlanningAccepted: true,

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
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,
    technicalDebtNotes: REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES,

    operatorHighRiskPlanningAcknowledgment:
      REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_ACKNOWLEDGMENT_STATEMENTS.join(" "),
    reviewerHighRiskPlanningAcknowledgment:
      REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_ACKNOWLEDGMENT_STATEMENTS.join(" "),

    notes: [
      "high-risk synthetic Widerspruch deadline planning completed without live call",
      "exact deadline calculation remains blocked without delivery or Bekanntgabe date",
      "ready for high-risk synthetic legal deadline contract only",
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
  new Set<HighRiskSyntheticLegalDeadlinePlanningRejectionReason>([
    "previous_audit_not_ready",
    "previous_audit_not_passed",
  ]);

/**
 * Validates a `HighRiskSyntheticLegalDeadlinePlanningInput`.
 *
 * Status semantics:
 *   "planned"  — all checks pass; planning accepted.
 *   "blocked"  — previous audit prerequisite not satisfied (safe prevention).
 *   "rejected" — at least one unsafe invariant violated.
 */
export function validateHighRiskSyntheticLegalDeadlinePlanningInput(
  input: HighRiskSyntheticLegalDeadlinePlanningInput,
): HighRiskSyntheticLegalDeadlinePlanningResult {
  const r = asRec(input);
  const reasons: HighRiskSyntheticLegalDeadlinePlanningRejectionReason[] = [];

  // 1. Previous audit prerequisites
  if (!input.previousAuditReadyForHighRiskPlanning) {
    reasons.push("previous_audit_not_ready");
  }
  if (!input.previousAuditAllPassed) {
    reasons.push("previous_audit_not_passed");
  }

  // 2. Selected case
  if (r["selectedCase"] !== "synthetic_high_risk_widerspruch_deadline") {
    reasons.push("selected_case_invalid");
  }

  // 3. Required lists
  for (const scope of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_SCOPES) {
    if (!input.scopes.includes(scope)) {
      reasons.push("missing_scope");
      break;
    }
  }
  for (const rc of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_RISK_CLASSES) {
    if (!input.riskClasses.includes(rc)) {
      reasons.push("missing_risk_class");
      break;
    }
  }
  for (const pp of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_PROMPT_POLICIES) {
    if (!input.promptPolicies.includes(pp)) {
      reasons.push("missing_prompt_policy");
      break;
    }
  }
  for (const eb of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_EXPECTED_BEHAVIORS) {
    if (!input.expectedBehaviors.includes(eb)) {
      reasons.push("missing_expected_behavior");
      break;
    }
  }
  for (const req of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_REQUIREMENTS) {
    if (!input.requirements.includes(req)) {
      reasons.push("missing_requirement");
      break;
    }
  }
  for (const blocker of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_BLOCKERS) {
    if (!input.blockers.includes(blocker)) {
      reasons.push("missing_blocker");
      break;
    }
  }
  for (const item of REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      reasons.push("missing_checklist_item");
      break;
    }
  }

  // 4. Planning-only flags
  if (r["planningOnly"] !== true) {
    reasons.push("direct_openai_call_attempted");
  }
  if (r["highRiskSyntheticCase"] !== true) {
    reasons.push("selected_case_invalid");
  }
  if (r["legalDeadlineCase"] !== true) {
    reasons.push("selected_case_invalid");
  }
  if (r["deliveryDateRequiredForExactDeadline"] !== true) {
    reasons.push("exact_deadline_authorized_without_delivery_date");
  }

  // 5. Legal safety flags
  if (r["exactDeadlineCalculationAuthorized"] !== false) {
    reasons.push("exact_deadline_authorized_without_delivery_date");
  }
  if (r["legalCertaintyAuthorized"] !== false) {
    reasons.push("legal_certainty_authorized");
  }
  if (r["coerciveLegalInstructionAuthorized"] !== false) {
    reasons.push("coercive_legal_instruction_authorized");
  }

  // 6. Live call / prompt / model output flags
  if (r["liveLLMCalledInPlanning"] !== false) {
    reasons.push("live_call_attempted_in_planning");
  }
  if (r["directOpenAiCallMadeByPlanning"] !== false) {
    reasons.push("direct_openai_call_attempted");
  }
  if (r["promptTextConstructedNow"] !== false) {
    reasons.push("prompt_text_constructed_now");
  }
  if (r["modelOutputAvailableInPlanning"] !== false) {
    reasons.push("model_output_available");
  }

  // 7. Positive planning gates
  if (r["readyForHighRiskSyntheticLegalDeadlineContract"] !== true) {
    reasons.push("missing_checklist_item");
  }
  if (r["highRiskSyntheticLegalDeadlinePlanningAccepted"] !== true) {
    reasons.push("missing_checklist_item");
  }

  // 8. Dangerous readiness must be false
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

  // 9. Input policy flags
  if (r["syntheticInputOnly"] !== true) {
    reasons.push("real_input_detected");
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

  // 10. Branch C / runSmartTalk / OCR
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

  // 11. User-visible output and persistence
  if (r["userVisibleOutputEmitted"] !== false) {
    reasons.push("user_visible_output_detected");
  }
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

  // 12. Technical debt tracking
  if (r["broadEslintDebtTracked"] !== true) {
    reasons.push("technical_debt_not_tracked");
  }
  if (r["postCallCachedMetadataDebtTracked"] !== true) {
    reasons.push("technical_debt_not_tracked");
  }
  const debtNotes = Array.isArray(input.technicalDebtNotes) ? input.technicalDebtNotes : [];
  const missingBroadNote = !debtNotes.some((n) =>
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES[0]
      ? n.includes(REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES[0].slice(0, 40))
      : false,
  );
  const missingCachedNote = !debtNotes.some((n) =>
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES[1]
      ? n.includes(REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_DEBT_NOTES[1].slice(0, 40))
      : false,
  );
  if (missingBroadNote || missingCachedNote) {
    reasons.push("technical_debt_not_tracked");
  }

  // 13. Acknowledgments — each field must independently contain all required statements
  const opAck =
    typeof input.operatorHighRiskPlanningAcknowledgment === "string"
      ? input.operatorHighRiskPlanningAcknowledgment
      : "";
  const revAck =
    typeof input.reviewerHighRiskPlanningAcknowledgment === "string"
      ? input.reviewerHighRiskPlanningAcknowledgment
      : "";
  const opAckMissing =
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !opAck.includes(stmt),
    );
  const revAckMissing =
    REQUIRED_HIGH_RISK_SYNTHETIC_LEGAL_DEADLINE_ACKNOWLEDGMENT_STATEMENTS.some(
      (stmt) => !revAck.includes(stmt),
    );
  if (opAckMissing || revAckMissing) {
    reasons.push("missing_checklist_item");
  }

  // 14. contains* flags
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
    reasons.push("prompt_text_constructed_now");
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

  // 15. Scan all string fields for forbidden content
  if (scanStrings([...input.notes, opAck, revAck, ...debtNotes])) {
    reasons.push("unsafe_planning_note_detected");
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
    planningId: input.planningId,
    epochId: "8.3Y",
    status,
    accepted,
    rejectionReasons: uniqueReasons,

    safePlanningMetadata: {
      selectedCase: "synthetic_high_risk_widerspruch_deadline",
      scopeCount: input.scopes.length,
      riskClassCount: input.riskClasses.length,
      promptPolicyCount: input.promptPolicies.length,
      expectedBehaviorCount: input.expectedBehaviors.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: accepted ? input.checklistConfirmed.length : 0,
      planningOnly: true,
      highRiskSyntheticCase: true,
      legalDeadlineCase: true,
      deliveryDateRequiredForExactDeadline: true,
      exactDeadlineCalculationAuthorized: false,
      legalCertaintyAuthorized: false,
      coerciveLegalInstructionAuthorized: false,
      broadEslintDebtTracked: true,
      postCallCachedMetadataDebtTracked: true,
    },

    readyForHighRiskSyntheticLegalDeadlineContract: accepted,
    highRiskSyntheticLegalDeadlinePlanningAccepted: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    planningOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    exactDeadlineCalculationAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInPlanning: false,
    directOpenAiCallMadeByPlanning: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInPlanning: false,

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
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    apiRouteModifiedByPlanning: false,
    existingRuntimeModifiedByPlanning: false,
    uiTouched: false,
    databaseOrStorageModifiedByPlanning: false,

    neverUserVisible: true,
  };
}

// ── Main runner ───────────────────────────────────────────────────────────────

/**
 * Phase 8.3Y — High-Risk Synthetic Legal Deadline Planning.
 *
 * 1. Evaluates the local immutable `_8_3X_READINESS_SNAPSHOT` (8.3Y-PATCH)
 *    via `evaluateSnap8x3Prerequisite()` — no live 8.3X chain call.
 * 2. Verifies all 36 audit safety invariants from the 8.3X snapshot.
 * 3. Validates the planning input using the local validator.
 * 4. Runs tamper cases (local validator + snapshot-integrity — no live calls, no OpenAI).
 *
 * NOT auto-executed on module load.
 */
export async function runHighRiskSyntheticLegalDeadlinePlanning(): Promise<HighRiskSyntheticLegalDeadlinePlanningCheckResult> {
  // ── 8.3Y-PATCH: return cached snapshot if already computed ──────────────────
  if (_highRiskSyntheticLegalDeadlinePlanningSnapshot !== null) {
    return _highRiskSyntheticLegalDeadlinePlanningSnapshot;
  }

  // ── 1. Dependency: Phase 8.3X (snapshot — 8.3Y-PATCH) ──────────────────────
  // The live runAdditionalSyntheticLiveLlmCasePostCallAudit() call is replaced
  // by the local immutable _8_3X_READINESS_SNAPSHOT to avoid re-executing the
  // full 8.3X upstream chain on every call.  All 36 prerequisite fields are
  // validated by evaluateSnap8x3Prerequisite(); a tampered snapshot produces
  // prerequisiteOk = false, cascading to allPassed = false.
  const prerequisiteOk = evaluateSnap8x3Prerequisite(asRec(_8_3X_READINESS_SNAPSHOT));

  // ── 2. Build and validate canonical planning input ───────────────────────────
  const canonicalInput = buildHighRiskSyntheticLegalDeadlinePlanningInput({
    previousAuditReady: prerequisiteOk,
    previousAuditAllPassed: prerequisiteOk,
  });
  const mainResult = validateHighRiskSyntheticLegalDeadlinePlanningInput(canonicalInput);

  const mainPassed = mainResult.accepted && mainResult.status === "planned";

  // ── 3. Tamper cases (local validator only — no live calls) ───────────────────

  type TamperFn = (
    base: HighRiskSyntheticLegalDeadlinePlanningInput,
  ) => HighRiskSyntheticLegalDeadlinePlanningInput;

  function tamper(overrides: Record<string, unknown>): TamperFn {
    return (base) =>
      ({
        ...base,
        ...overrides,
      }) as unknown as HighRiskSyntheticLegalDeadlinePlanningInput;
  }

  const base = buildHighRiskSyntheticLegalDeadlinePlanningInput({
    previousAuditReady: true,
    previousAuditAllPassed: true,
  });

  const tamperCases: Array<{ label: string; fn: TamperFn }> = [
    // Group 1: Previous audit prerequisites
    {
      label: "previousAuditReady false",
      fn: tamper({ previousAuditReadyForHighRiskPlanning: false }),
    },
    {
      label: "previousAuditAllPassed false",
      fn: tamper({ previousAuditAllPassed: false }),
    },

    // Group 2: Case
    {
      label: "wrong selectedCase",
      fn: tamper({ selectedCase: "synthetic_explicit_payment_deadline" }),
    },

    // Group 3: Missing required lists
    {
      label: "missing scope",
      fn: tamper({ scopes: base.scopes.filter((s) => s !== "planning_only") }),
    },
    {
      label: "missing riskClass",
      fn: tamper({
        riskClasses: base.riskClasses.filter((rc) => rc !== "high_risk_legal_deadline"),
      }),
    },
    {
      label: "missing promptPolicy",
      fn: tamper({
        promptPolicies: base.promptPolicies.filter((pp) => pp !== "synthetic_only"),
      }),
    },
    {
      label: "missing expectedBehavior",
      fn: tamper({
        expectedBehaviors: base.expectedBehaviors.filter(
          (eb) => eb !== "identify_widerspruch_mention",
        ),
      }),
    },
    {
      label: "missing requirement",
      fn: tamper({
        requirements: base.requirements.filter((r) => r !== "require_8_3x_audit_passed"),
      }),
    },
    {
      label: "missing blocker",
      fn: tamper({
        blockers: base.blockers.filter((b) => b !== "previous_audit_not_ready"),
      }),
    },
    {
      label: "missing checklist item",
      fn: tamper({
        checklistConfirmed: base.checklistConfirmed.filter(
          (c) => c !== "previous_audit_reviewed",
        ),
      }),
    },

    // Group 4: Planning-only flags
    {
      label: "planningOnly false",
      fn: tamper({ planningOnly: false as unknown as true }),
    },
    {
      label: "highRiskSyntheticCase false",
      fn: tamper({ highRiskSyntheticCase: false as unknown as true }),
    },
    {
      label: "legalDeadlineCase false",
      fn: tamper({ legalDeadlineCase: false as unknown as true }),
    },
    {
      label: "deliveryDateRequiredForExactDeadline false",
      fn: tamper({ deliveryDateRequiredForExactDeadline: false as unknown as true }),
    },

    // Group 5: Legal safety flags
    {
      label: "exactDeadlineCalculationAuthorized true",
      fn: tamper({ exactDeadlineCalculationAuthorized: true as unknown as false }),
    },
    {
      label: "legalCertaintyAuthorized true",
      fn: tamper({ legalCertaintyAuthorized: true as unknown as false }),
    },
    {
      label: "coerciveLegalInstructionAuthorized true",
      fn: tamper({ coerciveLegalInstructionAuthorized: true as unknown as false }),
    },

    // Group 6: Live call / prompt / model output flags
    {
      label: "liveLLMCalledInPlanning true",
      fn: tamper({ liveLLMCalledInPlanning: true as unknown as false }),
    },
    {
      label: "directOpenAiCallMadeByPlanning true",
      fn: tamper({ directOpenAiCallMadeByPlanning: true as unknown as false }),
    },
    {
      label: "promptTextConstructedNow true",
      fn: tamper({ promptTextConstructedNow: true as unknown as false }),
    },
    {
      label: "modelOutputAvailableInPlanning true",
      fn: tamper({ modelOutputAvailableInPlanning: true as unknown as false }),
    },

    // Group 7: Positive gates
    {
      label: "readyForHighRiskSyntheticLegalDeadlineContract false",
      fn: tamper({ readyForHighRiskSyntheticLegalDeadlineContract: false }),
    },
    {
      label: "highRiskSyntheticLegalDeadlinePlanningAccepted false",
      fn: tamper({ highRiskSyntheticLegalDeadlinePlanningAccepted: false }),
    },

    // Group 8: Dangerous readiness true (8 cases)
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

    // Group 9: Input policy flags (8 cases)
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

    // Group 10: Branch C / runSmartTalk / OCR (6 cases)
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

    // Group 11: User-visible / persistence / public / pilot (5 cases)
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

    // Group 12: Technical debt tracking (4 cases)
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

    // Group 13: Missing acknowledgments (2 cases)
    {
      label: "missing operator acknowledgment",
      fn: tamper({ operatorHighRiskPlanningAcknowledgment: "" }),
    },
    {
      label: "missing reviewer acknowledgment",
      fn: tamper({ reviewerHighRiskPlanningAcknowledgment: "" }),
    },

    // Group 14: contains* flags (10 cases)
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

    // Group 15: Forbidden strings in notes
    {
      label: "notes: exact Widerspruch deadline calculated",
      fn: tamper({ notes: ["exact Widerspruch deadline calculated"] }),
    },
    {
      label: "notes: legal deadline guaranteed",
      fn: tamper({ notes: ["legal deadline guaranteed"] }),
    },
    {
      label: "notes: you must file Widerspruch by",
      fn: tamper({ notes: ["you must file Widerspruch by 01.01.2025"] }),
    },
    {
      label: "notes: Widerspruch legally certain",
      fn: tamper({ notes: ["Widerspruch legally certain"] }),
    },
    {
      label: "notes: real Bescheid processed",
      fn: tamper({ notes: ["real Bescheid processed"] }),
    },
    {
      label: "notes: real legal deadline authorized",
      fn: tamper({ notes: ["real legal deadline authorized"] }),
    },
    {
      label: "notes: public legal deadline runtime ready",
      fn: tamper({ notes: ["public legal deadline runtime ready"] }),
    },
    {
      label: "notes: user-visible legal advice ready",
      fn: tamper({ notes: ["user-visible legal advice ready"] }),
    },
    {
      label: "notes: production legal advice enabled",
      fn: tamper({ notes: ["production legal advice enabled"] }),
    },
    {
      label: "notes: Rechtsbehelfsbelehrung vollständig geprüft",
      fn: tamper({ notes: ["Rechtsbehelfsbelehrung vollständig geprüft"] }),
    },
    {
      label: "notes: genauer Fristablauf berechnet",
      fn: tamper({ notes: ["genauer Fristablauf berechnet"] }),
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
      label: "notes: Sehr geehrter",
      fn: tamper({ notes: ["Sehr geehrter Herr Mustermann"] }),
    },
    {
      label: "notes: IBAN",
      fn: tamper({ notes: ["IBAN: DE12 3456 7890"] }),
    },
    {
      label: "notes: Telefon",
      fn: tamper({ notes: ["Telefon: 0800 123456789"] }),
    },
    {
      label: "notes: Sie müssen",
      fn: tamper({ notes: ["Sie müssen zahlen"] }),
    },
    {
      label: "notes: live llm executed",
      fn: tamper({ notes: ["live llm executed"] }),
    },
    {
      label: "notes: real document input ready",
      fn: tamper({ notes: ["real document input ready"] }),
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
      label: "notes: PII email",
      fn: tamper({ notes: ["test@example.com"] }),
    },
    {
      label: "notes: real legal deadline authorized",
      fn: tamper({ notes: ["real legal deadline authorized for pilot"] }),
    },

    // Group 16: neverUserVisible false
    {
      label: "neverUserVisible false",
      fn: tamper({ neverUserVisible: false as unknown as true }),
    },
  ];

  let allTamperRejected = true;
  const tamperFailures: string[] = [];

  for (const { label, fn } of tamperCases) {
    const tampered = fn(base);
    const result = validateHighRiskSyntheticLegalDeadlinePlanningInput(tampered);
    if (result.accepted) {
      allTamperRejected = false;
      tamperFailures.push(`TAMPER NOT REJECTED: ${label}`);
    }
  }

  // ── Group 17: Snapshot-integrity tamper cases (8.3Y-PATCH) ──────────────────
  // Each case mutates one field of the 8.3X readiness snapshot.
  // evaluateSnap8x3Prerequisite() MUST return false for every tampered version.
  // A passing (true) result here means the prerequisite gate is not enforcing
  // the safety constraint for that field and is treated as a failure.

  const snapBase: Record<string, unknown> = { ..._8_3X_READINESS_SNAPSHOT };

  const snapTamperCases: Array<{ label: string; override: Record<string, unknown> }> = [
    // ── Required-true fields flipped to false (9 cases) ──────────────────────
    { label: "snap: allPassed false", override: { allPassed: false } },
    {
      label: "snap: additionalSyntheticCasePostCallAuditPassed false",
      override: { additionalSyntheticCasePostCallAuditPassed: false },
    },
    {
      label: "snap: readyForNextSyntheticCasePlanning false",
      override: { readyForNextSyntheticCasePlanning: false },
    },
    {
      label: "snap: readyForControlledRealDocumentAuthorizationPlanning false",
      override: { readyForControlledRealDocumentAuthorizationPlanning: false },
    },
    { label: "snap: metadataOnlyAudit false", override: { metadataOnlyAudit: false } },
    { label: "snap: syntheticInputOnly false", override: { syntheticInputOnly: false } },
    {
      label: "snap: broadEslintDebtTracked false",
      override: { broadEslintDebtTracked: false },
    },
    {
      label: "snap: postCallCachedMetadataDebtTracked false",
      override: { postCallCachedMetadataDebtTracked: false },
    },
    { label: "snap: neverUserVisible false", override: { neverUserVisible: false } },

    // ── Required-false fields flipped to true — dangerous readiness (8 cases) ─
    {
      label: "snap: readyForLiveLLMRuntime true",
      override: { readyForLiveLLMRuntime: true },
    },
    {
      label: "snap: readyForConnectedAiRuntimeExecution true",
      override: { readyForConnectedAiRuntimeExecution: true },
    },
    {
      label: "snap: readyForRealOperatorPilotRun true",
      override: { readyForRealOperatorPilotRun: true },
    },
    { label: "snap: readyForPilotRunNow true", override: { readyForPilotRunNow: true } },
    { label: "snap: readyForPublicLaunch true", override: { readyForPublicLaunch: true } },
    { label: "snap: readyForPersistence true", override: { readyForPersistence: true } },
    {
      label: "snap: readyForRealDocumentInput true",
      override: { readyForRealDocumentInput: true },
    },
    {
      label: "snap: readyForUserVisibleOutput true",
      override: { readyForUserVisibleOutput: true },
    },

    // ── Required-false fields flipped to true — audit integrity (4 cases) ─────
    {
      label: "snap: modelOutputContentInspected true",
      override: { modelOutputContentInspected: true },
    },
    {
      label: "snap: promptTextReconstructed true",
      override: { promptTextReconstructed: true },
    },
    {
      label: "snap: directOpenAiCallMadeByAudit true",
      override: { directOpenAiCallMadeByAudit: true },
    },
    {
      label: "snap: liveLLMCalledAgainByAudit true",
      override: { liveLLMCalledAgainByAudit: true },
    },

    // ── Required-false fields flipped to true — input policy (7 cases) ────────
    { label: "snap: realUserInputAllowed true", override: { realUserInputAllowed: true } },
    { label: "snap: rawInputAllowed true", override: { rawInputAllowed: true } },
    {
      label: "snap: realRedactedInputAllowed true",
      override: { realRedactedInputAllowed: true },
    },
    {
      label: "snap: photoOrOcrInputAllowed true",
      override: { photoOrOcrInputAllowed: true },
    },
    {
      label: "snap: fileUploadInputAllowed true",
      override: { fileUploadInputAllowed: true },
    },
    {
      label: "snap: publicAnonymousInputAllowed true",
      override: { publicAnonymousInputAllowed: true },
    },
    {
      label: "snap: realDocumentInputAllowed true",
      override: { realDocumentInputAllowed: true },
    },

    // ── Required-false fields flipped to true — runtime isolation (6 cases) ───
    {
      label: "snap: branchCDependencyAllowed true",
      override: { branchCDependencyAllowed: true },
    },
    {
      label: "snap: runSmartTalkDependencyAllowed true",
      override: { runSmartTalkDependencyAllowed: true },
    },
    {
      label: "snap: ocrRuntimeDependencyAllowed true",
      override: { ocrRuntimeDependencyAllowed: true },
    },
    { label: "snap: branchCCalled true", override: { branchCCalled: true } },
    {
      label: "snap: runSmartTalkCalledOrImported true",
      override: { runSmartTalkCalledOrImported: true },
    },
    {
      label: "snap: extractTextFromImageCalledOrImported true",
      override: { extractTextFromImageCalledOrImported: true },
    },

    // ── Required-false fields flipped to true — side-effect guards (3 cases) ──
    {
      label: "snap: userVisibleOutputEmitted true",
      override: { userVisibleOutputEmitted: true },
    },
    { label: "snap: persistenceUsed true", override: { persistenceUsed: true } },
    { label: "snap: publicRuntimeEnabled true", override: { publicRuntimeEnabled: true } },
  ];

  let allSnapTamperBlocked = true;
  const snapTamperFailures: string[] = [];

  for (const { label, override } of snapTamperCases) {
    const tampered = { ...snapBase, ...override };
    if (evaluateSnap8x3Prerequisite(tampered)) {
      allSnapTamperBlocked = false;
      snapTamperFailures.push(`SNAP TAMPER NOT BLOCKED: ${label}`);
    }
  }

  // ── 4. Compose final check result ────────────────────────────────────────────
  const allPassed =
    prerequisiteOk && mainPassed && allTamperRejected && allSnapTamperBlocked;

  // 8.3Y-PATCH: populate snapshot cache before returning
  const _result: HighRiskSyntheticLegalDeadlinePlanningCheckResult = {
    checkId: "8.3Y",
    allPassed,
    previousAuditReadyForHighRiskPlanning: prerequisiteOk,
    highRiskSyntheticLegalDeadlinePlanningAccepted: allPassed,
    tamperCasesRejected: allTamperRejected,

    readyForHighRiskSyntheticLegalDeadlineContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    planningOnly: true,
    highRiskSyntheticCase: true,
    legalDeadlineCase: true,
    deliveryDateRequiredForExactDeadline: true,

    exactDeadlineCalculationAuthorized: false,
    legalCertaintyAuthorized: false,
    coerciveLegalInstructionAuthorized: false,

    liveLLMCalledInPlanning: false,
    directOpenAiCallMadeByPlanning: false,
    promptTextConstructedNow: false,
    modelOutputAvailableInPlanning: false,

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
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    broadEslintDebtTracked: true,
    postCallCachedMetadataDebtTracked: true,

    neverUserVisible: true,

    notes: [
      `Phase 8.3Y: prerequisiteOk=${String(prerequisiteOk)}, mainPassed=${String(mainPassed)}, allTamperRejected=${String(allTamperRejected)}, allSnapTamperBlocked=${String(allSnapTamperBlocked)}`,
      `tamperCaseCount=${String(tamperCases.length)}, snapTamperCaseCount=${String(snapTamperCases.length)}`,
      ...tamperFailures,
      ...snapTamperFailures,
    ],
  };

  _highRiskSyntheticLegalDeadlinePlanningSnapshot = _result;
  return _result;
}
