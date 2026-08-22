import { Client, type ClientConfig } from "pg";

import { stablePackEntityId } from "./identity";
import { PRODUCTION_RETRIEVAL_ENV } from "./production-rpc-retrieval-proof";

export const ANMELDUNG_CONTEXT_PROOF_OPERATION =
  "BIRELLO_ANMELDUNG_CONTEXT_RPC_040_PROOF_V1" as const;
export const ANMELDUNG_CONTEXT_RPC =
  "public.knowledge_retrieve_anmeldung_context(uuid[],text)" as const;
export const ANMELDUNG_CONTEXT_RPC_STATEMENT =
  "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text) as result" as const;
export const ANMELDUNG_CONTEXT_READER = "birello_knowledge_reader" as const;
export const ANMELDUNG_CONTEXT_PROOF_ENV = Object.freeze({
  ...PRODUCTION_RETRIEVAL_ENV,
  expectedHost: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_PROJECT_REF",
} as const);

const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const DATABASE = "postgres";
const FIXED_UNIT_IDS = Object.freeze([
  "anmeldung-duty",
  "anmeldung-deadline-two-weeks",
] as const);
export const FIXED_ANMELDUNG_CLAIM_IDS = Object.freeze(
  FIXED_UNIT_IDS.map((id) => stablePackEntityId(`claim:${id}`)),
);
export const WEILTINGEN_CODE = "09571218" as const;
export const UNKNOWN_LOCALITY_CODE = "00000000" as const;

