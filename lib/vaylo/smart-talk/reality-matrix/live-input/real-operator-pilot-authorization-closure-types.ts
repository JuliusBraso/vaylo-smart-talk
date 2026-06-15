/**
 * Real Operator Pilot Authorization Closure Types (Phase 8.2M-7).
 *
 * Defines the formal closure types for the 8.2M epoch. This closure
 * verifies that all authorization prerequisite contracts (8.2M-1 through
 * 8.2M-6) have passed, collects the final closure verdict, identifies open
 * items that must be addressed in future epochs, and sets readiness flags
 * for next epoch planning.
 *
 * This module does NOT:
 * - read process.env
 * - execute a real operator pilot
 * - authorize pilotRunNow
 * - authorize live LLM runtime
 * - authorize persistence
 * - authorize public launch
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema or API routes
 * - process actual user input or forward raw input
 * - call any live LLM or make HTTP requests
 * - modify UI
 *
 * Safety invariants on RealOperatorPilotAuthorizationClosureInput (literal):
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - rawInputForwarded: false
 * - auditExecutionPerformed: false
 * - auditPersistencePerformed: false
 * - evidencePersistencePerformed: false
 * - userContentStored: false
 * - userContentAuditStored: false
 * - userContentEvidenceStored: false
 * - liveLLMCalled: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Safety invariants on RealOperatorPilotAuthorizationClosureResult (literal):
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - realPilotRunExecuted: false
 * - realUserInputProcessed: false
 * - rawInputForwarded: false
 * - auditExecutionPerformed: false
 * - auditPersistencePerformed: false
 * - evidencePersistencePerformed: false
 * - userContentStored: false
 * - userContentAuditStored: false
 * - userContentEvidenceStored: false
 * - liveLLMCalled: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByClosure: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByClosure: false
 * - neverUserVisible: true
 */

// ── Verdict ──────────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationClosureVerdict =
  | "closed_with_warnings"
  | "blocked"
  | "invalid";

// ── Blockers ─────────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationClosureBlocker =
  | "previous_epoch_not_closed"
  | "authorization_plan_not_ready"
  | "operator_reviewer_identity_not_ready"
  | "real_environment_attestation_not_ready"
  | "abort_protocol_not_ready"
  | "real_input_policy_not_ready"
  | "evidence_policy_not_ready"
  | "post_run_audit_planning_not_ready"
  | "real_pilot_run_already_executed"
  | "real_input_processed"
  | "raw_input_forwarded"
  | "audit_or_evidence_persisted"
  | "user_content_stored"
  | "live_llm_called"
  | "persistence_used"
  | "dna_save_performed"
  | "offline_save_performed"
  | "public_runtime_enabled"
  | "user_visible_output_emitted"
  | "unsafe_runtime_flag_detected";

// ── Open items ────────────────────────────────────────────────────────────────

export type RealOperatorPilotAuthorizationClosureOpenItem =
  | "real_operator_pilot_runtime_execution_contract_required"
  | "connected_ai_runtime_authorization_required"
  | "live_llm_boundary_contract_required"
  | "redacted_input_forwarding_contract_required"
  | "ai_output_governance_recheck_contract_required"
  | "manual_review_execution_protocol_required"
  | "post_run_audit_execution_protocol_required"
  | "production_persistence_policy_required_later"
  | "public_launch_policy_required_later";

// ── Closure input ─────────────────────────────────────────────────────────────

/**
 * Input for the real operator pilot authorization closure check.
 *
 * Carries only the readiness flags from prior contracts, safe notes, and
 * epoch identifiers. All runtime-safety flags are literal `false` (or `true`
 * for `neverUserVisible`). No user content, secrets, env values, or actual
 * pilot run data is carried.
 */
export interface RealOperatorPilotAuthorizationClosureInput {
  readonly closureId: string;
  readonly epochId: "8.2M";
  readonly previousEpochId: "8.2L";

  readonly previousEpochClosed: boolean;
  readonly authorizationPlanReady: boolean;
  readonly operatorReviewerIdentityReady: boolean;
  readonly realEnvironmentAttestationReady: boolean;
  readonly abortProtocolReady: boolean;
  readonly realInputPolicyReady: boolean;
  readonly evidencePolicyReady: boolean;
  readonly postRunAuditPlanningReady: boolean;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentStored: false;
  readonly userContentAuditStored: false;
  readonly userContentEvidenceStored: false;

  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Closure result ────────────────────────────────────────────────────────────

/**
 * Result of validating a `RealOperatorPilotAuthorizationClosureInput`.
 *
 * `safetySummary` records which authorization prerequisite contracts were
 * ready; no user content or sensitive data is stored.
 *
 * `readyForNextEpochPlanning`, `readyForConnectedAiRuntimeAuthorizationPlanning`,
 * and `readyForRealOperatorPilotRuntimeExecutionPlanning` are `true` only when
 * `closedWithWarnings === true`. All execution/launch/persistence flags are
 * literal `false`.
 */
export interface RealOperatorPilotAuthorizationClosureResult {
  readonly closureId: string;
  readonly epochId: "8.2M";
  readonly verdict: RealOperatorPilotAuthorizationClosureVerdict;
  readonly blockers: readonly RealOperatorPilotAuthorizationClosureBlocker[];
  readonly openItems: readonly RealOperatorPilotAuthorizationClosureOpenItem[];

