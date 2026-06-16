/**
 * User-Visible Output Authorization Contract Check (Phase 8.3F).
 *
 * Validates the User-Visible Output Authorization Contract input and produces a
 * `UserVisibleOutputAuthorizationContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runManualReviewBeforeUserVisibleOutputContractCheck() (8.3E) and
 *      verify all prerequisite invariants.
 *   2. Build a synthetic safe authorization input and validate it (must be
 *      accepted).
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
 * - generate AI output or store model output
 * - emit user-visible output
 * - authorize public runtime, live LLM runtime, persistence, or global output
 * - forward any actual input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runUserVisibleOutputAuthorizationContractCheck()` explicitly.
 */

import { runManualReviewBeforeUserVisibleOutputContractCheck } from "./run-manual-review-before-user-visible-output-contract-check";
import {
  ALLOWED_USER_VISIBLE_OUTPUT_CLASSES,
  BLOCKED_USER_VISIBLE_OUTPUT_CLASSES,
  FORBIDDEN_USER_VISIBLE_OUTPUT_AUTHORIZATION_STRINGS,
  REQUIRED_USER_VISIBLE_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST,
  REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS,
  REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS,
  REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES,
} from "./user-visible-output-authorization-contract-types";
import type {
  UserVisibleAuthorizationChecklistItem,
  UserVisibleAuthorizationCondition,
  UserVisibleAuthorizationScope,
  UserVisibleAuthorizedOutputClass,
  UserVisibleBlockedOutputClass,
  UserVisibleOutputAuthorizationContractCheckResult,
  UserVisibleOutputAuthorizationContractInput,
  UserVisibleOutputAuthorizationContractResult,
  UserVisibleOutputAuthorizationRejectionReason,
} from "./user-visible-output-authorization-contract-types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SENSITIVE_PERSONAL_MARKERS = [
  "Name:",
  "Adresse:",
  "Geburtsdatum:",
  "Kind:",
];
const HIGH_RISK_LEGAL_MARKERS = ["Abschiebung", "Kündigung", "Mietvertrag"];
const AUTHORITY_DOCUMENT_MARKERS = [
  "Sehr geehrter",
  "Aktenzeichen",
  "IBAN",
  "Steuer-ID",
  "BG-Nr",
];
const UNSAFE_CERTAINTY_PHRASES = [
  "Sie müssen",
  "garantiert",
  "fristlos sicher",
  "rechtlich sicher",
];
const UNSAFE_GLOBAL_AUTH_PHRASES = [
  "public launch enabled",
  "all outputs authorized",
  "global approval",
  "branch c authorized",
  "approved for user display",
  "auto-approved",
  "show to user now",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_USER_VISIBLE_OUTPUT_AUTHORIZATION_STRINGS.some((f) =>
    value.includes(f),
  );
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
  return value.includes("modelOutput");
}

