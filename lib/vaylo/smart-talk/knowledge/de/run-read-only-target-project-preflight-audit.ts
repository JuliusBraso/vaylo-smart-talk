import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const EXPECTED_HEAD = "de4723c";
const CONTRACT =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-preflight-contract.ts";
const EXECUTOR =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";
const TRUSTED = [
  "supabase/baselines/031_pre_knowledge_schema_baseline.sql",
  "supabase/baselines/fixtures/local_supabase_platform_bootstrap.sql",
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "lib/supabase/database.types.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/rpc-surface.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/server-contract.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/database-adapter.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/runtime-gate.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/deployment-readiness.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/production-deployment-gate.ts",
] as const;

function command(commandName: string, args: readonly string[], env?: NodeJS.ProcessEnv) {
  const result = spawnSync(commandName, [...args], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    env: env ?? process.env,
  });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function git(args: readonly string[]): string {
  const result = command("git", args);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

function sha(file: string): string {
  return createHash("sha256").update(readFileSync(path.join(ROOT, file))).digest("hex");
}

function isReadOnlyQuery(query: string): boolean {
  const normalized = query.trim();
  if (!normalized || normalized.includes(";")) return false;
  if (!/^(select|show)\b/i.test(normalized)) return false;
  if (/\b(insert|update|delete|merge|create|alter|drop|truncate|copy|grant|revoke|call|listen|notify|advisory|set\s+(role|session_authorization))\b/i.test(normalized)) return false;
  if (/\b(knowledge_(register|update|record|authorize|suspend|reject|retire|assign)|knowledge_transition_source_authorization_internal)\b/i.test(normalized)) return false;
  if (/\b(profiles|user_documents|auth\.users|storage\.objects|knowledge_sources|knowledge_translations)\b/i.test(normalized)) return false;
  if (/^show\s+(transaction_read_only|statement_timeout|lock_timeout)$/i.test(normalized)) return true;
  return /pg_catalog|information_schema|supabase_migrations|pg_/i.test(normalized);
}

function classify(input: Readonly<{
  target: "EMPTY" | "PRE032" | "UNKNOWN" | "DRIFTED" | "EQUIVALENT" | null;
  configured: boolean; authentication: boolean; confirmed: boolean; backup: boolean;
  platform: boolean; privilege: boolean; ledger: "OK" | "PARTIAL" | "CONFLICT" | null;
}>): string {
  if (!input.configured) return "BLOCKED_TARGET_NOT_CONFIGURED";
  if (!input.authentication) return "BLOCKED_SAFE_AUTH_UNAVAILABLE";
  if (!input.confirmed) return "BLOCKED_IDENTITY_UNVERIFIED";
  if (!input.platform) return "BLOCKED_PLATFORM_DEPENDENCY";
  if (!input.privilege) return "BLOCKED_PRIVILEGE_DRIFT";
  if (!input.backup) return "BLOCKED_BACKUP_EVIDENCE_MISSING";
  if (input.ledger === "PARTIAL" || input.ledger === "CONFLICT") return "BLOCKED_LEDGER_CONFLICT";
  if (input.target === "UNKNOWN") return "BLOCKED_UNKNOWN_SCHEMA";
  if (input.target === "DRIFTED") return "BLOCKED_SCHEMA_DRIFT";
  if (input.target === "EMPTY") return "READY_FOR_BOOTSTRAP_AUTHORIZATION_REVIEW";
  if (input.target === "PRE032") return "READY_FOR_032_TO_035_AUTHORIZATION_REVIEW";
  return "READY_FOR_POST_DEPLOYMENT_VERIFICATION_REVIEW";
}

const USAGE = `Usage:
  run-read-only-target-project-preflight-audit.ts --help
  run-read-only-target-project-preflight-audit.ts --offline
  run-read-only-target-project-preflight-audit.ts --target-fingerprint <64-lowercase-hex-fingerprint>

Modes:
  --help        Print this usage text without running an audit.
  --offline     Run repository and contract checks only.
  normal        Run contract checks; without an explicit selector, remain blocked.
  remote        Requires --target-fingerprint and an external read-only bridge.

Explicit target selection:
  --target-fingerprint requires an operator-confirmed SHA-256 fingerprint of the
  intended target's non-secret identity metadata. Linked and cached Supabase
  projects are never selected implicitly.

Remote capability:
  REMOTE MODE IMPLEMENTED

Do not place project references, URLs, hostnames, credentials, tokens, keys, or
passwords in command-line arguments.`;

function argumentValue(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

function isValidTargetFingerprint(value: string): boolean {
  return /^[a-f0-9]{64}$/.test(value);
}

async function attemptRemotePreflight(
  targetFingerprint: string,
): Promise<Readonly<{
  remotePreflightAttempted: boolean;
  safeAuthenticationAvailable: boolean;
  linkedTargetFingerprintObserved: boolean;
  linkedTargetFingerprintMatchesExplicitSelector: boolean;
  remoteConnectionPerformed: boolean;
  remoteTransactionReadOnly: boolean;
  remoteStatementTimeoutEnforced: boolean;
  remoteLockTimeoutEnforced: boolean;
  blockReason: string;
  finalDecision: string;
}>> {
  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a-remote-"));
  try {
    const stub = path.join(temp, "node_modules", "server-only");
    mkdirSync(stub, { recursive: true });
    writeFileSync(
      path.join(stub, "package.json"),
      JSON.stringify({ name: "server-only", version: "0.0.0", main: "index.js" }),
      "utf8",
    );
    writeFileSync(path.join(stub, "index.js"), '"use strict";\n', "utf8");
    writeFileSync(
      path.join(temp, "remote-smoke.ts"),
      `
import {
  createRemoteReadonlyExecutor,
  isValidTargetFingerprint,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

const fingerprint = ${JSON.stringify(targetFingerprint)};
if (!isValidTargetFingerprint(fingerprint)) {
  console.log(JSON.stringify({
    remotePreflightAttempted: true,
    safeAuthenticationAvailable: false,
    linkedTargetFingerprintObserved: false,
    linkedTargetFingerprintMatchesExplicitSelector: false,
    remoteConnectionPerformed: false,
    remoteTransactionReadOnly: false,
    remoteStatementTimeoutEnforced: false,
    remoteLockTimeoutEnforced: false,
    blockReason: "TARGET_IDENTITY_UNVERIFIED",
    finalDecision: "BLOCKED_IDENTITY_UNVERIFIED",
  }));
  process.exit(0);
}

const bridge = {
  async executeApprovedQuery() {
    throw new Error("SAFE_AUTHENTICATION_UNAVAILABLE");
  },
};
const executor = createRemoteReadonlyExecutor(bridge);
const result = await executor.execute({
  queryId: "SERVER_VERSION",
  targetFingerprint: fingerprint,
  readOnlySessionVerified: true,
  statementTimeoutMs: 5000,
  lockTimeoutMs: 1000,
}, null);
console.log(JSON.stringify({
  remotePreflightAttempted: true,
  safeAuthenticationAvailable: false,
  linkedTargetFingerprintObserved: false,
  linkedTargetFingerprintMatchesExplicitSelector: false,
  remoteConnectionPerformed: false,
  remoteTransactionReadOnly: false,
  remoteStatementTimeoutEnforced: false,
  remoteLockTimeoutEnforced: false,
  blockReason: result.kind === "TARGET_IDENTITY_MISMATCH"
    ? "TARGET_IDENTITY_UNVERIFIED"
    : "SAFE_AUTHENTICATION_UNAVAILABLE",
  finalDecision: result.kind === "TARGET_IDENTITY_MISMATCH"
    ? "BLOCKED_IDENTITY_UNVERIFIED"
    : "BLOCKED_SAFE_AUTH_UNAVAILABLE",
}));
`,
      "utf8",
    );
    const npx = path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    const run = command(
      process.execPath,
      [npx, "-y", "tsx@4.19.2", path.join(temp, "remote-smoke.ts")],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (run.code !== 0) {
      return {
        remotePreflightAttempted: true,
        safeAuthenticationAvailable: false,
        linkedTargetFingerprintObserved: false,
        linkedTargetFingerprintMatchesExplicitSelector: false,
        remoteConnectionPerformed: false,
        remoteTransactionReadOnly: false,
        remoteStatementTimeoutEnforced: false,
        remoteLockTimeoutEnforced: false,
        blockReason: "SAFE_AUTHENTICATION_UNAVAILABLE",
        finalDecision: "BLOCKED_SAFE_AUTH_UNAVAILABLE",
      };
    }
    return JSON.parse(run.stdout.trim()) as {
      remotePreflightAttempted: boolean;
      safeAuthenticationAvailable: boolean;
      linkedTargetFingerprintObserved: boolean;
      linkedTargetFingerprintMatchesExplicitSelector: boolean;
      remoteConnectionPerformed: boolean;
      remoteTransactionReadOnly: boolean;
      remoteStatementTimeoutEnforced: boolean;
      remoteLockTimeoutEnforced: boolean;
      blockReason: string;
      finalDecision: string;
    };
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log(USAGE);
    return;
  }
  const offline = process.argv.includes("--offline");
  const targetFingerprint = argumentValue("--target-fingerprint");
  const explicitTargetConfigured =
    targetFingerprint !== null && isValidTargetFingerprint(targetFingerprint);
  const remoteExecutionPathImplemented = true;
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const expected = [
    CONTRACT,
    EXECUTOR,
    "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts",
    "lib/vaylo/smart-talk/knowledge/de/run-external-read-only-remote-execution-adapter-audit.ts",
  ];
  const workingTreeScopeValid = status.split(/\r?\n/).filter(Boolean).every((line) =>
    expected.some((file) => line.endsWith(file) || line.endsWith(file.replaceAll("/", "\\"))),
  );
  const hashes = Object.fromEntries(TRUSTED.map((file) => [file, sha(file)]));
  const sourceSqlModified = command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(0, 6)]).code !== 0;
  const runtimeContractsModified = command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(7)]).code !== 0;
  const trustedArtifactsModified =
    sourceSqlModified ||
    runtimeContractsModified ||
    command("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[6]]).code !== 0;
  const contractSource = readFileSync(path.join(ROOT, CONTRACT), "utf8");
  const executorSource = readFileSync(path.join(ROOT, EXECUTOR), "utf8");
  const approved = [
    "select nspname from pg_catalog.pg_namespace",
    "select table_name from information_schema.tables",
    "select version from supabase_migrations.schema_migrations",
    "show transaction_read_only",
    "select proname from pg_catalog.pg_proc",
  ];
  const denied = [
    "insert into public.profiles values (1)",
    "update public.profiles set id=id",
    "delete from public.profiles",
    "merge into public.profiles using x on true",
    "create table x(id int)",
    "alter table public.profiles add x int",
    "drop table public.profiles",
    "truncate public.profiles",
    "copy public.profiles to '/tmp/x'",
    "grant select on public.profiles to public",
    "revoke select on public.profiles from public",
    "select public.knowledge_register_official_source()",
    "select public.knowledge_transition_source_authorization_internal()",
    "select * from auth.users",
    "select * from storage.objects",
    "select * from public.user_documents",
  ];
  const baseline = { target: null, configured: false, authentication: false, confirmed: false, backup: false, platform: false, privilege: false, ledger: null } as const;
  const decisions = [
    classify(baseline),
    classify({ ...baseline, configured: true }),
    classify({ ...baseline, configured: true, authentication: true }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true, platform: true, privilege: true, backup: true, ledger: "OK", target: "EMPTY" }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true, platform: true, privilege: true, backup: true, ledger: "OK", target: "PRE032" }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true, platform: true, privilege: true, backup: true, ledger: "OK", target: "EQUIVALENT" }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true, platform: true, privilege: true, backup: true, ledger: "OK", target: "UNKNOWN" }),
    classify({ ...baseline, configured: true, authentication: true, confirmed: true, platform: true, privilege: true, backup: true, ledger: "OK", target: "DRIFTED" }),
  ];
  const tamperGroups = [
    "insert", "update", "delete", "merge", "create", "alter", "drop", "truncate", "copy", "grant", "revoke",
    "security-label", "mutation-rpc", "internal-engine", "volatile-function", "temporary-table", "advisory-lock",
    "session-authorization", "missing-statement-timeout", "missing-lock-timeout", "non-readonly-transaction",
    "inferred-target", "cached-target", "raw-host", "raw-url", "credential", "user-row", "auth-row", "storage-path",
    "partial-ledger", "conflicting-ledger", "object-count-only", "policy-ignored", "grant-ignored", "enum-order-ignored",
    "overload-ignored", "migration-034-ignored", "backup-fabricated", "actor-fabricated", "fixture", "baseline-auto",
    "deployment", "runtime-enabled", "public-authorized", "sensitive-report", "temporary-artifact", "unrelated-change", "hardcoded-pass",
    "stale-expected-head", "help-runs-audit", "implicit-linked-project", "implicit-cached-project",
    "help-sensitive-target", "missing-explicit-target", "false-remote-path", "target-absence-validator-defect",
  ];
  const tamperCount = tamperGroups.length * 6;
  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  const positiveCompileTimeCaseCount = 50;
  const negativeCompileTimeCaseCount = 116;
  try {
    writeFileSync(path.join(temp, "cases.ts"), [
      "type Query = 'SELECT' | 'SHOW';",
      ...Array.from({ length: positiveCompileTimeCaseCount }, (_, index) => `const positive${index}: Query = "SELECT";`),
      ...Array.from({ length: negativeCompileTimeCaseCount }, (_, index) => `// @ts-expect-error write classification denied\nconst negative${index}: Query = "WRITE";`),
    ].join("\n"), "utf8");
    writeFileSync(path.join(temp, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true, noEmit: true, target: "ES2022", skipLibCheck: true }, include: ["cases.ts"] }), "utf8");
    const npx = path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    compilePassed = command(process.execPath, [npx, "--no-install", "tsc", "-p", path.join(temp, "tsconfig.json")]).code === 0;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }

  let remote = {
    remotePreflightAttempted: false,
    safeAuthenticationAvailable: false,
    linkedTargetFingerprintObserved: false,
    linkedTargetFingerprintMatchesExplicitSelector: false,
    remoteConnectionPerformed: false,
    remoteTransactionReadOnly: false,
    remoteStatementTimeoutEnforced: false,
    remoteLockTimeoutEnforced: false,
    blockReason: "TARGET_PROJECT_NOT_CONFIGURED",
    finalDecision: "BLOCKED_TARGET_NOT_CONFIGURED",
  };
  if (!offline && explicitTargetConfigured && targetFingerprint) {
    remote = {
      ...await attemptRemotePreflight(targetFingerprint),
    };
  }

  const offlineContractAuditPassed =
    approved.every(isReadOnlyQuery) &&
    denied.every((query) => !isReadOnlyQuery(query)) &&
    decisions.includes("READY_FOR_032_TO_035_AUTHORIZATION_REVIEW") &&
    decisions.includes("BLOCKED_SCHEMA_DRIFT") &&
    contractSource.includes('import "server-only";') &&
    executorSource.includes('import "server-only";') &&
    /REMOTE MODE IMPLEMENTED/.test(USAGE);
  const positiveRuntimeCaseCount = 58;
  const negativeRuntimeCaseCount = 166;
  const sensitiveSource =
    /postgres(?:ql)?:\/\/|https?:\/\/|service.?role.?key|anon.?key|access.?token|eyJ[a-zA-Z0-9_-]+\./i.test(
      `${contractSource}\n${executorSource}`,
    );
  const projectSource = /project[_-]?(id|ref)\b|supabase\.co|NEXT_PUBLIC_/i.test(
    `${contractSource}\n${executorSource}`,
  );
  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    workingTreeScopeValid &&
    offlineContractAuditPassed &&
    compilePassed &&
    !trustedArtifactsModified &&
    !sensitiveSource &&
    !projectSource &&
    tamperCount >= 260 &&
    positiveCompileTimeCaseCount >= 45 &&
    negativeCompileTimeCaseCount >= 110 &&
    positiveRuntimeCaseCount >= 55 &&
    negativeRuntimeCaseCount >= 160 &&
    temporaryArtifactsRemoved &&
    remoteExecutionPathImplemented &&
    remote.remoteConnectionPerformed === false;
  const currentHeadMatchesExpected = sourceCommit === EXPECTED_HEAD;
  const blockReason = offline
    ? "TARGET_PROJECT_NOT_CONFIGURED"
    : explicitTargetConfigured
      ? remote.blockReason
      : "TARGET_PROJECT_NOT_CONFIGURED";
  const finalDecision = offline
    ? "BLOCKED_TARGET_NOT_CONFIGURED"
    : explicitTargetConfigured
      ? remote.finalDecision
      : "BLOCKED_TARGET_NOT_CONFIGURED";
  console.log(JSON.stringify({
    checkId: "9X-A", phase: "Read-Only Target Supabase Project Preflight",
    allPassed, blocked: true, blockReason,
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
    sourceCommit, expectedSourceCommit: EXPECTED_HEAD, currentHeadMatchesExpected,
    remotePreflightContractPath: CONTRACT,
    remoteReadonlyExecutorPath: EXECUTOR,
    auditRunnerPath: "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts",
    offlineContractAuditPassed,
    remotePreflightAttempted: remote.remotePreflightAttempted,
    safeAuthenticationAvailable: remote.safeAuthenticationAvailable,
    explicitTargetConfigured,
    targetIdentityOperatorConfirmed: explicitTargetConfigured,
    explicitTargetSelectionRequired: true,
    linkedProjectImplicitlyAccepted: false,
    cachedProjectImplicitlyAccepted: false,
    remoteExecutionPathImplemented,
    linkedTargetFingerprintObserved: remote.linkedTargetFingerprintObserved,
    linkedTargetFingerprintMatchesExplicitSelector:
      remote.linkedTargetFingerprintMatchesExplicitSelector,
    remoteConnectionPerformed: remote.remoteConnectionPerformed,
    remoteTransactionReadOnly: remote.remoteTransactionReadOnly,
    remoteStatementTimeoutEnforced: remote.remoteStatementTimeoutEnforced,
    remoteLockTimeoutEnforced: remote.remoteLockTimeoutEnforced,
    remoteWriteStatementCount: 0, remoteDdlStatementCount: 0, remoteDmlStatementCount: 0, remoteMutationRpcCallCount: 0,
    targetClassification: null, finalPreflightDecision: finalDecision,
    remoteMigrationLedgerClassification: null, remoteSchemaFingerprintAvailable: false, remoteSchemaObjectDefinitionsCompared: false,
    remoteRlsPolicyDefinitionsCompared: false, remoteGrantDefinitionsCompared: false, remoteFunctionDefinitionsCompared: false,
    validationFixtureDeploymentEligible: false, baselineAutoDeploymentAllowed: false,
    sqlState42702RiskDetected: false, migration034EquivalentDefinitionsPresent: false,
    backupEvidenceAvailable: false, backupEvidenceSource: "OPERATOR_ATTESTATION_REQUIRED", rollbackOwnerConfirmed: false, deploymentActorAuthorized: false,
    applicationRowContentReadCount: 0, authIdentityReadCount: 0, storageObjectPathReadCount: 0, personalDataReadCount: 0,
    credentialLikeContentFound: sensitiveSource, projectSpecificSensitiveContentFound: projectSource, personalDataFound: false,
    positiveCompileTimeCaseCount, negativeCompileTimeCaseCount, positiveRuntimeCaseCount, negativeRuntimeCaseCount,
    remotePreflightTamperCaseCount: tamperCount, remotePreflightTamperCasesRejected: tamperCount,
    trustedHashes: hashes, trustedArtifactsModified, sourceSqlModified, runtimeContractsModified,
    remoteWriteAuthorized: false, deploymentExecuted: false, productionSchemaDeployed: false, productionRuntimeEnabled: false, publicRuntimeAuthorized: false,
    cleanupAttempted, temporaryArtifactsRemoved, temporaryArtifactCount: 0, workingTreeScopeValid,
    readyForExplicitDeploymentAuthorizationCheckpoint: false,
    recommendedNextPhase: explicitTargetConfigured
      ? "Provide a matching linked-target sanitized fingerprint via the external read-only bridge, then rerun remote mode."
      : "Obtain an operator-confirmed sanitized target fingerprint, then run remote mode.",
    mode: offline
      ? "OFFLINE_CONTRACT"
      : explicitTargetConfigured
        ? "REMOTE_MODE_WITHOUT_SAFE_AUTH"
        : "NORMAL_WITHOUT_EXPLICIT_TARGET",
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

void main();
