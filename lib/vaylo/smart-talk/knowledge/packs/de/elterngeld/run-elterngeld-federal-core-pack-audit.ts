/**
 * Local Elterngeld federal core pack audit.
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
  ELG_DOMAIN,
  ELG_FORMS,
  ELG_FUTURE_CHANGE_WATCH_ITEMS,
  ELG_FUTURE_WATCH_SOURCE,
  ELG_G3_PROCESS_STEP_LIMITATION,
  ELG_OFFICIAL_SOURCES,
  ELG_PROCESSES,
  ELG_UNITS,
  buildElgFederalCorePack,
  evaluateElgProcessCompleteness,
  elgPackSummary,
} from "./elterngeld-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "elg_core";
const PASSWORD = `elg-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-elg-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/048_add_banking_zahlungsverkehr_knowledge_factory_domain.sql",
  "supabase/migrations/049_add_verkehrsordnungswidrigkeiten_knowledge_factory_domain.sql",
  "supabase/migrations/050_add_elterngeld_knowledge_factory_domain.sql",
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
  "versicherungsvertraege_versicherungsschreiben",
  "banking_zahlungsverkehr",
  "verkehrsordnungswidrigkeiten_bussgeldverfahren",
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.familienportal.de",
]);
const GERMAN_CLAIM = /[äöüÄÖÜß]|Elterngeld|Elternzeit|Lebensmonat|BEEG|Mutterschaft|Basis|Plus|Partnerschaft|Einkommen|Antrag|Widerspruch|Kind|Geburt|Steuer|Aufenthalt|Behörde|Euro|Monat|Schwelle|Bonus|Frühgeburt|Mehrling|Rückforderung|Sozial|Anschrift|Stunden|Duldung|Nebengewerbe|Wohnsitz|Staaten|Rechner|Anspruch/iu;

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
  const pack = buildElgFederalCorePack();
  const summary = elgPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateElgProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "elterngeld", "elterngeld-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(ELG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(ELG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const uniqueSourceUrls = new Set(ELG_OFFICIAL_SOURCES.map((item) => item.url));
  const staticCases = {
    domainIdentity: pack.domain === ELG_DOMAIN && pack.packId === ELG_DOMAIN
      && ELG_DOMAIN === "elterngeld",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === ELG_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === ELG_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && ELG_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === ELG_OFFICIAL_SOURCES.length,
    noUnofficialSources: !/wikipedia|reddit|elterngeld-rechner|anwalt\.de|familienblog|finanztip|check24/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === ELG_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === ELG_UNITS.length
      && ELG_UNITS.length >= 120
      && ELG_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: ELG_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && ELG_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === ELG_FUTURE_WATCH_SOURCE.url
      && ELG_FUTURE_CHANGE_WATCH_ITEMS[0]?.id === "elg-legacy-200k-threshold"
      && ELG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      ELG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !ELG_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === ELG_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === ELG_PROCESSES.length
      && pack.processes.length === 36
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && ELG_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 50
      && completeness.outOfScopeScenarioCount === 13
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    elterngeldNotElternzeit: /nicht Elternzeit/.test(claimText("elterngeld-not-elternzeit"))
      && /nicht Voraussetzung für Elterngeld/.test(claimText("elternzeit-not-required"))
      && /kein Elterngeldantrag/.test(claimText("elternzeit-notice-not-application")),
    basicEligibilityAndHours: /Wohnsitz oder gewöhnlicher Aufenthalt/.test(claimText("basic-section-1-gate"))
      && /höchstens 32 Wochenstunden/.test(claimText("hours-32-average"))
      && /nicht automatisch aus/.test(claimText("working-not-exclusion"))
      && /nicht die Untergrenze des Partnerschaftsbonus/.test(claimText("32-not-bonus-minimum")),
    foreignStatusGate: /genau bezeichneten Titel/.test(claimText("section-17-exact-status"))
      && /nicht automatisch Elterngeld/.test(claimText("title-not-automatic"))
      && /schließt Elterngeld nicht aus/.test(claimText("foreign-not-exclusion"))
      && /ohne weitere Tatsachen nicht/.test(claimText("unclear-status-fail-closed")),
    incomeThreshold: /175000 Euro/.test(claimText("threshold-175k-current"))
      && /nicht Brutto oder Netto/.test(claimText("threshold-is-taxable-income"))
      && /keine Bruttolohnschwelle/.test(claimText("175k-not-gross"))
      && /nicht heutige Schwelle für Geburten 2026/.test(claimText("legacy-200k-not-current-2026")),
    variantsAndBonus: /nicht Elterngeld Plus/.test(claimText("basis-not-plus"))
      && /nicht der Partnerschaftsbonus/.test(claimText("partnermonate-not-bonus"))
      && /24 bis 32 Wochenstunden/.test(claimText("bonus-24-to-32"))
      && /nicht immer genau die Hälfte/.test(claimText("plus-not-always-half-actual")),
    amountAndNetto: /mindestens 300 Euro/.test(claimText("min-300-max-1800"))
      && /nicht das Elterngeld-Netto/.test(claimText("payslip-net-not-elterngeld-netto"))
      && /nicht der universelle Elterngeldsatz/.test(claimText("sixtyseven-not-universal"))
      && /nicht der universelle Elterngeldsatz/.test(claimText("sixtyfive-not-universal")),
    bemessung: /zwölf Kalendermonate vor dem Geburtsmonat/.test(claimText("employee-12-months"))
      && /abgeschlossenen? steuerlichen? Veranlagungszeitraum/.test(claimText("self-employed-tax-year"))
      && /weniger als 35 Euro/.test(claimText("small-self-employment-35"))
      && /nicht der selbständige Elterngeldgewinn/.test(claimText("turnover-not-profit")),
    lebensmonateAndDuration: /Lebensmonate des Kindes/.test(claimText("lebensmonat-from-birth-day"))
      && /nicht notwendig ein Elterngeld-Lebensmonat/.test(claimText("lebensmonat-not-calendar"))
      && /nicht immer automatisch 14/.test(claimText("not-always-14"))
      && /nur in einem der ersten zwölf Lebensmonate/.test(claimText("simultaneous-one-month"))
      && /lückenlos/.test(claimText("plus-continuity-after-14")),
    specialFamily: /um einen bis vier Monate/.test(claimText("premature-stepped-months"))
      && /nur ein Elterngeldanspruch/.test(claimText("twins-one-claim"))
      && /nicht automatisch den Geschwisterbonus/.test(claimText("another-child-not-automatic-bonus"))
      && /nicht automatisch Alleinerziehendenstatus/.test(claimText("unmarried-not-single-parent")),
    maternityAndOtherBenefits: /gelten als Basiselterngeldmonate/.test(claimText("maternity-counts-basis"))
      && /kein zusätzliches volles Elterngeld/.test(claimText("maternity-not-extra-full"))
      && /schließt Elterngeld nicht automatisch aus/.test(claimText("alg-not-exclusion"))
      && /nicht immer zusätzlich unberücksichtigt/.test(claimText("sgb2-300-not-always")),
    applicationAndChange: /schriftlich zu beantragen/.test(claimText("written-application"))
      && /letzten drei Lebensmonate/.test(claimText("three-lebensmonate-retro"))
      && /nicht drei Kalendermonate/.test(claimText("three-not-calendar"))
      && /nicht frei änderbar/.test(claimText("paid-month-not-freely-changeable")),
    provisionalAndRecovery: /nicht der endgültige Betrag/.test(claimText("provisional-not-final"))
      && /tatsächliche Erwerbseinkommen nachzuweisen/.test(claimText("actual-income-must-be-shown"))
      && /nicht automatisch Betrug/.test(claimText("recovery-not-fraud"))
      && /keine aufschiebende Wirkung/.test(claimText("no-suspensive-effect")),
    jurisdictionAndCrossBorder: /Wohnsitz hat/.test(claimText("child-residence-jurisdiction"))
      && /Sozialgerichtsbarkeit/.test(claimText("social-court-jurisdiction"))
      && /nicht immer zum vorrangigen/.test(claimText("german-residence-not-always-primary"))
      && /Progressionsvorbehalt/.test(claimText("tax-free-but-progression"))
      && !/Elterngeld ist immer steuerfrei und unbeachtlich/iu.test(corpus)
      && !/jedes Paar erhält 14 Basismonate/iu.test(corpus),
    noUnsafeGenericDeadline: !/Widerspruchsfrist beträgt immer einen Monat ab Bescheiddatum/iu.test(corpus)
      && !/Rückwirkung beträgt immer drei Kalendermonate/iu.test(corpus)
      && pack.handlingPolicies.filter((policy) => policy.handlingMode === "FETCH_LIVE")
        .every((policy) => policy.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: ELG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && ELG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "MANUAL_REVIEW_REQUIRED")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: ELG_FORMS.length === 6
      && ["ELG-Antrag", "ELG-Aenderung", "ELG-Einkommensnachweis", "ELG-Tatsaechliches-Einkommen", "ELG-Unterlagen", "ELG-Widerspruch"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildElgFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildElgFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-elg",
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
      [ELG_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where id::text = any($1::text[])
           or claim_text_canonical = any($2::text[])`,
      [[...watchIds], [...watchKeys]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [ELG_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [ELG_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [ELG_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_elterngeld_lifecycle", packId: "unknown_elterngeld_lifecycle" }],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === ELG_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === ELG_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesElterngeld = whitelist.includes("elterngeld");
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
    domain: ELG_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: ELG_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: ELG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: ELG_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Elterngeld pack audit failed"}\n`);
  process.exitCode = 1;
});
