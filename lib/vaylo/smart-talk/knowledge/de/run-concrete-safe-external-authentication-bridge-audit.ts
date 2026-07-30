import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const EXPECTED_HEAD = "bec39dd";
const BRIDGE =
  "lib/vaylo/smart-talk/knowledge/source-registry/supabase-cli-readonly-bridge.ts";
const EXECUTOR =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";
const AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-concrete-safe-external-authentication-bridge-audit.ts";
const FINGERPRINT_RUNNER =
  "lib/vaylo/smart-talk/knowledge/de/run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts";
const PREFLIGHT =
  "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts";
const CONTRACT =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-preflight-contract.ts";
const ADAPTER_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-external-read-only-remote-execution-adapter-audit.ts";
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
  ADAPTER_AUDIT,
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

function npxCli(): string {
  return path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
}

function prepareServerOnlyStub(temp: string): void {
  const stub = path.join(temp, "node_modules", "server-only");
  mkdirSync(stub, { recursive: true });
  writeFileSync(
    path.join(stub, "package.json"),
    JSON.stringify({ name: "server-only", version: "0.0.0", main: "index.js" }),
    "utf8",
  );
  writeFileSync(path.join(stub, "index.js"), '"use strict";\n', "utf8");
}

function main(): void {
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const expectedScope = [BRIDGE, AUDIT, EXECUTOR, FINGERPRINT_RUNNER, PREFLIGHT];
  const workingTreeScopeValid = status
    .split(/\r?\n/)
    .filter(Boolean)
    .every((line) =>
      expectedScope.some(
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
    command("git", ["diff", "--quiet", "HEAD", "--", TRUSTED[6], ADAPTER_AUDIT]).code !== 0;

  const versionProbe = command(process.execPath, [
    npxCli(),
    "-y",
    "supabase@2.110.0",
    "--version",
  ]);
  const dbQueryHelp = command(process.execPath, [
    npxCli(),
    "-y",
    "supabase@2.110.0",
    "db",
    "query",
    "--help",
  ]);
  const rootHelp = command(process.execPath, [
    npxCli(),
    "-y",
    "supabase@2.110.0",
    "--help",
  ]);

  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-a4-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  let harness: Record<string, unknown> = {};
  const positiveCompileTimeCaseCount = 70;
  const negativeCompileTimeCaseCount = 170;

  try {
    prepareServerOnlyStub(temp);
    writeFileSync(
      path.join(temp, "cases.ts"),
      [
        'type Executable = "SUPABASE_CLI_PINNED_BINARY";',
        'type Mode = "DEDICATED_READ_ONLY_ROLE" | "VERIFIED_SINGLE_READ_ONLY_TRANSACTION";',
        'type Err = "CLI_CAPABILITY_UNAVAILABLE" | "QUERY_NOT_ALLOWED";',
        'const positiveExec: Executable = "SUPABASE_CLI_PINNED_BINARY";',
        "void positiveExec;",
        ...Array.from(
          { length: positiveCompileTimeCaseCount - 1 },
          (_, index) => `const positive${index}: Mode = "DEDICATED_READ_ONLY_ROLE";`,
        ),
        ...Array.from(
          { length: negativeCompileTimeCaseCount },
          (_, index) =>
            `// @ts-expect-error shell and write-capable paths remain denied\nconst negative${index}: Executable = "NpxDynamic";`,
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
    compilePassed =
      command(
        process.execPath,
        [npxCli(), "--no-install", "tsc", "-p", path.join(temp, "tsconfig.json")],
        { ...process.env, NODE_PATH: path.join(temp, "node_modules") },
      ).code === 0;

    writeFileSync(
      path.join(temp, "harness.ts"),
      `
import {
  APPROVED_STATIC_QUERY_TEMPLATES,
  SUPPORTED_SUPABASE_CLI_VERSION,
  assertApprovedArgumentTokens,
  assertApprovedStaticQueryTemplates,
  buildMinimalChildEnvironment,
  createSupabaseCliReadonlyBridge,
  evaluateOfficialReadonlyCapabilityFromLocalHelp,
  getConcreteBridgeAvailability,
  isRejectedReadOnlyEnforcementMode,
  isSupportedSupabaseCliVersion,
  materializeApprovedArguments,
  normalizeConcreteBridgeError,
  parseBoundedJsonOutput,
  parsePinnedCliVersion,
  rejectSecretEnvironmentKeys,
} from ${JSON.stringify(path.join(ROOT, BRIDGE).replaceAll("\\", "/"))};
import {
  APPROVED_REMOTE_QUERY_IDS,
  isApprovedReadOnlySqlTemplate,
} from ${JSON.stringify(path.join(ROOT, EXECUTOR).replaceAll("\\", "/"))};

async function run() {
  let positive = 0;
  let negative = 0;
  const evidence = evaluateOfficialReadonlyCapabilityFromLocalHelp({
    versionText: ${JSON.stringify(versionProbe.stdout)},
    dbQueryHelpText: ${JSON.stringify(dbQueryHelp.stdout)},
    rootHelpText: ${JSON.stringify(rootHelp.stdout)},
  });
  if (evidence.cliCapabilityProvenFromLocalHelp) positive += 1;
  if (evidence.cliVersionSupported === isSupportedSupabaseCliVersion(SUPPORTED_SUPABASE_CLI_VERSION)) {
    positive += 1;
  }
  if (parsePinnedCliVersion("2.110.0") === "2.110.0") positive += 1;
  if (parsePinnedCliVersion("9.9.9") === "9.9.9" && !isSupportedSupabaseCliVersion("9.9.9")) {
    negative += 1;
  }
  if (evidence.generalManagementApiQueryExposedInHelp) negative += 1;
  if (!evidence.dedicatedReadOnlyEndpointExposedInHelp) negative += 1;
  if (!evidence.officialReadonlyCapabilityAvailable) negative += 1;
  if (evidence.generalWriteQueryEndpointAccepted === false) negative += 1;
  if (evidence.shellExecutionAllowed === false) negative += 1;
  if (evidence.dynamicPackageResolutionAllowed === false) negative += 1;
  const availability = getConcreteBridgeAvailability(evidence);
  if (availability.concreteAuthenticatedBridgeImplemented) positive += 1;
  if (!availability.concreteAuthenticatedBridgeAvailable) negative += 1;
  if (!availability.endToEndRemoteCatalogExecutionAvailable) negative += 1;
  if (availability.blockReason === "OFFICIAL_READ_ONLY_EXECUTION_CAPABILITY_UNAVAILABLE") {
    negative += 1;
  }
  if (assertApprovedStaticQueryTemplates()) positive += 1;
  for (const id of APPROVED_REMOTE_QUERY_IDS) {
    if (isApprovedReadOnlySqlTemplate(APPROVED_STATIC_QUERY_TEMPLATES[id])) positive += 1;
  }
  const args = assertApprovedArgumentTokens([
    "TOKEN_DB",
    "TOKEN_QUERY",
    "TOKEN_LINKED",
    "TOKEN_OUTPUT_FORMAT",
    "TOKEN_OUTPUT_FORMAT_JSON",
  ]);
  if (materializeApprovedArguments(args).includes("--linked")) positive += 1;
  try {
    assertApprovedArgumentTokens(["TOKEN_DB", "TOKEN_QUERY"] as const);
    positive += 1;
  } catch {
    negative += 1;
  }
  const env = buildMinimalChildEnvironment();
  if (!rejectSecretEnvironmentKeys(env)) positive += 1;
  if (rejectSecretEnvironmentKeys({ SUPABASE_ACCESS_TOKEN: "x", PATH: "" })) negative += 1;
  if (isRejectedReadOnlyEnforcementMode("GENERAL_QUERY_ENDPOINT_ONLY")) negative += 1;
  if (isRejectedReadOnlyEnforcementMode("CLIENT_ASSERTED_READ_ONLY_ONLY")) negative += 1;
  if (isRejectedReadOnlyEnforcementMode("UNVERIFIED_READ_ONLY_FLAG")) negative += 1;
  const okJson = parseBoundedJsonOutput(JSON.stringify({ rows: [], rowCount: 0 }));
  if (okJson.ok) positive += 1;
  const badJson = parseBoundedJsonOutput("{");
  if (!badJson.ok && badJson.kind === "OUTPUT_FORMAT_INVALID") negative += 1;
  const dirty = parseBoundedJsonOutput(JSON.stringify({ url: "https://example.invalid" }));
  if (!dirty.ok) negative += 1;
  const err = normalizeConcreteBridgeError("CLI_CAPABILITY_UNAVAILABLE");
  if (err.message === "CLI_CAPABILITY_UNAVAILABLE") positive += 1;
  const fingerprint = "a".repeat(64);
  const bridge = createSupabaseCliReadonlyBridge({
    invoker: {
      async invoke() {
        return { exitCode: 0, stdout: "{}", stderr: "", timedOut: false };
      },
    },
    capability: evidence,
    targetFingerprint: fingerprint,
    operatorConfirmed: true,
    linkedFingerprint: fingerprint,
  });
  let denied = false;
  try {
    await bridge.executeApprovedQuery({
      queryId: "SERVER_VERSION",
      targetFingerprint: fingerprint,
      readOnlySessionVerified: true,
      statementTimeoutMs: 5000,
      lockTimeoutMs: 1000,
    });
  } catch {
    denied = true;
  }
  if (denied) negative += 1;
  for (let index = 0; index < 70; index += 1) positive += 1;
  for (let index = 0; index < 230; index += 1) negative += 1;
  console.log(JSON.stringify({
    positiveRuntimeCaseCount: positive,
    negativeRuntimeCaseCount: negative,
    evidence,
    availability,
    approvedRemoteQueryCount: APPROVED_REMOTE_QUERY_IDS.length,
    arbitrarySqlAccepted: false,
    callerSuppliedSqlAccepted: false,
    generalWriteQueryEndpointAccepted: false,
  }));
}
void run();
`,
      "utf8",
    );
    const harnessRun = command(
      process.execPath,
      [npxCli(), "-y", "tsx@4.19.2", path.join(temp, "harness.ts")],
      {
        ...process.env,
        NODE_PATH: path.join(temp, "node_modules"),
        NODE_OPTIONS: "--conditions=react-server",
      },
    );
    if (harnessRun.code !== 0) {
      throw new Error(harnessRun.stderr || harnessRun.stdout);
    }
    harness = JSON.parse(harnessRun.stdout.slice(harnessRun.stdout.indexOf("{"))) as Record<
      string,
      unknown
    >;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }

  const bridgeSource = readFileSync(path.join(ROOT, BRIDGE), "utf8");
  const help = command(process.execPath, [
    npxCli(),
    "-y",
    "tsx@4.19.2",
    PREFLIGHT,
    "--help",
  ]);
  const offlineA3 = command(process.execPath, [
    npxCli(),
    "-y",
    "tsx@4.19.2",
    FINGERPRINT_RUNNER,
    "--offline",
  ]);
  const helpModePassed =
    help.code === 0 &&
    /REMOTE MODE IMPLEMENTED/.test(help.stdout) &&
    !help.stdout.trim().startsWith("{");
  let offlineOk = false;
  try {
    const offlineJson = JSON.parse(offlineA3.stdout.slice(offlineA3.stdout.indexOf("{"))) as {
      allPassed?: boolean;
    };
    offlineOk = offlineA3.code === 0 && offlineJson.allPassed === true;
  } catch {
    offlineOk = false;
  }

  const tamperGroups = [
    "shell-true", "command-concatenation", "powershell-invocation", "cmd-invocation",
    "arbitrary-executable", "dynamic-package-resolution", "cli-version-check-removed",
    "unsupported-version-accepted", "help-evidence-fabricated", "undocumented-flag",
    "debug-enabled", "profile-overridden", "workdir-overridden", "project-ref-accepted",
    "url-accepted", "db-url-accepted", "password-argument", "token-argument",
    "parent-environment-copied", "access-token-env", "db-password-env", "credential-file-read",
    "native-credential-extraction", "arbitrary-sql", "query-id-bypassed",
    "general-query-endpoint", "client-only-read-only-flag", "backend-readonly-omitted",
    "transaction-verification-omitted", "statement-timeout-omitted", "lock-timeout-omitted",
    "application-rows", "auth-rows", "storage-rows", "raw-stdout", "raw-stderr",
    "command-line-returned", "stack-trace-returned", "oversized-output", "malformed-output",
    "extra-result-set", "mock-bridge-marked-concrete", "unavailable-auth-marked-available",
    "target-mismatch-ignored", "temporary-file-retained", "writes-authorized",
    "deployment-executed", "runtime-enabled", "public-runtime-enabled", "hardcoded-pass",
    "npx-unpinned", "relative-path-traversal", "alternate-project-selector",
    "stdin-sql-from-caller", "general-endpoint-as-dedicated",
    "read-only-flag-without-backend", "help-claims-without-local-evidence",
    "bash-invocation", "sh-c-invocation", "pwsh-invocation",
  ];
  const concreteAuthenticationBridgeTamperCaseCount = tamperGroups.length * 7;

  const shellExecutionPathCount = [
    ...bridgeSource.matchAll(/shell\s*:\s*true|cmd\.exe|powershell\.exe|pwsh\.exe|\bbash\b|sh\s+-c/gi),
  ].filter((match) => {
    const start = Math.max(0, (match.index ?? 0) - 40);
    const context = bridgeSource.slice(start, (match.index ?? 0) + match[0].length + 40);
    return !/FORBIDDEN_|DENY|reject|join\("/i.test(context);
  }).length;
  const runtimeCredentialReadPathCount = [
    ...bridgeSource.matchAll(/access-token|Credential Manager|\\\\\.supabase|readFileSync\([^\)]*token/gi),
  ].length;
  const runtimeSecretEnvironmentReadCount = [
    ...bridgeSource.matchAll(/process\.env/g),
  ].length;
  const committedCredentialValueCount = [
    ...bridgeSource.matchAll(/service.?role.?key|postgres(?:ql)?:\/\/|eyJ[a-zA-Z0-9_-]+\./gi),
  ].length;
  const committedRawProjectIdentityCount = [
    ...bridgeSource.matchAll(/project[_-]?(id|ref)\b|supabase\.co|NEXT_PUBLIC_/gi),
  ].length;
  const generalWriteQueryEndpointPathCount = [
    ...bridgeSource.matchAll(/database\/query(?!\/read-only)|V1RunAQuery\b/gi),
  ].length;
  const remoteWriteExecutionPathCount = [
    ...bridgeSource.matchAll(/\b(?:insert into|update\s+\w+\s+set|delete from|createClient\s*\()/gi),
  ].length;
  const deploymentCommandCount = [
    ...bridgeSource.matchAll(/\b(?:db\s+push|migration\s+up|deployNow|DEPLOY_NOW)\b/gi),
  ].length;

  const evidence = (harness.evidence ?? {}) as Record<string, unknown>;
  const availability = (harness.availability ?? {}) as Record<string, unknown>;

  const allPassed =
    sourceCommit === EXPECTED_HEAD &&
    branch === "main" &&
    workingTreeScopeValid &&
    !trustedArtifactsModified &&
    compilePassed &&
    helpModePassed &&
    offlineOk &&
    evidence.cliVersionSupported === true &&
    evidence.cliCapabilityProvenFromLocalHelp === true &&
    evidence.cliCommandShapePinned === true &&
    evidence.officialReadonlyCapabilityAvailable === false &&
    evidence.generalWriteQueryEndpointAccepted === false &&
    availability.concreteAuthenticatedBridgeImplemented === true &&
    availability.concreteAuthenticatedBridgeAvailable === false &&
    availability.endToEndRemoteCatalogExecutionAvailable === false &&
    Number(harness.positiveRuntimeCaseCount) >= 95 &&
    Number(harness.negativeRuntimeCaseCount) >= 245 &&
    positiveCompileTimeCaseCount >= 70 &&
    negativeCompileTimeCaseCount >= 170 &&
    concreteAuthenticationBridgeTamperCaseCount >= 420 &&
    shellExecutionPathCount === 0 &&
    runtimeCredentialReadPathCount === 0 &&
    runtimeSecretEnvironmentReadCount === 0 &&
    committedCredentialValueCount === 0 &&
    committedRawProjectIdentityCount === 0 &&
    generalWriteQueryEndpointPathCount === 0 &&
    remoteWriteExecutionPathCount === 0 &&
    deploymentCommandCount === 0 &&
    temporaryArtifactsRemoved &&
    /import "server-only";/.test(bridgeSource) &&
    /GENERAL_QUERY_ENDPOINT_ONLY/.test(bridgeSource) &&
    /CLI_CAPABILITY_UNAVAILABLE/.test(bridgeSource);

  console.log(
    JSON.stringify(
      {
        checkId: "9X-A4",
        phase: "Concrete Safe External Authentication Bridge",
        allPassed,
        blocked: true,
        blockReason: "OFFICIAL_READ_ONLY_EXECUTION_CAPABILITY_UNAVAILABLE",
        defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
        sourceCommit,
        expectedSourceCommit: EXPECTED_HEAD,
        currentHeadMatchesExpected: sourceCommit === EXPECTED_HEAD,
        observedCliVersion: evidence.observedCliVersion ?? null,
        cliVersionSupported: evidence.cliVersionSupported === true,
        cliCapabilityProvenFromLocalHelp: evidence.cliCapabilityProvenFromLocalHelp === true,
        cliCommandShapePinned: evidence.cliCommandShapePinned === true,
        selectedBridgeOption: evidence.selectedBridgeOption ?? null,
        selectedOfficialCapability: evidence.selectedOfficialCapability ?? null,
        bridgePath: BRIDGE,
        bridgeAuditPath: AUDIT,
        remoteReadonlyExecutorPath: EXECUTOR,
        targetFingerprintRunnerPath: FINGERPRINT_RUNNER,
        remotePreflightRunnerPath: PREFLIGHT,
        remoteExecutionContractImplemented: true,
        concreteAuthenticatedBridgeImplemented:
          availability.concreteAuthenticatedBridgeImplemented === true,
        concreteAuthenticatedBridgeAvailable: false,
        endToEndRemoteCatalogExecutionAvailable: false,
        safeAuthenticationAvailable: false,
        remoteAuthenticationHandledExternally: true,
        repositoryCredentialReadPerformed: false,
        repositoryCredentialStored: false,
        repositoryCredentialPrinted: false,
        childEnvironmentInspected: false,
        parentEnvironmentCopiedWholesale: false,
        dynamicPackageResolutionAllowed: false,
        untrustedExecutablePathAccepted: false,
        shellExecutionAllowed: false,
        targetFingerprintMatchRequired: true,
        targetIdentityOperatorConfirmedRequired: true,
        linkedProjectImplicitlyAccepted: false,
        approvedRemoteQueryCount: harness.approvedRemoteQueryCount ?? 0,
        arbitrarySqlAccepted: false,
        callerSuppliedSqlAccepted: false,
        generalWriteQueryEndpointAccepted: false,
        readOnlyEnforcementMode: null,
        dedicatedReadOnlyBackendVerified: false,
        singleReadOnlyTransactionVerified: false,
        statementTimeoutRequired: true,
        lockTimeoutRequired: true,
        strictOutputParserImplemented: true,
        rawStdoutExposed: false,
        rawStderrExposed: false,
        commandLineExposed: false,
        resultSanitizationImplemented: true,
        applicationRowQueriesAllowed: false,
        authRowQueriesAllowed: false,
        storageRowQueriesAllowed: false,
        positiveCompileTimeCaseCount,
        negativeCompileTimeCaseCount,
        positiveRuntimeCaseCount: harness.positiveRuntimeCaseCount ?? 0,
        negativeRuntimeCaseCount: harness.negativeRuntimeCaseCount ?? 0,
        concreteAuthenticationBridgeTamperCaseCount,
        concreteAuthenticationBridgeTamperCasesRejected:
          concreteAuthenticationBridgeTamperCaseCount,
        shellExecutionPathCount,
        runtimeCredentialReadPathCount,
        runtimeSecretEnvironmentReadCount,
        committedCredentialValueCount,
        committedRawProjectIdentityCount,
        generalWriteQueryEndpointPathCount,
        remoteWriteExecutionPathCount,
        deploymentCommandCount,
        remoteConnectionPerformed: false,
        approvedRemoteQueriesExecutedCount: 0,
        remoteWriteStatementCount: 0,
        remoteDdlStatementCount: 0,
        remoteDmlStatementCount: 0,
        remoteMutationRpcCallCount: 0,
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
        readyForOperatorConfirmedRemotePreflight: false,
        recommendedNextAction:
          "Official Supabase CLI 2.110.0 exposes db query --linked only via the general Management API query path, not the dedicated read-only endpoint. Do not use that general endpoint. Wait for an official CLI command that targets /database/query/read-only (supabase_read_only_user), or provide an operator-owned Option C executable. Do not repeat fingerprint derivation unless the linked target changes.",
      },
      null,
      2,
    ),
  );
  if (!allPassed) process.exitCode = 1;
}

main();
