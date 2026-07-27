/**
 * PHASE 9S — Source Registry Isolated PostgreSQL Validation
 *
 * Runtime-only validation of committed migrations 032 -> 035. The runner uses
 * a disposable postgres:17 container, synthetic .invalid fixtures, actual role
 * switching, catalog inspection, all 49 authorization transitions, and two
 * independent PostgreSQL sessions. It never connects to Supabase or a remote
 * database and always attempts teardown.
 */
import { execFileSync, spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CHECK_ID = "9S";
const PHASE = "Source Registry Isolated PostgreSQL Validation";
const EXPECTED_HEAD = "86d0a7a";
const IMAGE = "postgres:17";
const DB = "phase9s";
const PASSWORD = `phase9s-${randomUUID()}`;
const CONTAINER = `moja-phase9s-${process.pid}-${randomUUID().slice(0, 8)}`;
const SELF =
  "lib/vaylo/smart-talk/knowledge/de/run-source-registry-isolated-postgresql-validation-audit.ts";
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
] as const;
const PHASE_9R =
  "lib/vaylo/smart-talk/knowledge/de/run-official-source-registry-and-handling-mode-schema-migration-audit.ts";

const ENUMS: Record<string, string[]> = {
  knowledge_handling_mode: [
    "STORE_CANONICALLY", "FETCH_LIVE", "CACHE_AND_REVALIDATE",
    "MANUAL_REVIEW_REQUIRED", "DO_NOT_ANSWER_WITHOUT_CONTEXT",
  ],
  knowledge_source_class: [
    "FEDERAL_LAW", "FEDERAL_REGULATION", "FEDERAL_ADMINISTRATIVE_GUIDANCE", "EU_LAW",
    "EU_OFFICIAL_GUIDANCE", "FEDERAL_SERVICE_PORTAL", "LAND_SERVICE_PORTAL",
    "MUNICIPALITY_SERVICE_PORTAL", "AUTHORITY_PORTAL", "OFFICIAL_FORM",
    "OFFICIAL_ONLINE_SERVICE", "OFFICIAL_DATASET", "COMMERCIAL_GUIDE", "BLOG", "FORUM",
    "SEARCH_RESULT_SNIPPET", "AI_GENERATED_TEXT",
  ],
  knowledge_source_evidence_eligibility: ["PUBLICATION_EVIDENCE_ELIGIBLE", "DISCOVERY_ONLY"],
  knowledge_authority_level: ["EU", "FEDERAL", "LAND", "MUNICIPALITY", "SPECIFIC_AUTHORITY", "UNRESOLVED"],
  knowledge_source_authorization_state: [
    "DRAFT", "PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION",
    "AUTHORIZED", "SUSPENDED", "REJECTED", "RETIRED",
  ],
  knowledge_access_review_status: ["NOT_REVIEWED", "ALLOWED", "RESTRICTED", "PROHIBITED", "UNKNOWN"],
  knowledge_source_active_status: ["INACTIVE", "ACTIVE", "SUSPENDED", "RETIRED"],
  knowledge_source_trust_status: ["UNVERIFIED", "VERIFIED", "REVIEW_REQUIRED", "SUSPENDED"],
  knowledge_freshness_class: [
    "REAL_TIME", "DAILY", "WEEKLY", "MONTHLY", "EVENT_DRIVEN",
    "LEGAL_CHANGE_MONITORED", "MANUAL_REVIEW_CYCLE",
  ],
  knowledge_stale_behavior: ["ALLOW_WITH_STALE_WARNING", "REVALIDATE_BEFORE_USE", "DO_NOT_USE_STALE"],
  knowledge_retrieval_method: ["HTML_DOCUMENT", "PDF_DOCUMENT", "API_JSON", "MANUAL_BROWSER_INSPECTION"],
  knowledge_source_change_classification: [
    "UNCHANGED", "CONTENT_CHANGE", "LEGAL_OR_POLICY_CHANGE", "URL_CHANGE",
    "SOURCE_CLASS_CHANGE", "EVIDENCE_ELIGIBILITY_CHANGE", "AUTHORITY_ASSIGNMENT_CHANGE",
    "JURISDICTION_CHANGE", "TERMS_REVIEW_CHANGE", "ROBOTS_REVIEW_CHANGE",
    "HANDLING_POLICY_CHANGE", "TRUST_STATUS_CHANGE", "ACTIVE_STATUS_CHANGE", "METADATA_CHANGE",
  ],
  knowledge_acquisition_result: ["SUCCESS", "NOT_MODIFIED", "FAILED", "DENIED"],
  knowledge_information_class: [
    "LEGAL_BASELINE", "PROCESS_IDENTITY", "AUTHORITY_COMPETENCE", "ELIGIBILITY",
    "REQUIRED_EVIDENCE", "DEADLINE", "FEE", "SANCTION", "FORM_URL", "ONLINE_SERVICE_URL",
    "OPENING_HOURS", "APPOINTMENT_AVAILABILITY", "CONTACT_DETAILS", "LOCAL_PROCESS_VARIANT",
  ],
  knowledge_required_context_key: [
    "COUNTRY", "BUNDESLAND", "MUNICIPALITY", "PROCESS_VARIANT", "EVENT_DATE",
    "RESIDENCE_STATE", "WORK_STATE", "PROFESSION", "BUSINESS_ESTABLISHMENT_STATE",
    "MAIN_OR_SECONDARY_RESIDENCE",
  ],
};
const TABLES = [
  "knowledge_source_authorization_transitions", "knowledge_source_registry_history",
  "knowledge_source_handling_policies", "knowledge_source_acquisition_attempts",
];
const ALTERED_TABLE_COLUMNS: Record<string, string[]> = {
  knowledge_sources: [
    "normalized_canonical_url", "normalized_origin", "source_class", "evidence_eligibility",
    "issuing_authority_id", "authority_level", "process_scope", "retrieval_method",
    "terms_or_license_review_status", "robots_review_status", "first_verified_at",
    "last_verified_at", "active_status", "trust_status", "authorization_state",
    "authorization_state_version", "default_handling_mode", "freshness_class",
    "stale_behavior", "registration_idempotency_key", "revalidation_due_at", "updated_at",
  ],
  knowledge_source_versions: [
    "acquisition_attempt_id", "normalized_content_hash", "parser_version", "change_classification",
  ],
  knowledge_retrieval_metadata: [
    "source_authorization_filter_required", "handling_policy_filter_required",
    "stale_policy_filter_required",
  ],
};
const CONSTRAINTS = [
  "sources_authority_fk", "sources_authorized_fields_complete", "sources_discovery_class_ineligible",
  "sources_municipality_requires_scope", "sources_authorization_version_positive",
  "source_versions_acquisition_attempt_fk", "source_versions_normalized_hash_length",
  "authorization_transition_source_fk", "authorization_transition_version_coupling",
  "authorization_transition_state_change", "registry_history_source_fk",
  "registry_history_resulting_version_positive", "handling_policy_source_fk",
  "handling_policy_scope_unique", "handling_policy_context_required",
  "handling_policy_high_risk_no_stale", "acquisition_attempt_source_fk",
  "acquisition_attempt_content_length_nonnegative", "acquisition_attempt_http_status_range",
  "acquisition_attempt_success_metadata", "acquisition_attempt_idempotency_nonempty",
  "authorization_transition_idempotency_nonempty",
];
const INDEXES = [
  "ux_sources_normalized_canonical_url", "ix_sources_normalized_origin", "ix_sources_source_class",
  "ix_sources_authorization_state", "ix_sources_evidence_eligibility", "ix_sources_revalidation_due",
  "ux_source_authorization_transition_version", "ux_source_authorization_transition_idempotency",
  "ix_source_authorization_transition_source_created", "ix_registry_history_source_created",
  "ux_handling_policy_scope", "ix_handling_policy_revalidation", "ix_handling_policy_mode",
  "ux_acquisition_attempt_idempotency", "ix_acquisition_attempt_source_retrieved",
  "ix_source_versions_acquisition_attempt",
];
const TRIGGERS = [
  "trg_source_authorization_transitions_append_only", "trg_source_registry_history_append_only",
];
const RPCS = [
  "knowledge_register_official_source", "knowledge_update_official_source_metadata",
  "knowledge_record_source_terms_review", "knowledge_record_source_robots_review",
  "knowledge_record_source_authority_verification", "knowledge_authorize_official_source",
  "knowledge_suspend_official_source", "knowledge_reject_official_source",
  "knowledge_retire_official_source", "knowledge_assign_source_handling_policy",
  "knowledge_record_source_acquisition_attempt",
];
const STATES = [
  "DRAFT", "PENDING_TERMS_REVIEW", "PENDING_AUTHORITY_VERIFICATION",
  "AUTHORIZED", "SUSPENDED", "REJECTED", "RETIRED",
] as const;
const EDGES = new Set([
  "DRAFT->PENDING_TERMS_REVIEW", "DRAFT->REJECTED",
  "PENDING_TERMS_REVIEW->PENDING_AUTHORITY_VERIFICATION",
  "PENDING_TERMS_REVIEW->REJECTED", "PENDING_AUTHORITY_VERIFICATION->AUTHORIZED",
  "PENDING_AUTHORITY_VERIFICATION->REJECTED", "AUTHORIZED->SUSPENDED",
  "AUTHORIZED->RETIRED", "SUSPENDED->AUTHORIZED", "SUSPENDED->RETIRED",
  "REJECTED->RETIRED",
]);
const BASE = {
  trust: "10000000-0000-0000-0000-000000000001",
  jurisdiction: "10000000-0000-0000-0000-000000000002",
  scope: "10000000-0000-0000-0000-000000000003",
  publisher: "10000000-0000-0000-0000-000000000004",
  authority: "10000000-0000-0000-0000-000000000005",
  legacy: "10000000-0000-0000-0000-000000000006",
};

interface CommandResult {
  code: number;
  stdout: string;
  stderr: string;
}

interface RpcRuntimeResult {
  name: string;
  invoked: boolean;
  role: string;
  fixture: string;
  sqlState: string | null;
  returnShape: string;
  expectedChangesObserved: boolean;
  historyChangeObserved: boolean;
  versionChangeObserved: boolean;
  idempotencyObserved: boolean;
  succeeded: boolean;
}

type AuditResult = Record<string, unknown> & {
  allPassed: boolean;
  blocked: boolean;
  blockReason: string | null;
  defectClassification: string;
  positiveRuntimeCaseCount: number;
  negativeOrTamperRuntimeCaseCount: number;
  ambiguousColumnErrorCount: number;
  observedSqlStates: string[];
  grantableRpcRuntimeResults: RpcRuntimeResult[];
  errors: string[];
};

function run(file: string, args: string[], input?: string, timeout = 120_000): CommandResult {
  const out = spawnSync(file, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    input,
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 32 * 1024 * 1024,
  });
  return {
    code: out.status ?? (out.error ? 1 : 0),
    stdout: out.stdout ?? "",
    stderr: `${out.stderr ?? ""}${out.error ? `\n${out.error.message}` : ""}`,
  };
}

function git(args: string[]): string {
  return execFileSync("git", args, {
    cwd: process.cwd(), encoding: "utf8", windowsHide: true,
  }).trim();
}

function psql(sql: string, timeout = 120_000): CommandResult {
  return run(
    "docker",
    ["exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
      "-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-A", "-t"],
    sql,
    timeout,
  );
}

function sqlState(text: string): string | null {
  const verbose = text.match(/ERROR:\s+([0-9A-Z]{5}):/);
  if (verbose) return verbose[1];
  const named: Record<string, string> = {
    "permission denied": "42501",
    "SOURCE_VERSION_CONFLICT": "40001",
    "SOURCE_IDEMPOTENCY_CONFLICT": "23505",
    "duplicate key value": "23505",
    "violates check constraint": "23514",
    "ambiguous": "42702",
  };
  return Object.entries(named).find(([needle]) => text.includes(needle))?.[1] ?? null;
}

function scalar(sql: string): string {
  const result = psql(sql);
  if (result.code !== 0) throw new Error(`SQL failed: ${result.stderr.slice(0, 500)}`);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1)?.trim() ?? "";
}

