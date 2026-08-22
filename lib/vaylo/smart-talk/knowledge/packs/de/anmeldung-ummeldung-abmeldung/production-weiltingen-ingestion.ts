import { Client, type ClientConfig } from "pg";

import {
  buildWeiltingenLocalityPilotPayload,
  WEILTINGEN_PILOT,
  weiltingenPayloadFingerprint,
} from "./bayern-weiltingen-locality-pilot";
import { PRODUCTION_INGESTION_ENV } from "./production-rpc-ingestion";

export const WEILTINGEN_INGESTION_OPERATION =
  "BIRELLO_WEILTINGEN_LOCALITY_PACK_V1" as const;
export const WEILTINGEN_PAYLOAD_FINGERPRINT =
  "76f27fb52ebd7d034e0147a8740e6595f7abe390efbb74fc1ace51472df57c19" as const;
export const WEILTINGEN_RPC =
  "public.knowledge_ingest_curated_locality_pack(jsonb)" as const;
export const WEILTINGEN_RPC_STATEMENT =
  "select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result" as const;
export const WEILTINGEN_INGESTOR_ROLE = "birello_knowledge_ingestor" as const;
export const WEILTINGEN_INGESTION_ENV = Object.freeze({
  ...PRODUCTION_INGESTION_ENV,
  expectedHost: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_PROJECT_REF",
  authorization: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_AUTHORIZATION",
} as const);

const EXPECTED_PROJECT_REF = "cdztcnfjxheudqhvepbq";
const EXPECTED_DATABASE = "postgres";

type FixedPayload = Readonly<Record<string, unknown>>;
type PayloadIdentity = Readonly<{
  localityId: string;
  scopeId: string;
  authorityId: string;
  competenceId: string;
  sourceIds: readonly string[];
}>;

function fixedPayload(): FixedPayload {
  return buildWeiltingenLocalityPilotPayload();
}

function record(value: unknown): Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("FIXED_PAYLOAD_INVALID");
  }
  return value as Readonly<Record<string, unknown>>;
}

function payloadIdentity(payload: FixedPayload = fixedPayload()): PayloadIdentity {
  const additional = payload.additionalEvidence;
  if (!Array.isArray(additional) || additional.length !== 2) {
    throw new Error("FIXED_PAYLOAD_INVALID");
  }
  return Object.freeze({
    localityId: String(record(payload.locality).id),
    scopeId: String(record(payload.territorialScope).id),
    authorityId: String(record(payload.authority).id),
    competenceId: String(record(payload.competence).id),
    sourceIds: Object.freeze([
      String(record(payload.source).id),
      ...additional.map((item) => String(record(record(item).source).id)),
    ]),
  });
}

export function isWeiltingenTechnicallyEligible(
  metadata: Readonly<{ productionEligible: boolean }>,
): boolean {
  return metadata.productionEligible === true;
}

export function assertFixedWeiltingenPayload(): FixedPayload {
  const payload = fixedPayload();
  const locality = record(payload.locality);
  const land = record(payload.landJurisdiction);
  const district = record(payload.districtJurisdiction);
  const authority = record(payload.authority);
  if (
    !isWeiltingenTechnicallyEligible(WEILTINGEN_PILOT)
    || payload.packId !== "anmeldung_ummeldung_abmeldung"
    || payload.countryCode !== "DE"
    || land.code !== "09"
    || district.code !== "09571"
    || locality.municipalityCode !== "09571218"
    || locality.name !== "Markt Weiltingen"
    || authority.name !== WEILTINGEN_PILOT.authorityName
    || weiltingenPayloadFingerprint(payload) !== WEILTINGEN_PAYLOAD_FINGERPRINT
    || payloadIdentity(payload).sourceIds.length !== 3
  ) throw new Error("FIXED_PAYLOAD_INVALID");
  return payload;
}

