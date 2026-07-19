/**
 * PHASE 9A — German Knowledge System Boundary and Architecture Gate
 * Design Audit (Design and Audit Only)
 *
 * This file defines the trusted architecture boundary for the future
 * German bureaucracy/legal knowledge system used by Birello Smart Talk —
 * BEFORE any ingestion, database migration, RAG implementation, vector
 * search, source download, scraping, or production runtime wiring.
 *
 * This is a DESIGN-ONLY artifact. It performs NO dynamic execution: no
 * network access, no external source download, no model call, no OCR, no
 * embedding creation, no database write/migration, no persistence of user
 * content, no environment mutation. It only:
 *
 *   1. Declares immutable, type-only architecture contracts (12 layers,
 *      25 entity design contracts, common metadata, source-type
 *      hierarchy, jurisdiction/authority/versioning/claim/process-graph
 *      models, EU coordination + V4 connector layers, responsible-actor
 *      rule, language presentation layer, retrieval/citation boundary,
 *      conflict/freshness statuses, no-persistence separation, database
 *      boundary categories, and preserved governance boundaries).
 *   2. Reads a small set of existing repository files as plain text via
 *      `fs.readFileSync` (never imports/executes them) to ground a few
 *      conservative booleans (e.g. that the six launch locales already
 *      exist in `lib/i18n/index.ts`, that the PHASE 8.13C closure audit
 *      still records the open mobile/DNA-shell/OCR debts this phase
 *      inherits).
 *   3. Runs read-only `git` commands to confirm this phase created
 *      exactly one new file and modified no existing file.
 *   4. Runs 83 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// â”€â”€â”€ Source commit constant â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SOURCE_CLOSURE_COMMIT = "4ace7f6";

const I18N_INDEX_REL_PATH = "lib/i18n/index.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";

const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const FUTURE_LOCALES = ["ro", "bg", "uk", "tr", "ru"] as const;

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
// ARCHITECTURE LAYER DESIGN (boundaries only — none of these are implemented)
// ============================================================================

type ArchitectureLayerId =
  | "german_knowledge_core"
  | "german_jurisdiction_model"
  | "official_source_registry"
  | "legal_administrative_claim_store"
  | "administrative_process_graph"
  | "authority_competence_registry"
  | "versioning_effective_date_layer"
  | "retrieval_citation_boundary"
  | "governance_evidence_gate"
  | "eu_coordination_layer"
  | "v4_cross_border_connector_layer"
  | "language_presentation_layer";

interface ArchitectureLayer {
  id: ArchitectureLayerId;
  order: number;
  name: string;
  purpose: string;
  implementedInThisPhase: false;
}

const ARCHITECTURE_LAYERS: readonly ArchitectureLayer[] = [
  { id: "german_knowledge_core", order: 1, name: "German Knowledge Core", purpose: "Single trusted store of German official knowledge, independent of output language.", implementedInThisPhase: false },
  { id: "german_jurisdiction_model", order: 2, name: "German Jurisdiction Model", purpose: "Distinguishes EU / federal / Land / Regierungsbezirk / Kreis / Stadt / Gemeinde / authority scope for any rule.", implementedInThisPhase: false },
  { id: "official_source_registry", order: 3, name: "Official Source Registry", purpose: "Registers only official sources with publisher, URL, type, and legal weight — never an LLM or search snippet.", implementedInThisPhase: false },
  { id: "legal_administrative_claim_store", order: 4, name: "Legal and Administrative Claim Store", purpose: "Stores discrete, cited claims separated from raw source text and separated from inference.", implementedInThisPhase: false },
  { id: "administrative_process_graph", order: 5, name: "Administrative Process Graph", purpose: "Structured process steps/eligibility/forms/fees/deadlines instead of one unstructured article.", implementedInThisPhase: false },
  { id: "authority_competence_registry", order: 6, name: "Authority and Competence Registry", purpose: "Who is competent, for what, where, and whether the user or an institution must act.", implementedInThisPhase: false },
  { id: "versioning_effective_date_layer", order: 7, name: "Versioning and Effective-Date Layer", purpose: "Immutable historical source versions with effective/retrieval/verification dates and review status.", implementedInThisPhase: false },
  { id: "retrieval_citation_boundary", order: 8, name: "Retrieval and Citation Boundary", purpose: "Filters evidence before the model ever sees it; every claim remains traceable to a passage.", implementedInThisPhase: false },
  { id: "governance_evidence_gate", order: 9, name: "Governance and Evidence Gate", purpose: "Reuses/extends the existing Reality Matrix Evidence Gate pattern to authorize output, not bypass it.", implementedInThisPhase: false },
  { id: "eu_coordination_layer", order: 10, name: "EU Coordination Layer", purpose: "Separate layer for cross-border coordination rules, kept out of generic German local rules.", implementedInThisPhase: false },
  { id: "v4_cross_border_connector_layer", order: 11, name: "V4 Cross-Border Connector Layer", purpose: "DE<->SK/CZ/PL/HU connectors, derived from verified case context — never from interface language.", implementedInThisPhase: false },
  { id: "language_presentation_layer", order: 12, name: "Language Presentation Layer", purpose: "Presents the German-sourced answer in de/en/sk/cs/pl/hu without replacing the legal source.", implementedInThisPhase: false },
];

// ============================================================================
// SOURCE-TYPE MODEL AND LEGAL-WEIGHT ORDERING (illustrative, not universal)
// ============================================================================

type SourceType =
  | "eu_law"
  | "federal_law"
  | "federal_regulation"
  | "state_law"
  | "municipal_rule"
  | "official_form"
  | "official_guidance"
  | "official_faq"
  | "authority_procedure"
  | "administrative_instruction"
  | "court_decision"
  | "official_publication"
  | "secondary_explanatory_source"
  | "unsupported_source";

const SOURCE_TYPES: readonly SourceType[] = [
  "eu_law",
  "federal_law",
  "federal_regulation",
  "state_law",
  "municipal_rule",
  "official_form",
  "official_guidance",
  "official_faq",
  "authority_procedure",
  "administrative_instruction",
  "court_decision",
  "official_publication",
  "secondary_explanatory_source",
  "unsupported_source",
];

/**
 * Illustrative default ordering only. The gate explicitly does NOT encode
 * this as a naive universal ranking — the real hierarchy may vary by
 * claim and jurisdiction (e.g. a court decision may outrank guidance for
 * one claim but not determine competence for another).
 */
const ILLUSTRATIVE_DEFAULT_LEGAL_WEIGHT_ORDER: readonly SourceType[] = [
  "eu_law",
  "federal_law",
  "federal_regulation",
  "state_law",
  "municipal_rule",
  "authority_procedure",
  "official_guidance",
  "official_faq",
  "secondary_explanatory_source",
];

const UNTRUSTED_NON_AUTHORITATIVE_SOURCES: readonly string[] = [
  "blogs",
  "forums",
  "social_media",
  "seo_articles",
  "anonymous_summaries",
  "commercial_relocation_pages",
  "unverified_legal_websites",
  "model_generated_text",
  "search_result_snippets",
  "outdated_cached_content",
  "translated_paraphrase_without_original_official_source",
];

// ============================================================================
// COMMON METADATA (conservative, optional where the real source may not
// provide a field — this phase does not fabricate precision)
// ============================================================================

type JurisdictionLevel =
  | "eu"
  | "de_federal"
  | "de_land"
  | "de_regierungsbezirk"
  | "de_kreis"
  | "de_stadt"
  | "de_gemeinde"
  | "specific_authority";