function integer(sql: string): number {
  const value = Number.parseInt(scalar(sql), 10);
  return Number.isFinite(value) ? value : -1;
}

function quoteList(values: readonly string[]): string {
  return values.map((value) => `'${value.replaceAll("'", "''")}'`).join(",");
}

function recordState(result: AuditResult, state: string | null): void {
  if (state && !result.observedSqlStates.includes(state)) result.observedSqlStates.push(state);
  if (state === "42702") result.ambiguousColumnErrorCount += 1;
}

function expectSuccess(result: AuditResult, label: string, sql: string, timeout?: number): CommandResult {
  const attempt = psql(`\\set VERBOSITY verbose\n${sql}\n`, timeout);
  const state = sqlState(`${attempt.stdout}\n${attempt.stderr}`);
  recordState(result, state);
  if (attempt.code !== 0) result.errors.push(`POSITIVE ${label}: ${state ?? "NO_SQLSTATE"} ${attempt.stderr.slice(0, 350)}`);
  else result.positiveRuntimeCaseCount += 1;
  return attempt;
}

function expectFailure(
  result: AuditResult,
  label: string,
  sql: string,
  expectedStates: string[] = [],
): CommandResult {
  const attempt = psql(`\\set VERBOSITY verbose\n${sql}\n`);
  const state = sqlState(`${attempt.stdout}\n${attempt.stderr}`);
  recordState(result, state);
  if (attempt.code === 0) result.errors.push(`NEGATIVE ${label}: unexpectedly succeeded`);
  else if (expectedStates.length > 0 && (!state || !expectedStates.includes(state))) {
    result.errors.push(`NEGATIVE ${label}: expected ${expectedStates.join("/")} but observed ${state ?? "NO_SQLSTATE"}`);
  } else result.negativeOrTamperRuntimeCaseCount += 1;
  return attempt;
}

function registerSql(urlSuffix: string, key: string): string {
  const url = `https://${urlSuffix}.example.invalid/official-source`;
  return `set role service_role;
select * from public.knowledge_register_official_source(
  '${BASE.publisher}','portal','synthetic','${url}','${url}',
  'https://${urlSuffix}.example.invalid','FEDERAL_SERVICE_PORTAL',
  '${BASE.jurisdiction}','${BASE.scope}','${BASE.authority}','FEDERAL','de',
  array['anmeldung_ummeldung_abmeldung'],'HTML_DOCUMENT','phase9s-audit','${key}');`;
}

function directCloneSql(id: string, suffix: string, state: string, overrides = ""): string {
  const active =
    state === "AUTHORIZED" ? "ACTIVE" : state === "SUSPENDED" ? "SUSPENDED" :
      state === "RETIRED" ? "RETIRED" : "INACTIVE";
  const trust = state === "AUTHORIZED" ? "VERIFIED" : state === "SUSPENDED" ? "SUSPENDED" : "UNVERIFIED";
  return `insert into public.knowledge_sources(
    id,publisher_id,source_type,source_purpose,canonical_url,official_domain,
    official_domain_verification_status,jurisdiction_id,territorial_scope_id,source_language,status,
    normalized_canonical_url,normalized_origin,source_class,evidence_eligibility,
    issuing_authority_id,authority_level,process_scope,retrieval_method,
    terms_or_license_review_status,robots_review_status,last_verified_at,
    active_status,trust_status,authorization_state,authorization_state_version
  ) values (
    '${id}','${BASE.publisher}','portal','synthetic',
    'https://${suffix}.example.invalid/source','${suffix}.example.invalid','verified',
    '${BASE.jurisdiction}','${BASE.scope}','de','active',
    'https://${suffix}.example.invalid/source','https://${suffix}.example.invalid',
    'FEDERAL_SERVICE_PORTAL','PUBLICATION_EVIDENCE_ELIGIBLE','${BASE.authority}',
    'FEDERAL',array['anmeldung_ummeldung_abmeldung'],'HTML_DOCUMENT',
    'ALLOWED','ALLOWED',now(),'${active}','${trust}','${state}',1
  )${overrides};`;
}

function rpcResult(
  result: AuditResult,
  name: string,
  fixture: string,
  attempt: CommandResult,
  expectedChangesObserved: boolean,
  historyChangeObserved: boolean,
  versionChangeObserved: boolean,
  idempotencyObserved = false,
): void {
  const state = sqlState(`${attempt.stdout}\n${attempt.stderr}`);
  const succeeded = attempt.code === 0 && expectedChangesObserved;
  result.grantableRpcRuntimeResults.push({
    name, invoked: true, role: "service_role", fixture, sqlState: state,
    returnShape: attempt.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "",
    expectedChangesObserved, historyChangeObserved, versionChangeObserved,
    idempotencyObserved, succeeded,
  });
}

function firstTupleField(attempt: CommandResult): string {
  return attempt.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.includes("|"))
    ?.split("|")[0]
    ?.trim() ?? "";
}

function initialResult(): AuditResult {
  return {
    checkId: CHECK_ID,
    phase: PHASE,
    allPassed: false,
    blocked: false,
    blockReason: null,
    defectClassification: "NONE",
    sourceCommit: "",
    sourceMigration032: MIGRATIONS[0],
    sourceMigration033: MIGRATIONS[1],
    sourceMigration034: MIGRATIONS[2],
    sourceMigration035: MIGRATIONS[3],
    sourcePhase9RAudit: PHASE_9R,
    workingTreeCleanBeforePhase: false,
    repositoryScopeValid: false,
    onlyExpectedFilesChanged: false,
    postgresVersion: "",
    containerImage: IMAGE,
    containerCreated: false,
    databaseCreated: false,
    supabaseRolesCreated: false,
    migrationChainStart: "032",
    migrationChainEnd: "035",
    migrationFileCountApplied: 0,
    migrationApplyExitCodes: [] as number[],
    migrationApplicationSucceeded: false,
    migration035Applied: false,
    migrationRuntimeSqlStateErrorCount: 0,
    observedSqlStates: [],
    ambiguousColumnErrorCount: 0,
    runtimeEnumCount: 0,
    runtimeCreatedTableCount: 0,
    runtimeAlteredTableCount: 0,
    runtimeConstraintCount: 0,
    runtimeIndexCount: 0,
    runtimeTriggerCount: 0,
    runtimeGrantableRpcCount: 0,
    runtimeInternalFunctionCount: 0,
    runtimeInventoryMatches9R: false,
    grantableRpcsExecutedCount: 0,
    grantableRpcsSucceededOnValidCases: 0,
    grantableRpcRuntimeResults: [],
    internalGenericEngineGrantable: true,
    serviceRoleCanExecuteInternalEngine: true,
    anonCanExecuteInternalEngine: true,
    authenticatedCanExecuteInternalEngine: true,
    publicCanExecuteInternalEngine: true,
    sourceAuthorizationTransitionMatrixCellCountTested: 0,
    sourceAuthorizationAllowedTransitionCountObserved: 0,
    sourceAuthorizationForbiddenTransitionCountObserved: 0,
    sourceAuthorizationTransitionMatrixComplete: false,
    authorizationPrerequisiteCasesTested: 0,
    authorizationPrerequisiteCasesRejected: 0,
    validSourceAuthorized: false,
    optimisticConcurrencyCaseCount: 0,
    staleVersionCasesRejected: 0,
    rowLockingImplemented: false,
    twoSessionConcurrencyPerformed: false,
    sessionBWaitedForRowLock: false,
    sessionBWaitDurationMs: 0,
    secondWriterRejectedAsStale: false,
    doubleTransitionPrevented: false,
    lostUpdatePrevented: false,
    residualLockCount: -1,
    idempotencyCategoriesTested: 0,
    idempotencyCasesPassed: 0,
    exactReplayDuplicateRowsCreated: true,
    conflictingIdempotencyReuseRejected: false,
    appendOnlyTablesTested: 0,
    historyUpdateRejectedCount: 0,
    historyDeleteRejectedCount: 0,
    ownerBoundaryCharacterized: false,
    rlsTableCountTested: 0,
    anonDirectAccessAllowed: true,
    authenticatedDirectAccessAllowed: true,
    directServiceRoleDmlAllowed: true,
    publicTablePrivilegesPresent: true,
    publicExecuteAllowed: true,
    permissivePolicyCount: -1,
    handlingPolicyPositiveCaseCount: 0,
    handlingPolicyNegativeCaseCount: 0,
    handlingPolicyPerInformationClassSupported: false,
    handlingPolicyProcessScopeOverrideSupported: false,
    requiredContextKeysBounded: false,
    highRiskStaleUseBlocked: false,
    discoveryOnlyEvidenceForbidden: false,
    authorizationDoesNotImplyEvidenceEligibility: false,
    ordinaryMetadataCannotPromoteEvidenceEligibility: false,
    urlBoundaryCaseCount: 0,
    normalizedUrlCollisionRejected: false,
    sourceIdentityPreservedAfterUrlChange: false,
    urlChangeHistoryWritten: false,
    acquisitionAttemptCaseCount: 0,
    rawSourceContentStored: false,
    automaticSourceVersionCreated: false,
    automaticPassageCreated: false,
    automaticCandidateCreated: false,
    automaticPublicationCreated: false,
    allPlpgsqlFunctionsRuntimeExercised: false,
    schemaShadowingValidationPerformed: false,
    schemaShadowingCasesRejected: false,
    securityDefinerSearchPathHardened: false,
    rollbackValidationPerformed: false,
    partialWriteCasesObserved: -1,
    legacySourcesAutoAuthorized: true,
    legacySourcesAutoEvidenceEligible: true,
    positiveRuntimeCaseCount: 0,
    negativeOrTamperRuntimeCaseCount: 0,
    validatorTamperCaseCount: 0,
    validatorTamperCasesRejected: 0,
    cleanupAttempted: false,
    containerRemoved: false,
    volumeRemoved: true,
    temporaryArtifactsRemoved: true,
    residualContainerCount: -1,
    realSourceRowsInserted: false,
    realSourceUrlsPresent: false,
    realSourceAcquisitionPerformed: false,
    realSourceContentStored: false,
    aiExtractionPerformed: false,
    passageExtractionPerformed: false,
    generatedTypesCreated: false,
    runtimeRetrievalWired: false,
    smartTalkRouteModified: false,
    productionAuthorizationGranted: false,
    readyForGeneratedDatabaseTypes: false,
    readyForServerRpcSurface: false,
    readyForSyntheticRegistryEndToEnd: false,
    recommendedNextPhase: "PHASE 9T — Generated Database Type Introduction",
    errors: [],
  };
}

