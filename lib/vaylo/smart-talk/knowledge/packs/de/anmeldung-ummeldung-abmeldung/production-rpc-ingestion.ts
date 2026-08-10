import { Client, type ClientConfig } from "pg";

import { buildCuratedIngestionPayload, curatedPackFingerprint } from "./curated-ingestion-payload";
import { CANONICAL_LANGUAGE, CANONICAL_UNITS, PACK_ID } from "./pack";
import { validatePack } from "./validator";

export const PRODUCTION_INGESTION_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_ENABLED",
  target: "BIRELLO_PRODUCTION_KNOWLEDGE_INGESTION_TARGET",
  databaseUrl: "BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_NAME",
  writer: "BIRELLO_PRODUCTION_KNOWLEDGE_WRITER",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_URL",
});

export type ProductionRpcMode = "validate" | "dry-run" | "apply";
type RunnerTarget = "production" | "local-managed-like-proof";

export type ProductionRpcOptions = Readonly<{
  mode: ProductionRpcMode;
  target: RunnerTarget;
  databaseUrl?: string;
  expectedDatabase?: string;
  expectedWriter?: string;
}>;

export type ProductionRpcReport = Readonly<{
  result: "PASS";
  target: RunnerTarget;
  mode: ProductionRpcMode;
  connected: boolean;
  writerIdentityObserved: string | null;
  callerDatabaseOwner: boolean | null;
  callerSuperuser: boolean | null;
  callerBypassRls: boolean | null;
  rpcInvoked: boolean;
  packId: string;
  canonicalLanguage: string;
  canonicalUnitCount: number;
  packFingerprint: string;
  validationPassed: boolean;
  transactionStarted: boolean;
  transactionCommitted: boolean;
  transactionRolledBack: boolean;
  entities: Readonly<Record<string, Readonly<{ planned: number; created: number; reused: number; updated: number; unchanged: number }>>>;
  evidenceClosure: Readonly<Record<string, number>>;
}>;

function plannedCounts(payload: Readonly<Record<string, unknown>>): Record<string, number> {
  const arrayCount = (key: string) => Array.isArray(payload[key]) ? payload[key].length : 0;
  return {
    trustDomains: 1,
    jurisdictions: 1,
    territorialScopes: 1,
    publishers: 1,
    authorities: 1,
    sources: 1,
    sourceVersions: 1,
    sourcePassages: arrayCount("passages"),
    claims: arrayCount("claims"),
    evidenceLinks: arrayCount("claims"),
    citations: arrayCount("claims"),
    responsibleActorRules: 1,
    processes: arrayCount("processes"),
    deadlineRules: arrayCount("deadlines"),
    processSteps: arrayCount("steps"),
    evidenceRequirements: arrayCount("requirements"),
    handlingPolicies: arrayCount("handlingPolicies"),
    freshnessRecords: arrayCount("freshnessRecords"),
    retrievalMetadata: arrayCount("retrievalMetadata"),
    terminology: arrayCount("terminology"),
  };
}

function validateUrl(databaseUrl: string, target: RunnerTarget): ClientConfig {
  const parsed = new URL(databaseUrl);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.username || !parsed.password) {
    throw new Error("A credentialed PostgreSQL maintenance URL is required");
  }
  for (const key of ["ssl", "sslmode", "sslcert", "sslkey", "sslrootcert", "requiressl"]) {
    if (parsed.searchParams.has(key)) throw new Error(`Unsafe TLS parameter: ${key}`);
  }
  const local = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  if (target === "production" && local) throw new Error("Production target rejects local URLs");
  if (target === "local-managed-like-proof" && !local) throw new Error("Local proof target requires localhost");
  return target === "production"
    ? { connectionString: databaseUrl, ssl: { rejectUnauthorized: true } }
    : { connectionString: databaseUrl };
}

