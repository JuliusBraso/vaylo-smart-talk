/**
 * Controlled Text Pilot Readiness Plan types (Phase 8.2J-0).
 *
 * Planning-only phase. Defines the readiness type model and the plan constant
 * for the controlled internal text-only pilot epoch.
 *
 * This module does NOT:
 * - implement pilot runtime
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 * - enable public runtime
 * - process real user input
 *
 * It only exports the `CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1` constant and
 * the types needed to reason about pilot readiness criteria formally.
 *
 * Safety invariants (literal types on the plan constant):
 * - readyForInternalPilotImplementation: false
 * - readyForGuardedManualPilotPlanning: true
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

export type ControlledTextPilotReadinessPlanStatus =
  | "planned"
  | "blocked_until_pilot_criteria"
  | "ready_for_phase_8_2j_1";

// ── Pilot scope ───────────────────────────────────────────────────────────────

export type ControlledTextPilotScope =
  | "internal_text_only"
  | "synthetic_and_curated_text_fixtures"
  | "guarded_real_text_manual_test"
  | "slovak_explanation_first";

// ── Blocked capabilities ──────────────────────────────────────────────────────

export type ControlledTextPilotBlockedCapability =
  | "public_anonymous_runtime"
  | "ocr_photo_input"
  | "file_upload_processing"
  | "payment_processing"
  | "automatic_dna_save"
  | "automatic_offline_save"
  | "audit_persistence_required_for_broader_pilot"
  | "multilingual_runtime"
  | "b2b_visibility"
  | "deadline_calculation"
  | "legal_conclusion_generation"
  | "production_advice_claims";

// ── Required readiness areas ──────────────────────────────────────────────────

export type ControlledTextPilotRequiredReadinessArea =
  | "pilot_scenario_set"
  | "pilot_acceptance_criteria"
  | "pilot_failure_policy"
  | "manual_safety_checklist"
  | "internal_access_control"
  | "guarded_runtime_switch"
  | "raw_value_leak_review"
  | "hallucination_review"
  | "uncertainty_language_review"
  | "no_persistence_confirmation"
  | "no_public_runtime_confirmation"
  | "reviewer_signoff_protocol";

// ── Acceptance criteria ───────────────────────────────────────────────────────

export type ControlledTextPilotAcceptanceCriterion =
  | "input_contract_rejects_invalid_modes"
  | "redaction_boundary_masks_pii"
  | "raw_value_leak_check_passes"
  | "output_contract_accepts_controlled_live_text"
  | "wording_gate_blocks_hard_fail"
  | "human_review_blocks_user_visible_authorisation"
  | "assembler_blocks_internal_metadata_leak"
  | "authorisation_keeps_emitted_to_user_now_false_for_internal_packet"
  | "live_llm_disabled_unless_future_guarded_phase"
  | "persistence_dna_offline_save_all_false"
  | "public_runtime_disabled"
  | "pilot_results_manually_reviewed";

// ── Failure policies ──────────────────────────────────────────────────────────

export type ControlledTextPilotFailurePolicy =
  | "block_output_on_contract_violation"
  | "block_output_on_redaction_failure"
  | "block_output_on_raw_value_leak"
  | "block_output_on_wording_hard_fail"
  | "route_to_human_review_on_uncertainty"
  | "do_not_show_deadline_certainty"
  | "do_not_make_legal_conclusion"
  | "do_not_persist_raw_text"
  | "do_not_save_to_dna"
  | "do_not_save_offline";

// ── Next phases ───────────────────────────────────────────────────────────────

export type ControlledTextPilotNextPhase =
  | "phase_8_2j_1_pilot_scenario_set_and_acceptance_criteria"
  | "phase_8_2j_2_guarded_internal_pilot_runtime_switch_plan"
  | "phase_8_2j_3_manual_safety_test_protocol"
  | "phase_8_2j_4_pilot_evidence_record_model"
  | "phase_8_2j_5_controlled_text_pilot_readiness_closure_audit";

// ── Plan type ─────────────────────────────────────────────────────────────────

/**
 * The formal controlled text pilot readiness plan.
 *
 * `readyForInternalPilotImplementation: false` — no pilot runtime is implemented
 *   until 8.2J-1 through 8.2J-4 criteria are met and 8.2J-5 closure passes.
 * `readyForGuardedManualPilotPlanning: true` — planning work for the pilot is
 *   now formally sanctioned as of 8.2J-0.
 * `readyForPublicLaunch: false` — always false; public launch is not in scope.
 */
