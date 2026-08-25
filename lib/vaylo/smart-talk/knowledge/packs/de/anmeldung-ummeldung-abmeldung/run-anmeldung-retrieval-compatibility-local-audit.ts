/**
 * ANMELDUNG-RETRIEVAL-COMPATIBILITY-01 / Package 2.
 * Disposable PostgreSQL 17 proof only; never connects to production.
 */
import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildSyntheticFederalKindergeldPack } from "../../../source-registry/knowledge-factory-synthetic-fixtures";
import { buildCityStateServiceAreaPacks, CITY_STATE_AGS } from "./anmeldung-city-state-service-area-packs";
import { buildWeiltingenLocalityPilotPayload, WEILTINGEN_PILOT } from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "retrieval_compatibility";
const PASSWORD = `postgres-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-retrieval-${process.pid}-${randomUUID().slice(0, 8)}`;
const BASE_MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
  "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
  "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql",
] as const;
const MIGRATION_043 =
  "supabase/migrations/043_add_anmeldung_retrieval_compatibility.sql";
const HISTORICAL_MIGRATIONS = [
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
  "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
  "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql",
] as const;
const RUNTIME_FILES = [
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/anmeldung-context-retrieval.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/anmeldung-locality-selector.ts",
] as const;
const PUBLIC_FUNCTIONS = [
  "knowledge_ingest_curated_domain_pack",
  "knowledge_ingest_curated_service_area_pack",
  "knowledge_retrieve_evidence_packets",
  "knowledge_retrieve_anmeldung_context",
] as const;

function run(file: string, args: string[], timeout = 120_000) {
  const result = spawnSync(file, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 32 * 1024 * 1024,
  });
  return {
    code: result.status ?? (result.error ? 1 : 0),
    stdout: result.stdout ?? "",
    stderr: `${result.stderr ?? ""}${result.error ? `\n${result.error.message}` : ""}`,
  };
}

function psql(text: string, timeout = 120_000) {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-A", "-t", "-c", text,
  ], timeout);
}

function applyMigration(file: string) {
  const target = `/tmp/${path.basename(file)}`;
  const copied = run("docker", ["cp", path.join(ROOT, file), `${CONTAINER}:${target}`]);
  if (copied.code !== 0) throw new Error(`copy ${file}: ${copied.stderr}`);
  const applied = run("docker", [
    "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-f", target,
  ], 240_000);
  if (applied.code !== 0) {
    throw new Error(`apply ${file}: ${applied.stderr.slice(-5000)}`);
  }
}

const hashFiles = (files: readonly string[]) =>
  Object.fromEntries(files.map((file) => [
    file,
    createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex"),
  ]));

async function functionState(client: Client) {
  const result = await client.query(`
    select p.proname,p.oid::text oid,p.proacl::text acl,p.prosecdef,p.proconfig,
           pg_get_function_identity_arguments(p.oid) identity_arguments
      from pg_proc p
      join pg_namespace n on n.oid=p.pronamespace
     where n.nspname='public' and p.proname=any($1::text[])
     order by p.proname
  `, [PUBLIC_FUNCTIONS]);
  return result.rows;
}

