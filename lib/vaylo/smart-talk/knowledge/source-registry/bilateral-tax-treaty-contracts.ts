/**
 * CB-TAX-0B — dedicated bilateral tax-treaty authoring and case contracts.
 * Parallel to the social-security connector authoring contract. Does not inherit Regulation
 * 883/2004, portable-document, or social-security competent-state semantics.
 * Authoring uses factory keys, never stored database UUIDs.
 */
import { createHash } from "node:crypto";

import { KNOWLEDGE_FACTORY_SCHEMA_VERSION, stableKnowledgeFactoryId } from "./knowledge-factory-contracts";

export const BILATERAL_TAX_SCHEMA_VERSION = KNOWLEDGE_FACTORY_SCHEMA_VERSION;
export const BILATERAL_TAX_CANONICAL_TREATY_KEY = "DE-SK" as const;
export const BILATERAL_TAX_AUTHORIZED_PAIRS = Object.freeze(["AT-SK", "DE-SK"] as const);
export type BilateralTaxAuthorizedPair = typeof BILATERAL_TAX_AUTHORIZED_PAIRS[number];
export const BILATERAL_TAX_TOPIC_FAMILY = "TAX_TREATY" as const;
export const BILATERAL_TAX_TRUST_DOMAIN = "bilateral_tax_treaty" as const;
export const BILATERAL_TAX_JURISDICTION_LEVEL = "cross_border_multi_jurisdiction" as const;

export const BILATERAL_TAX_COUNTRIES = Object.freeze(["AT", "DE", "SK"] as const);
export type BilateralTaxCountry = typeof BILATERAL_TAX_COUNTRIES[number];

export const BILATERAL_TAX_AUTHORITY_COUNTRIES = Object.freeze([
  "AT", "DE", "SK", "MULTILATERAL",
] as const);
export type BilateralTaxAuthorityCountry = typeof BILATERAL_TAX_AUTHORITY_COUNTRIES[number];

export const BILATERAL_TAX_LIFECYCLE_STATES = Object.freeze([
  "draft",
  "review",
  "approved",
  "publication_eligible",
  "published",
  "suspended",
  "superseded",
  "withdrawn",
] as const);
export type BilateralTaxLifecycleState = typeof BILATERAL_TAX_LIFECYCLE_STATES[number];

export const BILATERAL_TAX_SUBTOPICS = Object.freeze([
  "TAX_RESIDENCE",
  "EMPLOYMENT_INCOME",
  "INDEPENDENT_WORK",
  "DOUBLE_TAX_RELIEF",
] as const);
export type BilateralTaxSubtopic = typeof BILATERAL_TAX_SUBTOPICS[number];

export const BILATERAL_TAX_FORBIDDEN_SUBTOPICS = Object.freeze([
  "CORPORATE_TAX",
  "VAT",
  "PAYROLL_ACCOUNTING",
  "BOOKKEEPING",
  "TAX_AMOUNT_CALCULATION",
] as const);

export const BILATERAL_TAX_SOURCE_KINDS = Object.freeze([
  "AUTHENTIC_BILATERAL_TREATY",
  "TREATY_CONTINUATION_INSTRUMENT",
  "AUTHENTIC_BEPS_MLI",
  "MLI_MATCHING_POSITION",
  "OFFICIAL_SYNTHESIZED_WORKING_TEXT",
  "SK_MOF_TREATY_STATUS",
  "DE_DOMESTIC_LAW",
  "SK_DOMESTIC_LAW",
] as const);
export type BilateralTaxSourceKind = typeof BILATERAL_TAX_SOURCE_KINDS[number];

export const BILATERAL_TAX_CLAIM_ROLES = Object.freeze([
  "german_domestic_tax",
  "slovak_domestic_tax",
  "bilateral_treaty",
  "mli",
] as const);
export type BilateralTaxClaimRole = typeof BILATERAL_TAX_CLAIM_ROLES[number];

export const BILATERAL_TAX_TEMPORAL_CLASSES = Object.freeze([
  "CURRENT", "LEGACY", "FUTURE_ENACTED", "PROPOSED_NOT_CURRENT",
] as const);
export type BilateralTaxTemporalClass = typeof BILATERAL_TAX_TEMPORAL_CLASSES[number];

