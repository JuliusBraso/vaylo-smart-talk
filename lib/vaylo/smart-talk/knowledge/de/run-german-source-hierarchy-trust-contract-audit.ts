/**
 * PHASE 9B — German Source Hierarchy and Trust Contract Audit
 * (Contract and Audit Only)
 *
 * This file defines a deterministic, contextual source-hierarchy and
 * trust-decision contract for the future German bureaucracy/legal
 * knowledge system used by Birello Smart Talk — building on the PHASE 9A
 * architecture boundary. It performs NO dynamic execution: no network,
 * no source download, no ingestion, no database, no migration, no
 * embeddings, no retrieval, no model call, no OCR, no user-content
 * persistence, no environment mutation.
 *
 * It only:
 *   1. Declares immutable, type-only trust contracts (source types, legal
 *      weight, claim-type eligibility, publisher competence, source
 *      purpose, trust-decision model, passage sufficiency, freshness,
 *      review, conflict handling, high-risk requirements, allowed-use
 *      matrix, discovery/secondary source rules, court/form/FAQ special
 *      contracts, regional trust, EU/DE/V4 trust domains, cross-border
 *      evidence, responsible-actor trust, translation trust, official
 *      domain verification design, change detection, and the knowledge
 *      answer envelope trust summary).
 *   2. Reads the PHASE 9A audit file and the PHASE 8.13C closure audit as
 *      plain text via `fs.readFileSync` (never imports/executes them) to
 *      ground a few conservative booleans.
 *   3. Runs read-only `git` commands to confirm this phase created
 *      exactly one new file and modified no existing file.
 *   4. Runs 130 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "56f4044";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";

const PHASE_9A_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-source-hierarchy-trust-contract-audit.ts";

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
// SOURCE-TYPE CONTRACT (26 future source types)
// ============================================================================

type SourceType =
  | "eu_law"
  | "eu_regulation"
  | "eu_decision"
  | "eu_official_guidance"
  | "german_constitutional_law"
  | "federal_law"
  | "federal_regulation"
  | "federal_official_publication"
  | "federal_official_guidance"
  | "state_law"
  | "state_regulation"
  | "state_official_guidance"
  | "municipal_rule"
  | "municipal_official_guidance"
  | "authority_procedure"
  | "administrative_instruction"
  | "official_form"
  | "official_form_instructions"
  | "official_faq"
  | "court_decision"
  | "official_register"
  | "official_statistical_source"
  | "secondary_explanatory_source"
  | "commercial_explanatory_source"
  | "discovery_only_source"
  | "unsupported_source";

const SOURCE_TYPES: readonly SourceType[] = [
  "eu_law", "eu_regulation", "eu_decision", "eu_official_guidance", "german_constitutional_law",
  "federal_law", "federal_regulation", "federal_official_publication", "federal_official_guidance",
  "state_law", "state_regulation", "state_official_guidance", "municipal_rule", "municipal_official_guidance",
  "authority_procedure", "administrative_instruction", "official_form", "official_form_instructions",
  "official_faq", "court_decision", "official_register", "official_statistical_source",
  "secondary_explanatory_source", "commercial_explanatory_source", "discovery_only_source", "unsupported_source",
];

export const DISCOVERY_ONLY_SOURCE_TYPES: readonly SourceType[] = ["discovery_only_source", "commercial_explanatory_source"];

const DISCOVERY_ONLY_EXAMPLES: readonly string[] = [
  "blogs", "forums", "social_media", "commercial_relocation_pages", "seo_pages",
  "general_search_snippets", "unverified_summaries", "llm_generated_suggestions",
];

export const DISCOVERY_MAY_HELP_IDENTIFY: readonly string[] = [
  "possible official publisher", "possible legal provision", "possible form name",
  "possible topic", "possible authority",
];

// ============================================================================
// LEGAL AND PROCEDURAL WEIGHT — contextual, never one universal linear rank
// ============================================================================

type LegalWeight =
  | "binding_primary"
  | "binding_delegated"
  | "binding_local"
  | "authoritative_interpretive"
  | "authoritative_operational"
  | "official_explanatory"
  | "evidentiary_only"
  | "secondary_context"
  | "discovery_only"
  | "unsupported";

const LEGAL_WEIGHTS: readonly LegalWeight[] = [
  "binding_primary", "binding_delegated", "binding_local", "authoritative_interpretive",
  "authoritative_operational", "official_explanatory", "evidentiary_only", "secondary_context",
  "discovery_only", "unsupported",
];

/** Weight is meaningless in isolation — it must always be read together with these dimensions. */
export const LEGAL_WEIGHT_INTERPRETIVE_CONTEXT_FIELDS: readonly string[] = [
  "claimType", "jurisdiction", "territorialScope", "effectiveDate", "publisherCompetence",
  "sourcePurpose", "sourcePassage", "reviewStatus",
];

/** Explicit contextual-trust statements this contract enforces (not a ranking table). */
const CONTEXTUAL_TRUST_STATEMENTS: readonly string[] = [
  "A federal law may control a substantive legal rule.",
  "An official municipal page may control a local appointment procedure.",
  "An official form may prove required fields but not necessarily the complete legal entitlement.",
  "An official FAQ may explain procedure but may not override legislation.",
  "A court decision may interpret a law but must not be generalized without scope.",
  "An authority instruction may be operationally relevant but not equivalent to legislation.",
  "The highest-ranked search result is irrelevant to legal authority.",
  "Official does not automatically mean universally applicable.",
  "Newer does not automatically mean legally effective.",
  "Translated does not mean authoritative.",
];

// ============================================================================
// CLAIM TYPES AND ELIGIBILITY
// ============================================================================

type ClaimType =
  | "legal_rule"
  | "eligibility_rule"
  | "deadline_rule"
  | "fee_rule"
  | "required_document_rule"
  | "authority_competence"
  | "procedural_step"
  | "form_requirement"
  | "appeal_information"
  | "documentary_fact"
  | "general_orientation"
  | "safe_next_step"
  | "cross_border_coordination_rule"
  | "responsible_actor_rule"
  | "unresolved_interpretation";

const CLAIM_TYPES: readonly ClaimType[] = [
  "legal_rule", "eligibility_rule", "deadline_rule", "fee_rule", "required_document_rule",
  "authority_competence", "procedural_step", "form_requirement", "appeal_information",
  "documentary_fact", "general_orientation", "safe_next_step", "cross_border_coordination_rule",
  "responsible_actor_rule", "unresolved_interpretation",
];

interface ClaimTypeEligibility {
  claimType: ClaimType;
  mayRequireOrUse: readonly SourceType[];
  mustNotRelySolelyOn: readonly SourceType[];
  notes?: string;
}

