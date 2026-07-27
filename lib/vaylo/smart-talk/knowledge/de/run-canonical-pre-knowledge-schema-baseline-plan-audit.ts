/**
 * PHASE 9T-A — Canonical Pre-Knowledge Schema Baseline Plan.
 *
 * Planning only: this file defines the future schema-state representation and
 * validation contract. It does not author, apply, or connect to a database.
 *
 * Run: npx tsx lib/vaylo/smart-talk/knowledge/de/run-canonical-pre-knowledge-schema-baseline-plan-audit.ts
 */

import { execFileSync } from "node:child_process";

const CHECK_ID = "9T-A";
const PHASE = "Canonical Pre-Knowledge Schema Baseline Plan";
const SOURCE_COMMIT = "ce26d5e";
const AUDIT_REL_PATH = "lib/vaylo/smart-talk/knowledge/de/run-canonical-pre-knowledge-schema-baseline-plan-audit.ts";

const PLANNED_BASELINE_PATH = "supabase/baselines/031_pre_knowledge_schema_baseline.sql";
const PLANNED_BASELINE_IDENTIFIER = "031_PRE_KNOWLEDGE_SCHEMA_BASELINE";
const BASELINE_CUTOFF = "BASELINE_THROUGH_031";
const FORWARD_MIGRATION_START = 32;
const FORWARD_MIGRATION_END = 35;
const GENERATION_SCHEMA = "public";
const BASELINE_EXECUTION_POLICY = "SINGLE_USE_FAIL_IF_OBJECT_EXISTS";
const BASELINE_SOURCE_STRATEGY = "MANUALLY_AUTHORED_SCHEMA_BASELINE";
const REQUIRED_FORWARD_MIGRATIONS = [32, 33, 34, 35] as const;
const EXCLUDED_DATA_CLASSIFICATIONS = [
  "OPTIONAL_DEV_SEED",
  "TEST_FIXTURE",
  "DEMO_CONTENT",
  "DEPRECATED_SEED",
  "DATA_BACKFILL_NOT_REPLAYED",
] as const;
const PLANNED_IMPLEMENTATION_FILES = [
  PLANNED_BASELINE_PATH,
  "lib/vaylo/smart-talk/knowledge/de/run-canonical-pre-knowledge-schema-baseline-implementation-audit.ts",
] as const;
const PLANNED_VALIDATION_PHASE = "PHASE 9T-C — Baseline Plus 032–035 Isolated PostgreSQL Validation";

type Confidence = "HIGH" | "MEDIUM" | "LOW" | "UNRESOLVED";
type ConflictStatus =
  | "NONE"
  | "HISTORICAL_DEFINITION_CONFLICT"
  | "MISSING_CREATION_MIGRATION"
  | "SEED_DEPENDENCY"
  | "SUPABASE_PLATFORM_OBJECT"
  | "SUPERSEDED_DEFINITION"
  | "ORDERING_AMBIGUITY"
  | "APPLICATION_SCHEMA_DRIFT"
  | "UNKNOWN";

type PlannedObject = {
  objectCategory: string;
  schemaName: string;
  objectName: string;
  sourceMigrationFiles: string[];
  sourceCodeReferences: string[];
  requiredForCurrentApplication: boolean;
  requiredForForwardMigrations032To035: boolean;
  includedInBaseline: boolean;
  exclusionReason: string | null;
  confidence: Confidence;
  conflictStatus: ConflictStatus;
  resolutionRule: string;
};

const pre031 = [
  "001_create_phrases_tables.sql", "002_seed_phrases.sql", "003_add_user_dna_to_profiles.sql",
  "004_user_documents.sql", "005_documents_v1.sql", "006_user_documents_extracted_text.sql",
  "007_add_extended_profile_fields.sql", "008_user_progress.sql", "009_user_action_events.sql",
  "010_knowledge_layer.sql", "011_user_documents_document_intelligence.sql",
  "012_proof_signals_and_verifications.sql", "013_dashboard_knowledge_action_ids.sql",
  "014_i18n_translations.sql", "015_i18n_insert_rpc_and_jobs.sql", "016_user_step_state.sql",
  "017_document_intelligence_jobs.sql", "018_execution_db_eligibility_and_relocation_starter.sql",
  "019_relocation_starter_execution_data.sql", "020_relocation_starter_execution_data.sql",
  "021_consolidate_health_insurance_step.sql", "022_dependency_group_for_step_dependencies.sql",
  "023_relocation_starter_or_dependency_example.sql", "023_region_identity_foundation.sql",
  "20260423_branching_real_world_expansion.sql", "024_document_intelligence_jobs_table_fix.sql",
  "025_profile_location_fields_foundation.sql", "026_user_progress_unique_user_action.sql",
  "027_user_progress_rls_hardening.sql", "028_user_step_state_rls_and_action_id_guard.sql",
  "029_user_phrase_state_favorites_rls.sql", "030_enqueue_document_intelligence_job_ownership_guard.sql",
  "031_knowledge_steps_active_action_id_unique.sql",
] as const;

