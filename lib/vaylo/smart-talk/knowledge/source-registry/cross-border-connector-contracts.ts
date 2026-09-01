/**
 * CB-0B — Cross-border connector authoring and case-context contracts.
 * Parallel to CuratedDomainPack. Does not restate German or EU law.
 * Authoring uses factory keys, never stored database UUIDs.
 */
import { createHash } from "node:crypto";

import { KNOWLEDGE_FACTORY_SCHEMA_VERSION, stableKnowledgeFactoryId } from "./knowledge-factory-contracts";

export const CROSS_BORDER_CONNECTOR_SCHEMA_VERSION = KNOWLEDGE_FACTORY_SCHEMA_VERSION;
export const CROSS_BORDER_ORIGIN_MARKET = "DE" as const;
export const CROSS_BORDER_CONNECTED_COUNTRIES = Object.freeze(["SK", "CZ", "PL", "HU"] as const);
export type CrossBorderConnectedCountry = typeof CROSS_BORDER_CONNECTED_COUNTRIES[number];

export const CROSS_BORDER_PERSON_ROLES = Object.freeze([
  "PARENT_A", "PARENT_B", "CHILD", "WORKER", "FAMILY_MEMBER",
] as const);
export type CrossBorderPersonRole = typeof CROSS_BORDER_PERSON_ROLES[number];

export const CROSS_BORDER_CASE_STATES = Object.freeze([
  "residenceState", "employmentState", "insuranceState", "activityState", "postingState",
] as const);
export type CrossBorderCaseState = typeof CROSS_BORDER_CASE_STATES[number];

export const CROSS_BORDER_TEMPORAL_CLASSES = Object.freeze([
  "CURRENT", "LEGACY", "FUTURE_ENACTED", "PROPOSED_NOT_CURRENT",
] as const);
export type CrossBorderTemporalClass = typeof CROSS_BORDER_TEMPORAL_CLASSES[number];

export const COD_2016_0397_STATUS = "PROPOSED_NOT_CURRENT" as const;

export const CROSS_BORDER_TOPIC_FAMILIES = Object.freeze([
  "SOCIAL_SECURITY_COORDINATION", "TAX_TREATY",
] as const);
export type CrossBorderTopicFamily = typeof CROSS_BORDER_TOPIC_FAMILIES[number];

export const CROSS_BORDER_SOURCE_JURISDICTIONS = Object.freeze(["DE", "EU"] as const);
export type CrossBorderSourceJurisdiction = typeof CROSS_BORDER_SOURCE_JURISDICTIONS[number];

export const CROSS_BORDER_TRUST_DOMAINS = Object.freeze(["de", "eu"] as const);
export type CrossBorderTrustDomainCode = typeof CROSS_BORDER_TRUST_DOMAINS[number];

export const CROSS_BORDER_ENTITY_CLASSES = Object.freeze(["claims", "processes"] as const);
export type CrossBorderEntityClass = typeof CROSS_BORDER_ENTITY_CLASSES[number];

export const CROSS_BORDER_CONNECTOR_STATUSES = Object.freeze(["planned", "prepared"] as const);
export type CrossBorderConnectorStatus = typeof CROSS_BORDER_CONNECTOR_STATUSES[number];

export const FOREIGN_NATIONAL_ADAPTER_COUNTRIES = Object.freeze(["SK"] as const);
export type ForeignNationalAdapterCountry = typeof FOREIGN_NATIONAL_ADAPTER_COUNTRIES[number];
export const FOREIGN_NATIONAL_ADAPTER_TRUST_DOMAIN = "sk" as const;

const KEY = /^[a-z0-9][a-z0-9:_-]{1,80}$/u;
const ISO2 = /^[A-Z]{2}$/u;

export type StableKnowledgeReference = Readonly<{
  entityClass: CrossBorderEntityClass;
  key: string;
  sourceJurisdiction: CrossBorderSourceJurisdiction;
  trustDomain: CrossBorderTrustDomainCode;
  temporalClass: CrossBorderTemporalClass;
}>;

