/**
 * OCR Uncertainty regression scaffold (Phase 8.2F-9 / 8.2F-15E provenance contract).
 *
 * 11 structural cases:
 *
 *  Case 1  — perfect scan, high score              → optimal, proceed
 *  Case 2  — missing dates                         → critical ambiguity, human review, do_not_calculate_deadline
 *  Case 3  — unreadable amounts                    → critical ambiguity, human review
 *  Case 4  — obscured sender                       → hard fail
 *  Case 5  — score 20 (below threshold)            → hard fail, unreadable
 *  Case 6  — mixed lanes detected                  → proceed_with_uncertainty, do_not_merge_lanes
 *  Case 7  — possible prompt injection text        → proceed_with_uncertainty, do_not_present_dry_run_as_fact
 *  Case 8  — partial document only                 → human review required, critical ambiguity
 *  Case 9  — OcrQualityReport, attested, high score → optimal, proceed (provenance path)
 *  Case 10 — OcrQualityReport, unattested          → proceed but notes include attestation warning
 *  Case 11 — OcrQualityReport, out-of-range score  → clamped, hard fail if < 40
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No prose generated. No LLM. No OCR SDK. No Smart Talk wiring.
 */

import type { ExplanationBoundary } from "../reality-simulation-types";
import type {
  OcrConfidenceLevel,
  OcrDegradationVector,
  OcrDiagnosticCode,
  OcrEvaluationResult,
  OcrPipelineDisposition,
  OcrQualityReport,
} from "./ocr-uncertainty-types";
import {
  OCR_UNCERTAINTY_EVALUATOR_VERSION,
  evaluateOcrUncertainty,
  evaluateOcrUncertaintyFromQualityReport,
  validateOcrQualityReport,
} from "./evaluate-ocr-uncertainty";

export const OCR_UNCERTAINTY_REGRESSION_VERSION =
  "8.2f-15e-ocr-uncertainty-regression-scaffold-v2";

// ── Result types ──────────────────────────────────────────────────────────────

export interface OcrUncertaintyRegressionCaseResult {
  readonly caseName: string;
  readonly passed: boolean;
  readonly evaluationResult: OcrEvaluationResult;
  readonly failures: readonly string[];
  readonly notes: readonly string[];
}

export interface OcrUncertaintyRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly evaluatorVersion: string;
  readonly allPassed: boolean;
  readonly caseResults: readonly OcrUncertaintyRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Fixture helpers ───────────────────────────────────────────────────────────

const CLEAN_VECTOR: OcrDegradationVector = {
  missingDates: false,
  obscuredSender: false,
  unreadableAmounts: false,
  lowResolution: false,
  truncatedText: false,
  mixedLanesDetected: false,
  possiblePromptInjectionText: false,
  partialDocumentOnly: false,
};

function withFlags(overrides: Partial<OcrDegradationVector>): OcrDegradationVector {
  return { ...CLEAN_VECTOR, ...overrides };
}

// ── Assertion helper ──────────────────────────────────────────────────────────

function assertEvaluation(
  caseName: string,
  result: OcrEvaluationResult,
  opts: {
    expectProceedAllowed: boolean;
    expectDisposition: OcrPipelineDisposition;
    expectConfidence: OcrConfidenceLevel;
    expectTriggersHumanReview: boolean;
    expectDiagnostics?: readonly OcrDiagnosticCode[];
    expectNoDiagnostics?: readonly OcrDiagnosticCode[];
    expectBoundaries?: readonly ExplanationBoundary[];
    expectNoBoundaries?: readonly ExplanationBoundary[];
  },
): OcrUncertaintyRegressionCaseResult {
  const failures: string[] = [];

  if (result.proceedAllowed !== opts.expectProceedAllowed) {
    failures.push(
      `proceedAllowed: expected=${String(opts.expectProceedAllowed)}, got=${String(result.proceedAllowed)}`,
    );
  }
  if (result.disposition !== opts.expectDisposition) {
    failures.push(
      `disposition: expected="${opts.expectDisposition}", got="${result.disposition}"`,
    );
  }
  if (result.confidence !== opts.expectConfidence) {
    failures.push(
      `confidence: expected="${opts.expectConfidence}", got="${result.confidence}"`,
    );
  }
  if (result.triggersHumanReview !== opts.expectTriggersHumanReview) {
    failures.push(
      `triggersHumanReview: expected=${String(opts.expectTriggersHumanReview)}, got=${String(result.triggersHumanReview)}`,
    );
  }
  for (const code of opts.expectDiagnostics ?? []) {
    if (!result.diagnostics.includes(code)) {
      failures.push(`Expected diagnostic "${code}" not in result.diagnostics`);
    }
  }
  for (const code of opts.expectNoDiagnostics ?? []) {
    if (result.diagnostics.includes(code)) {
      failures.push(`Diagnostic "${code}" must NOT appear in result.diagnostics`);
    }
  }
  for (const boundary of opts.expectBoundaries ?? []) {
    if (!(result.recommendedBoundaries ?? []).includes(boundary)) {
      failures.push(`Expected boundary "${boundary}" not in result.recommendedBoundaries`);
    }
  }
  for (const boundary of opts.expectNoBoundaries ?? []) {
    if ((result.recommendedBoundaries ?? []).includes(boundary)) {
      failures.push(`Boundary "${boundary}" must NOT appear in result.recommendedBoundaries`);
    }
  }
  // neverUserVisible invariant
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

// ── Case 1 — perfect scan, high score ────────────────────────────────────────

function runCase1(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "perfect_scan_high_score",
    evaluateOcrUncertainty({ degradation: CLEAN_VECTOR, baseConfidenceScore: 95 }),
    {
      expectProceedAllowed: true,
      expectDisposition: "proceed",
      expectConfidence: "optimal",
      expectTriggersHumanReview: false,
      expectDiagnostics: ["ocr_optimal"],
      expectNoDiagnostics: ["ocr_hard_fail_unreadable", "ocr_human_review_required"],
      expectNoBoundaries: ["do_not_calculate_deadline", "do_not_merge_lanes"],
    },
  );
}

