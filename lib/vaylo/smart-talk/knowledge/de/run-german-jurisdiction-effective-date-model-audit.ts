/**
 * PHASE 9C — German Jurisdiction and Effective-Date Model Audit
 * (Model and Audit Only)
 *
 * This file defines a deterministic jurisdiction, territorial-scope,
 * authority-competence and effective-date model contract for the future
 * German bureaucracy/legal knowledge system used by Birello Smart Talk —
 * building on PHASE 9A (architecture boundary) and PHASE 9B (source
 * hierarchy / trust contract). It performs NO dynamic execution: no
 * network, no source download, no ingestion, no database, no migration,
 * no embeddings, no retrieval, no model call, no OCR, no user-content
 * persistence, no environment mutation.
 *
 * It only:
 *   1. Declares immutable, type-only jurisdiction and temporal contracts
 *      (jurisdiction levels, territorial identifiers, rule-scope types,
 *      jurisdiction context, user-location/legal-jurisdiction separation,
 *      authority competence + resolution, temporal concepts, effective-
 *      date statuses, immutable source-version timeline, historical-
 *      query support, event/date-precision model, temporal-applicability
 *      decision, regional overrides + resolution, temporal/jurisdiction
 *      conflict models, multi-jurisdiction context, cross-border temporal
 *      alignment, person-specific context boundary, jurisdiction claim
 *      decision, allowed-use matrix, conservative failure output).
 *   2. Reads the PHASE 9A and 9B audit files and the PHASE 8.13C closure
 *      audit as plain text via `fs.readFileSync` (never imports/executes
 *      them) to ground a few conservative booleans.
 *   3. Runs read-only `git` commands to confirm this phase created
 *      exactly one new file and modified no existing file.
 *   4. Runs 147 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "558d42a";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";
const SOURCE_TRUST_CONTRACT_CHECK_ID = "9B";

const PHASE_9A_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";
const PHASE_9B_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-source-hierarchy-trust-contract-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-jurisdiction-effective-date-model-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;

function runGitReadOnly(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf8", cwd: process.cwd() }).trim();
  } catch {
    return "";
  }
}

function readFileText(relPath: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relPath), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function fileExists(relPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), relPath));
  } catch {
    return false;
  }
}

// ============================================================================
// JURISDICTION LEVELS (12) — not every Land uses every administrative level
// ============================================================================

type JurisdictionLevel =
  | "eu"
  | "de_federal"
  | "de_land"
  | "de_regierungsbezirk"
  | "de_kreis"
  | "de_kreisfreie_stadt"
  | "de_stadt"
  | "de_gemeinde"
  | "de_bezirk"
  | "de_specific_authority"
  | "cross_border_multi_jurisdiction"
  | "unresolved";

const JURISDICTION_LEVELS: readonly JurisdictionLevel[] = [
  "eu", "de_federal", "de_land", "de_regierungsbezirk", "de_kreis", "de_kreisfreie_stadt",
  "de_stadt", "de_gemeinde", "de_bezirk", "de_specific_authority", "cross_border_multi_jurisdiction", "unresolved",
];

type AdministrativeLevelPresence = "present" | "absent" | "not_applicable" | "unresolved";
const ADMINISTRATIVE_LEVEL_PRESENCE_STATES: readonly AdministrativeLevelPresence[] = [
  "present", "absent", "not_applicable", "unresolved",
];

// ============================================================================
// GERMAN TERRITORIAL IDENTIFIERS (design only — no real identifiers)
// ============================================================================

export interface TerritorialIdentifiers {
  countryCode?: string;
  landCode?: string;
  regierungsbezirkCode?: string;
  kreisCode?: string;
  cityCode?: string;
  municipalityCode?: string;
  bezirkCode?: string;
  authorityId?: string;
  postalCodeArea?: string;
  serviceAreaId?: string;
}

const TERRITORIAL_IDENTIFIER_FIELDS: readonly (keyof TerritorialIdentifiers)[] = [
  "countryCode", "landCode", "regierungsbezirkCode", "kreisCode", "cityCode",
  "municipalityCode", "bezirkCode", "authorityId", "postalCodeArea", "serviceAreaId",
];

// ============================================================================
// RULE SCOPE TYPES (17)
// ============================================================================

type RuleScopeType =
  | "all_eu"
  | "all_germany"
  | "one_land"
  | "multiple_lander"
  | "one_regierungsbezirk"
  | "one_kreis"
  | "multiple_kreise"
  | "one_city"
  | "one_municipality"
  | "selected_municipalities"
  | "one_bezirk"
  | "postal_code_area"
  | "authority_service_area"
  | "one_named_authority"
  | "cross_border_corridor"
  | "person_specific_context"
  | "unresolved_scope";

const RULE_SCOPE_TYPES: readonly RuleScopeType[] = [
  "all_eu", "all_germany", "one_land", "multiple_lander", "one_regierungsbezirk", "one_kreis",
  "multiple_kreise", "one_city", "one_municipality", "selected_municipalities", "one_bezirk",
  "postal_code_area", "authority_service_area", "one_named_authority", "cross_border_corridor",
  "person_specific_context", "unresolved_scope",
];

/** Prevented generalizations — enforced by contract, not by a numeric rank. */
const PREVENTED_SCOPE_GENERALIZATIONS: readonly string[] = [
  "local rule -> national claim",
  "one-Land rule -> all-Länder claim",
  "authority-specific procedure -> all-authority procedure",
  "postal-code service assignment -> legal rule generalization",
];

// ============================================================================
// JURISDICTION CONTEXT
// ============================================================================

export interface JurisdictionContext {
  market?: "DE";
  countryCode?: string;
  jurisdictionLevel: JurisdictionLevel;
  jurisdictionCode?: string;
  landCode?: string;
  regierungsbezirkCode?: string;
  kreisCode?: string;
  cityCode?: string;
  municipalityCode?: string;
  bezirkCode?: string;
  postalCode?: string;
  authorityId?: string;
  serviceAreaId?: string;
  crossBorderCountries?: readonly string[];
  contextSource?: string;
  contextVerified: boolean;
  verificationStatus: ReviewStatusLike;
  unresolvedFields: readonly string[];
  /** The system must not infer jurisdiction from UI language. */
  derivedFromLocale: false;
}

type ReviewStatusLike = "unverified" | "machine_prechecked" | "human_reviewed" | "expert_reviewed" | "review_required";

const JURISDICTION_CONTEXT_FIELDS: readonly (keyof JurisdictionContext)[] = [
  "market", "countryCode", "jurisdictionLevel", "jurisdictionCode", "landCode", "regierungsbezirkCode",
  "kreisCode", "cityCode", "municipalityCode", "bezirkCode", "postalCode", "authorityId", "serviceAreaId",
  "crossBorderCountries", "contextSource", "contextVerified", "verificationStatus", "unresolvedFields", "derivedFromLocale",
];

// ============================================================================
// USER LOCATION VS LEGAL JURISDICTION (11 distinct concepts)
// ============================================================================

const USER_LOCATION_VS_LEGAL_JURISDICTION_CONCEPTS: readonly string[] = [
  "current physical location", "registered residence", "habitual residence", "employment location",
  "employer seat", "tax residence", "insurance state", "competent authority territory",
  "document issuer territory", "place of legal event", "connected foreign country",
];

/** The model must not assume one location determines all legal competence. */
const ONE_LOCATION_DETERMINES_ALL_COMPETENCE = false as const;

// ============================================================================
// AUTHORITY COMPETENCE MODEL
// ============================================================================

export interface AuthorityCompetenceDimensions {
  subjectMatter: string;
  territorialScope: string;
  personalScope?: string;
  proceduralStage?: string;
  receivesApplication: boolean;
  decidesApplication: boolean;
  providesInformationOnly: boolean;
  issuesDocument: boolean;
  verifiesEvidence: boolean;
  requestsForeignEvidence: boolean;
  exchangesDataWithInstitution: boolean;
  handlesAppeal: boolean;
  handlesEnforcement: boolean;
  competenceEffectiveFrom?: string;
  competenceEffectiveUntil?: string;
  competenceSourceId?: string;
  competenceSourceVersionId?: string;
  reviewStatus: ReviewStatusLike;
}

const AUTHORITY_COMPETENCE_DIMENSION_FIELDS: readonly (keyof AuthorityCompetenceDimensions)[] = [
  "subjectMatter", "territorialScope", "personalScope", "proceduralStage", "receivesApplication",
  "decidesApplication", "providesInformationOnly", "issuesDocument", "verifiesEvidence",
  "requestsForeignEvidence", "exchangesDataWithInstitution", "handlesAppeal", "handlesEnforcement",
  "competenceEffectiveFrom", "competenceEffectiveUntil", "competenceSourceId", "competenceSourceVersionId", "reviewStatus",
];

type CompetenceResult =
  | "competent"
  | "conditionally_competent"
  | "information_only"
  | "forwarding_only"
  | "not_competent"
  | "overlapping_competence"
  | "competence_changed"
  | "competence_unknown"
  | "professional_confirmation_required";

const COMPETENCE_RESULTS: readonly CompetenceResult[] = [
  "competent", "conditionally_competent", "information_only", "forwarding_only", "not_competent",
  "overlapping_competence", "competence_changed", "competence_unknown", "professional_confirmation_required",
];

/** A nearby office is not proof of competence. */
const NEARBY_OFFICE_PROVES_COMPETENCE = false as const;

// ============================================================================
// AUTHORITY RESOLUTION
// ============================================================================

const AUTHORITY_RESOLUTION_INPUTS: readonly string[] = [
  "topic", "procedural stage", "user residence", "employment location", "legal status where relevant",
  "issuing authority", "connected country", "date of event", "source-supported territorial rules",
];

type AuthorityResolutionOutcome =
  | "one_competent_authority"
  | "multiple_possible_authorities"
  | "authority_depends_on_missing_fact"
  | "authority_changed_over_time"
  | "institution_exchange_expected"
  | "no_user_action_required"
  | "unresolved"
  | "blocked";

const AUTHORITY_RESOLUTION_OUTCOMES: readonly AuthorityResolutionOutcome[] = [
  "one_competent_authority", "multiple_possible_authorities", "authority_depends_on_missing_fact",
  "authority_changed_over_time", "institution_exchange_expected", "no_user_action_required", "unresolved", "blocked",
];

/** Concrete authority instructions must be blocked when competence is unresolved. */
const CONCRETE_INSTRUCTION_ALLOWED_WHEN_COMPETENCE_UNRESOLVED = false as const;

// ============================================================================
// TEMPORAL MODEL (19 distinct date concepts — never collapsed into one)
// ============================================================================

const TEMPORAL_CONCEPTS: readonly string[] = [
  "publishedAt", "adoptedAt", "promulgatedAt", "effectiveFrom", "effectiveUntil", "applicableFrom",
  "applicableUntil", "transitionalFrom", "transitionalUntil", "retrievedAt", "lastVerifiedAt",
  "lastReviewedAt", "sourceLastModifiedAt", "eventDate", "filingDate", "serviceDate", "decisionDate",
  "userQuestionDate", "historicalQueryDate",
];

// ============================================================================
// EFFECTIVE-DATE STATUS (14)
// ============================================================================

type EffectiveDateStatus =
  | "effective_currently"
  | "effective_for_historical_date"
  | "adopted_not_yet_effective"
  | "transitional_rule_applies"
  | "partially_effective"
  | "superseded"
  | "repealed"
  | "expired"
  | "suspended"
  | "effective_date_unknown"
  | "applicability_date_unknown"
  | "conflicting_effective_dates"
  | "source_version_gap"
  | "unresolved";

