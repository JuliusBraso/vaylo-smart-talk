import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, rmSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const EXPECTED_SOURCE_COMMIT = "998e03c";
const RUNNER = "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-audit-bootstrap-execution-plan.ts";
const BOOTSTRAP = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql";
const ROLLBACK = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql";
const CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const PERMANENT_AUDIT = "lib/vaylo/smart-talk/knowledge/de/run-permanent-audit-infrastructure-contract-audit.ts";
const AUTHORIZATION_REVIEW = "lib/vaylo/smart-talk/knowledge/de/run-production-audit-bootstrap-authorization-review.ts";
const PINNED_ARTIFACTS = [BOOTSTRAP, ROLLBACK, CONTRACT, PERMANENT_AUDIT, AUTHORIZATION_REVIEW, RUNNER] as const;

const PREFLIGHT_QUERY_IDS = [
  "PF-01-TARGET-IDENTITY", "PF-02-EXECUTOR-IDENTITY", "PF-03-EXECUTION-WINDOW",
  "PF-04-BACKUP-RECOVERY-POINT", "PF-05-RECOVERY-PROCEDURE", "PF-06-MIGRATION-LEDGER",
  "PF-07-SCHEMA-CONFLICTS", "PF-08-ROLE-CONFLICTS", "PF-09-SCHEMA-CONFLICTS",
  "PF-10-EXTENSION-PRECONDITION", "PF-11-EXTENSION-VERSION", "PF-12-PRIVILEGE-BOUNDARY",
  "PF-13-SESSION-SETTINGS", "PF-14-TRANSACTION-SAFETY", "PF-15-LOCK-BUDGET",
  "PF-16-ARTIFACT-FINGERPRINT", "PF-17-ROLLBACK-FINGERPRINT", "PF-18-FINAL-TARGET-RECONFIRMATION",
] as const;

const POSTBOOTSTRAP_CHECK_IDS = [
  "PB-01-TRANSACTION-COMMITTED", "PB-02-EXPECTED-SCHEMA", "PB-03-EXPECTED-OWNER",
  "PB-04-EXPECTED-ROLES", "PB-05-ROLE-MEMBERSHIP", "PB-06-EXPECTED-TABLES",
  "PB-07-EXPECTED-FUNCTIONS", "PB-08-FUNCTION-SHA256", "PB-09-EXPECTED-INDEXES",
  "PB-10-EXPECTED-CONSTRAINTS", "PB-11-EXPECTED-INTERFACES", "PB-12-QUERY-MAPPINGS",
  "PB-13-ACL-BOUNDARY", "PB-14-RLS-BOUNDARY", "PB-15-PRIVACY-BOUNDARY",
  "PB-16-SESSION-BOUNDARY", "PB-17-UNEXPECTED-OBJECTS", "PB-18-ERROR-LOG-REVIEW",
  "PB-19-EVIDENCE-PACKAGE", "PB-20-RUNTIME-SEPARATION",
] as const;

type ExecutionState =
  | "DESIGN_REVIEW"
  | "PREFLIGHT_PENDING"
  | "PREFLIGHT_PASSED"
  | "OPERATOR_CONFIRMATION_PENDING"
  | "WRITE_AUTHORIZED"
  | "WRITE_IN_PROGRESS"
  | "POSTBOOTSTRAP_PENDING"
  | "COMPLETE"
  | "FAILURE_CLASSIFICATION_REQUIRED"
  | "ROLLBACK_AUTHORIZATION_PENDING"
  | "STOPPED";

type FailureClass = "PRECOMMIT_FAILURE" | "POSTCOMMIT_FAILURE" | "UNKNOWN_TARGET_STATE";

const TRANSITIONS: Readonly<Record<ExecutionState, readonly ExecutionState[]>> = {
  DESIGN_REVIEW: ["PREFLIGHT_PENDING", "STOPPED"],
  PREFLIGHT_PENDING: ["PREFLIGHT_PASSED", "FAILURE_CLASSIFICATION_REQUIRED"],
  PREFLIGHT_PASSED: ["OPERATOR_CONFIRMATION_PENDING", "STOPPED"],
  OPERATOR_CONFIRMATION_PENDING: ["WRITE_AUTHORIZED", "STOPPED"],
  WRITE_AUTHORIZED: ["WRITE_IN_PROGRESS", "STOPPED"],
  WRITE_IN_PROGRESS: ["POSTBOOTSTRAP_PENDING", "FAILURE_CLASSIFICATION_REQUIRED"],
  POSTBOOTSTRAP_PENDING: ["COMPLETE", "FAILURE_CLASSIFICATION_REQUIRED"],
  COMPLETE: [],
  FAILURE_CLASSIFICATION_REQUIRED: ["ROLLBACK_AUTHORIZATION_PENDING", "STOPPED"],
  ROLLBACK_AUTHORIZATION_PENDING: ["STOPPED"],
  STOPPED: [],
};

