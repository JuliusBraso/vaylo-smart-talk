/**
 * Post-Run Audit Planning Contract Check (Phase 8.2M-6).
 *
 * Validates typed post-run audit planning contract inputs and produces a
 * `PostRunAuditPlanningContractCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-5 evidence policy contract is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - read process.env
 * - execute a post-run audit
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema
 * - process actual user input or forward raw input
 * - modify runtime audit, redaction, or routing behavior
 * - authorize or execute a real pilot run
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runPostRunAuditPlanningContractCheck()` explicitly.
 */

import { runEvidencePolicyContractCheck } from "./run-evidence-policy-contract-check";
import {
  FORBIDDEN_AUDIT_CONTENT_PHRASES,
  FORBIDDEN_POST_RUN_AUDIT_PLANNING_STRINGS,
  REQUIRED_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS,
  REQUIRED_POST_RUN_AUDIT_CHECKLIST,
  REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS,
  REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS,
  REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS,
  REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS,
} from "./post-run-audit-planning-contract-types";
import type {
  PostRunAuditChecklistItem,
  PostRunAuditLinkageRequirement,
  PostRunAuditPlanningClearanceLevel,
  PostRunAuditPlanningContractCheckResult,
  PostRunAuditPlanningContractInput,
  PostRunAuditPlanningContractResult,
  PostRunAuditPlanningRejectionReason,
  PostRunAuditSignoffRequirement,
  PostRunAuditVerdictModel,
} from "./post-run-audit-planning-contract-types";

// ── Helpers ─────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_CLEARANCE_LEVELS: readonly PostRunAuditPlanningClearanceLevel[] = [
  "policy_defined_only",
  "audit_schema_ready_for_future_operator_review",
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
  return FORBIDDEN_POST_RUN_AUDIT_PLANNING_STRINGS.some((f) =>
    value.includes(f),
  );
}

function containsForbiddenContentPhrase(value: string): boolean {
  return FORBIDDEN_AUDIT_CONTENT_PHRASES.some((p) => value.includes(p));
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
  list: PostRunAuditPlanningRejectionReason[],
  reason: PostRunAuditPlanningRejectionReason,
): void {
  if (!list.includes(reason)) list.push(reason);
}

// ── Synthetic safe input ─────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `PostRunAuditPlanningContractInput` for use in the
 * harness check. Contains no real audit execution, no user content, no env
 * values, no secrets, and no sensitive content.
 */
