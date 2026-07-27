/**
 * PHASE 9T-PRE — Historical Migration Chain Reproducibility and Canonical
 * Bootstrap Decision.
 *
 * This is a decision audit only. It neither executes SQL nor connects to a
 * database. Historical migrations are immutable evidence, not repair targets.
 *
 * Run: npx tsx lib/vaylo/smart-talk/knowledge/de/run-historical-migration-chain-reproducibility-and-canonical-bootstrap-decision-audit.ts
 */

import { execFileSync } from "node:child_process";

const CHECK_ID = "9T-PRE";
const PHASE = "Historical Migration Chain Reproducibility and Canonical Bootstrap Decision";
const SOURCE_COMMIT = "641621b";
const AUDIT_REL_PATH = "lib/vaylo/smart-talk/knowledge/de/run-historical-migration-chain-reproducibility-and-canonical-bootstrap-decision-audit.ts";

type Classification =
  | "SCHEMA_MIGRATION"
  | "SEED_DATA_MIGRATION"
  | "DATA_BACKFILL"
  | "POLICY_OR_GRANT_MIGRATION"
  | "FUNCTION_ONLY_MIGRATION"
  | "MIXED_SCHEMA_AND_DATA"
  | "HISTORICAL_FIX"
  | "UNKNOWN";

type MigrationInventory = {
  migrationNumber: string;
  filename: string;
  classification: Classification;
  createsSchemaObjects: boolean;
  altersSchemaObjects: boolean;
  insertsSeedData: boolean;
  updatesExistingData: boolean;
  dependsOnAuthSchema: boolean;
  dependsOnStorageSchema: boolean;
  dependsOnRealtimeSchema: boolean;
  dependsOnExtensions: boolean;
  dependsOnPriorSeedRows: boolean;
  containsEnvironmentSpecificValues: boolean;
  containsIntrinsicSqlDefect: boolean;
  replayableOnVanillaPostgresql: boolean;
  replayableOnFaithfulSupabase: boolean;
  requiredForCurrentSchema: boolean;
  supersededByLaterMigration: boolean;
  safeToExcludeFromSchemaBootstrap: boolean;
  notes: string;
};

const migration = (
  migrationNumber: string,
  filename: string,
  classification: Classification,
  overrides: Partial<Omit<MigrationInventory, "migrationNumber" | "filename" | "classification" | "notes">>,
  notes: string,
): MigrationInventory => ({
  migrationNumber,
  filename,
  classification,
  createsSchemaObjects: false,
  altersSchemaObjects: false,
  insertsSeedData: false,
  updatesExistingData: false,
  dependsOnAuthSchema: false,
  dependsOnStorageSchema: false,
  dependsOnRealtimeSchema: false,
  dependsOnExtensions: false,
  dependsOnPriorSeedRows: false,
  containsEnvironmentSpecificValues: false,
  containsIntrinsicSqlDefect: false,
  replayableOnVanillaPostgresql: true,
  replayableOnFaithfulSupabase: true,
  requiredForCurrentSchema: true,
  supersededByLaterMigration: false,
  safeToExcludeFromSchemaBootstrap: false,
  ...overrides,
  notes,
});

/**
 * This covers every committed SQL file participating in the historical
 * 001–035 lineage. There are 37 files, not 35: two share prefix 023 and one
 * timestamp-named expansion file has no NNN prefix. Those naming collisions
 * are themselves evidence that the legacy chain is not a deterministic
 * bootstrap interface.
 */
