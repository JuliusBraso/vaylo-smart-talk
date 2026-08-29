/**
 * Local Arbeitslosengeld / Agentur für Arbeit federal core pack audit.
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
  ALG_DOMAIN,
  ALG_FORMS,
  ALG_FUTURE_CHANGE_WATCH_ITEMS,
  ALG_FUTURE_WATCH_SOURCE,
  ALG_G3_PROCESS_STEP_LIMITATION,
  ALG_OFFICIAL_SOURCES,
  ALG_PROCESSES,
  ALG_UNITS,
  buildAlgFederalCorePack,
  evaluateAlgProcessCompleteness,
  algPackSummary,
} from "./arbeitslosengeld-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "alg_core";
const PASSWORD = `alg-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-alg-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "www.bmas.de",
  "www.arbeitsagentur.de",
  "eur-lex.europa.eu",
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
  const pack = buildAlgFederalCorePack();
  const summary = algPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateAlgProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "arbeitslosengeld", "arbeitslosengeld-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(ALG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(ALG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimIds = new Set(ingestibleClaimIds);
  const uniqueClaimKeys = new Set(ingestibleClaimKeys);
  const staticCases = {
    domainIdentity: pack.domain === ALG_DOMAIN && pack.packId === ALG_DOMAIN
      && ALG_DOMAIN === "arbeitslosengeld",
    structurallyValid: validation.valid,
    uniqueClaimIds: uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === ALG_UNITS.length
      && pack.claims.length === ALG_UNITS.length,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Arbeitslosengeld|Agentur|Widerspruch|Arbeitslosmeldung|Arbeitsuchend/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && ALG_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|gegen-hartz|hartziv.org|reddit/i.test(packSource),
    officialProvenanceComplete: pack.claims.length === pack.evidenceLinks.length
      && pack.claims.length === pack.citations.length
      && pack.sources.length === ALG_OFFICIAL_SOURCES.length,
    ingestibleCurrentClaimsOnly2026: pack.claims.length === ALG_UNITS.length
      && ALG_UNITS.length >= 110
      && ALG_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: ALG_FUTURE_CHANGE_WATCH_ITEMS.length === 2
      && ALG_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === ALG_FUTURE_WATCH_SOURCE.url
      && ALG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      ALG_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id)
        && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !ALG_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && !/user_locale/.test(packSource)
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    noAustriaOrV4Jurisdiction: !pack.jurisdictions.some((item) =>
      ["AT", "SK", "CZ", "PL", "HU", "DE-AT"].includes(String(item.code))),
    current2026Complete: pack.claims.length === ALG_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && claim.requiresEffectiveDate !== true
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === ALG_PROCESSES.length
      && pack.processes.length === 17
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && ALG_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 50
      && completeness.outOfScopeScenarioCount === 7
      && completeness.processCompletenessPercent === 100
      && completeness.rows.every((row) => row.satisfied && row.derived === row.coverage),
    arbeitsuchendVsArbeitslos: /nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung/u.test(claimText("arbeitsuchend-not-arbeitslos"))
      && /ersetzt die Arbeitslosmeldung nicht/u.test(claimText("arbeitsuchend-does-not-replace-arbeitslos"))
      && /nicht automatisch bewilligt/u.test(claimText("arbeitslos-not-automatic-approval"))
      && /nicht dieselbe Rechtshandlung wie die Arbeitslosmeldung/u.test(claimText("application-not-same-as-meldung")),
    hoursVsIncome: /weniger als 15 Stunden/u.test(claimText("under-15-hours-not-destroy"))
      && /kein Einkommensstest/u.test(claimText("fifteen-hours-not-income-test"))
      && /zusammengerechnet/u.test(claimText("multiple-jobs-aggregated"))
      && /getrennt zu prüfen/u.test(claimText("nebenjob-hours-test-separate"))
      && /nicht automatisch die Stundengrenze/u.test(claimText("low-income-not-hours")),
    anwartschaftRahmenfrist: /30-monatigen Rahmenfrist/u.test(claimText("anwartschaft-12-in-30"))
      && /zwölf Monate/u.test(claimText("anwartschaft-12-in-30"))
      && /verkürzt/u.test(claimText("shortened-6-months-short-fixed"))
      && /nicht automatisch einen Anspruch auf Arbeitslosengeld/u.test(claimText("worked-germany-not-automatic")),
    amountAndDurationGuards: /nicht das letzte Nettogehalt/u.test(claimText("last-salary-not-alg-amount"))
      && /nicht 60 Prozent oder 67 Prozent des letzten Nettogehalts/u.test(claimText("sixty-not-last-net"))
      && /nicht berechnet werden/u.test(claimText("individual-amount-fail-closed"))
      && /nicht entschieden werden/u.test(claimText("individual-duration-fail-closed"))
      && /nicht automatisch zwölf Monate Arbeitslosengeld/u.test(claimText("twelve-months-employed-not-twelve-alg")),
    sperrzeitVsRuhen: /nicht dasselbe wie eine Sperrzeit/u.test(claimText("ruhe-not-sperrzeit"))
      && /keine automatische Sperrzeit/u.test(claimText("abfindung-not-automatic-sperrzeit"))
      && /nicht automatisch den Verlust/u.test(claimText("abfindung-not-automatic-loss"))
      && /nicht automatisch eine Sperrzeit/u.test(claimText("eigenkuendigung-not-automatic-sperrzeit"))
      && /nicht automatisch eine Sperrzeit/u.test(claimText("aufhebung-not-automatic-sperrzeit"))
      && /nicht derselbe Verwaltungsakt wie ein Sperrzeitbescheid/u.test(claimText("anhoerung-not-sperrzeitbescheid"))
      && /eine Woche/u.test(claimText("sperrzeit-late-arbeitsuchend-1-week"))
      && /eine Woche/u.test(claimText("missed-appointment-not-total-loss")),
    bescheidBekanntgabeWiderspruch: /nicht automatisch ein Verwaltungsakt/u.test(claimText("letter-not-automatically-bescheid"))
      && /keine Empfehlung, Widerspruch einzulegen/u.test(claimText("do-not-auto-recommend-widerspruch"))
      && /nicht ohne weiteres der Tag der Bekanntgabe/u.test(claimText("bekanntgabe-not-document-date"))
      && /nicht automatisch aufschiebende Wirkung/u.test(claimText("widerspruch-not-automatic-suspension")),
    illnessKrankengeldInterface: /längstens sechs Wochen/u.test(claimText("illness-alg-up-to-six-weeks"))
      && /nicht automatisch das sofortige Ende/u.test(claimText("illness-not-immediate-end"))
      && /nicht vom ersten Tag an Krankengeld/u.test(claimText("six-weeks-not-day-one-krankengeld"))
      && /gesonderte Krankenversicherungspaket/u.test(claimText("health-domain-is-separate")),
    agenturJobcenterSeparation: /nicht das Jobcenter/u.test(claimText("agentur-not-jobcenter"))
      && /nicht Grundsicherungsgeld/u.test(claimText("alg-not-grundsicherungsgeld"))
      && /SGB II/u.test(claimText("sgb3-not-sgb2")),
    u1U2AndForeignFailClosed: /nicht dasselbe Dokument/u.test(claimText("u1-not-u2"))
      && /nicht dieselbe Genehmigung wie eine inländische Ortsabwesenheit/u.test(claimText("u2-not-ordinary-travel"))
      && /nicht dasselbe wie ein PD U2/u.test(claimText("domestic-absence-not-u2"))
      && /nicht vereinfacht entschieden/u.test(claimText("cross-border-fail-closed"))
      && /nicht vereinfacht entschieden/u.test(claimText("grenzgaenger-competence-fail-closed"))
      && /nicht automatisch/u.test(claimText("nationality-not-automatic"))
      && /nicht automatisch ausgeschlossen/u.test(claimText("foreign-nationality-not-exclusion"))
      && pack.actorRules.some((rule) => rule.actorState === "cross_border_unemployment_state_undetermined"),
    competenceFailClosed: /weder die zuständige Agentur/u.test(claimText("userlocale-not-jurisdiction"))
      && /Dokumentsprache bestimmt nicht/u.test(claimText("language-not-jurisdiction"))
      && /keine bestimmte örtliche Agentur/u.test(claimText("no-hardcoded-local-agentur"))
      && /live zu prüfen/u.test(claimText("opening-hours-are-live"))
      && pack.actorRules.some((rule) => rule.actorState === "competent_agentur_undetermined_without_locality"),
    freshnessModesPresent: ALG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && ALG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && ALG_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    noUnsafeTimelessOperationalValues: !/bundesweite Einheitsedeagentur|eine einzige bundesweite Agentur für Arbeit/i.test(corpus)
      && /Dienststellensuche/u.test(claimText("find-agentur-via-dienststellensuche"))
      && ALG_OFFICIAL_SOURCES.filter((item) => item.handlingMode === "FETCH_LIVE")
        .every((item) => item.staleBehavior === "REVALIDATE_BEFORE_USE"),
    formsRepresented: ALG_FORMS.length === 5
      && ["ALG-Arbeitsuchendmeldung", "ALG-Arbeitslosmeldung", "ALG-Antrag", "ALG-Veraenderungsmitteilung", "SGG-Widerspruch"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildAlgFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildAlgFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-arbeitslosengeld",
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
      [ALG_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Anspruchsdauer nach § 147 SGB III für 2027%'
           or claim_text_canonical ilike '%künftiger anderer Freibetrag%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [ALG_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [ALG_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [ALG_FORMS.map((item) => item.identifier)],
    );
    const domainWhitelist = await admin.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === ALG_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === ALG_UNITS.length;
    live.zeroFutureClaimsCreated = Number(futureCreated.rows[0]?.n) === 0;
    live.processBindingsSurvived = Number(processesIngested.rows[0]?.n) === pack.processes.length
      && Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length
      && Number(formsIngested.rows[0]?.n) === pack.forms.length;
    live.domainWhitelistIncludesAlg = String(domainWhitelist.rows[0]?.value).includes("arbeitslosengeld");
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
    domain: ALG_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: ALG_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: ALG_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: completeness,
    g3ProcessStepLimitation: ALG_G3_PROCESS_STEP_LIMITATION,
    temporalG3EffectiveDatePassthroughImplemented: false,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    standaloneFirstContactModeIntroduced: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Arbeitslosengeld pack audit failed"}\n`);
  process.exitCode = 1;
});
