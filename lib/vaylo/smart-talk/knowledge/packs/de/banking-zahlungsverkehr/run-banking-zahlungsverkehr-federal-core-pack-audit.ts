/**
 * Local retail-banking / Zahlungsverkehr federal core pack audit.
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
  BNK_DOMAIN,
  BNK_FORMS,
  BNK_FUTURE_CHANGE_WATCH_ITEMS,
  BNK_FUTURE_WATCH_SOURCE,
  BNK_G3_PROCESS_STEP_LIMITATION,
  BNK_OFFICIAL_SOURCES,
  BNK_PROCESSES,
  BNK_PROCESS_SCENARIOS,
  BNK_UNITS,
  buildBnkFederalCorePack,
  evaluateBnkProcessCompleteness,
  bnkPackSummary,
} from "./banking-zahlungsverkehr-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "bnk_core";
const PASSWORD = `bnk-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-bnk-${process.pid}-${randomUUID().slice(0, 8)}`;
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
] as const;
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SERVICE_RPC = "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) as result";
const OFFICIAL_HOSTS = new Set([
  "www.gesetze-im-internet.de",
  "www.bafin.de",
  "www.bundesbank.de",
  "bankenombudsmann.de",
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
  const pack = buildBnkFederalCorePack();
  const summary = bnkPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateBnkProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "banking-zahlungsverkehr", "banking-zahlungsverkehr-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(BNK_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(BNK_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const uniqueClaimTexts = new Set(pack.claims.map((claim) => String(claim.text)));
  const uniqueSourceUrls = new Set(BNK_OFFICIAL_SOURCES.map((item) => item.url));
  const staticCases = {
    domainIdentity: pack.domain === BNK_DOMAIN && pack.packId === BNK_DOMAIN
      && BNK_DOMAIN === "banking_zahlungsverkehr",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === BNK_UNITS.length
      && uniqueClaimTexts.size === pack.claims.length
      && pack.claims.length === BNK_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Konto|Zahlung|Bank|Überweisung|Lastschrift|Autorisierung|IBAN|Karte|TAN|PIN|BaFin|Basiskonto|P-Konto|Schlichtung|SEPA|VoP|Haftung|Erstattung|Frist|Beschwerde|Sperre|Kündigung|Betrug|Euro|Monat|Visa|Entgelt|Gesetz|Dispo|Preis/iu.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && BNK_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === BNK_OFFICIAL_SOURCES.length,
    noUnofficialSources: !/wikipedia|reddit|check24|verivox|anwalt\.de|finanztip|vergleichsportal|fintech-blog/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === BNK_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === BNK_UNITS.length
      && BNK_UNITS.length >= 120
      && BNK_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: BNK_FUTURE_CHANGE_WATCH_ITEMS.length === 4
      && BNK_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === BNK_FUTURE_WATCH_SOURCE.url
      && BNK_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      BNK_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id))
      && !BNK_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    current2026Complete: pack.claims.length === BNK_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === BNK_PROCESSES.length
      && pack.processes.length === 34
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && BNK_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 50
      && completeness.outOfScopeScenarioCount === 15
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && (
        row.derived === row.coverage
        || (row.coverage === "EXPLICITLY_OUT_OF_SCOPE" && row.derived === "EXPLICITLY_OUT_OF_SCOPE")
      )),
    authorizationGate: /nur wirksam, wenn er autorisiert/.test(claimText("authorization-required"))
      && /nicht automatisch eine unautorisierte Zahlung/.test(claimText("money-left-not-unauthorized"))
      && /nicht automatisch, dass die Zahlung rechtlich unautorisiert/.test(claimText("fraud-not-automatically-unauthorized"))
      && /nicht automatisch unter § 675u/.test(claimText("deceived-not-automatically-675u"))
      && /ohne weitere Tatsachen nicht abschließend/.test(claimText("unclear-authorization-fail-closed")),
    authorizedScamNotUnauthorized: /nicht automatisch ein unautorisierter Vorgang/.test(claimText("scam-transfer-not-automatically-675u"))
      && /weder Erstattung zugesagt noch grobe Fahrlässigkeit/.test(claimText("do-not-blame-or-promise-scam")),
    section675uRefund: /spätestens bis zum Ende des folgenden Geschäftstags/.test(claimText("section-675u-refund"))
      && /nicht unbegrenzt zuwarten/.test(claimText("unauthorized-not-indefinite-wait"))
      && /nicht zuerst beim Händler/.test(claimText("no-merchant-first-default"))
      && /nicht die gesetzliche Voraussetzung/.test(claimText("police-not-prerequisite")),
    section675vLiability: /Haftung bis 50 Euro/.test(claimText("fifty-euro-cap"))
      && /kein automatischer Selbstbehalt/.test(claimText("fifty-not-automatic-deductible"))
      && /nicht automatisch grobe Fahrlässigkeit/.test(claimText("phishing-not-automatically-gross"))
      && /nicht mehr für spätere Missbräuche/.test(claimText("post-block-no-liability")),
    section675wProof: /beweist nicht automatisch die Autorisierung/.test(claimText("auth-record-not-authorization"))
      && /unterstützende Beweismittel/.test(claimText("supporting-evidence-required"))
      && /TAN beweist nicht automatisch/.test(claimText("tan-not-automatically-authorized")),
    section676bNotification: /unverzüglich nach Feststellung/.test(claimText("notify-without-delay-676b"))
      && /13 Monate nach Belastung/.test(claimText("thirteen-months-outer"))
      && /keine Empfehlung, 13 Monate zu warten/.test(claimText("thirteen-not-wait-advice"))
      && /nicht die Achtwochenfrist/.test(claimText("thirteen-not-eight-weeks")),
    lastschriftDistinction: /acht Wochen ab Belastung/.test(claimText("eight-week-authorized-debit"))
      && /nicht die Außenfrist unautorisierter/.test(claimText("eight-not-unauthorized-outer"))
      && /nicht automatisch die zugrunde liegende Forderung/.test(claimText("reversal-not-debt-gone"))
      && /keine Überweisung/.test(claimText("lastschrift-not-transfer")),
    transferIrreversibility: /nicht frei widerruflich/.test(claimText("transfer-not-freely-reversible"))
      && /keine garantierte Rückholung/.test(claimText("storno-not-guaranteed"))
      && /nicht automatisch eine unautorisierte Zahlung/.test(claimText("wrong-iban-not-unauthorized"))
      && /um Wiedererlangung bemühen/.test(claimText("wrong-iban-recovery-duty")),
    vopCurrentRule: /9. Oktober 2025/.test(claimText("vop-since-2025"))
      && /nicht, dass der Empfänger vertrauenswürdig/.test(claimText("vop-match-not-trust"))
      && /keine Betrugsvollkasko/.test(claimText("vop-not-fraud-insurance"))
      && /nicht der normale VoP-Ablauf/.test(claimText("email-vop-not-normal")),
    instantNotReversible: /nicht deshalb frei widerruflich/.test(claimText("instant-not-reversible")),
    cardUnauthorizedVsChargeback: /nicht die gesetzliche Erstattung nach § 675u/.test(claimText("chargeback-not-675u"))
      && /nicht automatisch eine unautorisierte Kartenzahlung/.test(claimText("merchant-dispute-not-unauthorized"))
      && /nicht deutsches Gesetzesrecht/.test(claimText("scheme-not-statute"))
      && /nicht die endgültige Belastung/.test(claimText("reservation-not-final-debit")),
    accountChangeAndTermination: /mindestens zwei Monate vorher/.test(claimText("two-month-change-notice"))
      && /nicht die universelle Zustimmung/.test(claimText("silence-not-universal-consent"))
      && /mindestens zwei Monaten Frist kündigen/.test(claimText("provider-two-months"))
      && /nicht das Basiskonto-Kündigungsregime/.test(claimText("giro-not-basiskonto-termination")),
    basiskontoSpecial: /Basiskonto verlangen/.test(claimText("basiskonto-claim"))
      && /nicht automatisch ein kostenloses Konto/.test(claimText("basiskonto-not-free"))
      && /keinen automatischen Dispoanspruch/.test(claimText("basiskonto-not-dispo"))
      && /nicht aus beliebigem Grund ablehnen/.test(claimText("basiskonto-not-any-reason-refuse"))
      && /besonderen Gründen des § 42 ZKG/.test(claimText("basiskonto-special-termination")),
    basiskontoSection38NoCreditEntitlement:
      BNK_OFFICIAL_SOURCES.some((item) => item.key === "zkg-38" && item.url === "https://www.gesetze-im-internet.de/zkg/__38.html")
      && /gesetzlich vorgeschriebenen Basiskontodienste nach § 38 ZKG enthalten kein Kreditgeschäft/.test(claimText("basiskonto-section-38-no-credit"))
      && /begründen keinen Kredit- oder Dispoanspruch/.test(claimText("basiskonto-section-38-no-credit")),
    basiskontoSection39AgreedOverdraft:
      BNK_OFFICIAL_SOURCES.some((item) => item.key === "zkg-39" && item.url === "https://www.gesetze-im-internet.de/zkg/__39.html")
      && /§ 39 ZKG dürfen Bank und Kontoinhaber zusätzlich/.test(claimText("basiskonto-section-39-agreed-overdraft"))
      && /eingeräumte Überziehung nach § 504 BGB/.test(claimText("basiskonto-section-39-agreed-overdraft"))
      && /geduldete Überziehung nach § 505 BGB/.test(claimText("basiskonto-section-39-agreed-overdraft")),
    basiskontoNotCategoricalDispoBan: /kein gesetzliches Verbot eines vereinbarten Dispos/.test(claimText("basiskonto-not-dispo-prohibition"))
      && /nicht zum gesetzlichen Mindestumfang/.test(claimText("agreed-dispo-not-statutory-basiskonto"))
      && /keinen Dispo einräumen/.test(claimText("bank-need-not-grant-basiskonto-dispo"))
      && !/Basiskonto ist gesetzlich vom Dispo ausgeschlossen/u.test(corpus)
      && !/kein Gratis- oder Dispokonto/u.test(corpus),
    consumerCreditRemainsOutOfScope: /außerhalb dieses Kerns/.test(claimText("loan-out-of-scope"))
      && BNK_PROCESS_SCENARIOS.some((scenario) =>
        scenario.id === "consumer-loan-dispute" && scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE")
      && BNK_PROCESS_SCENARIOS.some((scenario) =>
        scenario.id === "complete-dispo-affordability" && scenario.coverage === "EXPLICITLY_OUT_OF_SCOPE"),
    pkontoBoundary: /nur ein Pfändungsschutzkonto/.test(claimText("pkonto-one-account"))
      && /auch bei negativem Saldo/.test(claimText("pkonto-negative-possible"))
      && /nicht automatisch jedes Guthaben/.test(claimText("pkonto-not-all-protected"))
      && /lässt die Schuld nicht entfallen/.test(claimText("pkonto-not-debt-gone"))
      && /nicht als zeitlose Werte/.test(claimText("pkonto-amounts-not-timeless")),
    complaintRouter: /einen einzigen Ombudsmann/.test(claimText("not-one-ombudsman-all-banks"))
      && /nicht automatisch für Sparkassen/.test(claimText("private-ombud-not-sparkasse"))
      && /Auffangzuständigkeit/.test(claimText("bundesbank-is-fallback"))
      && /keine bindende Erstattungsanordnung/.test(claimText("bafin-not-refund-order"))
      && /Fristen weiter/.test(claimText("bafin-deadlines-continue")),
    phishingAndSecretSafety: /nicht die Echtheit einer Bankmail/.test(claimText("logo-not-authenticity"))
      && /weder an BIRELLO noch an angebliche Helfer/.test(claimText("never-share-pin-tan"))
      && /keine Bankanmeldeoberfläche/.test(claimText("birello-not-login"))
      && /dürfen nicht angefordert oder gespeichert/.test(claimText("never-store-secrets"))
      && !/Geben Sie Ihre TAN an BIRELLO/u.test(corpus)
      && !/PIN an uns senden/u.test(corpus),
    noUnsafeGenericDeadline: !/Bankfrist beträgt immer 8 Wochen/u.test(corpus)
      && !/Bankfrist beträgt immer 13 Monate/u.test(corpus)
      && BNK_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    freshnessModesPresent: BNK_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && BNK_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && BNK_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    formsRepresented: BNK_FORMS.length === 6
      && ["BNK-Bankbeschwerde", "BNK-Sperre-Verlustanzeige", "BNK-Lastschrifterstattung", "BNK-Ombudsmann-Private-Banken", "BNK-Bundesbank-Schlichtung", "BAFIN-Verbraucherbeschwerde"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildBnkFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildBnkFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-bnk",
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
      [BNK_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%9. Juli 2027%'
           or claim_text_canonical ilike '%PSD3/PSR%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [BNK_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [BNK_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [BNK_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const unknownRejected = await ingestor.query(
      `select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result`,
      [{ ...pack, domain: "unknown_banking_lifecycle", packId: "unknown_banking_lifecycle" }],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === BNK_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === BNK_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.priorDomainsPreserved = PRIOR_DOMAINS.every((domain) => whitelist.includes(domain));
    live.domainWhitelistIncludesBanking = whitelist.includes("banking_zahlungsverkehr");
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
    domain: BNK_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: BNK_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: BNK_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    g3ProcessStepLimitation: BNK_G3_PROCESS_STEP_LIMITATION,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Banking Zahlungsverkehr pack audit failed"}\n`);
  process.exitCode = 1;
});