export type CrossBorderPersonFacts = Readonly<{
  role: CrossBorderPersonRole;
  residenceState?: string | null;
  employmentState?: string | null;
  insuranceState?: string | null;
  activityState?: string | null;
  postingState?: string | null;
}>;

export const CROSS_BORDER_HEALTH_ACTIVITY_TYPES = Object.freeze([
  "EMPLOYED",
  "SELF_EMPLOYED",
  "MIXED_EMPLOYED_SELF_EMPLOYED",
  "ACTIVITY_TYPE_CHANGED",
  "UNKNOWN",
] as const);
export type CrossBorderHealthActivityType = typeof CROSS_BORDER_HEALTH_ACTIVITY_TYPES[number];

export const CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS = Object.freeze([
  "GKV",
  "PKV",
  "SK_PUBLIC",
  "OTHER",
  "UNKNOWN",
] as const);
export type CrossBorderHealthInsuranceSystem = typeof CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS[number];

export type CrossBorderHealthcareFacts = Readonly<{
  competentState?: string | null;
  applicableLegislationVerified?: boolean | null;
  activityType?: CrossBorderHealthActivityType | null;
  insuranceSystemType?: "STATUTORY" | "PRIVATE" | "UNCLEAR" | null;
  healthInsuranceSystem?: CrossBorderHealthInsuranceSystem | null;
  healthInsuranceVerified?: boolean | null;
  competentHealthInsurerKnown?: boolean | null;
  residenceVerified?: boolean | null;
  temporaryStayState?: string | null;
  treatmentState?: string | null;
  s1Status?: string | null;
  s1ResidenceRegistrationStatus?: string | null;
  ehicStatus?: string | null;
  prcStatus?: string | null;
  s2Status?: string | null;
  familyMemberRole?: string | null;
  familyMemberStatusKnown?: boolean | null;
  familyMemberHasOwnEntitlement?: boolean | null;
  treatmentIsPlanned?: boolean | null;
  treatmentWasPurposeOfTravel?: boolean | null;
  providerSystemType?: "PUBLIC" | "PRIVATE" | "UNCLEAR" | null;
  materialChangeDate?: string | null;
}>;

export const CROSS_BORDER_FAMILY_ACTIVITY_TYPES = Object.freeze([
  "EMPLOYED",
  "SELF_EMPLOYED",
  "MIXED",
  "INACTIVE",
  "PENSION",
  "UNEMPLOYED",
  "UNKNOWN",
] as const);
export type CrossBorderFamilyActivityType = typeof CROSS_BORDER_FAMILY_ACTIVITY_TYPES[number];

export type CrossBorderFamilyParentActivityFacts = Readonly<{
  role: "PARENT_A" | "PARENT_B";
  activityType?: CrossBorderFamilyActivityType | null;
  selfEmploymentStates?: readonly string[] | null;
  employmentStates?: readonly string[] | null;
  activityStatusVerified?: boolean | null;
}>;

export type CrossBorderFamilyBenefitChildFacts = Readonly<{
  childKey?: string | null;
  residenceState?: string | null;
  familyRelationship?: string | null;
  relevantPeriod?: string | null;
}>;

export type FamilyBenefitBasket = Readonly<{
  familyMember?: string | null;
  state?: string | null;
  nationalBenefitRefs?: readonly string[] | null;
  verifiedEntitlements?: readonly string[] | null;
  currentAmounts?: readonly string[] | null;
  paymentPeriods?: readonly string[] | null;
  classificationStatus?:
    | "CLASSIFIED"
    | "EXCLUDED_ANNEX_I"
    | "CLASSIFICATION_REQUIRES_AUTHORITY"
    | "UNCLEAR"
    | null;
}>;

