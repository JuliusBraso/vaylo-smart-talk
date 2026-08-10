import { fileURLToPath } from "node:url";
import path from "node:path";

import { Client, type ClientConfig } from "pg";

export const MAINTENANCE_CONFIGURATION_KEYS = Object.freeze({
  enabled: "VAYLO_PRODUCTION_MAINTENANCE_ENABLED",
  target: "VAYLO_PRODUCTION_MAINTENANCE_TARGET",
  backupConfirmed: "VAYLO_PRODUCTION_BACKUP_CONFIRMED",
  databaseUrl: "VAYLO_PRODUCTION_READONLY_DATABASE_URL",
  forbiddenPublicDatabaseUrl:
    "NEXT_PUBLIC_VAYLO_PRODUCTION_READONLY_DATABASE_URL",
} as const);

export const PREFLIGHT_TIMEOUTS = Object.freeze({
  statementTimeout: "10s",
  lockTimeout: "1s",
} as const);

export const FORBIDDEN_CONNECTION_URL_TLS_PARAMETERS = Object.freeze([
  "ssl",
  "sslmode",
  "sslcert",
  "sslkey",
  "sslrootcert",
  "sslcrl",
  "sslpassword",
  "sslcompression",
  "sslsni",
  "sslnegotiation",
  "requiressl",
  "uselibpqcompat",
] as const);

export const EXPECTED_KNOWLEDGE_TABLES = Object.freeze([
  "knowledge_topics",
  "knowledge_steps",
  "knowledge_step_dependencies",
  "knowledge_trust_domains",
  "knowledge_jurisdictions",
  "knowledge_territorial_scopes",
  "knowledge_publishers",
  "knowledge_sources",
  "knowledge_source_versions",
  "knowledge_source_passages",
  "knowledge_authorities",
  "knowledge_authority_competences",
  "knowledge_claims",
  "knowledge_claim_evidence_links",
  "knowledge_citations",
  "knowledge_responsible_actor_rules",
  "knowledge_processes",
  "knowledge_forms",
  "knowledge_deadline_rules",
  "knowledge_fee_rules",
  "knowledge_process_steps",
  "knowledge_evidence_requirements",
  "knowledge_form_requirements",
  "knowledge_eligibility_rules",
  "knowledge_process_claim_links",
  "knowledge_regional_overrides",
  "knowledge_review_records",
  "knowledge_freshness_records",
  "knowledge_conflicts",
  "knowledge_audit_events",
  "knowledge_terminology",
  "knowledge_localized_terminology",
  "knowledge_trust_domain_links",
  "knowledge_cross_border_connectors",
  "knowledge_cross_border_processes",
  "knowledge_retrieval_metadata",
  "knowledge_publication_state_transitions",
  "knowledge_publication_states",
  "knowledge_canonical_unit_translations",
  "knowledge_source_authorization_transitions",
  "knowledge_source_registry_history",
  "knowledge_source_handling_policies",
  "knowledge_source_acquisition_attempts",
] as const);

export const PREFLIGHT_MIGRATION_CLASSIFICATIONS = Object.freeze({
  "010": "PASS_CRITICAL_SCHEMA_PRODUCER",
  "032": "PASS_CRITICAL_SCHEMA_PRODUCER",
  "033": "PASS_CRITICAL_SCHEMA_PRODUCER",
  "034": "DIAGNOSTIC_NON_BLOCKING",
  "035": "PASS_CRITICAL_SCHEMA_PRODUCER",
  "20260423": "DEFERRED_REVIEW_REQUIRED_NON_BLOCKING",
} as const);

export const EXPECTED_SCHEMA_MIGRATION_IDS = Object.freeze([
  "010",
  "032",
  "033",
  "035",
] as const);

export const DIAGNOSTIC_MIGRATION_IDS = Object.freeze(["034"] as const);
const DEDICATED_READONLY_IDENTITIES = new Set([
  "vaylo_schema_auditor",
  "birello_preflight_reader",
]);

