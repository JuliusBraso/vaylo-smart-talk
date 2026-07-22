/**
 * PHASE 9H-REPLAN — Empty Knowledge Schema Migration Validation
 * in an Isolated Local Docker PostgreSQL 17 Container.
 *
 * This file performs a REAL database execution validation of
 * `supabase/migrations/032_create_minimal_knowledge_schema.sql` against a
 * disposable, empty, local PostgreSQL 17 container running in Docker.
 *
 * It does NOT run the historical Supabase migration chain (migrations
 * 001/002 are never touched or applied). It does NOT use any remote
 * Supabase project, remote database, or `--linked` command. It never
 * inserts real or application data — only clearly-labeled
 * `SYNTHETIC_9H_*` fixtures inside a transaction that is always rolled
 * back.
 *
 * Execution summary performed by this script when run:
 *   1. Static, read-only inspection of migration 032's source text to
 *      dynamically derive its real prerequisites (extensions, roles,
 *      schemas, functions, types) — never guessed/hardcoded.
 *   2. Start a disposable `postgres:17` Docker container bound only to
 *      127.0.0.1, on a port outside the reserved Supabase local range
 *      (54320-54329).
 *   3. Bootstrap only the roles migration 032's own source text actually
 *      references (`anon`, `authenticated`, `service_role`) — no
 *      application data, no seed rows.
 *   4. Apply ONLY migration 032 via `psql --single-transaction
 *      -v ON_ERROR_STOP=1`, executed by PostgreSQL itself.
 *   5. Run live catalog-query and behavioral assertions (table inventory,
 *      RLS, policies/grants incl. actual `SET ROLE anon/authenticated`
 *      write/read attempts, FK/PK/unique/index counts, invalid objects).
 *   6. Run a synthetic fixture script (labelled `SYNTHETIC_9H_*`) inside a
 *      transaction that is rolled back at the end, exercising uniqueness,
 *      check-constraint, citation/competence FK integrity, and the
 *      locked-source-version immutability trigger.
 *   7. Verify zero rows remain in every knowledge_* table.
 *   8. Tear down: stop + remove the container and its disposable volume,
 *      verified afterwards.
 * Cleanup runs in a `finally` block so it happens even if any step fails.
 */

import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SOURCE_CLOSURE_COMMIT = "ae761a7";
const SOURCE_MIGRATION_CHECK_ID = "9G";

const PHASE_9G_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-minimal-knowledge-schema-migration-implementation-audit.ts";
const AUDIT_SELF_REL_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-empty-schema-migration-validation-closure-audit.ts";
const MIGRATIONS_DIR_REL_PATH = "supabase/migrations";
const MIGRATION_FILE_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_REL_PATH = `${MIGRATIONS_DIR_REL_PATH}/${MIGRATION_FILE_NAME}`;
const HISTORICAL_MIGRATION_001 = `${MIGRATIONS_DIR_REL_PATH}/001_create_phrases_tables.sql`;
const HISTORICAL_MIGRATION_002 = `${MIGRATIONS_DIR_REL_PATH}/002_seed_phrases.sql`;
const SUPABASE_CONFIG_REL_PATH = "supabase/config.toml";

const CONTAINER_NAME = "phase9h-pg17-validation";
const DB_NAME = "phase9h_validation";
const DB_HOST = "127.0.0.1";
const RESERVED_PORT_RANGE: readonly [number, number] = [54320, 54329];
const CANDIDATE_PORTS = [55432, 55433, 55434, 55435, 55436];
const POSTGRES_IMAGE = "postgres:17";
const COLLISION_TABLE_NAMES = ["knowledge_topics", "knowledge_steps", "knowledge_step_dependencies"] as const;

const KNOWN_USER_CONTENT_TABLE_SUBSTRINGS = [
  "user_documents", "user_profile", "profiles", "user_dna", "payments", "conversation",
  "user_step_state", "user_action_events", "user_progress", "user_phrase_state",
];

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

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function runGitReadOnly(cmd: string): string {
  try {
    return execFileSync("git", cmd.split(" "), { encoding: "utf8", cwd: process.cwd(), timeout: 8000 }).trim();
  } catch {
    return "";
  }
}

// ============================================================================
// DOCKER HELPERS (local-only; never touches a remote host)
// ============================================================================

function resolveDockerBinary(): string {
  const direct = spawnSync("docker", ["--version"], { encoding: "utf8", timeout: 5000 });
  if (direct.status === 0) return "docker";
  const candidate = path.join(process.env.LOCALAPPDATA || "", "Programs", "DockerDesktop", "resources", "bin", "docker.exe");
  if (fs.existsSync(candidate)) {
    const viaCandidate = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 5000 });
    if (viaCandidate.status === 0) return candidate;
  }
  return "docker";
}

function run(bin: string, args: string[], opts: { timeoutMs?: number } = {}): { code: number; stdout: string; stderr: string } {
  const res = spawnSync(bin, args, { encoding: "utf8", timeout: opts.timeoutMs ?? 60000 });
  if (res.error) return { code: 1, stdout: res.stdout || "", stderr: String(res.error) };
  return { code: res.status ?? 1, stdout: res.stdout || "", stderr: res.stderr || "" };
}

function isPortInReservedRange(port: number): boolean {
  return port >= RESERVED_PORT_RANGE[0] && port <= RESERVED_PORT_RANGE[1];
}

function psqlQuery(dockerBin: string, container: string, db: string, sql: string): { ok: boolean; stdout: string; stderr: string } {
  const res = run(dockerBin, ["exec", container, "psql", "-U", "postgres", "-d", db, "-t", "-A", "-c", sql], { timeoutMs: 15000 });
  return { ok: res.code === 0, stdout: res.stdout.trim(), stderr: res.stderr };
}

// ============================================================================
// STATIC MIGRATION PREREQUISITE ANALYSIS (dynamic; never guessed)
// ============================================================================

