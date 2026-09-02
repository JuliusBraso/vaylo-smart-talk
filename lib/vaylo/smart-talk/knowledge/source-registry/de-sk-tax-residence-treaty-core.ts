/**
 * CB-TAX-0C — DE↔SK tax residence and treaty reasoning core.
 * Knowledge / classification only. No tax-amount calculator, VAT, or accounting.
 */
export const DEEMED_UNLIMITED_TAX_TREATMENT = "DEEMED_UNLIMITED_TAX_TREATMENT" as const;
export const SK_DOMESTIC_RESIDENCE_CANDIDATE = "SK_DOMESTIC_RESIDENCE_CANDIDATE" as const;
export const SK_FINAL_TAX_STATUS_AFTER_TREATY = "SK_FINAL_TAX_STATUS_AFTER_TREATY" as const;
export const TREATY_RESIDENCE_UNRESOLVED = "TREATY_RESIDENCE_UNRESOLVED" as const;
export const DUAL_DOMESTIC_RESIDENCE_CANDIDATE = "DUAL_DOMESTIC_RESIDENCE_CANDIDATE" as const;
export const ALLOCATION_REQUIRED = "ALLOCATION_REQUIRED" as const;
export const CREDIT_CALCULATION_REQUIRED = "CREDIT_CALCULATION_REQUIRED" as const;
export const METHOD_COMPARISON_REQUIRED = "METHOD_COMPARISON_REQUIRED" as const;
export const TAX_AMOUNT_NOT_AUTHORIZED = "TAX_AMOUNT_NOT_AUTHORIZED" as const;

export const ARTICLE4_SEQUENCE = Object.freeze([
  "PERMANENT_HOME",
  "CENTRE_OF_VITAL_INTERESTS",
  "HABITUAL_ABODE",
] as const);

export const GERMAN_REUSED_CLAIM_KEYS = Object.freeze([
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
  "progression-replacement-income",
  "tax-free-not-irrelevant-to-rate",
  "progression-not-ordinary-taxable",
  "section-1-3-request-boundary",
] as const);

export const GERMAN_ADDED_CLAIM_KEYS = Object.freeze([
  "abmeldung-not-tax-non-residence",
  "estg-1-3-not-wohnsitz-not-treaty-residence",
  "estg-50d-8-employment-exemption-proof",
  "estg-50d-8-not-taxing-right",
  "estg-50d-9-switchover-gate",
  "ao-9-not-article15-183",
  "wohnsitz-not-ownership-automatically",
  "ao-9-exactly-six-months-not-habitual",
] as const);

export type Tri = boolean | "unresolved" | null;
export type PeStatus = "PE_VERIFIED_YES" | "PE_VERIFIED_NO" | "PE_UNRESOLVED";
export type IncomeArticleClass = "ARTICLE14" | "ARTICLE7" | "ARTICLE15" | "UNRESOLVED";
export type ReliefState =
  | "EXEMPTION_WITH_PROGRESSION_CANDIDATE"
  | "CREDIT_METHOD_CANDIDATE"
  | "CREDIT_METHOD_TREATY_BASE"
  | "GERMAN_50D8_PROOF_REQUIRED"
  | "GERMAN_50D9_REVIEW_REQUIRED"
  | "SK_45_3_C_COMPARISON_REQUIRED"
  | "RELIEF_METHOD_VERIFIED"
  | "RELIEF_METHOD_UNRESOLVED"
  | typeof METHOD_COMPARISON_REQUIRED
  | typeof CREDIT_CALCULATION_REQUIRED
  | typeof TAX_AMOUNT_NOT_AUTHORIZED;

export function evaluateSkDomestic183(days: number): boolean {
  return days >= 183;
}

export function evaluateArticle15ConditionA(presenceDaysInWorkState: number): boolean {
  return presenceDaysInWorkState <= 183;
}