const EFFECTIVE_DATE_STATUSES: readonly EffectiveDateStatus[] = [
  "effective_currently", "effective_for_historical_date", "adopted_not_yet_effective", "transitional_rule_applies",
  "partially_effective", "superseded", "repealed", "expired", "suspended", "effective_date_unknown",
  "applicability_date_unknown", "conflicting_effective_dates", "source_version_gap", "unresolved",
];

/** Legal effectiveness is distinct from web-page freshness. */
const LEGAL_EFFECTIVENESS_EQUALS_PAGE_FRESHNESS = false as const;

// ============================================================================
// SOURCE VERSION TIMELINE (immutable — a newer version never overwrites)
// ============================================================================

export interface SourceVersionTimelineEntry {
  sourceId: string;
  sourceVersionId: string;
  versionSequence: number;
  contentHash: string;
  publishedAt?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  supersedesVersionId?: string;
  supersededByVersionId?: string;
  transitionRuleIds?: readonly string[];
  reviewStatus: ReviewStatusLike;
  freshnessStatus?: string;
  immutable: true;
  historicalUseAllowed: boolean;
  currentUseAllowed: boolean;
}

const SOURCE_VERSION_TIMELINE_FIELDS: readonly (keyof SourceVersionTimelineEntry)[] = [
  "sourceId", "sourceVersionId", "versionSequence", "contentHash", "publishedAt", "effectiveFrom",
  "effectiveUntil", "supersedesVersionId", "supersededByVersionId", "transitionRuleIds", "reviewStatus",
  "freshnessStatus", "immutable", "historicalUseAllowed", "currentUseAllowed",
];

// ============================================================================
// HISTORICAL QUERY SUPPORT
// ============================================================================

const HISTORICAL_QUERY_EXAMPLES: readonly string[] = [
  "What rule applied on 1 January 2025?",
  "Was this deadline rule already effective when the letter was served?",
  "Which authority was competent before a reorganization?",
  "Which fee applied when the application was filed?",
];

const HISTORICAL_QUERY_EVALUATION_INPUTS: readonly string[] = [
  "the relevant legal event date", "the source version effective on that date",
  "the authority competence effective on that date", "applicable transitional rules",
  "jurisdiction applicable at that time",
];

/** Historical questions must never be answered using only the current version. */
const HISTORICAL_QUESTION_MAY_USE_ONLY_CURRENT_VERSION = false as const;

// ============================================================================
// EVENT-DATE MODEL (17 event types)
// ============================================================================

type EventType =
  | "residence_change"
  | "application_submission"
  | "document_service"
  | "authority_decision"
  | "employment_start"
  | "employment_end"
  | "insurance_start"
  | "insurance_end"
  | "birth"
  | "marriage"
  | "separation"
  | "relocation"
  | "cross_border_move"
  | "tax_year"
  | "payment_due"
  | "appeal_filed"
  | "unknown_event";

const EVENT_TYPES: readonly EventType[] = [
  "residence_change", "application_submission", "document_service", "authority_decision",
  "employment_start", "employment_end", "insurance_start", "insurance_end", "birth", "marriage",
  "separation", "relocation", "cross_border_move", "tax_year", "payment_due", "appeal_filed", "unknown_event",
];

type DatePrecision = "exact_date" | "month_only" | "year_only" | "date_range" | "before_date" | "after_date" | "unknown";

const DATE_PRECISION_VALUES: readonly DatePrecision[] = [
  "exact_date", "month_only", "year_only", "date_range", "before_date", "after_date", "unknown",
];

export interface EventRecord {
  eventType: EventType;
  eventDate?: string;
  datePrecision: DatePrecision;
  dateSource?: string;
  dateVerified: boolean;
  timezone?: string;
  jurisdictionAtEvent?: JurisdictionLevel;
  uncertainty?: string;
}

const EVENT_RECORD_FIELDS: readonly (keyof EventRecord)[] = [
  "eventType", "eventDate", "datePrecision", "dateSource", "dateVerified", "timezone", "jurisdictionAtEvent", "uncertainty",
];

/** An exact deadline must never be calculated from month-only, year-only, or unknown service dates. */
const EXACT_DEADLINE_FROM_IMPRECISE_DATE_ALLOWED = false as const;

// ============================================================================
// TEMPORAL APPLICABILITY DECISION (11 outcomes)
// ============================================================================

type TemporalApplicabilityOutcome =
  | "applicable"
  | "applicable_with_transition"
  | "historically_applicable"
  | "not_yet_effective"
  | "no_longer_effective"
  | "date_precision_insufficient"
  | "event_date_missing"
  | "conflicting_dates"
  | "version_missing"
  | "review_required"
  | "blocked";

const TEMPORAL_APPLICABILITY_OUTCOMES: readonly TemporalApplicabilityOutcome[] = [
  "applicable", "applicable_with_transition", "historically_applicable", "not_yet_effective",
  "no_longer_effective", "date_precision_insufficient", "event_date_missing", "conflicting_dates",
  "version_missing", "review_required", "blocked",
];

export interface TemporalApplicabilityDecision {
  claimId: string;
  sourceVersionId?: string;
  eventDate?: string;
  queryDate?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  transitionRuleApplied?: string;
  datePrecision: DatePrecision;
  decision: TemporalApplicabilityOutcome;
  qualification?: string;
  blockedReason?: string;
  /** The trust/temporal decision is computed by this deterministic contract only. */
  overridableByModel: false;
}

const TEMPORAL_APPLICABILITY_DECISION_FIELDS: readonly (keyof TemporalApplicabilityDecision)[] = [
  "claimId", "sourceVersionId", "eventDate", "queryDate", "effectiveFrom", "effectiveUntil",
  "transitionRuleApplied", "datePrecision", "decision", "qualification", "blockedReason",
];

// ============================================================================
// REGIONAL OVERRIDES (10 types)
// ============================================================================

type RegionalOverrideType =
  | "land_override"
  | "kreis_override"
  | "municipal_override"
  | "authority_procedure_override"
  | "pilot_program_override"
  | "emergency_override"
  | "transitional_override"
  | "local_fee_override"
  | "local_form_override"
  | "local_submission_channel_override";

const REGIONAL_OVERRIDE_TYPES: readonly RegionalOverrideType[] = [
  "land_override", "kreis_override", "municipal_override", "authority_procedure_override",
  "pilot_program_override", "emergency_override", "transitional_override", "local_fee_override",
  "local_form_override", "local_submission_channel_override",
];

export interface RegionalOverride {
  overrideType: RegionalOverrideType;
  baseRuleId: string;
  overrideRuleId: string;
  scope: RuleScopeType;
  effectiveFrom?: string;
  effectiveUntil?: string;
  authorityId?: string;
  sourceVersionId?: string;
  priorityContext?: string;
  conflictStatus: string;
  reviewStatus: ReviewStatusLike;
}

const REGIONAL_OVERRIDE_FIELDS: readonly (keyof RegionalOverride)[] = [
  "baseRuleId", "overrideRuleId", "scope", "effectiveFrom", "effectiveUntil", "authorityId",
  "sourceVersionId", "priorityContext", "conflictStatus", "reviewStatus",
];

/** Not every override changes substantive law — many change only operational detail. */
const OVERRIDE_ONLY_CHANGES_TYPES: readonly string[] = [
  "submission channel", "office", "appointment method", "local form", "fee", "processing sequence",
];
const EVERY_OVERRIDE_CHANGES_SUBSTANTIVE_LAW = false as const;

type OverrideResolutionOutcome =
  | "no_override"
  | "override_applies"
  | "multiple_overrides_apply"
  | "override_conflict"
  | "override_expired"
  | "override_not_yet_effective"
  | "override_scope_mismatch"
  | "unresolved";

const OVERRIDE_RESOLUTION_OUTCOMES: readonly OverrideResolutionOutcome[] = [
  "no_override", "override_applies", "multiple_overrides_apply", "override_conflict",
  "override_expired", "override_not_yet_effective", "override_scope_mismatch", "unresolved",
];

/** A local override may supplement a federal rule without replacing it. */
const LOCAL_OVERRIDE_MAY_SUPPLEMENT_WITHOUT_REPLACING = true as const;

// ============================================================================
// TEMPORAL CONFLICT MODEL (10)
// ============================================================================

type TemporalConflictType =
  | "source_versions_overlap"
  | "source_versions_gap"
  | "effective_date_conflict"
  | "publication_effective_mismatch"
  | "transitional_rule_conflict"
  | "authority_competence_period_conflict"
  | "regional_override_period_conflict"
  | "historical_record_incomplete"
  | "current_page_historical_rule_conflict"
  | "unresolved_temporal_conflict";

const TEMPORAL_CONFLICT_TYPES: readonly TemporalConflictType[] = [
  "source_versions_overlap", "source_versions_gap", "effective_date_conflict", "publication_effective_mismatch",
  "transitional_rule_conflict", "authority_competence_period_conflict", "regional_override_period_conflict",
  "historical_record_incomplete", "current_page_historical_rule_conflict", "unresolved_temporal_conflict",
];

/** High-risk output must be blocked when temporal conflict is unresolved. */
const HIGH_RISK_OUTPUT_ALLOWED_WITH_UNRESOLVED_TEMPORAL_CONFLICT = false as const;

// ============================================================================
// JURISDICTION CONFLICT MODEL (10) — subject matter and competence control
// ============================================================================

type JurisdictionConflictType =
  | "federal_vs_land"
  | "land_vs_municipality"
  | "municipality_vs_authority"
  | "territorial_scope_overlap"
  | "authority_service_area_overlap"
  | "cross_border_competence_conflict"
  | "residence_vs_employment_jurisdiction"
  | "tax_vs_social_insurance_jurisdiction"
  | "issuer_vs_receiver_authority_conflict"
  | "unresolved_jurisdiction_conflict";

const JURISDICTION_CONFLICT_TYPES: readonly JurisdictionConflictType[] = [
  "federal_vs_land", "land_vs_municipality", "municipality_vs_authority", "territorial_scope_overlap",
  "authority_service_area_overlap", "cross_border_competence_conflict", "residence_vs_employment_jurisdiction",
  "tax_vs_social_insurance_jurisdiction", "issuer_vs_receiver_authority_conflict", "unresolved_jurisdiction_conflict",
];

const EVERY_CONFLICT_RESOLVED_BY_NAIVE_HIERARCHY = false as const;

// ============================================================================
// MULTI-JURISDICTION CASES
// ============================================================================

const MULTI_JURISDICTION_CASE_EXAMPLES: readonly string[] = [
  "EU + DE", "DE + SK", "DE + CZ", "DE + PL", "DE + HU", "EU + DE + one V4 country",
  "more than one connected foreign country", "historical country change",
  "work in one country and residence in another", "family members in different countries",
];

export interface MultiJurisdictionContext {
  primaryMarket?: "DE";
  trustDomainsRequired: readonly string[];
  jurisdictionsInvolved: readonly JurisdictionLevel[];
  connectedCountries: readonly string[];
  competentStateStatus: string;
  priorityRuleStatus?: string;
  responsibleActorStatus: string;
  authorityResolutionStatus: AuthorityResolutionOutcome;
  evidenceCompleteness: string;
  effectiveDateAlignment: CrossBorderTemporalAlignmentState;
  conflictStatus: string;
  allowedOutputUse: readonly AllowedUse[];
}

const MULTI_JURISDICTION_CONTEXT_FIELDS: readonly (keyof MultiJurisdictionContext)[] = [
  "primaryMarket", "trustDomainsRequired", "jurisdictionsInvolved", "connectedCountries",
  "competentStateStatus", "priorityRuleStatus", "responsibleActorStatus", "authorityResolutionStatus",
  "evidenceCompleteness", "effectiveDateAlignment", "conflictStatus", "allowedOutputUse",
];

