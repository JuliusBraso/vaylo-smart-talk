import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

type Caller =
  | "AUTHENTICATED"
  | "SERVICE_ROLE_BACKEND"
  | "TRIGGER_INTERNAL";

type FunctionContract = Readonly<{
  identity: string;
  securityDefiner: boolean;
  caller: Caller;
  mutatesData: boolean;
  lineage: readonly string[];
  applicationCallSite: string;
}>;

const ROOT = process.cwd();
const MIGRATION_071 = "071_harden_function_execution_privileges.sql";

const contracts: readonly FunctionContract[] = [
  {
    identity: "public.claim_next_document_intelligence_job(integer)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: ["017_document_intelligence_jobs.sql"],
    applicationCallSite: "lib/vaylo/documents/process-document-intelligence-job.ts",
  },
  {
    identity: "public.confirm_document_step_proof(uuid,text)",
    securityDefiner: true,
    caller: "AUTHENTICATED",
    mutatesData: true,
    lineage: ["012_proof_signals_and_verifications.sql"],
    applicationCallSite: "lib/vaylo/documents/confirm-step-proof.ts",
  },
  {
    identity: "public.enqueue_document_intelligence_job(uuid,uuid)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "017_document_intelligence_jobs.sql",
      "030_enqueue_document_intelligence_job_ownership_guard.sql",
    ],
    applicationCallSite: "app/api/documents/route.ts (service-role client)",
  },
  {
    identity: "public.fn_canonical_content_changed_invalidate_translations()",
    securityDefiner: true,
    caller: "TRIGGER_INTERNAL",
    mutatesData: true,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "database triggers only",
  },
  {
    identity: "public.fn_canonical_unit_translations_protect_verified()",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "database trigger only",
  },
  {
    identity:
      "public.fn_create_translation_candidate_core(text,uuid,text,text,text,boolean,text,text,text,text,text)",
    securityDefiner: true,
    caller: "TRIGGER_INTERNAL",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "delegated internal translation engine",
  },
  {
    identity: "public.fn_normalize_and_fingerprint_text(text)",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "database functions only",
  },
  {
    identity: "public.fn_publication_state_transitions_append_only()",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "database triggers only",
  },
  {
    identity: "public.fn_publication_states_validate_write()",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "database trigger only",
  },
  {
    identity: "public.fn_publication_subject_exists(text,uuid)",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "publication functions only",
  },
  {
    identity: "public.fn_translation_target_exists(text,uuid,text)",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "translation functions only",
  },
  {
    identity: "public.i18n_insert_translations_if_missing(text,jsonb)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: ["015_i18n_insert_rpc_and_jobs.sql"],
    applicationCallSite: "lib/i18n/enqueue-missing-translations.ts (service-role client)",
  },
  {
    identity:
      "public.knowledge_advance_publication_evidence_status(text,uuid,text,integer,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_advance_publication_lifecycle(text,uuid,text,integer,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_approve_translation(uuid,text,uuid)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_bootstrap_publication_subject(text,uuid,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_create_human_translation_candidate(text,uuid,text,text,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_create_machine_translation_candidate(text,uuid,text,text,text,text,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_emergency_suspend_publication_subject(text,uuid,integer,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_invalidate_translation_for_canonical_change(uuid)",
    securityDefiner: true,
    caller: "TRIGGER_INTERNAL",
    mutatesData: true,
    lineage: ["033_add_publication_and_canonical_translation_schema.sql"],
    applicationCallSite: "canonical-change trigger path only",
  },
  {
    identity:
      "public.knowledge_recall_publication_to_review(text,uuid,integer,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_record_publication_review_decision(text,uuid,text,integer,uuid,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_reject_translation(uuid,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_submit_translation_for_review(uuid,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_supersede_publication_subject(text,uuid,integer,text,text,uuid,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_suspend_publication_for_detected_issue(text,uuid,integer,text,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity:
      "public.knowledge_transition_publication_state(text,uuid,text,integer,text,text,text,text,uuid,text,uuid,boolean,text)",
    securityDefiner: true,
    caller: "TRIGGER_INTERNAL",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "delegated internal publication engine",
  },
  {
    identity:
      "public.knowledge_withdraw_publication_subject(text,uuid,integer,text,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.knowledge_withdraw_translation(uuid,text,text)",
    securityDefiner: true,
    caller: "SERVICE_ROLE_BACKEND",
    mutatesData: true,
    lineage: [
      "033_add_publication_and_canonical_translation_schema.sql",
      "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
    ],
    applicationCallSite: "operator/backend contract; no browser call site",
  },
  {
    identity: "public.reject_document_step_proof(uuid,text)",
    securityDefiner: true,
    caller: "AUTHENTICATED",
    mutatesData: true,
    lineage: ["012_proof_signals_and_verifications.sql"],
    applicationCallSite: "lib/vaylo/documents/confirm-step-proof.ts",
  },
  {
    identity: "public.set_updated_at()",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: [
      "017_document_intelligence_jobs.sql",
      "024_document_intelligence_jobs_table_fix.sql",
    ],
    applicationCallSite: "database trigger only",
  },
  {
    identity: "public.update_updated_at_column()",
    securityDefiner: false,
    caller: "TRIGGER_INTERNAL",
    mutatesData: false,
    lineage: ["001_create_phrases_tables.sql"],
    applicationCallSite: "database triggers only",
  },
];