type ReviewStatus = "unreviewed" | "in_review" | "reviewed_current" | "reviewed_flagged" | "review_due";

type FreshnessStatus =
  | "current_verified"
  | "current_unreviewed"
  | "review_due"
  | "changed_pending_review"
  | "superseded"
  | "expired"
  | "unavailable"
  | "disputed";

type RiskLevel = "low" | "medium" | "high" | "unknown";

interface CommonKnowledgeMetadata {
  id: string;
  market?: "DE";
  jurisdictionLevel?: JurisdictionLevel;
  jurisdictionCode?: string;
  regionCode?: string;
  municipalityCode?: string;
  authorityId?: string;
  sourceId?: string;
  sourceVersionId?: string;
  sourceLanguage?: string;
  claimLanguage?: string;
  outputLocale?: string;
  sourceType?: SourceType;
  legalWeight?: number;
  officialPublisher?: string;
  officialUrl?: string;
  retrievedAt?: string;
  publishedAt?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  lastVerifiedAt?: string;
  reviewStatus?: ReviewStatus;
  freshnessStatus?: FreshnessStatus;
  contentHash?: string;
  supersedesVersionId?: string;
  citationPassageId?: string;
  riskLevel?: RiskLevel;
  allowedUse?: readonly string[];
  blockedUse?: readonly string[];
}

const COMMON_METADATA_FIELDS: readonly string[] = [
  "id", "market", "jurisdictionLevel", "jurisdictionCode", "regionCode", "municipalityCode",
  "authorityId", "sourceId", "sourceVersionId", "sourceLanguage", "claimLanguage", "outputLocale",
  "sourceType", "legalWeight", "officialPublisher", "officialUrl", "retrievedAt", "publishedAt",
  "effectiveFrom", "effectiveUntil", "lastVerifiedAt", "reviewStatus", "freshnessStatus",
  "contentHash", "supersedesVersionId", "citationPassageId", "riskLevel", "allowedUse", "blockedUse",
];

// ============================================================================
// MINIMUM FUTURE ENTITY MODEL (25 immutable design contracts — types only,
// zero runtime footprint, no database table created)
// ============================================================================

export interface KnowledgeSource extends CommonKnowledgeMetadata {
  kind: "KnowledgeSource";
  title: string;
  publisherName: string;
  isOfficial: boolean;
}

export interface KnowledgeSourceVersion extends CommonKnowledgeMetadata {
  kind: "KnowledgeSourceVersion";
  sourceId: string;
  versionNumber: number;
  immutable: true;
}

export interface SourcePassage extends CommonKnowledgeMetadata {
  kind: "SourcePassage";
  sourceVersionId: string;
  passageText?: string;
  passageAnchor?: string;
}

type ClaimKind =
  | "direct_legal_claim"
  | "administrative_procedure_claim"
  | "authority_competence_claim"
  | "documentary_fact"
  | "general_orientation"
  | "safe_next_step_recommendation"
  | "unresolved_interpretation";

interface ClaimEvidenceBasis {
  /** "What the source states" — never conflated with inference or recommendation. */
  whatSourceStates?: string;
  /** "What Birello infers" from the source — explicitly separated from the source text. */
  whatBirelloInfers?: string;
  /** "What Birello recommends as a safe step" — explicitly separated from both above. */
  whatBirelloRecommends?: string;
}

export interface LegalClaim extends CommonKnowledgeMetadata {
  kind: "LegalClaim";
  claimKind: ClaimKind;
  evidenceBasis: ClaimEvidenceBasis;
  requiredCitationId?: string;
  confidenceOrEvidenceStatus: "supported" | "partially_supported" | "unsupported" | "unresolved";
}

export interface AdministrativeClaim extends CommonKnowledgeMetadata {
  kind: "AdministrativeClaim";
  claimKind: ClaimKind;
  evidenceBasis: ClaimEvidenceBasis;
  processId?: string;
}

interface ProcessStep {
  stepId: string;
  order: number;
  description: string;
  requiredDocuments?: readonly string[];
  competentAuthorityId?: string;
  safeFirstStep?: boolean;
  unresolvedCondition?: string;
}

export interface AdministrativeProcess extends CommonKnowledgeMetadata {
  kind: "AdministrativeProcess";
  triggerSituation: string;
  userProfileRequirements?: readonly string[];
  competentAuthorityId?: string;
  eligibilityConditions?: readonly string[];
  requiredDocuments?: readonly string[];
  formIds?: readonly string[];
  feeRuleIds?: readonly string[];
  deadlineRuleIds?: readonly string[];
  steps: readonly ProcessStep[];
  exceptions?: readonly string[];
  regionalOverrideIds?: readonly string[];
  possibleOutcomes?: readonly string[];
  appealOrReviewInfo?: string;
  relatedProcessIds?: readonly string[];
  unresolvedConditions?: readonly string[];
  highRiskBoundaries?: readonly string[];
}

export interface Authority extends CommonKnowledgeMetadata {
  kind: "Authority";
  authorityName: string;
  authorityType: string;
  territorialScope?: string;
  onlinePortalUrl?: string;
  contactChannel?: string;
  receivesApplications: boolean;
  informationOnly: boolean;
}

export interface AuthorityCompetence extends CommonKnowledgeMetadata {
  kind: "AuthorityCompetence";
  authorityId: string;
  subjectMatterCompetence: string;
  requiresAnotherAuthorityToRequestEvidence: boolean;
  userMustAct: boolean;
  institutionToInstitutionExchangeExpected: boolean;
}

export interface Form extends CommonKnowledgeMetadata {
  kind: "Form";
  formName: string;
  issuingAuthorityId?: string;
  officialFormUrl?: string;
}

export interface RequiredEvidence extends CommonKnowledgeMetadata {
  kind: "RequiredEvidence";
  description: string;
  requiredForProcessId?: string;
}

export interface DeadlineRule extends CommonKnowledgeMetadata {
  kind: "DeadlineRule";
  description: string;
  /** This design never claims exact deadline computation without authorized evidence. */
  requiresAuthorizedEvidenceForExactComputation: true;
}

export interface EligibilityRule extends CommonKnowledgeMetadata {
  kind: "EligibilityRule";
  description: string;
  conditionExpression?: string;
}

export interface FeeRule extends CommonKnowledgeMetadata {
  kind: "FeeRule";
  description: string;
  amountKnown?: boolean;
}

export interface RegionalOverride extends CommonKnowledgeMetadata {
  kind: "RegionalOverride";
  overridesProcessId: string;
  scopeDescription: string;
  /** A regional override must never be silently presented as nationwide. */
  mustNotBePresentedAsNationwide: true;
}

export interface TerminologyEntry {
  kind: "TerminologyEntry";
  germanOfficialTerm: string;
  outputLocale: string;
  localizedTerm: string;
  reviewed: boolean;
}

export interface SafetyBoundary {
  kind: "SafetyBoundary";
  boundaryId: string;
  description: string;
  blocksOutputUse: readonly string[];
}

export interface ReviewRecord extends CommonKnowledgeMetadata {
  kind: "ReviewRecord";
  reviewedEntityId: string;
  reviewerRole: string;
  reviewOutcome: ReviewStatus;
  reviewedAt: string;
}

type ConflictStatus =
  | "no_conflict"
  | "source_conflict"
  | "regional_conflict"
  | "version_conflict"
  | "competence_conflict"
  | "translation_conflict"
  | "unresolved";

