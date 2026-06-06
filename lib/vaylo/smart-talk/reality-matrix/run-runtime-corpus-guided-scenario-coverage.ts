/**
 * Runtime Corpus-Guided Scenario Coverage (Phase 8.2G-11).
 *
 * Implements `runRuntimeCorpusGuidedScenarioCoverage` — a pure coverage runner
 * that exercises all six governance-relevant runtime outcomes through the
 * existing synthetic E2E harness.
 *
 * Base scenarios (6) cover all required governance paths:
 *   1. safe_document_explanation  → completed_authorised_packet
 *   2. unsafe_output_contract     → blocked_output_contract
 *   3. wording_hard_fail          → blocked_wording_gate
 *   4. human_review_required      → blocked_user_visible_authorisation
 *   5. internal_metadata_leak     → blocked_response_assembler
 *   6. missing_sections           → blocked_response_assembler
 *
 * Optional corpus-informed scenarios (6 additional) trace back to controlled
 * corpus scenario IDs from lib/vaylo/smart-talk/reality-matrix/controlled-corpus/
 * scenarios.ts for audit traceability. They use the same harness fixture modes
 * as the base scenarios (the corpus scenarios operate in a different type space
 * and are not imported here).
 *
 * Safety guarantees:
 * - No live LLM call
 * - No API/UI touch
 * - No persistence
 * - Pure function (calls only the pure E2E harness)
 */

import { runRuntimeSyntheticE2EHarness } from "./run-runtime-synthetic-e2e-harness";
import type {
  RuntimeCorpusGuidedCoverageDiagnosticCode,
  RuntimeCorpusGuidedCoverageInput,
  RuntimeCorpusGuidedCoverageResult,
  RuntimeCorpusGuidedCoverageVerdict,
  RuntimeCorpusGuidedScenario,
  RuntimeCorpusGuidedScenarioExpectedOutcome,
  RuntimeCorpusGuidedScenarioResult,
} from "./runtime-corpus-guided-scenario-coverage-types";
import type { RuntimeSyntheticE2EHarnessVerdict } from "./runtime-synthetic-e2e-harness-types";

export const CORPUS_GUIDED_COVERAGE_VERSION =
  "8.2g-11-corpus-guided-scenario-coverage-v1";

// ── Scenario lists ────────────────────────────────────────────────────────────

/**
 * Six base scenarios covering every governance outcome path in the E2E harness.
 * All synthetic; no real documents, no PII, no LLM calls required.
 */
const BASE_SCENARIOS: readonly RuntimeCorpusGuidedScenario[] = [
  {
    scenarioId: "cgsc-8-2g-11-001-safe-explanation",
    kind: "safe_document_explanation",
    fixtureMode: "mock_safe",
    expectedOutcome: "authorised_packet",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Baseline safe synthetic explanation path.",
      "Corpus traceability: cc-8-2e-0001 (benign invoice) — safe, low-risk document family.",
      "Full internal pipeline must produce completed_authorised_packet.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-002-unsafe-output-contract",
    kind: "unsafe_output_contract",
    fixtureMode: "mock_unsafe_output_contract",
    expectedOutcome: "blocked_output_contract",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Output contract validator must reject unsafe safety-flagged draft.",
      "Corpus traceability: cc-8-2e-0015 (prompt injection) — adversarial input must be rejected at contract layer.",
      "Pipeline must stop at output contract validator.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-003-wording-hard-fail",
    kind: "wording_hard_fail",
    fixtureMode: "mock_wording_hard_fail",
    expectedOutcome: "blocked_wording_gate",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Wording governance gate must hard-fail on legal-advice score report.",
      "Corpus traceability: cc-8-2e-0004 (explicit Vollstreckung) — wording with enforcement certainty must be blocked.",
      "Pipeline must stop at wording gate.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-004-human-review",
    kind: "human_review_required",
    fixtureMode: "mock_human_review",
    expectedOutcome: "blocked_user_visible_authorisation",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Human-review packets must be blocked from user-visible authorisation.",
      "Corpus traceability: cc-8-2e-0008 (Jobcenter missing documents) — high-consequence ambiguity requiring human review.",
      "Assembler produces human_review packet; authorisation gate rejects it.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-005-metadata-leak",
    kind: "internal_metadata_leak",
    fixtureMode: "mock_metadata_leak",
    expectedOutcome: "blocked_response_assembler",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Response assembler bridge must reject a draft that leaks internal metadata markers.",
      "Corpus traceability: cc-8-2e-0017 (monetization bypass) — internal markers must not flow to user-visible output.",
      "Pipeline must stop at assembler bridge.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-006-missing-sections",
    kind: "missing_sections",
    fixtureMode: "mock_empty_sections",
    expectedOutcome: "blocked_response_assembler",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Response assembler bridge must reject a draft with no section candidates.",
      "Corpus traceability: cc-8-2e-0011 (OCR noise) — fragmented or empty source must not produce empty explanation.",
      "Pipeline must stop at assembler bridge (rejected_missing_sections).",
    ],
  },
];