// ── Case 2 — missing dates ────────────────────────────────────────────────────

function runCase2(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "missing_dates_human_review",
    evaluateOcrUncertainty({
      degradation: withFlags({ missingDates: true }),
      baseConfidenceScore: 70,
    }),
    {
      expectProceedAllowed: true,
      expectDisposition: "human_review_required",
      expectConfidence: "critical_ambiguity",
      expectTriggersHumanReview: true,
      expectDiagnostics: [
        "ocr_missing_dates",
        "ocr_critical_ambiguity",
        "ocr_human_review_required",
      ],
      expectBoundaries: ["do_not_calculate_deadline", "require_uncertainty_wording"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_hard_fail_unreadable"],
    },
  );
}

// ── Case 3 — unreadable amounts ───────────────────────────────────────────────

function runCase3(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "unreadable_amounts_human_review",
    evaluateOcrUncertainty({
      degradation: withFlags({ unreadableAmounts: true }),
      baseConfidenceScore: 60,
    }),
    {
      expectProceedAllowed: true,
      expectDisposition: "human_review_required",
      expectConfidence: "critical_ambiguity",
      expectTriggersHumanReview: true,
      expectDiagnostics: [
        "ocr_unreadable_amounts",
        "ocr_critical_ambiguity",
        "ocr_human_review_required",
      ],
      expectBoundaries: ["require_uncertainty_wording", "recommend_human_review_high_risk"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_hard_fail_unreadable"],
    },
  );
}

// ── Case 4 — obscured sender ──────────────────────────────────────────────────

function runCase4(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "obscured_sender_hard_fail",
    evaluateOcrUncertainty({
      degradation: withFlags({ obscuredSender: true }),
      baseConfidenceScore: 75,
    }),
    {
      expectProceedAllowed: false,
      expectDisposition: "hard_fail",
      expectConfidence: "critical_ambiguity",
      expectTriggersHumanReview: true,
      expectDiagnostics: ["ocr_sender_obscured"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_human_review_required"],
    },
  );
}

// ── Case 5 — score 20, unreadable ─────────────────────────────────────────────

function runCase5(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "score_20_hard_fail_unreadable",
    evaluateOcrUncertainty({ degradation: CLEAN_VECTOR, baseConfidenceScore: 20 }),
    {
      expectProceedAllowed: false,
      expectDisposition: "hard_fail",
      expectConfidence: "unreadable",
      expectTriggersHumanReview: true,
      expectDiagnostics: ["ocr_hard_fail_unreadable"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_sender_obscured"],
    },
  );
}

// ── Case 6 — mixed lanes ──────────────────────────────────────────────────────

function runCase6(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "mixed_lanes_proceed_with_uncertainty",
    evaluateOcrUncertainty({
      degradation: withFlags({ mixedLanesDetected: true }),
      baseConfidenceScore: 80,
    }),
    {
      expectProceedAllowed: true,
      expectDisposition: "proceed_with_uncertainty",
      expectConfidence: "degraded_but_readable",
      expectTriggersHumanReview: false,
      expectDiagnostics: ["ocr_mixed_lanes"],
      expectBoundaries: ["do_not_merge_lanes", "require_uncertainty_wording"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_hard_fail_unreadable", "ocr_human_review_required"],
    },
  );
}

// ── Case 7 — possible prompt injection text ───────────────────────────────────

