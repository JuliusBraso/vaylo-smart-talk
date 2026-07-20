/**
 * PHASE 9E — Minimal Knowledge Storage Schema Audit
 * (Schema Design and Audit Only)
 *
 * This file defines a deterministic, immutable *logical* storage-schema
 * design for the future Birello German Knowledge System — derived from
 * PHASE 9A (architecture boundary), PHASE 9B (source hierarchy / trust
 * contract), PHASE 9C (jurisdiction / effective-date model) and PHASE 9D
 * (minimum German process coverage plan). It performs NO dynamic
 * execution: no SQL, no migration, no database, no network, no source
 * ingestion, no authority registration, no embeddings, no retrieval, no
 * model call, no OCR, no DE<->SK connector implementation, no
 * user-content persistence, no environment mutation.
 *
 * It only:
 *   1. Declares immutable, type-only logical schema contracts (32 storage
 *      layers, 26 branded identifier types, ~30 entity-record interfaces,
 *      relationship/cardinality/uniqueness/indexing/lifecycle contracts,
 *      normalization boundary, minimality classification, public-knowledge
 *      vs user-data separation, DE<->SK representability without
 *      implementation).
 *   2. Reads the PHASE 9A-9D audit files and the PHASE 8.13C closure audit
 *      as plain text via `fs.readFileSync` (never imports/executes them)
 *      to ground a few conservative booleans, and lists (but does not
 *      execute) existing Supabase migration files purely to observe the
 *      naming convention.
 *   3. Runs read-only `git` commands to confirm this phase created exactly
 *      one new file and modified no existing file.
 *   4. Runs 172 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "9a70287";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";
const SOURCE_TRUST_CONTRACT_CHECK_ID = "9B";
const SOURCE_JURISDICTION_MODEL_CHECK_ID = "9C";
const SOURCE_COVERAGE_PLAN_CHECK_ID = "9D";

const PHASE_9A_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";
const PHASE_9B_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-source-hierarchy-trust-contract-audit.ts";
const PHASE_9C_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-jurisdiction-effective-date-model-audit.ts";
const PHASE_9D_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimum-german-process-coverage-plan-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-storage-schema-audit.ts";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";

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

function listDirNamesOnly(relPath: string): readonly string[] {
  try {
    return fs.readdirSync(path.join(process.cwd(), relPath));
  } catch {
    return [];
  }
}

// ============================================================================
// BRANDED IDENTIFIER TYPES (26) — stable across source-version changes
// ============================================================================

type Id<Brand extends string> = string & { readonly __brand: Brand };

export type SourceId = Id<"SourceId">;
export type SourceVersionId = Id<"SourceVersionId">;
export type PassageId = Id<"PassageId">;
export type PublisherId = Id<"PublisherId">;
export type JurisdictionId = Id<"JurisdictionId">;
export type TerritorialScopeId = Id<"TerritorialScopeId">;
export type AuthorityId = Id<"AuthorityId">;
export type AuthorityCompetenceId = Id<"AuthorityCompetenceId">;
export type ClaimId = Id<"ClaimId">;
export type ProcessId = Id<"ProcessId">;
export type ProcessStepId = Id<"ProcessStepId">;
export type FormId = Id<"FormId">;
export type EvidenceRequirementId = Id<"EvidenceRequirementId">;
export type DeadlineRuleId = Id<"DeadlineRuleId">;
export type FeeRuleId = Id<"FeeRuleId">;
export type EligibilityRuleId = Id<"EligibilityRuleId">;
export type OverrideId = Id<"OverrideId">;
export type ReviewRecordId = Id<"ReviewRecordId">;
export type FreshnessRecordId = Id<"FreshnessRecordId">;
export type ConflictId = Id<"ConflictId">;
export type CitationId = Id<"CitationId">;
export type TerminologyEntryId = Id<"TerminologyEntryId">;
export type TrustDomainId = Id<"TrustDomainId">;
export type CrossBorderConnectorId = Id<"CrossBorderConnectorId">;
export type CrossBorderProcessId = Id<"CrossBorderProcessId">;
export type ResponsibleActorRuleId = Id<"ResponsibleActorRuleId">;
export type AuditEventId = Id<"AuditEventId">;

const IDENTIFIER_TYPE_NAMES: readonly string[] = [
  "SourceId", "SourceVersionId", "PassageId", "PublisherId", "JurisdictionId", "TerritorialScopeId",
  "AuthorityId", "AuthorityCompetenceId", "ClaimId", "ProcessId", "ProcessStepId", "FormId",
  "EvidenceRequirementId", "DeadlineRuleId", "FeeRuleId", "EligibilityRuleId", "OverrideId",
  "ReviewRecordId", "FreshnessRecordId", "ConflictId", "CitationId", "TerminologyEntryId",
  "TrustDomainId", "CrossBorderConnectorId", "CrossBorderProcessId", "ResponsibleActorRuleId", "AuditEventId",
];

// ============================================================================
// LOGICAL STORAGE LAYERS (32) — logical components only, no real DB objects
// ============================================================================

type LogicalStorageLayer =
  | "source_registry" | "source_versions" | "source_passages" | "publishers" | "jurisdictions"
  | "territorial_scopes" | "authorities" | "authority_competences" | "claims" | "claim_evidence_links"
  | "administrative_processes" | "process_steps" | "process_claim_links" | "forms" | "form_requirements"
  | "evidence_requirements" | "deadline_rules" | "fee_rules" | "eligibility_rules" | "regional_overrides"
  | "review_records" | "freshness_records" | "knowledge_conflicts" | "citations" | "terminology_entries"
  | "localized_terminology" | "trust_domain_links" | "cross_border_connectors" | "cross_border_processes"
  | "responsible_actor_rules" | "retrieval_metadata" | "audit_events";

const LOGICAL_STORAGE_LAYERS: readonly LogicalStorageLayer[] = [
  "source_registry", "source_versions", "source_passages", "publishers", "jurisdictions",
  "territorial_scopes", "authorities", "authority_competences", "claims", "claim_evidence_links",
  "administrative_processes", "process_steps", "process_claim_links", "forms", "form_requirements",
  "evidence_requirements", "deadline_rules", "fee_rules", "eligibility_rules", "regional_overrides",
  "review_records", "freshness_records", "knowledge_conflicts", "citations", "terminology_entries",
  "localized_terminology", "trust_domain_links", "cross_border_connectors", "cross_border_processes",
  "responsible_actor_rules", "retrieval_metadata", "audit_events",
];

// ============================================================================
// CORE SCHEMA PRINCIPLES
// ============================================================================

const CORE_SCHEMA_PRINCIPLES: readonly string[] = [
  "immutable source versions", "append-only historical source-version preservation", "stable identifiers",
  "explicit jurisdiction", "explicit territorial scope", "explicit effective periods",
  "explicit publisher and authority competence", "passage-level citations", "claim-level evidence relationships",
  "conflict and review states", "separation of public knowledge from user content",
  "separation of source language from output locale", "support for multiple trust domains",
  "support for future structured retrieval", "support for future full-text and vector indexing without making vectors authoritative",
  "no silent overwrite", "no unsupported denormalized legal truth", "no direct storage of model-generated output as authoritative source content",
];
const ONE_GIANT_KNOWLEDGE_TABLE_OR_JSON_DOCUMENT_ALLOWED = false as const;

// ============================================================================
// ENTITY RECORD CONTRACTS (immutable, readonly, exact field lists)
// ============================================================================

type SourceType = string;
type SourcePurpose = string;
type OfficialDomainVerificationStatus = "verified" | "unverified" | "review_required";
type SourceLanguageCode = string;
type ReviewStatusLike = "unverified" | "machine_prechecked" | "human_reviewed" | "expert_reviewed" | "review_required";

export interface SourceRegistryRecord {
  sourceId: SourceId;
  publisherId: PublisherId;
  sourceType: SourceType;
  sourcePurpose: SourcePurpose;
  canonicalUrl?: string;
  officialDomain?: string;
  officialDomainVerificationStatus: OfficialDomainVerificationStatus;
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  sourceLanguage: SourceLanguageCode;
  publicationIdentifier?: string;
  supportsClaimTypes: readonly string[];
  blockedClaimTypes: readonly string[];
  highRiskUseAllowed: boolean;
  discoveryUseAllowed: boolean;
  createdAt: string;
  archivedAt?: string;
  status: "active" | "archived" | "superseded" | "unresolved";
}
const SOURCE_REGISTRY_FIELDS: readonly (keyof SourceRegistryRecord)[] = [
  "sourceId", "publisherId", "sourceType", "sourcePurpose", "canonicalUrl", "officialDomain",
  "officialDomainVerificationStatus", "jurisdictionId", "territorialScopeId", "sourceLanguage",
  "publicationIdentifier", "supportsClaimTypes", "blockedClaimTypes", "highRiskUseAllowed",
  "discoveryUseAllowed", "createdAt", "archivedAt", "status",
];

export interface SourceVersionRecord {
  sourceVersionId: SourceVersionId;
  sourceId: SourceId;
  versionSequence: number;
  contentHash: string;
  retrievedAt: string;
  publishedAt?: string;
  adoptedAt?: string;
  promulgatedAt?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  applicableFrom?: string;
  applicableUntil?: string;
  sourceLastModifiedAt?: string;
  supersedesVersionId?: SourceVersionId;
  supersededByVersionId?: SourceVersionId;
  reviewStatus: ReviewStatusLike;
  freshnessStatus: string;
  changeStatus: string;
  immutable: true;
  historicalUseAllowed: boolean;
  currentUseAllowed: boolean;
  rawContentLocation?: string;
  normalizedContentLocation?: string;
  createdAt: string;
}
const SOURCE_VERSION_FIELDS: readonly (keyof SourceVersionRecord)[] = [
  "sourceVersionId", "sourceId", "versionSequence", "contentHash", "retrievedAt", "publishedAt",
  "adoptedAt", "promulgatedAt", "effectiveFrom", "effectiveUntil", "applicableFrom", "applicableUntil",
  "sourceLastModifiedAt", "supersedesVersionId", "supersededByVersionId", "reviewStatus", "freshnessStatus",
  "changeStatus", "immutable", "historicalUseAllowed", "currentUseAllowed", "rawContentLocation",
  "normalizedContentLocation", "createdAt",
];
const SOURCE_VERSION_OVERWRITTEN_IN_PLACE = false as const;

export interface SourcePassageRecord {
  passageId: PassageId;
  sourceVersionId: SourceVersionId;
  passageOrder: number;
  headingPath?: readonly string[];
  pageNumber?: number;
  paragraphNumber?: number;
  sectionIdentifier?: string;
  articleIdentifier?: string;
  text: string;
  textHash: string;
  language: SourceLanguageCode;
  characterStart?: number;
  characterEnd?: number;
  citationReady: boolean;
  reviewStatus: ReviewStatusLike;
  createdAt: string;
}
const SOURCE_PASSAGE_FIELDS: readonly (keyof SourcePassageRecord)[] = [
  "passageId", "sourceVersionId", "passageOrder", "headingPath", "pageNumber", "paragraphNumber",
  "sectionIdentifier", "articleIdentifier", "text", "textHash", "language", "characterStart",
  "characterEnd", "citationReady", "reviewStatus", "createdAt",
];
const PRECISE_CLAIMS_MAY_CITE_SOURCE_ID_ONLY = false as const;

export interface PublisherRecord {
  publisherId: PublisherId;
  publisherName: string;
  publisherType: string;
  officialStatus: boolean;
  subjectMatterCompetence: readonly string[];
  territorialCompetence?: TerritorialScopeId;
  proceduralCompetence?: readonly string[];
  officialDomainIds: readonly string[];
  trustDomainId: TrustDomainId;
  activeFrom?: string;
  activeUntil?: string;
  reviewStatus: ReviewStatusLike;
}
const PUBLISHER_FIELDS: readonly (keyof PublisherRecord)[] = [
  "publisherId", "publisherName", "publisherType", "officialStatus", "subjectMatterCompetence",
  "territorialCompetence", "proceduralCompetence", "officialDomainIds", "trustDomainId",
  "activeFrom", "activeUntil", "reviewStatus",
];
const OFFICIAL_STATUS_PROVES_UNIVERSAL_COMPETENCE = false as const;

export interface JurisdictionRecord {
  jurisdictionId: JurisdictionId;
  jurisdictionLevel:
    | "eu" | "de_federal" | "de_land" | "de_regierungsbezirk" | "de_kreis" | "de_kreisfreie_stadt"
    | "de_stadt" | "de_gemeinde" | "de_bezirk" | "de_specific_authority" | "cross_border_multi_jurisdiction" | "unresolved";
  jurisdictionCode?: string;
  countryCode?: string;
  parentJurisdictionId?: JurisdictionId;
  name: string;
  validFrom?: string;
  validUntil?: string;
  status: "active" | "superseded" | "unresolved";
}
const JURISDICTION_FIELDS: readonly (keyof JurisdictionRecord)[] = [
  "jurisdictionId", "jurisdictionLevel", "jurisdictionCode", "countryCode", "parentJurisdictionId",
  "name", "validFrom", "validUntil", "status",
];

export interface TerritorialScopeRecord {
  territorialScopeId: TerritorialScopeId;
  scopeType: string;
  jurisdictionIds: readonly JurisdictionId[];
  landCodes?: readonly string[];
  kreisCodes?: readonly string[];
  cityCodes?: readonly string[];
  municipalityCodes?: readonly string[];
  bezirkCodes?: readonly string[];
  postalCodeAreas?: readonly string[];
  authorityIds?: readonly AuthorityId[];
  serviceAreaIds?: readonly string[];
  crossBorderCountries?: readonly string[];
  scopeVerified: boolean;
  reviewStatus: ReviewStatusLike;
  validFrom?: string;
  validUntil?: string;
}
const TERRITORIAL_SCOPE_FIELDS: readonly (keyof TerritorialScopeRecord)[] = [
  "territorialScopeId", "scopeType", "jurisdictionIds", "landCodes", "kreisCodes", "cityCodes",
  "municipalityCodes", "bezirkCodes", "postalCodeAreas", "authorityIds", "serviceAreaIds",
  "crossBorderCountries", "scopeVerified", "reviewStatus", "validFrom", "validUntil",
];
const LOCAL_SCOPE_GENERALIZED_NATIONALLY_ALLOWED = false as const;

export interface AuthorityRecord {
  authorityId: AuthorityId;
  publisherId: PublisherId;
  authorityName: string;
  authorityType: string;
  jurisdictionId: JurisdictionId;
  territorialScopeId: TerritorialScopeId;
  officialPortalUrl?: string;
  informationUrl?: string;
  applicationUrl?: string;
  contactChannels?: readonly string[];
  activeFrom?: string;
  activeUntil?: string;
  status: "active" | "reorganized" | "unresolved";
  reviewStatus: ReviewStatusLike;
}
const AUTHORITY_FIELDS: readonly (keyof AuthorityRecord)[] = [
  "authorityId", "publisherId", "authorityName", "authorityType", "jurisdictionId", "territorialScopeId",
  "officialPortalUrl", "informationUrl", "applicationUrl", "contactChannels", "activeFrom", "activeUntil",
  "status", "reviewStatus",
];

export interface AuthorityCompetenceRecord {
  authorityCompetenceId: AuthorityCompetenceId;
  authorityId: AuthorityId;
  subjectMatter: string;
  territorialScopeId: TerritorialScopeId;
  personalScope?: string;
  proceduralStage?: string;
  receivesApplication: boolean;
  decidesApplication: boolean;
  providesInformationOnly: boolean;
  forwardsApplication: boolean;
  issuesDocument: boolean;
  verifiesEvidence: boolean;
  requestsForeignEvidence: boolean;
  institutionExchangeExpected: boolean;
  handlesAppeal: boolean;
  handlesEnforcement: boolean;
  competenceSourceVersionId: SourceVersionId;
  competencePassageId?: PassageId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
}
const AUTHORITY_COMPETENCE_FIELDS: readonly (keyof AuthorityCompetenceRecord)[] = [
  "authorityCompetenceId", "authorityId", "subjectMatter", "territorialScopeId", "personalScope",
  "proceduralStage", "receivesApplication", "decidesApplication", "providesInformationOnly",
  "forwardsApplication", "issuesDocument", "verifiesEvidence", "requestsForeignEvidence",
  "institutionExchangeExpected", "handlesAppeal", "handlesEnforcement", "competenceSourceVersionId",
  "competencePassageId", "effectiveFrom", "effectiveUntil", "reviewStatus", "conflictStatus",
];
const AUTHORITY_COMPETENCE_MAY_BE_FREE_TEXT_ONLY = false as const;
const NEARBY_AUTHORITY_PROVES_COMPETENCE_WITHOUT_RECORD = false as const;

export interface ClaimRecord {
  claimId: ClaimId;
  claimType: string;
  claimTextCanonical: string;
  claimLanguage: "de";
  market: "DE";
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  authorityId?: AuthorityId;
  riskLevel: "low" | "medium" | "high" | "mixed";
  allowedOutputUses: readonly string[];
  blockedOutputUses: readonly string[];
  requiresCitation: true;
  requiresDirectSupport: boolean;
  requiresEffectiveDate: boolean;
  requiresAuthorityResolution: boolean;
  requiresConflictClearance: boolean;
  reviewStatus: ReviewStatusLike;
  freshnessStatus: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  status: "active" | "superseded" | "unresolved";
  createdAt: string;
}
const CLAIM_FIELDS: readonly (keyof ClaimRecord)[] = [
  "claimId", "claimType", "claimTextCanonical", "claimLanguage", "market", "jurisdictionId",
  "territorialScopeId", "authorityId", "riskLevel", "allowedOutputUses", "blockedOutputUses",
  "requiresCitation", "requiresDirectSupport", "requiresEffectiveDate", "requiresAuthorityResolution",
  "requiresConflictClearance", "reviewStatus", "freshnessStatus", "effectiveFrom", "effectiveUntil",
  "status", "createdAt",
];
const CLAIM_STORES_LOCALIZED_OUTPUT_AS_SEPARATE_LEGAL_TRUTH = false as const;

type SupportStatus = "direct_support" | "partial_support" | "contextual_support" | "contradictory" | "ambiguous" | "no_support";
const SUPPORT_STATUSES: readonly SupportStatus[] = [
  "direct_support", "partial_support", "contextual_support", "contradictory", "ambiguous", "no_support",
];

export interface ClaimEvidenceLinkRecord {
  claimId: ClaimId;
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  supportStatus: SupportStatus;
  evidenceRole: string;
  isPrimaryEvidence: boolean;
  jurisdictionMatch: boolean;
  territorialScopeMatch: boolean;
  authorityCompetenceMatch: boolean;
  effectiveDateMatch: boolean;
  reviewAccepted: boolean;
  conflictStatus: string;
  qualificationRequired: boolean;
  authorizedUse: readonly string[];
  createdAt: string;
}
const CLAIM_EVIDENCE_LINK_FIELDS: readonly (keyof ClaimEvidenceLinkRecord)[] = [
  "claimId", "sourceVersionId", "passageId", "supportStatus", "evidenceRole", "isPrimaryEvidence",
  "jurisdictionMatch", "territorialScopeMatch", "authorityCompetenceMatch", "effectiveDateMatch",
  "reviewAccepted", "conflictStatus", "qualificationRequired", "authorizedUse", "createdAt",
];
const HIGH_RISK_CLAIM_WITHOUT_DIRECT_SUPPORT_ALLOWED = false as const;
const PARTIAL_SUPPORT_TREATED_AS_DIRECT_SUPPORT = false as const;
const CONTRADICTORY_EVIDENCE_LINK_ACCEPTED_SILENTLY = false as const;

export interface AdministrativeProcessRecord {
  processId: ProcessId;
  processGroupId: string;
  title: string;
  market: "DE";
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  riskLevel: "low" | "medium" | "high" | "mixed";
  orientationOnly: true;
  triggerDescription?: string;
  safeFirstStep?: string;
  expectedOutcomes?: readonly string[];
  regionalVariationExpected: boolean;
  crossBorderPreparationRelevant: boolean;
  fullLegalAdviceExcluded: true;
  status: "active" | "unresolved";
  reviewStatus: ReviewStatusLike;
  effectiveFrom?: string;
  effectiveUntil?: string;
}
const ADMINISTRATIVE_PROCESS_FIELDS: readonly (keyof AdministrativeProcessRecord)[] = [
  "processId", "processGroupId", "title", "market", "jurisdictionId", "territorialScopeId",
  "riskLevel", "orientationOnly", "triggerDescription", "safeFirstStep", "expectedOutcomes",
  "regionalVariationExpected", "crossBorderPreparationRelevant", "fullLegalAdviceExcluded",
  "status", "reviewStatus", "effectiveFrom", "effectiveUntil",
];
const PROCESS_STORED_AS_ONE_UNSTRUCTURED_ARTICLE = false as const;

export interface ProcessStepRecord {
  processStepId: ProcessStepId;
  processId: ProcessId;
  stepOrder: number;
  stepType: string;
  title: string;
  descriptionCanonical?: string;
  responsibleActorRuleId: ResponsibleActorRuleId;
  authorityId?: AuthorityId;
  formId?: FormId;
  deadlineRuleId?: DeadlineRuleId;
  feeRuleId?: FeeRuleId;
  requiredEvidenceIds?: readonly EvidenceRequirementId[];
  entryConditions?: readonly string[];
  exitConditions?: readonly string[];
  allowedOutputUses: readonly string[];
  blockedOutputUses: readonly string[];
  regionalVariationExpected: boolean;
  optional: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
}
const PROCESS_STEP_FIELDS: readonly (keyof ProcessStepRecord)[] = [
  "processStepId", "processId", "stepOrder", "stepType", "title", "descriptionCanonical",
  "responsibleActorRuleId", "authorityId", "formId", "deadlineRuleId", "feeRuleId",
  "requiredEvidenceIds", "entryConditions", "exitConditions", "allowedOutputUses", "blockedOutputUses",
  "regionalVariationExpected", "optional", "effectiveFrom", "effectiveUntil", "reviewStatus",
];

export interface ProcessClaimLinkRecord {
  processId: ProcessId;
  processStepId?: ProcessStepId;
  claimId: ClaimId;
  claimRole: string;
  required: boolean;
  sequenceContext?: string;
  qualificationRequired: boolean;
  createdAt: string;
}
const PROCESS_CLAIM_LINK_FIELDS: readonly (keyof ProcessClaimLinkRecord)[] = [
  "processId", "processStepId", "claimId", "claimRole", "required", "sequenceContext",
  "qualificationRequired", "createdAt",
];

export interface FormRecord {
  formId: FormId;
  formName: string;
  formIdentifier?: string;
  authorityId: AuthorityId;
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  sourceVersionId: SourceVersionId;
  instructionsPassageId?: PassageId;
  purpose: string;
  submissionChannels: readonly string[];
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
  status: "active" | "superseded" | "unresolved";
}
const FORM_FIELDS: readonly (keyof FormRecord)[] = [
  "formId", "formName", "formIdentifier", "authorityId", "jurisdictionId", "territorialScopeId",
  "sourceVersionId", "instructionsPassageId", "purpose", "submissionChannels", "effectiveFrom",
  "effectiveUntil", "reviewStatus", "status",
];
const FORM_ALONE_PROVES_ELIGIBILITY_OR_ENTITLEMENT = false as const;

export interface FormRequirementRecord {
  formId: FormId;
  fieldName: string;
  fieldType: string;
  requiredStatus: "required" | "conditional" | "optional";
  condition?: string;
  evidenceRequirementId?: EvidenceRequirementId;
  sourcePassageId: PassageId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
}
const FORM_REQUIREMENT_FIELDS: readonly (keyof FormRequirementRecord)[] = [
  "formId", "fieldName", "fieldType", "requiredStatus", "condition", "evidenceRequirementId",
  "sourcePassageId", "effectiveFrom", "effectiveUntil", "reviewStatus",
];

export interface EvidenceRequirementRecord {
  evidenceRequirementId: EvidenceRequirementId;
  name: string;
  category: string;
  descriptionCanonical?: string;
  requiredByProcessId?: ProcessId;
  requiredByStepId?: ProcessStepId;
  responsibleActorRuleId: ResponsibleActorRuleId;
  authorityRequestsDirectly: boolean;
  institutionExchangeExpected: boolean;
  userSubmissionExpected: boolean;
  sourceVersionId?: SourceVersionId;
  passageId?: PassageId;
  jurisdictionId?: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
}
const EVIDENCE_REQUIREMENT_FIELDS: readonly (keyof EvidenceRequirementRecord)[] = [
  "evidenceRequirementId", "name", "category", "descriptionCanonical", "requiredByProcessId",
  "requiredByStepId", "responsibleActorRuleId", "authorityRequestsDirectly", "institutionExchangeExpected",
  "userSubmissionExpected", "sourceVersionId", "passageId", "jurisdictionId", "territorialScopeId",
  "effectiveFrom", "effectiveUntil", "reviewStatus",
];
const EVIDENCE_REQUIREMENT_ASSUMES_USER_ALWAYS_ACTS = false as const;

export interface DeadlineRuleRecord {
  deadlineRuleId: DeadlineRuleId;
  deadlineType: string;
  triggerEventType: string;
  triggerDateSource: string;
  durationValue?: number;
  durationUnit?: string;
  calendarRule?: string;
  businessDayRule?: string;
  serviceRule?: string;
  timezoneRule?: string;
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  authorityId?: AuthorityId;
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  exactCalculationAllowed: boolean;
  requiredDatePrecision: string;
  riskLevel: "low" | "medium" | "high" | "mixed";
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
}
const DEADLINE_RULE_FIELDS: readonly (keyof DeadlineRuleRecord)[] = [
  "deadlineRuleId", "deadlineType", "triggerEventType", "triggerDateSource", "durationValue",
  "durationUnit", "calendarRule", "businessDayRule", "serviceRule", "timezoneRule", "jurisdictionId",
  "territorialScopeId", "authorityId", "sourceVersionId", "passageId", "effectiveFrom", "effectiveUntil",
  "exactCalculationAllowed", "requiredDatePrecision", "riskLevel", "reviewStatus", "conflictStatus",
];
const DEADLINE_EXACT_CALCULATION_ALWAYS_ALLOWED = false as const;

export interface FeeRuleRecord {
  feeRuleId: FeeRuleId;
  feeStatus: "no_fee_expected" | "fee_possible" | "local_fee_possible" | "fee_stated_in_source" | "fee_stated_in_document" | "fee_unknown" | "fee_conflict" | "fee_requires_verification";
  amount?: number;
  currency?: string;
  amountType?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  condition?: string;
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  authorityId?: AuthorityId;
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
}
const FEE_RULE_FIELDS: readonly (keyof FeeRuleRecord)[] = [
  "feeRuleId", "feeStatus", "amount", "currency", "amountType", "minimumAmount", "maximumAmount",
  "condition", "jurisdictionId", "territorialScopeId", "authorityId", "sourceVersionId", "passageId",
  "effectiveFrom", "effectiveUntil", "reviewStatus", "conflictStatus",
];
const FEE_INFERRED_FROM_STALE_OR_UNRELATED_SOURCE = false as const;

export interface EligibilityRuleRecord {
  eligibilityRuleId: EligibilityRuleId;
  processId: ProcessId;
  conditionExpression?: string;
  requiredFacts: readonly string[];
  jurisdictionId: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  riskLevel: "low" | "medium" | "high" | "mixed";
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
  finalDeterminationAllowed: false;
}
const ELIGIBILITY_RULE_FIELDS: readonly (keyof EligibilityRuleRecord)[] = [
  "eligibilityRuleId", "processId", "conditionExpression", "requiredFacts", "jurisdictionId",
  "territorialScopeId", "sourceVersionId", "passageId", "effectiveFrom", "effectiveUntil",
  "riskLevel", "reviewStatus", "conflictStatus", "finalDeterminationAllowed",
];

export interface RegionalOverrideRecord {
  overrideId: OverrideId;
  baseRuleEntityType: string;
  baseRuleEntityId: string;
  overrideRuleEntityType: string;
  overrideRuleEntityId: string;
  overrideType: string;
  territorialScopeId: TerritorialScopeId;
  authorityId?: AuthorityId;
  sourceVersionId: SourceVersionId;
  passageId?: PassageId;
  priorityContext?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
  substantiveLawChanged: boolean;
}
const REGIONAL_OVERRIDE_FIELDS: readonly (keyof RegionalOverrideRecord)[] = [
  "overrideId", "baseRuleEntityType", "baseRuleEntityId", "overrideRuleEntityType", "overrideRuleEntityId",
  "overrideType", "territorialScopeId", "authorityId", "sourceVersionId", "passageId", "priorityContext",
  "effectiveFrom", "effectiveUntil", "reviewStatus", "conflictStatus", "substantiveLawChanged",
];
const EVERY_OVERRIDE_ASSUMED_SUBSTANTIVE = false as const;

export interface ReviewRecord {
  reviewRecordId: ReviewRecordId;
  entityType: string;
  entityId: string;
  reviewStatus: ReviewStatusLike;
  reviewLevel: string;
  reviewerType: string;
  reviewedAt: string;
  reviewDueAt?: string;
  reason?: string;
  notes?: string;
  sourceChangeDetected: boolean;
  highRiskUseApproved: boolean;
  supersedesReviewRecordId?: ReviewRecordId;
}
const REVIEW_RECORD_FIELDS: readonly (keyof ReviewRecord)[] = [
  "reviewRecordId", "entityType", "entityId", "reviewStatus", "reviewLevel", "reviewerType",
  "reviewedAt", "reviewDueAt", "reason", "notes", "sourceChangeDetected", "highRiskUseApproved",
  "supersedesReviewRecordId",
];
const REVIEW_HISTORY_APPEND_ONLY_NOT_OVERWRITE = true as const;

export interface FreshnessRecord {
  freshnessRecordId: FreshnessRecordId;
  entityType: string;
  entityId: string;
  freshnessStatus: string;
  checkedAt: string;
  nextCheckDueAt?: string;
  sourceAvailable: boolean;
  contentHashMatches: boolean;
  changeStatus: string;
  effectiveDateKnown: boolean;
  reviewRequired: boolean;
  notes?: string;
}
const FRESHNESS_RECORD_FIELDS: readonly (keyof FreshnessRecord)[] = [
  "freshnessRecordId", "entityType", "entityId", "freshnessStatus", "checkedAt", "nextCheckDueAt",
  "sourceAvailable", "contentHashMatches", "changeStatus", "effectiveDateKnown", "reviewRequired", "notes",
];
const FRESHNESS_MAY_OVERWRITE_EFFECTIVE_DATE = false as const;
const RETRIEVED_AT_MAY_BE_USED_AS_EFFECTIVE_FROM = false as const;

export interface KnowledgeConflictRecord {
  conflictId: ConflictId;
  conflictType: string;
  entityIds: readonly string[];
  sourceVersionIds?: readonly SourceVersionId[];
  passageIds?: readonly PassageId[];
  jurisdictionIds?: readonly JurisdictionId[];
  authorityIds?: readonly AuthorityId[];
  detectedAt: string;
  status: "open" | "resolved" | "blocked";
  severity: string;
  blocksHighRiskUse: boolean;
  resolution?: string;
  resolvedAt?: string;
  reviewRecordId?: ReviewRecordId;
}
const KNOWLEDGE_CONFLICT_FIELDS: readonly (keyof KnowledgeConflictRecord)[] = [
  "conflictId", "conflictType", "entityIds", "sourceVersionIds", "passageIds", "jurisdictionIds",
  "authorityIds", "detectedAt", "status", "severity", "blocksHighRiskUse", "resolution",
  "resolvedAt", "reviewRecordId",
];
const CONFLICT_MAY_BE_STORED_ONLY_IN_FREE_TEXT_NOTES = false as const;
const CONFLICT_MAY_BE_DELETED_BEFORE_RESOLUTION = false as const;
const HIGH_RISK_USE_ALLOWED_WITH_UNRESOLVED_CONFLICT = false as const;

export interface CitationRecord {
  citationId: CitationId;
  claimId: ClaimId;
  sourceId: SourceId;
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  publisherId: PublisherId;
  jurisdictionId: JurisdictionId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  lastVerifiedAt?: string;
  userFacingLabel: string;
  internalAuditLabel: string;
  originalLanguage: SourceLanguageCode;
  canonicalUrl?: string;
  createdAt: string;
}
const CITATION_FIELDS: readonly (keyof CitationRecord)[] = [
  "citationId", "claimId", "sourceId", "sourceVersionId", "passageId", "publisherId", "jurisdictionId",
  "effectiveFrom", "effectiveUntil", "lastVerifiedAt", "userFacingLabel", "internalAuditLabel",
  "originalLanguage", "canonicalUrl", "createdAt",
];
const CITATION_MAY_POINT_ONLY_TO_TRANSLATION = false as const;

export interface TerminologyEntryRecord {
  terminologyEntryId: TerminologyEntryId;
  canonicalGermanTerm: string;
  definitionCanonical: string;
  jurisdictionId?: JurisdictionId;
  processGroupIds?: readonly string[];
  sourceVersionId: SourceVersionId;
  passageId: PassageId;
  riskLevel: "low" | "medium" | "high" | "mixed";
  reviewStatus: ReviewStatusLike;
  effectiveFrom?: string;
  effectiveUntil?: string;
}
const TERMINOLOGY_ENTRY_FIELDS: readonly (keyof TerminologyEntryRecord)[] = [
  "terminologyEntryId", "canonicalGermanTerm", "definitionCanonical", "jurisdictionId", "processGroupIds",
  "sourceVersionId", "passageId", "riskLevel", "reviewStatus", "effectiveFrom", "effectiveUntil",
];
const GERMAN_OFFICIAL_TERM_MAY_BE_REMOVED_FROM_LOCALIZATION = false as const;

export interface LocalizedTerminologyRecord {
  terminologyEntryId: TerminologyEntryId;
  outputLocale: (typeof LAUNCH_LOCALES)[number];
  localizedTerm: string;
  localizedExplanation: string;
  translationStatus: string;
  reviewStatus: ReviewStatusLike;
  reviewedBy?: string;
  officialGermanTermRetained: true;
  warningsEquivalent: boolean;
  urgencyEquivalent: boolean;
  uncertaintyEquivalent: boolean;
  blockedActionsEquivalent: boolean;
}
const LOCALIZED_TERMINOLOGY_FIELDS: readonly (keyof LocalizedTerminologyRecord)[] = [
  "terminologyEntryId", "outputLocale", "localizedTerm", "localizedExplanation", "translationStatus",
  "reviewStatus", "reviewedBy", "officialGermanTermRetained", "warningsEquivalent", "urgencyEquivalent",
  "uncertaintyEquivalent", "blockedActionsEquivalent",
];
const LOCALIZATION_MAY_DUPLICATE_UNDERLYING_LEGAL_CLAIM = false as const;
const LOCALIZATION_MAY_ONLY_SUPPORT_ONE_LANGUAGE = false as const;

export interface TrustDomainRecord {
  trustDomainId: TrustDomainId;
  code: "eu" | "de" | "sk" | "cz" | "pl" | "hu";
  name: string;
  activeFrom?: string;
  activeUntil?: string;
  reviewStatus: ReviewStatusLike;
}
const TRUST_DOMAIN_FIELDS: readonly (keyof TrustDomainRecord)[] = [
  "trustDomainId", "code", "name", "activeFrom", "activeUntil", "reviewStatus",
];
export interface TrustDomainLinkRecord {
  entityType: string;
  entityId: string;
  trustDomainId: TrustDomainId;
  required: boolean;
  createdAt: string;
}
const TRUST_DOMAIN_LINK_FIELDS: readonly (keyof TrustDomainLinkRecord)[] = [
  "entityType", "entityId", "trustDomainId", "required", "createdAt",
];
const TRUST_DOMAIN_MAY_BE_INFERRED_FROM_OUTPUT_LOCALE = false as const;

export interface CrossBorderConnectorRecord {
  crossBorderConnectorId: CrossBorderConnectorId;
  originMarket: "DE";
  connectedCountry: string;
  trustDomainIds: readonly TrustDomainId[];
  status: "planned" | "prepared" | "active";
  activationRequiresVerifiedCaseContext: true;
  activationFromLocaleAllowed: false;
  reviewStatus: ReviewStatusLike;
  effectiveFrom?: string;
  effectiveUntil?: string;
}
const CROSS_BORDER_CONNECTOR_FIELDS: readonly (keyof CrossBorderConnectorRecord)[] = [
  "crossBorderConnectorId", "originMarket", "connectedCountry", "trustDomainIds", "status",
  "activationRequiresVerifiedCaseContext", "activationFromLocaleAllowed", "reviewStatus",
  "effectiveFrom", "effectiveUntil",
];

export interface CrossBorderProcessRecord {
  crossBorderProcessId: CrossBorderProcessId;
  crossBorderConnectorId: CrossBorderConnectorId;
  germanProcessId: ProcessId;
  foreignProcessReference?: string;
  euCoordinationClaimIds: readonly ClaimId[];
  germanClaimIds: readonly ClaimId[];
  foreignClaimIds: readonly ClaimId[];
  responsibleActorRuleId: ResponsibleActorRuleId;
  authorityResolutionStatus: string;
  evidenceCompletenessStatus: string;
  temporalAlignmentStatus: string;
  conflictStatus: string;
  allowedOutputUses: readonly string[];
  blockedOutputUses: readonly string[];
  reviewStatus: ReviewStatusLike;
}
const CROSS_BORDER_PROCESS_FIELDS: readonly (keyof CrossBorderProcessRecord)[] = [
  "crossBorderProcessId", "crossBorderConnectorId", "germanProcessId", "foreignProcessReference",
  "euCoordinationClaimIds", "germanClaimIds", "foreignClaimIds", "responsibleActorRuleId",
  "authorityResolutionStatus", "evidenceCompletenessStatus", "temporalAlignmentStatus", "conflictStatus",
  "allowedOutputUses", "blockedOutputUses", "reviewStatus",
];

export interface ResponsibleActorRuleRecord {
  responsibleActorRuleId: ResponsibleActorRuleId;
  actorState: string;
  userMustAct: boolean;
  germanAuthorityMustAct: boolean;
  foreignAuthorityMustAct: boolean;
  institutionExchangeExpected: boolean;
  professionalConfirmationRequired: boolean;
  supportingClaimIds: readonly ClaimId[];
  supportingPassageIds: readonly PassageId[];
  jurisdictionId?: JurisdictionId;
  territorialScopeId?: TerritorialScopeId;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewStatus: ReviewStatusLike;
  conflictStatus: string;
  concreteInstructionAllowed: boolean;
}
const RESPONSIBLE_ACTOR_RULE_FIELDS: readonly (keyof ResponsibleActorRuleRecord)[] = [
  "responsibleActorRuleId", "actorState", "userMustAct", "germanAuthorityMustAct", "foreignAuthorityMustAct",
  "institutionExchangeExpected", "professionalConfirmationRequired", "supportingClaimIds", "supportingPassageIds",
  "jurisdictionId", "territorialScopeId", "effectiveFrom", "effectiveUntil", "reviewStatus",
  "conflictStatus", "concreteInstructionAllowed",
];
const CONCRETE_INSTRUCTION_ALLOWED_WITH_UNRESOLVED_ACTOR = false as const;

export interface RetrievalMetadataRecord {
  entityType: string;
  entityId: string;
  fullTextIndexed: boolean;
  vectorIndexed: boolean;
  embeddingModel?: string;
  embeddingVersion?: string;
  indexedAt?: string;
  jurisdictionFilterRequired: true;
  effectiveDateFilterRequired: true;
  reviewStatusFilterRequired: true;
  trustDomainFilterRequired: true;
  authoritativeByVectorSimilarity: false;
}
const RETRIEVAL_METADATA_FIELDS: readonly (keyof RetrievalMetadataRecord)[] = [
  "entityType", "entityId", "fullTextIndexed", "vectorIndexed", "embeddingModel", "embeddingVersion",
  "indexedAt", "jurisdictionFilterRequired", "effectiveDateFilterRequired", "reviewStatusFilterRequired",
  "trustDomainFilterRequired", "authoritativeByVectorSimilarity",
];

export interface KnowledgeAuditEventRecord {
  auditEventId: AuditEventId;
  eventType: string;
  entityType: string;
  entityId: string;
  occurredAt: string;
  actorType: string;
  previousStateHash?: string;
  newStateHash: string;
  reason?: string;
  sourceCommit?: string;
  reviewRecordId?: ReviewRecordId;
  userContentIncluded: false;
}
const AUDIT_EVENT_FIELDS: readonly (keyof KnowledgeAuditEventRecord)[] = [
  "auditEventId", "eventType", "entityType", "entityId", "occurredAt", "actorType",
  "previousStateHash", "newStateHash", "reason", "sourceCommit", "reviewRecordId", "userContentIncluded",
];

// ============================================================================
// SCHEMA FIELD-COUNT REGISTRY (used to detect shrinkage tamper attempts)
// ============================================================================

const SCHEMA_FIELD_COUNTS: Readonly<Record<string, number>> = {
  sourceRegistry: SOURCE_REGISTRY_FIELDS.length,
  sourceVersion: SOURCE_VERSION_FIELDS.length,
  sourcePassage: SOURCE_PASSAGE_FIELDS.length,
  publisher: PUBLISHER_FIELDS.length,
  jurisdiction: JURISDICTION_FIELDS.length,
  territorialScope: TERRITORIAL_SCOPE_FIELDS.length,
  authority: AUTHORITY_FIELDS.length,
  authorityCompetence: AUTHORITY_COMPETENCE_FIELDS.length,
  claim: CLAIM_FIELDS.length,
  claimEvidenceLink: CLAIM_EVIDENCE_LINK_FIELDS.length,
  administrativeProcess: ADMINISTRATIVE_PROCESS_FIELDS.length,
  processStep: PROCESS_STEP_FIELDS.length,
  processClaimLink: PROCESS_CLAIM_LINK_FIELDS.length,
  form: FORM_FIELDS.length,
  formRequirement: FORM_REQUIREMENT_FIELDS.length,
  evidenceRequirement: EVIDENCE_REQUIREMENT_FIELDS.length,
  deadlineRule: DEADLINE_RULE_FIELDS.length,
  feeRule: FEE_RULE_FIELDS.length,
  eligibilityRule: ELIGIBILITY_RULE_FIELDS.length,
  regionalOverride: REGIONAL_OVERRIDE_FIELDS.length,
  reviewRecord: REVIEW_RECORD_FIELDS.length,
  freshnessRecord: FRESHNESS_RECORD_FIELDS.length,
  knowledgeConflict: KNOWLEDGE_CONFLICT_FIELDS.length,
  citation: CITATION_FIELDS.length,
  terminologyEntry: TERMINOLOGY_ENTRY_FIELDS.length,
  localizedTerminology: LOCALIZED_TERMINOLOGY_FIELDS.length,
  trustDomain: TRUST_DOMAIN_FIELDS.length,
  trustDomainLink: TRUST_DOMAIN_LINK_FIELDS.length,
  crossBorderConnector: CROSS_BORDER_CONNECTOR_FIELDS.length,
  crossBorderProcess: CROSS_BORDER_PROCESS_FIELDS.length,
  responsibleActorRule: RESPONSIBLE_ACTOR_RULE_FIELDS.length,
  retrievalMetadata: RETRIEVAL_METADATA_FIELDS.length,
  auditEvent: AUDIT_EVENT_FIELDS.length,
};
const MIN_EXPECTED_SCHEMA_FIELD_COUNTS: Readonly<Record<string, number>> = {
  sourceRegistry: 18, sourceVersion: 23, sourcePassage: 16, publisher: 12, jurisdiction: 9,
  territorialScope: 16, authority: 14, authorityCompetence: 21, claim: 22, claimEvidenceLink: 15,
  administrativeProcess: 18, processStep: 21, processClaimLink: 8, form: 14, formRequirement: 10,
  evidenceRequirement: 17, deadlineRule: 22, feeRule: 17, eligibilityRule: 14, regionalOverride: 16,
  reviewRecord: 13, freshnessRecord: 12, knowledgeConflict: 14, citation: 15, terminologyEntry: 11,
  localizedTerminology: 12, trustDomain: 6, trustDomainLink: 5, crossBorderConnector: 10,
  crossBorderProcess: 15, responsibleActorRule: 16, retrievalMetadata: 12, auditEvent: 12,
};

// ============================================================================
// RELATIONSHIP / CARDINALITY / UNIQUENESS / INDEXING / LIFECYCLE CONTRACTS
// ============================================================================

const RELATIONSHIP_CARDINALITY_RULES: readonly string[] = [
  "one source -> many source versions", "one source version -> many passages",
  "one claim -> many evidence links", "one passage -> many claim evidence links",
  "one process -> many process steps", "one process step -> many claims",
  "one authority -> many competence records", "one competence record -> one effective period",
  "one base rule -> many regional overrides", "one entity -> many review records",
  "one entity -> many freshness records", "one claim -> many citations",
  "one terminology entry -> many localized terminology records",
  "one connector -> many cross-border processes",
  "one process step -> one or more possible responsible-actor rules over time",
];
const INAPPROPRIATE_ONE_TO_ONE_SHORTCUTS_ALLOWED = false as const;

const UNIQUENESS_CONTRACT_RULES: readonly string[] = [
  "source canonical identity unique within publisher and publication identifier",
  "sourceVersion unique by sourceId + versionSequence",
  "sourceVersion contentHash unique per source where appropriate",
  "passage unique by sourceVersionId + passageOrder",
  "claim evidence link unique by claimId + passageId + evidenceRole",
  "authority competence unique by authorityId + subjectMatter + scope + effective period",
  "localized terminology unique by terminologyEntryId + outputLocale + effective period",
  "review records append-only, not unique-current overwrite",
  "citations stable for one claim/sourceVersion/passage relationship",
];
const UNIQUENESS_RULES_OVERCLAIMED_AS_FINAL_DB_CONSTRAINTS = false as const;

const INDEXING_RECOMMENDATIONS: readonly string[] = [
  "sourceId", "sourceVersionId", "contentHash", "effectiveFrom/effectiveUntil", "jurisdictionId",
  "territorialScopeId", "authorityId", "processGroupId", "claimType", "riskLevel", "reviewStatus",
  "freshnessStatus", "conflictStatus", "trustDomainId", "outputLocale", "full-text passage text",
  "optional vector metadata",
];
const INDEXING_RECOMMENDATIONS_ARE_ACTUAL_INDEXES = false as const;

type LifecycleRule =
  | "source_created" | "version_ingested" | "passage_extracted" | "review_pending" | "review_accepted"
  | "source_changed" | "changed_pending_review" | "superseded" | "expired" | "archived"
  | "conflict_detected" | "conflict_resolved";
const LIFECYCLE_RULES: readonly LifecycleRule[] = [
  "source_created", "version_ingested", "passage_extracted", "review_pending", "review_accepted",
  "source_changed", "changed_pending_review", "superseded", "expired", "archived",
  "conflict_detected", "conflict_resolved",
];
const DELETION_OF_LEGAL_HISTORY_IS_NORMAL_LIFECYCLE = false as const;
const SOURCE_CHANGE_TRUSTED_SILENTLY_WITHOUT_REVIEW = false as const;

const NORMALIZATION_BOUNDARY_PROHIBITIONS: readonly string[] = [
  "one giant source JSON containing all version history",
  "one process article containing all claims and steps",
  "citation text copied without source-version identity",
  "localized legal truth duplicated per language",
  "mutable \"current law\" row overwriting history",
  "authority competence embedded only as free text",
  "effective dates embedded only in prose",
  "conflict state embedded only in notes",
  "model output inserted as legal claim without authorized evidence",
];
const MODEL_OUTPUT_MAY_BECOME_AUTHORITATIVE_SOURCE_CONTENT = false as const;

// ============================================================================
// PUBLIC KNOWLEDGE VS USER DATA BOUNDARY
// ============================================================================

const PUBLIC_KNOWLEDGE_DATA_CATEGORIES: readonly string[] = [
  "official sources", "source versions", "public passages", "claims", "authorities",
  "processes", "rules", "citations", "review and freshness metadata",
];
const USER_DATA_CATEGORIES: readonly string[] = [
  "Smart Talk input", "document text", "OCR images", "personal data", "DNA profile",
  "user history", "payment data",
];
const USER_CONTENT_FOREIGN_KEY_REQUIRED_FOR_PUBLIC_SCHEMA = false as const;
const USER_CONTENT_WRITTEN_MERELY_BECAUSE_RETRIEVAL_OCCURS = false as const;

// ============================================================================
// MINIMALITY CLASSIFICATION
// ============================================================================

type MinimalityClass = "required_for_first_de_pack" | "required_for_later_de_sk_connector" | "optional_future_optimization";
const MINIMALITY_CLASSIFICATION: Readonly<Record<LogicalStorageLayer, MinimalityClass>> = {
  source_registry: "required_for_first_de_pack",
  source_versions: "required_for_first_de_pack",
  source_passages: "required_for_first_de_pack",
  publishers: "required_for_first_de_pack",
  jurisdictions: "required_for_first_de_pack",
  territorial_scopes: "required_for_first_de_pack",
  authorities: "required_for_first_de_pack",
  authority_competences: "required_for_first_de_pack",
  claims: "required_for_first_de_pack",
  claim_evidence_links: "required_for_first_de_pack",
  administrative_processes: "required_for_first_de_pack",
  process_steps: "required_for_first_de_pack",
  process_claim_links: "required_for_first_de_pack",
  forms: "required_for_first_de_pack",
  form_requirements: "required_for_first_de_pack",
  evidence_requirements: "required_for_first_de_pack",
  deadline_rules: "required_for_first_de_pack",
  fee_rules: "required_for_first_de_pack",
  eligibility_rules: "required_for_first_de_pack",
  regional_overrides: "required_for_first_de_pack",
  review_records: "required_for_first_de_pack",
  freshness_records: "required_for_first_de_pack",
  knowledge_conflicts: "required_for_first_de_pack",
  citations: "required_for_first_de_pack",
  terminology_entries: "required_for_first_de_pack",
  localized_terminology: "required_for_first_de_pack",
  trust_domain_links: "required_for_later_de_sk_connector",
  cross_border_connectors: "required_for_later_de_sk_connector",
  cross_border_processes: "required_for_later_de_sk_connector",
  responsible_actor_rules: "required_for_first_de_pack",
  retrieval_metadata: "optional_future_optimization",
  audit_events: "required_for_first_de_pack",
};
const MINIMALITY_EXCLUDES: readonly string[] = [
  "no premature implementation-specific complexity", "no unnecessary user-profile tables",
  "no payment tables", "no runtime conversation tables", "no duplicated legal truth per locale",
  "no production migration yet",
];

// ============================================================================
// SCHEMA IMPLEMENTATION READINESS
// ============================================================================

type SchemaImplementationReadiness =
  | "design_only" | "ready_for_migration_plan" | "blocked_missing_contract" | "blocked_normalization_issue"
  | "blocked_user_data_boundary_issue" | "blocked_history_loss_risk" | "blocked_citation_gap" | "blocked_cross_border_gap";
const SCHEMA_IMPLEMENTATION_READINESS_STATES: readonly SchemaImplementationReadiness[] = [
  "design_only", "ready_for_migration_plan", "blocked_missing_contract", "blocked_normalization_issue",
  "blocked_user_data_boundary_issue", "blocked_history_loss_risk", "blocked_citation_gap", "blocked_cross_border_gap",
];

// ============================================================================
// DE<->SK REPRESENTABILITY (support only — no implementation)
// ============================================================================

const DE_SK_SUPPORTED_ELEMENTS: readonly string[] = [
  "DE<->SK connector", "EU trust-domain evidence", "German Familienkasse evidence",
  "Slovak competent-source evidence", "responsible actor", "authority competence",
  "temporal alignment", "evidence completeness", "per-domain citations",
];
const DE_SK_FIRST_PILOT_TOPIC = "familienkasse_kindergeld" as const;
const DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE = false as const;
const DE_SK_ACTIVATED_FROM_SLOVAK_LOCALE_THIS_PHASE = false as const;

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9E";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceTrustContractCheckId: string;
  sourceJurisdictionModelCheckId: string;
  sourceCoveragePlanCheckId: string;
  sourceArchitectureReady: boolean;
  sourceTrustContractReady: boolean;
  sourceJurisdictionModelReady: boolean;
  sourceCoveragePlanReady: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  databaseMigrationCreated: boolean;
  sqlFileCreated: boolean;
  databaseTableCreated: boolean;
  databaseWritePerformed: boolean;
  networkAccessPerformed: boolean;
  externalSourceDownloaded: boolean;
  realSourceRegistered: boolean;
  realSourceVersionCreated: boolean;
  realPassageStored: boolean;
  realClaimPopulated: boolean;
  realAuthorityRegistered: boolean;
  realProcessPopulated: boolean;
  realCrossBorderConnectorImplemented: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  logicalStorageLayersDefined: boolean;
  identifierTypesDefined: boolean;
  sourceRegistrySchemaDefined: boolean;
  sourceVersionSchemaDefined: boolean;
  sourcePassageSchemaDefined: boolean;
  publisherSchemaDefined: boolean;
  jurisdictionSchemaDefined: boolean;
  territorialScopeSchemaDefined: boolean;
  authoritySchemaDefined: boolean;
  authorityCompetenceSchemaDefined: boolean;
  claimSchemaDefined: boolean;
  claimEvidenceLinkSchemaDefined: boolean;
  administrativeProcessSchemaDefined: boolean;
  processStepSchemaDefined: boolean;
  processClaimLinkSchemaDefined: boolean;
  formSchemaDefined: boolean;
  formRequirementSchemaDefined: boolean;
  evidenceRequirementSchemaDefined: boolean;
  deadlineRuleSchemaDefined: boolean;
  feeRuleSchemaDefined: boolean;
  eligibilityRuleSchemaDefined: boolean;
  regionalOverrideSchemaDefined: boolean;
  reviewRecordSchemaDefined: boolean;
  freshnessRecordSchemaDefined: boolean;
  knowledgeConflictSchemaDefined: boolean;
  citationSchemaDefined: boolean;
  terminologySchemaDefined: boolean;
  localizedTerminologySchemaDefined: boolean;
  trustDomainSchemaDefined: boolean;
  crossBorderConnectorSchemaDefined: boolean;
  crossBorderProcessSchemaDefined: boolean;
  responsibleActorRuleSchemaDefined: boolean;
  retrievalMetadataSchemaDefined: boolean;
  auditEventSchemaDefined: boolean;

  publicKnowledgeSeparatedFromUserData: boolean;
  immutableSourceVersionsRequired: boolean;
  historicalVersionsPreserved: boolean;
  passageLevelCitationRequired: boolean;
  claimsSeparatedFromLocalizedPresentation: boolean;
  authorityCompetenceVersioned: boolean;
  effectivePeriodsStructured: boolean;
  regionalOverridesStructured: boolean;
  reviewHistoryAppendOnly: boolean;
  freshnessSeparatedFromEffectiveDate: boolean;
  conflictsPersistUntilResolved: boolean;
  vectorSimilarityNotAuthoritative: boolean;
  modelOutputNotAuthoritativeSource: boolean;
  localeDoesNotActivateTrustDomain: boolean;
  deSkActivationIndependentFromLocale: boolean;
  userContentForeignKeyNotRequired: boolean;
  userContentIncludedInAuditEvents: boolean;

  relationshipCardinalityDefined: boolean;
  uniquenessContractDefined: boolean;
  indexingRecommendationsDefined: boolean;
  lifecycleRulesDefined: boolean;
  normalizationBoundaryDefined: boolean;
  minimalityPrincipleDefined: boolean;
  schemaImplementationReadiness: SchemaImplementationReadiness;

  firstGermanPackRepresentable: boolean;
  eightProcessGroupsRepresentable: boolean;
  sixLaunchLocalesRepresentable: boolean;
  deSkConnectorRepresentable: boolean;
  deSkFirstPilotTopic: string;
  deSkConnectorNotImplemented: boolean;

  zeroTablesCreated: boolean;
  zeroMigrationsCreated: boolean;
  zeroDatabaseRows: boolean;
  zeroRealSources: boolean;
  zeroRealSourceVersions: boolean;
  zeroRealPassages: boolean;
  zeroRealClaims: boolean;
  zeroRealAuthorities: boolean;
  zeroRealProcesses: boolean;
  zeroRealCrossBorderConnectors: boolean;

  standaloneExtractionStillOpen: boolean;
  physicalAndroidStillUntested: boolean;
  genuineIosSafariStillUntested: boolean;
  heicHeifStillOpen: boolean;
  serverlessOcrStillOpen: boolean;
  distributedRateLimiterStillOpen: boolean;
  paymentFlowStillOpen: boolean;
  sixLanguageProductionParityStillOpen: boolean;
  germanKnowledgePopulationStillOpen: boolean;
  deSkImplementationStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForKnowledgeMigrationImplementationPlan: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;
  existingMigrationNamingConventionObserved: boolean;

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  oneGiantKnowledgeTableAccepted: boolean;
  oneGiantJsonDocumentAccepted: boolean;
  sourceTextStoredDirectlyOnMutableRegistryRowAccepted: boolean;
  sourceVersionOverwrittenAccepted: boolean;
  historicalSourceVersionDeletedAccepted: boolean;
  immutableFlagRemovedAccepted: boolean;
  sourceVersionLacksContentHashAccepted: boolean;
  sourceVersionLacksEffectivePeriodAccepted: boolean;
  sourceVersionLacksSourceIdAccepted: boolean;
  passageLacksSourceVersionIdAccepted: boolean;
  passageCitationPointsOnlyToSourceIdAccepted: boolean;
  passageOrderMissingAccepted: boolean;
  passageTextHashMissingAccepted: boolean;
  preciseClaimAcceptedWithoutPassageIdAccepted: boolean;
  publisherOfficialStatusTreatedAsUniversalCompetenceAccepted: boolean;
  publisherCompetenceOmittedAccepted: boolean;
  territorialScopeOmittedAccepted: boolean;
  jurisdictionParentRelationshipOmittedAccepted: boolean;
  localScopeGeneralizedNationallyAccepted: boolean;
  authorityLacksTerritorialScopeAccepted: boolean;
  authorityCompetenceStoredOnlyAsFreeTextAccepted: boolean;
  competenceEffectivePeriodOmittedAccepted: boolean;
  nearbyAuthorityTreatedAsCompetentAccepted: boolean;
  claimLacksRiskLevelAccepted: boolean;
  claimLacksAllowedBlockedUsesAccepted: boolean;
  claimLacksCitationRequirementAccepted: boolean;
  claimDuplicatesLocalizedTruthAccepted: boolean;
  translatedClaimTreatedAsSeparateAuthoritativeLegalTruthAccepted: boolean;
  claimEvidenceLinkOmittedAccepted: boolean;
  highRiskClaimAcceptedWithoutDirectSupportAccepted: boolean;
  partialSupportAcceptedAsDirectSupportAccepted: boolean;
  contradictoryEvidenceLinkAllowedAccepted: boolean;
  processStoredAsOneUnstructuredArticleAccepted: boolean;
  processStepOrderOmittedAccepted: boolean;
  processStepLacksResponsibleActorAccepted: boolean;
  processStepLacksBlockedOutputsAccepted: boolean;
  processClaimRelationshipOmittedAccepted: boolean;
  formProvesEligibilityAutomaticallyAccepted: boolean;
  formProvesFullEntitlementAutomaticallyAccepted: boolean;
  formRequirementsLackSourcePassageAccepted: boolean;
  evidenceRequirementAssumesUserAlwaysActsAccepted: boolean;
  institutionExchangeIgnoredAccepted: boolean;
  deadlineRuleLacksTriggerEventAccepted: boolean;
  deadlineRuleLacksDatePrecisionAccepted: boolean;
  deadlineExactCalculationAlwaysAllowedAccepted: boolean;
  deadlineSourcePassageOmittedAccepted: boolean;
  feeLacksEffectivePeriodAccepted: boolean;
  feeInferredFromOldSourceAccepted: boolean;
  eligibilityFinalDeterminationAllowedAccepted: boolean;
  regionalOverrideLacksBaseRuleAccepted: boolean;
  regionalOverrideLacksScopeAccepted: boolean;
  regionalOverrideAssumedSubstantiveAccepted: boolean;
  reviewRecordOverwritesPriorReviewAccepted: boolean;
  reviewHistoryDeletedAccepted: boolean;
  freshnessOverwritesEffectiveDateAccepted: boolean;
  retrievedAtUsedAsEffectiveFromAccepted: boolean;
  conflictStoredOnlyInNotesAccepted: boolean;
  conflictDeletedBeforeResolutionAccepted: boolean;
  highRiskUseAllowedWithUnresolvedConflictAccepted: boolean;
  citationLacksSourceVersionIdAccepted: boolean;
  citationLacksPassageIdAccepted: boolean;
  citationLacksPublisherAccepted: boolean;
  citationPointsOnlyToTranslationAccepted: boolean;
  germanOfficialTermRemovedAccepted: boolean;
  localizedTerminologyRemovesWarningAccepted: boolean;
  localizedTerminologyChangesUrgencyAccepted: boolean;
  localizedTerminologyIncreasesCertaintyAccepted: boolean;
  localizedTerminologyRemovesBlockedActionAccepted: boolean;
  localeDuplicatesWholeClaimStoreAccepted: boolean;
  slovakLocaleActivatesSkTrustDomainAccepted: boolean;
  englishLocaleDisablesCrossBorderContextAccepted: boolean;
  germanLocaleForcesDeOnlyContextAccepted: boolean;
  crossBorderProcessLacksEuClaimsAccepted: boolean;
  crossBorderProcessLacksGermanClaimsAccepted: boolean;
  crossBorderProcessLacksForeignClaimsAccepted: boolean;
  crossBorderProcessLacksResponsibleActorAccepted: boolean;
  crossBorderProcessLacksTemporalAlignmentAccepted: boolean;
  crossBorderProcessLacksEvidenceCompletenessAccepted: boolean;
  responsibleActorUnresolvedButConcreteInstructionAllowedAccepted: boolean;
  unrestrictedVectorResultAuthorizesClaimAccepted: boolean;
  vectorMetadataOmitsJurisdictionFilterAccepted: boolean;
  vectorMetadataOmitsEffectiveDateFilterAccepted: boolean;
  vectorMetadataOmitsReviewFilterAccepted: boolean;
  auditEventLacksStateHashAccepted: boolean;
  smartTalkInputMixedIntoPublicKnowledgeAccepted: boolean;
  ocrImageStoredAsKnowledgeSourceAccepted: boolean;
  dnaProfileLinkedIntoKnowledgeClaimAccepted: boolean;
  paymentDataAddedToKnowledgeSchemaAccepted: boolean;
  conversationHistoryAddedToKnowledgeSchemaAccepted: boolean;
  oneSourceMappedOneToOneWithVersionAccepted: boolean;
  oneProcessMappedOneToOneWithStepAccepted: boolean;
  oneClaimMappedOneToOneWithCitationAccepted: boolean;
  oneAuthorityMappedOneToOneWithCompetenceAccepted: boolean;
  localizedTerminologyOnlySupportsOneLanguageAccepted: boolean;
  indexingRecommendationsTreatedAsActualIndexesAccepted: boolean;
  historyDeletionUsedAsNormalLifecycleAccepted: boolean;
  sourceChangeSilentlyTrustedAccepted: boolean;
  changedSourceBypassesReviewAccepted: boolean;
  schemaMarkedReadyDespiteCitationGapAccepted: boolean;
  schemaMarkedReadyDespiteHistoryLossRiskAccepted: boolean;
  schemaMarkedReadyDespiteUserDataBoundaryIssueAccepted: boolean;
  schemaMarkedReadyDespiteNormalizationIssueAccepted: boolean;
  schemaMarkedReadyDespiteCrossBorderGapAccepted: boolean;
  migrationMarkedImplementedAccepted: boolean;
  germanKnowledgeClaimedPopulatedAccepted: boolean;
  sixLanguagesClaimedProductionReadyAccepted: boolean;
  localeActivatesConnectorAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  logicalStorageLayers: readonly string[];
  identifierTypeNames: readonly string[];
  coreSchemaPrinciples: readonly string[];
  relationshipCardinalityRules: readonly string[];
  uniquenessContractRules: readonly string[];
  indexingRecommendationsList: readonly string[];
  lifecycleRulesList: readonly LifecycleRule[];
  normalizationBoundaryProhibitions: readonly string[];
  publicKnowledgeDataCategories: readonly string[];
  userDataCategories: readonly string[];
  minimalityExcludes: readonly string[];
  minimalityClassification: Readonly<Record<string, MinimalityClass>>;
  deSkSupportedElements: readonly string[];
  schemaFieldCounts: Readonly<Record<string, number>>;
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
  { id: 4, description: "PHASE 9C missing", mutate: (r) => { r.sourceJurisdictionModelCheckId = "missing"; } },
  { id: 5, description: "PHASE 9D missing", mutate: (r) => { r.sourceCoveragePlanCheckId = "missing"; } },
  { id: 6, description: "source architecture not ready", mutate: (r) => { r.sourceArchitectureReady = false; } },
  { id: 7, description: "trust contract not ready", mutate: (r) => { r.sourceTrustContractReady = false; } },
  { id: 8, description: "jurisdiction model not ready", mutate: (r) => { r.sourceJurisdictionModelReady = false; } },
  { id: 9, description: "coverage plan not ready", mutate: (r) => { r.sourceCoveragePlanReady = false; } },
  { id: 10, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 11, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 12, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 13, description: "SQL file created", mutate: (r) => { r.sqlFileCreated = true; } },
  { id: 14, description: "database migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 15, description: "database table created", mutate: (r) => { r.databaseTableCreated = true; } },
  { id: 16, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 17, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 18, description: "source downloaded", mutate: (r) => { r.externalSourceDownloaded = true; } },
  { id: 19, description: "real source registered", mutate: (r) => { r.realSourceRegistered = true; } },
  { id: 20, description: "real source version created", mutate: (r) => { r.realSourceVersionCreated = true; } },
  { id: 21, description: "real passage stored", mutate: (r) => { r.realPassageStored = true; } },
  { id: 22, description: "real claim populated", mutate: (r) => { r.realClaimPopulated = true; } },
  { id: 23, description: "real authority registered", mutate: (r) => { r.realAuthorityRegistered = true; } },
  { id: 24, description: "real process populated", mutate: (r) => { r.realProcessPopulated = true; } },
  { id: 25, description: "cross-border connector implemented", mutate: (r) => { r.realCrossBorderConnectorImplemented = true; } },
  { id: 26, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 27, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 28, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 29, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 30, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 31, description: "one giant knowledge table accepted", mutate: (r) => { r.oneGiantKnowledgeTableAccepted = true; } },
  { id: 32, description: "one giant JSON document accepted", mutate: (r) => { r.oneGiantJsonDocumentAccepted = true; } },
  { id: 33, description: "source text stored directly on mutable source registry row", mutate: (r) => { r.sourceTextStoredDirectlyOnMutableRegistryRowAccepted = true; } },
  { id: 34, description: "source version overwritten", mutate: (r) => { r.sourceVersionOverwrittenAccepted = true; } },
  { id: 35, description: "historical source version deleted", mutate: (r) => { r.historicalSourceVersionDeletedAccepted = true; } },
  { id: 36, description: "immutable flag removed", mutate: (r) => { r.immutableFlagRemovedAccepted = true; r.immutableSourceVersionsRequired = false; } },
  { id: 37, description: "source version lacks content hash", mutate: (r) => { r.sourceVersionLacksContentHashAccepted = true; } },
  { id: 38, description: "source version lacks effective period", mutate: (r) => { r.sourceVersionLacksEffectivePeriodAccepted = true; } },
  { id: 39, description: "source version lacks sourceId", mutate: (r) => { r.sourceVersionLacksSourceIdAccepted = true; } },
  { id: 40, description: "passage lacks sourceVersionId", mutate: (r) => { r.passageLacksSourceVersionIdAccepted = true; } },
  { id: 41, description: "passage citation points only to sourceId", mutate: (r) => { r.passageCitationPointsOnlyToSourceIdAccepted = true; } },
  { id: 42, description: "passage order missing", mutate: (r) => { r.passageOrderMissingAccepted = true; } },
  { id: 43, description: "passage text hash missing", mutate: (r) => { r.passageTextHashMissingAccepted = true; } },
  { id: 44, description: "precise claim accepted without passageId", mutate: (r) => { r.preciseClaimAcceptedWithoutPassageIdAccepted = true; } },
  { id: 45, description: "publisher official status treated as universal competence", mutate: (r) => { r.publisherOfficialStatusTreatedAsUniversalCompetenceAccepted = true; } },
  { id: 46, description: "publisher competence omitted", mutate: (r) => { r.publisherCompetenceOmittedAccepted = true; } },
  { id: 47, description: "territorial scope omitted", mutate: (r) => { r.territorialScopeOmittedAccepted = true; } },
  { id: 48, description: "jurisdiction parent relationship omitted", mutate: (r) => { r.jurisdictionParentRelationshipOmittedAccepted = true; } },
  { id: 49, description: "local scope generalized nationally", mutate: (r) => { r.localScopeGeneralizedNationallyAccepted = true; } },
  { id: 50, description: "authority lacks territorial scope", mutate: (r) => { r.authorityLacksTerritorialScopeAccepted = true; } },
  { id: 51, description: "authority competence stored only as free text", mutate: (r) => { r.authorityCompetenceStoredOnlyAsFreeTextAccepted = true; } },
  { id: 52, description: "competence effective period omitted", mutate: (r) => { r.competenceEffectivePeriodOmittedAccepted = true; } },
  { id: 53, description: "nearby authority treated as competent", mutate: (r) => { r.nearbyAuthorityTreatedAsCompetentAccepted = true; } },
  { id: 54, description: "claim lacks risk level", mutate: (r) => { r.claimLacksRiskLevelAccepted = true; } },
  { id: 55, description: "claim lacks allowed/blocked uses", mutate: (r) => { r.claimLacksAllowedBlockedUsesAccepted = true; } },
  { id: 56, description: "claim lacks citation requirement", mutate: (r) => { r.claimLacksCitationRequirementAccepted = true; } },
  { id: 57, description: "claim duplicates localized truth", mutate: (r) => { r.claimDuplicatesLocalizedTruthAccepted = true; } },
  { id: 58, description: "translated claim treated as separate authoritative legal truth", mutate: (r) => { r.translatedClaimTreatedAsSeparateAuthoritativeLegalTruthAccepted = true; } },
  { id: 59, description: "claim evidence link omitted", mutate: (r) => { r.claimEvidenceLinkOmittedAccepted = true; } },
  { id: 60, description: "high-risk claim accepted without direct support", mutate: (r) => { r.highRiskClaimAcceptedWithoutDirectSupportAccepted = true; } },
  { id: 61, description: "partial support accepted as direct support", mutate: (r) => { r.partialSupportAcceptedAsDirectSupportAccepted = true; } },
  { id: 62, description: "contradictory evidence link accepted", mutate: (r) => { r.contradictoryEvidenceLinkAllowedAccepted = true; } },
  { id: 63, description: "process stored as one unstructured article", mutate: (r) => { r.processStoredAsOneUnstructuredArticleAccepted = true; } },
  { id: 64, description: "process step order omitted", mutate: (r) => { r.processStepOrderOmittedAccepted = true; } },
  { id: 65, description: "process step lacks responsible actor", mutate: (r) => { r.processStepLacksResponsibleActorAccepted = true; } },
  { id: 66, description: "process step lacks blocked outputs", mutate: (r) => { r.processStepLacksBlockedOutputsAccepted = true; } },
  { id: 67, description: "process claim relationship omitted", mutate: (r) => { r.processClaimRelationshipOmittedAccepted = true; } },
  { id: 68, description: "form proves eligibility automatically", mutate: (r) => { r.formProvesEligibilityAutomaticallyAccepted = true; } },
  { id: 69, description: "form proves full entitlement automatically", mutate: (r) => { r.formProvesFullEntitlementAutomaticallyAccepted = true; } },
  { id: 70, description: "form requirements lack source passage", mutate: (r) => { r.formRequirementsLackSourcePassageAccepted = true; } },
  { id: 71, description: "evidence requirement assumes user always acts", mutate: (r) => { r.evidenceRequirementAssumesUserAlwaysActsAccepted = true; } },
  { id: 72, description: "institution exchange ignored", mutate: (r) => { r.institutionExchangeIgnoredAccepted = true; } },
  { id: 73, description: "deadline rule lacks trigger event", mutate: (r) => { r.deadlineRuleLacksTriggerEventAccepted = true; } },
  { id: 74, description: "deadline rule lacks date precision", mutate: (r) => { r.deadlineRuleLacksDatePrecisionAccepted = true; } },
  { id: 75, description: "deadline exact calculation always allowed", mutate: (r) => { r.deadlineExactCalculationAlwaysAllowedAccepted = true; } },
  { id: 76, description: "deadline source passage omitted", mutate: (r) => { r.deadlineSourcePassageOmittedAccepted = true; } },
  { id: 77, description: "fee lacks effective period", mutate: (r) => { r.feeLacksEffectivePeriodAccepted = true; } },
  { id: 78, description: "fee inferred from old source", mutate: (r) => { r.feeInferredFromOldSourceAccepted = true; } },
  { id: 79, description: "eligibility final determination allowed", mutate: (r) => { r.eligibilityFinalDeterminationAllowedAccepted = true; } },
  { id: 80, description: "regional override lacks base rule", mutate: (r) => { r.regionalOverrideLacksBaseRuleAccepted = true; } },
  { id: 81, description: "regional override lacks scope", mutate: (r) => { r.regionalOverrideLacksScopeAccepted = true; } },
  { id: 82, description: "regional override assumed substantive", mutate: (r) => { r.regionalOverrideAssumedSubstantiveAccepted = true; } },
  { id: 83, description: "review record overwrites prior review", mutate: (r) => { r.reviewRecordOverwritesPriorReviewAccepted = true; } },
  { id: 84, description: "review history deleted", mutate: (r) => { r.reviewHistoryDeletedAccepted = true; r.reviewHistoryAppendOnly = false; } },
  { id: 85, description: "freshness overwrites effective date", mutate: (r) => { r.freshnessOverwritesEffectiveDateAccepted = true; } },
  { id: 86, description: "retrievedAt used as effectiveFrom", mutate: (r) => { r.retrievedAtUsedAsEffectiveFromAccepted = true; } },
  { id: 87, description: "conflict stored only in notes", mutate: (r) => { r.conflictStoredOnlyInNotesAccepted = true; } },
  { id: 88, description: "conflict deleted before resolution", mutate: (r) => { r.conflictDeletedBeforeResolutionAccepted = true; r.conflictsPersistUntilResolved = false; } },
  { id: 89, description: "high-risk use allowed with unresolved conflict", mutate: (r) => { r.highRiskUseAllowedWithUnresolvedConflictAccepted = true; } },
  { id: 90, description: "citation lacks sourceVersionId", mutate: (r) => { r.citationLacksSourceVersionIdAccepted = true; } },
  { id: 91, description: "citation lacks passageId", mutate: (r) => { r.citationLacksPassageIdAccepted = true; r.passageLevelCitationRequired = false; } },
  { id: 92, description: "citation lacks publisher", mutate: (r) => { r.citationLacksPublisherAccepted = true; } },
  { id: 93, description: "citation points only to translation", mutate: (r) => { r.citationPointsOnlyToTranslationAccepted = true; } },
  { id: 94, description: "German official term removed", mutate: (r) => { r.germanOfficialTermRemovedAccepted = true; } },
  { id: 95, description: "localized terminology removes warning", mutate: (r) => { r.localizedTerminologyRemovesWarningAccepted = true; } },
  { id: 96, description: "localized terminology changes urgency", mutate: (r) => { r.localizedTerminologyChangesUrgencyAccepted = true; } },
  { id: 97, description: "localized terminology increases certainty", mutate: (r) => { r.localizedTerminologyIncreasesCertaintyAccepted = true; } },
  { id: 98, description: "localized terminology removes blocked action", mutate: (r) => { r.localizedTerminologyRemovesBlockedActionAccepted = true; } },
  { id: 99, description: "locale duplicates whole claim store", mutate: (r) => { r.localeDuplicatesWholeClaimStoreAccepted = true; } },
  { id: 100, description: "trust domain inferred from locale", mutate: (r) => { r.localeDoesNotActivateTrustDomain = false; } },
  { id: 101, description: "Slovak locale activates SK trust domain", mutate: (r) => { r.slovakLocaleActivatesSkTrustDomainAccepted = true; } },
  { id: 102, description: "English locale disables cross-border context", mutate: (r) => { r.englishLocaleDisablesCrossBorderContextAccepted = true; } },
  { id: 103, description: "German locale forces DE-only context", mutate: (r) => { r.germanLocaleForcesDeOnlyContextAccepted = true; } },
  { id: 104, description: "connector activationFromLocaleAllowed set true", mutate: (r) => { r.deSkActivationIndependentFromLocale = false; } },
  { id: 105, description: "cross-border process lacks EU claims", mutate: (r) => { r.crossBorderProcessLacksEuClaimsAccepted = true; } },
  { id: 106, description: "cross-border process lacks German claims", mutate: (r) => { r.crossBorderProcessLacksGermanClaimsAccepted = true; } },
  { id: 107, description: "cross-border process lacks foreign claims", mutate: (r) => { r.crossBorderProcessLacksForeignClaimsAccepted = true; } },
  { id: 108, description: "cross-border process lacks responsible actor", mutate: (r) => { r.crossBorderProcessLacksResponsibleActorAccepted = true; } },
  { id: 109, description: "cross-border process lacks temporal alignment", mutate: (r) => { r.crossBorderProcessLacksTemporalAlignmentAccepted = true; } },
  { id: 110, description: "cross-border process lacks evidence completeness", mutate: (r) => { r.crossBorderProcessLacksEvidenceCompletenessAccepted = true; } },
  { id: 111, description: "responsible actor unresolved but concrete instruction allowed", mutate: (r) => { r.responsibleActorUnresolvedButConcreteInstructionAllowedAccepted = true; } },
  { id: 112, description: "vector similarity marked authoritative", mutate: (r) => { r.vectorSimilarityNotAuthoritative = false; } },
  { id: 113, description: "unrestricted vector result authorizes claim", mutate: (r) => { r.unrestrictedVectorResultAuthorizesClaimAccepted = true; } },
  { id: 114, description: "vector metadata omits jurisdiction filter", mutate: (r) => { r.vectorMetadataOmitsJurisdictionFilterAccepted = true; } },
  { id: 115, description: "vector metadata omits effective-date filter", mutate: (r) => { r.vectorMetadataOmitsEffectiveDateFilterAccepted = true; } },
  { id: 116, description: "vector metadata omits review filter", mutate: (r) => { r.vectorMetadataOmitsReviewFilterAccepted = true; } },
  { id: 117, description: "audit event contains user content", mutate: (r) => { r.userContentIncludedInAuditEvents = true; } },
  { id: 118, description: "audit event lacks state hash", mutate: (r) => { r.auditEventLacksStateHashAccepted = true; } },
  { id: 119, description: "public knowledge requires user-content foreign key", mutate: (r) => { r.userContentForeignKeyNotRequired = false; } },
  { id: 120, description: "Smart Talk input mixed into public knowledge", mutate: (r) => { r.smartTalkInputMixedIntoPublicKnowledgeAccepted = true; } },
  { id: 121, description: "OCR image stored as knowledge source", mutate: (r) => { r.ocrImageStoredAsKnowledgeSourceAccepted = true; } },
  { id: 122, description: "DNA profile linked into knowledge claim", mutate: (r) => { r.dnaProfileLinkedIntoKnowledgeClaimAccepted = true; } },
  { id: 123, description: "payment data added to knowledge schema", mutate: (r) => { r.paymentDataAddedToKnowledgeSchemaAccepted = true; } },
  { id: 124, description: "conversation history added to knowledge schema", mutate: (r) => { r.conversationHistoryAddedToKnowledgeSchemaAccepted = true; } },
  { id: 125, description: "one source mapped one-to-one with version", mutate: (r) => { r.oneSourceMappedOneToOneWithVersionAccepted = true; } },
  { id: 126, description: "one process mapped one-to-one with step", mutate: (r) => { r.oneProcessMappedOneToOneWithStepAccepted = true; } },
  { id: 127, description: "one claim mapped one-to-one with citation", mutate: (r) => { r.oneClaimMappedOneToOneWithCitationAccepted = true; } },
  { id: 128, description: "one authority mapped one-to-one with competence", mutate: (r) => { r.oneAuthorityMappedOneToOneWithCompetenceAccepted = true; } },
  { id: 129, description: "localized terminology only supports one language", mutate: (r) => { r.localizedTerminologyOnlySupportsOneLanguageAccepted = true; } },
  { id: 130, description: "six launch locales not representable", mutate: (r) => { r.sixLaunchLocalesRepresentable = false; } },
  { id: 131, description: "eight process groups not representable", mutate: (r) => { r.eightProcessGroupsRepresentable = false; } },
  { id: 132, description: "DE<->SK connector not representable", mutate: (r) => { r.deSkConnectorRepresentable = false; } },
  { id: 133, description: "first pilot topic changed silently", mutate: (r) => { r.deSkFirstPilotTopic = "jobcenter_buergergeld"; } },
  { id: 134, description: "DE<->SK connector marked implemented", mutate: (r) => { r.deSkConnectorNotImplemented = false; } },
  { id: 135, description: "real data claimed populated", mutate: (r) => { r.zeroRealSources = false; r.realSourceRegistered = true; } },
  { id: 136, description: "uniqueness contract omitted", mutate: (r) => { r.uniquenessContractDefined = false; } },
  { id: 137, description: "indexing recommendations treated as actual indexes", mutate: (r) => { r.indexingRecommendationsTreatedAsActualIndexesAccepted = true; } },
  { id: 138, description: "lifecycle rules omitted", mutate: (r) => { r.lifecycleRulesDefined = false; } },
  { id: 139, description: "history deletion used as normal lifecycle", mutate: (r) => { r.historyDeletionUsedAsNormalLifecycleAccepted = true; } },
  { id: 140, description: "source change silently trusted", mutate: (r) => { r.sourceChangeSilentlyTrustedAccepted = true; } },
  { id: 141, description: "changed source bypasses review", mutate: (r) => { r.changedSourceBypassesReviewAccepted = true; } },
  { id: 142, description: "schema marked ready despite citation gap", mutate: (r) => { r.schemaMarkedReadyDespiteCitationGapAccepted = true; } },
  { id: 143, description: "schema marked ready despite history-loss risk", mutate: (r) => { r.schemaMarkedReadyDespiteHistoryLossRiskAccepted = true; } },
  { id: 144, description: "schema marked ready despite user-data boundary issue", mutate: (r) => { r.schemaMarkedReadyDespiteUserDataBoundaryIssueAccepted = true; } },
  { id: 145, description: "schema marked ready despite normalization issue", mutate: (r) => { r.schemaMarkedReadyDespiteNormalizationIssueAccepted = true; } },
  { id: 146, description: "schema marked ready despite cross-border gap", mutate: (r) => { r.schemaMarkedReadyDespiteCrossBorderGapAccepted = true; } },
  { id: 147, description: "migration marked implemented", mutate: (r) => { r.migrationMarkedImplementedAccepted = true; } },
  { id: 148, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 149, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 150, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 151, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 152, description: "German database claimed populated", mutate: (r) => { r.germanKnowledgeClaimedPopulatedAccepted = true; r.germanKnowledgePopulationStillOpen = false; } },
  { id: 153, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguagesClaimedProductionReadyAccepted = true; r.sixLanguageProductionParityStillOpen = false; } },
  { id: 154, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 155, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 156, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 157, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 158, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 159, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 160, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 161, description: "audit passes with unexpected changed file", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 162, description: "audit passes if any SQL file exists", mutate: (r) => { r.sqlFileCreated = true; } },
  { id: 163, description: "audit passes if any database mutation occurred", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 164, description: "audit passes if any real row exists", mutate: (r) => { r.zeroDatabaseRows = false; } },
  { id: 165, description: "audit passes if history can be overwritten", mutate: (r) => { r.historicalVersionsPreserved = false; } },
  { id: 166, description: "audit passes if citation can omit passage", mutate: (r) => { r.passageLevelCitationRequired = false; } },
  { id: 167, description: "audit passes if user data is mixed into knowledge schema", mutate: (r) => { r.publicKnowledgeSeparatedFromUserData = false; } },
  { id: 168, description: "audit passes if model output becomes authoritative source", mutate: (r) => { r.modelOutputNotAuthoritativeSource = false; } },
  { id: 169, description: "audit passes if locale activates connector", mutate: (r) => { r.localeActivatesConnectorAccepted = true; } },
  { id: 170, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
  { id: 171, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9F"; } },
  { id: 172, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
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
    r.checkId === "9E",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceTrustContractCheckId === SOURCE_TRUST_CONTRACT_CHECK_ID,
    r.sourceJurisdictionModelCheckId === SOURCE_JURISDICTION_MODEL_CHECK_ID,
    r.sourceCoveragePlanCheckId === SOURCE_COVERAGE_PLAN_CHECK_ID,
    r.sourceArchitectureReady === true,
    r.sourceTrustContractReady === true,
    r.sourceJurisdictionModelReady === true,
    r.sourceCoveragePlanReady === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.databaseMigrationCreated === false,
    r.sqlFileCreated === false,
    r.databaseTableCreated === false,
    r.databaseWritePerformed === false,
    r.networkAccessPerformed === false,
    r.externalSourceDownloaded === false,
    r.realSourceRegistered === false,
    r.realSourceVersionCreated === false,
    r.realPassageStored === false,
    r.realClaimPopulated === false,
    r.realAuthorityRegistered === false,
    r.realProcessPopulated === false,
    r.realCrossBorderConnectorImplemented === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,

    r.logicalStorageLayersDefined === true,
    r.identifierTypesDefined === true,
    r.sourceRegistrySchemaDefined === true,
    r.sourceVersionSchemaDefined === true,
    r.sourcePassageSchemaDefined === true,
    r.publisherSchemaDefined === true,
    r.jurisdictionSchemaDefined === true,
    r.territorialScopeSchemaDefined === true,
    r.authoritySchemaDefined === true,
    r.authorityCompetenceSchemaDefined === true,
    r.claimSchemaDefined === true,
    r.claimEvidenceLinkSchemaDefined === true,
    r.administrativeProcessSchemaDefined === true,
    r.processStepSchemaDefined === true,
    r.processClaimLinkSchemaDefined === true,
    r.formSchemaDefined === true,
    r.formRequirementSchemaDefined === true,
    r.evidenceRequirementSchemaDefined === true,
    r.deadlineRuleSchemaDefined === true,
    r.feeRuleSchemaDefined === true,
    r.eligibilityRuleSchemaDefined === true,
    r.regionalOverrideSchemaDefined === true,
    r.reviewRecordSchemaDefined === true,
    r.freshnessRecordSchemaDefined === true,
    r.knowledgeConflictSchemaDefined === true,
    r.citationSchemaDefined === true,
    r.terminologySchemaDefined === true,
    r.localizedTerminologySchemaDefined === true,
    r.trustDomainSchemaDefined === true,
    r.crossBorderConnectorSchemaDefined === true,
    r.crossBorderProcessSchemaDefined === true,
    r.responsibleActorRuleSchemaDefined === true,
    r.retrievalMetadataSchemaDefined === true,
    r.auditEventSchemaDefined === true,

    r.publicKnowledgeSeparatedFromUserData === true,
    r.immutableSourceVersionsRequired === true,
    r.historicalVersionsPreserved === true,
    r.passageLevelCitationRequired === true,
    r.claimsSeparatedFromLocalizedPresentation === true,
    r.authorityCompetenceVersioned === true,
    r.effectivePeriodsStructured === true,
    r.regionalOverridesStructured === true,
    r.reviewHistoryAppendOnly === true,
    r.freshnessSeparatedFromEffectiveDate === true,
    r.conflictsPersistUntilResolved === true,
    r.vectorSimilarityNotAuthoritative === true,
    r.modelOutputNotAuthoritativeSource === true,
    r.localeDoesNotActivateTrustDomain === true,
    r.deSkActivationIndependentFromLocale === true,
    r.userContentForeignKeyNotRequired === true,
    r.userContentIncludedInAuditEvents === false,

    r.relationshipCardinalityDefined === true,
    r.uniquenessContractDefined === true,
    r.indexingRecommendationsDefined === true,
    r.lifecycleRulesDefined === true,
    r.normalizationBoundaryDefined === true,
    r.minimalityPrincipleDefined === true,
    r.schemaImplementationReadiness === "ready_for_migration_plan",

    r.firstGermanPackRepresentable === true,
    r.eightProcessGroupsRepresentable === true,
    r.sixLaunchLocalesRepresentable === true,
    r.deSkConnectorRepresentable === true,
    r.deSkFirstPilotTopic === "familienkasse_kindergeld",
    r.deSkConnectorNotImplemented === true,

    r.zeroTablesCreated === true,
    r.zeroMigrationsCreated === true,
    r.zeroDatabaseRows === true,
    r.zeroRealSources === true,
    r.zeroRealSourceVersions === true,
    r.zeroRealPassages === true,
    r.zeroRealClaims === true,
    r.zeroRealAuthorities === true,
    r.zeroRealProcesses === true,
    r.zeroRealCrossBorderConnectors === true,

    r.standaloneExtractionStillOpen === true,
    r.physicalAndroidStillUntested === true,
    r.genuineIosSafariStillUntested === true,
    r.heicHeifStillOpen === true,
    r.serverlessOcrStillOpen === true,
    r.distributedRateLimiterStillOpen === true,
    r.paymentFlowStillOpen === true,
    r.sixLanguageProductionParityStillOpen === true,
    r.germanKnowledgePopulationStillOpen === true,
    r.deSkImplementationStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.existingFileModified === false,
    r.onlyExpectedFilesChanged === true,
    r.newAuditFileCreated === true,

    r.oneGiantKnowledgeTableAccepted === false,
    r.oneGiantJsonDocumentAccepted === false,
    r.sourceTextStoredDirectlyOnMutableRegistryRowAccepted === false,
    r.sourceVersionOverwrittenAccepted === false,
    r.historicalSourceVersionDeletedAccepted === false,
    r.immutableFlagRemovedAccepted === false,
    r.sourceVersionLacksContentHashAccepted === false,
    r.sourceVersionLacksEffectivePeriodAccepted === false,
    r.sourceVersionLacksSourceIdAccepted === false,
    r.passageLacksSourceVersionIdAccepted === false,
    r.passageCitationPointsOnlyToSourceIdAccepted === false,
    r.passageOrderMissingAccepted === false,
    r.passageTextHashMissingAccepted === false,
    r.preciseClaimAcceptedWithoutPassageIdAccepted === false,
    r.publisherOfficialStatusTreatedAsUniversalCompetenceAccepted === false,
    r.publisherCompetenceOmittedAccepted === false,
    r.territorialScopeOmittedAccepted === false,
    r.jurisdictionParentRelationshipOmittedAccepted === false,
    r.localScopeGeneralizedNationallyAccepted === false,
    r.authorityLacksTerritorialScopeAccepted === false,
    r.authorityCompetenceStoredOnlyAsFreeTextAccepted === false,
    r.competenceEffectivePeriodOmittedAccepted === false,
    r.nearbyAuthorityTreatedAsCompetentAccepted === false,
    r.claimLacksRiskLevelAccepted === false,
    r.claimLacksAllowedBlockedUsesAccepted === false,
    r.claimLacksCitationRequirementAccepted === false,
    r.claimDuplicatesLocalizedTruthAccepted === false,
    r.translatedClaimTreatedAsSeparateAuthoritativeLegalTruthAccepted === false,
    r.claimEvidenceLinkOmittedAccepted === false,
    r.highRiskClaimAcceptedWithoutDirectSupportAccepted === false,
    r.partialSupportAcceptedAsDirectSupportAccepted === false,
    r.contradictoryEvidenceLinkAllowedAccepted === false,
    r.processStoredAsOneUnstructuredArticleAccepted === false,
    r.processStepOrderOmittedAccepted === false,
    r.processStepLacksResponsibleActorAccepted === false,
    r.processStepLacksBlockedOutputsAccepted === false,
    r.processClaimRelationshipOmittedAccepted === false,
    r.formProvesEligibilityAutomaticallyAccepted === false,
    r.formProvesFullEntitlementAutomaticallyAccepted === false,
    r.formRequirementsLackSourcePassageAccepted === false,
    r.evidenceRequirementAssumesUserAlwaysActsAccepted === false,
    r.institutionExchangeIgnoredAccepted === false,
    r.deadlineRuleLacksTriggerEventAccepted === false,
    r.deadlineRuleLacksDatePrecisionAccepted === false,
    r.deadlineExactCalculationAlwaysAllowedAccepted === false,
    r.deadlineSourcePassageOmittedAccepted === false,
    r.feeLacksEffectivePeriodAccepted === false,
    r.feeInferredFromOldSourceAccepted === false,
    r.eligibilityFinalDeterminationAllowedAccepted === false,
    r.regionalOverrideLacksBaseRuleAccepted === false,
    r.regionalOverrideLacksScopeAccepted === false,
    r.regionalOverrideAssumedSubstantiveAccepted === false,
    r.reviewRecordOverwritesPriorReviewAccepted === false,
    r.reviewHistoryDeletedAccepted === false,
    r.freshnessOverwritesEffectiveDateAccepted === false,
    r.retrievedAtUsedAsEffectiveFromAccepted === false,
    r.conflictStoredOnlyInNotesAccepted === false,
    r.conflictDeletedBeforeResolutionAccepted === false,
    r.highRiskUseAllowedWithUnresolvedConflictAccepted === false,
    r.citationLacksSourceVersionIdAccepted === false,
    r.citationLacksPassageIdAccepted === false,
    r.citationLacksPublisherAccepted === false,
    r.citationPointsOnlyToTranslationAccepted === false,
    r.germanOfficialTermRemovedAccepted === false,
    r.localizedTerminologyRemovesWarningAccepted === false,
    r.localizedTerminologyChangesUrgencyAccepted === false,
    r.localizedTerminologyIncreasesCertaintyAccepted === false,
    r.localizedTerminologyRemovesBlockedActionAccepted === false,
    r.localeDuplicatesWholeClaimStoreAccepted === false,
    r.slovakLocaleActivatesSkTrustDomainAccepted === false,
    r.englishLocaleDisablesCrossBorderContextAccepted === false,
    r.germanLocaleForcesDeOnlyContextAccepted === false,
    r.crossBorderProcessLacksEuClaimsAccepted === false,
    r.crossBorderProcessLacksGermanClaimsAccepted === false,
    r.crossBorderProcessLacksForeignClaimsAccepted === false,
    r.crossBorderProcessLacksResponsibleActorAccepted === false,
    r.crossBorderProcessLacksTemporalAlignmentAccepted === false,
    r.crossBorderProcessLacksEvidenceCompletenessAccepted === false,
    r.responsibleActorUnresolvedButConcreteInstructionAllowedAccepted === false,
    r.unrestrictedVectorResultAuthorizesClaimAccepted === false,
    r.vectorMetadataOmitsJurisdictionFilterAccepted === false,
    r.vectorMetadataOmitsEffectiveDateFilterAccepted === false,
    r.vectorMetadataOmitsReviewFilterAccepted === false,
    r.auditEventLacksStateHashAccepted === false,
    r.smartTalkInputMixedIntoPublicKnowledgeAccepted === false,
    r.ocrImageStoredAsKnowledgeSourceAccepted === false,
    r.dnaProfileLinkedIntoKnowledgeClaimAccepted === false,
    r.paymentDataAddedToKnowledgeSchemaAccepted === false,
    r.conversationHistoryAddedToKnowledgeSchemaAccepted === false,
    r.oneSourceMappedOneToOneWithVersionAccepted === false,
    r.oneProcessMappedOneToOneWithStepAccepted === false,
    r.oneClaimMappedOneToOneWithCitationAccepted === false,
    r.oneAuthorityMappedOneToOneWithCompetenceAccepted === false,
    r.localizedTerminologyOnlySupportsOneLanguageAccepted === false,
    r.indexingRecommendationsTreatedAsActualIndexesAccepted === false,
    r.historyDeletionUsedAsNormalLifecycleAccepted === false,
    r.sourceChangeSilentlyTrustedAccepted === false,
    r.changedSourceBypassesReviewAccepted === false,
    r.schemaMarkedReadyDespiteCitationGapAccepted === false,
    r.schemaMarkedReadyDespiteHistoryLossRiskAccepted === false,
    r.schemaMarkedReadyDespiteUserDataBoundaryIssueAccepted === false,
    r.schemaMarkedReadyDespiteNormalizationIssueAccepted === false,
    r.schemaMarkedReadyDespiteCrossBorderGapAccepted === false,
    r.migrationMarkedImplementedAccepted === false,
    r.germanKnowledgeClaimedPopulatedAccepted === false,
    r.sixLanguagesClaimedProductionReadyAccepted === false,
    r.localeActivatesConnectorAccepted === false,
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
  sourceJurisdictionModelCheckIdFound: string;
  sourceJurisdictionModelReady: boolean;
  sourceCoveragePlanCheckIdFound: string;
  sourceCoveragePlanReady: boolean;
  existingMigrationNamingConventionObserved: boolean;
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
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n").map((s) => s.trim()).filter(Boolean);
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
    phase9aExists && sourceArchitectureCheckIdFound === "9A" &&
    phase9aSrc.includes("readyForGermanSourceHierarchyAndTrustContract: allPassed");
  if (!sourceArchitectureReady) notes.push("PHASE 9A source did not statically confirm readiness.");

  const phase9bSrc = readFileText(PHASE_9B_REL_PATH);
  const phase9bExists = fileExists(PHASE_9B_REL_PATH);
  const checkId9bMatch = phase9bSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceTrustContractCheckIdFound = checkId9bMatch ? checkId9bMatch[1] : "not_found";
  const sourceTrustContractReady =
    phase9bExists && sourceTrustContractCheckIdFound === "9B" &&
    phase9bSrc.includes("readyForGermanJurisdictionEffectiveDateModel: allPassed");
  if (!sourceTrustContractReady) notes.push("PHASE 9B source did not statically confirm readiness.");

  const phase9cSrc = readFileText(PHASE_9C_REL_PATH);
  const phase9cExists = fileExists(PHASE_9C_REL_PATH);
  const checkId9cMatch = phase9cSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceJurisdictionModelCheckIdFound = checkId9cMatch ? checkId9cMatch[1] : "not_found";
  const sourceJurisdictionModelReady =
    phase9cExists && sourceJurisdictionModelCheckIdFound === "9C" &&
    phase9cSrc.includes("readyForMinimumGermanProcessCoveragePlan: allPassed");
  if (!sourceJurisdictionModelReady) notes.push("PHASE 9C source did not statically confirm readiness.");

  const phase9dSrc = readFileText(PHASE_9D_REL_PATH);
  const phase9dExists = fileExists(PHASE_9D_REL_PATH);
  const checkId9dMatch = phase9dSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceCoveragePlanCheckIdFound = checkId9dMatch ? checkId9dMatch[1] : "not_found";
  const sourceCoveragePlanReady =
    phase9dExists && sourceCoveragePlanCheckIdFound === "9D" &&
    phase9dSrc.includes("readyForMinimalKnowledgeStorageSchema: allPassed");
  if (!sourceCoveragePlanReady) notes.push("PHASE 9D source did not statically confirm readiness.");

  const migrationFiles = listDirNamesOnly(MIGRATIONS_DIR_REL_PATH);
  const existingMigrationNamingConventionObserved =
    migrationFiles.length > 0 && migrationFiles.every((f) => /^\d{3}_[a-z0-9_]+\.sql$/.test(f) || /^\d{8}_[a-z0-9_]+\.sql$/.test(f));

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
    onlyExpectedFilesChanged, existingFileModified, newAuditFileCreated,
    sourceArchitectureCheckIdFound, sourceArchitectureReady,
    sourceTrustContractCheckIdFound, sourceTrustContractReady,
    sourceJurisdictionModelCheckIdFound, sourceJurisdictionModelReady,
    sourceCoveragePlanCheckIdFound, sourceCoveragePlanReady,
    existingMigrationNamingConventionObserved,
    standaloneExtractionStillOpen, physicalAndroidStillUntested, genuineIosSafariStillUntested,
    heicHeifStillOpen, serverlessOcrStillOpen, distributedRateLimiterStillOpen, paymentFlowStillOpen,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function schemaFieldCountsOk(): boolean {
  return Object.keys(MIN_EXPECTED_SCHEMA_FIELD_COUNTS).every(
    (key) => (SCHEMA_FIELD_COUNTS[key] ?? 0) >= MIN_EXPECTED_SCHEMA_FIELD_COUNTS[key],
  );
}

function buildGoodResult(evidence: Evidence): Result {
  const designComplete =
    LOGICAL_STORAGE_LAYERS.length === 32 &&
    IDENTIFIER_TYPE_NAMES.length === 27 &&
    CORE_SCHEMA_PRINCIPLES.length === 18 &&
    ONE_GIANT_KNOWLEDGE_TABLE_OR_JSON_DOCUMENT_ALLOWED === false &&
    schemaFieldCountsOk() &&
    SOURCE_VERSION_OVERWRITTEN_IN_PLACE === false &&
    PRECISE_CLAIMS_MAY_CITE_SOURCE_ID_ONLY === false &&
    OFFICIAL_STATUS_PROVES_UNIVERSAL_COMPETENCE === false &&
    LOCAL_SCOPE_GENERALIZED_NATIONALLY_ALLOWED === false &&
    AUTHORITY_COMPETENCE_MAY_BE_FREE_TEXT_ONLY === false &&
    NEARBY_AUTHORITY_PROVES_COMPETENCE_WITHOUT_RECORD === false &&
    CLAIM_STORES_LOCALIZED_OUTPUT_AS_SEPARATE_LEGAL_TRUTH === false &&
    SUPPORT_STATUSES.length === 6 &&
    HIGH_RISK_CLAIM_WITHOUT_DIRECT_SUPPORT_ALLOWED === false &&
    PARTIAL_SUPPORT_TREATED_AS_DIRECT_SUPPORT === false &&
    CONTRADICTORY_EVIDENCE_LINK_ACCEPTED_SILENTLY === false &&
    PROCESS_STORED_AS_ONE_UNSTRUCTURED_ARTICLE === false &&
    FORM_ALONE_PROVES_ELIGIBILITY_OR_ENTITLEMENT === false &&
    EVIDENCE_REQUIREMENT_ASSUMES_USER_ALWAYS_ACTS === false &&
    DEADLINE_EXACT_CALCULATION_ALWAYS_ALLOWED === false &&
    FEE_INFERRED_FROM_STALE_OR_UNRELATED_SOURCE === false &&
    EVERY_OVERRIDE_ASSUMED_SUBSTANTIVE === false &&
    REVIEW_HISTORY_APPEND_ONLY_NOT_OVERWRITE === true &&
    FRESHNESS_MAY_OVERWRITE_EFFECTIVE_DATE === false &&
    RETRIEVED_AT_MAY_BE_USED_AS_EFFECTIVE_FROM === false &&
    CONFLICT_MAY_BE_STORED_ONLY_IN_FREE_TEXT_NOTES === false &&
    CONFLICT_MAY_BE_DELETED_BEFORE_RESOLUTION === false &&
    HIGH_RISK_USE_ALLOWED_WITH_UNRESOLVED_CONFLICT === false &&
    CITATION_MAY_POINT_ONLY_TO_TRANSLATION === false &&
    GERMAN_OFFICIAL_TERM_MAY_BE_REMOVED_FROM_LOCALIZATION === false &&
    LOCALIZATION_MAY_DUPLICATE_UNDERLYING_LEGAL_CLAIM === false &&
    LOCALIZATION_MAY_ONLY_SUPPORT_ONE_LANGUAGE === false &&
    TRUST_DOMAIN_MAY_BE_INFERRED_FROM_OUTPUT_LOCALE === false &&
    CONCRETE_INSTRUCTION_ALLOWED_WITH_UNRESOLVED_ACTOR === false &&
    RELATIONSHIP_CARDINALITY_RULES.length === 15 &&
    INAPPROPRIATE_ONE_TO_ONE_SHORTCUTS_ALLOWED === false &&
    UNIQUENESS_CONTRACT_RULES.length === 9 &&
    UNIQUENESS_RULES_OVERCLAIMED_AS_FINAL_DB_CONSTRAINTS === false &&
    INDEXING_RECOMMENDATIONS.length === 17 &&
    INDEXING_RECOMMENDATIONS_ARE_ACTUAL_INDEXES === false &&
    LIFECYCLE_RULES.length === 12 &&
    DELETION_OF_LEGAL_HISTORY_IS_NORMAL_LIFECYCLE === false &&
    SOURCE_CHANGE_TRUSTED_SILENTLY_WITHOUT_REVIEW === false &&
    NORMALIZATION_BOUNDARY_PROHIBITIONS.length === 9 &&
    MODEL_OUTPUT_MAY_BECOME_AUTHORITATIVE_SOURCE_CONTENT === false &&
    PUBLIC_KNOWLEDGE_DATA_CATEGORIES.length === 9 &&
    USER_DATA_CATEGORIES.length === 7 &&
    USER_CONTENT_FOREIGN_KEY_REQUIRED_FOR_PUBLIC_SCHEMA === false &&
    USER_CONTENT_WRITTEN_MERELY_BECAUSE_RETRIEVAL_OCCURS === false &&
    Object.keys(MINIMALITY_CLASSIFICATION).length === 32 &&
    MINIMALITY_EXCLUDES.length === 6 &&
    SCHEMA_IMPLEMENTATION_READINESS_STATES.length === 8 &&
    DE_SK_SUPPORTED_ELEMENTS.length === 9 &&
    DE_SK_FIRST_PILOT_TOPIC === "familienkasse_kindergeld" &&
    DE_SK_CONNECTOR_IMPLEMENTED_THIS_PHASE === false &&
    DE_SK_ACTIVATED_FROM_SLOVAK_LOCALE_THIS_PHASE === false &&
    LAUNCH_LOCALES.length === 6;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sourceArchitectureReady &&
    evidence.sourceTrustContractReady &&
    evidence.sourceJurisdictionModelReady &&
    evidence.sourceCoveragePlanReady;

  return {
    checkId: "9E",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceTrustContractCheckId: evidence.sourceTrustContractCheckIdFound,
    sourceJurisdictionModelCheckId: evidence.sourceJurisdictionModelCheckIdFound,
    sourceCoveragePlanCheckId: evidence.sourceCoveragePlanCheckIdFound,
    sourceArchitectureReady: evidence.sourceArchitectureReady,
    sourceTrustContractReady: evidence.sourceTrustContractReady,
    sourceJurisdictionModelReady: evidence.sourceJurisdictionModelReady,
    sourceCoveragePlanReady: evidence.sourceCoveragePlanReady,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    databaseMigrationCreated: false,
    sqlFileCreated: false,
    databaseTableCreated: false,
    databaseWritePerformed: false,
    networkAccessPerformed: false,
    externalSourceDownloaded: false,
    realSourceRegistered: false,
    realSourceVersionCreated: false,
    realPassageStored: false,
    realClaimPopulated: false,
    realAuthorityRegistered: false,
    realProcessPopulated: false,
    realCrossBorderConnectorImplemented: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    logicalStorageLayersDefined: true,
    identifierTypesDefined: true,
    sourceRegistrySchemaDefined: true,
    sourceVersionSchemaDefined: true,
    sourcePassageSchemaDefined: true,
    publisherSchemaDefined: true,
    jurisdictionSchemaDefined: true,
    territorialScopeSchemaDefined: true,
    authoritySchemaDefined: true,
    authorityCompetenceSchemaDefined: true,
    claimSchemaDefined: true,
    claimEvidenceLinkSchemaDefined: true,
    administrativeProcessSchemaDefined: true,
    processStepSchemaDefined: true,
    processClaimLinkSchemaDefined: true,
    formSchemaDefined: true,
    formRequirementSchemaDefined: true,
    evidenceRequirementSchemaDefined: true,
    deadlineRuleSchemaDefined: true,
    feeRuleSchemaDefined: true,
    eligibilityRuleSchemaDefined: true,
    regionalOverrideSchemaDefined: true,
    reviewRecordSchemaDefined: true,
    freshnessRecordSchemaDefined: true,
    knowledgeConflictSchemaDefined: true,
    citationSchemaDefined: true,
    terminologySchemaDefined: true,
    localizedTerminologySchemaDefined: true,
    trustDomainSchemaDefined: true,
    crossBorderConnectorSchemaDefined: true,
    crossBorderProcessSchemaDefined: true,
    responsibleActorRuleSchemaDefined: true,
    retrievalMetadataSchemaDefined: true,
    auditEventSchemaDefined: true,

    publicKnowledgeSeparatedFromUserData: true,
    immutableSourceVersionsRequired: true,
    historicalVersionsPreserved: true,
    passageLevelCitationRequired: true,
    claimsSeparatedFromLocalizedPresentation: true,
    authorityCompetenceVersioned: true,
    effectivePeriodsStructured: true,
    regionalOverridesStructured: true,
    reviewHistoryAppendOnly: true,
    freshnessSeparatedFromEffectiveDate: true,
    conflictsPersistUntilResolved: true,
    vectorSimilarityNotAuthoritative: true,
    modelOutputNotAuthoritativeSource: true,
    localeDoesNotActivateTrustDomain: true,
    deSkActivationIndependentFromLocale: true,
    userContentForeignKeyNotRequired: true,
    userContentIncludedInAuditEvents: false,

    relationshipCardinalityDefined: true,
    uniquenessContractDefined: true,
    indexingRecommendationsDefined: true,
    lifecycleRulesDefined: true,
    normalizationBoundaryDefined: true,
    minimalityPrincipleDefined: true,
    schemaImplementationReadiness: "ready_for_migration_plan",

    firstGermanPackRepresentable: true,
    eightProcessGroupsRepresentable: true,
    sixLaunchLocalesRepresentable: true,
    deSkConnectorRepresentable: true,
    deSkFirstPilotTopic: DE_SK_FIRST_PILOT_TOPIC,
    deSkConnectorNotImplemented: true,

    zeroTablesCreated: true,
    zeroMigrationsCreated: true,
    zeroDatabaseRows: true,
    zeroRealSources: true,
    zeroRealSourceVersions: true,
    zeroRealPassages: true,
    zeroRealClaims: true,
    zeroRealAuthorities: true,
    zeroRealProcesses: true,
    zeroRealCrossBorderConnectors: true,

    standaloneExtractionStillOpen: evidence.standaloneExtractionStillOpen,
    physicalAndroidStillUntested: evidence.physicalAndroidStillUntested,
    genuineIosSafariStillUntested: evidence.genuineIosSafariStillUntested,
    heicHeifStillOpen: evidence.heicHeifStillOpen,
    serverlessOcrStillOpen: evidence.serverlessOcrStillOpen,
    distributedRateLimiterStillOpen: evidence.distributedRateLimiterStillOpen,
    paymentFlowStillOpen: evidence.paymentFlowStillOpen,
    sixLanguageProductionParityStillOpen: true,
    germanKnowledgePopulationStillOpen: true,
    deSkImplementationStillOpen: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForKnowledgeMigrationImplementationPlan: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,
    existingMigrationNamingConventionObserved: evidence.existingMigrationNamingConventionObserved,

    oneGiantKnowledgeTableAccepted: false,
    oneGiantJsonDocumentAccepted: false,
    sourceTextStoredDirectlyOnMutableRegistryRowAccepted: false,
    sourceVersionOverwrittenAccepted: false,
    historicalSourceVersionDeletedAccepted: false,
    immutableFlagRemovedAccepted: false,
    sourceVersionLacksContentHashAccepted: false,
    sourceVersionLacksEffectivePeriodAccepted: false,
    sourceVersionLacksSourceIdAccepted: false,
    passageLacksSourceVersionIdAccepted: false,
    passageCitationPointsOnlyToSourceIdAccepted: false,
    passageOrderMissingAccepted: false,
    passageTextHashMissingAccepted: false,
    preciseClaimAcceptedWithoutPassageIdAccepted: false,
    publisherOfficialStatusTreatedAsUniversalCompetenceAccepted: false,
    publisherCompetenceOmittedAccepted: false,
    territorialScopeOmittedAccepted: false,
    jurisdictionParentRelationshipOmittedAccepted: false,
    localScopeGeneralizedNationallyAccepted: false,
    authorityLacksTerritorialScopeAccepted: false,
    authorityCompetenceStoredOnlyAsFreeTextAccepted: false,
    competenceEffectivePeriodOmittedAccepted: false,
    nearbyAuthorityTreatedAsCompetentAccepted: false,
    claimLacksRiskLevelAccepted: false,
    claimLacksAllowedBlockedUsesAccepted: false,
    claimLacksCitationRequirementAccepted: false,
    claimDuplicatesLocalizedTruthAccepted: false,
    translatedClaimTreatedAsSeparateAuthoritativeLegalTruthAccepted: false,
    claimEvidenceLinkOmittedAccepted: false,
    highRiskClaimAcceptedWithoutDirectSupportAccepted: false,
    partialSupportAcceptedAsDirectSupportAccepted: false,
    contradictoryEvidenceLinkAllowedAccepted: false,
    processStoredAsOneUnstructuredArticleAccepted: false,
    processStepOrderOmittedAccepted: false,
    processStepLacksResponsibleActorAccepted: false,
    processStepLacksBlockedOutputsAccepted: false,
    processClaimRelationshipOmittedAccepted: false,
    formProvesEligibilityAutomaticallyAccepted: false,
    formProvesFullEntitlementAutomaticallyAccepted: false,
    formRequirementsLackSourcePassageAccepted: false,
    evidenceRequirementAssumesUserAlwaysActsAccepted: false,
    institutionExchangeIgnoredAccepted: false,
    deadlineRuleLacksTriggerEventAccepted: false,
    deadlineRuleLacksDatePrecisionAccepted: false,
    deadlineExactCalculationAlwaysAllowedAccepted: false,
    deadlineSourcePassageOmittedAccepted: false,
    feeLacksEffectivePeriodAccepted: false,
    feeInferredFromOldSourceAccepted: false,
    eligibilityFinalDeterminationAllowedAccepted: false,
    regionalOverrideLacksBaseRuleAccepted: false,
    regionalOverrideLacksScopeAccepted: false,
    regionalOverrideAssumedSubstantiveAccepted: false,
    reviewRecordOverwritesPriorReviewAccepted: false,
    reviewHistoryDeletedAccepted: false,
    freshnessOverwritesEffectiveDateAccepted: false,
    retrievedAtUsedAsEffectiveFromAccepted: false,
    conflictStoredOnlyInNotesAccepted: false,
    conflictDeletedBeforeResolutionAccepted: false,
    highRiskUseAllowedWithUnresolvedConflictAccepted: false,
    citationLacksSourceVersionIdAccepted: false,
    citationLacksPassageIdAccepted: false,
    citationLacksPublisherAccepted: false,
    citationPointsOnlyToTranslationAccepted: false,
    germanOfficialTermRemovedAccepted: false,
    localizedTerminologyRemovesWarningAccepted: false,
    localizedTerminologyChangesUrgencyAccepted: false,
    localizedTerminologyIncreasesCertaintyAccepted: false,
    localizedTerminologyRemovesBlockedActionAccepted: false,
    localeDuplicatesWholeClaimStoreAccepted: false,
    slovakLocaleActivatesSkTrustDomainAccepted: false,
    englishLocaleDisablesCrossBorderContextAccepted: false,
    germanLocaleForcesDeOnlyContextAccepted: false,
    crossBorderProcessLacksEuClaimsAccepted: false,
    crossBorderProcessLacksGermanClaimsAccepted: false,
    crossBorderProcessLacksForeignClaimsAccepted: false,
    crossBorderProcessLacksResponsibleActorAccepted: false,
    crossBorderProcessLacksTemporalAlignmentAccepted: false,
    crossBorderProcessLacksEvidenceCompletenessAccepted: false,
    responsibleActorUnresolvedButConcreteInstructionAllowedAccepted: false,
    unrestrictedVectorResultAuthorizesClaimAccepted: false,
    vectorMetadataOmitsJurisdictionFilterAccepted: false,
    vectorMetadataOmitsEffectiveDateFilterAccepted: false,
    vectorMetadataOmitsReviewFilterAccepted: false,
    auditEventLacksStateHashAccepted: false,
    smartTalkInputMixedIntoPublicKnowledgeAccepted: false,
    ocrImageStoredAsKnowledgeSourceAccepted: false,
    dnaProfileLinkedIntoKnowledgeClaimAccepted: false,
    paymentDataAddedToKnowledgeSchemaAccepted: false,
    conversationHistoryAddedToKnowledgeSchemaAccepted: false,
    oneSourceMappedOneToOneWithVersionAccepted: false,
    oneProcessMappedOneToOneWithStepAccepted: false,
    oneClaimMappedOneToOneWithCitationAccepted: false,
    oneAuthorityMappedOneToOneWithCompetenceAccepted: false,
    localizedTerminologyOnlySupportsOneLanguageAccepted: false,
    indexingRecommendationsTreatedAsActualIndexesAccepted: false,
    historyDeletionUsedAsNormalLifecycleAccepted: false,
    sourceChangeSilentlyTrustedAccepted: false,
    changedSourceBypassesReviewAccepted: false,
    schemaMarkedReadyDespiteCitationGapAccepted: false,
    schemaMarkedReadyDespiteHistoryLossRiskAccepted: false,
    schemaMarkedReadyDespiteUserDataBoundaryIssueAccepted: false,
    schemaMarkedReadyDespiteNormalizationIssueAccepted: false,
    schemaMarkedReadyDespiteCrossBorderGapAccepted: false,
    migrationMarkedImplementedAccepted: false,
    germanKnowledgeClaimedPopulatedAccepted: false,
    sixLanguagesClaimedProductionReadyAccepted: false,
    localeActivatesConnectorAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    logicalStorageLayers: LOGICAL_STORAGE_LAYERS,
    identifierTypeNames: IDENTIFIER_TYPE_NAMES,
    coreSchemaPrinciples: CORE_SCHEMA_PRINCIPLES,
    relationshipCardinalityRules: RELATIONSHIP_CARDINALITY_RULES,
    uniquenessContractRules: UNIQUENESS_CONTRACT_RULES,
    indexingRecommendationsList: INDEXING_RECOMMENDATIONS,
    lifecycleRulesList: LIFECYCLE_RULES,
    normalizationBoundaryProhibitions: NORMALIZATION_BOUNDARY_PROHIBITIONS,
    publicKnowledgeDataCategories: PUBLIC_KNOWLEDGE_DATA_CATEGORIES,
    userDataCategories: USER_DATA_CATEGORIES,
    minimalityExcludes: MINIMALITY_EXCLUDES,
    minimalityClassification: MINIMALITY_CLASSIFICATION,
    deSkSupportedElements: DE_SK_SUPPORTED_ELEMENTS,
    schemaFieldCounts: SCHEMA_FIELD_COUNTS,
    knownOpenDebts: [
      "HEIC/HEIF support", "EXIF orientation normalization", "Decoded pixel bounds",
      "Serverless/Vercel OCR validation", "Physical Android camera-image validation",
      "Genuine iOS camera-image validation", "Distributed production rate limiter",
      "Standalone Smart Talk extraction from the DNA shell", "Final production payment flow",
      "German knowledge population (no real sources ingested by 9A-9E)",
      "DE<->SK cross-border connector implementation (representable, not implemented, in 9E)",
      "Knowledge migration implementation plan (PHASE 9F, must be derived from this schema)",
    ],
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `existingMigrationNamingConventionObserved (${MIGRATIONS_DIR_REL_PATH} listed read-only, not executed): ${evidence.existingMigrationNamingConventionObserved}`,
      `${PHASE_9A_REL_PATH} checkId found: ${evidence.sourceArchitectureCheckIdFound}`,
      `${PHASE_9A_REL_PATH} readiness wiring confirmed: ${evidence.sourceArchitectureReady}`,
      `${PHASE_9B_REL_PATH} checkId found: ${evidence.sourceTrustContractCheckIdFound}`,
      `${PHASE_9B_REL_PATH} readiness wiring confirmed: ${evidence.sourceTrustContractReady}`,
      `${PHASE_9C_REL_PATH} checkId found: ${evidence.sourceJurisdictionModelCheckIdFound}`,
      `${PHASE_9C_REL_PATH} readiness wiring confirmed: ${evidence.sourceJurisdictionModelReady}`,
      `${PHASE_9D_REL_PATH} checkId found: ${evidence.sourceCoveragePlanCheckIdFound}`,
      `${PHASE_9D_REL_PATH} readiness wiring confirmed: ${evidence.sourceCoveragePlanReady}`,
      `${PHASE_9A_REL_PATH} standaloneSmartTalkExtractionRequiredLater: true present: ${evidence.standaloneExtractionStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      "This audit read only committed plain text for the 9A-9D audits, the 8.13C closure audit, and existing Supabase migration filenames (for naming-convention observation only) — none were imported or executed.",
      "Zero tables created, zero migrations created, zero database rows, zero real sources/source versions/passages/claims/authorities/processes/cross-border connectors, zero embeddings/retrieval/model/OCR/network calls, zero user-content persistence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runMinimalKnowledgeStorageSchemaAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForKnowledgeMigrationImplementationPlan: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runMinimalKnowledgeStorageSchemaAudit();
  console.log(JSON.stringify(result));
}
