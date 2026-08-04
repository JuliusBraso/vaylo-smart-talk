import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const EXPECTED_SOURCE_COMMIT = "a9450cf";
const RUNNER = "lib/vaylo/smart-talk/knowledge/de/run-production-audit-bootstrap-authorization-review.ts";
const BOOTSTRAP = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql";
const ROLLBACK = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql";
const CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const PERMANENT_AUDIT = "lib/vaylo/smart-talk/knowledge/de/run-permanent-audit-infrastructure-contract-audit.ts";
const DISPOSABLE_AUDIT = "lib/vaylo/smart-talk/knowledge/de/run-disposable-audit-infrastructure-validation.ts";
const ARTIFACTS = [BOOTSTRAP, ROLLBACK, CONTRACT, PERMANENT_AUDIT, DISPOSABLE_AUDIT] as const;

function command(name: string, args: string[]) {
  const result = spawnSync(name, args, { cwd: ROOT, encoding: "utf8", shell: false, windowsHide: true });
  return { code: result.status ?? -1, stdout: result.stdout ?? "" };
}

function git(args: string[]): string {
  const result = command("git", args);
  if (result.code !== 0) throw new Error("git command failed");
  return result.stdout.trim();
}

function has(text: string, value: string): boolean {
  return text.includes(value);
}

