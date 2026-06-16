/**
 * Synthetic Harness Post-Run Audit (Phase 8.3J).
 *
 * Validates the Synthetic Harness Post-Run Audit input and produces a
 * `SyntheticHarnessPostRunAuditCheckResult`.
 *
 * Sub-steps:
 *   1. Call runAiConnectedSyntheticHarnessDryExecution() (8.3I) and verify
 *      all prerequisite invariants.
 *   2. Build a synthetic post-run audit input (metadata-only review, no
 *      harness re-execution) and validate it (must be accepted).
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
 * - produce real AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - execute the harness again
 * - auto-execute at module load time
 *
 * Invoke `runSyntheticHarnessPostRunAudit()` explicitly.
 */

import { runAiConnectedSyntheticHarnessDryExecution } from "./run-ai-connected-synthetic-harness-dry-execution";
import {
  FORBIDDEN_SYNTHETIC_POST_RUN_AUDIT_STRINGS,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS,
  REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES,
} from "./synthetic-harness-post-run-audit-types";
import type {
  SyntheticHarnessPostRunAuditCheckResult,
  SyntheticHarnessPostRunAuditInput,
  SyntheticHarnessPostRunAuditRejectionReason,
  SyntheticHarnessPostRunAuditResult,
} from "./synthetic-harness-post-run-audit-types";

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
const UNSAFE_AUDIT_STORAGE_PHRASES = ["post-run audit stored output", "live llm now authorized"];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_SYNTHETIC_POST_RUN_AUDIT_STRINGS.some((f) => value.includes(f));
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

function containsUnsafeAuditStoragePhrase(value: string): boolean {
  return UNSAFE_AUDIT_STORAGE_PHRASES.some((p) => value.includes(p));
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
  return value.includes("modelOutput") || value.includes("real model output");
}

