/**
 * Local Wohngeld federal core pack audit.
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
  WOG_DOMAIN,
  WOG_FORMS,
  WOG_FUTURE_CHANGE_WATCH_ITEMS,
  WOG_FUTURE_WATCH_SOURCE,
  WOG_G3_PROCESS_STEP_LIMITATION,
  WOG_OFFICIAL_SOURCES,
  WOG_PROCESSES,
  WOG_UNITS,
  buildWogFederalCorePack,
  evaluateWogProcessCompleteness,
  wogPackSummary,
} from "./wohngeld-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "wog_core";
const PASSWORD = `wog-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-wog-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/045_add_einkommensteuer_knowledge_factory_domain.sql",
  "supabase/migrations/046_add_wohngeld_knowledge_factory_domain.sql",
];
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
  "einkommensteuer_steuererklaerung",
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.bmwsb.bund.de",
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
  const pack = buildWogFederalCorePack();
  const summary = wogPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateWogProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "wohngeld", "wohngeld-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(WOG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(WOG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const staticCases = {
    domainIdentity: pack.domain === WOG_DOMAIN && pack.packId === WOG_DOMAIN
      && WOG_DOMAIN === "wohngeld",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === WOG_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === WOG_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Wohngeld|Mietzuschuss|Lastenzuschuss|Wohngeldbehörde/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && WOG_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|reddit|wohngeldrechner\.de|immowelt|immobilienscout|anwalt|forum|blog/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === WOG_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === WOG_UNITS.length
      && WOG_UNITS.length >= 120
      && WOG_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: WOG_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && WOG_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === WOG_FUTURE_WATCH_SOURCE.url
      && WOG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      WOG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !WOG_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === WOG_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === WOG_PROCESSES.length
      && pack.processes.length === 24
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && WOG_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 45
      && completeness.outOfScopeScenarioCount === 12
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    mietzuschussVsLastenzuschuss: /Mietzuschuss/.test(claimText("mietzuschuss-vs-lastenzuschuss"))
      && /nicht nur für Mietende/u.test(claimText("wohngeld-not-only-tenants"))
      && /nicht automatisch Lastenzuschuss/u.test(claimText("owner-not-automatic-lastenzuschuss"))
      && /nicht automatisch für den Lastenzuschuss/u.test(claimText("tenant-not-lastenzuschuss")),
    foreignPersonGate: /Duldung/.test(claimText("titel-or-duldung"))
      && /nicht automatisch Wohngeldausschluss/u.test(claimText("duldung-not-automatic-exclusion"))
      && /nicht automatisch aus/u.test(claimText("foreign-nationality-not-exclusion"))
      && /nicht automatisch bewilligtes Wohngeld/u.test(claimText("eu-citizen-not-automatic-approval"))
      && /nicht automatisch Wohngeldberechtigung/u.test(claimText("aufenthaltstitel-not-automatic"))
      && /nicht die vollständige Wohngeld-Statusfeststellung/u.test(claimText("anmeld-not-wohngeld-status")),
    householdClassification: /nicht automatisch denselben Wohngeldhaushalt/u.test(claimText("same-address-not-automatically-household"))
      && /nicht automatisch Haushaltsmitglied/u.test(claimText("roommate-not-automatically-hm"))
      && /nicht automatisch ein Wohngeldhaushalt/u.test(claimText("wg-not-automatically-one"))
      && /Ehe allein genügt nicht/u.test(claimText("married-not-enough-alone"))
      && /bei beiden Eltern/u.test(claimText("shared-child-both-parents")),
    grundsicherungsgeldInterface: /Grundsicherungsgeld/.test(claimText("gsg-excluded-if-kdu"))
      && /nicht die gewöhnliche unbeschränkte Kombination/u.test(claimText("gsg-not-always-combinable"))
      && /nicht in jedem Verfahrensstand/u.test(claimText("gsg-pending-not-same-as-final"))
      && /nicht automatisch Wohngeldausschluss/u.test(claimText("alg-not-automatic-exclusion")),
    bafoegBoundary: /dem Grunde nach/u.test(claimText("bafoeg-dem-grunde-nach"))
      && /nicht automatisch Wohngeldberechtigung/u.test(claimText("bafoeg-zero-not-eligible"))
      && /nicht automatisch aus/u.test(claimText("student-not-automatic-excluded"))
      && /nicht notwendig insgesamt ausgeschlossen/u.test(claimText("household-with-student-not-whole-excluded")),
    rentAndComponents: /nicht automatisch die wohngeldrechtlich zu berücksichtigende Miete/u.test(claimText("warmmiete-not-automatically-m"))
      && /nicht eins zu eins/u.test(claimText("heating-bill-not-heizkostenkomponente"))
      && /gesetzlicher Zuschlag/.test(claimText("heizkosten-is-statutory-table"))
      && /Klimakomponente/.test(claimText("klima-is-statutory-table")),
    mietenstufeLocality: /genaue Gemeinde/u.test(claimText("municipality-required"))
      && /Land allein bestimmt nicht/u.test(claimText("not-from-land"))
      && /Postleitzahl/u.test(claimText("not-from-plz"))
      && /userLocale/.test(claimText("not-from-locale")),
    incomeClassification: /nicht das wohngeldrechtliche Gesamteinkommen/u.test(claimText("net-not-gesamteinkommen"))
      && /nicht identisch/u.test(claimText("taxable-not-identical"))
      && /nicht automatisch unbeachtlich/u.test(claimText("foreign-income-not-ignored"))
      && /nicht genannt werden/u.test(claimText("individual-amount-fail-closed")),
    applicationAndStart: /nur auf Antrag/u.test(claimText("application-required"))
      && /Ersten des Antragsmonats/u.test(claimText("mid-month-starts-first"))
      && /nicht automatisch aus/u.test(claimText("move-in-not-automatic-start"))
      && /nicht automatisch zur rückwirkenden Zahlung/u.test(claimText("late-next-month-not-retro-previous")),
    preliminaryAndPeriod: /hinreichend wahrscheinlich/u.test(claimText("preliminary-conditions"))
      && /nicht automatisch ein Recht/u.test(claimText("long-processing-not-automatic-preliminary"))
      && /zwölf Monate/u.test(claimText("ordinary-12-months"))
      && /keine dauerhafte Bewilligung/u.test(claimText("not-permanent")),
    section27Distinction: /mehr als 10 Prozent/.test(claimText("increase-rent-over-10"))
      && /mehr als 10 Prozent/.test(claimText("decrease-income-over-10"))
      && /mehr als 15 Prozent/.test(claimText("report-rent-minus-15"))
      && /mehr als 15 Prozent/.test(claimText("report-income-plus-15"))
      && /nicht dieselben Regeln/u.test(claimText("ten-not-fifteen"))
      && /nicht automatisch dieselbe Meldepflicht/u.test(claimText("income-plus-10-not-same")),
    moveAndContinuation: /nicht automatisch in die neue Wohnung/u.test(claimText("old-not-transfer"))
      && /nicht automatisch unbegrenzt/u.test(claimText("not-automatic-continue"))
      && /früher als zwei Monate/u.test(claimText("early-two-months-timing")),
    recoveryAndOwi: /nicht automatisch Betrug/u.test(claimText("overpayment-not-fraud"))
      && /nicht die endgültige Aufhebung/u.test(claimText("payment-stop-not-final"))
      && /nicht automatisch die verhängte Geldbuße/u.test(claimText("up-to-2000-not-automatic"))
      && /bis zum 31\. Dezember 2024/u.test(claimText("bagatelle-expired-not-current")),
    legalRemedyFailClosed: /Rechtsbehelfsbelehrung/u.test(claimText("read-belehrung"))
      && /nicht automatisch der Beginn/u.test(claimText("document-date-not-deadline"))
      && /nicht automatisch zur Sozialgerichtsbarkeit/u.test(claimText("not-automatically-sozialgericht"))
      && /ohne Bescheidart/u.test(claimText("individual-remedy-fail-closed")),
    authorityLocality: /nach Landesrecht/u.test(claimText("land-designates-authority"))
      && /Ort des Wohnraums/u.test(claimText("dwelling-locality"))
      && /userLocale, Sprache oder Staatsangehörigkeit/u.test(claimText("locale-not-authority"))
      && /Land allein ersetzt nicht/u.test(claimText("land-alone-not-enough")),
    noUnsafeTimelessEuroValues: !/Heizkostenentlastung beträgt [0-9]/u.test(corpus)
      && !/Klimakomponente beträgt [0-9]/u.test(corpus)
      && !/Höchstbetrag beträgt [0-9]/u.test(corpus)
      && /nicht als zeitlose Werte/u.test(claimText("current-euro-not-timeless"))
      && WOG_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: WOG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && WOG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && WOG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: WOG_FORMS.length === 7
      && ["WoGG-Antrag-Mietzuschuss", "WoGG-Antrag-Lastenzuschuss", "WoGG-Weiterleistungsantrag", "WoGG-Aenderung-Antrag", "WoGG-Vorlaeufige-Zahlung", "WoGG-Nachreichung", "WoGG-Mitteilung-Aenderung"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildWogFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildWogFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-wohngeld",
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
      [WOG_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Neuregelung des Wohngeldanspruchs zum 1. Januar 2027%'
           or claim_text_canonical ilike '%künftige Fortschreibung von Höchstbeträgen%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [WOG_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [WOG_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [WOG_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_wohngeld_lifecycle", packId: "unknown_wohngeld_lifecycle" }],
    ).then(() => false).catch((error: unknown) =>
      String(error instanceof Error ? error.message : error).includes("CURATED_DOMAIN_IDENTITY_INVALID"));
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
    const whitelist = String(domainWhitelist.rows[0]?.value);

    live.firstCreatedExpected = firstCreated === summary.expectedSemanticCreated;
    live.secondIngestionIdempotent = secondCreated === 0;
    live.trustDomainReused = Number(trust.rows[0]?.n) === 1 && Number(trustAfter.rows[0]?.n) === 1;
    live.federalJurisdictionReused = Number(federal.rows[0]?.n) === 1 && Number(federalAfter.rows[0]?.n) === 1;
    live.noForeignJurisdiction = Number(foreign.rows[0]?.n) === 0;
    live.sourcesIngested = Number(sources.rows[0]?.n) === WOG_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === WOG_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesWog = whitelist.includes("wohngeld");
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
    domain: WOG_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: WOG_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: WOG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: WOG_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Wohngeld pack audit failed"}\n`);
  process.exitCode = 1;
});
