import "server-only";

import { Client, type ClientConfig } from "pg";

import {
  BIRELLO_PREFLIGHT_REQUIRED_TABLES,
  BIRELLO_PREFLIGHT_ROLE,
  type BirelloPreflightRequiredTable,
  type BirelloPreflightRequiredTablePrivileges,
} from "./birello-production-preflight-executor";

export const BIRELLO_MAINTENANCE_OPERATION =
  "BIRELLO_PREFLIGHT_READER_PRIVILEGE_REMEDIATION_V1" as const;
export const BIRELLO_FIT_VISIBILITY_OPERATION =
  "PREFLIGHT_READER_KNOWLEDGE_FIT_VISIBILITY" as const;
export type BirelloMaintenanceOperation =
  | typeof BIRELLO_MAINTENANCE_OPERATION
  | typeof BIRELLO_FIT_VISIBILITY_OPERATION;
export const BIRELLO_FIT_VISIBILITY_TABLES = Object.freeze([
  "knowledge_retrieval_metadata",
  "knowledge_trust_domains",
] as const);
type BirelloFitVisibilityTable = typeof BIRELLO_FIT_VISIBILITY_TABLES[number];
export const BIRELLO_MAINTENANCE_POLICY_NAME =
  "birello_preflight_reader_select" as const;
export const BIRELLO_MAINTENANCE_POLICY_USING = "true" as const;
export const BIRELLO_MAINTENANCE_LOGICAL_MUTATION_COUNT = 12 as const;
export const BIRELLO_FIT_VISIBILITY_LOGICAL_MUTATION_COUNT = 4 as const;
export const BIRELLO_MAINTENANCE_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_MAINTENANCE_ENABLED",
  target: "BIRELLO_PRODUCTION_MAINTENANCE_TARGET",
  authorization: "BIRELLO_PRODUCTION_MAINTENANCE_AUTHORIZATION",
  databaseUrl: "BIRELLO_PRODUCTION_MAINTENANCE_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_MAINTENANCE_DATABASE_NAME",
  expectedHost: "BIRELLO_PRODUCTION_MAINTENANCE_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_MAINTENANCE_PROJECT_REF",
  expectedUser: "BIRELLO_PRODUCTION_MAINTENANCE_EXPECTED_USER",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_MAINTENANCE_DATABASE_URL",
} as const);

const FORBIDDEN_MAINTENANCE_USERS = new Set([
  BIRELLO_PREFLIGHT_ROLE,
  "birello_knowledge_ingestor",
  "birello_knowledge_reader",
  "anon",
  "authenticated",
  "service_role",
]);

export type BirelloMaintenanceMode = "validate" | "apply";
export type BirelloMaintenanceConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string;
  host: string;
  port: number;
  database: string;
  projectRef: string;
  expectedUser: string;
  verifiedTls: boolean;
  caMechanism: "NODE_EXTRA_CA_CERTS" | "SYSTEM_TRUST_STORE" | "LOCAL_TEST_ONLY";
}>;

export type BirelloMaintenanceClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type BirelloMaintenanceClientFactory =
  (configuration: BirelloMaintenanceConfiguration) => BirelloMaintenanceClient;

type BooleanMap = BirelloPreflightRequiredTablePrivileges;
export type BirelloMaintenanceState = Readonly<{
  database: string;
  maintenanceUser: string;
  publicSchemaUsage: boolean;
  tableSelect: BooleanMap;
  canonicalPolicies: BooleanMap;
  policyCollisions: BooleanMap;
  rlsEnabled: BooleanMap;
  maintenanceOwnsTables: BooleanMap;
  extraKnowledgeSelectCount: number;
  knowledgeWritePrivilegeCount: number;
  schemaCreate: boolean;
  superuser: boolean;
  createDb: boolean;
  createRole: boolean;
  bypassRls: boolean;
  rpc037: boolean;
  rpc038: boolean;
  rpc039: boolean;
  rpc040: boolean;
  membershipCount: number;
}>;

type FailureCode =
  | "CONFIGURATION_INVALID"
  | "TARGET_IDENTITY_MISMATCH"
  | "MAINTENANCE_IDENTITY_MISMATCH"
  | "MAINTENANCE_AUTHORITY_INSUFFICIENT"
  | "BASELINE_MISMATCH"
  | "PARTIAL_STATE"
  | "POLICY_COLLISION"
  | "ALREADY_APPLIED"
  | "POSTCONDITION_FAILED"
  | "EXECUTION_FAILED";

