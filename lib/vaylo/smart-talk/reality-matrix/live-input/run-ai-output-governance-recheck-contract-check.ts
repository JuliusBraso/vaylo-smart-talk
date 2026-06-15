/**
 * AI Output Governance Recheck Contract Check (Phase 8.3D).
 *
 * Validates the AI Output Governance Recheck Contract input and produces an
 * `AiOutputGovernanceRecheckContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runRedactedInputForwardingContractCheck() (8.3C) and verify all
 *      prerequisite invariants.
 *   2. Build a synthetic safe recheck input and validate it (must be accepted).
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
 *   from this governance contract (established in 8.3B, preserved in 8.3C/8.3D).
 *   `runSmartTalkCalledOrImported`, `publicBranchCCalled`, and
 *   `extractTextFromImageCalledOrImported` are always literal `false`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM or make HTTP requests
 * - generate AI output
 * - store model output
 * - forward any actual input (raw or redacted) to a live model
 * - authorize user-visible output
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runAiOutputGovernanceRecheckContractCheck()` explicitly.
 */

import { runRedactedInputForwardingContractCheck } from "./run-redacted-input-forwarding-contract-check";
import {
  ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS,
  BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE,
  FORBIDDEN_AI_OUTPUT_GOVERNANCE_RECHECK_STRINGS,
  REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST,
  REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS,
  REQUIRED_AI_OUTPUT_RECHECK_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES,
} from "./ai-output-governance-recheck-contract-types";
import type {
  AiOutputClaimCategoryBlockedWithoutEvidence,
  AiOutputGovernanceChecklistItem,
  AiOutputGovernanceRecheckContractCheckResult,
  AiOutputGovernanceRecheckContractInput,
  AiOutputGovernanceRecheckContractResult,
  AiOutputGovernanceRecheckRejectionReason,
  AiOutputGovernanceRecheckRequirement,
  AiOutputTrustBoundary,
} from "./ai-output-governance-recheck-contract-types";

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

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_AI_OUTPUT_GOVERNANCE_RECHECK_STRINGS.some((f) =>
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
  list: AiOutputGovernanceRecheckRejectionReason[],
  reason: AiOutputGovernanceRecheckRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `AiOutputGovernanceRecheckContractInput` for use
 * in the harness check. No AI output is generated. No live LLM is called.
 * No existing runtime path is touched.
 */
export function buildSyntheticAiOutputGovernanceRecheckContractInput(): AiOutputGovernanceRecheckContractInput {
  const ackStatements =
    REQUIRED_AI_OUTPUT_RECHECK_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "ai-output-governance-recheck-contract-8-3d",
    epochId: "8.3D",
    previousPhaseId: "8.3C",

    redactedInputForwardingReady: true,

    trustBoundaries: [...REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES],
    recheckRequirements: [
      ...REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS,
    ],
    blockedClaimCategories: [
      ...BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE,
    ],
    allowedPostRecheckDispositions: [
      ...ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS,
    ],
    checklistConfirmed: [...REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST],

    governanceRecheckRequired: true,
    manualReviewRequiredBeforeUserVisibleOutput: true,
    uncertaintyPreservationRequired: true,
    partialInputLimitationRequired: true,
    legalCertaintyWithoutEvidenceAllowed: false,
    deadlineClaimWithoutEvidenceAllowed: false,

    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    liveLLMCallPerformed: false,
    realInputProcessedByContract: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    operatorRecheckAcknowledgment: ackStatements,
    reviewerRecheckAcknowledgment: ackStatements,
    notes: [
      "synthetic safe ai output governance recheck contract without ai output",
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
    emittedToUserNow: false,

    neverUserVisible: true,
  };
}

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `AiOutputGovernanceRecheckContractInput` and returns a typed
 * `AiOutputGovernanceRecheckContractResult`.
 */
export function validateAiOutputGovernanceRecheckContractInput(
  input: AiOutputGovernanceRecheckContractInput,
): AiOutputGovernanceRecheckContractResult {
  const reasons: AiOutputGovernanceRecheckRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: redactedInputForwardingReady ──────────────────────────────────
  if (!input.redactedInputForwardingReady) {
    addReason(reasons, "redacted_input_forwarding_not_ready");
  }

  // ── Rule 2: trust boundaries ──────────────────────────────────────────────
  for (const boundary of REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES) {
    if (!input.trustBoundaries.includes(boundary)) {
      addReason(reasons, "missing_trust_boundary");
      break;
    }
  }

  // ── Rule 3: recheck requirements ──────────────────────────────────────────
  for (const req of REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS) {
    if (!input.recheckRequirements.includes(req)) {
      addReason(reasons, "missing_recheck_requirement");
      break;
    }
  }

  // ── Rule 4: blocked claim categories ─────────────────────────────────────
  for (const cat of BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE) {
    if (!input.blockedClaimCategories.includes(cat)) {
      addReason(reasons, "missing_blocked_claim_category");
      break;
    }
  }

  // ── Rule 5: allowed post-recheck dispositions ─────────────────────────────
  for (const disp of ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS) {
    if (!input.allowedPostRecheckDispositions.includes(disp)) {
      addReason(reasons, "missing_allowed_disposition");
      break;
    }
  }

  // ── Rule 6: checklist items ───────────────────────────────────────────────
  for (const item of REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 7: governanceRecheckRequired ─────────────────────────────────────
  if (inputRec["governanceRecheckRequired"] !== true) {
    addReason(reasons, "governance_recheck_missing");
  }

  // ── Rule 8: manualReviewRequiredBeforeUserVisibleOutput ───────────────────
  if (inputRec["manualReviewRequiredBeforeUserVisibleOutput"] !== true) {
    addReason(reasons, "manual_review_missing");
  }

  // ── Rule 9: uncertaintyPreservationRequired ───────────────────────────────
  if (inputRec["uncertaintyPreservationRequired"] !== true) {
    addReason(reasons, "uncertainty_preservation_missing");
  }

  // ── Rule 10: partialInputLimitationRequired ───────────────────────────────
  if (inputRec["partialInputLimitationRequired"] !== true) {
    addReason(reasons, "partial_input_limitation_missing");
  }

  // ── Rule 11: legalCertaintyWithoutEvidenceAllowed ─────────────────────────
  if (inputRec["legalCertaintyWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "legal_certainty_allowed_without_evidence");
  }

  // ── Rule 12: deadlineClaimWithoutEvidenceAllowed ──────────────────────────
  if (inputRec["deadlineClaimWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "deadline_claim_allowed_without_evidence");
  }

  // ── Rule 13: execution/output/forwarding safety flags ────────────────────
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
  }
  if (
    inputRec["userVisibleOutputAllowed"] === true ||
    inputRec["emittedToUserNow"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
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

  // ── Rule 14: existing runtime isolation ───────────────────────────────────
  if (inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "run_smart_talk_call_claim_detected");
  }
  if (inputRec["publicBranchCCalled"] === true) {
    addReason(reasons, "public_branch_c_call_claim_detected");
  }
  if (inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "ocr_runtime_call_claim_detected");
  }

  // ── Rule 15: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_AI_OUTPUT_RECHECK_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorRecheckAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }
  for (const stmt of REQUIRED_AI_OUTPUT_RECHECK_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerRecheckAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 16: contains* content flags ─────────────────────────────────────
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

  // ── Rule 17: persistence safety flags ────────────────────────────────────
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rules 18–21: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorRecheckAcknowledgment,
    input.reviewerRecheckAcknowledgment,
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
      const uncategorised = FORBIDDEN_AI_OUTPUT_GOVERNANCE_RECHECK_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsRedactedTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsUnsafeCertaintyPhrase(s) &&
          !containsUnsafeMarker(s),
      );
      if (uncategorised) addReason(reasons, "unsafe_recheck_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_recheck_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3D",
    status,
    accepted,
    rejectionReasons: reasons,

    safeRecheckMetadata: {
      trustBoundaryCount: input.trustBoundaries.length,
      recheckRequirementCount: input.recheckRequirements.length,
      blockedClaimCategoryCount: input.blockedClaimCategories.length,
      allowedDispositionCount: input.allowedPostRecheckDispositions.length,
      checklistPassedCount: input.checklistConfirmed.length,
    },

    readyForManualReviewBeforeUserVisibleOutputContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    dnaSavePerformed: false,
    offlineSavePerformed: false,
    publicRuntimeEnabled: false,
    emittedToUserNow: false,

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByRecheckContract: false,
    existingRuntimeModifiedByRecheckContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByRecheckContract: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the AI Output Governance Recheck Contract check for Phase 8.3D.
 *
 * Calls `runRedactedInputForwardingContractCheck()` (8.3C), validates a
 * synthetic safe recheck input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT generate AI output.
 * Does NOT store model output. Does NOT authorize user-visible output.
 * Does NOT modify DB/storage.
 */
export function runAiOutputGovernanceRecheckContractCheck(): AiOutputGovernanceRecheckContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3C redacted input forwarding contract ───────────────

  const forwardingCheck = runRedactedInputForwardingContractCheck();
  const fcRec = asRec(forwardingCheck);

  const redactedInputForwardingReady =
    forwardingCheck.allPassed === true &&
    fcRec["readyForAiOutputGovernanceRecheckContract"] === true &&
    fcRec["readyForLiveLLMRuntime"] !== true &&
    fcRec["readyForConnectedAiRuntimeExecution"] !== true &&
    fcRec["readyForRealOperatorPilotRun"] !== true &&
    fcRec["readyForPilotRunNow"] !== true &&
    fcRec["readyForPublicLaunch"] !== true &&
    fcRec["readyForPersistence"] !== true &&
    fcRec["rawInputForwardingAllowed"] !== true &&
    fcRec["redactedInputForwardingExecuted"] !== true &&
    fcRec["realInputProcessed"] !== true &&
    fcRec["liveLLMCalled"] !== true &&
    fcRec["aiOutputGenerated"] !== true &&
    fcRec["modelOutputStored"] !== true &&
    fcRec["persistenceUsed"] !== true &&
    fcRec["publicRuntimeEnabled"] !== true &&
    fcRec["emittedToUserNow"] !== true &&
    fcRec["runSmartTalkCalledOrImported"] !== true &&
    fcRec["publicBranchCCalled"] !== true &&
    fcRec["extractTextFromImageCalledOrImported"] !== true &&
    fcRec["neverUserVisible"] === true;

  notes.push(
    `redactedInputForwardingReady: ${String(redactedInputForwardingReady)}`,
  );
  notes.push(
    `forwardingCheck.allPassed: ${String(forwardingCheck.allPassed)}`,
  );
  notes.push(
    `readyForAiOutputGovernanceRecheckContract: ${String(fcRec["readyForAiOutputGovernanceRecheckContract"])}`,
  );

  // ── Step 2: Validate the synthetic recheck input ──────────────────────────

  const syntheticInput =
    buildSyntheticAiOutputGovernanceRecheckContractInput();
  const syntheticResult =
    validateAiOutputGovernanceRecheckContractInput(syntheticInput);
  const syntheticAiOutputGovernanceRecheckAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticAiOutputGovernanceRecheckAccepted: ${String(syntheticAiOutputGovernanceRecheckAccepted)}`,
  );
  if (!syntheticAiOutputGovernanceRecheckAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof AiOutputGovernanceRecheckContractInput]: AiOutputGovernanceRecheckContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): AiOutputGovernanceRecheckContractResult {
    return validateAiOutputGovernanceRecheckContractInput({
      ...syntheticInput,
      ...overrides,
    } as AiOutputGovernanceRecheckContractInput);
  }

  const partialTrustBoundaries = REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES.slice(
    0,
    REQUIRED_AI_OUTPUT_TRUST_BOUNDARIES.length - 1,
  ) as unknown as AiOutputTrustBoundary[];
  const partialRecheckReqs =
    REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS.slice(
      0,
      REQUIRED_AI_OUTPUT_GOVERNANCE_RECHECK_REQUIREMENTS.length - 1,
    ) as unknown as AiOutputGovernanceRecheckRequirement[];
  const partialBlockedClaims =
    BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE.slice(
      0,
      BLOCKED_AI_OUTPUT_CLAIM_CATEGORIES_WITHOUT_EVIDENCE.length - 1,
    ) as unknown as AiOutputClaimCategoryBlockedWithoutEvidence[];
  const partialDispositions =
    ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS.slice(
      0,
      ALLOWED_AI_OUTPUT_POST_RECHECK_DISPOSITIONS.length - 1,
    );
  const partialChecklist = REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST.slice(
    0,
    REQUIRED_AI_OUTPUT_GOVERNANCE_CHECKLIST.length - 1,
  ) as unknown as AiOutputGovernanceChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: AiOutputGovernanceRecheckContractResult;
  }> = [
    // 1. redactedInputForwardingReady false
    { label: "redactedInputForwardingReady=false", result: tamper({ redactedInputForwardingReady: false }) },
    // 2. missing trust boundary
    { label: "missing trust boundary", result: tamper({ trustBoundaries: partialTrustBoundaries }) },
    // 3. missing recheck requirement
    { label: "missing recheck requirement", result: tamper({ recheckRequirements: partialRecheckReqs }) },
    // 4. missing blocked claim category
    { label: "missing blocked claim category", result: tamper({ blockedClaimCategories: partialBlockedClaims }) },
    // 5. missing allowed disposition
    { label: "missing allowed disposition", result: tamper({ allowedPostRecheckDispositions: partialDispositions }) },
    // 6. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 7. governanceRecheckRequired false
    { label: "governanceRecheckRequired=false", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, governanceRecheckRequired: false as unknown as true }) },
    // 8. manualReviewRequiredBeforeUserVisibleOutput false
    { label: "manualReviewRequiredBeforeUserVisibleOutput=false", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, manualReviewRequiredBeforeUserVisibleOutput: false as unknown as true }) },
    // 9. uncertaintyPreservationRequired false
    { label: "uncertaintyPreservationRequired=false", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, uncertaintyPreservationRequired: false as unknown as true }) },
    // 10. partialInputLimitationRequired false
    { label: "partialInputLimitationRequired=false", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, partialInputLimitationRequired: false as unknown as true }) },
    // 11. legalCertaintyWithoutEvidenceAllowed true
    { label: "legalCertaintyWithoutEvidenceAllowed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, legalCertaintyWithoutEvidenceAllowed: true as unknown as false }) },
    // 12. deadlineClaimWithoutEvidenceAllowed true
    { label: "deadlineClaimWithoutEvidenceAllowed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, deadlineClaimWithoutEvidenceAllowed: true as unknown as false }) },
    // 13. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 14. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 15. modelOutputStored true
    { label: "modelOutputStored=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 16. userVisibleOutputAllowed true
    { label: "userVisibleOutputAllowed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, userVisibleOutputAllowed: true as unknown as false }) },
    // 17. persistenceUsed true
    { label: "persistenceUsed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 18. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 19. realInputProcessedByContract true
    { label: "realInputProcessedByContract=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, realInputProcessedByContract: true as unknown as false }) },
    // 20. rawInputForwarded true
    { label: "rawInputForwarded=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, rawInputForwarded: true as unknown as false }) },
    // 21. redactedInputForwardingExecuted true
    { label: "redactedInputForwardingExecuted=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, redactedInputForwardingExecuted: true as unknown as false }) },
    // 22. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 23. publicBranchCCalled true
    { label: "publicBranchCCalled=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, publicBranchCCalled: true as unknown as false }) },
    // 24. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 25. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorRecheckAcknowledgment: "partial only" }) },
    // 26. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerRecheckAcknowledgment: "partial only" }) },
    // 27. containsSecret true
    { label: "containsSecret=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 28. containsEnvValue true
    { label: "containsEnvValue=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 29. containsApiKey true
    { label: "containsApiKey=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 30. containsRawInputText true
    { label: "containsRawInputText=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 31. containsRedactedText true
    { label: "containsRedactedText=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 32. containsModelOutput true
    { label: "containsModelOutput=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 33. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 34. containsUserPii true
    { label: "containsUserPii=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 35. notes includes "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 36. notes includes "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 37. notes includes "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 38. notes includes "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 39. notes includes "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 40. notes includes "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 41. notes includes "john@example.com"
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 42. notes includes "+49 170 1234567"
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 43. notes includes "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 44. notes includes "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 45. notes includes "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 46. notes includes "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 47. notes includes "Sie müssen"
    { label: 'notes: "Sie müssen"', result: tamper({ notes: ["Sie müssen sofort handeln"] }) },
    // 48. notes includes "garantiert"
    { label: 'notes: "garantiert"', result: tamper({ notes: ["Das ist garantiert richtig"] }) },
    // 49. notes includes "fristlos sicher"
    { label: 'notes: "fristlos sicher"', result: tamper({ notes: ["fristlos sicher"] }) },
    // 50. notes includes "rechtlich sicher"
    { label: 'notes: "rechtlich sicher"', result: tamper({ notes: ["rechtlich sicher"] }) },
    // 51. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 52. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 53. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 54. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
    // 55. emittedToUserNow true
    { label: "emittedToUserNow=true", result: validateAiOutputGovernanceRecheckContractInput({ ...syntheticInput, emittedToUserNow: true as unknown as false }) },
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
    redactedInputForwardingReady &&
    syntheticAiOutputGovernanceRecheckAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3D",
    allPassed,
    redactedInputForwardingReady,
    syntheticAiOutputGovernanceRecheckAccepted,
    tamperCasesRejected,

    readyForManualReviewBeforeUserVisibleOutputContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    userVisibleOutputAllowed: false,
    persistenceUsed: false,
    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    publicRuntimeEnabled: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
