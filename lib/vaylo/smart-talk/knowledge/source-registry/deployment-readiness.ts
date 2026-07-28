export const PRODUCTION_DATABASE_READINESS_STATES = [
  "NOT_ASSESSED",
  "BLOCKED",
  "LOCALLY_VALIDATED",
  "READY_FOR_CONTROLLED_DEPLOYMENT",
  "CONTROLLED_DEPLOYMENT_VERIFIED",
] as const;

export type ProductionDatabaseReadinessState =
  (typeof PRODUCTION_DATABASE_READINESS_STATES)[number];

export const DEPLOYMENT_EVIDENCE_SOURCES = [
  "REPOSITORY_HASH",
  "LOCAL_RUNTIME_AUDIT",
  "LOCAL_STATIC_AUDIT",
  "OPERATOR_ATTESTATION_REQUIRED",
  "REMOTE_PREFLIGHT_REQUIRED",
  "DEPLOYMENT_EXECUTION_REQUIRED",
  "POST_DEPLOYMENT_VERIFICATION_REQUIRED",
] as const;

export type DeploymentEvidenceSource =
  (typeof DEPLOYMENT_EVIDENCE_SOURCES)[number];

export type DeploymentCriterionStatus =
  | "VERIFIED"
  | "NOT_VERIFIED"
  | "NOT_APPLICABLE"
  | "BLOCKED"
  | "REQUIRES_FUTURE_ACTION";

export type DeploymentFailureSeverity = "BLOCKING" | "REVIEW_REQUIRED";

export type DeploymentReadinessCriterion = Readonly<{
  criterionId: string;
  description: string;
  evidenceSource: DeploymentEvidenceSource;
  requiredForReadiness: boolean;
  requiredForDeployment: boolean;
  requiredForRuntimeEnablement: boolean;
  locallyVerifiable: boolean;
  currentStatus: DeploymentCriterionStatus;
  failureSeverity: DeploymentFailureSeverity;
}>;

export const PRODUCTION_DEPLOYMENT_ORDER = [
  "VERIFY_TARGET_PROJECT_IDENTITY",
  "VERIFY_BACKUP_OR_RECOVERY_POINT",
  "INSPECT_MIGRATION_LEDGER_AND_SCHEMA_DRIFT",
  "VERIFY_SUPABASE_MANAGED_PLATFORM_DEPENDENCIES",
  "APPLY_MIGRATION_032",
  "APPLY_MIGRATION_033",
  "APPLY_MIGRATION_034",
  "APPLY_MIGRATION_035",
  "VERIFY_FUNCTION_DEFINITIONS_AND_SQLSTATE_42702_CLOSURE",
  "VERIFY_RLS_GRANTS_AND_INTERNAL_ENGINE_ISOLATION",
  "REGENERATE_OR_COMPARE_DATABASE_TYPES",
  "RUN_BOUNDED_POST_DEPLOYMENT_SMOKE_VALIDATION",
  "KEEP_APPLICATION_RUNTIME_DISABLED",
  "REQUIRE_SEPARATE_RUNTIME_ENABLEMENT_DECISION",
] as const;

export type ProductionDeploymentStep =
  (typeof PRODUCTION_DEPLOYMENT_ORDER)[number];

export const PRODUCTION_TARGET_CLASSIFICATIONS = [
  "EMPTY_CONTROLLED_PROJECT",
  "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA",
  "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA",
  "DRIFTED_OR_UNSAFE_PROJECT",
] as const;

export type ProductionTargetClassification =
  (typeof PRODUCTION_TARGET_CLASSIFICATIONS)[number];

export type ProductionTargetDeploymentEligibility = Readonly<{
  target: ProductionTargetClassification;
  deploymentEligible: boolean;
  requiredEvidence: readonly string[];
}>;