export const BILATERAL_TAX_ENTITY_CLASSES = Object.freeze([
  "claims", "treaties", "treaty_versions", "processes",
] as const);
export type BilateralTaxEntityClass = typeof BILATERAL_TAX_ENTITY_CLASSES[number];

export const TAX_RESIDENCE_STATES = Object.freeze([
  "AT_DOMESTIC_RESIDENT",
  "DE_DOMESTIC_RESIDENT",
  "SK_DOMESTIC_RESIDENT",
  "DUAL_DOMESTIC_RESIDENCE_CANDIDATE",
  "TREATY_RESIDENT_AT",
  "TREATY_RESIDENT_DE",
  "TREATY_RESIDENT_SK",
  "TREATY_RESIDENCE_UNRESOLVED",
  "UNKNOWN",
] as const);
export type TaxResidenceState = typeof TAX_RESIDENCE_STATES[number];

export const TAX_ACTIVITY_TYPES = Object.freeze([
  "EMPLOYED",
  "SELF_EMPLOYED",
  "MIXED_EMPLOYED_SELF_EMPLOYED",
  "ACTIVITY_CHANGED",
  "INACTIVE",
  "UNKNOWN",
] as const);
export type TaxActivityType = typeof TAX_ACTIVITY_TYPES[number];

export const TAX_INCOME_CATEGORIES = Object.freeze([
  "EMPLOYMENT_INCOME",
  "INDEPENDENT_PERSONAL_SERVICES",
  "BUSINESS_PROFITS",
  "DIVIDENDS",
  "INTEREST",
  "ROYALTIES",
  "IMMOVABLE_PROPERTY",
  "CAPITAL_GAINS",
  "PENSION",
  "PUBLIC_SERVICE",
  "ARTISTS_SPORTS",
  "OTHER_INCOME",
  "UNKNOWN",
] as const);
export type TaxIncomeCategory = typeof TAX_INCOME_CATEGORIES[number];

export const TAX_ARTICLE_STATES = Object.freeze([
  "ARTICLE_VERIFIED",
  "ARTICLE_CANDIDATE",
  "ARTICLE_UNRESOLVED",
] as const);
export type TaxArticleState = typeof TAX_ARTICLE_STATES[number];

export const TAX_CLASSIFICATION_STATUSES = Object.freeze([
  "INCOMPLETE",
  "UNRESOLVED",
  "CANDIDATE",
  "VERIFIED",
] as const);
export type TaxClassificationStatus = typeof TAX_CLASSIFICATION_STATUSES[number];

export const TAX_RESIDENCE_DETERMINATION_STATUSES = Object.freeze([
  "INCOMPLETE",
  "UNRESOLVED",
  "CANDIDATE",
  "DETERMINED",
] as const);
export type TaxResidenceDeterminationStatus = typeof TAX_RESIDENCE_DETERMINATION_STATUSES[number];

export const FORBIDDEN_TAX_RESIDENCE_BASES = Object.freeze([
  "NATIONALITY",
  "USER_LOCALE",
  "A1",
  "S1",
  "U1",
  "U2",
  "U3",
  "ANMELDUNG",
  "TRVALY_POBYT",
  "DAYS_183",
  "SOCIAL_SECURITY_COMPETENT_STATE",
  "SOCIAL_SECURITY_RESIDENCE_STATE",
  "SOCIAL_SECURITY_APPLICABLE_STATE",
  "FAMILY_BENEFIT_PRIMARY_STATE",
  "UNEMPLOYMENT_BENEFIT_STATE",
] as const);
export type ForbiddenTaxResidenceBasis = typeof FORBIDDEN_TAX_RESIDENCE_BASES[number];

export const BILATERAL_TAX_IS_NOT_TAX_CALCULATOR = true;
export const BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE = true;
export const BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED = false;
export const FIXED_BASE_AND_PE_ARE_SEPARATE = true;
export const DUAL_DOMESTIC_IS_NOT_DUAL_TREATY_RESIDENCE = true;

const KEY = /^[a-z0-9][a-z0-9:_-]{1,80}$/u;
const PACK = /^[a-z0-9_]{3,80}$/u;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;

export type BilateralTaxStableRef = Readonly<{
  entityClass: BilateralTaxEntityClass;
  key: string;
  sourceJurisdiction: "DE" | "SK" | "BILATERAL" | "MULTILATERAL";
  trustDomain: typeof BILATERAL_TAX_TRUST_DOMAIN | "de" | "sk";
  temporalClass: BilateralTaxTemporalClass;
  claimRole?: BilateralTaxClaimRole;
}>;