export type AnmeldungContextProofMode = "validate" | "execute-read-only";
export type AnmeldungContextProofConfiguration = Readonly<{
  target: "production" | "local-disposable-proof";
  connectionString: string;
  host: string;
  port: number;
  database: string;
  projectRef: string;
  expectedReader: typeof ANMELDUNG_CONTEXT_READER;
  verifiedTls: boolean;
  caMechanism: "NODE_EXTRA_CA_CERTS" | "LOCAL_TEST_ONLY";
}>;
export type AnmeldungContextProofClient = Readonly<{
  connect(): Promise<void>;
  query(
    sql: string,
    values?: readonly unknown[],
  ): Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type AnmeldungContextProofClientFactory =
  (configuration: AnmeldungContextProofConfiguration) => AnmeldungContextProofClient;

export type AnmeldungContextProofState = Readonly<{
  database: string;
  reader: string;
  rpcCount: number;
  rpcSecurityDefiner: boolean;
  rpcFixedSearchPath: boolean;
  rpcOwner: string | null;
  execute038: boolean;
  execute040: boolean;
  execute037: boolean;
  execute039: boolean;
  directKnowledgePrivileges: boolean;
  schemaCreate: boolean;
  superuser: boolean;
  createDb: boolean;
  createRole: boolean;
  replication: boolean;
  bypassRls: boolean;
  databaseOwner: boolean;
  memberships: number;
  postgres17: boolean;
}>;

type CaseReport = Readonly<Record<string, unknown>>;
type FailureCode =
  | "CONFIGURATION_INVALID"
  | "TARGET_IDENTITY_MISMATCH"
  | "READER_IDENTITY_MISMATCH"
  | "RPC_CONTRACT_MISMATCH"
  | "READER_PRIVILEGE_MISMATCH"
  | "PROOF_RESULT_MISMATCH"
  | "EXECUTION_FAILED";

export type AnmeldungContextProofReport =
  | Readonly<{
      result: "CONFIGURATION_REQUIRED";
      missing: readonly string[];
      connectionAttempted: false;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "REJECTED";
      failureCode: FailureCode;
      stage: "configuration" | "connect" | "precondition" | "proof";
      sqlState: string | null;
      connectionAttempted: boolean;
      transactionBegan: boolean;
      transactionRolledBack: boolean;
      rpcInvocationCount: number;
      state: AnmeldungContextProofState | null;
      secretsPrinted: false;
    }>
  | Readonly<{
      result: "PASS";
      operationId: typeof ANMELDUNG_CONTEXT_PROOF_OPERATION;
      mode: AnmeldungContextProofMode;
      connected: true;
      state: AnmeldungContextProofState;
      transactionBegan: boolean;
      transactionRolledBack: boolean;
      rpcInvocationCount: number;
      productionWritesPerformed: false;
      liveHttpFetchPerformed: false;
      cases: Readonly<Record<"K1" | "K2" | "K3" | "K4", CaseReport>> | null;
      allPassed: boolean;
      secretsPrinted: false;
    }>;

const REQUIRED_ENVIRONMENT = Object.freeze([
  ANMELDUNG_CONTEXT_PROOF_ENV.enabled,
  ANMELDUNG_CONTEXT_PROOF_ENV.target,
  ANMELDUNG_CONTEXT_PROOF_ENV.databaseUrl,
  ANMELDUNG_CONTEXT_PROOF_ENV.databaseName,
  ANMELDUNG_CONTEXT_PROOF_ENV.reader,
  ANMELDUNG_CONTEXT_PROOF_ENV.expectedHost,
  ANMELDUNG_CONTEXT_PROOF_ENV.projectRef,
  "NODE_EXTRA_CA_CERTS",
]);

function rejected(
  failureCode: FailureCode,
  stage: Extract<AnmeldungContextProofReport, { result: "REJECTED" }>["stage"],
  connectionAttempted: boolean,
  additions: Partial<Extract<AnmeldungContextProofReport, { result: "REJECTED" }>> = {},
): Extract<AnmeldungContextProofReport, { result: "REJECTED" }> {
  return Object.freeze({
    result: "REJECTED" as const,
    failureCode,
    stage,
    sqlState: null,
    connectionAttempted,
    transactionBegan: false,
    transactionRolledBack: false,
    rpcInvocationCount: 0,
    state: null,
    secretsPrinted: false as const,
    ...additions,
  });
}

export function configurationFromAnmeldungContextProofEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): AnmeldungContextProofConfiguration | AnmeldungContextProofReport {
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
    const url = new URL(environment[ANMELDUNG_CONTEXT_PROOF_ENV.databaseUrl]!);
    const host = environment[
      ANMELDUNG_CONTEXT_PROOF_ENV.expectedHost]!.trim().toLowerCase();
    const projectRef = environment[
      ANMELDUNG_CONTEXT_PROOF_ENV.projectRef]!.trim().toLowerCase();
    const database = environment[
      ANMELDUNG_CONTEXT_PROOF_ENV.databaseName]!.trim();
    const reader = environment[ANMELDUNG_CONTEXT_PROOF_ENV.reader]!.trim();
    const poolerHost = /\.pooler\.supabase\.com$/iu.test(host);
    const directHost = host === `db.${projectRef}.supabase.co`;
    const userMatches = poolerHost
      ? url.username === `${ANMELDUNG_CONTEXT_READER}.${projectRef}`
      : directHost && url.username === ANMELDUNG_CONTEXT_READER;
    const unsafeTls = [...url.searchParams.keys()].some((key) =>
      key.toLowerCase().startsWith("ssl")
      || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (
      environment[ANMELDUNG_CONTEXT_PROOF_ENV.enabled] !== "true"
      || environment[ANMELDUNG_CONTEXT_PROOF_ENV.target] !== "production"
      || environment[ANMELDUNG_CONTEXT_PROOF_ENV.forbiddenPublicUrl]
      || !["postgres:", "postgresql:"].includes(url.protocol)
      || !url.password || unsafeTls
      || host !== url.hostname.toLowerCase()
      || projectRef !== PROJECT_REF
      || database !== DATABASE || url.pathname.slice(1) !== DATABASE
      || reader !== ANMELDUNG_CONTEXT_READER
      || !userMatches
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
      expectedReader: ANMELDUNG_CONTEXT_READER,
      verifiedTls: true,
      caMechanism: "NODE_EXTRA_CA_CERTS" as const,
    });
  } catch {
    return rejected("CONFIGURATION_INVALID", "configuration", false);
  }
}

