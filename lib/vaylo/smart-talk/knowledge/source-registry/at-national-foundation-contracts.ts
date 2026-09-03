/**
 * AT-SK-0C — reusable national authority/source contract + Austrian foundation rules.
 * Generic role/domain/routing types are country-agnostic for later CZ/HU/PL reuse.
 * Austrian trust (`at`) remains distinct from eu / de / sk / bilateral_tax_treaty.
 */
import { createHash } from "node:crypto";

import { KNOWLEDGE_FACTORY_SCHEMA_VERSION, stableKnowledgeFactoryId } from "./knowledge-factory-contracts";

export const AT_NATIONAL_TRUST_DOMAIN = "at" as const;
export const AT_NATIONAL_COUNTRY_CODE = "AT" as const;
export const AT_NATIONAL_FOUNDATION_PACK_ID = "at_national_foundation" as const;
export const AT_NATIONAL_FOUNDATION_PROCESS_GROUP = "at_national_foundation" as const;
export const AT_NATIONAL_JURISDICTION_LEVEL = "at_national" as const;
export const AT_NATIONAL_CANONICAL_LANGUAGE = "de" as const;
export const AT_NATIONAL_FOUNDATION_AS_OF = "2026-09-03" as const;

export const PRESERVED_TRUST_DOMAINS = Object.freeze([
  "eu", "de", "sk", "cz", "pl", "hu", "bilateral_tax_treaty",
] as const);

export const NATIONAL_AUTHORITY_ROLES = Object.freeze([
  "LEGAL_SOURCE",
  "POLICY_MINISTRY",
  "ADMINISTRATIVE_AUTHORITY",
  "SOCIAL_INSURANCE_CARRIER",
  "HEALTH_INSURANCE_CARRIER",
  "EMPLOYMENT_SERVICE",
  "TAX_AUTHORITY",
  "SERVICE_PORTAL",
  "COORDINATION_BODY",
] as const);
export type NationalAuthorityRole = typeof NATIONAL_AUTHORITY_ROLES[number];

export const NATIONAL_AUTHORITY_DOMAINS = Object.freeze([
  "SOCIAL_SECURITY",
  "HEALTH_INSURANCE",
  "FAMILY_BENEFITS",
  "UNEMPLOYMENT",
  "CROSS_BORDER_GEWERBE_SERVICE",
  "OTHER_GEWERBE",
  "PERSONAL_INCOME_TAX",
  "LEGAL_SOURCE",
  "CROSS_BORDER_EU_COORDINATION",
] as const);
export type NationalAuthorityDomain = typeof NATIONAL_AUTHORITY_DOMAINS[number];

export const NATIONAL_AUTHORITY_ASSIGNMENT_KINDS = Object.freeze([
  "PRIMARY",
  "CONDITIONAL",
  "SPECIAL_CATEGORY",
  "PROCESS_SPECIFIC",
  "CASE_SPECIFIC",
] as const);
export type NationalAuthorityAssignmentKind = typeof NATIONAL_AUTHORITY_ASSIGNMENT_KINDS[number];

export const NATIONAL_AUTHORITY_ROUTING_STATES = Object.freeze([
  "AUTHORITY_VERIFIED",
  "AUTHORITY_CONDITIONAL",
  "AUTHORITY_PROCESS_SPECIFIC",
  "AUTHORITY_UNRESOLVED",
  "FETCH_LIVE_REQUIRED",
] as const);
export type NationalAuthorityRoutingState = typeof NATIONAL_AUTHORITY_ROUTING_STATES[number];

export const AT_SOURCE_HIERARCHY_LEVELS = Object.freeze([
  "PRIMARY_LAW",
  "COMPETENT_FEDERAL_MINISTRY",
  "COMPETENT_NATIONAL_ADMINISTRATIVE_OR_INSURANCE_AUTHORITY",
  "OFFICIAL_GOVERNMENT_SERVICE_PORTAL",
  "OFFICIAL_FORM_OR_DIGITAL_PROCEDURE",
] as const);
export type AtSourceHierarchyLevel = typeof AT_SOURCE_HIERARCHY_LEVELS[number];

