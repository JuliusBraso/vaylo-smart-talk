/**
 * Reality Simulation (8.2D-1+) — pre-explanation governance skeleton.
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