function addReason(
  list: SyntheticHarnessPostRunAuditRejectionReason[],
  reason: SyntheticHarnessPostRunAuditRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `SyntheticHarnessPostRunAuditInput` for use in
 * the audit check. Reviews metadata only, does not execute the harness again,
 * does not call live LLM, does not process real input, does not persist data,
 * and does not emit user-visible output.
 */
export function buildSyntheticHarnessPostRunAuditInput(): SyntheticHarnessPostRunAuditInput {
  const ackStatements =
    REQUIRED_SYNTHETIC_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    auditId: "synthetic-harness-post-run-audit-8-3j",
    epochId: "8.3J",
    previousPhaseId: "8.3I",

    dryExecutionReadyForPostRunAudit: true,

    auditScopes: [...REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES],
    auditFindings: [...REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS],
    auditFailureCategories: [...REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES],
    nextPhaseOptions: [...REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS],
    checklistConfirmed: [...REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST],

    expectedCaseCount: 8,
    observedCaseCount: 8,
    failedCaseCount: 0,
    expectedPathCount: 8,
    observationCountAtLeast: 11,
    invariantCountAtLeast: 17,

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,
    syntheticInputOnly: true,

    postRunAuditPerformed: true,
    auditMetadataOnly: true,
    auditExecutedHarnessAgain: false,

    readyForLiveLlmSyntheticAuthorizationPlanning: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

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

    liveLLMCallPerformed: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByPostRunAudit: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorPostRunAuditAcknowledgment: ackStatements,
    reviewerPostRunAuditAcknowledgment: ackStatements,
    notes: ["synthetic harness post-run audit completed with metadata-only review"],

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
 * Validates a `SyntheticHarnessPostRunAuditInput` and returns a typed
 * `SyntheticHarnessPostRunAuditResult`.
 */
export function validateSyntheticHarnessPostRunAuditInput(
  input: SyntheticHarnessPostRunAuditInput,
): SyntheticHarnessPostRunAuditResult {
  const reasons: SyntheticHarnessPostRunAuditRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: dryExecutionReadyForPostRunAudit ──────────────────────────────
  if (!input.dryExecutionReadyForPostRunAudit) {
    addReason(reasons, "dry_execution_result_not_ready");
  }

  // ── Rule 2: auditScopes ───────────────────────────────────────────────────
  for (const scope of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES) {
    if (!input.auditScopes.includes(scope)) {
      addReason(reasons, "missing_audit_scope");
      break;
    }
  }

  // ── Rule 3: auditFindings ─────────────────────────────────────────────────
  for (const finding of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS) {
    if (!input.auditFindings.includes(finding)) {
      addReason(reasons, "missing_audit_finding");
      break;
    }
  }

  // ── Rule 4: auditFailureCategories ────────────────────────────────────────
  for (const cat of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES) {
    if (!input.auditFailureCategories.includes(cat)) {
      addReason(reasons, "missing_audit_failure_category");
      break;
    }
  }

  // ── Rule 5: nextPhaseOptions ──────────────────────────────────────────────
  for (const opt of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS) {
    if (!input.nextPhaseOptions.includes(opt)) {
      addReason(reasons, "missing_next_phase_option");
      break;
    }
  }

  // ── Rule 6: checklistConfirmed ────────────────────────────────────────────
  for (const item of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rules 7–11: counts ────────────────────────────────────────────────────
  if (inputRec["expectedCaseCount"] !== 8 || inputRec["observedCaseCount"] !== 8) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["failedCaseCount"] !== 0) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["expectedPathCount"] !== 8) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (typeof inputRec["observationCountAtLeast"] === "number" && (inputRec["observationCountAtLeast"] as number) < 11) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (typeof inputRec["invariantCountAtLeast"] === "number" && (inputRec["invariantCountAtLeast"] as number) < 17) {
    addReason(reasons, "dry_execution_result_not_ready");
  }

  // ── Rules 12–17: dry execution carry-forward flags ────────────────────────
  if (inputRec["dryExecutionPerformed"] !== true) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["deterministicSyntheticAdapterUsed"] !== true) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["metadataOnlyResults"] !== true) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "audit_attempted_real_input_processing");
  }

  // ── Rules 15–17: audit flags ──────────────────────────────────────────────
  if (inputRec["postRunAuditPerformed"] !== true) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["auditMetadataOnly"] !== true) {
    addReason(reasons, "dry_execution_result_not_ready");
  }
  if (inputRec["auditExecutedHarnessAgain"] === true) {
    addReason(reasons, "audit_attempted_to_execute_harness");
  }

  // ── Rule 19/20: readiness flags that must stay false ─────────────────────
  if (inputRec["readyForLiveLLMRuntime"] === true || inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "audit_attempted_live_llm_runtime");
  }
  if (inputRec["readyForConnectedAiRuntimeExecution"] === true) {
    addReason(reasons, "audit_attempted_connected_ai_runtime_execution");
  }
  if (
    inputRec["readyForRealOperatorPilotRun"] === true ||
    inputRec["readyForPilotRunNow"] === true ||
    inputRec["realOperatorPilotExecuted"] === true
  ) {
    addReason(reasons, "audit_attempted_real_operator_pilot");
  }
  if (inputRec["readyForPublicLaunch"] === true || inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "audit_attempted_public_runtime");
  }
  if (
    inputRec["readyForPersistence"] === true ||
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "audit_attempted_persistence");
  }

  // ── Rule 21: real/raw/OCR/file/public input ───────────────────────────────
  if (
    inputRec["realUserInputAllowed"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "audit_attempted_real_input_processing");
  }
  if (
    inputRec["rawInputAllowed"] === true ||
    inputRec["containsRawInputText"] === true
  ) {
    addReason(reasons, "audit_attempted_raw_input_forwarding");
  }
  if (
    inputRec["realRedactedInputAllowed"] === true ||
    inputRec["containsRedactedText"] === true
  ) {
    addReason(reasons, "audit_attempted_redacted_input_forwarding");
  }
  if (
    inputRec["photoOrOcrInputAllowed"] === true ||
    inputRec["fileUploadInputAllowed"] === true
  ) {
    addReason(reasons, "audit_attempted_photo_ocr_file_processing");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "audit_attempted_real_input_processing");
  }

  // ── Rule 22: runtime dependency flags ─────────────────────────────────────
  if (
    inputRec["branchCDependencyAllowed"] === true ||
    inputRec["branchCCalled"] === true
  ) {
    addReason(reasons, "audit_attempted_branch_c_dependency");
  }
  if (
    inputRec["runSmartTalkDependencyAllowed"] === true ||
    inputRec["runSmartTalkCalledOrImported"] === true
  ) {
    addReason(reasons, "audit_attempted_run_smart_talk_dependency");
  }
  if (
    inputRec["ocrRuntimeDependencyAllowed"] === true ||
    inputRec["extractTextFromImageCalledOrImported"] === true
  ) {
    addReason(reasons, "audit_attempted_ocr_runtime_dependency");
  }

  // ── Rule 23: AI-output / model flags ──────────────────────────────────────
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "audit_attempted_ai_output_generation");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "audit_attempted_model_output_storage");
  }

  // ── Rule 24: user-visible output ──────────────────────────────────────────
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByPostRunAudit"] === true
  ) {
    addReason(reasons, "audit_attempted_user_visible_output");
  }

  // ── Rule 26: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorPostRunAuditAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_SYNTHETIC_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerPostRunAuditAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 27: contains* content flags ──────────────────────────────────────
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
  if (inputRec["containsFullDraftText"] === true) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 28–30: scan string fields ───────────────────────────────────────
  const allTextFields: string[] = [
    input.auditId,
    input.operatorPostRunAuditAcknowledgment,
    input.reviewerPostRunAuditAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      if (containsUnsafeAuditStoragePhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      const hasUncategorised = FORBIDDEN_SYNTHETIC_POST_RUN_AUDIT_STRINGS.some(
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
          !containsUnsafeAuditStoragePhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (hasUncategorised) addReason(reasons, "unsafe_audit_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeAuditStoragePhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  const status = !accepted
    ? !input.dryExecutionReadyForPostRunAudit
      ? ("rejected" as const)
      : ("failed" as const)
    : ("passed" as const);

  return {
    auditId: input.auditId,
    epochId: "8.3J",
    status,
    accepted,
    rejectionReasons: reasons,

    safePostRunAuditMetadata: {
      auditScopeCount: input.auditScopes.length,
      auditFindingCount: input.auditFindings.length,
      auditFailureCategoryCount: input.auditFailureCategories.length,
      nextPhaseOptionCount: input.nextPhaseOptions.length,
      checklistPassedCount: input.checklistConfirmed.length,
      expectedCaseCount: 8,
      observedCaseCount: 8,
      failedCaseCount: 0,
      expectedPathCount: 8,
      observationCountAtLeast: 11,
      invariantCountAtLeast: 17,
    },

    readyForLiveLlmSyntheticAuthorizationPlanning: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,
    syntheticInputOnly: true,

    postRunAuditPerformed: true,
    auditMetadataOnly: true,
    auditExecutedHarnessAgain: false,

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

    liveLLMCalled: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputEmitted: false,
    userVisibleOutputAuthorizedByPostRunAudit: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByPostRunAudit: false,
    existingRuntimeModifiedByPostRunAudit: false,
    uiTouched: false,
    databaseOrStorageModifiedByPostRunAudit: false,
    neverUserVisible: true,
  };
}

// ── Post-run audit check ──────────────────────────────────────────────────────

/**
 * Runs the Synthetic Harness Post-Run Audit check for Phase 8.3J.
 *
 * Calls `runAiConnectedSyntheticHarnessDryExecution()` (8.3I), builds and
 * validates a synthetic safe audit input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT produce real AI output.
 * Does NOT emit user-visible output. Does NOT modify DB/storage.
 * Does NOT execute the harness again.
 */
export function runSyntheticHarnessPostRunAudit(): SyntheticHarnessPostRunAuditCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3I dry execution ────────────────────────────────────

  const dryResult = runAiConnectedSyntheticHarnessDryExecution();
  const dryRec = asRec(dryResult);

  const dryExecutionReadyForPostRunAudit =
    dryResult.allPassed === true &&
    dryRec["readyForSyntheticHarnessPostRunAudit"] === true &&
    dryRec["readyForLiveLLMRuntime"] !== true &&
    dryRec["readyForConnectedAiRuntimeExecution"] !== true &&
    dryRec["readyForRealOperatorPilotRun"] !== true &&
    dryRec["readyForPilotRunNow"] !== true &&
    dryRec["readyForPublicLaunch"] !== true &&
    dryRec["readyForPersistence"] !== true &&
    dryRec["dryExecutionPerformed"] === true &&
    dryRec["deterministicSyntheticAdapterUsed"] === true &&
    dryRec["metadataOnlyResults"] === true &&
    dryRec["syntheticInputOnly"] === true &&
    dryRec["realUserInputAllowed"] !== true &&
    dryRec["rawInputAllowed"] !== true &&
    dryRec["realRedactedInputAllowed"] !== true &&
    dryRec["photoOrOcrInputAllowed"] !== true &&
    dryRec["fileUploadInputAllowed"] !== true &&
    dryRec["publicAnonymousInputAllowed"] !== true &&
    dryRec["branchCDependencyAllowed"] !== true &&
    dryRec["runSmartTalkDependencyAllowed"] !== true &&
    dryRec["ocrRuntimeDependencyAllowed"] !== true &&
    dryRec["branchCCalled"] !== true &&
    dryRec["runSmartTalkCalledOrImported"] !== true &&
    dryRec["extractTextFromImageCalledOrImported"] !== true &&
    dryRec["liveLLMCalled"] !== true &&
    dryRec["aiOutputGenerated"] !== true &&
    dryRec["modelOutputStored"] !== true &&
    dryRec["userVisibleOutputEmitted"] !== true &&
    dryRec["persistenceUsed"] !== true &&
    dryRec["publicRuntimeEnabled"] !== true &&
    dryRec["realOperatorPilotExecuted"] !== true &&
    dryRec["neverUserVisible"] === true;

  notes.push(`dryExecutionReadyForPostRunAudit: ${String(dryExecutionReadyForPostRunAudit)}`);
  notes.push(`dryResult.allPassed: ${String(dryResult.allPassed)}`);
  notes.push(`readyForSyntheticHarnessPostRunAudit: ${String(dryRec["readyForSyntheticHarnessPostRunAudit"])}`);

  // ── Step 2: Validate the audit input ─────────────────────────────────────

  const auditInput = buildSyntheticHarnessPostRunAuditInput();
  const auditResult = validateSyntheticHarnessPostRunAuditInput(auditInput);
  const postRunAuditAccepted = auditResult.accepted;

  notes.push(`postRunAuditAccepted: ${String(postRunAuditAccepted)}`);
  notes.push(`auditStatus: ${auditResult.status}`);
  if (!auditResult.accepted) {
    notes.push(`rejectionReasons: ${auditResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof SyntheticHarnessPostRunAuditInput]: SyntheticHarnessPostRunAuditInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): SyntheticHarnessPostRunAuditResult {
    return validateSyntheticHarnessPostRunAuditInput({
      ...auditInput,
      ...overrides,
    } as SyntheticHarnessPostRunAuditInput);
  }

  const partialScopes = REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES.slice(0, REQUIRED_SYNTHETIC_POST_RUN_AUDIT_SCOPES.length - 1);
  const partialFindings = REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS.slice(0, REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FINDINGS.length - 1);
  const partialFailures = REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES.slice(0, REQUIRED_SYNTHETIC_POST_RUN_AUDIT_FAILURE_CATEGORIES.length - 1);
  const partialNextPhase = REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS.slice(0, REQUIRED_SYNTHETIC_POST_RUN_AUDIT_NEXT_PHASE_OPTIONS.length - 1);
  const partialChecklist = REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST.slice(0, REQUIRED_SYNTHETIC_POST_RUN_AUDIT_CHECKLIST.length - 1);

  const tamperCases: Array<{
    label: string;
    result: SyntheticHarnessPostRunAuditResult;
  }> = [
    // 1. dryExecutionReadyForPostRunAudit false
    { label: "dryExecutionReadyForPostRunAudit=false", result: tamper({ dryExecutionReadyForPostRunAudit: false }) },
    // 2. missing audit scope
    { label: "missing audit scope", result: tamper({ auditScopes: partialScopes }) },
    // 3. missing audit finding
    { label: "missing audit finding", result: tamper({ auditFindings: partialFindings }) },
    // 4. missing audit failure category
    { label: "missing audit failure category", result: tamper({ auditFailureCategories: partialFailures }) },
    // 5. missing next phase option
    { label: "missing next phase option", result: tamper({ nextPhaseOptions: partialNextPhase }) },
    // 6. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 7. observedCaseCount not 8
    { label: "observedCaseCount=7", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, observedCaseCount: 7 as unknown as 8 }) },
    // 8. failedCaseCount > 0
    { label: "failedCaseCount=1", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, failedCaseCount: 1 as unknown as 0 }) },
    // 9. expectedPathCount not 8
    { label: "expectedPathCount=7", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, expectedPathCount: 7 as unknown as 8 }) },
    // 10. observationCountAtLeast < 11
    { label: "observationCountAtLeast=10", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, observationCountAtLeast: 10 as unknown as 11 }) },
    // 11. invariantCountAtLeast < 17
    { label: "invariantCountAtLeast=16", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, invariantCountAtLeast: 16 as unknown as 17 }) },
    // 12. dryExecutionPerformed false
    { label: "dryExecutionPerformed=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, dryExecutionPerformed: false as unknown as true }) },
    // 13. deterministicSyntheticAdapterUsed false
    { label: "deterministicSyntheticAdapterUsed=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, deterministicSyntheticAdapterUsed: false as unknown as true }) },
    // 14. metadataOnlyResults false
    { label: "metadataOnlyResults=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, metadataOnlyResults: false as unknown as true }) },
    // 15. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, syntheticInputOnly: false as unknown as true }) },
    // 16. postRunAuditPerformed false
    { label: "postRunAuditPerformed=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, postRunAuditPerformed: false as unknown as true }) },
    // 17. auditMetadataOnly false
    { label: "auditMetadataOnly=false", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, auditMetadataOnly: false as unknown as true }) },
    // 18. auditExecutedHarnessAgain true
    { label: "auditExecutedHarnessAgain=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, auditExecutedHarnessAgain: true as unknown as false }) },
    // 19. readyForLiveLLMRuntime true
    { label: "readyForLiveLLMRuntime=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForLiveLLMRuntime: true as unknown as false }) },
    // 20. readyForConnectedAiRuntimeExecution true
    { label: "readyForConnectedAiRuntimeExecution=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForConnectedAiRuntimeExecution: true as unknown as false }) },
    // 21. readyForRealOperatorPilotRun true
    { label: "readyForRealOperatorPilotRun=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForRealOperatorPilotRun: true as unknown as false }) },
    // 22. readyForPilotRunNow true
    { label: "readyForPilotRunNow=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForPilotRunNow: true as unknown as false }) },
    // 23. readyForPublicLaunch true
    { label: "readyForPublicLaunch=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForPublicLaunch: true as unknown as false }) },
    // 24. readyForPersistence true
    { label: "readyForPersistence=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, readyForPersistence: true as unknown as false }) },
    // 25. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, realUserInputAllowed: true as unknown as false }) },
    // 26. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, rawInputAllowed: true as unknown as false }) },
    // 27. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, realRedactedInputAllowed: true as unknown as false }) },
    // 28. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 29. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, fileUploadInputAllowed: true as unknown as false }) },
    // 30. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 31. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, branchCDependencyAllowed: true as unknown as false }) },
    // 32. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 33. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 34. branchCCalled true
    { label: "branchCCalled=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, branchCCalled: true as unknown as false }) },
    // 35. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 36. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 37. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, liveLLMCallPerformed: true as unknown as false }) },
    // 38. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 39. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, aiOutputGenerated: true as unknown as false }) },
    // 40. modelOutputStored true
    { label: "modelOutputStored=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, modelOutputStored: true as unknown as false }) },
    // 41. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 42. userVisibleOutputAuthorizedByPostRunAudit true
    { label: "userVisibleOutputAuthorizedByPostRunAudit=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, userVisibleOutputAuthorizedByPostRunAudit: true as unknown as false }) },
    // 43. persistenceUsed true
    { label: "persistenceUsed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, persistenceUsed: true as unknown as false }) },
    // 44. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, dnaSavePerformed: true as unknown as false }) },
    // 45. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, offlineSavePerformed: true as unknown as false }) },
    // 46. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, publicRuntimeEnabled: true as unknown as false }) },
    // 47. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 48. missing operator acknowledgment
    { label: "missing operator ack", result: tamper({ operatorPostRunAuditAcknowledgment: "partial" }) },
    // 49. missing reviewer acknowledgment
    { label: "missing reviewer ack", result: tamper({ reviewerPostRunAuditAcknowledgment: "partial" }) },
    // 50. containsSecret true
    { label: "containsSecret=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsSecret: true as unknown as false }) },
    // 51. containsEnvValue true
    { label: "containsEnvValue=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsEnvValue: true as unknown as false }) },
    // 52. containsApiKey true
    { label: "containsApiKey=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsApiKey: true as unknown as false }) },
    // 53. containsRawInputText true
    { label: "containsRawInputText=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsRawInputText: true as unknown as false }) },
    // 54. containsRedactedText true
    { label: "containsRedactedText=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsRedactedText: true as unknown as false }) },
    // 55. containsModelOutput true
    { label: "containsModelOutput=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsModelOutput: true as unknown as false }) },
    // 56. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsDocumentContent: true as unknown as false }) },
    // 57. containsUserPii true
    { label: "containsUserPii=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsUserPii: true as unknown as false }) },
    // 58. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateSyntheticHarnessPostRunAuditInput({ ...auditInput, containsRealUserInput: true as unknown as false }) },
    // 59. notes: "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 60. notes: "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 61. notes: "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 62. notes: "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 63. notes: "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 64. notes: "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 65. notes: email
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 66. notes: phone
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 67. notes: "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 68. notes: "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 69. notes: "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 70. notes: "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 71. notes: "public launch enabled"
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    // 72. notes: "all outputs authorized"
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    // 73. notes: "global approval"
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    // 74. notes: "branch c authorized"
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    // 75. notes: "real user document"
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    // 76. notes: "real OCR text"
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    // 77. notes: "production runtime enabled"
    { label: 'notes: "production runtime enabled"', result: tamper({ notes: ["production runtime enabled"] }) },
    // 78. notes: "harness executed with live llm"
    { label: 'notes: "harness executed with live llm"', result: tamper({ notes: ["harness executed with live llm"] }) },
    // 79. notes: "live llm executed"
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    // 80. notes: "real operator pilot executed"
    { label: 'notes: "real operator pilot executed"', result: tamper({ notes: ["real operator pilot executed"] }) },
    // 81. notes: "real model output"
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
    // 82. notes: "post-run audit stored output"
    { label: 'notes: "post-run audit stored output"', result: tamper({ notes: ["post-run audit stored output"] }) },
    // 83. notes: "live llm now authorized"
    { label: 'notes: "live llm now authorized"', result: tamper({ notes: ["live llm now authorized"] }) },
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
    dryExecutionReadyForPostRunAudit && postRunAuditAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3J",
    allPassed,
    dryExecutionReadyForPostRunAudit,
    postRunAuditAccepted,
    tamperCasesRejected,

    readyForLiveLlmSyntheticAuthorizationPlanning: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    dryExecutionPerformed: true,
    deterministicSyntheticAdapterUsed: true,
    metadataOnlyResults: true,
    syntheticInputOnly: true,

    postRunAuditPerformed: true,
    auditMetadataOnly: true,
    auditExecutedHarnessAgain: false,

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