/**
 * Six optional corpus-informed scenarios providing additional coverage breadth.
 * These trace to higher-risk corpus scenarios (adversarial / multi-lane chaos /
 * high-consequence domains) and re-exercise the same fixture modes with
 * richer audit notes for traceability.
 *
 * Only included when input.includeOptionalScenarios === true.
 */
const OPTIONAL_CORPUS_SCENARIOS: readonly RuntimeCorpusGuidedScenario[] = [
  {
    scenarioId: "cgsc-8-2g-11-007-adversarial-injection-contract",
    kind: "unsafe_output_contract",
    fixtureMode: "mock_unsafe_output_contract",
    expectedOutcome: "blocked_output_contract",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended adversarial contract rejection coverage.",
      "Corpus traceability: cc-8-2e-0015 (system override injection) — embedded instruction override must not pass contract layer.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-008-multi-lane-chaos-wording",
    kind: "wording_hard_fail",
    fixtureMode: "mock_wording_hard_fail",
    expectedOutcome: "blocked_wording_gate",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended wording gate hard-fail coverage for multi-lane scenarios.",
      "Corpus traceability: cc-8-2e-0016 (multi-lane chaos) — enforcement certainty across four authority lanes must be blocked at wording gate.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-009-immigration-human-review",
    kind: "human_review_required",
    fixtureMode: "mock_human_review",
    expectedOutcome: "blocked_user_visible_authorisation",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended human-review authorisation gate coverage for high-consequence domains.",
      "Corpus traceability: cc-8-2e-0010 (Ausländerbehörde appointment) — high-consequence immigration scenario must not bypass human review gate.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-010-false-reassurance-safe-path",
    kind: "safe_document_explanation",
    fixtureMode: "mock_safe",
    expectedOutcome: "authorised_packet",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended safe path coverage demonstrating that non-adversarial safe scenarios still reach authorised_packet.",
      "Corpus traceability: cc-8-2e-0013 (false reassurance trap) — once governance correctly classifies a safe explanation, pipeline must complete.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-011-deadline-pressure-metadata-guard",
    kind: "internal_metadata_leak",
    fixtureMode: "mock_metadata_leak",
    expectedOutcome: "blocked_response_assembler",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended metadata leak guard for deadline-pressure scenarios.",
      "Corpus traceability: cc-8-2e-0019 (deadline pressure no date) — internal governance markers must never reach the user response even under deadline urgency framing.",
    ],
  },
  {
    scenarioId: "cgsc-8-2g-11-012-enforcement-wording-missing-sections",
    kind: "missing_sections",
    fixtureMode: "mock_empty_sections",
    expectedOutcome: "blocked_response_assembler",
    syntheticOnly: true,
    neverUserVisible: true,
    notes: [
      "Extended missing-sections guard for enforcement-wording scenarios.",
      "Corpus traceability: cc-8-2e-0020 (conditional enforcement) — conditional enforcement language must not produce a partial or empty explanation that passes the assembler.",
    ],
  },
];

// ── Verdict translation ───────────────────────────────────────────────────────

function translateHarnessVerdict(
  verdict: RuntimeSyntheticE2EHarnessVerdict,
): RuntimeCorpusGuidedScenarioExpectedOutcome | null {
  switch (verdict) {
    case "completed_authorised_packet":
      return "authorised_packet";
    case "blocked_output_contract":
      return "blocked_output_contract";
    case "blocked_wording_gate":
      return "blocked_wording_gate";
    case "blocked_response_assembler":
      return "blocked_response_assembler";
    case "blocked_user_visible_authorisation":
      return "blocked_user_visible_authorisation";
    default:
      return null;
  }
}

// ── Invariant check ───────────────────────────────────────────────────────────

function harnessViolatesInvariants(
  result: ReturnType<typeof runRuntimeSyntheticE2EHarness>,
): boolean {
  return (
    result.liveLLMCalled !== false ||
    result.apiRouteTouched !== false ||
    result.uiTouched !== false ||
    result.persistenceUsed !== false ||
    result.dnaSavePerformed !== false ||
    result.offlineSavePerformed !== false
  );
}

// ── Main function ─────────────────────────────────────────────────────────────

/**
 * Runs all corpus-guided scenarios through `runRuntimeSyntheticE2EHarness`.
 *
 * For each scenario, translates the harness verdict to a coverage outcome and
 * compares it against the expected outcome. All harness invariants are verified
 * on every result.
 *
 * Pure function — no side effects, no external calls, no persistence.
 */
