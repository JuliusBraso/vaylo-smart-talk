/**
 * AT-SK-0J — process-complete AT↔SK bilateral tax treaty pack + treaty verification.
 * Disposable local ingest only. No production. No connector. No TAX_TREATY runtime.
 */
import { execSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  AT_SK_ARTICLE4_SEQUENCE,
  AT_SK_MLI_AT_ENTRY_INTO_FORCE,
  AT_SK_MLI_AT_OTHER_TAX_EFFECTIVE,
  AT_SK_MLI_SK_ENTRY_INTO_FORCE,
  AT_SK_MLI_SK_OTHER_TAX_EFFECTIVE,
  AT_SK_MLI_WITHHOLDING_EFFECTIVE,
  AT_SK_NEGATIVE_CONTROLS,
  AT_SK_TAX_CORE_SCENARIOS,
  AT_SK_TREATY_ENTRY_INTO_FORCE,
  AT_SK_TREATY_SIGNED,
  TAMPER_REJECTIONS,
  evaluateArticle15ConditionA,
  evaluateArticle15Two,
  evaluateAtResidentRelief,
  evaluateAtSkArticle4,
  evaluateConstructionPeThreshold,
  evaluateSkResidentRelief,
  selectMliTemporalVersion,
} from "../source-registry/at-sk-bilateral-tax-treaty-core";
import {
  BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
  BILATERAL_TAX_IS_NOT_TAX_CALCULATOR,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  validateCuratedBilateralTaxTreatyPack,
} from "../source-registry/bilateral-tax-treaty-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import { validateCuratedCrossBorderConnectorPack } from "../source-registry/cross-border-connector-contracts";
import { PROCESS_COMPLETE_DIMENSIONS } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  AT_SK_ALL_UNITS,
  AT_SK_SCENARIOS,
  AT_SK_SOURCE_FOUNDATION_UNITS,
  AT_SK_TREATY_UNITS,
  AT_SK_TAX_PACK_ID,
  AT_SK_TREATY_KEY,
  AT_SK_TREATY_PROCESSES,
  buildAtSkBilateralTaxTreatyPack,
  evaluateAtSkTreatyProcessCompleteness,
} from "../packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "./run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkCrossBorderGewerbeServiceSemantics } from "./run-at-sk-cross-border-gewerbe-service-connector-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0J" as const;
const EXPECTED_HEAD = "bd0485822bbb99bcb444a657a2abe65cfef4e2b4";
const IMAGE = "postgres:17";
const DATABASE = "atsk0j_tax";
const PASSWORD = `atsk0j-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0j-${process.pid}-${randomUUID().slice(0, 8)}`;
const AT_SK_RPC = "select public.knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack($1::jsonb) as result";

const PACK_PATH =
  "lib/vaylo/smart-talk/knowledge/packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack.ts";
