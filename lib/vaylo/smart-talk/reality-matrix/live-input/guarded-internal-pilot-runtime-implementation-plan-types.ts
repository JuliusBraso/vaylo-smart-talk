/**
 * Guarded Internal Pilot Runtime Implementation Plan types (Phase 8.2K-0).
 *
 * Planning-only phase. Defines the type system and plan constant for the
 * 8.2K guarded internal pilot runtime implementation epoch.
 *
 * This module does NOT:
 * - implement the runtime
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 * - enable public runtime
 * - process actual user input
 *
 * The `GUARDED_INTERNAL_PILOT_RUNTIME_IMPLEMENTATION_PLAN_V1` constant
 * specifies the full scope, required contracts, required guards, blocked
 * capabilities, and ordered implementation phases for the 8.2K epoch.
 *
 * Safety invariants (literal types on the plan constant):
 * - readyForRuntimeImplementation: false
 * - readyForApiRouteModification: false
 * - readyForRuntimeExecution: false
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModified: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Plan status ───────────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeImplementationPlanStatus =
  | "planned"
  | "blocked_until_runtime_contract"
  | "ready_for_phase_8_2k_1";

// ── Implementation scope ──────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeImplementationScope =
  | "guarded_internal_api_branch"
  | "controlled_text_pilot_mode_only"
  | "pilot_scenario_allowlist_runtime_check"
  | "internal_secret_header_check"
  | "internal_guard_phrase_check"
  | "kill_switch_runtime_check"
  | "no_public_runtime"
  | "no_persistence_runtime"
  | "no_dna_save_runtime"
  | "no_offline_save_runtime"
  | "no_live_llm_until_future_guarded_phase"
  | "manual_evidence_record_validation_boundary";

// ── Required contracts ────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeRequiredContract =
  | "pilot_request_contract"
  | "pilot_response_contract"
  | "pilot_runtime_guard_result"
  | "pilot_failure_result"
  | "pilot_evidence_validation_result"
  | "pilot_no_persistence_result"
  | "pilot_runtime_closure_audit_result";

// ── Required guards ───────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeRequiredGuard =
  | "feature_flag_enabled"
  | "controlled_text_pilot_flag_enabled"
  | "kill_switch_disabled"
  | "internal_runtime_secret_valid"
  | "internal_guard_phrase_valid"
  | "internal_account_allowlisted"
  | "pilot_scenario_allowed"
  | "pilot_input_mode_supported"
  | "no_ocr_or_upload_requested"
  | "no_payment_requested"
  | "no_persistence_requested"
  | "no_dna_save_requested"
  | "no_offline_save_requested"
  | "public_runtime_not_requested"
  | "live_llm_not_allowed"
  | "manual_review_required_for_warning_or_high_risk";

// ── Blocked capabilities ──────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeBlockedCapability =
  | "public_anonymous_runtime"
  | "ocr_photo_runtime"
  | "file_upload_runtime"
  | "payment_runtime"
  | "dna_save_runtime"
  | "offline_save_runtime"
  | "b2b_visibility_runtime"
  | "multilingual_public_runtime"
  | "direct_user_visible_delivery"
  | "evidence_persistence"
  | "live_llm_runtime";

// ── Next phases ───────────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeNextPhase =
  | "phase_8_2k_1_pilot_runtime_guard_contract_types"
  | "phase_8_2k_2_guarded_internal_pilot_api_branch"
  | "phase_8_2k_3_pilot_runtime_e2e_harness"
  | "phase_8_2k_4_pilot_evidence_validation_integration"
  | "phase_8_2k_5_guarded_internal_pilot_runtime_closure_audit";

// ── Plan type ─────────────────────────────────────────────────────────────────

/**
 * The formal guarded internal pilot runtime implementation plan for 8.2K.
 *
 * `allowedRuntimeMode` — the only mode the future guarded pilot runtime
 *   may activate. Matches the switch plan from 8.2J-2.
 * `requiredGuardPhrase` — the exact caller-supplied phrase required to prove
 *   intentional internal-only activation at runtime. Must match 8.2J-2.
 *
 * `readyForRuntimeImplementation: false` — no runtime is wired until 8.2K-2
 *   guarded API branch and 8.2K-5 closure audit are complete.
 * `readyForApiRouteModification: false` — API route must not be changed
 *   before 8.2K-1 contract types and 8.2K-2 branch plan are complete.
 * `readyForPublicLaunch: false` — always false.
 */
