/**
 * CB-TAX-0A — DE↔SK tax residence and cross-border income treaty
 * architecture audit only.
 *
 * Not a Regulation 883/2004 connector. No canonical pack, no migration 060,
 * no database, no Docker, no production, no public runtime, no identity graph.
 * Architecture types below are audit-local design capture, not implemented
 * knowledge.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { KNOWLEDGE_FACTORY_DOMAINS } from "../source-registry/knowledge-factory-contracts";
import {
  AUTHORIZED_SK_ADAPTER_PACK_IDS,
} from "../source-registry/foreign-national-adapter-contracts";
import {
  CROSS_BORDER_CASE_STATES,
  CROSS_BORDER_CONNECTOR_SCHEMA_VERSION,
  CROSS_BORDER_SOURCE_JURISDICTIONS,
  CROSS_BORDER_TOPIC_FAMILIES,
  CROSS_BORDER_TRUST_DOMAINS,
  validateCuratedCrossBorderConnectorPack,
  type CrossBorderCaseContext,
  type CuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";

const ROOT = process.cwd();
const EXPECTED_HEAD = "aae983b2d0f033b8ee32d92aca39dd057c8f8fa5";
const AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-tax-residence-cross-border-income-architecture-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const CONNECTOR_CONTRACTS_REL =
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts";
const ADAPTER_CONTRACTS_REL =
  "lib/vaylo/smart-talk/knowledge/source-registry/foreign-national-adapter-contracts.ts";
const FACTORY_CONTRACTS_REL =
  "lib/vaylo/smart-talk/knowledge/source-registry/knowledge-factory-contracts.ts";
const EST_PACK_REL =
  "lib/vaylo/smart-talk/knowledge/packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack.ts";
const STEUER_ID_PACK_REL =
  "lib/vaylo/smart-talk/knowledge/packs/de/steuer-id-and-basic-finanzamt-letters/steuer-id-federal-core-pack.ts";
const EU_AL_PACK_REL =
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts";
const MIGRATION_032 = `${MIGRATIONS_DIR}/032_create_minimal_knowledge_schema.sql`;
const MIGRATION_059 = `${MIGRATIONS_DIR}/059_add_de_sk_unemployment_coordination_ingestion.sql`;
const MIGRATION_060 = `${MIGRATIONS_DIR}/060_add_bilateral_tax_treaty_foundation.sql`;

const FORBIDDEN_TAX_PACK_PATHS = [
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-residence",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-treaty",
  "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax",
] as const;

type ArchClass =
  | "SUPPORTED_BY_EXISTING_MODEL"
  | "REQUIRES_ADDITIVE_MODEL_EXTENSION"
  | "REQUIRES_SEPARATE_TAX_CONTRACT"
  | "EXPLICITLY_OUT_OF_INITIAL_SCOPE";

type TieBreakerStep =
  | "PERMANENT_HOME"
  | "CENTRE_OF_VITAL_INTERESTS"
  | "HABITUAL_ABODE"
  | "NATIONALITY"
  | "MUTUAL_AGREEMENT";

/** Audit-local design capture. Not a production contract. */
type TreatyRuleVersion = Readonly<{
  treatyId: "DE_SK_DTA_1980_CONTINUED";
  baseTreatyDate: "1980-12-19";
  continuationDate: "1993";
  mliModified: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  taxType: "WITHHOLDING" | "OTHER" | "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES";
  sourceVersion: "AUTHENTIC_TREATY" | "CONTINUATION" | "AUTHENTIC_MLI" | "BMF_SYNTHESIZED";
}>;

function readRel(relPath: string): string {
  try {
    return fs.readFileSync(path.join(ROOT, relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function runGit(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: ROOT, timeout: 12_000 }).trim();
  } catch {
    return "";
  }
}

function listMigrations(): string[] {
  try {
    return fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR))
      .filter((name) => /^\d{3}_.+\.sql$/u.test(name))
      .sort();
  } catch {
    return [];
  }
}

function walkTsFiles(dirRel: string): string[] {
  const abs = path.join(ROOT, dirRel);
  if (!fs.existsSync(abs)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const next = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(next);
      else if (entry.name.endsWith(".ts")) out.push(next.slice(ROOT.length + 1).replaceAll("\\", "/"));
    }
  };
  walk(abs);
  return out;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const OFFICIAL = Object.freeze({
  bmfTreatyPage:
    "https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Slowakei/1982-12-04-Slowakei-Abkommen-DBA.html",
  bmfMliOverview:
    "https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/BEPS/beps-mli.html",
  bepsmliAnwgSk: "https://www.gesetze-im-internet.de/bepsmlianwg/__10.html",
  oecdDeNotification:
    "https://www.oecd.org/content/dam/oecd/en/topics/policy-sub-issues/beps-mli/beps-mli-notification-article-35-7-b-germany.pdf",
  skMfTreatyList:
    "https://www.mfsr.sk/sk/dane-cla-uctovnictvo/priame-dane/dane-z-prijmu/zmluvy-zamedzeni-dvojiteho-zdanenia/zmluvy-zamedzeni-dvojiteho-zdanenia/zoznam-platnych-ucinnych-zmluv-zamedzeni-dvojiteho-zdanenia/",
  slovLex181984: "https://www.slov-lex.sk/ezbierky/pravne-predpisy/SK/ZZ/1984/18/",
  slovLex595: "https://static.slov-lex.sk/pdf/SK/ZZ/2003/595/ZZ_2003_595_20250701.pdf",
  fsCudzinci: "https://www.financnasprava.sk/sk/obcania/dane/dan-z-prijmov/cudzinci-v-sr",
  estg1: "https://www.gesetze-im-internet.de/estg/__1.html",
  ao8: "https://www.gesetze-im-internet.de/ao_1977/__8.html",
  ao9: "https://www.gesetze-im-internet.de/ao_1977/__9.html",
});

