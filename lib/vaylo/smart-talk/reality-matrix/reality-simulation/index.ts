/**
 * Reality Simulation (8.2D-1+ / extended through 8.2F-2) — pre-explanation governance skeleton.
 * Not Smart Talk, not UI, not user-visible prose.
 */

export { REALITY_SIMULATION_SKELETON_VERSION, runRealitySimulation } from "./run-reality-simulation";
export { BOUNDARY_POLICY_TABLE_V1, BOUNDARY_POLICY_TABLE_VERSION } from "./boundary-policy-table";
export type {
  BoundaryCategory,
  BoundaryConsumerConstraint,
  BoundaryConsumerLayer,
  BoundaryPolicyDefinition,
  BoundaryPolicyId,
  BoundaryProductionReadiness,
  DeprecatedBoundaryId,
} from "./boundary-policy-types";
export {
  validateBoundaryEmissions,
  type BoundaryEmissionValidationResult,
  type ValidateBoundaryEmissionsParams,
} from "./validate-boundary-emissions";
export {
  runBoundaryEmissionRegressionScaffold,
  BOUNDARY_REGRESSION_CASES,
  type BoundaryRegressionCase,
  type BoundaryRegressionCaseResult,
  type BoundaryRegressionScaffoldResult,
} from "./boundary-emission-regression";
export type { RunRealitySimulationParams } from "../reality-simulation-types";
export { KNOWN_EXPLANATION_BOUNDARIES } from "../reality-simulation-types";
export { TRAP_METADATA_REGISTRY_V1, TRAP_METADATA_REGISTRY_VERSION } from "./trap-metadata-registry";
export type {
  TrapGovernanceDomain,
  TrapRiskClass,
  TrapProductionReadiness,
  TrapConsumerConstraint,
  TrapMetadataDefinition,
} from "./trap-metadata-types";
export {
  KNOWN_FORBIDDEN_EXPLANATION_MOVES,
  KNOWN_REQUIRED_EXPLANATION_CONSTRAINTS,
} from "./explanation-contract-types";
export type {
  AttentionLevelPreview,
  ConfidencePosture,
  ExplanationAccessTier,
  ExplicitDeadlineSignal,
  ExplicitDeadlineSignalKind,
  ExplicitFinancialSignal,
  ExplicitFinancialSignalKind,
  ForbiddenExplanationMove,
  FreePreviewFields,
  FreePreviewSimulationExplanationContract,
  InstitutionSignal,
  PaidExplanationFields,
  PaidSimulationExplanationContract,
  RequiredExplanationConstraint,
  SimulationExplanationContract,
  SimulationExplanationContractVersion,
  UncertaintyRequirement,
} from "./explanation-contract-types";
export {
  CONTRACT_RELEVANT_EXPLANATION_BOUNDARIES,
  validateContractBoundaryMapping,
  type ContractBoundaryMappingValidationResult,
  type ValidateContractBoundaryMappingParams,
} from "./validate-contract-boundary-mapping";
export {
  runContractBoundaryRegressionScaffold,
  CONTRACT_BOUNDARY_REGRESSION_CASES,
  type ContractBoundaryRegressionCase,
  type ContractBoundaryRegressionCaseResult,
  type ContractBoundaryRegressionScaffoldResult,
} from "./contract-boundary-regression";
export type {
  AppliedGovernanceConstraint,
  ExplanationMapperDiagnostic,
  ExplanationReviewPosture,
  ExplanationUncertaintyPosture,
  RuntimeExplanationDraft,
  RuntimeExplanationMapperInput,
  RuntimeExplanationSectionDraft,
  RuntimeExplanationSectionType,
} from "./explanation-mapper-types";
export {
  EXPLANATION_MAPPER_VERSION,
  runExplanationMapper,
} from "./run-explanation-mapper";
export {
  EXPLANATION_MAPPER_REGRESSION_VERSION,
  runExplanationMapperRegressionScaffold,
  type ExplanationMapperRegressionCaseResult,
  type ExplanationMapperRegressionScaffoldResult,
} from "./explanation-mapper-regression-scaffold";
export type {
  FreePreviewMapperDiagnosticCode,
  PaidExplanationMapperDiagnosticCode,
} from "./explanation-mapper-types";
export {
  FREE_PREVIEW_MAPPER_VERSION,
  runFreePreviewMapper,
} from "./run-free-preview-mapper";
export {
  FREE_PREVIEW_MAPPER_REGRESSION_VERSION,
  runFreePreviewMapperRegressionScaffold,
  type FreePreviewMapperRegressionCaseResult,
  type FreePreviewMapperRegressionScaffoldResult,
} from "./free-preview-mapper-regression-scaffold";
export {
  PAID_EXPLANATION_MAPPER_VERSION,
  runPaidExplanationMapper,
} from "./run-paid-explanation-mapper";
export {
  PAID_EXPLANATION_MAPPER_REGRESSION_VERSION,
  runPaidExplanationMapperRegressionScaffold,
  type PaidExplanationMapperRegressionCaseResult,
  type PaidExplanationMapperRegressionScaffoldResult,
} from "./paid-explanation-mapper-regression-scaffold";
export {
  EXPLANATION_OUTPUT_REGRESSION_CORPUS_VERSION,
  type BlockedReasonExpectation,
  type ExplanationOutputRegressionCase,
  type ExplanationOutputRegressionFailureCategory,
  EXPLANATION_OUTPUT_REGRESSION_CORPUS,
} from "./explanation-output-regression-corpus";
export {
  validateExplanationOutputRegression,
  type ExplanationOutputRegressionFailure,
  type ExplanationOutputRegressionValidationResult,
} from "./validate-explanation-output-regressions";
export {
  EXPLANATION_OUTPUT_REGRESSION_SCAFFOLD_VERSION,
  runExplanationOutputRegressionScaffold,
  type ExplanationOutputRegressionCaseResult,
  type ExplanationOutputRegressionScaffoldResult,
} from "./explanation-output-regression-scaffold";
