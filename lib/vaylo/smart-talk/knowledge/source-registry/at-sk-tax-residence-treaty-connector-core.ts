/**
 * AT-SK-0K — AT↔SK tax residence / treaty connector orchestration core.
 * Routes domestic facts → treaty core (0J). Does not duplicate national or treaty truth.
 */
import {
  ANTI_ABUSE_REVIEW_REQUIRED,
  DUAL_DOMESTIC_RESIDENCE_CANDIDATE,
  PPT_REVIEW_REQUIRED,
  TAX_AMOUNT_NOT_AUTHORIZED,
  TREATY_RESIDENCE_MAP_REQUIRED,
  TREATY_RESIDENCE_UNRESOLVED,
  classifyIndependentActivity,
  evaluateArticle15Two,
  evaluateAtResidentRelief,
  evaluateAtSkArticle4,
  evaluateConstructionPeThreshold,
  evaluateDualDomestic,
  evaluateSkResidentRelief,
  selectMliTemporalVersion,
  type FixedBaseStatus,
  type IncomeArticleClass,
  type PeStatus,
  type TaxEventKind,
} from "./at-sk-bilateral-tax-treaty-core";

export const AT_SK_CONN_EVIDENCE_REQUIRED = "EVIDENCE_REQUIRED" as const;
export const AT_SK_CONN_TREATY_EXPANSION_REQUIRED = "TREATY_EXPANSION_REQUIRED" as const;

export type AtSkTaxConnectorDomesticInput = Readonly<{
  atDomesticResident?: boolean | "unresolved";
  skDomesticResident?: boolean | "unresolved";
}>;

export type AtSkTaxConnectorArt4Input = Readonly<{
  permanentHomeAT?: boolean | "unresolved" | null;
  permanentHomeSK?: boolean | "unresolved" | null;
  centreAT?: boolean | "unresolved" | null;
  centreSK?: boolean | "unresolved" | null;
  habitualAT?: boolean | "unresolved" | null;
  habitualSK?: boolean | "unresolved" | null;
  nationalityAT?: boolean | "unresolved" | null;
  nationalitySK?: boolean | "unresolved" | null;
  nationalityAsFirstStep?: boolean;
  centreBeforePermanentHomeResolved?: boolean;
  meldezettelEqualsPermanentHome?: boolean;
  ownershipEqualsPermanentHome?: boolean;
  hotelEqualsPermanentHome?: boolean;
}>;

export type AtSkTaxConnectorEmploymentInput = Readonly<{
  treatyResidence: string;
  physicalWorkState: "AT" | "SK" | "OTHER" | "UNRESOLVED";
  presenceDaysInWorkState?: number | null;
  employerResidentInWorkState?: boolean | "unresolved";
  remunerationBorneByPeOrFixedBase?: PeStatus | FixedBaseStatus;
  rollingTwelveMonthsUsed?: boolean;
  baoSixMonthsUsedAsArt15?: boolean;
  a1UsedAsArt15Proof?: boolean;
}>;

export type AtSkTaxConnectorIndependentInput = Readonly<{
  treatyResidence: string;
  fixedBaseState?: "AT" | "SK" | "NONE" | "UNRESOLVED";
  dlaUsedAsFixedBaseProof?: boolean;
  a1UsedAsTaxProof?: boolean;
  szcoLabel?: boolean;
  gewerbeLabel?: boolean;
  activityFacts?: boolean;
}>;

export type AtSkTaxConnectorPeInput = Readonly<{
  constructionDurationMonths?: number | null;
  dlaUsedAsPeProof?: boolean;
}>;

export type AtSkTaxConnectorReliefInput = Readonly<{
  treatyResidence: string;
  taxingRightState: "AT" | "SK" | "NONE" | "UNRESOLVED";
  incomeArticle: IncomeArticleClass;
  taxYear: number;
  taxEventKind: TaxEventKind;
  pptConcern?: boolean;
  exactAmountRequested?: boolean;
  mliSwitchoverApplies?: boolean | "unresolved" | null;
}>;