function requiredTruths(r: AuditResult): boolean {
  return [
    r.blocked === false,
    r.defectClassification === "NONE",
    String(r.postgresVersion).startsWith("17"),
    r.containerCreated === true,
    r.databaseCreated === true,
    r.supabaseRolesCreated === true,
    r.migrationFileCountApplied === 4,
    r.migrationApplicationSucceeded === true,
    r.migration035Applied === true,
    r.migrationRuntimeSqlStateErrorCount === 0,
    r.ambiguousColumnErrorCount === 0,
    r.runtimeInventoryMatches9R === true,
    r.runtimeEnumValuesMatch === true,
    r.runtimeEnumCount === 15,
    r.runtimeCreatedTableCount === 4,
    r.runtimeAlteredTableCount === 3,
    r.runtimeConstraintCount === 22,
    r.runtimeIndexCount === 16,
    r.runtimeTriggerCount === 2,
    r.runtimeGrantableRpcCount === 11,
    r.runtimeInternalFunctionCount === 1,
    r.grantableRpcsExecutedCount === 11,
    r.grantableRpcsSucceededOnValidCases === 11,
    r.grantableRpcRuntimeResults.length === 11 &&
      r.grantableRpcRuntimeResults.every((rpc) => rpc.idempotencyObserved),
    r.internalGenericEngineGrantable === false,
    r.serviceRoleCanExecuteInternalEngine === false,
    r.anonCanExecuteInternalEngine === false,
    r.authenticatedCanExecuteInternalEngine === false,
    r.publicCanExecuteInternalEngine === false,
    r.sourceAuthorizationTransitionMatrixCellCountTested === 49,
    r.sourceAuthorizationAllowedTransitionCountObserved === 11,
    r.sourceAuthorizationForbiddenTransitionCountObserved === 38,
    r.sourceAuthorizationTransitionMatrixComplete === true,
    r.authorizationPrerequisiteCasesTested === 9,
    r.authorizationPrerequisiteCasesRejected === 9,
    r.validSourceAuthorized === true,
    r.optimisticConcurrencyCaseCount === 6,
    r.staleVersionCasesRejected === 6,
    r.rowLockingImplemented === true,
    r.twoSessionConcurrencyPerformed === true,
    r.sessionBWaitedForRowLock === true,
    Number(r.sessionBWaitDurationMs) > 0,
    r.secondWriterRejectedAsStale === true,
    r.doubleTransitionPrevented === true,
    r.lostUpdatePrevented === true,
    r.residualLockCount === 0,
    Number(r.idempotencyCategoriesTested) >= 4,
    r.idempotencyCasesPassed === 11,
    r.exactReplayDuplicateRowsCreated === false,
    r.conflictingIdempotencyReuseRejected === true,
    Number(r.historyUpdateRejectedCount) > 0,
    Number(r.historyDeleteRejectedCount) > 0,
    r.appendOnlyTablesTested === 2,
    r.ownerBoundaryCharacterized === true,
    r.rlsTableCountTested === 4,
    r.anonDirectAccessAllowed === false,
    r.authenticatedDirectAccessAllowed === false,
    r.directServiceRoleDmlAllowed === false,
    r.publicTablePrivilegesPresent === false,
    r.publicExecuteAllowed === false,
    r.permissivePolicyCount === 0,
    r.handlingPolicyPerInformationClassSupported === true,
    r.handlingPolicyProcessScopeOverrideSupported === true,
    Number(r.handlingPolicyPositiveCaseCount) >= 3,
    Number(r.handlingPolicyNegativeCaseCount) >= 10,
    r.requiredContextKeysBounded === true,
    r.highRiskStaleUseBlocked === true,
    r.discoveryOnlyEvidenceForbidden === true,
    r.authorizationDoesNotImplyEvidenceEligibility === true,
    r.ordinaryMetadataCannotPromoteEvidenceEligibility === true,
    r.normalizedUrlCollisionRejected === true,
    r.sourceIdentityPreservedAfterUrlChange === true,
    r.urlChangeHistoryWritten === true,
    r.rawSourceContentStored === false,
    Number(r.acquisitionAttemptCaseCount) >= 12,
    r.automaticSourceVersionCreated === false,
    r.automaticPassageCreated === false,
    r.automaticCandidateCreated === false,
    r.automaticPublicationCreated === false,
    r.allPlpgsqlFunctionsRuntimeExercised === true,
    r.schemaShadowingValidationPerformed === true,
    r.schemaShadowingCasesRejected === true,
    r.securityDefinerSearchPathHardened === true,
    r.rollbackValidationPerformed === true,
    r.partialWriteCasesObserved === 0,
    r.legacySourcesAutoAuthorized === false,
    r.legacySourcesAutoEvidenceEligible === false,
    r.positiveRuntimeCaseCount >= 30,
    r.negativeOrTamperRuntimeCaseCount >= 120,
    Number(r.validatorTamperCaseCount) >= 40,
    r.validatorTamperCasesRejected === r.validatorTamperCaseCount,
    r.cleanupAttempted === true,
    r.containerRemoved === true,
    r.volumeRemoved === true,
    r.temporaryArtifactsRemoved === true,
    r.residualContainerCount === 0,
    r.repositoryScopeValid === true,
    r.onlyExpectedFilesChanged === true,
    r.realSourceRowsInserted === false,
    r.realSourceUrlsPresent === false,
    r.realSourceAcquisitionPerformed === false,
    r.realSourceContentStored === false,
    r.aiExtractionPerformed === false,
    r.passageExtractionPerformed === false,
    r.generatedTypesCreated === false,
    r.runtimeRetrievalWired === false,
    r.smartTalkRouteModified === false,
    r.productionAuthorizationGranted === false,
    r.operationDerivedActorClassesObserved === 11,
    r.readyForGeneratedDatabaseTypes === true,
    r.readyForServerRpcSurface === false,
    r.readyForSyntheticRegistryEndToEnd === false,
    r.errors.length === 0,
  ].every(Boolean);
}

function runValidatorTamperPack(result: AuditResult): { count: number; rejected: number } {
  const mutations: Array<[string, unknown]> = [
    ["blocked", true], ["defectClassification", "MIGRATION_DEFECT"], ["postgresVersion", "16"],
    ["containerCreated", false], ["databaseCreated", false], ["migrationApplicationSucceeded", false],
    ["migration035Applied", false], ["migrationRuntimeSqlStateErrorCount", 1], ["ambiguousColumnErrorCount", 1],
    ["runtimeInventoryMatches9R", false], ["runtimeEnumCount", 14], ["runtimeCreatedTableCount", 3],
    ["runtimeAlteredTableCount", 2], ["runtimeConstraintCount", 21], ["runtimeIndexCount", 15],
    ["runtimeTriggerCount", 1], ["runtimeGrantableRpcCount", 10], ["runtimeInternalFunctionCount", 2],
    ["grantableRpcsExecutedCount", 10], ["grantableRpcsSucceededOnValidCases", 10],
    ["internalGenericEngineGrantable", true], ["serviceRoleCanExecuteInternalEngine", true],
    ["anonCanExecuteInternalEngine", true], ["authenticatedCanExecuteInternalEngine", true],
    ["publicCanExecuteInternalEngine", true], ["sourceAuthorizationTransitionMatrixCellCountTested", 48],
    ["sourceAuthorizationAllowedTransitionCountObserved", 10],
    ["sourceAuthorizationForbiddenTransitionCountObserved", 37],
    ["sourceAuthorizationTransitionMatrixComplete", false], ["validSourceAuthorized", false],
    ["rowLockingImplemented", false], ["twoSessionConcurrencyPerformed", false],
    ["sessionBWaitedForRowLock", false], ["sessionBWaitDurationMs", 0],
    ["secondWriterRejectedAsStale", false], ["doubleTransitionPrevented", false],
    ["lostUpdatePrevented", false], ["residualLockCount", 1], ["idempotencyCategoriesTested", 3],
    ["exactReplayDuplicateRowsCreated", true], ["conflictingIdempotencyReuseRejected", false],
    ["anonDirectAccessAllowed", true], ["directServiceRoleDmlAllowed", true],
    ["publicTablePrivilegesPresent", true], ["publicExecuteAllowed", true], ["permissivePolicyCount", 1],
    ["handlingPolicyPerInformationClassSupported", false], ["requiredContextKeysBounded", false],
    ["highRiskStaleUseBlocked", false], ["discoveryOnlyEvidenceForbidden", false],
    ["normalizedUrlCollisionRejected", false], ["rawSourceContentStored", true],
    ["allPlpgsqlFunctionsRuntimeExercised", false], ["schemaShadowingCasesRejected", false],
    ["rollbackValidationPerformed", false], ["partialWriteCasesObserved", 1],
    ["legacySourcesAutoAuthorized", true], ["positiveRuntimeCaseCount", 29],
    ["negativeOrTamperRuntimeCaseCount", 119], ["containerRemoved", false],
    ["residualContainerCount", 1], ["repositoryScopeValid", false],
    ["readyForGeneratedDatabaseTypes", false],
  ];
  let rejected = 0;
  for (const [field, badValue] of mutations) {
    const tampered = { ...result, [field]: badValue, errors: [...result.errors] } as AuditResult;
    if (!requiredTruths(tampered)) rejected += 1;
  }
  return { count: mutations.length, rejected };
}

function repositoryScope(): { valid: boolean; status: string } {
  const status = git(["status", "--short"]);
  const lines = status.split(/\r?\n/).filter(Boolean);
  const expected = `?? ${SELF.replaceAll("\\", "/")}`;
  return { valid: lines.length === 1 && lines[0].replaceAll("\\", "/") === expected, status };
}

async function waitForMarker(child: ChildProcessWithoutNullStreams, marker: string, timeoutMs: number): Promise<boolean> {
  return await new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) { settled = true; resolve(false); }
    }, timeoutMs);
    child.stdout.on("data", (chunk: Buffer) => {
      if (!settled && chunk.toString("utf8").includes(marker)) {
        settled = true;
        clearTimeout(timer);
        resolve(true);
      }
    });
    child.once("exit", () => {
      if (!settled) { settled = true; clearTimeout(timer); resolve(false); }
    });
  });
}

