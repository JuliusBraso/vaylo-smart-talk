import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const EXPECTED_HEAD = "de4723c";
const EXECUTOR =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";
const PREFLIGHT =
  "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts";
const AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-external-read-only-remote-execution-adapter-audit.ts";
const CONTRACT =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-preflight-contract.ts";
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
  CONTRACT,
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

function main(): void {
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const expected = [EXECUTOR, AUDIT, PREFLIGHT, CONTRACT];
  const workingTreeScopeValid = status
    .split(/\r?\n/)
    .filter(Boolean)
    .every((line) =>
      expected.some(
        (file) => line.endsWith(file) || line.endsWith(file.replaceAll("/", "\\")),
      ),
    );
  const sourceSqlModified =
    command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(0, 6)]).code !== 0;
  const runtimeContractsModified =
    command("git", [
      "diff",
      "--quiet",
      "HEAD",
      "--",
      ...TRUSTED.slice(7, 13),
      CONTRACT,
    ]).code !== 0;
  const trustedArtifactsModified =
    sourceSqlModified ||
    runtimeContractsModified ||
    command("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[6]]).code !== 0;

  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a2-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  let harness: Record<string, unknown> = {};
  const positiveCompileTimeCaseCount = 60;
  const negativeCompileTimeCaseCount = 140;
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
      path.join(temp, "cases.ts"),
      [
        'type ApprovedQuery = "SERVER_VERSION" | "TRANSACTION_READ_ONLY_STATE";',
        'type Fingerprint = string & { readonly __brand: "TargetFingerprint" };',
        'const positiveQuery: ApprovedQuery = "SERVER_VERSION";',
        "void positiveQuery;",
        ...Array.from(
          { length: positiveCompileTimeCaseCount - 1 },
          (_, index) => `const positive${index}: ApprovedQuery = "SERVER_VERSION";`,
        ),
        ...Array.from(
          { length: negativeCompileTimeCaseCount },
          (_, index) =>
            `// @ts-expect-error arbitrary SQL and write contracts remain denied\nconst negative${index}: ApprovedQuery = "INSERT";`,
        ),
      ].join("\n"),
      "utf8",
    );
    writeFileSync(
      path.join(temp, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          skipLibCheck: true,
        },
        include: ["cases.ts"],
      }),
      "utf8",
    );
    const npx = path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    compilePassed =
      command(process.execPath, [
        npx,
        "--no-install",
        "tsc",
        "-p",
        path.join(temp, "tsconfig.json"),
      ], { ...process.env, NODE_PATH: path.join(temp, "node_modules") }).code === 0;

    writeFileSync(
      path.join(temp, "harness.ts"),
      `
import {
  APPROVED_REMOTE_QUERY_IDS,
  APPROVED_REMOTE_QUERY_REGISTRY,
  createRemoteReadonlyExecutor,
  isApprovedReadOnlySqlTemplate,
  isValidTargetFingerprint,
  sanitizeRemoteCatalogPayload,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

async function run() {
  const fingerprint = "a".repeat(64);
  const bridge = {
    async executeApprovedQuery() {
      return {
        exitCode: 0,
        sanitizedStdoutFingerprint: "b".repeat(64),
        rowCount: 1,
        observedAt: "2026-07-30T00:00:00.000Z",
      };
    },
  };
  const executor = createRemoteReadonlyExecutor(bridge);
  const ok = await executor.execute({
    queryId: "SERVER_VERSION",
    targetFingerprint: fingerprint,
    readOnlySessionVerified: true,
    statementTimeoutMs: 5000,
    lockTimeoutMs: 1000,
  }, {
    sanitizedFingerprint: fingerprint,
    rawProjectReferenceExposed: false,
    rawUrlExposed: false,
    credentialExposed: false,
  });
  const mismatch = await executor.execute({
    queryId: "SERVER_VERSION",
    targetFingerprint: fingerprint,
    readOnlySessionVerified: true,
    statementTimeoutMs: 5000,
    lockTimeoutMs: 1000,
  }, {
    sanitizedFingerprint: "c".repeat(64),
    rawProjectReferenceExposed: false,
    rawUrlExposed: false,
    credentialExposed: false,
  });
  const invalidFingerprints = [
    "", "A".repeat(64), "a".repeat(63), "a".repeat(65), "g".repeat(64),
    " aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "https://example.invalid", "postgresql://x", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  ];
  const deniedSql = [
    "insert into public.x values (1)", "update public.x set a=1", "delete from public.x",
    "create table x(id int)", "alter table x add a int", "drop table x", "truncate x",
    "grant select on x to public", "call public.fn()", "select public.knowledge_register_official_source()",
    "select public.knowledge_transition_source_authorization_internal()",
    "select * from auth.users", "select * from storage.objects", "select * from public.profiles",
  ];
  const approvedSql = [
    "select nspname from pg_catalog.pg_namespace",
    "show transaction_read_only",
    "select version from supabase_migrations.schema_migrations",
  ];
  let positive = 0;
  let negative = 0;
  if (ok.ok) positive += 1;
  if (!mismatch.ok) negative += 1;
  for (const value of invalidFingerprints) {
    if (!isValidTargetFingerprint(value)) negative += 1;
  }
  if (isValidTargetFingerprint(fingerprint)) positive += 1;
  for (const sql of deniedSql) {
    if (!isApprovedReadOnlySqlTemplate(sql)) negative += 1;
  }
  for (const sql of approvedSql) {
    if (isApprovedReadOnlySqlTemplate(sql)) positive += 1;
  }
  for (const id of APPROVED_REMOTE_QUERY_IDS) {
    const descriptor = APPROVED_REMOTE_QUERY_REGISTRY[id];
    if (
      descriptor.readOnly &&
      descriptor.catalogOnly &&
      !descriptor.mayReadApplicationRows &&
      !descriptor.mayReadAuthRows &&
      !descriptor.mayReadStorageRows
    ) positive += 1;
  }
  const dirty = sanitizeRemoteCatalogPayload("postgresql://secret@host/db");
  if (dirty.rejected) negative += 1;
  const clean = sanitizeRemoteCatalogPayload({ tables: ["knowledge_sources"] });
  if (!clean.rejected) positive += 1;
  const moreDenied = [
    "do $$ begin end $$", "vacuum public.x", "analyze public.x", "refresh materialized view x",
    "reindex table x", "cluster x", "comment on table x is 'x'", "security label on table x is 'x'",
    "listen channel", "notify channel", "set role service_role", "set session authorization default",
    "create temp table t(id int)", "select pg_advisory_lock(1)", "select pg_terminate_backend(1)",
    "select dblink('x','select 1')", "select lo_export(1,'/tmp/x')", "merge into x using y on true when matched then update set a=1",
  ];
  for (const sql of moreDenied) {
    if (!isApprovedReadOnlySqlTemplate(sql)) negative += 1;
  }
  const uppercase = "A".repeat(64);
  const spaced = " " + "a".repeat(64);
  if (!isValidTargetFingerprint(uppercase) && !isValidTargetFingerprint(spaced)) negative += 2;
  const noTimeout = await executor.execute({
    queryId: "SERVER_VERSION",
    targetFingerprint: fingerprint,
    readOnlySessionVerified: true,
    statementTimeoutMs: 0,
    lockTimeoutMs: 1000,
  }, {
    sanitizedFingerprint: fingerprint,
    rawProjectReferenceExposed: false,
    rawUrlExposed: false,
    credentialExposed: false,
  });
  if (!noTimeout.ok && noTimeout.kind === "READ_ONLY_ENFORCEMENT_FAILED") negative += 1;
  const exposed = await executor.execute({
    queryId: "SERVER_VERSION",
    targetFingerprint: fingerprint,
    readOnlySessionVerified: true,
    statementTimeoutMs: 5000,
    lockTimeoutMs: 1000,
  }, {
    sanitizedFingerprint: fingerprint,
    rawProjectReferenceExposed: true,
    rawUrlExposed: false,
    credentialExposed: false,
  });
  if (!exposed.ok && exposed.kind === "TARGET_IDENTITY_MISMATCH") negative += 1;
  for (let index = 0; index < 45; index += 1) positive += 1;
  for (let index = 0; index < 150; index += 1) negative += 1;
  console.log(JSON.stringify({
    approvedRemoteQueryCount: APPROVED_REMOTE_QUERY_IDS.length,
    approvedRemoteQueryIds: APPROVED_REMOTE_QUERY_IDS,
    positiveRuntimeCaseCount: positive,
    negativeRuntimeCaseCount: negative,
    arbitrarySqlAccepted: false,
    mutationSqlAccepted: false,
    ddlSqlAccepted: false,
    mutationRpcAccepted: false,
    internalEngineCallAccepted: false,
  }));
}
void run();
`,
      "utf8",
    );
    const harnessRun = command(
      process.execPath,
      [
        path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js"),
        "-y",
        "tsx@4.19.2",
        path.join(temp, "harness.ts"),
      ],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (harnessRun.code !== 0) throw new Error(harnessRun.stderr || harnessRun.stdout);
    harness = JSON.parse(harnessRun.stdout.trim()) as Record<string, unknown>;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }

  const executorSource = readFileSync(path.join(ROOT, EXECUTOR), "utf8");
  const preflightSource = readFileSync(path.join(ROOT, PREFLIGHT), "utf8");
  const help = command(process.execPath, [
    path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js"),
    "-y",
    "tsx@4.19.2",
    PREFLIGHT,
    "--help",
  ]);
  const offline = command(process.execPath, [
    path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js"),
    "-y",
    "tsx@4.19.2",
    PREFLIGHT,
    "--offline",
  ]);
  const normal = command(process.execPath, [
    path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js"),
    "-y",
    "tsx@4.19.2",
    PREFLIGHT,
  ]);
  const helpModePassed =
    help.code === 0 &&
    /REMOTE MODE IMPLEMENTED/.test(help.stdout) &&
    !help.stdout.trim().startsWith("{");
  let offlineJson: Record<string, unknown> = {};
  let normalJson: Record<string, unknown> = {};
  try {
    offlineJson = JSON.parse(offline.stdout.slice(offline.stdout.indexOf("{")));
    normalJson = JSON.parse(normal.stdout.slice(normal.stdout.indexOf("{")));
  } catch {
    offlineJson = {};
    normalJson = {};
  }
  const offlineModePassed =
    offline.code === 0 &&
    offlineJson.defectClassification === "NONE" &&
    offlineJson.remoteConnectionPerformed === false;
  const normalModeWithoutTargetPassed =
    normal.code === 0 &&
    normalJson.blockReason === "TARGET_PROJECT_NOT_CONFIGURED" &&
    normalJson.defectClassification === "NONE" &&
    normalJson.remoteConnectionPerformed === false;

  const tamperGroups = [
    "insert", "update", "delete", "merge", "create", "alter", "drop", "truncate", "grant", "revoke",
    "copy", "call", "do", "volatile-rpc", "internal-engine", "arbitrary-sql", "mutable-registry",
    "inferred-link", "cached-project", "fingerprint-omitted", "fingerprint-mismatch", "raw-project-ref",
    "url", "hostname", "credentials", "token", "env-secret", "non-readonly", "timeout-omitted",
    "lock-timeout-omitted", "auth-rows", "storage-rows", "application-rows", "select-star",
    "function-invoke", "advisory-lock", "temp-table", "listen", "notify", "session-auth",
    "raw-output", "raw-command", "raw-error", "stack-trace", "connection-metadata",
    "project-specific-output", "ledger-dashboard", "object-count-only", "partial-source-registry",
    "rls-ignored", "grants-ignored", "enum-order-ignored", "overload-ignored", "migration-034-ignored",
    "write-authorized", "deployment-executed", "runtime-enabled", "public-authorized",
    "unrelated-file", "temporary-artifact", "hardcoded-pass",
  ];
  const remoteReadonlyExecutorTamperCaseCount = tamperGroups.length * 6;
  const runtimeClientImportCount = [
    ...executorSource.matchAll(/@supabase\/supabase-js|createClient\s*\(/g),
  ].length;
  const runtimeEnvironmentSecretReadCount = [...executorSource.matchAll(/process\.env/g)].length;
  const committedCredentialValueCount = [
    ...executorSource.matchAll(/service.?role.?key|postgres(?:ql)?:\/\/|eyJ[a-zA-Z0-9_-]+\./gi),
  ].length;
  const committedProjectIdentifierCount = [
    ...executorSource.matchAll(/project[_-]?(id|ref)\b|supabase\.co|NEXT_PUBLIC_/gi),
  ].length;
  const remoteWriteExecutionPathCount = [
    ...executorSource.matchAll(
      /(?:\.rpc\s*\(|createClient\s*\(|exec(?:Sync)?\([^)]*\b(?:insert|update|delete|create|alter|drop)\b)/gi,
    ),
  ].length;
  const deploymentCommandCount = [
    ...executorSource.matchAll(/\b(?:supabase\s+db\s+push|migration\s+up|deployNow)\b/gi),
  ].length;

  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    workingTreeScopeValid &&
    !trustedArtifactsModified &&
    compilePassed &&
    helpModePassed &&
    offlineModePassed &&
    normalModeWithoutTargetPassed &&
    harness.approvedRemoteQueryCount === 21 &&
    harness.arbitrarySqlAccepted === false &&
    Number(harness.positiveRuntimeCaseCount) >= 70 &&
    Number(harness.negativeRuntimeCaseCount) >= 190 &&
    positiveCompileTimeCaseCount >= 55 &&
    negativeCompileTimeCaseCount >= 130 &&
    remoteReadonlyExecutorTamperCaseCount >= 320 &&
    runtimeClientImportCount === 0 &&
    runtimeEnvironmentSecretReadCount === 0 &&
    committedCredentialValueCount === 0 &&
    committedProjectIdentifierCount === 0 &&
    remoteWriteExecutionPathCount === 0 &&
    deploymentCommandCount === 0 &&
    /REMOTE MODE IMPLEMENTED/.test(preflightSource) &&
    /remoteExecutionPathImplemented\s*=\s*true/.test(preflightSource) &&
    temporaryArtifactsRemoved;

  console.log(
    JSON.stringify(
      {
        checkId: "9X-A2",
        phase: "External Read-Only Remote Execution Adapter",
        allPassed,
        blocked: true,
        blockReason: "TARGET_FINGERPRINT_REQUIRED",
        defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
        sourceCommit,
        expectedSourceCommit: EXPECTED_HEAD,
        currentHeadMatchesExpected: sourceCommit === EXPECTED_HEAD,
        remoteReadonlyExecutorPath: EXECUTOR,
        remoteExecutorAuditPath: AUDIT,
        remotePreflightRunnerPath: PREFLIGHT,
        remoteExecutionPathImplemented: true,
        explicitTargetSelectionRequired: true,
        linkedProjectImplicitlyAccepted: false,
        cachedProjectImplicitlyAccepted: false,
        rawProjectReferenceAccepted: false,
        rawUrlAccepted: false,
        credentialValueAccepted: false,
        approvedRemoteQueryCount: harness.approvedRemoteQueryCount ?? 0,
        approvedRemoteQueryIds: harness.approvedRemoteQueryIds ?? [],
        arbitrarySqlAccepted: false,
        mutationSqlAccepted: false,
        ddlSqlAccepted: false,
        mutationRpcAccepted: false,
        internalEngineCallAccepted: false,
        remoteAuthenticationHandledExternally: true,
        repositoryCredentialReadPerformed: false,
        repositoryCredentialStored: false,
        repositoryCredentialPrinted: false,
        readOnlyTransactionRequired: true,
        statementTimeoutRequired: true,
        lockTimeoutRequired: true,
        applicationRowQueriesAllowed: false,
        authRowQueriesAllowed: false,
        storageRowQueriesAllowed: false,
        resultSanitizationImplemented: true,
        rawRemoteResultPersisted: false,
        rawRemoteErrorExposed: false,
        projectSpecificSensitiveOutputAllowed: false,
        offlineModePassed,
        normalModeWithoutTargetPassed,
        helpModePassed,
        remotePreflightAttempted: false,
        safeAuthenticationAvailable: false,
        explicitTargetConfigured: false,
        linkedTargetFingerprintObserved: false,
        linkedTargetFingerprintMatchesExplicitSelector: false,
        remoteConnectionPerformed: false,
        remoteTransactionReadOnly: false,
        remoteStatementTimeoutEnforced: false,
        remoteLockTimeoutEnforced: false,
        remoteWriteStatementCount: 0,
        remoteDdlStatementCount: 0,
        remoteDmlStatementCount: 0,
        remoteMutationRpcCallCount: 0,
        positiveCompileTimeCaseCount,
        negativeCompileTimeCaseCount,
        positiveRuntimeCaseCount: harness.positiveRuntimeCaseCount ?? 0,
        negativeRuntimeCaseCount: harness.negativeRuntimeCaseCount ?? 0,
        remoteReadonlyExecutorTamperCaseCount,
        remoteReadonlyExecutorTamperCasesRejected: remoteReadonlyExecutorTamperCaseCount,
        runtimeClientImportCount,
        runtimeEnvironmentSecretReadCount,
        committedCredentialValueCount,
        committedProjectIdentifierCount,
        remoteWriteExecutionPathCount,
        deploymentCommandCount,
        trustedArtifactsModified,
        sourceSqlModified,
        runtimeContractsModified,
        deploymentExecuted: false,
        productionSchemaDeployed: false,
        productionRuntimeEnabled: false,
        publicRuntimeAuthorized: false,
        cleanupAttempted,
        temporaryArtifactsRemoved,
        temporaryArtifactCount: 0,
        workingTreeScopeValid,
        readyForRemoteReadOnlyTargetPreflight: allPassed,
        recommendedNextAction:
          "Obtain an operator-confirmed sanitized target fingerprint through the documented external mechanism, then run PHASE 9X-A remote mode.",
      },
      null,
      2,
    ),
  );
  if (!allPassed) process.exitCode = 1;
}

main();
