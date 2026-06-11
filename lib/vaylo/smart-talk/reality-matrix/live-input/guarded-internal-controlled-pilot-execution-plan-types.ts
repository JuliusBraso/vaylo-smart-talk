/**
 * Guarded Internal Controlled Pilot Execution Plan Types (Phase 8.2L-0).
 *
 * Planning-only phase. Defines the type system and plan constant for the
 * 8.2L guarded internal controlled pilot execution epoch.
 *
 * This module does NOT:
 * - execute the pilot
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 * - read or print real environment variable values
 * - enable public runtime
 * - process actual user input
 *
 * The `GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1` constant
 * defines the full operator checklist, required environment variables,
 * abort criteria, and ordered next phases for the 8.2L epoch.
 *
 * Safety invariants (literal types on the plan constant):
 * - readyForPilotRunNow: false
 * - readyForPublicLaunch: false
 * - readyForLiveLLMRuntime: false
 * - readyForPersistence: false
 * - readyForPhotoOcrRuntime: false
 * - readyForPaymentRuntime: false
 * - liveLLMCalled: false
 * - apiRouteModifiedByPlan: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - emittedToUserNow: false
 * - neverUserVisible: true
 */

// ── Plan status ───────────────────────────────────────────────────────────────

export type GuardedInternalControlledPilotExecutionPlanStatus =
  | "planned"
  | "blocked_until_operator_env_verification"
  | "ready_for_phase_8_2l_1";

// ── Execution scope ───────────────────────────────────────────────────────────

export type GuardedInternalControlledPilotExecutionScope =
  | "operator_only_execution"
  | "single_controlled_run"
  | "controlled_text_pilot_guarded_mode_only"
  | "synthetic_or_operator_supplied_test_text_only"
  | "no_public_runtime"
  | "no_live_llm_runtime"
  | "no_persistence"
  | "no_dna_save"
  | "no_offline_save"
  | "no_photo_ocr"
  | "no_file_upload"
  | "no_payment"
  | "manual_review_required"
  | "post_execution_audit_required";

// ── Required prerequisites ────────────────────────────────────────────────────

export type GuardedInternalControlledPilotRequiredPrerequisite =
  | "phase_8_2k_5_closure_audit_passed"
  | "ready_for_controlled_pilot_execution_true"
  | "blockers_empty"
  | "internal_runtime_feature_flag_operator_verified"
  | "controlled_text_pilot_flag_operator_verified"
  | "kill_switch_operator_verified_disabled"
  | "internal_runtime_secret_operator_verified_configured"
  | "allowlist_operator_verified"
  | "scenario_allowlist_operator_verified"
  | "manual_reviewer_assigned"
  | "pilot_run_id_predeclared"
  | "abort_criteria_understood";

// ── Required environment variable names ───────────────────────────────────────

/**
 * The names of environment variables that the operator must verify before
 * any pilot execution attempt. The plan records these names only.
 * Actual values are never printed, stored, or evaluated by this module.
 */
export type GuardedInternalControlledPilotRequiredEnvVar =
  | "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME"
  | "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT"
  | "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH"
  | "VAYLO_INTERNAL_RUNTIME_SECRET"
  | "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST"
  | "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST";

// ── Operator checklist ────────────────────────────────────────────────────────

export type GuardedInternalControlledPilotOperatorChecklistItem =
  | "confirm_current_git_commit"
  | "confirm_vercel_or_local_target"
  | "confirm_no_public_testers"
  | "confirm_internal_operator_identity"
  | "confirm_internal_reviewer_allowlisted"
  | "confirm_pilot_scenario_allowlisted"
  | "confirm_guard_phrase_available"
  | "confirm_no_real_sensitive_document"
  | "confirm_no_secret_printing"
  | "confirm_no_persistence"
  | "confirm_no_live_llm"
  | "confirm_no_dna_save"
  | "confirm_no_offline_save"
  | "confirm_abort_on_unexpected_user_visible_output"
  | "confirm_abort_on_any_raw_text_echo"
  | "confirm_abort_on_any_secret_echo"
  | "confirm_post_execution_audit_required";