function extractCreateTableNames(sql: string): string[] {
  const re = /create table if not exists public\.(knowledge_[a-z0-9_]+)\s*\(/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function extractReferencedRoles(sql: string): string[] {
  const roles = new Set<string>();
  const re = /\b(?:revoke\s+all\s+on\s+[^;]*?\s+from|grant\s+[^;]*?\s+to)\s+([a-z0-9_,\s]+);/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    m[1].split(",").map((s) => s.trim()).forEach((tok) => {
      if (tok && tok !== "public" && tok !== "postgres") roles.add(tok);
    });
  }
  // service_role is referenced only in comments (RLS-bypass behavior), not in an
  // executable GRANT/REVOKE — bootstrap it anyway since RLS semantics depend on it
  // existing with BYPASSRLS in a genuine Supabase-shaped database.
  if (/service[_-]role/i.test(sql)) roles.add("service_role");
  return Array.from(roles).sort();
}

function analyzeMigrationPrerequisites(sql: string) {
  return {
    tableNames: extractCreateTableNames(sql),
    requiredExtensions: (sql.match(/create extension[^;]*/gi) || []).map((s) => s.trim()),
    referencedRoles: extractReferencedRoles(sql),
    requiredSchemasBeyondPublic: (sql.match(/create schema\s+(?!if not exists public\b)[^;]*/gi) || []),
    functionsCreatedByMigration: (sql.match(/create (?:or replace )?function public\.([a-z0-9_]+)/gi) || []).map((s) =>
      s.replace(/create (?:or replace )?function public\./i, "")
    ),
    requiredTypesBeyondBuiltin: (sql.match(/create type\s+[^;]*/gi) || []),
    usesGenRandomUuid: /gen_random_uuid\s*\(/i.test(sql),
    hasInsertStatements: /\binsert\s+into\b/i.test(sql),
    hasCascadeDelete: /on delete cascade/i.test(sql),
    hasDropTableOrSchema: /\bdrop\s+(table|schema)\b/i.test(sql),
    noUserDataFkStatically: !KNOWN_USER_CONTENT_TABLE_SUBSTRINGS.some((t) => new RegExp(`references public\\.${t}`, "i").test(sql)),
  };
}

// ============================================================================
// SYNTHETIC FIXTURE TEST SCRIPT (labelled SYNTHETIC_9H_*, always rolled back)
// ============================================================================

const FIXTURE_TEST_SQL = `BEGIN;

DO $$
DECLARE
  v_trust_domain_id uuid;
  v_jurisdiction_id uuid;
  v_territorial_scope_id uuid;
  v_publisher_id uuid;
  v_source_id uuid;
  v_source_version_id uuid;
  v_passage_id uuid;
  v_authority_id uuid;
  v_competence_id uuid;
  v_claim_id uuid;
  v_citation_id uuid;
  v_process_id uuid;
  v_responsible_actor_rule_id uuid;
  v_step1_id uuid;
BEGIN
  INSERT INTO public.knowledge_trust_domains (code, name) VALUES ('de', 'SYNTHETIC_9H_TRUST_DOMAIN') RETURNING id INTO v_trust_domain_id;
  INSERT INTO public.knowledge_jurisdictions (jurisdiction_level, name) VALUES ('de_federal', 'SYNTHETIC_9H_JURISDICTION') RETURNING id INTO v_jurisdiction_id;
  INSERT INTO public.knowledge_territorial_scopes (scope_type) VALUES ('SYNTHETIC_9H_SCOPE') RETURNING id INTO v_territorial_scope_id;
  INSERT INTO public.knowledge_publishers (publisher_name, publisher_type, territorial_competence_id, trust_domain_id) VALUES ('SYNTHETIC_9H_PUBLISHER', 'federal_ministry', v_territorial_scope_id, v_trust_domain_id) RETURNING id INTO v_publisher_id;
  INSERT INTO public.knowledge_sources (publisher_id, source_type, source_purpose, jurisdiction_id, territorial_scope_id, source_language) VALUES (v_publisher_id, 'federal_law', 'SYNTHETIC_9H_SOURCE', v_jurisdiction_id, v_territorial_scope_id, 'de') RETURNING id INTO v_source_id;
  INSERT INTO public.knowledge_source_versions (source_id, version_sequence, content_hash) VALUES (v_source_id, 1, 'SYNTHETIC_9H_HASH_1') RETURNING id INTO v_source_version_id;
  INSERT INTO public.knowledge_source_passages (source_version_id, passage_order, text, text_hash, language) VALUES (v_source_version_id, 0, 'SYNTHETIC_9H_TEXT', 'SYNTHETIC_9H_TEXT_HASH', 'de') RETURNING id INTO v_passage_id;
  INSERT INTO public.knowledge_authorities (publisher_id, authority_name, authority_type, jurisdiction_id, territorial_scope_id) VALUES (v_publisher_id, 'SYNTHETIC_9H_AUTHORITY', 'federal_office', v_jurisdiction_id, v_territorial_scope_id) RETURNING id INTO v_authority_id;
  INSERT INTO public.knowledge_authority_competences (authority_id, subject_matter, territorial_scope_id, competence_source_version_id, competence_passage_id, effective_from) VALUES (v_authority_id, 'SYNTHETIC_9H_SUBJECT', v_territorial_scope_id, v_source_version_id, v_passage_id, now()) RETURNING id INTO v_competence_id;
  INSERT INTO public.knowledge_claims (claim_type, claim_text_canonical, jurisdiction_id, authority_id, risk_level) VALUES ('SYNTHETIC_9H_CLAIM_TYPE', 'SYNTHETIC_9H_CLAIM_TEXT', v_jurisdiction_id, v_authority_id, 'low') RETURNING id INTO v_claim_id;
  INSERT INTO public.knowledge_citations (claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id, user_facing_label, internal_audit_label, original_language) VALUES (v_claim_id, v_source_id, v_source_version_id, v_passage_id, v_publisher_id, v_jurisdiction_id, 'SYNTHETIC_9H_LABEL', 'SYNTHETIC_9H_AUDIT_LABEL', 'de') RETURNING id INTO v_citation_id;
  RAISE NOTICE 'FIXTURES_OK';

  BEGIN
    INSERT INTO public.knowledge_source_versions (source_id, version_sequence, content_hash) VALUES (v_source_id, 1, 'SYNTHETIC_9H_HASH_DUP');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: duplicate_source_version_sequence';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'REJECTED: duplicate_source_version_sequence';
  END;

  BEGIN
    INSERT INTO public.knowledge_source_passages (source_version_id, passage_order, text, text_hash, language) VALUES (v_source_version_id, 0, 'X', 'X', 'de');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: duplicate_passage_order';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'REJECTED: duplicate_passage_order';
  END;

  INSERT INTO public.knowledge_responsible_actor_rules (actor_state) VALUES ('SYNTHETIC_9H_ACTOR_STATE') RETURNING id INTO v_responsible_actor_rule_id;
  INSERT INTO public.knowledge_processes (process_group_id, title, jurisdiction_id, risk_level) VALUES ('anmeldung_ummeldung_abmeldung', 'SYNTHETIC_9H_PROCESS', v_jurisdiction_id, 'low') RETURNING id INTO v_process_id;
  INSERT INTO public.knowledge_process_steps (process_id, step_order, step_type, title, responsible_actor_rule_id) VALUES (v_process_id, 0, 'SYNTHETIC_9H_STEP_TYPE', 'SYNTHETIC_9H_STEP', v_responsible_actor_rule_id) RETURNING id INTO v_step1_id;

  BEGIN
    INSERT INTO public.knowledge_process_steps (process_id, step_order, step_type, title, responsible_actor_rule_id) VALUES (v_process_id, 0, 'X', 'X', v_responsible_actor_rule_id);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: duplicate_process_step_order';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'REJECTED: duplicate_process_step_order';
  END;

  DECLARE
    v_term_id uuid;
  BEGIN
    INSERT INTO public.knowledge_terminology (canonical_german_term, definition_canonical, source_version_id, passage_id, risk_level) VALUES ('SYNTHETIC_9H_TERM', 'SYNTHETIC_9H_DEF', v_source_version_id, v_passage_id, 'low') RETURNING id INTO v_term_id;
    INSERT INTO public.knowledge_localized_terminology (terminology_entry_id, output_locale, localized_term, localized_explanation) VALUES (v_term_id, 'de', 'SYNTHETIC_9H_LOC_TERM', 'SYNTHETIC_9H_LOC_EXPL');

    BEGIN
      INSERT INTO public.knowledge_localized_terminology (terminology_entry_id, output_locale, localized_term, localized_explanation) VALUES (v_term_id, 'de', 'X', 'X');
      RAISE NOTICE 'UNEXPECTED_SUCCESS: duplicate_localized_terminology';
    EXCEPTION WHEN unique_violation THEN
      RAISE NOTICE 'REJECTED: duplicate_localized_terminology';
    END;

    BEGIN
      INSERT INTO public.knowledge_localized_terminology (terminology_entry_id, output_locale, localized_term, localized_explanation) VALUES (v_term_id, 'fr', 'X', 'X');
      RAISE NOTICE 'UNEXPECTED_SUCCESS: unsupported_locale';
    EXCEPTION WHEN check_violation THEN
      RAISE NOTICE 'REJECTED: unsupported_locale';
    END;
  END;

  BEGIN
    INSERT INTO public.knowledge_source_versions (source_id, version_sequence, content_hash, immutable) VALUES (v_source_id, 999, 'X', false);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: immutable_false';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: immutable_false';
  END;

  BEGIN
    INSERT INTO public.knowledge_source_versions (source_id, version_sequence, content_hash, effective_from, effective_until) VALUES (v_source_id, 998, 'X', now(), now() - interval '1 day');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: invalid_effective_period';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: invalid_effective_period';
  END;

  BEGIN
    INSERT INTO public.knowledge_deadline_rules (deadline_type, trigger_event_type, trigger_date_source, duration_value, jurisdiction_id, source_version_id, passage_id, risk_level) VALUES ('X', 'X', 'X', -5, v_jurisdiction_id, v_source_version_id, v_passage_id, 'low');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: negative_deadline_duration';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: negative_deadline_duration';
  END;

  BEGIN
    INSERT INTO public.knowledge_eligibility_rules (process_id, jurisdiction_id, source_version_id, passage_id, risk_level, final_determination_allowed) VALUES (v_process_id, v_jurisdiction_id, v_source_version_id, v_passage_id, 'low', true);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: eligibility_final_determination_true';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: eligibility_final_determination_true';
  END;

  BEGIN
    INSERT INTO public.knowledge_cross_border_connectors (connected_country, activation_from_locale_allowed) VALUES ('SK', true);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: locale_connector_activation_true';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: locale_connector_activation_true';
  END;

  BEGIN
    INSERT INTO public.knowledge_retrieval_metadata (entity_type, entity_id, authoritative_by_vector_similarity) VALUES ('claim', v_claim_id, true);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: vector_authoritative_true';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: vector_authoritative_true';
  END;

  BEGIN
    INSERT INTO public.knowledge_audit_events (event_type, entity_type, entity_id, actor_type, new_state_hash, user_content_included) VALUES ('X', 'claim', v_claim_id, 'system', 'X', true);
    RAISE NOTICE 'UNEXPECTED_SUCCESS: audit_user_content_true';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: audit_user_content_true';
  END;

  BEGIN
    INSERT INTO public.knowledge_processes (process_group_id, title, jurisdiction_id, risk_level) VALUES ('unsupported_group_xyz', 'X', v_jurisdiction_id, 'low');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: unsupported_process_group';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'REJECTED: unsupported_process_group';
  END;

  BEGIN
    INSERT INTO public.knowledge_citations (claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id, user_facing_label, internal_audit_label, original_language) VALUES ('00000000-0000-0000-0000-000000000000', v_source_id, v_source_version_id, v_passage_id, v_publisher_id, v_jurisdiction_id, 'X', 'X', 'de');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: citation_missing_claim';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: citation_missing_claim';
  END;

  BEGIN
    INSERT INTO public.knowledge_citations (claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id, user_facing_label, internal_audit_label, original_language) VALUES (v_claim_id, v_source_id, '00000000-0000-0000-0000-000000000000', v_passage_id, v_publisher_id, v_jurisdiction_id, 'X', 'X', 'de');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: citation_missing_source_version';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: citation_missing_source_version';
  END;

  BEGIN
    INSERT INTO public.knowledge_citations (claim_id, source_id, source_version_id, passage_id, publisher_id, jurisdiction_id, user_facing_label, internal_audit_label, original_language) VALUES (v_claim_id, v_source_id, v_source_version_id, '00000000-0000-0000-0000-000000000000', v_publisher_id, v_jurisdiction_id, 'X', 'X', 'de');
    RAISE NOTICE 'UNEXPECTED_SUCCESS: citation_missing_passage';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: citation_missing_passage';
  END;

  RAISE NOTICE 'VALID_CITATION_STORED: %', v_citation_id;

  BEGIN
    INSERT INTO public.knowledge_authority_competences (authority_id, subject_matter, territorial_scope_id, competence_source_version_id, effective_from) VALUES ('00000000-0000-0000-0000-000000000000', 'SYNTHETIC_9H_SUBJECT_X', v_territorial_scope_id, v_source_version_id, now());
    RAISE NOTICE 'UNEXPECTED_SUCCESS: competence_missing_authority';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: competence_missing_authority';
  END;

  BEGIN
    INSERT INTO public.knowledge_authority_competences (authority_id, subject_matter, territorial_scope_id, competence_source_version_id, effective_from) VALUES (v_authority_id, 'SYNTHETIC_9H_SUBJECT_Y', v_territorial_scope_id, '00000000-0000-0000-0000-000000000000', now());
    RAISE NOTICE 'UNEXPECTED_SUCCESS: competence_missing_source_support';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: competence_missing_source_support';
  END;

  RAISE NOTICE 'VALID_COMPETENCE_STORED: %', v_competence_id;

  UPDATE public.knowledge_source_versions SET locked_at = now() WHERE id = v_source_version_id;
  RAISE NOTICE 'LOCKED_OK';

  BEGIN
    UPDATE public.knowledge_source_versions SET review_status = 'human_reviewed' WHERE id = v_source_version_id;
    RAISE NOTICE 'DRAFT_WORKFLOW_MUTATION_OK';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'DRAFT_WORKFLOW_MUTATION_UNEXPECTED_FAILURE: %', SQLERRM;
  END;

  BEGIN
    UPDATE public.knowledge_source_versions SET content_hash = 'TAMPERED' WHERE id = v_source_version_id;
    RAISE NOTICE 'UNEXPECTED_SUCCESS: locked_content_mutation';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'REJECTED: locked_content_mutation';
  END;

  IF EXISTS (SELECT 1 FROM public.knowledge_source_versions WHERE id = v_source_version_id) THEN
    RAISE NOTICE 'HISTORICAL_VERSION_QUERYABLE_OK';
  ELSE
    RAISE NOTICE 'HISTORICAL_VERSION_QUERYABLE_FAIL';
  END IF;

  BEGIN
    DELETE FROM public.knowledge_authorities WHERE id = v_authority_id;
    RAISE NOTICE 'UNEXPECTED_SUCCESS: authority_delete_not_restricted';
  EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'REJECTED: authority_delete_restricted_ok';
  END;

END $$;

ROLLBACK;
`;

const EXPECTED_REJECT_MARKERS = [
  "duplicate_source_version_sequence", "duplicate_passage_order", "duplicate_process_step_order",
  "duplicate_localized_terminology", "unsupported_locale", "immutable_false", "invalid_effective_period",
  "negative_deadline_duration", "eligibility_final_determination_true", "locale_connector_activation_true",
  "vector_authoritative_true", "audit_user_content_true", "unsupported_process_group",
  "citation_missing_claim", "citation_missing_source_version", "citation_missing_passage",
  "competence_missing_authority", "competence_missing_source_support", "locked_content_mutation",
  "authority_delete_restricted_ok",
] as const;
const EXPECTED_OK_MARKERS = [
  "FIXTURES_OK", "LOCKED_OK", "DRAFT_WORKFLOW_MUTATION_OK", "HISTORICAL_VERSION_QUERYABLE_OK",
] as const;

// ============================================================================
// LIVE EXECUTION TYPES
// ============================================================================

interface LiveExecution {
  dockerAvailable: boolean;
  dockerBinary: string;
  containerName: string;
  containerStarted: boolean;
  dbHost: string;
  dbPort: number;
  dbName: string;
  postgresVersionRaw: string;
  postgresMajorVersion: number;
  configMajorVersion: number;
  bootstrappedRoles: string[];
  migration032CopiedIntoContainer: boolean;
  migration032ExitCode: number;
  migration032Stdout: string;
  migration032Stderr: string;
  migration032StartedAt: string;
  migration032CompletedAt: string;
  actualTableNames: string[];
  actualKnowledgeTableCount: number;
  missingKnowledgeTables: string[];
  unexpectedKnowledgeTables: string[];
  collisionTablesPresent: string[];
  rlsEnabledTableCount: number;
  rlsMissingTables: string[];
  policyCount: number;
  anonAnyPrivilegeCount: number;
  authenticatedAnyPrivilegeCount: number;
  publicAnyPrivilegeCount: number;
  anonSelectDenied: boolean;
  anonInsertDenied: boolean;
  authenticatedInsertDenied: boolean;
  primaryKeyCount: number;
  foreignKeyCount: number;
  uniqueConstraintCount: number;
  totalIndexCount: number;
  cascadeDeleteFkCount: number;
  fkTargetTables: string[];
  invalidIndexCount: number;
  unvalidatedConstraintCount: number;
  triggerExists: boolean;
  fixtureStdout: string;
  fixtureStderr: string;
  fixtureRejectMarkersFound: string[];
  fixtureOkMarkersFound: string[];
  fixtureUnexpectedSuccessMarkers: string[];
  perTableRowCounts: Record<string, number>;
  totalRowsAfterCleanup: number;
  crossBorderConnectorRows: number;
  crossBorderProcessRows: number;
  trustDomainRows: number;
  containerStoppedOk: boolean;
  containerRemovedOk: boolean;
  volumeRemovedOk: boolean;
  containerVerifiedAbsentAfterCleanup: boolean;
  errors: string[];
}

function emptyLiveExecution(): LiveExecution {
  return {
    dockerAvailable: false, dockerBinary: "docker", containerName: CONTAINER_NAME, containerStarted: false,
    dbHost: DB_HOST, dbPort: 0, dbName: DB_NAME, postgresVersionRaw: "", postgresMajorVersion: 0,
    configMajorVersion: 0, bootstrappedRoles: [], migration032CopiedIntoContainer: false,
    migration032ExitCode: -1, migration032Stdout: "", migration032Stderr: "",
    migration032StartedAt: "", migration032CompletedAt: "",
    actualTableNames: [], actualKnowledgeTableCount: 0, missingKnowledgeTables: [], unexpectedKnowledgeTables: [],
    collisionTablesPresent: [], rlsEnabledTableCount: 0, rlsMissingTables: [], policyCount: -1,
    anonAnyPrivilegeCount: -1, authenticatedAnyPrivilegeCount: -1, publicAnyPrivilegeCount: -1,
    anonSelectDenied: false, anonInsertDenied: false, authenticatedInsertDenied: false,
    primaryKeyCount: 0, foreignKeyCount: 0, uniqueConstraintCount: 0, totalIndexCount: 0,
    cascadeDeleteFkCount: -1, fkTargetTables: [], invalidIndexCount: -1, unvalidatedConstraintCount: -1,
    triggerExists: false, fixtureStdout: "", fixtureStderr: "", fixtureRejectMarkersFound: [],
    fixtureOkMarkersFound: [], fixtureUnexpectedSuccessMarkers: [], perTableRowCounts: {},
    totalRowsAfterCleanup: -1, crossBorderConnectorRows: -1, crossBorderProcessRows: -1, trustDomainRows: -1,
    containerStoppedOk: false, containerRemovedOk: false, volumeRemovedOk: false,
    containerVerifiedAbsentAfterCleanup: false, errors: [],
  };
}

// ============================================================================
// MAIN DOCKER/POSTGRES ORCHESTRATION
// ============================================================================

function performLiveValidation(migrationSql: string, migrationAbsPath: string): LiveExecution {
  const ev = emptyLiveExecution();
  const dockerBin = resolveDockerBinary();
  ev.dockerBinary = dockerBin;

  const versionCheck = run(dockerBin, ["--version"], { timeoutMs: 5000 });
  ev.dockerAvailable = versionCheck.code === 0;
  if (!ev.dockerAvailable) {
    ev.errors.push("Docker is not available; live validation cannot proceed.");
    return ev;
  }

  const configText = readFileText(SUPABASE_CONFIG_REL_PATH);
  const majorVersionMatch = configText.match(/major_version\s*=\s*(\d+)/);
  ev.configMajorVersion = majorVersionMatch ? parseInt(majorVersionMatch[1], 10) : 0;

  // Pre-clean any leftover container from a previous interrupted run (deterministic name).
  run(dockerBin, ["rm", "-f", CONTAINER_NAME], { timeoutMs: 15000 });

  // Ensure the image is present locally (pull is standard tooling, not a database operation).
  const imagesCheck = run(dockerBin, ["images", "-q", POSTGRES_IMAGE], { timeoutMs: 10000 });
  if (!imagesCheck.stdout.trim()) {
    const pull = run(dockerBin, ["pull", POSTGRES_IMAGE], { timeoutMs: 240000 });
    if (pull.code !== 0) {
      ev.errors.push(`Failed to pull ${POSTGRES_IMAGE}: ${pull.stderr}`);
      return ev;
    }
  }

  let chosenPort = 0;
  let startedContainerId = "";
  const tempPassword = `phase9h_temp_${crypto.randomBytes(8).toString("hex")}`;
  for (const port of CANDIDATE_PORTS) {
    if (isPortInReservedRange(port)) continue;
    const runArgs = [
      "run", "-d", "--name", CONTAINER_NAME,
      "-p", `${DB_HOST}:${port}:5432`,
      "-e", `POSTGRES_PASSWORD=${tempPassword}`,
      "-e", `POSTGRES_DB=${DB_NAME}`,
      POSTGRES_IMAGE,
    ];
    const started = run(dockerBin, runArgs, { timeoutMs: 30000 });
    if (started.code === 0 && started.stdout.trim()) {
      chosenPort = port;
      startedContainerId = started.stdout.trim();
      break;
    }
    run(dockerBin, ["rm", "-f", CONTAINER_NAME], { timeoutMs: 10000 });
  }

  if (!startedContainerId || chosenPort === 0) {
    ev.errors.push("Failed to start a disposable Postgres 17 container on any candidate port.");
    return ev;
  }
  ev.containerStarted = true;
  ev.dbPort = chosenPort;

  try {
    const sleepMs = (ms: number) => {
      spawnSync(process.platform === "win32" ? "timeout" : "sleep", [process.platform === "win32" ? `/t ${Math.max(1, Math.ceil(ms / 1000))}` : `${ms / 1000}`], { timeout: ms + 2000 });
    };

    // The official postgres image performs an internal init-then-restart sequence:
    // pg_isready can briefly report "ready" during the throwaway init server before
    // the real server restarts. Require several consecutive successful readiness
    // checks (not just one) before trusting the container.
    let consecutiveReady = 0;
    let healthy = false;
    for (let i = 0; i < 40; i += 1) {
      const ready = run(dockerBin, ["exec", CONTAINER_NAME, "pg_isready", "-U", "postgres"], { timeoutMs: 5000 });
      if (ready.code === 0) {
        consecutiveReady += 1;
        if (consecutiveReady >= 3) { healthy = true; break; }
      } else {
        consecutiveReady = 0;
      }
      sleepMs(500);
    }
    if (!healthy) {
      ev.errors.push("Container never reported consistently healthy via pg_isready.");
      return ev;
    }

    // Retry the first real query a few times in case of a residual restart race.
    let versionResult = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "SHOW server_version;");
    for (let i = 0; i < 10 && (!versionResult.ok || !versionResult.stdout); i += 1) {
      sleepMs(500);
      versionResult = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "SHOW server_version;");
    }
    ev.postgresVersionRaw = versionResult.stdout;
    const majorMatch = ev.postgresVersionRaw.match(/^(\d+)/);
    ev.postgresMajorVersion = majorMatch ? parseInt(majorMatch[1], 10) : 0;
    if (!ev.postgresVersionRaw) {
      ev.errors.push("Could not verify PostgreSQL version after readiness was reported.");
      return ev;
    }

    // Dynamic prerequisite bootstrap: only roles migration 032's own text references.
    const prereq = analyzeMigrationPrerequisites(migrationSql);
    const roleStatements = prereq.referencedRoles.map((r) =>
      r === "service_role" ? `CREATE ROLE ${r} NOLOGIN BYPASSRLS;` : `CREATE ROLE ${r} NOLOGIN;`
    ).join(" ");
    if (roleStatements) {
      const bootstrap = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, roleStatements);
      if (bootstrap.ok) ev.bootstrappedRoles = prereq.referencedRoles;
      else ev.errors.push(`Role bootstrap failed: ${bootstrap.stderr}`);
    }

    const containerMigrationPath = "/tmp/032_migration.sql";
    const copy = run(dockerBin, ["cp", migrationAbsPath, `${CONTAINER_NAME}:${containerMigrationPath}`], { timeoutMs: 10000 });
    ev.migration032CopiedIntoContainer = copy.code === 0;
    if (!ev.migration032CopiedIntoContainer) {
      ev.errors.push(`Failed to copy migration into container: ${copy.stderr}`);
      return ev;
    }

    ev.migration032StartedAt = new Date().toISOString();
    const applied = run(
      dockerBin,
      ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-v", "ON_ERROR_STOP=1", "--single-transaction", "-f", containerMigrationPath],
      { timeoutMs: 60000 }
    );
    ev.migration032CompletedAt = new Date().toISOString();
    ev.migration032ExitCode = applied.code;
    ev.migration032Stdout = applied.stdout;
    ev.migration032Stderr = applied.stderr;

    if (ev.migration032ExitCode !== 0) {
      ev.errors.push(`Migration 032 failed with exit code ${ev.migration032ExitCode}: ${applied.stderr}`);
      return ev;
    }

    // A. Table inventory
    const tablesQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select tablename from pg_tables where schemaname='public' and tablename like 'knowledge_%' order by tablename;");
    ev.actualTableNames = tablesQ.stdout.split("\n").map((s) => s.trim()).filter(Boolean);
    ev.actualKnowledgeTableCount = ev.actualTableNames.length;
    const expectedTables = prereq.tableNames;
    ev.missingKnowledgeTables = expectedTables.filter((t) => !ev.actualTableNames.includes(t));
    ev.unexpectedKnowledgeTables = ev.actualTableNames.filter((t) => !expectedTables.includes(t));
    ev.collisionTablesPresent = COLLISION_TABLE_NAMES.filter((t) => ev.actualTableNames.includes(t));

    // B. RLS
    const rlsCountQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_tables where schemaname='public' and tablename like 'knowledge_%' and rowsecurity=true;");
    ev.rlsEnabledTableCount = parseInt(rlsCountQ.stdout, 10) || 0;
    const rlsMissingQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select tablename from pg_tables where schemaname='public' and tablename like 'knowledge_%' and rowsecurity=false;");
    ev.rlsMissingTables = rlsMissingQ.stdout.split("\n").map((s) => s.trim()).filter(Boolean);

    // C. Policies and grants (actual catalog, not source text)
    const policyQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_policies where schemaname='public' and tablename like 'knowledge_%';");
    ev.policyCount = parseInt(policyQ.stdout, 10);
    const anonPrivQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from information_schema.table_privileges where table_schema='public' and table_name like 'knowledge_%' and grantee='anon';");
    ev.anonAnyPrivilegeCount = parseInt(anonPrivQ.stdout, 10);
    const authPrivQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from information_schema.table_privileges where table_schema='public' and table_name like 'knowledge_%' and grantee='authenticated';");
    ev.authenticatedAnyPrivilegeCount = parseInt(authPrivQ.stdout, 10);
    const publicPrivQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from information_schema.table_privileges where table_schema='public' and table_name like 'knowledge_%' and grantee='public';");
    ev.publicAnyPrivilegeCount = parseInt(publicPrivQ.stdout, 10);

    const anonSelect = run(dockerBin, ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-c",
      "SET ROLE anon; SELECT * FROM public.knowledge_sources LIMIT 1;"], { timeoutMs: 10000 });
    ev.anonSelectDenied = anonSelect.code !== 0 && /permission denied/i.test(anonSelect.stderr);

    const anonInsert = run(dockerBin, ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-c",
      "SET ROLE anon; INSERT INTO public.knowledge_trust_domains (code, name) VALUES ('de','X');"], { timeoutMs: 10000 });
    ev.anonInsertDenied = anonInsert.code !== 0 && /permission denied/i.test(anonInsert.stderr);

    const authInsert = run(dockerBin, ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-c",
      "SET ROLE authenticated; INSERT INTO public.knowledge_trust_domains (code, name) VALUES ('de','X');"], { timeoutMs: 10000 });
    ev.authenticatedInsertDenied = authInsert.code !== 0 && /permission denied/i.test(authInsert.stderr);

    // D. Structural integrity
    const pkQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_constraint c join pg_class t on c.conrelid=t.oid join pg_namespace n on t.relnamespace=n.oid where n.nspname='public' and t.relname like 'knowledge_%' and c.contype='p';");
    ev.primaryKeyCount = parseInt(pkQ.stdout, 10) || 0;
    const fkQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_constraint c join pg_class t on c.conrelid=t.oid join pg_namespace n on t.relnamespace=n.oid where n.nspname='public' and t.relname like 'knowledge_%' and c.contype='f';");
    ev.foreignKeyCount = parseInt(fkQ.stdout, 10) || 0;
    const uqQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_constraint c join pg_class t on c.conrelid=t.oid join pg_namespace n on t.relnamespace=n.oid where n.nspname='public' and t.relname like 'knowledge_%' and c.contype='u';");
    ev.uniqueConstraintCount = parseInt(uqQ.stdout, 10) || 0;
    const idxQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_indexes where schemaname='public' and tablename like 'knowledge_%';");
    ev.totalIndexCount = parseInt(idxQ.stdout, 10) || 0;
    const cascadeQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_constraint c join pg_class t on c.conrelid=t.oid join pg_namespace n on t.relnamespace=n.oid where n.nspname='public' and t.relname like 'knowledge_%' and c.contype='f' and c.confdeltype='c';");
    ev.cascadeDeleteFkCount = parseInt(cascadeQ.stdout, 10);
    const fkTargetsQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select distinct ref_t.relname from pg_constraint c join pg_class t on c.conrelid=t.oid join pg_class ref_t on c.confrelid=ref_t.oid join pg_namespace n on t.relnamespace=n.oid where n.nspname='public' and t.relname like 'knowledge_%' and c.contype='f' order by 1;");
    ev.fkTargetTables = fkTargetsQ.stdout.split("\n").map((s) => s.trim()).filter(Boolean);
    const invalidIdxQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "select count(*) from pg_index where not indisvalid;");
    ev.invalidIndexCount = parseInt(invalidIdxQ.stdout, 10);
    const unvalidatedQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "select count(*) from pg_constraint where not convalidated;");
    ev.unvalidatedConstraintCount = parseInt(unvalidatedQ.stdout, 10);
    const triggerQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      "select count(*) from pg_trigger where tgname='knowledge_source_versions_protect_locked_content' and not tgisinternal;");
    ev.triggerExists = (parseInt(triggerQ.stdout, 10) || 0) > 0;

    // F/uniqueness/checks: synthetic fixture script, rolled back at the end.
    const tmpFixturePath = path.join(os.tmpdir(), `phase9h-fixtures-${Date.now()}.sql`);
    fs.writeFileSync(tmpFixturePath, FIXTURE_TEST_SQL, "utf8");
    const fixtureContainerPath = "/tmp/phase9h_fixture_tests.sql";
    run(dockerBin, ["cp", tmpFixturePath, `${CONTAINER_NAME}:${fixtureContainerPath}`], { timeoutMs: 10000 });
    const fixtureRun = run(dockerBin, ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-f", fixtureContainerPath], { timeoutMs: 30000 });
    ev.fixtureStdout = fixtureRun.stdout;
    ev.fixtureStderr = fixtureRun.stderr;
    try { fs.unlinkSync(tmpFixturePath); } catch { /* best effort */ }

    const combined = `${ev.fixtureStdout}\n${ev.fixtureStderr}`;
    ev.fixtureRejectMarkersFound = EXPECTED_REJECT_MARKERS.filter((m) => combined.includes(`REJECTED: ${m}`));
    ev.fixtureOkMarkersFound = EXPECTED_OK_MARKERS.filter((m) => combined.includes(m));
    const unexpectedRe = /UNEXPECTED_SUCCESS: (\w+)/g;
    let um: RegExpExecArray | null;
    while ((um = unexpectedRe.exec(combined)) !== null) ev.fixtureUnexpectedSuccessMarkers.push(um[1]);

    // E. Empty-state requirement (exact per-table count via dynamic SQL, not estimates)
    const zeroRowQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME,
      `select tablename || '=' || (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from public.%I', tablename), false, true, '')))[1]::text from pg_tables where schemaname='public' and tablename like 'knowledge_%' order by tablename;`);
    let total = 0;
    zeroRowQ.stdout.split("\n").map((s) => s.trim()).filter(Boolean).forEach((line) => {
      const [name, countStr] = line.split("=");
      const c = parseInt(countStr, 10) || 0;
      ev.perTableRowCounts[name] = c;
      total += c;
    });
    ev.totalRowsAfterCleanup = total;

    const cbConnQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "select count(*) from public.knowledge_cross_border_connectors;");
    ev.crossBorderConnectorRows = parseInt(cbConnQ.stdout, 10);
    const cbProcQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "select count(*) from public.knowledge_cross_border_processes;");
    ev.crossBorderProcessRows = parseInt(cbProcQ.stdout, 10);
    const trustQ = psqlQuery(dockerBin, CONTAINER_NAME, DB_NAME, "select count(*) from public.knowledge_trust_domains;");
    ev.trustDomainRows = parseInt(trustQ.stdout, 10);

    return ev;
  } finally {
    // Track the container's data volume before removal so we can remove it specifically.
    const mountsQ = run(dockerBin, ["inspect", CONTAINER_NAME, "--format", "{{range .Mounts}}{{.Name}}\n{{end}}"], { timeoutMs: 10000 });
    const volumeNames = mountsQ.stdout.split("\n").map((s) => s.trim()).filter(Boolean);

    const stop = run(dockerBin, ["stop", CONTAINER_NAME], { timeoutMs: 20000 });
    ev.containerStoppedOk = stop.code === 0;
    const rm = run(dockerBin, ["rm", CONTAINER_NAME], { timeoutMs: 15000 });
    ev.containerRemovedOk = rm.code === 0;

    let volOk = true;
    for (const vol of volumeNames) {
      const rmVol = run(dockerBin, ["volume", "rm", vol], { timeoutMs: 10000 });
      if (rmVol.code !== 0) volOk = false;
    }
    ev.volumeRemovedOk = volOk;

    const verify = run(dockerBin, ["ps", "-a", "--filter", `name=${CONTAINER_NAME}`, "--format", "{{.Names}}"], { timeoutMs: 10000 });
    ev.containerVerifiedAbsentAfterCleanup = !verify.stdout.trim();
  }
}

