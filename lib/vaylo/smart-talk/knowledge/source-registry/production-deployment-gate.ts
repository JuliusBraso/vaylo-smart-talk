import "server-only";

import type {
  ProductionDatabaseReadinessAssessment,
  ProductionTargetClassification,
} from "./deployment-readiness";
import {
  PRODUCTION_DEPLOYMENT_ORDER,
  validateProductionDatabaseReadinessAssessment,
} from "./deployment-readiness";

export type ProductionDeploymentGateDecision =
  | "DENY"
  | "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW";

export type ProductionDeploymentOperatorEvidence = Readonly<{
  targetClassification: ProductionTargetClassification;
  targetProjectIdentityVerified: boolean;
  backupOrRecoveryPointVerified: boolean;
  targetMigrationLedgerVerified: boolean;
  targetSchemaFingerprintVerified: boolean;
  targetRlsAndGrantPreflightVerified: boolean;
  deploymentActorAuthorized: boolean;
  observabilityAvailable: boolean;
  rollbackOwnerAssigned: boolean;
  postDeploymentVerificationCompleted: boolean;
}>;

export type ProductionDeploymentGateInput = Readonly<{
  assessment: ProductionDatabaseReadinessAssessment;
  operatorEvidence: ProductionDeploymentOperatorEvidence;
  deploymentOrder: readonly string[];
  validationFixtureInProductionOrder: boolean;
  baselineAutomaticallyAppliedToExistingProduction: boolean;
}>;

export type ProductionDeploymentGateResult = Readonly<{
  decision: ProductionDeploymentGateDecision;
  reasons: readonly string[];
}>;

export function evaluateProductionDeploymentGate(
  input: ProductionDeploymentGateInput,
): ProductionDeploymentGateResult {
  const reasons: string[] = [];
  if (!validateProductionDatabaseReadinessAssessment(input.assessment)) {
    reasons.push("Repository readiness evidence is incomplete or contradictory.");
  }
  if (
    JSON.stringify(input.deploymentOrder) !==
    JSON.stringify(PRODUCTION_DEPLOYMENT_ORDER)
  ) {
    reasons.push("The controlled deployment order is not exact.");
  }
  if (input.validationFixtureInProductionOrder) {
    reasons.push("The local validation fixture is forbidden in production order.");
  }
  if (input.baselineAutomaticallyAppliedToExistingProduction) {
    reasons.push("Baseline replay into an existing production target is forbidden.");
  }
  if (
    input.operatorEvidence.targetClassification ===
      "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA" ||
    input.operatorEvidence.targetClassification === "DRIFTED_OR_UNSAFE_PROJECT"
  ) {
    reasons.push("The target classification is not deployment eligible.");
  }
  const pendingOperatorEvidence = Object.entries(input.operatorEvidence)
    .filter(([key, value]) => key !== "targetClassification" && value !== false)
    .map(([key]) => key);
  if (pendingOperatorEvidence.length > 0) {
    reasons.push("Future operator evidence cannot be locally verified.");
  }
  return Object.freeze({
    decision:
      reasons.length === 0
        ? "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW"
        : "DENY",
    reasons: Object.freeze(reasons),
  });
}
