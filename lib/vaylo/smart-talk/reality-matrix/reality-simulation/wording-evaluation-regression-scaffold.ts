/**
 * Runtime Explanation Wording Evaluation regression scaffold (Phase 8.2F-12).
 *
 * Eight structural cases exercising evaluateExplanationWordingScaffold:
 *
 *  Case 1 — perfect empathetic metadata                → approved
 *  Case 2 — authoritative legal advice signal          → hard_fail_tone_violation
 *  Case 3 — false reassurance signal                   → hard_fail_tone_violation
 *  Case 4 — panicInducing > 30                         → hard_fail_tone_violation
 *  Case 5 — confusingAmbiguity > 40                    → human_review_required
 *  Case 6 — manipulative signal                        → hard_fail_tone_violation
 *  Case 7 — low clarity, no hard violation             → human_review_required
 *  Case 8 — out-of-range scores clamped and evaluated  → hard_fail_tone_violation (clamped)
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No real text. No NLP. No LLM. No Smart Talk wiring.
 */

import type {
  WordingEvaluationDisposition,
  WordingEvaluationResult,
  WordingToneMatrix,
  WordingViolationCode,
} from "./wording-evaluation-types";
import {
  WORDING_EVALUATION_SCAFFOLD_VERSION,
  evaluateExplanationWordingScaffold,
} from "./run-wording-evaluation-scaffold";

export const WORDING_EVALUATION_REGRESSION_VERSION =
  "8.2f-12-wording-evaluation-regression-scaffold-v1";

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

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 8 wording evaluation regression cases and aggregates results.
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
