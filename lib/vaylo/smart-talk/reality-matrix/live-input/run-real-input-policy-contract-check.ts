/**
 * Real Input Policy Contract Check (Phase 8.2M-4).
 *
 * Validates typed real input policy contract inputs and produces a
 * `RealInputPolicyContractCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-3 abort protocol contract is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - read process.env
 * - process actual user input
 * - forward raw user input
 * - implement redaction logic
 * - modify runtime redaction or input routing behavior
 * - authorize or execute a real pilot run
 * - persist policy records
 * - store content (raw text, redacted text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runRealInputPolicyContractCheck()` explicitly.
 */

import { runAbortProtocolContractCheck } from "./run-abort-protocol-contract-check";
import {
  ALLOWED_REAL_INPUT_CATEGORIES,
  DISALLOWED_REAL_INPUT_CATEGORIES,
  FORBIDDEN_REAL_INPUT_POLICY_STRINGS,
  REQUIRED_REAL_INPUT_POLICY_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_REAL_INPUT_POLICY_CHECKLIST,
  REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS,
} from "./real-input-policy-contract-types";
import type {
  DisallowedRealInputCategory,
  RealInputClearanceLevel,
  RealInputPolicyChecklistItem,
  RealInputPolicyContractCheckResult,
  RealInputPolicyContractInput,
  RealInputPolicyContractResult,
  RealInputPolicyRejectionReason,
  RealInputRedactionRequirement,
} from "./real-input-policy-contract-types";

// ── Helpers ─────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_CLEARANCE_LEVELS: readonly RealInputClearanceLevel[] = [
  "policy_defined_only",
  "redacted_excerpt_ready_for_future_operator_review",
];

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;

const SECRET_LIKE_PATTERNS = ["secret", "token", "password"];

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
  return FORBIDDEN_REAL_INPUT_POLICY_STRINGS.some((f) => value.includes(f));
}

function containsSecretLike(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    value.includes("sk-") ||
    value.includes("apiKey") ||
    value.includes("internalSecret") ||
    SECRET_LIKE_PATTERNS.some((p) => lower.includes(p))
  );
}

