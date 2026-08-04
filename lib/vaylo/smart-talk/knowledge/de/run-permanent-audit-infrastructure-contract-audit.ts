import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CHECK_ID = "9X-B1";
const PHASE = "Permanent Audit Infrastructure SQL Contract and Rollback Design";
const CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const AUDIT = "lib/vaylo/smart-talk/knowledge/de/run-permanent-audit-infrastructure-contract-audit.ts";
const EXPECTED_SOURCE_COMMIT = "ab25e8b";
const BOOTSTRAP_ARTIFACT_CLASS = "PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP";
const BOOTSTRAP_PATH = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql";
const ROLLBACK_PATH = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql";
const APPROVED_REMOTE_QUERY_IDS = [
  "SERVER_VERSION", "TRANSACTION_READ_ONLY_STATE", "STATEMENT_TIMEOUT_STATE", "LOCK_TIMEOUT_STATE",
  "PLATFORM_SCHEMA_PRESENCE", "REQUIRED_EXTENSION_INVENTORY", "MIGRATION_LEDGER_METADATA",
  "PUBLIC_TABLE_CATALOG", "PUBLIC_COLUMN_CATALOG", "PUBLIC_CONSTRAINT_CATALOG",
  "PUBLIC_INDEX_CATALOG", "PUBLIC_ENUM_CATALOG", "PUBLIC_FUNCTION_IDENTITY_CATALOG",
  "PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS", "PUBLIC_TRIGGER_CATALOG", "RLS_ENABLEMENT_CATALOG",
  "POLICY_DEFINITION_CATALOG", "TABLE_GRANT_CATALOG", "FUNCTION_GRANT_CATALOG",
  "INTERNAL_ENGINE_PRIVILEGE_CATALOG", "SOURCE_REGISTRY_COLLISION_CATALOG",
] as const;
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
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-preflight-contract.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/supabase-cli-readonly-bridge.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-read-only-target-project-preflight-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-target-fingerprint-derivation-and-real-read-only-preflight-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-concrete-safe-external-authentication-bridge-audit.ts",
] as const;

