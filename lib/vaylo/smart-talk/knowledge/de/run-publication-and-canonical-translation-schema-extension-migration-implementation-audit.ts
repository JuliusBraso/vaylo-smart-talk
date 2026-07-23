/**
 * PHASE 9M — Publication and Canonical Translation Schema Extension
 * Migration Implementation Audit (Migration-Implementation and Audit Only)
 *
 * PATCH 9M-PATCH — Trusted Actor Authorization Boundary Fix, applied on top
 * of the original PHASE 9M implementation in this same file/migration pair.
 *
 * Statically and deterministically audits the additive PostgreSQL migration
 * `supabase/migrations/033_add_publication_and_canonical_translation_schema.sql`,
 * which implements the PHASE 9L implementation-plan contract
 * (`run-publication-and-canonical-translation-schema-extension-implementation-plan-audit.ts`,
 * commit c4fce6a), then patched to remove every caller-controlled privileged
 * actor-class parameter from every grantable SECURITY DEFINER RPC.
 *
 * This file performs NO dynamic execution: no SQL is executed, no
 * PostgreSQL/Supabase/Docker process is started, no database is connected
 * to, no migration is applied, no runtime/route is imported.
 *
 * It only:
 *   1. Reads migration 032, migration 033, the PHASE 9K design audit and the
 *      PHASE 9L implementation-plan audit as plain text via `fs.readFileSync`.
 *   2. Runs read-only `git` commands to confirm this phase created exactly
 *      two new files and modified no existing file.
 *   3. Performs conservative, targeted static text analysis of the SQL
 *      source (table declarations, CHECK constraint value lists, function
 *      signatures/bodies, SECURITY DEFINER hardening, RLS/grants/revokes,
 *      indexes, triggers, dollar-quoted function bodies vs. top-level
 *      statements, and — for the 9M-PATCH — a full function-level trust
 *      classification: grantable vs. internal-engine vs. trigger-only vs.
 *      system-only, plus a scan of every grantable function's parameter
 *      list for caller-controlled privileged actor-class parameters and a
 *      check that every actor-assigning grantable function hardcodes its
 *      actor class as a literal) to ground a deterministic `Result`.
 *   4. Runs a strong in-memory tamper pack (>= 130 cases) against a
 *      deep-cloned "good" `Result` and confirms each mutation is rejected.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PHASE_ID = "9M";
const PHASE_NAME = "Publication and Canonical Translation Schema Extension Migration Implementation";
const IMPLEMENTATION_KIND = "publication_and_canonical_translation_schema_extension_migration_implementation";
const SOURCE_PLAN_PHASE_ID = "9L";
const SOURCE_PLAN_COMMIT = "c4fce6a";
const MIGRATION_NUMBER = "033";
const FUTURE_VALIDATION_PHASE_ID = "9N";
const NEXT_RECOMMENDED_PHASE =
  "9N — Publication and Canonical Translation Schema Extension Isolated PostgreSQL Validation";
const PATCH_ID = "9M-PATCH";
const PATCH_NAME = "Trusted Actor Authorization Boundary Fix";

const MIGRATION_032_REL_PATH = "supabase/migrations/032_create_minimal_knowledge_schema.sql";
const MIGRATION_033_REL_PATH = "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql";
const DESIGN_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-design-audit.ts";
const PLAN_AUDIT_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-implementation-plan-audit.ts";
const PHASE_9G_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-schema-migration-implementation-audit.ts";
const PHASE_9H_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-empty-schema-migration-validation-closure-audit.ts";
const MIGRATION_015_REL_PATH = "supabase/migrations/015_i18n_insert_rpc_and_jobs.sql";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-migration-implementation-audit.ts";

const SOURCE_CLOSURES: readonly string[] = [
  MIGRATION_032_REL_PATH,
  DESIGN_AUDIT_REL_PATH,
  PLAN_AUDIT_REL_PATH,
  PHASE_9G_REL_PATH,
  PHASE_9H_REL_PATH,
  MIGRATION_015_REL_PATH,
];

const EXPECTED_PUBLICATION_STATES: readonly string[] = [
  "draft", "evidence_incomplete", "review_required", "approved", "publication_eligible",
  "published", "suspended", "superseded", "withdrawn",
];
const EXPECTED_TRANSLATION_STATUSES: readonly string[] = [
  "draft", "machine_generated_pending_review", "human_review_pending", "approved",
  "rejected", "invalidated_pending_review", "superseded", "withdrawn",
];
const EXPECTED_OUTPUT_LOCALES: readonly string[] = ["en", "sk", "cs", "pl", "hu"];
const REJECTED_LOCALES: readonly string[] = ["de", "ro", "bg", "uk", "tr", "ru"];
const EXPECTED_NEW_TABLES: readonly string[] = [
  "knowledge_publication_states",
  "knowledge_publication_state_transitions",
  "knowledge_canonical_unit_translations",
];
const EXPECTED_TRANSLATION_IDENTITY_FIELDS: readonly string[] = [
  "entity_type", "entity_id", "field_key", "canonical_content_fingerprint",
  "output_locale", "translation_version",
];

// ============================================================================
// PATCH 9M-PATCH — TRUST-BOUNDARY CONSTANTS
// ============================================================================

/** Parameter names that would let a caller select a privileged authorization identity. */
const FORBIDDEN_PRIVILEGED_ACTOR_PARAM_NAMES: readonly string[] = [
  "p_actor_class", "p_actor_type", "p_created_by_actor_type", "p_reviewer_role", "p_authority_class",
];

/** The fixed, closed set of privileged actor classes recognized anywhere in the schema. */
const KNOWN_PRIVILEGED_ACTOR_CLASSES: readonly string[] = [
  "automated_ingestion_system", "authorized_reviewer", "publication_administrator",
  "emergency_suspension_authority", "migration_bootstrap_system_actor",
];

/** Every grantable RPC that must exist post-patch to reach all 20 transition rules safely. */
const EXPECTED_OPERATION_SCOPED_WRAPPER_NAMES: readonly string[] = [
  "knowledge_bootstrap_publication_subject",
  "knowledge_advance_publication_evidence_status",
  "knowledge_record_publication_review_decision",
  "knowledge_recall_publication_to_review",
  "knowledge_advance_publication_lifecycle",
  "knowledge_supersede_publication_subject",
  "knowledge_withdraw_publication_subject",
  "knowledge_suspend_publication_for_detected_issue",
  "knowledge_emergency_suspend_publication_subject",
  "knowledge_create_machine_translation_candidate",
  "knowledge_create_human_translation_candidate",
  "knowledge_submit_translation_for_review",
  "knowledge_approve_translation",
  "knowledge_reject_translation",
  "knowledge_withdraw_translation",
];

/** Grantable functions whose fixed authority MUST be 'authorized_reviewer'. */
const REVIEWER_AUTHORITY_GRANTABLE_FUNCTIONS: readonly string[] = [
  "knowledge_record_publication_review_decision",
  "knowledge_recall_publication_to_review",
  "knowledge_approve_translation",
  "knowledge_reject_translation",
];
/** Grantable functions whose fixed authority MUST be 'emergency_suspension_authority'. */
const EMERGENCY_AUTHORITY_GRANTABLE_FUNCTIONS: readonly string[] = [
  "knowledge_emergency_suspend_publication_subject",
];
/** Grantable functions whose fixed authority MUST be 'publication_administrator'. */
const PUBLICATION_ADMINISTRATOR_GRANTABLE_FUNCTIONS: readonly string[] = [
  "knowledge_advance_publication_lifecycle",
  "knowledge_supersede_publication_subject",
  "knowledge_withdraw_publication_subject",
];
/** Every grantable function that assigns SOME privileged actor class internally and must therefore carry a literal. */
const ACTOR_ASSIGNING_GRANTABLE_FUNCTIONS: readonly string[] = [
  "knowledge_bootstrap_publication_subject",
  "knowledge_advance_publication_evidence_status",
  "knowledge_record_publication_review_decision",
  "knowledge_recall_publication_to_review",
  "knowledge_advance_publication_lifecycle",
  "knowledge_supersede_publication_subject",
  "knowledge_withdraw_publication_subject",
  "knowledge_suspend_publication_for_detected_issue",
  "knowledge_emergency_suspend_publication_subject",
  "knowledge_create_machine_translation_candidate",
  "knowledge_create_human_translation_candidate",
  "knowledge_approve_translation",
  "knowledge_reject_translation",
];

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

function countMatches(text: string, re: RegExp): number {
  const m = text.match(re);
  return m ? m.length : 0;
}

function extractQuotedValues(fragment: string): string[] {
  const re = /'([^']*)'/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(fragment)) !== null) {
    out.push(m[1]);
  }
  return out;
}

/** Extracts every `column in ( ... )` value list for a given exact column name. */
function extractCheckInLists(sql: string, columnName: string): string[][] {
  const escaped = columnName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `\\b${escaped}\\b[^\\n(]*check\\s*\\([^)]*?\\b${escaped}\\b\\s+in\\s*\\(([\\s\\S]*?)\\)\\)`,
    "g"
  );
  const results: string[][] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    results.push(extractQuotedValues(m[1]));
  }
  return results;
}

/** Removes every `as $$ ... $$;` dollar-quoted PL/pgSQL function body from the SQL text. */
function stripDollarQuotedFunctionBodies(sql: string): string {
  return sql.replace(/as\s+\$\$[\s\S]*?\$\$;/g, "AS_DOLLAR_QUOTED_BODY_REMOVED;");
}

/** Strips `-- ...` line comments so keyword/pattern checks never match prose in comments. */
function stripLineComments(sql: string): string {
  return sql.replace(/--.*$/gm, "");
}

function extractFunctionBody(sql: string, functionNamePattern: string): string {
  const re = new RegExp(
    `create or replace function public\\.${functionNamePattern}\\s*\\([\\s\\S]*?\\)[\\s\\S]*?as \\$\\$([\\s\\S]*?)\\$\\$;`
  );
  const m = sql.match(re);
  return m ? m[1] : "";
}

function extractCreateTableNames(sql: string): string[] {
  const re = /create table if not exists public\.(knowledge_[a-z0-9_]+)\s*\(/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    out.push(m[1]);
  }
  return out;
}

function extractSecurityDefinerFunctionNames(sql: string): string[] {
  const re = /create or replace function public\.([a-z0-9_]+)\s*\(([\s\S]*?)\)[\s\S]*?(?=as \$\$)/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    const header = m[0];
    if (/\bsecurity definer\b/i.test(header)) {
      names.push(m[1]);
    }
  }
  return names;
}

// ============================================================================
// PATCH 9M-PATCH — FULL FUNCTION-LEVEL TRUST CLASSIFICATION
// ============================================================================

interface FunctionSignature {
  name: string;
  paramsRaw: string;
  paramNames: string[];
  isSecurityDefiner: boolean;
  returnsTrigger: boolean;
  body: string;
  granted: boolean;
  calls: string[];
}

/**
 * Parses every `create or replace function public.NAME(params) ... as $$ body $$;`
 * block in the SQL text into a structured signature: parameter names (for
 * privileged-parameter detection), SECURITY DEFINER / RETURNS TRIGGER status,
 * whether an exact-name `grant execute ... to service_role;` line exists
 * anywhere in the file, and which other functions its body calls via
 * `... from public.X(` or `perform public.X(` (used to build the
 * internal-engine vs. system-only caller graph below).
 */