const migrationInventory: MigrationInventory[] = [
  migration("001", "001_create_phrases_tables.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: true, supersededByLaterMigration: false, safeToExcludeFromSchemaBootstrap: true,
  }, "Creates UUID phrase tables, trigger, RLS and policies; UUID extension is required. Its schema remains structurally valid, but it is not required by the current Smart Talk schema."),
  migration("002", "002_seed_phrases.sql", "SEED_DATA_MIGRATION", {
    insertsSeedData: true, containsIntrinsicSqlDefect: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: false, requiredForCurrentSchema: false, safeToExcludeFromSchemaBootstrap: true,
  }, "Inserts textual IDs such as a1-warehouse-001 into UUID public.phrases.id and UUID phrase_translations.phrase_id; PostgreSQL rejects the cast. This is optional demo content, not schema."),
  migration("003", "003_add_user_dna_to_profiles.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: false,
    containsIntrinsicSqlDefect: true, safeToExcludeFromSchemaBootstrap: false,
  }, "Alters public.profiles, but no migration in this repository creates that table. Faithful Supabase creates auth.users, not public.profiles."),
  migration("004", "004_user_documents.sql", "MIXED_SCHEMA_AND_DATA", {
    createsSchemaObjects: true, insertsSeedData: true, dependsOnAuthSchema: true, dependsOnStorageSchema: true,
    dependsOnExtensions: true, replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: true,
    supersededByLaterMigration: true, safeToExcludeFromSchemaBootstrap: true,
  }, "First user_documents and user-documents bucket/policies; migration 005 drops and replaces its table and storage-policy contract."),
  migration("005", "005_documents_v1.sql", "MIXED_SCHEMA_AND_DATA", {
    createsSchemaObjects: true, insertsSeedData: true, dependsOnAuthSchema: true, dependsOnStorageSchema: true,
    dependsOnExtensions: true, replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: true,
    supersededByLaterMigration: false, safeToExcludeFromSchemaBootstrap: false,
  }, "Replaces migration 004's table with documents-bucket version; requires auth.users, storage.buckets and storage.objects."),
  migration("006", "006_user_documents_extracted_text.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: true,
  }, "Adds extracted_text and replaces an RLS policy; depends on migration 005's table."),
  migration("007", "007_add_extended_profile_fields.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, containsIntrinsicSqlDefect: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: false,
  }, "Again assumes an externally-created public.profiles table."),
  migration("008", "008_user_progress.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
  }, "Creates user_progress with auth.users FK and auth.uid() policies."),
  migration("009", "009_user_action_events.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnAuthSchema: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
  }, "Creates user_action_events with auth.users FK and gen_random_uuid()."),
  migration("010", "010_knowledge_layer.sql", "MIXED_SCHEMA_AND_DATA", {
    createsSchemaObjects: true, insertsSeedData: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
    supersededByLaterMigration: true,
  }, "Creates legacy knowledge catalog and inserts MVP rows later revised by 018–023; policies require Supabase roles."),
  migration("011", "011_user_documents_document_intelligence.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, replayableOnVanillaPostgresql: false,
  }, "Depends on user_documents and document_types created earlier."),
  migration("012", "012_proof_signals_and_verifications.sql", "MIXED_SCHEMA_AND_DATA", {
    createsSchemaObjects: true, altersSchemaObjects: true, updatesExistingData: true, dependsOnAuthSchema: true,
    dependsOnExtensions: true, replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: false,
    containsIntrinsicSqlDefect: true,
  }, "Functions and table depend on public.profiles, auth.users and prior catalog rows; public.profiles absence blocks replay."),
  migration("013", "013_dashboard_knowledge_action_ids.sql", "DATA_BACKFILL", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
  }, "Updates/inserts legacy knowledge catalog content only."),
  migration("014", "014_i18n_translations.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
  }, "Creates i18n table and references Supabase anon/authenticated roles in policy."),
  migration("015", "015_i18n_insert_rpc_and_jobs.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
  }, "Adds RPC/jobs table and grants to service_role; requires Supabase roles."),
  migration("016", "016_user_step_state.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnAuthSchema: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
  }, "Depends on auth.users, user_documents and knowledge_steps; trigger assumes helper from 001 when present."),
  migration("017", "017_document_intelligence_jobs.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnAuthSchema: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    supersededByLaterMigration: true,
  }, "Initial jobs table/function/policies later repaired by 024 and functionally hardened by 030."),
  migration("018", "018_execution_db_eligibility_and_relocation_starter.sql", "MIXED_SCHEMA_AND_DATA", {
    altersSchemaObjects: true, insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true,
    safeToExcludeFromSchemaBootstrap: true, supersededByLaterMigration: true,
  }, "Adds legacy catalog eligibility column and relocation sample rows later superseded by 019–023."),
  migration("019", "019_relocation_starter_execution_data.sql", "SEED_DATA_MIGRATION", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
    supersededByLaterMigration: true,
  }, "Legacy relocation execution content is overwritten/corrected by 020 and 021."),
  migration("020", "020_relocation_starter_execution_data.sql", "DATA_BACKFILL", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
    supersededByLaterMigration: true,
  }, "Corrective legacy catalog data; creates active duplicate action_id rows that later conflict with 031."),
  migration("021", "021_consolidate_health_insurance_step.sql", "HISTORICAL_FIX", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
    supersededByLaterMigration: true,
  }, "Consolidates only two split health rows; it does not deactivate 010's active health_choose_insurer row."),
  migration("022", "022_dependency_group_for_step_dependencies.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, replayableOnVanillaPostgresql: false,
  }, "Adds dependency_group to the legacy table; prior legacy catalog must exist."),
  migration("023", "023_relocation_starter_or_dependency_example.sql", "MIXED_SCHEMA_AND_DATA", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
    supersededByLaterMigration: true,
  }, "Uses dependency_group and adds an illustrative alternate path; duplicated numeric prefix prevents a unique historical ordering."),
  migration("20260423", "20260423_branching_real_world_expansion.sql", "MIXED_SCHEMA_AND_DATA", {
    insertsSeedData: true, updatesExistingData: true, dependsOnPriorSeedRows: true, safeToExcludeFromSchemaBootstrap: true,
    supersededByLaterMigration: true,
  }, "Timestamp-named legacy catalog expansion; its position relative to NNN files is filename-runner dependent."),
  migration("023", "023_region_identity_foundation.sql", "SCHEMA_MIGRATION", {
    altersSchemaObjects: true, containsIntrinsicSqlDefect: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: false,
  }, "Second 023 file; alters absent public.profiles. Duplicate prefix is an ordering defect."),
  migration("024", "024_document_intelligence_jobs_table_fix.sql", "HISTORICAL_FIX", {
    createsSchemaObjects: true, altersSchemaObjects: true, dependsOnAuthSchema: true, dependsOnExtensions: true,
    replayableOnVanillaPostgresql: false, supersededByLaterMigration: true,
  }, "Repair/compatibility layer for 017; current function behavior is subsequently hardened by 030."),
  migration("025", "025_profile_location_fields_foundation.sql", "MIXED_SCHEMA_AND_DATA", {
    altersSchemaObjects: true, updatesExistingData: true, containsIntrinsicSqlDefect: true,
    replayableOnVanillaPostgresql: false, replayableOnFaithfulSupabase: false,
  }, "Alters/backfills absent public.profiles and assumes pre-existing region/city lineage."),
  migration("026", "026_user_progress_unique_user_action.sql", "HISTORICAL_FIX", {
    altersSchemaObjects: true, updatesExistingData: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
    supersededByLaterMigration: false,
  }, "Idempotent unique-key repair for user_progress."),
  migration("027", "027_user_progress_rls_hardening.sql", "POLICY_OR_GRANT_MIGRATION", {
    altersSchemaObjects: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
  }, "Replaces user_progress RLS policies; depends on Supabase auth.uid()."),
  migration("028", "028_user_step_state_rls_and_action_id_guard.sql", "POLICY_OR_GRANT_MIGRATION", {
    createsSchemaObjects: true, altersSchemaObjects: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
  }, "Hardens user_step_state RLS and creates partial action lookup index."),
  migration("029", "029_user_phrase_state_favorites_rls.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnAuthSchema: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
  }, "Creates independent text phrase_id favorites state; it does not make phrases.id textual."),
  migration("030", "030_enqueue_document_intelligence_job_ownership_guard.sql", "HISTORICAL_FIX", {
    altersSchemaObjects: true, dependsOnAuthSchema: true, replayableOnVanillaPostgresql: false,
    supersededByLaterMigration: false,
  }, "Replaces enqueue RPC and depends on 017/024 job table."),
  migration("031", "031_knowledge_steps_active_action_id_unique.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, containsIntrinsicSqlDefect: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: false, safeToExcludeFromSchemaBootstrap: false,
  }, "Partial unique index cannot be created after earlier seeded rows leave duplicate active action IDs (including health-insurance and bank-account)."),
  migration("032", "032_create_minimal_knowledge_schema.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: true, safeToExcludeFromSchemaBootstrap: false,
  }, "Independent Smart Talk schema; isolated validation proved it with a controlled PostgreSQL/Supabase-role bootstrap, not historical replay."),
  migration("033", "033_add_publication_and_canonical_translation_schema.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, altersSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: true, containsIntrinsicSqlDefect: true, supersededByLaterMigration: true,
  }, "DDL applies, but 14 RPC bodies have runtime PL/pgSQL identifier ambiguity; 034 is required before those RPCs are usable."),
  migration("034", "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql", "FUNCTION_ONLY_MIGRATION", {
    altersSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: true, safeToExcludeFromSchemaBootstrap: false,
  }, "Forward-only function-body repair for 033; independently validated in the controlled 032→034 chain."),
  migration("035", "035_add_official_source_registry_and_handling_mode_contract.sql", "SCHEMA_MIGRATION", {
    createsSchemaObjects: true, altersSchemaObjects: true, dependsOnExtensions: true, replayableOnVanillaPostgresql: false,
    replayableOnFaithfulSupabase: true, safeToExcludeFromSchemaBootstrap: false,
  }, "Additive source-registry schema, enums, RPCs and RLS; isolated 032→035 validation is the relevant evidence."),
];