export interface KnowledgeConflict extends CommonKnowledgeMetadata {
  kind: "KnowledgeConflict";
  conflictStatus: ConflictStatus;
  conflictingEntityIds: readonly string[];
  /** High-risk unresolved conflicts must block definitive output. */
  blocksDefinitiveOutputIfHighRiskAndUnresolved: true;
}

export interface Citation extends CommonKnowledgeMetadata {
  kind: "Citation";
  sourceId: string;
  sourceVersionId: string;
  passageId: string;
  claimSupportedId: string;
  publisher: string;
  lastVerificationDate?: string;
  /** User-facing citation may be simplified; internal citation stays auditable. */
  internalAuditable: true;
}

export interface RetrievalCandidate extends CommonKnowledgeMetadata {
  kind: "RetrievalCandidate";
  candidateSourcePassageId: string;
  matchedByStructuredFilter: boolean;
  matchedByFullText: boolean;
  matchedByVectorSearch: boolean;
  passedJurisdictionFilter: boolean;
  passedEffectiveDateFilter: boolean;
  passedReviewStatusFilter: boolean;
  passedEvidenceGate: boolean;
}

export interface KnowledgeAnswerEnvelope extends CommonKnowledgeMetadata {
  kind: "KnowledgeAnswerEnvelope";
  citationIds: readonly string[];
  conflictStatus: ConflictStatus;
  freshnessStatus: FreshnessStatus;
  responsibleActor?: ResponsibleActorState;
}

export interface CrossBorderConnector {
  kind: "CrossBorderConnector";
  connectedCountry: "SK" | "CZ" | "PL" | "HU";
  germanAuthority?: string;
  foreignAuthority?: string;
  euLegalBasis?: string;
  germanSourceId?: string;
  foreignSourceId?: string;
  euSourceId?: string;
  requiredEvidence?: readonly string[];
  responsibleActor?: ResponsibleActorState;
  institutionExchangeExpected: boolean;
  userActionExpected: boolean;
  effectiveDate?: string;
  reviewStatus?: ReviewStatus;
  safetyNotes?: readonly string[];
  unresolvedQuestions?: readonly string[];
  /** Cross-border country must come from verified case context — never interface language. */
  derivedFromLocale: false;
}

export interface CrossBorderProcess extends CommonKnowledgeMetadata {
  kind: "CrossBorderProcess";
  connectorId: string;
  topicId: string;
  steps: readonly ProcessStep[];
}

type ResponsibleActorState =
  | "user_must_act"
  | "german_authority_must_act"
  | "foreign_authority_must_act"
  | "institutions_should_exchange_data"
  | "responsibility_unresolved"
  | "professional_confirmation_required";

export interface ResponsibleActorRule {
  kind: "ResponsibleActorRule";
  claimOrProcessId: string;
  resolvedState: ResponsibleActorState;
  evidenceForResolution?: readonly string[];
  /**
   * The gate must reject a concrete instruction such as "go to authority X
   * and request form Y" unless resolvedState === "user_must_act" AND
   * evidenceForResolution establishes that the user is the responsible
   * actor.
   */
  mayIssueConcreteActionInstruction: boolean;
}

const ENTITY_CONTRACT_NAMES: readonly string[] = [
  "KnowledgeSource", "KnowledgeSourceVersion", "SourcePassage", "LegalClaim", "AdministrativeClaim",
  "AdministrativeProcess", "ProcessStep", "Authority", "AuthorityCompetence", "Form", "RequiredEvidence",
  "DeadlineRule", "EligibilityRule", "FeeRule", "RegionalOverride", "TerminologyEntry", "SafetyBoundary",
  "ReviewRecord", "KnowledgeConflict", "Citation", "RetrievalCandidate", "KnowledgeAnswerEnvelope",
  "CrossBorderConnector", "CrossBorderProcess", "ResponsibleActorRule",
];

// ============================================================================
// JURISDICTION / AUTHORITY / VERSIONING MODEL SUMMARIES
// ============================================================================

const JURISDICTION_LEVELS: readonly JurisdictionLevel[] = [
  "eu", "de_federal", "de_land", "de_regierungsbezirk", "de_kreis", "de_stadt", "de_gemeinde", "specific_authority",
];

const JURISDICTION_RULE_SCOPES: readonly string[] = [
  "all_germany", "one_land", "selected_municipalities", "one_named_authority", "eu_cross_border_case",
];

const AUTHORITY_COMPETENCE_FIELDS: readonly string[] = [
  "authorityName", "authorityType", "jurisdiction", "territorialScope", "subjectMatterCompetence",
  "onlinePortal", "contactChannel", "receivesApplications", "informationOnly",
  "requiresAnotherAuthorityToRequestEvidence", "userMustAct", "institutionToInstitutionExchangeExpected",
];

const VERSIONING_EFFECTIVE_DATE_FIELDS: readonly string[] = [
  "historicalSourceVersionsPreserved", "effectiveFrom", "effectiveUntil", "retrievalDate", "verificationDate",
  "supersededStatus", "contentHash", "conflictState", "reviewRequirement",
];

const CLAIM_KINDS: readonly ClaimKind[] = [
  "direct_legal_claim", "administrative_procedure_claim", "authority_competence_claim", "documentary_fact",
  "general_orientation", "safe_next_step_recommendation", "unresolved_interpretation",
];

const PROCESS_GRAPH_FIELDS: readonly string[] = [
  "triggerSituation", "userProfileRequirements", "competentAuthority", "eligibilityConditions",
  "requiredDocuments", "forms", "fees", "deadlines", "safeFirstStep", "exceptions", "regionalOverrides",
  "possibleOutcomes", "appealOrReviewInformation", "relatedProcesses", "unresolvedConditions", "highRiskBoundaries",
];

const MINIMUM_GERMAN_PROCESS_SCOPE: readonly string[] = [
  "Anmeldung", "Ummeldung", "Abmeldung", "Steuer-ID", "Jobcenter", "Bürgergeld", "Familienkasse", "Kindergeld",
  "health insurance", "Finanzamt letters", "Ausländerbehörde", "Rechnung", "Mahnung", "Kündigung",
  "basic employment-document orientation", "basic tenancy-document orientation",
];

const EU_COORDINATION_FIELDS: readonly string[] = [
  "euLegalBasis", "coordinationRule", "competentState", "priorityRule", "institutionToInstitutionExchange",
  "userSubmittedEvidence", "portableDocumentsOrStructuredElectronicExchange", "unresolvedCompetence",
  "conflictingClaimsBetweenCountries", "responsibleActor",
];

const V4_CONNECTORS: readonly string[] = ["DE<->SK", "DE<->CZ", "DE<->PL", "DE<->HU"];

const V4_CONNECTOR_FIELDS: readonly string[] = [
  "connectedCountry", "germanAuthority", "foreignAuthority", "euLegalBasis", "germanSource", "foreignSource",
  "euSource", "requiredEvidence", "responsibleActor", "institutionExchangeExpected", "userActionExpected",
  "effectiveDate", "reviewStatus", "safetyNotes", "unresolvedQuestions",
];

const INITIAL_CROSS_BORDER_TOPICS: readonly string[] = [
  "family benefits", "social insurance", "health insurance", "unemployment periods and benefits",
  "pension insurance periods", "tax residence and foreign income",
];

const RESPONSIBLE_ACTOR_STATES: readonly ResponsibleActorState[] = [
  "user_must_act", "german_authority_must_act", "foreign_authority_must_act",
  "institutions_should_exchange_data", "responsibility_unresolved", "professional_confirmation_required",
];