export type BirelloMaintenanceReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode: FailureCode;
      failureStage: "configuration" | "connect" | "identity" | "precondition"
        | "mutation" | "postcondition" | "commit";
      sqlState: string | null;
      connectionAttempted: boolean;
      transactionBegan: boolean;
      transactionCommitted: false;
      transactionRolledBack: boolean;
      mutationCount: number;
      state: BirelloMaintenanceState | null;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      operationId: typeof BIRELLO_MAINTENANCE_OPERATION;
      mode: BirelloMaintenanceMode;
      target: Readonly<{
        host: string;
        port: number;
        database: string;
        projectRef: string;
        maintenanceUser: string;
        verifiedTls: boolean;
        caMechanism: BirelloMaintenanceConfiguration["caMechanism"];
      }>;
      state: BirelloMaintenanceState;
      transactionBegan: boolean;
      transactionCommitted: boolean;
      transactionRolledBack: false;
      mutationCount: number;
      secretsPrinted: false;
    }>;

export type BirelloFitVisibilityState = Readonly<{
  database: string;
  maintenanceUser: string;
  existingTableSelect: BooleanMap;
  existingCanonicalPolicies: BooleanMap;
  targetTableSelect: Readonly<Record<BirelloFitVisibilityTable, boolean>>;
  targetCanonicalPolicies: Readonly<Record<BirelloFitVisibilityTable, boolean>>;
  targetPolicyCollisions: Readonly<Record<BirelloFitVisibilityTable, boolean>>;
  targetRlsEnabled: Readonly<Record<BirelloFitVisibilityTable, boolean>>;
  maintenanceOwnsTargets: Readonly<Record<BirelloFitVisibilityTable, boolean>>;
  extraKnowledgeSelectCount: number;
  knowledgeWritePrivilegeCount: number;
  schemaCreate: boolean;
  superuser: boolean;
  createDb: boolean;
  createRole: boolean;
  bypassRls: boolean;
  executableFunctionCount: number;
  membershipCount: number;
}>;

export type BirelloFitVisibilityReport =
  | Extract<BirelloMaintenanceReport, { result: "CONFIGURATION_REQUIRED" }>
  | Readonly<{
      result: "REJECTED";
      failureCode: FailureCode;
      failureStage: "configuration" | "connect" | "identity" | "precondition"
        | "mutation" | "postcondition" | "commit";
      sqlState: string | null;
      connectionAttempted: boolean;
      transactionBegan: boolean;
      transactionCommitted: false;
      transactionRolledBack: boolean;
      mutationCount: number;
      state: BirelloFitVisibilityState | null;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      operationId: typeof BIRELLO_FIT_VISIBILITY_OPERATION;
      mode: BirelloMaintenanceMode;
      target: Readonly<{
        host: string;
        port: number;
        database: string;
        projectRef: string;
        maintenanceUser: string;
        verifiedTls: boolean;
        caMechanism: BirelloMaintenanceConfiguration["caMechanism"];
      }>;
      state: BirelloFitVisibilityState;
      transactionBegan: boolean;
      transactionCommitted: boolean;
      transactionRolledBack: false;
      mutationCount: number;
      secretsPrinted: false;
    }>;

function sqlMap(expression: (table: BirelloPreflightRequiredTable) => string): string {
  return `jsonb_build_object(${BIRELLO_PREFLIGHT_REQUIRED_TABLES
    .map((table) => `'${table}',${expression(table)}`).join(",")})`;
}

const requiredTableSqlList = BIRELLO_PREFLIGHT_REQUIRED_TABLES
  .map((table) => `'${table}'`).join(",");
const validPolicy = (table: string): string =>
  `x.schemaname='public' and x.tablename='${table}'`
  + ` and x.policyname='${BIRELLO_MAINTENANCE_POLICY_NAME}'`
  + ` and x.permissive='PERMISSIVE' and x.cmd='SELECT'`
  + ` and x.roles=array['${BIRELLO_PREFLIGHT_ROLE}'::name]`
  + ` and x.qual='${BIRELLO_MAINTENANCE_POLICY_USING}' and x.with_check is null`;

