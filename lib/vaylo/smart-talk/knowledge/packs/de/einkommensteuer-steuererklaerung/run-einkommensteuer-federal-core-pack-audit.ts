/**
 * Local Einkommensteuer / Steuererklärung federal core pack audit.
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
  EST_DOMAIN,
  EST_FORMS,
  EST_FUTURE_CHANGE_WATCH_ITEMS,
  EST_FUTURE_WATCH_SOURCE,
  EST_G3_PROCESS_STEP_LIMITATION,
  EST_OFFICIAL_SOURCES,
  EST_PROCESSES,
  EST_UNITS,
  buildEstFederalCorePack,
  evaluateEstProcessCompleteness,
  estPackSummary,
} from "./einkommensteuer-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "est_core";
const PASSWORD = `est-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-est-${process.pid}-${randomUUID().slice(0, 8)}`;
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
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.elster.de",
  "www.lfst.bayern.de",
  "www.bzst.de",
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
  const pack = buildEstFederalCorePack();
  const summary = estPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateEstProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "einkommensteuer-steuererklaerung", "einkommensteuer-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(EST_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(EST_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const staticCases = {
    domainIdentity: pack.domain === EST_DOMAIN && pack.packId === EST_DOMAIN
      && EST_DOMAIN === "einkommensteuer_steuererklaerung",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === EST_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === EST_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Steuererklärung|Einkommensteuer|Finanzamt|Einspruch/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && EST_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|reddit|steuerberater|smartsteuer|handelsblatt|forum|blog/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === EST_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === EST_UNITS.length
      && EST_UNITS.length >= 120
      && EST_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: EST_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && EST_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === EST_FUTURE_WATCH_SOURCE.url
      && EST_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      EST_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !EST_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === EST_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === EST_PROCESSES.length
      && pack.processes.length === 22
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && EST_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 45
      && completeness.outOfScopeScenarioCount === 12
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    pflichtVsAntrag: /nicht automatisch eine Pflicht/u.test(claimText("employee-not-automatically-required"))
      && /nicht automatisch Freiheit/u.test(claimText("employee-not-automatically-exempt"))
      && /nicht optional/u.test(claimText("aufforderung-not-optional"))
      && /garantiert keine Erstattung/u.test(claimText("antragsveranlagung-not-guaranteed-refund"))
      && /nicht entschieden werden/u.test(claimText("insufficient-facts-no-obligation-decision")),
    section46Triggers: /410 Euro/u.test(claimText("section-46-untaxed-or-progression-410"))
      && /nebeneinander/u.test(claimText("section-46-multiple-employers-simultaneous"))
      && /nicht automatisch dieselbe Lage/u.test(claimText("changing-employer-not-automatically-pflicht"))
      && /nicht immer ein gleichzeitiger/u.test(claimText("two-employers-not-always-simultaneous"))
      && /nicht ohne die übrigen gesetzlichen Tatsachen/u.test(claimText("steuerklasse-iii-v-not-always-enough"))
      && /nicht automatisch, dass keine Erklärungspflicht/u.test(claimText("steuerklasse-iv-not-automatically-exempt")),
    deadlineEngine: /keine zeitlose universelle Abgabefrist/u.test(claimText("deadline-not-timeless-31-july"))
      && /31\. Juli 2026/u.test(claimText("vz-2025-unadvised-31-july-2026"))
      && /31\. Dezember 2029/u.test(claimText("vz-2025-voluntary-31-dec-2029"))
      && /2020 bis 2024/u.test(claimText("egao-corona-only-2020-2024"))
      && /nicht genannt werden/u.test(claimText("individual-deadline-needs-facts"))
      && /nicht automatisch/u.test(claimText("extension-not-automatic")),
    lateAndSchaetzung: /bleibt die Erklärungspflicht bestehen/u.test(claimText("still-file-when-late"))
      && /nicht automatisch den Höchstbetrag/u.test(claimText("verspaetungszuschlag-not-always-max"))
      && /nicht der Säumniszuschlag/u.test(claimText("verspaetungszuschlag-not-saeumnis"))
      && /bleibt auch dann bestehen/u.test(claimText("schaetzung-does-not-end-duty"))
      && /nicht, dass die geschätzten Zahlen/u.test(claimText("schaetzung-not-correct-final")),
    residenceAndForeign: /nicht die steuerliche Wohnsitzfeststellung/u.test(claimText("anmeldung-not-tax-residence"))
      && /nicht die vollständige Antwort/u.test(claimText("german-address-not-complete-residence"))
      && /nicht automatisch steuerfrei/u.test(claimText("foreign-income-not-automatically-tax-free"))
      && /nicht, dass in Deutschland nichts zu erklären/u.test(claimText("foreign-tax-paid-not-nothing-to-declare"))
      && /nicht festgestellt werden/u.test(claimText("treaty-result-fail-closed"))
      && pack.actorRules.some((rule) => rule.actorState === "international_tax_residence_undetermined"),
    taxClassVsAnnual: /nicht der endgültige Einkommensteuertarif/u.test(claimText("steuerklasse-not-final-tax"))
      && /nicht die endgültige festgesetzte Einkommensteuer/u.test(claimText("lohnsteuer-not-einkommensteuer"))
      && /nicht automatisch eine niedrigere/u.test(claimText("steuerklasse-iii-not-lower-final")),
    incomeAndElectronic: /Umsatz ist nicht der Gewinn/u.test(claimText("umsatz-not-gewinn"))
      && /nicht die Umsatzsteuer/u.test(claimText("est-not-ust"))
      && /nicht die Gewerbesteuer/u.test(claimText("est-not-gewst"))
      && /elektronisch zu übermitteln/u.test(claimText("self-employed-triggers-electronic"))
      && /nicht das Einkommensteuergesetz/u.test(claimText("elster-not-tax-law")),
    evidenceControls: /grundsätzlich keine Belege mitgesandt/u.test(claimText("belegvorhalte-not-send-all"))
      && /nicht dieselbe Übermittlung/u.test(claimText("meine-belege-not-automatic-submit"))
      && /nicht automatisch vollständig, richtig/u.test(claimText("edata-not-always-correct"))
      && /nicht erfunden werden/u.test(claimText("do-not-fabricate")),
    bescheidRefundPayment: /nicht dasselbe Dokument/u.test(claimText("steuererklaerung-not-bescheid"))
      && /nicht der bindende Steuerbescheid/u.test(claimText("elster-calc-not-binding"))
      && /innerhalb eines Monats nach Bekanntgabe/u.test(claimText("abschlusszahlung-one-month"))
      && /nicht automatisch der Zahlungstermin/u.test(claimText("bescheiddatum-not-payment-deadline"))
      && /10\. März, 10\. Juni, 10\. September und 10\. Dezember/u.test(claimText("vorauszahlung-quarterly-dates")),
    einspruchAndAdv: /nicht automatisch der Tag der Bekanntgabe/u.test(claimText("document-date-not-bekanntgabe"))
      && /innerhalb eines Monats nach Bekanntgabe/u.test(claimText("einspruch-one-month"))
      && /hemmt die Vollziehung nicht/u.test(claimText("einspruch-not-automatic-suspend"))
      && /gesonderter Antrag/u.test(claimText("adv-is-separate")),
    competenceAndBoundaries: /Wohnsitzfinanzamt/u.test(claimText("wohnsitzfinanzamt"))
      && /amtliche Finanzamtsuche/u.test(claimText("live-lookup-finanzamt"))
      && /gesonderten Paket steuer_id/u.test(claimText("steuer-id-pack-is-separate"))
      && /gesonderten Arbeitslosengeldpaket/u.test(claimText("alg-pack-is-separate")),
    noUnsafeTimelessAnnualValues: !/Grundfreibetrag beträgt [0-9]/u.test(corpus)
      && !/Arbeitnehmer-Pauschbetrag beträgt [0-9]/u.test(corpus)
      && /nicht als zeitlose Beträge/u.test(claimText("pauschbetraege-not-timeless"))
      && EST_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: EST_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && EST_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && EST_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: EST_FORMS.length === 7
      && ["ESt-Erklaerung", "ELSTER-Uebermittlung", "ELSTER-Belegnachreichung", "AO-Fristverlaengerung", "AO-Einspruch", "AO-AdV", "ESt-Vorauszahlungsanpassung"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildEstFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildEstFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-einkommensteuer",
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
      [EST_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Grundfreibetrag nach § 32a EStG für 2027%'
           or claim_text_canonical ilike '%künftiger anderer Arbeitnehmer-Pauschbetrag%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [EST_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [EST_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [EST_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_tax_lifecycle", packId: "unknown_tax_lifecycle" }],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === EST_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === EST_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesEst = whitelist.includes("einkommensteuer_steuererklaerung");
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
    domain: EST_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: EST_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: EST_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: EST_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Einkommensteuer pack audit failed"}\n`);
  process.exitCode = 1;
});
