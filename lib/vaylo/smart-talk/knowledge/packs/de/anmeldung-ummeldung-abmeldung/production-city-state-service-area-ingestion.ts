import { Client, type ClientConfig } from "pg";

import {
  buildBerlinServiceAreaPack,
  buildBremenServiceAreaPack,
  buildHamburgServiceAreaPack,
} from "./anmeldung-city-state-service-area-packs";
import { knowledgeFactoryFingerprint, validateCuratedServiceAreaPack, type CuratedServiceAreaPack } from "../../../source-registry/knowledge-factory-contracts";
import { PRODUCTION_INGESTION_ENV } from "./production-rpc-ingestion";

export const CITY_STATE_INGESTION_OPERATION = "BIRELLO_CITY_STATE_SERVICE_AREA_PACK_V1" as const;
export const CITY_STATE_RPC = "public.knowledge_ingest_curated_service_area_pack(jsonb)" as const;
export const CITY_STATE_INGESTOR = "birello_knowledge_ingestor" as const;
export const CITY_STATE_INGESTION_ENV = Object.freeze({
  ...PRODUCTION_INGESTION_ENV,
  expectedHost: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_EXPECTED_HOST",
  projectRef: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_PROJECT_REF",
  authorization: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_AUTHORIZATION",
} as const);
export type CityState = "berlin" | "bremen" | "hamburg";
export type CityStateMode = "validate" | "dry-run" | "apply";
const ORDER: readonly CityState[] = ["berlin", "bremen", "hamburg"];
export const CITY_STATE_PACKS = Object.freeze({
  berlin: { packId: "anmeldung_service_area_berlin", fingerprint: "c18b3ae5ea23e21ebb07cdb86118c9bb551be00bac4452293e1f39692424e56b", firstCreated: 15 },
  bremen: { packId: "anmeldung_service_area_bremen", fingerprint: "65ac939f8047bdb4cb648b9a0dc9181f4fa17ba893c213eeceaa4397986ea52b", firstCreated: 16 },
  hamburg: { packId: "anmeldung_service_area_hamburg", fingerprint: "42c27cf77f57da21ebae70c1e3338ae62807ce2bd8bea7c8d8f6bef3c0ec87b8", firstCreated: 15 },
} as const);
export type CityStateIngestionConfiguration = Readonly<{
  target: "production" | "local-disposable-proof"; connectionString: string;
  host: string; port: number; database: string; projectRef: string;
  expectedWriter: typeof CITY_STATE_INGESTOR; verifiedTls: boolean;
  authorizedForApply: boolean;
}>;
export type CityStateIngestionClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string, values?: readonly unknown[]):
    Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type CityStateIngestionReport = Readonly<Record<string, unknown>>;
export type CityStateClientFactory =
  (configuration: CityStateIngestionConfiguration) => CityStateIngestionClient;
export type CityStatePackProvider = (city: CityState) => CuratedServiceAreaPack;