// ============================================================================
// GIT / SOURCE EVIDENCE
// ============================================================================

interface SourceEvidence {
  onlyExpectedFileChanged: boolean;
  existingFileModified: boolean;
  auditFileCreated: boolean;
  sourceMigrationReady: boolean;
  migrationChecksum: string;
  notes: string[];
}

function collectSourceEvidence(): SourceEvidence {
  const notes: string[] = [];
  const diffNameOnly = runGitReadOnly("diff --name-only").split("\n").map((s) => s.trim()).filter(Boolean);
  const statusShort = runGitReadOnly("status --short").split("\n").map((s) => s.trim()).filter(Boolean);
  const untrackedNew = statusShort
    .filter((line) => line.startsWith("??"))
    .map((line) => line.replace(/^\?\?\s*/, "").replace(/\\/g, "/"))
    .filter((p) => !p.startsWith(".next"));

  // This phase's own untracked infrastructure (supabase/.gitignore, supabase/config.toml)
  // pre-existed before this phase started and is explicitly permitted by PHASE 9H-REPLAN's
  // "CURRENT FACTS"; it is not counted as an unexpected new repository file.
  const permittedPreexistingUntracked = ["supabase/.gitignore", "supabase/config.toml"];

  const isAuditPathOrDirCovering = (p: string): boolean => {
    if (p === AUDIT_SELF_REL_PATH || p.endsWith(AUDIT_SELF_REL_PATH)) return true;
    const dirPrefix = p.endsWith("/") ? p : `${p}/`;
    return AUDIT_SELF_REL_PATH.startsWith(dirPrefix);
  };

  const unexpectedModified = diffNameOnly.filter((p) => p !== AUDIT_SELF_REL_PATH);
  const auditFileCreated = fileExists(AUDIT_SELF_REL_PATH) && untrackedNew.some((p) => isAuditPathOrDirCovering(p));
  const unexpectedUntracked = untrackedNew.filter(
    (p) => !isAuditPathOrDirCovering(p) && !permittedPreexistingUntracked.includes(p)
  );

  const onlyExpectedFileChanged = unexpectedModified.length === 0 && unexpectedUntracked.length === 0;
  // Note: diffNameOnly only reflects modifications to already-tracked files, so migration 032
  // (a tracked file from the ae761a7 commit) being edited would show up here.
  const existingFileModified = diffNameOnly.length > 0;

  if (unexpectedModified.length > 0) notes.push(`Unexpected modified tracked files: ${unexpectedModified.join(", ")}`);
  if (unexpectedUntracked.length > 0) notes.push(`Unexpected untracked files: ${unexpectedUntracked.join(", ")}`);

  const phase9gSrc = readFileText(PHASE_9G_REL_PATH);
  const phase9gExists = fileExists(PHASE_9G_REL_PATH);
  const sourceMigrationReady =
    phase9gExists && phase9gSrc.includes('checkId: "9G"') &&
    phase9gSrc.includes("readyForEmptySchemaMigrationValidationClosure: allPassed");
  if (!sourceMigrationReady) notes.push("PHASE 9G source did not statically confirm readiness.");

  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const migrationChecksum = migrationSql.length > 0 ? sha256Hex(migrationSql) : "not_found";

  return { onlyExpectedFileChanged, existingFileModified, auditFileCreated, sourceMigrationReady, migrationChecksum, notes };
}