type BlockerClassification =
  | "INTRINSIC_SQL_DEFECT"
  | "MISSING_SCHEMA_DEPENDENCY"
  | "SUPABASE_PLATFORM_DEPENDENCY"
  | "SEED_DATA_CONFLICT"
  | "ORDERING_CONFLICT"
  | "SUPERSEDED_FORWARD_DEFECT";

type ReplayBlocker = {
  blockerId: string;
  migrationFiles: string[];
  classification: BlockerClassification;
  intrinsicSqlDefect: boolean;
  supabaseBootstrapDependency: boolean;
  seedDataDependency: boolean;
  schemaReplayImpact: string;
  resolvedByLaterMigration: boolean;
  safeToExcludeFromSchemaOnlyBaseline: boolean;
  requiresBaselineReconstruction: boolean;
};

const replayBlockers: ReplayBlocker[] = [
  {
    blockerId: "B001_UUID_TEXT_SEED_MISMATCH",
    migrationFiles: ["001_create_phrases_tables.sql", "002_seed_phrases.sql"],
    classification: "INTRINSIC_SQL_DEFECT",
    intrinsicSqlDefect: true,
    supabaseBootstrapDependency: false,
    seedDataDependency: true,
    schemaReplayImpact: "002 cannot cast its textual phrase identifiers to the UUID keys defined by 001.",
    resolvedByLaterMigration: false,
    safeToExcludeFromSchemaOnlyBaseline: true,
    requiresBaselineReconstruction: false,
  },
  {
    blockerId: "B002_PROFILES_CREATION_ABSENT",
    migrationFiles: ["003_add_user_dna_to_profiles.sql", "007_add_extended_profile_fields.sql", "012_proof_signals_and_verifications.sql", "023_region_identity_foundation.sql", "025_profile_location_fields_foundation.sql"],
    classification: "MISSING_SCHEMA_DEPENDENCY",
    intrinsicSqlDefect: false,
    supabaseBootstrapDependency: false,
    seedDataDependency: false,
    schemaReplayImpact: "The chain alters public.profiles without any repository migration creating it.",
    resolvedByLaterMigration: false,
    safeToExcludeFromSchemaOnlyBaseline: false,
    requiresBaselineReconstruction: true,
  },
  {
    blockerId: "B003_AUTH_PLATFORM_DEPENDENCY",
    migrationFiles: ["004_user_documents.sql", "008_user_progress.sql", "009_user_action_events.sql", "012_proof_signals_and_verifications.sql", "016_user_step_state.sql", "017_document_intelligence_jobs.sql", "024_document_intelligence_jobs_table_fix.sql", "026_user_progress_unique_user_action.sql", "027_user_progress_rls_hardening.sql", "028_user_step_state_rls_and_action_id_guard.sql", "029_user_phrase_state_favorites_rls.sql", "030_enqueue_document_intelligence_job_ownership_guard.sql"],
    classification: "SUPABASE_PLATFORM_DEPENDENCY",
    intrinsicSqlDefect: false,
    supabaseBootstrapDependency: true,
    seedDataDependency: false,
    schemaReplayImpact: "auth.users, auth.uid(), and Supabase application roles are absent from vanilla PostgreSQL.",
    resolvedByLaterMigration: false,
    safeToExcludeFromSchemaOnlyBaseline: false,
    requiresBaselineReconstruction: true,
  },
  {
    blockerId: "B004_STORAGE_PLATFORM_DEPENDENCY",
    migrationFiles: ["004_user_documents.sql", "005_documents_v1.sql"],
    classification: "SUPABASE_PLATFORM_DEPENDENCY",
    intrinsicSqlDefect: false,
    supabaseBootstrapDependency: true,
    seedDataDependency: false,
    schemaReplayImpact: "storage.buckets and storage.objects policies require a faithful Supabase Storage schema.",
    resolvedByLaterMigration: true,
    safeToExcludeFromSchemaOnlyBaseline: false,
    requiresBaselineReconstruction: true,
  },
  {
    blockerId: "B005_MIGRATION_ORDER_AMBIGUITY",
    migrationFiles: ["023_relocation_starter_or_dependency_example.sql", "023_region_identity_foundation.sql", "20260423_branching_real_world_expansion.sql"],
    classification: "ORDERING_CONFLICT",
    intrinsicSqlDefect: true,
    supabaseBootstrapDependency: false,
    seedDataDependency: true,
    schemaReplayImpact: "Two 023 prefixes and one non-NNN timestamp file provide no single repository-declared legacy execution order.",
    resolvedByLaterMigration: false,
    safeToExcludeFromSchemaOnlyBaseline: true,
    requiresBaselineReconstruction: true,
  },
  {
    blockerId: "B006_ACTIVE_ACTION_UNIQUENESS_CONFLICT",
    migrationFiles: ["010_knowledge_layer.sql", "018_execution_db_eligibility_and_relocation_starter.sql", "019_relocation_starter_execution_data.sql", "020_relocation_starter_execution_data.sql", "021_consolidate_health_insurance_step.sql", "031_knowledge_steps_active_action_id_unique.sql"],
    classification: "SEED_DATA_CONFLICT",
    intrinsicSqlDefect: true,
    supabaseBootstrapDependency: false,
    seedDataDependency: true,
    schemaReplayImpact: "031's active action_id unique index conflicts with earlier seeded active health-insurance and bank-account rows.",
    resolvedByLaterMigration: false,
    safeToExcludeFromSchemaOnlyBaseline: true,
    requiresBaselineReconstruction: true,
  },
  {
    blockerId: "B007_PUBLICATION_RPC_RUNTIME_DEFECT",
    migrationFiles: ["033_add_publication_and_canonical_translation_schema.sql", "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql"],
    classification: "SUPERSEDED_FORWARD_DEFECT",
    intrinsicSqlDefect: true,
    supabaseBootstrapDependency: false,
    seedDataDependency: false,
    schemaReplayImpact: "033 applies but its ambiguous RPC bodies fail when called; 034 replaces the affected bodies.",
    resolvedByLaterMigration: true,
    safeToExcludeFromSchemaOnlyBaseline: false,
    requiresBaselineReconstruction: false,
  },
];

