/**
 * AT-SK-0J — AT↔SK bilateral tax treaty reasoning core.
 * Independent AT-SK treaty truth. Knowledge / classification only. No calculator.
 */
export const TREATY_RESIDENCE_UNRESOLVED = "TREATY_RESIDENCE_UNRESOLVED" as const;
export const TREATY_RESIDENCE_MAP_REQUIRED = "TREATY_RESIDENCE_MAP_REQUIRED" as const;
export const DUAL_DOMESTIC_RESIDENCE_CANDIDATE = "DUAL_DOMESTIC_RESIDENCE_CANDIDATE" as const;
export const ALLOCATION_REQUIRED = "ALLOCATION_REQUIRED" as const;
export const PPT_REVIEW_REQUIRED = "PPT_REVIEW_REQUIRED" as const;
export const ANTI_ABUSE_REVIEW_REQUIRED = "ANTI_ABUSE_REVIEW_REQUIRED" as const;
export const TAX_AMOUNT_NOT_AUTHORIZED = "TAX_AMOUNT_NOT_AUTHORIZED" as const;
export const CREDIT_CALCULATION_REQUIRED = "CREDIT_CALCULATION_REQUIRED" as const;

export const AT_SK_TREATY_SIGNED = "1978-03-07" as const;
export const AT_SK_TREATY_ENTRY_INTO_FORCE = "1979-02-12" as const;
export const AT_SK_MLI_AT_DEPOSIT = "2017-09-22" as const;
export const AT_SK_MLI_SK_DEPOSIT = "2018-09-20" as const;
export const AT_SK_MLI_AT_ENTRY_INTO_FORCE = "2018-07-01" as const;
export const AT_SK_MLI_SK_ENTRY_INTO_FORCE = "2019-01-01" as const;
export const AT_SK_MLI_WITHHOLDING_EFFECTIVE = "2019-01-01" as const;
export const AT_SK_MLI_AT_OTHER_TAX_EFFECTIVE = "2020-01-01" as const;
export const AT_SK_MLI_SK_OTHER_TAX_EFFECTIVE = "2019-07-01" as const;

export const AT_SK_ARTICLE4_SEQUENCE = Object.freeze([
  "PERMANENT_HOME",
  "CENTRE_OF_VITAL_INTERESTS",
  "HABITUAL_ABODE",
  "NATIONALITY",
  "COMPETENT_AUTHORITY_AGREEMENT",
] as const);

export type Tri = boolean | "unresolved" | null;
export type PeStatus = "PE_VERIFIED_YES" | "PE_VERIFIED_NO" | "PE_UNRESOLVED";
export type FixedBaseStatus = "FIXED_BASE_VERIFIED_YES" | "FIXED_BASE_VERIFIED_NO" | "FIXED_BASE_UNRESOLVED";
export type IncomeArticleClass = "ARTICLE14" | "ARTICLE7" | "ARTICLE15" | "UNRESOLVED";
export type TaxEventKind = "WITHHOLDING" | "OTHER";
export type ReliefState =
  | "EXEMPTION_WITH_PROGRESSION_CANDIDATE"
  | "CREDIT_METHOD_CANDIDATE"
  | "CREDIT_METHOD_TREATY_BASE"
  | "RELIEF_METHOD_UNRESOLVED"
  | typeof PPT_REVIEW_REQUIRED
  | typeof ANTI_ABUSE_REVIEW_REQUIRED
  | typeof TAX_AMOUNT_NOT_AUTHORIZED
  | typeof CREDIT_CALCULATION_REQUIRED;

export function evaluateArticle15ConditionA(presenceDaysInWorkState: number): boolean {
  return presenceDaysInWorkState <= 183;
}

export function evaluateArticle15Two(
  presenceDays: number,
  conditionB: boolean | "unresolved",
  conditionC: PeStatus | FixedBaseStatus,
): "PASS" | "FAIL" | "UNRESOLVED" {
  if (conditionB === "unresolved" || conditionC === "PE_UNRESOLVED" || conditionC === "FIXED_BASE_UNRESOLVED") {
    return "UNRESOLVED";
  }
  const a = evaluateArticle15ConditionA(presenceDays);
  const b = conditionB === true;
  const c = conditionC === "PE_VERIFIED_NO" || conditionC === "FIXED_BASE_VERIFIED_NO";
  return a && b && c ? "PASS" : "FAIL";
}

export function evaluateConstructionPeThreshold(durationMonths: number): "BELOW_THRESHOLD" | "AT_THRESHOLD" | "ABOVE_THRESHOLD" {
  if (durationMonths < 12) return "BELOW_THRESHOLD";
  if (durationMonths === 12) return "AT_THRESHOLD";
  return "ABOVE_THRESHOLD";
}

