import "server-only";

import { Client, type ClientConfig } from "pg";

import {
  BIRELLO_MAINTENANCE_ENV,
} from "./birello-production-maintenance-executor";
import { BIRELLO_PREFLIGHT_ROLE } from "./birello-production-preflight-executor";

export const BIRELLO_RUNTIME_RPC_GRANT_OPERATION =
  "BIRELLO_LOCALITY_RUNTIME_RPC_GRANTS_V1" as const;
export const BIRELLO_RUNTIME_RPC_GRANT_COUNT = 2 as const;
export const BIRELLO_RUNTIME_RPC_GRANTS = Object.freeze([
  Object.freeze({
    id: "G1",
    signature: "public.knowledge_ingest_curated_locality_pack(jsonb)",
    name: "knowledge_ingest_curated_locality_pack",
    role: "birello_knowledge_ingestor",
  }),
  Object.freeze({
    id: "G2",
    signature: "public.knowledge_retrieve_anmeldung_context(uuid[],text)",
    name: "knowledge_retrieve_anmeldung_context",
    role: "birello_knowledge_reader",
  }),
] as const);
export const BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS = Object.freeze(
  BIRELLO_RUNTIME_RPC_GRANTS.map(
    ({ signature, role }) => `GRANT EXECUTE ON FUNCTION ${signature} TO ${role}`,
  ),
);

const APPLICATION_ROLES = Object.freeze([
  "birello_knowledge_ingestor",
  "birello_knowledge_reader",
  BIRELLO_PREFLIGHT_ROLE,
  "PUBLIC",
  "anon",
  "authenticated",
  "service_role",
] as const);
const FORBIDDEN_MAINTENANCE_USERS = new Set<string>(APPLICATION_ROLES);
const EXPECTED_037 = "public.knowledge_ingest_curated_pack(jsonb)";
const EXPECTED_038 = "public.knowledge_retrieve_evidence_packets(uuid[],text[])";

export type BirelloRuntimeRpcGrantMode = "validate" | "apply";
export type BirelloRuntimeRpcGrantConfiguration = Readonly<{
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
export type BirelloRuntimeRpcGrantClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type BirelloRuntimeRpcGrantClientFactory =
  (configuration: BirelloRuntimeRpcGrantConfiguration) => BirelloRuntimeRpcGrantClient;

type ExecuteMatrix = Readonly<Record<typeof APPLICATION_ROLES[number], boolean>>;
type FunctionState = Readonly<{
  nameCount: number;
  exactExists: boolean;
  securityDefiner: boolean;
  fixedSearchPath: boolean;
  owner: string | null;
  execute: ExecuteMatrix;
}>;
export type BirelloRuntimeRpcGrantState = Readonly<{
  database: string;
  maintenanceUser: string;
  rpc039: FunctionState;
  rpc040: FunctionState;
  rpc037Baseline: boolean;
  rpc038Baseline: boolean;
  roleSafetyBaseline: boolean;
  safetyFingerprint: string;
}>;

export type BirelloRuntimeRpcGrantFailureCode =
  | "CONFIGURATION_INVALID"
  | "TARGET_IDENTITY_MISMATCH"
  | "MAINTENANCE_IDENTITY_MISMATCH"
  | "FUNCTIONS_NOT_DEPLOYED"
  | "FUNCTION_SIGNATURE_MISMATCH"
  | "FUNCTION_SECURITY_MISMATCH"
  | "MAINTENANCE_AUTHORITY_INSUFFICIENT"
  | "PARTIAL_STATE"
  | "ALREADY_APPLIED"
  | "UNEXPECTED_EXECUTE_EXPOSURE"
  | "BASELINE_MISMATCH"
  | "POSTCONDITION_FAILED"
  | "EXECUTION_FAILED";

export type BirelloRuntimeRpcGrantReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode: BirelloRuntimeRpcGrantFailureCode;
      failureStage: "configuration" | "connect" | "identity" | "precondition"
        | "mutation" | "postcondition" | "commit";
      sqlState: string | null;
      connectionAttempted: boolean;
      transactionBegan: boolean;
      transactionCommitted: false;
      transactionRolledBack: boolean;
      mutationCount: number;
      state: BirelloRuntimeRpcGrantState | null;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      operationId: typeof BIRELLO_RUNTIME_RPC_GRANT_OPERATION;
      mode: BirelloRuntimeRpcGrantMode;
      readyForApply: boolean;
      target: Readonly<{
        host: string;
        port: number;
        database: string;
        projectRef: string;
        maintenanceUser: string;
        verifiedTls: boolean;
        caMechanism: BirelloRuntimeRpcGrantConfiguration["caMechanism"];
      }>;
      state: BirelloRuntimeRpcGrantState;
      transactionBegan: boolean;
      transactionCommitted: boolean;
      transactionRolledBack: false;
      mutationCount: number;
      secretsPrinted: false;
    }>;