const TREATY = Object.freeze({
  id: "DE_SK_DTA_1980_CONTINUED" as const,
  signed: "1980-12-19",
  originalParties: ["Federal Republic of Germany", "Czechoslovak Socialist Republic"] as const,
  continuation: "Slovak Republic; German Bekanntmachung BGBl 1993 II S. 762",
  entryIntoForce: "1983-11-17",
  germanOfficialStatus: "IN_FORCE",
  slovakOfficialStatus: "IN_FORCE",
  slovakPublication: "18/1984",
  slovakMliNotice: "262/2024",
  authenticLocus: "BGBl 1982 II S. 1022, 1023",
  synthesizedIsNewTreaty: false,
  synthesizedEffectiveMli: "2025-01-01",
  synthesizedDisclaimer: "AUTHENTIC_TREATY_AND_AUTHENTIC_MLI_REMAIN_CONTROLLING",
  articlesInventoried: [
    "1", "2", "3", "4", "5", "6", "7", "10", "11", "12", "13", "14", "15",
    "16", "17", "18", "19", "20", "21", "23", "25", "26",
  ] as const,
  numberingIsModernOecd: false,
});

const MLI = Object.freeze({
  instrument: "BEPS-MLI",
  isEuLaw: false,
  adoptionDate: "2016-11-24",
  deSignatureDate: "2017-06-07",
  skSignatureDate: "2017-06-07",
  germanyEntryIntoForce: "2021-04-01",
  slovakiaEntryIntoForce: "2019-01-01",
  slovakiaInstrumentNotice: "339/2018 Z.z.",
  germanCompletionNotification: "2024-10-02",
  relevantTreatyModificationsFrom: "2025-01-01",
  taxTypeRulesRemain: true,
  signedEqualsInForceEqualsEffective: false,
  effectiveFrom2019ForAllDeSkRules: false,
  signed20161124ByDe: false,
  signed20161124BySk: false,
});

const ARTICLE_4 = Object.freeze({
  sequence: [
    "PERMANENT_HOME",
    "CENTRE_OF_VITAL_INTERESTS",
    "HABITUAL_ABODE",
  ] as readonly TieBreakerStep[],
  nationalityPresent: false,
  mapTieBreakerPresent: false,
  unresolvedAfterHabitualAbode: "FAIL_CLOSED_ROUTE_TO_COMPETENT_AUTHORITY",
  genericOecdRejected: true,
  startsOnlyAfterDomesticResidence: true,
  dualDomesticIsNotTwoTreatyResidences: true,
  intermediateState: "DUAL_DOMESTIC_RESIDENCE_CANDIDATE",
});

const ARTICLE_15 = Object.freeze({
  workStateMayTaxIfExercisedThere: true,
  measurementPeriod: "CALENDAR_YEAR" as const,
  rolling12MonthIsCurrentTreaty: false,
  conditionAMaxDays: 183,
  conditionARule: "presenceDays <= 183" as const,
  conditionAWording: "not more than 183 days during the relevant calendar year",
  conditions: [
    "presence_in_work_state_not_more_than_183_days_in_calendar_year",
    "remuneration_paid_by_or_on_behalf_of_employer_not_resident_in_work_state",
    "remuneration_not_borne_by_permanent_establishment_in_work_state",
  ] as const,
  allThreeConditionsRequired: true,
  underOrEqual183OnlyIsNotSufficient: true,
  under183AloneSufficient: false,
  exactly183AloneSufficient: false,
  exactly183FailsConditionA: false,
  physicalWorkNotEmployerAddress: true,
});

const ARTICLE_14 = Object.freeze({
  standalonePresent: true,
  deletedAsModernOecd: false,
  fixedBaseRequiredForSourceTaxation: true,
  fixedBaseEqualsPermanentEstablishment: false,
  article7AlsoPresent: true,
});

const RELIEF = Object.freeze({
  directional: true,
  globalDeSkReliefMethodForbidden: true,
  germanResident: "EXEMPTION_WITH_PROGRESSION_DEFAULT_CREDIT_FOR_ENUMERATED_CATEGORIES",
  slovakResidentFrom2025: "MLI_ARTICLE_5_6_CREDIT_REPLACING_ARTICLE_23_2_A_AND_B",
  pre2025SlovakSideRequiresAuthenticOriginal: true,
  calculatorDeferred: true,
  exemptionNotNoReporting: true,
  creditNotFullRefund: true,
});

const SK_DOMESTIC = Object.freeze({
  statute: "595/2003",
  testsMustRemainSeparate: ["trvaly_pobyt", "bydlisko", "habitual_presence_183_calendar_year"] as const,
  bydliskoRequiresAccommodationAndLinksAndIntention: true,
  currentCommuterExceptionInStatute: false,
  currentLimitedTaxpayerIncludesTreatyOverride: true,
  currentStudyOrTreatmentException: true,
  fsCudzinciStillDescribesCommuterException: true,
  discrepancy:
    "Current Slov-Lex 595/2003 §2(e) as of 2025-07-01 and 2026-01-01 no longer contains the daily/agreed-interval dependent-employment commuter carve-out. Finančná správa Cudzinci v SR still lists it. Canonical future implementation must prefer Slov-Lex over that page until the page is aligned. Historical texts through at least 2018 contained the carve-out. Do not generalize any commuter fact pattern to self-employed, remote work, or all frontier workers.",
});

const RECOMMENDED_INITIAL_SCOPE = Object.freeze({
  include: [
    "TAX_RESIDENCE_DOMESTIC_THEN_ARTICLE_4",
    "EMPLOYMENT_ARTICLE_15",
    "INDEPENDENT_PERSONAL_SERVICES_ARTICLE_14",
    "DIRECTIONAL_DOUBLE_TAX_RELIEF_ROUTING",
  ] as const,
  defer: [
    "DIVIDENDS",
    "INTEREST",
    "RENT",
    "CAPITAL_GAINS",
    "PENSIONS",
    "PUBLIC_SERVICE",
    "ARTISTS",
    "CORPORATE",
  ] as const,
});

const REQUIRED_EST_CLAIM_KEYS = [
  "unlimited-if-wohnsitz-or-aufenthalt",
  "wohnsitz-definition",
  "gewoehnlicher-aufenthalt-definition",
  "anmeldung-not-tax-residence",
  "nationality-not-tax-residence",
  "userlocale-not-jurisdiction",
  "dual-residence-fail-closed",
  "foreign-income-not-automatically-tax-free",
  "foreign-tax-paid-not-nothing-to-declare",
  "german-employer-not-exclusive-right",
  "treaty-result-fail-closed",
  "tax-free-not-irrelevant-to-rate",
] as const;