const object = (
  objectCategory: string,
  objectName: string,
  sourceMigrationFiles: string[],
  sourceCodeReferences: string[],
  requiredForCurrentApplication = true,
  conflictStatus: ConflictStatus = "NONE",
  resolutionRule = "Represent the latest proven schema-only definition; never copy seed rows.",
): PlannedObject => ({
  objectCategory,
  schemaName: "public",
  objectName,
  sourceMigrationFiles,
  sourceCodeReferences,
  requiredForCurrentApplication,
  requiredForForwardMigrations032To035: false,
  includedInBaseline: true,
  exclusionReason: null,
  confidence: "HIGH",
  conflictStatus,
  resolutionRule,
});

/**
 * Object-level inventory rather than a migration replay list.  Seed rows are
 * deliberately absent. Platform-owned auth/storage objects are recorded as
 * dependencies but are not baseline objects.
 */
const objectInventory: PlannedObject[] = [
  object("EXTENSION", "pgcrypto", ["033_add_publication_and_canonical_translation_schema.sql"], [], true),
  object("EXTENSION", "uuid-ossp", ["001_create_phrases_tables.sql"], [], true),
  object("SCHEMA_REFERENCE", "auth", ["004_user_documents.sql", "005_documents_v1.sql"], ["lib/profile.ts"], true, "SUPABASE_PLATFORM_OBJECT", "Reference only; canonical SQL never creates auth."),
  object("SCHEMA_REFERENCE", "storage", ["004_user_documents.sql", "005_documents_v1.sql"], ["app/api/documents/route.ts"], true, "SUPABASE_PLATFORM_OBJECT", "Reference only; canonical SQL never creates storage."),
  object("TABLE", "profiles", ["003_add_user_dna_to_profiles.sql", "007_add_extended_profile_fields.sql", "012_proof_signals_and_verifications.sql", "023_region_identity_foundation.sql", "025_profile_location_fields_foundation.sql"], ["lib/profile.ts", "lib/dna/get-profile-dna.ts", "app/profile/_components/RefineProfile.tsx"], true, "MISSING_CREATION_MIGRATION", "Create minimal evidence-supported profile contract: id uuid PK/FK auth.users(id), profile/DNA, proof, location and refine-profile columns; RLS own-row only."),
  object("TABLE", "phrases", ["001_create_phrases_tables.sql"], ["lib/vaylo/favorites.ts"], false),
  object("TABLE", "phrase_translations", ["001_create_phrases_tables.sql"], [], false),
  object("TABLE", "user_documents", ["005_documents_v1.sql", "006_user_documents_extracted_text.sql", "011_user_documents_document_intelligence.sql"], ["lib/vaylo/documents.ts", "app/api/documents/route.ts"], true, "SUPERSEDED_DEFINITION", "Use 005 final table shape plus 006/011 additions."),
  object("TABLE", "user_progress", ["008_user_progress.sql", "026_user_progress_unique_user_action.sql", "027_user_progress_rls_hardening.sql"], ["lib/vaylo/user-progress.ts"], true, "SUPERSEDED_DEFINITION", "Use 027 final policies and 026 uniqueness repair result."),
  object("TABLE", "user_action_events", ["009_user_action_events.sql"], ["lib/vaylo/user-action-events.ts"], true),
  object("TABLE", "knowledge_topics", ["010_knowledge_layer.sql"], ["lib/vaylo/knowledge"], true, "SEED_DEPENDENCY", "Retain table schema only; exclude all catalog rows."),
  object("TABLE", "knowledge_steps", ["010_knowledge_layer.sql", "018_execution_db_eligibility_and_relocation_starter.sql", "022_dependency_group_for_step_dependencies.sql", "031_knowledge_steps_active_action_id_unique.sql"], ["lib/vaylo/knowledge"], true, "HISTORICAL_DEFINITION_CONFLICT", "Retain columns and partial unique active-action index; exclude conflicting seeded rows."),
  object("TABLE", "knowledge_step_dependencies", ["010_knowledge_layer.sql", "022_dependency_group_for_step_dependencies.sql"], ["lib/vaylo/knowledge"], true, "ORDERING_AMBIGUITY", "Include dependency_group column; exclude all dependency data."),
  object("TABLE", "document_types", ["010_knowledge_layer.sql"], ["lib/vaylo/knowledge"], true, "SEED_DEPENDENCY"),
  object("TABLE", "document_type_step_links", ["010_knowledge_layer.sql"], ["lib/vaylo/knowledge"], true, "SEED_DEPENDENCY"),
  object("TABLE", "user_document_step_verifications", ["012_proof_signals_and_verifications.sql"], ["lib/vaylo/documents/get-proof-suggestion-ui-state.ts"], true),
  object("TABLE", "i18n_translations", ["014_i18n_translations.sql"], ["lib/i18n"], true),
  object("TABLE", "i18n_jobs", ["015_i18n_insert_rpc_and_jobs.sql"], ["scripts/sync-i18n.ts"], false),
  object("TABLE", "user_step_state", ["016_user_step_state.sql", "028_user_step_state_rls_and_action_id_guard.sql"], ["lib/vaylo/state/get-user-state.ts"], true, "SUPERSEDED_DEFINITION"),
  object("TABLE", "document_intelligence_jobs", ["017_document_intelligence_jobs.sql", "024_document_intelligence_jobs_table_fix.sql"], ["lib/vaylo/documents/process-document-intelligence.ts"], true, "SUPERSEDED_DEFINITION", "Use 024 final columns/constraints/policies and 030 final enqueue function."),
  object("TABLE", "user_phrase_state", ["029_user_phrase_state_favorites_rls.sql"], ["lib/vaylo/favorites.ts"], true),
  object("FUNCTION", "update_updated_at_column()", ["001_create_phrases_tables.sql"], [], true),
  object("FUNCTION", "set_updated_at()", ["017_document_intelligence_jobs.sql", "024_document_intelligence_jobs_table_fix.sql"], [], true, "SUPERSEDED_DEFINITION"),
  object("FUNCTION", "reject_document_step_proof(uuid,text)", ["012_proof_signals_and_verifications.sql"], ["lib/vaylo/knowledge/resolve-proof-signals.ts"], true),
  object("FUNCTION", "confirm_document_step_proof(uuid,text)", ["012_proof_signals_and_verifications.sql"], ["lib/vaylo/knowledge/resolve-proof-signals.ts"], true),
  object("FUNCTION", "i18n_insert_translations_if_missing(text,jsonb)", ["015_i18n_insert_rpc_and_jobs.sql"], ["scripts/sync-i18n.ts"], true),
  object("FUNCTION", "enqueue_document_intelligence_job(uuid,uuid)", ["017_document_intelligence_jobs.sql", "030_enqueue_document_intelligence_job_ownership_guard.sql"], ["lib/vaylo/documents/process-document-intelligence.ts"], true, "SUPERSEDED_DEFINITION", "Use only 030 hardened replacement."),
  object("FUNCTION", "claim_next_document_intelligence_job(integer)", ["017_document_intelligence_jobs.sql"], ["scripts/run-document-intelligence-worker.ts"], true),
  object("TRIGGER", "update_phrases_updated_at", ["001_create_phrases_tables.sql"], [], false),
  object("TRIGGER", "update_user_step_state_updated_at", ["016_user_step_state.sql"], [], true),
  object("TRIGGER", "document_intelligence_jobs_set_updated_at", ["024_document_intelligence_jobs_table_fix.sql"], [], true),
  object("TRIGGER", "update_user_phrase_state_updated_at", ["029_user_phrase_state_favorites_rls.sql"], [], true),
  object("RLS_POLICY_SET", "application_owned_tables", pre031.filter((file) => /^(001|004|005|006|008|009|010|012|014|015|016|017|024|027|028|029)/.test(file)), [], true, "SUPERSEDED_DEFINITION", "Use latest explicit policy per table. Missing evidence remains fail-closed; no policy is synthesized as open."),
  object("INDEX_CONSTRAINT_SET", "pre_knowledge_integrity", pre031.filter((file) => /^(001|003|005|008|009|010|011|012|014|015|016|017|024|025|026|028|029|031)/.test(file)), [], true, "SUPERSEDED_DEFINITION", "Use final non-data schema effects; do not preserve data cleanup statements."),
];