function privilegeExpression(role: typeof APPLICATION_ROLES[number], signature: string): string {
  if (role !== "PUBLIC") {
    return `coalesce(pg_catalog.has_function_privilege(
      '${role}',pg_catalog.to_regprocedure('${signature}'),'EXECUTE'),false)`;
  }
  return `coalesce((select bool_or(a.grantee=0 and a.privilege_type='EXECUTE')
    from pg_catalog.pg_proc p
    cross join lateral pg_catalog.aclexplode(coalesce(
      p.proacl,pg_catalog.acldefault('f',p.proowner))) a
    where p.oid=pg_catalog.to_regprocedure('${signature}')),false)`;
}

function executeObject(signature: string): string {
  return `jsonb_build_object(${APPLICATION_ROLES.map((role) =>
    `'${role}',${privilegeExpression(role, signature)}`,
  ).join(",")})`;
}

function intendedBaselineExpression(
  signature: string,
  intendedRole: typeof APPLICATION_ROLES[number],
): string {
  return APPLICATION_ROLES.map((role) => {
    const value = privilegeExpression(role, signature);
    return role === intendedRole ? value : `not ${value}`;
  }).join(" and ");
}

function functionColumns(
  prefix: "rpc039" | "rpc040",
  name: string,
  signature: string,
): string {
  return `(select count(*)::int from pg_catalog.pg_proc p
      join pg_catalog.pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='${name}') as ${prefix}_name_count,
    pg_catalog.to_regprocedure('${signature}') is not null as ${prefix}_exact_exists,
    coalesce((select p.prosecdef from pg_catalog.pg_proc p
      where p.oid=pg_catalog.to_regprocedure('${signature}')),false) as ${prefix}_security_definer,
    coalesce((select p.proconfig=array['search_path=pg_catalog, public']::text[]
      from pg_catalog.pg_proc p where p.oid=pg_catalog.to_regprocedure('${signature}')),false)
      as ${prefix}_fixed_search_path,
    (select o.rolname from pg_catalog.pg_proc p join pg_catalog.pg_roles o on o.oid=p.proowner
      where p.oid=pg_catalog.to_regprocedure('${signature}')) as ${prefix}_owner,
    ${executeObject(signature)} as ${prefix}_execute`;
}

