/**
 * Corpus regression scaffold (Phase 8.2E-1).
 *
 * Runs validateControlledCorpusScenarios against the canonical corpus and
 * returns a structured pass/fail summary.
 *
 * Not a test framework dependency. Not wired into runtime.
 * Not connected to Smart Talk, OCR, LLMs, or payment.
 */

import {
  CONTROLLED_CORPUS_SCENARIOS,
  CONTROLLED_CORPUS_VERSION,
} from "./scenarios";
import {
  validateControlledCorpusScenarios,
  type ControlledCorpusValidationResult,
} from "./validate-corpus-scenarios";

export const CORPUS_REGRESSION_SCAFFOLD_VERSION =
  "8.2e-1-corpus-regression-scaffold-v1";

export interface CorpusRegressionScaffoldResult {
  readonly scaffoldVersion: string;
  readonly corpusVersion: string;
  readonly allPassed: boolean;
  readonly scenarioCount: number;
  /**
   * True when the corpus is structurally valid (unique ids, non-empty required
   * fields, no source-mode violations). Does not require full registry alignment.
   */
  readonly structurallyValid: boolean;
  /**
   * True when the corpus is structurally valid AND all expectation fields align
   * with the canonical governance registries AND no privacy patterns detected.
   */
  readonly fullyConsistent: boolean;
  readonly validation: ControlledCorpusValidationResult;
  readonly notes: readonly string[];
}

/**
 * Runs the canonical corpus validation against CONTROLLED_CORPUS_SCENARIOS.
 *
 * No Jest/Vitest dependency. No CI wiring. No runtime integration.
 */
export function runControlledCorpusRegressionScaffold(): CorpusRegressionScaffoldResult {
  const validation = validateControlledCorpusScenarios({
    scenarios: CONTROLLED_CORPUS_SCENARIOS,
  });

  const notes: string[] = [];

  if (validation.fullyConsistent) {
    notes.push(
      `Corpus regression passed: all ${validation.scenarioCount} scenario(s) are structurally valid and fully consistent with canonical registries.`,
    );
  } else if (validation.valid) {
    notes.push(
      `Corpus is structurally valid (${validation.scenarioCount} scenario(s)) but has registry or hygiene issues — see validation.notes.`,
    );
  } else {
    notes.push(
      `Corpus has structural issues across ${validation.scenarioCount} scenario(s) — see validation.notes.`,
    );
  }

  if (validation.unknownBoundaryIds.length > 0) {
    notes.push(
      `REGISTRY DRIFT: ${validation.unknownBoundaryIds.length} scenario(s) reference boundary id(s) absent from KNOWN_EXPLANATION_BOUNDARIES.`,
    );
  }

  if (validation.unknownForbiddenMoves.length > 0) {
    notes.push(
      `REGISTRY DRIFT: ${validation.unknownForbiddenMoves.length} scenario(s) reference forbidden move(s) absent from KNOWN_FORBIDDEN_EXPLANATION_MOVES.`,
    );
  }

  if (validation.unknownRequiredConstraints.length > 0) {
    notes.push(
      `REGISTRY DRIFT: ${validation.unknownRequiredConstraints.length} scenario(s) reference required constraint(s) absent from KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS.`,
    );
  }

  if (validation.possiblePersonalDataScenarioIds.length > 0) {
    notes.push(
      `PRIVACY HYGIENE: ${validation.possiblePersonalDataScenarioIds.length} scenario(s) matched a conservative personal-data pattern.`,
    );
  }

  notes.push(
    "Scaffold is static corpus hygiene only: no OCR, no LLM, no Smart Talk, no deadline calculation, no explanation generation.",
  );

  return {
    scaffoldVersion: CORPUS_REGRESSION_SCAFFOLD_VERSION,
    corpusVersion: CONTROLLED_CORPUS_VERSION,
    allPassed: validation.fullyConsistent,
    scenarioCount: validation.scenarioCount,
    structurallyValid: validation.valid,
    fullyConsistent: validation.fullyConsistent,
    validation,
    notes,
  };
}
