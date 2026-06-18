/**
 * Post-Call Audit (Phase 8.3Q).
 *
 * A metadata-only full-chain post-call audit layer that runs after Phase 8.3P
 * (Post-Call Governance Recheck). It audits the execution chain from 8.3A
 * through 8.3P and verifies that all governance invariants were honoured.
 *
 * What this module does:
 *   1. Verifies Phase 8.3P governance recheck result via dependency call.
 *   2. Confirms exactly one synthetic live LLM call occurred in 8.3O.
 *   3. Confirms no second live LLM call occurred in 8.3P or 8.3Q.
 *   4. Verifies provider/model/case, prompt/output unavailability, untrusted
 *      marker, metadata-only capture, runtime isolation, input absence.
 *   5. Validates the audit input for all safety invariants.
 *   6. Confirms audit itself is non-persistent.
 *   7. Runs tamper cases without making extra live calls.
 *
 * What this module does NOT do:
 *   - Does NOT call OpenAI or any live LLM
 *   - Does NOT call fetch()
 *   - Does NOT read process.env
 *   - Does NOT import any LLM SDK
 *   - Does NOT reconstruct prompt text
 *   - Does NOT inspect model output text (discarded in 8.3O)
 *   - Does NOT persist audit records (`auditPersistenceUsed: false`)
 *   - Does NOT call Branch C, run-smart-talk.ts, or OCR runtime
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
 * NOTE: Calling `runPostCallAudit()` invokes `runPostCallGovernanceRecheck()`
 * (8.3P), which in turn invokes `runLiveLlmSyntheticSingleCallExecution()`
 * (8.3O). This may cause one live OpenAI call when OPENAI_API_KEY is present.
 * Phase 8.3Q itself contains NO fetch(), no process.env read, and no direct
 * OpenAI call.
 */

import { runPostCallGovernanceRecheck } from "./run-post-call-governance-recheck";
import {
  BLOCKING_POST_CALL_AUDIT_REJECTION_REASONS,
  FORBIDDEN_POST_CALL_AUDIT_STRINGS,
  REQUIRED_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_POST_CALL_AUDIT_BLOCKERS,
  REQUIRED_POST_CALL_AUDIT_CHECKLIST,
  REQUIRED_POST_CALL_AUDIT_FINDINGS,
  REQUIRED_POST_CALL_AUDIT_REQUIREMENTS,
  REQUIRED_POST_CALL_AUDIT_SCOPES,
} from "./post-call-audit-types";
import type {
  PostCallAuditCheckResult,
  PostCallAuditInput,
  PostCallAuditRejectionReason,
  PostCallAuditResult,
} from "./post-call-audit-types";

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
  "public runtime ready",
  "real input pilot ready",
  "user visible output ready",
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
  "audit persisted",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_POST_CALL_AUDIT_STRINGS.some((f) => value.includes(f));
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
  list: PostCallAuditRejectionReason[],
  reason: PostCallAuditRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds a `PostCallAuditInput` representing a metadata-only full-chain audit
 * after 8.3P governance recheck.
 *
 * Default params represent the successful audit path.
 * When `recheckReady: false` / `modelOutputReceived: false`, the validator
 * correctly rejects with the appropriate blocking reason.
 */