const committedPack: CityStatePackProvider = (city) => {
  return city === "berlin" ? buildBerlinServiceAreaPack() : city === "bremen" ? buildBremenServiceAreaPack() : buildHamburgServiceAreaPack();
};
function safePack(city: CityState, provider: CityStatePackProvider): CuratedServiceAreaPack {
  const value = provider(city); const check = validateCuratedServiceAreaPack(value);
  if (!check.valid || value.packId !== CITY_STATE_PACKS[city].packId
    || knowledgeFactoryFingerprint(value) !== CITY_STATE_PACKS[city].fingerprint) {
    throw new Error("FIXED_PACK_INVALID");
  }
  return value;
}
function result(result: string, additions: Record<string, unknown> = {}): CityStateIngestionReport {
  return Object.freeze({ result, secretsPrinted: false, ...additions });
}
export function configurationFromCityStateIngestionEnvironment(env: Readonly<Record<string, string | undefined>> = process.env): CityStateIngestionConfiguration | CityStateIngestionReport {
  const keys = [CITY_STATE_INGESTION_ENV.enabled, CITY_STATE_INGESTION_ENV.target, CITY_STATE_INGESTION_ENV.databaseUrl, CITY_STATE_INGESTION_ENV.databaseName, CITY_STATE_INGESTION_ENV.writer, CITY_STATE_INGESTION_ENV.expectedHost, CITY_STATE_INGESTION_ENV.projectRef, "NODE_EXTRA_CA_CERTS"];
  const missing = keys.filter((key) => !env[key]?.trim()); if (missing.length) return result("CONFIGURATION_REQUIRED", { missing, connectionAttempted: false });
  try {
    const url = new URL(env[CITY_STATE_INGESTION_ENV.databaseUrl]!); const host = env[CITY_STATE_INGESTION_ENV.expectedHost]!.trim().toLowerCase(); const projectRef = env[CITY_STATE_INGESTION_ENV.projectRef]!.trim().toLowerCase();
    const pooler = /\.pooler\.supabase\.com$/iu.test(host); const user = pooler ? `${CITY_STATE_INGESTOR}.${projectRef}` : CITY_STATE_INGESTOR;
    const tlsParam = [...url.searchParams.keys()].some((key) => key.toLowerCase().startsWith("ssl") || ["requiressl", "uselibpqcompat"].includes(key.toLowerCase()));
    if (env[CITY_STATE_INGESTION_ENV.enabled] !== "true" || env[CITY_STATE_INGESTION_ENV.target] !== "production" || env[CITY_STATE_INGESTION_ENV.forbiddenPublicUrl] || !url.password || tlsParam || host !== url.hostname.toLowerCase() || projectRef !== "cdztcnfjxheudqhvepbq" || env[CITY_STATE_INGESTION_ENV.databaseName] !== "postgres" || url.pathname !== "/postgres" || env[CITY_STATE_INGESTION_ENV.writer] !== CITY_STATE_INGESTOR || url.username !== user || /vaylo|dna|localhost|127\.0\.0\.1/iu.test(host)) throw new Error("invalid");
    return Object.freeze({ target: "production", connectionString: url.toString(), host, port: url.port ? Number(url.port) : 5432, database: "postgres", projectRef, expectedWriter: CITY_STATE_INGESTOR, verifiedTls: true, authorizedForApply: env[CITY_STATE_INGESTION_ENV.authorization] === CITY_STATE_INGESTION_OPERATION });
  } catch { return result("REJECTED", { failureCode: "CONFIGURATION_INVALID", connectionAttempted: false }); }
}
function productionClient(config: CityStateIngestionConfiguration): CityStateIngestionClient {
  const client = new Client({
    connectionString: config.connectionString,
    ssl: config.verifiedTls ? { rejectUnauthorized: true } : undefined,
    application_name: "birello_city_state_service_area_pack_v1",
  } satisfies ClientConfig);
  return { connect: async () => { await client.connect(); }, query: async (sql, values) => ({ rows: (await client.query(sql, values as unknown[] | undefined)).rows }), end: () => client.end() };
}
export const CITY_STATE_INSPECTION_SQL = `select current_database() database,current_user writer,
  r.rolsuper superuser,r.rolcreatedb create_db,r.rolcreaterole create_role,
  r.rolreplication replication,r.rolbypassrls bypass_rls,
  d.datdba=r.oid database_owner,
  (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid) memberships,
  pg_catalog.has_schema_privilege(current_user,'public','CREATE') schema_create,
  exists(select 1 from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\' and (pg_catalog.has_table_privilege(current_user,c.oid,'INSERT') or pg_catalog.has_table_privilege(current_user,c.oid,'UPDATE') or pg_catalog.has_table_privilege(current_user,c.oid,'DELETE'))) direct_dml,
  coalesce(pg_catalog.has_function_privilege(current_user,pg_catalog.to_regprocedure('${CITY_STATE_RPC}'),'EXECUTE'),false) execute_g4,
  coalesce((select p.prosecdef from pg_catalog.pg_proc p where p.oid=pg_catalog.to_regprocedure('${CITY_STATE_RPC}')),false) security_definer,
  coalesce((select p.proconfig=array['search_path=pg_catalog, public']::text[] from pg_catalog.pg_proc p where p.oid=pg_catalog.to_regprocedure('${CITY_STATE_RPC}')),false) fixed_search_path,
  (select count(*) from supabase_migrations.schema_migrations where version::text='043')=1 migration043
  from pg_catalog.pg_roles r join pg_catalog.pg_database d
    on d.datname=current_database() where r.rolname=current_user`;
