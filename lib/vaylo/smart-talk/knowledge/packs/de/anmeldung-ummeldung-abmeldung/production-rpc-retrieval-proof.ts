import { Client, type ClientConfig } from "pg";

import { CANONICAL_LANGUAGE, CANONICAL_UNITS, FIRST_PACK_CANONICAL_UNIT_IDS, PACK_ID } from "./pack";
import { stablePackEntityId } from "./identity";

export const PRODUCTION_RETRIEVAL_ENV = Object.freeze({
  enabled: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_ENABLED",
  target: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_TARGET",
  databaseUrl: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_NAME",
  reader: "BIRELLO_PRODUCTION_KNOWLEDGE_READER",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL",
});

export type ProductionRetrievalMode = "validate" | "read-only";
export type ProductionRetrievalOptions = Readonly<{
  mode: ProductionRetrievalMode;
  target?: "production" | "local-managed-like-proof";
  databaseUrl?: string;
  expectedDatabase?: string;
  expectedReader?: string;
}>;

const CASES = Object.freeze({
  Q1: ["anmeldung-deadline-two-weeks", "anmeldung-duty"],
  Q2: ["domestic-move-new-registration", "abmeldung-duty-no-new-domestic-home"],
  Q3: ["landlord-confirmation-missing-notice", "landlord-participation", "landlord-confirmation"],
  Q4: ["abmeldung-duty-no-new-domestic-home", "abmeldung-deadline-two-weeks", "abmeldung-earliest-one-week"],
  Q5: ["ordinary-registration-fine-framework", "late-anmeldung-offence"],
  MUNICH: ["anmeldung-duty", "identity-and-confirmation"],
  BERLIN: ["anmeldung-duty", "identity-and-confirmation"],
  SLOVAK_UI: ["anmeldung-duty", "anmeldung-deadline-two-weeks"],
} as const);

type CaseName = keyof typeof CASES;
type CaseReport = Readonly<{
  expectedClaimCount: number;
  returnedClaimCount: number;
  expectedClaimsPresent: boolean;
  jurisdictionPassed: boolean;
  canonicalLanguagePassed: boolean;
  evidenceChainPassed: boolean;
  handlingContractPassed: boolean;
  metadataPassed: boolean;
}>;

function safeError(error: unknown): Error {
  const message = error instanceof Error ? error.message : "Production retrieval proof failed";
  if ([
    "Unexpected retrieval session identity",
    "Retrieval reader is over-privileged",
    "Retrieval reader privilege contract is invalid",
  ].includes(message)) {
    return new Error(message);
  }
  return new Error("Database connection or retrieval query failed");
}

function validateUrl(databaseUrl: string, target: "production" | "local-managed-like-proof"): ClientConfig {
  const parsed = new URL(databaseUrl);
  if (!["postgres:", "postgresql:"].includes(parsed.protocol) || !parsed.username || !parsed.password) {
    throw new Error("A credentialed PostgreSQL reader URL is required");
  }
  const local = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  if (target === "production" && local) {
    throw new Error("Production retrieval rejects local database URLs");
  }
  if (target === "local-managed-like-proof" && !local) {
    throw new Error("Local retrieval proof requires a local database URL");
  }
  for (const key of ["ssl", "sslmode", "sslcert", "sslkey", "sslrootcert", "requiressl"]) {
    if (parsed.searchParams.has(key)) throw new Error("Unsafe TLS configuration is forbidden");
  }
  return target === "production"
    ? { connectionString: databaseUrl, ssl: { rejectUnauthorized: true } }
    : { connectionString: databaseUrl };
}

