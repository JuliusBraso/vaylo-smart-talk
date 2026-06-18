/**
 * Synthetic Live LLM Pilot Expansion Planning (Phase 8.3R).
 *
 * A metadata-only planning layer that expands the synthetic live LLM pilot
 * from one synthetic case (8.3O) to a controlled 10-case synthetic catalog.
 * Builds on Phase 8.3Q (Post-Call Audit) as its dependency.
 *
 * What this module does:
 *   1. Verifies Phase 8.3Q post-call audit result via dependency call.
 *   2. Plans a synthetic-only case expansion covering all 10 cases.
 *   3. Defines risk classes and expected behaviors for each case.
 *   4. Validates all planning safety invariants.
 *   5. Confirms that each additional case requires a separate contract.
 *   6. Runs tamper cases without making extra live calls.
 *
 * What this module does NOT do:
 *   - Does NOT call OpenAI or any live LLM
 *   - Does NOT call fetch()
 *   - Does NOT read process.env
 *   - Does NOT import any LLM SDK
 *   - Does NOT execute any synthetic case (planning only)
 *   - Does NOT reconstruct prompt text
 *   - Does NOT inspect model output text
 *   - Does NOT persist anything
 *   - Does NOT emit user-visible output
 *   - Does NOT authorize real document input (`readyForRealDocumentInput: false`)
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
 * NOTE: Calling `runSyntheticLiveLlmPilotExpansionPlanning()` invokes
 * `runPostCallAudit()` (8.3Q) → `runPostCallGovernanceRecheck()` (8.3P) →
 * `runLiveLlmSyntheticSingleCallExecution()` (8.3O). This may cause one live
 * OpenAI call when OPENAI_API_KEY is present. Phase 8.3R itself contains NO
 * fetch(), no process.env read, and no direct OpenAI call.
 */

import { runPostCallAudit } from "./run-post-call-audit";
import {
  FORBIDDEN_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_STRINGS,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS,
  REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES,
} from "./synthetic-live-llm-pilot-expansion-planning-types";
import type {
  SyntheticLiveLlmPilotExpansionPlanningCheckResult,
  SyntheticLiveLlmPilotExpansionPlanningInput,
  SyntheticLiveLlmPilotExpansionPlanningRejectionReason,
  SyntheticLiveLlmPilotExpansionPlanningResult,
} from "./synthetic-live-llm-pilot-expansion-planning-types";

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
  "real document input ready",
  "synthetic outputs approved for users",
  "production live runtime ready",
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
  return FORBIDDEN_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_STRINGS.some((f) => value.includes(f));
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
  list: SyntheticLiveLlmPilotExpansionPlanningRejectionReason[],
  reason: SyntheticLiveLlmPilotExpansionPlanningRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Builder ───────────────────────────────────────────────────────────────────

/**
 * Builds a `SyntheticLiveLlmPilotExpansionPlanningInput` representing
 * a metadata-only expansion planning step after 8.3Q post-call audit.
 *
 * Default params represent the successful planning path.
 * When `postCallAuditReady: false`, the validator correctly returns "blocked".
 */
export function buildSyntheticLiveLlmPilotExpansionPlanningInput(params?: {
  readonly postCallAuditReady?: boolean;
}): SyntheticLiveLlmPilotExpansionPlanningInput {
  const auditReady = params?.postCallAuditReady ?? true;
  const ackStatements =
    REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    planningId: "synthetic-live-llm-pilot-expansion-planning-8-3r",
    epochId: "8.3R",
    previousPhaseId: "8.3Q",

    postCallAuditReadyForExpansionPlanning: auditReady,

    scopes: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES],
    cases: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES],
    caseRiskClasses: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES],
    expectedBehaviors: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS],
    requirements: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS],
    blockers: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS],
    checklistConfirmed: [...REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST],

    metadataOnlyPlanning: true,
    syntheticOnlyExpansion: true,
    additionalCaseContractRequired: true,
    liveLLMCalledAgain: false,
    additionalLiveLLMCallsExecuted: false,

    readyForAdditionalSyntheticLiveLlmCaseContract: true,
    readyForSyntheticPilotCaseSetDesign: true,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    promptTextAvailableForPlanning: false,
    modelOutputAvailableForPlanning: false,
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

    operatorExpansionPlanningAcknowledgment: ackStatements,
    reviewerExpansionPlanningAcknowledgment: ackStatements,
    notes: [
      "synthetic live LLM pilot expansion planning completed without live call",
      "real document input remains unauthorized",
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
  } as SyntheticLiveLlmPilotExpansionPlanningInput;
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `SyntheticLiveLlmPilotExpansionPlanningInput`.
 *
 * Status:
 * - "planned"  — accepted (all invariants pass)
 * - "blocked"  — only post_call_audit_not_ready
 * - "rejected" — any other violation
 */
