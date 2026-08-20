import "server-only";

import { Client, type ClientConfig } from "pg";

import { stablePackEntityId } from "./identity";
import {
  CANONICAL_LANGUAGE,
  CANONICAL_UNITS,
  FEDERAL_JURISDICTION_CODE,
  PACK_ID,
  type HandlingMode,
} from "./pack";

const MAX_UNITS = 6;
const EXPECTED_READER = "birello_knowledge_reader";
const HANDLING_MODES = new Set<HandlingMode>([
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
]);
const UNIT_BY_ID = new Map(CANONICAL_UNITS.map((unit) => [unit.id, unit]));
const UNIT_ID_BY_CLAIM_ID = new Map(
  CANONICAL_UNITS.map((unit) => [stablePackEntityId(`claim:${unit.id}`), unit.id]),
);

export type RuntimeKnowledgeEvidence = Readonly<{
  canonicalUnitId: string;
  proposition: string;
  jurisdiction: string;
  canonicalLanguage: string;
  territorialScope: string | null;
  locator: string;
  citation: string;
  handlingMode: HandlingMode;
  canonicalValueUsable: boolean;
  staleBehavior: string;
  requiredContext: readonly string[];
  revalidationDueAt: string | null;
}>;

export type ControlledKnowledgeDiagnostics = Readonly<{
  knowledgeRetrievalAttempted: boolean;
  knowledgeRetrievalPerformed: boolean;
  packId: typeof PACK_ID;
  jurisdiction: typeof FEDERAL_JURISDICTION_CODE;
  canonicalKnowledgeLanguage: typeof CANONICAL_LANGUAGE;
  requestedOutputLanguage: "sk" | "de" | "en";
  selectedCanonicalUnitCount: number;
  retrievedEvidenceCount: number;
  knowledgeGroundedResponse: boolean;
}>;

export type ControlledKnowledgeResult = Readonly<{
  evidence: readonly RuntimeKnowledgeEvidence[];
  diagnostics: ControlledKnowledgeDiagnostics;
}>;

type RetrievalConfiguration = Readonly<{
  clientConfig: ClientConfig;
  database: string;
}>;

type ControlledKnowledgeDependencies = Readonly<{
  selectUnitIds: (text: string) => Promise<unknown>;
  retrieveRows: (
    claimIds: readonly string[],
    jurisdictionCodes: readonly string[],
    configuration: RetrievalConfiguration,
  ) => Promise<readonly Record<string, unknown>[]>;
  report: (diagnostics: ControlledKnowledgeDiagnostics) => void;
}>;

const ENV = Object.freeze({
  enabled: "SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED",
  databaseUrl: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL",
  databaseName: "BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_NAME",
  reader: "BIRELLO_PRODUCTION_KNOWLEDGE_READER",
  forbiddenPublicUrl: "NEXT_PUBLIC_BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL",
});

function configurationFromEnvironment(environment: NodeJS.ProcessEnv): RetrievalConfiguration | null {
  if (environment[ENV.forbiddenPublicUrl]) return null;
  if (environment[ENV.reader] !== EXPECTED_READER) return null;
  const databaseUrl = environment[ENV.databaseUrl];
  const database = environment[ENV.databaseName]?.trim();
  if (!databaseUrl || !database) return null;
  try {
    const parsed = new URL(databaseUrl);
    if (
      !["postgres:", "postgresql:"].includes(parsed.protocol)
      || !parsed.username
      || !parsed.password
      || ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)
    ) return null;
    for (const key of ["ssl", "sslmode", "sslcert", "sslkey", "sslrootcert", "requiressl"]) {
      if (parsed.searchParams.has(key)) return null;
    }
  } catch {
    return null;
  }
  return {
    database,
    clientConfig: {
      connectionString: databaseUrl,
      connectionTimeoutMillis: 4_000,
      ssl: { rejectUnauthorized: true },
    },
  };
}

