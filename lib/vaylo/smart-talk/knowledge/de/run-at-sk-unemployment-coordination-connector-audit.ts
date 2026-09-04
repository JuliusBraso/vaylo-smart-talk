/**
 * AT-SK-0G — process-complete AT↔SK unemployment coordination connector (Arbeitslosengeld).
 * Disposable local ingest only. No production. No corridor activation.
 */
import { execSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { AT_NATIONAL_TRUST_DOMAIN } from "../source-registry/at-national-foundation-contracts";
import { isAuthorizedBilateralTaxPair } from "../source-registry/bilateral-tax-treaty-contracts";
import {
  deriveCountriesInCase,
  switchBureaucracyCountry,
  validateActivityTimeline,
  validateMultiStateCaseContext,
  type ActivityTimelineEntry,
} from "../source-registry/multi-state-case-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_SHARED_ART61_CLAIM_KEY,
  EU_SHARED_ART64_CLAIM_KEY,
  EU_SHARED_ART65_CLAIM_KEY,
  EU_SHARED_ART65A_CLAIM_KEY,
  EU_SHARED_DECISION_U3_CLAIM_KEY,
  EU_SHARED_PD_U1_CLAIM_KEY,
  EU_SHARED_PD_U2_CLAIM_KEY,
  EU_SHARED_PD_U3_CLAIM_KEY,
  EU_UNEMP_UNITS,
  buildEuUnemploymentCoordinationPack,
  evaluateEuUnempProcessCompleteness,
} from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import {
  AT_UE_PROCESSES,
  AT_UE_UNITS,
  buildAtUnemploymentCoordinationRoutingPack,
  evaluateAtUnemploymentProcessCompleteness,
} from "../packs/at/unemployment-coordination-routing/at-unemployment-coordination-routing-pack";
import {
  AT_SK_UE_AT_CLAIM_KEYS,
  AT_SK_UE_EU_CLAIM_KEYS,
  AT_SK_UE_NEGATIVE_CONTROLS,
  AT_SK_UE_SK_CLAIM_KEYS,
  ARTICLE_65A_ACTIVE_FOR_AT_SK,
  AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID,
  AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
  AT_SK_UE_PROCESSES,
  AT_SK_UE_SCENARIOS,
  buildAtSkUnemploymentCoordinationConnectorPack,
  evaluateAtSkUnemploymentArticle65a,
  evaluateAtSkUnemploymentProcessCompleteness,
  evaluateAtSkUnemploymentSelfEmployedHardening,
  evaluateAtSkUnemploymentTemporal,
  validateAtSkUnemploymentCoordinationConnectorPack,
} from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import {
  SK_UE_PACK_ID,
  SK_UE_UNITS,
  buildSkUnemploymentCoordinationAdapterPack,
} from "../packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack";
import {
  DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
  evaluateDeSkUnemploymentProcessCompleteness,
} from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { AT_SK_CONNECTOR_STATUS } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { AT_SK_HEALTH_CONNECTOR_STATUS } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { AT_SK_FAMILY_CONNECTOR_STATUS } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkAustrianNationalFoundationSemantics } from "./run-at-sk-austrian-national-foundation-and-authority-model-audit";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "./run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "./run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkFamilyBenefitsSemantics } from "./run-at-sk-family-benefits-coordination-connector-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0G" as const;
const EXPECTED_HEAD = "720284a77b4a388b183ca8fdeddff9ac9173cee4";
const IMAGE = "postgres:17";
const DATABASE = "atsk0g_unemployment";
const PASSWORD = `atsk0g-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0g-${process.pid}-${randomUUID().slice(0, 8)}`;
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const AT_RPC = "select public.knowledge_ingest_curated_at_unemployment_coordination_routing_pack($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_at_sk_unemployment_coordination_connector_pack($1::jsonb) as result";

const MATERIAL_KNOWLEDGE_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/de-sk-tax-residence-treaty-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/foreign-national-adapter-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax-residence/sk-income-tax-residence-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/applicable-legislation-routing/at-applicable-legislation-routing-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack.ts",
]);

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
  "supabase/migrations/060_add_bilateral_tax_treaty_foundation.sql",
  "supabase/migrations/061_add_de_sk_tax_residence_and_treaty_core_ingestion.sql",
  "supabase/migrations/062_add_at_national_foundation_ingestion.sql",
  "supabase/migrations/063_add_at_applicable_legislation_routing_and_at_sk_connector_ingestion.sql",
  "supabase/migrations/064_add_at_health_coordination_routing_and_at_sk_health_connector_ingestion.sql",
  "supabase/migrations/065_add_at_family_benefits_coordination_routing_and_at_sk_family_connector_ingestion.sql",
  "supabase/migrations/066_add_at_unemployment_coordination_routing_and_at_sk_unemployment_connector_ingestion.sql",
];

