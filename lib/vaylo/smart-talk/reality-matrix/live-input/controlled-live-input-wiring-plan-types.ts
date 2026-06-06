/**
 * Controlled Live Input Wiring Plan types (Phase 8.2H-0).
 *
 * Planning-only type model for the 8.2H epoch — the first controlled
 * introduction of real text input into the 8.2G governance pipeline.
 *
 * 8.2H-0 is a PLAN ONLY. It does NOT:
 * - process real user input
 * - call live LLM
 * - touch API routes or UI
 * - add persistence
 * - make Smart Talk public live runtime
 *
 * This file exports a single constant: CONTROLLED_LIVE_INPUT_WIRING_PLAN_V1.
 * No runtime functions are implemented here.
 *
 * Safety invariants encoded as literal types:
 * - readyForPublicLaunch: false
 * - liveLLMCalled: false
 * - apiRouteModified: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 */

// ── Plan status ───────────────────────────────────────────────────────────────

/**
 * The readiness status of the controlled live input wiring plan.
 *
 * - `planned`                          — plan drafted; prerequisites not yet confirmed.
 * - `blocked_until_guarded_contract`   — plan ready but requires input contract types first.
 * - `ready_for_phase_8_2h_1`           — all prerequisites met; 8.2H-1 may begin.
 */
export type ControlledLiveInputWiringPlanStatus =
  | "planned"
  | "blocked_until_guarded_contract"
  | "ready_for_phase_8_2h_1";

// ── Input mode ────────────────────────────────────────────────────────────────

/**
 * The controlled input modes that may eventually be introduced in 8.2H.
 *
 * - `real_text_guarded`          — real user plain-text input behind explicit guards.
 * - `real_document_text_guarded` — real extracted document text behind explicit guards
 *                                  (no OCR; extraction must have already occurred externally).
 * - `real_question_guarded`      — real user question text behind explicit guards.
 */
export type ControlledLiveInputMode =
  | "real_text_guarded"
  | "real_document_text_guarded"
  | "real_question_guarded";

/** Status of a controlled input mode in this planning phase. */
export type ControlledLiveInputModeStatus =
  | "allowed_later"
  | "blocked_this_phase"
  | "future_epoch";

// ── Required guards ───────────────────────────────────────────────────────────

/**
 * Every guard that MUST be in place before any real text input reaches the
 * runtime pipeline. All must be implemented before 8.2H goes live.
 */
export type ControlledLiveInputRequiredGuard =
  | "explicit_internal_feature_flag"
  | "authenticated_internal_access"
  | "input_contract_validation"
  | "redaction_boundary"
  | "no_persistence_boundary"
  | "no_dna_save_boundary"
  | "no_offline_save_boundary"
  | "output_contract_validation"
  | "wording_governance_gate"
  | "response_assembler_gate"
  | "user_visible_authorisation_gate"
  | "failure_fallback_policy";

// ── Blocked capabilities ──────────────────────────────────────────────────────

/**
 * Capabilities that are explicitly blocked and must NOT be introduced in 8.2H.
 * They remain out of scope until a future epoch defines their governance path.
 */
export type ControlledLiveInputBlockedCapability =
  | "ocr_photo_input"
  | "file_upload_processing"
  | "payment_processing"
  | "public_anonymous_live_runtime"
  | "automatic_dna_save"
  | "automatic_offline_save"
  | "audit_persistence"
  | "multilingual_live_runtime"
  | "b2b_visibility"
  | "deadline_calculation"
  | "legal_conclusion_generation";

// ── Next phases ───────────────────────────────────────────────────────────────

/**
 * The ordered sequence of implementation phases for epoch 8.2H.
 *
 * - phase_8_2h_1: Real text input contract types and validation boundary.
 * - phase_8_2h_2: Redaction and input guard boundary (sanitisation layer).
 * - phase_8_2h_3: Controlled live text adapter (thin wrapper around mock adapter).
 * - phase_8_2h_4: Controlled live text E2E harness (synthetic + real text fixture).
 * - phase_8_2h_5: Guarded internal live text API mode (hardened API branch).
 * - phase_8_2h_6: Controlled live input closure audit (epoch closure gate).
 */
export type ControlledLiveInputNextPhase =
  | "phase_8_2h_1_real_text_input_contract_types"
  | "phase_8_2h_2_redaction_and_input_guard_boundary"
  | "phase_8_2h_3_controlled_live_text_adapter"
  | "phase_8_2h_4_controlled_live_text_e2e_harness"
  | "phase_8_2h_5_guarded_internal_live_text_api_mode"
  | "phase_8_2h_6_controlled_live_input_closure_audit";