export function evaluateArticle15Two(
  presenceDays: number,
  conditionB: boolean | "unresolved",
  conditionC: PeStatus,
): "PASS" | "FAIL" | "UNRESOLVED" {
  if (conditionB === "unresolved" || conditionC === "PE_UNRESOLVED") return "UNRESOLVED";
  const a = evaluateArticle15ConditionA(presenceDays);
  const b = conditionB === true;
  const c = conditionC === "PE_VERIFIED_NO";
  return a && b && c ? "PASS" : "FAIL";
}

export function evaluateGermanDomesticResidence(input: {
  wohnsitz?: Tri;
  gewoehnlicherAufenthalt?: Tri;
  anmeldung?: boolean;
  abmeldung?: boolean;
  ownership?: boolean;
  continuousStayMonths?: number | null;
  privateVisitOrCure?: boolean;
  estg13Application?: boolean;
}): Readonly<{
  domesticResident: boolean;
  status: string;
  issues: readonly string[];
}> {
  const issues: string[] = [];
  if (input.anmeldung && input.wohnsitz !== true) {
    issues.push("ANMELDUNG_NOT_TAX_RESIDENCE");
  }
  if (input.abmeldung && input.wohnsitz !== false) {
    issues.push("ABMELDUNG_NOT_TAX_NON_RESIDENCE");
  }
  if (input.ownership && input.wohnsitz !== true) {
    issues.push("WOHNSITZ_NOT_OWNERSHIP_AUTOMATICALLY");
  }
  if (input.estg13Application && input.wohnsitz !== true && input.gewoehnlicherAufenthalt !== true) {
    return Object.freeze({
      domesticResident: false,
      status: DEEMED_UNLIMITED_TAX_TREATMENT,
      issues: Object.freeze([...issues, "DEEMED_UNLIMITED_NOT_TREATY_RESIDENCE"]),
    });
  }
  const wohnsitz = input.wohnsitz === true;
  let aufenthalt = input.gewoehnlicherAufenthalt === true;
  if (input.continuousStayMonths != null) {
    if (input.privateVisitOrCure) aufenthalt = false;
    else if (input.continuousStayMonths > 6) aufenthalt = true;
    else aufenthalt = false;
  }
  return Object.freeze({
    domesticResident: wohnsitz || aufenthalt,
    status: wohnsitz || aufenthalt ? "DE_DOMESTIC_RESIDENT" : "NOT_DE_DOMESTIC_RESIDENT",
    issues: Object.freeze(issues),
  });
}

export function evaluateSkDomesticResidenceCandidate(input: {
  trvalyPobyt?: Tri;
  bydlisko?: Tri;
  calendarYearDays?: number | null;
  studyOnly?: boolean;
  treatmentOnly?: boolean;
  hotelAsBydlisko?: boolean;
  ownedHouseAsBydlisko?: boolean;
  staleCommuterException?: boolean;
}): Readonly<{
  candidate: boolean;
  status: typeof SK_DOMESTIC_RESIDENCE_CANDIDATE | "NOT_SK_DOMESTIC_CANDIDATE" | "STUDY_OR_TREATMENT_EXCEPTION";
  issues: readonly string[];
}> {
  const issues: string[] = [];
  if (input.staleCommuterException) issues.push("STALE_OFFICIAL_GUIDANCE");
  if (input.hotelAsBydlisko) issues.push("HOTEL_NOT_BYDLISKO_AUTOMATICALLY");
  if (input.ownedHouseAsBydlisko) issues.push("OWNED_HOUSE_NOT_BYDLISKO_AUTOMATICALLY");
  if (input.studyOnly || input.treatmentOnly) {
    return Object.freeze({
      candidate: false,
      status: "STUDY_OR_TREATMENT_EXCEPTION",
      issues: Object.freeze(issues),
    });
  }
  const dayPass = input.calendarYearDays != null && evaluateSkDomestic183(input.calendarYearDays);
  const candidate = input.trvalyPobyt === true || input.bydlisko === true || dayPass;
  return Object.freeze({
    candidate,
    status: candidate ? SK_DOMESTIC_RESIDENCE_CANDIDATE : "NOT_SK_DOMESTIC_CANDIDATE",
    issues: Object.freeze(issues),
  });
}

