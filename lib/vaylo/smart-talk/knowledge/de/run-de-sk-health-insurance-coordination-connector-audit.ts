/**
 * CB-0F dedicated local audit for the DE↔SK health-insurance coordination connector.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { KNOWLEDGE_FACTORY_DOMAINS, validateCuratedDomainPack } from "../source-registry/knowledge-factory-contracts";
import {
  CROSS_BORDER_SOURCE_JURISDICTIONS,
  FOREIGN_NATIONAL_ADAPTER_COUNTRIES,
  detectMissingCrossBorderFacts,
  factoryIdForStableRef,
  validateCrossBorderCaseContext,
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import { validateForeignNationalAdapterPack } from "../source-registry/foreign-national-adapter-contracts";
import { germanKindergeldFixture } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
  validateEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_SHARED_ART17_CLAIM_KEY,
  EU_SHARED_EHIC_CLAIM_KEY,
  EU_SHARED_S1_CLAIM_KEY,
  EU_SHARED_S2_CLAIM_KEY,
  buildEuHealthInsuranceCoordinationPack,
  validateEuHealthInsuranceCoordinationPack,
} from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import { buildHealthInsuranceFederalCorePack } from "../packs/de/health-insurance-orientation/health-insurance-federal-core-pack";
import {
  SK_AL_PACK_ID,
  buildSkApplicableLegislationAdapterPack,
} from "../packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import { buildDeApplicableLegislationRoutingPack } from "../packs/de/applicable-legislation-routing/de-applicable-legislation-routing-pack";
import {
  DE_SK_CONNECTOR_STATUS,
  buildDeSkApplicableLegislationConnectorPack,
} from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import {
  DE_HEALTH_NEGATIVE_CONTROLS,
  DE_HEALTH_OFFICIAL_SOURCES,
  DE_HEALTH_PACK_ID,
  DE_HEALTH_PRIMARY_PROCESS_KEY,
  DE_HEALTH_PROCESSES,
  DE_HEALTH_UNITS,
  buildDeHealthInsuranceCoordinationRoutingPack,
} from "../packs/de/health-insurance-coordination-routing/de-health-insurance-coordination-routing-pack";
import {
  SK_HEALTH_CANONICAL_LANGUAGE,
  SK_HEALTH_INSURER_INSTANCES_AS_OF,
  SK_HEALTH_INSURER_ROLE,
  SK_HEALTH_NEGATIVE_CONTROLS,
  SK_HEALTH_OFFICIAL_SOURCES,
  SK_HEALTH_PACK_ID,
  SK_HEALTH_PRIMARY_PROCESS_KEY,
  SK_HEALTH_PROCESSES,
  SK_HEALTH_UNITS,
  buildSkHealthInsuranceCoordinationAdapterPack,
} from "../packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack";
import {
  DE_SK_HEALTH_CONNECTOR_PACK_ID,
  DE_SK_HEALTH_CONNECTOR_STATUS,
  DE_SK_HEALTH_DE_CLAIM_KEYS,
  DE_SK_HEALTH_EU_CLAIM_KEYS,
  DE_SK_HEALTH_PROCESSES,
  DE_SK_HEALTH_REUSED_GERMAN_HEALTH_KEYS,
  DE_SK_HEALTH_SCENARIOS,
  DE_SK_HEALTH_SK_CLAIM_KEYS,
  buildDeSkHealthInsuranceCoordinationConnectorPack,
  deSkHealthConnectorSummary,
  evaluateDeSkHealthProcessCompleteness,
} from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0f_core";
const PASSWORD = `cb0f-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0f-${process.pid}-${randomUUID().slice(0, 8)}`;
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
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const DE_RPC = "select public.knowledge_ingest_curated_de_corridor_routing_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Wohnsitz|Kranken|Bescheinigung|Verordnung|Träger|Sachleistung|nicht|keine|kein/iu;
const SK_HOSTS = new Set(["www.slov-lex.sk", "www.udzs-sk.sk", "www.vszp.sk"]);
const DE_HOSTS = new Set(["www.dvka.de", "www.eu-patienten.de"]);
const EU_COPIED = /Ein Versicherter und seine Familienangehörigen, die in einem anderen als dem zuständigen Mitgliedstaat wohnen, erhalten in dem Wohnmitgliedstaat Sachleistungen|key: "art-17-residence-benefits-in-kind"|key: "s1-purpose"|key: "ehic-purpose"|key: "s2-purpose"/u;

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT, encoding: "utf8", timeout, windowsHide: true, shell: false, maxBuffer: 32 * 1024 * 1024,
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
async function rejects(client: Client, rpc: string, payload: unknown, token: string): Promise<boolean> {
  try {
    await client.query(rpc, [payload]);
    return false;
  } catch (error: unknown) {
    return String(error instanceof Error ? error.message : error).includes(token);
  }
}

async function main(): Promise<void> {
  const euAl = buildEuApplicableLegislationCorePack();
  const euHealth = buildEuHealthInsuranceCoordinationPack();
  const germanHealth = buildHealthInsuranceFederalCorePack();
  const skAl = buildSkApplicableLegislationAdapterPack();
  const deAl = buildDeApplicableLegislationRoutingPack();
  const alConnector = buildDeSkApplicableLegislationConnectorPack();
  const deHealth = buildDeHealthInsuranceCoordinationRoutingPack();
  const skHealth = buildSkHealthInsuranceCoordinationAdapterPack();
  const connector = buildDeSkHealthInsuranceCoordinationConnectorPack();
  const completeness = evaluateDeSkHealthProcessCompleteness();
  const summary = deSkHealthConnectorSummary(connector);
  const deSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "health-insurance-coordination-routing", "de-health-insurance-coordination-routing-pack.ts",
  );
  const skSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "sk",
    "health-insurance-coordination", "sk-health-insurance-coordination-adapter-pack.ts",
  );
  const connectorSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de-sk",
    "health-insurance-coordination", "de-sk-health-insurance-coordination-connector-pack.ts",
  );
  const migration055 = source(
    "supabase", "migrations", "055_add_de_sk_health_insurance_coordination_ingestion.sql",
  );
  const skUrls = skHealth.sources.map((item) => String(item.canonicalUrl));
  const deUrls = deHealth.sources.map((item) => String(item.canonicalUrl));

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && validateCuratedDomainPack(germanKindergeldFixture()).valid
      && validateCuratedDomainPack(germanHealth).valid,
    euCoresReused: validateEuApplicableLegislationCorePack(euAl).valid
      && validateEuHealthInsuranceCoordinationPack(euHealth).valid
      && DE_SK_HEALTH_EU_CLAIM_KEYS.includes(EU_SHARED_ART17_CLAIM_KEY)
      && DE_SK_HEALTH_EU_CLAIM_KEYS.includes(EU_SHARED_S1_CLAIM_KEY)
      && DE_SK_HEALTH_EU_CLAIM_KEYS.includes(EU_SHARED_EHIC_CLAIM_KEY)
      && DE_SK_HEALTH_EU_CLAIM_KEYS.includes(EU_SHARED_S2_CLAIM_KEY)
      && !EU_COPIED.test(deSource)
      && !EU_COPIED.test(skSource)
      && !EU_COPIED.test(connectorSource),
    germanHealthReused: DE_SK_HEALTH_REUSED_GERMAN_HEALTH_KEYS.every((key) => (
      germanHealth.claims.some((claim) => claim.key === key)
      && !DE_HEALTH_UNITS.some((unit) => unit.key === key)
    ))
      && DE_HEALTH_UNITS.every((unit) => unit.key.startsWith("de-health-")),
    deRouting: deHealth.packId === DE_HEALTH_PACK_ID
      && deHealth.trustDomain.code === "de"
      && deHealth.jurisdictions[0]?.level === "de_federal"
      && DE_HEALTH_PROCESSES.length === 10
      && DE_HEALTH_NEGATIVE_CONTROLS.every((key) => DE_HEALTH_UNITS.some((unit) => unit.key === key))
      && deUrls.every((url) => DE_HOSTS.has(new URL(url).host) && !url.includes("#"))
      && new Set(deUrls).size === deUrls.length,
    skAdapter: validateForeignNationalAdapterPack(skHealth).valid
      && skHealth.packId === SK_HEALTH_PACK_ID
      && skHealth.countryCode === "SK"
      && skHealth.trustDomain.code === "sk"
      && skHealth.canonicalLanguage === SK_HEALTH_CANONICAL_LANGUAGE
      && skHealth.jurisdictions[0]?.level === "foreign_national"
      && SK_HEALTH_PROCESSES.length === 12
      && SK_HEALTH_INSURER_ROLE === "SK_PUBLIC_HEALTH_INSURANCE_INSTITUTION"
      && SK_HEALTH_INSURER_INSTANCES_AS_OF.length > 0
      && SK_HEALTH_NEGATIVE_CONTROLS.every((key) => SK_HEALTH_UNITS.some((unit) => unit.key === key))
      && SK_HEALTH_OFFICIAL_SOURCES.every((item) => SK_HOSTS.has(item.officialDomain))
      && skUrls.every((url) => !url.includes("#"))
      && new Set(skUrls).size === skUrls.length
      && !/wikipedia|reddit|linkedin|kpmg|payroll|forum|financnykompas/iu.test(skUrls.join("\n"))
      && FOREIGN_NATIONAL_ADAPTER_COUNTRIES.join(",") === "SK",
    connectorPrepared: connector.status === DE_SK_HEALTH_CONNECTOR_STATUS
      && (connector.status as string) !== "active"
      && connector.packId === DE_SK_HEALTH_CONNECTOR_PACK_ID
      && connector.originMarket === "DE"
      && connector.connectedCountry === "SK"
      && connector.activationFromLocaleAllowed === false
      && connector.activationRequiresVerifiedCaseContext === true
      && validateCuratedCrossBorderConnectorPack(connector).valid
      && CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU"
      && DE_SK_HEALTH_PROCESSES.length === 22
      && completeness.processCompletenessPercent === 100
      && completeness.blockedScenarioCount === 0
      && completeness.totalScenarios === 56
      && completeness.coveredScenarioCount === 51
      && completeness.outOfScopeScenarioCount === 5
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    germanNormalizedLanguage: skHealth.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text)))
      && deHealth.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    localeAndNationality: detectMissingCrossBorderFacts(
      { persons: [], period: null },
      ["WORKER"],
      ["residenceState", "insuranceState"],
    ).includes("person:WORKER")
      && validateCrossBorderCaseContext({
        persons: [{ role: "WORKER", residenceState: "SK", insuranceState: "DE" }],
        period: { from: "2026-08-31" },
        healthcare: { applicableLegislationVerified: true, competentState: "DE" },
      }).valid
      && alConnector.status === DE_SK_CONNECTOR_STATUS,
    migration055: migration055.includes("sk_health_insurance_coordination_adapter")
      && migration055.includes("de_health_insurance_coordination_routing")
      && migration055.includes("de_sk_health_insurance_coordination_connector")
      && !migration055.includes("grant execute")
      && !/create table if not exists public\.knowledge_/i.test(migration055)
      && DE_HEALTH_PRIMARY_PROCESS_KEY === "de-gkv-s1-issue-resident-abroad"
      && SK_HEALTH_PRIMARY_PROCESS_KEY === "sk-incoming-s1-register"
      && DE_SK_HEALTH_DE_CLAIM_KEYS.length > 0
      && DE_SK_HEALTH_SK_CLAIM_KEYS.length === SK_HEALTH_UNITS.length,
    noPublicRuntime: summary.validation.productionEligible === false,
    noProductionInteraction: true,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED", reason: "docker unavailable", staticCases,
      publicRuntimeAuthorized: false, productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0f",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let euAlCreated = -1;
  let euHealthCreated = -1;
  let germanHealthCreated = -1;
  let deAlFirst = -1;
  let skAlFirst = -1;
  let alConnectorFirst = -1;
  let deHealthFirst = -1;
  let deHealthSecond = -1;
  let skHealthFirst = -1;
  let skHealthSecond = -1;
  let connectorFirst = -1;
  let connectorSecond = -1;
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
      if (applied.status !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-2500)}`);
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
      grant execute on function public.knowledge_ingest_curated_foreign_national_adapter_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_de_corridor_routing_pack(jsonb)
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

    euAlCreated = semanticCreated((await ingestor.query(EU_RPC, [euAl])).rows[0]);
    euHealthCreated = semanticCreated((await ingestor.query(EU_RPC, [euHealth])).rows[0]);
    germanHealthCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [germanHealth])).rows[0]);
    deAlFirst = semanticCreated((await ingestor.query(DE_RPC, [deAl])).rows[0]);
    skAlFirst = semanticCreated((await ingestor.query(SK_RPC, [skAl])).rows[0]);
    alConnectorFirst = semanticCreated((await ingestor.query(CONNECTOR_RPC, [alConnector])).rows[0]);
    deHealthFirst = semanticCreated((await ingestor.query(DE_RPC, [deHealth])).rows[0]);
    deHealthSecond = semanticCreated((await ingestor.query(DE_RPC, [deHealth])).rows[0]);
    skHealthFirst = semanticCreated((await ingestor.query(SK_RPC, [skHealth])).rows[0]);
    skHealthSecond = semanticCreated((await ingestor.query(SK_RPC, [skHealth])).rows[0]);
    connectorFirst = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);
    connectorSecond = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);

    const stored = await admin.query(
      `select c.status, c.connected_country, c.activation_from_locale_allowed,
              count(p.id)::int as process_rows
         from public.knowledge_cross_border_connectors c
         join public.knowledge_cross_border_processes p on p.cross_border_connector_id = c.id
        where c.connected_country='SK'
        group by c.id, c.status, c.connected_country, c.activation_from_locale_allowed`,
    );
    const healthCorridor = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='de_sk_health_insurance_coordination_connector'",
    );
    const alCorridor = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='de_sk_applicable_legislation_connector'",
    );
    const skHealthClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='foreign_national' and j.country_code='SK'
         and t.code='sk' and c.claim_language='de'`,
    );
    const euExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: EU_SHARED_ART17_CLAIM_KEY })],
    );
    const deExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "de-health-gkv-krankenkasse-issues-s1" })],
    );
    const skExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "sk-health-incoming-s1-choose-insurer" })],
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const sourceDupes = await admin.query(
      `select canonical_url, count(*)::int n from public.knowledge_sources
        group by canonical_url having count(*)>1`,
    );
    const claimDupes = await admin.query(
      `select id, count(*)::int n from public.knowledge_claims group by id having count(*)>1`,
    );
    const czNational = await admin.query(
      `select count(*)::int n from public.knowledge_jurisdictions
        where country_code in ('CZ','PL','HU')`,
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_table_grants
        where table_schema='public' and table_name like 'knowledge_%'
          and grantee in ('anon','authenticated','public')`,
    );
    const czPack = { ...skHealth, countryCode: "CZ" as const, packId: SK_HEALTH_PACK_ID };
    const plPack = { ...skHealth, countryCode: "PL" };
    const huPack = { ...skHealth, countryCode: "HU" };
    const unknownPack = { ...skHealth, countryCode: "XX" };

    live.euAlIngested = euAlCreated > 0;
    live.euHealthIngested = euHealthCreated > 0;
    live.germanHealthIngested = germanHealthCreated > 0;
    live.alConnectorStillWorks = deAlFirst > 0 && skAlFirst > 0 && alConnectorFirst > 0;
    live.deHealthFirstCreated = deHealthFirst > 0;
    live.deHealthSecondZero = deHealthSecond === 0;
    live.skHealthFirstCreated = skHealthFirst > 0;
    live.skHealthSecondZero = skHealthSecond === 0;
    live.connectorFirstCreated = connectorFirst > 0;
    live.connectorSecondZero = connectorSecond === 0;
    live.skJurisdiction = Number(skHealthClaims.rows[0]?.n) === skAl.claims.length + skHealth.claims.length;
    live.exactOneRefs = Number(euExact.rows[0]?.n) === 1
      && Number(deExact.rows[0]?.n) === 1
      && Number(skExact.rows[0]?.n) === 1;
    live.connectorPreparedNonActive = stored.rows[0]?.status === "prepared"
      && stored.rows[0]?.connected_country === "SK"
      && stored.rows[0]?.activation_from_locale_allowed === false
      && Number(stored.rows[0]?.process_rows) === 2
      && Number(activeCorridors.rows[0]?.n) === 0
      && Number(healthCorridor.rows[0]?.n) === DE_SK_HEALTH_PROCESSES.length
      && Number(alCorridor.rows[0]?.n) === 22;
    live.noSourceDupes = sourceDupes.rows.length === 0;
    live.noClaimDupes = claimDupes.rows.length === 0;
    live.czPlHuNationalAbsent = Number(czNational.rows[0]?.n) === 0;
    live.czBlocked = await rejects(ingestor, SK_RPC, czPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.plBlocked = await rejects(ingestor, SK_RPC, plPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.huBlocked = await rejects(ingestor, SK_RPC, huPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.unknownBlocked = await rejects(ingestor, SK_RPC, unknownPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    try {
      await ingestor.query(SK_RPC, [skAl]);
      live.alPackStillAccepted = skAl.packId === SK_AL_PACK_ID;
    } catch {
      live.alPackStillAccepted = false;
    }
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.primaryProcessPresent = DE_HEALTH_OFFICIAL_SOURCES.length === 3
      && DE_SK_HEALTH_SCENARIOS.length === 56;
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
    euAlCreated,
    euHealthCreated,
    germanHealthCreated,
    deAlFirst,
    skAlFirst,
    alConnectorFirst,
    deHealthFirst,
    deHealthSecond,
    skHealthFirst,
    skHealthSecond,
    connectorFirst,
    connectorSecond,
    completeness,
    connectorStatus: connector.status,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0F audit failed"}\n`);
  process.exitCode = 1;
});