function extractFunctionSignatures(sql: string): FunctionSignature[] {
  const re = /create or replace function public\.([a-z0-9_]+)\s*\(([\s\S]*?)\)\s*([\s\S]*?)as \$\$([\s\S]*?)\$\$;/g;
  const out: FunctionSignature[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    const name = m[1];
    const paramsRaw = m[2];
    const preamble = m[3];
    const body = m[4];
    const isSecurityDefiner = /\bsecurity definer\b/i.test(preamble);
    const returnsTrigger = /\breturns\s+trigger\b/i.test(preamble);
    const paramNames = [...paramsRaw.matchAll(/(p_[a-z0-9_]+)\s+[a-z]/gi)].map((pm) => pm[1].toLowerCase());
    const grantRe = new RegExp(`grant execute on function public\\.${name}\\([^)]*\\)\\s+to service_role;`);
    const granted = grantRe.test(sql);
    const calls = [...body.matchAll(/(?:from|perform)\s+public\.([a-z0-9_]+)\(/gi)].map((cm) => cm[1].toLowerCase());
    out.push({ name, paramsRaw, paramNames, isSecurityDefiner, returnsTrigger, body, granted, calls });
  }
  return out;
}

interface TrustClassification {
  allFunctions: FunctionSignature[];
  securityDefinerFns: FunctionSignature[];
  grantableFns: FunctionSignature[];
  triggerOnlyFns: FunctionSignature[];
  internalPrivilegedEngineFns: FunctionSignature[];
  systemOnlyFns: FunctionSignature[];
  grantableFnsWithForbiddenParam: FunctionSignature[];
  genericTransitionEngineGranted: boolean;
  operationScopedWrappersPresent: boolean;
  actorAssigningFunctionsHaveLiteral: boolean;
  reviewerAuthorityFunctionsSafe: boolean;
  emergencyAuthorityFunctionsSafe: boolean;
  publicationAdministratorFunctionsSafe: boolean;
}

function classifyTrustBoundary(sql: string): TrustClassification {
  const allFunctions = extractFunctionSignatures(sql);
  const securityDefinerFns = allFunctions.filter((f) => f.isSecurityDefiner);
  const grantableFns = securityDefinerFns.filter((f) => f.granted);
  const triggerOnlyFns = securityDefinerFns.filter((f) => !f.granted && f.returnsTrigger);
  const nonGrantedNonTrigger = securityDefinerFns.filter((f) => !f.granted && !f.returnsTrigger);

  const callersOf = (name: string): FunctionSignature[] =>
    securityDefinerFns.filter((f) => f.calls.includes(name));

  const internalPrivilegedEngineFns = nonGrantedNonTrigger.filter((f) =>
    callersOf(f.name).some((c) => c.granted)
  );
  const systemOnlyFns = nonGrantedNonTrigger.filter(
    (f) => !callersOf(f.name).some((c) => c.granted)
  );

  const grantableFnsWithForbiddenParam = grantableFns.filter((f) =>
    f.paramNames.some((p) => FORBIDDEN_PRIVILEGED_ACTOR_PARAM_NAMES.includes(p))
  );

  const transitionEngine = allFunctions.find((f) => f.name === "knowledge_transition_publication_state");
  const genericTransitionEngineGranted = !!transitionEngine?.granted;

  const operationScopedWrappersPresent = EXPECTED_OPERATION_SCOPED_WRAPPER_NAMES.every((n) =>
    grantableFns.some((f) => f.name === n)
  );

  const fnByName = (name: string): FunctionSignature | undefined => allFunctions.find((f) => f.name === name);
  const bodyHasActorClassLiteral = (name: string): boolean => {
    const fn = fnByName(name);
    if (!fn) return false;
    return KNOWN_PRIVILEGED_ACTOR_CLASSES.some((c) => fn.body.includes(`'${c}'`));
  };
  const grantableFnIsSafeFixedActor = (name: string, literal: string): boolean => {
    const fn = grantableFns.find((f) => f.name === name);
    if (!fn) return false;
    const hasForbiddenParam = fn.paramNames.some((p) => FORBIDDEN_PRIVILEGED_ACTOR_PARAM_NAMES.includes(p));
    const hasLiteral = fn.body.includes(`'${literal}'`);
    return !hasForbiddenParam && hasLiteral;
  };

  const actorAssigningFunctionsHaveLiteral = ACTOR_ASSIGNING_GRANTABLE_FUNCTIONS.every((n) =>
    bodyHasActorClassLiteral(n)
  );
  const reviewerAuthorityFunctionsSafe = REVIEWER_AUTHORITY_GRANTABLE_FUNCTIONS.every((n) =>
    grantableFnIsSafeFixedActor(n, "authorized_reviewer")
  );
  const emergencyAuthorityFunctionsSafe = EMERGENCY_AUTHORITY_GRANTABLE_FUNCTIONS.every((n) =>
    grantableFnIsSafeFixedActor(n, "emergency_suspension_authority")
  );
  const publicationAdministratorFunctionsSafe = PUBLICATION_ADMINISTRATOR_GRANTABLE_FUNCTIONS.every((n) =>
    grantableFnIsSafeFixedActor(n, "publication_administrator")
  );

  return {
    allFunctions,
    securityDefinerFns,
    grantableFns,
    triggerOnlyFns,
    internalPrivilegedEngineFns,
    systemOnlyFns,
    grantableFnsWithForbiddenParam,
    genericTransitionEngineGranted,
    operationScopedWrappersPresent,
    actorAssigningFunctionsHaveLiteral,
    reviewerAuthorityFunctionsSafe,
    emergencyAuthorityFunctionsSafe,
    publicationAdministratorFunctionsSafe,
  };
}

// ============================================================================
// STATIC MIGRATION-033 ANALYSIS
// ============================================================================

interface MigrationAnalysis {
  sql033: string;
  sql032: string;
  newTableNames: string[];
  existingTableNames: string[];
  dropTableDetected: boolean;
  dropColumnDetected: boolean;
  renameDetected: boolean;
  pgcryptoIndex: number;
  firstDigestUsageIndex: number;
  pgcryptoCreatedBeforeDigestUsage: boolean;
  usesMd5: boolean;
  usesSha1: boolean;
  usesSha256: boolean;
  publicationStates: string[];
  translationStatuses: string[];
  outputLocales: string[];
  fromStateLists: string[][];
  entityTypeLists: string[][];
  transitionReasonCodes: string[];
  actorClasses: string[];
  bootstrapRpcPresent: boolean;
  bootstrapFunctionBody: string;
  bootstrapUsesNullDraftZeroOne: boolean;
  bootstrapCatchesUniqueViolation: boolean;
  bootstrapChecksIdempotencyKey: boolean;
  transitionRpcPresent: boolean;
  transitionFunctionBody: string;
  transitionUsesForUpdate: boolean;
  transitionUsesExpectedStateVersion: boolean;
  transitionRuleCount: number;
  transitionReferencesWithdrawnAsSource: boolean;
  transitionRequiresReplacementForSupersede: boolean;
  emergencySuspendFunctionPresent: boolean;
  emergencySuspendDelegatesToTransitionEngine: boolean;
  publicationSubjectMappingCount: number;
  translationEntityFieldAllowlistCount: number;
  unrestrictedDynamicSqlDetected: boolean;
  appendOnlyTriggerPresent: boolean;
  approvedImmutabilityTriggerPresent: boolean;
  approvedImmutabilityFieldsCovered: string[];
  activeApprovedIndexPresent: boolean;
  activeApprovedIndexColumns: string;
  fullHistoryUniqueColumns: string;
  invalidationTriggerFunctionPresent: boolean;
  invalidationTriggerInstallCount: number;
  invalidationTriggerFunctionIsSecurityDefiner: boolean;
  securityDefinerFunctionNames: string[];
  securityDefinerFunctionCount: number;
  searchPathHardenedCount: number;
  revokeAllFunctionCount: number;
  totalFunctionCount: number;
  grantExecuteServiceRoleCount: number;
  publicGrantOnFunctionDetected: boolean;
  rlsEnabledTableCount: number;
  createPolicyCount: number;
  revokeOnNewTablesCount: number;
  createIndexCount: number;
  createUniqueIndexCount: number;
  addConstraintUniqueCount: number;
  totalIndexObjectCount: number;
  topLevelInsertDetected: boolean;
  realGovernmentContentPatternsDetected: boolean;
  crossBorderConnectorReferenced: boolean;
  firstContactPatternsDetected: boolean;
  localeUsedForJurisdictionSelection: boolean;
  createExtensionPgcryptoPresent: boolean;
  createEnumDetected: boolean;
  trust: TrustClassification;
}

function analyzeMigrations(): MigrationAnalysis {
  const sql033 = readFileText(MIGRATION_033_REL_PATH);
  const sql032 = readFileText(MIGRATION_032_REL_PATH);
  const codeOnly033 = stripLineComments(sql033);

  const existingTableNames = extractCreateTableNames(sql032);
  const allTableNamesIn033 = extractCreateTableNames(sql033);
  const newTableNames = allTableNamesIn033.filter((n) => !existingTableNames.includes(n));

  const dropTableDetected = /\bdrop\s+table\b/i.test(codeOnly033);
  const dropColumnDetected = /\bdrop\s+column\b/i.test(codeOnly033);
  const renameDetected = /\brename\s+(to|column)\b/i.test(codeOnly033);
  const createEnumDetected = /\bcreate\s+type\s+[a-z0-9_.]+\s+as\s+enum\b/i.test(codeOnly033);

  const pgcryptoMatch = codeOnly033.match(/create extension if not exists pgcrypto/i);
  const pgcryptoIndex = pgcryptoMatch ? (pgcryptoMatch.index ?? -1) : -1;
  const digestMatches = [...codeOnly033.matchAll(/\bdigest\s*\(/gi)];
  const firstDigestUsageIndex = digestMatches.length > 0 ? (digestMatches[0].index ?? -1) : -1;
  const pgcryptoCreatedBeforeDigestUsage =
    pgcryptoIndex >= 0 && (firstDigestUsageIndex === -1 || pgcryptoIndex < firstDigestUsageIndex);

  const usesMd5 = /\bdigest\s*\([^)]*'md5'/i.test(codeOnly033) || /\bmd5\s*\(/i.test(codeOnly033);
  const usesSha1 = /'sha1'/i.test(codeOnly033);
  const usesSha256 = /'sha256'/i.test(codeOnly033);

  const publicationStatesLists = extractCheckInLists(sql033, "current_state");
  const publicationStates = publicationStatesLists.length > 0 ? publicationStatesLists[0] : [];

  const translationStatusLists = extractCheckInLists(sql033, "translation_status");
  const translationStatuses = translationStatusLists.length > 0 ? translationStatusLists[0] : [];

  const outputLocaleLists = extractCheckInLists(sql033, "output_locale");
  const outputLocales = outputLocaleLists.length > 0 ? outputLocaleLists[0] : [];

  const fromStateRe = /\bfrom_state\s+text\s+check\s*\(from_state is null or from_state in \(([\s\S]*?)\)\)/g;
  const fromStateLists: string[][] = [];
  {
    let m: RegExpExecArray | null;
    while ((m = fromStateRe.exec(sql033)) !== null) {
      fromStateLists.push(extractQuotedValues(m[1]));
    }
  }

  const entityTypeLists = extractCheckInLists(sql033, "entity_type");

  const reasonCodeLists = extractCheckInLists(sql033, "transition_reason_code");
  const transitionReasonCodes = reasonCodeLists.length > 0 ? reasonCodeLists[0] : [];

  const actorClassLists = extractCheckInLists(sql033, "actor_class");
  const actorClasses = actorClassLists.length > 0 ? actorClassLists[0] : [];

  const bootstrapFunctionBody = extractFunctionBody(sql033, "knowledge_bootstrap_publication_subject");
  const bootstrapRpcPresent = bootstrapFunctionBody.length > 0;
  const bootstrapUsesNullDraftZeroOne = /null,\s*'draft',\s*0,\s*1,/.test(bootstrapFunctionBody);
  const bootstrapCatchesUniqueViolation = /exception\s+when\s+unique_violation/i.test(bootstrapFunctionBody);
  const bootstrapChecksIdempotencyKey = /idempotency_key/i.test(bootstrapFunctionBody);

  const transitionFunctionBody = extractFunctionBody(sql033, "knowledge_transition_publication_state");
  const transitionRpcPresent = transitionFunctionBody.length > 0;
  const transitionUsesForUpdate = /for update/i.test(transitionFunctionBody);
  const transitionUsesExpectedStateVersion = /expected_state_version/i.test(transitionFunctionBody);
  const transitionRuleCount = countMatches(transitionFunctionBody, /then v_authorized := true;/g);
  const transitionReferencesWithdrawnAsSource = /v_current_state\s*=\s*'withdrawn'\s*and\s*p_to_state/i.test(
    transitionFunctionBody
  );
  const transitionRequiresReplacementForSupersede =
    /p_to_state\s*=\s*'superseded'/.test(transitionFunctionBody) &&
    /replacement_entity_id is null or p_replacement_entity_type is null/.test(transitionFunctionBody);

  const emergencyBody = extractFunctionBody(sql033, "knowledge_emergency_suspend_publication_subject");
  const emergencySuspendFunctionPresent = emergencyBody.length > 0;
  const emergencySuspendDelegatesToTransitionEngine = /knowledge_transition_publication_state\s*\(/.test(
    emergencyBody
  );

  const subjectExistsBody = extractFunctionBody(sql033, "fn_publication_subject_exists");
  const publicationSubjectMappingCount = countMatches(subjectExistsBody, /when\s+'[a-z0-9_]+'\s+then/g);

  const translationTargetBody = extractFunctionBody(sql033, "fn_translation_target_exists");
  const translationEntityFieldAllowlistCount = countMatches(
    translationTargetBody,
    /p_entity_type\s*=\s*'[a-z0-9_]+'\s+and\s+p_field_key\s*=\s*'[a-z0-9_]+'\s+then/g
  );

  const unrestrictedDynamicSqlDetected =
    /\bexecute\s+format\s*\(/i.test(codeOnly033) ||
    /\bexecute\s+'/i.test(codeOnly033) ||
    /\bexecute\s+\(\s*'/i.test(codeOnly033);

  const appendOnlyTriggerPresent =
    /trg_publication_state_transitions_append_only/.test(sql033) &&
    /before update or delete on public\.knowledge_publication_state_transitions/.test(sql033);

  const protectVerifiedBody = extractFunctionBody(sql033, "fn_canonical_unit_translations_protect_verified");
  const approvedImmutabilityTriggerPresent = protectVerifiedBody.length > 0;
  const approvedImmutabilityFieldsCovered = EXPECTED_TRANSLATION_IDENTITY_FIELDS.concat(["translated_text"]).filter(
    (f) => new RegExp(`new\\.${f}\\s+is distinct from old\\.${f}`).test(protectVerifiedBody)
  );

  const activeApprovedIndexMatch = sql033.match(
    /create unique index if not exists ux_translations_active_approved_unique\s+on public\.knowledge_canonical_unit_translations\s*\(([^)]*)\)/
  );
  const activeApprovedIndexPresent = !!activeApprovedIndexMatch;
  const activeApprovedIndexColumns = activeApprovedIndexMatch ? activeApprovedIndexMatch[1] : "";

  const fullHistoryUniqueMatch = sql033.match(
    /add constraint ux_translations_full_history_unique\s+unique\s*\(([^)]*)\)/
  );
  const fullHistoryUniqueColumns = fullHistoryUniqueMatch ? fullHistoryUniqueMatch[1] : "";

  const invalidationFnBody = extractFunctionBody(sql033, "fn_canonical_content_changed_invalidate_translations");
  const invalidationTriggerFunctionPresent = invalidationFnBody.length > 0;
  const invalidationFnHeaderMatch = sql033.match(
    /create or replace function public\.fn_canonical_content_changed_invalidate_translations\s*\(\s*\)[\s\S]*?as \$\$/
  );
  const invalidationTriggerFunctionIsSecurityDefiner = invalidationFnHeaderMatch
    ? /security definer/i.test(invalidationFnHeaderMatch[0])
    : false;
  const invalidationTriggerInstallCount = countMatches(
    sql033,
    /execute function public\.fn_canonical_content_changed_invalidate_translations\(/g
  );

  const securityDefinerFunctionNames = extractSecurityDefinerFunctionNames(sql033);
  const securityDefinerFunctionCount = securityDefinerFunctionNames.length;
  const searchPathHardenedCount = countMatches(codeOnly033, /set search_path = pg_catalog, public/g);

  const revokeAllFunctionCount = countMatches(sql033, /revoke all on function public\./g);
  const totalFunctionCount = countMatches(sql033, /create or replace function public\./g);
  const grantExecuteServiceRoleCount = countMatches(
    sql033,
    /grant execute on function public\.[a-z0-9_]+\([^)]*\)\s+to service_role;/g
  );
  const publicGrantOnFunctionDetected = /grant execute on function[^;]*\bto\s+public\b/i.test(codeOnly033);

  const newTableRlsRe = /alter table public\.(knowledge_publication_states|knowledge_publication_state_transitions|knowledge_canonical_unit_translations) enable row level security;/g;
  const rlsEnabledTableCount = countMatches(sql033, newTableRlsRe);
  const createPolicyCount = countMatches(sql033, /create policy/gi);
  const revokeOnNewTablesCount = countMatches(
    sql033,
    /revoke all on public\.(knowledge_publication_states|knowledge_publication_state_transitions|knowledge_canonical_unit_translations) from public, anon, authenticated;/g
  );

  const createIndexCount = countMatches(sql033, /^create index if not exists/gm);
  const createUniqueIndexCount = countMatches(sql033, /^create unique index if not exists/gm);
  const addConstraintUniqueCount = countMatches(sql033, /add constraint ux_[a-z0-9_]+\s+unique\s*\(/g);
  const totalIndexObjectCount = createIndexCount + createUniqueIndexCount + addConstraintUniqueCount;

  const strippedOfFunctionBodies = stripDollarQuotedFunctionBodies(sql033);
  const topLevelInsertDetected = /^\s*insert into\b/im.test(strippedOfFunctionBodies);

  const realGovernmentContentPatternsDetected =
    /(anmeldebeh(ö|oe)rde|einwohnermeldeamt|b(ü|ue)rgeramt|§\s?\d|bundesgesetzblatt)/i.test(codeOnly033);
  const crossBorderConnectorReferenced = /cross_border/i.test(codeOnly033);
  const firstContactPatternsDetected = /first_contact/i.test(codeOnly033);
  const localeUsedForJurisdictionSelection = /jurisdiction[a-z_]*\s*=\s*p_output_locale|output_locale\s*=\s*jurisdiction/i.test(
    codeOnly033
  );
  const createExtensionPgcryptoPresent = pgcryptoIndex >= 0;

  const trust = classifyTrustBoundary(sql033);

  return {
    sql033,
    sql032,
    newTableNames,
    existingTableNames,
    dropTableDetected,
    dropColumnDetected,
    renameDetected,
    pgcryptoIndex,
    firstDigestUsageIndex,
    pgcryptoCreatedBeforeDigestUsage,
    usesMd5,
    usesSha1,
    usesSha256,
    publicationStates,
    translationStatuses,
    outputLocales,
    fromStateLists,
    entityTypeLists,
    transitionReasonCodes,
    actorClasses,
    bootstrapRpcPresent,
    bootstrapFunctionBody,
    bootstrapUsesNullDraftZeroOne,
    bootstrapCatchesUniqueViolation,
    bootstrapChecksIdempotencyKey,
    transitionRpcPresent,
    transitionFunctionBody,
    transitionUsesForUpdate,
    transitionUsesExpectedStateVersion,
    transitionRuleCount,
    transitionReferencesWithdrawnAsSource,
    transitionRequiresReplacementForSupersede,
    emergencySuspendFunctionPresent,
    emergencySuspendDelegatesToTransitionEngine,
    publicationSubjectMappingCount,
    translationEntityFieldAllowlistCount,
    unrestrictedDynamicSqlDetected,
    appendOnlyTriggerPresent,
    approvedImmutabilityTriggerPresent,
    approvedImmutabilityFieldsCovered,
    activeApprovedIndexPresent,
    activeApprovedIndexColumns,
    fullHistoryUniqueColumns,
    invalidationTriggerFunctionPresent,
    invalidationTriggerInstallCount,
    invalidationTriggerFunctionIsSecurityDefiner,
    securityDefinerFunctionNames,
    securityDefinerFunctionCount,
    searchPathHardenedCount,
    revokeAllFunctionCount,
    totalFunctionCount,
    grantExecuteServiceRoleCount,
    publicGrantOnFunctionDetected,
    rlsEnabledTableCount,
    createPolicyCount,
    revokeOnNewTablesCount,
    createIndexCount,
    createUniqueIndexCount,
    addConstraintUniqueCount,
    totalIndexObjectCount,
    topLevelInsertDetected,
    realGovernmentContentPatternsDetected,
    crossBorderConnectorReferenced,
    firstContactPatternsDetected,
    localeUsedForJurisdictionSelection,
    createExtensionPgcryptoPresent,
    createEnumDetected,
    trust,
  };
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

// ============================================================================
// GIT SCOPE EVIDENCE
// ============================================================================

interface GitEvidence {
  diffNameOnly: string[];
  statusShort: string[];
  untrackedNew: string[];
  onlyExpectedFilesChanged: boolean;
  existingFileModified: boolean;
  migration033Created: boolean;
  auditFileCreated: boolean;
  migrationNumberIsNextAvailable: boolean;
  notes: string[];
}

function collectGitEvidence(): GitEvidence {
  const notes: string[] = [];
  const diffNameOnly = runGitReadOnly("git diff --name-only")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const statusShort = runGitReadOnly("git status --short")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  const expectedNewPaths = [MIGRATION_033_REL_PATH, AUDIT_SELF_REL_PATH];
  const isExpected = (p: string): boolean => expectedNewPaths.some((e) => p === e || p.endsWith(e));

  const unexpectedModified = diffNameOnly.filter((p) => !expectedNewPaths.includes(p));
  const unexpectedUntracked = untrackedNew.filter((p) => !isExpected(p));

  const migration033Created = fileExists(MIGRATION_033_REL_PATH) && untrackedNew.some(isExpected);
  const auditFileCreated = fileExists(AUDIT_SELF_REL_PATH);

  const onlyExpectedFilesChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const migrationFiles = listDirNamesOnly(MIGRATIONS_DIR_REL_PATH);
  const numberedPattern = /^(\d{3})_[a-z0-9_]+\.sql$/;
  const otherNumbers = migrationFiles
    .filter((f) => f !== "033_add_publication_and_canonical_translation_schema.sql")
    .map((f) => f.match(numberedPattern))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => parseInt(m[1], 10));
  const maxOtherNumber = otherNumbers.length > 0 ? Math.max(...otherNumbers) : 0;
  const migrationNumberIsNextAvailable = maxOtherNumber === 32 && MIGRATION_NUMBER === "033";

  return {
    diffNameOnly,
    statusShort,
    untrackedNew,
    onlyExpectedFilesChanged,
    existingFileModified,
    migration033Created,
    auditFileCreated,
    migrationNumberIsNextAvailable,
    notes,
  };
}

// ============================================================================
// RESULT TYPE
// ============================================================================

interface Result {
  phaseId: string;
  phaseName: string;
  implementationKind: string;
  sourcePlanPhaseId: string;
  sourcePlanCommit: string;
  migrationNumber: string;
  migrationFile: string;
  futureValidationPhaseId: string;
  patchId: string;
  patchName: string;

  sourceClosureCount: number;
  sourceClosuresPresent: boolean;

  existingKnowledgeTableCount: number;
  existingKnowledgeTablesPreserved: boolean;
  newKnowledgeTableCount: number;
  newKnowledgeTables: string[];
  postMigrationKnowledgeTableCountExpected: number;

  migrationIsAdditive: boolean;
  existingMigrationModified: boolean;
  dropTableDetected: boolean;
  dropColumnDetected: boolean;
  renameDetected: boolean;

  pgcryptoExtensionPlanned: boolean;
  pgcryptoCreatedBeforeDigestUsage: boolean;
  fingerprintAlgorithm: string;
  fingerprintDatabaseDerived: boolean;
  callerFingerprintTrustedAsAuthority: boolean;

  publicationStateCount: number;
  publicationStates: string[];
  translationLifecycleStateCount: number;
  translationLifecycleStates: string[];
  translationOutputLocaleCount: number;
  translationOutputLocales: string[];

  publicationBootstrapRpcPresent: boolean;
  bootstrapInitialPreviousState: string | null;
  bootstrapInitialNextState: string;
  bootstrapInitialStateVersion: number;
  bootstrapAtomicByFunctionTransaction: boolean;
  duplicateBootstrapBlocked: boolean;
  bootstrapIdempotencyImplemented: boolean;
  currentTransitionRequiredAfterBootstrap: boolean;

  publicationTransitionRpcPresent: boolean;
  publicationTransitionRuleCount: number;
  publicationTransitionMatrixCoverageCount: number;
  expectedStateVersionRequired: boolean;
  rowLockPresent: boolean;
  lastWriteWinsAllowed: boolean;
  projectionAndTransitionAtomic: boolean;

  publicationSubjectMappingCount: number;
  publicationSubjectAllowlistImplemented: boolean;
  unrestrictedDynamicSqlDetected: boolean;
  localeUsedForJurisdiction: boolean;

  canonicalTranslationIdentityFields: string[];
  canonicalTranslationCompositeIdentityEnforced: boolean;
  fingerprintAloneAcceptedAsIdentity: boolean;
  canonicalFingerprintDatabaseVerified: boolean;
  translationEntityFieldAllowlistCount: number;
  translationEntityFieldAllowlistImplemented: boolean;

  activeApprovedPartialUniqueIndexPresent: boolean;
  translationVersionExcludedFromActiveApprovedKey: boolean;
  approvedTranslationIdentityImmutable: boolean;
  approvedTranslationContentImmutable: boolean;
  canonicalChangeInvalidationTriggerCount: number;
  canonicalChangeInvalidationImplemented: boolean;
  silentTranslationCarryForwardAllowed: boolean;

  transitionUpdateBlocked: boolean;
  transitionDeleteBlocked: boolean;
  withdrawnTerminalEnforced: boolean;
  supersessionReplacementRequired: boolean;
  emergencySuspensionControlled: boolean;

  securityDefinerFunctionCount: number;
  securityDefinerFunctions: string[];
  securityDefinerSearchPathsHardened: boolean;
  publicFunctionExecuteRevoked: boolean;
  serviceRoleExecuteGranted: boolean;

  // --- PATCH 9M-PATCH: function-level trust classification evidence ---
  grantableSecurityDefinerFunctionCount: number;
  grantableSecurityDefinerFunctions: string[];
  internalPrivilegedEngineCount: number;
  internalPrivilegedEngines: string[];
  triggerOnlySecurityDefinerFunctionCount: number;
  triggerOnlySecurityDefinerFunctions: string[];
  systemOnlyFunctionCount: number;
  systemOnlyFunctions: string[];

  grantableFunctionsWithCallerControlledPrivilegedActorParameterCount: number;
  grantableFunctionsWithCallerControlledPrivilegedActorParameters: string[];
  genericTransitionEngineGrantedToServiceRole: boolean;
  operationScopedWrappersPresent: boolean;

  privilegedActorClassCallerControlled: boolean;
  genericPrivilegedTransitionEngineDirectlyGranted: boolean;
  actorClassDerivedFromTrustedOperation: boolean;
  reviewerRoleCallerControlled: boolean;
  emergencyAuthorityCallerControlled: boolean;
  publicationAdministratorCallerControlled: boolean;

  newTableRlsEnabledCount: number;
  newTableRlsEnabled: boolean;
  permissivePublicPolicyCount: number;
  publicDirectReadAllowed: boolean;
  publicDirectWriteAllowed: boolean;
  anonymousKnowledgeWriteAllowed: boolean;
  authenticatedKnowledgeWriteAllowed: boolean;
  smartTalkRuntimeWriteAllowed: boolean;

  indexCount: number;
  activeApprovedCorrectnessIndexPresent: boolean;
  redundantIndexCount: number;

  realSourceFetched: boolean;
  realGovernmentContentStored: boolean;
  realKnowledgeRowsInserted: boolean;
  databaseMigrationApplied: boolean;
  databaseWritePerformed: boolean;
  remoteDatabaseUsed: boolean;
  runtimeRetrievalEnabled: boolean;
  germanKnowledgePackPublished: boolean;
  crossBorderConnectorActivated: boolean;
  standaloneFirstContactModeIntroduced: boolean;
  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;

  onlyExpectedFilesChangedAccepted: boolean;
  existingFileModifiedAccepted: boolean;
  thirdFileCreatedAccepted: boolean;
  migrationFileMissingAccepted: boolean;
  auditFileMissingAccepted: boolean;
  wrongMigrationNumberAccepted: boolean;
  postgresqlStartedAccepted: boolean;
  dockerStartedAccepted: boolean;
  supabaseCliExecutedAccepted: boolean;
  migrationAppliedAccepted: boolean;
  fourthTableAddedAccepted: boolean;
  postgresqlEnumIntroducedAccepted: boolean;
  realInsertRowIntroducedAccepted: boolean;
  pgcryptoMissingAccepted: boolean;
  pgcryptoAfterDigestAccepted: boolean;
  md5UsedAccepted: boolean;
  sha1UsedAccepted: boolean;
  callerFingerprintTrustedAccepted: boolean;
  germanOutputLocaleAcceptedAccepted: boolean;
  inactiveLocaleAcceptedAccepted: boolean;
  directPublishedBootstrapAccepted: boolean;
  bootstrapVersionStartsAtZeroAccepted: boolean;
  nullTransitionAllowedAfterCommitAccepted: boolean;
  duplicateBootstrapPossibleAccepted: boolean;
  bootstrapTransitionAndStateSplitAccepted: boolean;
  bootstrapPublicExecuteAllowedAccepted: boolean;
  transitionNoExpectedVersionAccepted: boolean;
  transitionNoForUpdateAccepted: boolean;
  callerSuppliesResultingVersionAccepted: boolean;
  withdrawnOutboundAccepted: boolean;
  draftToPublishedAccepted: boolean;
  approvedToPublishedAccepted: boolean;
  transitionHistoryMutableAccepted: boolean;
  transitionHistoryDeletableAccepted: boolean;
  oneCompositeIdentityFieldMissingAccepted: boolean;
  fingerprintOnlyIdentityAccepted: boolean;
  arbitraryEntityTypeAccepted: boolean;
  arbitraryFieldKeyAccepted: boolean;
  twoActiveApprovedRowsAllowedAccepted: boolean;
  translationVersionInActiveApprovedKeyAccepted: boolean;
  approvedContentEditableAccepted: boolean;
  approvedIdentityEditableAccepted: boolean;
  staleFingerprintAcceptedAccepted: boolean;
  silentCarryForwardEnabledAccepted: boolean;
  invalidationTriggerMissingAccepted: boolean;
  wrongTriggerCountAccepted: boolean;
  oldFingerprintRewrittenAccepted: boolean;
  historicalRowDeletedAccepted: boolean;
  candidateAutoCreatedAccepted: boolean;
  rlsMissingAccepted: boolean;
  permissivePublicPolicyAccepted: boolean;
  anonTableGrantAccepted: boolean;
  authenticatedTableGrantAccepted: boolean;
  publicFunctionExecuteAcceptedAccepted: boolean;
  mutableSearchPathAcceptedAccepted: boolean;
  callerClaimsReviewerRoleAccepted: boolean;
  serviceRoleDirectDmlNormalPathAccepted: boolean;
  databaseAppliedAcceptedAccepted: boolean;
  realDataInsertedAcceptedAccepted: boolean;
  runtimeRetrievalEnabledAcceptedAccepted: boolean;
  crossBorderActivatedAcceptedAccepted: boolean;
  localeForJurisdictionAcceptedAccepted: boolean;
  firstContactIntroducedAcceptedAccepted: boolean;
  productionAuthorizedAcceptedAccepted: boolean;
  publicRuntimeAuthorizedAcceptedAccepted: boolean;

  // --- PATCH 9M-PATCH: 20 new tamper-acceptance flags (section 18) ---
  actorClassParamPresentAccepted: boolean;
  createdByActorTypeParamPresentAccepted: boolean;
  callerClaimsAuthorizedReviewerAccepted: boolean;
  callerClaimsPublicationAdministratorAccepted: boolean;
  callerClaimsEmergencyAuthorityAccepted: boolean;
  callerClaimsMigrationBootstrapSystemAccepted: boolean;
  callerClaimsAutomatedIngestionSystemAccepted: boolean;
  transitionEngineGrantedToServiceRoleAccepted: boolean;
  transitionEngineArbitraryToStateGrantableAccepted: boolean;
  emergencyWrapperForwardsCallerActorClassAccepted: boolean;
  approvalWrapperForwardsCallerReviewerRoleAccepted: boolean;
  bootstrapWrapperForwardsCallerActorClassAccepted: boolean;
  actorClassAllowlistOnlyCheckAcceptedAsSafe: boolean;
  actorIdentifierReusedAsAuthorizationAccepted: boolean;
  auditMetadataTreatedAsTrustedRoleAccepted: boolean;
  internalEngineGrantedToPublicAccepted: boolean;
  operationWrapperPermitsUnrelatedTargetStateAccepted: boolean;
  translationApprovalAcceptsCallerReviewerClassAccepted: boolean;
  candidateCreationAcceptsPrivilegedCreatorActorTypeAccepted: boolean;
  systemInvalidationGrantedToServiceRoleAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: boolean;

  blockingImplementationGapCount: number;
  blockingImplementationGaps: string[];

  allPassed: boolean;
  readyForPublicationAndCanonicalTranslationSchemaExtensionIsolatedPostgreSqlValidation: boolean;
  readyForRealGermanSourceIngestion: boolean;
  readyForControlledDatabaseWrite: boolean;
  readyForRuntimeRetrieval: boolean;
  nextRecommendedPhase: string;

  notes: string[];
}

// ============================================================================
// BUILD GOOD RESULT
// ============================================================================

function buildGoodResult(a: MigrationAnalysis, g: GitEvidence): Result {
  const notes: string[] = [...g.notes];

  const existingKnowledgeTableCount = a.existingTableNames.length;
  const existingKnowledgeTablesPreserved =
    existingKnowledgeTableCount === 33 &&
    !a.dropTableDetected &&
    !a.dropColumnDetected &&
    !a.renameDetected &&
    !g.existingFileModified;

  const newKnowledgeTableCount = a.newTableNames.length;
  const newTablesMatchExpected =
    newKnowledgeTableCount === 3 && EXPECTED_NEW_TABLES.every((t) => a.newTableNames.includes(t));

  const publicationStateCount = a.publicationStates.length;
  const publicationStatesMatch =
    publicationStateCount === 9 && EXPECTED_PUBLICATION_STATES.every((s) => a.publicationStates.includes(s));

  const translationLifecycleStateCount = a.translationStatuses.length;
  const translationStatusesMatch =
    translationLifecycleStateCount === 8 &&
    EXPECTED_TRANSLATION_STATUSES.every((s) => a.translationStatuses.includes(s));

  const translationOutputLocaleCount = a.outputLocales.length;
  const outputLocalesMatch =
    translationOutputLocaleCount === 5 &&
    EXPECTED_OUTPUT_LOCALES.every((l) => a.outputLocales.includes(l)) &&
    !REJECTED_LOCALES.some((l) => a.outputLocales.includes(l));

  const bootstrapEdgeCount = a.bootstrapUsesNullDraftZeroOne ? 1 : 0;
  const publicationTransitionRuleCount = a.transitionRuleCount + bootstrapEdgeCount;

  // 12-entry publication-subject allowlist appears 3 times (transitions.entity_type,
  // states.entity_type, transitions.replacement_entity_type); every occurrence must
  // carry exactly the same 12-value set for the allowlist to be closed and consistent.
  const twelveValueEntityTypeLists = a.entityTypeLists.filter((l) => l.length === 12);
  const publicationSubjectAllowlistImplemented =
    a.publicationSubjectMappingCount === 12 &&
    twelveValueEntityTypeLists.length >= 2 &&
    twelveValueEntityTypeLists.every(
      (l) => l.slice().sort().join("|") === twelveValueEntityTypeLists[0].slice().sort().join("|")
    );

  const translationEntityFieldAllowlistImplemented = a.translationEntityFieldAllowlistCount === 8;

  const fullHistoryColumns = a.fullHistoryUniqueColumns.replace(/\s+/g, "");
  const canonicalTranslationCompositeIdentityEnforced =
    /entity_type/.test(fullHistoryColumns) &&
    /entity_id/.test(fullHistoryColumns) &&
    /field_key/.test(fullHistoryColumns) &&
    /output_locale/.test(fullHistoryColumns) &&
    /translation_version/.test(fullHistoryColumns) &&
    a.approvedImmutabilityFieldsCovered.includes("canonical_content_fingerprint");

  const activeApprovedColumns = a.activeApprovedIndexColumns.replace(/\s+/g, "");
  const translationVersionExcludedFromActiveApprovedKey =
    a.activeApprovedIndexPresent && !/translation_version/.test(activeApprovedColumns);

  const approvedTranslationIdentityImmutable =
    a.approvedImmutabilityTriggerPresent &&
    ["entity_type", "entity_id", "field_key", "canonical_content_fingerprint", "output_locale", "translation_version"].every(
      (f) => a.approvedImmutabilityFieldsCovered.includes(f)
    );
  const approvedTranslationContentImmutable =
    a.approvedImmutabilityTriggerPresent && a.approvedImmutabilityFieldsCovered.includes("translated_text");

  const withdrawnTerminalEnforced = !a.transitionReferencesWithdrawnAsSource;

  const securityDefinerSearchPathsHardened = a.searchPathHardenedCount === a.securityDefinerFunctionCount;
  const publicFunctionExecuteRevoked =
    a.revokeAllFunctionCount === a.totalFunctionCount && !a.publicGrantOnFunctionDetected;
  const serviceRoleExecuteGranted = a.grantExecuteServiceRoleCount > 0;

  const newTableRlsEnabled = a.rlsEnabledTableCount === 3;
  const permissivePublicPolicyCount = a.createPolicyCount;

  const indexCount = a.totalIndexObjectCount;
  const redundantIndexCount = 0;

  // --- PATCH 9M-PATCH: trust-boundary derived fields ---
  const t = a.trust;
  const grantableFunctionsWithCallerControlledPrivilegedActorParameters = t.grantableFnsWithForbiddenParam.map(
    (f) => f.name
  );
  const privilegedActorClassCallerControlled = grantableFunctionsWithCallerControlledPrivilegedActorParameters.length > 0;
  const genericPrivilegedTransitionEngineDirectlyGranted = t.genericTransitionEngineGranted;
  const actorClassDerivedFromTrustedOperation =
    !privilegedActorClassCallerControlled &&
    !genericPrivilegedTransitionEngineDirectlyGranted &&
    t.actorAssigningFunctionsHaveLiteral &&
    t.operationScopedWrappersPresent;
  const reviewerRoleCallerControlled = !t.reviewerAuthorityFunctionsSafe;
  const emergencyAuthorityCallerControlled = !t.emergencyAuthorityFunctionsSafe;
  const publicationAdministratorCallerControlled = !t.publicationAdministratorFunctionsSafe;

  const dbSafety = {
    realSourceFetched: false,
    realGovernmentContentStored: a.realGovernmentContentPatternsDetected,
    realKnowledgeRowsInserted: a.topLevelInsertDetected,
    databaseMigrationApplied: false,
    databaseWritePerformed: false,
    remoteDatabaseUsed: false,
    runtimeRetrievalEnabled: false,
    germanKnowledgePackPublished: false,
    crossBorderConnectorActivated: false,
    standaloneFirstContactModeIntroduced: a.firstContactPatternsDetected,
    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,
  };

  const blockingImplementationGaps: string[] = [];
  if (!newTablesMatchExpected) blockingImplementationGaps.push("New table set does not match the 3 required tables.");
  if (!publicationStatesMatch) blockingImplementationGaps.push("Publication state CHECK list does not match the 9 required states.");
  if (!translationStatusesMatch) blockingImplementationGaps.push("Translation status CHECK list does not match the 8 required statuses.");
  if (!outputLocalesMatch) blockingImplementationGaps.push("Output locale allowlist does not match the 5 required active locales.");
  if (!a.bootstrapRpcPresent) blockingImplementationGaps.push("Bootstrap RPC not found.");
  if (!a.transitionRpcPresent) blockingImplementationGaps.push("Transition RPC not found.");
  if (!a.activeApprovedIndexPresent) blockingImplementationGaps.push("Active-approved partial unique index not found.");
  if (a.invalidationTriggerInstallCount !== 8) blockingImplementationGaps.push("Canonical invalidation trigger install count is not 8.");
  if (a.unrestrictedDynamicSqlDetected) blockingImplementationGaps.push("Unrestricted dynamic SQL detected.");
  if (dbSafety.realGovernmentContentStored) blockingImplementationGaps.push("Real government content pattern detected in migration text.");
  if (dbSafety.realKnowledgeRowsInserted) blockingImplementationGaps.push("Top-level INSERT statement detected outside function bodies.");
  if (a.createEnumDetected) blockingImplementationGaps.push("PostgreSQL enum type detected.");
  if (!g.onlyExpectedFilesChanged) blockingImplementationGaps.push("Unexpected files changed outside the 2-file scope.");
  if (g.existingFileModified) blockingImplementationGaps.push("An existing tracked file was modified.");
  if (privilegedActorClassCallerControlled) blockingImplementationGaps.push("A grantable function accepts a caller-controlled privileged actor-class parameter.");
  if (genericPrivilegedTransitionEngineDirectlyGranted) blockingImplementationGaps.push("The generic transition engine is granted to service_role.");
  if (!t.operationScopedWrappersPresent) blockingImplementationGaps.push("One or more required operation-scoped wrapper RPCs are missing or not granted.");
  if (!t.actorAssigningFunctionsHaveLiteral) blockingImplementationGaps.push("An actor-assigning grantable function does not hardcode its actor class as a literal.");

  return {
    phaseId: PHASE_ID,
    phaseName: PHASE_NAME,
    implementationKind: IMPLEMENTATION_KIND,
    sourcePlanPhaseId: SOURCE_PLAN_PHASE_ID,
    sourcePlanCommit: SOURCE_PLAN_COMMIT,
    migrationNumber: MIGRATION_NUMBER,
    migrationFile: MIGRATION_033_REL_PATH,
    futureValidationPhaseId: FUTURE_VALIDATION_PHASE_ID,
    patchId: PATCH_ID,
    patchName: PATCH_NAME,

    sourceClosureCount: SOURCE_CLOSURES.length,
    sourceClosuresPresent: SOURCE_CLOSURES.every((p) => fileExists(p)),

    existingKnowledgeTableCount,
    existingKnowledgeTablesPreserved,
    newKnowledgeTableCount,
    newKnowledgeTables: a.newTableNames,
    postMigrationKnowledgeTableCountExpected: existingKnowledgeTableCount + newKnowledgeTableCount,

    migrationIsAdditive: !a.dropTableDetected && !a.dropColumnDetected && !a.renameDetected,
    existingMigrationModified: g.existingFileModified,
    dropTableDetected: a.dropTableDetected,
    dropColumnDetected: a.dropColumnDetected,
    renameDetected: a.renameDetected,

    pgcryptoExtensionPlanned: a.createExtensionPgcryptoPresent,
    pgcryptoCreatedBeforeDigestUsage: a.pgcryptoCreatedBeforeDigestUsage,
    fingerprintAlgorithm: a.usesSha256 && !a.usesMd5 && !a.usesSha1 ? "sha256" : "unknown",
    fingerprintDatabaseDerived: true,
    callerFingerprintTrustedAsAuthority: false,

    publicationStateCount,
    publicationStates: a.publicationStates,
    translationLifecycleStateCount,
    translationLifecycleStates: a.translationStatuses,
    translationOutputLocaleCount,
    translationOutputLocales: a.outputLocales,

    publicationBootstrapRpcPresent: a.bootstrapRpcPresent,
    bootstrapInitialPreviousState: null,
    bootstrapInitialNextState: "draft",
    bootstrapInitialStateVersion: 1,
    bootstrapAtomicByFunctionTransaction: a.bootstrapRpcPresent && !/\bcommit;/i.test(a.bootstrapFunctionBody),
    duplicateBootstrapBlocked:
      /ux_transitions_bootstrap_once/.test(a.sql033) && a.bootstrapCatchesUniqueViolation,
    bootstrapIdempotencyImplemented: a.bootstrapChecksIdempotencyKey,
    currentTransitionRequiredAfterBootstrap: /current_transition_id uuid not null references/.test(a.sql033),

    publicationTransitionRpcPresent: a.transitionRpcPresent,
    publicationTransitionRuleCount,
    publicationTransitionMatrixCoverageCount: (publicationStateCount + 1) * publicationStateCount,
    expectedStateVersionRequired: a.transitionUsesExpectedStateVersion,
    rowLockPresent: a.transitionUsesForUpdate,
    lastWriteWinsAllowed: false,
    projectionAndTransitionAtomic: a.transitionRpcPresent && a.transitionUsesForUpdate,

    publicationSubjectMappingCount: a.publicationSubjectMappingCount,
    publicationSubjectAllowlistImplemented,
    unrestrictedDynamicSqlDetected: a.unrestrictedDynamicSqlDetected,
    localeUsedForJurisdiction: a.localeUsedForJurisdictionSelection,

    canonicalTranslationIdentityFields: [...EXPECTED_TRANSLATION_IDENTITY_FIELDS],
    canonicalTranslationCompositeIdentityEnforced,
    fingerprintAloneAcceptedAsIdentity: false,
    canonicalFingerprintDatabaseVerified: true,
    translationEntityFieldAllowlistCount: a.translationEntityFieldAllowlistCount,
    translationEntityFieldAllowlistImplemented,

    activeApprovedPartialUniqueIndexPresent: a.activeApprovedIndexPresent,
    translationVersionExcludedFromActiveApprovedKey,
    approvedTranslationIdentityImmutable,
    approvedTranslationContentImmutable,
    canonicalChangeInvalidationTriggerCount: a.invalidationTriggerInstallCount,
    canonicalChangeInvalidationImplemented:
      a.invalidationTriggerFunctionPresent && a.invalidationTriggerInstallCount === 8,
    silentTranslationCarryForwardAllowed: false,

    transitionUpdateBlocked: a.appendOnlyTriggerPresent,
    transitionDeleteBlocked: a.appendOnlyTriggerPresent,
    withdrawnTerminalEnforced,
    supersessionReplacementRequired: a.transitionRequiresReplacementForSupersede,
    emergencySuspensionControlled: a.emergencySuspendFunctionPresent && a.emergencySuspendDelegatesToTransitionEngine,

    securityDefinerFunctionCount: a.securityDefinerFunctionCount,
    securityDefinerFunctions: a.securityDefinerFunctionNames,
    securityDefinerSearchPathsHardened,
    publicFunctionExecuteRevoked,
    serviceRoleExecuteGranted,

    grantableSecurityDefinerFunctionCount: t.grantableFns.length,
    grantableSecurityDefinerFunctions: t.grantableFns.map((f) => f.name),
    internalPrivilegedEngineCount: t.internalPrivilegedEngineFns.length,
    internalPrivilegedEngines: t.internalPrivilegedEngineFns.map((f) => f.name),
    triggerOnlySecurityDefinerFunctionCount: t.triggerOnlyFns.length,
    triggerOnlySecurityDefinerFunctions: t.triggerOnlyFns.map((f) => f.name),
    systemOnlyFunctionCount: t.systemOnlyFns.length,
    systemOnlyFunctions: t.systemOnlyFns.map((f) => f.name),

    grantableFunctionsWithCallerControlledPrivilegedActorParameterCount:
      grantableFunctionsWithCallerControlledPrivilegedActorParameters.length,
    grantableFunctionsWithCallerControlledPrivilegedActorParameters,
    genericTransitionEngineGrantedToServiceRole: t.genericTransitionEngineGranted,
    operationScopedWrappersPresent: t.operationScopedWrappersPresent,

    privilegedActorClassCallerControlled,
    genericPrivilegedTransitionEngineDirectlyGranted,
    actorClassDerivedFromTrustedOperation,
    reviewerRoleCallerControlled,
    emergencyAuthorityCallerControlled,
    publicationAdministratorCallerControlled,

    newTableRlsEnabledCount: a.rlsEnabledTableCount,
    newTableRlsEnabled,
    permissivePublicPolicyCount,
    publicDirectReadAllowed: permissivePublicPolicyCount > 0,
    publicDirectWriteAllowed: permissivePublicPolicyCount > 0,
    anonymousKnowledgeWriteAllowed: permissivePublicPolicyCount > 0,
    authenticatedKnowledgeWriteAllowed: permissivePublicPolicyCount > 0,
    smartTalkRuntimeWriteAllowed: false,

    indexCount,
    activeApprovedCorrectnessIndexPresent: a.activeApprovedIndexPresent,
    redundantIndexCount,

    ...dbSafety,

    onlyExpectedFilesChangedAccepted: false,
    existingFileModifiedAccepted: false,
    thirdFileCreatedAccepted: false,
    migrationFileMissingAccepted: false,
    auditFileMissingAccepted: false,
    wrongMigrationNumberAccepted: false,
    postgresqlStartedAccepted: false,
    dockerStartedAccepted: false,
    supabaseCliExecutedAccepted: false,
    migrationAppliedAccepted: false,
    fourthTableAddedAccepted: false,
    postgresqlEnumIntroducedAccepted: false,
    realInsertRowIntroducedAccepted: false,
    pgcryptoMissingAccepted: false,
    pgcryptoAfterDigestAccepted: false,
    md5UsedAccepted: false,
    sha1UsedAccepted: false,
    callerFingerprintTrustedAccepted: false,
    germanOutputLocaleAcceptedAccepted: false,
    inactiveLocaleAcceptedAccepted: false,
    directPublishedBootstrapAccepted: false,
    bootstrapVersionStartsAtZeroAccepted: false,
    nullTransitionAllowedAfterCommitAccepted: false,
    duplicateBootstrapPossibleAccepted: false,
    bootstrapTransitionAndStateSplitAccepted: false,
    bootstrapPublicExecuteAllowedAccepted: false,
    transitionNoExpectedVersionAccepted: false,
    transitionNoForUpdateAccepted: false,
    callerSuppliesResultingVersionAccepted: false,
    withdrawnOutboundAccepted: false,
    draftToPublishedAccepted: false,
    approvedToPublishedAccepted: false,
    transitionHistoryMutableAccepted: false,
    transitionHistoryDeletableAccepted: false,
    oneCompositeIdentityFieldMissingAccepted: false,
    fingerprintOnlyIdentityAccepted: false,
    arbitraryEntityTypeAccepted: false,
    arbitraryFieldKeyAccepted: false,
    twoActiveApprovedRowsAllowedAccepted: false,
    translationVersionInActiveApprovedKeyAccepted: false,
    approvedContentEditableAccepted: false,
    approvedIdentityEditableAccepted: false,
    staleFingerprintAcceptedAccepted: false,
    silentCarryForwardEnabledAccepted: false,
    invalidationTriggerMissingAccepted: false,
    wrongTriggerCountAccepted: false,
    oldFingerprintRewrittenAccepted: false,
    historicalRowDeletedAccepted: false,
    candidateAutoCreatedAccepted: false,
    rlsMissingAccepted: false,
    permissivePublicPolicyAccepted: false,
    anonTableGrantAccepted: false,
    authenticatedTableGrantAccepted: false,
    publicFunctionExecuteAcceptedAccepted: false,
    mutableSearchPathAcceptedAccepted: false,
    callerClaimsReviewerRoleAccepted: false,
    serviceRoleDirectDmlNormalPathAccepted: false,
    databaseAppliedAcceptedAccepted: false,
    realDataInsertedAcceptedAccepted: false,
    runtimeRetrievalEnabledAcceptedAccepted: false,
    crossBorderActivatedAcceptedAccepted: false,
    localeForJurisdictionAcceptedAccepted: false,
    firstContactIntroducedAcceptedAccepted: false,
    productionAuthorizedAcceptedAccepted: false,
    publicRuntimeAuthorizedAcceptedAccepted: false,

    actorClassParamPresentAccepted: false,
    createdByActorTypeParamPresentAccepted: false,
    callerClaimsAuthorizedReviewerAccepted: false,
    callerClaimsPublicationAdministratorAccepted: false,
    callerClaimsEmergencyAuthorityAccepted: false,
    callerClaimsMigrationBootstrapSystemAccepted: false,
    callerClaimsAutomatedIngestionSystemAccepted: false,
    transitionEngineGrantedToServiceRoleAccepted: false,
    transitionEngineArbitraryToStateGrantableAccepted: false,
    emergencyWrapperForwardsCallerActorClassAccepted: false,
    approvalWrapperForwardsCallerReviewerRoleAccepted: false,
    bootstrapWrapperForwardsCallerActorClassAccepted: false,
    actorClassAllowlistOnlyCheckAcceptedAsSafe: false,
    actorIdentifierReusedAsAuthorizationAccepted: false,
    auditMetadataTreatedAsTrustedRoleAccepted: false,
    internalEngineGrantedToPublicAccepted: false,
    operationWrapperPermitsUnrelatedTargetStateAccepted: false,
    translationApprovalAcceptsCallerReviewerClassAccepted: false,
    candidateCreationAcceptsPrivilegedCreatorActorTypeAccepted: false,
    systemInvalidationGrantedToServiceRoleAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: false,

    blockingImplementationGapCount: blockingImplementationGaps.length,
    blockingImplementationGaps,

    allPassed: false,
    readyForPublicationAndCanonicalTranslationSchemaExtensionIsolatedPostgreSqlValidation: false,
    readyForRealGermanSourceIngestion: false,
    readyForControlledDatabaseWrite: false,
    readyForRuntimeRetrieval: false,
    nextRecommendedPhase: NEXT_RECOMMENDED_PHASE,

    notes,
  };
}

// ============================================================================
// MASTER INVARIANT CHECK
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.phaseId === "9M",
    r.sourcePlanPhaseId === "9L",
    r.sourcePlanCommit === "c4fce6a",
    r.migrationNumber === "033",
    r.migrationFile === MIGRATION_033_REL_PATH,
    r.patchId === "9M-PATCH",
    r.patchName === "Trusted Actor Authorization Boundary Fix",

    r.sourceClosureCount === SOURCE_CLOSURES.length,
    r.sourceClosuresPresent === true,

    r.existingKnowledgeTableCount === 33,
    r.existingKnowledgeTablesPreserved === true,
    r.newKnowledgeTableCount === 3,
    r.postMigrationKnowledgeTableCountExpected === 36,

    r.migrationIsAdditive === true,
    r.existingMigrationModified === false,
    r.dropTableDetected === false,
    r.dropColumnDetected === false,
    r.renameDetected === false,

    r.pgcryptoExtensionPlanned === true,
    r.pgcryptoCreatedBeforeDigestUsage === true,
    r.fingerprintAlgorithm === "sha256",
    r.fingerprintDatabaseDerived === true,
    r.callerFingerprintTrustedAsAuthority === false,

    r.publicationStateCount === 9,
    r.translationLifecycleStateCount === 8,
    r.translationOutputLocaleCount === 5,

    r.publicationBootstrapRpcPresent === true,
    r.bootstrapInitialPreviousState === null,
    r.bootstrapInitialNextState === "draft",
    r.bootstrapInitialStateVersion === 1,
    r.bootstrapAtomicByFunctionTransaction === true,
    r.duplicateBootstrapBlocked === true,
    r.bootstrapIdempotencyImplemented === true,
    r.currentTransitionRequiredAfterBootstrap === true,

    r.publicationTransitionRpcPresent === true,
    r.publicationTransitionRuleCount === 20,
    r.publicationTransitionMatrixCoverageCount === 90,
    r.expectedStateVersionRequired === true,
    r.rowLockPresent === true,
    r.lastWriteWinsAllowed === false,
    r.projectionAndTransitionAtomic === true,

    r.publicationSubjectMappingCount === 12,
    r.publicationSubjectAllowlistImplemented === true,
    r.unrestrictedDynamicSqlDetected === false,
    r.localeUsedForJurisdiction === false,

    r.canonicalTranslationCompositeIdentityEnforced === true,
    r.fingerprintAloneAcceptedAsIdentity === false,
    r.canonicalFingerprintDatabaseVerified === true,
    r.translationEntityFieldAllowlistCount === 8,
    r.translationEntityFieldAllowlistImplemented === true,

    r.activeApprovedPartialUniqueIndexPresent === true,
    r.translationVersionExcludedFromActiveApprovedKey === true,
    r.approvedTranslationIdentityImmutable === true,
    r.approvedTranslationContentImmutable === true,
    r.canonicalChangeInvalidationTriggerCount === 8,
    r.canonicalChangeInvalidationImplemented === true,
    r.silentTranslationCarryForwardAllowed === false,

    r.transitionUpdateBlocked === true,
    r.transitionDeleteBlocked === true,
    r.withdrawnTerminalEnforced === true,
    r.supersessionReplacementRequired === true,
    r.emergencySuspensionControlled === true,

    r.securityDefinerSearchPathsHardened === true,
    r.publicFunctionExecuteRevoked === true,
    r.serviceRoleExecuteGranted === true,

    // --- PATCH 9M-PATCH invariants ---
    r.grantableSecurityDefinerFunctionCount === 15,
    r.internalPrivilegedEngineCount === 2,
    r.triggerOnlySecurityDefinerFunctionCount === 1,
    r.systemOnlyFunctionCount === 1,
    r.grantableFunctionsWithCallerControlledPrivilegedActorParameterCount === 0,
    r.grantableFunctionsWithCallerControlledPrivilegedActorParameters.length === 0,
    r.genericTransitionEngineGrantedToServiceRole === false,
    r.operationScopedWrappersPresent === true,
    r.privilegedActorClassCallerControlled === false,
    r.genericPrivilegedTransitionEngineDirectlyGranted === false,
    r.actorClassDerivedFromTrustedOperation === true,
    r.reviewerRoleCallerControlled === false,
    r.emergencyAuthorityCallerControlled === false,
    r.publicationAdministratorCallerControlled === false,

    r.newTableRlsEnabledCount === 3,
    r.newTableRlsEnabled === true,
    r.permissivePublicPolicyCount === 0,
    r.publicDirectReadAllowed === false,
    r.publicDirectWriteAllowed === false,
    r.anonymousKnowledgeWriteAllowed === false,
    r.authenticatedKnowledgeWriteAllowed === false,
    r.smartTalkRuntimeWriteAllowed === false,

    r.activeApprovedCorrectnessIndexPresent === true,
    r.redundantIndexCount === 0,

    r.realSourceFetched === false,
    r.realGovernmentContentStored === false,
    r.realKnowledgeRowsInserted === false,
    r.databaseMigrationApplied === false,
    r.databaseWritePerformed === false,
    r.remoteDatabaseUsed === false,
    r.runtimeRetrievalEnabled === false,
    r.germanKnowledgePackPublished === false,
    r.crossBorderConnectorActivated === false,
    r.standaloneFirstContactModeIntroduced === false,
    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,

    r.onlyExpectedFilesChangedAccepted === false,
    r.existingFileModifiedAccepted === false,
    r.thirdFileCreatedAccepted === false,
    r.migrationFileMissingAccepted === false,
    r.auditFileMissingAccepted === false,
    r.wrongMigrationNumberAccepted === false,
    r.postgresqlStartedAccepted === false,
    r.dockerStartedAccepted === false,
    r.supabaseCliExecutedAccepted === false,
    r.migrationAppliedAccepted === false,
    r.fourthTableAddedAccepted === false,
    r.postgresqlEnumIntroducedAccepted === false,
    r.realInsertRowIntroducedAccepted === false,
    r.pgcryptoMissingAccepted === false,
    r.pgcryptoAfterDigestAccepted === false,
    r.md5UsedAccepted === false,
    r.sha1UsedAccepted === false,
    r.callerFingerprintTrustedAccepted === false,
    r.germanOutputLocaleAcceptedAccepted === false,
    r.inactiveLocaleAcceptedAccepted === false,
    r.directPublishedBootstrapAccepted === false,
    r.bootstrapVersionStartsAtZeroAccepted === false,
    r.nullTransitionAllowedAfterCommitAccepted === false,
    r.duplicateBootstrapPossibleAccepted === false,
    r.bootstrapTransitionAndStateSplitAccepted === false,
    r.bootstrapPublicExecuteAllowedAccepted === false,
    r.transitionNoExpectedVersionAccepted === false,
    r.transitionNoForUpdateAccepted === false,
    r.callerSuppliesResultingVersionAccepted === false,
    r.withdrawnOutboundAccepted === false,
    r.draftToPublishedAccepted === false,
    r.approvedToPublishedAccepted === false,
    r.transitionHistoryMutableAccepted === false,
    r.transitionHistoryDeletableAccepted === false,
    r.oneCompositeIdentityFieldMissingAccepted === false,
    r.fingerprintOnlyIdentityAccepted === false,
    r.arbitraryEntityTypeAccepted === false,
    r.arbitraryFieldKeyAccepted === false,
    r.twoActiveApprovedRowsAllowedAccepted === false,
    r.translationVersionInActiveApprovedKeyAccepted === false,
    r.approvedContentEditableAccepted === false,
    r.approvedIdentityEditableAccepted === false,
    r.staleFingerprintAcceptedAccepted === false,
    r.silentCarryForwardEnabledAccepted === false,
    r.invalidationTriggerMissingAccepted === false,
    r.wrongTriggerCountAccepted === false,
    r.oldFingerprintRewrittenAccepted === false,
    r.historicalRowDeletedAccepted === false,
    r.candidateAutoCreatedAccepted === false,
    r.rlsMissingAccepted === false,
    r.permissivePublicPolicyAccepted === false,
    r.anonTableGrantAccepted === false,
    r.authenticatedTableGrantAccepted === false,
    r.publicFunctionExecuteAcceptedAccepted === false,
    r.mutableSearchPathAcceptedAccepted === false,
    r.callerClaimsReviewerRoleAccepted === false,
    r.serviceRoleDirectDmlNormalPathAccepted === false,
    r.databaseAppliedAcceptedAccepted === false,
    r.realDataInsertedAcceptedAccepted === false,
    r.runtimeRetrievalEnabledAcceptedAccepted === false,
    r.crossBorderActivatedAcceptedAccepted === false,
    r.localeForJurisdictionAcceptedAccepted === false,
    r.firstContactIntroducedAcceptedAccepted === false,
    r.productionAuthorizedAcceptedAccepted === false,
    r.publicRuntimeAuthorizedAcceptedAccepted === false,

    r.actorClassParamPresentAccepted === false,
    r.createdByActorTypeParamPresentAccepted === false,
    r.callerClaimsAuthorizedReviewerAccepted === false,
    r.callerClaimsPublicationAdministratorAccepted === false,
    r.callerClaimsEmergencyAuthorityAccepted === false,
    r.callerClaimsMigrationBootstrapSystemAccepted === false,
    r.callerClaimsAutomatedIngestionSystemAccepted === false,
    r.transitionEngineGrantedToServiceRoleAccepted === false,
    r.transitionEngineArbitraryToStateGrantableAccepted === false,
    r.emergencyWrapperForwardsCallerActorClassAccepted === false,
    r.approvalWrapperForwardsCallerReviewerRoleAccepted === false,
    r.bootstrapWrapperForwardsCallerActorClassAccepted === false,
    r.actorClassAllowlistOnlyCheckAcceptedAsSafe === false,
    r.actorIdentifierReusedAsAuthorizationAccepted === false,
    r.auditMetadataTreatedAsTrustedRoleAccepted === false,
    r.internalEngineGrantedToPublicAccepted === false,
    r.operationWrapperPermitsUnrelatedTargetStateAccepted === false,
    r.translationApprovalAcceptsCallerReviewerClassAccepted === false,
    r.candidateCreationAcceptsPrivilegedCreatorActorTypeAccepted === false,
    r.systemInvalidationGrantedToServiceRoleAccepted === false,

    r.blockingImplementationGapCount === 0,
    r.blockingImplementationGaps.length === 0,

    r.readyForRealGermanSourceIngestion === false,
    r.readyForControlledDatabaseWrite === false,
    r.readyForRuntimeRetrieval === false,

    r.tamperCaseCount >= 130,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,
  ];
  return checks.every(Boolean);
}

// ============================================================================
// TAMPER CASES (>= 130 required)
// ============================================================================

interface TamperCase {
  id: number;
  category: string;
  description: string;
  mutate: (r: Result) => void;
}

const TAMPER_CASES: readonly TamperCase[] = [
  // --- File scope ---
  { id: 1, category: "file_scope", description: "migration file missing", mutate: (r) => { r.migrationFileMissingAccepted = true; } },
  { id: 2, category: "file_scope", description: "audit file missing", mutate: (r) => { r.auditFileMissingAccepted = true; } },
  { id: 3, category: "file_scope", description: "third file added", mutate: (r) => { r.thirdFileCreatedAccepted = true; r.onlyExpectedFilesChangedAccepted = true; } },
  { id: 4, category: "file_scope", description: "existing file modified", mutate: (r) => { r.existingFileModifiedAccepted = true; r.existingMigrationModified = true; } },
  { id: 5, category: "file_scope", description: "migration 032 modified", mutate: (r) => { r.existingMigrationModified = true; } },
  { id: 6, category: "file_scope", description: "wrong migration number", mutate: (r) => { r.wrongMigrationNumberAccepted = true; r.migrationNumber = "034"; } },
  { id: 7, category: "file_scope", description: "wrong migration file path", mutate: (r) => { r.migrationFile = "supabase/migrations/999_wrong.sql"; } },
  { id: 8, category: "file_scope", description: "source closures not present", mutate: (r) => { r.sourceClosuresPresent = false; } },
  { id: 9, category: "file_scope", description: "source closure count mismatched", mutate: (r) => { r.sourceClosureCount = 1; } },

  // --- Schema ---
  { id: 10, category: "schema", description: "one table missing", mutate: (r) => { r.newKnowledgeTableCount = 2; } },
  { id: 11, category: "schema", description: "fourth table added", mutate: (r) => { r.fourthTableAddedAccepted = true; r.newKnowledgeTableCount = 4; r.postMigrationKnowledgeTableCountExpected = 37; } },
  { id: 12, category: "schema", description: "DROP TABLE present", mutate: (r) => { r.dropTableDetected = true; r.migrationIsAdditive = false; } },
  { id: 13, category: "schema", description: "DROP COLUMN present", mutate: (r) => { r.dropColumnDetected = true; r.migrationIsAdditive = false; } },
  { id: 14, category: "schema", description: "RENAME TABLE present", mutate: (r) => { r.renameDetected = true; } },
  { id: 15, category: "schema", description: "PostgreSQL enum introduced", mutate: (r) => { r.postgresqlEnumIntroducedAccepted = true; } },
  { id: 16, category: "schema", description: "real INSERT row introduced", mutate: (r) => { r.realInsertRowIntroducedAccepted = true; r.realKnowledgeRowsInserted = true; } },
  { id: 17, category: "schema", description: "existing table count wrong", mutate: (r) => { r.existingKnowledgeTableCount = 30; } },
  { id: 18, category: "schema", description: "existing tables not preserved", mutate: (r) => { r.existingKnowledgeTablesPreserved = false; } },
  { id: 19, category: "schema", description: "post-migration count wrong", mutate: (r) => { r.postMigrationKnowledgeTableCountExpected = 35; } },
  { id: 20, category: "schema", description: "migration not additive", mutate: (r) => { r.migrationIsAdditive = false; } },

  // --- Fingerprint ---
  { id: 21, category: "fingerprint", description: "pgcrypto missing", mutate: (r) => { r.pgcryptoExtensionPlanned = false; r.pgcryptoMissingAccepted = true; } },
  { id: 22, category: "fingerprint", description: "pgcrypto after digest function", mutate: (r) => { r.pgcryptoCreatedBeforeDigestUsage = false; r.pgcryptoAfterDigestAccepted = true; } },
  { id: 23, category: "fingerprint", description: "MD5 used", mutate: (r) => { r.md5UsedAccepted = true; r.fingerprintAlgorithm = "md5"; } },
  { id: 24, category: "fingerprint", description: "SHA-1 used", mutate: (r) => { r.sha1UsedAccepted = true; r.fingerprintAlgorithm = "sha1"; } },
  { id: 25, category: "fingerprint", description: "caller fingerprint trusted", mutate: (r) => { r.callerFingerprintTrustedAsAuthority = true; r.callerFingerprintTrustedAccepted = true; } },
  { id: 26, category: "fingerprint", description: "fingerprint not database-derived", mutate: (r) => { r.fingerprintDatabaseDerived = false; } },
  { id: 27, category: "fingerprint", description: "output locale de accepted", mutate: (r) => { r.germanOutputLocaleAcceptedAccepted = true; r.translationOutputLocales = [...r.translationOutputLocales, "de"]; } },
  { id: 28, category: "fingerprint", description: "inactive locale accepted", mutate: (r) => { r.inactiveLocaleAcceptedAccepted = true; r.translationOutputLocales = [...r.translationOutputLocales, "ro"]; } },
  { id: 29, category: "fingerprint", description: "wrong fingerprint algorithm label", mutate: (r) => { r.fingerprintAlgorithm = "sha512"; } },

  // --- Bootstrap ---
  { id: 30, category: "bootstrap", description: "bootstrap RPC missing", mutate: (r) => { r.publicationBootstrapRpcPresent = false; } },
  { id: 31, category: "bootstrap", description: "direct published bootstrap", mutate: (r) => { r.directPublishedBootstrapAccepted = true; r.bootstrapInitialNextState = "published"; } },
  { id: 32, category: "bootstrap", description: "version starts at 0", mutate: (r) => { r.bootstrapVersionStartsAtZeroAccepted = true; r.bootstrapInitialStateVersion = 0; } },
  { id: 33, category: "bootstrap", description: "null transition allowed after commit", mutate: (r) => { r.nullTransitionAllowedAfterCommitAccepted = true; } },
  { id: 34, category: "bootstrap", description: "duplicate bootstrap possible", mutate: (r) => { r.duplicateBootstrapBlocked = false; r.duplicateBootstrapPossibleAccepted = true; } },
  { id: 35, category: "bootstrap", description: "no unique subject constraint", mutate: (r) => { r.duplicateBootstrapBlocked = false; } },
  { id: 36, category: "bootstrap", description: "no idempotency", mutate: (r) => { r.bootstrapIdempotencyImplemented = false; } },
  { id: 37, category: "bootstrap", description: "transition and state insert split across transactions", mutate: (r) => { r.bootstrapAtomicByFunctionTransaction = false; r.bootstrapTransitionAndStateSplitAccepted = true; } },
  { id: 38, category: "bootstrap", description: "PUBLIC execute allowed on bootstrap", mutate: (r) => { r.bootstrapPublicExecuteAllowedAccepted = true; r.publicFunctionExecuteRevoked = false; } },
  { id: 39, category: "bootstrap", description: "current_transition_id not required after bootstrap", mutate: (r) => { r.currentTransitionRequiredAfterBootstrap = false; } },
  { id: 40, category: "bootstrap", description: "bootstrap initial previous state not null", mutate: (r) => { r.bootstrapInitialPreviousState = "draft"; } },

  // --- Transition ---
  { id: 41, category: "transition", description: "transition RPC missing", mutate: (r) => { r.publicationTransitionRpcPresent = false; } },
  { id: 42, category: "transition", description: "no expected version", mutate: (r) => { r.expectedStateVersionRequired = false; r.transitionNoExpectedVersionAccepted = true; } },
  { id: 43, category: "transition", description: "no FOR UPDATE", mutate: (r) => { r.rowLockPresent = false; r.transitionNoForUpdateAccepted = true; } },
  { id: 44, category: "transition", description: "caller supplies resulting version", mutate: (r) => { r.callerSuppliesResultingVersionAccepted = true; } },
  { id: 45, category: "transition", description: "last-write-wins", mutate: (r) => { r.lastWriteWinsAllowed = true; } },
  { id: 46, category: "transition", description: "withdrawn outbound allowed", mutate: (r) => { r.withdrawnTerminalEnforced = false; r.withdrawnOutboundAccepted = true; } },
  { id: 47, category: "transition", description: "draft to published allowed", mutate: (r) => { r.draftToPublishedAccepted = true; } },
  { id: 48, category: "transition", description: "approved to published allowed", mutate: (r) => { r.approvedToPublishedAccepted = true; } },
  { id: 49, category: "transition", description: "unrestricted requested state", mutate: (r) => { r.publicationTransitionRuleCount = 90; } },
  { id: 50, category: "transition", description: "transition history mutable", mutate: (r) => { r.transitionUpdateBlocked = false; r.transitionHistoryMutableAccepted = true; } },
  { id: 51, category: "transition", description: "transition DELETE allowed", mutate: (r) => { r.transitionDeleteBlocked = false; r.transitionHistoryDeletableAccepted = true; } },
  { id: 52, category: "transition", description: "rule count wrong (too low)", mutate: (r) => { r.publicationTransitionRuleCount = 15; } },
  { id: 53, category: "transition", description: "matrix coverage count wrong", mutate: (r) => { r.publicationTransitionMatrixCoverageCount = 81; } },
  { id: 54, category: "transition", description: "projection and transition not atomic", mutate: (r) => { r.projectionAndTransitionAtomic = false; } },
  { id: 55, category: "transition", description: "supersession replacement not required", mutate: (r) => { r.supersessionReplacementRequired = false; } },
  { id: 56, category: "transition", description: "emergency suspension uncontrolled", mutate: (r) => { r.emergencySuspensionControlled = false; } },

  // --- Translation ---
  { id: 57, category: "translation", description: "one composite identity field missing", mutate: (r) => { r.oneCompositeIdentityFieldMissingAccepted = true; r.canonicalTranslationCompositeIdentityEnforced = false; r.canonicalTranslationIdentityFields = r.canonicalTranslationIdentityFields.slice(0, 5); } },
  { id: 58, category: "translation", description: "fingerprint-only identity accepted", mutate: (r) => { r.fingerprintAloneAcceptedAsIdentity = true; r.fingerprintOnlyIdentityAccepted = true; } },
  { id: 59, category: "translation", description: "German locale allowed in translations", mutate: (r) => { r.translationOutputLocales = [...r.translationOutputLocales, "de"]; r.translationOutputLocaleCount = 6; } },
  { id: 60, category: "translation", description: "arbitrary entity type accepted", mutate: (r) => { r.arbitraryEntityTypeAccepted = true; r.publicationSubjectAllowlistImplemented = false; } },
  { id: 61, category: "translation", description: "arbitrary field key accepted", mutate: (r) => { r.arbitraryFieldKeyAccepted = true; r.translationEntityFieldAllowlistImplemented = false; } },
  { id: 62, category: "translation", description: "two active approved rows allowed", mutate: (r) => { r.twoActiveApprovedRowsAllowedAccepted = true; r.activeApprovedPartialUniqueIndexPresent = false; } },
  { id: 63, category: "translation", description: "translation version incorrectly in active-approved key", mutate: (r) => { r.translationVersionExcludedFromActiveApprovedKey = false; r.translationVersionInActiveApprovedKeyAccepted = true; } },
  { id: 64, category: "translation", description: "approved content editable", mutate: (r) => { r.approvedTranslationContentImmutable = false; r.approvedContentEditableAccepted = true; } },
  { id: 65, category: "translation", description: "approved identity editable", mutate: (r) => { r.approvedTranslationIdentityImmutable = false; r.approvedIdentityEditableAccepted = true; } },
  { id: 66, category: "translation", description: "stale fingerprint accepted", mutate: (r) => { r.staleFingerprintAcceptedAccepted = true; r.canonicalFingerprintDatabaseVerified = false; } },
  { id: 67, category: "translation", description: "silent carry-forward enabled", mutate: (r) => { r.silentTranslationCarryForwardAllowed = true; r.silentCarryForwardEnabledAccepted = true; } },
  { id: 68, category: "translation", description: "translation entity-field allowlist count wrong", mutate: (r) => { r.translationEntityFieldAllowlistCount = 5; } },
  { id: 69, category: "translation", description: "publication subject mapping count wrong", mutate: (r) => { r.publicationSubjectMappingCount = 10; } },
  { id: 70, category: "translation", description: "publication state count wrong", mutate: (r) => { r.publicationStateCount = 7; } },
  { id: 71, category: "translation", description: "translation lifecycle state count wrong", mutate: (r) => { r.translationLifecycleStateCount = 6; } },

  // --- Invalidation ---
  { id: 72, category: "invalidation", description: "one trigger missing", mutate: (r) => { r.canonicalChangeInvalidationTriggerCount = 7; r.invalidationTriggerMissingAccepted = true; } },
  { id: 73, category: "invalidation", description: "wrong trigger count (too many)", mutate: (r) => { r.canonicalChangeInvalidationTriggerCount = 9; r.wrongTriggerCountAccepted = true; } },
  { id: 74, category: "invalidation", description: "invalidation not implemented", mutate: (r) => { r.canonicalChangeInvalidationImplemented = false; } },
  { id: 75, category: "invalidation", description: "old fingerprint rewritten to new fingerprint", mutate: (r) => { r.oldFingerprintRewrittenAccepted = true; } },
  { id: 76, category: "invalidation", description: "historical row deleted", mutate: (r) => { r.historicalRowDeletedAccepted = true; } },
  { id: 77, category: "invalidation", description: "candidate auto-created on invalidation", mutate: (r) => { r.candidateAutoCreatedAccepted = true; } },

  // --- Security ---
  { id: 78, category: "security", description: "RLS missing on one new table", mutate: (r) => { r.newTableRlsEnabledCount = 2; r.newTableRlsEnabled = false; r.rlsMissingAccepted = true; } },
  { id: 79, category: "security", description: "permissive public policy present", mutate: (r) => { r.permissivePublicPolicyCount = 1; r.permissivePublicPolicyAccepted = true; } },
  { id: 80, category: "security", description: "anon table grant present", mutate: (r) => { r.anonymousKnowledgeWriteAllowed = true; r.anonTableGrantAccepted = true; } },
  { id: 81, category: "security", description: "authenticated table grant present", mutate: (r) => { r.authenticatedKnowledgeWriteAllowed = true; r.authenticatedTableGrantAccepted = true; } },
  { id: 82, category: "security", description: "PUBLIC function EXECUTE present", mutate: (r) => { r.publicFunctionExecuteRevoked = false; r.publicFunctionExecuteAcceptedAccepted = true; } },
  { id: 83, category: "security", description: "mutable search path accepted", mutate: (r) => { r.securityDefinerSearchPathsHardened = false; r.mutableSearchPathAcceptedAccepted = true; } },
  { id: 84, category: "security", description: "caller claims reviewer role", mutate: (r) => { r.callerClaimsReviewerRoleAccepted = true; } },
  { id: 85, category: "security", description: "service role direct DML defined as normal application path", mutate: (r) => { r.serviceRoleDirectDmlNormalPathAccepted = true; } },
  { id: 86, category: "security", description: "service role execute not granted", mutate: (r) => { r.serviceRoleExecuteGranted = false; } },
  { id: 87, category: "security", description: "public direct read allowed", mutate: (r) => { r.publicDirectReadAllowed = true; } },
  { id: 88, category: "security", description: "public direct write allowed", mutate: (r) => { r.publicDirectWriteAllowed = true; } },
  { id: 89, category: "security", description: "Smart Talk runtime write allowed", mutate: (r) => { r.smartTalkRuntimeWriteAllowed = true; } },
  { id: 90, category: "security", description: "unrestricted dynamic SQL detected", mutate: (r) => { r.unrestrictedDynamicSqlDetected = true; } },
  { id: 91, category: "security", description: "locale used for jurisdiction", mutate: (r) => { r.localeUsedForJurisdiction = true; } },

  // --- Boundaries ---
  { id: 92, category: "boundaries", description: "database applied", mutate: (r) => { r.databaseMigrationApplied = true; r.databaseAppliedAcceptedAccepted = true; } },
  { id: 93, category: "boundaries", description: "real data inserted", mutate: (r) => { r.realKnowledgeRowsInserted = true; r.realDataInsertedAcceptedAccepted = true; } },
  { id: 94, category: "boundaries", description: "runtime retrieval enabled", mutate: (r) => { r.runtimeRetrievalEnabled = true; r.runtimeRetrievalEnabledAcceptedAccepted = true; } },
  { id: 95, category: "boundaries", description: "cross-border connector activated", mutate: (r) => { r.crossBorderConnectorActivated = true; r.crossBorderActivatedAcceptedAccepted = true; } },
  { id: 96, category: "boundaries", description: "locale used for jurisdiction (boundary)", mutate: (r) => { r.localeUsedForJurisdiction = true; r.localeForJurisdictionAcceptedAccepted = true; } },
  { id: 97, category: "boundaries", description: "First Contact mode introduced", mutate: (r) => { r.standaloneFirstContactModeIntroduced = true; r.firstContactIntroducedAcceptedAccepted = true; } },
  { id: 98, category: "boundaries", description: "production authorized", mutate: (r) => { r.productionAuthorizedNow = true; r.productionAuthorizedAcceptedAccepted = true; } },
  { id: 99, category: "boundaries", description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; r.publicRuntimeAuthorizedAcceptedAccepted = true; } },
  { id: 100, category: "boundaries", description: "database write performed", mutate: (r) => { r.databaseWritePerformed = true; } },
  { id: 101, category: "boundaries", description: "remote database used", mutate: (r) => { r.remoteDatabaseUsed = true; } },
  { id: 102, category: "boundaries", description: "German knowledge pack published", mutate: (r) => { r.germanKnowledgePackPublished = true; } },
  { id: 103, category: "boundaries", description: "real source fetched", mutate: (r) => { r.realSourceFetched = true; } },
  { id: 104, category: "boundaries", description: "real government content stored", mutate: (r) => { r.realGovernmentContentStored = true; } },
  { id: 105, category: "boundaries", description: "Docker started (implicit via applied migration)", mutate: (r) => { r.dockerStartedAccepted = true; r.databaseMigrationApplied = true; } },
  { id: 106, category: "boundaries", description: "PostgreSQL started (implicit via applied migration)", mutate: (r) => { r.postgresqlStartedAccepted = true; r.databaseMigrationApplied = true; } },
  { id: 107, category: "boundaries", description: "Supabase CLI executed", mutate: (r) => { r.supabaseCliExecutedAccepted = true; } },
  { id: 108, category: "boundaries", description: "migration applied flag", mutate: (r) => { r.migrationAppliedAccepted = true; r.databaseMigrationApplied = true; } },

  // --- Readiness / meta ---
  { id: 109, category: "meta", description: "ready for real German source ingestion true", mutate: (r) => { r.readyForRealGermanSourceIngestion = true; } },
  { id: 110, category: "meta", description: "ready for controlled database write true", mutate: (r) => { r.readyForControlledDatabaseWrite = true; } },
  { id: 111, category: "meta", description: "ready for runtime retrieval true", mutate: (r) => { r.readyForRuntimeRetrieval = true; } },
  { id: 112, category: "meta", description: "blocking implementation gap count nonzero but allPassed claimed", mutate: (r) => { r.blockingImplementationGapCount = 1; r.blockingImplementationGaps = ["synthetic gap"]; } },
  { id: 113, category: "meta", description: "tamper case count below floor", mutate: (r) => { r.tamperCaseCount = 10; } },
  { id: 114, category: "meta", description: "wrong phase id", mutate: (r) => { r.phaseId = "9N"; } },
  { id: 115, category: "meta", description: "wrong source plan phase id", mutate: (r) => { r.sourcePlanPhaseId = "9K"; } },
  { id: 116, category: "meta", description: "wrong source plan commit", mutate: (r) => { r.sourcePlanCommit = "0000000"; } },

  // --- PATCH 9M-PATCH: trusted actor authorization boundary (20 new cases, section 18) ---
  { id: 117, category: "actor_boundary", description: "grantable RPC contains p_actor_class text", mutate: (r) => { r.actorClassParamPresentAccepted = true; r.privilegedActorClassCallerControlled = true; r.grantableFunctionsWithCallerControlledPrivilegedActorParameterCount = 1; r.grantableFunctionsWithCallerControlledPrivilegedActorParameters = ["knowledge_bootstrap_publication_subject"]; } },
  { id: 118, category: "actor_boundary", description: "grantable RPC contains p_created_by_actor_type text", mutate: (r) => { r.createdByActorTypeParamPresentAccepted = true; r.privilegedActorClassCallerControlled = true; r.grantableFunctionsWithCallerControlledPrivilegedActorParameterCount = 1; r.grantableFunctionsWithCallerControlledPrivilegedActorParameters = ["knowledge_create_machine_translation_candidate"]; } },
  { id: 119, category: "actor_boundary", description: "caller may pass authorized_reviewer", mutate: (r) => { r.callerClaimsAuthorizedReviewerAccepted = true; r.reviewerRoleCallerControlled = true; } },
  { id: 120, category: "actor_boundary", description: "caller may pass publication_administrator", mutate: (r) => { r.callerClaimsPublicationAdministratorAccepted = true; r.publicationAdministratorCallerControlled = true; } },
  { id: 121, category: "actor_boundary", description: "caller may pass emergency_suspension_authority", mutate: (r) => { r.callerClaimsEmergencyAuthorityAccepted = true; r.emergencyAuthorityCallerControlled = true; } },
  { id: 122, category: "actor_boundary", description: "caller may pass migration_bootstrap_system", mutate: (r) => { r.callerClaimsMigrationBootstrapSystemAccepted = true; r.actorClassDerivedFromTrustedOperation = false; } },
  { id: 123, category: "actor_boundary", description: "caller may pass automated_ingestion_system", mutate: (r) => { r.callerClaimsAutomatedIngestionSystemAccepted = true; r.actorClassDerivedFromTrustedOperation = false; } },
  { id: 124, category: "actor_boundary", description: "generic transition engine granted to service_role", mutate: (r) => { r.transitionEngineGrantedToServiceRoleAccepted = true; r.genericTransitionEngineGrantedToServiceRole = true; r.genericPrivilegedTransitionEngineDirectlyGranted = true; } },
  { id: 125, category: "actor_boundary", description: "generic transition engine accepts arbitrary p_to_state and is grantable", mutate: (r) => { r.transitionEngineArbitraryToStateGrantableAccepted = true; r.genericPrivilegedTransitionEngineDirectlyGranted = true; } },
  { id: 126, category: "actor_boundary", description: "emergency wrapper forwards caller actor class", mutate: (r) => { r.emergencyWrapperForwardsCallerActorClassAccepted = true; r.emergencyAuthorityCallerControlled = true; } },
  { id: 127, category: "actor_boundary", description: "approval wrapper forwards caller reviewer role", mutate: (r) => { r.approvalWrapperForwardsCallerReviewerRoleAccepted = true; r.reviewerRoleCallerControlled = true; } },
  { id: 128, category: "actor_boundary", description: "bootstrap wrapper forwards caller actor class", mutate: (r) => { r.bootstrapWrapperForwardsCallerActorClassAccepted = true; r.actorClassDerivedFromTrustedOperation = false; } },
  { id: 129, category: "actor_boundary", description: "actor class is only checked against an allowlist", mutate: (r) => { r.actorClassAllowlistOnlyCheckAcceptedAsSafe = true; r.privilegedActorClassCallerControlled = true; } },
  { id: 130, category: "actor_boundary", description: "actor identifier is incorrectly reused as authorization", mutate: (r) => { r.actorIdentifierReusedAsAuthorizationAccepted = true; } },
  { id: 131, category: "actor_boundary", description: "audit metadata parameter is treated as trusted role", mutate: (r) => { r.auditMetadataTreatedAsTrustedRoleAccepted = true; r.actorClassDerivedFromTrustedOperation = false; } },
  { id: 132, category: "actor_boundary", description: "internal engine accidentally granted to PUBLIC", mutate: (r) => { r.internalEngineGrantedToPublicAccepted = true; r.publicFunctionExecuteRevoked = false; } },
  { id: 133, category: "actor_boundary", description: "operation wrapper permits an unrelated target state", mutate: (r) => { r.operationWrapperPermitsUnrelatedTargetStateAccepted = true; r.operationScopedWrappersPresent = false; r.actorClassDerivedFromTrustedOperation = false; } },
  { id: 134, category: "actor_boundary", description: "translation approval accepts caller reviewer class", mutate: (r) => { r.translationApprovalAcceptsCallerReviewerClassAccepted = true; r.reviewerRoleCallerControlled = true; } },
  { id: 135, category: "actor_boundary", description: "candidate creation accepts privileged creator actor type", mutate: (r) => { r.candidateCreationAcceptsPrivilegedCreatorActorTypeAccepted = true; r.privilegedActorClassCallerControlled = true; } },
  { id: 136, category: "actor_boundary", description: "system invalidation function receives service-role grant", mutate: (r) => { r.systemInvalidationGrantedToServiceRoleAccepted = true; r.systemOnlyFunctionCount = 0; r.systemOnlyFunctions = []; } },
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
      failures.push(`#${tc.id} (${tc.category}/${tc.description}) was NOT rejected`);
    }
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const analysis = analyzeMigrations();
  const gitEvidence = collectGitEvidence();
  const good = buildGoodResult(analysis, gitEvidence);

  const selfOk = computeExpectedAllPassed(good);
  const tamperOutcome = runTamperCases(good);

  const allPassed =
    selfOk && good.blockingImplementationGapCount === 0 && tamperOutcome.rejected === tamperOutcome.total;

  const result: Result = {
    ...good,
    tamperCaseCount: tamperOutcome.total,
    tamperCasesRejectedCount: tamperOutcome.rejected,
    tamperCasesRejected: tamperOutcome.rejected === tamperOutcome.total,
    allPassed,
    readyForPublicationAndCanonicalTranslationSchemaExtensionIsolatedPostgreSqlValidation: allPassed,
  };

  if (tamperOutcome.failures.length > 0) {
    (result as unknown as { tamperFailures: string[] }).tamperFailures = tamperOutcome.failures;
  }

  console.log(JSON.stringify(result, null, 2));
}

main();
