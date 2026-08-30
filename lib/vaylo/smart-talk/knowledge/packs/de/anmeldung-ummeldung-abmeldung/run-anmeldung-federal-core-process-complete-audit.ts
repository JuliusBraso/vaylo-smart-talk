/**
 * Local Anmeldung process-complete gap-closure audit.
 * Disposable PostgreSQL 17 + G3 domain ingestion only.
 * Does not touch production Anmeldung data or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { validateCuratedDomainPack } from "../../../source-registry/knowledge-factory-contracts";
import { buildSyntheticFederalKindergeldPack } from "../../../source-registry/knowledge-factory-synthetic-fixtures";
import {
  ANMELDUNG_ADDED_CLAIM_IDS,
  ANMELDUNG_BASELINE_CLAIM_IDS,
  ANMELDUNG_DOMAIN,
  ANMELDUNG_FIRST_PACK_CLAIM_IDS,
  ANMELDUNG_FORMS,
  ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS,
  ANMELDUNG_FUTURE_WATCH_SOURCE,
  ANMELDUNG_G3_PROCESS_STEP_LIMITATION,
  ANMELDUNG_OFFICIAL_SOURCES,
  ANMELDUNG_PROCESSES,
  ANMELDUNG_UNITS,
  ANMELDUNG_V2A_CLAIM_IDS,
  buildAnmeldungFederalCorePack,
  evaluateAnmeldungProcessCompleteness,
  anmeldungPackSummary,
} from "./anmeldung-federal-core-pack";
import {
  CITY_STATE_AGS,
  buildCityStateServiceAreaPacks,
} from "./anmeldung-city-state-service-area-packs";
import { CANONICAL_UNITS } from "./pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "anmeldung_core";
const PASSWORD = `anm-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-anmeldung-pc-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/044_add_arbeitslosengeld_knowledge_factory_domain.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "verwaltung.bund.de",
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
  const pack = buildAnmeldungFederalCorePack();
  const summary = anmeldungPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateAnmeldungProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "anmeldung-ummeldung-abmeldung", "anmeldung-federal-core-pack.ts",
  );
  const historicPack = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "anmeldung-ummeldung-abmeldung", "pack.ts",
  );
  const cityStateSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "anmeldung-ummeldung-abmeldung", "anmeldung-city-state-service-area-packs.ts",
  );
  const watchIds = new Set(ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const cityPacks = buildCityStateServiceAreaPacks();
  const bremenPack = cityPacks.find((item) => item.packId === "anmeldung_service_area_bremen");
  const staticCases = {
    domainIdentity: pack.domain === ANMELDUNG_DOMAIN && pack.packId === "anmeldung_ummeldung_abmeldung",
    structurallyValid: validation.valid,
    original41Preserved: ANMELDUNG_BASELINE_CLAIM_IDS.length === 41
      && ANMELDUNG_FIRST_PACK_CLAIM_IDS.length === 28
      && ANMELDUNG_V2A_CLAIM_IDS.length === 13
      && CANONICAL_UNITS.length === 41
      && ANMELDUNG_BASELINE_CLAIM_IDS.every((id) => pack.claims.some((claim) => claim.key === id))
      && ANMELDUNG_BASELINE_CLAIM_IDS.every((id) => CANONICAL_UNITS.some((unit) => unit.id === id)),
    noBaselineIdsLostOrRenamed: ANMELDUNG_BASELINE_CLAIM_IDS.every((id, index) =>
      CANONICAL_UNITS[index]?.id === id || CANONICAL_UNITS.some((unit) => unit.id === id))
      && !ANMELDUNG_ADDED_CLAIM_IDS.some((id) => (ANMELDUNG_BASELINE_CLAIM_IDS as readonly string[]).includes(id)),
    uniqueClaimIds: new Set(ingestibleClaimKeys).size === pack.claims.length
      && pack.claims.length === ANMELDUNG_UNITS.length
      && pack.claims.length === 41 + ANMELDUNG_ADDED_CLAIM_IDS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) =>
        /[äöüÄÖÜß]|Anmeldung|Abmeldung|Meldebehörde|Meldebescheinigung|Meldebestätigung|Meldeschein|Wohnung|Einzug|Mietvertrag/u
          .test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && ANMELDUNG_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|expat|reddit/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length,
    ingestibleCurrentClaimsOnly2026: ANMELDUNG_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.length === 1
      && ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === ANMELDUNG_FUTURE_WATCH_SOURCE.url
      && ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible" && item.currentGuidance === false),
    futureWatchStructurallyExcluded: ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
      !ingestibleClaimKeys.includes(item.key) && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !ANMELDUNG_UNITS.some((unit) => watchKeys.has(unit.key)),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    currentProcessesOnly2026: pack.processes.length === ANMELDUNG_PROCESSES.length
      && pack.processes.length === 15
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && ANMELDUNG_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount === 32
      && completeness.outOfScopeScenarioCount === 7
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && row.derived === row.coverage),
    wgbPath: /nicht die Wohnungsgeberbestätigung/u.test(claimText("mietvertrag-not-wgb"))
      && /nicht erfunden oder gefälscht/u.test(claimText("do-not-falsify-wgb"))
      && /unverzüglich mitzuteilen/u.test(claimText("landlord-confirmation-missing-notice")),
    domesticVsAbmeldung: /keine neue Wohnung im Inland/u.test(claimText("abmeldung-duty-no-new-domestic-home"))
      && /§ 17 Absatz 2/u.test(claimText("domestic-move-new-registration")),
    arrivalFromAbroad: /nicht automatisch von der Anmeldepflicht/u.test(claimText("nationality-not-exemption"))
      && /nicht der Aufenthaltstitel/u.test(claimText("anmeldung-not-aufenthaltstitel")),
    shortStay: /nicht in jedem Fall/u.test(claimText("short-stay-not-never"))
      && /gilt nicht für zugewiesene Aufnahmeeinrichtungen/u.test(claimText("assigned-accommodation-no-27-2")),
    hauptNeben: /nicht die beliebig bevorzugte Anschrift/u.test(claimText("hauptwohnung-not-preference"))
      && /nicht automatisch melderechtlich unbeachtlich/u.test(claimText("nebenwohnung-not-irrelevant")),
    childNewborn: /unter 16 Jahren/u.test(claimText("under-16-registration-responsibility"))
      && /Neugeborene/u.test(claimText("newborn-registration-if-other-dwelling")),
    bestaetigungVsBescheinigung: /nicht dieselbe Urkunde/u.test(claimText("meldebestaetigung-not-bescheinigung")),
    lateFine: /kein automatischer Einzelfallbetrag/u.test(claimText("ordinary-registration-fine-framework"))
      && /gleichwohl nachholen/u.test(claimText("late-still-register")),
    electronicLocalBoundary: /nicht, dass jede Meldebehörde/u.test(claimText("electronic-not-every-municipality")),
    immigrationBoundary: /nicht entschieden werden/u.test(claimText("immigration-fail-closed")),
    downstreamBoundaries: /nicht das Steuer-Identifikationsnummer-Verfahren/u.test(claimText("anmeldung-not-tax-residence"))
      && /nicht automatisch die Mitgliedschaft/u.test(claimText("anmeldung-not-health-insurance"))
      && /nicht das Grundsicherungsgeldverfahren/u.test(claimText("anmeldung-not-jobcenter"))
      && /nicht das Arbeitslosengeldverfahren/u.test(claimText("anmeldung-not-agentur"))
      && /nicht der Kindergeldantrag/u.test(claimText("anmeldung-not-kindergeld")),
    jurisdictionLanguage: /Dokumentsprache/u.test(claimText("userlocale-not-jurisdiction"))
      && /Das Bundesland allein/u.test(claimText("land-alone-not-enough")),
    freshnessModesPresent: ANMELDUNG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && ANMELDUNG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && ANMELDUNG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT")
      && ANMELDUNG_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    noUnsafeLocalFederalFacts: !/bundesweites Einheitsbürgeramt/i.test(historicPack)
      && /live zu prüfen/u.test(claimText("opening-hours-are-live")),
    cityStateUnchanged: CITY_STATE_AGS.berlin === "11000000"
      && CITY_STATE_AGS.bremenCity === "04011000"
      && CITY_STATE_AGS.hamburg === "02000000"
      && CITY_STATE_AGS.bremerhaven === "04012000"
      && !cityStateSource.includes("11000001")
      && Boolean(bremenPack)
      && !JSON.stringify(bremenPack).includes("04012000"),
    formsRepresented: ANMELDUNG_FORMS.length === 3
      && ["BMG-Meldeschein", "BMG-Wohnungsgeberbestaetigung", "BMG-Meldebescheinigung"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id === buildAnmeldungFederalCorePack().trustDomain.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-anmeldung-pc",
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
    const sources = await admin.query(
      "select count(*)::int n from public.knowledge_sources where canonical_url=any($1::text[])",
      [ANMELDUNG_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%lokale Online-Anmeldungskataloge%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [ANMELDUNG_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [ANMELDUNG_DOMAIN],
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

    live.firstCreatedExpected = firstCreated === summary.expectedSemanticCreated && firstCreated > 0;
    live.secondIngestionIdempotent = secondCreated === 0;
    live.trustDomainReused = Number(trust.rows[0]?.n) === 1 && Number(trustAfter.rows[0]?.n) === 1;
    live.federalJurisdictionReused = Number(federal.rows[0]?.n) === 1 && Number(federalAfter.rows[0]?.n) === 1;
    live.sourcesIngested = Number(sources.rows[0]?.n) === ANMELDUNG_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length;
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
    domain: ANMELDUNG_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    addedClaimIds: ANMELDUNG_ADDED_CLAIM_IDS,
    baselineClaimIds: ANMELDUNG_BASELINE_CLAIM_IDS,
    futureWatchItems: ANMELDUNG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: ANMELDUNG_G3_PROCESS_STEP_LIMITATION,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Anmeldung process-complete audit failed"}\n`);
  process.exitCode = 1;
});