// ── Abort criteria ────────────────────────────────────────────────────────────

export type GuardedInternalControlledPilotAbortCriterion =
  | "closure_audit_not_ready"
  | "missing_required_env"
  | "kill_switch_enabled"
  | "internal_secret_missing_or_unverified"
  | "operator_not_allowlisted"
  | "scenario_not_allowlisted"
  | "unexpected_live_llm_call"
  | "unexpected_persistence"
  | "unexpected_dna_save"
  | "unexpected_offline_save"
  | "unexpected_user_visible_output"
  | "raw_text_echo_detected"
  | "secret_echo_detected"
  | "public_runtime_path_used"
  | "non_internal_request_used"
  | "manual_reviewer_unavailable";

// ── Next phases ───────────────────────────────────────────────────────────────

export type GuardedInternalControlledPilotNextPhase =
  | "phase_8_2l_1_operator_environment_verification_contract"
  | "phase_8_2l_2_single_run_execution_harness"
  | "phase_8_2l_3_manual_review_capture_model"
  | "phase_8_2l_4_post_execution_audit"
  | "phase_8_2l_5_controlled_pilot_execution_closure";

// ── Plan interface ────────────────────────────────────────────────────────────

/**
 * The formal guarded internal controlled pilot execution plan for 8.2L.
 *
 * `requiredClosureAuditId` — the 8.2K-5 closure audit must have passed.
 * `requiredReadyForControlledPilotExecution` — must be true.
 * `readyForPilotRunNow: false` — the pilot is NOT executed in this phase.
 * `readyForOperatorEnvVerification: true` — operator env verification
 *   (8.2L-1) may begin.
 *
 * All other readiness and safety invariant flags remain literal false.
 */
export interface GuardedInternalControlledPilotExecutionPlan {
  readonly planId: "8.2L-0";
  readonly status: GuardedInternalControlledPilotExecutionPlanStatus;

  readonly requiredClosureAuditId: "8.2K-5";
  readonly requiredClosureVerdict: "closed_with_warnings";
  readonly requiredReadyForControlledPilotExecution: true;

  readonly executionScope: readonly GuardedInternalControlledPilotExecutionScope[];
  readonly prerequisites: readonly GuardedInternalControlledPilotRequiredPrerequisite[];
  readonly requiredEnvVars: readonly GuardedInternalControlledPilotRequiredEnvVar[];
  readonly operatorChecklist: readonly GuardedInternalControlledPilotOperatorChecklistItem[];
  readonly abortCriteria: readonly GuardedInternalControlledPilotAbortCriterion[];
  readonly nextPhases: readonly GuardedInternalControlledPilotNextPhase[];

  readonly allowedRuntimeMode: "controlled_text_pilot_guarded";
  readonly requiredGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY";

  readonly readyForPilotRunNow: false;
  readonly readyForOperatorEnvVerification: true;
  readonly readyForPublicLaunch: false;
  readonly readyForLiveLLMRuntime: false;
  readonly readyForPersistence: false;
  readonly readyForPhotoOcrRuntime: false;
  readonly readyForPaymentRuntime: false;

  readonly liveLLMCalled: false;
  readonly apiRouteModifiedByPlan: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly emittedToUserNow: false;
  readonly neverUserVisible: true;
}

// ── Plan constant ─────────────────────────────────────────────────────────────

/**
 * The 8.2L-0 Guarded Internal Controlled Pilot Execution Plan V1.
 *
 * Defines the full operator checklist, required environment variable names,
 * abort criteria, and ordered five-phase roadmap for the 8.2L epoch.
 *
 * This constant is type-safe and has no runtime side effects.
 * No API, UI, LLM, pilot run, or persistence is triggered by importing it.
 */