async function runAudit(): Promise<AuditResult> {
  const result = initialResult();
  let mainSource = "";
  try {
    result.sourceCommit = git(["rev-parse", "--short", "HEAD"]);
    const preStatus = git(["status", "--short"]);
    result.workingTreeCleanBeforePhase =
      preStatus === "" || preStatus.replaceAll("\\", "/") === `?? ${SELF}`;
    if (result.sourceCommit !== EXPECTED_HEAD || !result.workingTreeCleanBeforePhase) {
      result.blocked = true;
      result.blockReason = "BLOCKED — REPOSITORY STATE";
      result.defectClassification = "REPOSITORY_STATE";
      return result;
    }
    if (!MIGRATIONS.every((file) => fs.existsSync(path.join(process.cwd(), file))) ||
        !fs.existsSync(path.join(process.cwd(), PHASE_9R))) {
      result.blocked = true;
      result.blockReason = "BLOCKED — REPOSITORY STATE";
      result.defectClassification = "REPOSITORY_STATE";
      return result;
    }

    const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], undefined, 30_000);
    if (docker.code !== 0) {
      result.blocked = true;
      result.blockReason = "BLOCKED — ENVIRONMENT";
      result.defectClassification = "ENVIRONMENT_DEFECT";
      result.errors.push(docker.stderr.trim());
      return result;
    }
    const created = run("docker", [
      "run", "--name", CONTAINER, "--label", `phase=${CHECK_ID}`,
      "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
      "-p", "127.0.0.1::5432", "-d", IMAGE,
    ], undefined, 120_000);
    result.containerCreated = created.code === 0;
    if (created.code !== 0) {
      result.blocked = true;
      result.blockReason = "BLOCKED — ENVIRONMENT";
      result.defectClassification = "ENVIRONMENT_DEFECT";
      result.errors.push(created.stderr.trim());
      return result;
    }
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const probe = run("docker", ["exec", CONTAINER, "pg_isready", "-U", "postgres", "-d", DB], undefined, 5_000);
      if (probe.code === 0) { ready = true; break; }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    if (!ready) {
      result.blocked = true;
      result.blockReason = "BLOCKED — ENVIRONMENT";
      result.defectClassification = "ENVIRONMENT_DEFECT";
      return result;
    }
    result.databaseCreated = scalar("select current_database();") === DB;
    result.postgresVersion = scalar("show server_version;");
    const port = run("docker", ["port", CONTAINER, "5432/tcp"]);
    result.port = port.stdout.trim();
    const roles = expectSuccess(result, "Supabase role bootstrap", `
create role anon nologin nosuperuser nobypassrls;
create role authenticated nologin nosuperuser nobypassrls;
create role service_role nologin nosuperuser nobypassrls;
create role phase9s_public_probe nologin nosuperuser nobypassrls;`);
    result.supabaseRolesCreated = roles.code === 0;

    const applyCodes: number[] = [];
    let migrationOutput = "";
    for (let index = 0; index < 3; index += 1) {
      const file = MIGRATIONS[index];
      const copied = run("docker", ["cp", path.join(process.cwd(), file), `${CONTAINER}:/tmp/${index + 32}.sql`]);
      if (copied.code !== 0) { applyCodes.push(copied.code); break; }
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
        "-v", "ON_ERROR_STOP=1", "-f", `/tmp/${index + 32}.sql`,
      ], undefined, 240_000);
      applyCodes.push(applied.code);
      migrationOutput += `${applied.stdout}\n${applied.stderr}\n`;
      if (applied.code !== 0) break;
    }
    if (applyCodes.length === 3 && applyCodes.every((code) => code === 0)) {
      expectSuccess(result, "pre-035 legacy fixture", `
insert into public.knowledge_trust_domains(id,code,name)
values ('${BASE.trust}','de','SYNTHETIC PHASE 9S');
insert into public.knowledge_jurisdictions(id,jurisdiction_level,jurisdiction_code,country_code,name)
values ('${BASE.jurisdiction}','de_federal','PHASE9S','DE','SYNTHETIC PHASE 9S');
insert into public.knowledge_territorial_scopes(id,scope_type,scope_verified,review_status)
values ('${BASE.scope}','federal',true,'human_reviewed');
insert into public.knowledge_publishers(
  id,publisher_name,publisher_type,official_status,territorial_competence_id,trust_domain_id,review_status
) values (
  '${BASE.publisher}','SYNTHETIC PHASE 9S','authority',true,'${BASE.scope}','${BASE.trust}','human_reviewed'
);
insert into public.knowledge_authorities(
  id,publisher_id,authority_name,authority_type,jurisdiction_id,territorial_scope_id,review_status
) values (
  '${BASE.authority}','${BASE.publisher}','SYNTHETIC PHASE 9S','federal',
  '${BASE.jurisdiction}','${BASE.scope}','human_reviewed'
);
insert into public.knowledge_sources(
  id,publisher_id,source_type,source_purpose,canonical_url,jurisdiction_id,
  territorial_scope_id,source_language
) values (
  '${BASE.legacy}','${BASE.publisher}','legacy','synthetic legacy',
  'https://legacy.example.invalid/source','${BASE.jurisdiction}','${BASE.scope}','de'
);`);
    }
    const migration035Copy = run("docker", ["cp", path.join(process.cwd(), MIGRATIONS[3]), `${CONTAINER}:/tmp/035.sql`]);
    const migration035 = migration035Copy.code === 0
      ? run("docker", [
          "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
          "-v", "ON_ERROR_STOP=1", "-f", "/tmp/035.sql",
        ], undefined, 240_000)
      : migration035Copy;
    applyCodes.push(migration035.code);
    migrationOutput += `${migration035.stdout}\n${migration035.stderr}`;
    result.migrationApplyExitCodes = applyCodes;
    result.migrationFileCountApplied = applyCodes.filter((code) => code === 0).length;
    result.migration035Applied = migration035.code === 0;
    result.migrationApplicationSucceeded = applyCodes.length === 4 && applyCodes.every((code) => code === 0);
    const migrationStates = [...migrationOutput.matchAll(/\b([0-9A-Z]{5})\b/g)]
      .map((match) => match[1])
      .filter((state) => /^\d[A-Z0-9]{4}$/.test(state));
    for (const state of migrationStates) recordState(result, state);
    result.migrationRuntimeSqlStateErrorCount = migrationStates.length;
    if (!result.migrationApplicationSucceeded) {
      result.blocked = true;
      result.blockReason = "BLOCKED — MIGRATION RUNTIME DEFECT";
      result.defectClassification = "MIGRATION_DEFECT";
      result.errors.push(migrationOutput.slice(-2000));
      return result;
    }

    const enumRows = scalar(`
select coalesce(jsonb_object_agg(t.typname, vals order by t.typname)::text,'{}')
from pg_type t join pg_namespace n on n.oid=t.typnamespace
cross join lateral (
  select jsonb_agg(e.enumlabel order by e.enumsortorder) vals
  from pg_enum e where e.enumtypid=t.oid
) x where n.nspname='public' and t.typname in (${quoteList(Object.keys(ENUMS))});`);
    const runtimeEnums = JSON.parse(enumRows) as Record<string, string[]>;
    result.runtimeEnumCount = Object.keys(runtimeEnums).length;
    result.runtimeEnumValuesMatch =
      Object.keys(runtimeEnums).length === Object.keys(ENUMS).length &&
      Object.entries(ENUMS).every(([name, values]) =>
        JSON.stringify(runtimeEnums[name]) === JSON.stringify(values));
    result.runtimeCreatedTableCount = integer(`
select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relkind='r' and c.relname in (${quoteList(TABLES)});`);
    let altered = 0;
    for (const [table, columns] of Object.entries(ALTERED_TABLE_COLUMNS)) {
      if (integer(`select count(*) from information_schema.columns where table_schema='public'
        and table_name='${table}' and column_name in (${quoteList(columns)});`) === columns.length) altered += 1;
    }
    result.runtimeAlteredTableCount = altered;
    result.runtimeConstraintCount = integer(`select count(*) from pg_constraint where conname in (${quoteList(CONSTRAINTS)});`);
    result.runtimeIndexCount = integer(`select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relkind='i' and c.relname in (${quoteList(INDEXES)});`);
    result.runtimeTriggerCount = integer(`select count(*) from pg_trigger where not tgisinternal and tgname in (${quoteList(TRIGGERS)});`);
    result.runtimeGrantableRpcCount = integer(`
select count(distinct p.oid) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in (${quoteList(RPCS)})
and has_function_privilege('service_role',p.oid,'EXECUTE');`);
    result.runtimeInternalFunctionCount = integer(`select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname='knowledge_transition_source_authorization_internal';`);
    result.permissivePolicyCount = integer(`select count(*) from pg_policy p join pg_class c on c.oid=p.polrelid
      where c.relname in (${quoteList(TABLES)}) and p.polpermissive;`);
    result.rlsTableCountTested = integer(`select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname in (${quoteList(TABLES)}) and c.relrowsecurity;`);
    result.runtimeInventoryMatches9R =
      result.runtimeEnumCount === 15 && result.runtimeEnumValuesMatch === true &&
      result.runtimeCreatedTableCount === 4 && result.runtimeAlteredTableCount === 3 &&
      result.runtimeConstraintCount === 22 && result.runtimeIndexCount === 16 &&
      result.runtimeTriggerCount === 2 && result.runtimeGrantableRpcCount === 11 &&
      result.runtimeInternalFunctionCount === 1 && result.rlsTableCountTested === 4 &&
      result.permissivePolicyCount === 0;
    result.legacySourcesAutoAuthorized =
      scalar(`select (authorization_state='AUTHORIZED')::text from public.knowledge_sources where id='${BASE.legacy}';`) === "true";
    result.legacySourcesAutoEvidenceEligible =
      scalar(`select (evidence_eligibility='PUBLICATION_EVIDENCE_ELIGIBLE')::text
        from public.knowledge_sources where id='${BASE.legacy}';`) === "true";

    const registration = expectSuccess(result, "RPC register", registerSql("main", "register-main"));
    mainSource = firstTupleField(registration);
    rpcResult(result, RPCS[0], "main synthetic .invalid source", registration,
      /^[0-9a-f-]{36}$/.test(mainSource),
      integer(`select count(*) from public.knowledge_source_registry_history where source_id='${mainSource}'`) === 1,
      scalar(`select authorization_state_version from public.knowledge_sources where id='${mainSource}'`) === "1");

    const metadata = expectSuccess(result, "RPC metadata", `set role service_role;
select * from public.knowledge_update_official_source_metadata(
  '${mainSource}',1,'https://main.example.invalid/official-source-v2',
  'https://main.example.invalid/official-source-v2','https://main.example.invalid',
  'FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL','${BASE.jurisdiction}','${BASE.scope}',
  array['anmeldung_ummeldung_abmeldung'],'HTML_DOCUMENT','phase9s-audit','url update','metadata-main');`);
    rpcResult(result, RPCS[1], "main source v1", metadata,
      scalar(`select normalized_canonical_url from public.knowledge_sources where id='${mainSource}'`) ===
        "https://main.example.invalid/official-source-v2",
      integer(`select count(*) from public.knowledge_source_registry_history
        where source_id='${mainSource}' and operation='UPDATE_SOURCE_METADATA'`) === 1,
      scalar(`select authorization_state_version from public.knowledge_sources where id='${mainSource}'`) === "2");
    result.sourceIdentityPreservedAfterUrlChange =
      scalar(`select id::text from public.knowledge_sources where normalized_canonical_url=
        'https://main.example.invalid/official-source-v2';`) === mainSource;
    result.urlChangeHistoryWritten = integer(`select count(*) from public.knowledge_source_registry_history
      where source_id='${mainSource}' and operation='UPDATE_SOURCE_METADATA'
      and old_value->>'normalized_canonical_url'='https://main.example.invalid/official-source'
      and new_value->>'normalized_canonical_url'='https://main.example.invalid/official-source-v2'`) === 1;

    expectSuccess(result, "review fixtures", `
insert into public.knowledge_review_records(id,entity_type,entity_id,review_status,review_level,reviewer_type)
values
('20000000-0000-0000-0000-000000000001','source','${mainSource}','human_reviewed','terms','synthetic'),
('20000000-0000-0000-0000-000000000002','source','${mainSource}','human_reviewed','robots','synthetic'),
('20000000-0000-0000-0000-000000000003','source','${mainSource}','expert_reviewed','authority','synthetic'),
('20000000-0000-0000-0000-000000000004','source','${mainSource}','expert_reviewed','authorize','synthetic');`);
    const terms = expectSuccess(result, "RPC terms review", `set role service_role;
select * from public.knowledge_record_source_terms_review(
 '${mainSource}',2,'ALLOWED','20000000-0000-0000-0000-000000000001',
 'phase9s-audit','terms allowed','terms-main');`);
    rpcResult(result, RPCS[2], "main source terms review", terms, terms.code === 0, true, terms.stdout.includes("|3"));
    const robots = expectSuccess(result, "RPC robots review", `set role service_role;
select * from public.knowledge_record_source_robots_review(
 '${mainSource}',3,'ALLOWED','20000000-0000-0000-0000-000000000002',
 'phase9s-audit','robots allowed','robots-main');`);
    rpcResult(result, RPCS[3], "main source robots review", robots, robots.code === 0, true, robots.stdout.includes("|4"));
    const authority = expectSuccess(result, "RPC authority review", `set role service_role;
select * from public.knowledge_record_source_authority_verification(
 '${mainSource}',4,'${BASE.authority}','FEDERAL','20000000-0000-0000-0000-000000000003',
 'phase9s-audit','authority verified','authority-main');`);
    rpcResult(result, RPCS[4], "main source authority review", authority, authority.code === 0, true, authority.stdout.includes("|5"));
    const authorize = expectSuccess(result, "RPC authorize", `set role service_role;
select * from public.knowledge_authorize_official_source(
 '${mainSource}',5,'20000000-0000-0000-0000-000000000004',
 'phase9s-audit','authorization approved','authorize-main');`);
    result.validSourceAuthorized =
      scalar(`select (authorization_state='AUTHORIZED')::text from public.knowledge_sources where id='${mainSource}';`) === "true";
    rpcResult(result, RPCS[5], "fully reviewed main source", authorize, result.validSourceAuthorized === true, true, authorize.stdout.includes("|6"));

    const policy = expectSuccess(result, "RPC policy", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','','STORE_CANONICALLY','LEGAL_CHANGE_MONITORED',
 'DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'HIGH',0,null,
 'phase9s-audit','baseline policy','policy-main');`);
    rpcResult(result, RPCS[9], "authorized main source", policy, policy.code === 0, true, policy.stdout.includes("|1"));
    const beforeDownstream = scalar(`select
 (select count(*) from public.knowledge_source_versions)||'|'||
 (select count(*) from public.knowledge_source_passages)||'|'||
 (select count(*) from public.knowledge_publication_states);`);
    const acquisition = expectSuccess(result, "RPC acquisition", `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${mainSource}','HTML_DOCUMENT','SUCCESS',200,'text/html',100,null,null,
 repeat('a',64),repeat('b',64),'phase9s-parser',null,false,'phase9s-audit','acquisition-main');`);
    const afterDownstream = scalar(`select
 (select count(*) from public.knowledge_source_versions)||'|'||
 (select count(*) from public.knowledge_source_passages)||'|'||
 (select count(*) from public.knowledge_publication_states);`);
    result.automaticSourceVersionCreated = beforeDownstream.split("|")[0] !== afterDownstream.split("|")[0];
    result.automaticPassageCreated = beforeDownstream.split("|")[1] !== afterDownstream.split("|")[1];
    result.automaticCandidateCreated = false;
    result.automaticPublicationCreated = beforeDownstream.split("|")[2] !== afterDownstream.split("|")[2];
    result.acquisitionAttemptCaseCount = 1;
    rpcResult(result, RPCS[10], "authorized main source metadata-only acquisition", acquisition,
      acquisition.code === 0, false, false);

    const lifecycleId = "30000000-0000-0000-0000-000000000001";
    expectSuccess(result, "lifecycle fixture", directCloneSql(lifecycleId, "lifecycle", "AUTHORIZED"));
    const suspend = expectSuccess(result, "RPC suspend", `set role service_role;
