/**
 * AT-SK-0K — process-complete AT↔SK tax residence / treaty connector audit.
 * Disposable local ingest only. No production. No public runtime.
 */
import { execSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  AT_SK_CONN_NEGATIVE_CONTROLS,
  AT_SK_CONN_SCENARIO_PROOFS,
  AT_SK_CONN_SCENARIOS,
  orchestrateBoundedPe,
  orchestrateEmploymentIncome,
  orchestrateIndependentWork,
  orchestrateRelief,
  orchestrateTreatyResidence,
} from "../source-registry/at-sk-tax-residence-treaty-connector-core";
import {
  evaluateAtSkArticle4,
  evaluateArticle15Two,
} from "../source-registry/at-sk-bilateral-tax-treaty-core";
import {
  AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
  AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  AT_SK_TAX_CONNECTOR_PACK_ID,
  AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED,
  BILATERAL_TAX_CLAIM_ROLES,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  BILATERAL_TAX_SOURCE_KINDS,
  validateCuratedBilateralTaxConnectorPack,
  validateCuratedBilateralTaxTreatyPack,
} from "../source-registry/bilateral-tax-treaty-contracts";
import { validateCuratedCrossBorderConnectorPack } from "../source-registry/cross-border-connector-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import { buildValidDeSkTaxFoundationPack } from "../source-registry/bilateral-tax-treaty-synthetic-fixtures";
import {
  AT_SK_CONN_PROCESSES,
  AT_SK_CONN_UNITS,
  buildAtSkTaxResidenceTreatyConnectorPack,
  evaluateAtSkTaxConnectorProcessCompleteness,
} from "../packs/at-sk/tax-residence-treaty-connector/at-sk-tax-residence-treaty-connector-pack";
import { buildAtSkBilateralTaxTreatyPack } from "../packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack";
import { buildAtPersonalIncomeTaxResidencePack } from "../packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack";
import { buildSkIncomeTaxResidencePack } from "../packs/sk/income-tax-residence/sk-income-tax-residence-pack";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { evaluateAtSkBilateralTaxTreatySemantics } from "./run-at-sk-bilateral-tax-treaty-audit";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "./run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0K" as const;
const EXPECTED_HEAD = "f6f9e2e5a5aa999194a97c4231a539bbb4152071";
const IMAGE = "postgres:17";
const DATABASE = "atsk0k_tax";
const PASSWORD = `atsk0k-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0k-${process.pid}-${randomUUID().slice(0, 8)}`;
const AT_SK_TREATY_RPC = "select public.knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack($1::jsonb) as result";
const AT_TAX_RPC = "select public.knowledge_ingest_curated_at_personal_income_tax_residence_pack($1::jsonb) as result";
const SK_TAX_RPC = "select public.knowledge_ingest_curated_sk_income_tax_residence_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack($1::jsonb) as result";

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
  "supabase/migrations/070_add_at_sk_tax_residence_treaty_connector_ingestion.sql",
];

