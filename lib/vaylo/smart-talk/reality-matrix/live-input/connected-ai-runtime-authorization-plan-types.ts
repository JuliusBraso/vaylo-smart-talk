/**
 * Connected AI Runtime Authorization Plan Types (Phase 8.3A).
 *
 * Defines the typed authorization plan that begins the 8.3 Connected AI
 * Runtime Authorization epoch. This plan verifies the 8.2M closure, records
 * all required prerequisites, open items, and next phases for AI runtime
 * connection, and sets only one readiness flag: `readyForLiveLLMBoundaryContract`.
 *
 * This module does NOT:
 * - read process.env
 * - call any live LLM (OpenAI, Gemini, Anthropic, or any other)
 * - authorize live LLM runtime
 * - generate AI output
 * - process actual user input or forward raw input
 * - authorize user-visible output
 * - persist audit records or evidence records
 * - store actual user content
 * - implement database or storage behavior
 * - modify DB/storage schema or API routes
 * - authorize pilotRunNow
 * - authorize public launch
 * - authorize persistence
 * - modify UI
 * - make HTTP requests
 *
 * The only authorization this plan grants is permission to proceed to the
 * next contract in sequence: the Live LLM Boundary Contract (8.3B or
 * equivalent). All other downstream authorization gates remain `false`.
 *
 * Safety invariants on ConnectedAiRuntimeAuthorizationPlanInput (literal):
 * - liveLLMRuntimeAlreadyCalled: false
 * - realInputAlreadyProcessed: false
 * - rawInputAlreadyForwarded: false
 * - aiOutputAlreadyGenerated: false
 * - modelOutputStored: false
 * - persistenceUsed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 *
 * Safety invariants on ConnectedAiRuntimeAuthorizationPlanResult (literal):
 * - readyForRedactedInputForwardingContract: false
 * - readyForAiOutputGovernanceRecheckContract: false
 * - readyForManualReviewBeforeUserVisibleOutputContract: false
 * - readyForAiConnectedSyntheticTestHarness: false
 * - readyForAiConnectedPostRunAudit: false
 * - readyForLiveLLMRuntime: false
 * - readyForRealOperatorPilotRun: false
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForPersistence: false
 * - liveLLMCalled: false
 * - realInputProcessed: false
 * - rawInputForwarded: false
 * - aiOutputGenerated: false
 * - modelOutputStored: false
 * - persistenceUsed: false
 * - publicRuntimeEnabled: false
 * - emittedToUserNow: false
 * - httpCallMade: false
 * - apiRouteCalled: false
 * - apiRouteModifiedByConnectedAiPlan: false
 * - uiTouched: false
 * - databaseOrStorageModifiedByConnectedAiPlan: false
 * - neverUserVisible: true
 */

// ── Plan status ───────────────────────────────────────────────────────────────

export type ConnectedAiRuntimeAuthorizationPlanStatus =
  | "ready_for_live_llm_boundary_contract"
  | "blocked"
  | "invalid";

// ── Blockers ──────────────────────────────────────────────────────────────────

export type ConnectedAiRuntimeAuthorizationBlocker =
  | "real_operator_pilot_authorization_not_closed"
  | "connected_ai_planning_not_authorized"
  | "live_llm_runtime_already_called"
  | "real_input_already_processed"
  | "raw_input_already_forwarded"
  | "ai_output_already_generated"
  | "model_output_stored"
  | "persistence_used"
  | "public_runtime_enabled"
  | "user_visible_output_emitted"
  | "unsafe_runtime_flag_detected";

// ── Open items ────────────────────────────────────────────────────────────────

export type ConnectedAiRuntimeAuthorizationOpenItem =
  | "live_llm_boundary_contract_required"
  | "model_provider_allowlist_contract_required"
  | "redacted_input_forwarding_contract_required"
  | "ai_output_governance_recheck_contract_required"
  | "ai_output_user_visible_authorization_contract_required"
  | "manual_review_before_user_visible_output_required"
  | "first_ai_connected_synthetic_test_harness_required"
  | "first_ai_connected_redacted_text_test_harness_required_later"
  | "ai_connected_post_run_audit_required"
  | "production_live_llm_runtime_policy_required_later"
  | "public_launch_policy_required_later"
  | "persistence_policy_required_later";

// ── Prerequisites ─────────────────────────────────────────────────────────────

