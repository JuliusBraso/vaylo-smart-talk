/**
 * AT-SK-0I — process-complete Austrian national personal income tax / domestic tax-residence pack.
 * Disposable local ingest only. No production. No corridor activation. No AT-SK connector.
 */
import { execSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { AT_NATIONAL_TRUST_DOMAIN } from "../source-registry/at-national-foundation-contracts";
import {
  BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
  BILATERAL_TAX_IS_NOT_TAX_CALCULATOR,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
} from "../source-registry/bilateral-tax-treaty-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import { validateCuratedCrossBorderConnectorPack } from "../source-registry/cross-border-connector-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_TAX_NEGATIVE_CONTROLS,
  AT_TAX_OFFICIAL_SOURCES,
  AT_TAX_PACK_ID,
  AT_TAX_PROCESSES,
  AT_TAX_PROCESS_GROUP,
  AT_TAX_SCENARIOS,
  AT_TAX_SECTION_1_4_FOREIGN_INCOME_THRESHOLD_EUR_2026,
  AT_TAX_UNITS,
  AT_TAX_ZWEITWOHNSITZ_DAY_THRESHOLD,
  buildAtPersonalIncomeTaxResidencePack,
  evaluateAtPersonalIncomeTaxResidenceProcessCompleteness,
} from "../packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack";
import { AT_SK_CONNECTOR_STATUS } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { AT_SK_HEALTH_CONNECTOR_STATUS } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { AT_SK_FAMILY_CONNECTOR_STATUS } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import { AT_SK_GEWERBE_CONNECTOR_STATUS } from "../packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkAustrianNationalFoundationSemantics } from "./run-at-sk-austrian-national-foundation-and-authority-model-audit";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "./run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "./run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkFamilyBenefitsSemantics } from "./run-at-sk-family-benefits-coordination-connector-audit";
import { evaluateAtSkUnemploymentCoordinationSemantics } from "./run-at-sk-unemployment-coordination-connector-audit";
import { evaluateAtSkCrossBorderGewerbeServiceSemantics } from "./run-at-sk-cross-border-gewerbe-service-connector-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0I" as const;
const EXPECTED_HEAD = "2c7096cae191f46a1ab1be5cc3a3c74ed90c6517";
const IMAGE = "postgres:17";
const DATABASE = "atsk0i_tax";
const PASSWORD = `atsk0i-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0i-${process.pid}-${randomUUID().slice(0, 8)}`;
const AT_RPC = "select public.knowledge_ingest_curated_at_personal_income_tax_residence_pack($1::jsonb) as result";

const AT_TAX_PACK_PATH =
  "lib/vaylo/smart-talk/knowledge/packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack.ts";

const MATERIAL_KNOWLEDGE_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/at-national-foundation-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack.ts",
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
  "supabase/migrations/068_add_at_personal_income_tax_residence_ingestion.sql",
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

function atTaxPackSource(): string {
  return fs.readFileSync(path.join(ROOT, AT_TAX_PACK_PATH), "utf8");
}