const authenticated = contracts.filter((item) => item.caller === "AUTHENTICATED");
const backend = contracts.filter((item) => item.caller === "SERVICE_ROLE_BACKEND");
const internal = contracts.filter((item) => item.caller === "TRIGGER_INTERNAL");
const sourceRegistryBackend = [
  "public.knowledge_register_official_source(uuid,text,text,text,text,text,public.knowledge_source_class,uuid,uuid,uuid,public.knowledge_authority_level,text,text[],public.knowledge_retrieval_method,text,text)",
  "public.knowledge_update_official_source_metadata(uuid,integer,text,text,text,public.knowledge_source_class,uuid,public.knowledge_authority_level,uuid,uuid,text[],public.knowledge_retrieval_method,text,text,text)",
  "public.knowledge_record_source_terms_review(uuid,integer,public.knowledge_access_review_status,uuid,text,text,text)",
  "public.knowledge_record_source_robots_review(uuid,integer,public.knowledge_access_review_status,uuid,text,text,text)",
  "public.knowledge_record_source_authority_verification(uuid,integer,uuid,public.knowledge_authority_level,uuid,text,text,text)",
  "public.knowledge_authorize_official_source(uuid,integer,uuid,text,text,text)",
  "public.knowledge_suspend_official_source(uuid,integer,text,text,text)",
  "public.knowledge_reject_official_source(uuid,integer,uuid,text,text,text)",
  "public.knowledge_retire_official_source(uuid,integer,text,text,text)",
  "public.knowledge_assign_source_handling_policy(uuid,public.knowledge_information_class,text,public.knowledge_handling_mode,public.knowledge_freshness_class,public.knowledge_stale_behavior,public.knowledge_required_context_key[],text,integer,timestamptz,text,text,text)",
  "public.knowledge_record_source_acquisition_attempt(uuid,public.knowledge_retrieval_method,public.knowledge_acquisition_result,integer,text,bigint,text,timestamptz,text,text,text,text,boolean,text,text)",
] as const;
const operatorRoleFunctions = [
  "public.knowledge_ingest_curated_pack(jsonb)",
  "public.knowledge_ingest_curated_locality_pack(jsonb)",
  "public.knowledge_ingest_curated_domain_pack(jsonb)",
  "public.knowledge_ingest_curated_service_area_pack(jsonb)",
  "public.knowledge_retrieve_evidence_packets(uuid[],text[])",
  "public.knowledge_retrieve_anmeldung_context(uuid[],text)",
] as const;
const internal042 = [
  "knowledge_factory_internal.knowledge_factory_resolve_041_payload(jsonb,boolean)",
  "knowledge_factory_internal.knowledge_ingest_curated_domain_pack_041(jsonb)",
  "knowledge_factory_internal.knowledge_ingest_curated_service_area_pack_041(jsonb)",
] as const;

