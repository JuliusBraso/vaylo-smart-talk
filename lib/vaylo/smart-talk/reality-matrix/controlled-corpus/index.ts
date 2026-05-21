/**
 * Controlled Corpus exports (Phase 8.2E-0 / extended through 8.2E-5).
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
export {
  validateScenarioBoundaryExpectations,
  type ScenarioBoundaryExpectationValidationResult,
  type ScenarioMissingForbiddenMoveImplication,
  type ScenarioMissingConstraintImplication,
  type ScenarioMustNotEmitPolicyWarning,
} from "./validate-scenario-boundary-expectations";
export {
  SCENARIO_BOUNDARY_REGRESSION_VERSION,
  runScenarioBoundaryRegressionScaffold,
  type ScenarioBoundaryRegressionScaffoldResult,
} from "./scenario-boundary-regression-scaffold";
export {
  validateScenarioContractExpectations,
  type ScenarioContractExpectationValidationResult,
  type ScenarioContractForbiddenMoveMissing,
  type ScenarioContractMonetizationGap,
} from "./validate-scenario-contract-expectations";
export {
  SCENARIO_CONTRACT_REGRESSION_VERSION,
  runScenarioContractRegressionScaffold,
  type ScenarioContractRegressionScaffoldResult,
  type PreviousValidationSummary,
} from "./scenario-contract-regression-scaffold";
export {
  PRE_MVP_INTERNAL_TEST_HARNESS_VERSION,
  runPreMvpInternalTestHarness,
} from "./internal-test-harness";
export type {
  InternalHarnessExecutionSummary,
  InternalHarnessFailureCategory,
  InternalHarnessScenarioResult,
} from "./internal-test-harness-types";
