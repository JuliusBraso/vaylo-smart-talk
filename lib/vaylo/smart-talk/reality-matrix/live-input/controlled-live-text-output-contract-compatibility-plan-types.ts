/**
 * Controlled Live Text Output Contract Compatibility Plan types (Phase 8.2I-0).
 *
 * Defines the compatibility plan for removing the temporary mock-shaped bridge
 * introduced in Phase 8.2H-5 and formally adding controlled live text draft
 * output as a recognised source kind in the 8.2G output contract validator.
 *
 * This is a PLANNING-ONLY file.
 * - No validator changes are implemented here.
 * - The temporary mock bridge is NOT removed here.
 * - Real redacted text is NOT forwarded here.
 * - No API routes are modified.
 * - No live LLM is called.
 *
 * The plan constant `CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN_V1`
 * encodes the full compatibility design as compile-time-verified data:
 *
 *   temporaryMockBridgeStillPresent: true
 *   realRedactedTextForwardingTo8_2GAllowed: false
 *   readyForControlledRealTextForwardingTo8_2G: false
 *   readyForPublicLaunch: false
 *
 * See CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN.md for prose.
 */

// ── Plan status ───────────────────────────────────────────────────────────────

/**
 * The current status of the compatibility plan.
 *
 * - `planned`                           — design started but not yet complete.
 * - `blocked_until_validator_extension` — design complete but validator has not
 *   been extended yet (Phase 8.2I-1 onwards).
 * - `ready_for_phase_8_2i_1`            — plan complete; implementation may begin
 *   in Phase 8.2I-1.
 */
export type ControlledLiveTextOutputContractCompatibilityPlanStatus =
  | "planned"
  | "blocked_until_validator_extension"
  | "ready_for_phase_8_2i_1";

// ── Compatibility strategies ──────────────────────────────────────────────────

/**
 * The compatibility strategies that together remove the temporary mock bridge.
 *
 * - `extend_existing_output_contract_draft_union` — widen
 *   `RuntimeLLMOutputContractDraftResult` to accept a third source kind.
 * - `add_dedicated_controlled_live_text_draft_result` — introduce a new
 *   `ControlledLiveTextDraftResult` type (analogous to the live sandbox type).
 * - `add_controlled_live_text_prefix_support` — add the
 *   `[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]` prefix constant and
 *   dispatch path in the validator.
 * - `remove_temporary_mock_bridge` — delete the bridge from
 *   `run-guarded-live-text-runtime-pipeline.ts` once the above are in place.
 */
export type ControlledLiveTextOutputContractCompatibilityStrategy =
  | "extend_existing_output_contract_draft_union"
  | "add_dedicated_controlled_live_text_draft_result"
  | "add_controlled_live_text_prefix_support"
  | "remove_temporary_mock_bridge";

// ── Required changes ──────────────────────────────────────────────────────────

/**
 * The specific file/type/logic changes required across the 8.2I implementation
 * phases to safely extend the 8.2G output contract validator.
 */
export type ControlledLiveTextOutputContractRequiredChange =
  | "add_controlled_live_text_draft_source_kind"
  | "add_controlled_live_text_prefix_constant"
  | "add_controlled_live_text_draft_result_type"
  | "update_output_contract_draft_result_union"
  | "update_output_contract_validator_prefix_logic"
  | "update_output_contract_validator_source_dispatch"
  | "update_controlled_live_text_runtime_pipeline_bridge"
  | "add_regression_cases_for_controlled_live_text"
  | "preserve_mock_path_behavior"
  | "preserve_live_sandbox_path_behavior";

// ── Blocked-until conditions ──────────────────────────────────────────────────

/**
 * Conditions that must be met before real redacted text can flow through the
 * 8.2G governance chain without the temporary mock bridge.
 */
export type ControlledLiveTextOutputContractBlockedUntil =
  | "validator_accepts_controlled_live_text_source"
  | "validator_accepts_controlled_live_text_prefix"
  | "controlled_live_text_result_has_guard_proof_or_adapter_proof"
  | "temporary_mock_bridge_removed"
  | "real_redacted_text_forwarding_regression_passes";

// ── Compatibility risks ───────────────────────────────────────────────────────

/**
 * Risks that must be explicitly mitigated during the 8.2I implementation phases.
 *
 * - `accidental_mock_path_weakening`         — changes must not relax mock path invariants.
 * - `accidental_live_sandbox_path_weakening` — changes must not relax live sandbox path.
 * - `raw_text_leak_to_validator`             — only redacted text may reach the validator.
 * - `controlled_prefix_user_visible_leak`    — the new prefix must remain never-user-visible.
 * - `accepting_unredacted_text`              — validator must only accept text that passed
 *   the 8.2H-2 redaction boundary.
 * - `accepting_without_redaction_proof`      — controlled live text result must carry a
 *   redaction boundary attestation analogous to `RuntimeLiveSandboxGuardProof`.
 * - `accepting_without_guarded_internal_mode`— controlled live text path must remain
 *   gated by the existing internal secret + mode guards.
 * - `premature_public_runtime_enablement`   — the new path must not be reachable by
 *   anonymous public callers.
 */