export type ConnectedAiRuntimeAuthorizationPrerequisite =
  | "real_operator_pilot_authorization_closure_verified"
  | "live_llm_runtime_still_blocked"
  | "real_input_processing_still_blocked"
  | "raw_input_forwarding_still_blocked"
  | "ai_output_storage_still_blocked"
  | "user_visible_output_still_blocked"
  | "persistence_still_blocked"
  | "public_runtime_still_blocked"
  | "manual_review_required"
  | "governance_recheck_required_after_ai_output"
  | "post_run_audit_required";

// ── Next phases ───────────────────────────────────────────────────────────────

export type ConnectedAiRuntimeAuthorizationNextPhase =
  | "live_llm_boundary_contract"
  | "redacted_input_forwarding_contract"
  | "ai_output_governance_recheck_contract"
  | "manual_review_before_user_visible_output_contract"
  | "ai_connected_synthetic_test_harness"
  | "ai_connected_post_run_audit";

// ── Plan input ────────────────────────────────────────────────────────────────

/**
 * Input for the Connected AI Runtime Authorization Plan check.
 *
 * Carries the closure readiness flags from 8.2M-7, the required prerequisites,
 * open items, next phases, and safe notes. All runtime-safety flags are
 * literal `false` (or `true` for `neverUserVisible`). No user content,
 * secrets, env values, AI output, or actual pilot data is carried.
 */
export interface ConnectedAiRuntimeAuthorizationPlanInput {
  readonly planId: string;
  readonly epochId: "8.3A";
  readonly previousEpochId: "8.2M";

  readonly realOperatorPilotAuthorizationClosed: boolean;
  readonly connectedAiPlanningAuthorized: boolean;

  readonly prerequisites: readonly ConnectedAiRuntimeAuthorizationPrerequisite[];
  readonly openItems: readonly ConnectedAiRuntimeAuthorizationOpenItem[];
  readonly nextPhases: readonly ConnectedAiRuntimeAuthorizationNextPhase[];

  readonly liveLLMRuntimeAlreadyCalled: false;
  readonly realInputAlreadyProcessed: false;
  readonly rawInputAlreadyForwarded: false;
  readonly aiOutputAlreadyGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Plan result ───────────────────────────────────────────────────────────────

/**
 * Result of validating a `ConnectedAiRuntimeAuthorizationPlanInput`.
 *
 * `readyForLiveLLMBoundaryContract` is `true` only when status is
 * `"ready_for_live_llm_boundary_contract"`. All other downstream contract
 * readiness flags are literal `false` — authorization is strictly sequential
 * and no further contracts can be skipped.
 *
 * `safetySummary` stores only boolean flags derived from the input and list
 * completeness checks. No user content or sensitive data is stored.
 */
export interface ConnectedAiRuntimeAuthorizationPlanResult {
  readonly planId: string;
  readonly epochId: "8.3A";
  readonly status: ConnectedAiRuntimeAuthorizationPlanStatus;
  readonly blockers: readonly ConnectedAiRuntimeAuthorizationBlocker[];
  readonly openItems: readonly ConnectedAiRuntimeAuthorizationOpenItem[];
  readonly nextPhases: readonly ConnectedAiRuntimeAuthorizationNextPhase[];

  readonly readyForLiveLLMBoundaryContract: boolean;
  readonly readyForRedactedInputForwardingContract: false;
  readonly readyForAiOutputGovernanceRecheckContract: false;
  readonly readyForManualReviewBeforeUserVisibleOutputContract: false;
  readonly readyForAiConnectedSyntheticTestHarness: false;
  readonly readyForAiConnectedPostRunAudit: false;

  readonly readyForLiveLLMRuntime: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly httpCallMade: false;
  readonly apiRouteCalled: false;
  readonly apiRouteModifiedByConnectedAiPlan: false;
  readonly uiTouched: false;
  readonly databaseOrStorageModifiedByConnectedAiPlan: false;
  readonly neverUserVisible: true;

