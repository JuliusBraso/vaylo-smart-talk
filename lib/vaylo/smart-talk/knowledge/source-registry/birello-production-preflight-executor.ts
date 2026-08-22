import "server-only";

import { Client, type ClientConfig } from "pg";

import {
  FIRST_PACK_CANONICAL_UNIT_IDS,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "../packs/de/anmeldung-ummeldung-abmeldung/pack";
import { stablePackEntityId } from "../packs/de/anmeldung-ummeldung-abmeldung/identity";
import { WEILTINGEN_PILOT } from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";

export const IMPLEMENTED_BIRELLO_REMOTE_PREFLIGHT_EXECUTOR = true as const;
export const BIRELLO_PREFLIGHT_ROLE = "birello_preflight_reader" as const;
export const BIRELLO_PREFLIGHT_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_PREFLIGHT_ENABLED",
  target: "BIRELLO_PRODUCTION_PREFLIGHT_TARGET",
  databaseUrl: "BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME",
  expectedHost: "BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL",
} as const);

export type BirelloPreflightConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string;
  host: string;
  port: number;
  database: string;
  user: typeof BIRELLO_PREFLIGHT_ROLE;
  verifiedTls: boolean;
  caMechanism: "NODE_EXTRA_CA_CERTS" | "SYSTEM_TRUST_STORE" | "LOCAL_TEST_ONLY";
}>;

export type BirelloPreflightClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;

export type BirelloPreflightClientFactory =
  (configuration: BirelloPreflightConfiguration) => BirelloPreflightClient;

export type BirelloPreflightReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode:
        | "CONFIGURATION_INVALID"
        | "TARGET_IDENTITY_MISMATCH"
        | "ROLE_IDENTITY_MISMATCH"
        | "READ_ONLY_MISMATCH"
        | "QUERY_CONTRACT_MISMATCH"
        | "EXECUTION_FAILED";
      connectionAttempted: boolean;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      connectionAttempted: true;
      target: Readonly<{
        host: string;
        port: number;
        database: string;
        role: typeof BIRELLO_PREFLIGHT_ROLE;
        verifiedTls: boolean;
        caMechanism: BirelloPreflightConfiguration["caMechanism"];
        transactionReadOnly: true;
      }>;
      migrationLedger: readonly string[];
      catalog039: Readonly<{
        requiredTablesPresent: boolean;
        requiredColumnsPresent: boolean;
        requiredEnumValuesPresent: boolean;
      }>;
      functions: readonly Readonly<{
        name: string;
        arguments: string;
        securityDefiner: boolean;
        fixedSearchPath: boolean;
      }>[];
      roles: readonly Readonly<{
        role: string;
        login: boolean;
        superuser: boolean;
        createDb: boolean;
        createRole: boolean;
        bypassRls: boolean;
      }>[];
      privileges: readonly Readonly<{
        role: string;
        schemaCreate: boolean;
        directKnowledgeDml: boolean;
        executableFunctions: readonly string[];
      }>[];
      firstPack: Readonly<{
        expectedIds: readonly string[];
        observedIds: readonly string[];
        missingIds: readonly string[];
        sourceOnlyV2AIdsPresent: readonly string[];
        duplicateSemanticCount: number;
      }>;
      weiltingen: Readonly<{
        municipality: number;
        scope: number;
        authority: number;
        competence: number;
        sources: number;
      }>;
      fixedQueryCount: number;
      secretsPrinted: false;
    }>;