export type CrossBorderTaxIncomeItem = Readonly<{
  incomeItemId: string;
  incomeCategory: TaxIncomeCategory;
  activityType: TaxActivityType;
  periodStart: string | null;
  periodEnd: string | null;
  payerState: string | null;
  employerState: string | null;
  physicalWorkStates: readonly string[];
  sourceStateCandidate: string | null;
  sourceStateVerified: string | null;
  treatyArticleCandidate: string | null;
  treatyArticleVerified: string | null;
  treatyArticleState: TaxArticleState;
  fixedBaseState: string | null;
  permanentEstablishmentState: string | null;
  taxingRightStates: readonly string[];
  reliefMethodCandidate: string | null;
  classificationStatus: TaxClassificationStatus;
  amount?: number | null;
  currency?: string | null;
  automaticInference?: string | null;
  taxingRightDerivedFrom?: string | null;
  sourceStateDerivedFrom?: string | null;
}>;

export type CrossBorderTaxCaseContext = Readonly<{
  taxYear: number | null;
  nationality?: string | null;
  userLocale?: never;
  locale?: never;
  domesticResidenceCandidates: readonly TaxResidenceState[];
  treatyResidenceState: TaxResidenceState;
  residenceDeterminationStatus: TaxResidenceDeterminationStatus;
  taxResidenceBasis?: string | null;
  workStates: readonly string[];
  incomeItems: readonly CrossBorderTaxIncomeItem[];
  relevantDateRange: Readonly<{ from: string | null; to: string | null }>;
  sourceCountryFacts: Readonly<Record<string, unknown>>;
  treatyVersionContext: Readonly<{
    treatyKey: string;
    temporalVersion: string | null;
    effectiveFrom: string | null;
    effectiveTo: string | null;
    mliModified: boolean | null;
  }>;
  classificationStatus: TaxClassificationStatus;
  socialSecurityCompetentState?: string | null;
  socialSecurityResidenceState?: string | null;
  socialSecurityApplicableState?: string | null;
  socialSecurityActivityType?: string | null;
}>;

export type BilateralTaxTreatyVersionDraft = Readonly<{
  temporalVersion: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  baseTreatyDate: string;
  mliModified: boolean;
  mliEffectiveFrom: string | null;
  mliAdoptionDate?: string | null;
  deMliSignatureDate?: string | null;
  skMliSignatureDate?: string | null;
  deMliEntryIntoForce?: string | null;
  skMliEntryIntoForce?: string | null;
  germanArticle35CompletionDate?: string | null;
  taxType: string;
  sourceKind: BilateralTaxSourceKind;
  sourceVersion: string;
}>;

export type BilateralTaxProcessDraft = Readonly<{
  processGroupId: BilateralTaxSubtopic;
  processKey?: string;
  temporalVersion: string;
  claimRefs: readonly BilateralTaxStableRef[];
  dimensions?: Readonly<Record<string, string>>;
}>;