function addReason(
  list: UserVisibleOutputAuthorizationRejectionReason[],
  reason: UserVisibleOutputAuthorizationRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `UserVisibleOutputAuthorizationContractInput` for
 * use in the harness check. No output is emitted. No LLM is called. No
 * existing runtime path is touched. No authorization is granted globally.
 */
export function buildSyntheticUserVisibleOutputAuthorizationContractInput(): UserVisibleOutputAuthorizationContractInput {
  const ackStatements =
    REQUIRED_USER_VISIBLE_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "user-visible-output-authorization-contract-8-3f",
    epochId: "8.3F",
    previousPhaseId: "8.3E",

    manualReviewBeforeUserVisibleOutputReady: true,

    authorizationScopes: [...REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES],
    authorizationConditions: [
      ...REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS,
    ],
    allowedOutputClasses: [...ALLOWED_USER_VISIBLE_OUTPUT_CLASSES],
    blockedOutputClasses: [...BLOCKED_USER_VISIBLE_OUTPUT_CLASSES],
    dispositionOptions: [...REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS],
    checklistConfirmed: [...REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST],

    selectedDisposition:
      "authorized_for_future_controlled_user_visible_contract_path",
    selectedDispositionAllowsActualEmissionNow: false,

    oneReviewedOutputOnly: true,
    oneControlledSessionOnly: true,
    globalAuthorizationAllowed: false,
    publicRuntimeAuthorizationAllowed: false,
    liveLlmRuntimeAuthorizationAllowed: false,
    persistenceAuthorizationAllowed: false,
    branchCAuthorizationAllowed: false,

    governanceRecheckCompleted: true,
    manualReviewCompleted: true,
    evidenceMetadataPresent: true,
    scopeLimitsPresent: true,
    safetyLanguageRequired: true,
    uncertaintyPreserved: true,
    partialInputLimitationPreserved: true,

    legalCertaintyWithoutEvidenceAllowed: false,
    deadlineClaimWithoutEvidenceAllowed: false,
    unsafeNextStepAllowed: false,
    autonomousActionAllowed: false,
    rawOrRedactedInputEchoAllowed: false,
    modelOutputDumpAllowed: false,
    internalAuditDumpAllowed: false,
    unsupportedClaimAllowed: false,
    unsafeCertaintyAllowed: false,
    missingContextAllowed: false,

    userVisibleOutputAuthorizedByContract: false,
    emittedToUserNow: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    liveLLMCallPerformed: false,
    realInputProcessedByContract: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    operatorAuthorizationAcknowledgment: ackStatements,
    reviewerAuthorizationAcknowledgment: ackStatements,
    notes: [
      "synthetic safe user-visible output authorization contract without actual output emission",
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

    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates a `UserVisibleOutputAuthorizationContractInput` and returns a
 * typed `UserVisibleOutputAuthorizationContractResult`.
 */
export function validateUserVisibleOutputAuthorizationContractInput(
  input: UserVisibleOutputAuthorizationContractInput,
): UserVisibleOutputAuthorizationContractResult {
  const reasons: UserVisibleOutputAuthorizationRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: manualReviewBeforeUserVisibleOutputReady ──────────────────────
  if (!input.manualReviewBeforeUserVisibleOutputReady) {
    addReason(reasons, "manual_review_contract_not_ready");
  }

  // ── Rule 2: authorization scopes ──────────────────────────────────────────
  for (const scope of REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES) {
    if (!input.authorizationScopes.includes(scope)) {
      addReason(reasons, "missing_authorization_scope");
      break;
    }
  }

  // ── Rule 3: authorization conditions ─────────────────────────────────────
  for (const cond of REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS) {
    if (!input.authorizationConditions.includes(cond)) {
      addReason(reasons, "missing_authorization_condition");
      break;
    }
  }

  // ── Rule 4: allowed output classes ───────────────────────────────────────
  for (const cls of ALLOWED_USER_VISIBLE_OUTPUT_CLASSES) {
    if (!input.allowedOutputClasses.includes(cls)) {
      addReason(reasons, "missing_allowed_output_class");
      break;
    }
  }

  // ── Rule 5: blocked output classes ───────────────────────────────────────
  for (const cls of BLOCKED_USER_VISIBLE_OUTPUT_CLASSES) {
    if (!input.blockedOutputClasses.includes(cls)) {
      addReason(reasons, "missing_blocked_output_class");
      break;
    }
  }

  // ── Rule 6: disposition options ───────────────────────────────────────────
  for (const disp of REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS) {
    if (!input.dispositionOptions.includes(disp)) {
      addReason(reasons, "missing_authorization_disposition");
      break;
    }
  }

  // ── Rule 7: checklist ─────────────────────────────────────────────────────
  for (const item of REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 8: selected disposition validity ────────────────────────────────
  if (
    !REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS.includes(
      input.selectedDisposition,
    )
  ) {
    addReason(reasons, "invalid_selected_disposition");
  }

  // ── Rule 9: selectedDispositionAllowsActualEmissionNow ────────────────────
  if (inputRec["selectedDispositionAllowsActualEmissionNow"] === true) {
    addReason(reasons, "user_visible_output_authorized_too_broadly");
  }

  // ── Rule 10: scope invariants ─────────────────────────────────────────────
  if (inputRec["oneReviewedOutputOnly"] !== true) {
    addReason(reasons, "missing_authorization_scope");
  }
  if (inputRec["oneControlledSessionOnly"] !== true) {
    addReason(reasons, "missing_authorization_scope");
  }

  // ── Rule 11: global/runtime/persistence/branch authorization blocks ───────
  if (inputRec["globalAuthorizationAllowed"] === true) {
    addReason(reasons, "global_authorization_attempt_detected");
  }
  if (inputRec["publicRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "public_runtime_authorization_attempt_detected");
  }
  if (inputRec["liveLlmRuntimeAuthorizationAllowed"] === true) {
    addReason(reasons, "live_llm_runtime_authorization_attempt_detected");
  }
  if (inputRec["persistenceAuthorizationAllowed"] === true) {
    addReason(reasons, "persistence_authorization_attempt_detected");
  }
  if (inputRec["branchCAuthorizationAllowed"] === true) {
    addReason(reasons, "branch_c_authorization_attempt_detected");
  }

  // ── Rule 12: governance precondition flags ────────────────────────────────
  if (inputRec["governanceRecheckCompleted"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["manualReviewCompleted"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["evidenceMetadataPresent"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["scopeLimitsPresent"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["safetyLanguageRequired"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["uncertaintyPreserved"] !== true) {
    addReason(reasons, "missing_authorization_condition");
  }
  if (inputRec["partialInputLimitationPreserved"] !== true) {
    addReason(reasons, "partial_input_limitation_missing");
  }

  // ── Rule 13: unsafe claim/output flags ────────────────────────────────────
  if (inputRec["legalCertaintyWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "legal_certainty_allowed_without_evidence");
  }
  if (inputRec["deadlineClaimWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "deadline_claim_allowed_without_evidence");
  }
  if (inputRec["unsafeNextStepAllowed"] === true) {
    addReason(reasons, "unsafe_next_step_allowed");
  }
  if (inputRec["autonomousActionAllowed"] === true) {
    addReason(reasons, "autonomous_action_allowed");
  }
  if (inputRec["rawOrRedactedInputEchoAllowed"] === true) {
    addReason(reasons, "raw_or_redacted_input_echo_allowed");
  }
  if (inputRec["modelOutputDumpAllowed"] === true) {
    addReason(reasons, "model_output_dump_allowed");
  }
  if (inputRec["internalAuditDumpAllowed"] === true) {
    addReason(reasons, "internal_audit_dump_allowed");
  }
  if (inputRec["unsupportedClaimAllowed"] === true) {
    addReason(reasons, "unsupported_claim_allowed");
  }
  if (inputRec["unsafeCertaintyAllowed"] === true) {
    addReason(reasons, "unsafe_certainty_allowed");
  }
  if (inputRec["missingContextAllowed"] === true) {
    addReason(reasons, "missing_context_allowed");
  }

  // ── Rule 14: user-visible output / emission flags ─────────────────────────
  if (inputRec["userVisibleOutputAuthorizedByContract"] === true) {
    addReason(reasons, "user_visible_output_authorized_too_broadly");
  }
  if (inputRec["emittedToUserNow"] === true) {
    addReason(reasons, "user_visible_output_emission_claim_detected");
  }

  // ── Rule 15: execution/AI-output/forwarding flags ─────────────────────────
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_claim_detected");
  }
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }
  if (inputRec["rawInputForwarded"] === true) {
    addReason(reasons, "raw_input_forwarding_claim_detected");
  }
  if (inputRec["redactedInputForwardingExecuted"] === true) {
    addReason(reasons, "redacted_input_forwarding_claim_detected");
  }

  // ── Rule 16: existing runtime isolation ───────────────────────────────────
  if (inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "run_smart_talk_call_claim_detected");
  }
  if (inputRec["publicBranchCCalled"] === true) {
    addReason(reasons, "public_branch_c_call_claim_detected");
  }
  if (inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "ocr_runtime_call_claim_detected");
  }

  // ── Rule 17: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_USER_VISIBLE_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorAuthorizationAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_USER_VISIBLE_AUTHORIZATION_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerAuthorizationAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 18: contains* content flags ─────────────────────────────────────
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
  if (
    inputRec["containsRawInputText"] === true ||
    inputRec["containsFullDraftText"] === true
  ) {
    addReason(reasons, "forbidden_raw_text_detected");
  }
  if (inputRec["containsRedactedText"] === true) {
    addReason(reasons, "forbidden_redacted_text_detected");
  }
  if (inputRec["containsModelOutput"] === true) {
    addReason(reasons, "forbidden_model_output_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Rule 19: persistence/public runtime flags ─────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_authorization_attempt_detected");
  }
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "persistence_authorization_attempt_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "persistence_authorization_attempt_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_authorization_attempt_detected");
  }

  // ── Rules 20–23: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorAuthorizationAcknowledgment,
    input.reviewerAuthorizationAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_user_visible_authorization_note_detected");
      if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_user_visible_authorization_note_detected");
      const uncategorised =
        FORBIDDEN_USER_VISIBLE_OUTPUT_AUTHORIZATION_STRINGS.some(
          (f) =>
            s.includes(f) &&
            !containsSecretLike(s) &&
            !containsEnvAssignmentLike(s) &&
            !containsRawTextMarker(s) &&
            !containsRedactedTextMarker(s) &&
            !containsModelOutputMarker(s) &&
            !containsUnsafeCertaintyPhrase(s) &&
            !containsUnsafeGlobalAuthPhrase(s) &&
            !containsUnsafeMarker(s),
        );
      if (uncategorised) addReason(reasons, "unsafe_user_visible_authorization_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_user_visible_authorization_note_detected");
    if (containsUnsafeGlobalAuthPhrase(s)) addReason(reasons, "unsafe_user_visible_authorization_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3F",
    status,
    accepted,
    rejectionReasons: reasons,

    safeAuthorizationMetadata: {
      authorizationScopeCount: input.authorizationScopes.length,
      authorizationConditionCount: input.authorizationConditions.length,
      allowedOutputClassCount: input.allowedOutputClasses.length,
      blockedOutputClassCount: input.blockedOutputClasses.length,
      dispositionOptionCount: input.dispositionOptions.length,
      checklistPassedCount: input.checklistConfirmed.length,
      selectedDisposition: input.selectedDisposition,
    },

    readyForAiConnectedSyntheticTestHarnessContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    userVisibleOutputAuthorizedByContract: false,
    emittedToUserNow: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    globalAuthorizationAllowed: false,
    publicRuntimeAuthorizationAllowed: false,
    liveLlmRuntimeAuthorizationAllowed: false,
    persistenceAuthorizationAllowed: false,
    branchCAuthorizationAllowed: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByAuthorizationContract: false,
    existingRuntimeModifiedByAuthorizationContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByAuthorizationContract: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the User-Visible Output Authorization Contract check for Phase 8.3F.
 *
 * Calls `runManualReviewBeforeUserVisibleOutputContractCheck()` (8.3E),
 * validates a synthetic safe authorization input, and runs tamper cases.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT generate AI output.
 * Does NOT emit user-visible output. Does NOT authorize globally.
 * Does NOT modify DB/storage.
 */
export function runUserVisibleOutputAuthorizationContractCheck(): UserVisibleOutputAuthorizationContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3E manual review contract ────────────────────────────

  const manualReviewResult =
    runManualReviewBeforeUserVisibleOutputContractCheck();
  const mrRec = asRec(manualReviewResult);

  const manualReviewBeforeUserVisibleOutputReady =
    manualReviewResult.allPassed === true &&
    mrRec["readyForUserVisibleOutputAuthorizationContract"] === true &&
    mrRec["readyForLiveLLMRuntime"] !== true &&
    mrRec["readyForConnectedAiRuntimeExecution"] !== true &&
    mrRec["readyForRealOperatorPilotRun"] !== true &&
    mrRec["readyForPilotRunNow"] !== true &&
    mrRec["readyForPublicLaunch"] !== true &&
    mrRec["readyForPersistence"] !== true &&
    mrRec["userVisibleOutputAuthorized"] !== true &&
    mrRec["emittedToUserNow"] !== true &&
    mrRec["aiOutputGenerated"] !== true &&
    mrRec["modelOutputStored"] !== true &&
    mrRec["persistenceUsed"] !== true &&
    mrRec["liveLLMCalled"] !== true &&
    mrRec["realInputProcessed"] !== true &&
    mrRec["rawInputForwarded"] !== true &&
    mrRec["redactedInputForwardingExecuted"] !== true &&
    mrRec["runSmartTalkCalledOrImported"] !== true &&
    mrRec["publicBranchCCalled"] !== true &&
    mrRec["extractTextFromImageCalledOrImported"] !== true &&
    mrRec["publicRuntimeEnabled"] !== true &&
    mrRec["neverUserVisible"] === true;

  notes.push(
    `manualReviewBeforeUserVisibleOutputReady: ${String(manualReviewBeforeUserVisibleOutputReady)}`,
  );
  notes.push(
    `manualReviewResult.allPassed: ${String(manualReviewResult.allPassed)}`,
  );
  notes.push(
    `readyForUserVisibleOutputAuthorizationContract: ${String(mrRec["readyForUserVisibleOutputAuthorizationContract"])}`,
  );

  // ── Step 2: Validate the synthetic authorization input ────────────────────

  const syntheticInput =
    buildSyntheticUserVisibleOutputAuthorizationContractInput();
  const syntheticResult =
    validateUserVisibleOutputAuthorizationContractInput(syntheticInput);
  const syntheticUserVisibleOutputAuthorizationAccepted =
    syntheticResult.accepted;

  notes.push(
    `syntheticUserVisibleOutputAuthorizationAccepted: ${String(syntheticUserVisibleOutputAuthorizationAccepted)}`,
  );
  if (!syntheticUserVisibleOutputAuthorizationAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof UserVisibleOutputAuthorizationContractInput]: UserVisibleOutputAuthorizationContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): UserVisibleOutputAuthorizationContractResult {
    return validateUserVisibleOutputAuthorizationContractInput({
      ...syntheticInput,
      ...overrides,
    } as UserVisibleOutputAuthorizationContractInput);
  }

  const partialScopes = REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES.slice(
    0,
    REQUIRED_USER_VISIBLE_AUTHORIZATION_SCOPES.length - 1,
  ) as unknown as UserVisibleAuthorizationScope[];
  const partialConds =
    REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS.slice(
      0,
      REQUIRED_USER_VISIBLE_AUTHORIZATION_CONDITIONS.length - 1,
    ) as unknown as UserVisibleAuthorizationCondition[];
  const partialAllowed = ALLOWED_USER_VISIBLE_OUTPUT_CLASSES.slice(
    0,
    ALLOWED_USER_VISIBLE_OUTPUT_CLASSES.length - 1,
  ) as unknown as UserVisibleAuthorizedOutputClass[];
  const partialBlocked = BLOCKED_USER_VISIBLE_OUTPUT_CLASSES.slice(
    0,
    BLOCKED_USER_VISIBLE_OUTPUT_CLASSES.length - 1,
  ) as unknown as UserVisibleBlockedOutputClass[];
  const partialDispositions =
    REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS.slice(
      0,
      REQUIRED_USER_VISIBLE_AUTHORIZATION_DISPOSITIONS.length - 1,
    );
  const partialChecklist = REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST.slice(
    0,
    REQUIRED_USER_VISIBLE_AUTHORIZATION_CHECKLIST.length - 1,
  ) as unknown as UserVisibleAuthorizationChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: UserVisibleOutputAuthorizationContractResult;
  }> = [
    // 1. manualReviewBeforeUserVisibleOutputReady false
    { label: "manualReviewBeforeUserVisibleOutputReady=false", result: tamper({ manualReviewBeforeUserVisibleOutputReady: false }) },
    // 2. missing authorization scope
    { label: "missing authorization scope", result: tamper({ authorizationScopes: partialScopes }) },
    // 3. missing authorization condition
    { label: "missing authorization condition", result: tamper({ authorizationConditions: partialConds }) },
    // 4. missing allowed output class
    { label: "missing allowed output class", result: tamper({ allowedOutputClasses: partialAllowed }) },
    // 5. missing blocked output class
    { label: "missing blocked output class", result: tamper({ blockedOutputClasses: partialBlocked }) },
    // 6. missing disposition option
    { label: "missing disposition option", result: tamper({ dispositionOptions: partialDispositions }) },
    // 7. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 8. selectedDispositionAllowsActualEmissionNow true
    { label: "selectedDispositionAllowsActualEmissionNow=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, selectedDispositionAllowsActualEmissionNow: true as unknown as false }) },
    // 9. oneReviewedOutputOnly false
    { label: "oneReviewedOutputOnly=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, oneReviewedOutputOnly: false as unknown as true }) },
    // 10. oneControlledSessionOnly false
    { label: "oneControlledSessionOnly=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, oneControlledSessionOnly: false as unknown as true }) },
    // 11. globalAuthorizationAllowed true
    { label: "globalAuthorizationAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, globalAuthorizationAllowed: true as unknown as false }) },
    // 12. publicRuntimeAuthorizationAllowed true
    { label: "publicRuntimeAuthorizationAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, publicRuntimeAuthorizationAllowed: true as unknown as false }) },
    // 13. liveLlmRuntimeAuthorizationAllowed true
    { label: "liveLlmRuntimeAuthorizationAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, liveLlmRuntimeAuthorizationAllowed: true as unknown as false }) },
    // 14. persistenceAuthorizationAllowed true
    { label: "persistenceAuthorizationAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, persistenceAuthorizationAllowed: true as unknown as false }) },
    // 15. branchCAuthorizationAllowed true
    { label: "branchCAuthorizationAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, branchCAuthorizationAllowed: true as unknown as false }) },
    // 16. governanceRecheckCompleted false
    { label: "governanceRecheckCompleted=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, governanceRecheckCompleted: false as unknown as true }) },
    // 17. manualReviewCompleted false
    { label: "manualReviewCompleted=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, manualReviewCompleted: false as unknown as true }) },
    // 18. evidenceMetadataPresent false
    { label: "evidenceMetadataPresent=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, evidenceMetadataPresent: false as unknown as true }) },
    // 19. scopeLimitsPresent false
    { label: "scopeLimitsPresent=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, scopeLimitsPresent: false as unknown as true }) },
    // 20. safetyLanguageRequired false
    { label: "safetyLanguageRequired=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, safetyLanguageRequired: false as unknown as true }) },
    // 21. uncertaintyPreserved false
    { label: "uncertaintyPreserved=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, uncertaintyPreserved: false as unknown as true }) },
    // 22. partialInputLimitationPreserved false
    { label: "partialInputLimitationPreserved=false", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, partialInputLimitationPreserved: false as unknown as true }) },
    // 23. legalCertaintyWithoutEvidenceAllowed true
    { label: "legalCertaintyWithoutEvidenceAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, legalCertaintyWithoutEvidenceAllowed: true as unknown as false }) },
    // 24. deadlineClaimWithoutEvidenceAllowed true
    { label: "deadlineClaimWithoutEvidenceAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, deadlineClaimWithoutEvidenceAllowed: true as unknown as false }) },
    // 25. unsafeNextStepAllowed true
    { label: "unsafeNextStepAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, unsafeNextStepAllowed: true as unknown as false }) },
    // 26. autonomousActionAllowed true
    { label: "autonomousActionAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, autonomousActionAllowed: true as unknown as false }) },
    // 27. rawOrRedactedInputEchoAllowed true
    { label: "rawOrRedactedInputEchoAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, rawOrRedactedInputEchoAllowed: true as unknown as false }) },
    // 28. modelOutputDumpAllowed true
    { label: "modelOutputDumpAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, modelOutputDumpAllowed: true as unknown as false }) },
    // 29. internalAuditDumpAllowed true
    { label: "internalAuditDumpAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, internalAuditDumpAllowed: true as unknown as false }) },
    // 30. unsupportedClaimAllowed true
    { label: "unsupportedClaimAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, unsupportedClaimAllowed: true as unknown as false }) },
    // 31. unsafeCertaintyAllowed true
    { label: "unsafeCertaintyAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, unsafeCertaintyAllowed: true as unknown as false }) },
    // 32. missingContextAllowed true
    { label: "missingContextAllowed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, missingContextAllowed: true as unknown as false }) },
    // 33. userVisibleOutputAuthorizedByContract true
    { label: "userVisibleOutputAuthorizedByContract=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, userVisibleOutputAuthorizedByContract: true as unknown as false }) },
    // 34. emittedToUserNow true
    { label: "emittedToUserNow=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, emittedToUserNow: true as unknown as false }) },
    // 35. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 36. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 37. modelOutputStored true
    { label: "modelOutputStored=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 38. persistenceUsed true
    { label: "persistenceUsed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 39. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 40. realInputProcessedByContract true
    { label: "realInputProcessedByContract=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, realInputProcessedByContract: true as unknown as false }) },
    // 41. rawInputForwarded true
    { label: "rawInputForwarded=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, rawInputForwarded: true as unknown as false }) },
    // 42. redactedInputForwardingExecuted true
    { label: "redactedInputForwardingExecuted=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, redactedInputForwardingExecuted: true as unknown as false }) },
    // 43. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 44. publicBranchCCalled true
    { label: "publicBranchCCalled=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, publicBranchCCalled: true as unknown as false }) },
    // 45. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 46. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorAuthorizationAcknowledgment: "partial only" }) },
    // 47. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerAuthorizationAcknowledgment: "partial only" }) },
    // 48. containsSecret true
    { label: "containsSecret=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 49. containsEnvValue true
    { label: "containsEnvValue=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 50. containsApiKey true
    { label: "containsApiKey=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 51. containsRawInputText true
    { label: "containsRawInputText=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 52. containsRedactedText true
    { label: "containsRedactedText=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 53. containsModelOutput true
    { label: "containsModelOutput=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 54. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 55. containsUserPii true
    { label: "containsUserPii=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 56. notes: "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 57. notes: "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 58. notes: "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 59. notes: "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 60. notes: "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 61. notes: "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 62. notes: email
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 63. notes: phone
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 64. notes: "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 65. notes: "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 66. notes: "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 67. notes: "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 68. notes: "Sie müssen"
    { label: 'notes: "Sie müssen"', result: tamper({ notes: ["Sie müssen handeln"] }) },
    // 69. notes: "garantiert"
    { label: 'notes: "garantiert"', result: tamper({ notes: ["garantiert richtig"] }) },
    // 70. notes: "fristlos sicher"
    { label: 'notes: "fristlos sicher"', result: tamper({ notes: ["fristlos sicher"] }) },
    // 71. notes: "rechtlich sicher"
    { label: 'notes: "rechtlich sicher"', result: tamper({ notes: ["rechtlich sicher"] }) },
    // 72. notes: "approved for user display"
    { label: 'notes: "approved for user display"', result: tamper({ notes: ["approved for user display"] }) },
    // 73. notes: "auto-approved"
    { label: 'notes: "auto-approved"', result: tamper({ notes: ["auto-approved"] }) },
    // 74. notes: "show to user now"
    { label: 'notes: "show to user now"', result: tamper({ notes: ["show to user now"] }) },
    // 75. notes: "public launch enabled"
    { label: 'notes: "public launch enabled"', result: tamper({ notes: ["public launch enabled"] }) },
    // 76. notes: "all outputs authorized"
    { label: 'notes: "all outputs authorized"', result: tamper({ notes: ["all outputs authorized"] }) },
    // 77. notes: "global approval"
    { label: 'notes: "global approval"', result: tamper({ notes: ["global approval"] }) },
    // 78. notes: "branch c authorized"
    { label: 'notes: "branch c authorized"', result: tamper({ notes: ["branch c authorized"] }) },
    // 79. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 80. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 81. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 82. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateUserVisibleOutputAuthorizationContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
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
    manualReviewBeforeUserVisibleOutputReady &&
    syntheticUserVisibleOutputAuthorizationAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3F",
    allPassed,
    manualReviewBeforeUserVisibleOutputReady,
    syntheticUserVisibleOutputAuthorizationAccepted,
    tamperCasesRejected,

    readyForAiConnectedSyntheticTestHarnessContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    userVisibleOutputAuthorizedByContract: false,
    emittedToUserNow: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    globalAuthorizationAllowed: false,
    publicRuntimeAuthorizationAllowed: false,
    liveLlmRuntimeAuthorizationAllowed: false,
    persistenceAuthorizationAllowed: false,
    branchCAuthorizationAllowed: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    publicRuntimeEnabled: false,
    neverUserVisible: true,

    notes,
  };
}
