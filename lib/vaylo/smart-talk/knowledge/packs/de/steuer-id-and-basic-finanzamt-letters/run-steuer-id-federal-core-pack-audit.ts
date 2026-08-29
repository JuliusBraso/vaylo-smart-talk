/**
 * KNOWLEDGE-EXPANSION-02 — local Steuer-ID / basic Finanzamt letters
 * federal core pack audit.
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
  STEUER_ID_DOMAIN,
  STEUER_ID_FORMS,
  STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS,
  STEUER_ID_FUTURE_WATCH_SOURCE,
  STEUER_ID_G3_PROCESS_STEP_LIMITATION,
  STEUER_ID_OFFICIAL_SOURCES,
  STEUER_ID_PROCESSES,
  STEUER_ID_UNITS,
  buildSteuerIdFederalCorePack,
  evaluateSteuerIdProcessCompleteness,
  steuerIdPackSummary,
} from "./steuer-id-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "steuer_id_core";
const PASSWORD = `sid-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-steuer-id-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "www.bzst.de",
  "www.elster.de",
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
  const pack = buildSteuerIdFederalCorePack();
  const summary = steuerIdPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateSteuerIdProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "steuer-id-and-basic-finanzamt-letters", "steuer-id-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const staticCases = {
    domainReused: pack.domain === STEUER_ID_DOMAIN && pack.packId === STEUER_ID_DOMAIN
      && STEUER_ID_DOMAIN === "steuer_id_and_basic_finanzamt_letters",
    structurallyValid: validation.valid,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Steuer|Finanzamt|IdNr|Einspruch|Bekanntgabe/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && STEUER_ID_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|steuerklassen|smartsteuer|finanztip|reddit/i.test(packSource),
    ingestibleCurrentClaimsOnly2026: pack.claims.length === STEUER_ID_UNITS.length
      && STEUER_ID_UNITS.length >= 60
      && STEUER_ID_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.length === 2
      && STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.officialSourceUrl === STEUER_ID_FUTURE_WATCH_SOURCE.url
        && item.officialDomain === "www.bzst.de"
        && item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id)
        && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !STEUER_ID_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && !/user_locale/.test(packSource)
      && /userLocale/.test(claimText("competence-not-from-locale-or-language")),
    noAustriaOrV4Jurisdiction: !pack.jurisdictions.some((item) =>
      ["AT", "SK", "CZ", "PL", "HU", "DE-AT"].includes(String(item.code))),
    current2026Complete: pack.claims.length === STEUER_ID_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && claim.requiresEffectiveDate !== true
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === STEUER_ID_PROCESSES.length
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && STEUER_ID_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 40
      && completeness.outOfScopeScenarioCount === 9
      && completeness.rows.every((row) => row.satisfied && row.derived === row.coverage),
    identifierDistinction: /nicht dieselbe Nummer wie die Steuernummer/u.test(claimText("idnr-not-steuernummer"))
      && /nicht die Wirtschafts-Identifikationsnummer/u.test(claimText("idnr-not-widnr"))
      && /kein universelles lebenslanges Personenkennzeichen/u.test(claimText("steuernummer-not-lifelong-personal-id"))
      && /kein stilles Ersatzmerkmal/u.test(claimText("widnr-only-for-wirtschaftlich-taetige"))
      && /nicht automatisch die IdNr/u.test(claimText("aktenzeichen-not-automatically-idnr"))
      && /nicht automatisch die Steuernummer/u.test(claimText("aktenzeichen-not-automatically-steuernummer")),
    einspruchDoesNotStayPayment: /nicht gehemmt/u.test(claimText("einspruch-does-not-stay-payment"))
      && /nicht dasselbe/u.test(claimText("adv-is-separate"))
      && /keine Empfehlung, Einspruch einzulegen/u.test(claimText("do-not-auto-recommend-einspruch")),
    bekanntgabeSafety: /nicht ohne weiteres der Tag der Bekanntgabe/u.test(claimText("document-date-not-bekanntgabe"))
      && /darf nicht berechnet werden/u.test(claimText("individualized-deadline-needs-facts"))
      && /keine Feststellung der steuerlichen Ansässigkeit/u.test(claimText("abroad-one-month-after-post")),
    competenceFailClosed: /kein bundesweit einheitliches Finanzamt/u.test(claimText("finanzamt-are-land-local-authorities"))
      && /userLocale/u.test(claimText("competence-not-from-locale-or-language"))
      && /kein bestimmtes Finanzamt/u.test(claimText("insufficient-facts-no-office"))
      && pack.actorRules.some((rule) => rule.actorState === "competent_finanzamt_undetermined_without_facts"),
    crossBorderFailClosed: /begründet keine steuerliche Ansässigkeit/u.test(claimText("foreign-address-bekanntgabe-abroad-rule"))
      && /nicht die steuerliche Ansässigkeit/u.test(claimText("foreign-address-not-tax-residence"))
      && /nicht abschließend beantwortet/u.test(claimText("unsupported-personalized-tax-fail-closed"))
      && pack.actorRules.some((rule) => rule.actorState === "cross_border_tax_outcome_undetermined"),
    schaetzungAndFilingRemain: /bleibt auch dann bestehen/u.test(claimText("schaetzung-does-not-end-filing-duty"))
      && /keine Strategie/u.test(claimText("ignore-schaetzung-is-not-strategy")),
    verspaetungDistinctFromSaeumnis: /kein Zuschlag für verspätete Zahlung/u.test(claimText("verspaetung-is-late-filing"))
      && /verschiedene Rechtsfolgen/u.test(claimText("verspaetung-not-saeumnis"))
      && /nicht dasselbe wie späte Zahlung/u.test(claimText("verspaetung-not-saeumnis"))
      && /von der verspäteten Abgabe/u.test(claimText("late-payment-not-late-filing")),
    evidenceNegativeControls: /nicht automatisch ein Steuerbescheid/u.test(claimText("evidence-request-not-assessment"))
      && /nicht automatisch ein Verspätungszuschlag/u.test(claimText("evidence-request-not-penalty"))
      && /keine Ablehnung/u.test(claimText("evidence-request-not-rejection")),
    noUniversalPaymentDeadline: /keine universelle Zahlungsfrist/u.test(claimText("est-abschlusszahlung-not-universal-deadline"))
      && /Nicht jedes Schreiben des Finanzamts begründet eine Zahlungspflicht/u.test(claimText("finanzamt-letter-not-automatically-payment")),
    noNationwideFinanzamt: !/Bundesfinanzamt|einheitliches bundesweites Finanzamt als zuständige Stelle für alle/i.test(corpus)
      && /örtliche Landesfinanzbehörden/u.test(claimText("finanzamt-are-land-local-authorities")),
    formsRepresented: STEUER_ID_FORMS.length === 6
      && ["ELSTER-Einspruch", "ELSTER-Einspruch-ergaenzen", "ELSTER-Einspruch-zuruecknehmen", "ELSTER-Belegnachreichung", "ELSTER-Sonstige-Nachricht", "BZSt-IdNr-Mitteilung"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildSteuerIdFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildSteuerIdFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-02-steuer-id",
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
      [STEUER_ID_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%4. Quartal 2027%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [STEUER_ID_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [STEUER_ID_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [STEUER_ID_FORMS.map((item) => item.identifier)],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === STEUER_ID_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === STEUER_ID_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
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
    domain: STEUER_ID_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: STEUER_ID_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: STEUER_ID_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: completeness,
    g3ProcessStepLimitation: STEUER_ID_G3_PROCESS_STEP_LIMITATION,
    temporalG3EffectiveDatePassthroughImplemented: false,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    standaloneFirstContactModeIntroduced: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Steuer-ID pack audit failed"}\n`);
  process.exitCode = 1;
});