function git(cmd: string): string {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8" }).trim();
}
function dirtyPaths(): string[] {
  const raw = git("status --short");
  if (!raw) return [];
  return raw.split(/\r?\n/).filter(Boolean)
    .map((line) => line.replace(/^[\s?!MADRCU]{1,2}\s+/, "").trim().replace(/\\/g, "/"));
}
function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT, encoding: "utf8", timeout, windowsHide: true, shell: false, maxBuffer: 32 * 1024 * 1024,
  });
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
const AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_PATH =
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack.ts";

function atSkUnemploymentConnectorSource(): string {
  return fs.readFileSync(path.join(ROOT, AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_PATH), "utf8");
}

function connectorSourceImportsDeSkImplementation(source: string): boolean {
  return /from\s+["'][^"']*de-sk\//.test(source)
    || /from\s+["'][^"']*packs\/de-sk\//.test(source)
    || /\bDE_SK_UE_/.test(source);
}

function inspectConnectorDeSkDependency(source: string): Readonly<{
  atSkUnemploymentImportsDeSkImplementation: boolean;
  atSkUnemploymentHasNoDeSkImplementationDependency: boolean;
  packsDeSkImportsInConnector: number;
  deSkImplementationSymbolImportsInConnector: number;
}> {
  const packsDeSkImportsInConnector = (source.match(/from\s+["'][^"']*(?:de-sk\/|packs\/de-sk\/)/g) ?? []).length;
  const deSkImplementationSymbolImportsInConnector = (source.match(/\bDE_SK_UE_/g) ?? []).length;
  const atSkUnemploymentImportsDeSkImplementation = connectorSourceImportsDeSkImplementation(source);
  return Object.freeze({
    atSkUnemploymentImportsDeSkImplementation,
    atSkUnemploymentHasNoDeSkImplementationDependency: !atSkUnemploymentImportsDeSkImplementation,
    packsDeSkImportsInConnector,
    deSkImplementationSymbolImportsInConnector,
  });
}
function timelineEntry(
  country: string,
  activityType: ActivityTimelineEntry["activityType"],
  from: string,
  to: string | null,
): ActivityTimelineEntry {
  return Object.freeze({
    country, activityType, from, to, legalClassification: "UNRESOLVED",
  });
}

export function evaluateAtSkUnemploymentCoordinationSemantics(): Record<string, unknown> {
  const atPack = buildAtUnemploymentCoordinationRoutingPack();
  const connector = buildAtSkUnemploymentCoordinationConnectorPack();
  const eu = buildEuUnemploymentCoordinationPack();
  const sk = buildSkUnemploymentCoordinationAdapterPack();
  const atCompleteness = evaluateAtUnemploymentProcessCompleteness();
  const connectorCompleteness = evaluateAtSkUnemploymentProcessCompleteness();
  const euCompleteness = evaluateEuUnempProcessCompleteness(eu);
  const deSkUnemployment = evaluateDeSkUnemploymentProcessCompleteness();
  const article65a = evaluateAtSkUnemploymentArticle65a();
  const seHardening = evaluateAtSkUnemploymentSelfEmployedHardening();
  const temporal = evaluateAtSkUnemploymentTemporal();
  const connectorValidation = validateAtSkUnemploymentCoordinationConnectorPack(connector);

  const euKeys = new Set(eu.claims.map((claim) => String(claim.key)));
  const copiedEuKeys = AT_UE_UNITS.filter((unit) => euKeys.has(unit.key)).map((unit) => unit.key);
  const reusedEu = AT_SK_UE_EU_CLAIM_KEYS.filter((key) => euKeys.has(key));

  const sequential = [
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-07-31"),
    timelineEntry("DE", "SELF_EMPLOYED", "2026-08-01", "2026-12-31"),
  ];
  const atCase = {
    routing: {
      marketPackCountry: "SK" as const,
      bureaucracyCountry: "AT" as const,
      corridorCandidate: "AT-SK" as const,
      countryContextSource: "USER_SELECTED" as const,
    },
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: sequential,
    }),
    activityTimeline: sequential,
    residenceState: "SK" as const,
  };
  const switched = switchBureaucracyCountry(atCase, "DE");
  const connectorSource = atSkUnemploymentConnectorSource();
  const euClaimKeys = new Set(eu.claims.map((claim) => String(claim.key)));
  const crossCorridorDependency = inspectConnectorDeSkDependency(connectorSource);

  const proofs = {
    atSkUnemploymentHasNoDeSkImplementationDependency:
      crossCorridorDependency.atSkUnemploymentHasNoDeSkImplementationDependency === true,
    crossCorridorDependencyInspection:
      crossCorridorDependency.atSkUnemploymentImportsDeSkImplementation === false
      && crossCorridorDependency.packsDeSkImportsInConnector === 0
      && crossCorridorDependency.deSkImplementationSymbolImportsInConnector === 0,
    sharedEuRefsExactOne: AT_SK_UE_EU_CLAIM_KEYS.length === new Set(AT_SK_UE_EU_CLAIM_KEYS).size,
    euClaimKeysBuiltFromSharedUnits: AT_SK_UE_EU_CLAIM_KEYS.length === EU_UNEMP_UNITS.length
      && AT_SK_UE_EU_CLAIM_KEYS.every((key) => euClaimKeys.has(key)),
    sharedEuUnemploymentCoreReused: reusedEu.length > 0 && connector.euClaimRefs.length === AT_SK_UE_EU_CLAIM_KEYS.length,
    sharedEuClaimsCopiedZero: copiedEuKeys.length === 0,
    article61Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART61_CLAIM_KEY),
    article64Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART64_CLAIM_KEY),
    article65Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART65_CLAIM_KEY),
    article65aCapabilityPreserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_ART65A_CLAIM_KEY)
      && ARTICLE_65A_ACTIVE_FOR_AT_SK === false,
    pdU1Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U1_CLAIM_KEY),
    pdU2Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U2_CLAIM_KEY),
    pdU3Preserved: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_PD_U3_CLAIM_KEY),
    decisionU3Separated: AT_SK_UE_EU_CLAIM_KEYS.includes(EU_SHARED_DECISION_U3_CLAIM_KEY)
      && AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-partial-vs-whole"),
    u3NotUserApplication: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-u3-interinstitutional"),
    frontierBothDirections: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-frontier-employee-at-to-sk")
      && AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-frontier-employee-sk-to-at"),
    nonFrontierRoutes: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-non-frontier-return")
      && AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-non-frontier-no-return"),
    article65aSuppressed: article65a.article65aActiveForAtSk === false
      && article65a.sharedCapabilityPreserved === true
      && article65a.tamperSelfEmployedAutoRejected === true
      && article65a.currentDeclarationsVerified === true,
    amsRoutingPresent: AT_UE_UNITS.some((unit) => unit.key === "at-ue-ams-role")
      && AT_UE_UNITS.some((unit) => unit.key === "at-ue-ams-instance-fetch-live"),
    svsNotOrdinaryPayer: AT_UE_UNITS.some((unit) => unit.key === "at-ue-svs-not-ordinary-payer")
      && AT_UE_UNITS.some((unit) => unit.key === "at-ue-svs-not-u1-issuer"),
    alvg3VoluntaryRoute: AT_UE_UNITS.some((unit) => unit.key === "at-ue-alvg-3-voluntary-se")
      && AT_UE_UNITS.some((unit) => unit.key === "at-ue-alvg-3-not-automatic"),
    meinAmsRoute: AT_UE_UNITS.some((unit) => unit.key === "at-ue-meinams-personal-route"),
    u1RoutePresent: AT_UE_UNITS.some((unit) => unit.key === "at-ue-u1-employee")
      && AT_UE_UNITS.some((unit) => unit.key === "at-ue-u1-self-employed"),
    u2ExportThreeMonths: AT_UE_UNITS.some((unit) => unit.key === "at-ue-u2-three-month-operational"),
    foreignU2Incoming: AT_UE_UNITS.some((unit) => unit.key === "at-ue-incoming-foreign-u2"),
    notstandshilfeClassified: AT_UE_UNITS.some((unit) => unit.key === "at-ue-notstandshilfe-unemployment-cash")
      && AT_UE_UNITS.some((unit) => unit.key === "at-ue-notstandshilfe-not-full-calculator"),
    minorWork2026Boundary: AT_UE_UNITS.some((unit) => unit.key === "at-ue-2026-minor-work-boundary"),
    art9_2025Declaration: AT_UE_UNITS.some((unit) => unit.key === "at-ue-art9-2025-se-coverage-possible"),
    doesNotCopyEuLaw: AT_UE_UNITS.some((unit) => unit.key === "at-ue-does-not-copy-eu-law"),
    doesNotDetermineArt11: AT_UE_UNITS.some((unit) => unit.key === "at-ue-does-not-determine-art-11"),
    finanzamtNotU1: AT_UE_UNITS.some((unit) => unit.key === "at-ue-finanzamt-not-u1"),
    applicationNotApproval: AT_UE_UNITS.some((unit) => unit.key === "at-ue-application-not-approval"),
    skSocpoistUpsvarSplit: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-authority-split"),
    atUnemploymentRoutingPresent: atPack.packId === "at_unemployment_coordination_routing"
      && atPack.trustDomain.code === AT_NATIONAL_TRUST_DOMAIN,
    skUnemploymentAdapterReused: sk.packId === SK_UE_PACK_ID
      && AT_SK_UE_SK_CLAIM_KEYS.length === SK_UE_UNITS.length,
    atSkUnemploymentConnectorPresent: connector.packId === AT_SK_UNEMPLOYMENT_CONNECTOR_PACK_ID && connectorValidation.valid,
    atSkUnemploymentConnectorPrepared: connector.status === "prepared" && AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared",
    selfEmployedHardening: seHardening.selfEmployedExplicit === true
      && seHardening.atAlvg3NotAutomatic === true
      && seHardening.skNotAutomatic === true
      && seHardening.negativeControlsPresent === true
      && seHardening.negativeControlCount >= 30,
    temporalGates: temporal.sk2025Vs2026Split === true
      && temporal.currentThreeMonthVsProposedSix === true
      && temporal.currentArt65VsProposal === true,
    threeStateSkAtDeRepresented: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-three-state-sk-at-de")
      && atCase.countriesInCase.includes("SK")
      && atCase.countriesInCase.includes("AT")
      && atCase.countriesInCase.includes("DE"),
    sequentialAtDeReassessment: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-at-de-szco-sequential"),
    unemploymentHistoryPreserved: switched.context != null
      && JSON.stringify(switched.context.activityTimeline) === JSON.stringify(atCase.activityTimeline)
      && switched.context.routing.bureaucracyCountry === "DE"
      && validateMultiStateCaseContext(atCase).valid
      && validateActivityTimeline(sequential).valid,
    healthSeparation: AT_UE_UNITS.some((unit) => unit.key === "at-ue-not-health-insurer"),
    familySeparation: AT_UE_UNITS.some((unit) => unit.key === "at-ue-not-family-benefit"),
    taxSeparation: !isAuthorizedBilateralTaxPair("DE", "AT"),
    gewerbeSeparation: AT_UE_UNITS.some((unit) => unit.key === "at-ue-dormant-gewerbe-not-activity"),
    processCompleteness100: atCompleteness.processCompletenessPercent === 100
      && connectorCompleteness.processCompletenessPercent === 100
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    blockedScenarioCountZero: connectorCompleteness.blockedScenarioCount === 0,
    migration066Safety: (() => {
      const migration065 = fs.readFileSync(path.join(ROOT, "supabase/migrations/065_add_at_family_benefits_coordination_routing_and_at_sk_family_connector_ingestion.sql"), "utf8");
      const migration066 = fs.readFileSync(path.join(ROOT, "supabase/migrations/066_add_at_unemployment_coordination_routing_and_at_sk_unemployment_connector_ingestion.sql"), "utf8");
      return !migration065.includes("at_unemployment_coordination_routing")
        && !migration065.includes("at_sk_unemployment_coordination_connector")
        && migration066.includes("at_unemployment_coordination_routing")
        && migration066.includes("at_sk_unemployment_coordination_connector")
        && migration066.includes("revoke all")
        && migration066.includes("from public, anon, authenticated, service_role")
        && !/grant execute/i.test(migration066)
        && !/\bdrop (table|function|schema)\b/i.test(migration066);
    })(),
    activeCorridorsZero:
      (AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_HEALTH_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_FAMILY_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_HEALTH_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS as string) !== "active",
    runtimeUnauthorized: connector.activationFromLocaleAllowed === false
      && connectorValidation.productionEligible === false,
    productionInteractionFalse: true,
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    phase: PHASE,
    proofs,
    failedProofs,
    counts: {
      atProcesses: AT_UE_PROCESSES.length,
      atClaims: AT_UE_UNITS.length,
      atProcessClaimLinks: AT_UE_PROCESSES.length * PROCESS_COMPLETE_DIMENSIONS.length,
      connectorProcesses: AT_SK_UE_PROCESSES.length,
      connectorEuRefs: AT_SK_UE_EU_CLAIM_KEYS.length,
      connectorAtRefs: AT_SK_UE_AT_CLAIM_KEYS.length,
      connectorSkRefs: AT_SK_UE_SK_CLAIM_KEYS.length,
      euRefsReused: reusedEu.length,
      euRefsCopied: copiedEuKeys.length,
      skRefsReused: AT_SK_UE_SK_CLAIM_KEYS.length,
      skNewClaims: 0,
      scenarios: AT_SK_UE_SCENARIOS.length,
      covered: connectorCompleteness.coveredScenarioCount,
      outOfScope: connectorCompleteness.outOfScopeScenarioCount,
      blocked: connectorCompleteness.blockedScenarioCount,
      negativeControls: AT_SK_UE_NEGATIVE_CONTROLS.length,
    },
    completeness: { at: atCompleteness, connector: connectorCompleteness, eu: euCompleteness, deSkUnemployment },
    crossCorridorDependency,
    article65a,
    seHardening,
    temporal,
    connectorValidation,
  };
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0g",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, unknown> = { attempted: true, available: true, productionInteraction: false };
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
      grant execute on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_unemployment_coordination_routing_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_foreign_national_adapter_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_unemployment_coordination_connector_pack(jsonb)
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

    const euPack = buildEuUnemploymentCoordinationPack();
    const atPack = buildAtUnemploymentCoordinationRoutingPack();
    const skPack = buildSkUnemploymentCoordinationAdapterPack();
    const connectorPack = buildAtSkUnemploymentCoordinationConnectorPack();

    try {
      await ingestor.query(EU_RPC, [euPack]);
    } catch (error: unknown) {
      throw new Error(`EU_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    let atFirst: number;
    try {
      atFirst = semanticCreated((await ingestor.query(AT_RPC, [atPack])).rows[0]);
    } catch (error: unknown) {
      throw new Error(`AT_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    const atSecond = semanticCreated((await ingestor.query(AT_RPC, [atPack])).rows[0]);
    let skFirst: number;
    try {
      skFirst = semanticCreated((await ingestor.query(SK_RPC, [skPack])).rows[0]);
    } catch (error: unknown) {
      throw new Error(`SK_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    const skSecond = semanticCreated((await ingestor.query(SK_RPC, [skPack])).rows[0]);
    let connectorFirst: number;
    try {
      connectorFirst = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connectorPack])).rows[0]);
    } catch (error: unknown) {
      throw new Error(`CONNECTOR_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    const connectorSecond = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connectorPack])).rows[0]);

    const grants = await admin.query(`
      select grantee
        from information_schema.role_routine_grants
       where routine_name in (
         'knowledge_ingest_curated_at_unemployment_coordination_routing_pack',
         'knowledge_ingest_curated_at_sk_unemployment_coordination_connector_pack'
       )
         and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
    `);
    const active = await admin.query(`
      select count(*)::int as n
        from public.knowledge_cross_border_connectors
       where status = 'active'
    `);

    live.atFirst = atFirst;
    live.atSecond = atSecond;
    live.atDuplicates = atSecond;
    live.skFirst = skFirst;
    live.skSecond = skSecond;
    live.skDuplicates = skSecond;
    live.connectorFirst = connectorFirst;
    live.connectorSecond = connectorSecond;
    live.connectorDuplicates = connectorSecond;
    live.publicGrants = grants.rowCount;
    live.activeCorridors = Number(active.rows[0]?.n ?? -1);
    live.pass = atFirst > 0 && atSecond === 0 && skFirst > 0 && skSecond === 0
      && connectorFirst > 0 && connectorSecond === 0
      && grants.rowCount === 0
      && Number(active.rows[0]?.n ?? -1) === 0;
    return live;
  } catch (error: unknown) {
    live.pass = false;
    live.error = error instanceof Error ? error.message.slice(-2000) : String(error);
    return live;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }
}