const MIGRATION_010_TABLES = new Set<string>([
  "knowledge_topics",
  "knowledge_steps",
  "knowledge_step_dependencies",
]);
const MIGRATION_033_TABLES = new Set<string>([
  "knowledge_publication_state_transitions",
  "knowledge_publication_states",
  "knowledge_canonical_unit_translations",
]);
const MIGRATION_035_TABLES = new Set<string>([
  "knowledge_source_authorization_transitions",
  "knowledge_source_registry_history",
  "knowledge_source_handling_policies",
  "knowledge_source_acquisition_attempts",
]);

const EXPECTED_AUDIT_VIEWS = Object.freeze([
  "platform_schemas",
  "extensions",
  "tables",
  "columns",
  "constraints",
  "indexes",
  "enums",
  "triggers",
  "rls_state",
  "policies",
] as const);

const EXPECTED_AUDIT_FUNCTIONS = Object.freeze([
  "server_state",
  "transaction_state",
  "migration_ledger",
  "functions",
  "function_fingerprints",
  "table_grants",
  "function_grants",
  "internal_engine_privileges",
  "source_registry_collisions",
] as const);

export const FIXED_SCHEMA_INSPECTION_QUERIES = Object.freeze([
  Object.freeze({
    id: "CURRENT_SESSION",
    purpose: "Confirm database session identity, server version, and read-only state.",
    sql: "select current_database() as database_name, current_user as user_name, current_setting('server_version_num') as server_version_num, current_setting('transaction_read_only') as transaction_read_only",
  }),
  Object.freeze({
    id: "MIGRATION_LEDGER",
    purpose: "Inspect Supabase migration-ledger initialization before listing versions.",
    sql: "select to_regnamespace('supabase_migrations') is not null as schema_initialized, to_regclass('supabase_migrations.schema_migrations') is not null as ledger_initialized",
  }),
  Object.freeze({
    id: "REQUIRED_SCHEMAS",
    purpose: "Inspect required PostgreSQL and Supabase schema presence.",
    sql: "select nspname as schema_name from pg_catalog.pg_namespace where nspname in ('public','supabase_migrations','vaylo_audit','extensions') order by nspname",
  }),
  Object.freeze({
    id: "REQUIRED_EXTENSIONS",
    purpose: "Inspect pgcrypto presence and schema placement.",
    sql: "select e.extname as extension_name, n.nspname as schema_name from pg_catalog.pg_extension e join pg_catalog.pg_namespace n on n.oid = e.extnamespace where e.extname = 'pgcrypto'",
  }),
  Object.freeze({
    id: "KNOWLEDGE_TABLES_AND_RLS",
    purpose: "Inspect knowledge table presence and row-level security state.",
    sql: "select c.relname as table_name, c.relrowsecurity as rls_enabled from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'knowledge\\_%' escape '\\' order by c.relname",
  }),
  Object.freeze({
    id: "KNOWLEDGE_GRANTS",
    purpose: "Detect direct anon or authenticated grants on knowledge tables.",
    sql: "select grantee, table_name, privilege_type from information_schema.role_table_grants where table_schema = 'public' and table_name like 'knowledge\\_%' escape '\\' and grantee in ('anon','authenticated') order by table_name, grantee, privilege_type",
  }),
  Object.freeze({
    id: "KNOWLEDGE_FUNCTIONS",
    purpose: "Inspect committed knowledge function identities.",
    sql: "select p.proname as function_name from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname like 'knowledge\\_%' escape '\\' order by p.proname",
  }),
  Object.freeze({
    id: "KNOWLEDGE_TRIGGERS",
    purpose: "Inspect non-internal triggers on knowledge tables.",
    sql: "select t.tgname as trigger_name from pg_catalog.pg_trigger t join pg_catalog.pg_class c on c.oid = t.tgrelid join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname like 'knowledge\\_%' escape '\\' and not t.tgisinternal order by t.tgname",
  }),
  Object.freeze({
    id: "KNOWLEDGE_INDEXES",
    purpose: "Inspect indexes attached to knowledge tables.",
    sql: "select indexname as index_name from pg_catalog.pg_indexes where schemaname = 'public' and tablename like 'knowledge\\_%' escape '\\' order by indexname",
  }),
  Object.freeze({
    id: "VAYLO_AUDIT_INTERFACE",
    purpose: "Inspect expected vaylo_audit views and functions without invoking them.",
    sql: "select 'view'::text as object_kind, c.relname as object_name from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid = c.relnamespace where n.nspname = 'vaylo_audit' and c.relkind = 'v' union all select 'function'::text as object_kind, p.proname as object_name from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace where n.nspname = 'vaylo_audit' order by object_kind, object_name",
  }),
] as const);