export type WeiltingenIngestionMode = "validate" | "dry-run" | "apply";
export type WeiltingenIngestionConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string;
  host: string;
  port: number;
  database: string;
  projectRef: string;
  expectedWriter: typeof WEILTINGEN_INGESTOR_ROLE;
  verifiedTls: boolean;
  caMechanism: "NODE_EXTRA_CA_CERTS" | "LOCAL_TEST_ONLY";
  authorizedForApply: boolean;
}>;
export type WeiltingenIngestionClient = Readonly<{
  connect(): Promise<void>;
  query(
    sql: string,
    values?: readonly unknown[],
  ): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type WeiltingenIngestionClientFactory =
  (configuration: WeiltingenIngestionConfiguration) => WeiltingenIngestionClient;

export type WeiltingenIngestionState = Readonly<{
  database: string;
  writer: string;
  rpcCount: number;
  rpcSecurityDefiner: boolean;
  rpcFixedSearchPath: boolean;
  rpcExecutable: boolean;
  rpcOwner: string | null;
  migration039Present: boolean;
  postgres17: boolean;
  directKnowledgeDml: boolean;
  schemaCreate: boolean;
  superuser: boolean;
  createDb: boolean;
  createRole: boolean;
  bypassRls: boolean;
  memberships: number;
}>;

type FailureCode =
  | "CONFIGURATION_INVALID"
  | "SOURCE_NOT_ELIGIBLE"
  | "AUTHORIZATION_REQUIRED"
  | "TARGET_IDENTITY_MISMATCH"
  | "WRITER_IDENTITY_MISMATCH"
  | "RPC_CONTRACT_MISMATCH"
  | "INGESTOR_PRIVILEGE_MISMATCH"
  | "RPC_RESULT_MISMATCH"
  | "POSTCONDITION_FAILED"
  | "EXECUTION_FAILED";

export type WeiltingenIngestionReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode: FailureCode;
      stage: "configuration" | "connect" | "precondition" | "authorization"
        | "mutation" | "postcondition" | "commit";
      sqlState: string | null;
      connectionAttempted: boolean;
      rpcInvoked: boolean;
      transactionBegan: boolean;
      transactionCommitted: false;
      transactionRolledBack: boolean;
      mutationCount: number;
      state: WeiltingenIngestionState | null;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      operationId: typeof WEILTINGEN_INGESTION_OPERATION;
      mode: WeiltingenIngestionMode;
      payloadFingerprint: typeof WEILTINGEN_PAYLOAD_FINGERPRINT;
      productionEligible: true;
      authorizedForApply: boolean;
      readyForApply: boolean;
      rpcInvoked: boolean;
      transactionBegan: boolean;
      transactionCommitted: boolean;
      transactionRolledBack: boolean;
      mutationCount: number;
      semanticCreated: number | null;
      created: Readonly<Record<string, number>> | null;
      state: WeiltingenIngestionState;
      secretsPrinted: false;
    }>;

const REQUIRED_ENVIRONMENT = Object.freeze([
  WEILTINGEN_INGESTION_ENV.enabled,
  WEILTINGEN_INGESTION_ENV.target,
  WEILTINGEN_INGESTION_ENV.databaseUrl,
  WEILTINGEN_INGESTION_ENV.databaseName,
  WEILTINGEN_INGESTION_ENV.writer,
  WEILTINGEN_INGESTION_ENV.expectedHost,
  WEILTINGEN_INGESTION_ENV.projectRef,
]);

function rejected(
  failureCode: FailureCode,
  stage: Extract<WeiltingenIngestionReport, { result: "REJECTED" }>["stage"],
  connectionAttempted: boolean,
  additions: Partial<Extract<WeiltingenIngestionReport, { result: "REJECTED" }>> = {},
): Extract<WeiltingenIngestionReport, { result: "REJECTED" }> {
  return Object.freeze({
    result: "REJECTED" as const,
    failureCode,
    stage,
    sqlState: null,
    connectionAttempted,
    rpcInvoked: false,
    transactionBegan: false,
    transactionCommitted: false as const,
    transactionRolledBack: false,
    mutationCount: 0,
    state: null,
    secretsPrinted: false as const,
    ...additions,
  });
}

export function configurationFromWeiltingenIngestionEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): WeiltingenIngestionConfiguration | WeiltingenIngestionReport {
  const missing = REQUIRED_ENVIRONMENT.filter((name) => !environment[name]?.trim());
  if (missing.length) {
    return Object.freeze({
      result: "CONFIGURATION_REQUIRED" as const,
      missing: Object.freeze(missing),
      connectionAttempted: false as const,
      secretsPrinted: false as const,
    });
  }
  try {
    const url = new URL(environment[WEILTINGEN_INGESTION_ENV.databaseUrl]!);
    const host = environment[WEILTINGEN_INGESTION_ENV.expectedHost]!.trim().toLowerCase();
    const projectRef = environment[WEILTINGEN_INGESTION_ENV.projectRef]!.trim().toLowerCase();
    const database = environment[WEILTINGEN_INGESTION_ENV.databaseName]!.trim();
    const writer = environment[WEILTINGEN_INGESTION_ENV.writer]!.trim();
    const poolerHost = /\.pooler\.supabase\.com$/i.test(host);
    const directHost = host === `db.${projectRef}.supabase.co`;
    const usernameMatches = poolerHost
      ? url.username === `${WEILTINGEN_INGESTOR_ROLE}.${projectRef}`
      : directHost && url.username === WEILTINGEN_INGESTOR_ROLE;
    const unsafeParameters = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl")
      || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (
      environment[WEILTINGEN_INGESTION_ENV.enabled] !== "true"
      || environment[WEILTINGEN_INGESTION_ENV.target] !== "production"
      || environment[WEILTINGEN_INGESTION_ENV.forbiddenPublicUrl]
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || !url.password || unsafeParameters
      || host !== url.hostname.toLowerCase()
      || database !== EXPECTED_DATABASE || url.pathname.slice(1) !== database
      || projectRef !== EXPECTED_PROJECT_REF
      || writer !== WEILTINGEN_INGESTOR_ROLE
      || !usernameMatches
      || ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
      || /vaylo|dna/iu.test(host)
      || !environment.NODE_EXTRA_CA_CERTS?.trim()
    ) throw new Error("invalid");
    return Object.freeze({
      target: "production" as const,
      connectionString: url.toString(),
      host,
      port: url.port ? Number(url.port) : 5432,
      database,
      projectRef,
      expectedWriter: WEILTINGEN_INGESTOR_ROLE,
      verifiedTls: true,
      caMechanism: "NODE_EXTRA_CA_CERTS" as const,
      authorizedForApply:
        environment[WEILTINGEN_INGESTION_ENV.authorization]
          === WEILTINGEN_INGESTION_OPERATION,
    });
  } catch {
    return rejected("CONFIGURATION_INVALID", "configuration", false);
  }
}

function productionClientFactory(
  configuration: WeiltingenIngestionConfiguration,
): WeiltingenIngestionClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_weiltingen_locality_pack_v1",
  };
  const client = new Client(clientConfig);
  return {
    connect: async () => { await client.connect(); },
    query: async (sql, values) => ({
      rows: (await client.query(sql, values as unknown[] | undefined)).rows,
    }),
    end: () => client.end(),
  };
}

export const WEILTINGEN_INSPECTION_SQL = `select
  current_database() as database,current_user as writer,
  r.rolsuper as superuser,r.rolcreatedb as create_db,r.rolcreaterole as create_role,
  r.rolbypassrls as bypass_rls,
  pg_catalog.has_schema_privilege(current_user,'public','CREATE') as schema_create,
  (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) memberships,
  exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n
    on n.oid=c.relnamespace where n.nspname='public'
      and c.relname like 'knowledge\\_%' escape '\\' and c.relkind in ('r','p','v','m','f')
      and (pg_catalog.has_table_privilege(current_user,c.oid,'INSERT')
        or pg_catalog.has_table_privilege(current_user,c.oid,'UPDATE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'DELETE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'TRUNCATE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'REFERENCES')
        or pg_catalog.has_table_privilege(current_user,c.oid,'TRIGGER'))) direct_knowledge_dml,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname='knowledge_ingest_curated_locality_pack') rpc_count,
  coalesce((select p.prosecdef from pg_catalog.pg_proc p
    where p.oid=pg_catalog.to_regprocedure('${WEILTINGEN_RPC}')),false) rpc_security_definer,
  coalesce((select p.proconfig=array['search_path=pg_catalog, public']::text[]
    from pg_catalog.pg_proc p where p.oid=pg_catalog.to_regprocedure('${WEILTINGEN_RPC}')),false)
    rpc_fixed_search_path,
  coalesce(pg_catalog.has_function_privilege(
    current_user,pg_catalog.to_regprocedure('${WEILTINGEN_RPC}'),'EXECUTE'),false) rpc_executable,
  (select o.rolname from pg_catalog.pg_proc p join pg_catalog.pg_roles o on o.oid=p.proowner
    where p.oid=pg_catalog.to_regprocedure('${WEILTINGEN_RPC}')) rpc_owner,
  exists(select 1 from supabase_migrations.schema_migrations where version::text='039')
    migration039_present,
  current_setting('server_version_num')::int >= 170000 as postgres17
from pg_catalog.pg_roles r where r.rolname=current_user`;

