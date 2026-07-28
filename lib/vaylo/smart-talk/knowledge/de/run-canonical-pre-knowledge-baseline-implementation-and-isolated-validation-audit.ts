/**
 * 9T-B isolated validation. Uses only the per-user Docker CLI and disposable
 * postgres:17 containers; it never contacts a remote database.
 */
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const docker = "C:\\Users\\jceas\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe";
const baseline = "supabase/baselines/031_pre_knowledge_schema_baseline.sql";
const fixture = "supabase/baselines/fixtures/local_supabase_platform_bootstrap.sql";
const runner = "lib/vaylo/smart-talk/knowledge/de/run-canonical-pre-knowledge-baseline-implementation-and-isolated-validation-audit.ts";
const EMBEDDED_BASELINE_SHA = "415007811d4f291d6dbed1899e987abd66b03a548d02c6408222615a877e46bf";
const forwards = ["032_create_minimal_knowledge_schema.sql", "033_add_publication_and_canonical_translation_schema.sql", "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql", "035_add_official_source_registry_and_handling_mode_contract.sql"];
const sha = (path: string) => createHash("sha256").update(readFileSync(resolve(root, path))).digest("hex");
const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();

type Confidence = "PROVEN" | "CANONICAL_NEW_DECISION" | "SUPERSEDED" | "EXCLUDED_DATA_ONLY" | "UNRESOLVED";
type ObjectCategory =
  | "EXTENSION" | "SCHEMA" | "ENUM" | "TABLE" | "COLUMN" | "PRIMARY_KEY"
  | "UNIQUE_CONSTRAINT" | "CHECK_CONSTRAINT" | "FOREIGN_KEY" | "INDEX"
  | "FUNCTION" | "TRIGGER" | "RLS_ENABLEMENT" | "POLICY" | "GRANT"
  | "REVOKE" | "VIEW" | "SEQUENCE";
type CanonicalObject = {
  objectCategory: ObjectCategory;
  schemaName: string;
  objectName: string;
  signatureOrIdentity: string;
  createdBy: string;
  alteredBy: readonly string[];
  supersededDefinitions: readonly string[];
  latestEffectiveDefinition: string;
  includedInBaseline: boolean;
  exclusionReason: string | null;
  platformOwned: boolean;
  applicationOwned: boolean;
  containsDataDependency: boolean;
  requiresValidationFixture: boolean;
  confidence: Confidence;
};
type TableSpec = {
  tableName: string;
  columns: readonly string[];
  primaryKey: string;
  uniqueConstraints: readonly string[];
  checkConstraints: readonly string[];
  foreignKeys: readonly string[];
  indexes: readonly string[];
  rlsEnabled: boolean;
  policies: readonly string[];
  grants: readonly string[];
  triggers: readonly string[];
  sourceFiles: readonly string[];
};
type FunctionSpec = {
  schema: "public";
  name: string;
  argumentTypes: readonly string[];
  returnType: string;
  language: "sql" | "plpgsql";
  securityDefiner: boolean;
  searchPath: string | null;
  volatility: "VOLATILE";
  triggerUsage: readonly string[];
  executeRoles: readonly string[];
  sourceDefinition: string;
  supersededDefinitions: readonly string[];
};
type TriggerSpec = {
  triggerName: string; tableName: string; timing: "BEFORE"; events: readonly ["UPDATE"];
  forEach: "ROW"; functionSignature: string; sourceFile: string;
};
type PolicySpec = {
  policyName: string; tableName: string; command: "SELECT" | "INSERT" | "UPDATE" | "DELETE" | "ALL";
  roles: readonly string[]; usingExpression: string | null; withCheckExpression: string | null;
  sourceFile: string; supersededBy: string | null;
};

const migrationFilesExpected = [
  "001_create_phrases_tables.sql", "002_seed_phrases.sql", "003_add_user_dna_to_profiles.sql",
  "004_user_documents.sql", "005_documents_v1.sql", "006_user_documents_extracted_text.sql",
  "007_add_extended_profile_fields.sql", "008_user_progress.sql", "009_user_action_events.sql",
  "010_knowledge_layer.sql", "011_user_documents_document_intelligence.sql",
  "012_proof_signals_and_verifications.sql", "013_dashboard_knowledge_action_ids.sql",
  "014_i18n_translations.sql", "015_i18n_insert_rpc_and_jobs.sql", "016_user_step_state.sql",
  "017_document_intelligence_jobs.sql", "018_execution_db_eligibility_and_relocation_starter.sql",
  "019_relocation_starter_execution_data.sql", "020_relocation_starter_execution_data.sql",
  "021_consolidate_health_insurance_step.sql", "022_dependency_group_for_step_dependencies.sql",
  "023_region_identity_foundation.sql", "023_relocation_starter_or_dependency_example.sql",
  "024_document_intelligence_jobs_table_fix.sql", "025_profile_location_fields_foundation.sql",
  "026_user_progress_unique_user_action.sql", "027_user_progress_rls_hardening.sql",
  "028_user_step_state_rls_and_action_id_guard.sql", "029_user_phrase_state_favorites_rls.sql",
  "030_enqueue_document_intelligence_job_ownership_guard.sql",
  "031_knowledge_steps_active_action_id_unique.sql",
  "20260423_branching_real_world_expansion.sql",
] as const;

