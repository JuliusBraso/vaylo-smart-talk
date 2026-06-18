/**
 * Post-Call Governance Recheck (Phase 8.3P).
 *
 * A metadata-only governance recheck layer that runs after Phase 8.3O
 * (Live LLM Synthetic Single-Call Execution).
 *
 * What this module does:
 *   1. Verifies Phase 8.3O execution result via dependency call.
 *   2. Confirms exactly one synthetic live LLM call occurred.
 *   3. Verifies that prompt text and model output were never logged/stored/returned.
 *   4. Verifies model output was marked untrusted and is unavailable for review.
 *   5. Verifies metadata-only capture and all runtime/input/persistence isolation.
 *   6. Validates the recheck input for all safety invariants.
 *   7. Runs tamper cases without making extra live calls.
 *
 * What this module does NOT do:
 *   - Does NOT call OpenAI or any live LLM
 *   - Does NOT call fetch()
 *   - Does NOT read process.env
 *   - Does NOT import any LLM SDK
 *   - Does NOT reconstruct prompt text
 *   - Does NOT inspect model output text (it was discarded in 8.3O)
 *   - Does NOT log model output
 *   - Does NOT call Branch C, run-smart-talk.ts, or OCR runtime
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Does NOT auto-execute at module load
 *
 * ISOLATION NOTE:
 *   This module does NOT import, call, or wrap:
 *   - lib/vaylo/smart-talk/run-smart-talk.ts
 *   - lib/vaylo/smart-talk/extract-text-from-image.ts
 *   - app/api/smart-talk/route.ts
 *   - any LLM SDK
 *
 * NOTE: Calling `runPostCallGovernanceRecheck()` will invoke
 * `runLiveLlmSyntheticSingleCallExecution()` (8.3O), which in turn may
 * perform one live OpenAI call if `OPENAI_API_KEY` is present. This is
 * acceptable as part of a single full-chain invocation. This module
 * (8.3P) does NOT contain its own fetch/OpenAI call.
 */