function number(row: Record<string, unknown>, key: string): number {
  return Number(row[key]);
}

function stateFromRow(row: Record<string, unknown> | undefined): WeiltingenIngestionState {
  if (!row) throw new Error("STATE_UNAVAILABLE");
  return Object.freeze({
    database: String(row.database),
    writer: String(row.writer),
    rpcCount: number(row, "rpc_count"),
    rpcSecurityDefiner: row.rpc_security_definer === true,
    rpcFixedSearchPath: row.rpc_fixed_search_path === true,
    rpcExecutable: row.rpc_executable === true,
    rpcOwner: typeof row.rpc_owner === "string" ? row.rpc_owner : null,
    migration039Present: row.migration039_present === true,
    postgres17: row.postgres17 === true,
    directKnowledgeDml: row.direct_knowledge_dml === true,
    schemaCreate: row.schema_create === true,
    superuser: row.superuser === true,
    createDb: row.create_db === true,
    createRole: row.create_role === true,
    bypassRls: row.bypass_rls === true,
    memberships: number(row, "memberships"),
  });
}

function preconditionFailure(
  state: WeiltingenIngestionState,
  configuration: WeiltingenIngestionConfiguration,
): FailureCode | null {
  if (state.database !== configuration.database) return "TARGET_IDENTITY_MISMATCH";
  if (state.writer !== configuration.expectedWriter) return "WRITER_IDENTITY_MISMATCH";
  if (
    !state.postgres17 || !state.migration039Present
    || state.rpcCount !== 1 || !state.rpcSecurityDefiner
    || !state.rpcFixedSearchPath || state.rpcOwner !== "postgres"
  ) return "RPC_CONTRACT_MISMATCH";
  if (
    !state.rpcExecutable || state.directKnowledgeDml || state.schemaCreate
    || state.superuser || state.createDb || state.createRole || state.bypassRls
    || state.memberships !== 0
  ) return "INGESTOR_PRIVILEGE_MISMATCH";
  return null;
}

function safeSqlState(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && /^[0-9A-Z]{5}$/u.test(code) ? code : null;
}

function boundedError(code: FailureCode): Error & { boundedFailureCode: FailureCode } {
  return Object.assign(new Error(code), { boundedFailureCode: code });
}

function passReport(
  mode: WeiltingenIngestionMode,
  configuration: WeiltingenIngestionConfiguration,
  state: WeiltingenIngestionState,
  additions: Partial<Extract<WeiltingenIngestionReport, { result: "PASS" }>> = {},
): Extract<WeiltingenIngestionReport, { result: "PASS" }> {
  return Object.freeze({
    result: "PASS" as const,
    operationId: WEILTINGEN_INGESTION_OPERATION,
    mode,
    payloadFingerprint: WEILTINGEN_PAYLOAD_FINGERPRINT,
    productionEligible: true as const,
    authorizedForApply: configuration.authorizedForApply,
    readyForApply: configuration.authorizedForApply,
    rpcInvoked: false,
    transactionBegan: false,
    transactionCommitted: false,
    transactionRolledBack: false,
    mutationCount: 0,
    semanticCreated: null,
    created: null,
    state,
    secretsPrinted: false as const,
    ...additions,
  });
}