const REQUIRED_TABLE_COLUMNS = Object.freeze({
  knowledge_trust_domains: ["id", "code", "name"],
  knowledge_jurisdictions: [
    "id", "parent_jurisdiction_id", "jurisdiction_level", "jurisdiction_code",
    "country_code", "name",
  ],
  knowledge_territorial_scopes: [
    "id", "scope_type", "jurisdiction_ids", "municipality_codes",
  ],
  knowledge_publishers: ["id", "trust_domain_id", "territorial_competence_id", "publisher_name"],
  knowledge_authorities: [
    "id", "publisher_id", "authority_name", "authority_type", "jurisdiction_id",
    "territorial_scope_id", "official_portal_url",
  ],
  knowledge_authority_competences: [
    "id", "authority_id", "territorial_scope_id", "subject_matter",
    "effective_from", "effective_until", "competence_source_version_id", "competence_passage_id",
  ],
  knowledge_sources: [
    "id", "publisher_id", "canonical_url", "official_domain", "normalized_origin",
    "jurisdiction_id", "territorial_scope_id", "issuing_authority_id", "source_class",
    "authority_level", "default_handling_mode",
  ],
  knowledge_source_versions: ["id", "source_id", "content_hash"],
  knowledge_source_passages: ["id", "source_version_id", "section_identifier", "text"],
  knowledge_processes: ["id", "title", "jurisdiction_id", "territorial_scope_id"],
  knowledge_source_handling_policies: [
    "id", "source_id", "information_class", "process_scope", "handling_mode",
    "freshness_class", "stale_behavior",
  ],
} as const);

const REQUIRED_ENUM_VALUES = Object.freeze({
  knowledge_source_class: ["AUTHORITY_PORTAL"],
  knowledge_authority_level: ["MUNICIPALITY"],
  knowledge_handling_mode: ["CACHE_AND_REVALIDATE", "FETCH_LIVE"],
  knowledge_freshness_class: ["EVENT_DRIVEN", "MONTHLY", "DAILY"],
  knowledge_stale_behavior: ["REVALIDATE_BEFORE_USE"],
  knowledge_information_class: [
    "AUTHORITY_COMPETENCE", "CONTACT_DETAILS", "LOCAL_PROCESS_VARIANT",
    "ONLINE_SERVICE_URL", "FORM_URL", "OPENING_HOURS",
  ],
} as const);

const FIRST_PACK_CLAIM_IDS = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) =>
  stablePackEntityId(`claim:${id}`));
const SOURCE_ONLY_CLAIM_IDS = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) =>
  stablePackEntityId(`claim:${id}`));
const PILOT_IDS = Object.freeze({
  municipality: stablePackEntityId("v2c-weiltingen:locality"),
  scope: stablePackEntityId("v2c-weiltingen:scope"),
  authority: stablePackEntityId("v2c-weiltingen:authority"),
  competence: stablePackEntityId("v2c-weiltingen:competence"),
  sources: [
    "anmeldung", "hours", "appointments",
  ].map((key) => stablePackEntityId(`v2c-weiltingen:source:${key}`)),
});

function sqlUuidArray(values: readonly string[]): string {
  return `array[${values.map((value) => `'${value}'::uuid`).join(",")}]`;
}