const CLAIM_TYPE_ELIGIBILITY: readonly ClaimTypeEligibility[] = [
  {
    claimType: "legal_rule",
    mayRequireOrUse: ["eu_law", "eu_regulation", "federal_law", "state_law", "federal_regulation", "state_regulation", "court_decision"],
    mustNotRelySolelyOn: ["official_faq", "commercial_explanatory_source", "authority_procedure", "unsupported_source"],
    notes: "Court decision eligible only where interpretation is necessary and scope is respected.",
  },
  {
    claimType: "eligibility_rule",
    mayRequireOrUse: ["federal_law", "state_law", "federal_regulation", "state_regulation", "authority_procedure"],
    mustNotRelySolelyOn: ["official_faq", "commercial_explanatory_source", "unsupported_source"],
  },
  {
    claimType: "deadline_rule",
    mayRequireOrUse: ["federal_law", "state_law", "federal_regulation", "authority_procedure", "administrative_instruction", "official_form_instructions"],
    mustNotRelySolelyOn: ["official_faq", "commercial_explanatory_source", "unsupported_source"],
    notes: "High-risk deadline claims additionally require the HIGH_RISK_CLAIM_CONTRACT gate.",
  },
  {
    claimType: "fee_rule",
    mayRequireOrUse: ["federal_regulation", "state_regulation", "municipal_rule", "official_form", "authority_procedure"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
  },
  {
    claimType: "required_document_rule",
    mayRequireOrUse: ["official_form", "official_form_instructions", "authority_procedure", "administrative_instruction"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
  },
  {
    claimType: "authority_competence",
    mayRequireOrUse: ["official_register", "authority_procedure", "administrative_instruction", "federal_law", "state_law"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source", "discovery_only_source"],
    notes: "Must not be inferred from interface language, user nationality alone, nearest office, or search ranking.",
  },
  {
    claimType: "procedural_step",
    mayRequireOrUse: ["authority_procedure", "official_form_instructions", "municipal_official_guidance", "administrative_instruction"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
    notes: "Must be scoped to the correct authority and region.",
  },
  {
    claimType: "form_requirement",
    mayRequireOrUse: ["official_form", "official_form_instructions"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
  },
  {
    claimType: "appeal_information",
    mayRequireOrUse: ["federal_law", "state_law", "authority_procedure", "court_decision"],
    mustNotRelySolelyOn: ["official_faq", "commercial_explanatory_source"],
  },
  {
    claimType: "documentary_fact",
    mayRequireOrUse: ["official_form", "official_register", "official_statistical_source", "administrative_instruction"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
  },
  {
    claimType: "general_orientation",
    mayRequireOrUse: ["official_faq", "municipal_official_guidance", "federal_official_guidance", "state_official_guidance", "secondary_explanatory_source"],
    mustNotRelySolelyOn: ["unsupported_source"],
    notes: "Lowest-risk claim type; still may not rely on unsupported sources.",
  },
  {
    claimType: "safe_next_step",
    mayRequireOrUse: ["official_faq", "authority_procedure", "municipal_official_guidance", "federal_official_guidance"],
    mustNotRelySolelyOn: ["unsupported_source"],
  },
  {
    claimType: "cross_border_coordination_rule",
    mayRequireOrUse: ["eu_law", "eu_regulation", "eu_official_guidance", "federal_law", "authority_procedure"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source"],
    notes: "Requires evidence from all required trust domains — see CROSS_BORDER_EVIDENCE contract.",
  },
  {
    claimType: "responsible_actor_rule",
    mayRequireOrUse: ["federal_law", "state_law", "authority_procedure", "official_register", "eu_official_guidance"],
    mustNotRelySolelyOn: ["commercial_explanatory_source", "unsupported_source", "discovery_only_source"],
  },
  {
    claimType: "unresolved_interpretation",
    mayRequireOrUse: ["court_decision", "federal_law", "state_law"],
    mustNotRelySolelyOn: ["official_faq", "commercial_explanatory_source", "unsupported_source"],
    notes: "Remains explicitly unresolved until an authorized interpretive review closes it.",
  },
];

export const LEGAL_RULE_PROHIBITED_SOLE_BASIS: readonly string[] = [
  "faq", "blog", "commercial_site", "generic_authority_overview", "model_generated_text",
];

// ============================================================================
// PUBLISHER COMPETENCE
// ============================================================================

type PublisherCompetenceCategory =
  | "eu_institution"
  | "federal_legislature"
  | "federal_ministry"
  | "federal_authority"
  | "state_legislature"
  | "state_ministry"
  | "state_authority"
  | "municipal_authority"
  | "court"
  | "public_insurance_body"
  | "public_employment_body"
  | "tax_authority"
  | "immigration_authority"
  | "official_registry_operator"
  | "other_public_body"
  | "private_secondary_publisher"
  | "unknown_publisher";

const PUBLISHER_COMPETENCE_CATEGORIES: readonly PublisherCompetenceCategory[] = [
  "eu_institution", "federal_legislature", "federal_ministry", "federal_authority",
  "state_legislature", "state_ministry", "state_authority", "municipal_authority", "court",
  "public_insurance_body", "public_employment_body", "tax_authority", "immigration_authority",
  "official_registry_operator", "other_public_body", "private_secondary_publisher", "unknown_publisher",
];

/** The four independent competence questions — an official publisher can fail any of these. */
interface PublisherCompetenceCheck {
  publisherIsOfficial: boolean;
  publisherCompetentForSubject: boolean;
  publisherCompetentForTerritory: boolean;
  publisherCompetentForProcedure: boolean;
}

export const PUBLISHER_COMPETENCE_CHECK_FIELDS: readonly (keyof PublisherCompetenceCheck)[] = [
  "publisherIsOfficial", "publisherCompetentForSubject", "publisherCompetentForTerritory", "publisherCompetentForProcedure",
];

/** An official source outside its competence must not be treated as controlling. */
const OFFICIAL_SOURCE_OUTSIDE_COMPETENCE_IS_CONTROLLING = false as const;

// ============================================================================
// SOURCE PURPOSE
// ============================================================================

type SourcePurpose =
  | "legislation"
  | "regulation"
  | "adjudication"
  | "official_publication"
  | "operational_procedure"
  | "form_definition"
  | "public_guidance"
  | "faq_explanation"
  | "evidence_exchange"
  | "statistical_reporting"
  | "secondary_explanation"
  | "discovery";

const SOURCE_PURPOSES: readonly SourcePurpose[] = [
  "legislation", "regulation", "adjudication", "official_publication", "operational_procedure",
  "form_definition", "public_guidance", "faq_explanation", "evidence_exchange",
  "statistical_reporting", "secondary_explanation", "discovery",
];

/** An FAQ must never be used as if it were legislation merely because both are official. */
export const FAQ_PURPOSE_CANNOT_SUBSTITUTE_FOR: readonly SourcePurpose[] = ["legislation", "regulation", "adjudication"];

// ============================================================================
// OFFICIAL SOURCE REGISTRY CONTRACT (design fields only — no real rows)
// ============================================================================

export interface OfficialSourceRegistryRecord {
  sourceId: string;
  publisherId: string;
  publisherName: string;
  publisherType: PublisherCompetenceCategory;
  sourceType: SourceType;
  officialDomain?: string;
  officialDomainVerified: boolean;
  jurisdictionLevel?: string;
  jurisdictionCode?: string;
  territorialScope?: string;
  subjectMatterScope?: string;
  publisherCompetence: PublisherCompetenceCheck;
  sourcePurpose: SourcePurpose;
  legalWeight: LegalWeight;
  supportsClaimTypes: readonly ClaimType[];
  doesNotSupportClaimTypes: readonly ClaimType[];
  sourceLanguage?: string;
  canonicalUrl?: string;
  publicationIdentifier?: string;
  reviewStatus: ReviewStatus;
  freshnessStatus: FreshnessStatus;
  highRiskUseAllowed: boolean;
  discoveryUseAllowed: boolean;
  notes?: string;
}

const OFFICIAL_SOURCE_REGISTRY_FIELDS: readonly string[] = [
  "sourceId", "publisherId", "publisherName", "publisherType", "sourceType", "officialDomain",
  "officialDomainVerified", "jurisdictionLevel", "jurisdictionCode", "territorialScope",
  "subjectMatterScope", "publisherCompetence", "sourcePurpose", "legalWeight", "supportsClaimTypes",
  "doesNotSupportClaimTypes", "sourceLanguage", "canonicalUrl", "publicationIdentifier", "reviewStatus",
  "freshnessStatus", "highRiskUseAllowed", "discoveryUseAllowed", "notes",
];

// ============================================================================
// TRUST DECISION MODEL (deterministic outcomes — model may never override)
// ============================================================================

type TrustDecisionOutcome =
  | "authorized"
  | "authorized_with_qualification"
  | "discovery_only"
  | "blocked_stale"
  | "blocked_unreviewed_change"
  | "blocked_wrong_jurisdiction"
  | "blocked_wrong_authority"
  | "blocked_insufficient_passage"
  | "blocked_conflict"
  | "blocked_unsupported_source"
  | "blocked_high_risk_evidence_gap"
  | "blocked_effective_date_unknown"
  | "blocked_responsible_actor_unknown";

const TRUST_DECISION_OUTCOMES: readonly TrustDecisionOutcome[] = [
  "authorized", "authorized_with_qualification", "discovery_only", "blocked_stale",
  "blocked_unreviewed_change", "blocked_wrong_jurisdiction", "blocked_wrong_authority",
  "blocked_insufficient_passage", "blocked_conflict", "blocked_unsupported_source",
  "blocked_high_risk_evidence_gap", "blocked_effective_date_unknown", "blocked_responsible_actor_unknown",
];

interface TrustDecision {
  decision: TrustDecisionOutcome;
  claimType: ClaimType;
  sourceType: SourceType;
  legalWeight: LegalWeight;
  jurisdictionMatch: boolean;
  authorityCompetenceMatch: boolean;
  effectiveDateMatch: boolean;
  passageSupport: PassageSupportStatus;
  reviewStatus: ReviewStatus;
  freshnessStatus: FreshnessStatus;
  conflictStatus: ConflictType;
  requiredQualification?: string;
  blockedReason?: string;
  allowedOutputUse: readonly AllowedUse[];
  /** The trust decision is computed by this deterministic contract only. */
  overridableByModel: false;
}

const TRUST_DECISION_FIELDS: readonly string[] = [
  "decision", "claimType", "sourceType", "legalWeight", "jurisdictionMatch", "authorityCompetenceMatch",
  "effectiveDateMatch", "passageSupport", "reviewStatus", "freshnessStatus", "conflictStatus",
  "requiredQualification", "blockedReason", "allowedOutputUse",
];

// ============================================================================
// SOURCE PASSAGE SUFFICIENCY
// ============================================================================

type PassageSupportStatus = "direct_support" | "partial_support" | "contextual_support" | "ambiguous" | "contradictory" | "no_support";

const PASSAGE_SUPPORT_STATUSES: readonly PassageSupportStatus[] = [
  "direct_support", "partial_support", "contextual_support", "ambiguous", "contradictory", "no_support",
];

export const PASSAGE_SUFFICIENCY_REJECTIONS: readonly string[] = [
  "source title alone", "page metadata alone", "search snippet alone", "nearby but unrelated passage",
  "broad source citation for a specific claim", "citation to a page that contradicts the generated sentence",
];

/** High-risk definitive claims require direct_support unless a separately authorized interpretive rule exists. */
const HIGH_RISK_DEFINITIVE_REQUIRES_DIRECT_SUPPORT = true as const;

// ============================================================================
// FRESHNESS CONTRACT
// ============================================================================

type FreshnessStatus =
  | "current_verified"
  | "current_unreviewed"
  | "review_due"
  | "changed_pending_review"
  | "superseded"
  | "expired"
  | "unavailable"
  | "disputed"
  | "effective_date_unknown";

const FRESHNESS_STATUSES: readonly FreshnessStatus[] = [
  "current_verified", "current_unreviewed", "review_due", "changed_pending_review",
  "superseded", "expired", "unavailable", "disputed", "effective_date_unknown",
];

export const FRESHNESS_RULES: readonly string[] = [
  "retrievedAt does not prove current legal validity.",
  "publishedAt does not automatically equal effectiveFrom.",
  "lastModified does not automatically mean legal change.",
  "current_unreviewed must not support high-risk definitive claims.",
  "changed_pending_review must block high-risk use.",
  "superseded and expired sources cannot support current claims.",
  "unavailable sources may retain historical evidentiary value but not fresh operational authority.",
  "effective_date_unknown blocks date-sensitive definitive claims.",
];

// ============================================================================
// REVIEW CONTRACT
// ============================================================================

type ReviewStatus = "unreviewed" | "machine_prechecked" | "human_reviewed" | "expert_reviewed" | "rejected" | "review_required" | "archived";

const REVIEW_STATUSES: readonly ReviewStatus[] = [
  "unreviewed", "machine_prechecked", "human_reviewed", "expert_reviewed", "rejected", "review_required", "archived",
];

export const REVIEW_POLICY: readonly string[] = [
  "Low-risk orientation may use human-reviewed official guidance.",
  "Medium-risk procedural claims require stronger source and review.",
  "High-risk legal/deadline/eligibility claims require authoritative source plus stricter review.",
  "Unresolved or changed sources must block definitive output.",
];

/** This contract does not claim that every source requires a lawyer. */
const EVERY_SOURCE_REQUIRES_LAWYER_CLAIMED = false as const;

// ============================================================================
// SOURCE CONFLICT MODEL
// ============================================================================

type ConflictType =
  | "no_conflict"
  | "same_level_conflict"
  | "hierarchy_conflict"
  | "jurisdiction_conflict"
  | "regional_conflict"
  | "version_conflict"
  | "authority_competence_conflict"
  | "source_passage_conflict"
  | "translation_conflict"
  | "implementation_practice_conflict"
  | "unresolved_conflict";

const CONFLICT_TYPES: readonly ConflictType[] = [
  "no_conflict", "same_level_conflict", "hierarchy_conflict", "jurisdiction_conflict", "regional_conflict",
  "version_conflict", "authority_competence_conflict", "source_passage_conflict", "translation_conflict",
  "implementation_practice_conflict", "unresolved_conflict",
];

export const CONFLICT_RESOLUTION_RULES: readonly string[] = [
  "Hierarchy conflict: a lower-weight source cannot override a higher controlling source; lower operational guidance may still describe implementation if not contradictory.",
  "Jurisdiction conflict: a Bavaria-specific rule must not be used for Berlin.",
  "Version conflict: the currently effective version controls current claims; historical versions remain available for historical-date questions.",
  "Authority competence conflict: if two bodies appear competent and responsibility is unresolved, Birello must not issue a definitive instruction.",
  "Translation conflict: the original authoritative German source controls; the translation must be reviewed or qualified.",
];

// ============================================================================
// HIGH-RISK CLAIM CONTRACT
// ============================================================================

const HIGH_RISK_CATEGORIES: readonly string[] = [
  "exact legal deadline", "appeal deadline", "loss-of-right warning", "payment obligation",
  "enforcement consequence", "immigration status", "benefit eligibility", "tax liability",
  "authority competence", "mandatory filing", "required legal form", "cross-border responsible actor",
  "legal status confirmation",
];

interface HighRiskRequirement {
  eligibleAuthoritativeSourceType: boolean;
  directSourcePassage: boolean;
  correctJurisdiction: boolean;
  correctAuthorityOrCompetentPublisher: boolean;
  effectiveDateAccepted: boolean;
  freshnessAccepted: boolean;
  reviewStatusAccepted: boolean;
  noUnresolvedConflict: boolean;
  claimWithinSourceScope: boolean;
  citationPresent: boolean;
  safetyBoundaryAccepted: boolean;
}

const HIGH_RISK_REQUIREMENT_FIELDS: readonly (keyof HighRiskRequirement)[] = [
  "eligibleAuthoritativeSourceType", "directSourcePassage", "correctJurisdiction",
  "correctAuthorityOrCompetentPublisher", "effectiveDateAccepted", "freshnessAccepted",
  "reviewStatusAccepted", "noUnresolvedConflict", "claimWithinSourceScope", "citationPresent",
  "safetyBoundaryAccepted",
];

export const HIGH_RISK_FAILURE_BEHAVIOR: readonly string[] = [
  "do not fabricate", "do not soften into certainty", "block definitive output", "return uncertainty and safe verification step",
];

// ============================================================================
// ALLOWED-USE MATRIX (contextual, per claim — not a single global toggle)
// ============================================================================

type AllowedUse =
  | "general_orientation"
  | "terminology_explanation"
  | "procedural_guidance"
  | "localized_summary"
  | "safe_next_step"
  | "deadline_warning"
  | "exact_deadline"
  | "eligibility_statement"
  | "legal_status_statement"
  | "cross_border_instruction"
  | "generated_official_response";

const ALLOWED_USES: readonly AllowedUse[] = [
  "general_orientation", "terminology_explanation", "procedural_guidance", "localized_summary",
  "safe_next_step", "deadline_warning", "exact_deadline", "eligibility_statement",
  "legal_status_statement", "cross_border_instruction", "generated_official_response",
];

/** Example: an official FAQ may support general orientation but not exact legal eligibility. */
export const OFFICIAL_FAQ_ALLOWED_USE: readonly AllowedUse[] = ["general_orientation", "terminology_explanation", "procedural_guidance", "localized_summary"];
export const OFFICIAL_FAQ_BLOCKED_USE: readonly AllowedUse[] = ["exact_deadline", "eligibility_statement", "legal_status_statement"];

// ============================================================================
// SECONDARY SOURCES
// ============================================================================

const SECONDARY_SOURCE_MAY: readonly string[] = [
  "clarify terminology", "support low-risk orientation", "help identify source conflicts", "provide expert commentary",
];
const SECONDARY_SOURCE_MUST_NOT: readonly string[] = [
  "replace a controlling primary source", "establish current legal effect alone",
  "establish authority competence alone", "establish exact deadline alone", "override official source text",
];

// ============================================================================
// COURT DECISION CONTRACT
// ============================================================================

interface CourtDecisionContract {
  court: string;
  caseNumber: string;
  decisionDate: string;
  jurisdiction: string;
  courtLevel: string;
  precedentialRelevance?: string;
  factsScope: string;
  legalIssue: string;
  finalityStatus: string;
  citedProvision?: string;
  applicabilityConstraints: readonly string[];
}

const COURT_DECISION_FIELDS: readonly (keyof CourtDecisionContract)[] = [
  "court", "caseNumber", "decisionDate", "jurisdiction", "courtLevel", "precedentialRelevance",
  "factsScope", "legalIssue", "finalityStatus", "citedProvision", "applicabilityConstraints",
];

/** A decision must never be treated as a universal rule without explicit interpretive review. */
const COURT_DECISION_UNIVERSAL_RULE_WITHOUT_REVIEW_ALLOWED = false as const;

// ============================================================================
// OFFICIAL FORM CONTRACT
// ============================================================================

const OFFICIAL_FORM_MAY_SUPPORT: readonly string[] = [
  "required fields", "named attachments", "submission channel", "declared purpose",
];
export const OFFICIAL_FORM_MAY_NOT_ALONE_PROVE: readonly string[] = [
  "legal eligibility", "full list of exceptions", "exact legal entitlement",
  "universal authority competence", "current fee unless explicitly stated and effective",
];

// ============================================================================
// OFFICIAL FAQ CONTRACT
// ============================================================================

const OFFICIAL_FAQ_MAY_SUPPORT: readonly string[] = ["public explanation", "common procedure", "low- or medium-risk orientation"];
export const OFFICIAL_FAQ_MUST_NOT_OVERRIDE: readonly string[] = ["legislation", "regulation", "binding decision", "controlling current procedure"];

// ============================================================================
// REGIONAL AND MUNICIPAL TRUST
// ============================================================================

const REGIONAL_TRUST_REQUIREMENTS: readonly string[] = [
  "exact Land or municipal scope", "authority identity", "territorial competence",
  "source effective date", "no nationwide generalization",
];

/** A local page may be highly authoritative for that local process, while invalid elsewhere. */
export const LOCAL_AUTHORITY_MAY_BE_INVALID_ELSEWHERE = true as const;

// ============================================================================
// EU / DE / V4 TRUST DOMAIN SEPARATION
// ============================================================================

type TrustDomain = "eu_trust_domain" | "de_trust_domain" | "sk_trust_domain" | "cz_trust_domain" | "pl_trust_domain" | "hu_trust_domain";

const TRUST_DOMAINS: readonly TrustDomain[] = [
  "eu_trust_domain", "de_trust_domain", "sk_trust_domain", "cz_trust_domain", "pl_trust_domain", "hu_trust_domain",
];

export const CROSS_DOMAIN_PROHIBITIONS: readonly string[] = [
  "One German source must not establish Slovak authority procedure.",
  "One Slovak source must not establish German legal entitlement.",
  "One EU source must not establish a local office workflow unless it explicitly does so.",
];

// ============================================================================
// CROSS-BORDER EVIDENCE CONTRACT
// ============================================================================

type CrossBorderEvidenceCompleteness =
  | "complete"
  | "eu_only"
  | "german_only"
  | "foreign_only"
  | "missing_responsible_actor"
  | "missing_competent_authority"
  | "conflicting_jurisdictions"
  | "stale_source"
  | "unresolved";

const CROSS_BORDER_EVIDENCE_STATES: readonly CrossBorderEvidenceCompleteness[] = [
  "complete", "eu_only", "german_only", "foreign_only", "missing_responsible_actor",
  "missing_competent_authority", "conflicting_jurisdictions", "stale_source", "unresolved",
];

export const CROSS_BORDER_CONCRETE_INSTRUCTION_REQUIREMENTS: readonly string[] = [
  "EU rule where applicable", "German source where German procedure is involved",
  "connected-country source where foreign procedure is involved", "responsible actor resolved",
  "authority competence resolved", "current versions", "citations for each required trust domain",
];

// ============================================================================
// RESPONSIBLE ACTOR TRUST
// ============================================================================

type ResponsibleActorState =
  | "user_must_act"
  | "german_authority_must_act"
  | "foreign_authority_must_act"
  | "institution_exchange_expected"
  | "responsibility_unresolved"
  | "professional_confirmation_required";

const RESPONSIBLE_ACTOR_STATES: readonly ResponsibleActorState[] = [
  "user_must_act", "german_authority_must_act", "foreign_authority_must_act",
  "institution_exchange_expected", "responsibility_unresolved", "professional_confirmation_required",
];

export const RESPONSIBLE_ACTOR_CONCRETE_INSTRUCTION_REQUIREMENTS: readonly string[] = [
  "actor is resolved", "supporting source exists", "source is competent", "scope matches", "no conflict remains",
];

// ============================================================================
// LANGUAGE AND TRANSLATION TRUST
// ============================================================================

type TranslationState =
  | "source_language_original"
  | "human_reviewed_translation"
  | "expert_reviewed_terminology"
  | "machine_translation_unreviewed"
  | "machine_translation_reviewed"
  | "translation_conflict"
  | "translation_unavailable";

const TRANSLATION_STATES: readonly TranslationState[] = [
  "source_language_original", "human_reviewed_translation", "expert_reviewed_terminology",
  "machine_translation_unreviewed", "machine_translation_reviewed", "translation_conflict", "translation_unavailable",
];

export const TRANSLATION_TRUST_RULES: readonly string[] = [
  "Localized explanation may be user-facing.",
  "Citation must point to original source.",
  "German official term remains available.",
  "Translation must not increase certainty.",
  "Translation must not remove warnings.",
  "Translation must not alter urgency.",
  "Translation conflict blocks high-risk localized certainty.",
];

// ============================================================================
// SOURCE URL AND DOMAIN TRUST (design only — no real verification implemented)
// ============================================================================

type SourceUrlTrustCategory =
  | "canonical_official_domain"
  | "official_subdomain"
  | "delegated_official_service_provider"
  | "archived_official_page"
  | "redirect"
  | "mirror"
  | "unofficial_copy"
  | "url_shortener"
  | "search_cache";

const SOURCE_URL_TRUST_CATEGORIES: readonly SourceUrlTrustCategory[] = [
  "canonical_official_domain", "official_subdomain", "delegated_official_service_provider",
  "archived_official_page", "redirect", "mirror", "unofficial_copy", "url_shortener", "search_cache",
];

/** A familiar-looking domain is not sufficient proof; real verification is not implemented in this phase. */
const FAMILIAR_LOOKING_DOMAIN_IS_SUFFICIENT_PROOF = false as const;
const REAL_DOMAIN_VERIFICATION_IMPLEMENTED_THIS_PHASE = false as const;

// ============================================================================
// CONTENT HASH AND CHANGE DETECTION
// ============================================================================

type ChangeDetectionState = "unchanged" | "metadata_only_change" | "substantive_change" | "unknown_change" | "source_removed" | "source_redirected";

const CHANGE_DETECTION_STATES: readonly ChangeDetectionState[] = [
  "unchanged", "metadata_only_change", "substantive_change", "unknown_change", "source_removed", "source_redirected",
];

export const CHANGE_DETECTION_RULES: readonly string[] = [
  "A content change must not automatically become trusted current content.",
  "High-risk substantive change must enter review_required or changed_pending_review.",
];

// ============================================================================
// KNOWLEDGE ANSWER ENVELOPE TRUST SUMMARY
// ============================================================================

interface KnowledgeAnswerEnvelopeTrust {
  answerId: string;
  market?: "DE";
  outputLocale: string;
  claimDecisions: readonly TrustDecision[];
  authorizedClaims: readonly string[];
  qualifiedClaims: readonly string[];
  blockedClaims: readonly string[];
  citations: readonly string[];
  sourceVersions: readonly string[];
  jurisdictionContext?: string;
  authorityContext?: string;
  crossBorderContext?: string;
  freshnessSummary?: string;
  conflictSummary?: string;
  reviewSummary?: string;
  safetyWarnings: readonly string[];
  generatedAt: string;
  knowledgeCutoff?: string;
  userContentPersisted: false;
}

const KNOWLEDGE_ANSWER_ENVELOPE_FIELDS: readonly (keyof KnowledgeAnswerEnvelopeTrust)[] = [
  "answerId", "market", "outputLocale", "claimDecisions", "authorizedClaims", "qualifiedClaims",
  "blockedClaims", "citations", "sourceVersions", "jurisdictionContext", "authorityContext",
  "crossBorderContext", "freshnessSummary", "conflictSummary", "reviewSummary", "safetyWarnings",
  "generatedAt", "knowledgeCutoff", "userContentPersisted",
];

/** The envelope must never mark a blocked claim as a user-facing fact. */
const ENVELOPE_MAY_MARK_BLOCKED_CLAIM_AS_FACT = false as const;

// ============================================================================
// CONSERVATIVE FAILURE BEHAVIOR
// ============================================================================

const CONSERVATIVE_FAILURE_PHRASES: readonly string[] = [
  "This cannot be confirmed from the currently authorized sources.",
  "The competent authority is not yet resolved.",
  "The exact deadline cannot be safely calculated.",
  "The source changed and is awaiting review.",
  "Please verify this with the named official authority.",
];

const PREFERS_PLAUSIBLE_UNSUPPORTED_ANSWER = false as const;

// ============================================================================
// KNOWN OPEN DEBTS (inherited)
// ============================================================================

const KNOWN_OPEN_DEBTS: readonly string[] = [
  "HEIC/HEIF support", "EXIF orientation normalization", "Decoded pixel bounds",
  "Serverless/Vercel OCR validation", "Physical Android camera-image validation",
  "Genuine iOS camera-image validation", "Distributed production rate limiter",
  "Standalone Smart Talk extraction from the DNA shell", "Final production payment flow",
  "German knowledge population (no real sources ingested by 9A or 9B)",
  "V4 cross-border connector implementation and localization parity",
];

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9B";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceArchitectureReadyForTrustContract: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  databaseMigrationCreated: boolean;
  databaseWritePerformed: boolean;
  networkAccessPerformed: boolean;
  externalSourceDownloaded: boolean;
  realSourceRegistered: boolean;
  realSourcePassageStored: boolean;
  realClaimPopulated: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  sourceTypeContractDefined: boolean;
  legalWeightContractDefined: boolean;
  claimTypeEligibilityDefined: boolean;
  publisherCompetenceDefined: boolean;
  sourcePurposeDefined: boolean;
  trustDecisionModelDefined: boolean;
  sourcePassageSufficiencyDefined: boolean;
  freshnessContractDefined: boolean;
  reviewContractDefined: boolean;
  sourceConflictModelDefined: boolean;
  highRiskClaimContractDefined: boolean;
  allowedUseMatrixDefined: boolean;
  discoveryOnlyContractDefined: boolean;
  secondarySourceContractDefined: boolean;
  courtDecisionContractDefined: boolean;
  officialFormContractDefined: boolean;
  officialFaqContractDefined: boolean;
  regionalTrustContractDefined: boolean;
  trustDomainsDefined: boolean;
  crossBorderEvidenceContractDefined: boolean;
  responsibleActorTrustDefined: boolean;
  translationTrustDefined: boolean;
  officialDomainVerificationDesigned: boolean;
  changeDetectionContractDefined: boolean;
  knowledgeAnswerEnvelopeTrustDefined: boolean;
  conservativeFailureBehaviorDefined: boolean;

  germanTrustDomainRecorded: boolean;
  euTrustDomainRecorded: boolean;
  skTrustDomainRecorded: boolean;
  czTrustDomainRecorded: boolean;
  plTrustDomainRecorded: boolean;
  huTrustDomainRecorded: boolean;

  sixLaunchLocalesRecorded: boolean;
  originalGermanSourceRemainsAuthoritative: boolean;
  translationCannotIncreaseCertainty: boolean;
  translationCannotRemoveWarnings: boolean;

  highRiskRequiresDirectEvidence: boolean;
  highRiskRequiresJurisdictionMatch: boolean;
  highRiskRequiresEffectiveDateAcceptance: boolean;
  highRiskRequiresConflictClearance: boolean;
  highRiskRequiresCitation: boolean;
  modelCannotOverrideTrustDecision: boolean;
  discoverySourceCannotSupportHighRiskClaim: boolean;
  retrievedAtNotEqualEffectiveFrom: boolean;

  zeroRealSourcesIngested: boolean;
  zeroRealClaimsPopulated: boolean;

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

  readyForGermanJurisdictionEffectiveDateModel: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  globalTrustScoreAsSoleDecisionAccepted: boolean;
  officialSourceAutomaticallyUniversalAccepted: boolean;
  newestSourceAutomaticallyEffectiveAccepted: boolean;
  translatedSourceTreatedAsAuthoritativeOriginalAccepted: boolean;
  searchRankingTreatedAsAuthorityAccepted: boolean;
  officialPublisherCompetenceIgnoredAccepted: boolean;
  territorialCompetenceIgnoredAccepted: boolean;
  sourcePurposeIgnoredAccepted: boolean;
  faqTreatedAsLegislationAccepted: boolean;
  formTreatedAsFullLegalEntitlementAccepted: boolean;
  blogSupportsHighRiskClaimAccepted: boolean;
  forumSupportsHighRiskClaimAccepted: boolean;
  seoArticleSupportsHighRiskClaimAccepted: boolean;
  socialMediaSupportsHighRiskClaimAccepted: boolean;
  modelTextTreatedAsSourceAccepted: boolean;
  searchSnippetTreatedAsSourcePassageAccepted: boolean;
  pageTitleAloneSupportsClaimAccepted: boolean;
  broadCitationSupportsPreciseClaimAccepted: boolean;
  contradictoryPassageAcceptedFlag: boolean;
  ambiguousPassageTreatedAsDirectSupportAccepted: boolean;
  partialSupportTreatedAsFullHighRiskSupportAccepted: boolean;
  retrievedAtTreatedAsEffectiveFromAccepted: boolean;
  publishedAtTreatedAsEffectiveFromAccepted: boolean;
  lastModifiedTreatedAsLegalChangeAccepted: boolean;
  currentUnreviewedSupportsHighRiskCertaintyAccepted: boolean;
  changedPendingReviewSupportsHighRiskCertaintyAccepted: boolean;
  expiredSourceSupportsCurrentClaimAccepted: boolean;
  supersededSourceSupportsCurrentClaimAccepted: boolean;
  effectiveDateUnknownAcceptedForDateSensitiveClaimAccepted: boolean;
  unreviewedSourceAcceptedForHighRiskClaimAccepted: boolean;
  rejectedSourceAcceptedFlag: boolean;
  reviewRequiredIgnoredAccepted: boolean;
  conflictIgnoredAccepted: boolean;
  sameLevelConflictIgnoredAccepted: boolean;
  hierarchyConflictIgnoredAccepted: boolean;
  jurisdictionConflictIgnoredAccepted: boolean;
  regionalConflictIgnoredAccepted: boolean;
  versionConflictIgnoredAccepted: boolean;
  competenceConflictIgnoredAccepted: boolean;
  passageConflictIgnoredAccepted: boolean;
  translationConflictIgnoredAccepted: boolean;
  implementationPracticeConflictIgnoredAccepted: boolean;
  municipalRuleGeneralizedNationallyAccepted: boolean;
  landRuleGeneralizedFederallyAccepted: boolean;
  germanSourceEstablishesForeignProcedureAccepted: boolean;
  foreignSourceEstablishesGermanEntitlementAccepted: boolean;
  euSourceEstablishesLocalWorkflowWithoutSupportAccepted: boolean;
  crossBorderInstructionWithEuOnlyEvidenceAccepted: boolean;
  crossBorderInstructionWithGermanOnlyEvidenceAccepted: boolean;
  crossBorderInstructionWithForeignOnlyEvidenceAccepted: boolean;
  responsibleActorUnresolvedInstructionIssuedAccepted: boolean;
  authorityCompetenceUnresolvedInstructionIssuedAccepted: boolean;
  userAlwaysAssumedResponsibleActorAccepted: boolean;
  institutionExchangeIgnoredAccepted: boolean;
  deadlineWithoutTriggerEventClarityAccepted: boolean;
  deadlineWithoutDirectPassageAccepted: boolean;
  deadlineWithoutJurisdictionMatchAccepted: boolean;
  deadlineWithoutEffectiveDateAccepted: boolean;
  deadlineWithUnresolvedConflictAccepted: boolean;
  eligibilityConfirmedWithoutAuthoritativeEvidenceAccepted: boolean;
  paymentObligationConfirmedWithoutAuthoritativeEvidenceAccepted: boolean;
  immigrationStatusConfirmedWithoutAuthoritativeEvidenceAccepted: boolean;
  authorityCompetenceGuessedAccepted: boolean;
  safeNextStepConvertedIntoLegalInstructionAccepted: boolean;
  generalOrientationConvertedIntoLegalCertaintyAccepted: boolean;
  blockedClaimIncludedAsFactAccepted: boolean;
  qualifiedClaimPresentedWithoutQualificationAccepted: boolean;
  modelOverridesTrustDecisionAccepted: boolean;
  discoveryOnlySourcePassedAsAuthoritativeEvidenceAccepted: boolean;
  secondarySourceOverridesPrimarySourceAccepted: boolean;
  courtDecisionGeneralizedUniversallyAccepted: boolean;
  formTreatedAsCompleteExceptionListAccepted: boolean;
  faqOverridesLegislationAccepted: boolean;
  localPortalUsedOutsideTerritoryAccepted: boolean;
  outputLocaleDeterminesCrossBorderCountryAccepted: boolean;
  slovakLocaleAutomaticallyActivatesSkConnectorAccepted: boolean;
  englishLocaleDisablesCrossBorderContextAccepted: boolean;
  germanOfficialTermRemovedAccepted: boolean;
  translationIncreasesCertaintyAccepted: boolean;
  translationRemovesWarningAccepted: boolean;
  translationChangesUrgencyAccepted: boolean;
  translationRemovesBlockedActionAccepted: boolean;
  localizedCitationPointsOnlyToTranslationAccepted: boolean;
  officialDomainAssumedFromAppearanceAccepted: boolean;
  urlShortenerTreatedAsCanonicalAccepted: boolean;
  unofficialMirrorTreatedAsCanonicalAccepted: boolean;
  archivedPageTreatedAsCurrentAccepted: boolean;
  metadataOnlyChangeTreatedAsSubstantiveAccepted: boolean;
  substantiveChangeTrustedWithoutReviewAccepted: boolean;
  removedSourceTreatedAsCurrentAccepted: boolean;
  envelopeMarksBlockedClaimsAuthorizedAccepted: boolean;
  envelopePersistsUserContentAccepted: boolean;
  germanKnowledgeClaimedPopulatedAccepted: boolean;
  v4ConnectorsClaimedPopulatedAccepted: boolean;
  sixLanguagesClaimedProductionReadyAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  sourceTypes: readonly SourceType[];
  legalWeights: readonly LegalWeight[];
  contextualTrustStatements: readonly string[];
  claimTypeEligibility: readonly ClaimTypeEligibility[];
  publisherCompetenceCategories: readonly PublisherCompetenceCategory[];
  sourcePurposes: readonly SourcePurpose[];
  officialSourceRegistryFields: readonly string[];
  trustDecisionOutcomes: readonly TrustDecisionOutcome[];
  trustDecisionFields: readonly string[];
  passageSupportStatuses: readonly PassageSupportStatus[];
  freshnessStatuses: readonly FreshnessStatus[];
  reviewStatuses: readonly ReviewStatus[];
  conflictTypes: readonly ConflictType[];
  highRiskCategories: readonly string[];
  highRiskRequirementFields: readonly string[];
  allowedUses: readonly AllowedUse[];
  discoveryOnlyExamples: readonly string[];
  secondarySourceMay: readonly string[];
  secondarySourceMustNot: readonly string[];
  courtDecisionFields: readonly string[];
  officialFormMaySupport: readonly string[];
  officialFaqMaySupport: readonly string[];
  regionalTrustRequirements: readonly string[];
  trustDomains: readonly TrustDomain[];
  crossBorderEvidenceStates: readonly CrossBorderEvidenceCompleteness[];
  responsibleActorStates: readonly ResponsibleActorState[];
  translationStates: readonly TranslationState[];
  sourceUrlTrustCategories: readonly SourceUrlTrustCategory[];
  changeDetectionStates: readonly ChangeDetectionState[];
  knowledgeAnswerEnvelopeFields: readonly string[];
  conservativeFailurePhrases: readonly string[];
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
  { id: 1, description: "source commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 2, description: "PHASE 9A missing", mutate: (r) => { r.sourceArchitectureCheckId = "missing"; } },
  { id: 3, description: "source architecture not ready", mutate: (r) => { r.sourceArchitectureReadyForTrustContract = false; } },
  { id: 4, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 5, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 6, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 7, description: "database migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 8, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 9, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 10, description: "real source downloaded", mutate: (r) => { r.externalSourceDownloaded = true; } },
  { id: 11, description: "real source registered", mutate: (r) => { r.realSourceRegistered = true; } },
  { id: 12, description: "real source passage stored", mutate: (r) => { r.realSourcePassageStored = true; } },
  { id: 13, description: "real claim populated", mutate: (r) => { r.realClaimPopulated = true; } },
  { id: 14, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 15, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 16, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 17, description: "retrieval executed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 18, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 19, description: "one global trust score accepted as sole decision", mutate: (r) => { r.globalTrustScoreAsSoleDecisionAccepted = true; } },
  { id: 20, description: "official source automatically universally applicable", mutate: (r) => { r.officialSourceAutomaticallyUniversalAccepted = true; } },
  { id: 21, description: "newest source automatically effective", mutate: (r) => { r.newestSourceAutomaticallyEffectiveAccepted = true; } },
  { id: 22, description: "translated source treated as authoritative original", mutate: (r) => { r.translatedSourceTreatedAsAuthoritativeOriginalAccepted = true; } },
  { id: 23, description: "search ranking treated as authority", mutate: (r) => { r.searchRankingTreatedAsAuthorityAccepted = true; } },
  { id: 24, description: "official publisher competence ignored", mutate: (r) => { r.officialPublisherCompetenceIgnoredAccepted = true; } },
  { id: 25, description: "territorial competence ignored", mutate: (r) => { r.territorialCompetenceIgnoredAccepted = true; } },
  { id: 26, description: "source purpose ignored", mutate: (r) => { r.sourcePurposeIgnoredAccepted = true; } },
  { id: 27, description: "FAQ treated as legislation", mutate: (r) => { r.faqTreatedAsLegislationAccepted = true; } },
  { id: 28, description: "form treated as full legal entitlement", mutate: (r) => { r.formTreatedAsFullLegalEntitlementAccepted = true; } },
  { id: 29, description: "blog supports high-risk claim", mutate: (r) => { r.blogSupportsHighRiskClaimAccepted = true; } },
  { id: 30, description: "forum supports high-risk claim", mutate: (r) => { r.forumSupportsHighRiskClaimAccepted = true; } },
  { id: 31, description: "SEO article supports high-risk claim", mutate: (r) => { r.seoArticleSupportsHighRiskClaimAccepted = true; } },
  { id: 32, description: "social media supports high-risk claim", mutate: (r) => { r.socialMediaSupportsHighRiskClaimAccepted = true; } },
  { id: 33, description: "model text treated as source", mutate: (r) => { r.modelTextTreatedAsSourceAccepted = true; } },
  { id: 34, description: "search snippet treated as source passage", mutate: (r) => { r.searchSnippetTreatedAsSourcePassageAccepted = true; } },
  { id: 35, description: "page title alone supports claim", mutate: (r) => { r.pageTitleAloneSupportsClaimAccepted = true; } },
  { id: 36, description: "broad citation supports precise claim", mutate: (r) => { r.broadCitationSupportsPreciseClaimAccepted = true; } },
  { id: 37, description: "contradictory passage accepted", mutate: (r) => { r.contradictoryPassageAcceptedFlag = true; } },
  { id: 38, description: "ambiguous passage treated as direct support", mutate: (r) => { r.ambiguousPassageTreatedAsDirectSupportAccepted = true; } },
  { id: 39, description: "partial support treated as full high-risk support", mutate: (r) => { r.partialSupportTreatedAsFullHighRiskSupportAccepted = true; } },
  { id: 40, description: "retrievedAt treated as effectiveFrom", mutate: (r) => { r.retrievedAtTreatedAsEffectiveFromAccepted = true; } },
  { id: 41, description: "publishedAt treated as effectiveFrom automatically", mutate: (r) => { r.publishedAtTreatedAsEffectiveFromAccepted = true; } },
  { id: 42, description: "lastModified treated as legal change automatically", mutate: (r) => { r.lastModifiedTreatedAsLegalChangeAccepted = true; } },
  { id: 43, description: "current_unreviewed supports high-risk certainty", mutate: (r) => { r.currentUnreviewedSupportsHighRiskCertaintyAccepted = true; } },
  { id: 44, description: "changed_pending_review supports high-risk certainty", mutate: (r) => { r.changedPendingReviewSupportsHighRiskCertaintyAccepted = true; } },
  { id: 45, description: "expired source supports current claim", mutate: (r) => { r.expiredSourceSupportsCurrentClaimAccepted = true; } },
  { id: 46, description: "superseded source supports current claim", mutate: (r) => { r.supersededSourceSupportsCurrentClaimAccepted = true; } },
  { id: 47, description: "effective-date unknown accepted for date-sensitive claim", mutate: (r) => { r.effectiveDateUnknownAcceptedForDateSensitiveClaimAccepted = true; } },
  { id: 48, description: "unreviewed source accepted for high-risk claim", mutate: (r) => { r.unreviewedSourceAcceptedForHighRiskClaimAccepted = true; } },
  { id: 49, description: "rejected source accepted", mutate: (r) => { r.rejectedSourceAcceptedFlag = true; } },
  { id: 50, description: "review_required ignored", mutate: (r) => { r.reviewRequiredIgnoredAccepted = true; } },
  { id: 51, description: "conflict ignored", mutate: (r) => { r.conflictIgnoredAccepted = true; } },
  { id: 52, description: "same-level conflict ignored", mutate: (r) => { r.sameLevelConflictIgnoredAccepted = true; } },
  { id: 53, description: "hierarchy conflict ignored", mutate: (r) => { r.hierarchyConflictIgnoredAccepted = true; } },
  { id: 54, description: "jurisdiction conflict ignored", mutate: (r) => { r.jurisdictionConflictIgnoredAccepted = true; } },
  { id: 55, description: "regional conflict ignored", mutate: (r) => { r.regionalConflictIgnoredAccepted = true; } },
  { id: 56, description: "version conflict ignored", mutate: (r) => { r.versionConflictIgnoredAccepted = true; } },
  { id: 57, description: "competence conflict ignored", mutate: (r) => { r.competenceConflictIgnoredAccepted = true; } },
  { id: 58, description: "passage conflict ignored", mutate: (r) => { r.passageConflictIgnoredAccepted = true; } },
  { id: 59, description: "translation conflict ignored", mutate: (r) => { r.translationConflictIgnoredAccepted = true; } },
  { id: 60, description: "implementation-practice conflict ignored", mutate: (r) => { r.implementationPracticeConflictIgnoredAccepted = true; } },
  { id: 61, description: "municipal rule generalized nationally", mutate: (r) => { r.municipalRuleGeneralizedNationallyAccepted = true; } },
  { id: 62, description: "Land rule generalized federally", mutate: (r) => { r.landRuleGeneralizedFederallyAccepted = true; } },
  { id: 63, description: "German source establishes foreign procedure", mutate: (r) => { r.germanSourceEstablishesForeignProcedureAccepted = true; } },
  { id: 64, description: "foreign source establishes German entitlement", mutate: (r) => { r.foreignSourceEstablishesGermanEntitlementAccepted = true; } },
  { id: 65, description: "EU source establishes local workflow without support", mutate: (r) => { r.euSourceEstablishesLocalWorkflowWithoutSupportAccepted = true; } },
  { id: 66, description: "cross-border instruction issued with EU-only evidence", mutate: (r) => { r.crossBorderInstructionWithEuOnlyEvidenceAccepted = true; } },
  { id: 67, description: "cross-border instruction issued with German-only evidence", mutate: (r) => { r.crossBorderInstructionWithGermanOnlyEvidenceAccepted = true; } },
  { id: 68, description: "cross-border instruction issued with foreign-only evidence", mutate: (r) => { r.crossBorderInstructionWithForeignOnlyEvidenceAccepted = true; } },
  { id: 69, description: "responsible actor unresolved but instruction issued", mutate: (r) => { r.responsibleActorUnresolvedInstructionIssuedAccepted = true; } },
  { id: 70, description: "authority competence unresolved but instruction issued", mutate: (r) => { r.authorityCompetenceUnresolvedInstructionIssuedAccepted = true; } },
  { id: 71, description: "user always assumed responsible actor", mutate: (r) => { r.userAlwaysAssumedResponsibleActorAccepted = true; } },
  { id: 72, description: "institution exchange ignored", mutate: (r) => { r.institutionExchangeIgnoredAccepted = true; } },
  { id: 73, description: "deadline issued without trigger-event clarity", mutate: (r) => { r.deadlineWithoutTriggerEventClarityAccepted = true; } },
  { id: 74, description: "deadline issued without direct passage", mutate: (r) => { r.deadlineWithoutDirectPassageAccepted = true; } },
  { id: 75, description: "deadline issued without jurisdiction match", mutate: (r) => { r.deadlineWithoutJurisdictionMatchAccepted = true; } },
  { id: 76, description: "deadline issued without effective date", mutate: (r) => { r.deadlineWithoutEffectiveDateAccepted = true; } },
  { id: 77, description: "deadline issued with unresolved conflict", mutate: (r) => { r.deadlineWithUnresolvedConflictAccepted = true; } },
  { id: 78, description: "eligibility confirmed without authoritative evidence", mutate: (r) => { r.eligibilityConfirmedWithoutAuthoritativeEvidenceAccepted = true; } },
  { id: 79, description: "payment obligation confirmed without authoritative evidence", mutate: (r) => { r.paymentObligationConfirmedWithoutAuthoritativeEvidenceAccepted = true; } },
  { id: 80, description: "immigration status confirmed without authoritative evidence", mutate: (r) => { r.immigrationStatusConfirmedWithoutAuthoritativeEvidenceAccepted = true; } },
  { id: 81, description: "authority competence guessed", mutate: (r) => { r.authorityCompetenceGuessedAccepted = true; } },
  { id: 82, description: "safe-next-step converted into legal instruction", mutate: (r) => { r.safeNextStepConvertedIntoLegalInstructionAccepted = true; } },
  { id: 83, description: "general orientation converted into legal certainty", mutate: (r) => { r.generalOrientationConvertedIntoLegalCertaintyAccepted = true; } },
  { id: 84, description: "blocked claim included as fact", mutate: (r) => { r.blockedClaimIncludedAsFactAccepted = true; } },
  { id: 85, description: "qualified claim presented without qualification", mutate: (r) => { r.qualifiedClaimPresentedWithoutQualificationAccepted = true; } },
  { id: 86, description: "model overrides deterministic trust decision", mutate: (r) => { r.modelOverridesTrustDecisionAccepted = true; } },
  { id: 87, description: "discovery-only source passed to model as authoritative evidence", mutate: (r) => { r.discoveryOnlySourcePassedAsAuthoritativeEvidenceAccepted = true; } },
  { id: 88, description: "secondary source overrides primary source", mutate: (r) => { r.secondarySourceOverridesPrimarySourceAccepted = true; } },
  { id: 89, description: "court decision generalized universally", mutate: (r) => { r.courtDecisionGeneralizedUniversallyAccepted = true; } },
  { id: 90, description: "form treated as complete exception list", mutate: (r) => { r.formTreatedAsCompleteExceptionListAccepted = true; } },
  { id: 91, description: "FAQ overrides legislation", mutate: (r) => { r.faqOverridesLegislationAccepted = true; } },
  { id: 92, description: "local portal used outside its territory", mutate: (r) => { r.localPortalUsedOutsideTerritoryAccepted = true; } },
  { id: 93, description: "output locale determines cross-border country", mutate: (r) => { r.outputLocaleDeterminesCrossBorderCountryAccepted = true; } },
  { id: 94, description: "Slovak locale automatically activates SK connector", mutate: (r) => { r.slovakLocaleAutomaticallyActivatesSkConnectorAccepted = true; } },
  { id: 95, description: "English locale disables cross-border context", mutate: (r) => { r.englishLocaleDisablesCrossBorderContextAccepted = true; } },
  { id: 96, description: "German official term removed", mutate: (r) => { r.germanOfficialTermRemovedAccepted = true; } },
  { id: 97, description: "translation increases certainty", mutate: (r) => { r.translationIncreasesCertaintyAccepted = true; } },
  { id: 98, description: "translation removes warning", mutate: (r) => { r.translationRemovesWarningAccepted = true; } },
  { id: 99, description: "translation changes urgency", mutate: (r) => { r.translationChangesUrgencyAccepted = true; } },
  { id: 100, description: "translation removes blocked action", mutate: (r) => { r.translationRemovesBlockedActionAccepted = true; } },
  { id: 101, description: "localized citation points only to translation", mutate: (r) => { r.localizedCitationPointsOnlyToTranslationAccepted = true; } },
  { id: 102, description: "official domain assumed from appearance", mutate: (r) => { r.officialDomainAssumedFromAppearanceAccepted = true; } },
  { id: 103, description: "URL shortener treated as canonical official source", mutate: (r) => { r.urlShortenerTreatedAsCanonicalAccepted = true; } },
  { id: 104, description: "unofficial mirror treated as canonical", mutate: (r) => { r.unofficialMirrorTreatedAsCanonicalAccepted = true; } },
  { id: 105, description: "archived page treated as current automatically", mutate: (r) => { r.archivedPageTreatedAsCurrentAccepted = true; } },
  { id: 106, description: "metadata-only change treated as substantive", mutate: (r) => { r.metadataOnlyChangeTreatedAsSubstantiveAccepted = true; } },
  { id: 107, description: "substantive change trusted without review", mutate: (r) => { r.substantiveChangeTrustedWithoutReviewAccepted = true; } },
  { id: 108, description: "removed source treated as current", mutate: (r) => { r.removedSourceTreatedAsCurrentAccepted = true; } },
  { id: 109, description: "answer envelope marks blocked claims authorized", mutate: (r) => { r.envelopeMarksBlockedClaimsAuthorizedAccepted = true; } },
  { id: 110, description: "answer envelope persists user content", mutate: (r) => { r.envelopePersistsUserContentAccepted = true; } },
  { id: 111, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 112, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 113, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 114, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 115, description: "German knowledge claimed populated", mutate: (r) => { r.germanKnowledgeClaimedPopulatedAccepted = true; r.germanKnowledgePopulationStillOpen = false; } },
  { id: 116, description: "V4 connectors claimed populated", mutate: (r) => { r.v4ConnectorsClaimedPopulatedAccepted = true; } },
  { id: 117, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguagesClaimedProductionReadyAccepted = true; } },
  { id: 118, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 119, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 120, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 121, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 122, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 123, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 124, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 125, description: "audit passes with unexpected changed file", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 126, description: "audit passes if any source was ingested", mutate: (r) => { r.zeroRealSourcesIngested = false; r.realSourceRegistered = true; } },
  { id: 127, description: "audit passes if any high-risk rule is weakened", mutate: (r) => { r.highRiskRequiresDirectEvidence = false; } },
  { id: 128, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
  { id: 129, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9C"; } },
  { id: 130, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
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
    r.checkId === "9B",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceArchitectureReadyForTrustContract === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.databaseMigrationCreated === false,
    r.databaseWritePerformed === false,
    r.networkAccessPerformed === false,
    r.externalSourceDownloaded === false,
    r.realSourceRegistered === false,
    r.realSourcePassageStored === false,
    r.realClaimPopulated === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,

    r.sourceTypeContractDefined === true,
    r.legalWeightContractDefined === true,
    r.claimTypeEligibilityDefined === true,
    r.publisherCompetenceDefined === true,
    r.sourcePurposeDefined === true,
    r.trustDecisionModelDefined === true,
    r.sourcePassageSufficiencyDefined === true,
    r.freshnessContractDefined === true,
    r.reviewContractDefined === true,
    r.sourceConflictModelDefined === true,
    r.highRiskClaimContractDefined === true,
    r.allowedUseMatrixDefined === true,
    r.discoveryOnlyContractDefined === true,
    r.secondarySourceContractDefined === true,
    r.courtDecisionContractDefined === true,
    r.officialFormContractDefined === true,
    r.officialFaqContractDefined === true,
    r.regionalTrustContractDefined === true,
    r.trustDomainsDefined === true,
    r.crossBorderEvidenceContractDefined === true,
    r.responsibleActorTrustDefined === true,
    r.translationTrustDefined === true,
    r.officialDomainVerificationDesigned === true,
    r.changeDetectionContractDefined === true,
    r.knowledgeAnswerEnvelopeTrustDefined === true,
    r.conservativeFailureBehaviorDefined === true,

    r.germanTrustDomainRecorded === true,
    r.euTrustDomainRecorded === true,
    r.skTrustDomainRecorded === true,
    r.czTrustDomainRecorded === true,
    r.plTrustDomainRecorded === true,
    r.huTrustDomainRecorded === true,

    r.sixLaunchLocalesRecorded === true,
    r.originalGermanSourceRemainsAuthoritative === true,
    r.translationCannotIncreaseCertainty === true,
    r.translationCannotRemoveWarnings === true,

    r.highRiskRequiresDirectEvidence === true,
    r.highRiskRequiresJurisdictionMatch === true,
    r.highRiskRequiresEffectiveDateAcceptance === true,
    r.highRiskRequiresConflictClearance === true,
    r.highRiskRequiresCitation === true,
    r.modelCannotOverrideTrustDecision === true,
    r.discoverySourceCannotSupportHighRiskClaim === true,
    r.retrievedAtNotEqualEffectiveFrom === true,

    r.zeroRealSourcesIngested === true,
    r.zeroRealClaimsPopulated === true,

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

    r.globalTrustScoreAsSoleDecisionAccepted === false,
    r.officialSourceAutomaticallyUniversalAccepted === false,
    r.newestSourceAutomaticallyEffectiveAccepted === false,
    r.translatedSourceTreatedAsAuthoritativeOriginalAccepted === false,
    r.searchRankingTreatedAsAuthorityAccepted === false,
    r.officialPublisherCompetenceIgnoredAccepted === false,
    r.territorialCompetenceIgnoredAccepted === false,
    r.sourcePurposeIgnoredAccepted === false,
    r.faqTreatedAsLegislationAccepted === false,
    r.formTreatedAsFullLegalEntitlementAccepted === false,
    r.blogSupportsHighRiskClaimAccepted === false,
    r.forumSupportsHighRiskClaimAccepted === false,
    r.seoArticleSupportsHighRiskClaimAccepted === false,
    r.socialMediaSupportsHighRiskClaimAccepted === false,
    r.modelTextTreatedAsSourceAccepted === false,
    r.searchSnippetTreatedAsSourcePassageAccepted === false,
    r.pageTitleAloneSupportsClaimAccepted === false,
    r.broadCitationSupportsPreciseClaimAccepted === false,
    r.contradictoryPassageAcceptedFlag === false,
    r.ambiguousPassageTreatedAsDirectSupportAccepted === false,
    r.partialSupportTreatedAsFullHighRiskSupportAccepted === false,
    r.retrievedAtTreatedAsEffectiveFromAccepted === false,
    r.publishedAtTreatedAsEffectiveFromAccepted === false,
    r.lastModifiedTreatedAsLegalChangeAccepted === false,
    r.currentUnreviewedSupportsHighRiskCertaintyAccepted === false,
    r.changedPendingReviewSupportsHighRiskCertaintyAccepted === false,
    r.expiredSourceSupportsCurrentClaimAccepted === false,
    r.supersededSourceSupportsCurrentClaimAccepted === false,
    r.effectiveDateUnknownAcceptedForDateSensitiveClaimAccepted === false,
    r.unreviewedSourceAcceptedForHighRiskClaimAccepted === false,
    r.rejectedSourceAcceptedFlag === false,
    r.reviewRequiredIgnoredAccepted === false,
    r.conflictIgnoredAccepted === false,
    r.sameLevelConflictIgnoredAccepted === false,
    r.hierarchyConflictIgnoredAccepted === false,
    r.jurisdictionConflictIgnoredAccepted === false,
    r.regionalConflictIgnoredAccepted === false,
    r.versionConflictIgnoredAccepted === false,
    r.competenceConflictIgnoredAccepted === false,
    r.passageConflictIgnoredAccepted === false,
    r.translationConflictIgnoredAccepted === false,
    r.implementationPracticeConflictIgnoredAccepted === false,
    r.municipalRuleGeneralizedNationallyAccepted === false,
    r.landRuleGeneralizedFederallyAccepted === false,
    r.germanSourceEstablishesForeignProcedureAccepted === false,
    r.foreignSourceEstablishesGermanEntitlementAccepted === false,
    r.euSourceEstablishesLocalWorkflowWithoutSupportAccepted === false,
    r.crossBorderInstructionWithEuOnlyEvidenceAccepted === false,
    r.crossBorderInstructionWithGermanOnlyEvidenceAccepted === false,
    r.crossBorderInstructionWithForeignOnlyEvidenceAccepted === false,
    r.responsibleActorUnresolvedInstructionIssuedAccepted === false,
    r.authorityCompetenceUnresolvedInstructionIssuedAccepted === false,
    r.userAlwaysAssumedResponsibleActorAccepted === false,
    r.institutionExchangeIgnoredAccepted === false,
    r.deadlineWithoutTriggerEventClarityAccepted === false,
    r.deadlineWithoutDirectPassageAccepted === false,
    r.deadlineWithoutJurisdictionMatchAccepted === false,
    r.deadlineWithoutEffectiveDateAccepted === false,
    r.deadlineWithUnresolvedConflictAccepted === false,
    r.eligibilityConfirmedWithoutAuthoritativeEvidenceAccepted === false,
    r.paymentObligationConfirmedWithoutAuthoritativeEvidenceAccepted === false,
    r.immigrationStatusConfirmedWithoutAuthoritativeEvidenceAccepted === false,
    r.authorityCompetenceGuessedAccepted === false,
    r.safeNextStepConvertedIntoLegalInstructionAccepted === false,
    r.generalOrientationConvertedIntoLegalCertaintyAccepted === false,
    r.blockedClaimIncludedAsFactAccepted === false,
    r.qualifiedClaimPresentedWithoutQualificationAccepted === false,
    r.modelOverridesTrustDecisionAccepted === false,
    r.discoveryOnlySourcePassedAsAuthoritativeEvidenceAccepted === false,
    r.secondarySourceOverridesPrimarySourceAccepted === false,
    r.courtDecisionGeneralizedUniversallyAccepted === false,
    r.formTreatedAsCompleteExceptionListAccepted === false,
    r.faqOverridesLegislationAccepted === false,
    r.localPortalUsedOutsideTerritoryAccepted === false,
    r.outputLocaleDeterminesCrossBorderCountryAccepted === false,
    r.slovakLocaleAutomaticallyActivatesSkConnectorAccepted === false,
    r.englishLocaleDisablesCrossBorderContextAccepted === false,
    r.germanOfficialTermRemovedAccepted === false,
    r.translationIncreasesCertaintyAccepted === false,
    r.translationRemovesWarningAccepted === false,
    r.translationChangesUrgencyAccepted === false,
    r.translationRemovesBlockedActionAccepted === false,
    r.localizedCitationPointsOnlyToTranslationAccepted === false,
    r.officialDomainAssumedFromAppearanceAccepted === false,
    r.urlShortenerTreatedAsCanonicalAccepted === false,
    r.unofficialMirrorTreatedAsCanonicalAccepted === false,
    r.archivedPageTreatedAsCurrentAccepted === false,
    r.metadataOnlyChangeTreatedAsSubstantiveAccepted === false,
    r.substantiveChangeTrustedWithoutReviewAccepted === false,
    r.removedSourceTreatedAsCurrentAccepted === false,
    r.envelopeMarksBlockedClaimsAuthorizedAccepted === false,
    r.envelopePersistsUserContentAccepted === false,
    r.germanKnowledgeClaimedPopulatedAccepted === false,
    r.v4ConnectorsClaimedPopulatedAccepted === false,
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
  sourceArchitectureReadyForTrustContract: boolean;
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
  const checkIdMatch = phase9aSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceArchitectureCheckIdFound = checkIdMatch ? checkIdMatch[1] : "not_found";
  const sourceArchitectureReadyForTrustContract =
    phase9aExists &&
    sourceArchitectureCheckIdFound === "9A" &&
    phase9aSrc.includes("readyForGermanSourceHierarchyAndTrustContract: allPassed") &&
    phase9aSrc.includes('sourceClosureCommit === SOURCE_CLOSURE_COMMIT');
  if (!sourceArchitectureReadyForTrustContract) {
    notes.push("PHASE 9A source did not statically confirm readiness for the trust contract phase.");
  }

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
    sourceArchitectureReadyForTrustContract,
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
    SOURCE_TYPES.length === 26 &&
    LEGAL_WEIGHTS.length === 10 &&
    CLAIM_TYPES.length === 15 &&
    CLAIM_TYPE_ELIGIBILITY.length === 15 &&
    PUBLISHER_COMPETENCE_CATEGORIES.length === 17 &&
    SOURCE_PURPOSES.length === 12 &&
    TRUST_DECISION_OUTCOMES.length === 13 &&
    PASSAGE_SUPPORT_STATUSES.length === 6 &&
    FRESHNESS_STATUSES.length === 9 &&
    REVIEW_STATUSES.length === 7 &&
    CONFLICT_TYPES.length === 11 &&
    HIGH_RISK_CATEGORIES.length === 13 &&
    ALLOWED_USES.length === 11 &&
    TRUST_DOMAINS.length === 6 &&
    CROSS_BORDER_EVIDENCE_STATES.length === 9 &&
    RESPONSIBLE_ACTOR_STATES.length === 6 &&
    TRANSLATION_STATES.length === 7 &&
    SOURCE_URL_TRUST_CATEGORIES.length === 9 &&
    CHANGE_DETECTION_STATES.length === 6 &&
    KNOWLEDGE_ANSWER_ENVELOPE_FIELDS.length === 19 &&
    CONSERVATIVE_FAILURE_PHRASES.length === 5 &&
    LAUNCH_LOCALES.length === 6 &&
    OFFICIAL_SOURCE_OUTSIDE_COMPETENCE_IS_CONTROLLING === false &&
    COURT_DECISION_UNIVERSAL_RULE_WITHOUT_REVIEW_ALLOWED === false &&
    FAMILIAR_LOOKING_DOMAIN_IS_SUFFICIENT_PROOF === false &&
    REAL_DOMAIN_VERIFICATION_IMPLEMENTED_THIS_PHASE === false &&
    ENVELOPE_MAY_MARK_BLOCKED_CLAIM_AS_FACT === false &&
    PREFERS_PLAUSIBLE_UNSUPPORTED_ANSWER === false &&
    EVERY_SOURCE_REQUIRES_LAWYER_CLAIMED === false;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sourceArchitectureReadyForTrustContract &&
    evidence.sixLaunchLocalesRecorded;

  return {
    checkId: "9B",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceArchitectureReadyForTrustContract: evidence.sourceArchitectureReadyForTrustContract,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    databaseMigrationCreated: false,
    databaseWritePerformed: false,
    networkAccessPerformed: false,
    externalSourceDownloaded: false,
    realSourceRegistered: false,
    realSourcePassageStored: false,
    realClaimPopulated: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    sourceTypeContractDefined: true,
    legalWeightContractDefined: true,
    claimTypeEligibilityDefined: true,
    publisherCompetenceDefined: true,
    sourcePurposeDefined: true,
    trustDecisionModelDefined: true,
    sourcePassageSufficiencyDefined: true,
    freshnessContractDefined: true,
    reviewContractDefined: true,
    sourceConflictModelDefined: true,
    highRiskClaimContractDefined: true,
    allowedUseMatrixDefined: true,
    discoveryOnlyContractDefined: true,
    secondarySourceContractDefined: true,
    courtDecisionContractDefined: true,
    officialFormContractDefined: true,
    officialFaqContractDefined: true,
    regionalTrustContractDefined: true,
    trustDomainsDefined: true,
    crossBorderEvidenceContractDefined: true,
    responsibleActorTrustDefined: true,
    translationTrustDefined: true,
    officialDomainVerificationDesigned: true,
    changeDetectionContractDefined: true,
    knowledgeAnswerEnvelopeTrustDefined: true,
    conservativeFailureBehaviorDefined: true,

    germanTrustDomainRecorded: TRUST_DOMAINS.includes("de_trust_domain"),
    euTrustDomainRecorded: TRUST_DOMAINS.includes("eu_trust_domain"),
    skTrustDomainRecorded: TRUST_DOMAINS.includes("sk_trust_domain"),
    czTrustDomainRecorded: TRUST_DOMAINS.includes("cz_trust_domain"),
    plTrustDomainRecorded: TRUST_DOMAINS.includes("pl_trust_domain"),
    huTrustDomainRecorded: TRUST_DOMAINS.includes("hu_trust_domain"),

    sixLaunchLocalesRecorded: evidence.sixLaunchLocalesRecorded,
    originalGermanSourceRemainsAuthoritative: true,
    translationCannotIncreaseCertainty: true,
    translationCannotRemoveWarnings: true,

    highRiskRequiresDirectEvidence: HIGH_RISK_DEFINITIVE_REQUIRES_DIRECT_SUPPORT,
    highRiskRequiresJurisdictionMatch: true,
    highRiskRequiresEffectiveDateAcceptance: true,
    highRiskRequiresConflictClearance: true,
    highRiskRequiresCitation: true,
    modelCannotOverrideTrustDecision: true,
    discoverySourceCannotSupportHighRiskClaim: true,
    retrievedAtNotEqualEffectiveFrom: true,

    zeroRealSourcesIngested: true,
    zeroRealClaimsPopulated: true,

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

    readyForGermanJurisdictionEffectiveDateModel: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,

    globalTrustScoreAsSoleDecisionAccepted: false,
    officialSourceAutomaticallyUniversalAccepted: false,
    newestSourceAutomaticallyEffectiveAccepted: false,
    translatedSourceTreatedAsAuthoritativeOriginalAccepted: false,
    searchRankingTreatedAsAuthorityAccepted: false,
    officialPublisherCompetenceIgnoredAccepted: false,
    territorialCompetenceIgnoredAccepted: false,
    sourcePurposeIgnoredAccepted: false,
    faqTreatedAsLegislationAccepted: false,
    formTreatedAsFullLegalEntitlementAccepted: false,
    blogSupportsHighRiskClaimAccepted: false,
    forumSupportsHighRiskClaimAccepted: false,
    seoArticleSupportsHighRiskClaimAccepted: false,
    socialMediaSupportsHighRiskClaimAccepted: false,
    modelTextTreatedAsSourceAccepted: false,
    searchSnippetTreatedAsSourcePassageAccepted: false,
    pageTitleAloneSupportsClaimAccepted: false,
    broadCitationSupportsPreciseClaimAccepted: false,
    contradictoryPassageAcceptedFlag: false,
    ambiguousPassageTreatedAsDirectSupportAccepted: false,
    partialSupportTreatedAsFullHighRiskSupportAccepted: false,
    retrievedAtTreatedAsEffectiveFromAccepted: false,
    publishedAtTreatedAsEffectiveFromAccepted: false,
    lastModifiedTreatedAsLegalChangeAccepted: false,
    currentUnreviewedSupportsHighRiskCertaintyAccepted: false,
    changedPendingReviewSupportsHighRiskCertaintyAccepted: false,
    expiredSourceSupportsCurrentClaimAccepted: false,
    supersededSourceSupportsCurrentClaimAccepted: false,
    effectiveDateUnknownAcceptedForDateSensitiveClaimAccepted: false,
    unreviewedSourceAcceptedForHighRiskClaimAccepted: false,
    rejectedSourceAcceptedFlag: false,
    reviewRequiredIgnoredAccepted: false,
    conflictIgnoredAccepted: false,
    sameLevelConflictIgnoredAccepted: false,
    hierarchyConflictIgnoredAccepted: false,
    jurisdictionConflictIgnoredAccepted: false,
    regionalConflictIgnoredAccepted: false,
    versionConflictIgnoredAccepted: false,
    competenceConflictIgnoredAccepted: false,
    passageConflictIgnoredAccepted: false,
    translationConflictIgnoredAccepted: false,
    implementationPracticeConflictIgnoredAccepted: false,
    municipalRuleGeneralizedNationallyAccepted: false,
    landRuleGeneralizedFederallyAccepted: false,
    germanSourceEstablishesForeignProcedureAccepted: false,
    foreignSourceEstablishesGermanEntitlementAccepted: false,
    euSourceEstablishesLocalWorkflowWithoutSupportAccepted: false,
    crossBorderInstructionWithEuOnlyEvidenceAccepted: false,
    crossBorderInstructionWithGermanOnlyEvidenceAccepted: false,
    crossBorderInstructionWithForeignOnlyEvidenceAccepted: false,
    responsibleActorUnresolvedInstructionIssuedAccepted: false,
    authorityCompetenceUnresolvedInstructionIssuedAccepted: false,
    userAlwaysAssumedResponsibleActorAccepted: false,
    institutionExchangeIgnoredAccepted: false,
    deadlineWithoutTriggerEventClarityAccepted: false,
    deadlineWithoutDirectPassageAccepted: false,
    deadlineWithoutJurisdictionMatchAccepted: false,
    deadlineWithoutEffectiveDateAccepted: false,
    deadlineWithUnresolvedConflictAccepted: false,
    eligibilityConfirmedWithoutAuthoritativeEvidenceAccepted: false,
    paymentObligationConfirmedWithoutAuthoritativeEvidenceAccepted: false,
    immigrationStatusConfirmedWithoutAuthoritativeEvidenceAccepted: false,
    authorityCompetenceGuessedAccepted: false,
    safeNextStepConvertedIntoLegalInstructionAccepted: false,
    generalOrientationConvertedIntoLegalCertaintyAccepted: false,
    blockedClaimIncludedAsFactAccepted: false,
    qualifiedClaimPresentedWithoutQualificationAccepted: false,
    modelOverridesTrustDecisionAccepted: false,
    discoveryOnlySourcePassedAsAuthoritativeEvidenceAccepted: false,
    secondarySourceOverridesPrimarySourceAccepted: false,
    courtDecisionGeneralizedUniversallyAccepted: false,
    formTreatedAsCompleteExceptionListAccepted: false,
    faqOverridesLegislationAccepted: false,
    localPortalUsedOutsideTerritoryAccepted: false,
    outputLocaleDeterminesCrossBorderCountryAccepted: false,
    slovakLocaleAutomaticallyActivatesSkConnectorAccepted: false,
    englishLocaleDisablesCrossBorderContextAccepted: false,
    germanOfficialTermRemovedAccepted: false,
    translationIncreasesCertaintyAccepted: false,
    translationRemovesWarningAccepted: false,
    translationChangesUrgencyAccepted: false,
    translationRemovesBlockedActionAccepted: false,
    localizedCitationPointsOnlyToTranslationAccepted: false,
    officialDomainAssumedFromAppearanceAccepted: false,
    urlShortenerTreatedAsCanonicalAccepted: false,
    unofficialMirrorTreatedAsCanonicalAccepted: false,
    archivedPageTreatedAsCurrentAccepted: false,
    metadataOnlyChangeTreatedAsSubstantiveAccepted: false,
    substantiveChangeTrustedWithoutReviewAccepted: false,
    removedSourceTreatedAsCurrentAccepted: false,
    envelopeMarksBlockedClaimsAuthorizedAccepted: false,
    envelopePersistsUserContentAccepted: false,
    germanKnowledgeClaimedPopulatedAccepted: false,
    v4ConnectorsClaimedPopulatedAccepted: false,
    sixLanguagesClaimedProductionReadyAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    sourceTypes: SOURCE_TYPES,
    legalWeights: LEGAL_WEIGHTS,
    contextualTrustStatements: CONTEXTUAL_TRUST_STATEMENTS,
    claimTypeEligibility: CLAIM_TYPE_ELIGIBILITY,
    publisherCompetenceCategories: PUBLISHER_COMPETENCE_CATEGORIES,
    sourcePurposes: SOURCE_PURPOSES,
    officialSourceRegistryFields: OFFICIAL_SOURCE_REGISTRY_FIELDS,
    trustDecisionOutcomes: TRUST_DECISION_OUTCOMES,
    trustDecisionFields: TRUST_DECISION_FIELDS,
    passageSupportStatuses: PASSAGE_SUPPORT_STATUSES,
    freshnessStatuses: FRESHNESS_STATUSES,
    reviewStatuses: REVIEW_STATUSES,
    conflictTypes: CONFLICT_TYPES,
    highRiskCategories: HIGH_RISK_CATEGORIES,
    highRiskRequirementFields: HIGH_RISK_REQUIREMENT_FIELDS,
    allowedUses: ALLOWED_USES,
    discoveryOnlyExamples: DISCOVERY_ONLY_EXAMPLES,
    secondarySourceMay: SECONDARY_SOURCE_MAY,
    secondarySourceMustNot: SECONDARY_SOURCE_MUST_NOT,
    courtDecisionFields: COURT_DECISION_FIELDS,
    officialFormMaySupport: OFFICIAL_FORM_MAY_SUPPORT,
    officialFaqMaySupport: OFFICIAL_FAQ_MAY_SUPPORT,
    regionalTrustRequirements: REGIONAL_TRUST_REQUIREMENTS,
    trustDomains: TRUST_DOMAINS,
    crossBorderEvidenceStates: CROSS_BORDER_EVIDENCE_STATES,
    responsibleActorStates: RESPONSIBLE_ACTOR_STATES,
    translationStates: TRANSLATION_STATES,
    sourceUrlTrustCategories: SOURCE_URL_TRUST_CATEGORIES,
    changeDetectionStates: CHANGE_DETECTION_STATES,
    knowledgeAnswerEnvelopeFields: KNOWLEDGE_ANSWER_ENVELOPE_FIELDS,
    conservativeFailurePhrases: CONSERVATIVE_FAILURE_PHRASES,
    knownOpenDebts: KNOWN_OPEN_DEBTS,
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${PHASE_9A_REL_PATH} checkId found: ${evidence.sourceArchitectureCheckIdFound}`,
      `${PHASE_9A_REL_PATH} readyForGermanSourceHierarchyAndTrustContract wiring confirmed: ${evidence.sourceArchitectureReadyForTrustContract}`,
      `${PHASE_9A_REL_PATH} standaloneSmartTalkExtractionRequiredLater: true present: ${evidence.standaloneExtractionStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      "This audit read only committed plain text for the 9A audit and the 8.13C closure audit — neither was imported or executed.",
      "Zero real German sources registered, zero URLs fetched, zero source passages stored, zero claims populated, zero database rows, zero embeddings, zero retrieval calls, zero model calls, zero user-content persistence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runGermanSourceHierarchyTrustContractAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForGermanJurisdictionEffectiveDateModel: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runGermanSourceHierarchyTrustContractAudit();
  console.log(JSON.stringify(result));
}
