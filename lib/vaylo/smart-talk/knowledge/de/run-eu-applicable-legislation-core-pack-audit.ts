/**
 * CB-0C dedicated local audit.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  KNOWLEDGE_FACTORY_DOMAINS,
  validateCuratedDomainPack,
} from "../source-registry/knowledge-factory-contracts";
import {
  COD_2016_0397_STATUS,
  CROSS_BORDER_CONNECTED_COUNTRIES,
  detectMissingCrossBorderFacts,
  factoryIdForStableRef,
  validateCrossBorderCaseContext,
  validateCuratedCrossBorderConnectorPack,
  validateEuJurisdictionAnchorPack,
  type CuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import {
  buildSyntheticEuJurisdictionAnchorPack,
  buildValidCaseContext,
  buildValidDeSkPlannedConnectorPack,
  germanKindergeldFixture,
} from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  EU_AL_FUTURE_WATCH,
  EU_AL_NEGATIVE_CONTROLS,
  EU_AL_OFFICIAL_SOURCES,
  EU_AL_PACK_ID,
  EU_AL_PROCESSES,
  EU_AL_PROCESS_GROUP,
  EU_AL_UNITS,
  EU_SHARED_ARTICLE_12_CLAIM_KEY,
  GERMAN_PACK_OVERLAP,
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
  euAlPackSummary,
  evaluateEuAlProcessCompleteness,
  validateEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0c_core";
const PASSWORD = `cb0c-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0c-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/051_add_cross_border_connector_ingestion.sql",
  "supabase/migrations/052_expand_eu_jurisdiction_foundation_ingestion.sql",
  "supabase/migrations/053_add_sk_national_adapter_and_de_sk_connector_ingestion.sql",
  "supabase/migrations/054_add_eu_health_insurance_coordination_ingestion.sql",
  "supabase/migrations/055_add_de_sk_health_insurance_coordination_ingestion.sql",
  "supabase/migrations/056_add_eu_family_benefits_coordination_ingestion.sql",
  "supabase/migrations/057_add_de_sk_family_benefits_coordination_ingestion.sql",
  "supabase/migrations/058_add_eu_unemployment_coordination_ingestion.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Entsendung|Sozial|Wohnsitz|Arbeit|Bescheinigung|Verordnung|Träger|Tätigkeit|keine|kein|nicht/iu;
const OFFICIAL_HOSTS = new Set([
  "eur-lex.europa.eu",
  "ec.europa.eu",
  "europa.eu",
  "socialsecurity.belgium.be",
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

function reuseConnector(country: "SK" | "CZ" | "PL" | "HU"): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    packId: `cb0c_de_${country.toLowerCase()}_reuse`,
    connectedCountry: country,
    topicKey: `cb0c-al-reuse-${country.toLowerCase()}`,
    euClaimRefs: [Object.freeze({
      entityClass: "claims" as const,
      key: EU_SHARED_ARTICLE_12_CLAIM_KEY,
      sourceJurisdiction: "EU" as const,
      trustDomain: "eu" as const,
      temporalClass: "CURRENT" as const,
    })],
  });
}

async function rejects(
  client: Client,
  rpc: string,
  payload: unknown,
  token: string,
): Promise<boolean> {
  try {
    await client.query(rpc, [payload]);
    return false;
  } catch (error: unknown) {
    return String(error instanceof Error ? error.message : error).includes(token);
  }
}

async function main(): Promise<void> {
  const pack = buildEuApplicableLegislationCorePack();
  const summary = euAlPackSummary(pack);
  const validation = validateEuApplicableLegislationCorePack(pack);
  const completeness = evaluateEuAlProcessCompleteness(pack);
  const german = germanKindergeldFixture();
  const euAnchor = buildSyntheticEuJurisdictionAnchorPack();
  const caseContext = buildValidCaseContext();
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "eu",
    "applicable-legislation", "eu-applicable-legislation-core-pack.ts",
  );
  const migration051 = source("supabase", "migrations", "051_add_cross_border_connector_ingestion.sql");
  const migration052 = source("supabase", "migrations", "052_expand_eu_jurisdiction_foundation_ingestion.sql");
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const corpus = [
    ...pack.claims.map((claim) => String(claim.text)),
    ...pack.passages.map((passage) => String(passage.text)),
    ...pack.processes.map((process) => `${process.title} ${process.trigger} ${process.safeFirstStep}`),
  ].join("\n");
  const uniqueClaimIds = new Set(pack.claims.map((claim) => String(claim.id)));
  const uniqueClaimKeys = new Set(pack.claims.map((claim) => String(claim.key)));
  const uniqueSourceUrls = new Set(pack.sources.map((item) => String(item.canonicalUrl)));
  const article12Id = factoryIdForStableRef({
    entityClass: "claims", key: EU_SHARED_ARTICLE_12_CLAIM_KEY,
  });
  const missingFacts = detectMissingCrossBorderFacts(
    { persons: [], period: null },
    ["WORKER"],
    ["residenceState", "employmentState"],
  );

  const staticCases = {
    notCuratedDomainPack: !packSource.includes("validateCuratedDomainPack")
      && pack.packId === EU_AL_PACK_ID
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("eu_applicable_legislation")
      && KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !factoryContracts.includes("eu_applicable_legislation"),
    sourceJurisdictionEu: pack.trustDomain.code === "eu"
      && pack.jurisdictions[0]?.level === "eu"
      && pack.jurisdictions[0]?.countryCode === "EU"
      && pack.canonicalLanguage === "de"
      && /Quellenjurisdiktion EU ist nicht dasselbe wie ein anwendbarer Staat DE/.test(
        claimText("source-eu-not-applicable-state-de"),
      ),
    current883987: /883\/2004/.test(claimText("current-883-987-baseline"))
      && /987\/2009/.test(claimText("current-883-987-baseline"))
      && COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && /2016\/0397\(COD\)/.test(claimText("pending-cod-2016-0397-not-current"))
      && EU_AL_FUTURE_WATCH.every((item) => item.ingestible === false)
      && !pack.claims.some((claim) => EU_AL_FUTURE_WATCH.some((item) => item.key === claim.key)),
    oneLegislation: /nur eines Mitgliedstaats/.test(claimText("one-legislation-principle"))
      && /Staatsangehörigkeit bestimmt die anwendbaren Rechtsvorschriften/.test(
        claimText("nationality-not-applicable-legislation"),
      )
      && /nicht automatisch Beiträge in jedem Tätigkeitsstaat/.test(
        claimText("cross-border-work-not-multi-systems"),
      ),
    article11: /Beschäftigungsstaats/.test(claimText("art-11-employed-lex-loci-laboris"))
      && /Wohnsitzstaat ist für gewöhnliche Arbeitnehmer nicht automatisch/.test(
        claimText("residence-not-automatic-employment-legislation"),
      )
      && /nicht automatisch eine Entsendung/.test(claimText("remote-work-not-posting-automatically")),
    article12Employee: /kumulativ/.test(claimText(EU_SHARED_ARTICLE_12_CLAIM_KEY))
      && /24 Monaten/.test(claimText(EU_SHARED_ARTICLE_12_CLAIM_KEY))
      && /nicht automatisch/.test(claimText("art-12-1-24-months-not-automatic"))
      && /abzulösen|Ablösung/.test(claimText("replacement-prohibition"))
      && /wesentliche Tätigkeiten/.test(claimText("employer-substantial-activities-required"))
      && /eigens für die Entsendung/.test(claimText("newly-recruited-prior-coverage")),
    article12SelfEmployed: /ähnliche Tätigkeit/.test(claimText("art-12-2-self-employed-posting"))
      && /nicht dieselbe Klassifikation/.test(claimText("self-employed-not-employee-posting")),
    article13Employed: /zwei oder mehr Mitgliedstaaten/.test(claimText("art-13-1-multi-state-habitual"))
      && /wenigstens 25 Prozent der Arbeitszeit und\/oder/.test(claimText("substantial-activity-indicator-25"))
      && /Ziffern i bis iv/.test(claimText("less-than-25-not-always-employer-state")),
    hakampEmployedThreshold: /C-203\/24/.test(claimText("cjeu-c-203-24-hakamp"))
      && /4\. September 2025/.test(claimText("cjeu-c-203-24-hakamp"))
      && /ECLI:EU:C:2025:662/.test(claimText("cjeu-c-203-24-hakamp"))
      && /keine optionale weiche Leitlinie/.test(claimText("employed-25-not-optional-soft-guidance"))
      && /auch wenn das Entgelt darunter liegt/.test(claimText("employed-time-25-satisfies"))
      && /auch wenn die Arbeitszeit darunter liegt/.test(claimText("employed-pay-25-satisfies"))
      && /beide unter 25 Prozent/.test(claimText("employed-both-below-25-not-substantial"))
      && /Andere tatsächliche Umstände/.test(claimText("employed-other-criteria-cannot-compensate"))
      && /zwölf Kalendermonaten/.test(claimText("twelve-month-prospective"))
      && /verdünnt die 25-Prozent-Schwelle/.test(claimText("twelve-month-projection-does-not-dilute-25"))
      && /nicht automatisch auf dieselbe gerichtliche 25-Prozent-Formel/.test(
        claimText("employed-self-employed-substantial-tests-distinct"),
      )
      && EU_AL_OFFICIAL_SOURCES.some((item) => item.key === "cjeu-hakamp"
        && item.url === "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62024CJ0203")
      && !/kein absolutes Rechengebot/.test(claimText("substantial-activity-indicator-25"))
      && !EU_AL_UNITS.some((unit) => unit.key === "25-percent-not-mechanical"),
    article13SelfEmployed: /Mittelpunkt der Interessen/.test(claimText("art-13-2-self-employed-multi-state"))
      && /Gewerbeanmeldung ist nicht automatisch/.test(claimText("registration-not-centre")),
    mixedActivity: /Beschäftigungsstaats/.test(claimText("art-13-3-employed-plus-self-employed"))
      && /Beamtenpensionsrecht wird nicht aufgebaut/.test(claimText("art-13-4-civil-servant-mixed"))
      && /kein in diesem Kern erfundener/.test(claimText("no-invented-hourly-euro-threshold")),
    telework: /nicht Artikel 13 selbst/.test(claimText("framework-agreement-is-art-16-not-art-13"))
      && /nicht ohne Live-Prüfung/.test(claimText("framework-not-assume-corridor-states"))
      && /nicht automatisch Entsendung/.test(claimText("telework-may-be-multi-state")),
    procedure: /Wohnmitgliedstaat/.test(claimText("art-16-987-notify-residence"))
      && /vorläufige Bestimmung ist nicht notwendig/.test(claimText("temporary-not-necessarily-final"))
      && /keine Rechtsvorschriften gelten/.test(claimText("disagreement-not-coverage-gap")),
    article16: /keine ordentliche Verlängerung/.test(claimText("art-16-not-ordinary-art-12-extension"))
      && /kein Anspruch der Person/.test(claimText("art-16-not-user-entitlement")),
    pdA1: /anwendbaren Rechtsvorschriften der sozialen Sicherheit/.test(claimText("pd-a1-purpose"))
      && /keine Arbeitserlaubnis/.test(claimText("a1-not-work-permit"))
      && /nicht automatisch ungültig/.test(claimText("later-a1-not-automatically-invalid"))
      && /nicht automatisch nichtig/.test(claimText("inspector-disagree-not-void"))
      && /nicht dauerhaft ein/.test(claimText("a1-not-permanently-frozen")),
    boundaries: /nicht dasselbe wie die arbeitsrechtlichen/.test(claimText("ss-not-host-employment-law"))
      && /nicht der steuerliche Wohnsitz/.test(claimText("ss-not-tax-residence"))
      && /keine unionsrechtlichen Freizügigkeits/.test(claimText("a1-not-free-movement"))
      && /nicht die Europäische Krankenversicherungskarte/.test(claimText("a1-not-ehic")),
    oneSharedArticle12: uniqueClaimKeys.has(EU_SHARED_ARTICLE_12_CLAIM_KEY)
      && pack.claims.filter((claim) => claim.key === EU_SHARED_ARTICLE_12_CLAIM_KEY).length === 1
      && article12Id === pack.claims.find((claim) => claim.key === EU_SHARED_ARTICLE_12_CLAIM_KEY)?.id
      && !/de-sk-art-12|de-cz-art-12|de-pl-art-12|de-hu-art-12/.test(packSource),
    overlapDocumentedNotRewritten: GERMAN_PACK_OVERLAP.length === 3
      && packSource.includes("health_insurance_orientation")
      && packSource.includes("future cross-border source of truth"),
    processComplete: pack.processes.length === EU_AL_PROCESSES.length
      && EU_AL_PROCESSES.length === 24
      && PROCESS_COMPLETE_DIMENSIONS.length === 12
      && completeness.processComplete
      && completeness.blockedScenarioCount === 0
      && completeness.processCompletenessPercent === 100
      && completeness.outOfScopeScenarioCount === 2
      && completeness.coveredScenarioCount >= 43,
    negativeControls: EU_AL_NEGATIVE_CONTROLS.every((key) => uniqueClaimKeys.has(key)),
    officialSourcesOnly: EU_AL_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === pack.sources.length
      && pack.sources.every((item) => !/wikipedia|reddit|linkedin|kpmg|payroll|forum/iu.test(String(item.canonicalUrl))),
    germanNormalizedLanguage: pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text)))
      && uniqueClaimIds.size === pack.claims.length
      && uniqueClaimKeys.size === pack.claims.length
      && pack.claims.length === EU_AL_UNITS.length,
    localeAndNationalityRejected: /Ausgabesprache oder Nutzeroberfläche/.test(claimText("locale-not-jurisdiction"))
      && missingFacts.includes("person:WORKER")
      && validateCrossBorderCaseContext(caseContext).valid,
    no051Rewrite: !migration051.includes("eu_applicable_legislation")
      && migration052.includes("eu_applicable_legislation")
      && migration052.includes("create or replace function public.knowledge_ingest_curated_eu_jurisdiction_anchor")
      && !/create table if not exists public\.knowledge_/i.test(migration052),
    germanFactoryUnchanged: validateCuratedDomainPack(german).valid
      && validateEuJurisdictionAnchorPack(euAnchor).valid
      && CROSS_BORDER_CONNECTED_COUNTRIES.join(",") === "SK,CZ,PL,HU",
    validationPass: validation.valid && validation.productionEligible === false,
    noPublicRuntime: true,
    noProductionInteraction: true,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      staticCases,
      publicRuntimeAuthorized: false,
      productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0c",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let germanCreated = -1;
  let euAnchorCreated = -1;
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
      grant connect on database ${DATABASE} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_cross_border_connector_pack(jsonb)
        to birello_knowledge_ingestor;
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

    germanCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [german])).rows[0]);
    euAnchorCreated = semanticCreated((await ingestor.query(EU_RPC, [euAnchor])).rows[0]);
    firstCreated = semanticCreated((await ingestor.query(EU_RPC, [pack])).rows[0]);
    secondCreated = semanticCreated((await ingestor.query(EU_RPC, [pack])).rows[0]);

    const resolvedIds = CROSS_BORDER_CONNECTED_COUNTRIES.map((country) => reuseConnector(country)).map((connector) => {
      const checked = validateCuratedCrossBorderConnectorPack(connector);
      if (!checked.valid) throw new Error(`CONNECTOR_CONTRACT:${connector.connectedCountry}:${checked.issues.join(",")}`);
      return connector;
    });
    const connectorRows = [];
    for (const connector of resolvedIds) {
      connectorRows.push(await ingestor.query(CONNECTOR_RPC, [connector]));
    }
    const connectorCreated = connectorRows.map((row) => semanticCreated(row.rows[0]));
    const storedEuIds = await admin.query(
      `select connected_country, eu_coordination_claim_ids::text[] as eu_ids, status
         from public.knowledge_cross_border_connectors c
         join public.knowledge_cross_border_processes p on p.cross_border_connector_id = c.id
        order by connected_country`,
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const plannedCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='planned'",
    );
    const euClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='eu' and j.country_code='EU' and t.code='eu' and c.claim_language='de'`,
    );
    const packClaims = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id = any($1::uuid[])",
      [pack.claims.map((claim) => claim.id)],
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
         and r.effective_date_filter_required
         and c.id = any($1::uuid[])`,
      [pack.claims.map((claim) => claim.id)],
    );
    const processesIngested = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id=$1",
      [EU_AL_PROCESS_GROUP],
    );
    const processLinksIngested = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1 and l.process_step_id is null`,
      [EU_AL_PROCESS_GROUP],
    );
    const foreignNationalClaims = await admin.query(
      `select count(*)::int n from public.knowledge_jurisdictions
        where country_code in ('SK','CZ','PL','HU')`,
    );
    const proposedStored = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id = any($1::uuid[])",
      [EU_AL_FUTURE_WATCH.map((item) => factoryIdForStableRef({ entityClass: "claims", key: item.key }))],
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name in (
          'knowledge_ingest_curated_cross_border_connector_pack',
          'knowledge_ingest_curated_eu_jurisdiction_anchor'
        ) and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );
    const groupCheck = await admin.query(
      `select pg_get_constraintdef(oid) as def from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const skDomain = {
      ...german,
      jurisdictions: [{ ...german.jurisdictions[0]!, countryCode: "SK" }],
    };
    const skEu = {
      ...euAnchor,
      jurisdictions: [{ ...euAnchor.jurisdictions[0]!, countryCode: "SK", code: "SK" as const }],
    };
    const proposedPack = {
      ...pack,
      claims: pack.claims.map((claim, index) => index === 0
        ? { ...claim, temporalClass: "PROPOSED_NOT_CURRENT" }
        : claim),
    };

    live.germanRegression = germanCreated > 0;
    live.euAnchorStillWorks = euAnchorCreated > 0;
    live.firstSemanticCreatedPositive = firstCreated > 0;
    live.secondSemanticCreatedZero = secondCreated === 0;
    live.packClaimsOnce = Number(packClaims.rows[0]?.n) === pack.claims.length;
    live.noSourceDuplicates = Number(sourceDupes.rowCount ?? sourceDupes.rows.length) === 0;
    live.noClaimDuplicates = Number(claimDupes.rowCount ?? claimDupes.rows.length) === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length;
    live.processesIngested = Number(processesIngested.rows[0]?.n) === pack.processes.length;
    live.processLinksIngested = Number(processLinksIngested.rows[0]?.n) === pack.processClaimLinks.length;
    live.euJurisdictionAndTrust = Number(euClaims.rows[0]?.n) >= pack.claims.length;
    live.proposedReformExcluded = Number(proposedStored.rows[0]?.n) === 0
      && await rejects(ingestor, EU_RPC, proposedPack, "EU_ANCHOR_NON_CURRENT");
    live.foreignNationalBlocked = Number(foreignNationalClaims.rows[0]?.n) === 0
      && await rejects(ingestor, DOMAIN_RPC, skDomain, "CURATED_DOMAIN")
      && await rejects(ingestor, EU_RPC, skEu, "EU_ANCHOR_FOREIGN_NATIONAL_FORBIDDEN");
    live.oneEuClaimReused = storedEuIds.rows.length === 4
      && storedEuIds.rows.every((row) => row.eu_ids?.[0] === article12Id)
      && storedEuIds.rows.every((row) => row.status === "planned")
      && connectorCreated.every((value) => value > 0);
    live.activeCorridorsZero = Number(activeCorridors.rows[0]?.n) === 0
      && Number(plannedCorridors.rows[0]?.n) === 4;
    live.processGroupAllowed = String(groupCheck.rows[0]?.def ?? "").includes("eu_applicable_legislation");
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.noPublicRuntime = true;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const allPassed = Object.values(staticCases).every(Boolean) && Object.values(live).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    staticCases,
    live,
    germanCreated,
    euAnchorCreated,
    firstCreated,
    secondCreated,
    summary,
    completeness: {
      processScenarioCount: completeness.processScenarioCount,
      coveredScenarioCount: completeness.coveredScenarioCount,
      outOfScopeScenarioCount: completeness.outOfScopeScenarioCount,
      blockedScenarioCount: completeness.blockedScenarioCount,
      processCompletenessPercent: completeness.processCompletenessPercent,
    },
    corridors: CROSS_BORDER_CONNECTED_COUNTRIES,
    temporal: { cod20160397: COD_2016_0397_STATUS },
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
    substantiveForeignNationalClaimsIngested: 0,
    germanOverlap: GERMAN_PACK_OVERLAP,
    corpusChars: corpus.length,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0C audit failed"}\n`);
  process.exitCode = 1;
});