function isReport(
  value: WeiltingenIngestionConfiguration | WeiltingenIngestionReport,
): value is WeiltingenIngestionReport {
  return "result" in value;
}

export async function runWeiltingenProductionIngestion(
  configurationOrReport: WeiltingenIngestionConfiguration | WeiltingenIngestionReport,
  mode: WeiltingenIngestionMode,
  clientFactory: WeiltingenIngestionClientFactory = productionClientFactory,
): Promise<WeiltingenIngestionReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  let payload: FixedPayload;
  try {
    payload = assertFixedWeiltingenPayload();
  } catch {
    return rejected("SOURCE_NOT_ELIGIBLE", "precondition", false);
  }
  if (mode === "apply" && !configuration.authorizedForApply) {
    return rejected("AUTHORIZATION_REQUIRED", "authorization", false);
  }

  const client = clientFactory(configuration);
  let connected = false;
  let began = false;
  let invoked = false;
  let mutationCount = 0;
  let state: WeiltingenIngestionState | null = null;
  let stage: Extract<WeiltingenIngestionReport, { result: "REJECTED" }>["stage"]
    = "connect";
  try {
    await client.connect();
    connected = true;
    stage = "precondition";
    state = stateFromRow((await client.query(
      WEILTINGEN_INSPECTION_SQL)).rows[0]);
    const failure = preconditionFailure(state, configuration);
    if (failure) return rejected(failure, stage, true, { state });
    if (mode === "validate") return passReport(mode, configuration, state);

    await client.query("BEGIN");
    began = true;
    await client.query("SET LOCAL statement_timeout = '15s'");
    await client.query("SET LOCAL lock_timeout = '2s'");
    state = stateFromRow((await client.query(
      WEILTINGEN_INSPECTION_SQL)).rows[0]);
    const transactionFailure = preconditionFailure(state, configuration);
    if (transactionFailure) throw boundedError(transactionFailure);

    stage = "mutation";
    const execution = await client.query(WEILTINGEN_RPC_STATEMENT, [payload]);
    invoked = true;
    mutationCount = 1;
    const result = record(execution.rows[0]?.result);
    const createdValue = record(result.created);
    const semanticCreated = Number(result.semanticCreated);
    const identity = payloadIdentity(payload);
    if (
      result.packId !== "anmeldung_ummeldung_abmeldung"
      || result.family !== "residence_registration_lifecycle"
      || result.countryCode !== "DE"
      || result.localityId !== identity.localityId
      || result.authorityId !== identity.authorityId
      || result.competenceId !== identity.competenceId
      || !Number.isInteger(semanticCreated) || semanticCreated < 0
    ) throw boundedError("RPC_RESULT_MISMATCH");

    stage = "postcondition";
    state = stateFromRow((await client.query(
      WEILTINGEN_INSPECTION_SQL)).rows[0]);
    if (preconditionFailure(state, configuration)) {
      throw boundedError("POSTCONDITION_FAILED");
    }
    const created = Object.freeze(Object.fromEntries(
      Object.entries(createdValue).map(([key, value]) => [key, Number(value)]),
    ));
    if (mode === "dry-run") {
      await client.query("ROLLBACK");
      began = false;
      return passReport(mode, configuration, state, {
        readyForApply: configuration.authorizedForApply,
        rpcInvoked: true,
        transactionBegan: true,
        transactionRolledBack: true,
        mutationCount,
        semanticCreated,
        created,
      });
    }
    stage = "commit";
    await client.query("COMMIT");
    began = false;
    return passReport(mode, configuration, state, {
      readyForApply: false,
      rpcInvoked: true,
      transactionBegan: true,
      transactionCommitted: true,
      mutationCount,
      semanticCreated,
      created,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) {
      try {
        await client.query("ROLLBACK");
        rolledBack = true;
      } catch { /* preserve primary bounded error */ }
    }
    const failureCode = typeof error === "object" && error !== null
      && "boundedFailureCode" in error
      ? (error as { boundedFailureCode: FailureCode }).boundedFailureCode
      : "EXECUTION_FAILED";
    return rejected(failureCode, stage, connected, {
      sqlState: safeSqlState(error),
      rpcInvoked: invoked,
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