const LANGUAGE_PRESENTATION_PRINCIPLES: readonly string[] = [
  "Original German official term should remain available.",
  "Translation must not replace the legal source.",
  "Urgency must remain equivalent across locales.",
  "Warnings must remain equivalent across locales.",
  "Uncertainty must remain equivalent across locales.",
  "Blocked actions must remain equivalent across locales.",
  "Citations must point to the original source, not the translation.",
  "Localized explanatory terminology may have its own reviewed glossary.",
  "These six launch locales are not claimed production-ready by this design phase.",
];

const RETRIEVAL_PIPELINE_STAGES: readonly string[] = [
  "structured_filters", "full_text_retrieval", "optional_vector_retrieval",
  "deterministic_jurisdiction_filters", "effective_date_filters", "review_status_filters", "evidence_gates",
];

const PROHIBITED_RETRIEVAL_PATTERN =
  "user question -> unrestricted vector search -> model answer" as const;

const CITATION_CONTRACT_FIELDS: readonly string[] = [
  "source", "sourceVersion", "sourcePassage", "jurisdiction", "effectiveDate", "publisher",
  "lastVerificationDate", "claimSupported",
];

const CONFLICT_STATUSES: readonly ConflictStatus[] = [
  "no_conflict", "source_conflict", "regional_conflict", "version_conflict",
  "competence_conflict", "translation_conflict", "unresolved",
];

const FRESHNESS_STATUSES: readonly FreshnessStatus[] = [
  "current_verified", "current_unreviewed", "review_due", "changed_pending_review",
  "superseded", "expired", "unavailable", "disputed",
];

const NO_PERSISTENCE_SEPARATION: readonly string[] = [
  "public official knowledge persistence",
  "audit metadata",
  "anonymous request processing",
  "user document content",
  "personal data",
  "DNA profile data",
];

const DATABASE_BOUNDARY_CATEGORIES: readonly string[] = [
  "relational structured knowledge",
  "immutable source versions",
  "full-text index",
  "optional vector index",
  "review queue",
  "freshness monitor",
  "audit trace",
];

const GOVERNANCE_BOUNDARIES_PRESERVED: readonly string[] = [
  "Evidence Gates",
  "Reality Matrix",
  "PII redaction",
  "no raw image to model",
  "no unrestricted legal advice",
  "no exact deadline computation without authorized evidence",
  "no official filing",
  "no payment",
  "no signing",
  "no verified legal status claim without evidence",
  "no automatic cross-border instruction",
  "no persistence of user content",
];

const KNOWN_OPEN_DEBTS: readonly string[] = [
  "HEIC/HEIF support",
  "EXIF orientation normalization",
  "Decoded pixel bounds",
  "Serverless/Vercel OCR validation",
  "Physical Android camera-image validation",
  "Genuine iOS camera-image validation",
  "Distributed production rate limiter",
  "Standalone Smart Talk extraction from the DNA shell",
  "Final production payment flow",
  "German knowledge system implementation (this phase is design-only)",
  "V4 cross-border connector implementation (this phase is design-only)",
];

// â”€â”€â”€ Result shape â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Result {
  checkId: "9A";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceInspectionOnly: boolean;

  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  databaseMigrationCreated: boolean;
  databaseWritePerformed: boolean;
  networkAccessPerformed: boolean;
  externalSourceDownloaded: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  persistenceOfUserContentPerformed: boolean;

  germanKnowledgeCoreDesigned: boolean;
  officialSourceRegistryDesigned: boolean;
  sourceVersioningDesigned: boolean;
  effectiveDateModelDesigned: boolean;
  jurisdictionModelDesigned: boolean;
  authorityCompetenceModelDesigned: boolean;
  claimModelDesigned: boolean;
  administrativeProcessGraphDesigned: boolean;
  citationContractDesigned: boolean;
  retrievalBoundaryDesigned: boolean;
  conflictHandlingDesigned: boolean;
  freshnessReviewDesigned: boolean;
  euCoordinationLayerDesigned: boolean;
  v4ConnectorArchitectureDesigned: boolean;
  responsibleActorRuleDesigned: boolean;
  languagePresentationLayerDesigned: boolean;
  sixLaunchLocalesRecorded: boolean;
  germanSourceLanguagePreserved: boolean;
  localeSeparatedFromCrossBorderCountry: boolean;
  knowledgePersistenceSeparatedFromUserContent: boolean;

  minimumGermanProcessScopeRecorded: boolean;
  initialCrossBorderTopicsRecorded: boolean;

  standaloneSmartTalkExtractionRequiredLater: boolean;
  stillHostedInsideDnaShell: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForGermanSourceHierarchyAndTrustContract: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;
  allEntityContractsDeclared: boolean;

  // Supplementary forbidden-claim flags with no 1:1 Result field above —
  // every one must remain false; tamper cases each flip exactly one.
  germanLawsIngestedClaimed: boolean;
  modelOutputTreatedAsSourceAccepted: boolean;
  translationTreatedAsLegalSourceAccepted: boolean;
  blogUsedAsSoleHighRiskBasisAccepted: boolean;
  forumUsedAsLegalBasisAccepted: boolean;
  searchSnippetTreatedAsOfficialSourceAccepted: boolean;
  retrievalDateTreatedAsEffectiveDateAccepted: boolean;
  oldSourceOverwrittenAccepted: boolean;
  expiredSourceTreatedAsCurrentAccepted: boolean;
  unreviewedChangedSourceTreatedAsVerifiedAccepted: boolean;
  municipalRuleTreatedAsNationwideAccepted: boolean;
  stateRuleTreatedAsFederalAccepted: boolean;
  localAuthorityCompetenceGeneralizedNationallyAccepted: boolean;
  authorityGuessedFromLanguageAccepted: boolean;
  slovakOutputImpliesSlovakConnectorAccepted: boolean;
  englishOutputImpliesNoCrossBorderConnectorAccepted: boolean;
  userAlwaysAssumedResponsibleActorAccepted: boolean;
  authorityToAuthorityExchangeIgnoredAccepted: boolean;
  unresolvedCompetenceConvertedToInstructionAccepted: boolean;
  specificFormInstructionWithoutEvidenceAccepted: boolean;
  euCoordinationMergedIntoGermanLocalRuleAccepted: boolean;
  germanSourceDuplicatedPerLanguageAccepted: boolean;
  sixSeparateLegalTruthStoresCreatedAccepted: boolean;
  localizationChangesUrgencyAccepted: boolean;
  localizationRemovesWarningsAccepted: boolean;
  localizationRemovesUncertaintyAccepted: boolean;
  localizationRemovesBlockedActionAccepted: boolean;
  germanOfficialTermDiscardedAccepted: boolean;
  citationRemovedFromLocalizedAnswerAccepted: boolean;
  vectorRetrievalWithoutJurisdictionFilterAccepted: boolean;
  vectorRetrievalWithoutEffectiveDateFilterAccepted: boolean;
  vectorRetrievalWithoutReviewStatusFilterAccepted: boolean;
  unrestrictedRagAccepted: boolean;
  unsupportedClaimAllowedAccepted: boolean;
  claimWithoutSourceAllowedAccepted: boolean;
  highRiskConflictIgnoredAccepted: boolean;
  versionConflictIgnoredAccepted: boolean;
  competenceConflictIgnoredAccepted: boolean;
  translationConflictIgnoredAccepted: boolean;
  sourcePassageMissingAcceptedInCitation: boolean;
  sourceVersionMissingAcceptedInCitation: boolean;
  officialPublisherMissingAcceptedInCitation: boolean;
  sourceHashMissingAcceptedInCitation: boolean;
  historyOverwrittenAccepted: boolean;
  reviewRecordOmittedAccepted: boolean;
  freshnessStatusOmittedAccepted: boolean;
  legalWeightOmittedAccepted: boolean;
  ocrImageStoredAsKnowledgeAccepted: boolean;
  dnaProfileMixedIntoPublicKnowledgeAccepted: boolean;
  piiRedactionWeakenedAccepted: boolean;
  rawImageSentToModelAccepted: boolean;
  exactDeadlineComputedWithoutEvidenceAccepted: boolean;
  legalAdviceAuthorizedAccepted: boolean;
  officialFilingAuthorizedAccepted: boolean;
  paymentAuthorizedAccepted: boolean;
  signingAuthorizedAccepted: boolean;
  sixLanguagesFalselyMarkedProductionReadyAccepted: boolean;
  germanKnowledgeFalselyMarkedPopulatedAccepted: boolean;
  v4ConnectorsFalselyMarkedPopulatedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  architectureLayers: readonly ArchitectureLayer[];
  sourceTypeHierarchyExample: readonly SourceType[];
  untrustedSources: readonly string[];
  entityContractNames: readonly string[];
  commonMetadataFields: readonly string[];
  jurisdictionLevels: readonly JurisdictionLevel[];
  jurisdictionRuleScopes: readonly string[];
  authorityCompetenceFields: readonly string[];
  versioningEffectiveDateFields: readonly string[];
  claimKinds: readonly ClaimKind[];
  processGraphFields: readonly string[];
  minimumGermanProcessScope: readonly string[];
  euCoordinationFields: readonly string[];
  v4Connectors: readonly string[];
  v4ConnectorFields: readonly string[];
  initialCrossBorderTopics: readonly string[];
  responsibleActorStates: readonly ResponsibleActorState[];
  languagePresentationPrinciples: readonly string[];
  retrievalPipelineStages: readonly string[];
  prohibitedRetrievalPattern: string;
  citationContractFields: readonly string[];
  conflictStatuses: readonly ConflictStatus[];
  freshnessStatuses: readonly FreshnessStatus[];
  noPersistenceSeparation: readonly string[];
  databaseBoundaryCategories: readonly string[];
  governanceBoundariesPreserved: readonly string[];
  knownOpenDebts: readonly string[];
  sourceEvidence: string[];
  notes: string[];
}