export const AT_SOURCE_TYPE_CLASSES = Object.freeze([
  "AUTHENTIC_STATUTE",
  "COMPETENT_AUTHORITY_GUIDANCE",
  "OFFICIAL_SERVICE_PORTAL",
  "OFFICIAL_FORM",
  "OFFICIAL_INSTITUTIONAL_INFORMATION",
] as const);
export type AtSourceTypeClass = typeof AT_SOURCE_TYPE_CLASSES[number];

export const AT_AUTHORITY_IDENTITY_KEYS = Object.freeze([
  "AT_RIS",
  "AT_SVS",
  "AT_OEGK",
  "AT_BVAEB",
  "AT_DACHVERBAND",
  "AT_AMS",
  "AT_FINANZAMT_OESTERREICH",
  "AT_BMF",
  "AT_BMWET",
  "AT_USP",
  "AT_OESTERREICH_GV",
] as const);
export type AtAuthorityIdentityKey = typeof AT_AUTHORITY_IDENTITY_KEYS[number];

export const AT_NATIONAL_FOUNDATION_EXPLICITLY_NOT_BUILT = Object.freeze([
  "AT_APPLICABLE_LEGISLATION_PACK",
  "AT_HEALTH_PACK",
  "AT_FAMILY_PACK",
  "AT_UNEMPLOYMENT_PACK",
  "AT_GEWERBE_PACK",
  "AT_TAX_RESIDENCE_PACK",
  "AT_SK_TAX_TREATY_PACK",
] as const);

export const AT_FOUNDATION_INTERNAL_PROCESS_KEYS = Object.freeze([
  "at_authority_routing",
  "at_official_source_selection",
  "at_cross_border_gewerbe_authority_boundary",
] as const);

export type AtInsuranceCategory =
  | "SELF_EMPLOYED_ASSIGNED"
  | "EMPLOYED_ORDINARY"
  | "PUBLIC_SERVICE_RAIL_MINING"
  | "UNKNOWN";

export type AtAuthorityBinding = Readonly<{
  authorityKey: AtAuthorityIdentityKey;
  domain: NationalAuthorityDomain;
  role: NationalAuthorityRole;
  assignmentKind: NationalAuthorityAssignmentKind;
  processKey?: string;
}>;

export type AtFoundationRoutingInput = Readonly<{
  domain: NationalAuthorityDomain;
  processKey?: string;
  insuranceCategory?: AtInsuranceCategory | null;
  requestKind?: "INSTITUTION_IDENTITY" | "EXACT_OFFICE_CONTACT" | "LEGAL_SOURCE" | "PORTAL_GUIDANCE";
  article68Requested?: boolean;
}>;

export type AtFoundationRoutingResult = Readonly<{
  state: NationalAuthorityRoutingState;
  authorityKeys: readonly AtAuthorityIdentityKey[];
  issues: readonly string[];
}>;