export type CrossBorderFamilyBenefitFacts = Readonly<{
  primaryBenefitState?: string | null;
  secondaryBenefitState?: string | null;
  childResidenceKnown?: boolean | null;
  secondParentActivityKnown?: boolean | null;
  overlapSamePeriod?: boolean | null;
  overlapSameFamilyMember?: boolean | null;
  entitlementBasis?: "ACTIVITY" | "PENSION" | "RESIDENCE" | "UNCLEAR" | null;
  parentActivities?: readonly CrossBorderFamilyParentActivityFacts[] | null;
  otherParentSelfEmploymentStatusKnown?: boolean | null;
  nationalEntitlementVerified?: boolean | null;
  amountKnown?: boolean | null;
  applicantIsBeneficiary?: boolean | null;
  children?: readonly CrossBorderFamilyBenefitChildFacts[] | null;
  f3BasketComplete?: boolean | null;
  periodAlignmentKnown?: boolean | null;
  calendarMonthVsLebensmonat?: "INCOMPATIBLE" | "ALIGNED" | "UNCLEAR" | null;
  f3Baskets?: readonly FamilyBenefitBasket[] | null;
}>;

export type CrossBorderUnemploymentPeriod = Readonly<{
  state?: string | null;
  periodType?: "INSURANCE" | "EMPLOYMENT" | "SELF_EMPLOYMENT" | "UNCLEAR" | null;
  from?: string | null;
  to?: string | null;
  overlapStatus?: "NONE" | "OVERLAP" | "UNCLEAR" | null;
}>;

export const CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES = Object.freeze([
  "EMPLOYED",
  "SELF_EMPLOYED",
  "MIXED_EMPLOYED_SELF_EMPLOYED",
  "FORMER_EMPLOYED",
  "FORMER_SELF_EMPLOYED",
  "ACTIVITY_STATUS_CHANGED",
  "UNKNOWN",
] as const);
export type CrossBorderUnemploymentActivityType =
  typeof CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES[number];

export type CrossBorderUnemploymentFacts = Readonly<{
  unemploymentStatus?: "WHOLE" | "PARTIAL" | "INTERMITTENT" | "UNCLEAR" | null;
  employmentRelationshipExists?: boolean | null;
  activitySuspended?: boolean | null;
  lastActivityState?: string | null;
  lastApplicableLegislationState?: string | null;
  residenceState?: string | null;
  residenceVerified?: boolean | null;
  frontierWorkerStatus?: "FRONTIER" | "NON_FRONTIER" | "UNCLEAR" | null;
  returnFrequency?: "DAILY" | "WEEKLY" | "LESS_THAN_WEEKLY" | "UNCLEAR" | null;
  lastActivityType?: "EMPLOYED" | "SELF_EMPLOYED" | "SPECIAL_CIVIL_SERVANT" | "UNKNOWN" | null;
  activityType?: CrossBorderUnemploymentActivityType | null;
  continuesInResidenceState?: boolean | null;
  returnedToResidenceState?: boolean | null;
  remainedInLastActivityState?: boolean | null;
  nationalEntitlementCandidates?: readonly string[] | null;
  insurancePeriods?: readonly CrossBorderUnemploymentPeriod[] | null;
  employmentPeriods?: readonly CrossBorderUnemploymentPeriod[] | null;
  selfEmploymentPeriods?: readonly CrossBorderUnemploymentPeriod[] | null;
  voluntaryUnemploymentInsuranceVerified?: boolean | null;
  lastSalaryState?: string | null;
  lastSalaryKnown?: boolean | null;
  currentBenefitState?: string | null;
  currentBenefitEntitlementVerified?: boolean | null;
  exportDestinationState?: string | null;
  exportPurposeIsJobSearch?: boolean | null;
  unemploymentRegistrationDate?: string | null;
  registrationState?: string | null;
  exportDepartureDate?: string | null;
  u1Status?: "PRESENT" | "ABSENT" | "UNCLEAR" | null;
  u2Status?: "PRESENT" | "ABSENT" | "UNCLEAR" | null;
  u3Status?: "PRESENT" | "ABSENT" | "UNCLEAR" | null;
  u1Required?: boolean | null;
  u2Required?: boolean | null;
  article65aNotificationVerified?: boolean | null;
}>;

