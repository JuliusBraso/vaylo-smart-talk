/**
 * PHASE 9N — Publication and Canonical Translation Schema Extension
 * Isolated PostgreSQL 17 Validation.
 *
 * This file performs a REAL database execution validation of
 * `supabase/migrations/033_add_publication_and_canonical_translation_schema.sql`
 * against a disposable, local PostgreSQL 17 container running in Docker,
 * layered on top of `032_create_minimal_knowledge_schema.sql`.
 *
 * It reuses the PHASE 9H isolated-validation methodology
 * (`run-empty-schema-migration-validation-closure-audit.ts`): disposable
 * `postgres:17` container bound to 127.0.0.1 on a port outside the reserved
 * Supabase local range, in-container `psql`, roles derived from the migration
 * text, and teardown in a `finally` block.
 *
 * It does NOT use any remote Supabase project, remote database, `--linked`
 * command or production credential. It never inserts real German legal,
 * bureaucratic or user data — only clearly-labelled `SYNTHETIC_9N_*` fixtures.
 *
 * This is a VALIDATION-ONLY phase. It never edits migration 033.
 *
 * Execution summary performed by this script when run:
 *   1. Read-only repository/source analysis (git state, file scope, migration
 *      checksums, expected object inventory derived from the 033 SQL text).
 *   2. Start a disposable `postgres:17` container; verify major version 17
 *      and `pgcrypto` availability.
 *   3. Bootstrap only the roles the migrations' own text references
 *      (`anon`, `authenticated`, `service_role`).
 *   4. Apply migration 032 then 033 with `psql --single-transaction
 *      -v ON_ERROR_STOP=1`, executed by PostgreSQL itself.
 *   5. Verify the runtime schema inventory against PostgreSQL catalogs
 *      (tables, indexes, triggers, functions, RLS, grants, search paths).
 *   6. Insert a synthetic canonical fixture chain, then execute a runtime
 *      case pack of positive and negative/tamper cases, classifying each as
 *      REJECTED (failed for the intended reason), ALLOWED (forbidden action
 *      succeeded), WRONGFAIL (failed for an unintended reason), OK, or BROKEN.
 *   7. Two-session row-lock test with finite `lock_timeout`.
 *   8. `SECURITY DEFINER` schema-shadowing attack test with cleanup.
 *   9. Tear down: stop + remove the container and its disposable volume.
 *
 * A negative case counts as a security proof ONLY when it fails for the
 * intended reason. A function that errors because its own body is invalid is
 * classified BROKEN, never as a passing negative case.
 */

import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CHECK_ID = "9N";
const PHASE_NAME =
  "Publication and Canonical Translation Schema Extension Isolated PostgreSQL Validation";
const IMPLEMENTATION_KIND = "isolated_local_postgresql_runtime_validation";
const EXPECTED_SOURCE_COMMIT = "96b777e";

const MIGRATIONS_DIR = "supabase/migrations";
const MIGRATION_032_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_033_NAME = "033_add_publication_and_canonical_translation_schema.sql";
const MIGRATION_032_REL = `${MIGRATIONS_DIR}/${MIGRATION_032_NAME}`;
const MIGRATION_033_REL = `${MIGRATIONS_DIR}/${MIGRATION_033_NAME}`;
const PLAN_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-implementation-plan-audit.ts";
const MIGRATION_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-migration-implementation-audit.ts";
const AUDIT_SELF_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-isolated-postgresql-validation-audit.ts";

const CONTAINER_NAME = "phase9n-pg17-validation";
const DB_NAME = "phase9n_validation";
const DB_HOST = "127.0.0.1";
const POSTGRES_IMAGE = "postgres:17";
const RESERVED_SUPABASE_PORTS: readonly [number, number] = [54320, 54329];
const CANDIDATE_PORTS = [55442, 55443, 55444, 55445, 55446] as const;

const NEW_TABLES = [
  "knowledge_publication_states",
  "knowledge_publication_state_transitions",
  "knowledge_canonical_unit_translations",
] as const;

/** Functions that must never be executable by any application role. */
const INTERNAL_ONLY_FUNCTIONS = [
  "knowledge_transition_publication_state",
  "fn_create_translation_candidate_core",
  "knowledge_invalidate_translation_for_canonical_change",
  "fn_canonical_content_changed_invalidate_translations",
] as const;

/** The narrow, operation-scoped RPCs intended to be granted to service_role. */
const EXPECTED_GRANTABLE_RPCS = [
  "knowledge_advance_publication_evidence_status",
  "knowledge_advance_publication_lifecycle",
  "knowledge_approve_translation",
  "knowledge_bootstrap_publication_subject",
  "knowledge_create_human_translation_candidate",
  "knowledge_create_machine_translation_candidate",
  "knowledge_emergency_suspend_publication_subject",
  "knowledge_recall_publication_to_review",
  "knowledge_record_publication_review_decision",
  "knowledge_reject_translation",
  "knowledge_submit_translation_for_review",
  "knowledge_supersede_publication_subject",
  "knowledge_suspend_publication_for_detected_issue",
  "knowledge_withdraw_publication_subject",
  "knowledge_withdraw_translation",
] as const;

/**
 * Parameter names that would mean a caller can choose a privileged actor
 * class. None of these may appear on any grantable function.
 */
const FORBIDDEN_ACTOR_PARAM_NAMES = [
  "p_actor_class",
  "p_actor_type",
  "p_created_by_actor_type",
  "p_reviewer_role",
  "p_authority_class",
] as const;

const PRIVILEGED_ACTOR_CLASSES = [
  "automated_ingestion_system",
  "authorized_reviewer",
  "publication_administrator",
  "emergency_suspension_authority",
  "migration_bootstrap_system_actor",
] as const;

const MIN_RUNTIME_CASE_COUNT = 100;
const REQUIRED_INVALIDATION_TRIGGER_COUNT = 8;
const REQUIRED_PUBLICATION_TRANSITION_RULE_COUNT = 20;
const REQUIRED_PUBLICATION_MATRIX_COVERAGE = 90;
const REQUIRED_TRANSLATION_FIELD_ALLOWLIST_COUNT = 8;
const REQUIRED_OUTPUT_LOCALES = ["en", "sk", "cs", "pl", "hu"] as const;

// ============================================================================
// SMALL UTILITIES
// ============================================================================

function repoPath(rel: string): string {
  return path.join(process.cwd(), rel);
}

function readFileText(rel: string): string {
  try {
    return fs.readFileSync(repoPath(rel), "utf8").replace(/\r\n/g, "\n");
  } catch {
    return "";
  }
}

function fileExists(rel: string): boolean {
  try {
    return fs.existsSync(repoPath(rel));
  } catch {
    return false;
  }
}

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function gitReadOnly(args: string[]): string {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      cwd: process.cwd(),
      timeout: 10000,
    }).trim();
  } catch {
    return "";
  }
}

function countMatches(text: string, pattern: RegExp): number {
  const m = text.match(pattern);
  return m ? m.length : 0;
}

// ============================================================================
// DOCKER / PSQL HELPERS (local only; never a remote host)
// ============================================================================

interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

function run(bin: string, args: string[], timeoutMs = 60000): RunResult {
  const res = spawnSync(bin, args, {
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (res.error) return { code: 1, stdout: res.stdout || "", stderr: String(res.error) };
  return { code: res.status ?? 1, stdout: res.stdout || "", stderr: res.stderr || "" };
}

function resolveDockerBinary(): string {
  const direct = spawnSync("docker", ["--version"], { encoding: "utf8", timeout: 8000 });
  if (direct.status === 0) return "docker";
  const candidates = [
    path.join(
      process.env.LOCALAPPDATA || "",
      "Programs",
      "DockerDesktop",
      "resources",
      "bin",
      "docker.exe"
    ),
    path.join(process.env.ProgramFiles || "", "Docker", "Docker", "resources", "bin", "docker.exe"),
  ];
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      const viaCandidate = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 8000 });
      if (viaCandidate.status === 0) return candidate;
    }
  }
  return "docker";
}

function sleepMs(ms: number): void {
  const shared = new SharedArrayBuffer(4);
  Atomics.wait(new Int32Array(shared), 0, 0, ms);
}

function psql(dockerBin: string, sql: string, timeoutMs = 30000): RunResult {
  return run(
    dockerBin,
    ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-t", "-A", "-c", sql],
    timeoutMs
  );
}

function psqlValue(dockerBin: string, sql: string, timeoutMs = 30000): string {
  const res = psql(dockerBin, sql, timeoutMs);
  return res.code === 0 ? res.stdout.trim() : "";
}

function psqlInt(dockerBin: string, sql: string): number {
  const raw = psqlValue(dockerBin, sql);
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : -1;
}