export function buildSyntheticPostRunAuditPlanningContractInput(): PostRunAuditPlanningContractInput {
  const acknowledgmentStatements =
    REQUIRED_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS.join(" ");

  return {
    contractId: "post-run-audit-planning-contract-8-2m-6",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",

    evidencePolicyReady: true,
    operatorHumanId: "operator-internal-001",
    reviewerHumanId: "reviewer-internal-001",

    auditScopeItems: [...REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS],
    verdictModels: [...REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS],
    linkageRequirements: [...REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS],
    checklistConfirmed: [...REQUIRED_POST_RUN_AUDIT_CHECKLIST],
    signoffRequirements: [...REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS],
    clearanceLevel: "audit_schema_ready_for_future_operator_review",

    auditRecordMetadataOnly: true,
    auditRecordUserContentAllowed: false,
    auditRecordRawTextAllowed: false,
    auditRecordRedactedTextAllowed: false,
    auditRecordModelOutputAllowed: false,
    auditRecordDocumentContentAllowed: false,
    auditRecordPiiAllowed: false,
    auditRecordSecretOrEnvAllowed: false,

    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    realInputProcessedByContract: false,
    persistenceRequiresSeparateAuthorization: true,
    postRunAuditRequiredBeforeCompletion: true,

    operatorAuditPlanningAcknowledgment: acknowledgmentStatements,
    reviewerAuditPlanningAcknowledgment: acknowledgmentStatements,
    notes: ["synthetic safe post-run audit planning without user content"],

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
 * Validates a `PostRunAuditPlanningContractInput` and returns a typed
 * `PostRunAuditPlanningContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields.
 */
export function validatePostRunAuditPlanningContractInput(
  input: PostRunAuditPlanningContractInput,
): PostRunAuditPlanningContractResult {
  const reasons: PostRunAuditPlanningRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: evidencePolicyReady must be true ──────────────────────────────
  if (!input.evidencePolicyReady) {
    addReason(reasons, "evidence_policy_not_ready");
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

  // ── Rule 5: all audit scope items present ─────────────────────────────────
  for (const item of REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS) {
    if (!input.auditScopeItems.includes(item)) {
      addReason(reasons, "missing_audit_scope_item");
      break;
    }
  }

  // ── Rule 6: all verdict models present ───────────────────────────────────
  for (const model of REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS) {
    if (!input.verdictModels.includes(model)) {
      addReason(reasons, "missing_verdict_model");
      break;
    }
  }

  // ── Rule 7: all linkage requirements present ──────────────────────────────
  for (const req of REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS) {
    if (!input.linkageRequirements.includes(req)) {
      addReason(reasons, "missing_linkage_requirement");
      break;
    }
  }

  // ── Rule 8: all checklist items confirmed ─────────────────────────────────
  for (const item of REQUIRED_POST_RUN_AUDIT_CHECKLIST) {
    if (!input.checklistConfirmed.includes(item)) {
      addReason(reasons, "missing_required_checklist_item");
      break;
    }
  }

  // ── Rule 9: all signoff requirements present ──────────────────────────────
  for (const req of REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS) {
    if (!input.signoffRequirements.includes(req)) {
      addReason(reasons, "missing_signoff_requirement");
      break;
    }
  }

  // ── Rule 10: valid clearance level ───────────────────────────────────────
  if (!VALID_CLEARANCE_LEVELS.includes(input.clearanceLevel)) {
    addReason(reasons, "invalid_clearance_level");
  }

  // ── Rule 11: auditRecordMetadataOnly must be true ─────────────────────────
  if (inputRec["auditRecordMetadataOnly"] !== true) {
    addReason(reasons, "user_content_audit_claim_detected");
  }

  // ── Rule 12: all audit record content gates must be false ─────────────────
  if (inputRec["auditRecordUserContentAllowed"] === true) {
    addReason(reasons, "user_content_audit_claim_detected");
  }
  if (inputRec["auditRecordRawTextAllowed"] === true) {
    addReason(reasons, "raw_text_audit_claim_detected");
  }
  if (inputRec["auditRecordRedactedTextAllowed"] === true) {
    addReason(reasons, "redacted_text_audit_claim_detected");
  }
  if (inputRec["auditRecordModelOutputAllowed"] === true) {
    addReason(reasons, "model_output_audit_claim_detected");
  }
  if (inputRec["auditRecordDocumentContentAllowed"] === true) {
    addReason(reasons, "document_content_audit_claim_detected");
  }
  if (inputRec["auditRecordPiiAllowed"] === true) {
    addReason(reasons, "pii_audit_claim_detected");
  }
  if (inputRec["auditRecordSecretOrEnvAllowed"] === true) {
    addReason(reasons, "secret_or_env_audit_claim_detected");
  }

  // ── Rule 13: audit/evidence execution flags must be false ─────────────────
  if (inputRec["auditExecutionPerformed"] === true) {
    addReason(reasons, "audit_execution_claim_detected");
  }
  if (inputRec["auditPersistencePerformed"] === true) {
    addReason(reasons, "audit_persistence_claim_detected");
  }
  if (inputRec["evidencePersistencePerformed"] === true) {
    addReason(reasons, "evidence_persistence_claim_detected");
  }
  if (
    inputRec["realInputProcessedByContract"] === true ||
    inputRec["containsRealUserInput"] === true
  ) {
    addReason(reasons, "real_input_processed_claim_detected");
  }

  // ── Rule 14: mandatory safety gates must be true ──────────────────────────
  if (inputRec["persistenceRequiresSeparateAuthorization"] !== true) {
    addReason(reasons, "persistence_claim_detected");
  }
  if (inputRec["postRunAuditRequiredBeforeCompletion"] !== true) {
    addReason(reasons, "missing_required_checklist_item");
  }

  // ── Rule 15: operator and reviewer acknowledgments ────────────────────────
  for (const stmt of REQUIRED_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.operatorAuditPlanningAcknowledgment.includes(stmt)) {
      addReason(reasons, "missing_operator_identity_reference");
      break;
    }
  }
  for (const stmt of REQUIRED_POST_RUN_AUDIT_ACKNOWLEDGMENT_STATEMENTS) {
    if (!input.reviewerAuditPlanningAcknowledgment.includes(stmt)) {
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
  if (inputRec["persistenceUsed"] === true) {
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

  // ── Rules 18-22: scan string fields for forbidden content ──────────────────
  const allTextFields: string[] = [
    input.contractId,
    input.pilotSessionId,
    input.operatorHumanId,
    input.reviewerHumanId,
    input.operatorAuditPlanningAcknowledgment,
    input.reviewerAuditPlanningAcknowledgment,
    ...input.notes,
  ];

  for (const s of allTextFields) {
    if (containsForbiddenContentPhrase(s)) {
      addReason(reasons, "unsafe_audit_note_detected");
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
      // Catch-all for forbidden strings not caught by specific categorizers
      const uncategorised = FORBIDDEN_POST_RUN_AUDIT_PLANNING_STRINGS.some(
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
          !containsForbiddenContentPhrase(s),
      );
      if (uncategorised) {
        addReason(reasons, "unsafe_audit_note_detected");
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

    safePostRunAuditPlanningMetadata: {
      pilotSessionId: input.pilotSessionId,
      operatorHumanId: input.operatorHumanId,
      reviewerHumanId: input.reviewerHumanId,
      auditScopeItemCount: input.auditScopeItems.length,
      verdictModelCount: input.verdictModels.length,
      linkageRequirementCount: input.linkageRequirements.length,
      checklistPassedCount: input.checklistConfirmed.length,
      signoffRequirementCount: input.signoffRequirements.length,
      clearanceLevel: input.clearanceLevel,
    },

    readyForRealOperatorPilotAuthorizationClosure: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    userContentAuditStored: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    documentContentStored: false,
    envValueStored: false,
    secretStored: false,
    apiKeyStored: false,
    userPiiStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByPostRunAuditPlanning: false,
    auditRuntimeModifiedByPlanning: false,
    databaseOrStorageModifiedByPlanning: false,
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
 * Runs the full Post-Run Audit Planning Contract check for Phase 8.2M-6.
 *
 * Calls `runEvidencePolicyContractCheck()` (8.2M-5), validates a synthetic
 * safe post-run audit planning input, and runs tamper cases to prove rejection.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 * Does NOT execute or persist audits. Does NOT store user content.
 * Does NOT modify DB/storage.
 */
export function runPostRunAuditPlanningContractCheck(): PostRunAuditPlanningContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-5 evidence policy contract ───────────────────

  const evidenceCheck = runEvidencePolicyContractCheck();
  const evRec = asRec(evidenceCheck);

  const evidencePolicyReady =
    evidenceCheck.allPassed === true &&
    evRec["readyForPostRunAuditPlanning"] === true &&
    evRec["readyForRealOperatorPilotRun"] !== true &&
    evRec["readyForPilotRunNow"] !== true &&
    evRec["readyForPublicLaunch"] !== true &&
    evRec["readyForLiveLLMRuntime"] !== true &&
    evRec["readyForPersistence"] !== true &&
    evRec["realPilotRunExecuted"] !== true &&
    evRec["realUserInputProcessed"] !== true &&
    evRec["evidencePersistencePerformed"] !== true &&
    evRec["userContentEvidenceStored"] !== true &&
    evRec["evidencePersistenceRuntimeModifiedByPolicy"] !== true &&
    evRec["databaseOrStorageModifiedByPolicy"] !== true &&
    evRec["liveLLMCalled"] !== true &&
    evRec["persistenceUsed"] !== true &&
    evRec["dnaSavePerformed"] !== true &&
    evRec["offlineSavePerformed"] !== true &&
    evRec["emittedToUserNow"] !== true &&
    evRec["neverUserVisible"] === true;

  notes.push(`evidencePolicyReady: ${String(evidencePolicyReady)}`);
  notes.push(`evidenceCheck.allPassed: ${String(evidenceCheck.allPassed)}`);
  notes.push(
    `evidenceCheck.readyForPostRunAuditPlanning: ${String(evRec["readyForPostRunAuditPlanning"])}`,
  );

  // ── Step 2: Validate the synthetic safe post-run audit planning input ──────

  const syntheticInput = buildSyntheticPostRunAuditPlanningContractInput();
  const syntheticResult = validatePostRunAuditPlanningContractInput(syntheticInput);
  const syntheticPostRunAuditPlanningAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticPostRunAuditPlanningAccepted: ${String(syntheticPostRunAuditPlanningAccepted)}`,
  );
  if (!syntheticPostRunAuditPlanningAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases — all must be rejected ───────────────────────────

  type MutableInput = {
    -readonly [K in keyof PostRunAuditPlanningContractInput]: PostRunAuditPlanningContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): PostRunAuditPlanningContractResult {
    return validatePostRunAuditPlanningContractInput({
      ...syntheticInput,
      ...overrides,
    } as PostRunAuditPlanningContractInput);
  }

  const partialScope = REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS.slice(
    0,
    REQUIRED_POST_RUN_AUDIT_SCOPE_ITEMS.length - 1,
  );

  const partialVerdicts = REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS.slice(
    0,
    REQUIRED_POST_RUN_AUDIT_VERDICT_MODELS.length - 1,
  ) as unknown as PostRunAuditVerdictModel[];

  const partialLinkage = REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS.slice(
    0,
    REQUIRED_POST_RUN_AUDIT_LINKAGE_REQUIREMENTS.length - 1,
  ) as unknown as PostRunAuditLinkageRequirement[];

  const partialChecklist = REQUIRED_POST_RUN_AUDIT_CHECKLIST.slice(
    0,
    REQUIRED_POST_RUN_AUDIT_CHECKLIST.length - 1,
  ) as unknown as PostRunAuditChecklistItem[];

  const partialSignoff = REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS.slice(
    0,
    REQUIRED_POST_RUN_AUDIT_SIGNOFF_REQUIREMENTS.length - 1,
  ) as unknown as PostRunAuditSignoffRequirement[];

  const tamperCases: Array<{
    label: string;
    result: PostRunAuditPlanningContractResult;
  }> = [
    // 1. evidencePolicyReady false
    {
      label: "evidencePolicyReady=false",
      result: tamper({ evidencePolicyReady: false }),
    },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operatorHumanId
    { label: "empty operatorHumanId", result: tamper({ operatorHumanId: "" }) },
    // 4. empty reviewerHumanId
    { label: "empty reviewerHumanId", result: tamper({ reviewerHumanId: "" }) },
    // 5. missing one audit scope item
    {
      label: "missing audit scope item",
      result: tamper({ auditScopeItems: partialScope }),
    },
    // 6. missing one verdict model
    {
      label: "missing verdict model",
      result: tamper({ verdictModels: partialVerdicts }),
    },
    // 7. missing one linkage requirement
    {
      label: "missing linkage requirement",
      result: tamper({ linkageRequirements: partialLinkage }),
    },
    // 8. missing one checklist item
    {
      label: "missing checklist item",
      result: tamper({ checklistConfirmed: partialChecklist }),
    },
    // 9. missing one signoff requirement
    {
      label: "missing signoff requirement",
      result: tamper({ signoffRequirements: partialSignoff }),
    },
    // 10. invalid clearanceLevel
    {
      label: "invalid clearanceLevel",
      result: tamper({
        clearanceLevel: "no_clearance" as unknown as PostRunAuditPlanningClearanceLevel,
      }),
    },
    // 11. auditRecordMetadataOnly false
    {
      label: "auditRecordMetadataOnly=false",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordMetadataOnly: false as unknown as true,
      }),
    },
    // 12. auditRecordUserContentAllowed true
    {
      label: "auditRecordUserContentAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordUserContentAllowed: true as unknown as false,
      }),
    },
    // 13. auditRecordRawTextAllowed true
    {
      label: "auditRecordRawTextAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordRawTextAllowed: true as unknown as false,
      }),
    },
    // 14. auditRecordRedactedTextAllowed true
    {
      label: "auditRecordRedactedTextAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordRedactedTextAllowed: true as unknown as false,
      }),
    },
    // 15. auditRecordModelOutputAllowed true
    {
      label: "auditRecordModelOutputAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordModelOutputAllowed: true as unknown as false,
      }),
    },
    // 16. auditRecordDocumentContentAllowed true
    {
      label: "auditRecordDocumentContentAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordDocumentContentAllowed: true as unknown as false,
      }),
    },
    // 17. auditRecordPiiAllowed true
    {
      label: "auditRecordPiiAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordPiiAllowed: true as unknown as false,
      }),
    },
    // 18. auditRecordSecretOrEnvAllowed true
    {
      label: "auditRecordSecretOrEnvAllowed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditRecordSecretOrEnvAllowed: true as unknown as false,
      }),
    },
    // 19. auditExecutionPerformed true
    {
      label: "auditExecutionPerformed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditExecutionPerformed: true as unknown as false,
      }),
    },
    // 20. auditPersistencePerformed true
    {
      label: "auditPersistencePerformed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        auditPersistencePerformed: true as unknown as false,
      }),
    },
    // 21. evidencePersistencePerformed true
    {
      label: "evidencePersistencePerformed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        evidencePersistencePerformed: true as unknown as false,
      }),
    },
    // 22. realInputProcessedByContract true
    {
      label: "realInputProcessedByContract=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        realInputProcessedByContract: true as unknown as false,
      }),
    },
    // 23. persistenceRequiresSeparateAuthorization false
    {
      label: "persistenceRequiresSeparateAuthorization=false",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        persistenceRequiresSeparateAuthorization: false as unknown as true,
      }),
    },
    // 24. postRunAuditRequiredBeforeCompletion false
    {
      label: "postRunAuditRequiredBeforeCompletion=false",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        postRunAuditRequiredBeforeCompletion: false as unknown as true,
      }),
    },
    // 25. missing operator acknowledgment
    {
      label: "missing operator acknowledgment",
      result: tamper({ operatorAuditPlanningAcknowledgment: "partial only" }),
    },
    // 26. missing reviewer acknowledgment
    {
      label: "missing reviewer acknowledgment",
      result: tamper({ reviewerAuditPlanningAcknowledgment: "partial only" }),
    },
    // 27. containsSecret true
    {
      label: "containsSecret=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 28. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 29. containsApiKey true
    {
      label: "containsApiKey=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsApiKey: true as unknown as false,
      }),
    },
    // 30. containsRawInputText true
    {
      label: "containsRawInputText=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsRawInputText: true as unknown as false,
      }),
    },
    // 31. containsRedactedText true
    {
      label: "containsRedactedText=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsRedactedText: true as unknown as false,
      }),
    },
    // 32. containsModelOutput true
    {
      label: "containsModelOutput=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsModelOutput: true as unknown as false,
      }),
    },
    // 33. containsDocumentContent true
    {
      label: "containsDocumentContent=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsDocumentContent: true as unknown as false,
      }),
    },
    // 34. containsUserPii true
    {
      label: "containsUserPii=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsUserPii: true as unknown as false,
      }),
    },
    // 35. notes includes "process.env"
    {
      label: 'notes: "process.env"',
      result: tamper({ notes: ["process.env here"] }),
    },
    // 36. notes includes "OPENAI_API_KEY="
    {
      label: 'notes: "OPENAI_API_KEY="',
      result: tamper({ notes: ["OPENAI_API_KEY=abc123"] }),
    },
    // 37. notes includes "sk-"
    {
      label: 'notes: "sk-"',
      result: tamper({ notes: ["sk-supersecret"] }),
    },
    // 38. notes includes "stored user input"
    {
      label: 'notes: "stored user input"',
      result: tamper({ notes: ["stored user input here"] }),
    },
    // 39. notes includes "stored redacted text"
    {
      label: 'notes: "stored redacted text"',
      result: tamper({ notes: ["stored redacted text here"] }),
    },
    // 40. notes includes "stored model output"
    {
      label: 'notes: "stored model output"',
      result: tamper({ notes: ["stored model output here"] }),
    },
    // 41. notes includes "stored audit record"
    {
      label: 'notes: "stored audit record"',
      result: tamper({ notes: ["stored audit record here"] }),
    },
    // 42. notes includes "stored document content"
    {
      label: 'notes: "stored document content"',
      result: tamper({ notes: ["stored document content here"] }),
    },
    // 43. notes includes "john@example.com"
    {
      label: "notes: email",
      result: tamper({ notes: ["contact john@example.com"] }),
    },
    // 44. notes includes "+49 170 1234567"
    {
      label: "notes: phone",
      result: tamper({ notes: ["call +49 170 1234567"] }),
    },
    // 45. notes includes "Aktenzeichen"
    {
      label: 'notes: "Aktenzeichen"',
      result: tamper({ notes: ["Aktenzeichen: 123"] }),
    },
    // 46. notes includes "Name:"
    {
      label: 'notes: "Name:"',
      result: tamper({ notes: ["Name: Max Mustermann"] }),
    },
    // 47. notes includes "Geburtsdatum:"
    {
      label: 'notes: "Geburtsdatum:"',
      result: tamper({ notes: ["Geburtsdatum: 01.01.1980"] }),
    },
    // 48. notes includes "Abschiebung"
    {
      label: 'notes: "Abschiebung"',
      result: tamper({ notes: ["Abschiebung droht"] }),
    },
    // 49. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 50. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 51. dnaSavePerformed true
    {
      label: "dnaSavePerformed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        dnaSavePerformed: true as unknown as false,
      }),
    },
    // 52. offlineSavePerformed true
    {
      label: "offlineSavePerformed=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        offlineSavePerformed: true as unknown as false,
      }),
    },
    // 53. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 54. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validatePostRunAuditPlanningContractInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 55. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validatePostRunAuditPlanningContractInput({
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
    evidencePolicyReady &&
    syntheticPostRunAuditPlanningAccepted &&
    tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-6",
    allPassed,
    evidencePolicyReady,
    syntheticPostRunAuditPlanningAccepted,
    tamperCasesRejected,

    readyForRealOperatorPilotAuthorizationClosure: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    auditExecutionPerformed: false,
    auditPersistencePerformed: false,
    evidencePersistencePerformed: false,
    userContentAuditStored: false,
    auditRuntimeModifiedByPlanning: false,
    databaseOrStorageModifiedByPlanning: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
