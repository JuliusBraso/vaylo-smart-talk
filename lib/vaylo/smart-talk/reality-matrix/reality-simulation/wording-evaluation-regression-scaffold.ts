/**
 * Runtime Explanation Wording Evaluation regression scaffold
 * (Phase 8.2F-12 / 8.2F-15G wording score provenance contract).
 *
 * Thirteen structural cases:
 *
 *  Case  1 — perfect empathetic metadata (raw toneMatrix)     → approved
 *  Case  2 — authoritative legal advice signal (raw)          → hard_fail_tone_violation
 *  Case  3 — false reassurance signal (raw)                   → hard_fail_tone_violation
 *  Case  4 — panicInducing > 30 (raw)                         → hard_fail_tone_violation
 *  Case  5 — confusingAmbiguity > 40 (raw)                    → human_review_required
 *  Case  6 — manipulative signal (raw)                        → hard_fail_tone_violation
 *  Case  7 — low clarity, no hard violation (raw)             → human_review_required
 *  Case  8 — out-of-range scores clamped (raw)                → hard_fail_tone_violation (clamped)
 *  Case  9 — attested WordingToneScoreReport, safe scores     → approved
 *  Case 10 — unattested WordingToneScoreReport, safe scores   → approved + unattested note
 *  Case 11 — invalid WordingToneScoreReport (NaN score)       → human_review_required
 *  Case 12 — out-of-range report score (clamped, hard fail)   → hard_fail_tone_violation
 *  Case 13 — report with falseReassurance > 0                 → hard_fail_tone_violation
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No real text. No NLP. No LLM. No Smart Talk wiring.
 */

import type {
  WordingEvaluationDisposition,
  WordingEvaluationResult,
  WordingToneMatrix,
  WordingToneScoreReport,
  WordingViolationCode,
} from "./wording-evaluation-types";
import {
  WORDING_EVALUATION_SCAFFOLD_VERSION,
  evaluateExplanationWordingFromScoreReport,
  evaluateExplanationWordingScaffold,
} from "./run-wording-evaluation-scaffold";

export const WORDING_EVALUATION_REGRESSION_VERSION =
  "8.2f-15g-wording-evaluation-regression-scaffold-v2";

// ── Result types ──────────────────────────────────────────────────────────────

export interface WordingEvaluationRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly evaluationResult: WordingEvaluationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface WordingEvaluationRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly evaluatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly WordingEvaluationRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Fixture helpers ───────────────────────────────────────────────────────────

