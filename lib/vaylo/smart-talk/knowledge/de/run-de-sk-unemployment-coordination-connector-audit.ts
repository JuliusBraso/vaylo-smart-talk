/**
 * CB-0J dedicated local audit for the DE↔SK unemployment coordination connector.
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
  CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES,
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
  buildEuFamilyBenefitsCoordinationPack,
  validateEuFamilyBenefitsCoordinationPack,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import {
  EU_SHARED_ART1F_CLAIM_KEY,
  EU_SHARED_ART61_CLAIM_KEY,
  EU_SHARED_ART62_CLAIM_KEY,
  EU_SHARED_ART64_CLAIM_KEY,
  EU_SHARED_ART65_CLAIM_KEY,
  EU_SHARED_ART65A_CLAIM_KEY,
  EU_SHARED_DECISION_U3_CLAIM_KEY,
  EU_SHARED_JELTES_CLAIM_KEY,
  EU_SHARED_PD_U1_CLAIM_KEY,
  EU_SHARED_PD_U2_CLAIM_KEY,
  EU_SHARED_PD_U3_CLAIM_KEY,
  EU_UNEMP_PACK_ID,
  buildEuUnemploymentCoordinationPack,
  validateEuUnemploymentCoordinationPack,
} from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import { ALG_UNITS, buildAlgFederalCorePack } from "../packs/de/arbeitslosengeld/arbeitslosengeld-federal-core-pack";
import { buildKindergeldFederalCorePack } from "../packs/de/familienkasse-kindergeld/kindergeld-federal-core-pack";
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
import { buildDeFamilyBenefitsCoordinationRoutingPack } from "../packs/de/family-benefits-coordination-routing/de-family-benefits-coordination-routing-pack";
import { buildSkFamilyBenefitsAdapterPack } from "../packs/sk/family-benefits/sk-family-benefits-adapter-pack";
import { buildDeSkFamilyBenefitsCoordinationConnectorPack } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import {
  DE_AGENTUR_FUER_ARBEIT_ROLE,
  DE_UE_ART9_PUBLICATION_DATE,
  DE_UE_NEGATIVE_CONTROLS,
  DE_UE_OFFICIAL_SOURCES,
  DE_UE_PACK_ID,
  DE_UE_PRIMARY_PROCESS_KEY,
  DE_UE_PROCESSES,
  DE_UE_UNITS,
  buildDeUnemploymentCoordinationRoutingPack,
} from "../packs/de/unemployment-coordination-routing/de-unemployment-coordination-routing-pack";
import {
  SK_SOCPOIST_ROLE,
  SK_UE_ART9_PUBLICATION_DATE,
  SK_UE_CANONICAL_LANGUAGE,
  SK_UE_NEGATIVE_CONTROLS,
  SK_UE_OFFICIAL_SOURCES,
  SK_UE_PACK_ID,
  SK_UE_PRIMARY_PROCESS_KEY,
  SK_UE_PROCESSES,
  SK_UE_UNITS,
  SK_UE_2026_TAPER_GATE,
  SK_UPSVAR_EMPLOYMENT_ROLE,
  buildSkUnemploymentCoordinationAdapterPack,
} from "../packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack";
import {
  ARTICLE_65A_ACTIVE_FOR_DE_SK,
  DE_SK_UE_DE_CLAIM_KEYS,
  DE_SK_UE_EU_CLAIM_KEYS,
  DE_SK_UE_PROCESSES,
  DE_SK_UE_REUSED_ALG_KEYS,
  DE_SK_UE_SCENARIOS,
  DE_SK_UE_SK_CLAIM_KEYS,
  DE_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID,
  DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
  buildDeSkUnemploymentCoordinationConnectorPack,
  deSkUnemploymentConnectorSummary,
  evaluateDeSkUnemploymentArticle65a,
  evaluateDeSkUnemploymentProcessCompleteness,
  evaluateDeSkUnemploymentSelfEmployedHardening,
  evaluateDeSkUnemploymentTemporal,
} from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0j_core";
const PASSWORD = `cb0j-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0j-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/059_add_de_sk_unemployment_coordination_ingestion.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const DE_RPC = "select public.knowledge_ingest_curated_de_corridor_routing_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Wohnsitz|Verordnung|Träger|nicht|keine|kein|für/iu;
const SK_HOSTS = new Set([
  "www.slov-lex.sk", "www.socpoist.sk", "www.employment.gov.sk", "www.upsvr.gov.sk",
  "employment-social-affairs.ec.europa.eu",
]);
const DE_HOSTS = new Set([
  "www.gesetze-im-internet.de", "www.arbeitsagentur.de", "employment-social-affairs.ec.europa.eu",
]);
const EU_COPIED = /key: "ue-art-61-aggregation"|key: "ue-art-65-frontier-residence"|key: "ue-art-65a-self-employed-exception"|Nach Artikel 61 sind in einem anderen Mitgliedstaat zurückgelegte Versicherungs/u;
const SK_UNIT_PREFIX = /^sk-ue-/u;

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
  const euUnemp = buildEuUnemploymentCoordinationPack();
  const alg = buildAlgFederalCorePack();
  const kindergeld = buildKindergeldFederalCorePack();
  const skAl = buildSkApplicableLegislationAdapterPack();
  const deAl = buildDeApplicableLegislationRoutingPack();
  const alConnector = buildDeSkApplicableLegislationConnectorPack();
  const skHealth = buildSkHealthInsuranceCoordinationAdapterPack();
  const deHealth = buildDeHealthInsuranceCoordinationRoutingPack();
  const healthConnector = buildDeSkHealthInsuranceCoordinationConnectorPack();
  const deFamily = buildDeFamilyBenefitsCoordinationRoutingPack();
  const skFamily = buildSkFamilyBenefitsAdapterPack();
  const familyConnector = buildDeSkFamilyBenefitsCoordinationConnectorPack();
  const deUe = buildDeUnemploymentCoordinationRoutingPack();
  const skUe = buildSkUnemploymentCoordinationAdapterPack();
  const connector = buildDeSkUnemploymentCoordinationConnectorPack();
  const completeness = evaluateDeSkUnemploymentProcessCompleteness();
  const article65a = evaluateDeSkUnemploymentArticle65a();
  const seHardening = evaluateDeSkUnemploymentSelfEmployedHardening();
  const temporal = evaluateDeSkUnemploymentTemporal();
  const summary = deSkUnemploymentConnectorSummary(connector);
  const deSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "unemployment-coordination-routing", "de-unemployment-coordination-routing-pack.ts",
  );
  const skSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "sk",
    "unemployment-coordination", "sk-unemployment-coordination-adapter-pack.ts",
  );
  const connectorSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de-sk",
    "unemployment-coordination", "de-sk-unemployment-coordination-connector-pack.ts",
  );
  const euUnempSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "eu",
    "unemployment-coordination", "eu-unemployment-coordination-core-pack.ts",
  );
  const migration058 = source("supabase", "migrations", "058_add_eu_unemployment_coordination_ingestion.sql");
  const migration059 = source("supabase", "migrations", "059_add_de_sk_unemployment_coordination_ingestion.sql");
  const skUrls = skUe.sources.map((item) => String(item.canonicalUrl));
  const deUrls = deUe.sources.map((item) => String(item.canonicalUrl));
  const completeDims = PROCESS_COMPLETE_DIMENSIONS.every((dimension) => (
    DE_UE_PROCESSES.every((process) => Boolean(process.dimensions[dimension]))
    && SK_UE_PROCESSES.every((process) => Boolean(process.dimensions[dimension]))
  ));

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && validateCuratedDomainPack(germanKindergeldFixture()).valid
      && validateCuratedDomainPack(alg).valid
      && validateCuratedDomainPack(kindergeld).valid,
    sharedEuClaimsReused: validateEuApplicableLegislationCorePack(euAl).valid
      && validateEuUnemploymentCoordinationPack(euUnemp).valid
      && validateEuHealthInsuranceCoordinationPack(euHealth).valid
      && validateEuFamilyBenefitsCoordinationPack(euFamily).valid
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART61_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART62_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART64_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART65_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART65A_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART1F_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U1_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U2_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U3_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_JELTES_CLAIM_KEY)
      && DE_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_DECISION_U3_CLAIM_KEY)
      && completeness.copiedEuClaimCount === 0
      && !EU_COPIED.test(deSource)
      && !EU_COPIED.test(skSource)
      && !EU_COPIED.test(connectorSource),
    germanAlgCoreReused: DE_SK_UE_REUSED_ALG_KEYS.every((key) => (
      ALG_UNITS.some((unit) => unit.key === key)
      && !DE_UE_UNITS.some((unit) => unit.key === key)
    ))
      && DE_UE_UNITS.every((unit) => unit.key.startsWith("de-ue-")),
    deRouting: deUe.packId === DE_UE_PACK_ID
      && deUe.trustDomain.code === "de"
      && deUe.jurisdictions[0]?.level === "de_federal"
      && DE_UE_PROCESSES.length === 12
      && completeDims
      && DE_UE_NEGATIVE_CONTROLS.every((key) => DE_UE_UNITS.some((unit) => unit.key === key))
      && deUrls.every((url) => DE_HOSTS.has(new URL(url).host) && !url.includes("#"))
      && new Set(deUrls).size === deUrls.length
      && DE_AGENTUR_FUER_ARBEIT_ROLE === "DE_AGENTUR_FUER_ARBEIT"
      && DE_UE_PRIMARY_PROCESS_KEY === "de-ue-employee-alg-cross-border",
    skAdapter: validateForeignNationalAdapterPack(skUe).valid
      && skUe.packId === SK_UE_PACK_ID
      && skUe.countryCode === "SK"
      && skUe.trustDomain.code === "sk"
      && skUe.canonicalLanguage === SK_UE_CANONICAL_LANGUAGE
      && skUe.jurisdictions[0]?.level === "foreign_national"
      && SK_UE_PROCESSES.length === 16
      && SK_SOCPOIST_ROLE === "SK_SOCIALNA_POISTOVNA"
      && SK_UPSVAR_EMPLOYMENT_ROLE === "SK_UPSVAR_EMPLOYMENT_SERVICES"
      && SK_UE_NEGATIVE_CONTROLS.every((key) => SK_UE_UNITS.some((unit) => unit.key === key))
      && SK_UE_OFFICIAL_SOURCES.every((item) => SK_HOSTS.has(item.officialDomain))
      && skUrls.every((url) => !url.includes("#"))
      && new Set(skUrls).size === skUrls.length
      && !/wikipedia|reddit|linkedin|kpmg|payroll|forum|financnykompas/iu.test(skUrls.join("\n"))
      && FOREIGN_NATIONAL_ADAPTER_COUNTRIES.join(",") === "SK"
      && SK_UE_UNITS.every((unit) => SK_UNIT_PREFIX.test(unit.key))
      && SK_UE_PRIMARY_PROCESS_KEY === "sk-ue-uoz-registration"
      && SK_UE_2026_TAPER_GATE === "2026-01-01",
    connectorPrepared: connector.status === DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS
      && (connector.status as string) !== "active"
      && connector.packId === DE_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID
      && connector.originMarket === "DE"
      && connector.connectedCountry === "SK"
      && connector.activationFromLocaleAllowed === false
      && connector.activationRequiresVerifiedCaseContext === true
      && validateCuratedCrossBorderConnectorPack(connector).valid
      && CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU"
      && DE_SK_UE_PROCESSES.length === 18
      && completeness.processCompletenessPercent === 100
      && completeness.blockedScenarioCount === 0
      && completeness.totalScenarios === 80
      && completeness.coveredScenarioCount === 78
      && completeness.outOfScopeScenarioCount === 2
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    article65a: article65a.article65aActiveForDeSk === false
      && article65a.article65aActiveForDeResidence === false
      && article65a.article65aActiveForSkResidence === false
      && article65a.deSystemCoveragePossible
      && article65a.skSystemCoveragePossible
      && article65a.sharedCapabilityPreserved
      && article65a.staleDeclarationRejected
      && article65a.tamperSelfEmployedAutoRejected
      && article65a.tamperSkResidenceRejected
      && article65a.tamperDeResidenceRejected
      && article65a.declarationChangeCovered
      && article65a.systemVsPersonSeparated
      && article65a.hypotheticalFutureRepresentable
      && article65a.currentDeclarationsVerified
      && ARTICLE_65A_ACTIVE_FOR_DE_SK === false
      && /2026-08-06/.test(deSource)
      && /2026-08-06/.test(skSource)
      && DE_UE_ART9_PUBLICATION_DATE === "2026-08-06"
      && SK_UE_ART9_PUBLICATION_DATE === "2026-08-06"
      && euUnemp.packId === EU_UNEMP_PACK_ID,
    proofs: DE_UE_UNITS.some((unit) => unit.key === "de-ue-28a-not-automatic")
      && DE_UE_UNITS.some((unit) => unit.key === "de-ue-28a-15h-entry")
      && DE_UE_UNITS.some((unit) => unit.key === "de-ue-u1-employee")
      && DE_UE_UNITS.some((unit) => unit.key === "de-ue-u1-self-employed")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-szco-not-automatic")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-active-szco-uoz-blocked")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-730-day-gate")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-2026-taper")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-26-week-not-730")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-socpoist-not-upsvr")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-u1-employee")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-u1-self-employed")
      && SK_UE_UNITS.some((unit) => unit.key === "sk-ue-u2-to-de")
      && DE_UE_UNITS.some((unit) => unit.key === "de-ue-u2-before-departure")
      && seHardening.selfEmployedExplicit
      && seHardening.de28aNotAutomatic
      && seHardening.skNotAutomatic
      && seHardening.mixedDelegatesToApplicableLegislation
      && seHardening.uozBlocked
      && seHardening.de15hNotTransferred
      && seHardening.negativeControlsPresent
      && temporal.sk2025Vs2026Split
      && temporal.currentThreeMonthVsProposedSix
      && temporal.currentArt65VsProposal
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("SELF_EMPLOYED")
      && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("EMPLOYED"),
    germanNormalizedLanguage: skUe.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text)))
      && deUe.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    localeAndNationality: detectMissingCrossBorderFacts(
      { persons: [], period: null },
      ["WORKER"],
      ["residenceState", "activityState"],
    ).includes("person:WORKER")
      && validateCrossBorderCaseContext({
        persons: [{ role: "WORKER", residenceState: "SK", activityState: "DE" }],
        period: { from: "2026-09-01" },
        unemployment: { activityType: "SELF_EMPLOYED", lastActivityState: "DE", residenceState: "SK" },
      }).valid
      && !validateCrossBorderCaseContext({
        persons: [{ role: "WORKER", residenceState: "SK", activityState: "DE" }],
        period: { from: "2026-09-01" },
        unemployment: { activityType: "EMPLOYEE" as never },
      }).valid
      && alConnector.status === DE_SK_CONNECTOR_STATUS
      && deAl.trustDomain.code === "de"
      && validateForeignNationalAdapterPack(skHealth).valid
      && deHealth.trustDomain.code === "de"
      && healthConnector.connectedCountry === "SK"
      && familyConnector.connectedCountry === "SK"
      && deFamily.trustDomain.code === "de"
      && skFamily.countryCode === "SK",
    migration059: migration059.includes("sk_unemployment_coordination_adapter")
      && migration059.includes("de_unemployment_coordination_routing")
      && migration059.includes("de_sk_unemployment_coordination_connector")
      && !/grant execute/i.test(migration059)
      && !/create table if not exists public\.knowledge_/i.test(migration059)
      && migration059.includes("CONNECTOR_ACTIVE_FORBIDDEN")
      && migration059.includes("'planned'")
      && migration059.includes("'prepared'")
      && !migration058.includes("sk_unemployment_coordination_adapter")
      && !migration058.includes("de_unemployment_coordination_routing")
      && DE_SK_UE_DE_CLAIM_KEYS.length > 0
      && DE_SK_UE_SK_CLAIM_KEYS.length === SK_UE_UNITS.length
      && DE_UE_OFFICIAL_SOURCES.some((item) => item.url.includes("Art%209"))
      && SK_UE_OFFICIAL_SOURCES.some((item) => item.url.includes("Art%209")),
    noPublicRuntime: summary.validation.productionEligible === false,
    noProductionInteraction: true,
    proposedLaw: COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && /ue-proposed-six-month-not-current/.test(connectorSource)
      && /ue-proposed-22-week-not-current/.test(connectorSource)
      && !/activityType\s*===\s*["']EMPLOYED["']/u.test(connectorSource)
      && /Artikel 65a DE-SK aktuell sperren/.test(connectorSource)
      && /Artikel 65a/.test(euUnempSource),
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0j",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let algCreated = -1;
  let euAlCreated = -1;
  let euUnempFirst = -1;
  let euUnempSecond = -1;
  let skAlFirst = -1;
  let skHealthFirst = -1;
  let deUeFirst = -1;
  let deUeSecond = -1;
  let skUeFirst = -1;
  let skUeSecond = -1;
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

    algCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [alg])).rows[0]);
    euAlCreated = semanticCreated((await ingestor.query(EU_RPC, [euAl])).rows[0]);
    euUnempFirst = semanticCreated((await ingestor.query(EU_RPC, [euUnemp])).rows[0]);
    euUnempSecond = semanticCreated((await ingestor.query(EU_RPC, [euUnemp])).rows[0]);
    skAlFirst = semanticCreated((await ingestor.query(SK_RPC, [skAl])).rows[0]);
    skHealthFirst = semanticCreated((await ingestor.query(SK_RPC, [skHealth])).rows[0]);
    deUeFirst = semanticCreated((await ingestor.query(DE_RPC, [deUe])).rows[0]);
    deUeSecond = semanticCreated((await ingestor.query(DE_RPC, [deUe])).rows[0]);
    skUeFirst = semanticCreated((await ingestor.query(SK_RPC, [skUe])).rows[0]);
    skUeSecond = semanticCreated((await ingestor.query(SK_RPC, [skUe])).rows[0]);
    connectorFirst = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);
    connectorSecond = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);

    const stored = await admin.query(
      `select c.status, c.connected_country, c.activation_from_locale_allowed
         from public.knowledge_cross_border_connectors c
        where c.connected_country='SK'`,
    );
    const ueCorridor = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='de_sk_unemployment_coordination_connector'",
    );
    const skClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='foreign_national' and j.country_code='SK'
         and t.code='sk' and c.claim_language='de'`,
    );
    const art65aExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: EU_SHARED_ART65A_CLAIM_KEY })],
    );
    const art61Exact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: EU_SHARED_ART61_CLAIM_KEY })],
    );
    const de28aExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "de-ue-28a-not-automatic" })],
    );
    const skSzcoExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "sk-ue-szco-not-automatic" })],
    );
    const algHoursExact = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id=$1",
      [factoryIdForStableRef({ entityClass: "claims", key: "under-15-hours-not-destroy" })],
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
    const czPack = { ...skUe, countryCode: "CZ" as const, packId: SK_UE_PACK_ID };
    const plPack = { ...skUe, countryCode: "PL" };
    const huPack = { ...skUe, countryCode: "HU" };
    const unknownPack = { ...skUe, countryCode: "XX" };
    const activeConnector = { ...connector, status: "active" as const };
    const groupDef = String(groupCheck.rows[0]?.def ?? "");

    live.algIngested = algCreated > 0;
    live.euAlIngested = euAlCreated > 0;
    live.euUnempFirstCreated = euUnempFirst > 0;
    live.euUnempSecondZero = euUnempSecond === 0;
    live.skAlStillAccepted = skAlFirst > 0;
    live.skHealthStillAccepted = skHealthFirst > 0;
    live.deUeFirstCreated = deUeFirst > 0;
    live.deUeSecondZero = deUeSecond === 0;
    live.skUeFirstCreated = skUeFirst > 0;
    live.skUeSecondZero = skUeSecond === 0;
    live.connectorFirstCreated = connectorFirst > 0;
    live.connectorSecondZero = connectorSecond === 0;
    live.skJurisdiction = Number(skClaims.rows[0]?.n)
      === skAl.claims.length + skHealth.claims.length + skUe.claims.length;
    live.exactOneRefs = Number(art65aExact.rows[0]?.n) === 1
      && Number(art61Exact.rows[0]?.n) === 1
      && Number(de28aExact.rows[0]?.n) === 1
      && Number(skSzcoExact.rows[0]?.n) === 1
      && Number(algHoursExact.rows[0]?.n) === 1;
    live.connectorPreparedNonActive = stored.rows[0]?.status === "prepared"
      && stored.rows[0]?.connected_country === "SK"
      && stored.rows[0]?.activation_from_locale_allowed === false
      && Number(activeCorridors.rows[0]?.n) === 0
      && Number(ueCorridor.rows[0]?.n) === DE_SK_UE_PROCESSES.length;
    live.ueCorridorProcessCount = Number(ueCorridor.rows[0]?.n) === DE_SK_UE_PROCESSES.length;
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
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.processGroupCheck = groupDef.includes("sk_unemployment_coordination_adapter")
      && groupDef.includes("de_unemployment_coordination_routing")
      && groupDef.includes("de_sk_unemployment_coordination_connector")
      && groupDef.includes("eu_unemployment_coordination")
      && groupDef.includes("sk_family_benefits_adapter")
      && groupDef.includes("de_family_benefits_coordination_routing")
      && groupDef.includes("de_sk_family_benefits_coordination_connector")
      && groupDef.includes("sk_health_insurance_coordination_adapter")
      && groupDef.includes("sk_applicable_legislation_adapter")
      && groupDef.includes("eu_applicable_legislation");
    live.scenarioMatrix = DE_SK_UE_SCENARIOS.length === 80
      && DE_UE_OFFICIAL_SOURCES.length === 7;
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
    algCreated,
    euAlCreated,
    euUnempFirst,
    euUnempSecond,
    skAlFirst,
    skHealthFirst,
    deUeFirst,
    deUeSecond,
    skUeFirst,
    skUeSecond,
    connectorFirst,
    connectorSecond,
    completeness,
    article65a,
    selfEmployedHardening: seHardening,
    temporal,
    connectorStatus: connector.status,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0J audit failed"}\n`);
  process.exitCode = 1;
});
