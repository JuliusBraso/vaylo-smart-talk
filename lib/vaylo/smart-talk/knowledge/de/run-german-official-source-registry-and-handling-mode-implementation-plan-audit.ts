/**
 * PHASE 9Q — German Official Source Registry and Handling-Mode Contract
 * Implementation Plan.
 *
 * Planning only: this audit reads the committed 032-034 schema and the accepted
 * 9P/9O contracts. It creates no migration, data, generated types, runtime
 * client, source acquisition, or authorization.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHECK_ID = "9Q";
const PHASE = "German Official Source Registry and Handling-Mode Contract Implementation Plan";
const M032 = "supabase/migrations/032_create_minimal_knowledge_schema.sql";
const M033 = "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql";
const M034 = "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql";
const A9P =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-ingestion-and-live-official-source-retrieval-contract-boundary-audit.ts";
const A9O = "lib/vaylo/smart-talk/knowledge/de/run-generated-database-type-decision-and-closure-audit.ts";
const SELF =
  "lib/vaylo/smart-talk/knowledge/de/run-german-official-source-registry-and-handling-mode-implementation-plan-audit.ts";
const MIGRATION = "035_add_official_source_registry_and_handling_mode_contract.sql";
const NEXT = "PHASE 9R — Official Source Registry and Handling-Mode Schema Migration";

function read(relative: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relative), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: process.cwd(), encoding: "utf8", timeout: 30000 }).trim();
  } catch {
    return "";
  }
}

function hasColumns(sql: string, table: string, columns: readonly string[]): boolean {
  const start = sql.search(new RegExp(`create\\s+table\\s+if\\s+not\\s+exists\\s+public\\.${table}\\s*\\(`, "i"));
  if (start < 0) return false;
  const tail = sql.slice(start);
  const end = tail.search(/\n\);/);
  const definition = end < 0 ? tail : tail.slice(0, end);
  return columns.every((column) => new RegExp(`\\b${column}\\b`, "i").test(definition));
}

type ExistingClassification =
  | "REUSE_AS_IS"
  | "REUSE_WITH_FORWARD_EXTENSION"
  | "NOT_RELEVANT_TO_FIRST_SLICE"
  | "INSUFFICIENT_REQUIRES_NEW_OBJECT"
  | "FORBIDDEN_FOR_DIRECT_WRITE";

interface ExistingCapability {
  tableName: string;
  purpose: string;
  primaryKey: string;
  importantColumns: string[];
  foreignKeys: string[];
  checkConstraints: string[];
  uniqueConstraints: string[];
  indexes: string[];
  rlsEnabled: boolean;
  policies: number;
  directGrants: string;
  existingRpcCoverage: string;
  sourceRegistryReusable: boolean;
  sourceVersionReusable: boolean;
  passageReusable: boolean;
  handlingModeReusable: boolean;
  requiresExtension: boolean;
  classification: ExistingClassification;
}

const CAPABILITIES: ExistingCapability[] = [
  {
    tableName: "knowledge_trust_domains",
    purpose: "bounded DE/EU/foreign trust-domain identity",
    primaryKey: "id uuid",
    importantColumns: ["code", "name", "review_status", "active_from", "active_until"],
    foreignKeys: [],
    checkConstraints: ["code bounded to eu/de/sk/cz/pl/hu", "review_status bounded"],
    uniqueConstraints: ["code"],
    indexes: ["unique code"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_jurisdictions",
    purpose: "hierarchical federal/Land/municipality/authority jurisdiction",
    primaryKey: "id uuid",
    importantColumns: ["jurisdiction_level", "jurisdiction_code", "country_code", "parent_jurisdiction_id", "status"],
    foreignKeys: ["parent_jurisdiction_id -> knowledge_jurisdictions.id"],
    checkConstraints: ["jurisdiction_level bounded", "valid period", "status bounded"],
    uniqueConstraints: [],
    indexes: ["parent_jurisdiction_id", "jurisdiction_level"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_territorial_scopes",
    purpose: "reusable territorial applicability and municipality/Land identifiers",
    primaryKey: "id uuid",
    importantColumns: ["scope_type", "jurisdiction_ids", "land_codes", "municipality_codes", "scope_verified"],
    foreignKeys: [],
    checkConstraints: ["valid period", "review_status bounded"],
    uniqueConstraints: [],
    indexes: ["scope_type"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_publishers",
    purpose: "issuing publisher identity, official status, competence and trust domain",
    primaryKey: "id uuid",
    importantColumns: ["publisher_name", "publisher_type", "official_status", "subject_matter_competence"],
    foreignKeys: ["territorial_competence_id -> knowledge_territorial_scopes.id", "trust_domain_id -> knowledge_trust_domains.id"],
    checkConstraints: ["active period", "review_status bounded"],
    uniqueConstraints: [],
    indexes: ["territorial_competence_id", "trust_domain_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_sources",
    purpose: "existing source identity; canonical registry root",
    primaryKey: "id uuid",
    importantColumns: ["publisher_id", "canonical_url", "official_domain", "jurisdiction_id", "territorial_scope_id", "source_language"],
    foreignKeys: ["publisher_id -> knowledge_publishers.id", "jurisdiction_id -> knowledge_jurisdictions.id", "territorial_scope_id -> knowledge_territorial_scopes.id"],
    checkConstraints: ["official_domain_verification_status bounded", "status bounded"],
    uniqueConstraints: [],
    indexes: ["publisher_id", "jurisdiction_id", "territorial_scope_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked; service_role receives no approved direct-DML path",
    existingRpcCoverage: "publication bootstrap/lifecycle only; no registry write RPC",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: true,
    classification: "REUSE_WITH_FORWARD_EXTENSION",
  },
  {
    tableName: "knowledge_source_versions",
    purpose: "immutable successful source-version history",
    primaryKey: "id uuid",
    importantColumns: ["source_id", "version_sequence", "content_hash", "retrieved_at", "effective_from", "effective_until", "locked_at"],
    foreignKeys: ["source_id -> knowledge_sources.id", "supersedes/superseded_by -> knowledge_source_versions.id"],
    checkConstraints: ["positive sequence", "effective/applicable periods", "immutable=true", "no self-supersede"],
    uniqueConstraints: ["source_id + version_sequence"],
    indexes: ["source_id", "review_status", "freshness_status", "effective_from", "effective_until"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none; locked-content trigger exists",
    sourceRegistryReusable: false,
    sourceVersionReusable: true,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: true,
    classification: "REUSE_WITH_FORWARD_EXTENSION",
  },
  {
    tableName: "knowledge_source_passages",
    purpose: "precise passage-level evidence attached to immutable source versions",
    primaryKey: "id uuid",
    importantColumns: ["source_version_id", "passage_order", "heading_path", "text", "text_hash", "language", "citation_ready"],
    foreignKeys: ["source_version_id -> knowledge_source_versions.id"],
    checkConstraints: ["nonnegative passage order", "review_status bounded"],
    uniqueConstraints: ["source_version_id + passage_order"],
    indexes: ["source_version_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none; passage extraction excluded from first slice",
    sourceRegistryReusable: false,
    sourceVersionReusable: false,
    passageReusable: true,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_authorities",
    purpose: "authority instance tied to jurisdiction and territorial scope",
    primaryKey: "id uuid",
    importantColumns: ["publisher_id", "authority_type", "jurisdiction_id", "territorial_scope_id", "status"],
    foreignKeys: ["publisher_id -> knowledge_publishers.id", "jurisdiction_id -> knowledge_jurisdictions.id", "territorial_scope_id -> knowledge_territorial_scopes.id"],
    checkConstraints: ["status bounded", "review_status bounded"],
    uniqueConstraints: [],
    indexes: ["publisher_id", "jurisdiction_id", "territorial_scope_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_authority_competences",
    purpose: "effective-dated, evidence-supported authority competence",
    primaryKey: "id uuid",
    importantColumns: ["authority_id", "subject_matter", "territorial_scope_id", "competence_source_version_id", "effective_from", "effective_until"],
    foreignKeys: ["authority_id -> knowledge_authorities.id", "territorial_scope_id -> knowledge_territorial_scopes.id", "source/passages evidence"],
    checkConstraints: ["effective period", "review/conflict status bounded"],
    uniqueConstraints: ["authority + subject + territorial scope + effective_from"],
    indexes: ["authority_id", "territorial_scope_id", "competence_source_version_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "PUBLIC/anon/authenticated revoked",
    existingRpcCoverage: "publication and translation lifecycle only",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_claims",
    purpose: "future canonical German claim content",
    primaryKey: "id uuid",
    importantColumns: ["claim_type", "claim_text_canonical", "jurisdiction_id", "risk_level", "effective_from", "effective_until"],
    foreignKeys: ["jurisdiction/territorial scope/authority"],
    checkConstraints: ["German/DE canonical", "risk/review/freshness/status bounded"],
    uniqueConstraints: [],
    indexes: ["jurisdiction", "claim_type", "risk", "review"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "publication/translation lifecycle only",
    sourceRegistryReusable: false,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "NOT_RELEVANT_TO_FIRST_SLICE",
  },
  {
    tableName: "knowledge_claim_evidence_links",
    purpose: "future candidate/claim evidence verification",
    primaryKey: "id uuid",
    importantColumns: ["claim_id", "source_version_id", "passage_id", "support_status", "jurisdiction_match", "effective_date_match"],
    foreignKeys: ["claim/source_version/passage"],
    checkConstraints: ["support/conflict statuses bounded"],
    uniqueConstraints: ["claim + passage + evidence role"],
    indexes: ["claim", "source version", "passage", "support status"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: false,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "NOT_RELEVANT_TO_FIRST_SLICE",
  },
  {
    tableName: "knowledge_review_records",
    purpose: "append-oriented review evidence for source and authority decisions",
    primaryKey: "id uuid",
    importantColumns: ["entity_type", "entity_id", "review_status", "review_level", "reviewer_type", "reviewed_at"],
    foreignKeys: ["supersedes_review_record_id -> knowledge_review_records.id"],
    checkConstraints: ["entity/review status bounded"],
    uniqueConstraints: [],
    indexes: ["entity", "review_status"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "referenced by publication/translation approval",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_freshness_records",
    purpose: "append-oriented freshness and source-change observations",
    primaryKey: "id uuid",
    importantColumns: ["entity_type", "entity_id", "freshness_status", "next_check_due_at", "content_hash_matches"],
    foreignKeys: [],
    checkConstraints: ["entity/freshness/change status bounded"],
    uniqueConstraints: [],
    indexes: ["entity", "freshness_status"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: true,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_conflicts",
    purpose: "persistent material source/authority/effective-date conflict tracking",
    primaryKey: "id uuid",
    importantColumns: ["conflict_type", "source_version_ids", "jurisdiction_ids", "status", "severity", "blocks_high_risk_use"],
    foreignKeys: ["review_record_id -> knowledge_review_records.id"],
    checkConstraints: ["status/severity bounded"],
    uniqueConstraints: [],
    indexes: ["status", "review_record_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "publication suspension can react; no conflict write RPC",
    sourceRegistryReusable: true,
    sourceVersionReusable: true,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_audit_events",
    purpose: "PII-excluding source registry observability",
    primaryKey: "id uuid",
    importantColumns: ["event_type", "entity_type", "entity_id", "actor_type", "previous_state_hash", "new_state_hash", "user_content_included"],
    foreignKeys: ["review_record_id -> knowledge_review_records.id"],
    checkConstraints: ["entity type bounded", "user_content_included=false"],
    uniqueConstraints: [],
    indexes: ["entity", "review_record_id"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: true,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: false,
    classification: "REUSE_AS_IS",
  },
  {
    tableName: "knowledge_retrieval_metadata",
    purpose: "future retrieval filtering; not a handling-policy model today",
    primaryKey: "id uuid",
    importantColumns: ["entity_type", "entity_id", "jurisdiction_filter_required", "effective_date_filter_required", "review_status_filter_required"],
    foreignKeys: [],
    checkConstraints: ["filter flags true", "authoritative_by_vector_similarity=false"],
    uniqueConstraints: ["entity_type + entity_id"],
    indexes: ["unique entity"],
    rlsEnabled: true,
    policies: 0,
    directGrants: "revoked",
    existingRpcCoverage: "none",
    sourceRegistryReusable: false,
    sourceVersionReusable: false,
    passageReusable: false,
    handlingModeReusable: false,
    requiresExtension: true,
    classification: "REUSE_WITH_FORWARD_EXTENSION",
  },
];

type FieldSource = "CALLER_VALIDATED" | "DATABASE_DERIVED" | "REVIEW_OPERATION";

interface RegistryField {
  field: string;
  table: string;
  pgType: string;
  nullable: boolean;
  defaultValue: string;
  constraint: string;
  source: FieldSource;
  mutable: string;
  index: string;
}

const REGISTRY_FIELDS: RegistryField[] = [
  ["source_id", "knowledge_sources", "uuid", false, "gen_random_uuid()", "primary key existing", "DATABASE_DERIVED", "immutable", "primary key"],
  ["canonical_url", "knowledge_sources", "text", true, "null in draft", "URL validation in RPC; required before authorization", "CALLER_VALIDATED", "history-preserving update", "normalized URL unique index"],
  ["normalized_origin", "knowledge_sources", "text", true, "null in draft", "lowercase https origin; required before authorization", "DATABASE_DERIVED", "history-preserving update", "btree"],
  ["source_class", "knowledge_sources", "knowledge_source_class", false, "none", "PostgreSQL enum", "CALLER_VALIDATED", "reviewed metadata update", "btree"],
  ["evidence_eligibility", "knowledge_sources", "knowledge_source_evidence_eligibility", false, "DISCOVERY_ONLY", "discovery classes cannot be PUBLICATION_EVIDENCE_ELIGIBLE", "DATABASE_DERIVED", "review operation only", "btree"],
  ["issuing_authority", "knowledge_sources", "uuid", true, "null", "FK knowledge_authorities(id); required by applicable classes", "CALLER_VALIDATED", "history-preserving review", "btree"],
  ["authority_level", "knowledge_sources", "knowledge_authority_level", false, "none", "enum and jurisdiction consistency in RPC", "CALLER_VALIDATED", "history-preserving review", "btree"],
  ["jurisdiction_country", "knowledge_jurisdictions", "text", true, "existing country_code", "existing hierarchy", "CALLER_VALIDATED", "separate jurisdiction workflow", "existing"],
  ["jurisdiction_region", "knowledge_jurisdictions", "uuid", true, "parent hierarchy", "FK via source.jurisdiction_id", "DATABASE_DERIVED", "source assignment history", "existing"],
  ["jurisdiction_municipality", "knowledge_territorial_scopes", "text[]", true, "existing municipality_codes", "municipality class requires verified municipality", "DATABASE_DERIVED", "scope workflow", "existing"],
  ["official_status", "knowledge_publishers", "boolean", false, "false", "existing; never equals claim verification", "REVIEW_OPERATION", "publisher review", "existing"],
  ["content_language", "knowledge_sources", "text", false, "existing source_language", "bounded length and BCP-47 validation in RPC", "CALLER_VALIDATED", "metadata update", "btree optional"],
  ["process_scope", "knowledge_sources", "text[]", false, "'{}'", "bounded process group values in RPC", "CALLER_VALIDATED", "history-preserving update", "GIN"],
  ["retrieval_method", "knowledge_sources", "knowledge_retrieval_method", false, "HTML_DOCUMENT", "PostgreSQL enum", "CALLER_VALIDATED", "metadata update", "btree"],
  ["terms_or_license_review_status", "knowledge_sources", "knowledge_access_review_status", false, "NOT_REVIEWED", "independent enum status", "REVIEW_OPERATION", "terms review RPC only", "btree"],
  ["robots_review_status", "knowledge_sources", "knowledge_access_review_status", false, "NOT_REVIEWED", "independent enum status", "REVIEW_OPERATION", "robots review RPC only", "btree"],
  ["first_verified_at", "knowledge_sources", "timestamptz", true, "null", "set on first successful authority verification", "DATABASE_DERIVED", "write-once", "none"],
  ["last_verified_at", "knowledge_sources", "timestamptz", true, "null", "set by verification operation", "DATABASE_DERIVED", "verification operation", "revalidation queue"],
  ["active_status", "knowledge_sources", "knowledge_source_active_status", false, "ACTIVE", "separate from authorization state", "DATABASE_DERIVED", "lifecycle operation", "btree"],
  ["trust_status", "knowledge_sources", "knowledge_source_trust_status", false, "UNVERIFIED", "enum", "REVIEW_OPERATION", "history-preserving review", "btree"],
  ["authorization_state", "knowledge_sources", "knowledge_source_authorization_state", false, "DRAFT", "state machine only", "DATABASE_DERIVED", "transition RPC only", "btree"],
  ["authorization_version", "knowledge_sources", "integer", false, "1", "> 0", "DATABASE_DERIVED", "increment only", "none"],
  ["default_handling_mode", "knowledge_sources", "knowledge_handling_mode", false, "MANUAL_REVIEW_REQUIRED", "source default only; policy override wins", "CALLER_VALIDATED", "handling policy operation", "btree"],
  ["freshness_class", "knowledge_sources", "knowledge_freshness_class", false, "MANUAL_REVIEW_CYCLE", "enum", "CALLER_VALIDATED", "handling policy operation", "revalidation queue"],
  ["stale_behavior", "knowledge_sources", "knowledge_stale_behavior", false, "REVALIDATE_BEFORE_USE", "high-risk override cannot permit stale use", "CALLER_VALIDATED", "handling policy operation", "btree"],
].map(
  ([field, table, pgType, nullable, defaultValue, constraint, source, mutable, index]) => ({
    field: field as string,
    table: table as string,
    pgType: pgType as string,
    nullable: nullable as boolean,
    defaultValue: defaultValue as string,
    constraint: constraint as string,
    source: source as FieldSource,
    mutable: mutable as string,
    index: index as string,
  })
);

const HANDLING_MODES = [
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
] as const;
const SOURCE_CLASSES = [
  "FEDERAL_LAW", "FEDERAL_REGULATION", "FEDERAL_ADMINISTRATIVE_GUIDANCE", "EU_LAW",
  "EU_OFFICIAL_GUIDANCE", "FEDERAL_SERVICE_PORTAL", "LAND_SERVICE_PORTAL",
  "MUNICIPALITY_SERVICE_PORTAL", "AUTHORITY_PORTAL", "OFFICIAL_FORM",
  "OFFICIAL_ONLINE_SERVICE", "OFFICIAL_DATASET", "COMMERCIAL_GUIDE", "BLOG", "FORUM",
  "SEARCH_RESULT_SNIPPET", "AI_GENERATED_TEXT",
] as const;
const DISCOVERY_CLASSES = ["COMMERCIAL_GUIDE", "BLOG", "FORUM", "SEARCH_RESULT_SNIPPET", "AI_GENERATED_TEXT"] as const;
const AUTH_STATES = [
  "DRAFT",
  "PENDING_TERMS_REVIEW",
  "PENDING_AUTHORITY_VERIFICATION",
  "AUTHORIZED",
  "SUSPENDED",
  "REJECTED",
  "RETIRED",
] as const;
const AUTH_EDGES = [
  "DRAFT->PENDING_TERMS_REVIEW",
  "DRAFT->REJECTED",
  "PENDING_TERMS_REVIEW->PENDING_AUTHORITY_VERIFICATION",
  "PENDING_TERMS_REVIEW->REJECTED",
  "PENDING_AUTHORITY_VERIFICATION->AUTHORIZED",
  "PENDING_AUTHORITY_VERIFICATION->REJECTED",
  "AUTHORIZED->SUSPENDED",
  "AUTHORIZED->RETIRED",
  "SUSPENDED->AUTHORIZED",
  "SUSPENDED->RETIRED",
  "REJECTED->RETIRED",
] as const;
const CONTEXT_KEYS = [
  "country", "Bundesland", "municipality", "process_variant", "event_date", "residence_state",
  "work_state", "profession", "business_establishment_state", "main_or_secondary_residence",
] as const;

const PLANNED_ENUMS = [
  "knowledge_handling_mode",
  "knowledge_source_class",
  "knowledge_source_evidence_eligibility",
  "knowledge_authority_level",
  "knowledge_source_authorization_state",
  "knowledge_access_review_status",
  "knowledge_source_active_status",
  "knowledge_source_trust_status",
  "knowledge_freshness_class",
  "knowledge_stale_behavior",
  "knowledge_retrieval_method",
  "knowledge_source_change_classification",
  "knowledge_acquisition_result",
  "knowledge_information_class",
  "knowledge_required_context_key",
] as const;
const TABLES_CREATED = [
  "knowledge_source_authorization_transitions",
  "knowledge_source_registry_history",
  "knowledge_source_handling_policies",
  "knowledge_source_acquisition_attempts",
] as const;
const TABLES_ALTERED = ["knowledge_sources", "knowledge_source_versions", "knowledge_retrieval_metadata"] as const;
const CONSTRAINTS = [
  "sources_authority_fk",
  "sources_authorized_fields_complete",
  "sources_discovery_class_ineligible",
  "sources_municipality_requires_scope",
  "sources_authorization_version_positive",
  "source_versions_acquisition_attempt_fk",
  "source_versions_normalized_hash_length",
  "authorization_transition_source_fk",
  "authorization_transition_version_coupling",
  "authorization_transition_state_change",
  "registry_history_source_fk",
  "registry_history_resulting_version_positive",
  "handling_policy_source_fk",
  "handling_policy_scope_unique",
  "handling_policy_context_required",
  "handling_policy_high_risk_no_stale",
  "acquisition_attempt_source_fk",
  "acquisition_attempt_content_length_nonnegative",
  "acquisition_attempt_http_status_range",
  "acquisition_attempt_success_metadata",
  "acquisition_attempt_idempotency_nonempty",
  "authorization_transition_idempotency_nonempty",
] as const;
const INDEXES = [
  "ux_sources_normalized_canonical_url",
  "ix_sources_normalized_origin",
  "ix_sources_source_class",
  "ix_sources_authorization_state",
  "ix_sources_evidence_eligibility",
  "ix_sources_revalidation_due",
  "ux_source_authorization_transition_version",
  "ux_source_authorization_transition_idempotency",
  "ix_source_authorization_transition_source_created",
  "ix_registry_history_source_created",
  "ux_handling_policy_scope",
  "ix_handling_policy_revalidation",
  "ix_handling_policy_mode",
  "ux_acquisition_attempt_idempotency",
  "ix_acquisition_attempt_source_retrieved",
  "ix_source_versions_acquisition_attempt",
] as const;

interface RpcPlan {
  name: string;
  purpose: string;
  callerRole: "service_role";
  arguments: string[];
  databaseDerivedFields: string[];
  returnShape: string;
  idempotencyKey: boolean;
  expectedVersion: boolean;
  allowedSourceStates: string[];
  resultingSourceState: string;
  historyWritten: string;
}

type RpcTuple = [
  string,
  string,
  string[],
  string[],
  string,
  boolean,
  boolean,
  string[],
  string,
  string,
];

const RPC_TUPLES: RpcTuple[] = [
  ["knowledge_register_official_source", "register one source in DRAFT", ["canonical URL candidate", "publisher/jurisdiction/authority identifiers", "source class", "language", "retrieval method", "actor audit identifier", "idempotency key"], ["normalized URL/origin", "evidence eligibility", "actor class", "state/version"], "source_id, state, version", true, false, ["ABSENT"], "DRAFT", "authorization transition + registry history"],
  ["knowledge_update_official_source_metadata", "bounded metadata update without authority escalation", ["source id", "expected version", "allowed metadata patch fields", "reason", "actor audit identifier", "idempotency key"], ["normalized URL/origin", "evidence eligibility", "actor class"], "source_id, state, version", true, true, ["DRAFT", "PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION", "SUSPENDED"], "UNCHANGED", "registry history"],
  ["knowledge_record_source_terms_review", "record independent terms/license decision", ["source id", "expected version", "decision", "review record id", "reason", "actor audit identifier", "idempotency key"], ["actor class", "first/last verified timestamps"], "source_id, state, version", true, true, ["DRAFT", "PENDING_TERMS_REVIEW"], "PENDING_TERMS_REVIEW_OR_UNCHANGED", "registry history + audit event"],
  ["knowledge_record_source_robots_review", "record robots decision independently of legal terms", ["source id", "expected version", "decision", "review record id", "reason", "actor audit identifier", "idempotency key"], ["actor class"], "source_id, state, version", true, true, ["DRAFT", "PENDING_TERMS_REVIEW"], "PENDING_TERMS_REVIEW_OR_UNCHANGED", "registry history + audit event"],
  ["knowledge_record_source_authority_verification", "verify publisher/authority/jurisdiction alignment", ["source id", "expected version", "authority id", "authority level", "review record id", "reason", "actor audit identifier", "idempotency key"], ["jurisdiction consistency", "actor class", "last_verified_at"], "source_id, state, version", true, true, ["PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION"], "PENDING_AUTHORITY_VERIFICATION", "authorization transition + registry history"],
  ["knowledge_authorize_official_source", "authorize evidence-eligible acquisition after all reviews", ["source id", "expected version", "review record id", "reason", "actor audit identifier", "idempotency key"], ["evidence eligibility", "actor class"], "source_id, AUTHORIZED, version", true, true, ["PENDING_AUTHORITY_VERIFICATION", "SUSPENDED"], "AUTHORIZED", "authorization transition"],
  ["knowledge_suspend_official_source", "stop new evidence use without deleting history", ["source id", "expected version", "reason", "actor audit identifier", "idempotency key"], ["actor class", "active/trust state"], "source_id, SUSPENDED, version", true, true, ["AUTHORIZED"], "SUSPENDED", "authorization transition"],
  ["knowledge_reject_official_source", "reject a pending source while preserving auditability", ["source id", "expected version", "reason", "review record id", "actor audit identifier", "idempotency key"], ["actor class"], "source_id, REJECTED, version", true, true, ["DRAFT", "PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION"], "REJECTED", "authorization transition"],
  ["knowledge_retire_official_source", "retire source identity while retaining versions", ["source id", "expected version", "reason", "actor audit identifier", "idempotency key"], ["actor class", "active status"], "source_id, RETIRED, version", true, true, ["AUTHORIZED", "SUSPENDED", "REJECTED"], "RETIRED", "authorization transition"],
  ["knowledge_assign_source_handling_policy", "assign source + information class + process scope policy", ["source id", "information class", "process scope", "mode", "freshness", "stale behavior", "risk", "required context keys", "expected policy version", "reason", "actor audit identifier", "idempotency key"], ["actor class", "revalidation due"], "policy_id, version", true, true, ["DRAFT", "PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION", "AUTHORIZED", "SUSPENDED"], "SOURCE_STATE_UNCHANGED", "registry history + audit event"],
  ["knowledge_record_source_acquisition_attempt", "append metadata for a future synthetic/retrieval attempt; never create a source version on failure", ["source id", "retrieval result metadata", "actor audit identifier", "idempotency key"], ["attempt id", "actor class", "created timestamp"], "acquisition_attempt_id, result", true, false, ["AUTHORIZED"], "SOURCE_STATE_UNCHANGED", "audit event"],
];

const RPCS: RpcPlan[] = RPC_TUPLES.map(([name, purpose, rpcArguments, databaseDerivedFields, returnShape, idempotencyKey, expectedVersion, allowedSourceStates, resultingSourceState, historyWritten]) => ({
  name: name as string,
  purpose: purpose as string,
  callerRole: "service_role",
  arguments: rpcArguments,
  databaseDerivedFields: databaseDerivedFields as string[],
  returnShape: returnShape as string,
  idempotencyKey: idempotencyKey as boolean,
  expectedVersion: expectedVersion as boolean,
  allowedSourceStates: allowedSourceStates as string[],
  resultingSourceState: resultingSourceState as string,
  historyWritten: historyWritten as string,
}));

interface ImplementationPhase {
  phase: string;
  objective: string;
  files: string[];
  outputs: string[];
  prohibited: string[];
  validationGate: string;
  dependency: string;
}

const PHASES: ImplementationPhase[] = [
  {
    phase: "9R",
    objective: "Implement migration 035 and its static implementation audit.",
    files: [
      "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
      "lib/vaylo/smart-talk/knowledge/de/run-official-source-registry-and-handling-mode-migration-implementation-audit.ts",
    ],
    outputs: ["15 enums", "4 tables", "3 extensions", "11 grantable RPCs", "1 internal engine"],
    prohibited: ["real sources", "generated types", "runtime code", "Smart Talk route edits"],
    validationGate: "static inventory, ACL, state matrix, ambiguity and tamper audit",
    dependency: "9Q",
  },
  {
    phase: "9S",
    objective: "Validate 001→035 on disposable PostgreSQL 17.",
    files: [
      "lib/vaylo/smart-talk/knowledge/de/run-official-source-registry-isolated-postgresql-validation-audit.ts",
    ],
    outputs: ["full 49-cell authorization matrix", "concurrency/idempotency/RLS/security evidence"],
    prohibited: ["remote database", "real source acquisition", "repairing migration 035 in-place"],
    validationGate: ">=25 positive and >=100 negative runtime cases; exit 0",
    dependency: "9R",
  },
  {
    phase: "9T",
    objective: "Introduce generated full database types plus bounded manual source-registry literals.",
    files: [
      "lib/supabase/database.types.ts",
      "lib/vaylo/smart-talk/knowledge/source-registry/domain.ts",
      "lib/vaylo/smart-talk/knowledge/source-registry/database-surface.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-source-registry-generated-type-surface-audit.ts",
    ],
    outputs: ["locally generated Database type", "manual enum/domain literals", "internal function exclusions"],
    prohibited: ["linked project", "production generation", "runtime retrieval"],
    validationGate: "generated diff matches disposable 001→035 schema and narrow surfaces omit internal engine",
    dependency: "9S",
  },
  {
    phase: "9U",
    objective: "Implement server-only registry contracts and typed narrow RPC client.",
    files: [
      "lib/vaylo/smart-talk/knowledge/source-registry/contracts.ts",
      "lib/vaylo/smart-talk/knowledge/source-registry/server.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-source-registry-server-contract-audit.ts",
    ],
    outputs: ["server-only RPC adapter", "input bounds", "typed failures"],
    prohibited: ["direct DML", "browser import", "retrieval/download", "Smart Talk route edits"],
    validationGate: "server-only import graph, RPC allowlist and synthetic adapter tests",
    dependency: "9T",
  },
  {
    phase: "9V",
    objective: "Close the first slice with synthetic registry end-to-end validation.",
    files: [
      "lib/vaylo/smart-talk/knowledge/de/run-synthetic-source-registry-end-to-end-closure-audit.ts",
    ],
    outputs: ["synthetic register/review/authorize/suspend/retire/policy evidence"],
    prohibited: ["real domains", "real German facts", "live retrieval", "AI extraction"],
    validationGate: "all synthetic scenarios pass with clean rollback and no residual database/container",
    dependency: "9U",
  },
];

interface FilePlan {
  path: string;
  phase: string;
  createOrModify: "CREATE" | "GENERATE";
  purpose: string;
  serverOnly: boolean;
  generated: boolean;
  sourceOfTruth: string;
}

const FILE_PLAN: FilePlan[] = PHASES.flatMap((phase) =>
  phase.files.map((file) => ({
    path: file,
    phase: phase.phase,
    createOrModify: file === "lib/supabase/database.types.ts" ? "GENERATE" : "CREATE",
    purpose: phase.objective,
    serverOnly: file.includes("/source-registry/server.ts") || file.includes("/database-surface.ts"),
    generated: file === "lib/supabase/database.types.ts",
    sourceOfTruth: file === "lib/supabase/database.types.ts" ? "disposable PostgreSQL 17 migration chain 001→035" : "9Q contract + migration/schema evidence",
  }))
);

const VALIDATION_SCENARIOS = [
  "register valid synthetic federal source",
  "register municipality source",
  "register discovery-only source",
  "duplicate URL registration",
  "equivalent normalized URL collision",
  "unauthorized domain",
  "municipality source without municipality",
  "federal source with municipality-only authority",
  "discovery-only source used as evidence",
  "terms review pending",
  "robots review pending",
  "authorize valid source",
  "suspend authorized source",
  "retire source with historical versions",
  "stale expected version",
  "duplicate idempotency key",
  "handling-mode override by information class",
  "high-risk stale policy set incorrectly",
  "direct service-role DML attempt",
  "anon RPC invocation",
  "authenticated RPC invocation",
  "generic internal engine invocation",
  "schema-shadowing attempt",
  "history update/delete",
  "transaction rollback",
] as const;

const FAILURES = [
  "SOURCE_URL_INVALID",
  "SOURCE_ORIGIN_NOT_ALLOWED",
  "SOURCE_ALREADY_EXISTS",
  "SOURCE_CLASS_INVALID",
  "SOURCE_JURISDICTION_INVALID",
  "SOURCE_AUTHORITY_MISMATCH",
  "SOURCE_TERMS_REVIEW_REQUIRED",
  "SOURCE_ROBOTS_REVIEW_REQUIRED",
  "SOURCE_STATE_TRANSITION_INVALID",
  "SOURCE_VERSION_CONFLICT",
  "SOURCE_IDEMPOTENCY_CONFLICT",
  "HANDLING_MODE_INVALID",
  "HANDLING_POLICY_CONFLICT",
  "DISCOVERY_SOURCE_EVIDENCE_FORBIDDEN",
  "DIRECT_DML_FORBIDDEN",
] as const;

interface Result {
  checkId: "9Q";
  phase: string;
  allPassed: boolean;
  blocked: boolean;
  blockReason: string;
  outcome:
    | "PASSED"
    | "BLOCKED — SCHEMA CAPABILITY CONFLICT"
    | "BLOCKED — IMPLEMENTATION PLAN INCOMPLETE"
    | "BLOCKED — SECURITY PLAN CONFLICT"
    | "BLOCKED — REPOSITORY STATE";
  sourceCommit: string;
  sourceMigration032: string;
  sourceMigration033: string;
  sourceMigration034: string;
  sourcePhase9PAudit: string;
  sourcePhase9OAudit: string;
  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  unexpectedRepositoryPaths: string[];
  relevantExistingTableCount: number;
  reusableAsIsTableCount: number;
  reusableWithExtensionTableCount: number;
  newObjectRequiredCount: number;
  existingSchemaCapabilityMatrixComplete: boolean;
  existingSchemaCapabilityMatrix: ExistingCapability[];
  schemaChangeRequired: true;
  schemaGapDecision: "NEW_FORWARD_MIGRATION_REQUIRED";
  proposedMigration: string;
  migrationStrategy: "CREATE_AND_ALTER";
  plannedEnumsAdded: number;
  plannedEnumNames: readonly string[];
  plannedTablesCreated: number;
  plannedTableNamesCreated: readonly string[];
  plannedTablesAltered: number;
  plannedTableNamesAltered: readonly string[];
  plannedConstraintsAdded: number;
  plannedConstraintNames: readonly string[];
  plannedIndexesAdded: number;
  plannedIndexNames: readonly string[];
  plannedTriggersAdded: number;
  plannedFunctionsAdded: number;
  plannedFunctionsReplaced: number;
  plannedRlsEnabledTables: number;
  plannedPoliciesAdded: number;
  plannedGrantableRpcs: number;
  plannedInternalFunctions: number;
  registryFieldPlan: RegistryField[];
  handlingModeStorageStrategy: "POSTGRESQL_ENUM";
  sourceClassStorageStrategy: "POSTGRESQL_ENUM_WITH_DERIVED_EVIDENCE_ELIGIBILITY";
  handlingModes: readonly string[];
  sourceClasses: readonly string[];
  discoveryOnlyClasses: readonly string[];
  handlingAssignmentGranularity: string;
  requiredContextStorageStrategy: "BOUNDED_POSTGRESQL_ENUM_ARRAY";
  requiredContextKeys: readonly string[];
  sourceAuthorizationLifecycleRequired: true;
  sourceAuthorizationStates: readonly string[];
  sourceAuthorizationStateCount: number;
  sourceAuthorizationAllowedEdges: readonly string[];
  sourceAuthorizationMatrixCellCount: number;
  sourceAuthorizationAllowedCellCount: number;
  sourceAuthorizationForbiddenCellCount: number;
  sourceAuthorizationTransitionMatrixComplete: boolean;
  sourceAuthorizationHistoryRequired: true;
  sourceRegistryContractPlanned: boolean;
  sourceAuthorizationContractPlanned: boolean;
  handlingModeContractPlanned: boolean;
  freshnessContractPlanned: boolean;
  staleBehaviorContractPlanned: boolean;
  jurisdictionContractPlanned: boolean;
  termsReviewContractPlanned: boolean;
  robotsReviewContractPlanned: boolean;
  idempotencyContractPlanned: boolean;
  optimisticConcurrencyContractPlanned: boolean;
  historyImmutabilityContractPlanned: boolean;
  observabilityContractPlanned: boolean;
  failureTaxonomyPlanned: boolean;
  plannedRpcs: RpcPlan[];
  directServiceRoleDmlAllowed: false;
  anonDirectAccessAllowed: false;
  authenticatedDirectAccessAllowed: false;
  publicExecuteAllowed: false;
  narrowSecurityDefinerRpcRequired: true;
  internalGenericEngineGrantable: false;
  securityDefinerRequirements: readonly string[];
  idempotencyModel: string;
  urlNormalizationModel: string;
  historyModel: string;
  termsRobotsModel: string;
  retentionModel: Record<string, string>;
  observabilityEvents: readonly string[];
  failureTaxonomy: readonly string[];
  generatedTypesIntroducedInImplementation: true;
  fullGeneratedTypePath: "lib/supabase/database.types.ts";
  generatedTypeGenerationMethod: string;
  fullGeneratedDatabaseTypeRequired: true;
  manualDomainTypesRequired: true;
  manualDomainTypePath: string;
  publicClientNarrowSurfaceRequired: true;
  serverIngestionSurfaceRequired: true;
  serverRuntimeReadSurfaceRequired: true;
  applicationCallableSurfaceOmitsInternalFunctions: true;
  runtimeRetrievalImplementedNow: false;
  realSourceAcquisitionImplementedNow: false;
  realSourceContentStoredNow: false;
  aiExtractionImplementedNow: false;
  databaseWritePerformed: false;
  databaseSchemaModified: false;
  generatedTypesCreated: false;
  immediateScopeIncludes: readonly string[];
  immediateScopeExcludes: readonly string[];
  runtimeReadConcepts: Array<{ name: string; classification: string }>;
  databaseObjectAccessPlan: Array<Record<string, string | boolean>>;
  plannedImplementationPhaseCount: number;
  plannedImplementationPhases: ImplementationPhase[];
  implementationFilePlan: FilePlan[];
  implementationFilePlanComplete: boolean;
  isolatedPostgresqlValidationPlanned: true;
  plannedPostgresqlMajorVersion: 17;
  plannedPositiveRuntimeCaseMinimum: number;
  plannedNegativeTamperCaseMinimum: number;
  fullAuthorizationMatrixPlanned: boolean;
  concurrencyValidationPlanned: boolean;
  schemaShadowingValidationPlanned: boolean;
  rollbackValidationPlanned: boolean;
  validationScenarios: readonly string[];
  planTamperCaseCount: number;
  planTamperCasesRejected: number;
  readyForOfficialSourceRegistrySchemaMigration: boolean;
  readyForRealSourceAcquisition: false;
  readyForLiveRetrieval: false;
  recommendedNextPhase: string;
  evidence: string[];
}

function repositoryScope(): { head: string; valid: boolean; unexpected: string[] } {
  const unexpected: string[] = [];
  for (const line of git(["status", "--porcelain"]).split("\n")) {
    if (!line.trim()) continue;
    const file = line.slice(3).trim().replace(/^"|"$/g, "");
    if (file.startsWith(".next/") || file.startsWith("node_modules/")) continue;
    if (!line.slice(0, 2).includes("?") || file !== SELF) unexpected.push(file);
  }
  return { head: git(["rev-parse", "--short", "HEAD"]), valid: unexpected.length === 0, unexpected };
}

function build(): Result {
  const sql032 = read(M032);
  const sql033 = read(M033);
  const sql034 = read(M034);
  const contract9P = read(A9P);
  const contract9O = read(A9O);
  const repo = repositoryScope();
  const missingMandatoryFields = [
    "normalized_origin",
    "source_class",
    "authority_level",
    "default_handling_mode",
    "terms_or_license_review_status",
    "robots_review_status",
    "freshness_class",
    "stale_behavior",
    "authorization_state",
    "authorization_version",
  ].filter((field) => !new RegExp(`\\b${field}\\b`).test(sql032));

  const result: Result = {
    checkId: "9Q",
    phase: PHASE,
    allPassed: false,
    blocked: false,
    blockReason: "",
    outcome: "PASSED",
    sourceCommit: repo.head,
    sourceMigration032: M032,
    sourceMigration033: M033,
    sourceMigration034: M034,
    sourcePhase9PAudit: A9P,
    sourcePhase9OAudit: A9O,
    workingTreeCleanBeforePhase: repo.valid,
    repositoryScopeValid: repo.valid,
    unexpectedRepositoryPaths: repo.unexpected,
    relevantExistingTableCount: CAPABILITIES.length,
    reusableAsIsTableCount: CAPABILITIES.filter((item) => item.classification === "REUSE_AS_IS").length,
    reusableWithExtensionTableCount: CAPABILITIES.filter((item) => item.classification === "REUSE_WITH_FORWARD_EXTENSION").length,
    newObjectRequiredCount: TABLES_CREATED.length,
    existingSchemaCapabilityMatrixComplete:
      CAPABILITIES.length === 16 &&
      CAPABILITIES.every((item) => item.tableName && item.primaryKey && item.rlsEnabled && item.classification),
    existingSchemaCapabilityMatrix: CAPABILITIES,
    schemaChangeRequired: true,
    schemaGapDecision: "NEW_FORWARD_MIGRATION_REQUIRED",
    proposedMigration: MIGRATION,
    migrationStrategy: "CREATE_AND_ALTER",
    plannedEnumsAdded: PLANNED_ENUMS.length,
    plannedEnumNames: PLANNED_ENUMS,
    plannedTablesCreated: TABLES_CREATED.length,
    plannedTableNamesCreated: TABLES_CREATED,
    plannedTablesAltered: TABLES_ALTERED.length,
    plannedTableNamesAltered: TABLES_ALTERED,
    plannedConstraintsAdded: CONSTRAINTS.length,
    plannedConstraintNames: CONSTRAINTS,
    plannedIndexesAdded: INDEXES.length,
    plannedIndexNames: INDEXES,
    plannedTriggersAdded: 2,
    plannedFunctionsAdded: RPCS.length + 1,
    plannedFunctionsReplaced: 1,
    plannedRlsEnabledTables: TABLES_CREATED.length,
    plannedPoliciesAdded: 0,
    plannedGrantableRpcs: RPCS.length,
    plannedInternalFunctions: 1,
    registryFieldPlan: REGISTRY_FIELDS,
    handlingModeStorageStrategy: "POSTGRESQL_ENUM",
    sourceClassStorageStrategy: "POSTGRESQL_ENUM_WITH_DERIVED_EVIDENCE_ELIGIBILITY",
    handlingModes: HANDLING_MODES,
    sourceClasses: SOURCE_CLASSES,
    discoveryOnlyClasses: DISCOVERY_CLASSES,
    handlingAssignmentGranularity:
      "source default plus normalized source_id + information_class + process_scope policy override; one source record is never duplicated per mode",
    requiredContextStorageStrategy: "BOUNDED_POSTGRESQL_ENUM_ARRAY",
    requiredContextKeys: CONTEXT_KEYS,
    sourceAuthorizationLifecycleRequired: true,
    sourceAuthorizationStates: AUTH_STATES,
    sourceAuthorizationStateCount: AUTH_STATES.length,
    sourceAuthorizationAllowedEdges: AUTH_EDGES,
    sourceAuthorizationMatrixCellCount: AUTH_STATES.length * AUTH_STATES.length,
    sourceAuthorizationAllowedCellCount: AUTH_EDGES.length,
    sourceAuthorizationForbiddenCellCount: AUTH_STATES.length * AUTH_STATES.length - AUTH_EDGES.length,
    sourceAuthorizationTransitionMatrixComplete: true,
    sourceAuthorizationHistoryRequired: true,
    sourceRegistryContractPlanned: REGISTRY_FIELDS.length >= 25,
    sourceAuthorizationContractPlanned: AUTH_STATES.length === 7 && AUTH_EDGES.length === 11,
    handlingModeContractPlanned: HANDLING_MODES.length === 5,
    freshnessContractPlanned: PLANNED_ENUMS.includes("knowledge_freshness_class"),
    staleBehaviorContractPlanned: PLANNED_ENUMS.includes("knowledge_stale_behavior"),
    jurisdictionContractPlanned: true,
    termsReviewContractPlanned: true,
    robotsReviewContractPlanned: true,
    idempotencyContractPlanned: RPCS.every((rpc) => rpc.idempotencyKey),
    optimisticConcurrencyContractPlanned: RPCS.filter((rpc) => !["knowledge_register_official_source", "knowledge_record_source_acquisition_attempt"].includes(rpc.name)).every((rpc) => rpc.expectedVersion),
    historyImmutabilityContractPlanned: true,
    observabilityContractPlanned: true,
    failureTaxonomyPlanned: FAILURES.length === 15,
    plannedRpcs: RPCS,
    directServiceRoleDmlAllowed: false,
    anonDirectAccessAllowed: false,
    authenticatedDirectAccessAllowed: false,
    publicExecuteAllowed: false,
    narrowSecurityDefinerRpcRequired: true,
    internalGenericEngineGrantable: false,
    securityDefinerRequirements: [
      "schema-qualified objects",
      "SET search_path = pg_catalog, public",
      "REVOKE ALL FROM PUBLIC/anon/authenticated",
      "grant only named narrow RPCs to service_role",
      "operation-derived actor-class literals",
      "caller audit identifier is metadata only",
      "bounded input lengths and enum validation",
      "p_ parameters, v_ locals and explicit table aliases",
      "plpgsql.variable_conflict=error remains effective",
      "optimistic concurrency, idempotency and append-only history",
    ],
    idempotencyModel:
      "unique (operation, idempotency_key) history/attempt indexes; replay returns the original result; URL is never the idempotency key",
    urlNormalizationModel:
      "application-normalized HTTPS candidate (lowercase IDNA host, default ports removed, fragment removed, stable trailing slash, tracking parameters removed under an allowlist) plus database syntax/origin validation and unique normalized canonical URL; collisions require explicit merge review and URL changes append history",
    historyModel:
      "authorization transitions are typed and append-only; generalized registry history records bounded operation plus from/to jsonb snapshots for URL, trust, authority, jurisdiction, terms/robots and handling-policy changes; table owner/superuser remains the honest PostgreSQL bypass boundary",
    termsRobotsModel:
      "independent NOT_REVIEWED/ALLOWED/RESTRICTED/PROHIBITED/UNKNOWN statuses; automated acquisition requires policy-acceptable decisions for both; robots does not determine copyright/license rights",
    retentionModel: {
      sourceRegistryMetadata: "retain while active and indefinitely for referenced retired identity",
      authorizationAndRegistryHistory: "append-only indefinite audit retention",
      acquisitionAttempts: "successful metadata retained with version; failed logs bounded by operational retention policy",
      immutableSourceVersions: "retain while cited or historically authorized",
      rawHtmlPdf: "not stored in first slice; future storage requires explicit retention/license decision",
      normalizedText: "not stored in first slice; future successful immutable version only",
      cacheEntries: "not implemented; future expiry plus version reference",
    },
    observabilityEvents: [
      "source_registration_attempted",
      "source_registered",
      "source_registration_rejected",
      "source_metadata_updated",
      "source_terms_review_recorded",
      "source_robots_review_recorded",
      "source_authority_verified",
      "source_authorization_transitioned",
      "source_suspended",
      "source_retired",
      "handling_policy_assigned",
      "handling_policy_changed",
    ],
    failureTaxonomy: FAILURES,
    generatedTypesIntroducedInImplementation: true,
    fullGeneratedTypePath: "lib/supabase/database.types.ts",
    generatedTypeGenerationMethod:
      "disposable local PostgreSQL 17, controlled migrations 001→035, `supabase gen types typescript --db-url <local> --schema public`; no linked or production project",
    fullGeneratedDatabaseTypeRequired: true,
    manualDomainTypesRequired: true,
    manualDomainTypePath: "lib/vaylo/smart-talk/knowledge/source-registry/domain.ts",
    publicClientNarrowSurfaceRequired: true,
    serverIngestionSurfaceRequired: true,
    serverRuntimeReadSurfaceRequired: true,
    applicationCallableSurfaceOmitsInternalFunctions: true,
    runtimeRetrievalImplementedNow: false,
    realSourceAcquisitionImplementedNow: false,
    realSourceContentStoredNow: false,
    aiExtractionImplementedNow: false,
    databaseWritePerformed: false,
    databaseSchemaModified: false,
    generatedTypesCreated: false,
    immediateScopeIncludes: [
      "source registry schema",
      "source authorization lifecycle",
      "handling-mode classification",
      "freshness/stale metadata",
      "narrow registry RPCs",
      "generated types in 9T",
      "manual literal types",
      "isolated PostgreSQL validation",
    ],
    immediateScopeExcludes: [
      "real source download",
      "HTML/PDF parsing",
      "AI/passages/candidate extraction",
      "real database population",
      "live retrieval",
      "Smart Talk integration",
      "translations",
      "cross-border connectors",
      "modification of app/api/smart-talk/route.ts",
    ],
    runtimeReadConcepts: [
      { name: "knowledge_get_authorized_sources_for_retrieval", classification: "FUTURE_RETRIEVAL_PHASE" },
      { name: "knowledge_get_current_source_registry_entry", classification: "FIRST_SLICE_REQUIRED" },
      { name: "knowledge_get_handling_policy", classification: "FIRST_SLICE_REQUIRED" },
    ],
    databaseObjectAccessPlan: [
      { tableFamily: "official sources", writeInterface: "11 narrow RPCs", readInterface: "server-only current-entry concept", directDmlAllowed: false, requiredRole: "service_role via RPC", generatedTypeExposure: "full + server narrow", manualDomainTypeRequired: true },
      { tableFamily: "authorization/history", writeInterface: "internal engine and triggers", readInterface: "server audit only", directDmlAllowed: false, requiredRole: "function owner", generatedTypeExposure: "full only", manualDomainTypeRequired: true },
      { tableFamily: "acquisition attempts", writeInterface: "record-attempt RPC", readInterface: "server audit only", directDmlAllowed: false, requiredRole: "service_role via RPC", generatedTypeExposure: "full + ingestion", manualDomainTypeRequired: true },
      { tableFamily: "source versions/passages", writeInterface: "future acquisition phase", readInterface: "future retrieval phase", directDmlAllowed: false, requiredRole: "future narrow RPC", generatedTypeExposure: "full only in first slice", manualDomainTypeRequired: false },
      { tableFamily: "handling policies", writeInterface: "assign-policy RPC", readInterface: "server handling-policy concept", directDmlAllowed: false, requiredRole: "service_role via RPC", generatedTypeExposure: "full + ingestion/read narrow", manualDomainTypeRequired: true },
      { tableFamily: "future evidence candidates", writeInterface: "not implemented", readInterface: "none", directDmlAllowed: false, requiredRole: "future narrow RPC", generatedTypeExposure: "full existing tables only", manualDomainTypeRequired: false },
      { tableFamily: "publication states", writeInterface: "existing narrow RPCs only", readInterface: "future read service", directDmlAllowed: false, requiredRole: "service_role via RPC", generatedTypeExposure: "full; excluded from registry client", manualDomainTypeRequired: true },
      { tableFamily: "translations", writeInterface: "existing narrow RPCs only", readInterface: "future read service", directDmlAllowed: false, requiredRole: "service_role via RPC", generatedTypeExposure: "full; excluded from registry client", manualDomainTypeRequired: true },
    ],
    plannedImplementationPhaseCount: PHASES.length,
    plannedImplementationPhases: PHASES,
    implementationFilePlan: FILE_PLAN,
    implementationFilePlanComplete:
      PHASES.length === 5 &&
      FILE_PLAN.every((file) => !file.path.includes("app/api/smart-talk") && file.path.length > 0),
    isolatedPostgresqlValidationPlanned: true,
    plannedPostgresqlMajorVersion: 17,
    plannedPositiveRuntimeCaseMinimum: 30,
    plannedNegativeTamperCaseMinimum: 120,
    fullAuthorizationMatrixPlanned: true,
    concurrencyValidationPlanned: true,
    schemaShadowingValidationPlanned: true,
    rollbackValidationPlanned: true,
    validationScenarios: VALIDATION_SCENARIOS,
    planTamperCaseCount: 0,
    planTamperCasesRejected: 0,
    readyForOfficialSourceRegistrySchemaMigration:
      missingMandatoryFields.length >= 8 &&
      contract9P.includes("HYBRID_VERIFIED_CONTROL_PLANE") &&
      contract9O.includes("NO_GENERATED_TYPES_CURRENTLY_USED"),
    readyForRealSourceAcquisition: false,
    readyForLiveRetrieval: false,
    recommendedNextPhase: NEXT,
    evidence: [
      `missing mandatory fields in 032=${missingMandatoryFields.join(",")}`,
      `032 source core present=${hasColumns(sql032, "knowledge_sources", ["publisher_id", "canonical_url", "jurisdiction_id", "source_language"])}`,
      `032 immutable source versions present=${hasColumns(sql032, "knowledge_source_versions", ["content_hash", "version_sequence", "locked_at"])}`,
      `032 passages present=${hasColumns(sql032, "knowledge_source_passages", ["source_version_id", "text_hash", "citation_ready"])}`,
      `033 narrow service_role grants=${(sql033.match(/grant execute on function/gi) ?? []).length}`,
      `034 adds no tables=${!/create\\s+table/i.test(sql034)}`,
      "PostgreSQL enums selected for first-slice domain literals because 9O proved text CHECK values generate only string; generated full types are still not authorization",
    ],
  };

  if (!repo.valid) {
    result.blocked = true;
    result.outcome = "BLOCKED — REPOSITORY STATE";
    result.blockReason = `Unexpected repository paths: ${repo.unexpected.join(", ")}`;
  } else if (missingMandatoryFields.length < 8) {
    result.blocked = true;
    result.outcome = "BLOCKED — SCHEMA CAPABILITY CONFLICT";
    result.blockReason = "Schema-gap evidence does not support the planned forward extension.";
  }
  result.allPassed = !result.blocked;
  return result;
}

function invariant(r: Result): boolean {
  const complete = [
    r.sourceRegistryContractPlanned,
    r.sourceAuthorizationContractPlanned,
    r.handlingModeContractPlanned,
    r.freshnessContractPlanned,
    r.staleBehaviorContractPlanned,
    r.jurisdictionContractPlanned,
    r.termsReviewContractPlanned,
    r.robotsReviewContractPlanned,
    r.idempotencyContractPlanned,
    r.optimisticConcurrencyContractPlanned,
    r.historyImmutabilityContractPlanned,
    r.observabilityContractPlanned,
    r.failureTaxonomyPlanned,
  ].every(Boolean);
  return [
    r.allPassed && !r.blocked && r.outcome === "PASSED",
    r.repositoryScopeValid && r.workingTreeCleanBeforePhase && r.unexpectedRepositoryPaths.length === 0,
    r.relevantExistingTableCount === 16 &&
      r.reusableAsIsTableCount === 11 &&
      r.reusableWithExtensionTableCount === 3 &&
      r.newObjectRequiredCount === 4 &&
      r.existingSchemaCapabilityMatrixComplete,
    r.existingSchemaCapabilityMatrix.length === 16 &&
      r.existingSchemaCapabilityMatrix.every((item) => item.rlsEnabled && item.policies === 0),
    r.schemaChangeRequired && r.schemaGapDecision === "NEW_FORWARD_MIGRATION_REQUIRED" &&
      r.proposedMigration === MIGRATION && r.migrationStrategy === "CREATE_AND_ALTER",
    r.plannedEnumsAdded === 15 &&
      r.plannedTablesCreated === 4 &&
      r.plannedTablesAltered === 3 &&
      r.plannedConstraintsAdded === 22 &&
      r.plannedIndexesAdded === 16 &&
      r.plannedTriggersAdded === 2 &&
      r.plannedFunctionsAdded === 12 &&
      r.plannedFunctionsReplaced === 1 &&
      r.plannedRlsEnabledTables === 4 &&
      r.plannedPoliciesAdded === 0 &&
      r.plannedGrantableRpcs === 11 &&
      r.plannedInternalFunctions === 1,
    r.plannedTableNamesCreated.join(",") === TABLES_CREATED.join(",") &&
      r.plannedTableNamesAltered.join(",") === TABLES_ALTERED.join(","),
    r.registryFieldPlan.length === 25 &&
      r.handlingModeStorageStrategy === "POSTGRESQL_ENUM" &&
      r.sourceClassStorageStrategy === "POSTGRESQL_ENUM_WITH_DERIVED_EVIDENCE_ELIGIBILITY",
    r.handlingModes.join(",") === HANDLING_MODES.join(",") &&
      r.sourceClasses.join(",") === SOURCE_CLASSES.join(",") &&
      r.discoveryOnlyClasses.join(",") === DISCOVERY_CLASSES.join(","),
    r.handlingAssignmentGranularity.includes("information_class") &&
      r.requiredContextStorageStrategy === "BOUNDED_POSTGRESQL_ENUM_ARRAY" &&
      r.requiredContextKeys.join(",") === CONTEXT_KEYS.join(","),
    r.sourceAuthorizationLifecycleRequired &&
      r.sourceAuthorizationHistoryRequired &&
      r.sourceAuthorizationStateCount === 7 &&
      r.sourceAuthorizationStates.join(",") === AUTH_STATES.join(",") &&
      r.sourceAuthorizationAllowedEdges.join(",") === AUTH_EDGES.join(",") &&
      r.sourceAuthorizationMatrixCellCount === 49 &&
      r.sourceAuthorizationAllowedCellCount === 11 &&
      r.sourceAuthorizationForbiddenCellCount === 38 &&
      r.sourceAuthorizationTransitionMatrixComplete,
    complete && r.plannedRpcs.length === 11 && r.plannedRpcs.every((rpc) => rpc.idempotencyKey),
    !r.directServiceRoleDmlAllowed &&
      !r.anonDirectAccessAllowed &&
      !r.authenticatedDirectAccessAllowed &&
      !r.publicExecuteAllowed &&
      r.narrowSecurityDefinerRpcRequired &&
      !r.internalGenericEngineGrantable,
    r.securityDefinerRequirements.length === 10 &&
      r.securityDefinerRequirements.some((item) => item.includes("table aliases")) &&
      r.securityDefinerRequirements.some((item) => item.includes("variable_conflict")),
    r.idempotencyModel.includes("URL is never") &&
      r.urlNormalizationModel.includes("application-normalized") &&
      r.urlNormalizationModel.includes("history") &&
      r.historyModel.includes("append-only") &&
      r.termsRobotsModel.includes("independent"),
    r.generatedTypesIntroducedInImplementation &&
      r.fullGeneratedTypePath === "lib/supabase/database.types.ts" &&
      r.generatedTypeGenerationMethod.includes("001→035") &&
      r.generatedTypeGenerationMethod.includes("no linked or production project") &&
      r.fullGeneratedDatabaseTypeRequired &&
      r.manualDomainTypesRequired &&
      r.publicClientNarrowSurfaceRequired &&
      r.serverIngestionSurfaceRequired &&
      r.serverRuntimeReadSurfaceRequired &&
      r.applicationCallableSurfaceOmitsInternalFunctions,
    !r.runtimeRetrievalImplementedNow &&
      !r.realSourceAcquisitionImplementedNow &&
      !r.realSourceContentStoredNow &&
      !r.aiExtractionImplementedNow &&
      !r.databaseWritePerformed &&
      !r.databaseSchemaModified &&
      !r.generatedTypesCreated,
    r.immediateScopeExcludes.includes("modification of app/api/smart-talk/route.ts") &&
      r.retentionModel.rawHtmlPdf.includes("not stored") &&
      r.observabilityEvents.length === 12 &&
      r.failureTaxonomy.length === 15,
    r.plannedImplementationPhaseCount === 5 &&
      r.plannedImplementationPhases.map((phase) => phase.phase).join(",") === "9R,9S,9T,9U,9V" &&
      r.implementationFilePlanComplete &&
      r.implementationFilePlan.every((file) =>
        !file.path.includes("app/api/smart-talk") &&
        file.path !== M032 &&
        file.path !== M033 &&
        file.path !== M034
      ),
    r.isolatedPostgresqlValidationPlanned &&
      r.plannedPostgresqlMajorVersion === 17 &&
      r.plannedPositiveRuntimeCaseMinimum >= 25 &&
      r.plannedNegativeTamperCaseMinimum >= 100 &&
      r.fullAuthorizationMatrixPlanned &&
      r.concurrencyValidationPlanned &&
      r.schemaShadowingValidationPlanned &&
      r.rollbackValidationPlanned &&
      r.validationScenarios.length === 25,
    r.readyForOfficialSourceRegistrySchemaMigration &&
      !r.readyForRealSourceAcquisition &&
      !r.readyForLiveRetrieval &&
      r.recommendedNextPhase === NEXT,
    r.planTamperCaseCount >= 100 && r.planTamperCasesRejected === r.planTamperCaseCount,
  ].every(Boolean);
}

interface Tamper {
  description: string;
  mutate: (result: Result) => void;
}

const RAW_TAMPERS: Array<[string, (result: Result) => void]> = [
  ["no migration despite missing mandatory fields", (r) => { (r as unknown as { schemaChangeRequired: boolean }).schemaChangeRequired = false; }],
  ["wrong migration identity", (r) => { r.proposedMigration = "035_wrong.sql"; }],
  ["duplicate parallel source table", (r) => { r.plannedTableNamesCreated = [...r.plannedTableNamesCreated, "knowledge_official_sources"]; }],
  ["discovery-only source evidence eligible", (r) => { r.sourceClassStorageStrategy = "POSTGRESQL_ENUM_WITHOUT_ELIGIBILITY" as Result["sourceClassStorageStrategy"]; }],
  ["handling mode only in TypeScript", (r) => { r.handlingModeStorageStrategy = "TYPESCRIPT_ONLY" as Result["handlingModeStorageStrategy"]; }],
  ["source state changed by direct DML", (r) => { (r as unknown as { directServiceRoleDmlAllowed: boolean }).directServiceRoleDmlAllowed = true; }],
  ["caller-controlled actor class", (r) => { r.securityDefinerRequirements = r.securityDefinerRequirements.filter((item) => !item.includes("actor-class")); }],
  ["generic engine grantable", (r) => { (r as unknown as { internalGenericEngineGrantable: boolean }).internalGenericEngineGrantable = true; }],
  ["no optimistic concurrency", (r) => { r.optimisticConcurrencyContractPlanned = false; }],
  ["no idempotency", (r) => { r.idempotencyContractPlanned = false; }],
  ["mutable history", (r) => { r.historyImmutabilityContractPlanned = false; }],
  ["anon access enabled", (r) => { (r as unknown as { anonDirectAccessAllowed: boolean }).anonDirectAccessAllowed = true; }],
  ["authenticated access enabled", (r) => { (r as unknown as { authenticatedDirectAccessAllowed: boolean }).authenticatedDirectAccessAllowed = true; }],
  ["PUBLIC execute retained", (r) => { (r as unknown as { publicExecuteAllowed: boolean }).publicExecuteAllowed = true; }],
  ["URL alone used as idempotency key", (r) => { r.idempotencyModel = "URL alone"; }],
  ["URL history overwritten", (r) => { r.urlNormalizationModel = "database normalization without history"; }],
  ["terms and robots collapsed", (r) => { r.termsRobotsModel = "one combined flag"; }],
  ["municipality source without jurisdiction contract", (r) => { r.jurisdictionContractPlanned = false; }],
  ["stale high-risk data allowed", (r) => { r.staleBehaviorContractPlanned = false; }],
  ["one source forced to one handling mode", (r) => { r.handlingAssignmentGranularity = "source only"; }],
  ["context keys unbounded", (r) => { r.requiredContextStorageStrategy = "FREE_TEXT_ARRAY" as Result["requiredContextStorageStrategy"]; }],
  ["raw content stored in first slice", (r) => { r.retentionModel.rawHtmlPdf = "store indefinitely"; }],
  ["real acquisition included", (r) => { (r as unknown as { realSourceAcquisitionImplementedNow: boolean }).realSourceAcquisitionImplementedNow = true; }],
  ["AI extraction included", (r) => { (r as unknown as { aiExtractionImplementedNow: boolean }).aiExtractionImplementedNow = true; }],
  ["live retrieval included", (r) => { (r as unknown as { runtimeRetrievalImplementedNow: boolean }).runtimeRetrievalImplementedNow = true; }],
  ["generated types omitted", (r) => { (r as unknown as { generatedTypesIntroducedInImplementation: boolean }).generatedTypesIntroducedInImplementation = false; }],
  ["internal functions callable", (r) => { (r as unknown as { applicationCallableSurfaceOmitsInternalFunctions: boolean }).applicationCallableSurfaceOmitsInternalFunctions = false; }],
  ["production type generation", (r) => { r.generatedTypeGenerationMethod = "production project"; }],
  ["linked project type generation", (r) => { r.generatedTypeGenerationMethod = "linked project"; }],
  ["migration 034 edited", (r) => { r.implementationFilePlan.push({ path: M034, phase: "9R", createOrModify: "CREATE", purpose: "edit", serverOnly: false, generated: false, sourceOfTruth: "none" }); }],
  ["runtime positive minimum reduced", (r) => { r.plannedPositiveRuntimeCaseMinimum = 24; }],
  ["runtime negative minimum reduced", (r) => { r.plannedNegativeTamperCaseMinimum = 99; }],
  ["concurrency omitted", (r) => { r.concurrencyValidationPlanned = false; }],
  ["schema shadowing omitted", (r) => { r.schemaShadowingValidationPlanned = false; }],
  ["rollback omitted", (r) => { r.rollbackValidationPlanned = false; }],
  ["authorization matrix omitted", (r) => { r.fullAuthorizationMatrixPlanned = false; }],
  ["wrong state matrix cell count", (r) => { r.sourceAuthorizationMatrixCellCount = 48; }],
  ["allowed state edge missing", (r) => { r.sourceAuthorizationAllowedCellCount = 10; }],
  ["forbidden state edge missing", (r) => { r.sourceAuthorizationForbiddenCellCount = 37; }],
  ["source lifecycle omitted", (r) => { (r as unknown as { sourceAuthorizationLifecycleRequired: boolean }).sourceAuthorizationLifecycleRequired = false; }],
  ["source history omitted", (r) => { (r as unknown as { sourceAuthorizationHistoryRequired: boolean }).sourceAuthorizationHistoryRequired = false; }],
  ["wrong table create count", (r) => { r.plannedTablesCreated = 5; }],
  ["wrong table alter count", (r) => { r.plannedTablesAltered = 2; }],
  ["wrong constraint count", (r) => { r.plannedConstraintsAdded = 21; }],
  ["wrong index count", (r) => { r.plannedIndexesAdded = 15; }],
  ["wrong trigger count", (r) => { r.plannedTriggersAdded = 1; }],
  ["wrong function count", (r) => { r.plannedFunctionsAdded = 11; }],
  ["missing function replacement", (r) => { r.plannedFunctionsReplaced = 0; }],
  ["RLS not enabled on all new tables", (r) => { r.plannedRlsEnabledTables = 3; }],
  ["permissive policies added", (r) => { r.plannedPoliciesAdded = 1; }],
  ["grantable RPC count changed", (r) => { r.plannedGrantableRpcs = 10; }],
  ["internal engine count changed", (r) => { r.plannedInternalFunctions = 0; }],
  ["registry contract omitted", (r) => { r.sourceRegistryContractPlanned = false; }],
  ["authorization contract omitted", (r) => { r.sourceAuthorizationContractPlanned = false; }],
  ["handling contract omitted", (r) => { r.handlingModeContractPlanned = false; }],
  ["freshness omitted", (r) => { r.freshnessContractPlanned = false; }],
  ["terms review omitted", (r) => { r.termsReviewContractPlanned = false; }],
  ["robots review omitted", (r) => { r.robotsReviewContractPlanned = false; }],
  ["observability omitted", (r) => { r.observabilityContractPlanned = false; }],
  ["failure taxonomy omitted", (r) => { r.failureTaxonomyPlanned = false; }],
  ["narrow security definer not required", (r) => { (r as unknown as { narrowSecurityDefinerRpcRequired: boolean }).narrowSecurityDefinerRpcRequired = false; }],
  ["parameter naming guard omitted", (r) => { r.securityDefinerRequirements = r.securityDefinerRequirements.filter((item) => !item.includes("p_ parameters")); }],
  ["search path guard omitted", (r) => { r.securityDefinerRequirements = r.securityDefinerRequirements.filter((item) => !item.includes("search_path")); }],
  ["full generated type omitted", (r) => { (r as unknown as { fullGeneratedDatabaseTypeRequired: boolean }).fullGeneratedDatabaseTypeRequired = false; }],
  ["manual domain types omitted", (r) => { (r as unknown as { manualDomainTypesRequired: boolean }).manualDomainTypesRequired = false; }],
  ["public narrow surface omitted", (r) => { (r as unknown as { publicClientNarrowSurfaceRequired: boolean }).publicClientNarrowSurfaceRequired = false; }],
  ["server ingestion surface omitted", (r) => { (r as unknown as { serverIngestionSurfaceRequired: boolean }).serverIngestionSurfaceRequired = false; }],
  ["server read surface omitted", (r) => { (r as unknown as { serverRuntimeReadSurfaceRequired: boolean }).serverRuntimeReadSurfaceRequired = false; }],
  ["generated path changed", (r) => { (r as unknown as { fullGeneratedTypePath: string }).fullGeneratedTypePath = "types/db.ts"; }],
  ["database write claimed", (r) => { (r as unknown as { databaseWritePerformed: boolean }).databaseWritePerformed = true; }],
  ["schema modification claimed", (r) => { (r as unknown as { databaseSchemaModified: boolean }).databaseSchemaModified = true; }],
  ["types claimed created", (r) => { (r as unknown as { generatedTypesCreated: boolean }).generatedTypesCreated = true; }],
  ["real source content stored", (r) => { (r as unknown as { realSourceContentStoredNow: boolean }).realSourceContentStoredNow = true; }],
  ["Smart Talk route in file plan", (r) => { r.implementationFilePlan.push({ path: "app/api/smart-talk/route.ts", phase: "9U", createOrModify: "CREATE", purpose: "wire", serverOnly: true, generated: false, sourceOfTruth: "none" }); }],
  ["phase count reduced", (r) => { r.plannedImplementationPhaseCount = 4; }],
  ["phase sequence changed", (r) => { r.plannedImplementationPhases = r.plannedImplementationPhases.slice(1); }],
  ["file plan incomplete", (r) => { r.implementationFilePlanComplete = false; }],
  ["PostgreSQL version reduced", (r) => { r.plannedPostgresqlMajorVersion = 16 as 17; }],
  ["isolated validation omitted", (r) => { (r as unknown as { isolatedPostgresqlValidationPlanned: boolean }).isolatedPostgresqlValidationPlanned = false; }],
  ["validation scenarios reduced", (r) => { r.validationScenarios = r.validationScenarios.slice(1); }],
  ["schema capability matrix incomplete", (r) => { r.existingSchemaCapabilityMatrixComplete = false; }],
  ["relevant table count changed", (r) => { r.relevantExistingTableCount = 15; }],
  ["reuse-as-is count changed", (r) => { r.reusableAsIsTableCount = 10; }],
  ["reuse-extension count changed", (r) => { r.reusableWithExtensionTableCount = 2; }],
  ["new-object count changed", (r) => { r.newObjectRequiredCount = 3; }],
  ["wrong migration strategy", (r) => { r.migrationStrategy = "CREATE_ONLY" as Result["migrationStrategy"]; }],
  ["wrong schema decision", (r) => { r.schemaGapDecision = "NO_SCHEMA_CHANGE_REQUIRED" as Result["schemaGapDecision"]; }],
  ["handling mode missing", (r) => { r.handlingModes = r.handlingModes.slice(1); }],
  ["source class missing", (r) => { r.sourceClasses = r.sourceClasses.slice(1); }],
  ["discovery class missing", (r) => { r.discoveryOnlyClasses = r.discoveryOnlyClasses.slice(1); }],
  ["authorization state missing", (r) => { r.sourceAuthorizationStates = r.sourceAuthorizationStates.slice(1); }],
  ["authorization edge missing", (r) => { r.sourceAuthorizationAllowedEdges = r.sourceAuthorizationAllowedEdges.slice(1); }],
  ["registry field plan shortened", (r) => { r.registryFieldPlan = r.registryFieldPlan.slice(1); }],
  ["failure taxonomy shortened", (r) => { r.failureTaxonomy = r.failureTaxonomy.slice(1); }],
  ["observability shortened", (r) => { r.observabilityEvents = r.observabilityEvents.slice(1); }],
  ["not ready for schema migration", (r) => { r.readyForOfficialSourceRegistrySchemaMigration = false; }],
  ["real source acquisition ready", (r) => { (r as unknown as { readyForRealSourceAcquisition: boolean }).readyForRealSourceAcquisition = true; }],
  ["live retrieval ready", (r) => { (r as unknown as { readyForLiveRetrieval: boolean }).readyForLiveRetrieval = true; }],
  ["wrong recommendation", (r) => { r.recommendedNextPhase = "PHASE 9Z"; }],
  ["repository scope invalid accepted", (r) => { r.repositoryScopeValid = false; }],
  ["dirty tree accepted", (r) => { r.workingTreeCleanBeforePhase = false; }],
  ["unrelated file accepted", (r) => { r.unexpectedRepositoryPaths = ["tmp.txt"]; }],
  ["tamper count erased", (r) => { r.planTamperCaseCount = 0; r.planTamperCasesRejected = 0; }],
  ["tamper parity broken", (r) => { r.planTamperCasesRejected = r.planTamperCaseCount - 1; }],
];

const TAMPERS: Tamper[] = RAW_TAMPERS.map(([description, mutate]) => ({ description, mutate }));

const BOOLEAN_TAMPERS: Tamper[] = [
  "sourceRegistryContractPlanned",
  "sourceAuthorizationContractPlanned",
  "handlingModeContractPlanned",
  "freshnessContractPlanned",
  "staleBehaviorContractPlanned",
  "jurisdictionContractPlanned",
  "termsReviewContractPlanned",
  "robotsReviewContractPlanned",
  "idempotencyContractPlanned",
  "optimisticConcurrencyContractPlanned",
  "historyImmutabilityContractPlanned",
  "observabilityContractPlanned",
  "failureTaxonomyPlanned",
  "fullAuthorizationMatrixPlanned",
  "concurrencyValidationPlanned",
  "schemaShadowingValidationPlanned",
  "rollbackValidationPlanned",
].map((field) => ({
  description: `${field} false`,
  mutate: (result: Result) => {
    (result as unknown as Record<string, unknown>)[field] = false;
  },
}));

function runTampers(base: Result): { total: number; rejected: number; leaks: string[] } {
  const tests = [...TAMPERS, ...BOOLEAN_TAMPERS];
  const leaks: string[] = [];
  for (const test of tests) {
    const copy = JSON.parse(JSON.stringify(base)) as Result;
    test.mutate(copy);
    if (invariant(copy)) leaks.push(test.description);
  }
  return { total: tests.length, rejected: tests.length - leaks.length, leaks };
}

function main(): void {
  const result = build();
  const testCount = TAMPERS.length + BOOLEAN_TAMPERS.length;
  result.planTamperCaseCount = testCount;
  result.planTamperCasesRejected = testCount;
  const tamper = runTampers(result);
  result.planTamperCaseCount = tamper.total;
  result.planTamperCasesRejected = tamper.rejected;

  if (!invariant(result)) {
    result.allPassed = false;
    if (result.outcome === "PASSED") {
      result.blocked = true;
      result.outcome = "BLOCKED — IMPLEMENTATION PLAN INCOMPLETE";
      result.blockReason = tamper.leaks.length
        ? `Tamper leaks: ${tamper.leaks.join("; ")}`
        : "Plan is internally contradictory.";
    }
  }

  console.log(JSON.stringify(result, null, 2));
  console.error("");
  console.error(`PHASE ${CHECK_ID} RESULT: ${result.outcome}`);
  console.error(`  source commit           : ${result.sourceCommit}`);
  console.error(`  existing tables         : ${result.relevantExistingTableCount} relevant; ${result.reusableAsIsTableCount} reuse; ${result.reusableWithExtensionTableCount} extend`);
  console.error(`  schema decision         : ${result.schemaGapDecision} / ${result.proposedMigration}`);
  console.error(`  migration objects       : ${result.plannedTablesCreated} create, ${result.plannedTablesAltered} alter, ${result.plannedGrantableRpcs} RPCs`);
  console.error(`  auth matrix             : ${result.sourceAuthorizationMatrixCellCount} cells (${result.sourceAuthorizationAllowedCellCount} allowed / ${result.sourceAuthorizationForbiddenCellCount} forbidden)`);
  console.error(`  phases                  : ${result.plannedImplementationPhases.map((phase) => phase.phase).join("→")}`);
  console.error(`  validation              : PG${result.plannedPostgresqlMajorVersion}, >=${result.plannedPositiveRuntimeCaseMinimum} positive, >=${result.plannedNegativeTamperCaseMinimum} negative`);
  console.error(`  tamper pack             : ${result.planTamperCasesRejected}/${result.planTamperCaseCount} rejected`);
  console.error(`  allPassed               : ${result.allPassed}`);
  if (result.blockReason) console.error(`  blocker                 : ${result.blockReason}`);
  console.error(`  next phase              : ${result.recommendedNextPhase}`);
  process.exit(result.allPassed ? 0 : 1);
}

main();
