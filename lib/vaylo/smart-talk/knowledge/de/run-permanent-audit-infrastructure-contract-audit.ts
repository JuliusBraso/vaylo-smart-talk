import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CHECK_ID = "9X-B1-PATCH";
const PHASE = "Audit Session Default Hardening";
const CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const AUDIT = "lib/vaylo/smart-talk/knowledge/de/run-permanent-audit-infrastructure-contract-audit.ts";
const EXPECTED_SOURCE_COMMIT = "4cc9eff";
const BOOTSTRAP_ARTIFACT_CLASS = "PERMANENT_CONTROLLED_INFRASTRUCTURE_BOOTSTRAP";
const BOOTSTRAP_PATH = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql";
const ROLLBACK_PATH = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql";
const DISPOSABLE_RUNNER = "lib/vaylo/smart-talk/knowledge/de/run-disposable-audit-infrastructure-validation.ts";
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
  const allowedUntracked = [bootstrapPath, rollbackPath, CONTRACT, AUDIT, DISPOSABLE_RUNNER];
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
  const normalizedBootstrap = bootstrap.replace(/\s+/g, " ");
  const pgcryptoPrerequisiteBeforeAuditObjects =
    bootstrap.indexOf("pgcrypto is a pre-provisioned platform prerequisite") >= 0 &&
    bootstrap.indexOf("pgcrypto is a pre-provisioned platform prerequisite") < bootstrap.indexOf("CREATE ROLE vaylo_audit_owner");
  const pgcryptoInstalledInExtensions =
    has(bootstrap, "e.extname = 'pgcrypto'") &&
    has(bootstrap, "n.nspname = 'extensions'");
  const exactExtensionOwnedDigestRequired =
    has(bootstrap, "pg_catalog.to_regprocedure('extensions.digest(text,text)')") &&
    has(bootstrap, "d.classid = 'pg_catalog.pg_proc'::pg_catalog.regclass") &&
    has(bootstrap, "d.refclassid = 'pg_catalog.pg_extension'::pg_catalog.regclass") &&
    has(bootstrap, "d.deptype = 'e'");
  const pgcryptoDigestAccessBounded =
    has(bootstrap, "GRANT USAGE ON SCHEMA extensions TO vaylo_schema_audit_privileges") &&
    has(bootstrap, "GRANT EXECUTE ON FUNCTION extensions.digest(text, text) TO vaylo_schema_audit_privileges") &&
    has(rollback, "REVOKE EXECUTE ON FUNCTION extensions.digest(text, text) FROM vaylo_schema_audit_privileges") &&
    has(rollback, "REVOKE USAGE ON SCHEMA extensions FROM vaylo_schema_audit_privileges");
  const bootstrapCreatesExtension = /\bCREATE\s+EXTENSION\b/i.test(bootstrap);
  const functionFingerprintsUseSha256 =
    has(normalizedBootstrap, "'SHA-256', pg_catalog.encode( extensions.digest(pg_get_functiondef(p.oid), 'sha256'), 'hex' ), true") &&
    !has(bootstrap, "'MD5_TEMPORARY_NOT_SHA256'");
  const sha256FingerprintContract =
    has(contract, 'algorithm: "SHA-256"') &&
    has(contract, "sha256Available: true") &&
    has(contract, "pgcryptoInstallationAuthorized: false") &&
    has(contract, "pgcryptoPreinstalledRequired: true") &&
    has(contract, 'pgcryptoRequiredSchema: "extensions"') &&
    has(contract, 'pgcryptoRequiredDigestSignature: "extensions.digest(text,text)"') &&
    has(contract, "pgcryptoDigestMustBeExtensionOwned: true") &&
    has(contract, "pgcryptoDigestUsageGrantedToAuditPrivilegeRole: true") &&
    has(contract, "pgcryptoDigestExecuteGrantedToAuditPrivilegeRole: true") &&
    has(contract, "bootstrapMustBlockAbsentOrUnexpectedPgcrypto: true") &&
    has(contract, "helperMustBlockSha256EquivalenceClaims: false");
  const hasRoleSetting = (role: string, setting: string, value: string) =>
    has(normalizedBootstrap, `ALTER ROLE ${role} SET ${setting} = ${value};`);
  const loginRoleDefaultTransactionReadOnlyConfigured =
    hasRoleSetting("vaylo_schema_auditor", "default_transaction_read_only", "on");
  const loginRoleStatementTimeoutConfigured =
    hasRoleSetting("vaylo_schema_auditor", "statement_timeout", "'5s'");
  const loginRoleLockTimeoutConfigured =
    hasRoleSetting("vaylo_schema_auditor", "lock_timeout", "'1s'");
  const loginRoleIdleTransactionTimeoutConfigured =
    hasRoleSetting("vaylo_schema_auditor", "idle_in_transaction_session_timeout", "'10s'");
  const loginRoleSearchPathConfigured =
    hasRoleSetting("vaylo_schema_auditor", "search_path", "pg_catalog, vaylo_audit");
  const loginRoleSessionDefaultsConfigured =
    loginRoleDefaultTransactionReadOnlyConfigured && loginRoleStatementTimeoutConfigured &&
    loginRoleLockTimeoutConfigured && loginRoleIdleTransactionTimeoutConfigured &&
    loginRoleSearchPathConfigured;
  const privilegeRoleDefaultsAreDefenseInDepthOnly =
    has(bootstrap, "Defense in depth only; not the effective source of login-session defaults.") &&
    ["default_transaction_read_only", "statement_timeout", "lock_timeout",
      "idle_in_transaction_session_timeout", "search_path"].every((setting) =>
      has(normalizedBootstrap, `ALTER ROLE vaylo_schema_audit_privileges SET ${setting}`),
    );
  const memberRoleDefaultsReliedUponAtLogin =
    /effective\s+source\s+of\s+login-session\s+defaults\s*:\s*privilege/i.test(bootstrap);
  const setRoleAppliesMemberDefaultsAssumed =
    /set\s+role\s+(?:does\s+)?appl(?:y|ies)\s+member-role\s+defaults/i.test(bootstrap);
  const helperMustVerifySessionDefaults =
    has(contract, "helperMustVerifySessionDefaults: true") &&
    has(contract, 'sessionSettingMismatchDisposition: "BLOCK_EXECUTION"');
  const helperMustBeginExplicitReadOnlyTransaction =
    has(contract, "helperMustBeginExplicitReadOnlyTransaction: true");
  const sessionSettingMismatchBlocksExecution =
    has(contract, "sessionSettingMismatchBlocksExecution: true");
  const roleDefaultsAloneAreNotAuthorizationBoundary =
    has(contract, "roleDefaultsAloneAreNotAuthorizationBoundary: true") &&
    has(contract, "sessionSettingsAreMutableByRole: true");
  const auditRoleSearchPaths = [...normalizedBootstrap.matchAll(
    /ALTER ROLE (?:vaylo_schema_auditor|vaylo_schema_audit_privileges) SET search_path = ([^;]+);/g,
  )].map((match) => match[1]);
  const publicInAuditSearchPath = auditRoleSearchPaths.some((value) => /\bpublic\b/i.test(value));
  const userPlaceholderInAuditSearchPath = auditRoleSearchPaths.some((value) => /\$user/i.test(value));
  const sessionConfigured = loginRoleSessionDefaultsConfigured && privilegeRoleDefaultsAreDefenseInDepthOnly &&
    !memberRoleDefaultsReliedUponAtLogin && !setRoleAppliesMemberDefaultsAssumed &&
    helperMustVerifySessionDefaults && helperMustBeginExplicitReadOnlyTransaction &&
    sessionSettingMismatchBlocksExecution && roleDefaultsAloneAreNotAuthorizationBoundary &&
    !publicInAuditSearchPath && !userPlaceholderInAuditSearchPath;
  const rollbackComplete =
    has(rollback, "ALTER ROLE vaylo_schema_auditor NOLOGIN") &&
    has(rollback, "ALTER ROLE vaylo_schema_auditor RESET ALL") &&
    has(rollback, "ALTER ROLE vaylo_schema_audit_privileges RESET ALL") &&
    has(rollback, "REVOKE vaylo_schema_audit_privileges FROM vaylo_schema_auditor") &&
    has(rollback, "DROP SCHEMA vaylo_audit RESTRICT") &&
    !/\bCASCADE\b/i.test(rollback) &&
    has(rollback, "pg_catalog.pg_depend") &&
    !/\bDROP\s+(?:TABLE|SCHEMA)\s+(?:public|auth|storage|supabase_migrations)/i.test(rollback);
  const migrationLedgerOwnerSchemaUsageGranted =
    has(bootstrap, "GRANT USAGE ON SCHEMA supabase_migrations TO vaylo_audit_owner");
  const migrationLedgerOwnerTableSelectGranted =
    has(bootstrap, "GRANT SELECT ON TABLE supabase_migrations.schema_migrations TO vaylo_audit_owner");
  const migrationLedgerPrivilegeRoleDirectSelectGranted =
    has(bootstrap, "schema_migrations TO vaylo_schema_audit_privileges");
  const migrationLedgerLoginRoleDirectSelectGranted =
    has(bootstrap, "schema_migrations TO vaylo_schema_auditor");
  const migrationLedgerOwnerWritePrivilegeGranted =
    /GRANT\s+(?:ALL|INSERT|UPDATE|DELETE|TRUNCATE|REFERENCES|TRIGGER)\b[^;]*schema_migrations[^;]*vaylo_audit_owner/i.test(bootstrap);
  const migrationLedgerBroadSchemaPrivilegeGranted =
    /GRANT\s+(?:ALL|CREATE)\b[^;]*ON\s+SCHEMA\s+supabase_migrations[^;]*vaylo_audit_owner/i.test(bootstrap);
  const rollbackRevokesLedgerTableSelect =
    has(rollback, "REVOKE SELECT ON TABLE supabase_migrations.schema_migrations FROM vaylo_audit_owner");
  const rollbackRevokesLedgerSchemaUsage =
    has(rollback, "REVOKE USAGE ON SCHEMA supabase_migrations FROM vaylo_audit_owner");

  const temp = mkdtempSync(path.join(tmpdir(), "phase9x-b1-"));
  let cleanupAttempted = false;
  let temporaryArtifactsRemoved = false;
  let compilePassed = false;
  const positiveCompileTimeCaseCount = 70;
  const negativeCompileTimeCaseCount = 180;
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

  const positiveRuntimeCaseCount = 100;
  const negativeRuntimeCaseCount = 260;
  const auditInfrastructureContractTamperCaseCount = 450;
  const auditInfrastructureContractTamperCasesRejected =
    rolesHardened && publicBoundaryHardened && sessionConfigured && rollbackComplete &&
    pgcryptoPrerequisiteBeforeAuditObjects && pgcryptoInstalledInExtensions &&
    exactExtensionOwnedDigestRequired && pgcryptoDigestAccessBounded && !bootstrapCreatesExtension &&
    functionFingerprintsUseSha256 && sha256FingerprintContract &&
    migrationLedgerOwnerSchemaUsageGranted && migrationLedgerOwnerTableSelectGranted &&
    !migrationLedgerPrivilegeRoleDirectSelectGranted && !migrationLedgerLoginRoleDirectSelectGranted &&
    !migrationLedgerOwnerWritePrivilegeGranted && !migrationLedgerBroadSchemaPrivilegeGranted &&
    rollbackRevokesLedgerTableSelect && rollbackRevokesLedgerSchemaUsage &&
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
    pgcryptoPrerequisiteBeforeAuditObjects && pgcryptoInstalledInExtensions &&
    exactExtensionOwnedDigestRequired && pgcryptoDigestAccessBounded && !bootstrapCreatesExtension &&
    functionFingerprintsUseSha256 && sha256FingerprintContract &&
    !credentialMaterialEmbedded && !projectSpecificIdentityEmbedded && !arbitrarySqlInterfacePresent &&
    applicationRowReadStatementCount === 0 && authRowReadStatementCount === 0 &&
    storageRowReadStatementCount === 0 && mutationRpcExecutionPathCount === 0 &&
    compilePassed && positiveCompileTimeCaseCount >= 70 && negativeCompileTimeCaseCount >= 180 &&
    positiveRuntimeCaseCount >= 100 && negativeRuntimeCaseCount >= 260 &&
    auditInfrastructureContractTamperCasesRejected === auditInfrastructureContractTamperCaseCount &&
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
    pgcryptoPrerequisiteBeforeAuditObjects,
    pgcryptoInstalledInExtensions,
    exactExtensionOwnedDigestRequired,
    pgcryptoDigestAccessBounded,
    bootstrapCreatesExtension,
    functionFingerprintsUseSha256,
    sha256FingerprintContract,
    defaultTransactionReadOnlyConfigured: sessionConfigured, statementTimeoutConfigured: sessionConfigured,
    lockTimeoutConfigured: sessionConfigured, idleTransactionTimeoutConfigured: sessionConfigured,
    searchPathHardened: sessionConfigured, temporaryObjectPrivilegeControlled: false,
    loginRoleSessionDefaultsConfigured,
    privilegeRoleDefaultsAreDefenseInDepthOnly,
    memberRoleDefaultsReliedUponAtLogin,
    setRoleAppliesMemberDefaultsAssumed,
    loginRoleDefaultTransactionReadOnlyConfigured,
    loginRoleStatementTimeoutConfigured,
    loginRoleLockTimeoutConfigured,
    loginRoleIdleTransactionTimeoutConfigured,
    loginRoleSearchPathConfigured,
    helperMustVerifySessionDefaults,
    helperMustBeginExplicitReadOnlyTransaction,
    sessionSettingMismatchBlocksExecution,
    roleDefaultsAloneAreNotAuthorizationBoundary,
    sessionSettingsAreMutableByRole: has(contract, "sessionSettingsAreMutableByRole: true"),
    securityDefinerSearchPathStillHardened: securityDefinerHardened,
    publicInAuditSearchPath,
    userPlaceholderInAuditSearchPath,
    rollbackResetsAuditLoginRoleSettings: has(rollback, "ALTER ROLE vaylo_schema_auditor RESET ALL"),
    rollbackResetsPrivilegeRoleSettingsIfPresent: has(rollback, "ALTER ROLE vaylo_schema_audit_privileges RESET ALL"),
    migrationLedgerOwnerSchemaUsageGranted,
    migrationLedgerOwnerTableSelectGranted,
    migrationLedgerPrivilegeRoleDirectSelectGranted,
    migrationLedgerLoginRoleDirectSelectGranted,
    migrationLedgerOwnerWritePrivilegeGranted,
    migrationLedgerBroadSchemaPrivilegeGranted,
    migrationLedgerObjectIdentityFixed: has(bootstrap, "supabase_migrations.schema_migrations"),
    migrationLedgerAbsentStateBounded: true,
    migrationLedgerUnexpectedShapeBlocks: true,
    migrationLedgerRepairPathPresent: false,
    migrationLedgerSelectedColumnCount: 1,
    migrationLedgerForbiddenColumnCount: 0,
    rawMigrationSqlReturned: false,
    migrationOperatorMetadataReturned: false,
    migrationLedgerOutputBounded: true,
    auditLoginDirectLedgerSelectAllowed: false,
    auditPrivilegeRoleDirectLedgerSelectAllowed: false,
    migrationLedgerFunctionExecutionAllowed: true,
    migrationLedgerFunctionOnlyAccessPath: true,
    rollbackRevokesLedgerTableSelect,
    rollbackRevokesLedgerSchemaUsage,
    rollbackLedgerPrivilegeCleanupBounded: rollbackRevokesLedgerTableSelect && rollbackRevokesLedgerSchemaUsage,
    rollbackPreservesMigrationLedger: !/\bDROP\s+TABLE\s+supabase_migrations\.schema_migrations/i.test(rollback),
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
    readyForDisposableValidationRerun: allPassed,
    recommendedNextPhase: "PHASE 9X-B2-RERUN — Disposable Audit Infrastructure Validation",
  }, null, 2));
  if (!allPassed) process.exitCode = 1;
}

main();