export interface GuardedInternalPilotRuntimeImplementationPlan {
  readonly planId: "8.2K-0";
  readonly status: GuardedInternalPilotRuntimeImplementationPlanStatus;

  readonly implementationScope: readonly GuardedInternalPilotRuntimeImplementationScope[];
  readonly requiredContracts: readonly GuardedInternalPilotRuntimeRequiredContract[];
  readonly requiredGuards: readonly GuardedInternalPilotRuntimeRequiredGuard[];
  readonly blockedCapabilities: readonly GuardedInternalPilotRuntimeBlockedCapability[];
  readonly nextPhases: readonly GuardedInternalPilotRuntimeNextPhase[];

  readonly allowedRuntimeMode: "controlled_text_pilot_guarded";
  readonly requiredGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY";

  readonly readyForRuntimeImplementation: false;
  readonly readyForApiRouteModification: false;
  readonly readyForRuntimeExecution: false;
  readonly readyForPublicLaunch: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Plan constant ─────────────────────────────────────────────────────────────

/**
 * The 8.2K-0 Guarded Internal Pilot Runtime Implementation Plan V1.
 *
 * Specifies the full implementation scope, required runtime contracts,
 * required guards (16), blocked capabilities (11), and the ordered
 * five-phase implementation roadmap for the 8.2K epoch.
 *
 * This constant is type-safe and has no runtime side effects.
 * No API, UI, LLM, or persistence is touched by importing this constant.
 */
export const GUARDED_INTERNAL_PILOT_RUNTIME_IMPLEMENTATION_PLAN_V1: GuardedInternalPilotRuntimeImplementationPlan = {
  planId: "8.2K-0",
  status: "ready_for_phase_8_2k_1",

  implementationScope: [
    "guarded_internal_api_branch",
    "controlled_text_pilot_mode_only",
    "pilot_scenario_allowlist_runtime_check",
    "internal_secret_header_check",
    "internal_guard_phrase_check",
    "kill_switch_runtime_check",
    "no_public_runtime",
    "no_persistence_runtime",
    "no_dna_save_runtime",
    "no_offline_save_runtime",
    "no_live_llm_until_future_guarded_phase",
    "manual_evidence_record_validation_boundary",
  ],

  requiredContracts: [
    "pilot_request_contract",
    "pilot_response_contract",
    "pilot_runtime_guard_result",
    "pilot_failure_result",
    "pilot_evidence_validation_result",
    "pilot_no_persistence_result",
    "pilot_runtime_closure_audit_result",
  ],

  requiredGuards: [
    "feature_flag_enabled",
    "controlled_text_pilot_flag_enabled",
    "kill_switch_disabled",
    "internal_runtime_secret_valid",
    "internal_guard_phrase_valid",
    "internal_account_allowlisted",
    "pilot_scenario_allowed",
    "pilot_input_mode_supported",
    "no_ocr_or_upload_requested",
    "no_payment_requested",
    "no_persistence_requested",
    "no_dna_save_requested",
    "no_offline_save_requested",
    "public_runtime_not_requested",
    "live_llm_not_allowed",
    "manual_review_required_for_warning_or_high_risk",
  ],

  blockedCapabilities: [
    "public_anonymous_runtime",
    "ocr_photo_runtime",
    "file_upload_runtime",
    "payment_runtime",
    "dna_save_runtime",
    "offline_save_runtime",
    "b2b_visibility_runtime",
    "multilingual_public_runtime",
    "direct_user_visible_delivery",
    "evidence_persistence",
    "live_llm_runtime",
  ],

  nextPhases: [
    "phase_8_2k_1_pilot_runtime_guard_contract_types",
    "phase_8_2k_2_guarded_internal_pilot_api_branch",
    "phase_8_2k_3_pilot_runtime_e2e_harness",
    "phase_8_2k_4_pilot_evidence_validation_integration",
    "phase_8_2k_5_guarded_internal_pilot_runtime_closure_audit",
  ],

  allowedRuntimeMode: "controlled_text_pilot_guarded",
  requiredGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY",

  readyForRuntimeImplementation: false,
  readyForApiRouteModification: false,
  readyForRuntimeExecution: false,
  readyForPublicLaunch: false,

  liveLLMCalled: false,
  apiRouteModified: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  emittedToUserNow: false,
  neverUserVisible: true,
} as const;