  readonly closedWithWarnings: boolean;
  readonly readyForNextEpochPlanning: boolean;

  readonly readyForConnectedAiRuntimeAuthorizationPlanning: boolean;
  readonly readyForRealOperatorPilotRuntimeExecutionPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentStored: false;
  readonly userContentAuditStored: false;
  readonly userContentEvidenceStored: false;

  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByClosure: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByClosure: false;

  readonly neverUserVisible: true;

  readonly safetySummary: {
    readonly previousEpochClosed: boolean;
    readonly authorizationPlanReady: boolean;
    readonly operatorReviewerIdentityReady: boolean;
    readonly realEnvironmentAttestationReady: boolean;
    readonly abortProtocolReady: boolean;
    readonly realInputPolicyReady: boolean;
    readonly evidencePolicyReady: boolean;
    readonly postRunAuditPlanningReady: boolean;
    readonly allAuthorizationContractsReady: boolean;
  };
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runRealOperatorPilotAuthorizationClosure()` (Phase 8.2M-7).
 *
 * `allPassed` is true when:
 * 1. The 8.2M-6 post-run audit planning dependency check passed.
 * 2. The closure result verdict is `"closed_with_warnings"`.
 * 3. No blockers were found.
 * 4. `readyForNextEpochPlanning`, `readyForConnectedAiRuntimeAuthorizationPlanning`,
 *    and `readyForRealOperatorPilotRuntimeExecutionPlanning` are all true.
 *
 * `readyForRealOperatorPilotRun` is always literal `false`. This closure
 * allows next epoch planning only — not actual pilot execution.
 */
export interface RealOperatorPilotAuthorizationClosureCheckResult {
  readonly checkId: "8.2M-7";
  readonly allPassed: boolean;
  readonly closureResult: RealOperatorPilotAuthorizationClosureResult;

  readonly previousEpochClosed: boolean;
  readonly postRunAuditPlanningReady: boolean;

  readonly readyForNextEpochPlanning: boolean;
  readonly readyForConnectedAiRuntimeAuthorizationPlanning: boolean;
  readonly readyForRealOperatorPilotRuntimeExecutionPlanning: boolean;

  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;

  readonly realPilotRunExecuted: false;
  readonly realUserInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly auditExecutionPerformed: false;
  readonly auditPersistencePerformed: false;
  readonly evidencePersistencePerformed: false;
  readonly userContentStored: false;

  readonly liveLLMCalled: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;

  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All open items that must accompany a successful closure result. */
export const REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_OPEN_ITEMS: readonly RealOperatorPilotAuthorizationClosureOpenItem[] =
  [
    "real_operator_pilot_runtime_execution_contract_required",
    "connected_ai_runtime_authorization_required",
    "live_llm_boundary_contract_required",
    "redacted_input_forwarding_contract_required",
    "ai_output_governance_recheck_contract_required",
    "manual_review_execution_protocol_required",
    "post_run_audit_execution_protocol_required",
    "production_persistence_policy_required_later",
    "public_launch_policy_required_later",
  ] as const;

/**
 * Notes that must appear in the closure input to confirm the operator
 * understands the scope and limitations of this closure.
 */
export const REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_REQUIRED_NOTES: readonly string[] =
  [
    "8.2M authorization prerequisites are closed with warnings.",
    "Real operator pilot execution still requires a separate runtime execution contract.",
    "Connected AI runtime authorization still requires a separate next epoch.",
    "Public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any closure field or notes. Covers
 * API keys, env assignments, raw/draft text markers, audit-content phrases,
 * PII, document markers, sensitive personal markers, and high-risk legal
 * markers.
 */
export const FORBIDDEN_REAL_OPERATOR_PILOT_AUTHORIZATION_CLOSURE_STRINGS: readonly string[] =
  [
    "sk-",
    "OPENAI_API_KEY=",
    "VAYLO_INTERNAL_RUNTIME_SECRET=",
    "process.env",
    "apiKey",
    "internalSecret",
    "rawInputText",
    "redactedText",
    "fullDraftText",
    "modelOutput",
    "stored user input",
    "stored redacted text",
    "stored model output",
    "IBAN",
    "Steuer-ID",
    "Aktenzeichen",
    "Sehr geehrter",
    "BG-Nr",
    "john@example.com",
    "+49 170 1234567",
    "Name:",
    "Adresse:",
    "Geburtsdatum:",
    "Kind:",
    "Mietvertrag",
    "Kündigung",
    "Abschiebung",
  ] as const;