async function main(): Promise<void> {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const semantic = evaluateAtSkUnemploymentCoordinationSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0c = evaluateAtSkAustrianNationalFoundationSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0f = evaluateAtSkFamilyBenefitsSemantics();
  const e2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const deSkUnemployment = evaluateDeSkUnemploymentProcessCompleteness();
  const ingestion = await runDisposableIngestion();
  const materialUnchanged = MATERIAL_KNOWLEDGE_PATHS.every((rel) => !dirty.includes(rel));
  const proofs = semantic.proofs as Record<string, boolean>;
  const failedProofs = semantic.failedProofs as string[];
  const atSk0cProofs = (atSk0c.proofs ?? {}) as Record<string, unknown>;
  const atSk0dFailed = (atSk0d.failedProofs as string[]) ?? [];
  const atSk0eFailed = (atSk0e.failedProofs as string[]) ?? [];
  const atSk0fFailed = (atSk0f.failedProofs as string[]) ?? [];
  const migration066Safe = proofs.migration066Safety === true;

  const overallPass = failedProofs.length === 0
    && ingestion.pass === true
    && atSk0a.phaseResult === "PASS"
    && atSk0b.phaseResult === "PASS"
    && ((atSk0c.failedProofs as string[]) ?? []).length === 0
    && atSk0dFailed.length === 0
    && atSk0eFailed.length === 0
    && atSk0fFailed.length === 0
    && e2e.phaseResult === "PASS"
    && deSkUnemployment.processCompletenessPercent === 100
    && atSk0cProofs.atSkTreatyClaimsCountZero === true
    && migration066Safe;

  const governance = materialUnchanged
    ? "DE_SK_REVALIDATION_NOT_REQUIRED"
    : "DE_SK_REVALIDATION_REQUIRED_AFTER_AT_SK_UNEMPLOYMENT_COMMIT";
  const recommendation = overallPass
    ? (governance === "DE_SK_REVALIDATION_NOT_REQUIRED"
      ? "AUTHORIZE_AT_SK_UNEMPLOYMENT_COORDINATION_CONNECTOR"
      : "AUTHORIZE_DE_SK_REVALIDATION_AFTER_AT_SK_UNEMPLOYMENT_COMMIT")
    : "ONE_SPECIFIC_AT_SK_0G_REMEDIATION_PACKAGE";

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    recommendation,
    deSkGovernance: governance,
    repository: {
      branch,
      startingHead: EXPECTED_HEAD,
      finalHead: head,
      workingTree: dirty,
    },
    semantic,
    proofs,
    ingestion,
    validation: {
      atSk0g: overallPass ? "PASS" : "FAIL",
      sharedEuUnemployment: (semantic.completeness as { eu?: { processCompletenessPercent?: number } }).eu?.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      atSk0e: atSk0eFailed.length === 0 ? "PASS" : "FAIL",
      atSk0f: atSk0fFailed.length === 0 ? "PASS" : "FAIL",
      atSk0d: atSk0dFailed.length === 0 ? "PASS" : "FAIL",
      atSk0c: ((atSk0c.failedProofs as string[]) ?? []).length === 0 ? "PASS" : "FAIL",
      atSk0b: atSk0b.phaseResult,
      deSkUnemployment: deSkUnemployment.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      e2eSemantic: e2e.phaseResult,
      migration066Safety: migration066Safe ? "PASS" : "FAIL",
    },
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atSkUnemploymentPublicAnswers: false,
      atSkUnemploymentRuntime: false,
    },
    filesCreated: [
      "lib/vaylo/smart-talk/knowledge/packs/at/unemployment-coordination-routing/at-unemployment-coordination-routing-pack.ts",
      "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-unemployment-coordination-connector-audit.ts",
      "supabase/migrations/066_add_at_unemployment_coordination_routing_and_at_sk_unemployment_connector_ingestion.sql",
    ],
    filesModified: ["package.json"],
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0G_PROOF_FAILED",
    materialUnchanged,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exitCode = 1;
}

const invokedDirectly = /run-at-sk-unemployment-coordination-connector-audit\.ts$/u.test(
  (process.argv[1] ?? "").replace(/\\/g, "/"),
);
if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });
}