function validateDefinitions(): void {
  if (PACK_ID !== "anmeldung_ummeldung_abmeldung" || CANONICAL_LANGUAGE !== "de" || FIRST_PACK_CANONICAL_UNIT_IDS.length !== 28) {
    throw new Error("Committed first-pack identity is invalid");
  }
  if (FIRST_PACK_CANONICAL_UNIT_IDS.some((id) => !CANONICAL_UNITS.some((unit) => unit.id === id))) {
    throw new Error("Original first-pack canonical identities are missing");
  }
  for (const units of Object.values(CASES)) {
    if (!units.length || units.some((id) => !CANONICAL_UNITS.some((unit) => unit.id === id))) {
      throw new Error("Committed retrieval proof cases are invalid");
    }
  }
}

function assessCase(rows: readonly Record<string, unknown>[], expectedIds: readonly string[]): CaseReport {
  const returned = new Set(rows.map((row) => String(row.claim_id)));
  const expectedClaimsPresent = expectedIds.every((id) => returned.has(id)) && returned.size === expectedIds.length;
  const evidenceChainPassed = rows.every((row) => row.source_id && row.source_version_id && row.source_passage_id && row.citation_reference);
  const handlingContractPassed = rows.every((row) =>
    typeof row.handling_mode === "string"
    && typeof row.canonical_value_usable === "boolean"
    && row.stale_behavior
    && Object.hasOwn(row, "revalidation_due_at")
    && Object.hasOwn(row, "required_context_keys"),
  );
  const metadataPassed = rows.every((row) =>
    typeof row.full_text_indexed === "boolean"
    && typeof row.vector_indexed === "boolean"
    && typeof row.effective_date_filter_required === "boolean"
    && typeof row.stale_policy_filter_required === "boolean",
  );
  return Object.freeze({
    expectedClaimCount: expectedIds.length,
    returnedClaimCount: rows.length,
    expectedClaimsPresent,
    jurisdictionPassed: rows.every((row) => row.jurisdiction_code === "DE"),
    canonicalLanguagePassed: rows.every((row) => row.canonical_language === "de"),
    evidenceChainPassed,
    handlingContractPassed,
    metadataPassed,
  });
}