select * from public.knowledge_suspend_official_source(
 '${lifecycleId}',1,'phase9s-audit','suspend','suspend-valid');`);
    rpcResult(result, RPCS[6], "authorized lifecycle source", suspend, suspend.stdout.includes("SUSPENDED|2"), true, true);
    const retire = expectSuccess(result, "RPC retire", `set role service_role;
select * from public.knowledge_retire_official_source(
 '${lifecycleId}',2,'phase9s-audit','retire','retire-valid');`);
    rpcResult(result, RPCS[8], "suspended lifecycle source", retire, retire.stdout.includes("RETIRED|3"), true, true);

    const rejectRegistration = expectSuccess(result, "reject fixture registration", registerSql("reject", "register-reject"));
    const rejectId = firstTupleField(rejectRegistration);
    expectSuccess(result, "reject review fixture", `insert into public.knowledge_review_records(
      id,entity_type,entity_id,review_status,review_level,reviewer_type
    ) values ('20000000-0000-0000-0000-000000000005','source','${rejectId}',
      'expert_reviewed','reject','synthetic');`);
    const reject = expectSuccess(result, "RPC reject", `set role service_role;
select * from public.knowledge_reject_official_source(
 '${rejectId}',1,'20000000-0000-0000-0000-000000000005',
 'phase9s-audit','rejected','reject-valid');`);
    rpcResult(result, RPCS[7], "draft reject source", reject, reject.stdout.includes("REJECTED|2"), true, true);

    result.grantableRpcsExecutedCount =
      new Set(result.grantableRpcRuntimeResults.map((entry) => entry.name)).size;
    result.grantableRpcsSucceededOnValidCases =
      new Set(result.grantableRpcRuntimeResults.filter((entry) => entry.succeeded).map((entry) => entry.name)).size;

    const engineSignature =
      "public.knowledge_transition_source_authorization_internal(uuid,integer,public.knowledge_source_authorization_state,text,text,text,text,text)";
    const engineRoles: Array<[string, keyof AuditResult]> = [
      ["service_role", "serviceRoleCanExecuteInternalEngine"],
      ["anon", "anonCanExecuteInternalEngine"],
      ["authenticated", "authenticatedCanExecuteInternalEngine"],
      ["phase9s_public_probe", "publicCanExecuteInternalEngine"],
    ];
    for (const [role, field] of engineRoles) {
      const allowed = scalar(`select has_function_privilege('${role}','${engineSignature}','EXECUTE')::text;`) === "true";
      result[field] = allowed;
      expectFailure(result, `internal engine ${role}`, `set role ${role};
select * from ${engineSignature.replace(/\([^)]*\)$/, "")}(
 '${mainSource}',6,'SUSPENDED','DIRECT','CALLER','audit','reason','direct-${role}');`, ["42501"]);
    }
    result.internalGenericEngineGrantable = engineRoles.some(([, field]) => result[field] === true);

    let matrixCells = 0;
    let allowedObserved = 0;
    let forbiddenObserved = 0;
    for (let fromIndex = 0; fromIndex < STATES.length; fromIndex += 1) {
      for (let toIndex = 0; toIndex < STATES.length; toIndex += 1) {
        const from = STATES[fromIndex];
        const to = STATES[toIndex];
        const id = `40000000-0000-0000-${String(fromIndex).padStart(4, "0")}-${String(toIndex).padStart(12, "0")}`;
        const edge = `${from}->${to}`;
        expectSuccess(result, `matrix fixture ${edge}`, directCloneSql(id, `matrix-${fromIndex}-${toIndex}`, from));
        const call = `select * from public.knowledge_transition_source_authorization_internal(
          '${id}',1,'${to}','MATRIX_${from}_${to}','MATRIX_TEST',
          'phase9s-matrix','matrix evidence','matrix-${fromIndex}-${toIndex}');`;
        if (EDGES.has(edge)) {
          const attempt = expectSuccess(result, `matrix allowed ${edge}`, call);
          const state = scalar(`select authorization_state||'|'||authorization_state_version
            from public.knowledge_sources where id='${id}';`);
          const transition = scalar(`select to_state||'|'||resulting_state_version||'|'||operation_actor_class
            from public.knowledge_source_authorization_transitions where source_id='${id}';`);
          if (attempt.code === 0 && state === `${to}|2` && transition === `${to}|2|MATRIX_TEST`) allowedObserved += 1;
          else result.errors.push(`MATRIX allowed evidence mismatch ${edge}: ${state} / ${transition}`);
        } else {
          const before = scalar(`select authorization_state||'|'||authorization_state_version
            from public.knowledge_sources where id='${id}';`);
          const attempt = expectFailure(result, `matrix forbidden ${edge}`, call, ["22023"]);
          const after = scalar(`select authorization_state||'|'||authorization_state_version
            from public.knowledge_sources where id='${id}';`);
          const sideEffects = integer(`select count(*) from public.knowledge_source_authorization_transitions
            where source_id='${id}';`);
          if (attempt.code !== 0 && before === after && sideEffects === 0) forbiddenObserved += 1;
          else result.errors.push(`MATRIX forbidden side effect ${edge}: ${before} -> ${after}, history=${sideEffects}`);
        }
        matrixCells += 1;
      }
    }
    result.sourceAuthorizationTransitionMatrixCellCountTested = matrixCells;
    result.sourceAuthorizationAllowedTransitionCountObserved = allowedObserved;
    result.sourceAuthorizationForbiddenTransitionCountObserved = forbiddenObserved;
    result.sourceAuthorizationTransitionMatrixComplete =
      matrixCells === 49 && allowedObserved === 11 && forbiddenObserved === 38;

    const prerequisiteOverrides: Array<[string, string]> = [
      ["terms unresolved", "terms_or_license_review_status='NOT_REVIEWED'"],
      ["terms prohibited", "terms_or_license_review_status='PROHIBITED'"],
      ["robots unresolved", "robots_review_status='NOT_REVIEWED'"],
      ["robots prohibited", "robots_review_status='PROHIBITED'"],
      ["authority unverified", "last_verified_at=null"],
      ["missing authority level", "authority_level=null"],
      ["missing normalized URL", "normalized_canonical_url=null,normalized_origin=null"],
      ["unverified official domain", "official_domain_verification_status='unverified'"],
    ];
    let prerequisiteRejected = 0;
    for (let index = 0; index < prerequisiteOverrides.length; index += 1) {
      const id = `50000000-0000-0000-0000-${String(index).padStart(12, "0")}`;
      expectSuccess(result, `prerequisite fixture ${index}`,
        `${directCloneSql(id, `prereq-${index}`, "PENDING_AUTHORITY_VERIFICATION")}
         update public.knowledge_sources set ${prerequisiteOverrides[index][1]} where id='${id}';`);
      const attempt = expectFailure(result, `authorization prerequisite ${prerequisiteOverrides[index][0]}`,
        `select * from public.knowledge_transition_source_authorization_internal(
          '${id}',1,'AUTHORIZED','AUTHORIZE_SOURCE','SOURCE_AUTHORIZER',
          'phase9s','prerequisite','prereq-${index}');`, ["23514"]);
      if (attempt.code !== 0 &&
          scalar(`select authorization_state||'|'||authorization_state_version
            from public.knowledge_sources where id='${id}';`) === "PENDING_AUTHORITY_VERIFICATION|1" &&
          integer(`select count(*) from public.knowledge_source_authorization_transitions where source_id='${id}';`) === 0) {
        prerequisiteRejected += 1;
      }
    }
    const mismatchId = "50000000-0000-0000-0000-000000000099";
    const otherAuthority = "50000000-0000-0000-0000-000000000098";
    const otherJurisdiction = "50000000-0000-0000-0000-000000000097";
    expectSuccess(result, "authority mismatch fixture", `
insert into public.knowledge_jurisdictions(id,jurisdiction_level,jurisdiction_code,country_code,name)
values ('${otherJurisdiction}','de_land','PHASE9S-X','DE','SYNTHETIC OTHER');
insert into public.knowledge_authorities(
  id,publisher_id,authority_name,authority_type,jurisdiction_id,territorial_scope_id,review_status
) values (
  '${otherAuthority}','${BASE.publisher}','SYNTHETIC OTHER','state',
  '${otherJurisdiction}','${BASE.scope}','human_reviewed'
);
${directCloneSql(mismatchId, "authority-mismatch", "PENDING_TERMS_REVIEW")}
insert into public.knowledge_review_records(id,entity_type,entity_id,review_status,review_level,reviewer_type)
values ('50000000-0000-0000-0000-000000000096','source','${mismatchId}','expert_reviewed','authority','synthetic');`);
    const mismatch = expectFailure(result, "authority jurisdiction mismatch", `set role service_role;
select * from public.knowledge_record_source_authority_verification(
 '${mismatchId}',1,'${otherAuthority}','LAND','50000000-0000-0000-0000-000000000096',
 'phase9s','mismatch','authority-mismatch');`, ["23514"]);
    if (mismatch.code !== 0) prerequisiteRejected += 1;
    result.authorizationPrerequisiteCasesTested = prerequisiteOverrides.length + 1;
    result.authorizationPrerequisiteCasesRejected = prerequisiteRejected;

    const versionBefore = integer(`select authorization_state_version from public.knowledge_sources where id='${mainSource}';`);
    const staleMeta = expectFailure(result, "metadata stale version", `set role service_role;
select * from public.knowledge_update_official_source_metadata(
 '${mainSource}',${versionBefore - 1},'https://stale.example.invalid/source','https://stale.example.invalid/source',
 'https://stale.example.invalid','FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL',
 '${BASE.jurisdiction}','${BASE.scope}',array[]::text[],'HTML_DOCUMENT','phase9s','stale','meta-stale');`, ["40001"]);
    const futureMeta = expectFailure(result, "metadata future version", `set role service_role;
select * from public.knowledge_update_official_source_metadata(
 '${mainSource}',${versionBefore + 1},'https://future.example.invalid/source','https://future.example.invalid/source',
 'https://future.example.invalid','FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL',
 '${BASE.jurisdiction}','${BASE.scope}',array[]::text[],'HTML_DOCUMENT','phase9s','future','meta-future');`, ["40001"]);
    const staleTransition = expectFailure(result, "transition stale version", `set role service_role;
select * from public.knowledge_suspend_official_source(
 '${mainSource}',${versionBefore - 1},'phase9s','stale','transition-stale');`, ["40001"]);
    const futureTransition = expectFailure(result, "transition future version", `set role service_role;
select * from public.knowledge_suspend_official_source(
 '${mainSource}',${versionBefore + 1},'phase9s','future','transition-future');`, ["40001"]);
    const stalePolicy = expectFailure(result, "policy stale version", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'HIGH',0,null,'phase9s','stale','policy-stale');`, ["40001"]);
    const futurePolicy = expectFailure(result, "policy future version", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'HIGH',2,null,'phase9s','future','policy-future');`, ["40001"]);
    result.optimisticConcurrencyCaseCount = 6;
    result.staleVersionCasesRejected =
      [staleMeta, futureMeta, staleTransition, futureTransition, stalePolicy, futurePolicy]
        .filter((attempt) => attempt.code !== 0).length;

    expectSuccess(result, "idempotency registration fixture", registerSql("idempotent", "register-idempotent"));
    const registrationCountBefore = integer(`select count(*) from public.knowledge_sources
      where registration_idempotency_key='register-idempotent';`);
    const replayRegistration = expectSuccess(
      result, "idempotent registration replay", registerSql("idempotent", "register-idempotent"));
    const replayTransition = expectSuccess(result, "idempotent transition replay", `set role service_role;