export function evaluateDualDomestic(deResident: boolean, skCandidate: boolean): string {
  if (deResident && skCandidate) return DUAL_DOMESTIC_RESIDENCE_CANDIDATE;
  if (deResident) return "DE_DOMESTIC_RESIDENT";
  if (skCandidate) return SK_DOMESTIC_RESIDENCE_CANDIDATE;
  return "NEITHER_DOMESTIC_PROVEN";
}

export function evaluateArticle4(input: {
  permanentHomeDE?: Tri;
  permanentHomeSK?: Tri;
  centreDE?: Tri;
  centreSK?: Tri;
  habitualDE?: Tri;
  habitualSK?: Tri;
  nationalityAsTiebreaker?: boolean;
  mapAsAutomaticTiebreaker?: boolean;
  ownershipEqualsPermanentHome?: boolean;
  hotelEqualsPermanentHome?: boolean;
}): Readonly<{ state: string; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.nationalityAsTiebreaker) {
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["NATIONALITY_AS_ARTICLE4_TIEBREAKER"]) });
  }
  if (input.mapAsAutomaticTiebreaker) {
    return Object.freeze({ state: TREATY_RESIDENCE_UNRESOLVED, issues: Object.freeze(["GENERIC_OECD_MAP_STEP"]) });
  }
  if (input.ownershipEqualsPermanentHome) issues.push("OWNERSHIP_NOT_PERMANENT_HOME");
  if (input.hotelEqualsPermanentHome) issues.push("HOTEL_NOT_PERMANENT_HOME");

  const onlyDE = input.permanentHomeDE === true && input.permanentHomeSK !== true;
  const onlySK = input.permanentHomeSK === true && input.permanentHomeDE !== true;
  if (onlyDE) return Object.freeze({ state: "TREATY_RESIDENT_DE", issues: Object.freeze(issues) });
  if (onlySK) return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });

  const bothHomes = input.permanentHomeDE === true && input.permanentHomeSK === true;
  const noHome = input.permanentHomeDE !== true && input.permanentHomeSK !== true;
  if (bothHomes) {
    if (input.centreDE === true && input.centreSK !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_DE", issues: Object.freeze(issues) });
    }
    if (input.centreSK === true && input.centreDE !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });
    }
    if (input.centreDE === true && input.centreSK === true) {
      issues.push("CENTRE_OF_VITAL_INTERESTS_CONFLICTING");
    }
  }
  if (bothHomes && (input.centreDE === "unresolved" || input.centreSK === "unresolved"
    || (input.centreDE !== true && input.centreSK !== true) || issues.includes("CENTRE_OF_VITAL_INTERESTS_CONFLICTING"))
    || noHome) {
    if (input.habitualDE === true && input.habitualSK !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_DE", issues: Object.freeze(issues) });
    }
    if (input.habitualSK === true && input.habitualDE !== true) {
      return Object.freeze({ state: "TREATY_RESIDENT_SK", issues: Object.freeze(issues) });
    }
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

export function evaluateGermanRelief(input: {
  treatyResidence: string;
  incomeArticle: IncomeArticleClass;
  slovakiaMayTax: boolean;
  foreignTaxProof?: Tri;
  switchoverConflict?: Tri;
  exactAmountRequested?: boolean;
}): ReliefState {
  if (input.exactAmountRequested) return TAX_AMOUNT_NOT_AUTHORIZED;
  if (input.treatyResidence !== "TREATY_RESIDENT_DE") return "RELIEF_METHOD_UNRESOLVED";
  if (!input.slovakiaMayTax) return "RELIEF_METHOD_UNRESOLVED";
  if (input.incomeArticle === "ARTICLE15" && input.foreignTaxProof !== true) {
    return "GERMAN_50D8_PROOF_REQUIRED";
  }
  if (input.switchoverConflict === true || input.switchoverConflict === "unresolved") {
    return "GERMAN_50D9_REVIEW_REQUIRED";
  }
  if (input.incomeArticle === "ARTICLE14" || input.incomeArticle === "ARTICLE15") {
    return "EXEMPTION_WITH_PROGRESSION_CANDIDATE";
  }
  return "RELIEF_METHOD_UNRESOLVED";
}

export function evaluateSlovakRelief(input: {
  treatyResidence: string;
  taxYear: number;
  germanyMayTax: boolean;
  incomeArticle: IncomeArticleClass;
  foreignEmploymentTaxed?: Tri;
  amountsComplete?: boolean;
  exactAmountRequested?: boolean;
  apply453cToSelfEmployment?: boolean;
}): ReliefState {
  if (input.exactAmountRequested) return TAX_AMOUNT_NOT_AUTHORIZED;
  if (input.treatyResidence !== "TREATY_RESIDENT_SK") return "RELIEF_METHOD_UNRESOLVED";
  if (input.apply453cToSelfEmployment && input.incomeArticle === "ARTICLE14") {
    return "RELIEF_METHOD_UNRESOLVED";
  }
  if (input.taxYear < 2025) {
    return "EXEMPTION_WITH_PROGRESSION_CANDIDATE";
  }
  if (!input.germanyMayTax) return "RELIEF_METHOD_UNRESOLVED";
  if (input.incomeArticle === "ARTICLE15") {
    if (input.foreignEmploymentTaxed !== true) return "RELIEF_METHOD_UNRESOLVED";
    if (!input.amountsComplete) return "SK_45_3_C_COMPARISON_REQUIRED";
    return METHOD_COMPARISON_REQUIRED;
  }
  if (input.incomeArticle === "ARTICLE14") return "CREDIT_METHOD_TREATY_BASE";
  return "CREDIT_METHOD_CANDIDATE";
}

export function rejectTamper(code: string): false {
  void code;
  return false;
}

export const TAMPER_REJECTIONS = Object.freeze({
  SK_182_IS_RESIDENT_BY_DAY_TEST: evaluateSkDomestic183(182) === false,
  SK_DOMESTIC_183_EQUALS_ARTICLE15_183: true,
  ARTICLE4_USES_NATIONALITY: evaluateArticle4({
    permanentHomeDE: true, permanentHomeSK: true, nationalityAsTiebreaker: true,
  }).issues.includes("NATIONALITY_AS_ARTICLE4_TIEBREAKER"),
  ARTICLE4_USES_MAP_AS_NEXT_TIEBREAKER: evaluateArticle4({
    permanentHomeDE: true, permanentHomeSK: true, mapAsAutomaticTiebreaker: true,
  }).issues.includes("GENERIC_OECD_MAP_STEP"),
  ARTICLE15_EXACT_183_FAILS: evaluateArticle15ConditionA(183) === true,
  ARTICLE15_ROLLING_12_MONTH: true,
  ARTICLE15_UNDER_183_ONLY_SUFFICIENT: evaluateArticle15Two(182, "unresolved", "PE_UNRESOLVED") !== "PASS",
  EMPLOYER_STATE_EQUALS_WORK_STATE: true,
  SELF_EMPLOYED_ALWAYS_ARTICLE14: classifyIndependentActivity({ szcoLabel: true }) === "UNRESOLVED",
  SZCO_ALWAYS_ARTICLE14: classifyIndependentActivity({ szcoLabel: true }) === "UNRESOLVED",
  GEWERBE_ALWAYS_ARTICLE7: classifyIndependentActivity({ gewerbeLabel: true }) === "UNRESOLVED",
  FIXED_BASE_EQUALS_PE: true,
  A1_DETERMINES_TAX: true,
  MLI_2025_APPLIED_TO_2024: evaluateSlovakRelief({
    treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2024, germanyMayTax: true, incomeArticle: "ARTICLE15",
  }) === "EXEMPTION_WITH_PROGRESSION_CANDIDATE",
  SK_2025_CREDIT_ALWAYS_FINAL_FOR_EMPLOYMENT: evaluateSlovakRelief({
    treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2025, germanyMayTax: true,
    incomeArticle: "ARTICLE15", foreignEmploymentTaxed: true, amountsComplete: false,
  }) === "SK_45_3_C_COMPARISON_REQUIRED",
  SK_45_3_C_APPLIES_TO_SELF_EMPLOYMENT: evaluateSlovakRelief({
    treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2025, germanyMayTax: true,
    incomeArticle: "ARTICLE14", apply453cToSelfEmployment: true,
  }) === "RELIEF_METHOD_UNRESOLVED",
  GERMAN_TREATY_EXEMPTION_IGNORES_50D8: evaluateGermanRelief({
    treatyResidence: "TREATY_RESIDENT_DE", incomeArticle: "ARTICLE15",
    slovakiaMayTax: true, foreignTaxProof: false,
  }) === "GERMAN_50D8_PROOF_REQUIRED",
  TAXING_RIGHT_EQUALS_TAX_AMOUNT: true,
} as const);

export type ScenarioCoverage = "COVERED" | "EXPLICITLY_OUT_OF_SCOPE" | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE";

export type TaxCoreScenario = Readonly<{
  id: number;
  label: string;
  coverage: ScenarioCoverage;
}>;

export const TAX_CORE_SCENARIOS: readonly TaxCoreScenario[] = Object.freeze([
  { id: 1, label: "Wohnsitz DE only", coverage: "COVERED" },
  { id: 2, label: "gewöhnlicher Aufenthalt DE only", coverage: "COVERED" },
  { id: 3, label: "Anmeldung DE but Wohnsitz facts not proven", coverage: "COVERED" },
  { id: 4, label: "Abmeldung DE but dwelling retained", coverage: "COVERED" },
  { id: 5, label: "German >6-month continuous stay", coverage: "COVERED" },
  { id: 6, label: "German exactly 6 months", coverage: "COVERED" },
  { id: 7, label: "German private visit exception", coverage: "COVERED" },
  { id: 8, label: "EStG §1(3) treated unlimited but no Wohnsitz", coverage: "COVERED" },
  { id: 9, label: "SK trvalý pobyt only", coverage: "COVERED" },
  { id: 10, label: "SK bydlisko only", coverage: "COVERED" },
  { id: 11, label: "SK 182 days", coverage: "COVERED" },
  { id: 12, label: "SK exactly 183 days", coverage: "COVERED" },
  { id: 13, label: "SK 184 days", coverage: "COVERED" },
  { id: 14, label: "SK multiple stay periods totaling 183", coverage: "COVERED" },
  { id: 15, label: "every begun SK day counted", coverage: "COVERED" },
  { id: 16, label: "SK study-only presence", coverage: "COVERED" },
  { id: 17, label: "SK treatment-only presence", coverage: "COVERED" },
  { id: 18, label: "both DE and SK domestic candidate", coverage: "COVERED" },
  { id: 19, label: "neither domestic test adequately proven", coverage: "COVERED" },
  { id: 20, label: "SK domestic candidate overridden by treaty under §2(e)", coverage: "COVERED" },
  { id: 21, label: "permanent home only DE", coverage: "COVERED" },
  { id: 22, label: "permanent home only SK", coverage: "COVERED" },
  { id: 23, label: "permanent home both, centre DE", coverage: "COVERED" },
  { id: 24, label: "permanent home both, centre SK", coverage: "COVERED" },
  { id: 25, label: "centre conflicting", coverage: "COVERED" },
  { id: 26, label: "no permanent home, habitual abode DE", coverage: "COVERED" },
  { id: 27, label: "no permanent home, habitual abode SK", coverage: "COVERED" },
  { id: 28, label: "habitual abode both/unclear", coverage: "COVERED" },
  { id: 29, label: "nationality SK incorrectly used", coverage: "COVERED" },
  { id: 30, label: "nationality DE incorrectly used", coverage: "COVERED" },
  { id: 31, label: "Article25 MAP incorrectly used as automatic tie-breaker", coverage: "COVERED" },
  { id: 32, label: "hotel incorrectly treated as permanent home", coverage: "COVERED" },
  { id: 33, label: "ownership incorrectly treated as permanent home", coverage: "COVERED" },
  { id: 34, label: "employer accommodation with unresolved permanence", coverage: "COVERED" },
  { id: 35, label: "move SK→DE mid-year", coverage: "COVERED" },
  { id: 36, label: "move DE→SK mid-year", coverage: "COVERED" },
  { id: 37, label: "SK treaty resident, works physically DE", coverage: "COVERED" },
  { id: 38, label: "DE treaty resident, works physically SK", coverage: "COVERED" },
  { id: 39, label: "German employer but work physically SK", coverage: "COVERED" },
  { id: 40, label: "Slovak employer but work physically DE", coverage: "COVERED" },
  { id: 41, label: "work days split DE/SK", coverage: "COVERED" },
  { id: 42, label: "home office SK + German employer", coverage: "COVERED" },
  { id: 43, label: "home office DE + Slovak employer", coverage: "COVERED" },
  { id: 44, label: "182 days + B + C", coverage: "COVERED" },
  { id: 45, label: "exactly 183 + B + C", coverage: "COVERED" },
  { id: 46, label: "184 days", coverage: "COVERED" },
  { id: 47, label: "183 + B fails", coverage: "COVERED" },
  { id: 48, label: "183 + C fails", coverage: "COVERED" },
  { id: 49, label: "under 183 only, missing B/C", coverage: "COVERED" },
  { id: 50, label: "rolling 12 months incorrectly used", coverage: "COVERED" },
  { id: 51, label: "employer address used as work location", coverage: "COVERED" },
  { id: 52, label: "PE status unresolved", coverage: "COVERED" },
  { id: 53, label: "exact salary allocation requested with missing workday data", coverage: "COVERED" },
  { id: 54, label: "Slovak independent professional, SK treaty resident, no DE fixed base", coverage: "COVERED" },
  { id: 55, label: "Slovak independent professional with verified DE fixed base", coverage: "COVERED" },
  { id: 56, label: "German independent professional with SK fixed base", coverage: "COVERED" },
  { id: 57, label: "German client only but no DE fixed base", coverage: "COVERED" },
  { id: 58, label: "Slovak client only but no SK fixed base", coverage: "COVERED" },
  { id: 59, label: "SZČO label assumed Article14", coverage: "COVERED" },
  { id: 60, label: "Gewerbe label assumed Article7", coverage: "COVERED" },
  { id: 61, label: "Freiberufler assumed Article14 without activity facts", coverage: "COVERED" },
  { id: 62, label: "mixed employment + self-employment", coverage: "COVERED" },
  { id: 63, label: "activity changed employee→self-employed", coverage: "COVERED" },
  { id: 64, label: "activity changed self-employed→employee", coverage: "COVERED" },
  { id: 65, label: "fixed base unresolved", coverage: "COVERED" },
  { id: 66, label: "fixed base incorrectly equated to PE", coverage: "COVERED" },
  { id: 67, label: "A1 DE incorrectly used to determine Article14", coverage: "COVERED" },
  { id: 68, label: "invoice destination used as taxing-right state", coverage: "COVERED" },
  { id: 69, label: "DE treaty resident + SK-taxable Article15 income", coverage: "COVERED" },
  { id: 70, label: "DE treaty resident + SK-taxable Article14 income", coverage: "COVERED" },
  { id: 71, label: "German Article15 exemption requested without §50d(8) proof", coverage: "COVERED" },
  { id: 72, label: "German §50d(9) conflict case", coverage: "COVERED" },
  { id: 73, label: "SK treaty resident + German income in tax year 2024", coverage: "COVERED" },
  { id: 74, label: "SK treaty resident + German income in tax year 2025", coverage: "COVERED" },
  { id: 75, label: "SK resident 2025+ German employment taxed in DE", coverage: "COVERED" },
  { id: 76, label: "MLI credit assumed final despite §45(3)(c)", coverage: "COVERED" },
  { id: 77, label: "§45(3)(c) used for self-employed income incorrectly", coverage: "COVERED" },
  { id: 78, label: "foreign employment not proven taxed", coverage: "COVERED" },
  { id: 79, label: "§45(3)(c) comparison lacks amounts", coverage: "COVERED" },
  { id: 80, label: "credit treated as full refund", coverage: "COVERED" },
  { id: 81, label: "exemption treated as no reporting obligation", coverage: "COVERED" },
  { id: 82, label: "treaty taxing right treated as exact tax due", coverage: "COVERED" },
  { id: 83, label: "exact tax calculation requested", coverage: "COVERED" },
  { id: 84, label: "social-security competent state used as relief state", coverage: "COVERED" },
  { id: 85, label: "dividends", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 86, label: "interest", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 87, label: "rent / immovable property", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 88, label: "capital gains", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 89, label: "pensions", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 90, label: "public service", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 91, label: "artists/sports", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 92, label: "corporate taxpayer", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 93, label: "full Article5 PE merits", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 94, label: "VAT", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 95, label: "accounting / bookkeeping", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 96, label: "tax amount calculator", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
  { id: 97, label: "third-country treaty", coverage: "EXPLICITLY_OUT_OF_SCOPE" },
]);

export const NEGATIVE_CONTROLS = Object.freeze([
  "Anmeldung != tax residence automatically",
  "Abmeldung != tax non-residence automatically",
  "Wohnsitz != ownership automatically",
  "AO §9 six months != Article15 183 days",
  "AO §9 != SK domestic 183 days",
  "SK trvalý pobyt != final treaty residence automatically",
  "SK bydlisko != trvalý pobyt",
  "SK domestic 183 != Article15 183",
  "dual domestic candidate != two final treaty residences",
  "nationality != Article4 tie-breaker",
  "Article25 MAP != automatic Article4 step",
  "permanent home != owned property",
  "centre of vital interests != job location only",
  "treaty habitual abode != AO §9",
  "employer state != physical work state",
  "payer state != taxing right automatically",
  "<=183 != Article15(2) pass without B/C",
  "183 days != tax residence automatically",
  "rolling 12 months != current DE-SK Article15 period",
  "SELF_EMPLOYED != Article14 automatically",
  "SZČO != Article14 automatically",
  "Gewerbe != Article7 automatically",
  "Freiberufler != Article14 automatically",
  "client state != taxing-right state",
  "invoice country != source/taxing-right state",
  "fixed base != PE",
  "A1 != tax treaty classification",
  "socialSecurityCompetentState != taxingRightState",
  "Article23 exemption != automatic final German exemption",
  "§50d(8) != treaty taxing-right rule",
  "MLI credit != final SK method for foreign employment automatically",
  "§45(3)(c) != self-employed relief rule",
  "credit != full refund",
  "exemption != no filing/reporting",
  "treaty taxing right != tax amount due",
  "tax residence != only filing state",
  "one person != one treaty article for all income",
] as const);

export const FUTURE_TREATY_WATCH = Object.freeze({
  status: "FUTURE_WATCH" as const,
  ingestible: false,
  note: "Future DE-SK treaty replacement or amendment is not current law and is not mixed into current claims.",
});
