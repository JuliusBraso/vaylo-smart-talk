/**
 * Runtime Guarded Delivery types (Phase 8.2G-9).
 *
 * Defines the type model for the first guarded internal delivery path between
 * the 8.2G governance pipeline and the Smart Talk API response layer.
 *
 * The guarded path activates ONLY when all three conditions are true:
 *  1. POST /api/smart-talk body includes internalRuntimeMode: "synthetic_e2e_guarded"
 *  2. POST body includes internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY"
 *  3. process.env.VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME === "true"
 *
 * Normal Smart Talk behavior is completely unchanged when any condition is absent.
 *
 * Safety guarantees:
 * - persistenceUsed always literal false
 * - dnaSavePerformed always literal false
 * - offlineSavePerformed always literal false
 * - liveLLMCalled always literal false
 * - syntheticOnly always literal true
 * - neverUserVisible true throughout internal governance chain
 * - emittedToUserNow true only on delivered_guarded_synthetic_response
 */

import type { RuntimeSyntheticE2EHarnessResult } from "./runtime-synthetic-e2e-harness-types";

export type { RuntimeSyntheticE2EHarnessResult };

// ── Verdict ───────────────────────────────────────────────────────────────────

/**
 * Top-level verdict of `runRuntimeGuardedDelivery`.
 *
 * - `delivered_guarded_synthetic_response`  — all guards passed; synthetic response delivered.
 * - `rejected_feature_flag_disabled`        — VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME != "true".
 * - `rejected_missing_internal_mode`        — internalRuntimeMode field missing or wrong value.
 * - `rejected_missing_internal_guard`       — internalRuntimeGuard phrase missing or wrong value.
 * - `rejected_harness_not_authorised`       — harness did not produce completed_authorised_packet.
 * - `rejected_packet_missing`              — harness authorised but packetCreated/acceptedForUserVisibleAssembly not true.
 * - `rejected_invariant_violation`          — a runtime invariant was violated in the harness result.
 */
export type RuntimeGuardedDeliveryVerdict =
  | "delivered_guarded_synthetic_response"
  | "rejected_feature_flag_disabled"
  | "rejected_missing_internal_mode"
  | "rejected_missing_internal_guard"
  | "rejected_harness_not_authorised"
  | "rejected_packet_missing"
  | "rejected_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RuntimeGuardedDeliveryDiagnosticCode =
  | "guarded_delivery_started"
  | "guarded_delivery_feature_flag_confirmed"
  | "guarded_delivery_internal_mode_confirmed"
  | "guarded_delivery_internal_guard_confirmed"
  | "guarded_delivery_harness_completed"
  | "guarded_delivery_packet_delivered_in_guarded_mode"
  | "guarded_delivery_rejected_feature_flag_disabled"
  | "guarded_delivery_rejected_missing_internal_mode"
  | "guarded_delivery_rejected_missing_internal_guard"
  | "guarded_delivery_rejected_harness_not_authorised"
  | "guarded_delivery_rejected_packet_missing"
  | "guarded_delivery_rejected_invariant_violation"
  | "guarded_delivery_no_persistence_confirmed"
  | "guarded_delivery_no_dna_save_confirmed"
  | "guarded_delivery_no_offline_save_confirmed"
  | "guarded_delivery_no_live_llm_confirmed";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runRuntimeGuardedDelivery`.
 *
 * `internalRuntimeMode`   — must equal "synthetic_e2e_guarded" to proceed.
 * `internalRuntimeGuard`  — must equal "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY".
 * `fixtureMode`           — only "mock_safe" is accepted in this phase; others default to "mock_safe".
 * `featureFlagEnabled`    — must be true (caller reads VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME).
 * `deliveryRunId`         — opaque run ID for this delivery attempt.
 * `neverUserVisible`      — compile-time invariant; must be true at call site.
 */
export interface RuntimeGuardedDeliveryInput {
  readonly internalRuntimeMode?: unknown;
  readonly internalRuntimeGuard?: unknown;
  readonly fixtureMode?: unknown;
  readonly featureFlagEnabled: boolean;
  readonly deliveryRunId: string;
  readonly neverUserVisible: true;
}

// ── Response payload ──────────────────────────────────────────────────────────

/**
 * The synthetic governed response payload returned to the API caller.
 *
 * This is the ONLY point in the 8.2G stack where `emittedToUserNow: true` appears,
 * and only for the `delivered_guarded_synthetic_response` path.
 *
 * `mode`       — always "synthetic_e2e_guarded".
 * `summary`    — human-readable one-line description of the delivery.
 * `sections`   — purified section candidates from the authorised internal packet.
 * `governance` — delivery governance metadata for audit.
 */
export interface RuntimeGuardedDeliveryResponsePayload {
  readonly mode: "synthetic_e2e_guarded";
  readonly summary: string;
  readonly sections: readonly {
    readonly sectionKind: string;
    readonly text: string;
  }[];
  readonly governance: {
    readonly verdict: RuntimeGuardedDeliveryVerdict;
    readonly harnessVerdict: string;
    readonly packetAuthorised: boolean;
    readonly emittedToUserNow: true;
    readonly syntheticOnly: true;
    readonly noPersistence: true;
    readonly noDNA: true;
    readonly noOfflineSave: true;
    readonly noLiveLLM: true;
  };
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runRuntimeGuardedDelivery`.
 *
 * `persistenceUsed`, `dnaSavePerformed`, `offlineSavePerformed`, and
 * `liveLLMCalled` are all literal `false` — compile-time enforced invariants.
 *
 * `emittedToUserNow` is `true` only when `verdict === "delivered_guarded_synthetic_response"`.
 * In all rejected paths it is `false`.
 *
 * `neverUserVisible: true` — the internal governance chain maintained the invariant
 * throughout all upstream phases (8.2G-1 through 8.2G-7).
 */
export interface RuntimeGuardedDeliveryResult {
  readonly verdict: RuntimeGuardedDeliveryVerdict;
  readonly responsePayload: RuntimeGuardedDeliveryResponsePayload | null;
  readonly harnessResult: RuntimeSyntheticE2EHarnessResult | null;
  readonly diagnostics: readonly RuntimeGuardedDeliveryDiagnosticCode[];
  readonly emittedToUserNow: boolean;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly liveLLMCalled: false;
  readonly syntheticOnly: true;
  readonly neverUserVisible: true;
}
