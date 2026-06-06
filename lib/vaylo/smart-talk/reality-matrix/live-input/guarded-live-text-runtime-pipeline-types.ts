/**
 * Guarded Live Text Runtime Pipeline types (Phase 8.2H-5).
 *
 * Defines the type model for the internal guarded pipeline that connects the
 * 8.2H controlled live input chain to the existing 8.2G governance gates:
 *
 *   controlled live text adapter candidate (8.2H-3/8.2H-4)
 *   → output contract validator   (8.2G-2)
 *   → wording governance gate     (8.2G-3)
 *   → response assembler bridge   (8.2G-6)
 *   → user-visible authorisation  (8.2G-7)
 *   → internal UserVisibleResponsePacket candidate
 *
 * The pipeline is synthetic/guarded:
 * - Uses fixture inputs only; no real user text enters the 8.2G chain.
 * - The mock-bridge mapping (CONTROLLED_LIVE_TEXT → MOCK prefix) is
 *   documented as a temporary compatibility bridge for this phase.
 * - No live LLM is called.
 * - No public runtime is enabled.
 * - emittedToUserNow remains literal `false` in the pure pipeline.
 *
 * Safety invariants (literal types on the result):
 * - emittedToUserNow: false
 * - liveLLMCalled: false
 * - apiRouteTouched: false
 * - uiTouched: false
 * - persistenceUsed: false
 * - dnaSavePerformed: false
 * - offlineSavePerformed: false
 * - neverUserVisible: true
 */

import type { ControlledLiveTextE2EHarnessVerdict } from "./controlled-live-text-e2e-harness-types";
import type { RuntimeLLMOutputContractVerdict } from "../runtime-llm-output-contract-validator-types";
import type { RuntimeWordingGateVerdict } from "../runtime-wording-governance-gate-types";
import type { RuntimeResponseAssemblerBridgeVerdict } from "../runtime-response-assembler-bridge-types";
import type { RuntimeUserVisibleAuthorisationVerdict } from "../runtime-user-visible-authorisation-gate-types";

export type { ControlledLiveTextE2EHarnessVerdict };
export type { RuntimeLLMOutputContractVerdict };
export type { RuntimeWordingGateVerdict };
export type { RuntimeResponseAssemblerBridgeVerdict };
export type { RuntimeUserVisibleAuthorisationVerdict };

// ── Pipeline verdict ──────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runGuardedLiveTextRuntimePipeline`.
 *
 * - `completed_authorised_internal_packet` — all layers passed; an internal
 *   `UserVisibleResponsePacket` candidate was created.
 * - `blocked_live_text_harness`            — the 8.2H E2E harness did not reach
 *   `completed_adapter_candidate`.
 * - `blocked_output_contract`             — output contract validator rejected.
 * - `blocked_wording_gate`                — wording gate rejected (hard fail).
 * - `blocked_response_assembler`          — assembler bridge rejected.
 * - `blocked_user_visible_authorisation`  — authorisation gate rejected (includes
 *   `human_review` path).
 * - `rejected_missing_adapter_candidate`  — harness produced no adapter candidate.
 * - `failed_invariant_violation`          — a nested layer returned an unsafe
 *   invariant field value.
 */