function source(...parts: string[]): string {
  return readFileSync(path.join(ROOT, ...parts), "utf8");
}

function compact(value: string): string {
  return value.toLowerCase().replace(/\s+/gu, "");
}

function stripSqlComments(value: string): string {
  return value.replace(/--[^\r\n]*/gu, "");
}

const migration071 = source("supabase", "migrations", MIGRATION_071);
const executable071 = stripSqlComments(migration071);
const compact071 = compact(executable071);
const migrationDirectory = path.join(ROOT, "supabase", "migrations");
const allMigrationSql = readdirSync(migrationDirectory)
  .filter((name) => /^(?:0(?:0[1-9]|[1-6][0-9]|70))_.*\.sql$/u.test(name))
  .sort()
  .map((name) => source("supabase", "migrations", name))
  .join("\n");
const fourRoleRevokes = new Set(Array.from(allMigrationSql.matchAll(
  /revoke\s+all\s+on\s+function\s+([^;]+?)\s+from\s+public\s*,\s*anon\s*,\s*authenticated\s*,\s*service_role\s*;/giu,
)).map((match) => compact(match[1] ?? "")));
const historicalSql = [
  "001_create_phrases_tables.sql",
  "012_proof_signals_and_verifications.sql",
  "015_i18n_insert_rpc_and_jobs.sql",
  "017_document_intelligence_jobs.sql",
  "024_document_intelligence_jobs_table_fix.sql",
  "030_enqueue_document_intelligence_job_ownership_guard.sql",
  "033_add_publication_and_canonical_translation_schema.sql",
  "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "035_add_official_source_registry_and_handling_mode_contract.sql",
].map((name) => source("supabase", "migrations", name)).join("\n");
const proofMigration = source(
  "supabase",
  "migrations",
  "012_proof_signals_and_verifications.sql",
);

const revokeBlocks = Array.from(executable071.matchAll(
  /revoke\s+execute\s+on\s+function\s+([\s\S]*?)\s+from\s+([^;]+);/giu,
));
const grantBlocks = Array.from(executable071.matchAll(
  /grant\s+execute\s+on\s+function\s+([\s\S]*?)\s+to\s+([^;]+);/giu,
));
const clientRevokeBlock = revokeBlocks.find((match) =>
  compact(match[2] ?? "") === "public,anon,authenticated")?.[1] ?? "";
const serviceRevokeBlock = revokeBlocks.find((match) =>
  compact(match[2] ?? "") === "service_role")?.[1] ?? "";
const authenticatedGrantBlock = grantBlocks.find((match) =>
  compact(match[2] ?? "") === "authenticated")?.[1] ?? "";

const tests: Record<string, boolean> = {};
tests.exactExposedInventory = contracts.length === 32
  && new Set(contracts.map((item) => compact(item.identity))).size === 32;
tests.exactCallerPartition = authenticated.length === 2
  && backend.length === 18
  && internal.length === 12
  && authenticated.length + backend.length + internal.length === contracts.length;
tests.exactAuthenticatedAllowlist = authenticated.map((item) => item.identity).sort().join("|")
  === [
    "public.confirm_document_step_proof(uuid,text)",
    "public.reject_document_step_proof(uuid,text)",
  ].sort().join("|");
tests.allExposedIdentitiesRevokedFromClients = contracts.every((item) =>
  compact(clientRevokeBlock).includes(compact(item.identity)));
tests.internal042ExplicitlyHardened = internal042.every((identity) =>
  compact(clientRevokeBlock).includes(compact(identity))
  && compact(serviceRevokeBlock).includes(compact(identity)));
tests.onlyAuthenticatedProofFunctionsRegranted = authenticated.every((item) =>
  compact(authenticatedGrantBlock).includes(compact(item.identity)))
  && contracts.filter((item) => item.caller !== "AUTHENTICATED").every((item) =>
    !compact(authenticatedGrantBlock).includes(compact(item.identity)));
tests.internalFunctionsRevokedFromServiceRole = internal.every((item) =>
  compact(serviceRevokeBlock).includes(compact(item.identity)));
