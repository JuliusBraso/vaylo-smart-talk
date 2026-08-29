/**
 * Local Jobcenter / Grundsicherungsgeld federal core pack audit.
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
  JOBCENTER_DOMAIN,
  JOBCENTER_FORMS,
  JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS,
  JOBCENTER_FUTURE_WATCH_SOURCE,
  JOBCENTER_G3_PROCESS_STEP_LIMITATION,
  JOBCENTER_OFFICIAL_SOURCES,
  JOBCENTER_PROCESSES,
  JOBCENTER_UNITS,
  buildJobcenterFederalCorePack,
  evaluateJobcenterProcessCompleteness,
  jobcenterPackSummary,
} from "./jobcenter-federal-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "jobcenter_core";
const PASSWORD = `jc-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-jobcenter-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "www.bmas.de",
  "www.arbeitsagentur.de",
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
  const pack = buildJobcenterFederalCorePack();
  const summary = jobcenterPackSummary(pack);
  const validation = validateCuratedDomainPack(pack);
  const completeness = evaluateJobcenterProcessCompleteness(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "jobcenter-grundsicherungsgeld", "jobcenter-federal-core-pack.ts",
  );
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const watchIds = new Set(JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id));
  const watchKeys = new Set(JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.key));
  const ingestibleClaimKeys = pack.claims.map((claim) => String(claim.key));
  const ingestibleClaimIds = pack.claims.map((claim) => String(claim.id));
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const staticCases = {
    domainReused: pack.domain === JOBCENTER_DOMAIN && pack.packId === JOBCENTER_DOMAIN
      && JOBCENTER_DOMAIN === "jobcenter_buergergeld",
    structurallyValid: validation.valid,
    germanCanonicalOnly: pack.canonicalLanguage === "de"
      && pack.claims.every((claim) => /[äöüÄÖÜß]|Grundsicherungsgeld|Jobcenter|Widerspruch|Bedarfsgemeinschaft|Bürgergeld|Leistungsminderung/u.test(String(claim.text))),
    officialHostsOnly: pack.sources.every((item) => OFFICIAL_HOSTS.has(String(item.officialDomain)))
      && JOBCENTER_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain)),
    noUnofficialSources: !/wikipedia|forum|blog|gegen-hartz|hartziv.org|reddit/i.test(packSource),
    ingestibleCurrentClaimsOnly2026: pack.claims.length === JOBCENTER_UNITS.length
      && JOBCENTER_UNITS.length >= 90
      && JOBCENTER_UNITS.every((unit) => unit.temporal === "current_2026"),
    futureWatchOfficialProvenance: JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.length === 2
      && JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS[0]?.officialSourceUrl === JOBCENTER_FUTURE_WATCH_SOURCE.url
      && JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        item.status === "future_change_watch_not_ingestible"
        && item.currentGuidance === false),
    futureWatchStructurallyExcluded:
      JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.every((item) =>
        !ingestibleClaimKeys.includes(item.key)
        && !ingestibleClaimIds.includes(item.id)
        && !watchIds.has(String(pack.claims.find((claim) => claim.key === item.key)?.id)))
      && !JOBCENTER_UNITS.some((unit) => watchKeys.has(unit.key)),
    noLanguageDuplication: !/canonicalLanguage["']:\s*["'](en|sk|cs|pl|hu)/.test(packSource)
      && pack.claims.every((claim) => typeof claim.text === "string"),
    localeCannotSelectJurisdiction: pack.jurisdictions.length === 1
      && pack.jurisdictions[0]?.code === "DE"
      && pack.jurisdictions[0]?.level === "de_federal"
      && !/user_locale/.test(packSource)
      && /userLocale/.test(claimText("userlocale-not-jurisdiction")),
    noAustriaOrV4Jurisdiction: !pack.jurisdictions.some((item) =>
      ["AT", "SK", "CZ", "PL", "HU", "DE-AT"].includes(String(item.code))),
    current2026Complete: pack.claims.length === JOBCENTER_UNITS.length
      && pack.claims.every((claim) =>
        claim.temporalClass === "current_2026"
        && claim.requiresEffectiveDate !== true
        && !watchKeys.has(String(claim.key))),
    currentProcessesOnly2026: pack.processes.length === JOBCENTER_PROCESSES.length
      && pack.processes.every((process) => String(process.title).includes("2026")),
    processGraphUsesFactoryBindings: pack.processClaimLinks.length > 0
      && pack.processClaimLinks.every((link) =>
        pack.processes.some((process) => process.id === link.processId)
        && pack.claims.some((claim) => claim.id === link.claimId))
      && JOBCENTER_G3_PROCESS_STEP_LIMITATION.includes("process_step_id null"),
    processCompletenessCovered: completeness.blockedScenarioCount === 0
      && completeness.coveredScenarioCount >= 50
      && completeness.outOfScopeScenarioCount === 7
      && completeness.rows.every((row) => row.satisfied && row.derived === row.coverage),
    terminology2026: /Grundsicherungsgeld/u.test(claimText("gsg-is-current-term"))
      && /1\. Juli 2026/u.test(claimText("gsg-is-current-term"))
      && /Bürgergeld/u.test(claimText("buergergeld-is-legacy-term"))
      && /nicht automatisch ungültig/u.test(claimText("buergergeld-wording-not-invalid"))
      && /keinen neuen Erstantrag/u.test(claimText("no-new-application-for-existing-recipients")),
    eligibilityNegativeControls: /nicht automatisch einen Anspruch auf Grundsicherungsgeld/u.test(claimText("unemployed-not-automatically-entitled"))
      && /nicht automatisch vom Grundsicherungsgeld ausgeschlossen/u.test(claimText("employed-not-automatically-excluded"))
      && /nicht allein wegen des Wohnsitzes in Deutschland/u.test(claimText("residence-not-automatic-entitlement"))
      && /nicht automatisch ein bestimmtes Leistungsergebnis/u.test(claimText("married-not-automatic-result"))
      && /nicht automatisch eine Bedarfsgemeinschaft/u.test(claimText("same-address-not-enough-for-household"))
      && /nicht automatisch, dass kein Anspruch/u.test(claimText("income-not-automatic-exclusion")),
    foreignFailClosed: /nicht automatisch vom Grundsicherungsgeld aus/u.test(claimText("foreign-nationality-not-automatic-exclusion"))
      && /nicht automatisch einen Anspruch auf Grundsicherungsgeld/u.test(claimText("eu-citizenship-not-automatic-entitlement"))
      && /nicht vereinfacht entschieden/u.test(claimText("cross-border-fail-closed"))
      && /userLocale/u.test(claimText("userlocale-not-jurisdiction"))
      && /Dokumentsprache bestimmt nicht/u.test(claimText("language-not-jurisdiction"))
      && pack.actorRules.some((rule) => rule.actorState === "foreign_status_undetermined"),
    minderungSafety: /nicht automatisch den sofortigen vollständigen Wegfall/u.test(claimText("missed-appointment-not-automatic-total-loss"))
      && /nicht derselbe Verwaltungsakt wie ein Minderungsbescheid/u.test(claimText("anhoerung-not-minderungsbescheid"))
      && /kein automatischer Minderungsbescheid/u.test(claimText("letter-not-automatic-sanction"))
      && /30 Prozent/u.test(claimText("pflichtverletzung-30-percent-3-months"))
      && /noch keine Leistungsminderung/u.test(claimText("first-missed-appointment-no-minderung")),
    widerspruchSafety: /nicht automatisch ein Verwaltungsakt/u.test(claimText("letter-not-automatically-bescheid"))
      && /keine Empfehlung, Widerspruch einzulegen/u.test(claimText("do-not-auto-recommend-widerspruch"))
      && /nicht ohne weiteres der Tag der Bekanntgabe/u.test(claimText("bekanntgabe-not-document-date"))
      && /nicht automatisch aufschiebende Wirkung/u.test(claimText("widerspruch-not-automatic-suspension")),
    housingAndAmountGuards: /keine zeitlose bundesrechtliche Eurokonstante/u.test(claimText("no-federal-kdu-euro"))
      && /keine zeitlose Rechtsgröße/u.test(claimText("regelbedarf-is-annual-not-timeless"))
      && /nicht automatisch die Anerkennung/u.test(claimText("moving-not-automatic-approval"))
      && /nicht automatisch den sofortigen vollständigen Wegfall der Unterkunftsleistung/u.test(claimText("high-rent-not-automatic-total-loss"))
      && /nicht automatisch das sofortige Ende/u.test(claimText("start-job-not-automatic-end"))
      && /nicht berechnet werden/u.test(claimText("no-individual-amount")),
    competenceFailClosed: /weder die Zuständigkeit/u.test(claimText("userlocale-not-jurisdiction"))
      && /kein bestimmtes örtliches Jobcenter/u.test(claimText("no-hardcoded-local-jobcenter"))
      && /live zu prüfen/u.test(claimText("opening-hours-are-live"))
      && pack.actorRules.some((rule) => rule.actorState === "competent_jobcenter_undetermined_without_locality"),
    freshnessModesPresent: JOBCENTER_OFFICIAL_SOURCES.some((item) => item.handlingMode === "STORE_CANONICALLY")
      && JOBCENTER_OFFICIAL_SOURCES.some((item) => item.handlingMode === "CACHE_AND_REVALIDATE")
      && JOBCENTER_OFFICIAL_SOURCES.some((item) => item.handlingMode === "FETCH_LIVE")
      && pack.handlingPolicies.some((policy) => policy.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    noNationwideJobcenter: !/bundesweites Einheitsjobcenter|eine einzige bundesweite Jobcenter-Stelle/i.test(corpus)
      && /Dienststellensuche/u.test(claimText("find-jobcenter-via-dienststellensuche")),
    formsRepresented: JOBCENTER_FORMS.length === 5
      && ["SGB2-Hauptantrag", "SGB2-WBA", "SGB2-Veraenderungsmitteilung", "SGB2-KdU-Anlage", "SGG-Widerspruch"].every((identifier) =>
        pack.forms.some((form) => form.identifier === identifier)),
    factoryIdsDeterministic: pack.trustDomain.id
      === buildJobcenterFederalCorePack().trustDomain.id
      && pack.jurisdictions[0]!.id === buildJobcenterFederalCorePack().jurisdictions[0]!.id,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-expansion-jobcenter",
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
      [JOBCENTER_OFFICIAL_SOURCES.map((item) => item.url)],
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
        where claim_text_canonical ilike '%Regelbedarfsstufen-Eurobeträge für 2027%'
           or id::text = any($1::text[])`,
      [[...watchIds]],
    );
    const processesIngested = await admin.query(
      `select count(*)::int n from public.knowledge_processes
        where process_group_id=$1`,
      [JOBCENTER_DOMAIN],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1
         and l.process_step_id is null`,
      [JOBCENTER_DOMAIN],
    );
    const formsIngested = await admin.query(
      `select count(*)::int n from public.knowledge_forms
        where form_identifier=any($1::text[])`,
      [JOBCENTER_FORMS.map((item) => item.identifier)],
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
    live.sourcesIngested = Number(sources.rows[0]?.n) === JOBCENTER_OFFICIAL_SOURCES.length;
    live.noDuplicateSources = sourceDupes.rowCount === 0;
    live.noDuplicateClaims = claimDupes.rowCount === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length
      && pack.claims.length === JOBCENTER_UNITS.length;
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
    domain: JOBCENTER_DOMAIN,
    summary,
    validationIssues: validation.issues,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    officialSources: JOBCENTER_OFFICIAL_SOURCES.map((item) => item.url),
    futureWatchItems: JOBCENTER_FUTURE_CHANGE_WATCH_ITEMS.map((item) => item.id),
    processCompleteness: completeness,
    g3ProcessStepLimitation: JOBCENTER_G3_PROCESS_STEP_LIMITATION,
    temporalG3EffectiveDatePassthroughImplemented: false,
    futureRulesSafelyExcludedFromCurrentIngestion: true,
    publicRuntimeAuthorized: false,
    standaloneFirstContactModeIntroduced: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "Jobcenter pack audit failed"}\n`);
  process.exitCode = 1;
});