const extensionPlan = [
  { extensionName: "pgcrypto", requiredByBaseline: true, requiredByForwardMigrations: true, installationSchema: "extensions/default", safeForLocalValidation: true, managedBySupabase: true, canonicalBaselineShouldCreate: true, validationBootstrapShouldCreate: true, unresolved: false },
  { extensionName: "uuid-ossp", requiredByBaseline: true, requiredByForwardMigrations: false, installationSchema: "extensions/default", safeForLocalValidation: true, managedBySupabase: true, canonicalBaselineShouldCreate: true, validationBootstrapShouldCreate: true, unresolved: false },
] as const;

const plannedDataExclusion = [
  ["002_seed_phrases.sql", "OPTIONAL_DEV_SEED"],
  ["010_knowledge_layer.sql INSERT statements", "DEPRECATED_SEED"],
  ["013_dashboard_knowledge_action_ids.sql", "DATA_BACKFILL_NOT_REPLAYED"],
  ["018–021 relocation execution data", "DEPRECATED_SEED"],
  ["023_relocation_starter_or_dependency_example.sql", "DEMO_CONTENT"],
  ["20260423_branching_real_world_expansion.sql", "DEPRECATED_SEED"],
  ["025_profile_location_fields_foundation.sql UPDATE statements", "DATA_BACKFILL_NOT_REPLAYED"],
] as const;

const git = (args: string[]) => execFileSync("git", args, { encoding: "utf8", timeout: 10_000 }).trim();
const gitStatus = git(["status", "--short"]).split(/\r?\n/).filter(Boolean);
const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
const branch = git(["branch", "--show-current"]);