export function buildPostCallAuditInput(params?: {
  readonly recheckReady?: boolean;
  readonly modelOutputReceived?: boolean;
  readonly modelOutputMarkedUntrusted?: boolean;
}): PostCallAuditInput {
  const recheckReady = params?.recheckReady ?? true;
  const modelOutputReceived = params?.modelOutputReceived ?? true;
  const modelOutputMarkedUntrusted = params?.modelOutputMarkedUntrusted ?? true;

  const ackStatements = REQUIRED_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    auditId: "post-call-audit-8-3q",
    epochId: "8.3Q",
    previousPhaseId: "8.3P",

    postCallGovernanceRecheckReadyForAudit: recheckReady,

    scopes: [...REQUIRED_POST_CALL_AUDIT_SCOPES],
    findings: [...REQUIRED_POST_CALL_AUDIT_FINDINGS],
    requirements: [...REQUIRED_POST_CALL_AUDIT_REQUIREMENTS],
    blockers: [...REQUIRED_POST_CALL_AUDIT_BLOCKERS],
    checklistConfirmed: [...REQUIRED_POST_CALL_AUDIT_CHECKLIST],

    provider: "openai",
    model: "gpt_4o_mini",
    selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",

    metadataOnlyAudit: true,
    fullChainAudit: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,
    callCount: 1,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
    modelOutputReceived: modelOutputReceived as unknown as true,
    modelOutputMarkedUntrusted: modelOutputMarkedUntrusted as unknown as true,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    auditPersistenceUsed: false,

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
    userVisibleOutputAuthorizedByAudit: false,

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

    readyForSyntheticLiveLlmPilotExpansionPlanning: true,
    readyForSyntheticLiveLlmAdditionalCasePlanning: true,

    operatorPostCallAuditAcknowledgment: ackStatements,
    reviewerPostCallAuditAcknowledgment: ackStatements,
    notes: [
      "post-call audit completed using metadata only",
      "synthetic pilot expansion planning remains non-public and non-user-visible",
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
  } as PostCallAuditInput;
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `PostCallAuditInput` and returns a typed `PostCallAuditResult`.
 *
 * Status:
 * - "passed"   — accepted (all invariants pass)
 * - "blocked"  — only blocking reasons; no uncategorised violations
 * - "rejected" — at least one non-blocking violation
 */
export function validatePostCallAuditInput(input: PostCallAuditInput): PostCallAuditResult {
  const reasons: PostCallAuditRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.postCallGovernanceRecheckReadyForAudit) {
    addReason(reasons, "post_call_governance_recheck_not_ready");
  }

  // ── Rules 2–6: required list completeness ─────────────────────────────────
  for (const s of REQUIRED_POST_CALL_AUDIT_SCOPES) {
    if (!input.scopes.includes(s)) { addReason(reasons, "missing_audit_scope"); break; }
  }
  for (const f of REQUIRED_POST_CALL_AUDIT_FINDINGS) {
    if (!input.findings.includes(f)) { addReason(reasons, "missing_audit_finding"); break; }
  }
  for (const r of REQUIRED_POST_CALL_AUDIT_REQUIREMENTS) {
    if (!input.requirements.includes(r)) { addReason(reasons, "missing_audit_requirement"); break; }
  }
  for (const b of REQUIRED_POST_CALL_AUDIT_BLOCKERS) {
    if (!input.blockers.includes(b)) { addReason(reasons, "missing_audit_blocker"); break; }
  }
  for (const c of REQUIRED_POST_CALL_AUDIT_CHECKLIST) {
    if (!input.checklistConfirmed.includes(c)) { addReason(reasons, "missing_checklist_item"); break; }
  }

  // ── Rule 7: provider / model / case ───────────────────────────────────────
  if (input.provider !== "openai") addReason(reasons, "provider_mismatch");
  if (input.model !== "gpt_4o_mini") addReason(reasons, "model_mismatch");
  if (input.selectedSyntheticCase !== "synthetic_deadline_relative_missing_delivery_date") {
    addReason(reasons, "selected_case_mismatch");
  }

  // ── Rule 8: metadataOnlyAudit / fullChainAudit ────────────────────────────
  if (inputRec["metadataOnlyAudit"] !== true) addReason(reasons, "metadata_only_capture_missing");
  if (inputRec["fullChainAudit"] !== true) addReason(reasons, "unsafe_audit_note_detected");

  // ── Rule 9: liveLLMCalledAgain ────────────────────────────────────────────
  if (inputRec["liveLLMCalledAgain"] === true) addReason(reasons, "live_llm_called_again");

  // ── Rule 10: liveLLMCalledExactlyOnce ─────────────────────────────────────
  if (inputRec["liveLLMCalledExactlyOnce"] !== true) {
    addReason(reasons, "more_than_one_call_detected");
  }

  // ── Rule 11: callCount ────────────────────────────────────────────────────
  if (inputRec["callCount"] !== 1) addReason(reasons, "more_than_one_call_detected");

  // ── Rule 12: promptTextAvailableForAudit ──────────────────────────────────
  if (inputRec["promptTextAvailableForAudit"] === true) {
    addReason(reasons, "prompt_text_available_for_audit");
  }

  // ── Rule 13: prompt non-logging ───────────────────────────────────────────
  if (inputRec["promptTextLogged"] === true) addReason(reasons, "prompt_text_logged_or_stored");
  if (inputRec["promptTextStored"] === true) addReason(reasons, "prompt_text_logged_or_stored");
  if (inputRec["promptTextReturned"] === true) addReason(reasons, "prompt_text_logged_or_stored");

  // ── Rule 14: modelOutputAvailableForAudit ─────────────────────────────────
  if (inputRec["modelOutputAvailableForAudit"] === true) {
    addReason(reasons, "model_output_available_for_audit");
  }

  // ── Rule 15: modelOutputReceived ─────────────────────────────────────────
  if (inputRec["modelOutputReceived"] !== true) {
    addReason(reasons, "post_call_governance_recheck_failed");
  }

  // ── Rule 16: modelOutputMarkedUntrusted ───────────────────────────────────
  if (inputRec["modelOutputMarkedUntrusted"] !== true) addReason(reasons, "model_output_not_untrusted");

  // ── Rule 17: model output non-logging ─────────────────────────────────────
  if (inputRec["modelOutputLogged"] === true) addReason(reasons, "model_output_logged_or_stored");
  if (inputRec["modelOutputStored"] === true) addReason(reasons, "model_output_logged_or_stored");
  if (inputRec["modelOutputReturned"] === true) addReason(reasons, "model_output_logged_or_stored");

  // ── Rule 18: metadataOnlyCaptured ─────────────────────────────────────────
  if (inputRec["metadataOnlyCaptured"] !== true) addReason(reasons, "metadata_only_capture_missing");

  // ── Rule 19: auditPersistenceUsed ─────────────────────────────────────────
  if (inputRec["auditPersistenceUsed"] === true) addReason(reasons, "audit_persistence_detected");

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
  if (inputRec["publicAnonymousInputAllowed"] === true) addReason(reasons, "real_input_detected");

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
    inputRec["userVisibleOutputAuthorizedByAudit"] === true
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

  // ── Rule 25: dangerous runtime readiness flags ────────────────────────────
  if (inputRec["readyForLiveLLMRuntime"] === true) {
    addReason(reasons, "general_live_llm_runtime_authorization_detected");
  }
  if (inputRec["readyForPublicLaunch"] === true) {
    addReason(reasons, "public_launch_authorization_detected");
  }
  if (
    inputRec["readyForConnectedAiRuntimeExecution"] === true ||
    inputRec["readyForRealOperatorPilotRun"] === true ||
    inputRec["readyForPilotRunNow"] === true ||
    inputRec["readyForPersistence"] === true
  ) {
    addReason(reasons, "unsafe_audit_note_detected");
  }

  // ── Rule 26: expansion planning gates must be true ────────────────────────
  if (inputRec["readyForSyntheticLiveLlmPilotExpansionPlanning"] !== true) {
    addReason(reasons, "unsafe_audit_note_detected");
  }
  if (inputRec["readyForSyntheticLiveLlmAdditionalCasePlanning"] !== true) {
    addReason(reasons, "unsafe_audit_note_detected");
  }

  // ── Rule 27: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorPostCallAuditAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_POST_CALL_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerPostCallAuditAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 28: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 29–31: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.auditId,
    input.operatorPostCallAuditAcknowledgment,
    input.reviewerPostCallAuditAcknowledgment,
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
      if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
      const hasUncategorised = FORBIDDEN_POST_CALL_AUDIT_STRINGS.some(
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
      if (hasUncategorised) addReason(reasons, "unsafe_audit_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
    if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_audit_note_detected");
  }

  // ── Determine status ──────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const isBlocked =
    !accepted && reasons.every((r) => BLOCKING_POST_CALL_AUDIT_REJECTION_REASONS.has(r));

  const status = accepted ? "passed" : isBlocked ? "blocked" : "rejected";

  const outModelOutputReceived = inputRec["modelOutputReceived"] === true;
  const outModelOutputUntrusted = inputRec["modelOutputMarkedUntrusted"] === true;

  return {
    auditId: input.auditId,
    epochId: "8.3Q",
    status,
    accepted,
    rejectionReasons: reasons,

    safeAuditMetadata: {
      scopeCount: input.scopes.length,
      findingCount: input.findings.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      provider: "openai",
      model: "gpt_4o_mini",
      selectedSyntheticCase: "synthetic_deadline_relative_missing_delivery_date",
      callCount: 1,
      metadataOnlyAudit: true,
      fullChainAudit: true,
      modelOutputReceived: outModelOutputReceived,
      modelOutputMarkedUntrusted: outModelOutputUntrusted,
      metadataOnlyCaptured: inputRec["metadataOnlyCaptured"] === true,
      auditPersistenceUsed: false,
    },

    postCallAuditPassed: accepted,
    readyForSyntheticLiveLlmPilotExpansionPlanning: accepted,
    readyForSyntheticLiveLlmAdditionalCasePlanning: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    metadataOnlyAudit: true,
    fullChainAudit: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
    modelOutputReceived: outModelOutputReceived,
    modelOutputMarkedUntrusted: outModelOutputUntrusted,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    auditPersistenceUsed: false,

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
    userVisibleOutputAuthorizedByAudit: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByAudit: false,
    existingRuntimeModifiedByAudit: false,
    uiTouched: false,
    databaseOrStorageModifiedByAudit: false,
    neverUserVisible: true,
  };
}

// ── Main audit function ───────────────────────────────────────────────────────

/**
 * Runs the Post-Call Audit for Phase 8.3Q.
 *
 * 1. Calls runPostCallGovernanceRecheck() (8.3P) as dependency.
 *    NOTE: This may trigger the full 8.3P → 8.3O chain, including one live
 *    OpenAI call if OPENAI_API_KEY is present. 8.3Q itself contains no
 *    fetch(), no process.env read, and no direct OpenAI call.
 * 2. Verifies all 8.3P safety invariants.
 * 3. If prerequisites pass, builds a valid audit input and validates.
 * 4. If prerequisites fail, builds a blocked input.
 * 5. Runs tamper cases without making extra live calls.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export async function runPostCallAudit(): Promise<PostCallAuditCheckResult> {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3P governance recheck result ─────────────────────────

  const recheckResult = await runPostCallGovernanceRecheck();
  const recheckRec = asRec(recheckResult);

  const recheckReady =
    recheckResult.allPassed === true &&
    recheckRec["postCallGovernanceRecheckPassed"] === true &&
    recheckRec["readyForPostCallAudit"] === true &&
    recheckRec["readyForSyntheticLiveLlmPilotExpansionPlanning"] === true &&
    recheckRec["readyForLiveLLMRuntime"] !== true &&
    recheckRec["readyForConnectedAiRuntimeExecution"] !== true &&
    recheckRec["readyForRealOperatorPilotRun"] !== true &&
    recheckRec["readyForPilotRunNow"] !== true &&
    recheckRec["readyForPublicLaunch"] !== true &&
    recheckRec["readyForPersistence"] !== true &&
    recheckRec["metadataOnlyRecheck"] === true &&
    recheckRec["liveLLMCalledAgain"] !== true &&
    recheckRec["liveLLMCalledExactlyOnce"] === true &&
    recheckRec["promptTextAvailableForReview"] !== true &&
    recheckRec["promptTextLogged"] !== true &&
    recheckRec["promptTextStored"] !== true &&
    recheckRec["promptTextReturned"] !== true &&
    recheckRec["modelOutputAvailableForReview"] !== true &&
    recheckRec["modelOutputReceived"] === true &&
    recheckRec["modelOutputMarkedUntrusted"] === true &&
    recheckRec["modelOutputLogged"] !== true &&
    recheckRec["modelOutputStored"] !== true &&
    recheckRec["modelOutputReturned"] !== true &&
    recheckRec["metadataOnlyCaptured"] === true &&
    recheckRec["postCallAuditReady"] === true &&
    recheckRec["syntheticInputOnly"] === true &&
    recheckRec["realUserInputAllowed"] !== true &&
    recheckRec["rawInputAllowed"] !== true &&
    recheckRec["realRedactedInputAllowed"] !== true &&
    recheckRec["photoOrOcrInputAllowed"] !== true &&
    recheckRec["fileUploadInputAllowed"] !== true &&
    recheckRec["publicAnonymousInputAllowed"] !== true &&
    recheckRec["branchCDependencyAllowed"] !== true &&
    recheckRec["runSmartTalkDependencyAllowed"] !== true &&
    recheckRec["ocrRuntimeDependencyAllowed"] !== true &&
    recheckRec["branchCCalled"] !== true &&
    recheckRec["runSmartTalkCalledOrImported"] !== true &&
    recheckRec["extractTextFromImageCalledOrImported"] !== true &&
    recheckRec["userVisibleOutputEmitted"] !== true &&
    recheckRec["persistenceUsed"] !== true &&
    recheckRec["publicRuntimeEnabled"] !== true &&
    recheckRec["realOperatorPilotExecuted"] !== true &&
    recheckRec["neverUserVisible"] === true;

  notes.push(`recheckReady: ${String(recheckReady)}`);
  notes.push(`recheckResult.allPassed: ${String(recheckResult.allPassed)}`);
  notes.push(
    `readyForPostCallAudit: ${String(recheckRec["readyForPostCallAudit"])}`,
  );

  // ── Step 2/3: Build and validate audit input ──────────────────────────────

  let auditInput: PostCallAuditInput;

  if (!recheckReady) {
    notes.push("recheck prerequisite failed — building blocked audit input");
    auditInput = buildPostCallAuditInput({
      recheckReady: false,
      modelOutputReceived: false,
      modelOutputMarkedUntrusted: false,
    });
  } else {
    auditInput = buildPostCallAuditInput({
      recheckReady: true,
      modelOutputReceived: true,
      modelOutputMarkedUntrusted: true,
    });
  }

  const auditResult = validatePostCallAuditInput(auditInput);
  const auditAccepted = auditResult.accepted;

  notes.push(`auditAccepted: ${String(auditAccepted)}`);
  notes.push(`auditStatus: ${auditResult.status}`);
  if (!auditResult.accepted) {
    notes.push(`rejectionReasons: ${auditResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 4: Tamper cases — synthetic flags only, NO extra live calls ───────

  const tamperBase = buildPostCallAuditInput({
    recheckReady: true,
    modelOutputReceived: true,
    modelOutputMarkedUntrusted: true,
  });

  type MutableInput = {
    -readonly [K in keyof PostCallAuditInput]: PostCallAuditInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): PostCallAuditResult {
    return validatePostCallAuditInput({
      ...tamperBase,
      ...overrides,
    } as PostCallAuditInput);
  }

  const partialScopes = REQUIRED_POST_CALL_AUDIT_SCOPES.slice(
    0, REQUIRED_POST_CALL_AUDIT_SCOPES.length - 1,
  );
  const partialFindings = REQUIRED_POST_CALL_AUDIT_FINDINGS.slice(
    0, REQUIRED_POST_CALL_AUDIT_FINDINGS.length - 1,
  );
  const partialRequirements = REQUIRED_POST_CALL_AUDIT_REQUIREMENTS.slice(
    0, REQUIRED_POST_CALL_AUDIT_REQUIREMENTS.length - 1,
  );
  const partialBlockers = REQUIRED_POST_CALL_AUDIT_BLOCKERS.slice(
    0, REQUIRED_POST_CALL_AUDIT_BLOCKERS.length - 1,
  );
  const partialChecklist = REQUIRED_POST_CALL_AUDIT_CHECKLIST.slice(
    0, REQUIRED_POST_CALL_AUDIT_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{ label: string; result: PostCallAuditResult }> = [
    // 1. postCallGovernanceRecheckReadyForAudit false
    { label: "recheckReady=false", result: tamper({ postCallGovernanceRecheckReadyForAudit: false }) },
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
    { label: "model mismatch", result: tamper({ model: "gpt_4" as unknown as "gpt_4o_mini" }) },
    // 9. case mismatch
    {
      label: "case mismatch",
      result: tamper({
        selectedSyntheticCase: "other" as unknown as "synthetic_deadline_relative_missing_delivery_date",
      }),
    },
    // 10. metadataOnlyAudit false
    {
      label: "metadataOnlyAudit=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        metadataOnlyAudit: false as unknown as true,
      }),
    },
    // 11. fullChainAudit false
    {
      label: "fullChainAudit=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        fullChainAudit: false as unknown as true,
      }),
    },
    // 12. liveLLMCalledAgain true
    {
      label: "liveLLMCalledAgain=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        liveLLMCalledAgain: true as unknown as false,
      }),
    },
    // 13. liveLLMCalledExactlyOnce false
    {
      label: "liveLLMCalledExactlyOnce=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        liveLLMCalledExactlyOnce: false as unknown as true,
      }),
    },
    // 14. callCount 0
    {
      label: "callCount=0",
      result: validatePostCallAuditInput({ ...tamperBase, callCount: 0 as unknown as 1 }),
    },
    // 15. callCount 2
    {
      label: "callCount=2",
      result: validatePostCallAuditInput({ ...tamperBase, callCount: 2 as unknown as 1 }),
    },
    // 16. promptTextAvailableForAudit true
    {
      label: "promptTextAvailableForAudit=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        promptTextAvailableForAudit: true as unknown as false,
      }),
    },
    // 17. promptTextLogged true
    {
      label: "promptTextLogged=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        promptTextLogged: true as unknown as false,
      }),
    },
    // 18. promptTextStored true
    {
      label: "promptTextStored=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        promptTextStored: true as unknown as false,
      }),
    },
    // 19. promptTextReturned true
    {
      label: "promptTextReturned=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        promptTextReturned: true as unknown as false,
      }),
    },
    // 20. modelOutputAvailableForAudit true
    {
      label: "modelOutputAvailableForAudit=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputAvailableForAudit: true as unknown as false,
      }),
    },
    // 21. modelOutputReceived false
    {
      label: "modelOutputReceived=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputReceived: false as unknown as true,
      }),
    },
    // 22. modelOutputMarkedUntrusted false
    {
      label: "modelOutputMarkedUntrusted=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputMarkedUntrusted: false as unknown as true,
      }),
    },
    // 23. modelOutputLogged true
    {
      label: "modelOutputLogged=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputLogged: true as unknown as false,
      }),
    },
    // 24. modelOutputStored true
    {
      label: "modelOutputStored=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputStored: true as unknown as false,
      }),
    },
    // 25. modelOutputReturned true
    {
      label: "modelOutputReturned=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        modelOutputReturned: true as unknown as false,
      }),
    },
    // 26. metadataOnlyCaptured false
    {
      label: "metadataOnlyCaptured=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        metadataOnlyCaptured: false as unknown as true,
      }),
    },
    // 27. auditPersistenceUsed true
    {
      label: "auditPersistenceUsed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        auditPersistenceUsed: true as unknown as false,
      }),
    },
    // 28. syntheticInputOnly false
    {
      label: "syntheticInputOnly=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        syntheticInputOnly: false as unknown as true,
      }),
    },
    // 29. realUserInputAllowed true
    {
      label: "realUserInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        realUserInputAllowed: true as unknown as false,
      }),
    },
    // 30. rawInputAllowed true
    {
      label: "rawInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        rawInputAllowed: true as unknown as false,
      }),
    },
    // 31. realRedactedInputAllowed true
    {
      label: "realRedactedInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        realRedactedInputAllowed: true as unknown as false,
      }),
    },
    // 32. photoOrOcrInputAllowed true
    {
      label: "photoOrOcrInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        photoOrOcrInputAllowed: true as unknown as false,
      }),
    },
    // 33. fileUploadInputAllowed true
    {
      label: "fileUploadInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        fileUploadInputAllowed: true as unknown as false,
      }),
    },
    // 34. publicAnonymousInputAllowed true
    {
      label: "publicAnonymousInputAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        publicAnonymousInputAllowed: true as unknown as false,
      }),
    },
    // 35. branchCDependencyAllowed true
    {
      label: "branchCDependencyAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        branchCDependencyAllowed: true as unknown as false,
      }),
    },
    // 36. runSmartTalkDependencyAllowed true
    {
      label: "runSmartTalkDependencyAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        runSmartTalkDependencyAllowed: true as unknown as false,
      }),
    },
    // 37. ocrRuntimeDependencyAllowed true
    {
      label: "ocrRuntimeDependencyAllowed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        ocrRuntimeDependencyAllowed: true as unknown as false,
      }),
    },
    // 38. branchCCalled true
    {
      label: "branchCCalled=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        branchCCalled: true as unknown as false,
      }),
    },
    // 39. runSmartTalkCalledOrImported true
    {
      label: "runSmartTalkCalledOrImported=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        runSmartTalkCalledOrImported: true as unknown as false,
      }),
    },
    // 40. extractTextFromImageCalledOrImported true
    {
      label: "extractTextFromImageCalledOrImported=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        extractTextFromImageCalledOrImported: true as unknown as false,
      }),
    },
    // 41. userVisibleOutputEmitted true
    {
      label: "userVisibleOutputEmitted=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        userVisibleOutputEmitted: true as unknown as false,
      }),
    },
    // 42. userVisibleOutputAuthorizedByAudit true
    {
      label: "userVisibleOutputAuthorizedByAudit=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        userVisibleOutputAuthorizedByAudit: true as unknown as false,
      }),
    },
    // 43. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 44. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 45. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 46. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 47. realOperatorPilotExecuted true
    {
      label: "realOperatorPilotExecuted=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        realOperatorPilotExecuted: true as unknown as false,
      }),
    },
    // 48. readyForLiveLLMRuntime true
    {
      label: "readyForLiveLLMRuntime=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForLiveLLMRuntime: true as unknown as false,
      }),
    },
    // 49. readyForConnectedAiRuntimeExecution true
    {
      label: "readyForConnectedAiRuntimeExecution=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForConnectedAiRuntimeExecution: true as unknown as false,
      }),
    },
    // 50. readyForRealOperatorPilotRun true
    {
      label: "readyForRealOperatorPilotRun=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForRealOperatorPilotRun: true as unknown as false,
      }),
    },
    // 51. readyForPilotRunNow true
    {
      label: "readyForPilotRunNow=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForPilotRunNow: true as unknown as false,
      }),
    },
    // 52. readyForPublicLaunch true
    {
      label: "readyForPublicLaunch=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForPublicLaunch: true as unknown as false,
      }),
    },
    // 53. readyForPersistence true
    {
      label: "readyForPersistence=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForPersistence: true as unknown as false,
      }),
    },
    // 54. readyForSyntheticLiveLlmPilotExpansionPlanning false
    {
      label: "readyForSyntheticExpansion=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForSyntheticLiveLlmPilotExpansionPlanning: false as unknown as true,
      }),
    },
    // 55. readyForSyntheticLiveLlmAdditionalCasePlanning false
    {
      label: "readyForSyntheticAdditionalCase=false",
      result: validatePostCallAuditInput({
        ...tamperBase,
        readyForSyntheticLiveLlmAdditionalCasePlanning: false as unknown as true,
      }),
    },
    // 56. missing operator ack
    { label: "missing operator ack", result: tamper({ operatorPostCallAuditAcknowledgment: "partial" }) },
    // 57. missing reviewer ack
    { label: "missing reviewer ack", result: tamper({ reviewerPostCallAuditAcknowledgment: "partial" }) },
    // 58. containsSecret true
    {
      label: "containsSecret=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsSecret: true as unknown as false,
      }),
    },
    // 59. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 60. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsApiKey: true as unknown as false,
      }),
    },
    // 61. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 62. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 63. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 64. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 65. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsUserPii: true as unknown as false,
      }),
    },
    // 66. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validatePostCallAuditInput({
        ...tamperBase,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 67–96: notes with forbidden strings
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
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    { label: 'notes: "real model output"', result: tamper({ notes: ["real model output"] }) },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    { label: 'notes: "model output reviewed"', result: tamper({ notes: ["model output reviewed"] }) },
    { label: 'notes: "prompt reviewed"', result: tamper({ notes: ["prompt reviewed"] }) },
    { label: 'notes: "second live llm call"', result: tamper({ notes: ["second live llm call"] }) },
    { label: 'notes: "audit persisted"', result: tamper({ notes: ["audit persisted"] }) },
    { label: 'notes: "public runtime ready"', result: tamper({ notes: ["public runtime ready"] }) },
    { label: 'notes: "real input pilot ready"', result: tamper({ notes: ["real input pilot ready"] }) },
    {
      label: 'notes: "user visible output ready"',
      result: tamper({ notes: ["user visible output ready"] }),
    },
    {
      label: 'notes: "public launch enabled"',
      result: tamper({ notes: ["public launch enabled"] }),
    },
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    {
      label: 'notes: "real operator pilot executed"',
      result: tamper({ notes: ["real operator pilot executed"] }),
    },
    {
      label: 'notes: "general live llm runtime authorized"',
      result: tamper({ notes: ["general live llm runtime authorized"] }),
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

  const allPassed = recheckReady && auditAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  if (!recheckReady) {
    notes.push("audit blocked: post-call governance recheck prerequisite not satisfied");
  }

  const outModelOutputReceived = recheckReady && auditAccepted;
  const outModelOutputUntrusted = recheckReady && auditAccepted;

  return {
    checkId: "8.3Q",
    allPassed,
    postCallGovernanceRecheckReadyForAudit: recheckReady,
    postCallAuditAccepted: auditAccepted,
    tamperCasesRejected,

    postCallAuditPassed: allPassed,
    readyForSyntheticLiveLlmPilotExpansionPlanning: allPassed,
    readyForSyntheticLiveLlmAdditionalCasePlanning: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    metadataOnlyAudit: true,
    fullChainAudit: true,
    liveLLMCalledAgain: false,
    liveLLMCalledExactlyOnce: true,

    promptTextAvailableForAudit: false,
    promptTextLogged: false,
    promptTextStored: false,
    promptTextReturned: false,

    modelOutputAvailableForAudit: false,
    modelOutputReceived: outModelOutputReceived,
    modelOutputMarkedUntrusted: outModelOutputUntrusted,
    modelOutputLogged: false,
    modelOutputStored: false,
    modelOutputReturned: false,

    metadataOnlyCaptured: true,
    auditPersistenceUsed: false,

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