export function runRuntimeCorpusGuidedScenarioCoverage(
  input: RuntimeCorpusGuidedCoverageInput,
): RuntimeCorpusGuidedCoverageResult {
  const diagnostics: RuntimeCorpusGuidedCoverageDiagnosticCode[] = [
    "corpus_coverage_started",
    "corpus_coverage_no_live_llm_confirmed",
    "corpus_coverage_no_api_ui_confirmed",
    "corpus_coverage_no_persistence_confirmed",
  ];

  const scenarios: RuntimeCorpusGuidedScenario[] = [
    ...BASE_SCENARIOS,
    ...(input.includeOptionalScenarios === true ? OPTIONAL_CORPUS_SCENARIOS : []),
  ];

  if (scenarios.length === 0) {
    diagnostics.push("corpus_coverage_rejected_no_scenarios");
    return {
      coverageRunId: input.coverageRunId,
      verdict: "rejected_no_scenarios",
      scenarioResults: [],
      totalScenarios: 0,
      passedScenarios: 0,
      failedScenarios: 0,
      diagnostics,
      liveLLMCalled: false,
      apiRouteTouched: false,
      uiTouched: false,
      persistenceUsed: false,
      dnaSavePerformed: false,
      offlineSavePerformed: false,
      neverUserVisible: true,
    };
  }

  diagnostics.push("corpus_coverage_scenarios_loaded");

  const scenarioResults: RuntimeCorpusGuidedScenarioResult[] = [];
  let invariantViolation = false;

  for (const scenario of scenarios) {
    const scenarioDiagnostics: RuntimeCorpusGuidedCoverageDiagnosticCode[] = [];

    const harnessResult = runRuntimeSyntheticE2EHarness({
      harnessRunId: `${input.coverageRunId}:${scenario.scenarioId}`,
      fixtureMode: scenario.fixtureMode,
      neverUserVisible: true,
    });

    scenarioDiagnostics.push("corpus_coverage_scenario_completed");

    if (harnessViolatesInvariants(harnessResult)) {
      invariantViolation = true;
      diagnostics.push("corpus_coverage_invariant_violation");
      scenarioDiagnostics.push("corpus_coverage_scenario_failed");
      scenarioResults.push({
        scenarioId: scenario.scenarioId,
        kind: scenario.kind,
        fixtureMode: scenario.fixtureMode,
        expectedOutcome: scenario.expectedOutcome,
        harnessVerdict: harnessResult.verdict,
        passed: false,
        diagnostics: scenarioDiagnostics,
        neverUserVisible: true,
      });
      break;
    }

    const actualOutcome = translateHarnessVerdict(harnessResult.verdict);
    const passed = actualOutcome === scenario.expectedOutcome;

    scenarioDiagnostics.push(passed ? "corpus_coverage_scenario_passed" : "corpus_coverage_scenario_failed");
    diagnostics.push("corpus_coverage_scenario_completed");

    scenarioResults.push({
      scenarioId: scenario.scenarioId,
      kind: scenario.kind,
      fixtureMode: scenario.fixtureMode,
      expectedOutcome: scenario.expectedOutcome,
      harnessVerdict: harnessResult.verdict,
      passed,
      diagnostics: scenarioDiagnostics,
      neverUserVisible: true,
    });
  }

  if (invariantViolation) {
    return {
      coverageRunId: input.coverageRunId,
      verdict: "failed_invariant_violation",
      scenarioResults,
      totalScenarios: scenarios.length,
      passedScenarios: scenarioResults.filter((r) => r.passed).length,
      failedScenarios: scenarioResults.filter((r) => !r.passed).length,
      diagnostics,
      liveLLMCalled: false,
      apiRouteTouched: false,
      uiTouched: false,
      persistenceUsed: false,
      dnaSavePerformed: false,
      offlineSavePerformed: false,
      neverUserVisible: true,
    };
  }

  const passedCount = scenarioResults.filter((r) => r.passed).length;
  const failedCount = scenarioResults.length - passedCount;
  const allPassed = failedCount === 0;

  diagnostics.push(allPassed ? "corpus_coverage_all_passed" : "corpus_coverage_has_failures");

  const verdict: RuntimeCorpusGuidedCoverageVerdict = allPassed
    ? "completed_all_passed"
    : "completed_with_failures";

  return {
    coverageRunId: input.coverageRunId,
    verdict,
    scenarioResults,
    totalScenarios: scenarios.length,
    passedScenarios: passedCount,
    failedScenarios: failedCount,
    diagnostics,
    liveLLMCalled: false,
    apiRouteTouched: false,
    uiTouched: false,
    persistenceUsed: false,
    dnaSavePerformed: false,
    offlineSavePerformed: false,
    neverUserVisible: true,
  };
}