// ── Mode status entry ─────────────────────────────────────────────────────────

export interface ControlledLiveInputModeEntry {
  readonly mode: ControlledLiveInputMode;
  readonly status: ControlledLiveInputModeStatus;
  readonly notes: readonly string[];
}

// ── Plan type ─────────────────────────────────────────────────────────────────

/**
 * The complete controlled live input wiring plan for epoch 8.2H.
 *
 * This is a pure data structure — no runtime behaviour is attached.
 *
 * `readyForImplementationPhase` is always `"phase_8_2h_1_real_text_input_contract_types"`,
 * indicating which phase the plan unlocks.
 *
 * `readyForPublicLaunch` is always literal `false`.
 */
export interface ControlledLiveInputWiringPlan {
  readonly planId: "8.2H-0";
  readonly status: ControlledLiveInputWiringPlanStatus;
  readonly allowedInitialModes: readonly ControlledLiveInputMode[];
  readonly modeStatus: readonly ControlledLiveInputModeEntry[];
  readonly requiredGuards: readonly ControlledLiveInputRequiredGuard[];
  readonly blockedCapabilities: readonly ControlledLiveInputBlockedCapability[];
  readonly nextPhases: readonly ControlledLiveInputNextPhase[];
  readonly readyForImplementationPhase: "phase_8_2h_1_real_text_input_contract_types";
  readonly readyForPublicLaunch: false;
  readonly liveLLMCalled: false;
  readonly apiRouteModified: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
}

// ── Plan constant ─────────────────────────────────────────────────────────────

/**
 * The canonical 8.2H-0 controlled live input wiring plan.
 *
 * Phase 8.2H-0 is planning only. This constant is the sole deliverable.
 * No runtime code is implemented; no API/UI changes are made.
 */
export const CONTROLLED_LIVE_INPUT_WIRING_PLAN_V1: ControlledLiveInputWiringPlan = {
  planId: "8.2H-0",
  status: "ready_for_phase_8_2h_1",

  allowedInitialModes: [
    "real_text_guarded",
    "real_question_guarded",
  ],

  modeStatus: [
    {
      mode: "real_text_guarded",
      status: "allowed_later",
      notes: [
        "Real plain-text input may be accepted in 8.2H-3 behind all 12 required guards.",
        "Requires input contract validation and redaction boundary first (8.2H-1, 8.2H-2).",
        "No persistence. No DNA/offline save. No public exposure.",
      ],
    },
    {
      mode: "real_question_guarded",
      status: "allowed_later",
      notes: [
        "Real user question text (inputType: 'question') follows the same guard stack as real_text_guarded.",
        "Planned alongside real_text_guarded in 8.2H-3.",
      ],
    },
    {
      mode: "real_document_text_guarded",
      status: "blocked_this_phase",
      notes: [
        "Document text input requires its own governance path — distinct from plain-text questions.",
        "Blocked in 8.2H. Requires document boundary types, extraction governance, and source-binding contracts.",
        "No file upload processing. No OCR. Unblocked in a future epoch only.",
      ],
    },
  ],

  requiredGuards: [
    "explicit_internal_feature_flag",
    "authenticated_internal_access",
    "input_contract_validation",
    "redaction_boundary",
    "no_persistence_boundary",
    "no_dna_save_boundary",
    "no_offline_save_boundary",
    "output_contract_validation",
    "wording_governance_gate",
    "response_assembler_gate",
    "user_visible_authorisation_gate",
    "failure_fallback_policy",
  ],

  blockedCapabilities: [
    "ocr_photo_input",
    "file_upload_processing",
    "payment_processing",
    "public_anonymous_live_runtime",
    "automatic_dna_save",
    "automatic_offline_save",
    "audit_persistence",
    "multilingual_live_runtime",
    "b2b_visibility",
    "deadline_calculation",
    "legal_conclusion_generation",
  ],

  nextPhases: [
    "phase_8_2h_1_real_text_input_contract_types",
    "phase_8_2h_2_redaction_and_input_guard_boundary",
    "phase_8_2h_3_controlled_live_text_adapter",
    "phase_8_2h_4_controlled_live_text_e2e_harness",
    "phase_8_2h_5_guarded_internal_live_text_api_mode",
    "phase_8_2h_6_controlled_live_input_closure_audit",
  ],

  readyForImplementationPhase: "phase_8_2h_1_real_text_input_contract_types",
  readyForPublicLaunch: false,
  liveLLMCalled: false,
  apiRouteModified: false,
  uiTouched: false,
  persistenceUsed: false,
  dnaSavePerformed: false,
  offlineSavePerformed: false,
  neverUserVisible: true,
} as const;