function productionClientFactory(
  configuration: AnmeldungContextProofConfiguration,
): AnmeldungContextProofClient {
  const clientConfig: ClientConfig = {
    connectionString: configuration.connectionString,
    ssl: configuration.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_anmeldung_context_rpc_040_proof_v1",
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

export const ANMELDUNG_CONTEXT_INSPECTION_SQL = `select
  current_database() database,current_user reader,
  r.rolsuper superuser,r.rolcreatedb create_db,r.rolcreaterole create_role,
  r.rolreplication replication,r.rolbypassrls bypass_rls,
  d.datdba=r.oid database_owner,
  current_setting('server_version_num')::int>=170000 postgres17,
  pg_catalog.has_schema_privilege(current_user,'public','CREATE') schema_create,
  (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) memberships,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname='knowledge_retrieve_anmeldung_context') rpc_count,
  coalesce((select p.prosecdef from pg_catalog.pg_proc p
    where p.oid=pg_catalog.to_regprocedure('${ANMELDUNG_CONTEXT_RPC}')),false)
    rpc_security_definer,
  coalesce((select p.proconfig=array['search_path=pg_catalog, public']::text[]
    from pg_catalog.pg_proc p
    where p.oid=pg_catalog.to_regprocedure('${ANMELDUNG_CONTEXT_RPC}')),false)
    rpc_fixed_search_path,
  (select o.rolname from pg_catalog.pg_proc p join pg_catalog.pg_roles o on o.oid=p.proowner
    where p.oid=pg_catalog.to_regprocedure('${ANMELDUNG_CONTEXT_RPC}')) rpc_owner,
  coalesce(pg_catalog.has_function_privilege(current_user,
    pg_catalog.to_regprocedure('public.knowledge_retrieve_evidence_packets(uuid[],text[])'),
    'EXECUTE'),false) execute038,
  coalesce(pg_catalog.has_function_privilege(current_user,
    pg_catalog.to_regprocedure('${ANMELDUNG_CONTEXT_RPC}'),'EXECUTE'),false) execute040,
  coalesce(pg_catalog.has_function_privilege(current_user,
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_pack(jsonb)'),
    'EXECUTE'),false) execute037,
  coalesce(pg_catalog.has_function_privilege(current_user,
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_locality_pack(jsonb)'),
    'EXECUTE'),false) execute039,
  exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n
    on n.oid=c.relnamespace where n.nspname='public'
      and c.relname like 'knowledge\\_%' escape '\\'
      and c.relkind in ('r','p','v','m','f')
      and (pg_catalog.has_table_privilege(current_user,c.oid,'SELECT')
        or pg_catalog.has_table_privilege(current_user,c.oid,'INSERT')
        or pg_catalog.has_table_privilege(current_user,c.oid,'UPDATE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'DELETE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'TRUNCATE')
        or pg_catalog.has_table_privilege(current_user,c.oid,'REFERENCES')
        or pg_catalog.has_table_privilege(current_user,c.oid,'TRIGGER')))
    direct_knowledge_privileges
from pg_catalog.pg_roles r join pg_catalog.pg_database d
  on d.datname=current_database() where r.rolname=current_user`;

function number(row: Record<string, unknown>, key: string): number {
  return Number(row[key]);
}

function stateFromRow(row: Record<string, unknown> | undefined): AnmeldungContextProofState {
  if (!row) throw new Error("STATE_UNAVAILABLE");
  return Object.freeze({
    database: String(row.database),
    reader: String(row.reader),
    rpcCount: number(row, "rpc_count"),
    rpcSecurityDefiner: row.rpc_security_definer === true,
    rpcFixedSearchPath: row.rpc_fixed_search_path === true,
    rpcOwner: typeof row.rpc_owner === "string" ? row.rpc_owner : null,
    execute038: row.execute038 === true,
    execute040: row.execute040 === true,
    execute037: row.execute037 === true,
    execute039: row.execute039 === true,
    directKnowledgePrivileges: row.direct_knowledge_privileges === true,
    schemaCreate: row.schema_create === true,
    superuser: row.superuser === true,
    createDb: row.create_db === true,
    createRole: row.create_role === true,
    replication: row.replication === true,
    bypassRls: row.bypass_rls === true,
    databaseOwner: row.database_owner === true,
    memberships: number(row, "memberships"),
    postgres17: row.postgres17 === true,
  });
}

function preconditionFailure(
  state: AnmeldungContextProofState,
  configuration: AnmeldungContextProofConfiguration,
): FailureCode | null {
  if (state.database !== configuration.database) return "TARGET_IDENTITY_MISMATCH";
  if (state.reader !== configuration.expectedReader) return "READER_IDENTITY_MISMATCH";
  if (
    !state.postgres17 || state.rpcCount !== 1 || !state.rpcSecurityDefiner
    || !state.rpcFixedSearchPath || state.rpcOwner !== "postgres"
  ) return "RPC_CONTRACT_MISMATCH";
  if (
    !state.execute038 || !state.execute040 || state.execute037 || state.execute039
    || state.directKnowledgePrivileges || state.schemaCreate || state.superuser
    || state.createDb || state.createRole || state.replication || state.bypassRls
    || state.databaseOwner || state.memberships !== 0
  ) return "READER_PRIVILEGE_MISMATCH";
  return null;
}

function object(value: unknown): Readonly<Record<string, unknown>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("INVALID_RESULT");
  }
  return value as Readonly<Record<string, unknown>>;
}