function containsEnvAssignmentLike(value: string): boolean {
  return (
    value.includes("process.env") ||
    value.includes("OPENAI_API_KEY=") ||
    value.includes("VAYLO_INTERNAL_RUNTIME_SECRET=")
  );
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsSensitivePersonalMarker(value: string): boolean {
  return SENSITIVE_PERSONAL_MARKERS.some((m) => value.includes(m));
}

function containsHighRiskLegalMarker(value: string): boolean {
  return HIGH_RISK_LEGAL_MARKERS.some((m) => value.includes(m));
}

function containsAuthorityDocumentMarker(value: string): boolean {
  return AUTHORITY_DOCUMENT_MARKERS.some((m) => value.includes(m));
}

function containsRawTextMarker(value: string): boolean {
  return (
    value.includes("rawInputText") ||
    value.includes("fullDraftText") ||
    value.includes("SYNTHETIC_TEXT_NEVER_REAL_USER_DATA")
  );
}

function containsRedactedTextMarker(value: string): boolean {
  return value.includes("redactedText");
}

function containsModelOutputMarker(value: string): boolean {
  return value.includes("modelOutput");
}

function addReason(
  list: RealInputPolicyRejectionReason[],
  reason: RealInputPolicyRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ─────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `RealInputPolicyContractInput` for use in the
 * harness check. Contains no real input, no env values, no secrets, and no
 * sensitive content.
 */
export function buildSyntheticRealInputPolicyContractInput(): RealInputPolicyContractInput {
  const acknowledgmentStatements =
    REQUIRED_REAL_INPUT_POLICY_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "real-input-policy-contract-8-2m-4",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",

    abortProtocolReady: true,
    operatorHumanId: "operator-internal-001",
    reviewerHumanId: "reviewer-internal-001",

    allowedInputCategories: [...ALLOWED_REAL_INPUT_CATEGORIES],
    disallowedInputCategories: [...DISALLOWED_REAL_INPUT_CATEGORIES],
    redactionRequirements: [...REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_REAL_INPUT_POLICY_CHECKLIST],
    clearanceLevel: "policy_defined_only",

    rawInputForwardingAllowed: false,
    realInputProcessedByContract: false,
    redactionPolicyDefined: true,
    manualReviewClearanceRequired: true,
    completenessWarningRequired: true,
    legalDisclaimerRequired: true,
    highRiskInputsBlocked: true,

    operatorPolicyAcknowledgment: acknowledgmentStatements,
    reviewerPolicyAcknowledgment: acknowledgmentStatements,
    notes: ["synthetic safe real input policy attestation without real input"],

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
    publicRuntimeEnabled: false,
    liveLLMCalled: false,
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,

    neverUserVisible: true,
  };
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates a `RealInputPolicyContractInput` and returns a typed
 * `RealInputPolicyContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateRealInputPolicyContractInput(
  input: RealInputPolicyContractInput,
): RealInputPolicyContractResult {
  const reasons: RealInputPolicyRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: abortProtocolReady must be true ───────────────────────────────
  if (!input.abortProtocolReady) {
    addReason(reasons, "abort_protocol_not_ready");
  }

  // ── Rule 2: non-empty pilotSessionId ─────────────────────────────────────
  if (!input.pilotSessionId || input.pilotSessionId.trim() === "") {
    addReason(reasons, "missing_pilot_session_id");
  }

  // ── Rule 3: non-empty operatorHumanId ────────────────────────────────────
  if (!input.operatorHumanId || input.operatorHumanId.trim() === "") {
    addReason(reasons, "missing_operator_identity_reference");
  }

  // ── Rule 4: non-empty reviewerHumanId ────────────────────────────────────
  if (!input.reviewerHumanId || input.reviewerHumanId.trim() === "") {
    addReason(reasons, "missing_reviewer_identity_reference");
  }

  // ── Rule 5: all allowed input categories present ──────────────────────────
  for (const cat of ALLOWED_REAL_INPUT_CATEGORIES) {
    if (!input.allowedInputCategories.includes(cat)) {
      addReason(reasons, "missing_allowed_input_category");
      break;
    }
  }

  // ── Rule 6: all disallowed input categories present ───────────────────────
  for (const cat of DISALLOWED_REAL_INPUT_CATEGORIES) {
    if (!input.disallowedInputCategories.includes(cat)) {
      addReason(reasons, "missing_disallowed_input_category");
      break;
    }
  }

  // ── Rule 7: all redaction requirements present ────────────────────────────
  for (const req of REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS) {
    if (!input.redactionRequirements.includes(req)) {
      addReason(reasons, "missing_redaction_requirement");
      break;
    }
  }

  // ── Rule 8: all checklist items confirmed ─────────────────────────────────
  for (const item of REQUIRED_REAL_INPUT_POLICY_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 9: valid clearance level (no_clearance rejected) ─────────────────
  if (!VALID_CLEARANCE_LEVELS.includes(input.clearanceLevel)) {
    addReason(reasons, "invalid_clearance_level");
  }

  // ── Rule 10: rawInputForwardingAllowed must be false ──────────────────────
  if (inputRec["rawInputForwardingAllowed"] === true) {
    addReason(reasons, "raw_input_forwarding_claim_detected");
  }

  // ── Rule 11: realInputProcessedByContract / containsRealUserInput ─────────
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }

  // ── Rule 12: redactionPolicyDefined must be true ──────────────────────────
  if (inputRec["redactionPolicyDefined"] !== true) {
    addReason(reasons, "redaction_policy_uncertain");
  }

  // ── Rule 13: manualReviewClearanceRequired must be true ───────────────────
  if (inputRec["manualReviewClearanceRequired"] !== true) {
    addReason(reasons, "manual_review_clearance_missing");
  }

  // ── Rule 14: completenessWarningRequired must be true ─────────────────────
  if (inputRec["completenessWarningRequired"] !== true) {
    addReason(reasons, "completeness_warning_missing");
  }

  // ── Rule 15: legalDisclaimerRequired must be true ────────────────────────
  if (inputRec["legalDisclaimerRequired"] !== true) {
    addReason(reasons, "legal_disclaimer_missing");
  }

  // ── Rule 16: highRiskInputsBlocked must be true ───────────────────────────
  if (inputRec["highRiskInputsBlocked"] !== true) {
    addReason(reasons, "high_risk_input_allowed_without_block");
  }

  // ── Rule 17: operator and reviewer acknowledgments ────────────────────────
  for (const stmt of REQUIRED_REAL_INPUT_POLICY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorPolicyAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_operator_identity_reference");
      break;
    }
  }
  for (const stmt of REQUIRED_REAL_INPUT_POLICY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerPolicyAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_reviewer_identity_reference");
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
  if (inputRec["containsRawInputText"] === true || inputRec["containsFullDraftText"] === true) {
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

  // ── Rule 19: runtime safety flags ────────────────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["liveLLMCalled"] === true) {
    addReason(reasons, "live_llm_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    addReason(reasons, "public_runtime_claim_detected");
  }
  if (
    inputRec["emittedToUserNow"] === true ||
    inputRec["userVisibleOutputAllowed"] === true
  ) {
    addReason(reasons, "user_visible_output_claim_detected");
  }

  // ── Rules 20-23: scan string fields for forbidden content ──────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.pilotSessionId,
    input.operatorHumanId,
    input.reviewerHumanId,
    input.operatorPolicyAcknowledgment,
    input.reviewerPolicyAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenString(s)) {
      if (containsSecretLike(s)) {
        addReason(reasons, "forbidden_secret_detected");
      }
      if (containsEnvAssignmentLike(s)) {
        addReason(reasons, "forbidden_env_value_detected");
      }
      if (containsRawTextMarker(s)) {
        addReason(reasons, "forbidden_raw_text_detected");
      }
      if (containsRedactedTextMarker(s)) {
        addReason(reasons, "forbidden_redacted_text_detected");
      }
      if (containsModelOutputMarker(s)) {
        addReason(reasons, "forbidden_model_output_detected");
      }
      if (containsAuthorityDocumentMarker(s)) {
        addReason(reasons, "forbidden_document_content_detected");
      }
      if (containsSensitivePersonalMarker(s)) {
        addReason(reasons, "forbidden_pii_detected");
      }
      if (containsHighRiskLegalMarker(s)) {
        addReason(reasons, "forbidden_document_content_detected");
      }
      // Catch-all for forbidden strings not caught by specific categorizers
      const uncategorised = FORBIDDEN_REAL_INPUT_POLICY_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsRedactedTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsAuthorityDocumentMarker(s) &&
          !containsSensitivePersonalMarker(s) &&
          !containsHighRiskLegalMarker(s),
      );
      if (uncategorised) {
        addReason(reasons, "unsafe_policy_note_detected");
      }
    }

    if (containsPiiPattern(s)) {
      addReason(reasons, "forbidden_pii_detected");
    }
    if (
      containsAuthorityDocumentMarker(s) &&
      !reasons.includes("forbidden_document_content_detected")
    ) {
      addReason(reasons, "forbidden_document_content_detected");
    }
    if (
      containsSensitivePersonalMarker(s) &&
      !reasons.includes("forbidden_pii_detected")
    ) {
      addReason(reasons, "forbidden_pii_detected");
    }
    if (
      containsHighRiskLegalMarker(s) &&
      !reasons.includes("forbidden_document_content_detected")
    ) {
      addReason(reasons, "forbidden_document_content_detected");
    }
    if (
      containsEnvAssignmentLike(s) &&
      !reasons.includes("forbidden_env_value_detected")
    ) {
      addReason(reasons, "forbidden_env_value_detected");
    }
    if (
      containsSecretLike(s) &&
      !reasons.includes("forbidden_secret_detected")
    ) {
      addReason(reasons, "forbidden_secret_detected");
    }
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    status,
    accepted,
    rejectionReasons: reasons,

    safeInputPolicyMetadata: {
      pilotSessionId: input.pilotSessionId,
      operatorHumanId: input.operatorHumanId,
      reviewerHumanId: input.reviewerHumanId,
      allowedInputCategoryCount: input.allowedInputCategories.length,
      disallowedInputCategoryCount: input.disallowedInputCategories.length,
      redactionRequirementCount: input.redactionRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
      clearanceLevel: input.clearanceLevel,
    },

    readyForEvidencePolicy: accepted,
    readyForPostRunAuditPlanning: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawInputForwarded: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    envValueStored: false,
    secretStored: false,
    apiKeyStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByRealInputPolicy: false,
    redactionRuntimeModifiedByPolicy: false,
    inputRouterModifiedByPolicy: false,
    uiTouched: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Contract check ───────────────────────────────────────────────────────────

/**
 * Runs the full Real Input Policy Contract check for Phase 8.2M-4.
 *
 * Calls `runAbortProtocolContractCheck()` (8.2M-3), validates a synthetic
 * safe input policy input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT process real input. Does NOT forward raw input.
 * Does NOT modify redaction runtime or input routing.
 */
export function runRealInputPolicyContractCheck(): RealInputPolicyContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-3 abort protocol contract ────────────────────

  const abortCheck = runAbortProtocolContractCheck();
  const abortRec = asRec(abortCheck);

  const abortProtocolReady =
    abortCheck.allPassed === true &&
    abortRec["readyForRealInputPolicy"] === true &&
    abortRec["readyForRealOperatorPilotRun"] !== true &&
    abortRec["readyForPilotRunNow"] !== true &&
    abortRec["readyForPublicLaunch"] !== true &&
    abortRec["readyForLiveLLMRuntime"] !== true &&
    abortRec["readyForPersistence"] !== true &&
    abortRec["realPilotRunExecuted"] !== true &&
    abortRec["realAbortExecuted"] !== true &&
    abortRec["realUserInputProcessed"] !== true &&
    abortRec["killSwitchModifiedByContract"] !== true &&
    abortRec["runtimeAbortHookModifiedByContract"] !== true &&
    abortRec["liveLLMCalled"] !== true &&
    abortRec["persistenceUsed"] !== true &&
    abortRec["emittedToUserNow"] !== true &&
    abortRec["neverUserVisible"] === true;

  notes.push(`abortProtocolReady: ${String(abortProtocolReady)}`);
  notes.push(`abortCheck.allPassed: ${String(abortCheck.allPassed)}`);
  notes.push(`abortCheck.readyForRealInputPolicy: ${String(abortRec["readyForRealInputPolicy"])}`);

  // ── Step 2: Validate the synthetic safe input policy input ────────────────

  const syntheticInput = buildSyntheticRealInputPolicyContractInput();
  const syntheticResult = validateRealInputPolicyContractInput(syntheticInput);
  const syntheticInputPolicyAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticInputPolicyAccepted: ${String(syntheticInputPolicyAccepted)}`,
  );
  if (!syntheticInputPolicyAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof RealInputPolicyContractInput]: RealInputPolicyContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): RealInputPolicyContractResult {
    return validateRealInputPolicyContractInput({
      ...syntheticInput,
      ...overrides,
    } as RealInputPolicyContractInput);
  }

  const partialAllowed = ALLOWED_REAL_INPUT_CATEGORIES.slice(
    0,
    ALLOWED_REAL_INPUT_CATEGORIES.length - 1,
  );

  const partialDisallowed = DISALLOWED_REAL_INPUT_CATEGORIES.slice(
    0,
    DISALLOWED_REAL_INPUT_CATEGORIES.length - 1,
  ) as unknown as DisallowedRealInputCategory[];

  const partialRedaction = REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS.slice(
    0,
    REQUIRED_REAL_INPUT_REDACTION_REQUIREMENTS.length - 1,
  ) as unknown as RealInputRedactionRequirement[];

  const partialChecklist = REQUIRED_REAL_INPUT_POLICY_CHECKLIST.slice(
    0,
    REQUIRED_REAL_INPUT_POLICY_CHECKLIST.length - 1,
  ) as unknown as RealInputPolicyChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: RealInputPolicyContractResult;
  }> = [
    // 1. abortProtocolReady false
    {
      label: "abortProtocolReady=false",
      result: tamper({ abortProtocolReady: false }),
    },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operatorHumanId
    { label: "empty operatorHumanId", result: tamper({ operatorHumanId: "" }) },
    // 4. empty reviewerHumanId
    { label: "empty reviewerHumanId", result: tamper({ reviewerHumanId: "" }) },
    // 5. missing one allowed input category
    {
      label: "missing allowed input category",
      result: tamper({ allowedInputCategories: partialAllowed }),
    },
    // 6. missing one disallowed input category
    {
      label: "missing disallowed input category",
      result: tamper({ disallowedInputCategories: partialDisallowed }),
    },
    // 7. missing one redaction requirement
    {
      label: "missing redaction requirement",
      result: tamper({ redactionRequirements: partialRedaction }),
    },
    // 8. missing one checklist item
    {
      label: "missing checklist item",
      result: tamper({ checklistConfirmed: partialChecklist }),
    },
    // 9. clearanceLevel "no_clearance"
    {
      label: "clearanceLevel=no_clearance",
      result: tamper({ clearanceLevel: "no_clearance" }),
    },
    // 10. rawInputForwardingAllowed true
    {
      label: "rawInputForwardingAllowed=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        rawInputForwardingAllowed: true as unknown as false,
      }),
    },
    // 11. realInputProcessedByContract true
    {
      label: "realInputProcessedByContract=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        realInputProcessedByContract: true as unknown as false,
      }),
    },
    // 12. redactionPolicyDefined false
    {
      label: "redactionPolicyDefined=false",
      result: tamper({ redactionPolicyDefined: false }),
    },
    // 13. manualReviewClearanceRequired false
    {
      label: "manualReviewClearanceRequired=false",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        manualReviewClearanceRequired: false as unknown as true,
      }),
    },
    // 14. completenessWarningRequired false
    {
      label: "completenessWarningRequired=false",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        completenessWarningRequired: false as unknown as true,
      }),
    },
    // 15. legalDisclaimerRequired false
    {
      label: "legalDisclaimerRequired=false",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        legalDisclaimerRequired: false as unknown as true,
      }),
    },
    // 16. highRiskInputsBlocked false
    {
      label: "highRiskInputsBlocked=false",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        highRiskInputsBlocked: false as unknown as true,
      }),
    },
    // 17. missing operator acknowledgment
    {
      label: "missing operator acknowledgment",
      result: tamper({ operatorPolicyAcknowledgment: "partial only" }),
    },
    // 18. missing reviewer acknowledgment
    {
      label: "missing reviewer acknowledgment",
      result: tamper({ reviewerPolicyAcknowledgment: "partial only" }),
    },
    // 19. containsSecret true
    {
      label: "containsSecret=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 20. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 21. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 22. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 23. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 24. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 25. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 26. notes includes "process.env"
    {
      label: 'notes: "process.env"',
      result: tamper({ notes: ["process.env here"] }),
    },
    // 27. notes includes "OPENAI_API_KEY="
    {
      label: 'notes: "OPENAI_API_KEY="',
      result: tamper({ notes: ["OPENAI_API_KEY=abc123"] }),
    },
    // 28. notes includes "sk-"
    {
      label: 'notes: "sk-"',
      result: tamper({ notes: ["sk-supersecret"] }),
    },
    // 29. notes includes "john@example.com"
    {
      label: "notes: email",
      result: tamper({ notes: ["contact john@example.com"] }),
    },
    // 30. notes includes "+49 170 1234567"
    {
      label: "notes: phone",
      result: tamper({ notes: ["call +49 170 1234567"] }),
    },
    // 31. notes includes "Aktenzeichen"
    {
      label: 'notes: "Aktenzeichen"',
      result: tamper({ notes: ["Aktenzeichen: 123"] }),
    },
    // 32. notes includes "Name:"
    {
      label: 'notes: "Name:"',
      result: tamper({ notes: ["Name: Max Mustermann"] }),
    },
    // 33. notes includes "Geburtsdatum:"
    {
      label: 'notes: "Geburtsdatum:"',
      result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }),
    },
    // 34. notes includes "Abschiebung"
    {
      label: 'notes: "Abschiebung"',
      result: tamper({ notes: ["Abschiebung droht"] }),
    },
    // 35. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 36. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 37. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 38. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 39. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validateRealInputPolicyContractInput({
        ...syntheticInput,
        emittedToUserNow: true as unknown as false,
      }),
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

  const allPassed =
    abortProtocolReady && syntheticInputPolicyAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-4",
    allPassed,
    abortProtocolReady,
    syntheticInputPolicyAccepted,
    tamperCasesRejected,

    readyForEvidencePolicy: allPassed,
    readyForPostRunAuditPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawInputForwarded: false,
    redactionRuntimeModifiedByPolicy: false,
    inputRouterModifiedByPolicy: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
