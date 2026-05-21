/**
 * Pre-MVP internal governance test harness (Phase 8.2E-5).
 *
 * Pure scaffold aggregation only:
 * - no OCR
 * - no LLM calls
 * - no Smart Talk wiring
 * - no Evidence Gates runtime wiring
 * - no Reality Simulation runtime execution
 * - no generated explanations
 * - no deadline calculation
 * - no legal conclusions
 */

import { CONTROLLED_CORPUS_SCENARIOS } from "./scenarios";
import {
  runControlledCorpusRegressionScaffold,
} from "./corpus-regression-scaffold";
import {
  runScenarioBoundaryRegressionScaffold,
} from "./scenario-boundary-regression-scaffold";
import {
  runScenarioContractRegressionScaffold,
} from "./scenario-contract-regression-scaffold";
import type {
  InternalHarnessExecutionSummary,
  InternalHarnessFailureCategory,
  InternalHarnessScenarioResult,
} from "./internal-test-harness-types";

export const PRE_MVP_INTERNAL_TEST_HARNESS_VERSION =
  "8.2e-5-pre-mvp-internal-test-harness-v1";

function toSet(values: readonly string[]): ReadonlySet<string> {
  return new Set(values);
}

function addCategory(
  categories: Set<InternalHarnessFailureCategory>,
  category: InternalHarnessFailureCategory,
  notes: string[],
  note: string,
): void {
  categories.add(category);
  notes.push(note);
}

/**
 * Runs the controlled-corpus governance scaffolds and aggregates a corpus-wide
 * and per-scenario pass/fail view.
 *
 * This is an internal governance regression harness only. It does not call or
 * compare against runtime simulation output.
 */