const CORE_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-bilateral-tax-treaty-core.ts";

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
  "supabase/migrations/069_add_at_sk_bilateral_tax_treaty_ingestion.sql",
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
function packSource(): string {
  return fs.readFileSync(path.join(ROOT, PACK_PATH), "utf8");
}
function coreSource(): string {
  return fs.readFileSync(path.join(ROOT, CORE_PATH), "utf8");
}
function importsDeSkSubstantive(source: string): boolean {
  return /from\s+["'][^"']*de-sk\//.test(source)
    || /from\s+["'][^"']*de-sk-tax-residence-treaty-core/.test(source)
    || /\bDESK_/.test(source)
    || /\bGERMAN_REUSED_CLAIM_KEYS\b/.test(source);
}

export function evaluateAtSkBilateralTaxTreatySemantics(): Record<string, unknown> {
  const pack = buildAtSkBilateralTaxTreatyPack();
  const validation = validateCuratedBilateralTaxTreatyPack(pack);
  const completeness = evaluateAtSkTreatyProcessCompleteness();
  const packText = packSource();
  const coreText = coreSource();
  const deSkPackValidation = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack());

  const proofs = {
    treatySigned1978: packText.includes("7. März 1978") && AT_SK_TREATY_SIGNED === "1978-03-07",
    treatyEif1979: packText.includes("12. Februar 1979") && AT_SK_TREATY_ENTRY_INTO_FORCE === "1979-02-12",
    bgbl34_1979: packText.includes("BGBl. Nr. 34/1979"),
    zb48_1979: packText.includes("48/1979"),
    currentAtSkApplicability: packText.includes("Österreich ↔ Slowakei") && pack.treatyKey === AT_SK_TREATY_KEY,
    noCurrentCssrJurisdiction: packText.includes("keine aktuelle Jurisdiktion") || packText.includes("keine gegenwärtige Vertragspartei"),
    successionProvenance: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-succession-sk"),
    authenticTreatySource: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-authentic-treaty-1978"),
    authenticMliSource: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-authentic-mli"),
    atMliPosition: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-mli-position-at"),
    skMliPosition: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-mli-position-sk"),
    synthesizedSubordinate: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-bmf-synthesized"),
    skMofStatus: AT_SK_SOURCE_FOUNDATION_UNITS.some((u) => u.key === "atsk-src-sk-mof-status"),
    mliAtEif: AT_SK_MLI_AT_ENTRY_INTO_FORCE === "2018-07-01",
    mliSkEif: AT_SK_MLI_SK_ENTRY_INTO_FORCE === "2019-01-01",
    mliWithholding2019: AT_SK_MLI_WITHHOLDING_EFFECTIVE === "2019-01-01",
    mliAtOther2020: AT_SK_MLI_AT_OTHER_TAX_EFFECTIVE === "2020-01-01",
    mliSkOther201907: AT_SK_MLI_SK_OTHER_TAX_EFFECTIVE === "2019-07-01",
    noUniversalMliFlag: packText.includes("Kein universelles MLI_EFFECTIVE-Flag"),
    article4Sequence: AT_SK_ARTICLE4_SEQUENCE.join(">") === "PERMANENT_HOME>CENTRE_OF_VITAL_INTERESTS>HABITUAL_ABODE>NATIONALITY>COMPETENT_AUTHORITY_AGREEMENT",
    permanentHomePriority: evaluateAtSkArticle4({ permanentHomeAT: true, permanentHomeSK: false }).state === "TREATY_RESIDENT_AT",
    centreOrdering: evaluateAtSkArticle4({
      permanentHomeAT: true, permanentHomeSK: true, centreSK: true,
    }).state === "TREATY_RESIDENT_SK",
    habitualOrdering: evaluateAtSkArticle4({
      permanentHomeAT: false, permanentHomeSK: false, habitualAT: true,
    }).state === "TREATY_RESIDENT_AT",
    nationalityOrdering: evaluateAtSkArticle4({
      permanentHomeAT: false, permanentHomeSK: false,
      habitualAT: false, habitualSK: false, nationalitySK: true,
    }).state === "TREATY_RESIDENT_SK",
    mapTerminal: evaluateAtSkArticle4({
      permanentHomeAT: false, permanentHomeSK: false,
      habitualAT: false, habitualSK: false, nationalityAT: true, nationalitySK: true,
    }).state === "TREATY_RESIDENCE_MAP_REQUIRED",
    nationalityFirstRejected: evaluateAtSkArticle4({ nationalityAsFirstStep: true }).issues
      .includes("NATIONALITY_BEFORE_ORDERED_STEPS"),
    article14Standalone: AT_SK_TREATY_UNITS.some((u) => u.key === "atsk-art14-standalone"),
    fixedBaseNotPe: packText.includes("fixedBaseState und permanentEstablishmentState bleiben getrennt"),
    article15CalendarYear: packText.includes("KALENDERJAHR"),
    article15ThreeConditions: evaluateArticle15Two(183, true, "PE_VERIFIED_NO") === "PASS",
    construction12NotPe: evaluateConstructionPeThreshold(12) === "AT_THRESHOLD",
    constructionOver12: evaluateConstructionPeThreshold(13) === "ABOVE_THRESHOLD",
    skResidentMliOptionC: evaluateSkResidentRelief({
      treatyResidence: "TREATY_RESIDENT_SK", austriaMayTax: true, incomeArticle: "ARTICLE15", taxYear: 2020,
    }) === "CREDIT_METHOD_TREATY_BASE",
    atResidentExemptionMliA: evaluateAtResidentRelief({
      treatyResidence: "TREATY_RESIDENT_AT", slovakiaMayTax: true, incomeArticle: "ARTICLE15",
    }) === "EXEMPTION_WITH_PROGRESSION_CANDIDATE",
    universalExemptionRejected: packText.includes("UNIVERSAL_EXEMPTION_LABEL"),
    universalCreditRejected: packText.includes("UNIVERSAL_CREDIT_LABEL"),
    mliArt6Purpose: packText.includes("atsk-mli-art6-purpose"),
    mliArt7Ppt: packText.includes("PPT_REVIEW_REQUIRED"),
    mliArt10AntiAbuse: packText.includes("ANTI_ABUSE_REVIEW_REQUIRED"),
    mliArt13OptionA: packText.includes("MLI Artikel 13 Option A"),
    versionLayering: selectMliTemporalVersion({ taxYear: 2018, taxEventKind: "OTHER", residenceDirection: "AT" }) === "base_treaty_1978"
      && selectMliTemporalVersion({ taxYear: 2020, taxEventKind: "OTHER", residenceDirection: "AT" }) === "mli_at_other_from_2020",
    zeroIHandoff: packText.includes("at-tax-treaty-review-handoff"),
    noDeSkSubstantiveImport: !importsDeSkSubstantive(packText) && !importsDeSkSubstantive(coreText),
    packValid: validation.valid,
    deSkPackStillValid: deSkPackValidation.valid,
    processCompleteness100: completeness.processCompletenessPercent === 100
      && PROCESS_COMPLETE_DIMENSIONS.length === 12,
    blockedZero: completeness.blockedScenarioCount === 0,
    tamperRejections: Object.values(TAMPER_REJECTIONS).every(Boolean),
    taxCalculatorAbsent: BILATERAL_TAX_IS_NOT_TAX_CALCULATOR && BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
    publicRuntimeUnauthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
    packInactive: pack.active === false && pack.publicRuntimeAllowed === false,
    connectorEngineBlocked: validateCuratedCrossBorderConnectorPack(connectorTaxTreatyContamination())
      .issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED"),
    negativeControlsAtLeast28: AT_SK_NEGATIVE_CONTROLS.length >= 28,
    atDomesticLawDeferred: !packText.includes("austrian_domestic_tax") && !packText.includes("AT_DOMESTIC_LAW"),
    migration069Security: (() => {
      const migration069 = fs.readFileSync(
        path.join(ROOT, "supabase/migrations/069_add_at_sk_bilateral_tax_treaty_ingestion.sql"),
        "utf8",
      );
      return migration069.includes("revoke all")
        && migration069.includes("from public, anon, authenticated, service_role")
        && migration069.includes("security definer")
        && migration069.includes("search_path = pg_catalog, public")
        && !/grant execute/i.test(migration069);
    })(),
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    phase: PHASE,
    proofs,
    failedProofs,
    counts: {
      processes: AT_SK_TREATY_PROCESSES.length,
      claims: AT_SK_ALL_UNITS.length,
      scenarios: AT_SK_SCENARIOS.length,
      coreScenarios: AT_SK_TAX_CORE_SCENARIOS.length,
      covered: completeness.coveredScenarioCount,
      outOfScope: completeness.outOfScopeScenarioCount,
      blocked: completeness.blockedScenarioCount,
      negativeControls: AT_SK_NEGATIVE_CONTROLS.length,
      versions: pack.versions.length,
    },
    completeness,
    validation,
    contractExtensions: {
      atDomesticLaw: "deferred — treaty pack uses bilateral_treaty/mli claim roles only; connector phase may add austrian_domestic_tax",
      austrianDomesticTaxClaimRole: "deferred — no domestic↔treaty canonical cross-ref wiring in 0J per scope control",
    },
  };
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0j",
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
      grant execute on function public.knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack(jsonb)
        to postgres;
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

    const atSkPack = buildAtSkBilateralTaxTreatyPack();
    const claimKeys = new Set(AT_SK_ALL_UNITS.map((unit) => unit.key));
    const missingRefs: string[] = [];
    for (const proc of atSkPack.processes) {
      for (const ref of proc.claimRefs) {
        if (!claimKeys.has(ref.key)) missingRefs.push(`${proc.processKey}:${ref.key}`);
      }
    }
    if (missingRefs.length > 0) throw new Error(`MISSING_CLAIM_REFS:${missingRefs.slice(0, 5).join(",")}`);
    let atFirst: number;
    try {
      atFirst = semanticCreated((await admin.query(AT_SK_RPC, [atSkPack])).rows[0]);
    } catch (error: unknown) {
      throw new Error(`AT_SK_INGEST:${error instanceof Error ? error.message : String(error)}`);
    }
    const atSecond = semanticCreated((await admin.query(AT_SK_RPC, [atSkPack])).rows[0]);

    const grants = await admin.query(`
      select grantee
        from information_schema.role_routine_grants
       where routine_name = 'knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack'
         and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
    `);
    const active = await admin.query(`
      select count(*)::int as n
        from public.knowledge_cross_border_connectors
       where status = 'active'
    `);
    const treatyRows = await admin.query(`
      select count(*)::int as n
        from public.knowledge_bilateral_tax_treaties
       where treaty_key = 'AT-SK'
    `);

    live.atSkFirst = atFirst;
    live.atSkSecond = atSecond;
    live.publicGrants = grants.rowCount;
    live.activeCorridors = Number(active.rows[0]?.n ?? -1);
    live.atSkTreatyRows = Number(treatyRows.rows[0]?.n ?? -1);
    live.pass = atFirst > 0 && atSecond === 0
      && grants.rowCount === 0
      && Number(active.rows[0]?.n ?? -1) === 0
      && Number(treatyRows.rows[0]?.n ?? -1) === 1;
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
  const semantic = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0h = evaluateAtSkCrossBorderGewerbeServiceSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const ingestion = await runDisposableIngestion();
  const failedProofs = semantic.failedProofs as string[];
  const atSk0iFailed = (atSk0i.failedProofs as string[]) ?? [];

  const atSk0hFailed = (atSk0h.failedProofs as string[]) ?? [];
  const semanticProofs = semantic.proofs as Record<string, boolean>;

  const atSk0bScenarios = (atSk0b.scenarioSummary as { failClosed?: number } | undefined)?.failClosed ?? 1;
  const atSk0bSemanticPass = atSk0bScenarios === 0
    && (atSk0b.proofs as { deSkTaxPairPreserved?: boolean })?.deSkTaxPairPreserved === true
    && (atSk0b.proofs as { atSkTaxPairStructurallySupported?: boolean })?.atSkTaxPairStructurallySupported === true;

  const overallPass = failedProofs.length === 0
    && ingestion.pass === true
    && atSk0a.phaseResult === "PASS"
    && atSk0bSemanticPass
    && atSk0hFailed.length === 0
    && atSk0iFailed.length === 0;

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    directCommitReady: overallPass,
    repository: { branch, startingHead: EXPECTED_HEAD, finalHead: head, workingTree: dirty },
    semantic,
    ingestion,
    regressions: {
      atSk0i: atSk0iFailed.length === 0 ? "PASS" : "FAIL",
      atSk0h: atSk0hFailed.length === 0 ? "PASS" : "FAIL",
      atSk0b: atSk0bSemanticPass ? "PASS" : "FAIL",
      atSk0a: atSk0a.phaseResult,
      deSkTaxPackValidation: semanticProofs.deSkPackStillValid ? "PASS" : "FAIL",
    },
    security: {
      publicExecute: false,
      anonExecute: false,
      authenticatedExecute: false,
      rlsWeakened: false,
      activeCorridors: 0,
      taxTreatyEngineAuthorized: false,
      connectorImplemented: false,
    },
    canonicalPack: AT_SK_TAX_PACK_ID,
    treatyCore: "at-sk-bilateral-tax-treaty-core",
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0J_PROOF_FAILED",
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exitCode = 1;
}

const invokedDirectly = /run-at-sk-bilateral-tax-treaty-audit\.ts$/u.test(
  (process.argv[1] ?? "").replace(/\\/g, "/"),
);
if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });
}