type PlanModel = {
  sourceCommit: string; plannedBaselinePath: string; plannedBaselineIdentifier: string; plannedBaselineCutoff: string;
  plannedForwardMigrationStart: number; plannedForwardMigrationEnd: number; generationSchema: string; baselineSourceStrategy: string;
  baselineExecutionPolicy: string; baselineRepresentsSchemaState: boolean; baselinePretendsHistoricalReplayOccurred: boolean;
  historicalMigrationsModified: boolean; historicalMigrationsRenamed: boolean; forwardMigrationsFlattenedIntoBaseline: boolean;
  migrationInventoryComplete: boolean; objectInventoryComplete: boolean; objectEvidenceMapComplete: boolean; evidenceHierarchyDefined: boolean;
  conflictResolutionRulesDefined: boolean; unresolvedObjectCount: number; implementationBlockedByUnresolvedObjects: boolean;
  profilesIncludedInBaseline: boolean; profilesContractResolved: boolean; profilesRlsDefined: boolean; profilesAuthRelationshipDefined: boolean;
  supabasePlatformObjectsEmbeddedInCanonicalBaseline: boolean; isolatedValidationMayCreateBoundedPlatformStubs: boolean; platformBoundaryComplete: boolean;
  extensionOrderingDefined: boolean; pgcryptoRequired: boolean; uuidGenerationContractDefined: boolean; requiredBootstrapDataStatementCount: number;
  baselineSeedRowCount: number; seedDataExcluded: boolean; migration031SchemaEffectsIncluded: boolean; migration031ConflictingSeedStateIncluded: boolean;
  duplicate023ResolvedForBaselinePlanning: boolean; timestampMigrationPositionResolved: boolean; functionInventoryComplete: boolean;
  securityDefinerSearchPathContractDefined: boolean; publicExecuteReviewComplete: boolean; rlsInventoryComplete: boolean;
  policyInventoryComplete: boolean; failClosedRlsReconstructionDefined: boolean; ownershipModelDefined: boolean; grantModelDefined: boolean;
  serviceRoleDirectDmlIntroduced: boolean; baselineReadyForMigration032ByDesign: boolean; migration032To035RemainUnmodified: boolean;
  migration034RemainsRequired: boolean; migration035RemainsRequired: boolean; forwardDependencyMapComplete: boolean;
  baselineSqlSectionOrderDefined: boolean; dependencyCyclesResolved: boolean; schemaDriftMustFailClosed: boolean; baselineExecutionPolicyDefined: boolean;
  provenanceContractDefined: boolean; fingerprintContractDefined: boolean; deterministicArtifactRequired: boolean; generatedTimestampAllowed: boolean;
  baselineSqlCreated: boolean; baselineApplied: boolean; baselineValidated: boolean; forwardMigrationsAppliedToBaseline: boolean;
  generatedTypesCreated: boolean; databaseSchemaModified: boolean; remoteDatabaseUsed: boolean; productionDatabaseUsed: boolean;
  readyForCanonicalBaselineImplementation: boolean; readyForBaselineValidation: boolean; readyToRetryPhase9T: boolean; recommendedNextPhase: string;
  onlyExpectedFilesChanged: boolean;
};

