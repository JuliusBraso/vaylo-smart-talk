/**
 * AT-SK-0B — product-routing, activity-timeline, and multi-state case FACT contracts.
 * Runtime / case context only. Not canonical knowledge. Not legal merits. No PII.
 */
import { TAX_ACTIVITY_TYPES, type TaxActivityType } from "./bilateral-tax-treaty-contracts";

export const MULTI_STATE_CASE_SCHEMA_VERSION = 1 as const;

export const SLOVAKIA_PACK_MARKET_COUNTRY = "SK" as const;
export const SLOVAKIA_PACK_BUREAUCRACY_COUNTRIES = Object.freeze(["DE", "AT"] as const);
export type SlovakiaPackBureaucracyCountry = typeof SLOVAKIA_PACK_BUREAUCRACY_COUNTRIES[number];

export const SLOVAKIA_PACK_CORRIDOR_CANDIDATES = Object.freeze(["AT-SK", "DE-SK"] as const);
export type SlovakiaPackCorridorCandidate = typeof SLOVAKIA_PACK_CORRIDOR_CANDIDATES[number];

export const COUNTRY_CONTEXT_SOURCES = Object.freeze([
  "USER_SELECTED",
  "AGENCY_CASE",
  "ORGANIZATION_DEFAULT",
] as const);
export type CountryContextSource = typeof COUNTRY_CONTEXT_SOURCES[number];

export const ACTIVITY_TIMELINE_ACTIVITY_TYPES = TAX_ACTIVITY_TYPES;
export type ActivityTimelineActivityType = TaxActivityType;

export const ACTIVITY_LEGAL_CLASSIFICATIONS = Object.freeze(["UNRESOLVED"] as const);
export type ActivityLegalClassification = typeof ACTIVITY_LEGAL_CLASSIFICATIONS[number];

export const DIRECT_AT_DE_BILATERAL_REQUIRED = "DIRECT_AT_DE_BILATERAL_REQUIRED" as const;
export const SK_BILATERAL_LAYERS_SUFFICIENT = "SK_BILATERAL_LAYERS_SUFFICIENT" as const;
export const AT_DE_BOUNDARY_UNRESOLVED = "UNRESOLVED" as const;

export type AtDeBilateralBoundaryClass =
  | typeof DIRECT_AT_DE_BILATERAL_REQUIRED
  | typeof SK_BILATERAL_LAYERS_SUFFICIENT
  | typeof AT_DE_BOUNDARY_UNRESOLVED;

export type MultiStateContractValidation = Readonly<{
  valid: boolean;
  issues: readonly string[];
  productionEligible: false;
}>;

const ISO2 = /^[A-Z]{2}$/u;
const DATE = /^\d{4}-\d{2}-\d{2}$/u;
const PII_FIELDS = Object.freeze([
  "name", "email", "birthDate", "birth_date", "address",
  "nationalId", "national_id", "taxId", "tax_id",
  "insuranceNumber", "insurance_number",
] as const);
const LOCALE_FIELDS = Object.freeze(["userLocale", "locale", "outputLocale", "uiLanguage"] as const);

export type ActivityTimelineEntry = Readonly<{
  country: string;
  activityType: ActivityTimelineActivityType;
  from: string;
  to: string | null;
  legalClassification: ActivityLegalClassification;
  businessAuthorizationCountry?: string | null;
}>;

export type ProductRoutingContext = Readonly<{
  marketPackCountry: typeof SLOVAKIA_PACK_MARKET_COUNTRY;
  bureaucracyCountry: SlovakiaPackBureaucracyCountry;
  corridorCandidate: SlovakiaPackCorridorCandidate;
  countryContextSource?: CountryContextSource;
}>;

export type MultiStateCaseContext = Readonly<{
  routing: ProductRoutingContext;
  countriesInCase: readonly string[];
  activityTimeline: readonly ActivityTimelineEntry[];
  casePeriod?: Readonly<{ from: string; to?: string | null }> | null;
  residenceState?: string | null;
}>;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function rejectForbiddenFields(
  issues: string[],
  value: unknown,
  path: string,
  fields: readonly string[],
  prefix: string,
): void {
  const row = asRecord(value);
  if (!row) return;
  for (const field of fields) {
    if (field in row && row[field] !== undefined) {
      issues.push(`${prefix}:${path}.${field}`);
    }
  }
}