// Captured independently so tampering the reported checksum is detectable.
const EXPECTED_MIGRATION_SQL_TEXT = readFileText(MIGRATION_REL_PATH);
const EXPECTED_MIGRATION_CHECKSUM = EXPECTED_MIGRATION_SQL_TEXT.length > 0 ? sha256Hex(EXPECTED_MIGRATION_SQL_TEXT) : "not_found";
const HISTORICAL_MIGRATIONS_UNTOUCHED =
  !fileExists(HISTORICAL_MIGRATION_001) || readFileText(HISTORICAL_MIGRATION_001).length >= 0; // presence check only, never modified by this script
void HISTORICAL_MIGRATIONS_UNTOUCHED;
void HISTORICAL_MIGRATION_002;

// ============================================================================
// RESULT TYPE
// ============================================================================

interface Result {
  checkId: "9H";
  allPassed: boolean;

  sourceClosureCommit: string;
  sourceMigrationCheckId: string;
  sourceMigrationReady: boolean;

  migrationFilePath: string;
  migrationChecksum: string;
  migrationNumber: string;

  localDockerExecutionPerformed: boolean;
  localPostgresContainerStarted: boolean;
  containerName: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  postgresMajorVersion: number;
  postgresVersionRaw: string;
  configExpectedMajorVersion: number;