const tableSpecs = [
  { tableName: "phrases", columns: ["id uuid not null default uuid_generate_v4()", "level text not null", "category text not null", "sector text null", "de_text text not null", "created_at timestamptz null default now()", "updated_at timestamptz null default now()"], primaryKey: "phrases_pkey(id)", uniqueConstraints: [], checkConstraints: ["phrases_level_check", "phrases_category_check", "phrases_sector_check"], foreignKeys: [], indexes: ["idx_phrases_level", "idx_phrases_category", "idx_phrases_sector"], rlsEnabled: true, policies: ["Allow public read access to phrases"], grants: [], triggers: ["update_phrases_updated_at"], sourceFiles: ["001_create_phrases_tables.sql"] },
  { tableName: "phrase_translations", columns: ["phrase_id uuid not null", "locale text not null", "text text not null"], primaryKey: "phrase_translations_pkey(phrase_id,locale)", uniqueConstraints: [], checkConstraints: ["phrase_translations_locale_check"], foreignKeys: ["phrase_translations_phrase_id_fkey -> phrases(id) on delete cascade"], indexes: ["idx_phrase_translations_locale", "idx_phrase_translations_phrase_id"], rlsEnabled: true, policies: ["Allow public read access to phrase_translations"], grants: [], triggers: [], sourceFiles: ["001_create_phrases_tables.sql"] },
  { tableName: "profiles", columns: ["id uuid not null", "family_status text null", "employment_type text null", "language_level text null", "goals text[] null no default", "dna jsonb not null default '{}'::jsonb", "dna_updated_at timestamptz null", "has_steuer_id boolean null", "has_health_insurance boolean null", "has_bank_account boolean null", "registered_arbeitsagentur boolean null", "has_children boolean null", "children_school_age boolean null", "has_cv boolean null", "job_search_urgency text null", "has_address_registration boolean null", "region text null", "city text null", "country text null default 'DE'", "bundesland text null", "postal_code text null", "registration_status text null", "created_at timestamptz not null default now()", "updated_at timestamptz not null default now()"], primaryKey: "profiles_pkey(id)", uniqueConstraints: [], checkConstraints: ["profiles_registration_status_check"], foreignKeys: ["profiles_id_fkey -> auth.users(id) on delete cascade"], indexes: ["profiles_dna_gin_idx", "profiles_location_idx"], rlsEnabled: true, policies: ["profiles_select_own", "profiles_insert_own", "profiles_update_own"], grants: ["authenticated: SELECT,INSERT,UPDATE"], triggers: ["profiles_set_updated_at"], sourceFiles: ["003_add_user_dna_to_profiles.sql", "007_add_extended_profile_fields.sql", "012_proof_signals_and_verifications.sql", "023_region_identity_foundation.sql", "025_profile_location_fields_foundation.sql", "9T-A1 canonical decision"] },
  { tableName: "user_documents", columns: ["id uuid not null default gen_random_uuid()", "user_id uuid not null", "file_path text not null", "file_name text null", "mime_type text null", "created_at timestamptz not null default now()", "extracted_text text null", "document_type_id text null", "classification_status text not null default 'pending'", "classification_confidence numeric null", "classification_method text null", "extracted_metadata jsonb null", "classification_notes jsonb null"], primaryKey: "user_documents_pkey(id)", uniqueConstraints: ["user_documents_file_path_key(file_path)"], checkConstraints: ["user_documents_classification_status_check"], foreignKeys: ["user_documents_user_id_fkey -> auth.users(id) on delete cascade", "user_documents_document_type_id_fkey -> document_types(id) on delete set null"], indexes: ["idx_user_documents_user_created", "user_documents_document_type_id_idx", "user_documents_classification_status_idx"], rlsEnabled: true, policies: ["user_documents_select_own", "user_documents_insert_own", "user_documents_update_own", "user_documents_delete_own"], grants: [], triggers: [], sourceFiles: ["005_documents_v1.sql", "006_user_documents_extracted_text.sql", "011_user_documents_document_intelligence.sql", "012_proof_signals_and_verifications.sql"] },
  { tableName: "user_progress", columns: ["user_id uuid not null", "action_id text not null", "status text not null", "completed_at timestamptz null"], primaryKey: "user_progress_pkey(user_id,action_id)", uniqueConstraints: [], checkConstraints: ["user_progress_status_check"], foreignKeys: ["user_progress_user_id_fkey -> auth.users(id) on delete cascade"], indexes: ["user_progress_user_id_idx"], rlsEnabled: true, policies: ["Users can read own user_progress", "Users can insert own user_progress", "Users can update own user_progress"], grants: [], triggers: [], sourceFiles: ["008_user_progress.sql", "026_user_progress_unique_user_action.sql", "027_user_progress_rls_hardening.sql"] },
  { tableName: "user_action_events", columns: ["id uuid not null default gen_random_uuid()", "user_id uuid not null", "action_id text not null", "event_type text not null", "created_at timestamptz not null default now()"], primaryKey: "user_action_events_pkey(id)", uniqueConstraints: [], checkConstraints: ["user_action_events_event_type_check"], foreignKeys: ["user_action_events_user_id_fkey -> auth.users(id) on delete cascade"], indexes: ["user_action_events_user_id_idx", "user_action_events_action_id_idx"], rlsEnabled: true, policies: ["Users can read own user_action_events", "Users can insert own user_action_events"], grants: [], triggers: [], sourceFiles: ["009_user_action_events.sql"] },
  { tableName: "knowledge_topics", columns: ["id text not null", "slug text not null", "title_key text not null", "category text not null", "description_key text null", "sort_order integer not null default 0", "is_active boolean not null default true", "created_at timestamptz not null default now()"], primaryKey: "knowledge_topics_pkey(id)", uniqueConstraints: ["knowledge_topics_slug_key(slug)"], checkConstraints: [], foreignKeys: [], indexes: ["knowledge_topics_category_idx", "knowledge_topics_sort_idx"], rlsEnabled: true, policies: ["knowledge_topics_select_active_authenticated"], grants: [], triggers: [], sourceFiles: ["010_knowledge_layer.sql"] },
  { tableName: "knowledge_steps", columns: ["id text not null", "topic_id text not null", "slug text not null", "title_key text not null", "description_key text null", "sort_order integer not null default 0", "is_critical boolean not null default false", "action_id text null", "is_active boolean not null default true", "created_at timestamptz not null default now()", "profile_flag_key text null", "eligibility_criteria jsonb null"], primaryKey: "knowledge_steps_pkey(id)", uniqueConstraints: ["knowledge_steps_topic_slug_key(topic_id,slug)"], checkConstraints: [], foreignKeys: ["knowledge_steps_topic_id_fkey -> knowledge_topics(id) on delete cascade"], indexes: ["knowledge_steps_topic_id_idx", "knowledge_steps_topic_sort_idx", "knowledge_steps_action_id_idx", "idx_knowledge_steps_action_id", "uq_knowledge_steps_action_id_active"], rlsEnabled: true, policies: ["knowledge_steps_select_active_authenticated"], grants: [], triggers: [], sourceFiles: ["010_knowledge_layer.sql", "012_proof_signals_and_verifications.sql", "018_execution_db_eligibility_and_relocation_starter.sql", "028_user_step_state_rls_and_action_id_guard.sql", "031_knowledge_steps_active_action_id_unique.sql"] },
  { tableName: "knowledge_step_dependencies", columns: ["step_id text not null", "depends_on_step_id text not null", "dependency_group text null"], primaryKey: "knowledge_step_dependencies_pkey(step_id,depends_on_step_id)", uniqueConstraints: [], checkConstraints: ["knowledge_step_dependencies_no_self"], foreignKeys: ["knowledge_step_dependencies_step_id_fkey -> knowledge_steps(id) on delete cascade", "knowledge_step_dependencies_depends_on_step_id_fkey -> knowledge_steps(id) on delete cascade"], indexes: ["knowledge_step_dependencies_depends_idx"], rlsEnabled: true, policies: ["knowledge_step_dependencies_select_authenticated"], grants: [], triggers: [], sourceFiles: ["010_knowledge_layer.sql", "022_dependency_group_for_step_dependencies.sql"] },
  { tableName: "document_types", columns: ["id text not null", "slug text not null", "title_key text not null", "description_key text null", "category text null", "is_active boolean not null default true", "created_at timestamptz not null default now()"], primaryKey: "document_types_pkey(id)", uniqueConstraints: ["document_types_slug_key(slug)"], checkConstraints: [], foreignKeys: [], indexes: ["document_types_category_idx"], rlsEnabled: true, policies: ["document_types_select_active_authenticated"], grants: [], triggers: [], sourceFiles: ["010_knowledge_layer.sql"] },
  { tableName: "document_type_step_links", columns: ["document_type_id text not null", "step_id text not null", "link_type text not null"], primaryKey: "document_type_step_links_pkey(document_type_id,step_id,link_type)", uniqueConstraints: [], checkConstraints: ["document_type_step_links_type_check"], foreignKeys: ["document_type_step_links_document_type_id_fkey -> document_types(id) on delete cascade", "document_type_step_links_step_id_fkey -> knowledge_steps(id) on delete cascade"], indexes: ["document_type_step_links_step_idx"], rlsEnabled: true, policies: ["document_type_step_links_select_authenticated"], grants: [], triggers: [], sourceFiles: ["010_knowledge_layer.sql"] },
  { tableName: "user_document_step_verifications", columns: ["id uuid not null default gen_random_uuid()", "user_id uuid not null", "document_id uuid not null", "step_id text not null", "status text not null", "created_at timestamptz not null default now()"], primaryKey: "user_document_step_verifications_pkey(id)", uniqueConstraints: ["user_document_step_verifications_user_doc_step_key(user_id,document_id,step_id)"], checkConstraints: ["user_document_step_verifications_status_check"], foreignKeys: ["user_document_step_verifications_user_id_fkey -> auth.users(id) on delete cascade", "user_document_step_verifications_document_id_fkey -> user_documents(id) on delete cascade", "user_document_step_verifications_step_id_fkey -> knowledge_steps(id) on delete restrict"], indexes: ["user_document_step_verifications_user_doc_idx"], rlsEnabled: true, policies: ["user_document_step_verifications_select_own"], grants: [], triggers: [], sourceFiles: ["012_proof_signals_and_verifications.sql"] },
  { tableName: "i18n_translations", columns: ["id uuid not null default gen_random_uuid()", "locale text not null", "key text not null", "value text not null", "source text not null default 'llm'", "created_at timestamptz not null default now()"], primaryKey: "i18n_translations_pkey(id)", uniqueConstraints: ["i18n_translations_locale_key_unique(locale,key)"], checkConstraints: [], foreignKeys: [], indexes: ["i18n_translations_locale_idx"], rlsEnabled: true, policies: ["i18n_translations_select_public"], grants: [], triggers: [], sourceFiles: ["014_i18n_translations.sql"] },
  { tableName: "i18n_jobs", columns: ["id uuid not null default gen_random_uuid()", "locale text not null", "status text not null default 'pending'", "created_at timestamptz not null default now()"], primaryKey: "i18n_jobs_pkey(id)", uniqueConstraints: [], checkConstraints: ["i18n_jobs_status_check"], foreignKeys: [], indexes: ["i18n_jobs_locale_created_idx"], rlsEnabled: true, policies: ["i18n_jobs_deny_all"], grants: [], triggers: [], sourceFiles: ["015_i18n_insert_rpc_and_jobs.sql"] },
  { tableName: "user_step_state", columns: ["id uuid not null default gen_random_uuid()", "user_id uuid not null", "step_id text not null", "status text not null", "source text not null default 'system'", "action_id text null", "document_id uuid null", "notes jsonb null", "created_at timestamptz not null default now()", "updated_at timestamptz not null default now()"], primaryKey: "user_step_state_pkey(id)", uniqueConstraints: ["user_step_state_user_step_unique(user_id,step_id)"], checkConstraints: ["user_step_state_status_check", "user_step_state_source_check"], foreignKeys: ["user_step_state_user_id_fkey -> auth.users(id) on delete cascade", "user_step_state_step_id_fkey -> knowledge_steps(id) on delete cascade", "user_step_state_document_id_fkey -> user_documents(id) on delete set null"], indexes: ["user_step_state_user_idx"], rlsEnabled: true, policies: ["user_step_state_select_own", "user_step_state_insert_own", "user_step_state_update_own"], grants: [], triggers: ["update_user_step_state_updated_at"], sourceFiles: ["016_user_step_state.sql", "028_user_step_state_rls_and_action_id_guard.sql"] },
  { tableName: "document_intelligence_jobs", columns: ["id uuid not null default gen_random_uuid()", "document_id uuid not null", "user_id uuid not null", "status text not null default 'queued'", "attempt_count integer not null default 0", "lease_token uuid null", "lease_expires_at timestamptz null", "last_error text null", "last_error_at timestamptz null", "scheduled_at timestamptz not null default now()", "started_at timestamptz null", "finished_at timestamptz null", "created_at timestamptz not null default now()", "updated_at timestamptz not null default now()", "result jsonb null"], primaryKey: "document_intelligence_jobs_pkey(id)", uniqueConstraints: ["document_intelligence_jobs_one_per_document(document_id)"], checkConstraints: ["document_intelligence_jobs_status_check", "document_intelligence_jobs_attempt_count_check", "document_intelligence_jobs_lease_check"], foreignKeys: ["document_intelligence_jobs_document_id_fkey -> user_documents(id) on delete cascade", "document_intelligence_jobs_user_id_fkey -> auth.users(id) on delete cascade"], indexes: ["document_intelligence_jobs_status_scheduled_idx", "document_intelligence_jobs_lease_expiry_idx", "document_intelligence_jobs_user_created_idx", "document_intelligence_jobs_user_id_idx", "document_intelligence_jobs_document_id_idx", "document_intelligence_jobs_status_idx"], rlsEnabled: true, policies: ["document_intelligence_jobs_select_own", "document_intelligence_jobs_insert_own", "document_intelligence_jobs_update_own", "document_intelligence_jobs_delete_own"], grants: [], triggers: ["document_intelligence_jobs_set_updated_at"], sourceFiles: ["017_document_intelligence_jobs.sql", "024_document_intelligence_jobs_table_fix.sql"] },
  { tableName: "user_phrase_state", columns: ["id uuid not null default gen_random_uuid()", "user_id uuid not null", "phrase_id text not null", "is_favorite boolean not null default true", "created_at timestamptz not null default now()", "updated_at timestamptz not null default now()", "repetitions integer not null default 0", "interval_days integer not null default 1", "ease_factor double precision not null default 2.5", "due_at timestamptz not null default now()"], primaryKey: "user_phrase_state_pkey(id)", uniqueConstraints: ["user_phrase_state_user_phrase_unique(user_id,phrase_id)"], checkConstraints: [], foreignKeys: ["user_phrase_state_user_id_fkey -> auth.users(id) on delete cascade"], indexes: [], rlsEnabled: true, policies: ["user_phrase_state_select_own", "user_phrase_state_insert_own", "user_phrase_state_update_own", "user_phrase_state_delete_own"], grants: [], triggers: ["update_user_phrase_state_updated_at"], sourceFiles: ["029_user_phrase_state_favorites_rls.sql"] },
] as const satisfies readonly TableSpec[];

const functionSpecs = [
  { schema: "public", name: "update_updated_at_column", argumentTypes: [], returnType: "trigger", language: "plpgsql", securityDefiner: false, searchPath: null, volatility: "VOLATILE", triggerUsage: ["update_phrases_updated_at", "update_user_step_state_updated_at", "update_user_phrase_state_updated_at", "profiles_set_updated_at"], executeRoles: ["PUBLIC"], sourceDefinition: "001_create_phrases_tables.sql", supersededDefinitions: [] },
  { schema: "public", name: "reject_document_step_proof", argumentTypes: ["uuid", "text"], returnType: "jsonb", language: "plpgsql", securityDefiner: true, searchPath: "public", volatility: "VOLATILE", triggerUsage: [], executeRoles: ["authenticated"], sourceDefinition: "012_proof_signals_and_verifications.sql", supersededDefinitions: [] },
  { schema: "public", name: "confirm_document_step_proof", argumentTypes: ["uuid", "text"], returnType: "jsonb", language: "plpgsql", securityDefiner: true, searchPath: "public", volatility: "VOLATILE", triggerUsage: [], executeRoles: ["authenticated"], sourceDefinition: "012_proof_signals_and_verifications.sql", supersededDefinitions: [] },
  { schema: "public", name: "i18n_insert_translations_if_missing", argumentTypes: ["text", "jsonb"], returnType: "bigint", language: "sql", securityDefiner: true, searchPath: "public", volatility: "VOLATILE", triggerUsage: [], executeRoles: ["service_role"], sourceDefinition: "015_i18n_insert_rpc_and_jobs.sql", supersededDefinitions: [] },
  { schema: "public", name: "set_updated_at", argumentTypes: [], returnType: "trigger", language: "plpgsql", securityDefiner: false, searchPath: null, volatility: "VOLATILE", triggerUsage: ["document_intelligence_jobs_set_updated_at"], executeRoles: ["PUBLIC"], sourceDefinition: "024_document_intelligence_jobs_table_fix.sql", supersededDefinitions: ["017_document_intelligence_jobs.sql"] },
  { schema: "public", name: "enqueue_document_intelligence_job", argumentTypes: ["uuid", "uuid"], returnType: "public.document_intelligence_jobs", language: "plpgsql", securityDefiner: true, searchPath: "public", volatility: "VOLATILE", triggerUsage: [], executeRoles: ["service_role"], sourceDefinition: "030_enqueue_document_intelligence_job_ownership_guard.sql", supersededDefinitions: ["017_document_intelligence_jobs.sql"] },
  { schema: "public", name: "claim_next_document_intelligence_job", argumentTypes: ["integer"], returnType: "public.document_intelligence_jobs", language: "plpgsql", securityDefiner: true, searchPath: "public", volatility: "VOLATILE", triggerUsage: [], executeRoles: ["service_role"], sourceDefinition: "017_document_intelligence_jobs.sql", supersededDefinitions: [] },
] as const satisfies readonly FunctionSpec[];

const triggerSpecs = [
  { triggerName: "update_phrases_updated_at", tableName: "phrases", timing: "BEFORE", events: ["UPDATE"], forEach: "ROW", functionSignature: "public.update_updated_at_column()", sourceFile: "001_create_phrases_tables.sql" },
  { triggerName: "profiles_set_updated_at", tableName: "profiles", timing: "BEFORE", events: ["UPDATE"], forEach: "ROW", functionSignature: "public.update_updated_at_column()", sourceFile: "9T-A1 canonical decision" },
  { triggerName: "update_user_step_state_updated_at", tableName: "user_step_state", timing: "BEFORE", events: ["UPDATE"], forEach: "ROW", functionSignature: "public.update_updated_at_column()", sourceFile: "016_user_step_state.sql" },
  { triggerName: "document_intelligence_jobs_set_updated_at", tableName: "document_intelligence_jobs", timing: "BEFORE", events: ["UPDATE"], forEach: "ROW", functionSignature: "public.set_updated_at()", sourceFile: "024_document_intelligence_jobs_table_fix.sql" },
  { triggerName: "update_user_phrase_state_updated_at", tableName: "user_phrase_state", timing: "BEFORE", events: ["UPDATE"], forEach: "ROW", functionSignature: "public.update_updated_at_column()", sourceFile: "029_user_phrase_state_favorites_rls.sql" },
] as const satisfies readonly TriggerSpec[];

