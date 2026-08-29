/**
 * KNOWLEDGE-EXPANSION-01 — local Kindergeld federal core pack audit.
 * Disposable PostgreSQL 17 + G3 domain ingestion only.
 * No production connection, write, migration, or public runtime change.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { validateCuratedDomainPack } from "../../../source-registry/knowledge-factory-contracts";
import { buildSyntheticFederalKindergeldPack } from "../../../source-registry/knowledge-factory-synthetic-fixtures";
import { buildCityStateServiceAreaPacks } from "../anmeldung-ummeldung-abmeldung/anmeldung-city-state-service-area-packs";
import {
  KINDERGELD_DOMAIN,
  KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS,
  KINDERGELD_FUTURE_WATCH_SOURCE,
  KINDERGELD_OFFICIAL_SOURCES,
  KINDERGELD_UNITS,
  buildKindergeldFederalCorePack,
  kindergeldPackSummary,
} from "./kindergeld-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "kindergeld_core";
const PASSWORD = `kg-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-kindergeld-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql",
  "supabase/migrations/043_add_anmeldung_retrieval_compatibility.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.arbeitsagentur.de",
  "www.bundesfinanzministerium.de",
]);

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 32 * 1024 * 1024,
  });
}

function source(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

function sql(text: string, timeout = 120_000) {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-A", "-t", "-c", text,
  ], timeout);
}

function semanticCreated(row: unknown): number {
  const result = row as { result?: { semanticCreated?: number } };
  return Number(result.result?.semanticCreated ?? -1);
}

async function main(): Promise<void> {
  const pack = buildKindergeldFederalCorePack();
  const summary = kindergeldPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "familienkasse-kindergeld", "kindergeld-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const staticCases = {
    domainReused: pack.domain === KINDERGELD_DOMAIN && pack.packId === KINDERGELD_DOMAIN,
    structurallyValid: validation.valid,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Kindergeld|Familienkasse|Antrag/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && KINDERGELD_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|steuerklassen|smartsteuer|finanztip/i.test(packSource),
    ingestibleCurrentClaimCount: pack.claims.length === 40
      && KINDERGELD_UNITS.length === 40
      && KINDERGELD_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchCount: KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.length === 3,
    futureWatchOfficialProvenance: KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
      item.officialSourceUrl === KINDERGELD_FUTURE_WATCH_SOURCE.url
      && item.officialDomain === "www.bundesfinanzministerium.de"
      && item.status === "future_change_watch_not_ingestible"
      && item.currentGuidance === false
      && item.targetYear === 2027),
    futureWatchStructurallyExcluded:
      KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id)
        && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !pack.sources.some((item) => item.canonicalUrl === KINDERGELD_FUTURE_WATCH_SOURCE.url)
      && !pack.processes.some((item) => /2027|antragslos/i.test(String(item.title)))
      && !KINDERGELD_UNITS.some((unit) => watchKeys.has(unit.key)),
    noKinderzuschlagProduct: !/Kinderzuschlag/u.test(corpus),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && !/userLocale|user_locale/.test(packSource),
    noAustriaOrV4Jurisdiction: !pack.jurisdictions.some((item) =>
      ["AT", "SK", "CZ", "PL", "HU", "DE-AT"].includes(String(item.code))),
    current2026Complete: pack.claims.length === 40
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && claim.requiresEffectiveDate !== true
        && !watchKeys.has(String(claim.key)))
      && !pack.claims.some((claim) => /antragslos/i.test(String(claim.text))),
    currentProcessOnly2026: pack.processes.length === 1
      && String(pack.processes[0]?.title).includes("2026")
      && !/2027|antragslos/i.test(String(pack.processes[0]?.title)),
    crossBorderFailClosed: pack.claims.some((claim) =>
      claim.key === "paying-state-not-inferred"
      && claim.requiresAuthorityResolution === true
      && /nicht.*vorrangig leistende Stelle/u.test(String(claim.text)))
      && pack.actorRules.some((rule) => rule.actorState === "paying_state_undetermined_without_coordination")
      && !/arbeitet in Deutschland.*zahlt Deutschland immer/i.test(corpus)
      && !/lebt in der Slowakei.*entscheidet die Slowakei/i.test(corpus),
    amountAndRetroLimitPresent: pack.claims.some((claim) =>
      claim.key === "amount-259-from-2026" && String(claim.text).includes("259"))
      && pack.claims.some((claim) =>
        claim.key === "retroactive-six-months" && String(claim.text).includes("sechs Monate")),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildKindergeldFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildKindergeldFederalCorePack().jurisdictions[0]!.id,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      staticCases,
      summary,
      publicRuntimeAuthorized: false,
      productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-01-kindergeld",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let firstCreated = -1;
  let secondCreated = -1;
  try {
    if (created.status !== 0) throw new Error(created.stderr);
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (sql("select 1;").status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!ready) throw new Error("PostgreSQL 17 did not become ready");
    if (sql("create role anon nologin; create role authenticated nologin; create role service_role nologin;").status !== 0) {
      throw new Error("role bootstrap");
    }
    for (const file of MIGRATIONS) {
      const target = `/tmp/${path.basename(file)}`;
      if (run("docker", ["cp", path.join(ROOT, file), `${CONTAINER}:${target}`]).status !== 0) {
        throw new Error(`copy ${file}`);
      }
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.status !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-2000)}`);
    }
    const escaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login password '${escaped}';
      create role birello_knowledge_reader login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls password '${escaped}';
      grant connect on database ${DATABASE} to birello_knowledge_ingestor, birello_knowledge_reader;
      grant usage on schema public to birello_knowledge_ingestor, birello_knowledge_reader;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_service_area_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[], text[])
        to birello_knowledge_reader;
    `).status !== 0) throw new Error("grants");

    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("port");
    admin = new Client({
      connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await admin.connect();
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await ingestor.connect();

    const first = await ingestor.query(DOMAIN_RPC, [pack]);
    firstCreated = semanticCreated(first.rows[0]);
    const second = await ingestor.query(DOMAIN_RPC, [pack]);
    secondCreated = semanticCreated(second.rows[0]);
    const trust = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='de'");
    const federal = await admin.query(
      "select count(*)::int n from public.knowledge_jurisdictions where jurisdiction_code='DE' and jurisdiction_level='de_federal'",
    );
    const foreign = await admin.query(
      "select count(*)::int n from public.knowledge_jurisdictions where jurisdiction_code <> 'DE'",
    );
    const sources = await admin.query(
      "select count(*)::int n from public.knowledge_sources where canonical_url=any($1::text[])",
      [KINDERGELD_OFFICIAL_SOURCES.map((item) => item.url)],
    );
    const sourceDupes = await admin.query(
      `select canonical_url, count(*)::int n from public.knowledge_sources
        group by canonical_url having count(*)>1`,
    );
    const claimDupes = await admin.query(
      `select claim_text_canonical, count(*)::int n from public.knowledge_claims
        group by claim_text_canonical, jurisdiction_id having count(*)>1`,
    );
    const metadata = await admin.query(
      `select count(*)::int n from public.knowledge_retrieval_metadata r
        join public.knowledge_claims c on c.id=r.entity_id
       where r.entity_type='claim'
         and r.jurisdiction_filter_required
         and r.trust_domain_filter_required
         and r.effective_date_filter_required`,
    );
    const futureCreated = await admin.query(
      `select count(*)::int n from public.knowledge_claims
        where claim_text_canonical ilike '%antragslos%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const berlin = buildCityStateServiceAreaPacks()[0];
    await ingestor.query(SERVICE_RPC, [berlin]);
    const trustAfter = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='de'");
    const federalAfter = await admin.query(
      "select count(*)::int n from public.knowledge_jurisdictions where jurisdiction_code='DE' and jurisdiction_level='de_federal'",
    );
    const synthetic = buildSyntheticFederalKindergeldPack();
    await ingestor.query(DOMAIN_RPC, [synthetic]);
    const syntheticSources = await admin.query(
      "select count(*)::int n from public.knowledge_sources where official_domain='example.invalid'",
    );

    live.firstCreatedExpected = firstCreated === summary.expectedSemanticCreated;
    live.secondIngestionIdempotent = secondCreated === 0;
    live.trustDomainReused = Number(trust.rows[0]?.n) === 1 && Number(trustAfter.rows[0]?.n) === 1;
    live.federalJurisdictionReused = Number(federal.rows[0]?.n) === 1 && Number(federalAfter.rows[0]?.n) === 1;
    live.noForeignJurisdiction = Number(foreign.rows[0]?.n) === 0;
    live.sourcesIngested = Number(sources.rows[0]?.n) === KINDERGELD_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === 40;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.syntheticCoexistsWithoutDuplicatingOfficialSources = Number(syntheticSources.rows[0]?.n) === 1
      && Number(trustAfter.rows[0]?.n) === 1;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const allPassed = Object.values(staticCases).every(Boolean) && Object.values(live).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    domain: KINDERGELD_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: KINDERGELD_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: KINDERGELD_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    temporalG3EffectiveDatePassthroughImplemented: false,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    standaloneFirstContactModeIntroduced: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Kindergeld pack audit failed"}\n`);
  process.exitCode = 1;
});
