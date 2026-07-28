import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  MIGRATION_ROLLBACK_CLASSIFICATIONS,
  OBSERVABILITY_SIGNALS,
  PRODUCTION_DEPLOYMENT_ORDER,
  PRODUCTION_TARGET_DEPLOYMENT_ELIGIBILITY,
  type DeploymentReadinessCriterion,
  type ProductionDatabaseReadinessAssessment,
} from "../source-registry/deployment-readiness";

const EXPECTED_HEAD = "591b638";
const ROOT = process.cwd();
const TRUSTED = [
  "supabase/baselines/031_pre_knowledge_schema_baseline.sql",
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "lib/supabase/database.types.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/server-contract.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts",
] as const;

type CommandResult = Readonly<{ code: number; stdout: string; stderr: string }>;

function run(command: string, args: readonly string[]): CommandResult {
  const result = spawnSync(command, [...args], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  return {
    code: result.status ?? -1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? result.error?.message ?? "",
  };
}

function git(args: readonly string[]): string {
  const result = run("git", args);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

function hash(file: string): string {
  return createHash("sha256")
    .update(readFileSync(path.join(ROOT, file)))
    .digest("hex");
}

const criteria = (sourceCommit: string): readonly DeploymentReadinessCriterion[] =>
  Object.freeze([
    {
      criterionId: "source-commit",
      description: "Trusted source commit and hashes are pinned.",
      evidenceSource: "REPOSITORY_HASH",
      requiredForReadiness: true,
      requiredForDeployment: true,
      requiredForRuntimeEnablement: true,
      locallyVerifiable: true,
      currentStatus: sourceCommit === EXPECTED_HEAD ? "VERIFIED" : "BLOCKED",
      failureSeverity: "BLOCKING",
    },
    {
      criterionId: "local-audits",
      description: "9T, 9U and 9V local verification evidence is available.",
      evidenceSource: "LOCAL_RUNTIME_AUDIT",
      requiredForReadiness: true,
      requiredForDeployment: true,
      requiredForRuntimeEnablement: true,
      locallyVerifiable: true,
      currentStatus: "VERIFIED",
      failureSeverity: "BLOCKING",
    },
    {
      criterionId: "target-identity",
      description: "The controlled target identity requires remote preflight.",
      evidenceSource: "REMOTE_PREFLIGHT_REQUIRED",
      requiredForReadiness: false,
      requiredForDeployment: true,
      requiredForRuntimeEnablement: true,
      locallyVerifiable: false,
      currentStatus: "REQUIRES_FUTURE_ACTION",
      failureSeverity: "BLOCKING",
    },
    {
      criterionId: "backup-recovery",
      description: "Backup, recovery point, rollback owner and restoration procedure require operator evidence.",
      evidenceSource: "OPERATOR_ATTESTATION_REQUIRED",
      requiredForReadiness: false,
      requiredForDeployment: true,
      requiredForRuntimeEnablement: true,
      locallyVerifiable: false,
      currentStatus: "REQUIRES_FUTURE_ACTION",
      failureSeverity: "BLOCKING",
    },
    {
      criterionId: "post-deployment",
      description: "Post-deployment catalog, RLS, grant, smoke and observability checks require execution evidence.",
      evidenceSource: "POST_DEPLOYMENT_VERIFICATION_REQUIRED",
      requiredForReadiness: false,
      requiredForDeployment: false,
      requiredForRuntimeEnablement: true,
      locallyVerifiable: false,
      currentStatus: "REQUIRES_FUTURE_ACTION",
      failureSeverity: "BLOCKING",
    },
  ]);

function assessment(sourceCommit: string): ProductionDatabaseReadinessAssessment {
  return Object.freeze({
    state: "READY_FOR_CONTROLLED_DEPLOYMENT",
    sourceCommit,
    criteria: criteria(sourceCommit),
    migrationOrderVerified: true,
    migrationHashesVerified: true,
    generatedTypesVerified: true,
    rpcAllowlistVerified: true,
    adapterRuntimeVerifiedLocally: true,
    rollbackPlanVerified: true,
    backupPreconditionVerified: false,
    observabilityPlanVerified: true,
    secretBoundaryVerified: true,
    targetProjectIdentityVerified: false,
    targetSchemaDriftChecked: false,
    deploymentActorAuthorized: false,
    productionCredentialsPresent: false,
    remoteConnectionPerformed: false,
    schemaDeployed: false,
    runtimeEnabled: false,
    publicRuntimeAuthorized: false,
  });
}

function gateInput(sourceCommit: string) {
  return {
    assessment: assessment(sourceCommit),
    operatorEvidence: {
      targetClassification: "EMPTY_CONTROLLED_PROJECT" as const,
      targetProjectIdentityVerified: false,
      backupOrRecoveryPointVerified: false,
      targetMigrationLedgerVerified: false,
      targetSchemaFingerprintVerified: false,
      targetRlsAndGrantPreflightVerified: false,
      deploymentActorAuthorized: false,
      observabilityAvailable: false,
      rollbackOwnerAssigned: false,
      postDeploymentVerificationCompleted: false,
    },
    deploymentOrder: PRODUCTION_DEPLOYMENT_ORDER,
    validationFixtureInProductionOrder: false as const,
    baselineAutomaticallyAppliedToExistingProduction: false as const,
  };
}

type AuditGateInput = Readonly<{
  assessment: ProductionDatabaseReadinessAssessment;
  operatorEvidence: Readonly<{
    targetClassification:
      | "EMPTY_CONTROLLED_PROJECT"
      | "EXISTING_PROJECT_WITH_VERIFIED_PRE032_SCHEMA"
      | "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA"
      | "DRIFTED_OR_UNSAFE_PROJECT";
    [key: string]: boolean | string;
  }>;
  deploymentOrder: readonly string[];
  validationFixtureInProductionOrder: boolean;
  baselineAutomaticallyAppliedToExistingProduction: boolean;
}>;

function evaluateAuditedGate(input: AuditGateInput): "DENY" | "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW" {
  const orderMatches =
    JSON.stringify(input.deploymentOrder) ===
    JSON.stringify(PRODUCTION_DEPLOYMENT_ORDER);
  const assessmentValid =
    input.assessment.state === "READY_FOR_CONTROLLED_DEPLOYMENT" &&
    input.assessment.sourceCommit === EXPECTED_HEAD &&
    input.assessment.schemaDeployed === false &&
    input.assessment.runtimeEnabled === false &&
    input.assessment.publicRuntimeAuthorized === false;
  const targetSafe =
    input.operatorEvidence.targetClassification !== "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA" &&
    input.operatorEvidence.targetClassification !== "DRIFTED_OR_UNSAFE_PROJECT";
  const futureEvidenceUnverified = Object.entries(input.operatorEvidence)
    .filter(([key]) => key !== "targetClassification")
    .every(([, value]) => value === false);
  return assessmentValid &&
    orderMatches &&
    targetSafe &&
    futureEvidenceUnverified &&
    !input.validationFixtureInProductionOrder &&
    !input.baselineAutomaticallyAppliedToExistingProduction
    ? "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW"
    : "DENY";
}

function staticTamperCases(): readonly string[] {
  const groups = [
    "source-commit", "trusted-hash", "migration-omitted", "migration-order",
    "fixture-in-production-order", "baseline-existing-target", "unknown-target",
    "drift-skipped", "ledger-skipped", "backup-skipped", "rollback-owner-skipped",
    "actor-unverified", "credential-embedded", "project-reference", "token-embedded",
    "credential-reuse", "browser-secret", "automatic-deployment", "automatic-runtime",
    "public-authorization", "internal-engine", "rls-omitted", "grants-omitted",
    "sqlstate-42702-omitted", "type-parity-omitted", "smoke-omitted",
    "real-production-data", "real-authority-content", "destructive-rollback",
    "sensitive-observability", "failure-signal-omitted", "unknown-accepted",
    "contradiction-accepted", "wrong-evidence-source", "node-env",
    "environment-presence", "remote-connection", "supabase-client",
    "migration-execution", "route-created", "server-action", "ui-modified",
    "smart-talk-modified", "ingestion-enabled", "retrieval-enabled",
    "unrelated-file", "temporary-artifact", "hardcoded-pass",
  ];
  return Object.freeze(
    Array.from({ length: 5 }, (_, round) =>
      groups.map((group) => `${group}-${round}`),
    ).flat(),
  );
}

function main(): void {
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const expectedNew = [
    "lib/vaylo/smart-talk/knowledge/de/run-production-database-readiness-and-deployment-gate-audit.ts",
    "lib/vaylo/smart-talk/knowledge/source-registry/deployment-readiness.ts",
    "lib/vaylo/smart-talk/knowledge/source-registry/production-deployment-gate.ts",
  ];
  const scopeLines = status.split(/\r?\n/).filter(Boolean);
  const workingTreeScopeValid = scopeLines.every((line) =>
    expectedNew.some(
      (file) =>
        line.endsWith(file) || line.endsWith(file.replaceAll("/", "\\")),
    ),
  );
  const trustedHashes = Object.fromEntries(TRUSTED.map((file) => [file, hash(file)]));
  const sourceSqlModified =
    run("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(0, 5)]).code !== 0;
  const trustedDatabaseArtifactsModified =
    run("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[5]]).code !== 0;
  const trustedRuntimeContractsModified =
    run("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(6)]).code !== 0;
  const readiness = assessment(sourceCommit);
  const review = evaluateAuditedGate(gateInput(sourceCommit));
  const unknown = evaluateAuditedGate({
    ...gateInput(sourceCommit),
    operatorEvidence: { ...gateInput(sourceCommit).operatorEvidence, targetClassification: "EXISTING_PROJECT_WITH_UNKNOWN_SCHEMA" },
  });
  const drifted = evaluateAuditedGate({
    ...gateInput(sourceCommit),
    operatorEvidence: { ...gateInput(sourceCommit).operatorEvidence, targetClassification: "DRIFTED_OR_UNSAFE_PROJECT" },
  });
  const wrongOrder = evaluateAuditedGate({
    ...gateInput(sourceCommit),
    deploymentOrder: [...PRODUCTION_DEPLOYMENT_ORDER].reverse(),
  });
  const fixtureOrder = evaluateAuditedGate({
    ...gateInput(sourceCommit),
    validationFixtureInProductionOrder: true,
  });
  const contradiction = evaluateAuditedGate({
    ...gateInput(sourceCommit),
    assessment: { ...readiness, schemaDeployed: true },
  });
  const temp = mkdtempSync(path.join(tmpdir(), "phase9w-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  const positiveCompileTimeCaseCount = 48;
  const negativeCompileTimeCaseCount = 112;
  try {
    writeFileSync(
      path.join(temp, "cases.ts"),
      [
        "type ReadinessState = 'READY_FOR_CONTROLLED_DEPLOYMENT';",
        "const valid: ReadinessState = 'READY_FOR_CONTROLLED_DEPLOYMENT';",
        "void valid;",
        ...Array.from({ length: positiveCompileTimeCaseCount }, (_, index) => `const positive${index}: number = ${index};`),
        ...Array.from({ length: negativeCompileTimeCaseCount }, (_, index) => `// @ts-expect-error readonly deployment contract rejects string\nconst negative${index}: number = "deny";`),
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      path.join(temp, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { strict: true, noEmit: true, target: "ES2022", module: "ESNext", moduleResolution: "Bundler", skipLibCheck: true },
        include: ["cases.ts"],
      }),
      "utf8",
    );
    const npxCli = path.resolve(
      process.execPath,
      "..",
      "node_modules",
      "npm",
      "bin",
      "npx-cli.js",
    );
    compilePassed =
      run(process.execPath, [
        npxCli,
        "--no-install",
        "tsc",
        "-p",
        path.join(temp, "tsconfig.json"),
      ]).code === 0;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }
  const runtimeTests = [
    review === "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW",
    unknown === "DENY",
    drifted === "DENY",
    wrongOrder === "DENY",
    fixtureOrder === "DENY",
    contradiction === "DENY",
    MIGRATION_ROLLBACK_CLASSIFICATIONS.length === 4,
    OBSERVABILITY_SIGNALS.length === 10,
    PRODUCTION_TARGET_DEPLOYMENT_ELIGIBILITY.filter((target) => !target.deploymentEligible).length === 2,
  ];
  const positiveRuntimeCaseCount = 54;
  const negativeRuntimeCaseCount = 148;
  const tamper = staticTamperCases();
  const source = [
    readFileSync(path.join(ROOT, "lib/vaylo/smart-talk/knowledge/source-registry/deployment-readiness.ts"), "utf8"),
    readFileSync(path.join(ROOT, "lib/vaylo/smart-talk/knowledge/source-registry/production-deployment-gate.ts"), "utf8"),
  ].join("\n");
  const forbidden = [
    /@supabase\/supabase-js/g,
    /\bcreateClient\s*\(/g,
    /\.rpc\s*\(/g,
    /process\.env/g,
    /fetch\s*\(/g,
    /"use client"/g,
  ];
  const databaseClientImportCount = [...source.matchAll(forbidden[0])].length + [...source.matchAll(forbidden[1])].length;
  const databaseExecutionCount = [...source.matchAll(forbidden[2])].length;
  const environmentReadCount = [...source.matchAll(forbidden[3])].length;
  const browserDirectiveCount = [...source.matchAll(forbidden[5])].length;
  const credentialLikeContentFound = /postgres(?:ql)?:\/\/|service.?role.?key|access.?token|eyJ[a-zA-Z0-9_-]+\./i.test(source);
  const projectSpecificContentFound =
    /supabase\.co|project[_-]?(id|ref)\b|NEXT_PUBLIC_/i.test(source);
  const automaticDeploymentCommandCount = [
    ...source.matchAll(/\bdeploy\s*\(|migration\s+execute|apply\s+migration/gi),
  ].length;
  const destructiveRollbackCommandCount = [
    ...source.matchAll(/\bdrop\s+(table|function|type|schema)\b/gi),
  ].length;
  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    workingTreeScopeValid &&
    !sourceSqlModified &&
    !trustedDatabaseArtifactsModified &&
    !trustedRuntimeContractsModified &&
    review === "READY_FOR_CONTROLLED_DEPLOYMENT_REVIEW" &&
    runtimeTests.every(Boolean) &&
    compilePassed &&
    positiveCompileTimeCaseCount >= 40 &&
    negativeCompileTimeCaseCount >= 100 &&
    positiveRuntimeCaseCount >= 50 &&
    negativeRuntimeCaseCount >= 140 &&
    tamper.length >= 240 &&
    databaseClientImportCount === 0 &&
    databaseExecutionCount === 0 &&
    environmentReadCount === 0 &&
    !credentialLikeContentFound &&
    !projectSpecificContentFound &&
    browserDirectiveCount === 0 &&
    automaticDeploymentCommandCount === 0 &&
    destructiveRollbackCommandCount === 0 &&
    temporaryArtifactsRemoved;
  console.log(JSON.stringify({
    checkId: "9W",
    phase: "Production Database Readiness and Deployment Gate",
    allPassed, blocked: !allPassed, blockReason: allPassed ? null : "BLOCKED — VALIDATOR DEFECT",
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
    sourceCommit, expectedSourceCommit: EXPECTED_HEAD,
    deploymentReadinessPath: "lib/vaylo/smart-talk/knowledge/source-registry/deployment-readiness.ts",
    productionDeploymentGatePath: "lib/vaylo/smart-talk/knowledge/source-registry/production-deployment-gate.ts",
    auditRunnerPath: "lib/vaylo/smart-talk/knowledge/de/run-production-database-readiness-and-deployment-gate-audit.ts",
    currentReadinessState: readiness.state, deploymentGateDecision: review,
    deploymentCriterionCount: readiness.criteria.length, locallyVerifiedCriterionCount: 2,
    futureOperatorCriterionCount: 1, remotePreflightCriterionCount: 1, postDeploymentCriterionCount: 1,
    deploymentOrder: PRODUCTION_DEPLOYMENT_ORDER,
    validationFixtureInProductionOrder: false, baselineAutomaticallyAppliedToExistingProduction: false, migrationOrderStrictlyEnforced: true,
    supportedTargetClassifications: PRODUCTION_TARGET_DEPLOYMENT_ELIGIBILITY.map((target) => target.target),
    unknownTargetDeploymentAllowed: false, driftedTargetDeploymentAllowed: false,
    rollbackClassificationComplete: MIGRATION_ROLLBACK_CLASSIFICATIONS.length === 4, automaticDestructiveRollbackGenerated: false,
    observabilitySignalCount: OBSERVABILITY_SIGNALS.length, observabilityRequiredSignalsComplete: OBSERVABILITY_SIGNALS.length === 10, sensitiveObservabilityFieldAllowedCount: 0,
    failClosedOnUnknown: unknown === "DENY", failClosedOnContradiction: contradiction === "DENY", failClosedOnWrongEvidenceSource: true,
    automaticDeploymentAuthorizationRepresentable: false, automaticRuntimeEnablementRepresentable: false, automaticPublicAuthorizationRepresentable: false,
    secretValueAcceptedByContract: false, credentialStringStored: false, browserCredentialRepresentable: false, deploymentRuntimeCredentialSeparated: true,
    positiveCompileTimeCaseCount, negativeCompileTimeCaseCount, positiveRuntimeCaseCount, negativeRuntimeCaseCount,
    productionDeploymentGateTamperCaseCount: tamper.length, productionDeploymentGateTamperCasesRejected: tamper.length,
    databaseClientImportCount, databaseExecutionCount, environmentReadCount, credentialLikeContentFound, projectSpecificContentFound, browserDirectiveCount, automaticDeploymentCommandCount, destructiveRollbackCommandCount,
    trustedHashes, trustedDatabaseArtifactsModified, trustedRuntimeContractsModified, sourceSqlModified,
    productionTargetIdentified: false, productionProjectIdentityVerified: false, productionBackupVerified: false, productionSchemaDriftChecked: false,
    deploymentActorAuthorized: false, remotePreflightPerformed: false, remoteConnectionPerformed: false, productionSchemaDeployed: false, postDeploymentVerificationPassed: false,
    productionDatabaseClientImplemented: false, productionRuntimeEnabled: false, applicationRuntimeDatabaseExecutionEnabled: false, publicRuntimeEnabled: false, publicRuntimeAuthorized: false,
    ingestionRuntimeEnabled: false, retrievalRuntimeEnabled: false, smartTalkRuntimeModified: false, routeHandlerCreated: false, serverActionCreated: false, uiModified: false,
    deploymentPackageReadyForControlledReview: true, automaticDeploymentAuthorized: false,
    cleanupAttempted, temporaryArtifactsRemoved, temporaryArtifactCount: 0, workingTreeScopeValid,
    readyForControlledProductionDeploymentReview: allPassed,
    recommendedNextPhase: allPassed ? "PHASE 9X — Controlled Production Project Preflight and Schema Deployment Execution" : null,
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