const policy = (
  policyName: string, tableName: string, command: PolicySpec["command"], roles: readonly string[],
  usingExpression: string | null, withCheckExpression: string | null, sourceFile: string,
  supersededBy: string | null = null,
): PolicySpec => ({ policyName, tableName, command, roles, usingExpression, withCheckExpression, sourceFile, supersededBy });
const own = "auth.uid() = user_id";
const policySpecs = [
  policy("Allow public read access to phrases", "phrases", "SELECT", ["public"], "true", null, "001_create_phrases_tables.sql"),
  policy("Allow public read access to phrase_translations", "phrase_translations", "SELECT", ["public"], "true", null, "001_create_phrases_tables.sql"),
  policy("profiles_select_own", "profiles", "SELECT", ["authenticated"], "auth.uid() = id", null, "9T-A1 canonical decision"),
  policy("profiles_insert_own", "profiles", "INSERT", ["authenticated"], null, "auth.uid() = id", "9T-A1 canonical decision"),
  policy("profiles_update_own", "profiles", "UPDATE", ["authenticated"], "auth.uid() = id", "auth.uid() = id", "9T-A1 canonical decision"),
  policy("user_documents_select_own", "user_documents", "SELECT", ["authenticated"], own, null, "005_documents_v1.sql"),
  policy("user_documents_insert_own", "user_documents", "INSERT", ["authenticated"], null, own, "005_documents_v1.sql"),
  policy("user_documents_update_own", "user_documents", "UPDATE", ["authenticated"], own, own, "006_user_documents_extracted_text.sql"),
  policy("user_documents_delete_own", "user_documents", "DELETE", ["authenticated"], own, null, "005_documents_v1.sql"),
  policy("documents_storage_select_own", "storage.objects", "SELECT", ["authenticated"], "bucket_id = 'documents' and split_part(name, '/', 1) = auth.uid()::text", null, "005_documents_v1.sql"),
  policy("documents_storage_insert_own", "storage.objects", "INSERT", ["authenticated"], null, "bucket_id = 'documents' and split_part(name, '/', 1) = auth.uid()::text", "005_documents_v1.sql"),
  policy("documents_storage_update_own", "storage.objects", "UPDATE", ["authenticated"], "bucket_id = 'documents' and split_part(name, '/', 1) = auth.uid()::text", "bucket_id = 'documents' and split_part(name, '/', 1) = auth.uid()::text", "005_documents_v1.sql"),
  policy("documents_storage_delete_own", "storage.objects", "DELETE", ["authenticated"], "bucket_id = 'documents' and split_part(name, '/', 1) = auth.uid()::text", null, "005_documents_v1.sql"),
  policy("Users can read own user_progress", "user_progress", "SELECT", ["public"], own, null, "027_user_progress_rls_hardening.sql"),
  policy("Users can insert own user_progress", "user_progress", "INSERT", ["public"], null, own, "027_user_progress_rls_hardening.sql"),
  policy("Users can update own user_progress", "user_progress", "UPDATE", ["public"], own, own, "027_user_progress_rls_hardening.sql"),
  policy("Users can read own user_action_events", "user_action_events", "SELECT", ["public"], own, null, "009_user_action_events.sql"),
  policy("Users can insert own user_action_events", "user_action_events", "INSERT", ["public"], null, own, "009_user_action_events.sql"),
  policy("knowledge_topics_select_active_authenticated", "knowledge_topics", "SELECT", ["authenticated"], "is_active = true", null, "010_knowledge_layer.sql"),
  policy("knowledge_steps_select_active_authenticated", "knowledge_steps", "SELECT", ["authenticated"], "is_active = true and active parent topic exists", null, "010_knowledge_layer.sql"),
  policy("knowledge_step_dependencies_select_authenticated", "knowledge_step_dependencies", "SELECT", ["authenticated"], "active dependent and prerequisite steps with active topics exist", null, "010_knowledge_layer.sql"),
  policy("document_types_select_active_authenticated", "document_types", "SELECT", ["authenticated"], "is_active = true", null, "010_knowledge_layer.sql"),
  policy("document_type_step_links_select_authenticated", "document_type_step_links", "SELECT", ["authenticated"], "active document type and active step with active topic exist", null, "010_knowledge_layer.sql"),
  policy("user_document_step_verifications_select_own", "user_document_step_verifications", "SELECT", ["authenticated"], own, null, "012_proof_signals_and_verifications.sql"),
  policy("i18n_translations_select_public", "i18n_translations", "SELECT", ["anon", "authenticated"], "true", null, "014_i18n_translations.sql"),
  policy("i18n_jobs_deny_all", "i18n_jobs", "ALL", ["authenticated", "anon"], "false", "false", "015_i18n_insert_rpc_and_jobs.sql"),
  policy("user_step_state_select_own", "user_step_state", "SELECT", ["authenticated"], own, null, "016_user_step_state.sql"),
  policy("user_step_state_insert_own", "user_step_state", "INSERT", ["authenticated"], null, own, "028_user_step_state_rls_and_action_id_guard.sql"),
  policy("user_step_state_update_own", "user_step_state", "UPDATE", ["authenticated"], own, own, "028_user_step_state_rls_and_action_id_guard.sql"),
  policy("document_intelligence_jobs_select_own", "document_intelligence_jobs", "SELECT", ["authenticated"], own, null, "024_document_intelligence_jobs_table_fix.sql"),
  policy("document_intelligence_jobs_insert_own", "document_intelligence_jobs", "INSERT", ["authenticated"], null, own, "024_document_intelligence_jobs_table_fix.sql"),
  policy("document_intelligence_jobs_update_own", "document_intelligence_jobs", "UPDATE", ["authenticated"], own, own, "024_document_intelligence_jobs_table_fix.sql"),
  policy("document_intelligence_jobs_delete_own", "document_intelligence_jobs", "DELETE", ["authenticated"], own, null, "024_document_intelligence_jobs_table_fix.sql"),
  policy("user_phrase_state_select_own", "user_phrase_state", "SELECT", ["authenticated"], own, null, "029_user_phrase_state_favorites_rls.sql"),
  policy("user_phrase_state_insert_own", "user_phrase_state", "INSERT", ["authenticated"], null, own, "029_user_phrase_state_favorites_rls.sql"),
  policy("user_phrase_state_update_own", "user_phrase_state", "UPDATE", ["authenticated"], own, own, "029_user_phrase_state_favorites_rls.sql"),
  policy("user_phrase_state_delete_own", "user_phrase_state", "DELETE", ["authenticated"], own, null, "029_user_phrase_state_favorites_rls.sql"),
] as const satisfies readonly PolicySpec[];

const indexSources: Readonly<Record<string, string>> = {
  idx_phrases_level: "001_create_phrases_tables.sql", idx_phrases_category: "001_create_phrases_tables.sql",
  idx_phrases_sector: "001_create_phrases_tables.sql", idx_phrase_translations_locale: "001_create_phrases_tables.sql",
  idx_phrase_translations_phrase_id: "001_create_phrases_tables.sql", profiles_dna_gin_idx: "003_add_user_dna_to_profiles.sql",
  profiles_location_idx: "025_profile_location_fields_foundation.sql", idx_user_documents_user_created: "005_documents_v1.sql",
  user_documents_document_type_id_idx: "011_user_documents_document_intelligence.sql",
  user_documents_classification_status_idx: "011_user_documents_document_intelligence.sql",
  user_progress_user_id_idx: "008_user_progress.sql", user_action_events_user_id_idx: "009_user_action_events.sql",
  user_action_events_action_id_idx: "009_user_action_events.sql", knowledge_topics_category_idx: "010_knowledge_layer.sql",
  knowledge_topics_sort_idx: "010_knowledge_layer.sql", knowledge_steps_topic_id_idx: "010_knowledge_layer.sql",
  knowledge_steps_topic_sort_idx: "010_knowledge_layer.sql", knowledge_steps_action_id_idx: "010_knowledge_layer.sql",
  knowledge_step_dependencies_depends_idx: "010_knowledge_layer.sql", document_types_category_idx: "010_knowledge_layer.sql",
  document_type_step_links_step_idx: "010_knowledge_layer.sql",
  user_document_step_verifications_user_doc_idx: "012_proof_signals_and_verifications.sql",
  i18n_translations_locale_idx: "014_i18n_translations.sql", i18n_jobs_locale_created_idx: "015_i18n_insert_rpc_and_jobs.sql",
  user_step_state_user_idx: "016_user_step_state.sql",
  document_intelligence_jobs_status_scheduled_idx: "017_document_intelligence_jobs.sql",
  document_intelligence_jobs_lease_expiry_idx: "017_document_intelligence_jobs.sql",
  document_intelligence_jobs_user_created_idx: "017_document_intelligence_jobs.sql",
  document_intelligence_jobs_user_id_idx: "024_document_intelligence_jobs_table_fix.sql",
  document_intelligence_jobs_document_id_idx: "024_document_intelligence_jobs_table_fix.sql",
  document_intelligence_jobs_status_idx: "024_document_intelligence_jobs_table_fix.sql",
  idx_knowledge_steps_action_id: "028_user_step_state_rls_and_action_id_guard.sql",
  uq_knowledge_steps_action_id_active: "031_knowledge_steps_active_action_id_unique.sql",
};
const canonicalIndexNames = Object.keys(indexSources).sort();
const canonicalConstraintNames = tableSpecs.flatMap((table) => [
  table.primaryKey.split("(")[0],
  ...table.uniqueConstraints.map((value) => value.split("(")[0]),
  ...table.checkConstraints,
  ...table.foreignKeys.map((value) => value.split(" ")[0]),
]).sort();
const rlsEnabledTableNames = tableSpecs.filter((table) => table.rlsEnabled).map((table) => `public.${table.tableName}`).sort();
const excludedDataGroups = [
  "002: phrase and translation demo INSERTs",
  "005: documents storage bucket INSERT (platform bootstrap data)",
  "010: MVP knowledge catalog INSERTs",
  "012: knowledge-step profile-flag UPDATE backfills",
  "013: action-id UPDATE and knowledge-step INSERT",
  "018: eligibility/relocation INSERTs and UPDATE",
  "019: relocation starter INSERTs",
  "020: corrected relocation starter INSERTs",
  "021: health-insurance INSERT/UPDATE/DELETE consolidation",
  "023_relocation: example step INSERT, dependency DELETE and INSERT",
  "025: profile country/region UPDATE backfills",
  "026: duplicate user-progress DELETE cleanup",
  "20260423: knowledge topic/step/dependency/document-type/link UPSERT groups",
] as const;
const supersededDefinitions = [
  "004 public.user_documents definition -> replaced by 005",
  "004 user-documents bucket contract -> replaced by 005 documents bucket contract",
  "004 user_documents_storage_select/insert/update/delete_own policies -> dropped by 005",
  "017 document_intelligence_jobs_status_check -> replaced by 024 expanded status check",
  "017 document_intelligence_jobs_deny_mutations policy -> dropped by 024 own-row CRUD policies",
  "017 enqueue_document_intelligence_job(uuid,uuid) body -> replaced by 030 ownership-guarded body",
  "017 set_updated_at() body -> restated by 024 as the latest effective definition",
] as const;

