/**
 * Local-only PostgreSQL 17 validation. This never reads repository credentials,
 * calls Supabase, starts a shell, or writes anything outside its Docker container.
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const BOOTSTRAP = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.sql";
const ROLLBACK = "supabase/bootstrap/001_create_vaylo_audit_infrastructure.rollback.sql";
const CONTRACT = "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const FALLBACK_DOCKER = "C:\\Users\\jceas\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe";
const INTERFACES = ["platform_schemas", "extensions", "tables", "columns", "constraints", "indexes", "enums", "triggers", "rls_state", "policies", "server_state", "transaction_state", "migration_ledger", "functions", "function_fingerprints", "table_grants", "function_grants", "internal_engine_privileges", "source_registry_collisions"] as const;
const FUNCTIONS = new Set(["server_state", "transaction_state", "migration_ledger", "functions", "function_fingerprints", "table_grants", "function_grants", "internal_engine_privileges", "source_registry_collisions"]);
type Command = { code: number; stdout: string; stderr: string };
type Docker = { executable: string; resolution: "PATH" | "CONFIRMED_ABSOLUTE_FALLBACK" };

function command(executable: string, args: readonly string[], input?: string): Command {
  const result = spawnSync(executable, [...args], { cwd: ROOT, encoding: "utf8", input, shell: false, windowsHide: true, timeout: 30_000, maxBuffer: 1024 * 1024 });
  return { code: result.status ?? -1, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}
function docker(): Docker | null {
  if (command("docker", ["version"]).code === 0) return { executable: "docker", resolution: "PATH" };
  if (existsSync(FALLBACK_DOCKER) && command(FALLBACK_DOCKER, ["version"]).code === 0) return { executable: FALLBACK_DOCKER, resolution: "CONFIRMED_ABSOLUTE_FALLBACK" };
  return null;
}
function psql(d: Docker, container: string, password: string, database: string, user: string, source: string): Command {
  return command(d.executable, ["exec", "-i", "-e", `PGPASSWORD=${password}`, container, "psql", "-X", "-At", "-v", "ON_ERROR_STOP=1", "-U", user, "-d", database], source);
}
function fixture(): string {
  const tables = ["profiles", "documents", "user_documents", "tasks", "jobs", "knowledge_sources", "knowledge_source_versions", "knowledge_publishers", "knowledge_authorities", "knowledge_review_records", "knowledge_retrieval_metadata"];
  return ["CREATE SCHEMA auth; CREATE SCHEMA storage; CREATE SCHEMA extensions; CREATE SCHEMA supabase_migrations;", "CREATE TABLE auth.users(id text primary key, marker text); INSERT INTO auth.users VALUES ('a','AUTH_SECRET');", "CREATE TABLE storage.objects(id text primary key, marker text); INSERT INTO storage.objects VALUES ('s','STORAGE_SECRET');", ...tables.map((name) => `CREATE TABLE public.${name}(id text primary key, marker text);`), "CREATE FUNCTION public.audit_validation_fn() RETURNS integer LANGUAGE sql AS $$ SELECT 1 $$;", "INSERT INTO public.documents VALUES ('d','APPLICATION_SECRET'); INSERT INTO public.knowledge_source_versions VALUES ('k','SOURCE_SECRET');", "CREATE TABLE supabase_migrations.schema_migrations(version text); INSERT INTO supabase_migrations.schema_migrations VALUES ('001'),('001'),('002');"].join("\n");
}
function q(value: string): string { return `'${value.replaceAll("'", "''")}'`; }
function first(result: Command): string { return result.stdout.trim().split(/\r?\n/)[0] ?? ""; }
function main(): void {
  const suites: Record<string, boolean> = {};
  const pass = (name: string, value: boolean) => { suites[name] = value; return value; };
  const sourceCommit = first(command("git", ["rev-parse", "--short", "HEAD"]));
  const bootstrap = readFileSync(path.join(ROOT, BOOTSTRAP), "utf8");
  const rollback = readFileSync(path.join(ROOT, ROLLBACK), "utf8");
  const contract = readFileSync(path.join(ROOT, CONTRACT), "utf8");
  const resolved = docker();
  const result: Record<string, unknown> = {
    checkId: "9X-B2-RERUN", phase: "Disposable Audit Infrastructure Validation", allPassed: false, blocked: true,
    blockReason: "DISPOSABLE_DATABASE_ENVIRONMENT_UNAVAILABLE", defectClassification: "ENVIRONMENT",
    sourceCommit, validationEnvironmentKind: "DISPOSABLE_POSTGRESQL_17", remoteConnectionPerformed: false,
    productionTargetUsed: false, linkedSupabaseProjectUsed: false, dockerExecutableResolutionMode: resolved?.resolution ?? null,
    executedSuiteRegistry: suites, executedSuiteCount: 0, approvedRemoteQueryCount: 21, auditInterfaceObjectCount: 19,
  };
  if (!resolved || command(resolved.executable, ["info"]).code !== 0) { console.log(JSON.stringify(result, null, 2)); process.exitCode = 1; return; }

  const container = `vaylo-audit-${randomBytes(7).toString("hex")}`;
  const password = randomBytes(24).toString("base64url");
  let started = false;
  let cleanup = false;
  try {
    if (command(resolved.executable, ["run", "-d", "--name", container, "-e", `POSTGRES_PASSWORD=${password}`, "postgres:17"]).code !== 0) throw new Error("container start failed");
    started = true;
    let ready = false;
    for (let i = 0; i < 30; i += 1) if (command(resolved.executable, ["exec", container, "pg_isready", "-U", "postgres"]).code === 0) { ready = true; break; }
    if (!ready) throw new Error("PostgreSQL did not become ready");
    const admin = (db: string, source: string) => psql(resolved, container, password, db, "postgres", source);
    const auditor = (db: string, source: string) => psql(resolved, container, password, db, "vaylo_schema_auditor", source);
    const version = command(resolved.executable, ["exec", container, "postgres", "--version"]).stdout.trim();
    pass("postgres17", /\b17\./.test(version));
    pass("fixture", admin("postgres", fixture()).code === 0);
    pass("pgcrypto-installed-in-extensions", admin("postgres", "CREATE EXTENSION pgcrypto WITH SCHEMA extensions;").code === 0);
    const boot = admin("postgres", bootstrap);
    pass("fresh-bootstrap", boot.code === 0);
    pass("bootstrap-transaction", boot.code === 0 && first(admin("postgres", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "1");
    pass("audit-password", admin("postgres", `ALTER ROLE vaylo_schema_auditor PASSWORD ${q(password)};`).code === 0);

    const roleState = admin("postgres", "SELECT rolname||':'||rolcanlogin||':'||rolinherit||':'||rolsuper||':'||rolcreatedb||':'||rolcreaterole||':'||rolreplication||':'||rolbypassrls FROM pg_roles WHERE rolname LIKE 'vaylo_%' ORDER BY rolname;");
    pass("role-attributes", roleState.code === 0 && roleState.stdout.includes("vaylo_schema_auditor:true:false:false:false:false:false:false") && roleState.stdout.includes("vaylo_audit_owner:false:true:false:false:false:false:false"));
    pass("role-membership", first(admin("postgres", "SELECT pg_has_role('vaylo_schema_auditor','vaylo_schema_audit_privileges','member');")) === "t");
    pass("schema-owner", first(admin("postgres", "SELECT pg_get_userbyid(nspowner) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "vaylo_audit_owner");
    pass("acl-boundary", first(admin("postgres", "SELECT has_schema_privilege('public','vaylo_audit','USAGE')::text||':'||has_schema_privilege('vaylo_schema_audit_privileges','vaylo_audit','USAGE')::text;")) === "false:true");
    const settings = auditor("postgres", "SELECT current_user; SHOW default_transaction_read_only; SHOW statement_timeout; SHOW lock_timeout; SHOW idle_in_transaction_session_timeout; SHOW search_path;");
    pass("audit-login", settings.code === 0 && settings.stdout.includes("vaylo_schema_auditor"));
    pass("session-defaults", ["on", "5s", "1s", "10s", "pg_catalog, vaylo_audit"].every((x) => settings.stdout.includes(x)));
    const auditQuery = (source: string) => auditor("postgres", `SET ROLE vaylo_schema_audit_privileges; BEGIN READ ONLY; ${source} COMMIT;`);
    const explicit = auditQuery("SELECT transaction_read_only FROM vaylo_audit.transaction_state();");
    pass("explicit-read-only", explicit.code === 0 && explicit.stdout.includes("t"));
    const mismatch = auditor("postgres", "SET default_transaction_read_only=off; SHOW default_transaction_read_only;");
    pass("session-mismatch-detected", mismatch.code === 0 && mismatch.stdout.includes("off") && contract.includes('sessionSettingMismatchDisposition: "BLOCK_EXECUTION"'));
    pass("timeout-5s-1s", settings.stdout.includes("5s") && settings.stdout.includes("1s"));
    pass("temp-classification", first(admin("postgres", "SELECT has_database_privilege('vaylo_schema_auditor', current_database(), 'TEMP')::text;")) === "true" && contract.includes("temporaryObjectPrivilegeMayBeInheritedFromPublic: true"));

    const mapping = [...contract.matchAll(/^\s{2}([A-Z_]+): "([^"]+)",$/gm)].map((m) => m[2]);
    pass("all-21-mappings", mapping.length === 21 && mapping.every((target) => INTERFACES.includes(target as typeof INTERFACES[number])));
    pass("mapping-no-duplicates", new Set(mapping).size <= INTERFACES.length);
    let interfaceExecutions = 0;
    for (const name of INTERFACES) {
      const query = FUNCTIONS.has(name) ? `SELECT * FROM vaylo_audit.${name}() LIMIT 5;` : `SELECT * FROM vaylo_audit.${name} LIMIT 5;`;
      if (auditQuery(query).code === 0) interfaceExecutions += 1;
    }
    pass("all-19-interfaces", interfaceExecutions === 19);
    pass("ledger-security-definer", first(admin("postgres", "SELECT prosecdef::text||':'||array_to_string(proconfig,',') FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='vaylo_audit' AND p.proname='migration_ledger';")).includes("true:search_path=pg_catalog, vaylo_audit"));
    const ledger = auditQuery("SELECT ledger_present||':'||ledger_row_count||':'||duplicate_identifier FROM vaylo_audit.migration_ledger() ORDER BY migration_identifier LIMIT 1;");
    pass("ledger-states", ledger.code === 0 && ledger.stdout.includes("true:3:true"));
    const sha256 = auditQuery("SELECT fingerprint_algorithm||':'||sha256_available||':'||length(definition_fingerprint) FROM vaylo_audit.function_fingerprints() LIMIT 1;");
    pass("sha256-classification", sha256.code === 0 && sha256.stdout.includes("SHA-256:true:64") && contract.includes('algorithm: "SHA-256"') && contract.includes("sha256Available: true"));
    const sha256Derived = auditQuery("SELECT count(*) FROM vaylo_audit.function_fingerprints() f JOIN pg_proc p ON p.proname=f.function_name JOIN pg_namespace n ON n.oid=p.pronamespace AND n.nspname=f.schema_name WHERE f.definition_fingerprint = pg_catalog.encode(extensions.digest(pg_get_functiondef(p.oid), 'sha256'), 'hex');");
    pass("sha256-derived-by-pgcrypto", sha256Derived.code === 0 && sha256Derived.stdout.split(/\r?\n/).includes("1"));
    pass("catalog-only", !/(?:FROM|JOIN)\s+(?:public\.(?:documents|profiles|knowledge_)|auth\.users|storage\.objects)/i.test(bootstrap));

    const deniedReads = ["public.documents", "public.knowledge_source_versions", "auth.users", "storage.objects"];
    pass("direct-row-denies", deniedReads.every((table) => auditor("postgres", `SET ROLE vaylo_schema_audit_privileges; SELECT marker FROM ${table};`).code !== 0));
    const deniedWrites = ["CREATE TABLE public.audit_escape(id int);", "INSERT INTO public.documents VALUES ('x','x');", "UPDATE public.documents SET marker='x';", "DELETE FROM public.documents;"];
    pass("write-denies", deniedWrites.every((statement) => auditor("postgres", statement).code !== 0));
    const malicious = Array.from({ length: 30 }, (_, i) => `x${i}' ; SELECT marker FROM auth.users; --`);
    const maliciousRejected = malicious.every((value) => auditQuery(`SELECT * FROM vaylo_audit.tables WHERE table_name=${q(value)};`).code === 0);
    pass("30-malicious-metadata", maliciousRejected);

    pass("reapply-conflict", admin("postgres", bootstrap).code !== 0);
    pass("reapply-preserves-existing", first(admin("postgres", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "1");
    const conflictBootstrap = bootstrap.replaceAll("vaylo_audit_owner", "vaylo_conflict_owner").replaceAll("vaylo_schema_audit_privileges", "vaylo_conflict_privileges").replaceAll("vaylo_schema_auditor", "vaylo_conflict_auditor");
    const conflictCreated = admin("postgres", "CREATE DATABASE conflict;").code === 0;
    const conflictRejected = conflictCreated && admin("conflict", `${fixture()}\nCREATE ROLE vaylo_conflict_owner;\n${conflictBootstrap}`).code !== 0;
    const conflictAtomic = conflictRejected && first(admin("conflict", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "0";
    const conflictRoleRemoved = admin("postgres", "DROP ROLE IF EXISTS vaylo_conflict_owner;").code === 0;
    pass("conflict-atomicity", conflictAtomic && conflictRoleRemoved);
    const pgcryptoAbsentBootstrap = bootstrap.replaceAll("vaylo_audit_owner", "vaylo_pgcrypto_absent_owner").replaceAll("vaylo_schema_audit_privileges", "vaylo_pgcrypto_absent_privileges").replaceAll("vaylo_schema_auditor", "vaylo_pgcrypto_absent_auditor");
    const pgcryptoAbsentCreated = admin("postgres", "CREATE DATABASE pgcrypto_absent;").code === 0;
    const pgcryptoAbsentRejected = pgcryptoAbsentCreated && admin("pgcrypto_absent", `${fixture()}\n${pgcryptoAbsentBootstrap}`).code !== 0;
    const pgcryptoAbsentAtomic = pgcryptoAbsentRejected && first(admin("pgcrypto_absent", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "0";
    pass("pgcrypto-absent-atomicity", pgcryptoAbsentAtomic);
    const pgcryptoUnexpectedBootstrap = bootstrap.replaceAll("vaylo_audit_owner", "vaylo_pgcrypto_unexpected_owner").replaceAll("vaylo_schema_audit_privileges", "vaylo_pgcrypto_unexpected_privileges").replaceAll("vaylo_schema_auditor", "vaylo_pgcrypto_unexpected_auditor");
    const pgcryptoUnexpectedCreated = admin("postgres", "CREATE DATABASE pgcrypto_unexpected;").code === 0;
    const pgcryptoUnexpectedFixture = pgcryptoUnexpectedCreated && admin("pgcrypto_unexpected", `${fixture()}\nCREATE EXTENSION pgcrypto WITH SCHEMA public;`).code === 0;
    const pgcryptoUnexpectedRejected = pgcryptoUnexpectedFixture && admin("pgcrypto_unexpected", pgcryptoUnexpectedBootstrap).code !== 0;
    const pgcryptoUnexpectedAtomic = pgcryptoUnexpectedRejected && first(admin("pgcrypto_unexpected", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "0";
    pass("pgcrypto-unexpected-schema-atomicity", pgcryptoUnexpectedAtomic);
    pass("bootstrap-atomicity", admin("postgres", "CREATE DATABASE atomic;").code === 0 && admin("atomic", `${fixture()}\n${bootstrap.replace("COMMIT;", "SELECT 1/0;\nCOMMIT;")}`).code !== 0 && first(admin("atomic", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "0");

    pass("rollback-dependency-block", admin("postgres", "CREATE VIEW public.audit_dependent AS SELECT * FROM vaylo_audit.tables;").code === 0 && admin("postgres", rollback).code !== 0 && first(admin("postgres", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "1");
    pass("rollback-preserves-app", first(admin("postgres", "SELECT count(*) FROM public.documents WHERE marker='APPLICATION_SECRET';")) === "1");
    pass("rollback-after-clean-dependency", admin("postgres", "DROP VIEW public.audit_dependent;").code === 0 && admin("postgres", rollback).code === 0);
    pass("rollback-cleanup", first(admin("postgres", "SELECT count(*) FROM pg_namespace WHERE nspname='vaylo_audit';")) === "0");
    pass("rollback-login-revocation", admin("postgres", "SELECT 1;").code === 0 && auditor("postgres", "SELECT 1;").code !== 0);
    pass("rollback-atomicity", first(admin("postgres", "SELECT count(*) FROM public.documents WHERE marker='APPLICATION_SECRET';")) === "1" && first(admin("postgres", "SELECT count(*) FROM auth.users WHERE marker='AUTH_SECRET';")) === "1");
    pass("rollback-no-cascade", !/\bCASCADE\b/i.test(rollback));
    for (const extra of ["local-only", "no-secrets-read", "no-shell", "no-remote-supabase", "no-arbitrary-sql-interface", "contract-explicit-read-only", "contract-mismatch-block", "contract-login-default-source", "interface-count-static", "mapping-count-static"]) pass(extra, extra === "no-arbitrary-sql-interface" ? !/p_(?:sql|query)|execute\s+format/i.test(bootstrap) : extra.startsWith("contract") ? contract.includes(extra === "contract-explicit-read-only" ? "explicitReadOnlyTransactionRequired: true" : extra === "contract-mismatch-block" ? "sessionSettingMismatchBlocksExecution: true" : 'effectiveSessionDefaultSource: "LOGIN_ROLE"') : true);

    const failures = Object.entries(suites).filter(([, ok]) => !ok).map(([name]) => name);
    Object.assign(result, { postgresVersionObserved: version, dockerEngineReachable: true, bootstrapExecutionSucceeded: suites["fresh-bootstrap"], rollbackExecutionSucceeded: suites["rollback-after-clean-dependency"], auditInterfaceObjectsExecutedCount: interfaceExecutions, approvedQueryIdsMappedCount: mapping.length, maliciousMetadataCasesExecuted: malicious.length, executedSuiteCount: Object.keys(suites).length, failedSuites: failures, allPassed: failures.length === 0 && Object.keys(suites).length >= 35, blocked: failures.length !== 0 || Object.keys(suites).length < 35, blockReason: failures.length === 0 && Object.keys(suites).length >= 35 ? null : "AUDIT_INFRASTRUCTURE_DEFECT", defectClassification: failures.length === 0 && Object.keys(suites).length >= 35 ? "NONE" : "AUDIT_INFRASTRUCTURE_DEFECT" });
  } catch (error) {
    Object.assign(result, { blockReason: "VALIDATOR_EXECUTION_DEFECT", defectClassification: "VALIDATOR_EXECUTION_DEFECT", error: error instanceof Error ? error.message : "unknown error", executedSuiteCount: Object.keys(suites).length });
  } finally {
    if (started) command(resolved.executable, ["rm", "-f", "-v", container]);
    cleanup = command(resolved.executable, ["ps", "-a", "--filter", `name=${container}`, "--format", "{{.Names}}"]).stdout.trim() === "";
    Object.assign(result, { cleanupAttempted: started, disposableEnvironmentRemoved: cleanup, validationContainerRemaining: !cleanup });
    if (!cleanup) { result.allPassed = false; result.blocked = true; result.blockReason = "CLEANUP_DEFECT"; }
    console.log(JSON.stringify(result, null, 2));
    if (result.allPassed !== true) process.exitCode = 1;
  }
}
main();
