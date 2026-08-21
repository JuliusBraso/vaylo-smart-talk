import "server-only";

import { Client, type ClientConfig } from "pg";

import { stablePackEntityId } from "./identity";
import {
  CANONICAL_LANGUAGE,
  CANONICAL_UNITS,
  FEDERAL_JURISDICTION_CODE,
  FIRST_PACK_CANONICAL_UNIT_IDS,
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
const PRODUCTION_DEPLOYED_UNIT_IDS = new Set<string>(FIRST_PACK_CANONICAL_UNIT_IDS);
const PRODUCTION_DEPLOYED_UNITS = CANONICAL_UNITS.filter((unit) => PRODUCTION_DEPLOYED_UNIT_IDS.has(unit.id));
const UNIT_ID_BY_CLAIM_ID = new Map(
  PRODUCTION_DEPLOYED_UNITS.map((unit) => [stablePackEntityId(`claim:${unit.id}`), unit.id]),
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
  retrievalConnectionSucceeded: boolean;
  retrievalRpcInvoked: boolean;
  retrievalRpcSucceeded: boolean;
  retrievalZeroRows: boolean;
  retrievalRowContractRejected: boolean;
  retrievalFailureStage: RetrievalFailureStage | null;
  packId: typeof PACK_ID;
  jurisdiction: typeof FEDERAL_JURISDICTION_CODE;
  canonicalKnowledgeLanguage: typeof CANONICAL_LANGUAGE;
  requestedOutputLanguage: "sk" | "de" | "en";
  selectedCanonicalUnitIds: readonly string[];
  selectedClaimIds: readonly string[];
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

type RetrievalFailureStage =
  | "configuration"
  | "connection"
  | "identity"
  | "privilege"
  | "transaction"
  | "rpc";

type RetrievalAttemptResult =
  | Readonly<{
      ok: true;
      rows: readonly Record<string, unknown>[];
      connectionSucceeded: true;
      rpcInvoked: true;
      rpcSucceeded: true;
    }>
  | Readonly<{
      ok: false;
      rows: readonly [];
      connectionSucceeded: boolean;
      rpcInvoked: boolean;
      rpcSucceeded: false;
      failureStage: RetrievalFailureStage;
    }>;

type ControlledKnowledgeDependencies = Readonly<{
  selectUnitIds: (text: string) => Promise<unknown>;
  retrieveRows: (
    claimIds: readonly string[],
    jurisdictionCodes: readonly string[],
    configuration: RetrievalConfiguration,
  ) => Promise<RetrievalAttemptResult>;
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
  const catalog = PRODUCTION_DEPLOYED_UNITS.map((unit) => ({ id: unit.id, text: unit.text }));
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
): Promise<RetrievalAttemptResult> {
  const client = new Client(configuration.clientConfig);
  let transaction = false;
  let connectionSucceeded = false;
  let rpcInvoked = false;
  let failureStage: RetrievalFailureStage = "connection";
  try {
    await client.connect();
    connectionSucceeded = true;
    failureStage = "identity";
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
    failureStage = "privilege";
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
    failureStage = "transaction";
    await client.query("begin read only");
    transaction = true;
    await client.query("set local statement_timeout='8s'");
    await client.query("set local lock_timeout='1s'");
    failureStage = "rpc";
    rpcInvoked = true;
    const result = await client.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [claimIds, jurisdictionCodes],
    );
    await client.query("rollback");
    transaction = false;
    return {
      ok: true,
      rows: result.rows as Record<string, unknown>[],
      connectionSucceeded: true,
      rpcInvoked: true,
      rpcSucceeded: true,
    };
  } catch {
    return {
      ok: false,
      rows: [],
      connectionSucceeded,
      rpcInvoked,
      rpcSucceeded: false,
      failureStage,
    };
  } finally {
    if (transaction) await client.query("rollback").catch(() => undefined);
    await client.end().catch(() => undefined);
  }
}

function normalizeSelection(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length > MAX_UNITS) return null;
  if (value.some((id) => typeof id !== "string" || !UNIT_BY_ID.has(id))) return null;
  return [...new Set(value as string[])].filter((id) => PRODUCTION_DEPLOYED_UNIT_IDS.has(id));
}