export const BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL = `select
  current_database() as database,current_user as maintenance_user,
  ${functionColumns("rpc039", BIRELLO_RUNTIME_RPC_GRANTS[0].name, BIRELLO_RUNTIME_RPC_GRANTS[0].signature)},
  ${functionColumns("rpc040", BIRELLO_RUNTIME_RPC_GRANTS[1].name, BIRELLO_RUNTIME_RPC_GRANTS[1].signature)},
  ${intendedBaselineExpression(EXPECTED_037, "birello_knowledge_ingestor")}
    as rpc037_baseline,
  ${intendedBaselineExpression(EXPECTED_038, "birello_knowledge_reader")}
    as rpc038_baseline,
  (select bool_and(not r.rolsuper and not r.rolcreatedb and not r.rolcreaterole
      and not r.rolbypassrls and not pg_catalog.has_schema_privilege(r.rolname,'public','CREATE')
      and not exists(select 1 from pg_catalog.pg_auth_members m where m.member=r.oid))
    from pg_catalog.pg_roles r where r.rolname in
      ('birello_knowledge_ingestor','birello_knowledge_reader','${BIRELLO_PREFLIGHT_ROLE}'))
    as role_safety_baseline,
  (select pg_catalog.md5(jsonb_agg(to_jsonb(s) order by s.role)::text) from (
    select r.rolname as role,r.rolcanlogin,r.rolsuper,r.rolcreatedb,r.rolcreaterole,
      r.rolinherit,r.rolreplication,r.rolbypassrls,r.rolconnlimit,
      pg_catalog.has_schema_privilege(r.rolname,'public','CREATE') as schema_create,
      (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) memberships,
      (select count(*)::int from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
        where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
          and c.relkind in ('r','p','v','m','f')
          and (pg_catalog.has_table_privilege(r.rolname,c.oid,'SELECT')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'INSERT')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'UPDATE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'DELETE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'TRUNCATE')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'REFERENCES')
            or pg_catalog.has_table_privilege(r.rolname,c.oid,'TRIGGER'))) table_privilege_count
    from pg_catalog.pg_roles r where r.rolname in
      ('birello_knowledge_ingestor','birello_knowledge_reader','${BIRELLO_PREFLIGHT_ROLE}')
  ) s) as safety_fingerprint`;

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

export function configurationFromBirelloRuntimeRpcGrantEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): BirelloRuntimeRpcGrantConfiguration | BirelloRuntimeRpcGrantReport {
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
      || environment[BIRELLO_MAINTENANCE_ENV.authorization]
        !== BIRELLO_RUNTIME_RPC_GRANT_OPERATION
      || environment[BIRELLO_MAINTENANCE_ENV.forbiddenPublicUrl]
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || !url.password || !/^[a-zA-Z0-9_@.-]{1,63}$/.test(expectedUser)
      || expectedUser !== "postgres"
      || FORBIDDEN_MAINTENANCE_USERS.has(expectedUser)
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

function productionClientFactory(
  configuration: BirelloRuntimeRpcGrantConfiguration,
): BirelloRuntimeRpcGrantClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_locality_runtime_rpc_grants_v1",
  };
  const client = new Client(clientConfig);
  return {
    connect: async () => { await client.connect(); },
    query: async (sql) => ({ rows: (await client.query(sql)).rows }),
    end: () => client.end(),
  };
}

function executeMatrix(value: unknown): ExecuteMatrix {
  const record = typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
  return Object.freeze(Object.fromEntries(
    APPLICATION_ROLES.map((role) => [role, record[role] === true]),
  ) as Record<typeof APPLICATION_ROLES[number], boolean>);
}

function functionState(
  row: Record<string, unknown>,
  prefix: "rpc039" | "rpc040",
): FunctionState {
  return Object.freeze({
    nameCount: Number(row[`${prefix}_name_count`]),
    exactExists: row[`${prefix}_exact_exists`] === true,
    securityDefiner: row[`${prefix}_security_definer`] === true,
    fixedSearchPath: row[`${prefix}_fixed_search_path`] === true,
    owner: typeof row[`${prefix}_owner`] === "string"
      ? row[`${prefix}_owner`] as string
      : null,
    execute: executeMatrix(row[`${prefix}_execute`]),
  });
}