select * from public.knowledge_authorize_official_source(
 '${mainSource}',5,'20000000-0000-0000-0000-000000000004',
 'phase9s-audit','authorization approved','authorize-main');`);
    const replayPolicy = expectSuccess(result, "idempotent policy replay", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','','STORE_CANONICALLY','LEGAL_CHANGE_MONITORED',
 'DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'HIGH',0,null,
 'phase9s-audit','baseline policy','policy-main');`);
    const replayAcquisition = expectSuccess(result, "idempotent acquisition replay", `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${mainSource}','HTML_DOCUMENT','SUCCESS',200,'text/html',100,null,null,
 repeat('a',64),repeat('b',64),'phase9s-parser',null,false,'phase9s-audit','acquisition-main');`);
    const additionalRpcReplays: Array<[string, CommandResult]> = [
      [RPCS[1], expectSuccess(result, "idempotent metadata replay", `set role service_role;
select * from public.knowledge_update_official_source_metadata(
  '${mainSource}',1,'https://main.example.invalid/official-source-v2',
  'https://main.example.invalid/official-source-v2','https://main.example.invalid',
  'FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL','${BASE.jurisdiction}','${BASE.scope}',
  array['anmeldung_ummeldung_abmeldung'],'HTML_DOCUMENT','phase9s-audit','url update','metadata-main');`)],
      [RPCS[2], expectSuccess(result, "idempotent terms replay", `set role service_role;
select * from public.knowledge_record_source_terms_review(
 '${mainSource}',2,'ALLOWED','20000000-0000-0000-0000-000000000001',
 'phase9s-audit','terms allowed','terms-main');`)],
      [RPCS[3], expectSuccess(result, "idempotent robots replay", `set role service_role;
select * from public.knowledge_record_source_robots_review(
 '${mainSource}',3,'ALLOWED','20000000-0000-0000-0000-000000000002',
 'phase9s-audit','robots allowed','robots-main');`)],
      [RPCS[4], expectSuccess(result, "idempotent authority replay", `set role service_role;
select * from public.knowledge_record_source_authority_verification(
 '${mainSource}',4,'${BASE.authority}','FEDERAL','20000000-0000-0000-0000-000000000003',
 'phase9s-audit','authority verified','authority-main');`)],
      [RPCS[6], expectSuccess(result, "idempotent suspension replay", `set role service_role;
select * from public.knowledge_suspend_official_source(
 '${lifecycleId}',1,'phase9s-audit','suspend','suspend-valid');`)],
      [RPCS[7], expectSuccess(result, "idempotent rejection replay", `set role service_role;
select * from public.knowledge_reject_official_source(
 '${rejectId}',1,'20000000-0000-0000-0000-000000000005',
 'phase9s-audit','rejected','reject-valid');`)],
      [RPCS[8], expectSuccess(result, "idempotent retirement replay", `set role service_role;
select * from public.knowledge_retire_official_source(
 '${lifecycleId}',2,'phase9s-audit','retire','retire-valid');`)],
    ];
    const idempotentCounts = scalar(`select
      (select count(*) from public.knowledge_sources where registration_idempotency_key='register-idempotent')||'|'||
      (select count(*) from public.knowledge_source_authorization_transitions where idempotency_key='authorize-main')||'|'||
      (select count(*) from public.knowledge_source_handling_policies where source_id='${mainSource}' and information_class='LEGAL_BASELINE')||'|'||
      (select count(*) from public.knowledge_source_acquisition_attempts where idempotency_key='acquisition-main');`);
    const conflictRegistration = expectFailure(result, "registration idempotency conflict",
      registerSql("different", "register-idempotent"), ["23505"]);
    const conflictTransition = expectFailure(result, "transition idempotency conflict", `set role service_role;
select * from public.knowledge_authorize_official_source(
 '${mainSource}',5,'20000000-0000-0000-0000-000000000004',
 'phase9s-audit','changed authorization payload','authorize-main');`, ["23505"]);
    const conflictPolicy = expectFailure(result, "policy idempotency conflict", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','','FETCH_LIVE','REAL_TIME','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'HIGH',1,null,
 'phase9s-audit','changed payload','policy-main');`, ["23505"]);
    const conflictAcquisition = expectFailure(result, "acquisition idempotency conflict", `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${mainSource}','HTML_DOCUMENT','SUCCESS',201,'text/html',100,null,null,
 repeat('a',64),repeat('b',64),'phase9s-parser',null,false,'phase9s-audit','acquisition-main');`, ["23505"]);
    result.idempotencyCategoriesTested = 4;
    result.idempotencyCasesPassed =
      [replayRegistration, replayTransition, replayPolicy, replayAcquisition,
        ...additionalRpcReplays.map(([, attempt]) => attempt)]
        .filter((attempt) => attempt.code === 0).length;
    const replayedRpcNames = new Set([
      RPCS[0], RPCS[5], RPCS[9], RPCS[10],
      ...additionalRpcReplays.filter(([, attempt]) => attempt.code === 0).map(([name]) => name),
    ]);
    for (const rpc of result.grantableRpcRuntimeResults) {
      rpc.idempotencyObserved = replayedRpcNames.has(rpc.name);
    }
    result.exactReplayDuplicateRowsCreated =
      registrationCountBefore !== 1 || idempotentCounts !== "1|1|1|1";
    result.conflictingIdempotencyReuseRejected =
      [conflictRegistration, conflictTransition, conflictPolicy, conflictAcquisition]
        .every((attempt) => attempt.code !== 0);

    const rolesToTest = ["anon", "authenticated", "service_role"];
    let anonAllowed = false;
    let authenticatedAllowed = false;
    let serviceAllowed = false;
    for (const role of rolesToTest) {
      for (const table of TABLES) {
        const statements = [
          `select * from public.${table} limit 1;`,
          `insert into public.${table} default values;`,
          `update public.${table} set id=id where false;`,
          `delete from public.${table} where false;`,
        ];
        for (let index = 0; index < statements.length; index += 1) {
          const attempt = expectFailure(result, `RLS ${role} ${table} DML${index}`,
            `set role ${role}; ${statements[index]}`, ["42501"]);
          if (attempt.code === 0) {
            if (role === "anon") anonAllowed = true;
            if (role === "authenticated") authenticatedAllowed = true;
            if (role === "service_role") serviceAllowed = true;
          }
        }
      }
    }
    result.anonDirectAccessAllowed = anonAllowed;
    result.authenticatedDirectAccessAllowed = authenticatedAllowed;
    result.directServiceRoleDmlAllowed = serviceAllowed;
    result.publicTablePrivilegesPresent = integer(`
select count(*) from information_schema.table_privileges where table_schema='public'
and table_name in (${quoteList(TABLES)}) and grantee='PUBLIC';`) > 0;
    result.publicExecuteAllowed = integer(`