async function selectUnitsWithModel(text: string): Promise<unknown> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return [];
  const catalog = CANONICAL_UNITS.map((unit) => ({ id: unit.id, text: unit.text }));
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_SMART_TALK_MODEL?.trim() || "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Classify only whether the question is covered by the supplied German residence-registration catalog. "
              + "If covered, select at most 6 directly relevant catalog IDs. If unrelated or uncertain, select none. "
              + "Return JSON {\"unitIds\":string[]} only. Do not answer, infer facts, or create IDs.",
          },
          { role: "user", content: JSON.stringify({ question: text, catalog }) },
        ],
      }),
      signal: AbortSignal.timeout(6_000),
    });
    if (!response.ok) return [];
    const body = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return (JSON.parse(body.choices?.[0]?.message?.content ?? "{}") as { unitIds?: unknown }).unitIds;
  } catch {
    return [];
  }
}

async function retrieveRowsFromProduction(
  claimIds: readonly string[],
  jurisdictionCodes: readonly string[],
  configuration: RetrievalConfiguration,
): Promise<readonly Record<string, unknown>[]> {
  const client = new Client(configuration.clientConfig);
  let transaction = false;
  try {
    await client.connect();
    const identity = await client.query(
      `select current_user as reader,current_database() as database_name,
              r.rolsuper,r.rolcreatedb,r.rolcreaterole,r.rolreplication,r.rolbypassrls,
              d.datdba=r.oid as database_owner
         from pg_catalog.pg_roles r
         join pg_catalog.pg_database d on d.datname=current_database()
        where r.rolname=current_user`,
    );
    const row = identity.rows[0] as Record<string, unknown> | undefined;
    if (
      !row
      || row.reader !== EXPECTED_READER
      || row.database_name !== configuration.database
      || row.rolsuper
      || row.rolcreatedb
      || row.rolcreaterole
      || row.rolreplication
      || row.rolbypassrls
      || row.database_owner
    ) throw new Error("Knowledge reader identity rejected");
    const privilegeResult = await client.query(
      `select
         has_function_privilege(current_user,'public.knowledge_retrieve_evidence_packets(uuid[],text[])','EXECUTE') as retrieval,
         has_function_privilege(current_user,'public.knowledge_ingest_curated_pack(jsonb)','EXECUTE') as ingestion,
         has_schema_privilege(current_user,'public','CREATE') as schema_create,
         (select count(*)::int from pg_catalog.pg_class c
           join pg_catalog.pg_namespace n on n.oid=c.relnamespace
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
    const privileges = privilegeResult.rows[0] as Record<string, unknown> | undefined;
    if (!privileges?.retrieval || privileges.ingestion || privileges.schema_create || privileges.table_access !== 0) {
      throw new Error("Knowledge reader privilege contract rejected");
    }
    await client.query("begin read only");
    transaction = true;
    await client.query("set local statement_timeout='8s'");
    await client.query("set local lock_timeout='1s'");
    const result = await client.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [claimIds, jurisdictionCodes],
    );
    await client.query("rollback");
    transaction = false;
    return result.rows as Record<string, unknown>[];
  } finally {
    if (transaction) await client.query("rollback").catch(() => undefined);
    await client.end().catch(() => undefined);
  }
}

function normalizeSelection(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length > MAX_UNITS) return null;
  if (value.some((id) => typeof id !== "string" || !UNIT_BY_ID.has(id))) return null;
  return [...new Set(value as string[])];
}

function compactEvidence(
  rows: readonly Record<string, unknown>[],
  selectedClaimIds: ReadonlySet<string>,
): readonly RuntimeKnowledgeEvidence[] {
  return rows.slice(0, MAX_UNITS).flatMap((row) => {
    const claimId = String(row.claim_id ?? "");
    const canonicalUnitId = UNIT_ID_BY_CLAIM_ID.get(claimId);
    const handlingMode = row.handling_mode;
    if (
      !selectedClaimIds.has(claimId)
      || !canonicalUnitId
      || row.jurisdiction_code !== FEDERAL_JURISDICTION_CODE
      || row.canonical_language !== CANONICAL_LANGUAGE
      || typeof row.canonical_proposition !== "string"
      || !row.canonical_proposition
      || typeof handlingMode !== "string"
      || !HANDLING_MODES.has(handlingMode as HandlingMode)
    ) return [];
    return [{
      canonicalUnitId,
      proposition: row.canonical_proposition,
      jurisdiction: FEDERAL_JURISDICTION_CODE,
      canonicalLanguage: CANONICAL_LANGUAGE,
      territorialScope: typeof row.territorial_scope === "string" ? row.territorial_scope : null,
      locator: typeof row.legal_locator === "string" ? row.legal_locator : "",
      citation: typeof row.citation_reference === "string" ? row.citation_reference : "",
      handlingMode: handlingMode as HandlingMode,
      canonicalValueUsable: row.canonical_value_usable === true,
      staleBehavior: typeof row.stale_behavior === "string" ? row.stale_behavior : "",
      requiredContext: Array.isArray(row.required_context_keys)
        ? row.required_context_keys.filter((key): key is string => typeof key === "string")
        : [],
      revalidationDueAt: row.revalidation_due_at ? String(row.revalidation_due_at) : null,
    }];
  });
}

const PRODUCTION_DEPENDENCIES: ControlledKnowledgeDependencies = {
  selectUnitIds: selectUnitsWithModel,
  retrieveRows: retrieveRowsFromProduction,
  report: (diagnostics) => console.info("[smart-talk-controlled-knowledge]", diagnostics),
};

function diagnostics(
  locale: "sk" | "de" | "en",
  attempted: boolean,
  performed: boolean,
  selected: number,
  retrieved: number,
): ControlledKnowledgeDiagnostics {
  return Object.freeze({
    knowledgeRetrievalAttempted: attempted,
    knowledgeRetrievalPerformed: performed,
    packId: PACK_ID,
    jurisdiction: FEDERAL_JURISDICTION_CODE,
    canonicalKnowledgeLanguage: CANONICAL_LANGUAGE,
    requestedOutputLanguage: locale,
    selectedCanonicalUnitCount: selected,
    retrievedEvidenceCount: retrieved,
    knowledgeGroundedResponse: retrieved > 0,
  });
}

export async function prepareControlledQuestionKnowledge(
  input: Readonly<{ text: string; locale: "sk" | "de" | "en"; environment?: NodeJS.ProcessEnv }>,
  dependencies: ControlledKnowledgeDependencies = PRODUCTION_DEPENDENCIES,
): Promise<ControlledKnowledgeResult> {
  const environment = input.environment ?? process.env;
  if (environment[ENV.enabled] !== "true") {
    return { evidence: [], diagnostics: diagnostics(input.locale, false, false, 0, 0) };
  }
  const configuration = configurationFromEnvironment(environment);
  if (!configuration) {
    const report = diagnostics(input.locale, true, false, 0, 0);
    dependencies.report(report);
    return { evidence: [], diagnostics: report };
  }
  let selected: readonly string[] | null;
  try {
    selected = normalizeSelection(await dependencies.selectUnitIds(input.text));
  } catch {
    selected = null;
  }
  if (!selected?.length) {
    const report = diagnostics(input.locale, true, false, 0, 0);
    dependencies.report(report);
    return { evidence: [], diagnostics: report };
  }
  const claimIds = selected.map((id) => stablePackEntityId(`claim:${id}`));
  try {
    const rows = await dependencies.retrieveRows(
      claimIds,
      [FEDERAL_JURISDICTION_CODE],
      configuration,
    );
    const evidence = compactEvidence(rows, new Set(claimIds));
    const report = diagnostics(input.locale, true, true, selected.length, evidence.length);
    dependencies.report(report);
    return { evidence, diagnostics: report };
  } catch {
    const report = diagnostics(input.locale, true, true, selected.length, 0);
    dependencies.report(report);
    return { evidence: [], diagnostics: report };
  }
}

export async function retrieveControlledQuestionKnowledge(
  text: string,
  locale: "sk" | "de" | "en",
): Promise<readonly RuntimeKnowledgeEvidence[]> {
  return (await prepareControlledQuestionKnowledge({ text, locale })).evidence;
}
