/**
 * ANMELDUNG-V2-CONTENT-01B — disposable 28→41 federal expansion via migration 037.
 * PostgreSQL 17 only. No production connection, ingestion, or migration change.
 *
 * LEGACY_ANMELDUNG_037_TO_FACTORY_041_COMPATIBILITY is recorded, not solved.
 */
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildWeiltingenLocalityPilotPayload, WEILTINGEN_PILOT } from "./bayern-weiltingen-locality-pilot";
import {
  buildCuratedIngestionPayload,
  buildFirstPackIngestionPayload,
  curatedPackFingerprint,
} from "./curated-ingestion-payload";
import { PACK_ENTITY_IDS, stablePackEntityId } from "./identity";
import {
  BMG_PASSAGES,
  BMG_SOURCE,
  CANONICAL_UNITS,
  FIRST_PACK_CANONICAL_UNIT_IDS,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "./pack";
import { validatePack } from "./validator";

const IMAGE = "postgres:17";
const DB = "v2_01b_expansion";
const PASSWORD = `v201b-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const READER_PASSWORD = `reader-${randomUUID()}`;
const CONTAINER = `moja-v201b-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
  "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
] as const;
const FEDERAL_INGEST = "select public.knowledge_ingest_curated_pack($1::jsonb) as result";
const LOCAL_INGEST = "select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result";
const RETRIEVE = "select * from public.knowledge_retrieve_evidence_packets($1::uuid[], $2::text[])";
const MIGRATION_HASHES = Object.freeze({
  "037_add_curated_knowledge_pack_ingestion_rpc.sql": "3ca37baf83cff900759471d717419b2d6010bfb8",
  "038_add_curated_knowledge_retrieval_rpc.sql": "483eaae767ee2c810f5c0decb375bd308fada323",
  "039_add_curated_locality_pack_ingestion_rpc.sql": "5fd38d4a89c9f93443961f7c19de1e7e945eea9a",
  "040_add_anmeldung_context_retrieval_rpc.sql": "8369efca863342d0dc102084c317a49c40e8c02c",
  "041_add_generalized_curated_knowledge_ingestion.sql": "7d488115488e131326d39160980a59090a092282",
} as const);
const WEILTINGEN_IDS = Object.freeze({
  municipality: stablePackEntityId("v2c-weiltingen:locality"),
  scope: stablePackEntityId("v2c-weiltingen:scope"),
  authority: stablePackEntityId("v2c-weiltingen:authority"),
  competence: stablePackEntityId("v2c-weiltingen:competence"),
  sources: ["anmeldung", "hours", "appointments"].map((key) =>
    stablePackEntityId(`v2c-weiltingen:source:${key}`)),
});
const RETRIEVAL_UNITS = Object.freeze({
  original: "anmeldung-duty",
  procedure: "electronic-anmeldung-federal-procedure",
  certificate: "meldebescheinigung-on-request",
  exception: "diplomatic-or-treaty-exemption",
  sanction: "fictitious-address-fine-framework",
} as const);

type IngestCounts = Readonly<{ semanticCreated: number; created: Readonly<Record<string, number>> }>;

function run(file: string, args: string[], timeout = 120_000): { code: number; stdout: string; stderr: string } {
  const out = spawnSync(file, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    code: out.status ?? (out.error ? 1 : 0),
    stdout: out.stdout ?? "",
    stderr: `${out.stderr ?? ""}${out.error ? `\n${out.error.message}` : ""}`,
  };
}

function sql(text: string, timeout = 120_000): { code: number; stdout: string; stderr: string } {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
    "-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-A", "-t", "-c", text,
  ], timeout);
}

function blobHash(content: string): string {
  const normalized = content.replace(/\r\n/gu, "\n");
  return createHash("sha1")
    .update(`blob ${Buffer.byteLength(normalized)}\0`)
    .update(normalized)
    .digest("hex");
}

function claimId(unitId: string): string {
  return stablePackEntityId(`claim:${unitId}`);
}

function ingestResult(row: unknown): IngestCounts {
  const value = row as IngestCounts;
  return {
    semanticCreated: Number(value.semanticCreated ?? -1),
    created: Object.freeze({ ...(value.created ?? {}) }),
  };
}