export async function runProductionRpcIngestion(options: ProductionRpcOptions): Promise<ProductionRpcReport> {
  const validation = validatePack();
  if (validation.issues.length || !validation.matrixPassed) throw new Error("Committed pack validation failed");
  const payload = buildCuratedIngestionPayload();
  const planned = plannedCounts(payload);
  const base = {
    result: "PASS" as const,
    target: options.target,
    mode: options.mode,
    connected: false,
    writerIdentityObserved: null,
    callerDatabaseOwner: null,
    callerSuperuser: null,
    callerBypassRls: null,
    rpcInvoked: false,
    packId: PACK_ID,
    canonicalLanguage: CANONICAL_LANGUAGE,
    canonicalUnitCount: CANONICAL_UNITS.length,
    packFingerprint: curatedPackFingerprint(payload),
    validationPassed: true,
    transactionStarted: false,
    transactionCommitted: false,
    transactionRolledBack: false,
    entities: Object.freeze(Object.fromEntries(Object.entries(planned).map(([key, count]) => [key, Object.freeze({ planned: count, created: 0, reused: 0, updated: 0, unchanged: 0 })]))),
    evidenceClosure: Object.freeze({ claimsWithoutEvidence: 0, brokenEvidenceLinks: 0, jurisdictionlessClaims: 0, regionalPromotionViolations: 0 }),
  };
  if (options.mode === "validate") return Object.freeze(base);
  if (!options.databaseUrl || !options.expectedDatabase || !options.expectedWriter) {
    throw new Error("Writer URL and expected session identity are required");
  }

  const client = new Client(validateUrl(options.databaseUrl, options.target));
  let started = false;
  try {
    await client.connect();
    const session = await client.query(
      `select current_user as writer, current_database() as database_name,
              r.rolsuper, r.rolbypassrls,
              d.datdba = r.oid as database_owner,
              current_setting('server_version_num')::int as server_version_num
         from pg_catalog.pg_roles r
         join pg_catalog.pg_database d on d.datname=current_database()
        where r.rolname=current_user`,
    );
    const observed = session.rows[0] as Readonly<{ writer: string; database_name: string; rolsuper: boolean; rolbypassrls: boolean; database_owner: boolean; server_version_num: number }>;
    if (observed.writer !== options.expectedWriter || observed.database_name !== options.expectedDatabase) throw new Error("Unexpected ingestion session identity");
    if (observed.rolsuper || observed.rolbypassrls || observed.database_owner) throw new Error("Ingestion caller is over-privileged");
    if (observed.server_version_num < 170000) throw new Error("PostgreSQL 17 or later is required");
    const ledger = await client.query(`select count(*)::int as count from supabase_migrations.schema_migrations where version::text = any(array['010','032','033','035','036','037'])`);
    if (ledger.rows[0]?.count !== 6) throw new Error("Required migration ledger entries are missing");
    const rpc = await client.query(
      `select p.prosecdef, p.proconfig, has_function_privilege(current_user, p.oid, 'EXECUTE') as executable
         from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname='knowledge_ingest_curated_pack'
          and pg_catalog.pg_get_function_identity_arguments(p.oid)='p_payload jsonb'`,
    );
    const rpcRow = rpc.rows[0] as Readonly<{ prosecdef?: boolean; proconfig?: string[]; executable?: boolean }> | undefined;
    if (!rpcRow?.prosecdef || !rpcRow.executable || !rpcRow.proconfig?.some((value) => value === "search_path=pg_catalog, public")) {
      throw new Error("Curated ingestion RPC security contract is invalid");
    }
    await client.query("begin");
    started = true;
    await client.query("set local statement_timeout = '15s'");
    await client.query("set local lock_timeout = '2s'");
    const execution = await client.query(`select public.knowledge_ingest_curated_pack($1::jsonb) as result`, [payload]);
    const result = execution.rows[0]?.result as Readonly<{ semanticCreated: number; created: Record<string, number>; claimsWithoutEvidence: number; brokenEvidenceLinks: number; jurisdictionlessClaims: number; regionalPromotionViolations: number }>;
    const entities = Object.fromEntries(Object.entries(planned).map(([key, count]) => {
      const created = result.created[key] ?? 0;
      const reused = count - created;
      return [key, Object.freeze({ planned: count, created, reused, updated: 0, unchanged: reused })];
    }));
    if (options.mode === "dry-run") {
      await client.query("rollback");
      return Object.freeze({ ...base, connected: true, writerIdentityObserved: observed.writer, callerDatabaseOwner: false, callerSuperuser: false, callerBypassRls: false, rpcInvoked: true, transactionStarted: true, transactionRolledBack: true, entities: Object.freeze(entities), evidenceClosure: Object.freeze({ claimsWithoutEvidence: result.claimsWithoutEvidence, brokenEvidenceLinks: result.brokenEvidenceLinks, jurisdictionlessClaims: result.jurisdictionlessClaims, regionalPromotionViolations: result.regionalPromotionViolations }) });
    }
    await client.query("commit");
    return Object.freeze({ ...base, connected: true, writerIdentityObserved: observed.writer, callerDatabaseOwner: false, callerSuperuser: false, callerBypassRls: false, rpcInvoked: true, transactionStarted: true, transactionCommitted: true, entities: Object.freeze(entities), evidenceClosure: Object.freeze({ claimsWithoutEvidence: result.claimsWithoutEvidence, brokenEvidenceLinks: result.brokenEvidenceLinks, jurisdictionlessClaims: result.jurisdictionlessClaims, regionalPromotionViolations: result.regionalPromotionViolations }) });
  } catch (error) {
    if (started) await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    await client.end().catch(() => undefined);
  }
}

export function productionRpcOptionsFromEnvironment(environment: NodeJS.ProcessEnv = process.env): ProductionRpcOptions {
  if (environment[PRODUCTION_INGESTION_ENV.enabled] !== "true" || environment[PRODUCTION_INGESTION_ENV.target] !== "production") {
    throw new Error("Production knowledge ingestion is disabled");
  }
  if (environment[PRODUCTION_INGESTION_ENV.forbiddenPublicUrl]) throw new Error("Public ingestion credentials are forbidden");
  return Object.freeze({
    mode: "validate",
    target: "production",
    databaseUrl: environment[PRODUCTION_INGESTION_ENV.databaseUrl],
    expectedDatabase: environment[PRODUCTION_INGESTION_ENV.databaseName],
    expectedWriter: environment[PRODUCTION_INGESTION_ENV.writer],
  });
}