  readonly safetySummary: {
    readonly realOperatorPilotAuthorizationClosed: boolean;
    readonly connectedAiPlanningAuthorized: boolean;
    readonly allPrerequisitesPresent: boolean;
    readonly allOpenItemsPresent: boolean;
    readonly allNextPhasesPresent: boolean;
    readonly liveLLMRuntimeStillBlocked: boolean;
    readonly userVisibleOutputStillBlocked: boolean;
    readonly persistenceStillBlocked: boolean;
    readonly publicRuntimeStillBlocked: boolean;
  };
}

// ── Check result ──────────────────────────────────────────────────────────────

/**
 * Result of `runConnectedAiRuntimeAuthorizationPlanCheck()` (Phase 8.3A).
 *
 * `allPassed` is true when:
 * 1. The 8.2M-7 closure dependency check passed.
 * 2. The plan result status is `"ready_for_live_llm_boundary_contract"`.
 * 3. No blockers were found.
 * 4. `readyForLiveLLMBoundaryContract` is true.
 *
 * `readyForConnectedAiRuntimeExecution` is always literal `false` — this plan
 * authorizes only the next contract, not runtime execution.
 */
export interface ConnectedAiRuntimeAuthorizationPlanCheckResult {
  readonly checkId: "8.3A";
  readonly allPassed: boolean;
  readonly previousEpochClosureVerified: boolean;
  readonly planResult: ConnectedAiRuntimeAuthorizationPlanResult;

  readonly readyForLiveLLMBoundaryContract: boolean;
  readonly readyForConnectedAiRuntimeExecution: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForRealOperatorPilotRun: false;
  readonly readyForPilotRunNow: false;
  readonly readyForPublicLaunch: false;
  readonly readyForPersistence: false;

  readonly liveLLMCalled: false;
  readonly realInputProcessed: false;
  readonly rawInputForwarded: false;
  readonly aiOutputGenerated: false;
  readonly modelOutputStored: false;
  readonly persistenceUsed: false;
  readonly publicRuntimeEnabled: false;
  readonly emittedToUserNow: false;

  readonly neverUserVisible: true;
  readonly notes: readonly string[];
}

// ── Exported constants ────────────────────────────────────────────────────────

/** All prerequisites that must be confirmed in a valid plan input. */
export const CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_PREREQUISITES: readonly ConnectedAiRuntimeAuthorizationPrerequisite[] =
  [
    "real_operator_pilot_authorization_closure_verified",
    "live_llm_runtime_still_blocked",
    "real_input_processing_still_blocked",
    "raw_input_forwarding_still_blocked",
    "ai_output_storage_still_blocked",
    "user_visible_output_still_blocked",
    "persistence_still_blocked",
    "public_runtime_still_blocked",
    "manual_review_required",
    "governance_recheck_required_after_ai_output",
    "post_run_audit_required",
  ] as const;

/** All open items that must be present in a valid plan result. */
export const CONNECTED_AI_RUNTIME_AUTHORIZATION_OPEN_ITEMS: readonly ConnectedAiRuntimeAuthorizationOpenItem[] =
  [
    "live_llm_boundary_contract_required",
    "model_provider_allowlist_contract_required",
    "redacted_input_forwarding_contract_required",
    "ai_output_governance_recheck_contract_required",
    "ai_output_user_visible_authorization_contract_required",
    "manual_review_before_user_visible_output_required",
    "first_ai_connected_synthetic_test_harness_required",
    "first_ai_connected_redacted_text_test_harness_required_later",
    "ai_connected_post_run_audit_required",
    "production_live_llm_runtime_policy_required_later",
    "public_launch_policy_required_later",
    "persistence_policy_required_later",
  ] as const;

/** All next phases that must be listed in a valid plan input. */
export const CONNECTED_AI_RUNTIME_AUTHORIZATION_NEXT_PHASES: readonly ConnectedAiRuntimeAuthorizationNextPhase[] =
  [
    "live_llm_boundary_contract",
    "redacted_input_forwarding_contract",
    "ai_output_governance_recheck_contract",
    "manual_review_before_user_visible_output_contract",
    "ai_connected_synthetic_test_harness",
    "ai_connected_post_run_audit",
  ] as const;

/**
 * Notes that must appear in the plan input to confirm the operator understands
 * the scope and limitations of this authorization plan.
 */
export const CONNECTED_AI_RUNTIME_AUTHORIZATION_REQUIRED_NOTES: readonly string[] =
  [
    "Connected AI runtime planning may begin.",
    "Live LLM runtime remains blocked until a boundary contract exists.",
    "No AI output may become user-visible without governance recheck and manual review.",
    "Public launch, live LLM runtime, and persistence remain blocked.",
  ] as const;

/**
 * Strings that must never appear in any plan field or notes. Covers API keys,
 * env assignments, raw/draft text markers, stored-content phrases, PII,
 * document markers, sensitive personal markers, and high-risk legal markers.
 */
export const FORBIDDEN_CONNECTED_AI_RUNTIME_AUTHORIZATION_PLAN_STRINGS: readonly string[] =
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
