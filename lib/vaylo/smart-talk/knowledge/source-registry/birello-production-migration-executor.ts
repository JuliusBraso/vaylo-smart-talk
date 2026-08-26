import "server-only";

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Client, type ClientConfig } from "pg";

export const BIRELLO_MIGRATIONS = Object.freeze({
  "042": Object.freeze({
    operation: "BIRELLO_KNOWLEDGE_MIGRATION_042_V1",
    file: "042_make_knowledge_factory_ingestion_coexist.sql",
    // Updated only through source review when the committed migration changes.
    sha256: "3ddfc72151fe64dae66bce5cc13baaf86b771b7f2453d847cf12cfc22e380131",
  }),
  "043": Object.freeze({
    operation: "BIRELLO_KNOWLEDGE_MIGRATION_043_V1",
    file: "043_add_anmeldung_retrieval_compatibility.sql",
    sha256: "3021c4110fd0c75569f456818b8c9b81a825ee7786e43730ed333a55ebae7043",
  }),
} as const);

export type BirelloMigration = keyof typeof BIRELLO_MIGRATIONS;
export type BirelloMigrationMode = "validate" | "apply";
export const BIRELLO_MIGRATION_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_MIGRATION_ENABLED",
  target: "BIRELLO_PRODUCTION_MIGRATION_TARGET",
  authorization: "BIRELLO_PRODUCTION_MIGRATION_AUTHORIZATION",
  databaseUrl: "BIRELLO_PRODUCTION_MIGRATION_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_MIGRATION_DATABASE_NAME",
  expectedHost: "BIRELLO_PRODUCTION_MIGRATION_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_MIGRATION_PROJECT_REF",
  expectedUser: "BIRELLO_PRODUCTION_MIGRATION_EXPECTED_USER",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_MIGRATION_DATABASE_URL",
} as const);
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const DATABASE = "postgres";

export type BirelloMigrationConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string; host: string; port: number; database: string;
  projectRef: string; expectedUser: "postgres"; verifiedTls: boolean;
  authorizedMigration: BirelloMigration | null;
}>;
export type BirelloMigrationClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type BirelloMigrationClientFactory =
  (config: BirelloMigrationConfiguration) => BirelloMigrationClient;
export type BirelloMigrationSourceProvider = (migration: BirelloMigration) => string;
export type BirelloMigrationReport = Readonly<Record<string, unknown>>;

function migrationFile(migration: BirelloMigration): string {
  return join(process.cwd(), "supabase", "migrations", BIRELLO_MIGRATIONS[migration].file);
}
const committedMigrationSource: BirelloMigrationSourceProvider =
  (migration) => readFileSync(migrationFile(migration), "utf8");
