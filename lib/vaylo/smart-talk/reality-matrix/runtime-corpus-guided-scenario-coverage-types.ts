/**
 * Runtime Corpus-Guided Scenario Coverage types (Phase 8.2G-11).
 *
 * Defines the type model for a narrow corpus-guided scenario coverage layer
 * that exercises multiple governance-relevant runtime outcomes through the
 * existing synthetic E2E harness (8.2G-8).
 *
 * Scenario kinds align with the six fixture modes available in the E2E harness.
 * Traceability notes in each scenario may reference controlled corpus scenario
 * IDs (e.g. "cc-8-2e-0001") for audit purposes, but the corpus scenarios are
 * not imported — they operate in a different type space.
 *
 * Safety guarantees:
 * - liveLLMCalled always literal false
 * - apiRouteTouched always literal false
 * - uiTouched always literal false
 * - persistenceUsed always literal false
 * - dnaSavePerformed always literal false
 * - offlineSavePerformed always literal false
 * - neverUserVisible always true
 * - no external calls, no side effects
 */

import type {
  RuntimeSyntheticE2EHarnessFixtureMode,
  RuntimeSyntheticE2EHarnessResult,
  RuntimeSyntheticE2EHarnessVerdict,
} from "./runtime-synthetic-e2e-harness-types";

export type {
  RuntimeSyntheticE2EHarnessFixtureMode,
  RuntimeSyntheticE2EHarnessResult,
  RuntimeSyntheticE2EHarnessVerdict,
};

// ── Scenario kind ─────────────────────────────────────────────────────────────

/**
 * The governance-relevant scenario kind exercised by a scenario run.
 *
 * These map 1:1 to the harness fixture modes:
 *   safe_document_explanation  → mock_safe
 *   unsafe_output_contract     → mock_unsafe_output_contract
 *   wording_hard_fail          → mock_wording_hard_fail
 *   human_review_required      → mock_human_review
 *   internal_metadata_leak     → mock_metadata_leak
 *   missing_sections           → mock_empty_sections
 */
export type RuntimeCorpusGuidedScenarioKind =
  | "safe_document_explanation"
  | "unsafe_output_contract"
  | "wording_hard_fail"
  | "human_review_required"
  | "internal_metadata_leak"
  | "missing_sections";

// ── Expected outcome ──────────────────────────────────────────────────────────

/**
 * The expected governance outcome for a corpus-guided scenario run.
 * Maps to the harness verdict after translation.
 */
export type RuntimeCorpusGuidedScenarioExpectedOutcome =
  | "authorised_packet"
  | "blocked_output_contract"
  | "blocked_wording_gate"
  | "blocked_response_assembler"
  | "blocked_user_visible_authorisation";

// ── Coverage verdict ──────────────────────────────────────────────────────────

/**
 * Top-level verdict of `runRuntimeCorpusGuidedScenarioCoverage`.
 *
 * - `completed_all_passed`      — all scenarios ran and matched expected outcomes.
 * - `completed_with_failures`   — all scenarios ran; at least one expected outcome mismatch.
 * - `rejected_no_scenarios`     — scenario list was empty.
 * - `failed_invariant_violation`— a harness result violated a runtime invariant.
 */
export type RuntimeCorpusGuidedCoverageVerdict =
  | "completed_all_passed"
  | "completed_with_failures"
  | "rejected_no_scenarios"
  | "failed_invariant_violation";

// ── Diagnostic codes ──────────────────────────────────────────────────────────

export type RuntimeCorpusGuidedCoverageDiagnosticCode =
  | "corpus_coverage_started"
  | "corpus_coverage_scenarios_loaded"
  | "corpus_coverage_scenario_completed"
  | "corpus_coverage_scenario_passed"
  | "corpus_coverage_scenario_failed"
  | "corpus_coverage_all_passed"
  | "corpus_coverage_has_failures"
  | "corpus_coverage_rejected_no_scenarios"
  | "corpus_coverage_invariant_violation"
  | "corpus_coverage_no_live_llm_confirmed"
  | "corpus_coverage_no_api_ui_confirmed"
  | "corpus_coverage_no_persistence_confirmed";

// ── Scenario ──────────────────────────────────────────────────────────────────

/**
 * A single corpus-guided governance scenario.
 *
 * `scenarioId`       — opaque identifier (may reference a corpus scenario ID for traceability).
 * `kind`             — the governance scenario kind.
 * `fixtureMode`      — the E2E harness fixture mode to exercise.
 * `expectedOutcome`  — the governance outcome the scenario expects.
 * `syntheticOnly`    — always true; no real documents or user data.
 * `neverUserVisible` — always true; internal governance chain only.
 * `notes`            — optional audit notes (may include corpus scenario ID references).
 */
export interface RuntimeCorpusGuidedScenario {
  readonly scenarioId: string;
  readonly kind: RuntimeCorpusGuidedScenarioKind;
  readonly fixtureMode: RuntimeSyntheticE2EHarnessFixtureMode;
  readonly expectedOutcome: RuntimeCorpusGuidedScenarioExpectedOutcome;
  readonly syntheticOnly: true;
  readonly neverUserVisible: true;
  readonly notes?: readonly string[];
}

// ── Scenario result ───────────────────────────────────────────────────────────

/**
 * The result of running a single corpus-guided scenario through the harness.
 *
 * `passed` is true only when `harnessVerdict` translates to `expectedOutcome`.
 */
export interface RuntimeCorpusGuidedScenarioResult {
  readonly scenarioId: string;
  readonly kind: RuntimeCorpusGuidedScenarioKind;
  readonly fixtureMode: RuntimeSyntheticE2EHarnessFixtureMode;
  readonly expectedOutcome: RuntimeCorpusGuidedScenarioExpectedOutcome;
  readonly harnessVerdict: RuntimeSyntheticE2EHarnessVerdict;
  readonly passed: boolean;
  readonly diagnostics: readonly RuntimeCorpusGuidedCoverageDiagnosticCode[];
  readonly neverUserVisible: true;
}

// ── Coverage input / result ───────────────────────────────────────────────────

/**
 * Input to `runRuntimeCorpusGuidedScenarioCoverage`.
 *
 * `coverageRunId`             — opaque run ID for this coverage pass.
 * `includeOptionalScenarios`  — if true, corpus-informed extended scenarios are included.
 * `neverUserVisible`          — compile-time invariant; must be true at call site.
 */
export interface RuntimeCorpusGuidedCoverageInput {
  readonly coverageRunId: string;
  readonly includeOptionalScenarios?: boolean;
  readonly neverUserVisible: true;
}

/**
 * The result of `runRuntimeCorpusGuidedScenarioCoverage`.
 *
 * All safety invariant fields are literal types.
 * `scenarioResults` contains one entry per scenario in the loaded list.
 */
export interface RuntimeCorpusGuidedCoverageResult {
  readonly coverageRunId: string;
  readonly verdict: RuntimeCorpusGuidedCoverageVerdict;
  readonly scenarioResults: readonly RuntimeCorpusGuidedScenarioResult[];
  readonly totalScenarios: number;
  readonly passedScenarios: number;
  readonly failedScenarios: number;
  readonly diagnostics: readonly RuntimeCorpusGuidedCoverageDiagnosticCode[];

  readonly liveLLMCalled: false;
  readonly apiRouteTouched: false;
  readonly uiTouched: false;
  readonly persistenceUsed: false;
  readonly dnaSavePerformed: false;
  readonly offlineSavePerformed: false;
  readonly neverUserVisible: true;
}
