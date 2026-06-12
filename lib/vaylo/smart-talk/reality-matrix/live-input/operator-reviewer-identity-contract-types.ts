/**
 * Operator and Reviewer Identity Contract Types (Phase 8.2M-1).
 *
 * Defines the typed safety contract for named human operator and reviewer
 * identity attestation required before any real operator pilot run.
 *
 * This module does NOT:
 * - implement authentication
 * - persist identity records
 * - authorize a real pilot run
 * - store content (raw text, secrets, PII, model output, env values, etc.)
 * - call any live LLM
 * - make HTTP requests
 * - read process.env
 * - modify API routes or UI
 *
 * This contract only defines what a named human operator and a named human
 * reviewer must attest to before real operator pilot authorization can proceed.
 *
 * Safety invariants on OperatorReviewerIdentityContractInput (all literal):
 * - containsRealUserInput: false
 * - containsRawInputText: false
 * - containsRedactedText: false
 * - containsFullDraftText: false
 * - containsModelOutput: false
 * - containsSecret: false
 * - containsEnvValue: false
 * - containsUserPii: false
 * - containsDocumentContent: false
 * - persistenceUsed: false
 * - publicRuntimeEnabled: false
 * - liveLLMCalled: false
 * - emittedToUserNow: false
 * - userVisibleOutputAllowed: false
 * - neverUserVisible: true
 *
 * Safety invariants on OperatorReviewerIdentityContractResult (all literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - rawTextStored: false
 * - redactedTextStored: false
 * - fullDraftTextStored: false
 * - modelOutputStored: false
 * - secretStored: false
 * - envValueStored: false
 * - userPiiStored: false
 * - documentContentStored: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByIdentityContract: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Status ─────────────────────────────────────────────────────────────────────

export type OperatorReviewerIdentityContractStatus = "valid" | "rejected";

// ── Roles and scope ────────────────────────────────────────────────────────────

export type PilotHumanRole = "operator" | "reviewer";

export type PilotAuthorizationScope =
  | "real_operator_pilot_planning"
  | "real_operator_pilot_preflight"
  | "real_operator_pilot_single_run_review";

// ── Rejection reasons ──────────────────────────────────────────────────────────

export type PilotIdentityAttestationRejectionReason =
  | "authorization_plan_not_ready"
  | "missing_pilot_session_id"
  | "missing_operator_identity"
  | "missing_reviewer_identity"
  | "missing_operator_role"
  | "missing_reviewer_role"
  | "missing_operator_attestation"
  | "missing_reviewer_attestation"
  | "missing_authorization_scope"
  | "same_operator_and_reviewer"
  | "invalid_attestation_timestamp"
  | "unsafe_operator_identifier"
  | "unsafe_reviewer_identifier"
  | "forbidden_secret_detected"
  | "forbidden_env_value_detected"
  | "forbidden_pii_detected"
  | "forbidden_raw_text_detected"
  | "forbidden_document_content_detected"
  | "real_user_input_detected"
  | "persistence_claim_detected"
  | "live_llm_claim_detected"
  | "public_runtime_claim_detected"
  | "user_visible_output_claim_detected"
  | "unsafe_notes_detected";

// ── Identity attestation ───────────────────────────────────────────────────────

export interface PilotIdentityAttestation {
  readonly humanId: string;
  readonly role: PilotHumanRole;
  readonly displayLabel: string;
  readonly attestedAtIso: string;
  readonly attestationStatement: string;
  readonly notes: readonly string[];
}

// ── Contract input ─────────────────────────────────────────────────────────────

/**
 * Input contract for operator/reviewer identity attestation.
 *
 * All `contains*` and runtime-safety flags are literal `false` — they cannot
 * carry content or enable unsafe runtime modes. The contract carries only safe
 * metadata: identifiers, roles, scopes, and attestation statements.
 */
export interface OperatorReviewerIdentityContractInput {
  readonly contractId: string;
  readonly pilotSessionId: string;
  readonly authorizationScope: PilotAuthorizationScope;

  readonly authorizationPlanReady: boolean;
  readonly operator: PilotIdentityAttestation;
  readonly reviewer: PilotIdentityAttestation;

  readonly operatorIsNamedHuman: boolean;
  readonly reviewerIsNamedHuman: boolean;
  readonly operatorAndReviewerAreDistinct: boolean;
  readonly operatorAcceptedResponsibilities: boolean;
  readonly reviewerAcceptedResponsibilities: boolean;

