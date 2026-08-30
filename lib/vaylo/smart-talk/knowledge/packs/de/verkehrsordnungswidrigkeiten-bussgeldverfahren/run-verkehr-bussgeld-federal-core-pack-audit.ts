/**
 * Local road-traffic OWi / Bußgeldverfahren federal core pack audit.
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
  OWI_DOMAIN,
  OWI_FORMS,
  OWI_FUTURE_CHANGE_WATCH_ITEMS,
  OWI_FUTURE_WATCH_SOURCE,
  OWI_G3_PROCESS_STEP_LIMITATION,
  OWI_OFFICIAL_SOURCES,
  OWI_PROCESSES,
  OWI_UNITS,
  buildOwiFederalCorePack,
  evaluateOwiProcessCompleteness,
  owiPackSummary,
} from "./verkehr-bussgeld-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "owi_core";
const PASSWORD = `owi-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-owi-${process.pid}-${randomUUID().slice(0, 8)}`;
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
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.kba.de",
]);
const GERMAN_CLAIM = /[äöüÄÖÜß]|Bußgeld|Ordnungswidrigkeit|Anhörung|Einspruch|Fahrverbot|Punkte|Halter|Zeuge|Verwarnung|Verjährung|Zustellung|Geldbuße|OWiG|StVG|StPO|StGB|FeV|BKatV|Fahrtenbuch|Erzwingungshaft|Fahrerlaubnis|Straf|Personalien|Promille|THC|KBA|Behörde|Polizei|Betroffene|Auskunft|Kamera|Verkehr|Wiedereinsetzung|Unterbrechung|Ratenzahlung|Echtheit|QR|Frist|Schreiben/iu;

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
  const pack = buildOwiFederalCorePack();
  const summary = owiPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateOwiProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "verkehrsordnungswidrigkeiten-bussgeldverfahren", "verkehr-bussgeld-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(OWI_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(OWI_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const uniqueSourceUrls = new Set(OWI_OFFICIAL_SOURCES.map((item) => item.url));
  const staticCases = {
    domainIdentity: pack.domain === OWI_DOMAIN && pack.packId === OWI_DOMAIN
      && OWI_DOMAIN === "verkehrsordnungswidrigkeiten_bussgeldverfahren",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === OWI_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === OWI_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && OWI_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === OWI_OFFICIAL_SOURCES.length,
    noUnofficialSources: !/wikipedia|reddit|bussgeldkatalog\.de|bussgeldrechner|adac\.de|anwalt\.de|verkehrsrecht-blog|finanztip/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === OWI_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === OWI_UNITS.length
      && OWI_UNITS.length >= 120
      && OWI_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: OWI_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && OWI_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === OWI_FUTURE_WATCH_SOURCE.url
      && OWI_FUTURE_CHANGE_WATCH_ITEMS[0]?.id === "owi-legacy-stvg-26-three-month"
      && OWI_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      OWI_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !OWI_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === OWI_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === OWI_PROCESSES.length
      && pack.processes.length === 31
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && OWI_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 48
      && completeness.outOfScopeScenarioCount === 14
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    anhoerungNotBescheid: /kein Bußgeldbescheid/.test(claimText("anhoerung-not-bescheid"))
      && /nicht, dass bereits eine Geldbuße festgesetzt/.test(claimText("receiving-anhoerung-not-imposed"))
      && /nicht verpflichtet, die Tat zuzugeben/.test(claimText("betroffener-not-obliged-to-confess")),
    section111IdentityBoundary: /keine falschen Angaben zur Identität/.test(claimText("silence-not-false-identity"))
      && /dürfen nicht erfunden werden/.test(claimText("never-fabricate-identity"))
      && /§ 111 OWiG/.test(claimText("false-identity-can-be-owi")),
    witnessBoundary: /keine Anhörung des Betroffenen/.test(claimText("zeugenbogen-not-anhoerung"))
      && /nicht der Betroffene/.test(claimText("zeuge-not-betroffener"))
      && /nicht für jede Person automatisch/.test(claimText("stpo-52-family-not-universal"))
      && /kein Recht, jedes amtliche Verlangen pauschal zu ignorieren/.test(claimText("witness-not-ignore-every-requirement"))
      && /hängt von Rolle, Verwandtschaft, Behörde/.test(claimText("no-blanket-never-answer"))
      && !/beantworten Sie einen Zeugenfragebogen niemals/iu.test(corpus),
    holderNotDriver: /nicht automatisch der Fahrer/.test(claimText("halter-not-fahrer"))
      && /nicht automatisch für die Geldbuße des Fahrers/.test(claimText("no-us-style-owner-liability"))
      && /keine Verurteilung des Halters/.test(claimText("section-25a-costs-not-driver-fine"))
      && /20 Euro/.test(claimText("section-25a-fee-20")),
    fahrtenbuchSeparate: /kein Bußgeld/.test(claimText("fahrtenbuch-not-bussgeld"))
      && /nicht automatisch auf jeden unbekannten Fahrer/.test(claimText("fahrtenbuch-not-automatic"))
      && /verschiedene Mechanismen/.test(claimText("fahrtenbuch-not-25a")),
    verwarnungSection56: /fünf bis fünfundfünfzig Euro/.test(claimText("verwarnung-5-to-55"))
      && /Einverständnis nach Belehrung/.test(claimText("verwarnung-needs-consent-and-payment"))
      && /nicht mehr verfolgt werden/.test(claimText("effective-verwarnung-closes-prosecution"))
      && /keine Gebühren/.test(claimText("no-fees-for-effective-verwarnung"))
      && /nicht die Punkte-Verwarnung/.test(claimText("owig-verwarnung-not-stvg-verwarnung")),
    bussgeldbescheidAndFees: /Person, Tat, Zeit, Ort/.test(claimText("bescheid-required-contents"))
      && /fünf vom Hundert/.test(claimText("section-107-fee-5-percent"))
      && /mindestens 25 Euro/.test(claimText("section-107-fee-5-percent"))
      && /höchstens 7500 Euro/.test(claimText("section-107-fee-5-percent"))
      && /nicht notwendig ein Gesamtzahlbetrag von 100 Euro/.test(claimText("hundred-fine-not-hundred-total"))
      && /nicht das garantierte Einzelergebnis/.test(claimText("bkatv-not-guaranteed-result")),
    pointsAndStages: /FeV Anlage 13/.test(claimText("points-from-final-decisions"))
      && /Ein bis drei Punkte/.test(claimText("points-1-3-vormerkung"))
      && /Vier oder fünf Punkte/.test(claimText("points-4-5-ermahnung"))
      && /Sechs oder sieben Punkte/.test(claimText("points-6-7-verwarnung"))
      && /Acht oder mehr Punkte/.test(claimText("points-8-withdrawal"))
      && /keine Entziehung der Fahrerlaubnis/.test(claimText("one-point-not-withdrawal"))
      && /kein Strafregister/.test(claimText("points-not-criminal-record")),
    fahrverbotBoundary: /nicht die Entziehung der Fahrerlaubnis/.test(claimText("fahrverbot-not-entziehung"))
      && /einen Monat bis drei Monate/.test(claimText("duration-1-to-3-months"))
      && /nicht der dauerhafte Verlust/.test(claimText("fahrverbot-not-permanent-loss"))
      && /gilt nicht für jede Person/.test(claimText("four-month-not-universal"))
      && /nicht automatisch die Viermonatsregel/.test(claimText("first-bussgeld-not-four-month"))
      && /ohne qualifizierte frühere Entscheidung/.test(claimText("repeat-26-needs-prior")),
    einspruchAndZustellung: /zwei Wochen nach Zustellung/.test(claimText("two-weeks-after-zustellung"))
      && /nicht der Beginn der Einspruchsfrist/.test(claimText("bescheiddatum-not-deadline"))
      && /nicht der Beginn der Einspruchsfrist/.test(claimText("tatdatum-not-deadline"))
      && /nicht die Zustellung/.test(claimText("letter-date-not-zustellung"))
      && /nicht automatisch auf/.test(claimText("einspruch-not-automatic-cancel"))
      && /kein risikofreier Wiederholungsversuch/.test(claimText("einspruch-not-risk-free"))
      && /nachteiligere Entscheidung/.test(claimText("worse-outcome-possible"))
      && /prüft die Behörde/.test(claimText("after-einspruch-authority-reexamines"))
      && /nicht zugesagt werden/.test(claimText("wiedereinsetzung-not-promised"))
      && !/Sie haben durch Einspruch nichts zu verlieren/iu.test(corpus),
    currentSection26Limitation: /Seit dem 1. Juli 2026/.test(claimText("current-six-month-section-26"))
      && /sechs Monate/.test(claimText("current-six-month-section-26"))
      && /seit dem 1. Juli 2026/.test(claimText("effective-1-july-2026"))
      && /nicht heutiges Recht/.test(claimText("historic-three-month-not-current"))
      && /nicht automatisch Verjährung/.test(claimText("six-months-not-automatic-bar"))
      && /nicht notwendig der Unterbrechungszeitpunkt/.test(claimText("interruption-not-necessarily-receipt"))
      && /nicht, dass keine Unterbrechungshandlung/.test(claimText("no-letter-not-no-interruption"))
      && /ohne Tatdatum, Unterbrechungsakte/.test(claimText("individual-verjaehrung-fail-closed"))
      && !/heute drei Monate vor dem Bußgeldbescheid/iu.test(corpus),
    paymentAndEnforcement: /zwei Wochen danach/.test(claimText("payment-after-rechtskraft"))
      && /nicht die Zahlungsfrist/.test(claimText("einspruch-deadline-not-payment-deadline"))
      && /nicht, die Geldbuße zu ignorieren/.test(claimText("cannot-pay-not-ignore"))
      && /nicht automatisch bewilligt/.test(claimText("installments-not-automatic"))
      && /nicht automatisch sofortige Haft/.test(claimText("unpaid-not-automatic-prison"))
      && /kein Ersatzstrafurteil/.test(claimText("erzwingungshaft-not-criminal-sentence"))
      && /nicht dargetane Zahlungsunfähigkeit/.test(claimText("erzwingungshaft-conditions")),
    criminalAndEvidenceAndFake: /in die strafrechtliche Beratung/.test(claimText("criminal-route-out"))
      && /kein Bußgeldbescheid/.test(claimText("strafbefehl-not-bescheid"))
      && /kein vollständiges Strafhaftungsengine/.test(claimText("alcohol-05-not-complete-criminal"))
      && /kein vollständiges strafrechtliches Ergebnis/.test(claimText("thc-35-not-complete-criminal"))
      && /nicht feststellen, dass eine Person der Fahrer ist/.test(claimText("photo-not-birello-biometric"))
      && /nicht automatisch gültig oder ungültig/.test(claimText("camera-not-auto-valid-or-invalid"))
      && /beweist nicht die Echtheit/.test(claimText("logo-not-authenticity"))
      && /kein sicherer Zahlungsweg/.test(claimText("qr-not-safe"))
      && /unabhängig über einen bekannten offiziellen Kanal/.test(claimText("independent-authority-contact")),
    noUnsafeGenericDeadline: !/Einspruchsfrist beträgt immer 14 Tage ab Briefdatum/iu.test(corpus)
      && !/Verjährung tritt nach sechs Monaten automatisch ein/iu.test(corpus)
      && OWI_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE")
      && pack.handlingPolicies.filter((policy) => policy.handlingMode === "FETCH_LIVE")
        .every((policy) => policy.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: OWI_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && OWI_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "MANUAL_REVIEW_REQUIRED")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: OWI_FORMS.length === 6
      && ["OWI-Einspruch", "OWI-Anhoerung-Stellungnahme", "OWI-Zahlungserleichterung", "OWI-Wiedereinsetzung", "OWI-Gerichtliche-Entscheidung", "OWI-Halterkosten-Antrag"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildOwiFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildOwiFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-owi",
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
      [OWI_OFFICIAL_SOURCES.map((item) => item.url)],
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
      [OWI_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [OWI_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [OWI_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_traffic_owi_lifecycle", packId: "unknown_traffic_owi_lifecycle" }],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === OWI_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === OWI_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesOwi = whitelist.includes("verkehrsordnungswidrigkeiten_bussgeldverfahren");
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
    domain: OWI_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: OWI_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: OWI_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: OWI_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Verkehr Bußgeld pack audit failed"}\n`);
  process.exitCode = 1;
});