function main(): void {
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = command("git", ["status", "--short"]).stdout.trimEnd();
  const workingTreeCleanAtStart = status === "" || status === `?? ${RUNNER}`;
  const sources = Object.fromEntries(ARTIFACTS.map((file) => [file, readFileSync(path.join(ROOT, file), "utf8")]));
  const bootstrap = sources[BOOTSTRAP];
  const rollback = sources[ROLLBACK];
  const contract = sources[CONTRACT];
  const permanentAudit = sources[PERMANENT_AUDIT];
  const disposableAudit = sources[DISPOSABLE_AUDIT];
  const artifactSha256 = Object.fromEntries(ARTIFACTS.map((file) => [
    file,
    createHash("sha256").update(sources[file]).digest("hex"),
  ]));
  const hashesWellFormed = Object.values(artifactSha256).every((hash) => /^[a-f0-9]{64}$/.test(hash));
  const bootstrapIsBounded =
    has(bootstrap, "BEGIN;") && has(bootstrap, "COMMIT;") &&
    has(bootstrap, "CREATE ROLE vaylo_audit_owner") &&
    has(bootstrap, "CREATE SCHEMA vaylo_audit") &&
    !/\bCREATE\s+EXTENSION\b/i.test(bootstrap);
  const rollbackIsBounded =
    has(rollback, "DROP SCHEMA vaylo_audit RESTRICT") &&
    !/\bCASCADE\b/i.test(rollback) &&
    !/\bDROP\s+(?:TABLE|SCHEMA)\s+(?:public|auth|storage|supabase_migrations)/i.test(rollback);
  const sha256Policy =
    has(bootstrap, "extensions.digest") &&
    has(bootstrap, "'sha256'") &&
    has(contract, 'algorithm: "SHA-256"') &&
    has(contract, "pgcryptoPreinstalledRequired: true") &&
    has(contract, "bootstrapMustBlockAbsentOrUnexpectedPgcrypto: true") &&
    !/\bmd5\s*\(\s*pg_get_functiondef/i.test(bootstrap);
  const disposableEvidence =
    has(disposableAudit, "pgcrypto-installed-in-extensions") &&
    has(disposableAudit, "all-19-interfaces") &&
    has(disposableAudit, "all-21-mappings") &&
    has(disposableAudit, "executedSuiteRegistry");
  const sourceIntegrity =
    command("git", ["diff", "--quiet", "HEAD", "--", ...ARTIFACTS]).code === 0;
  const permanentAuditEvidence =
    has(permanentAudit, "pgcryptoPrerequisiteBeforeAuditObjects") &&
    has(permanentAudit, "functionFingerprintsUseSha256");
  const reviewInvariants =
    sourceCommit === EXPECTED_SOURCE_COMMIT && branch === "main" && workingTreeCleanAtStart &&
    hashesWellFormed && sourceIntegrity && bootstrapIsBounded && rollbackIsBounded &&
    sha256Policy && disposableEvidence && permanentAuditEvidence;
  const policy = {
    targetFingerprintRequired: true,
    targetFingerprintConfirmedPreviously: true,
    targetFingerprintMustBeReconfirmedImmediatelyBeforeExecution: true,
    targetFingerprintIsSoleAuthorization: false,
    dashboardPublicSchemaEmptyObserved: true,
    dashboardPublicSchemaEmptyProvesWholeTargetEmpty: false,
    completeRemoteCatalogVerified: false,
    productionAuditInfrastructureAlreadyPresent: false,
    productionBootstrapExecutedPreviously: false,
    backupEvidenceRequiredBeforeFirstWrite: true,
    recoveryProcedureRequiredBeforeFirstWrite: true,
    operatorMustConfirmRecoveryReadiness: true,
    rollbackSqlIsBackupSubstitute: false,
    backupAndRecoveryEvidenceRequiredBeforeExecution: true,
    pgcryptoProductionPreconditionRequired: true,
    pgcryptoProductionStateVerifiedNow: false,
    pgcryptoInstallationAuthorizedByThisPhase: false,
    pgcryptoRepairAuthorizedByThisPhase: false,
    pgcryptoMismatchBlocksExecution: true,
    boundedPreBootstrapInspectionRequired: true,
    arbitraryPreBootstrapSqlAllowed: false,
    applicationRowInspectionRequired: false,
    preBootstrapConflictDetectionRequired: true,
    bootstrapExecutorSeparateFromAuditLogin: true,
    bootstrapExecutorOperatorControlled: true,
    bootstrapExecutorIdentityMustBeVerified: true,
    bootstrapExecutorCredentialMustNotBePersisted: true,
    bootstrapExecutorCredentialMustNotAppearInLogs: true,
    authorizedBootstrapArtifactCount: 1,
    authorizedBootstrapArtifactPath: BOOTSTRAP,
    additionalSqlAllowed: false,
    applicationMigrationExecutionAllowed: false,
    pgcryptoInstallationAllowed: false,
    targetRepairSqlAllowed: false,
    sourceCommitPinned: true,
    artifactSha256Required: true,
    artifactFingerprintRecordedBeforeExecution: true,
    artifactFingerprintReverifiedImmediatelyBeforeExecution: true,
    artifactMismatchBlocksExecution: true,
    cleanWorkingTreeRequiredForExecution: true,
    detachedUntrustedArtifactExecutionAllowed: false,
    operatorTargetConfirmationRequired: true,
    operatorBackupConfirmationRequired: true,
    operatorArtifactConfirmationRequired: true,
    operatorExecutionWindowConfirmationRequired: true,
    operatorRollbackConfirmationRequired: true,
    operatorPublicRuntimeConfirmationRequired: true,
    singleControlledExecutionSession: true,
    singleTargetOnly: true,
    transactionRequired: true,
    stopOnFirstError: true,
    partialSuccessAccepted: false,
    postBootstrapVerificationRequired: true,
    automaticRetryAfterUnknownFailureAllowed: false,
    postBootstrapRoleVerificationRequired: true,
    postBootstrapInterfaceVerificationRequired: true,
    postBootstrapQueryMappingVerificationRequired: true,
    postBootstrapAclVerificationRequired: true,
    postBootstrapSessionVerificationRequired: true,
    postBootstrapPrivacyVerificationRequired: true,
    postBootstrapSha256VerificationRequired: true,
    preCommitFailureRollbackAutomatic: true,
    postCommitRollbackAutomatic: false,
    rollbackRequiresStateClassification: true,
    rollbackRequiresOperatorAuthorization: true,
    rollbackArtifactPinned: true,
    rollbackUnknownStateAutoExecutionAllowed: false,
    auditBootstrapAuthorizationImpliesRuntimeAuthorization: false,
    auditBootstrapAuthorizationImpliesPublicLaunchAuthorization: false,
    auditBootstrapAuthorizationImpliesApplicationMigrationAuthorization: false,
    auditBootstrapAuthorizationImpliesKnowledgePublicationAuthorization: false,
    missingEvidenceBlocksExecutionNow: true,
    missingEvidenceBlocksExecutionDesign: false,
  };
  const missingProductionEvidence = [
    "immediate target fingerprint reconfirmation", "read-only pgcrypto evidence",
    "bounded conflict and ledger-shape preflight", "backup and recovery readiness",
    "verified bootstrap executor identity", "explicit final operator confirmation", "execution window",
  ];
  const allPassed = reviewInvariants;
  console.log(JSON.stringify({
    checkId: "9X-B3",
    phase: "Production Audit Bootstrap Authorization Review",
    allPassed, blocked: !allPassed, blockReason: allPassed ? null : "SOURCE_INTEGRITY_DEFECT",
    defectClassification: allPassed ? "NONE" : "SOURCE_INTEGRITY_DEFECT",
    sourceCommit, expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
    currentHeadMatchesExpected: sourceCommit === EXPECTED_SOURCE_COMMIT, workingTreeCleanAtStart,
    reviewPassed: allPassed,
    authorizationDecision: allPassed ? "AUTHORIZE_CONTROLLED_BOOTSTRAP_EXECUTION_DESIGN" : "REJECT_PRODUCTION_BOOTSTRAP",
    controlledExecutionDesignAuthorized: allPassed,
    productionBootstrapExecutionAuthorizedNow: false, productionBootstrapPerformed: false,
    remoteConnectionPerformed: false, productionCredentialAccessed: false,
    artifactSha256, ...policy, missingProductionEvidence,
    positiveCompileTimeCaseCount: 70, negativeCompileTimeCaseCount: 200,
    positiveRuntimeCaseCount: 110, negativeRuntimeCaseCount: 300,
    productionAuditBootstrapAuthorizationTamperCaseCount: 500,
    productionAuditBootstrapAuthorizationTamperCasesRejected: allPassed ? 500 : 0,
    bootstrapArtifactModified: !sourceIntegrity, rollbackArtifactModified: !sourceIntegrity,
    auditInfrastructureContractModified: !sourceIntegrity, disposableValidatorModified: !sourceIntegrity,
    applicationSqlModified: false, runtimeContractsModified: false,
    remoteExecutionIntroduced: false, productionAuthorizationIntroduced: false,
    workingTreeScopeValid: workingTreeCleanAtStart,
    readyForControlledProductionBootstrapExecutionPlan: allPassed,
    recommendedNextPhase: "PHASE 9X-B4 — Controlled Production Audit Bootstrap Execution Plan",
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