export type GuardedLiveTextRuntimePipelineVerdict =
  | "completed_authorised_internal_packet"
  | "blocked_live_text_harness"
  | "blocked_output_contract"
  | "blocked_wording_gate"
  | "blocked_response_assembler"
  | "blocked_user_visible_authorisation"
  | "rejected_missing_adapter_candidate"
  | "failed_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type GuardedLiveTextRuntimePipelineDiagnosticCode =
  | "guarded_live_text_pipeline_started"
  | "guarded_live_text_pipeline_live_text_harness_completed"
  | "guarded_live_text_pipeline_adapter_candidate_confirmed"
  | "guarded_live_text_pipeline_output_contract_completed"
  | "guarded_live_text_pipeline_wording_gate_completed"
  | "guarded_live_text_pipeline_response_assembler_completed"
  | "guarded_live_text_pipeline_authorisation_completed"
  | "guarded_live_text_pipeline_completed_authorised_packet"
  | "guarded_live_text_pipeline_blocked_live_text_harness"
  | "guarded_live_text_pipeline_blocked_output_contract"
  | "guarded_live_text_pipeline_blocked_wording_gate"
  | "guarded_live_text_pipeline_blocked_response_assembler"
  | "guarded_live_text_pipeline_blocked_user_visible_authorisation"
  | "guarded_live_text_pipeline_rejected_missing_adapter_candidate"
  | "guarded_live_text_pipeline_failed_invariant_violation"
  | "guarded_live_text_pipeline_no_live_llm_confirmed"
  | "guarded_live_text_pipeline_no_api_ui_confirmed"
  | "guarded_live_text_pipeline_no_persistence_confirmed"
  | "guarded_live_text_pipeline_no_dna_save_confirmed"
  | "guarded_live_text_pipeline_no_offline_save_confirmed";

// ── Fixture mode ──────────────────────────────────────────────────────────────

/**
 * Fixture modes for the guarded live text runtime pipeline.
 *
 * Modes that reach the full 8.2G chain:
 * - `safe_real_text`          — standard text; all gates pass; authorised packet created.
 * - `safe_real_question`      — question input; all gates pass; authorised packet created.
 * - `pii_redaction_applied`   — text with PII; redaction applied; gates pass; packet created.
 * - `wording_hard_fail`       — safe_real_text with hard-fail score report; blocked at wording.
 * - `human_review`            — safe_real_question with human-review score report; blocked at auth.
 *
 * Modes blocked before the 8.2G chain:
 * - `input_contract_blocked`  — too_short_text; blocked in 8.2H harness.
 * - `redaction_blocked`       — high_risk_rejected; blocked in 8.2H harness.
 * - `adapter_blocked`         — adapter_rejects_missing_redaction; blocked in 8.2H harness.
 */
export type GuardedLiveTextRuntimePipelineFixtureMode =
  | "safe_real_text"
  | "safe_real_question"
  | "pii_redaction_applied"
  | "input_contract_blocked"
  | "redaction_blocked"
  | "adapter_blocked"
  | "wording_hard_fail"
  | "human_review";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runGuardedLiveTextRuntimePipeline`.
 *
 * `pipelineRunId`  — opaque run ID; propagated to all nested layers.
 * `fixtureMode`    — determines which synthetic scenario to exercise.
 * `neverUserVisible` — compile-time invariant; must be `true`.
 */
export interface GuardedLiveTextRuntimePipelineInput {
  readonly pipelineRunId: string;
  readonly fixtureMode: GuardedLiveTextRuntimePipelineFixtureMode;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runGuardedLiveTextRuntimePipeline`.
 *
 * Per-layer verdict strings are recorded for traceability.
 * `packetCreated` and `acceptedForUserVisibleAssembly` are `true` only on
 * `completed_authorised_internal_packet`.
 * `emittedToUserNow` is always literal `false` — the pure pipeline never
 * emits output; the API route wrapper may use it separately.
 */
export interface GuardedLiveTextRuntimePipelineResult {
  readonly pipelineRunId: string;
  readonly verdict: GuardedLiveTextRuntimePipelineVerdict;
  readonly diagnostics: readonly GuardedLiveTextRuntimePipelineDiagnosticCode[];

  readonly liveTextHarnessVerdict: string;
  readonly outputContractVerdict: string;
  readonly wordingGateVerdict: string;
  readonly responseAssemblerVerdict: string;
  readonly authorisationVerdict: string;

  readonly packetCreated: boolean;
  readonly acceptedForUserVisibleAssembly: boolean;
  readonly userVisibleOutputAllowedForFuture: boolean;
  readonly emittedToUserNow: false;

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}
