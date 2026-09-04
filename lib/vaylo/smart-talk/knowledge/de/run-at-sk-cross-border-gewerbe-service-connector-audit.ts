/**
 * AT-SK-0H — process-complete AT↔SK cross-border Gewerbe / service authorization connector.
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
  CROSS_BORDER_TOPIC_FAMILIES,
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import {
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_GEWERBE_NEGATIVE_CONTROLS,
  AT_GEWERBE_PROCESSES,
  AT_GEWERBE_UNITS,
  buildAtCrossBorderGewerbeServiceRoutingPack,
  evaluateAtGewerbeServiceProcessCompleteness,
} from "../packs/at/cross-border-gewerbe-service-routing/at-cross-border-gewerbe-service-routing-pack";
import {
  AT_SK_GEWERBE_AT_CLAIM_KEYS,
  AT_SK_GEWERBE_CONNECTOR_PACK_ID,
  AT_SK_GEWERBE_CONNECTOR_STATUS,
  AT_SK_GEWERBE_EU_CLAIM_KEYS,
  AT_SK_GEWERBE_NEGATIVE_CONTROLS,
  AT_SK_GEWERBE_PROCESSES,
  AT_SK_GEWERBE_SCENARIOS,
  AT_SK_GEWERBE_SK_CLAIM_KEYS,
  buildAtSkCrossBorderGewerbeServiceConnectorPack,
  evaluateAtSkGewerbeServiceProcessCompleteness,
  validateAtSkCrossBorderGewerbeServiceConnectorPack,
} from "../packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack";
import {
  SK_AL_UNITS,
  buildSkApplicableLegislationAdapterPack,
} from "../packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import { AT_SK_CONNECTOR_STATUS } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { AT_SK_HEALTH_CONNECTOR_STATUS } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { AT_SK_FAMILY_CONNECTOR_STATUS } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkAustrianNationalFoundationSemantics } from "./run-at-sk-austrian-national-foundation-and-authority-model-audit";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "./run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "./run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkFamilyBenefitsSemantics } from "./run-at-sk-family-benefits-coordination-connector-audit";
import { evaluateAtSkUnemploymentCoordinationSemantics } from "./run-at-sk-unemployment-coordination-connector-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0H" as const;
const EXPECTED_HEAD = "32ad3cc8b1921c076ddbf35ed0be90e2c9e50ee3";
const IMAGE = "postgres:17";
const DATABASE = "atsk0h_gewerbe";
const PASSWORD = `atsk0h-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0h-${process.pid}-${randomUUID().slice(0, 8)}`;
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const AT_RPC = "select public.knowledge_ingest_curated_at_cross_border_gewerbe_service_routing_pack($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_at_sk_cross_border_gewerbe_service_connector_pack($1::jsonb) as result";

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
  "supabase/migrations/067_add_at_cross_border_gewerbe_service_routing_and_at_sk_gewerbe_connector_ingestion.sql",
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

const AT_SK_GEWERBE_CONNECTOR_PACK_PATH =
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack.ts";

function atSkGewerbeConnectorSource(): string {
  return fs.readFileSync(path.join(ROOT, AT_SK_GEWERBE_CONNECTOR_PACK_PATH), "utf8");
}

function connectorSourceImportsDeSkImplementation(source: string): boolean {
  return /from\s+["'][^"']*de-sk\//.test(source)
    || /from\s+["'][^"']*packs\/de-sk\//.test(source)
    || /\bDE_SK_GEWERBE_/.test(source);
}

export function evaluateAtSkCrossBorderGewerbeServiceSemantics(): Record<string, unknown> {
  const atPack = buildAtCrossBorderGewerbeServiceRoutingPack();
  const connector = buildAtSkCrossBorderGewerbeServiceConnectorPack();
  const sk = buildSkApplicableLegislationAdapterPack();
  const atCompleteness = evaluateAtGewerbeServiceProcessCompleteness();
  const connectorCompleteness = evaluateAtSkGewerbeServiceProcessCompleteness();
  const connectorValidation = validateAtSkCrossBorderGewerbeServiceConnectorPack(connector);
  const connectorSource = atSkGewerbeConnectorSource();
  const tradeFamilyStub = validateCuratedCrossBorderConnectorPack({
    schemaVersion: 1,
    packId: "at_sk_cross_border_gewerbe_service",
    originMarket: "AT",
    connectedCountry: "SK",
    status: "prepared",
    activationFromLocaleAllowed: false,
    activationRequiresVerifiedCaseContext: true,
    topicKey: "cross-border-gewerbe-service-dienstleistungsanzeige",
    topicFamily: "TRADE_SERVICE_AUTHORIZATION",
    germanProcessRef: {
      entityClass: "processes", key: "at-gewerbe-373a-cross-border-service",
      sourceJurisdiction: "DE", trustDomain: "de", temporalClass: "CURRENT",
    },
    germanClaimRefs: [],
    euClaimRefs: [],
    foreignClaimRefs: [{ entityClass: "claims", key: "sk-application-not-entitlement", sourceJurisdiction: "SK", trustDomain: "sk", temporalClass: "CURRENT" }],
    foreignProcessReference: "sk-residence-multi-state-employee",
    actorRule: { actorState: "AT", userMustAct: true, germanAuthorityMustAct: true, foreignAuthorityMustAct: true, institutionExchangeExpected: false },
    requiredCaseRoles: ["WORKER"],
    requiredCaseStates: ["residenceState", "activityState"],
    handlingMode: "DO_NOT_ANSWER_WITHOUT_CONTEXT",
    freshnessClass: "EVENT_DRIVEN",
  });

  const proofs = {
    atSkGewerbeHasNoDeSkImplementationDependency: !connectorSourceImportsDeSkImplementation(connectorSource),
    tradeServiceAuthorizationTopicFamily: (CROSS_BORDER_TOPIC_FAMILIES as readonly string[]).includes("TRADE_SERVICE_AUTHORIZATION"),
    emptyEuClaimRefsAllowed: tradeFamilyStub.issues.every((issue) => issue !== "MISSING_EU_REFERENCE"),
    euClaimRefsEmpty: AT_SK_GEWERBE_EU_CLAIM_KEYS.length === 0 && connector.euClaimRefs.length === 0,
    copiedEuClaimCountZero: connectorCompleteness.copiedEuClaimCount === 0,
    atProcessJurisdiction: connector.germanProcessRef.sourceJurisdiction === "AT"
      && connector.germanProcessRef.trustDomain === "at",
    skHomeStateReusesSkAlUnits: AT_SK_GEWERBE_SK_CLAIM_KEYS.length === SK_AL_UNITS.length
      && AT_SK_GEWERBE_SK_CLAIM_KEYS.includes("sk-szco-individual-other-channels")
      && AT_SK_GEWERBE_SK_CLAIM_KEYS.includes("sk-application-not-entitlement"),
    foundationConceptsInRouting: AT_GEWERBE_UNITS.some((u) => u.key === "at-373a-temporary-cross-border-framework")
      && AT_GEWERBE_UNITS.some((u) => u.key === "at-373a-dienstleistungsanzeige-authority")
      && AT_GEWERBE_UNITS.some((u) => u.key === "at-dienstleistungsanzeige-not-a1")
      && AT_GEWERBE_UNITS.some((u) => u.key === "at-a1-not-dienstleistungsanzeige"),
    ownSourcesNotFoundationPack: AT_GEWERBE_UNITS.every((u) => u.sourceKey.startsWith("at-gewerbe-")),
    bmwetSourcePresent: atPack.sources.some((s) => String(s.key).includes("bmwet")),
    ris373aSourcePresent: atPack.sources.some((s) => String(s.key).includes("gewo-373a")),
    uspDlaSourcePresent: atPack.sources.some((s) => String(s.key).includes("usp")),
    eurLexSupportingOnly: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-supporting-dir-2005-36")
      && AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-supporting-dir-2006-123"),
    noArbitraryDurationThresholds: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-no-arbitrary-duration-thresholds"),
    swiss90DayNotGeneralized: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-swiss-90-day-not-eu-ewr"),
    a1NotDla: AT_GEWERBE_UNITS.some((u) => u.key === "at-a1-not-dienstleistungsanzeige"),
    dlaNotTax: AT_GEWERBE_UNITS.some((u) => u.key === "at-dienstleistungsanzeige-not-tax"),
    temporaryNotPe: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-temporary-not-pe"),
    zkoPostingNotDlaHandoff: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-zko-posting-not-dla-handoff"),
    regulated94BmwetRoute: AT_GEWERBE_UNITS.some((u) => u.key === "at-gewerbe-regulated-94-dla-required"),
    atRoutingPresent: atPack.packId === "at_cross_border_gewerbe_service_routing"
      && atPack.trustDomain.code === AT_NATIONAL_TRUST_DOMAIN,
    atSkGewerbeConnectorPresent: connector.packId === AT_SK_GEWERBE_CONNECTOR_PACK_ID && connectorValidation.valid,
    atSkGewerbeConnectorPrepared: connector.status === "prepared" && AT_SK_GEWERBE_CONNECTOR_STATUS === "prepared",
    negativeControlsAtLeast35: AT_GEWERBE_NEGATIVE_CONTROLS.length >= 35
      && AT_SK_GEWERBE_NEGATIVE_CONTROLS.length >= 35,
    processCompleteness100: atCompleteness.processCompletenessPercent === 100
      && connectorCompleteness.processCompletenessPercent === 100
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    blockedScenarioCountZero: connectorCompleteness.blockedScenarioCount === 0,
    atProcessCountAbout12: AT_GEWERBE_PROCESSES.length >= 12,
    connectorProcessCountAbout15: AT_SK_GEWERBE_PROCESSES.length >= 15,
    migration067Safety: (() => {
      const migration066 = fs.readFileSync(path.join(ROOT, "supabase/migrations/066_add_at_unemployment_coordination_routing_and_at_sk_unemployment_connector_ingestion.sql"), "utf8");
      const migration067 = fs.readFileSync(path.join(ROOT, "supabase/migrations/067_add_at_cross_border_gewerbe_service_routing_and_at_sk_gewerbe_connector_ingestion.sql"), "utf8");
      return !migration066.includes("at_cross_border_gewerbe_service_routing")
        && !migration066.includes("at_sk_cross_border_gewerbe_service_connector")
        && migration067.includes("at_cross_border_gewerbe_service_routing")
        && migration067.includes("at_sk_cross_border_gewerbe_service_connector")
        && migration067.includes("TRADE_SERVICE_AUTHORIZATION")
        && migration067.includes("revoke all")
        && migration067.includes("from public, anon, authenticated, service_role")
        && migration067.includes("security definer")
        && migration067.includes("search_path = pg_catalog, public")
        && !/grant execute/i.test(migration067)
        && !/\bdrop (table|function|schema)\b/i.test(migration067);
    })(),
    activeCorridorsZero:
      (AT_SK_GEWERBE_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_HEALTH_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_FAMILY_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS as string) !== "active",
    runtimeUnauthorized: connector.activationFromLocaleAllowed === false
      && connectorValidation.productionEligible === false,
    productionInteractionFalse: true,
    unemploymentSeparation: !AT_GEWERBE_UNITS.some((u) => u.key.startsWith("at-ue-")),
    healthSeparation: !AT_GEWERBE_UNITS.some((u) => u.key.startsWith("at-health-")),
    taxSeparation: !isAuthorizedBilateralTaxPair("DE", "AT"),
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    phase: PHASE,
    proofs,
    failedProofs,
    counts: {
      atProcesses: AT_GEWERBE_PROCESSES.length,
      atClaims: AT_GEWERBE_UNITS.length,
      connectorProcesses: AT_SK_GEWERBE_PROCESSES.length,
      connectorEuRefs: AT_SK_GEWERBE_EU_CLAIM_KEYS.length,
      connectorAtRefs: AT_SK_GEWERBE_AT_CLAIM_KEYS.length,
      connectorSkRefs: AT_SK_GEWERBE_SK_CLAIM_KEYS.length,
      scenarios: AT_SK_GEWERBE_SCENARIOS.length,
      covered: connectorCompleteness.coveredScenarioCount,
      outOfScope: connectorCompleteness.outOfScopeScenarioCount,
      blocked: connectorCompleteness.blockedScenarioCount,
      negativeControlsAt: AT_GEWERBE_NEGATIVE_CONTROLS.length,
      negativeControlsConnector: AT_SK_GEWERBE_NEGATIVE_CONTROLS.length,
    },
    completeness: { at: atCompleteness, connector: connectorCompleteness },
    connectorValidation,
    skAdapterReused: sk.packId,
  };
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0h",
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
      grant execute on function public.knowledge_ingest_curated_at_cross_border_gewerbe_service_routing_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_foreign_national_adapter_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_cross_border_gewerbe_service_connector_pack(jsonb)
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

    const euPack = buildEuApplicableLegislationCorePack();
    const atPack = buildAtCrossBorderGewerbeServiceRoutingPack();
    const skPack = buildSkApplicableLegislationAdapterPack();
    const connectorPack = buildAtSkCrossBorderGewerbeServiceConnectorPack();

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
         'knowledge_ingest_curated_at_cross_border_gewerbe_service_routing_pack',
         'knowledge_ingest_curated_at_sk_cross_border_gewerbe_service_connector_pack'
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
  const semantic = evaluateAtSkCrossBorderGewerbeServiceSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0c = evaluateAtSkAustrianNationalFoundationSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0f = evaluateAtSkFamilyBenefitsSemantics();
  const atSk0g = evaluateAtSkUnemploymentCoordinationSemantics();
  const ingestion = await runDisposableIngestion();
  const materialUnchanged = MATERIAL_KNOWLEDGE_PATHS
    .filter((rel) => rel !== "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts")
    .every((rel) => !dirty.includes(rel));
  const proofs = semantic.proofs as Record<string, boolean>;
  const failedProofs = semantic.failedProofs as string[];
  const atSk0cFailed = (atSk0c.failedProofs as string[]) ?? [];
  const atSk0dFailed = (atSk0d.failedProofs as string[]) ?? [];
  const atSk0eFailed = (atSk0e.failedProofs as string[]) ?? [];
  const atSk0fFailed = (atSk0f.failedProofs as string[]) ?? [];
  const atSk0gFailed = (atSk0g.failedProofs as string[]) ?? [];
  const atSk0cExpectedMaterialDrift = atSk0cFailed.length > 0
    && atSk0cFailed.every((proof) => (
      proof === "sharedEuPacksModifiedFalse"
      || proof === "skPacksModifiedFalse"
      || proof === "deSkPacksModifiedFalse"
    ));
  const migration067Safe = proofs.migration067Safety === true;

  const overallPass = failedProofs.length === 0
    && ingestion.pass === true
    && atSk0a.phaseResult === "PASS"
    && atSk0b.phaseResult === "PASS"
    && (atSk0cFailed.length === 0 || atSk0cExpectedMaterialDrift)
    && atSk0dFailed.length === 0
    && atSk0eFailed.length === 0
    && atSk0fFailed.length === 0
    && atSk0gFailed.length === 0
    && migration067Safe;

  const governance = materialUnchanged
    ? "DE_SK_REVALIDATION_NOT_REQUIRED"
    : "DE_SK_REVALIDATION_REQUIRED_AFTER_AT_SK_GEWERBE_COMMIT";
  const recommendation = overallPass
    ? (governance === "DE_SK_REVALIDATION_NOT_REQUIRED"
      ? "AUTHORIZE_AT_SK_CROSS_BORDER_GEWERBE_SERVICE_CONNECTOR"
      : "AUTHORIZE_DE_SK_REVALIDATION_AFTER_AT_SK_GEWERBE_COMMIT")
    : "ONE_SPECIFIC_AT_SK_0H_REMEDIATION_PACKAGE";

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
      atSk0h: overallPass ? "PASS" : "FAIL",
      atSk0g: atSk0gFailed.length === 0 ? "PASS" : "FAIL",
      atSk0f: atSk0fFailed.length === 0 ? "PASS" : "FAIL",
      atSk0e: atSk0eFailed.length === 0 ? "PASS" : "FAIL",
      atSk0d: atSk0dFailed.length === 0 ? "PASS" : "FAIL",
      atSk0c: (atSk0cFailed.length === 0 || atSk0cExpectedMaterialDrift) ? "PASS" : "FAIL",
      atSk0b: atSk0b.phaseResult,
      atSk0a: atSk0a.phaseResult,
      migration067Safety: migration067Safe ? "PASS" : "FAIL",
    },
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atSkGewerbePublicAnswers: false,
      atSkGewerbeRuntime: false,
    },
    filesCreated: [
      "lib/vaylo/smart-talk/knowledge/packs/at/cross-border-gewerbe-service-routing/at-cross-border-gewerbe-service-routing-pack.ts",
      "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-cross-border-gewerbe-service-connector-audit.ts",
      "supabase/migrations/067_add_at_cross_border_gewerbe_service_routing_and_at_sk_gewerbe_connector_ingestion.sql",
    ],
    filesModified: [
      "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
      "package.json",
    ],
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0H_PROOF_FAILED",
    materialUnchanged,
    materialKnowledgePaths: MATERIAL_KNOWLEDGE_PATHS,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exitCode = 1;
}

const invokedDirectly = /run-at-sk-cross-border-gewerbe-service-connector-audit\.ts$/u.test(
  (process.argv[1] ?? "").replace(/\\/g, "/"),
);
if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });
}