export type CrossBorderCaseContext = Readonly<{
  persons: readonly CrossBorderPersonFacts[];
  period?: Readonly<{ from: string; to?: string | null }> | null;
  overlappingBenefits?: readonly string[] | null;
  workerPostingStatus?: "WORKER" | "POSTED" | "UNCLEAR" | null;
  healthcare?: CrossBorderHealthcareFacts | null;
  familyBenefits?: CrossBorderFamilyBenefitFacts | null;
  unemployment?: CrossBorderUnemploymentFacts | null;
}>;

export type CrossBorderActorSemantics = Readonly<{
  actorState: string;
  userMustAct: boolean;
  germanAuthorityMustAct: boolean;
  foreignAuthorityMustAct: boolean;
  institutionExchangeExpected: boolean;
}>;

export type ForeignNationalStableReference = Readonly<{
  entityClass: CrossBorderEntityClass;
  key: string;
  sourceJurisdiction: ForeignNationalAdapterCountry;
  trustDomain: typeof FOREIGN_NATIONAL_ADAPTER_TRUST_DOMAIN;
  temporalClass: CrossBorderTemporalClass;
}>;

export type CorridorProcessBinding = Readonly<{
  key: string;
  title: string;
  trigger: string;
  safeFirstStep: string;
  riskLevel: "medium" | "high";
  claimRefs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[];
}>;

export type CuratedCrossBorderConnectorPack = Readonly<{
  schemaVersion: typeof CROSS_BORDER_CONNECTOR_SCHEMA_VERSION;
  packId: string;
  originMarket: typeof CROSS_BORDER_ORIGIN_MARKET;
  connectedCountry: CrossBorderConnectedCountry;
  status: CrossBorderConnectorStatus;
  activationFromLocaleAllowed: false;
  activationRequiresVerifiedCaseContext: true;
  topicKey: string;
  topicFamily: CrossBorderTopicFamily;
  germanProcessRef: StableKnowledgeReference;
  germanClaimRefs: readonly StableKnowledgeReference[];
  euClaimRefs: readonly StableKnowledgeReference[];
  foreignClaimRefs: readonly (StableKnowledgeReference | ForeignNationalStableReference)[];
  foreignProcessReference: string | null;
  actorRule: CrossBorderActorSemantics;
  requiredCaseRoles: readonly CrossBorderPersonRole[];
  requiredCaseStates: readonly CrossBorderCaseState[];
  handlingMode: "STORE_CANONICALLY" | "DO_NOT_ANSWER_WITHOUT_CONTEXT";
  freshnessClass: "LEGAL_CHANGE_MONITORED" | "EVENT_DRIVEN";
  corridorProcesses?: readonly CorridorProcessBinding[];
}>;

export type CrossBorderContractValidation = Readonly<{
  valid: boolean;
  issues: readonly string[];
  authoringUsesKeysNotDatabaseUuids: true;
  productionEligible: false;
}>;

export function factoryIdForStableRef(ref: Pick<StableKnowledgeReference, "entityClass" | "key">): string {
  return stableKnowledgeFactoryId("cross_border_unused_pack_id", ref.entityClass, ref.key);
}

export function connectorStableId(entityClass: string, key: string): string {
  return stableKnowledgeFactoryId("cross_border_unused_pack_id", entityClass, key);
}

export function fingerprintCrossBorderConnectorPack(
  pack: CuratedCrossBorderConnectorPack,
): string {
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
    if (field in row) issues.push(`LOCALE_FIELD_FORBIDDEN:${path}.${field}`);
  }
}