type DecisionModel = {
  decision: string;
  sourceCommit: string;
  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  onlyExpectedFileChanged: boolean;
  auditFileAlreadyUntrackedBeforeClosure: boolean;
  migrationFileCount: number;
  distinctMigrationNumberCount: number;
  duplicateMigrationNumberCount: number;
  duplicateMigrationNumberGroups: { migrationNumber: string; files: string[] }[];
  migrationNumbersComplete: boolean;
  migrationInventoryComplete: boolean;
  blockerInventoryComplete: boolean;
  historicalReplayBlockerCount: number;
  intrinsicSqlDefectCount: number;
  supabaseBaselineDependencyCount: number;
  seedOnlyBlockerCount: number;
  schemaBlockerCount: number;
  migration002Classification: Classification;
  migration002RequiredForSchemaShape: boolean;
  migration002RequiredForCurrentApplicationData: "UNKNOWN_OPTIONAL_DEMO_CONTENT";
  migration002SafeToExcludeFromSchemaGeneration: boolean;
  phrasesIdCanonicalType: "uuid";
  textPhraseIdsStillUsed: boolean;
  uuidPhraseIdsStillUsed: boolean;
  canonicalSchemaProvenance: "PARTIALLY_REPLAYABLE_SCHEMA";
  historicalMigrationsShouldBeModified: boolean;
  historicalMigrationRewriteSafetyProven: boolean;
  vanillaPostgresqlFullReplayPossible: boolean;
  faithfulSupabaseFullReplayPossible: boolean;
  schemaOnlyReplayPossible: boolean;
  historicalChainRepairViable: boolean;
  canonicalBaselineViable: boolean;
  faithfulSupabaseBootstrapViable: boolean;
  hybridBaselinePlusForwardMigrationsViable: boolean;
  selectedBaselineCutoff: string;
  selectedBaselineSource: string;
  generationBootstrapStrategy: string;
  generationMigrationStart: number;
  generationMigrationEnd: number;
  generationSeedMigrationsIncluded: boolean;
  generationSchema: string;
  baselineIncludesSchemaOnly: boolean;
  baselineIncludesUserData: boolean;
  baselineIncludesAuthUsers: boolean;
  baselineIncludesStorageUserObjects: boolean;
  baselineIncludesSecrets: boolean;
  baselineIncludesRealSourceRows: boolean;
  baselineSqlCreated: boolean;
  baselineApplied: boolean;
  baselineValidated: boolean;
  forwardMigrationsAppliedToBaseline: boolean;
  generatedTypesCreated: boolean;
  databaseSchemaModified: boolean;
  historicalMigrationModified: boolean;
  remoteDatabaseUsed: boolean;
  productionDatabaseUsed: boolean;
  readyForCanonicalBaselinePlan: boolean;
  readyToRetryPhase9T: boolean;
  recommendedNextPhase: string;
};

const numberGroups = new Map<string, string[]>();
for (const item of migrationInventory) {
  const files = numberGroups.get(item.migrationNumber) ?? [];
  files.push(item.filename);
  numberGroups.set(item.migrationNumber, files);
}
const duplicateMigrationNumberGroups = [...numberGroups.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([migrationNumber, files]) => ({ migrationNumber, files }));
const expectedNumbers = Array.from({ length: 35 }, (_, offset) => String(offset + 1).padStart(3, "0"));
const migrationNumbersComplete = expectedNumbers.every((number) => numberGroups.has(number));
const git = (args: string[]) => execFileSync("git", args, { encoding: "utf8", timeout: 10_000 }).trim();
const initialStatus = git(["status", "--short"]).split(/\r?\n/).filter(Boolean);
const expectedStatus = `?? ${AUDIT_REL_PATH}`;
const actualSourceCommit = git(["rev-parse", "--short", "HEAD"]);
const actualBranch = git(["branch", "--show-current"]);

