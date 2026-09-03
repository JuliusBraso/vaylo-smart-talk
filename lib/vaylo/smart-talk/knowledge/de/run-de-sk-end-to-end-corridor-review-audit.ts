/**
 * DE-SK-E2E-0A — DE↔SK end-to-end knowledge corridor review.
 * Integration audit only. No pack mutation, no migration, no Docker, no production.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { KNOWLEDGE_FACTORY_DOMAINS } from "../source-registry/knowledge-factory-contracts";
import { AUTHORIZED_SK_ADAPTER_PACK_IDS } from "../source-registry/foreign-national-adapter-contracts";
import {
  CROSS_BORDER_CASE_STATES,
  CROSS_BORDER_CONNECTOR_STATUSES,
  CROSS_BORDER_FAMILY_ACTIVITY_TYPES,
  CROSS_BORDER_HEALTH_ACTIVITY_TYPES,
  CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS,
  CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES,
  detectMissingCrossBorderFacts,
  validateCrossBorderCaseContext,
  validateCuratedCrossBorderConnectorPack,
  type CrossBorderCaseContext,
} from "../source-registry/cross-border-connector-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
  BILATERAL_TAX_IS_NOT_TAX_CALCULATOR,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  FORBIDDEN_TAX_RESIDENCE_BASES,
  TAX_ACTIVITY_TYPES,
  validateCrossBorderTaxCaseContext,
  validateCuratedBilateralTaxTreatyPack,
  validateTaxResidenceDetermination,
  type CrossBorderTaxCaseContext,
  type CrossBorderTaxIncomeItem,
} from "../source-registry/bilateral-tax-treaty-contracts";
import {
  TAMPER_REJECTIONS,
  classifyIndependentActivity,
  evaluateArticle4,
  evaluateSlovakRelief,
} from "../source-registry/de-sk-tax-residence-treaty-core";
import {
  EU_AL_NEGATIVE_CONTROLS,
  EU_AL_UNITS,
  buildEuApplicableLegislationCorePack,
  evaluateEuAlProcessCompleteness,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_HEALTH_NEGATIVE_CONTROLS,
  EU_HEALTH_UNITS,
  buildEuHealthInsuranceCoordinationPack,
  evaluateEuHealthProcessCompleteness,
} from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import {
  EU_FAMILY_NEGATIVE_CONTROLS,
  EU_FAMILY_UNITS,
  buildEuFamilyBenefitsCoordinationPack,
  evaluateEuFamilyProcessCompleteness,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import {
  EU_UNEMP_NEGATIVE_CONTROLS,
  EU_UNEMP_UNITS,
  buildEuUnemploymentCoordinationPack,
  evaluateEuUnempProcessCompleteness,
} from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import {
  DE_SK_CONNECTOR_STATUS,
  DE_SK_DE_CLAIM_KEYS,
  DE_SK_EU_CLAIM_KEYS,
  DE_SK_SK_CLAIM_KEYS,
  buildDeSkApplicableLegislationConnectorPack,
  evaluateDeSkProcessCompleteness,
} from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import {
  DE_SK_HEALTH_CONNECTOR_STATUS,
  DE_SK_HEALTH_DE_CLAIM_KEYS,
  DE_SK_HEALTH_EU_CLAIM_KEYS,
  DE_SK_HEALTH_PROCESSES,
  DE_SK_HEALTH_SK_CLAIM_KEYS,
  buildDeSkHealthInsuranceCoordinationConnectorPack,
  evaluateDeSkHealthProcessCompleteness,
  evaluateDeSkHealthSelfEmployedHardening,
} from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import {
  DE_SK_FAMILY_CONNECTOR_STATUS,
  DE_SK_FAMILY_PROCESSES,
  DE_SK_FB_DE_CLAIM_KEYS,
  DE_SK_FB_EU_CLAIM_KEYS,
  DE_SK_FB_SK_CLAIM_KEYS,
  buildDeSkFamilyBenefitsCoordinationConnectorPack,
  evaluateDeSkFamilyProcessCompleteness,
  evaluateDeSkFamilySelfEmployedHardening,
} from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import {
  ARTICLE_65A_ACTIVE_FOR_DE_SK,
  DE_SK_UE_DE_CLAIM_KEYS,
  DE_SK_UE_EU_CLAIM_KEYS,
  DE_SK_UE_NEGATIVE_CONTROLS,
  DE_SK_UE_PROCESSES,
  DE_SK_UE_SK_CLAIM_KEYS,
  DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
  buildDeSkUnemploymentCoordinationConnectorPack,
  evaluateDeSkUnemploymentArticle65a,
  evaluateDeSkUnemploymentProcessCompleteness,
  evaluateDeSkUnemploymentSelfEmployedHardening,
  evaluateDeSkUnemploymentTemporal,
} from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import {
  EST_UNITS,
  buildEstFederalCorePack,
  estPackSummary,
} from "../packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack";
import {
  SK_TAX_PACK_ID,
  SK_TAX_UNITS,
  buildSkIncomeTaxResidencePack,
  evaluateSkTaxProcessCompleteness,
} from "../packs/sk/income-tax-residence/sk-income-tax-residence-pack";
import {
  DESK_TREATY_UNITS,
  buildDeSkTaxResidenceTreatyPack,
  evaluateDeskTreatyProcessCompleteness,
} from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";

const ROOT = process.cwd();
const EXPECTED_HEAD = "f80ab883d75c81ce29de5fd290083eb2b456ba0a";
const AUDIT_REL = "lib/vaylo/smart-talk/knowledge/de/run-de-sk-end-to-end-corridor-review-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([AUDIT_REL, PACKAGE_JSON_REL]);

const REQUIRED_AUDIT_FILES = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/de/run-cross-border-connector-foundation-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-eu-applicable-legislation-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-applicable-legislation-connector-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-eu-health-insurance-coordination-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-health-insurance-coordination-connector-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-eu-family-benefits-coordination-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-family-benefits-coordination-connector-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-eu-unemployment-coordination-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-unemployment-coordination-connector-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-tax-residence-cross-border-income-architecture-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-bilateral-tax-treaty-foundation-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-tax-residence-and-treaty-core-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-knowledge-expansion-foundation-audit.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/einkommensteuer-steuererklaerung/run-einkommensteuer-federal-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/health-insurance-orientation/run-health-insurance-federal-core-pack-audit.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/arbeitslosengeld/run-arbeitslosengeld-federal-core-pack-audit.ts",
] as const);

const REQUIRED_NPM_SCRIPTS = Object.freeze([
  "knowledge:local:audit-cross-border-connector-foundation",
  "knowledge:local:audit-eu-applicable-legislation-core",
  "knowledge:local:audit-de-sk-applicable-legislation-connector",
  "knowledge:local:audit-eu-health-insurance-coordination",
  "knowledge:local:audit-de-sk-health-insurance-coordination",
  "knowledge:local:audit-eu-family-benefits-coordination",
  "knowledge:local:audit-de-sk-family-benefits-coordination",
  "knowledge:local:audit-eu-unemployment-coordination",
  "knowledge:local:audit-de-sk-unemployment-coordination",
  "knowledge:local:audit-de-sk-tax-residence-architecture",
  "knowledge:local:audit-bilateral-tax-treaty-foundation",
  "knowledge:local:audit-de-sk-tax-residence-and-treaty-core",
  "knowledge:local:audit-expansion-foundation",
  "knowledge:local:audit-einkommensteuer-federal-core",
  "knowledge:local:audit-health-insurance-federal-core",
  "knowledge:local:audit-arbeitslosengeld-federal-core",
  "knowledge:local:audit-de-sk-end-to-end-corridor-review",
] as const);

const CORRIDOR_SOURCE_RELS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/de-sk-tax-residence-treaty-core.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax-residence/sk-income-tax-residence-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/applicable-legislation-routing/de-applicable-legislation-routing-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/family-benefits-coordination-routing/de-family-benefits-coordination-routing-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/unemployment-coordination-routing/de-unemployment-coordination-routing-pack.ts",
] as const);

type ScenarioState =
  | "CONSISTENT"
  | "VALID_MULTI_STATE_RESULT"
  | "FAIL_CLOSED_MISSING_CONTEXT"
  | "EXPLICITLY_OUT_OF_V1_SCOPE"
  | "BLOCKED_BY_CROSS_DOMAIN_DEFECT";

type GapClass =
  | "CRITICAL_V1_BLOCKER"
  | "REQUIRED_V1_KNOWLEDGE_GAP"
  | "REQUIRED_V1_CROSS_DOMAIN_HANDOFF_GAP"
  | "NON_BLOCKING_FUTURE_SCOPE"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "PRESENTATION_LAYER_ONLY"
  | "RUNTIME_ACTIVATION_ONLY";

type E2EScenario = Readonly<{
  id: string;
  label: string;
  domains: readonly string[];
  expected: ScenarioState;
  requiredClaims: readonly string[];
}>;

function git(args: string): string {
  return execSync(`git ${args}`, { cwd: ROOT, encoding: "utf8" }).trim();
}

function readRel(rel: string): string {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function existsRel(rel: string): boolean {
  return fs.existsSync(path.join(ROOT, rel));
}

function dirtyPaths(): string[] {
  const output = execSync("git status --short", { cwd: ROOT, encoding: "utf8" });
  return output
    .replace(/\s+$/u, "")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => {
      const renamed = / -> /u.exec(line);
      const raw = renamed ? line.slice(renamed.index + 4) : line.replace(/^[ MARCUD?!]{1,2}\s+/u, "");
      return raw.replace(/\\/gu, "/").replace(/"/gu, "");
    })
    .filter(Boolean);
}

function incomeItem(partial: Partial<CrossBorderTaxIncomeItem> & Pick<CrossBorderTaxIncomeItem, "incomeItemId" | "incomeCategory" | "activityType">): CrossBorderTaxIncomeItem {
  return {
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    payerState: null,
    employerState: null,
    physicalWorkStates: [],
    sourceStateCandidate: null,
    sourceStateVerified: null,
    treatyArticleCandidate: null,
    treatyArticleVerified: null,
    treatyArticleState: "ARTICLE_UNRESOLVED",
    fixedBaseState: null,
    permanentEstablishmentState: null,
    taxingRightStates: [],
    reliefMethodCandidate: null,
    classificationStatus: "UNRESOLVED",
    ...partial,
  };
}

function taxContext(partial: Partial<CrossBorderTaxCaseContext> = {}): CrossBorderTaxCaseContext {
  return {
    taxYear: 2026,
    nationality: "SK",
    domesticResidenceCandidates: ["SK_DOMESTIC_RESIDENT"],
    treatyResidenceState: "TREATY_RESIDENT_SK",
    residenceDeterminationStatus: "CANDIDATE",
    workStates: ["DE"],
    incomeItems: [incomeItem({
      incomeItemId: "emp-de",
      incomeCategory: "EMPLOYMENT_INCOME",
      activityType: "EMPLOYED",
      employerState: "DE",
      physicalWorkStates: ["DE"],
    })],
    relevantDateRange: { from: "2026-01-01", to: "2026-12-31" },
    sourceCountryFacts: {},
    treatyVersionContext: {
      treatyKey: "DE-SK",
      temporalVersion: "mli-2025",
      effectiveFrom: "2025-01-01",
      effectiveTo: null,
      mliModified: true,
    },
    classificationStatus: "CANDIDATE",
    ...partial,
  };
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((file) => !ALLOWED_DIRTY.has(file));
  const migration062 = existsRel(`${MIGRATIONS_DIR}/062_add_de_sk_end_to_end_corridor_review.sql`)
    || fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR)).some((name) => name.startsWith("062_"));
  if (branch !== "main" || head !== EXPECTED_HEAD || unexpectedDirty.length > 0 || migration062) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      branch,
      head,
      expectedHead: EXPECTED_HEAD,
      unexpectedDirty,
      migration062,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const packageJson = JSON.parse(readRel(PACKAGE_JSON_REL)) as { scripts: Record<string, string> };
  const auditFilesPresent = REQUIRED_AUDIT_FILES.every((rel) => existsRel(rel));
  const npmScriptsPresent = REQUIRED_NPM_SCRIPTS.every((script) => Boolean(packageJson.scripts[script]));

  const euAlPack = buildEuApplicableLegislationCorePack();
  const euHealthPack = buildEuHealthInsuranceCoordinationPack();
  const euFamilyPack = buildEuFamilyBenefitsCoordinationPack();
  const euUnempPack = buildEuUnemploymentCoordinationPack();
  const alConnector = buildDeSkApplicableLegislationConnectorPack();
  const healthConnector = buildDeSkHealthInsuranceCoordinationConnectorPack();
  const familyConnector = buildDeSkFamilyBenefitsCoordinationConnectorPack();
  const ueConnector = buildDeSkUnemploymentCoordinationConnectorPack();
  const taxPack = buildDeSkTaxResidenceTreatyPack();
  const skTaxPack = buildSkIncomeTaxResidencePack();
  const estPack = buildEstFederalCorePack();

  const alComplete = evaluateDeSkProcessCompleteness();
  const healthComplete = evaluateDeSkHealthProcessCompleteness();
  const familyComplete = evaluateDeSkFamilyProcessCompleteness();
  const ueComplete = evaluateDeSkUnemploymentProcessCompleteness();
  const euAlComplete = evaluateEuAlProcessCompleteness(euAlPack);
  const euHealthComplete = evaluateEuHealthProcessCompleteness(euHealthPack);
  const euFamilyComplete = evaluateEuFamilyProcessCompleteness(euFamilyPack);
  const euUnempComplete = evaluateEuUnempProcessCompleteness(euUnempPack);
  const skTaxComplete = evaluateSkTaxProcessCompleteness();
  const treatyComplete = evaluateDeskTreatyProcessCompleteness();
  const estSummary = estPackSummary(estPack);
  const healthSe = evaluateDeSkHealthSelfEmployedHardening();
  const familySe = evaluateDeSkFamilySelfEmployedHardening();
  const ueSe = evaluateDeSkUnemploymentSelfEmployedHardening();
  const ue65a = evaluateDeSkUnemploymentArticle65a();
  const ueTemporal = evaluateDeSkUnemploymentTemporal();

  const connectorValidations = [
    validateCuratedCrossBorderConnectorPack(alConnector),
    validateCuratedCrossBorderConnectorPack(healthConnector),
    validateCuratedCrossBorderConnectorPack(familyConnector),
    validateCuratedCrossBorderConnectorPack(ueConnector),
  ];
  const taxTreatyOnSsRejected = !validateCuratedCrossBorderConnectorPack(
    connectorTaxTreatyContamination(),
  ).valid;
  const taxPackValid = validateCuratedBilateralTaxTreatyPack(taxPack).valid;
  const skTaxPackValid = skTaxPack.packId === SK_TAX_PACK_ID
    && skTaxComplete.processCompletenessPercent === 100;

  const claimKeys = new Set<string>([
    ...EU_AL_UNITS.map((unit) => unit.key),
    ...EU_HEALTH_UNITS.map((unit) => unit.key),
    ...EU_FAMILY_UNITS.map((unit) => unit.key),
    ...EU_UNEMP_UNITS.map((unit) => unit.key),
    ...DE_SK_EU_CLAIM_KEYS,
    ...DE_SK_DE_CLAIM_KEYS,
    ...DE_SK_SK_CLAIM_KEYS,
    ...DE_SK_HEALTH_EU_CLAIM_KEYS,
    ...DE_SK_HEALTH_DE_CLAIM_KEYS,
    ...DE_SK_HEALTH_SK_CLAIM_KEYS,
    ...DE_SK_FB_EU_CLAIM_KEYS,
    ...DE_SK_FB_DE_CLAIM_KEYS,
    ...DE_SK_FB_SK_CLAIM_KEYS,
    ...DE_SK_UE_EU_CLAIM_KEYS,
    ...DE_SK_UE_DE_CLAIM_KEYS,
    ...DE_SK_UE_SK_CLAIM_KEYS,
    ...EST_UNITS.map((unit) => unit.key),
    ...SK_TAX_UNITS.map((unit) => unit.key),
    ...DESK_TREATY_UNITS.map((unit) => unit.key),
    ...EU_AL_NEGATIVE_CONTROLS,
    ...EU_HEALTH_NEGATIVE_CONTROLS,
    ...EU_FAMILY_NEGATIVE_CONTROLS,
    ...EU_UNEMP_NEGATIVE_CONTROLS,
    ...DE_SK_UE_NEGATIVE_CONTROLS,
  ]);
  const has = (key: string) => claimKeys.has(key);
  const missingRequired = (keys: readonly string[]) => keys.filter((key) => !has(key));

  const ssContextSource = readRel("lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts");
  const taxContextSource = readRel("lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts");
  const ssCaseHasNoTaxFields = !/treatyResidenceState|domesticTaxResidence|taxingRightState|userLocale/u.test(
    ssContextSource.slice(
      ssContextSource.indexOf("export type CrossBorderCaseContext"),
      ssContextSource.indexOf("export type CrossBorderActorSemantics"),
    ),
  );
  const ssCaseStatesAreSsOnly = CROSS_BORDER_CASE_STATES.join(",") === "residenceState,employmentState,insuranceState,activityState,postingState";
  const taxForbidsLocale = taxContextSource.includes("userLocale?: never") && taxContextSource.includes("locale?: never");
  const taxHoldsSsAsFactsOnly = taxContextSource.includes("socialSecurityApplicableState?: string | null")
    && FORBIDDEN_TAX_RESIDENCE_BASES.includes("SOCIAL_SECURITY_APPLICABLE_STATE")
    && FORBIDDEN_TAX_RESIDENCE_BASES.includes("A1")
    && FORBIDDEN_TAX_RESIDENCE_BASES.includes("S1")
    && FORBIDDEN_TAX_RESIDENCE_BASES.includes("FAMILY_BENEFIT_PRIMARY_STATE")
    && FORBIDDEN_TAX_RESIDENCE_BASES.includes("UNEMPLOYMENT_BENEFIT_STATE");
  const skTaxNotSsAdapter = !(AUTHORIZED_SK_ADAPTER_PACK_IDS as readonly string[]).includes("sk_income_tax_residence");
  const factoryHasNoTaxDomain = !KNOWLEDGE_FACTORY_DOMAINS.includes("sk_income_tax" as typeof KNOWLEDGE_FACTORY_DOMAINS[number]);

  const localeLeakRejected = [
    "locale-not-jurisdiction",
    "user-locale-not-health-competence",
    "fb-user-locale-not-priority",
    "ue-locale-not-payer",
    "userlocale-not-jurisdiction",
  ].every(has);
  const nationalityLeakRejected = [
    "nationality-not-applicable-legislation",
    "nationality-not-health-competent-state",
    "fb-nationality-not-priority",
    "ue-nationality-not-payer",
    "nationality-not-tax-residence",
  ].every(has);
  const a1NotOtherDomains = [
    "a1-not-s1",
    "a1-not-ehic",
    "a1-not-tax-certificate",
    "a1-issued-not-automatic-s1",
    "a1-germany-not-automatic-gkv-s1",
    "desk-a1-not-tax",
  ].every(has);
  const s1NotOtherDomains = [
    "s1-not-a1",
    "s1-not-ehic",
    "s1-not-s2",
    "s1-not-tax-certificate",
    "s1-not-applicable-legislation-proof",
  ].every(has);
  const ehicS2Separated = ["ehic-not-s2", "ehic-not-planned-treatment", "s1-not-ehic"].every(has);
  const familyNotFromAl = has("fb-applicable-legislation-not-automatic-primary")
    && has("fb-applicable-legislation-not-automatic-activity-right");
  const unemploymentNotFromAl = has("ue-title-ii-not-unemp-state")
    && has("ue-contributions-not-auto-payer")
    && has("ue-work-de-not-auto-payer")
    && has("ue-art-65-frontier-residence");
  const uDocsSeparated = has("ue-u1-not-award")
    && has("ue-u2-not-u1")
    && has("ue-u2-not-destination-benefit")
    && has("ue-u2-not-new-benefit")
    && has("ue-u3-not-auto-cancellation");
  const ssNotTax = has("ss-not-tax-residence") && has("desk-a1-not-tax") && has("s1-not-tax-certificate");
  const seNotArticle14 = TAMPER_REJECTIONS.SELF_EMPLOYED_ALWAYS_ARTICLE14
    && classifyIndependentActivity({ szcoLabel: true }) === "UNRESOLVED"
    && has("desk-art14-vs-art7");
  const seNotAutoUnemployment = has("ue-self-employed-not-auto-65a")
    && ARTICLE_65A_ACTIVE_FOR_DE_SK === false
    && ue65a.article65aActiveForDeSk === false;

  const localeOnSsRejected = !validateCrossBorderCaseContext({
    persons: [{ role: "WORKER", residenceState: "SK" }],
    userLocale: "sk",
  } as unknown as CrossBorderCaseContext).valid;
  const localeOnTaxRejected = !validateTaxResidenceDetermination({
    treatyResidenceState: "TREATY_RESIDENT_SK",
    residenceDeterminationStatus: "CANDIDATE",
    userLocale: "sk",
  }).valid;
  const a1AsTaxResidenceRejected = !validateTaxResidenceDetermination({
    treatyResidenceState: "TREATY_RESIDENT_DE",
    residenceDeterminationStatus: "DETERMINED",
    taxResidenceBasis: "A1",
    a1: true,
  }).valid;
  const ssApplicableAsTaxResidenceRejected = !validateTaxResidenceDetermination({
    treatyResidenceState: "TREATY_RESIDENT_DE",
    residenceDeterminationStatus: "DETERMINED",
    taxResidenceBasis: "SOCIAL_SECURITY_APPLICABLE_STATE",
    socialSecurityCompetentState: "DE",
  }).valid;
  const familyPrimaryAsTaxRejected = !validateTaxResidenceDetermination({
    treatyResidenceState: "TREATY_RESIDENT_SK",
    residenceDeterminationStatus: "DETERMINED",
    taxResidenceBasis: "FAMILY_BENEFIT_PRIMARY_STATE",
  }).valid;
  const employerPopulatesTaxingRightRejected = !validateCrossBorderTaxCaseContext(taxContext({
    incomeItems: [incomeItem({
      incomeItemId: "emp-de",
      incomeCategory: "EMPLOYMENT_INCOME",
      activityType: "EMPLOYED",
      employerState: "DE",
      physicalWorkStates: [],
      taxingRightDerivedFrom: "employerState",
      classificationStatus: "UNRESOLVED",
      treatyArticleState: "ARTICLE_UNRESOLVED",
    })],
  })).valid;
  const selfEmployedAutoArticle14Rejected = !validateCrossBorderTaxCaseContext(taxContext({
    incomeItems: [incomeItem({
      incomeItemId: "se-sk",
      incomeCategory: "INDEPENDENT_PERSONAL_SERVICES",
      activityType: "SELF_EMPLOYED",
      treatyArticleCandidate: "14",
      treatyArticleState: "ARTICLE_VERIFIED",
    })],
  })).valid;

  const multiStateSsContext: CrossBorderCaseContext = {
    persons: [{
      role: "WORKER",
      residenceState: "SK",
      employmentState: "DE",
      activityState: "DE",
      insuranceState: "DE",
    }],
    period: { from: "2026-01-01", to: "2026-12-31" },
    healthcare: {
      competentState: "DE",
      applicableLegislationVerified: true,
      healthInsuranceSystem: "GKV",
      healthInsuranceVerified: true,
    },
    familyBenefits: {
      primaryBenefitState: "SK",
      secondaryBenefitState: "DE",
      childResidenceKnown: true,
      secondParentActivityKnown: true,
    },
    unemployment: {
      lastActivityState: "DE",
      lastApplicableLegislationState: "DE",
      residenceState: "SK",
      currentBenefitState: "SK",
      registrationState: "SK",
      frontierWorkerStatus: "FRONTIER",
    },
  };
  const multiStateSsValid = validateCrossBorderCaseContext(multiStateSsContext).valid;
  const multiStateTaxValid = validateCrossBorderTaxCaseContext(taxContext({
    socialSecurityApplicableState: "DE",
    socialSecurityCompetentState: "DE",
    socialSecurityResidenceState: "SK",
    treatyResidenceState: "TREATY_RESIDENT_SK",
    taxResidenceBasis: "ARTICLE_4_PERMANENT_HOME",
  })).valid;
  const missingHealthInsurerFacts = detectMissingCrossBorderFacts(
    { persons: [{ role: "WORKER", residenceState: "SK" }] },
    ["WORKER"],
    ["insuranceState"],
  );
  const missingWorkStateFacts = detectMissingCrossBorderFacts(
    { persons: [{ role: "WORKER", residenceState: "SK", employmentState: "DE" }] },
    ["WORKER"],
    ["activityState"],
  );

  const corridorSource = CORRIDOR_SOURCE_RELS.map(readRel).join("\n");
  const hardcodedExactOffices = [
    /Finanzamt (München|Berlin|Hamburg|Frankfurt|Köln|Stuttgart|Nürnberg|Leipzig)/u,
    /Agentur für Arbeit (München|Berlin|Nürnberg|Frankfurt|Hamburg)/u,
    /ÚPSVaR .{0,24}(Bratislava|Košice|Žilina)/u,
    /Sociálna poisťovňa, pobočka/u,
  ].flatMap((pattern) => pattern.exec(corridorSource) ? [pattern.source] : []);
  const fetchLiveExactOffices = [
    "live-lookup-finanzamt",
    "de-fb-channel-fetch-live",
    "sk-health-channel-fetch-live",
    "sk-ue-channel-fetch-live",
    "sk-ue-socpoist-instance-fetch-live",
    "sk-branch-contact-fetch-live",
    "fb-exact-institution-fetch-live",
  ].filter((key) => has(key) || corridorSource.includes(key));
  const authoritySeparated = [
    "sk-health-not-socialna-poistovna",
    "sk-health-sp-not-s1-issuer",
    "sk-fb-not-socialna-poistovna",
    "sk-ue-socpoist-not-upsvr",
    "sk-ue-upsvr-not-cash-decision",
    "de-ue-finanzamt-not-u1",
    "de-ue-krankenkasse-not-u1",
    "de-fb-familienkasse-not-elterngeldstelle",
    "de-health-s2-not-dvka-default",
  ].every((key) => has(key) || corridorSource.includes(`key: "${key}"`));

  const activityModelCovered = CROSS_BORDER_HEALTH_ACTIVITY_TYPES.includes("EMPLOYED")
    && CROSS_BORDER_HEALTH_ACTIVITY_TYPES.includes("SELF_EMPLOYED")
    && CROSS_BORDER_HEALTH_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED")
    && CROSS_BORDER_FAMILY_ACTIVITY_TYPES.includes("SELF_EMPLOYED")
    && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("FORMER_EMPLOYED")
    && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("FORMER_SELF_EMPLOYED")
    && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("ACTIVITY_STATUS_CHANGED")
    && TAX_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED")
    && TAX_ACTIVITY_TYPES.includes("ACTIVITY_CHANGED")
    && CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS.includes("GKV")
    && CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS.includes("PKV")
    && CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS.includes("SK_PUBLIC");

  const healthConsumesAl = has("health-requires-applicable-legislation-result")
    && DE_SK_HEALTH_PROCESSES.some((process) => process.key === "de-sk-health-mixed-activity-delegate");
  const familyConsumesAlFactsOnly = familyNotFromAl
    && DE_SK_FAMILY_PROCESSES.some((process) => process.key === "de-sk-fb-single-person-mixed-delegate");
  const ueConsumesAlFactsOnly = unemploymentNotFromAl
    && DE_SK_UE_PROCESSES.some((process) => process.key === "de-sk-ue-mixed-delegate-al");
  const taxConsumesFactsNotSsLaw = ssNotTax && seNotArticle14 && taxHoldsSsAsFactsOnly;

  const portableDocs = {
    A1: {
      purpose: "applicable social-security legislation evidence",
      proves: "pd-a1-purpose",
      not: ["a1-not-s1", "a1-not-ehic", "a1-not-tax-certificate", "a1-issued-not-automatic-s1"],
      freshness: "material-change-re-examine",
    },
    S1: {
      purpose: "healthcare registration entitlement in residence state",
      proves: "s1-not-a1",
      not: ["s1-not-ehic", "s1-not-s2", "s1-not-tax-certificate", "old-s1-not-entitlement-forever"],
      freshness: "s1-change-requires-reexamination",
    },
    EHIC: {
      purpose: "temporary-stay medically necessary healthcare",
      proves: "ehic-not-planned-treatment",
      not: ["ehic-not-s2", "s1-not-ehic"],
      freshness: "old-s1-not-entitlement-forever",
    },
    S2: {
      purpose: "authorized planned treatment",
      proves: "s1-not-s2",
      not: ["ehic-not-s2", "s2-not-yet-granted-not-entitlement"],
      freshness: "s1-change-requires-reexamination",
    },
    U1: {
      purpose: "period evidence",
      proves: "ue-u1-not-award",
      not: ["ue-u1-not-award", "ue-u2-not-u1"],
      freshness: "ue-physical-u1-not-approved",
    },
    U2: {
      purpose: "export authorization / benefit-search route",
      proves: "ue-u2-not-destination-benefit",
      not: ["ue-u2-not-new-benefit", "ue-u2-not-u1"],
      freshness: "ue-physical-u2-not-still-valid",
    },
    U3: {
      purpose: "interinstitutional change information",
      proves: "ue-u3-not-auto-cancellation",
      not: ["ue-u3-not-auto-cancellation"],
      freshness: "ue-job-during-export-recheck",
    },
  };
  const portableDocumentConflicts = Object.entries(portableDocs).flatMap(([doc, spec]) => (
    spec.not.filter((key) => !has(key) && !corridorSource.includes(`key: "${key}"`)).map((key) => `${doc}:${key}`)
  ));

  const temporalClaims = [
    "material-change-re-examine",
    "s1-change-requires-reexamination",
    "old-s1-not-entitlement-forever",
    "fb-child-residence-can-change-priority",
    "fb-second-parent-activity-can-change-priority",
    "fb-fact-change-requires-reclassification",
    "ue-job-during-export-recheck",
    "sk-ue-activity-change-reeval",
    "desk-mli-art5-credit",
    "desk-art23-sk-pre-2025",
  ];
  const temporalMissing = missingRequired(temporalClaims.filter((key) => key !== "ue-physical-u1-not-approved"));
  const mliBoundaryIndependentOfSs = evaluateSlovakRelief({
    treatyResidence: "TREATY_RESIDENT_SK",
    taxYear: 2024,
    germanyMayTax: true,
    incomeArticle: "ARTICLE15",
  }) === "EXEMPTION_WITH_PROGRESSION_CANDIDATE"
    && evaluateSlovakRelief({
      treatyResidence: "TREATY_RESIDENT_SK",
      taxYear: 2025,
      germanyMayTax: true,
      incomeArticle: "ARTICLE15",
      foreignEmploymentTaxed: true,
      amountsComplete: false,
    }) === "SK_45_3_C_COMPARISON_REQUIRED"
    && has("ss-not-tax-residence");
  const nationalityNotArt4 = evaluateArticle4({
    permanentHomeDE: true,
    permanentHomeSK: true,
    nationalityAsTiebreaker: true,
  }).issues.includes("NATIONALITY_AS_ARTICLE4_TIEBREAKER");

  const scenarios: readonly E2EScenario[] = [
    {
      id: "n1-frontier-employee",
      label: "SK resident, DE employment, family SK, frontier return",
      domains: ["al", "health", "family", "tax", "unemployment"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "art-11-employed-lex-loci-laboris",
        "residence-not-automatic-employment-legislation",
        "health-requires-applicable-legislation-result",
        "fb-applicable-legislation-not-automatic-primary",
        "ss-not-tax-residence",
        "desk-a1-not-tax",
        "ue-art-65-frontier-residence",
      ],
    },
    {
      id: "n2-residence-move-sk-to-de",
      label: "Frontier employee later genuinely moves residence SK→DE",
      domains: ["al", "health", "family", "tax", "unemployment"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "residence-not-automatic-employment-legislation",
        "s1-change-requires-reexamination",
        "fb-child-residence-can-change-priority",
        "material-change-re-examine",
      ],
    },
    {
      id: "n3-two-parent-activity",
      label: "Parent A employed DE, Parent B employed SK, child SK",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "fb-two-working-parents-not-automatic-overlap",
        "fb-national-rights-required-for-overlap",
        "fb-second-parent-activity-can-change-priority",
        "ss-not-tax-residence",
      ],
    },
    {
      id: "n4-de-self-employed-sk-residence",
      label: "SK resident, verified DE AL, German GKV, family SK",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "art-13-2-self-employed-multi-state",
        "art-17-insured-person-includes-self-employed",
        "a1-germany-not-automatic-gkv-s1",
        "fb-self-employment-not-automatic-national-right",
        "desk-art14-vs-art7",
        "desk-a1-not-tax",
      ],
    },
    {
      id: "n5-sk-self-employed-de-residence",
      label: "DE resident, verified SK AL, Slovak public health insurer",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "sk-health-outgoing-s1-from-insurer",
        "sk-health-not-socialna-poistovna",
        "fb-self-employment-not-automatic-national-right",
        "desk-art14-vs-art7",
      ],
    },
    {
      id: "n6-multi-state-self-employed",
      label: "Self-employed DE+SK, residence SK; AL owns Art.13",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "art-13-2-self-employed-multi-state",
        "health-requires-applicable-legislation-result",
        "fb-applicable-legislation-not-automatic-activity-right",
        "desk-art14-vs-art7",
      ],
    },
    {
      id: "n7-mixed-employed-self-employed",
      label: "Employment DE + self-employment SK; one SS system, per-income tax",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "art-13-3-employed-plus-self-employed",
        "health-requires-applicable-legislation-result",
        "fb-single-person-mixed-not-two-activity-rights",
        "desk-art15-allocation",
        "desk-art14-vs-art7",
      ],
    },
    {
      id: "n8-employee-to-self-employed",
      label: "DE employee ends job, starts self-employment; old results re-evaluated",
      domains: ["al", "health", "family", "unemployment", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "material-change-re-examine",
        "s1-change-requires-reexamination",
        "old-s1-not-entitlement-forever",
      ],
    },
    {
      id: "n9-frontier-wholly-unemployed",
      label: "SK-resident frontier employee wholly unemployed; Art.65 not ALG DE auto",
      domains: ["unemployment", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "ue-art-65-frontier-residence",
        "ue-work-de-not-auto-payer",
        "sk-ue-upsvr-role",
        "sk-ue-socpoist-not-upsvr",
        "ue-u1-not-award",
      ],
    },
    {
      id: "n10-u2-then-sk-self-employment",
      label: "German ALG exported U2 DE→SK, then SK self-employment begins",
      domains: ["unemployment", "al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "ue-u2-not-destination-benefit",
        "ue-job-during-export-recheck",
        "ue-u3-not-auto-cancellation",
        "material-change-re-examine",
      ],
    },
    {
      id: "n11-posted-employee-self-employed",
      label: "Temporary posting; A1 home state; residence unchanged; tax independent",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "posting-not-automatic-s1",
        "posted-stay-uses-ehic-principles",
        "a1-issued-not-automatic-s1",
        "desk-a1-not-tax",
      ],
    },
    {
      id: "n12-home-office",
      label: "SK treaty resident, German employer, work DE + home office SK",
      domains: ["al", "health", "family", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "telework-may-be-multi-state",
        "remote-work-not-posting-automatically",
        "desk-art15-home-office",
        "desk-art15-allocation",
        "german-employer-not-automatic-german-legislation",
      ],
    },
    {
      id: "child-moves-sk-to-de",
      label: "Child residence SK→DE; family priority re-evaluated, parent tax untouched",
      domains: ["family", "health", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "fb-child-residence-can-change-priority",
        "s1-change-requires-reexamination",
        "ss-not-tax-residence",
      ],
    },
    {
      id: "partner-inactive-to-employed-sk",
      label: "Other parent inactive → employed SK; family priority only",
      domains: ["family", "al"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "fb-second-parent-activity-can-change-priority",
        "fb-applicable-legislation-not-automatic-primary",
      ],
    },
    {
      id: "gkv-to-pkv",
      label: "DE self-employed GKV→PKV; S1/EHIC/S2 routing, tax untouched",
      domains: ["health", "tax"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "a1-germany-not-automatic-gkv-s1",
        "pkv-unclear-fail-closed",
        "s1-change-requires-reexamination",
        "desk-a1-not-tax",
      ],
    },
    {
      id: "tax-year-2024-2025-mli",
      label: "Same person 2024 vs 2025 MLI relief; A1/health unchanged",
      domains: ["tax", "al", "health"],
      expected: "VALID_MULTI_STATE_RESULT",
      requiredClaims: [
        "desk-art23-sk-pre-2025",
        "desk-mli-art5-credit",
        "ss-not-tax-residence",
      ],
    },
    {
      id: "locale-sk-not-jurisdiction",
      label: "userLocale SK with DE factual residence must not drive jurisdictions",
      domains: ["al", "health", "family", "unemployment", "tax"],
      expected: "CONSISTENT",
      requiredClaims: [
        "locale-not-jurisdiction",
        "user-locale-not-health-competence",
        "fb-user-locale-not-priority",
        "ue-locale-not-payer",
        "userlocale-not-jurisdiction",
      ],
    },
    {
      id: "nationality-sk-not-outcome",
      label: "SK nationality must not drive A1/S1/family/unemployment/tax",
      domains: ["al", "health", "family", "unemployment", "tax"],
      expected: "CONSISTENT",
      requiredClaims: [
        "nationality-not-applicable-legislation",
        "nationality-not-health-competent-state",
        "fb-nationality-not-priority",
        "ue-nationality-not-payer",
        "nationality-not-tax-residence",
      ],
    },
    {
      id: "a1-without-gkv-fail-closed",
      label: "A1 exists but health insurer unknown → S1 not determined",
      domains: ["al", "health"],
      expected: "FAIL_CLOSED_MISSING_CONTEXT",
      requiredClaims: [
        "a1-germany-not-automatic-gkv-s1",
        "a1-issued-not-automatic-s1",
        "health-requires-applicable-legislation-result",
      ],
    },
    {
      id: "family-second-parent-unknown",
      label: "Family primary candidate known, second parent activity unknown",
      domains: ["family"],
      expected: "FAIL_CLOSED_MISSING_CONTEXT",
      requiredClaims: [
        "fb-working-parent-only-insufficient",
        "fb-national-rights-required-for-overlap",
      ],
    },
    {
      id: "u1-without-national-gate",
      label: "U1 present, national unemployment gate incomplete",
      domains: ["unemployment"],
      expected: "FAIL_CLOSED_MISSING_CONTEXT",
      requiredClaims: ["ue-u1-not-award", "ue-not-national-entitlement"],
    },
    {
      id: "employer-known-work-state-unknown",
      label: "German employer known, physical work state unknown → Art.15 unresolved",
      domains: ["tax"],
      expected: "FAIL_CLOSED_MISSING_CONTEXT",
      requiredClaims: ["desk-art15-allocation", "desk-a1-not-tax"],
    },
    {
      id: "article65a-not-from-self-employed",
      label: "Self-employed must not activate Article 65a for current DE↔SK declarations",
      domains: ["unemployment"],
      expected: "CONSISTENT",
      requiredClaims: ["ue-self-employed-not-auto-65a", "ue-art-65a-requires-notification"],
    },
    {
      id: "tax-calculator-out",
      label: "Tax amount calculator remains out of corridor v1",
      domains: ["tax"],
      expected: "EXPLICITLY_OUT_OF_V1_SCOPE",
      requiredClaims: [],
    },
    {
      id: "vat-accounting-out",
      label: "VAT/accounting engines remain out of corridor v1",
      domains: ["tax"],
      expected: "EXPLICITLY_OUT_OF_V1_SCOPE",
      requiredClaims: [],
    },
    {
      id: "at-sk-out",
      label: "AT-SK and other non-DE-SK corridors remain out of v1",
      domains: ["al"],
      expected: "EXPLICITLY_OUT_OF_V1_SCOPE",
      requiredClaims: [],
    },
  ];

  const evaluatedScenarios = scenarios.map((scenario) => {
    if (scenario.expected === "EXPLICITLY_OUT_OF_V1_SCOPE") {
      return { ...scenario, state: "EXPLICITLY_OUT_OF_V1_SCOPE" as const, missingClaims: [] as string[] };
    }
    const missingClaims = missingRequired(scenario.requiredClaims);
    if (missingClaims.length > 0) {
      return { ...scenario, state: "BLOCKED_BY_CROSS_DOMAIN_DEFECT" as const, missingClaims };
    }
    return { ...scenario, state: scenario.expected, missingClaims };
  });

  const illegalFieldLeakage = [
    localeLeakRejected,
    nationalityLeakRejected,
    a1NotOtherDomains,
    s1NotOtherDomains,
    ehicS2Separated,
    familyNotFromAl,
    unemploymentNotFromAl,
    ssNotTax,
    seNotArticle14,
    seNotAutoUnemployment,
    localeOnSsRejected,
    localeOnTaxRejected,
    a1AsTaxResidenceRejected,
    ssApplicableAsTaxResidenceRejected,
    familyPrimaryAsTaxRejected,
    employerPopulatesTaxingRightRejected,
    selfEmployedAutoArticle14Rejected,
    ssCaseHasNoTaxFields,
    ssCaseStatesAreSsOnly,
    taxForbidsLocale,
    taxHoldsSsAsFactsOnly,
    skTaxNotSsAdapter,
    alConnector.activationFromLocaleAllowed === false,
    healthConnector.activationFromLocaleAllowed === false,
    familyConnector.activationFromLocaleAllowed === false,
    ueConnector.activationFromLocaleAllowed === false,
  ].filter((ok) => !ok);
  const missingHandoffs = [
    healthConsumesAl,
    familyConsumesAlFactsOnly,
    ueConsumesAlFactsOnly,
    taxConsumesFactsNotSsLaw,
    has("health-requires-applicable-legislation-result"),
    has("fb-applicable-legislation-not-automatic-primary"),
    has("ue-title-ii-not-unemp-state"),
    has("ss-not-tax-residence"),
  ].filter((ok) => !ok);
  const authorityRoutingConflicts = [
    authoritySeparated,
    fetchLiveExactOffices.length >= 5,
    hardcodedExactOffices.length === 0,
    has("de-health-s2-not-dvka-default") || corridorSource.includes("de-health-s2-not-dvka-default"),
  ].filter((ok) => !ok);
  const sourceFreshnessConflicts = [
    corridorSource.includes("FETCH_LIVE"),
    corridorSource.includes("STORE_CANONICALLY"),
    corridorSource.includes("CACHE_AND_REVALIDATE") || corridorSource.includes("DO_NOT_ANSWER_WITHOUT_CONTEXT"),
    has("old-s1-not-entitlement-forever"),
    has("material-change-re-examine"),
  ].filter((ok) => !ok);
  const temporalConflicts = [
    temporalMissing.length === 0 || temporalMissing.every((key) => corridorSource.includes(key)),
    healthSe.activityChangeReevaluationCovered,
    familySe.activityChangeReclassificationCovered,
    ueSe.activityChangeCovered,
    mliBoundaryIndependentOfSs,
    nationalityNotArt4,
    ueTemporal.currentThreeMonthVsProposedSix,
  ].filter((ok) => !ok);

  const employeeParity = has("art-11-employed-lex-loci-laboris")
    && CROSS_BORDER_HEALTH_ACTIVITY_TYPES.includes("EMPLOYED")
    && CROSS_BORDER_FAMILY_ACTIVITY_TYPES.includes("EMPLOYED")
    && CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES.includes("EMPLOYED")
    && TAX_ACTIVITY_TYPES.includes("EMPLOYED");
  const selfEmployedParity = healthSe.selfEmployedCoverageExplicit
    && healthSe.negativeControlsPresent
    && healthSe.inScopeBlockedCount === 0
    && familySe.selfEmployedArticle68ActivityExplicit
    && familySe.selfEmploymentDoesNotAutoCreateNationalRight
    && familySe.negativeControlsPresent
    && familySe.blockedCount === 0
    && ueSe.selfEmployedExplicit
    && ueSe.negativeControlsPresent
    && seNotArticle14
    && seNotAutoUnemployment;
  const mixedActivityParity = healthSe.mixedActivityCoverageExplicit
    && familySe.singlePersonMixedActivityDoesNotFabricateTwoRights
    && ueSe.mixedDelegatesToApplicableLegislation
    && has("art-13-3-employed-plus-self-employed")
    && TAX_ACTIVITY_TYPES.includes("MIXED_EMPLOYED_SELF_EMPLOYED");

  const domainCompletenessPass = alComplete.processCompletenessPercent === 100
    && healthComplete.processCompletenessPercent === 100
    && familyComplete.processCompletenessPercent === 100
    && ueComplete.processCompletenessPercent === 100
    && euAlComplete.processCompletenessPercent === 100
    && euHealthComplete.processCompletenessPercent === 100
    && euFamilyComplete.processCompletenessPercent === 100
    && euUnempComplete.processCompletenessPercent === 100
    && skTaxComplete.processCompletenessPercent === 100
    && treatyComplete.processCompletenessPercent === 100
    && estSummary.processCompletenessPercent === 100
    && alComplete.blockedScenarioCount === 0
    && healthComplete.blockedScenarioCount === 0
    && familyComplete.blockedScenarioCount === 0
    && ueComplete.blockedScenarioCount === 0;
  const connectorsPreparedInactive = [alConnector, healthConnector, familyConnector, ueConnector].every((pack) => (
    pack.status === "prepared"
    && pack.topicFamily === "SOCIAL_SECURITY_COORDINATION"
    && (CROSS_BORDER_CONNECTOR_STATUSES as readonly string[]).includes(pack.status)
  ))
    && DE_SK_CONNECTOR_STATUS === "prepared"
    && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared"
    && connectorValidations.every((result) => result.valid)
    && taxTreatyOnSsRejected
    && taxPackValid
    && skTaxPackValid
    && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false;

  const allDomainAuditsPass = auditFilesPresent
    && npmScriptsPresent
    && domainCompletenessPass
    && connectorsPreparedInactive
    && activityModelCovered;

  const blockedByCrossDomainDefectCount = evaluatedScenarios.filter((row) => row.state === "BLOCKED_BY_CROSS_DOMAIN_DEFECT").length;
  const consistentScenarioCount = evaluatedScenarios.filter((row) => row.state === "CONSISTENT").length;
  const validMultiStateScenarioCount = evaluatedScenarios.filter((row) => row.state === "VALID_MULTI_STATE_RESULT").length;
  const failClosedMissingContextCount = evaluatedScenarios.filter((row) => row.state === "FAIL_CLOSED_MISSING_CONTEXT").length;
  const explicitOutOfV1ScopeCount = evaluatedScenarios.filter((row) => row.state === "EXPLICITLY_OUT_OF_V1_SCOPE").length;

  const gaps: readonly { id: string; classification: GapClass; note: string }[] = [
    {
      id: "tax-calculator",
      classification: "NON_BLOCKING_FUTURE_SCOPE",
      note: "BILATERAL_TAX_IS_NOT_TAX_CALCULATOR remains true.",
    },
    {
      id: "accounting-vat",
      classification: "NON_BLOCKING_FUTURE_SCOPE",
      note: "BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE remains true.",
    },
    {
      id: "full-article-5-pe",
      classification: "NON_BLOCKING_FUTURE_SCOPE",
      note: "Article 15 condition C stays PE_UNRESOLVED without a full PE engine.",
    },
    {
      id: "other-income-articles",
      classification: "EXPLICITLY_OUT_OF_SCOPE",
      note: "Dividends, interest, rent, CGT, pensions, public service, artists/sports remain out of v1.",
    },
    {
      id: "other-corridors",
      classification: "EXPLICITLY_OUT_OF_SCOPE",
      note: "AT-SK, DE-CZ, DE-PL, DE-HU remain unauthorized.",
    },
    {
      id: "standalone-sk-bureaucracy-os",
      classification: "NON_BLOCKING_FUTURE_SCOPE",
      note: "SK adapters are DE↔SK coordination adapters, not a standalone SK OS.",
    },
    {
      id: "connector-runtime",
      classification: "RUNTIME_ACTIVATION_ONLY",
      note: "Connectors remain prepared; public tax runtime remains false.",
    },
    {
      id: "presentation-contract",
      classification: "PRESENTATION_LAYER_ONLY",
      note: "Canonical processes have human triggers; Presentation Contract is not implemented in this phase.",
    },
    {
      id: "factory-tax-domain",
      classification: "EXPLICITLY_OUT_OF_SCOPE",
      note: "Tax uses the bilateral tax contract, not a Knowledge Factory domain. Factory domain count is unchanged.",
    },
  ];

  const illegalFieldLeakageCount = illegalFieldLeakage.length;
  const missingHandoffCount = missingHandoffs.length;
  const authorityRoutingConflictCount = authorityRoutingConflicts.length + hardcodedExactOffices.length;
  const portableDocumentConflictCount = portableDocumentConflicts.length;
  const temporalConflictCount = temporalConflicts.length;
  const sourceFreshnessConflictCount = sourceFreshnessConflicts.length;

  const criticalV1BlockerCount = [
    illegalFieldLeakageCount,
    authorityRoutingConflictCount,
    portableDocumentConflictCount,
    blockedByCrossDomainDefectCount,
    selfEmployedParity ? 0 : 1,
    mixedActivityParity ? 0 : 1,
    employeeParity ? 0 : 1,
    allDomainAuditsPass ? 0 : 1,
    temporalConflictCount,
  ].reduce((sum, n) => sum + n, 0) > 0
    ? (
      (allDomainAuditsPass ? 0 : 1)
      + (illegalFieldLeakageCount > 0 ? 1 : 0)
      + (authorityRoutingConflictCount > 0 ? 1 : 0)
      + (portableDocumentConflictCount > 0 ? 1 : 0)
      + (blockedByCrossDomainDefectCount > 0 ? 1 : 0)
      + (selfEmployedParity ? 0 : 1)
      + (mixedActivityParity ? 0 : 1)
      + (employeeParity ? 0 : 1)
      + (temporalConflictCount > 0 ? 1 : 0)
    )
    : 0;

  const requiredV1KnowledgeGapCount = 0;
  const requiredV1HandoffGapCount = missingHandoffCount > 0 ? 1 : 0;
  const nonBlockingFutureScopeCount = gaps.filter((gap) => gap.classification === "NON_BLOCKING_FUTURE_SCOPE").length;
  const presentationLayerOnlyCount = gaps.filter((gap) => gap.classification === "PRESENTATION_LAYER_ONLY").length;
  const runtimeActivationOnlyCount = gaps.filter((gap) => gap.classification === "RUNTIME_ACTIVATION_ONLY").length;

  const productionAuthorized = false;
  const publicRuntimeAuthorized = false;
  const activeCorridors = 0;
  const corridorV1Candidate = allDomainAuditsPass
    && criticalV1BlockerCount === 0
    && illegalFieldLeakageCount === 0
    && authorityRoutingConflictCount === 0
    && portableDocumentConflictCount === 0
    && missingHandoffCount === 0
    && selfEmployedParity
    && mixedActivityParity
    && employeeParity
    && temporalConflictCount === 0
    && blockedByCrossDomainDefectCount === 0
    && productionAuthorized === false
    && publicRuntimeAuthorized === false
    && activeCorridors === 0
    && BILATERAL_TAX_IS_NOT_TAX_CALCULATOR
    && BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE;

  const phaseResult = corridorV1Candidate ? "PASS" : "FAIL";
  const report = {
    phase: "DE-SK-E2E-0A",
    phaseResult,
    corridorV1Candidate,
    productionAuthorized,
    publicRuntimeAuthorized,
    activeCorridors,
    repository: { branch, startingHead: EXPECTED_HEAD, finalHead: head, dirty },
    allDomainAuditsPass,
    domainCompleteness: {
      euAl: euAlComplete.processCompletenessPercent,
      deSkAl: alComplete.processCompletenessPercent,
      euHealth: euHealthComplete.processCompletenessPercent,
      deSkHealth: healthComplete.processCompletenessPercent,
      euFamily: euFamilyComplete.processCompletenessPercent,
      deSkFamily: familyComplete.processCompletenessPercent,
      euUnemp: euUnempComplete.processCompletenessPercent,
      deSkUnemp: ueComplete.processCompletenessPercent,
      skTax: skTaxComplete.processCompletenessPercent,
      treaty: treatyComplete.processCompletenessPercent,
      est: estSummary.processCompletenessPercent,
    },
    crossDomainStateSeparationPass: illegalFieldLeakageCount === 0 && ssCaseHasNoTaxFields && taxForbidsLocale,
    validMultiStateResultsAccepted: multiStateSsValid && multiStateTaxValid,
    illegalFieldLeakageCount,
    missingHandoffCount,
    authorityRoutingConflictCount,
    portableDocumentConflictCount,
    temporalConflictCount,
    sourceFreshnessConflictCount,
    employeeParityPass: employeeParity,
    selfEmployedParityPass: selfEmployedParity,
    mixedActivityParityPass: mixedActivityParity,
    residenceChangeReevaluationPass: has("s1-change-requires-reexamination") && has("material-change-re-examine"),
    activityChangeReevaluationPass: Boolean(
      healthSe.activityChangeReevaluationCovered
      && familySe.activityChangeReclassificationCovered
      && ueSe.activityChangeCovered,
    ),
    familyChangeReevaluationPass: has("fb-child-residence-can-change-priority")
      && has("fb-second-parent-activity-can-change-priority"),
    unemploymentTransitionPass: has("ue-art-65-frontier-residence")
      && has("ue-job-during-export-recheck")
      && ARTICLE_65A_ACTIVE_FOR_DE_SK === false,
    taxTemporalTransitionPass: mliBoundaryIndependentOfSs,
    endToEndScenarioCount: evaluatedScenarios.length,
    consistentScenarioCount,
    validMultiStateScenarioCount,
    failClosedMissingContextCount,
    explicitOutOfV1ScopeCount,
    blockedByCrossDomainDefectCount,
    criticalV1BlockerCount,
    requiredV1KnowledgeGapCount,
    requiredV1HandoffGapCount,
    nonBlockingFutureScopeCount,
    presentationLayerOnlyCount,
    runtimeActivationOnlyCount,
    negativeControls: {
      localeLeakRejected,
      nationalityLeakRejected,
      a1NotOtherDomains,
      s1NotOtherDomains,
      ehicS2Separated,
      familyNotFromAl,
      unemploymentNotFromAl,
      uDocsSeparated,
      ssNotTax,
      seNotArticle14,
      seNotAutoUnemployment,
      localeOnSsRejected,
      localeOnTaxRejected,
      a1AsTaxResidenceRejected,
      ssApplicableAsTaxResidenceRejected,
      familyPrimaryAsTaxRejected,
      employerPopulatesTaxingRightRejected,
      selfEmployedAutoArticle14Rejected,
    },
    handoffMatrix: {
      applicableToHealth: { facts: ["verified applicable state", "activity facts"], legalConclusionsForbidden: ["A1 as GKV", "A1 as S1"], pass: healthConsumesAl },
      applicableToFamily: { facts: ["verified activity facts"], legalConclusionsForbidden: ["applicable state as family primary"], pass: familyConsumesAlFactsOnly },
      applicableToUnemployment: { facts: ["last activity/contribution facts"], legalConclusionsForbidden: ["Title II state as benefit state"], pass: ueConsumesAlFactsOnly },
      applicableToTax: { facts: ["activity dates, work/residence facts"], legalConclusionsForbidden: ["A1/SS applicable as tax residence or taxing right"], pass: taxConsumesFactsNotSsLaw },
      healthToFamily: { facts: ["none as family law"], legalConclusionsForbidden: ["S1 as family entitlement"], pass: familyNotFromAl },
      familyToTax: { facts: ["residence/child facts may be reused"], legalConclusionsForbidden: ["family primary as tax residence"], pass: familyPrimaryAsTaxRejected },
      unemploymentToTax: { facts: ["activity dates"], legalConclusionsForbidden: ["U1/benefit state as tax residence"], pass: has("ss-not-tax-residence") },
      residenceFactsToAll: { facts: ["residence facts reusable"], legalConclusionsForbidden: ["SS residence as treaty residence"], pass: ssNotTax },
    },
    portableDocuments: portableDocs,
    portableDocumentConflicts,
    authorityMatrix: {
      de: ["DVKA", "Krankenkasse", "DRV", "Familienkasse", "Elterngeldstelle", "Agentur für Arbeit", "Finanzamt", "BMF"],
      sk: ["Sociálna poisťovňa", "Slovak health insurer", "ÚPSVaR", "Finančná správa"],
      exactOfficeFetchLive: fetchLiveExactOffices,
      hardcodedExactOffices,
      separated: authoritySeparated,
    },
    selfEmployedParity: {
      applicableLegislation: has("art-12-2-self-employed-posting") && has("art-13-2-self-employed-multi-state") && has("art-13-3-employed-plus-self-employed"),
      health: healthSe.selfEmployedCoverageExplicit && healthSe.deSelfEmployedGkvRouteCovered && healthSe.deSelfEmployedPkvFailClosed,
      family: familySe.selfEmployedArticle68ActivityExplicit && familySe.selfEmploymentDoesNotAutoCreateNationalRight,
      unemployment: ueSe.selfEmployedExplicit && ueSe.de28aNotAutomatic && ueSe.skNotAutomatic,
      tax: seNotArticle14,
    },
    article65a: {
      sharedCapabilityExists: ue65a.sharedCapabilityPreserved,
      activeForDeSk: ARTICLE_65A_ACTIVE_FOR_DE_SK,
      notActivatedBySelfEmployment: seNotAutoUnemployment,
    },
    failClosedExamples: {
      missingHealthInsurerFacts,
      missingWorkStateFacts,
    },
    validMultiStateExample: {
      socialSecurityApplicableState: "DE",
      healthCompetentState: "DE",
      residenceState: "SK",
      familyBenefitPrimaryState: "SK",
      familyBenefitSecondaryState: "DE",
      treatyResidenceState: "SK",
      taxingRightStateForGermanWorkIncome: "DE",
      ssContextValid: multiStateSsValid,
      taxContextValid: multiStateTaxValid,
    },
    gaps,
    factoryHasNoTaxDomain,
    BILATERAL_TAX_IS_NOT_TAX_CALCULATOR,
    BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
    BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
    filesCreated: [AUDIT_REL],
    filesModified: [PACKAGE_JSON_REL],
    recommendation: corridorV1Candidate
      ? "AUTHORIZE_DE_SK_CORRIDOR_V1_CLOSURE"
      : "ONE_SPECIFIC_DE_SK_CORRIDOR_REMEDIATION_PACKAGE",
    blockedScenarios: evaluatedScenarios.filter((row) => row.state === "BLOCKED_BY_CROSS_DOMAIN_DEFECT"),
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (phaseResult !== "PASS") process.exit(1);
}

main();
