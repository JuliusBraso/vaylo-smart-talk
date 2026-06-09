/**
 * Guarded Internal Pilot Runtime Switch Plan types (Phase 8.2J-2).
 *
 * Planning-only phase. Defines the switch model type system and the plan constant
 * for the controlled internal pilot runtime guard contract.
 *
 * This module does NOT:
 * - implement the switch
 * - modify API routes
 * - touch UI
 * - call any LLM
 * - persist anything
 * - enable public runtime
 * - process real user input
 *
 * The `GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1` constant fully specifies
 * what guards, flags, request fields, and activation rules must be in place before
 * any implementation of the controlled text pilot runtime switch begins in 8.2J-3+.
 *
 * Safety invariants (literal types on the plan constant):
 * - readyForPilotRuntimeImplementation: false
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

export type GuardedInternalPilotRuntimeSwitchPlanStatus =
  | "planned"
  | "blocked_until_switch_contract"
  | "ready_for_phase_8_2j_3";

// ── Guards ────────────────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeSwitchGuard =
  | "internal_feature_flag"
  | "global_kill_switch"
  | "internal_runtime_secret_header"
  | "internal_runtime_guard_phrase"
  | "internal_account_allowlist"
  | "pilot_scenario_allowlist"
  | "text_only_mode_guard"
  | "no_ocr_guard"
  | "no_file_upload_guard"
  | "no_payment_guard"
  | "no_persistence_guard"
  | "no_dna_save_guard"
  | "no_offline_save_guard"
  | "no_public_runtime_guard"
  | "no_live_llm_guard_until_future_phase"
  | "manual_review_required_for_warning_or_high_risk";

// ── Feature flags ─────────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeSwitchFlag =
  | "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME"
  | "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT"
  | "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH"
  | "VAYLO_INTERNAL_RUNTIME_SECRET"
  | "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST";

// ── Request fields ────────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeSwitchRequestField =
  | "internalRuntimeMode"
  | "internalRuntimeGuard"
  | "pilotScenarioId"
  | "pilotInputMode"
  | "pilotReviewerId"
  | "pilotRunId";

// ── Allowed and blocked modes ─────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeSwitchAllowedMode =
  "controlled_text_pilot_guarded";

export type GuardedInternalPilotRuntimeSwitchBlockedMode =
  | "public_anonymous_live_runtime"
  | "ocr_photo_runtime"
  | "file_upload_runtime"
  | "payment_runtime"
  | "dna_save_runtime"
  | "offline_save_runtime"
  | "b2b_visibility_runtime"
  | "multilingual_public_runtime";

// ── Failure verdicts ──────────────────────────────────────────────────────────

export type GuardedInternalPilotRuntimeSwitchFailureVerdict =
  | "rejected_feature_flag_disabled"
  | "rejected_kill_switch_enabled"
  | "rejected_missing_internal_secret"
  | "rejected_invalid_internal_secret"
  | "rejected_missing_guard_phrase"
  | "rejected_invalid_guard_phrase"
  | "rejected_not_allowlisted"
  | "rejected_unknown_pilot_scenario"
  | "rejected_unsupported_input_mode"
  | "rejected_public_runtime_attempt"
  | "rejected_ocr_or_upload_attempt"
  | "rejected_persistence_or_save_attempt"
  | "rejected_live_llm_not_allowed"
  | "rejected_manual_review_required";

// ── Activation rule ───────────────────────────────────────────────────────────

/**
 * A single required activation rule for the guarded pilot runtime switch.
 *
 * All activation rules have `required: true` — the switch is rejected if any
 * rule's guard condition is not satisfied.
 */
export interface GuardedInternalPilotRuntimeSwitchActivationRule {
  readonly ruleId: string;
  readonly guard: GuardedInternalPilotRuntimeSwitchGuard;
  readonly required: true;
  readonly failureVerdict: GuardedInternalPilotRuntimeSwitchFailureVerdict;
  readonly notes: readonly string[];
  readonly neverUserVisible: true;
}

// ── Plan type ─────────────────────────────────────────────────────────────────

/**
 * The formal guarded internal pilot runtime switch plan.
 *
 * `internalRuntimeGuardPhrase` is the exact string that a pilot request must
 *   supply to prove intentional internal-only activation.
 * `readyForPilotRuntimeImplementation: false` — no switch is wired until
 *   8.2J-3 manual safety protocol and 8.2J-5 closure audit are complete.
 * `readyForManualSafetyProtocol: true` — the switch design is ready for
 *   review in the 8.2J-3 manual safety test protocol.
 * `readyForPublicLaunch: false` — always false.
 */