function validateStableRef(
  issues: string[],
  ref: StableKnowledgeReference | undefined,
  path: string,
  expectedClass?: CrossBorderEntityClass,
): void {
  if (!ref) {
    issues.push(`MISSING_REFERENCE:${path}`);
    return;
  }
  rejectLocaleFields(issues, ref, path);
  if (expectedClass && ref.entityClass !== expectedClass) {
    issues.push(`ENTITY_CLASS_MISMATCH:${path}`);
  }
  if (!(CROSS_BORDER_ENTITY_CLASSES as readonly string[]).includes(ref.entityClass)) {
    issues.push(`UNSUPPORTED_ENTITY_CLASS:${path}`);
  }
  if (!KEY.test(ref.key)) issues.push(`INVALID_STABLE_KEY:${path}`);
  if (!(CROSS_BORDER_SOURCE_JURISDICTIONS as readonly string[]).includes(ref.sourceJurisdiction)) {
    issues.push(`UNSUPPORTED_SOURCE_JURISDICTION:${path}`);
  }
  if (!(CROSS_BORDER_TRUST_DOMAINS as readonly string[]).includes(ref.trustDomain)) {
    issues.push(`UNSUPPORTED_TRUST_DOMAIN:${path}`);
  }
  if (!(CROSS_BORDER_TEMPORAL_CLASSES as readonly string[]).includes(ref.temporalClass)) {
    issues.push(`UNSUPPORTED_TEMPORAL_CLASS:${path}`);
  }
  if ("id" in (ref as object)) issues.push(`AUTHORING_DATABASE_UUID_FORBIDDEN:${path}`);
  if (ref.temporalClass === "PROPOSED_NOT_CURRENT") {
    issues.push(`PROPOSED_NOT_CURRENT_FORBIDDEN:${path}`);
  }
  if (ref.temporalClass !== "CURRENT") {
    issues.push(`NON_CURRENT_REFERENCE:${path}`);
  }
}