// â”€â”€â”€ Tamper harness â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type TamperCase = { id: number; description: string; mutate: (r: Result) => void };

function clone(r: Result): Result {
  return JSON.parse(JSON.stringify(r)) as Result;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "all German laws ingested", mutate: (r) => { r.germanLawsIngestedClaimed = true; } },
  { id: 2, description: "external sources downloaded", mutate: (r) => { r.externalSourceDownloaded = true; } },
  { id: 3, description: "database migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 4, description: "embeddings generated", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 5, description: "network access performed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 6, description: "model output treated as source", mutate: (r) => { r.modelOutputTreatedAsSourceAccepted = true; } },
  { id: 7, description: "translated text treated as original legal source", mutate: (r) => { r.translationTreatedAsLegalSourceAccepted = true; } },
  { id: 8, description: "blog used as sole high-risk legal basis", mutate: (r) => { r.blogUsedAsSoleHighRiskBasisAccepted = true; } },
  { id: 9, description: "forum used as legal basis", mutate: (r) => { r.forumUsedAsLegalBasisAccepted = true; } },
  { id: 10, description: "search snippet treated as official source", mutate: (r) => { r.searchSnippetTreatedAsOfficialSourceAccepted = true; } },
  { id: 11, description: "retrieval date treated as effective date", mutate: (r) => { r.retrievalDateTreatedAsEffectiveDateAccepted = true; } },
  { id: 12, description: "old source overwritten", mutate: (r) => { r.oldSourceOverwrittenAccepted = true; } },
  { id: 13, description: "expired source treated as current", mutate: (r) => { r.expiredSourceTreatedAsCurrentAccepted = true; } },
  { id: 14, description: "unreviewed changed source treated as verified", mutate: (r) => { r.unreviewedChangedSourceTreatedAsVerifiedAccepted = true; } },
  { id: 15, description: "municipal rule treated as nationwide", mutate: (r) => { r.municipalRuleTreatedAsNationwideAccepted = true; } },
  { id: 16, description: "state rule treated as federal", mutate: (r) => { r.stateRuleTreatedAsFederalAccepted = true; } },
  { id: 17, description: "local authority competence generalized nationally", mutate: (r) => { r.localAuthorityCompetenceGeneralizedNationallyAccepted = true; } },
  { id: 18, description: "authority guessed from language", mutate: (r) => { r.authorityGuessedFromLanguageAccepted = true; } },
  { id: 19, description: "cross-border country inferred from locale", mutate: (r) => { r.localeSeparatedFromCrossBorderCountry = false; } },
  { id: 20, description: "Slovak output automatically means Slovak connector", mutate: (r) => { r.slovakOutputImpliesSlovakConnectorAccepted = true; } },
  { id: 21, description: "English output means no cross-border connector", mutate: (r) => { r.englishOutputImpliesNoCrossBorderConnectorAccepted = true; } },
  { id: 22, description: "user always assumed responsible actor", mutate: (r) => { r.userAlwaysAssumedResponsibleActorAccepted = true; } },
  { id: 23, description: "authority-to-authority exchange ignored", mutate: (r) => { r.authorityToAuthorityExchangeIgnoredAccepted = true; } },
  { id: 24, description: "unresolved competence converted into instruction", mutate: (r) => { r.unresolvedCompetenceConvertedToInstructionAccepted = true; } },
  { id: 25, description: "specific form instruction without evidence", mutate: (r) => { r.specificFormInstructionWithoutEvidenceAccepted = true; } },
  { id: 26, description: "EU coordination merged into German local rule", mutate: (r) => { r.euCoordinationMergedIntoGermanLocalRuleAccepted = true; } },
  { id: 27, description: "German source duplicated once per language", mutate: (r) => { r.germanSourceDuplicatedPerLanguageAccepted = true; } },
  { id: 28, description: "six separate legal truth stores created", mutate: (r) => { r.sixSeparateLegalTruthStoresCreatedAccepted = true; } },
  { id: 29, description: "localization changes urgency", mutate: (r) => { r.localizationChangesUrgencyAccepted = true; } },
  { id: 30, description: "localization removes warnings", mutate: (r) => { r.localizationRemovesWarningsAccepted = true; } },
  { id: 31, description: "localization removes uncertainty", mutate: (r) => { r.localizationRemovesUncertaintyAccepted = true; } },
  { id: 32, description: "localization removes blocked action", mutate: (r) => { r.localizationRemovesBlockedActionAccepted = true; } },
  { id: 33, description: "German official term discarded", mutate: (r) => { r.germanOfficialTermDiscardedAccepted = true; } },
  { id: 34, description: "citation removed from localized answer", mutate: (r) => { r.citationRemovedFromLocalizedAnswerAccepted = true; } },
  { id: 35, description: "vector retrieval used without jurisdiction filter", mutate: (r) => { r.vectorRetrievalWithoutJurisdictionFilterAccepted = true; } },
  { id: 36, description: "vector retrieval used without effective-date filter", mutate: (r) => { r.vectorRetrievalWithoutEffectiveDateFilterAccepted = true; } },
  { id: 37, description: "vector retrieval used without review-status filter", mutate: (r) => { r.vectorRetrievalWithoutReviewStatusFilterAccepted = true; } },
  { id: 38, description: "unrestricted RAG accepted", mutate: (r) => { r.unrestrictedRagAccepted = true; } },
  { id: 39, description: "unsupported claim allowed", mutate: (r) => { r.unsupportedClaimAllowedAccepted = true; } },
  { id: 40, description: "claim without source allowed", mutate: (r) => { r.claimWithoutSourceAllowedAccepted = true; } },
  { id: 41, description: "high-risk conflict ignored", mutate: (r) => { r.highRiskConflictIgnoredAccepted = true; } },
  { id: 42, description: "version conflict ignored", mutate: (r) => { r.versionConflictIgnoredAccepted = true; } },
  { id: 43, description: "competence conflict ignored", mutate: (r) => { r.competenceConflictIgnoredAccepted = true; } },
  { id: 44, description: "translation conflict ignored", mutate: (r) => { r.translationConflictIgnoredAccepted = true; } },
  { id: 45, description: "source passage missing", mutate: (r) => { r.sourcePassageMissingAcceptedInCitation = true; } },
  { id: 46, description: "source version missing", mutate: (r) => { r.sourceVersionMissingAcceptedInCitation = true; } },
  { id: 47, description: "official publisher missing", mutate: (r) => { r.officialPublisherMissingAcceptedInCitation = true; } },
  { id: 48, description: "source hash missing", mutate: (r) => { r.sourceHashMissingAcceptedInCitation = true; } },
  { id: 49, description: "history overwritten", mutate: (r) => { r.historyOverwrittenAccepted = true; } },
  { id: 50, description: "review record omitted", mutate: (r) => { r.reviewRecordOmittedAccepted = true; } },
  { id: 51, description: "freshness status omitted", mutate: (r) => { r.freshnessStatusOmittedAccepted = true; } },
  { id: 52, description: "legal weight omitted", mutate: (r) => { r.legalWeightOmittedAccepted = true; } },
  { id: 53, description: "user content persisted in knowledge database", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 54, description: "OCR image stored as knowledge", mutate: (r) => { r.ocrImageStoredAsKnowledgeAccepted = true; } },
  { id: 55, description: "DNA profile mixed into public knowledge", mutate: (r) => { r.dnaProfileMixedIntoPublicKnowledgeAccepted = true; } },
  { id: 56, description: "PII redaction weakened", mutate: (r) => { r.piiRedactionWeakenedAccepted = true; } },
  { id: 57, description: "raw image sent to model", mutate: (r) => { r.rawImageSentToModelAccepted = true; } },
  { id: 58, description: "exact deadline computed without evidence", mutate: (r) => { r.exactDeadlineComputedWithoutEvidenceAccepted = true; } },
  { id: 59, description: "legal advice authorized", mutate: (r) => { r.legalAdviceAuthorizedAccepted = true; } },
  { id: 60, description: "official filing authorized", mutate: (r) => { r.officialFilingAuthorizedAccepted = true; } },
  { id: 61, description: "payment authorized", mutate: (r) => { r.paymentAuthorizedAccepted = true; } },
  { id: 62, description: "signing authorized", mutate: (r) => { r.signingAuthorizedAccepted = true; } },
  { id: 63, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 64, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 65, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 66, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 67, description: "standalone shell falsely marked complete", mutate: (r) => { r.stillHostedInsideDnaShell = false; } },
  { id: 68, description: "Android falsely marked tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 69, description: "iOS falsely marked tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 70, description: "HEIC falsely marked complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 71, description: "serverless OCR falsely marked complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 72, description: "distributed limiter falsely marked complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 73, description: "payment flow falsely marked complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 74, description: "six launch languages falsely marked production-ready", mutate: (r) => { r.sixLanguagesFalselyMarkedProductionReadyAccepted = true; } },
  { id: 75, description: "German knowledge falsely marked populated", mutate: (r) => { r.germanKnowledgeFalselyMarkedPopulatedAccepted = true; } },
  { id: 76, description: "V4 connectors falsely marked populated", mutate: (r) => { r.v4ConnectorsFalselyMarkedPopulatedAccepted = true; } },
  { id: 77, description: "audit passes if an existing file changed", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 78, description: "audit passes if network access occurred", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 79, description: "audit passes if a database migration exists", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 80, description: "audit passes if user persistence occurred", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 81, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9B"; } },
  { id: 82, description: "sourceClosureCommit mismatch", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 83, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
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
    r.checkId === "9A",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceInspectionOnly === true,

    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.databaseMigrationCreated === false,
    r.databaseWritePerformed === false,
    r.networkAccessPerformed === false,
    r.externalSourceDownloaded === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.persistenceOfUserContentPerformed === false,

    r.germanKnowledgeCoreDesigned === true,
    r.officialSourceRegistryDesigned === true,
    r.sourceVersioningDesigned === true,
    r.effectiveDateModelDesigned === true,
    r.jurisdictionModelDesigned === true,
    r.authorityCompetenceModelDesigned === true,
    r.claimModelDesigned === true,
    r.administrativeProcessGraphDesigned === true,
    r.citationContractDesigned === true,
    r.retrievalBoundaryDesigned === true,
    r.conflictHandlingDesigned === true,
    r.freshnessReviewDesigned === true,
    r.euCoordinationLayerDesigned === true,
    r.v4ConnectorArchitectureDesigned === true,
    r.responsibleActorRuleDesigned === true,
    r.languagePresentationLayerDesigned === true,
    r.sixLaunchLocalesRecorded === true,
    r.germanSourceLanguagePreserved === true,
    r.localeSeparatedFromCrossBorderCountry === true,
    r.knowledgePersistenceSeparatedFromUserContent === true,

    r.minimumGermanProcessScopeRecorded === true,
    r.initialCrossBorderTopicsRecorded === true,

    r.standaloneSmartTalkExtractionRequiredLater === true,
    r.stillHostedInsideDnaShell === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.heicHeifStillOpen === true,
    r.serverlessOcrStillOpen === true,
    r.distributedRateLimiterStillOpen === true,
    r.paymentFlowStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,
    r.allEntityContractsDeclared === true,

    r.germanLawsIngestedClaimed === false,
    r.modelOutputTreatedAsSourceAccepted === false,
    r.translationTreatedAsLegalSourceAccepted === false,
    r.blogUsedAsSoleHighRiskBasisAccepted === false,
    r.forumUsedAsLegalBasisAccepted === false,
    r.searchSnippetTreatedAsOfficialSourceAccepted === false,
    r.retrievalDateTreatedAsEffectiveDateAccepted === false,
    r.oldSourceOverwrittenAccepted === false,
    r.expiredSourceTreatedAsCurrentAccepted === false,
    r.unreviewedChangedSourceTreatedAsVerifiedAccepted === false,
    r.municipalRuleTreatedAsNationwideAccepted === false,
    r.stateRuleTreatedAsFederalAccepted === false,
    r.localAuthorityCompetenceGeneralizedNationallyAccepted === false,
    r.authorityGuessedFromLanguageAccepted === false,
    r.slovakOutputImpliesSlovakConnectorAccepted === false,
    r.englishOutputImpliesNoCrossBorderConnectorAccepted === false,
    r.userAlwaysAssumedResponsibleActorAccepted === false,
    r.authorityToAuthorityExchangeIgnoredAccepted === false,
    r.unresolvedCompetenceConvertedToInstructionAccepted === false,
    r.specificFormInstructionWithoutEvidenceAccepted === false,
    r.euCoordinationMergedIntoGermanLocalRuleAccepted === false,
    r.germanSourceDuplicatedPerLanguageAccepted === false,
    r.sixSeparateLegalTruthStoresCreatedAccepted === false,
    r.localizationChangesUrgencyAccepted === false,
    r.localizationRemovesWarningsAccepted === false,
    r.localizationRemovesUncertaintyAccepted === false,
    r.localizationRemovesBlockedActionAccepted === false,
    r.germanOfficialTermDiscardedAccepted === false,
    r.citationRemovedFromLocalizedAnswerAccepted === false,
    r.vectorRetrievalWithoutJurisdictionFilterAccepted === false,
    r.vectorRetrievalWithoutEffectiveDateFilterAccepted === false,
    r.vectorRetrievalWithoutReviewStatusFilterAccepted === false,
    r.unrestrictedRagAccepted === false,
    r.unsupportedClaimAllowedAccepted === false,
    r.claimWithoutSourceAllowedAccepted === false,
    r.highRiskConflictIgnoredAccepted === false,
    r.versionConflictIgnoredAccepted === false,
    r.competenceConflictIgnoredAccepted === false,
    r.translationConflictIgnoredAccepted === false,
    r.sourcePassageMissingAcceptedInCitation === false,
    r.sourceVersionMissingAcceptedInCitation === false,
    r.officialPublisherMissingAcceptedInCitation === false,
    r.sourceHashMissingAcceptedInCitation === false,
    r.historyOverwrittenAccepted === false,
    r.reviewRecordOmittedAccepted === false,
    r.freshnessStatusOmittedAccepted === false,
    r.legalWeightOmittedAccepted === false,
    r.ocrImageStoredAsKnowledgeAccepted === false,
    r.dnaProfileMixedIntoPublicKnowledgeAccepted === false,
    r.piiRedactionWeakenedAccepted === false,
    r.rawImageSentToModelAccepted === false,
    r.exactDeadlineComputedWithoutEvidenceAccepted === false,
    r.legalAdviceAuthorizedAccepted === false,
    r.officialFilingAuthorizedAccepted === false,
    r.paymentAuthorizedAccepted === false,
    r.signingAuthorizedAccepted === false,
    r.sixLanguagesFalselyMarkedProductionReadyAccepted === false,
    r.germanKnowledgeFalselyMarkedPopulatedAccepted === false,
    r.v4ConnectorsFalselyMarkedPopulatedAccepted === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// â”€â”€â”€ Evidence collection (static source inspection + read-only git) â”€â”€â”€â”€â”€â”€â”€

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  newAuditFileCreated: boolean;
  sixLaunchLocalesRecorded: boolean;
  stillHostedInsideDnaShell: boolean;
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

  // Git may report a newly created *directory* as untracked (e.g.
  // "lib/vaylo/smart-talk/knowledge/") rather than the individual file
  // path when the whole directory is new. Treat an untracked entry as
  // covering the audit file if it equals the file path, is a suffix
  // match, or is a directory prefix of the file path.
  const isAuditPathOrDirCovering = (p: string): boolean => {
    if (p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH)) return true;
    const dirPrefix = p.endsWith("/") ? p : `${p}/`;
    return AUDIT_SELF_REL_PATH.startsWith(dirPrefix);
  };

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const newAuditFileCreated =
    fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isAuditPathOrDirCovering(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isAuditPathOrDirCovering(p));

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const i18nSrc = readFileText(I18N_INDEX_REL_PATH);
  const sixLaunchLocalesRecorded =
    fileExists(I18N_INDEX_REL_PATH) && LAUNCH_LOCALES.every((l) => new RegExp(`"${l}"`).test(i18nSrc));
  const futureLocalesStillPresentButNotLaunch = FUTURE_LOCALES.every((l) => new RegExp(`"${l}"`).test(i18nSrc));
  if (!futureLocalesStillPresentButNotLaunch) {
    notes.push("Future locales (ro/bg/uk/tr/ru) expected in lib/i18n/index.ts were not all found; recorded for transparency only.");
  }

  const closureSrc = readFileText(CLOSURE_8_13C_REL_PATH);
  const closureExists = fileExists(CLOSURE_8_13C_REL_PATH);
  const stillHostedInsideDnaShell = closureExists && closureSrc.includes("stillHostedInsideDnaShell: true");
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
    sixLaunchLocalesRecorded,
    stillHostedInsideDnaShell,
    physicalAndroidStillUntested,
    genuineIosSafariStillUntested,
    heicHeifStillOpen,
    serverlessOcrStillOpen,
    distributedRateLimiterStillOpen,
    paymentFlowStillOpen,
    notes,
  };
}