async function weiltingenCounts(client: Client) {
  const result = await client.query(
    `select
       (select count(*)::int from public.knowledge_jurisdictions
         where id=$1::uuid and jurisdiction_code=$2) as municipality,
       (select count(*)::int from public.knowledge_territorial_scopes where id=$3::uuid) as scope,
       (select count(*)::int from public.knowledge_authorities where id=$4::uuid) as authority,
       (select count(*)::int from public.knowledge_authority_competences where id=$5::uuid) as competence,
       (select count(*)::int from public.knowledge_sources where id = any($6::uuid[])) as sources`,
    [
      WEILTINGEN_IDS.municipality,
      WEILTINGEN_PILOT.municipalityCode,
      WEILTINGEN_IDS.scope,
      WEILTINGEN_IDS.authority,
      WEILTINGEN_IDS.competence,
      WEILTINGEN_IDS.sources,
    ],
  );
  return result.rows[0] as Readonly<{
    municipality: number; scope: number; authority: number; competence: number; sources: number;
  }>;
}

function officialEvidence() {
  const passages = new Map(BMG_PASSAGES.map((passage) => [passage.id, passage]));
  const unsupported: string[] = [];
  const v2aReferences = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) => {
    const unit = CANONICAL_UNITS.find((candidate) => candidate.id === id);
    const passage = unit ? passages.get(unit.passageId) : undefined;
    const official = Boolean(
      unit
      && passage
      && unit.jurisdictionCode === "DE"
      && unit.nationwideEvidence
      && passage.url.startsWith("https://www.gesetze-im-internet.de/bmg/")
      && BMG_SOURCE.canonicalUrl.startsWith("https://www.gesetze-im-internet.de"),
    );
    if (!official) unsupported.push(id);
    return Object.freeze({
      canonicalUnitId: id,
      passageId: unit?.passageId ?? null,
      locator: passage?.locator ?? null,
      url: passage?.url ?? null,
      official,
    });
  });
  const allOfficial = CANONICAL_UNITS.every((unit) => {
    const passage = passages.get(unit.passageId);
    return Boolean(
      passage
      && unit.jurisdictionCode === "DE"
      && unit.nationwideEvidence
      && passage.url.startsWith("https://www.gesetze-im-internet.de/bmg/"),
    );
  });
  return Object.freeze({
    allOfficial,
    unsupported,
    v2aReferences,
  });
}

function identityProof() {
  const first = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) => claimId(id));
  const v2a = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) => Object.freeze({
    canonicalUnitId: id,
    claimId: claimId(id),
  }));
  const allClaimIds = [...first, ...v2a.map((item) => item.claimId)];
  const unitIds = CANONICAL_UNITS.map((unit) => unit.id);
  const texts = CANONICAL_UNITS.map((unit) => unit.text);
  const payloadA = buildCuratedIngestionPayload();
  const payloadB = buildCuratedIngestionPayload();
  const firstPack = buildFirstPackIngestionPayload();
  return Object.freeze({
    original28Unchanged: first.every((id, index) => id === claimId(FIRST_PACK_CANONICAL_UNIT_IDS[index]!)),
    v2aClaimIds: v2a,
    collisionCount: allClaimIds.length - new Set(allClaimIds).size,
    duplicateCanonicalIds: unitIds.length - new Set(unitIds).size,
    semanticDuplicateCount: texts.length - new Set(texts).size,
    deterministicRerun: JSON.stringify(payloadA) === JSON.stringify(payloadB)
      && curatedPackFingerprint(payloadA) === curatedPackFingerprint(payloadB),
    totalClaims: (payloadA.claims as unknown[]).length,
    firstPackClaims: (firstPack.claims as unknown[]).length,
    firstPackPassages: (firstPack.passages as unknown[]).length,
    fullPassages: (payloadA.passages as unknown[]).length,
    versionId: (payloadA.sourceVersion as { id: string }).id === PACK_ENTITY_IDS.version,
    versionHashShared: (payloadA.sourceVersion as { contentHash: string }).contentHash
      === (firstPack.sourceVersion as { contentHash: string }).contentHash,
    factoryIdAbsent: !JSON.stringify(payloadA).includes("knowledge-factory:"),
    originalProcessFirstSteps: (payloadA.processes as Array<{ firstStep: string }>).map((item) => item.firstStep)
      .join("|") === [
        "Anmeldung innerhalb der gesetzlichen Frist vorbereiten.",
        "Anmeldung bei der neuen Meldebehörde vorbereiten.",
        "Abmeldung innerhalb der gesetzlichen Frist vorbereiten.",
      ].join("|"),
  });
}