export type CuratedBilateralTaxTreatyPack = Readonly<{
  schemaVersion: typeof BILATERAL_TAX_SCHEMA_VERSION;
  packId: string;
  treatyKey: BilateralTaxAuthorizedPair;
  countryA: BilateralTaxCountry;
  countryB: BilateralTaxCountry;
  canonicalLanguage: "de";
  topicFamily: typeof BILATERAL_TAX_TOPIC_FAMILY;
  lifecycleState: BilateralTaxLifecycleState;
  sourceRefs: readonly BilateralTaxStableRef[];
  claimUnits: readonly BilateralTaxStableRef[];
  processGroups: readonly BilateralTaxSubtopic[];
  effectiveFrom: string;
  effectiveTo: string | null;
  temporalVersion: string;
  active: false;
  publicRuntimeAllowed: false;
  trustDomain: Readonly<{
    key: string;
    id: string;
    code: typeof BILATERAL_TAX_TRUST_DOMAIN;
    name: string;
  }>;
  jurisdiction: Readonly<{
    key: string;
    id: string;
    level: typeof BILATERAL_TAX_JURISDICTION_LEVEL;
    code: BilateralTaxAuthorizedPair;
    treatyCountries: readonly [BilateralTaxCountry, BilateralTaxCountry];
    countryCode: null;
    authorityCountry: BilateralTaxAuthorityCountry;
  }>;
  territorialScope: Readonly<{
    key: string;
    id: string;
    type: string;
    jurisdictionIds: readonly string[];
    treatyCountries: readonly [BilateralTaxCountry, BilateralTaxCountry];
  }>;
  publisher: Readonly<{
    key: string;
    id: string;
    name: string;
    type: string;
    territorialScopeId: string;
    trustDomainId: string;
  }>;
  authority: Readonly<{
    key: string;
    id: string;
    publisherId: string;
    name: string;
    type: string;
    jurisdictionId: string;
    territorialScopeId: string;
    authorityCountry: BilateralTaxAuthorityCountry;
  }>;
  claims: readonly Readonly<{
    key: string;
    id: string;
    type: string;
    text: string;
    riskLevel: "low" | "medium" | "high" | "mixed";
    temporalClass: BilateralTaxTemporalClass;
    claimRole: BilateralTaxClaimRole;
    jurisdictionId: string;
    territorialScopeId: string;
    authorityId: string;
  }>[];
  versions: readonly BilateralTaxTreatyVersionDraft[];
  processes: readonly BilateralTaxProcessDraft[];
}>;

export type BilateralTaxContractValidation = Readonly<{
  valid: boolean;
  issues: readonly string[];
  authoringUsesKeysNotDatabaseUuids: true;
  productionEligible: false;
}>;

export function canonicalBilateralTaxTreatyKey(countryA: string, countryB: string): string {
  return [countryA, countryB].sort().join("-");
}

export function isAuthorizedBilateralTaxPair(countryA: string, countryB: string): boolean {
  return (BILATERAL_TAX_AUTHORIZED_PAIRS as readonly string[]).includes(
    canonicalBilateralTaxTreatyKey(countryA, countryB),
  );
}

export function classifyMliTrustDomain(): typeof BILATERAL_TAX_TRUST_DOMAIN {
  return BILATERAL_TAX_TRUST_DOMAIN;
}

export function factoryIdForBilateralTaxRef(
  ref: Pick<BilateralTaxStableRef, "entityClass" | "key">,
): string {
  return stableKnowledgeFactoryId("bilateral_tax_unused_pack_id", ref.entityClass, ref.key);
}