export const MIGRATION_LEDGER_VERSIONS_SQL =
  "select version::text as version from supabase_migrations.schema_migrations order by version";

export const TRANSACTION_STATEMENTS = Object.freeze({
  begin: "BEGIN READ ONLY",
  statementTimeout: "SET LOCAL statement_timeout = '10s'",
  lockTimeout: "SET LOCAL lock_timeout = '1s'",
  commit: "COMMIT",
  rollback: "ROLLBACK",
} as const);

export interface MaintenanceConfigurationSource {
  read(name: string): string | undefined;
}

export interface MaintenancePgClient {
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>>;
  end(): Promise<void>;
}

export type MaintenancePgClientFactory = (
  config: ClientConfig,
) => MaintenancePgClient;

type QueryId = (typeof FIXED_SCHEMA_INSPECTION_QUERIES)[number]["id"];
export type ProductionSchemaPreflightStatus =
  | "PASS"
  | "NEEDS_MIGRATION"
  | "MISMATCH"
  | "FAILED";

type SuccessfulPreflightReport = Readonly<{
  target: "production";
  connected: true;
  readOnly: boolean;
  dedicatedReadOnlyIdentityObserved: boolean;
  serverVersionMajor: number | null;
  migrationLedger: Readonly<{
    schemaInitialized: boolean;
    initialized: boolean;
    expectedMigrationSet: readonly string[];
    observedMigrationSet: readonly string[];
    pendingMigrationSet: readonly string[];
    pendingMigrationCount: number;
    appliedCount: number;
    requiredKnowledgeMigrationsApplied: boolean;
    dataUpsertMigrationApplied: boolean;
    dataUpsertReviewRequired: boolean;
    warning: string | null;
  }>;
  schemas: Readonly<{
    expected: readonly string[];
    observed: readonly string[];
    missing: readonly string[];
  }>;
  pgcrypto: Readonly<{ present: boolean; schemaCorrect: boolean }>;
  knowledgeTables: Readonly<{
    expectedCount: number;
    observedCount: number;
    missing: readonly string[];
  }>;
  rls: Readonly<{ enabledCount: number; disabledTables: readonly string[] }>;
  grantWarnings: readonly string[];
  operatorActionRequired: boolean;
  mandatoryMismatchReasons: readonly string[];
  mandatoryMismatchCount: number;
  auditBootstrapRequired: boolean;
  warnings: readonly string[];
  structuralObjects: Readonly<{
    functionCount: number;
    triggerCount: number;
    indexCount: number;
    publicationTranslationPresent: boolean;
    sourceRegistryPresent: boolean;
  }>;
  auditInterface: Readonly<{
    expectedViews: number;
    observedViews: number;
    missingViews: readonly string[];
    expectedFunctions: number;
    observedFunctions: number;
    missingFunctions: readonly string[];
  }>;
  overall: Exclude<ProductionSchemaPreflightStatus, "FAILED">;
}>;

