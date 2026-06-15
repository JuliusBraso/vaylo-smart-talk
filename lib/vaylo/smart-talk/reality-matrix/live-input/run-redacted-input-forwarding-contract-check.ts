/**
 * Redacted Input Forwarding Contract Check (Phase 8.3C).
 *
 * Validates the Redacted Input Forwarding Contract input and produces a
 * `RedactedInputForwardingContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runLiveLlmBoundaryContractCheck() and verify all prerequisite
 *      invariants from 8.3B.
 *   2. Build a synthetic safe forwarding input and validate it (must be
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
 *   The existing public Smart Talk Branch C runtime remains completely isolated
 *   from this governance contract (as established in 8.3B).
 *   `runSmartTalkCalledOrImported`, `publicBranchCCalled`, and
 *   `extractTextFromImageCalledOrImported` are always literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - forward any actual input (raw or redacted) to a live model
 * - generate AI output
 * - process actual user input
 * - authorize user-visible output
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runRedactedInputForwardingContractCheck()` explicitly.
 */

import { runLiveLlmBoundaryContractCheck } from "./run-live-llm-boundary-contract-check";
import {
  ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES,
  BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES,
  FORBIDDEN_REDACTED_INPUT_FORWARDING_STRINGS,
  REQUIRED_FORWARDING_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_FORWARDING_CHECKLIST,
  REQUIRED_FORWARDING_PRECONDITIONS,
  REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES,
  REQUIRED_REDACTION_PROOF_REQUIREMENTS,
} from "./redacted-input-forwarding-contract-types";
import type {
  ForwardingChecklistItem,
  ForwardingPrecondition,
  RedactedInputCategoryAllowedForForwarding,
  RedactedInputCategoryBlockedForForwarding,
  RedactedInputForwardingContractCheckResult,
  RedactedInputForwardingContractInput,
  RedactedInputForwardingContractResult,
  RedactedInputForwardingRejectionReason,
  RedactionProofRequirement,
} from "./redacted-input-forwarding-contract-types";

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

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_REDACTED_INPUT_FORWARDING_STRINGS.some((f) =>
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
  list: RedactedInputForwardingRejectionReason[],
  reason: RedactedInputForwardingRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `RedactedInputForwardingContractInput` for use in
 * the harness check. No actual input is forwarded. No live LLM is called. No
 * existing runtime path is touched.
 */
export function buildSyntheticRedactedInputForwardingContractInput(): RedactedInputForwardingContractInput {
  const ackStatements =
    REQUIRED_FORWARDING_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "redacted-input-forwarding-contract-8-3c",
    epochId: "8.3C",
    previousPhaseId: "8.3B",

    liveLlmBoundaryReady: true,

    forwardingTargetPolicies: [
      ...REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES,
    ],
    clearanceLevel: "policy_defined_only",
    allowedInputCategories: [...ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES],
    blockedInputCategories: [...BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES],
    redactionProofRequirements: [...REQUIRED_REDACTION_PROOF_REQUIREMENTS],
    forwardingPreconditions: [...REQUIRED_FORWARDING_PRECONDITIONS],
    checklistConfirmed: [...REQUIRED_FORWARDING_CHECKLIST],

    redactionProofComplete: true,
    manualReviewClearanceRequired: true,
    manualReviewClearanceGrantedByContract: false,
    redactionUncertaintyBlocksForwarding: true,
    highRiskUncertaintyBlocksForwarding: true,

    rawInputForwardingAllowed: false,
    redactedInputForwardingExecuted: false,
    realInputProcessedByContract: false,
    liveLLMCallPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputAllowed: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    operatorForwardingAcknowledgment: ackStatements,
    reviewerForwardingAcknowledgment: ackStatements,
    notes: [
      "synthetic safe redacted input forwarding contract without actual forwarding",
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

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

const VALID_CLEARANCE_LEVELS = new Set([
  "policy_defined_only",
  "redacted_input_ready_for_future_synthetic_adapter_test",
]);

/**
 * Validates a `RedactedInputForwardingContractInput` and returns a typed
 * `RedactedInputForwardingContractResult`.
 */
export function validateRedactedInputForwardingContractInput(
  input: RedactedInputForwardingContractInput,
): RedactedInputForwardingContractResult {
  const reasons: RedactedInputForwardingRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: liveLlmBoundaryReady ──────────────────────────────────────────
  if (!input.liveLlmBoundaryReady) {
    addReason(reasons, "live_llm_boundary_not_ready");
  }

  // ── Rule 2: forwarding target policies ───────────────────────────────────
  for (const policy of REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES) {
    if (!input.forwardingTargetPolicies.includes(policy)) {
      addReason(reasons, "forwarding_target_policy_missing");
      break;
    }
  }

  // ── Rule 3: clearance level ───────────────────────────────────────────────
  if (!VALID_CLEARANCE_LEVELS.has(input.clearanceLevel)) {
    addReason(reasons, "invalid_clearance_level");
  }

  // ── Rule 4: allowed input categories ─────────────────────────────────────
  for (const cat of ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES) {
    if (!input.allowedInputCategories.includes(cat)) {
      addReason(reasons, "missing_allowed_input_category");
      break;
    }
  }

  // ── Rule 5: blocked input categories ─────────────────────────────────────
  for (const cat of BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES) {
    if (!input.blockedInputCategories.includes(cat)) {
      addReason(reasons, "missing_blocked_input_category");
      break;
    }
  }

  // ── Rule 6: redaction proof requirements ─────────────────────────────────
  for (const req of REQUIRED_REDACTION_PROOF_REQUIREMENTS) {
    if (!input.redactionProofRequirements.includes(req)) {
      addReason(reasons, "missing_redaction_proof_requirement");
      break;
    }
  }

  // ── Rule 7: forwarding preconditions ─────────────────────────────────────
  for (const pre of REQUIRED_FORWARDING_PRECONDITIONS) {
    if (!input.forwardingPreconditions.includes(pre)) {
      addReason(reasons, "missing_forwarding_precondition");
      break;
    }
  }

  // ── Rule 8: checklist items ───────────────────────────────────────────────
  for (const item of REQUIRED_FORWARDING_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 9: redactionProofComplete ───────────────────────────────────────
  if (!input.redactionProofComplete) {
    addReason(reasons, "redaction_proof_incomplete");
  }

  // ── Rule 10: manualReviewClearanceRequired ────────────────────────────────
  if (inputRec["manualReviewClearanceRequired"] !== true) {
    addReason(reasons, "missing_manual_review_clearance");
  }

  // ── Rule 11: manualReviewClearanceGrantedByContract must be false ─────────
  if (inputRec["manualReviewClearanceGrantedByContract"] === true) {
    addReason(reasons, "missing_manual_review_clearance");
  }

  // ── Rule 12: redactionUncertaintyBlocksForwarding ─────────────────────────
  if (inputRec["redactionUncertaintyBlocksForwarding"] !== true) {
    addReason(reasons, "redaction_uncertainty_not_blocked");
  }

  // ── Rule 13: highRiskUncertaintyBlocksForwarding ──────────────────────────
  if (inputRec["highRiskUncertaintyBlocksForwarding"] !== true) {
    addReason(reasons, "high_risk_uncertainty_not_blocked");
  }

  // ── Rule 14: rawInputForwardingAllowed ────────────────────────────────────
  if (inputRec["rawInputForwardingAllowed"] === true) {
    addReason(reasons, "raw_input_forwarding_claim_detected");
  }

  // ── Rule 15: redactedInputForwardingExecuted ──────────────────────────────
  if (inputRec["redactedInputForwardingExecuted"] === true) {
    addReason(reasons, "redacted_input_forwarding_execution_claim_detected");
  }

  // ── Rule 16: realInputProcessedByContract ────────────────────────────────
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }

  // ── Rule 17: liveLLMCallPerformed ─────────────────────────────────────────
  if (inputRec["liveLLMCallPerformed"] === true) {
    addReason(reasons, "live_llm_call_claim_detected");
  }

  // ── Rule 18: aiOutputGenerated ────────────────────────────────────────────
  if (inputRec["aiOutputGenerated"] === true) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }

  // ── Rule 19: modelOutputStored ────────────────────────────────────────────
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }

  // ── Rule 20: userVisibleOutputAllowed ─────────────────────────────────────
  if (
    inputRec["userVisibleOutputAllowed"] === true ||
    inputRec["emittedToUserNow"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rule 21: runSmartTalkCalledOrImported ─────────────────────────────────
  if (inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "run_smart_talk_call_claim_detected");
  }

  // ── Rule 22: publicBranchCCalled ──────────────────────────────────────────
  if (inputRec["publicBranchCCalled"] === true) {
    addReason(reasons, "public_branch_c_call_claim_detected");
  }

  // ── Rule 23: extractTextFromImageCalledOrImported ─────────────────────────
  if (inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "ocr_runtime_call_claim_detected");
  }

  // ── Rule 24: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_FORWARDING_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorForwardingAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_FORWARDING_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerForwardingAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 25: contains* content flags ─────────────────────────────────────
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

  // ── Rule 26: runtime safety flags ────────────────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }

  // ── Rules 27–29: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorForwardingAcknowledgment,
    input.reviewerForwardingAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      const uncategorised = FORBIDDEN_REDACTED_INPUT_FORWARDING_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsRedactedTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsUnsafeMarker(s),
      );
      if (uncategorised) addReason(reasons, "unsafe_forwarding_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3C",
    status,
    accepted,
    rejectionReasons: reasons,

    safeForwardingMetadata: {
      forwardingTargetPolicyCount: input.forwardingTargetPolicies.length,
      allowedInputCategoryCount: input.allowedInputCategories.length,
      blockedInputCategoryCount: input.blockedInputCategories.length,
      redactionProofRequirementCount: input.redactionProofRequirements.length,
      forwardingPreconditionCount: input.forwardingPreconditions.length,
      checklistPassedCount: input.checklistConfirmed.length,
      clearanceLevel: input.clearanceLevel,
    },

    readyForAiOutputGovernanceRecheckContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    rawInputForwardingAllowed: false,
    redactedInputForwardingExecuted: false,
    realInputProcessed: false,
    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputAllowed: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByForwardingContract: false,
    existingRuntimeModifiedByForwardingContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByForwardingContract: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the Redacted Input Forwarding Contract check for Phase 8.3C.
 *
 * Calls `runLiveLlmBoundaryContractCheck()` (8.3B), validates a synthetic safe
 * forwarding input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts, extract-text-from-image.ts,
 * app/api/smart-talk/route.ts, or fetch(). Does NOT call any live LLM.
 * Does NOT forward any actual input. Does NOT generate AI output.
 * Does NOT store user content or modify DB/storage.
 */
export function runRedactedInputForwardingContractCheck(): RedactedInputForwardingContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3B live LLM boundary contract ───────────────────────

  const boundaryCheck = runLiveLlmBoundaryContractCheck();
  const bcRec = asRec(boundaryCheck);

  const liveLlmBoundaryReady =
    boundaryCheck.allPassed === true &&
    bcRec["readyForRedactedInputForwardingContract"] === true &&
    bcRec["readyForLiveLLMRuntime"] !== true &&
    bcRec["readyForConnectedAiRuntimeExecution"] !== true &&
    bcRec["readyForRealOperatorPilotRun"] !== true &&
    bcRec["readyForPilotRunNow"] !== true &&
    bcRec["readyForPublicLaunch"] !== true &&
    bcRec["readyForPersistence"] !== true &&
    bcRec["publicBranchCAuthorizedForGovernanceChain"] !== true &&
    bcRec["runSmartTalkAuthorizedForGovernanceChain"] !== true &&
    bcRec["extractTextFromImageAuthorizedForGovernanceChain"] !== true &&
    bcRec["liveLLMCalled"] !== true &&
    bcRec["aiOutputGenerated"] !== true &&
    bcRec["modelOutputStored"] !== true &&
    bcRec["realInputProcessed"] !== true &&
    bcRec["rawInputForwarded"] !== true &&
    bcRec["persistenceUsed"] !== true &&
    bcRec["publicRuntimeEnabled"] !== true &&
    bcRec["emittedToUserNow"] !== true &&
    bcRec["neverUserVisible"] === true;

  notes.push(`liveLlmBoundaryReady: ${String(liveLlmBoundaryReady)}`);
  notes.push(`boundaryCheck.allPassed: ${String(boundaryCheck.allPassed)}`);
  notes.push(
    `readyForRedactedInputForwardingContract: ${String(bcRec["readyForRedactedInputForwardingContract"])}`,
  );

  // ── Step 2: Validate the synthetic forwarding input ───────────────────────

  const syntheticInput = buildSyntheticRedactedInputForwardingContractInput();
  const syntheticResult = validateRedactedInputForwardingContractInput(syntheticInput);
  const syntheticRedactedInputForwardingAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticRedactedInputForwardingAccepted: ${String(syntheticRedactedInputForwardingAccepted)}`,
  );
  if (!syntheticRedactedInputForwardingAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof RedactedInputForwardingContractInput]: RedactedInputForwardingContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): RedactedInputForwardingContractResult {
    return validateRedactedInputForwardingContractInput({
      ...syntheticInput,
      ...overrides,
    } as RedactedInputForwardingContractInput);
  }

  const partialPolicies =
    REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES.slice(
      0,
      REQUIRED_REDACTED_INPUT_FORWARDING_TARGET_POLICIES.length - 1,
    );
  const partialAllowed =
    ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES.slice(
      0,
      ALLOWED_REDACTED_INPUT_FORWARDING_CATEGORIES.length - 1,
    ) as unknown as RedactedInputCategoryAllowedForForwarding[];
  const partialBlocked =
    BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES.slice(
      0,
      BLOCKED_REDACTED_INPUT_FORWARDING_CATEGORIES.length - 1,
    ) as unknown as RedactedInputCategoryBlockedForForwarding[];
  const partialRedactionProof = REQUIRED_REDACTION_PROOF_REQUIREMENTS.slice(
    0,
    REQUIRED_REDACTION_PROOF_REQUIREMENTS.length - 1,
  ) as unknown as RedactionProofRequirement[];
  const partialPreconditions = REQUIRED_FORWARDING_PRECONDITIONS.slice(
    0,
    REQUIRED_FORWARDING_PRECONDITIONS.length - 1,
  ) as unknown as ForwardingPrecondition[];
  const partialChecklist = REQUIRED_FORWARDING_CHECKLIST.slice(
    0,
    REQUIRED_FORWARDING_CHECKLIST.length - 1,
  ) as unknown as ForwardingChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: RedactedInputForwardingContractResult;
  }> = [
    // 1. liveLlmBoundaryReady false
    { label: "liveLlmBoundaryReady=false", result: tamper({ liveLlmBoundaryReady: false }) },
    // 2. missing forwarding target policy
    { label: "missing forwarding target policy", result: tamper({ forwardingTargetPolicies: partialPolicies }) },
    // 3. clearanceLevel "no_forwarding"
    { label: 'clearanceLevel="no_forwarding"', result: tamper({ clearanceLevel: "no_forwarding" }) },
    // 4. missing allowed input category
    { label: "missing allowed input category", result: tamper({ allowedInputCategories: partialAllowed }) },
    // 5. missing blocked input category
    { label: "missing blocked input category", result: tamper({ blockedInputCategories: partialBlocked }) },
    // 6. missing redaction proof requirement
    { label: "missing redaction proof requirement", result: tamper({ redactionProofRequirements: partialRedactionProof }) },
    // 7. missing forwarding precondition
    { label: "missing forwarding precondition", result: tamper({ forwardingPreconditions: partialPreconditions }) },
    // 8. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 9. redactionProofComplete false
    { label: "redactionProofComplete=false", result: tamper({ redactionProofComplete: false }) },
    // 10. manualReviewClearanceRequired false
    { label: "manualReviewClearanceRequired=false", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, manualReviewClearanceRequired: false as unknown as true }) },
    // 11. manualReviewClearanceGrantedByContract true
    { label: "manualReviewClearanceGrantedByContract=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, manualReviewClearanceGrantedByContract: true as unknown as false }) },
    // 12. redactionUncertaintyBlocksForwarding false
    { label: "redactionUncertaintyBlocksForwarding=false", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, redactionUncertaintyBlocksForwarding: false as unknown as true }) },
    // 13. highRiskUncertaintyBlocksForwarding false
    { label: "highRiskUncertaintyBlocksForwarding=false", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, highRiskUncertaintyBlocksForwarding: false as unknown as true }) },
    // 14. rawInputForwardingAllowed true
    { label: "rawInputForwardingAllowed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, rawInputForwardingAllowed: true as unknown as false }) },
    // 15. redactedInputForwardingExecuted true
    { label: "redactedInputForwardingExecuted=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, redactedInputForwardingExecuted: true as unknown as false }) },
    // 16. realInputProcessedByContract true
    { label: "realInputProcessedByContract=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, realInputProcessedByContract: true as unknown as false }) },
    // 17. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 18. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 19. modelOutputStored true
    { label: "modelOutputStored=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 20. userVisibleOutputAllowed true
    { label: "userVisibleOutputAllowed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, userVisibleOutputAllowed: true as unknown as false }) },
    // 21. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 22. publicBranchCCalled true
    { label: "publicBranchCCalled=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, publicBranchCCalled: true as unknown as false }) },
    // 23. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 24. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorForwardingAcknowledgment: "partial only" }) },
    // 25. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerForwardingAcknowledgment: "partial only" }) },
    // 26. containsSecret true
    { label: "containsSecret=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 27. containsEnvValue true
    { label: "containsEnvValue=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 28. containsApiKey true
    { label: "containsApiKey=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 29. containsRawInputText true
    { label: "containsRawInputText=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 30. containsRedactedText true
    { label: "containsRedactedText=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 31. containsModelOutput true
    { label: "containsModelOutput=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 32. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 33. containsUserPii true
    { label: "containsUserPii=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 34. notes includes "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 35. notes includes "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 36. notes includes "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 37. notes includes "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 38. notes includes "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 39. notes includes "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 40. notes includes "john@example.com"
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 41. notes includes "+49 170 1234567"
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 42. notes includes "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 43. notes includes "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 44. notes includes "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 45. notes includes "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 46. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 47. persistenceUsed true
    { label: "persistenceUsed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 48. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 49. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 50. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 51. emittedToUserNow true
    { label: "emittedToUserNow=true", result: validateRedactedInputForwardingContractInput({ ...syntheticInput, emittedToUserNow: true as unknown as false }) },
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
    liveLlmBoundaryReady &&
    syntheticRedactedInputForwardingAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3C",
    allPassed,
    liveLlmBoundaryReady,
    syntheticRedactedInputForwardingAccepted,
    tamperCasesRejected,

    readyForAiOutputGovernanceRecheckContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    rawInputForwardingAllowed: false,
    redactedInputForwardingExecuted: false,
    realInputProcessed: false,
    liveLLMCalled: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    neverUserVisible: true,
    notes,
  };
}