function runCase7(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "possible_prompt_injection_proceed_with_uncertainty",
    evaluateOcrUncertainty({
      degradation: withFlags({ possiblePromptInjectionText: true }),
      baseConfidenceScore: 85,
    }),
    {
      expectProceedAllowed: true,
      expectDisposition: "proceed_with_uncertainty",
      expectConfidence: "degraded_but_readable",
      expectTriggersHumanReview: false,
      expectDiagnostics: ["ocr_prompt_injection_like_text"],
      expectBoundaries: ["do_not_present_dry_run_as_fact", "require_uncertainty_wording"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_hard_fail_unreadable", "ocr_human_review_required"],
    },
  );
}

// ── Case 8 — partial document only ───────────────────────────────────────────

function runCase8(): OcrUncertaintyRegressionCaseResult {
  return assertEvaluation(
    "partial_document_only_human_review",
    evaluateOcrUncertainty({
      degradation: withFlags({ partialDocumentOnly: true }),
      baseConfidenceScore: 65,
    }),
    {
      expectProceedAllowed: true,
      expectDisposition: "human_review_required",
      expectConfidence: "critical_ambiguity",
      expectTriggersHumanReview: true,
      expectDiagnostics: [
        "ocr_partial_document",
        "ocr_critical_ambiguity",
        "ocr_human_review_required",
      ],
      expectBoundaries: ["require_uncertainty_wording", "recommend_human_review_high_risk"],
      expectNoDiagnostics: ["ocr_optimal", "ocr_hard_fail_unreadable"],
    },
  );
}

// ── Cases 9–11: OcrQualityReport provenance path (Phase 8.2F-15E) ─────────────