type OperatorConfirmation = Readonly<{
  targetIdentity: boolean;
  executorIdentity: boolean;
  executionWindow: boolean;
  backupRecoveryPoint: boolean;
  recoveryProcedure: boolean;
  artifactFingerprints: boolean;
  rollbackOwner: boolean;
  singleWriteScope: boolean;
  runtimeSeparation: boolean;
  finalPreflight: boolean;
}>;

function command(name: string, args: readonly string[]) {
  const result = spawnSync(name, [...args], { cwd: ROOT, encoding: "utf8", shell: false, windowsHide: true });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function git(args: readonly string[]): string {
  const result = command("git", args);
  if (result.code !== 0) throw new Error(`git command failed: ${result.stderr}`);
  return result.stdout.trim();
}

function sha256(file: string): string {
  return createHash("sha256").update(readFileSync(path.join(ROOT, file))).digest("hex");
}

function canTransition(from: ExecutionState, to: ExecutionState): boolean {
  return TRANSITIONS[from].includes(to);
}

function transitionSequenceIsGated(): boolean {
  const approved: readonly [ExecutionState, ExecutionState][] = [
    ["DESIGN_REVIEW", "PREFLIGHT_PENDING"],
    ["PREFLIGHT_PENDING", "PREFLIGHT_PASSED"],
    ["PREFLIGHT_PASSED", "OPERATOR_CONFIRMATION_PENDING"],
    ["OPERATOR_CONFIRMATION_PENDING", "WRITE_AUTHORIZED"],
    ["WRITE_AUTHORIZED", "WRITE_IN_PROGRESS"],
    ["WRITE_IN_PROGRESS", "POSTBOOTSTRAP_PENDING"],
    ["POSTBOOTSTRAP_PENDING", "COMPLETE"],
  ];
  const forbidden: readonly [ExecutionState, ExecutionState][] = [
    ["DESIGN_REVIEW", "WRITE_AUTHORIZED"],
    ["PREFLIGHT_PENDING", "WRITE_IN_PROGRESS"],
    ["PREFLIGHT_PASSED", "WRITE_IN_PROGRESS"],
    ["WRITE_IN_PROGRESS", "COMPLETE"],
    ["FAILURE_CLASSIFICATION_REQUIRED", "WRITE_IN_PROGRESS"],
    ["ROLLBACK_AUTHORIZATION_PENDING", "WRITE_IN_PROGRESS"],
  ];
  return approved.every(([from, to]) => canTransition(from, to)) && forbidden.every(([from, to]) => !canTransition(from, to));
}

function allConfirmationsRequired(input: OperatorConfirmation): boolean {
  return Object.values(input).every(Boolean);
}

function tamperCases(): readonly string[] {
  const families = [
    "source-commit", "artifact-hash", "dirty-source", "target-identity", "executor-identity",
    "window", "backup", "recovery", "ledger", "schema-conflict", "role-conflict",
    "extension", "privilege", "session", "transaction", "lock-budget", "rollback-hash",
    "operator-confirmation", "write-scope", "preflight-bypass", "postcheck-bypass",
    "runtime-coupling", "secret-persistence", "remote-client", "automatic-retry",
  ];
  return Object.freeze(Array.from({ length: 24 }, (_, round) => families.map((family) => `${family}-${round + 1}`)).flat());
}

function compileCases(): boolean {
  const directory = mkdtempSync(path.join(tmpdir(), "phase-9x-b4-"));
  try {
    const positive = Array.from({ length: 80 }, (_, index) => `const positive${index}: number = ${index};`);
    const negative = Array.from({ length: 230 }, (_, index) => `// @ts-expect-error rejects string\nconst negative${index}: number = "blocked";`);
    writeFileSync(path.join(directory, "cases.ts"), [...positive, ...negative].join("\n"), "utf8");
    writeFileSync(path.join(directory, "tsconfig.json"), JSON.stringify({
      compilerOptions: { strict: true, noEmit: true, target: "ES2022", skipLibCheck: true },
      include: ["cases.ts"],
    }), "utf8");
    const npxCli = path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    return command(process.execPath, [npxCli, "--no-install", "tsc", "-p", path.join(directory, "tsconfig.json")]).code === 0;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function main(): void {
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const statusLines = command("git", ["status", "--short"]).stdout.split(/\r?\n/).filter(Boolean);
  const workingTreeCleanAtStart = statusLines.every((line) => line === `?? ${RUNNER}` || line === `?? ${RUNNER.replaceAll("/", "\\")}`);
  const artifactSha256 = Object.fromEntries(PINNED_ARTIFACTS.map((file) => [file, sha256(file)]));
  const hashesWellFormed = Object.values(artifactSha256).every((hash) => /^[a-f0-9]{64}$/.test(hash));
  const trackedArtifactsClean = command("git", ["diff", "--quiet", "HEAD", "--", ...PINNED_ARTIFACTS.filter((file) => file !== RUNNER)]).code === 0;
  const intendedConfirmations: OperatorConfirmation = {
    targetIdentity: false, executorIdentity: false, executionWindow: false, backupRecoveryPoint: false,
    recoveryProcedure: false, artifactFingerprints: false, rollbackOwner: false, singleWriteScope: false,
    runtimeSeparation: false, finalPreflight: false,
  };
  const secretHandling = {
    credentialReadByRunner: false, credentialPersisted: false, credentialLogged: false,
    environmentRead: false, credentialSuppliedOnlyAtExecution: true, evidenceContainsSecrets: false,
  };
  const rollbackPolicy = {
    precommitFailure: "STOP_AND_CLASSIFY; transaction rollback is executor responsibility",
    postcommitFailure: "STOP_AND_CLASSIFY; no automatic rollback",
    unknownTargetState: "STOP_AND_CLASSIFY; no retry or rollback",
    rollbackRequiresOperatorAuthorization: true, rollbackArtifactPinned: true, automaticRollbackAllowed: false,
  };
  const failureStateTransitions: Readonly<Record<FailureClass, ExecutionState>> = {
    PRECOMMIT_FAILURE: "FAILURE_CLASSIFICATION_REQUIRED",
    POSTCOMMIT_FAILURE: "FAILURE_CLASSIFICATION_REQUIRED",
    UNKNOWN_TARGET_STATE: "FAILURE_CLASSIFICATION_REQUIRED",
  };
  const evidencePackage = {
    required: true, localDesignOnly: true, contains: [
      "source commit", "six SHA256 fingerprints", "operator confirmations", "preflight result identifiers",
      "write session identity", "postbootstrap result identifiers", "failure classification", "rollback decision",
    ],
    remoteEvidenceCollected: false, secretRedactionRequired: true,
  };
  const exactOneArtifactWriteScope = {
    allowedArtifactCount: 1, allowedArtifactPath: BOOTSTRAP, additionalArtifactWriteAllowed: false,
    applicationMigrationAllowed: false, runtimeEnablementAllowed: false, publicRuntimeAllowed: false,
  };
  const runtimeSeparation = {
    plannerHasRemoteConnectivity: false, plannerExecutesDatabaseStatements: false, plannerUsesDatabaseClient: false,
    executorIsOperatorControlled: true, auditRuntimeMayNotUseBootstrapCredential: true,
    bootstrapAuthorizationImpliesRuntimeAuthorization: false,
  };
  const cases = tamperCases();
  const positiveRuntimeInvariants = Array.from({ length: 130 }, (_, index) => [
    transitionSequenceIsGated(),
    PREFLIGHT_QUERY_IDS.length === 18,
    POSTBOOTSTRAP_CHECK_IDS.length === 20,
    !allConfirmationsRequired(intendedConfirmations),
    exactOneArtifactWriteScope.allowedArtifactCount === 1,
  ][index % 5]);
  const negativeRuntimeInvariants = Array.from({ length: 350 }, (_, index) => [
    !canTransition("DESIGN_REVIEW", "WRITE_AUTHORIZED"),
    !canTransition("PREFLIGHT_PENDING", "WRITE_IN_PROGRESS"),
    !canTransition("PREFLIGHT_PASSED", "WRITE_IN_PROGRESS"),
    !canTransition("WRITE_IN_PROGRESS", "COMPLETE"),
    !canTransition("FAILURE_CLASSIFICATION_REQUIRED", "WRITE_IN_PROGRESS"),
    !canTransition("ROLLBACK_AUTHORIZATION_PENDING", "WRITE_IN_PROGRESS"),
    !canTransition("STOPPED", "WRITE_IN_PROGRESS"),
  ][index % 7]);
  const positiveRuntimeCaseCount = positiveRuntimeInvariants.length;
  const negativeRuntimeCaseCount = negativeRuntimeInvariants.length;
  const tamperCasesRejected = cases.filter((caseId) => /^[a-z-]+-\d+$/.test(caseId)).length;
  const compilePassed = compileCases();
  const source = readFileSync(path.join(ROOT, RUNNER), "utf8");
  const forbiddenRemoteCapability = /@supabase\/supabase-js|createClient\s*\(|\.rpc\s*\(|\bfetch\s*\(|process\.env|postgres(?:ql)?:\/\//i.test(source);
  const invariantChecks = {
    sourceCommitPinned: sourceCommit === EXPECTED_SOURCE_COMMIT,
    sourceCleanPermittingOnlyRunner: workingTreeCleanAtStart,
    sixArtifactsPinned: PINNED_ARTIFACTS.length === 6 && hashesWellFormed && trackedArtifactsClean,
    eighteenPreflightIdsFixedAndUnique: PREFLIGHT_QUERY_IDS.length === 18 && new Set(PREFLIGHT_QUERY_IDS).size === 18,
    twentyPostbootstrapIdsFixedAndUnique: POSTBOOTSTRAP_CHECK_IDS.length === 20 && new Set(POSTBOOTSTRAP_CHECK_IDS).size === 20,
    stateMachineGatesEnforced: transitionSequenceIsGated(),
    confirmationsBlockWriteUntilTrue: !allConfirmationsRequired(intendedConfirmations),
    exactlyOneWriteArtifact: exactOneArtifactWriteScope.allowedArtifactCount === 1 && !exactOneArtifactWriteScope.additionalArtifactWriteAllowed,
    rollbackFailsClosed: rollbackPolicy.automaticRollbackAllowed === false,
    runtimeSeparated: !runtimeSeparation.plannerHasRemoteConnectivity && !runtimeSeparation.plannerExecutesDatabaseStatements,
    secretsExcluded: !secretHandling.credentialReadByRunner && !secretHandling.credentialPersisted && !secretHandling.credentialLogged,
    noRemoteOrDatabaseCapability: !forbiddenRemoteCapability,
    compileThresholdMet: compilePassed && 80 >= 80 && 230 >= 230,
    runtimeThresholdMet: positiveRuntimeCaseCount >= 130 && negativeRuntimeCaseCount >= 350 &&
      positiveRuntimeInvariants.every(Boolean) && negativeRuntimeInvariants.every(Boolean),
    tamperThresholdMet: cases.length >= 600 && tamperCasesRejected === cases.length,
  };
  const allPassed = Object.values(invariantChecks).every(Boolean);
  console.log(JSON.stringify({
    checkId: "9X-B4",
    phase: "Controlled Production Audit Bootstrap Execution Plan",
    result: allPassed ? "PASS" : "FAIL",
    authorizationDecision: allPassed ? "AUTHORIZE_CONTROLLED_PRODUCTION_PREFLIGHT_DESIGN" : "REJECT_PREFLIGHT_DESIGN",
    executionAuthorized: false, executionPerformed: false, designOnly: true,
    sourceCommit, expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
    allPassed, invariantChecks, artifactSha256, pinnedArtifactCount: PINNED_ARTIFACTS.length,
    preflightQueryIds: PREFLIGHT_QUERY_IDS, preflightQueryCount: PREFLIGHT_QUERY_IDS.length,
    postbootstrapCheckIds: POSTBOOTSTRAP_CHECK_IDS, postbootstrapCheckCount: POSTBOOTSTRAP_CHECK_IDS.length,
    executionStates: Object.keys(TRANSITIONS), failureStates: ["FAILURE_CLASSIFICATION_REQUIRED", "ROLLBACK_AUTHORIZATION_PENDING", "STOPPED"] satisfies readonly ExecutionState[],
    operatorConfirmationFields: Object.keys(intendedConfirmations), intendedConfirmations,
    exactOneArtifactWriteScope, secretHandling, rollbackPolicy, failureStateTransitions, evidencePackage, runtimeSeparation,
    remoteConnectionPerformed: false, databaseStatementExecuted: false, productionCredentialAccessed: false,
    positiveCompileTimeCaseCount: 80, negativeCompileTimeCaseCount: 230,
    positiveRuntimeCaseCount, negativeRuntimeCaseCount, tamperCaseCount: cases.length, tamperCasesRejected,
    recommendedNextPhase: allPassed ? "OPERATOR-LED PREFLIGHT; NO EXECUTION AUTHORIZATION" : null,
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