export type ProductionSchemaPreflightResult =
  | SuccessfulPreflightReport
  | Readonly<{
      target: "production";
      connected: boolean;
      overall: "FAILED";
      failureCode:
        | "MAINTENANCE_DISABLED"
        | "TARGET_INVALID"
        | "BACKUP_NOT_CONFIRMED"
        | "PUBLIC_CREDENTIAL_CONFIGURATION_REJECTED"
        | "READONLY_CREDENTIAL_MISSING"
        | "READONLY_CREDENTIAL_INVALID"
        | "TLS_CONFIGURATION_INVALID"
        | "PREFLIGHT_EXECUTION_FAILED";
    }>;

const REQUIRED_SCHEMAS = Object.freeze([
  "public",
  "supabase_migrations",
  "vaylo_audit",
  "extensions",
] as const);

function producerMigrationForTable(tableName: string): string {
  if (MIGRATION_010_TABLES.has(tableName)) return "010";
  if (MIGRATION_033_TABLES.has(tableName)) return "033";
  if (MIGRATION_035_TABLES.has(tableName)) return "035";
  return "032";
}

export function deriveProductionSchemaPreflightStatus(input: Readonly<{
  executionFailed: boolean;
  mandatoryMismatchCount: number;
  pendingMigrationCount: number;
  operatorActionRequired: boolean;
}>): ProductionSchemaPreflightStatus {
  if (input.executionFailed) return "FAILED";
  if (input.mandatoryMismatchCount > 0) return "MISMATCH";
  if (input.pendingMigrationCount > 0) return "NEEDS_MIGRATION";
  if (input.operatorActionRequired) return "MISMATCH";
  return "PASS";
}

function failed(
  failureCode: Extract<
    ProductionSchemaPreflightResult,
    { overall: "FAILED" }
  >["failureCode"],
  connected = false,
): ProductionSchemaPreflightResult {
  return Object.freeze({
    target: "production" as const,
    connected,
    overall: "FAILED" as const,
    failureCode,
  });
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && /^[A-Za-z0-9_.:-]{1,128}$/.test(value)
    ? value
    : null;
}

function rowRecord(value: unknown): Readonly<Record<string, unknown>> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : null;
}

function strings(
  rows: readonly unknown[],
  field: string,
): readonly string[] {
  return Object.freeze(
    rows
      .map((row) => safeString(rowRecord(row)?.[field]))
      .filter((value): value is string => value !== null),
  );
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values)].sort());
}