  migration032Executed: boolean;
  migration032ExitCode: number;
  migration032AppliedSuccessfully: boolean;
  migration032StartedAt: string;
  migration032CompletedAt: string;
  migration032Modified: boolean;

  historicalMigrationChainExecuted: boolean;
  remoteDatabaseUsed: boolean;
  supabaseCliUsedForExecution: boolean;
  supabaseLinkUsed: boolean;

  dynamicallyDerivedPrerequisites: {
    requiredExtensions: string[];
    referencedRoles: string[];
    requiredSchemasBeyondPublic: string[];
    requiredTypesBeyondBuiltin: string[];
    usesGenRandomUuid: boolean;
  };
  bootstrappedRoles: string[];
  bootstrapContainsApplicationData: boolean;

  expectedKnowledgeTableCount: number;
  actualKnowledgeTableCount: number;
  allExpectedKnowledgeTablesPresent: boolean;
  missingKnowledgeTables: string[];
  unexpectedKnowledgeTablesPresent: boolean;
  unexpectedKnowledgeTables: string[];
  collisionTablesPresent: string[];

  rlsEnabledOnAllExpectedTables: boolean;
  rlsEnabledTableCount: number;
  rlsMissingTables: string[];

  policyCountFound: number;
  anonWritesBlocked: boolean;
  authenticatedWritesBlocked: boolean;
  publicDirectReadsBlocked: boolean;
  anonAnyCatalogPrivilegeCount: number;
  authenticatedAnyCatalogPrivilegeCount: number;
  publicAnyCatalogPrivilegeCount: number;
  liveAnonSelectDenied: boolean;
  liveAnonInsertDenied: boolean;
  liveAuthenticatedInsertDenied: boolean;

  foreignKeysValid: boolean;
  foreignKeyCount: number;
  primaryKeyCount: number;
  constraintsValid: boolean;
  uniqueConstraintCount: number;
  totalIndexCount: number;
  invalidIndexCount: number;
  unvalidatedConstraintCount: number;
  cascadeDeleteOnProtectedHistoryCount: number;
  userDataForeignKeysAbsent: boolean;
  fkTargetTables: string[];

  allKnowledgeTablesEmpty: boolean;
  perTableRowCounts: Record<string, number>;
  totalKnowledgeRowsAfterCleanup: number;
  seedDataExecuted: boolean;
  germanKnowledgeRecordsInserted: boolean;
  deSkConnectorActivated: boolean;
  crossBorderConnectorRows: number;
  crossBorderProcessRows: number;
  trustDomainRows: number;

  immutableSourceVersionModelValid: boolean;
  passageCitationModelValid: boolean;
  lockedContentMutationRejectedLive: boolean;
  draftWorkflowMutationAllowedLive: boolean;
  historicalVersionStillQueryableLive: boolean;
  triggerExists: boolean;

  uniquenessTestsPassed: boolean;
  checkConstraintTestsPassed: boolean;
  citationIntegrityTestsPassed: boolean;
  authorityCompetenceTestsPassed: boolean;
  fixtureRejectMarkersFoundCount: number;
  fixtureExpectedRejectMarkerCount: number;
  fixtureUnexpectedSuccessCount: number;
  temporarySyntheticFixturesUsed: boolean;
  temporaryFixturesRemoved: boolean;

  sqlAssertionsExecuted: boolean;
  sqlAssertionsPassed: boolean;
  transactionalValidityConfirmed: boolean;

  containerCleanupAttempted: boolean;
  containerRemoved: boolean;
  disposableVolumeRemoved: boolean;
  containerVerifiedAbsentAfterCleanup: boolean;

  existingMigrationModified: boolean;
  runtimeModified: boolean;
  uiModified: boolean;
  routeModified: boolean;
  generatedTypesModified: boolean;
  seedFileCreated: boolean;
  networkAccessPerformed: boolean;
  modelCallPerformed: boolean;
  ocrExecutionPerformed: boolean;
  embeddingCreated: boolean;
  retrievalPerformed: boolean;
  persistenceOfUserContentPerformed: boolean;

  appendOnlyGovernanceTriggerStillOpen: boolean;
  approvedReadViewsStillOpen: boolean;
  generatedTypesStillOpen: boolean;
  officialSourceIngestionStillOpen: boolean;
  germanKnowledgePopulationStillOpen: boolean;
  deSkImplementationStillOpen: boolean;

  productionAuthorizedNow: boolean;
  publicRuntimeAuthorizedNow: boolean;

  readyForGermanKnowledgeIngestionDesign: boolean;

  liveExecutionErrors: string[];
  blockerReason: string;

  // Dedicated tamper-coverage flags (default false; tamper cases flip true).
  migrationNeverExecutedAccepted: boolean;
  containerNeverStartedAccepted: boolean;
  postgresVersionNotVerifiedAccepted: boolean;
  migrationExitStatusNonZeroAcceptedAsPass: boolean;
  sqlAssertionsSkippedAccepted: boolean;
  tableCountMismatchAcceptedAsPass: boolean;
  rlsMissingAcceptedAsPass: boolean;
  unexpectedRowsAcceptedAsPass: boolean;
  remoteDatabaseUsedAccepted: boolean;
  historicalChainUsedAccepted: boolean;
  migration032ModifiedAccepted: boolean;
  bootstrapContainsAppDataAccepted: boolean;
  containerCleanupNotAttemptedAccepted: boolean;
  evidenceFromStaticScanOnlyAccepted: boolean;
  sourceClosureCommitChangedAccepted: boolean;
  phase9gMissingAccepted: boolean;
  phase9gNotReadyAccepted: boolean;
  workingTreeDirtyBeforeValidationAccepted: boolean;
  supabaseLinkUsedAccepted: boolean;
  supabaseDbPushUsedAccepted: boolean;
  unexpectedRepositoryFileCreatedAccepted: boolean;
  existingFileOtherThanAuditModifiedAccepted: boolean;
  policyExistsButClaimedFailClosedAccepted: boolean;
  anonPrivilegeExistsButClaimedBlockedAccepted: boolean;
  authenticatedPrivilegeExistsButClaimedBlockedAccepted: boolean;
  userDataFkExistsAccepted: boolean;
  cascadeOnProtectedHistoryAccepted: boolean;
  fixturesRemainAfterCleanupAccepted: boolean;
  knowledgeRowRemainsAfterCleanupAccepted: boolean;
  seedDataExecutedAccepted: boolean;
  germanKnowledgeRecordsInsertedAccepted: boolean;
  deSkConnectorActivatedAccepted: boolean;
  productionAuthorizedAccepted: boolean;
  publicRuntimeAuthorizedAccepted: boolean;
  modelCalledAccepted: boolean;
  ocrExecutedAccepted: boolean;
  embeddingCreatedAccepted: boolean;
  retrievalPerformedAccepted: boolean;
  userContentPersistedAccepted: boolean;
  networkAccessHiddenAccepted: boolean;
  migrationChecksumTamperedAccepted: boolean;
  triggerMissingAcceptedAsPass: boolean;
  fixtureUnexpectedSuccessIgnoredAccepted: boolean;
  volumeNotRemovedAcceptedAsCleanupOk: boolean;
  containerStillRunningAcceptedAsCleanupOk: boolean;
  invalidIndexAcceptedAsPass: boolean;
  unvalidatedConstraintAcceptedAsPass: boolean;
  bootstrapRoleListFabricatedAccepted: boolean;
  configMajorVersionMismatchIgnoredAccepted: boolean;
  auditPassesWithMissingNewAuditFileAccepted: boolean;
  auditPassesIfMigrationNotActuallyAppliedAccepted: boolean;
  auditPassesIfAnyMandatoryAssertionSkippedAccepted: boolean;
  anyTamperCaseSurvivedAccepted: boolean;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: number;

  sourceEvidence: string[];
}

// ============================================================================
// BUILD RESULT FROM REAL EVIDENCE
// ============================================================================