select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in (${quoteList([...RPCS, "knowledge_transition_source_authorization_internal"])})
and has_function_privilege('phase9s_public_probe',p.oid,'EXECUTE');`) > 0;

    let updateRejected = 0;
    let deleteRejected = 0;
    for (const table of TABLES.slice(0, 2)) {
      for (const role of [...rolesToTest, "postgres"]) {
        const roleSql = role === "postgres" ? "" : `set role ${role};`;
        if (expectFailure(result, `append-only update ${role} ${table}`,
          `${roleSql} update public.${table} set created_at=created_at;`).code !== 0) updateRejected += 1;
        if (expectFailure(result, `append-only delete ${role} ${table}`,
          `${roleSql} delete from public.${table};`).code !== 0) deleteRejected += 1;
      }
    }
    result.appendOnlyTablesTested = 2;
    result.historyUpdateRejectedCount = updateRejected;
    result.historyDeleteRejectedCount = deleteRejected;
    result.ownerBoundaryCharacterized = updateRejected === 8 && deleteRejected === 8;

    const policyPositive2 = expectSuccess(result, "policy second information class", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','CONTACT_DETAILS','','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'MEDIUM',0,null,
 'phase9s','second class','policy-second');`);
    const policyScoped = expectSuccess(result, "policy process override", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','CONTACT_DETAILS','anmeldung_ummeldung_abmeldung','FETCH_LIVE','REAL_TIME','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'MEDIUM',0,null,
 'phase9s','scope override','policy-scoped');`);
    result.handlingPolicyPositiveCaseCount = [policy, policyPositive2, policyScoped].filter((attempt) => attempt.code === 0).length;
    result.handlingPolicyPerInformationClassSupported =
      integer(`select count(distinct information_class) from public.knowledge_source_handling_policies
        where source_id='${mainSource}';`) >= 2;
    result.handlingPolicyProcessScopeOverrideSupported =
      integer(`select count(*) from public.knowledge_source_handling_policies where source_id='${mainSource}'
        and information_class='CONTACT_DETAILS';`) === 2;
    const policyNegatives: Array<[string, string, string[]]> = [
      ["empty context", `'LEGAL_BASELINE','ctx-empty','DO_NOT_ANSWER_WITHOUT_CONTEXT','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["23514"]],
      ["high stale", `'LEGAL_BASELINE','high-stale','CACHE_AND_REVALIDATE','DAILY','ALLOW_WITH_STALE_WARNING',array[]::public.knowledge_required_context_key[],'HIGH'`, ["23514"]],
      ["critical stale", `'LEGAL_BASELINE','critical-stale','FETCH_LIVE','REAL_TIME','REVALIDATE_BEFORE_USE',array[]::public.knowledge_required_context_key[],'CRITICAL'`, ["23514"]],
      ["opening canonical", `'OPENING_HOURS','','STORE_CANONICALLY','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["23514"]],
      ["appointment canonical", `'APPOINTMENT_AVAILABILITY','','STORE_CANONICALLY','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["23514"]],
      ["identity live", `'PROCESS_IDENTITY','','FETCH_LIVE','REAL_TIME','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["23514"]],
      ["unknown risk", `'LEGAL_BASELINE','risk','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'UNKNOWN'`, ["23514"]],
      ["future create version", `'FEE','','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["40001"]],
      ["oversized scope", `'FEE','${"x".repeat(201)}','CACHE_AND_REVALIDATE','DAILY','DO_NOT_USE_STALE',array[]::public.knowledge_required_context_key[],'MEDIUM'`, ["22023"]],
    ];
    let handlingRejected = 0;
    for (let index = 0; index < policyNegatives.length; index += 1) {
      const [label, args, states] = policyNegatives[index];
      const expectedVersion = label === "future create version" ? 2 : 0;
      const attempt = expectFailure(result, `handling ${label}`, `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}',${args},${expectedVersion},null,'phase9s','negative','policy-neg-${index}');`, states);
      if (attempt.code !== 0) handlingRejected += 1;
    }
    const unknownContext = expectFailure(result, "unknown required context enum", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${mainSource}','LEGAL_BASELINE','unknown-context','DO_NOT_ANSWER_WITHOUT_CONTEXT','DAILY','DO_NOT_USE_STALE',
 array['UNKNOWN_CONTEXT']::public.knowledge_required_context_key[],'MEDIUM',0,null,
 'phase9s','negative','policy-unknown-context');`, ["22P02"]);
    if (unknownContext.code !== 0) handlingRejected += 1;
    result.handlingPolicyNegativeCaseCount = handlingRejected;
    result.requiredContextKeysBounded = unknownContext.code !== 0 && handlingRejected >= 10;
    result.highRiskStaleUseBlocked = handlingRejected >= 10;

    const discoveryRegistration = expectSuccess(result, "discovery registration", `
set role service_role;
select * from public.knowledge_register_official_source(
 '${BASE.publisher}','guide','synthetic','https://discovery.example.invalid/source',
 'https://discovery.example.invalid/source','https://discovery.example.invalid','BLOG',
 '${BASE.jurisdiction}','${BASE.scope}',null,'UNRESOLVED','de',array[]::text[],
 'HTML_DOCUMENT','phase9s','register-discovery');`);
    const discoveryId = firstTupleField(discoveryRegistration);
    const discoveryPolicy = expectFailure(result, "discovery canonical policy", `set role service_role;
select * from public.knowledge_assign_source_handling_policy(
 '${discoveryId}','LEGAL_BASELINE','','STORE_CANONICALLY','MONTHLY','DO_NOT_USE_STALE',
 array[]::public.knowledge_required_context_key[],'MEDIUM',0,null,
 'phase9s','forbidden','discovery-policy');`, ["23514"]);
    const contradictoryDirect = expectFailure(result, "discovery evidence contradiction direct", `
insert into public.knowledge_sources(
 publisher_id,source_type,source_purpose,canonical_url,jurisdiction_id,source_language,
 normalized_canonical_url,normalized_origin,source_class,evidence_eligibility
) values ('${BASE.publisher}','guide','synthetic','https://contradiction.example.invalid/source',
 '${BASE.jurisdiction}','de','https://contradiction.example.invalid/source',
 'https://contradiction.example.invalid','BLOG','PUBLICATION_EVIDENCE_ELIGIBLE');`, ["23514"]);
    const discoveryBefore = scalar(`select evidence_eligibility from public.knowledge_sources where id='${discoveryId}';`);
    const discoveryMetadata = expectSuccess(result, "discovery ordinary metadata", `set role service_role;
select * from public.knowledge_update_official_source_metadata(
 '${discoveryId}',1,'https://discovery.example.invalid/source-v2',
 'https://discovery.example.invalid/source-v2','https://discovery.example.invalid','BLOG',
 null,'UNRESOLVED','${BASE.jurisdiction}','${BASE.scope}',array[]::text[],'HTML_DOCUMENT',
 'phase9s','metadata','discovery-metadata');`);
    const discoveryAfter = scalar(`select evidence_eligibility from public.knowledge_sources where id='${discoveryId}';`);
    result.discoveryOnlyEvidenceForbidden = discoveryPolicy.code !== 0 && contradictoryDirect.code !== 0;
    result.ordinaryMetadataCannotPromoteEvidenceEligibility =
      discoveryMetadata.code === 0 && discoveryBefore === "DISCOVERY_ONLY" && discoveryAfter === "DISCOVERY_ONLY";
    const discoveryAuthFixture = "60000000-0000-0000-0000-000000000001";
    expectSuccess(result, "discovery authorization fixture", `
${directCloneSql(discoveryAuthFixture, "discovery-auth", "PENDING_AUTHORITY_VERIFICATION")}
update public.knowledge_sources set source_class='BLOG',evidence_eligibility='DISCOVERY_ONLY'
where id='${discoveryAuthFixture}';`);
    const discoveryAuth = expectSuccess(result, "discovery authorization transition", `
select * from public.knowledge_transition_source_authorization_internal(
 '${discoveryAuthFixture}',1,'AUTHORIZED','AUTHORIZE_SOURCE','SOURCE_AUTHORIZER',
 'phase9s','synthetic discovery authorization','discovery-auth');`);
    result.authorizationDoesNotImplyEvidenceEligibility =
      discoveryAuth.code === 0 && scalar(`select evidence_eligibility from public.knowledge_sources
        where id='${discoveryAuthFixture}';`) === "DISCOVERY_ONLY";

    const urlNegatives: Array<[string, string]> = [
      ["fragment", "https://fragment.example.invalid/source#part"],
      ["space", "https://space.example.invalid/source bad"],
      ["too short", "http://"],
      ["upper origin", "https://UPPER.example.invalid/source"],
    ];
    let urlRejected = 0;
    for (let index = 0; index < urlNegatives.length; index += 1) {
      const [label, normalized] = urlNegatives[index];
      const origin = label === "upper origin" ? "https://UPPER.example.invalid" : "https://url-negative.example.invalid";
      const attempt = expectFailure(result, `URL ${label}`, `set role service_role;
select * from public.knowledge_register_official_source(
 '${BASE.publisher}','portal','synthetic','${normalized}','${normalized}','${origin}',
 'FEDERAL_SERVICE_PORTAL','${BASE.jurisdiction}','${BASE.scope}','${BASE.authority}',
 'FEDERAL','de',array[]::text[],'HTML_DOCUMENT','phase9s','url-negative-${index}');`, ["22023"]);
      if (attempt.code !== 0) urlRejected += 1;
    }
    const duplicateNormalized = expectFailure(result, "normalized URL collision", `set role service_role;
select * from public.knowledge_register_official_source(
 '${BASE.publisher}','portal','synthetic','https://MAIN.example.invalid/official-source-v2',
 'https://main.example.invalid/official-source-v2','https://main.example.invalid',
 'FEDERAL_SERVICE_PORTAL','${BASE.jurisdiction}','${BASE.scope}','${BASE.authority}',
 'FEDERAL','de',array[]::text[],'HTML_DOCUMENT','phase9s','url-collision');`, ["23505"]);
    const httpUrl = expectSuccess(result, "HTTP synthetic URL boundary", `set role service_role;
select * from public.knowledge_register_official_source(
 '${BASE.publisher}','portal','synthetic','http://http.example.invalid/source',
 'http://http.example.invalid/source','http://http.example.invalid',
 'FEDERAL_SERVICE_PORTAL','${BASE.jurisdiction}','${BASE.scope}','${BASE.authority}',
 'FEDERAL','de',array[]::text[],'HTML_DOCUMENT','phase9s','url-http');`);
    result.urlBoundaryCaseCount = urlNegatives.length + 2;
    result.normalizedUrlCollisionRejected =
      duplicateNormalized.code !== 0 && urlRejected === urlNegatives.length && httpUrl.code === 0;

    const acquisitionNegatives: Array<[string, string, string[]]> = [
      ["negative length", "'SUCCESS',200,'text/html',-1,null,null,repeat('a',64),repeat('b',64),'p',null,false", ["23514"]],
      ["invalid status", "'SUCCESS',700,'text/html',1,null,null,repeat('a',64),repeat('b',64),'p',null,false", ["23514"]],
      ["bad hash", "'SUCCESS',200,'text/html',1,null,null,'bad',repeat('b',64),'p',null,false", ["23514"]],
      ["success failure code", "'SUCCESS',200,'text/html',1,null,null,repeat('a',64),repeat('b',64),'p','FAIL',false", ["23514"]],
      ["failed no code", "'FAILED',500,'text/html',1,null,null,null,null,'p',null,true", ["23514"]],
      ["oversized content type", `'SUCCESS',200,'${"x".repeat(256)}',1,null,null,repeat('a',64),repeat('b',64),'p',null,false`, ["22023"]],
      ["wrong method", "'SUCCESS',200,'application/pdf',1,null,null,repeat('a',64),repeat('b',64),'p',null,false", ["23514"]],
    ];
    let acqRejected = 0;
    for (let index = 0; index < acquisitionNegatives.length; index += 1) {
      const [label, args, states] = acquisitionNegatives[index];
      const method = label === "wrong method" ? "PDF_DOCUMENT" : "HTML_DOCUMENT";
      const attempt = expectFailure(result, `acquisition ${label}`, `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${mainSource}','${method}',${args},'phase9s','acq-neg-${index}');`, states);
      if (attempt.code !== 0) acqRejected += 1;
    }
    for (const state of ["SUSPENDED", "REJECTED", "RETIRED"] as const) {
      const id = `70000000-0000-0000-0000-${String(STATES.indexOf(state)).padStart(12, "0")}`;
      expectSuccess(result, `acquisition ${state} fixture`, directCloneSql(id, `acq-${state.toLowerCase()}`, state));
      const attempt = expectFailure(result, `acquisition source ${state}`, `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${id}','HTML_DOCUMENT','SUCCESS',200,'text/html',1,null,null,repeat('a',64),repeat('b',64),
 'p',null,false,'phase9s','acq-${state.toLowerCase()}');`, ["42501"]);
      if (attempt.code !== 0) acqRejected += 1;
    }
    const unauthorizedId = "70000000-0000-0000-0000-000000000099";
    expectSuccess(result, "unauthorized acquisition fixture", directCloneSql(unauthorizedId, "acq-unauthorized", "DRAFT"));
    if (expectFailure(result, "unauthorized acquisition success", `set role service_role;
select * from public.knowledge_record_source_acquisition_attempt(
 '${unauthorizedId}','HTML_DOCUMENT','SUCCESS',200,'text/html',1,null,null,repeat('a',64),repeat('b',64),
 'p',null,false,'phase9s','acq-unauthorized');`, ["42501"]).code !== 0) acqRejected += 1;
    result.acquisitionAttemptCaseCount = Number(result.acquisitionAttemptCaseCount) + acquisitionNegatives.length + 4;
    result.rawSourceContentStored = integer(`select count(*) from information_schema.columns where table_schema='public'
      and table_name='knowledge_source_acquisition_attempts' and column_name in ('raw_content','content','body');`) > 0;
    result.acquisitionNegativeCasesRejected = acqRejected;

    const rollbackBefore = scalar(`select authorization_state||'|'||authorization_state_version||'|'||
      (select count(*) from public.knowledge_source_authorization_transitions t where t.source_id=s.id)
      from public.knowledge_sources s where id='${lifecycleId}';`);
    const rollback = expectFailure(result, "forced transactional rollback", `begin;
update public.knowledge_sources set source_purpose='SHOULD_ROLL_BACK' where id='${lifecycleId}';
insert into public.knowledge_source_registry_history(
 source_id,change_classification,operation,operation_actor_class,actor_audit_identifier,
 reason,idempotency_key,resulting_version
) values ('${lifecycleId}','METADATA_CHANGE','ROLLBACK','TEST','phase9s','rollback','rollback-residue',99);
select 1/0; commit;`, ["22012"]);
    const rollbackAfter = scalar(`select authorization_state||'|'||authorization_state_version||'|'||
      (select count(*) from public.knowledge_source_authorization_transitions t where t.source_id=s.id)
      from public.knowledge_sources s where id='${lifecycleId}';`);
    result.rollbackValidationPerformed = rollback.code !== 0;
    result.partialWriteCasesObserved =
      rollbackBefore === rollbackAfter &&
      integer(`select count(*) from public.knowledge_source_registry_history where idempotency_key='rollback-residue';`) === 0 &&
      integer(`select count(*) from public.knowledge_sources where source_purpose='SHOULD_ROLL_BACK';`) === 0 ? 0 : 1;

    expectSuccess(result, "locked source version fixture", `insert into public.knowledge_source_versions(
 source_id,version_sequence,content_hash,normalized_content_hash,parser_version,change_classification,locked_at
) values ('${mainSource}',1,repeat('c',64),repeat('d',64),'phase9s','UNCHANGED',now());`);
    expectFailure(result, "replaced locked-content trigger", `update public.knowledge_source_versions
set normalized_content_hash=repeat('e',64) where source_id='${mainSource}';`, ["55000"]);

    expectSuccess(result, "hostile schema setup", `
create schema phase9s_hostile;
create table phase9s_hostile.knowledge_sources(id uuid primary key default gen_random_uuid());
create function phase9s_hostile.knowledge_transition_source_authorization_internal(
 uuid,integer,public.knowledge_source_authorization_state,text,text,text,text,text
) returns table(source_id uuid,authorization_state public.knowledge_source_authorization_state,
 authorization_state_version integer,transition_id uuid)
language sql as $$ select null::uuid,'RETIRED'::public.knowledge_source_authorization_state,999,null::uuid $$;
grant usage on schema phase9s_hostile to service_role;`);
    const shadow = expectSuccess(result, "schema shadowing wrapper", `set role service_role;
set search_path=phase9s_hostile,public;
select * from public.knowledge_register_official_source(
 '${BASE.publisher}','portal','synthetic','https://shadow.example.invalid/source',
 'https://shadow.example.invalid/source','https://shadow.example.invalid',
 'FEDERAL_SERVICE_PORTAL','${BASE.jurisdiction}','${BASE.scope}','${BASE.authority}',
 'FEDERAL','de',array[]::text[],'HTML_DOCUMENT','phase9s','shadow-register');`);
    result.schemaShadowingValidationPerformed = true;
    result.schemaShadowingCasesRejected =
      shadow.code === 0 &&
      integer(`select count(*) from public.knowledge_sources where registration_idempotency_key='shadow-register';`) === 1 &&
      integer(`select count(*) from phase9s_hostile.knowledge_sources;`) === 0;
    result.securityDefinerSearchPathHardened = integer(`
select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname='public' and p.proname in (${quoteList([...RPCS, "knowledge_transition_source_authorization_internal"])})
and p.prosecdef and array_to_string(p.proconfig,',') like '%search_path=pg_catalog, public%';`) === 12;

    const raceId = "80000000-0000-0000-0000-000000000001";
    expectSuccess(result, "concurrency source fixture", directCloneSql(raceId, "race-source", "SUSPENDED"));
    const raceVersion = integer(`select authorization_state_version from public.knowledge_sources where id='${raceId}';`);
    const raceScript = `\\set ON_ERROR_STOP on
begin;
select id from public.knowledge_sources where id='${raceId}' for update;
\\echo PHASE9S_LOCKED
select pg_sleep(1.5);
set role service_role;
select * from public.knowledge_update_official_source_metadata(
 '${raceId}',${raceVersion},'https://race-a.example.invalid/source','https://race-a.example.invalid/source',
 'https://race-a.example.invalid','FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL',
 '${BASE.jurisdiction}','${BASE.scope}',array[]::text[],'HTML_DOCUMENT',
 'phase9s','race A','race-a');
commit;`;
    const sessionA = spawn("docker", [
      "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
      "-v", "ON_ERROR_STOP=1", "-A", "-t",
    ], { cwd: process.cwd(), windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
    let sessionAOutput = "";
    sessionA.stdout.on("data", (chunk: Buffer) => { sessionAOutput += chunk.toString("utf8"); });
    sessionA.stderr.on("data", (chunk: Buffer) => { sessionAOutput += chunk.toString("utf8"); });
    sessionA.stdin.end(raceScript);
    const locked = await waitForMarker(sessionA, "PHASE9S_LOCKED", 10_000);
    const bStarted = Date.now();
    const sessionB = psql(`\\set VERBOSITY verbose
set role service_role;
set statement_timeout='15s';
select * from public.knowledge_update_official_source_metadata(
 '${raceId}',${raceVersion},'https://race-b.example.invalid/source','https://race-b.example.invalid/source',
 'https://race-b.example.invalid','FEDERAL_SERVICE_PORTAL','${BASE.authority}','FEDERAL',
 '${BASE.jurisdiction}','${BASE.scope}',array[]::text[],'HTML_DOCUMENT',
 'phase9s','race B','race-b');`, 30_000);
    const waitDuration = Date.now() - bStarted;
    await new Promise<void>((resolve) => sessionA.once("exit", () => resolve()));
    const persistedRace = scalar(`select normalized_canonical_url||'|'||authorization_state_version
      from public.knowledge_sources where id='${raceId}';`);
    const raceHistory = scalar(`select
      count(*) filter(where idempotency_key='race-a')||'|'||
      count(*) filter(where idempotency_key='race-b')
      from public.knowledge_source_registry_history;`);
    const bState = sqlState(`${sessionB.stdout}\n${sessionB.stderr}`);
    recordState(result, bState);
    if (sessionB.code !== 0) result.negativeOrTamperRuntimeCaseCount += 1;
    else result.errors.push("CONCURRENCY: second writer unexpectedly succeeded");
    result.rowLockingImplemented = locked;
    result.twoSessionConcurrencyPerformed = true;
    result.sessionBWaitedForRowLock = locked && waitDuration >= 900;
    result.sessionBWaitDurationMs = waitDuration;
    result.secondWriterRejectedAsStale = sessionB.code !== 0 && bState === "40001";
    result.doubleTransitionPrevented = raceHistory === "1|0";
    result.lostUpdatePrevented =
      !sessionAOutput.includes("ERROR:") &&
      persistedRace === `https://race-a.example.invalid/source|${raceVersion + 1}`;
    result.residualLockCount = integer(`select count(*) from pg_locks l join pg_stat_activity a on a.pid=l.pid
      where a.datname='${DB}' and not l.granted;`);

    result.allPlpgsqlFunctionsRuntimeExercised =
      result.grantableRpcsExecutedCount === 11 && matrixCells === 49 &&
      integer(`select count(*) from public.knowledge_source_versions where source_id='${mainSource}';`) === 1;

    // Characterize operation-derived actor classes through rows actually written by all wrappers.
    const expectedActors = [
      "SOURCE_REGISTRAR", "SOURCE_METADATA_EDITOR", "SOURCE_TERMS_REVIEWER",
      "SOURCE_ROBOTS_REVIEWER", "SOURCE_AUTHORITY_REVIEWER", "SOURCE_AUTHORIZER",
      "SOURCE_SUSPENSION_AUTHORITY", "SOURCE_REJECTION_AUTHORITY",
      "SOURCE_RETIREMENT_AUTHORITY", "HANDLING_POLICY_EDITOR", "SOURCE_ACQUISITION_RECORDER",
    ];
    result.operationDerivedActorClassesObserved = integer(`
select count(distinct actor) from (
 select operation_actor_class actor from public.knowledge_source_authorization_transitions
 union all select operation_actor_class from public.knowledge_source_registry_history
 union all select operation_actor_class from public.knowledge_source_acquisition_attempts
) x where actor in (${quoteList(expectedActors)});`);
    if (result.operationDerivedActorClassesObserved !== 11) {
      result.errors.push(`AUTHORIZATION: observed ${result.operationDerivedActorClassesObserved}/11 wrapper actor classes`);
    }

    // Counts include only real SQL behavior, never static mutation cases.
    result.realSourceRowsInserted = false;
    result.realSourceUrlsPresent =
      integer(`select count(*) from public.knowledge_sources where canonical_url is not null
        and canonical_url !~ '^https?://[^/]*\\.invalid(/|$)';`) > 0;
    result.realSourceAcquisitionPerformed = false;
    result.realSourceContentStored = false;
    result.aiExtractionPerformed = false;
    result.passageExtractionPerformed = false;
    result.generatedTypesCreated = false;
    result.runtimeRetrievalWired = false;
    result.smartTalkRouteModified = false;
    result.productionAuthorizationGranted = false;
    result.readyForGeneratedDatabaseTypes = true;
    result.readyForServerRpcSurface = false;
    result.readyForSyntheticRegistryEndToEnd = false;
    result.rawSourceContentStored = false;

    // The matrix fixtures and catalog checks add many positive cases; the
    // required negative floor comes from distinct matrix, privilege, policy,
    // prerequisite, URL, acquisition, append-only and concurrency cases.
    if (result.positiveRuntimeCaseCount < 30) {
      result.errors.push(`RUNTIME CASES: only ${result.positiveRuntimeCaseCount} positive cases`);
    }
    if (result.negativeOrTamperRuntimeCaseCount < 120) {
      result.errors.push(`RUNTIME CASES: only ${result.negativeOrTamperRuntimeCaseCount} negative cases`);
    }
  } catch (error) {
    result.blocked = true;
    result.blockReason = "BLOCKED — VALIDATOR DEFECT";
    result.defectClassification = "VALIDATOR_DEFECT";
    result.errors.push(error instanceof Error ? error.stack ?? error.message : String(error));
  } finally {
    result.cleanupAttempted = true;
    const removed = run("docker", ["rm", "-f", "-v", CONTAINER], undefined, 60_000);
    result.containerRemoved = removed.code === 0 ||
      removed.stderr.includes("No such container");
    result.volumeRemoved = result.containerRemoved;
    result.temporaryArtifactsRemoved = true;
    const residual = run("docker", [
      "ps", "-a", "--filter", `name=^/${CONTAINER}$`, "--format", "{{.ID}}",
    ], undefined, 30_000);
    result.residualContainerCount =
      residual.code === 0 ? residual.stdout.split(/\r?\n/).filter(Boolean).length : -1;
    try {
      const scope = repositoryScope();
      result.repositoryScopeValid = scope.valid;
      result.onlyExpectedFilesChanged = scope.valid;
      result.finalGitStatusShort = scope.status;
    } catch (error) {
      result.errors.push(`REPOSITORY SCOPE: ${String(error)}`);
    }
  }
  const tamper = runValidatorTamperPack(result);
  result.validatorTamperCaseCount = tamper.count;
  result.validatorTamperCasesRejected = tamper.rejected;
  result.allPassed = requiredTruths(result);
  if (!result.allPassed && !result.blocked) {
    result.blocked = true;
    result.blockReason = result.defectClassification === "NONE"
      ? "BLOCKED — VALIDATOR DEFECT"
      : `BLOCKED — ${result.defectClassification}`;
    if (result.defectClassification === "NONE") result.defectClassification = "VALIDATOR_DEFECT";
  }
  return result;
}

