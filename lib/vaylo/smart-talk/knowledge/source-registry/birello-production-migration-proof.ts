import "server-only";

import { Client } from "pg";

import {
  configurationFromBirelloPreflightEnvironment,
  type BirelloPreflightConfiguration,
  type BirelloPreflightReport,
} from "./birello-production-preflight-executor";
import {
  ANMELDUNG_CONTEXT_RPC_STATEMENT,
  FIXED_ANMELDUNG_CLAIM_IDS,
  configurationFromAnmeldungContextProofEnvironment,
  type AnmeldungContextProofConfiguration,
  type AnmeldungContextProofReport,
} from "../packs/de/anmeldung-ummeldung-abmeldung/production-anmeldung-context-proof";

export type BirelloMigrationProof = "042" | "043";
export type BirelloMigrationProofMode = "validate" | "execute-read-only";
export type BirelloMigrationProofConfiguration = Readonly<{
  preflight: BirelloPreflightConfiguration;
  reader: AnmeldungContextProofConfiguration;
}>;
export type BirelloMigrationProofReport = Readonly<Record<string, unknown>>;
export type BirelloMigrationProofClient = Readonly<{
  connect(): Promise<void>;
  query(sql: string, values?: readonly unknown[]):
    Promise<Readonly<{ rows: readonly Record<string, unknown>[] }>>;
  end(): Promise<void>;
}>;
export type BirelloMigrationProofClientFactory =
  (connectionString: string, verifiedTls: boolean, applicationName: string) =>
    BirelloMigrationProofClient;

function result(name: string, additions: Record<string, unknown> = {}):
BirelloMigrationProofReport {
  return Object.freeze({
    result: name, productionWritesPerformed: false, secretsPrinted: false, ...additions,
  });
}

export function configurationFromBirelloMigrationProofEnvironment(
  environment: Readonly<Record<string, string | undefined>> = process.env,
): BirelloMigrationProofConfiguration | BirelloMigrationProofReport {
  const preflight = configurationFromBirelloPreflightEnvironment(environment);
  const reader = configurationFromAnmeldungContextProofEnvironment(environment);
  if (!("target" in preflight) || !("target" in reader)) {
    const reports = [preflight, reader] as readonly (
      BirelloPreflightReport | AnmeldungContextProofReport
    )[];
    const missing = reports.flatMap((report) =>
      report.result === "CONFIGURATION_REQUIRED" ? report.missing : []);
    return missing.length
      ? result("CONFIGURATION_REQUIRED", { missing: Object.freeze(missing) })
      : result("REJECTED", { failureCode: "CONFIGURATION_INVALID" });
  }
  return Object.freeze({ preflight, reader });
}

const clientFactory: BirelloMigrationProofClientFactory =
  (connectionString, verifiedTls, applicationName) => {
    const client = new Client({
      connectionString,
      ssl: verifiedTls ? { rejectUnauthorized: true } : undefined,
      application_name: applicationName,
    });
    return {
      connect: async () => { await client.connect(); },
      query: async (sql, values) => ({
        rows: (await client.query(sql, values as unknown[] | undefined)).rows,
      }),
      end: () => client.end(),
    };
  };