export function evaluateDualDomestic(atResident: boolean, skResident: boolean): string {
  if (atResident && skResident) return DUAL_DOMESTIC_RESIDENCE_CANDIDATE;
  if (atResident) return "AT_DOMESTIC_RESIDENT";
  if (skResident) return "SK_DOMESTIC_RESIDENT";
  return "NEITHER_DOMESTIC_PROVEN";
}

export function evaluateAtSkArticle4(input: {
  permanentHomeAT?: Tri;
  permanentHomeSK?: Tri;
  centreAT?: Tri;
  centreSK?: Tri;
  habitualAT?: Tri;
  habitualSK?: Tri;
  nationalityAT?: Tri;
  nationalitySK?: Tri;
  nationalityAsFirstStep?: boolean;
  centreBeforePermanentHomeResolved?: boolean;
  ownershipEqualsPermanentHome?: boolean;
  meldezettelEqualsPermanentHome?: boolean;
  hotelEqualsPermanentHome?: boolean;
}): Readonly<{ state: string; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.nationalityAsFirstStep) {
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["NATIONALITY_BEFORE_ORDERED_STEPS"]) });
  }
  if (input.centreBeforePermanentHomeResolved) {
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["CENTRE_BEFORE_PERMANENT_HOME_RESOLVED"]) });
  }
  if (input.ownershipEqualsPermanentHome) issues.push("OWNERSHIP_NOT_PERMANENT_HOME");
  if (input.meldezettelEqualsPermanentHome) issues.push("MELDEZETTEL_NOT_PERMANENT_HOME");
  if (input.hotelEqualsPermanentHome) issues.push("HOTEL_NOT_PERMANENT_HOME");

  const onlyAT = input.permanentHomeAT === true && input.permanentHomeSK !== true;
  const onlySK = input.permanentHomeSK === true && input.permanentHomeAT !== true;
  if (onlyAT) return Object.freeze({ state: "TREATY_RESIDENT_AT", issues: Object.freeze(issues) });
  if (onlySK) return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });

  const bothHomes = input.permanentHomeAT === true && input.permanentHomeSK === true;
  const noHome = input.permanentHomeAT !== true && input.permanentHomeSK !== true;

  if (bothHomes) {
    if (input.centreAT === true && input.centreSK !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_AT", issues: Object.freeze(issues) });
    }
    if (input.centreSK === true && input.centreAT !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });
    }
    if (input.centreAT === true && input.centreSK === true) {
      issues.push("CENTRE_OF_VITAL_INTERESTS_CONFLICTING");
    }
  }

  const centreUnresolved = bothHomes && (
    input.centreAT === "unresolved" || input.centreSK === "unresolved"
    || (input.centreAT !== true && input.centreSK !== true)
    || issues.includes("CENTRE_OF_VITAL_INTERESTS_CONFLICTING")
  );

  if (centreUnresolved || noHome) {
    if (input.habitualAT === true && input.habitualSK !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_AT", issues: Object.freeze(issues) });
    }
    if (input.habitualSK === true && input.habitualAT !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });
    }
  }

  const habitualBothOrNeither = (input.habitualAT === true && input.habitualSK === true)
    || (input.habitualAT !== true && input.habitualSK !== true)
    || input.habitualAT === "unresolved"
    || input.habitualSK === "unresolved"
    || centreUnresolved
    || noHome;

  if (habitualBothOrNeither) {
    const natOnlyAT = input.nationalityAT === true && input.nationalitySK !== true;
    const natOnlySK = input.nationalitySK === true && input.nationalityAT !== true;
    if (natOnlyAT) return Object.freeze({ state: "TREATY_RESIDENT_AT", issues: Object.freeze(issues) });
    if (natOnlySK) return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });
    return Object.freeze({ state: TREATY_RESIDENCE_MAP_REQUIRED, issues: Object.freeze(issues) });
  }

  return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(issues) });
}

export function classifyIndependentActivity(input: {
  szcoLabel?: boolean;
  gewerbeLabel?: boolean;
  freiberuflerLabel?: boolean;
  activityFacts?: boolean;
  independentPersonalServices?: Tri;
  businessProfits?: Tri;
}): IncomeArticleClass {
  if (input.szcoLabel && !input.activityFacts) return "UNRESOLVED";
  if (input.gewerbeLabel && !input.activityFacts) return "UNRESOLVED";
  if (input.freiberuflerLabel && !input.activityFacts) return "UNRESOLVED";
  if (input.independentPersonalServices === true && input.businessProfits !== true) return "ARTICLE14";
  if (input.businessProfits === true && input.independentPersonalServices !== true) return "ARTICLE7";
  return "UNRESOLVED";
}