export const BIRELLO_PREFLIGHT_FIXED_QUERIES = Object.freeze({
  session: `select current_database() as database, current_user as role,
    current_setting('transaction_read_only') as transaction_read_only`,
  migrations: `select version::text as version
    from supabase_migrations.schema_migrations order by version::text`,
  columns: `select table_name, column_name
    from information_schema.columns
    where table_schema='public'
      and table_name = any(array[${Object.keys(REQUIRED_TABLE_COLUMNS)
        .map((name) => `'${name}'`).join(",")}])
    order by table_name, ordinal_position`,
  enums: `select t.typname as enum_name, e.enumlabel as enum_value
    from pg_catalog.pg_type t
    join pg_catalog.pg_namespace n on n.oid=t.typnamespace
    join pg_catalog.pg_enum e on e.enumtypid=t.oid
    where n.nspname='public'
      and t.typname = any(array[${Object.keys(REQUIRED_ENUM_VALUES)
        .map((name) => `'${name}'`).join(",")}])
    order by t.typname,e.enumsortorder`,
  functions: `select p.proname as name,
      pg_catalog.pg_get_function_identity_arguments(p.oid) as arguments,
      p.prosecdef as security_definer, coalesce(p.proconfig,'{}'::text[]) as config
    from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname = any(array[
      'knowledge_retrieve_evidence_packets',
      'knowledge_ingest_curated_pack',
      'knowledge_ingest_curated_locality_pack',
      'knowledge_retrieve_anmeldung_context'
    ]) order by p.proname`,
  roles: `select rolname as role,rolcanlogin as login,rolsuper as superuser,
      rolcreatedb as create_db,rolcreaterole as create_role,rolbypassrls as bypass_rls
    from pg_catalog.pg_roles where rolname = any(array[
      'birello_preflight_reader','birello_knowledge_ingestor','birello_knowledge_reader'
    ]) order by rolname`,
  privileges: `select r.rolname as role,
      pg_catalog.has_schema_privilege(r.rolname,'public','CREATE') as schema_create,
      exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
          and c.relkind in ('r','p','v','m','f')
          and (pg_catalog.has_table_privilege(r.rolname,c.oid,'INSERT')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'UPDATE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'DELETE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'TRUNCATE'))) as direct_dml,
      coalesce((select jsonb_agg(p.proname order by p.proname)
        from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname like 'knowledge\\_%' escape '\\'
          and pg_catalog.has_function_privilege(r.rolname,p.oid,'EXECUTE')),'[]'::jsonb) as executable
    from pg_catalog.pg_roles r where r.rolname = any(array[
      'birello_preflight_reader','birello_knowledge_ingestor','birello_knowledge_reader'
    ]) order by r.rolname`,
  firstPack: `select id::text as id, claim_text_canonical
    from public.knowledge_claims
    where id = any(${sqlUuidArray([...FIRST_PACK_CLAIM_IDS, ...SOURCE_ONLY_CLAIM_IDS])})
    order by id`,
  duplicates: `select count(*)::int as count from (
      select claim_text_canonical from public.knowledge_claims
      group by claim_text_canonical having count(*) > 1
    ) duplicate_claims`,
  weiltingen: `select
      (select count(*)::int from public.knowledge_jurisdictions
        where id='${PILOT_IDS.municipality}'::uuid and jurisdiction_code='${WEILTINGEN_PILOT.municipalityCode}') as municipality,
      (select count(*)::int from public.knowledge_territorial_scopes
        where id='${PILOT_IDS.scope}'::uuid) as scope,
      (select count(*)::int from public.knowledge_authorities
        where id='${PILOT_IDS.authority}'::uuid) as authority,
      (select count(*)::int from public.knowledge_authority_competences
        where id='${PILOT_IDS.competence}'::uuid) as competence,
      (select count(*)::int from public.knowledge_sources
        where id = any(${sqlUuidArray(PILOT_IDS.sources)})) as sources`,
} as const);

function productionClientFactory(configuration: BirelloPreflightConfiguration): BirelloPreflightClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_production_activation_preflight",
  };
  const client = new Client(clientConfig);
  return {
    connect: async () => { await client.connect(); },
    query: async (sql) => ({ rows: (await client.query(sql)).rows }),
    end: () => client.end(),
  };
}

function requiredEnvironmentNames(): readonly string[] {
  return [
    BIRELLO_PREFLIGHT_ENV.enabled,
    BIRELLO_PREFLIGHT_ENV.target,
    BIRELLO_PREFLIGHT_ENV.databaseUrl,
    BIRELLO_PREFLIGHT_ENV.databaseName,
    BIRELLO_PREFLIGHT_ENV.expectedHost,
  ];
}

export function configurationFromBirelloPreflightEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): BirelloPreflightConfiguration | BirelloPreflightReport {
  if (environment[BIRELLO_PREFLIGHT_ENV.forbiddenPublicUrl]) {
    return Object.freeze({
      result: "REJECTED" as const, failureCode: "CONFIGURATION_INVALID" as const,
      connectionAttempted: false, secretsPrinted: false,
    });
  }
  const missing = requiredEnvironmentNames().filter((name) => !environment[name]?.trim());
  if (missing.length) {
    return Object.freeze({
      result: "CONFIGURATION_REQUIRED" as const,
      missing: Object.freeze(missing),
      connectionAttempted: false as const,
      secretsPrinted: false as const,
    });
  }
  try {
    const url = new URL(environment[BIRELLO_PREFLIGHT_ENV.databaseUrl]!);
    const database = environment[BIRELLO_PREFLIGHT_ENV.databaseName]!.trim();
    const expectedHost = environment[BIRELLO_PREFLIGHT_ENV.expectedHost]!.trim().toLowerCase();
    const forbiddenParameters = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl") || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (
      environment[BIRELLO_PREFLIGHT_ENV.enabled] !== "true"
      || environment[BIRELLO_PREFLIGHT_ENV.target] !== "production"
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || url.username !== BIRELLO_PREFLIGHT_ROLE
      || !url.password
      || url.hostname.toLowerCase() !== expectedHost
      || url.pathname.slice(1) !== database
      || ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
      || forbiddenParameters
    ) throw new Error("invalid");
    return Object.freeze({
      target: "production" as const,
      connectionString: url.toString(),
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      user: BIRELLO_PREFLIGHT_ROLE,
      verifiedTls: true,
      caMechanism: environment.NODE_EXTRA_CA_CERTS
        ? "NODE_EXTRA_CA_CERTS" as const
        : "SYSTEM_TRUST_STORE" as const,
    });
  } catch {
    return Object.freeze({
      result: "REJECTED" as const, failureCode: "CONFIGURATION_INVALID" as const,
      connectionAttempted: false, secretsPrinted: false,
    });
  }
}

function isReport(value: BirelloPreflightConfiguration | BirelloPreflightReport):
  value is BirelloPreflightReport {
  return "result" in value;
}

function valuesFor(rows: readonly Record<string, unknown>[], key: string): string[] {
  return rows.map((row) => row[key]).filter((value): value is string => typeof value === "string");
}