tests.backendServiceRolePreserved = backend.every((item) => {
  const name = item.identity.slice(0, item.identity.indexOf("("));
  const grantPattern = new RegExp(
    `grant\\s+execute\\s+on\\s+function\\s+${name.replaceAll(".", "\\.")}\\s*\\(`,
    "iu",
  );
  return grantPattern.test(historicalSql)
    && !compact(serviceRevokeBlock).includes(compact(item.identity));
});
tests.sourceRegistryServiceRolePreserved = sourceRegistryBackend.every((identity) => {
  const name = identity.slice(0, identity.indexOf("("));
  const grantPattern = new RegExp(
    `grant\\s+execute\\s+on\\s+function\\s+${name.replaceAll(".", "\\.")}\\s*\\(`,
    "iu",
  );
  return grantPattern.test(historicalSql)
    && !compact(serviceRevokeBlock).includes(compact(identity));
});
tests.completeBackendServiceCount =
  backend.length + sourceRegistryBackend.length === 29;
tests.previouslyFourRoleHardenedCount = fourRoleRevokes.size === 45;
tests.completeFinalFunctionCoverage = new Set([
  ...contracts.map((item) => compact(item.identity)),
  ...internal042.map(compact),
  ...fourRoleRevokes,
]).size === 80;
tests.proofAuthAndOwnershipGuardsPreserved =
  (proofMigration.match(/v_uid\s+uuid\s*:=\s*auth\.uid\(\)/giu)?.length ?? 0) === 2
  && (proofMigration.match(/d\.user_id\s*=\s*v_uid/giu)?.length ?? 0) >= 3
  && proofMigration.includes("classification_not_eligible")
  && proofMigration.includes("not_a_proof_step_for_document");
tests.publicDefaultPrivilegeBlocked = compact071.includes(compact(
  "alter default privileges for role postgres "
    + "revoke execute on functions from public;",
));
tests.publicSchemaClientDefaultsBlocked = compact071.includes(compact(
  "alter default privileges for role postgres in schema public "
    + "revoke execute on functions from anon, authenticated;",
));
tests.internalSchemaClientDefaultsBlocked = compact071.includes(compact(
  "alter default privileges for role postgres in schema knowledge_factory_internal "
    + "revoke execute on functions from anon, authenticated;",
));
tests.serviceRoleDefaultPreserved =
  !/alter\s+default\s+privileges[\s\S]*?revoke\s+execute\s+on\s+functions\s+from[^;]*service_role/iu
    .test(executable071);
tests.privilegeStatementsOnly = executable071
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean)
  .every((statement) =>
    /^(alter\s+default\s+privileges|revoke\s+execute\s+on\s+function|grant\s+execute\s+on\s+function)/iu
      .test(statement));
tests.noFunctionBodyChanges =
  !/create\s+(?:or\s+replace\s+)?function|alter\s+function/iu.test(executable071);
tests.noTableOrDataMutation =
  !/\b(insert|update|delete|merge|truncate)\b|(?:create|alter|drop)\s+table/iu
    .test(executable071);
tests.noRlsOrPolicyMutation =
  !/\b(row\s+level\s+security|create\s+policy|alter\s+policy|drop\s+policy)\b/iu
    .test(executable071);
tests.publicApplicationExecuteAfterHardeningZero =
  tests.allExposedIdentitiesRevokedFromClients
  && tests.internal042ExplicitlyHardened
  && tests.previouslyFourRoleHardenedCount
  && tests.completeFinalFunctionCoverage
  && tests.publicDefaultPrivilegeBlocked;
tests.anonApplicationExecuteAfterHardeningZero =
  tests.allExposedIdentitiesRevokedFromClients
  && tests.internal042ExplicitlyHardened
  && tests.previouslyFourRoleHardenedCount
  && tests.completeFinalFunctionCoverage
  && tests.publicDefaultPrivilegeBlocked
  && tests.publicSchemaClientDefaultsBlocked
  && tests.internalSchemaClientDefaultsBlocked;