export const AT_AUTHORITY_BINDINGS: readonly AtAuthorityBinding[] = Object.freeze([
  { authorityKey: "AT_RIS", domain: "LEGAL_SOURCE", role: "LEGAL_SOURCE", assignmentKind: "PRIMARY" },
  { authorityKey: "AT_BMF", domain: "PERSONAL_INCOME_TAX", role: "POLICY_MINISTRY", assignmentKind: "PRIMARY" },
  { authorityKey: "AT_FINANZAMT_OESTERREICH", domain: "PERSONAL_INCOME_TAX", role: "TAX_AUTHORITY", assignmentKind: "PRIMARY" },
  { authorityKey: "AT_FINANZAMT_OESTERREICH", domain: "FAMILY_BENEFITS", role: "ADMINISTRATIVE_AUTHORITY", assignmentKind: "PRIMARY" },
  { authorityKey: "AT_AMS", domain: "UNEMPLOYMENT", role: "EMPLOYMENT_SERVICE", assignmentKind: "PRIMARY" },
  { authorityKey: "AT_SVS", domain: "SOCIAL_SECURITY", role: "SOCIAL_INSURANCE_CARRIER", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_SVS", domain: "HEALTH_INSURANCE", role: "HEALTH_INSURANCE_CARRIER", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_OEGK", domain: "HEALTH_INSURANCE", role: "HEALTH_INSURANCE_CARRIER", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_OEGK", domain: "SOCIAL_SECURITY", role: "SOCIAL_INSURANCE_CARRIER", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_BVAEB", domain: "HEALTH_INSURANCE", role: "HEALTH_INSURANCE_CARRIER", assignmentKind: "SPECIAL_CATEGORY" },
  { authorityKey: "AT_BVAEB", domain: "SOCIAL_SECURITY", role: "SOCIAL_INSURANCE_CARRIER", assignmentKind: "SPECIAL_CATEGORY" },
  { authorityKey: "AT_DACHVERBAND", domain: "CROSS_BORDER_EU_COORDINATION", role: "COORDINATION_BODY", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_BMWET", domain: "CROSS_BORDER_GEWERBE_SERVICE", role: "POLICY_MINISTRY", assignmentKind: "PROCESS_SPECIFIC", processKey: "at_cross_border_gewerbe_authority_boundary" },
  { authorityKey: "AT_USP", domain: "CROSS_BORDER_GEWERBE_SERVICE", role: "SERVICE_PORTAL", assignmentKind: "CONDITIONAL" },
  { authorityKey: "AT_OESTERREICH_GV", domain: "FAMILY_BENEFITS", role: "SERVICE_PORTAL", assignmentKind: "CONDITIONAL" },
]);

export function validateAtNationalTrustScope(input: {
  trustDomain: string;
  countryCode: string;
  jurisdictionLevel?: string;
}): readonly string[] {
  const issues: string[] = [];
  if (input.trustDomain === AT_NATIONAL_TRUST_DOMAIN) {
    if (input.countryCode !== AT_NATIONAL_COUNTRY_CODE) {
      issues.push("AT_TRUST_REQUIRES_AT_JURISDICTION");
    }
    if (input.countryCode === "DE") issues.push("AT_TRUST_REJECTS_DE_JURISDICTION");
    if (input.countryCode === "SK") issues.push("AT_TRUST_REJECTS_SK_JURISDICTION");
    if (input.countryCode === "EU") issues.push("AT_TRUST_REJECTS_EU_LAW_AS_NATIONAL");
    if (input.jurisdictionLevel === "eu") issues.push("AT_TRUST_REJECTS_EU_JURISDICTION_LEVEL");
  }
  return issues;
}

export function detectAuthorityConflicts(
  bindings: readonly AtAuthorityBinding[],
): readonly string[] {
  const issues: string[] = [];
  const seen = new Map<string, AtAuthorityBinding>();
  for (const binding of bindings) {
    if (binding.assignmentKind !== "PRIMARY" && binding.assignmentKind !== "PROCESS_SPECIFIC") {
      continue;
    }
    const token = `${binding.domain}::${binding.role}::${binding.processKey ?? "*"}::${binding.assignmentKind}`;
    const existing = seen.get(token);
    if (existing && existing.authorityKey !== binding.authorityKey) {
      issues.push(`AUTHORITY_CONFLICT:${token}:${existing.authorityKey}+${binding.authorityKey}`);
    } else {
      seen.set(token, binding);
    }
  }
  return issues;
}

export function resolveSourceRuleConflict(input: {
  statuteText?: string;
  explanatoryText?: string;
  sameLegalRule: boolean;
  conflict: boolean;
}): Readonly<{ winner: "STATUTE" | "NONE"; explanatoryClass: "CURRENT" | "STALE_OFFICIAL_GUIDANCE" | "NONE" }> {
  if (!input.sameLegalRule || !input.conflict) {
    return { winner: "NONE", explanatoryClass: "NONE" };
  }
  if (input.statuteText && input.explanatoryText && input.statuteText !== input.explanatoryText) {
    return { winner: "STATUTE", explanatoryClass: "STALE_OFFICIAL_GUIDANCE" };
  }
  return { winner: "STATUTE", explanatoryClass: "STALE_OFFICIAL_GUIDANCE" };
}

export function routeAtFoundationAuthority(
  input: AtFoundationRoutingInput,
): AtFoundationRoutingResult {
  if (input.requestKind === "EXACT_OFFICE_CONTACT") {
    return {
      state: "FETCH_LIVE_REQUIRED",
      authorityKeys: input.domain === "UNEMPLOYMENT"
        ? ["AT_AMS"]
        : input.domain === "PERSONAL_INCOME_TAX" || input.domain === "FAMILY_BENEFITS"
          ? ["AT_FINANZAMT_OESTERREICH"]
          : [],
      issues: ["EXACT_OFFICE_CONTACT_NOT_CANONICAL"],
    };
  }
  if (input.requestKind === "LEGAL_SOURCE" || input.domain === "LEGAL_SOURCE") {
    return { state: "AUTHORITY_VERIFIED", authorityKeys: ["AT_RIS"], issues: ["RIS_IS_LEGAL_SOURCE_NOT_CASE_AUTHORITY"] };
  }
  if (input.requestKind === "PORTAL_GUIDANCE") {
    return { state: "AUTHORITY_CONDITIONAL", authorityKeys: ["AT_USP"], issues: ["PORTAL_IS_NOT_STATUTE"] };
  }
  if (input.article68Requested === true) {
    return {
      state: "AUTHORITY_UNRESOLVED",
      authorityKeys: [],
      issues: ["FAMILIENBEIHILFE_ADMINISTRATION_IS_NOT_ARTICLE68_RESULT"],
    };
  }
  if (input.domain === "UNEMPLOYMENT") {
    return { state: "AUTHORITY_VERIFIED", authorityKeys: ["AT_AMS"], issues: [] };
  }
  if (input.domain === "PERSONAL_INCOME_TAX") {
    return { state: "AUTHORITY_VERIFIED", authorityKeys: ["AT_FINANZAMT_OESTERREICH"], issues: [] };
  }
  if (input.domain === "FAMILY_BENEFITS") {
    return { state: "AUTHORITY_VERIFIED", authorityKeys: ["AT_FINANZAMT_OESTERREICH"], issues: [] };
  }
  if (input.domain === "CROSS_BORDER_GEWERBE_SERVICE") {
    return {
      state: "AUTHORITY_PROCESS_SPECIFIC",
      authorityKeys: ["AT_BMWET"],
      issues: ["DIENSTLEISTUNGSANZEIGE_373A_USES_BMWET_NOT_LOCAL_GEWERBEBEHOERDE"],
    };
  }
  if (input.domain === "OTHER_GEWERBE") {
    return {
      state: "AUTHORITY_UNRESOLVED",
      authorityKeys: [],
      issues: ["BMWET_NOT_UNIVERSAL_FOR_ALL_GEWERBE"],
    };
  }
  if (input.domain === "HEALTH_INSURANCE" || input.domain === "SOCIAL_SECURITY") {
    if (input.insuranceCategory === "PUBLIC_SERVICE_RAIL_MINING") {
      return {
        state: "AUTHORITY_PROCESS_SPECIFIC",
        authorityKeys: ["AT_BVAEB"],
        issues: ["OEGK_MUST_NOT_OVERRIDE_BVAEB_SPECIAL_CATEGORY"],
      };
    }
    if (input.insuranceCategory === "SELF_EMPLOYED_ASSIGNED") {
      return {
        state: "AUTHORITY_CONDITIONAL",
        authorityKeys: ["AT_SVS"],
        issues: ["SVS_RELEVANT_NOT_UNIVERSAL_FOR_EVERY_SELF_EMPLOYED_CASE"],
      };
    }
    if (input.insuranceCategory === "EMPLOYED_ORDINARY") {
      return {
        state: "AUTHORITY_CONDITIONAL",
        authorityKeys: ["AT_OEGK"],
        issues: ["OEGK_RELEVANT_NOT_UNIVERSAL_FOR_EVERY_EMPLOYED_CASE"],
      };
    }
    return {
      state: "AUTHORITY_UNRESOLVED",
      authorityKeys: [],
      issues: ["UNKNOWN_AUSTRIAN_INSURANCE_CATEGORY_FAIL_CLOSED"],
    };
  }
  return { state: "AUTHORITY_UNRESOLVED", authorityKeys: [], issues: ["AUTHORITY_DOMAIN_UNRESOLVED"] };
}

export function resolveAtNationalFoundationStableRef(input: {
  entityClass: string;
  key: string;
  trustDomain: string;
  countryCode: string;
  catalog: ReadonlyArray<{ entityClass: string; key: string; id: string }>;
}): Readonly<{ id: string | null; issues: readonly string[] }> {
  const issues: string[] = [];
  if (input.trustDomain !== AT_NATIONAL_TRUST_DOMAIN || input.countryCode !== AT_NATIONAL_COUNTRY_CODE) {
    return { id: null, issues: ["AT_STABLE_REF_WRONG_TRUST_OR_JURISDICTION"] };
  }
  const matches = input.catalog.filter((row) => row.entityClass === input.entityClass && row.key === input.key);
  if (matches.length === 0) return { id: null, issues: ["AT_STABLE_REF_ZERO_MATCHES"] };
  if (matches.length > 1) return { id: null, issues: ["AT_STABLE_REF_AMBIGUOUS"] };
  const expected = stableKnowledgeFactoryId(AT_NATIONAL_FOUNDATION_PACK_ID, input.entityClass, input.key);
  if (matches[0].id !== expected) issues.push("AT_STABLE_REF_NONDETERMINISTIC");
  return { id: matches[0].id, issues };
}

export function atNationalFoundationFingerprint(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function validateAtNationalFoundationPack(payload: {
  schemaVersion: number;
  packId: string;
  countryCode: string;
  canonicalLanguage: string;
  trustDomain: Readonly<Record<string, unknown> & { code?: unknown }>;
  jurisdictions: ReadonlyArray<Readonly<Record<string, unknown>>>;
  claims: ReadonlyArray<Readonly<Record<string, unknown>>>;
  sources: ReadonlyArray<Readonly<Record<string, unknown>>>;
  processes?: ReadonlyArray<Readonly<Record<string, unknown>>>;
}): Readonly<{ valid: boolean; issues: readonly string[] }> {
  const issues: string[] = [];
  if (payload.schemaVersion !== KNOWLEDGE_FACTORY_SCHEMA_VERSION) issues.push("UNSUPPORTED_SCHEMA_VERSION");
  if (payload.packId !== AT_NATIONAL_FOUNDATION_PACK_ID) issues.push("AT_FOUNDATION_PACK_ID_INVALID");
  if (payload.canonicalLanguage !== AT_NATIONAL_CANONICAL_LANGUAGE) issues.push("INVALID_CANONICAL_LANGUAGE");
  if (payload.trustDomain.code !== AT_NATIONAL_TRUST_DOMAIN) issues.push("AT_TRUST_DOMAIN_REQUIRED");
  if (payload.countryCode !== AT_NATIONAL_COUNTRY_CODE) issues.push("AT_COUNTRY_REQUIRED");
  issues.push(...validateAtNationalTrustScope({
    trustDomain: String(payload.trustDomain.code ?? ""),
    countryCode: payload.countryCode,
    jurisdictionLevel: String(payload.jurisdictions[0]?.level ?? ""),
  }));
  for (const jurisdiction of payload.jurisdictions) {
    if (jurisdiction.countryCode !== AT_NATIONAL_COUNTRY_CODE) issues.push("AT_JURISDICTION_NOT_AT");
    if (jurisdiction.level !== AT_NATIONAL_JURISDICTION_LEVEL) issues.push("AT_JURISDICTION_LEVEL_INVALID");
  }
  if (payload.claims.some((row) => row.temporalClass !== "CURRENT")) issues.push("AT_FOUNDATION_NON_CURRENT");
  if (payload.claims.some((row) => String(row.text ?? "").includes("\n\n"))) {
    issues.push("AT_FOUNDATION_CLAIM_NOT_ATOMIC");
  }
  const commercial = payload.sources.filter((source) => {
    const domain = String(source.officialDomain ?? "").toLowerCase();
    return domain.includes("wko.at")
      || domain.includes("wikipedia")
      || domain.includes("reddit")
      || domain.includes("steuerberater")
      || source.sourceClass === "COMMERCIAL_GUIDE"
      || source.sourceClass === "BLOG";
  });
  if (commercial.length > 0) issues.push("COMMERCIAL_CANONICAL_SOURCE_FORBIDDEN");
  const portalAsStatute = payload.sources.some((source) => {
    const domain = String(source.officialDomain ?? "").toLowerCase();
    return (domain.includes("usp.gv.at") || domain.includes("oesterreich.gv.at"))
      && source.sourceClass === "FEDERAL_LAW";
  });
  if (portalAsStatute) issues.push("PORTAL_LABELED_AS_STATUTE");
  const unknownProcess = (payload.processes ?? []).some((process) => (
    typeof process.key === "string"
    && !(AT_FOUNDATION_INTERNAL_PROCESS_KEYS as readonly string[]).includes(process.key)
  ));
  if (unknownProcess) issues.push("UNKNOWN_FOUNDATION_PROCESS");
  issues.push(...detectAuthorityConflicts(AT_AUTHORITY_BINDINGS));
  return { valid: issues.length === 0, issues };
}