function stateFromRow(row: Record<string, unknown> | undefined): BirelloRuntimeRpcGrantState {
  if (!row) throw new Error("STATE_UNAVAILABLE");
  return Object.freeze({
    database: String(row.database),
    maintenanceUser: String(row.maintenance_user),
    rpc039: functionState(row, "rpc039"),
    rpc040: functionState(row, "rpc040"),
    rpc037Baseline: row.rpc037_baseline === true,
    rpc038Baseline: row.rpc038_baseline === true,
    roleSafetyBaseline: row.role_safety_baseline === true,
    safetyFingerprint: String(row.safety_fingerprint),
  });
}

function prohibitedExposure(fn: FunctionState, intendedRole: string): boolean {
  return APPLICATION_ROLES.some((role) =>
    role !== intendedRole && fn.execute[role]);
}

function preconditionFailure(
  state: BirelloRuntimeRpcGrantState,
  expectedUser: string,
): BirelloRuntimeRpcGrantFailureCode | null {
  if (state.rpc039.nameCount === 0 || state.rpc040.nameCount === 0) {
    return "FUNCTIONS_NOT_DEPLOYED";
  }
  if (!state.rpc039.exactExists || !state.rpc040.exactExists
    || state.rpc039.nameCount !== 1 || state.rpc040.nameCount !== 1) {
    return "FUNCTION_SIGNATURE_MISMATCH";
  }
  if (!state.rpc039.securityDefiner || !state.rpc040.securityDefiner
    || !state.rpc039.fixedSearchPath || !state.rpc040.fixedSearchPath) {
    return "FUNCTION_SECURITY_MISMATCH";
  }
  if (state.rpc039.owner !== expectedUser || state.rpc040.owner !== expectedUser) {
    return "MAINTENANCE_AUTHORITY_INSUFFICIENT";
  }
  if (prohibitedExposure(state.rpc039, "birello_knowledge_ingestor")
    || prohibitedExposure(state.rpc040, "birello_knowledge_reader")) {
    return "UNEXPECTED_EXECUTE_EXPOSURE";
  }
  if (!state.rpc037Baseline || !state.rpc038Baseline || !state.roleSafetyBaseline) {
    return "BASELINE_MISMATCH";
  }
  const g1 = state.rpc039.execute.birello_knowledge_ingestor;
  const g2 = state.rpc040.execute.birello_knowledge_reader;
  if (g1 && g2) return "ALREADY_APPLIED";
  if (g1 || g2) return "PARTIAL_STATE";
  return null;
}

function postconditionsPass(
  state: BirelloRuntimeRpcGrantState,
  expectedUser: string,
  safetyFingerprint: string,
): boolean {
  return preconditionFailure(state, expectedUser) === "ALREADY_APPLIED"
    && state.safetyFingerprint === safetyFingerprint;
}

function safeSqlState(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && /^[0-9A-Z]{5}$/.test(code) ? code : null;
}

function rejected(
  failureCode: BirelloRuntimeRpcGrantFailureCode,
  failureStage: Extract<BirelloRuntimeRpcGrantReport, { result: "REJECTED" }>["failureStage"],
  connectionAttempted: boolean,
  additions: Partial<Extract<BirelloRuntimeRpcGrantReport, { result: "REJECTED" }>> = {},
): Extract<BirelloRuntimeRpcGrantReport, { result: "REJECTED" }> {
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
  value: BirelloRuntimeRpcGrantConfiguration | BirelloRuntimeRpcGrantReport,
): value is BirelloRuntimeRpcGrantReport {
  return "result" in value;
}