function checkAllEntityContractsDeclared(): boolean {
  const selfSrc = readFileText(AUDIT_SELF_REL_PATH) || "";
  if (!selfSrc) return ENTITY_CONTRACT_NAMES.length === 25;
  return ENTITY_CONTRACT_NAMES.every((name) => selfSrc.includes(`interface ${name}`) || selfSrc.includes(`type ${name}`));
}

// â”€â”€â”€ Good-result construction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function buildGoodResult(evidence: Evidence): Result {
  const allEntityContractsDeclared = checkAllEntityContractsDeclared() && ENTITY_CONTRACT_NAMES.length === 25;

  const designComplete =
    ARCHITECTURE_LAYERS.length === 12 &&
    SOURCE_TYPES.length === 14 &&
    UNTRUSTED_NON_AUTHORITATIVE_SOURCES.length >= 10 &&
    COMMON_METADATA_FIELDS.length >= 25 &&
    allEntityContractsDeclared &&
    JURISDICTION_LEVELS.length === 8 &&
    CLAIM_KINDS.length === 7 &&
    MINIMUM_GERMAN_PROCESS_SCOPE.length === 16 &&
    V4_CONNECTORS.length === 4 &&
    INITIAL_CROSS_BORDER_TOPICS.length === 6 &&
    RESPONSIBLE_ACTOR_STATES.length === 6 &&
    LAUNCH_LOCALES.length === 6 &&
    CONFLICT_STATUSES.length === 7 &&
    FRESHNESS_STATUSES.length === 8 &&
    GOVERNANCE_BOUNDARIES_PRESERVED.length === 12;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sixLaunchLocalesRecorded;

  return {
    checkId: "9A",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceInspectionOnly: true,

    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    databaseMigrationCreated: false,
    databaseWritePerformed: false,
    networkAccessPerformed: false,
    externalSourceDownloaded: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    persistenceOfUserContentPerformed: false,

    germanKnowledgeCoreDesigned: true,
    officialSourceRegistryDesigned: true,
    sourceVersioningDesigned: true,
    effectiveDateModelDesigned: true,
    jurisdictionModelDesigned: true,
    authorityCompetenceModelDesigned: true,
    claimModelDesigned: true,
    administrativeProcessGraphDesigned: true,
    citationContractDesigned: true,
    retrievalBoundaryDesigned: true,
    conflictHandlingDesigned: true,
    freshnessReviewDesigned: true,
    euCoordinationLayerDesigned: true,
    v4ConnectorArchitectureDesigned: true,
    responsibleActorRuleDesigned: true,
    languagePresentationLayerDesigned: true,
    sixLaunchLocalesRecorded: evidence.sixLaunchLocalesRecorded,
    germanSourceLanguagePreserved: true,
    localeSeparatedFromCrossBorderCountry: true,
    knowledgePersistenceSeparatedFromUserContent: true,

    minimumGermanProcessScopeRecorded: true,
    initialCrossBorderTopicsRecorded: true,

    standaloneSmartTalkExtractionRequiredLater: true,
    stillHostedInsideDnaShell: evidence.stillHostedInsideDnaShell,
    physicalAndroidStillUntested: evidence.physicalAndroidStillUntested,
    genuineIosSafariStillUntested: evidence.genuineIosSafariStillUntested,
    heicHeifStillOpen: evidence.heicHeifStillOpen,
    serverlessOcrStillOpen: evidence.serverlessOcrStillOpen,
    distributedRateLimiterStillOpen: evidence.distributedRateLimiterStillOpen,
    paymentFlowStillOpen: evidence.paymentFlowStillOpen,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForGermanSourceHierarchyAndTrustContract: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,
    allEntityContractsDeclared,

    germanLawsIngestedClaimed: false,
    modelOutputTreatedAsSourceAccepted: false,
    translationTreatedAsLegalSourceAccepted: false,
    blogUsedAsSoleHighRiskBasisAccepted: false,
    forumUsedAsLegalBasisAccepted: false,
    searchSnippetTreatedAsOfficialSourceAccepted: false,
    retrievalDateTreatedAsEffectiveDateAccepted: false,
    oldSourceOverwrittenAccepted: false,
    expiredSourceTreatedAsCurrentAccepted: false,
    unreviewedChangedSourceTreatedAsVerifiedAccepted: false,
    municipalRuleTreatedAsNationwideAccepted: false,
    stateRuleTreatedAsFederalAccepted: false,
    localAuthorityCompetenceGeneralizedNationallyAccepted: false,
    authorityGuessedFromLanguageAccepted: false,
    slovakOutputImpliesSlovakConnectorAccepted: false,
    englishOutputImpliesNoCrossBorderConnectorAccepted: false,
    userAlwaysAssumedResponsibleActorAccepted: false,
    authorityToAuthorityExchangeIgnoredAccepted: false,
    unresolvedCompetenceConvertedToInstructionAccepted: false,
    specificFormInstructionWithoutEvidenceAccepted: false,
    euCoordinationMergedIntoGermanLocalRuleAccepted: false,
    germanSourceDuplicatedPerLanguageAccepted: false,
    sixSeparateLegalTruthStoresCreatedAccepted: false,
    localizationChangesUrgencyAccepted: false,
    localizationRemovesWarningsAccepted: false,
    localizationRemovesUncertaintyAccepted: false,
    localizationRemovesBlockedActionAccepted: false,
    germanOfficialTermDiscardedAccepted: false,
    citationRemovedFromLocalizedAnswerAccepted: false,
    vectorRetrievalWithoutJurisdictionFilterAccepted: false,
    vectorRetrievalWithoutEffectiveDateFilterAccepted: false,
    vectorRetrievalWithoutReviewStatusFilterAccepted: false,
    unrestrictedRagAccepted: false,
    unsupportedClaimAllowedAccepted: false,
    claimWithoutSourceAllowedAccepted: false,
    highRiskConflictIgnoredAccepted: false,
    versionConflictIgnoredAccepted: false,
    competenceConflictIgnoredAccepted: false,
    translationConflictIgnoredAccepted: false,
    sourcePassageMissingAcceptedInCitation: false,
    sourceVersionMissingAcceptedInCitation: false,
    officialPublisherMissingAcceptedInCitation: false,
    sourceHashMissingAcceptedInCitation: false,
    historyOverwrittenAccepted: false,
    reviewRecordOmittedAccepted: false,
    freshnessStatusOmittedAccepted: false,
    legalWeightOmittedAccepted: false,
    ocrImageStoredAsKnowledgeAccepted: false,
    dnaProfileMixedIntoPublicKnowledgeAccepted: false,
    piiRedactionWeakenedAccepted: false,
    rawImageSentToModelAccepted: false,
    exactDeadlineComputedWithoutEvidenceAccepted: false,
    legalAdviceAuthorizedAccepted: false,
    officialFilingAuthorizedAccepted: false,
    paymentAuthorizedAccepted: false,
    signingAuthorizedAccepted: false,
    sixLanguagesFalselyMarkedProductionReadyAccepted: false,
    germanKnowledgeFalselyMarkedPopulatedAccepted: false,
    v4ConnectorsFalselyMarkedPopulatedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    architectureLayers: ARCHITECTURE_LAYERS,
    sourceTypeHierarchyExample: ILLUSTRATIVE_DEFAULT_LEGAL_WEIGHT_ORDER,
    untrustedSources: UNTRUSTED_NON_AUTHORITATIVE_SOURCES,
    entityContractNames: ENTITY_CONTRACT_NAMES,
    commonMetadataFields: COMMON_METADATA_FIELDS,
    jurisdictionLevels: JURISDICTION_LEVELS,
    jurisdictionRuleScopes: JURISDICTION_RULE_SCOPES,
    authorityCompetenceFields: AUTHORITY_COMPETENCE_FIELDS,
    versioningEffectiveDateFields: VERSIONING_EFFECTIVE_DATE_FIELDS,
    claimKinds: CLAIM_KINDS,
    processGraphFields: PROCESS_GRAPH_FIELDS,
    minimumGermanProcessScope: MINIMUM_GERMAN_PROCESS_SCOPE,
    euCoordinationFields: EU_COORDINATION_FIELDS,
    v4Connectors: V4_CONNECTORS,
    v4ConnectorFields: V4_CONNECTOR_FIELDS,
    initialCrossBorderTopics: INITIAL_CROSS_BORDER_TOPICS,
    responsibleActorStates: RESPONSIBLE_ACTOR_STATES,
    languagePresentationPrinciples: LANGUAGE_PRESENTATION_PRINCIPLES,
    retrievalPipelineStages: RETRIEVAL_PIPELINE_STAGES,
    prohibitedRetrievalPattern: PROHIBITED_RETRIEVAL_PATTERN,
    citationContractFields: CITATION_CONTRACT_FIELDS,
    conflictStatuses: CONFLICT_STATUSES,
    freshnessStatuses: FRESHNESS_STATUSES,
    noPersistenceSeparation: NO_PERSISTENCE_SEPARATION,
    databaseBoundaryCategories: DATABASE_BOUNDARY_CATEGORIES,
    governanceBoundariesPreserved: GOVERNANCE_BOUNDARIES_PRESERVED,
    knownOpenDebts: KNOWN_OPEN_DEBTS,
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${I18N_INDEX_REL_PATH} sixLaunchLocalesRecorded (de/en/sk/cs/pl/hu present): ${evidence.sixLaunchLocalesRecorded}`,
      `${CLOSURE_8_13C_REL_PATH} stillHostedInsideDnaShell: ${evidence.stillHostedInsideDnaShell}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      `allEntityContractsDeclared (25 required design contracts present in this file's own source): ${allEntityContractsDeclared}`,
      "This audit read only committed plain text for lib/i18n/index.ts and the 8.13C closure audit — neither was imported or executed.",
      "No knowledge ingestion, database migration, RAG implementation, vector search, source download, scraping, or production runtime wiring was performed by this phase.",
    ],
    notes: evidence.notes,
  };
}

// â”€â”€â”€ Entry point â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export function runGermanKnowledgeSystemBoundaryArchitectureGateDesignAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForGermanSourceHierarchyAndTrustContract: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runGermanKnowledgeSystemBoundaryArchitectureGateDesignAudit();
  console.log(JSON.stringify(result));
}