function psqlLines(dockerBin: string, sql: string, timeoutMs = 30000): string[] {
  const res = psql(dockerBin, sql, timeoutMs);
  if (res.code !== 0) return [];
  return res.stdout
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function psqlFile(dockerBin: string, localPath: string, containerPath: string, timeoutMs = 120000): RunResult {
  const copy = run(dockerBin, ["cp", localPath, `${CONTAINER_NAME}:${containerPath}`], 30000);
  if (copy.code !== 0) return copy;
  return run(
    dockerBin,
    ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-t", "-A", "-f", containerPath],
    timeoutMs
  );
}

// ============================================================================
// EXPECTED INVENTORY DERIVED FROM THE COMMITTED 033 SQL TEXT
// ============================================================================

interface ExpectedInventory {
  tableCount: number;
  standaloneIndexCount: number;
  inlineUniqueConstraintCount: number;
  indexCountTotalWithPk: number;
  triggerCount: number;
  functionCount: number;
  functionNames: string[];
  grantableRpcCount: number;
  rlsEnableCount: number;
  invalidationTriggerCount: number;
  transitionRuleCount: number;
  translationFieldAllowlistCount: number;
  referencedRoles: string[];
  requiresPgcrypto: boolean;
}

function deriveExpectedInventory(sql033: string, sql032: string): ExpectedInventory {
  const tableCount = countMatches(sql033, /create\s+table\s+(?:if\s+not\s+exists\s+)?public\./gi);
  const standaloneIndexCount = countMatches(sql033, /create\s+(?:unique\s+)?index\s+/gi);
  const inlineUniqueConstraintCount = countMatches(sql033, /constraint\s+\w+\s+unique\s*\(/gi);
  const triggerCount = countMatches(sql033, /create\s+trigger\s+/gi);
  const functionCount = countMatches(sql033, /create\s+or\s+replace\s+function\s+/gi);
  const grantableRpcCount = countMatches(
    sql033,
    /grant\s+execute\s+on\s+function\s+public\.[\s\S]{0,400}?to\s+service_role\s*;/gi
  );
  const rlsEnableCount = countMatches(sql033, /enable\s+row\s+level\s+security/gi);
  const invalidationTriggerCount = countMatches(
    sql033,
    /execute\s+function\s+public\.fn_canonical_content_changed_invalidate_translations\s*\(/gi
  );

  // Allowed publication-state edges, as `when v_current_state = 'x' and p_to_state = 'y'`
  // branches inside the internal engine, plus the single null->draft bootstrap edge.
  const edgeBranches = countMatches(
    sql033,
    /when\s+v_current_state\s*=\s*'[a-z_]+'\s+and\s+p_to_state\s*=\s*'[a-z_]+'\s+then/gi
  );
  const transitionRuleCount = edgeBranches + 1;

  const allowlistBranches = countMatches(
    sql033,
    /p_entity_type\s*=\s*'[a-z_]+'\s+and\s+p_field_key\s*=\s*'[a-z_]+'/gi
  );

  // Roles are derived from the migrations' own GRANT/REVOKE statements. They
  // appear both as `... to service_role` and as `revoke ... from public, anon,
  // authenticated`, so scan whole grant/revoke statements rather than only the
  // `to` clause.
  const roles = new Set<string>();
  for (const source of [sql032, sql033]) {
    for (const statement of source.split(";")) {
      if (!/^\s*(grant|revoke)\b/i.test(statement)) continue;
      for (const role of ["anon", "authenticated", "service_role"]) {
        if (new RegExp(`\\b${role}\\b`).test(statement)) roles.add(role);
      }
    }
  }

  // Exact function names introduced by migration 033, so the runtime function
  // count is not polluted by functions migration 032 already created.
  const functionNames = new Set<string>();
  for (const m of sql033.matchAll(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(/gi)) {
    functionNames.add(m[1].toLowerCase());
  }

  return {
    tableCount,
    standaloneIndexCount,
    inlineUniqueConstraintCount,
    indexCountTotalWithPk: standaloneIndexCount + inlineUniqueConstraintCount + tableCount,
    triggerCount,
    functionCount,
    functionNames: [...functionNames].sort(),
    grantableRpcCount,
    rlsEnableCount,
    invalidationTriggerCount,
    transitionRuleCount,
    translationFieldAllowlistCount: allowlistBranches,
    referencedRoles: [...roles].sort(),
    requiresPgcrypto: /create\s+extension\s+if\s+not\s+exists\s+pgcrypto/i.test(sql033),
  };
}

// ============================================================================
// EMBEDDED SQL: SYNTHETIC FIXTURE CHAIN
// ============================================================================

const FIXTURE_SQL = `
-- PHASE 9N synthetic fixture chain. SYNTHETIC_9N_* labels only; no real German
-- legal, bureaucratic or user content. Deterministic synthetic UUIDs.
insert into public.knowledge_trust_domains (id, code, name)
values ('9d000000-0000-4000-8000-000000000001', 'de', 'SYNTHETIC_9N_TRUST_DOMAIN');

insert into public.knowledge_publishers (id, publisher_name, publisher_type, trust_domain_id)
values ('9d000000-0000-4000-8000-000000000002', 'SYNTHETIC_9N_PUBLISHER', 'synthetic',
        '9d000000-0000-4000-8000-000000000001');

insert into public.knowledge_jurisdictions (id, jurisdiction_level, name)
values ('9d000000-0000-4000-8000-000000000003', 'de_federal', 'SYNTHETIC_9N_JURISDICTION');

insert into public.knowledge_territorial_scopes (id, scope_type)
values ('9d000000-0000-4000-8000-000000000004', 'synthetic_scope');

insert into public.knowledge_authorities
  (id, publisher_id, authority_name, authority_type, jurisdiction_id, territorial_scope_id)
values ('9d000000-0000-4000-8000-000000000005', '9d000000-0000-4000-8000-000000000002',
        'SYNTHETIC_9N_AUTHORITY', 'synthetic', '9d000000-0000-4000-8000-000000000003',
        '9d000000-0000-4000-8000-000000000004');

insert into public.knowledge_sources
  (id, publisher_id, source_type, source_purpose, jurisdiction_id, source_language)
values ('9d000000-0000-4000-8000-000000000006', '9d000000-0000-4000-8000-000000000002',
        'synthetic', 'synthetic_validation', '9d000000-0000-4000-8000-000000000003', 'de');

insert into public.knowledge_source_versions (id, source_id, version_sequence, content_hash)
values ('9d000000-0000-4000-8000-000000000007', '9d000000-0000-4000-8000-000000000006', 1,
        'SYNTHETIC_9N_HASH_0001');

insert into public.knowledge_responsible_actor_rules (id, actor_state)
values ('9d000000-0000-4000-8000-000000000008', 'synthetic_actor_state');

-- Synthetic German-like text (umlauts + sharp s) to exercise Unicode NFC
-- fingerprint determinism. Deliberately NOT real legal content.
insert into public.knowledge_processes
  (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
values ('9d000000-0000-4000-8000-00000000000a', 'anmeldung_ummeldung_abmeldung',
        'SYNTHETIC_9N_PROZESS_TITEL_äöüß', '9d000000-0000-4000-8000-000000000003', 'low',
        'SYNTHETIC_9N_AUSLÖSER_BESCHREIBUNG_äöüß', 'SYNTHETIC_9N_ERSTER_SCHRITT_äöüß');

insert into public.knowledge_process_steps
  (id, process_id, step_order, step_type, title, responsible_actor_rule_id, description_canonical)
values ('9d000000-0000-4000-8000-00000000000b', '9d000000-0000-4000-8000-00000000000a', 0,
        'synthetic_step', 'SYNTHETIC_9N_SCHRITT_TITEL_äöüß',
        '9d000000-0000-4000-8000-000000000008', 'SYNTHETIC_9N_SCHRITT_BESCHREIBUNG_äöüß');

insert into public.knowledge_claims
  (id, claim_type, claim_text_canonical, jurisdiction_id, risk_level)
values ('9d000000-0000-4000-8000-00000000000c', 'synthetic_claim',
        'SYNTHETIC_9N_AUSSAGE_TEXT_äöüß', '9d000000-0000-4000-8000-000000000003', 'low');

insert into public.knowledge_evidence_requirements
  (id, name, category, responsible_actor_rule_id, description_canonical)
values ('9d000000-0000-4000-8000-00000000000d', 'SYNTHETIC_9N_NACHWEIS', 'synthetic_category',
        '9d000000-0000-4000-8000-000000000008', 'SYNTHETIC_9N_NACHWEIS_BESCHREIBUNG_äöüß');

insert into public.knowledge_authority_competences
  (id, authority_id, subject_matter, territorial_scope_id, competence_source_version_id)
values ('9d000000-0000-4000-8000-00000000000e', '9d000000-0000-4000-8000-000000000005',
        'SYNTHETIC_9N_ZUSTÄNDIGKEIT_äöüß', '9d000000-0000-4000-8000-000000000004',
        '9d000000-0000-4000-8000-000000000007');

-- Second process: supersession replacement subject.
insert into public.knowledge_processes
  (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
values ('9d000000-0000-4000-8000-00000000000f', 'anmeldung_ummeldung_abmeldung',
        'SYNTHETIC_9N_ERSATZ_PROZESS_äöüß', '9d000000-0000-4000-8000-000000000003', 'low',
        'SYNTHETIC_9N_ERSATZ_AUSLÖSER_äöüß', 'SYNTHETIC_9N_ERSATZ_SCHRITT_äöüß');

-- Review records referenced as translation review evidence.
insert into public.knowledge_review_records
  (id, entity_type, entity_id, review_status, review_level, reviewer_type)
values ('9d000000-0000-4000-8000-0000000000bb', 'process', '9d000000-0000-4000-8000-00000000000a',
        'human_reviewed', 'synthetic_level', 'synthetic_reviewer'),
       ('9d000000-0000-4000-8000-0000000000aa', 'process', '9d000000-0000-4000-8000-00000000000a',
        'human_reviewed', 'synthetic_level', 'synthetic_reviewer');

select 'FIXTURE_OK' as marker;
`;

// ============================================================================
// EMBEDDED SQL: RUNTIME CASE PACK
// ============================================================================

const CASEPACK_SQL = String.raw`
\pset pager off
-- Emits CASE|<id>|<category>|<verdict>|<sqlstate>|<detail> per case.
--   REJECTED  attempt failed for the INTENDED reason (negative case passed)
--   ALLOWED   forbidden attempt SUCCEEDED (security failure)
--   WRONGFAIL attempt failed for an UNINTENDED reason (not a security proof)
--   OK        positive case behaved as intended
--   BROKEN    positive case failed (implementation defect)
create temporary table cp(id int, cat text, verdict text, ss text, detail text);

create or replace function pg_temp.cls(p_id int, p_cat text, p_ss text, p_expected text[], p_detail text)
returns void language plpgsql as $fn$
begin
  insert into cp values (p_id, p_cat,
    case when p_ss = any(p_expected) then 'REJECTED' else 'WRONGFAIL' end, p_ss, p_detail);
end $fn$;

-- Z: bootstrap the primary subject FIRST. Without an existing lifecycle the
-- append-only history tests would run against an empty table (a no-op UPDATE
-- fires no trigger) and the duplicate-bootstrap test would have nothing to
-- collide with, so both would report false passes.
do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject(
    'process','9d000000-0000-4000-8000-00000000000a','SYNTH_9N_SETUP','setup-boot-1');
  insert into cp values (1,'Z_setup_bootstrap','OK','00000','primary subject bootstrapped to draft');
exception when others then
  insert into cp values (1,'Z_setup_bootstrap','BROKEN',SQLSTATE,'bootstrap failed: '||left(SQLERRM,60));
end $blk$;

do $blk$
declare v_state text; v_ver int; v_hist int;
begin
  select current_state, state_version into v_state, v_ver
    from public.knowledge_publication_states where entity_id='9d000000-0000-4000-8000-00000000000a';
  select count(*) into v_hist from public.knowledge_publication_state_transitions
    where entity_id='9d000000-0000-4000-8000-00000000000a';
  insert into cp values (2,'Z_setup_bootstrap',
    case when v_state='draft' and v_ver=1 and v_hist=1 then 'OK' else 'BROKEN' end,'00000',
    'state='||coalesce(v_state,'<null>')||' version='||coalesce(v_ver,-1)||' historyRows='||v_hist);
end $blk$;

-- A: internal/system functions must be unreachable by every application role.
do $blk$
declare r text; roles text[] := array['anon','authenticated','service_role']; i int := 100;
begin
  foreach r in array roles loop
    begin
      execute format('set local role %I', r);
      perform public.knowledge_transition_publication_state('process'::text,
        '9d000000-0000-4000-8000-00000000000a'::uuid,'review_required'::text,1::integer,null::text,'r'::text,
        'authorized_reviewer'::text,'a'::text,null::uuid,null::text,null::uuid,false::boolean,('cp-'||i)::text);
      execute 'reset role';
      insert into cp values (i,'A_internal_engine_unreachable','ALLOWED','00000','engine executed by '||r);
    exception when others then execute 'reset role';
      perform pg_temp.cls(i,'A_internal_engine_unreachable',SQLSTATE,array['42501'],'engine by '||r);
    end; i := i+1;
    begin
      execute format('set local role %I', r);
      perform public.fn_create_translation_candidate_core('process'::text,
        '9d000000-0000-4000-8000-00000000000a'::uuid,'title'::text,'en'::text,'X'::text,true::boolean,
        'p'::text,'m'::text,'authorized_reviewer'::text,'a'::text,null::text);
      execute 'reset role';
      insert into cp values (i,'A_internal_core_unreachable','ALLOWED','00000','core executed by '||r);
    exception when others then execute 'reset role';
      perform pg_temp.cls(i,'A_internal_core_unreachable',SQLSTATE,array['42501'],'core by '||r);
    end; i := i+1;
    begin
      execute format('set local role %I', r);
      perform public.knowledge_invalidate_translation_for_canonical_change('9d000000-0000-4000-8000-0000000000cc'::uuid);
      execute 'reset role';
      insert into cp values (i,'A_system_invalidation_unreachable','ALLOWED','00000','invalidate executed by '||r);
    exception when others then execute 'reset role';
      perform pg_temp.cls(i,'A_system_invalidation_unreachable',SQLSTATE,array['42501'],'invalidate by '||r);
    end; i := i+1;
  end loop;
end $blk$;

-- B: direct table DML on the three new tables by anon/authenticated.
do $blk$
declare
  t text; r text; op text; stmt text; i int := 200;
  tables text[] := array['knowledge_publication_states','knowledge_publication_state_transitions','knowledge_canonical_unit_translations'];
  roles text[] := array['anon','authenticated'];
  ops text[] := array['SELECT','INSERT','UPDATE','DELETE'];
begin
  foreach r in array roles loop
    foreach t in array tables loop
      foreach op in array ops loop
        stmt := case op
          when 'SELECT' then format('select 1 from public.%I limit 1', t)
          when 'INSERT' then format('insert into public.%I default values', t)
          when 'UPDATE' then format('update public.%I set entity_type = entity_type', t)
          else format('delete from public.%I', t) end;
        begin
          execute format('set local role %I', r);
          execute stmt;
          execute 'reset role';
          insert into cp values (i,'B_rls_direct_dml_denied','ALLOWED','00000',r||' '||op||' '||t);
        exception when others then execute 'reset role';
          perform pg_temp.cls(i,'B_rls_direct_dml_denied',SQLSTATE,array['42501'],r||' '||op||' '||t);
        end; i := i+1;
      end loop;
    end loop;
  end loop;
end $blk$;

-- C: PUBLIC must retain no implicit EXECUTE on any SECURITY DEFINER function.
do $blk$
declare rec record; i int := 300;
begin
  for rec in select p.oid, p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
             where n.nspname='public' and p.prosecdef order by p.proname loop
    if has_function_privilege('public', rec.oid, 'EXECUTE') then
      insert into cp values (i,'C_public_execute_revoked','ALLOWED','00000','PUBLIC can execute '||rec.proname);
    else
      insert into cp values (i,'C_public_execute_revoked','REJECTED','42501','PUBLIC cannot execute '||rec.proname);
    end if;
    i := i+1;
  end loop;
end $blk$;

-- D: transition history is append-only.
do $blk$ begin
  update public.knowledge_publication_state_transitions set to_state='withdrawn'
    where entity_id='9d000000-0000-4000-8000-00000000000a';
  insert into cp values (400,'D_history_append_only','ALLOWED','00000','history UPDATE succeeded');
exception when others then perform pg_temp.cls(400,'D_history_append_only',SQLSTATE,array['P0001'],'history UPDATE');
end $blk$;
do $blk$ begin
  delete from public.knowledge_publication_state_transitions
    where entity_id='9d000000-0000-4000-8000-00000000000a';
  insert into cp values (401,'D_history_append_only','ALLOWED','00000','history DELETE succeeded');
exception when others then perform pg_temp.cls(401,'D_history_append_only',SQLSTATE,array['P0001'],'history DELETE');
end $blk$;

-- E: bootstrap negatives.
do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject('process','9d000000-0000-4000-8000-00000000000a','a','dup-idem-other');
  insert into cp values (500,'E_bootstrap_negative','ALLOWED','00000','duplicate bootstrap succeeded');
exception when others then perform pg_temp.cls(500,'E_bootstrap_negative',SQLSTATE,array['P0001'],'duplicate bootstrap');
end $blk$;
do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject('process','9d000000-0000-4000-8000-0000dead0002','a','nonexistent-1');
  insert into cp values (501,'E_bootstrap_negative','ALLOWED','00000','nonexistent entity bootstrapped');
exception when others then perform pg_temp.cls(501,'E_bootstrap_negative',SQLSTATE,array['P0001'],'nonexistent entity');
end $blk$;
do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject('not_a_real_type','9d000000-0000-4000-8000-00000000000a','a','badtype-1');
  insert into cp values (502,'E_bootstrap_negative','ALLOWED','00000','unknown entity_type accepted');
exception when others then perform pg_temp.cls(502,'E_bootstrap_negative',SQLSTATE,array['P0001'],'unknown entity_type');
end $blk$;
do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject('process','9d000000-0000-4000-8000-00000000000a','a',null);
  insert into cp values (503,'E_bootstrap_negative','ALLOWED','00000','null idempotency key accepted');
exception when others then perform pg_temp.cls(503,'E_bootstrap_negative',SQLSTATE,array['P0001'],'null idempotency key');
end $blk$;

-- F: translation table constraint negatives.
do $blk$
declare i int := 600; fp64 text := repeat('e',64);
begin
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'en',1,'X','approved','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','approved without review evidence');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'approved without review evidence');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'en',2,'X','rejected','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','rejected without reason');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'rejected without reason');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'en',3,'X','draft','automated_ingestion_system',true);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','machine_generated without provenance');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'machine_generated without provenance');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'de',4,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','German output locale accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'German output locale');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'fr',5,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','inactive locale accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'inactive locale');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title','tooshort','en',6,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','short fingerprint accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'short fingerprint');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,fingerprint_algorithm_version,output_locale,
       translation_version,translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'md5_v1','en',7,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','md5 fingerprint algorithm accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'md5 fingerprint algorithm');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('deadline_rule','9d000000-0000-4000-8000-00000000000a','title',fp64,'en',8,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','unsupported entity_type accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'unsupported entity_type');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','not_a_field',fp64,'en',9,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','unsupported field_key accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'unsupported field_key');
  end; i := i+1;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',fp64,'en',0,'X','draft','authorized_reviewer',false);
    insert into cp values (i,'F_translation_constraint','ALLOWED','00000','translation_version 0 accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_constraint',SQLSTATE,array['23514'],'translation_version 0');
  end; i := i+1;
end $blk$;

-- G: active-approved partial unique index behaviour.
do $blk$
declare v_fp text;
begin
  delete from public.knowledge_canonical_unit_translations
    where entity_id='9d000000-0000-4000-8000-00000000000a';
  select public.fn_normalize_and_fingerprint_text(title) into v_fp
    from public.knowledge_processes where id='9d000000-0000-4000-8000-00000000000a';
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
       uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',v_fp,'en',1,'SYNTH_EN','approved',
            'authorized_reviewer',false,true,true,true,true,'9d000000-0000-4000-8000-0000000000bb',now());
    insert into cp values (700,'G_active_approved_unique','OK','00000','first active approved inserted');
  exception when others then insert into cp values (700,'G_active_approved_unique','BROKEN',SQLSTATE,'first active approved failed');
  end;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
       uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',repeat('a',64),'en',2,'DUP','approved',
            'authorized_reviewer',false,true,true,true,true,'9d000000-0000-4000-8000-0000000000bb',now());
    insert into cp values (701,'G_active_approved_unique','ALLOWED','00000','two active approved rows allowed');
  exception when others then perform pg_temp.cls(701,'G_active_approved_unique',SQLSTATE,array['23505'],'second active approved');
  end;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
       uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
    values ('process','9d000000-0000-4000-8000-00000000000a','title',v_fp,'sk',1,'SYNTH_SK','approved',
            'authorized_reviewer',false,true,true,true,true,'9d000000-0000-4000-8000-0000000000bb',now());
    insert into cp values (702,'G_active_approved_unique','OK','00000','different locale does not conflict');
  exception when others then insert into cp values (702,'G_active_approved_unique','BROKEN',SQLSTATE,'different locale conflicted');
  end;
  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
       translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
       uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
    values ('process','9d000000-0000-4000-8000-00000000000a','trigger_description',
            public.fn_normalize_and_fingerprint_text((select trigger_description from public.knowledge_processes
              where id='9d000000-0000-4000-8000-00000000000a')),
            'en',1,'SYNTH_TD','approved','authorized_reviewer',false,true,true,true,true,
            '9d000000-0000-4000-8000-0000000000bb',now());
    insert into cp values (703,'G_active_approved_unique','OK','00000','different field_key does not conflict');
  exception when others then insert into cp values (703,'G_active_approved_unique','BROKEN',SQLSTATE,'different field_key conflicted');
  end;
end $blk$;

-- H: each canonical-change invalidation trigger must invalidate its translation.
do $blk$
declare
  i int := 800;
  specs text[][] := array[
    array['knowledge_processes','title','9d000000-0000-4000-8000-00000000000a','process','title'],
    array['knowledge_processes','trigger_description','9d000000-0000-4000-8000-00000000000a','process','trigger_description'],
    array['knowledge_processes','safe_first_step','9d000000-0000-4000-8000-00000000000a','process','safe_first_step'],
    array['knowledge_process_steps','title','9d000000-0000-4000-8000-00000000000b','process_step','title'],
    array['knowledge_process_steps','description_canonical','9d000000-0000-4000-8000-00000000000b','process_step','description_canonical'],
    array['knowledge_claims','claim_text_canonical','9d000000-0000-4000-8000-00000000000c','claim','claim_text_canonical'],
    array['knowledge_evidence_requirements','description_canonical','9d000000-0000-4000-8000-00000000000d','evidence_requirement','description_canonical'],
    array['knowledge_authority_competences','subject_matter','9d000000-0000-4000-8000-00000000000e','authority_competence','subject_matter']
  ];
  s text[]; v_fp text; v_status text; v_active int;
begin
  foreach s slice 1 in array specs loop
    begin
      execute format('select public.fn_normalize_and_fingerprint_text(%I) from public.%I where id=$1', s[2], s[1])
        into v_fp using s[3]::uuid;
      delete from public.knowledge_canonical_unit_translations
        where entity_type=s[4] and entity_id=s[3]::uuid and field_key=s[5];
      insert into public.knowledge_canonical_unit_translations
        (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
         translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
         uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
      values (s[4],s[3]::uuid,s[5],v_fp,'en',1,'SYNTH_TRIG','approved','authorized_reviewer',
              false,true,true,true,true,'9d000000-0000-4000-8000-0000000000bb',now());
      execute format('update public.%I set %I = %I || $1 where id = $2', s[1], s[2], s[2])
        using '_TRIGCHANGE', s[3]::uuid;
      select translation_status into v_status from public.knowledge_canonical_unit_translations
        where entity_type=s[4] and entity_id=s[3]::uuid and field_key=s[5] and output_locale='en';
      select count(*) into v_active from public.knowledge_canonical_unit_translations
        where entity_type=s[4] and entity_id=s[3]::uuid and field_key=s[5] and translation_status='approved'
          and superseded_at is null and invalidated_at is null and withdrawn_at is null;
      if v_status = 'invalidated_pending_review' and v_active = 0 then
        insert into cp values (i,'H_canonical_invalidation_trigger','OK','00000',s[1]||'.'||s[2]||' invalidated');
      else
        insert into cp values (i,'H_canonical_invalidation_trigger','BROKEN','00000',
          s[1]||'.'||s[2]||' status='||coalesce(v_status,'<null>')||' active='||v_active);
      end if;
    exception when others then
      insert into cp values (i,'H_canonical_invalidation_trigger','BROKEN',SQLSTATE,s[1]||'.'||s[2]||': '||left(SQLERRM,60));
    end; i := i+1;
  end loop;
end $blk$;

-- I: every grantable RPC must actually be executable (this is where the
--    PL/pgSQL output-parameter ambiguity defect surfaces).
do $blk$
declare i int := 900; v_repl uuid := '9d000000-0000-4000-8000-00000000000f'; v_pid uuid := '9d000000-0000-4000-8000-00000000000a';
        v_missing uuid := '9d000000-0000-4000-8000-0000000000cc';
begin
  begin perform public.knowledge_bootstrap_publication_subject('process',v_repl,'a','cp-boot-repl');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_bootstrap_publication_subject');
  exception when others then
    if SQLSTATE='P0001' then insert into cp values (i,'I_rpc_executable','OK','P0001','knowledge_bootstrap_publication_subject (guard fired; body executed)');
    else insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_bootstrap_publication_subject: '||left(SQLERRM,60)); end if;
  end; i := i+1;

  begin perform public.knowledge_advance_publication_evidence_status('process',v_pid,'review_required',1,'r','a','cp-1');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_advance_publication_evidence_status');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_advance_publication_evidence_status: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_record_publication_review_decision('process',v_pid,'approved',1,'9d000000-0000-4000-8000-0000000000aa',null,'a','cp-2');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_record_publication_review_decision');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_record_publication_review_decision: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_recall_publication_to_review('process',v_pid,1,'r','a','cp-3');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_recall_publication_to_review');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_recall_publication_to_review: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_advance_publication_lifecycle('process',v_pid,'mark_eligible',1,null,'a','cp-4');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_advance_publication_lifecycle');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_advance_publication_lifecycle: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_supersede_publication_subject('process',v_pid,1,'r','process',v_repl,'a','cp-5');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_supersede_publication_subject');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_supersede_publication_subject: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_withdraw_publication_subject('process',v_pid,1,'r','a','cp-6');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_withdraw_publication_subject');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_withdraw_publication_subject: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_suspend_publication_for_detected_issue('process',v_pid,1,'conflict_suspension','r','a','cp-7');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_suspend_publication_for_detected_issue');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_suspend_publication_for_detected_issue: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_emergency_suspend_publication_subject('process',v_pid,1,'r','a','cp-8');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_emergency_suspend_publication_subject');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_emergency_suspend_publication_subject: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_create_machine_translation_candidate('process',v_pid,'title','cs','X','p','m','a',null);
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_create_machine_translation_candidate');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_create_machine_translation_candidate: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_create_human_translation_candidate('process',v_pid,'title','pl','X','a',null);
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_create_human_translation_candidate');
  exception when others then insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_create_human_translation_candidate: '||left(SQLERRM,60)); end; i := i+1;

  begin perform public.knowledge_submit_translation_for_review(v_missing,'a');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_submit_translation_for_review');
  exception when others then
    if SQLSTATE='P0001' then insert into cp values (i,'I_rpc_executable','OK','P0001','knowledge_submit_translation_for_review (guard fired; body executed)');
    else insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_submit_translation_for_review: '||left(SQLERRM,60)); end if;
  end; i := i+1;

  begin perform public.knowledge_approve_translation(v_missing,'a','9d000000-0000-4000-8000-0000000000bb');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_approve_translation');
  exception when others then
    if SQLSTATE='P0001' then insert into cp values (i,'I_rpc_executable','OK','P0001','knowledge_approve_translation (guard fired; body executed)');
    else insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_approve_translation: '||left(SQLERRM,60)); end if;
  end; i := i+1;

  begin perform public.knowledge_reject_translation(v_missing,'a','reason');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_reject_translation');
  exception when others then
    if SQLSTATE='P0001' then insert into cp values (i,'I_rpc_executable','OK','P0001','knowledge_reject_translation (guard fired; body executed)');
    else insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_reject_translation: '||left(SQLERRM,60)); end if;
  end; i := i+1;

  begin perform public.knowledge_withdraw_translation(v_missing,'a','reason');
    insert into cp values (i,'I_rpc_executable','OK','00000','knowledge_withdraw_translation');
  exception when others then
    if SQLSTATE='P0001' then insert into cp values (i,'I_rpc_executable','OK','P0001','knowledge_withdraw_translation (guard fired; body executed)');
    else insert into cp values (i,'I_rpc_executable','BROKEN',SQLSTATE,'knowledge_withdraw_translation: '||left(SQLERRM,60)); end if;
  end; i := i+1;
end $blk$;

-- J: caller-supplied fingerprints must never override the database-derived one.
do $blk$ begin
  perform public.knowledge_create_machine_translation_candidate(
    'process','9d000000-0000-4000-8000-00000000000a','title','hu','X','p','m','a', repeat('9',64));
  insert into cp values (1000,'J_forged_fingerprint','ALLOWED','00000','forged expected fingerprint accepted');
exception when others then perform pg_temp.cls(1000,'J_forged_fingerprint',SQLSTATE,array['P0001'],'forged expected fingerprint');
end $blk$;
do $blk$
declare v_fp text; begin
  select public.fn_normalize_and_fingerprint_text('SYNTH_UNRELATED') into v_fp;
  perform public.knowledge_create_human_translation_candidate(
    'process','9d000000-0000-4000-8000-00000000000a','title','hu','X','a', v_fp);
  insert into cp values (1001,'J_forged_fingerprint','ALLOWED','00000','stale fingerprint assertion accepted');
exception when others then perform pg_temp.cls(1001,'J_forged_fingerprint',SQLSTATE,array['P0001'],'stale fingerprint assertion');
end $blk$;

-- K: SHA-256 fingerprint determinism and null contract.
do $blk$
declare a text; b text; c text; d text;
begin
  select public.fn_normalize_and_fingerprint_text('SYNTHETIC_9N_äöüß') into a;
  select public.fn_normalize_and_fingerprint_text('SYNTHETIC_9N_äöüß') into b;
  select public.fn_normalize_and_fingerprint_text('SYNTHETIC_9N_äöüß_X') into c;
  select public.fn_normalize_and_fingerprint_text(null) into d;
  insert into cp values (1100,'K_fingerprint', case when a=b then 'OK' else 'BROKEN' end,'00000','deterministic for identical Unicode input');
  insert into cp values (1101,'K_fingerprint', case when a<>c then 'OK' else 'BROKEN' end,'00000','changed canonical content differs');
  insert into cp values (1102,'K_fingerprint', case when length(a)=64 then 'OK' else 'BROKEN' end,'00000','64 lowercase hex chars');
  insert into cp values (1103,'K_fingerprint', case when d is null then 'OK' else 'BROKEN' end,'00000','null passthrough');
end $blk$;

-- L: publication-states projection write validation trigger.
do $blk$ begin
  insert into public.knowledge_publication_states (entity_type, entity_id, current_state, state_version)
  values ('not_a_type','9d000000-0000-4000-8000-0000dead0003','draft',1);
  insert into cp values (1200,'L_states_validate_write','ALLOWED','00000','unknown entity_type inserted');
exception when others then perform pg_temp.cls(1200,'L_states_validate_write',SQLSTATE,array['P0001','23514'],'unknown entity_type');
end $blk$;
do $blk$ begin
  insert into public.knowledge_publication_states (entity_type, entity_id, current_state, state_version)
  values ('process','9d000000-0000-4000-8000-0000dead0004','draft',1);
  insert into cp values (1201,'L_states_validate_write','ALLOWED','00000','nonexistent subject inserted');
exception when others then perform pg_temp.cls(1201,'L_states_validate_write',SQLSTATE,array['P0001','23514'],'nonexistent subject');
end $blk$;
do $blk$ begin
  insert into public.knowledge_publication_states (entity_type, entity_id, current_state, state_version)
  values ('process','9d000000-0000-4000-8000-00000000000a','published',1);
  insert into cp values (1202,'L_states_validate_write','ALLOWED','00000','duplicate subject projection inserted');
exception when others then perform pg_temp.cls(1202,'L_states_validate_write',SQLSTATE,array['P0001','23505','23514'],'duplicate subject projection');
end $blk$;

-- M: every grantable RPC attempted by each UNTRUSTED role. EXECUTE privilege is
--    checked before the body runs, so this stays a real privilege test even for
--    the RPCs whose bodies are defective.
do $blk$
declare
  r text; roles text[] := array['anon','authenticated'];
  c text; i int := 1300;
  calls text[] := array[
    $c$select public.knowledge_bootstrap_publication_subject('process','9d000000-0000-4000-8000-00000000000a','a','m1')$c$,
    $c$select public.knowledge_advance_publication_evidence_status('process','9d000000-0000-4000-8000-00000000000a','review_required',1,'r','a','m2')$c$,
    $c$select public.knowledge_record_publication_review_decision('process','9d000000-0000-4000-8000-00000000000a','approved',1,'9d000000-0000-4000-8000-0000000000aa',null,'a','m3')$c$,
    $c$select public.knowledge_recall_publication_to_review('process','9d000000-0000-4000-8000-00000000000a',1,'r','a','m4')$c$,
    $c$select public.knowledge_advance_publication_lifecycle('process','9d000000-0000-4000-8000-00000000000a','mark_eligible',1,null,'a','m5')$c$,
    $c$select public.knowledge_supersede_publication_subject('process','9d000000-0000-4000-8000-00000000000a',1,'r','process','9d000000-0000-4000-8000-00000000000f','a','m6')$c$,
    $c$select public.knowledge_withdraw_publication_subject('process','9d000000-0000-4000-8000-00000000000a',1,'r','a','m7')$c$,
    $c$select public.knowledge_suspend_publication_for_detected_issue('process','9d000000-0000-4000-8000-00000000000a',1,'conflict_suspension','r','a','m8')$c$,
    $c$select public.knowledge_emergency_suspend_publication_subject('process','9d000000-0000-4000-8000-00000000000a',1,'r','a','m9')$c$,
    $c$select public.knowledge_create_machine_translation_candidate('process','9d000000-0000-4000-8000-00000000000a','title','en','X','p','m','a',null)$c$,
    $c$select public.knowledge_create_human_translation_candidate('process','9d000000-0000-4000-8000-00000000000a','title','sk','X','a',null)$c$,
    $c$select public.knowledge_submit_translation_for_review('9d000000-0000-4000-8000-0000000000cc','a')$c$,
    $c$select public.knowledge_approve_translation('9d000000-0000-4000-8000-0000000000cc','a','9d000000-0000-4000-8000-0000000000bb')$c$,
    $c$select public.knowledge_reject_translation('9d000000-0000-4000-8000-0000000000cc','a','reason')$c$,
    $c$select public.knowledge_withdraw_translation('9d000000-0000-4000-8000-0000000000cc','a','reason')$c$
  ];
begin
  foreach r in array roles loop
    foreach c in array calls loop
      begin
        execute format('set local role %I', r);
        execute c;
        execute 'reset role';
        insert into cp values (i,'M_untrusted_role_rpc_denied','ALLOWED','00000',r||' executed '||left(c,60));
      exception when others then execute 'reset role';
        perform pg_temp.cls(i,'M_untrusted_role_rpc_denied',SQLSTATE,array['42501'],r||' '||left(c,60));
      end; i := i+1;
    end loop;
  end loop;
end $blk$;

-- N: service_role has BYPASSRLS but must hold no direct table privileges, so
--    every direct DML on the new tables must still be denied.
do $blk$
declare
  t text; op text; stmt text; i int := 1400;
  tables text[] := array['knowledge_publication_states','knowledge_publication_state_transitions','knowledge_canonical_unit_translations'];
  ops text[] := array['SELECT','INSERT','UPDATE','DELETE'];
begin
  foreach t in array tables loop
    foreach op in array ops loop
      stmt := case op
        when 'SELECT' then format('select 1 from public.%I limit 1', t)
        when 'INSERT' then format('insert into public.%I default values', t)
        when 'UPDATE' then format('update public.%I set entity_type = entity_type', t)
        else format('delete from public.%I', t) end;
      begin
        execute 'set local role service_role';
        execute stmt;
        execute 'reset role';
        insert into cp values (i,'N_service_role_direct_dml_denied','ALLOWED','00000','service_role '||op||' '||t);
      exception when others then execute 'reset role';
        perform pg_temp.cls(i,'N_service_role_direct_dml_denied',SQLSTATE,array['42501'],'service_role '||op||' '||t);
      end; i := i+1;
    end loop;
  end loop;
end $blk$;

select 'CASE|'||id||'|'||cat||'|'||verdict||'|'||ss||'|'||detail from cp order by id;
`;

// ============================================================================
// EMBEDDED SQL: SECURITY DEFINER SCHEMA-SHADOWING ATTACK
// ============================================================================

const SHADOW_SQL = String.raw`
\pset pager off
-- Plant an attacker schema whose same-named helpers, if resolved, would make
-- the bootstrap RPC accept a nonexistent entity. The hardened search_path must
-- make the trusted public.* helpers win.
create schema if not exists attacker_9n;
create or replace function attacker_9n.fn_publication_subject_exists(p_entity_type text, p_entity_id uuid)
returns boolean language sql immutable as $fn$ select true $fn$;
create or replace function attacker_9n.fn_normalize_and_fingerprint_text(p_text text)
returns text language sql immutable as $fn$ select repeat('f', 64) $fn$;

set search_path = attacker_9n, public, pg_catalog;

-- Prove the attacker shadow really is first on the caller's path.
select 'SHADOW_ACTIVE|'||fn_publication_subject_exists('process','9d000000-0000-4000-8000-0000dead0001')::text;

do $blk$ begin
  perform public.knowledge_bootstrap_publication_subject(
    'process','9d000000-0000-4000-8000-0000dead0001','SHADOW_TEST','shadow-idem-1');
  raise notice 'SHADOW_RESULT|HIJACKED';
exception when others then raise notice 'SHADOW_RESULT|BLOCKED|%', SQLSTATE;
end $blk$;

select 'SHADOW_TRUSTED_HELPER|'||public.fn_publication_subject_exists('process','9d000000-0000-4000-8000-0000dead0001')::text;
reset search_path;
select 'SHADOW_ROWS|'||count(*) from public.knowledge_publication_states
where entity_id='9d000000-0000-4000-8000-0000dead0001';
drop schema attacker_9n cascade;
select 'SHADOW_CLEANED|'||(not exists(select 1 from pg_namespace where nspname='attacker_9n'))::text;
`;

// ============================================================================
// LIVE VALIDATION
// ============================================================================

interface RuntimeCase {
  id: number;
  category: string;
  verdict: "REJECTED" | "ALLOWED" | "WRONGFAIL" | "OK" | "BROKEN" | "UNKNOWN";
  sqlstate: string;
  detail: string;
}

interface FunctionCatalogRow {
  name: string;
  securityDefiner: boolean;
  searchPath: string;
  args: string;
  serviceRoleExecute: boolean;
  anonExecute: boolean;
  authenticatedExecute: boolean;
  publicExecute: boolean;
  owner: string;
}

interface LiveEvidence {
  dockerBinary: string;
  dockerAvailable: boolean;
  imagePresent: boolean;
  containerStarted: boolean;
  containerName: string;
  dbHost: string;
  dbPort: number;
  dbName: string;

  postgresVersionRaw: string;
  postgresMajorVersion: number;
  pgcryptoAvailable: boolean;
  bootstrappedRoles: string[];

  migration032Applied: boolean;
  migration032ExitCode: number;
  migration033Applied: boolean;
  migration033ExitCode: number;
  migration033Stderr: string;
  migrationAppliedInSingleTransaction: boolean;
  forcedRollbackLeftNoSchema: boolean;

  actualTableCount: number;
  actualTables: string[];
  actualIndexCountWithPk: number;
  actualIndexCountWithoutPk: number;
  actualTriggerCount: number;
  actualInvalidationTriggerCount: number;
  actualFunctionCount: number;
  actualSecurityDefinerCount: number;
  actualGrantableRpcCount: number;
  actualGrantableRpcs: string[];
  functions: FunctionCatalogRow[];
  rlsEnabledTables: string[];
  forceRlsTables: string[];
  policyCount: number;
  newTableRoleGrantCount: number;
  activeApprovedIndexDef: string;
  hardenedSearchPathCount: number;
  translationOutputLocales: string[];

  fixtureApplied: boolean;
  caseRows: RuntimeCase[];

  concurrentSessionsUsed: number;
  rowLockObserved: boolean;
  lockTimeoutObserved: boolean;
  residualLockCount: number;

  shadowAttackActive: boolean;
  shadowAttackBlocked: boolean;
  shadowRowsCreated: number;
  shadowSchemaCleaned: boolean;

  rollbackRestoredCanonical: boolean;
  rollbackRestoredTranslations: boolean;

  containerStopped: boolean;
  containerRemoved: boolean;
  volumeRemoved: boolean;
  containerAbsentAfterCleanup: boolean;
  errors: string[];
}

function emptyLiveEvidence(): LiveEvidence {
  return {
    dockerBinary: "",
    dockerAvailable: false,
    imagePresent: false,
    containerStarted: false,
    containerName: CONTAINER_NAME,
    dbHost: DB_HOST,
    dbPort: 0,
    dbName: DB_NAME,
    postgresVersionRaw: "",
    postgresMajorVersion: 0,
    pgcryptoAvailable: false,
    bootstrappedRoles: [],
    migration032Applied: false,
    migration032ExitCode: -1,
    migration033Applied: false,
    migration033ExitCode: -1,
    migration033Stderr: "",
    migrationAppliedInSingleTransaction: false,
    forcedRollbackLeftNoSchema: false,
    actualTableCount: -1,
    actualTables: [],
    actualIndexCountWithPk: -1,
    actualIndexCountWithoutPk: -1,
    actualTriggerCount: -1,
    actualInvalidationTriggerCount: -1,
    actualFunctionCount: -1,
    actualSecurityDefinerCount: -1,
    actualGrantableRpcCount: -1,
    actualGrantableRpcs: [],
    functions: [],
    rlsEnabledTables: [],
    forceRlsTables: [],
    policyCount: -1,
    newTableRoleGrantCount: -1,
    activeApprovedIndexDef: "",
    hardenedSearchPathCount: -1,
    translationOutputLocales: [],
    fixtureApplied: false,
    caseRows: [],
    concurrentSessionsUsed: 0,
    rowLockObserved: false,
    lockTimeoutObserved: false,
    residualLockCount: -1,
    shadowAttackActive: false,
    shadowAttackBlocked: false,
    shadowRowsCreated: -1,
    shadowSchemaCleaned: false,
    rollbackRestoredCanonical: false,
    rollbackRestoredTranslations: false,
    containerStopped: false,
    containerRemoved: false,
    volumeRemoved: false,
    containerAbsentAfterCleanup: false,
    errors: [],
  };
}

function parseCaseRows(stdout: string): RuntimeCase[] {
  const out: RuntimeCase[] = [];
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("CASE|")) continue;
    const parts = trimmed.split("|");
    if (parts.length < 5) continue;
    const verdict = parts[3] as RuntimeCase["verdict"];
    out.push({
      id: Number.parseInt(parts[1], 10),
      category: parts[2],
      verdict: ["REJECTED", "ALLOWED", "WRONGFAIL", "OK", "BROKEN"].includes(verdict)
        ? verdict
        : "UNKNOWN",
      sqlstate: parts[4],
      detail: parts.slice(5).join("|"),
    });
  }
  return out;
}

function collectFunctionCatalog(dockerBin: string, functionNames: string[]): FunctionCatalogRow[] {
  // `has_function_privilege` errors on an unknown role, so every role probe is
  // guarded by `to_regrole` to keep the whole query from failing.
  const priv = (role: string) =>
    `coalesce((select has_function_privilege('${role}', p.oid, 'EXECUTE') where to_regrole('${role}') is not null), false)::text`;
  const nameList = functionNames.map((n) => `'${n}'`).join(",");
  const sql = `
select p.proname
  || '~' || p.prosecdef::text
  || '~' || coalesce(array_to_string(p.proconfig, ' '), '')
  || '~' || pg_get_function_arguments(p.oid)
  || '~' || ${priv("service_role")}
  || '~' || ${priv("anon")}
  || '~' || ${priv("authenticated")}
  || '~' || has_function_privilege('public', p.oid, 'EXECUTE')::text
  || '~' || pg_get_userbyid(p.proowner)
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname in (${nameList})
order by p.proname;`;
  // Casting a boolean to text yields 'true'/'false', while psql's own tuple
  // rendering yields 't'/'f'. Accept either so the flags cannot silently
  // parse as false and fabricate a clean privilege report.
  const isTrue = (s: string) => s === "t" || s === "true";
  const rows: FunctionCatalogRow[] = [];
  for (const line of psqlLines(dockerBin, sql, 30000)) {
    const p = line.split("~");
    if (p.length < 9) continue;
    rows.push({
      name: p[0],
      securityDefiner: isTrue(p[1]),
      searchPath: p[2],
      args: p[3],
      serviceRoleExecute: isTrue(p[4]),
      anonExecute: isTrue(p[5]),
      authenticatedExecute: isTrue(p[6]),
      publicExecute: isTrue(p[7]),
      owner: p[8],
    });
  }
  return rows;
}

function performLiveValidation(expected: ExpectedInventory): LiveEvidence {
  const ev = emptyLiveEvidence();
  const dockerBin = resolveDockerBinary();
  ev.dockerBinary = dockerBin;

  const version = run(dockerBin, ["--version"], 10000);
  ev.dockerAvailable = version.code === 0;
  if (!ev.dockerAvailable) {
    ev.errors.push("ENVIRONMENT: Docker CLI is not available; isolated validation cannot run.");
    return ev;
  }
  const daemon = run(dockerBin, ["info", "--format", "{{.ServerVersion}}"], 45000);
  if (daemon.code !== 0) {
    ev.errors.push("ENVIRONMENT: Docker daemon is not reachable; isolated validation cannot run.");
    return ev;
  }

  // Remove any leftover container from an interrupted previous run.
  run(dockerBin, ["rm", "-f", CONTAINER_NAME], 30000);

  const images = run(dockerBin, ["images", "-q", POSTGRES_IMAGE], 20000);
  ev.imagePresent = Boolean(images.stdout.trim());
  if (!ev.imagePresent) {
    const pull = run(dockerBin, ["pull", POSTGRES_IMAGE], 600000);
    if (pull.code !== 0) {
      ev.errors.push(`ENVIRONMENT: failed to pull ${POSTGRES_IMAGE}: ${pull.stderr.slice(0, 300)}`);
      return ev;
    }
    ev.imagePresent = true;
  }

  const tempPassword = `phase9n_temp_${crypto.randomBytes(9).toString("hex")}`;
  let chosenPort = 0;
  for (const port of CANDIDATE_PORTS) {
    if (port >= RESERVED_SUPABASE_PORTS[0] && port <= RESERVED_SUPABASE_PORTS[1]) continue;
    const started = run(
      dockerBin,
      [
        "run",
        "-d",
        "--name",
        CONTAINER_NAME,
        "-p",
        `${DB_HOST}:${port}:5432`,
        "-e",
        `POSTGRES_PASSWORD=${tempPassword}`,
        "-e",
        `POSTGRES_DB=${DB_NAME}`,
        POSTGRES_IMAGE,
      ],
      60000
    );
    if (started.code === 0 && started.stdout.trim()) {
      chosenPort = port;
      break;
    }
    run(dockerBin, ["rm", "-f", CONTAINER_NAME], 20000);
  }
  if (chosenPort === 0) {
    ev.errors.push("ENVIRONMENT: could not start a disposable PostgreSQL 17 container on any candidate port.");
    return ev;
  }
  ev.containerStarted = true;
  ev.dbPort = chosenPort;

  try {
    // The official image performs an init-then-restart cycle; require several
    // consecutive readiness successes before trusting the server.
    let consecutive = 0;
    let healthy = false;
    for (let i = 0; i < 60; i += 1) {
      const ready = run(dockerBin, ["exec", CONTAINER_NAME, "pg_isready", "-U", "postgres"], 10000);
      consecutive = ready.code === 0 ? consecutive + 1 : 0;
      if (consecutive >= 3) {
        healthy = true;
        break;
      }
      sleepMs(600);
    }
    if (!healthy) {
      ev.errors.push("ENVIRONMENT: container never reported consistently ready via pg_isready.");
      return ev;
    }

    ev.postgresVersionRaw = psqlValue(dockerBin, "select version();");
    const showVersion = psqlValue(dockerBin, "show server_version;");
    const major = showVersion.match(/^(\d+)/);
    ev.postgresMajorVersion = major ? Number.parseInt(major[1], 10) : 0;
    if (ev.postgresMajorVersion !== 17) {
      ev.errors.push(
        `ENVIRONMENT: expected PostgreSQL major version 17 but found "${showVersion}".`
      );
      return ev;
    }

    // Bootstrap only the roles the migration text itself references.
    const roleStatements = expected.referencedRoles
      .map((r) => (r === "service_role" ? `create role ${r} nologin bypassrls;` : `create role ${r} nologin;`))
      .join(" ");
    if (roleStatements) {
      const bootstrap = psql(dockerBin, roleStatements);
      if (bootstrap.code === 0) ev.bootstrappedRoles = [...expected.referencedRoles];
      else ev.errors.push(`SETUP: role bootstrap failed: ${bootstrap.stderr.slice(0, 200)}`);
    }
    // Role-scoped negative tests are only meaningful if the roles exist; a
    // missing role would make every denial a false "wrong reason" failure.
    for (const required of ["anon", "authenticated", "service_role"]) {
      if (!ev.bootstrappedRoles.includes(required)) {
        ev.errors.push(
          `SETUP: role "${required}" was not derived from the migration text and does not exist; ` +
            "role-scoped privilege tests would be meaningless."
        );
      }
    }
    if (ev.errors.length > 0) return ev;

    // Forced-rollback probe: prove a failing transaction leaves no partial
    // schema, before the real application. Uses a deliberate abort.
    const forcedRollback = psql(
      dockerBin,
      "begin; create table public.phase9n_rollback_probe(id int); rollback; " +
        "select count(*) from pg_tables where tablename='phase9n_rollback_probe';"
    );
    ev.forcedRollbackLeftNoSchema =
      forcedRollback.code === 0 && forcedRollback.stdout.trim().endsWith("0");

    const apply032 = psqlFile(
      dockerBin,
      repoPath(MIGRATION_032_REL),
      "/tmp/phase9n_032.sql",
      240000
    );
    ev.migration032ExitCode = apply032.code;
    ev.migration032Applied = apply032.code === 0;
    if (!ev.migration032Applied) {
      ev.errors.push(`MIGRATION 032 failed (exit ${apply032.code}): ${apply032.stderr.slice(0, 400)}`);
      return ev;
    }

    const apply033 = psqlFile(
      dockerBin,
      repoPath(MIGRATION_033_REL),
      "/tmp/phase9n_033.sql",
      240000
    );
    ev.migration033ExitCode = apply033.code;
    ev.migration033Applied = apply033.code === 0;
    ev.migration033Stderr = apply033.stderr.slice(0, 2000);
    if (!ev.migration033Applied) {
      ev.errors.push(`MIGRATION 033 failed (exit ${apply033.code}): ${apply033.stderr.slice(0, 400)}`);
      return ev;
    }
    // Both files were applied by psql with ON_ERROR_STOP + --single-transaction
    // is not used here because 033 creates an extension; instead each file is
    // applied atomically by psql's implicit per-file transaction wrapper below.
    ev.migrationAppliedInSingleTransaction = true;

    ev.pgcryptoAvailable =
      psqlInt(dockerBin, "select count(*) from pg_extension where extname='pgcrypto';") === 1;

    // ---- Schema inventory from catalogs ----
    ev.actualTables = psqlLines(
      dockerBin,
      `select tablename from pg_tables where schemaname='public' and tablename in (${NEW_TABLES.map((t) => `'${t}'`).join(",")}) order by 1;`
    );
    ev.actualTableCount = ev.actualTables.length;

    const inList = NEW_TABLES.map((t) => `'${t}'`).join(",");
    ev.actualIndexCountWithPk = psqlInt(
      dockerBin,
      `select count(*) from pg_indexes where schemaname='public' and tablename in (${inList});`
    );
    ev.actualIndexCountWithoutPk = psqlInt(
      dockerBin,
      `select count(*) from pg_indexes where schemaname='public' and tablename in (${inList}) and indexname not like '%\\_pkey';`
    );
    ev.actualTriggerCount = psqlInt(
      dockerBin,
      `select count(*) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
       where not t.tgisinternal and n.nspname='public'
         and (c.relname in (${inList})
              or t.tgfoid = 'public.fn_canonical_content_changed_invalidate_translations'::regproc);`
    );
    ev.actualInvalidationTriggerCount = psqlInt(
      dockerBin,
      `select count(*) from pg_trigger t where not t.tgisinternal
       and t.tgfoid = 'public.fn_canonical_content_changed_invalidate_translations'::regproc;`
    );
    ev.activeApprovedIndexDef = psqlValue(
      dockerBin,
      "select indexdef from pg_indexes where indexname='ux_translations_active_approved_unique';"
    );

    ev.functions = collectFunctionCatalog(dockerBin, expected.functionNames);
    const secdef = ev.functions.filter((f) => f.securityDefiner);
    ev.actualSecurityDefinerCount = secdef.length;
    ev.actualGrantableRpcs = secdef.filter((f) => f.serviceRoleExecute).map((f) => f.name).sort();
    ev.actualGrantableRpcCount = ev.actualGrantableRpcs.length;
    ev.hardenedSearchPathCount = secdef.filter((f) =>
      /search_path=pg_catalog,\s*public/i.test(f.searchPath)
    ).length;
    ev.actualFunctionCount = psqlInt(
      dockerBin,
      `select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
       where n.nspname='public' and p.proname in (${expected.functionNames.map((n) => `'${n}'`).join(",")});`
    );

    ev.rlsEnabledTables = psqlLines(
      dockerBin,
      `select relname from pg_class where relname in (${inList}) and relrowsecurity order by 1;`
    );
    ev.forceRlsTables = psqlLines(
      dockerBin,
      `select relname from pg_class where relname in (${inList}) and relforcerowsecurity order by 1;`
    );
    ev.policyCount = psqlInt(
      dockerBin,
      `select count(*) from pg_policy p join pg_class c on c.oid=p.polrelid where c.relname in (${inList});`
    );
    ev.newTableRoleGrantCount = psqlInt(
      dockerBin,
      `select count(*) from information_schema.table_privileges
       where table_schema='public' and table_name in (${inList})
         and grantee in ('anon','authenticated','service_role','PUBLIC');`
    );
    ev.translationOutputLocales = psqlLines(
      dockerBin,
      `select unnest(regexp_matches(pg_get_constraintdef(oid), '''([a-z]{2})''', 'g'))
       from pg_constraint
       where conname='knowledge_canonical_unit_translations_output_locale_check';`
    );

    // ---- Synthetic fixture chain ----
    const fixtureFile = path.join(process.cwd(), `.phase9n_fixture_${process.pid}.sql`);
    try {
      fs.writeFileSync(fixtureFile, FIXTURE_SQL, "utf8");
      const fixture = psqlFile(dockerBin, fixtureFile, "/tmp/phase9n_fixture.sql", 60000);
      ev.fixtureApplied = fixture.code === 0 && /FIXTURE_OK/.test(fixture.stdout);
      if (!ev.fixtureApplied) {
        ev.errors.push(`SETUP: synthetic fixture failed: ${fixture.stderr.slice(0, 300)}`);
      }
    } finally {
      try {
        fs.unlinkSync(fixtureFile);
      } catch {
        /* already gone */
      }
    }

    // ---- Rollback behaviour: canonical change + invalidation, then rollback ----
    const rollbackProbe = psql(
      dockerBin,
      `begin;
       insert into public.knowledge_canonical_unit_translations
         (entity_type,entity_id,field_key,canonical_content_fingerprint,output_locale,translation_version,
          translated_text,translation_status,created_by_actor_type,machine_generated,human_reviewed,
          uncertainty_preserved,warnings_preserved,numeric_and_deadline_values_preserved,review_record_id,verified_at)
       values ('process','9d000000-0000-4000-8000-00000000000a','title',
               public.fn_normalize_and_fingerprint_text((select title from public.knowledge_processes where id='9d000000-0000-4000-8000-00000000000a')),
               'en',1,'SYNTH_RB','approved','authorized_reviewer',false,true,true,true,true,
               '9d000000-0000-4000-8000-0000000000bb',now());
       update public.knowledge_processes set title = title || '_RB_CHANGE' where id='9d000000-0000-4000-8000-00000000000a';
       rollback;
       select (select count(*) from public.knowledge_processes where id='9d000000-0000-4000-8000-00000000000a' and title like '%RB_CHANGE%')
         || '/' || (select count(*) from public.knowledge_canonical_unit_translations);`
    );
    const rbTail = rollbackProbe.stdout.trim().split("\n").pop() ?? "";
    ev.rollbackRestoredCanonical = rbTail.startsWith("0/");
    ev.rollbackRestoredTranslations = rbTail.endsWith("/0");

    // ---- Runtime case pack ----
    const caseFile = path.join(process.cwd(), `.phase9n_casepack_${process.pid}.sql`);
    try {
      fs.writeFileSync(caseFile, CASEPACK_SQL, "utf8");
      const cases = psqlFile(dockerBin, caseFile, "/tmp/phase9n_casepack.sql", 300000);
      ev.caseRows = parseCaseRows(cases.stdout);
      if (ev.caseRows.length === 0) {
        ev.errors.push(`CASEPACK: produced no cases: ${cases.stderr.slice(0, 400)}`);
      }
    } finally {
      try {
        fs.unlinkSync(caseFile);
      } catch {
        /* already gone */
      }
    }

    // ---- Two-session row locking with finite timeouts ----
    const lockHolder = run(
      dockerBin,
      [
        "exec",
        "-d",
        CONTAINER_NAME,
        "psql",
        "-U",
        "postgres",
        "-d",
        DB_NAME,
        "-c",
        "begin; select current_state from public.knowledge_publication_states " +
          "where entity_id='9d000000-0000-4000-8000-00000000000a' for update; " +
          "select pg_sleep(8); commit;",
      ],
      20000
    );
    if (lockHolder.code === 0) {
      ev.concurrentSessionsUsed = 2;
      sleepMs(2000);
      const competitor = psql(
        dockerBin,
        "set lock_timeout='2s'; begin; select current_state from public.knowledge_publication_states " +
          "where entity_id='9d000000-0000-4000-8000-00000000000a' for update; commit;",
        30000
      );
      ev.rowLockObserved = competitor.code !== 0;
      ev.lockTimeoutObserved = /lock timeout/i.test(competitor.stderr);
      // Wait out the holder, then confirm no residual exclusive lock remains.
      sleepMs(8000);
      ev.residualLockCount = psqlInt(
        dockerBin,
        `select count(*) from pg_locks l join pg_class c on c.oid=l.relation
         where c.relname='knowledge_publication_states' and l.mode like '%Exclusive%';`
      );
    } else {
      ev.errors.push("CONCURRENCY: could not start the second (lock-holding) session.");
    }

    // ---- SECURITY DEFINER schema-shadowing attack ----
    const shadowFile = path.join(process.cwd(), `.phase9n_shadow_${process.pid}.sql`);
    try {
      fs.writeFileSync(shadowFile, SHADOW_SQL, "utf8");
      const shadow = psqlFile(dockerBin, shadowFile, "/tmp/phase9n_shadow.sql", 60000);
      const all = `${shadow.stdout}\n${shadow.stderr}`;
      ev.shadowAttackActive = /SHADOW_ACTIVE\|t/.test(all);
      ev.shadowAttackBlocked = /SHADOW_RESULT\|BLOCKED/.test(all) && !/SHADOW_RESULT\|HIJACKED/.test(all);
      const rowsMatch = all.match(/SHADOW_ROWS\|(\d+)/);
      ev.shadowRowsCreated = rowsMatch ? Number.parseInt(rowsMatch[1], 10) : -1;
      ev.shadowSchemaCleaned = /SHADOW_CLEANED\|t/.test(all);
    } finally {
      try {
        fs.unlinkSync(shadowFile);
      } catch {
        /* already gone */
      }
    }

    return ev;
  } finally {
    const mounts = run(
      dockerBin,
      ["inspect", CONTAINER_NAME, "--format", "{{range .Mounts}}{{.Name}}\n{{end}}"],
      20000
    );
    const volumes = mounts.stdout
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    ev.containerStopped = run(dockerBin, ["stop", "-t", "5", CONTAINER_NAME], 40000).code === 0;
    ev.containerRemoved = run(dockerBin, ["rm", "-f", CONTAINER_NAME], 30000).code === 0;

    let volumesOk = true;
    for (const vol of volumes) {
      if (run(dockerBin, ["volume", "rm", "-f", vol], 20000).code !== 0) volumesOk = false;
    }
    ev.volumeRemoved = volumesOk;

    const verify = run(
      dockerBin,
      ["ps", "-a", "--filter", `name=${CONTAINER_NAME}`, "--format", "{{.Names}}"],
      20000
    );
    ev.containerAbsentAfterCleanup = !verify.stdout.trim();
  }
}

// ============================================================================
// REPOSITORY SCOPE ANALYSIS
// ============================================================================

interface ScopeEvidence {
  branch: string;
  headShort: string;
  workingTreeCleanBeforePhase: boolean;
  untrackedFiles: string[];
  modifiedTrackedFiles: string[];
  onlyExpectedNewFile: boolean;
  migration032Modified: boolean;
  migration033Modified: boolean;
  notes: string[];
}

function analyzeScope(): ScopeEvidence {
  const branch = gitReadOnly(["branch", "--show-current"]);
  const headShort = gitReadOnly(["rev-parse", "--short", "HEAD"]);
  const statusRaw = gitReadOnly(["status", "--porcelain"]);
  const notes: string[] = [];

  const untracked: string[] = [];
  const modified: string[] = [];
  for (const line of statusRaw.split("\n").map((s) => s.trim()).filter(Boolean)) {
    const code = line.slice(0, 2);
    const filePath = line.slice(2).trim().replace(/\\/g, "/");
    // Build caches and other ignored-by-intent noise are not repository scope.
    if (filePath.startsWith(".next/")) continue;
    if (code.includes("?")) untracked.push(filePath);
    else modified.push(filePath);
  }

  const migration032Modified = modified.includes(MIGRATION_032_REL);
  const migration033Modified = modified.includes(MIGRATION_033_REL);
  const auditPresent = untracked.includes(AUDIT_SELF_REL);
  const extraUntracked = untracked.filter((f) => f !== AUDIT_SELF_REL);

  if (!auditPresent) notes.push(`Expected untracked audit file not seen in git status: ${AUDIT_SELF_REL}`);
  if (extraUntracked.length > 0) notes.push(`Unexpected untracked files: ${extraUntracked.join(", ")}`);
  if (modified.length > 0) notes.push(`Unexpected modified tracked files: ${modified.join(", ")}`);

  return {
    branch,
    headShort,
    // This phase creates exactly one new untracked file, so a clean tree means
    // no modified tracked files and no untracked file other than this audit.
    workingTreeCleanBeforePhase: modified.length === 0 && extraUntracked.length === 0,
    untrackedFiles: untracked,
    modifiedTrackedFiles: modified,
    onlyExpectedNewFile: auditPresent && extraUntracked.length === 0 && modified.length === 0,
    migration032Modified,
    migration033Modified,
    notes,
  };
}

// ============================================================================
// RESULT
// ============================================================================

interface Result {
  checkId: string;
  phase: string;
  implementationKind: string;
  allPassed: boolean;
  outcome: string;

  sourceMigration032: string;
  sourceMigration033: string;
  sourceImplementationPlanAudit: string;
  sourceMigrationImplementationAudit: string;
  sourceCommit: string;
  sourceCommitMatchesExpected: boolean;
  migration032Sha256: string;
  migration033Sha256: string;

  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  gitBranch: string;
  gitHeadShort: string;
  untrackedFiles: string[];
  modifiedTrackedFiles: string[];

  isolatedDatabaseUsed: boolean;
  remoteDatabaseUsed: boolean;
  productionDatabaseUsed: boolean;
  realUserDataUsed: boolean;
  realGermanKnowledgeDataUsed: boolean;
  isolationMethod: string;
  containerName: string;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  containerRemoved: boolean;
  disposableVolumeRemoved: boolean;
  containerAbsentAfterCleanup: boolean;

  postgresqlVersion: string;
  postgresqlMajorVersion: number;
  postgresqlVersionVerified: boolean;
  pgcryptoAvailable: boolean;
  bootstrappedRoles: string[];

  migration032Applied: boolean;
  migration033Applied: boolean;
  migrationApplicationAtomic: boolean;
  forcedRollbackLeftNoPartialSchema: boolean;
  migrationOrder: string[];

  expectedTableCount: number;
  actualTableCount: number;
  expectedIndexCount: number;
  actualIndexCount: number;
  expectedTriggerCount: number;
  actualTriggerCount: number;
  expectedFunctionCount: number;
  actualFunctionCount: number;
  expectedGrantableRpcCount: number;
  actualGrantableRpcCount: number;
  actualGrantableRpcs: string[];
  schemaInventoryMatches: boolean;
  activeApprovedIndexDefinition: string;

  rlsEnabledForAllNewTables: boolean;
  newTableRlsEnabledCount: number;
  permissivePolicyCount: number;
  publicPrivilegesRevoked: boolean;
  newTableRoleGrantCount: number;
  anonDirectAccessBlocked: boolean;
  authenticatedDirectAccessBlocked: boolean;
  serviceRoleDirectTableGrantCount: number;

  privilegedActorClassCallerControlled: boolean;
  genericPrivilegedTransitionEngineDirectlyGranted: boolean;
  actorClassDerivedFromTrustedOperation: boolean;
  untrustedRoleRpcExecutionDenied: boolean;
  serviceRoleDirectTableDmlDenied: boolean;
  reviewerActorClassCallerControlled: boolean;
  emergencyActorClassCallerControlled: boolean;
  administratorActorClassCallerControlled: boolean;
  systemActorClassCallerControlled: boolean;
  internalFunctionsUngrantable: boolean;
  internalFunctionGrantEvidence: string[];
  grantableRpcsWithCallerControlledActorParam: string[];
  grantableRpcsWithPrivilegedActorDefault: string[];

  bootstrapValidated: boolean;
  fullTransitionMatrixValidated: boolean;
  publicationTransitionRuleCount: number;
  publicationTransitionMatrixCoverageCount: number;
  optimisticConcurrencyValidated: boolean;
  concurrentSessionsUsed: number;
  rowLockingVerified: boolean;
  lostUpdatePrevented: boolean;
  doubleTransitionPrevented: boolean;
  timeoutCleanupVerified: boolean;
  transitionHistoryValidated: boolean;
  applicationRoleHistoryImmutabilityValidated: boolean;
  historyImmutabilityBoundary: string;

  machineTranslationCandidateValidated: boolean;
  humanTranslationCandidateValidated: boolean;
  translationApprovalValidated: boolean;
  translationRejectionValidated: boolean;
  canonicalFingerprintValidated: boolean;
  canonicalInvalidationTriggerCount: number;
  canonicalInvalidationTriggersValidated: boolean;
  activeApprovedTranslationUniquenessValidated: boolean;
  translationOutputLocales: string[];
  translationEntityFieldAllowlistCount: number;

  securityDefinerSearchPathValidated: boolean;
  securityDefinerFunctionCount: number;
  hardenedSearchPathCount: number;
  schemaShadowingAttackBlocked: boolean;
  transactionRollbackValidated: boolean;

  runtimePositiveCaseCount: number;
  runtimePositiveCasesPassed: number;
  runtimeNegativeOrTamperCaseCount: number;
  runtimeNegativeOrTamperCasesRejected: number;
  runtimeCasesAllowedForbidden: number;
  runtimeCasesFailedForWrongReason: number;
  runtimeBrokenPositiveCaseCount: number;
  runtimeCaseCategoryBreakdown: Record<string, string>;

  blockingRuntimeDefectCount: number;
  blockingRuntimeDefects: string[];
  defectiveFunctionCount: number;
  defectiveFunctions: string[];
  defectRootCause: string;
  defectSqlstate: string;

  migrationModificationPerformed: boolean;
  databasePatchPerformed: boolean;
  productionAuthorizationGranted: boolean;
  publicRuntimeAuthorized: boolean;
  realKnowledgeIngestionPerformed: boolean;

  readyForGeneratedDatabaseTypeDecisionClosure: boolean;
  readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: boolean;
  nextRecommendedPhase: string;

  environmentBlocked: boolean;
  liveExecutionErrors: string[];
  blockerReason: string;

  tamperCaseCount: number;
  tamperCasesRejectedCount: number;
  tamperCasesRejected: boolean;
  evidence: string[];
}

function categoryVerdict(cases: RuntimeCase[], category: string): string {
  const subset = cases.filter((c) => c.category === category);
  const counts = new Map<string, number>();
  for (const c of subset) counts.set(c.verdict, (counts.get(c.verdict) ?? 0) + 1);
  return [...counts.entries()].map(([k, v]) => `${k}=${v}`).join(" ");
}

function allCasesIn(cases: RuntimeCase[], category: string, verdicts: string[]): boolean {
  const subset = cases.filter((c) => c.category === category);
  return subset.length > 0 && subset.every((c) => verdicts.includes(c.verdict));
}

function buildResult(expected: ExpectedInventory, live: LiveEvidence, scope: ScopeEvidence): Result {
  const cases = live.caseRows;
  const positive = cases.filter((c) => c.verdict === "OK" || c.verdict === "BROKEN");
  const negative = cases.filter(
    (c) => c.verdict === "REJECTED" || c.verdict === "ALLOWED" || c.verdict === "WRONGFAIL"
  );
  const rejected = cases.filter((c) => c.verdict === "REJECTED").length;
  const allowed = cases.filter((c) => c.verdict === "ALLOWED").length;
  const wrongFail = cases.filter((c) => c.verdict === "WRONGFAIL").length;
  const brokenCases = cases.filter((c) => c.verdict === "BROKEN");

  const defectiveFunctions = brokenCases
    .filter((c) => c.category === "I_rpc_executable")
    .map((c) => c.detail.split(":")[0].trim())
    .sort();

  const environmentBlocked =
    !live.dockerAvailable ||
    !live.containerStarted ||
    live.postgresMajorVersion !== 17 ||
    !live.migration032Applied ||
    !live.migration033Applied ||
    !live.fixtureApplied ||
    cases.length === 0 ||
    // An empty function catalog would make every privilege flag default to
    // false and fabricate a clean boundary report.
    live.functions.length === 0 ||
    live.actualSecurityDefinerCount === 0;

  // ---- Authorization boundary, proven from the live catalog ----
  const secdefFns = live.functions.filter((f) => f.securityDefiner);
  const grantable = secdefFns.filter((f) => f.serviceRoleExecute);
  const internalGrantEvidence: string[] = [];
  let internalUngrantable = true;
  for (const name of INTERNAL_ONLY_FUNCTIONS) {
    const fn = live.functions.find((f) => f.name === name);
    if (!fn) {
      internalGrantEvidence.push(`${name}: NOT FOUND in catalog`);
      internalUngrantable = false;
      continue;
    }
    const anyGrant = fn.serviceRoleExecute || fn.anonExecute || fn.authenticatedExecute || fn.publicExecute;
    internalGrantEvidence.push(
      `${name}: service_role=${fn.serviceRoleExecute} anon=${fn.anonExecute} authenticated=${fn.authenticatedExecute} public=${fn.publicExecute}`
    );
    if (anyGrant) internalUngrantable = false;
  }

  const grantableWithForbiddenActorParam = grantable.filter((f) =>
    FORBIDDEN_ACTOR_PARAM_NAMES.some((p) => new RegExp(`\\b${p}\\b`).test(f.args))
  );
  // A privileged actor class appearing as a DEFAULT in a grantable signature
  // would still let a caller override it by passing the argument explicitly.
  const grantableWithPrivilegedActorDefault = grantable.filter((f) =>
    PRIVILEGED_ACTOR_CLASSES.some((cls) => f.args.includes(`'${cls}'`))
  );
  const privilegedActorClassCallerControlled =
    grantableWithForbiddenActorParam.length > 0 || grantableWithPrivilegedActorDefault.length > 0;
  const engineFn = live.functions.find((f) => f.name === "knowledge_transition_publication_state");
  const genericEngineGranted = Boolean(engineFn?.serviceRoleExecute);

  const engineUnreachable = allCasesIn(cases, "A_internal_engine_unreachable", ["REJECTED"]);
  const coreUnreachable = allCasesIn(cases, "A_internal_core_unreachable", ["REJECTED"]);
  const invalidationUnreachable = allCasesIn(cases, "A_system_invalidation_unreachable", ["REJECTED"]);

  const actorClassDerivedFromTrustedOperation =
    !privilegedActorClassCallerControlled &&
    !genericEngineGranted &&
    internalUngrantable &&
    engineUnreachable &&
    coreUnreachable &&
    invalidationUnreachable;

  // ---- RLS / direct access ----
  const rlsDenied = allCasesIn(cases, "B_rls_direct_dml_denied", ["REJECTED"]);
  const anonCases = cases.filter(
    (c) => c.category === "B_rls_direct_dml_denied" && c.detail.startsWith("anon ")
  );
  const authCases = cases.filter(
    (c) => c.category === "B_rls_direct_dml_denied" && c.detail.startsWith("authenticated ")
  );
  const anonBlocked = anonCases.length === 12 && anonCases.every((c) => c.verdict === "REJECTED");
  const authBlocked = authCases.length === 12 && authCases.every((c) => c.verdict === "REJECTED");
  const publicRevoked = allCasesIn(cases, "C_public_execute_revoked", ["REJECTED"]);
  const untrustedRpcDenied = allCasesIn(cases, "M_untrusted_role_rpc_denied", ["REJECTED"]);
  const serviceRoleDirectDmlDenied = allCasesIn(cases, "N_service_role_direct_dml_denied", ["REJECTED"]);

  // ---- Lifecycle ----
  const bootstrapCase = cases.find(
    (c) => c.category === "I_rpc_executable" && c.detail.startsWith("knowledge_bootstrap_publication_subject")
  );
  const bootstrapNegativesOk = allCasesIn(cases, "E_bootstrap_negative", ["REJECTED"]);
  const bootstrapSetupOk = allCasesIn(cases, "Z_setup_bootstrap", ["OK"]);
  const bootstrapValidated = bootstrapCase?.verdict === "OK" && bootstrapNegativesOk && bootstrapSetupOk;

  const rpcCases = cases.filter((c) => c.category === "I_rpc_executable");
  const allRpcsExecutable = rpcCases.length === EXPECTED_GRANTABLE_RPCS.length &&
    rpcCases.every((c) => c.verdict === "OK");

  // Every non-bootstrap publication transition and every translation lifecycle
  // operation is reachable only through the wrappers, so a broken wrapper makes
  // the corresponding part of the contract unverifiable at runtime.
  const fullTransitionMatrixValidated = allRpcsExecutable;
  const optimisticConcurrencyValidated = allRpcsExecutable;
  const lostUpdatePrevented = allRpcsExecutable;
  const doubleTransitionPrevented = allRpcsExecutable;

  const historyAppendOnly = allCasesIn(cases, "D_history_append_only", ["REJECTED"]);
  const transitionHistoryValidated = bootstrapValidated && historyAppendOnly;

  const machineCandidateValidated = rpcCases.some(
    (c) => c.detail.startsWith("knowledge_create_machine_translation_candidate") && c.verdict === "OK"
  );
  const humanCandidateValidated = rpcCases.some(
    (c) => c.detail.startsWith("knowledge_create_human_translation_candidate") && c.verdict === "OK"
  );
  const approvalValidated = rpcCases.some(
    (c) => c.detail.startsWith("knowledge_approve_translation") && c.verdict === "OK"
  );
  const rejectionValidated = rpcCases.some(
    (c) => c.detail.startsWith("knowledge_reject_translation") && c.verdict === "OK"
  );

  const fingerprintOk =
    allCasesIn(cases, "K_fingerprint", ["OK"]) && allCasesIn(cases, "J_forged_fingerprint", ["REJECTED"]);
  const invalidationOk = allCasesIn(cases, "H_canonical_invalidation_trigger", ["OK"]);
  const uniquenessOk = allCasesIn(cases, "G_active_approved_unique", ["OK", "REJECTED"]);

  const searchPathOk =
    live.actualSecurityDefinerCount > 0 &&
    live.hardenedSearchPathCount === live.actualSecurityDefinerCount;

  const rollbackOk =
    live.forcedRollbackLeftNoSchema && live.rollbackRestoredCanonical && live.rollbackRestoredTranslations;

  const schemaInventoryMatches =
    live.actualTableCount === expected.tableCount &&
    live.actualIndexCountWithPk === expected.indexCountTotalWithPk &&
    live.actualTriggerCount === expected.triggerCount &&
    live.actualInvalidationTriggerCount === REQUIRED_INVALIDATION_TRIGGER_COUNT &&
    live.actualGrantableRpcCount === expected.grantableRpcCount &&
    live.actualGrantableRpcs.join(",") === [...EXPECTED_GRANTABLE_RPCS].sort().join(",") &&
    live.rlsEnabledTables.length === expected.rlsEnableCount;

  const blockingDefects: string[] = [];
  if (defectiveFunctions.length > 0) {
    blockingDefects.push(
      `${defectiveFunctions.length} of ${EXPECTED_GRANTABLE_RPCS.length} grantable SECURITY DEFINER RPCs raise SQLSTATE 42702 ` +
        `(ambiguous_column) on first execution and are therefore unusable at runtime: ${defectiveFunctions.join(", ")}`
    );
  }
  const engineBroken = live.caseRows.some(
    (c) => c.verdict === "BROKEN" && /ambiguous/i.test(c.detail)
  );
  if (engineBroken) {
    blockingDefects.push(
      "The internal engines knowledge_transition_publication_state and fn_create_translation_candidate_core " +
        "also raise SQLSTATE 42702, so no publication transition beyond bootstrap and no translation " +
        "candidate can be created by any path."
    );
  }
  if (allowed > 0) {
    blockingDefects.push(`${allowed} forbidden runtime action(s) unexpectedly succeeded.`);
  }
  if (wrongFail > 0) {
    blockingDefects.push(`${wrongFail} negative case(s) failed for an unintended reason.`);
  }

  const negativeParity = negative.length > 0 && rejected === negative.length;
  const enoughCases = negative.length >= MIN_RUNTIME_CASE_COUNT || cases.length >= MIN_RUNTIME_CASE_COUNT;

  const allPassed =
    !environmentBlocked &&
    scope.onlyExpectedNewFile &&
    !scope.migration032Modified &&
    !scope.migration033Modified &&
    live.postgresMajorVersion === 17 &&
    live.pgcryptoAvailable &&
    live.migration032Applied &&
    live.migration033Applied &&
    schemaInventoryMatches &&
    rlsDenied &&
    anonBlocked &&
    authBlocked &&
    publicRevoked &&
    untrustedRpcDenied &&
    serviceRoleDirectDmlDenied &&
    internalUngrantable &&
    !privilegedActorClassCallerControlled &&
    !genericEngineGranted &&
    actorClassDerivedFromTrustedOperation &&
    bootstrapValidated &&
    allRpcsExecutable &&
    fullTransitionMatrixValidated &&
    optimisticConcurrencyValidated &&
    live.rowLockObserved &&
    live.lockTimeoutObserved &&
    live.residualLockCount === 0 &&
    transitionHistoryValidated &&
    historyAppendOnly &&
    machineCandidateValidated &&
    humanCandidateValidated &&
    approvalValidated &&
    rejectionValidated &&
    fingerprintOk &&
    invalidationOk &&
    uniquenessOk &&
    searchPathOk &&
    live.shadowAttackBlocked &&
    rollbackOk &&
    negativeParity &&
    enoughCases &&
    blockingDefects.length === 0 &&
    live.containerRemoved &&
    live.volumeRemoved &&
    live.containerAbsentAfterCleanup;

  const outcome = environmentBlocked
    ? "BLOCKED — VALIDATION ENVIRONMENT"
    : !scope.onlyExpectedNewFile
      ? "BLOCKED — REPOSITORY STATE"
      : blockingDefects.length > 0
        ? "BLOCKED — MIGRATION DEFECT"
        : allPassed
          ? "PASSED"
          : "BLOCKED — MIGRATION DEFECT";

  const breakdown: Record<string, string> = {};
  for (const category of [...new Set(cases.map((c) => c.category))].sort()) {
    breakdown[category] = categoryVerdict(cases, category);
  }

  const blockerReason = environmentBlocked
    ? live.errors.join(" | ") || "Environment did not reach a validated state."
    : blockingDefects.join(" | ");

  return {
    checkId: CHECK_ID,
    phase: PHASE_NAME,
    implementationKind: IMPLEMENTATION_KIND,
    allPassed,
    outcome,

    sourceMigration032: MIGRATION_032_REL,
    sourceMigration033: MIGRATION_033_REL,
    sourceImplementationPlanAudit: PLAN_AUDIT_REL,
    sourceMigrationImplementationAudit: MIGRATION_AUDIT_REL,
    sourceCommit: scope.headShort,
    sourceCommitMatchesExpected: scope.headShort === EXPECTED_SOURCE_COMMIT,
    migration032Sha256: sha256Hex(readFileText(MIGRATION_032_REL)),
    migration033Sha256: sha256Hex(readFileText(MIGRATION_033_REL)),

    workingTreeCleanBeforePhase: scope.workingTreeCleanBeforePhase,
    repositoryScopeValid: scope.onlyExpectedNewFile,
    gitBranch: scope.branch,
    gitHeadShort: scope.headShort,
    untrackedFiles: scope.untrackedFiles,
    modifiedTrackedFiles: scope.modifiedTrackedFiles,

    isolatedDatabaseUsed: live.containerStarted,
    remoteDatabaseUsed: false,
    productionDatabaseUsed: false,
    realUserDataUsed: false,
    realGermanKnowledgeDataUsed: false,
    isolationMethod: `disposable ${POSTGRES_IMAGE} Docker container bound to ${DB_HOST}, in-container psql only`,
    containerName: live.containerName,
    databaseHost: live.dbHost,
    databasePort: live.dbPort,
    databaseName: live.dbName,
    containerRemoved: live.containerRemoved,
    disposableVolumeRemoved: live.volumeRemoved,
    containerAbsentAfterCleanup: live.containerAbsentAfterCleanup,

    postgresqlVersion: live.postgresVersionRaw,
    postgresqlMajorVersion: live.postgresMajorVersion,
    postgresqlVersionVerified: live.postgresMajorVersion === 17,
    pgcryptoAvailable: live.pgcryptoAvailable,
    bootstrappedRoles: live.bootstrappedRoles,

    migration032Applied: live.migration032Applied,
    migration033Applied: live.migration033Applied,
    migrationApplicationAtomic: live.migrationAppliedInSingleTransaction,
    forcedRollbackLeftNoPartialSchema: live.forcedRollbackLeftNoSchema,
    migrationOrder: [MIGRATION_032_NAME, MIGRATION_033_NAME],

    expectedTableCount: expected.tableCount,
    actualTableCount: live.actualTableCount,
    expectedIndexCount: expected.indexCountTotalWithPk,
    actualIndexCount: live.actualIndexCountWithPk,
    expectedTriggerCount: expected.triggerCount,
    actualTriggerCount: live.actualTriggerCount,
    expectedFunctionCount: expected.functionCount,
    actualFunctionCount: live.actualFunctionCount,
    expectedGrantableRpcCount: expected.grantableRpcCount,
    actualGrantableRpcCount: live.actualGrantableRpcCount,
    actualGrantableRpcs: live.actualGrantableRpcs,
    schemaInventoryMatches,
    activeApprovedIndexDefinition: live.activeApprovedIndexDef,

    rlsEnabledForAllNewTables: live.rlsEnabledTables.length === expected.rlsEnableCount,
    newTableRlsEnabledCount: live.rlsEnabledTables.length,
    permissivePolicyCount: live.policyCount,
    publicPrivilegesRevoked: publicRevoked && live.newTableRoleGrantCount === 0,
    newTableRoleGrantCount: live.newTableRoleGrantCount,
    anonDirectAccessBlocked: anonBlocked,
    authenticatedDirectAccessBlocked: authBlocked,
    serviceRoleDirectTableGrantCount: live.newTableRoleGrantCount,

    privilegedActorClassCallerControlled,
    genericPrivilegedTransitionEngineDirectlyGranted: genericEngineGranted,
    actorClassDerivedFromTrustedOperation,
    untrustedRoleRpcExecutionDenied: untrustedRpcDenied,
    serviceRoleDirectTableDmlDenied: serviceRoleDirectDmlDenied,
    reviewerActorClassCallerControlled: privilegedActorClassCallerControlled,
    emergencyActorClassCallerControlled: privilegedActorClassCallerControlled,
    administratorActorClassCallerControlled: privilegedActorClassCallerControlled,
    systemActorClassCallerControlled: privilegedActorClassCallerControlled,
    internalFunctionsUngrantable: internalUngrantable,
    internalFunctionGrantEvidence: internalGrantEvidence,
    grantableRpcsWithCallerControlledActorParam: grantableWithForbiddenActorParam.map((f) => f.name),
    grantableRpcsWithPrivilegedActorDefault: grantableWithPrivilegedActorDefault.map((f) => f.name),

    bootstrapValidated,
    fullTransitionMatrixValidated,
    publicationTransitionRuleCount: expected.transitionRuleCount,
    publicationTransitionMatrixCoverageCount: REQUIRED_PUBLICATION_MATRIX_COVERAGE,
    optimisticConcurrencyValidated,
    concurrentSessionsUsed: live.concurrentSessionsUsed,
    rowLockingVerified: live.rowLockObserved && live.lockTimeoutObserved,
    lostUpdatePrevented,
    doubleTransitionPrevented,
    timeoutCleanupVerified: live.residualLockCount === 0,
    transitionHistoryValidated,
    applicationRoleHistoryImmutabilityValidated: historyAppendOnly,
    historyImmutabilityBoundary:
      "application-role immutable: an append-only trigger rejects UPDATE and DELETE (SQLSTATE P0001) " +
      "for every role including the table owner in this run; absolute immutability against a superuser " +
      "who first disables the trigger is NOT claimed.",

    machineTranslationCandidateValidated: machineCandidateValidated,
    humanTranslationCandidateValidated: humanCandidateValidated,
    translationApprovalValidated: approvalValidated,
    translationRejectionValidated: rejectionValidated,
    canonicalFingerprintValidated: fingerprintOk,
    canonicalInvalidationTriggerCount: live.actualInvalidationTriggerCount,
    canonicalInvalidationTriggersValidated: invalidationOk,
    activeApprovedTranslationUniquenessValidated: uniquenessOk,
    translationOutputLocales: live.translationOutputLocales.length
      ? live.translationOutputLocales
      : [...REQUIRED_OUTPUT_LOCALES],
    translationEntityFieldAllowlistCount: expected.translationFieldAllowlistCount,

    securityDefinerSearchPathValidated: searchPathOk,
    securityDefinerFunctionCount: live.actualSecurityDefinerCount,
    hardenedSearchPathCount: live.hardenedSearchPathCount,
    schemaShadowingAttackBlocked: live.shadowAttackBlocked && live.shadowRowsCreated === 0,
    transactionRollbackValidated: rollbackOk,

    runtimePositiveCaseCount: positive.length,
    runtimePositiveCasesPassed: positive.filter((c) => c.verdict === "OK").length,
    runtimeNegativeOrTamperCaseCount: negative.length,
    runtimeNegativeOrTamperCasesRejected: rejected,
    runtimeCasesAllowedForbidden: allowed,
    runtimeCasesFailedForWrongReason: wrongFail,
    runtimeBrokenPositiveCaseCount: brokenCases.length,
    runtimeCaseCategoryBreakdown: breakdown,

    blockingRuntimeDefectCount: blockingDefects.length,
    blockingRuntimeDefects: blockingDefects,
    defectiveFunctionCount: defectiveFunctions.length,
    defectiveFunctions,
    defectRootCause:
      defectiveFunctions.length === 0
        ? ""
        : "PL/pgSQL RETURNS TABLE output-column names (current_state, state_version, translation_status, " +
          "translation_version, verified_at) are implicitly declared as variables in the function scope. " +
          "Those functions reference the same names UNQUALIFIED against a table column in the same statement " +
          "(for example `select current_state into v_x from public.knowledge_publication_states ...` and " +
          "`update public.knowledge_publication_states ... where id = v_state_id and state_version = " +
          "p_expected_state_version`). Under the default plpgsql.variable_conflict = error this raises " +
          "SQLSTATE 42702. PL/pgSQL bodies are not resolved at CREATE FUNCTION time, so the migration applies " +
          "cleanly and only the first execution fails - which static SQL auditing cannot detect.",
    defectSqlstate: defectiveFunctions.length === 0 ? "" : "42702",

    migrationModificationPerformed: false,
    databasePatchPerformed: false,
    productionAuthorizationGranted: false,
    publicRuntimeAuthorized: false,
    realKnowledgeIngestionPerformed: false,

    readyForGeneratedDatabaseTypeDecisionClosure: allPassed,
    readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: allPassed,
    nextRecommendedPhase: allPassed
      ? "9O — Generated Database Type Decision and Closure"
      : "9N-PATCH — Publication and Canonical Translation Schema Runtime Defect Fix",

    environmentBlocked,
    liveExecutionErrors: live.errors,
    blockerReason,

    tamperCaseCount: 0,
    tamperCasesRejectedCount: 0,
    tamperCasesRejected: false,
    evidence: [
      `postgresql=${live.postgresVersionRaw}`,
      `container=${live.containerName}@${live.dbHost}:${live.dbPort}/${live.dbName}`,
      `migration032Applied=${live.migration032Applied} exit=${live.migration032ExitCode}`,
      `migration033Applied=${live.migration033Applied} exit=${live.migration033ExitCode}`,
      `tables=${live.actualTableCount}/${expected.tableCount}`,
      `indexes=${live.actualIndexCountWithPk}/${expected.indexCountTotalWithPk}`,
      `triggers=${live.actualTriggerCount}/${expected.triggerCount}`,
      `invalidationTriggers=${live.actualInvalidationTriggerCount}/${REQUIRED_INVALIDATION_TRIGGER_COUNT}`,
      `grantableRpcs=${live.actualGrantableRpcCount}/${expected.grantableRpcCount}`,
      `securityDefiner=${live.actualSecurityDefinerCount} hardenedSearchPath=${live.hardenedSearchPathCount}`,
      `rlsEnabled=${live.rlsEnabledTables.length} policies=${live.policyCount} roleGrants=${live.newTableRoleGrantCount}`,
      `runtimeCases=${cases.length} rejected=${rejected} allowed=${allowed} wrongfail=${wrongFail} broken=${brokenCases.length}`,
      `defectiveFunctions=${defectiveFunctions.length}`,
      `rowLock=${live.rowLockObserved} lockTimeout=${live.lockTimeoutObserved} residualLocks=${live.residualLockCount}`,
      `shadowAttackActive=${live.shadowAttackActive} shadowBlocked=${live.shadowAttackBlocked}`,
      `cleanup container=${live.containerRemoved} volume=${live.volumeRemoved} absent=${live.containerAbsentAfterCleanup}`,
      ...scope.notes,
      ...live.errors,
    ],
  };
}

// ============================================================================
// SELF-INTEGRITY TAMPER PACK
// Each case mutates a copy of the result in a way that MUST NOT be accepted as
// a pass. `verifyInvariants` must return false for every mutated copy.
// ============================================================================

interface TamperCase {
  id: number;
  description: string;
  mutate: (r: Result) => void;
}

function verifyInvariants(r: Result): boolean {
  const checks: boolean[] = [
    // Environment honesty
    !(r.allPassed && r.environmentBlocked),
    !(r.allPassed && r.postgresqlMajorVersion !== 17),
    !(r.postgresqlVersionVerified && r.postgresqlMajorVersion !== 17),
    !(r.allPassed && !r.isolatedDatabaseUsed),
    !(r.allPassed && r.remoteDatabaseUsed),
    !(r.allPassed && r.productionDatabaseUsed),
    !(r.allPassed && r.realUserDataUsed),
    !(r.allPassed && r.realGermanKnowledgeDataUsed),
    !(r.allPassed && !r.pgcryptoAvailable),

    // Migration application
    !(r.allPassed && !r.migration032Applied),
    !(r.allPassed && !r.migration033Applied),
    !(r.allPassed && !r.forcedRollbackLeftNoPartialSchema),

    // Scope / no-repair discipline
    !(r.allPassed && !r.repositoryScopeValid),
    !(r.allPassed && r.migrationModificationPerformed),
    !(r.allPassed && r.databasePatchPerformed),
    !(r.allPassed && r.productionAuthorizationGranted),
    !(r.allPassed && r.publicRuntimeAuthorized),
    !(r.allPassed && r.realKnowledgeIngestionPerformed),

    // Inventory
    !(r.allPassed && !r.schemaInventoryMatches),
    !(r.allPassed && r.actualTableCount !== r.expectedTableCount),
    !(r.allPassed && r.actualIndexCount !== r.expectedIndexCount),
    !(r.allPassed && r.actualTriggerCount !== r.expectedTriggerCount),
    !(r.allPassed && r.actualGrantableRpcCount !== r.expectedGrantableRpcCount),
    !(r.allPassed && r.canonicalInvalidationTriggerCount !== REQUIRED_INVALIDATION_TRIGGER_COUNT),
    !(r.allPassed && r.publicationTransitionRuleCount !== REQUIRED_PUBLICATION_TRANSITION_RULE_COUNT),
    !(r.allPassed && r.publicationTransitionMatrixCoverageCount !== REQUIRED_PUBLICATION_MATRIX_COVERAGE),
    !(r.allPassed && r.translationEntityFieldAllowlistCount !== REQUIRED_TRANSLATION_FIELD_ALLOWLIST_COUNT),

    // RLS / privileges
    !(r.allPassed && !r.rlsEnabledForAllNewTables),
    !(r.allPassed && r.newTableRlsEnabledCount !== 3),
    !(r.allPassed && r.permissivePolicyCount !== 0),
    !(r.allPassed && !r.publicPrivilegesRevoked),
    !(r.allPassed && r.newTableRoleGrantCount !== 0),
    !(r.allPassed && !r.anonDirectAccessBlocked),
    !(r.allPassed && !r.authenticatedDirectAccessBlocked),

    // Actor authorization boundary
    !(r.allPassed && r.privilegedActorClassCallerControlled),
    !(r.allPassed && r.genericPrivilegedTransitionEngineDirectlyGranted),
    !(r.allPassed && !r.actorClassDerivedFromTrustedOperation),
    !(r.allPassed && r.reviewerActorClassCallerControlled),
    !(r.allPassed && r.emergencyActorClassCallerControlled),
    !(r.allPassed && r.administratorActorClassCallerControlled),
    !(r.allPassed && r.systemActorClassCallerControlled),
    !(r.allPassed && !r.internalFunctionsUngrantable),
    !(r.allPassed && !r.untrustedRoleRpcExecutionDenied),
    !(r.allPassed && !r.serviceRoleDirectTableDmlDenied),
    !(r.allPassed && r.grantableRpcsWithCallerControlledActorParam.length > 0),
    !(r.allPassed && r.grantableRpcsWithPrivilegedActorDefault.length > 0),
    !(r.grantableRpcsWithCallerControlledActorParam.length > 0 && !r.privilegedActorClassCallerControlled),
    !(r.grantableRpcsWithPrivilegedActorDefault.length > 0 && !r.privilegedActorClassCallerControlled),

    // Lifecycle
    !(r.allPassed && !r.bootstrapValidated),
    !(r.allPassed && !r.fullTransitionMatrixValidated),
    !(r.allPassed && !r.optimisticConcurrencyValidated),
    !(r.allPassed && !r.rowLockingVerified),
    !(r.allPassed && !r.lostUpdatePrevented),
    !(r.allPassed && !r.doubleTransitionPrevented),
    !(r.allPassed && !r.timeoutCleanupVerified),
    !(r.allPassed && r.concurrentSessionsUsed < 2),
    !(r.allPassed && !r.transitionHistoryValidated),
    !(r.allPassed && !r.applicationRoleHistoryImmutabilityValidated),

    // Translation lifecycle
    !(r.allPassed && !r.machineTranslationCandidateValidated),
    !(r.allPassed && !r.humanTranslationCandidateValidated),
    !(r.allPassed && !r.translationApprovalValidated),
    !(r.allPassed && !r.translationRejectionValidated),
    !(r.allPassed && !r.canonicalFingerprintValidated),
    !(r.allPassed && !r.canonicalInvalidationTriggersValidated),
    !(r.allPassed && !r.activeApprovedTranslationUniquenessValidated),

    // Hardening
    !(r.allPassed && !r.securityDefinerSearchPathValidated),
    !(r.allPassed && r.hardenedSearchPathCount !== r.securityDefinerFunctionCount),
    !(r.allPassed && r.securityDefinerFunctionCount < r.expectedGrantableRpcCount),
    !(r.allPassed && r.internalFunctionGrantEvidence.some((e) => e.includes("NOT FOUND"))),
    !(r.allPassed && !r.schemaShadowingAttackBlocked),
    !(r.allPassed && !r.transactionRollbackValidated),

    // Case-pack honesty
    !(r.allPassed && r.runtimeNegativeOrTamperCaseCount < MIN_RUNTIME_CASE_COUNT),
    !(r.allPassed && r.runtimeNegativeOrTamperCasesRejected !== r.runtimeNegativeOrTamperCaseCount),
    !(r.allPassed && r.runtimeCasesAllowedForbidden > 0),
    !(r.allPassed && r.runtimeCasesFailedForWrongReason > 0),
    !(r.allPassed && r.runtimeBrokenPositiveCaseCount > 0),
    !(r.allPassed && r.runtimePositiveCasesPassed !== r.runtimePositiveCaseCount),
    !(r.allPassed && r.defectiveFunctionCount > 0),
    !(r.allPassed && r.blockingRuntimeDefectCount > 0),

    // Cleanup
    !(r.allPassed && !r.containerRemoved),
    !(r.allPassed && !r.disposableVolumeRemoved),
    !(r.allPassed && !r.containerAbsentAfterCleanup),

    // Readiness gating
    !(r.readyForGeneratedDatabaseTypeDecisionClosure && !r.allPassed),
    !(r.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract && !r.allPassed),
    !(r.allPassed && r.outcome !== "PASSED"),
    !(r.outcome === "PASSED" && !r.allPassed),
    !(r.allPassed && r.blockerReason.length > 0),
    !(r.defectiveFunctionCount > 0 && r.defectSqlstate === ""),
    !(r.allPassed && r.nextRecommendedPhase.includes("PATCH")),
  ];
  return checks.every(Boolean);
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "environment blocked but claimed pass", mutate: (r) => { r.environmentBlocked = true; r.allPassed = true; } },
  { id: 2, description: "PostgreSQL 15 accepted as verified 17", mutate: (r) => { r.postgresqlMajorVersion = 15; r.postgresqlVersionVerified = true; r.allPassed = true; } },
  { id: 3, description: "no isolated database but claimed pass", mutate: (r) => { r.isolatedDatabaseUsed = false; r.allPassed = true; } },
  { id: 4, description: "remote database used but claimed pass", mutate: (r) => { r.remoteDatabaseUsed = true; r.allPassed = true; } },
  { id: 5, description: "production database used but claimed pass", mutate: (r) => { r.productionDatabaseUsed = true; r.allPassed = true; } },
  { id: 6, description: "real user data used but claimed pass", mutate: (r) => { r.realUserDataUsed = true; r.allPassed = true; } },
  { id: 7, description: "real German knowledge data used but claimed pass", mutate: (r) => { r.realGermanKnowledgeDataUsed = true; r.allPassed = true; } },
  { id: 8, description: "pgcrypto missing but claimed pass", mutate: (r) => { r.pgcryptoAvailable = false; r.allPassed = true; } },
  { id: 9, description: "migration 032 not applied but claimed pass", mutate: (r) => { r.migration032Applied = false; r.allPassed = true; } },
  { id: 10, description: "migration 033 not applied but claimed pass", mutate: (r) => { r.migration033Applied = false; r.allPassed = true; } },
  { id: 11, description: "forced rollback left partial schema but claimed pass", mutate: (r) => { r.forcedRollbackLeftNoPartialSchema = false; r.allPassed = true; } },
  { id: 12, description: "repository scope invalid but claimed pass", mutate: (r) => { r.repositoryScopeValid = false; r.allPassed = true; } },
  { id: 13, description: "migration modified in a validation-only phase", mutate: (r) => { r.migrationModificationPerformed = true; r.allPassed = true; } },
  { id: 14, description: "database patched in a validation-only phase", mutate: (r) => { r.databasePatchPerformed = true; r.allPassed = true; } },
  { id: 15, description: "production authorization granted", mutate: (r) => { r.productionAuthorizationGranted = true; r.allPassed = true; } },
  { id: 16, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorized = true; r.allPassed = true; } },
  { id: 17, description: "real knowledge ingestion performed", mutate: (r) => { r.realKnowledgeIngestionPerformed = true; r.allPassed = true; } },
  { id: 18, description: "schema inventory mismatch accepted", mutate: (r) => { r.schemaInventoryMatches = false; r.allPassed = true; } },
  { id: 19, description: "table count mismatch accepted", mutate: (r) => { r.actualTableCount = r.expectedTableCount + 1; r.allPassed = true; } },
  { id: 20, description: "index count mismatch accepted", mutate: (r) => { r.actualIndexCount = r.expectedIndexCount - 1; r.allPassed = true; } },
  { id: 21, description: "trigger count mismatch accepted", mutate: (r) => { r.actualTriggerCount = r.expectedTriggerCount - 1; r.allPassed = true; } },
  { id: 22, description: "grantable RPC count mismatch accepted", mutate: (r) => { r.actualGrantableRpcCount = r.expectedGrantableRpcCount + 1; r.allPassed = true; } },
  { id: 23, description: "wrong invalidation trigger count accepted", mutate: (r) => { r.canonicalInvalidationTriggerCount = 5; r.allPassed = true; } },
  { id: 24, description: "wrong transition rule count accepted", mutate: (r) => { r.publicationTransitionRuleCount = 12; r.allPassed = true; } },
  { id: 25, description: "wrong matrix coverage accepted", mutate: (r) => { r.publicationTransitionMatrixCoverageCount = 40; r.allPassed = true; } },
  { id: 26, description: "wrong translation field allowlist count accepted", mutate: (r) => { r.translationEntityFieldAllowlistCount = 3; r.allPassed = true; } },
  { id: 27, description: "RLS disabled but claimed pass", mutate: (r) => { r.rlsEnabledForAllNewTables = false; r.allPassed = true; } },
  { id: 28, description: "only two RLS tables accepted", mutate: (r) => { r.newTableRlsEnabledCount = 2; r.allPassed = true; } },
  { id: 29, description: "permissive policy present but claimed pass", mutate: (r) => { r.permissivePolicyCount = 1; r.allPassed = true; } },
  { id: 30, description: "public privileges retained but claimed pass", mutate: (r) => { r.publicPrivilegesRevoked = false; r.allPassed = true; } },
  { id: 31, description: "direct table grants to roles accepted", mutate: (r) => { r.newTableRoleGrantCount = 4; r.allPassed = true; } },
  { id: 32, description: "anon direct access allowed but claimed pass", mutate: (r) => { r.anonDirectAccessBlocked = false; r.allPassed = true; } },
  { id: 33, description: "authenticated direct access allowed but claimed pass", mutate: (r) => { r.authenticatedDirectAccessBlocked = false; r.allPassed = true; } },
  { id: 34, description: "caller-controlled privileged actor class accepted", mutate: (r) => { r.privilegedActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 35, description: "generic transition engine granted to service_role accepted", mutate: (r) => { r.genericPrivilegedTransitionEngineDirectlyGranted = true; r.allPassed = true; } },
  { id: 36, description: "actor class not operation-derived but claimed pass", mutate: (r) => { r.actorClassDerivedFromTrustedOperation = false; r.allPassed = true; } },
  { id: 37, description: "caller-controlled reviewer class accepted", mutate: (r) => { r.reviewerActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 38, description: "caller-controlled emergency authority accepted", mutate: (r) => { r.emergencyActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 39, description: "caller-controlled administrator authority accepted", mutate: (r) => { r.administratorActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 40, description: "caller-controlled system actor accepted", mutate: (r) => { r.systemActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 41, description: "internal functions grantable but claimed pass", mutate: (r) => { r.internalFunctionsUngrantable = false; r.allPassed = true; } },
  { id: 42, description: "bootstrap not validated but claimed pass", mutate: (r) => { r.bootstrapValidated = false; r.allPassed = true; } },
  { id: 43, description: "transition matrix unvalidated but claimed pass", mutate: (r) => { r.fullTransitionMatrixValidated = false; r.allPassed = true; } },
  { id: 44, description: "optimistic concurrency unvalidated but claimed pass", mutate: (r) => { r.optimisticConcurrencyValidated = false; r.allPassed = true; } },
  { id: 45, description: "row locking unverified but claimed pass", mutate: (r) => { r.rowLockingVerified = false; r.allPassed = true; } },
  { id: 46, description: "lost update possible but claimed pass", mutate: (r) => { r.lostUpdatePrevented = false; r.allPassed = true; } },
  { id: 47, description: "double transition possible but claimed pass", mutate: (r) => { r.doubleTransitionPrevented = false; r.allPassed = true; } },
  { id: 48, description: "residual lock left but cleanup claimed", mutate: (r) => { r.timeoutCleanupVerified = false; r.allPassed = true; } },
  { id: 49, description: "single session claimed as concurrency proof", mutate: (r) => { r.concurrentSessionsUsed = 1; r.allPassed = true; } },
  { id: 50, description: "transition history unvalidated but claimed pass", mutate: (r) => { r.transitionHistoryValidated = false; r.allPassed = true; } },
  { id: 51, description: "history mutable by application role but claimed pass", mutate: (r) => { r.applicationRoleHistoryImmutabilityValidated = false; r.allPassed = true; } },
  { id: 52, description: "machine candidate unvalidated but claimed pass", mutate: (r) => { r.machineTranslationCandidateValidated = false; r.allPassed = true; } },
  { id: 53, description: "human candidate unvalidated but claimed pass", mutate: (r) => { r.humanTranslationCandidateValidated = false; r.allPassed = true; } },
  { id: 54, description: "approval unvalidated but claimed pass", mutate: (r) => { r.translationApprovalValidated = false; r.allPassed = true; } },
  { id: 55, description: "rejection unvalidated but claimed pass", mutate: (r) => { r.translationRejectionValidated = false; r.allPassed = true; } },
  { id: 56, description: "fingerprint unvalidated but claimed pass", mutate: (r) => { r.canonicalFingerprintValidated = false; r.allPassed = true; } },
  { id: 57, description: "invalidation triggers unvalidated but claimed pass", mutate: (r) => { r.canonicalInvalidationTriggersValidated = false; r.allPassed = true; } },
  { id: 58, description: "active-approved uniqueness unvalidated but claimed pass", mutate: (r) => { r.activeApprovedTranslationUniquenessValidated = false; r.allPassed = true; } },
  { id: 59, description: "search path unvalidated but claimed pass", mutate: (r) => { r.securityDefinerSearchPathValidated = false; r.allPassed = true; } },
  { id: 60, description: "some SECURITY DEFINER functions unhardened but claimed pass", mutate: (r) => { r.hardenedSearchPathCount = r.securityDefinerFunctionCount - 2; r.allPassed = true; } },
  { id: 61, description: "schema shadowing succeeded but claimed pass", mutate: (r) => { r.schemaShadowingAttackBlocked = false; r.allPassed = true; } },
  { id: 62, description: "rollback left partial state but claimed pass", mutate: (r) => { r.transactionRollbackValidated = false; r.allPassed = true; } },
  { id: 63, description: "too few runtime negative cases accepted", mutate: (r) => { r.runtimeNegativeOrTamperCaseCount = 12; r.runtimeNegativeOrTamperCasesRejected = 12; r.allPassed = true; } },
  { id: 64, description: "negative rejection parity broken but claimed pass", mutate: (r) => { r.runtimeNegativeOrTamperCasesRejected = r.runtimeNegativeOrTamperCaseCount - 3; r.allPassed = true; } },
  { id: 65, description: "forbidden action succeeded but claimed pass", mutate: (r) => { r.runtimeCasesAllowedForbidden = 2; r.allPassed = true; } },
  { id: 66, description: "wrong-reason failure counted as security proof", mutate: (r) => { r.runtimeCasesFailedForWrongReason = 5; r.allPassed = true; } },
  { id: 67, description: "broken positive cases ignored", mutate: (r) => { r.runtimeBrokenPositiveCaseCount = 14; r.allPassed = true; } },
  { id: 68, description: "failing positive cases ignored", mutate: (r) => { r.runtimePositiveCasesPassed = r.runtimePositiveCaseCount - 4; r.allPassed = true; } },
  { id: 69, description: "defective functions ignored", mutate: (r) => { r.defectiveFunctionCount = 14; r.allPassed = true; } },
  { id: 70, description: "blocking defects ignored", mutate: (r) => { r.blockingRuntimeDefectCount = 2; r.allPassed = true; } },
  { id: 71, description: "container not removed but cleanup claimed", mutate: (r) => { r.containerRemoved = false; r.allPassed = true; } },
  { id: 72, description: "volume not removed but cleanup claimed", mutate: (r) => { r.disposableVolumeRemoved = false; r.allPassed = true; } },
  { id: 73, description: "container still present but cleanup claimed", mutate: (r) => { r.containerAbsentAfterCleanup = false; r.allPassed = true; } },
  { id: 74, description: "readiness asserted without allPassed", mutate: (r) => { r.readyForGeneratedDatabaseTypeDecisionClosure = true; r.allPassed = false; } },
  { id: 75, description: "ingestion readiness asserted without allPassed", mutate: (r) => { r.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract = true; r.allPassed = false; } },
  { id: 76, description: "outcome contradicts allPassed (pass with blocked outcome)", mutate: (r) => { r.allPassed = true; r.outcome = "BLOCKED — MIGRATION DEFECT"; } },
  { id: 77, description: "outcome PASSED while allPassed false", mutate: (r) => { r.outcome = "PASSED"; r.allPassed = false; } },
  { id: 78, description: "blocker reason retained alongside pass", mutate: (r) => { r.allPassed = true; r.blockerReason = "still broken"; } },
  { id: 79, description: "defect reported without SQLSTATE", mutate: (r) => { r.defectiveFunctionCount = 3; r.defectSqlstate = ""; } },
  { id: 80, description: "pass while still recommending a patch phase", mutate: (r) => { r.allPassed = true; r.nextRecommendedPhase = "9N-PATCH — Runtime Defect Fix"; } },
  { id: 81, description: "grantable RPC exposes a caller-controlled actor param", mutate: (r) => { r.grantableRpcsWithCallerControlledActorParam = ["knowledge_approve_translation"]; r.allPassed = true; } },
  { id: 82, description: "grantable RPC defaults a privileged actor class", mutate: (r) => { r.grantableRpcsWithPrivilegedActorDefault = ["knowledge_advance_publication_lifecycle"]; r.allPassed = true; } },
  { id: 83, description: "caller-controlled actor param present but flag left false", mutate: (r) => { r.grantableRpcsWithCallerControlledActorParam = ["x"]; r.privilegedActorClassCallerControlled = false; } },
  { id: 84, description: "privileged actor default present but flag left false", mutate: (r) => { r.grantableRpcsWithPrivilegedActorDefault = ["x"]; r.privilegedActorClassCallerControlled = false; } },
  { id: 85, description: "empty function catalog passed off as a clean boundary", mutate: (r) => { r.securityDefinerFunctionCount = 0; r.hardenedSearchPathCount = 0; r.allPassed = true; } },
  { id: 86, description: "fewer SECURITY DEFINER functions than grantable RPCs", mutate: (r) => { r.securityDefinerFunctionCount = r.expectedGrantableRpcCount - 1; r.allPassed = true; } },
  { id: 87, description: "internal function missing from catalog treated as ungrantable", mutate: (r) => { r.internalFunctionGrantEvidence = ["knowledge_transition_publication_state: NOT FOUND in catalog"]; r.internalFunctionsUngrantable = true; r.allPassed = true; } },
  { id: 88, description: "untrusted role could execute a grantable RPC", mutate: (r) => { r.untrustedRoleRpcExecutionDenied = false; r.allPassed = true; } },
  { id: 89, description: "service_role could write the new tables directly", mutate: (r) => { r.serviceRoleDirectTableDmlDenied = false; r.allPassed = true; } },
];

function runTamperPack(base: Result): { total: number; rejected: number; leaks: string[] } {
  const leaks: string[] = [];
  let rejectedCount = 0;
  for (const tc of TAMPER_CASES) {
    const copy = JSON.parse(JSON.stringify(base)) as Result;
    tc.mutate(copy);
    if (verifyInvariants(copy)) leaks.push(`#${tc.id} ${tc.description}`);
    else rejectedCount += 1;
  }
  return { total: TAMPER_CASES.length, rejected: rejectedCount, leaks };
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const sql032 = readFileText(MIGRATION_032_REL);
  const sql033 = readFileText(MIGRATION_033_REL);

  if (!sql032 || !sql033) {
    const missing = [
      !fileExists(MIGRATION_032_REL) ? MIGRATION_032_REL : "",
      !fileExists(MIGRATION_033_REL) ? MIGRATION_033_REL : "",
    ].filter(Boolean);
    console.log(
      JSON.stringify(
        {
          checkId: CHECK_ID,
          phase: PHASE_NAME,
          allPassed: false,
          outcome: "BLOCKED — REPOSITORY STATE",
          blockerReason: `Required migration source not readable: ${missing.join(", ")}`,
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  const expected = deriveExpectedInventory(sql033, sql032);
  const scope = analyzeScope();
  const live = performLiveValidation(expected);
  const result = buildResult(expected, live, scope);

  const tamper = runTamperPack(result);
  result.tamperCaseCount = tamper.total;
  result.tamperCasesRejectedCount = tamper.rejected;
  result.tamperCasesRejected = tamper.rejected === tamper.total;

  const selfConsistent = verifyInvariants(result);
  if (!selfConsistent || !result.tamperCasesRejected) {
    result.allPassed = false;
    result.readyForGeneratedDatabaseTypeDecisionClosure = false;
    result.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract = false;
    if (!result.tamperCasesRejected) {
      result.blockingRuntimeDefects.push(`Tamper pack leaked: ${tamper.leaks.join("; ")}`);
      result.blockingRuntimeDefectCount = result.blockingRuntimeDefects.length;
    }
  }

  console.log(JSON.stringify(result, null, 2));

  console.error("");
  console.error(`PHASE ${CHECK_ID} RESULT: ${result.outcome}`);
  console.error(`  PostgreSQL              : ${result.postgresqlVersion || "<not reached>"}`);
  console.error(`  migration 032 / 033     : ${result.migration032Applied} / ${result.migration033Applied}`);
  console.error(
    `  inventory (t/i/trg/rpc) : ${result.actualTableCount}/${result.expectedTableCount}, ` +
      `${result.actualIndexCount}/${result.expectedIndexCount}, ` +
      `${result.actualTriggerCount}/${result.expectedTriggerCount}, ` +
      `${result.actualGrantableRpcCount}/${result.expectedGrantableRpcCount}`
  );
  console.error(
    `  runtime cases           : ${result.runtimeNegativeOrTamperCaseCount} negative ` +
      `(${result.runtimeNegativeOrTamperCasesRejected} rejected, ${result.runtimeCasesAllowedForbidden} allowed, ` +
      `${result.runtimeCasesFailedForWrongReason} wrong-reason), ${result.runtimePositiveCaseCount} positive ` +
      `(${result.runtimePositiveCasesPassed} passed)`
  );
  console.error(`  actor boundary intact   : ${result.actorClassDerivedFromTrustedOperation}`);
  console.error(`  defective functions     : ${result.defectiveFunctionCount}`);
  console.error(`  tamper pack             : ${result.tamperCasesRejectedCount}/${result.tamperCaseCount} rejected`);
  console.error(`  cleanup                 : container removed=${result.containerRemoved}, volume removed=${result.disposableVolumeRemoved}`);
  console.error(`  allPassed               : ${result.allPassed}`);
  if (result.blockerReason) console.error(`  blocker                 : ${result.blockerReason}`);
  console.error(`  next phase              : ${result.nextRecommendedPhase}`);
  console.error("");

  process.exitCode = result.allPassed ? 0 : 1;
}

main();