import { runLiveLlmSyntheticSingleCallExecution } from "./run-live-llm-synthetic-single-call-execution";
import {
  BLOCKING_RECHECK_REJECTION_REASONS,
  FORBIDDEN_POST_CALL_GOVERNANCE_RECHECK_STRINGS,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS,
  REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES,
} from "./post-call-governance-recheck-types";
import type {
  PostCallGovernanceRecheckCheckResult,
  PostCallGovernanceRecheckInput,
  PostCallGovernanceRecheckRejectionReason,
  PostCallGovernanceRecheckResult,
} from "./post-call-governance-recheck-types";

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
  "public launch enabled",
  "all outputs authorized",
  "global approval",
  "branch c authorized",
  "approved for user display",
  "auto-approved",
  "show to user now",
  "authorized public runtime",
  "real user output approved",
];
const UNSAFE_REAL_INPUT_PHRASES = [
  "real user document",
  "real OCR text",
  "production runtime enabled",
];
const UNSAFE_LIVE_EXEC_PHRASES = [
  "harness executed with live llm",
  "live llm executed",
  "real operator pilot executed",
  "real model output",
  "second live llm call",
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
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_POST_CALL_GOVERNANCE_RECHECK_STRINGS.some((f) => value.includes(f));
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
  list: PostCallGovernanceRecheckRejectionReason[],
  reason: PostCallGovernanceRecheckRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds a `PostCallGovernanceRecheckInput` representing a metadata-only
 * governance recheck after 8.3O execution.
 *
 * Default params represent the successful post-call path.
 * When `executionReady: false`, the input will fail at rule 1 (prerequisite).
 * When `modelOutputReceived: false`, validation fails at rule 15.
 */
export function buildPostCallGovernanceRecheckInput(params?: {
  readonly executionReady?: boolean;
  readonly modelOutputReceived?: boolean;
  readonly modelOutputMarkedUntrusted?: boolean;
  readonly postCallAuditReady?: boolean;
}): PostCallGovernanceRecheckInput {
  const executionReady = params?.executionReady ?? true;
  const modelOutputReceived = params?.modelOutputReceived ?? true;
  const modelOutputMarkedUntrusted = params?.modelOutputMarkedUntrusted ?? true;
  const postCallAuditReady = params?.postCallAuditReady ?? true;

  const ackStatements =
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    recheckId: "post-call-governance-recheck-8-3p",
    epochId: "8.3P",
    previousPhaseId: "8.3O",

    executionReadyForPostCallGovernanceRecheck: executionReady,

    scopes: [...REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES],
    findings: [...REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS],
    requirements: [...REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS],
    blockers: [...REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS],
    checklistConfirmed: [...REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST],

    provider: "openai",
    model: "gpt_4o_mini",
    selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",

    metadataOnlyRecheck: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,
    callCount: 1,

    promptTextAvailableForReview: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForReview: false,
    modelOutputReceived: modelOutputReceived as unknown as true,
    modelOutputMarkedUntrusted: modelOutputMarkedUntrusted as unknown as true,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallAuditReady: postCallAuditReady as unknown as true,

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
    userVisibleOutputAuthorizedByRecheck: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    operatorPostCallGovernanceRecheckAcknowledgment: ackStatements,
    reviewerPostCallGovernanceRecheckAcknowledgment: ackStatements,
    notes: [
      "post-call governance recheck completed using metadata only",
      "model output remains unavailable for review by design",
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
  } as PostCallGovernanceRecheckInput;
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `PostCallGovernanceRecheckInput` and returns a typed
 * `PostCallGovernanceRecheckResult`.
 *
 * Status:
 * - "passed"   — accepted (all invariants pass)
 * - "blocked"  — only blocking reasons (execution_not_ready etc.), no unsafe violations
 * - "rejected" — at least one unsafe violation
 */
export function validatePostCallGovernanceRecheckInput(
  input: PostCallGovernanceRecheckInput,
): PostCallGovernanceRecheckResult {
  const reasons: PostCallGovernanceRecheckRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.executionReadyForPostCallGovernanceRecheck) {
    addReason(reasons, "execution_not_ready");
  }

  // ── Rules 2–6: required list completeness ─────────────────────────────────
  for (const s of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES) {
    if (!input.scopes.includes(s)) { addReason(reasons, "missing_recheck_scope"); break; }
  }
  for (const f of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS) {
    if (!input.findings.includes(f)) { addReason(reasons, "missing_recheck_finding"); break; }
  }
  for (const r of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS) {
    if (!input.requirements.includes(r)) { addReason(reasons, "missing_recheck_requirement"); break; }
  }
  for (const b of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS) {
    if (!input.blockers.includes(b)) { addReason(reasons, "missing_recheck_blocker"); break; }
  }
  for (const c of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST) {
    if (!input.checklistConfirmed.includes(c)) { addReason(reasons, "missing_checklist_item"); break; }
  }

  // ── Rule 7: provider / model / case ───────────────────────────────────────
  if (input.provider !== "openai") addReason(reasons, "provider_mismatch");
  if (input.model !== "gpt_4o_mini") addReason(reasons, "model_mismatch");
  if (input.selectedSyntheticCase !== "synthetic_deadline_relative_missing_delivery_date") {
    addReason(reasons, "selected_case_mismatch");
  }

  // ── Rule 8: metadataOnlyRecheck ───────────────────────────────────────────
  if (inputRec["metadataOnlyRecheck"] !== true) addReason(reasons, "metadata_only_capture_missing");

  // ── Rule 9: liveLLMCalledAgain ────────────────────────────────────────────
  if (inputRec["liveLLMCalledAgain"] === true) addReason(reasons, "live_llm_called_again");

  // ── Rule 10: liveLLMCalledExactlyOnce ─────────────────────────────────────
  if (inputRec["liveLLMCalledExactlyOnce"] !== true) {
    addReason(reasons, "more_than_one_call_detected");
  }

  // ── Rule 11: callCount ────────────────────────────────────────────────────
  if (inputRec["callCount"] !== 1) addReason(reasons, "more_than_one_call_detected");

  // ── Rule 12: prompt unavailability ────────────────────────────────────────
  if (inputRec["promptTextAvailableForReview"] === true) {
    addReason(reasons, "prompt_text_available_for_review");
  }

  // ── Rule 13: prompt non-logging ───────────────────────────────────────────
  if (inputRec["promptTextLogged"] === true) addReason(reasons, "prompt_text_logged_or_stored");
  if (inputRec["promptTextStored"] === true) addReason(reasons, "prompt_text_logged_or_stored");
  if (inputRec["promptTextReturned"] === true) addReason(reasons, "prompt_text_logged_or_stored");

  // ── Rule 14: model output unavailability ──────────────────────────────────
  if (inputRec["modelOutputAvailableForReview"] === true) {
    addReason(reasons, "model_output_available_for_review");
  }

  // ── Rule 15: modelOutputReceived ─────────────────────────────────────────
  if (inputRec["modelOutputReceived"] !== true) addReason(reasons, "execution_failed");

  // ── Rule 16: modelOutputMarkedUntrusted ───────────────────────────────────
  if (inputRec["modelOutputMarkedUntrusted"] !== true) {
    addReason(reasons, "model_output_not_untrusted");
  }

  // ── Rule 17: model output non-logging ─────────────────────────────────────
  if (inputRec["modelOutputLogged"] === true) addReason(reasons, "model_output_logged_or_stored");
  if (inputRec["modelOutputStored"] === true) addReason(reasons, "model_output_logged_or_stored");
  if (inputRec["modelOutputReturned"] === true) addReason(reasons, "model_output_logged_or_stored");

  // ── Rule 18: metadataOnlyCaptured ─────────────────────────────────────────
  if (inputRec["metadataOnlyCaptured"] !== true) addReason(reasons, "metadata_only_capture_missing");

  // ── Rule 19: postCallAuditReady ───────────────────────────────────────────
  if (inputRec["postCallAuditReady"] !== true) addReason(reasons, "post_call_audit_not_ready");

  // ── Rule 20: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) addReason(reasons, "real_input_detected");

  // ── Rule 21: real/raw/OCR/file/public ─────────────────────────────────────
  if (inputRec["realUserInputAllowed"] === true || inputRec["containsRealUserInput"] === true) {
    addReason(reasons, "real_input_detected");
  }
  if (inputRec["rawInputAllowed"] === true || inputRec["containsRawInputText"] === true) {
    addReason(reasons, "raw_input_detected");
  }
  if (inputRec["realRedactedInputAllowed"] === true || inputRec["containsRedactedText"] === true) {
    addReason(reasons, "redacted_input_detected");
  }
  if (inputRec["photoOrOcrInputAllowed"] === true || inputRec["fileUploadInputAllowed"] === true) {
    addReason(reasons, "ocr_photo_file_input_detected");
  }
  if (inputRec["publicAnonymousInputAllowed"] === true) {
    addReason(reasons, "real_input_detected");
  }

  // ── Rule 22: dependency flags ─────────────────────────────────────────────
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

  // ── Rule 23: user-visible output ──────────────────────────────────────────
  if (
    inputRec["userVisibleOutputEmitted"] === true ||
    inputRec["userVisibleOutputAuthorizedByRecheck"] === true
  ) {
    addReason(reasons, "user_visible_output_detected");
  }

  // ── Rule 24: persistence / public / pilot ─────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["dnaSavePerformed"] === true ||
    inputRec["offlineSavePerformed"] === true
  ) {
    addReason(reasons, "persistence_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) addReason(reasons, "public_runtime_detected");
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "real_operator_pilot_detected");
  }

  // ── Rule 25: dangerous readiness flags ────────────────────────────────────
  if (
    inputRec["readyForLiveLLMRuntime"] === true ||
    inputRec["readyForConnectedAiRuntimeExecution"] === true ||
    inputRec["readyForRealOperatorPilotRun"] === true ||
    inputRec["readyForPilotRunNow"] === true ||
    inputRec["readyForPublicLaunch"] === true ||
    inputRec["readyForPersistence"] === true
  ) {
    addReason(reasons, "unsafe_recheck_note_detected");
  }

  // ── Rule 26: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorPostCallGovernanceRecheckAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_POST_CALL_GOVERNANCE_RECHECK_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerPostCallGovernanceRecheckAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 27: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 28–30: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.recheckId,
    input.operatorPostCallGovernanceRecheckAcknowledgment,
    input.reviewerPostCallGovernanceRecheckAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
      if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
      const hasUncategorised = FORBIDDEN_POST_CALL_GOVERNANCE_RECHECK_STRINGS.some(
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
      if (hasUncategorised) addReason(reasons, "unsafe_recheck_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
    if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
  }

  // ── Determine status ──────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const isBlocked =
    !accepted && reasons.every((r) => BLOCKING_RECHECK_REJECTION_REASONS.has(r));

  const status = accepted ? "passed" : isBlocked ? "blocked" : "rejected";

  const outputModelOutputReceived = asRec(input)["modelOutputReceived"] === true;
  const outputModelOutputUntrusted = asRec(input)["modelOutputMarkedUntrusted"] === true;

  return {
    recheckId: input.recheckId,
    epochId: "8.3P",
    status,
    accepted,
    rejectionReasons: reasons,

    safeRecheckMetadata: {
      scopeCount: input.scopes.length,
      findingCount: input.findings.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      provider: "openai",
      model: "gpt_4o_mini",
      selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",
      callCount: 1,
      metadataOnlyRecheck: true,
      modelOutputReceived: outputModelOutputReceived,
      modelOutputMarkedUntrusted: outputModelOutputUntrusted,
      metadataOnlyCaptured: asRec(input)["metadataOnlyCaptured"] === true,
    },

    postCallGovernanceRecheckPassed: accepted,
    readyForPostCallAudit: accepted,
    readyForSyntheticLiveLlmPilotExpansionPlanning: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    metadataOnlyRecheck: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,

    promptTextAvailableForReview: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForReview: false,
    modelOutputReceived: outputModelOutputReceived,
    modelOutputMarkedUntrusted: outputModelOutputUntrusted,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallAuditReady: accepted,

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
    userVisibleOutputAuthorizedByRecheck: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByRecheck: false,
    existingRuntimeModifiedByRecheck: false,
    uiTouched: false,
    databaseOrStorageModifiedByRecheck: false,
    neverUserVisible: true,
  };
}

// ── Main recheck function ─────────────────────────────────────────────────────

/**
 * Runs the Post-Call Governance Recheck for Phase 8.3P.
 *
 * 1. Calls runLiveLlmSyntheticSingleCallExecution() (8.3O) as dependency.
 *    NOTE: This may trigger one live OpenAI call if OPENAI_API_KEY is present.
 *    8.3P itself does NOT contain any fetch/OpenAI call.
 * 2. Verifies all 8.3O safety invariants.
 * 3. If prerequisites pass, builds a valid recheck input and validates.
 * 4. If prerequisites fail, builds a blocked input without inspection.
 * 5. Runs tamper cases without making extra live calls.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export async function runPostCallGovernanceRecheck(): Promise<PostCallGovernanceRecheckCheckResult> {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3O execution result ─────────────────────────────────

  const execResult = await runLiveLlmSyntheticSingleCallExecution();
  const execRec = asRec(execResult);

  const execReady =
    execResult.allPassed === true &&
    execRec["readyForPostCallGovernanceRecheck"] === true &&
    execRec["readyForPostCallAudit"] === true &&
    execRec["readyForLiveLLMRuntime"] !== true &&
    execRec["readyForConnectedAiRuntimeExecution"] !== true &&
    execRec["readyForRealOperatorPilotRun"] !== true &&
    execRec["readyForPilotRunNow"] !== true &&
    execRec["readyForPublicLaunch"] !== true &&
    execRec["readyForPersistence"] !== true &&
    execRec["liveLLMCalled"] === true &&
    execRec["liveLLMCalledExactlyOnce"] === true &&
    execRec["apiKeyValueLogged"] !== true &&
    execRec["apiKeyValueReturned"] !== true &&
    execRec["promptConstructedInMemoryOnly"] === true &&
    execRec["promptTextLogged"] !== true &&
    execRec["promptTextStored"] !== true &&
    execRec["promptTextReturned"] !== true &&
    execRec["modelOutputReceived"] === true &&
    execRec["modelOutputMarkedUntrusted"] === true &&
    execRec["modelOutputLogged"] !== true &&
    execRec["modelOutputStored"] !== true &&
    execRec["modelOutputReturned"] !== true &&
    execRec["metadataOnlyCaptured"] === true &&
    execRec["syntheticInputOnly"] === true &&
    execRec["realUserInputAllowed"] !== true &&
    execRec["rawInputAllowed"] !== true &&
    execRec["realRedactedInputAllowed"] !== true &&
    execRec["photoOrOcrInputAllowed"] !== true &&
    execRec["fileUploadInputAllowed"] !== true &&
    execRec["publicAnonymousInputAllowed"] !== true &&
    execRec["branchCDependencyAllowed"] !== true &&
    execRec["runSmartTalkDependencyAllowed"] !== true &&
    execRec["ocrRuntimeDependencyAllowed"] !== true &&
    execRec["branchCCalled"] !== true &&
    execRec["runSmartTalkCalledOrImported"] !== true &&
    execRec["extractTextFromImageCalledOrImported"] !== true &&
    execRec["userVisibleOutputEmitted"] !== true &&
    execRec["persistenceUsed"] !== true &&
    execRec["publicRuntimeEnabled"] !== true &&
    execRec["realOperatorPilotExecuted"] !== true &&
    execRec["neverUserVisible"] === true;

  notes.push(`execReady: ${String(execReady)}`);
  notes.push(`execResult.allPassed: ${String(execResult.allPassed)}`);
  notes.push(
    `readyForPostCallGovernanceRecheck: ${String(execRec["readyForPostCallGovernanceRecheck"])}`,
  );

  // ── Step 2/3: Build and validate recheck input ────────────────────────────

  let recheckInput: PostCallGovernanceRecheckInput;

  if (!execReady) {
    notes.push("execution prerequisite failed — building blocked recheck input");
    recheckInput = buildPostCallGovernanceRecheckInput({
      executionReady: false,
      modelOutputReceived: false,
      modelOutputMarkedUntrusted: false,
      postCallAuditReady: false,
    });
  } else {
    recheckInput = buildPostCallGovernanceRecheckInput({
      executionReady: true,
      modelOutputReceived: true,
      modelOutputMarkedUntrusted: true,
      postCallAuditReady: true,
    });
  }

  const recheckResult = validatePostCallGovernanceRecheckInput(recheckInput);
  const recheckAccepted = recheckResult.accepted;

  notes.push(`recheckAccepted: ${String(recheckAccepted)}`);
  notes.push(`recheckStatus: ${recheckResult.status}`);
  if (!recheckResult.accepted) {
    notes.push(`rejectionReasons: ${recheckResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 4: Tamper cases — synthetic flags only, NO extra live calls ───────

  const tamperBase = buildPostCallGovernanceRecheckInput({
    executionReady: true,
    modelOutputReceived: true,
    modelOutputMarkedUntrusted: true,
    postCallAuditReady: true,
  });

  type MutableInput = {
    -readonly [K in keyof PostCallGovernanceRecheckInput]: PostCallGovernanceRecheckInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): PostCallGovernanceRecheckResult {
    return validatePostCallGovernanceRecheckInput({
      ...tamperBase,
      ...overrides,
    } as PostCallGovernanceRecheckInput);
  }

  const partialScopes = REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES.slice(
    0,
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_SCOPES.length - 1,
  );
  const partialFindings = REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS.slice(
    0,
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_FINDINGS.length - 1,
  );
  const partialRequirements = REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS.slice(
    0,
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_REQUIREMENTS.length - 1,
  );
  const partialBlockers = REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS.slice(
    0,
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_BLOCKERS.length - 1,
  );
  const partialChecklist = REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST.slice(
    0,
    REQUIRED_POST_CALL_GOVERNANCE_RECHECK_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{ label: string; result: PostCallGovernanceRecheckResult }> = [
    // 1. executionReadyForPostCallGovernanceRecheck false
    { label: "execReady=false", result: tamper({ executionReadyForPostCallGovernanceRecheck: false }) },
    // 2. missing scope
    { label: "missing scope", result: tamper({ scopes: partialScopes }) },
    // 3. missing finding
    { label: "missing finding", result: tamper({ findings: partialFindings }) },
    // 4. missing requirement
    { label: "missing requirement", result: tamper({ requirements: partialRequirements }) },
    // 5. missing blocker
    { label: "missing blocker", result: tamper({ blockers: partialBlockers }) },
    // 6. missing checklist item
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 7. provider mismatch
    { label: "provider mismatch", result: tamper({ provider: "anthropic" as unknown as "openai" }) },
    // 8. model mismatch
    { label: "model mismatch", result: tamper({ model: "gpt_4_turbo" as unknown as "gpt_4o_mini" }) },
    // 9. selectedSyntheticCase mismatch
    {
      label: "case mismatch",
      result: tamper({
        selectedSyntheticCase: "other_case" as unknown as "synthetic_deadline_relative_missing_delivery_date",
      }),
    },
    // 10. metadataOnlyRecheck false
    {
      label: "metadataOnlyRecheck=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        metadataOnlyRecheck: false as unknown as true,
      }),
    },
    // 11. liveLLMCalledAgain true
    {
      label: "liveLLMCalledAgain=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        liveLLMCalledAgain: true as unknown as false,
      }),
    },
    // 12. liveLLMCalledExactlyOnce false
    {
      label: "liveLLMCalledExactlyOnce=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        liveLLMCalledExactlyOnce: false as unknown as true,
      }),
    },
    // 13. callCount 0
    {
      label: "callCount=0",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        callCount: 0 as unknown as 1,
      }),
    },
    // 14. callCount 2
    {
      label: "callCount=2",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        callCount: 2 as unknown as 1,
      }),
    },
    // 15. promptTextAvailableForReview true
    {
      label: "promptTextAvailableForReview=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        promptTextAvailableForReview: true as unknown as false,
      }),
    },
    // 16. promptTextLogged true
    {
      label: "promptTextLogged=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        promptTextLogged: true as unknown as false,
      }),
    },
    // 17. promptTextStored true
    {
      label: "promptTextStored=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        promptTextStored: true as unknown as false,
      }),
    },
    // 18. promptTextReturned true
    {
      label: "promptTextReturned=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        promptTextReturned: true as unknown as false,
      }),
    },
    // 19. modelOutputAvailableForReview true
    {
      label: "modelOutputAvailableForReview=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputAvailableForReview: true as unknown as false,
      }),
    },
    // 20. modelOutputReceived false
    {
      label: "modelOutputReceived=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputReceived: false as unknown as true,
      }),
    },
    // 21. modelOutputMarkedUntrusted false
    {
      label: "modelOutputMarkedUntrusted=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputMarkedUntrusted: false as unknown as true,
      }),
    },
    // 22. modelOutputLogged true
    {
      label: "modelOutputLogged=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputLogged: true as unknown as false,
      }),
    },
    // 23. modelOutputStored true
    {
      label: "modelOutputStored=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputStored: true as unknown as false,
      }),
    },
    // 24. modelOutputReturned true
    {
      label: "modelOutputReturned=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        modelOutputReturned: true as unknown as false,
      }),
    },
    // 25. metadataOnlyCaptured false
    {
      label: "metadataOnlyCaptured=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        metadataOnlyCaptured: false as unknown as true,
      }),
    },
    // 26. postCallAuditReady false
    {
      label: "postCallAuditReady=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        postCallAuditReady: false as unknown as true,
      }),
    },
    // 27. syntheticInputOnly false
    {
      label: "syntheticInputOnly=false",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        syntheticInputOnly: false as unknown as true,
      }),
    },
    // 28. realUserInputAllowed true
    {
      label: "realUserInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        realUserInputAllowed: true as unknown as false,
      }),
    },
    // 29. rawInputAllowed true
    {
      label: "rawInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        rawInputAllowed: true as unknown as false,
      }),
    },
    // 30. realRedactedInputAllowed true
    {
      label: "realRedactedInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        realRedactedInputAllowed: true as unknown as false,
      }),
    },
    // 31. photoOrOcrInputAllowed true
    {
      label: "photoOrOcrInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        photoOrOcrInputAllowed: true as unknown as false,
      }),
    },
    // 32. fileUploadInputAllowed true
    {
      label: "fileUploadInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        fileUploadInputAllowed: true as unknown as false,
      }),
    },
    // 33. publicAnonymousInputAllowed true
    {
      label: "publicAnonymousInputAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        publicAnonymousInputAllowed: true as unknown as false,
      }),
    },
    // 34. branchCDependencyAllowed true
    {
      label: "branchCDependencyAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        branchCDependencyAllowed: true as unknown as false,
      }),
    },
    // 35. runSmartTalkDependencyAllowed true
    {
      label: "runSmartTalkDependencyAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        runSmartTalkDependencyAllowed: true as unknown as false,
      }),
    },
    // 36. ocrRuntimeDependencyAllowed true
    {
      label: "ocrRuntimeDependencyAllowed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        ocrRuntimeDependencyAllowed: true as unknown as false,
      }),
    },
    // 37. branchCCalled true
    {
      label: "branchCCalled=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        branchCCalled: true as unknown as false,
      }),
    },
    // 38. runSmartTalkCalledOrImported true
    {
      label: "runSmartTalkCalledOrImported=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        runSmartTalkCalledOrImported: true as unknown as false,
      }),
    },
    // 39. extractTextFromImageCalledOrImported true
    {
      label: "extractTextFromImageCalledOrImported=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        extractTextFromImageCalledOrImported: true as unknown as false,
      }),
    },
    // 40. userVisibleOutputEmitted true
    {
      label: "userVisibleOutputEmitted=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        userVisibleOutputEmitted: true as unknown as false,
      }),
    },
    // 41. userVisibleOutputAuthorizedByRecheck true
    {
      label: "userVisibleOutputAuthorizedByRecheck=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        userVisibleOutputAuthorizedByRecheck: true as unknown as false,
      }),
    },
    // 42. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 43. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 44. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 45. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 46. realOperatorPilotExecuted true
    {
      label: "realOperatorPilotExecuted=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        realOperatorPilotExecuted: true as unknown as false,
      }),
    },
    // 47. readyForLiveLLMRuntime true
    {
      label: "readyForLiveLLMRuntime=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForLiveLLMRuntime: true as unknown as false,
      }),
    },
    // 48. readyForConnectedAiRuntimeExecution true
    {
      label: "readyForConnectedAiRuntimeExecution=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForConnectedAiRuntimeExecution: true as unknown as false,
      }),
    },
    // 49. readyForRealOperatorPilotRun true
    {
      label: "readyForRealOperatorPilotRun=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForRealOperatorPilotRun: true as unknown as false,
      }),
    },
    // 50. readyForPilotRunNow true
    {
      label: "readyForPilotRunNow=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForPilotRunNow: true as unknown as false,
      }),
    },
    // 51. readyForPublicLaunch true
    {
      label: "readyForPublicLaunch=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForPublicLaunch: true as unknown as false,
      }),
    },
    // 52. readyForPersistence true
    {
      label: "readyForPersistence=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        readyForPersistence: true as unknown as false,
      }),
    },
    // 53. missing operator ack
    {
      label: "missing operator ack",
      result: tamper({ operatorPostCallGovernanceRecheckAcknowledgment: "partial" }),
    },
    // 54. missing reviewer ack
    {
      label: "missing reviewer ack",
      result: tamper({ reviewerPostCallGovernanceRecheckAcknowledgment: "partial" }),
    },
    // 55. containsSecret true
    {
      label: "containsSecret=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsSecret: true as unknown as false,
      }),
    },
    // 56. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 57. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsApiKey: true as unknown as false,
      }),
    },
    // 58. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 59. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 60. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 61. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 62. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsUserPii: true as unknown as false,
      }),
    },
    // 63. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validatePostCallGovernanceRecheckInput({
        ...tamperBase,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 64–93: notes with forbidden strings
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=val"] }) },
    {
      label: 'notes: "process.env.OPENAI_API_KEY"',
      result: tamper({ notes: ["process.env.OPENAI_API_KEY"] }),
    },
    { label: 'notes: "apiKey:"', result: tamper({ notes: ["apiKey: abc"] }) },
    {
      label: 'notes: "Authorization: Bearer"',
      result: tamper({ notes: ["Authorization: Bearer token"] }),
    },
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "stored completion"', result: tamper({ notes: ["stored completion"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    { label: 'notes: "model output reviewed"', result: tamper({ notes: ["model output reviewed"] }) },
    { label: 'notes: "prompt reviewed"', result: tamper({ notes: ["prompt reviewed"] }) },
    { label: 'notes: "second live llm call"', result: tamper({ notes: ["second live llm call"] }) },
    {
      label: 'notes: "real user output approved"',
      result: tamper({ notes: ["real user output approved"] }),
    },
    {
      label: 'notes: "public launch enabled"',
      result: tamper({ notes: ["public launch enabled"] }),
    },
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    { label: 'notes: "real user document"', result: tamper({ notes: ["real user document"] }) },
    { label: 'notes: "real OCR text"', result: tamper({ notes: ["real OCR text"] }) },
    {
      label: 'notes: "live llm executed"',
      result: tamper({ notes: ["live llm executed"] }),
    },
    {
      label: 'notes: "multiple live llm calls authorized"',
      result: tamper({ notes: ["multiple live llm calls authorized"] }),
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

  const allPassed = execReady && recheckAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  if (!execReady) {
    notes.push("recheck blocked: execution prerequisite not satisfied");
  }

  const outputModelOutputReceived = execReady && recheckAccepted;
  const outputModelOutputUntrusted = execReady && recheckAccepted;

  return {
    checkId: "8.3P",
    allPassed,
    executionReadyForPostCallGovernanceRecheck: execReady,
    postCallGovernanceRecheckAccepted: recheckAccepted,
    tamperCasesRejected,

    postCallGovernanceRecheckPassed: allPassed,
    readyForPostCallAudit: allPassed,
    readyForSyntheticLiveLlmPilotExpansionPlanning: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    metadataOnlyRecheck: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,

    promptTextAvailableForReview: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForReview: false,
    modelOutputReceived: outputModelOutputReceived,
    modelOutputMarkedUntrusted: outputModelOutputUntrusted,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    postCallAuditReady: allPassed,

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
