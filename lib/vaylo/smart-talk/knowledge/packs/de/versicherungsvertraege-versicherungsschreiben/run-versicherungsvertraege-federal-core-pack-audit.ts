/**
 * Local private-insurance federal core pack audit.
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
  VVG_DOMAIN,
  VVG_FORMS,
  VVG_FUTURE_CHANGE_WATCH_ITEMS,
  VVG_FUTURE_WATCH_SOURCE,
  VVG_G3_PROCESS_STEP_LIMITATION,
  VVG_OFFICIAL_SOURCES,
  VVG_PROCESSES,
  VVG_UNITS,
  buildVvgFederalCorePack,
  evaluateVvgProcessCompleteness,
  vvgPackSummary,
} from "./versicherungsvertraege-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "vvg_core";
const PASSWORD = `vvg-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-vvg-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/047_add_versicherungsvertraege_knowledge_factory_domain.sql",
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
  "wohngeld",
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.bafin.de",
  "www.versicherungsombudsmann.de",
  "www.pkv-ombudsmann.de",
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
  const pack = buildVvgFederalCorePack();
  const summary = vvgPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateVvgProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "versicherungsvertraege-versicherungsschreiben", "versicherungsvertraege-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(VVG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(VVG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const staticCases = {
    domainIdentity: pack.domain === VVG_DOMAIN && pack.packId === VVG_DOMAIN
      && VVG_DOMAIN === "versicherungsvertraege_versicherungsschreiben",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === VVG_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === VVG_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Versicherung|Versicherer|Versicherungsnehmer|Widerruf|Obliegenheit|Deckung|Mahnung|Kündigung|Beschwerde|Haftpflicht|Kasko|Anzeige|Ablehnung|Beratung|Anschrift|Schreiben|Dokument|Vertrag|Leistung|Ombuds|VVG|AVB|BaFin|Krankenkasse|Prämie/iu.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && VVG_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|reddit|check24|verivox|anwalt\.de|versicherungsblog|vergleichsportal|finanztip/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === VVG_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === VVG_UNITS.length
      && VVG_UNITS.length >= 120
      && VVG_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: VVG_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && VVG_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === VVG_FUTURE_WATCH_SOURCE.url
      && VVG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      VVG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !VVG_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === VVG_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === VVG_PROCESSES.length
      && pack.processes.length === 30
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && VVG_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 50
      && completeness.outOfScopeScenarioCount === 15
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    legalSystemGate: /nicht ein einziges Rechtssystem/.test(claimText("versicherung-not-one-legal-system"))
      && /kein privater Versicherungsvertrag/.test(claimText("gkv-is-social-law-not-vvg"))
      && /nicht die gesetzliche Krankenkasse/.test(claimText("pkv-is-private-contract"))
      && /nicht das sozialrechtliche Widerspruchsverfahren/.test(claimText("private-denial-not-widerspruch"))
      && /nicht automatisch ein Verwaltungsakt/.test(claimText("private-letter-not-bescheid")),
    roleClassifier: /nicht immer die versicherte Person/.test(claimText("vn-not-always-insured"))
      && /nicht der Versicherer/.test(claimText("broker-not-insurer"))
      && /nicht der Versicherungsnehmer/.test(claimText("third-party-not-vn")),
    documentClassifier: /nicht automatisch eine Kündigung/.test(claimText("mahnung-not-automatically-termination"))
      && /kein Verwaltungsbescheid/.test(claimText("ablehnung-not-bescheid"))
      && /nicht der gesamte Versicherungsvertrag/.test(claimText("pib-not-entire-contract")),
    section5Deviation: /nicht automatisch sofort als angenommen/.test(claimText("abweichung-not-automatic-acceptance"))
      && /unabhängig vom gesetzlich erforderlichen auffälligen Hinweis/.test(claimText("abweichung-needs-conspicuous-notice")),
    widerrufDistinction: /innerhalb von 14 Tagen/.test(claimText("general-14-day-widerruf"))
      && /30 Tage/.test(claimText("life-30-day-widerruf"))
      && /nicht der allgemeinen 14-Tage-Widerrufsfrist/.test(claimText("life-not-14-default"))
      && /ohne Zugang/.test(claimText("individual-widerruf-fail-closed")),
    section19TextQuestion: /in Textform gefragt/.test(claimText("section-19-text-question"))
      && /nicht in Textform gefragt/.test(claimText("unasked-not-automatically-breach"))
      && /nicht automatisch zur Vertragsaufhebung/.test(claimText("forgotten-not-automatic-rescission")),
    gefahrBoundary: /Nicht jede Lebensänderung/.test(claimText("any-life-change-not-gefahr"))
      && /nicht automatisch den totalen Verlust/.test(claimText("gefahr-not-automatic-loss")),
    section28Structure: /nicht automatisch eine Totalablehnung/.test(claimText("obliegenheit-not-automatic-denial"))
      && /nicht automatisch zur Nullzahlung/.test(claimText("gross-neg-not-automatic-zero"))
      && /außer bei Arglist/.test(claimText("causality-can-preserve-cover")),
    firstVsFollowUp: /verschiedene Mechanismen/.test(claimText("first-not-follow-up-premium"))
      && /mindestens zwei Wochen/.test(claimText("section-38-two-weeks"))
      && /nicht automatisch die wirksame qualifizierte Bestimmung/.test(claimText("ordinary-mahnung-not-38")),
    section40Boundary: /innerhalb eines Monats nach Zugang/.test(claimText("section-40-one-month-receipt"))
      && /nicht die universelle Kündigungsregel/.test(claimText("section-40-not-universal-pkv")),
    terminationBoundary: /kein universelles Sonderkündigungsrecht/.test(claimText("no-universal-post-claim"))
      && /Sachversicherungsteil/.test(claimText("section-92-is-sach")),
    claimLifecycle: /unverzüglich/.test(claimText("notify-without-undue-delay"))
      && /nicht automatisch Nullzahlung/.test(claimText("late-claim-not-automatic-zero"))
      && /kein Betrugsvorwurf/.test(claimText("request-not-fraud-accusation"))
      && /nicht automatisch die volle Endzahlung/.test(claimText("one-month-not-full-payout"))
      && /nicht die endgültige Abrechnung/.test(claimText("advance-not-final"))
      && /in Textform zugeht/.test(claimText("section-15-suspension")),
    coverageRequiresContract: /Einzelne Deckung verlangt/.test(claimText("requires-policy-avb-facts"))
      && /kein Gesetz/.test(claimText("avb-not-statute"))
      && /nicht die Deckung/.test(claimText("product-name-not-coverage")),
    denialWorkflow: /nicht das sozialrechtliche Widerspruchsverfahren/.test(claimText("private-denial-not-widerspruch"))
      && /nicht automatisch richtig/.test(claimText("denial-not-automatically-correct"))
      && /nicht automatisch falsch/.test(claimText("denial-not-automatically-wrong")),
    ombudsmanSplit: /Mitgliedsversicherer/.test(claimText("vom-members-only"))
      && /nicht ins gewöhnliche Versicherer-Verfahren/.test(claimText("pkv-excluded-from-general"))
      && /nicht zum PKV-Ombudsmann/.test(claimText("gkv-not-pkv-ombudsmann")),
    bafinBoundary: /nicht den einzelnen Zivilanspruch/.test(claimText("bafin-collective"))
      && /Fristen weiter/.test(claimText("bafin-deadlines-continue"))
      && /nicht für gesetzliche Kranken/.test(claimText("bafin-not-gkv-supervisor")),
    intermediaryBoundary: /nicht der Versicherer/.test(claimText("broker-not-insurer"))
      && /außerhalb dieses Kerns/.test(claimText("complex-advisor-oos")),
    phishingGate: /nicht die Echtheit/.test(claimText("logo-not-authenticity"))
      && /nicht der verifizierte Versicherer/.test(claimText("sender-name-not-verified"))
      && /unabhängig geprüfter/.test(claimText("payment-change-independent-contact")),
    deadlineFailClosed: /keine generelle Versicherungsfrist von 14 Tagen/.test(claimText("no-generic-14-days"))
      && /nicht automatisch der Fristbeginn/.test(claimText("document-date-not-deadline-start"))
      && /nicht der Zugangs/.test(claimText("document-date-not-receipt")),
    noUnsafeGenericDeadline: !/Versicherungsfrist beträgt immer 14 Tage/u.test(corpus)
      && !/Rechtsschutz hat immer .* Selbstbeteiligung/u.test(corpus)
      && VVG_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: VVG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && VVG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && VVG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: VVG_FORMS.length === 6
      && ["VVG-Versicherungsschein-Anforderung", "VVG-Schadenanzeige", "VVG-Interne-Beschwerde", "VOM-Schlichtungsantrag", "PKV-Ombudsmann-Antrag", "BAFIN-Verbraucherbeschwerde"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildVvgFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildVvgFederalCorePack().jurisdictions[0]!.id,
    noProductionInteraction: true,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      staticCases,
      summary,
      validationIssues: validation.issues,
      publicRuntimeAuthorized: false,
      productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-vvg",
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
      [VVG_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Artikel 13 des Altersvorsorgereformgesetzes%'
           or claim_text_canonical ilike '%künftige VVG-Änderungen%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [VVG_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [VVG_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [VVG_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_vvg_lifecycle", packId: "unknown_vvg_lifecycle" }],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === VVG_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === VVG_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesVvg = whitelist.includes("versicherungsvertraege_versicherungsschreiben");
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
    domain: VVG_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: VVG_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: VVG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: VVG_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Versicherungsvertraege pack audit failed"}\n`);
  process.exitCode = 1;
});
