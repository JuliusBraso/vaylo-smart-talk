/**
 * Controlled Live Text E2E Harness types (Phase 8.2H-4).
 *
 * Defines the type model for the narrow E2E harness that exercises the first
 * three layers of the 8.2H Controlled Live Input chain:
 *
 *   RealTextInputContractInput
 *   → runRealTextInputContractValidation()
 *   → runRealTextRedactionBoundary()
 *   → runControlledLiveTextAdapter()
 *   → ControlledLiveTextAdapterResult
 *
 * The harness uses only synthetic fixture inputs. It does NOT connect to the
 * 8.2G output contract validator, wording gate, assembler bridge, or API route.
 *
 * Key safety properties:
 * - `acceptedForLLM: false` — literal, locked.
 * - `acceptedForRuntimePipeline: false` — literal, locked.
 * - `acceptedForUserVisibleOutput: false` — literal, locked.
 * - `adaptedForOutputContractValidation: boolean` — `true` only on
 *   `completed_adapter_candidate`.
 * - `neverUserVisible: true` — literal, always.
 */

import type { RealTextInputContractVerdict } from "./real-text-input-contract-types";
import type { RealTextRedactionBoundaryVerdict } from "./real-text-redaction-boundary-types";
import type { ControlledLiveTextAdapterVerdict } from "./controlled-live-text-adapter-types";

export type { RealTextInputContractVerdict };
export type { RealTextRedactionBoundaryVerdict };
export type { ControlledLiveTextAdapterVerdict };

// ── Fixture modes ─────────────────────────────────────────────────────────────

/**
 * Deterministic fixture scenarios exercised by the harness.
 *
 * - `safe_real_text`                  — standard text input; full chain succeeds.
 * - `safe_real_question`              — question input; full chain succeeds.
 * - `too_short_text`                  — text below minimum length; blocked at input contract.
 * - `too_long_text`                   — text above maximum length; blocked at input contract.
 * - `unsupported_mode`                — unrecognised inputMode; blocked at input contract.
 * - `ocr_source_rejected`             — sourceKind is ocr_photo; blocked at input contract.
 * - `persistence_requested`           — requestedPersistence true; blocked at input contract.
 * - `legal_conclusion_requested`      — requestedLegalConclusion true; blocked at input contract.
 * - `pii_redaction_applied`           — text contains synthetic PII; chain succeeds, redaction applied.
 * - `high_risk_rejected`              — text contains IBAN; rejectHighRiskPatterns true; blocked at redaction.
 * - `empty_after_redaction`           — text that becomes empty after placeholders; blocked at redaction.
 * - `adapter_rejects_missing_redaction`— null passed to adapter directly; blocked at adapter.
 */
export type ControlledLiveTextE2EHarnessFixtureMode =
  | "safe_real_text"
  | "safe_real_question"
  | "too_short_text"
  | "too_long_text"
  | "unsupported_mode"
  | "ocr_source_rejected"
  | "persistence_requested"
  | "legal_conclusion_requested"
  | "pii_redaction_applied"
  | "high_risk_rejected"
  | "empty_after_redaction"
  | "adapter_rejects_missing_redaction";

// ── Harness verdict ───────────────────────────────────────────────────────────

/**
 * The top-level verdict of `runControlledLiveTextE2EHarness`.
 *
 * - `completed_adapter_candidate`   — all three layers passed; controlled draft candidate created.
 * - `blocked_input_contract`        — stopped at 8.2H-1 input contract validation.
 * - `blocked_redaction_boundary`    — stopped at 8.2H-2 redaction boundary.
 * - `blocked_adapter`               — stopped at 8.2H-3 controlled live text adapter.
 * - `failed_invariant_violation`    — a nested layer returned a result with an unsafe invariant field.
 */
export type ControlledLiveTextE2EHarnessVerdict =
  | "completed_adapter_candidate"
  | "blocked_input_contract"
  | "blocked_redaction_boundary"
  | "blocked_adapter"
  | "failed_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type ControlledLiveTextE2EHarnessDiagnosticCode =
  | "live_text_e2e_started"
  | "live_text_e2e_input_contract_completed"
  | "live_text_e2e_redaction_boundary_completed"
  | "live_text_e2e_adapter_completed"
  | "live_text_e2e_completed_adapter_candidate"
  | "live_text_e2e_blocked_input_contract"
  | "live_text_e2e_blocked_redaction_boundary"
  | "live_text_e2e_blocked_adapter"
  | "live_text_e2e_failed_invariant_violation"
  | "live_text_e2e_no_live_llm_confirmed"
  | "live_text_e2e_no_api_ui_confirmed"
  | "live_text_e2e_no_persistence_confirmed"
  | "live_text_e2e_no_dna_save_confirmed"
  | "live_text_e2e_no_offline_save_confirmed"
  | "live_text_e2e_no_user_visible_output_confirmed";

// ── Input ─────────────────────────────────────────────────────────────────────

/**
 * Input to `runControlledLiveTextE2EHarness`.
 *
 * `fixtureMode`             — selects which synthetic scenario to run.
 * `rejectHighRiskPatterns`  — forwarded to the redaction boundary; also
 *                             automatically enabled for the `high_risk_rejected` fixture.
 * `harnessRunId`            — opaque run ID for this harness execution.
 * `neverUserVisible`        — compile-time invariant; must be `true`.
 */
export interface ControlledLiveTextE2EHarnessInput {
  readonly harnessRunId: string;
  readonly fixtureMode: ControlledLiveTextE2EHarnessFixtureMode;
  readonly rejectHighRiskPatterns?: boolean;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Result ────────────────────────────────────────────────────────────────────

/**
 * The result of `runControlledLiveTextE2EHarness`.
 *
 * `inputContractVerdict`, `redactionBoundaryVerdict`, `adapterVerdict` record
 * the sub-layer outcome strings for traceability. They remain the empty string
 * `""` when a layer was not reached.
 *
 * `adapterCandidateCreated` and `adaptedForOutputContractValidation` are `true`
 * only on `completed_adapter_candidate`. All safety invariants are literal `false`/`true`.
 */
export interface ControlledLiveTextE2EHarnessResult {
  readonly harnessRunId: string;
  readonly verdict: ControlledLiveTextE2EHarnessVerdict;
  readonly diagnostics: readonly ControlledLiveTextE2EHarnessDiagnosticCode[];

  readonly inputContractVerdict: string;
  readonly redactionBoundaryVerdict: string;
  readonly adapterVerdict: string;

  readonly adapterCandidateCreated: boolean;
  readonly adaptedForOutputContractValidation: boolean;
  readonly acceptedForLLM: false;
  readonly acceptedForRuntimePipeline: false;
  readonly acceptedForUserVisibleOutput: false;

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly userVisibleOutputEmitted: false;
  readonly neverUserVisible: true;

  readonly notes?: readonly string[];
}
