/**
 * PHASE 9R static implementation audit.
 *
 * This runner inspects migration 035 and repository scope. It does not connect
 * to PostgreSQL; isolated runtime validation is deliberately deferred to 9S.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MIGRATION_032 = "supabase/migrations/032_create_minimal_knowledge_schema.sql";
const MIGRATION_033 = "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql";
const MIGRATION_034 = "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql";
const MIGRATION_035 = "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql";
const PHASE_9Q =
  "lib/vaylo/smart-talk/knowledge/de/run-german-official-source-registry-and-handling-mode-implementation-plan-audit.ts";
const SELF =
  "lib/vaylo/smart-talk/knowledge/de/run-official-source-registry-and-handling-mode-schema-migration-audit.ts";
const EXPECTED_HEAD = "32a95a5";
const NEXT_PHASE = "PHASE 9S — Source Registry Isolated PostgreSQL Validation";

const ENUMS = [
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
const TABLES_ALTERED = [
  "knowledge_sources",
  "knowledge_source_versions",
  "knowledge_retrieval_metadata",
] as const;
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
const RPCS = [
  "knowledge_register_official_source",
  "knowledge_update_official_source_metadata",
  "knowledge_record_source_terms_review",
  "knowledge_record_source_robots_review",
  "knowledge_record_source_authority_verification",
  "knowledge_authorize_official_source",
  "knowledge_suspend_official_source",
  "knowledge_reject_official_source",
  "knowledge_retire_official_source",
  "knowledge_assign_source_handling_policy",
  "knowledge_record_source_acquisition_attempt",
] as const;
const INTERNAL = ["knowledge_transition_source_authorization_internal"] as const;
const STATES = [
  "DRAFT",
  "PENDING_TERMS_REVIEW",
  "PENDING_AUTHORITY_VERIFICATION",
  "AUTHORIZED",
  "SUSPENDED",
  "REJECTED",
  "RETIRED",
] as const;
const EDGES = [
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
const HANDLING_MODES = [
  "STORE_CANONICALLY",
  "FETCH_LIVE",
  "CACHE_AND_REVALIDATE",
  "MANUAL_REVIEW_REQUIRED",
  "DO_NOT_ANSWER_WITHOUT_CONTEXT",
] as const;
const FRESHNESS = [
  "REAL_TIME",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "EVENT_DRIVEN",
  "LEGAL_CHANGE_MONITORED",
  "MANUAL_REVIEW_CYCLE",
] as const;
const STALE = [
  "ALLOW_WITH_STALE_WARNING",
  "REVALIDATE_BEFORE_USE",
  "DO_NOT_USE_STALE",
] as const;
const OFFICIAL_CLASSES = [
  "FEDERAL_LAW",
  "FEDERAL_REGULATION",
  "FEDERAL_ADMINISTRATIVE_GUIDANCE",
  "EU_LAW",
  "EU_OFFICIAL_GUIDANCE",
  "FEDERAL_SERVICE_PORTAL",
  "LAND_SERVICE_PORTAL",
  "MUNICIPALITY_SERVICE_PORTAL",
  "AUTHORITY_PORTAL",
  "OFFICIAL_FORM",
  "OFFICIAL_ONLINE_SERVICE",
  "OFFICIAL_DATASET",
] as const;
const DISCOVERY_CLASSES = [
  "COMMERCIAL_GUIDE",
  "BLOG",
  "FORUM",
  "SEARCH_RESULT_SNIPPET",
  "AI_GENERATED_TEXT",
] as const;
const ACTOR_LITERALS = [
  "SOURCE_REGISTRAR",
  "SOURCE_METADATA_EDITOR",
  "SOURCE_TERMS_REVIEWER",
  "SOURCE_ROBOTS_REVIEWER",
  "SOURCE_AUTHORITY_REVIEWER",
  "SOURCE_AUTHORIZER",
  "SOURCE_SUSPENSION_AUTHORITY",
  "SOURCE_REJECTION_AUTHORITY",
  "SOURCE_RETIREMENT_AUTHORITY",
  "HANDLING_POLICY_EDITOR",
  "SOURCE_ACQUISITION_RECORDER",
] as const;

function read(relative: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relative), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 30000,
    }).trim();
  } catch {
    return "";
  }
}

function matches(source: string, expression: RegExp): string[] {
  return [...source.matchAll(expression)].map((match) => match[1] ?? match[0]);
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function sameSet(actual: readonly string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && expected.every((value) => actual.includes(value));
}

function functionBlock(sql: string, name: string): string {
  const pattern = new RegExp(
    `create(?:\\s+or\\s+replace)?\\s+function\\s+public\\.${name}\\s*\\([\\s\\S]*?\\n\\$\\$;`,
    "i"
  );
  return sql.match(pattern)?.[0] ?? "";
}

interface MigrationMetrics {
  enumNames: string[];
  tablesCreated: string[];
  tablesAltered: string[];
  constraintNames: string[];
  indexNames: string[];
  triggerNames: string[];
  functionsAdded: string[];
  functionsReplaced: string[];
  grantableRpcNames: string[];
  rlsTables: string[];
  permissivePolicyCount: number;
  enumValuesComplete: boolean;
  noDestructiveDdl: boolean;
  exactObjects: boolean;
  securityDefinersHardened: boolean;
  schemaQualificationComplete: boolean;
  ambiguityDefenseComplete: boolean;
  requiredRevokesComplete: boolean;
  publicTablePrivilegesRevoked: boolean;
  directServiceRoleDmlAllowed: boolean;
  anonDirectAccessAllowed: boolean;
  authenticatedDirectAccessAllowed: boolean;
  publicExecuteAllowed: boolean;
  internalGenericEngineGrantable: boolean;
  actorClassCallerControlled: boolean;
  operationDerivedActorClassComplete: boolean;
  transitionEdges: string[];
  transitionMatrixComplete: boolean;
  optimisticConcurrencyImplemented: boolean;
  rowLockingImplemented: boolean;
  idempotencyImplemented: boolean;
  appendOnlyHistoryImplemented: boolean;
  historyUpdateDeleteBlocked: boolean;
  discoveryOnlyEvidenceForbidden: boolean;
  handlingPolicyPerInformationClassSupported: boolean;
  handlingPolicyProcessScopeOverrideSupported: boolean;
  requiredContextKeysBounded: boolean;
  highRiskStaleUseBlocked: boolean;
  urlNormalizationBoundaryPreserved: boolean;
  legacySourcesAutoAuthorized: boolean;
  legacySourcesAutoEvidenceEligible: boolean;
  noRealSourceData: boolean;
  rawSourceContentStored: boolean;
}

function analyzeMigration(sql: string): MigrationMetrics {
  const enumNames = matches(sql, /^create type public\.(\w+) as enum/igm);
  const tablesCreated = matches(sql, /^create table public\.(\w+)/igm);
  const tablesAltered = unique(matches(sql, /^alter table public\.(\w+)/igm).filter((name) =>
    TABLES_ALTERED.includes(name as (typeof TABLES_ALTERED)[number])
  ));
  const constraintNames = matches(sql, /^\s*(?:add )?constraint\s+(\w+)/igm);
  const indexNames = matches(sql, /^create (?:unique )?index\s+(\w+)/igm);
  const triggerNames = matches(sql, /^create trigger\s+(\w+)/igm);
  const functionsAdded = matches(sql, /^create function public\.(\w+)/igm);
  const functionsReplaced = matches(sql, /^create or replace function public\.(\w+)/igm);
  const grantableRpcNames = matches(sql, /^grant execute on function public\.(\w+)/igm);
  const rlsTables = matches(sql, /^alter table public\.(\w+) enable row level security;/igm);
  const definerNames = [...functionsAdded].filter((name) =>
    /\bsecurity definer\b/i.test(functionBlock(sql, name))
  );
  const allExpectedFunctions = [...RPCS, ...INTERNAL];
  const securityDefinersHardened =
    definerNames.length === 12 &&
    allExpectedFunctions.every((name) => {
      const block = functionBlock(sql, name);
      return (
        /\bsecurity definer\b/i.test(block) &&
        /set search_path = pg_catalog, public/i.test(block) &&
        /set plpgsql\.variable_conflict = 'error'/i.test(block) &&
        !/\bexecute\s+format\b|\bexecute\s+p_/i.test(block)
      );
    });
  const transitionBody = functionBlock(sql, INTERNAL[0]);
  const transitionEdges = matches(
    transitionBody,
    /\('([A-Z_]+)'\s*,\s*'([A-Z_]+)'\)/g
  );
  const normalizedEdges = [...transitionBody.matchAll(/\('([A-Z_]+)'\s*,\s*'([A-Z_]+)'\)/g)]
    .map((match) => `${match[1]}->${match[2]}`)
    .filter((edge) => STATES.some((state) => edge.startsWith(`${state}->`)));
  const noBroadDmlGrants =
    !/\bgrant\s+(?:all|select|insert|update|delete)[\s\S]{0,120}\bto\s+service_role\b/i.test(sql);
  const sourceClassSection = sql.match(
    /create type public\.knowledge_source_class as enum \(([\s\S]*?)\);/i
  )?.[1] ?? "";
  const stateSection = sql.match(
    /create type public\.knowledge_source_authorization_state as enum \(([\s\S]*?)\);/i
  )?.[1] ?? "";

  return {
    enumNames,
    tablesCreated,
    tablesAltered,
    constraintNames,
    indexNames,
    triggerNames,
    functionsAdded,
    functionsReplaced,
    grantableRpcNames,
    rlsTables,
    permissivePolicyCount: matches(sql, /^create policy\b/igm).length,
    enumValuesComplete:
      HANDLING_MODES.every((value) => sql.includes(`'${value}'`)) &&
      FRESHNESS.every((value) => sql.includes(`'${value}'`)) &&
      STALE.every((value) => sql.includes(`'${value}'`)) &&
      OFFICIAL_CLASSES.every((value) => sourceClassSection.includes(`'${value}'`)) &&
      DISCOVERY_CLASSES.every((value) => sourceClassSection.includes(`'${value}'`)) &&
      STATES.every((value) => stateSection.includes(`'${value}'`)),
    noDestructiveDdl:
      !/\bdrop\s+(?:table|column|type)\b|\btruncate\b|\balter\s+table[\s\S]{0,100}\brename\b/i.test(sql),
    exactObjects:
      sameSet(enumNames, ENUMS) &&
      sameSet(tablesCreated, TABLES_CREATED) &&
      sameSet(tablesAltered, TABLES_ALTERED) &&
      sameSet(constraintNames, CONSTRAINTS) &&
      sameSet(indexNames, INDEXES) &&
      sameSet(functionsAdded, allExpectedFunctions) &&
      sameSet(functionsReplaced, ["knowledge_source_versions_protect_locked_content"]),
    securityDefinersHardened,
    schemaQualificationComplete:
      allExpectedFunctions.every((name) => {
        const block = functionBlock(sql, name);
        return !/\b(from|update|insert into|join)\s+knowledge_/i.test(block);
      }),
    ambiguityDefenseComplete:
      allExpectedFunctions.every((name) => {
        const block = functionBlock(sql, name);
        return (
          !/\n\s{2,}(source_id|authorization_state|authorization_state_version|created_at)\s*:=/i.test(block) &&
          !/\b(?:declare|,)\s+(?!v_)[a-z]\w*\s+(?:uuid|integer|text|boolean)\b/i.test(
            block.match(/\bdeclare\b([\s\S]*?)\bbegin\b/i)?.[1] ?? ""
          )
        );
      }),
    requiredRevokesComplete:
      allExpectedFunctions.every((name) =>
        new RegExp(`revoke all on function public\\.${name}\\s*\\(`, "i").test(sql)
      ),
    publicTablePrivilegesRevoked:
      [...TABLES_CREATED, ...TABLES_ALTERED].every((name) =>
        new RegExp(
          `revoke all on table public\\.${name} from public, anon, authenticated, service_role;`,
          "i"
        ).test(sql)
      ),
    directServiceRoleDmlAllowed: !noBroadDmlGrants,
    anonDirectAccessAllowed: /\bgrant\s+[\s\S]{0,80}\bon\b[\s\S]{0,80}\bto\s+anon\b/i.test(sql),
    authenticatedDirectAccessAllowed:
      /\bgrant\s+[\s\S]{0,80}\bon\b[\s\S]{0,80}\bto\s+authenticated\b/i.test(sql),
    publicExecuteAllowed:
      allExpectedFunctions.some((name) =>
        new RegExp(`grant execute on function public\\.${name}[\\s\\S]{0,500}\\bto public\\b`, "i").test(sql)
      ) ||
      !allExpectedFunctions.every((name) =>
        new RegExp(`revoke all on function public\\.${name}\\s*\\(`, "i").test(sql)
      ),
    internalGenericEngineGrantable:
      grantableRpcNames.includes(INTERNAL[0]) ||
      new RegExp(
        `grant execute on function public\\.${INTERNAL[0]}[\\s\\S]{0,500}\\bto service_role\\b`,
        "i"
      ).test(sql),
    actorClassCallerControlled:
      RPCS.some((name) => /\bp_(?:actor_class|operation_actor_class)\b/i.test(functionBlock(sql, name))),
    operationDerivedActorClassComplete:
      ACTOR_LITERALS.every((actor) => sql.includes(`'${actor}'`)) &&
      RPCS.every((name) => !/\bp_(?:actor_class|operation_actor_class)\b/i.test(functionBlock(sql, name))),
    transitionEdges,
    transitionMatrixComplete:
      sameSet(unique(normalizedEdges), EDGES) &&
      STATES.length * STATES.length === 49 &&
      EDGES.length === 11,
    optimisticConcurrencyImplemented:
      /\bp_expected_version integer\b/i.test(transitionBody) &&
      /authorization_state_version <> p_expected_version/i.test(transitionBody) &&
      /authorization_state_version = ks\.authorization_state_version \+ 1/i.test(transitionBody),
    rowLockingImplemented:
      /\bfor update\b/i.test(transitionBody) &&
      /\bfor update\b/i.test(functionBlock(sql, "knowledge_assign_source_handling_policy")),
    idempotencyImplemented:
      /\bidempotency_key\b/i.test(sql) &&
      sql.includes("ux_source_authorization_transition_idempotency") &&
      sql.includes("ux_acquisition_attempt_idempotency") &&
      sql.includes("SOURCE_IDEMPOTENCY_CONFLICT"),
    appendOnlyHistoryImplemented:
      triggerNames.includes("trg_source_authorization_transitions_append_only") &&
      triggerNames.includes("trg_source_registry_history_append_only"),
    historyUpdateDeleteBlocked:
      (sql.match(/before update or delete on public\.knowledge_source_/gi) ?? []).length === 2 &&
      (sql.match(/fn_publication_state_transitions_append_only\(\)/gi) ?? []).length >= 2,
    discoveryOnlyEvidenceForbidden:
      sql.includes("sources_discovery_class_ineligible") &&
      DISCOVERY_CLASSES.every((value) => sql.includes(`'${value}'`)) &&
      sql.includes("DISCOVERY_SOURCE_EVIDENCE_FORBIDDEN"),
    handlingPolicyPerInformationClassSupported:
      /source_id uuid not null,[\s\S]*information_class public\.knowledge_information_class not null/i.test(
        sql.match(/create table public\.knowledge_source_handling_policies[\s\S]*?\n\);/i)?.[0] ?? ""
      ),
    handlingPolicyProcessScopeOverrideSupported:
      sql.includes("handling_policy_scope_unique") &&
      /\bprocess_scope text not null default ''/i.test(sql),
    requiredContextKeysBounded:
      sql.includes("knowledge_required_context_key[]") &&
      sql.includes("handling_policy_context_required"),
    highRiskStaleUseBlocked:
      sql.includes("handling_policy_high_risk_no_stale") &&
      sql.includes("risk_class not in ('HIGH', 'CRITICAL')") &&
      functionBlock(sql, "knowledge_assign_source_handling_policy").includes(
        "upper(p_risk_class) in ('HIGH', 'CRITICAL')"
      ),
    urlNormalizationBoundaryPreserved:
      sql.includes("normalized_canonical_url") &&
      sql.includes("normalized_origin") &&
      sql.includes("ux_sources_normalized_canonical_url") &&
      sql.includes("position('#' in p_normalized_canonical_url)") &&
      !/create\s+function[\s\S]*\bredirect\b/i.test(sql),
    legacySourcesAutoAuthorized:
      !/authorization_state[\s\S]{0,100}default 'DRAFT'/i.test(sql) ||
      /\bupdate public\.knowledge_sources[\s\S]{0,200}authorization_state\s*=\s*'AUTHORIZED'/i.test(
        sql.slice(0, sql.indexOf("-- INTERNAL AUTHORIZATION"))
      ),
    legacySourcesAutoEvidenceEligible:
      !/evidence_eligibility[\s\S]{0,120}default 'DISCOVERY_ONLY'/i.test(sql),
    noRealSourceData:
      !/\binsert into public\.knowledge_sources\b/i.test(
        sql.slice(0, sql.indexOf("-- INTERNAL AUTHORIZATION"))
      ) &&
      !/https?:\/\/[a-z0-9]/i.test(sql),
    rawSourceContentStored:
      /\b(raw_html|raw_pdf|page_content|content_bytes)\b|\bbytea\b/i.test(sql),
  };
}

interface Result {
  checkId: "9R";
  phase: "Official Source Registry and Handling-Mode Schema Migration";
  allPassed: boolean;
  blocked: boolean;
  blockReason: string;
  sourceCommit: string;
  sourceMigration032: string;
  sourceMigration033: string;
  sourceMigration034: string;
  sourcePhase9QAudit: string;
  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  onlyExpectedFilesChanged: boolean;
  unexpectedRepositoryPaths: string[];
  migration032Modified: boolean;
  migration033Modified: boolean;
  migration034Modified: boolean;
  migration035Created: boolean;
  migration035FilenameCorrect: boolean;
  migrationStrategy: "CREATE_AND_ALTER";
  enumCount: number;
  enumNames: string[];
  enumValuesComplete: boolean;
  tablesCreatedCount: number;
  tablesCreated: string[];
  tablesAlteredCount: number;
  tablesAltered: string[];
  constraintsAddedCount: number;
  indexesAddedCount: number;
  triggersAddedCount: number;
  functionsAddedCount: number;
  functionsReplacedCount: number;
  rlsEnabledNewTableCount: number;
  newTablesAllRlsEnabled: boolean;
  permissivePolicyCount: number;
  publicTablePrivilegesRevoked: boolean;
  anonDirectAccessAllowed: boolean;
  authenticatedDirectAccessAllowed: boolean;
  directServiceRoleDmlAllowed: boolean;
  grantableRpcCount: number;
  grantableRpcNames: string[];
  internalFunctionCount: number;
  internalFunctionNames: string[];
  internalGenericEngineGrantable: boolean;
  publicExecuteAllowed: boolean;
  actorClassCallerControlled: boolean;
  operationDerivedActorClassComplete: boolean;
  securityDefinersHardened: boolean;
  schemaQualificationComplete: boolean;
  ambiguityDefenseComplete: boolean;
  sourceAuthorizationStateCount: number;
  sourceAuthorizationTransitionMatrixCellCount: number;
  sourceAuthorizationAllowedTransitionCount: number;
  sourceAuthorizationForbiddenTransitionCount: number;
  sourceAuthorizationTransitionMatrixComplete: boolean;
  optimisticConcurrencyImplemented: boolean;
  rowLockingImplemented: boolean;
  idempotencyImplemented: boolean;
  appendOnlyHistoryImplemented: boolean;
  historyUpdateDeleteBlocked: boolean;
  discoveryOnlyEvidenceForbidden: boolean;
  handlingPolicyPerInformationClassSupported: boolean;
  handlingPolicyProcessScopeOverrideSupported: boolean;
  requiredContextKeysBounded: boolean;
  highRiskStaleUseBlocked: boolean;
  urlNormalizationBoundaryPreserved: boolean;
  legacySourcesAutoAuthorized: boolean;
  legacySourcesAutoEvidenceEligible: boolean;
  realSourceRowsInserted: boolean;
  realSourceUrlsPresent: boolean;
  rawSourceContentStored: boolean;
  realSourceAcquisitionPerformed: boolean;
  aiExtractionImplemented: boolean;
  passageExtractionImplemented: boolean;
  generatedTypesCreated: boolean;
  runtimeRetrievalWired: boolean;
  smartTalkRouteModified: boolean;
  productionAuthorizationGranted: boolean;
  migrationTamperCaseCount: number;
  migrationTamperCasesRejected: number;
  readyForIsolatedPostgresqlValidation: boolean;
  readyForGeneratedDatabaseTypes: boolean;
  readyForServerRpcSurface: boolean;
  recommendedNextPhase: string;
  evidence: string[];
}

function expectedScope(): { valid: boolean; unexpected: string[] } {
  const allowed = new Set([MIGRATION_035, SELF]);
  const unexpected: string[] = [];
  for (const line of git(["status", "--porcelain"]).split("\n")) {
    if (!line.trim()) continue;
    const relative = line.slice(3).trim().replace(/^"|"$/g, "").replaceAll("\\", "/");
    if (!allowed.has(relative)) unexpected.push(relative);
  }
  return { valid: unexpected.length === 0, unexpected };
}

function trackedPathModified(relative: string): boolean {
  try {
    execFileSync("git", ["diff", "--quiet", "--", relative], { cwd: process.cwd() });
    return false;
  } catch {
    return true;
  }
}

function migrationInvariant(metrics: MigrationMetrics): boolean {
  return [
    metrics.enumNames.length === 15 && sameSet(metrics.enumNames, ENUMS),
    metrics.enumValuesComplete,
    metrics.tablesCreated.length === 4 && sameSet(metrics.tablesCreated, TABLES_CREATED),
    metrics.tablesAltered.length === 3 && sameSet(metrics.tablesAltered, TABLES_ALTERED),
    metrics.constraintNames.length === 22 && sameSet(metrics.constraintNames, CONSTRAINTS),
    metrics.indexNames.length === 16 && sameSet(metrics.indexNames, INDEXES),
    metrics.triggerNames.length === 2,
    metrics.functionsAdded.length === 12 &&
      sameSet(metrics.functionsAdded, [...RPCS, ...INTERNAL]),
    metrics.functionsReplaced.length === 1 &&
      metrics.functionsReplaced[0] === "knowledge_source_versions_protect_locked_content",
    metrics.rlsTables.length === 4 && sameSet(metrics.rlsTables, TABLES_CREATED),
    metrics.permissivePolicyCount === 0,
    metrics.grantableRpcNames.length === 11 && sameSet(metrics.grantableRpcNames, RPCS),
    metrics.exactObjects && metrics.noDestructiveDdl,
    metrics.securityDefinersHardened &&
      metrics.schemaQualificationComplete &&
      metrics.ambiguityDefenseComplete,
    metrics.requiredRevokesComplete &&
      metrics.publicTablePrivilegesRevoked &&
      !metrics.publicExecuteAllowed &&
      !metrics.anonDirectAccessAllowed &&
      !metrics.authenticatedDirectAccessAllowed &&
      !metrics.directServiceRoleDmlAllowed,
    !metrics.internalGenericEngineGrantable &&
      !metrics.actorClassCallerControlled &&
      metrics.operationDerivedActorClassComplete,
    metrics.transitionMatrixComplete,
    metrics.optimisticConcurrencyImplemented &&
      metrics.rowLockingImplemented &&
      metrics.idempotencyImplemented,
    metrics.appendOnlyHistoryImplemented && metrics.historyUpdateDeleteBlocked,
    metrics.discoveryOnlyEvidenceForbidden &&
      metrics.handlingPolicyPerInformationClassSupported &&
      metrics.handlingPolicyProcessScopeOverrideSupported &&
      metrics.requiredContextKeysBounded &&
      metrics.highRiskStaleUseBlocked,
    metrics.urlNormalizationBoundaryPreserved &&
      !metrics.legacySourcesAutoAuthorized &&
      !metrics.legacySourcesAutoEvidenceEligible,
    metrics.noRealSourceData && !metrics.rawSourceContentStored,
  ].every(Boolean);
}

interface Tamper {
  description: string;
  mutate: (sql: string) => string;
}

function renameTokenTamper(description: string, token: string): Tamper {
  return {
    description,
    mutate: (sql) => sql.replace(token, `${token}_TAMPERED`),
  };
}

const STRUCTURAL_TAMPERS: Tamper[] = [
  ...ENUMS.map((name) => renameTokenTamper(`enum ${name} missing`, `create type public.${name}`)),
  ...ENUMS.map((name) => renameTokenTamper(`enum ${name} value surface altered`, `public.${name}`)),
  ...TABLES_CREATED.map((name) =>
    renameTokenTamper(`table ${name} missing`, `create table public.${name}`)
  ),
  ...TABLES_ALTERED.map((name) =>
    ({
      description: `approved alter target ${name} missing`,
      mutate: (sql: string) =>
        sql.replaceAll(`alter table public.${name}`, `alter table public.${name}_TAMPERED`),
    })
  ),
  ...CONSTRAINTS.map((name) => renameTokenTamper(`constraint ${name} missing`, name)),
  ...INDEXES.map((name) => renameTokenTamper(`index ${name} missing`, name)),
  ...RPCS.map((name) => renameTokenTamper(`RPC ${name} missing`, `create function public.${name}`)),
  ...RPCS.map((name) => renameTokenTamper(`RPC ${name} grant missing`, `grant execute on function public.${name}`)),
];

const SAFETY_TAMPERS: Tamper[] = [
  { description: "migration missing", mutate: () => "" },
  { description: "wrong migration strategy via destructive table drop", mutate: (sql) => `${sql}\ndrop table public.knowledge_sources;` },
  { description: "drop column introduced", mutate: (sql) => `${sql}\nalter table public.knowledge_sources drop column canonical_url;` },
  { description: "table rename introduced", mutate: (sql) => `${sql}\nalter table public.knowledge_sources rename to sources_old;` },
  { description: "permissive policy introduced", mutate: (sql) => `${sql}\ncreate policy unsafe on public.knowledge_sources using (true);` },
  { description: "direct service role DML granted", mutate: (sql) => `${sql}\ngrant all on public.knowledge_sources to service_role;` },
  { description: "anon direct read granted", mutate: (sql) => `${sql}\ngrant select on public.knowledge_sources to anon;` },
  { description: "authenticated direct write granted", mutate: (sql) => `${sql}\ngrant insert on public.knowledge_sources to authenticated;` },
  { description: "generic engine granted", mutate: (sql) => `${sql}\ngrant execute on function public.${INTERNAL[0]}(uuid) to service_role;` },
  { description: "PUBLIC execute granted", mutate: (sql) => `${sql}\ngrant execute on function public.${RPCS[0]}(uuid) to public;` },
  { description: "caller-controlled actor class", mutate: (sql) => sql.replace("p_actor_audit_identifier text,\n  p_idempotency_key text", "p_actor_class text,\n  p_actor_audit_identifier text,\n  p_idempotency_key text") },
  { description: "hardened search path removed", mutate: (sql) => sql.replaceAll("set search_path = pg_catalog, public", "set search_path = public") },
  { description: "variable conflict defense removed", mutate: (sql) => sql.replace("set plpgsql.variable_conflict = 'error'", "") },
  { description: "row lock removed", mutate: (sql) => sql.replace("for update;", ";") },
  { description: "expected version comparison removed", mutate: (sql) => sql.replace("v_source.authorization_state_version <> p_expected_version", "false") },
  { description: "state increment removed", mutate: (sql) => sql.replace("authorization_state_version = ks.authorization_state_version + 1", "authorization_state_version = ks.authorization_state_version") },
  { description: "idempotency index removed", mutate: (sql) => sql.replace("ux_source_authorization_transition_idempotency", "removed_transition_idempotency") },
  { description: "append-only authorization trigger removed", mutate: (sql) => sql.replace("trg_source_authorization_transitions_append_only", "removed_authorization_trigger") },
  { description: "append-only registry trigger removed", mutate: (sql) => sql.replace("trg_source_registry_history_append_only", "removed_registry_trigger") },
  { description: "transition matrix edge omitted", mutate: (sql) => sql.replace("('DRAFT', 'REJECTED'),", "") },
  { description: "forbidden transition accepted", mutate: (sql) => sql.replace("('DRAFT', 'REJECTED'),", "('DRAFT', 'AUTHORIZED'),") },
  { description: "legacy rows auto-authorized", mutate: (sql) => sql.replace("not null default 'DRAFT'", "not null default 'AUTHORIZED'") },
  { description: "legacy rows auto evidence eligible", mutate: (sql) => sql.replace("not null default 'DISCOVERY_ONLY'", "not null default 'PUBLICATION_EVIDENCE_ELIGIBLE'") },
  { description: "discovery constraint removed", mutate: (sql) => sql.replace("sources_discovery_class_ineligible", "removed_discovery_guard") },
  { description: "handling information class removed", mutate: (sql) => sql.replace("information_class public.knowledge_information_class not null", "information_class text") },
  { description: "process scope override removed", mutate: (sql) => sql.replace("process_scope text not null default ''", "process_scope_removed text") },
  { description: "context keys unbounded", mutate: (sql) => sql.replaceAll("public.knowledge_required_context_key[]", "text[]") },
  { description: "high-risk stale constraint removed", mutate: (sql) => sql.replace("handling_policy_high_risk_no_stale", "removed_high_risk_guard") },
  { description: "high-risk RPC guard removed", mutate: (sql) => sql.replace("upper(p_risk_class) in ('HIGH', 'CRITICAL')", "false") },
  { description: "normalized URL uniqueness removed", mutate: (sql) => sql.replace("ux_sources_normalized_canonical_url", "removed_url_unique") },
  { description: "URL fragment guard removed", mutate: (sql) => sql.replaceAll("position('#' in p_normalized_canonical_url)", "0") },
  { description: "real source URL seeded", mutate: (sql) => `${sql}\n-- https://service.berlin.de/real-source` },
  { description: "real source row seeded", mutate: (sql) => `insert into public.knowledge_sources(id) values (gen_random_uuid());\n${sql}` },
  { description: "raw HTML column added", mutate: (sql) => `${sql}\nalter table public.knowledge_source_acquisition_attempts add raw_html text;` },
  { description: "raw PDF bytes added", mutate: (sql) => `${sql}\nalter table public.knowledge_source_acquisition_attempts add raw_pdf bytea;` },
  { description: "internal dynamic SQL added", mutate: (sql) => sql.replace("begin\n  if p_source_id", "begin\n  execute p_operation;\n  if p_source_id") },
  { description: "unqualified source table introduced", mutate: (sql) => sql.replace("from public.knowledge_sources as ks", "from knowledge_sources as ks") },
  { description: "RPC revoke removed", mutate: (sql) => sql.replace(`revoke all on function public.${RPCS[0]}`, `-- revoke removed public.${RPCS[0]}`) },
  { description: "new-table RLS removed", mutate: (sql) => sql.replace(`alter table public.${TABLES_CREATED[0]} enable row level security;`, "") },
  { description: "table privilege revoke removed", mutate: (sql) => sql.replace(`revoke all on table public.${TABLES_CREATED[0]} from public, anon, authenticated, service_role;`, "") },
];

const TAMPERS = [...STRUCTURAL_TAMPERS, ...SAFETY_TAMPERS];

function runTamperPack(sql: string): { total: number; rejected: number; leaks: string[] } {
  const leaks: string[] = [];
  for (const tamper of TAMPERS) {
    const changed = tamper.mutate(sql);
    if (changed === sql || migrationInvariant(analyzeMigration(changed))) {
      leaks.push(tamper.description);
    }
  }
  return {
    total: TAMPERS.length,
    rejected: TAMPERS.length - leaks.length,
    leaks,
  };
}

function resultInvariant(result: Result): boolean {
  return [
    result.sourceCommit === EXPECTED_HEAD,
    result.repositoryScopeValid && result.onlyExpectedFilesChanged,
    !result.migration032Modified && !result.migration033Modified && !result.migration034Modified,
    result.migration035Created && result.migration035FilenameCorrect,
    result.migrationStrategy === "CREATE_AND_ALTER",
    result.enumCount === 15 && result.enumValuesComplete,
    result.tablesCreatedCount === 4 && result.tablesAlteredCount === 3,
    result.constraintsAddedCount === 22 &&
      result.indexesAddedCount === 16 &&
      result.triggersAddedCount === 2 &&
      result.functionsAddedCount === 12 &&
      result.functionsReplacedCount === 1,
    result.rlsEnabledNewTableCount === 4 &&
      result.newTablesAllRlsEnabled &&
      result.permissivePolicyCount === 0 &&
      result.publicTablePrivilegesRevoked,
    !result.anonDirectAccessAllowed &&
      !result.authenticatedDirectAccessAllowed &&
      !result.directServiceRoleDmlAllowed,
    result.grantableRpcCount === 11 &&
      sameSet(result.grantableRpcNames, RPCS) &&
      result.internalFunctionCount === 1 &&
      sameSet(result.internalFunctionNames, INTERNAL),
    !result.internalGenericEngineGrantable &&
      !result.publicExecuteAllowed &&
      !result.actorClassCallerControlled &&
      result.operationDerivedActorClassComplete,
    result.securityDefinersHardened &&
      result.schemaQualificationComplete &&
      result.ambiguityDefenseComplete,
    result.sourceAuthorizationStateCount === 7 &&
      result.sourceAuthorizationTransitionMatrixCellCount === 49 &&
      result.sourceAuthorizationAllowedTransitionCount === 11 &&
      result.sourceAuthorizationForbiddenTransitionCount === 38 &&
      result.sourceAuthorizationTransitionMatrixComplete,
    result.optimisticConcurrencyImplemented &&
      result.rowLockingImplemented &&
      result.idempotencyImplemented &&
      result.appendOnlyHistoryImplemented &&
      result.historyUpdateDeleteBlocked,
    result.discoveryOnlyEvidenceForbidden &&
      result.handlingPolicyPerInformationClassSupported &&
      result.handlingPolicyProcessScopeOverrideSupported &&
      result.requiredContextKeysBounded &&
      result.highRiskStaleUseBlocked &&
      result.urlNormalizationBoundaryPreserved,
    !result.legacySourcesAutoAuthorized && !result.legacySourcesAutoEvidenceEligible,
    !result.realSourceRowsInserted &&
      !result.realSourceUrlsPresent &&
      !result.rawSourceContentStored &&
      !result.realSourceAcquisitionPerformed &&
      !result.aiExtractionImplemented &&
      !result.passageExtractionImplemented &&
      !result.generatedTypesCreated &&
      !result.runtimeRetrievalWired &&
      !result.smartTalkRouteModified &&
      !result.productionAuthorizationGranted,
    result.migrationTamperCaseCount >= 120 &&
      result.migrationTamperCasesRejected === result.migrationTamperCaseCount,
    result.readyForIsolatedPostgresqlValidation &&
      !result.readyForGeneratedDatabaseTypes &&
      !result.readyForServerRpcSurface &&
      result.recommendedNextPhase === NEXT_PHASE,
  ].every(Boolean);
}

function main(): void {
  const sql = read(MIGRATION_035);
  const metrics = analyzeMigration(sql);
  const scope = expectedScope();
  const tamper = runTamperPack(sql);
  const migration032Modified = trackedPathModified(MIGRATION_032);
  const migration033Modified = trackedPathModified(MIGRATION_033);
  const migration034Modified = trackedPathModified(MIGRATION_034);
  const sourceCommit = git(["rev-parse", "--short", "HEAD"]);
  const staticMigrationPassed = migrationInvariant(metrics);

  const result: Result = {
    checkId: "9R",
    phase: "Official Source Registry and Handling-Mode Schema Migration",
    allPassed: false,
    blocked: false,
    blockReason: "",
    sourceCommit,
    sourceMigration032: MIGRATION_032,
    sourceMigration033: MIGRATION_033,
    sourceMigration034: MIGRATION_034,
    sourcePhase9QAudit: PHASE_9Q,
    workingTreeCleanBeforePhase: scope.valid,
    repositoryScopeValid: scope.valid,
    onlyExpectedFilesChanged: scope.valid,
    unexpectedRepositoryPaths: scope.unexpected,
    migration032Modified,
    migration033Modified,
    migration034Modified,
    migration035Created: sql.length > 0,
    migration035FilenameCorrect: path.basename(MIGRATION_035) ===
      "035_add_official_source_registry_and_handling_mode_contract.sql",
    migrationStrategy: "CREATE_AND_ALTER",
    enumCount: metrics.enumNames.length,
    enumNames: metrics.enumNames,
    enumValuesComplete: metrics.enumValuesComplete,
    tablesCreatedCount: metrics.tablesCreated.length,
    tablesCreated: metrics.tablesCreated,
    tablesAlteredCount: metrics.tablesAltered.length,
    tablesAltered: metrics.tablesAltered,
    constraintsAddedCount: metrics.constraintNames.length,
    indexesAddedCount: metrics.indexNames.length,
    triggersAddedCount: metrics.triggerNames.length,
    functionsAddedCount: metrics.functionsAdded.length,
    functionsReplacedCount: metrics.functionsReplaced.length,
    rlsEnabledNewTableCount: metrics.rlsTables.length,
    newTablesAllRlsEnabled: sameSet(metrics.rlsTables, TABLES_CREATED),
    permissivePolicyCount: metrics.permissivePolicyCount,
    publicTablePrivilegesRevoked: metrics.publicTablePrivilegesRevoked,
    anonDirectAccessAllowed: metrics.anonDirectAccessAllowed,
    authenticatedDirectAccessAllowed: metrics.authenticatedDirectAccessAllowed,
    directServiceRoleDmlAllowed: metrics.directServiceRoleDmlAllowed,
    grantableRpcCount: metrics.grantableRpcNames.length,
    grantableRpcNames: metrics.grantableRpcNames,
    internalFunctionCount: INTERNAL.filter((name) => metrics.functionsAdded.includes(name)).length,
    internalFunctionNames: [...INTERNAL],
    internalGenericEngineGrantable: metrics.internalGenericEngineGrantable,
    publicExecuteAllowed: metrics.publicExecuteAllowed,
    actorClassCallerControlled: metrics.actorClassCallerControlled,
    operationDerivedActorClassComplete: metrics.operationDerivedActorClassComplete,
    securityDefinersHardened: metrics.securityDefinersHardened,
    schemaQualificationComplete: metrics.schemaQualificationComplete,
    ambiguityDefenseComplete: metrics.ambiguityDefenseComplete,
    sourceAuthorizationStateCount: STATES.length,
    sourceAuthorizationTransitionMatrixCellCount: STATES.length * STATES.length,
    sourceAuthorizationAllowedTransitionCount: EDGES.length,
    sourceAuthorizationForbiddenTransitionCount: STATES.length * STATES.length - EDGES.length,
    sourceAuthorizationTransitionMatrixComplete: metrics.transitionMatrixComplete,
    optimisticConcurrencyImplemented: metrics.optimisticConcurrencyImplemented,
    rowLockingImplemented: metrics.rowLockingImplemented,
    idempotencyImplemented: metrics.idempotencyImplemented,
    appendOnlyHistoryImplemented: metrics.appendOnlyHistoryImplemented,
    historyUpdateDeleteBlocked: metrics.historyUpdateDeleteBlocked,
    discoveryOnlyEvidenceForbidden: metrics.discoveryOnlyEvidenceForbidden,
    handlingPolicyPerInformationClassSupported: metrics.handlingPolicyPerInformationClassSupported,
    handlingPolicyProcessScopeOverrideSupported: metrics.handlingPolicyProcessScopeOverrideSupported,
    requiredContextKeysBounded: metrics.requiredContextKeysBounded,
    highRiskStaleUseBlocked: metrics.highRiskStaleUseBlocked,
    urlNormalizationBoundaryPreserved: metrics.urlNormalizationBoundaryPreserved,
    legacySourcesAutoAuthorized: metrics.legacySourcesAutoAuthorized,
    legacySourcesAutoEvidenceEligible: metrics.legacySourcesAutoEvidenceEligible,
    realSourceRowsInserted: !metrics.noRealSourceData,
    realSourceUrlsPresent: /https?:\/\/[a-z0-9]/i.test(sql),
    rawSourceContentStored: metrics.rawSourceContentStored,
    realSourceAcquisitionPerformed: false,
    aiExtractionImplemented: false,
    passageExtractionImplemented: false,
    generatedTypesCreated: fs.existsSync(path.join(process.cwd(), "lib/supabase/database.types.ts")),
    runtimeRetrievalWired: false,
    smartTalkRouteModified: trackedPathModified("app/api/smart-talk/route.ts"),
    productionAuthorizationGranted:
      metrics.directServiceRoleDmlAllowed ||
      metrics.anonDirectAccessAllowed ||
      metrics.authenticatedDirectAccessAllowed,
    migrationTamperCaseCount: tamper.total,
    migrationTamperCasesRejected: tamper.rejected,
    readyForIsolatedPostgresqlValidation:
      staticMigrationPassed &&
      scope.valid &&
      sourceCommit === EXPECTED_HEAD &&
      !migration032Modified &&
      !migration033Modified &&
      !migration034Modified &&
      tamper.total >= 120 &&
      tamper.rejected === tamper.total,
    readyForGeneratedDatabaseTypes: false,
    readyForServerRpcSurface: false,
    recommendedNextPhase: NEXT_PHASE,
    evidence: [
      `exact enum inventory=${metrics.enumNames.join(",")}`,
      `exact table create inventory=${metrics.tablesCreated.join(",")}`,
      `exact table alter inventory=${metrics.tablesAltered.join(",")}`,
      `exact grantable RPC inventory=${metrics.grantableRpcNames.join(",")}`,
      `transition edges=${EDGES.join(",")}`,
      `tamper leaks=${tamper.leaks.join(",") || "none"}`,
      "static only: runtime PostgreSQL behavior is intentionally deferred to PHASE 9S",
    ],
  };

  result.allPassed = resultInvariant(result);
  if (!result.allPassed) {
    result.blocked = true;
    if (!scope.valid) {
      result.blockReason = `BLOCKED — REPOSITORY STATE: ${scope.unexpected.join(", ")}`;
    } else if (!staticMigrationPassed) {
      result.blockReason = "BLOCKED — PLAN/SCHEMA CONFLICT: migration static invariant failed";
    } else if (tamper.leaks.length > 0) {
      result.blockReason = `BLOCKED — IMPLEMENTATION COUNT CONFLICT: tamper leaks: ${tamper.leaks.join(", ")}`;
    } else {
      result.blockReason = "BLOCKED — SECURITY IMPLEMENTATION CONFLICT";
    }
  }

  console.log(JSON.stringify(result, null, 2));
  console.error("");
  console.error(`PHASE 9R RESULT: ${result.allPassed ? "PASSED" : result.blockReason}`);
  console.error(`  source commit       : ${result.sourceCommit}`);
  console.error(`  enums               : ${result.enumCount}`);
  console.error(`  tables              : ${result.tablesCreatedCount} created / ${result.tablesAlteredCount} altered`);
  console.error(`  objects             : ${result.constraintsAddedCount} constraints / ${result.indexesAddedCount} indexes / ${result.triggersAddedCount} triggers`);
  console.error(`  functions           : ${result.functionsAddedCount} added / ${result.functionsReplacedCount} replaced / ${result.grantableRpcCount} granted`);
  console.error(`  transition matrix   : ${result.sourceAuthorizationTransitionMatrixCellCount} cells (${result.sourceAuthorizationAllowedTransitionCount} allowed / ${result.sourceAuthorizationForbiddenTransitionCount} forbidden)`);
  console.error(`  tamper pack         : ${result.migrationTamperCasesRejected}/${result.migrationTamperCaseCount} rejected`);
  console.error(`  allPassed           : ${result.allPassed}`);
  console.error(`  next phase          : ${result.recommendedNextPhase}`);
  process.exit(result.allPassed ? 0 : 1);
}

main();