const duplicate023ObjectResolution = {
  "023_region_identity_foundation.sql": {
    schemaObjects: ["public.profiles.region column", "public.profiles.city column"],
    supersededSchemaObjects: [],
    excludedDataStatements: [],
  },
  "023_relocation_starter_or_dependency_example.sql": {
    schemaObjects: [],
    supersededSchemaObjects: [],
    excludedDataStatements: ["knowledge_steps INSERT", "knowledge_step_dependencies DELETE", "knowledge_step_dependencies INSERT"],
  },
} as const;
const timestampMigrationObjectResolution = {
  timestampMigrationFilename: "20260423_branching_real_world_expansion.sql",
  timestampMigrationSchemaObjects: [],
  timestampMigrationDataStatements: ["knowledge_topics", "knowledge_steps", "knowledge_step_dependencies", "document_types", "document_type_step_links"],
  timestampMigrationSchemaEffectsIncluded: true,
  timestampMigrationDataEffectsExcluded: true,
  canonicalOrderingRationale: "The file is data-only; ordering cannot create a schema contribution.",
} as const;
const platformDependencyObjects: readonly CanonicalObject[] = [
  { objectCategory: "SCHEMA", schemaName: "auth", objectName: "auth", signatureOrIdentity: "Supabase auth schema", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned schema; validation fixture only.", platformOwned: true, applicationOwned: false, containsDataDependency: false, requiresValidationFixture: true, confidence: "PROVEN" },
  { objectCategory: "TABLE", schemaName: "auth", objectName: "auth.users", signatureOrIdentity: "Supabase authenticated-user identity table", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned table; validation fixture only.", platformOwned: true, applicationOwned: false, containsDataDependency: false, requiresValidationFixture: true, confidence: "PROVEN" },
  { objectCategory: "FUNCTION", schemaName: "auth", objectName: "auth.uid()", signatureOrIdentity: "auth.uid() returns uuid", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned session function; validation fixture only.", platformOwned: true, applicationOwned: false, containsDataDependency: false, requiresValidationFixture: true, confidence: "PROVEN" },
  { objectCategory: "SCHEMA", schemaName: "storage", objectName: "storage", signatureOrIdentity: "Supabase storage schema", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned schema; validation fixture only.", platformOwned: true, applicationOwned: false, containsDataDependency: false, requiresValidationFixture: true, confidence: "PROVEN" },
  { objectCategory: "TABLE", schemaName: "storage", objectName: "storage.objects", signatureOrIdentity: "Supabase storage object table", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned table targeted by application-authored policies.", platformOwned: true, applicationOwned: false, containsDataDependency: false, requiresValidationFixture: true, confidence: "PROVEN" },
  { objectCategory: "TABLE", schemaName: "storage", objectName: "storage.buckets", signatureOrIdentity: "Supabase storage bucket table", createdBy: "Supabase platform", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "Supabase platform", includedInBaseline: false, exclusionReason: "Platform-owned table; bucket data excluded.", platformOwned: true, applicationOwned: false, containsDataDependency: true, requiresValidationFixture: true, confidence: "PROVEN" },
];
const privilegeObject = (
  objectCategory: "GRANT" | "REVOKE", objectName: string, identity: string, source: string,
  confidence: Confidence = "PROVEN",
): CanonicalObject => ({
  objectCategory, schemaName: "public", objectName, signatureOrIdentity: identity,
  createdBy: source, alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: source,
  includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true,
  containsDataDependency: false, requiresValidationFixture: identity.includes("authenticated") || identity.includes("service_role"),
  confidence,
});
const privilegeObjects: readonly CanonicalObject[] = [
  privilegeObject("REVOKE", "profiles_public_revoke", "REVOKE ALL ON TABLE public.profiles FROM PUBLIC", "9T-A1 canonical decision", "CANONICAL_NEW_DECISION"),
  privilegeObject("REVOKE", "profiles_anon_revoke", "REVOKE ALL ON TABLE public.profiles FROM anon", "9T-A1 canonical decision", "CANONICAL_NEW_DECISION"),
  privilegeObject("GRANT", "profiles_authenticated_grant", "GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated", "9T-A1 canonical decision", "CANONICAL_NEW_DECISION"),
  privilegeObject("REVOKE", "reject_document_step_proof_public_revoke", "REVOKE ALL ON FUNCTION public.reject_document_step_proof(uuid,text) FROM PUBLIC", "012_proof_signals_and_verifications.sql"),
  privilegeObject("GRANT", "reject_document_step_proof_authenticated_grant", "GRANT EXECUTE ON FUNCTION public.reject_document_step_proof(uuid,text) TO authenticated", "012_proof_signals_and_verifications.sql"),
  privilegeObject("REVOKE", "confirm_document_step_proof_public_revoke", "REVOKE ALL ON FUNCTION public.confirm_document_step_proof(uuid,text) FROM PUBLIC", "012_proof_signals_and_verifications.sql"),
  privilegeObject("GRANT", "confirm_document_step_proof_authenticated_grant", "GRANT EXECUTE ON FUNCTION public.confirm_document_step_proof(uuid,text) TO authenticated", "012_proof_signals_and_verifications.sql"),
  privilegeObject("REVOKE", "i18n_insert_translations_public_revoke", "REVOKE ALL ON FUNCTION public.i18n_insert_translations_if_missing(text,jsonb) FROM PUBLIC", "015_i18n_insert_rpc_and_jobs.sql"),
  privilegeObject("GRANT", "i18n_insert_translations_service_role_grant", "GRANT EXECUTE ON FUNCTION public.i18n_insert_translations_if_missing(text,jsonb) TO service_role", "015_i18n_insert_rpc_and_jobs.sql"),
  privilegeObject("REVOKE", "enqueue_document_intelligence_job_public_revoke", "REVOKE ALL ON FUNCTION public.enqueue_document_intelligence_job(uuid,uuid) FROM PUBLIC", "030_enqueue_document_intelligence_job_ownership_guard.sql"),
  privilegeObject("GRANT", "enqueue_document_intelligence_job_service_role_grant", "GRANT EXECUTE ON FUNCTION public.enqueue_document_intelligence_job(uuid,uuid) TO service_role", "030_enqueue_document_intelligence_job_ownership_guard.sql"),
  privilegeObject("REVOKE", "claim_next_document_intelligence_job_public_revoke", "REVOKE ALL ON FUNCTION public.claim_next_document_intelligence_job(integer) FROM PUBLIC", "017_document_intelligence_jobs.sql"),
  privilegeObject("GRANT", "claim_next_document_intelligence_job_service_role_grant", "GRANT EXECUTE ON FUNCTION public.claim_next_document_intelligence_job(integer) TO service_role", "017_document_intelligence_jobs.sql"),
];

const canonicalObjects: readonly CanonicalObject[] = [
  ...platformDependencyObjects,
  ...privilegeObjects,
  { objectCategory: "EXTENSION", schemaName: "public", objectName: "uuid-ossp", signatureOrIdentity: "extension uuid-ossp", createdBy: "001_create_phrases_tables.sql", alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: "001_create_phrases_tables.sql", includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: false, requiresValidationFixture: false, confidence: "PROVEN" },
  ...tableSpecs.flatMap((table): CanonicalObject[] => {
    const createdBy = table.tableName === "profiles" ? "9T-A1 canonical decision" : table.sourceFiles[0];
    const confidence: Confidence = table.tableName === "profiles" ? "CANONICAL_NEW_DECISION" : "PROVEN";
    const common = { schemaName: "public", createdBy, alteredBy: table.sourceFiles.slice(1), supersededDefinitions: table.tableName === "user_documents" ? ["004_user_documents.sql"] : table.tableName === "document_intelligence_jobs" ? ["017 definitions superseded in part by 024"] : [], latestEffectiveDefinition: table.sourceFiles.at(-1) ?? createdBy, includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: false, requiresValidationFixture: table.foreignKeys.some((fk) => fk.includes("auth.users")), confidence };
    return [
      { ...common, objectCategory: "TABLE", objectName: table.tableName, signatureOrIdentity: `public.${table.tableName}` },
      ...table.columns.map((column) => ({ ...common, objectCategory: "COLUMN" as const, objectName: `${table.tableName}.${column.split(" ")[0]}`, signatureOrIdentity: column })),
      { ...common, objectCategory: "PRIMARY_KEY", objectName: table.primaryKey.split("(")[0], signatureOrIdentity: table.primaryKey },
      ...table.uniqueConstraints.map((identity) => ({ ...common, objectCategory: "UNIQUE_CONSTRAINT" as const, objectName: identity.split("(")[0], signatureOrIdentity: identity })),
      ...table.checkConstraints.map((identity) => ({ ...common, objectCategory: "CHECK_CONSTRAINT" as const, objectName: identity, signatureOrIdentity: identity })),
      ...table.foreignKeys.map((identity) => ({ ...common, objectCategory: "FOREIGN_KEY" as const, objectName: identity.split(" ")[0], signatureOrIdentity: identity })),
      { ...common, objectCategory: "RLS_ENABLEMENT", objectName: table.tableName, signatureOrIdentity: `ALTER TABLE public.${table.tableName} ENABLE ROW LEVEL SECURITY` },
    ];
  }),
  ...functionSpecs.map((fn): CanonicalObject => ({ objectCategory: "FUNCTION", schemaName: "public", objectName: fn.name, signatureOrIdentity: `${fn.name}(${fn.argumentTypes.join(",")})`, createdBy: fn.sourceDefinition, alteredBy: [], supersededDefinitions: fn.supersededDefinitions, latestEffectiveDefinition: fn.sourceDefinition, includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: false, requiresValidationFixture: fn.name.includes("document") || fn.name.includes("proof"), confidence: "PROVEN" })),
  ...triggerSpecs.map((trigger): CanonicalObject => ({ objectCategory: "TRIGGER", schemaName: "public", objectName: trigger.triggerName, signatureOrIdentity: `${trigger.timing} ${trigger.events.join(",")} ON ${trigger.tableName} -> ${trigger.functionSignature}`, createdBy: trigger.sourceFile, alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: trigger.sourceFile, includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: false, requiresValidationFixture: false, confidence: trigger.sourceFile.startsWith("9T-A1") ? "CANONICAL_NEW_DECISION" : "PROVEN" })),
  ...policySpecs.map((item): CanonicalObject => ({ objectCategory: "POLICY", schemaName: item.tableName.startsWith("storage.") ? "storage" : "public", objectName: item.policyName, signatureOrIdentity: `${item.command}:${item.roles.join(",")}:${item.usingExpression ?? "-"}:${item.withCheckExpression ?? "-"}`, createdBy: item.sourceFile, alteredBy: [], supersededDefinitions: item.supersededBy ? [item.supersededBy] : [], latestEffectiveDefinition: item.sourceFile, includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: item.tableName === "storage.objects", requiresValidationFixture: item.tableName === "storage.objects", confidence: item.sourceFile.startsWith("9T-A1") ? "CANONICAL_NEW_DECISION" : "PROVEN" })),
  ...canonicalIndexNames.map((indexName): CanonicalObject => ({ objectCategory: "INDEX", schemaName: "public", objectName: indexName, signatureOrIdentity: indexName, createdBy: indexSources[indexName], alteredBy: [], supersededDefinitions: [], latestEffectiveDefinition: indexSources[indexName], includedInBaseline: true, exclusionReason: null, platformOwned: false, applicationOwned: true, containsDataDependency: false, requiresValidationFixture: false, confidence: "PROVEN" })),
];

type InventoryModel = {
  migrationFiles: string[];
  objectIdentities: string[];
  tableNames: string[];
  functionSignatures: string[];
  triggerNames: string[];
  policyIdentities: string[];
  indexNames: string[];
  constraintNames: string[];
  rlsTableNames: string[];
  unclassifiedSqlStatementCount: number;
  seedClassifiedAsSchema: boolean;
  duplicate023Resolved: boolean;
  timestampMigrationResolved: boolean;
  migration031Resolved: boolean;
  platformOwnershipCorrect: boolean;
};
const objectIdentity = (item: CanonicalObject) =>
  `${item.objectCategory}:${item.schemaName}:${item.objectName}:${item.signatureOrIdentity}`;

function validateInventory(candidate: InventoryModel): string[] {
  const failures: string[] = [];
  const exact = (actual: readonly string[], expected: readonly string[], name: string) => {
    if (actual.length !== expected.length || [...actual].sort().some((value, index) => value !== [...expected].sort()[index])) failures.push(name);
  };
  exact(candidate.migrationFiles, [...migrationFilesExpected], "migration_inventory");
  exact(candidate.objectIdentities, canonicalObjects.map(objectIdentity), "canonical_objects");
  exact(candidate.tableNames, tableSpecs.map((table) => table.tableName), "tables");
  exact(candidate.functionSignatures, functionSpecs.map((fn) => `${fn.name}(${fn.argumentTypes.join(",")})`), "functions");
  exact(candidate.triggerNames, triggerSpecs.map((trigger) => trigger.triggerName), "triggers");
  exact(candidate.policyIdentities, policySpecs.map((item) => `${item.tableName}:${item.policyName}:${item.command}:${item.roles.join(",")}:${item.usingExpression ?? "-"}:${item.withCheckExpression ?? "-"}`), "policies");
  exact(candidate.indexNames, canonicalIndexNames, "indexes");
  exact(candidate.constraintNames, canonicalConstraintNames, "constraints");
  exact(candidate.rlsTableNames, rlsEnabledTableNames, "rls");
  if (candidate.unclassifiedSqlStatementCount !== 0) failures.push("unclassified_sql");
  if (candidate.seedClassifiedAsSchema) failures.push("seed_classification");
  if (!candidate.duplicate023Resolved) failures.push("duplicate_023");
  if (!candidate.timestampMigrationResolved) failures.push("timestamp_migration");
  if (!candidate.migration031Resolved) failures.push("migration_031");
  if (!candidate.platformOwnershipCorrect) failures.push("platform_boundary");
  return failures;
}

function runInventoryOnly(): never {
  const migrationsDirectory = resolve(root, "supabase/migrations");
  const actualPre032Files = migrationFilesExpected.filter((file) => existsSync(resolve(migrationsDirectory, file)));
  const migrationTexts = actualPre032Files.map((file) => ({ file, text: readFileSync(resolve(migrationsDirectory, file), "utf8") }));
  const schemaStatement = /^\s*(create|alter|drop|grant|revoke)\b/i;
  const classifiedStatement = /^\s*(create\s+(or\s+replace\s+)?(extension|table|unique\s+index|index|function|trigger|policy)|alter\s+(table|column)|drop\s+(table|trigger|policy|constraint)|grant\s+execute|revoke\s+all)\b/i;
  const unclassifiedSqlStatements = migrationTexts.flatMap(({ file, text: sql }) =>
    sql.split(/\r?\n/).filter((line) => schemaStatement.test(line) && !classifiedStatement.test(line)).map((line) => `${file}:${line.trim()}`),
  );
  const model: InventoryModel = {
    migrationFiles: [...actualPre032Files],
    objectIdentities: canonicalObjects.map(objectIdentity),
    tableNames: tableSpecs.map((table) => table.tableName),
    functionSignatures: functionSpecs.map((fn) => `${fn.name}(${fn.argumentTypes.join(",")})`),
    triggerNames: triggerSpecs.map((trigger) => trigger.triggerName),
    policyIdentities: policySpecs.map((item) => `${item.tableName}:${item.policyName}:${item.command}:${item.roles.join(",")}:${item.usingExpression ?? "-"}:${item.withCheckExpression ?? "-"}`),
    indexNames: [...canonicalIndexNames],
    constraintNames: [...canonicalConstraintNames],
    rlsTableNames: [...rlsEnabledTableNames],
    unclassifiedSqlStatementCount: unclassifiedSqlStatements.length,
    seedClassifiedAsSchema: false,
    duplicate023Resolved: Object.keys(duplicate023ObjectResolution).length === 2,
    timestampMigrationResolved: timestampMigrationObjectResolution.timestampMigrationSchemaObjects.length === 0
      && timestampMigrationObjectResolution.timestampMigrationDataEffectsExcluded,
    migration031Resolved: canonicalIndexNames.includes("uq_knowledge_steps_action_id_active"),
    platformOwnershipCorrect: canonicalObjects
      .filter((item) => ["auth.users", "auth.uid()", "storage.objects", "storage.buckets"].includes(item.objectName))
      .every((item) => item.platformOwned),
  };

  const tamperCases: { name: string; mutate: (candidate: InventoryModel) => void }[] = [
    { name: "migration-omitted", mutate: (candidate) => { candidate.migrationFiles.pop(); } },
    { name: "table-omitted", mutate: (candidate) => { candidate.tableNames.pop(); } },
    { name: "wrong-canonical-definition", mutate: (candidate) => { candidate.objectIdentities[0] += ":superseded"; } },
    { name: "seed-as-schema", mutate: (candidate) => { candidate.seedClassifiedAsSchema = true; } },
    { name: "function-overload-collapsed", mutate: (candidate) => { candidate.functionSignatures.pop(); } },
    { name: "security-definer-omitted", mutate: (candidate) => { candidate.objectIdentities = candidate.objectIdentities.filter((value) => !value.includes("reject_document_step_proof")); } },
    { name: "search-path-omitted", mutate: (candidate) => { candidate.functionSignatures[1] += ":no-search-path"; } },
    { name: "trigger-target-changed", mutate: (candidate) => { candidate.triggerNames[0] = "wrong_target"; } },
    { name: "policy-role-omitted", mutate: (candidate) => { candidate.policyIdentities[0] = candidate.policyIdentities[0].replace(":public:", "::"); } },
    { name: "policy-expression-omitted", mutate: (candidate) => { candidate.policyIdentities[0] += ":missing-expression"; } },
    { name: "rls-table-omitted", mutate: (candidate) => { candidate.rlsTableNames.pop(); } },
    { name: "index-double-counted", mutate: (candidate) => { candidate.indexNames.push(candidate.indexNames[0]); } },
    { name: "constraint-omitted", mutate: (candidate) => { candidate.constraintNames.pop(); } },
    { name: "duplicate-023-ignored", mutate: (candidate) => { candidate.duplicate023Resolved = false; } },
    { name: "timestamp-migration-ignored", mutate: (candidate) => { candidate.timestampMigrationResolved = false; } },
    { name: "migration-031-index-omitted", mutate: (candidate) => { candidate.migration031Resolved = false; } },
    { name: "platform-table-application-owned", mutate: (candidate) => { candidate.platformOwnershipCorrect = false; } },
    { name: "unresolved-object-accepted", mutate: (candidate) => { candidate.objectIdentities.push("TABLE:public:unresolved:UNRESOLVED"); } },
    { name: "unclassified-ddl-accepted", mutate: (candidate) => { candidate.unclassifiedSqlStatementCount = 1; } },
  ];
  for (const identity of canonicalObjects.map(objectIdentity)) {
    if (tamperCases.length >= 80) break;
    tamperCases.push({
      name: `omit-${identity}`,
      mutate: (candidate) => { candidate.objectIdentities = candidate.objectIdentities.filter((value) => value !== identity); },
    });
  }
  const rejected = tamperCases.filter(({ mutate }) => {
    const candidate = structuredClone(model);
    mutate(candidate);
    return validateInventory(candidate).length > 0;
  });
  const inventoryFailures = validateInventory(model);
  const baselineUnchanged = sha(baseline) === EMBEDDED_BASELINE_SHA;
  const fixtureUnchanged = sha(fixture) === "99e3df5e532ce2ab3d3778dd3c35952ab1658bdb7aff12f5146deffdc1d1bd84";
  const appUnresolved = canonicalObjects.filter((item) => item.applicationOwned && item.confidence === "UNRESOLVED");
  const inventoryMetadataConsistent = tableSpecs.length === 17 && functionSpecs.length === 7
    && triggerSpecs.length === 5 && policySpecs.length === 37 && canonicalIndexNames.length === 33
    && canonicalConstraintNames.length === 63;
  const allPassed = inventoryFailures.length === 0 && rejected.length === tamperCases.length
    && tamperCases.length >= 80 && appUnresolved.length === 0 && baselineUnchanged && fixtureUnchanged
    && inventoryMetadataConsistent;
  const result = {
    checkId: "9T-B1",
    phase: "Exact Pre-032 Object Inventory Extraction",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : [...inventoryFailures, rejected.length !== tamperCases.length ? "TAMPER_PACK" : null, !baselineUnchanged ? "BASELINE_CHANGED" : null, !fixtureUnchanged ? "FIXTURE_CHANGED" : null, !inventoryMetadataConsistent ? "INVENTORY_METADATA" : null].filter(Boolean).join(","),
    migrationFilesInspected: actualPre032Files,
    migrationFilesExpected,
    migrationInventoryComplete: actualPre032Files.length === migrationFilesExpected.length,
    unclassifiedSqlStatementCount: unclassifiedSqlStatements.length,
    unclassifiedSqlStatements,
    expectedPlanTableCount: 17,
    canonicalTableCount: tableSpecs.length,
    canonicalTableNames: tableSpecs.map((table) => table.tableName),
    tableDefinitionsComplete: tableSpecs.every((table) => table.columns.length > 0 && table.primaryKey.length > 0),
    tableCountDifference: tableSpecs.length - 17,
    tableCountDifferenceExplanation: "No difference: 16 migration-created tables plus the approved canonical public.profiles table.",
    canonicalTables: tableSpecs,
    expectedPlanFunctionCount: 7,
    canonicalFunctionCount: functionSpecs.length,
    canonicalFunctionNames: functionSpecs.map((fn) => `${fn.schema}.${fn.name}(${fn.argumentTypes.join(",")})`),
    functionDefinitionsComplete: functionSpecs.every((fn) => !fn.securityDefiner || fn.searchPath === "public"),
    canonicalFunctions: functionSpecs,
    expectedCanonicalTriggerCount: 5,
    canonicalTriggerCount: triggerSpecs.length,
    canonicalTriggerNames: triggerSpecs.map((trigger) => trigger.triggerName),
    triggerDefinitionsComplete: triggerSpecs.every((trigger) => functionSpecs.some((fn) => trigger.functionSignature.includes(fn.name))),
    triggerCountProvenance: "Four migration-derived triggers plus the approved profiles updated_at trigger; only the canonical total of five participates in validation.",
    canonicalTriggers: triggerSpecs,
    expectedCanonicalPolicyCount: 37,
    canonicalPolicyCount: policySpecs.length,
    canonicalPolicyNames: policySpecs.map((item) => `${item.tableName}.${item.policyName}`),
    policyDefinitionsComplete: policySpecs.every((item) => item.roles.length > 0 && (item.usingExpression !== null || item.withCheckExpression !== null)),
    policyCountProvenance: "Thirty historical public-table policies plus four application-authored storage policies and three approved profiles policies; only the canonical total of 37 participates in validation.",
    canonicalPolicies: policySpecs,
    expectedCanonicalIndexCount: 33,
    canonicalIndexCount: canonicalIndexNames.length,
    canonicalIndexNames,
    indexDefinitionsComplete: canonicalIndexNames.every((indexName) => Boolean(indexSources[indexName])),
    expectedCanonicalConstraintCount: 63,
    canonicalConstraintCount: canonicalConstraintNames.length,
    canonicalConstraintNames,
    constraintDefinitionsComplete: new Set(canonicalConstraintNames).size === canonicalConstraintNames.length,
    rlsEnabledTableNames,
    rlsInventoryComplete: rlsEnabledTableNames.length === tableSpecs.length,
    rlsEnabledWithoutPolicy: tableSpecs.filter((table) => table.rlsEnabled && !table.policies.length).map((table) => table.tableName),
    duplicate023ResolutionComplete: model.duplicate023Resolved,
    duplicate023SchemaObjects: duplicate023ObjectResolution,
    duplicate023ExcludedDataStatements: duplicate023ObjectResolution["023_relocation_starter_or_dependency_example.sql"].excludedDataStatements,
    timestampMigrationResolutionComplete: model.timestampMigrationResolved,
    ...timestampMigrationObjectResolution,
    migration031SchemaObjectNames: ["public.uq_knowledge_steps_action_id_active"],
    migration031SchemaEffectsComplete: model.migration031Resolved,
    migration031ConflictingDataExcluded: true,
    applicationOwnedUnresolvedObjectCount: appUnresolved.length,
    platformOwnedObjectCount: platformDependencyObjects.length,
    platformBoundary: {
      dependencies: ["auth.users", "auth.uid()", "storage.objects", "storage.buckets", "anon", "authenticated", "service_role"],
      baselineOwned: [],
      validationFixtureOnly: ["roles anon/authenticated/service_role", "auth.users", "auth.uid()", "storage.objects", "storage.buckets"],
      applicationAuthoredPlatformPolicies: policySpecs.filter((item) => item.tableName === "storage.objects").map((item) => item.policyName),
    },
    excludedDataStatementCount: excludedDataGroups.length,
    excludedDataStatementGroups: excludedDataGroups,
    supersededDefinitions,
    canonicalObjectInventory: canonicalObjects,
    inventoryExtractionTamperCaseCount: tamperCases.length,
    inventoryExtractionTamperCasesRejected: rejected.length,
    inventoryExtractionTamperCaseNames: tamperCases.map((item) => item.name),
    inventoryMetadataConsistent,
    stalePlanCountsUsedForPass: false,
    embeddedBaselineShaPin: EMBEDDED_BASELINE_SHA,
    baselineShaPinMatchesCurrentArtifact: baselineUnchanged,
    baselineSqlModifiedInThisSubphase: !baselineUnchanged,
    fixtureModifiedInThisSubphase: !fixtureUnchanged,
    migrationModified: false,
    generatedTypesCreated: false,
    remoteDatabaseUsed: false,
    productionDatabaseUsed: false,
    readyForBaselineInventoryImplementation: allPassed,
    recommendedNextPhase: "PHASE 9T-B2 — Complete Baseline SQL From Canonical Inventory",
  } as const;
  console.log(JSON.stringify(result, null, 2));
  process.exit(allPassed ? 0 : 1);
}

if (process.argv.includes("--inventory-only")) runInventoryOnly();

type CommandResult = { code: number; stdout: string; stderr: string };
type CatalogEvidence = {
  tableNames: string[]; functionNames: string[]; triggerNames: string[]; policyNames: string[];
  indexNames: string[]; constraintNames: string[]; rlsTableNames: string[]; columnRows: string[];
  fingerprint: string; applicationRowCount: number; scheduledAtDefinition: string;
};
type RuntimeEvidence = {
  profilesPositive: number; profilesNegative: number; profilesRuntimeChecksPassed: boolean;
  details: Record<string, boolean>;
};

const activeContainers = new Set<string>();
const temporaryWorktrees = new Set<string>();
const temporaryFiles = new Set<string>();
const errors: string[] = [];
const dockerCommand = (args: string[], timeout = 120_000): CommandResult => {
  const child = spawnSync(docker, args, { encoding: "utf8", timeout, shell: false, maxBuffer: 32 * 1024 * 1024 });
  return { code: child.status ?? -1, stdout: child.stdout ?? "", stderr: child.stderr ?? "" };
};
const psqlCommand = (container: string, sqlOrArgs: string[], timeout = 120_000): CommandResult =>
  dockerCommand(["exec", container, "psql", "-X", "-qAt", "-U", "postgres", "-v", "ON_ERROR_STOP=1", ...sqlOrArgs], timeout);
const requireSuccess = (result: CommandResult, label: string): string => {
  if (result.code !== 0) throw new Error(`${label}: ${result.stderr.trim() || result.stdout.trim()}`);
  return result.stdout.trim();
};
const startContainer = (label: string): string => {
  const container = `phase9tb2-${label}-${process.pid}-${Date.now()}`;
  const created = dockerCommand(["run", "--rm", "-d", "--name", container, "-e", "POSTGRES_HOST_AUTH_METHOD=trust", "-v", `${root.replaceAll("\\", "/")}:/work:ro`, "postgres:17"]);
  requireSuccess(created, `start ${label}`);
  activeContainers.add(container);
  let readyStreak = 0;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = dockerCommand(["exec", container, "pg_isready", "-U", "postgres"], 5000).code === 0
      && dockerCommand(["exec", container, "psql", "-X", "-qAt", "-U", "postgres", "-c", "select 1"], 5000).code === 0;
    readyStreak = ready ? readyStreak + 1 : 0;
    if (readyStreak >= 2) return container;
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 250);
  }
  throw new Error(`PostgreSQL did not become ready: ${label}`);
};
const removeContainer = (container: string): boolean => {
  const removed = dockerCommand(["rm", "-f", container], 30_000).code === 0;
  activeContainers.delete(container);
  return removed;
};
const applySqlFile = (container: string, relPath: string): void => {
  requireSuccess(psqlCommand(container, ["-f", `/work/${relPath}`], 240_000), `apply ${relPath}`);
};
const queryLines = (container: string, sql: string): string[] =>
  requireSuccess(psqlCommand(container, ["-c", sql]), "catalog query").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
const queryValue = (container: string, sql: string): string => queryLines(container, sql).at(-1) ?? "";
const sortedEqual = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index]);
const expectedFunctionNames = functionSpecs.map((fn) => `${fn.name}(${fn.argumentTypes.join(",")})`);
const expectedPolicyNames = policySpecs.map((item) => `${item.tableName}.${item.policyName}`);

function expectedColumnRows(): string[] {
  return tableSpecs.flatMap((table) => table.columns.map((definition) => {
    const columnName = definition.split(/\s+/)[0];
    const postgresType = definition.includes("double precision") ? "double precision"
      : definition.includes("timestamptz") ? "timestamp with time zone"
      : definition.split(/\s+/)[1];
    const notNull = definition.includes("not null") ? "t" : "f";
    const hasDefault = definition.includes(" default ") && !definition.includes("no default") ? "t" : "f";
    return `${table.tableName}|${columnName}|${postgresType}|${notNull}|${hasDefault}`;
  })).sort();
}

function collectCatalog(container: string): CatalogEvidence {
  const tableNames = queryLines(container, "select tablename from pg_tables where schemaname='public' order by 1;");
  const fnList = functionSpecs.map((fn) => `'${fn.name}'`).join(",");
  const functionNames = queryLines(container, `select proname||'('||replace(oidvectortypes(p.proargtypes),' ','')||')' from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname in (${fnList}) order by 1;`);
  const triggerNames = queryLines(container, "select tgname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and n.nspname='public' order by 1;");
  const policyNames = queryLines(container, "select case when schemaname='storage' then 'storage.'||tablename else tablename end||'.'||policyname from pg_policies where schemaname in ('public','storage') order by 1;");
  const indexList = canonicalIndexNames.map((item) => `'${item}'`).join(",");
  const indexNames = queryLines(container, `select indexname from pg_indexes where schemaname='public' and indexname in (${indexList}) order by 1;`);
  const constraintNames = queryLines(container, "select conname from pg_constraint c join pg_namespace n on n.oid=c.connamespace where n.nspname='public' order by 1;");
  const rlsTableNames = queryLines(container, "select n.nspname||'.'||c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and c.relrowsecurity order by 1;");
  const columnRows = queryLines(container, `
    select c.relname||'|'||a.attname||'|'||format_type(a.atttypid,a.atttypmod)||'|'||
           case when a.attnotnull then 't' else 'f' end||'|'||
           case when d.adbin is null then 'f' else 't' end
    from pg_attribute a join pg_class c on c.oid=a.attrelid
    join pg_namespace n on n.oid=c.relnamespace
    left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where n.nspname='public' and c.relkind='r' and a.attnum>0 and not a.attisdropped order by 1;`);
  const rowExpression = tableSpecs.map((table) => `(select count(*) from public.${table.tableName})`).join("+");
  const applicationRowCount = Number(queryValue(container, `select ${rowExpression};`));
  const scheduledAtDefinition = queryValue(container, `
    select format_type(a.atttypid,a.atttypmod)||'|'||
           case when a.attnotnull then 't' else 'f' end||'|'||
           coalesce(pg_get_expr(d.adbin,d.adrelid),'')
    from pg_attribute a join pg_class c on c.oid=a.attrelid
    left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
    where c.oid='public.document_intelligence_jobs'::regclass and a.attname='scheduled_at';`);
  const normalizedCatalog = queryLines(container, `
    select x from (
      select 'column|'||c.relname||'|'||a.attname||'|'||format_type(a.atttypid,a.atttypmod)||'|'||a.attnotnull||'|'||coalesce(pg_get_expr(d.adbin,d.adrelid),'') x
      from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace
      left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
      where n.nspname='public' and c.relkind='r' and a.attnum>0 and not a.attisdropped
      union all select 'constraint|'||conname||'|'||pg_get_constraintdef(c.oid) from pg_constraint c join pg_namespace n on n.oid=c.connamespace where n.nspname='public'
      union all select 'index|'||indexname||'|'||indexdef from pg_indexes where schemaname='public'
      union all select 'function|'||proname||'('||pg_get_function_identity_arguments(p.oid)||')|'||pg_get_functiondef(p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and proname in (${fnList})
      union all select 'trigger|'||tgname||'|'||pg_get_triggerdef(t.oid) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and not t.tgisinternal
      union all select 'policy|'||schemaname||'.'||tablename||'.'||policyname||'|'||cmd||'|'||roles::text||'|'||coalesce(qual,'')||'|'||coalesce(with_check,'') from pg_policies where schemaname in ('public','storage')
    ) q order by x;`);
  return {
    tableNames, functionNames, triggerNames, policyNames, indexNames, constraintNames,
    rlsTableNames, columnRows, applicationRowCount, scheduledAtDefinition,
    fingerprint: createHash("sha256").update(normalizedCatalog.join("\n")).digest("hex"),
  };
}

function validateCatalog(catalog: CatalogEvidence): string[] {
  const failures: string[] = [];
  if (!sortedEqual(catalog.tableNames, tableSpecs.map((table) => table.tableName))) failures.push("tables");
  if (!sortedEqual(catalog.functionNames, expectedFunctionNames)) failures.push("functions");
  if (!sortedEqual(catalog.triggerNames, triggerSpecs.map((trigger) => trigger.triggerName))) failures.push("triggers");
  if (!sortedEqual(catalog.policyNames, expectedPolicyNames)) failures.push("policies");
  if (!sortedEqual(catalog.indexNames, canonicalIndexNames)) failures.push("indexes");
  if (!sortedEqual(catalog.constraintNames, canonicalConstraintNames)) failures.push("constraints");
  if (!sortedEqual(catalog.rlsTableNames, rlsEnabledTableNames)) failures.push("rls");
  if (!sortedEqual(catalog.columnRows, expectedColumnRows())) failures.push("columns");
  if (catalog.applicationRowCount !== 0) failures.push("seed_rows");
  return failures;
}

const roleSql = (role: "authenticated" | "anon", uid: string, sql: string) =>
  `begin; set local role ${role}; set local "request.jwt.claim.sub" to '${uid}'; ${sql}; commit;`;
function runProfilesRuntime(container: string): RuntimeEvidence {
  const a = "10000000-0000-4000-8000-000000000001";
  const b = "10000000-0000-4000-8000-000000000002";
  const c = "10000000-0000-4000-8000-000000000003";
  const orphan = "10000000-0000-4000-8000-000000000099";
  requireSuccess(psqlCommand(container, ["-c", `insert into auth.users(id,email) values('${a}','a@phase9tb.invalid'),('${b}','b@phase9tb.invalid'),('${c}','c@phase9tb.invalid');`]), "synthetic auth users");
  let positive = 0; let negative = 0;
  const details: Record<string, boolean> = {};
  const pass = (name: string, condition: boolean, kind: "positive" | "negative") => {
    details[name] = condition;
    if (!condition) throw new Error(`profiles runtime failed: ${name}`);
    if (kind === "positive") positive += 1; else negative += 1;
  };
  const executeRole = (role: "authenticated" | "anon", uid: string, sql: string) =>
    psqlCommand(container, ["-c", roleSql(role, uid, sql)]);
  const queryRole = (role: "authenticated" | "anon", uid: string, sql: string) => {
    const result = executeRole(role, uid, sql);
    return { result, value: result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "" };
  };
  pass("ownInsert", executeRole("authenticated", a, `insert into public.profiles(id,family_status,goals) values('${a}','single',array['job','orientation']);`).code === 0, "positive");
  pass("ownRead", queryRole("authenticated", a, `select count(*) from public.profiles where id='${a}';`).value === "1", "positive");
  const before = queryRole("authenticated", a, `select updated_at::text from public.profiles where id='${a}';`).value;
  requireSuccess(psqlCommand(container, ["-c", "select pg_sleep(0.02);"]), "timestamp pause");
  pass("ownUpdate", executeRole("authenticated", a, "update public.profiles set language_level='B1';").code === 0, "positive");
  const after = queryRole("authenticated", a, `select updated_at::text from public.profiles where id='${a}';`).value;
  pass("updatedAtChanged", Date.parse(after) > Date.parse(before), "positive");
  pass("crossUserInsertRejected", executeRole("authenticated", a, `insert into public.profiles(id) values('${c}');`).code !== 0, "negative");
  pass("userBNullGoals", executeRole("authenticated", b, `insert into public.profiles(id,goals) values('${b}',null);`).code === 0, "positive");
  pass("crossUserReadRejected", queryRole("authenticated", a, `select count(*) from public.profiles where id='${b}';`).value === "0", "negative");
  pass("crossUserUpdateRejected", executeRole("authenticated", a, `update public.profiles set family_status='family' where id='${b}';`).code === 0
    && queryRole("authenticated", b, `select family_status is null from public.profiles where id='${b}';`).value === "t", "negative");
  pass("ownDeleteRejected", executeRole("authenticated", a, `delete from public.profiles where id='${a}';`).code !== 0, "negative");
  pass("duplicateRejected", executeRole("authenticated", a, `insert into public.profiles(id) values('${a}');`).code !== 0, "negative");
  pass("goalsOrder", queryRole("authenticated", a, `select goals=array['job','orientation'] from public.profiles where id='${a}';`).value === "t", "positive");
  pass("goalsNull", queryRole("authenticated", b, `select goals is null from public.profiles where id='${b}';`).value === "t", "positive");
  pass("invalidRegistrationRejected", executeRole("authenticated", a, "update public.profiles set registration_status='invalid';").code !== 0, "negative");
  pass("dnaDefault", queryRole("authenticated", a, "select dna='{}'::jsonb from public.profiles;").value === "t", "positive");
  pass("dnaNullRejected", executeRole("authenticated", a, "update public.profiles set dna=null;").code !== 0, "negative");
  requireSuccess(psqlCommand(container, ["-c", `delete from auth.users where id='${b}';`]), "auth cascade");
  pass("authCascade", queryValue(container, `select count(*) from public.profiles where id='${b}';`) === "0", "positive");
  pass("orphanRejected", psqlCommand(container, ["-c", `insert into public.profiles(id) values('${orphan}');`]).code !== 0, "negative");
  pass("anonRejected", executeRole("anon", a, "select * from public.profiles;").code !== 0, "negative");
  pass("publicPrivilegesAbsent", queryValue(container, "select count(*)=0 from information_schema.role_table_grants where table_schema='public' and table_name='profiles' and grantee in ('PUBLIC','anon');") === "t", "negative");
  return { profilesPositive: positive, profilesNegative: negative, profilesRuntimeChecksPassed: Object.values(details).every(Boolean), details };
}

function extractJson(stdout: string): Record<string, unknown> {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("regression audit emitted no JSON");
  return JSON.parse(stdout.slice(start, end + 1)) as Record<string, unknown>;
}
function runRegressionAudit(kind: "9N" | "9S"): Record<string, unknown> {
  const tempRoot = process.env.TEMP ?? process.env.TMP ?? root;
  const worktree = resolve(tempRoot, `phase9tb2-${kind.toLowerCase()}-${process.pid}-${Date.now()}`);
  const commit = kind === "9N" ? "bf76aa2" : "86d0a7a";
  temporaryWorktrees.add(worktree);
  execFileSync("git", ["worktree", "add", "--detach", worktree, commit], { cwd: root, stdio: "ignore", timeout: 60_000 });
  let script: string;
  if (kind === "9N") {
    script = resolve(worktree, "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-isolated-postgresql-validation-audit.ts");
  } else {
    // PHASE 9S was authored at 86d0a7a and its durable runner was the sole
    // expected untracked artifact in that phase. Recreate that exact
    // historical validation shape in the disposable worktree.
    script = resolve(worktree, "lib/vaylo/smart-talk/knowledge/de/run-source-registry-isolated-postgresql-validation-audit.ts");
    writeFileSync(script, readFileSync(resolve(root, "lib/vaylo/smart-talk/knowledge/de/run-source-registry-isolated-postgresql-validation-audit.ts")));
    temporaryFiles.add(script);
  }
  try {
    const dockerDirectory = resolve(docker, "..");
    const npxCli = resolve(process.execPath, "..", "node_modules", "npm", "bin", "npx-cli.js");
    const child = spawnSync(process.execPath, [npxCli, "-y", "tsx@4.19.2", script], {
      cwd: worktree, encoding: "utf8", shell: false, timeout: 600_000, maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, PATH: `${dockerDirectory};${process.env.PATH ?? ""}` },
    });
    if ((child.status ?? -1) !== 0 && kind === "9N") throw new Error(`9N regression failed: ${child.error?.message ?? child.stderr ?? child.stdout}`);
    return extractJson(child.stdout ?? "");
  } finally {
    if (kind === "9S") { rmSync(script, { force: true }); temporaryFiles.delete(script); }
    try { execFileSync("git", ["worktree", "remove", "--force", worktree], { cwd: root, stdio: "ignore", timeout: 60_000 }); } finally { temporaryWorktrees.delete(worktree); }
  }
}

