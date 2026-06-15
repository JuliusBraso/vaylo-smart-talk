/**
 * Evidence Policy Contract Check (Phase 8.2M-5).
 *
 * Validates typed evidence policy contract inputs and produces an
 * `EvidencePolicyContractCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-4 real input policy contract is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - read process.env
 * - persist evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema
 * - process actual user input
 * - forward raw user input
 * - modify runtime evidence, redaction, or routing behavior
 * - authorize or execute a real pilot run
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runEvidencePolicyContractCheck()` explicitly.
 */

import { runRealInputPolicyContractCheck } from "./run-real-input-policy-contract-check";
import {
  ALLOWED_EVIDENCE_METADATA_CATEGORIES,
  BLOCKED_EVIDENCE_CONTENT_CATEGORIES,
  FORBIDDEN_EVIDENCE_CONTENT_PHRASES,
  FORBIDDEN_EVIDENCE_POLICY_STRINGS,
  REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS,
  REQUIRED_EVIDENCE_POLICY_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_EVIDENCE_POLICY_CHECKLIST,
  REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS,
} from "./evidence-policy-contract-types";
import type {
  BlockedEvidenceContentCategory,
  EvidenceAuditTrailRequirement,
  EvidencePolicyClearanceLevel,
  EvidencePolicyChecklistItem,
  EvidencePolicyContractCheckResult,
  EvidencePolicyContractInput,
  EvidencePolicyContractResult,
  EvidencePolicyRejectionReason,
  EvidenceRetentionConstraint,
} from "./evidence-policy-contract-types";

// ── Helpers ─────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_CLEARANCE_LEVELS: readonly EvidencePolicyClearanceLevel[] = [
  "policy_defined_only",
  "metadata_schema_ready_for_future_operator_review",
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

const EVIDENCE_CONTENT_MARKERS = ["OCR output", "document image"];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_EVIDENCE_POLICY_STRINGS.some((f) => value.includes(f));
}

