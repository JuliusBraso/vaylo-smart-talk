/**
 * Explanation Output Regression Scaffold (Phase 8.2F-5).
 *
 * Executes all corpus cases through the appropriate mapper, validates each
 * output against its governance expectations, and aggregates a pass/fail summary.
 *
 * No Jest/Vitest. No CI hook. No runtime integration.
 * No prose generation. No LLM. No OCR. No Smart Talk wiring.
 */

import type { RuntimeExplanationDraft, RuntimeExplanationMapperInput } from "./explanation-mapper-types";
import {
  EXPLANATION_OUTPUT_REGRESSION_CORPUS,
  EXPLANATION_OUTPUT_REGRESSION_CORPUS_VERSION,
  type ExplanationOutputRegressionCase,
} from "./explanation-output-regression-corpus";
import {
  validateExplanationOutputRegression,
  type ExplanationOutputRegressionValidationResult,
} from "./validate-explanation-output-regressions";
import { runFreePreviewMapper } from "./run-free-preview-mapper";
import { runPaidExplanationMapper } from "./run-paid-explanation-mapper";

export const EXPLANATION_OUTPUT_REGRESSION_SCAFFOLD_VERSION =
  "8.2f-5-explanation-output-regression-scaffold-v1";

// ── Result types ──────────────────────────────────────────────────────────────

export interface ExplanationOutputRegressionCaseResult {
  readonly caseId: string;
  readonly caseTitle: string;
  readonly mapperKind: "free_preview" | "paid_explanation";
  readonly passed: boolean;
  readonly draft: RuntimeExplanationDraft;
  readonly validationResult: ExplanationOutputRegressionValidationResult;
}

export interface ExplanationOutputRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly corpusVersion: string;
  readonly allPassed: boolean;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly caseResults: readonly ExplanationOutputRegressionCaseResult[];
  readonly notes: readonly string[];
}

// ── Case execution ────────────────────────────────────────────────────────────

function runCorpusCase(
  corpusCase: ExplanationOutputRegressionCase,
): ExplanationOutputRegressionCaseResult {
  // Build mapper input from corpus case fixtures.
  // accessTierOverride takes precedence over the contract's accessTier for invalid-tier cases.
  const input: RuntimeExplanationMapperInput = {
    simulationResult: corpusCase.simulationResultFixture,
    explanationContract: corpusCase.contractFixture,
    accessTier: corpusCase.accessTierOverride ?? corpusCase.contractFixture.accessTier,
    auditTraceRef: `corpus-regression:${corpusCase.id}`,
  };

  // Route to the correct mapper based on mapperKind (not input.accessTier).
  // This allows invalid-tier cases to test each mapper's error path independently.
  const draft: RuntimeExplanationDraft =
    corpusCase.mapperKind === "free_preview"
      ? runFreePreviewMapper(input)
      : runPaidExplanationMapper(input);

  const validationResult = validateExplanationOutputRegression(draft, corpusCase);

  return {
    caseId: corpusCase.id,
    caseTitle: corpusCase.title,
    mapperKind: corpusCase.mapperKind,
    passed: validationResult.passed,
    draft,
    validationResult,
  };
}

// ── Scaffold entry ────────────────────────────────────────────────────────────

/**
 * Runs all 15 explanation output regression corpus cases through the appropriate
 * free-preview or paid-explanation mapper, validates each output, and returns a
 * corpus-wide pass/fail summary.
 *
 * No Jest/Vitest. No CI wiring. No runtime integration.
 */
export function runExplanationOutputRegressionScaffold(): ExplanationOutputRegressionScaffoldResult {
  const caseResults = EXPLANATION_OUTPUT_REGRESSION_CORPUS.map(runCorpusCase);

  const allPassed = caseResults.every((r) => r.passed);
  const passedCount = caseResults.filter((r) => r.passed).length;
  const failedCount = caseResults.filter((r) => !r.passed).length;

  const notes: string[] = [];

  if (allPassed) {
    notes.push(
      `Explanation output regression scaffold passed: all ${caseResults.length} corpus case(s) produce governance-consistent structural drafts.`,
    );
  } else {
    notes.push(
      `Explanation output regression scaffold: ${passedCount}/${caseResults.length} passed, ${failedCount} failed.`,
    );
    for (const r of caseResults) {
      if (!r.passed) {
        notes.push(`  [${r.caseId}] ${r.validationResult.failures.length} failure(s):`);
        for (const f of r.validationResult.failures) {
          notes.push(`    [${f.category}] ${f.detail}`);
        }
      }
    }
  }

  // Failure taxonomy summary.
  const failuresByCategory = new Map<string, number>();
  for (const r of caseResults) {
    for (const f of r.validationResult.failures) {
      failuresByCategory.set(f.category, (failuresByCategory.get(f.category) ?? 0) + 1);
    }
  }
  if (failuresByCategory.size > 0) {
    notes.push("Failure breakdown by category:");
    for (const [category, count] of failuresByCategory.entries()) {
      notes.push(`  ${category}: ${count}`);
    }
  }

  notes.push(
    "Scaffold validates structural governance only: no OCR, no LLM, no Smart Talk, no user-visible prose, no deadline calculation, no legal inference.",
  );

  return {
    scaffoldVersion: EXPLANATION_OUTPUT_REGRESSION_SCAFFOLD_VERSION,
    corpusVersion: EXPLANATION_OUTPUT_REGRESSION_CORPUS_VERSION,
    allPassed,
    passedCount,
    failedCount,
    caseResults,
    notes,
  };
}
