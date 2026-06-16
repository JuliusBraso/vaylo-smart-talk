/**
 * Live LLM Synthetic Authorization Planning (Phase 8.3K).
 *
 * Validates the Live LLM Synthetic Authorization Planning input and produces a
 * `LiveLlmSyntheticAuthorizationPlanningCheckResult`.
 *
 * Sub-steps:
 *   1. Call runSyntheticHarnessPostRunAudit() (8.3J) and verify all
 *      prerequisite invariants.
 *   2. Build a synthetic planning input and validate it (must be accepted).
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
 * - authorize more than one future synthetic live LLM call
 * - process real user input, OCR, photo, files, or public requests
 * - forward raw or real redacted input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runLiveLlmSyntheticAuthorizationPlanning()` explicitly.
 */

import { runSyntheticHarnessPostRunAudit } from "./run-synthetic-harness-post-run-audit";
import {
  FORBIDDEN_LIVE_LLM_SYNTHETIC_AUTHORIZATION_STRINGS,
  REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES,
  REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST,
  REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES,
  REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES,
  REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES,
  REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS,
  REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES,
} from "./live-llm-synthetic-authorization-planning-types";
import type {
  LiveLlmSyntheticAuthorizationPlanningCheckResult,
  LiveLlmSyntheticAuthorizationPlanningInput,
  LiveLlmSyntheticAuthorizationPlanningResult,
  LiveLlmSyntheticAuthorizationRejectionReason,
} from "./live-llm-synthetic-authorization-planning-types";

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
const UNSAFE_PLANNING_PHRASES = [
  "post-run audit stored output", "live llm now authorized",
  "live llm call performed", "multiple live llm calls authorized",
  "general live llm runtime authorized",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_LIVE_LLM_SYNTHETIC_AUTHORIZATION_STRINGS.some((f) => value.includes(f));
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

function containsUnsafePlanningPhrase(value: string): boolean {
  return UNSAFE_PLANNING_PHRASES.some((p) => value.includes(p));
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
  list: LiveLlmSyntheticAuthorizationRejectionReason[],
  reason: LiveLlmSyntheticAuthorizationRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `LiveLlmSyntheticAuthorizationPlanningInput`.
 * Planning only — no live LLM call, no env read, no SDK import, no HTTP call,
 * no real input, no AI output, no persistence, no user-visible output.
 */
export function buildLiveLlmSyntheticAuthorizationPlanningInput(): LiveLlmSyntheticAuthorizationPlanningInput {
  const ackStatements =
    REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    planningId: "live-llm-synthetic-authorization-planning-8-3k",
    epochId: "8.3K",
    previousPhaseId: "8.3J",

    postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning: true,

    authorizationScopes: [...REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES],
    providerPolicies: [...REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES],
    modelPolicies: [...REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES],
    callConstraints: [...REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS],
    allowedSyntheticCases: [...REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES],
    blockedPayloadClasses: [...REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES],
    postCallRequirements: [...REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST],

    planningOnly: true,
    futureSingleSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlistRequired: true,
    modelAllowlistRequired: true,
    killSwitchRequired: true,
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
    userVisibleOutputAuthorizedByPlanning: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    operatorAuthorizationPlanningAcknowledgment: ackStatements,
    reviewerAuthorizationPlanningAcknowledgment: ackStatements,
    notes: ["live LLM synthetic authorization planning completed without live call"],

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
 * Validates a `LiveLlmSyntheticAuthorizationPlanningInput` and returns a
 * typed `LiveLlmSyntheticAuthorizationPlanningResult`.
 */
export function validateLiveLlmSyntheticAuthorizationPlanningInput(
  input: LiveLlmSyntheticAuthorizationPlanningInput,
): LiveLlmSyntheticAuthorizationPlanningResult {
  const reasons: LiveLlmSyntheticAuthorizationRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning) {
    addReason(reasons, "post_run_audit_not_ready");
  }

  // ── Rules 2–9: required list completeness ─────────────────────────────────
  for (const s of REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES) {
    if (!input.authorizationScopes.includes(s)) {
      addReason(reasons, "missing_authorization_scope"); break;
    }
  }
  for (const p of REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES) {
    if (!input.providerPolicies.includes(p)) {
      addReason(reasons, "missing_provider_policy"); break;
    }
  }
  for (const m of REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES) {
    if (!input.modelPolicies.includes(m)) {
      addReason(reasons, "missing_model_policy"); break;
    }
  }
  for (const c of REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS) {
    if (!input.callConstraints.includes(c)) {
      addReason(reasons, "missing_call_constraint"); break;
    }
  }
  for (const a of REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES) {
    if (!input.allowedSyntheticCases.includes(a)) {
      addReason(reasons, "missing_allowed_synthetic_case"); break;
    }
  }
  for (const b of REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES) {
    if (!input.blockedPayloadClasses.includes(b)) {
      addReason(reasons, "missing_blocked_payload_class"); break;
    }
  }
  for (const r of REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS) {
    if (!input.postCallRequirements.includes(r)) {
      addReason(reasons, "missing_post_call_requirement"); break;
    }
  }
  for (const item of REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }

  // ── Rule 10: planningOnly ─────────────────────────────────────────────────
  if (inputRec["planningOnly"] !== true) {
    addReason(reasons, "planning_attempted_live_llm_call");
  }

  // ── Rule 11: futureSingleSyntheticCallOnly ────────────────────────────────
  if (inputRec["futureSingleSyntheticCallOnly"] !== true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 12: general/multiple runtime flags ───────────────────────────────
  if (inputRec["generalLiveLlmRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "planning_attempted_general_runtime_authorization");
  }
  if (inputRec["multipleLiveLlmCallsAllowed"] === true) {
    addReason(reasons, "planning_attempted_multiple_call_authorization");
  }

  // ── Rule 13: required true flags ──────────────────────────────────────────
  if (inputRec["providerAllowlistRequired"] !== true) {
    addReason(reasons, "missing_provider_policy");
  }
  if (inputRec["modelAllowlistRequired"] !== true) {
    addReason(reasons, "missing_model_policy");
  }
  if (inputRec["killSwitchRequired"] !== true) {
    addReason(reasons, "missing_kill_switch_requirement");
  }
  if (inputRec["postCallGovernanceRecheckRequired"] !== true) {
    addReason(reasons, "missing_post_call_governance_recheck");
  }
  if (inputRec["postCallAuditRequired"] !== true) {
    addReason(reasons, "missing_post_call_requirement");
  }

  // ── Rule 14: planning self-execution flags ────────────────────────────────
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

  // ── Rule 15: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) {
    addReason(reasons, "planning_attempted_real_input_processing");
  }

  // ── Rule 16: real/raw/OCR/file/public input ───────────────────────────────
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

  // ── Rule 17: dependency flags ─────────────────────────────────────────────
  if (inputRec["branchCDependencyAllowed"] === true || inputRec["branchCCalled"] === true) {
    addReason(reasons, "planning_attempted_branch_c_dependency");
  }
  if (inputRec["runSmartTalkDependencyAllowed"] === true || inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_run_smart_talk_dependency");
  }
  if (inputRec["ocrRuntimeDependencyAllowed"] === true || inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "planning_attempted_ocr_runtime_dependency");
  }

  // ── Rule 18–20: AI output / persistence / public ──────────────────────────
  if (inputRec["aiOutputGenerationPerformed"] === true || inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "planning_attempted_ai_output_generation");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "planning_attempted_model_output_storage");
  }
  if (inputRec["userVisibleOutputEmitted"] === true || inputRec["userVisibleOutputAuthorizedByPlanning"] === true) {
    addReason(reasons, "planning_attempted_user_visible_output");
  }
  if (inputRec["persistenceUsed"] === true || inputRec["dnaSavePerformed"] === true || inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "planning_attempted_persistence");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "planning_attempted_public_runtime");
  }
  if (inputRec["realOperatorPilotExecuted"] === true) {
    addReason(reasons, "planning_attempted_real_operator_pilot");
  }

  // ── Rule 21: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorAuthorizationPlanningAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }
  for (const stmt of REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerAuthorizationPlanningAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item"); break;
    }
  }

  // ── Rule 22: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) addReason(reasons, "forbidden_document_content_detected");

  // ── Rules 23–25: scan string fields ───────────────────────────────────────
  const allTextFields: string[] = [
    input.planningId,
    input.operatorAuthorizationPlanningAcknowledgment,
    input.reviewerAuthorizationPlanningAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      if (containsUnsafePlanningPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
      const hasUncategorised = FORBIDDEN_LIVE_LLM_SYNTHETIC_AUTHORIZATION_STRINGS.some(
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
          !containsUnsafePlanningPhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (hasUncategorised) addReason(reasons, "unsafe_authorization_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
    if (containsUnsafePlanningPhrase(s)) addReason(reasons, "unsafe_authorization_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;

  return {
    planningId: input.planningId,
    epochId: "8.3K",
    status: accepted ? "valid" : "rejected",
    accepted,
    rejectionReasons: reasons,

    safePlanningMetadata: {
      authorizationScopeCount: input.authorizationScopes.length,
      providerPolicyCount: input.providerPolicies.length,
      modelPolicyCount: input.modelPolicies.length,
      callConstraintCount: input.callConstraints.length,
      allowedSyntheticCaseCount: input.allowedSyntheticCases.length,
      blockedPayloadClassCount: input.blockedPayloadClasses.length,
      postCallRequirementCount: input.postCallRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForLiveLlmSyntheticSingleCallContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    planningOnly: true,
    futureSingleSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlistRequired: true,
    modelAllowlistRequired: true,
    killSwitchRequired: true,
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
    userVisibleOutputAuthorizedByPlanning: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    realOperatorPilotExecuted: false,

    apiRouteModifiedByPlanning: false,
    existingRuntimeModifiedByPlanning: false,
    uiTouched: false,
    databaseOrStorageModifiedByPlanning: false,
    neverUserVisible: true,
  };
}

// ── Authorization planning check ──────────────────────────────────────────────

/**
 * Runs the Live LLM Synthetic Authorization Planning check for Phase 8.3K.
 *
 * Calls `runSyntheticHarnessPostRunAudit()` (8.3J), builds and validates a
 * synthetic safe planning input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT read env. Does NOT import any SDK.
 * Does NOT produce real AI output. Does NOT emit user-visible output.
 * Does NOT modify DB/storage. Does NOT authorize general live LLM runtime.
 */
export function runLiveLlmSyntheticAuthorizationPlanning(): LiveLlmSyntheticAuthorizationPlanningCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3J post-run audit ───────────────────────────────────

  const auditResult = runSyntheticHarnessPostRunAudit();
  const auditRec = asRec(auditResult);

  const postRunAuditReady =
    auditResult.allPassed === true &&
    auditRec["readyForLiveLlmSyntheticAuthorizationPlanning"] === true &&
    auditRec["readyForLiveLLMRuntime"] !== true &&
    auditRec["readyForConnectedAiRuntimeExecution"] !== true &&
    auditRec["readyForRealOperatorPilotRun"] !== true &&
    auditRec["readyForPilotRunNow"] !== true &&
    auditRec["readyForPublicLaunch"] !== true &&
    auditRec["readyForPersistence"] !== true &&
    auditRec["dryExecutionPerformed"] === true &&
    auditRec["deterministicSyntheticAdapterUsed"] === true &&
    auditRec["metadataOnlyResults"] === true &&
    auditRec["syntheticInputOnly"] === true &&
    auditRec["postRunAuditPerformed"] === true &&
    auditRec["auditMetadataOnly"] === true &&
    auditRec["auditExecutedHarnessAgain"] !== true &&
    auditRec["realUserInputAllowed"] !== true &&
    auditRec["rawInputAllowed"] !== true &&
    auditRec["realRedactedInputAllowed"] !== true &&
    auditRec["photoOrOcrInputAllowed"] !== true &&
    auditRec["fileUploadInputAllowed"] !== true &&
    auditRec["publicAnonymousInputAllowed"] !== true &&
    auditRec["branchCDependencyAllowed"] !== true &&
    auditRec["runSmartTalkDependencyAllowed"] !== true &&
    auditRec["ocrRuntimeDependencyAllowed"] !== true &&
    auditRec["branchCCalled"] !== true &&
    auditRec["runSmartTalkCalledOrImported"] !== true &&
    auditRec["extractTextFromImageCalledOrImported"] !== true &&
    auditRec["liveLLMCalled"] !== true &&
    auditRec["aiOutputGenerated"] !== true &&
    auditRec["modelOutputStored"] !== true &&
    auditRec["userVisibleOutputEmitted"] !== true &&
    auditRec["persistenceUsed"] !== true &&
    auditRec["publicRuntimeEnabled"] !== true &&
    auditRec["realOperatorPilotExecuted"] !== true &&
    auditRec["neverUserVisible"] === true;

  notes.push(`postRunAuditReady: ${String(postRunAuditReady)}`);
  notes.push(`auditResult.allPassed: ${String(auditResult.allPassed)}`);
  notes.push(`readyForLiveLlmSyntheticAuthorizationPlanning: ${String(auditRec["readyForLiveLlmSyntheticAuthorizationPlanning"])}`);

  // ── Step 2: Validate the planning input ───────────────────────────────────

  const planningInput = buildLiveLlmSyntheticAuthorizationPlanningInput();
  const planningResult = validateLiveLlmSyntheticAuthorizationPlanningInput(planningInput);
  const planningAccepted = planningResult.accepted;

  notes.push(`planningAccepted: ${String(planningAccepted)}`);
  notes.push(`planningStatus: ${planningResult.status}`);
  if (!planningResult.accepted) {
    notes.push(`rejectionReasons: ${planningResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof LiveLlmSyntheticAuthorizationPlanningInput]: LiveLlmSyntheticAuthorizationPlanningInput[K];
  };

  function tamper(overrides: Partial<MutableInput>): LiveLlmSyntheticAuthorizationPlanningResult {
    return validateLiveLlmSyntheticAuthorizationPlanningInput({
      ...planningInput,
      ...overrides,
    } as LiveLlmSyntheticAuthorizationPlanningInput);
  }

  const partialScopes = REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_SCOPES.length - 1);
  const partialProviders = REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_PROVIDER_POLICIES.length - 1);
  const partialModels = REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_MODEL_POLICIES.length - 1);
  const partialConstraints = REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_CALL_CONSTRAINTS.length - 1);
  const partialCases = REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_ALLOWED_CASES.length - 1);
  const partialBlocked = REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_BLOCKED_PAYLOAD_CLASSES.length - 1);
  const partialPostCall = REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_POST_CALL_REQUIREMENTS.length - 1);
  const partialChecklist = REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST.slice(0, REQUIRED_LIVE_LLM_SYNTHETIC_AUTHORIZATION_CHECKLIST.length - 1);

  const tamperCases: Array<{ label: string; result: LiveLlmSyntheticAuthorizationPlanningResult }> = [
    // 1. postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning false
    { label: "postRunAuditReady=false", result: tamper({ postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning: false }) },
    // 2. missing authorization scope
    { label: "missing scope", result: tamper({ authorizationScopes: partialScopes }) },
    // 3. missing provider policy
    { label: "missing provider policy", result: tamper({ providerPolicies: partialProviders }) },
    // 4. missing model policy
    { label: "missing model policy", result: tamper({ modelPolicies: partialModels }) },
    // 5. missing call constraint
    { label: "missing call constraint", result: tamper({ callConstraints: partialConstraints }) },
    // 6. missing allowed synthetic case
    { label: "missing allowed case", result: tamper({ allowedSyntheticCases: partialCases }) },
    // 7. missing blocked payload class
    { label: "missing blocked class", result: tamper({ blockedPayloadClasses: partialBlocked }) },
    // 8. missing post-call requirement
    { label: "missing post-call req", result: tamper({ postCallRequirements: partialPostCall }) },
    // 9. missing checklist item
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 10. planningOnly false
    { label: "planningOnly=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, planningOnly: false as unknown as true }) },
    // 11. futureSingleSyntheticCallOnly false
    { label: "futureSingleSyntheticCallOnly=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, futureSingleSyntheticCallOnly: false as unknown as true }) },
    // 12. generalLiveLlmRuntimeAuthorizationAllowed true
    { label: "generalLiveLlmRuntimeAuthorizationAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, generalLiveLlmRuntimeAuthorizationAllowed: true as unknown as false }) },
    // 13. multipleLiveLlmCallsAllowed true
    { label: "multipleLiveLlmCallsAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, multipleLiveLlmCallsAllowed: true as unknown as false }) },
    // 14. providerAllowlistRequired false
    { label: "providerAllowlistRequired=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, providerAllowlistRequired: false as unknown as true }) },
    // 15. modelAllowlistRequired false
    { label: "modelAllowlistRequired=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, modelAllowlistRequired: false as unknown as true }) },
    // 16. killSwitchRequired false
    { label: "killSwitchRequired=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, killSwitchRequired: false as unknown as true }) },
    // 17. postCallGovernanceRecheckRequired false
    { label: "postCallGovernanceRecheckRequired=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, postCallGovernanceRecheckRequired: false as unknown as true }) },
    // 18. postCallAuditRequired false
    { label: "postCallAuditRequired=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, postCallAuditRequired: false as unknown as true }) },
    // 19. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, liveLLMCallPerformed: true as unknown as false }) },
    // 20. envReadPerformed true
    { label: "envReadPerformed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, envReadPerformed: true as unknown as false }) },
    // 21. sdkImported true
    { label: "sdkImported=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, sdkImported: true as unknown as false }) },
    // 22. httpCallMade true
    { label: "httpCallMade=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, httpCallMade: true as unknown as false }) },
    // 23. syntheticInputOnly false
    { label: "syntheticInputOnly=false", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, syntheticInputOnly: false as unknown as true }) },
    // 24. realUserInputAllowed true
    { label: "realUserInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, realUserInputAllowed: true as unknown as false }) },
    // 25. rawInputAllowed true
    { label: "rawInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, rawInputAllowed: true as unknown as false }) },
    // 26. realRedactedInputAllowed true
    { label: "realRedactedInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, realRedactedInputAllowed: true as unknown as false }) },
    // 27. photoOrOcrInputAllowed true
    { label: "photoOrOcrInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, photoOrOcrInputAllowed: true as unknown as false }) },
    // 28. fileUploadInputAllowed true
    { label: "fileUploadInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, fileUploadInputAllowed: true as unknown as false }) },
    // 29. publicAnonymousInputAllowed true
    { label: "publicAnonymousInputAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, publicAnonymousInputAllowed: true as unknown as false }) },
    // 30. branchCDependencyAllowed true
    { label: "branchCDependencyAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, branchCDependencyAllowed: true as unknown as false }) },
    // 31. runSmartTalkDependencyAllowed true
    { label: "runSmartTalkDependencyAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, runSmartTalkDependencyAllowed: true as unknown as false }) },
    // 32. ocrRuntimeDependencyAllowed true
    { label: "ocrRuntimeDependencyAllowed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, ocrRuntimeDependencyAllowed: true as unknown as false }) },
    // 33. branchCCalled true
    { label: "branchCCalled=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, branchCCalled: true as unknown as false }) },
    // 34. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 35. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 36. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 37. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, aiOutputGenerated: true as unknown as false }) },
    // 38. modelOutputStored true
    { label: "modelOutputStored=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, modelOutputStored: true as unknown as false }) },
    // 39. userVisibleOutputEmitted true
    { label: "userVisibleOutputEmitted=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, userVisibleOutputEmitted: true as unknown as false }) },
    // 40. userVisibleOutputAuthorizedByPlanning true
    { label: "userVisibleOutputAuthorizedByPlanning=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, userVisibleOutputAuthorizedByPlanning: true as unknown as false }) },
    // 41. persistenceUsed true
    { label: "persistenceUsed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, persistenceUsed: true as unknown as false }) },
    // 42. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, dnaSavePerformed: true as unknown as false }) },
    // 43. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, offlineSavePerformed: true as unknown as false }) },
    // 44. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, publicRuntimeEnabled: true as unknown as false }) },
    // 45. realOperatorPilotExecuted true
    { label: "realOperatorPilotExecuted=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, realOperatorPilotExecuted: true as unknown as false }) },
    // 46. missing operator ack
    { label: "missing operator ack", result: tamper({ operatorAuthorizationPlanningAcknowledgment: "partial" }) },
    // 47. missing reviewer ack
    { label: "missing reviewer ack", result: tamper({ reviewerAuthorizationPlanningAcknowledgment: "partial" }) },
    // 48. containsSecret true
    { label: "containsSecret=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsSecret: true as unknown as false }) },
    // 49. containsEnvValue true
    { label: "containsEnvValue=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsEnvValue: true as unknown as false }) },
    // 50. containsApiKey true
    { label: "containsApiKey=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsApiKey: true as unknown as false }) },
    // 51. containsRawInputText true
    { label: "containsRawInputText=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsRawInputText: true as unknown as false }) },
    // 52. containsRedactedText true
    { label: "containsRedactedText=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsRedactedText: true as unknown as false }) },
    // 53. containsModelOutput true
    { label: "containsModelOutput=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsModelOutput: true as unknown as false }) },
    // 54. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsDocumentContent: true as unknown as false }) },
    // 55. containsUserPii true
    { label: "containsUserPii=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsUserPii: true as unknown as false }) },
    // 56. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateLiveLlmSyntheticAuthorizationPlanningInput({ ...planningInput, containsRealUserInput: true as unknown as false }) },
    // 57–86: notes with forbidden strings
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

  const allPassed = postRunAuditReady && planningAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3K",
    allPassed,
    postRunAuditReadyForLiveLlmSyntheticAuthorizationPlanning: postRunAuditReady,
    liveLlmSyntheticAuthorizationPlanningAccepted: planningAccepted,
    tamperCasesRejected,

    readyForLiveLlmSyntheticSingleCallContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    planningOnly: true,
    futureSingleSyntheticCallOnly: true,
    generalLiveLlmRuntimeAuthorizationAllowed: false,
    multipleLiveLlmCallsAllowed: false,

    providerAllowlistRequired: true,
    modelAllowlistRequired: true,
    killSwitchRequired: true,
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