tests.authenticatedApplicationExecuteAfterHardeningTwo =
  tests.allExposedIdentitiesRevokedFromClients
  && tests.internal042ExplicitlyHardened
  && tests.previouslyFourRoleHardenedCount
  && tests.completeFinalFunctionCoverage
  && tests.onlyAuthenticatedProofFunctionsRegranted
  && tests.publicDefaultPrivilegeBlocked
  && tests.publicSchemaClientDefaultsBlocked
  && tests.internalSchemaClientDefaultsBlocked;
tests.futureRecurrenceBlocked =
  tests.publicDefaultPrivilegeBlocked
  && tests.publicSchemaClientDefaultsBlocked
  && tests.internalSchemaClientDefaultsBlocked
  && tests.serviceRoleDefaultPreserved;
tests.live043HotfixIsWholeMigration =
  contracts.every((item) => item.lineage.every((name) => Number(name.slice(0, 3)) <= 34))
  && internal042.length === 3
  && tests.privilegeStatementsOnly;
tests.safeAfterHotfixReplay =
  tests.privilegeStatementsOnly
  && !/\b(create|drop)\b/iu.test(executable071);

const allPassed = Object.values(tests).every(Boolean);
const sha256 = createHash("sha256").update(migration071).digest("hex");

process.stdout.write(`${JSON.stringify({
  phase: "DB-SEC-01 FUNCTION EXECUTION PRIVILEGE HARDENING",
  phaseResult: allPassed ? "PASS" : "FAILED",
  migration: MIGRATION_071,
  migrationSha256: sha256,
  rootCause: {
    postgresBuiltInDefault: "PUBLIC receives EXECUTE on new functions",
    supabaseProjectDefault:
      "postgres default ACL directly grants function EXECUTE to anon, authenticated, and service_role",
    historicalGap:
      "PUBLIC-only revokes did not remove direct anon/authenticated grants",
  },
  liveCurrent: {
    anonExecute: 32,
    authenticatedExecute: 32,
    publicApplicationExecute: 2,
  },
  expectedAfterHardening: {
    anonExecute: 0,
    authenticatedExecute: authenticated.length,
    publicApplicationExecute: 0,
    authenticatedFunctions: authenticated.map((item) => item.identity),
  },
  callerContract: {
    exposedFunctionCount: contracts.length,
    existingFunctionsExplicitlyHardened: contracts.length + internal042.length,
    securityDefinerCount: contracts.filter((item) => item.securityDefiner).length,
    mutationCapableCount: contracts.filter((item) => item.mutatesData).length,
    authenticatedCount: authenticated.length,
    backendServiceCount: backend.length,
    internalCount: internal.length,
    functions: contracts,
  },
  backendServiceFunctionsPreserved: [
    ...backend.map((item) => item.identity),
    ...sourceRegistryBackend,
  ],
  operatorRoleFunctionsPreserved: operatorRoleFunctions,
  internalServiceRoleExposureRemoved: internal.map((item) => item.identity),
  internal042ServiceRoleExposureRemoved: internal042,
  finalFunctionCoverage: {
    total: 80,
    liveExposed: contracts.length,
    internal042DefenseInDepth: internal042.length,
    alreadyFourRoleHardened: fourRoleRevokes.size,
  },
  defaultPrivileges: {
    migrationOwner: "postgres",
    publicExecuteDefaultScope: "global creator-role default",
    clientGrantSchemas: ["public", "knowledge_factory_internal"],
    revokeDefaultsFrom: ["PUBLIC globally", "anon/authenticated in application schemas"],
    preserveServiceRoleDefault: true,
  },
  liveHotfixPlan: {
    ready: allPassed,
    sqlSource: `supabase/migrations/${MIGRATION_071}`,
    currentLiveApplicableStatementCount: 6,
    compatibleSchemaLevels: ["043", "071-after-070"],
    executeNow: false,
    migrationLedgerMutation: false,
  },
  tests,
  allPassed,
  liveConnectionAttempted: false,
  databaseWrites: 0,
  functionBodiesModified: false,
  rlsModified: false,
  policiesModified: false,
  dataModified: false,
}, null, 2)}\n`);

if (!allPassed) process.exitCode = 1;