/** DE is never assumed the competent state merely because Birello's market is Germany. */
const DE_ASSUMED_COMPETENT_STATE_MERELY_BECAUSE_MARKET_IS_DE = false as const;

// ============================================================================
// CROSS-BORDER TEMPORAL ALIGNMENT (8 states)
// ============================================================================

type CrossBorderTemporalAlignmentState =
  | "aligned"
  | "aligned_with_transition"
  | "german_version_missing"
  | "foreign_version_missing"
  | "eu_version_missing"
  | "authority_period_mismatch"
  | "conflicting_effective_periods"
  | "unresolved";

const CROSS_BORDER_TEMPORAL_ALIGNMENT_STATES: readonly CrossBorderTemporalAlignmentState[] = [
  "aligned", "aligned_with_transition", "german_version_missing", "foreign_version_missing",
  "eu_version_missing", "authority_period_mismatch", "conflicting_effective_periods", "unresolved",
];

const CROSS_BORDER_TEMPORAL_REQUIREMENTS: readonly string[] = [
  "EU rule effective on the event date", "German procedure effective on the event date",
  "foreign procedure effective on the event date", "authority competence effective on the event date",
  "aligned or explicitly reconciled version timelines",
];

/** Concrete cross-border instruction is blocked unless timelines are sufficiently aligned. */
const CROSS_BORDER_INSTRUCTION_ALLOWED_WITHOUT_ALIGNMENT = false as const;

// ============================================================================
// PERSON-SPECIFIC CONTEXT BOUNDARY
// ============================================================================

const PERSON_SPECIFIC_CONTEXT_FACTS: readonly string[] = [
  "residence", "employment", "insurance", "family residence", "citizenship where legally relevant",
  "permit type where legally relevant", "event date", "authority already involved",
];

const PERSON_SPECIFIC_CONTEXT_RULES: readonly string[] = [
  "Do not persist user facts in this phase.",
  "Do not infer protected or sensitive facts.",
  "Do not derive country from output locale.",
  "Do not require facts irrelevant to the process.",
  "Unresolved material facts must remain explicit.",
];

// ============================================================================
// JURISDICTION CLAIM DECISION
// ============================================================================

export interface JurisdictionClaimDecision {
  claimId: string;
  claimType: string;
  jurisdictionContext: JurisdictionContext;
  ruleScope: RuleScopeType;
  authorityCompetence: CompetenceResult;
  temporalApplicability: TemporalApplicabilityOutcome;
  regionalOverrideDecision: OverrideResolutionOutcome;
  crossBorderContext?: MultiJurisdictionContext;
  sourceVersionId?: string;
  effectiveDateStatus: EffectiveDateStatus;
  conflictStatus: string;
  allowedUse: readonly AllowedUse[];
  qualification?: string;
  blockedReasons: readonly string[];
  citationRequired: boolean;
  /** The trust/jurisdiction decision is computed by this deterministic contract only. */
  modelOverrideAllowed: false;
}

const JURISDICTION_CLAIM_DECISION_FIELDS: readonly (keyof JurisdictionClaimDecision)[] = [
  "claimId", "claimType", "jurisdictionContext", "ruleScope", "authorityCompetence", "temporalApplicability",
  "regionalOverrideDecision", "crossBorderContext", "sourceVersionId", "effectiveDateStatus", "conflictStatus",
  "allowedUse", "qualification", "blockedReasons", "citationRequired", "modelOverrideAllowed",
];

// ============================================================================
// ALLOWED USE (12)
// ============================================================================

type AllowedUse =
  | "general_orientation"
  | "terminology_explanation"
  | "jurisdiction_explanation"
  | "historical_explanation"
  | "authority_suggestion_with_qualification"
  | "procedural_guidance"
  | "safe_next_step"
  | "exact_authority_instruction"
  | "exact_deadline"
  | "eligibility_statement"
  | "legal_status_statement"
  | "cross_border_instruction";

const ALLOWED_USES: readonly AllowedUse[] = [
  "general_orientation", "terminology_explanation", "jurisdiction_explanation", "historical_explanation",
  "authority_suggestion_with_qualification", "procedural_guidance", "safe_next_step", "exact_authority_instruction",
  "exact_deadline", "eligibility_statement", "legal_status_statement", "cross_border_instruction",
];

// ============================================================================
// CONSERVATIVE FAILURE OUTPUT
// ============================================================================

const CONSERVATIVE_FAILURE_PHRASES: readonly string[] = [
  "This rule may depend on your federal state or municipality.",
  "The competent authority cannot yet be confirmed.",
  "The applicable version depends on the date of the event.",
  "The exact deadline cannot be calculated without the service date.",
  "A historical version may apply.",
  "The German and foreign timelines are not yet sufficiently aligned.",
];

const MISSING_CONTEXT_CONVERTED_TO_CERTAINTY = false as const;

// ============================================================================
// LANGUAGE SEPARATION
// ============================================================================

const TRUST_DOMAINS_CONCEPTUAL: readonly string[] = ["eu", "de", "sk", "cz", "pl", "hu"];

const LOCALE_JURISDICTION_SEPARATION_EXAMPLES: readonly string[] = [
  "Slovak output may concern Berlin only.",
  "German output may concern a DE<->PL case.",
  "English output may concern a DE<->HU case.",
  "Hungarian output does not automatically activate the HU trust domain.",
];

// ============================================================================
// KNOWN OPEN DEBTS (inherited)
// ============================================================================

