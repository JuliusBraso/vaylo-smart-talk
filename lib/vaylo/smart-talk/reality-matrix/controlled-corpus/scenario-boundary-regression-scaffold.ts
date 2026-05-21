/**
 * Scenario expected-boundary regression scaffold (Phase 8.2E-2).
 *
 * Runs validateScenarioBoundaryExpectations against the canonical corpus
 * and returns a structured pass/fail summary.
 *
 * Not a test framework dependency. Not wired into runtime.
 * Not connected to Smart Talk, OCR, LLMs, or payment.
 */

import {
  CONTROLLED_CORPUS_SCENARIOS,
  CONTROLLED_CORPUS_VERSION,
} from "./scenarios";
import {
  validateScenarioBoundaryExpectations,
  type ScenarioBoundaryExpectationValidationResult,
} from "./validate-scenario-boundary-expectations";

export const SCENARIO_BOUNDARY_REGRESSION_VERSION =
  "8.2e-2-scenario-boundary-regression-v1";

export interface ScenarioBoundaryRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly corpusVersion: string;
  readonly allPassed: boolean;
  readonly scenarioCount: number;
  /**
   * True when no scenario contains unknown ids in any expectation field.
   * Corresponds to `valid` in the validation result.
   */
  readonly structurallyValid: boolean;
  /**
   * True when structurally valid AND all boundary implications are satisfied
   * AND all mustNotEmit policy alignments are present.
   * Corresponds to `fullyConsistent` in the validation result.
   */
  readonly fullyConsistent: boolean;
  /** Number of scenarios that have implication gaps (missing implied forbidden/constraints). */
  readonly implicationGapCount: number;
  /** Number of mustNotEmit policy warnings across all scenarios. */
  readonly mustNotEmitWarningCount: number;
  readonly validation: ScenarioBoundaryExpectationValidationResult;
  readonly notes: readonly string[];
}

/**
 * Runs the expected-boundary consistency check against CONTROLLED_CORPUS_SCENARIOS.
 *
 * No Jest/Vitest dependency. No CI wiring. No runtime invocation.
 */
export function runScenarioBoundaryRegressionScaffold(): ScenarioBoundaryRegressionScaffoldResult {
  const validation = validateScenarioBoundaryExpectations({
    scenarios: CONTROLLED_CORPUS_SCENARIOS,
  });

  const implicationGapCount =
    validation.scenariosMissingBoundaryRequiredForbiddenMoves.length +
    validation.scenariosMissingBoundaryRequiredConstraints.length;

  const mustNotEmitWarningCount = validation.scenariosWithMustNotEmitPolicyWarnings.length;

  const notes: string[] = [];

  if (validation.fullyConsistent) {
    notes.push(
      `All ${validation.scenarioCount} corpus scenario(s) pass expected-boundary consistency checks.`,
    );
  } else if (validation.valid) {
    notes.push(
      `${validation.scenarioCount} corpus scenario(s) are structurally valid (no unknown ids) but have ${implicationGapCount} implication gap(s) and ${mustNotEmitWarningCount} mustNotEmit policy warning(s).`,
    );
    notes.push(
      "To reach fullyConsistent: add expectedRequiredConstraints where require_uncertainty_wording is expected, and add missing implied forbidden moves / boundaries for mustNotEmit values.",
    );
  } else {
    notes.push(
      `${validation.scenarioCount} corpus scenario(s): structural validity FAILED — unknown ids present. See validation.notes.`,
    );
  }

  if (implicationGapCount > 0) {
    notes.push(
      `BOUNDARY IMPLICATION GAPS: ${implicationGapCount} scenario/boundary pair(s) missing implied forbidden moves or required constraints. These represent corpus incompleteness, not runtime safety failures.`,
    );
  }

  if (mustNotEmitWarningCount > 0) {
    notes.push(
      `MUST-NOT-EMIT POLICY WARNINGS: ${mustNotEmitWarningCount} mustNotEmit value(s) have missing governance implications across corpus scenarios.`,
    );
  }

  notes.push(
    "Scaffold is expected-outcome consistency only: no OCR, no LLM, no Smart Talk, no runtime simulation comparison, no deadline calculation.",
  );

  return {
    scaffoldVersion: SCENARIO_BOUNDARY_REGRESSION_VERSION,
    corpusVersion: CONTROLLED_CORPUS_VERSION,
    allPassed: validation.fullyConsistent,
    scenarioCount: validation.scenarioCount,
    structurallyValid: validation.valid,
    fullyConsistent: validation.fullyConsistent,
    implicationGapCount,
    mustNotEmitWarningCount,
    validation,
    notes,
  };
}