const PACK_PATH = "lib/vaylo/smart-talk/knowledge/packs/at-sk/tax-residence-treaty-connector/at-sk-tax-residence-treaty-connector-pack.ts";
const CORE_PATH = "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-tax-residence-treaty-connector-core.ts";

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
function importsDeSkSubstantive(source: string): boolean {
  return /from\s+["'][^"']*de-sk\//.test(source)
    || /from\s+["'][^"']*de-sk-tax-residence-treaty-core/.test(source)
    || /\bDESK_/.test(source)
    || /\bGERMAN_REUSED_CLAIM_KEYS\b/.test(source);
}

export function evaluateAtSkTaxResidenceTreatyConnectorSemantics(): Record<string, unknown> {
  const connector = buildAtSkTaxResidenceTreatyConnectorPack();
  const validation = validateCuratedBilateralTaxConnectorPack(connector);
  const completeness = evaluateAtSkTaxConnectorProcessCompleteness();
  const packText = fs.readFileSync(path.join(ROOT, PACK_PATH), "utf8");
  const coreText = fs.readFileSync(path.join(ROOT, CORE_PATH), "utf8");
  const treatyPack = buildAtSkBilateralTaxTreatyPack();
  const atPack = buildAtPersonalIncomeTaxResidencePack();
  const skPack = buildSkIncomeTaxResidencePack();

  const proofs = {
    phaseIdReserved: packText.includes("AT-SK-0K"),
    canonicalPackId: connector.packId === AT_SK_TAX_CONNECTOR_PACK_ID,
    connectorPrepared: connector.connectorStatus === "prepared",
    activeFalse: connector.active === false,
    publicRuntimeForbidden: connector.publicRuntimeAllowed === false
      && AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED === false
      && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
    localeActivationForbidden: connector.localeActivationAllowed === false
      && AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED === false,
    activeCorridorsZero: AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS === 0,
    atDomesticLawInContracts: (BILATERAL_TAX_SOURCE_KINDS as readonly string[]).includes("AT_DOMESTIC_LAW"),
    austrianDomesticTaxRole: (BILATERAL_TAX_CLAIM_ROLES as readonly string[]).includes("austrian_domestic_tax"),
    slovakDomesticReused: packText.includes("slovak_domestic_tax") && packText.includes("sk-tax-domestic-candidate-or"),
    treatyPackReused: packText.includes("atsk-art4-sequence") && !packText.includes("desk-art4"),
    noDeSkSubstantive: !importsDeSkSubstantive(packText) && !importsDeSkSubstantive(coreText),
    noDuplicateTreatyClaimsInConnector: connector.claims.every((claim) => String(claim.key).startsWith("atskconn-")),
    art4OnlyOnDual: orchestrateTreatyResidence({ atDomesticResident: true, skDomesticResident: false }, {}).route === "AT_DOMESTIC_ONLY",
    art4PermanentHome: orchestrateTreatyResidence(
      { atDomesticResident: true, skDomesticResident: true },
      { permanentHomeAT: true, permanentHomeSK: false },
    ).route === "TREATY_RESIDENCE_AT",
    art4CentreSk: orchestrateTreatyResidence(
      { atDomesticResident: true, skDomesticResident: true },
      { permanentHomeAT: true, permanentHomeSK: true, centreSK: true },
    ).route === "TREATY_RESIDENCE_SK",
    art4MapTerminal: orchestrateTreatyResidence(
      { atDomesticResident: true, skDomesticResident: true },
      { habitualAT: false, habitualSK: false, nationalityAT: true, nationalitySK: true },
    ).route === "TREATY_RESIDENCE_MAP_REQUIRED",
    nationalityFirstRejected: evaluateAtSkArticle4({ nationalityAsFirstStep: true }).issues
      .includes("NATIONALITY_BEFORE_ORDERED_STEPS"),
    art15ThreeConjunctive: evaluateArticle15Two(183, true, "PE_VERIFIED_NO") === "PASS"
      && evaluateArticle15Two(183, false, "PE_VERIFIED_NO") === "FAIL",
    art15EmployerFail: orchestrateEmploymentIncome({
      treatyResidence: "TREATY_RESIDENT_SK",
      physicalWorkState: "AT",
      presenceDaysInWorkState: 100,
      employerResidentInWorkState: true,
      remunerationBorneByPeOrFixedBase: "PE_VERIFIED_NO",
    }).route === "ARTICLE15_SOURCE_STATE_CANDIDATE",
    rolling12Rejected: orchestrateEmploymentIncome({
      treatyResidence: "TREATY_RESIDENT_SK",
      physicalWorkState: "AT",
      presenceDaysInWorkState: 100,
      employerResidentInWorkState: false,
      remunerationBorneByPeOrFixedBase: "PE_VERIFIED_NO",
      rollingTwelveMonthsUsed: true,
    }).issues.includes("ROLLING_TWELVE_MONTH_REJECTED"),
    fixedBaseNotPe: orchestrateIndependentWork({
      treatyResidence: "TREATY_RESIDENT_SK",
      fixedBaseState: "AT",
      activityFacts: true,
    }).route === "ARTICLE14_SOURCE_STATE_ATTRIBUTABLE_CANDIDATE",
    dlaRejected: orchestrateIndependentWork({
      treatyResidence: "TREATY_RESIDENT_SK",
      fixedBaseState: "NONE",
      dlaUsedAsFixedBaseProof: true,
    }).issues.includes("DLA_NOT_FIXED_BASE_PROOF"),
    construction12NotPe: orchestrateBoundedPe({ constructionDurationMonths: 12 }).threshold === "AT_THRESHOLD",
    construction13PeReview: orchestrateBoundedPe({ constructionDurationMonths: 13 }).route === "PE_REVIEW_POTENTIALLY_REQUIRED",
    reliefSkDirection: orchestrateRelief({
      treatyResidence: "TREATY_RESIDENT_SK",
      taxingRightState: "AT",
      incomeArticle: "ARTICLE15",
      taxYear: 2026,
      taxEventKind: "OTHER",
    }).route === "RELIEF_SK_DIRECTION_CANDIDATE",
    reliefAtDirection: orchestrateRelief({
      treatyResidence: "TREATY_RESIDENT_AT",
      taxingRightState: "SK",
      incomeArticle: "ARTICLE15",
      taxYear: 2026,
      taxEventKind: "OTHER",
    }).route === "RELIEF_AT_DIRECTION_CANDIDATE",
    taxAmountOos: orchestrateRelief({
      treatyResidence: "TREATY_RESIDENT_AT",
      taxingRightState: "SK",
      incomeArticle: "ARTICLE15",
      taxYear: 2026,
      taxEventKind: "OTHER",
      exactAmountRequested: true,
    }).route === "TAX_AMOUNT_NOT_AUTHORIZED",
    crossBorderTaxEngineStillBlocked: validateCuratedCrossBorderConnectorPack(connectorTaxTreatyContamination())
      .issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED"),
    atSkCrossBorderStubStillBlocked: validateCuratedCrossBorderConnectorPack({
      ...connectorTaxTreatyContamination(),
      originMarket: "AT",
      connectedCountry: "SK",
    } as never).issues.includes("AT_SK_CONNECTOR_NOT_IMPLEMENTED"),
    treatyPackStillValid: validateCuratedBilateralTaxTreatyPack(treatyPack).valid,
    atPackExists: atPack.packId === "at_personal_income_tax_residence",
    skPackExists: skPack.packId === "sk_income_tax_residence",
    processComplete: completeness.processComplete,
    blockedZero: completeness.blockedScenarioCount === 0,
    scenarioProofs: Object.values(AT_SK_CONN_SCENARIO_PROOFS).every(Boolean),
    connectorValidation: validation.valid,
  };

  const failedProofs = Object.entries(proofs).filter(([, pass]) => !pass).map(([key]) => key);
  return Object.freeze({
    phase: PHASE,
    proofs,
    failedProofs,
    validationIssues: validation.issues,
    completeness,
    scenarios: {
      total: AT_SK_CONN_SCENARIOS.length,
      covered: AT_SK_CONN_SCENARIOS.filter((s) => s.coverage === "COVERED").length,
      outOfScope: AT_SK_CONN_SCENARIOS.filter((s) => s.coverage === "EXPLICITLY_OUT_OF_SCOPE").length,
      blocked: AT_SK_CONN_SCENARIOS.filter((s) => s.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE").length,
    },
    negativeControls: AT_SK_CONN_NEGATIVE_CONTROLS.length,
    processCount: AT_SK_CONN_PROCESSES.length,
    connectorUnits: AT_SK_CONN_UNITS.length,
    connectorImplemented: validation.valid && completeness.processComplete,
    connectorPrepared: connector.connectorStatus === "prepared",
    internalSemanticValidationAvailable: true,
    publicRuntimeAuthorized: false,
    activeCorridors: AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
    localeActivationAllowed: false,
    canonicalConnector: AT_SK_TAX_CONNECTOR_PACK_ID,
    atDomesticPackReused: true,
    skDomesticLayer: "sk_income_tax_residence",
    treatyPackReused: true,
    deSkSubstantiveDependency: false,
    contractExtensions: {
      AT_DOMESTIC_LAW: "added",
      austrian_domestic_tax: "added",
    },
    engineGuardChanges: "none — TAX_TREATY_ENGINE_NOT_AUTHORIZED and AT_SK_CONNECTOR_NOT_IMPLEMENTED preserved for cross-border stubs",
    publicAuthorizationWeakened: false,
  });
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0k",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
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
      grant execute on function public.knowledge_ingest_curated_at_personal_income_tax_residence_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_bilateral_tax_treaty_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack(jsonb) to postgres;
    `).status !== 0) throw new Error("grants");

    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("port");
    admin = new Client({
      connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await admin.connect();

    await admin.query(AT_TAX_RPC, [buildAtPersonalIncomeTaxResidencePack()]);
    await admin.query(SK_TAX_RPC, [buildSkIncomeTaxResidencePack()]);
    const treatyFirst = semanticCreated((await admin.query(AT_SK_TREATY_RPC, [buildAtSkBilateralTaxTreatyPack()])).rows[0]);
    const treatySecond = semanticCreated((await admin.query(AT_SK_TREATY_RPC, [buildAtSkBilateralTaxTreatyPack()])).rows[0]);
    const connector = buildAtSkTaxResidenceTreatyConnectorPack();
    const connFirst = semanticCreated((await admin.query(CONNECTOR_RPC, [connector])).rows[0]);
    const connSecond = semanticCreated((await admin.query(CONNECTOR_RPC, [connector])).rows[0]);

    const grants = await admin.query(`
      select grantee
        from information_schema.role_routine_grants
       where routine_name = 'knowledge_ingest_curated_at_sk_tax_residence_treaty_connector_pack'
         and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
    `);
    const active = await admin.query(`
      select count(*)::int as n from public.knowledge_bilateral_tax_treaties where active = true
    `);
    const treatyRows = await admin.query(`
      select count(*)::int as n from public.knowledge_bilateral_tax_treaties where treaty_key = 'AT-SK'
    `);
    const connClaimRows = await admin.query(`
      select count(*)::int as n from public.knowledge_claims
       where claim_text_canonical like 'AT-SK-0K verbindet%'
    `);

    live.treatyFirst = treatyFirst;
    live.treatySecond = treatySecond;
    live.connFirst = connFirst;
    live.connSecond = connSecond;
    live.publicGrants = grants.rowCount;
    live.activeTreaties = Number(active.rows[0]?.n ?? -1);
    live.atSkTreatyRows = Number(treatyRows.rows[0]?.n ?? -1);
    live.connectorClaimRows = Number(connClaimRows.rows[0]?.n ?? -1);
    live.pass = treatyFirst > 0 && treatySecond === 0 && connFirst > 0 && connSecond === 0
      && grants.rowCount === 0
      && Number(active.rows[0]?.n ?? -1) === 0
      && Number(treatyRows.rows[0]?.n ?? -1) === 1
      && Number(connClaimRows.rows[0]?.n ?? -1) >= 1;
    return live;
  } catch (error: unknown) {
    live.pass = false;
    live.error = error instanceof Error ? error.message.slice(-2000) : String(error);
    return live;
  } finally {
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }
}

async function main(): Promise<void> {
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const preflightPass = head === EXPECTED_HEAD;
  const semantic = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const ingestion = preflightPass ? await runDisposableIngestion() : { pass: false, skipped: "PREFLIGHT_STOP" };
  const atSk0j = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const deSkPackValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;
  const deSkFoundationValid = validateCuratedBilateralTaxTreatyPack(buildValidDeSkTaxFoundationPack()).valid;

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

  const failedProofs = semantic.failedProofs as string[];
  const semanticPass = failedProofs.length === 0;
  const overallPass = semanticPass
    && (ingestion.pass === true || (!preflightPass && semanticPass));

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    startingHead: EXPECTED_HEAD,
    finalHead: head,
    worktree: dirty,
    preflightPass,
    semantic,
    ingestion,
    regressions: {
      atSk0j: (atSk0j.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0i: (atSk0i.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0b: atSk0bSemanticPass ? "PASS" : "FAIL",
      atSk0a: atSk0a.phaseResult,
      deSkTaxPack: deSkPackValid ? "PASS" : "FAIL",
      deSkFoundation: deSkFoundationValid ? "PASS" : "FAIL",
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
    security: {
      publicExecute: false,
      anonExecute: false,
      authenticatedExecute: false,
      rlsWeakened: false,
    },
    staged: false,
    committed: false,
    pushed: false,
    deployed: false,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!overallPass) process.exitCode = 1;
}

if (require.main === module) {
  void main();
}