  readonly containsRealUserInput: false;
  readonly containsRawInputText: false;
  readonly containsRedactedText: false;
  readonly containsFullDraftText: false;
  readonly containsModelOutput: false;
  readonly containsSecret: false;
  readonly containsEnvValue: false;
  readonly containsUserPii: false;
  readonly containsDocumentContent: false;

  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly liveLLMCalled: false;
  readonly emittedToUserNow: false;
  readonly userVisibleOutputAllowed: false;

  readonly neverUserVisible: true;
}

// ── Contract result ────────────────────────────────────────────────────────────

/**
 * Result of validating an `OperatorReviewerIdentityContractInput`.
 *
 * `safeIdentityMetadata` stores only safe, non-sensitive metadata (IDs, roles,
 * scope, timestamps). No raw text, secrets, PII, or document content is stored.
 *
 * Planning readiness flags may be `true` only when `accepted === true`.
 * All runtime/safety flags are literal types.
 */
export interface OperatorReviewerIdentityContractResult {
  readonly contractId: string;
  readonly status: OperatorReviewerIdentityContractStatus;
  readonly accepted: boolean;
  readonly rejectionReasons: readonly PilotIdentityAttestationRejectionReason[];

  readonly safeIdentityMetadata: {
    readonly pilotSessionId: string;
    readonly authorizationScope: PilotAuthorizationScope;
    readonly operatorHumanId: string;
    readonly reviewerHumanId: string;
    readonly operatorRole: "operator";
    readonly reviewerRole: "reviewer";
    readonly operatorAttestedAtIso: string;
    readonly reviewerAttestedAtIso: string;
  };

  readonly readyForRealEnvironmentAttestationContract: boolean;
  readonly readyForAbortProtocol: boolean;
  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawTextStored: false;
  readonly redactedTextStored: false;
  readonly fullDraftTextStored: false;
  readonly modelOutputStored: false;
  readonly secretStored: false;
  readonly envValueStored: false;
  readonly userPiiStored: false;
  readonly documentContentStored: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByIdentityContract: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Check result ───────────────────────────────────────────────────────────────

/**
 * Result of `runOperatorReviewerIdentityContractCheck()` (Phase 8.2M-1).
 *
 * `allPassed` is true when all three sub-checks succeed:
 * 1. The 8.2M-0 authorization plan is ready.
 * 2. The synthetic identity input is accepted.
 * 3. All tamper cases are rejected.
 *
 * Planning readiness flags may be `true` only when `allPassed === true`.
 */
export interface OperatorReviewerIdentityContractCheckResult {
  readonly checkId: "8.2M-1";
  readonly allPassed: boolean;
  readonly authorizationPlanReady: boolean;
  readonly syntheticIdentityAccepted: boolean;
  readonly tamperCasesRejected: boolean;

  readonly readyForRealEnvironmentAttestationContract: boolean;
  readonly readyForAbortProtocol: boolean;
  readonly readyForRealInputPolicy: boolean;
  readonly readyForEvidencePolicy: boolean;
  readonly readyForPostRunAuditPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ─────────────────────────────────────────────────────────

/**
 * Strings that must never appear in any identity field, attestation statement,
 * or notes — including secrets, env var names, PII markers, and raw/document
 * content markers.
 */
export const FORBIDDEN_PILOT_IDENTITY_STRINGS: readonly string[] = [
  "sk-",
  "OPENAI_API_KEY",
  "VAYLO_INTERNAL_RUNTIME_SECRET",
  "process.env",
  "apiKey",
  "internalSecret",
  "SYNTHETIC_TEXT_NEVER_REAL_USER_DATA",
  "rawInputText",
  "redactedText",
  "fullDraftText",
  "modelOutput",
  "IBAN",
  "Steuer-ID",
  "Aktenzeichen",
  "Sehr geehrter",
  "BG-Nr",
  "john@example.com",
  "+49 170 1234567",
] as const;

/**
 * Required attestation statements. The operator's `attestationStatement` must
 * include the operator statement; the reviewer's must include the reviewer
 * statement. Both must include the shared understanding statements.
 */
export const REQUIRED_OPERATOR_REVIEWER_RESPONSIBILITY_STATEMENTS: readonly string[] =
  [
    "I confirm I am a named human operator for this internal pilot planning step.",
    "I confirm I am a named human reviewer for this internal pilot planning step.",
    "I understand this does not authorize real pilot execution.",
    "I understand public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;