export const PRODUCTION_TARGET_DEPLOYMENT_ELIGIBILITY: readonly ProductionTargetDeploymentEligibility[] =
  Object.freeze([
    {
      target: "EMPTY_CONTROLLED_PROJECT",
      deploymentEligible: true,
      requiredEvidence: Object.freeze([
        "EXPLICITLY_REVIEWED_BOOTSTRAP_PATH",
        "TARGET_IDENTITY",
        "BACKUP_OR_RECOVERY_POINT",
      ]),
    },
    {
      target: "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA",
      deploymentEligible: true,
      requiredEvidence: Object.freeze([
        "TARGET_IDENTITY",
        "MIGRATION_LEDGER",
        "CATALOG_FINGERPRINT",
        "RLS_AND_GRANT_INSPECTION",
        "BACKUP_OR_RECOVERY_POINT",
      ]),
    },
    {
      target: "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA",
      deploymentEligible: false,
      requiredEvidence: Object.freeze(["TARGET_STATE_RECONCILIATION"]),
    },
    {
      target: "DRIFTED_OR_UNSAFE_PROJECT",
      deploymentEligible: false,
      requiredEvidence: Object.freeze(["MANUAL_RECONCILIATION"]),
    },
  ]);

export type RollbackRecoveryStrategy =
  | "FORWARD_FIX"
  | "RESTORE_FROM_VERIFIED_RECOVERY_POINT"
  | "MANUAL_RECONCILIATION_REQUIRED";

export type MigrationRollbackClassification = Readonly<{
  migration: "032" | "033" | "034" | "035";
  containsCreateOnlyOperations: boolean;
  containsAlterOperations: boolean;
  containsDataMutation: boolean;
  containsFunctionReplacement: boolean;
  containsIrreversibleEffects: boolean;
  safeTransactionalRollbackBeforeCommit: true;
  postCommitRollbackStrategy: RollbackRecoveryStrategy;
  recommendedRecoveryAction: string;
}>;

export const MIGRATION_ROLLBACK_CLASSIFICATIONS: readonly MigrationRollbackClassification[] =
  Object.freeze([
    { migration: "032", containsCreateOnlyOperations: true, containsAlterOperations: false, containsDataMutation: false, containsFunctionReplacement: false, containsIrreversibleEffects: false, safeTransactionalRollbackBeforeCommit: true, postCommitRollbackStrategy: "FORWARD_FIX", recommendedRecoveryAction: "Forward-fix reviewed schema defects after commit." },
    { migration: "033", containsCreateOnlyOperations: false, containsAlterOperations: true, containsDataMutation: false, containsFunctionReplacement: true, containsIrreversibleEffects: false, safeTransactionalRollbackBeforeCommit: true, postCommitRollbackStrategy: "FORWARD_FIX", recommendedRecoveryAction: "Forward-fix reviewed publication and translation contract defects." },
    { migration: "034", containsCreateOnlyOperations: false, containsAlterOperations: false, containsDataMutation: false, containsFunctionReplacement: true, containsIrreversibleEffects: false, safeTransactionalRollbackBeforeCommit: true, postCommitRollbackStrategy: "FORWARD_FIX", recommendedRecoveryAction: "Forward-fix identifier ambiguity closure defects." },
    { migration: "035", containsCreateOnlyOperations: false, containsAlterOperations: true, containsDataMutation: true, containsFunctionReplacement: true, containsIrreversibleEffects: true, safeTransactionalRollbackBeforeCommit: true, postCommitRollbackStrategy: "RESTORE_FROM_VERIFIED_RECOVERY_POINT", recommendedRecoveryAction: "Restore the verified recovery point or manually reconcile an approved forward fix." },
  ]);

export const OBSERVABILITY_SIGNAL_NAMES = [
  "DEPLOYMENT_STARTED",
  "MIGRATION_APPLIED",
  "MIGRATION_FAILED",
  "POST_DEPLOYMENT_CHECK_PASSED",
  "POST_DEPLOYMENT_CHECK_FAILED",
  "UNAUTHORIZED_RPC_ATTEMPT",
  "INTERNAL_ENGINE_ACCESS_ATTEMPT",
  "CONCURRENCY_CONFLICT",
  "ROLLBACK_OR_RECOVERY_INITIATED",
  "RUNTIME_ENABLEMENT_REVIEWED",
] as const;

export type ObservabilitySignal = Readonly<{
  name: (typeof OBSERVABILITY_SIGNAL_NAMES)[number];
  severity: "INFO" | "WARNING" | "ERROR";
  requiredFields: readonly ("eventId" | "occurredAt" | "deploymentStage")[];
  forbiddenFields: readonly string[];
  retentionClassification: "OPERATIONAL_AUDIT";
  blocksDeploymentClosure: boolean;
}>;

