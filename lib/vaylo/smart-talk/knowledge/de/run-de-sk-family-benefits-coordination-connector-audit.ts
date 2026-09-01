/**
 * CB-0H dedicated local audit for the DE↔SK family-benefits coordination connector.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { KNOWLEDGE_FACTORY_DOMAINS, validateCuratedDomainPack } from "../source-registry/knowledge-factory-contracts";
import {
  COD_2016_0397_STATUS,
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
  buildEuHealthInsuranceCoordinationPack,
  validateEuHealthInsuranceCoordinationPack,
} from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import {
  EU_SHARED_ART1Z_CLAIM_KEY,
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_ART68_CLAIM_KEY,
  EU_SHARED_ART682_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  buildEuFamilyBenefitsCoordinationPack,
  validateEuFamilyBenefitsCoordinationPack,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { buildKindergeldFederalCorePack } from "../packs/de/familienkasse-kindergeld/kindergeld-federal-core-pack";
import { buildElgFederalCorePack } from "../packs/de/elterngeld/elterngeld-federal-core-pack";
import {
  SK_AL_PACK_ID,
  buildSkApplicableLegislationAdapterPack,
} from "../packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import { buildDeApplicableLegislationRoutingPack } from "../packs/de/applicable-legislation-routing/de-applicable-legislation-routing-pack";
import {
  DE_SK_CONNECTOR_STATUS,
  buildDeSkApplicableLegislationConnectorPack,
} from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { buildSkHealthInsuranceCoordinationAdapterPack } from "../packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack";
import { buildDeHealthInsuranceCoordinationRoutingPack } from "../packs/de/health-insurance-coordination-routing/de-health-insurance-coordination-routing-pack";
import { buildDeSkHealthInsuranceCoordinationConnectorPack } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import {
  DE_FAMILY_NEGATIVE_CONTROLS,
  DE_FAMILY_OFFICIAL_SOURCES,
  DE_FAMILY_PACK_ID,
  DE_FAMILY_PRIMARY_PROCESS_KEY,
  DE_FAMILY_PROCESSES,
  DE_FAMILY_UNITS,
  DE_FAMILIENKASSE_ROLE,
  DE_ELTERNGELDSTELLE_ROLE,
  buildDeFamilyBenefitsCoordinationRoutingPack,
} from "../packs/de/family-benefits-coordination-routing/de-family-benefits-coordination-routing-pack";
import {
  SK_FAMILY_CANONICAL_LANGUAGE,
  SK_FAMILY_AUTHORITY_ROLE,
  SK_FAMILY_NEGATIVE_CONTROLS,
  SK_FAMILY_OFFICIAL_SOURCES,
  SK_FAMILY_PACK_ID,
  SK_FAMILY_PRIMARY_PROCESS_KEY,
  SK_FAMILY_PROCESSES,
  SK_FAMILY_UNITS,
  buildSkFamilyBenefitsAdapterPack,
} from "../packs/sk/family-benefits/sk-family-benefits-adapter-pack";
import {
  DE_SK_FAMILY_CONNECTOR_PACK_ID,
  DE_SK_FAMILY_CONNECTOR_STATUS,
  DE_SK_FB_DE_CLAIM_KEYS,
  DE_SK_FB_EU_CLAIM_KEYS,
  DE_SK_FAMILY_PROCESSES,
  DE_SK_FB_REUSED_KINDERGELD_KEYS,
  DE_SK_FB_REUSED_ELTERNGELD_KEYS,
  DE_SK_FAMILY_SCENARIOS,
  DE_SK_FB_SK_CLAIM_KEYS,
  buildDeSkFamilyBenefitsCoordinationConnectorPack,
  deSkFamilyConnectorSummary,
  evaluateDeSkFamilyProcessCompleteness,
} from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0h_core";
const PASSWORD = `cb0h-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0h-${process.pid}-${randomUUID().slice(0, 8)}`;
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
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const DE_RPC = "select public.knowledge_ingest_curated_de_corridor_routing_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Familie|Kind|Wohnsitz|Verordnung|Träger|vorrang|nachrang|nicht|keine|kein/iu;
const SK_HOSTS = new Set(["www.slov-lex.sk", "www.employment.gov.sk", "www.upsvr.gov.sk", "www.mpsvr.sk"]);
const DE_HOSTS = new Set(["www.arbeitsagentur.de", "www.familienportal.de"]);
const EU_COPIED = /key: "art-67-family-residing-elsewhere"|key: "art-68-priority-rules"|key: "art-1z-family-benefit"|Eine Person hat Anspruch auf Familienleistungen nach den Rechtsvorschriften des zuständigen Mitgliedstaats auch für Familienangehörige/u;
const SK_UNIT_PREFIX = /^(sk-child-|sk-parental-|sk-fb-|sk-priplatok-|sk-birth-|sk-substitute-|sk-childcare-)/u;

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
  const euFamily = buildEuFamilyBenefitsCoordinationPack();
  const kindergeld = buildKindergeldFederalCorePack();
  const elterngeld = buildElgFederalCorePack();
  const skAl = buildSkApplicableLegislationAdapterPack();
  const deAl = buildDeApplicableLegislationRoutingPack();
  const alConnector = buildDeSkApplicableLegislationConnectorPack();
  const skHealth = buildSkHealthInsuranceCoordinationAdapterPack();
  const deHealth = buildDeHealthInsuranceCoordinationRoutingPack();
  const healthConnector = buildDeSkHealthInsuranceCoordinationConnectorPack();
  const deFamily = buildDeFamilyBenefitsCoordinationRoutingPack();
  const skFamily = buildSkFamilyBenefitsAdapterPack();
  const connector = buildDeSkFamilyBenefitsCoordinationConnectorPack();
  const completeness = evaluateDeSkFamilyProcessCompleteness();
  const summary = deSkFamilyConnectorSummary(connector);
  const deSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "family-benefits-coordination-routing", "de-family-benefits-coordination-routing-pack.ts",
  );
  const skSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "sk",
    "family-benefits", "sk-family-benefits-adapter-pack.ts",
  );
  const connectorSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de-sk",
    "family-benefits-coordination", "de-sk-family-benefits-coordination-connector-pack.ts",
  );
  const migration057 = source(
    "supabase", "migrations", "057_add_de_sk_family_benefits_coordination_ingestion.sql",
  );
  const skUrls = skFamily.sources.map((item) => String(item.canonicalUrl));
  const deUrls = deFamily.sources.map((item) => String(item.canonicalUrl));
  const f3Text = String(euFamily.claims.find((claim) => claim.key === EU_SHARED_F3_CLAIM_KEY)?.text ?? "");

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && validateCuratedDomainPack(germanKindergeldFixture()).valid
      && validateCuratedDomainPack(kindergeld).valid,
    euCoresReused: validateEuApplicableLegislationCorePack(euAl).valid
      && validateEuFamilyBenefitsCoordinationPack(euFamily).valid
      && validateEuHealthInsuranceCoordinationPack(euHealth).valid
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_F3_CLAIM_KEY)
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_ART67_CLAIM_KEY)
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_ART68_CLAIM_KEY)
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_ART60_CLAIM_KEY)
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_ART1Z_CLAIM_KEY)
      && DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_ART682_CLAIM_KEY)
      && !EU_COPIED.test(deSource)
      && !EU_COPIED.test(skSource)
      && !EU_COPIED.test(connectorSource),
    germanCoresReused: DE_SK_FB_REUSED_KINDERGELD_KEYS.every((key) => (
      kindergeld.claims.some((claim) => claim.key === key)
      && !DE_FAMILY_UNITS.some((unit) => unit.key === key)
    ))
      && DE_SK_FB_REUSED_ELTERNGELD_KEYS.every((key) => (
        elterngeld.claims.some((claim) => claim.key === key)
        && !DE_FAMILY_UNITS.some((unit) => unit.key === key)
      ))
      && DE_FAMILY_UNITS.every((unit) => unit.key.startsWith("de-fb-")),
    deRouting: deFamily.packId === DE_FAMILY_PACK_ID
      && deFamily.trustDomain.code === "de"
      && deFamily.jurisdictions[0]?.level === "de_federal"
      && DE_FAMILY_PROCESSES.length === 11
      && DE_FAMILY_NEGATIVE_CONTROLS.every((key) => DE_FAMILY_UNITS.some((unit) => unit.key === key))
      && deUrls.every((url) => DE_HOSTS.has(new URL(url).host) && !url.includes("#"))
      && new Set(deUrls).size === deUrls.length
      && DE_FAMILIENKASSE_ROLE === "DE_FAMILIENKASSE"
      && DE_ELTERNGELDSTELLE_ROLE === "DE_ELTERNGELDSTELLE",
    skAdapter: validateForeignNationalAdapterPack(skFamily).valid
      && skFamily.packId === SK_FAMILY_PACK_ID
      && skFamily.countryCode === "SK"
      && skFamily.trustDomain.code === "sk"
      && skFamily.canonicalLanguage === SK_FAMILY_CANONICAL_LANGUAGE
      && skFamily.jurisdictions[0]?.level === "foreign_national"
      && SK_FAMILY_PROCESSES.length === 14
      && SK_FAMILY_AUTHORITY_ROLE === "SK_UPSVAR_FAMILY_BENEFITS"
      && SK_FAMILY_NEGATIVE_CONTROLS.every((key) => SK_FAMILY_UNITS.some((unit) => unit.key === key))
      && SK_FAMILY_OFFICIAL_SOURCES.every((item) => SK_HOSTS.has(item.officialDomain))
      && skUrls.every((url) => !url.includes("#"))
      && new Set(skUrls).size === skUrls.length
      && !/wikipedia|reddit|linkedin|kpmg|payroll|forum|financnykompas/iu.test(skUrls.join("\n"))
      && FOREIGN_NATIONAL_ADAPTER_COUNTRIES.join(",") === "SK"
      && SK_FAMILY_UNITS.every((unit) => SK_UNIT_PREFIX.test(unit.key)),
    connectorPrepared: connector.status === DE_SK_FAMILY_CONNECTOR_STATUS
      && (connector.status as string) !== "active"
      && connector.packId === DE_SK_FAMILY_CONNECTOR_PACK_ID
      && connector.originMarket === "DE"
      && connector.connectedCountry === "SK"
      && connector.activationFromLocaleAllowed === false
      && connector.activationRequiresVerifiedCaseContext === true
      && validateCuratedCrossBorderConnectorPack(connector).valid
      && CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU"
      && DE_SK_FAMILY_PROCESSES.length === 29
      && completeness.processCompletenessPercent === 100
      && completeness.blockedScenarioCount === 0
      && completeness.totalScenarios === 69
      && completeness.coveredScenarioCount === 67
      && completeness.outOfScopeScenarioCount === 2
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    decisionF3: DE_SK_FB_EU_CLAIM_KEYS.includes(EU_SHARED_F3_CLAIM_KEY)
      && /Familienmitglied/.test(f3Text)
      && DE_SK_FAMILY_SCENARIOS.some((scenario) => (
        scenario.id === "naive-pairing-rejected" && scenario.coverage === "COVERED"
      )),
    annexI: SK_FAMILY_UNITS.some((unit) => unit.key === "sk-birth-allowance-excluded-annex-i")
      && SK_FAMILY_UNITS.some((unit) => unit.key === "sk-substitute-maintenance-excluded")
      && DE_SK_FAMILY_SCENARIOS.some((scenario) => scenario.id === "birth-allowance-excluded")
      && DE_SK_FAMILY_SCENARIOS.some((scenario) => scenario.id === "substitute-excluded"),
    noNaivePairing: connectorSource.includes("fb-f3-not-one-benefit-pair")
      && !/key:\s*"[^"]*259-60/.test(connectorSource)
      && !/259\s*Euro\s+minus\s+60/.test(connectorSource),
    kindergeldAmount259: kindergeld.claims.some((claim) => (
      claim.key === "amount-259-from-2026" && String(claim.text).includes("259")
    )),
    germanNormalizedLanguage: skFamily.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text)))
      && deFamily.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    localeAndNationality: detectMissingCrossBorderFacts(
      { persons: [], period: null },
      ["PARENT_A"],
      ["residenceState", "activityState"],
    ).includes("person:PARENT_A")
      && validateCrossBorderCaseContext({
        persons: [{ role: "PARENT_A", residenceState: "SK", activityState: "DE" }],
        period: { from: "2026-08-31" },
        familyBenefits: { childResidenceKnown: true, primaryBenefitState: "DE" },
      }).valid
      && alConnector.status === DE_SK_CONNECTOR_STATUS
      && deAl.trustDomain.code === "de"
      && validateForeignNationalAdapterPack(skHealth).valid
      && deHealth.trustDomain.code === "de"
      && healthConnector.connectedCountry === "SK",
    migration057: migration057.includes("sk_family_benefits_adapter")
      && migration057.includes("de_family_benefits_coordination_routing")
      && migration057.includes("de_sk_family_benefits_coordination_connector")
      && !/grant execute/i.test(migration057)
      && !/create table if not exists public\.knowledge_/i.test(migration057)
      && migration057.includes("CONNECTOR_ACTIVE_FORBIDDEN")
      && migration057.includes("'planned'")
      && migration057.includes("'prepared'")
      && DE_FAMILY_PRIMARY_PROCESS_KEY === "de-kg-cross-border-application"
      && SK_FAMILY_PRIMARY_PROCESS_KEY === "sk-child-application"
      && DE_SK_FB_DE_CLAIM_KEYS.length > 0
      && DE_SK_FB_SK_CLAIM_KEYS.length === SK_FAMILY_UNITS.length,
    noPublicRuntime: summary.validation.productionEligible === false,
    noProductionInteraction: true,
    proposedLaw: COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT",
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0h",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let kindergeldCreated = -1;
  let elterngeldCreated = -1;
  let euAlCreated = -1;
  let euFamilyFirst = -1;
  let euFamilySecond = -1;
  let skAlFirst = -1;
  let skHealthFirst = -1;
  let deFamilyFirst = -1;
  let deFamilySecond = -1;
  let skFamilyFirst = -1;
  let skFamilySecond = -1;
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

    kindergeldCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [kindergeld])).rows[0]);
    elterngeldCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [elterngeld])).rows[0]);
    euAlCreated = semanticCreated((await ingestor.query(EU_RPC, [euAl])).rows[0]);
    euFamilyFirst = semanticCreated((await ingestor.query(EU_RPC, [euFamily])).rows[0]);
    euFamilySecond = semanticCreated((await ingestor.query(EU_RPC, [euFamily])).rows[0]);
    skAlFirst = semanticCreated((await ingestor.query(SK_RPC, [skAl])).rows[0]);
    skHealthFirst = semanticCreated((await ingestor.query(SK_RPC, [skHealth])).rows[0]);
    deFamilyFirst = semanticCreated((await ingestor.query(DE_RPC, [deFamily])).rows[0]);
    deFamilySecond = semanticCreated((await ingestor.query(DE_RPC, [deFamily])).rows[0]);
    skFamilyFirst = semanticCreated((await ingestor.query(SK_RPC, [skFamily])).rows[0]);
    skFamilySecond = semanticCreated((await ingestor.query(SK_RPC, [skFamily])).rows[0]);
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
    const familyCorridor = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='de_sk_family_benefits_coordination_connector'",
    );
    const skFamilyClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='foreign_national' and j.country_code='SK'
         and t.code='sk' and c.claim_language='de'`,
    );
    const f3Exact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: EU_SHARED_F3_CLAIM_KEY })],
    );
    const kgExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "amount-259-from-2026" })],
    );
    const skChildExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "sk-child-amount-60-2026" })],
    );
    const art68Exact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: EU_SHARED_ART68_CLAIM_KEY })],
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const sourceDupes = await admin.query(
      `select canonical_url, count(*)::int n from public.knowledge_sources
        group by canonical_url having count(*)>1`,
    );
    const claimDupes = await admin.query(
      `select claim_text_canonical, jurisdiction_id, count(*)::int n from public.knowledge_claims
        group by claim_text_canonical, jurisdiction_id having count(*)>1`,
    );
    const czNational = await admin.query(
      `select count(*)::int n from public.knowledge_jurisdictions
        where country_code in ('CZ','PL','HU')`,
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name in (
          'knowledge_ingest_curated_foreign_national_adapter_pack',
          'knowledge_ingest_curated_de_corridor_routing_pack',
          'knowledge_ingest_curated_cross_border_connector_pack'
        )
          and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );
    const groupCheck = await admin.query(
      `select pg_get_constraintdef(oid) as def from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const czPack = { ...skFamily, countryCode: "CZ" as const, packId: SK_FAMILY_PACK_ID };
    const plPack = { ...skFamily, countryCode: "PL" };
    const huPack = { ...skFamily, countryCode: "HU" };
    const unknownPack = { ...skFamily, countryCode: "XX" };
    const activeConnector = { ...connector, status: "active" as const };
    const groupDef = String(groupCheck.rows[0]?.def ?? "");

    live.kindergeldIngested = kindergeldCreated > 0;
    live.elterngeldIngested = elterngeldCreated > 0;
    live.euAlIngested = euAlCreated > 0;
    live.euFamilyFirstCreated = euFamilyFirst > 0;
    live.euFamilySecondZero = euFamilySecond === 0;
    live.skAlStillAccepted = skAlFirst > 0;
    live.skHealthStillAccepted = skHealthFirst > 0;
    live.deFamilyFirstCreated = deFamilyFirst > 0;
    live.deFamilySecondZero = deFamilySecond === 0;
    live.skFamilyFirstCreated = skFamilyFirst > 0;
    live.skFamilySecondZero = skFamilySecond === 0;
    live.connectorFirstCreated = connectorFirst > 0;
    live.connectorSecondZero = connectorSecond === 0;
    live.skJurisdiction = Number(skFamilyClaims.rows[0]?.n)
      === skAl.claims.length + skHealth.claims.length + skFamily.claims.length;
    live.exactOneRefs = Number(f3Exact.rows[0]?.n) === 1
      && Number(kgExact.rows[0]?.n) === 1
      && Number(skChildExact.rows[0]?.n) === 1
      && Number(art68Exact.rows[0]?.n) === 1;
    live.connectorPreparedNonActive = stored.rows[0]?.status === "prepared"
      && stored.rows[0]?.connected_country === "SK"
      && stored.rows[0]?.activation_from_locale_allowed === false
      && Number(activeCorridors.rows[0]?.n) === 0
      && Number(familyCorridor.rows[0]?.n) === DE_SK_FAMILY_PROCESSES.length;
    live.familyCorridorProcessCount = Number(familyCorridor.rows[0]?.n) === 29;
    live.activeCorridorsZero = Number(activeCorridors.rows[0]?.n) === 0;
    live.noSourceDupes = sourceDupes.rows.length === 0;
    live.noClaimDupes = claimDupes.rows.length === 0;
    live.czPlHuNationalAbsent = Number(czNational.rows[0]?.n) === 0;
    live.czBlocked = await rejects(ingestor, SK_RPC, czPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.plBlocked = await rejects(ingestor, SK_RPC, plPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.huBlocked = await rejects(ingestor, SK_RPC, huPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.unknownBlocked = await rejects(ingestor, SK_RPC, unknownPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.connectorActiveRejected = await rejects(
      ingestor, CONNECTOR_RPC, activeConnector, "CONNECTOR_ACTIVE_FORBIDDEN",
    );
    try {
      await ingestor.query(SK_RPC, [skAl]);
      live.alPackStillAccepted = skAl.packId === SK_AL_PACK_ID;
    } catch {
      live.alPackStillAccepted = false;
    }
    try {
      await ingestor.query(SK_RPC, [skHealth]);
      live.healthPackStillAccepted = true;
    } catch {
      live.healthPackStillAccepted = false;
    }
    try {
      await ingestor.query(SK_RPC, [skFamily]);
      live.familyPackAllowed = true;
    } catch {
      live.familyPackAllowed = false;
    }
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.processGroupCheck = groupDef.includes("sk_family_benefits_adapter")
      && groupDef.includes("de_family_benefits_coordination_routing")
      && groupDef.includes("de_sk_family_benefits_coordination_connector")
      && groupDef.includes("sk_health_insurance_coordination_adapter")
      && groupDef.includes("de_health_insurance_coordination_routing")
      && groupDef.includes("de_sk_health_insurance_coordination_connector")
      && groupDef.includes("sk_applicable_legislation_adapter")
      && groupDef.includes("de_applicable_legislation_routing")
      && groupDef.includes("de_sk_applicable_legislation_connector")
      && groupDef.includes("eu_family_benefits_coordination")
      && groupDef.includes("eu_health_insurance_coordination")
      && groupDef.includes("eu_applicable_legislation");
    live.primaryProcessPresent = DE_FAMILY_OFFICIAL_SOURCES.length === 4
      && DE_SK_FAMILY_SCENARIOS.length === 69;
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
    kindergeldCreated,
    elterngeldCreated,
    euAlCreated,
    euFamilyFirst,
    euFamilySecond,
    skAlFirst,
    skHealthFirst,
    deFamilyFirst,
    deFamilySecond,
    skFamilyFirst,
    skFamilySecond,
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
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0H audit failed"}\n`);
  process.exitCode = 1;
});