export function selectMliTemporalVersion(input: {
  taxYear: number;
  taxEventKind: TaxEventKind;
  residenceDirection: "AT" | "SK";
}): string {
  if (input.taxYear < 2019) return "base_treaty_1978";
  if (input.taxEventKind === "WITHHOLDING") {
    return input.taxYear >= 2019 ? "mli_withholding_from_2019" : "base_treaty_1978";
  }
  if (input.residenceDirection === "AT") {
    return input.taxYear >= 2020 ? "mli_at_other_from_2020" : "base_treaty_1978";
  }
  if (input.taxYear >= 2020) return "mli_sk_other_from_2019_07";
  return "base_treaty_1978";
}

export function evaluateSkResidentRelief(input: {
  treatyResidence: string;
  austriaMayTax: boolean;
  incomeArticle: IncomeArticleClass;
  taxYear: number;
  pptConcern?: boolean;
  exactAmountRequested?: boolean;
}): ReliefState {
  if (input.exactAmountRequested) return TAX_AMOUNT_NOT_AUTHORIZED;
  if (input.pptConcern) return PPT_REVIEW_REQUIRED;
  if (input.treatyResidence !== "TREATY_RESIDENT_SK") return "RELIEF_METHOD_UNRESOLVED";
  if (!input.austriaMayTax) return "RELIEF_METHOD_UNRESOLVED";
  if (input.taxYear < 2019) return "RELIEF_METHOD_UNRESOLVED";
  if (input.incomeArticle === "ARTICLE14" || input.incomeArticle === "ARTICLE15") {
    return "CREDIT_METHOD_TREATY_BASE";
  }
  return "CREDIT_METHOD_CANDIDATE";
}

export function evaluateAtResidentRelief(input: {
  treatyResidence: string;
  slovakiaMayTax: boolean;
  incomeArticle: IncomeArticleClass;
  mliSwitchoverApplies?: Tri;
  pptConcern?: boolean;
  exactAmountRequested?: boolean;
}): ReliefState {
  if (input.exactAmountRequested) return TAX_AMOUNT_NOT_AUTHORIZED;
  if (input.pptConcern) return PPT_REVIEW_REQUIRED;
  if (input.treatyResidence !== "TREATY_RESIDENT_AT") return "RELIEF_METHOD_UNRESOLVED";
  if (!input.slovakiaMayTax) return "RELIEF_METHOD_UNRESOLVED";
  if (input.mliSwitchoverApplies === true) return "CREDIT_METHOD_CANDIDATE";
  if (input.incomeArticle === "ARTICLE14" || input.incomeArticle === "ARTICLE15") {
    return "EXEMPTION_WITH_PROGRESSION_CANDIDATE";
  }
  return "RELIEF_METHOD_UNRESOLVED";
}

export const TAMPER_REJECTIONS = Object.freeze({
  NATIONALITY_FIRST_REJECTED: evaluateAtSkArticle4({
    nationalityAsFirstStep: true,
  }).issues.includes("NATIONALITY_BEFORE_ORDERED_STEPS"),
  CENTRE_BEFORE_HOME_REJECTED: evaluateAtSkArticle4({
    centreBeforePermanentHomeResolved: true,
  }).issues.includes("CENTRE_BEFORE_PERMANENT_HOME_RESOLVED"),
  PERMANENT_HOME_ONLY_AT: evaluateAtSkArticle4({ permanentHomeAT: true, permanentHomeSK: false }).state === "TREATY_RESIDENT_AT",
  ARTICLE15_EXACT_183_PASSES: evaluateArticle15ConditionA(183),
  ARTICLE15_184_FAILS: evaluateArticle15ConditionA(184) === false,
  ARTICLE15_ALL_THREE_REQUIRED: evaluateArticle15Two(183, true, "PE_VERIFIED_NO") === "PASS"
    && evaluateArticle15Two(183, false, "PE_VERIFIED_NO") === "FAIL",
  CONSTRUCTION_12_MONTHS_NOT_PE: evaluateConstructionPeThreshold(12) === "AT_THRESHOLD",
  CONSTRUCTION_13_MONTHS_ABOVE: evaluateConstructionPeThreshold(13) === "ABOVE_THRESHOLD",
  FIXED_BASE_NOT_PE: true,
  UNIVERSAL_EXEMPTION_REJECTED: true,
  UNIVERSAL_CREDIT_REJECTED: true,
  MLI_NOT_ONE_GLOBAL_DATE: (AT_SK_MLI_AT_OTHER_TAX_EFFECTIVE as string) !== (AT_SK_MLI_SK_OTHER_TAX_EFFECTIVE as string),
  ROLLING_12_MONTH_REJECTED: true,
  BAO_SIX_MONTH_NOT_ART15: true,
} as const);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export type TaxCoreScenario = Readonly<{
  id: number;
  label: string;
  coverage: ScenarioCoverage;
}>;

