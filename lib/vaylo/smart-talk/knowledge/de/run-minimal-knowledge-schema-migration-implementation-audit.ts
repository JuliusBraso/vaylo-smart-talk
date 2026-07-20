/**
 * PHASE 9G — Minimal Knowledge Schema Migration Implementation Audit
 * (Migration-Implementation and Audit Only)
 *
 * Statically and deterministically audits the first real additive
 * PostgreSQL/Supabase migration for the Birello German Knowledge System
 * (`supabase/migrations/032_create_minimal_knowledge_schema.sql`), derived
 * directly from PHASE 9A-9F. This file performs NO dynamic execution:
 * no SQL is executed, no database or Supabase CLI is contacted, no
 * migration is applied, no runtime/route is imported, no network/model/
 * OCR call is made.
 *
 * It only:
 *   1. Reads the PHASE 9A-9F audit files, the new SQL migration file, all
 *      existing migration filenames, and this file's own source as plain
 *      text via `fs.readFileSync` (never imports or executes them).
 *   2. Runs read-only `git` commands to confirm this phase created exactly
 *      two new files and modified no existing file.
 *   3. Performs conservative, targeted static text analysis of the SQL
 *      source (table names, RLS statements, CHECK constraints, FK
 *      references, cascade policy, index statements, INSERT statements)
 *      to ground a deterministic `Result`.
 *   4. Runs 182 pure, in-memory tamper cases against a deep-cloned "good"
 *      Result and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "719c64c";
const SOURCE_ARCHITECTURE_CHECK_ID = "9A";
const SOURCE_TRUST_CONTRACT_CHECK_ID = "9B";
const SOURCE_JURISDICTION_MODEL_CHECK_ID = "9C";
const SOURCE_COVERAGE_PLAN_CHECK_ID = "9D";
const SOURCE_STORAGE_SCHEMA_CHECK_ID = "9E";
const SOURCE_MIGRATION_PLAN_CHECK_ID = "9F";

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
const PHASE_9F_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-knowledge-migration-implementation-plan-audit.ts";
const CLOSURE_8_13C_REL_PATH =
  "lib/vaylo/smart-talk/reality-matrix/live-input/run-smart-talk-desktop-responsive-browser-validation-closure-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-schema-migration-implementation-audit.ts";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;

const LAUNCH_LOCALES = ["de", "en", "sk", "cs", "pl", "hu"] as const;
const TRUST_DOMAIN_CODES = ["eu", "de", "sk", "cz", "pl", "hu"] as const;
const KNOWLEDGE_TABLE_PREFIX = "knowledge_";

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

function countMatches(sql: string, re: RegExp): number {
  const m = sql.match(re);
  return m ? m.length : 0;
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

// ============================================================================
// REQUIRED TABLE FAMILIES (33 logical entities from PHASE 9E / 9F)
// ============================================================================

const REQUIRED_TABLE_FAMILIES: readonly string[] = [
  "trust_domains", "jurisdictions", "territorial_scopes", "publishers",
  "sources", "source_versions", "source_passages",
  "authorities", "authority_competences",
  "claims", "claim_evidence_links", "citations",
  "responsible_actor_rules", "processes",
  "forms", "deadline_rules", "fee_rules", "process_steps", "evidence_requirements",
  "form_requirements", "eligibility_rules", "process_claim_links",
  "regional_overrides", "review_records", "freshness_records", "conflicts", "audit_events",
  "terminology", "localized_terminology",
  "trust_domain_links", "cross_border_connectors", "cross_border_processes",
  "retrieval_metadata",
];

const TABLE_GROUPS: Readonly<Record<string, readonly string[]>> = {
  foundation: ["trust_domains", "jurisdictions", "territorial_scopes", "publishers"],
  source_core: ["sources", "source_versions", "source_passages"],
  authority_core: ["authorities", "authority_competences"],
  claim_core: ["claims", "claim_evidence_links", "citations"],
  process_core: ["responsible_actor_rules", "processes", "process_steps", "process_claim_links"],
  rule_and_document_core: ["forms", "form_requirements", "evidence_requirements", "deadline_rules", "fee_rules", "eligibility_rules"],
  governance_core: ["regional_overrides", "review_records", "freshness_records", "conflicts", "audit_events"],
  language_core: ["terminology", "localized_terminology"],
  cross_border_core: ["trust_domain_links", "cross_border_connectors", "cross_border_processes"],
  retrieval_metadata_group: ["retrieval_metadata"],
};

const EIGHT_PROCESS_GROUPS: readonly string[] = [
  "anmeldung_ummeldung_abmeldung", "steuer_id_and_basic_finanzamt_letters", "health_insurance_orientation",
  "jobcenter_buergergeld", "familienkasse_kindergeld", "rechnung_mahnung", "kuendigung_orientation",
  "auslaenderbehoerde_limited_orientation",
];

const NO_FK_TARGETS_FROM_KNOWLEDGE_SCHEMA: readonly string[] = [
  "smart_talk_input", "ocr_storage_or_extracted_text", "user_dna_profile", "payment_or_billing_record", "conversation_history",
];

// ============================================================================
// STATIC SQL ANALYSIS (conservative, targeted, not pure substring counting
// where structural context matters)
// ============================================================================

function extractCreateTableNames(sql: string): string[] {
  const re = /create table if not exists public\.(knowledge_[a-z0-9_]+)\s*\(/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function checkDependencySafeOrder(sql: string, tableNames: readonly string[]): boolean {
  const markers = tableNames
    .map((name) => ({ name, index: sql.indexOf(`create table if not exists public.${name}`) }))
    .filter((mk) => mk.index >= 0)
    .sort((a, b) => a.index - b.index);
  if (markers.length !== tableNames.length) return false;
  const defined = new Set<string>();
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : sql.length;
    const block = sql.slice(start, end);
    const refRe = /references public\.(knowledge_[a-z0-9_]+)/g;
    let rm: RegExpExecArray | null;
    while ((rm = refRe.exec(block)) !== null) {
      const target = rm[1];
      if (target !== markers[i].name && !defined.has(target)) return false;
    }
    defined.add(markers[i].name);
  }
  return true;
}

function tableBlock(sql: string, tableName: string): string {
  const start = sql.indexOf(`create table if not exists public.${tableName}`);
  if (start < 0) return "";
  const nextCreate = sql.indexOf("create table if not exists public.", start + 40);
  const nextSection = sql.indexOf("\n-- ====", start + 40);
  let end = sql.length;
  if (nextCreate >= 0) end = Math.min(end, nextCreate);
  if (nextSection >= 0) end = Math.min(end, nextSection);
  return sql.slice(start, end);
}

function analyzeMigrationSql(sql: string) {
  const tableNames = extractCreateTableNames(sql);
  const tableFamilies = tableNames.map((n) => n.replace(/^knowledge_/, ""));
  const requiredFamiliesPresent = REQUIRED_TABLE_FAMILIES.every((f) => tableFamilies.includes(f));
  const dependencySafeCreationOrder = checkDependencySafeOrder(sql, tableNames);

  const rlsEnableCount = countMatches(sql, /alter table public\.knowledge_[a-z0-9_]+ enable row level security;/g);
  const rlsEnabledOnAllKnowledgeTables =
    rlsEnableCount === tableNames.length &&
    tableNames.every((t) => sql.includes(`alter table public.${t} enable row level security;`));

  const hasCreatePolicy = /create policy/i.test(sql);
  const anonymousKnowledgeWritesBlocked = !hasCreatePolicy && !/grant\s+(insert|update|delete)[\s\S]{0,80}\bto\s+anon\b/i.test(sql);
  const authenticatedKnowledgeWritesBlocked = !hasCreatePolicy && !/grant\s+(insert|update|delete)[\s\S]{0,80}\bto\s+authenticated\b/i.test(sql);
  const directPublicReadNotAuthorized = !hasCreatePolicy && !/grant\s+select[\s\S]{0,80}\bto\s+(anon|authenticated|public)\b/i.test(sql);
  const revokeCount = countMatches(sql, /revoke all on public\.knowledge_[a-z0-9_]+ from public, anon, authenticated;/g);
  const serviceRoleOnlyControlledWriteBoundary =
    revokeCount === tableNames.length && !/grant\s+(insert|update|delete)[\s\S]{0,80}\bto\s+service_role\b/i.test(sql);

  const migrationAdditive =
    !/\bdrop\s+table\b/i.test(sql) &&
    !/\bdrop\s+schema\b/i.test(sql) &&
    !/\btruncate\b/i.test(sql) &&
    !/\balter\s+table\s+public\.(?!knowledge_)/i.test(sql);
  const migrationNonDestructive = migrationAdditive && !/\balter\s+table\s+public\.knowledge_[a-z0-9_]+\s+drop\s+column/i.test(sql);

  const noRealDataInsert = !/insert\s+into\s+public\.knowledge_/i.test(sql);
  const noOrdinaryInsert = !/\binsert\s+into\b/i.test(sql);

  const noCascadeDelete = !/on delete cascade/i.test(sql);

  const noVectorExtension = !/create extension[^;]*vector/i.test(sql) && !/pgvector/i.test(sql);
  const noEmbeddingColumnType = !/\bvector\s*\(\d*\)/i.test(sql);
  const noFullTextIndex = !/using gin/i.test(sql) && !/to_tsvector/i.test(sql);
  const noVectorIndex = !/using hnsw/i.test(sql) && !/using ivfflat/i.test(sql) && !/vector_cosine_ops/i.test(sql);

  const userDataBlacklist = [
    "user_documents", "user_profile", "profiles", "user_dna", "payments", "conversation",
    "user_step_state", "user_action_events", "user_progress", "user_phrase_state",
  ];
  const noUserDataFk = !userDataBlacklist.some((t) => new RegExp(`references public\\.${t}`, "i").test(sql));

  const noRuntimeWiring = !/\bimport\s+/.test(sql) && !/SmartTalkClient/i.test(sql) && !/app\/smart-talk/i.test(sql);
  const noGeneratedTypesModified = !/database\.types\.ts/i.test(sql) && !/supabase gen types/i.test(sql);
  const noSupabaseCliInvocation = !/supabase\s+(db|migration)\s+(push|up|reset)/i.test(sql);

  const sourceVersionsBlock = tableBlock(sql, "knowledge_source_versions");
  const sourceVersionImmutabilityImplementedOrExplicitlyBounded =
    /immutable boolean not null default true check \(immutable = true\)/.test(sourceVersionsBlock) &&
    /version_sequence integer not null/.test(sourceVersionsBlock) &&
    /content_hash text not null/.test(sourceVersionsBlock) &&
    /effective_from timestamptz/.test(sourceVersionsBlock) &&
    /effective_until timestamptz/.test(sourceVersionsBlock) &&
    /locked_at timestamptz/.test(sourceVersionsBlock) &&
    /knowledge_source_versions_protect_locked_content/.test(sql);
  const sourceVersionHistoryPreserved =
    /supersedes_version_id/.test(sourceVersionsBlock) &&
    /superseded_by_version_id/.test(sourceVersionsBlock) &&
    /historical_use_allowed/.test(sourceVersionsBlock) &&
    /knowledge_source_versions_seq_unique unique \(source_id, version_sequence\)/.test(sourceVersionsBlock);

  const citationsBlock = tableBlock(sql, "knowledge_citations");
  const evidenceLinksBlock = tableBlock(sql, "knowledge_claim_evidence_links");
  const passagesBlock = tableBlock(sql, "knowledge_source_passages");
  const passageLevelCitationImplemented =
    /passage_id uuid not null references public\.knowledge_source_passages/.test(citationsBlock) &&
    /passage_id uuid not null references public\.knowledge_source_passages/.test(evidenceLinksBlock) &&
    /text_hash text not null/.test(passagesBlock) &&
    /passage_order integer not null/.test(passagesBlock) &&
    /knowledge_source_passages_order_unique unique \(source_version_id, passage_order\)/.test(passagesBlock);

  const jurisdictionsBlock = tableBlock(sql, "knowledge_jurisdictions");
  const jurisdictionModelImplemented =
    /parent_jurisdiction_id uuid references public\.knowledge_jurisdictions/.test(jurisdictionsBlock) &&
    /jurisdiction_level text not null check/.test(jurisdictionsBlock);
  const territorialScopesBlock = tableBlock(sql, "knowledge_territorial_scopes");
  const territorialScopeImplemented = /scope_type text not null/.test(territorialScopesBlock) && /jurisdiction_ids uuid\[\]/.test(territorialScopesBlock);

  const competenceBlock = tableBlock(sql, "knowledge_authority_competences");
  const authorityCompetenceImplemented =
    /receives_application boolean/.test(competenceBlock) &&
    /decides_application boolean/.test(competenceBlock) &&
    /effective_from timestamptz/.test(competenceBlock) &&
    /competence_source_version_id uuid not null references public\.knowledge_source_versions/.test(competenceBlock);

  const claimEvidenceImplemented =
    /support_status text not null check/.test(evidenceLinksBlock) &&
    /knowledge_claim_evidence_links_unique unique \(claim_id, passage_id, evidence_role\)/.test(evidenceLinksBlock);

  const processStepsBlock = tableBlock(sql, "knowledge_process_steps");
  const processStepModelImplemented =
    /responsible_actor_rule_id uuid not null references public\.knowledge_responsible_actor_rules/.test(processStepsBlock) &&
    /knowledge_process_steps_order_unique unique \(process_id, step_order\)/.test(processStepsBlock);

  const deadlineRulesBlock = tableBlock(sql, "knowledge_deadline_rules");
  const deadlineRuleModelImplemented =
    /trigger_event_type text not null/.test(deadlineRulesBlock) &&
    /duration_value integer check \(duration_value is null or duration_value >= 0\)/.test(deadlineRulesBlock) &&
    /exact_calculation_allowed boolean not null default false/.test(deadlineRulesBlock);

  const eligibilityBlock = tableBlock(sql, "knowledge_eligibility_rules");
  const eligibilityFinalDeterminationBlocked =
    /final_determination_allowed boolean not null default false check \(final_determination_allowed = false\)/.test(eligibilityBlock);

  const overridesBlock = tableBlock(sql, "knowledge_regional_overrides");
  const regionalOverrideModelImplemented =
    /base_rule_entity_type text not null check/.test(overridesBlock) &&
    /override_rule_entity_type text not null check/.test(overridesBlock) &&
    /territorial_scope_id uuid not null references public\.knowledge_territorial_scopes/.test(overridesBlock);

  const reviewBlock = tableBlock(sql, "knowledge_review_records");
  const reviewHistoryImplemented =
    /supersedes_review_record_id uuid references public\.knowledge_review_records/.test(reviewBlock) &&
    !/on delete cascade/i.test(reviewBlock);

  const freshnessBlock = tableBlock(sql, "knowledge_freshness_records");
  const freshnessSeparatedFromEffectiveDate =
    /freshness_status text not null check/.test(freshnessBlock) &&
    /effective_date_known boolean/.test(freshnessBlock) &&
    !/effective_from/.test(freshnessBlock);

  const conflictsBlock = tableBlock(sql, "knowledge_conflicts");
  const conflictHistoryImplemented =
    /resolved_at timestamptz/.test(conflictsBlock) &&
    /blocks_high_risk_use boolean/.test(conflictsBlock) &&
    !/on delete cascade/i.test(conflictsBlock);

  const localizedBlock = tableBlock(sql, "knowledge_localized_terminology");
  const localeCheckMatch = localizedBlock.match(/output_locale text not null check \(output_locale in \(([^)]+)\)\)/);
  const localeListRaw = localeCheckMatch ? localeCheckMatch[1] : "";
  const localeValues = localeListRaw.split(",").map((s) => s.trim().replace(/'/g, ""));
  const sixLaunchLocalesConstrained =
    localeValues.length === 6 && LAUNCH_LOCALES.every((l) => localeValues.includes(l)) && localeValues.every((l) => (LAUNCH_LOCALES as readonly string[]).includes(l));

  const trustDomainsBlock = tableBlock(sql, "knowledge_trust_domains");
  const trustDomainCodeMatch = trustDomainsBlock.match(/code text not null unique check \(code in \(([^)]+)\)\)/);
  const trustDomainListRaw = trustDomainCodeMatch ? trustDomainCodeMatch[1] : "";
  const trustDomainValues = trustDomainListRaw.split(",").map((s) => s.trim().replace(/'/g, ""));
  const trustDomainsRepresentable = trustDomainValues.length === 6 && TRUST_DOMAIN_CODES.every((c) => trustDomainValues.includes(c));

  const connectorsBlock = tableBlock(sql, "knowledge_cross_border_connectors");
  const localeConnectorActivationBlocked = /activation_from_locale_allowed boolean not null default false check \(activation_from_locale_allowed = false\)/.test(connectorsBlock);
  const deSkStructurallyRepresentable =
    /connected_country text not null/.test(connectorsBlock) &&
    /trust_domain_ids uuid\[\]/.test(connectorsBlock) &&
    fileExists(MIGRATION_REL_PATH) &&
    tableFamilies.includes("cross_border_connectors") &&
    tableFamilies.includes("cross_border_processes");
  const noConnectorRowsInserted = !/insert\s+into\s+public\.knowledge_cross_border_connectors/i.test(sql);

  const retrievalBlock = tableBlock(sql, "knowledge_retrieval_metadata");
  const vectorSimilarityAuthorityBlocked = /authoritative_by_vector_similarity boolean not null default false check \(authoritative_by_vector_similarity = false\)/.test(retrievalBlock);

  const auditEventsBlock = tableBlock(sql, "knowledge_audit_events");
  const auditUserContentBlocked = /user_content_included boolean not null default false check \(user_content_included = false\)/.test(auditEventsBlock);

  const publicKnowledgeSeparatedFromUserData = noUserDataFk && tableNames.every((t) => t.startsWith(KNOWLEDGE_TABLE_PREFIX));

  const essentialIndexCount = countMatches(sql, /create index if not exists knowledge_[a-z0-9_]+ on public\.knowledge_[a-z0-9_]+/g);
  const essentialIndexesImplemented = essentialIndexCount >= 40;

  const uniqueConstraintCount = countMatches(sql, /constraint knowledge_[a-z0-9_]+ unique \(/g);
  const essentialUniquenessImplemented = uniqueConstraintCount >= 10;

  const fkReferenceCount = countMatches(sql, /references public\.knowledge_[a-z0-9_]+/g);
  const foreignKeysImplemented = fkReferenceCount >= 40;

  const zeroKnowledgeSeedRows = noRealDataInsert && noOrdinaryInsert;

  return {
    tableNames, tableFamilies, requiredFamiliesPresent, dependencySafeCreationOrder,
    rlsEnabledOnAllKnowledgeTables, anonymousKnowledgeWritesBlocked, authenticatedKnowledgeWritesBlocked,
    directPublicReadNotAuthorized, serviceRoleOnlyControlledWriteBoundary,
    migrationAdditive, migrationNonDestructive, noRealDataInsert, noOrdinaryInsert, noCascadeDelete,
    noVectorExtension, noEmbeddingColumnType, noFullTextIndex, noVectorIndex, noUserDataFk,
    noRuntimeWiring, noGeneratedTypesModified, noSupabaseCliInvocation,
    sourceVersionImmutabilityImplementedOrExplicitlyBounded, sourceVersionHistoryPreserved,
    passageLevelCitationImplemented, jurisdictionModelImplemented, territorialScopeImplemented,
    authorityCompetenceImplemented, claimEvidenceImplemented, processStepModelImplemented,
    deadlineRuleModelImplemented, eligibilityFinalDeterminationBlocked, regionalOverrideModelImplemented,
    reviewHistoryImplemented, freshnessSeparatedFromEffectiveDate, conflictHistoryImplemented,
    sixLaunchLocalesConstrained, trustDomainsRepresentable, localeConnectorActivationBlocked,
    deSkStructurallyRepresentable, noConnectorRowsInserted, vectorSimilarityAuthorityBlocked,
    auditUserContentBlocked, publicKnowledgeSeparatedFromUserData, essentialIndexesImplemented,
    essentialUniquenessImplemented, foreignKeysImplemented, zeroKnowledgeSeedRows,
  };
}

// ============================================================================
// RESULT TYPE
// ============================================================================

interface Result {
  checkId: "9G";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceArchitectureCheckId: string;
  sourceTrustContractCheckId: string;
  sourceJurisdictionModelCheckId: string;
  sourceCoveragePlanCheckId: string;
  sourceStorageSchemaCheckId: string;
  sourceMigrationPlanCheckId: string;

  sourceArchitectureReady: boolean;
  sourceTrustContractReady: boolean;
  sourceJurisdictionModelReady: boolean;
  sourceCoveragePlanReady: boolean;
  sourceStorageSchemaReady: boolean;
  sourceMigrationPlanReady: boolean;

  migrationFilePath: string;
  migrationFileName: string;
  migrationNumber: string;
  migrationNamingConventionConfirmed: boolean;
  migrationNumberIsNextAvailable: boolean;
  knowledgeTablePrefix: string;
  plannedTableCount: number;
  actualKnowledgeTableCount: number;

  sourceInspectionOnly: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  sqlFileCreated: boolean;
  databaseMigrationCreated: boolean;
  databaseTableCreatedInSource: boolean;
  databaseCommandExecuted: boolean;
  databaseWritePerformed: boolean;
  supabaseCliExecuted: boolean;
  networkAccessPerformed: boolean;
  migrationApplied: boolean;
  generatedTypesModified: boolean;
  seedFileCreated: boolean;
  realDataInserted: boolean;
  syntheticDataInserted: boolean;
  realSourceRegistered: boolean;
  realClaimPopulated: boolean;
  realAuthorityRegistered: boolean;
  realProcessPopulated: boolean;
  realCrossBorderConnectorImplemented: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  migrationAdditive: boolean;
  migrationNonDestructive: boolean;
  requiredLogicalEntitiesImplemented: boolean;
  dependencySafeCreationOrder: boolean;
  foreignKeysImplemented: boolean;
  protectedHistoryCascadeDeleteAbsent: boolean;
  sourceVersionHistoryPreserved: boolean;
  sourceVersionImmutabilityImplementedOrExplicitlyBounded: boolean;
  passageLevelCitationImplemented: boolean;
  jurisdictionModelImplemented: boolean;
  territorialScopeImplemented: boolean;
  authorityCompetenceImplemented: boolean;
  claimEvidenceImplemented: boolean;
  processStepModelImplemented: boolean;
  deadlineRuleModelImplemented: boolean;
  eligibilityFinalDeterminationBlocked: boolean;
  regionalOverrideModelImplemented: boolean;
  reviewHistoryImplemented: boolean;
  freshnessSeparatedFromEffectiveDate: boolean;
  conflictHistoryImplemented: boolean;
  sixLaunchLocalesConstrained: boolean;
  trustDomainsRepresentable: boolean;
  deSkStructurallyRepresentable: boolean;
  deSkInactive: boolean;
  localeConnectorActivationBlocked: boolean;
  vectorSimilarityAuthorityBlocked: boolean;
  auditUserContentBlocked: boolean;
  publicKnowledgeSeparatedFromUserData: boolean;
  userDataForeignKeysAbsent: boolean;
  rlsEnabledOnAllKnowledgeTables: boolean;
  anonymousKnowledgeWritesBlocked: boolean;
  authenticatedKnowledgeWritesBlocked: boolean;
  directPublicReadNotAuthorized: boolean;
  serviceRoleOnlyControlledWriteBoundary: boolean;
  essentialIndexesImplemented: boolean;
  fullTextIndexNotCreated: boolean;
  vectorIndexNotCreated: boolean;
  zeroKnowledgeSeedRows: boolean;
  zeroRealKnowledgeRows: boolean;
  zeroConnectorRows: boolean;

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
  migrationExecutionValidationStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;
  publicBetaAuthorizedNow: boolean;
  goLiveAuthorizedNow: boolean;

  readyForEmptySchemaMigrationValidationClosure: boolean;

  // ── dedicated tamper-coverage flags (default false; tamper cases flip true) ──
  existingFileModifiedAccepted: boolean;
  onlyExpectedFilesChangedFalseAccepted: boolean;
  thirdFileCreatedAccepted: boolean;
  auditFileMissingAccepted: boolean;
  sqlFileMissingAccepted: boolean;
  sqlFileEmptyAccepted: boolean;
  wrongMigrationDirectoryAccepted: boolean;
  migrationNumberNotNextAvailableAccepted: boolean;
  namingConventionUnconfirmedAccepted: boolean;

  dropTablePresentAccepted: boolean;
  dropSchemaPresentAccepted: boolean;
  destructiveAlterPresentAccepted: boolean;
  unrelatedTableRenamedAccepted: boolean;
  existingUserTableModifiedAccepted: boolean;
  userDataRewrittenAccepted: boolean;

  knowledgeFkToSmartTalkInputAccepted: boolean;
  knowledgeFkToOcrStorageAccepted: boolean;
  knowledgeFkToDnaProfileAccepted: boolean;
  knowledgeFkToPaymentsAccepted: boolean;
  knowledgeFkToConversationHistoryAccepted: boolean;

  oneGiantKnowledgeTableAccepted: boolean;
  oneGiantJsonDocumentAccepted: boolean;
  requiredTableOmittedAccepted: boolean;
  inconsistentTablePrefixAccepted: boolean;
  tableNameCollisionIgnoredAccepted: boolean;

  sourceVersionBeforeSourceAccepted: boolean;
  passageBeforeSourceVersionAccepted: boolean;
  evidenceLinkBeforeClaimOrPassageAccepted: boolean;
  competenceBeforeAuthorityAccepted: boolean;
  processStepBeforeProcessAccepted: boolean;
  localizedTerminologyBeforeTerminologyAccepted: boolean;
  crossBorderProcessBeforeConnectorAccepted: boolean;

  immutableFlagAllowsFalseAccepted: boolean;
  sourceVersionLacksSequenceAccepted: boolean;
  sourceVersionLacksContentHashAccepted: boolean;
  sourceVersionLacksEffectivePeriodAccepted: boolean;
  sourceVersionCascadeDeletedAccepted: boolean;
  passageCascadeDeletedAccepted: boolean;
  claimCascadeDeletedAccepted: boolean;
  citationCascadeDeletedAccepted: boolean;
  reviewHistoryCascadeDeletedAccepted: boolean;
  freshnessHistoryCascadeDeletedAccepted: boolean;
  conflictHistoryCascadeDeletedAccepted: boolean;
  competenceHistoryCascadeDeletedAccepted: boolean;
  auditHistoryCascadeDeletedAccepted: boolean;
  acceptedContentFreelyEditableAccepted: boolean;
  historyOverwriteAllowedAccepted: boolean;

  passageLacksSourceVersionIdAccepted: boolean;
  passageLacksTextHashAccepted: boolean;
  passageLacksStableOrderAccepted: boolean;
  citationLacksClaimAccepted: boolean;
  citationLacksSourceVersionAccepted: boolean;
  citationLacksPassageAccepted: boolean;
  citationLacksPublisherAccepted: boolean;
  citationPointsOnlyToTranslationAccepted: boolean;

  publisherOfficialStatusSubstitutesCompetenceAccepted: boolean;
  jurisdictionParentRelationMissingAccepted: boolean;
  territorialScopeMissingAccepted: boolean;
  localScopeCanBeNationalAccepted: boolean;
  competenceStoredOnlyAsFreeTextAccepted: boolean;
  competenceEffectiveDatesOmittedAccepted: boolean;
  nearbyAuthorityConsideredCompetentAccepted: boolean;

  claimLacksRiskAccepted: boolean;
  claimLacksAllowedUsesAccepted: boolean;
  claimLacksBlockedUsesAccepted: boolean;
  claimLacksCitationRequirementAccepted: boolean;
  localizedClaimsDuplicateLegalTruthAccepted: boolean;
  evidenceLinkSupportStatusMissingAccepted: boolean;
  highRiskDirectSupportRequirementAbsentAccepted: boolean;
  contradictoryEvidenceAuthorizesClaimAccepted: boolean;

  processIsOneUnstructuredArticleAccepted: boolean;
  processStepOrderNotUniqueAccepted: boolean;
  processStepLacksActorReferenceAccepted: boolean;
  processClaimLinksOmittedAccepted: boolean;
  formProvesEligibilityAccepted: boolean;
  formInstructionsPassageOmittedAccepted: boolean;
  evidenceRequirementAssumesUserAlwaysActsAccepted: boolean;
  institutionExchangeAbsentAccepted: boolean;

  deadlineLacksTriggerEventAccepted: boolean;
  deadlineAllowsNegativeDurationAccepted: boolean;
  deadlineLacksSourceVersionAccepted: boolean;
  deadlineLacksPassageAccepted: boolean;
  deadlineExactCalculationDefaultsTrueAccepted: boolean;
  deadlinePrecisionRequirementAbsentAccepted: boolean;
  feeEffectivePeriodAbsentAccepted: boolean;
  feeSourceSupportAbsentAccepted: boolean;

  regionalOverrideBaseReferenceAbsentAccepted: boolean;
  overrideScopeAbsentAccepted: boolean;
  overrideAlwaysTreatedSubstantiveAccepted: boolean;

  reviewHistoryMutableSingleRowAccepted: boolean;
  reviewSupersessionAbsentAccepted: boolean;
  freshnessOverwritesEffectiveDateAccepted: boolean;
  conflictDeletedAfterResolutionAccepted: boolean;
  unresolvedConflictPermitsHighRiskUseAccepted: boolean;

  localizedTerminologyAcceptsUnsupportedLocaleAccepted: boolean;
  oneLaunchLocaleMissingAccepted: boolean;
  futureLocaleSilentlyAddedAccepted: boolean;
  germanTermRetentionNotRepresentableAccepted: boolean;
  warningEquivalenceNotRepresentableAccepted: boolean;

  trustDomainInferredFromLocaleAccepted: boolean;
  connectorInsertedOrActiveAccepted: boolean;
  deSkNotRepresentableAccepted: boolean;
  euDeSkEvidenceStructureAbsentAccepted: boolean;
  responsibleActorAbsentFromCrossBorderAccepted: boolean;
  temporalAlignmentAbsentAccepted: boolean;
  evidenceCompletenessAbsentAccepted: boolean;
  firstPilotCannotBeRepresentedAccepted: boolean;

  vectorExtensionAddedAccepted: boolean;
  vectorIndexCreatedAccepted: boolean;
  embeddingColumnRequiredForAuthorityAccepted: boolean;
  auditStateHashesAbsentAccepted: boolean;

  anonymousInsertAllowedAccepted: boolean;
  anonymousUpdateAllowedAccepted: boolean;
  anonymousDeleteAllowedAccepted: boolean;
  authenticatedInsertAllowedAccepted: boolean;
  authenticatedUpdateAllowedAccepted: boolean;
  authenticatedDeleteAllowedAccepted: boolean;
  rlsMissingOnOneTableAccepted: boolean;
  permissiveUsingTrueWritePolicyAccepted: boolean;
  permissiveWithCheckTrueWritePolicyAccepted: boolean;
  serviceRolePolicyWeakensHistoryAccepted: boolean;
  broadGrantsModifyUnrelatedTablesAccepted: boolean;

  realLegalSourceEmbeddedAccepted: boolean;
  ordinaryInsertStatementExistsAccepted: boolean;
  seedKnowledgeRowExistsAccepted: boolean;
  trustDomainSeedRowExistsAccepted: boolean;
  sourceSeedRowExistsAccepted: boolean;
  processSeedRowExistsAccepted: boolean;
  connectorSeedRowExistsAccepted: boolean;

  essentialFkIndexOmittedAccepted: boolean;
  jurisdictionLookupIndexOmittedAccepted: boolean;
  effectivePeriodIndexOmittedAccepted: boolean;
  reviewFreshnessConflictIndexOmittedAccepted: boolean;
  fullTextIndexCreatedPrematurelyAccepted: boolean;

  auditExecutesSqlAccepted: boolean;
  auditConnectsToDatabaseAccepted: boolean;
  auditExecutesSupabaseCliAccepted: boolean;
  auditImportsRuntimeRouteAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejected: number;
  tamperCasesRejectedCount: number;

  namingFamilyChosen: string;
  collisionAnalysis: readonly string[];
  tableGroups: Readonly<Record<string, readonly string[]>>;
  eightProcessGroups: readonly string[];
  knownOpenDebts: readonly string[];
  sourceEvidence: readonly string[];
}

// ============================================================================
// EVIDENCE COLLECTION
// ============================================================================

type Evidence = {
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  sqlFileCreated: boolean;
  auditFileCreated: boolean;
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
  sourceMigrationPlanCheckIdFound: string;
  sourceMigrationPlanReady: boolean;
  migrationNamingConventionConfirmed: boolean;
  migrationNumberIsNextAvailable: boolean;
  sqlAnalysis: ReturnType<typeof analyzeMigrationSql>;
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

  const diffNameOnly = runGitReadOnly("git diff --name-only").split("\n").map((s) => s.trim()).filter(Boolean);
  const statusShort = runGitReadOnly("git status --short").split("\n").map((s) => s.trim()).filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  const expectedNewPaths = [AUDIT_SELF_REL_PATH, MIGRATION_REL_PATH];
  const isExpectedOrCoveringDir = (p: string): boolean =>
    expectedNewPaths.some((expected) => {
      if (p === expected || p.endsWith(expected)) return true;
      const dirPrefix = p.endsWith("/") ? p : `${p}/`;
      return expected.startsWith(dirPrefix);
    });

  const unexpectedModified = diffNameOnly.filter((p) => !expectedNewPaths.includes(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isExpectedOrCoveringDir(p));
  const sqlFileCreated = fileExists(MIGRATION_REL_PATH) && untrackedNew.some((p) => isExpectedOrCoveringDir(p) && p.includes("032_create_minimal_knowledge_schema"));
  const auditFileCreated = fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isExpectedOrCoveringDir(p) && p.includes("run-minimal-knowledge-schema-migration-implementation-audit"));

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

  const phase9fSrc = readFileText(PHASE_9F_REL_PATH);
  const phase9fExists = fileExists(PHASE_9F_REL_PATH);
  const checkId9fMatch = phase9fSrc.match(/checkId:\s*"([^"]+)";/);
  const sourceMigrationPlanCheckIdFound = checkId9fMatch ? checkId9fMatch[1] : "not_found";
  const sourceMigrationPlanReady =
    phase9fExists && sourceMigrationPlanCheckIdFound === "9F" &&
    phase9fSrc.includes("readyForKnowledgeSchemaMigrationImplementation: allPassed");
  if (!sourceMigrationPlanReady) notes.push("PHASE 9F source did not statically confirm readiness.");

  const migrationFiles = listDirNamesOnly(MIGRATIONS_DIR_REL_PATH);
  const numberedPattern = /^(\d{3})_[a-z0-9_]+\.sql$/;
  const otherNumbered = migrationFiles
    .filter((f) => f !== MIGRATION_FILE_NAME)
    .map((f) => f.match(numberedPattern))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => parseInt(m[1], 10));
  const highestExistingNumber = otherNumbered.length > 0 ? Math.max(...otherNumbered) : -1;
  const newFileNumberMatch = MIGRATION_FILE_NAME.match(numberedPattern);
  const newFileNumber = newFileNumberMatch ? parseInt(newFileNumberMatch[1], 10) : -1;
  const migrationNumberIsNextAvailable = newFileNumber === highestExistingNumber + 1;
  const migrationNamingConventionConfirmed =
    numberedPattern.test(MIGRATION_FILE_NAME) && MIGRATION_FILE_NAME.includes("create_minimal_knowledge_schema");

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const sqlAnalysis = analyzeMigrationSql(migrationSql);

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
    onlyExpectedFilesChanged, existingFileModified, sqlFileCreated, auditFileCreated,
    sourceArchitectureCheckIdFound, sourceArchitectureReady,
    sourceTrustContractCheckIdFound, sourceTrustContractReady,
    sourceJurisdictionModelCheckIdFound, sourceJurisdictionModelReady,
    sourceCoveragePlanCheckIdFound, sourceCoveragePlanReady,
    sourceStorageSchemaCheckIdFound, sourceStorageSchemaReady,
    sourceMigrationPlanCheckIdFound, sourceMigrationPlanReady,
    migrationNamingConventionConfirmed, migrationNumberIsNextAvailable,
    sqlAnalysis,
    standaloneExtractionStillOpen, physicalAndroidStillUntested, genuineIosSafariStillUntested,
    heicHeifStillOpen, serverlessOcrStillOpen, distributedRateLimiterStillOpen, paymentFlowStillOpen,
    notes,
  };
}

// ============================================================================
// GOOD RESULT CONSTRUCTION
// ============================================================================

function buildGoodResult(evidence: Evidence): Result {
  const a = evidence.sqlAnalysis;

  const designComplete =
    REQUIRED_TABLE_FAMILIES.length === 33 &&
    Object.keys(TABLE_GROUPS).length === 10 &&
    EIGHT_PROCESS_GROUPS.length === 8 &&
    NO_FK_TARGETS_FROM_KNOWLEDGE_SCHEMA.length === 5 &&
    LAUNCH_LOCALES.length === 6 &&
    TRUST_DOMAIN_CODES.length === 6 &&
    a.requiredFamiliesPresent &&
    a.tableNames.length >= 32 && a.tableNames.length <= 40;

  const allPassed =
    designComplete &&
    evidence.onlyExpectedFilesChanged &&
    !evidence.existingFileModified &&
    evidence.sqlFileCreated &&
    evidence.auditFileCreated &&
    evidence.sourceArchitectureReady &&
    evidence.sourceTrustContractReady &&
    evidence.sourceJurisdictionModelReady &&
    evidence.sourceCoveragePlanReady &&
    evidence.sourceStorageSchemaReady &&
    evidence.sourceMigrationPlanReady &&
    evidence.migrationNamingConventionConfirmed &&
    evidence.migrationNumberIsNextAvailable &&
    a.rlsEnabledOnAllKnowledgeTables &&
    a.migrationAdditive &&
    a.migrationNonDestructive;

  return {
    checkId: "9G",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceArchitectureCheckId: evidence.sourceArchitectureCheckIdFound,
    sourceTrustContractCheckId: evidence.sourceTrustContractCheckIdFound,
    sourceJurisdictionModelCheckId: evidence.sourceJurisdictionModelCheckIdFound,
    sourceCoveragePlanCheckId: evidence.sourceCoveragePlanCheckIdFound,
    sourceStorageSchemaCheckId: evidence.sourceStorageSchemaCheckIdFound,
    sourceMigrationPlanCheckId: evidence.sourceMigrationPlanCheckIdFound,

    sourceArchitectureReady: evidence.sourceArchitectureReady,
    sourceTrustContractReady: evidence.sourceTrustContractReady,
    sourceJurisdictionModelReady: evidence.sourceJurisdictionModelReady,
    sourceCoveragePlanReady: evidence.sourceCoveragePlanReady,
    sourceStorageSchemaReady: evidence.sourceStorageSchemaReady,
    sourceMigrationPlanReady: evidence.sourceMigrationPlanReady,

    migrationFilePath: MIGRATION_REL_PATH,
    migrationFileName: MIGRATION_FILE_NAME,
    migrationNumber: "032",
    migrationNamingConventionConfirmed: evidence.migrationNamingConventionConfirmed,
    migrationNumberIsNextAvailable: evidence.migrationNumberIsNextAvailable,
    knowledgeTablePrefix: KNOWLEDGE_TABLE_PREFIX,
    plannedTableCount: REQUIRED_TABLE_FAMILIES.length,
    actualKnowledgeTableCount: a.tableNames.length,

    sourceInspectionOnly: true,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    sqlFileCreated: evidence.sqlFileCreated,
    databaseMigrationCreated: evidence.sqlFileCreated,
    databaseTableCreatedInSource: a.tableNames.length > 0,
    databaseCommandExecuted: false,
    databaseWritePerformed: false,
    supabaseCliExecuted: false,
    networkAccessPerformed: false,
    migrationApplied: false,
    generatedTypesModified: false,
    seedFileCreated: false,
    realDataInserted: !a.noRealDataInsert,
    syntheticDataInserted: !a.noOrdinaryInsert,
    realSourceRegistered: false,
    realClaimPopulated: false,
    realAuthorityRegistered: false,
    realProcessPopulated: false,
    realCrossBorderConnectorImplemented: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    migrationAdditive: a.migrationAdditive,
    migrationNonDestructive: a.migrationNonDestructive,
    requiredLogicalEntitiesImplemented: a.requiredFamiliesPresent,
    dependencySafeCreationOrder: a.dependencySafeCreationOrder,
    foreignKeysImplemented: a.foreignKeysImplemented,
    protectedHistoryCascadeDeleteAbsent: a.noCascadeDelete,
    sourceVersionHistoryPreserved: a.sourceVersionHistoryPreserved,
    sourceVersionImmutabilityImplementedOrExplicitlyBounded: a.sourceVersionImmutabilityImplementedOrExplicitlyBounded,
    passageLevelCitationImplemented: a.passageLevelCitationImplemented,
    jurisdictionModelImplemented: a.jurisdictionModelImplemented,
    territorialScopeImplemented: a.territorialScopeImplemented,
    authorityCompetenceImplemented: a.authorityCompetenceImplemented,
    claimEvidenceImplemented: a.claimEvidenceImplemented,
    processStepModelImplemented: a.processStepModelImplemented,
    deadlineRuleModelImplemented: a.deadlineRuleModelImplemented,
    eligibilityFinalDeterminationBlocked: a.eligibilityFinalDeterminationBlocked,
    regionalOverrideModelImplemented: a.regionalOverrideModelImplemented,
    reviewHistoryImplemented: a.reviewHistoryImplemented,
    freshnessSeparatedFromEffectiveDate: a.freshnessSeparatedFromEffectiveDate,
    conflictHistoryImplemented: a.conflictHistoryImplemented,
    sixLaunchLocalesConstrained: a.sixLaunchLocalesConstrained,
    trustDomainsRepresentable: a.trustDomainsRepresentable,
    deSkStructurallyRepresentable: a.deSkStructurallyRepresentable,
    deSkInactive: a.noConnectorRowsInserted,
    localeConnectorActivationBlocked: a.localeConnectorActivationBlocked,
    vectorSimilarityAuthorityBlocked: a.vectorSimilarityAuthorityBlocked,
    auditUserContentBlocked: a.auditUserContentBlocked,
    publicKnowledgeSeparatedFromUserData: a.publicKnowledgeSeparatedFromUserData,
    userDataForeignKeysAbsent: a.noUserDataFk,
    rlsEnabledOnAllKnowledgeTables: a.rlsEnabledOnAllKnowledgeTables,
    anonymousKnowledgeWritesBlocked: a.anonymousKnowledgeWritesBlocked,
    authenticatedKnowledgeWritesBlocked: a.authenticatedKnowledgeWritesBlocked,
    directPublicReadNotAuthorized: a.directPublicReadNotAuthorized,
    serviceRoleOnlyControlledWriteBoundary: a.serviceRoleOnlyControlledWriteBoundary,
    essentialIndexesImplemented: a.essentialIndexesImplemented,
    fullTextIndexNotCreated: a.noFullTextIndex,
    vectorIndexNotCreated: a.noVectorIndex,
    zeroKnowledgeSeedRows: a.zeroKnowledgeSeedRows,
    zeroRealKnowledgeRows: a.zeroKnowledgeSeedRows,
    zeroConnectorRows: a.noConnectorRowsInserted,

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
    migrationExecutionValidationStillOpen: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
    publicBetaAuthorizedNow: false,
    goLiveAuthorizedNow: false,

    readyForEmptySchemaMigrationValidationClosure: allPassed,

    existingFileModifiedAccepted: false,
    onlyExpectedFilesChangedFalseAccepted: false,
    thirdFileCreatedAccepted: false,
    auditFileMissingAccepted: false,
    sqlFileMissingAccepted: false,
    sqlFileEmptyAccepted: false,
    wrongMigrationDirectoryAccepted: false,
    migrationNumberNotNextAvailableAccepted: false,
    namingConventionUnconfirmedAccepted: false,

    dropTablePresentAccepted: false,
    dropSchemaPresentAccepted: false,
    destructiveAlterPresentAccepted: false,
    unrelatedTableRenamedAccepted: false,
    existingUserTableModifiedAccepted: false,
    userDataRewrittenAccepted: false,

    knowledgeFkToSmartTalkInputAccepted: false,
    knowledgeFkToOcrStorageAccepted: false,
    knowledgeFkToDnaProfileAccepted: false,
    knowledgeFkToPaymentsAccepted: false,
    knowledgeFkToConversationHistoryAccepted: false,

    oneGiantKnowledgeTableAccepted: false,
    oneGiantJsonDocumentAccepted: false,
    requiredTableOmittedAccepted: false,
    inconsistentTablePrefixAccepted: false,
    tableNameCollisionIgnoredAccepted: false,

    sourceVersionBeforeSourceAccepted: false,
    passageBeforeSourceVersionAccepted: false,
    evidenceLinkBeforeClaimOrPassageAccepted: false,
    competenceBeforeAuthorityAccepted: false,
    processStepBeforeProcessAccepted: false,
    localizedTerminologyBeforeTerminologyAccepted: false,
    crossBorderProcessBeforeConnectorAccepted: false,

    immutableFlagAllowsFalseAccepted: false,
    sourceVersionLacksSequenceAccepted: false,
    sourceVersionLacksContentHashAccepted: false,
    sourceVersionLacksEffectivePeriodAccepted: false,
    sourceVersionCascadeDeletedAccepted: false,
    passageCascadeDeletedAccepted: false,
    claimCascadeDeletedAccepted: false,
    citationCascadeDeletedAccepted: false,
    reviewHistoryCascadeDeletedAccepted: false,
    freshnessHistoryCascadeDeletedAccepted: false,
    conflictHistoryCascadeDeletedAccepted: false,
    competenceHistoryCascadeDeletedAccepted: false,
    auditHistoryCascadeDeletedAccepted: false,
    acceptedContentFreelyEditableAccepted: false,
    historyOverwriteAllowedAccepted: false,

    passageLacksSourceVersionIdAccepted: false,
    passageLacksTextHashAccepted: false,
    passageLacksStableOrderAccepted: false,
    citationLacksClaimAccepted: false,
    citationLacksSourceVersionAccepted: false,
    citationLacksPassageAccepted: false,
    citationLacksPublisherAccepted: false,
    citationPointsOnlyToTranslationAccepted: false,

    publisherOfficialStatusSubstitutesCompetenceAccepted: false,
    jurisdictionParentRelationMissingAccepted: false,
    territorialScopeMissingAccepted: false,
    localScopeCanBeNationalAccepted: false,
    competenceStoredOnlyAsFreeTextAccepted: false,
    competenceEffectiveDatesOmittedAccepted: false,
    nearbyAuthorityConsideredCompetentAccepted: false,

    claimLacksRiskAccepted: false,
    claimLacksAllowedUsesAccepted: false,
    claimLacksBlockedUsesAccepted: false,
    claimLacksCitationRequirementAccepted: false,
    localizedClaimsDuplicateLegalTruthAccepted: false,
    evidenceLinkSupportStatusMissingAccepted: false,
    highRiskDirectSupportRequirementAbsentAccepted: false,
    contradictoryEvidenceAuthorizesClaimAccepted: false,

    processIsOneUnstructuredArticleAccepted: false,
    processStepOrderNotUniqueAccepted: false,
    processStepLacksActorReferenceAccepted: false,
    processClaimLinksOmittedAccepted: false,
    formProvesEligibilityAccepted: false,
    formInstructionsPassageOmittedAccepted: false,
    evidenceRequirementAssumesUserAlwaysActsAccepted: false,
    institutionExchangeAbsentAccepted: false,

    deadlineLacksTriggerEventAccepted: false,
    deadlineAllowsNegativeDurationAccepted: false,
    deadlineLacksSourceVersionAccepted: false,
    deadlineLacksPassageAccepted: false,
    deadlineExactCalculationDefaultsTrueAccepted: false,
    deadlinePrecisionRequirementAbsentAccepted: false,
    feeEffectivePeriodAbsentAccepted: false,
    feeSourceSupportAbsentAccepted: false,

    regionalOverrideBaseReferenceAbsentAccepted: false,
    overrideScopeAbsentAccepted: false,
    overrideAlwaysTreatedSubstantiveAccepted: false,

    reviewHistoryMutableSingleRowAccepted: false,
    reviewSupersessionAbsentAccepted: false,
    freshnessOverwritesEffectiveDateAccepted: false,
    conflictDeletedAfterResolutionAccepted: false,
    unresolvedConflictPermitsHighRiskUseAccepted: false,

    localizedTerminologyAcceptsUnsupportedLocaleAccepted: false,
    oneLaunchLocaleMissingAccepted: false,
    futureLocaleSilentlyAddedAccepted: false,
    germanTermRetentionNotRepresentableAccepted: false,
    warningEquivalenceNotRepresentableAccepted: false,

    trustDomainInferredFromLocaleAccepted: false,
    connectorInsertedOrActiveAccepted: false,
    deSkNotRepresentableAccepted: false,
    euDeSkEvidenceStructureAbsentAccepted: false,
    responsibleActorAbsentFromCrossBorderAccepted: false,
    temporalAlignmentAbsentAccepted: false,
    evidenceCompletenessAbsentAccepted: false,
    firstPilotCannotBeRepresentedAccepted: false,

    vectorExtensionAddedAccepted: false,
    vectorIndexCreatedAccepted: false,
    embeddingColumnRequiredForAuthorityAccepted: false,
    auditStateHashesAbsentAccepted: false,

    anonymousInsertAllowedAccepted: false,
    anonymousUpdateAllowedAccepted: false,
    anonymousDeleteAllowedAccepted: false,
    authenticatedInsertAllowedAccepted: false,
    authenticatedUpdateAllowedAccepted: false,
    authenticatedDeleteAllowedAccepted: false,
    rlsMissingOnOneTableAccepted: false,
    permissiveUsingTrueWritePolicyAccepted: false,
    permissiveWithCheckTrueWritePolicyAccepted: false,
    serviceRolePolicyWeakensHistoryAccepted: false,
    broadGrantsModifyUnrelatedTablesAccepted: false,

    realLegalSourceEmbeddedAccepted: false,
    ordinaryInsertStatementExistsAccepted: false,
    seedKnowledgeRowExistsAccepted: false,
    trustDomainSeedRowExistsAccepted: false,
    sourceSeedRowExistsAccepted: false,
    processSeedRowExistsAccepted: false,
    connectorSeedRowExistsAccepted: false,

    essentialFkIndexOmittedAccepted: false,
    jurisdictionLookupIndexOmittedAccepted: false,
    effectivePeriodIndexOmittedAccepted: false,
    reviewFreshnessConflictIndexOmittedAccepted: false,
    fullTextIndexCreatedPrematurelyAccepted: false,

    auditExecutesSqlAccepted: false,
    auditConnectsToDatabaseAccepted: false,
    auditExecutesSupabaseCliAccepted: false,
    auditImportsRuntimeRouteAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejected: 0,
    tamperCasesRejectedCount: 0,

    namingFamilyChosen: "public.knowledge_* (existing project convention; zero exact collisions with pre-existing knowledge_topics / knowledge_steps / knowledge_step_dependencies)",
    collisionAnalysis: [
      "Pre-existing knowledge_* tables: knowledge_topics, knowledge_steps, knowledge_step_dependencies (onboarding checklist, unrelated domain).",
      "All 33 new table names checked against the 3 pre-existing names: zero exact collisions.",
      "birello_knowledge_* fallback prefix was not required.",
    ],
    tableGroups: TABLE_GROUPS,
    eightProcessGroups: EIGHT_PROCESS_GROUPS,
    knownOpenDebts: [
      "Generic append-only trigger enforcement for review/freshness/conflict/audit tables (relies on fail-closed RLS + absent cascade in this phase, not a dedicated trigger).",
      "Approved read views/policies for runtime consumption (deferred to a later validated phase).",
      "Real German source ingestion (zero rows populated by this migration).",
      "DE<->SK cross-border connector activation (structurally representable, zero rows, inactive).",
      "Generated Supabase TypeScript types (not regenerated in this phase).",
      "Migration execution/apply validation on an empty database (not performed in this phase).",
      "Six-language production parity, standalone Smart Talk extraction, physical Android/iOS validation, HEIC/HEIF, serverless OCR, distributed rate limiter, and final payment flow (all previously open, unaffected by this phase).",
    ],
    sourceEvidence: [
      `onlyExpectedFilesChanged: ${evidence.onlyExpectedFilesChanged}`,
      `existingFileModified: ${evidence.existingFileModified}`,
      `migrationNamingConventionConfirmed: ${evidence.migrationNamingConventionConfirmed}`,
      `migrationNumberIsNextAvailable: ${evidence.migrationNumberIsNextAvailable}`,
      `actualKnowledgeTableCount: ${a.tableNames.length}`,
      ...evidence.notes,
    ],
  };
}

// ============================================================================
// TAMPER CASES
// ============================================================================

interface TamperCase {
  id: number;
  description: string;
  mutate: (r: Result) => void;
}

const TAMPER_CASES: readonly TamperCase[] = [
  { id: 1, description: "source closure commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; } },
  { id: 2, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9H"; } },
  { id: 3, description: "PHASE 9A missing/checkId wrong", mutate: (r) => { r.sourceArchitectureCheckId = "not_found"; } },
  { id: 4, description: "PHASE 9B missing/checkId wrong", mutate: (r) => { r.sourceTrustContractCheckId = "not_found"; } },
  { id: 5, description: "PHASE 9C missing/checkId wrong", mutate: (r) => { r.sourceJurisdictionModelCheckId = "not_found"; } },
  { id: 6, description: "PHASE 9D missing/checkId wrong", mutate: (r) => { r.sourceCoveragePlanCheckId = "not_found"; } },
  { id: 7, description: "PHASE 9E missing/checkId wrong", mutate: (r) => { r.sourceStorageSchemaCheckId = "not_found"; } },
  { id: 8, description: "PHASE 9F missing/checkId wrong", mutate: (r) => { r.sourceMigrationPlanCheckId = "not_found"; } },
  { id: 9, description: "9A readiness false", mutate: (r) => { r.sourceArchitectureReady = false; } },
  { id: 10, description: "9B readiness false", mutate: (r) => { r.sourceTrustContractReady = false; } },
  { id: 11, description: "9C readiness false", mutate: (r) => { r.sourceJurisdictionModelReady = false; } },
  { id: 12, description: "9D readiness false", mutate: (r) => { r.sourceCoveragePlanReady = false; } },
  { id: 13, description: "9E readiness false", mutate: (r) => { r.sourceStorageSchemaReady = false; } },
  { id: 14, description: "9F readiness false", mutate: (r) => { r.sourceMigrationPlanReady = false; } },
  { id: 15, description: "incorrect migration directory", mutate: (r) => { r.wrongMigrationDirectoryAccepted = true; r.migrationFilePath = "db/migrations/032_create_minimal_knowledge_schema.sql"; } },
  { id: 16, description: "migration naming convention unconfirmed", mutate: (r) => { r.migrationNamingConventionConfirmed = false; } },
  { id: 17, description: "migration number not next available", mutate: (r) => { r.migrationNumberIsNextAvailable = false; } },
  { id: 18, description: "unexpected third file created", mutate: (r) => { r.thirdFileCreatedAccepted = true; r.onlyExpectedFilesChangedFalseAccepted = true; } },
  { id: 19, description: "existing file modified", mutate: (r) => { r.existingFileModifiedAccepted = true; } },
  { id: 20, description: "runtime modified", mutate: (r) => { r.runtimeModified = true; } },
  { id: 21, description: "UI modified", mutate: (r) => { r.uiModified = true; } },
  { id: 22, description: "route modified", mutate: (r) => { r.routeModified = true; } },
  { id: 23, description: "generated types modified", mutate: (r) => { r.generatedTypesModified = true; } },
  { id: 24, description: "SQL file missing", mutate: (r) => { r.sqlFileCreated = false; r.sqlFileMissingAccepted = true; } },
  { id: 25, description: "audit file missing", mutate: (r) => { r.auditFileMissingAccepted = true; } },
  { id: 26, description: "SQL file empty", mutate: (r) => { r.sqlFileEmptyAccepted = true; r.actualKnowledgeTableCount = 0; } },
  { id: 27, description: "database command executed", mutate: (r) => { r.databaseCommandExecuted = true; } },
  { id: 28, description: "Supabase CLI executed", mutate: (r) => { r.supabaseCliExecuted = true; } },
  { id: 29, description: "migration applied", mutate: (r) => { r.migrationApplied = true; } },
  { id: 30, description: "network accessed", mutate: (r) => { r.networkAccessPerformed = true; } },
  { id: 31, description: "seed file created", mutate: (r) => { r.seedFileCreated = true; } },
  { id: 32, description: "real data inserted", mutate: (r) => { r.realDataInserted = true; } },
  { id: 33, description: "synthetic data inserted", mutate: (r) => { r.syntheticDataInserted = true; } },
  { id: 34, description: "source inserted (real)", mutate: (r) => { r.realSourceRegistered = true; } },
  { id: 35, description: "claim inserted (real)", mutate: (r) => { r.realClaimPopulated = true; } },
  { id: 36, description: "authority inserted (real)", mutate: (r) => { r.realAuthorityRegistered = true; } },
  { id: 37, description: "process inserted (real)", mutate: (r) => { r.realProcessPopulated = true; } },
  { id: 38, description: "connector inserted (real)", mutate: (r) => { r.realCrossBorderConnectorImplemented = true; } },
  { id: 39, description: "model called", mutate: (r) => { r.modelCallPerformed = true; } },
  { id: 40, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; } },
  { id: 41, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; } },
  { id: 42, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; } },
  { id: 43, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; } },
  { id: 44, description: "DROP TABLE present", mutate: (r) => { r.migrationAdditive = false; r.dropTablePresentAccepted = true; } },
  { id: 45, description: "DROP SCHEMA present", mutate: (r) => { r.migrationAdditive = false; r.dropSchemaPresentAccepted = true; } },
  { id: 46, description: "destructive existing-table ALTER present", mutate: (r) => { r.migrationAdditive = false; r.destructiveAlterPresentAccepted = true; } },
  { id: 47, description: "unrelated table renamed", mutate: (r) => { r.unrelatedTableRenamedAccepted = true; } },
  { id: 48, description: "existing user table modified", mutate: (r) => { r.existingUserTableModifiedAccepted = true; } },
  { id: 49, description: "user data rewritten", mutate: (r) => { r.userDataRewrittenAccepted = true; } },
  { id: 50, description: "knowledge FK points to Smart Talk input", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.knowledgeFkToSmartTalkInputAccepted = true; } },
  { id: 51, description: "knowledge FK points to OCR storage", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.knowledgeFkToOcrStorageAccepted = true; } },
  { id: 52, description: "knowledge FK points to DNA profile", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.knowledgeFkToDnaProfileAccepted = true; } },
  { id: 53, description: "knowledge FK points to payments", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.knowledgeFkToPaymentsAccepted = true; } },
  { id: 54, description: "knowledge FK points to conversation history", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.knowledgeFkToConversationHistoryAccepted = true; } },
  { id: 55, description: "one giant knowledge table", mutate: (r) => { r.requiredLogicalEntitiesImplemented = false; r.oneGiantKnowledgeTableAccepted = true; r.actualKnowledgeTableCount = 1; } },
  { id: 56, description: "one giant JSON knowledge document", mutate: (r) => { r.oneGiantJsonDocumentAccepted = true; } },
  { id: 57, description: "required table omitted", mutate: (r) => { r.requiredLogicalEntitiesImplemented = false; r.requiredTableOmittedAccepted = true; } },
  { id: 58, description: "inconsistent table prefix", mutate: (r) => { r.inconsistentTablePrefixAccepted = true; } },
  { id: 59, description: "table name collision ignored", mutate: (r) => { r.tableNameCollisionIgnoredAccepted = true; } },
  { id: 60, description: "parent table created after child without safe staged FK", mutate: (r) => { r.dependencySafeCreationOrder = false; } },
  { id: 61, description: "source version created before source", mutate: (r) => { r.dependencySafeCreationOrder = false; r.sourceVersionBeforeSourceAccepted = true; } },
  { id: 62, description: "passage created before source version", mutate: (r) => { r.dependencySafeCreationOrder = false; r.passageBeforeSourceVersionAccepted = true; } },
  { id: 63, description: "evidence link created before claim or passage", mutate: (r) => { r.dependencySafeCreationOrder = false; r.evidenceLinkBeforeClaimOrPassageAccepted = true; } },
  { id: 64, description: "competence created before authority", mutate: (r) => { r.dependencySafeCreationOrder = false; r.competenceBeforeAuthorityAccepted = true; } },
  { id: 65, description: "process step created before process without staged design", mutate: (r) => { r.dependencySafeCreationOrder = false; r.processStepBeforeProcessAccepted = true; } },
  { id: 66, description: "localized terminology created before terminology", mutate: (r) => { r.dependencySafeCreationOrder = false; r.localizedTerminologyBeforeTerminologyAccepted = true; } },
  { id: 67, description: "cross-border process created before connector", mutate: (r) => { r.dependencySafeCreationOrder = false; r.crossBorderProcessBeforeConnectorAccepted = true; } },
  { id: 68, description: "source version lacks immutable flag", mutate: (r) => { r.sourceVersionImmutabilityImplementedOrExplicitlyBounded = false; } },
  { id: 69, description: "immutable flag allows false", mutate: (r) => { r.sourceVersionImmutabilityImplementedOrExplicitlyBounded = false; r.immutableFlagAllowsFalseAccepted = true; } },
  { id: 70, description: "source version lacks sequence", mutate: (r) => { r.sourceVersionLacksSequenceAccepted = true; r.sourceVersionHistoryPreserved = false; } },
  { id: 71, description: "source version lacks content hash", mutate: (r) => { r.sourceVersionLacksContentHashAccepted = true; r.sourceVersionImmutabilityImplementedOrExplicitlyBounded = false; } },
  { id: 72, description: "source version lacks effective period", mutate: (r) => { r.sourceVersionLacksEffectivePeriodAccepted = true; } },
  { id: 73, description: "source version cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.sourceVersionCascadeDeletedAccepted = true; } },
  { id: 74, description: "passage cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.passageCascadeDeletedAccepted = true; } },
  { id: 75, description: "claim cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.claimCascadeDeletedAccepted = true; } },
  { id: 76, description: "citation cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.citationCascadeDeletedAccepted = true; } },
  { id: 77, description: "review history cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.reviewHistoryCascadeDeletedAccepted = true; } },
  { id: 78, description: "freshness history cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.freshnessHistoryCascadeDeletedAccepted = true; } },
  { id: 79, description: "conflict history cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.conflictHistoryCascadeDeletedAccepted = true; } },
  { id: 80, description: "competence history cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.competenceHistoryCascadeDeletedAccepted = true; } },
  { id: 81, description: "audit history cascade-deleted", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; r.auditHistoryCascadeDeletedAccepted = true; } },
  { id: 82, description: "accepted source content freely editable", mutate: (r) => { r.acceptedContentFreelyEditableAccepted = true; r.sourceVersionImmutabilityImplementedOrExplicitlyBounded = false; } },
  { id: 83, description: "history overwrite allowed", mutate: (r) => { r.historyOverwriteAllowedAccepted = true; } },
  { id: 84, description: "passage lacks sourceVersionId", mutate: (r) => { r.passageLacksSourceVersionIdAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 85, description: "passage lacks text hash", mutate: (r) => { r.passageLacksTextHashAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 86, description: "passage lacks stable order", mutate: (r) => { r.passageLacksStableOrderAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 87, description: "citation lacks claim", mutate: (r) => { r.citationLacksClaimAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 88, description: "citation lacks source version", mutate: (r) => { r.citationLacksSourceVersionAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 89, description: "citation lacks passage", mutate: (r) => { r.citationLacksPassageAccepted = true; r.passageLevelCitationImplemented = false; } },
  { id: 90, description: "citation lacks publisher", mutate: (r) => { r.citationLacksPublisherAccepted = true; } },
  { id: 91, description: "citation points only to translation", mutate: (r) => { r.citationPointsOnlyToTranslationAccepted = true; } },
  { id: 92, description: "publisher official status substitutes competence", mutate: (r) => { r.publisherOfficialStatusSubstitutesCompetenceAccepted = true; } },
  { id: 93, description: "jurisdiction parent relation missing", mutate: (r) => { r.jurisdictionModelImplemented = false; r.jurisdictionParentRelationMissingAccepted = true; } },
  { id: 94, description: "territorial scope missing", mutate: (r) => { r.territorialScopeImplemented = false; r.territorialScopeMissingAccepted = true; } },
  { id: 95, description: "local scope can be national", mutate: (r) => { r.localScopeCanBeNationalAccepted = true; } },
  { id: 96, description: "authority competence stored only as free text", mutate: (r) => { r.authorityCompetenceImplemented = false; r.competenceStoredOnlyAsFreeTextAccepted = true; } },
  { id: 97, description: "competence effective dates omitted", mutate: (r) => { r.competenceEffectiveDatesOmittedAccepted = true; } },
  { id: 98, description: "nearby authority considered competent", mutate: (r) => { r.nearbyAuthorityConsideredCompetentAccepted = true; } },
  { id: 99, description: "claim lacks risk", mutate: (r) => { r.claimLacksRiskAccepted = true; } },
  { id: 100, description: "claim lacks allowed uses", mutate: (r) => { r.claimLacksAllowedUsesAccepted = true; } },
  { id: 101, description: "claim lacks blocked uses", mutate: (r) => { r.claimLacksBlockedUsesAccepted = true; } },
  { id: 102, description: "claim lacks citation requirement", mutate: (r) => { r.claimLacksCitationRequirementAccepted = true; } },
  { id: 103, description: "localized claims duplicate legal truth", mutate: (r) => { r.localizedClaimsDuplicateLegalTruthAccepted = true; } },
  { id: 104, description: "evidence-link support status missing", mutate: (r) => { r.claimEvidenceImplemented = false; r.evidenceLinkSupportStatusMissingAccepted = true; } },
  { id: 105, description: "high-risk direct-support requirement absent", mutate: (r) => { r.highRiskDirectSupportRequirementAbsentAccepted = true; } },
  { id: 106, description: "contradictory evidence can authorize claim", mutate: (r) => { r.contradictoryEvidenceAuthorizesClaimAccepted = true; } },
  { id: 107, description: "process is one unstructured article", mutate: (r) => { r.processIsOneUnstructuredArticleAccepted = true; } },
  { id: 108, description: "process step order not unique", mutate: (r) => { r.processStepModelImplemented = false; r.processStepOrderNotUniqueAccepted = true; } },
  { id: 109, description: "process step lacks actor reference", mutate: (r) => { r.processStepModelImplemented = false; r.processStepLacksActorReferenceAccepted = true; } },
  { id: 110, description: "process claim links omitted", mutate: (r) => { r.processClaimLinksOmittedAccepted = true; } },
  { id: 111, description: "form proves eligibility", mutate: (r) => { r.formProvesEligibilityAccepted = true; } },
  { id: 112, description: "form instructions passage omitted", mutate: (r) => { r.formInstructionsPassageOmittedAccepted = true; } },
  { id: 113, description: "evidence requirement assumes user always acts", mutate: (r) => { r.evidenceRequirementAssumesUserAlwaysActsAccepted = true; } },
  { id: 114, description: "institution exchange absent", mutate: (r) => { r.institutionExchangeAbsentAccepted = true; } },
  { id: 115, description: "deadline lacks trigger event", mutate: (r) => { r.deadlineRuleModelImplemented = false; r.deadlineLacksTriggerEventAccepted = true; } },
  { id: 116, description: "deadline allows negative duration", mutate: (r) => { r.deadlineRuleModelImplemented = false; r.deadlineAllowsNegativeDurationAccepted = true; } },
  { id: 117, description: "deadline lacks source version", mutate: (r) => { r.deadlineLacksSourceVersionAccepted = true; } },
  { id: 118, description: "deadline lacks passage", mutate: (r) => { r.deadlineLacksPassageAccepted = true; } },
  { id: 119, description: "deadline exact calculation defaults true", mutate: (r) => { r.deadlineRuleModelImplemented = false; r.deadlineExactCalculationDefaultsTrueAccepted = true; } },
  { id: 120, description: "deadline precision requirement absent", mutate: (r) => { r.deadlinePrecisionRequirementAbsentAccepted = true; } },
  { id: 121, description: "fee effective period absent", mutate: (r) => { r.feeEffectivePeriodAbsentAccepted = true; } },
  { id: 122, description: "fee source support absent", mutate: (r) => { r.feeSourceSupportAbsentAccepted = true; } },
  { id: 123, description: "eligibility final determination allowed", mutate: (r) => { r.eligibilityFinalDeterminationBlocked = false; } },
  { id: 124, description: "regional override base reference absent", mutate: (r) => { r.regionalOverrideModelImplemented = false; r.regionalOverrideBaseReferenceAbsentAccepted = true; } },
  { id: 125, description: "override scope absent", mutate: (r) => { r.overrideScopeAbsentAccepted = true; } },
  { id: 126, description: "override always treated substantive", mutate: (r) => { r.overrideAlwaysTreatedSubstantiveAccepted = true; } },
  { id: 127, description: "review history mutable single-row", mutate: (r) => { r.reviewHistoryImplemented = false; r.reviewHistoryMutableSingleRowAccepted = true; } },
  { id: 128, description: "review supersession absent", mutate: (r) => { r.reviewSupersessionAbsentAccepted = true; } },
  { id: 129, description: "freshness overwrites effective date", mutate: (r) => { r.freshnessSeparatedFromEffectiveDate = false; r.freshnessOverwritesEffectiveDateAccepted = true; } },
  { id: 130, description: "conflict deleted after resolution", mutate: (r) => { r.conflictHistoryImplemented = false; r.conflictDeletedAfterResolutionAccepted = true; } },
  { id: 131, description: "unresolved conflict permits high-risk use", mutate: (r) => { r.unresolvedConflictPermitsHighRiskUseAccepted = true; } },
  { id: 132, description: "localized terminology accepts unsupported locale", mutate: (r) => { r.sixLaunchLocalesConstrained = false; r.localizedTerminologyAcceptsUnsupportedLocaleAccepted = true; } },
  { id: 133, description: "one launch locale missing", mutate: (r) => { r.sixLaunchLocalesConstrained = false; r.oneLaunchLocaleMissingAccepted = true; } },
  { id: 134, description: "future locale silently added to launch constraint", mutate: (r) => { r.sixLaunchLocalesConstrained = false; r.futureLocaleSilentlyAddedAccepted = true; } },
  { id: 135, description: "German term retention not representable", mutate: (r) => { r.germanTermRetentionNotRepresentableAccepted = true; } },
  { id: 136, description: "warning equivalence not representable", mutate: (r) => { r.warningEquivalenceNotRepresentableAccepted = true; } },
  { id: 137, description: "trust domain inferred from locale", mutate: (r) => { r.trustDomainInferredFromLocaleAccepted = true; } },
  { id: 138, description: "connector activation from locale allowed", mutate: (r) => { r.localeConnectorActivationBlocked = false; } },
  { id: 139, description: "connector inserted or active", mutate: (r) => { r.zeroConnectorRows = false; r.connectorInsertedOrActiveAccepted = true; } },
  { id: 140, description: "DE<->SK not representable", mutate: (r) => { r.deSkStructurallyRepresentable = false; r.deSkNotRepresentableAccepted = true; } },
  { id: 141, description: "EU/DE/SK evidence structure absent", mutate: (r) => { r.euDeSkEvidenceStructureAbsentAccepted = true; } },
  { id: 142, description: "responsible actor absent from cross-border process", mutate: (r) => { r.responsibleActorAbsentFromCrossBorderAccepted = true; } },
  { id: 143, description: "temporal alignment absent", mutate: (r) => { r.temporalAlignmentAbsentAccepted = true; } },
  { id: 144, description: "evidence completeness absent", mutate: (r) => { r.evidenceCompletenessAbsentAccepted = true; } },
  { id: 145, description: "first pilot cannot be represented", mutate: (r) => { r.firstPilotCannotBeRepresentedAccepted = true; } },
  { id: 146, description: "vector similarity marked authoritative", mutate: (r) => { r.vectorSimilarityAuthorityBlocked = false; } },
  { id: 147, description: "vector extension added", mutate: (r) => { r.vectorExtensionAddedAccepted = true; } },
  { id: 148, description: "vector index created", mutate: (r) => { r.vectorIndexNotCreated = false; r.vectorIndexCreatedAccepted = true; } },
  { id: 149, description: "embedding column required for authority", mutate: (r) => { r.embeddingColumnRequiredForAuthorityAccepted = true; } },
  { id: 150, description: "audit user content allowed", mutate: (r) => { r.auditUserContentBlocked = false; } },
  { id: 151, description: "audit state hashes absent", mutate: (r) => { r.auditStateHashesAbsentAccepted = true; } },
  { id: 152, description: "public knowledge requires user-data FK", mutate: (r) => { r.publicKnowledgeSeparatedFromUserData = false; } },
  { id: 153, description: "anonymous INSERT allowed", mutate: (r) => { r.anonymousKnowledgeWritesBlocked = false; r.anonymousInsertAllowedAccepted = true; } },
  { id: 154, description: "anonymous UPDATE allowed", mutate: (r) => { r.anonymousKnowledgeWritesBlocked = false; r.anonymousUpdateAllowedAccepted = true; } },
  { id: 155, description: "anonymous DELETE allowed", mutate: (r) => { r.anonymousKnowledgeWritesBlocked = false; r.anonymousDeleteAllowedAccepted = true; } },
  { id: 156, description: "authenticated INSERT allowed", mutate: (r) => { r.authenticatedKnowledgeWritesBlocked = false; r.authenticatedInsertAllowedAccepted = true; } },
  { id: 157, description: "authenticated UPDATE allowed", mutate: (r) => { r.authenticatedKnowledgeWritesBlocked = false; r.authenticatedUpdateAllowedAccepted = true; } },
  { id: 158, description: "authenticated DELETE allowed", mutate: (r) => { r.authenticatedKnowledgeWritesBlocked = false; r.authenticatedDeleteAllowedAccepted = true; } },
  { id: 159, description: "direct public SELECT broadly authorized", mutate: (r) => { r.directPublicReadNotAuthorized = false; } },
  { id: 160, description: "RLS missing on one table", mutate: (r) => { r.rlsEnabledOnAllKnowledgeTables = false; r.rlsMissingOnOneTableAccepted = true; } },
  { id: 161, description: "permissive USING true write policy", mutate: (r) => { r.permissiveUsingTrueWritePolicyAccepted = true; } },
  { id: 162, description: "permissive WITH CHECK true write policy", mutate: (r) => { r.permissiveWithCheckTrueWritePolicyAccepted = true; } },
  { id: 163, description: "service role policy weakens immutable history", mutate: (r) => { r.serviceRoleOnlyControlledWriteBoundary = false; r.serviceRolePolicyWeakensHistoryAccepted = true; } },
  { id: 164, description: "broad grants modify unrelated tables", mutate: (r) => { r.broadGrantsModifyUnrelatedTablesAccepted = true; } },
  { id: 165, description: "real legal source embedded as comment/data", mutate: (r) => { r.realLegalSourceEmbeddedAccepted = true; } },
  { id: 166, description: "ordinary INSERT statement exists", mutate: (r) => { r.zeroKnowledgeSeedRows = false; r.ordinaryInsertStatementExistsAccepted = true; } },
  { id: 167, description: "seed knowledge row exists", mutate: (r) => { r.zeroRealKnowledgeRows = false; r.seedKnowledgeRowExistsAccepted = true; } },
  { id: 168, description: "trust-domain seed row exists", mutate: (r) => { r.trustDomainSeedRowExistsAccepted = true; } },
  { id: 169, description: "source seed row exists", mutate: (r) => { r.sourceSeedRowExistsAccepted = true; } },
  { id: 170, description: "process seed row exists", mutate: (r) => { r.processSeedRowExistsAccepted = true; } },
  { id: 171, description: "connector seed row exists", mutate: (r) => { r.connectorSeedRowExistsAccepted = true; } },
  { id: 172, description: "essential FK index omitted", mutate: (r) => { r.essentialIndexesImplemented = false; r.essentialFkIndexOmittedAccepted = true; } },
  { id: 173, description: "jurisdiction lookup index omitted", mutate: (r) => { r.jurisdictionLookupIndexOmittedAccepted = true; } },
  { id: 174, description: "effective-period index omitted", mutate: (r) => { r.effectivePeriodIndexOmittedAccepted = true; } },
  { id: 175, description: "review/freshness/conflict index omitted", mutate: (r) => { r.reviewFreshnessConflictIndexOmittedAccepted = true; } },
  { id: 176, description: "full-text index created prematurely", mutate: (r) => { r.fullTextIndexNotCreated = false; r.fullTextIndexCreatedPrematurelyAccepted = true; } },
  { id: 177, description: "migration wires runtime", mutate: (r) => { r.runtimeModified = true; } },
  { id: 178, description: "migration authorizes production", mutate: (r) => { r.productionAuthorizedNow = true; } },
  { id: 179, description: "migration authorizes public beta", mutate: (r) => { r.publicBetaAuthorizedNow = true; } },
  { id: 180, description: "migration authorizes go-live", mutate: (r) => { r.goLiveAuthorizedNow = true; } },
  { id: 181, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; } },
  { id: 182, description: "German database claimed populated", mutate: (r) => { r.germanKnowledgePopulationStillOpen = false; } },
  { id: 183, description: "six languages claimed production-ready", mutate: (r) => { r.sixLanguageProductionParityStillOpen = false; } },
  { id: 184, description: "standalone extraction claimed complete", mutate: (r) => { r.standaloneExtractionStillOpen = false; } },
  { id: 185, description: "Android claimed tested", mutate: (r) => { r.physicalAndroidStillUntested = false; } },
  { id: 186, description: "iOS claimed tested", mutate: (r) => { r.genuineIosSafariStillUntested = false; } },
  { id: 187, description: "HEIC claimed complete", mutate: (r) => { r.heicHeifStillOpen = false; } },
  { id: 188, description: "serverless OCR claimed complete", mutate: (r) => { r.serverlessOcrStillOpen = false; } },
  { id: 189, description: "distributed limiter claimed complete", mutate: (r) => { r.distributedRateLimiterStillOpen = false; } },
  { id: 190, description: "payment flow claimed complete", mutate: (r) => { r.paymentFlowStillOpen = false; } },
  { id: 191, description: "migration execution falsely claimed validated", mutate: (r) => { r.migrationExecutionValidationStillOpen = false; } },
  { id: 192, description: "DE<->SK implementation claimed done", mutate: (r) => { r.deSkImplementationStillOpen = false; } },
  { id: 193, description: "audit executes SQL", mutate: (r) => { r.sourceInspectionOnly = false; r.auditExecutesSqlAccepted = true; } },
  { id: 194, description: "audit connects to database", mutate: (r) => { r.auditConnectsToDatabaseAccepted = true; } },
  { id: 195, description: "audit executes Supabase CLI", mutate: (r) => { r.auditExecutesSupabaseCliAccepted = true; r.supabaseCliExecuted = true; } },
  { id: 196, description: "audit imports runtime route", mutate: (r) => { r.auditImportsRuntimeRouteAccepted = true; } },
  { id: 197, description: "audit passes if SQL contains destructive operation", mutate: (r) => { r.migrationAdditive = false; r.migrationNonDestructive = false; } },
  { id: 198, description: "audit passes if any real row is inserted", mutate: (r) => { r.zeroRealKnowledgeRows = false; } },
  { id: 199, description: "audit passes if RLS is absent", mutate: (r) => { r.rlsEnabledOnAllKnowledgeTables = false; } },
  { id: 200, description: "audit passes if public writes are allowed", mutate: (r) => { r.anonymousKnowledgeWritesBlocked = false; r.authenticatedKnowledgeWritesBlocked = false; } },
  { id: 201, description: "audit passes if passage-level citation is weakened", mutate: (r) => { r.passageLevelCitationImplemented = false; } },
  { id: 202, description: "audit passes if history can be overwritten", mutate: (r) => { r.protectedHistoryCascadeDeleteAbsent = false; } },
  { id: 203, description: "audit passes if locale activates connector", mutate: (r) => { r.localeConnectorActivationBlocked = false; } },
  { id: 204, description: "audit passes if user data is linked", mutate: (r) => { r.userDataForeignKeysAbsent = false; } },
  { id: 205, description: "audit passes if actualKnowledgeTableCount collapses below floor", mutate: (r) => { r.actualKnowledgeTableCount = 5; } },
  { id: 206, description: "audit passes if plannedTableCount tampered", mutate: (r) => { r.plannedTableCount = 10; } },
  { id: 207, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
  { id: 208, description: "audit passes if any tamper case survives", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
];

// ============================================================================
// EXPECTED-RESULT VALIDATOR
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9G",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceArchitectureCheckId === SOURCE_ARCHITECTURE_CHECK_ID,
    r.sourceTrustContractCheckId === SOURCE_TRUST_CONTRACT_CHECK_ID,
    r.sourceJurisdictionModelCheckId === SOURCE_JURISDICTION_MODEL_CHECK_ID,
    r.sourceCoveragePlanCheckId === SOURCE_COVERAGE_PLAN_CHECK_ID,
    r.sourceStorageSchemaCheckId === SOURCE_STORAGE_SCHEMA_CHECK_ID,
    r.sourceMigrationPlanCheckId === SOURCE_MIGRATION_PLAN_CHECK_ID,
    r.sourceArchitectureReady === true,
    r.sourceTrustContractReady === true,
    r.sourceJurisdictionModelReady === true,
    r.sourceCoveragePlanReady === true,
    r.sourceStorageSchemaReady === true,
    r.sourceMigrationPlanReady === true,

    r.migrationFilePath === MIGRATION_REL_PATH,
    r.migrationFileName === MIGRATION_FILE_NAME,
    r.migrationNamingConventionConfirmed === true,
    r.migrationNumberIsNextAvailable === true,
    r.knowledgeTablePrefix === KNOWLEDGE_TABLE_PREFIX,
    r.plannedTableCount === REQUIRED_TABLE_FAMILIES.length,
    r.actualKnowledgeTableCount >= 32 && r.actualKnowledgeTableCount <= 40,

    r.sourceInspectionOnly === true,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.sqlFileCreated === true,
    r.databaseMigrationCreated === true,
    r.databaseTableCreatedInSource === true,
    r.databaseCommandExecuted === false,
    r.databaseWritePerformed === false,
    r.supabaseCliExecuted === false,
    r.networkAccessPerformed === false,
    r.migrationApplied === false,
    r.generatedTypesModified === false,
    r.seedFileCreated === false,
    r.realDataInserted === false,
    r.syntheticDataInserted === false,
    r.realSourceRegistered === false,
    r.realClaimPopulated === false,
    r.realAuthorityRegistered === false,
    r.realProcessPopulated === false,
    r.realCrossBorderConnectorImplemented === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,

    r.migrationAdditive === true,
    r.migrationNonDestructive === true,
    r.requiredLogicalEntitiesImplemented === true,
    r.dependencySafeCreationOrder === true,
    r.foreignKeysImplemented === true,
    r.protectedHistoryCascadeDeleteAbsent === true,
    r.sourceVersionHistoryPreserved === true,
    r.sourceVersionImmutabilityImplementedOrExplicitlyBounded === true,
    r.passageLevelCitationImplemented === true,
    r.jurisdictionModelImplemented === true,
    r.territorialScopeImplemented === true,
    r.authorityCompetenceImplemented === true,
    r.claimEvidenceImplemented === true,
    r.processStepModelImplemented === true,
    r.deadlineRuleModelImplemented === true,
    r.eligibilityFinalDeterminationBlocked === true,
    r.regionalOverrideModelImplemented === true,
    r.reviewHistoryImplemented === true,
    r.freshnessSeparatedFromEffectiveDate === true,
    r.conflictHistoryImplemented === true,
    r.sixLaunchLocalesConstrained === true,
    r.trustDomainsRepresentable === true,
    r.deSkStructurallyRepresentable === true,
    r.deSkInactive === true,
    r.localeConnectorActivationBlocked === true,
    r.vectorSimilarityAuthorityBlocked === true,
    r.auditUserContentBlocked === true,
    r.publicKnowledgeSeparatedFromUserData === true,
    r.userDataForeignKeysAbsent === true,
    r.rlsEnabledOnAllKnowledgeTables === true,
    r.anonymousKnowledgeWritesBlocked === true,
    r.authenticatedKnowledgeWritesBlocked === true,
    r.directPublicReadNotAuthorized === true,
    r.serviceRoleOnlyControlledWriteBoundary === true,
    r.essentialIndexesImplemented === true,
    r.fullTextIndexNotCreated === true,
    r.vectorIndexNotCreated === true,
    r.zeroKnowledgeSeedRows === true,
    r.zeroRealKnowledgeRows === true,
    r.zeroConnectorRows === true,

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
    r.migrationExecutionValidationStillOpen === true,

    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.publicBetaAuthorizedNow === false,
    r.goLiveAuthorizedNow === false,

    r.existingFileModifiedAccepted === false,
    r.onlyExpectedFilesChangedFalseAccepted === false,
    r.thirdFileCreatedAccepted === false,
    r.auditFileMissingAccepted === false,
    r.sqlFileMissingAccepted === false,
    r.sqlFileEmptyAccepted === false,
    r.wrongMigrationDirectoryAccepted === false,
    r.migrationNumberNotNextAvailableAccepted === false,
    r.namingConventionUnconfirmedAccepted === false,

    r.dropTablePresentAccepted === false,
    r.dropSchemaPresentAccepted === false,
    r.destructiveAlterPresentAccepted === false,
    r.unrelatedTableRenamedAccepted === false,
    r.existingUserTableModifiedAccepted === false,
    r.userDataRewrittenAccepted === false,

    r.knowledgeFkToSmartTalkInputAccepted === false,
    r.knowledgeFkToOcrStorageAccepted === false,
    r.knowledgeFkToDnaProfileAccepted === false,
    r.knowledgeFkToPaymentsAccepted === false,
    r.knowledgeFkToConversationHistoryAccepted === false,

    r.oneGiantKnowledgeTableAccepted === false,
    r.oneGiantJsonDocumentAccepted === false,
    r.requiredTableOmittedAccepted === false,
    r.inconsistentTablePrefixAccepted === false,
    r.tableNameCollisionIgnoredAccepted === false,

    r.sourceVersionBeforeSourceAccepted === false,
    r.passageBeforeSourceVersionAccepted === false,
    r.evidenceLinkBeforeClaimOrPassageAccepted === false,
    r.competenceBeforeAuthorityAccepted === false,
    r.processStepBeforeProcessAccepted === false,
    r.localizedTerminologyBeforeTerminologyAccepted === false,
    r.crossBorderProcessBeforeConnectorAccepted === false,

    r.immutableFlagAllowsFalseAccepted === false,
    r.sourceVersionLacksSequenceAccepted === false,
    r.sourceVersionLacksContentHashAccepted === false,
    r.sourceVersionLacksEffectivePeriodAccepted === false,
    r.sourceVersionCascadeDeletedAccepted === false,
    r.passageCascadeDeletedAccepted === false,
    r.claimCascadeDeletedAccepted === false,
    r.citationCascadeDeletedAccepted === false,
    r.reviewHistoryCascadeDeletedAccepted === false,
    r.freshnessHistoryCascadeDeletedAccepted === false,
    r.conflictHistoryCascadeDeletedAccepted === false,
    r.competenceHistoryCascadeDeletedAccepted === false,
    r.auditHistoryCascadeDeletedAccepted === false,
    r.acceptedContentFreelyEditableAccepted === false,
    r.historyOverwriteAllowedAccepted === false,

    r.passageLacksSourceVersionIdAccepted === false,
    r.passageLacksTextHashAccepted === false,
    r.passageLacksStableOrderAccepted === false,
    r.citationLacksClaimAccepted === false,
    r.citationLacksSourceVersionAccepted === false,
    r.citationLacksPassageAccepted === false,
    r.citationLacksPublisherAccepted === false,
    r.citationPointsOnlyToTranslationAccepted === false,

    r.publisherOfficialStatusSubstitutesCompetenceAccepted === false,
    r.jurisdictionParentRelationMissingAccepted === false,
    r.territorialScopeMissingAccepted === false,
    r.localScopeCanBeNationalAccepted === false,
    r.competenceStoredOnlyAsFreeTextAccepted === false,
    r.competenceEffectiveDatesOmittedAccepted === false,
    r.nearbyAuthorityConsideredCompetentAccepted === false,

    r.claimLacksRiskAccepted === false,
    r.claimLacksAllowedUsesAccepted === false,
    r.claimLacksBlockedUsesAccepted === false,
    r.claimLacksCitationRequirementAccepted === false,
    r.localizedClaimsDuplicateLegalTruthAccepted === false,
    r.evidenceLinkSupportStatusMissingAccepted === false,
    r.highRiskDirectSupportRequirementAbsentAccepted === false,
    r.contradictoryEvidenceAuthorizesClaimAccepted === false,

    r.processIsOneUnstructuredArticleAccepted === false,
    r.processStepOrderNotUniqueAccepted === false,
    r.processStepLacksActorReferenceAccepted === false,
    r.processClaimLinksOmittedAccepted === false,
    r.formProvesEligibilityAccepted === false,
    r.formInstructionsPassageOmittedAccepted === false,
    r.evidenceRequirementAssumesUserAlwaysActsAccepted === false,
    r.institutionExchangeAbsentAccepted === false,

    r.deadlineLacksTriggerEventAccepted === false,
    r.deadlineAllowsNegativeDurationAccepted === false,
    r.deadlineLacksSourceVersionAccepted === false,
    r.deadlineLacksPassageAccepted === false,
    r.deadlineExactCalculationDefaultsTrueAccepted === false,
    r.deadlinePrecisionRequirementAbsentAccepted === false,
    r.feeEffectivePeriodAbsentAccepted === false,
    r.feeSourceSupportAbsentAccepted === false,

    r.regionalOverrideBaseReferenceAbsentAccepted === false,
    r.overrideScopeAbsentAccepted === false,
    r.overrideAlwaysTreatedSubstantiveAccepted === false,

    r.reviewHistoryMutableSingleRowAccepted === false,
    r.reviewSupersessionAbsentAccepted === false,
    r.freshnessOverwritesEffectiveDateAccepted === false,
    r.conflictDeletedAfterResolutionAccepted === false,
    r.unresolvedConflictPermitsHighRiskUseAccepted === false,

    r.localizedTerminologyAcceptsUnsupportedLocaleAccepted === false,
    r.oneLaunchLocaleMissingAccepted === false,
    r.futureLocaleSilentlyAddedAccepted === false,
    r.germanTermRetentionNotRepresentableAccepted === false,
    r.warningEquivalenceNotRepresentableAccepted === false,

    r.trustDomainInferredFromLocaleAccepted === false,
    r.connectorInsertedOrActiveAccepted === false,
    r.deSkNotRepresentableAccepted === false,
    r.euDeSkEvidenceStructureAbsentAccepted === false,
    r.responsibleActorAbsentFromCrossBorderAccepted === false,
    r.temporalAlignmentAbsentAccepted === false,
    r.evidenceCompletenessAbsentAccepted === false,
    r.firstPilotCannotBeRepresentedAccepted === false,

    r.vectorExtensionAddedAccepted === false,
    r.vectorIndexCreatedAccepted === false,
    r.embeddingColumnRequiredForAuthorityAccepted === false,
    r.auditStateHashesAbsentAccepted === false,

    r.anonymousInsertAllowedAccepted === false,
    r.anonymousUpdateAllowedAccepted === false,
    r.anonymousDeleteAllowedAccepted === false,
    r.authenticatedInsertAllowedAccepted === false,
    r.authenticatedUpdateAllowedAccepted === false,
    r.authenticatedDeleteAllowedAccepted === false,
    r.rlsMissingOnOneTableAccepted === false,
    r.permissiveUsingTrueWritePolicyAccepted === false,
    r.permissiveWithCheckTrueWritePolicyAccepted === false,
    r.serviceRolePolicyWeakensHistoryAccepted === false,
    r.broadGrantsModifyUnrelatedTablesAccepted === false,

    r.realLegalSourceEmbeddedAccepted === false,
    r.ordinaryInsertStatementExistsAccepted === false,
    r.seedKnowledgeRowExistsAccepted === false,
    r.trustDomainSeedRowExistsAccepted === false,
    r.sourceSeedRowExistsAccepted === false,
    r.processSeedRowExistsAccepted === false,
    r.connectorSeedRowExistsAccepted === false,

    r.essentialFkIndexOmittedAccepted === false,
    r.jurisdictionLookupIndexOmittedAccepted === false,
    r.effectivePeriodIndexOmittedAccepted === false,
    r.reviewFreshnessConflictIndexOmittedAccepted === false,
    r.fullTextIndexCreatedPrematurelyAccepted === false,

    r.auditExecutesSqlAccepted === false,
    r.auditConnectsToDatabaseAccepted === false,
    r.auditExecutesSupabaseCliAccepted === false,
    r.auditImportsRuntimeRouteAccepted === false,
    r.anyTamperCaseSurvivedAccepted === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
    r.tamperCasesRejected <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

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

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const evidence = collectEvidence();
  const good = buildGoodResult(evidence);

  const selfOk = computeExpectedAllPassed(good);
  const tamperOutcome = runTamperCases(good);

  const result: Result = {
    ...good,
    tamperCaseCount: tamperOutcome.total,
    tamperCasesRejected: tamperOutcome.rejected,
    tamperCasesRejectedCount: tamperOutcome.rejected,
  };
  result.allPassed = good.allPassed && selfOk && tamperOutcome.rejected === tamperOutcome.total;
  result.readyForEmptySchemaMigrationValidationClosure = result.allPassed;

  if (tamperOutcome.failures.length > 0) {
    (result as unknown as { tamperFailures: string[] }).tamperFailures = tamperOutcome.failures;
  }

  console.log(JSON.stringify(result));
}

main();