export type AtSkTaxConnectorRoute =
  | "AT_DOMESTIC_ONLY"
  | "SK_DOMESTIC_ONLY"
  | "DUAL_DOMESTIC_ART4"
  | "TREATY_RESIDENCE_AT"
  | "TREATY_RESIDENCE_SK"
  | "TREATY_RESIDENCE_UNRESOLVED"
  | "TREATY_RESIDENCE_MAP_REQUIRED"
  | "ARTICLE15_RESIDENCE_STATE_EXCEPTION_CANDIDATE"
  | "ARTICLE15_SOURCE_STATE_CANDIDATE"
  | "ARTICLE15_UNRESOLVED"
  | "ARTICLE14_RESIDENCE_STATE_CANDIDATE"
  | "ARTICLE14_SOURCE_STATE_ATTRIBUTABLE_CANDIDATE"
  | "ARTICLE14_UNRESOLVED"
  | "PE_REVIEW_POTENTIALLY_REQUIRED"
  | "PE_REVIEW_NOT_SATISFIED_BY_DURATION"
  | "RELIEF_SK_DIRECTION_CANDIDATE"
  | "RELIEF_AT_DIRECTION_CANDIDATE"
  | "RELIEF_UNRESOLVED"
  | typeof PPT_REVIEW_REQUIRED
  | typeof ANTI_ABUSE_REVIEW_REQUIRED
  | typeof TAX_AMOUNT_NOT_AUTHORIZED
  | typeof AT_SK_CONN_EVIDENCE_REQUIRED
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "TREATY_EXPANSION_REQUIRED";

export function orchestrateDomesticResidence(
  input: AtSkTaxConnectorDomesticInput,
): Readonly<{ domesticState: string; treatyArt4Required: boolean }> {
  const at = input.atDomesticResident === true;
  const sk = input.skDomesticResident === true;
  if (input.atDomesticResident === "unresolved" || input.skDomesticResident === "unresolved") {
    return Object.freeze({ domesticState: AT_SK_CONN_EVIDENCE_REQUIRED, treatyArt4Required: false });
  }
  const state = evaluateDualDomestic(at, sk);
  return Object.freeze({
    domesticState: state,
    treatyArt4Required: state === DUAL_DOMESTIC_RESIDENCE_CANDIDATE,
  });
}

export function orchestrateTreatyResidence(
  domestic: AtSkTaxConnectorDomesticInput,
  art4: AtSkTaxConnectorArt4Input,
): Readonly<{ state: string; issues: readonly string[]; route: AtSkTaxConnectorRoute }> {
  const domesticResult = orchestrateDomesticResidence(domestic);
  if (domesticResult.domesticState === AT_SK_CONN_EVIDENCE_REQUIRED) {
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["DOMESTIC_EVIDENCE_REQUIRED"]), route: AT_SK_CONN_EVIDENCE_REQUIRED });
  }
  if (!domesticResult.treatyArt4Required) {
    if (domesticResult.domesticState === "AT_DOMESTIC_RESIDENT") {
      return Object.freeze({ state: "TREATY_RESIDENT_AT", issues: Object.freeze([]), route: "AT_DOMESTIC_ONLY" });
    }
    if (domesticResult.domesticState === "SK_DOMESTIC_RESIDENT") {
      return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze([]), route: "SK_DOMESTIC_ONLY" });
    }
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["NEITHER_DOMESTIC_PROVEN"]), route: AT_SK_CONN_EVIDENCE_REQUIRED });
  }
  const art4Result = evaluateAtSkArticle4(art4);
  let route: AtSkTaxConnectorRoute = "DUAL_DOMESTIC_ART4";
  if (art4Result.state === "TREATY_RESIDENT_AT") route = "TREATY_RESIDENCE_AT";
  if (art4Result.state === "TREATY_RESIDENT_SK") route = "TREATY_RESIDENCE_SK";
  if (art4Result.state === TREATY_RESIDENCE_MAP_REQUIRED) route = "TREATY_RESIDENCE_MAP_REQUIRED";
  if (art4Result.state === TREATY_RESIDENCE_UNRESOLVED) route = AT_SK_CONN_EVIDENCE_REQUIRED;
  return Object.freeze({ state: art4Result.state, issues: art4Result.issues, route });
}