export interface ControlledTextPilotReadinessPlan {
  readonly planId: "8.2J-0";
  readonly status: ControlledTextPilotReadinessPlanStatus;
  readonly pilotScope: readonly ControlledTextPilotScope[];
  readonly blockedCapabilities: readonly ControlledTextPilotBlockedCapability[];
  readonly readinessAreas: readonly ControlledTextPilotRequiredReadinessArea[];
  readonly acceptanceCriteria: readonly ControlledTextPilotAcceptanceCriterion[];
  readonly failurePolicies: readonly ControlledTextPilotFailurePolicy[];
  readonly nextPhases: readonly ControlledTextPilotNextPhase[];

  readonly readyForInternalPilotImplementation: false;
  readonly readyForGuardedManualPilotPlanning: true;
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
 * The 8.2J-0 Controlled Text Pilot Readiness Plan V1.
 *
 * Defines what the internal text-only pilot is allowed to do, what is blocked,
 * what criteria must be met before pilot implementation begins, and what the
 * ordered next phases are.
 *
 * This constant is type-safe and has no runtime side effects.
 * No API, UI, LLM, or persistence is touched by importing this constant.
 */
export const CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1: ControlledTextPilotReadinessPlan = {
  planId: "8.2J-0",
  status: "ready_for_phase_8_2j_1",

  pilotScope: [
    "internal_text_only",
    "synthetic_and_curated_text_fixtures",
    "guarded_real_text_manual_test",
    "slovak_explanation_first",
  ],

  blockedCapabilities: [
    "public_anonymous_runtime",
    "ocr_photo_input",
    "file_upload_processing",
    "payment_processing",
    "automatic_dna_save",
    "automatic_offline_save",
    "audit_persistence_required_for_broader_pilot",
    "multilingual_runtime",
    "b2b_visibility",
    "deadline_calculation",
    "legal_conclusion_generation",
    "production_advice_claims",
  ],

  readinessAreas: [
    "pilot_scenario_set",
    "pilot_acceptance_criteria",
    "pilot_failure_policy",
    "manual_safety_checklist",
    "internal_access_control",
    "guarded_runtime_switch",
    "raw_value_leak_review",
    "hallucination_review",
    "uncertainty_language_review",
    "no_persistence_confirmation",
    "no_public_runtime_confirmation",
    "reviewer_signoff_protocol",
  ],

  acceptanceCriteria: [
    "input_contract_rejects_invalid_modes",
    "redaction_boundary_masks_pii",
    "raw_value_leak_check_passes",
    "output_contract_accepts_controlled_live_text",
    "wording_gate_blocks_hard_fail",
    "human_review_blocks_user_visible_authorisation",
    "assembler_blocks_internal_metadata_leak",
    "authorisation_keeps_emitted_to_user_now_false_for_internal_packet",
    "live_llm_disabled_unless_future_guarded_phase",
    "persistence_dna_offline_save_all_false",
    "public_runtime_disabled",
    "pilot_results_manually_reviewed",
  ],

  failurePolicies: [
    "block_output_on_contract_violation",
    "block_output_on_redaction_failure",
    "block_output_on_raw_value_leak",
    "block_output_on_wording_hard_fail",
    "route_to_human_review_on_uncertainty",
    "do_not_show_deadline_certainty",
    "do_not_make_legal_conclusion",
    "do_not_persist_raw_text",
    "do_not_save_to_dna",
    "do_not_save_offline",
  ],

  nextPhases: [
    "phase_8_2j_1_pilot_scenario_set_and_acceptance_criteria",
    "phase_8_2j_2_guarded_internal_pilot_runtime_switch_plan",
    "phase_8_2j_3_manual_safety_test_protocol",
    "phase_8_2j_4_pilot_evidence_record_model",
    "phase_8_2j_5_controlled_text_pilot_readiness_closure_audit",
  ],

  readyForInternalPilotImplementation: false,
  readyForGuardedManualPilotPlanning: true,
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