const FORBIDDEN_OBSERVABILITY_FIELDS = Object.freeze([
  "credentials",
  "databaseUrl",
  "tokens",
  "rawSqlArguments",
  "stackTrace",
  "clientDocuments",
  "realAuthorityContent",
]);

export const OBSERVABILITY_SIGNALS: readonly ObservabilitySignal[] = Object.freeze(
  OBSERVABILITY_SIGNAL_NAMES.map((name) =>
    Object.freeze({
      name,
      severity:
        name.endsWith("FAILED") || name === "INTERNAL_ENGINE_ACCESS_ATTEMPT"
          ? "ERROR"
          : name === "UNAUTHORIZED_RPC_ATTEMPT" || name === "CONCURRENCY_CONFLICT"
            ? "WARNING"
            : "INFO",
      requiredFields: Object.freeze([
        "eventId",
        "occurredAt",
        "deploymentStage",
      ] as const),
      forbiddenFields: FORBIDDEN_OBSERVABILITY_FIELDS,
      retentionClassification: "OPERATIONAL_AUDIT",
      blocksDeploymentClosure:
        name === "MIGRATION_FAILED" ||
        name === "POST_DEPLOYMENT_CHECK_FAILED" ||
        name === "INTERNAL_ENGINE_ACCESS_ATTEMPT",
    }),
  ),
);

export type SecretSemanticRole =
  | "DATABASE_DEPLOYMENT_CREDENTIAL"
  | "SERVER_RUNTIME_CREDENTIAL"
  | "READ_ONLY_OBSERVABILITY_CREDENTIAL";

export type ProductionDatabaseReadinessAssessment = Readonly<{
  state: ProductionDatabaseReadinessState;
  sourceCommit: string;
  criteria: readonly DeploymentReadinessCriterion[];
  migrationOrderVerified: boolean;
  migrationHashesVerified: boolean;
  generatedTypesVerified: boolean;
  rpcAllowlistVerified: boolean;
  adapterRuntimeVerifiedLocally: boolean;
  rollbackPlanVerified: boolean;
  backupPreconditionVerified: boolean;
  observabilityPlanVerified: boolean;
  secretBoundaryVerified: boolean;
  targetProjectIdentityVerified: boolean;
  targetSchemaDriftChecked: boolean;
  deploymentActorAuthorized: boolean;
  productionCredentialsPresent: boolean;
  remoteConnectionPerformed: boolean;
  schemaDeployed: boolean;
  runtimeEnabled: boolean;
  publicRuntimeAuthorized: boolean;
}>;

export function validateProductionDatabaseReadinessAssessment(
  assessment: ProductionDatabaseReadinessAssessment,
): boolean {
  const criterionIds = new Set(assessment.criteria.map((criterion) => criterion.criterionId));
  const localCriterionValid = assessment.criteria
    .filter((criterion) => criterion.locallyVerifiable)
    .every((criterion) => criterion.evidenceSource !== "REMOTE_PREFLIGHT_REQUIRED" && criterion.evidenceSource !== "OPERATOR_ATTESTATION_REQUIRED");
  const remoteCriterionValid = assessment.criteria
    .filter((criterion) => !criterion.locallyVerifiable)
    .every((criterion) => criterion.currentStatus !== "VERIFIED");
  return (
    assessment.state === "READY_FOR_CONTROLLED_DEPLOYMENT" &&
    assessment.sourceCommit.length > 0 &&
    criterionIds.size === assessment.criteria.length &&
    localCriterionValid &&
    remoteCriterionValid &&
    assessment.migrationOrderVerified &&
    assessment.migrationHashesVerified &&
    assessment.generatedTypesVerified &&
    assessment.rpcAllowlistVerified &&
    assessment.adapterRuntimeVerifiedLocally &&
    assessment.rollbackPlanVerified &&
    assessment.observabilityPlanVerified &&
    assessment.secretBoundaryVerified &&
    assessment.backupPreconditionVerified === false &&
    assessment.targetProjectIdentityVerified === false &&
    assessment.targetSchemaDriftChecked === false &&
    assessment.deploymentActorAuthorized === false &&
    assessment.productionCredentialsPresent === false &&
    assessment.remoteConnectionPerformed === false &&
    assessment.schemaDeployed === false &&
    assessment.runtimeEnabled === false &&
    assessment.publicRuntimeAuthorized === false
  );
}