export const GUARDED_INTERNAL_CONTROLLED_PILOT_EXECUTION_PLAN_V1: GuardedInternalControlledPilotExecutionPlan =
  {
    planId: "8.2L-0",
    status: "ready_for_phase_8_2l_1",

    requiredClosureAuditId: "8.2K-5",
    requiredClosureVerdict: "closed_with_warnings",
    requiredReadyForControlledPilotExecution: true,

    executionScope: [
      "operator_only_execution",
      "single_controlled_run",
      "controlled_text_pilot_guarded_mode_only",
      "synthetic_or_operator_supplied_test_text_only",
      "no_public_runtime",
      "no_live_llm_runtime",
      "no_persistence",
      "no_dna_save",
      "no_offline_save",
      "no_photo_ocr",
      "no_file_upload",
      "no_payment",
      "manual_review_required",
      "post_execution_audit_required",
    ],

    prerequisites: [
      "phase_8_2k_5_closure_audit_passed",
      "ready_for_controlled_pilot_execution_true",
      "blockers_empty",
      "internal_runtime_feature_flag_operator_verified",
      "controlled_text_pilot_flag_operator_verified",
      "kill_switch_operator_verified_disabled",
      "internal_runtime_secret_operator_verified_configured",
      "allowlist_operator_verified",
      "scenario_allowlist_operator_verified",
      "manual_reviewer_assigned",
      "pilot_run_id_predeclared",
      "abort_criteria_understood",
    ],

    requiredEnvVars: [
      "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
      "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
      "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
      "VAYLO_INTERNAL_RUNTIME_SECRET",
      "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
      "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
    ],

    operatorChecklist: [
      "confirm_current_git_commit",
      "confirm_vercel_or_local_target",
      "confirm_no_public_testers",
      "confirm_internal_operator_identity",
      "confirm_internal_reviewer_allowlisted",
      "confirm_pilot_scenario_allowlisted",
      "confirm_guard_phrase_available",
      "confirm_no_real_sensitive_document",
      "confirm_no_secret_printing",
      "confirm_no_persistence",
      "confirm_no_live_llm",
      "confirm_no_dna_save",
      "confirm_no_offline_save",
      "confirm_abort_on_unexpected_user_visible_output",
      "confirm_abort_on_any_raw_text_echo",
      "confirm_abort_on_any_secret_echo",
      "confirm_post_execution_audit_required",
    ],

    abortCriteria: [
      "closure_audit_not_ready",
      "missing_required_env",
      "kill_switch_enabled",
      "internal_secret_missing_or_unverified",
      "operator_not_allowlisted",
      "scenario_not_allowlisted",
      "unexpected_live_llm_call",
      "unexpected_persistence",
      "unexpected_dna_save",
      "unexpected_offline_save",
      "unexpected_user_visible_output",
      "raw_text_echo_detected",
      "secret_echo_detected",
      "public_runtime_path_used",
      "non_internal_request_used",
      "manual_reviewer_unavailable",
    ],

    nextPhases: [
      "phase_8_2l_1_operator_environment_verification_contract",
      "phase_8_2l_2_single_run_execution_harness",
      "phase_8_2l_3_manual_review_capture_model",
      "phase_8_2l_4_post_execution_audit",
      "phase_8_2l_5_controlled_pilot_execution_closure",
    ],

    allowedRuntimeMode: "controlled_text_pilot_guarded",
    requiredGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY",

    readyForPilotRunNow: false,
    readyForOperatorEnvVerification: true,
    readyForPublicLaunch: false,
    readyForLiveLLMRuntime: false,
    readyForPersistence: false,
    readyForPhotoOcrRuntime: false,
    readyForPaymentRuntime: false,

    liveLLMCalled: false,
    apiRouteModifiedByPlan: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    emittedToUserNow: false,
    neverUserVisible: true,
  } as const;