function parseRequiredContextKeys(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return value.filter((key): key is string => typeof key === "string");
  }
  if (typeof value !== "string" || !/^\{(?:[A-Z_]+(?:,[A-Z_]+)*)?\}$/.test(value)) {
    return [];
  }
  return value.length === 2 ? [] : value.slice(1, -1).split(",");
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
      requiredContext: parseRequiredContextKeys(row.required_context_keys),
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
  state: Readonly<{
    attempted?: boolean;
    connectionSucceeded?: boolean;
    rpcInvoked?: boolean;
    rpcSucceeded?: boolean;
    zeroRows?: boolean;
    rowContractRejected?: boolean;
    failureStage?: RetrievalFailureStage | null;
    selectedUnitIds?: readonly string[];
    retrieved?: number;
  }> = {},
): ControlledKnowledgeDiagnostics {
  const retrieved = state.retrieved ?? 0;
  const selectedCanonicalUnitIds = state.selectedUnitIds ?? [];
  return Object.freeze({
    knowledgeRetrievalAttempted: state.attempted ?? false,
    knowledgeRetrievalPerformed: state.rpcSucceeded ?? false,
    retrievalConnectionSucceeded: state.connectionSucceeded ?? false,
    retrievalRpcInvoked: state.rpcInvoked ?? false,
    retrievalRpcSucceeded: state.rpcSucceeded ?? false,
    retrievalZeroRows: state.zeroRows ?? false,
    retrievalRowContractRejected: state.rowContractRejected ?? false,
    retrievalFailureStage: state.failureStage ?? null,
    packId: PACK_ID,
    jurisdiction: FEDERAL_JURISDICTION_CODE,
    canonicalKnowledgeLanguage: CANONICAL_LANGUAGE,
    requestedOutputLanguage: locale,
    selectedCanonicalUnitIds,
    selectedClaimIds: selectedCanonicalUnitIds.map((id) => stablePackEntityId(`claim:${id}`)),
    selectedCanonicalUnitCount: selectedCanonicalUnitIds.length,
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
    return { evidence: [], diagnostics: diagnostics(input.locale) };
  }
  const configuration = configurationFromEnvironment(environment);
  if (!configuration) {
    const report = diagnostics(input.locale, {
      attempted: true,
      failureStage: "configuration",
    });
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
    const report = diagnostics(input.locale, { attempted: true });
    dependencies.report(report);
    return { evidence: [], diagnostics: report };
  }
  const claimIds = selected.map((id) => stablePackEntityId(`claim:${id}`));
  try {
    const retrieval = await dependencies.retrieveRows(
      claimIds,
      [FEDERAL_JURISDICTION_CODE],
      configuration,
    );
    if (!retrieval.ok) {
      const report = diagnostics(input.locale, {
        attempted: true,
        connectionSucceeded: retrieval.connectionSucceeded,
        rpcInvoked: retrieval.rpcInvoked,
        failureStage: retrieval.failureStage,
        selectedUnitIds: selected,
      });
      dependencies.report(report);
      return { evidence: [], diagnostics: report };
    }
    const evidence = compactEvidence(retrieval.rows, new Set(claimIds));
    const report = diagnostics(input.locale, {
      attempted: true,
      connectionSucceeded: true,
      rpcInvoked: true,
      rpcSucceeded: true,
      zeroRows: retrieval.rows.length === 0,
      rowContractRejected: retrieval.rows.length > 0 && evidence.length === 0,
      selectedUnitIds: selected,
      retrieved: evidence.length,
    });
    dependencies.report(report);
    return { evidence, diagnostics: report };
  } catch {
    const report = diagnostics(input.locale, {
      attempted: true,
      failureStage: "connection",
      selectedUnitIds: selected,
    });
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
