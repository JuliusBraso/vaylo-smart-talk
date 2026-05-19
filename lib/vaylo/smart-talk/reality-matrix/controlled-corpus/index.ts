/**
 * Controlled Corpus exports (Phase 8.2E-0 / extended 8.2E-1).
 *
 * Test/spec foundation only. Not wired into runtime.
 */

export {
  CONTROLLED_CORPUS_SCENARIOS,
  CONTROLLED_CORPUS_VERSION,
} from "./scenarios";
export type {
  ControlledCorpusDocumentFamily,
  ControlledCorpusExpectedBoundaryId,
  ControlledCorpusExpectedDocumentType,
  ControlledCorpusExpectedForbiddenMove,
  ControlledCorpusExpectedOutcomes,
  ControlledCorpusExpectedRequiredConstraint,
  ControlledCorpusExpectedReviewFlag,
  ControlledCorpusExpectedSeverityPosture,
  ControlledCorpusFailureMode,
  ControlledCorpusLanguage,
  ControlledCorpusMustNotEmit,
  ControlledCorpusRiskDomain,
  ControlledCorpusScenario,
  ControlledCorpusScenarioKind,
  ControlledCorpusSourceMode,
} from "./corpus-types";
export {
  validateControlledCorpusScenarios,
  type ControlledCorpusValidationResult,
  type CorpusScenarioDriftEntry,
} from "./validate-corpus-scenarios";
export {
  CORPUS_REGRESSION_SCAFFOLD_VERSION,
  runControlledCorpusRegressionScaffold,
  type CorpusRegressionScaffoldResult,
} from "./corpus-regression-scaffold";