function makeMatrix(overrides: Partial<WordingToneMatrix>): WordingToneMatrix {
  return {
    authoritativeLegalAdvice: 0,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
    ...overrides,
  };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertEvaluation(
  caseName: string,
  result: WordingEvaluationResult,
  opts: {
    expectDisposition: WordingEvaluationDisposition;
    expectIsSafeForUser: boolean;
    expectViolations?: readonly WordingViolationCode[];
    expectNoViolations?: readonly WordingViolationCode[];
    expectClampedMax?: Partial<Record<keyof WordingToneMatrix, number>>;
  },
): WordingEvaluationRegressionCaseResult {
  const failures: string[] = [];

  if (result.disposition !== opts.expectDisposition) {
    failures.push(
      `disposition: expected="${opts.expectDisposition}", got="${result.disposition}"`,
    );
  }
  if (result.isSafeForUser !== opts.expectIsSafeForUser) {
    failures.push(
      `isSafeForUser: expected=${String(opts.expectIsSafeForUser)}, got=${String(result.isSafeForUser)}`,
    );
  }
  for (const code of opts.expectViolations ?? []) {
    if (!result.violations.includes(code)) {
      failures.push(`Expected violation "${code}" not in result.violations`);
    }
  }
  for (const code of opts.expectNoViolations ?? []) {
    if (result.violations.includes(code)) {
      failures.push(`Violation "${code}" must NOT be in result.violations`);
    }
  }
  // Verify clamp: every value in clampedToneMatrix must be in [0, 100].
  for (const key of Object.keys(result.clampedToneMatrix) as (keyof WordingToneMatrix)[]) {
    const val = result.clampedToneMatrix[key];
    if (val < 0 || val > 100) {
      failures.push(
        `clampedToneMatrix.${key}=${String(val)} is outside [0, 100]`,
      );
    }
  }
  // Optional field-level max checks.
  for (const [key, max] of Object.entries(opts.expectClampedMax ?? {}) as [
    keyof WordingToneMatrix,
    number,
  ][]) {
    const val = result.clampedToneMatrix[key];
    if (val > max) {
      failures.push(
        `clampedToneMatrix.${key}=${String(val)} exceeds expected max ${String(max)}`,
      );
    }
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on evaluation result");
  }

  const passed = failures.length === 0;
  return {
    caseName,
    passed,
    evaluationResult: result,
    failures,
    notes: [
      passed
        ? `Case "${caseName}" passed.`
        : `Case "${caseName}" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 1 — perfect empathetic metadata → approved ──────────────────────────

function runCase1(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "perfect_empathetic_metadata_approved",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-001",
      toneMatrix: makeMatrix({ empatheticClarity: 85 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "approved",
      expectIsSafeForUser: true,
      expectViolations: [],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_false_reassurance_detected",
        "tone_manipulative_detected",
        "tone_panic_inducing_detected",
        "tone_insufficient_clarity",
      ],
    },
  );
}

// ── Case 2 — authoritative legal advice → hard fail ──────────────────────────

function runCase2(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "authoritative_legal_advice_hard_fail",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-002",
      toneMatrix: makeMatrix({ authoritativeLegalAdvice: 25 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_authoritative_advice_detected"],
      expectNoViolations: ["tone_insufficient_clarity"],
    },
  );
}

// ── Case 3 — false reassurance → hard fail ────────────────────────────────────

function runCase3(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "false_reassurance_hard_fail",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-003",
      toneMatrix: makeMatrix({ falseReassurance: 15 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_false_reassurance_detected"],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_manipulative_detected",
      ],
    },
  );
}

// ── Case 4 — panicInducing > 30 → hard fail ───────────────────────────────────

function runCase4(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "panic_inducing_above_threshold_hard_fail",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-004",
      toneMatrix: makeMatrix({ panicInducing: 55 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_panic_inducing_detected"],
    },
  );
}

// ── Case 5 — confusingAmbiguity > 40 → human review ──────────────────────────

function runCase5(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "confusing_ambiguity_human_review",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-005",
      toneMatrix: makeMatrix({ confusingAmbiguity: 65, empatheticClarity: 70 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "human_review_required",
      expectIsSafeForUser: false,
      expectViolations: ["tone_highly_ambiguous"],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_panic_inducing_detected",
        "tone_insufficient_clarity",
      ],
    },
  );
}

// ── Case 6 — manipulative signal → hard fail ─────────────────────────────────

function runCase6(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "manipulative_signal_hard_fail",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-006",
      toneMatrix: makeMatrix({ manipulative: 10 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_manipulative_detected"],
      expectNoViolations: [
        "tone_false_reassurance_detected",
        "tone_authoritative_advice_detected",
      ],
    },
  );
}

// ── Case 7 — low clarity, no hard violation → human review ───────────────────

function runCase7(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "low_clarity_no_hard_violation_human_review",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-007",
      toneMatrix: makeMatrix({ empatheticClarity: 30 }),
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "human_review_required",
      expectIsSafeForUser: false,
      expectViolations: ["tone_insufficient_clarity"],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_false_reassurance_detected",
        "tone_manipulative_detected",
        "tone_panic_inducing_detected",
        "tone_highly_ambiguous",
      ],
    },
  );
}

// ── Case 8 — out-of-range scores clamped, still evaluates correctly ───────────

function runCase8(): WordingEvaluationRegressionCaseResult {
  // authoritativeLegalAdvice = 150 → clamped to 100 → still > 0 → hard fail.
  // empatheticClarity = 200 → clamped to 100.
  return assertEvaluation(
    "out_of_range_scores_clamped_evaluated",
    evaluateExplanationWordingScaffold({
      draftId: "regression-draft-008",
      toneMatrix: {
        authoritativeLegalAdvice: 150,
        falseReassurance: 0,
        panicInducing: 0,
        manipulative: 0,
        confusingAmbiguity: 0,
        empatheticClarity: 200,
      },
      sourceKind: "synthetic_metadata",
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_authoritative_advice_detected"],
      expectClampedMax: {
        authoritativeLegalAdvice: 100,
        empatheticClarity: 100,
      },
    },
  );
}

// ── Score report fixture helpers (Phase 8.2F-15G) ────────────────────────────

const BASE_SCORE_REPORT: WordingToneScoreReport = {
  reportId: "regression-score-report-base",
  sourceKind: "manual_review_metadata",
  attestationStatus: "test_fixture_attested",
  toneMatrix: {
    authoritativeLegalAdvice: 0,
    falseReassurance: 0,
    panicInducing: 0,
    manipulative: 0,
    confusingAmbiguity: 0,
    empatheticClarity: 80,
  },
  evaluatorId: "regression-evaluator",
  evaluatorVersion: "8.2f-15g-v1",
  generatedBy: "wording-evaluation-regression-scaffold-v2",
  neverUserVisible: true,
  notes: ["Fixture: base attested score report for Phase 8.2F-15G regression tests."],
};

// ── Case 9 — attested WordingToneScoreReport, safe scores → approved ──────────
// 8.2F-15G: exercises the provenance-backed WordingToneScoreReport path.
// Attestation is test_fixture_attested → no unattested note in result.

function runCase9(): WordingEvaluationRegressionCaseResult {
  return assertEvaluation(
    "score_report_attested_safe_scores_approved",
    evaluateExplanationWordingFromScoreReport({
      draftId: "regression-draft-009",
      scoreReport: BASE_SCORE_REPORT,
    }),
    {
      expectDisposition: "approved",
      expectIsSafeForUser: true,
      expectViolations: [],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_false_reassurance_detected",
        "tone_manipulative_detected",
        "tone_panic_inducing_detected",
        "tone_insufficient_clarity",
      ],
    },
  );
}

// ── Case 10 — unattested WordingToneScoreReport, safe scores → approved ───────
// 8.2F-15G: unattested report is structurally valid; evaluation proceeds normally;
// result notes mention unattested provenance gap. Disposition unchanged.

function runCase10(): WordingEvaluationRegressionCaseResult {
  const unattestedReport: WordingToneScoreReport = {
    ...BASE_SCORE_REPORT,
    reportId: "regression-score-report-10-unattested",
    attestationStatus: "unattested",
    notes: ["Fixture: unattested score report for regression case 10."],
  };

  const result = evaluateExplanationWordingFromScoreReport({
    draftId: "regression-draft-010",
    scoreReport: unattestedReport,
  });

  const failures: string[] = [];

  if (result.disposition !== "approved") {
    failures.push(
      `disposition: expected="approved", got="${result.disposition}"`,
    );
  }
  if (!result.isSafeForUser) {
    failures.push("isSafeForUser: expected=true, got=false");
  }
  // Unattested report must leave a governance note in the result.
  const hasUnattestedNote = (result.notes ?? []).some((n) =>
    n.includes("unattested"),
  );
  if (!hasUnattestedNote) {
    failures.push(
      "Expected result.notes to contain an unattested provenance note, but none found.",
    );
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on evaluation result");
  }

  const passed = failures.length === 0;
  return {
    caseName: "score_report_unattested_safe_scores_approved_with_note",
    passed,
    evaluationResult: result,
    failures,
    notes: [
      passed
        ? `Case "score_report_unattested_safe_scores_approved_with_note" passed.`
        : `Case "score_report_unattested_safe_scores_approved_with_note" failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Case 11 — invalid WordingToneScoreReport (NaN score) → human review ───────
// 8.2F-15G: non-finite toneMatrix value makes scoreUsable=false;
// evaluateExplanationWordingFromScoreReport returns human_review_required.

function runCase11(): WordingEvaluationRegressionCaseResult {
  const invalidReport: WordingToneScoreReport = {
    ...BASE_SCORE_REPORT,
    reportId: "regression-score-report-11-invalid",
    toneMatrix: {
      authoritativeLegalAdvice: Number.NaN,
      falseReassurance: 0,
      panicInducing: 0,
      manipulative: 0,
      confusingAmbiguity: 0,
      empatheticClarity: 80,
    },
    notes: ["Fixture: invalid score report (NaN) for regression case 11."],
  };

  return assertEvaluation(
    "score_report_invalid_nan_score_human_review",
    evaluateExplanationWordingFromScoreReport({
      draftId: "regression-draft-011",
      scoreReport: invalidReport,
    }),
    {
      expectDisposition: "human_review_required",
      expectIsSafeForUser: false,
      expectViolations: [],
    },
  );
}

// ── Case 12 — out-of-range score report, clamped, still hard-fails ────────────
// 8.2F-15G: finite but out-of-range authoritativeLegalAdvice (200) is clamped
// to 100 → still > 0 → hard_fail_tone_violation. Scores remain in [0, 100].

function runCase12(): WordingEvaluationRegressionCaseResult {
  const outOfRangeReport: WordingToneScoreReport = {
    ...BASE_SCORE_REPORT,
    reportId: "regression-score-report-12-out-of-range",
    toneMatrix: {
      authoritativeLegalAdvice: 200,
      falseReassurance: 0,
      panicInducing: 0,
      manipulative: 0,
      confusingAmbiguity: 0,
      empatheticClarity: 300,
    },
    notes: ["Fixture: out-of-range score report for regression case 12."],
  };

  return assertEvaluation(
    "score_report_out_of_range_clamped_hard_fail",
    evaluateExplanationWordingFromScoreReport({
      draftId: "regression-draft-012",
      scoreReport: outOfRangeReport,
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_authoritative_advice_detected"],
      expectClampedMax: {
        authoritativeLegalAdvice: 100,
        empatheticClarity: 100,
      },
    },
  );
}

// ── Case 13 — score report with falseReassurance > 0 → hard fail ──────────────
// 8.2F-15G: attested report with falseReassurance=20 still triggers hard fail;
// provenance does not override governance rules.

function runCase13(): WordingEvaluationRegressionCaseResult {
  const falsifyingReport: WordingToneScoreReport = {
    ...BASE_SCORE_REPORT,
    reportId: "regression-score-report-13-false-reassurance",
    toneMatrix: {
      ...BASE_SCORE_REPORT.toneMatrix,
      falseReassurance: 20,
    },
    notes: ["Fixture: false reassurance score report for regression case 13."],
  };

  return assertEvaluation(
    "score_report_false_reassurance_hard_fail",
    evaluateExplanationWordingFromScoreReport({
      draftId: "regression-draft-013",
      scoreReport: falsifyingReport,
    }),
    {
      expectDisposition: "hard_fail_tone_violation",
      expectIsSafeForUser: false,
      expectViolations: ["tone_false_reassurance_detected"],
      expectNoViolations: [
        "tone_authoritative_advice_detected",
        "tone_manipulative_detected",
        "tone_insufficient_clarity",
      ],
    },
  );
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 13 wording evaluation regression cases and aggregates results.
 *
 * Cases 1–8: raw toneMatrix backward-compat path.
 * Cases 9–13: WordingToneScoreReport provenance-backed path (8.2F-15G).
 *
 * Does not throw. All assertions collected as failure strings.
 * No real text evaluated. No NLP. No LLM. No Smart Talk runtime.
 */
export function runWordingEvaluationRegressionScaffold(): WordingEvaluationRegressionScaffoldResult {
  const caseResults: WordingEvaluationRegressionCaseResult[] = [
    runCase1(),
    runCase2(),
    runCase3(),
    runCase4(),
    runCase5(),
    runCase6(),
    runCase7(),
    runCase8(),
    runCase9(),
    runCase10(),
    runCase11(),
    runCase12(),
    runCase13(),
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `Wording evaluation regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All tone violation rules, ambiguity/clarity thresholds, score clamping, " +
        "and neverUserVisible invariants validated.",
    );
    notes.push(
      "Cases 9–13 validate WordingToneScoreReport provenance path (8.2F-15G): " +
        "attested → approved; unattested → approved + provenance note; " +
        "NaN score → human_review_required; clamped out-of-range → hard fail; " +
        "false reassurance report → hard fail.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review evaluationResult for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no real text evaluated, no NLP, no LLM, " +
      "no prose generated, no Smart Talk production wiring.",
  );

  return {
    scaffoldVersion: WORDING_EVALUATION_REGRESSION_VERSION,
    evaluatorVersion: WORDING_EVALUATION_SCAFFOLD_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
