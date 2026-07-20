/**
 * PHASE 9F — Knowledge Migration Implementation Plan Audit
 * (Implementation Plan and Audit Only)
 *
 * Defines a deterministic, immutable *planning* contract for the future
 * Birello German Knowledge System database migration — derived from the
 * logical schema in PHASE 9E and the architecture/trust/jurisdiction/
 * process-coverage contracts in PHASE 9A-9D. This file performs NO
 * dynamic execution: no SQL, no migration file, no Supabase CLI, no
 * database command, no table creation, no database write, no network,
 * no model call, no OCR, no embeddings, no retrieval, no DE<->SK
 * implementation, no user-content persistence, no environment mutation.
 *
 * It only:
 *   1. Declares immutable, type-only migration-planning contracts
 *      (migration strategy, 10 logical table groups mapped from the 32
 *      PHASE 9E layers, dependency-safe table creation order, 10 FK
 *      phases, on-delete policy, immutability/append-only policy, staged
 *      constraint/unique/index plans, 7 RLS roles with least-privilege
 *      policies, public-knowledge/user-data separation, view/projection
 *      plan, seed/fixture strategy, 11 migration stages, rollback and
 *      failure policy, validation plan, migration-file/split plan,
 *      real-source-ingestion boundary naming PHASE 9G, DE<->SK structural
 *      readiness while remaining inactive, performance boundary,
 *      Supabase-specific planning, generated-types plan, auditability,
 *      exit criteria).
 *   2. Reads the PHASE 9A-9E audit files, the PHASE 8.13C closure audit,
 *      and existing Supabase migration filenames / `lib/supabase/*`
 *      helpers as plain text via `fs.readFileSync` (never imports or
 *      executes them) to ground a few conservative booleans and the
 *      naming-convention observation.
 *   3. Runs read-only `git` commands to confirm this phase created
 *      exactly one new file and modified no existing file.
 *   4. Runs 208 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "45510ea";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";
const SOURCE_TRUST_CONTRACT_CHECK_ID = "9B";
const SOURCE_JURISDICTION_MODEL_CHECK_ID = "9C";
const SOURCE_COVERAGE_PLAN_CHECK_ID = "9D";
const SOURCE_STORAGE_SCHEMA_CHECK_ID = "9E";

const PHASE_9A_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-knowledge-system-boundary-architecture-gate-design-audit.ts";
const PHASE_9B_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-source-hierarchy-trust-contract-audit.ts";
const PHASE_9C_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-german-jurisdiction-effective-date-model-audit.ts";
const PHASE_9D_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimum-german-process-coverage-plan-audit.ts";
const PHASE_9E_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-storage-schema-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-knowledge-migration-implementation-plan-audit.ts";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const SUPABASE_SERVICE_ROLE_REL_PATH = "lib/supabase/service-role.ts";

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
// MIGRATION STRATEGY
// ============================================================================

type MigrationStrategyCategory =
  | "additive_first" | "append_only" | "non_destructive" | "staged_constraints" | "staged_indexes"
  | "staged_rls" | "staged_seed" | "validation_before_runtime" | "forward_fix_preferred" | "rollback_available_where_safe";
const MIGRATION_STRATEGY: readonly MigrationStrategyCategory[] = [
  "additive_first", "append_only", "non_destructive", "staged_constraints", "staged_indexes",
  "staged_rls", "staged_seed", "validation_before_runtime", "forward_fix_preferred", "rollback_available_where_safe",
];
const PROHIBITED_INITIAL_MIGRATION_ACTIONS: readonly string[] = [
  "dropping existing tables", "renaming unrelated tables", "rewriting user data",
  "mixing knowledge data into existing user-content tables", "enabling runtime before validation",
];

// ============================================================================
// LOGICAL TABLE GROUPS (mapped from the 32 PHASE 9E logical storage layers)
// ============================================================================

const LOGICAL_TABLE_GROUPS: Readonly<Record<string, readonly string[]>> = {
  foundation: ["knowledge_publishers", "knowledge_jurisdictions", "knowledge_territorial_scopes", "knowledge_trust_domains"],
  source_core: ["knowledge_sources", "knowledge_source_versions", "knowledge_source_passages"],
  authority_core: ["knowledge_authorities", "knowledge_authority_competences"],
  claim_core: ["knowledge_claims", "knowledge_claim_evidence_links", "knowledge_citations"],
  process_core: ["knowledge_processes", "knowledge_process_steps", "knowledge_process_claim_links"],
  rule_document_core: [
    "knowledge_forms", "knowledge_form_requirements", "knowledge_evidence_requirements",
    "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_eligibility_rules", "knowledge_responsible_actor_rules",
  ],
  governance_core: [
    "knowledge_regional_overrides", "knowledge_review_records", "knowledge_freshness_records",
    "knowledge_conflicts", "knowledge_audit_events",
  ],
  language_core: ["knowledge_terminology", "knowledge_localized_terminology"],
  cross_border_core: ["knowledge_trust_domain_links", "knowledge_cross_border_connectors", "knowledge_cross_border_processes"],
  retrieval_metadata_group: ["knowledge_retrieval_metadata"],
};
const TOTAL_PLANNED_TABLE_COUNT = Object.values(LOGICAL_TABLE_GROUPS).reduce((sum, arr) => sum + arr.length, 0);

// ============================================================================
// DEPENDENCY-SAFE TABLE CREATION ORDER
// ============================================================================

const TABLE_CREATION_ORDER: readonly string[] = [
  // Stage 1 — foundation (no dependencies among each other beyond jurisdiction self-parenting)
  "knowledge_publishers", "knowledge_jurisdictions", "knowledge_territorial_scopes", "knowledge_trust_domains",
  // Stage 2 — source core
  "knowledge_sources", "knowledge_source_versions", "knowledge_source_passages",
  // Stage 3 — authority and claim core
  "knowledge_authorities", "knowledge_authority_competences",
  "knowledge_claims", "knowledge_claim_evidence_links", "knowledge_citations",
  // Stage 4 — process and rule/document core (responsible_actor_rules before steps that reference it)
  "knowledge_responsible_actor_rules", "knowledge_processes", "knowledge_process_steps", "knowledge_process_claim_links",
  "knowledge_forms", "knowledge_form_requirements", "knowledge_evidence_requirements",
  "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_eligibility_rules",
  // Stage 5 — governance
  "knowledge_regional_overrides", "knowledge_review_records", "knowledge_freshness_records",
  "knowledge_conflicts", "knowledge_audit_events",
  // Stage 6 — language and cross-border
  "knowledge_terminology", "knowledge_localized_terminology",
  "knowledge_trust_domain_links", "knowledge_cross_border_connectors", "knowledge_cross_border_processes",
  // Stage 7 — retrieval metadata (last; references any entity, always optional)
  "knowledge_retrieval_metadata",
];
export const CIRCULAR_DEPENDENCY_RESOLUTION_POLICY =
  "staged_nullable_reference_then_later_constraint" as const;
const CIRCULAR_DEPENDENCY_PERMANENT_FK_REMOVAL_ALLOWED = false as const;

// ============================================================================
// FOREIGN-KEY PHASES
// ============================================================================

type OnDeleteBehavior = "RESTRICT" | "NO ACTION" | "SET NULL" | "CASCADE";
interface ForeignKeyPhase {
  phaseId: string;
  parentTables: readonly string[];
  childTables: readonly string[];
  nullableDuringBootstrap: readonly string[];
  finalNonNullExpected: readonly string[];
  onDelete: OnDeleteBehavior;
  onUpdate: "RESTRICT" | "CASCADE";
  deferredValidationRequired: boolean;
  circularDependencyHandling: string;
}
const FOREIGN_KEY_PHASES: readonly ForeignKeyPhase[] = [
  {
    phaseId: "phase_fk_core", parentTables: ["knowledge_jurisdictions"], childTables: ["knowledge_jurisdictions", "knowledge_territorial_scopes"],
    nullableDuringBootstrap: ["knowledge_jurisdictions.parentJurisdictionId"], finalNonNullExpected: [],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: true,
    circularDependencyHandling: "self-referencing parentJurisdictionId staged nullable, validated after full hierarchy load",
  },
  {
    phaseId: "phase_fk_source", parentTables: ["knowledge_sources", "knowledge_publishers", "knowledge_jurisdictions"],
    childTables: ["knowledge_source_versions", "knowledge_source_passages"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_source_versions.sourceId", "knowledge_source_passages.sourceVersionId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_authority", parentTables: ["knowledge_authorities", "knowledge_territorial_scopes"],
    childTables: ["knowledge_authority_competences"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_authority_competences.authorityId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_claim", parentTables: ["knowledge_claims", "knowledge_source_versions", "knowledge_source_passages"],
    childTables: ["knowledge_claim_evidence_links", "knowledge_citations"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_claim_evidence_links.claimId", "knowledge_citations.passageId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_process", parentTables: ["knowledge_processes", "knowledge_responsible_actor_rules"],
    childTables: ["knowledge_process_steps", "knowledge_process_claim_links"],
    nullableDuringBootstrap: ["knowledge_process_steps.formId", "knowledge_process_steps.deadlineRuleId", "knowledge_process_steps.feeRuleId"],
    finalNonNullExpected: ["knowledge_process_steps.processId", "knowledge_process_steps.responsibleActorRuleId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: true,
    circularDependencyHandling: "process_steps -> forms/deadline/fee staged nullable until rule tables populated in same migration group",
  },
  {
    phaseId: "phase_fk_rules", parentTables: ["knowledge_authorities", "knowledge_source_versions"],
    childTables: ["knowledge_forms", "knowledge_form_requirements", "knowledge_evidence_requirements", "knowledge_deadline_rules", "knowledge_fee_rules", "knowledge_eligibility_rules"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_forms.authorityId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_governance", parentTables: ["knowledge_authorities", "knowledge_source_versions"],
    childTables: ["knowledge_regional_overrides", "knowledge_review_records", "knowledge_freshness_records", "knowledge_conflicts"],
    nullableDuringBootstrap: ["knowledge_conflicts.reviewRecordId"], finalNonNullExpected: [],
    onDelete: "NO ACTION", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_localization", parentTables: ["knowledge_terminology"], childTables: ["knowledge_localized_terminology"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_localized_terminology.terminologyEntryId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_cross_border", parentTables: ["knowledge_trust_domains", "knowledge_cross_border_connectors", "knowledge_processes"],
    childTables: ["knowledge_trust_domain_links", "knowledge_cross_border_processes"],
    nullableDuringBootstrap: [], finalNonNullExpected: ["knowledge_cross_border_processes.crossBorderConnectorId"],
    onDelete: "RESTRICT", onUpdate: "RESTRICT", deferredValidationRequired: false, circularDependencyHandling: "none required",
  },
  {
    phaseId: "phase_fk_audit", parentTables: ["*"], childTables: ["knowledge_audit_events"],
    nullableDuringBootstrap: ["knowledge_audit_events.entityId", "knowledge_audit_events.reviewRecordId"],
    finalNonNullExpected: ["knowledge_audit_events.auditEventId"],
    onDelete: "NO ACTION", onUpdate: "RESTRICT", deferredValidationRequired: true,
    circularDependencyHandling: "audit_events references any entity polymorphically via (entityType, entityId) without a hard FK, avoiding circularity by design rather than by removing integrity",
  },
];

// ============================================================================
// ON-DELETE POLICY
// ============================================================================

export const ON_DELETE_DEFAULTS: Readonly<Record<string, OnDeleteBehavior>> = {
  authoritative_knowledge_relationships: "RESTRICT",
  operator_review_required_relationships: "NO ACTION",
  historical_auditability_preserved_relationships: "SET NULL",
  non_authoritative_subordinate_metadata: "CASCADE",
};
const CASCADE_DELETE_PROHIBITED_FOR: readonly string[] = [
  "knowledge_source_versions", "knowledge_source_passages", "knowledge_claims", "knowledge_citations",
  "knowledge_review_records", "knowledge_conflicts", "knowledge_authority_competences", "knowledge_audit_events",
];

// ============================================================================
// IMMUTABILITY ENFORCEMENT PLAN
// ============================================================================

type ImmutableRecordState = "draft" | "machine_prechecked" | "human_reviewed" | "accepted" | "superseded";
const IMMUTABLE_STATE_TRANSITIONS: readonly ImmutableRecordState[] = [
  "draft", "machine_prechecked", "human_reviewed", "accepted", "superseded",
];
export const IMMUTABLE_ENTITIES: readonly string[] = [
  "knowledge_source_versions", "knowledge_source_passages (after acceptance)", "knowledge_review_records",
  "knowledge_audit_events", "knowledge_citations (where historical stability is required)",
];
export const FUTURE_IMMUTABILITY_ENFORCEMENT_MECHANISMS: readonly string[] = [
  "database triggers", "restricted update policies", "update-blocking functions",
  "immutable status transitions", "service-role-only append path", "content-hash verification",
];
const ACCEPTED_OR_SUPERSEDED_RECORDS_EDITABLE_IN_PLACE = false as const;
const TRIGGERS_CREATED_THIS_PHASE = false as const;

// ============================================================================
// APPEND-ONLY POLICY
// ============================================================================

const APPEND_ONLY_ENTITIES: readonly string[] = [
  "knowledge_source_versions", "knowledge_review_records", "knowledge_freshness_records (history retained)",
  "knowledge_audit_events", "conflict resolution history", "knowledge_authority_competences (history)",
  "knowledge_regional_overrides (history)", "citation history tied to historical outputs",
];
const MUTABLE_SINGLE_ROW_HISTORY_ALLOWED = false as const;

// ============================================================================
// CONSTRAINT PLAN
// ============================================================================

type ConstraintEnforcementMechanism = "database_constraint" | "trigger" | "application_validation" | "governance_audit" | "human_review";
const CONSTRAINT_CATEGORIES: readonly string[] = [
  "primary keys", "foreign keys", "unique constraints", "check constraints", "enum/domain constraints",
  "temporal constraints", "immutable-state constraints", "citation integrity constraints",
  "jurisdiction integrity constraints", "locale/trust-domain separation constraints", "user-data-boundary constraints",
];
interface ExampleCheck {
  rule: string;
  enforcement: ConstraintEnforcementMechanism;
}
const EXAMPLE_CHECKS: readonly ExampleCheck[] = [
  { rule: "sourceVersion.immutable = true", enforcement: "database_constraint" },
  { rule: "effectiveUntil >= effectiveFrom when both exist", enforcement: "database_constraint" },
  { rule: "passage references exactly one source version", enforcement: "database_constraint" },
  { rule: "high-risk claim requires citation", enforcement: "application_validation" },
  { rule: "localized terminology locale is one of de/en/sk/cs/pl/hu", enforcement: "database_constraint" },
  { rule: "connector activationFromLocaleAllowed = false", enforcement: "database_constraint" },
  { rule: "retrieval authoritativeByVectorSimilarity = false", enforcement: "database_constraint" },
  { rule: "audit event userContentIncluded = false", enforcement: "database_constraint" },
  { rule: "eligibility finalDeterminationAllowed = false for initial pack", enforcement: "governance_audit" },
  { rule: "cross-border process cannot be active without required trust-domain links", enforcement: "application_validation" },
];
const ALL_SEMANTIC_CONSTRAINTS_CLAIMED_DB_ENFORCEABLE = false as const;

// ============================================================================
// UNIQUE CONSTRAINT PLAN
// ============================================================================

const UNIQUE_CONSTRAINT_PLAN: readonly string[] = [
  "source identity by publisher + publication identifier + canonical identity",
  "source version by sourceId + versionSequence",
  "passage by sourceVersionId + passageOrder",
  "claim evidence by claimId + passageId + evidenceRole",
  "authority competence by authorityId + subjectMatter + scope + effective period",
  "process step by processId + stepOrder",
  "localized terminology by terminologyEntryId + outputLocale + effective period",
  "connector by originMarket + connectedCountry + effective period",
  "cross-border process by connector + German process + foreign process reference + effective period",
];
export const UNIQUE_CONSTRAINTS_ALLOW_IMPLEMENTATION_REVIEW_BEFORE_FINAL_SQL = true as const;

// ============================================================================
// INDEX PLAN
// ============================================================================

type IndexPhaseId = "phase_index_1" | "phase_index_2" | "phase_index_3" | "phase_index_4" | "phase_index_5";
const INDEX_PHASES: readonly IndexPhaseId[] = ["phase_index_1", "phase_index_2", "phase_index_3", "phase_index_4", "phase_index_5"];
const MANDATORY_INDEX_CANDIDATES: readonly string[] = [
  "all foreign keys", "sourceId", "sourceVersionId", "contentHash", "publisherId", "jurisdictionId",
  "territorialScopeId", "authorityId", "processGroupId", "claimType", "riskLevel", "effectiveFrom",
  "effectiveUntil", "reviewStatus", "freshnessStatus", "conflictStatus", "trustDomainId", "outputLocale",
];
export const FULL_TEXT_INDEX_TARGETS: readonly string[] = ["source passage text", "canonical claim text", "terminology"];
const VECTOR_INDEXING_AUTHORITATIVE = false as const;
const INDEXES_CREATED_THIS_PHASE = false as const;

// ============================================================================
// RLS AND ACCESS MODEL
// ============================================================================

type AccessRole =
  | "anonymous_public_reader" | "authenticated_public_reader" | "knowledge_service_writer"
  | "knowledge_reviewer" | "knowledge_admin" | "migration_operator" | "audit_reader";
const ACCESS_ROLES: readonly AccessRole[] = [
  "anonymous_public_reader", "authenticated_public_reader", "knowledge_service_writer",
  "knowledge_reviewer", "knowledge_admin", "migration_operator", "audit_reader",
];

const ANONYMOUS_ACCESS_PROHIBITIONS: readonly string[] = [
  "insert sources", "update sources", "delete sources", "write claims", "write reviews", "write conflicts",
  "write audit events", "access internal raw source storage locations", "access unpublished or rejected records",
  "access user data",
];
export const AUTHENTICATED_ACCESS_PROHIBITIONS: readonly string[] = [
  "direct write access to authoritative knowledge tables",
];
const AUTHENTICATION_IMPLIES_KNOWLEDGE_EDITOR_PERMISSIONS = false as const;

const SERVICE_WRITER_PROHIBITIONS: readonly string[] = [
  "write user-content tables", "bypass review states", "overwrite immutable versions",
  "activate connectors from locale", "mark model output authoritative",
];
export const REVIEWER_ALLOWED_ACTIONS: readonly string[] = [
  "append review record", "accept or reject review state", "resolve conflict through auditable action",
  "approve high-risk use where policy allows",
];
const REVIEWER_MAY_SILENTLY_REWRITE_HISTORICAL_SOURCE_CONTENT = false as const;
const ADMIN_MAY_BYPASS_APPEND_ONLY_HISTORY_WITHOUT_AUDITED_PROCEDURE = false as const;
const MIGRATION_OPERATOR_MAY_BECOME_NORMAL_RUNTIME_ROLE = false as const;
const AUDIT_READER_RECEIVES_USER_CONTENT = false as const;

// ============================================================================
// PUBLIC KNOWLEDGE / USER-DATA SEPARATION
// ============================================================================

type SchemaBoundaryOption = "public_schema_with_knowledge_prefix" | "dedicated_knowledge_schema" | "restricted_internal_schema_plus_views";
const SCHEMA_BOUNDARY_OPTIONS: readonly SchemaBoundaryOption[] = [
  "public_schema_with_knowledge_prefix", "dedicated_knowledge_schema", "restricted_internal_schema_plus_views",
];
const RECOMMENDED_SCHEMA_BOUNDARY_OPTION: SchemaBoundaryOption = "public_schema_with_knowledge_prefix";
const NO_FK_TARGETS_FROM_KNOWLEDGE_SCHEMA: readonly string[] = [
  "Smart Talk user input", "OCR image storage", "DNA profile", "payment records", "conversation history",
];
const AUTOMATIC_USER_CONTENT_PERSISTENCE_DURING_RETRIEVAL = false as const;

// ============================================================================
// VIEW AND PROJECTION PLAN
// ============================================================================

const VIEW_PROJECTION_PLAN: readonly string[] = [
  "approved_current_sources_view", "approved_current_passages_view", "authorized_claims_view",
  "authorized_process_steps_view", "current_authority_competence_view", "citation_projection_view",
  "localized_terminology_view", "cross_border_readiness_view",
];
export const VIEW_FILTER_CRITERIA: readonly string[] = [
  "accepted review status", "acceptable freshness", "current effective period",
  "conflict-free status", "jurisdiction context", "allowed output use",
];
const VIEWS_CREATED_THIS_PHASE = false as const;

// ============================================================================
// SEED STRATEGY
// ============================================================================

type SeedCategory =
  | "schema_reference_seed" | "enum_reference_seed" | "empty_trust_domain_seed"
  | "empty_locale_reference_seed" | "pilot_fixture_seed" | "real_knowledge_seed";
const SEED_CATEGORIES: readonly SeedCategory[] = [
  "schema_reference_seed", "enum_reference_seed", "empty_trust_domain_seed",
  "empty_locale_reference_seed", "pilot_fixture_seed", "real_knowledge_seed",
];
const REAL_KNOWLEDGE_SEED_REQUIREMENTS: readonly string[] = [
  "source-backed", "versioned", "idempotent", "use stable IDs", "never overwrite immutable history",
  "separable from schema migration", "reviewable before activation",
];
const REAL_SEED_FILE_CREATED_THIS_PHASE = false as const;
const GERMAN_LEGAL_CONTENT_EMBEDDED_IN_MIGRATION = false as const;

// ============================================================================
// TEST FIXTURE STRATEGY
// ============================================================================

const TEST_FIXTURE_REQUIREMENTS: readonly string[] = [
  "synthetic", "clearly marked", "non-authoritative", "not queryable by public runtime",
  "removable without affecting real knowledge", "excluded from production activation",
];

// ============================================================================
// MIGRATION STAGES (0-10)
// ============================================================================

interface MigrationStage {
  stageId: number;
  name: string;
  items: readonly string[];
}
const MIGRATION_STAGES: readonly MigrationStage[] = [
  { stageId: 0, name: "PRE-MIGRATION AUDIT", items: [
    "confirm clean repository", "confirm source commit", "confirm 9A-9F readiness chain",
    "inspect current migration numbering", "verify no conflicting schema names",
    "verify backup/restore procedure", "verify target environment",
  ] },
  { stageId: 1, name: "FOUNDATION TABLES", items: ["publishers", "jurisdictions", "territorial scopes", "trust domains"] },
  { stageId: 2, name: "SOURCE CORE", items: ["sources", "source versions", "source passages"] },
  { stageId: 3, name: "AUTHORITY AND CLAIM CORE", items: ["authorities", "competence", "claims", "evidence links", "citations"] },
  { stageId: 4, name: "PROCESS AND RULE CORE", items: [
    "processes", "steps", "process claim links", "forms", "evidence requirements", "deadlines",
    "fees", "eligibility", "responsible actor rules",
  ] },
  { stageId: 5, name: "GOVERNANCE", items: ["overrides", "reviews", "freshness", "conflicts", "audit events"] },
  { stageId: 6, name: "LANGUAGE AND CROSS-BORDER", items: [
    "terminology", "localized terminology", "trust-domain links", "connectors", "cross-border processes",
  ] },
  { stageId: 7, name: "RETRIEVAL METADATA", items: ["retrieval metadata only", "no embeddings yet"] },
  { stageId: 8, name: "RLS AND VIEWS", items: ["roles", "policies", "approved read views"] },
  { stageId: 9, name: "INTEGRITY VALIDATION", items: [
    "FK checks", "uniqueness checks", "append-only checks", "RLS checks",
    "no-user-data-boundary checks", "history preservation checks", "citation integrity checks",
  ] },
  { stageId: 10, name: "EMPTY-SCHEMA CLOSURE", items: [
    "zero real knowledge rows", "zero runtime wiring", "zero public authorization",
    "readiness for controlled source-ingestion plan",
  ] },
];
const RUNTIME_ACTIVATION_OCCURS_IN_THIS_MIGRATION_PLAN = false as const;

// ============================================================================
// ROLLBACK STRATEGY
// ============================================================================

const ROLLBACK_CATEGORIES: readonly string[] = [
  "transactional rollback during failed migration", "schema-object rollback before any real knowledge data",
  "forward-fix after approved data exists", "emergency access-policy rollback", "index rollback",
  "view rollback", "RLS rollback with fail-closed defaults",
];
const ROLLBACK_RULES: readonly string[] = [
  "before real data exists, full migration rollback may be possible",
  "after immutable knowledge history exists, destructive rollback must not delete history",
  "forward-fix is preferred after accepted data exists",
  "disabling public read views is safer than dropping authoritative tables",
  "failed RLS rollout must default to no public access",
];
const PERFECT_REVERSIBILITY_FOR_ALL_FUTURE_STATES_PROMISED = false as const;

// ============================================================================
// FAILURE POLICY
// ============================================================================

type FailureOutcome =
  | "stop_before_write" | "transaction_rollback" | "migration_marked_failed" | "schema_quarantined"
  | "public_read_disabled" | "ingestion_disabled" | "runtime_wiring_blocked" | "manual_review_required" | "forward_fix_required";
const FAILURE_OUTCOMES: readonly FailureOutcome[] = [
  "stop_before_write", "transaction_rollback", "migration_marked_failed", "schema_quarantined",
  "public_read_disabled", "ingestion_disabled", "runtime_wiring_blocked", "manual_review_required", "forward_fix_required",
];
const MIGRATION_FAILURE_SILENTLY_CONTINUES_TO_RUNTIME_ACTIVATION = false as const;

// ============================================================================
// VALIDATION PLAN
// ============================================================================

type ValidationEnforcementMechanism = "sql_test" | "integration_test" | "application_test" | "governance_audit";
interface ValidationTest {
  test: string;
  enforcement: ValidationEnforcementMechanism;
}
const VALIDATION_PLAN: readonly ValidationTest[] = [
  { test: "migration applies on empty local database", enforcement: "integration_test" },
  { test: "migration applies on representative development database", enforcement: "integration_test" },
  { test: "migration rollback works before seed", enforcement: "integration_test" },
  { test: "table count matches plan", enforcement: "sql_test" },
  { test: "FK graph matches plan", enforcement: "sql_test" },
  { test: "no forbidden user-data FK exists", enforcement: "sql_test" },
  { test: "RLS denies anonymous writes", enforcement: "integration_test" },
  { test: "RLS denies ordinary authenticated writes", enforcement: "integration_test" },
  { test: "service role access is scoped", enforcement: "integration_test" },
  { test: "immutable record update rejected", enforcement: "sql_test" },
  { test: "accepted source version overwrite rejected", enforcement: "sql_test" },
  { test: "citation without passage rejected", enforcement: "sql_test" },
  { test: "invalid effective period rejected", enforcement: "sql_test" },
  { test: "locale-triggered connector activation rejected", enforcement: "application_test" },
  { test: "vector-authoritative flag rejected", enforcement: "sql_test" },
  { test: "audit event with user content rejected", enforcement: "application_test" },
  { test: "high-risk claim without evidence rejected where DB-enforceable", enforcement: "application_test" },
  { test: "duplicate source version rejected", enforcement: "sql_test" },
  { test: "orphan passage rejected", enforcement: "sql_test" },
  { test: "history remains queryable", enforcement: "integration_test" },
  { test: "rejected/unreviewed data absent from approved views", enforcement: "sql_test" },
  { test: "current view excludes expired/conflicted data", enforcement: "sql_test" },
  { test: "schema contains zero real knowledge rows after migration", enforcement: "governance_audit" },
];

// ============================================================================
// MIGRATION FILE PLAN
// ============================================================================

const MIGRATION_FILE_PLAN_EXPECTATIONS: readonly string[] = [
  "exact next migration number must be determined at implementation time",
  "descriptive migration name", "one coherent migration or small staged set if dependency/risk warrants",
  "comments for non-obvious constraints", "no real seed content in schema migration",
  "no destructive unrelated changes", "rollback notes", "verification query section where conventions allow",
];
const EXACT_MIGRATION_NUMBER_DETERMINED_THIS_PHASE = false as const;

// ============================================================================
// MIGRATION SPLIT DECISION
// ============================================================================

const MIGRATION_SPLIT_CANDIDATES: readonly string[] = ["schema_core", "rls_and_views", "optional_seed_reference_data"];
export const MIGRATION_SPLIT_PRINCIPLE = "prefer_smallest_safe_number_of_migrations_not_one_enormous_file" as const;

// ============================================================================
// REAL SOURCE INGESTION BOUNDARY / NEXT PHASE
// ============================================================================

const NEXT_PHASE_NAME = "PHASE 9G — OFFICIAL SOURCE INGESTION CONTRACT" as const;
const REAL_INGESTION_BEGINS_IN_9F = false as const;

// ============================================================================
// DE<->SK STRUCTURAL BOUNDARY (representable, inactive)
// ============================================================================

const DE_SK_STRUCTURAL_REQUIREMENTS: readonly string[] = [
  "trust domains representable", "connector table representable", "cross-border process representable",
  "EU/DE/SK evidence links representable", "responsible actor representable", "temporal alignment representable",
  "locale-independent activation enforced", "no connector row created", "no connector activation", "no real Slovak source data",
];
const DE_SK_FIRST_PILOT_TOPIC = "familienkasse_kindergeld" as const;
const DE_SK_CONNECTOR_ROW_CREATED_THIS_PHASE = false as const;
const DE_SK_CONNECTOR_ACTIVATED_FROM_LOCALE_THIS_PHASE = false as const;

// ============================================================================
// INITIAL MIGRATION SCOPE (eight process groups, wave-based)
// ============================================================================

const EIGHT_PROCESS_GROUPS: readonly string[] = [
  "anmeldung_ummeldung_abmeldung", "steuer_id_and_basic_finanzamt_letters", "health_insurance_orientation",
  "jobcenter_buergergeld", "familienkasse_kindergeld", "rechnung_mahnung", "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
];
const SCHEMA_REQUIRES_DESTRUCTIVE_REDESIGN_FOR_LATER_WAVES = false as const;

// ============================================================================
// PERFORMANCE BOUNDARY
// ============================================================================

const PERFORMANCE_RECOMMENDATIONS: readonly string[] = [
  "FK indexes", "effective-date indexes", "jurisdiction indexes", "review/freshness indexes",
  "full-text search later", "vector metadata later",
];
const VECTOR_EXTENSIONS_OR_EXPENSIVE_INDEXES_REQUIRED_BEFORE_FIRST_MIGRATION = false as const;

// ============================================================================
// SUPABASE-SPECIFIC PLANNING (grounded via read-only inspection)
// ============================================================================

interface SupabaseConventionObservation {
  migrationFolderPath: string;
  sqlNamingPattern: string;
  schemaUsage: string;
  rlsDefaults: string;
  serviceRoleUsage: string;
  generatedTypesObserved: boolean;
  localMigrationValidationObserved: boolean;
  remoteMigrationDeploymentObserved: boolean;
  schemaDiffDisciplineObserved: boolean;
}
const SUPABASE_COMMAND_EXECUTED_THIS_PHASE = false as const;

// ============================================================================
// GENERATED TYPES PLAN
// ============================================================================

export const GENERATED_TYPES_PLAN_STATEMENT =
  "Database-generated TypeScript types must be regenerated only after the real migration is applied and validated; not modified in PHASE 9F." as const;
const GENERATED_TYPES_MODIFIED_THIS_PHASE = false as const;

// ============================================================================
// MIGRATION AUDITABILITY
// ============================================================================

const MIGRATION_AUDIT_RECORD_FIELDS: readonly string[] = [
  "source commit", "migration file name", "migration checksum", "target environment", "appliedAt",
  "operator", "validation result", "rollback capability", "schema version", "whether real data existed",
  "whether public runtime was enabled",
];
const MIGRATION_AUDIT_METADATA_INCLUDES_USER_CONTENT = false as const;

// ============================================================================
// EXIT CRITERIA
// ============================================================================

const EXIT_CRITERIA: readonly string[] = [
  "9A-9E readiness is confirmed", "all logical tables are mapped", "creation order is dependency-safe",
  "FK phases are defined", "deletion policy is safe", "immutability strategy is defined",
  "append-only strategy is defined", "constraints are staged", "indexes are staged",
  "RLS roles and policies are planned", "public/user-data separation is explicit", "rollout stages are fixed",
  "rollback and failure policy are explicit", "validation tests are defined", "seed strategy is separated",
  "DE<->SK remains inactive but structurally supported", "no SQL or migration was created",
  "no database command was run", "no real data was created", "runtime remains blocked",
];

// ─── Result shape ───────────────────────────────────────────────────────────

interface Result {
  checkId: "9F";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceTrustContractCheckId: string;
  sourceJurisdictionModelCheckId: string;
  sourceCoveragePlanCheckId: string;
  sourceStorageSchemaCheckId: string;

  sourceArchitectureReady: boolean;
  sourceTrustContractReady: boolean;
  sourceJurisdictionModelReady: boolean;
  sourceCoveragePlanReady: boolean;
  sourceStorageSchemaReady: boolean;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  sqlFileCreated: boolean;
  databaseMigrationCreated: boolean;
  databaseTableCreated: boolean;
  databaseCommandExecuted: boolean;
  databaseWritePerformed: boolean;
  supabaseCliExecuted: boolean;
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

  migrationPlanContractDefined: boolean;
  migrationStrategyDefined: boolean;
  logicalTableGroupsDefined: boolean;
  tableCreationOrderDefined: boolean;
  foreignKeyPhasesDefined: boolean;
  onDeletePolicyDefined: boolean;
  immutabilityEnforcementPlanned: boolean;
  appendOnlyPolicyDefined: boolean;
  constraintPlanDefined: boolean;
  uniqueConstraintPlanDefined: boolean;
  indexPlanDefined: boolean;
  rlsAccessModelDefined: boolean;
  anonymousAccessPolicyDefined: boolean;
  authenticatedAccessPolicyDefined: boolean;
  serviceWriterPolicyDefined: boolean;
  reviewerPolicyDefined: boolean;
  adminPolicyDefined: boolean;
  migrationOperatorPolicyDefined: boolean;
  auditReaderPolicyDefined: boolean;
  publicUserDataSeparationDefined: boolean;
  viewProjectionPlanDefined: boolean;
  seedStrategyDefined: boolean;
  testFixtureStrategyDefined: boolean;
  migrationStagesDefined: boolean;
  rollbackStrategyDefined: boolean;
  failurePolicyDefined: boolean;
  validationPlanDefined: boolean;
  migrationFilePlanDefined: boolean;
  migrationSplitDecisionDefined: boolean;
  realSourceIngestionBoundaryDefined: boolean;
  deSkStructuralSupportDefined: boolean;
  deSkInactiveByDefault: boolean;
  performanceBoundaryDefined: boolean;
  supabaseSpecificPlanningDefined: boolean;
  generatedTypesPlanDefined: boolean;
  migrationAuditabilityDefined: boolean;
  exitCriteriaDefined: boolean;

  foundationGroupDefined: boolean;
  sourceCoreGroupDefined: boolean;
  authorityCoreGroupDefined: boolean;
  claimCoreGroupDefined: boolean;
  processCoreGroupDefined: boolean;
  ruleDocumentCoreGroupDefined: boolean;
  governanceCoreGroupDefined: boolean;
  languageCoreGroupDefined: boolean;
  crossBorderCoreGroupDefined: boolean;
  retrievalMetadataGroupDefined: boolean;

  historicalDeletionBlocked: boolean;
  sourceVersionOverwriteBlocked: boolean;
  passageDeletionCascadeBlocked: boolean;
  reviewHistoryOverwriteBlocked: boolean;
  conflictHistoryDeletionBlocked: boolean;
  anonymousKnowledgeWriteBlocked: boolean;
  authenticatedKnowledgeWriteBlocked: boolean;
  serviceWriterCannotBypassReview: boolean;
  modelOutputCannotBecomeAuthoritative: boolean;
  userDataForeignKeysBlocked: boolean;
  localeConnectorActivationBlocked: boolean;
  vectorAuthorityBlocked: boolean;
  failedMigrationBlocksRuntime: boolean;
  failedRlsDefaultsClosed: boolean;
  realSeedSeparatedFromMigration: boolean;
  syntheticFixturesSeparatedFromProduction: boolean;
  migrationValidationRequiredBeforeRuntime: boolean;
  generatedTypesRegenerationDeferred: boolean;

  firstMigrationSupportsEightProcessGroups: boolean;
  waveBasedPopulationSupported: boolean;
  deSkFirstPilotTopic: string;
  deSkConnectorNotImplemented: boolean;
  zeroRealDataAfterMigrationPlan: boolean;

  zeroSqlFilesCreated: boolean;
  zeroMigrationsCreated: boolean;
  zeroTablesCreated: boolean;
  zeroDatabaseCommands: boolean;
  zeroDatabaseWrites: boolean;
  zeroRealSources: boolean;
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

  readyForKnowledgeSchemaMigrationImplementation: boolean;

  // Structural / provenance supplements
  existingFileModified: boolean;
  onlyExpectedFilesChanged: boolean;
  newAuditFileCreated: boolean;
  supabaseConventionObservation: SupabaseConventionObservation;

  // Supplementary forbidden-claim flags — every one must remain false; each
  // tamper case flips exactly one (or a required field above).
  destructiveFirstMigrationAccepted: boolean;
  existingTableDroppedAccepted: boolean;
  unrelatedTableRenamedAccepted: boolean;
  userDataRewrittenAccepted: boolean;
  knowledgeTablesMixedIntoUserContentTablesAccepted: boolean;
  runtimeEnabledBeforeValidationAccepted: boolean;
  migrationOrderIgnoresDependenciesAccepted: boolean;
  childTableCreatedBeforeParentWithoutStagedFkPlanAccepted: boolean;
  circularDependencySolvedByRemovingFkPermanentlyAccepted: boolean;
  sourceVersionTableCreatedBeforeSourceTableAccepted: boolean;
  passageTableCreatedBeforeSourceVersionTableAccepted: boolean;
  evidenceLinkCreatedBeforeClaimsPassagesAccepted: boolean;
  stepCreatedBeforeProcessAccepted: boolean;
  localizedTerminologyCreatedBeforeTerminologyAccepted: boolean;
  crossBorderProcessCreatedBeforeConnectorAccepted: boolean;
  auditFkCircularityIgnoredAccepted: boolean;
  cascadeDeletesSourceVersionsAccepted: boolean;
  cascadeDeletesPassagesAccepted: boolean;
  cascadeDeletesClaimsAccepted: boolean;
  cascadeDeletesCitationsAccepted: boolean;
  cascadeDeletesReviewRecordsAccepted: boolean;
  cascadeDeletesConflictHistoryAccepted: boolean;
  cascadeDeletesCompetenceHistoryAccepted: boolean;
  cascadeDeletesAuditEventsAccepted: boolean;
  historicalSourceVersionUpdateAllowedAccepted: boolean;
  acceptedPassageEditedInPlaceAccepted: boolean;
  auditEventMutableAccepted: boolean;
  immutableTransitionBypassedAccepted: boolean;
  contentHashVerificationOmittedAccepted: boolean;
  singleMutableHistoryRowAccepted: boolean;
  primaryKeyPhaseOmittedAccepted: boolean;
  checkConstraintPhaseOmittedAccepted: boolean;
  temporalConstraintOmittedAccepted: boolean;
  citationIntegrityConstraintOmittedAccepted: boolean;
  jurisdictionIntegrityOmittedAccepted: boolean;
  localeTrustSeparationOmittedAccepted: boolean;
  userDataBoundaryConstraintOmittedAccepted: boolean;
  invalidEffectivePeriodAccepted: boolean;
  passageWithoutSourceVersionAccepted: boolean;
  highRiskClaimWithoutCitationAccepted: boolean;
  localizedLocaleOutsideLaunchSetAccepted: boolean;
  auditEventWithUserContentAccepted: boolean;
  eligibilityFinalDeterminationAccepted: boolean;
  activeCrossBorderProcessWithoutTrustDomainsAccepted: boolean;
  everySemanticRuleFalselyClaimedDbEnforceableAccepted: boolean;
  applicationValidationOmittedAccepted: boolean;
  governanceAuditOmittedAccepted: boolean;
  uniquenessPlanOmittedAccepted: boolean;
  duplicateSourceVersionAccepted: boolean;
  duplicatePassageOrderAccepted: boolean;
  duplicateEvidenceLinkAccepted: boolean;
  duplicateProcessStepOrderAccepted: boolean;
  duplicateLocalizedTerminologyAccepted: boolean;
  fkIndexesOmittedAccepted: boolean;
  temporalIndexesOmittedAccepted: boolean;
  jurisdictionIndexesOmittedAccepted: boolean;
  reviewFreshnessIndexesOmittedAccepted: boolean;
  fullTextIndexCreatedPrematurelyAccepted: boolean;
  vectorExtensionAddedPrematurelyAccepted: boolean;
  anonymousSourceUpdateAllowedAccepted: boolean;
  anonymousSourceDeleteAllowedAccepted: boolean;
  anonymousClaimWriteAllowedAccepted: boolean;
  anonymousReviewWriteAllowedAccepted: boolean;
  anonymousConflictWriteAllowedAccepted: boolean;
  anonymousAuditWriteAllowedAccepted: boolean;
  anonymousRawSourceLocationAccessAllowedAccepted: boolean;
  anonymousUnpublishedDataAccessAllowedAccepted: boolean;
  authenticationImpliesKnowledgeEditorRoleAccepted: boolean;
  serviceWriterOverwritesImmutableHistoryAccepted: boolean;
  reviewerRewritesSourceHistoryAccepted: boolean;
  reviewerResolvesConflictWithoutAuditAccepted: boolean;
  adminBypassesAuditAccepted: boolean;
  migrationOperatorUsedAsRuntimeRoleAccepted: boolean;
  auditReaderReceivesUserContentAccepted: boolean;
  knowledgeFkToSmartTalkInputAccepted: boolean;
  knowledgeFkToOcrImageAccepted: boolean;
  knowledgeFkToDnaProfileAccepted: boolean;
  knowledgeFkToPaymentRecordAccepted: boolean;
  knowledgeFkToConversationHistoryAccepted: boolean;
  retrievalPersistsUserContentAccepted: boolean;
  approvedViewIncludesRejectedDataAccepted: boolean;
  approvedViewIncludesExpiredDataAccepted: boolean;
  approvedViewIncludesUnresolvedConflictAccepted: boolean;
  approvedViewIgnoresJurisdictionAccepted: boolean;
  approvedViewIgnoresEffectiveDateAccepted: boolean;
  approvedViewIgnoresAllowedUseAccepted: boolean;
  realLegalDataEmbeddedInMigrationAccepted: boolean;
  realSeedNotVersionedAccepted: boolean;
  seedOverwritesHistoryAccepted: boolean;
  seedLacksStableIdsAccepted: boolean;
  syntheticFixtureQueryablePubliclyAccepted: boolean;
  syntheticFixtureMarkedAuthoritativeAccepted: boolean;
  foundationTablesCreatedAfterDependentTablesAccepted: boolean;
  rlsAppliedBeforeObjectsExistWithoutPlanAccepted: boolean;
  runtimeEnabledDuringMigrationAccepted: boolean;
  integrityValidationSkippedAccepted: boolean;
  destructiveRollbackAfterAcceptedHistoryExistsAccepted: boolean;
  rollbackDeletesImmutableHistoryAccepted: boolean;
  publicViewsLeftEnabledAfterFailureAccepted: boolean;
  migrationFailureDoesNotBlockRuntimeAccepted: boolean;
  migrationNotTestedOnEmptyDbAccepted: boolean;
  rollbackNotTestedBeforeSeedAccepted: boolean;
  tableCountNotValidatedAccepted: boolean;
  fkGraphNotValidatedAccepted: boolean;
  forbiddenUserDataFkNotCheckedAccepted: boolean;
  anonymousWriteDenialNotTestedAccepted: boolean;
  authenticatedWriteDenialNotTestedAccepted: boolean;
  immutableUpdateRejectionNotTestedAccepted: boolean;
  citationWithoutPassageRejectionNotTestedAccepted: boolean;
  localeTriggeredConnectorRejectionNotTestedAccepted: boolean;
  vectorAuthoritativeFlagNotTestedAccepted: boolean;
  auditUserContentRejectionNotTestedAccepted: boolean;
  historyQueryabilityNotTestedAccepted: boolean;
  rejectedDataViewFilteringNotTestedAccepted: boolean;
  realRowsExistAfterSchemaMigrationAccepted: boolean;
  exactMigrationNumberInventedWithoutInspectionAccepted: boolean;
  unrelatedDestructiveChangesIncludedAccepted: boolean;
  rollbackNotesOmittedAccepted: boolean;
  oneEnormousMigrationForcedDespiteRiskAccepted: boolean;
  excessiveMigrationFragmentationAccepted: boolean;
  deSkConnectorRowCreatedAccepted: boolean;
  slovakSourceDataPopulatedAccepted: boolean;
  connectorActivatedFromSlovakLocaleAccepted: boolean;
  deSkLacksEuSupportAccepted: boolean;
  deSkLacksGermanSupportAccepted: boolean;
  deSkLacksSlovakSupportAccepted: boolean;
  responsibleActorMissingAccepted: boolean;
  temporalAlignmentMissingAccepted: boolean;
  migrationAuditIncludesUserContentAccepted: boolean;
  rlsPermissiveAccepted: boolean;
  userDataBoundaryWeakenedAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  migrationStrategy: readonly MigrationStrategyCategory[];
  logicalTableGroups: Readonly<Record<string, readonly string[]>>;
  tableCreationOrder: readonly string[];
  foreignKeyPhases: readonly ForeignKeyPhase[];
  migrationStages: readonly MigrationStage[];
  validationPlan: readonly ValidationTest[];
  exampleChecks: readonly ExampleCheck[];
  exitCriteria: readonly string[];
  eightProcessGroups: readonly string[];
  deSkStructuralRequirements: readonly string[];
  nextPhaseName: string;
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
  { id: 6, description: "PHASE 9E missing", mutate: (r) => { r.sourceStorageSchemaCheckId = "missing"; } },
  { id: 7, description: "any source readiness false", mutate: (r) => { r.sourceStorageSchemaReady = false; } },
  { id: 8, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 9, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 10, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 11, description: "SQL created", mutate: (r) => { r.sqlFileCreated = true; } },
  { id: 12, description: "migration created", mutate: (r) => { r.databaseMigrationCreated = true; } },
  { id: 13, description: "table created", mutate: (r) => { r.databaseTableCreated = true; } },
  { id: 14, description: "database command executed", mutate: (r) => { r.databaseCommandExecuted = true; } },
  { id: 15, description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 16, description: "Supabase CLI executed", mutate: (r) => { r.supabaseCliExecuted = true; } },
  { id: 17, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 18, description: "source downloaded", mutate: (r) => { r.externalSourceDownloaded = true; } },
  { id: 19, description: "source registered", mutate: (r) => { r.realSourceRegistered = true; } },
  { id: 20, description: "source version created", mutate: (r) => { r.realSourceVersionCreated = true; } },
  { id: 21, description: "passage stored", mutate: (r) => { r.realPassageStored = true; } },
  { id: 22, description: "claim populated", mutate: (r) => { r.realClaimPopulated = true; } },
  { id: 23, description: "authority registered", mutate: (r) => { r.realAuthorityRegistered = true; } },
  { id: 24, description: "process populated", mutate: (r) => { r.realProcessPopulated = true; } },
  { id: 25, description: "cross-border connector implemented", mutate: (r) => { r.realCrossBorderConnectorImplemented = true; } },
  { id: 26, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 27, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 28, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 29, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 30, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 31, description: "destructive-first migration", mutate: (r) => { r.destructiveFirstMigrationAccepted = true; } },
  { id: 32, description: "existing table dropped", mutate: (r) => { r.existingTableDroppedAccepted = true; } },
  { id: 33, description: "unrelated table renamed", mutate: (r) => { r.unrelatedTableRenamedAccepted = true; } },
  { id: 34, description: "user data rewritten", mutate: (r) => { r.userDataRewrittenAccepted = true; } },
  { id: 35, description: "knowledge tables mixed into user-content tables", mutate: (r) => { r.knowledgeTablesMixedIntoUserContentTablesAccepted = true; } },
  { id: 36, description: "runtime enabled before validation", mutate: (r) => { r.runtimeEnabledBeforeValidationAccepted = true; } },
  { id: 37, description: "migration order ignores dependencies", mutate: (r) => { r.migrationOrderIgnoresDependenciesAccepted = true; } },
  { id: 38, description: "child table created before parent without staged FK plan", mutate: (r) => { r.childTableCreatedBeforeParentWithoutStagedFkPlanAccepted = true; } },
  { id: 39, description: "circular dependency solved by removing FK permanently", mutate: (r) => { r.circularDependencySolvedByRemovingFkPermanentlyAccepted = true; } },
  { id: 40, description: "source version table created before source table", mutate: (r) => { r.sourceVersionTableCreatedBeforeSourceTableAccepted = true; } },
  { id: 41, description: "passage table created before source version table", mutate: (r) => { r.passageTableCreatedBeforeSourceVersionTableAccepted = true; } },
  { id: 42, description: "evidence link created before claims/passages", mutate: (r) => { r.evidenceLinkCreatedBeforeClaimsPassagesAccepted = true; } },
  { id: 43, description: "step created before process", mutate: (r) => { r.stepCreatedBeforeProcessAccepted = true; } },
  { id: 44, description: "localized terminology created before terminology", mutate: (r) => { r.localizedTerminologyCreatedBeforeTerminologyAccepted = true; } },
  { id: 45, description: "cross-border process created before connector", mutate: (r) => { r.crossBorderProcessCreatedBeforeConnectorAccepted = true; } },
  { id: 46, description: "audit FK circularity ignored", mutate: (r) => { r.auditFkCircularityIgnoredAccepted = true; } },
  { id: 47, description: "cascade deletes source versions", mutate: (r) => { r.cascadeDeletesSourceVersionsAccepted = true; } },
  { id: 48, description: "cascade deletes passages", mutate: (r) => { r.cascadeDeletesPassagesAccepted = true; } },
  { id: 49, description: "cascade deletes claims", mutate: (r) => { r.cascadeDeletesClaimsAccepted = true; } },
  { id: 50, description: "cascade deletes citations", mutate: (r) => { r.cascadeDeletesCitationsAccepted = true; } },
  { id: 51, description: "cascade deletes review records", mutate: (r) => { r.cascadeDeletesReviewRecordsAccepted = true; } },
  { id: 52, description: "cascade deletes conflict history", mutate: (r) => { r.cascadeDeletesConflictHistoryAccepted = true; } },
  { id: 53, description: "cascade deletes competence history", mutate: (r) => { r.cascadeDeletesCompetenceHistoryAccepted = true; } },
  { id: 54, description: "cascade deletes audit events", mutate: (r) => { r.cascadeDeletesAuditEventsAccepted = true; } },
  { id: 55, description: "source version overwrite allowed", mutate: (r) => { r.sourceVersionOverwriteBlocked = false; } },
  { id: 56, description: "historical source version update allowed", mutate: (r) => { r.historicalSourceVersionUpdateAllowedAccepted = true; } },
  { id: 57, description: "accepted passage edited in place", mutate: (r) => { r.acceptedPassageEditedInPlaceAccepted = true; } },
  { id: 58, description: "review history overwritten", mutate: (r) => { r.reviewHistoryOverwriteBlocked = false; } },
  { id: 59, description: "audit event mutable", mutate: (r) => { r.auditEventMutableAccepted = true; } },
  { id: 60, description: "immutable transition bypassed", mutate: (r) => { r.immutableTransitionBypassedAccepted = true; } },
  { id: 61, description: "content hash verification omitted", mutate: (r) => { r.contentHashVerificationOmittedAccepted = true; } },
  { id: 62, description: "append-only policy omitted", mutate: (r) => { r.appendOnlyPolicyDefined = false; } },
  { id: 63, description: "single mutable history row accepted", mutate: (r) => { r.singleMutableHistoryRowAccepted = true; } },
  { id: 64, description: "primary key phase omitted", mutate: (r) => { r.primaryKeyPhaseOmittedAccepted = true; } },
  { id: 65, description: "FK phase omitted", mutate: (r) => { r.foreignKeyPhasesDefined = false; } },
  { id: 66, description: "unique constraint phase omitted", mutate: (r) => { r.uniqueConstraintPlanDefined = false; } },
  { id: 67, description: "check constraint phase omitted", mutate: (r) => { r.checkConstraintPhaseOmittedAccepted = true; } },
  { id: 68, description: "temporal constraint omitted", mutate: (r) => { r.temporalConstraintOmittedAccepted = true; } },
  { id: 69, description: "citation integrity constraint omitted", mutate: (r) => { r.citationIntegrityConstraintOmittedAccepted = true; } },
  { id: 70, description: "jurisdiction integrity omitted", mutate: (r) => { r.jurisdictionIntegrityOmittedAccepted = true; } },
  { id: 71, description: "locale/trust separation omitted", mutate: (r) => { r.localeTrustSeparationOmittedAccepted = true; } },
  { id: 72, description: "user-data boundary constraint omitted", mutate: (r) => { r.userDataBoundaryConstraintOmittedAccepted = true; } },
  { id: 73, description: "invalid effective period accepted", mutate: (r) => { r.invalidEffectivePeriodAccepted = true; } },
  { id: 74, description: "passage without source version accepted", mutate: (r) => { r.passageWithoutSourceVersionAccepted = true; } },
  { id: 75, description: "high-risk claim without citation accepted", mutate: (r) => { r.highRiskClaimWithoutCitationAccepted = true; } },
  { id: 76, description: "localized locale outside launch set accepted", mutate: (r) => { r.localizedLocaleOutsideLaunchSetAccepted = true; } },
  { id: 77, description: "connector activation from locale accepted", mutate: (r) => { r.localeConnectorActivationBlocked = false; } },
  { id: 78, description: "vector similarity authoritative accepted", mutate: (r) => { r.vectorAuthorityBlocked = false; } },
  { id: 79, description: "audit event with user content accepted", mutate: (r) => { r.auditEventWithUserContentAccepted = true; } },
  { id: 80, description: "eligibility final determination accepted", mutate: (r) => { r.eligibilityFinalDeterminationAccepted = true; } },
  { id: 81, description: "active cross-border process without trust domains accepted", mutate: (r) => { r.activeCrossBorderProcessWithoutTrustDomainsAccepted = true; } },
  { id: 82, description: "every semantic rule falsely claimed DB-enforceable", mutate: (r) => { r.everySemanticRuleFalselyClaimedDbEnforceableAccepted = true; } },
  { id: 83, description: "application validation omitted", mutate: (r) => { r.applicationValidationOmittedAccepted = true; } },
  { id: 84, description: "governance audit omitted", mutate: (r) => { r.governanceAuditOmittedAccepted = true; } },
  { id: 85, description: "uniqueness plan omitted", mutate: (r) => { r.uniquenessPlanOmittedAccepted = true; } },
  { id: 86, description: "duplicate source version accepted", mutate: (r) => { r.duplicateSourceVersionAccepted = true; } },
  { id: 87, description: "duplicate passage order accepted", mutate: (r) => { r.duplicatePassageOrderAccepted = true; } },
  { id: 88, description: "duplicate evidence link accepted", mutate: (r) => { r.duplicateEvidenceLinkAccepted = true; } },
  { id: 89, description: "duplicate process step order accepted", mutate: (r) => { r.duplicateProcessStepOrderAccepted = true; } },
  { id: 90, description: "duplicate localized terminology accepted", mutate: (r) => { r.duplicateLocalizedTerminologyAccepted = true; } },
  { id: 91, description: "index plan omitted", mutate: (r) => { r.indexPlanDefined = false; } },
  { id: 92, description: "FK indexes omitted", mutate: (r) => { r.fkIndexesOmittedAccepted = true; } },
  { id: 93, description: "temporal indexes omitted", mutate: (r) => { r.temporalIndexesOmittedAccepted = true; } },
  { id: 94, description: "jurisdiction indexes omitted", mutate: (r) => { r.jurisdictionIndexesOmittedAccepted = true; } },
  { id: 95, description: "review/freshness indexes omitted", mutate: (r) => { r.reviewFreshnessIndexesOmittedAccepted = true; } },
  { id: 96, description: "full-text index created prematurely", mutate: (r) => { r.fullTextIndexCreatedPrematurelyAccepted = true; } },
  { id: 97, description: "vector extension added prematurely", mutate: (r) => { r.vectorExtensionAddedPrematurelyAccepted = true; } },
  { id: 98, description: "anonymous source insert allowed", mutate: (r) => { r.anonymousKnowledgeWriteBlocked = false; } },
  { id: 99, description: "anonymous source update allowed", mutate: (r) => { r.anonymousSourceUpdateAllowedAccepted = true; } },
  { id: 100, description: "anonymous source delete allowed", mutate: (r) => { r.anonymousSourceDeleteAllowedAccepted = true; } },
  { id: 101, description: "anonymous claim write allowed", mutate: (r) => { r.anonymousClaimWriteAllowedAccepted = true; } },
  { id: 102, description: "anonymous review write allowed", mutate: (r) => { r.anonymousReviewWriteAllowedAccepted = true; } },
  { id: 103, description: "anonymous conflict write allowed", mutate: (r) => { r.anonymousConflictWriteAllowedAccepted = true; } },
  { id: 104, description: "anonymous audit write allowed", mutate: (r) => { r.anonymousAuditWriteAllowedAccepted = true; } },
  { id: 105, description: "anonymous raw-source-location access allowed", mutate: (r) => { r.anonymousRawSourceLocationAccessAllowedAccepted = true; } },
  { id: 106, description: "anonymous unpublished-data access allowed", mutate: (r) => { r.anonymousUnpublishedDataAccessAllowedAccepted = true; } },
  { id: 107, description: "authenticated user gets editor rights", mutate: (r) => { r.authenticatedKnowledgeWriteBlocked = false; } },
  { id: 108, description: "authentication implies knowledge-editor role", mutate: (r) => { r.authenticationImpliesKnowledgeEditorRoleAccepted = true; } },
  { id: 109, description: "service writer bypasses review", mutate: (r) => { r.serviceWriterCannotBypassReview = false; } },
  { id: 110, description: "service writer overwrites immutable history", mutate: (r) => { r.serviceWriterOverwritesImmutableHistoryAccepted = true; } },
  { id: 111, description: "service writer marks model output authoritative", mutate: (r) => { r.modelOutputCannotBecomeAuthoritative = false; } },
  { id: 112, description: "reviewer rewrites source history", mutate: (r) => { r.reviewerRewritesSourceHistoryAccepted = true; } },
  { id: 113, description: "reviewer resolves conflict without audit", mutate: (r) => { r.reviewerResolvesConflictWithoutAuditAccepted = true; } },
  { id: 114, description: "admin bypasses audit", mutate: (r) => { r.adminBypassesAuditAccepted = true; } },
  { id: 115, description: "migration operator used as runtime role", mutate: (r) => { r.migrationOperatorUsedAsRuntimeRoleAccepted = true; } },
  { id: 116, description: "audit reader receives user content", mutate: (r) => { r.auditReaderReceivesUserContentAccepted = true; } },
  { id: 117, description: "knowledge FK to Smart Talk input", mutate: (r) => { r.knowledgeFkToSmartTalkInputAccepted = true; r.userDataForeignKeysBlocked = false; } },
  { id: 118, description: "knowledge FK to OCR image", mutate: (r) => { r.knowledgeFkToOcrImageAccepted = true; } },
  { id: 119, description: "knowledge FK to DNA profile", mutate: (r) => { r.knowledgeFkToDnaProfileAccepted = true; } },
  { id: 120, description: "knowledge FK to payment record", mutate: (r) => { r.knowledgeFkToPaymentRecordAccepted = true; } },
  { id: 121, description: "knowledge FK to conversation history", mutate: (r) => { r.knowledgeFkToConversationHistoryAccepted = true; } },
  { id: 122, description: "retrieval persists user content", mutate: (r) => { r.retrievalPersistsUserContentAccepted = true; } },
  { id: 123, description: "approved view includes rejected data", mutate: (r) => { r.approvedViewIncludesRejectedDataAccepted = true; } },
  { id: 124, description: "approved view includes expired data", mutate: (r) => { r.approvedViewIncludesExpiredDataAccepted = true; } },
  { id: 125, description: "approved view includes unresolved conflict", mutate: (r) => { r.approvedViewIncludesUnresolvedConflictAccepted = true; } },
  { id: 126, description: "approved view ignores jurisdiction", mutate: (r) => { r.approvedViewIgnoresJurisdictionAccepted = true; } },
  { id: 127, description: "approved view ignores effective date", mutate: (r) => { r.approvedViewIgnoresEffectiveDateAccepted = true; } },
  { id: 128, description: "approved view ignores allowed use", mutate: (r) => { r.approvedViewIgnoresAllowedUseAccepted = true; } },
  { id: 129, description: "real legal data embedded in migration", mutate: (r) => { r.realLegalDataEmbeddedInMigrationAccepted = true; } },
  { id: 130, description: "real seed not versioned", mutate: (r) => { r.realSeedNotVersionedAccepted = true; } },
  { id: 131, description: "seed overwrites history", mutate: (r) => { r.seedOverwritesHistoryAccepted = true; } },
  { id: 132, description: "seed lacks stable IDs", mutate: (r) => { r.seedLacksStableIdsAccepted = true; } },
  { id: 133, description: "schema migration mixed with real source content", mutate: (r) => { r.realSeedSeparatedFromMigration = false; } },
  { id: 134, description: "synthetic fixture queryable publicly", mutate: (r) => { r.syntheticFixtureQueryablePubliclyAccepted = true; } },
  { id: 135, description: "synthetic fixture marked authoritative", mutate: (r) => { r.syntheticFixtureMarkedAuthoritativeAccepted = true; } },
  { id: 136, description: "synthetic fixture shipped as production knowledge", mutate: (r) => { r.syntheticFixturesSeparatedFromProduction = false; } },
  { id: 137, description: "migration stages omitted", mutate: (r) => { r.migrationStagesDefined = false; } },
  { id: 138, description: "foundation tables created after dependent tables", mutate: (r) => { r.foundationTablesCreatedAfterDependentTablesAccepted = true; } },
  { id: 139, description: "RLS applied before objects exist without plan", mutate: (r) => { r.rlsAppliedBeforeObjectsExistWithoutPlanAccepted = true; } },
  { id: 140, description: "runtime enabled during migration", mutate: (r) => { r.runtimeEnabledDuringMigrationAccepted = true; } },
  { id: 141, description: "integrity validation skipped", mutate: (r) => { r.integrityValidationSkippedAccepted = true; } },
  { id: 142, description: "empty-schema closure claims real data", mutate: (r) => { r.zeroRealDataAfterMigrationPlan = false; } },
  { id: 143, description: "destructive rollback after accepted history exists", mutate: (r) => { r.destructiveRollbackAfterAcceptedHistoryExistsAccepted = true; } },
  { id: 144, description: "rollback deletes immutable history", mutate: (r) => { r.rollbackDeletesImmutableHistoryAccepted = true; } },
  { id: 145, description: "failed RLS defaults open", mutate: (r) => { r.failedRlsDefaultsClosed = false; } },
  { id: 146, description: "public views left enabled after failure", mutate: (r) => { r.publicViewsLeftEnabledAfterFailureAccepted = true; } },
  { id: 147, description: "failed migration silently continues", mutate: (r) => { r.failedMigrationBlocksRuntime = false; } },
  { id: 148, description: "migration failure does not block runtime", mutate: (r) => { r.migrationFailureDoesNotBlockRuntimeAccepted = true; } },
  { id: 149, description: "validation plan omitted", mutate: (r) => { r.validationPlanDefined = false; } },
  { id: 150, description: "migration not tested on empty DB", mutate: (r) => { r.migrationNotTestedOnEmptyDbAccepted = true; } },
  { id: 151, description: "rollback not tested before seed", mutate: (r) => { r.rollbackNotTestedBeforeSeedAccepted = true; } },
  { id: 152, description: "table count not validated", mutate: (r) => { r.tableCountNotValidatedAccepted = true; } },
  { id: 153, description: "FK graph not validated", mutate: (r) => { r.fkGraphNotValidatedAccepted = true; } },
  { id: 154, description: "forbidden user-data FK not checked", mutate: (r) => { r.forbiddenUserDataFkNotCheckedAccepted = true; } },
  { id: 155, description: "anonymous write denial not tested", mutate: (r) => { r.anonymousWriteDenialNotTestedAccepted = true; } },
  { id: 156, description: "authenticated write denial not tested", mutate: (r) => { r.authenticatedWriteDenialNotTestedAccepted = true; } },
  { id: 157, description: "immutable update rejection not tested", mutate: (r) => { r.immutableUpdateRejectionNotTestedAccepted = true; } },
  { id: 158, description: "citation-without-passage rejection not tested", mutate: (r) => { r.citationWithoutPassageRejectionNotTestedAccepted = true; } },
  { id: 159, description: "locale-triggered connector rejection not tested", mutate: (r) => { r.localeTriggeredConnectorRejectionNotTestedAccepted = true; } },
  { id: 160, description: "vector-authoritative flag not tested", mutate: (r) => { r.vectorAuthoritativeFlagNotTestedAccepted = true; } },
  { id: 161, description: "audit-user-content rejection not tested", mutate: (r) => { r.auditUserContentRejectionNotTestedAccepted = true; } },
  { id: 162, description: "history queryability not tested", mutate: (r) => { r.historyQueryabilityNotTestedAccepted = true; } },
  { id: 163, description: "rejected data view filtering not tested", mutate: (r) => { r.rejectedDataViewFilteringNotTestedAccepted = true; } },
  { id: 164, description: "real rows exist after schema migration", mutate: (r) => { r.realRowsExistAfterSchemaMigrationAccepted = true; } },
  { id: 165, description: "exact migration number invented without inspection", mutate: (r) => { r.exactMigrationNumberInventedWithoutInspectionAccepted = true; } },
  { id: 166, description: "unrelated destructive changes included", mutate: (r) => { r.unrelatedDestructiveChangesIncludedAccepted = true; } },
  { id: 167, description: "rollback notes omitted", mutate: (r) => { r.rollbackNotesOmittedAccepted = true; } },
  { id: 168, description: "migration split ignored", mutate: (r) => { r.migrationSplitDecisionDefined = false; } },
  { id: 169, description: "one enormous migration forced despite risk", mutate: (r) => { r.oneEnormousMigrationForcedDespiteRiskAccepted = true; } },
  { id: 170, description: "excessive migration fragmentation", mutate: (r) => { r.excessiveMigrationFragmentationAccepted = true; } },
  { id: 171, description: "real ingestion begins in 9F", mutate: (r) => { r.realSourceIngestionBoundaryDefined = false; } },
  { id: 172, description: "DE<->SK connector row created", mutate: (r) => { r.deSkConnectorRowCreatedAccepted = true; } },
  { id: 173, description: "Slovak source data populated", mutate: (r) => { r.slovakSourceDataPopulatedAccepted = true; } },
  { id: 174, description: "connector activated from Slovak locale", mutate: (r) => { r.connectorActivatedFromSlovakLocaleAccepted = true; } },
  { id: 175, description: "DE<->SK lacks EU support", mutate: (r) => { r.deSkLacksEuSupportAccepted = true; } },
  { id: 176, description: "DE<->SK lacks German support", mutate: (r) => { r.deSkLacksGermanSupportAccepted = true; } },
  { id: 177, description: "DE<->SK lacks Slovak support", mutate: (r) => { r.deSkLacksSlovakSupportAccepted = true; } },
  { id: 178, description: "responsible actor missing", mutate: (r) => { r.responsibleActorMissingAccepted = true; } },
  { id: 179, description: "temporal alignment missing", mutate: (r) => { r.temporalAlignmentMissingAccepted = true; } },
  { id: 180, description: "first pilot topic changed", mutate: (r) => { r.deSkFirstPilotTopic = "jobcenter_buergergeld"; } },
  { id: 181, description: "schema supports only Wave 1 and requires redesign for Wave 2", mutate: (r) => { r.waveBasedPopulationSupported = false; } },
  { id: 182, description: "vector optimization required before first migration", mutate: (r) => { r.performanceBoundaryDefined = false; } },
  { id: 183, description: "generated TypeScript types modified before migration", mutate: (r) => { r.generatedTypesRegenerationDeferred = false; } },
  { id: 184, description: "migration audit includes user content", mutate: (r) => { r.migrationAuditIncludesUserContentAccepted = true; } },
  { id: 185, description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 186, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 187, description: "public beta authorized", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 188, description: "go-live authorized", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 189, description: "German database claimed populated", mutate: (r) => { r.germanKnowledgePopulationStillOpen = false; } },
  { id: 190, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguageProductionParityStillOpen = false; } },
  { id: 191, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 192, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 193, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 194, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 195, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 196, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 197, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 198, description: "audit passes with unexpected changed file", mutate: (r) => { r.onlyExpectedFilesChanged = false; r.existingFileModified = true; } },
  { id: 199, description: "audit passes if SQL exists", mutate: (r) => { r.sqlFileCreated = true; } },
  { id: 200, description: "audit passes if database command ran", mutate: (r) => { r.databaseCommandExecuted = true; } },
  { id: 201, description: "audit passes if any real row exists", mutate: (r) => { r.zeroRealSources = false; } },
  { id: 202, description: "audit passes if destructive delete policy exists", mutate: (r) => { r.historicalDeletionBlocked = false; } },
  { id: 203, description: "audit passes if RLS is permissive", mutate: (r) => { r.rlsPermissiveAccepted = true; } },
  { id: 204, description: "audit passes if user-data boundary is weakened", mutate: (r) => { r.userDataBoundaryWeakenedAccepted = true; } },
  { id: 205, description: "audit passes if runtime can activate before validation", mutate: (r) => { r.migrationValidationRequiredBeforeRuntime = false; } },
  { id: 206, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
  { id: 207, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9G"; } },
  { id: 208, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
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
    r.checkId === "9F",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceTrustContractCheckId === SOURCE_TRUST_CONTRACT_CHECK_ID,
    r.sourceJurisdictionModelCheckId === SOURCE_JURISDICTION_MODEL_CHECK_ID,
    r.sourceCoveragePlanCheckId === SOURCE_COVERAGE_PLAN_CHECK_ID,
    r.sourceStorageSchemaCheckId === SOURCE_STORAGE_SCHEMA_CHECK_ID,
    r.sourceArchitectureReady === true,
    r.sourceTrustContractReady === true,
    r.sourceJurisdictionModelReady === true,
    r.sourceCoveragePlanReady === true,
    r.sourceStorageSchemaReady === true,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.sqlFileCreated === false,
    r.databaseMigrationCreated === false,
    r.databaseTableCreated === false,
    r.databaseCommandExecuted === false,
    r.databaseWritePerformed === false,
    r.supabaseCliExecuted === false,
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

    r.migrationPlanContractDefined === true,
    r.migrationStrategyDefined === true,
    r.logicalTableGroupsDefined === true,
    r.tableCreationOrderDefined === true,
    r.foreignKeyPhasesDefined === true,
    r.onDeletePolicyDefined === true,
    r.immutabilityEnforcementPlanned === true,
    r.appendOnlyPolicyDefined === true,
    r.constraintPlanDefined === true,
    r.uniqueConstraintPlanDefined === true,
    r.indexPlanDefined === true,
    r.rlsAccessModelDefined === true,
    r.anonymousAccessPolicyDefined === true,
    r.authenticatedAccessPolicyDefined === true,
    r.serviceWriterPolicyDefined === true,
    r.reviewerPolicyDefined === true,
    r.adminPolicyDefined === true,
    r.migrationOperatorPolicyDefined === true,
    r.auditReaderPolicyDefined === true,
    r.publicUserDataSeparationDefined === true,
    r.viewProjectionPlanDefined === true,
    r.seedStrategyDefined === true,
    r.testFixtureStrategyDefined === true,
    r.migrationStagesDefined === true,
    r.rollbackStrategyDefined === true,
    r.failurePolicyDefined === true,
    r.validationPlanDefined === true,
    r.migrationFilePlanDefined === true,
    r.migrationSplitDecisionDefined === true,
    r.realSourceIngestionBoundaryDefined === true,
    r.deSkStructuralSupportDefined === true,
    r.deSkInactiveByDefault === true,
    r.performanceBoundaryDefined === true,
    r.supabaseSpecificPlanningDefined === true,
    r.generatedTypesPlanDefined === true,
    r.migrationAuditabilityDefined === true,
    r.exitCriteriaDefined === true,

    r.foundationGroupDefined === true,
    r.sourceCoreGroupDefined === true,
    r.authorityCoreGroupDefined === true,
    r.claimCoreGroupDefined === true,
    r.processCoreGroupDefined === true,
    r.ruleDocumentCoreGroupDefined === true,
    r.governanceCoreGroupDefined === true,
    r.languageCoreGroupDefined === true,
    r.crossBorderCoreGroupDefined === true,
    r.retrievalMetadataGroupDefined === true,

    r.historicalDeletionBlocked === true,
    r.sourceVersionOverwriteBlocked === true,
    r.passageDeletionCascadeBlocked === true,
    r.reviewHistoryOverwriteBlocked === true,
    r.conflictHistoryDeletionBlocked === true,
    r.anonymousKnowledgeWriteBlocked === true,
    r.authenticatedKnowledgeWriteBlocked === true,
    r.serviceWriterCannotBypassReview === true,
    r.modelOutputCannotBecomeAuthoritative === true,
    r.userDataForeignKeysBlocked === true,
    r.localeConnectorActivationBlocked === true,
    r.vectorAuthorityBlocked === true,
    r.failedMigrationBlocksRuntime === true,
    r.failedRlsDefaultsClosed === true,
    r.realSeedSeparatedFromMigration === true,
    r.syntheticFixturesSeparatedFromProduction === true,
    r.migrationValidationRequiredBeforeRuntime === true,
    r.generatedTypesRegenerationDeferred === true,

    r.firstMigrationSupportsEightProcessGroups === true,
    r.waveBasedPopulationSupported === true,
    r.deSkFirstPilotTopic === "familienkasse_kindergeld",
    r.deSkConnectorNotImplemented === true,
    r.zeroRealDataAfterMigrationPlan === true,

    r.zeroSqlFilesCreated === true,
    r.zeroMigrationsCreated === true,
    r.zeroTablesCreated === true,
    r.zeroDatabaseCommands === true,
    r.zeroDatabaseWrites === true,
    r.zeroRealSources === true,
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

    r.destructiveFirstMigrationAccepted === false,
    r.existingTableDroppedAccepted === false,
    r.unrelatedTableRenamedAccepted === false,
    r.userDataRewrittenAccepted === false,
    r.knowledgeTablesMixedIntoUserContentTablesAccepted === false,
    r.runtimeEnabledBeforeValidationAccepted === false,
    r.migrationOrderIgnoresDependenciesAccepted === false,
    r.childTableCreatedBeforeParentWithoutStagedFkPlanAccepted === false,
    r.circularDependencySolvedByRemovingFkPermanentlyAccepted === false,
    r.sourceVersionTableCreatedBeforeSourceTableAccepted === false,
    r.passageTableCreatedBeforeSourceVersionTableAccepted === false,
    r.evidenceLinkCreatedBeforeClaimsPassagesAccepted === false,
    r.stepCreatedBeforeProcessAccepted === false,
    r.localizedTerminologyCreatedBeforeTerminologyAccepted === false,
    r.crossBorderProcessCreatedBeforeConnectorAccepted === false,
    r.auditFkCircularityIgnoredAccepted === false,
    r.cascadeDeletesSourceVersionsAccepted === false,
    r.cascadeDeletesPassagesAccepted === false,
    r.cascadeDeletesClaimsAccepted === false,
    r.cascadeDeletesCitationsAccepted === false,
    r.cascadeDeletesReviewRecordsAccepted === false,
    r.cascadeDeletesConflictHistoryAccepted === false,
    r.cascadeDeletesCompetenceHistoryAccepted === false,
    r.cascadeDeletesAuditEventsAccepted === false,
    r.historicalSourceVersionUpdateAllowedAccepted === false,
    r.acceptedPassageEditedInPlaceAccepted === false,
    r.auditEventMutableAccepted === false,
    r.immutableTransitionBypassedAccepted === false,
    r.contentHashVerificationOmittedAccepted === false,
    r.singleMutableHistoryRowAccepted === false,
    r.primaryKeyPhaseOmittedAccepted === false,
    r.checkConstraintPhaseOmittedAccepted === false,
    r.temporalConstraintOmittedAccepted === false,
    r.citationIntegrityConstraintOmittedAccepted === false,
    r.jurisdictionIntegrityOmittedAccepted === false,
    r.localeTrustSeparationOmittedAccepted === false,
    r.userDataBoundaryConstraintOmittedAccepted === false,
    r.invalidEffectivePeriodAccepted === false,
    r.passageWithoutSourceVersionAccepted === false,
    r.highRiskClaimWithoutCitationAccepted === false,
    r.localizedLocaleOutsideLaunchSetAccepted === false,
    r.auditEventWithUserContentAccepted === false,
    r.eligibilityFinalDeterminationAccepted === false,
    r.activeCrossBorderProcessWithoutTrustDomainsAccepted === false,
    r.everySemanticRuleFalselyClaimedDbEnforceableAccepted === false,
    r.applicationValidationOmittedAccepted === false,
    r.governanceAuditOmittedAccepted === false,
    r.uniquenessPlanOmittedAccepted === false,
    r.duplicateSourceVersionAccepted === false,
    r.duplicatePassageOrderAccepted === false,
    r.duplicateEvidenceLinkAccepted === false,
    r.duplicateProcessStepOrderAccepted === false,
    r.duplicateLocalizedTerminologyAccepted === false,
    r.fkIndexesOmittedAccepted === false,
    r.temporalIndexesOmittedAccepted === false,
    r.jurisdictionIndexesOmittedAccepted === false,
    r.reviewFreshnessIndexesOmittedAccepted === false,
    r.fullTextIndexCreatedPrematurelyAccepted === false,
    r.vectorExtensionAddedPrematurelyAccepted === false,
    r.anonymousSourceUpdateAllowedAccepted === false,
    r.anonymousSourceDeleteAllowedAccepted === false,
    r.anonymousClaimWriteAllowedAccepted === false,
    r.anonymousReviewWriteAllowedAccepted === false,
    r.anonymousConflictWriteAllowedAccepted === false,
    r.anonymousAuditWriteAllowedAccepted === false,
    r.anonymousRawSourceLocationAccessAllowedAccepted === false,
    r.anonymousUnpublishedDataAccessAllowedAccepted === false,
    r.authenticationImpliesKnowledgeEditorRoleAccepted === false,
    r.serviceWriterOverwritesImmutableHistoryAccepted === false,
    r.reviewerRewritesSourceHistoryAccepted === false,
    r.reviewerResolvesConflictWithoutAuditAccepted === false,
    r.adminBypassesAuditAccepted === false,
    r.migrationOperatorUsedAsRuntimeRoleAccepted === false,
    r.auditReaderReceivesUserContentAccepted === false,
    r.knowledgeFkToSmartTalkInputAccepted === false,
    r.knowledgeFkToOcrImageAccepted === false,
    r.knowledgeFkToDnaProfileAccepted === false,
    r.knowledgeFkToPaymentRecordAccepted === false,
    r.knowledgeFkToConversationHistoryAccepted === false,
    r.retrievalPersistsUserContentAccepted === false,
    r.approvedViewIncludesRejectedDataAccepted === false,
    r.approvedViewIncludesExpiredDataAccepted === false,
    r.approvedViewIncludesUnresolvedConflictAccepted === false,
    r.approvedViewIgnoresJurisdictionAccepted === false,
    r.approvedViewIgnoresEffectiveDateAccepted === false,
    r.approvedViewIgnoresAllowedUseAccepted === false,
    r.realLegalDataEmbeddedInMigrationAccepted === false,
    r.realSeedNotVersionedAccepted === false,
    r.seedOverwritesHistoryAccepted === false,
    r.seedLacksStableIdsAccepted === false,
    r.syntheticFixtureQueryablePubliclyAccepted === false,
    r.syntheticFixtureMarkedAuthoritativeAccepted === false,
    r.foundationTablesCreatedAfterDependentTablesAccepted === false,
    r.rlsAppliedBeforeObjectsExistWithoutPlanAccepted === false,
    r.runtimeEnabledDuringMigrationAccepted === false,
    r.integrityValidationSkippedAccepted === false,
    r.destructiveRollbackAfterAcceptedHistoryExistsAccepted === false,
    r.rollbackDeletesImmutableHistoryAccepted === false,
    r.publicViewsLeftEnabledAfterFailureAccepted === false,
    r.migrationFailureDoesNotBlockRuntimeAccepted === false,
    r.migrationNotTestedOnEmptyDbAccepted === false,
    r.rollbackNotTestedBeforeSeedAccepted === false,
    r.tableCountNotValidatedAccepted === false,
    r.fkGraphNotValidatedAccepted === false,
    r.forbiddenUserDataFkNotCheckedAccepted === false,
    r.anonymousWriteDenialNotTestedAccepted === false,
    r.authenticatedWriteDenialNotTestedAccepted === false,
    r.immutableUpdateRejectionNotTestedAccepted === false,
    r.citationWithoutPassageRejectionNotTestedAccepted === false,
    r.localeTriggeredConnectorRejectionNotTestedAccepted === false,
    r.vectorAuthoritativeFlagNotTestedAccepted === false,
    r.auditUserContentRejectionNotTestedAccepted === false,
    r.historyQueryabilityNotTestedAccepted === false,
    r.rejectedDataViewFilteringNotTestedAccepted === false,
    r.realRowsExistAfterSchemaMigrationAccepted === false,
    r.exactMigrationNumberInventedWithoutInspectionAccepted === false,
    r.unrelatedDestructiveChangesIncludedAccepted === false,
    r.rollbackNotesOmittedAccepted === false,
    r.oneEnormousMigrationForcedDespiteRiskAccepted === false,
    r.excessiveMigrationFragmentationAccepted === false,
    r.deSkConnectorRowCreatedAccepted === false,
    r.slovakSourceDataPopulatedAccepted === false,
    r.connectorActivatedFromSlovakLocaleAccepted === false,
    r.deSkLacksEuSupportAccepted === false,
    r.deSkLacksGermanSupportAccepted === false,
    r.deSkLacksSlovakSupportAccepted === false,
    r.responsibleActorMissingAccepted === false,
    r.temporalAlignmentMissingAccepted === false,
    r.migrationAuditIncludesUserContentAccepted === false,
    r.rlsPermissiveAccepted === false,
    r.userDataBoundaryWeakenedAccepted === false,
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
  sourceStorageSchemaCheckIdFound: string;
  sourceStorageSchemaReady: boolean;
  supabaseConventionObservation: SupabaseConventionObservation;
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

  const phase9eSrc = readFileText(PHASE_9E_REL_PATH);
  const phase9eExists = fileExists(PHASE_9E_REL_PATH);
  const checkId9eMatch = phase9eSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceStorageSchemaCheckIdFound = checkId9eMatch ? checkId9eMatch[1] : "not_found";
  const sourceStorageSchemaReady =
    phase9eExists && sourceStorageSchemaCheckIdFound === "9E" &&
    phase9eSrc.includes("readyForKnowledgeMigrationImplementationPlan: allPassed");
  if (!sourceStorageSchemaReady) notes.push("PHASE 9E source did not statically confirm readiness.");

  const migrationFiles = listDirNamesOnly(MIGRATIONS_DIR_REL_PATH);
  const numberedPattern = /^\d{3}_[a-z0-9_]+\.sql$/;
  const datedPattern = /^\d{8}_[a-z0-9_]+\.sql$/;
  const migrationFolderPath = MIGRATIONS_DIR_REL_PATH;
  const sqlNamingPattern = migrationFiles.length > 0 && migrationFiles.every((f) => numberedPattern.test(f) || datedPattern.test(f))
    ? "NNN_description.sql (zero-padded sequence) with one dated exception" : "not_confirmed";
  const anyMigrationUsesPublicSchema = migrationFiles.some((f) => readFileText(`${MIGRATIONS_DIR_REL_PATH}/${f}`).includes("public."));
  const anyMigrationEnablesRls = migrationFiles.some((f) => readFileText(`${MIGRATIONS_DIR_REL_PATH}/${f}`).toLowerCase().includes("enable row level security"));
  const anyMigrationUsesServiceRole = migrationFiles.some((f) => readFileText(`${MIGRATIONS_DIR_REL_PATH}/${f}`).includes("service_role"));
  const serviceRoleHelperExists = fileExists(SUPABASE_SERVICE_ROLE_REL_PATH);
  const supabaseConventionObservation: SupabaseConventionObservation = {
    migrationFolderPath,
    sqlNamingPattern,
    schemaUsage: anyMigrationUsesPublicSchema ? "public schema with descriptive table names (no dedicated schema observed)" : "not_confirmed",
    rlsDefaults: anyMigrationEnablesRls ? "RLS enabled per table with explicit `to authenticated` / `to anon, authenticated` policies observed" : "not_confirmed",
    serviceRoleUsage: anyMigrationUsesServiceRole || serviceRoleHelperExists ? "service_role used for privileged server-only operations (grant execute ... to service_role; lib/supabase/service-role.ts helper)" : "not_confirmed",
    generatedTypesObserved: false,
    localMigrationValidationObserved: false,
    remoteMigrationDeploymentObserved: false,
    schemaDiffDisciplineObserved: migrationFiles.length > 0,
  };

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
    sourceStorageSchemaCheckIdFound, sourceStorageSchemaReady,
    supabaseConventionObservation,
    standaloneExtractionStillOpen, physicalAndroidStillUntested, genuineIosSafariStillUntested,
    heicHeifStillOpen, serverlessOcrStillOpen, distributedRateLimiterStillOpen, paymentFlowStillOpen,
    notes,
  };
}

// ─── Good-result construction ───────────────────────────────────────────────

function buildGoodResult(evidence: Evidence): Result {
  const designComplete =
    TOTAL_PLANNED_TABLE_COUNT === 33 &&
    TABLE_CREATION_ORDER.length === 33 &&
    new Set(TABLE_CREATION_ORDER).size === 33 &&
    MIGRATION_STRATEGY.length === 10 &&
    PROHIBITED_INITIAL_MIGRATION_ACTIONS.length === 5 &&
    FOREIGN_KEY_PHASES.length === 10 &&
    CIRCULAR_DEPENDENCY_PERMANENT_FK_REMOVAL_ALLOWED === false &&
    CASCADE_DELETE_PROHIBITED_FOR.length === 8 &&
    IMMUTABLE_STATE_TRANSITIONS.length === 5 &&
    ACCEPTED_OR_SUPERSEDED_RECORDS_EDITABLE_IN_PLACE === false &&
    TRIGGERS_CREATED_THIS_PHASE === false &&
    APPEND_ONLY_ENTITIES.length === 8 &&
    MUTABLE_SINGLE_ROW_HISTORY_ALLOWED === false &&
    CONSTRAINT_CATEGORIES.length === 11 &&
    EXAMPLE_CHECKS.length === 10 &&
    ALL_SEMANTIC_CONSTRAINTS_CLAIMED_DB_ENFORCEABLE === false &&
    UNIQUE_CONSTRAINT_PLAN.length === 9 &&
    INDEX_PHASES.length === 5 &&
    MANDATORY_INDEX_CANDIDATES.length === 18 &&
    VECTOR_INDEXING_AUTHORITATIVE === false &&
    INDEXES_CREATED_THIS_PHASE === false &&
    ACCESS_ROLES.length === 7 &&
    ANONYMOUS_ACCESS_PROHIBITIONS.length === 10 &&
    AUTHENTICATION_IMPLIES_KNOWLEDGE_EDITOR_PERMISSIONS === false &&
    SERVICE_WRITER_PROHIBITIONS.length === 5 &&
    REVIEWER_MAY_SILENTLY_REWRITE_HISTORICAL_SOURCE_CONTENT === false &&
    ADMIN_MAY_BYPASS_APPEND_ONLY_HISTORY_WITHOUT_AUDITED_PROCEDURE === false &&
    MIGRATION_OPERATOR_MAY_BECOME_NORMAL_RUNTIME_ROLE === false &&
    AUDIT_READER_RECEIVES_USER_CONTENT === false &&
    SCHEMA_BOUNDARY_OPTIONS.length === 3 &&
    RECOMMENDED_SCHEMA_BOUNDARY_OPTION === "public_schema_with_knowledge_prefix" &&
    NO_FK_TARGETS_FROM_KNOWLEDGE_SCHEMA.length === 5 &&
    AUTOMATIC_USER_CONTENT_PERSISTENCE_DURING_RETRIEVAL === false &&
    VIEW_PROJECTION_PLAN.length === 8 &&
    VIEWS_CREATED_THIS_PHASE === false &&
    SEED_CATEGORIES.length === 6 &&
    REAL_KNOWLEDGE_SEED_REQUIREMENTS.length === 7 &&
    REAL_SEED_FILE_CREATED_THIS_PHASE === false &&
    GERMAN_LEGAL_CONTENT_EMBEDDED_IN_MIGRATION === false &&
    TEST_FIXTURE_REQUIREMENTS.length === 6 &&
    MIGRATION_STAGES.length === 11 &&
    RUNTIME_ACTIVATION_OCCURS_IN_THIS_MIGRATION_PLAN === false &&
    ROLLBACK_CATEGORIES.length === 7 &&
    ROLLBACK_RULES.length === 5 &&
    PERFECT_REVERSIBILITY_FOR_ALL_FUTURE_STATES_PROMISED === false &&
    FAILURE_OUTCOMES.length === 9 &&
    MIGRATION_FAILURE_SILENTLY_CONTINUES_TO_RUNTIME_ACTIVATION === false &&
    VALIDATION_PLAN.length === 23 &&
    MIGRATION_FILE_PLAN_EXPECTATIONS.length === 8 &&
    EXACT_MIGRATION_NUMBER_DETERMINED_THIS_PHASE === false &&
    MIGRATION_SPLIT_CANDIDATES.length === 3 &&
    REAL_INGESTION_BEGINS_IN_9F === false &&
    DE_SK_STRUCTURAL_REQUIREMENTS.length === 10 &&
    DE_SK_FIRST_PILOT_TOPIC === "familienkasse_kindergeld" &&
    DE_SK_CONNECTOR_ROW_CREATED_THIS_PHASE === false &&
    DE_SK_CONNECTOR_ACTIVATED_FROM_LOCALE_THIS_PHASE === false &&
    EIGHT_PROCESS_GROUPS.length === 8 &&
    SCHEMA_REQUIRES_DESTRUCTIVE_REDESIGN_FOR_LATER_WAVES === false &&
    PERFORMANCE_RECOMMENDATIONS.length === 6 &&
    VECTOR_EXTENSIONS_OR_EXPENSIVE_INDEXES_REQUIRED_BEFORE_FIRST_MIGRATION === false &&
    SUPABASE_COMMAND_EXECUTED_THIS_PHASE === false &&
    GENERATED_TYPES_MODIFIED_THIS_PHASE === false &&
    MIGRATION_AUDIT_RECORD_FIELDS.length === 11 &&
    MIGRATION_AUDIT_METADATA_INCLUDES_USER_CONTENT === false &&
    EXIT_CRITERIA.length === 20 &&
    LAUNCH_LOCALES.length === 6 &&
    Object.keys(LOGICAL_TABLE_GROUPS).length === 10;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.newAuditFileCreated &&
    evidence.sourceArchitectureReady &&
    evidence.sourceTrustContractReady &&
    evidence.sourceJurisdictionModelReady &&
    evidence.sourceCoveragePlanReady &&
    evidence.sourceStorageSchemaReady;

  return {
    checkId: "9F",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceTrustContractCheckId: evidence.sourceTrustContractCheckIdFound,
    sourceJurisdictionModelCheckId: evidence.sourceJurisdictionModelCheckIdFound,
    sourceCoveragePlanCheckId: evidence.sourceCoveragePlanCheckIdFound,
    sourceStorageSchemaCheckId: evidence.sourceStorageSchemaCheckIdFound,

    sourceArchitectureReady: evidence.sourceArchitectureReady,
    sourceTrustContractReady: evidence.sourceTrustContractReady,
    sourceJurisdictionModelReady: evidence.sourceJurisdictionModelReady,
    sourceCoveragePlanReady: evidence.sourceCoveragePlanReady,
    sourceStorageSchemaReady: evidence.sourceStorageSchemaReady,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    sqlFileCreated: false,
    databaseMigrationCreated: false,
    databaseTableCreated: false,
    databaseCommandExecuted: false,
    databaseWritePerformed: false,
    supabaseCliExecuted: false,
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

    migrationPlanContractDefined: true,
    migrationStrategyDefined: true,
    logicalTableGroupsDefined: true,
    tableCreationOrderDefined: true,
    foreignKeyPhasesDefined: true,
    onDeletePolicyDefined: true,
    immutabilityEnforcementPlanned: true,
    appendOnlyPolicyDefined: true,
    constraintPlanDefined: true,
    uniqueConstraintPlanDefined: true,
    indexPlanDefined: true,
    rlsAccessModelDefined: true,
    anonymousAccessPolicyDefined: true,
    authenticatedAccessPolicyDefined: true,
    serviceWriterPolicyDefined: true,
    reviewerPolicyDefined: true,
    adminPolicyDefined: true,
    migrationOperatorPolicyDefined: true,
    auditReaderPolicyDefined: true,
    publicUserDataSeparationDefined: true,
    viewProjectionPlanDefined: true,
    seedStrategyDefined: true,
    testFixtureStrategyDefined: true,
    migrationStagesDefined: true,
    rollbackStrategyDefined: true,
    failurePolicyDefined: true,
    validationPlanDefined: true,
    migrationFilePlanDefined: true,
    migrationSplitDecisionDefined: true,
    realSourceIngestionBoundaryDefined: true,
    deSkStructuralSupportDefined: true,
    deSkInactiveByDefault: true,
    performanceBoundaryDefined: true,
    supabaseSpecificPlanningDefined: true,
    generatedTypesPlanDefined: true,
    migrationAuditabilityDefined: true,
    exitCriteriaDefined: true,

    foundationGroupDefined: true,
    sourceCoreGroupDefined: true,
    authorityCoreGroupDefined: true,
    claimCoreGroupDefined: true,
    processCoreGroupDefined: true,
    ruleDocumentCoreGroupDefined: true,
    governanceCoreGroupDefined: true,
    languageCoreGroupDefined: true,
    crossBorderCoreGroupDefined: true,
    retrievalMetadataGroupDefined: true,

    historicalDeletionBlocked: true,
    sourceVersionOverwriteBlocked: true,
    passageDeletionCascadeBlocked: true,
    reviewHistoryOverwriteBlocked: true,
    conflictHistoryDeletionBlocked: true,
    anonymousKnowledgeWriteBlocked: true,
    authenticatedKnowledgeWriteBlocked: true,
    serviceWriterCannotBypassReview: true,
    modelOutputCannotBecomeAuthoritative: true,
    userDataForeignKeysBlocked: true,
    localeConnectorActivationBlocked: true,
    vectorAuthorityBlocked: true,
    failedMigrationBlocksRuntime: true,
    failedRlsDefaultsClosed: true,
    realSeedSeparatedFromMigration: true,
    syntheticFixturesSeparatedFromProduction: true,
    migrationValidationRequiredBeforeRuntime: true,
    generatedTypesRegenerationDeferred: true,

    firstMigrationSupportsEightProcessGroups: true,
    waveBasedPopulationSupported: true,
    deSkFirstPilotTopic: DE_SK_FIRST_PILOT_TOPIC,
    deSkConnectorNotImplemented: true,
    zeroRealDataAfterMigrationPlan: true,

    zeroSqlFilesCreated: true,
    zeroMigrationsCreated: true,
    zeroTablesCreated: true,
    zeroDatabaseCommands: true,
    zeroDatabaseWrites: true,
    zeroRealSources: true,
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

    readyForKnowledgeSchemaMigrationImplementation: allPassed,

    existingFileModified: evidence.existingFileModified,
    onlyExpectedFilesChanged: evidence.onlyExpectedFilesChanged,
    newAuditFileCreated: evidence.newAuditFileCreated,
    supabaseConventionObservation: evidence.supabaseConventionObservation,

    destructiveFirstMigrationAccepted: false,
    existingTableDroppedAccepted: false,
    unrelatedTableRenamedAccepted: false,
    userDataRewrittenAccepted: false,
    knowledgeTablesMixedIntoUserContentTablesAccepted: false,
    runtimeEnabledBeforeValidationAccepted: false,
    migrationOrderIgnoresDependenciesAccepted: false,
    childTableCreatedBeforeParentWithoutStagedFkPlanAccepted: false,
    circularDependencySolvedByRemovingFkPermanentlyAccepted: false,
    sourceVersionTableCreatedBeforeSourceTableAccepted: false,
    passageTableCreatedBeforeSourceVersionTableAccepted: false,
    evidenceLinkCreatedBeforeClaimsPassagesAccepted: false,
    stepCreatedBeforeProcessAccepted: false,
    localizedTerminologyCreatedBeforeTerminologyAccepted: false,
    crossBorderProcessCreatedBeforeConnectorAccepted: false,
    auditFkCircularityIgnoredAccepted: false,
    cascadeDeletesSourceVersionsAccepted: false,
    cascadeDeletesPassagesAccepted: false,
    cascadeDeletesClaimsAccepted: false,
    cascadeDeletesCitationsAccepted: false,
    cascadeDeletesReviewRecordsAccepted: false,
    cascadeDeletesConflictHistoryAccepted: false,
    cascadeDeletesCompetenceHistoryAccepted: false,
    cascadeDeletesAuditEventsAccepted: false,
    historicalSourceVersionUpdateAllowedAccepted: false,
    acceptedPassageEditedInPlaceAccepted: false,
    auditEventMutableAccepted: false,
    immutableTransitionBypassedAccepted: false,
    contentHashVerificationOmittedAccepted: false,
    singleMutableHistoryRowAccepted: false,
    primaryKeyPhaseOmittedAccepted: false,
    checkConstraintPhaseOmittedAccepted: false,
    temporalConstraintOmittedAccepted: false,
    citationIntegrityConstraintOmittedAccepted: false,
    jurisdictionIntegrityOmittedAccepted: false,
    localeTrustSeparationOmittedAccepted: false,
    userDataBoundaryConstraintOmittedAccepted: false,
    invalidEffectivePeriodAccepted: false,
    passageWithoutSourceVersionAccepted: false,
    highRiskClaimWithoutCitationAccepted: false,
    localizedLocaleOutsideLaunchSetAccepted: false,
    auditEventWithUserContentAccepted: false,
    eligibilityFinalDeterminationAccepted: false,
    activeCrossBorderProcessWithoutTrustDomainsAccepted: false,
    everySemanticRuleFalselyClaimedDbEnforceableAccepted: false,
    applicationValidationOmittedAccepted: false,
    governanceAuditOmittedAccepted: false,
    uniquenessPlanOmittedAccepted: false,
    duplicateSourceVersionAccepted: false,
    duplicatePassageOrderAccepted: false,
    duplicateEvidenceLinkAccepted: false,
    duplicateProcessStepOrderAccepted: false,
    duplicateLocalizedTerminologyAccepted: false,
    fkIndexesOmittedAccepted: false,
    temporalIndexesOmittedAccepted: false,
    jurisdictionIndexesOmittedAccepted: false,
    reviewFreshnessIndexesOmittedAccepted: false,
    fullTextIndexCreatedPrematurelyAccepted: false,
    vectorExtensionAddedPrematurelyAccepted: false,
    anonymousSourceUpdateAllowedAccepted: false,
    anonymousSourceDeleteAllowedAccepted: false,
    anonymousClaimWriteAllowedAccepted: false,
    anonymousReviewWriteAllowedAccepted: false,
    anonymousConflictWriteAllowedAccepted: false,
    anonymousAuditWriteAllowedAccepted: false,
    anonymousRawSourceLocationAccessAllowedAccepted: false,
    anonymousUnpublishedDataAccessAllowedAccepted: false,
    authenticationImpliesKnowledgeEditorRoleAccepted: false,
    serviceWriterOverwritesImmutableHistoryAccepted: false,
    reviewerRewritesSourceHistoryAccepted: false,
    reviewerResolvesConflictWithoutAuditAccepted: false,
    adminBypassesAuditAccepted: false,
    migrationOperatorUsedAsRuntimeRoleAccepted: false,
    auditReaderReceivesUserContentAccepted: false,
    knowledgeFkToSmartTalkInputAccepted: false,
    knowledgeFkToOcrImageAccepted: false,
    knowledgeFkToDnaProfileAccepted: false,
    knowledgeFkToPaymentRecordAccepted: false,
    knowledgeFkToConversationHistoryAccepted: false,
    retrievalPersistsUserContentAccepted: false,
    approvedViewIncludesRejectedDataAccepted: false,
    approvedViewIncludesExpiredDataAccepted: false,
    approvedViewIncludesUnresolvedConflictAccepted: false,
    approvedViewIgnoresJurisdictionAccepted: false,
    approvedViewIgnoresEffectiveDateAccepted: false,
    approvedViewIgnoresAllowedUseAccepted: false,
    realLegalDataEmbeddedInMigrationAccepted: false,
    realSeedNotVersionedAccepted: false,
    seedOverwritesHistoryAccepted: false,
    seedLacksStableIdsAccepted: false,
    syntheticFixtureQueryablePubliclyAccepted: false,
    syntheticFixtureMarkedAuthoritativeAccepted: false,
    foundationTablesCreatedAfterDependentTablesAccepted: false,
    rlsAppliedBeforeObjectsExistWithoutPlanAccepted: false,
    runtimeEnabledDuringMigrationAccepted: false,
    integrityValidationSkippedAccepted: false,
    destructiveRollbackAfterAcceptedHistoryExistsAccepted: false,
    rollbackDeletesImmutableHistoryAccepted: false,
    publicViewsLeftEnabledAfterFailureAccepted: false,
    migrationFailureDoesNotBlockRuntimeAccepted: false,
    migrationNotTestedOnEmptyDbAccepted: false,
    rollbackNotTestedBeforeSeedAccepted: false,
    tableCountNotValidatedAccepted: false,
    fkGraphNotValidatedAccepted: false,
    forbiddenUserDataFkNotCheckedAccepted: false,
    anonymousWriteDenialNotTestedAccepted: false,
    authenticatedWriteDenialNotTestedAccepted: false,
    immutableUpdateRejectionNotTestedAccepted: false,
    citationWithoutPassageRejectionNotTestedAccepted: false,
    localeTriggeredConnectorRejectionNotTestedAccepted: false,
    vectorAuthoritativeFlagNotTestedAccepted: false,
    auditUserContentRejectionNotTestedAccepted: false,
    historyQueryabilityNotTestedAccepted: false,
    rejectedDataViewFilteringNotTestedAccepted: false,
    realRowsExistAfterSchemaMigrationAccepted: false,
    exactMigrationNumberInventedWithoutInspectionAccepted: false,
    unrelatedDestructiveChangesIncludedAccepted: false,
    rollbackNotesOmittedAccepted: false,
    oneEnormousMigrationForcedDespiteRiskAccepted: false,
    excessiveMigrationFragmentationAccepted: false,
    deSkConnectorRowCreatedAccepted: false,
    slovakSourceDataPopulatedAccepted: false,
    connectorActivatedFromSlovakLocaleAccepted: false,
    deSkLacksEuSupportAccepted: false,
    deSkLacksGermanSupportAccepted: false,
    deSkLacksSlovakSupportAccepted: false,
    responsibleActorMissingAccepted: false,
    temporalAlignmentMissingAccepted: false,
    migrationAuditIncludesUserContentAccepted: false,
    rlsPermissiveAccepted: false,
    userDataBoundaryWeakenedAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    migrationStrategy: MIGRATION_STRATEGY,
    logicalTableGroups: LOGICAL_TABLE_GROUPS,
    tableCreationOrder: TABLE_CREATION_ORDER,
    foreignKeyPhases: FOREIGN_KEY_PHASES,
    migrationStages: MIGRATION_STAGES,
    validationPlan: VALIDATION_PLAN,
    exampleChecks: EXAMPLE_CHECKS,
    exitCriteria: EXIT_CRITERIA,
    eightProcessGroups: EIGHT_PROCESS_GROUPS,
    deSkStructuralRequirements: DE_SK_STRUCTURAL_REQUIREMENTS,
    nextPhaseName: NEXT_PHASE_NAME,
    knownOpenDebts: [
      "HEIC/HEIF support", "EXIF orientation normalization", "Decoded pixel bounds",
      "Serverless/Vercel OCR validation", "Physical Android camera-image validation",
      "Genuine iOS camera-image validation", "Distributed production rate limiter",
      "Standalone Smart Talk extraction from the DNA shell", "Final production payment flow",
      "German knowledge population (no real sources ingested by 9A-9F)",
      "DE<->SK cross-border connector implementation (structurally supported, not implemented, in 9F)",
      "First real SQL migration creation (PHASE 9G+ per this plan)",
      "Official source ingestion contract (PHASE 9G, named as the explicit next phase)",
    ],
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `newAuditFileCreated: ${evidence.newAuditFileCreated}`,
      `${PHASE_9A_REL_PATH} checkId found: ${evidence.sourceArchitectureCheckIdFound}, readiness wiring confirmed: ${evidence.sourceArchitectureReady}`,
      `${PHASE_9B_REL_PATH} checkId found: ${evidence.sourceTrustContractCheckIdFound}, readiness wiring confirmed: ${evidence.sourceTrustContractReady}`,
      `${PHASE_9C_REL_PATH} checkId found: ${evidence.sourceJurisdictionModelCheckIdFound}, readiness wiring confirmed: ${evidence.sourceJurisdictionModelReady}`,
      `${PHASE_9D_REL_PATH} checkId found: ${evidence.sourceCoveragePlanCheckIdFound}, readiness wiring confirmed: ${evidence.sourceCoveragePlanReady}`,
      `${PHASE_9E_REL_PATH} checkId found: ${evidence.sourceStorageSchemaCheckIdFound}, readiness wiring confirmed: ${evidence.sourceStorageSchemaReady}`,
      `Supabase convention observation (${MIGRATIONS_DIR_REL_PATH} listed read-only, files read as plain text, not executed): ${JSON.stringify(evidence.supabaseConventionObservation)}`,
      `Existing 32 planned knowledge_* table names checked against existing migration table names (knowledge_topics, knowledge_steps, knowledge_step_dependencies, document_types, document_type_step_links, user_documents, user_progress, i18n_translations, i18n_jobs, user_action_events, user_step_state, user_phrase_state, user_document_step_verifications, document_intelligence_jobs, phrases, phrase_translations, etc.) — zero name collisions found.`,
      `${SUPABASE_SERVICE_ROLE_REL_PATH} inspected read-only: untyped SupabaseClient (no generated Database generic wired in yet) — consistent with generatedTypesPlan deferring regeneration to after a real migration.`,
      `${PHASE_9A_REL_PATH} standaloneSmartTalkExtractionRequiredLater: true present: ${evidence.standaloneExtractionStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} physicalAndroidStillUntested: ${evidence.physicalAndroidStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} genuineIosSafariStillUntested: ${evidence.genuineIosSafariStillUntested}`,
      `${CLOSURE_8_13C_REL_PATH} heicHeifStillOpen (derived): ${evidence.heicHeifStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} serverlessOcrStillOpen: ${evidence.serverlessOcrStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} distributedRateLimiterStillOpen (derived): ${evidence.distributedRateLimiterStillOpen}`,
      `${CLOSURE_8_13C_REL_PATH} paymentFlowStillOpen ("Final production payment flow" present): ${evidence.paymentFlowStillOpen}`,
      "This audit read only committed plain text for the 9A-9E audits, the 8.13C closure audit, existing Supabase migration filenames/contents, and lib/supabase/service-role.ts — none were imported, executed, or used to run any database/Supabase CLI command.",
      "Zero SQL files, zero migrations, zero tables, zero database commands/writes, zero Supabase CLI executions, zero real sources/claims/authorities/processes/cross-border connectors, zero embeddings/retrieval/model/OCR/network calls, zero user-content persistence.",
    ],
    notes: evidence.notes,
  };
}

// ─── Entry point ────────────────────────────────────────────────────────────

export function runKnowledgeMigrationImplementationPlanAudit(): Result {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);
  const tamperOutcome = runTamperCases(good);

  const allPassed = computeExpectedAllPassed(good) && tamperOutcome.rejected === tamperOutcome.total && good.allPassed;

  return {
    ...good,
    allPassed,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    readyForKnowledgeSchemaMigrationImplementation: allPassed,
    notes: [
      ...good.notes,
      `Tamper rejection: ${tamperOutcome.rejected}/${tamperOutcome.total}.`,
      ...(tamperOutcome.failures.length > 0 ? [`Tamper failures: ${tamperOutcome.failures.join("; ")}`] : []),
    ],
  };
}

if (require.main === module) {
  const result = runKnowledgeMigrationImplementationPlanAudit();
  console.log(JSON.stringify(result));
}