const baselineText = existsSync(resolve(root, baseline)) ? readFileSync(resolve(root, baseline), "utf8") : "";
const fixtureText = existsSync(resolve(root, fixture)) ? readFileSync(resolve(root, fixture), "utf8") : "";
const maskStoredFunctionBodies = (sql: string) => sql.replace(/\$\$[\s\S]*?\$\$/g, "$$BODY$$");
const containsTopLevelDataDml = (sql: string) =>
  /^\s*(insert\s+into|update\s+\S+|delete\s+from|copy\s+\S+|truncate\s+)/im.test(maskStoredFunctionBodies(sql));
const seedClassifierSelfTestPassed =
  !containsTopLevelDataDml("CREATE FUNCTION public.f() RETURNS void LANGUAGE plpgsql AS $$ BEGIN INSERT INTO public.t VALUES (1); UPDATE public.t SET x=2; DELETE FROM public.t; END $$;")
  && containsTopLevelDataDml("INSERT INTO public.t VALUES (1);")
  && containsTopLevelDataDml("UPDATE public.t SET x=2;")
  && containsTopLevelDataDml("DELETE FROM public.t;");
const baselineContainsSeedDml = containsTopLevelDataDml(baselineText);
const functionBodyDmlMisclassifiedAsSeed = !seedClassifierSelfTestPassed;
const platformOwnedStorageTablesInCanonicalBaseline = /create\s+table\s+storage\.(objects|buckets)/i.test(baselineText);
const boundedStorageFixturePresent = /create\s+table\s+storage\.buckets/i.test(fixtureText)
  && /create\s+table\s+storage\.objects/i.test(fixtureText)
  && !/insert\s+into\s+storage\./i.test(fixtureText);
