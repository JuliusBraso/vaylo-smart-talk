/**
 * Local Ausländerbehörde / Aufenthalt federal orientation core audit.
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
  AUFENTHALT_DOMAIN,
  AUFENTHALT_FORMS,
  AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS,
  AUFENTHALT_FUTURE_WATCH_SOURCE,
  AUFENTHALT_G3_PROCESS_STEP_LIMITATION,
  AUFENTHALT_OFFICIAL_SOURCES,
  AUFENTHALT_PROCESSES,
  AUFENTHALT_UNITS,
  buildAufenthaltFederalCorePack,
  evaluateAufenthaltProcessCompleteness,
  aufenthaltPackSummary,
} from "./auslaenderbehoerde-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "aufenthalt_core";
const PASSWORD = `auf-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-aufenthalt-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "www.bmi.bund.de",
  "www.auswaertiges-amt.de",
  "www.bamf.de",
  "www.make-it-in-germany.com",
  "verwaltung.bund.de",
]);
const PRIOR_DOMAINS = [
  "anmeldung_ummeldung_abmeldung",
  "steuer_id_and_basic_finanzamt_letters",
  "health_insurance_orientation",
  "jobcenter_buergergeld",
  "familienkasse_kindergeld",
  "rechnung_mahnung",
  "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
  "vehicle_registration_and_driving_licence",
  "housing_orientation",
  "arbeitslosengeld",
];

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
  const pack = buildAufenthaltFederalCorePack();
  const summary = aufenthaltPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateAufenthaltProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "auslaenderbehoerde-aufenthalt", "auslaenderbehoerde-federal-core-pack.ts",
  );
  const watchIds = new Set(AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const staticCases = {
    domainIdentity: pack.domain === AUFENTHALT_DOMAIN && pack.packId === AUFENTHALT_DOMAIN
      && AUFENTHALT_DOMAIN === "auslaenderbehoerde_limited_orientation",
    structurallyValid: validation.valid,
    uniqueClaimIds: new Set(ingestibleClaimIds).size === pack.claims.length
      && new Set(ingestibleClaimKeys).size === AUFENTHALT_UNITS.length
      && pack.claims.length === AUFENTHALT_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) =>
        /[äöüÄÖÜß]|Aufenthalt|Ausländer|Visum|Fiktion|Duldung|Gestattung|Niederlassung|Freizüg|Blaue|Widerspruch|Anmeldung|Pass|Behörde|Titel|Jobcenter|Arbeitslosengeld|Arbeitgeber|Arbeitsangebot|Scheinehe|Bekanntgabe|Erlaubnis/u
          .test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && AUFENTHALT_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|reddit|kanzlei|expat|relocation/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === AUFENTHALT_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: AUFENTHALT_UNITS.every((unit) => unit.temporal === "current_2026")
      && AUFENTHALT_UNITS.length === 115,
    futureWatchOfficialProvenance: AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.length === 2
      && AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === AUFENTHALT_FUTURE_WATCH_SOURCE.url
      && AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible" && item.currentGuidance === false),
    futureWatchStructurallyExcluded: AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
      !ingestibleClaimKeys.includes(item.key) && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !AUFENTHALT_UNITS.some((unit) => watchKeys.has(unit.key)),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    currentProcessesOnly2026: pack.processes.length === AUFENTHALT_PROCESSES.length
      && pack.processes.length === 21
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && AUFENTHALT_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount === 37
      && completeness.outOfScopeScenarioCount === 9
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && row.derived === row.coverage),
    euThirdCountryGate: /nicht gewöhnlich eine Aufenthaltserlaubnis/u.test(claimText("eu-not-ordinary-titel"))
      && /kein unbedingtes unbeschränktes Aufenthaltsrecht/u.test(claimText("eu-not-unconditional"))
      && /nicht automatisch zur gewöhnlichen Aufenthaltserlaubnis/u.test(claimText("non-eu-family-not-ordinary-ae")),
    documentClassifier: /nicht dasselbe wie ein nationales Visum/u.test(claimText("schengen-not-national"))
      && /kein Aufenthaltstitel/u.test(claimText("duldung-not-titel"))
      && /kein Aufenthaltstitel nach § 4/u.test(claimText("gestattung-not-titel"))
      && /nicht selbst ein neuer Aufenthaltstitel/u.test(claimText("fiktion-not-new-titel"))
      && /nicht eine Aufenthaltserlaubnis/u.test(claimText("aufenthaltskarte-not-ae"))
      && /nicht dieselbe Rechtsfigur wie die Erlaubnis zum Daueraufenthalt/u.test(claimText("ne-not-daueraufenthalt-eu")),
    fiktionControls: /gilt nicht für ein Schengen-Visum/u.test(claimText("schengen-visa-no-81-4"))
      && /nicht automatisch zur Fortgeltung/u.test(claimText("late-not-automatic-fiction"))
      && /nicht automatisch einen unerlaubten Aufenthalt/u.test(claimText("expired-card-not-automatically-unlawful"))
      && /keine sichere internationale Reise/u.test(claimText("travel-fiktion-fail-closed")),
    workAndEmployer: /nicht uneingeschränkte Erlaubnis/u.test(claimText("title-not-unrestricted-work"))
      && /nicht automatisch die aufenthalts/u.test(claimText("job-offer-not-authorization"))
      && /nicht immer automatisch erlaubt/u.test(claimText("new-employer-not-always-allowed"))
      && /nicht immer automatisch verboten/u.test(claimText("new-employer-not-always-forbidden")),
    section82And51: /Nicht jede Lebensänderung/u.test(claimText("two-week-not-every-change"))
      && /keine universelle Erlöschensregel/u.test(claimText("six-months-not-universal"))
      && /nicht automatisch zum Erlöschen/u.test(claimText("brief-trip-not-loss")),
    widerspruch84: /keine aufschiebende Wirkung/u.test(claimText("widerspruch-no-automatic-suspension"))
      && /keine Empfehlung, Widerspruch/u.test(claimText("do-not-auto-recommend-widerspruch"))
      && /nicht ohne weiteres der Tag der Bekanntgabe/u.test(claimText("bekanntgabe-not-document-date")),
    anmeldungSeparation: /nicht der Aufenthaltstitel/u.test(claimText("anmeldung-not-titel"))
      && /beweist nicht/u.test(claimText("registered-address-not-status")),
    jurisdictionLanguage: /Dokumentsprache/u.test(claimText("userlocale-not-jurisdiction"))
      && /Das Bundesland allein/u.test(claimText("land-alone-not-enough")),
    noTimelessSalary: /keine zeitlose kanonische Konstante/u.test(claimText("salary-threshold-not-timeless"))
      && !/[0-9]{2,}\s*000\s*Euro/.test(packSource),
    freshnessModesPresent: AUFENTHALT_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && AUFENTHALT_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && AUFENTHALT_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT")
      && AUFENTHALT_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    formsRepresented: AUFENTHALT_FORMS.length === 4
      && ["AUFENTH-Antrag", "AUFENTH-Fiktion", "AUFENTH-eAT", "FREIZUEG-Karte"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id === buildAufenthaltFederalCorePack().trustDomain.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-aufenthalt",
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
      [AUFENTHALT_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Nach Ablauf des 23. Juli 2027 endet%'
           or claim_text_canonical ilike '%Künftige Jahresgehaltsschwellen%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes where process_group_id=$1`,
      [AUFENTHALT_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1 and l.process_step_id is null`,
      [AUFENTHALT_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms where form_identifier=any($1::text[])`,
      [AUFENTHALT_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const whitelist = String(domainWhitelist.rows[0]?.value);
    let unknownRejected = false;
    try {
      const unknown = { ...pack, domain: "not_a_real_domain", packId: "not_a_real_domain" };
      await ingestor.query(DOMAIN_RPC, [unknown]);
    } catch {
      unknownRejected = true;
    }
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === AUFENTHALT_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.unknownDomainRejected = unknownRejected;
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
    domain: AUFENTHALT_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: AUFENTHALT_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: AUFENTHALT_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: AUFENTHALT_G3_PROCESS_STEP_LIMITATION,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Aufenthalt pack audit failed"}\n`);
  process.exitCode = 1;
});