async function main() {
  const checks: Record<string, boolean> = {};
  const details: Record<string, unknown> = {};
  const sourceHashesBefore = hashFiles([...HISTORICAL_MIGRATIONS, ...RUNTIME_FILES]);
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) throw new Error("Docker with PostgreSQL 17 is required");
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "audit=anmeldung-retrieval-compatibility-01",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  try {
    if (created.code !== 0) throw new Error(created.stderr);
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (psql("select 1;", 5_000).code === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!ready) throw new Error("PostgreSQL 17 did not become ready");
    const roles = psql(`
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create role birello_knowledge_ingestor login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls password '${INGESTOR_PASSWORD.replaceAll("'", "''")}';
      create role birello_knowledge_reader login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls password '${INGESTOR_PASSWORD.replaceAll("'", "''")}';
    `);
    if (roles.code !== 0) throw new Error(roles.stderr);
    for (const migration of BASE_MIGRATIONS) applyMigration(migration);
    const grants = psql(`
      grant connect on database ${DATABASE}
        to birello_knowledge_ingestor,birello_knowledge_reader;
      grant usage on schema public
        to birello_knowledge_ingestor,birello_knowledge_reader;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_service_area_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[],text[])
        to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[],text)
        to birello_knowledge_reader;
    `);
    if (grants.code !== 0) throw new Error(grants.stderr);
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("missing PostgreSQL port");
    const connection = (user: string, password: string) => new Client({
      connectionString:
        `postgres://${user}:${encodeURIComponent(password)}@127.0.0.1:${port}/${DATABASE}`,
    });
    admin = connection("postgres", PASSWORD);
    ingestor = connection("birello_knowledge_ingestor", INGESTOR_PASSWORD);
    await admin.connect();
    await ingestor.connect();

    const federal = buildCuratedIngestionPayload() as {
      claims: readonly Readonly<{ id: string }>[];
    };
    const federalClaimIds = federal.claims.map(({ id }) => id);
    await ingestor.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [federal]);
    await ingestor.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb)", [
      buildWeiltingenLocalityPilotPayload(),
    ]);
    const metadataBefore = await admin.query(`
      select * from public.knowledge_retrieval_metadata
       where entity_type='claim' and entity_id=any($1::uuid[])
       order by entity_id
    `, [federalClaimIds]);
    const weiltingenBefore = await admin.query(
      "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text) result",
      [[federalClaimIds[0]], WEILTINGEN_PILOT.municipalityCode],
    );
    const publicBefore = await functionState(admin);

    applyMigration(MIGRATION_043);
    const publicAfter = await functionState(admin);
    checks.publicIdentityAclAndSecurityPreserved =
      JSON.stringify(publicBefore) === JSON.stringify(publicAfter)
      && publicAfter.length === 4
      && publicAfter.every((row) => row.prosecdef === true
        && (row.proconfig as string[]).includes("search_path=pg_catalog, public"));

    const metadataAfterMigration = await admin.query(`
      select * from public.knowledge_retrieval_metadata
       where entity_type='claim' and entity_id=any($1::uuid[])
       order by entity_id
    `, [federalClaimIds]);
    checks.legacy037MetadataUnchanged = metadataBefore.rowCount === 41
      && JSON.stringify(metadataBefore.rows) === JSON.stringify(metadataAfterMigration.rows);

    const g3 = buildSyntheticFederalKindergeldPack();
    const firstG3 = await ingestor.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result", [g3],
    );
    const secondG3 = await ingestor.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result", [g3],
    );
    const g3ClaimId = g3.claims[0]!.id;
    const g3Metadata = await admin.query(`
      select id,entity_id,full_text_indexed,vector_indexed,
             jurisdiction_filter_required,effective_date_filter_required,
             review_status_filter_required,trust_domain_filter_required,
             authoritative_by_vector_similarity,
             source_authorization_filter_required,
             handling_policy_filter_required,stale_policy_filter_required
        from public.knowledge_retrieval_metadata
       where entity_type='claim' and entity_id=$1
    `, [g3ClaimId]);
    const metadata = g3Metadata.rows[0];
    checks.g3MetadataDeterministicAndSafe =
      Number(firstG3.rows[0]?.result?.semanticCreated) > 0
      && Number(secondG3.rows[0]?.result?.semanticCreated) === 0
      && g3Metadata.rowCount === 1
      && metadata?.entity_id === g3ClaimId
      && metadata?.full_text_indexed === true
      && metadata?.vector_indexed === false
      && metadata?.jurisdiction_filter_required === true
      && metadata?.effective_date_filter_required === true
      && metadata?.review_status_filter_required === true
      && metadata?.trust_domain_filter_required === true
      && metadata?.authoritative_by_vector_similarity === false
      && metadata?.source_authorization_filter_required === true
      && metadata?.handling_policy_filter_required === true
      && metadata?.stale_policy_filter_required === true;

    const g3Retrieved = await admin.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [[g3ClaimId], ["DE"]],
    );
    const g3WrongJurisdiction = await admin.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [[g3ClaimId], ["DE-BE"]],
    );
    const randomClaim = await admin.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [[randomUUID()], ["DE"]],
    );
    checks.g3PublicRetrievalBounded = g3Retrieved.rowCount === 1
      && g3Retrieved.rows[0]?.claim_id === g3ClaimId
      && g3Retrieved.rows[0]?.handling_mode === "STORE_CANONICALLY"
      && g3WrongJurisdiction.rowCount === 0
      && randomClaim.rowCount === 0;

    const packs = buildCityStateServiceAreaPacks();
    const firstG4: number[] = [];
    const secondG4: number[] = [];
    for (const pack of packs) {
      const result = await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
        [pack],
      );
      firstG4.push(Number(result.rows[0]?.result?.semanticCreated));
    }
    for (const pack of packs) {
      const result = await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
        [pack],
      );
      secondG4.push(Number(result.rows[0]?.result?.semanticCreated));
    }
    checks.g4IdempotentAndFamilyMapped = firstG4.every((count) => count > 0)
      && secondG4.every((count) => count === 0)
      && Number((await admin.query(`
        select count(*)::int n
          from public.knowledge_claims
         where territorial_scope_id=any($1::uuid[])
      `, [packs.map((pack) => pack.territorialScopes[0]!.id)])).rows[0]?.n) === 0
      && Number((await admin.query(`
        select count(*)::int n
          from public.knowledge_authority_competences c
          join public.knowledge_processes p
            on p.territorial_scope_id=c.territorial_scope_id
         where c.id=any($1::uuid[])
           and c.personal_scope='residence_registration_lifecycle'
           and c.subject_matter='residence_registration_lifecycle'
           and p.process_group_id='anmeldung_ummeldung_abmeldung'
      `, [packs.map((pack) => pack.competences[0]!.id)])).rows[0]?.n) === 3;

    const cityCases = [
      [CITY_STATE_AGS.berlin, packs[0]],
      [CITY_STATE_AGS.bremenCity, packs[1]],
      [CITY_STATE_AGS.hamburg, packs[2]],
    ] as const;
    let cityIsolation = true;
    const cityResults: Record<string, unknown> = {};
    for (const [code, pack] of cityCases) {
      const retrieved = await admin.query(
        "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text) result",
        [[federalClaimIds[0]], code],
      );
      const context = retrieved.rows[0]?.result?.localContext;
      const evidence = context?.evidence as Array<Record<string, unknown>> | undefined;
      cityResults[code] = context;
      cityIsolation = cityIsolation
        && context?.authority?.name === pack.authorities[0]!.name
        && context?.competence?.subjectMatter === "residence_registration_lifecycle"
        && context?.competence?.family === "residence_registration_lifecycle"
        && context?.process?.id === pack.processBindings[0]!.id
        && evidence?.length === 2
        && evidence.every((item) =>
          pack.sources.some((source) => source.canonicalUrl === item.canonicalUrl))
        && evidence.every((item) =>
          item.territorialScopeId === pack.territorialScopes[0]!.id);
    }
    checks.cityStateContextIsolated = cityIsolation;

    let bremerhavenUnknown = false;
    try {
      await admin.query(
        "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text)",
        [[federalClaimIds[0]], CITY_STATE_AGS.bremerhaven],
      );
    } catch (error) {
      bremerhavenUnknown = String(error).includes("CURATED_RETRIEVAL_UNKNOWN_LOCALITY");
    }
    checks.bremerhavenFailsClosed = bremerhavenUnknown;

    const weiltingenAfter = await admin.query(
      "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text) result",
      [[federalClaimIds[0]], WEILTINGEN_PILOT.municipalityCode],
    );
    checks.weiltingenContextUnchanged =
      JSON.stringify(weiltingenBefore.rows) === JSON.stringify(weiltingenAfter.rows);

    const originalFederal = await admin.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [[federalClaimIds[0]], ["DE"]],
    );
    const v2aFederal = await admin.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [[federalClaimIds.at(-1)], ["DE"]],
    );
    checks.originalAndV2AFederalRetrieval =
      originalFederal.rowCount === 1 && v2aFederal.rowCount === 1;

    const duplicateProof = await admin.query(`
      select
        (select count(*) from (
          select code from public.knowledge_trust_domains group by code having count(*)>1
        ) x) trust_dupes,
        (select count(*) from (
          select normalized_canonical_url from public.knowledge_sources
           where normalized_canonical_url is not null group by 1 having count(*)>1
        ) x) source_dupes,
        (select count(*) from (
          select source_id,information_class,process_scope
            from public.knowledge_source_handling_policies
           group by 1,2,3 having count(*)>1
        ) x) policy_dupes
    `);
    checks.package1CoexistenceProperties =
      Object.values(duplicateProof.rows[0] ?? {}).every((value) => Number(value) === 0)
      && Number((await admin.query(
        "select count(*)::int n from public.knowledge_trust_domains where code='de'",
      )).rows[0]?.n) === 1
      && (await admin.query(`
        select has_schema_privilege(
          'birello_knowledge_ingestor','knowledge_factory_internal','USAGE'
        ) allowed
      `)).rows[0]?.allowed === false;

    checks.noVolatileCityStateFacts = packs.every((pack) =>
      pack.handlingPolicies.every((policy) =>
        !["OPENING_HOURS", "APPOINTMENT_AVAILABILITY"].includes(
          String(policy.informationClass),
        ))
      && pack.sources.every((source) => source.handlingMode !== "FETCH_LIVE"));
    checks.historicalAndRuntimeFilesUnchanged =
      JSON.stringify(sourceHashesBefore)
      === JSON.stringify(hashFiles([...HISTORICAL_MIGRATIONS, ...RUNTIME_FILES]));

    details.firstG3 = Number(firstG3.rows[0]?.result?.semanticCreated);
    details.secondG3 = Number(secondG3.rows[0]?.result?.semanticCreated);
    details.g3MetadataId = metadata?.id;
    details.firstG4 = firstG4;
    details.secondG4 = secondG4;
    details.cityResults = cityResults;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }
  const passed = Object.values(checks).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: passed ? "PASS" : "FAILED",
    postgres: 17,
    checks,
    details,
    productionConnectionUsed: false,
    productionMutation: false,
    historicalMigrationsModified: false,
    runtimeFilesModified: false,
    commitCreated: false,
    pushPerformed: false,
  }, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  run("docker", ["rm", "-f", CONTAINER], 30_000);
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    message: error instanceof Error ? error.message : String(error),
  }, null, 2)}\n`);
  process.exitCode = 1;
});