function staticContract(): boolean {
  const payloadSource = fs.readFileSync(
    path.join(process.cwd(), "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/curated-ingestion-payload.ts"),
    "utf8",
  );
  const controlled = fs.readFileSync(
    path.join(process.cwd(), "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts"),
    "utf8",
  );
  const factoryGrants = fs.readFileSync(
    path.join(process.cwd(), "lib/vaylo/smart-talk/knowledge/source-registry/birello-runtime-rpc-grant-executor.ts"),
    "utf8",
  );
  const migration038 = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql"),
    "utf8",
  );
  const migration040 = fs.readFileSync(
    path.join(process.cwd(), "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql"),
    "utf8",
  );
  const hashesOk = Object.entries(MIGRATION_HASHES).every(([name, expected]) =>
    blobHash(fs.readFileSync(path.join(process.cwd(), "supabase/migrations", name), "utf8")) === expected);
  const gitMigrations = run("git", [
    "diff", "HEAD", "--",
    "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
    "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
    "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
    "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
    "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
  ]);
  return hashesOk
    && gitMigrations.code === 0
    && gitMigrations.stdout.trim() === ""
    && payloadSource.includes("LEGACY_ANMELDUNG_037_TO_FACTORY_041_COMPATIBILITY")
    && payloadSource.includes("stablePackEntityId")
    && !payloadSource.includes("stableKnowledgeFactoryId")
    && factoryGrants.includes("BIRELLO_KNOWLEDGE_FACTORY_RPC_GRANTS_V1")
    && factoryGrants.includes("knowledge_ingest_curated_domain_pack")
    && factoryGrants.includes("knowledge_ingest_curated_service_area_pack")
    && !migration038.includes("FIRST_PACK_CANONICAL_UNIT_IDS")
    && !migration040.includes("FIRST_PACK_CANONICAL_UNIT_IDS")
    && controlled.includes("PRODUCTION_DEPLOYED_UNIT_IDS")
    && CANONICAL_UNITS.length === 41
    && FIRST_PACK_CANONICAL_UNIT_IDS.length === 28
    && V2A_ADDED_CANONICAL_UNIT_IDS.length === 13
    && validatePack().issues.length === 0;
}

async function retrieveUnit(client: Client, unitId: string) {
  const result = await client.query(RETRIEVE, [[claimId(unitId)], ["DE"]]);
  const row = result.rows[0] as Record<string, unknown> | undefined;
  const unit = CANONICAL_UNITS.find((candidate) => candidate.id === unitId);
  return Object.freeze({
    unitId,
    retrieved: Boolean(row),
    claimId: row ? String(row.claim_id) : null,
    matchesDeterministicId: row ? String(row.claim_id) === claimId(unitId) : false,
    jurisdiction: row ? String(row.jurisdiction_code) : null,
    canonicalLanguage: row ? String(row.canonical_language) : null,
    proposition: row ? String(row.canonical_proposition) : null,
    handlingMode: row ? String(row.handling_mode) : null,
    staleBehavior: row ? String(row.stale_behavior) : null,
    fullTextIndexed: row ? row.full_text_indexed === true : false,
    sourceId: row ? String(row.source_id) : null,
    sourceVersionId: row ? String(row.source_version_id) : null,
    passageId: row ? String(row.source_passage_id) : null,
    locator: row ? String(row.legal_locator) : null,
    packRequiredContext: unit?.requiredContext ?? [],
    rpcRequiredContext: row?.required_context_keys ?? null,
  });
}