export async function runBirelloRuntimeRpcGrantOperation(
  configurationOrReport:
    BirelloRuntimeRpcGrantConfiguration | BirelloRuntimeRpcGrantReport,
  mode: BirelloRuntimeRpcGrantMode,
  clientFactory: BirelloRuntimeRpcGrantClientFactory = productionClientFactory,
): Promise<BirelloRuntimeRpcGrantReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  const client = clientFactory(configuration);
  let connected = false;
  let began = false;
  let mutationCount = 0;
  let state: BirelloRuntimeRpcGrantState | null = null;
  let baselineFingerprint = "";
  let stage: Extract<BirelloRuntimeRpcGrantReport, { result: "REJECTED" }>["failureStage"]
    = "connect";
  try {
    await client.connect();
    connected = true;
    stage = "identity";
    state = stateFromRow((await client.query(
      BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL)).rows[0]);
    if (state.database !== configuration.database) {
      return rejected("TARGET_IDENTITY_MISMATCH", stage, true, { state });
    }
    if (state.maintenanceUser !== configuration.expectedUser) {
      return rejected("MAINTENANCE_IDENTITY_MISMATCH", stage, true, { state });
    }
    baselineFingerprint = state.safetyFingerprint;
    const initialFailure = preconditionFailure(state, configuration.expectedUser);
    if (mode === "validate") {
      if (initialFailure && initialFailure !== "ALREADY_APPLIED") {
        return rejected(initialFailure, "precondition", true, { state });
      }
      return Object.freeze({
        result: "PASS" as const,
        operationId: BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
        mode,
        readyForApply: initialFailure === null,
        target: Object.freeze({
          host: configuration.host, port: configuration.port,
          database: configuration.database, projectRef: configuration.projectRef,
          maintenanceUser: configuration.expectedUser,
          verifiedTls: configuration.verifiedTls, caMechanism: configuration.caMechanism,
        }),
        state,
        transactionBegan: false, transactionCommitted: false,
        transactionRolledBack: false as const, mutationCount: 0,
        secretsPrinted: false as const,
      });
    }
    if (initialFailure) {
      return rejected(initialFailure, "precondition", true, { state });
    }

    await client.query("BEGIN");
    began = true;
    stage = "precondition";
    state = stateFromRow((await client.query(
      BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL)).rows[0]);
    const transactionFailure = preconditionFailure(state, configuration.expectedUser);
    if (transactionFailure || state.safetyFingerprint !== baselineFingerprint) {
      throw Object.assign(new Error("PRECONDITION_CHANGED"), {
        boundedFailureCode: transactionFailure ?? "BASELINE_MISMATCH",
      });
    }
    stage = "mutation";
    for (const statement of BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS) {
      await client.query(statement);
      mutationCount += 1;
    }
    stage = "postcondition";
    state = stateFromRow((await client.query(
      BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL)).rows[0]);
    if (mutationCount !== BIRELLO_RUNTIME_RPC_GRANT_COUNT
      || !postconditionsPass(state, configuration.expectedUser, baselineFingerprint)) {
      throw Object.assign(new Error("POSTCONDITION_FAILED"), {
        boundedFailureCode: "POSTCONDITION_FAILED",
      });
    }
    stage = "commit";
    await client.query("COMMIT");
    began = false;
    return Object.freeze({
      result: "PASS" as const,
      operationId: BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
      mode,
      readyForApply: false,
      target: Object.freeze({
        host: configuration.host, port: configuration.port,
        database: configuration.database, projectRef: configuration.projectRef,
        maintenanceUser: configuration.expectedUser,
        verifiedTls: configuration.verifiedTls, caMechanism: configuration.caMechanism,
      }),
      state,
      transactionBegan: true, transactionCommitted: true,
      transactionRolledBack: false as const, mutationCount,
      secretsPrinted: false as const,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) {
      try {
        await client.query("ROLLBACK");
        rolledBack = true;
      } catch { /* preserve bounded primary failure */ }
    }
    const bounded = typeof error === "object" && error !== null
      && "boundedFailureCode" in error
      ? (error as { boundedFailureCode: BirelloRuntimeRpcGrantFailureCode })
        .boundedFailureCode
      : "EXECUTION_FAILED";
    return rejected(bounded, stage, connected, {
      sqlState: safeSqlState(error),
      transactionBegan: began || rolledBack,
      transactionRolledBack: rolledBack,
      mutationCount,
      state,
    });
  } finally {
    if (connected) {
      try { await client.end(); } catch { /* sanitized cleanup */ }
    }
  }
}