export function orchestrateEmploymentIncome(
  input: AtSkTaxConnectorEmploymentInput,
): Readonly<{ route: AtSkTaxConnectorRoute; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.rollingTwelveMonthsUsed) issues.push("ROLLING_TWELVE_MONTH_REJECTED");
  if (input.baoSixMonthsUsedAsArt15) issues.push("BAO_SIX_MONTH_NOT_ART15");
  if (input.a1UsedAsArt15Proof) issues.push("A1_NOT_ART15_PROOF");
  if (issues.length) {
    return Object.freeze({ route: "ARTICLE15_UNRESOLVED", issues: Object.freeze(issues) });
  }
  if (input.physicalWorkState === "UNRESOLVED" || input.presenceDaysInWorkState == null) {
    return Object.freeze({ route: AT_SK_CONN_EVIDENCE_REQUIRED, issues: Object.freeze(["EMPLOYMENT_EVIDENCE_REQUIRED"]) });
  }
  if (input.physicalWorkState === "OTHER") {
    return Object.freeze({ route: "EXPLICITLY_OUT_OF_SCOPE", issues: Object.freeze(["NON_AT_SK_WORK_STATE"]) });
  }
  const residenceState = input.treatyResidence === "TREATY_RESIDENT_AT" ? "AT" : input.treatyResidence === "TREATY_RESIDENT_SK" ? "SK" : null;
  if (!residenceState) {
    return Object.freeze({ route: "ARTICLE15_UNRESOLVED", issues: Object.freeze(["TREATY_RESIDENCE_REQUIRED"]) });
  }
  if (input.physicalWorkState === residenceState) {
    return Object.freeze({ route: "ARTICLE15_RESIDENCE_STATE_EXCEPTION_CANDIDATE", issues: Object.freeze(issues) });
  }
  const conditionB = input.employerResidentInWorkState === true ? false
    : input.employerResidentInWorkState === false ? true
      : "unresolved";
  const art15 = evaluateArticle15Two(
    input.presenceDaysInWorkState,
    conditionB,
    input.remunerationBorneByPeOrFixedBase ?? "PE_UNRESOLVED",
  );
  if (art15 === "PASS") {
    return Object.freeze({ route: "ARTICLE15_RESIDENCE_STATE_EXCEPTION_CANDIDATE", issues: Object.freeze(issues) });
  }
  if (art15 === "UNRESOLVED") {
    return Object.freeze({ route: "ARTICLE15_UNRESOLVED", issues: Object.freeze([...issues, "ARTICLE15_CONDITIONS_UNRESOLVED"]) });
  }
  return Object.freeze({ route: "ARTICLE15_SOURCE_STATE_CANDIDATE", issues: Object.freeze(issues) });
}

export function orchestrateIndependentWork(
  input: AtSkTaxConnectorIndependentInput,
): Readonly<{ route: AtSkTaxConnectorRoute; article: IncomeArticleClass; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.dlaUsedAsFixedBaseProof) issues.push("DLA_NOT_FIXED_BASE_PROOF");
  if (input.a1UsedAsTaxProof) issues.push("A1_NOT_TAX_PROOF");
  if (issues.length) {
    return Object.freeze({ route: "ARTICLE14_UNRESOLVED", article: "UNRESOLVED", issues: Object.freeze(issues) });
  }
  const article = classifyIndependentActivity({
    szcoLabel: input.szcoLabel,
    gewerbeLabel: input.gewerbeLabel,
    activityFacts: input.activityFacts,
    independentPersonalServices: input.activityFacts ? true : "unresolved",
  });
  if (article === "UNRESOLVED" || article === "ARTICLE7") {
    return Object.freeze({ route: article === "ARTICLE7" ? AT_SK_CONN_TREATY_EXPANSION_REQUIRED : "ARTICLE14_UNRESOLVED", article, issues: Object.freeze(issues) });
  }
  if (input.fixedBaseState === "UNRESOLVED") {
    return Object.freeze({ route: AT_SK_CONN_EVIDENCE_REQUIRED, article, issues: Object.freeze(["FIXED_BASE_EVIDENCE_REQUIRED"]) });
  }
  if (input.fixedBaseState === "AT") {
    return Object.freeze({ route: "ARTICLE14_SOURCE_STATE_ATTRIBUTABLE_CANDIDATE", article, issues: Object.freeze(issues) });
  }
  return Object.freeze({ route: "ARTICLE14_RESIDENCE_STATE_CANDIDATE", article, issues: Object.freeze(issues) });
}