const KNOWN_OPEN_DEBTS: readonly string[] = [
  "HEIC/HEIF support", "EXIF orientation normalization", "Decoded pixel bounds",
  "Serverless/Vercel OCR validation", "Physical Android camera-image validation",
  "Genuine iOS camera-image validation", "Distributed production rate limiter",
  "Standalone Smart Talk extraction from the DNA shell", "Final production payment flow",
  "German knowledge population (no real sources ingested by 9A, 9B, or 9C)",
  "V4 cross-border connector implementation, timelines, and localization parity",
];

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9C";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceTrustContractCheckId: string;
  sourceArchitectureReady: boolean;
  sourceTrustContractReady: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  databaseMigrationCreated: boolean;
  databaseWritePerformed: boolean;
  networkAccessPerformed: boolean;
  externalSourceDownloaded: boolean;
  realJurisdictionPopulated: boolean;
  realAuthorityRegistered: boolean;
  realTerritorialMappingPopulated: boolean;
  realEffectiveDateRecordPopulated: boolean;
  realSourceVersionIngested: boolean;
  realCrossBorderTimelinePopulated: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  jurisdictionLevelsDefined: boolean;
  territorialIdentifiersDefined: boolean;
  ruleScopeTypesDefined: boolean;
  jurisdictionContextDefined: boolean;
  localeSeparatedFromJurisdiction: boolean;
  userLocationSeparatedFromLegalJurisdiction: boolean;
  authorityCompetenceModelDefined: boolean;
  authorityResolutionDefined: boolean;
  temporalConceptsSeparated: boolean;
  effectiveDateStatusesDefined: boolean;
  sourceVersionTimelineDefined: boolean;
  historicalQuerySupportDefined: boolean;
  eventDateModelDefined: boolean;
  datePrecisionModelDefined: boolean;
  temporalApplicabilityDecisionDefined: boolean;
  regionalOverrideModelDefined: boolean;
  overrideResolutionDefined: boolean;
  temporalConflictModelDefined: boolean;
  jurisdictionConflictModelDefined: boolean;
  multiJurisdictionModelDefined: boolean;
  crossBorderTemporalAlignmentDefined: boolean;
  personSpecificContextBoundaryDefined: boolean;
  jurisdictionClaimDecisionDefined: boolean;
  allowedUseMatrixDefined: boolean;
  conservativeFailureOutputDefined: boolean;

  historicalVersionsImmutable: boolean;
  currentVersionCannotOverwriteHistoricalVersion: boolean;
  retrievedAtSeparatedFromEffectiveFrom: boolean;
  publishedAtSeparatedFromEffectiveFrom: boolean;
  localRuleCannotBecomeNational: boolean;
  landRuleCannotBecomeFederal: boolean;
  authorityProximityDoesNotProveCompetence: boolean;
  outputLocaleCannotDetermineJurisdiction: boolean;
  modelCannotOverrideJurisdictionDecision: boolean;
  exactDeadlineBlockedWithoutSufficientDatePrecision: boolean;
  historicalQuestionUsesHistoricalVersion: boolean;
  crossBorderInstructionRequiresTemporalAlignment: boolean;

  sixLaunchLocalesRecorded: boolean;
  euDeSkCzPlHuDomainsSupportedConceptually: boolean;

  zeroRealJurisdictionsPopulated: boolean;
  zeroRealAuthoritiesRegistered: boolean;
  zeroRealTemporalRecordsPopulated: boolean;
  zeroRealCrossBorderTimelinesPopulated: boolean;

  standaloneExtractionStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;
  v4LocalizationParityStillOpen: boolean;
  germanKnowledgePopulationStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForMinimumGermanProcessCoveragePlan: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  nationalityAloneDeterminesJurisdictionAccepted: boolean;
  currentLocationDeterminesEveryCompetenceAccepted: boolean;
  residenceEqualsTaxResidenceAutomaticallyAccepted: boolean;
  employmentLocationEqualsInsuranceStateAutomaticallyAccepted: boolean;
  documentIssuerDeterminesReceivingAuthorityAccepted: boolean;
  nearestAuthorityTreatedAsCompetentAccepted: boolean;
  officialAuthorityTreatedAsCompetentForEveryTopicAccepted: boolean;
  informationOnlyAuthorityTreatedAsDecisionAuthorityAccepted: boolean;
  forwardingOfficeTreatedAsDecidingAuthorityAccepted: boolean;
  overlappingCompetenceIgnoredAccepted: boolean;
  changedCompetenceIgnoredAccepted: boolean;
  competenceUnknownInstructionIssuedAccepted: boolean;
  universalAdministrativeLevelAssumedAccepted: boolean;
  regierungsbezirkAssumedInEveryLandAccepted: boolean;
  municipalityRuleTreatedAsFederalAccepted: boolean;
  landRuleTreatedAsNationwideAccepted: boolean;
  authorityProcedureTreatedAsNationalAccepted: boolean;
  postalCodeAssignmentTreatedAsSubstantiveLawAccepted: boolean;
  serviceAreaTreatedAsNationalJurisdictionAccepted: boolean;
  localFeeGeneralizedNationallyAccepted: boolean;
  localFormGeneralizedNationallyAccepted: boolean;
  pilotRuleGeneralizedPermanentlyAccepted: boolean;
  overrideReplacesBaseLawWithoutEvidenceAccepted: boolean;
  overrideIgnoredAccepted: boolean;
  overrideConflictIgnoredAccepted: boolean;
  expiredOverrideUsedAccepted: boolean;
  futureOverrideUsedAsCurrentAccepted: boolean;
  sourceLastModifiedAtTreatedAsLegalEffectAccepted: boolean;
  adoptedRuleTreatedAsEffectiveAccepted: boolean;
  repealedRuleTreatedAsCurrentAccepted: boolean;
  expiredRuleTreatedAsCurrentAccepted: boolean;
  suspendedRuleTreatedAsCurrentAccepted: boolean;
  effectiveDateUnknownDefinitiveClaimAllowedAccepted: boolean;
  applicabilityDateUnknownDefinitiveClaimAllowedAccepted: boolean;
  conflictingEffectiveDatesIgnoredAccepted: boolean;
  sourceVersionGapIgnoredAccepted: boolean;
  historicalVersionDeletedAccepted: boolean;
  authorityReorganizationIgnoredForHistoricalCaseAccepted: boolean;
  historicalFeeAnsweredFromCurrentFeeAccepted: boolean;
  transitionRuleIgnoredAccepted: boolean;
  transitionalConflictIgnoredAccepted: boolean;
  monthOnlyDateUsedForExactDeadlineAccepted: boolean;
  yearOnlyDateUsedForExactDeadlineAccepted: boolean;
  unknownServiceDateUsedForExactDeadlineAccepted: boolean;
  dateRangeCollapsedToExactDateAccepted: boolean;
  timezoneIgnoredWhereLegallyMaterialAccepted: boolean;
  eventDateMissingTemporalClaimAllowedAccepted: boolean;
  filingDateConfusedWithServiceDateAccepted: boolean;
  decisionDateConfusedWithAppealFilingDateAccepted: boolean;
  userQuestionDateUsedAsLegalEventDateAccepted: boolean;
  eventTypeUnresolvedExactRuleChosenAccepted: boolean;
  dateSourceUnverifiedTreatedAsCertainAccepted: boolean;
  temporalOverlapConflictIgnoredAccepted: boolean;
  temporalGapConflictIgnoredAccepted: boolean;
  publicationEffectMismatchIgnoredAccepted: boolean;
  competencePeriodConflictIgnoredAccepted: boolean;
  overridePeriodConflictIgnoredAccepted: boolean;
  currentPageUsedAsProofOfHistoricalRuleAccepted: boolean;
  federalVsLandConflictResolvedByNaiveRankingAccepted: boolean;
  landVsMunicipalityConflictIgnoredAccepted: boolean;
  authorityServiceAreaOverlapIgnoredAccepted: boolean;
  residenceVsEmploymentJurisdictionConflictIgnoredAccepted: boolean;
  taxVsInsuranceJurisdictionConflictIgnoredAccepted: boolean;
  issuerVsReceiverConflictIgnoredAccepted: boolean;
  crossBorderCompetenceConflictIgnoredAccepted: boolean;
  deAssumedCompetentStateAutomaticallyAccepted: boolean;
  uiLanguageActivatesForeignTrustDomainAccepted: boolean;
  slovakLocaleActivatesSkConnectorAccepted: boolean;
  hungarianLocaleActivatesHuConnectorAccepted: boolean;
  englishLocaleDisablesCrossBorderContextAccepted: boolean;
  germanLocaleForcesDeOnlyCaseAccepted: boolean;
  euRuleAloneEstablishesGermanLocalProcedureAccepted: boolean;
  germanSourceAloneEstablishesForeignProcedureAccepted: boolean;
  foreignSourceAloneEstablishesGermanProcedureAccepted: boolean;
  euVersionMissingInstructionIssuedAccepted: boolean;
  germanVersionMissingInstructionIssuedAccepted: boolean;
  foreignVersionMissingInstructionIssuedAccepted: boolean;
  authorityPeriodMismatchIgnoredAccepted: boolean;
  conflictingCrossBorderEffectivePeriodsIgnoredAccepted: boolean;
  multipleConnectedCountriesCollapsedToOneAccepted: boolean;
  workStateResidenceStateDistinctionIgnoredAccepted: boolean;
  familyResidenceInAnotherCountryIgnoredAccepted: boolean;
  materialPersonalFactGuessedAccepted: boolean;
  irrelevantSensitiveFactRequestedAccepted: boolean;
  unresolvedMaterialFactHiddenAccepted: boolean;
  blockedJurisdictionClaimShownAsFactAccepted: boolean;
  qualifiedAuthoritySuggestionShownAsCertaintyAccepted: boolean;
  orientationUpgradedToExactInstructionAccepted: boolean;
  citationOmittedFromDateSensitiveClaimAccepted: boolean;
  currentSourceUsedOutsideTerritorialScopeAccepted: boolean;
  authoritySourceUsedOutsideCompetencePeriodAccepted: boolean;
  localPageUsedOutsideServiceAreaAccepted: boolean;
  historicalSourceUsedForCurrentClaimAccepted: boolean;
  currentSourceUsedForPreEffectiveEventAccepted: boolean;
  exactAuthorityInstructionAllowedWithUnresolvedCompetenceAccepted: boolean;
  exactLegalStatusAllowedWithUnresolvedJurisdictionAccepted: boolean;
  germanKnowledgeClaimedPopulatedAccepted: boolean;
  v4TimelinesClaimedPopulatedAccepted: boolean;
  sixLanguagesClaimedProductionReadyAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  jurisdictionLevels: readonly JurisdictionLevel[];
  administrativeLevelPresenceStates: readonly AdministrativeLevelPresence[];
  territorialIdentifierFields: readonly string[];
  ruleScopeTypes: readonly RuleScopeType[];
  preventedScopeGeneralizations: readonly string[];
  jurisdictionContextFields: readonly string[];
  userLocationVsLegalJurisdictionConcepts: readonly string[];
  authorityCompetenceDimensionFields: readonly string[];
  competenceResults: readonly CompetenceResult[];
  authorityResolutionInputs: readonly string[];
  authorityResolutionOutcomes: readonly AuthorityResolutionOutcome[];
  temporalConcepts: readonly string[];
  effectiveDateStatuses: readonly EffectiveDateStatus[];
  sourceVersionTimelineFields: readonly string[];
  historicalQueryExamples: readonly string[];
  historicalQueryEvaluationInputs: readonly string[];
  eventTypes: readonly EventType[];
  eventRecordFields: readonly string[];
  datePrecisionValues: readonly DatePrecision[];
  temporalApplicabilityOutcomes: readonly TemporalApplicabilityOutcome[];
  temporalApplicabilityDecisionFields: readonly string[];
  regionalOverrideTypes: readonly RegionalOverrideType[];
  regionalOverrideFields: readonly string[];
  overrideOnlyChangesTypes: readonly string[];
  overrideResolutionOutcomes: readonly OverrideResolutionOutcome[];
  temporalConflictTypes: readonly TemporalConflictType[];
  jurisdictionConflictTypes: readonly JurisdictionConflictType[];
  multiJurisdictionCaseExamples: readonly string[];
  multiJurisdictionContextFields: readonly string[];
  crossBorderTemporalAlignmentStates: readonly CrossBorderTemporalAlignmentState[];
  crossBorderTemporalRequirements: readonly string[];
  personSpecificContextFacts: readonly string[];
  personSpecificContextRules: readonly string[];
  jurisdictionClaimDecisionFields: readonly string[];
  allowedUses: readonly AllowedUse[];
  conservativeFailurePhrases: readonly string[];
  trustDomainsConceptual: readonly string[];
  localeJurisdictionSeparationExamples: readonly string[];
  knownOpenDebts: readonly string[];
  sourceEvidence: string[];
  notes: string[];
}