export function migrationFingerprint(
  migration: BirelloMigration,
  sourceProvider: BirelloMigrationSourceProvider = committedMigrationSource,
): string {
  return createHash("sha256").update(sourceProvider(migration)).digest("hex");
}
function report(result: string, additions: Record<string, unknown> = {}): BirelloMigrationReport {
  return Object.freeze({ result, secretsPrinted: false, ...additions });
}
export function configurationFromBirelloMigrationEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): BirelloMigrationConfiguration | BirelloMigrationReport {
  const required = [BIRELLO_MIGRATION_ENV.enabled, BIRELLO_MIGRATION_ENV.target,
    BIRELLO_MIGRATION_ENV.databaseUrl, BIRELLO_MIGRATION_ENV.databaseName,
    BIRELLO_MIGRATION_ENV.expectedHost, BIRELLO_MIGRATION_ENV.projectRef,
    BIRELLO_MIGRATION_ENV.expectedUser];
  const missing = required.filter((key) => !environment[key]?.trim());
  if (missing.length) return report("CONFIGURATION_REQUIRED", { missing, connectionAttempted: false });
  try {
    const url = new URL(environment[BIRELLO_MIGRATION_ENV.databaseUrl]!);
    const host = environment[BIRELLO_MIGRATION_ENV.expectedHost]!.trim().toLowerCase();
    const projectRef = environment[BIRELLO_MIGRATION_ENV.projectRef]!.trim().toLowerCase();
    const user = environment[BIRELLO_MIGRATION_ENV.expectedUser]!.trim();
    const pooler = /\.pooler\.supabase\.com$/iu.test(host);
    const username = pooler ? `postgres.${projectRef}` : "postgres";
    const unsafeTls = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl") || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (environment[BIRELLO_MIGRATION_ENV.enabled] !== "true"
      || environment[BIRELLO_MIGRATION_ENV.target] !== "production"
      || environment[BIRELLO_MIGRATION_ENV.forbiddenPublicUrl] || !url.password
      || !["postgres:", "postgresql:"].includes(url.protocol) || unsafeTls
      || host !== url.hostname.toLowerCase() || projectRef !== PROJECT_REF
      || user !== "postgres" || url.username !== username
      || environment[BIRELLO_MIGRATION_ENV.databaseName] !== DATABASE || url.pathname.slice(1) !== DATABASE
      || ["localhost", "127.0.0.1", "::1"].includes(host) || /vaylo|dna/iu.test(host)) throw new Error("invalid");
    const authorized = (Object.keys(BIRELLO_MIGRATIONS) as BirelloMigration[]).find(
      (migration) => environment[BIRELLO_MIGRATION_ENV.authorization] === BIRELLO_MIGRATIONS[migration].operation,
    ) ?? null;
    return Object.freeze({ target: "production", connectionString: url.toString(), host,
      port: url.port ? Number(url.port) : 5432, database: DATABASE, projectRef,
      expectedUser: "postgres", verifiedTls: true, authorizedMigration: authorized });
  } catch { return report("REJECTED", { failureCode: "CONFIGURATION_INVALID", connectionAttempted: false }); }
}
function productionClient(config: BirelloMigrationConfiguration): BirelloMigrationClient {
  const client = new Client({ connectionString: config.connectionString,
    ssl: config.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_knowledge_migration_executor_v1" } satisfies ClientConfig);
  return { connect: async () => { await client.connect(); }, query: async (sql) => ({ rows: (await client.query(sql)).rows }), end: () => client.end() };
}
export const BIRELLO_MIGRATION_STATE_SQL = `select
  current_database() database,current_user maintenance_user,
  coalesce((select jsonb_agg(version::text order by version::text)
    from supabase_migrations.schema_migrations),'[]'::jsonb) versions`;
export const BIRELLO_MIGRATION_STRUCTURE_SQL = `select
  pg_catalog.to_regnamespace('knowledge_factory_internal') is not null internal_schema,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='knowledge_factory_internal'
      and p.proname in ('knowledge_ingest_curated_domain_pack_041',
        'knowledge_ingest_curated_service_area_pack_041',
        'knowledge_factory_resolve_041_payload')) internal_function_count,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname in ('knowledge_ingest_curated_domain_pack',
        'knowledge_ingest_curated_service_area_pack')
      and p.prosecdef and p.proconfig=array['search_path=pg_catalog, public']::text[])
    factory_secure_count,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname in ('knowledge_retrieve_evidence_packets',
        'knowledge_retrieve_anmeldung_context')
      and p.prosecdef and p.proconfig=array['search_path=pg_catalog, public']::text[])
    retrieval_secure_count,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_ingestor',
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_domain_pack(jsonb)'),
    'EXECUTE'),false) g3_execute,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_ingestor',
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_service_area_pack(jsonb)'),
    'EXECUTE'),false) g4_execute,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_reader',
    pg_catalog.to_regprocedure('public.knowledge_retrieve_evidence_packets(uuid[],text[])'),
    'EXECUTE'),false) rpc038_execute,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_reader',
    pg_catalog.to_regprocedure('public.knowledge_retrieve_anmeldung_context(uuid[],text)'),
    'EXECUTE'),false) rpc040_execute`;
function ledgerValid(migration: BirelloMigration, versions: readonly string[]): boolean {
  const expected = Array.from({ length: migration === "042" ? 41 : 42 }, (_, index) => String(index + 1).padStart(3, "0"));
  return versions.length === expected.length && expected.every((version, index) => versions[index] === version);
}
function sourceValid(
  migration: BirelloMigration,
  sourceProvider: BirelloMigrationSourceProvider,
): boolean {
  const expected = BIRELLO_MIGRATIONS[migration].sha256;
  return migrationFingerprint(migration, sourceProvider) === expected;
}
function structureValid(migration: BirelloMigration, row: Record<string, unknown>): boolean {
  const factory = row.internal_schema === true
    && Number(row.internal_function_count) === 3
    && Number(row.factory_secure_count) === 2
    && row.g3_execute === true && row.g4_execute === true;
  return factory && (migration === "042" || (
    Number(row.retrieval_secure_count) === 2
    && row.rpc038_execute === true && row.rpc040_execute === true
  ));
}
export async function runBirelloMigration(
  configOrReport: BirelloMigrationConfiguration | BirelloMigrationReport,
  migration: BirelloMigration, mode: BirelloMigrationMode,
  factory: BirelloMigrationClientFactory = productionClient,
  sourceProvider: BirelloMigrationSourceProvider = committedMigrationSource,
): Promise<BirelloMigrationReport> {
  if (!("target" in configOrReport)) return configOrReport;
  const config = configOrReport as BirelloMigrationConfiguration;
  if (!sourceValid(migration, sourceProvider)) {
    return report("REJECTED", {
      failureCode: "MIGRATION_SOURCE_MISMATCH", connectionAttempted: false,
      transactionBegan: false, transactionRolledBack: false,
    });
  }
  if (mode === "apply" && config.authorizedMigration !== migration) {
    return report("REJECTED", {
      failureCode: "AUTHORIZATION_REQUIRED", connectionAttempted: false,
      transactionBegan: false, transactionRolledBack: false,
    });
  }
  const client = factory(config); let connected = false; let began = false;
  try {
    await client.connect(); connected = true;
    const before = (await client.query(BIRELLO_MIGRATION_STATE_SQL)).rows[0]!;
    const versions = Array.isArray(before.versions) ? before.versions.map(String) : [];
    if (before.database !== config.database || before.maintenance_user !== config.expectedUser) {
      return report("REJECTED", {
        failureCode: before.database !== config.database
          ? "TARGET_IDENTITY_MISMATCH" : "MAINTENANCE_IDENTITY_MISMATCH",
        connectionAttempted: true, transactionBegan: false, transactionRolledBack: false,
      });
    }
    if (!ledgerValid(migration, versions)) return report("REJECTED", {
      failureCode: versions.includes(migration) ? "ALREADY_APPLIED" : "LEDGER_MISMATCH",
      connectionAttempted: true, transactionBegan: false, transactionRolledBack: false,
    });
    if (mode === "validate") return report("PASS", {
      migration, mode, readyForApply: config.authorizedMigration === migration,
      connectionAttempted: true, transactionBegan: false, transactionCommitted: false,
      transactionRolledBack: false, mutationCount: 0,
    });
    await client.query("BEGIN"); began = true;
    const again = (await client.query(BIRELLO_MIGRATION_STATE_SQL)).rows[0]!;
    if (!ledgerValid(migration, Array.isArray(again.versions) ? again.versions.map(String) : [])) throw new Error("LEDGER_MISMATCH");
    await client.query(sourceProvider(migration));
    await client.query(`insert into supabase_migrations.schema_migrations(version) values ('${migration}')`);
    const after = (await client.query(BIRELLO_MIGRATION_STATE_SQL)).rows[0]!;
    const expectedCount = migration === "042" ? 42 : 43;
    if (!Array.isArray(after.versions) || after.versions.length !== expectedCount
      || String(after.versions[expectedCount - 1]) !== migration) throw new Error("MIGRATION_POSTCONDITION_FAILED");
    const structure = (await client.query(BIRELLO_MIGRATION_STRUCTURE_SQL)).rows[0]!;
    if (!structureValid(migration, structure)) throw new Error("MIGRATION_POSTCONDITION_FAILED");
    await client.query("COMMIT"); began = false;
    return report("PASS", {
      migration, mode, connectionAttempted: true, transactionBegan: true,
      transactionCommitted: true, transactionRolledBack: false, mutationCount: 2,
      sourceFingerprint: migrationFingerprint(migration, sourceProvider),
      structuralPostconditions: structure,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) try { await client.query("ROLLBACK"); rolledBack = true; } catch { /* bounded cleanup */ }
    const message = error instanceof Error ? error.message : "";
    const failureCode = message === "LEDGER_MISMATCH" ? "LEDGER_MISMATCH"
      : message === "MIGRATION_POSTCONDITION_FAILED"
        ? "MIGRATION_POSTCONDITION_FAILED" : "EXECUTION_FAILED";
    return report("REJECTED", {
      failureCode, connectionAttempted: connected, transactionBegan: began || rolledBack,
      transactionCommitted: false, transactionRolledBack: rolledBack,
    });
  } finally { if (connected) await client.end().catch(() => undefined); }
}