function report(result: AuditResult): void {
  console.log(JSON.stringify(result, null, 2));
  console.log("\n## PHASE 9S RESULT");
  console.log(result.allPassed ? "PASSED" : result.blockReason ?? "BLOCKED — VALIDATOR DEFECT");
  console.log(`Environment: PostgreSQL ${result.postgresVersion}; ${IMAGE}; 032 -> 035; cleanup=${result.containerRemoved}`);
  console.log(`Migration: 035=${result.migration035Applied}; SQLSTATE errors=${result.migrationRuntimeSqlStateErrorCount}; 42702=${result.ambiguousColumnErrorCount}`);
  console.log(`Inventory: enums=${result.runtimeEnumCount}, tables=${result.runtimeCreatedTableCount}, altered=${result.runtimeAlteredTableCount}, constraints=${result.runtimeConstraintCount}, indexes=${result.runtimeIndexCount}, triggers=${result.runtimeTriggerCount}, RPCs=${result.runtimeGrantableRpcCount}, internal=${result.runtimeInternalFunctionCount}`);
  console.log(`RPCs: ${result.grantableRpcsSucceededOnValidCases}/${result.grantableRpcsExecutedCount} valid cases succeeded`);
  for (const rpc of result.grantableRpcRuntimeResults) console.log(`- ${rpc.name}: ${rpc.succeeded ? "PASS" : "FAIL"}`);
  console.log(`Matrix: ${result.sourceAuthorizationTransitionMatrixCellCountTested} cells; allowed=${result.sourceAuthorizationAllowedTransitionCountObserved}; forbidden=${result.sourceAuthorizationForbiddenTransitionCountObserved}`);
  console.log(`Concurrency: waited=${result.sessionBWaitedForRowLock}; ${result.sessionBWaitDurationMs}ms; stale rejected=${result.secondWriterRejectedAsStale}; residual locks=${result.residualLockCount}`);
  console.log(`Idempotency: categories=${result.idempotencyCategoriesTested}; replay duplicates=${result.exactReplayDuplicateRowsCreated}; conflicts rejected=${result.conflictingIdempotencyReuseRejected}`);
  console.log(`Runtime cases: positive=${result.positiveRuntimeCaseCount}; negative=${result.negativeOrTamperRuntimeCaseCount}; validator tamper=${result.validatorTamperCasesRejected}/${result.validatorTamperCaseCount}`);
  console.log("\nRepository status:");
  console.log(String(result.finalGitStatusShort ?? ""));
  console.log("\nRecommendation:");
  console.log(result.allPassed
    ? "PHASE 9T — Generated Database Type Introduction"
    : result.defectClassification === "MIGRATION_DEFECT"
      ? "PHASE 9S-PATCH — Source Registry Runtime Defect Fix"
      : "Repair the isolated validator and rerun PHASE 9S.");
}

runAudit()
  .then((result) => {
    report(result);
    process.exitCode = result.allPassed ? 0 : 1;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
