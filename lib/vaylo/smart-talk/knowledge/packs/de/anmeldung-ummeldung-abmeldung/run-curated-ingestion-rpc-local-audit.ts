import { Client } from "pg";

import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { LOCAL_DISPOSABLE_VALIDATION } from "./local-disposable-adapter";
import { retrieveEvidencePackets } from "./local-retrieval-proof";
import { runProductionRpcIngestion } from "./production-rpc-ingestion";

function requireLocalUrl(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  const parsed = new URL(value);
  if (!["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)) {
    throw new Error(`${name} must use localhost`);
  }
  return value;
}

async function expectRejected(client: Client, payload: unknown): Promise<boolean> {
  try {
    await client.query("begin");
    await client.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [payload]);
    await client.query("rollback");
    return false;
  } catch {
    await client.query("rollback").catch(() => undefined);
    return true;
  }
}

async function main(): Promise<void> {
  const callerUrl = requireLocalUrl("BIRELLO_LOCAL_RPC_CALLER_URL");
  const adminUrl = requireLocalUrl("BIRELLO_LOCAL_RPC_ADMIN_URL");
  const caller = new Client({ connectionString: callerUrl });
  const admin = new Client({ connectionString: adminUrl });
  await caller.connect();
  await admin.connect();
  try {
    const privilegeSql = Object.freeze({
      directInsert: "insert into public.knowledge_claims(id) values('00000000-0000-4000-8000-000000000001')",
      directUpdate: "update public.knowledge_claims set status='active'",
      directDelete: "delete from public.knowledge_claims",
      directSelect: "select * from public.knowledge_claims",
      unrelatedInsert: "insert into public.knowledge_forms(id) values('00000000-0000-4000-8000-000000000001')",
      unrelatedUpdate: "update public.knowledge_forms set review_status='unverified'",
      createTable: "create table public.rpc_forbidden(id integer)",
      alterTable: "alter table public.knowledge_claims add column rpc_forbidden integer",
      createSchema: "create schema rpc_forbidden",
      createRole: "create role rpc_forbidden",
      ledgerInsert: "insert into supabase_migrations.schema_migrations(version) values('999')",
      ledgerUpdate: "update supabase_migrations.schema_migrations set version='999' where version='037'",
    });
    const privilegeNegativeTests: Record<string, boolean> = {};
    for (const [name, sql] of Object.entries(privilegeSql)) {
      try {
        await caller.query(sql);
        privilegeNegativeTests[name] = false;
      } catch {
        privilegeNegativeTests[name] = true;
      }
    }
    const arbitraryFunction = await caller.query(
      `select coalesce(bool_and(not has_function_privilege(current_user,p.oid,'EXECUTE')),true) as denied
         from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname in ('knowledge_register_official_source','knowledge_bootstrap_publication_subject')`,
    );
    privilegeNegativeTests.arbitraryFunction = arbitraryFunction.rows[0]?.denied === true;

    const base = buildCuratedIngestionPayload() as Record<string, unknown>;
    const clone = () => structuredClone(base);
    const unknown = clone();
    unknown.targetTable = "knowledge_forms";
    const missingEvidence = clone();
    delete ((missingEvidence.claims as Record<string, unknown>[])[0]).evidenceId;
    const unsupportedLanguage = clone();
    unsupportedLanguage.canonicalLanguage = "en";
    const missingJurisdiction = clone();
    (missingJurisdiction.jurisdiction as Record<string, unknown>).code = "";
    const invalidRelation = clone();
    ((invalidRelation.claims as Record<string, unknown>[])[0]).jurisdictionId = "00000000-0000-4000-8000-000000000099";
    const brokenPassage = clone();
    ((brokenPassage.claims as Record<string, unknown>[])[0]).passageId = "00000000-0000-4000-8000-000000000099";
    const excessive = clone();
    excessive.claims = Array.from({ length: 501 }, () => (excessive.claims as unknown[])[0]);
    const invalidPayloadNegativeTests: Record<string, boolean> = {
      unknownStructure: await expectRejected(caller, unknown),
      missingClaimEvidence: await expectRejected(caller, missingEvidence),
      unsupportedLanguage: await expectRejected(caller, unsupportedLanguage),
      missingJurisdiction: await expectRejected(caller, missingJurisdiction),
      invalidDeterministicRelation: await expectRejected(caller, invalidRelation),
      brokenPassageRelation: await expectRejected(caller, brokenPassage),
      excessiveCardinality: await expectRejected(caller, excessive),
    };

    const sqlLike = clone();
    ((sqlLike.passages as Record<string, unknown>[])[0]).text =
      "'; create table public.rpc_payload_injection(id integer); --";
    await caller.query("begin");
    await caller.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [sqlLike]);
    await caller.query("rollback");
    invalidPayloadNegativeTests["sqlLikeInputInert"] =
      (await admin.query("select to_regclass('public.rpc_payload_injection') is null as inert")).rows[0]?.inert === true;

    const common = {
      target: "local-managed-like-proof" as const,
      databaseUrl: callerUrl,
      expectedDatabase: "postgres",
      expectedWriter: "birello_knowledge_ingestor",
    };
    const dryRun = await runProductionRpcIngestion({ ...common, mode: "dry-run" });
    const persistedAfterDryRun = await admin.query(
      "select (select count(*) from public.knowledge_claims)::int as claims, (select count(*) from public.knowledge_sources)::int as sources, (select count(*) from public.knowledge_processes)::int as processes",
    );
    const apply1 = await runProductionRpcIngestion({ ...common, mode: "apply" });
    const apply2 = await runProductionRpcIngestion({ ...common, mode: "apply" });

    const conflicting = clone();
    ((conflicting.claims as Record<string, unknown>[])[0]).text = "Conflicting canonical proposition";
    invalidPayloadNegativeTests["conflictingCanonicalClaim"] = await expectRejected(caller, conflicting);

    const retrieval: Record<string, string | null> = {};
    for (const questionId of ["Q1", "Q2", "Q3", "Q4", "Q5", "MUNICH", "BERLIN", "SLOVAK_UI"] as const) {
      const packets = await retrieveEvidencePackets(questionId, {
        capability: LOCAL_DISPOSABLE_VALIDATION,
        databaseUrl: adminUrl,
        jurisdictionCodes: ["DE"],
        userLocale: questionId === "SLOVAK_UI" ? "sk" : "de",
      });
      retrieval[questionId] = packets[0]?.canonicalUnitId ?? null;
    }

    process.stdout.write(`${JSON.stringify({
      privilegeNegativeTests,
      invalidPayloadNegativeTests,
      dryRun,
      persistedAfterDryRun: persistedAfterDryRun.rows[0],
      apply1,
      apply2,
      retrieval,
      networkCalls: 0,
    })}\n`);
  } finally {
    await caller.end();
    await admin.end();
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({ result: "FAILED", message: error instanceof Error ? error.message : "Local RPC audit failed" })}\n`);
  process.exitCode = 1;
});