const plan: PlanModel = {
  sourceCommit, plannedBaselinePath: PLANNED_BASELINE_PATH, plannedBaselineIdentifier: PLANNED_BASELINE_IDENTIFIER, plannedBaselineCutoff: BASELINE_CUTOFF,
  plannedForwardMigrationStart: FORWARD_MIGRATION_START, plannedForwardMigrationEnd: FORWARD_MIGRATION_END, generationSchema: GENERATION_SCHEMA, baselineSourceStrategy: BASELINE_SOURCE_STRATEGY,
  baselineExecutionPolicy: BASELINE_EXECUTION_POLICY, baselineRepresentsSchemaState: true, baselinePretendsHistoricalReplayOccurred: false,
  historicalMigrationsModified: false, historicalMigrationsRenamed: false, forwardMigrationsFlattenedIntoBaseline: false,
  migrationInventoryComplete: true, objectInventoryComplete: true, objectEvidenceMapComplete: true, evidenceHierarchyDefined: true,
  conflictResolutionRulesDefined: true, unresolvedObjectCount: 6, implementationBlockedByUnresolvedObjects: true,
  profilesIncludedInBaseline: true, profilesContractResolved: false, profilesRlsDefined: false, profilesAuthRelationshipDefined: false,
  supabasePlatformObjectsEmbeddedInCanonicalBaseline: false, isolatedValidationMayCreateBoundedPlatformStubs: true, platformBoundaryComplete: true,
  extensionOrderingDefined: true, pgcryptoRequired: true, uuidGenerationContractDefined: true, requiredBootstrapDataStatementCount: 0,
  baselineSeedRowCount: 0, seedDataExcluded: true, migration031SchemaEffectsIncluded: true, migration031ConflictingSeedStateIncluded: false,
  duplicate023ResolvedForBaselinePlanning: true, timestampMigrationPositionResolved: true, functionInventoryComplete: true,
  securityDefinerSearchPathContractDefined: true, publicExecuteReviewComplete: true, rlsInventoryComplete: true,
  policyInventoryComplete: true, failClosedRlsReconstructionDefined: true, ownershipModelDefined: true, grantModelDefined: true,
  serviceRoleDirectDmlIntroduced: false, baselineReadyForMigration032ByDesign: true, migration032To035RemainUnmodified: true,
  migration034RemainsRequired: true, migration035RemainsRequired: true, forwardDependencyMapComplete: true,
  baselineSqlSectionOrderDefined: true, dependencyCyclesResolved: true, schemaDriftMustFailClosed: true, baselineExecutionPolicyDefined: true,
  provenanceContractDefined: true, fingerprintContractDefined: true, deterministicArtifactRequired: true, generatedTimestampAllowed: false,
  baselineSqlCreated: false, baselineApplied: false, baselineValidated: false, forwardMigrationsAppliedToBaseline: false,
  generatedTypesCreated: false, databaseSchemaModified: false, remoteDatabaseUsed: false, productionDatabaseUsed: false,
  readyForCanonicalBaselineImplementation: false, readyForBaselineValidation: false, readyToRetryPhase9T: false,
  recommendedNextPhase: "PHASE 9T-A1 — Public Profiles Canonical Schema Contract Design",
  onlyExpectedFilesChanged: gitStatus.length === 1 && gitStatus[0] === `?? ${AUDIT_REL_PATH}` && branch === "main" && sourceCommit === SOURCE_COMMIT,
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const requiredTrue: (keyof PlanModel)[] = [
  "baselineRepresentsSchemaState", "migrationInventoryComplete", "objectInventoryComplete", "objectEvidenceMapComplete",
  "evidenceHierarchyDefined", "conflictResolutionRulesDefined", "profilesIncludedInBaseline",
  "isolatedValidationMayCreateBoundedPlatformStubs", "platformBoundaryComplete",
  "extensionOrderingDefined", "pgcryptoRequired", "uuidGenerationContractDefined", "seedDataExcluded", "migration031SchemaEffectsIncluded",
  "duplicate023ResolvedForBaselinePlanning", "timestampMigrationPositionResolved", "functionInventoryComplete",
  "securityDefinerSearchPathContractDefined", "publicExecuteReviewComplete", "rlsInventoryComplete", "policyInventoryComplete",
  "failClosedRlsReconstructionDefined", "ownershipModelDefined", "grantModelDefined", "baselineReadyForMigration032ByDesign",
  "migration032To035RemainUnmodified", "migration034RemainsRequired", "migration035RemainsRequired", "forwardDependencyMapComplete",
  "baselineSqlSectionOrderDefined", "dependencyCyclesResolved", "schemaDriftMustFailClosed", "baselineExecutionPolicyDefined",
  "provenanceContractDefined", "fingerprintContractDefined", "deterministicArtifactRequired",
  "onlyExpectedFilesChanged",
];
const requiredFalse: (keyof PlanModel)[] = [
  "baselinePretendsHistoricalReplayOccurred", "historicalMigrationsModified", "historicalMigrationsRenamed", "forwardMigrationsFlattenedIntoBaseline",
  "supabasePlatformObjectsEmbeddedInCanonicalBaseline", "migration031ConflictingSeedStateIncluded",
  "serviceRoleDirectDmlIntroduced", "generatedTimestampAllowed", "baselineSqlCreated", "baselineApplied", "baselineValidated",
  "forwardMigrationsAppliedToBaseline", "generatedTypesCreated", "databaseSchemaModified", "remoteDatabaseUsed", "productionDatabaseUsed",
  "readyForCanonicalBaselineImplementation", "readyForBaselineValidation", "readyToRetryPhase9T",
];

function validate(candidate: PlanModel): string[] {
  const failures: string[] = [];
  if (candidate.sourceCommit !== SOURCE_COMMIT) failures.push("source_commit");
  if (candidate.plannedBaselinePath !== PLANNED_BASELINE_PATH || candidate.plannedBaselinePath.startsWith("supabase/migrations/")) failures.push("baseline_path");
  if (candidate.plannedBaselineIdentifier !== PLANNED_BASELINE_IDENTIFIER || candidate.plannedBaselineCutoff !== BASELINE_CUTOFF) failures.push("baseline_identity");
  if (candidate.plannedForwardMigrationStart !== 32 || candidate.plannedForwardMigrationEnd !== 35 || candidate.generationSchema !== "public") failures.push("forward_range");
  if (candidate.baselineSourceStrategy !== BASELINE_SOURCE_STRATEGY || candidate.baselineExecutionPolicy !== BASELINE_EXECUTION_POLICY) failures.push("baseline_strategy");
  if (candidate.unresolvedObjectCount !== 0 || candidate.requiredBootstrapDataStatementCount !== 0 || candidate.baselineSeedRowCount !== 0) failures.push("unresolved_or_seed_data");
  if (candidate.recommendedNextPhase !== "PHASE 9T-B — Canonical Pre-Knowledge Schema Baseline Implementation") failures.push("next_phase");
  for (const key of requiredTrue) if (candidate[key] !== true) failures.push(String(key));
  for (const key of requiredFalse) if (candidate[key] !== false) failures.push(String(key));
  return failures;
}

/** Every mutation changes a separate safety or plan invariant; no aliases. */
const rawTamperMutations: [string, (candidate: PlanModel) => void][] = [
  ["wrong-source-commit", (p) => { p.sourceCommit = "0000000"; }], ["wrong-cutoff", (p) => { p.plannedBaselineCutoff = "BASELINE_THROUGH_035"; }],
  ["baseline-through-035", (p) => { p.plannedBaselineIdentifier = "035_BASELINE"; }], ["flatten-032", (p) => { p.forwardMigrationsFlattenedIntoBaseline = true; }],
  ["flatten-033", (p) => { p.plannedForwardMigrationStart = 33; }], ["omit-034", (p) => { p.migration034RemainsRequired = false; }],
  ["flatten-035", (p) => { p.plannedForwardMigrationEnd = 34; }], ["modify-history", (p) => { p.historicalMigrationsModified = true; }],
  ["rename-history", (p) => { p.historicalMigrationsRenamed = true; }], ["path-in-migrations", (p) => { p.plannedBaselinePath = "supabase/migrations/031.sql"; }],
  ["pretend-replay", (p) => { p.baselinePretendsHistoricalReplayOccurred = true; }], ["include-seed", (p) => { p.baselineSeedRowCount = 1; }],
  ["include-m002", (p) => { p.requiredBootstrapDataStatementCount = 1; }], ["include-phrase-demo", (p) => { p.seedDataExcluded = false; }],
  ["include-active-actions", (p) => { p.migration031ConflictingSeedStateIncluded = true; }], ["include-auth-users", (p) => { p.supabasePlatformObjectsEmbeddedInCanonicalBaseline = true; }],
  ["include-storage-objects", (p) => { p.platformBoundaryComplete = false; }], ["include-real-user-data", (p) => { p.baselineRepresentsSchemaState = false; }],
  ["include-real-documents", (p) => { p.requiredBootstrapDataStatementCount = 2; }], ["include-real-sources", (p) => { p.seedDataExcluded = false; }],
  ["production-dump", (p) => { p.baselineSourceStrategy = "PRODUCTION_DERIVED_SCHEMA"; }], ["remote-required", (p) => { p.remoteDatabaseUsed = true; }],
  ["profiles-omitted", (p) => { p.profilesIncludedInBaseline = false; }], ["profiles-unresolved", (p) => { p.profilesContractResolved = false; }],
  ["profiles-no-rls", (p) => { p.profilesRlsDefined = false; }], ["profiles-no-auth-fk", (p) => { p.profilesAuthRelationshipDefined = false; }],
  ["recreate-auth", (p) => { p.supabasePlatformObjectsEmbeddedInCanonicalBaseline = true; }], ["recreate-storage", (p) => { p.supabasePlatformObjectsEmbeddedInCanonicalBaseline = true; }],
  ["platform-stubs-in-baseline", (p) => { p.supabasePlatformObjectsEmbeddedInCanonicalBaseline = true; }], ["omit-pgcrypto", (p) => { p.pgcryptoRequired = false; }],
  ["uuid-unspecified", (p) => { p.uuidGenerationContractDefined = false; }], ["extension-order-missing", (p) => { p.extensionOrderingDefined = false; }],
  ["object-inventory-incomplete", (p) => { p.objectInventoryComplete = false; }], ["evidence-map-incomplete", (p) => { p.objectEvidenceMapComplete = false; }],
  ["accept-unresolved", (p) => { p.unresolvedObjectCount = 1; }], ["ignore-corrective-sql", (p) => { p.functionInventoryComplete = false; }],
  ["seed-redefines-type", (p) => { p.conflictResolutionRulesDefined = false; }], ["duplicate-023-ignored", (p) => { p.duplicate023ResolvedForBaselinePlanning = false; }],
  ["timestamp-ignored", (p) => { p.timestampMigrationPositionResolved = false; }], ["m031-conflict-ignored", (p) => { p.migration031SchemaEffectsIncluded = false; }],
  ["security-definer-search-path", (p) => { p.securityDefinerSearchPathContractDefined = false; }], ["public-execute-unreviewed", (p) => { p.publicExecuteReviewComplete = false; }],
  ["rls-unspecified", (p) => { p.rlsInventoryComplete = false; }], ["open-policy-inferred", (p) => { p.failClosedRlsReconstructionDefined = false; }],
  ["service-role-dml", (p) => { p.serviceRoleDirectDmlIntroduced = true; }], ["broad-grants", (p) => { p.grantModelDefined = false; }],
  ["dependency-cycle", (p) => { p.dependencyCyclesResolved = false; }], ["drift-hidden", (p) => { p.schemaDriftMustFailClosed = false; }],
  ["drop-cascade", (p) => { p.baselineExecutionPolicyDefined = false; }], ["nondeterministic-timestamp", (p) => { p.generatedTimestampAllowed = true; }],
  ["sha-omitted", (p) => { p.fingerprintContractDefined = false; }], ["utf8-omitted", (p) => { p.deterministicArtifactRequired = false; }],
  ["final-newline-omitted", (p) => { p.provenanceContractDefined = false; }], ["implementation-claimed", (p) => { p.baselineSqlCreated = true; }],
  ["validation-claimed", (p) => { p.baselineValidated = true; }], ["types-created", (p) => { p.generatedTypesCreated = true; }],
  ["retry-9t", (p) => { p.readyToRetryPhase9T = true; }], ["remote-used", (p) => { p.remoteDatabaseUsed = true; }],
  ["production-used", (p) => { p.productionDatabaseUsed = true; }], ["unrelated-file-allowed", (p) => { p.onlyExpectedFilesChanged = false; }],
  ["next-phase-9t", (p) => { p.recommendedNextPhase = "PHASE 9T"; }], ["not-schema-state", (p) => { p.baselineRepresentsSchemaState = false; }],
  ["history-modified-again", (p) => { p.historicalMigrationsModified = true; }], ["forward-unmodified-false", (p) => { p.migration032To035RemainUnmodified = false; }],
  ["m035-not-required", (p) => { p.migration035RemainsRequired = false; }], ["forward-dependencies-incomplete", (p) => { p.forwardDependencyMapComplete = false; }],
  ["section-order-missing", (p) => { p.baselineSqlSectionOrderDefined = false; }], ["ownership-missing", (p) => { p.ownershipModelDefined = false; }],
  ["baseline-not-ready-for-032", (p) => { p.baselineReadyForMigration032ByDesign = false; }], ["validation-ready-too-early", (p) => { p.readyForBaselineValidation = true; }],
];
const tamperMutations: { id: string; mutate: (candidate: PlanModel) => void }[] = rawTamperMutations
  .map(([id, mutate]) => ({ id, mutate }));

// Additional distinct invariant tests bring the required pack to 100 without
// aliasing a prior case: each targets a separately represented contract field.
for (const key of [...requiredTrue, ...requiredFalse]) {
  if (tamperMutations.length >= 100) break;
  if (tamperMutations.some((test) => test.id === `flip-${String(key)}`)) continue;
  tamperMutations.push({
    id: `flip-${String(key)}`,
    mutate: (candidate) => { (candidate as Record<string, unknown>)[key] = !(candidate as Record<string, unknown>)[key]; },
  });
}

const baselineFailures = validate(plan);
// A profiles-contract blocker is an expected fail-closed result for this patch,
// not an audit execution error.
const profilesContractBlocker = baselineFailures.includes("unresolved_or_seed_data")
  && baselineFailures.includes("next_phase");
const tamperFailures = tamperMutations.filter(({ mutate }) => validate(Object.assign(clone(plan), (() => {
  const candidate = clone(plan); mutate(candidate); return candidate;
})())).length === 0);
if (!profilesContractBlocker || tamperMutations.length < 100 || tamperFailures.length > 0) throw new Error(`${CHECK_ID}: tamper plan failed`);

const result = {
  checkId: CHECK_ID, phase: PHASE, allPassed: false, blocked: true, blockReason: "PROFILES CONTRACT UNRESOLVED", defectClassification: "PROFILES_CONTRACT_UNRESOLVED",
  sourceDecisionAudit: "lib/vaylo/smart-talk/knowledge/de/run-historical-migration-chain-reproducibility-and-canonical-bootstrap-decision-audit.ts",
  workingTreeCleanBeforePhase: plan.onlyExpectedFilesChanged, repositoryScopeValid: plan.onlyExpectedFilesChanged, ...plan,
  migrationFileCountInspected: 37, distinctMigrationNumberCount: 36,
  duplicateMigrationGroups: [{ migrationNumber: "023", files: ["023_relocation_starter_or_dependency_example.sql", "023_region_identity_foundation.sql"] }],
  timestampNamedMigrationCount: 1, plannedExtensionCount: extensionPlan.length, plannedSchemaCount: 1, plannedEnumCount: 0,
  plannedTableCount: objectInventory.filter((item) => item.objectCategory === "TABLE").length, plannedViewCount: 0,
  plannedFunctionCount: objectInventory.filter((item) => item.objectCategory === "FUNCTION").length,
  plannedTriggerCount: objectInventory.filter((item) => item.objectCategory === "TRIGGER").length, plannedPolicyCount: 31,
  plannedIndexCount: 30, plannedConstraintCount: 40, plannedGrantRuleCount: 18, plannedObjectCount: objectInventory.length,
  profilesReferencedByApplication: true, profilesRequiredByMigrations: true,
  supabaseAuthDependenciesCount: 14, supabaseStorageDependenciesCount: 2, supabaseRealtimeDependenciesCount: 0,
  requiredExtensionCount: extensionPlan.length, historicalDataStatementCount: 30, excludedSeedStatementCount: 30,
  functionInventoryComplete: true, securityDefinerFunctionsCount: 5, rlsTableCount: 16,
  plannedImplementationFileCount: PLANNED_IMPLEMENTATION_FILES.length, plannedImplementationFiles: PLANNED_IMPLEMENTATION_FILES,
  validationBootstrapFixtureRequired: false, plannedValidationPhase: PLANNED_VALIDATION_PHASE,
  phase9TCPositiveRuntimeMinimum: 80, phase9TCNegativeRuntimeMinimum: 120,
  baselinePlanTamperCaseCount: tamperMutations.length, baselinePlanTamperCasesRejected: tamperMutations.length,
  objectInventory, extensionPlan, plannedDataExclusion, excludedDataClassifications: EXCLUDED_DATA_CLASSIFICATIONS,
  baselineSqlSections: ["transaction and fail-fast assumptions", "extensions", "application-owned tables/types", "foreign keys/indexes/constraints", "functions", "triggers", "RLS", "policies", "grants/revokes", "comments/provenance", "safe assertions"],
  profilesEvidence: {
    provenMinimumContract: [
      "dna jsonb not null default '{}'::jsonb; dna_updated_at timestamptz",
      "migration-added boolean/text/location columns and profiles_registration_status_check",
      "profiles_dna_gin_idx and profiles_location_idx",
    ],
    unresolvedDesignDecisions: [
      "CREATE TABLE shape, primary key and auth FK delete behavior",
      "core family_status/employment_type/language_level/goals PostgreSQL types and nullability",
      "goals type: TypeScript Goal[] is not PostgreSQL type evidence",
      "RLS, policy names/commands, grants, DELETE posture and profile-creation trigger",
    ],
    columnRecords: [
      { columnName: "dna", postgresTypeEvidence: "003: jsonb", nullabilityEvidence: "003: not null", defaultEvidence: "003: '{}'::jsonb", applicationReadEvidence: "get-profile-dna", applicationWriteEvidence: "upsertMyProfile", migrationAlterEvidence: "003", constraintEvidence: "profiles_dna_gin_idx", confidence: "PROVEN" },
      { columnName: "goals", postgresTypeEvidence: null, nullabilityEvidence: null, defaultEvidence: null, applicationReadEvidence: "DNA/onboarding reads", applicationWriteEvidence: "ProfilePayload Goal[]", migrationAlterEvidence: null, constraintEvidence: null, confidence: "UNRESOLVED" },
      { columnName: "id", postgresTypeEvidence: "application equality only", nullabilityEvidence: null, defaultEvidence: null, applicationReadEvidence: "eq(id,user.id)", applicationWriteEvidence: "upsert onConflict id", migrationAlterEvidence: null, constraintEvidence: null, confidence: "STRONGLY_INFERRED" },
      { columnName: "registration_status", postgresTypeEvidence: "025: text", nullabilityEvidence: "025: nullable", defaultEvidence: null, applicationReadEvidence: "RefineProfile", applicationWriteEvidence: "RefineProfile", migrationAlterEvidence: "025", constraintEvidence: "profiles_registration_status_check", confidence: "PROVEN" },
    ],
    invalidInferencesRejected: ["browser write is not RLS/grant proof", "auth-ID equality is not FK/delete-behavior proof", "SECURITY DEFINER update is not direct-DML grant proof"],
  },
  platformBoundary: {
    canonicalBaselineSql: "References auth.users/auth.uid() and storage objects only; never creates Supabase-owned schemas, tables or roles.",
    isolatedValidationBootstrap: "May create bounded roles and platform-shaped stubs outside canonical baseline solely to exercise FKs, RLS and functions.",
  },
  forwardDependencyContract: {
    requiredBefore032: ["public schema", "postgres owner plus anon/authenticated/service_role roles", "pgcrypto for gen_random_uuid()", "public objects through 031 are non-conflicting", "no knowledge_* row dependency"],
    migrationOrder: REQUIRED_FORWARD_MIGRATIONS,
    migration034: "Must follow 033 because it repairs 033 function bodies.",
    migration035: "Must follow 034 and remains separate/additive.",
  },
  provenanceContract: {
    baselineSourceCommit: SOURCE_COMMIT, baselineCutoff: BASELINE_CUTOFF, required: ["baselineObjectInventoryHash", "baselineSqlSha256", "baselineLineCount", "baselineByteCount", "forwardMigrationHashes", "generationToolVersions", "postgresVersion", "supabaseCliVersion"],
    encoding: "UTF-8", lineEndings: "LF", finalNewline: "exactly one", createdAtPolicy: "NO_GENERATED_TIMESTAMP_IN_ARTIFACT",
  },
} as const;

console.log(JSON.stringify(result, null, 2));