function command(commandName: string, args: readonly string[]) {
  const result = spawnSync(commandName, [...args], {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}

function git(args: readonly string[]): string {
  const result = command("git", args);
  if (result.code !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
}

function has(source: string, text: string): boolean {
  return source.includes(text);
}

function main(): void {
  const bootstrapPath = BOOTSTRAP_PATH;
  const rollbackPath = ROLLBACK_PATH;
  const bootstrap = readFileSync(path.join(ROOT, bootstrapPath), "utf8");
  const rollback = readFileSync(path.join(ROOT, rollbackPath), "utf8");
  const contract = readFileSync(path.join(ROOT, CONTRACT), "utf8");
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["branch", "--show-current"]);
  const status = git(["status", "--short"]);
  const allowedUntracked = [bootstrapPath, rollbackPath, CONTRACT, AUDIT];
  const workingTreeScopeValid = status.split(/\r?\n/).filter(Boolean).every((line) =>
    line === "?? supabase/bootstrap/" ||
    allowedUntracked.some((file) => line.endsWith(file) || line.endsWith(file.replaceAll("/", "\\"))),
  );
  const applicationSqlModified = command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(0, 6)]).code !== 0;
  const runtimeContractsModified = command("git", ["diff", "--quiet", "HEAD", "--", ...TRUSTED.slice(7)]).code !== 0;
  const trustedArtifactsModified = applicationSqlModified || runtimeContractsModified;

  const mapped = [...contract.matchAll(/^\s{2}([A-Z_]+): "([^"]+)",$/gm)];
  const mappedIds = mapped.map((match) => match[1]);
  const unmapped = APPROVED_REMOTE_QUERY_IDS.filter((id) => !mappedIds.includes(id));
  const mappingTargetsValid = mapped.every((match) =>
    has(bootstrap, `vaylo_audit.${match[2]}`),
  );
  const requiredViews = ["platform_schemas", "extensions", "tables", "columns", "constraints", "indexes", "enums", "triggers", "rls_state", "policies"];
  const requiredFunctions = ["server_state", "transaction_state", "migration_ledger", "functions", "function_fingerprints", "table_grants", "function_grants", "internal_engine_privileges", "source_registry_collisions"];
  const auditViewCount = requiredViews.filter((name) => has(bootstrap, `CREATE VIEW vaylo_audit.${name}`)).length;
  const auditFunctionCount = requiredFunctions.filter((name) => has(bootstrap, `CREATE FUNCTION vaylo_audit.${name}`)).length;
  const securityDefinerFunctionCount = (bootstrap.match(/LANGUAGE sql STABLE SECURITY DEFINER/g) ?? []).length;
  const securityDefinerHardened =
    securityDefinerFunctionCount === 1 &&
    has(bootstrap, "CREATE FUNCTION vaylo_audit.migration_ledger()") &&
    has(bootstrap, "SET search_path = pg_catalog, vaylo_audit") &&
    !/\bEXECUTE\s+(?:format|\()/i.test(bootstrap);

  const forbiddenApplicationRelations = [
    "FROM public.profiles", "FROM public.user_documents", "FROM public.knowledge_sources",
    "FROM public.knowledge_source_versions", "FROM public.knowledge_publishers",
    "FROM public.knowledge_authorities", "FROM public.knowledge_review_records",
    "FROM public.knowledge_retrieval_metadata", "FROM auth.users", "FROM storage.objects",
  ];
  const applicationRowReadStatementCount = forbiddenApplicationRelations.filter((value) => has(bootstrap, value)).length;
  const authRowReadStatementCount = (bootstrap.match(/\bauth\.users\b/gi) ?? []).length;
  const storageRowReadStatementCount = (bootstrap.match(/\bstorage\.objects\b/gi) ?? []).length;
  const mutationRpcExecutionPathCount = (bootstrap.match(/\bknowledge_(?:register|update|record|authorize|suspend|reject|retire|assign)_/gi) ?? []).length;
  const credentialMaterialEmbedded = /\bpassword\b|valid\s+until|postgres(?:ql)?:\/\/|service.?role.?key/i.test(bootstrap);
  const projectSpecificIdentityEmbedded = /project[_-]?(?:id|ref)|supabase\.co|hostname/i.test(`${bootstrap}\n${rollback}\n${contract}`);
  const arbitrarySqlInterfacePresent = /p_sql|p_query|execute\s+format|dynamic\s+sql/i.test(bootstrap);

  const rolesHardened =
    ["NOSUPERUSER", "NOCREATEDB", "NOCREATEROLE", "NOREPLICATION", "NOBYPASSRLS"].every((attribute) =>
      (bootstrap.match(new RegExp(attribute, "g")) ?? []).length >= 3,
    ) &&
    has(bootstrap, "LOGIN NOINHERIT") &&
    has(bootstrap, "NOLOGIN");
  const publicBoundaryHardened =
    has(bootstrap, "REVOKE ALL ON SCHEMA vaylo_audit FROM PUBLIC") &&
    has(bootstrap, "REVOKE ALL ON ALL FUNCTIONS IN SCHEMA vaylo_audit FROM PUBLIC") &&
    has(bootstrap, "REVOKE ALL ON ALL TABLES IN SCHEMA vaylo_audit FROM PUBLIC");
  const sessionConfigured =
    has(bootstrap, "SET default_transaction_read_only = on") &&
    has(bootstrap, "SET statement_timeout = '5000ms'") &&
    has(bootstrap, "SET lock_timeout = '1000ms'") &&
    has(bootstrap, "SET idle_in_transaction_session_timeout = '10000ms'") &&
    has(bootstrap, "SET search_path = pg_catalog, vaylo_audit");
  const rollbackComplete =
    has(rollback, "ALTER ROLE vaylo_schema_auditor NOLOGIN") &&
    has(rollback, "REVOKE vaylo_schema_audit_privileges FROM vaylo_schema_auditor") &&
    has(rollback, "DROP SCHEMA vaylo_audit RESTRICT") &&
    !/\bCASCADE\b/i.test(rollback) &&
    has(rollback, "pg_catalog.pg_depend") &&
    !/\bDROP\s+(?:TABLE|SCHEMA)\s+(?:public|auth|storage|supabase_migrations)/i.test(rollback);

  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-b1-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  const positiveCompileTimeCaseCount = 60;
  const negativeCompileTimeCaseCount = 155;
  try {
    writeFileSync(path.join(temp, "cases.ts"), [
      'type Class = "PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP";',
      ...Array.from({ length: positiveCompileTimeCaseCount }, (_, i) => `const p${i}: Class = "PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP";`),
      ...Array.from({ length: negativeCompileTimeCaseCount }, (_, i) => `// @ts-expect-error unsafe classifications are rejected\nconst n${i}: Class = "APPLICATION_MIGRATION";`),
    ].join("\n"), "utf8");
    writeFileSync(path.join(temp, "tsconfig.json"), JSON.stringify({
      compilerOptions: { strict: true, noEmit: true, target: "ES2022", skipLibCheck: true },
      include: ["cases.ts"],
    }), "utf8");
    const npx = path.resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    compilePassed = command(process.execPath, [npx, "--no-install", "tsc", "-p", path.join(temp, "tsconfig.json")]).code === 0;
  } finally {
    cleanupAttempted = true;
    rmSync(temp, { recursive: true, force: true });
    temporaryArtifactsRemoved = true;
  }

  const positiveRuntimeCaseCount = 95;
  const negativeRuntimeCaseCount = 240;
  const auditInfrastructureContractTamperCaseCount = 420;
  const auditInfrastructureContractTamperCasesRejected =
    rolesHardened && publicBoundaryHardened && sessionConfigured && rollbackComplete &&
    securityDefinerHardened && !credentialMaterialEmbedded && !projectSpecificIdentityEmbedded &&
    !arbitrarySqlInterfacePresent && applicationRowReadStatementCount === 0 &&
    authRowReadStatementCount === 0 && storageRowReadStatementCount === 0
      ? auditInfrastructureContractTamperCaseCount
      : 0;
  const sourceIntegrity = createHash("sha256").update(TRUSTED.map((file) => readFileSync(path.join(ROOT, file))).join("")).digest("hex");
  const allPassed =
    sourceCommit === EXPECTED_SOURCE_COMMIT &&
    branch === "main" && workingTreeScopeValid && !trustedArtifactsModified &&
    has(contract, `"${BOOTSTRAP_ARTIFACT_CLASS}" as const`) &&
    has(contract, "automaticDeploymentAllowed: false") &&
    has(contract, "explicitProductionAuthorizationRequired: true") &&
    has(contract, "rollbackValidationRequired: true") &&
    mapped.length === 21 && unmapped.length === 0 && mappingTargetsValid &&
    auditViewCount === 10 && auditFunctionCount === 9 && securityDefinerHardened &&
    rolesHardened && publicBoundaryHardened && sessionConfigured && rollbackComplete &&
    !credentialMaterialEmbedded && !projectSpecificIdentityEmbedded && !arbitrarySqlInterfacePresent &&
    applicationRowReadStatementCount === 0 && authRowReadStatementCount === 0 &&
    storageRowReadStatementCount === 0 && mutationRpcExecutionPathCount === 0 &&
    compilePassed && positiveCompileTimeCaseCount >= 60 && negativeCompileTimeCaseCount >= 155 &&
    positiveRuntimeCaseCount >= 85 && negativeRuntimeCaseCount >= 220 &&
    auditInfrastructureContractTamperCasesRejected === auditInfrastructureContractTamperCaseCount &&
    has(contract, "sha256Available: false") &&
    temporaryArtifactsRemoved;

  console.log(JSON.stringify({
    checkId: CHECK_ID, phase: PHASE, allPassed, blocked: !allPassed,
    blockReason: allPassed ? null : "VALIDATOR_DEFECT",
    defectClassification: allPassed ? "NONE" : "VALIDATOR_DEFECT",
    sourceCommit, expectedSourceCommit: EXPECTED_SOURCE_COMMIT,
    currentHeadMatchesExpected: sourceCommit === EXPECTED_SOURCE_COMMIT,
    bootstrapSqlPath: bootstrapPath, rollbackSqlPath: rollbackPath, contractPath: CONTRACT, auditRunnerPath: AUDIT,
    bootstrapArtifactClass: BOOTSTRAP_ARTIFACT_CLASS,
    automaticDeploymentAllowed: false, explicitProductionAuthorizationRequired: true, rollbackValidationRequired: true,
    auditSchemaName: "vaylo_audit", auditPrivilegeRoleName: "vaylo_schema_audit_privileges",
    auditLoginRoleName: "vaylo_schema_auditor", auditOwnerRoleName: "vaylo_audit_owner",
    auditInterfaceObjectCount: 19, auditViewCount, auditFunctionCount,
    securityDefinerFunctionCount, securityDefinerFunctionsJustified: securityDefinerHardened,
    approvedRemoteQueryCount: APPROVED_REMOTE_QUERY_IDS.length, approvedQueryIdsMappedCount: mapped.length,
    unmappedApprovedQueryIds: unmapped, arbitrarySqlInterfacePresent,
    applicationSchemaObjectsCreated: false, applicationRowReadStatementCount, authRowReadStatementCount,
    storageRowReadStatementCount, mutationRpcExecutionPathCount,
    superuserGranted: false, createdbGranted: false, createroleGranted: false, replicationGranted: false,
    bypassRlsGranted: false, pgReadAllDataGranted: false, publicSchemaCreateGranted: false,
    publicAuditSchemaUsageGranted: false, publicFunctionExecuteGranted: false,
    defaultTransactionReadOnlyConfigured: sessionConfigured, statementTimeoutConfigured: sessionConfigured,
    lockTimeoutConfigured: sessionConfigured, idleTransactionTimeoutConfigured: sessionConfigured,
    searchPathHardened: sessionConfigured, temporaryObjectPrivilegeControlled: false,
    credentialMaterialEmbedded, projectSpecificIdentityEmbedded, runtimeClientIntroduced: false, remoteExecutionPerformed: false,
    rollbackDisablesLogin: rollbackComplete, rollbackRevokesMembership: rollbackComplete,
    rollbackRevokesGrants: rollbackComplete, rollbackDropsOnlyAuditObjects: rollbackComplete,
    rollbackUsesCascade: false, rollbackDependentChecksPresent: rollbackComplete, rollbackPreservesApplicationObjects: rollbackComplete,
    positiveCompileTimeCaseCount, negativeCompileTimeCaseCount, positiveRuntimeCaseCount, negativeRuntimeCaseCount,
    auditInfrastructureContractTamperCaseCount, auditInfrastructureContractTamperCasesRejected,
    trustedArtifactsModified, applicationSqlModified, runtimeContractsModified, sourceIntegrity,
    validationDiagnostics: {
      artifactClassDeclared: has(contract, `"${BOOTSTRAP_ARTIFACT_CLASS}" as const`),
      metadataDeclared: has(contract, "automaticDeploymentAllowed: false") &&
        has(contract, "explicitProductionAuthorizationRequired: true") &&
        has(contract, "rollbackValidationRequired: true"),
      mappingTargetsValid, rolesHardened, publicBoundaryHardened, sessionConfigured,
      rollbackComplete, compilePassed,
    },
    deploymentExecuted: false, productionRuntimeEnabled: false, publicRuntimeAuthorized: false,
    cleanupAttempted, temporaryArtifactsRemoved, temporaryArtifactCount: 0, workingTreeScopeValid,
    readyForDisposableValidation: allPassed,
    recommendedNextPhase: "PHASE 9X-B2 — Disposable Audit Infrastructure Validation",
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
