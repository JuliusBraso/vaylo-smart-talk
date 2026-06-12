/**
 * Operator and Reviewer Identity Contract Check (Phase 8.2M-1).
 *
 * Validates typed operator/reviewer identity attestation inputs and produces
 * an `OperatorReviewerIdentityContractCheckResult`.
 *
 * Sub-steps:
 *   1. Verify the 8.2M-0 authorization plan is ready.
 *   2. Build a synthetic safe input and validate it (must be accepted).
 *   3. Run 23 tamper cases and require all to be rejected.
 *
 * This module does NOT:
 * - implement authentication
 * - persist identity records
 * - authorize or execute a real pilot run
 * - store content (raw text, secrets, PII, model output, etc.)
 * - call any live LLM
 * - import or execute app/api/smart-talk/route.ts
 * - make HTTP requests
 * - read process.env
 * - modify UI
 * - auto-execute at module load time
 *
 * Invoke `runOperatorReviewerIdentityContractCheck()` explicitly.
 */

import { runRealOperatorPilotAuthorizationPlanCheck } from "./run-real-operator-pilot-authorization-plan-check";
import {
  FORBIDDEN_PILOT_IDENTITY_STRINGS,
  REQUIRED_OPERATOR_REVIEWER_RESPONSIBILITY_STATEMENTS,
} from "./operator-reviewer-identity-contract-types";
import type {
  OperatorReviewerIdentityContractCheckResult,
  OperatorReviewerIdentityContractInput,
  OperatorReviewerIdentityContractResult,
  PilotAuthorizationScope,
  PilotIdentityAttestation,
  PilotIdentityAttestationRejectionReason,
} from "./operator-reviewer-identity-contract-types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function asRec(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

const VALID_SCOPES: readonly PilotAuthorizationScope[] = [
  "real_operator_pilot_planning",
  "real_operator_pilot_preflight",
  "real_operator_pilot_single_run_review",
];

// Loose email / phone patterns used for PII detection in string fields.
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /\+?\d[\d\s\-]{7,}/;
// Authority / document markers that must not appear in identity fields.
const DOCUMENT_MARKERS = [
  "Aktenzeichen",
  "BG-Nr",
  "Steuer-ID",
  "IBAN",
  "Sehr geehrter",
];

function containsForbiddenString(value: string): boolean {
  return FORBIDDEN_PILOT_IDENTITY_STRINGS.some((f) => value.includes(f));
}

function containsPiiPattern(value: string): boolean {
  return EMAIL_PATTERN.test(value) || PHONE_PATTERN.test(value);
}

function containsDocumentMarker(value: string): boolean {
  return DOCUMENT_MARKERS.some((m) => value.includes(m));
}

function scanStrings(values: readonly string[]): boolean {
  return values.some(
    (v) =>
      containsForbiddenString(v) ||
      containsPiiPattern(v) ||
      containsDocumentMarker(v),
  );
}

function attestationStrings(a: PilotIdentityAttestation): readonly string[] {
  return [a.humanId, a.displayLabel, a.attestationStatement, ...a.notes];
}