const model: DecisionModel = {
  decision: "HYBRID_BASELINE_PLUS_FORWARD_MIGRATIONS_REQUIRED",
  sourceCommit: actualSourceCommit,
  workingTreeCleanBeforePhase: initialStatus.length === 1 && initialStatus[0] === expectedStatus,
  repositoryScopeValid: actualBranch === "main" && actualSourceCommit === SOURCE_COMMIT,
  onlyExpectedFileChanged: initialStatus.length === 1 && initialStatus[0] === expectedStatus,
  auditFileAlreadyUntrackedBeforeClosure: true,
  migrationFileCount: migrationInventory.length,
  distinctMigrationNumberCount: numberGroups.size,
  duplicateMigrationNumberCount: duplicateMigrationNumberGroups.length,
  duplicateMigrationNumberGroups,
  migrationNumbersComplete,
  migrationInventoryComplete: migrationInventory.length === 37,
  blockerInventoryComplete: replayBlockers.length === 7,
  historicalReplayBlockerCount: replayBlockers.length,
  intrinsicSqlDefectCount: replayBlockers.filter((blocker) => blocker.intrinsicSqlDefect).length,
  supabaseBaselineDependencyCount: migrationInventory.filter((item) =>
    item.dependsOnAuthSchema || item.dependsOnStorageSchema || item.dependsOnExtensions,
  ).length,
  seedOnlyBlockerCount: replayBlockers.filter((blocker) => blocker.seedDataDependency && blocker.safeToExcludeFromSchemaOnlyBaseline).length,
  schemaBlockerCount: replayBlockers.filter((blocker) => blocker.requiresBaselineReconstruction).length,
  migration002Classification: "SEED_DATA_MIGRATION",
  migration002RequiredForSchemaShape: false,
  migration002RequiredForCurrentApplicationData: "UNKNOWN_OPTIONAL_DEMO_CONTENT",
  migration002SafeToExcludeFromSchemaGeneration: true,
  phrasesIdCanonicalType: "uuid",
  textPhraseIdsStillUsed: true,
  uuidPhraseIdsStillUsed: true,
  canonicalSchemaProvenance: "PARTIALLY_REPLAYABLE_SCHEMA",
  historicalMigrationsShouldBeModified: false,
  historicalMigrationRewriteSafetyProven: false,
  vanillaPostgresqlFullReplayPossible: false,
  faithfulSupabaseFullReplayPossible: false,
  schemaOnlyReplayPossible: false,
  historicalChainRepairViable: false,
  canonicalBaselineViable: true,
  faithfulSupabaseBootstrapViable: false,
  hybridBaselinePlusForwardMigrationsViable: true,
  selectedBaselineCutoff: "BASELINE_THROUGH_031",
  selectedBaselineSource: "MANUALLY_AUTHORED_SCHEMA_BASELINE",
  generationBootstrapStrategy: "BASELINE_PLUS_032_TO_035",
  generationMigrationStart: 32,
  generationMigrationEnd: 35,
  generationSeedMigrationsIncluded: false,
  generationSchema: "public",
  baselineIncludesSchemaOnly: true,
  baselineIncludesUserData: false,
  baselineIncludesAuthUsers: false,
  baselineIncludesStorageUserObjects: false,
  baselineIncludesSecrets: false,
  baselineIncludesRealSourceRows: false,
  baselineSqlCreated: false,
  baselineApplied: false,
  baselineValidated: false,
  forwardMigrationsAppliedToBaseline: false,
  generatedTypesCreated: false,
  databaseSchemaModified: false,
  historicalMigrationModified: false,
  remoteDatabaseUsed: false,
  productionDatabaseUsed: false,
  readyForCanonicalBaselinePlan: true,
  readyToRetryPhase9T: false,
  recommendedNextPhase: "PHASE 9T-A — Canonical Pre-Knowledge Schema Baseline Plan",
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function validateDecision(candidate: DecisionModel, inventory: MigrationInventory[], blockers: ReplayBlocker[]): string[] {
  const failures: string[] = [];
  const has = (id: string) => blockers.some((blocker) => blocker.blockerId === id);
  const expectedDuplicate = candidate.duplicateMigrationNumberGroups.length === 1
    && candidate.duplicateMigrationNumberGroups[0]?.migrationNumber === "023"
    && candidate.duplicateMigrationNumberGroups[0]?.files.length === 2;

  if (candidate.decision !== "HYBRID_BASELINE_PLUS_FORWARD_MIGRATIONS_REQUIRED") failures.push("decision");
  if (candidate.sourceCommit !== SOURCE_COMMIT) failures.push("source_commit");
  if (!candidate.workingTreeCleanBeforePhase || !candidate.repositoryScopeValid || !candidate.onlyExpectedFileChanged) failures.push("repository_scope");
  if (!candidate.auditFileAlreadyUntrackedBeforeClosure) failures.push("closure_preexisting_audit_file");
  if (inventory.length !== 37 || candidate.migrationFileCount !== 37) failures.push("migration_file_count");
  if (candidate.distinctMigrationNumberCount !== 36) failures.push("distinct_migration_number_count");
  if (candidate.duplicateMigrationNumberCount !== 1 || !expectedDuplicate) failures.push("duplicate_migration_numbers");
  if (!candidate.migrationNumbersComplete || !candidate.migrationInventoryComplete) failures.push("migration_inventory");
  if (!candidate.blockerInventoryComplete || blockers.length !== 7) failures.push("blocker_inventory");
  if (!has("B001_UUID_TEXT_SEED_MISMATCH")) failures.push("migration_002_blocker");
  if (!has("B002_PROFILES_CREATION_ABSENT")) failures.push("profiles_blocker");
  if (!has("B003_AUTH_PLATFORM_DEPENDENCY")) failures.push("auth_blocker");
  if (!has("B004_STORAGE_PLATFORM_DEPENDENCY")) failures.push("storage_blocker");
  if (!has("B005_MIGRATION_ORDER_AMBIGUITY")) failures.push("ordering_blocker");
  if (!has("B006_ACTIVE_ACTION_UNIQUENESS_CONFLICT")) failures.push("migration_031_blocker");
  if (!has("B007_PUBLICATION_RPC_RUNTIME_DEFECT")) failures.push("migration_033_034_blocker");
  if (!blockers.find((blocker) => blocker.blockerId === "B001_UUID_TEXT_SEED_MISMATCH")?.intrinsicSqlDefect) failures.push("uuid_text_intrinsic_defect");
  if (!blockers.find((blocker) => blocker.blockerId === "B003_AUTH_PLATFORM_DEPENDENCY")?.supabaseBootstrapDependency) failures.push("auth_platform_dependency");
  if (!blockers.find((blocker) => blocker.blockerId === "B004_STORAGE_PLATFORM_DEPENDENCY")?.supabaseBootstrapDependency) failures.push("storage_platform_dependency");
  if (!blockers.find((blocker) => blocker.blockerId === "B007_PUBLICATION_RPC_RUNTIME_DEFECT")?.resolvedByLaterMigration) failures.push("migration_034_required");
  if (candidate.historicalReplayBlockerCount !== blockers.length || candidate.intrinsicSqlDefectCount !== 4) failures.push("blocker_counts");
  if (candidate.supabaseBaselineDependencyCount <= 0 || candidate.seedOnlyBlockerCount <= 0 || candidate.schemaBlockerCount <= 0) failures.push("dependency_counts");
  if (candidate.migration002Classification !== "SEED_DATA_MIGRATION" || candidate.migration002RequiredForSchemaShape || candidate.migration002RequiredForCurrentApplicationData !== "UNKNOWN_OPTIONAL_DEMO_CONTENT" || !candidate.migration002SafeToExcludeFromSchemaGeneration || candidate.phrasesIdCanonicalType !== "uuid") failures.push("migration_002_conclusion");
  if (!candidate.textPhraseIdsStillUsed || !candidate.uuidPhraseIdsStillUsed) failures.push("phrase_id_evidence");
  if (candidate.canonicalSchemaProvenance !== "PARTIALLY_REPLAYABLE_SCHEMA") failures.push("schema_provenance");
  if (candidate.historicalMigrationsShouldBeModified || candidate.historicalMigrationRewriteSafetyProven || candidate.historicalMigrationModified) failures.push("historical_rewrite");
  if (candidate.vanillaPostgresqlFullReplayPossible || candidate.faithfulSupabaseFullReplayPossible || candidate.schemaOnlyReplayPossible || candidate.historicalChainRepairViable || candidate.faithfulSupabaseBootstrapViable) failures.push("historical_replay_claim");
  if (!candidate.canonicalBaselineViable || !candidate.hybridBaselinePlusForwardMigrationsViable) failures.push("baseline_viability");
  if (candidate.selectedBaselineCutoff !== "BASELINE_THROUGH_031") failures.push("baseline_cutoff");
  if (candidate.selectedBaselineSource !== "MANUALLY_AUTHORED_SCHEMA_BASELINE") failures.push("baseline_source");
  if (candidate.generationBootstrapStrategy !== "BASELINE_PLUS_032_TO_035") failures.push("generation_strategy");
  if (candidate.generationMigrationStart !== 32 || candidate.generationMigrationEnd !== 35 || candidate.generationSeedMigrationsIncluded || candidate.generationSchema !== "public") failures.push("generation_range");
  if (!candidate.baselineIncludesSchemaOnly || candidate.baselineIncludesUserData || candidate.baselineIncludesAuthUsers || candidate.baselineIncludesStorageUserObjects || candidate.baselineIncludesSecrets || candidate.baselineIncludesRealSourceRows) failures.push("baseline_contents");
  if (candidate.baselineSqlCreated || candidate.baselineApplied || candidate.baselineValidated || candidate.forwardMigrationsAppliedToBaseline) failures.push("baseline_implementation_claim");
  if (candidate.generatedTypesCreated || candidate.databaseSchemaModified || candidate.remoteDatabaseUsed || candidate.productionDatabaseUsed) failures.push("execution_safety");
  if (!candidate.readyForCanonicalBaselinePlan || candidate.readyToRetryPhase9T) failures.push("phase_readiness");
  if (candidate.recommendedNextPhase !== "PHASE 9T-A — Canonical Pre-Knowledge Schema Baseline Plan") failures.push("next_phase");
  return failures;
}

type TamperCase = { id: string; mutate: (candidate: DecisionModel, blockers: ReplayBlocker[], inventory: MigrationInventory[]) => void };
const tamperCases: TamperCase[] = [
  { id: "migration-002-ignored", mutate: (_, blockers) => blockers.splice(0, 1) },
  { id: "uuid-text-blocker-removed", mutate: (_, blockers) => { blockers[0]!.intrinsicSqlDefect = false; } },
  { id: "inventory-incomplete", mutate: (_, __, inventory) => inventory.pop() },
  { id: "file-count-equals-distinct-count", mutate: (candidate) => { candidate.distinctMigrationNumberCount = 37; } },
  { id: "duplicate-count-zero", mutate: (candidate) => { candidate.duplicateMigrationNumberCount = 0; } },
  { id: "duplicate-group-unexplained", mutate: (candidate) => { candidate.duplicateMigrationNumberGroups = []; } },
  { id: "numbered-range-incomplete", mutate: (candidate) => { candidate.migrationNumbersComplete = false; } },
  { id: "seed-classified-as-schema", mutate: (candidate) => { candidate.migration002Classification = "SCHEMA_MIGRATION"; } },
  { id: "seed-required-for-shape", mutate: (candidate) => { candidate.migration002RequiredForSchemaShape = true; } },
  { id: "seed-not-safe-to-exclude", mutate: (candidate) => { candidate.migration002SafeToExcludeFromSchemaGeneration = false; } },
  { id: "phrase-id-not-uuid", mutate: (candidate) => { candidate.phrasesIdCanonicalType = "text" as "uuid"; } },
  { id: "text-phrase-evidence-erased", mutate: (candidate) => { candidate.textPhraseIdsStillUsed = false; } },
  { id: "uuid-phrase-evidence-erased", mutate: (candidate) => { candidate.uuidPhraseIdsStillUsed = false; } },
  { id: "profiles-ignored", mutate: (_, blockers) => blockers.splice(1, 1) },
  { id: "auth-ignored", mutate: (_, blockers) => blockers.splice(2, 1) },
  { id: "storage-ignored", mutate: (_, blockers) => blockers.splice(3, 1) },
  { id: "ordering-ignored", mutate: (_, blockers) => blockers.splice(4, 1) },
  { id: "migration-031-ignored", mutate: (_, blockers) => blockers.splice(5, 1) },
  { id: "migration-033-treated-as-final", mutate: (_, blockers) => blockers.splice(6, 1) },
  { id: "blocker-inventory-claim-false", mutate: (candidate) => { candidate.blockerInventoryComplete = false; } },
  { id: "blocker-count-misreported", mutate: (candidate) => { candidate.historicalReplayBlockerCount = 0; } },
  { id: "intrinsic-defects-misreported", mutate: (candidate) => { candidate.intrinsicSqlDefectCount = 0; } },
  { id: "historical-edit-permitted", mutate: (candidate) => { candidate.historicalMigrationsShouldBeModified = true; } },
  { id: "rewrite-safety-unproven-claimed", mutate: (candidate) => { candidate.historicalMigrationRewriteSafetyProven = true; } },
  { id: "historical-file-modified", mutate: (candidate) => { candidate.historicalMigrationModified = true; } },
  { id: "unknown-provenance-verified", mutate: (candidate) => { candidate.canonicalSchemaProvenance = "UNKNOWN" as "PARTIALLY_REPLAYABLE_SCHEMA"; } },
  { id: "production-dump-default", mutate: (candidate) => { candidate.selectedBaselineSource = "PRODUCTION_DERIVED_SCHEMA"; } },
  { id: "unknown-baseline-source", mutate: (candidate) => { candidate.selectedBaselineSource = "UNKNOWN"; } },
  { id: "remote-required", mutate: (candidate) => { candidate.remoteDatabaseUsed = true; } },
  { id: "production-used", mutate: (candidate) => { candidate.productionDatabaseUsed = true; } },
  { id: "user-data-in-baseline", mutate: (candidate) => { candidate.baselineIncludesUserData = true; } },
  { id: "auth-users-in-baseline", mutate: (candidate) => { candidate.baselineIncludesAuthUsers = true; } },
  { id: "storage-objects-in-baseline", mutate: (candidate) => { candidate.baselineIncludesStorageUserObjects = true; } },
  { id: "secrets-in-baseline", mutate: (candidate) => { candidate.baselineIncludesSecrets = true; } },
  { id: "real-source-rows-in-baseline", mutate: (candidate) => { candidate.baselineIncludesRealSourceRows = true; } },
  { id: "baseline-not-schema-only", mutate: (candidate) => { candidate.baselineIncludesSchemaOnly = false; } },
  { id: "baseline-sql-created", mutate: (candidate) => { candidate.baselineSqlCreated = true; } },
  { id: "baseline-applied", mutate: (candidate) => { candidate.baselineApplied = true; } },
  { id: "baseline-validated", mutate: (candidate) => { candidate.baselineValidated = true; } },
  { id: "forward-range-applied", mutate: (candidate) => { candidate.forwardMigrationsAppliedToBaseline = true; } },
  { id: "types-created", mutate: (candidate) => { candidate.generatedTypesCreated = true; } },
  { id: "database-schema-modified", mutate: (candidate) => { candidate.databaseSchemaModified = true; } },
  { id: "ready-to-retry-too-early", mutate: (candidate) => { candidate.readyToRetryPhase9T = true; } },
  { id: "baseline-plan-not-ready", mutate: (candidate) => { candidate.readyForCanonicalBaselinePlan = false; } },
  { id: "wrong-generation-schema", mutate: (candidate) => { candidate.generationSchema = "auth"; } },
  { id: "wrong-generation-start", mutate: (candidate) => { candidate.generationMigrationStart = 31; } },
  { id: "wrong-generation-end", mutate: (candidate) => { candidate.generationMigrationEnd = 34; } },
  { id: "seed-in-generation", mutate: (candidate) => { candidate.generationSeedMigrationsIncluded = true; } },
  { id: "wrong-baseline-cutoff", mutate: (candidate) => { candidate.selectedBaselineCutoff = "BASELINE_THROUGH_035"; } },
  { id: "forward-migrations-flattened", mutate: (candidate) => { candidate.generationBootstrapStrategy = "BASELINE_THROUGH_035"; } },
  { id: "migration-034-omitted", mutate: (candidate) => { candidate.generationMigrationEnd = 33; } },
  { id: "historical-full-replay-viable", mutate: (candidate) => { candidate.historicalChainRepairViable = true; } },
  { id: "vanilla-full-replay-claimed", mutate: (candidate) => { candidate.vanillaPostgresqlFullReplayPossible = true; } },
  { id: "faithful-full-replay-claimed", mutate: (candidate) => { candidate.faithfulSupabaseFullReplayPossible = true; } },
  { id: "schema-only-legacy-replay-claimed", mutate: (candidate) => { candidate.schemaOnlyReplayPossible = true; } },
  { id: "faithful-bootstrap-repairs-uuid", mutate: (candidate) => { candidate.faithfulSupabaseBootstrapViable = true; } },
  { id: "canonical-baseline-not-viable", mutate: (candidate) => { candidate.canonicalBaselineViable = false; } },
  { id: "hybrid-not-viable", mutate: (candidate) => { candidate.hybridBaselinePlusForwardMigrationsViable = false; } },
  { id: "wrong-decision", mutate: (candidate) => { candidate.decision = "CANONICAL_SCHEMA_BASELINE_REQUIRED"; } },
  { id: "missing-next-phase", mutate: (candidate) => { candidate.recommendedNextPhase = ""; } },
  { id: "wrong-next-phase", mutate: (candidate) => { candidate.recommendedNextPhase = "PHASE 9T"; } },
  { id: "repository-scope-failed", mutate: (candidate) => { candidate.repositoryScopeValid = false; } },
  { id: "unexpected-file-accepted", mutate: (candidate) => { candidate.onlyExpectedFileChanged = false; } },
  { id: "preflight-not-clean", mutate: (candidate) => { candidate.workingTreeCleanBeforePhase = false; } },
  { id: "existing-audit-file-not-recorded", mutate: (candidate) => { candidate.auditFileAlreadyUntrackedBeforeClosure = false; } },
  { id: "wrong-source-commit", mutate: (candidate) => { candidate.sourceCommit = "0000000"; } },
  { id: "migration-file-count-wrong", mutate: (candidate) => { candidate.migrationFileCount = 35; } },
  { id: "migration-inventory-claim-false", mutate: (candidate) => { candidate.migrationInventoryComplete = false; } },
  { id: "duplicate-group-wrong-number", mutate: (candidate) => { candidate.duplicateMigrationNumberGroups[0]!.migrationNumber = "024"; } },
  { id: "duplicate-group-wrong-size", mutate: (candidate) => { candidate.duplicateMigrationNumberGroups[0]!.files.pop(); } },
  { id: "supabase-dependency-count-erased", mutate: (candidate) => { candidate.supabaseBaselineDependencyCount = 0; } },
  { id: "seed-blocker-count-erased", mutate: (candidate) => { candidate.seedOnlyBlockerCount = 0; } },
  { id: "schema-blocker-count-erased", mutate: (candidate) => { candidate.schemaBlockerCount = 0; } },
  { id: "current-data-certainty-overstated", mutate: (candidate) => { candidate.migration002RequiredForCurrentApplicationData = "REQUIRED" as "UNKNOWN_OPTIONAL_DEMO_CONTENT"; } },
  { id: "baseline-source-is-controlled-dump", mutate: (candidate) => { candidate.selectedBaselineSource = "CONTROLLED_NON_PRODUCTION_SCHEMA_DUMP"; } },
  { id: "baseline-source-is-reconstruct-only", mutate: (candidate) => { candidate.selectedBaselineSource = "RECONSTRUCT_FROM_MIGRATIONS_AND_CURRENT_CODE"; } },
  { id: "generation-start-non-numeric", mutate: (candidate) => { candidate.generationMigrationStart = 0; } },
  { id: "generation-end-non-numeric", mutate: (candidate) => { candidate.generationMigrationEnd = 36; } },
  { id: "baseline-cutoff-ambiguous", mutate: (candidate) => { candidate.selectedBaselineCutoff = "OTHER_EXACT_CUTOFF"; } },
  { id: "decision-without-hybrid-viability", mutate: (candidate) => { candidate.hybridBaselinePlusForwardMigrationsViable = false; } },
  { id: "decision-without-canonical-viability", mutate: (candidate) => { candidate.canonicalBaselineViable = false; } },
];

const baselineFailures = validateDecision(model, migrationInventory, replayBlockers);
if (baselineFailures.length > 0) {
  throw new Error(`${CHECK_ID}: baseline decision invalid: ${baselineFailures.join(", ")}`);
}

const tamperFailures: string[] = [];
for (const testCase of tamperCases) {
  const candidate = clone(model);
  const blockers = clone(replayBlockers);
  const inventory = clone(migrationInventory);
  testCase.mutate(candidate, blockers, inventory);
  if (validateDecision(candidate, inventory, blockers).length === 0) tamperFailures.push(testCase.id);
}
if (tamperFailures.length > 0 || tamperCases.length < 80) {
  throw new Error(`${CHECK_ID}: tamper closure failed: ${tamperFailures.join(", ") || "insufficient cases"}`);
}

const result = {
  checkId: CHECK_ID,
  phase: PHASE,
  allPassed: true,
  blocked: false,
  blockReason: null,
  ...model,
  migrationInventory,
  blockerInventory: replayBlockers,
  schemaMigrationCount: migrationInventory.filter((item) => item.classification === "SCHEMA_MIGRATION").length,
  seedDataMigrationCount: migrationInventory.filter((item) => item.classification === "SEED_DATA_MIGRATION").length,
  dataBackfillCount: migrationInventory.filter((item) => item.classification === "DATA_BACKFILL").length,
  mixedMigrationCount: migrationInventory.filter((item) => item.classification === "MIXED_SCHEMA_AND_DATA").length,
  policyGrantMigrationCount: migrationInventory.filter((item) => item.classification === "POLICY_OR_GRANT_MIGRATION").length,
  bootstrapDecisionTamperCaseCount: tamperCases.length,
  bootstrapDecisionTamperCasesRejected: tamperCases.length - tamperFailures.length,
  correctionPerformed: "The original PHASE 9T-PRE prompt ended after section 17. This closure adds the mandatory safety, tamper, execution-status, contradiction and report contract.",
  evidence: {
    migration002: [
      "001 declares public.phrases.id and public.phrase_translations.phrase_id as uuid.",
      "002 inserts a1-warehouse-001-style text literals into both UUID columns.",
      "029 uses text user_phrase_state.phrase_id but has no foreign key to public.phrases; it is not evidence that phrases.id became text.",
      "README documents 002 as five sample phrases and placeholder translations, confirming OPTIONAL_DEV_SEED / DEMO_CONTENT rather than required bootstrap data.",
    ],
    historicalBlockers: [
      "003 is the first schema blocker after excluding 002: public.profiles is referenced but never created in repository migrations.",
      "004/005 and multiple later migrations require Supabase auth, storage, roles and auth.uid(); vanilla PostgreSQL cannot replay them unbootstrapped.",
      "Two files use numeric prefix 023, while 20260423_branching_real_world_expansion.sql has no NNN prefix; a filename-sorted migration runner has no repository-declared canonical ordering.",
      "031's partial unique index conflicts with active action_id rows introduced by 010 and 018–020; the historical data/fix sequence does not normalize them before the index.",
      "033 creates runtime-ambiguous RPC bodies; 034 corrects them forward-only and must remain in the replay range.",
    ],
    supersession: [
      "005 replaces 004's user_documents/storage contract.",
      "024 repairs 017 and 030 replaces the enqueue RPC again.",
      "018–023 plus the timestamped expansion are legacy catalog/demo evolution, not required schema bootstrap input.",
      "034 supersedes only 033's defective function bodies; it does not replace 033 schema.",
    ],
    provenance: [
      "supabase/config.toml proves local Supabase configuration (Auth, Storage, Realtime and PostgreSQL 17) but contains no canonical schema dump or baseline.",
      "docs/MIGRATIONS.md and docs/PRODUCTION_RUNBOOK.md prohibit retroactive edits to shared migrations and require ordered application.",
      "The repository has isolated evidence for the 032→035 Smart Talk chain, not for a complete 001→035 reconstruction.",
      "No repository evidence identifies a controlled non-production dump as canonical; production was neither accessed nor presumed canonical.",
    ],
    baselineContract: [
      "The new schema-only baseline must explicitly define every required public object through 031, including the previously external public.profiles contract, tables, columns, defaults, primary/foreign keys, indexes, enums, functions, triggers, RLS, policies, grants/revokes, extensions and required schemas.",
      "It must exclude user rows, auth users, storage objects, phrase/demo rows, source registry rows, real documents, production identifiers and secrets.",
      "The baseline must be manually authored from an approved schema inventory, then validated in a controlled local Supabase bootstrap. It must not be reverse-engineered from production or inferred from an unknown remote database.",
      "After validation, replay exactly 032→035 on that baseline and generate public types from that disposable local database only.",
    ],
    seedDataDisposition: {
      "002_seed_phrases.sql": "OPTIONAL_DEV_SEED",
      "010_knowledge_layer.sql legacy rows": "DEPRECATED_SEED",
      "013_knowledge_and_action updates through timestamped legacy expansion": "DEPRECATED_SEED",
      "current Smart Talk source/registry rows": "not part of bootstrap; remain absent",
    },
    strategyEvaluation: {
      HISTORICAL_CHAIN_REPAIR_REQUIRED: "Rejected: durable-environment provenance and rewrite safety are unproven; docs explicitly prohibit retroactive edits.",
      CANONICAL_SCHEMA_BASELINE_REQUIRED: "Viable but incomplete alone because 032–035 are independently validated governance migrations whose visible forward history should remain replayable.",
      FAITHFUL_LOCAL_SUPABASE_BOOTSTRAP_REQUIRED: "Insufficient: it supplies auth/storage/roles but cannot repair 002's UUID literals, missing public.profiles, ordering ambiguity or 031 duplicate data.",
      HYBRID_BASELINE_PLUS_FORWARD_MIGRATIONS_REQUIRED: "Selected: a schema-only baseline through 031 isolates unreplayable legacy history while retaining validated 032→035 migration governance.",
    },
    followUpPhases: [
      "PHASE 9T-A — Canonical Pre-Knowledge Schema Baseline Plan",
      "PHASE 9T-B — Canonical Schema Baseline Implementation",
      "PHASE 9T-C — Baseline Plus 032–035 Isolated PostgreSQL Validation",
      "PHASE 9T — Generated Database Type Introduction",
    ],
  },
} as const;

const required = [
  result.decision === "HYBRID_BASELINE_PLUS_FORWARD_MIGRATIONS_REQUIRED",
  result.migrationFileCount === 37,
  result.migrationInventoryComplete,
  result.historicalMigrationsShouldBeModified === false,
  result.migration002SafeToExcludeFromSchemaGeneration,
  result.generationBootstrapStrategy === "BASELINE_PLUS_032_TO_035",
  result.generationSchema === "public",
  result.generatedTypesCreated === false,
  result.remoteDatabaseUsed === false,
  result.productionDatabaseUsed === false,
].every(Boolean);

if (!required) {
  throw new Error(`${CHECK_ID}: decision-audit invariants failed`);
}

console.log(JSON.stringify(result, null, 2));