export function runPreMvpInternalTestHarness(): InternalHarnessExecutionSummary {
  const corpusScaffold = runControlledCorpusRegressionScaffold();
  const boundaryScaffold = runScenarioBoundaryRegressionScaffold();
  const contractScaffold = runScenarioContractRegressionScaffold();

  const corpusValidation = corpusScaffold.validation;
  const boundaryValidation = boundaryScaffold.validation;
  const contractValidation = contractScaffold.contractValidationResult;

  const emptySyntheticTextIds = toSet(corpusValidation.emptySyntheticTextScenarioIds);
  const sourceModeViolationIds = toSet(corpusValidation.sourceModeViolations);
  const privacyWarningIds = toSet(corpusValidation.possiblePersonalDataScenarioIds);
  const unknownBoundaryIds = toSet(corpusValidation.unknownBoundaryIds.map((e) => e.scenarioId));
  const unknownForbiddenMoveIds = toSet(
    corpusValidation.unknownForbiddenMoves.map((e) => e.scenarioId),
  );
  const unknownRequiredConstraintIds = toSet(
    corpusValidation.unknownRequiredConstraints.map((e) => e.scenarioId),
  );
  const unknownMustNotEmitIds = toSet(
    corpusValidation.unknownMustNotEmitValues.map((e) => e.scenarioId),
  );
  const unknownReviewFlagIds = toSet(corpusValidation.unknownReviewFlags.map((e) => e.scenarioId));

  const boundaryUnknownIds = new Set<string>([
    ...boundaryValidation.scenariosWithUnknownBoundaries,
    ...boundaryValidation.scenariosWithUnknownForbiddenMoves,
    ...boundaryValidation.scenariosWithUnknownRequiredConstraints,
    ...boundaryValidation.scenariosWithUnknownReviewFlags,
    ...boundaryValidation.scenariosWithUnknownMustNotEmit,
  ]);
  const boundaryGapIds = new Set<string>([
    ...boundaryValidation.scenariosMissingBoundaryRequiredForbiddenMoves.map((e) => e.scenarioId),
    ...boundaryValidation.scenariosMissingBoundaryRequiredConstraints.map((e) => e.scenarioId),
  ]);
  const boundaryPolicyWarningIds = toSet(
    boundaryValidation.scenariosWithMustNotEmitPolicyWarnings.map((e) => e.scenarioId),
  );

  const contractGapIds = new Set<string>([
    ...contractValidation.scenariosMissingForbiddenMoveCoverage,
    ...contractValidation.scenariosWithFreePreviewLeakageRisk,
    ...contractValidation.scenariosMissingRequiredConstraintCoverage,
    ...contractValidation.scenariosWithPaidContractOverreachRisk,
    ...contractValidation.scenariosWithFalseReassuranceWarnings,
  ]);
  const monetizationWarningIds = toSet(contractValidation.scenariosWithMonetizationBoundaryWarnings);

  const duplicateIds = toSet(corpusValidation.duplicateScenarioIds);
  const emptyIds = toSet(corpusValidation.emptyScenarioIds);

  const scenarioResults: InternalHarnessScenarioResult[] = CONTROLLED_CORPUS_SCENARIOS.map(
    (scenario) => {
      const warnings = new Set<InternalHarnessFailureCategory>();
      const notes: string[] = [];

      if (duplicateIds.has(scenario.id) || emptyIds.has(scenario.id)) {
        addCategory(
          warnings,
          "inconsistent_expectation",
          notes,
          "Scenario id failed structural corpus validation.",
        );
      }
      if (emptySyntheticTextIds.has(scenario.id) || sourceModeViolationIds.has(scenario.id)) {
        addCategory(
          warnings,
          "inconsistent_expectation",
          notes,
          "Scenario synthetic fixture shape failed corpus validation.",
        );
      }
      if (privacyWarningIds.has(scenario.id)) {
        addCategory(
          warnings,
          "privacy_warning",
          notes,
          "Scenario syntheticText matched a conservative personal-data pattern.",
        );
      }
      if (
        unknownBoundaryIds.has(scenario.id) ||
        unknownForbiddenMoveIds.has(scenario.id) ||
        unknownRequiredConstraintIds.has(scenario.id) ||
        unknownMustNotEmitIds.has(scenario.id) ||
        unknownReviewFlagIds.has(scenario.id) ||
        boundaryUnknownIds.has(scenario.id)
      ) {
        addCategory(
          warnings,
          "unknown_token",
          notes,
          "Scenario references a token outside a known governance registry or corpus taxonomy.",
        );
        addCategory(
          warnings,
          "registry_drift",
          notes,
          "Scenario expectation metadata drifted from canonical registries.",
        );
      }
      if (boundaryGapIds.has(scenario.id)) {
        addCategory(
          warnings,
          "boundary_gap",
          notes,
          "Scenario is missing a boundary-implied forbidden move or required constraint.",
        );
      }
      if (boundaryPolicyWarningIds.has(scenario.id)) {
        addCategory(
          warnings,
          "adversarial_alignment_gap",
          notes,
          "Scenario mustNotEmit expectations are missing implied governance alignment.",
        );
      }
      if (contractGapIds.has(scenario.id)) {
        addCategory(
          warnings,
          "contract_gap",
          notes,
          "Scenario failed or warned under Simulation -> Explanation Contract expectation checks.",
        );
      }
      if (monetizationWarningIds.has(scenario.id)) {
        addCategory(
          warnings,
          "monetization_boundary_warning",
          notes,
          "Scenario is missing monetization defense-in-depth boundary coverage.",
        );
      }

      const structurallyValid =
        !duplicateIds.has(scenario.id) &&
        !emptyIds.has(scenario.id) &&
        !emptySyntheticTextIds.has(scenario.id) &&
        !sourceModeViolationIds.has(scenario.id) &&
        !privacyWarningIds.has(scenario.id) &&
        !unknownBoundaryIds.has(scenario.id) &&
        !unknownForbiddenMoveIds.has(scenario.id) &&
        !unknownRequiredConstraintIds.has(scenario.id) &&
        !unknownMustNotEmitIds.has(scenario.id) &&
        !unknownReviewFlagIds.has(scenario.id);

      const boundaryConsistent =
        !boundaryUnknownIds.has(scenario.id) &&
        !boundaryGapIds.has(scenario.id) &&
        !boundaryPolicyWarningIds.has(scenario.id);

      const contractConsistent =
        !contractGapIds.has(scenario.id) &&
        !monetizationWarningIds.has(scenario.id);

      const passed =
        structurallyValid &&
        boundaryConsistent &&
        contractConsistent &&
        warnings.size === 0;

      if (passed) {
        notes.push("Scenario passed all internal governance scaffold checks.");
      }

      return {
        scenarioId: scenario.id,
        title: scenario.title,
        structurallyValid,
        boundaryConsistent,
        contractConsistent,
        passed,
        warnings: [...warnings],
        notes,
      };
    },
  );

  const passedCount = scenarioResults.filter((r) => r.passed).length;
  const failedCount = scenarioResults.length - passedCount;
  const warningCount = scenarioResults.reduce((count, r) => count + r.warnings.length, 0);
  const fullyConsistent =
    corpusScaffold.fullyConsistent &&
    boundaryScaffold.fullyConsistent &&
    contractScaffold.contractFullyConsistent &&
    failedCount === 0 &&
    warningCount === 0;

  const notes: string[] = [];
  if (fullyConsistent) {
    notes.push(
      `Pre-MVP internal governance harness passed: all ${scenarioResults.length} scenario(s) pass corpus, boundary, and contract scaffold aggregation.`,
    );
  } else {
    notes.push(
      `Pre-MVP internal governance harness found ${failedCount} failed scenario(s) and ${warningCount} warning(s).`,
    );
    notes.push(...corpusScaffold.notes, ...boundaryScaffold.notes, ...contractScaffold.notes);
  }
  notes.push(
    "Harness is scaffold aggregation only: no OCR, no LLM, no Smart Talk, no runtime simulation, no explanation generation, no deadline calculation.",
  );

  return {
    harnessVersion: PRE_MVP_INTERNAL_TEST_HARNESS_VERSION,
    scenarioCount: scenarioResults.length,
    passedCount,
    failedCount,
    warningCount,
    structurallyValid: corpusScaffold.structurallyValid,
    fullyConsistent,
    scenarioResults,
    notes,
    futureSimulationComparisonReady: true,
    futureExplanationComparisonReady: true,
  };
}