async function main(): Promise<void> {
  const identity = identityProof();
  const evidence = officialEvidence();
  const cases: Record<string, boolean> = {
    staticContract: staticContract(),
    identity: identity.original28Unchanged
      && identity.collisionCount === 0
      && identity.duplicateCanonicalIds === 0
      && identity.semanticDuplicateCount === 0
      && identity.deterministicRerun
      && identity.totalClaims === 41
      && identity.firstPackClaims === 28
      && identity.versionId
      && identity.versionHashShared
      && identity.factoryIdAbsent
      && identity.originalProcessFirstSteps,
    evidence: evidence.allOfficial && evidence.unsupported.length === 0,
  };
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      identity,
      evidence,
      cases,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=anmeldung-v2-content-01b",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  let reader: Client | undefined;
  try {
    if (created.code !== 0) throw new Error(`container start failed: ${created.stderr}`);
    let ready = false;
    let consecutive = 0;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const probe = sql("select current_database();", 5_000);
      if (probe.code === 0 && probe.stdout.trim() === DB) {
        consecutive += 1;
        if (consecutive >= 2) {
          ready = true;
          break;
        }
      } else consecutive = 0;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (!ready) throw new Error("postgres not ready");
    if (sql(`
      create role anon nologin nosuperuser nobypassrls;
      create role authenticated nologin nosuperuser nobypassrls;
      create role service_role nologin nosuperuser nobypassrls;
    `).code !== 0) throw new Error("role bootstrap failed");
    for (const [index, file] of MIGRATIONS.entries()) {
      const target = `/tmp/m${index}.sql`;
      const copied = run("docker", ["cp", path.join(process.cwd(), file), `${CONTAINER}:${target}`]);
      if (copied.code !== 0) throw new Error(`copy ${file} failed`);
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.code !== 0) throw new Error(`apply ${file} failed: ${applied.stderr.slice(-2000)}`);
    }
    const ingestorEscaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    const readerEscaped = READER_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${ingestorEscaped}';
      grant connect on database ${DB} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb) to birello_knowledge_ingestor;
      create role birello_knowledge_reader login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${readerEscaped}';
      grant connect on database ${DB} to birello_knowledge_reader;
      grant usage on schema public to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[], text[]) to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[], text) to birello_knowledge_reader;
    `).code !== 0) throw new Error("role grants failed");
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("missing published port");
    admin = new Client({ connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DB}` });
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`,
    });
    reader = new Client({
      connectionString: `postgres://birello_knowledge_reader:${encodeURIComponent(READER_PASSWORD)}@127.0.0.1:${port}/${DB}`,
    });
    await admin.connect();
    await ingestor.connect();
    await reader.connect();

    const firstPack = buildFirstPackIngestionPayload();
    const fullPack = buildCuratedIngestionPayload();
    const baselineIngest = ingestResult((await ingestor.query(FEDERAL_INGEST, [firstPack])).rows[0]?.result);
    await ingestor.query(LOCAL_INGEST, [buildWeiltingenLocalityPilotPayload()]);
    const baselineClaims = await admin.query(
      `select id::text as id, claim_text_canonical as text from public.knowledge_claims order by id`,
    );
    const baselineWeiltingen = await weiltingenCounts(admin);
    const baselineIds = new Set(baselineClaims.rows.map((row) => String(row.id)));
    const expectedFirstIds = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) => claimId(id));
    cases.baseline28 = baselineClaims.rowCount === 28
      && expectedFirstIds.every((id) => baselineIds.has(id))
      && V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => !baselineIds.has(claimId(id)))
      && baselineWeiltingen.municipality === 1
      && baselineWeiltingen.scope === 1
      && baselineWeiltingen.authority === 1
      && baselineWeiltingen.competence === 1
      && baselineWeiltingen.sources === 3;

    const firstApply = ingestResult((await ingestor.query(FEDERAL_INGEST, [fullPack])).rows[0]?.result);
    const afterClaims = await admin.query(
      `select id::text as id from public.knowledge_claims order by id`,
    );
    const afterIds = afterClaims.rows.map((row) => String(row.id));
    const duplicateSemantic = await admin.query(
      `select count(*)::int as count from (
         select claim_text_canonical from public.knowledge_claims
         group by claim_text_canonical having count(*) > 1
       ) duplicate_claims`,
    );
    const graph = await admin.query(
      `select
         (select count(*)::int from public.knowledge_jurisdictions where jurisdiction_code='DE') as de_jurisdictions,
         (select count(*)::int from public.knowledge_territorial_scopes where scope_type='national') as national_scopes,
         (select count(*)::int from public.knowledge_publishers where id=$1::uuid) as publishers,
         (select count(*)::int from public.knowledge_sources where id=$2::uuid) as bmg_sources,
         (select count(*)::int from public.knowledge_source_versions where id=$3::uuid) as bmg_versions`,
      [PACK_ENTITY_IDS.publisher, PACK_ENTITY_IDS.source, PACK_ENTITY_IDS.version],
    );
    const afterWeiltingen = await weiltingenCounts(admin);
    const v2aPresent = V2A_ADDED_CANONICAL_UNIT_IDS.every((id) => afterIds.includes(claimId(id)));
    const originalPreserved = expectedFirstIds.every((id) => afterIds.includes(id));
    cases.expansion = afterIds.length === 41
      && originalPreserved
      && v2aPresent
      && Number(duplicateSemantic.rows[0]?.count) === 0
      && graph.rows[0]?.de_jurisdictions === 1
      && graph.rows[0]?.national_scopes === 1
      && graph.rows[0]?.publishers === 1
      && graph.rows[0]?.bmg_sources === 1
      && graph.rows[0]?.bmg_versions === 1
      && firstApply.created.claims === 13
      && firstApply.created.retrievalMetadata === 13
      && firstApply.created.jurisdictions === 0
      && firstApply.created.territorialScopes === 0
      && firstApply.created.publishers === 0
      && firstApply.created.sources === 0
      && firstApply.created.sourceVersions === 0;
    cases.weiltingenUnchanged = afterWeiltingen.municipality === baselineWeiltingen.municipality
      && afterWeiltingen.scope === baselineWeiltingen.scope
      && afterWeiltingen.authority === baselineWeiltingen.authority
      && afterWeiltingen.competence === baselineWeiltingen.competence
      && afterWeiltingen.sources === baselineWeiltingen.sources
      && afterWeiltingen.municipality === 1
      && afterWeiltingen.sources === 3;

    const secondApply = ingestResult((await ingestor.query(FEDERAL_INGEST, [fullPack])).rows[0]?.result);
    const afterSecond = Number((await admin.query("select count(*)::int as n from public.knowledge_claims")).rows[0]?.n);
    const createdValues = Object.values(secondApply.created);
    cases.idempotent = secondApply.semanticCreated === 0
      && createdValues.every((count) => count === 0)
      && afterSecond === 41
      && curatedPackFingerprint(fullPack) === curatedPackFingerprint(buildCuratedIngestionPayload());

    const v2aClaimIds = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) => claimId(id));
    const metadata = await admin.query(
      `select r.entity_id::text as claim_id, r.full_text_indexed, r.vector_indexed,
              r.jurisdiction_filter_required, r.effective_date_filter_required,
              r.review_status_filter_required, r.trust_domain_filter_required,
              r.authoritative_by_vector_similarity, r.source_authorization_filter_required,
              r.handling_policy_filter_required, r.stale_policy_filter_required
         from public.knowledge_retrieval_metadata r
        where r.entity_type='claim' and r.entity_id = any($1::uuid[])`,
      [v2aClaimIds],
    );
    cases.retrievalMetadata = metadata.rowCount === 13
      && metadata.rows.every((row) =>
        row.full_text_indexed === true
        && row.vector_indexed === false
        && row.jurisdiction_filter_required === true
        && row.effective_date_filter_required === true
        && row.review_status_filter_required === true
        && row.trust_domain_filter_required === true
        && row.authoritative_by_vector_similarity === false
        && row.source_authorization_filter_required === true
        && row.handling_policy_filter_required === true
        && row.stale_policy_filter_required === true);

    const retrieval = Object.freeze({
      original: await retrieveUnit(reader, RETRIEVAL_UNITS.original),
      procedure: await retrieveUnit(reader, RETRIEVAL_UNITS.procedure),
      certificate: await retrieveUnit(reader, RETRIEVAL_UNITS.certificate),
      exception: await retrieveUnit(reader, RETRIEVAL_UNITS.exception),
      sanction: await retrieveUnit(reader, RETRIEVAL_UNITS.sanction),
    });
    const retrievalOk = Object.values(retrieval).every((item) =>
      item.retrieved
      && item.matchesDeterministicId
      && item.jurisdiction === "DE"
      && item.canonicalLanguage === "de"
      && item.fullTextIndexed
      && item.sourceVersionId === PACK_ENTITY_IDS.version);
    cases.retrieval = retrievalOk
      && retrieval.exception.packRequiredContext.includes("COUNTRY");
    const runtimeAllowlistGap = "controlled-runtime-retrieval.ts PRODUCTION_DEPLOYED_UNIT_IDS = FIRST_PACK_CANONICAL_UNIT_IDS; 038/040 SQL have no unit allowlist";

    const allPassed = Object.values(cases).every(Boolean);
    process.stdout.write(`${JSON.stringify({
      phaseResult: allPassed ? "PASS" : "FAILED",
      identity,
      evidence,
      baseline: {
        claims: baselineClaims.rowCount,
        ingest: baselineIngest,
        weiltingen: baselineWeiltingen,
      },
      firstApply,
      resultingCanonicalCount: afterIds.length,
      existing28Preserved: originalPreserved,
      new13Present: v2aPresent,
      duplicateSemanticCount: Number(duplicateSemantic.rows[0]?.count),
      sharedGraph: graph.rows[0],
      secondApply,
      fingerprint: curatedPackFingerprint(fullPack),
      retrievalMetadataRows: metadata.rowCount,
      retrieval,
      runtimeAllowlistGap,
      weiltingenAfter: afterWeiltingen,
      cases,
      productionConnectionUsed: false,
    }, null, 2)}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    await reader?.end().catch(() => undefined);
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }
}

void main().catch((error: unknown) => {
  run("docker", ["rm", "-f", CONTAINER], 30_000);
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    message: error instanceof Error ? error.message : "UNKNOWN",
  }, null, 2)}\n`);
  process.exitCode = 1;
});