export const BIRELLO_MAINTENANCE_INSPECTION_SQL = `select
  current_database() as database,current_user as maintenance_user,
  pg_catalog.has_schema_privilege('${BIRELLO_PREFLIGHT_ROLE}','public','USAGE') as public_schema_usage,
  ${sqlMap((table) => `pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}','public.${table}','SELECT')`)} as table_select,
  ${sqlMap((table) => `exists(select 1 from pg_catalog.pg_policies x where ${validPolicy(table)})`)} as canonical_policies,
  ${sqlMap((table) => `exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='${table}' and x.policyname='${BIRELLO_MAINTENANCE_POLICY_NAME}' and not (${validPolicy(table)}))`)} as policy_collisions,
  ${sqlMap((table) => `exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='${table}' and c.relrowsecurity)`)} as rls_enabled,
  ${sqlMap((table) => `exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace join pg_catalog.pg_roles o on o.oid=c.relowner where n.nspname='public' and c.relname='${table}' and o.rolname=current_user)`)} as maintenance_owns_tables,
  (select count(*)::int from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
      and c.relkind in ('r','p','v','m','f') and c.relname not in (${requiredTableSqlList})
      and pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'SELECT')) as extra_knowledge_select_count,
  (select count(*)::int from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
      and c.relkind in ('r','p','v','m','f') and (
        pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'INSERT')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'UPDATE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'DELETE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'TRUNCATE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'REFERENCES')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'TRIGGER'))) as knowledge_write_privilege_count,
  pg_catalog.has_schema_privilege('${BIRELLO_PREFLIGHT_ROLE}','public','CREATE') as schema_create,
  r.rolsuper as superuser,r.rolcreatedb as create_db,r.rolcreaterole as create_role,
  r.rolbypassrls as bypass_rls,
  coalesce(pg_catalog.has_function_privilege('${BIRELLO_PREFLIGHT_ROLE}',pg_catalog.to_regprocedure('public.knowledge_ingest_curated_pack(jsonb)'),'EXECUTE'),false) as rpc037,
  coalesce(pg_catalog.has_function_privilege('${BIRELLO_PREFLIGHT_ROLE}',pg_catalog.to_regprocedure('public.knowledge_retrieve_evidence_packets(uuid[],text[])'),'EXECUTE'),false) as rpc038,
  coalesce(pg_catalog.has_function_privilege('${BIRELLO_PREFLIGHT_ROLE}',pg_catalog.to_regprocedure('public.knowledge_ingest_curated_locality_pack(jsonb)'),'EXECUTE'),false) as rpc039,
  coalesce(pg_catalog.has_function_privilege('${BIRELLO_PREFLIGHT_ROLE}',pg_catalog.to_regprocedure('public.knowledge_retrieve_anmeldung_context(uuid[],text)'),'EXECUTE'),false) as rpc040,
  (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) as membership_count
from pg_catalog.pg_roles r where r.rolname='${BIRELLO_PREFLIGHT_ROLE}'`;

export const BIRELLO_MAINTENANCE_GRANT_STATEMENTS = Object.freeze(
  BIRELLO_PREFLIGHT_REQUIRED_TABLES.map(
    (table) => `GRANT SELECT ON TABLE public.${table} TO ${BIRELLO_PREFLIGHT_ROLE}`,
  ),
);
export const BIRELLO_MAINTENANCE_POLICY_STATEMENTS = Object.freeze(
  BIRELLO_PREFLIGHT_REQUIRED_TABLES.map(
    (table) => `CREATE POLICY ${BIRELLO_MAINTENANCE_POLICY_NAME} ON public.${table}`
      + ` FOR SELECT TO ${BIRELLO_PREFLIGHT_ROLE} USING (${BIRELLO_MAINTENANCE_POLICY_USING})`,
  ),
);

const fitVisibilitySqlMap = (
  expression: (table: BirelloFitVisibilityTable) => string,
): string => `jsonb_build_object(${BIRELLO_FIT_VISIBILITY_TABLES
  .map((table) => `'${table}',${expression(table)}`).join(",")})`;

const allVisibleTableSqlList = [
  ...BIRELLO_PREFLIGHT_REQUIRED_TABLES,
  ...BIRELLO_FIT_VISIBILITY_TABLES,
].map((table) => `'${table}'`).join(",");

export const BIRELLO_FIT_VISIBILITY_INSPECTION_SQL = `select
  current_database() as database,current_user as maintenance_user,
  ${sqlMap((table) => `pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}','public.${table}','SELECT')`)} as existing_table_select,
  ${sqlMap((table) => `exists(select 1 from pg_catalog.pg_policies x where ${validPolicy(table)})`)} as existing_canonical_policies,
  ${fitVisibilitySqlMap((table) => `pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}','public.${table}','SELECT')`)} as target_table_select,
  ${fitVisibilitySqlMap((table) => `exists(select 1 from pg_catalog.pg_policies x where ${validPolicy(table)})`)} as target_canonical_policies,
  ${fitVisibilitySqlMap((table) => `exists(select 1 from pg_catalog.pg_policies x where x.schemaname='public' and x.tablename='${table}' and x.policyname='${BIRELLO_MAINTENANCE_POLICY_NAME}' and not (${validPolicy(table)}))`)} as target_policy_collisions,
  ${fitVisibilitySqlMap((table) => `exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='${table}' and c.relrowsecurity)`)} as target_rls_enabled,
  ${fitVisibilitySqlMap((table) => `exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace join pg_catalog.pg_roles o on o.oid=c.relowner where n.nspname='public' and c.relname='${table}' and o.rolname=current_user)`)} as maintenance_owns_targets,
  (select count(*)::int from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
      and c.relkind in ('r','p','v','m','f') and c.relname not in (${allVisibleTableSqlList})
      and pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'SELECT')) as extra_knowledge_select_count,
  (select count(*)::int from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
      and c.relkind in ('r','p','v','m','f') and (
        pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'INSERT')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'UPDATE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'DELETE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'TRUNCATE')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'REFERENCES')
        or pg_catalog.has_table_privilege('${BIRELLO_PREFLIGHT_ROLE}',c.oid,'TRIGGER'))) as knowledge_write_privilege_count,
  pg_catalog.has_schema_privilege('${BIRELLO_PREFLIGHT_ROLE}','public','CREATE') as schema_create,
  r.rolsuper as superuser,r.rolcreatedb as create_db,r.rolcreaterole as create_role,
  r.rolbypassrls as bypass_rls,
  (select count(*)::int from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname like 'knowledge\\_%' escape '\\'
      and pg_catalog.has_function_privilege('${BIRELLO_PREFLIGHT_ROLE}',p.oid,'EXECUTE'))
    as executable_function_count,
  (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) as membership_count