export function deriveSlovakiaPackCorridorCandidate(
  marketPackCountry: string,
  bureaucracyCountry: string,
): { candidate: SlovakiaPackCorridorCandidate | null; issues: readonly string[] } {
  const issues: string[] = [];
  if (marketPackCountry !== SLOVAKIA_PACK_MARKET_COUNTRY) {
    issues.push("UNSUPPORTED_MARKET_PACK");
  }
  if (!(SLOVAKIA_PACK_BUREAUCRACY_COUNTRIES as readonly string[]).includes(bureaucracyCountry)) {
    issues.push("UNSUPPORTED_BUREAUCRACY_COUNTRY");
  }
  if (issues.length > 0) {
    return { candidate: null, issues: Object.freeze(issues) };
  }
  const candidate = bureaucracyCountry === "DE" ? "DE-SK" : "AT-SK";
  return { candidate, issues: Object.freeze([]) };
}

export function validateActivityTimelineEntry(
  entry: ActivityTimelineEntry,
  path = "entry",
): MultiStateContractValidation {
  const issues: string[] = [];
  rejectForbiddenFields(issues, entry, path, LOCALE_FIELDS, "LOCALE_FIELD_FORBIDDEN");
  rejectForbiddenFields(issues, entry, path, PII_FIELDS, "PII_FIELD_FORBIDDEN");
  if (!ISO2.test(entry.country)) issues.push(`INVALID_ACTIVITY_COUNTRY:${path}`);
  if (!(ACTIVITY_TIMELINE_ACTIVITY_TYPES as readonly string[]).includes(entry.activityType)) {
    issues.push(`UNKNOWN_ACTIVITY_TYPE:${path}`);
  }
  if (!DATE.test(entry.from)) issues.push(`INVALID_PERIOD_START:${path}`);
  if (entry.to != null && !DATE.test(entry.to)) issues.push(`INVALID_PERIOD_END:${path}`);
  if (entry.to != null && DATE.test(entry.from) && DATE.test(entry.to) && entry.to < entry.from) {
    issues.push(`INVALID_REVERSED_INTERVAL:${path}`);
  }
  if (entry.legalClassification !== "UNRESOLVED") {
    issues.push(`LEGAL_CLASSIFICATION_MUST_REMAIN_UNRESOLVED:${path}`);
  }
  if (entry.businessAuthorizationCountry != null && entry.businessAuthorizationCountry !== ""
    && !ISO2.test(entry.businessAuthorizationCountry)) {
    issues.push(`INVALID_AUTHORIZATION_COUNTRY:${path}`);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function validateActivityTimeline(
  timeline: readonly ActivityTimelineEntry[],
): MultiStateContractValidation {
  const issues: string[] = [];
  if (!Array.isArray(timeline)) issues.push("TIMELINE_INVALID");
  for (const [index, entry] of (timeline ?? []).entries()) {
    issues.push(...validateActivityTimelineEntry(entry, `timeline[${index}]`).issues);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function deriveCountriesInCase(input: {
  marketPackCountry?: string | null;
  residenceState?: string | null;
  activityTimeline?: readonly ActivityTimelineEntry[] | null;
  extraCountries?: readonly string[] | null;
}): readonly string[] {
  const countries = new Set<string>();
  for (const value of [
    input.marketPackCountry,
    input.residenceState,
    ...(input.extraCountries ?? []),
    ...(input.activityTimeline ?? []).map((entry) => entry.country),
  ]) {
    if (value && ISO2.test(value)) countries.add(value);
  }
  return Object.freeze([...countries].sort());
}

export function switchBureaucracyCountry(
  context: MultiStateCaseContext,
  nextBureaucracyCountry: string,
): { context: MultiStateCaseContext | null; issues: readonly string[] } {
  const derived = deriveSlovakiaPackCorridorCandidate(
    context.routing.marketPackCountry,
    nextBureaucracyCountry,
  );
  if (!derived.candidate) {
    return { context: null, issues: derived.issues };
  }
  const next: MultiStateCaseContext = {
    ...context,
    routing: {
      ...context.routing,
      bureaucracyCountry: nextBureaucracyCountry as SlovakiaPackBureaucracyCountry,
      corridorCandidate: derived.candidate,
    },
    activityTimeline: context.activityTimeline.map((entry) => ({ ...entry })),
    countriesInCase: [...context.countriesInCase],
  };
  return { context: next, issues: Object.freeze([]) };
}

export function classifyAtDeBilateralBoundary(input: {
  treatyResidenceCountry: string | null;
  incomeSourceCountries: readonly string[];
}): AtDeBilateralBoundaryClass {
  const sources = new Set(input.incomeSourceCountries);
  const residence = input.treatyResidenceCountry;
  if (residence === "AT" && sources.has("DE")) return DIRECT_AT_DE_BILATERAL_REQUIRED;
  if (residence === "DE" && sources.has("AT")) return DIRECT_AT_DE_BILATERAL_REQUIRED;
  if (residence === "SK" && (sources.has("AT") || sources.has("DE"))) {
    return SK_BILATERAL_LAYERS_SUFFICIENT;
  }
  return AT_DE_BOUNDARY_UNRESOLVED;
}

export function validateProductRoutingContext(
  routing: ProductRoutingContext,
): MultiStateContractValidation {
  const issues: string[] = [];
  rejectForbiddenFields(issues, routing, "routing", LOCALE_FIELDS, "LOCALE_FIELD_FORBIDDEN");
  rejectForbiddenFields(issues, routing, "routing", PII_FIELDS, "PII_FIELD_FORBIDDEN");
  const derived = deriveSlovakiaPackCorridorCandidate(
    routing.marketPackCountry,
    routing.bureaucracyCountry,
  );
  issues.push(...derived.issues);
  if (derived.candidate && routing.corridorCandidate !== derived.candidate) {
    issues.push("CORRIDOR_CANDIDATE_MISMATCH");
  }
  if (
    routing.countryContextSource != null
    && !(COUNTRY_CONTEXT_SOURCES as readonly string[]).includes(routing.countryContextSource)
  ) {
    issues.push("UNKNOWN_COUNTRY_CONTEXT_SOURCE");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}

export function validateMultiStateCaseContext(
  context: MultiStateCaseContext,
): MultiStateContractValidation {
  const issues: string[] = [];
  rejectForbiddenFields(issues, context, "case", LOCALE_FIELDS, "LOCALE_FIELD_FORBIDDEN");
  rejectForbiddenFields(issues, context, "case", PII_FIELDS, "PII_FIELD_FORBIDDEN");
  issues.push(...validateProductRoutingContext(context.routing).issues);
  issues.push(...validateActivityTimeline(context.activityTimeline).issues);
  if (context.residenceState != null && context.residenceState !== "" && !ISO2.test(context.residenceState)) {
    issues.push("INVALID_RESIDENCE_STATE");
  }
  if (context.casePeriod) {
    if (!DATE.test(context.casePeriod.from)) issues.push("INVALID_CASE_PERIOD_START");
    if (context.casePeriod.to != null && !DATE.test(context.casePeriod.to)) {
      issues.push("INVALID_CASE_PERIOD_END");
    }
    if (
      context.casePeriod.to != null
      && DATE.test(context.casePeriod.from)
      && DATE.test(context.casePeriod.to)
      && context.casePeriod.to < context.casePeriod.from
    ) {
      issues.push("INVALID_REVERSED_INTERVAL:casePeriod");
    }
  }
  for (const [index, country] of context.countriesInCase.entries()) {
    if (!ISO2.test(country)) issues.push(`INVALID_COUNTRY_IN_CASE:${index}`);
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    productionEligible: false,
  });
}