export const BIRELLO_MIGRATION_SEMANTIC_PROOF_SQL = `select
  (select count(*)::int from supabase_migrations.schema_migrations
    where version::text='042') ledger042,
  (select count(*)::int from supabase_migrations.schema_migrations
    where version::text='043') ledger043,
  (select count(*)::int from public.knowledge_trust_domains
    where lower(btrim(code))='de') semantic_de_trust_domains,
  (select count(*)::int from public.knowledge_jurisdictions
    where country_code='DE' and jurisdiction_level='de_federal'
      and jurisdiction_code='DE' and parent_jurisdiction_id is null)
    federal_de_jurisdictions,
  (select count(*)::int from (
    select normalized_canonical_url from public.knowledge_sources
    where normalized_canonical_url is not null
    group by normalized_canonical_url having count(*)>1
  ) duplicate_urls) duplicate_normalized_urls,
  (select count(*)::int from public.knowledge_claims c
    join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
    where j.country_code='DE' and j.jurisdiction_level='de_federal'
      and j.jurisdiction_code='DE') federal_claims,
  (select count(*)::int from public.knowledge_retrieval_metadata rm
    join public.knowledge_claims c
      on rm.entity_type='claim' and rm.entity_id=c.id
    join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
    where j.country_code='DE' and j.jurisdiction_level='de_federal'
      and j.jurisdiction_code='DE') federal_metadata,
  (select count(*)::int from (
    select rm.entity_id from public.knowledge_retrieval_metadata rm
    join public.knowledge_claims c
      on rm.entity_type='claim' and rm.entity_id=c.id
    join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
    where j.country_code='DE' and j.jurisdiction_level='de_federal'
      and j.jurisdiction_code='DE'
    group by rm.entity_id having count(*)>1
  ) duplicates) duplicate_federal_metadata,
  (select count(*)::int from public.knowledge_claims c
    join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
    left join public.knowledge_retrieval_metadata rm
      on rm.entity_type='claim' and rm.entity_id=c.id
    where j.country_code='DE' and j.jurisdiction_level='de_federal'
      and j.jurisdiction_code='DE' and rm.id is null) missing_federal_metadata,
  (select count(*)::int from public.knowledge_jurisdictions
    where jurisdiction_level='de_gemeinde' and jurisdiction_code='09571218')
    weiltingen_jurisdiction,
  (select count(*)::int from public.knowledge_territorial_scopes
    where scope_type='municipality' and municipality_codes=array['09571218'])
    weiltingen_scope,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname in ('knowledge_ingest_curated_domain_pack',
        'knowledge_ingest_curated_service_area_pack')
      and p.prosecdef and p.proconfig=array['search_path=pg_catalog, public']::text[])
    secure_factory_functions,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_ingestor',
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_domain_pack(jsonb)'),
    'EXECUTE'),false) g3_execute,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_ingestor',
    pg_catalog.to_regprocedure('public.knowledge_ingest_curated_service_area_pack(jsonb)'),
    'EXECUTE'),false) g4_execute,
  (select count(*)::int from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
    on n.oid=p.pronamespace where n.nspname='public'
      and p.proname in ('knowledge_retrieve_evidence_packets',
        'knowledge_retrieve_anmeldung_context')
      and p.prosecdef and p.proconfig=array['search_path=pg_catalog, public']::text[])
    secure_retrieval_functions,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_reader',
    pg_catalog.to_regprocedure('public.knowledge_retrieve_evidence_packets(uuid[],text[])'),
    'EXECUTE'),false) rpc038_execute,
  coalesce(pg_catalog.has_function_privilege('birello_knowledge_reader',
    pg_catalog.to_regprocedure('public.knowledge_retrieve_anmeldung_context(uuid[],text)'),
    'EXECUTE'),false) rpc040_execute,
  coalesce((select pg_catalog.pg_get_functiondef(
    'public.knowledge_retrieve_anmeldung_context(uuid[],text)'::regprocedure)
    like '%scope_type = ''service_area''%'),false) service_area_contract,
  coalesce((select pg_catalog.pg_get_functiondef(
    'public.knowledge_ingest_curated_service_area_pack(jsonb)'::regprocedure)
    like '%residence_registration_lifecycle%'),false) competence_family_contract`;

function structuralPass(proof: BirelloMigrationProof, row: Record<string, unknown>): boolean {
  const common = Number(row.ledger042) === 1
    && Number(row.semantic_de_trust_domains) === 1
    && Number(row.federal_de_jurisdictions) === 1
    && Number(row.duplicate_normalized_urls) === 0
    && Number(row.federal_claims) === 41 && Number(row.federal_metadata) === 41
    && Number(row.duplicate_federal_metadata) === 0
    && Number(row.missing_federal_metadata) === 0
    && Number(row.weiltingen_jurisdiction) === 1 && Number(row.weiltingen_scope) === 1
    && Number(row.secure_factory_functions) === 2
    && row.g3_execute === true && row.g4_execute === true;
  return common && (proof === "042" ? Number(row.ledger043) === 0 : (
    Number(row.ledger043) === 1 && Number(row.secure_retrieval_functions) === 2
    && row.rpc038_execute === true && row.rpc040_execute === true
    && row.service_area_contract === true && row.competence_family_contract === true
  ));
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("INVALID_RESULT");
  }
  return value as Record<string, unknown>;
}