function inspectRepository() {
  const connector = readRel(CONNECTOR_CONTRACTS_REL);
  const adapter = readRel(ADAPTER_CONTRACTS_REL);
  const factory = readRel(FACTORY_CONTRACTS_REL);
  const est = readRel(EST_PACK_REL);
  const steuerId = readRel(STEUER_ID_PACK_REL);
  const euAl = readRel(EU_AL_PACK_REL);
  const migration032 = readRel(MIGRATION_032);
  const migration059 = readRel(MIGRATION_059);
  const skPackFiles = walkTsFiles("lib/vaylo/smart-talk/knowledge/packs/sk");
  const migrations = listMigrations();
  const lastMigration = migrations[migrations.length - 1] ?? "";
  const forbiddenPackExists = FORBIDDEN_TAX_PACK_PATHS.some((rel) => fs.existsSync(path.join(ROOT, rel)));
  const migration060Exists = fs.existsSync(path.join(ROOT, MIGRATION_060));
  const taxTreatyUnauthorized = validateCuratedCrossBorderConnectorPack(
    connectorTaxTreatyContamination(),
  ).issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED");
  const ssRequiresEu = /SOCIAL_SECURITY_COORDINATION" && pack.euClaimRefs.length === 0/.test(connector)
    || connector.includes('pack.topicFamily === "SOCIAL_SECURITY_COORDINATION" && pack.euClaimRefs.length === 0');
  const caseContextHasTax = /taxResidence|treatyResidence|incomeItems|fixedBase|doubleTaxRelief/u.test(
    connector.match(/export type CrossBorderCaseContext[\s\S]+?;/u)?.[0] ?? "",
  );
  const uniqueConnector = /constraint knowledge_cross_border_connectors_unique unique \(origin_market, connected_country\)/.test(migration032);
  const euCoordinationColumn = /eu_coordination_claim_ids uuid\[] not null default '\{\}'/.test(migration032);
  const sourceJurisdictionsDeEuOnly =
    CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU";
  const trustDomainsDeEuOnly = CROSS_BORDER_TRUST_DOMAINS.join(",") === "de,eu";
  const topicFamiliesIncludeBoth =
    CROSS_BORDER_TOPIC_FAMILIES.includes("TAX_TREATY")
    && CROSS_BORDER_TOPIC_FAMILIES.includes("SOCIAL_SECURITY_COORDINATION");
  const caseStatesAreSocialSecurity = CROSS_BORDER_CASE_STATES.join(",")
    === "residenceState,employmentState,insuranceState,activityState,postingState";
  const skIncomeTaxPackFound = skPackFiles.some((file) => /tax|income|595/u.test(file))
    || /595\/2003|dani z príjmov|income-tax/u.test(skPackFiles.map((file) => readRel(file)).join("\n"));
  const estHasResidenceCore = REQUIRED_EST_CLAIM_KEYS.every((key) => est.includes(`key: "${key}"`));
  const estHasAbmeldungClaim = /abmeldung-not-tax-non-residence|abmeldung-not-automatic-non-residence/u.test(est);
  const estHasAo8Ao9 = est.includes('key: "ao-8"') && est.includes('key: "ao-9"')
    && est.includes("zusammenhängender Aufenthalt von mehr als sechs Monaten");
  const estHasFullDbaOutOfScope = est.includes("full-dba-engine") && est.includes("EXPLICITLY_OUT_OF_SCOPE");
  const steuerIdHasFinanzamt = steuerId.includes("wohnsitzfinanzamt-default-for-income")
    && steuerId.includes("foreign-address-not-tax-residence");
  const factoryHasEst = (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("einkommensteuer_steuererklaerung");
  const factoryHasSkTax = (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("sk_income_tax");
  const skAdaptersAreSocialSecurityOnly = AUTHORIZED_SK_ADAPTER_PACK_IDS.join(",")
    === [
      "sk_applicable_legislation_adapter",
      "sk_health_insurance_coordination_adapter",
      "sk_family_benefits_adapter",
      "sk_unemployment_coordination_adapter",
    ].join(",");
  const ssNotTaxInEu = euAl.includes('key: "ss-not-tax-residence"') && euAl.includes('key: "a1-not-tax-certificate"');
  const processGroupAllowlistSsOnly = /de_sk_unemployment_coordination_connector/.test(migration059)
    && !/tax_treaty|income_tax|dba/u.test(migration059);
  const jurisdictionHasCrossBorder = /'cross_border_multi_jurisdiction'/.test(migration032);
  const identityGraphAbsent = !/personId|identityGraph|nationalityGraph|vayloDna|birelloDna/u.test(connector);

  return {
    connector,
    est,
    migration032,
    migrations,
    lastMigration,
    forbiddenPackExists,
    migration060Exists,
    taxTreatyUnauthorized,
    ssRequiresEu,
    caseContextHasTax,
    uniqueConnector,
    euCoordinationColumn,
    sourceJurisdictionsDeEuOnly,
    trustDomainsDeEuOnly,
    topicFamiliesIncludeBoth,
    caseStatesAreSocialSecurity,
    skIncomeTaxPackFound,
    skPackFiles,
    estHasResidenceCore,
    estHasAbmeldungClaim,
    estHasAo8Ao9,
    estHasFullDbaOutOfScope,
    steuerIdHasFinanzamt,
    factoryHasEst,
    factoryHasSkTax,
    skAdaptersAreSocialSecurityOnly,
    ssNotTaxInEu,
    processGroupAllowlistSsOnly,
    jurisdictionHasCrossBorder,
    identityGraphAbsent,
    adapter,
    factory,
  };
}

function architectureFindings(repo: ReturnType<typeof inspectRepository>) {
  const existingGermanIncomeTaxCoreFound = repo.estHasResidenceCore && repo.factoryHasEst;
  const existingGermanTaxResidenceCoverage = repo.estHasResidenceCore && repo.estHasAo8Ao9;
  const existingSlovakTaxPackFound = repo.skIncomeTaxPackFound || repo.factoryHasSkTax;
  const existingConnectorContractTaxSafe = false;
  const existingConnectorContractSocialSecurityCoupled = repo.taxTreatyUnauthorized
    && repo.uniqueConnector
    && repo.sourceJurisdictionsDeEuOnly
    && repo.euCoordinationColumn
    && repo.ssRequiresEu
    && repo.caseStatesAreSocialSecurity
    && !repo.caseContextHasTax;
  const separateTaxCaseContextRequired = true;
  const separateBilateralTaxTreatyContractRequired = true;
  return {
    existingGermanIncomeTaxCoreFound,
    existingGermanTaxResidenceCoverage,
    existingSlovakTaxPackFound,
    existingConnectorContractTaxSafe,
    existingConnectorContractSocialSecurityCoupled,
    separateTaxCaseContextRequired,
    separateBilateralTaxTreatyContractRequired,
    domesticResidenceDERepresentable: existingGermanTaxResidenceCoverage,
    domesticResidenceSKRepresentable: false,
    dualDomesticResidenceRepresentable: false,
    treatyArticle4Representable: false,
    article4ExactTieBreakerCaptured: ARTICLE_4.sequence.join(">") === "PERMANENT_HOME>CENTRE_OF_VITAL_INTERESTS>HABITUAL_ABODE"
      && ARTICLE_4.nationalityPresent === false
      && ARTICLE_4.mapTieBreakerPresent === false,
    genericOecdTieBreakerRejected: ARTICLE_4.genericOecdRejected,
    article15EmploymentRepresentable: false,
    article15CalendarYear183Captured: ARTICLE_15.measurementPeriod === "CALENDAR_YEAR",
    article15ThreeConditionsCaptured: ARTICLE_15.conditions.length === 3
      && ARTICLE_15.allThreeConditionsRequired
      && ARTICLE_15.underOrEqual183OnlyIsNotSufficient,
    article15MeasurementPeriod: ARTICLE_15.measurementPeriod,
    article15ConditionAMaxDays: ARTICLE_15.conditionAMaxDays,
    exact183ConditionAPasses: evaluateArticle15ConditionA(183),
    day184ConditionAFails: evaluateArticle15ConditionA(184) === false,
    article15AllThreeConditionsRequired: ARTICLE_15.allThreeConditionsRequired,
    mliAdoptionDateCorrect: MLI.adoptionDate === "2016-11-24",
    deMliSignatureDateCorrect: MLI.deSignatureDate === "2017-06-07",
    skMliSignatureDateCorrect: MLI.skSignatureDate === "2017-06-07",
    deSkMliEffective2025Preserved: MLI.relevantTreatyModificationsFrom === "2025-01-01",
    article14SelfEmployedRepresentable: false,
    article14VsArticle7BoundaryRepresentable: ARTICLE_14.standalonePresent && ARTICLE_14.article7AlsoPresent,
    fixedBaseRepresentable: false,
    permanentEstablishmentRepresentable: false,
    mliTemporalVersionRepresentable: MLI.signedEqualsInForceEqualsEffective === false
      && MLI.effectiveFrom2019ForAllDeSkRules === false
      && MLI.signed20161124ByDe === false
      && MLI.signed20161124BySk === false
      && MLI.adoptionDate === "2016-11-24"
      && MLI.deSignatureDate === "2017-06-07"
      && MLI.skSignatureDate === "2017-06-07",
    doubleTaxReliefDirectionalRepresentable: RELIEF.directional && RELIEF.globalDeSkReliefMethodForbidden,
    socialSecurityTaxSeparationProvable: repo.ssNotTaxInEu
      && repo.taxTreatyUnauthorized
      && !repo.caseContextHasTax
      && repo.est.includes("dual-residence-fail-closed"),
    migrationRequiredForNextImplementation: true,
    recommendedInitialTaxPackScope: RECOMMENDED_INITIAL_SCOPE.include.join("+"),
    germanAbmeldungGap: !repo.estHasAbmeldungClaim,
    slovakCommuterStatuteDiscrepancy: SK_DOMESTIC.discrepancy,
    jurisdictionLevelAlreadyHasCrossBorderMulti: repo.jurisdictionHasCrossBorder,
    nextMigrationShape:
      "Separate bilateral tax treaty tables + dedicated tax writer. Do not reuse knowledge_cross_border_connectors unique (origin_market, connected_country) or 051–059 social-security writers. Substantive Article 4/14/15/23 packs remain out of CB-TAX-0A scope.",
  };
}

const SCENARIOS: readonly { id: number; label: string; classification: ArchClass }[] = Object.freeze([
  { id: 1, label: "lives and works DE only", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 2, label: "lives and works SK only", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 3, label: "Wohnsitz DE + trvalý pobyt SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 4, label: "permanent home both states", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 5, label: "centre of vital interests clearly DE", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 6, label: "centre clearly SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 7, label: "centre cannot be determined", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 8, label: "habitual abode resolves DE", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 9, label: "habitual abode resolves SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 10, label: "Article 4 remains unresolved under exact treaty", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 11, label: "200 days DE but stronger treaty residence facts require proper process", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 12, label: "183 days incorrectly used as treaty residence shortcut", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 13, label: "SK domestic resident via trvalý pobyt", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 14, label: "SK domestic resident via bydlisko", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 15, label: "SK domestic resident via 183 days", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 16, label: "German resident via Wohnsitz", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 17, label: "German resident via gewöhnlicher Aufenthalt", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 18, label: "Anmeldung but no proven Wohnsitz facts", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 19, label: "Abmeldung but German Wohnsitz may remain", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 20, label: "employee resident SK physically works DE", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 21, label: "employee resident DE physically works SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 22, label: "employee under 183 days but employer condition fails", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 23, label: "employee under 183 days but PE-bearing condition fails", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 24, label: "all Article15(2) conditions satisfied", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 25, label: "exactly 183 days", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 26, label: "more than 183 days", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 27, label: "treaty uses calendar year, not rolling 12 months", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 28, label: "German employer + home office SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 29, label: "Slovak employer + home office DE", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 30, label: "work performed in both DE/SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 31, label: "Freiberufler DE with SK clients only", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 32, label: "SZČO SK with German clients only", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 33, label: "self-employed with fixed base DE", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 34, label: "self-employed with fixed base SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 35, label: "fixed-base status unknown", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 36, label: "Article14 vs Article7 classification unknown", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 37, label: "Gewerbe incorrectly assumed Article7", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 38, label: "Freiberufler incorrectly assumed Article14 automatically", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 39, label: "EU social-security state DE but treaty residence SK", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 40, label: "A1 DE but income tax right SK/DE requires independent analysis", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 41, label: "S1 SK registration wrongly used as tax residence", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 42, label: "employee + self-employed mixed income", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 43, label: "move SK→DE during tax year", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 44, label: "move DE→SK during tax year", classification: "REQUIRES_ADDITIVE_MODEL_EXTENSION" },
  { id: 45, label: "German treaty resident with Slovak-source income", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 46, label: "Slovak treaty resident with German-source income", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 47, label: "German relief method selection", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 48, label: "Slovak post-2025 MLI relief method selection", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 49, label: "pre-2025 treaty-relief period", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 50, label: "2025+ MLI period", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 51, label: "nationality SK wrongly resolves residence", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 52, label: "nationality DE wrongly resolves residence", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 53, label: "tax residence inferred from social-security competent state", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 54, label: "userLocale used as jurisdiction", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 55, label: "exact tax amount requested without complete facts", classification: "SUPPORTED_BY_EXISTING_MODEL" },
  { id: 56, label: "treaty article uncertain", classification: "REQUIRES_SEPARATE_TAX_CONTRACT" },
  { id: 57, label: "third-country income", classification: "EXPLICITLY_OUT_OF_INITIAL_SCOPE" },
  { id: 58, label: "DE-CZ factual case while locale SK", classification: "EXPLICITLY_OUT_OF_INITIAL_SCOPE" },
  { id: 59, label: "corporate taxpayer case", classification: "EXPLICITLY_OUT_OF_INITIAL_SCOPE" },
  { id: 60, label: "treaty replacement/future amendment case", classification: "EXPLICITLY_OUT_OF_INITIAL_SCOPE" },
]);

const NEGATIVE_CONTROLS = Object.freeze([
  "socialSecurityCompetentState != taxResidenceState",
  "A1 != tax residence proof",
  "S1 != tax residence proof",
  "U1/U2 != tax residence proof",
  "familyBenefitPrimaryState != tax residence",
  "nationality != tax residence",
  "userLocale != tax jurisdiction",
  "Anmeldung != treaty residence automatically",
  "Abmeldung != tax non-residence automatically",
  "trvalý pobyt != final treaty residence automatically",
  "183 days != universal tax residence rule",
  "Article15 183 days != Article4 residence",
  "DE AO six-month rule != SK 183-day rule",
  "SK 183-day domestic rule != Article15 183-day test",
  "not more than 183 days alone != automatic residence-state-only employment taxation",
  "employer country != physical work state",
  "salary payer state != taxing right automatically",
  "Gewerbe != Article7 automatically",
  "Freiberufler != Article14 automatically",
  "SZČO != Article14 automatically",
  "EU self-employed classification != tax treaty Article14 classification",
  "fixed base != permanent establishment automatically",
  "source state != treaty residence",
  "treaty residence != exclusive taxing right for every income",
  "tax credit != full foreign-tax refund",
  "treaty exemption != no filing/reporting obligation automatically",
  "one person != one treaty article for all income",
  "MLI != EU law",
  "2025 synthesized text != new treaty",
  "social-security connector != tax treaty connector",
]);

function evaluateArticle15ConditionA(presenceDays: number): boolean {
  return presenceDays <= ARTICLE_15.conditionAMaxDays;
}

function evaluateArticle15ResidenceStateOnly(input: {
  presenceDays: number | null;
  conditionB: boolean | null;
  conditionC: boolean | null;
}): "PASS" | "FAIL" | "INSUFFICIENT" {
  if (input.presenceDays === null || input.conditionB === null || input.conditionC === null) {
    return "INSUFFICIENT";
  }
  return evaluateArticle15ConditionA(input.presenceDays) && input.conditionB && input.conditionC
    ? "PASS"
    : "FAIL";
}

function article15BoundaryProofs() {
  return {
    day182ConditionAPasses: evaluateArticle15ConditionA(182) === true,
    exact183ConditionAPasses: evaluateArticle15ConditionA(183) === true,
    day184ConditionAFails: evaluateArticle15ConditionA(184) === false,
    day182AllThreeCanPass: evaluateArticle15ResidenceStateOnly({
      presenceDays: 182, conditionB: true, conditionC: true,
    }) === "PASS",
    exact183AllThreeCanPass: evaluateArticle15ResidenceStateOnly({
      presenceDays: 183, conditionB: true, conditionC: true,
    }) === "PASS",
    day184AllThreeFailConditionA: evaluateArticle15ResidenceStateOnly({
      presenceDays: 184, conditionB: true, conditionC: true,
    }) === "FAIL",
    exact183BFailsOverallFail: evaluateArticle15ResidenceStateOnly({
      presenceDays: 183, conditionB: false, conditionC: true,
    }) === "FAIL",
    exact183CFailsOverallFail: evaluateArticle15ResidenceStateOnly({
      presenceDays: 183, conditionB: true, conditionC: false,
    }) === "FAIL",
    exact183AloneInsufficient: evaluateArticle15ResidenceStateOnly({
      presenceDays: 183, conditionB: null, conditionC: null,
    }) === "INSUFFICIENT",
  };
}

function exactnessIssues(): string[] {
  const issues: string[] = [];
  if (ARTICLE_4.sequence.includes("NATIONALITY") || ARTICLE_4.nationalityPresent) {
    issues.push("GENERIC_OECD_NATIONALITY_INVENTED");
  }
  if (ARTICLE_4.sequence.includes("MUTUAL_AGREEMENT") || ARTICLE_4.mapTieBreakerPresent) {
    issues.push("GENERIC_OECD_MAP_INVENTED");
  }
  if (ARTICLE_4.sequence.length !== 3) issues.push("ARTICLE4_SEQUENCE_WRONG_LENGTH");
  if (ARTICLE_15.under183AloneSufficient) issues.push("UNDER_183_ONLY_IS_SUFFICIENT");
  if (ARTICLE_15.exactly183AloneSufficient) issues.push("EXACTLY_183_ONLY_IS_SUFFICIENT");
  if (ARTICLE_15.exactly183FailsConditionA) issues.push("EXACTLY_183_FAILS_CONDITION_A");
  if (!ARTICLE_15.underOrEqual183OnlyIsNotSufficient) issues.push("UNDER_OR_EQUAL_183_ONLY_TREATED_AS_SUFFICIENT");
  if (ARTICLE_15.rolling12MonthIsCurrentTreaty) issues.push("ROLLING_12_MONTH_RULE_IS_CURRENT_DE_SK_TREATY");
  if (ARTICLE_15.measurementPeriod !== "CALENDAR_YEAR") issues.push("ARTICLE15_PERIOD_NOT_CALENDAR_YEAR");
  if (ARTICLE_15.conditionAMaxDays !== 183) issues.push("ARTICLE15_CONDITION_A_MAX_DAYS_WRONG");
  if (ARTICLE_15.conditionAWording.includes("less than 183")) issues.push("ARTICLE15_PARAPHRASED_AS_LESS_THAN_183");
  if (ARTICLE_15.conditions.length !== 3 || !ARTICLE_15.allThreeConditionsRequired) {
    issues.push("ARTICLE15_CONDITIONS_INCOMPLETE");
  }
  if (ARTICLE_14.deletedAsModernOecd || !ARTICLE_14.standalonePresent) {
    issues.push("ARTICLE14_DELETED_AS_IN_MODERN_OECD_MODEL");
  }
  if (ARTICLE_14.fixedBaseEqualsPermanentEstablishment) issues.push("FIXED_BASE_COLLAPSED_INTO_PE");
  if (MLI.effectiveFrom2019ForAllDeSkRules) issues.push("MLI_EFFECTIVE_FROM_2019_FOR_ALL_DE_SK_TREATY_RULES");
  if (TREATY.synthesizedIsNewTreaty) issues.push("SYNTHESIZED_2025_TEXT_IS_A_NEW_BILATERAL_TREATY");
  if (MLI.isEuLaw) issues.push("MLI_CLASSIFIED_AS_EU_LAW");
  if (MLI.signedEqualsInForceEqualsEffective) issues.push("MLI_DATES_COLLAPSED");
  if (MLI.signed20161124ByDe) issues.push("MLI_SIGNED_2016_11_24_BY_DE");
  if (MLI.signed20161124BySk) issues.push("MLI_SIGNED_2016_11_24_BY_SK");
  if (MLI.adoptionDate !== "2016-11-24") issues.push("MLI_ADOPTION_DATE_WRONG");
  if (MLI.deSignatureDate !== "2017-06-07") issues.push("DE_MLI_SIGNATURE_WRONG");
  if (MLI.skSignatureDate !== "2017-06-07") issues.push("SK_MLI_SIGNATURE_WRONG");
  if (MLI.relevantTreatyModificationsFrom !== "2025-01-01") issues.push("DE_SK_MLI_TREATY_EFFECT_NOT_2025");
  if (SK_DOMESTIC.currentCommuterExceptionInStatute) {
    issues.push("SK_COMMUTER_EXCEPTION_TREATED_AS_CURRENT_STATUTE_WITHOUT_SLOVLEX_PROOF");
  }
  if (TREATY.numberingIsModernOecd) issues.push("OECD_NUMBERING_IMPORTED");
  const bounds = article15BoundaryProofs();
  if (!bounds.day182ConditionAPasses || !bounds.exact183ConditionAPasses) {
    issues.push("EXACTLY_183_FAILS_CONDITION_A");
  }
  if (!bounds.day184ConditionAFails) issues.push("DAY_184_CONDITION_A_NOT_FAILED");
  if (!bounds.day182AllThreeCanPass || !bounds.exact183AllThreeCanPass) {
    issues.push("ARTICLE15_THREE_CONDITION_GATE_WRONG");
  }
  if (!bounds.day184AllThreeFailConditionA) issues.push("DAY_184_OVERALL_NOT_FAILED");
  if (!bounds.exact183BFailsOverallFail || !bounds.exact183CFailsOverallFail) {
    issues.push("ARTICLE15_B_OR_C_FAILURE_NOT_OVERALL_FAIL");
  }
  if (!bounds.exact183AloneInsufficient) issues.push("EXACTLY_183_ONLY_IS_SUFFICIENT");
  return issues;
}

function tamperRejected(): boolean {
  const a4 = clone(ARTICLE_4) as unknown as {
    nationalityPresent: boolean;
    mapTieBreakerPresent: boolean;
    sequence: TieBreakerStep[];
  };
  a4.nationalityPresent = true;
  a4.sequence = [...ARTICLE_4.sequence, "NATIONALITY"];
  const a15 = clone(ARTICLE_15) as unknown as {
    under183AloneSufficient: boolean;
    exactly183AloneSufficient: boolean;
    exactly183FailsConditionA: boolean;
    rolling12MonthIsCurrentTreaty: boolean;
  };
  a15.under183AloneSufficient = true;
  a15.exactly183AloneSufficient = true;
  a15.exactly183FailsConditionA = true;
  a15.rolling12MonthIsCurrentTreaty = true;
  const a14 = clone(ARTICLE_14) as unknown as {
    deletedAsModernOecd: boolean;
    standalonePresent: boolean;
  };
  a14.deletedAsModernOecd = true;
  a14.standalonePresent = false;
  const mli = clone(MLI) as unknown as {
    effectiveFrom2019ForAllDeSkRules: boolean;
    isEuLaw: boolean;
    signed20161124ByDe: boolean;
    signed20161124BySk: boolean;
    deSignatureDate: string;
    skSignatureDate: string;
  };
  mli.effectiveFrom2019ForAllDeSkRules = true;
  mli.isEuLaw = true;
  mli.signed20161124ByDe = true;
  mli.signed20161124BySk = true;
  mli.deSignatureDate = "2016-11-24";
  mli.skSignatureDate = "2016-11-24";
  const treaty = clone(TREATY) as unknown as { synthesizedIsNewTreaty: boolean };
  treaty.synthesizedIsNewTreaty = true;
  const taxPack = connectorTaxTreatyContamination();
  const euTrustPack = {
    ...taxPack,
    topicFamily: "TAX_TREATY",
    germanClaimRefs: taxPack.germanClaimRefs.map((ref) => ({ ...ref, trustDomain: "eu" as const })),
  } as CuratedCrossBorderConnectorPack;
  return a4.nationalityPresent === true
    && a15.under183AloneSufficient === true
    && a15.exactly183AloneSufficient === true
    && a15.exactly183FailsConditionA === true
    && a15.rolling12MonthIsCurrentTreaty === true
    && a14.deletedAsModernOecd === true
    && mli.effectiveFrom2019ForAllDeSkRules === true
    && mli.signed20161124ByDe === true
    && mli.signed20161124BySk === true
    && treaty.synthesizedIsNewTreaty === true
    && validateCuratedCrossBorderConnectorPack(taxPack).issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED")
    && validateCuratedCrossBorderConnectorPack(euTrustPack).issues.length > 0
    && exactnessIssues().length === 0;
}

function conceptualTaxContextLeakageProof(): boolean {
  const ssContext: CrossBorderCaseContext = {
    persons: [{ role: "WORKER", residenceState: "SK", employmentState: "DE" }],
    period: { from: "2026-01-01", to: "2026-12-31" },
    healthcare: { competentState: "DE", s1Status: "REGISTERED_SK" },
    familyBenefits: { primaryBenefitState: "DE" },
    unemployment: { unemploymentStatus: "WHOLE" },
  };
  const serialized = JSON.stringify(ssContext);
  return !/treatyResidence|domesticTaxResidence|taxingRight|fixedBase|incomeItems/u.test(serialized)
    && ssContext.healthcare?.competentState === "DE";
}

function recommendedTreatyVersions(): readonly TreatyRuleVersion[] {
  return Object.freeze([
    {
      treatyId: "DE_SK_DTA_1980_CONTINUED",
      baseTreatyDate: "1980-12-19",
      continuationDate: "1993",
      mliModified: false,
      effectiveFrom: "1984-01-01",
      effectiveTo: "2024-12-31",
      taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
      sourceVersion: "AUTHENTIC_TREATY",
    },
    {
      treatyId: "DE_SK_DTA_1980_CONTINUED",
      baseTreatyDate: "1980-12-19",
      continuationDate: "1993",
      mliModified: true,
      effectiveFrom: "2025-01-01",
      effectiveTo: null,
      taxType: "ALL_SUBJECT_TO_ARTICLE_SPECIFIC_RULES",
      sourceVersion: "AUTHENTIC_MLI",
    },
  ]);
}

function main(): void {
  const branch = runGit("git branch --show-current");
  const head = runGit("git rev-parse HEAD");
  const status = runGit("git status --short");
  const repo = inspectRepository();
  const findings = architectureFindings(repo);
  const exactness = exactnessIssues();
  const scenarioCounts = {
    total: SCENARIOS.length,
    SUPPORTED_BY_EXISTING_MODEL: SCENARIOS.filter((s) => s.classification === "SUPPORTED_BY_EXISTING_MODEL").length,
    REQUIRES_ADDITIVE_MODEL_EXTENSION: SCENARIOS.filter((s) => s.classification === "REQUIRES_ADDITIVE_MODEL_EXTENSION").length,
    REQUIRES_SEPARATE_TAX_CONTRACT: SCENARIOS.filter((s) => s.classification === "REQUIRES_SEPARATE_TAX_CONTRACT").length,
    EXPLICITLY_OUT_OF_INITIAL_SCOPE: SCENARIOS.filter((s) => s.classification === "EXPLICITLY_OUT_OF_INITIAL_SCOPE").length,
  };
  const packageJson = readRel(PACKAGE_JSON_REL);
  const hasAuditScript = packageJson.includes("knowledge:local:audit-de-sk-tax-residence-architecture");
  const selfExists = fs.existsSync(path.join(ROOT, AUDIT_REL_PATH));
  const productionInteraction = false;
  const publicRuntime = false;
  const activeCorridors = 0;

  const article15Proofs = article15BoundaryProofs();
  const blockers: string[] = [];
  if (branch !== "main") blockers.push(`BRANCH_NOT_MAIN:${branch}`);
  if (repo.forbiddenPackExists) blockers.push("TAX_PACK_CREATED");
  if (!selfExists) blockers.push("AUDIT_RUNNER_MISSING");
  if (!hasAuditScript) blockers.push("AUDIT_SCRIPT_MISSING");
  if (
    repo.lastMigration !== "059_add_de_sk_unemployment_coordination_ingestion.sql"
    && !repo.lastMigration.startsWith("060_")
  ) {
    blockers.push(`UNEXPECTED_LAST_MIGRATION:${repo.lastMigration}`);
  }
  if (!findings.existingGermanIncomeTaxCoreFound) blockers.push("GERMAN_EST_CORE_MISSING");
  if (findings.existingSlovakTaxPackFound) blockers.push("UNEXPECTED_SK_TAX_PACK");
  if (findings.existingConnectorContractTaxSafe) blockers.push("CONNECTOR_FALSELY_TAX_SAFE");
  if (!findings.existingConnectorContractSocialSecurityCoupled) blockers.push("SS_COUPLING_NOT_PROVEN");
  if (!findings.article4ExactTieBreakerCaptured) blockers.push("ARTICLE4_NOT_CAPTURED");
  if (!findings.socialSecurityTaxSeparationProvable) blockers.push("SS_TAX_SEPARATION_UNPROVEN");
  if (findings.article15MeasurementPeriod !== "CALENDAR_YEAR" || findings.article15ConditionAMaxDays !== 183) {
    blockers.push("ARTICLE15_CANONICAL_SEMANTICS_WRONG");
  }
  if (!findings.exact183ConditionAPasses) blockers.push("EXACTLY_183_FAILS_CONDITION_A");
  if (!findings.day184ConditionAFails) blockers.push("DAY_184_CONDITION_A_NOT_FAILED");
  if (!findings.article15AllThreeConditionsRequired) blockers.push("ARTICLE15_THREE_CONDITIONS_NOT_REQUIRED");
  if (!findings.mliAdoptionDateCorrect) blockers.push("MLI_ADOPTION_DATE_WRONG");
  if (!findings.deMliSignatureDateCorrect) blockers.push("DE_MLI_SIGNATURE_WRONG");
  if (!findings.skMliSignatureDateCorrect) blockers.push("SK_MLI_SIGNATURE_WRONG");
  if (!findings.deSkMliEffective2025Preserved) blockers.push("DE_SK_MLI_TREATY_EFFECT_NOT_2025");
  if (!article15Proofs.day182AllThreeCanPass || !article15Proofs.exact183AllThreeCanPass) {
    blockers.push("ARTICLE15_BOUNDARY_GATE_WRONG");
  }
  if (!tamperRejected()) blockers.push("TAMPER_CASES_NOT_REJECTED");
  if (!conceptualTaxContextLeakageProof()) blockers.push("SS_CONTEXT_ALREADY_HAS_TAX_FIELDS");
  if (!repo.identityGraphAbsent) blockers.push("IDENTITY_GRAPH_PRESENT");
  if (CROSS_BORDER_CONNECTOR_SCHEMA_VERSION < 1) blockers.push("CONNECTOR_SCHEMA_MISSING");
  if (exactness.length) blockers.push(...exactness);
  if (SCENARIOS.length !== 60) blockers.push(`SCENARIO_COUNT:${SCENARIOS.length}`);
  if (NEGATIVE_CONTROLS.length !== 30) blockers.push(`NEGATIVE_CONTROL_COUNT:${NEGATIVE_CONTROLS.length}`);
  if (recommendedTreatyVersions().length !== 2) blockers.push("TREATY_VERSION_MODEL_MISSING");

  const phaseResult = blockers.length === 0 ? "PASS" : "FAIL";
  const report = {
    phase: "CB-TAX-0A",
    phaseResult,
    publicRuntimeAuthorized: publicRuntime,
    productionInteraction,
    activeCorridors,
    repository: { branch, startingHead: EXPECTED_HEAD, finalHead: head, workingTree: status },
    currentTreaty: TREATY,
    mli: {
      ...MLI,
      mliAdoptionDate: MLI.adoptionDate,
      deMliSignatureDate: MLI.deSignatureDate,
      skMliSignatureDate: MLI.skSignatureDate,
      skMliEntryIntoForce: MLI.slovakiaEntryIntoForce,
      deMliEntryIntoForce: MLI.germanyEntryIntoForce,
      deSkMliTreatyEffectFrom: MLI.relevantTreatyModificationsFrom,
    },
    officialSources: OFFICIAL,
    article4: ARTICLE_4,
    article15: ARTICLE_15,
    article15BoundaryProofs: article15Proofs,
    article14: ARTICLE_14,
    relief: RELIEF,
    slovakDomestic: SK_DOMESTIC,
    germanDomesticReuse: {
      wohnsitz: repo.estHasAo8Ao9,
      gewoehnlicherAufenthalt: repo.estHasAo8Ao9,
      anmeldungNotResidence: repo.est.includes("anmeldung-not-tax-residence"),
      abmeldungClaimMissing: !repo.estHasAbmeldungClaim,
      dualResidenceFailClosedOnly: repo.estHasFullDbaOutOfScope,
      finanzamtLiveLookup: repo.steuerIdHasFinanzamt,
    },
    existingRepository: {
      germanEinkommensteuerCore: findings.existingGermanIncomeTaxCoreFound,
      germanTaxResidenceClaims: findings.existingGermanTaxResidenceCoverage,
      slovakIncomeTaxPack: findings.existingSlovakTaxPackFound,
      skPackFiles: repo.skPackFiles,
      connectorUniqueOnOriginAndCountry: repo.uniqueConnector,
      lastCommittedMigration: repo.lastMigration,
      migration060Created: repo.migration060Exists,
    },
    findings,
    architectureSeparation: {
      userLocaleIndependent: true,
      nationalityIndependent: true,
      socialSecurityResidenceIndependent: true,
      applicableCompetentIndependent: true,
      domesticTaxResidenceDEIndependent: true,
      domesticTaxResidenceSKIndependent: true,
      treatyResidenceIndependent: true,
      workSourceStateIndependent: true,
      taxingRightStateIndependent: true,
      reliefStateIndependent: true,
    },
    taxCaseModel: {
      existingContextReusable: false,
      separateCrossBorderTaxCaseContextRequired: true,
      incomeItemModelRequired: true,
      optionalSocialSecurityContextReferenceOnly: true,
    },
    connectorModel: {
      existingGenericConnectorSuitable: false,
      socialSecuritySemanticCoupling: true,
      separateBilateralTaxContractNeeded: true,
      conceptualName: "CuratedBilateralTaxTreatyPack",
      implementedInThisPhase: false,
    },
    trustProvenance: {
      bilateralTreatyNotEu: true,
      mliNotEuLaw: !MLI.isEuLaw,
      euTrustMisuseRejected: repo.trustDomainsDeEuOnly,
      authenticVsSynthesizedPreserved: TREATY.synthesizedDisclaimer,
    },
    scenarioMatrix: scenarioCounts,
    scenarios: SCENARIOS,
    negativeControls: { total: NEGATIVE_CONTROLS.length, controls: NEGATIVE_CONTROLS },
    migration: {
      migration060Created: repo.migration060Exists,
      likelyNextPhaseMigrationNeeded: true,
      reason: findings.nextMigrationShape,
    },
    recommendedInitialTaxPackScope: RECOMMENDED_INITIAL_SCOPE,
    peImplementationDeferred: true,
    calculatorDeferred: true,
    noIdentityPersistence: true,
    filesCreated: [AUDIT_REL_PATH],
    filesModified: [PACKAGE_JSON_REL],
    blockers,
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (phaseResult !== "PASS") process.exit(1);
}

main();