export function orchestrateBoundedPe(
  input: AtSkTaxConnectorPeInput,
): Readonly<{ route: AtSkTaxConnectorRoute; threshold: string }> {
  if (input.dlaUsedAsPeProof) {
    return Object.freeze({ route: "PE_REVIEW_NOT_SATISFIED_BY_DURATION", threshold: "DLA_NOT_PE" });
  }
  if (input.constructionDurationMonths == null) {
    return Object.freeze({ route: AT_SK_CONN_EVIDENCE_REQUIRED, threshold: "DURATION_EVIDENCE_REQUIRED" });
  }
  const threshold = evaluateConstructionPeThreshold(input.constructionDurationMonths);
  if (threshold === "ABOVE_THRESHOLD") {
    return Object.freeze({ route: "PE_REVIEW_POTENTIALLY_REQUIRED", threshold });
  }
  return Object.freeze({ route: "PE_REVIEW_NOT_SATISFIED_BY_DURATION", threshold });
}

export function orchestrateRelief(
  input: AtSkTaxConnectorReliefInput,
): Readonly<{ route: AtSkTaxConnectorRoute; relief: string }> {
  if (input.exactAmountRequested) {
    return Object.freeze({ route: TAX_AMOUNT_NOT_AUTHORIZED, relief: TAX_AMOUNT_NOT_AUTHORIZED });
  }
  if (input.pptConcern) {
    return Object.freeze({ route: PPT_REVIEW_REQUIRED, relief: PPT_REVIEW_REQUIRED });
  }
  const mliVersion = selectMliTemporalVersion({
    taxYear: input.taxYear,
    taxEventKind: input.taxEventKind,
    residenceDirection: input.treatyResidence === "TREATY_RESIDENT_AT" ? "AT" : "SK",
  });
  if (input.treatyResidence === "TREATY_RESIDENT_SK" && input.taxingRightState === "AT") {
    const relief = evaluateSkResidentRelief({
      treatyResidence: input.treatyResidence,
      austriaMayTax: true,
      incomeArticle: input.incomeArticle,
      taxYear: input.taxYear,
      pptConcern: input.pptConcern,
    });
    return Object.freeze({ route: "RELIEF_SK_DIRECTION_CANDIDATE", relief: `${relief}:${mliVersion}` });
  }
  if (input.treatyResidence === "TREATY_RESIDENT_AT" && input.taxingRightState === "SK") {
    const relief = evaluateAtResidentRelief({
      treatyResidence: input.treatyResidence,
      slovakiaMayTax: true,
      incomeArticle: input.incomeArticle,
      mliSwitchoverApplies: input.mliSwitchoverApplies ?? "unresolved",
      pptConcern: input.pptConcern,
    });
    return Object.freeze({ route: "RELIEF_AT_DIRECTION_CANDIDATE", relief: `${relief}:${mliVersion}` });
  }
  return Object.freeze({ route: "RELIEF_UNRESOLVED", relief: "RELIEF_METHOD_UNRESOLVED" });
}

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export type AtSkConnScenario = Readonly<{
  id: string;
  label: string;
  coverage: ScenarioCoverage;
}>;