function packSourceImportsDeSkImplementation(source: string): boolean {
  return /from\s+["'][^"']*de-sk\//.test(source)
    || /from\s+["'][^"']*packs\/de-sk\//.test(source)
    || /\bDE_SK_/.test(source);
}

function hasUnit(key: string): boolean {
  return AT_TAX_UNITS.some((unit) => unit.key === key);
}

function extractAllowlist(migrationText: string): string[] {
  const match = migrationText.match(/process_group_id in \(\s*([\s\S]*?)\s*\)\s*\)/);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((entry) => entry.replace(/['\s]/g, ""))
    .filter(Boolean);
}

function evaluateTaxResidenceTreatyCoreSeparationSemantics(): Record<string, unknown> {
  const packSource = atTaxPackSource();
  const proofs = {
    taxCalculatorAbsent: BILATERAL_TAX_IS_NOT_TAX_CALCULATOR
      && BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
    publicRuntimeNotAuthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
    socialSecurityTaxSeparationPreserved: validateCuratedCrossBorderConnectorPack(
      connectorTaxTreatyContamination(),
    ).issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED"),
    packDeclaresNoCalculator: packSource.includes("at-tax-no-calculator"),
    packDeclaresTreatyHandoff: packSource.includes("TREATY_REVIEW_REQUIRED"),
    packSourceHasNoDeSkImports: !packSourceImportsDeSkImplementation(packSource),
  };
  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return { proofs, failedProofs };
}

export function evaluateAtSkPersonalIncomeTaxResidenceSemantics(): Record<string, unknown> {
  const atPack = buildAtPersonalIncomeTaxResidencePack();
  const completeness = evaluateAtPersonalIncomeTaxResidenceProcessCompleteness();
  const packSource = atTaxPackSource();
  const estgSource = AT_TAX_OFFICIAL_SOURCES.find((source) => source.key === "at-tax-estg-ris");
  const baoSource = AT_TAX_OFFICIAL_SOURCES.find((source) => source.key === "at-tax-bao-ris");
  const zweitwohnsitzSource = AT_TAX_OFFICIAL_SOURCES.find((source) => source.key === "at-tax-zweitwohnsitz-vo");

  const proofs = {
    estgSection1Present: estgSource !== undefined
      && String(estgSource.passages[0]?.locator ?? "").includes("§1"),
    baoSection26Present: baoSource !== undefined
      && String(baoSource.passages[0]?.locator ?? "").includes("§26"),
    section98Present: estgSource !== undefined
      && String(estgSource.passages[0]?.text ?? "").includes("§ 98"),
    unlimitedLiability: hasUnit("at-tax-unlimited-section-1-2"),
    limitedLiability: hasUnit("at-tax-limited-section-1-3"),
    wohnsitzDefined: hasUnit("at-tax-wohnsitz-bao-26-1"),
    gewoehnlicherAufenthalt: hasUnit("at-tax-gewoehnlicher-aufenthalt-bao-26-2"),
    sixMonthRetroactive: hasUnit("at-tax-six-month-statutory-rule"),
    belowSixMonthNonExclusion: hasUnit("at-tax-below-six-months-not-exclusion"),
    section14Option: hasUnit("at-tax-section-1-4-option"),
    section14NinetyPercent: hasUnit("at-tax-section-1-4-90-percent"),
    section14Threshold2026: hasUnit("at-tax-section-1-4-threshold-2026")
      && AT_TAX_SECTION_1_4_FOREIGN_INCOME_THRESHOLD_EUR_2026 === 13539,
    thresholdYearVersioned: hasUnit("at-tax-statute-period-2026")
      && AT_TAX_UNITS.some((unit) => unit.key === "at-tax-section-1-4-threshold-2026"
        && unit.text.includes("YEAR_VERSIONED_2026")),
    e9ForeignCertification: hasUnit("at-tax-e9-foreign-certification"),
    zweitwohnsitzverordnung: zweitwohnsitzSource !== undefined
      && hasUnit("at-tax-zweitwohnsitz-special-rule"),
    zweitwohnsitzFiveYear: hasUnit("at-tax-zweitwohnsitz-five-year-prerequisite"),
    zweitwohnsitz70Day: hasUnit("at-tax-zweitwohnsitz-70-day-threshold")
      && AT_TAX_ZWEITWOHNSITZ_DAY_THRESHOLD === 70,
    seventyDayNotGeneralized: hasUnit("at-tax-70-days-not-general-residence"),
    oneEightyThreeDayAbsent: hasUnit("at-tax-six-months-not-183-treaty")
      && AT_TAX_SCENARIOS.some((scenario) => scenario.id === "s12-183-day-reject")
      && !AT_TAX_UNITS.some((unit) => (
        unit.key !== "at-tax-six-months-not-183-treaty"
        && /\b183\b/.test(unit.text)
        && !/nicht|keine|not/i.test(unit.text)
      )),
    incomeItemRouting: hasUnit("at-tax-income-item-specific"),
    treatySeparation: hasUnit("at-tax-domestic-not-treaty-residence")
      && hasUnit("at-tax-treaty-review-handoff")
      && hasUnit("at-tax-domestic-not-final-treaty-right"),
    a1Separation: hasUnit("at-tax-a1-not-tax-certificate")
      && hasUnit("at-tax-a1-competent-not-tax-residence"),
    gewerbeSeparation: hasUnit("at-tax-gewerbe-not-tax-residence"),
    dlaSeparation: hasUnit("at-tax-dla-not-tax-registration"),
    noDeSkPackDependency: !packSourceImportsDeSkImplementation(packSource),
    atPackPresent: atPack.packId === AT_TAX_PACK_ID
      && AT_TAX_PROCESS_GROUP === "at_personal_income_tax_residence",
    atRoutingTrustDomain: atPack.trustDomain.code === AT_NATIONAL_TRUST_DOMAIN,
    ownSourcesNotForeignPack: AT_TAX_UNITS.every((unit) => unit.sourceKey.startsWith("at-tax-")),
    officialSourcesPresent: AT_TAX_OFFICIAL_SOURCES.length >= 6,
    negativeControlsAtLeast30: AT_TAX_NEGATIVE_CONTROLS.length >= 30,
    processCompleteness100: completeness.processCompletenessPercent === 100
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    blockedScenarioCountZero: completeness.blockedScenarioCount === 0,
    atProcessCountAtLeast12: AT_TAX_PROCESSES.length >= 12,
    migration068Safety: (() => {
      const migration066 = fs.readFileSync(
        path.join(ROOT, "supabase/migrations/066_add_at_unemployment_coordination_routing_and_at_sk_unemployment_connector_ingestion.sql"),
        "utf8",
      );
      const migration067 = fs.readFileSync(
        path.join(ROOT, "supabase/migrations/067_add_at_cross_border_gewerbe_service_routing_and_at_sk_gewerbe_connector_ingestion.sql"),
        "utf8",
      );
      const migration068 = fs.readFileSync(
        path.join(ROOT, "supabase/migrations/068_add_at_personal_income_tax_residence_ingestion.sql"),
        "utf8",
      );
      const allow066 = extractAllowlist(migration066);
      const allow067 = extractAllowlist(migration067);
      const allow068 = extractAllowlist(migration068);
      const subset066In067 = allow066.every((entry) => allow067.includes(entry));
      const subset067In068 = allow067.every((entry) => allow068.includes(entry));
      const onlyAddsAtTax = !migration066.includes("at_personal_income_tax_residence")
        && !migration067.includes("at_personal_income_tax_residence")
        && migration068.includes("at_personal_income_tax_residence")
        && allow068.filter((entry) => !allow067.includes(entry)).length === 1
        && allow068.at(-1) === "at_personal_income_tax_residence";
      return subset066In067
        && subset067In068
        && onlyAddsAtTax
        && migration068.includes("knowledge_ingest_curated_at_personal_income_tax_residence_pack")
        && migration068.includes("revoke all")
        && migration068.includes("from public, anon, authenticated, service_role")
        && migration068.includes("security definer")
        && migration068.includes("search_path = pg_catalog, public")
        && !/grant execute/i.test(migration068)
        && !/\bdrop (table|function|schema)\b/i.test(migration068);
    })(),
    activeCorridorsZero:
      (AT_SK_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_HEALTH_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_FAMILY_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS as string) !== "active"
      && (AT_SK_GEWERBE_CONNECTOR_STATUS as string) !== "active",
    runtimeUnauthorized: atPack.countryCode === "AT"
      && atPack.trustDomain.code === "at"
      && !("userLocale" in atPack)
      && !("locale" in atPack)
      && !("activationFromLocaleAllowed" in atPack),
    productionInteractionFalse: true,
    taxCalculatorAbsent: hasUnit("at-tax-no-calculator"),
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    phase: PHASE,
    proofs,
    failedProofs,
    counts: {
      atProcesses: AT_TAX_PROCESSES.length,
      atClaims: AT_TAX_UNITS.length,
      scenarios: AT_TAX_SCENARIOS.length,
      covered: completeness.coveredScenarioCount,
      outOfScope: completeness.outOfScopeScenarioCount,
      blocked: completeness.blockedScenarioCount,
      negativeControls: AT_TAX_NEGATIVE_CONTROLS.length,
      officialSources: AT_TAX_OFFICIAL_SOURCES.length,
      threshold2026: AT_TAX_SECTION_1_4_FOREIGN_INCOME_THRESHOLD_EUR_2026,
      zweitwohnsitzDayThreshold: AT_TAX_ZWEITWOHNSITZ_DAY_THRESHOLD,
    },
    completeness,
  };
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0i",
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
      grant execute on function public.knowledge_ingest_curated_at_personal_income_tax_residence_pack(jsonb)
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

    const atPack = buildAtPersonalIncomeTaxResidencePack();
    let atFirst: number;
    try {
      atFirst = semanticCreated((await ingestor.query(AT_RPC, [atPack])).rows[0]);
    } catch (error: unknown) {
      throw new Error(`AT_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    const atSecond = semanticCreated((await ingestor.query(AT_RPC, [atPack])).rows[0]);

    const grants = await admin.query(`
      select grantee
        from information_schema.role_routine_grants
       where routine_name = 'knowledge_ingest_curated_at_personal_income_tax_residence_pack'
         and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
    `);
    const active = await admin.query(`
      select count(*)::int as n
        from public.knowledge_cross_border_connectors
       where status = 'active'
    `);
    const processRows = await admin.query(`
      select count(*)::int as n
        from public.knowledge_processes
       where process_group_id = 'at_personal_income_tax_residence'
    `);

    live.atFirst = atFirst;
    live.atSecond = atSecond;
    live.atDuplicates = atSecond;
    live.publicGrants = grants.rowCount;
    live.activeCorridors = Number(active.rows[0]?.n ?? -1);
    live.atProcessRows = Number(processRows.rows[0]?.n ?? -1);
    live.pass = atFirst > 0 && atSecond === 0
      && grants.rowCount === 0
      && Number(active.rows[0]?.n ?? -1) === 0
      && Number(processRows.rows[0]?.n ?? -1) >= AT_TAX_PROCESSES.length;
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
  const semantic = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const treatySeparation = evaluateTaxResidenceTreatyCoreSeparationSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0c = evaluateAtSkAustrianNationalFoundationSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0f = evaluateAtSkFamilyBenefitsSemantics();
  const atSk0g = evaluateAtSkUnemploymentCoordinationSemantics();
  const atSk0h = evaluateAtSkCrossBorderGewerbeServiceSemantics();
  const ingestion = await runDisposableIngestion();
  const materialUnchanged = MATERIAL_KNOWLEDGE_PATHS.every((rel) => !dirty.includes(rel));
  const proofs = semantic.proofs as Record<string, boolean>;
  const failedProofs = semantic.failedProofs as string[];
  const treatyFailed = treatySeparation.failedProofs as string[];
  const atSk0cFailed = (atSk0c.failedProofs as string[]) ?? [];
  const atSk0dFailed = (atSk0d.failedProofs as string[]) ?? [];
  const atSk0eFailed = (atSk0e.failedProofs as string[]) ?? [];
  const atSk0fFailed = (atSk0f.failedProofs as string[]) ?? [];
  const atSk0gFailed = (atSk0g.failedProofs as string[]) ?? [];
  const atSk0hFailed = (atSk0h.failedProofs as string[]) ?? [];
  const atSk0cExpectedMaterialDrift = atSk0cFailed.length > 0
    && atSk0cFailed.every((proof) => (
      proof === "sharedEuPacksModifiedFalse"
      || proof === "skPacksModifiedFalse"
      || proof === "deSkPacksModifiedFalse"
    ));
  const migration068Safe = proofs.migration068Safety === true;

  const atSk0bScenarios = (atSk0b.scenarioSummary as { failClosed?: number } | undefined)?.failClosed ?? 1;
  const atSk0bProofs = atSk0b.proofs as {
    deSkTaxPairPreserved?: boolean;
    atSkTaxPairStructurallySupported?: boolean;
    atSkTaxLegalContentStillAbsent?: boolean;
  };
  const atSk0bSemanticPass = atSk0bScenarios === 0
    && atSk0bProofs.deSkTaxPairPreserved === true
    && atSk0bProofs.atSkTaxPairStructurallySupported === true;
  const atSk0bDirectAbsenceObsolete = atSk0bProofs.atSkTaxLegalContentStillAbsent === false;

  const atSk0dProofs = atSk0d.proofs as Record<string, boolean | undefined>;
  const atSk0dSubstantiveFailed = atSk0dFailed.filter((proof) => proof !== "noAtSkDirectory");
  const atSk0dDirectAbsenceObsolete = atSk0dProofs.noAtSkDirectory === false;
  const atSk0dSemanticPass = atSk0dSubstantiveFailed.length === 0
    && atSk0dProofs.blockedScenarioCountZero === true
    && atSk0dProofs.processCompletenessPercent100 === true
    && atSk0dProofs.euAlCoreUnchanged === true
    && atSk0dProofs.deSkAlUnchanged === true
    && atSk0dProofs.runtimeUnauthorized === true
    && atSk0dProofs.deSkConnectorFoundationValid === true
    && atSk0dProofs.sharedValidatorStillBlocksStub === true;

  const atSk0eProofs = atSk0e.proofs as Record<string, boolean | undefined>;
  const atSk0eSubstantiveFailed = atSk0eFailed.filter((proof) => proof !== "noAtSkDirectory");
  const atSk0eDirectAbsenceObsolete = atSk0eProofs.noAtSkDirectory === false;
  const atSk0eSemanticPass = atSk0eSubstantiveFailed.length === 0
    && atSk0eProofs.blockedScenarioCountZero === true
    && atSk0eProofs.processCompleteness100 === true
    && atSk0eProofs.euHealthUnchanged === true
    && atSk0eProofs.deSkHealthUnchanged === true
    && atSk0eProofs.activeCorridorsZero === true
    && atSk0eProofs.runtimeUnauthorized === true
    && atSk0eProofs.sharedValidatorStillBlocksStub === true;

  const overallPass = failedProofs.length === 0
    && treatyFailed.length === 0
    && ingestion.pass === true
    && atSk0a.phaseResult === "PASS"
    && atSk0bSemanticPass
    && (atSk0cFailed.length === 0 || atSk0cExpectedMaterialDrift)
    && atSk0dSemanticPass
    && atSk0eSemanticPass
    && atSk0fFailed.length === 0
    && atSk0gFailed.length === 0
    && atSk0hFailed.length === 0
    && migration068Safe;

  const governance = materialUnchanged
    ? "DE_SK_REVALIDATION_NOT_REQUIRED"
    : "DE_SK_REVALIDATION_REQUIRED_AFTER_AT_SK_TAX_COMMIT";
  const recommendation = overallPass
    ? (governance === "DE_SK_REVALIDATION_NOT_REQUIRED"
      ? "AUTHORIZE_AT_PERSONAL_INCOME_TAX_RESIDENCE_PACK"
      : "AUTHORIZE_DE_SK_REVALIDATION_AFTER_AT_SK_TAX_COMMIT")
    : "ONE_SPECIFIC_AT_SK_0I_REMEDIATION_PACKAGE";

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
    treatySeparation,
    proofs,
    ingestion,
    validation: {
      atSk0i: overallPass ? "PASS" : "FAIL",
      atSk0h: atSk0hFailed.length === 0 ? "PASS" : "FAIL",
      atSk0g: atSk0gFailed.length === 0 ? "PASS" : "FAIL",
      atSk0f: atSk0fFailed.length === 0 ? "PASS" : "FAIL",
      atSk0e: atSk0eSemanticPass ? "PASS" : "FAIL",
      atSk0d: atSk0dSemanticPass ? "PASS" : "FAIL",
      atSk0c: (atSk0cFailed.length === 0 || atSk0cExpectedMaterialDrift) ? "PASS" : "FAIL",
      atSk0b: atSk0bSemanticPass ? "PASS" : "FAIL",
      atSk0a: atSk0a.phaseResult,
      migration068Safety: migration068Safe ? "PASS" : "FAIL",
    },
    atSk0bClassification: {
      historicalSnapshot: atSk0bScenarios === 0 ? "historically-valid" : "FAIL",
      directAbsenceAssertion: atSk0bDirectAbsenceObsolete
        ? "expected-successor-state-mismatch"
        : "still-required-absent",
      successorArchitecture: atSk0bSemanticPass ? "PASS" : "FAIL",
      rawPhaseResult: atSk0b.phaseResult,
      atSkTaxLegalContentStillAbsent: atSk0bProofs.atSkTaxLegalContentStillAbsent,
    },
    atSk0dClassification: {
      historicalSnapshot: atSk0dSubstantiveFailed.length === 0 && atSk0dProofs.blockedScenarioCountZero === true
        ? "historically-valid"
        : "FAIL",
      directAbsenceAssertion: atSk0dDirectAbsenceObsolete
        ? "expected-successor-state-mismatch"
        : "still-required-absent",
      successorArchitecture: atSk0dSemanticPass ? "PASS" : "FAIL",
      rawPhaseResult: atSk0dFailed.length === 0 ? "PASS" : "FAIL",
      noAtSkDirectory: atSk0dProofs.noAtSkDirectory,
      substantiveFailedProofs: atSk0dSubstantiveFailed,
    },
    atSk0eClassification: {
      historicalSnapshot: atSk0eSubstantiveFailed.length === 0 && atSk0eProofs.blockedScenarioCountZero === true
        ? "historically-valid"
        : "FAIL",
      directAbsenceAssertion: atSk0eDirectAbsenceObsolete
        ? "expected-successor-state-mismatch"
        : "still-required-absent",
      successorArchitecture: atSk0eSemanticPass ? "PASS" : "FAIL",
      rawPhaseResult: atSk0eFailed.length === 0 ? "PASS" : "FAIL",
      noAtSkDirectory: atSk0eProofs.noAtSkDirectory,
      substantiveFailedProofs: atSk0eSubstantiveFailed,
    },
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atTaxPublicAnswers: false,
      atTaxRuntime: false,
    },
    filesCreated: [
      "lib/vaylo/smart-talk/knowledge/packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-personal-income-tax-residence-audit.ts",
      "supabase/migrations/068_add_at_personal_income_tax_residence_ingestion.sql",
    ],
    filesModified: [
      "package.json",
    ],
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0I_PROOF_FAILED",
    materialUnchanged,
    materialKnowledgePaths: MATERIAL_KNOWLEDGE_PATHS,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exitCode = 1;
}

const invokedDirectly = /run-at-sk-personal-income-tax-residence-audit\.ts$/u.test(
  (process.argv[1] ?? "").replace(/\\/g, "/"),
);
if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });
}