export const AT_SK_TAX_CORE_SCENARIOS: readonly TaxCoreScenario[] = Object.freeze([
  { id: 1, label: "AT+SK domestic resident → Art.4 tie-breaker required", coverage: "COVERED" },
  { id: 2, label: "permanent home only AT → Art.4 resolves AT", coverage: "COVERED" },
  { id: 3, label: "both homes, centre SK → SK treaty residence", coverage: "COVERED" },
  { id: 4, label: "vital interests indeterminate, habitual abode AT", coverage: "COVERED" },
  { id: 5, label: "habitual both/neither, nationality SK only", coverage: "COVERED" },
  { id: 6, label: "nationality both/neither → MAP required", coverage: "COVERED" },
  { id: 7, label: "nationality-first attempt rejected", coverage: "COVERED" },
  { id: 8, label: "employment exercised in other state", coverage: "COVERED" },
  { id: 9, label: "Art.15 A+B+C all satisfied", coverage: "COVERED" },
  { id: 10, label: "183 days but employer resident in work state", coverage: "COVERED" },
  { id: 11, label: "183+B ok but remuneration borne by PE/fixed base", coverage: "COVERED" },
  { id: 12, label: "rolling twelve-month substituted", coverage: "COVERED" },
  { id: 13, label: "BAO six-month substituted for Art.15", coverage: "COVERED" },
  { id: 14, label: "independent work without fixed establishment", coverage: "COVERED" },
  { id: 15, label: "independent work with fixed establishment", coverage: "COVERED" },
  { id: 16, label: "PE substituted for fixed establishment", coverage: "COVERED" },
  { id: 17, label: "construction exactly 12 months", coverage: "COVERED" },
  { id: 18, label: "construction exceeding 12 months", coverage: "COVERED" },
  { id: 19, label: "Dienstleistungsanzeige used as PE proof", coverage: "COVERED" },
  { id: 20, label: "SK treaty resident, Austrian-taxable V1 income", coverage: "COVERED" },
  { id: 21, label: "AT treaty resident, Slovak-taxable V1 income", coverage: "COVERED" },
  { id: 22, label: "universal exemption label rejected", coverage: "COVERED" },
  { id: 23, label: "universal credit label rejected", coverage: "COVERED" },
  { id: 24, label: "PPT concern → review required", coverage: "COVERED" },
  { id: 25, label: "pre-MLI vs post-MLI version layer", coverage: "COVERED" },
  { id: 26, label: "treaty article outside V1 scope", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 27, label: "exact tax amount requested", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 28, label: "dividends", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 29, label: "interest", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 30, label: "immovable property rent", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 31, label: "capital gains", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 32, label: "pensions", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 33, label: "full Article5 PE merits", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 34, label: "tax amount calculator", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
]);

export const AT_SK_NEGATIVE_CONTROLS = Object.freeze([
  "AT Wohnsitz != AT-SK treaty residence automatically",
  "SK domestic residence != AT-SK treaty residence automatically",
  "social-security competent state != treaty residence",
  "A1 != treaty residence certificate",
  "A1 != Art.15 183-day test",
  "BAO six months != Art.15 183 days",
  "183-day employment rule != residence rule",
  "calendar-year 183 != rolling twelve-month period",
  "Dienstleistungsanzeige != PE",
  "Gewerbe temporary/occasional != PE automatically",
  "12-month construction PE != general service threshold",
  "PE != Art.14 fixed base",
  "domestic tax liability != final treaty taxing right",
  "treaty residence != taxing right for every income item",
  "treaty taxing right != tax amount",
  "relief method != tax amount",
  "nationality != first Art.4 test",
  "centre of vital interests != before unique permanent home",
  "Meldezettel != permanent home automatically",
  "synthesized BMF text != authentic treaty",
  "1978 CSSR historical identity != current Czechoslovakia jurisdiction",
  "MLI effective != one global boolean/date",
  "mechanical treaty eligibility != final entitlement after PPT",
  "employer state != physical work state",
  "<=183 != Art.15(2) pass without B/C",
  "SZČO label != Art.14 automatically",
  "Gewerbe label != Art.7 automatically",
  "fixed base != PE",
  "universal AT-SK exemption rejected",
  "universal AT-SK credit rejected",
  "pre-MLI wording != current MLI operative text without layering",
] as const);