export function fingerprintBilateralTaxTreatyPack(pack: CuratedBilateralTaxTreatyPack): string {
  return createHash("sha256").update(JSON.stringify(pack)).digest("hex");
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function rejectLocaleFields(issues: string[], value: unknown, path: string): void {
  const row = asRecord(value);
  if (!row) return;
  for (const field of ["userLocale", "locale", "outputLocale", "uiLanguage"]) {
    if (field in row && row[field] !== undefined) {
      issues.push(`LOCALE_FIELD_FORBIDDEN:${path}.${field}`);
    }
  }
}

function rejectSocialSecurityLeakage(issues: string[], value: unknown, path: string): void {
  const row = asRecord(value);
  if (!row) return;
  for (const field of [
    "euCoordinationClaimIds",
    "eu_coordination_claim_ids",
    "portableDocument",
    "socialSecurityCompetentState",
    "socialSecurityResidenceState",
    "socialSecurityApplicableState",
  ]) {
    if (field in row && row[field] != null && row[field] !== "") {
      if (path === "case" && (
        field === "socialSecurityCompetentState"
        || field === "socialSecurityResidenceState"
        || field === "socialSecurityApplicableState"
      )) {
        continue;
      }
      issues.push(`SOCIAL_SECURITY_FIELD_FORBIDDEN:${path}.${field}`);
    }
  }
}

function validateStableRef(
  issues: string[],
  ref: BilateralTaxStableRef | undefined,
  path: string,
): void {
  if (!ref) {
    issues.push(`ZERO_REF_REJECTED:${path}`);
    return;
  }
  const row = asRecord(ref);
  if (row && "id" in row) issues.push(`HARDCODED_DB_UUID_REJECTED:${path}`);
  if (!(BILATERAL_TAX_ENTITY_CLASSES as readonly string[]).includes(ref.entityClass)) {
    issues.push(`UNKNOWN_ENTITY_CLASS:${path}`);
  }
  if (!KEY.test(ref.key)) issues.push(`INVALID_STABLE_REF_KEY:${path}`);
  if (ref.temporalClass !== "CURRENT") issues.push(`UNVERIFIED_TEMPORAL_VERSION:${path}`);
  if ((ref.trustDomain as string) === "eu") issues.push(`EU_TRUST_REJECTED_FOR_BILATERAL_TREATY:${path}`);
  if ((ref.sourceJurisdiction as string) === "EU") {
    issues.push(`EU_JURISDICTION_REJECTED_FOR_BILATERAL_TREATY:${path}`);
  }
  if (ref.claimRole === "mli" && (ref.trustDomain as string) === "eu") {
    issues.push(`MLI_NOT_CLASSIFIED_AS_EU:${path}`);
  }
  if (ref.claimRole === "mli" && ref.trustDomain !== BILATERAL_TAX_TRUST_DOMAIN) {
    issues.push(`MLI_TRUST_MUST_BE_BILATERAL_TREATY:${path}`);
  }
  if (ref.claimRole === "bilateral_treaty" && ref.trustDomain !== BILATERAL_TAX_TRUST_DOMAIN) {
    issues.push(`WRONG_TRUST_CLASS:${path}`);
  }
  if (ref.claimRole === "german_domestic_tax" && ref.trustDomain !== "de") {
    issues.push(`WRONG_TRUST_CLASS:${path}`);
  }
  if (ref.claimRole === "slovak_domestic_tax" && ref.trustDomain !== "sk") {
    issues.push(`WRONG_TRUST_CLASS:${path}`);
  }
}

export function resolveBilateralTaxStableRef(
  refs: readonly BilateralTaxStableRef[],
  key: string,
  entityClass: BilateralTaxEntityClass,
): BilateralTaxContractValidation {
  const issues: string[] = [];
  if (!key) issues.push("ZERO_REF_REJECTED");
  const matches = refs.filter((ref) => ref.key === key && ref.entityClass === entityClass);
  if (matches.length === 0) issues.push("ZERO_REF_REJECTED");
  if (matches.length > 1) issues.push("AMBIGUOUS_REF_REJECTED");
  if (matches.length === 1) validateStableRef(issues, matches[0], "resolve");
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function validateCrossBorderTaxIncomeItem(
  item: CrossBorderTaxIncomeItem,
): BilateralTaxContractValidation {
  const issues: string[] = [];
  rejectLocaleFields(issues, item, "incomeItem");
  if (!KEY.test(item.incomeItemId)) issues.push("INVALID_INCOME_ITEM_ID");
  if (!(TAX_INCOME_CATEGORIES as readonly string[]).includes(item.incomeCategory)) {
    issues.push("UNKNOWN_INCOME_CATEGORY");
  }
  if (!(TAX_ACTIVITY_TYPES as readonly string[]).includes(item.activityType)) {
    issues.push("UNKNOWN_ACTIVITY_TYPE");
  }
  if (!(TAX_ARTICLE_STATES as readonly string[]).includes(item.treatyArticleState)) {
    issues.push("UNKNOWN_ARTICLE_STATE");
  }
  if (!(TAX_CLASSIFICATION_STATUSES as readonly string[]).includes(item.classificationStatus)) {
    issues.push("UNKNOWN_CLASSIFICATION_STATUS");
  }
  if (item.automaticInference) issues.push("AUTOMATIC_INFERENCE_FORBIDDEN");
  if (item.taxingRightDerivedFrom === "employerState") {
    issues.push("EMPLOYER_STATE_CANNOT_POPULATE_TAXING_RIGHT");
  }
  if (item.sourceStateDerivedFrom === "payerState") {
    issues.push("PAYER_STATE_CANNOT_POPULATE_SOURCE_STATE");
  }
  if (item.activityType === "SELF_EMPLOYED" && item.treatyArticleVerified === "14"
    && item.treatyArticleState === "ARTICLE_VERIFIED"
    && item.classificationStatus === "VERIFIED"
    && item.automaticInference == null
    && item.taxingRightDerivedFrom == null) {
    /* independent verified classification is allowed; do not infer here */
  }
  if (item.activityType === "SELF_EMPLOYED" && item.treatyArticleCandidate === "14"
    && item.treatyArticleState === "ARTICLE_VERIFIED") {
    issues.push("SELF_EMPLOYED_NOT_ARTICLE_14_AUTOMATICALLY");
  }
  if (item.activityType === "EMPLOYED" && item.treatyArticleVerified === "15"
    && item.treatyArticleState === "ARTICLE_VERIFIED"
    && item.classificationStatus !== "VERIFIED") {
    issues.push("EMPLOYED_NOT_ARTICLE_15_AUTOMATICALLY");
  }
  if (item.activityType === "EMPLOYED" && item.treatyArticleCandidate === "15"
    && item.treatyArticleState === "ARTICLE_VERIFIED") {
    issues.push("EMPLOYED_NOT_ARTICLE_15_AUTOMATICALLY");
  }
  if (item.fixedBaseState != null && item.permanentEstablishmentState != null
    && item.fixedBaseState === item.permanentEstablishmentState
    && item.automaticInference === "PE_ALIASED_FROM_FIXED_BASE") {
    issues.push("FIXED_BASE_AND_PE_MUST_REMAIN_SEPARATE");
  }
  if (!FIXED_BASE_AND_PE_ARE_SEPARATE) issues.push("FIXED_BASE_AND_PE_ALIASED");
  if (item.classificationStatus === "UNRESOLVED" && !item.treatyArticleVerified) {
    /* unresolved income items are valid */
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function validateTaxResidenceDetermination(input: {
  treatyResidenceState: TaxResidenceState;
  residenceDeterminationStatus: TaxResidenceDeterminationStatus;
  taxResidenceBasis?: string | null;
  nationality?: string | null;
  userLocale?: string | null;
  socialSecurityCompetentState?: string | null;
  days183?: boolean | null;
  anmeldung?: boolean | null;
  trvalyPobyt?: boolean | null;
  a1?: boolean | null;
}): BilateralTaxContractValidation {
  const issues: string[] = [];
  if (!(TAX_RESIDENCE_STATES as readonly string[]).includes(input.treatyResidenceState)) {
    issues.push("UNKNOWN_TAX_RESIDENCE_STATE");
  }
  if (input.treatyResidenceState === "DUAL_DOMESTIC_RESIDENCE_CANDIDATE"
    && (input.treatyResidenceState as string) === "DUAL_TREATY_RESIDENCE") {
    issues.push("DUAL_DOMESTIC_COLLAPSED_INTO_DUAL_TREATY");
  }
  if (!DUAL_DOMESTIC_IS_NOT_DUAL_TREATY_RESIDENCE) {
    issues.push("DUAL_DOMESTIC_COLLAPSED_INTO_DUAL_TREATY");
  }
  if (input.taxResidenceBasis
    && (FORBIDDEN_TAX_RESIDENCE_BASES as readonly string[]).includes(input.taxResidenceBasis)) {
    issues.push(`${input.taxResidenceBasis}_CANNOT_POPULATE_TAX_RESIDENCE`);
  }
  if (input.nationality && input.taxResidenceBasis === "NATIONALITY") {
    issues.push("NATIONALITY_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (input.userLocale) issues.push("LOCALE_CANNOT_POPULATE_TAX_JURISDICTION");
  if (input.socialSecurityCompetentState && input.taxResidenceBasis === "SOCIAL_SECURITY_COMPETENT_STATE") {
    issues.push("SOCIAL_SECURITY_STATE_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (input.days183 && input.taxResidenceBasis === "DAYS_183") {
    issues.push("DAYS_183_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (input.anmeldung && input.taxResidenceBasis === "ANMELDUNG") {
    issues.push("ANMELDUNG_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (input.trvalyPobyt && input.taxResidenceBasis === "TRVALY_POBYT") {
    issues.push("TRVALY_POBYT_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (input.a1 && input.taxResidenceBasis === "A1") {
    issues.push("A1_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (
    input.residenceDeterminationStatus === "DETERMINED"
    && input.treatyResidenceState === "TREATY_RESIDENCE_UNRESOLVED"
  ) {
    issues.push("UNRESOLVED_CANNOT_BE_CONFIDENT_CONCLUSION");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function validateCrossBorderTaxCaseContext(
  context: CrossBorderTaxCaseContext,
): BilateralTaxContractValidation {
  const issues: string[] = [];
  rejectLocaleFields(issues, context, "case");
  rejectSocialSecurityLeakage(issues, context, "case");
  if (context.userLocale !== undefined || context.locale !== undefined) {
    issues.push("LOCALE_CANNOT_POPULATE_TAX_JURISDICTION");
  }
  if (context.classificationStatus === "VERIFIED" && context.taxYear == null) {
    issues.push("TAX_YEAR_REQUIRED_FOR_MERITS_READY");
  }
  if (context.classificationStatus === "INCOMPLETE" || context.classificationStatus === "UNRESOLVED") {
    /* incomplete facts remain unresolved; never auto-promote */
  }
  if (!(TAX_RESIDENCE_STATES as readonly string[]).includes(context.treatyResidenceState)) {
    issues.push("UNKNOWN_TAX_RESIDENCE_STATE");
  }
  if (context.treatyVersionContext.treatyKey
    && !(BILATERAL_TAX_AUTHORIZED_PAIRS as readonly string[]).includes(
      context.treatyVersionContext.treatyKey,
    )) {
    issues.push("UNSUPPORTED_COUNTRY_PAIR");
  }
  const residence = validateTaxResidenceDetermination({
    treatyResidenceState: context.treatyResidenceState,
    residenceDeterminationStatus: context.residenceDeterminationStatus,
    taxResidenceBasis: context.taxResidenceBasis,
    nationality: context.nationality,
    socialSecurityCompetentState: context.socialSecurityCompetentState,
  });
  issues.push(...residence.issues);
  if (
    context.socialSecurityCompetentState
    && context.treatyResidenceState !== "TREATY_RESIDENCE_UNRESOLVED"
    && context.treatyResidenceState !== "UNKNOWN"
    && context.taxResidenceBasis === "SOCIAL_SECURITY_COMPETENT_STATE"
  ) {
    issues.push("SOCIAL_SECURITY_STATE_CANNOT_POPULATE_TAX_RESIDENCE");
  }
  if (
    context.socialSecurityActivityType
    && context.incomeItems.some((item) => item.treatyArticleVerified
      && item.treatyArticleVerified === context.socialSecurityActivityType)
  ) {
    issues.push("SOCIAL_SECURITY_ACTIVITY_NOT_TAX_TREATY_ARTICLE");
  }
  for (const [index, item] of context.incomeItems.entries()) {
    const itemResult = validateCrossBorderTaxIncomeItem(item);
    for (const issue of itemResult.issues) issues.push(`incomeItems[${index}]:${issue}`);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function validateCuratedBilateralTaxTreatyPack(
  pack: CuratedBilateralTaxTreatyPack,
): BilateralTaxContractValidation {
  const issues: string[] = [];
  rejectLocaleFields(issues, pack, "pack");
  rejectSocialSecurityLeakage(issues, pack, "pack");
  if (pack.schemaVersion !== 1) issues.push("UNSUPPORTED_SCHEMA_VERSION");
  if (!PACK.test(pack.packId)) issues.push("INVALID_PACK_ID");
  const canonicalKey = canonicalBilateralTaxTreatyKey(pack.countryA, pack.countryB);
  if (!(BILATERAL_TAX_AUTHORIZED_PAIRS as readonly string[]).includes(pack.treatyKey)) {
    issues.push("UNSUPPORTED_COUNTRY_PAIR");
  }
  if (pack.treatyKey !== canonicalKey) issues.push("UNSUPPORTED_COUNTRY_PAIR");
  if (
    !(BILATERAL_TAX_COUNTRIES as readonly string[]).includes(pack.countryA)
    || !(BILATERAL_TAX_COUNTRIES as readonly string[]).includes(pack.countryB)
    || pack.countryA === pack.countryB
  ) {
    issues.push("UNSUPPORTED_COUNTRY_PAIR");
  }
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.topicFamily !== BILATERAL_TAX_TOPIC_FAMILY) issues.push("TOPIC_FAMILY_MUST_BE_TAX_TREATY");
  if (!(BILATERAL_TAX_LIFECYCLE_STATES as readonly string[]).includes(pack.lifecycleState)) {
    issues.push("UNKNOWN_LIFECYCLE_STATE");
  }
  if (pack.lifecycleState === "published") issues.push("PUBLICATION_FORBIDDEN_IN_FOUNDATION");
  if (pack.active !== false) issues.push("ACTIVE_FORBIDDEN");
  if (pack.publicRuntimeAllowed !== false) issues.push("PUBLIC_RUNTIME_FORBIDDEN");
  if (pack.trustDomain.code !== BILATERAL_TAX_TRUST_DOMAIN) {
    issues.push("EU_TRUST_REJECTED_FOR_BILATERAL_TREATY");
  }
  if ((pack.trustDomain.code as string) === "eu") issues.push("EU_TRUST_REJECTED_FOR_BILATERAL_TREATY");
  if (pack.trustDomain.id !== stableKnowledgeFactoryId(pack.packId, "trustDomain", pack.trustDomain.key)) {
    issues.push("HARDCODED_DB_UUID_REJECTED:trustDomain");
  }
  if (pack.jurisdiction.level !== BILATERAL_TAX_JURISDICTION_LEVEL) {
    issues.push("WRONG_JURISDICTION");
  }
  if ((pack.jurisdiction.level as string) === "eu") issues.push("EU_JURISDICTION_REJECTED_FOR_BILATERAL_TREATY");
  if (pack.jurisdiction.treatyCountries.join("-") !== pack.treatyKey) {
    issues.push("UNSUPPORTED_COUNTRY_PAIR");
  }
  if (!(BILATERAL_TAX_AUTHORITY_COUNTRIES as readonly string[]).includes(pack.jurisdiction.authorityCountry)) {
    issues.push("UNKNOWN_AUTHORITY_COUNTRY");
  }
  if (!DATE.test(pack.effectiveFrom)) issues.push("INVALID_EFFECTIVE_FROM");
  if (pack.effectiveTo != null && !DATE.test(pack.effectiveTo)) issues.push("INVALID_EFFECTIVE_TO");
  if (pack.versions.length < 1) issues.push("TREATY_VERSION_REQUIRED");
  const versionKeys = new Set<string>();
  for (const version of pack.versions) {
    if (versionKeys.has(version.temporalVersion)) issues.push("DUPLICATE_TREATY_VERSION");
    versionKeys.add(version.temporalVersion);
    if (!DATE.test(version.effectiveFrom)) issues.push("INVALID_VERSION_EFFECTIVE_FROM");
    if (version.effectiveTo != null && !DATE.test(version.effectiveTo)) {
      issues.push("INVALID_VERSION_EFFECTIVE_TO");
    }
    if (!(BILATERAL_TAX_SOURCE_KINDS as readonly string[]).includes(version.sourceKind)) {
      issues.push("UNKNOWN_SOURCE_KIND");
    }
    if (version.sourceKind === "AUTHENTIC_BEPS_MLI" && (pack.trustDomain.code as string) === "eu") {
      issues.push("MLI_NOT_CLASSIFIED_AS_EU");
    }
  }
  for (const group of pack.processGroups) {
    if ((BILATERAL_TAX_FORBIDDEN_SUBTOPICS as readonly string[]).includes(group)) {
      issues.push(`FORBIDDEN_SUBTOPIC:${group}`);
    }
    if (!(BILATERAL_TAX_SUBTOPICS as readonly string[]).includes(group)) {
      issues.push(`UNKNOWN_SUBTOPIC:${group}`);
    }
  }
  const seenClaimKeys = new Set<string>();
  for (const ref of pack.claimUnits) {
    const token = `${ref.entityClass}:${ref.key}`;
    if (seenClaimKeys.has(token)) issues.push(`AMBIGUOUS_REF_REJECTED:${token}`);
    seenClaimKeys.add(token);
    validateStableRef(issues, ref, token);
  }
  for (const ref of pack.sourceRefs) {
    validateStableRef(issues, ref, `source:${ref.entityClass}:${ref.key}`);
  }
  for (const claim of pack.claims) {
    if (claim.id !== stableKnowledgeFactoryId(pack.packId, "claims", claim.key)) {
      issues.push(`HARDCODED_DB_UUID_REJECTED:claims:${claim.key}`);
    }
    if (claim.temporalClass !== "CURRENT") issues.push(`UNVERIFIED_TEMPORAL_VERSION:${claim.key}`);
    if (claim.claimRole === "mli" && (classifyMliTrustDomain() as string) === "eu") {
      issues.push("MLI_NOT_CLASSIFIED_AS_EU");
    }
  }
  if (pack.claimUnits.length === 0) issues.push("ZERO_REF_REJECTED:claimUnits");
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}