function array(value: unknown): readonly unknown[] {
  if (!Array.isArray(value)) throw new Error("INVALID_RESULT");
  return value;
}

function federalSummary(result: Readonly<Record<string, unknown>>): CaseReport {
  const federal = array(result.federalEvidence);
  const returned = new Set(federal.map((item) => String(object(item).claim_id)));
  return Object.freeze({
    fixedClaimCount: FIXED_ANMELDUNG_CLAIM_IDS.length,
    federalEvidenceCount: federal.length,
    fixedClaimsPresent: FIXED_ANMELDUNG_CLAIM_IDS.every((id) => returned.has(id)),
  });
}

function assessK1(result: Readonly<Record<string, unknown>>): CaseReport {
  const federal = federalSummary(result);
  return Object.freeze({
    ...federal,
    municipalityCode: null,
    localContextPresent: result.localContext !== null,
    passed: federal.fixedClaimsPresent === true
      && federal.federalEvidenceCount === FIXED_ANMELDUNG_CLAIM_IDS.length
      && result.localContext === null,
  });
}

function assessK2(result: Readonly<Record<string, unknown>>): {
  k2: CaseReport;
  k4: CaseReport;
} {
  const federal = federalSummary(result);
  const local = object(result.localContext);
  const locality = object(local.locality);
  const authority = object(local.authority);
  const competence = object(local.competence);
  const evidence = array(local.evidence).map(object);
  const opening = evidence.find((item) => item.informationClass === "OPENING_HOURS");
  const k2 = Object.freeze({
    ...federal,
    localContextPresent: true,
    municipalityCode: locality.municipalityCode,
    municipalityName: locality.municipalityName,
    jurisdictionId: locality.jurisdictionId,
    territorialScopeId: locality.territorialScopeId,
    authorityId: authority.id,
    authorityName: authority.name,
    competenceId: competence.id,
    competenceSubjectMatter: competence.subjectMatter,
    effectiveFrom: competence.effectiveFrom,
    localEvidenceCount: evidence.length,
    passed: federal.fixedClaimsPresent === true
      && federal.federalEvidenceCount === FIXED_ANMELDUNG_CLAIM_IDS.length
      && locality.municipalityCode === WEILTINGEN_CODE
      && locality.municipalityName === "Markt Weiltingen"
      && locality.jurisdictionId === "0e241260-82fd-446c-88fd-a8df21c783f6"
      && locality.territorialScopeId === "a46e926e-97fc-43ad-8d0e-ffde421696f7"
      && authority.id === "64238bee-ff3f-4cf6-8452-349b2529857c"
      && authority.name
        === "Verwaltungsgemeinschaft Wilburgstetten – Bürgerbüro"
      && competence.id === "4b6cc632-da14-4e32-8e5e-645a64cbd933"
      && competence.subjectMatter === "residence_registration_lifecycle",
  });
  const k4 = Object.freeze({
    openingHoursPresent: Boolean(opening),
    handlingMode: opening?.handlingMode ?? null,
    freshnessClass: opening?.freshnessClass ?? null,
    staleBehavior: opening?.staleBehavior ?? null,
    requiresLiveFetch: opening?.requiresLiveFetch ?? null,
    requiresRevalidation: opening?.requiresRevalidation ?? null,
    answerReady: opening?.answerReady ?? null,
    usabilityState: opening?.usabilityState ?? null,
    liveHttpFetchPerformed: false,
    passed: opening?.handlingMode === "FETCH_LIVE"
      && opening.requiresLiveFetch === true
      && opening.answerReady === false
      && opening.usabilityState === "REQUIRES_LIVE_FETCH",
  });
  return { k2, k4 };
}

function safeSqlState(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && /^[0-9A-Z]{5}$/u.test(code) ? code : null;
}

function isExpectedUnknownLocality(error: unknown): boolean {
  return typeof error === "object" && error !== null
    && "message" in error
    && String((error as { message: unknown }).message)
      .includes("CURATED_RETRIEVAL_UNKNOWN_LOCALITY");
}