export const AT_SK_CONN_SCENARIOS: readonly AtSkConnScenario[] = Object.freeze([
  { id: "s01-at-only-employment-at", label: "AT domestic only, employment in AT", coverage: "COVERED" },
  { id: "s02-sk-only-employment-at", label: "SK domestic only, employment exercised in AT", coverage: "COVERED" },
  { id: "s03-dual-domestic-art4", label: "AT+SK domestic → Art.4 tie-breaker", coverage: "COVERED" },
  { id: "s04-permanent-home-at", label: "Dual domestic, permanent home only AT", coverage: "COVERED" },
  { id: "s05-centre-sk", label: "Both homes, vital interests SK", coverage: "COVERED" },
  { id: "s06-habitual-at", label: "Vital interests unresolved, habitual abode AT", coverage: "COVERED" },
  { id: "s07-nationality-sk", label: "Habitual both/neither, nationality SK only", coverage: "COVERED" },
  { id: "s08-map-required", label: "Nationality both/neither → MAP", coverage: "COVERED" },
  { id: "s09-nationality-first-rejected", label: "Nationality before earlier tests rejected", coverage: "COVERED" },
  { id: "s10-art15-abc-pass", label: "Art.15 A+B+C satisfied, SK treaty residence", coverage: "COVERED" },
  { id: "s11-art15-over-183", label: ">183 calendar-year days → source state", coverage: "COVERED" },
  { id: "s12-art15-employer-at", label: "183 ok but employer AT resident → exception fails", coverage: "COVERED" },
  { id: "s13-art15-pe-burden", label: "A+B ok but PE/fixed-base burden → exception fails", coverage: "COVERED" },
  { id: "s14-rolling-12-rejected", label: "Rolling 12-month interpretation rejected", coverage: "COVERED" },
  { id: "s15-bao-six-rejected", label: "BAO six-month as Art.15 rejected", coverage: "COVERED" },
  { id: "s16-self-employed-no-fixed-base", label: "Self-employed SK treaty resident, no AT fixed base", coverage: "COVERED" },
  { id: "s17-self-employed-fixed-base", label: "Self-employed with AT fixed base", coverage: "COVERED" },
  { id: "s18-dla-not-fixed-base", label: "Dienstleistungsanzeige as fixed-base proof rejected", coverage: "COVERED" },
  { id: "s19-a1-not-tax-proof", label: "A1 as tax/treaty proof rejected", coverage: "COVERED" },
  { id: "s20-construction-12-months", label: "Construction exactly 12 months → no auto PE", coverage: "COVERED" },
  { id: "s21-construction-over-12", label: "Construction >12 months → PE review branch", coverage: "COVERED" },
  { id: "s22-relief-sk-direction", label: "Treaty resident SK, Austrian-taxable V1 income", coverage: "COVERED" },
  { id: "s23-relief-at-direction", label: "Treaty resident AT, Slovak-taxable V1 income", coverage: "COVERED" },
  { id: "s24-tax-amount-oos", label: "Exact tax amount requested", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: "s25-treaty-article-oos", label: "Treaty article not in 0J V1", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: "s26-ppt-review", label: "PPT concern → review required", coverage: "COVERED" },
  { id: "s27-missing-residence-evidence", label: "Missing critical residence evidence", coverage: "COVERED" },
]);