export function validateSyntheticLiveLlmPilotExpansionPlanningInput(
  input: SyntheticLiveLlmPilotExpansionPlanningInput,
): SyntheticLiveLlmPilotExpansionPlanningResult {
  const reasons: SyntheticLiveLlmPilotExpansionPlanningRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: prerequisite ──────────────────────────────────────────────────
  if (!input.postCallAuditReadyForExpansionPlanning) {
    addReason(reasons, "post_call_audit_not_ready");
  }

  // ── Rule 2: required list completeness ────────────────────────────────────
  for (const s of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES) {
    if (!input.scopes.includes(s)) { addReason(reasons, "missing_expansion_scope"); break; }
  }
  for (const c of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES) {
    if (!input.cases.includes(c)) { addReason(reasons, "missing_case"); break; }
  }
  for (const r of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES) {
    if (!input.caseRiskClasses.includes(r)) { addReason(reasons, "missing_case_risk_class"); break; }
  }
  for (const b of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS) {
    if (!input.expectedBehaviors.includes(b)) { addReason(reasons, "missing_expected_behavior"); break; }
  }
  for (const r of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS) {
    if (!input.requirements.includes(r)) { addReason(reasons, "missing_requirement"); break; }
  }
  for (const b of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS) {
    if (!input.blockers.includes(b)) { addReason(reasons, "missing_blocker"); break; }
  }
  for (const c of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(c)) { addReason(reasons, "missing_checklist_item"); break; }
  }

  // ── Rule 3: metadataOnlyPlanning ─────────────────────────────────────────
  if (inputRec["metadataOnlyPlanning"] !== true) addReason(reasons, "unsafe_planning_note_detected");

  // ── Rule 4: syntheticOnlyExpansion ────────────────────────────────────────
  if (inputRec["syntheticOnlyExpansion"] !== true) addReason(reasons, "unsafe_planning_note_detected");

  // ── Rule 5: additionalCaseContractRequired ────────────────────────────────
  if (inputRec["additionalCaseContractRequired"] !== true) {
    addReason(reasons, "unsafe_planning_note_detected");
  }

  // ── Rule 6: liveLLMCalledAgain ────────────────────────────────────────────
  if (inputRec["liveLLMCalledAgain"] === true) addReason(reasons, "live_call_attempted_in_planning");

  // ── Rule 7: additionalLiveLLMCallsExecuted ────────────────────────────────
  if (inputRec["additionalLiveLLMCallsExecuted"] === true) {
    addReason(reasons, "live_call_attempted_in_planning");
  }

  // ── Rule 8: expansion planning positive gates must be true ────────────────
  if (inputRec["readyForAdditionalSyntheticLiveLlmCaseContract"] !== true) {
    addReason(reasons, "unsafe_planning_note_detected");
  }
  if (inputRec["readyForSyntheticPilotCaseSetDesign"] !== true) {
    addReason(reasons, "unsafe_planning_note_detected");
  }

  // ── Rule 9: dangerous readiness flags must be false ───────────────────────
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
    addReason(reasons, "unsafe_planning_note_detected");
  }

  // ── Rule 10: prompt/model output ─────────────────────────────────────────
  if (inputRec["promptTextAvailableForPlanning"] === true) {
    addReason(reasons, "prompt_text_available");
  }
  if (inputRec["modelOutputAvailableForPlanning"] === true) {
    addReason(reasons, "model_output_available");
  }
  if (inputRec["promptTextLogged"] === true || inputRec["modelOutputLogged"] === true) {
    addReason(reasons, "prompt_or_model_output_logged");
  }

  // ── Rule 11: syntheticInputOnly ───────────────────────────────────────────
  if (inputRec["syntheticInputOnly"] !== true) addReason(reasons, "real_input_detected");

  // ── Rule 12: real/raw/redacted/OCR/file/public ────────────────────────────
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

  // ── Rule 13: Branch C / runSmartTalk / OCR ───────────────────────────────
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

  // ── Rule 14: user-visible output ──────────────────────────────────────────
  if (inputRec["userVisibleOutputEmitted"] === true) {
    addReason(reasons, "user_visible_output_detected");
  }

  // ── Rule 15: persistence / public / pilot ─────────────────────────────────
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

  // ── Rule 16: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorExpansionPlanningAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerExpansionPlanningAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_checklist_item");
      break;
    }
  }

  // ── Rule 17: contains* flags ──────────────────────────────────────────────
  if (inputRec["containsSecret"] === true) addReason(reasons, "forbidden_secret_detected");
  if (inputRec["containsEnvValue"] === true) addReason(reasons, "forbidden_env_value_detected");
  if (inputRec["containsApiKey"] === true) addReason(reasons, "forbidden_api_key_detected");
  if (inputRec["containsUserPii"] === true) addReason(reasons, "forbidden_pii_detected");
  if (inputRec["containsFullDraftText"] === true) addReason(reasons, "forbidden_raw_text_detected");
  if (inputRec["containsModelOutput"] === true) addReason(reasons, "forbidden_model_output_detected");
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rules 18–19: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.planningId,
    input.operatorExpansionPlanningAcknowledgment,
    input.reviewerExpansionPlanningAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
      if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
      if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
      if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
      const hasUncategorised = FORBIDDEN_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_STRINGS.some(
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
      if (hasUncategorised) addReason(reasons, "unsafe_planning_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
    if (containsUnsafeRealInputPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
    if (containsUnsafeLiveExecPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
    if (containsUnsafeExecutionPhrase(s)) addReason(reasons, "unsafe_planning_note_detected");
  }

  // ── Determine status ──────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const isBlocked =
    !accepted &&
    reasons.length === 1 &&
    reasons[0] === "post_call_audit_not_ready";

  const status: SyntheticLiveLlmPilotExpansionPlanningResult["status"] = accepted
    ? "planned"
    : isBlocked
      ? "blocked"
      : "rejected";

  return {
    planningId: input.planningId,
    epochId: "8.3R",
    status,
    accepted,
    rejectionReasons: reasons,

    safeExpansionPlanningMetadata: {
      scopeCount: input.scopes.length,
      caseCount: input.cases.length,
      caseRiskClassCount: input.caseRiskClasses.length,
      expectedBehaviorCount: input.expectedBehaviors.length,
      requirementCount: input.requirements.length,
      blockerCount: input.blockers.length,
      checklistPassedCount: input.checklistConfirmed.length,
      metadataOnlyPlanning: true,
      syntheticOnlyExpansion: true,
    },

    readyForAdditionalSyntheticLiveLlmCaseContract: accepted,
    readyForSyntheticPilotCaseSetDesign: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    metadataOnlyPlanning: true,
    syntheticOnlyExpansion: true,
    additionalCaseContractRequired: true,
    liveLLMCalledAgain: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextAvailableForPlanning: false,
    modelOutputAvailableForPlanning: false,
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

    apiRouteModifiedByPlanning: false,
    existingRuntimeModifiedByPlanning: false,
    uiTouched: false,
    databaseOrStorageModifiedByPlanning: false,
    neverUserVisible: true,
  };
}

// ── Main planning function ────────────────────────────────────────────────────

/**
 * Runs the Synthetic Live LLM Pilot Expansion Planning for Phase 8.3R.
 *
 * 1. Calls runPostCallAudit() (8.3Q) as dependency.
 *    NOTE: This may trigger the full 8.3Q → 8.3P → 8.3O chain, including one
 *    live OpenAI call if OPENAI_API_KEY is present. 8.3R itself contains no
 *    fetch(), no process.env read, and no direct OpenAI call.
 * 2. Verifies all 8.3Q safety invariants.
 * 3. If prerequisites pass, builds accepted planning input and validates.
 * 4. If prerequisites fail, builds blocked input.
 * 5. Runs tamper cases without making extra live calls.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export async function runSyntheticLiveLlmPilotExpansionPlanning(): Promise<SyntheticLiveLlmPilotExpansionPlanningCheckResult> {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3Q post-call audit result ────────────────────────────

  const auditResult = await runPostCallAudit();
  const auditRec = asRec(auditResult);

  const auditReady =
    auditResult.allPassed === true &&
    auditRec["postCallAuditPassed"] === true &&
    auditRec["readyForSyntheticLiveLlmPilotExpansionPlanning"] === true &&
    auditRec["readyForSyntheticLiveLlmAdditionalCasePlanning"] === true &&
    auditRec["readyForLiveLLMRuntime"] !== true &&
    auditRec["readyForConnectedAiRuntimeExecution"] !== true &&
    auditRec["readyForRealOperatorPilotRun"] !== true &&
    auditRec["readyForPilotRunNow"] !== true &&
    auditRec["readyForPublicLaunch"] !== true &&
    auditRec["readyForPersistence"] !== true &&
    auditRec["metadataOnlyAudit"] === true &&
    auditRec["fullChainAudit"] === true &&
    auditRec["liveLLMCalledAgain"] !== true &&
    auditRec["liveLLMCalledExactlyOnce"] === true &&
    auditRec["promptTextAvailableForAudit"] !== true &&
    auditRec["modelOutputAvailableForAudit"] !== true &&
    auditRec["auditPersistenceUsed"] !== true &&
    auditRec["syntheticInputOnly"] === true &&
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
    auditRec["userVisibleOutputEmitted"] !== true &&
    auditRec["persistenceUsed"] !== true &&
    auditRec["publicRuntimeEnabled"] !== true &&
    auditRec["realOperatorPilotExecuted"] !== true &&
    auditRec["neverUserVisible"] === true;

  notes.push(`auditReady: ${String(auditReady)}`);
  notes.push(`auditResult.allPassed: ${String(auditResult.allPassed)}`);
  notes.push(
    `readyForSyntheticExpansionPlanning: ${String(auditRec["readyForSyntheticLiveLlmPilotExpansionPlanning"])}`,
  );

  // ── Step 2/3: Build and validate planning input ───────────────────────────

  let planningInput: SyntheticLiveLlmPilotExpansionPlanningInput;

  if (!auditReady) {
    notes.push("post-call audit prerequisite failed — building blocked planning input");
    planningInput = buildSyntheticLiveLlmPilotExpansionPlanningInput({ postCallAuditReady: false });
  } else {
    planningInput = buildSyntheticLiveLlmPilotExpansionPlanningInput({ postCallAuditReady: true });
  }

  const planningResult = validateSyntheticLiveLlmPilotExpansionPlanningInput(planningInput);
  const planningAccepted = planningResult.accepted;

  notes.push(`planningAccepted: ${String(planningAccepted)}`);
  notes.push(`planningStatus: ${planningResult.status}`);
  if (!planningResult.accepted) {
    notes.push(`rejectionReasons: ${planningResult.rejectionReasons.join(", ")}`);
  }

  // ── Step 4: Tamper cases — local validator only, NO extra live calls ───────

  const tamperBase = buildSyntheticLiveLlmPilotExpansionPlanningInput({ postCallAuditReady: true });

  type MutableInput = {
    -readonly [K in keyof SyntheticLiveLlmPilotExpansionPlanningInput]: SyntheticLiveLlmPilotExpansionPlanningInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): SyntheticLiveLlmPilotExpansionPlanningResult {
    return validateSyntheticLiveLlmPilotExpansionPlanningInput({
      ...tamperBase,
      ...overrides,
    } as SyntheticLiveLlmPilotExpansionPlanningInput);
  }

  const partialScopes = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_SCOPES.length - 1,
  );
  const partialCases = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASES.length - 1,
  );
  const partialRiskClasses = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CASE_RISK_CLASSES.length - 1,
  );
  const partialBehaviors = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_EXPECTED_BEHAVIORS.length - 1,
  );
  const partialRequirements = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_REQUIREMENTS.length - 1,
  );
  const partialBlockers = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_BLOCKERS.length - 1,
  );
  const partialChecklist = REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST.slice(
    0, REQUIRED_SYNTHETIC_LIVE_LLM_PILOT_EXPANSION_CHECKLIST.length - 1,
  );

  const tamperCases: Array<{
    label: string;
    result: SyntheticLiveLlmPilotExpansionPlanningResult;
  }> = [
    // 1. postCallAuditReady false
    { label: "auditReady=false", result: tamper({ postCallAuditReadyForExpansionPlanning: false }) },
    // 2. missing scope
    { label: "missing scope", result: tamper({ scopes: partialScopes }) },
    // 3. missing case
    { label: "missing case", result: tamper({ cases: partialCases }) },
    // 4. missing risk class
    { label: "missing risk class", result: tamper({ caseRiskClasses: partialRiskClasses }) },
    // 5. missing expected behavior
    { label: "missing expected behavior", result: tamper({ expectedBehaviors: partialBehaviors }) },
    // 6. missing requirement
    { label: "missing requirement", result: tamper({ requirements: partialRequirements }) },
    // 7. missing blocker
    { label: "missing blocker", result: tamper({ blockers: partialBlockers }) },
    // 8. missing checklist
    { label: "missing checklist", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 9. metadataOnlyPlanning false
    {
      label: "metadataOnlyPlanning=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        metadataOnlyPlanning: false as unknown as true,
      }),
    },
    // 10. syntheticOnlyExpansion false
    {
      label: "syntheticOnlyExpansion=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        syntheticOnlyExpansion: false as unknown as true,
      }),
    },
    // 11. additionalCaseContractRequired false
    {
      label: "additionalCaseContractRequired=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        additionalCaseContractRequired: false as unknown as true,
      }),
    },
    // 12. liveLLMCalledAgain true
    {
      label: "liveLLMCalledAgain=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        liveLLMCalledAgain: true as unknown as false,
      }),
    },
    // 13. additionalLiveLLMCallsExecuted true
    {
      label: "additionalLiveLLMCallsExecuted=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        additionalLiveLLMCallsExecuted: true as unknown as false,
      }),
    },
    // 14. readyForAdditionalSyntheticLiveLlmCaseContract false
    {
      label: "readyForAdditionalCase=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForAdditionalSyntheticLiveLlmCaseContract: false as unknown as true,
      }),
    },
    // 15. readyForSyntheticPilotCaseSetDesign false
    {
      label: "readyForCaseSetDesign=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForSyntheticPilotCaseSetDesign: false as unknown as true,
      }),
    },
    // 16. readyForLiveLLMRuntime true
    {
      label: "readyForLiveLLMRuntime=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForLiveLLMRuntime: true as unknown as false,
      }),
    },
    // 17. readyForConnectedAiRuntimeExecution true
    {
      label: "readyForConnectedAi=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForConnectedAiRuntimeExecution: true as unknown as false,
      }),
    },
    // 18. readyForRealOperatorPilotRun true
    {
      label: "readyForRealOperatorPilot=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForRealOperatorPilotRun: true as unknown as false,
      }),
    },
    // 19. readyForPilotRunNow true
    {
      label: "readyForPilotRunNow=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForPilotRunNow: true as unknown as false,
      }),
    },
    // 20. readyForPublicLaunch true
    {
      label: "readyForPublicLaunch=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForPublicLaunch: true as unknown as false,
      }),
    },
    // 21. readyForPersistence true
    {
      label: "readyForPersistence=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForPersistence: true as unknown as false,
      }),
    },
    // 22. readyForRealDocumentInput true
    {
      label: "readyForRealDocumentInput=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForRealDocumentInput: true as unknown as false,
      }),
    },
    // 23. readyForUserVisibleOutput true
    {
      label: "readyForUserVisibleOutput=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        readyForUserVisibleOutput: true as unknown as false,
      }),
    },
    // 24. promptTextAvailableForPlanning true
    {
      label: "promptTextAvailable=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        promptTextAvailableForPlanning: true as unknown as false,
      }),
    },
    // 25. modelOutputAvailableForPlanning true
    {
      label: "modelOutputAvailable=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        modelOutputAvailableForPlanning: true as unknown as false,
      }),
    },
    // 26. promptTextLogged true
    {
      label: "promptTextLogged=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        promptTextLogged: true as unknown as false,
      }),
    },
    // 27. modelOutputLogged true
    {
      label: "modelOutputLogged=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        modelOutputLogged: true as unknown as false,
      }),
    },
    // 28. syntheticInputOnly false
    {
      label: "syntheticInputOnly=false",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        syntheticInputOnly: false as unknown as true,
      }),
    },
    // 29. realUserInputAllowed true
    {
      label: "realUserInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        realUserInputAllowed: true as unknown as false,
      }),
    },
    // 30. rawInputAllowed true
    {
      label: "rawInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        rawInputAllowed: true as unknown as false,
      }),
    },
    // 31. realRedactedInputAllowed true
    {
      label: "realRedactedInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        realRedactedInputAllowed: true as unknown as false,
      }),
    },
    // 32. photoOrOcrInputAllowed true
    {
      label: "photoOrOcrInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        photoOrOcrInputAllowed: true as unknown as false,
      }),
    },
    // 33. fileUploadInputAllowed true
    {
      label: "fileUploadInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        fileUploadInputAllowed: true as unknown as false,
      }),
    },
    // 34. publicAnonymousInputAllowed true
    {
      label: "publicAnonymousInputAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        publicAnonymousInputAllowed: true as unknown as false,
      }),
    },
    // 35. branchCDependencyAllowed true
    {
      label: "branchCDependencyAllowed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        branchCDependencyAllowed: true as unknown as false,
      }),
    },
    // 36. runSmartTalkDependencyAllowed true
    {
      label: "runSmartTalkDep=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        runSmartTalkDependencyAllowed: true as unknown as false,
      }),
    },
    // 37. ocrRuntimeDependencyAllowed true
    {
      label: "ocrRuntimeDep=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        ocrRuntimeDependencyAllowed: true as unknown as false,
      }),
    },
    // 38. branchCCalled true
    {
      label: "branchCCalled=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        branchCCalled: true as unknown as false,
      }),
    },
    // 39. runSmartTalkCalledOrImported true
    {
      label: "runSmartTalkCalled=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        runSmartTalkCalledOrImported: true as unknown as false,
      }),
    },
    // 40. extractTextFromImageCalledOrImported true
    {
      label: "extractTextCalled=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        extractTextFromImageCalledOrImported: true as unknown as false,
      }),
    },
    // 41. userVisibleOutputEmitted true
    {
      label: "userVisibleOutputEmitted=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        userVisibleOutputEmitted: true as unknown as false,
      }),
    },
    // 42. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 43. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 44. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 45. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 46. realOperatorPilotExecuted true
    {
      label: "realOperatorPilotExecuted=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        realOperatorPilotExecuted: true as unknown as false,
      }),
    },
    // 47. missing operator ack
    {
      label: "missing operator ack",
      result: tamper({ operatorExpansionPlanningAcknowledgment: "partial" }),
    },
    // 48. missing reviewer ack
    {
      label: "missing reviewer ack",
      result: tamper({ reviewerExpansionPlanningAcknowledgment: "partial" }),
    },
    // 49. containsSecret true
    {
      label: "containsSecret=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsSecret: true as unknown as false,
      }),
    },
    // 50. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 51. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsApiKey: true as unknown as false,
      }),
    },
    // 52. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 53. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 54. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 55. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 56. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsUserPii: true as unknown as false,
      }),
    },
    // 57. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateSyntheticLiveLlmPilotExpansionPlanningInput({
        ...tamperBase,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 58–90: notes with forbidden strings
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=val"] }) },
    {
      label: 'notes: "process.env.OPENAI_API_KEY"',
      result: tamper({ notes: ["process.env.OPENAI_API_KEY"] }),
    },
    { label: 'notes: "apiKey:"', result: tamper({ notes: ["apiKey: abc"] }) },
    { label: 'notes: "Authorization: Bearer"', result: tamper({ notes: ["Authorization: Bearer x"] }) },
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    { label: 'notes: "stored prompt"', result: tamper({ notes: ["stored prompt"] }) },
    { label: 'notes: "prompt text logged"', result: tamper({ notes: ["prompt text logged"] }) },
    { label: 'notes: "model output logged"', result: tamper({ notes: ["model output logged"] }) },
    { label: 'notes: "model output reviewed"', result: tamper({ notes: ["model output reviewed"] }) },
    { label: 'notes: "second live llm call"', result: tamper({ notes: ["second live llm call"] }) },
    { label: 'notes: "audit persisted"', result: tamper({ notes: ["audit persisted"] }) },
    { label: 'notes: "public runtime ready"', result: tamper({ notes: ["public runtime ready"] }) },
    { label: 'notes: "real input pilot ready"', result: tamper({ notes: ["real input pilot ready"] }) },
    {
      label: 'notes: "user visible output ready"',
      result: tamper({ notes: ["user visible output ready"] }),
    },
    {
      label: 'notes: "real document input ready"',
      result: tamper({ notes: ["real document input ready"] }),
    },
    {
      label: 'notes: "additional live calls executed"',
      result: tamper({ notes: ["additional live calls executed"] }),
    },
    {
      label: 'notes: "synthetic outputs approved for users"',
      result: tamper({ notes: ["synthetic outputs approved for users"] }),
    },
    {
      label: 'notes: "production live runtime ready"',
      result: tamper({ notes: ["production live runtime ready"] }),
    },
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    { label: 'notes: "live llm executed"', result: tamper({ notes: ["live llm executed"] }) },
    {
      label: 'notes: "general live llm runtime authorized"',
      result: tamper({ notes: ["general live llm runtime authorized"] }),
    },
    {
      label: 'notes: "authorized public runtime"',
      result: tamper({ notes: ["authorized public runtime"] }),
    },
    {
      label: 'notes: "multiple live llm calls authorized"',
      result: tamper({ notes: ["multiple live llm calls authorized"] }),
    },
    {
      label: 'notes: "public launch enabled"',
      result: tamper({ notes: ["public launch enabled"] }),
    },
    {
      label: 'notes: "production runtime enabled"',
      result: tamper({ notes: ["production runtime enabled"] }),
    },
    {
      label: 'notes: "real operator pilot executed"',
      result: tamper({ notes: ["real operator pilot executed"] }),
    },
    {
      label: 'notes: "model output returned to user"',
      result: tamper({ notes: ["model output returned to user"] }),
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

  const allPassed = auditReady && planningAccepted && tamperCasesRejected;
  notes.push(`allPassed: ${String(allPassed)}`);

  if (!auditReady) {
    notes.push("planning blocked: post-call audit prerequisite not satisfied");
  }

  return {
    checkId: "8.3R",
    allPassed,
    postCallAuditReadyForExpansionPlanning: auditReady,
    syntheticLiveLlmPilotExpansionPlanningAccepted: planningAccepted,
    tamperCasesRejected,

    readyForAdditionalSyntheticLiveLlmCaseContract: allPassed,
    readyForSyntheticPilotCaseSetDesign: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,
    readyForRealDocumentInput: false,
    readyForUserVisibleOutput: false,

    metadataOnlyPlanning: true,
    syntheticOnlyExpansion: true,
    additionalCaseContractRequired: true,
    liveLLMCalledAgain: false,
    additionalLiveLLMCallsExecuted: false,

    promptTextAvailableForPlanning: false,
    modelOutputAvailableForPlanning: false,
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