export async function runBirelloMigrationReadOnlyProof(
  configurationOrReport:
    BirelloMigrationProofConfiguration | BirelloMigrationProofReport,
  proof: BirelloMigrationProof,
  mode: BirelloMigrationProofMode,
  factory: BirelloMigrationProofClientFactory = clientFactory,
): Promise<BirelloMigrationProofReport> {
  if (!("preflight" in configurationOrReport)) return configurationOrReport;
  const configuration = configurationOrReport as BirelloMigrationProofConfiguration;
  if (mode === "validate") {
    return result("PASS", {
      proof, mode, connectionAttempted: false, transactionBegan: false,
      transactionRolledBack: false,
    });
  }
  const preflight = factory(
    configuration.preflight.connectionString,
    configuration.preflight.verifiedTls,
    `birello_migration_${proof}_semantic_proof_v1`,
  );
  const reader = factory(
    configuration.reader.connectionString,
    configuration.reader.verifiedTls,
    `birello_migration_${proof}_rpc_proof_v1`,
  );
  let preflightConnected = false;
  let readerConnected = false;
  let preflightTransaction = false;
  let readerTransaction = false;
  try {
    await preflight.connect(); preflightConnected = true;
    await preflight.query("BEGIN READ ONLY"); preflightTransaction = true;
    const semantic = (await preflight.query(BIRELLO_MIGRATION_SEMANTIC_PROOF_SQL)).rows[0]!;
    await preflight.query("ROLLBACK"); preflightTransaction = false;
    if (!structuralPass(proof, semantic)) {
      return result("REJECTED", {
        failureCode: "SEMANTIC_PROOF_MISMATCH", proof, semantic,
        connectionAttempted: true, transactionBegan: true, transactionRolledBack: true,
      });
    }

    let rpcProof: Record<string, unknown> | null = null;
    if (proof === "043") {
      await reader.connect(); readerConnected = true;
      await reader.query("BEGIN READ ONLY"); readerTransaction = true;
      const weiltingen = object((await reader.query(
        ANMELDUNG_CONTEXT_RPC_STATEMENT,
        [FIXED_ANMELDUNG_CLAIM_IDS, "09571218"],
      )).rows[0]?.result);
      const local = object(weiltingen.localContext);
      const locality = object(local.locality);
      const competence = object(local.competence);
      let bremerhavenRejected = false;
      try {
        await reader.query(
          ANMELDUNG_CONTEXT_RPC_STATEMENT,
          [FIXED_ANMELDUNG_CLAIM_IDS, "04012000"],
        );
      } catch (error) {
        bremerhavenRejected = String(error).includes("CURATED_RETRIEVAL_UNKNOWN_LOCALITY");
      }
      await reader.query("ROLLBACK"); readerTransaction = false;
      rpcProof = {
        weiltingenMunicipality: locality.municipalityCode,
        competenceFamily: competence.family,
        bremerhavenRejected,
      };
      if (locality.municipalityCode !== "09571218"
        || competence.family !== "residence_registration_lifecycle"
        || !bremerhavenRejected) {
        return result("REJECTED", {
          failureCode: "RPC_PROOF_MISMATCH", proof, semantic, rpcProof,
          connectionAttempted: true, transactionBegan: true, transactionRolledBack: true,
        });
      }
    }
    return result("PASS", {
      proof, mode, semantic, rpcProof, connectionAttempted: true,
      transactionBegan: true, transactionRolledBack: true,
    });
  } catch {
    if (preflightTransaction) await preflight.query("ROLLBACK").catch(() => undefined);
    if (readerTransaction) await reader.query("ROLLBACK").catch(() => undefined);
    return result("REJECTED", {
      failureCode: "EXECUTION_FAILED", proof,
      connectionAttempted: preflightConnected || readerConnected,
      transactionBegan: preflightTransaction || readerTransaction,
      transactionRolledBack: preflightTransaction || readerTransaction,
    });
  } finally {
    if (preflightConnected) await preflight.end().catch(() => undefined);
    if (readerConnected) await reader.end().catch(() => undefined);
  }
}