function validateCredentialUrl(connectionString: string): boolean {
  try {
    const parsed = new URL(connectionString);
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)) return false;
    if (!parsed.hostname || !parsed.username || !parsed.pathname.slice(1)) {
      return false;
    }
    for (const parameterName of parsed.searchParams.keys()) {
      const normalizedName = parameterName.toLowerCase();
      if (
        normalizedName.startsWith("ssl") ||
        normalizedName === "requiressl" ||
        normalizedName === "uselibpqcompat"
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

function productionClientFactory(config: ClientConfig): MaintenancePgClient {
  const client = new Client(config);
  return Object.freeze({
    async connect(): Promise<void> {
      await client.connect();
    },
    async query(sql: string): Promise<Readonly<{ rows: readonly unknown[] }>> {
      const result = await client.query(sql);
      return Object.freeze({ rows: result.rows });
    },
    async end(): Promise<void> {
      await client.end();
    },
  });
}

function reportFromRows(
  resultRows: Readonly<Record<QueryId, readonly unknown[]>>,
): SuccessfulPreflightReport {
  const session = rowRecord(resultRows.CURRENT_SESSION[0]);
  const readOnly = session?.transaction_read_only === "on";
  const dedicatedReadOnlyIdentityObserved =
    typeof session?.user_name === "string" &&
    DEDICATED_READONLY_IDENTITIES.has(session.user_name);
  const versionText =
    typeof session?.server_version_num === "string"
      ? session.server_version_num
      : "";
  const serverVersionMajor = /^\d{6}$/.test(versionText)
    ? Number(versionText.slice(0, 2))
    : null;

  const ledgerObservation = rowRecord(resultRows.MIGRATION_LEDGER[0]);
  const ledgerObservationValid =
    typeof ledgerObservation?.schema_initialized === "boolean" &&
    typeof ledgerObservation?.ledger_initialized === "boolean";
  const ledgerSchemaInitialized =
    ledgerObservation?.schema_initialized === true;
  const ledgerInitialized = ledgerObservation?.ledger_initialized === true;
  const appliedVersions = uniqueSorted(
    strings(resultRows.MIGRATION_LEDGER, "version"),
  );
  const observedMigrationSet = new Set(appliedVersions);
  const pendingVersions = EXPECTED_SCHEMA_MIGRATION_IDS.filter(
    (version) => !observedMigrationSet.has(version),
  );
  const pendingMigrationSet = new Set<string>(pendingVersions);
  const requiredKnowledgeMigrationsApplied = pendingVersions.length === 0;
  const dataUpsertMigrationApplied = observedMigrationSet.has("20260423");
  const dataUpsertReviewRequired = !dataUpsertMigrationApplied;
  const observedSchemas = uniqueSorted(
    strings(resultRows.REQUIRED_SCHEMAS, "schema_name"),
  );
  const missingSchemas = REQUIRED_SCHEMAS.filter(
    (schema) => !observedSchemas.includes(schema),
  );

  const extensionRows = resultRows.REQUIRED_EXTENSIONS
    .map(rowRecord)
    .filter((row): row is Readonly<Record<string, unknown>> => row !== null);
  const pgcrypto = extensionRows.find(
    (row) => row.extension_name === "pgcrypto",
  );

  const tableRows = resultRows.KNOWLEDGE_TABLES_AND_RLS
    .map(rowRecord)
    .filter((row): row is Readonly<Record<string, unknown>> => row !== null);
  const observedTables = uniqueSorted(
    tableRows
      .map((row) => safeString(row.table_name))
      .filter((value): value is string => value !== null),
  );
  const missingTables = EXPECTED_KNOWLEDGE_TABLES.filter(
    (table) => !observedTables.includes(table),
  );
  const expectedKnowledgeTableSet = new Set<string>(EXPECTED_KNOWLEDGE_TABLES);
  const disabledTables = uniqueSorted(
    tableRows
      .filter(
        (row) =>
          expectedKnowledgeTableSet.has(safeString(row.table_name) ?? "") &&
          row.rls_enabled !== true,
      )
      .map((row) => safeString(row.table_name))
      .filter((value): value is string => value !== null),
  );

  const grantWarnings = uniqueSorted(
    resultRows.KNOWLEDGE_GRANTS
      .map(rowRecord)
      .filter((row): row is Readonly<Record<string, unknown>> => row !== null)
      .filter((row) =>
        expectedKnowledgeTableSet.has(safeString(row.table_name) ?? ""),
      )
      .map((row) => {
        const table = safeString(row.table_name);
        const grantee = safeString(row.grantee);
        const privilege = safeString(row.privilege_type);
        return table && grantee && privilege
          ? `${table}:${grantee}:${privilege}`
          : null;
      })
      .filter((value): value is string => value !== null),
  );

  const functionNames = uniqueSorted(
    strings(resultRows.KNOWLEDGE_FUNCTIONS, "function_name"),
  );
  const triggerNames = uniqueSorted(
    strings(resultRows.KNOWLEDGE_TRIGGERS, "trigger_name"),
  );
  const indexNames = uniqueSorted(
    strings(resultRows.KNOWLEDGE_INDEXES, "index_name"),
  );
  const auditRows = resultRows.VAYLO_AUDIT_INTERFACE
    .map(rowRecord)
    .filter((row): row is Readonly<Record<string, unknown>> => row !== null);
  const auditViews = uniqueSorted(
    auditRows
      .filter((row) => row.object_kind === "view")
      .map((row) => safeString(row.object_name))
      .filter((value): value is string => value !== null),
  );
  const auditFunctions = uniqueSorted(
    auditRows
      .filter((row) => row.object_kind === "function")
      .map((row) => safeString(row.object_name))
      .filter((value): value is string => value !== null),
  );
  const missingAuditViews = EXPECTED_AUDIT_VIEWS.filter(
    (name) => !auditViews.includes(name),
  );
  const missingAuditFunctions = EXPECTED_AUDIT_FUNCTIONS.filter(
    (name) => !auditFunctions.includes(name),
  );

  const publicationTranslationPresent = [
    "knowledge_publication_state_transitions",
    "knowledge_publication_states",
    "knowledge_canonical_unit_translations",
  ].every((name) => observedTables.includes(name));
  const sourceRegistryPresent = [
    "knowledge_source_authorization_transitions",
    "knowledge_source_registry_history",
    "knowledge_source_handling_policies",
    "knowledge_source_acquisition_attempts",
  ].every((name) => observedTables.includes(name));

  const mandatoryMismatchReasons: string[] = [];
  const addMismatch = (reason: string): void => {
    if (!mandatoryMismatchReasons.includes(reason)) {
      mandatoryMismatchReasons.push(reason);
    }
  };

  if (!ledgerObservationValid) {
    addMismatch("MIGRATION_LEDGER_OBSERVATION_INVALID");
  } else if (ledgerSchemaInitialized && !ledgerInitialized) {
    addMismatch("MIGRATION_LEDGER_RELATION_MISSING");
  }
  if (!readOnly) addMismatch("READ_ONLY_TRANSACTION_MISMATCH");
  if (!dedicatedReadOnlyIdentityObserved) {
    addMismatch("DATABASE_IDENTITY_SECURITY_MISMATCH");
  }
  for (const schemaName of missingSchemas) {
    if (schemaName === "extensions" && pendingMigrationSet.has("033")) continue;
    if (schemaName === "supabase_migrations" && !ledgerInitialized) continue;
    if (schemaName === "vaylo_audit") {
      if (ledgerInitialized) addMismatch("VAYLO_AUDIT_SCHEMA_MISSING");
    } else {
      addMismatch(`REQUIRED_SCHEMA_MISSING:${schemaName}`);
    }
  }
  if (!pgcrypto) {
    if (!pendingMigrationSet.has("033")) addMismatch("PGCRYPTO_MISSING");
  } else if (pgcrypto.schema_name !== "extensions") {
    addMismatch("PGCRYPTO_WRONG_SCHEMA");
  }
  for (const tableName of missingTables) {
    if (!pendingMigrationSet.has(producerMigrationForTable(tableName))) {
      addMismatch(`REQUIRED_KNOWLEDGE_TABLE_MISSING:${tableName}`);
    }
  }
  for (const tableName of disabledTables) {
    addMismatch(`KNOWLEDGE_TABLE_RLS_DISABLED:${tableName}`);
  }
  for (const grantWarning of grantWarnings) {
    addMismatch(`PROTECTED_ROLE_DIRECT_GRANT:${grantWarning}`);
  }

  const auditBootstrapRequired =
    missingSchemas.includes("vaylo_audit") ||
    missingAuditViews.length > 0 ||
    missingAuditFunctions.length > 0;
  if (ledgerInitialized && missingAuditViews.length > 0) {
    addMismatch("VAYLO_AUDIT_REQUIRED_VIEWS_MISSING");
  }
  if (ledgerInitialized && missingAuditFunctions.length > 0) {
    addMismatch("VAYLO_AUDIT_REQUIRED_FUNCTIONS_MISSING");
  }

  const warnings: string[] = [];
  if (!ledgerInitialized) {
    warnings.push(
      "The Supabase migration ledger is not initialized; first schema activation remains pending.",
    );
  }
  if (dataUpsertReviewRequired) {
    warnings.push(
      "20260423_branching_real_world_expansion.sql is deferred outside the automatic migration chain; separate product/data review is required before any manual execution.",
    );
  }
  if (auditBootstrapRequired) {
    warnings.push(
      "The separately controlled vaylo_audit bootstrap is missing or incomplete and requires operator repair.",
    );
  }
  warnings.push(
    "Function, trigger, and index counts are migration diagnostics only; no exact mandatory allowlist is encoded.",
  );

  const operatorActionRequired =
    pendingVersions.length > 0 || mandatoryMismatchReasons.length > 0;
  const overall = deriveProductionSchemaPreflightStatus({
    executionFailed: false,
    mandatoryMismatchCount: mandatoryMismatchReasons.length,
    pendingMigrationCount: pendingVersions.length,
    operatorActionRequired,
  });
  if (overall === "FAILED") {
    throw new Error("Successful result processing produced FAILED");
  }

  return Object.freeze({
    target: "production" as const,
    connected: true as const,
    readOnly,
    dedicatedReadOnlyIdentityObserved,
    serverVersionMajor,
    migrationLedger: Object.freeze({
      schemaInitialized: ledgerSchemaInitialized,
      initialized: ledgerInitialized,
      expectedMigrationSet: EXPECTED_SCHEMA_MIGRATION_IDS,
      observedMigrationSet: appliedVersions,
      pendingMigrationSet: Object.freeze([...pendingVersions]),
      pendingMigrationCount: pendingVersions.length,
      appliedCount: appliedVersions.length,
      requiredKnowledgeMigrationsApplied,
      dataUpsertMigrationApplied,
      dataUpsertReviewRequired,
      warning: dataUpsertMigrationApplied
        ? null
        : "20260423_branching_real_world_expansion.sql is intentionally deferred and is not required for first-activation PASS.",
    }),
    schemas: Object.freeze({
      expected: REQUIRED_SCHEMAS,
      observed: observedSchemas,
      missing: Object.freeze([...missingSchemas]),
    }),
    pgcrypto: Object.freeze({
      present: pgcrypto !== undefined,
      schemaCorrect: pgcrypto?.schema_name === "extensions",
    }),
    knowledgeTables: Object.freeze({
      expectedCount: EXPECTED_KNOWLEDGE_TABLES.length,
      observedCount: observedTables.filter((table) =>
        EXPECTED_KNOWLEDGE_TABLES.includes(
          table as (typeof EXPECTED_KNOWLEDGE_TABLES)[number],
        ),
      ).length,
      missing: Object.freeze([...missingTables]),
    }),
    rls: Object.freeze({
      enabledCount:
        EXPECTED_KNOWLEDGE_TABLES.length -
        missingTables.length -
        disabledTables.length,
      disabledTables,
    }),
    grantWarnings,
    operatorActionRequired,
    mandatoryMismatchReasons: Object.freeze(mandatoryMismatchReasons),
    mandatoryMismatchCount: mandatoryMismatchReasons.length,
    auditBootstrapRequired,
    warnings: Object.freeze(warnings),
    structuralObjects: Object.freeze({
      functionCount: functionNames.length,
      triggerCount: triggerNames.length,
      indexCount: indexNames.length,
      publicationTranslationPresent,
      sourceRegistryPresent,
    }),
    auditInterface: Object.freeze({
      expectedViews: EXPECTED_AUDIT_VIEWS.length,
      observedViews: auditViews.length,
      missingViews: Object.freeze([...missingAuditViews]),
      expectedFunctions: EXPECTED_AUDIT_FUNCTIONS.length,
      observedFunctions: auditFunctions.length,
      missingFunctions: Object.freeze([...missingAuditFunctions]),
    }),
    overall,
  });
}

export async function runProductionSchemaPreflight(
  configuration: MaintenanceConfigurationSource,
  clientFactory: MaintenancePgClientFactory = productionClientFactory,
): Promise<ProductionSchemaPreflightResult> {
  if (configuration.read(MAINTENANCE_CONFIGURATION_KEYS.enabled) !== "true") {
    return failed("MAINTENANCE_DISABLED");
  }
  if (configuration.read(MAINTENANCE_CONFIGURATION_KEYS.target) !== "production") {
    return failed("TARGET_INVALID");
  }
  if (
    configuration.read(MAINTENANCE_CONFIGURATION_KEYS.backupConfirmed) !==
    "true"
  ) {
    return failed("BACKUP_NOT_CONFIRMED");
  }
  if (
    configuration.read(
      MAINTENANCE_CONFIGURATION_KEYS.forbiddenPublicDatabaseUrl,
    )
  ) {
    return failed("PUBLIC_CREDENTIAL_CONFIGURATION_REJECTED");
  }

  const connectionString = configuration.read(
    MAINTENANCE_CONFIGURATION_KEYS.databaseUrl,
  );
  if (!connectionString) return failed("READONLY_CREDENTIAL_MISSING");
  if (!validateCredentialUrl(connectionString)) {
    return failed("READONLY_CREDENTIAL_INVALID");
  }

  const clientConfig: ClientConfig = {
    connectionString,
    ssl: { rejectUnauthorized: true },
    application_name: "vaylo_production_schema_preflight",
  };
  if (
    typeof clientConfig.ssl !== "object" ||
    clientConfig.ssl.rejectUnauthorized !== true
  ) {
    return failed("TLS_CONFIGURATION_INVALID");
  }

  let client: MaintenancePgClient;
  try {
    client = clientFactory(clientConfig);
  } catch {
    return failed("PREFLIGHT_EXECUTION_FAILED");
  }
  let transactionStarted = false;
  let connectionEstablished = false;
  try {
    await client.connect();
    connectionEstablished = true;
    await client.query(TRANSACTION_STATEMENTS.begin);
    transactionStarted = true;
    await client.query(TRANSACTION_STATEMENTS.statementTimeout);
    await client.query(TRANSACTION_STATEMENTS.lockTimeout);

    const collected = {} as Record<QueryId, readonly unknown[]>;
    for (const inspection of FIXED_SCHEMA_INSPECTION_QUERIES) {
      const result = await client.query(inspection.sql);
      if (inspection.id === "MIGRATION_LEDGER") {
        const ledgerObservation = rowRecord(result.rows[0]);
        if (ledgerObservation?.ledger_initialized === true) {
          const versions = await client.query(MIGRATION_LEDGER_VERSIONS_SQL);
          collected[inspection.id] = Object.freeze([
            ...result.rows,
            ...versions.rows,
          ]);
          continue;
        }
      }
      collected[inspection.id] = result.rows;
    }
    await client.query(TRANSACTION_STATEMENTS.commit);
    transactionStarted = false;
    return reportFromRows(collected);
  } catch {
    if (transactionStarted) {
      try {
        await client.query(TRANSACTION_STATEMENTS.rollback);
      } catch {
        // The original failure remains authoritative and sanitized.
      }
    }
    return failed("PREFLIGHT_EXECUTION_FAILED", connectionEstablished);
  } finally {
    try {
      await client.end();
    } catch {
      // No connection details are propagated from cleanup failures.
    }
  }
}

function environmentSource(): MaintenanceConfigurationSource {
  return Object.freeze({
    read(name: string): string | undefined {
      return process.env[name];
    },
  });
}

async function main(): Promise<void> {
  const report = await runProductionSchemaPreflight(environmentSource());
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.overall !== "PASS") process.exitCode = 1;
}

const invokedPath = process.argv[1]
  ? path.resolve(process.argv[1])
  : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  void main();
}