export async function runProductionRetrievalProof(
  options: ProductionRetrievalOptions,
): Promise<Readonly<Record<string, unknown>>> {
  validateDefinitions();
  const base = {
    result: "PASS",
    target: options.target ?? "production",
    mode: options.mode,
    connected: false,
    readerIdentityVerified: false,
    databaseIdentityVerified: false,
    readerOverPrivilegeRejected: false,
    tlsVerificationRequired: true,
    readOnlyTransactionStarted: false,
    readOnlyTransactionRolledBack: false,
    rpcInvoked: false,
    packId: PACK_ID,
    canonicalLanguage: CANONICAL_LANGUAGE,
    canonicalUnitCount: FIRST_PACK_CANONICAL_UNIT_IDS.length,
    productionWritesPerformed: false,
    productionIngestionPerformed: false,
    publicRuntimeAuthorized: false,
  };
  if (options.mode === "validate") return Object.freeze({ ...base, validationPassed: true });
  if (!options.databaseUrl || !options.expectedDatabase || !options.expectedReader) {
    throw new Error("Reader URL and expected session identity are required");
  }

  const client = new Client(validateUrl(options.databaseUrl, options.target ?? "production"));
  let transaction = false;
  try {
    await client.connect();
    const session = await client.query(
      `select current_user as reader, current_database() as database_name,
              r.rolsuper,r.rolcreatedb,r.rolcreaterole,r.rolreplication,r.rolbypassrls,
              d.datdba=r.oid as database_owner
         from pg_catalog.pg_roles r
         join pg_catalog.pg_database d on d.datname=current_database()
        where r.rolname=current_user`,
    );
    const identity = session.rows[0] as Record<string, unknown> | undefined;
    if (!identity || identity.reader !== options.expectedReader || identity.database_name !== options.expectedDatabase) {
      throw new Error("Unexpected retrieval session identity");
    }
    if (identity.rolsuper || identity.rolcreatedb || identity.rolcreaterole || identity.rolreplication || identity.rolbypassrls || identity.database_owner) {
      throw new Error("Retrieval reader is over-privileged");
    }
    const privileges = await client.query(
      `select
         has_function_privilege(current_user,'public.knowledge_retrieve_evidence_packets(uuid[],text[])','EXECUTE') as retrieval,
         has_function_privilege(current_user,'public.knowledge_ingest_curated_pack(jsonb)','EXECUTE') as ingestion,
         has_schema_privilege(current_user,'public','CREATE') as schema_create,
         (select count(*)::int from pg_class c join pg_namespace n on n.oid=c.relnamespace
           where n.nspname='public'
             and c.relname=any($1::text[])
             and (has_table_privilege(current_user,c.oid,'SELECT')
               or has_table_privilege(current_user,c.oid,'INSERT')
               or has_table_privilege(current_user,c.oid,'UPDATE')
               or has_table_privilege(current_user,c.oid,'DELETE'))) as table_access`,
      [[
        "knowledge_claims", "knowledge_jurisdictions", "knowledge_territorial_scopes",
        "knowledge_claim_evidence_links", "knowledge_source_passages", "knowledge_source_versions",
        "knowledge_sources", "knowledge_citations", "knowledge_source_handling_policies",
        "knowledge_retrieval_metadata",
      ]],
    );
    const privilege = privileges.rows[0] as Record<string, unknown> | undefined;
    if (!privilege?.retrieval || privilege.ingestion || privilege.schema_create || privilege.table_access !== 0) {
      throw new Error("Retrieval reader privilege contract is invalid");
    }
    await client.query("begin read only");
    transaction = true;
    await client.query("set local statement_timeout='10s'");
    await client.query("set local lock_timeout='1s'");
    const proofCases: Record<CaseName, CaseReport> = {} as Record<CaseName, CaseReport>;
    for (const [name, unitIds] of Object.entries(CASES) as [CaseName, readonly string[]][]) {
      const expectedIds = unitIds.map((id) => stablePackEntityId(`claim:${id}`));
      const result = await client.query(
        "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
        [expectedIds, ["DE"]],
      );
      proofCases[name] = assessCase(result.rows as Record<string, unknown>[], expectedIds);
    }
    await client.query("rollback");
    transaction = false;
    const allPassed = Object.values(proofCases).every((proof) => Object.values(proof).every(Boolean));
    return Object.freeze({
      ...base,
      connected: true,
      readerIdentityVerified: true,
      databaseIdentityVerified: true,
      readOnlyTransactionStarted: true,
      readOnlyTransactionRolledBack: true,
      rpcInvoked: true,
      directKnowledgeSelectDenied: true,
      knowledgeWritesDenied: true,
      ingestionRpcDenied: true,
      schemaCreateDenied: true,
      proofCases: Object.freeze(proofCases),
      allPassed,
    });
  } catch (error) {
    if (transaction) await client.query("rollback").catch(() => undefined);
    throw safeError(error);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export function productionRetrievalOptionsFromEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
): Omit<ProductionRetrievalOptions, "mode"> {
  if (environment[PRODUCTION_RETRIEVAL_ENV.enabled] !== "true" || environment[PRODUCTION_RETRIEVAL_ENV.target] !== "production") {
    throw new Error("Production knowledge retrieval proof is disabled");
  }
  if (environment[PRODUCTION_RETRIEVAL_ENV.forbiddenPublicUrl]) {
    throw new Error("Public retrieval credentials are forbidden");
  }
  if (environment[PRODUCTION_RETRIEVAL_ENV.reader] !== "birello_knowledge_reader") {
    throw new Error("Expected reader must be birello_knowledge_reader");
  }
  return Object.freeze({
    databaseUrl: environment[PRODUCTION_RETRIEVAL_ENV.databaseUrl],
    expectedDatabase: environment[PRODUCTION_RETRIEVAL_ENV.databaseName],
    expectedReader: environment[PRODUCTION_RETRIEVAL_ENV.reader],
  });
}