function containsForbiddenContentPhrase(value: string): boolean {
  return FORBIDDEN_EVIDENCE_CONTENT_PHRASES.some((p) => value.includes(p));
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

function containsEvidenceContentMarker(value: string): boolean {
  return EVIDENCE_CONTENT_MARKERS.some((m) => value.includes(m));
}

function addReason(
  list: EvidencePolicyRejectionReason[],
  reason: EvidencePolicyRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ─────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `EvidencePolicyContractInput` for use in the
 * harness check. Contains no real evidence, no user content, no env values,
 * no secrets, and no sensitive content.
 */
export function buildSyntheticEvidencePolicyContractInput(): EvidencePolicyContractInput {
  const acknowledgmentStatements =
    REQUIRED_EVIDENCE_POLICY_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "evidence-policy-contract-8-2m-5",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",

    realInputPolicyReady: true,
    operatorHumanId: "operator-internal-001",
    reviewerHumanId: "reviewer-internal-001",

    allowedEvidenceMetadataCategories: [...ALLOWED_EVIDENCE_METADATA_CATEGORIES],
    blockedEvidenceContentCategories: [...BLOCKED_EVIDENCE_CONTENT_CATEGORIES],
    retentionConstraints: [...REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS],
    auditTrailRequirements: [...REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_EVIDENCE_POLICY_CHECKLIST],
    clearanceLevel: "metadata_schema_ready_for_future_operator_review",

    metadataOnlyEvidence: true,
    userContentEvidenceAllowed: false,
    rawTextEvidenceAllowed: false,
    redactedTextEvidenceAllowed: false,
    modelOutputEvidenceAllowed: false,
    documentImageOrOcrEvidenceAllowed: false,
    piiEvidenceAllowed: false,
    secretOrEnvEvidenceAllowed: false,
    publicLogExposureAllowed: false,
    persistenceRequiresSeparateAuthorization: true,
    postRunAuditRequired: true,

    operatorEvidenceAcknowledgment: acknowledgmentStatements,
    reviewerEvidenceAcknowledgment: acknowledgmentStatements,
    notes: ["synthetic safe evidence policy attestation without user content"],

    evidencePersistencePerformed: false,
    realInputProcessedByContract: false,

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
    liveLLMCalled: false,
    emittedToUserNow: false,
    userVisibleOutputAllowed: false,

    neverUserVisible: true,
  };
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates an `EvidencePolicyContractInput` and returns a typed
 * `EvidencePolicyContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validateEvidencePolicyContractInput(
  input: EvidencePolicyContractInput,
): EvidencePolicyContractResult {
  const reasons: EvidencePolicyRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: realInputPolicyReady must be true ─────────────────────────────
  if (!input.realInputPolicyReady) {
    addReason(reasons, "real_input_policy_not_ready");
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

  // ── Rule 5: all allowed metadata categories present ───────────────────────
  for (const cat of ALLOWED_EVIDENCE_METADATA_CATEGORIES) {
    if (!input.allowedEvidenceMetadataCategories.includes(cat)) {
      addReason(reasons, "missing_allowed_metadata_category");
      break;
    }
  }

  // ── Rule 6: all blocked content categories present ────────────────────────
  for (const cat of BLOCKED_EVIDENCE_CONTENT_CATEGORIES) {
    if (!input.blockedEvidenceContentCategories.includes(cat)) {
      addReason(reasons, "missing_blocked_content_category");
      break;
    }
  }

  // ── Rule 7: all retention constraints present ─────────────────────────────
  for (const c of REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS) {
    if (!input.retentionConstraints.includes(c)) {
      addReason(reasons, "missing_retention_constraint");
      break;
    }
  }

  // ── Rule 8: all audit trail requirements present ──────────────────────────
  for (const r of REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS) {
    if (!input.auditTrailRequirements.includes(r)) {
      addReason(reasons, "missing_audit_trail_requirement");
      break;
    }
  }

  // ── Rule 9: all checklist items confirmed ─────────────────────────────────
  for (const item of REQUIRED_EVIDENCE_POLICY_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 10: valid clearance level ───────────────────────────────────────
  if (!VALID_CLEARANCE_LEVELS.includes(input.clearanceLevel)) {
    addReason(reasons, "invalid_clearance_level");
  }

  // ── Rule 11: metadataOnlyEvidence must be true ────────────────────────────
  if (inputRec["metadataOnlyEvidence"] !== true) {
    addReason(reasons, "user_content_evidence_claim_detected");
  }

  // ── Rule 12: evidence content gates must all be false ─────────────────────
  if (inputRec["userContentEvidenceAllowed"] === true) {
    addReason(reasons, "user_content_evidence_claim_detected");
  }
  if (inputRec["rawTextEvidenceAllowed"] === true) {
    addReason(reasons, "raw_text_evidence_claim_detected");
  }
  if (inputRec["redactedTextEvidenceAllowed"] === true) {
    addReason(reasons, "redacted_text_evidence_claim_detected");
  }
  if (inputRec["modelOutputEvidenceAllowed"] === true) {
    addReason(reasons, "model_output_evidence_claim_detected");
  }
  if (inputRec["documentImageOrOcrEvidenceAllowed"] === true) {
    addReason(reasons, "document_image_or_ocr_evidence_claim_detected");
  }
  if (inputRec["piiEvidenceAllowed"] === true) {
    addReason(reasons, "pii_evidence_claim_detected");
  }
  if (inputRec["secretOrEnvEvidenceAllowed"] === true) {
    addReason(reasons, "secret_or_env_evidence_claim_detected");
  }
  if (inputRec["publicLogExposureAllowed"] === true) {
    addReason(reasons, "public_log_exposure_claim_detected");
  }

  // ── Rule 13: mandatory safety gates must be true ──────────────────────────
  if (inputRec["persistenceRequiresSeparateAuthorization"] !== true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["postRunAuditRequired"] !== true) {
    addReason(reasons, "missing_required_checklist_item");
  }

  // ── Rule 14: evidence/input execution flags must be false ─────────────────
  if (inputRec["evidencePersistencePerformed"] === true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }

  // ── Rule 15: operator and reviewer acknowledgments ────────────────────────
  for (const stmt of REQUIRED_EVIDENCE_POLICY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorEvidenceAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_operator_identity_reference");
      break;
    }
  }
  for (const stmt of REQUIRED_EVIDENCE_POLICY_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerEvidenceAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_reviewer_identity_reference");
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

  // ── Rule 17: runtime safety flags ────────────────────────────────────────
  if (
    inputRec["persistenceUsed"] === true ||
    inputRec["evidencePersistencePerformed"] === true
  ) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["dnaSavePerformed"] === true) {
    addReason(reasons, "dna_save_claim_detected");
  }
  if (inputRec["offlineSavePerformed"] === true) {
    addReason(reasons, "offline_save_claim_detected");
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

  // ── Rules 18-23: scan string fields for forbidden content ──────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.pilotSessionId,
    input.operatorHumanId,
    input.reviewerHumanId,
    input.operatorEvidenceAcknowledgment,
    input.reviewerEvidenceAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    // Check for forbidden evidence content phrases
    if (containsForbiddenContentPhrase(s)) {
      addReason(reasons, "unsafe_evidence_note_detected");
    }

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
      if (containsEvidenceContentMarker(s)) {
        addReason(reasons, "document_image_or_ocr_evidence_claim_detected");
      }
      // Catch-all for forbidden strings not caught by specific categorizers
      const uncategorised = FORBIDDEN_EVIDENCE_POLICY_STRINGS.some(
        (f) =>
          s.includes(f) &&
          !containsSecretLike(s) &&
          !containsEnvAssignmentLike(s) &&
          !containsRawTextMarker(s) &&
          !containsRedactedTextMarker(s) &&
          !containsModelOutputMarker(s) &&
          !containsAuthorityDocumentMarker(s) &&
          !containsSensitivePersonalMarker(s) &&
          !containsHighRiskLegalMarker(s) &&
          !containsEvidenceContentMarker(s),
      );
      if (uncategorised) {
        addReason(reasons, "unsafe_evidence_note_detected");
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

    safeEvidencePolicyMetadata: {
      pilotSessionId: input.pilotSessionId,
      operatorHumanId: input.operatorHumanId,
      reviewerHumanId: input.reviewerHumanId,
      allowedMetadataCategoryCount: input.allowedEvidenceMetadataCategories.length,
      blockedContentCategoryCount: input.blockedEvidenceContentCategories.length,
      retentionConstraintCount: input.retentionConstraints.length,
      auditTrailRequirementCount: input.auditTrailRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
      clearanceLevel: input.clearanceLevel,
    },

    readyForPostRunAuditPlanning: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    evidencePersistencePerformed: false,
    userContentEvidenceStored: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    documentImageStored: false,
    ocrOutputStored: false,
    envValueStored: false,
    secretStored: false,
    apiKeyStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByEvidencePolicy: false,
    evidencePersistenceRuntimeModifiedByPolicy: false,
    databaseOrStorageModifiedByPolicy: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Contract check ───────────────────────────────────────────────────────────

/**
 * Runs the full Evidence Policy Contract check for Phase 8.2M-5.
 *
 * Calls `runRealInputPolicyContractCheck()` (8.2M-4), validates a synthetic
 * safe evidence policy input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT persist evidence. Does NOT store user content.
 * Does NOT modify DB/storage.
 */
export function runEvidencePolicyContractCheck(): EvidencePolicyContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-4 real input policy contract ─────────────────

  const inputPolicyCheck = runRealInputPolicyContractCheck();
  const ipRec = asRec(inputPolicyCheck);

  const realInputPolicyReady =
    inputPolicyCheck.allPassed === true &&
    ipRec["readyForEvidencePolicy"] === true &&
    ipRec["readyForPostRunAuditPlanning"] === true &&
    ipRec["readyForRealOperatorPilotRun"] !== true &&
    ipRec["readyForPilotRunNow"] !== true &&
    ipRec["readyForPublicLaunch"] !== true &&
    ipRec["readyForLiveLLMRuntime"] !== true &&
    ipRec["readyForPersistence"] !== true &&
    ipRec["realPilotRunExecuted"] !== true &&
    ipRec["realUserInputProcessed"] !== true &&
    ipRec["rawInputForwarded"] !== true &&
    ipRec["redactionRuntimeModifiedByPolicy"] !== true &&
    ipRec["inputRouterModifiedByPolicy"] !== true &&
    ipRec["liveLLMCalled"] !== true &&
    ipRec["persistenceUsed"] !== true &&
    ipRec["emittedToUserNow"] !== true &&
    ipRec["neverUserVisible"] === true;

  notes.push(`realInputPolicyReady: ${String(realInputPolicyReady)}`);
  notes.push(`inputPolicyCheck.allPassed: ${String(inputPolicyCheck.allPassed)}`);
  notes.push(`readyForEvidencePolicy: ${String(ipRec["readyForEvidencePolicy"])}`);

  // ── Step 2: Validate the synthetic safe evidence policy input ─────────────

  const syntheticInput = buildSyntheticEvidencePolicyContractInput();
  const syntheticResult = validateEvidencePolicyContractInput(syntheticInput);
  const syntheticEvidencePolicyAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticEvidencePolicyAccepted: ${String(syntheticEvidencePolicyAccepted)}`,
  );
  if (!syntheticEvidencePolicyAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof EvidencePolicyContractInput]: EvidencePolicyContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): EvidencePolicyContractResult {
    return validateEvidencePolicyContractInput({
      ...syntheticInput,
      ...overrides,
    } as EvidencePolicyContractInput);
  }

  const partialMetadata = ALLOWED_EVIDENCE_METADATA_CATEGORIES.slice(
    0,
    ALLOWED_EVIDENCE_METADATA_CATEGORIES.length - 1,
  );

  const partialBlocked = BLOCKED_EVIDENCE_CONTENT_CATEGORIES.slice(
    0,
    BLOCKED_EVIDENCE_CONTENT_CATEGORIES.length - 1,
  ) as unknown as BlockedEvidenceContentCategory[];

  const partialRetention = REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS.slice(
    0,
    REQUIRED_EVIDENCE_RETENTION_CONSTRAINTS.length - 1,
  ) as unknown as EvidenceRetentionConstraint[];

  const partialAudit = REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS.slice(
    0,
    REQUIRED_EVIDENCE_AUDIT_TRAIL_REQUIREMENTS.length - 1,
  ) as unknown as EvidenceAuditTrailRequirement[];

  const partialChecklist = REQUIRED_EVIDENCE_POLICY_CHECKLIST.slice(
    0,
    REQUIRED_EVIDENCE_POLICY_CHECKLIST.length - 1,
  ) as unknown as EvidencePolicyChecklistItem[];

  const tamperCases: Array<{
    label: string;
    result: EvidencePolicyContractResult;
  }> = [
    // 1. realInputPolicyReady false
    {
      label: "realInputPolicyReady=false",
      result: tamper({ realInputPolicyReady: false }),
    },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operatorHumanId
    { label: "empty operatorHumanId", result: tamper({ operatorHumanId: "" }) },
    // 4. empty reviewerHumanId
    { label: "empty reviewerHumanId", result: tamper({ reviewerHumanId: "" }) },
    // 5. missing one allowed metadata category
    {
      label: "missing allowed metadata category",
      result: tamper({ allowedEvidenceMetadataCategories: partialMetadata }),
    },
    // 6. missing one blocked content category
    {
      label: "missing blocked content category",
      result: tamper({ blockedEvidenceContentCategories: partialBlocked }),
    },
    // 7. missing one retention constraint
    {
      label: "missing retention constraint",
      result: tamper({ retentionConstraints: partialRetention }),
    },
    // 8. missing one audit trail requirement
    {
      label: "missing audit trail requirement",
      result: tamper({ auditTrailRequirements: partialAudit }),
    },
    // 9. missing one checklist item
    {
      label: "missing checklist item",
      result: tamper({ checklistConfirmed: partialChecklist }),
    },
    // 10. invalid clearanceLevel
    {
      label: "invalid clearanceLevel",
      result: tamper({
        clearanceLevel: "no_clearance" as unknown as EvidencePolicyClearanceLevel,
      }),
    },
    // 11. metadataOnlyEvidence false
    {
      label: "metadataOnlyEvidence=false",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        metadataOnlyEvidence: false as unknown as true,
      }),
    },
    // 12. userContentEvidenceAllowed true
    {
      label: "userContentEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        userContentEvidenceAllowed: true as unknown as false,
      }),
    },
    // 13. rawTextEvidenceAllowed true
    {
      label: "rawTextEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        rawTextEvidenceAllowed: true as unknown as false,
      }),
    },
    // 14. redactedTextEvidenceAllowed true
    {
      label: "redactedTextEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        redactedTextEvidenceAllowed: true as unknown as false,
      }),
    },
    // 15. modelOutputEvidenceAllowed true
    {
      label: "modelOutputEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        modelOutputEvidenceAllowed: true as unknown as false,
      }),
    },
    // 16. documentImageOrOcrEvidenceAllowed true
    {
      label: "documentImageOrOcrEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        documentImageOrOcrEvidenceAllowed: true as unknown as false,
      }),
    },
    // 17. piiEvidenceAllowed true
    {
      label: "piiEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        piiEvidenceAllowed: true as unknown as false,
      }),
    },
    // 18. secretOrEnvEvidenceAllowed true
    {
      label: "secretOrEnvEvidenceAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        secretOrEnvEvidenceAllowed: true as unknown as false,
      }),
    },
    // 19. publicLogExposureAllowed true
    {
      label: "publicLogExposureAllowed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        publicLogExposureAllowed: true as unknown as false,
      }),
    },
    // 20. persistenceRequiresSeparateAuthorization false
    {
      label: "persistenceRequiresSeparateAuthorization=false",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        persistenceRequiresSeparateAuthorization: false as unknown as true,
      }),
    },
    // 21. postRunAuditRequired false
    {
      label: "postRunAuditRequired=false",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        postRunAuditRequired: false as unknown as true,
      }),
    },
    // 22. evidencePersistencePerformed true
    {
      label: "evidencePersistencePerformed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        evidencePersistencePerformed: true as unknown as false,
      }),
    },
    // 23. realInputProcessedByContract true
    {
      label: "realInputProcessedByContract=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        realInputProcessedByContract: true as unknown as false,
      }),
    },
    // 24. missing operator acknowledgment
    {
      label: "missing operator acknowledgment",
      result: tamper({ operatorEvidenceAcknowledgment: "partial only" }),
    },
    // 25. missing reviewer acknowledgment
    {
      label: "missing reviewer acknowledgment",
      result: tamper({ reviewerEvidenceAcknowledgment: "partial only" }),
    },
    // 26. containsSecret true
    {
      label: "containsSecret=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 27. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 28. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 29. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 30. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 31. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 32. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 33. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsUserPii: true as unknown as false,
      }),
    },
    // 34. notes includes "process.env"
    {
      label: 'notes: "process.env"',
      result: tamper({ notes: ["process.env here"] }),
    },
    // 35. notes includes "OPENAI_API_KEY="
    {
      label: 'notes: "OPENAI_API_KEY="',
      result: tamper({ notes: ["OPENAI_API_KEY=abc123"] }),
    },
    // 36. notes includes "sk-"
    {
      label: 'notes: "sk-"',
      result: tamper({ notes: ["sk-supersecret"] }),
    },
    // 37. notes includes "stored user input"
    {
      label: 'notes: "stored user input"',
      result: tamper({ notes: ["stored user input here"] }),
    },
    // 38. notes includes "stored redacted text"
    {
      label: 'notes: "stored redacted text"',
      result: tamper({ notes: ["stored redacted text here"] }),
    },
    // 39. notes includes "stored model output"
    {
      label: 'notes: "stored model output"',
      result: tamper({ notes: ["stored model output here"] }),
    },
    // 40. notes includes "document image"
    {
      label: 'notes: "document image"',
      result: tamper({ notes: ["document image data"] }),
    },
    // 41. notes includes "OCR output"
    {
      label: 'notes: "OCR output"',
      result: tamper({ notes: ["OCR output text"] }),
    },
    // 42. notes includes "john@example.com"
    {
      label: "notes: email",
      result: tamper({ notes: ["contact john@example.com"] }),
    },
    // 43. notes includes "+49 170 1234567"
    {
      label: "notes: phone",
      result: tamper({ notes: ["call +49 170 1234567"] }),
    },
    // 44. notes includes "Aktenzeichen"
    {
      label: 'notes: "Aktenzeichen"',
      result: tamper({ notes: ["Aktenzeichen: 123"] }),
    },
    // 45. notes includes "Name:"
    {
      label: 'notes: "Name:"',
      result: tamper({ notes: ["Name: Max Mustermann"] }),
    },
    // 46. notes includes "Geburtsdatum:"
    {
      label: 'notes: "Geburtsdatum:"',
      result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }),
    },
    // 47. notes includes "Abschiebung"
    {
      label: 'notes: "Abschiebung"',
      result: tamper({ notes: ["Abschiebung droht"] }),
    },
    // 48. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 49. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 50. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 51. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 52. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 53. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateEvidencePolicyContractInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 54. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validateEvidencePolicyContractInput({
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
    realInputPolicyReady &&
    syntheticEvidencePolicyAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-5",
    allPassed,
    realInputPolicyReady,
    syntheticEvidencePolicyAccepted,
    tamperCasesRejected,

    readyForPostRunAuditPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    evidencePersistencePerformed: false,
    userContentEvidenceStored: false,
    evidencePersistenceRuntimeModifiedByPolicy: false,
    databaseOrStorageModifiedByPolicy: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