// ─── Tamper harness ─────────────────────────────────────────────────────────

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "source closure commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 2, description: "PHASE 9A missing", mutate: (r) => { r.sourceArchitectureCheckId = "missing"; } },
  { id: 3, description: "PHASE 9B missing", mutate: (r) => { r.sourceTrustContractCheckId = "missing"; } },
  { id: 4, description: "architecture not ready", mutate: (r) => { r.sourceArchitectureReady = false; } },
  { id: 5, description: "trust contract not ready", mutate: (r) => { r.sourceTrustContractReady = false; } },
  { id: 6, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 7, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 8, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 9, description: "database migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 10, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 11, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 12, description: "real jurisdiction populated", mutate: (r) => { r.realJurisdictionPopulated = true; } },
  { id: 13, description: "real authority registered", mutate: (r) => { r.realAuthorityRegistered = true; } },
  { id: 14, description: "territorial mapping populated", mutate: (r) => { r.realTerritorialMappingPopulated = true; } },
  { id: 15, description: "effective-date record populated", mutate: (r) => { r.realEffectiveDateRecordPopulated = true; } },
  { id: 16, description: "source version ingested", mutate: (r) => { r.realSourceVersionIngested = true; } },
  { id: 17, description: "cross-border timeline populated", mutate: (r) => { r.realCrossBorderTimelinePopulated = true; } },
  { id: 18, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 19, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 20, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 21, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 22, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 23, description: "locale determines jurisdiction", mutate: (r) => { r.localeSeparatedFromJurisdiction = false; } },
  { id: 24, description: "nationality alone determines jurisdiction", mutate: (r) => { r.nationalityAloneDeterminesJurisdictionAccepted = true; } },
  { id: 25, description: "current location determines every legal competence", mutate: (r) => { r.currentLocationDeterminesEveryCompetenceAccepted = true; } },
  { id: 26, description: "registered residence equals tax residence automatically", mutate: (r) => { r.residenceEqualsTaxResidenceAutomaticallyAccepted = true; } },
  { id: 27, description: "employment location equals insurance state automatically", mutate: (r) => { r.employmentLocationEqualsInsuranceStateAutomaticallyAccepted = true; } },
  { id: 28, description: "document issuer determines receiving authority automatically", mutate: (r) => { r.documentIssuerDeterminesReceivingAuthorityAccepted = true; } },
  { id: 29, description: "nearest authority treated as competent", mutate: (r) => { r.nearestAuthorityTreatedAsCompetentAccepted = true; } },
  { id: 30, description: "official authority treated as competent for every topic", mutate: (r) => { r.officialAuthorityTreatedAsCompetentForEveryTopicAccepted = true; } },
  { id: 31, description: "information-only authority treated as decision authority", mutate: (r) => { r.informationOnlyAuthorityTreatedAsDecisionAuthorityAccepted = true; } },
  { id: 32, description: "forwarding office treated as deciding authority", mutate: (r) => { r.forwardingOfficeTreatedAsDecidingAuthorityAccepted = true; } },
  { id: 33, description: "overlapping competence ignored", mutate: (r) => { r.overlappingCompetenceIgnoredAccepted = true; } },
  { id: 34, description: "changed competence ignored", mutate: (r) => { r.changedCompetenceIgnoredAccepted = true; } },
  { id: 35, description: "competence unknown but instruction issued", mutate: (r) => { r.competenceUnknownInstructionIssuedAccepted = true; } },
  { id: 36, description: "one universal German administrative level assumed", mutate: (r) => { r.universalAdministrativeLevelAssumedAccepted = true; } },
  { id: 37, description: "Regierungsbezirk assumed in every Land", mutate: (r) => { r.regierungsbezirkAssumedInEveryLandAccepted = true; } },
  { id: 38, description: "municipality rule treated as federal", mutate: (r) => { r.municipalityRuleTreatedAsFederalAccepted = true; } },
  { id: 39, description: "Land rule treated as nationwide", mutate: (r) => { r.landRuleTreatedAsNationwideAccepted = true; } },
  { id: 40, description: "authority procedure treated as national procedure", mutate: (r) => { r.authorityProcedureTreatedAsNationalAccepted = true; } },
  { id: 41, description: "postal code assignment treated as substantive law", mutate: (r) => { r.postalCodeAssignmentTreatedAsSubstantiveLawAccepted = true; } },
  { id: 42, description: "service area treated as national jurisdiction", mutate: (r) => { r.serviceAreaTreatedAsNationalJurisdictionAccepted = true; } },
  { id: 43, description: "local fee generalized nationally", mutate: (r) => { r.localFeeGeneralizedNationallyAccepted = true; } },
  { id: 44, description: "local form generalized nationally", mutate: (r) => { r.localFormGeneralizedNationallyAccepted = true; } },
  { id: 45, description: "pilot rule generalized permanently", mutate: (r) => { r.pilotRuleGeneralizedPermanentlyAccepted = true; } },
  { id: 46, description: "override replaces base law without evidence", mutate: (r) => { r.overrideReplacesBaseLawWithoutEvidenceAccepted = true; } },
  { id: 47, description: "override ignored", mutate: (r) => { r.overrideIgnoredAccepted = true; } },
  { id: 48, description: "override conflict ignored", mutate: (r) => { r.overrideConflictIgnoredAccepted = true; } },
  { id: 49, description: "expired override used", mutate: (r) => { r.expiredOverrideUsedAccepted = true; } },
  { id: 50, description: "future override used as current", mutate: (r) => { r.futureOverrideUsedAsCurrentAccepted = true; } },
  { id: 51, description: "publishedAt treated as effectiveFrom", mutate: (r) => { r.publishedAtSeparatedFromEffectiveFrom = false; } },
  { id: 52, description: "retrievedAt treated as effectiveFrom", mutate: (r) => { r.retrievedAtSeparatedFromEffectiveFrom = false; } },
  { id: 53, description: "sourceLastModifiedAt treated as legal effect", mutate: (r) => { r.sourceLastModifiedAtTreatedAsLegalEffectAccepted = true; } },
  { id: 54, description: "adopted rule treated as effective", mutate: (r) => { r.adoptedRuleTreatedAsEffectiveAccepted = true; } },
  { id: 55, description: "repealed rule treated as current", mutate: (r) => { r.repealedRuleTreatedAsCurrentAccepted = true; } },
  { id: 56, description: "expired rule treated as current", mutate: (r) => { r.expiredRuleTreatedAsCurrentAccepted = true; } },
  { id: 57, description: "suspended rule treated as current", mutate: (r) => { r.suspendedRuleTreatedAsCurrentAccepted = true; } },
  { id: 58, description: "effective date unknown but definitive claim allowed", mutate: (r) => { r.effectiveDateUnknownDefinitiveClaimAllowedAccepted = true; } },
  { id: 59, description: "applicability date unknown but definitive claim allowed", mutate: (r) => { r.applicabilityDateUnknownDefinitiveClaimAllowedAccepted = true; } },
  { id: 60, description: "conflicting effective dates ignored", mutate: (r) => { r.conflictingEffectiveDatesIgnoredAccepted = true; } },
  { id: 61, description: "source version gap ignored", mutate: (r) => { r.sourceVersionGapIgnoredAccepted = true; } },
  { id: 62, description: "current version overwrites historical version", mutate: (r) => { r.currentVersionCannotOverwriteHistoricalVersion = false; } },
  { id: 63, description: "historical version deleted", mutate: (r) => { r.historicalVersionDeletedAccepted = true; } },
  { id: 64, description: "historical question answered with current version only", mutate: (r) => { r.historicalQuestionUsesHistoricalVersion = false; } },
  { id: 65, description: "authority reorganization ignored for historical case", mutate: (r) => { r.authorityReorganizationIgnoredForHistoricalCaseAccepted = true; } },
  { id: 66, description: "historical fee answered from current fee", mutate: (r) => { r.historicalFeeAnsweredFromCurrentFeeAccepted = true; } },
  { id: 67, description: "transition rule ignored", mutate: (r) => { r.transitionRuleIgnoredAccepted = true; } },
  { id: 68, description: "transitional conflict ignored", mutate: (r) => { r.transitionalConflictIgnoredAccepted = true; } },
  { id: 69, description: "month-only date used for exact deadline", mutate: (r) => { r.monthOnlyDateUsedForExactDeadlineAccepted = true; } },
  { id: 70, description: "year-only date used for exact deadline", mutate: (r) => { r.yearOnlyDateUsedForExactDeadlineAccepted = true; } },
  { id: 71, description: "unknown service date used for exact deadline", mutate: (r) => { r.unknownServiceDateUsedForExactDeadlineAccepted = true; } },
  { id: 72, description: "date range collapsed to exact date", mutate: (r) => { r.dateRangeCollapsedToExactDateAccepted = true; } },
  { id: 73, description: "timezone ignored where legally material", mutate: (r) => { r.timezoneIgnoredWhereLegallyMaterialAccepted = true; } },
  { id: 74, description: "event date missing but temporal claim allowed", mutate: (r) => { r.eventDateMissingTemporalClaimAllowedAccepted = true; } },
  { id: 75, description: "filing date confused with service date", mutate: (r) => { r.filingDateConfusedWithServiceDateAccepted = true; } },
  { id: 76, description: "decision date confused with appeal filing date", mutate: (r) => { r.decisionDateConfusedWithAppealFilingDateAccepted = true; } },
  { id: 77, description: "user-question date used as legal event date", mutate: (r) => { r.userQuestionDateUsedAsLegalEventDateAccepted = true; } },
  { id: 78, description: "event type unresolved but exact rule chosen", mutate: (r) => { r.eventTypeUnresolvedExactRuleChosenAccepted = true; } },
  { id: 79, description: "date source unverified but treated as certain", mutate: (r) => { r.dateSourceUnverifiedTreatedAsCertainAccepted = true; } },
  { id: 80, description: "temporal overlap conflict ignored", mutate: (r) => { r.temporalOverlapConflictIgnoredAccepted = true; } },
  { id: 81, description: "temporal gap conflict ignored", mutate: (r) => { r.temporalGapConflictIgnoredAccepted = true; } },
  { id: 82, description: "publication/effect mismatch ignored", mutate: (r) => { r.publicationEffectMismatchIgnoredAccepted = true; } },
  { id: 83, description: "competence-period conflict ignored", mutate: (r) => { r.competencePeriodConflictIgnoredAccepted = true; } },
  { id: 84, description: "override-period conflict ignored", mutate: (r) => { r.overridePeriodConflictIgnoredAccepted = true; } },
  { id: 85, description: "current page used as proof of historical rule", mutate: (r) => { r.currentPageUsedAsProofOfHistoricalRuleAccepted = true; } },
  { id: 86, description: "federal-vs-Land conflict resolved by naive ranking", mutate: (r) => { r.federalVsLandConflictResolvedByNaiveRankingAccepted = true; } },
  { id: 87, description: "Land-vs-municipality conflict ignored", mutate: (r) => { r.landVsMunicipalityConflictIgnoredAccepted = true; } },
  { id: 88, description: "authority service-area overlap ignored", mutate: (r) => { r.authorityServiceAreaOverlapIgnoredAccepted = true; } },
  { id: 89, description: "residence-vs-employment jurisdiction conflict ignored", mutate: (r) => { r.residenceVsEmploymentJurisdictionConflictIgnoredAccepted = true; } },
  { id: 90, description: "tax-vs-insurance jurisdiction conflict ignored", mutate: (r) => { r.taxVsInsuranceJurisdictionConflictIgnoredAccepted = true; } },
  { id: 91, description: "issuer-vs-receiver conflict ignored", mutate: (r) => { r.issuerVsReceiverConflictIgnoredAccepted = true; } },
  { id: 92, description: "cross-border competence conflict ignored", mutate: (r) => { r.crossBorderCompetenceConflictIgnoredAccepted = true; } },
  { id: 93, description: "DE assumed competent state automatically", mutate: (r) => { r.deAssumedCompetentStateAutomaticallyAccepted = true; } },
  { id: 94, description: "UI language activates foreign trust domain", mutate: (r) => { r.uiLanguageActivatesForeignTrustDomainAccepted = true; } },
  { id: 95, description: "Slovak locale activates SK connector", mutate: (r) => { r.slovakLocaleActivatesSkConnectorAccepted = true; } },
  { id: 96, description: "Hungarian locale activates HU connector", mutate: (r) => { r.hungarianLocaleActivatesHuConnectorAccepted = true; } },
  { id: 97, description: "English locale disables cross-border context", mutate: (r) => { r.englishLocaleDisablesCrossBorderContextAccepted = true; } },
  { id: 98, description: "German locale forces DE-only case", mutate: (r) => { r.germanLocaleForcesDeOnlyCaseAccepted = true; } },
  { id: 99, description: "EU rule alone establishes German local procedure", mutate: (r) => { r.euRuleAloneEstablishesGermanLocalProcedureAccepted = true; } },
  { id: 100, description: "German source alone establishes foreign procedure", mutate: (r) => { r.germanSourceAloneEstablishesForeignProcedureAccepted = true; } },
  { id: 101, description: "foreign source alone establishes German procedure", mutate: (r) => { r.foreignSourceAloneEstablishesGermanProcedureAccepted = true; } },
  { id: 102, description: "cross-border instruction issued without aligned timelines", mutate: (r) => { r.crossBorderInstructionRequiresTemporalAlignment = false; } },
  { id: 103, description: "EU version missing but instruction issued", mutate: (r) => { r.euVersionMissingInstructionIssuedAccepted = true; } },
  { id: 104, description: "German version missing but instruction issued", mutate: (r) => { r.germanVersionMissingInstructionIssuedAccepted = true; } },
  { id: 105, description: "foreign version missing but instruction issued", mutate: (r) => { r.foreignVersionMissingInstructionIssuedAccepted = true; } },
  { id: 106, description: "authority period mismatch ignored", mutate: (r) => { r.authorityPeriodMismatchIgnoredAccepted = true; } },
  { id: 107, description: "conflicting cross-border effective periods ignored", mutate: (r) => { r.conflictingCrossBorderEffectivePeriodsIgnoredAccepted = true; } },
  { id: 108, description: "multiple connected countries collapsed to one", mutate: (r) => { r.multipleConnectedCountriesCollapsedToOneAccepted = true; } },
  { id: 109, description: "work-state and residence-state distinction ignored", mutate: (r) => { r.workStateResidenceStateDistinctionIgnoredAccepted = true; } },
  { id: 110, description: "family residence in another country ignored", mutate: (r) => { r.familyResidenceInAnotherCountryIgnoredAccepted = true; } },
  { id: 111, description: "material personal fact guessed", mutate: (r) => { r.materialPersonalFactGuessedAccepted = true; } },
  { id: 112, description: "irrelevant sensitive fact requested", mutate: (r) => { r.irrelevantSensitiveFactRequestedAccepted = true; } },
  { id: 113, description: "unresolved material fact hidden", mutate: (r) => { r.unresolvedMaterialFactHiddenAccepted = true; } },
  { id: 114, description: "blocked jurisdiction claim shown as fact", mutate: (r) => { r.blockedJurisdictionClaimShownAsFactAccepted = true; } },
  { id: 115, description: "qualified authority suggestion shown as certainty", mutate: (r) => { r.qualifiedAuthoritySuggestionShownAsCertaintyAccepted = true; } },
  { id: 116, description: "orientation upgraded to exact instruction", mutate: (r) => { r.orientationUpgradedToExactInstructionAccepted = true; } },
  { id: 117, description: "model overrides deterministic jurisdiction decision", mutate: (r) => { r.modelCannotOverrideJurisdictionDecision = false; } },
  { id: 118, description: "citation omitted from date-sensitive claim", mutate: (r) => { r.citationOmittedFromDateSensitiveClaimAccepted = true; } },
  { id: 119, description: "current source used outside territorial scope", mutate: (r) => { r.currentSourceUsedOutsideTerritorialScopeAccepted = true; } },
  { id: 120, description: "authority source used outside competence period", mutate: (r) => { r.authoritySourceUsedOutsideCompetencePeriodAccepted = true; } },
  { id: 121, description: "local page used outside service area", mutate: (r) => { r.localPageUsedOutsideServiceAreaAccepted = true; } },
  { id: 122, description: "historical source used for current claim", mutate: (r) => { r.historicalSourceUsedForCurrentClaimAccepted = true; } },
  { id: 123, description: "current source used for pre-effective event", mutate: (r) => { r.currentSourceUsedForPreEffectiveEventAccepted = true; } },
  { id: 124, description: "exact deadline allowed without sufficient precision", mutate: (r) => { r.exactDeadlineBlockedWithoutSufficientDatePrecision = false; } },
  { id: 125, description: "exact authority instruction allowed with unresolved competence", mutate: (r) => { r.exactAuthorityInstructionAllowedWithUnresolvedCompetenceAccepted = true; } },
  { id: 126, description: "exact legal status allowed with unresolved jurisdiction", mutate: (r) => { r.exactLegalStatusAllowedWithUnresolvedJurisdictionAccepted = true; } },
  { id: 127, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 128, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 129, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 130, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 131, description: "German knowledge claimed populated", mutate: (r) => { r.germanKnowledgeClaimedPopulatedAccepted = true; r.germanKnowledgePopulationStillOpen = false; } },
  { id: 132, description: "V4 timelines claimed populated", mutate: (r) => { r.v4TimelinesClaimedPopulatedAccepted = true; r.v4LocalizationParityStillOpen = false; } },
  { id: 133, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguagesClaimedProductionReadyAccepted = true; } },
  { id: 134, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 135, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 136, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 137, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 138, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 139, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 140, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 141, description: "audit passes with an unexpected changed file", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 142, description: "audit passes if real data was populated", mutate: (r) => { r.zeroRealJurisdictionsPopulated = false; r.realJurisdictionPopulated = true; } },
  { id: 143, description: "audit passes if any temporal guard is weakened", mutate: (r) => { r.historicalVersionsImmutable = false; } },
  { id: 144, description: "audit passes if any jurisdiction guard is weakened", mutate: (r) => { r.localRuleCannotBecomeNational = false; } },
  { id: 145, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
  { id: 146, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9D"; } },
  { id: 147, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
];

function runTamperCases(good: Result): { total: number; rejected: number; failures: string[] } {
  let rejected = 0;
  const failures: string[] = [];
  for (const tc of TAMPER_CASES) {
    const mutated = clone(good);
    tc.mutate(mutated);
    const ok = computeExpectedAllPassed(mutated);
    if (ok === false) {
      rejected += 1;
    } else {
      failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9C",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceTrustContractCheckId === SOURCE_TRUST_CONTRACT_CHECK_ID,
    r.sourceArchitectureReady === true,
    r.sourceTrustContractReady === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.databaseMigrationCreated === false,
    r.databaseWritePerformed === false,
    r.networkAccessPerformed === false,
    r.externalSourceDownloaded === false,
    r.realJurisdictionPopulated === false,
    r.realAuthorityRegistered === false,
    r.realTerritorialMappingPopulated === false,
    r.realEffectiveDateRecordPopulated === false,
    r.realSourceVersionIngested === false,
    r.realCrossBorderTimelinePopulated === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,

    r.jurisdictionLevelsDefined === true,
    r.territorialIdentifiersDefined === true,
    r.ruleScopeTypesDefined === true,
    r.jurisdictionContextDefined === true,
    r.localeSeparatedFromJurisdiction === true,
    r.userLocationSeparatedFromLegalJurisdiction === true,
    r.authorityCompetenceModelDefined === true,
    r.authorityResolutionDefined === true,
    r.temporalConceptsSeparated === true,
    r.effectiveDateStatusesDefined === true,
    r.sourceVersionTimelineDefined === true,
    r.historicalQuerySupportDefined === true,
    r.eventDateModelDefined === true,
    r.datePrecisionModelDefined === true,
    r.temporalApplicabilityDecisionDefined === true,
    r.regionalOverrideModelDefined === true,
    r.overrideResolutionDefined === true,
    r.temporalConflictModelDefined === true,
    r.jurisdictionConflictModelDefined === true,
    r.multiJurisdictionModelDefined === true,
    r.crossBorderTemporalAlignmentDefined === true,
    r.personSpecificContextBoundaryDefined === true,
    r.jurisdictionClaimDecisionDefined === true,
    r.allowedUseMatrixDefined === true,
    r.conservativeFailureOutputDefined === true,

    r.historicalVersionsImmutable === true,
    r.currentVersionCannotOverwriteHistoricalVersion === true,
    r.retrievedAtSeparatedFromEffectiveFrom === true,
    r.publishedAtSeparatedFromEffectiveFrom === true,
    r.localRuleCannotBecomeNational === true,
    r.landRuleCannotBecomeFederal === true,
    r.authorityProximityDoesNotProveCompetence === true,
    r.outputLocaleCannotDetermineJurisdiction === true,
    r.modelCannotOverrideJurisdictionDecision === true,
    r.exactDeadlineBlockedWithoutSufficientDatePrecision === true,
    r.historicalQuestionUsesHistoricalVersion === true,
    r.crossBorderInstructionRequiresTemporalAlignment === true,

    r.sixLaunchLocalesRecorded === true,
    r.euDeSkCzPlHuDomainsSupportedConceptually === true,

    r.zeroRealJurisdictionsPopulated === true,
    r.zeroRealAuthoritiesRegistered === true,
    r.zeroRealTemporalRecordsPopulated === true,
    r.zeroRealCrossBorderTimelinesPopulated === true,

    r.standaloneExtractionStillOpen === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.heicHeifStillOpen === true,
    r.serverlessOcrStillOpen === true,
    r.distributedRateLimiterStillOpen === true,
    r.paymentFlowStillOpen === true,
    r.v4LocalizationParityStillOpen === true,
    r.germanKnowledgePopulationStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.nationalityAloneDeterminesJurisdictionAccepted === false,
    r.currentLocationDeterminesEveryCompetenceAccepted === false,
    r.residenceEqualsTaxResidenceAutomaticallyAccepted === false,
    r.employmentLocationEqualsInsuranceStateAutomaticallyAccepted === false,
    r.documentIssuerDeterminesReceivingAuthorityAccepted === false,
    r.nearestAuthorityTreatedAsCompetentAccepted === false,
    r.officialAuthorityTreatedAsCompetentForEveryTopicAccepted === false,
    r.informationOnlyAuthorityTreatedAsDecisionAuthorityAccepted === false,
    r.forwardingOfficeTreatedAsDecidingAuthorityAccepted === false,
    r.overlappingCompetenceIgnoredAccepted === false,
    r.changedCompetenceIgnoredAccepted === false,
    r.competenceUnknownInstructionIssuedAccepted === false,
    r.universalAdministrativeLevelAssumedAccepted === false,
    r.regierungsbezirkAssumedInEveryLandAccepted === false,
    r.municipalityRuleTreatedAsFederalAccepted === false,
    r.landRuleTreatedAsNationwideAccepted === false,
    r.authorityProcedureTreatedAsNationalAccepted === false,
    r.postalCodeAssignmentTreatedAsSubstantiveLawAccepted === false,
    r.serviceAreaTreatedAsNationalJurisdictionAccepted === false,
    r.localFeeGeneralizedNationallyAccepted === false,
    r.localFormGeneralizedNationallyAccepted === false,
    r.pilotRuleGeneralizedPermanentlyAccepted === false,
    r.overrideReplacesBaseLawWithoutEvidenceAccepted === false,
    r.overrideIgnoredAccepted === false,
    r.overrideConflictIgnoredAccepted === false,
    r.expiredOverrideUsedAccepted === false,
    r.futureOverrideUsedAsCurrentAccepted === false,
    r.sourceLastModifiedAtTreatedAsLegalEffectAccepted === false,
    r.adoptedRuleTreatedAsEffectiveAccepted === false,
    r.repealedRuleTreatedAsCurrentAccepted === false,
    r.expiredRuleTreatedAsCurrentAccepted === false,
    r.suspendedRuleTreatedAsCurrentAccepted === false,
    r.effectiveDateUnknownDefinitiveClaimAllowedAccepted === false,
    r.applicabilityDateUnknownDefinitiveClaimAllowedAccepted === false,
    r.conflictingEffectiveDatesIgnoredAccepted === false,
    r.sourceVersionGapIgnoredAccepted === false,
    r.historicalVersionDeletedAccepted === false,
    r.authorityReorganizationIgnoredForHistoricalCaseAccepted === false,
    r.historicalFeeAnsweredFromCurrentFeeAccepted === false,
    r.transitionRuleIgnoredAccepted === false,
    r.transitionalConflictIgnoredAccepted === false,
    r.monthOnlyDateUsedForExactDeadlineAccepted === false,
    r.yearOnlyDateUsedForExactDeadlineAccepted === false,
    r.unknownServiceDateUsedForExactDeadlineAccepted === false,
    r.dateRangeCollapsedToExactDateAccepted === false,
    r.timezoneIgnoredWhereLegallyMaterialAccepted === false,
    r.eventDateMissingTemporalClaimAllowedAccepted === false,
    r.filingDateConfusedWithServiceDateAccepted === false,
    r.decisionDateConfusedWithAppealFilingDateAccepted === false,
    r.userQuestionDateUsedAsLegalEventDateAccepted === false,
    r.eventTypeUnresolvedExactRuleChosenAccepted === false,
    r.dateSourceUnverifiedTreatedAsCertainAccepted === false,
    r.temporalOverlapConflictIgnoredAccepted === false,
    r.temporalGapConflictIgnoredAccepted === false,
    r.publicationEffectMismatchIgnoredAccepted === false,
    r.competencePeriodConflictIgnoredAccepted === false,
    r.overridePeriodConflictIgnoredAccepted === false,
    r.currentPageUsedAsProofOfHistoricalRuleAccepted === false,
    r.federalVsLandConflictResolvedByNaiveRankingAccepted === false,
    r.landVsMunicipalityConflictIgnoredAccepted === false,
    r.authorityServiceAreaOverlapIgnoredAccepted === false,
    r.residenceVsEmploymentJurisdictionConflictIgnoredAccepted === false,
    r.taxVsInsuranceJurisdictionConflictIgnoredAccepted === false,
    r.issuerVsReceiverConflictIgnoredAccepted === false,
    r.crossBorderCompetenceConflictIgnoredAccepted === false,
    r.deAssumedCompetentStateAutomaticallyAccepted === false,
    r.uiLanguageActivatesForeignTrustDomainAccepted === false,
    r.slovakLocaleActivatesSkConnectorAccepted === false,
    r.hungarianLocaleActivatesHuConnectorAccepted === false,
    r.englishLocaleDisablesCrossBorderContextAccepted === false,
    r.germanLocaleForcesDeOnlyCaseAccepted === false,
    r.euRuleAloneEstablishesGermanLocalProcedureAccepted === false,
    r.germanSourceAloneEstablishesForeignProcedureAccepted === false,
    r.foreignSourceAloneEstablishesGermanProcedureAccepted === false,
    r.euVersionMissingInstructionIssuedAccepted === false,
    r.germanVersionMissingInstructionIssuedAccepted === false,
    r.foreignVersionMissingInstructionIssuedAccepted === false,
    r.authorityPeriodMismatchIgnoredAccepted === false,
    r.conflictingCrossBorderEffectivePeriodsIgnoredAccepted === false,
    r.multipleConnectedCountriesCollapsedToOneAccepted === false,
    r.workStateResidenceStateDistinctionIgnoredAccepted === false,
    r.familyResidenceInAnotherCountryIgnoredAccepted === false,
    r.materialPersonalFactGuessedAccepted === false,
    r.irrelevantSensitiveFactRequestedAccepted === false,
    r.unresolvedMaterialFactHiddenAccepted === false,
    r.blockedJurisdictionClaimShownAsFactAccepted === false,
    r.qualifiedAuthoritySuggestionShownAsCertaintyAccepted === false,
    r.orientationUpgradedToExactInstructionAccepted === false,
    r.citationOmittedFromDateSensitiveClaimAccepted === false,
    r.currentSourceUsedOutsideTerritorialScopeAccepted === false,
    r.authoritySourceUsedOutsideCompetencePeriodAccepted === false,
    r.localPageUsedOutsideServiceAreaAccepted === false,
    r.historicalSourceUsedForCurrentClaimAccepted === false,
    r.currentSourceUsedForPreEffectiveEventAccepted === false,
    r.exactAuthorityInstructionAllowedWithUnresolvedCompetenceAccepted === false,
    r.exactLegalStatusAllowedWithUnresolvedJurisdictionAccepted === false,
    r.germanKnowledgeClaimedPopulatedAccepted === false,
    r.v4TimelinesClaimedPopulatedAccepted === false,
    r.sixLanguagesClaimedProductionReadyAccepted === false,
    r.anyTamperCaseSurvivedAccepted === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// ─── Evidence collection (static source inspection + read-only git) ───────

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  sourceArchitectureCheckIdFound: string;
  sourceArchitectureReady: boolean;
  sourceTrustContractCheckIdFound: string;
  sourceTrustContractReady: boolean;
  sixLaunchLocalesRecorded: boolean;
  standaloneExtractionStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;
  notes: string[];
};

function collectEvidence(): Evidence {
  const notes: string[] = [];

  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  const isAuditPathOrDirCovering = (p: string): boolean => {
    if (p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH)) return true;
    const dirPrefix = p.endsWith("/") ? p : `${p}/`;
    return AUDIT_SELF_REL_PATH.startsWith(dirPrefix);
  };

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const newAuditFileCreated = fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isAuditPathOrDirCovering(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isAuditPathOrDirCovering(p));

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const phase9aSrc = readFileText(PHASE_9A_REL_PATH);
  const phase9aExists = fileExists(PHASE_9A_REL_PATH);
  const checkId9aMatch = phase9aSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceArchitectureCheckIdFound = checkId9aMatch ? checkId9aMatch[1] : "not_found";
  const sourceArchitectureReady =
    phase9aExists &&
    sourceArchitectureCheckIdFound === "9A" &&
    phase9aSrc.includes("readyForGermanSourceHierarchyAndTrustContract: allPassed");
  if (!sourceArchitectureReady) notes.push("PHASE 9A source did not statically confirm readiness.");

  const phase9bSrc = readFileText(PHASE_9B_REL_PATH);
  const phase9bExists = fileExists(PHASE_9B_REL_PATH);
  const checkId9bMatch = phase9bSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceTrustContractCheckIdFound = checkId9bMatch ? checkId9bMatch[1] : "not_found";
  const sourceTrustContractReady =
    phase9bExists &&
    sourceTrustContractCheckIdFound === "9B" &&
    phase9bSrc.includes("readyForGermanJurisdictionEffectiveDateModel: allPassed");
  if (!sourceTrustContractReady) notes.push("PHASE 9B source did not statically confirm readiness.");

  const closureSrc = readFileText(CLOSURE_8_13C_REL_PATH);
  const closureExists = fileExists(CLOSURE_8_13C_REL_PATH);
  const standaloneExtractionStillOpen = phase9aExists && phase9aSrc.includes("standaloneSmartTalkExtractionRequiredLater: true");
  const physicalAndroidStillUntested = closureExists && closureSrc.includes("physicalAndroidStillUntested: true");
  const genuineIosSafariStillUntested = closureExists && closureSrc.includes("genuineIosSafariStillUntested: true");
  const heicHeifStillOpen = closureExists && closureSrc.includes("heicHeifStillOpen: !evidence.heicSupportImplementedNow");
  const serverlessOcrStillOpen = closureExists && closureSrc.includes("serverlessOcrValidationStillOpen: true");
  const distributedRateLimiterStillOpen =
    closureExists && closureSrc.includes("distributedRateLimiterStillOpen: !evidence.rateLimiterDistributedProductionSolved");
  const paymentFlowStillOpen = closureExists && closureSrc.includes("Final production payment flow");

  return {
    onlyExpectedFilesChanged,
    existingFileModified,
    newAuditFileCreated,
    sourceArchitectureCheckIdFound,
    sourceArchitectureReady,
    sourceTrustContractCheckIdFound,
    sourceTrustContractReady,
    sixLaunchLocalesRecorded: LAUNCH_LOCALES.length === 6,
    standaloneExtractionStillOpen,
    physicalAndroidStillUntested,
    genuineIosSafariStillUntested,
    heicHeifStillOpen,
    serverlessOcrStillOpen,
    distributedRateLimiterStillOpen,
    paymentFlowStillOpen,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const designComplete =
    JURISDICTION_LEVELS.length === 12 &&
    ADMINISTRATIVE_LEVEL_PRESENCE_STATES.length === 4 &&
    TERRITORIAL_IDENTIFIER_FIELDS.length === 10 &&
    RULE_SCOPE_TYPES.length === 17 &&
    JURISDICTION_CONTEXT_FIELDS.length === 19 &&
    USER_LOCATION_VS_LEGAL_JURISDICTION_CONCEPTS.length === 11 &&
    AUTHORITY_COMPETENCE_DIMENSION_FIELDS.length === 18 &&
    COMPETENCE_RESULTS.length === 9 &&
    AUTHORITY_RESOLUTION_INPUTS.length === 9 &&
    AUTHORITY_RESOLUTION_OUTCOMES.length === 8 &&
    TEMPORAL_CONCEPTS.length === 19 &&
    EFFECTIVE_DATE_STATUSES.length === 14 &&
    SOURCE_VERSION_TIMELINE_FIELDS.length === 15 &&
    HISTORICAL_QUERY_EXAMPLES.length === 4 &&
    HISTORICAL_QUERY_EVALUATION_INPUTS.length === 5 &&
    EVENT_TYPES.length === 17 &&
    EVENT_RECORD_FIELDS.length === 8 &&
    DATE_PRECISION_VALUES.length === 7 &&
    TEMPORAL_APPLICABILITY_OUTCOMES.length === 11 &&
    TEMPORAL_APPLICABILITY_DECISION_FIELDS.length === 11 &&
    REGIONAL_OVERRIDE_TYPES.length === 10 &&
    REGIONAL_OVERRIDE_FIELDS.length === 10 &&
    OVERRIDE_RESOLUTION_OUTCOMES.length === 8 &&
    TEMPORAL_CONFLICT_TYPES.length === 10 &&
    JURISDICTION_CONFLICT_TYPES.length === 10 &&
    MULTI_JURISDICTION_CASE_EXAMPLES.length === 10 &&
    MULTI_JURISDICTION_CONTEXT_FIELDS.length === 12 &&
    CROSS_BORDER_TEMPORAL_ALIGNMENT_STATES.length === 8 &&
    CROSS_BORDER_TEMPORAL_REQUIREMENTS.length === 5 &&
    PERSON_SPECIFIC_CONTEXT_FACTS.length === 8 &&
    PERSON_SPECIFIC_CONTEXT_RULES.length === 5 &&
    JURISDICTION_CLAIM_DECISION_FIELDS.length === 16 &&
    ALLOWED_USES.length === 12 &&
    CONSERVATIVE_FAILURE_PHRASES.length === 6 &&
    LAUNCH_LOCALES.length === 6 &&
    TRUST_DOMAINS_CONCEPTUAL.length === 6 &&
    LOCALE_JURISDICTION_SEPARATION_EXAMPLES.length === 4 &&
    ONE_LOCATION_DETERMINES_ALL_COMPETENCE === false &&
    NEARBY_OFFICE_PROVES_COMPETENCE === false &&
    CONCRETE_INSTRUCTION_ALLOWED_WHEN_COMPETENCE_UNRESOLVED === false &&
    LEGAL_EFFECTIVENESS_EQUALS_PAGE_FRESHNESS === false &&
    HISTORICAL_QUESTION_MAY_USE_ONLY_CURRENT_VERSION === false &&
    EXACT_DEADLINE_FROM_IMPRECISE_DATE_ALLOWED === false &&
    EVERY_OVERRIDE_CHANGES_SUBSTANTIVE_LAW === false &&
    LOCAL_OVERRIDE_MAY_SUPPLEMENT_WITHOUT_REPLACING === true &&
    HIGH_RISK_OUTPUT_ALLOWED_WITH_UNRESOLVED_TEMPORAL_CONFLICT === false &&
    EVERY_CONFLICT_RESOLVED_BY_NAIVE_HIERARCHY === false &&
    DE_ASSUMED_COMPETENT_STATE_MERELY_BECAUSE_MARKET_IS_DE === false &&
    CROSS_BORDER_INSTRUCTION_ALLOWED_WITHOUT_ALIGNMENT === false &&
    MISSING_CONTEXT_CONVERTED_TO_CERTAINTY === false;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sourceArchitectureReady &&
    evidence.sourceTrustContractReady &&
    evidence.sixLaunchLocalesRecorded;

  return {
    checkId: "9C",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceTrustContractCheckId: evidence.sourceTrustContractCheckIdFound,
    sourceArchitectureReady: evidence.sourceArchitectureReady,
    sourceTrustContractReady: evidence.sourceTrustContractReady,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    databaseMigrationCreated: false,
    databaseWritePerformed: false,
    networkAccessPerformed: false,
    externalSourceDownloaded: false,
    realJurisdictionPopulated: false,
    realAuthorityRegistered: false,
    realTerritorialMappingPopulated: false,
    realEffectiveDateRecordPopulated: false,
    realSourceVersionIngested: false,
    realCrossBorderTimelinePopulated: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    jurisdictionLevelsDefined: true,
    territorialIdentifiersDefined: true,
    ruleScopeTypesDefined: true,
    jurisdictionContextDefined: true,
    localeSeparatedFromJurisdiction: true,
    userLocationSeparatedFromLegalJurisdiction: true,
    authorityCompetenceModelDefined: true,
    authorityResolutionDefined: true,
    temporalConceptsSeparated: true,
    effectiveDateStatusesDefined: true,
    sourceVersionTimelineDefined: true,
    historicalQuerySupportDefined: true,
    eventDateModelDefined: true,
    datePrecisionModelDefined: true,
    temporalApplicabilityDecisionDefined: true,
    regionalOverrideModelDefined: true,
    overrideResolutionDefined: true,
    temporalConflictModelDefined: true,
    jurisdictionConflictModelDefined: true,
    multiJurisdictionModelDefined: true,
    crossBorderTemporalAlignmentDefined: true,
    personSpecificContextBoundaryDefined: true,
    jurisdictionClaimDecisionDefined: true,
    allowedUseMatrixDefined: true,
    conservativeFailureOutputDefined: true,

    historicalVersionsImmutable: true,
    currentVersionCannotOverwriteHistoricalVersion: true,
    retrievedAtSeparatedFromEffectiveFrom: true,
    publishedAtSeparatedFromEffectiveFrom: true,
    localRuleCannotBecomeNational: true,
    landRuleCannotBecomeFederal: true,
    authorityProximityDoesNotProveCompetence: true,
    outputLocaleCannotDetermineJurisdiction: true,
    modelCannotOverrideJurisdictionDecision: true,
    exactDeadlineBlockedWithoutSufficientDatePrecision: true,
    historicalQuestionUsesHistoricalVersion: true,
    crossBorderInstructionRequiresTemporalAlignment: true,

    sixLaunchLocalesRecorded: evidence.sixLaunchLocalesRecorded,
    euDeSkCzPlHuDomainsSupportedConceptually: true,

    zeroRealJurisdictionsPopulated: true,
    zeroRealAuthoritiesRegistered: true,
    zeroRealTemporalRecordsPopulated: true,
    zeroRealCrossBorderTimelinesPopulated: true,

    standaloneExtractionStillOpen: evidence.standaloneExtractionStillOpen,
    physicalAndroidStillUntested: evidence.physicalAndroidStillUntested,
    genuineIosSafariStillUntested: evidence.genuineIosSafariStillUntested,
    heicHeifStillOpen: evidence.heicHeifStillOpen,
    serverlessOcrStillOpen: evidence.serverlessOcrStillOpen,
    distributedRateLimiterStillOpen: evidence.distributedRateLimiterStillOpen,
    paymentFlowStillOpen: evidence.paymentFlowStillOpen,
    v4LocalizationParityStillOpen: true,
    germanKnowledgePopulationStillOpen: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForMinimumGermanProcessCoveragePlan: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,

    nationalityAloneDeterminesJurisdictionAccepted: false,
    currentLocationDeterminesEveryCompetenceAccepted: false,
    residenceEqualsTaxResidenceAutomaticallyAccepted: false,
    employmentLocationEqualsInsuranceStateAutomaticallyAccepted: false,
    documentIssuerDeterminesReceivingAuthorityAccepted: false,
    nearestAuthorityTreatedAsCompetentAccepted: false,
    officialAuthorityTreatedAsCompetentForEveryTopicAccepted: false,
    informationOnlyAuthorityTreatedAsDecisionAuthorityAccepted: false,
    forwardingOfficeTreatedAsDecidingAuthorityAccepted: false,
    overlappingCompetenceIgnoredAccepted: false,
    changedCompetenceIgnoredAccepted: false,
    competenceUnknownInstructionIssuedAccepted: false,
    universalAdministrativeLevelAssumedAccepted: false,
    regierungsbezirkAssumedInEveryLandAccepted: false,
    municipalityRuleTreatedAsFederalAccepted: false,
    landRuleTreatedAsNationwideAccepted: false,
    authorityProcedureTreatedAsNationalAccepted: false,
    postalCodeAssignmentTreatedAsSubstantiveLawAccepted: false,
    serviceAreaTreatedAsNationalJurisdictionAccepted: false,
    localFeeGeneralizedNationallyAccepted: false,
    localFormGeneralizedNationallyAccepted: false,
    pilotRuleGeneralizedPermanentlyAccepted: false,
    overrideReplacesBaseLawWithoutEvidenceAccepted: false,
    overrideIgnoredAccepted: false,
    overrideConflictIgnoredAccepted: false,
    expiredOverrideUsedAccepted: false,
    futureOverrideUsedAsCurrentAccepted: false,
    sourceLastModifiedAtTreatedAsLegalEffectAccepted: false,
    adoptedRuleTreatedAsEffectiveAccepted: false,
    repealedRuleTreatedAsCurrentAccepted: false,
    expiredRuleTreatedAsCurrentAccepted: false,
    suspendedRuleTreatedAsCurrentAccepted: false,
    effectiveDateUnknownDefinitiveClaimAllowedAccepted: false,
    applicabilityDateUnknownDefinitiveClaimAllowedAccepted: false,
    conflictingEffectiveDatesIgnoredAccepted: false,
    sourceVersionGapIgnoredAccepted: false,
    historicalVersionDeletedAccepted: false,
    authorityReorganizationIgnoredForHistoricalCaseAccepted: false,
    historicalFeeAnsweredFromCurrentFeeAccepted: false,
    transitionRuleIgnoredAccepted: false,
    transitionalConflictIgnoredAccepted: false,
    monthOnlyDateUsedForExactDeadlineAccepted: false,
    yearOnlyDateUsedForExactDeadlineAccepted: false,
    unknownServiceDateUsedForExactDeadlineAccepted: false,
    dateRangeCollapsedToExactDateAccepted: false,
    timezoneIgnoredWhereLegallyMaterialAccepted: false,
    eventDateMissingTemporalClaimAllowedAccepted: false,
    filingDateConfusedWithServiceDateAccepted: false,
    decisionDateConfusedWithAppealFilingDateAccepted: false,
    userQuestionDateUsedAsLegalEventDateAccepted: false,
    eventTypeUnresolvedExactRuleChosenAccepted: false,
    dateSourceUnverifiedTreatedAsCertainAccepted: false,
    temporalOverlapConflictIgnoredAccepted: false,
    temporalGapConflictIgnoredAccepted: false,
    publicationEffectMismatchIgnoredAccepted: false,
    competencePeriodConflictIgnoredAccepted: false,
    overridePeriodConflictIgnoredAccepted: false,
    currentPageUsedAsProofOfHistoricalRuleAccepted: false,
    federalVsLandConflictResolvedByNaiveRankingAccepted: false,
    landVsMunicipalityConflictIgnoredAccepted: false,
    authorityServiceAreaOverlapIgnoredAccepted: false,
    residenceVsEmploymentJurisdictionConflictIgnoredAccepted: false,
    taxVsInsuranceJurisdictionConflictIgnoredAccepted: false,
    issuerVsReceiverConflictIgnoredAccepted: false,
    crossBorderCompetenceConflictIgnoredAccepted: false,
    deAssumedCompetentStateAutomaticallyAccepted: false,
    uiLanguageActivatesForeignTrustDomainAccepted: false,
    slovakLocaleActivatesSkConnectorAccepted: false,
    hungarianLocaleActivatesHuConnectorAccepted: false,
    englishLocaleDisablesCrossBorderContextAccepted: false,
    germanLocaleForcesDeOnlyCaseAccepted: false,
    euRuleAloneEstablishesGermanLocalProcedureAccepted: false,
    germanSourceAloneEstablishesForeignProcedureAccepted: false,
    foreignSourceAloneEstablishesGermanProcedureAccepted: false,
    euVersionMissingInstructionIssuedAccepted: false,
    germanVersionMissingInstructionIssuedAccepted: false,
    foreignVersionMissingInstructionIssuedAccepted: false,
    authorityPeriodMismatchIgnoredAccepted: false,
    conflictingCrossBorderEffectivePeriodsIgnoredAccepted: false,
    multipleConnectedCountriesCollapsedToOneAccepted: false,
    workStateResidenceStateDistinctionIgnoredAccepted: false,
    familyResidenceInAnotherCountryIgnoredAccepted: false,
    materialPersonalFactGuessedAccepted: false,
    irrelevantSensitiveFactRequestedAccepted: false,
    unresolvedMaterialFactHiddenAccepted: false,
    blockedJurisdictionClaimShownAsFactAccepted: false,
    qualifiedAuthoritySuggestionShownAsCertaintyAccepted: false,
    orientationUpgradedToExactInstructionAccepted: false,
    citationOmittedFromDateSensitiveClaimAccepted: false,
    currentSourceUsedOutsideTerritorialScopeAccepted: false,
    authoritySourceUsedOutsideCompetencePeriodAccepted: false,
    localPageUsedOutsideServiceAreaAccepted: false,
    historicalSourceUsedForCurrentClaimAccepted: false,
    currentSourceUsedForPreEffectiveEventAccepted: false,
    exactAuthorityInstructionAllowedWithUnresolvedCompetenceAccepted: false,
    exactLegalStatusAllowedWithUnresolvedJurisdictionAccepted: false,
    germanKnowledgeClaimedPopulatedAccepted: false,
    v4TimelinesClaimedPopulatedAccepted: false,
    sixLanguagesClaimedProductionReadyAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    jurisdictionLevels: JURISDICTION_LEVELS,
    administrativeLevelPresenceStates: ADMINISTRATIVE_LEVEL_PRESENCE_STATES,
    territorialIdentifierFields: TERRITORIAL_IDENTIFIER_FIELDS,
    ruleScopeTypes: RULE_SCOPE_TYPES,
    preventedScopeGeneralizations: PREVENTED_SCOPE_GENERALIZATIONS,
    jurisdictionContextFields: JURISDICTION_CONTEXT_FIELDS,
    userLocationVsLegalJurisdictionConcepts: USER_LOCATION_VS_LEGAL_JURISDICTION_CONCEPTS,
    authorityCompetenceDimensionFields: AUTHORITY_COMPETENCE_DIMENSION_FIELDS,
    competenceResults: COMPETENCE_RESULTS,
    authorityResolutionInputs: AUTHORITY_RESOLUTION_INPUTS,
    authorityResolutionOutcomes: AUTHORITY_RESOLUTION_OUTCOMES,
    temporalConcepts: TEMPORAL_CONCEPTS,
    effectiveDateStatuses: EFFECTIVE_DATE_STATUSES,
    sourceVersionTimelineFields: SOURCE_VERSION_TIMELINE_FIELDS,
    historicalQueryExamples: HISTORICAL_QUERY_EXAMPLES,
    historicalQueryEvaluationInputs: HISTORICAL_QUERY_EVALUATION_INPUTS,
    eventTypes: EVENT_TYPES,
    eventRecordFields: EVENT_RECORD_FIELDS,
    datePrecisionValues: DATE_PRECISION_VALUES,
    temporalApplicabilityOutcomes: TEMPORAL_APPLICABILITY_OUTCOMES,
    temporalApplicabilityDecisionFields: TEMPORAL_APPLICABILITY_DECISION_FIELDS,
    regionalOverrideTypes: REGIONAL_OVERRIDE_TYPES,
    regionalOverrideFields: REGIONAL_OVERRIDE_FIELDS,
    overrideOnlyChangesTypes: OVERRIDE_ONLY_CHANGES_TYPES,
    overrideResolutionOutcomes: OVERRIDE_RESOLUTION_OUTCOMES,
    temporalConflictTypes: TEMPORAL_CONFLICT_TYPES,
    jurisdictionConflictTypes: JURISDICTION_CONFLICT_TYPES,
    multiJurisdictionCaseExamples: MULTI_JURISDICTION_CASE_EXAMPLES,
    multiJurisdictionContextFields: MULTI_JURISDICTION_CONTEXT_FIELDS,
    crossBorderTemporalAlignmentStates: CROSS_BORDER_TEMPORAL_ALIGNMENT_STATES,
    crossBorderTemporalRequirements: CROSS_BORDER_TEMPORAL_REQUIREMENTS,
    personSpecificContextFacts: PERSON_SPECIFIC_CONTEXT_FACTS,
    personSpecificContextRules: PERSON_SPECIFIC_CONTEXT_RULES,
    jurisdictionClaimDecisionFields: JURISDICTION_CLAIM_DECISION_FIELDS,
    allowedUses: ALLOWED_USES,
    conservativeFailurePhrases: CONSERVATIVE_FAILURE_PHRASES,
    trustDomainsConceptual: TRUST_DOMAINS_CONCEPTUAL,
    localeJurisdictionSeparationExamples: LOCALE_JURISDICTION_SEPARATION_EXAMPLES,
    knownOpenDebts: KNOWN_OPEN_DEBTS,
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${PHASE_9A_REL_PATH} checkId found: ${evidence.sourceArchitectureCheckIdFound}`,
      `${PHASE_9A_REL_PATH} readiness wiring confirmed: ${evidence.sourceArchitectureReady}`,
      `${PHASE_9B_REL_PATH} checkId found: ${evidence.sourceTrustContractCheckIdFound}`,
      `${PHASE_9B_REL_PATH} readiness wiring confirmed: ${evidence.sourceTrustContractReady}`,
      `${PHASE_9A_REL_PATH} standaloneSmartTalkExtractionRequiredLater: true present: ${evidence.standaloneExtractionStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      "This audit read only committed plain text for the 9A audit, the 9B audit, and the 8.13C closure audit — none were imported or executed.",
      "Zero real jurisdictions populated, zero real authorities registered, zero real territorial mappings, zero real effective-date records, zero real source versions ingested, zero real cross-border timelines populated, zero database rows, zero network/retrieval/model/OCR calls, zero user-content persistence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runGermanJurisdictionEffectiveDateModelAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForMinimumGermanProcessCoveragePlan: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runGermanJurisdictionEffectiveDateModelAudit();
  console.log(JSON.stringify(result));
}