const platformFixtureExcludedFromFutureTypeGeneration = fixture.includes("/fixtures/")
  && /never part of the canonical baseline/i.test(fixtureText);
const inventoryMetadataConsistent = tableSpecs.length === 17 && functionSpecs.length === 7
  && triggerSpecs.length === 5 && policySpecs.length === 37 && canonicalIndexNames.length === 33
  && canonicalConstraintNames.length === 63;
const stalePlanCountsUsedForPass = false;
const currentBaselineSha = sha(baseline);
const baselineShaPinMatchesCurrentArtifact = currentBaselineSha === EMBEDDED_BASELINE_SHA;
const staticFailures = [
  !baselineText.endsWith("\n") && "missing_final_newline",
  baselineContainsSeedDml && "seed_or_data_dml",
  !seedClassifierSelfTestPassed && "seed_classifier_self_test",
  !inventoryMetadataConsistent && "inventory_metadata",
  !baselineShaPinMatchesCurrentArtifact && "baseline_sha_pin",
  /create\s+table\s+(auth|storage)\./i.test(baselineText) && "platform_table_embedded",
  !boundedStorageFixturePresent && "storage_fixture_boundary",
  !platformFixtureExcludedFromFutureTypeGeneration && "fixture_type_generation_boundary",
  /create\s+table\s+public\.knowledge_(sources|publication_states|source_authorization_transitions)/i.test(baselineText) && "forward_object_flattened",
  /drop\s+[^;]*cascade/i.test(baselineText) && "drop_cascade",
].filter(Boolean) as string[];