function validState(
  row: Record<string, unknown>,
  config: CityStateIngestionConfiguration,
): boolean {
  return row.database === config.database && row.writer === config.expectedWriter
    && row.execute_g4 === true && row.security_definer === true
    && row.fixed_search_path === true && row.migration043 === true
    && row.superuser !== true && row.create_db !== true && row.create_role !== true
    && row.replication !== true && row.bypass_rls !== true && row.database_owner !== true
    && Number(row.memberships) === 0 && row.schema_create !== true && row.direct_dml !== true;
}
const PREDECESSORS: Readonly<Record<CityState, readonly CityState[]>> = {
  berlin: [],
  bremen: ["berlin"],
  hamburg: ["berlin", "bremen"],
};
export async function runCityStateProductionIngestion(
  configOrReport: CityStateIngestionConfiguration | CityStateIngestionReport,
  city: CityState,
  mode: CityStateMode,
  factory: CityStateClientFactory = productionClient,
  packProvider: CityStatePackProvider = committedPack,
): Promise<CityStateIngestionReport> {
  if (!("target" in configOrReport)) return configOrReport;
  const config = configOrReport as CityStateIngestionConfiguration;
  let payload: CuratedServiceAreaPack;
  try { payload = safePack(city, packProvider); } catch {
    return result("REJECTED", {
      failureCode: "FIXED_PACK_INVALID", connectionAttempted: false,
      transactionBegan: false, transactionRolledBack: false,
    });
  }
  if (mode === "apply" && !config.authorizedForApply) return result("REJECTED", {
    failureCode: "AUTHORIZATION_REQUIRED", connectionAttempted: false,
    transactionBegan: false, transactionRolledBack: false,
  });
  const db = factory(config); let connected = false; let began = false;
  try {
    await db.connect(); connected = true;
    const before = (await db.query(CITY_STATE_INSPECTION_SQL)).rows[0]!;
    if (!validState(before, config)) return result("REJECTED", {
      failureCode: "INGESTOR_PRIVILEGE_OR_PREREQUISITE_MISMATCH", state: before,
    });
    if (mode === "validate") return result("PASS", {
      city, mode, packId: payload.packId,
      payloadFingerprint: CITY_STATE_PACKS[city].fingerprint,
      readyForApply: config.authorizedForApply, rpcInvoked: false,
      transactionBegan: false, transactionCommitted: false,
      transactionRolledBack: false, mutationCount: 0,
    });
    await db.query("BEGIN"); began = true; await db.query("SET LOCAL statement_timeout='15s'"); await db.query("SET LOCAL lock_timeout='2s'");
    const again = (await db.query(CITY_STATE_INSPECTION_SQL)).rows[0]!;
    if (!validState(again, config)) throw new Error("PRECONDITION_CHANGED");
    for (const predecessor of PREDECESSORS[city]) {
      const predecessorResult = (await db.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
        [safePack(predecessor, packProvider)],
      )).rows[0]?.result as Record<string, unknown> | undefined;
      if (!predecessorResult || Number(predecessorResult.semanticCreated) !== 0) {
        throw new Error("CITY_STATE_ORDER_MISMATCH");
      }
    }
    const execution = await db.query("select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result", [payload]);
    const rpc = execution.rows[0]?.result as Record<string, unknown> | undefined; const semanticCreated = Number(rpc?.semanticCreated);
    if (!rpc || rpc.packId !== payload.packId || !Number.isInteger(semanticCreated) || semanticCreated < 0) throw new Error("RPC_RESULT_MISMATCH");
    if (mode === "dry-run") {
      await db.query("ROLLBACK"); began = false;
      return result("PASS", {
        city, mode, rpcInvoked: true, transactionBegan: true,
        transactionCommitted: false, transactionRolledBack: true,
        mutationCount: 1, semanticCreated,
      });
    }
    await db.query("COMMIT"); began = false;
    return result("PASS", {
      city, mode, rpcInvoked: true, transactionBegan: true,
      transactionCommitted: true, transactionRolledBack: false,
      mutationCount: 1, semanticCreated,
      expectedFirstRunSemanticCreated: CITY_STATE_PACKS[city].firstCreated,
    });
  } catch (error) {
    let rolledBack = false;
    if (began) try { await db.query("ROLLBACK"); rolledBack = true; } catch { /* bounded cleanup */ }
    return result("REJECTED", {
      failureCode: error instanceof Error && error.message === "CITY_STATE_ORDER_MISMATCH"
        ? "CITY_STATE_ORDER_MISMATCH" : "EXECUTION_FAILED",
      connectionAttempted: connected,
      transactionBegan: began || rolledBack, transactionCommitted: false,
      transactionRolledBack: rolledBack,
    });
  } finally { if (connected) await db.end().catch(() => undefined); }
}
export const CITY_STATE_ORDER = ORDER;