export interface GuardedInternalPilotRuntimeSwitchPlan {
  readonly planId: "8.2J-2";
  readonly status: GuardedInternalPilotRuntimeSwitchPlanStatus;

  readonly allowedMode: GuardedInternalPilotRuntimeSwitchAllowedMode;
  readonly blockedModes: readonly GuardedInternalPilotRuntimeSwitchBlockedMode[];
  readonly requiredGuards: readonly GuardedInternalPilotRuntimeSwitchGuard[];
  readonly requiredFlags: readonly GuardedInternalPilotRuntimeSwitchFlag[];
  readonly requiredRequestFields: readonly GuardedInternalPilotRuntimeSwitchRequestField[];
  readonly activationRules: readonly GuardedInternalPilotRuntimeSwitchActivationRule[];

  readonly internalRuntimeGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY";

  readonly readyForPilotRuntimeImplementation: false;
  readonly readyForManualSafetyProtocol: true;
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
 * The 8.2J-2 Guarded Internal Pilot Runtime Switch Plan V1.
 *
 * Specifies all guards, feature flags, request fields, activation rules,
 * failure verdicts, and the required guard phrase for the controlled text
 * pilot runtime switch.
 *
 * This constant is type-safe and has no runtime side effects.
 * No API, UI, LLM, or persistence is touched by importing this constant.
 */
export const GUARDED_INTERNAL_PILOT_RUNTIME_SWITCH_PLAN_V1: GuardedInternalPilotRuntimeSwitchPlan = {
  planId: "8.2J-2",
  status: "ready_for_phase_8_2j_3",

  allowedMode: "controlled_text_pilot_guarded",

  blockedModes: [
    "public_anonymous_live_runtime",
    "ocr_photo_runtime",
    "file_upload_runtime",
    "payment_runtime",
    "dna_save_runtime",
    "offline_save_runtime",
    "b2b_visibility_runtime",
    "multilingual_public_runtime",
  ],

  requiredGuards: [
    "internal_feature_flag",
    "global_kill_switch",
    "internal_runtime_secret_header",
    "internal_runtime_guard_phrase",
    "internal_account_allowlist",
    "pilot_scenario_allowlist",
    "text_only_mode_guard",
    "no_ocr_guard",
    "no_file_upload_guard",
    "no_payment_guard",
    "no_persistence_guard",
    "no_dna_save_guard",
    "no_offline_save_guard",
    "no_public_runtime_guard",
    "no_live_llm_guard_until_future_phase",
    "manual_review_required_for_warning_or_high_risk",
  ],

  requiredFlags: [
    "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
    "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
    "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
    "VAYLO_INTERNAL_RUNTIME_SECRET",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
  ],

  requiredRequestFields: [
    "internalRuntimeMode",
    "internalRuntimeGuard",
    "pilotScenarioId",
    "pilotInputMode",
    "pilotReviewerId",
    "pilotRunId",
  ],

  activationRules: [
    {
      ruleId: "R01-feature-flag",
      guard: "internal_feature_flag",
      required: true,
      failureVerdict: "rejected_feature_flag_disabled",
      notes: [
        "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME must be 'true'.",
        "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT must be 'true'.",
        "Both flags must be present; either missing → reject.",
        "These are server-side env vars; never exposed to browser.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R02-kill-switch",
      guard: "global_kill_switch",
      required: true,
      failureVerdict: "rejected_kill_switch_enabled",
      notes: [
        "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH must NOT be 'true'.",
        "If the kill switch is enabled, all pilot requests are rejected immediately.",
        "Kill switch takes precedence over all other guards.",
        "This is the emergency stop; it can be set without code deployment.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R03-secret-header",
      guard: "internal_runtime_secret_header",
      required: true,
      failureVerdict: "rejected_missing_internal_secret",
      notes: [
        "Request must include header x-vaylo-internal-runtime-secret.",
        "Header value must match VAYLO_INTERNAL_RUNTIME_SECRET env var.",
        "Missing header → rejected_missing_internal_secret.",
        "Wrong value → rejected_invalid_internal_secret.",
        "Secret must be a strong random value; never committed to source control.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R04-guard-phrase",
      guard: "internal_runtime_guard_phrase",
      required: true,
      failureVerdict: "rejected_missing_guard_phrase",
      notes: [
        "Request body field internalRuntimeGuard must equal exactly:",
        "'I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY'.",
        "Missing field → rejected_missing_guard_phrase.",
        "Wrong value → rejected_invalid_guard_phrase.",
        "This phrase proves intentional internal-only activation at call time.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R05-account-allowlist",
      guard: "internal_account_allowlist",
      required: true,
      failureVerdict: "rejected_not_allowlisted",
      notes: [
        "Caller identity (pilotReviewerId) must appear in VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST.",
        "Allowlist is a comma-separated list of internal reviewer IDs in the env var.",
        "Unknown or missing pilotReviewerId → reject.",
        "Allowlist changes require a server restart — no dynamic runtime modification.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R06-scenario-allowlist",
      guard: "pilot_scenario_allowlist",
      required: true,
      failureVerdict: "rejected_unknown_pilot_scenario",
      notes: [
        "pilotScenarioId must be one of the 12 IDs from CONTROLLED_TEXT_PILOT_SCENARIO_SET_V1.",
        "Unknown scenario ID → reject. No open-ended input outside scenario set.",
        "Scenario set is defined in controlled-text-pilot-scenarios-types.ts (8.2J-1).",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R07-text-only-mode",
      guard: "text_only_mode_guard",
      required: true,
      failureVerdict: "rejected_unsupported_input_mode",
      notes: [
        "pilotInputMode must be 'real_text_guarded' or 'real_question_guarded'.",
        "Any other mode → reject.",
        "OCR, file upload, and photo modes are hard-blocked.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R08-no-ocr",
      guard: "no_ocr_guard",
      required: true,
      failureVerdict: "rejected_ocr_or_upload_attempt",
      notes: [
        "If sourceKind is 'ocr_photo', 'file_upload', 'document_upload', or 'image_upload' → reject.",
        "This guard is redundant with the input contract but must also fire at the switch level.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R09-no-file-upload",
      guard: "no_file_upload_guard",
      required: true,
      failureVerdict: "rejected_ocr_or_upload_attempt",
      notes: [
        "If request contains file attachment, multipart body, or binary payload → reject.",
        "Text-only pilot; file upload support is a future epoch.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R10-no-payment",
      guard: "no_payment_guard",
      required: true,
      failureVerdict: "rejected_persistence_or_save_attempt",
      notes: [
        "No payment processing fields may be present in the request.",
        "Payment is a future epoch; any payment-related field → reject.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R11-no-persistence",
      guard: "no_persistence_guard",
      required: true,
      failureVerdict: "rejected_persistence_or_save_attempt",
      notes: [
        "requestedPersistence must not be true.",
        "No DB write may be initiated by the pilot request handler.",
        "This aligns with input contract validation (8.2H-1).",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R12-no-dna-save",
      guard: "no_dna_save_guard",
      required: true,
      failureVerdict: "rejected_persistence_or_save_attempt",
      notes: [
        "requestedDnaSave must not be true.",
        "DNA save is not permitted in the pilot epoch.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R13-no-offline-save",
      guard: "no_offline_save_guard",
      required: true,
      failureVerdict: "rejected_persistence_or_save_attempt",
      notes: [
        "requestedOfflineSave must not be true.",
        "Offline save is not permitted in the pilot epoch.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R14-no-public-runtime",
      guard: "no_public_runtime_guard",
      required: true,
      failureVerdict: "rejected_public_runtime_attempt",
      notes: [
        "internalRuntimeMode must be 'controlled_text_pilot_guarded'.",
        "Any attempt to activate public_anonymous_live_runtime → reject.",
        "The public feature flag (if any) must remain disabled.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R15-no-live-llm",
      guard: "no_live_llm_guard_until_future_phase",
      required: true,
      failureVerdict: "rejected_live_llm_not_allowed",
      notes: [
        "Live LLM calls are not permitted in the 8.2J pilot.",
        "liveLLMCalled must remain false on all pipeline results.",
        "A future guarded phase (8.2K+) must explicitly enable live LLM with its own proof.",
      ],
      neverUserVisible: true,
    },
    {
      ruleId: "R16-manual-review-escalation",
      guard: "manual_review_required_for_warning_or_high_risk",
      required: true,
      failureVerdict: "rejected_manual_review_required",
      notes: [
        "For scenarios with acceptanceStatus 'warning' or 'human_review', a human reviewer",
        "must inspect the output before it is considered valid — even in the internal pilot.",
        "The switch handler must record that human review was required for this pilotScenarioId.",
        "This is a reviewer gate, not an automated gate; it is enforced by protocol not code.",
      ],
      neverUserVisible: true,
    },
  ],

  internalRuntimeGuardPhrase: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY",

  readyForPilotRuntimeImplementation: false,
  readyForManualSafetyProtocol: true,
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