// Case 9 — attested quality report, high score → optimal, proceed
function runCase9(): OcrUncertaintyRegressionCaseResult {
  const report: OcrQualityReport = {
    reportId: "regression-report-9-attested",
    sourceKind: "manual_test_fixture",
    attestationStatus: "test_fixture_attested",
    confidenceScore: 92,
    qualityFlags: [],
    generatedBy: "ocr-uncertainty-regression-scaffold-v2",
    neverUserVisible: true,
    notes: ["Fixture: attested high-quality report for regression case 9."],
  };

  // Also validate the report structure
  const validation = validateOcrQualityReport(report);
  const result = evaluateOcrUncertaintyFromQualityReport({
    degradation: CLEAN_VECTOR,
    qualityReport: report,
  });

  const baseAssertion = assertEvaluation(
    "quality_report_attested_high_score",
    result,
    {
      expectProceedAllowed: true,
      expectDisposition: "proceed",
      expectConfidence: "optimal",
      expectTriggersHumanReview: false,
      expectDiagnostics: ["ocr_optimal"],
      expectNoDiagnostics: ["ocr_hard_fail_unreadable", "ocr_human_review_required"],
    },
  );

  const failures = [...baseAssertion.failures];

  if (!validation.valid) {
    failures.push(`validateOcrQualityReport reported invalid: ${validation.diagnostics.join("; ")}`);
  }
  if (!validation.confidenceScoreUsable) {
    failures.push("validateOcrQualityReport: confidenceScoreUsable must be true for score 92");
  }
  if (!result.neverUserVisible) {
    failures.push("neverUserVisible must be true on quality-report evaluation result");
  }

  const passed = failures.length === 0;
  return {
    caseName: "quality_report_attested_high_score",
    passed,
    evaluationResult: result,
    failures,
    notes: [
      passed
        ? "Case 9 passed: attested OcrQualityReport → optimal proceed, validateOcrQualityReport valid."
        : `Case 9 failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// Case 10 — unattested quality report → proceed with attestation warning note
function runCase10(): OcrUncertaintyRegressionCaseResult {
  const report: OcrQualityReport = {
    reportId: "regression-report-10-unattested",
    sourceKind: "synthetic_metadata",
    attestationStatus: "unattested",
    confidenceScore: 85,
    qualityFlags: [],
    generatedBy: "test-caller-unverified",
    neverUserVisible: true,
  };

  const validation = validateOcrQualityReport(report);
  const result = evaluateOcrUncertaintyFromQualityReport({
    degradation: CLEAN_VECTOR,
    qualityReport: report,
  });

  const baseAssertion = assertEvaluation(
    "quality_report_unattested",
    result,
    {
      expectProceedAllowed: true,
      expectDisposition: "proceed",
      expectConfidence: "optimal",
      expectTriggersHumanReview: false,
      expectDiagnostics: ["ocr_optimal"],
    },
  );

  const failures = [...baseAssertion.failures];

  // Attestation warning must appear in the result notes.
  const hasAttestationNote = (result.notes ?? []).some((n) =>
    n.includes("unattested"),
  );
  if (!hasAttestationNote) {
    failures.push(
      "Expected attestation warning note in result.notes for unattested quality report.",
    );
  }

  // validateOcrQualityReport should report the attestation issue in diagnostics
  // without marking valid=false (attestation alone does not invalidate the report).
  const hasAttestedDiagnostic = validation.diagnostics.some((d) =>
    d.includes("unattested"),
  );
  if (!hasAttestedDiagnostic) {
    failures.push(
      "validateOcrQualityReport should emit attestation diagnostic for unattested report.",
    );
  }

  const passed = failures.length === 0;
  return {
    caseName: "quality_report_unattested",
    passed,
    evaluationResult: result,
    failures,
    notes: [
      passed
        ? "Case 10 passed: unattested OcrQualityReport → proceeds with attestation warning note."
        : `Case 10 failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// Case 11 — out-of-range confidence score → clamped, hard fail if clamped < 40
function runCase11(): OcrUncertaintyRegressionCaseResult {
  const report: OcrQualityReport = {
    reportId: "regression-report-11-out-of-range",
    sourceKind: "synthetic_metadata",
    attestationStatus: "test_fixture_attested",
    confidenceScore: -50,   // out-of-range negative → clamps to 0 → hard fail
    qualityFlags: [],
    generatedBy: "ocr-uncertainty-regression-scaffold-v2",
    neverUserVisible: true,
    notes: ["Fixture: negative score to verify clamping to 0 and hard-fail."],
  };

  const validation = validateOcrQualityReport(report);
  const result = evaluateOcrUncertaintyFromQualityReport({
    degradation: CLEAN_VECTOR,
    qualityReport: report,
  });

  const baseAssertion = assertEvaluation(
    "quality_report_out_of_range_score",
    result,
    {
      expectProceedAllowed: false,
      expectDisposition: "hard_fail",
      expectConfidence: "unreadable",
      expectTriggersHumanReview: true,
      expectDiagnostics: ["ocr_hard_fail_unreadable"],
      expectNoDiagnostics: ["ocr_optimal"],
    },
  );

  const failures = [...baseAssertion.failures];

  // validateOcrQualityReport should flag the out-of-range score
  const hasClamppingDiagnostic = validation.diagnostics.some((d) =>
    d.includes("clamped") || d.includes("outside"),
  );
  if (!hasClamppingDiagnostic) {
    failures.push(
      "validateOcrQualityReport should emit clamping diagnostic for out-of-range score -50.",
    );
  }

  const passed = failures.length === 0;
  return {
    caseName: "quality_report_out_of_range_score",
    passed,
    evaluationResult: result,
    failures,
    notes: [
      passed
        ? "Case 11 passed: out-of-range confidence (-50) clamped to 0, hard fail confirmed."
        : `Case 11 failed with ${String(failures.length)} failure(s).`,
    ],
  };
}

// ── Scaffold runner ───────────────────────────────────────────────────────────

/**
 * Runs all 11 OCR uncertainty regression cases and aggregates results.
 *
 * Cases 1–8: evaluateOcrUncertainty (direct baseConfidenceScore path).
 * Cases 9–11: evaluateOcrUncertaintyFromQualityReport (OcrQualityReport provenance path).
 *
 * Does not throw. All assertions collected as failure strings.
 * No prose generated. No LLM. No OCR SDK. No Smart Talk runtime.
 */
export function runOcrUncertaintyRegressionScaffold(): OcrUncertaintyRegressionScaffoldResult {
  const caseResults: OcrUncertaintyRegressionCaseResult[] = [
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
  ];

  const allPassed = caseResults.every((r) => r.passed);
  const passCount = caseResults.filter((r) => r.passed).length;
  const failCount = caseResults.length - passCount;

  const notes: string[] = [
    `OCR uncertainty regression scaffold complete. ${String(passCount)}/${String(caseResults.length)} cases passed.`,
  ];

  if (allPassed) {
    notes.push(
      "All evaluation rules, disposition routing, boundary recommendations, and neverUserVisible invariants validated.",
    );
    notes.push(
      "Cases 9–11 validate OcrQualityReport provenance path: attested report, unattested warning note, out-of-range clamping.",
    );
  } else {
    notes.push(
      `${String(failCount)} case(s) failed — review evaluationResult diagnostics for details.`,
    );
  }

  notes.push(
    "Scaffold is metadata-only: no OCR SDK called, no image processed, no LLM called, no Smart Talk production wiring.",
  );

  return {
    scaffoldVersion: OCR_UNCERTAINTY_REGRESSION_VERSION,
    evaluatorVersion: OCR_UNCERTAINTY_EVALUATOR_VERSION,
    allPassed,
    caseResults,
    notes,
  };
}