export async function runBirelloProductionPreflight(
  configurationOrReport: BirelloPreflightConfiguration | BirelloPreflightReport,
  clientFactory: BirelloPreflightClientFactory = productionClientFactory,
): Promise<BirelloPreflightReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  let connected = false;
  let transaction = false;
  let client: BirelloPreflightClient;
  try {
    client = clientFactory(configuration);
    await client.connect();
    connected = true;
    await client.query("BEGIN READ ONLY");
    transaction = true;
    await client.query("SET LOCAL statement_timeout = '10s'");
    await client.query("SET LOCAL lock_timeout = '1s'");
    await client.query("SET LOCAL idle_in_transaction_session_timeout = '15s'");

    const results: Record<string, readonly Record<string, unknown>[]> = {
      session: (await client.query(BIRELLO_PREFLIGHT_FIXED_QUERIES.session)).rows,
    };
    const session = results.session[0];
    if (session?.database !== configuration.database) {
      throw new Error("TARGET_IDENTITY_MISMATCH");
    }
    if (session?.role !== BIRELLO_PREFLIGHT_ROLE) {
      throw new Error("ROLE_IDENTITY_MISMATCH");
    }
    if (session?.transaction_read_only !== "on") {
      throw new Error("READ_ONLY_MISMATCH");
    }
    for (const [id, sql] of Object.entries(BIRELLO_PREFLIGHT_FIXED_QUERIES)) {
      if (id !== "session") results[id] = (await client.query(sql)).rows;
    }

    const columnRows = results.columns ?? [];
    const requiredTablesPresent = Object.keys(REQUIRED_TABLE_COLUMNS).every((table) =>
      columnRows.some((row) => row.table_name === table));
    const requiredColumnsPresent = Object.entries(REQUIRED_TABLE_COLUMNS).every(([table, columns]) =>
      columns.every((column) => columnRows.some((row) =>
        row.table_name === table && row.column_name === column)));
    const enumRows = results.enums ?? [];
    const requiredEnumValuesPresent = Object.entries(REQUIRED_ENUM_VALUES).every(([type, values]) =>
      values.every((value) => enumRows.some((row) =>
        row.enum_name === type && row.enum_value === value)));
    const functionRows = results.functions ?? [];
    const roleRows = results.roles ?? [];
    const privilegeRows = results.privileges ?? [];
    const observedClaimIds = valuesFor(results.firstPack ?? [], "id");
    const expectedClaimIds = [...FIRST_PACK_CLAIM_IDS].sort();
    const sourceOnlyPresent = SOURCE_ONLY_CLAIM_IDS.filter((id) => observedClaimIds.includes(id));

    await client.query("COMMIT");
    transaction = false;
    return Object.freeze({
      result: "PASS" as const,
      connectionAttempted: true as const,
      target: Object.freeze({
        host: configuration.host, port: configuration.port, database: configuration.database,
        role: BIRELLO_PREFLIGHT_ROLE, verifiedTls: configuration.verifiedTls,
        caMechanism: configuration.caMechanism, transactionReadOnly: true as const,
      }),
      migrationLedger: Object.freeze(valuesFor(results.migrations ?? [], "version")),
      catalog039: Object.freeze({
        requiredTablesPresent, requiredColumnsPresent, requiredEnumValuesPresent,
      }),
      functions: Object.freeze(functionRows.map((row) => Object.freeze({
        name: String(row.name), arguments: String(row.arguments),
        securityDefiner: row.security_definer === true,
        fixedSearchPath: Array.isArray(row.config)
          && row.config.some((value) => value === "search_path=pg_catalog, public"),
      }))),
      roles: Object.freeze(roleRows.map((row) => Object.freeze({
        role: String(row.role), login: row.login === true, superuser: row.superuser === true,
        createDb: row.create_db === true, createRole: row.create_role === true,
        bypassRls: row.bypass_rls === true,
      }))),
      privileges: Object.freeze(privilegeRows.map((row) => Object.freeze({
        role: String(row.role), schemaCreate: row.schema_create === true,
        directKnowledgeDml: row.direct_dml === true,
        executableFunctions: Object.freeze(Array.isArray(row.executable)
          ? row.executable.filter((value): value is string => typeof value === "string")
          : []),
      }))),
      firstPack: Object.freeze({
        expectedIds: Object.freeze(expectedClaimIds),
        observedIds: Object.freeze(observedClaimIds),
        missingIds: Object.freeze(expectedClaimIds.filter((id) => !observedClaimIds.includes(id))),
        sourceOnlyV2AIdsPresent: Object.freeze(sourceOnlyPresent),
        duplicateSemanticCount: Number(results.duplicates?.[0]?.count ?? -1),
      }),
      weiltingen: Object.freeze({
        municipality: Number(results.weiltingen?.[0]?.municipality ?? -1),
        scope: Number(results.weiltingen?.[0]?.scope ?? -1),
        authority: Number(results.weiltingen?.[0]?.authority ?? -1),
        competence: Number(results.weiltingen?.[0]?.competence ?? -1),
        sources: Number(results.weiltingen?.[0]?.sources ?? -1),
      }),
      fixedQueryCount: Object.keys(BIRELLO_PREFLIGHT_FIXED_QUERIES).length,
      secretsPrinted: false as const,
    });
  } catch (error) {
    if (transaction) {
      try { await client!.query("ROLLBACK"); } catch { /* sanitized primary failure */ }
    }
    const message = error instanceof Error ? error.message : "";
    const failureCode =
      message === "TARGET_IDENTITY_MISMATCH" ? "TARGET_IDENTITY_MISMATCH"
      : message === "ROLE_IDENTITY_MISMATCH" ? "ROLE_IDENTITY_MISMATCH"
      : message === "READ_ONLY_MISMATCH" ? "READ_ONLY_MISMATCH"
      : message === "QUERY_CONTRACT_MISMATCH" ? "QUERY_CONTRACT_MISMATCH"
      : "EXECUTION_FAILED";
    return Object.freeze({
      result: "REJECTED" as const, failureCode,
      connectionAttempted: connected, secretsPrinted: false as const,
    });
  } finally {
    if (connected) {
      try { await client!.end(); } catch { /* sanitized cleanup */ }
    }
  }
}
