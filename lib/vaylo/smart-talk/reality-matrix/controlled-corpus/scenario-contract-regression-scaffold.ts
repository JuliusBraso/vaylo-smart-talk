/**
 * Scenario → Explanation Contract regression scaffold (Phase 8.2E-3).
 *
 * Runs validateScenarioContractExpectations against the canonical corpus
 * and returns a structured pass/fail summary.
 *
 * Optionally includes a lightweight summary of the prior scaffold results
 * (8.2E-1 and 8.2E-2) so callers can see the full governance picture from
 * a single entry point.
 *
 * Not a test framework dependency. Not wired into runtime.
 * Not connected to Smart Talk, OCR, LLMs, or payment.
 */

import {
  CONTROLLED_CORPUS_SCENARIOS,
  CONTROLLED_CORPUS_VERSION,
} from "./scenarios";
import {
  validateScenarioContractExpectations,
  type ScenarioContractExpectationValidationResult,
} from "./validate-scenario-contract-expectations";
import {
  runControlledCorpusRegressionScaffold,
} from "./corpus-regression-scaffold";
import {
  runScenarioBoundaryRegressionScaffold,
} from "./scenario-boundary-regression-scaffold";

export const SCENARIO_CONTRACT_REGRESSION_VERSION =
  "8.2e-3-scenario-contract-regression-v1";

export interface PreviousValidationSummary {
  readonly corpusValidationPassed: boolean;
  readonly boundaryValidationPassed: boolean;
  readonly corpusScaffoldVersion: string;
  readonly boundaryScaffoldVersion: string;
}

export interface ScenarioContractRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly corpusVersion: string;
  readonly allPassed: boolean;
  readonly scenarioCount: number;
  /**
   * True when no scenario violates hard free-preview restriction rules.
   * See `contractValidationResult.valid`.
   */
  readonly contractValid: boolean;
  /**
   * True when no scenario has any contract-layer warning.
   * See `contractValidationResult.fullyConsistent`.
   */
  readonly contractFullyConsistent: boolean;
  readonly contractValidationResult: ScenarioContractExpectationValidationResult;
  /**
   * Summary of prior 8.2E-1 and 8.2E-2 scaffold results, included for
   * unified governance visibility. These are run fresh each call.
   */
  readonly previousValidationSummary: PreviousValidationSummary;
  readonly notes: readonly string[];
}

/**
 * Runs the Simulation → Explanation Contract regression check against
 * CONTROLLED_CORPUS_SCENARIOS and returns a unified pass/fail summary.
 *
 * Also re-runs the 8.2E-1 corpus validation scaffold and 8.2E-2 boundary
 * expectation scaffold to provide a full governance picture.
 *
 * No Jest/Vitest dependency. No CI wiring. No runtime invocation.
 */
export function runScenarioContractRegressionScaffold(): ScenarioContractRegressionScaffoldResult {
  const contractValidationResult = validateScenarioContractExpectations({
    scenarios: CONTROLLED_CORPUS_SCENARIOS,
  });

  // Re-run prior scaffolds for unified visibility — these are lightweight and
  // purely static; no runtime coupling is introduced.
  const corpusScaffold = runControlledCorpusRegressionScaffold();
  const boundaryScaffold = runScenarioBoundaryRegressionScaffold();

  const previousValidationSummary: PreviousValidationSummary = {
    corpusValidationPassed: corpusScaffold.allPassed,
    boundaryValidationPassed: boundaryScaffold.allPassed,
    corpusScaffoldVersion: corpusScaffold.scaffoldVersion,
    boundaryScaffoldVersion: boundaryScaffold.scaffoldVersion,
  };

  const allPassed =
    contractValidationResult.fullyConsistent &&
    corpusScaffold.allPassed &&
    boundaryScaffold.allPassed;

  const notes: string[] = [];

  if (allPassed) {
    notes.push(
      `Full governance regression passed: all ${contractValidationResult.scenarioCount} scenario(s) pass contract, corpus, and boundary checks.`,
    );
  } else {
    if (!contractValidationResult.valid) {
      notes.push(
        `CONTRACT HARD FAILURE: corpus scenarios have free-preview restriction violations — see contractValidationResult.`,
      );
    } else if (!contractValidationResult.fullyConsistent) {
      notes.push(
        `CONTRACT SOFT WARNINGS: corpus scenarios are contract-valid but have soft warnings — see contractValidationResult.notes.`,
      );
    }
    if (!corpusScaffold.allPassed) {
      notes.push(`CORPUS VALIDATION FAILED: see corpus regression scaffold results.`);
    }
    if (!boundaryScaffold.allPassed) {
      notes.push(`BOUNDARY VALIDATION FAILED: see boundary regression scaffold results.`);
    }
  }

  if (contractValidationResult.forbiddenMoveCoverageDetails.length > 0) {
    notes.push(
      `FORBIDDEN MOVE GAPS: ${contractValidationResult.forbiddenMoveCoverageDetails.length} detail(s) in contractValidationResult.forbiddenMoveCoverageDetails.`,
    );
  }

  if (contractValidationResult.monetizationBoundaryDetails.length > 0) {
    notes.push(
      `MONETIZATION BOUNDARY GAPS: ${contractValidationResult.monetizationBoundaryDetails.length} detail(s) in contractValidationResult.monetizationBoundaryDetails.`,
    );
  }

  notes.push(
    "Scaffold is static corpus governance only: no OCR, no LLM, no Smart Talk, no runtime contract build, no deadline calculation.",
  );

  return {
    scaffoldVersion: SCENARIO_CONTRACT_REGRESSION_VERSION,
    corpusVersion: CONTROLLED_CORPUS_VERSION,
    allPassed,
    scenarioCount: contractValidationResult.scenarioCount,
    contractValid: contractValidationResult.valid,
    contractFullyConsistent: contractValidationResult.fullyConsistent,
    contractValidationResult,
    previousValidationSummary,
    notes,
  };
}