export const AT_SK_CONN_NEGATIVE_CONTROLS = Object.freeze([
  "userLocale != tax residence",
  "nationality != domestic residence",
  "nationality != first treaty tie-breaker",
  "marketPackCountry != tax residence",
  "bureaucracyCountry != tax residence",
  "social-security competent state != tax residence",
  "A1 != tax certificate",
  "A1 != Article 15 proof",
  "S1/EHIC/S2 != tax residence",
  "family-benefit priority state != tax residence",
  "unemployment competent state != tax residence",
  "Dienstleistungsanzeige != PE",
  "Gewerbe authorization != tax residence",
  "temporary/occasional service != no PE automatically",
  "AT domestic Wohnsitz != treaty residence",
  "SK domestic residence != treaty residence",
  "BAO six months != Art.15 183 days",
  "183-day employment rule != residence rule",
  "calendar-year 183 != rolling twelve months",
  "PE != Article 14 fixed base",
  "treaty residence != all income taxed there",
  "treaty taxing right != tax amount",
  "relief method != tax amount",
  "MLI anti-abuse review != automatic denial",
  "Meldezettel != permanent home",
  "employment location != centre of vital interests",
  "nationality != automatic treaty residence unless prior Art.4 steps fail",
  "domestic tax liability != final treaty taxing right",
  "connector orchestrates without duplicating 0I/0J/SK national truth",
  "prepared connector != public runtime authorized",
  "internal validation != locale activation",
] as const);

export const AT_SK_CONN_SCENARIO_PROOFS = Object.freeze({
  s01: orchestrateTreatyResidence({ atDomesticResident: true, skDomesticResident: false }, {}).route === "AT_DOMESTIC_ONLY",
  s03: orchestrateTreatyResidence({ atDomesticResident: true, skDomesticResident: true }, { permanentHomeAT: true }).route === "TREATY_RESIDENCE_AT",
  s05: orchestrateTreatyResidence(
    { atDomesticResident: true, skDomesticResident: true },
    { permanentHomeAT: true, permanentHomeSK: true, centreSK: true },
  ).route === "TREATY_RESIDENCE_SK",
  s08: orchestrateTreatyResidence(
    { atDomesticResident: true, skDomesticResident: true },
    { habitualAT: false, habitualSK: false, nationalityAT: true, nationalitySK: true },
  ).route === "TREATY_RESIDENCE_MAP_REQUIRED",
  s09: orchestrateTreatyResidence(
    { atDomesticResident: true, skDomesticResident: true },
    { nationalityAsFirstStep: true },
  ).issues.includes("NATIONALITY_BEFORE_ORDERED_STEPS"),
  s10: orchestrateEmploymentIncome({
    treatyResidence: "TREATY_RESIDENT_SK",
    physicalWorkState: "AT",
    presenceDaysInWorkState: 100,
    employerResidentInWorkState: false,
    remunerationBorneByPeOrFixedBase: "PE_VERIFIED_NO",
  }).route === "ARTICLE15_RESIDENCE_STATE_EXCEPTION_CANDIDATE",
  s14: orchestrateEmploymentIncome({
    treatyResidence: "TREATY_RESIDENT_SK",
    physicalWorkState: "AT",
    presenceDaysInWorkState: 100,
    employerResidentInWorkState: false,
    remunerationBorneByPeOrFixedBase: "PE_VERIFIED_NO",
    rollingTwelveMonthsUsed: true,
  }).issues.includes("ROLLING_TWELVE_MONTH_REJECTED"),
  s18: orchestrateIndependentWork({ treatyResidence: "TREATY_RESIDENT_SK", fixedBaseState: "NONE", dlaUsedAsFixedBaseProof: true }).issues
    .includes("DLA_NOT_FIXED_BASE_PROOF"),
  s20: orchestrateBoundedPe({ constructionDurationMonths: 12 }).threshold === "AT_THRESHOLD",
  s21: orchestrateBoundedPe({ constructionDurationMonths: 13 }).route === "PE_REVIEW_POTENTIALLY_REQUIRED",
  s24: orchestrateRelief({
    treatyResidence: "TREATY_RESIDENT_AT",
    taxingRightState: "SK",
    incomeArticle: "ARTICLE15",
    taxYear: 2026,
    taxEventKind: "OTHER",
    exactAmountRequested: true,
  }).route === TAX_AMOUNT_NOT_AUTHORIZED,
  s27: orchestrateDomesticResidence({ atDomesticResident: "unresolved", skDomesticResident: true }).domesticState === AT_SK_CONN_EVIDENCE_REQUIRED,
} as const);
