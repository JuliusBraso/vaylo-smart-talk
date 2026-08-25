/**
 * KNOWLEDGE-FACTORY-COEXISTENCE-01 / Package 1.
 * Disposable PostgreSQL 17 proof only; never connects to production.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildSyntheticFederalKindergeldPack } from "../source-registry/knowledge-factory-synthetic-fixtures";
import type { CuratedServiceAreaPack } from "../source-registry/knowledge-factory-contracts";
import { buildCityStateServiceAreaPacks } from "../packs/de/anmeldung-ummeldung-abmeldung/anmeldung-city-state-service-area-packs";
import { buildWeiltingenLocalityPilotPayload, WEILTINGEN_PILOT } from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "../packs/de/anmeldung-ummeldung-abmeldung/curated-ingestion-payload";
import { PACK_ENTITY_IDS } from "../packs/de/anmeldung-ummeldung-abmeldung/identity";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "coexistence";
const PASSWORD = `postgres-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-coexist-${process.pid}-${randomUUID().slice(0, 8)}`;
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
] as const;
const MIGRATION_042 = "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql";

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
  if (applied.code !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-4000)}`);
}

async function scalar(client: Client, text: string, values: unknown[] = []): Promise<number> {
  const result = await client.query(text, values);
  return Number(result.rows[0]?.n);
}

function remapServicePack(pack: CuratedServiceAreaPack): CuratedServiceAreaPack {
  const clone = structuredClone(pack) as unknown as Record<string, unknown>;
  const ids = [
    (clone.trustDomain as Record<string, unknown>).id,
    ..."jurisdictions territorialScopes publishers authorities sources sourceVersions passages competences processBindings handlingPolicies"
      .split(" ")
      .flatMap((key) => (clone[key] as Record<string, unknown>[]).map((row) => row.id)),
  ].map(String);
  const replacements = new Map(ids.map((id) => [id, randomUUID()]));
  const rewrite = (value: unknown): unknown => {
    if (typeof value === "string") return replacements.get(value) ?? value;
    if (Array.isArray(value)) return value.map(rewrite);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, rewrite(item)]));
    }
    return value;
  };
  return rewrite(clone) as CuratedServiceAreaPack;
}

async function main() {
  const checks: Record<string, boolean> = {};
  const details: Record<string, unknown> = {};
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) throw new Error("Docker with PostgreSQL 17 is required");
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "audit=knowledge-factory-coexistence-01",
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
    `);
    if (roles.code !== 0) throw new Error(roles.stderr);
    for (const file of BASE_MIGRATIONS) applyMigration(file);
    const grants = psql(`
      grant connect on database ${DATABASE} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_service_area_pack(jsonb)
        to birello_knowledge_ingestor;
    `);
    if (grants.code !== 0) throw new Error(grants.stderr);
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("missing PostgreSQL port");
    const connection = (user: string, password: string) => new Client({
      connectionString: `postgres://${user}:${encodeURIComponent(password)}@127.0.0.1:${port}/${DATABASE}`,
    });
    admin = connection("postgres", PASSWORD);
    ingestor = connection("birello_knowledge_ingestor", INGESTOR_PASSWORD);
    await admin.connect();
    await ingestor.connect();

    const federalPayload = buildCuratedIngestionPayload() as {
      claims: readonly Readonly<{ id: string }>[];
    };
    const federalClaimIds = federalPayload.claims.map(({ id }) => id);
    await ingestor.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [federalPayload]);
    await ingestor.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb)", [
      buildWeiltingenLocalityPilotPayload(),
    ]);
    checks.baseline037Has41Claims =
      await scalar(admin, "select count(*)::int n from public.knowledge_claims") === 41;
    const federalClaimsBefore = await admin.query(
      "select id from public.knowledge_claims where id=any($1::uuid[]) order by id",
      [federalClaimIds],
    );
    const federalMetadataBefore = await admin.query(
      `select entity_type,entity_id,full_text_indexed,vector_indexed,
              effective_date_filter_required,stale_policy_filter_required
         from public.knowledge_retrieval_metadata
        where entity_type='claim' and entity_id=any($1::uuid[])
        order by entity_id`,
      [federalClaimIds],
    );
    checks.baselineSharedRoots = await scalar(
      admin,
      "select count(*)::int n from public.knowledge_trust_domains where code='de' and id=$1",
      [PACK_ENTITY_IDS.trustDomain],
    ) === 1 && await scalar(
      admin,
      `select count(*)::int n from public.knowledge_jurisdictions
        where country_code='DE' and jurisdiction_level='de_federal'
          and jurisdiction_code='DE' and parent_jurisdiction_id is null and id=$1`,
      [PACK_ENTITY_IDS.jurisdiction],
    ) === 1;
    const weiltingenBefore = await admin.query(
      `select j.id,j.name,a.id authority_id,a.authority_name,c.id competence_id,s.canonical_url
       from public.knowledge_jurisdictions j
       join public.knowledge_authorities a on a.jurisdiction_id=j.id
       join public.knowledge_authority_competences c on c.authority_id=a.id
       join public.knowledge_source_versions v on v.id=c.competence_source_version_id
       join public.knowledge_sources s on s.id=v.source_id
       where j.jurisdiction_code=$1`,
      [WEILTINGEN_PILOT.municipalityCode],
    );
    checks.baseline039Weiltingen = weiltingenBefore.rowCount === 1;

    const publicBefore = await admin.query(`
      select p.proname,p.oid::text oid,p.proacl::text acl,p.prosecdef,p.proconfig
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public'
        and p.proname in (
          'knowledge_ingest_curated_domain_pack',
          'knowledge_ingest_curated_service_area_pack'
        )
      order by p.proname
    `);
    applyMigration(MIGRATION_042);
    const publicAfter = await admin.query(`
      select p.proname,p.oid::text oid,p.proacl::text acl,p.prosecdef,p.proconfig
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public'
        and p.proname in (
          'knowledge_ingest_curated_domain_pack',
          'knowledge_ingest_curated_service_area_pack'
        )
      order by p.proname
    `);
    const acl = await admin.query(`
      select
        has_function_privilege('birello_knowledge_ingestor',
          'public.knowledge_ingest_curated_domain_pack(jsonb)','EXECUTE') domain_ok,
        has_function_privilege('birello_knowledge_ingestor',
          'public.knowledge_ingest_curated_service_area_pack(jsonb)','EXECUTE') service_ok,
        has_schema_privilege('birello_knowledge_ingestor',
          'knowledge_factory_internal','USAGE') internal_usage
    `);
    checks.signatureSecurityAndAcl = acl.rows[0]?.domain_ok === true
      && acl.rows[0]?.service_ok === true
      && acl.rows[0]?.internal_usage === false
      && JSON.stringify(publicBefore.rows) === JSON.stringify(publicAfter.rows)
      && publicAfter.rows.every((row) =>
        row.prosecdef === true
        && (row.proconfig as string[]).includes("search_path=pg_catalog, public"));

    const packs = buildCityStateServiceAreaPacks();
    const seeded = remapServicePack(packs[0]!);
    const seededResult = await ingestor.query(
      "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
      [seeded],
    );
    const fuzzy = structuredClone(packs[0]!) as unknown as {
      sources: Array<Record<string, unknown>>;
    };
    fuzzy.sources[0]!.purpose = "fuzzy metadata must not merge";
    let fuzzyRejected = false;
    try {
      await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb)",
        [fuzzy],
      );
    } catch (error) {
      fuzzyRejected = String(error).includes("KNOWLEDGE_FACTORY_042_SOURCE_METADATA_CONFLICT");
    }
    const firstG4: number[] = [];
    const secondG4: number[] = [];
    for (const pack of packs) {
      const first = await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
        [pack],
      );
      firstG4.push(Number(first.rows[0]?.result?.semanticCreated));
    }
    for (const pack of packs) {
      const second = await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result",
        [pack],
      );
      secondG4.push(Number(second.rows[0]?.result?.semanticCreated));
    }
    checks.realG4Twice = Number(seededResult.rows[0]?.result?.semanticCreated) > 0
      && firstG4[0] === 0
      && firstG4.slice(1).every((n) => n > 0)
      && secondG4.every((n) => n === 0);

    const seededSource = seeded.sources[0]!;
    const seededVersion = seeded.sourceVersions.find((row) => row.sourceId === seededSource.id)!;
    const seededPassage = seeded.passages.find((row) => row.sourceVersionId === seededVersion.id)!;
    const seededAuthority = seeded.authorities.find((row) => row.id === seededSource.authorityId)!;
    const seededScope = seeded.territorialScopes.find((row) => row.id === seededAuthority.territorialScopeId)!;
    const seededCompetence = seeded.competences.find((row) => row.authorityId === seededAuthority.id)!;
    const propagated = await admin.query(`
      select s.id source_id,v.id version_id,p.id passage_id,
             a.id authority_id,ts.id scope_id,c.id competence_id
      from public.knowledge_sources s
      join public.knowledge_source_versions v on v.source_id=s.id
      join public.knowledge_source_passages p on p.source_version_id=v.id
      join public.knowledge_authorities a on a.id=s.issuing_authority_id
      join public.knowledge_territorial_scopes ts on ts.id=a.territorial_scope_id
      join public.knowledge_authority_competences c
        on c.authority_id=a.id and c.territorial_scope_id=ts.id
       and c.competence_source_version_id=v.id and c.competence_passage_id=p.id
      where s.id=$1
    `, [seededSource.id]);
    checks.normalizedUrlAndActualIdPropagation = propagated.rowCount === 1
      && propagated.rows[0]?.source_id === seededSource.id
      && propagated.rows[0]?.version_id === seededVersion.id
      && propagated.rows[0]?.passage_id === seededPassage.id
      && propagated.rows[0]?.authority_id === seededAuthority.id
      && propagated.rows[0]?.scope_id === seededScope.id
      && propagated.rows[0]?.competence_id === seededCompetence.id
      && seededSource.id !== packs[0]!.sources[0]!.id
      && seededSource.canonicalUrl === packs[0]!.sources[0]!.canonicalUrl
      && await scalar(admin, `
        select count(*)::int n from public.knowledge_sources
        where normalized_canonical_url=$1
      `, [seededSource.canonicalUrl]) === 1;
    checks.fuzzyMetadataRejected = fuzzyRejected;

    const duplicatePublisherId = randomUUID();
    await admin.query(`
      insert into public.knowledge_publishers(
        id,publisher_name,publisher_type,official_status,subject_matter_competence,
        territorial_competence_id,trust_domain_id,review_status
      )
      select $1,publisher_name,publisher_type,official_status,subject_matter_competence,
             territorial_competence_id,trust_domain_id,review_status
      from public.knowledge_publishers where id=$2
    `, [duplicatePublisherId, seeded.publishers[0]!.id]);
    let ambiguousRejected = false;
    try {
      await ingestor.query(
        "select public.knowledge_ingest_curated_service_area_pack($1::jsonb)",
        [packs[0]],
      );
    } catch (error) {
      ambiguousRejected = String(error).includes("KNOWLEDGE_FACTORY_042_AMBIGUOUS_SEMANTIC_IDENTITY");
    }
    await admin.query("delete from public.knowledge_publishers where id=$1", [duplicatePublisherId]);
    checks.ambiguousIdentityRejected = ambiguousRejected;

    const g3 = buildSyntheticFederalKindergeldPack();
    const firstG3 = await ingestor.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result",
      [g3],
    );
    const secondG3 = await ingestor.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result",
      [g3],
    );
    checks.representativeG3Twice = Number(firstG3.rows[0]?.result?.semanticCreated) > 0
      && Number(secondG3.rows[0]?.result?.semanticCreated) === 0;

    const weiltingenAfter = await admin.query(
      `select j.id,j.name,a.id authority_id,a.authority_name,c.id competence_id,s.canonical_url
       from public.knowledge_jurisdictions j
       join public.knowledge_authorities a on a.jurisdiction_id=j.id
       join public.knowledge_authority_competences c on c.authority_id=a.id
       join public.knowledge_source_versions v on v.id=c.competence_source_version_id
       join public.knowledge_sources s on s.id=v.source_id
       where j.jurisdiction_code=$1`,
      [WEILTINGEN_PILOT.municipalityCode],
    );
    checks.baselinesUnchanged = JSON.stringify(weiltingenBefore.rows) === JSON.stringify(weiltingenAfter.rows)
      && await scalar(admin, "select count(*)::int n from public.knowledge_claims") === 42;
    const federalClaimsAfter = await admin.query(
      "select id from public.knowledge_claims where id=any($1::uuid[]) order by id",
      [federalClaimIds],
    );
    const federalMetadataAfter = await admin.query(
      `select entity_type,entity_id,full_text_indexed,vector_indexed,
              effective_date_filter_required,stale_policy_filter_required
         from public.knowledge_retrieval_metadata
        where entity_type='claim' and entity_id=any($1::uuid[])
        order by entity_id`,
      [federalClaimIds],
    );
    checks.federal41IdentityAndMetadataUnchanged =
      federalClaimsBefore.rowCount === 41
      && JSON.stringify(federalClaimsBefore.rows) === JSON.stringify(federalClaimsAfter.rows)
      && federalMetadataBefore.rowCount === 41
      && JSON.stringify(federalMetadataBefore.rows) === JSON.stringify(federalMetadataAfter.rows);

    const duplicateProof = await admin.query(`
      select
        (select count(*) from (
          select code from public.knowledge_trust_domains group by code having count(*)>1
        ) x) trust_dupes,
        (select count(*) from (
          select country_code,jurisdiction_level,jurisdiction_code,parent_jurisdiction_id
          from public.knowledge_jurisdictions
          group by 1,2,3,4 having count(*)>1
        ) x) jurisdiction_dupes,
        (select count(*) from (
          select normalized_canonical_url from public.knowledge_sources
          where normalized_canonical_url is not null group by 1 having count(*)>1
        ) x) source_dupes,
        (select count(*) from (
          select source_id,version_sequence from public.knowledge_source_versions
          group by 1,2 having count(*)>1
        ) x) version_dupes,
        (select count(*) from (
          select source_version_id,passage_order from public.knowledge_source_passages
          group by 1,2 having count(*)>1
        ) x) passage_dupes,
        (select count(*) from (
          select source_id,information_class,process_scope
          from public.knowledge_source_handling_policies group by 1,2,3 having count(*)>1
        ) x) policy_dupes
    `);
    checks.noSemanticDuplicates = Object.values(duplicateProof.rows[0] ?? {})
      .every((value) => Number(value) === 0);

    const brokenFks = await admin.query(`
      select
        (select count(*) from public.knowledge_sources s
          left join public.knowledge_publishers p on p.id=s.publisher_id
          left join public.knowledge_jurisdictions j on j.id=s.jurisdiction_id
          where p.id is null or j.id is null) sources,
        (select count(*) from public.knowledge_source_versions v
          left join public.knowledge_sources s on s.id=v.source_id where s.id is null) versions,
        (select count(*) from public.knowledge_source_passages p
          left join public.knowledge_source_versions v on v.id=p.source_version_id where v.id is null) passages,
        (select count(*) from public.knowledge_authority_competences c
          left join public.knowledge_authorities a on a.id=c.authority_id
          left join public.knowledge_source_versions v on v.id=c.competence_source_version_id
          where a.id is null or v.id is null) competences,
        (select count(*) from public.knowledge_claim_evidence_links e
          left join public.knowledge_claims c on c.id=e.claim_id
          left join public.knowledge_source_passages p on p.id=e.passage_id
          where c.id is null or p.id is null) evidence
    `);
    checks.noBrokenForeignKeys = Object.values(brokenFks.rows[0] ?? {})
      .every((value) => Number(value) === 0);
    const migration042 = fs.readFileSync(path.join(ROOT, MIGRATION_042), "utf8");
    checks.migrationSafeguards = await scalar(admin, `
      select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='knowledge_retrieve_anmeldung_context'
    `) === 1 && await scalar(admin, `
      select count(*)::int n from information_schema.columns
      where table_schema='public' and table_name='knowledge_retrieval_metadata'
    `) > 0
      && !/\balter\s+function\b|\bdrop\s+function\b/iu.test(migration042)
      && migration042.includes("create or replace function public.knowledge_ingest_curated_domain_pack")
      && migration042.includes("create or replace function public.knowledge_ingest_curated_service_area_pack");
    const rerunBefore = await admin.query(`
      select
        pg_get_functiondef(
          'knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)'::regprocedure
        ) domain_body,
        pg_get_functiondef(
          'knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(jsonb)'::regprocedure
        ) service_body,
        (select jsonb_agg(jsonb_build_object('name',p.proname,'oid',p.oid,'acl',p.proacl)
          order by p.proname)
         from pg_proc p join pg_namespace n on n.oid=p.pronamespace
         where n.nspname='public' and p.proname in (
           'knowledge_ingest_curated_domain_pack',
           'knowledge_ingest_curated_service_area_pack'
         )) public_objects
    `);
    applyMigration(MIGRATION_042);
    const rerunAfter = await admin.query(`
      select
        pg_get_functiondef(
          'knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)'::regprocedure
        ) domain_body,
        pg_get_functiondef(
          'knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(jsonb)'::regprocedure
        ) service_body,
        (select jsonb_agg(jsonb_build_object('name',p.proname,'oid',p.oid,'acl',p.proacl)
          order by p.proname)
         from pg_proc p join pg_namespace n on n.oid=p.pronamespace
         where n.nspname='public' and p.proname in (
           'knowledge_ingest_curated_domain_pack',
           'knowledge_ingest_curated_service_area_pack'
         )) public_objects
    `);
    checks.migrationSafelyRerunnable =
      JSON.stringify(rerunBefore.rows[0]) === JSON.stringify(rerunAfter.rows[0]);
    details.seededNonFactorySourceId = seededSource.id;
    details.resolvedGraph = propagated.rows[0];
    details.firstG4 = firstG4;
    details.secondG4 = secondG4;
    details.firstG3 = Number(firstG3.rows[0]?.result?.semanticCreated);
    details.secondG3 = Number(secondG3.rows[0]?.result?.semanticCreated);
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
    migration040Modified: false,
    retrievalMetadataModified: false,
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