function isValidIso(value: string): boolean {
  if (!value || value.trim() === "") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

// ── Synthetic safe input ───────────────────────────────────────────────────────

/**
 * Builds a synthetic, safe `OperatorReviewerIdentityContractInput` for use in
 * the harness check. Does not contain real identities or sensitive content.
 */
export function buildSyntheticOperatorReviewerIdentityContractInput(): OperatorReviewerIdentityContractInput {
  const operatorStatement =
    "I confirm I am a named human operator for this internal pilot planning step. " +
    "I understand this does not authorize real pilot execution. " +
    "I understand public launch, live LLM runtime, and persistence remain blocked.";

  const reviewerStatement =
    "I confirm I am a named human reviewer for this internal pilot planning step. " +
    "I understand this does not authorize real pilot execution. " +
    "I understand public launch, live LLM runtime, and persistence remain blocked.";

  return {
    contractId: "operator-reviewer-identity-contract-8-2m-1",
    pilotSessionId: "pilot-session-8-2m-synthetic-preflight",
    authorizationScope: "real_operator_pilot_preflight",

    authorizationPlanReady: true,
    operator: {
      humanId: "operator-internal-001",
      role: "operator",
      displayLabel: "Internal Operator 001",
      attestedAtIso: "2026-06-12T00:00:00.000Z",
      attestationStatement: operatorStatement,
      notes: ["synthetic safe operator identity attestation"],
    },
    reviewer: {
      humanId: "reviewer-internal-001",
      role: "reviewer",
      displayLabel: "Internal Reviewer 001",
      attestedAtIso: "2026-06-12T00:00:00.000Z",
      attestationStatement: reviewerStatement,
      notes: ["synthetic safe reviewer identity attestation"],
    },

    operatorIsNamedHuman: true,
    reviewerIsNamedHuman: true,
    operatorAndReviewerAreDistinct: true,
    operatorAcceptedResponsibilities: true,
    reviewerAcceptedResponsibilities: true,

    containsRealUserInput: false,
    containsRawInputText: false,
    containsRedactedText: false,
    containsFullDraftText: false,
    containsModelOutput: false,
    containsSecret: false,
    containsEnvValue: false,
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

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validates an `OperatorReviewerIdentityContractInput` and returns a typed
 * `OperatorReviewerIdentityContractResult`.
 *
 * Uses `asRec()` for defensive checks of literal-typed fields to guard against
 * tampered runtime values.
 */
export function validateOperatorReviewerIdentityContractInput(
  input: OperatorReviewerIdentityContractInput,
): OperatorReviewerIdentityContractResult {
  const reasons: PilotIdentityAttestationRejectionReason[] = [];
  const inputRec = asRec(input);

  // ── Rule 1: authorization plan ready ────────────────────────────────────────
  if (!input.authorizationPlanReady) {
    reasons.push("authorization_plan_not_ready");
  }

  // ── Rule 2: non-empty pilotSessionId ────────────────────────────────────────
  if (!input.pilotSessionId || input.pilotSessionId.trim() === "") {
    reasons.push("missing_pilot_session_id");
  }

  // ── Rule 3: operator identity fields non-empty ───────────────────────────────
  if (
    !input.operator.humanId ||
    input.operator.humanId.trim() === "" ||
    !input.operator.displayLabel ||
    input.operator.displayLabel.trim() === ""
  ) {
    reasons.push("missing_operator_identity");
  }

  // ── Rule 4: reviewer identity fields non-empty ───────────────────────────────
  if (
    !input.reviewer.humanId ||
    input.reviewer.humanId.trim() === "" ||
    !input.reviewer.displayLabel ||
    input.reviewer.displayLabel.trim() === ""
  ) {
    reasons.push("missing_reviewer_identity");
  }

  // ── Rule 5: operator role ────────────────────────────────────────────────────
  if (input.operator.role !== "operator") {
    reasons.push("missing_operator_role");
  }

  // ── Rule 6: reviewer role ────────────────────────────────────────────────────
  if (input.reviewer.role !== "reviewer") {
    reasons.push("missing_reviewer_role");
  }

  // ── Rule 7: named human flags ────────────────────────────────────────────────
  if (!input.operatorIsNamedHuman) {
    reasons.push("missing_operator_identity");
  }
  if (!input.reviewerIsNamedHuman) {
    reasons.push("missing_reviewer_identity");
  }

  // ── Rule 8 & 9: distinct operator and reviewer ───────────────────────────────
  if (
    !input.operatorAndReviewerAreDistinct ||
    input.operator.humanId === input.reviewer.humanId
  ) {
    reasons.push("same_operator_and_reviewer");
  }

  // ── Rule 10: accepted responsibilities ──────────────────────────────────────
  if (!input.operatorAcceptedResponsibilities) {
    reasons.push("missing_operator_attestation");
  }
  if (!input.reviewerAcceptedResponsibilities) {
    reasons.push("missing_reviewer_attestation");
  }

  // ── Rule 11: valid authorization scope ──────────────────────────────────────
  if (!VALID_SCOPES.includes(input.authorizationScope)) {
    reasons.push("missing_authorization_scope");
  }

  // ── Rule 12: valid ISO dates ─────────────────────────────────────────────────
  if (
    !isValidIso(input.operator.attestedAtIso) ||
    !isValidIso(input.reviewer.attestedAtIso)
  ) {
    reasons.push("invalid_attestation_timestamp");
  }

  // ── Rule 13: required responsibility statements ──────────────────────────────
  const operatorStmt = REQUIRED_OPERATOR_REVIEWER_RESPONSIBILITY_STATEMENTS[0];
  const reviewerStmt = REQUIRED_OPERATOR_REVIEWER_RESPONSIBILITY_STATEMENTS[1];
  if (
    !operatorStmt ||
    !input.operator.attestationStatement.includes(operatorStmt)
  ) {
    reasons.push("missing_operator_attestation");
  }
  if (
    !reviewerStmt ||
    !input.reviewer.attestationStatement.includes(reviewerStmt)
  ) {
    reasons.push("missing_reviewer_attestation");
  }

  // ── Rule 14: contains* flags must all be false ───────────────────────────────
  if (inputRec["containsSecret"] === true) {
    reasons.push("forbidden_secret_detected");
  }
  if (inputRec["containsEnvValue"] === true) {
    reasons.push("forbidden_env_value_detected");
  }
  if (inputRec["containsUserPii"] === true) {
    reasons.push("forbidden_pii_detected");
  }
  if (inputRec["containsRawInputText"] === true) {
    reasons.push("forbidden_raw_text_detected");
  }
  if (inputRec["containsDocumentContent"] === true) {
    reasons.push("forbidden_document_content_detected");
  }
  if (inputRec["containsRealUserInput"] === true) {
    reasons.push("real_user_input_detected");
  }
  if (
    inputRec["containsRedactedText"] === true ||
    inputRec["containsFullDraftText"] === true ||
    inputRec["containsModelOutput"] === true
  ) {
    reasons.push("forbidden_raw_text_detected");
  }

  // ── Rule 15: runtime safety flags must be false ──────────────────────────────
  if (inputRec["persistenceUsed"] === true) {
    reasons.push("persistence_claim_detected");
  }
  if (inputRec["liveLLMCalled"] === true) {
    reasons.push("live_llm_claim_detected");
  }
  if (inputRec["publicRuntimeEnabled"] === true) {
    reasons.push("public_runtime_claim_detected");
  }
  if (
    inputRec["emittedToUserNow"] === true ||
    inputRec["userVisibleOutputAllowed"] === true
  ) {
    reasons.push("user_visible_output_claim_detected");
  }

  // ── Rule 16-18: scan all string fields for forbidden content ─────────────────
  const operatorStrings = attestationStrings(input.operator);
  const reviewerStrings = attestationStrings(input.reviewer);
  const allStrings = [
    input.contractId,
    input.pilotSessionId,
    ...operatorStrings,
    ...reviewerStrings,
  ];

  for (const s of allStrings) {
    if (containsForbiddenString(s)) {
      // Differentiate by content type
      if (
        s.includes("sk-") ||
        s.includes("OPENAI_API_KEY") ||
        s.includes("VAYLO_INTERNAL_RUNTIME_SECRET") ||
        s.includes("apiKey") ||
        s.includes("internalSecret")
      ) {
        if (!reasons.includes("forbidden_secret_detected")) {
          reasons.push("forbidden_secret_detected");
        }
      } else if (
        s.includes("process.env") ||
        s.includes("OPENAI_API_KEY") ||
        s.includes("VAYLO_INTERNAL_RUNTIME_SECRET")
      ) {
        if (!reasons.includes("forbidden_env_value_detected")) {
          reasons.push("forbidden_env_value_detected");
        }
      } else if (
        s.includes("rawInputText") ||
        s.includes("redactedText") ||
        s.includes("fullDraftText") ||
        s.includes("modelOutput") ||
        s.includes("SYNTHETIC_TEXT_NEVER_REAL_USER_DATA")
      ) {
        if (!reasons.includes("forbidden_raw_text_detected")) {
          reasons.push("forbidden_raw_text_detected");
        }
      } else {
        if (!reasons.includes("unsafe_notes_detected")) {
          reasons.push("unsafe_notes_detected");
        }
      }
    }

    if (containsPiiPattern(s)) {
      if (!reasons.includes("forbidden_pii_detected")) {
        reasons.push("forbidden_pii_detected");
      }
    }

    if (containsDocumentMarker(s)) {
      if (!reasons.includes("forbidden_document_content_detected")) {
        reasons.push("forbidden_document_content_detected");
      }
    }
  }

  // Check operator and reviewer notes for unsafe strings separately
  if (
    scanStrings(input.operator.notes) &&
    !reasons.includes("unsafe_notes_detected") &&
    !reasons.includes("forbidden_secret_detected") &&
    !reasons.includes("forbidden_pii_detected") &&
    !reasons.includes("forbidden_document_content_detected")
  ) {
    reasons.push("unsafe_notes_detected");
  }
  if (
    scanStrings(input.reviewer.notes) &&
    !reasons.includes("unsafe_notes_detected") &&
    !reasons.includes("forbidden_secret_detected") &&
    !reasons.includes("forbidden_pii_detected") &&
    !reasons.includes("forbidden_document_content_detected")
  ) {
    reasons.push("unsafe_notes_detected");
  }

  // Check identifier-level unsafe content
  if (
    containsForbiddenString(input.operator.humanId) ||
    containsPiiPattern(input.operator.humanId) ||
    containsDocumentMarker(input.operator.humanId)
  ) {
    if (!reasons.includes("unsafe_operator_identifier")) {
      reasons.push("unsafe_operator_identifier");
    }
  }
  if (
    containsForbiddenString(input.reviewer.humanId) ||
    containsPiiPattern(input.reviewer.humanId) ||
    containsDocumentMarker(input.reviewer.humanId)
  ) {
    if (!reasons.includes("unsafe_reviewer_identifier")) {
      reasons.push("unsafe_reviewer_identifier");
    }
  }

  // ── Build result ─────────────────────────────────────────────────────────────
  const accepted = reasons.length === 0;
  const status = accepted ? ("valid" as const) : ("rejected" as const);

  return {
    contractId: input.contractId,
    status,
    accepted,
    rejectionReasons: reasons,

    safeIdentityMetadata: {
      pilotSessionId: input.pilotSessionId,
      authorizationScope: input.authorizationScope,
      operatorHumanId: input.operator.humanId,
      reviewerHumanId: input.reviewer.humanId,
      operatorRole: "operator",
      reviewerRole: "reviewer",
      operatorAttestedAtIso: input.operator.attestedAtIso,
      reviewerAttestedAtIso: input.reviewer.attestedAtIso,
    },

    readyForRealEnvironmentAttestationContract: accepted,
    readyForAbortProtocol: accepted,
    readyForRealInputPolicy: accepted,
    readyForEvidencePolicy: accepted,
    readyForPostRunAuditPlanning: accepted,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    rawTextStored: false,
    redactedTextStored: false,
    fullDraftTextStored: false,
    modelOutputStored: false,
    secretStored: false,
    envValueStored: false,
    userPiiStored: false,
    documentContentStored: false,

    httpCallMade: false,
    apiRouteCalled: false,
    liveLLMCalled: false,
    apiRouteModifiedByIdentityContract: false,
    uiTouched: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  };
}

// ── Contract check ─────────────────────────────────────────────────────────────

/**
 * Runs the full Operator and Reviewer Identity Contract check for Phase 8.2M-1.
 *
 * Calls `runRealOperatorPilotAuthorizationPlanCheck()` (8.2M-0), validates a
 * synthetic safe input, and runs 23 tamper cases to prove rejection works.
 *
 * Does NOT auto-execute at module load. Must be called explicitly.
 */
export function runOperatorReviewerIdentityContractCheck(): OperatorReviewerIdentityContractCheckResult {
  const notes: string[] = [];

  // ── Step 1: Verify the 8.2M-0 authorization plan ─────────────────────────

  const plan = runRealOperatorPilotAuthorizationPlanCheck();
  const planRec = asRec(plan);

  const authorizationPlanReady =
    plan.status === "ready_for_phase_8_2m_1" &&
    plan.previousEpochClosureVerified === true &&
    plan.readyForOperatorIdentityContract === true &&
    planRec["readyForRealOperatorPilotRun"] !== true &&
    planRec["readyForPilotRunNow"] !== true &&
    planRec["readyForPublicLaunch"] !== true &&
    planRec["readyForLiveLLMRuntime"] !== true &&
    planRec["readyForPersistence"] !== true &&
    planRec["realPilotRunExecuted"] !== true &&
    planRec["realUserInputProcessed"] !== true &&
    planRec["liveLLMCalled"] !== true &&
    planRec["persistenceUsed"] !== true &&
    planRec["emittedToUserNow"] !== true &&
    planRec["neverUserVisible"] === true;

  notes.push(`authorizationPlanReady: ${String(authorizationPlanReady)}`);
  notes.push(`plan.status: ${plan.status}`);
  notes.push(
    `plan.previousEpochClosureVerified: ${String(plan.previousEpochClosureVerified)}`,
  );

  // ── Step 2: Validate the synthetic safe input ─────────────────────────────

  const syntheticInput = buildSyntheticOperatorReviewerIdentityContractInput();
  const syntheticResult = validateOperatorReviewerIdentityContractInput(syntheticInput);
  const syntheticIdentityAccepted = syntheticResult.accepted;

  notes.push(
    `syntheticIdentityAccepted: ${String(syntheticIdentityAccepted)}`,
  );
  if (!syntheticIdentityAccepted) {
    notes.push(
      `syntheticRejectionReasons: ${syntheticResult.rejectionReasons.join(", ")}`,
    );
  }

  // ── Step 3: Tamper cases (23) — all must be rejected ─────────────────────

  type MutableInput = {
    -readonly [K in keyof OperatorReviewerIdentityContractInput]: OperatorReviewerIdentityContractInput[K];
  };

  function tamper(
    overrides: Partial<MutableInput>,
  ): OperatorReviewerIdentityContractResult {
    return validateOperatorReviewerIdentityContractInput({
      ...syntheticInput,
      ...overrides,
    } as OperatorReviewerIdentityContractInput);
  }

  function tamperOperator(
    overrides: Partial<PilotIdentityAttestation>,
  ): OperatorReviewerIdentityContractResult {
    return tamper({
      operator: { ...syntheticInput.operator, ...overrides },
    });
  }

  function tamperReviewer(
    overrides: Partial<PilotIdentityAttestation>,
  ): OperatorReviewerIdentityContractResult {
    return tamper({
      reviewer: { ...syntheticInput.reviewer, ...overrides },
    });
  }

  const tamperCases: Array<{
    label: string;
    result: OperatorReviewerIdentityContractResult;
  }> = [
    // 1. authorizationPlanReady false
    { label: "authorizationPlanReady=false", result: tamper({ authorizationPlanReady: false }) },
    // 2. empty pilotSessionId
    { label: "empty pilotSessionId", result: tamper({ pilotSessionId: "" }) },
    // 3. empty operator humanId
    { label: "empty operator humanId", result: tamperOperator({ humanId: "" }) },
    // 4. empty reviewer humanId
    { label: "empty reviewer humanId", result: tamperReviewer({ humanId: "" }) },
    // 5. operator role set to reviewer
    { label: "operator role=reviewer", result: tamperOperator({ role: "reviewer" }) },
    // 6. reviewer role set to operator
    { label: "reviewer role=operator", result: tamperReviewer({ role: "operator" }) },
    // 7. same humanId
    {
      label: "same humanId",
      result: tamperReviewer({ humanId: syntheticInput.operator.humanId }),
    },
    // 8. operatorAndReviewerAreDistinct false
    { label: "operatorAndReviewerAreDistinct=false", result: tamper({ operatorAndReviewerAreDistinct: false }) },
    // 9. invalid operator attestedAtIso
    { label: "invalid operator ISO", result: tamperOperator({ attestedAtIso: "not-a-date" }) },
    // 10. missing operator attestation statement
    { label: "missing operator statement", result: tamperOperator({ attestationStatement: "unrelated statement" }) },
    // 11. missing reviewer attestation statement
    { label: "missing reviewer statement", result: tamperReviewer({ attestationStatement: "unrelated statement" }) },
    // 12. containsSecret true
    {
      label: "containsSecret=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        containsSecret: true as unknown as false,
      }),
    },
    // 13. containsEnvValue true
    {
      label: "containsEnvValue=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        containsEnvValue: true as unknown as false,
      }),
    },
    // 14. notes includes "process.env"
    {
      label: 'notes includes "process.env"',
      result: tamperOperator({ notes: ["process.env value here"] }),
    },
    // 15. notes includes "OPENAI_API_KEY"
    {
      label: 'notes includes "OPENAI_API_KEY"',
      result: tamperOperator({ notes: ["OPENAI_API_KEY=something"] }),
    },
    // 16. notes includes "john@example.com"
    {
      label: 'notes includes "john@example.com"',
      result: tamperOperator({ notes: ["contact john@example.com"] }),
    },
    // 17. notes includes "+49 170 1234567"
    {
      label: 'notes includes "+49 170 1234567"',
      result: tamperOperator({ notes: ["call +49 170 1234567"] }),
    },
    // 18. notes includes "Aktenzeichen"
    {
      label: 'notes includes "Aktenzeichen"',
      result: tamperOperator({ notes: ["Aktenzeichen: 123"] }),
    },
    // 19. containsRealUserInput true
    {
      label: "containsRealUserInput=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        containsRealUserInput: true as unknown as false,
      }),
    },
    // 20. persistenceUsed true
    {
      label: "persistenceUsed=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        persistenceUsed: true as unknown as false,
      }),
    },
    // 21. liveLLMCalled true
    {
      label: "liveLLMCalled=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        liveLLMCalled: true as unknown as false,
      }),
    },
    // 22. publicRuntimeEnabled true
    {
      label: "publicRuntimeEnabled=true",
      result: validateOperatorReviewerIdentityContractInput({
        ...syntheticInput,
        publicRuntimeEnabled: true as unknown as false,
      }),
    },
    // 23. emittedToUserNow true
    {
      label: "emittedToUserNow=true",
      result: validateOperatorReviewerIdentityContractInput({
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
  notes.push(`tamperCasesRejected: ${String(tamperCasesRejected)} (${String(tamperCases.length)} cases)`);

  // ── Final result ──────────────────────────────────────────────────────────

  const allPassed =
    authorizationPlanReady && syntheticIdentityAccepted && tamperCasesRejected;

  notes.push(`allPassed: ${String(allPassed)}`);

  return {
    checkId: "8.2M-1",
    allPassed,
    authorizationPlanReady,
    syntheticIdentityAccepted,
    tamperCasesRejected,

    readyForRealEnvironmentAttestationContract: allPassed,
    readyForAbortProtocol: allPassed,
    readyForRealInputPolicy: allPassed,
    readyForEvidencePolicy: allPassed,
    readyForPostRunAuditPlanning: allPassed,

    readyForRealOperatorPilotRun: false,
    readyForPilotRunNow: false,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,

    realPilotRunExecuted: false,
    realUserInputProcessed: false,
    liveLLMCalled: false,
    persistenceUsed: false,
    emittedToUserNow: false,
    neverUserVisible: true,

    notes,
  };
}