function pass(
  mode: AnmeldungContextProofMode,
  state: AnmeldungContextProofState,
  additions: Partial<Extract<AnmeldungContextProofReport, { result: "PASS" }>> = {},
): Extract<AnmeldungContextProofReport, { result: "PASS" }> {
  return Object.freeze({
    result: "PASS" as const,
    operationId: ANMELDUNG_CONTEXT_PROOF_OPERATION,
    mode,
    connected: true as const,
    state,
    transactionBegan: false,
    transactionRolledBack: false,
    rpcInvocationCount: 0,
    productionWritesPerformed: false as const,
    liveHttpFetchPerformed: false as const,
    cases: null,
    allPassed: true,
    secretsPrinted: false as const,
    ...additions,
  });
}

function isReport(
  value: AnmeldungContextProofConfiguration | AnmeldungContextProofReport,
): value is AnmeldungContextProofReport {
  return "result" in value;
}

export async function runAnmeldungContextProductionProof(
  configurationOrReport:
    AnmeldungContextProofConfiguration | AnmeldungContextProofReport,
  mode: AnmeldungContextProofMode,
  clientFactory: AnmeldungContextProofClientFactory = productionClientFactory,
): Promise<AnmeldungContextProofReport> {
  if (isReport(configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport;
  const client = clientFactory(configuration);
  let connected = false;
  let transaction = false;
  let state: AnmeldungContextProofState | null = null;
  let invocationCount = 0;
  let stage: Extract<AnmeldungContextProofReport, { result: "REJECTED" }>["stage"]
    = "connect";
  try {
    await client.connect();
    connected = true;
    stage = "precondition";
    state = stateFromRow((await client.query(
      ANMELDUNG_CONTEXT_INSPECTION_SQL)).rows[0]);
    const failure = preconditionFailure(state, configuration);
    if (failure) return rejected(failure, stage, true, { state });
    if (mode === "validate") return pass(mode, state);

    await client.query("BEGIN READ ONLY");
    transaction = true;
    await client.query("SET LOCAL statement_timeout='10s'");
    await client.query("SET LOCAL lock_timeout='1s'");
    stage = "proof";
    const k1Result = object((await client.query(
      ANMELDUNG_CONTEXT_RPC_STATEMENT,
      [FIXED_ANMELDUNG_CLAIM_IDS, null],
    )).rows[0]?.result);
    invocationCount += 1;
    const k2Result = object((await client.query(
      ANMELDUNG_CONTEXT_RPC_STATEMENT,
      [FIXED_ANMELDUNG_CLAIM_IDS, WEILTINGEN_CODE],
    )).rows[0]?.result);
    invocationCount += 1;
    let k3Passed = false;
    try {
      await client.query(
        ANMELDUNG_CONTEXT_RPC_STATEMENT,
        [FIXED_ANMELDUNG_CLAIM_IDS, UNKNOWN_LOCALITY_CODE],
      );
    } catch (error) {
      k3Passed = isExpectedUnknownLocality(error);
    }
    invocationCount += 1;
    await client.query("ROLLBACK");
    transaction = false;

    const k1 = assessK1(k1Result);
    const { k2, k4 } = assessK2(k2Result);
    const k3 = Object.freeze({
      municipalityCode: UNKNOWN_LOCALITY_CODE,
      rejectedUnknownLocality: k3Passed,
      fuzzyMatch: false,
      inventedLocality: false,
      inventedAuthority: false,
      federalResultReturned: false,
      passed: k3Passed,
    });
    const cases = Object.freeze({ K1: k1, K2: k2, K3: k3, K4: k4 });
    const allPassed = Object.values(cases).every((item) => item.passed === true);
    if (!allPassed) {
      return rejected("PROOF_RESULT_MISMATCH", stage, true, {
        transactionBegan: true,
        transactionRolledBack: true,
        rpcInvocationCount: invocationCount,
        state,
      });
    }
    return pass(mode, state, {
      transactionBegan: true,
      transactionRolledBack: true,
      rpcInvocationCount: invocationCount,
      cases,
      allPassed,
    });
  } catch (error) {
    let rolledBack = false;
    if (transaction) {
      try {
        await client.query("ROLLBACK");
        rolledBack = true;
      } catch { /* preserve primary bounded error */ }
    }
    return rejected("EXECUTION_FAILED", stage, connected, {
      sqlState: safeSqlState(error),
      transactionBegan: transaction || rolledBack,
      transactionRolledBack: rolledBack,
      rpcInvocationCount: invocationCount,
      state,
    });
  } finally {
    if (connected) {
      try { await client.end(); } catch { /* sanitized cleanup */ }
    }
  }
}