export type ControlledLiveTextOutputContractCompatibilityRisk =
  | "accidental_mock_path_weakening"
  | "accidental_live_sandbox_path_weakening"
  | "raw_text_leak_to_validator"
  | "controlled_prefix_user_visible_leak"
  | "accepting_unredacted_text"
  | "accepting_without_redaction_proof"
  | "accepting_without_guarded_internal_mode"
  | "premature_public_runtime_enablement";

// ── Next phases ───────────────────────────────────────────────────────────────

/**
 * The ordered implementation phases that will execute this compatibility plan.
 */
export type ControlledLiveTextOutputContractNextPhase =
  | "phase_8_2i_1_controlled_live_text_draft_result_types"
  | "phase_8_2i_2_output_contract_validator_extension"
  | "phase_8_2i_3_remove_temporary_mock_bridge"
  | "phase_8_2i_4_real_redacted_text_forwarding_harness"
  | "phase_8_2i_5_guarded_real_text_pipeline_closure_audit";

// ── Plan type ─────────────────────────────────────────────────────────────────

/**
 * The full compatibility plan for allowing controlled live text draft results
 * to enter the 8.2G output contract validator safely.
 *
 * `controlledLiveTextDraftPrefix` — the exact prefix string that will be added
 *   as a recognised prefix constant in the validator.
 * `temporaryMockBridgeStillPresent` — `true`; the bridge remains until 8.2I-3.
 * `realRedactedTextForwardingTo8_2GAllowed` — `false`; blocked until 8.2I-4.
 * `readyForControlledRealTextForwardingTo8_2G` — `false`; set to `true` only
 *   after 8.2I-4 harness passes.
 * `readyForPublicLaunch` — always `false`.
 */
export interface ControlledLiveTextOutputContractCompatibilityPlan {
  readonly planId: "8.2I-0";
  readonly status: ControlledLiveTextOutputContractCompatibilityPlanStatus;
  readonly strategies: readonly ControlledLiveTextOutputContractCompatibilityStrategy[];
  readonly requiredChanges: readonly ControlledLiveTextOutputContractRequiredChange[];
  readonly blockedUntil: readonly ControlledLiveTextOutputContractBlockedUntil[];
  readonly risks: readonly ControlledLiveTextOutputContractCompatibilityRisk[];
  readonly nextPhases: readonly ControlledLiveTextOutputContractNextPhase[];

  readonly controlledLiveTextDraftPrefix: "[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]";
  readonly temporaryMockBridgeStillPresent: true;
  readonly realRedactedTextForwardingTo8_2GAllowed: false;
  readonly readyForControlledRealTextForwardingTo8_2G: false;
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
 * The Phase 8.2I-0 compatibility plan constant.
 *
 * Consumed by the 8.2H-6 closure audit notes and by Phase 8.2I-1 as a
 * design reference. This constant is planning-only data.
 */
export const CONTROLLED_LIVE_TEXT_OUTPUT_CONTRACT_COMPATIBILITY_PLAN_V1: ControlledLiveTextOutputContractCompatibilityPlan =
  {
    planId: "8.2I-0",
    status: "ready_for_phase_8_2i_1",

    strategies: [
      "extend_existing_output_contract_draft_union",
      "add_dedicated_controlled_live_text_draft_result",
      "add_controlled_live_text_prefix_support",
      "remove_temporary_mock_bridge",
    ],

    requiredChanges: [
      "add_controlled_live_text_draft_source_kind",
      "add_controlled_live_text_prefix_constant",
      "add_controlled_live_text_draft_result_type",
      "update_output_contract_draft_result_union",
      "update_output_contract_validator_prefix_logic",
      "update_output_contract_validator_source_dispatch",
      "update_controlled_live_text_runtime_pipeline_bridge",
      "add_regression_cases_for_controlled_live_text",
      "preserve_mock_path_behavior",
      "preserve_live_sandbox_path_behavior",
    ],

    blockedUntil: [
      "validator_accepts_controlled_live_text_source",
      "validator_accepts_controlled_live_text_prefix",
      "controlled_live_text_result_has_guard_proof_or_adapter_proof",
      "temporary_mock_bridge_removed",
      "real_redacted_text_forwarding_regression_passes",
    ],

    risks: [
      "accidental_mock_path_weakening",
      "accidental_live_sandbox_path_weakening",
      "raw_text_leak_to_validator",
      "controlled_prefix_user_visible_leak",
      "accepting_unredacted_text",
      "accepting_without_redaction_proof",
      "accepting_without_guarded_internal_mode",
      "premature_public_runtime_enablement",
    ],

    nextPhases: [
      "phase_8_2i_1_controlled_live_text_draft_result_types",
      "phase_8_2i_2_output_contract_validator_extension",
      "phase_8_2i_3_remove_temporary_mock_bridge",
      "phase_8_2i_4_real_redacted_text_forwarding_harness",
      "phase_8_2i_5_guarded_real_text_pipeline_closure_audit",
    ],

    controlledLiveTextDraftPrefix:
      "[CONTROLLED_LIVE_TEXT_DRAFT_NEVER_USER_VISIBLE]",
    temporaryMockBridgeStillPresent: true,
    realRedactedTextForwardingTo8_2GAllowed: false,
    readyForControlledRealTextForwardingTo8_2G: false,
    readyForPublicLaunch: false,

    liveLLMCalled: false,
    apiRouteModified: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
  };