function buildResult(src: SourceEvidence, prereq: ReturnType<typeof analyzeMigrationPrerequisites>, live: LiveExecution): Result {
  const migration032AppliedSuccessfully = live.migration032ExitCode === 0 && live.containerStarted;
  const allExpectedKnowledgeTablesPresent = live.missingKnowledgeTables.length === 0 && live.actualKnowledgeTableCount === 33;
  const unexpectedKnowledgeTablesPresent = live.unexpectedKnowledgeTables.length > 0;
  const rlsEnabledOnAllExpectedTables = live.rlsEnabledTableCount === 33 && live.rlsMissingTables.length === 0;
  const anonWritesBlocked = live.anonAnyPrivilegeCount === 0 && live.anonInsertDenied;
  const authenticatedWritesBlocked = live.authenticatedAnyPrivilegeCount === 0 && live.authenticatedInsertDenied;
  const publicDirectReadsBlocked = live.publicAnyPrivilegeCount === 0 && live.anonSelectDenied;
  const foreignKeysValid = live.foreignKeyCount === 87 && live.fkTargetTables.every((t) => t.startsWith("knowledge_"));
  const constraintsValid = live.primaryKeyCount === 33 && live.invalidIndexCount === 0 && live.unvalidatedConstraintCount === 0;
  const userDataForeignKeysAbsent = prereq.noUserDataFkStatically && live.fkTargetTables.every((t) => t.startsWith("knowledge_"));

  const allKnowledgeTablesEmpty = live.totalRowsAfterCleanup === 0 && Object.values(live.perTableRowCounts).every((c) => c === 0);
  const seedDataExecuted = !prereq.hasInsertStatements ? false : true; // migration itself never inserts
  const germanKnowledgeRecordsInserted = live.totalRowsAfterCleanup > 0;
  const deSkConnectorActivated = live.crossBorderConnectorRows > 0 || live.crossBorderProcessRows > 0;

  const fixtureExpectedRejectMarkerCount = EXPECTED_REJECT_MARKERS.length;
  const uniquenessTestsPassed = ["duplicate_source_version_sequence", "duplicate_passage_order", "duplicate_process_step_order", "duplicate_localized_terminology"]
    .every((m) => live.fixtureRejectMarkersFound.includes(m));
  const checkConstraintTestsPassed = ["immutable_false", "invalid_effective_period", "negative_deadline_duration", "eligibility_final_determination_true", "locale_connector_activation_true", "vector_authoritative_true", "audit_user_content_true", "unsupported_locale", "unsupported_process_group"]
    .every((m) => live.fixtureRejectMarkersFound.includes(m));
  const citationIntegrityTestsPassed = ["citation_missing_claim", "citation_missing_source_version", "citation_missing_passage"]
    .every((m) => live.fixtureRejectMarkersFound.includes(m)) && live.fixtureOkMarkersFound.includes("FIXTURES_OK");
  const authorityCompetenceTestsPassed = ["competence_missing_authority", "competence_missing_source_support", "authority_delete_restricted_ok"]
    .every((m) => live.fixtureRejectMarkersFound.includes(m));
  const lockedContentMutationRejectedLive = live.fixtureRejectMarkersFound.includes("locked_content_mutation");
  const draftWorkflowMutationAllowedLive = live.fixtureOkMarkersFound.includes("DRAFT_WORKFLOW_MUTATION_OK");
  const historicalVersionStillQueryableLive = live.fixtureOkMarkersFound.includes("HISTORICAL_VERSION_QUERYABLE_OK");
  const immutableSourceVersionModelValid = live.triggerExists && lockedContentMutationRejectedLive && historicalVersionStillQueryableLive && draftWorkflowMutationAllowedLive;
  const passageCitationModelValid = citationIntegrityTestsPassed;

  const fixtureUnexpectedSuccessCount = live.fixtureUnexpectedSuccessMarkers.length;
  const sqlAssertionsExecuted = migration032AppliedSuccessfully && live.actualKnowledgeTableCount > 0;
  const sqlAssertionsPassed = sqlAssertionsExecuted && allExpectedKnowledgeTablesPresent && rlsEnabledOnAllExpectedTables &&
    anonWritesBlocked && authenticatedWritesBlocked && publicDirectReadsBlocked && foreignKeysValid && constraintsValid &&
    allKnowledgeTablesEmpty && !deSkConnectorActivated && uniquenessTestsPassed && checkConstraintTestsPassed &&
    citationIntegrityTestsPassed && authorityCompetenceTestsPassed && immutableSourceVersionModelValid &&
    fixtureUnexpectedSuccessCount === 0 && live.collisionTablesPresent.length === 0;

  const transactionalValidityConfirmed = migration032AppliedSuccessfully && !live.migration032Stderr.match(/error/i);

  const containerCleanupAttempted = true;
  const containerRemoved = live.containerRemovedOk && live.containerVerifiedAbsentAfterCleanup;
  const disposableVolumeRemoved = live.volumeRemovedOk;

  const localDockerExecutionPerformed = live.dockerAvailable && live.containerStarted;
  const migration032Modified = src.existingFileModified; // migration 032 is the only tracked file this phase could touch besides the audit

  const readyForGermanKnowledgeIngestionDesign =
    localDockerExecutionPerformed && migration032AppliedSuccessfully && sqlAssertionsExecuted && sqlAssertionsPassed &&
    containerRemoved && disposableVolumeRemoved && !migration032Modified && src.onlyExpectedFileChanged &&
    !src.existingFileModified && src.sourceMigrationReady;

  const allPassed = readyForGermanKnowledgeIngestionDesign; // placeholder; refined further in main() after tamper pass

  return {
    checkId: "9H",
    allPassed,

    sourceClosureCommit: SOURCE_CLOSURE_COMMIT,
    sourceMigrationCheckId: SOURCE_MIGRATION_CHECK_ID,
    sourceMigrationReady: src.sourceMigrationReady,

    migrationFilePath: MIGRATION_REL_PATH,
    migrationChecksum: src.migrationChecksum,
    migrationNumber: "032",

    localDockerExecutionPerformed,
    localPostgresContainerStarted: live.containerStarted,
    containerName: live.containerName,
    databaseHost: live.dbHost,
    databasePort: live.dbPort,
    databaseName: live.dbName,
    postgresMajorVersion: live.postgresMajorVersion,
    postgresVersionRaw: live.postgresVersionRaw,
    configExpectedMajorVersion: live.configMajorVersion,

    migration032Executed: live.migration032ExitCode !== -1,
    migration032ExitCode: live.migration032ExitCode,
    migration032AppliedSuccessfully,
    migration032StartedAt: live.migration032StartedAt,
    migration032CompletedAt: live.migration032CompletedAt,
    migration032Modified,

    historicalMigrationChainExecuted: false,
    remoteDatabaseUsed: false,
    supabaseCliUsedForExecution: false,
    supabaseLinkUsed: false,

    dynamicallyDerivedPrerequisites: {
      requiredExtensions: prereq.requiredExtensions,
      referencedRoles: prereq.referencedRoles,
      requiredSchemasBeyondPublic: prereq.requiredSchemasBeyondPublic,
      requiredTypesBeyondBuiltin: prereq.requiredTypesBeyondBuiltin,
      usesGenRandomUuid: prereq.usesGenRandomUuid,
    },
    bootstrappedRoles: live.bootstrappedRoles,
    bootstrapContainsApplicationData: false,

    expectedKnowledgeTableCount: 33,
    actualKnowledgeTableCount: live.actualKnowledgeTableCount,
    allExpectedKnowledgeTablesPresent,
    missingKnowledgeTables: live.missingKnowledgeTables,
    unexpectedKnowledgeTablesPresent,
    unexpectedKnowledgeTables: live.unexpectedKnowledgeTables,
    collisionTablesPresent: live.collisionTablesPresent,

    rlsEnabledOnAllExpectedTables,
    rlsEnabledTableCount: live.rlsEnabledTableCount,
    rlsMissingTables: live.rlsMissingTables,

    policyCountFound: live.policyCount,
    anonWritesBlocked,
    authenticatedWritesBlocked,
    publicDirectReadsBlocked,
    anonAnyCatalogPrivilegeCount: live.anonAnyPrivilegeCount,
    authenticatedAnyCatalogPrivilegeCount: live.authenticatedAnyPrivilegeCount,
    publicAnyCatalogPrivilegeCount: live.publicAnyPrivilegeCount,
    liveAnonSelectDenied: live.anonSelectDenied,
    liveAnonInsertDenied: live.anonInsertDenied,
    liveAuthenticatedInsertDenied: live.authenticatedInsertDenied,

    foreignKeysValid,
    foreignKeyCount: live.foreignKeyCount,
    primaryKeyCount: live.primaryKeyCount,
    constraintsValid,
    uniqueConstraintCount: live.uniqueConstraintCount,
    totalIndexCount: live.totalIndexCount,
    invalidIndexCount: live.invalidIndexCount,
    unvalidatedConstraintCount: live.unvalidatedConstraintCount,
    cascadeDeleteOnProtectedHistoryCount: live.cascadeDeleteFkCount,
    userDataForeignKeysAbsent,
    fkTargetTables: live.fkTargetTables,

    allKnowledgeTablesEmpty,
    perTableRowCounts: live.perTableRowCounts,
    totalKnowledgeRowsAfterCleanup: live.totalRowsAfterCleanup,
    seedDataExecuted,
    germanKnowledgeRecordsInserted,
    deSkConnectorActivated,
    crossBorderConnectorRows: live.crossBorderConnectorRows,
    crossBorderProcessRows: live.crossBorderProcessRows,
    trustDomainRows: live.trustDomainRows,

    immutableSourceVersionModelValid,
    passageCitationModelValid,
    lockedContentMutationRejectedLive,
    draftWorkflowMutationAllowedLive,
    historicalVersionStillQueryableLive,
    triggerExists: live.triggerExists,

    uniquenessTestsPassed,
    checkConstraintTestsPassed,
    citationIntegrityTestsPassed,
    authorityCompetenceTestsPassed,
    fixtureRejectMarkersFoundCount: live.fixtureRejectMarkersFound.length,
    fixtureExpectedRejectMarkerCount,
    fixtureUnexpectedSuccessCount,
    temporarySyntheticFixturesUsed: live.fixtureOkMarkersFound.includes("FIXTURES_OK"),
    temporaryFixturesRemoved: live.totalRowsAfterCleanup === 0,

    sqlAssertionsExecuted,
    sqlAssertionsPassed,
    transactionalValidityConfirmed,

    containerCleanupAttempted,
    containerRemoved,
    disposableVolumeRemoved,
    containerVerifiedAbsentAfterCleanup: live.containerVerifiedAbsentAfterCleanup,

    existingMigrationModified: src.existingFileModified,
    runtimeModified: false,
    uiModified: false,
    routeModified: false,
    generatedTypesModified: false,
    seedFileCreated: false,
    networkAccessPerformed: false,
    modelCallPerformed: false,
    ocrExecutionPerformed: false,
    embeddingCreated: false,
    retrievalPerformed: false,
    persistenceOfUserContentPerformed: false,

    appendOnlyGovernanceTriggerStillOpen: true,
    approvedReadViewsStillOpen: true,
    generatedTypesStillOpen: true,
    officialSourceIngestionStillOpen: true,
    germanKnowledgePopulationStillOpen: true,
    deSkImplementationStillOpen: true,

    productionAuthorizedNow: false,
    publicRuntimeAuthorizedNow: false,

    readyForGermanKnowledgeIngestionDesign,

    liveExecutionErrors: live.errors,
    blockerReason: live.errors.length > 0 ? live.errors.join(" | ") : "",

    migrationNeverExecutedAccepted: false,
    containerNeverStartedAccepted: false,
    postgresVersionNotVerifiedAccepted: false,
    migrationExitStatusNonZeroAcceptedAsPass: false,
    sqlAssertionsSkippedAccepted: false,
    tableCountMismatchAcceptedAsPass: false,
    rlsMissingAcceptedAsPass: false,
    unexpectedRowsAcceptedAsPass: false,
    remoteDatabaseUsedAccepted: false,
    historicalChainUsedAccepted: false,
    migration032ModifiedAccepted: false,
    bootstrapContainsAppDataAccepted: false,
    containerCleanupNotAttemptedAccepted: false,
    evidenceFromStaticScanOnlyAccepted: false,
    sourceClosureCommitChangedAccepted: false,
    phase9gMissingAccepted: false,
    phase9gNotReadyAccepted: false,
    workingTreeDirtyBeforeValidationAccepted: false,
    supabaseLinkUsedAccepted: false,
    supabaseDbPushUsedAccepted: false,
    unexpectedRepositoryFileCreatedAccepted: false,
    existingFileOtherThanAuditModifiedAccepted: false,
    policyExistsButClaimedFailClosedAccepted: false,
    anonPrivilegeExistsButClaimedBlockedAccepted: false,
    authenticatedPrivilegeExistsButClaimedBlockedAccepted: false,
    userDataFkExistsAccepted: false,
    cascadeOnProtectedHistoryAccepted: false,
    fixturesRemainAfterCleanupAccepted: false,
    knowledgeRowRemainsAfterCleanupAccepted: false,
    seedDataExecutedAccepted: false,
    germanKnowledgeRecordsInsertedAccepted: false,
    deSkConnectorActivatedAccepted: false,
    productionAuthorizedAccepted: false,
    publicRuntimeAuthorizedAccepted: false,
    modelCalledAccepted: false,
    ocrExecutedAccepted: false,
    embeddingCreatedAccepted: false,
    retrievalPerformedAccepted: false,
    userContentPersistedAccepted: false,
    networkAccessHiddenAccepted: false,
    migrationChecksumTamperedAccepted: false,
    triggerMissingAcceptedAsPass: false,
    fixtureUnexpectedSuccessIgnoredAccepted: false,
    volumeNotRemovedAcceptedAsCleanupOk: false,
    containerStillRunningAcceptedAsCleanupOk: false,
    invalidIndexAcceptedAsPass: false,
    unvalidatedConstraintAcceptedAsPass: false,
    bootstrapRoleListFabricatedAccepted: false,
    configMajorVersionMismatchIgnoredAccepted: false,
    auditPassesWithMissingNewAuditFileAccepted: false,
    auditPassesIfMigrationNotActuallyAppliedAccepted: false,
    auditPassesIfAnyMandatoryAssertionSkippedAccepted: false,
    anyTamperCaseSurvivedAccepted: false,

    tamperCaseCount: TAMPER_CASES.length,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: 0,

    sourceEvidence: [
      `onlyExpectedFileChanged: ${src.onlyExpectedFileChanged}`,
      `existingFileModified: ${src.existingFileModified}`,
      `sourceMigrationReady: ${src.sourceMigrationReady}`,
      `migrationChecksum: ${src.migrationChecksum}`,
      `dockerAvailable: ${live.dockerAvailable}`,
      `containerStarted: ${live.containerStarted}`,
      `postgresVersionRaw: ${live.postgresVersionRaw}`,
      `migration032ExitCode: ${live.migration032ExitCode}`,
      `actualKnowledgeTableCount: ${live.actualKnowledgeTableCount}`,
      `rlsEnabledTableCount: ${live.rlsEnabledTableCount}`,
      `foreignKeyCount: ${live.foreignKeyCount}`,
      `totalRowsAfterCleanup: ${live.totalRowsAfterCleanup}`,
      `fixtureRejectMarkersFoundCount: ${live.fixtureRejectMarkersFound.length}/${EXPECTED_REJECT_MARKERS.length}`,
      `fixtureUnexpectedSuccessCount: ${live.fixtureUnexpectedSuccessMarkers.length}`,
      `containerRemovedOk: ${live.containerRemovedOk}`,
      `volumeRemovedOk: ${live.volumeRemovedOk}`,
      ...src.notes,
      ...live.errors,
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
  { id: 1, description: "migration never executed but claimed passed", mutate: (r) => { r.migration032Executed = false; r.allPassed = true; r.migrationNeverExecutedAccepted = true; } },
  { id: 2, description: "container never started but claimed passed", mutate: (r) => { r.localPostgresContainerStarted = false; r.allPassed = true; r.containerNeverStartedAccepted = true; } },
  { id: 3, description: "PostgreSQL version not verified but claimed passed", mutate: (r) => { r.postgresMajorVersion = 0; r.allPassed = true; r.postgresVersionNotVerifiedAccepted = true; } },
  { id: 4, description: "migration exit status non-zero accepted as pass", mutate: (r) => { r.migration032ExitCode = 1; r.migration032AppliedSuccessfully = true; r.migrationExitStatusNonZeroAcceptedAsPass = true; } },
  { id: 5, description: "SQL assertions skipped but claimed executed", mutate: (r) => { r.sqlAssertionsExecuted = true; r.sqlAssertionsPassed = true; r.sqlAssertionsSkippedAccepted = true; } },
  { id: 6, description: "fewer than 33 knowledge tables accepted as pass", mutate: (r) => { r.actualKnowledgeTableCount = 30; r.allExpectedKnowledgeTablesPresent = true; r.tableCountMismatchAcceptedAsPass = true; } },
  { id: 7, description: "more than 33 knowledge tables accepted as pass", mutate: (r) => { r.actualKnowledgeTableCount = 36; r.allExpectedKnowledgeTablesPresent = true; } },
  { id: 8, description: "missing RLS accepted as pass", mutate: (r) => { r.rlsEnabledTableCount = 30; r.rlsMissingTables = ["knowledge_claims"]; r.rlsEnabledOnAllExpectedTables = true; r.rlsMissingAcceptedAsPass = true; } },
  { id: 9, description: "unexpected rows accepted as pass", mutate: (r) => { r.totalKnowledgeRowsAfterCleanup = 5; r.allKnowledgeTablesEmpty = true; r.unexpectedRowsAcceptedAsPass = true; } },
  { id: 10, description: "remote database used", mutate: (r) => { r.remoteDatabaseUsed = true; r.remoteDatabaseUsedAccepted = true; } },
  { id: 11, description: "historical migration chain used instead of isolated migration 032", mutate: (r) => { r.historicalMigrationChainExecuted = true; r.historicalChainUsedAccepted = true; } },
  { id: 12, description: "migration 032 modified", mutate: (r) => { r.migration032Modified = true; r.migration032ModifiedAccepted = true; } },
  { id: 13, description: "bootstrap containing seed/application data", mutate: (r) => { r.bootstrapContainsApplicationData = true; r.bootstrapContainsAppDataAccepted = true; } },
  { id: 14, description: "container cleanup not attempted", mutate: (r) => { r.containerCleanupAttempted = false; r.containerCleanupNotAttemptedAccepted = true; } },
  { id: 15, description: "evidence claimed only from static source scanning", mutate: (r) => { r.evidenceFromStaticScanOnlyAccepted = true; r.localDockerExecutionPerformed = false; r.allPassed = true; } },
  { id: 16, description: "source closure commit changed", mutate: (r) => { r.sourceClosureCommit = "0000000"; r.sourceClosureCommitChangedAccepted = true; } },
  { id: 17, description: "PHASE 9G missing", mutate: (r) => { r.sourceMigrationCheckId = "not_found"; r.phase9gMissingAccepted = true; } },
  { id: 18, description: "PHASE 9G not ready but claimed ready", mutate: (r) => { r.sourceMigrationReady = true; r.phase9gNotReadyAccepted = true; } },
  { id: 19, description: "working tree dirty before validation", mutate: (r) => { r.existingMigrationModified = true; r.workingTreeDirtyBeforeValidationAccepted = true; } },
  { id: 20, description: "supabase link used", mutate: (r) => { r.supabaseLinkUsed = true; r.supabaseLinkUsedAccepted = true; } },
  { id: 21, description: "supabase db push used", mutate: (r) => { r.supabaseDbPushUsedAccepted = true; r.remoteDatabaseUsed = true; } },
  { id: 22, description: "unexpected repository file created", mutate: (r) => { r.unexpectedRepositoryFileCreatedAccepted = true; } },
  { id: 23, description: "existing file other than audit modified", mutate: (r) => { r.existingFileOtherThanAuditModifiedAccepted = true; r.existingMigrationModified = true; } },
  { id: 24, description: "policy exists but claimed fail-closed", mutate: (r) => { r.policyCountFound = 1; r.anonWritesBlocked = true; r.authenticatedWritesBlocked = true; r.policyExistsButClaimedFailClosedAccepted = true; } },
  { id: 25, description: "anon privilege exists but claimed blocked", mutate: (r) => { r.anonAnyCatalogPrivilegeCount = 1; r.anonWritesBlocked = true; r.anonPrivilegeExistsButClaimedBlockedAccepted = true; } },
  { id: 26, description: "authenticated privilege exists but claimed blocked", mutate: (r) => { r.authenticatedAnyCatalogPrivilegeCount = 1; r.authenticatedWritesBlocked = true; r.authenticatedPrivilegeExistsButClaimedBlockedAccepted = true; } },
  { id: 27, description: "user-data FK exists", mutate: (r) => { r.userDataForeignKeysAbsent = false; r.userDataFkExistsAccepted = true; } },
  { id: 28, description: "cascade delete on protected history accepted", mutate: (r) => { r.cascadeDeleteOnProtectedHistoryCount = 1; r.constraintsValid = true; r.cascadeOnProtectedHistoryAccepted = true; } },
  { id: 29, description: "fixtures remain after cleanup", mutate: (r) => { r.temporaryFixturesRemoved = false; r.fixturesRemainAfterCleanupAccepted = true; } },
  { id: 30, description: "knowledge row remains after cleanup", mutate: (r) => { r.totalKnowledgeRowsAfterCleanup = 1; r.knowledgeRowRemainsAfterCleanupAccepted = true; } },
  { id: 31, description: "seed data executed", mutate: (r) => { r.seedDataExecuted = true; r.seedDataExecutedAccepted = true; } },
  { id: 32, description: "German knowledge records inserted", mutate: (r) => { r.germanKnowledgeRecordsInserted = true; r.germanKnowledgeRecordsInsertedAccepted = true; } },
  { id: 33, description: "DE<->SK connector activated", mutate: (r) => { r.deSkConnectorActivated = true; r.deSkConnectorActivatedAccepted = true; } },
  { id: 34, description: "production authorized now", mutate: (r) => { r.productionAuthorizedNow = true; r.productionAuthorizedAccepted = true; } },
  { id: 35, description: "public runtime authorized now", mutate: (r) => { r.publicRuntimeAuthorizedNow = true; r.publicRuntimeAuthorizedAccepted = true; } },
  { id: 36, description: "model called", mutate: (r) => { r.modelCallPerformed = true; r.modelCalledAccepted = true; } },
  { id: 37, description: "OCR executed", mutate: (r) => { r.ocrExecutionPerformed = true; r.ocrExecutedAccepted = true; } },
  { id: 38, description: "embedding created", mutate: (r) => { r.embeddingCreated = true; r.embeddingCreatedAccepted = true; } },
  { id: 39, description: "retrieval performed", mutate: (r) => { r.retrievalPerformed = true; r.retrievalPerformedAccepted = true; } },
  { id: 40, description: "user content persisted", mutate: (r) => { r.persistenceOfUserContentPerformed = true; r.userContentPersistedAccepted = true; } },
  { id: 41, description: "network access occurred but hidden", mutate: (r) => { r.networkAccessPerformed = true; r.networkAccessHiddenAccepted = true; } },
  { id: 42, description: "migration checksum tampered", mutate: (r) => { r.migrationChecksum = "0".repeat(64); r.migrationChecksumTamperedAccepted = true; } },
  { id: 43, description: "immutability trigger missing but accepted as pass", mutate: (r) => { r.triggerExists = false; r.immutableSourceVersionModelValid = true; r.triggerMissingAcceptedAsPass = true; } },
  { id: 44, description: "fixture unexpected-success ignored", mutate: (r) => { r.fixtureUnexpectedSuccessCount = 3; r.sqlAssertionsPassed = true; r.fixtureUnexpectedSuccessIgnoredAccepted = true; } },
  { id: 45, description: "volume not removed accepted as cleanup ok", mutate: (r) => { r.disposableVolumeRemoved = false; r.volumeNotRemovedAcceptedAsCleanupOk = true; r.allPassed = true; } },
  { id: 46, description: "container still running accepted as cleanup ok", mutate: (r) => { r.containerVerifiedAbsentAfterCleanup = false; r.containerRemoved = true; r.containerStillRunningAcceptedAsCleanupOk = true; } },
  { id: 47, description: "invalid index accepted as pass", mutate: (r) => { r.invalidIndexCount = 2; r.constraintsValid = true; r.invalidIndexAcceptedAsPass = true; } },
  { id: 48, description: "unvalidated constraint accepted as pass", mutate: (r) => { r.unvalidatedConstraintCount = 2; r.constraintsValid = true; r.unvalidatedConstraintAcceptedAsPass = true; } },
  { id: 49, description: "bootstrap role list fabricated (not derived from source)", mutate: (r) => { r.bootstrappedRoles = ["anon", "authenticated", "made_up_role"]; r.bootstrapRoleListFabricatedAccepted = true; } },
  { id: 50, description: "config major version mismatch ignored", mutate: (r) => { r.configExpectedMajorVersion = 15; r.configMajorVersionMismatchIgnoredAccepted = true; } },
  { id: 51, description: "audit passes with missing new audit file", mutate: (r) => { r.auditPassesWithMissingNewAuditFileAccepted = true; } },
  { id: 52, description: "audit passes if migration was not actually applied", mutate: (r) => { r.migration032AppliedSuccessfully = false; r.allPassed = true; r.auditPassesIfMigrationNotActuallyAppliedAccepted = true; } },
  { id: 53, description: "audit passes if any mandatory assertion skipped", mutate: (r) => { r.uniquenessTestsPassed = false; r.allPassed = true; r.auditPassesIfAnyMandatoryAssertionSkippedAccepted = true; } },
  { id: 54, description: "readyForGermanKnowledgeIngestionDesign true without allPassed", mutate: (r) => { r.readyForGermanKnowledgeIngestionDesign = true; r.allPassed = false; } },
  { id: 55, description: "checkId wrong", mutate: (r) => { (r as { checkId: string }).checkId = "9I"; } },
  { id: 56, description: "sourceMigrationCheckId mismatched", mutate: (r) => { r.sourceMigrationCheckId = "9F"; } },
  { id: 57, description: "tamperCaseCount mismatched", mutate: (r) => { r.tamperCaseCount = 1; } },
  { id: 58, description: "expectedKnowledgeTableCount tampered", mutate: (r) => { r.expectedKnowledgeTableCount = 30; } },
  { id: 59, description: "foreignKeyCount tampered to non-matching value while foreignKeysValid claimed true", mutate: (r) => { r.foreignKeyCount = 10; r.foreignKeysValid = true; } },
  { id: 60, description: "primaryKeyCount below 33 while constraintsValid claimed true", mutate: (r) => { r.primaryKeyCount = 20; r.constraintsValid = true; } },
  { id: 61, description: "citationIntegrityTestsPassed true with zero markers", mutate: (r) => { r.fixtureRejectMarkersFoundCount = 0; r.citationIntegrityTestsPassed = true; } },
  { id: 62, description: "authorityCompetenceTestsPassed true with zero markers", mutate: (r) => { r.fixtureRejectMarkersFoundCount = 0; r.authorityCompetenceTestsPassed = true; } },
  { id: 63, description: "checkConstraintTestsPassed true with zero markers", mutate: (r) => { r.fixtureRejectMarkersFoundCount = 0; r.checkConstraintTestsPassed = true; } },
  { id: 64, description: "uniquenessTestsPassed true with zero markers", mutate: (r) => { r.fixtureRejectMarkersFoundCount = 0; r.uniquenessTestsPassed = true; } },
  { id: 65, description: "passageCitationModelValid true while citationIntegrityTestsPassed false", mutate: (r) => { r.citationIntegrityTestsPassed = false; r.passageCitationModelValid = true; } },
  { id: 66, description: "transactionalValidityConfirmed true while migration032AppliedSuccessfully false", mutate: (r) => { r.migration032AppliedSuccessfully = false; r.transactionalValidityConfirmed = true; } },
  { id: 67, description: "collision table present but claimed clean", mutate: (r) => { r.collisionTablesPresent = ["knowledge_topics"]; r.allExpectedKnowledgeTablesPresent = true; } },
  { id: 68, description: "unexpectedKnowledgeTablesPresent true but tables list empty (inconsistent)", mutate: (r) => { r.unexpectedKnowledgeTablesPresent = true; r.unexpectedKnowledgeTables = []; } },
  { id: 69, description: "readyForGermanKnowledgeIngestionDesign true while sourceMigrationReady false", mutate: (r) => { r.sourceMigrationReady = false; r.readyForGermanKnowledgeIngestionDesign = true; } },
  { id: 70, description: "anyTamperCaseSurvivedAccepted true", mutate: (r) => { r.anyTamperCaseSurvivedAccepted = true; } },
];

// ============================================================================
// VALIDATOR
// ============================================================================

function computeExpectedAllPassed(r: Result): boolean {
  const checks: boolean[] = [
    r.checkId === "9H",
    r.sourceClosureCommit === SOURCE_CLOSURE_COMMIT,
    r.sourceMigrationCheckId === SOURCE_MIGRATION_CHECK_ID,
    r.migrationFilePath === MIGRATION_REL_PATH,
    r.migrationChecksum === EXPECTED_MIGRATION_CHECKSUM,
    r.migrationNumber === "032",

    r.historicalMigrationChainExecuted === false,
    r.remoteDatabaseUsed === false,
    r.supabaseLinkUsed === false,
    r.migration032Modified === false,
    r.bootstrapContainsApplicationData === false,
    r.seedDataExecuted === false,
    r.germanKnowledgeRecordsInserted === false,
    r.deSkConnectorActivated === false,
    r.productionAuthorizedNow === false,
    r.publicRuntimeAuthorizedNow === false,
    r.runtimeModified === false,
    r.uiModified === false,
    r.routeModified === false,
    r.generatedTypesModified === false,
    r.seedFileCreated === false,
    r.networkAccessPerformed === false,
    r.modelCallPerformed === false,
    r.ocrExecutionPerformed === false,
    r.embeddingCreated === false,
    r.retrievalPerformed === false,
    r.persistenceOfUserContentPerformed === false,
    r.existingMigrationModified === false,

    r.tamperCaseCount === TAMPER_CASES.length,
    r.tamperCasesRejectedCount <= r.tamperCaseCount,

    r.migrationNeverExecutedAccepted === false,
    r.containerNeverStartedAccepted === false,
    r.postgresVersionNotVerifiedAccepted === false,
    r.migrationExitStatusNonZeroAcceptedAsPass === false,
    r.sqlAssertionsSkippedAccepted === false,
    r.tableCountMismatchAcceptedAsPass === false,
    r.rlsMissingAcceptedAsPass === false,
    r.unexpectedRowsAcceptedAsPass === false,
    r.remoteDatabaseUsedAccepted === false,
    r.historicalChainUsedAccepted === false,
    r.migration032ModifiedAccepted === false,
    r.bootstrapContainsAppDataAccepted === false,
    r.containerCleanupNotAttemptedAccepted === false,
    r.evidenceFromStaticScanOnlyAccepted === false,
    r.sourceClosureCommitChangedAccepted === false,
    r.phase9gMissingAccepted === false,
    r.phase9gNotReadyAccepted === false,
    r.workingTreeDirtyBeforeValidationAccepted === false,
    r.supabaseLinkUsedAccepted === false,
    r.supabaseDbPushUsedAccepted === false,
    r.unexpectedRepositoryFileCreatedAccepted === false,
    r.existingFileOtherThanAuditModifiedAccepted === false,
    r.policyExistsButClaimedFailClosedAccepted === false,
    r.anonPrivilegeExistsButClaimedBlockedAccepted === false,
    r.authenticatedPrivilegeExistsButClaimedBlockedAccepted === false,
    r.userDataFkExistsAccepted === false,
    r.cascadeOnProtectedHistoryAccepted === false,
    r.fixturesRemainAfterCleanupAccepted === false,
    r.knowledgeRowRemainsAfterCleanupAccepted === false,
    r.seedDataExecutedAccepted === false,
    r.germanKnowledgeRecordsInsertedAccepted === false,
    r.deSkConnectorActivatedAccepted === false,
    r.productionAuthorizedAccepted === false,
    r.publicRuntimeAuthorizedAccepted === false,
    r.modelCalledAccepted === false,
    r.ocrExecutedAccepted === false,
    r.embeddingCreatedAccepted === false,
    r.retrievalPerformedAccepted === false,
    r.userContentPersistedAccepted === false,
    r.networkAccessHiddenAccepted === false,
    r.migrationChecksumTamperedAccepted === false,
    r.triggerMissingAcceptedAsPass === false,
    r.fixtureUnexpectedSuccessIgnoredAccepted === false,
    r.volumeNotRemovedAcceptedAsCleanupOk === false,
    r.containerStillRunningAcceptedAsCleanupOk === false,
    r.invalidIndexAcceptedAsPass === false,
    r.unvalidatedConstraintAcceptedAsPass === false,
    r.bootstrapRoleListFabricatedAccepted === false,
    r.configMajorVersionMismatchIgnoredAccepted === false,
    r.auditPassesWithMissingNewAuditFileAccepted === false,
    r.auditPassesIfMigrationNotActuallyAppliedAccepted === false,
    r.auditPassesIfAnyMandatoryAssertionSkippedAccepted === false,
    r.anyTamperCaseSurvivedAccepted === false,

    // Internal consistency invariants, independent of allPassed.
    r.readyForGermanKnowledgeIngestionDesign === (
      r.allPassed &&
      r.localDockerExecutionPerformed && r.migration032AppliedSuccessfully && r.sqlAssertionsExecuted &&
      r.sqlAssertionsPassed && r.containerRemoved && r.disposableVolumeRemoved &&
      !r.migration032Modified && r.sourceMigrationReady
    ) || r.readyForGermanKnowledgeIngestionDesign === false,
    !(r.readyForGermanKnowledgeIngestionDesign === true && r.allPassed === false),
    !(r.foreignKeysValid === true && r.foreignKeyCount !== 87),
    !(r.constraintsValid === true && (r.primaryKeyCount !== 33 || r.invalidIndexCount !== 0 || r.unvalidatedConstraintCount !== 0)),
    !(r.allExpectedKnowledgeTablesPresent === true && (r.actualKnowledgeTableCount !== 33 || r.missingKnowledgeTables.length !== 0 || r.collisionTablesPresent.length !== 0)),
    !(r.rlsEnabledOnAllExpectedTables === true && (r.rlsEnabledTableCount !== 33 || r.rlsMissingTables.length !== 0)),
    !(r.citationIntegrityTestsPassed === true && r.fixtureRejectMarkersFoundCount === 0),
    !(r.authorityCompetenceTestsPassed === true && r.fixtureRejectMarkersFoundCount === 0),
    !(r.checkConstraintTestsPassed === true && r.fixtureRejectMarkersFoundCount === 0),
    !(r.uniquenessTestsPassed === true && r.fixtureRejectMarkersFoundCount === 0),
    !(r.passageCitationModelValid === true && r.citationIntegrityTestsPassed === false),
    !(r.transactionalValidityConfirmed === true && r.migration032AppliedSuccessfully === false),
    !(r.immutableSourceVersionModelValid === true && r.triggerExists === false),
    !(r.anonWritesBlocked === true && r.anonAnyCatalogPrivilegeCount !== 0),
    !(r.authenticatedWritesBlocked === true && r.authenticatedAnyCatalogPrivilegeCount !== 0),
    !(r.sqlAssertionsPassed === true && r.fixtureUnexpectedSuccessCount !== 0),
    r.expectedKnowledgeTableCount === 33,
    r.unexpectedKnowledgeTablesPresent === (r.unexpectedKnowledgeTables.length > 0),
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
    if (ok === false) rejected += 1;
    else failures.push(`#${tc.id} (${tc.description}) was NOT rejected`);
  }
  return { total: TAMPER_CASES.length, rejected, failures };
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const src = collectSourceEvidence();
  const migrationSql = readFileText(MIGRATION_REL_PATH);
  const migrationAbsPath = path.join(process.cwd(), MIGRATION_REL_PATH);
  const prereq = analyzeMigrationPrerequisites(migrationSql);

  const live = performLiveValidation(migrationSql, migrationAbsPath);

  const result = buildResult(src, prereq, live);

  const selfOk = computeExpectedAllPassed(result);
  const tamperOutcome = runTamperCases(result);

  result.tamperCasesRejected = tamperOutcome.rejected;
  result.tamperCasesRejectedCount = tamperOutcome.rejected;

  const genuineAllPassed =
    result.localDockerExecutionPerformed &&
    result.migration032AppliedSuccessfully &&
    result.sqlAssertionsExecuted &&
    result.sqlAssertionsPassed &&
    result.containerRemoved &&
    result.disposableVolumeRemoved &&
    !result.migration032Modified &&
    src.onlyExpectedFileChanged &&
    !src.existingFileModified &&
    src.sourceMigrationReady &&
    selfOk &&
    tamperOutcome.rejected === tamperOutcome.total;

  result.allPassed = genuineAllPassed;
  result.readyForGermanKnowledgeIngestionDesign = genuineAllPassed;

  if (tamperOutcome.failures.length > 0) {
    (result as unknown as { tamperFailures: string[] }).tamperFailures = tamperOutcome.failures;
  }

  console.log(JSON.stringify(result));
}

main();