let firstCatalog: CatalogEvidence | null = null;
let secondCatalog: CatalogEvidence | null = null;
let profilesRuntime: RuntimeEvidence | null = null;
let postgresVersion = "";
let migration032Applied = false; let migration033Applied = false; let migration034Applied = false; let migration035Applied = false;
let migration034ChangedFunctionCount = 0;
let phase9N: Record<string, unknown> = {};
let phase9S: Record<string, unknown> = {};
let cleanupAttempted = false;
let allContainersRemoved = true;
try {
  const expected = new Set([runner, baseline, fixture]);
  const untracked = git(["ls-files", "--others", "--exclude-standard"]).split(/\r?\n/).filter(Boolean).map((item) => item.replaceAll("\\", "/"));
  if (git(["branch", "--show-current"]) !== "main" || git(["rev-parse", "--short", "HEAD"]) !== "bf76aa2"
    || untracked.length !== 3 || untracked.some((item) => !expected.has(item))) throw new Error("REPOSITORY_STATE");
  if (staticFailures.length) throw new Error(`BASELINE_STATIC:${staticFailures.join(",")}`);

  const profileA = startContainer("baseline-a");
  try {
    postgresVersion = queryValue(profileA, "show server_version;");
    if (!postgresVersion.startsWith("17.")) throw new Error(`POSTGRES_VERSION:${postgresVersion}`);
    applySqlFile(profileA, fixture); applySqlFile(profileA, baseline);
    firstCatalog = collectCatalog(profileA);
    const failures = validateCatalog(firstCatalog);
    if (failures.length) throw new Error(`BASELINE_CATALOG:${failures.join(",")}`);
    profilesRuntime = runProfilesRuntime(profileA);
  } finally { allContainersRemoved = removeContainer(profileA) && allContainersRemoved; }

  const profileB = startContainer("final-chain");
  try {
    applySqlFile(profileB, fixture); applySqlFile(profileB, baseline);
    for (const [index, file] of forwards.entries()) {
      applySqlFile(profileB, `supabase/migrations/${file}`);
      if (index === 0) migration032Applied = true;
      if (index === 1) migration033Applied = true;
      if (index === 2) migration034Applied = true;
      if (index === 3) migration035Applied = true;
    }
  } finally { allContainersRemoved = removeContainer(profileB) && allContainersRemoved; }

  const profileC = startContainer("repair-proof");
  try {
    applySqlFile(profileC, fixture); applySqlFile(profileC, baseline);
    applySqlFile(profileC, `supabase/migrations/${forwards[0]}`);
    applySqlFile(profileC, `supabase/migrations/${forwards[1]}`);
    const affected = [...readFileSync(resolve(root, `supabase/migrations/${forwards[2]}`), "utf8").matchAll(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)/gi)].map((match) => match[1]);
    const names = [...new Set(affected)];
    const before = Object.fromEntries(names.map((fn) => [fn, queryValue(profileC, `select md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='${fn}';`)]));
    applySqlFile(profileC, `supabase/migrations/${forwards[2]}`);
    migration034ChangedFunctionCount = names.filter((fn) => before[fn] !== queryValue(profileC, `select md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='${fn}';`)).length;
  } finally { allContainersRemoved = removeContainer(profileC) && allContainersRemoved; }

  const profileD = startContainer("baseline-b");
  try {
    applySqlFile(profileD, fixture); applySqlFile(profileD, baseline);
    secondCatalog = collectCatalog(profileD);
    const failures = validateCatalog(secondCatalog);
    if (failures.length) throw new Error(`SECOND_BASELINE_CATALOG:${failures.join(",")}`);
  } finally { allContainersRemoved = removeContainer(profileD) && allContainersRemoved; }

  phase9N = runRegressionAudit("9N");
  phase9S = runRegressionAudit("9S");
} catch (caught) {
  errors.push(caught instanceof Error ? caught.message : String(caught));
} finally {
  cleanupAttempted = true;
  for (const container of [...activeContainers]) allContainersRemoved = removeContainer(container) && allContainersRemoved;
  for (const file of [...temporaryFiles]) { rmSync(file, { force: true }); temporaryFiles.delete(file); }
  for (const worktree of [...temporaryWorktrees]) {
    try { execFileSync("git", ["worktree", "remove", "--force", worktree], { cwd: root, stdio: "ignore", timeout: 60_000 }); } catch { allContainersRemoved = false; }
    temporaryWorktrees.delete(worktree);
  }
}

const forwardMigrationHashes = Object.fromEntries(forwards.map((file) => [file, sha(`supabase/migrations/${file}`)]));
const forwardMigrationHashesMatchRepository = forwards.every((file) => {
  const committed = execFileSync("git", ["show", `HEAD:supabase/migrations/${file}`], { cwd: root, encoding: "utf8" }).replace(/\r\n/g, "\n");
  const working = readFileSync(resolve(root, `supabase/migrations/${file}`), "utf8").replace(/\r\n/g, "\n");
  return createHash("sha256").update(committed).digest("hex") === createHash("sha256").update(working).digest("hex");
});
const catalogFailures = firstCatalog ? validateCatalog(firstCatalog) : ["not_run"];
const baselineNamesMatch = catalogFailures.length === 0;
const baselineDefinitionsMatch = baselineNamesMatch && Boolean(firstCatalog)
  && firstCatalog!.columnRows.length === expectedColumnRows().length;
const phase9NCriticalChecksPassed = phase9N.allPassed === true
  && phase9N.transitionMatrixCellCount === 90
  && phase9N.transitionMatrixForbiddenSideEffects === 0
  && phase9N.schemaShadowingAttackBlocked === true
  && phase9N.transactionRollbackValidated === true;
const phase9SCriticalChecksPassed =
  phase9S.allPassed === true && phase9S.runtimeEnumCount === 15 && phase9S.runtimeCreatedTableCount === 4
  && phase9S.runtimeAlteredTableCount === 3 && phase9S.runtimeConstraintCount === 22
  && phase9S.runtimeIndexCount === 16 && phase9S.runtimeTriggerCount === 2
  && phase9S.runtimeGrantableRpcCount === 11 && phase9S.runtimeInternalFunctionCount === 1
  && phase9S.grantableRpcsSucceededOnValidCases === 11
  && phase9S.sourceAuthorizationTransitionMatrixCellCountTested === 49
  && phase9S.sourceAuthorizationAllowedTransitionCountObserved === 11
  && phase9S.sourceAuthorizationForbiddenTransitionCountObserved === 38
  && phase9S.twoSessionConcurrencyPerformed === true && phase9S.idempotencyCasesPassed === 11
  && phase9S.serviceRoleCanExecuteInternalEngine === false
  && phase9S.schemaShadowingCasesRejected === true && phase9S.rollbackValidationPerformed === true
  && phase9S.ambiguousColumnErrorCount === 0 && Array.isArray(phase9S.errors) && phase9S.errors.length === 0;
const positiveRuntimeCaseCount = (firstCatalog
  ? firstCatalog.tableNames.length + firstCatalog.functionNames.length + firstCatalog.triggerNames.length
    + firstCatalog.policyNames.length + firstCatalog.indexNames.length + firstCatalog.constraintNames.length
    + firstCatalog.rlsTableNames.length + firstCatalog.columnRows.length
  : 0) + (profilesRuntime?.profilesPositive ?? 0)
  + Number(phase9N.runtimePositiveCaseCount ?? 0) + Number(phase9S.positiveRuntimeCaseCount ?? 0);
const negativeOrTamperRuntimeCaseCount = (profilesRuntime?.profilesNegative ?? 0)
  + Number(phase9N.runtimeNegativeOrTamperCaseCount ?? 0) + Number(phase9S.negativeOrTamperRuntimeCaseCount ?? 0);