export function validateCrossBorderCaseContext(
  context: CrossBorderCaseContext,
): CrossBorderContractValidation {
  const issues: string[] = [];
  rejectLocaleFields(issues, context, "caseContext");
  if (!Array.isArray(context.persons)) issues.push("CASE_CONTEXT_PERSONS_INVALID");
  const roles = new Set<string>();
  for (const [index, person] of (context.persons ?? []).entries()) {
    rejectLocaleFields(issues, person, `persons.${index}`);
    if (!(CROSS_BORDER_PERSON_ROLES as readonly string[]).includes(person.role)) {
      issues.push(`UNKNOWN_PERSON_ROLE:${person.role}`);
    }
    if (roles.has(person.role)) issues.push(`DUPLICATE_PERSON_ROLE:${person.role}`);
    roles.add(person.role);
    for (const state of CROSS_BORDER_CASE_STATES) {
      const value = person[state];
      if (value != null && value !== "" && !ISO2.test(value)) {
        issues.push(`INVALID_CASE_STATE:${person.role}.${state}`);
      }
    }
  }
  if (context.period && !context.period.from) issues.push("CASE_CONTEXT_PERIOD_INVALID");
  if (context.familyBenefits) {
    rejectLocaleFields(issues, context.familyBenefits, "familyBenefits");
    for (const [index, child] of (context.familyBenefits.children ?? []).entries()) {
      rejectLocaleFields(issues, child, `familyBenefits.children.${index}`);
      if (child.residenceState != null && child.residenceState !== "" && !ISO2.test(child.residenceState)) {
        issues.push(`INVALID_CASE_STATE:familyBenefits.children.${index}.residenceState`);
      }
    }
    for (const stateKey of ["primaryBenefitState", "secondaryBenefitState"] as const) {
      const value = context.familyBenefits[stateKey];
      if (value != null && value !== "" && !ISO2.test(value)) {
        issues.push(`INVALID_CASE_STATE:familyBenefits.${stateKey}`);
      }
    }
    for (const [index, parent] of (context.familyBenefits.parentActivities ?? []).entries()) {
      rejectLocaleFields(issues, parent, `familyBenefits.parentActivities.${index}`);
      if (parent.role !== "PARENT_A" && parent.role !== "PARENT_B") {
        issues.push(`UNKNOWN_FAMILY_PARENT_ROLE:${parent.role}`);
      }
      if (
        parent.activityType != null
        && !(CROSS_BORDER_FAMILY_ACTIVITY_TYPES as readonly string[]).includes(parent.activityType)
      ) {
        issues.push(`UNKNOWN_FAMILY_ACTIVITY_TYPE:${parent.activityType}`);
      }
      for (const state of parent.selfEmploymentStates ?? []) {
        if (state !== "" && !ISO2.test(state)) {
          issues.push(`INVALID_CASE_STATE:familyBenefits.parentActivities.${index}.selfEmploymentStates`);
        }
      }
      for (const state of parent.employmentStates ?? []) {
        if (state !== "" && !ISO2.test(state)) {
          issues.push(`INVALID_CASE_STATE:familyBenefits.parentActivities.${index}.employmentStates`);
        }
      }
    }
  }
  if (context.unemployment) {
    rejectLocaleFields(issues, context.unemployment, "unemployment");
    for (const stateKey of [
      "lastActivityState", "lastApplicableLegislationState", "residenceState",
      "lastSalaryState", "currentBenefitState", "exportDestinationState",
      "registrationState",
    ] as const) {
      const value = context.unemployment[stateKey];
      if (value != null && value !== "" && !ISO2.test(value)) {
        issues.push(`INVALID_CASE_STATE:unemployment.${stateKey}`);
      }
    }
    if (
      context.unemployment.activityType != null
      && !(CROSS_BORDER_UNEMPLOYMENT_ACTIVITY_TYPES as readonly string[]).includes(
        context.unemployment.activityType,
      )
    ) {
      issues.push(`UNKNOWN_UNEMPLOYMENT_ACTIVITY_TYPE:${context.unemployment.activityType}`);
    }
  }
  if (context.healthcare) {
    rejectLocaleFields(issues, context.healthcare, "healthcare");
    if (
      context.healthcare.activityType != null
      && !(CROSS_BORDER_HEALTH_ACTIVITY_TYPES as readonly string[]).includes(context.healthcare.activityType)
    ) {
      issues.push(`UNKNOWN_HEALTH_ACTIVITY_TYPE:${context.healthcare.activityType}`);
    }
    if (
      context.healthcare.healthInsuranceSystem != null
      && !(CROSS_BORDER_HEALTH_INSURANCE_SYSTEMS as readonly string[]).includes(context.healthcare.healthInsuranceSystem)
    ) {
      issues.push(`UNKNOWN_HEALTH_INSURANCE_SYSTEM:${context.healthcare.healthInsuranceSystem}`);
    }
    if (context.healthcare.competentState != null && context.healthcare.competentState !== ""
      && !ISO2.test(context.healthcare.competentState)) {
      issues.push("INVALID_CASE_STATE:healthcare.competentState");
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export function detectMissingCrossBorderFacts(
  context: CrossBorderCaseContext,
  requiredRoles: readonly CrossBorderPersonRole[],
  requiredStates: readonly CrossBorderCaseState[],
): readonly string[] {
  const missing: string[] = [];
  if (!context.period?.from) missing.push("period");
  for (const role of requiredRoles) {
    const person = context.persons.find((item) => item.role === role);
    if (!person) {
      missing.push(`person:${role}`);
      continue;
    }
    for (const state of requiredStates) {
      if (!person[state]) missing.push(`${role}.${state}`);
    }
  }
  return Object.freeze(missing);
}

export function validateCuratedCrossBorderConnectorPack(
  pack: CuratedCrossBorderConnectorPack,
): CrossBorderContractValidation {
  const issues: string[] = [];
  rejectLocaleFields(issues, pack, "pack");
  if (pack.schemaVersion !== 1) issues.push("UNSUPPORTED_SCHEMA_VERSION");
  if (!/^[a-z0-9_]{3,80}$/u.test(pack.packId)) issues.push("INVALID_PACK_ID");
  if (pack.originMarket !== "DE") issues.push("ORIGIN_MARKET_INVALID");
  if (!(CROSS_BORDER_CONNECTED_COUNTRIES as readonly string[]).includes(pack.connectedCountry)) {
    issues.push("UNKNOWN_CORRIDOR");
  }
  const status = pack.status as string;
  if (status !== "planned" && status !== "prepared") issues.push("CONNECTOR_NOT_PLANNED");
  if (status === "active") issues.push("CONNECTOR_ACTIVE_FORBIDDEN");
  if (pack.activationFromLocaleAllowed !== false) issues.push("LOCALE_ACTIVATION_FORBIDDEN");
  if (pack.activationRequiresVerifiedCaseContext !== true) {
    issues.push("VERIFIED_CASE_CONTEXT_REQUIRED");
  }
  if (!KEY.test(pack.topicKey)) issues.push("INVALID_TOPIC_KEY");
  if (!(CROSS_BORDER_TOPIC_FAMILIES as readonly string[]).includes(pack.topicFamily)) {
    issues.push("UNSUPPORTED_TOPIC_FAMILY");
  }
  if (pack.topicFamily === "TAX_TREATY") issues.push("TAX_TREATY_ENGINE_NOT_AUTHORIZED");
  if (pack.topicFamily === "TAX_TREATY" && pack.euClaimRefs.length > 0) {
    issues.push("TAX_CANNOT_USE_883_EU_CLAIMS");
  }
  if (pack.topicFamily === "SOCIAL_SECURITY_COORDINATION" && pack.euClaimRefs.length === 0) {
    issues.push("MISSING_EU_REFERENCE");
  }
  validateStableRef(issues, pack.germanProcessRef, "germanProcessRef", "processes");
  if (pack.germanProcessRef.sourceJurisdiction !== "DE" || pack.germanProcessRef.trustDomain !== "de") {
    issues.push("GERMAN_PROCESS_JURISDICTION_INVALID");
  }
  if (!pack.germanClaimRefs.length) issues.push("MISSING_GERMAN_REFERENCE");
  const skForeignAuthorized = pack.connectedCountry === "SK"
    && pack.foreignClaimRefs.length > 0
    && pack.foreignClaimRefs.every((ref) => (
      ref.sourceJurisdiction === "SK" && ref.trustDomain === "sk"
    ));
  if (pack.foreignClaimRefs.length && !skForeignAuthorized) {
    issues.push("FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED");
  }
  const seen = new Set<string>();
  for (const [index, ref] of pack.germanClaimRefs.entries()) {
    validateStableRef(issues, ref, `germanClaimRefs.${index}`, "claims");
    if (ref.sourceJurisdiction !== "DE" || ref.trustDomain !== "de") {
      issues.push(`GERMAN_CLAIM_JURISDICTION_INVALID:${ref.key}`);
    }
    const token = `${ref.entityClass}:${ref.key}`;
    if (seen.has(token)) issues.push(`DUPLICATE_REFERENCE:${token}`);
    seen.add(token);
  }
  for (const [index, ref] of pack.euClaimRefs.entries()) {
    validateStableRef(issues, ref, `euClaimRefs.${index}`, "claims");
    if (ref.sourceJurisdiction !== "EU" || ref.trustDomain !== "eu") {
      issues.push(`EU_CLAIM_JURISDICTION_INVALID:${ref.key}`);
    }
    const token = `${ref.entityClass}:${ref.key}`;
    if (seen.has(token)) issues.push(`DUPLICATE_REFERENCE:${token}`);
    seen.add(token);
  }
  if (skForeignAuthorized) {
    for (const [index, ref] of pack.foreignClaimRefs.entries()) {
      rejectLocaleFields(issues, ref, `foreignClaimRefs.${index}`);
      if (ref.entityClass !== "claims") issues.push(`ENTITY_CLASS_MISMATCH:foreignClaimRefs.${index}`);
      if (!KEY.test(ref.key)) issues.push(`INVALID_STABLE_KEY:foreignClaimRefs.${index}`);
      if (ref.temporalClass === "PROPOSED_NOT_CURRENT") {
        issues.push(`PROPOSED_NOT_CURRENT_FORBIDDEN:foreignClaimRefs.${index}`);
      }
      if (ref.temporalClass !== "CURRENT") issues.push(`NON_CURRENT_REFERENCE:foreignClaimRefs.${index}`);
      if ("id" in (ref as object)) issues.push(`AUTHORING_DATABASE_UUID_FORBIDDEN:foreignClaimRefs.${index}`);
      const token = `${ref.entityClass}:${ref.key}`;
      if (seen.has(token)) issues.push(`DUPLICATE_REFERENCE:${token}`);
      seen.add(token);
    }
  }
  if (!pack.actorRule.actorState) issues.push("ACTOR_STATE_REQUIRED");
  if (!pack.requiredCaseRoles.length || !pack.requiredCaseStates.length) {
    issues.push("CASE_CONTEXT_REQUIREMENTS_INCOMPLETE");
  }
  for (const role of pack.requiredCaseRoles) {
    if (!(CROSS_BORDER_PERSON_ROLES as readonly string[]).includes(role)) {
      issues.push(`UNKNOWN_REQUIRED_ROLE:${role}`);
    }
  }
  for (const state of pack.requiredCaseStates) {
    if (!(CROSS_BORDER_CASE_STATES as readonly string[]).includes(state)) {
      issues.push(`UNKNOWN_REQUIRED_STATE:${state}`);
    }
  }
  if (pack.handlingMode === "DO_NOT_ANSWER_WITHOUT_CONTEXT" && !pack.requiredCaseStates.length) {
    issues.push("MISSING_CONTEXT_GATE");
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}

export type EuJurisdictionAnchorPack = Readonly<{
  schemaVersion: 1;
  packId: "eu_jurisdiction_anchor";
  canonicalLanguage: "de";
  trustDomain: Readonly<{ key: string; id: string; code: "eu"; name: string }>;
  jurisdictions: readonly Readonly<{
    key: string;
    id: string;
    level: "eu";
    code: "EU";
    countryCode: "EU";
    name: string;
  }>[];
  territorialScopes: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  publishers: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  authorities: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  sources: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  sourceVersions: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  passages: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  claims: readonly Readonly<Record<string, unknown> & { key: string; id: string; temporalClass: CrossBorderTemporalClass }>[];
  evidenceLinks: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
  citations: readonly Readonly<Record<string, unknown> & { key: string; id: string }>[];
}>;

export function validateEuJurisdictionAnchorPack(
  pack: EuJurisdictionAnchorPack,
): CrossBorderContractValidation {
  const issues: string[] = [];
  if (pack.schemaVersion !== 1 || pack.packId !== "eu_jurisdiction_anchor") {
    issues.push("EU_ANCHOR_IDENTITY_INVALID");
  }
  if (pack.canonicalLanguage !== "de") issues.push("INVALID_CANONICAL_LANGUAGE");
  if (pack.trustDomain.code !== "eu") issues.push("EU_TRUST_DOMAIN_REQUIRED");
  if (pack.trustDomain.id !== stableKnowledgeFactoryId(pack.packId, "trustDomain", pack.trustDomain.key)) {
    issues.push("NONDETERMINISTIC_ID:trustDomain");
  }
  for (const jurisdiction of pack.jurisdictions) {
    if (jurisdiction.level !== "eu" || jurisdiction.countryCode !== "EU" || jurisdiction.code !== "EU") {
      issues.push("EU_JURISDICTION_REQUIRED");
    }
    if (["SK", "CZ", "PL", "HU"].includes(jurisdiction.countryCode)) {
      issues.push("FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED");
    }
  }
  for (const claim of pack.claims) {
    if (claim.temporalClass !== "CURRENT") issues.push(`EU_ANCHOR_NON_CURRENT:${claim.key}`);
    if (claim.id !== stableKnowledgeFactoryId(pack.packId, "claims", claim.key)) {
      issues.push(`NONDETERMINISTIC_ID:claims:${claim.key}`);
    }
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    authoringUsesKeysNotDatabaseUuids: true,
    productionEligible: false,
  });
}