from pg_catalog.pg_roles r where r.rolname='${BIRELLO_PREFLIGHT_ROLE}'`;

export const BIRELLO_FIT_VISIBILITY_GRANT_STATEMENTS = Object.freeze(
  BIRELLO_FIT_VISIBILITY_TABLES.map(
    (table) => `GRANT SELECT ON TABLE public.${table} TO ${BIRELLO_PREFLIGHT_ROLE}`,
  ),
);
export const BIRELLO_FIT_VISIBILITY_POLICY_STATEMENTS = Object.freeze(
  BIRELLO_FIT_VISIBILITY_TABLES.map(
    (table) => `CREATE POLICY ${BIRELLO_MAINTENANCE_POLICY_NAME} ON public.${table}`
      + ` FOR SELECT TO ${BIRELLO_PREFLIGHT_ROLE} USING (${BIRELLO_MAINTENANCE_POLICY_USING})`,
  ),
);

function requiredNames(): readonly string[] {
  return [
    BIRELLO_MAINTENANCE_ENV.enabled,
    BIRELLO_MAINTENANCE_ENV.target,
    BIRELLO_MAINTENANCE_ENV.authorization,
    BIRELLO_MAINTENANCE_ENV.databaseUrl,
    BIRELLO_MAINTENANCE_ENV.databaseName,
    BIRELLO_MAINTENANCE_ENV.expectedHost,
    BIRELLO_MAINTENANCE_ENV.projectRef,
    BIRELLO_MAINTENANCE_ENV.expectedUser,
  ];
}

export function configurationFromBirelloMaintenanceEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
  operation: BirelloMaintenanceOperation = BIRELLO_MAINTENANCE_OPERATION,
): BirelloMaintenanceConfiguration | BirelloMaintenanceReport {
  const missing = requiredNames().filter((name) => !environment[name]?.trim());
  if (missing.length) {
    return Object.freeze({
      result: "CONFIGURATION_REQUIRED" as const,
      missing: Object.freeze(missing),
      connectionAttempted: false as const,
      secretsPrinted: false as const,
    });
  }
  try {
    const url = new URL(environment[BIRELLO_MAINTENANCE_ENV.databaseUrl]!);
    const database = environment[BIRELLO_MAINTENANCE_ENV.databaseName]!.trim();
    const host = environment[BIRELLO_MAINTENANCE_ENV.expectedHost]!.trim().toLowerCase();
    const projectRef = environment[BIRELLO_MAINTENANCE_ENV.projectRef]!.trim().toLowerCase();
    const expectedUser = environment[BIRELLO_MAINTENANCE_ENV.expectedUser]!.trim();
    const acceptedUsers = new Set([expectedUser, `${expectedUser}.${projectRef}`]);
    const poolerHost = /\.pooler\.supabase\.com$/i.test(host);
    const directHost = host === `db.${projectRef}.supabase.co`;
    const projectIdentityMatches = poolerHost
      ? url.username === `${expectedUser}.${projectRef}`
      : directHost && url.username === expectedUser;
    const forbiddenParameters = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl")
      || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (
      environment[BIRELLO_MAINTENANCE_ENV.enabled] !== "true"
      || environment[BIRELLO_MAINTENANCE_ENV.target] !== "production"
      || environment[BIRELLO_MAINTENANCE_ENV.authorization] !== operation
      || environment[BIRELLO_MAINTENANCE_ENV.forbiddenPublicUrl]
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || !url.password || !/^[a-zA-Z0-9_@.-]{1,63}$/.test(expectedUser)
      || FORBIDDEN_MAINTENANCE_USERS.has(expectedUser)
      || !acceptedUsers.has(url.username)
      || !projectIdentityMatches
      || url.hostname.toLowerCase() !== host || url.pathname.slice(1) !== database
      || !/^[a-z0-9]{20}$/.test(projectRef)
      || ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
      || /vaylo|dna/i.test(host) || forbiddenParameters
    ) throw new Error("invalid");
    return Object.freeze({
      target: "production" as const,
      connectionString: url.toString(),
      host: url.hostname,
      port: url.port ? Number(url.port) : 5432,
      database,
      projectRef,
      expectedUser,
      verifiedTls: true,
      caMechanism: environment.NODE_EXTRA_CA_CERTS
        ? "NODE_EXTRA_CA_CERTS" as const
        : "SYSTEM_TRUST_STORE" as const,
    });
  } catch {
    return rejected("CONFIGURATION_INVALID", "configuration", false);
  }
}

function visibilityBoolMap(
  value: unknown,
): Readonly<Record<BirelloFitVisibilityTable, boolean>> {
  const record = typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
  return Object.freeze(Object.fromEntries(BIRELLO_FIT_VISIBILITY_TABLES.map(
    (table) => [table, record[table] === true],
  )) as Record<BirelloFitVisibilityTable, boolean>);
}

function visibilityStateFromRow(
  row: Record<string, unknown> | undefined,
): BirelloFitVisibilityState {
  if (!row) throw new Error("STATE_UNAVAILABLE");
  return Object.freeze({
    database: String(row.database),
    maintenanceUser: String(row.maintenance_user),
    existingTableSelect: boolMap(row.existing_table_select),
    existingCanonicalPolicies: boolMap(row.existing_canonical_policies),
    targetTableSelect: visibilityBoolMap(row.target_table_select),
    targetCanonicalPolicies: visibilityBoolMap(row.target_canonical_policies),
    targetPolicyCollisions: visibilityBoolMap(row.target_policy_collisions),
    targetRlsEnabled: visibilityBoolMap(row.target_rls_enabled),
    maintenanceOwnsTargets: visibilityBoolMap(row.maintenance_owns_targets),
    extraKnowledgeSelectCount: Number(row.extra_knowledge_select_count),
    knowledgeWritePrivilegeCount: Number(row.knowledge_write_privilege_count),
    schemaCreate: row.schema_create === true,
    superuser: row.superuser === true,
    createDb: row.create_db === true,
    createRole: row.create_role === true,
    bypassRls: row.bypass_rls === true,
    executableFunctionCount: Number(row.executable_function_count),
    membershipCount: Number(row.membership_count),
  });
}

function allVisibility(
  map: Readonly<Record<BirelloFitVisibilityTable, boolean>>,
  expected: boolean,
): boolean {
  return BIRELLO_FIT_VISIBILITY_TABLES.every((table) => map[table] === expected);
}

function visibilityProhibitedSafe(state: BirelloFitVisibilityState): boolean {
  return all(state.existingTableSelect, true)
    && all(state.existingCanonicalPolicies, true)
    && allVisibility(state.targetRlsEnabled, true)
    && state.extraKnowledgeSelectCount === 0
    && state.knowledgeWritePrivilegeCount === 0
    && !state.schemaCreate && !state.superuser && !state.createDb
    && !state.createRole && !state.bypassRls
    && state.executableFunctionCount === 0
    && state.membershipCount === 0;
}

function visibilityBaselineFailure(
  state: BirelloFitVisibilityState,
): FailureCode | null {
  if (Object.values(state.targetPolicyCollisions).some(Boolean)) return "POLICY_COLLISION";
  if (!visibilityProhibitedSafe(state)) return "BASELINE_MISMATCH";
  const selected = Object.values(state.targetTableSelect).filter(Boolean).length;
  const policies = Object.values(state.targetCanonicalPolicies).filter(Boolean).length;
  if (selected === 2 && policies === 2) return "ALREADY_APPLIED";
  if (selected !== 0 || policies !== 0) return "PARTIAL_STATE";
  return null;
}

function visibilityPostconditionsPass(state: BirelloFitVisibilityState): boolean {
  return visibilityProhibitedSafe(state)
    && allVisibility(state.targetTableSelect, true)
    && allVisibility(state.targetCanonicalPolicies, true)
    && !Object.values(state.targetPolicyCollisions).some(Boolean);
}

function productionClientFactory(
  configuration: BirelloMaintenanceConfiguration,
): BirelloMaintenanceClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_preflight_reader_privilege_remediation_v1",
  };
  const client = new Client(clientConfig);
  return {
    connect: async () => { await client.connect(); },
    query: async (sql) => ({ rows: (await client.query(sql)).rows }),
    end: () => client.end(),
  };
}

function boolMap(value: unknown): BooleanMap {
  const record = typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
  return Object.freeze(Object.fromEntries(BIRELLO_PREFLIGHT_REQUIRED_TABLES.map(
    (table) => [table, record[table] === true],
  )) as Record<BirelloPreflightRequiredTable, boolean>);
}

function stateFromRow(row: Record<string, unknown> | undefined): BirelloMaintenanceState {
  if (!row) throw new Error("STATE_UNAVAILABLE");
  return Object.freeze({
    database: String(row.database),
    maintenanceUser: String(row.maintenance_user),
    publicSchemaUsage: row.public_schema_usage === true,
    tableSelect: boolMap(row.table_select),
    canonicalPolicies: boolMap(row.canonical_policies),
    policyCollisions: boolMap(row.policy_collisions),
    rlsEnabled: boolMap(row.rls_enabled),
    maintenanceOwnsTables: boolMap(row.maintenance_owns_tables),
    extraKnowledgeSelectCount: Number(row.extra_knowledge_select_count),
    knowledgeWritePrivilegeCount: Number(row.knowledge_write_privilege_count),
    schemaCreate: row.schema_create === true,
    superuser: row.superuser === true,
    createDb: row.create_db === true,
    createRole: row.create_role === true,
    bypassRls: row.bypass_rls === true,
    rpc037: row.rpc037 === true,
    rpc038: row.rpc038 === true,
    rpc039: row.rpc039 === true,
    rpc040: row.rpc040 === true,
    membershipCount: Number(row.membership_count),
  });
}

function all(map: BooleanMap, expected: boolean): boolean {
  return BIRELLO_PREFLIGHT_REQUIRED_TABLES.every((table) => map[table] === expected);
}

function prohibitedSafe(state: BirelloMaintenanceState): boolean {
  return state.publicSchemaUsage
    && state.extraKnowledgeSelectCount === 0
    && state.knowledgeWritePrivilegeCount === 0
    && !state.schemaCreate && !state.superuser && !state.createDb
    && !state.createRole && !state.bypassRls
    && !state.rpc037 && !state.rpc038 && !state.rpc039 && !state.rpc040
    && state.membershipCount === 0
    && all(state.rlsEnabled, true);
}

function baselineFailure(state: BirelloMaintenanceState): FailureCode | null {
  if (Object.values(state.policyCollisions).some(Boolean)) return "POLICY_COLLISION";
  if (!prohibitedSafe(state)) return "BASELINE_MISMATCH";
  const selected = Object.values(state.tableSelect).filter(Boolean).length;
  const policies = Object.values(state.canonicalPolicies).filter(Boolean).length;
  if (selected === 6 && policies === 6) return "ALREADY_APPLIED";
  if (selected !== 0 || policies !== 0) return "PARTIAL_STATE";
  return null;
}

function postconditionsPass(state: BirelloMaintenanceState): boolean {
  return prohibitedSafe(state)
    && all(state.tableSelect, true)
    && all(state.canonicalPolicies, true)
    && !Object.values(state.policyCollisions).some(Boolean);
}

function safeSqlState(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : null;
}

function rejected(
  failureCode: FailureCode,
  failureStage: Extract<BirelloMaintenanceReport, { result: "REJECTED" }>["failureStage"],
  connectionAttempted: boolean,
  additions: Partial<Extract<BirelloMaintenanceReport, { result: "REJECTED" }>> = {},
): Extract<BirelloMaintenanceReport, { result: "REJECTED" }> {
  return Object.freeze({
    result: "REJECTED" as const,
    failureCode,
    failureStage,
    sqlState: null,
    connectionAttempted,
    transactionBegan: false,
    transactionCommitted: false as const,
    transactionRolledBack: false,
    mutationCount: 0,
    state: null,
    secretsPrinted: false as const,
    ...additions,
  });
}

function isReport(
  value: BirelloMaintenanceConfiguration | BirelloMaintenanceReport,
): value is BirelloMaintenanceReport {
  return "result" in value;
}

export async function runBirelloProductionMaintenance(
  configurationOrReport: BirelloMaintenanceConfiguration | BirelloMaintenanceReport,
  mode: BirelloMaintenanceMode,
  clientFactory: BirelloMaintenanceClientFactory = productionClientFactory,
): Promise<BirelloMaintenanceReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  const client = clientFactory(configuration);
  let connected = false;
  let began = false;
  let mutationCount = 0;
  let stage: Extract<BirelloMaintenanceReport, { result: "REJECTED" }>["failureStage"] = "connect";
  let lastState: BirelloMaintenanceState | null = null;
  try {
    await client.connect();
    connected = true;
    stage = "identity";
    lastState = stateFromRow((await client.query(BIRELLO_MAINTENANCE_INSPECTION_SQL)).rows[0]);
    if (lastState.database !== configuration.database) {
      return rejected("TARGET_IDENTITY_MISMATCH", stage, true, { state: lastState });
    }
    if (lastState.maintenanceUser !== configuration.expectedUser) {
      return rejected("MAINTENANCE_IDENTITY_MISMATCH", stage, true, { state: lastState });
    }
    if (!all(lastState.maintenanceOwnsTables, true)) {
      return rejected("MAINTENANCE_AUTHORITY_INSUFFICIENT", stage, true, { state: lastState });
    }
    const initialFailure = baselineFailure(lastState);
    if (mode === "validate") {
      if (initialFailure && initialFailure !== "ALREADY_APPLIED") {
        return rejected(initialFailure, "precondition", true, { state: lastState });
      }
      return Object.freeze({
        result: "PASS" as const,
        operationId: BIRELLO_MAINTENANCE_OPERATION,
        mode,
        target: Object.freeze({
          host: configuration.host, port: configuration.port,
          database: configuration.database, projectRef: configuration.projectRef,
          maintenanceUser: configuration.expectedUser,
          verifiedTls: configuration.verifiedTls, caMechanism: configuration.caMechanism,
        }),
        state: lastState,
        transactionBegan: false,
        transactionCommitted: false,
        transactionRolledBack: false as const,
        mutationCount: 0,
        secretsPrinted: false as const,
      });
    }
    if (initialFailure) {
      return rejected(initialFailure, "precondition", true, { state: lastState });
    }

    await client.query("BEGIN");
    began = true;
    stage = "precondition";
    lastState = stateFromRow((await client.query(BIRELLO_MAINTENANCE_INSPECTION_SQL)).rows[0]);
    const transactionFailure = baselineFailure(lastState);
    if (
      transactionFailure || lastState.database !== configuration.database
      || lastState.maintenanceUser !== configuration.expectedUser
      || !all(lastState.maintenanceOwnsTables, true)
    ) throw Object.assign(new Error("PRECONDITION_CHANGED"), {
      boundedFailureCode: transactionFailure ?? "BASELINE_MISMATCH",
    });

    stage = "mutation";
    for (const statement of BIRELLO_MAINTENANCE_GRANT_STATEMENTS) {
      await client.query(statement);
      mutationCount += 1;
    }
    for (const statement of BIRELLO_MAINTENANCE_POLICY_STATEMENTS) {
      await client.query(statement);
      mutationCount += 1;
    }

    stage = "postcondition";
    lastState = stateFromRow((await client.query(BIRELLO_MAINTENANCE_INSPECTION_SQL)).rows[0]);
    if (mutationCount !== BIRELLO_MAINTENANCE_LOGICAL_MUTATION_COUNT
      || !postconditionsPass(lastState)) {
      throw Object.assign(new Error("POSTCONDITION_FAILED"), {
        boundedFailureCode: "POSTCONDITION_FAILED",
      });
    }
    stage = "commit";
    await client.query("COMMIT");
    began = false;
    return Object.freeze({
      result: "PASS" as const,
      operationId: BIRELLO_MAINTENANCE_OPERATION,
      mode,
      target: Object.freeze({
        host: configuration.host, port: configuration.port,
        database: configuration.database, projectRef: configuration.projectRef,
        maintenanceUser: configuration.expectedUser,
        verifiedTls: configuration.verifiedTls, caMechanism: configuration.caMechanism,
      }),
      state: lastState,
      transactionBegan: true,
      transactionCommitted: true,
      transactionRolledBack: false as const,
      mutationCount,
      secretsPrinted: false as const,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) {
      try {
        await client.query("ROLLBACK");
        rolledBack = true;
      } catch { /* primary failure remains bounded */ }
    }
    const bounded = typeof error === "object" && error !== null && "boundedFailureCode" in error
      ? (error as { boundedFailureCode: FailureCode }).boundedFailureCode
      : "EXECUTION_FAILED";
    return rejected(bounded, stage, connected, {
      sqlState: safeSqlState(error),
      transactionBegan: began || rolledBack,
      transactionRolledBack: rolledBack,
      mutationCount,
      state: lastState,
    });
  } finally {
    if (connected) {
      try { await client.end(); } catch { /* sanitized cleanup */ }
    }
  }
}

function visibilityRejected(
  failureCode: FailureCode,
  failureStage: Extract<BirelloFitVisibilityReport, { result: "REJECTED" }>["failureStage"],
  connectionAttempted: boolean,
  additions: Partial<Extract<BirelloFitVisibilityReport, { result: "REJECTED" }>> = {},
): Extract<BirelloFitVisibilityReport, { result: "REJECTED" }> {
  return Object.freeze({
    result: "REJECTED" as const,
    failureCode,
    failureStage,
    sqlState: null,
    connectionAttempted,
    transactionBegan: false,
    transactionCommitted: false as const,
    transactionRolledBack: false,
    mutationCount: 0,
    state: null,
    secretsPrinted: false as const,
    ...additions,
  });
}

export async function runBirelloFitVisibilityMaintenance(
  configurationOrReport: BirelloMaintenanceConfiguration | BirelloMaintenanceReport,
  mode: BirelloMaintenanceMode,
  clientFactory: BirelloMaintenanceClientFactory = productionClientFactory,
): Promise<BirelloFitVisibilityReport> {
  if (isReport(configurationOrReport)) {
    if (configurationOrReport.result === "CONFIGURATION_REQUIRED") {
      return configurationOrReport;
    }
    if (configurationOrReport.result === "REJECTED") {
      return visibilityRejected(
        configurationOrReport.failureCode,
        configurationOrReport.failureStage,
        configurationOrReport.connectionAttempted,
        {
          sqlState: configurationOrReport.sqlState,
          transactionBegan: configurationOrReport.transactionBegan,
          transactionRolledBack: configurationOrReport.transactionRolledBack,
          mutationCount: configurationOrReport.mutationCount,
        },
      );
    }
    return visibilityRejected("CONFIGURATION_INVALID", "configuration", false);
  }
  const configuration = configurationOrReport;
  const client = clientFactory(configuration);
  let connected = false;
  let began = false;
  let mutationCount = 0;
  let stage: Extract<BirelloFitVisibilityReport, { result: "REJECTED" }>["failureStage"] =
    "connect";
  let lastState: BirelloFitVisibilityState | null = null;
  try {
    await client.connect();
    connected = true;
    stage = "identity";
    lastState = visibilityStateFromRow(
      (await client.query(BIRELLO_FIT_VISIBILITY_INSPECTION_SQL)).rows[0],
    );
    if (lastState.database !== configuration.database) {
      return visibilityRejected("TARGET_IDENTITY_MISMATCH", stage, true, {
        state: lastState,
      });
    }
    if (lastState.maintenanceUser !== configuration.expectedUser) {
      return visibilityRejected("MAINTENANCE_IDENTITY_MISMATCH", stage, true, {
        state: lastState,
      });
    }
    if (!allVisibility(lastState.maintenanceOwnsTargets, true)) {
      return visibilityRejected("MAINTENANCE_AUTHORITY_INSUFFICIENT", stage, true, {
        state: lastState,
      });
    }
    const initialFailure = visibilityBaselineFailure(lastState);
    if (mode === "validate") {
      if (initialFailure && initialFailure !== "ALREADY_APPLIED") {
        return visibilityRejected(initialFailure, "precondition", true, {
          state: lastState,
        });
      }
      return Object.freeze({
        result: "PASS" as const,
        operationId: BIRELLO_FIT_VISIBILITY_OPERATION,
        mode,
        target: Object.freeze({
          host: configuration.host,
          port: configuration.port,
          database: configuration.database,
          projectRef: configuration.projectRef,
          maintenanceUser: configuration.expectedUser,
          verifiedTls: configuration.verifiedTls,
          caMechanism: configuration.caMechanism,
        }),
        state: lastState,
        transactionBegan: false,
        transactionCommitted: false,
        transactionRolledBack: false as const,
        mutationCount: 0,
        secretsPrinted: false as const,
      });
    }
    if (initialFailure) {
      return visibilityRejected(initialFailure, "precondition", true, {
        state: lastState,
      });
    }

    await client.query("BEGIN");
    began = true;
    stage = "precondition";
    lastState = visibilityStateFromRow(
      (await client.query(BIRELLO_FIT_VISIBILITY_INSPECTION_SQL)).rows[0],
    );
    const transactionFailure = visibilityBaselineFailure(lastState);
    if (
      transactionFailure
      || lastState.database !== configuration.database
      || lastState.maintenanceUser !== configuration.expectedUser
      || !allVisibility(lastState.maintenanceOwnsTargets, true)
    ) {
      throw Object.assign(new Error("PRECONDITION_CHANGED"), {
        boundedFailureCode: transactionFailure ?? "BASELINE_MISMATCH",
      });
    }

    stage = "mutation";
    for (const statement of BIRELLO_FIT_VISIBILITY_GRANT_STATEMENTS) {
      await client.query(statement);
      mutationCount += 1;
    }
    for (const statement of BIRELLO_FIT_VISIBILITY_POLICY_STATEMENTS) {
      await client.query(statement);
      mutationCount += 1;
    }

    stage = "postcondition";
    lastState = visibilityStateFromRow(
      (await client.query(BIRELLO_FIT_VISIBILITY_INSPECTION_SQL)).rows[0],
    );
    if (
      mutationCount !== BIRELLO_FIT_VISIBILITY_LOGICAL_MUTATION_COUNT
      || !visibilityPostconditionsPass(lastState)
    ) {
      throw Object.assign(new Error("POSTCONDITION_FAILED"), {
        boundedFailureCode: "POSTCONDITION_FAILED",
      });
    }
    stage = "commit";
    await client.query("COMMIT");
    began = false;
    return Object.freeze({
      result: "PASS" as const,
      operationId: BIRELLO_FIT_VISIBILITY_OPERATION,
      mode,
      target: Object.freeze({
        host: configuration.host,
        port: configuration.port,
        database: configuration.database,
        projectRef: configuration.projectRef,
        maintenanceUser: configuration.expectedUser,
        verifiedTls: configuration.verifiedTls,
        caMechanism: configuration.caMechanism,
      }),
      state: lastState,
      transactionBegan: true,
      transactionCommitted: true,
      transactionRolledBack: false as const,
      mutationCount,
      secretsPrinted: false as const,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) {
      try {
        await client.query("ROLLBACK");
        rolledBack = true;
      } catch { /* primary failure remains bounded */ }
    }
    const bounded = typeof error === "object" && error !== null
      && "boundedFailureCode" in error
      ? (error as { boundedFailureCode: FailureCode }).boundedFailureCode
      : "EXECUTION_FAILED";
    return visibilityRejected(bounded, stage, connected, {
      sqlState: safeSqlState(error),
      transactionBegan: began || rolledBack,
      transactionRolledBack: rolledBack,
      mutationCount,
      state: lastState,
    });
  } finally {
    if (connected) {
      try {
        await client.end();
      } catch { /* sanitized cleanup */ }
    }
  }
}