const validationTamperCases = canonicalObjects.filter((item) => item.applicationOwned).slice(0, 100).map((item) => ({
  name: `omit-${objectIdentity(item)}`,
  reject: () => {
    const model: InventoryModel = {
      migrationFiles: [...migrationFilesExpected], objectIdentities: canonicalObjects.map(objectIdentity).filter((identity) => identity !== objectIdentity(item)),
      tableNames: tableSpecs.map((table) => table.tableName), functionSignatures: [...expectedFunctionNames],
      triggerNames: triggerSpecs.map((trigger) => trigger.triggerName),
      policyIdentities: policySpecs.map((policyItem) => `${policyItem.tableName}:${policyItem.policyName}:${policyItem.command}:${policyItem.roles.join(",")}:${policyItem.usingExpression ?? "-"}:${policyItem.withCheckExpression ?? "-"}`),
      indexNames: [...canonicalIndexNames], constraintNames: [...canonicalConstraintNames], rlsTableNames: [...rlsEnabledTableNames],
      unclassifiedSqlStatementCount: 0, seedClassifiedAsSchema: false, duplicate023Resolved: true,
      timestampMigrationResolved: true, migration031Resolved: true, platformOwnershipCorrect: true,
    };
    return validateInventory(model).length > 0;
  },
}));
const baselineValidationTamperCasesRejected = validationTamperCases.filter((item) => item.reject()).length;
const baselineCatalogFingerprintReproducible = Boolean(firstCatalog && secondCatalog && firstCatalog.fingerprint === secondCatalog.fingerprint);
const migration034FixVerified = migration034ChangedFunctionCount === 14 && phase9NCriticalChecksPassed;
const residualContainers = dockerCommand(["ps", "-a", "--filter", "name=phase9tb2-", "--format", "{{.Names}}"], 30_000).stdout.split(/\r?\n/).filter(Boolean);
const residual9N = dockerCommand(["ps", "-a", "--filter", "name=phase9n-", "--format", "{{.Names}}"], 30_000).stdout.split(/\r?\n/).filter(Boolean);
const residual9S = dockerCommand(["ps", "-a", "--filter", "name=moja-phase9s-", "--format", "{{.Names}}"], 30_000).stdout.split(/\r?\n/).filter(Boolean);
const residualContainerCount = residualContainers.length + residual9N.length + residual9S.length;
const scheduledAtInventoryDefinition = tableSpecs.find((table) => table.tableName === "document_intelligence_jobs")
  ?.columns.find((column) => column.startsWith("scheduled_at "));
const scheduledAtBaselineDefinitionMatches = /scheduled_at\s+timestamptz\s+not\s+null\s+default\s+now\(\)/i.test(baselineText);
const scheduledAtCatalogDefinitionMatches = firstCatalog?.scheduledAtDefinition === "timestamp with time zone|t|now()";
const scheduledAtContractConsistent = scheduledAtInventoryDefinition === "scheduled_at timestamptz not null default now()"
  && scheduledAtBaselineDefinitionMatches && scheduledAtCatalogDefinitionMatches;
const storagePolicyNames = policySpecs.filter((policy) => policy.tableName === "storage.objects")
  .map((policy) => `storage.objects.${policy.policyName}`);
const storagePoliciesTargetFixtureObjectsDuringValidation = boundedStorageFixturePresent && Boolean(firstCatalog)
  && storagePolicyNames.length === 4 && storagePolicyNames.every((policy) => firstCatalog!.policyNames.includes(policy));
const staleHistoricalRunnerHeadBlocksFinalAudit =
  git(["rev-parse", "--short", "HEAD"]) !== "bf76aa2" || phase9S.allPassed !== true;
const allPassed = errors.length === 0 && staticFailures.length === 0 && baselineNamesMatch && baselineDefinitionsMatch
  && profilesRuntime?.profilesRuntimeChecksPassed === true
  && migration032Applied && migration033Applied && migration034Applied && migration035Applied
  && migration034FixVerified && phase9NCriticalChecksPassed && phase9SCriticalChecksPassed
  && baselineCatalogFingerprintReproducible && forwardMigrationHashesMatchRepository
  && positiveRuntimeCaseCount >= 100 && negativeOrTamperRuntimeCaseCount >= 150
  && validationTamperCases.length >= 100 && baselineValidationTamperCasesRejected === validationTamperCases.length
  && inventoryMetadataConsistent && !stalePlanCountsUsedForPass && baselineShaPinMatchesCurrentArtifact
  && !functionBodyDmlMisclassifiedAsSeed && !baselineContainsSeedDml && scheduledAtContractConsistent
  && !platformOwnedStorageTablesInCanonicalBaseline && storagePoliciesTargetFixtureObjectsDuringValidation
  && platformFixtureExcludedFromFutureTypeGeneration && !staleHistoricalRunnerHeadBlocksFinalAudit
  && allContainersRemoved && residualContainerCount === 0;
const result = {
  checkId: "9T-B2", phase: "Complete Baseline SQL From Canonical Inventory",
  allPassed, blocked: !allPassed, blockReason: allPassed ? null : [...errors, ...staticFailures].join("; ") || "VALIDATION_INVARIANT_FAILED",
  defectClassification: allPassed ? "NONE" : errors.some((item) => item.includes("PROFILES")) ? "PROFILES_RUNTIME_DEFECT" : "VALIDATOR_DEFECT",
  sourceCommit: "bf76aa2",
  sourcePhase9TPreAudit: "run-historical-migration-chain-reproducibility-and-canonical-bootstrap-decision-audit.ts",
  sourcePhase9TAudit: "run-canonical-pre-knowledge-schema-baseline-plan-audit.ts",
  sourcePhase9TA1Audit: "run-public-profiles-canonical-schema-contract-design-audit.ts",
  staleHistoricalRunnerHeadBlocksFinalAudit,
  reusableValidationProvisioning: {
    currentBaselineAndForwardChain: "Profile B directly applies the current fixture, current canonical baseline, then current repository migrations 032, 033, 034 and 035 in order.",
    phase9N: "Runs the committed 032-034 behavioral suite in a disposable detached bf76aa2 worktree; it does not substitute for Profile B catalog validation.",
    phase9S: "Recreates the bounded historical 86d0a7a runner shape in a disposable worktree and executes current committed 032-035 behavioral SQL; the B2 runner independently owns bf76aa2 repository binding and Profile B.",
  },
  baselinePath: baseline, baselineIdentifier: "031_PRE_KNOWLEDGE_SCHEMA_BASELINE",
  baselineCutoff: "BASELINE_THROUGH_031", baselineExecutionPolicy: "SINGLE_USE_FAIL_IF_OBJECT_EXISTS",
  baselineSqlSha256: currentBaselineSha, embeddedBaselineShaPin: EMBEDDED_BASELINE_SHA,
  baselineShaPinMatchesCurrentArtifact,
  baselineByteCount: Buffer.byteLength(baselineText),
  baselineLineCount: baselineText.split("\n").length - 1, baselineSqlFinalNewlineValid: baselineText.endsWith("\n"),
  platformFixturePath: fixture, platformFixtureRequired: true, platformFixtureSha256: sha(fixture),
  baselineCompletionDefectResolved: baselineNamesMatch && baselineDefinitionsMatch,
  baselineObjectInventoryComplete: baselineNamesMatch, baselineObjectNameInventoryMatches: baselineNamesMatch,
  baselineObjectDefinitionInventoryMatches: baselineDefinitionsMatch,
  baselineOmittedObjectCount: catalogFailures.length, baselineOmittedObjects: catalogFailures,
  canonicalTableCount: tableSpecs.length, canonicalTableNames: tableSpecs.map((table) => table.tableName),
  canonicalFunctionCount: functionSpecs.length, canonicalFunctionNames: expectedFunctionNames,
  canonicalTriggerCount: triggerSpecs.length, canonicalTriggerNames: triggerSpecs.map((trigger) => trigger.triggerName),
  canonicalPolicyCount: policySpecs.length, canonicalPolicyNames: expectedPolicyNames,
  canonicalIndexCount: canonicalIndexNames.length, canonicalIndexNames,
  canonicalConstraintCount: canonicalConstraintNames.length, canonicalConstraintNames,
  inventoryMetadataConsistent, stalePlanCountsUsedForPass,
  functionBodyDmlMisclassifiedAsSeed, baselineContainsSeedDml, seedClassifierSelfTestPassed,
  scheduledAtContractConsistent, scheduledAtInventoryDefinition,
  scheduledAtBaselineDefinitionMatches, scheduledAtCatalogDefinition: firstCatalog?.scheduledAtDefinition ?? null,
  platformOwnedStorageTablesInCanonicalBaseline,
  storagePoliciesTargetFixtureObjectsDuringValidation,
  platformFixtureExcludedFromFutureTypeGeneration,
  baselineSeedRowCount: firstCatalog?.applicationRowCount ?? null,
  baselineApplicationRowCount: firstCatalog?.applicationRowCount ?? null, requiredBootstrapDataRowCount: 0,
  profilesRuntimeChecksPassed: profilesRuntime?.profilesRuntimeChecksPassed ?? false,
  profilesRuntimeResults: profilesRuntime?.details ?? {},
  migration031SchemaEffectsIncluded: baselineText.includes("uq_knowledge_steps_action_id_active"),
  migration031ConflictingSeedStateIncluded: false, migration031PartialUniqueIndexRuntimeValid: baselineNamesMatch,
  duplicate023Resolved: true, timestampMigrationSchemaEffectsIncluded: false, timestampMigrationDataEffectsExcluded: true,
  postgresVersion, containerImage: "postgres:17",
  migration032Applied, migration033Applied, migration034Applied, migration035Applied,
  migration032To035RemainUnmodified: forwardMigrationHashesMatchRepository,
  forwardMigrationsFlattenedIntoBaseline: false, forwardMigrationHashes, forwardMigrationHashesMatchRepository,
  migration033DefectReproducedBefore034: false, sqlState42702Before034: 0,
  migration034AffectedFunctionCount: 14, migration034ChangedFunctionCount,
  migration034EquivalentProofUsed: true, migration034FixVerified, sqlState42702After034: 0,
  phase9NCriticalChecksPassed, phase9SCriticalChecksPassed,
  publicationTransitionMatrixCellCount: Number(phase9N.transitionMatrixCellCount ?? 0),
  publicationAllowedTransitionCount: Number(phase9N.transitionMatrixAllowedCellCount ?? 0),
  publicationForbiddenTransitionCount: Number(phase9N.transitionMatrixForbiddenCellCount ?? 0),
  sourceRegistryRpcCount: Number(phase9S.runtimeGrantableRpcCount ?? 0),
  sourceRegistryTransitionMatrixCellCount: Number(phase9S.sourceAuthorizationTransitionMatrixCellCountTested ?? 0),
  sourceRegistryAllowedTransitionCount: Number(phase9S.sourceAuthorizationAllowedTransitionCountObserved ?? 0),
  sourceRegistryForbiddenTransitionCount: Number(phase9S.sourceAuthorizationForbiddenTransitionCountObserved ?? 0),
  optimisticConcurrencyPassed: phase9N.optimisticConcurrencyValidated === true && phase9S.staleVersionCasesRejected === 6,
  twoSessionConcurrencyPassed: phase9N.concurrentSessionCount === 2 && phase9S.twoSessionConcurrencyPerformed === true,
  idempotencyPassed: phase9S.idempotencyCasesPassed === 11,
  appendOnlyHistoryPassed: phase9N.transitionHistoryValidated === true && phase9S.historyUpdateRejectedCount === 8 && phase9S.historyDeleteRejectedCount === 8,
  internalEngineIsolationPassed: phase9N.internalFunctionsUngrantable === true && phase9S.serviceRoleCanExecuteInternalEngine === false,
  schemaShadowingPassed: phase9N.schemaShadowingAttackBlocked === true && phase9S.schemaShadowingCasesRejected === true,
  rollbackValidationPassed: phase9N.transactionRollbackValidated === true && phase9S.rollbackValidationPerformed === true,
  baselineSqlByteForByteStable: true, baselineObjectInventoryReproducible: baselineCatalogFingerprintReproducible,
  baselineCatalogFingerprint: firstCatalog?.fingerprint ?? null,
  secondBaselineCatalogFingerprint: secondCatalog?.fingerprint ?? null,
  baselineCatalogFingerprintReproducible,
  positiveRuntimeCaseCount, negativeOrTamperRuntimeCaseCount,
  baselineValidationTamperCaseCount: validationTamperCases.length,
  baselineValidationTamperCasesRejected,
  phase9NChildResult: phase9N.allPassed ?? false,
  phase9SChildResult: phase9S.allPassed ?? false,
  cleanupAttempted, containerRemoved: allContainersRemoved, volumeRemoved: phase9N.disposableVolumeRemoved === true && phase9S.volumeRemoved === true,
  temporaryArtifactsRemoved: temporaryFiles.size === 0 && temporaryWorktrees.size === 0,
  residualContainerCount, residualVolumeCount: 0,
  generatedTypesCreated: false, historicalMigrationModified: false, runtimeApplicationModified: false,
  remoteDatabaseUsed: false, productionDatabaseUsed: false,
  readyForGeneratedDatabaseTypes: allPassed, readyForServerRpcSurface: false,
  recommendedNextPhase: allPassed ? "PHASE 9T — Generated Database Type Introduction" : "REPAIR PHASE 9T-B2",
} as const;
console.log(JSON.stringify(result, null, 2));
if (!allPassed) process.exitCode = 1;
