/**
 * Manual Review Before User-Visible Output Contract Check (Phase 8.3E).
 *
 * Validates the Manual Review Before User-Visible Output Contract input and
 * produces a `ManualReviewBeforeUserVisibleOutputContractCheckResult`.
 *
 * Sub-steps:
 *   1. Call runAiOutputGovernanceRecheckContractCheck() (8.3D) and verify all
 *      prerequisite invariants.
 *   2. Build a synthetic safe manual review input and validate it (must be
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
 * - authorize user-visible output or emit user-visible output
 * - forward any actual input to a live model
 * - persist any records or store user content
 * - modify DB/storage schema or API routes
 * - execute manual review
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runManualReviewBeforeUserVisibleOutputContractCheck()` explicitly.
 */

import { runAiOutputGovernanceRecheckContractCheck } from "./run-ai-output-governance-recheck-contract-check";
import {
  ALLOWED_MANUAL_REVIEWER_ROLES,
  FORBIDDEN_MANUAL_REVIEW_BEFORE_USER_VISIBLE_OUTPUT_STRINGS,
  REQUIRED_MANUAL_REVIEW_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS,
  REQUIRED_MANUAL_REVIEW_CHECKLIST,
  REQUIRED_MANUAL_REVIEW_DISPOSITIONS,
  REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA,
  REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS,
} from "./manual-review-before-user-visible-output-contract-types";
import type {
  ManualReviewBeforeUserVisibleOutputContractCheckResult,
  ManualReviewBeforeUserVisibleOutputContractInput,
  ManualReviewBeforeUserVisibleOutputContractResult,
  ManualReviewBeforeUserVisibleOutputRejectionReason,
  ManualReviewBlockCondition,
  ManualReviewChecklistItem,
  ManualReviewIdentityRequirement,
  ManualReviewRequiredEvidenceMetadata,
} from "./manual-review-before-user-visible-output-contract-types";

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
const UNSAFE_APPROVAL_PHRASES = [
  "approved for user display",
  "auto-approved",
  "show to user now",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_MANUAL_REVIEW_BEFORE_USER_VISIBLE_OUTPUT_STRINGS.some((f) =>
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

function containsUnsafeApprovalPhrase(value: string): boolean {
  return UNSAFE_APPROVAL_PHRASES.some((p) => value.includes(p));
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
  list: ManualReviewBeforeUserVisibleOutputRejectionReason[],
  reason: ManualReviewBeforeUserVisibleOutputRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ──────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `ManualReviewBeforeUserVisibleOutputContractInput`
 * for use in the harness check. No AI output is generated. No live LLM is
 * called. No output is authorized. No existing runtime path is touched.
 */
export function buildSyntheticManualReviewBeforeUserVisibleOutputContractInput(): ManualReviewBeforeUserVisibleOutputContractInput {
  const ackStatements =
    REQUIRED_MANUAL_REVIEW_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "manual-review-before-user-visible-output-contract-8-3e",
    epochId: "8.3E",
    previousPhaseId: "8.3D",

    aiOutputGovernanceRecheckReady: true,

    identityRequirements: [...REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS],
    allowedReviewerRoles: [...ALLOWED_MANUAL_REVIEWER_ROLES],
    dispositionOptions: [...REQUIRED_MANUAL_REVIEW_DISPOSITIONS],
    requiredEvidenceMetadata: [...REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA],
    blockConditions: [...REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS],
    checklistConfirmed: [...REQUIRED_MANUAL_REVIEW_CHECKLIST],

    operatorIdentityPresent: true,
    reviewerIdentityPresent: true,
    reviewerRolePresent: true,
    reviewerResponsibilityAcknowledged: true,
    automaticSystemApprovalAllowed: false,
    anonymousReviewAllowed: false,

    selectedDisposition: "candidate_safe_for_user_visible_authorization_contract",
    selectedDispositionAllowsUserVisibleOutputNow: false,
    userVisibleOutputAuthorizationRequiredNext: true,

    governanceRecheckResultPresent: true,
    evidenceMetadataOnly: true,
    contentStorageAllowed: false,

    legalCertaintyWithoutEvidenceAllowed: false,
    deadlineClaimWithoutEvidenceAllowed: false,
    unsupportedClaimAllowed: false,
    unsafeCertaintyAllowed: false,
    missingContextAllowed: false,
    partialInputLimitationRequired: true,

    userVisibleOutputAuthorized: false,
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

    operatorManualReviewAcknowledgment: ackStatements,
    reviewerManualReviewAcknowledgment: ackStatements,
    notes: [
      "synthetic safe manual review contract without user-visible output",
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
 * Validates a `ManualReviewBeforeUserVisibleOutputContractInput` and returns a
 * typed `ManualReviewBeforeUserVisibleOutputContractResult`.
 */
export function validateManualReviewBeforeUserVisibleOutputContractInput(
  input: ManualReviewBeforeUserVisibleOutputContractInput,
): ManualReviewBeforeUserVisibleOutputContractResult {
  const reasons: ManualReviewBeforeUserVisibleOutputRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: aiOutputGovernanceRecheckReady ────────────────────────────────
  if (!input.aiOutputGovernanceRecheckReady) {
    addReason(reasons, "ai_output_governance_recheck_not_ready");
  }

  // ── Rule 2: identity requirements ────────────────────────────────────────
  for (const req of REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS) {
    if (!input.identityRequirements.includes(req)) {
      addReason(reasons, "missing_identity_requirement");
      break;
    }
  }

  // ── Rule 3: reviewer roles ────────────────────────────────────────────────
  for (const role of ALLOWED_MANUAL_REVIEWER_ROLES) {
    if (!input.allowedReviewerRoles.includes(role)) {
      addReason(reasons, "missing_identity_requirement");
      break;
    }
  }

  // ── Rule 4: disposition options ───────────────────────────────────────────
  for (const disp of REQUIRED_MANUAL_REVIEW_DISPOSITIONS) {
    if (!input.dispositionOptions.includes(disp)) {
      addReason(reasons, "missing_disposition");
      break;
    }
  }

  // ── Rule 5: evidence metadata ─────────────────────────────────────────────
  for (const meta of REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA) {
    if (!input.requiredEvidenceMetadata.includes(meta)) {
      addReason(reasons, "missing_required_evidence_metadata");
      break;
    }
  }

  // ── Rule 6: block conditions ──────────────────────────────────────────────
  for (const bc of REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS) {
    if (!input.blockConditions.includes(bc)) {
      addReason(reasons, "missing_block_condition");
      break;
    }
  }

  // ── Rule 7: checklist ─────────────────────────────────────────────────────
  for (const item of REQUIRED_MANUAL_REVIEW_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 8: identity presence flags ──────────────────────────────────────
  if (inputRec["operatorIdentityPresent"] !== true) {
    addReason(reasons, "missing_identity_requirement");
  }
  if (inputRec["reviewerIdentityPresent"] !== true) {
    addReason(reasons, "missing_identity_requirement");
  }
  if (inputRec["reviewerRolePresent"] !== true) {
    addReason(reasons, "missing_identity_requirement");
  }
  if (inputRec["reviewerResponsibilityAcknowledged"] !== true) {
    addReason(reasons, "reviewer_responsibility_missing");
  }

  // ── Rule 9: automatic approval / anonymous review ─────────────────────────
  if (inputRec["automaticSystemApprovalAllowed"] === true) {
    addReason(reasons, "automatic_system_approval_detected");
  }
  if (inputRec["anonymousReviewAllowed"] === true) {
    addReason(reasons, "anonymous_review_detected");
  }

  // ── Rule 10: selected disposition ────────────────────────────────────────
  if (!REQUIRED_MANUAL_REVIEW_DISPOSITIONS.includes(input.selectedDisposition)) {
    addReason(reasons, "missing_disposition");
  }

  // ── Rule 11: selectedDispositionAllowsUserVisibleOutputNow ───────────────
  if (inputRec["selectedDispositionAllowsUserVisibleOutputNow"] === true) {
    addReason(reasons, "unsafe_disposition_detected");
  }

  // ── Rule 12: userVisibleOutputAuthorizationRequiredNext ───────────────────
  if (inputRec["userVisibleOutputAuthorizationRequiredNext"] !== true) {
    addReason(reasons, "unsafe_disposition_detected");
  }

  // ── Rule 13: governanceRecheckResultPresent ───────────────────────────────
  if (inputRec["governanceRecheckResultPresent"] !== true) {
    addReason(reasons, "missing_required_evidence_metadata");
  }

  // ── Rule 14: evidenceMetadataOnly ────────────────────────────────────────
  if (inputRec["evidenceMetadataOnly"] !== true) {
    addReason(reasons, "missing_required_evidence_metadata");
  }

  // ── Rule 15: contentStorageAllowed ───────────────────────────────────────
  if (inputRec["contentStorageAllowed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }

  // ── Rule 16: evidence safety flags ───────────────────────────────────────
  if (inputRec["legalCertaintyWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "legal_certainty_allowed_without_evidence");
  }
  if (inputRec["deadlineClaimWithoutEvidenceAllowed"] === true) {
    addReason(reasons, "deadline_claim_allowed_without_evidence");
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

  // ── Rule 17: partialInputLimitationRequired ───────────────────────────────
  if (inputRec["partialInputLimitationRequired"] !== true) {
    addReason(reasons, "partial_input_limitation_missing");
  }

  // ── Rule 18: user-visible output flags ───────────────────────────────────
  if (inputRec["userVisibleOutputAuthorized"] === true) {
    addReason(reasons, "user_visible_output_authorized_too_early");
  }
  if (inputRec["emittedToUserNow"] === true) {
    addReason(reasons, "emitted_to_user_claim_detected");
  }

  // ── Rule 19: execution/AI-output/forwarding flags ─────────────────────────
  if (
    inputRec["aiOutputGenerationPerformed"] === true ||
    inputRec["aiOutputGenerated"] === true
  ) {
    addReason(reasons, "ai_output_generation_claim_detected");
  }
  if (inputRec["modelOutputStored"] === true) {
    addReason(reasons, "model_output_storage_claim_detected");
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

  // ── Rule 20: existing runtime isolation ───────────────────────────────────
  if (inputRec["runSmartTalkCalledOrImported"] === true) {
    addReason(reasons, "run_smart_talk_call_claim_detected");
  }
  if (inputRec["publicBranchCCalled"] === true) {
    addReason(reasons, "public_branch_c_call_claim_detected");
  }
  if (inputRec["extractTextFromImageCalledOrImported"] === true) {
    addReason(reasons, "ocr_runtime_call_claim_detected");
  }

  // ── Rule 21: acknowledgments ──────────────────────────────────────────────
  for (const stmt of REQUIRED_MANUAL_REVIEW_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorManualReviewAcknowledgment.includes(stmt)) {
      addReason(reasons, "reviewer_acknowledgment_missing");
      break;
    }
  }
  for (const stmt of REQUIRED_MANUAL_REVIEW_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerManualReviewAcknowledgment.includes(stmt)) {
      addReason(reasons, "reviewer_acknowledgment_missing");
      break;
    }
  }

  // ── Rule 22: contains* content flags ─────────────────────────────────────
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

  // ── Rule 23: persistence flags ────────────────────────────────────────────
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "emitted_to_user_claim_detected");
  }

  // ── Rules 24–27: scan string fields ──────────────────────────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.operatorManualReviewAcknowledgment,
    input.reviewerManualReviewAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) addReason(reasons, "forbidden_secret_detected");
      if (containsEnvAssignmentLike(s)) addReason(reasons, "forbidden_env_value_detected");
      if (containsRawTextMarker(s)) addReason(reasons, "forbidden_raw_text_detected");
      if (containsRedactedTextMarker(s)) addReason(reasons, "forbidden_redacted_text_detected");
      if (containsModelOutputMarker(s)) addReason(reasons, "forbidden_model_output_detected");
      if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_manual_review_note_detected");
      if (containsUnsafeApprovalPhrase(s)) addReason(reasons, "unsafe_manual_review_note_detected");
      const uncategorised =
        FORBIDDEN_MANUAL_REVIEW_BEFORE_USER_VISIBLE_OUTPUT_STRINGS.some(
          (f) =>
            s.includes(f) &&
            !containsSecretLike(s) &&
            !containsEnvAssignmentLike(s) &&
            !containsRawTextMarker(s) &&
            !containsRedactedTextMarker(s) &&
            !containsModelOutputMarker(s) &&
            !containsUnsafeCertaintyPhrase(s) &&
            !containsUnsafeApprovalPhrase(s) &&
            !containsUnsafeMarker(s),
        );
      if (uncategorised) addReason(reasons, "unsafe_manual_review_note_detected");
    }
    if (containsPiiPattern(s)) addReason(reasons, "forbidden_pii_detected");
    if (containsUnsafeMarker(s)) addReason(reasons, "forbidden_document_content_detected");
    if (containsUnsafeCertaintyPhrase(s)) addReason(reasons, "unsafe_manual_review_note_detected");
    if (containsUnsafeApprovalPhrase(s)) addReason(reasons, "unsafe_manual_review_note_detected");
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    epochId: "8.3E",
    status,
    accepted,
    rejectionReasons: reasons,

    safeManualReviewMetadata: {
      identityRequirementCount: input.identityRequirements.length,
      allowedReviewerRoleCount: input.allowedReviewerRoles.length,
      dispositionOptionCount: input.dispositionOptions.length,
      evidenceMetadataRequirementCount: input.requiredEvidenceMetadata.length,
      blockConditionCount: input.blockConditions.length,
      checklistPassedCount: input.checklistConfirmed.length,
      selectedDisposition: input.selectedDisposition,
    },

    readyForUserVisibleOutputAuthorizationContract: accepted,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    userVisibleOutputAuthorized: false,
    emittedToUserNow: false,
    aiOutputGenerationPerformed: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
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

    httpCallMade: false,
    apiRouteCalled: false,
    apiRouteModifiedByManualReviewContract: false,
    existingRuntimeModifiedByManualReviewContract: false,
    uiTouched: false,
    databaseOrStorageModifiedByManualReviewContract: false,
    neverUserVisible: true,
  };
}

// ── Contract check ────────────────────────────────────────────────────────────

/**
 * Runs the Manual Review Before User-Visible Output Contract check for Phase 8.3E.
 *
 * Calls `runAiOutputGovernanceRecheckContractCheck()` (8.3D), validates a
 * synthetic safe manual review input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT import, call, or wrap run-smart-talk.ts,
 * extract-text-from-image.ts, app/api/smart-talk/route.ts, or fetch().
 * Does NOT call any live LLM. Does NOT generate AI output.
 * Does NOT authorize or emit user-visible output.
 * Does NOT modify DB/storage.
 */
export function runManualReviewBeforeUserVisibleOutputContractCheck(): ManualReviewBeforeUserVisibleOutputContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify 8.3D AI output governance recheck contract ────────────

  const recheckResult = runAiOutputGovernanceRecheckContractCheck();
  const rcRec = asRec(recheckResult);

  const aiOutputGovernanceRecheckReady =
    recheckResult.allPassed === true &&
    rcRec["readyForManualReviewBeforeUserVisibleOutputContract"] === true &&
    rcRec["readyForLiveLLMRuntime"] !== true &&
    rcRec["readyForConnectedAiRuntimeExecution"] !== true &&
    rcRec["readyForRealOperatorPilotRun"] !== true &&
    rcRec["readyForPilotRunNow"] !== true &&
    rcRec["readyForPublicLaunch"] !== true &&
    rcRec["readyForPersistence"] !== true &&
    rcRec["aiOutputGenerationPerformed"] !== true &&
    rcRec["aiOutputGenerated"] !== true &&
    rcRec["modelOutputStored"] !== true &&
    rcRec["userVisibleOutputAllowed"] !== true &&
    rcRec["persistenceUsed"] !== true &&
    rcRec["liveLLMCalled"] !== true &&
    rcRec["realInputProcessed"] !== true &&
    rcRec["rawInputForwarded"] !== true &&
    rcRec["redactedInputForwardingExecuted"] !== true &&
    rcRec["runSmartTalkCalledOrImported"] !== true &&
    rcRec["publicBranchCCalled"] !== true &&
    rcRec["extractTextFromImageCalledOrImported"] !== true &&
    rcRec["publicRuntimeEnabled"] !== true &&
    rcRec["emittedToUserNow"] !== true &&
    rcRec["neverUserVisible"] === true;

  notes.push(
    `aiOutputGovernanceRecheckReady: ${String(aiOutputGovernanceRecheckReady)}`,
  );
  notes.push(
    `recheckResult.allPassed: ${String(recheckResult.allPassed)}`,
  );
  notes.push(
    `readyForManualReviewBeforeUserVisibleOutputContract: ${String(rcRec["readyForManualReviewBeforeUserVisibleOutputContract"])}`,
  );

  // ── Step 2: Validate the synthetic manual review input ────────────────────

  const syntheticInput =
    buildSyntheticManualReviewBeforeUserVisibleOutputContractInput();
  const syntheticResult =
    validateManualReviewBeforeUserVisibleOutputContractInput(syntheticInput);
  const syntheticManualReviewBeforeUserVisibleOutputAccepted =
    syntheticResult.accepted;

  notes.push(
    `syntheticManualReviewBeforeUserVisibleOutputAccepted: ${String(syntheticManualReviewBeforeUserVisibleOutputAccepted)}`,
  );
  if (!syntheticManualReviewBeforeUserVisibleOutputAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof ManualReviewBeforeUserVisibleOutputContractInput]: ManualReviewBeforeUserVisibleOutputContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): ManualReviewBeforeUserVisibleOutputContractResult {
    return validateManualReviewBeforeUserVisibleOutputContractInput({
      ...syntheticInput,
      ...overrides,
    } as ManualReviewBeforeUserVisibleOutputContractInput);
  }

  const partialIdentity =
    REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS.slice(
      0,
      REQUIRED_MANUAL_REVIEW_IDENTITY_REQUIREMENTS.length - 1,
    ) as unknown as ManualReviewIdentityRequirement[];
  const partialRoles = ALLOWED_MANUAL_REVIEWER_ROLES.slice(
    0,
    ALLOWED_MANUAL_REVIEWER_ROLES.length - 1,
  );
  const partialDispositions = REQUIRED_MANUAL_REVIEW_DISPOSITIONS.slice(
    0,
    REQUIRED_MANUAL_REVIEW_DISPOSITIONS.length - 1,
  );
  const partialEvidence =
    REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA.slice(
      0,
      REQUIRED_MANUAL_REVIEW_EVIDENCE_METADATA.length - 1,
    ) as unknown as ManualReviewRequiredEvidenceMetadata[];
  const partialBlock =
    REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS.slice(
      0,
      REQUIRED_MANUAL_REVIEW_BLOCK_CONDITIONS.length - 1,
    ) as unknown as ManualReviewBlockCondition[];
  const partialChecklist =
    REQUIRED_MANUAL_REVIEW_CHECKLIST.slice(
      0,
      REQUIRED_MANUAL_REVIEW_CHECKLIST.length - 1,
    ) as unknown as ManualReviewChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: ManualReviewBeforeUserVisibleOutputContractResult;
  }> = [
    // 1. aiOutputGovernanceRecheckReady false
    { label: "aiOutputGovernanceRecheckReady=false", result: tamper({ aiOutputGovernanceRecheckReady: false }) },
    // 2. missing identity requirement
    { label: "missing identity requirement", result: tamper({ identityRequirements: partialIdentity }) },
    // 3. missing reviewer role
    { label: "missing reviewer role", result: tamper({ allowedReviewerRoles: partialRoles }) },
    // 4. missing disposition option
    { label: "missing disposition option", result: tamper({ dispositionOptions: partialDispositions }) },
    // 5. missing evidence metadata
    { label: "missing evidence metadata", result: tamper({ requiredEvidenceMetadata: partialEvidence }) },
    // 6. missing block condition
    { label: "missing block condition", result: tamper({ blockConditions: partialBlock }) },
    // 7. missing checklist item
    { label: "missing checklist item", result: tamper({ checklistConfirmed: partialChecklist }) },
    // 8. operatorIdentityPresent false
    { label: "operatorIdentityPresent=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, operatorIdentityPresent: false as unknown as true }) },
    // 9. reviewerIdentityPresent false
    { label: "reviewerIdentityPresent=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, reviewerIdentityPresent: false as unknown as true }) },
    // 10. reviewerRolePresent false
    { label: "reviewerRolePresent=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, reviewerRolePresent: false as unknown as true }) },
    // 11. reviewerResponsibilityAcknowledged false
    { label: "reviewerResponsibilityAcknowledged=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, reviewerResponsibilityAcknowledged: false as unknown as true }) },
    // 12. automaticSystemApprovalAllowed true
    { label: "automaticSystemApprovalAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, automaticSystemApprovalAllowed: true as unknown as false }) },
    // 13. anonymousReviewAllowed true
    { label: "anonymousReviewAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, anonymousReviewAllowed: true as unknown as false }) },
    // 14. selectedDispositionAllowsUserVisibleOutputNow true
    { label: "selectedDispositionAllowsUserVisibleOutputNow=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, selectedDispositionAllowsUserVisibleOutputNow: true as unknown as false }) },
    // 15. userVisibleOutputAuthorizationRequiredNext false
    { label: "userVisibleOutputAuthorizationRequiredNext=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, userVisibleOutputAuthorizationRequiredNext: false as unknown as true }) },
    // 16. governanceRecheckResultPresent false
    { label: "governanceRecheckResultPresent=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, governanceRecheckResultPresent: false as unknown as true }) },
    // 17. evidenceMetadataOnly false
    { label: "evidenceMetadataOnly=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, evidenceMetadataOnly: false as unknown as true }) },
    // 18. contentStorageAllowed true
    { label: "contentStorageAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, contentStorageAllowed: true as unknown as false }) },
    // 19. legalCertaintyWithoutEvidenceAllowed true
    { label: "legalCertaintyWithoutEvidenceAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, legalCertaintyWithoutEvidenceAllowed: true as unknown as false }) },
    // 20. deadlineClaimWithoutEvidenceAllowed true
    { label: "deadlineClaimWithoutEvidenceAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, deadlineClaimWithoutEvidenceAllowed: true as unknown as false }) },
    // 21. unsupportedClaimAllowed true
    { label: "unsupportedClaimAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, unsupportedClaimAllowed: true as unknown as false }) },
    // 22. unsafeCertaintyAllowed true
    { label: "unsafeCertaintyAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, unsafeCertaintyAllowed: true as unknown as false }) },
    // 23. missingContextAllowed true
    { label: "missingContextAllowed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, missingContextAllowed: true as unknown as false }) },
    // 24. partialInputLimitationRequired false
    { label: "partialInputLimitationRequired=false", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, partialInputLimitationRequired: false as unknown as true }) },
    // 25. userVisibleOutputAuthorized true
    { label: "userVisibleOutputAuthorized=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, userVisibleOutputAuthorized: true as unknown as false }) },
    // 26. emittedToUserNow true
    { label: "emittedToUserNow=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, emittedToUserNow: true as unknown as false }) },
    // 27. aiOutputGenerationPerformed true
    { label: "aiOutputGenerationPerformed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, aiOutputGenerationPerformed: true as unknown as false }) },
    // 28. aiOutputGenerated true
    { label: "aiOutputGenerated=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, aiOutputGenerated: true as unknown as false }) },
    // 29. modelOutputStored true
    { label: "modelOutputStored=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, modelOutputStored: true as unknown as false }) },
    // 30. persistenceUsed true
    { label: "persistenceUsed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, persistenceUsed: true as unknown as false }) },
    // 31. liveLLMCallPerformed true
    { label: "liveLLMCallPerformed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, liveLLMCallPerformed: true as unknown as false }) },
    // 32. realInputProcessedByContract true
    { label: "realInputProcessedByContract=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, realInputProcessedByContract: true as unknown as false }) },
    // 33. rawInputForwarded true
    { label: "rawInputForwarded=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, rawInputForwarded: true as unknown as false }) },
    // 34. redactedInputForwardingExecuted true
    { label: "redactedInputForwardingExecuted=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, redactedInputForwardingExecuted: true as unknown as false }) },
    // 35. runSmartTalkCalledOrImported true
    { label: "runSmartTalkCalledOrImported=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, runSmartTalkCalledOrImported: true as unknown as false }) },
    // 36. publicBranchCCalled true
    { label: "publicBranchCCalled=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, publicBranchCCalled: true as unknown as false }) },
    // 37. extractTextFromImageCalledOrImported true
    { label: "extractTextFromImageCalledOrImported=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, extractTextFromImageCalledOrImported: true as unknown as false }) },
    // 38. missing operator acknowledgment
    { label: "missing operator acknowledgment", result: tamper({ operatorManualReviewAcknowledgment: "partial only" }) },
    // 39. missing reviewer acknowledgment
    { label: "missing reviewer acknowledgment", result: tamper({ reviewerManualReviewAcknowledgment: "partial only" }) },
    // 40. containsSecret true
    { label: "containsSecret=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsSecret: true as unknown as false }) },
    // 41. containsEnvValue true
    { label: "containsEnvValue=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsEnvValue: true as unknown as false }) },
    // 42. containsApiKey true
    { label: "containsApiKey=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsApiKey: true as unknown as false }) },
    // 43. containsRawInputText true
    { label: "containsRawInputText=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsRawInputText: true as unknown as false }) },
    // 44. containsRedactedText true
    { label: "containsRedactedText=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsRedactedText: true as unknown as false }) },
    // 45. containsModelOutput true
    { label: "containsModelOutput=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsModelOutput: true as unknown as false }) },
    // 46. containsDocumentContent true
    { label: "containsDocumentContent=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsDocumentContent: true as unknown as false }) },
    // 47. containsUserPii true
    { label: "containsUserPii=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsUserPii: true as unknown as false }) },
    // 48. notes includes "process.env"
    { label: 'notes: "process.env"', result: tamper({ notes: ["process.env here"] }) },
    // 49. notes includes "OPENAI_API_KEY="
    { label: 'notes: "OPENAI_API_KEY="', result: tamper({ notes: ["OPENAI_API_KEY=abc"] }) },
    // 50. notes includes "sk-"
    { label: 'notes: "sk-"', result: tamper({ notes: ["sk-supersecret"] }) },
    // 51. notes includes "stored user input"
    { label: 'notes: "stored user input"', result: tamper({ notes: ["stored user input"] }) },
    // 52. notes includes "stored redacted text"
    { label: 'notes: "stored redacted text"', result: tamper({ notes: ["stored redacted text"] }) },
    // 53. notes includes "stored model output"
    { label: 'notes: "stored model output"', result: tamper({ notes: ["stored model output"] }) },
    // 54. notes includes "john@example.com"
    { label: "notes: email", result: tamper({ notes: ["john@example.com"] }) },
    // 55. notes includes "+49 170 1234567"
    { label: "notes: phone", result: tamper({ notes: ["+49 170 1234567"] }) },
    // 56. notes includes "Aktenzeichen"
    { label: 'notes: "Aktenzeichen"', result: tamper({ notes: ["Aktenzeichen: 123"] }) },
    // 57. notes includes "Name:"
    { label: 'notes: "Name:"', result: tamper({ notes: ["Name: Max"] }) },
    // 58. notes includes "Geburtsdatum:"
    { label: 'notes: "Geburtsdatum:"', result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }) },
    // 59. notes includes "Abschiebung"
    { label: 'notes: "Abschiebung"', result: tamper({ notes: ["Abschiebung droht"] }) },
    // 60. notes includes "Sie müssen"
    { label: 'notes: "Sie müssen"', result: tamper({ notes: ["Sie müssen handeln"] }) },
    // 61. notes includes "garantiert"
    { label: 'notes: "garantiert"', result: tamper({ notes: ["Das ist garantiert"] }) },
    // 62. notes includes "fristlos sicher"
    { label: 'notes: "fristlos sicher"', result: tamper({ notes: ["fristlos sicher"] }) },
    // 63. notes includes "rechtlich sicher"
    { label: 'notes: "rechtlich sicher"', result: tamper({ notes: ["rechtlich sicher"] }) },
    // 64. notes includes "approved for user display"
    { label: 'notes: "approved for user display"', result: tamper({ notes: ["approved for user display"] }) },
    // 65. notes includes "auto-approved"
    { label: 'notes: "auto-approved"', result: tamper({ notes: ["auto-approved"] }) },
    // 66. notes includes "show to user now"
    { label: 'notes: "show to user now"', result: tamper({ notes: ["show to user now"] }) },
    // 67. containsRealUserInput true
    { label: "containsRealUserInput=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, containsRealUserInput: true as unknown as false }) },
    // 68. dnaSavePerformed true
    { label: "dnaSavePerformed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, dnaSavePerformed: true as unknown as false }) },
    // 69. offlineSavePerformed true
    { label: "offlineSavePerformed=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, offlineSavePerformed: true as unknown as false }) },
    // 70. publicRuntimeEnabled true
    { label: "publicRuntimeEnabled=true", result: validateManualReviewBeforeUserVisibleOutputContractInput({ ...syntheticInput, publicRuntimeEnabled: true as unknown as false }) },
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
    aiOutputGovernanceRecheckReady &&
    syntheticManualReviewBeforeUserVisibleOutputAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.3E",
    allPassed,
    aiOutputGovernanceRecheckReady,
    syntheticManualReviewBeforeUserVisibleOutputAccepted,
    tamperCasesRejected,

    readyForUserVisibleOutputAuthorizationContract: allPassed,

    readyForLiveLLMRuntime: false,
    readyForConnectedAiRuntimeExecution: false,
    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForPersistence: false,

    userVisibleOutputAuthorized: false,
    emittedToUserNow: false,
    aiOutputGenerated: false,
    modelOutputStored: false,
    persistenceUsed: false,
    liveLLMCalled: false,
    realInputProcessed: false,
    rawInputForwarded: false,
    redactedInputForwardingExecuted: false,

    runSmartTalkCalledOrImported: false,
    publicBranchCCalled: false,
    extractTextFromImageCalledOrImported: false,

    publicRuntimeEnabled: false,
    neverUserVisible: true,

    notes,
  };
}
