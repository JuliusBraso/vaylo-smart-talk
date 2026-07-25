/**
 * PHASE 9N-PATCH — Publication and Canonical Translation Schema Runtime Defect Fix.
 *
 * Validates `supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql`
 * against a disposable, local PostgreSQL 17 container, applying the real
 * committed migration chain 032 -> 033 -> 034.
 *
 * PHASE 9N proved at runtime that 14 of the 15 grantable SECURITY DEFINER RPCs
 * introduced by migration 033 raise `SQLSTATE 42702 (ambiguous_column)` on first
 * execution, because `returns table(...)` output columns are implicitly declared
 * as PL/pgSQL variables and the bodies referenced identically-named table
 * columns without qualification. Migration 034 is a forward-only repair that
 * replaces the 14 affected function bodies with fully alias-qualified SQL and
 * changes nothing else.
 *
 * This audit is runtime-first. Static text analysis is used only to enumerate
 * the ambiguity surface and is explicitly labelled as a lexical heuristic;
 * every security, contract and behavioural claim is proven by executing SQL
 * against the live database. It fails closed and exits non-zero on any defect.
 *
 * It also runs the PHASE 9N validation suite as a real child process and gates
 * on that child's own exit status and output. Two harness defects that made
 * this file single-use were repaired: the child was invoked through `npx`,
 * which Node cannot spawn without a shell on Windows (`ENOENT`), so it never
 * actually ran; and repository scope demanded a working-tree shape that could
 * only ever hold for one moment in the repair sequence. The child is now
 * launched shell-free through the already-installed tsx CLI, and repository
 * scope is expressed as explicitly recognised state profiles.
 *
 * SAFETY: local disposable container only. No remote host, no Supabase link, no
 * production or staging database, no real user or German knowledge data. All
 * fixtures are synthetic and clearly labelled SYNTHETIC_9NP_*.
 */

import { execFileSync, spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ============================================================================
// CONSTANTS
// ============================================================================

const CHECK_ID = "9N-PATCH";
const PHASE_NAME = "Publication and Canonical Translation Schema Runtime Defect Fix";
const IMPLEMENTATION_KIND = "isolated_local_postgresql_runtime_patch_validation";
/**
 * Reported for provenance only. Validity is never pinned to a global HEAD:
 * doing so is what made the PHASE 9N runner single-use, and any later
 * legitimate commit would break this suite the same way.
 */
const REFERENCE_SOURCE_COMMIT = "b338174";

const MIGRATIONS_DIR = "supabase/migrations";
const MIGRATION_032_NAME = "032_create_minimal_knowledge_schema.sql";
const MIGRATION_033_NAME = "033_add_publication_and_canonical_translation_schema.sql";
const MIGRATION_034_NAME = "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql";
const MIGRATION_032_REL = `${MIGRATIONS_DIR}/${MIGRATION_032_NAME}`;
const MIGRATION_033_REL = `${MIGRATIONS_DIR}/${MIGRATION_033_NAME}`;
const MIGRATION_034_REL = `${MIGRATIONS_DIR}/${MIGRATION_034_NAME}`;

const PHASE_9N_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-isolated-postgresql-validation-audit.ts";
const AUDIT_SELF_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-runtime-defect-fix-audit.ts";

/**
 * Recognised repository shapes.
 *
 * The original single-use rule demanded zero modified tracked files with both
 * patch artifacts untracked, which pinned the working-tree shape of the phase
 * that wrote this file: it fails before the artifacts are committed (the PHASE
 * 9N runner is intentionally modified) and again after (they stop being
 * untracked). Profiles replace that with two explicitly recognised states.
 *
 * Each profile lists the ONLY paths allowed to appear in `git status`. Anything
 * outside the active profile's sets is an unrelated change and fails scope, so
 * this is a re-scoping rather than a relaxation. `AUDIT_SELF_REL` appears in
 * both the modified and untracked sets of the pre-commit profile because it is
 * edited during this phase while still being untracked, so git reports it as
 * `??` rather than ` M`.
 */
const REPOSITORY_STATE_PROFILES = {
  pre_commit_patch_closure: {
    description:
      "PHASE 9N runner repaired and PHASE 9N-PATCH audit repaired, migration 034 not yet committed.",
    allowedModified: [PHASE_9N_AUDIT_REL, AUDIT_SELF_REL],
    allowedUntracked: [MIGRATION_034_REL, AUDIT_SELF_REL],
    requiredPresent: [MIGRATION_034_REL, AUDIT_SELF_REL, PHASE_9N_AUDIT_REL],
  },
  committed_regression: {
    description: "All three artifacts committed; this audit runs as a durable regression suite.",
    allowedModified: [],
    allowedUntracked: [],
    requiredPresent: [MIGRATION_034_REL, AUDIT_SELF_REL, PHASE_9N_AUDIT_REL],
  },
} as const;

type RepositoryStateProfileName = keyof typeof REPOSITORY_STATE_PROFILES;

/**
 * Coverage floors the child PHASE 9N run must meet. These are floors rather
 * than equalities: coverage may legitimately grow, but it may never shrink,
 * and passed/rejected must always reach parity with the observed totals.
 */
const EXPECTED_CHILD_POSITIVE_CASES = 32;
const EXPECTED_CHILD_NEGATIVE_CASES = 116;

/**
 * PHASE 9N runner fields that are aliases of `allRpcsExecutable` rather than
 * independent measurements. Recorded, not repaired, in this phase: the real
 * measurements for all four already exist in this audit.
 */
const PHASE_9N_RUNNER_PROXY_FLAGS = [
  "fullTransitionMatrixValidated",
  "optimisticConcurrencyValidated",
  "lostUpdatePrevented",
  "doubleTransitionPrevented",
] as const;

const CONTAINER_NAME = "phase9np-pg17-validation";
const DB_NAME = "phase9np_validation";
const BASELINE_DB_NAME = "phase9np_baseline";
const DB_HOST = "127.0.0.1";
const POSTGRES_IMAGE = "postgres:17";
const CANDIDATE_PORTS = [55452, 55453, 55454, 55455, 55456] as const;

const NEW_TABLES = [
  "knowledge_publication_states",
  "knowledge_publication_state_transitions",
  "knowledge_canonical_unit_translations",
] as const;

/** Never executable by any application role, before or after the patch. */
const INTERNAL_ONLY_FUNCTIONS = [
  "knowledge_transition_publication_state",
  "fn_create_translation_candidate_core",
  "knowledge_invalidate_translation_for_canonical_change",
  "fn_canonical_content_changed_invalidate_translations",
] as const;

/** The 15 narrow wrappers granted to service_role by migration 033. */
const GRANTABLE_RPCS = [
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
] as const;

/**
 * The 14 grantable RPCs PHASE 9N observed raising 42702. Exactly
 * GRANTABLE_RPCS minus the bootstrap RPC, which was already fully qualified.
 */
const PREVIOUSLY_BROKEN_RPCS = GRANTABLE_RPCS.filter(
  (n) => n !== "knowledge_bootstrap_publication_subject"
);

const REQUIRED_MATRIX_COVERAGE = 90;
const REQUIRED_TRANSITION_RULE_COUNT = 20;
const REQUIRED_INVALIDATION_TRIGGER_COUNT = 8;
const MIN_PATCH_TAMPER_CASES = 40;
const EXPECTED_PREVIOUSLY_BROKEN_COUNT = 14;
const EXPECTED_AFFECTED_FUNCTION_COUNT = 14;

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

/** Existence check for paths outside the repository (Node binary, tsx CLI). */
function fileExistsAbsolute(abs: string): boolean {
  try {
    return fs.existsSync(abs);
  } catch {
    return false;
  }
}

function sha256Hex(text: string): string {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function gitReadOnly(args: string[]): string {
  try {
    return execFileSync("git", args, { encoding: "utf8", cwd: process.cwd(), timeout: 10000 }).trim();
  } catch {
    return "";
  }
}

interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
}

function run(bin: string, args: string[], timeoutMs = 60000): RunResult {
  const res = spawnSync(bin, args, {
    encoding: "utf8",
    timeout: timeoutMs,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) return { code: 1, stdout: res.stdout || "", stderr: String(res.error) };
  return { code: res.status ?? 1, stdout: res.stdout || "", stderr: res.stderr || "" };
}

function resolveDockerBinary(): string {
  const direct = spawnSync("docker", ["--version"], { encoding: "utf8", timeout: 8000 });
  if (direct.status === 0) return "docker";
  const candidates = [
    path.join(process.env.LOCALAPPDATA || "", "Programs", "DockerDesktop", "resources", "bin", "docker.exe"),
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

function psqlOn(dockerBin: string, db: string, sql: string, timeoutMs = 60000): RunResult {
  return run(
    dockerBin,
    ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", db, "-t", "-A", "-c", sql],
    timeoutMs
  );
}

function psql(dockerBin: string, sql: string, timeoutMs = 60000): RunResult {
  return psqlOn(dockerBin, DB_NAME, sql, timeoutMs);
}

function psqlValue(dockerBin: string, sql: string): string {
  const res = psql(dockerBin, sql);
  return res.code === 0 ? res.stdout.trim() : "";
}

function psqlInt(dockerBin: string, sql: string): number {
  const n = Number.parseInt(psqlValue(dockerBin, sql), 10);
  return Number.isFinite(n) ? n : -1;
}

function psqlLines(dockerBin: string, sql: string, timeoutMs = 60000): string[] {
  const res = psql(dockerBin, sql, timeoutMs);
  if (res.code !== 0) return [];
  return res.stdout.split("\n").map((s) => s.trim()).filter(Boolean);
}

function psqlFileOn(
  dockerBin: string,
  db: string,
  localPath: string,
  containerPath: string,
  extraArgs: string[] = [],
  timeoutMs = 180000
): RunResult {
  const copy = run(dockerBin, ["cp", localPath, `${CONTAINER_NAME}:${containerPath}`], 30000);
  if (copy.code !== 0) return copy;
  return run(
    dockerBin,
    ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", db, "-t", "-A", ...extraArgs, "-f", containerPath],
    timeoutMs
  );
}

function writeTemp(dir: string, name: string, contents: string): string {
  const p = path.join(dir, name);
  fs.writeFileSync(p, contents, "utf8");
  return p;
}

// ============================================================================
// STATIC AMBIGUITY ANALYSIS (LEXICAL HEURISTIC — NOT A SQL PARSER)
//
// Enumerates, per PL/pgSQL function, the `returns table(...)` output columns
// (which PostgreSQL implicitly declares as variables) and then counts bare,
// unqualified occurrences of those names inside the function body. Contexts
// that can never be ambiguous are removed first: INSERT column lists and
// UPDATE SET assignment targets are always resolved as columns.
//
// This is a heuristic over text, not a grammar-complete parse. It is used only
// to enumerate and locate the ambiguity surface. Every pass/fail claim in this
// audit is decided by real PostgreSQL execution, and the heuristic is
// self-calibrated below against the runtime-confirmed PHASE 9N defect set.
// ============================================================================

interface ParsedFunction {
  name: string;
  signature: string;
  returnsTableColumns: string[];
  body: string;
}

function parseFunctions(sql: string): ParsedFunction[] {
  const out: ParsedFunction[] = [];
  const re = /create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(([\s\S]*?)\)\s*returns([\s\S]*?)\bas\s+\$\$([\s\S]*?)\$\$\s*;/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    const name = m[1];
    const args = m[2];
    const returnsClause = m[3];
    const body = m[4];
    const tableMatch = /table\s*\(([\s\S]*?)\)\s*language/i.exec(returnsClause);
    const cols: string[] = [];
    if (tableMatch) {
      for (const part of tableMatch[1].split(",")) {
        const nameMatch = /^\s*([a-z0-9_]+)\s+/i.exec(part);
        if (nameMatch) cols.push(nameMatch[1]);
      }
    }
    out.push({
      name,
      signature: `${name}(${args.replace(/\s+/g, " ").trim()})`,
      returnsTableColumns: cols,
      body,
    });
  }
  return out;
}

/** Blank out contexts where an identifier is unconditionally a column. */
function maskUnambiguousContexts(body: string): string {
  let t = body;
  // Line comments and string literals cannot contain a column reference.
  t = t.replace(/--[^\n]*/g, (s) => " ".repeat(s.length));
  t = t.replace(/'(?:[^']|'')*'/g, (s) => " ".repeat(s.length));
  // INSERT column lists: `insert into public.x ( a, b, c )`.
  t = t.replace(/(insert\s+into\s+[\w."]+\s*\()([^)]*)(\))/gi, (_all, a: string, cols: string, c: string) =>
    a + " ".repeat(cols.length) + c
  );
  // UPDATE SET assignment targets, up to WHERE/RETURNING/end of statement.
  t = t.replace(/(\bset\b)([\s\S]*?)(\bwhere\b|\breturning\b|;)/gi, (_all, s: string, mid: string, tail: string) => {
    const masked = mid.replace(/\b([a-z0-9_]+)\s*=/gi, (assign: string) => " ".repeat(assign.length));
    return s + masked + tail;
  });
  return t;
}

interface AmbiguityFinding {
  functionName: string;
  identifier: string;
  occurrences: number;
}

function findAmbiguousReferences(fn: ParsedFunction): AmbiguityFinding[] {
  if (fn.returnsTableColumns.length === 0) return [];
  const masked = maskUnambiguousContexts(fn.body);
  const findings: AmbiguityFinding[] = [];
  for (const col of fn.returnsTableColumns) {
    // Bare occurrence: not preceded by `.` (alias-qualified) and not part of a
    // longer identifier such as `v_current_state` or `resulting_state_version`.
    const re = new RegExp(`(?<![\\w.])${col}(?![\\w])`, "g");
    const hits = masked.match(re);
    if (hits && hits.length > 0) {
      findings.push({ functionName: fn.name, identifier: col, occurrences: hits.length });
    }
  }
  return findings;
}

interface StaticAmbiguityReport {
  functionsScanned: number;
  findings: AmbiguityFinding[];
  totalReferences: number;
  functionsWithFindings: string[];
}

function analyseAmbiguity(functions: ParsedFunction[]): StaticAmbiguityReport {
  const findings: AmbiguityFinding[] = [];
  for (const fn of functions) findings.push(...findAmbiguousReferences(fn));
  return {
    functionsScanned: functions.length,
    findings,
    totalReferences: findings.reduce((a, f) => a + f.occurrences, 0),
    functionsWithFindings: [...new Set(findings.map((f) => f.functionName))].sort(),
  };
}

/**
 * Effective post-patch definitions: every 033 function, with any function that
 * 034 replaces overridden by the 034 definition.
 */
function effectiveFunctions(sql033: string, sql034: string): ParsedFunction[] {
  const from033 = parseFunctions(sql033);
  const from034 = parseFunctions(sql034);
  const replaced = new Map(from034.map((f) => [f.name, f]));
  return from033.map((f) => replaced.get(f.name) ?? f);
}

// ============================================================================
// EMBEDDED SQL
// ============================================================================

const FIXTURE_SQL = `
-- Synthetic fixture chain. SYNTHETIC_9NP_* labels only; deterministic UUIDs.
-- No real German legal, bureaucratic or user content anywhere in this file.
insert into public.knowledge_trust_domains (id, code, name)
values ('9d000000-0000-4000-8000-000000000001', 'de', 'SYNTHETIC_9NP_TRUST_DOMAIN');

insert into public.knowledge_publishers (id, publisher_name, publisher_type, trust_domain_id)
values ('9d000000-0000-4000-8000-000000000002', 'SYNTHETIC_9NP_PUBLISHER', 'synthetic',
        '9d000000-0000-4000-8000-000000000001');

insert into public.knowledge_jurisdictions (id, jurisdiction_level, name)
values ('9d000000-0000-4000-8000-000000000003', 'de_federal', 'SYNTHETIC_9NP_JURISDICTION');

insert into public.knowledge_territorial_scopes (id, scope_type)
values ('9d000000-0000-4000-8000-000000000004', 'synthetic_scope');

insert into public.knowledge_authorities
  (id, publisher_id, authority_name, authority_type, jurisdiction_id, territorial_scope_id)
values ('9d000000-0000-4000-8000-000000000005', '9d000000-0000-4000-8000-000000000002',
        'SYNTHETIC_9NP_AUTHORITY', 'synthetic', '9d000000-0000-4000-8000-000000000003',
        '9d000000-0000-4000-8000-000000000004');

insert into public.knowledge_sources
  (id, publisher_id, source_type, source_purpose, jurisdiction_id, source_language)
values ('9d000000-0000-4000-8000-000000000006', '9d000000-0000-4000-8000-000000000002',
        'synthetic', 'synthetic_validation', '9d000000-0000-4000-8000-000000000003', 'de');

insert into public.knowledge_source_versions (id, source_id, version_sequence, content_hash)
values ('9d000000-0000-4000-8000-000000000007', '9d000000-0000-4000-8000-000000000006', 1,
        'SYNTHETIC_9NP_HASH_0001');

insert into public.knowledge_responsible_actor_rules (id, actor_state)
values ('9d000000-0000-4000-8000-000000000008', 'synthetic_actor_state');

-- Synthetic German-like text (umlauts + sharp s) to exercise Unicode NFC
-- fingerprint determinism. Deliberately NOT real legal content.
insert into public.knowledge_processes
  (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
values ('9d000000-0000-4000-8000-00000000000a', 'anmeldung_ummeldung_abmeldung',
        'SYNTHETIC_9NP_PROZESS_TITEL_äöüß', '9d000000-0000-4000-8000-000000000003', 'low',
        'SYNTHETIC_9NP_AUSLÖSER_BESCHREIBUNG_äöüß', 'SYNTHETIC_9NP_ERSTER_SCHRITT_äöüß');

insert into public.knowledge_process_steps
  (id, process_id, step_order, step_type, title, responsible_actor_rule_id, description_canonical)
values ('9d000000-0000-4000-8000-00000000000b', '9d000000-0000-4000-8000-00000000000a', 0,
        'synthetic_step', 'SYNTHETIC_9NP_SCHRITT_TITEL_äöüß',
        '9d000000-0000-4000-8000-000000000008', 'SYNTHETIC_9NP_SCHRITT_BESCHREIBUNG_äöüß');

insert into public.knowledge_claims
  (id, claim_type, claim_text_canonical, jurisdiction_id, risk_level)
values ('9d000000-0000-4000-8000-00000000000c', 'synthetic_claim',
        'SYNTHETIC_9NP_AUSSAGE_TEXT_äöüß', '9d000000-0000-4000-8000-000000000003', 'low');

insert into public.knowledge_evidence_requirements
  (id, name, category, responsible_actor_rule_id, description_canonical)
values ('9d000000-0000-4000-8000-00000000000d', 'SYNTHETIC_9NP_NACHWEIS', 'synthetic_category',
        '9d000000-0000-4000-8000-000000000008', 'SYNTHETIC_9NP_NACHWEIS_BESCHREIBUNG_äöüß');

insert into public.knowledge_authority_competences
  (id, authority_id, subject_matter, territorial_scope_id, competence_source_version_id)
values ('9d000000-0000-4000-8000-00000000000e', '9d000000-0000-4000-8000-000000000005',
        'SYNTHETIC_9NP_ZUSTÄNDIGKEIT_äöüß', '9d000000-0000-4000-8000-000000000004',
        '9d000000-0000-4000-8000-000000000007');

insert into public.knowledge_processes
  (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
values ('9d000000-0000-4000-8000-00000000000f', 'anmeldung_ummeldung_abmeldung',
        'SYNTHETIC_9NP_ERSATZ_PROZESS_äöüß', '9d000000-0000-4000-8000-000000000003', 'low',
        'SYNTHETIC_9NP_ERSATZ_AUSLÖSER_äöüß', 'SYNTHETIC_9NP_ERSATZ_SCHRITT_äöüß');

insert into public.knowledge_review_records
  (id, entity_type, entity_id, review_status, review_level, reviewer_type)
values ('9d000000-0000-4000-8000-0000000000bb', 'process', '9d000000-0000-4000-8000-00000000000a',
        'human_reviewed', 'synthetic_level', 'synthetic_reviewer'),
       ('9d000000-0000-4000-8000-0000000000aa', 'process', '9d000000-0000-4000-8000-00000000000a',
        'human_reviewed', 'synthetic_level', 'synthetic_reviewer');

-- Matrix subjects: one dedicated publication subject per source state, so the
-- 90-cell transition matrix never has to share or reset a subject.
do $fx$
declare i int;
begin
  for i in 1..12 loop
    insert into public.knowledge_processes
      (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
    values (('9d000000-0000-4000-8000-0000000010' || lpad(i::text, 2, '0'))::uuid,
            'anmeldung_ummeldung_abmeldung',
            'SYNTHETIC_9NP_MATRIX_' || i, '9d000000-0000-4000-8000-000000000003', 'low',
            'SYNTHETIC_9NP_MATRIX_AUSLÖSER_' || i, 'SYNTHETIC_9NP_MATRIX_SCHRITT_' || i);
  end loop;
end $fx$;

select 'FIXTURE_OK' as marker;
`;

/**
 * Focused positive regression for the complete previously-broken RPC set.
 * Emits FOCUS|<rpc>|<verdict>|<sqlstate>|<detail>, verdict in PASS/AMBIG/FAIL.
 */
const FOCUSED_SQL = String.raw`
\pset pager off
create temp table f(seq serial, rpc text, verdict text, ss text, detail text);

do $blk$
declare
  v_a uuid := '9d000000-0000-4000-8000-00000000000a';
  v_b uuid := '9d000000-0000-4000-8000-00000000000f';
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_state text; v_ver integer; v_hist integer; v_status text;
  v_en uuid; v_sk uuid; v_cs uuid; v_va timestamptz; v_va2 timestamptz; v_fp text;
  v_canon text := 'SYNTHETIC_9NP_PROZESS_TITEL_äöüß';
begin
  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_bootstrap_publication_subject('process', v_a, 'boot-audit', 'k-boot') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_bootstrap_publication_subject',
      case when v_state='draft' and v_ver=1 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s', v_state, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_bootstrap_publication_subject', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_bootstrap_publication_subject('process', v_b, 'boot-audit-b', 'k-boot-b');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_advance_publication_evidence_status(
        'process', v_a, 'evidence_incomplete', 1, 'synthetic evidence gap', 'audit-1', 'k-e1') as r;
    select count(*) into v_hist from public.knowledge_publication_state_transitions t
      where t.entity_id = v_a and t.to_state = 'evidence_incomplete';
    insert into f(rpc,verdict,ss,detail) values ('knowledge_advance_publication_evidence_status',
      case when v_state='evidence_incomplete' and v_ver=2 and v_hist=1 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s historyRows=%s', v_state, v_ver, v_hist));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_advance_publication_evidence_status', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_advance_publication_evidence_status(
    'process', v_a, 'review_required', 2, 'synthetic evidence complete', 'audit-1', 'k-e2');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_record_publication_review_decision(
        'process', v_a, 'approved', 3, v_rr, null, 'audit-reviewer', 'k-r1') as r;
    select count(*) into v_hist from public.knowledge_publication_state_transitions t
      where t.entity_id = v_a and t.to_state='approved' and t.actor_class='authorized_reviewer';
    insert into f(rpc,verdict,ss,detail) values ('knowledge_record_publication_review_decision',
      case when v_state='approved' and v_ver=4 and v_hist=1 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s reviewerActorRows=%s', v_state, v_ver, v_hist));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_record_publication_review_decision', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_recall_publication_to_review(
        'process', v_a, 4, 'synthetic recall', 'audit-reviewer', 'k-rc1') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_recall_publication_to_review',
      case when v_state='review_required' and v_ver=5 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s', v_state, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_recall_publication_to_review', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_record_publication_review_decision('process', v_a, 'approved', 5, v_rr, null, 'audit-reviewer', 'k-r2');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_advance_publication_lifecycle(
        'process', v_a, 'mark_eligible', 6, null, 'audit-admin', 'k-l1') as r;
    select count(*) into v_hist from public.knowledge_publication_state_transitions t
      where t.entity_id = v_a and t.to_state='publication_eligible' and t.actor_class='publication_administrator';
    insert into f(rpc,verdict,ss,detail) values ('knowledge_advance_publication_lifecycle',
      case when v_state='publication_eligible' and v_ver=7 and v_hist=1 then 'PASS' else 'FAIL' end,'00000',
      format('mark_eligible state=%s version=%s adminActorRows=%s', v_state, v_ver, v_hist));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_advance_publication_lifecycle', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_advance_publication_lifecycle('process', v_a, 'publish', 7, null, 'audit-admin', 'k-l2');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_suspend_publication_for_detected_issue(
        'process', v_a, 8, 'conflict_suspension', 'synthetic conflict', 'audit-sys', 'k-s1') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_suspend_publication_for_detected_issue',
      case when v_state='suspended' and v_ver=9 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s', v_state, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_suspend_publication_for_detected_issue', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_advance_publication_lifecycle('process', v_a, 'reinstate', 9, 'synthetic reinstate', 'audit-admin', 'k-l3');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_emergency_suspend_publication_subject(
        'process', v_a, 10, 'synthetic emergency', 'audit-emergency', 'k-x1') as r;
    select count(*) into v_hist from public.knowledge_publication_state_transitions t
      where t.entity_id = v_a and t.emergency_flag = true and t.actor_class='emergency_suspension_authority';
    insert into f(rpc,verdict,ss,detail) values ('knowledge_emergency_suspend_publication_subject',
      case when v_state='suspended' and v_ver=11 and v_hist=1 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s emergencyActorRows=%s', v_state, v_ver, v_hist));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_emergency_suspend_publication_subject', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  perform public.knowledge_advance_publication_lifecycle('process', v_a, 'reinstate', 11, 'synthetic reinstate 2', 'audit-admin', 'k-l4');

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_supersede_publication_subject(
        'process', v_a, 12, 'synthetic supersession', 'process', v_b, 'audit-admin', 'k-sup1') as r;
    select count(*) into v_hist from public.knowledge_publication_state_transitions t
      where t.entity_id = v_a and t.to_state='superseded' and t.replacement_entity_id = v_b;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_supersede_publication_subject',
      case when v_state='superseded' and v_ver=13 and v_hist=1 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s replacementRows=%s', v_state, v_ver, v_hist));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_supersede_publication_subject', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.current_state, r.state_version into v_state, v_ver
      from public.knowledge_withdraw_publication_subject(
        'process', v_b, 1, 'synthetic withdrawal', 'audit-admin', 'k-w1') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_withdraw_publication_subject',
      case when v_state='withdrawn' and v_ver=2 then 'PASS' else 'FAIL' end,'00000',
      format('state=%s version=%s', v_state, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_withdraw_publication_subject', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_id, r.canonical_content_fingerprint, r.translation_version, r.translation_status
      into v_en, v_fp, v_ver, v_status
      from public.knowledge_create_machine_translation_candidate(
        'process', v_a, 'title', 'en', 'SYNTHETIC_9NP_TITLE_EN', 'synthetic_provider', 'synthetic_model',
        'audit-machine', null) as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_create_machine_translation_candidate',
      case when v_status='machine_generated_pending_review' and v_ver=1 and length(v_fp)=64
             and v_fp = public.fn_normalize_and_fingerprint_text(v_canon) then 'PASS' else 'FAIL' end,'00000',
      format('status=%s version=%s dbDerivedFingerprint=%s', v_status, v_ver,
             v_fp = public.fn_normalize_and_fingerprint_text(v_canon)));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_create_machine_translation_candidate', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_id, r.translation_version, r.translation_status into v_sk, v_ver, v_status
      from public.knowledge_create_human_translation_candidate(
        'process', v_a, 'title', 'sk', 'SYNTHETIC_9NP_TITLE_SK', 'audit-human', null) as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_create_human_translation_candidate',
      case when v_status='human_review_pending' and v_ver=1 then 'PASS' else 'FAIL' end,'00000',
      format('status=%s version=%s', v_status, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_create_human_translation_candidate', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_status into v_status
      from public.knowledge_submit_translation_for_review(v_en, 'audit-submit') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_submit_translation_for_review',
      case when v_status='human_review_pending' then 'PASS' else 'FAIL' end,'00000', format('status=%s', v_status));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_submit_translation_for_review', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_status, r.verified_at into v_status, v_va
      from public.knowledge_approve_translation(v_en, 'audit-reviewer-distinct', v_rr) as r;
    -- The second call takes the already-approved branch, which is the ONLY path
    -- that reaches the "select verified_at ..." statement repaired by 034.
    select r2.verified_at into v_va2
      from public.knowledge_approve_translation(v_en, 'audit-reviewer-distinct', v_rr) as r2;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_approve_translation',
      case when v_status='approved' and v_va is not null and v_va2 = v_va then 'PASS' else 'FAIL' end,'00000',
      format('status=%s verifiedAtSet=%s idempotentBranchMatches=%s', v_status, v_va is not null, v_va2 = v_va));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_approve_translation', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_status into v_status
      from public.knowledge_reject_translation(v_sk, 'audit-reviewer-distinct', 'synthetic rejection reason') as r;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_reject_translation',
      case when v_status='rejected' then 'PASS' else 'FAIL' end,'00000', format('status=%s', v_status));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_reject_translation', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  begin
    select r.translation_id into v_cs
      from public.knowledge_create_human_translation_candidate(
        'process', v_a, 'title', 'cs', 'SYNTHETIC_9NP_TITLE_CS', 'audit-human', null) as r;
    select r2.translation_status into v_status
      from public.knowledge_withdraw_translation(v_cs, 'audit-admin', 'synthetic withdrawal reason') as r2;
    insert into f(rpc,verdict,ss,detail) values ('knowledge_withdraw_translation',
      case when v_status='withdrawn' then 'PASS' else 'FAIL' end,'00000', format('status=%s', v_status));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('knowledge_withdraw_translation', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;

  -- Internal engines, invoked directly under the owner role only. They must be
  -- free of ambiguity yet remain ungrantable (proven separately by role tests).
  begin
    perform public.knowledge_transition_publication_state(
      'process', v_b, 'review_required', 2, null, 'r', 'automated_ingestion_system', 'a',
      null, null, null, false, 'k-int1');
    insert into f(rpc,verdict,ss,detail) values ('INTERNAL knowledge_transition_publication_state','FAIL','00000',
      'unexpectedly allowed withdrawn -> review_required');
  exception
    when sqlstate '42702' then insert into f(rpc,verdict,ss,detail) values
      ('INTERNAL knowledge_transition_publication_state','AMBIG','42702',SQLERRM);
    when others then insert into f(rpc,verdict,ss,detail) values
      ('INTERNAL knowledge_transition_publication_state','PASS',SQLSTATE,
       'reached state-machine logic without ambiguity: '||SQLERRM);
  end;

  begin
    select r.translation_version, r.translation_status into v_ver, v_status
      from public.fn_create_translation_candidate_core(
        'process', v_a, 'title', 'pl', 'SYNTHETIC_9NP_TITLE_PL', true, 'p', 'm',
        'automated_ingestion_system', 'audit-core', null) as r;
    insert into f(rpc,verdict,ss,detail) values ('INTERNAL fn_create_translation_candidate_core',
      case when v_status='machine_generated_pending_review' and v_ver=1 then 'PASS' else 'FAIL' end,'00000',
      format('status=%s version=%s', v_status, v_ver));
  exception when others then insert into f(rpc,verdict,ss,detail) values
    ('INTERNAL fn_create_translation_candidate_core', case when SQLSTATE='42702' then 'AMBIG' else 'FAIL' end, SQLSTATE, SQLERRM); end;
end $blk$;

select 'FOCUS|'||rpc||'|'||verdict||'|'||ss||'|'||detail from f order by seq;
`;

/**
 * Complete 90-cell publication transition matrix, exercised through the
 * authoritative internal engine under the owner role. Each cell runs inside a
 * PL/pgSQL sub-block (an implicit savepoint); a sentinel exception rolls a
 * successful transition back so the source subject is reusable, and every
 * rejected cell asserts that state, version and history are unchanged.
 * Emits MATRIX|<from>|<to>|<verdict>|<sqlstate>|<detail>.
 */
const MATRIX_SQL = String.raw`
\pset pager off
create temp table mx(seq serial, src text, tgt text, verdict text, ss text, detail text);

do $blk$
declare
  v_states text[] := array['draft','evidence_incomplete','review_required','approved',
                           'publication_eligible','published','suspended','superseded','withdrawn'];
  v_src text; v_tgt text; v_subject uuid; v_actor text;
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_rep uuid := '9d000000-0000-4000-8000-00000000000f';
  v_before_state text; v_before_ver integer; v_before_hist bigint;
  v_after_state text; v_after_ver integer; v_after_hist bigint;
  v_idx int; v_ok boolean; v_ss text; v_msg text;
begin
  -- One dedicated subject per source state, driven there once.
  for v_idx in 1..9 loop
    v_subject := ('9d000000-0000-4000-8000-0000000010' || lpad(v_idx::text, 2, '0'))::uuid;
    v_src := v_states[v_idx];
    perform public.knowledge_bootstrap_publication_subject('process', v_subject, 'mx', 'mx-boot-'||v_idx);
    if v_src = 'evidence_incomplete' then
      perform public.knowledge_transition_publication_state('process', v_subject, 'evidence_incomplete', 1, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx1-'||v_idx);
    elsif v_src = 'review_required' then
      perform public.knowledge_transition_publication_state('process', v_subject, 'review_required', 1, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx1-'||v_idx);
    elsif v_src = 'approved' then
      perform public.knowledge_transition_publication_state('process', v_subject, 'review_required', 1, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx1-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'approved', 2, null, 'r', 'authorized_reviewer', 'mx', v_rr, null, null, false, 'mx2-'||v_idx);
    elsif v_src = 'publication_eligible' then
      perform public.knowledge_transition_publication_state('process', v_subject, 'review_required', 1, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx1-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'approved', 2, null, 'r', 'authorized_reviewer', 'mx', v_rr, null, null, false, 'mx2-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'publication_eligible', 3, null, 'r', 'publication_administrator', 'mx', null, null, null, false, 'mx3-'||v_idx);
    elsif v_src in ('published','suspended','superseded','withdrawn') then
      perform public.knowledge_transition_publication_state('process', v_subject, 'review_required', 1, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx1-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'approved', 2, null, 'r', 'authorized_reviewer', 'mx', v_rr, null, null, false, 'mx2-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'publication_eligible', 3, null, 'r', 'publication_administrator', 'mx', null, null, null, false, 'mx3-'||v_idx);
      perform public.knowledge_transition_publication_state('process', v_subject, 'published', 4, null, 'r', 'publication_administrator', 'mx', null, null, null, false, 'mx4-'||v_idx);
      if v_src = 'suspended' then
        perform public.knowledge_transition_publication_state('process', v_subject, 'suspended', 5, null, 'r', 'automated_ingestion_system', 'mx', null, null, null, false, 'mx5-'||v_idx);
      elsif v_src = 'superseded' then
        perform public.knowledge_transition_publication_state('process', v_subject, 'superseded', 5, null, 'r', 'publication_administrator', 'mx', null, 'process', v_rep, false, 'mx5-'||v_idx);
      elsif v_src = 'withdrawn' then
        perform public.knowledge_transition_publication_state('process', v_subject, 'withdrawn', 5, null, 'r', 'publication_administrator', 'mx', null, null, null, false, 'mx5-'||v_idx);
      end if;
    end if;
  end loop;

  -- 10 source states (null + 9 persisted) x 9 target states = 90 cells.
  for v_idx in 0..9 loop
    if v_idx = 0 then
      v_src := 'null';
      v_subject := '9d000000-0000-4000-8000-000000001010';  -- bootstrapped by nobody
    else
      v_src := v_states[v_idx];
      v_subject := ('9d000000-0000-4000-8000-0000000010' || lpad(v_idx::text, 2, '0'))::uuid;
    end if;

    foreach v_tgt in array v_states loop
      -- Actor class is chosen to satisfy the engine's per-target actor guard, so
      -- the only thing a cell can fail on is the transition rule itself.
      v_actor := case
        when v_tgt = 'approved' then 'authorized_reviewer'
        when v_tgt in ('published','publication_eligible','withdrawn','superseded') then 'publication_administrator'
        else 'automated_ingestion_system' end;

      select s.current_state, s.state_version into v_before_state, v_before_ver
        from public.knowledge_publication_states s where s.entity_type='process' and s.entity_id=v_subject;
      select count(*) into v_before_hist
        from public.knowledge_publication_state_transitions t where t.entity_type='process' and t.entity_id=v_subject;

      v_ok := false; v_ss := '00000'; v_msg := '';
      begin
        perform public.knowledge_transition_publication_state(
          'process', v_subject, v_tgt, coalesce(v_before_ver, 0), null, 'synthetic matrix reason',
          v_actor, 'mx-audit', v_rr, 'process', v_rep, false,
          'mx-cell-'||v_src||'-'||v_tgt);
        v_ok := true;
        select s.current_state, s.state_version into v_after_state, v_after_ver
          from public.knowledge_publication_states s where s.entity_type='process' and s.entity_id=v_subject;
        -- Undo the accepted transition so this source subject stays reusable.
        raise exception 'MX_ROLLBACK_SENTINEL';
      exception
        when others then
          if SQLERRM = 'MX_ROLLBACK_SENTINEL' then
            null;  -- v_ok/v_after_* already captured; sub-block rolled back
          else
            v_ss := SQLSTATE; v_msg := SQLERRM;
          end if;
      end;

      if v_ok then
        insert into mx(src,tgt,verdict,ss,detail)
        values (v_src, v_tgt, 'ALLOWED', '00000',
                format('newState=%s newVersion=%s (rolled back)', v_after_state, v_after_ver));
      else
        select s.current_state, s.state_version into v_after_state, v_after_ver
          from public.knowledge_publication_states s where s.entity_type='process' and s.entity_id=v_subject;
        select count(*) into v_after_hist
          from public.knowledge_publication_state_transitions t where t.entity_type='process' and t.entity_id=v_subject;
        insert into mx(src,tgt,verdict,ss,detail)
        values (v_src, v_tgt,
                case when v_before_state is not distinct from v_after_state
                      and v_before_ver is not distinct from v_after_ver
                      and v_before_hist = v_after_hist
                     then 'REJECTED' else 'REJECTED_WITH_SIDE_EFFECT' end,
                v_ss, left(v_msg, 120));
      end if;
    end loop;
  end loop;
end $blk$;

select 'MATRIX|'||src||'|'||tgt||'|'||verdict||'|'||ss||'|'||detail from mx order by seq;
`;

/**
 * Translation lifecycle end to end, plus all eight canonical invalidation
 * triggers, the active-approved partial unique index and rollback restoration.
 * Emits TL|<case>|<verdict>|<detail>, verdict in PASS/FAIL.
 */
const TRANSLATION_SQL = String.raw`
\pset pager off
create temp table tl(seq serial, name text, verdict text, detail text);

do $blk$
declare
  v_a uuid := '9d000000-0000-4000-8000-00000000000a';
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_id uuid; v_status text; v_fp1 text; v_fp2 text; v_cnt int; v_before text; v_after text;
  r record;
  v_targets text[][] := array[
    ['claim','claim_text_canonical','knowledge_claims','9d000000-0000-4000-8000-00000000000c'],
    ['process','title','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process','trigger_description','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process','safe_first_step','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process_step','title','knowledge_process_steps','9d000000-0000-4000-8000-00000000000b'],
    ['process_step','description_canonical','knowledge_process_steps','9d000000-0000-4000-8000-00000000000b'],
    ['evidence_requirement','description_canonical','knowledge_evidence_requirements','9d000000-0000-4000-8000-00000000000d'],
    ['authority_competence','subject_matter','knowledge_authority_competences','9d000000-0000-4000-8000-00000000000e']
  ];
  v_i int;
begin
  ---------------------------------------------------------------- happy path
  select r1.translation_id into v_id from public.knowledge_create_machine_translation_candidate(
    'process', v_a, 'trigger_description', 'en', 'SYNTHETIC_9NP_TRIGGER_EN',
    'synthetic_provider', 'synthetic_model', 'audit-machine', null) as r1;
  perform public.knowledge_submit_translation_for_review(v_id, 'audit-submit');
  select r2.translation_status into v_status
    from public.knowledge_approve_translation(v_id, 'audit-reviewer-distinct', v_rr) as r2;
  insert into tl(name,verdict,detail) values ('machine_candidate_to_approved',
    case when v_status='approved' then 'PASS' else 'FAIL' end, 'status='||v_status);

  -- Approved rows must carry the full review metadata set enforced by the
  -- approval CHECK constraint.
  select count(*) into v_cnt from public.knowledge_canonical_unit_translations k
   where k.id=v_id and k.human_reviewed and k.uncertainty_preserved and k.warnings_preserved
     and k.numeric_and_deadline_values_preserved and k.review_record_id = v_rr
     and k.verified_at is not null and k.reviewed_by_actor_type='authorized_reviewer';
  insert into tl(name,verdict,detail) values ('approval_metadata_complete',
    case when v_cnt=1 then 'PASS' else 'FAIL' end, 'matchingRows='||v_cnt);

  -- Reviewer actor class must be the wrapper literal, never the caller's text.
  select count(*) into v_cnt from public.knowledge_canonical_unit_translations k
   where k.id=v_id and k.reviewed_by_identifier='audit-reviewer-distinct'
     and k.reviewed_by_actor_type='authorized_reviewer';
  insert into tl(name,verdict,detail) values ('reviewer_actor_class_is_literal',
    case when v_cnt=1 then 'PASS' else 'FAIL' end, 'auditIdStoredAsMetadataOnly rows='||v_cnt);

  ------------------------------------------------------------- human + reject
  select r3.translation_id into v_id from public.knowledge_create_human_translation_candidate(
    'process', v_a, 'safe_first_step', 'hu', 'SYNTHETIC_9NP_STEP_HU', 'audit-human', null) as r3;
  select r4.translation_status into v_status
    from public.knowledge_reject_translation(v_id, 'audit-reviewer-distinct', 'synthetic rejection') as r4;
  select count(*) into v_cnt from public.knowledge_canonical_unit_translations k
   where k.id=v_id and k.rejection_reason='synthetic rejection' and k.reviewed_by_actor_type='authorized_reviewer';
  insert into tl(name,verdict,detail) values ('human_candidate_to_rejected',
    case when v_status='rejected' and v_cnt=1 then 'PASS' else 'FAIL' end,
    'status='||v_status||' metadataRows='||v_cnt);

  ------------------------------------------------- fingerprint determinism
  v_fp1 := public.fn_normalize_and_fingerprint_text('SYNTHETIC_9NP_PROZESS_TITEL_äöüß');
  v_fp2 := public.fn_normalize_and_fingerprint_text('  SYNTHETIC_9NP_PROZESS_TITEL_äöüß  ');
  insert into tl(name,verdict,detail) values ('fingerprint_deterministic_and_trimmed',
    case when v_fp1 = v_fp2 and length(v_fp1)=64 and v_fp1 = encode(digest(convert_to(normalize('SYNTHETIC_9NP_PROZESS_TITEL_äöüß', NFC),'UTF8'),'sha256'),'hex')
         then 'PASS' else 'FAIL' end, 'sha256 len='||length(v_fp1));
  insert into tl(name,verdict,detail) values ('fingerprint_changes_with_content',
    case when v_fp1 <> public.fn_normalize_and_fingerprint_text('SYNTHETIC_9NP_PROZESS_TITEL_äöüß_GEÄNDERT')
         then 'PASS' else 'FAIL' end, 'distinct');
end $blk$;

--------------------------------------- eight canonical invalidation triggers
-- Separate block so a failure here cannot roll back the results above.
do $blk$
declare
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_cnt int;
  v_targets text[][] := array[
    ['claim','claim_text_canonical','knowledge_claims','9d000000-0000-4000-8000-00000000000c'],
    ['process','title','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process','trigger_description','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process','safe_first_step','knowledge_processes','9d000000-0000-4000-8000-00000000000a'],
    ['process_step','title','knowledge_process_steps','9d000000-0000-4000-8000-00000000000b'],
    ['process_step','description_canonical','knowledge_process_steps','9d000000-0000-4000-8000-00000000000b'],
    ['evidence_requirement','description_canonical','knowledge_evidence_requirements','9d000000-0000-4000-8000-00000000000d'],
    ['authority_competence','subject_matter','knowledge_authority_competences','9d000000-0000-4000-8000-00000000000e']
  ];
  v_i int;
begin
  for v_i in 1..8 loop
    declare
      v_et text := v_targets[v_i][1];
      v_fk text := v_targets[v_i][2];
      v_tbl text := v_targets[v_i][3];
      v_eid uuid := v_targets[v_i][4]::uuid;
      v_tid uuid;
      v_new text := 'SYNTHETIC_9NP_INVALIDATION_'||v_i||'_ÄÖÜß';
      v_status_after text;
      v_inval timestamptz;
    begin
      -- Isolate this identity: earlier packs in the same database may already
      -- hold an active-approved 'en' row, which the partial unique index would
      -- (correctly) refuse to duplicate.
      delete from public.knowledge_canonical_unit_translations k
       where k.entity_type = v_et and k.entity_id = v_eid
         and k.field_key = v_fk and k.output_locale = 'en';

      -- approve a translation bound to the current canonical fingerprint
      select rc.translation_id into v_tid from public.fn_create_translation_candidate_core(
        v_et, v_eid, v_fk, 'en', 'SYNTHETIC_9NP_TRANSLATION_'||v_i, false, null, null,
        'authorized_reviewer', 'audit-inval-creator', null) as rc;
      perform public.knowledge_approve_translation(v_tid, 'audit-inval-reviewer', v_rr);

      execute format('update public.%I set %I = $1 where id = $2', v_tbl, v_fk) using v_new, v_eid;

      select k.translation_status, k.invalidated_at into v_status_after, v_inval
        from public.knowledge_canonical_unit_translations k where k.id = v_tid;
      select count(*) into v_cnt from public.knowledge_canonical_unit_translations k
       where k.entity_type=v_et and k.entity_id=v_eid and k.field_key=v_fk and k.output_locale='en'
         and k.translation_status='approved' and k.superseded_at is null
         and k.invalidated_at is null and k.withdrawn_at is null;
      insert into tl(name,verdict,detail) values ('invalidation_trigger_'||v_et||'.'||v_fk,
        case when v_status_after='invalidated_pending_review' and v_inval is not null and v_cnt=0
             then 'PASS' else 'FAIL' end,
        format('statusAfter=%s invalidatedAtSet=%s staleActiveApproved=%s', v_status_after, v_inval is not null, v_cnt));
    end;
  end loop;
end $blk$;

---------------------------------- active-approved partial unique index
do $blk$
declare
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_id uuid;
begin
  -- A different locale for the same identity must not conflict.
  delete from public.knowledge_canonical_unit_translations k
   where k.entity_type='claim' and k.entity_id='9d000000-0000-4000-8000-00000000000c'
     and k.field_key='claim_text_canonical' and k.output_locale='pl';
  select rc2.translation_id into v_id from public.fn_create_translation_candidate_core(
    'claim', '9d000000-0000-4000-8000-00000000000c', 'claim_text_canonical', 'pl',
    'SYNTHETIC_9NP_CLAIM_PL', false, null, null, 'authorized_reviewer', 'audit-c', null) as rc2;
  perform public.knowledge_approve_translation(v_id, 'audit-r', v_rr);
  insert into tl(name,verdict,detail) values ('active_approved_other_locale_allowed','PASS','pl approved alongside en');

  begin
    insert into public.knowledge_canonical_unit_translations
      (entity_type, entity_id, field_key, canonical_content_fingerprint, output_locale, translated_text,
       translation_version, translation_status, created_by_actor_type, human_reviewed, uncertainty_preserved,
       warnings_preserved, numeric_and_deadline_values_preserved, review_record_id, verified_at)
    select k.entity_type, k.entity_id, k.field_key, k.canonical_content_fingerprint, k.output_locale,
           'SYNTHETIC_9NP_DUPLICATE', k.translation_version + 100, 'approved', 'authorized_reviewer',
           true, true, true, true, v_rr, now()
      from public.knowledge_canonical_unit_translations k where k.id = v_id;
    insert into tl(name,verdict,detail) values ('active_approved_duplicate_blocked','FAIL','duplicate accepted');
  exception when unique_violation then
    insert into tl(name,verdict,detail) values ('active_approved_duplicate_blocked','PASS','unique_violation raised');
  end;
end $blk$;

-- Rollback restoration: invalidation happens inside the transaction and is
-- fully undone by ROLLBACK, restoring both canonical text and translation.
-- The expected value is captured (and committed) BEFORE the transaction, so it
-- survives the rollback and does not assume any particular canonical content.
create temp table rb_expect(title text);
insert into rb_expect select p.title from public.knowledge_process_steps p
 where p.id = '9d000000-0000-4000-8000-00000000000b';

begin;
  do $rb$
  declare
    v_eid uuid := '9d000000-0000-4000-8000-00000000000b';
    v_tid uuid; v_status text;
  begin
    select rc.translation_id into v_tid from public.fn_create_translation_candidate_core(
      'process_step', v_eid, 'title', 'cs', 'SYNTHETIC_9NP_RB_CS', false, null, null,
      'authorized_reviewer', 'audit-rb-creator', null) as rc;
    perform public.knowledge_approve_translation(v_tid, 'audit-rb-reviewer', '9d000000-0000-4000-8000-0000000000bb');
    update public.knowledge_process_steps set title = 'SYNTHETIC_9NP_RB_GEAENDERT_ÄÖÜß' where id = v_eid;
    select k.translation_status into v_status from public.knowledge_canonical_unit_translations k where k.id = v_tid;
    -- Raised, not inserted: the ROLLBACK below is the point of the test and
    -- would discard any row written to the results table from inside it.
    raise notice 'TLN|rollback_invalidation_visible_in_txn|%|inTxnStatus=%',
      case when v_status='invalidated_pending_review' then 'PASS' else 'FAIL' end, v_status;
  end $rb$;
rollback;

do $rb2$
declare v_title text; v_expected text; v_cnt int;
begin
  select p.title into v_title from public.knowledge_process_steps p
   where p.id = '9d000000-0000-4000-8000-00000000000b';
  select e.title into v_expected from rb_expect e limit 1;
  select count(*) into v_cnt from public.knowledge_canonical_unit_translations k
   where k.entity_id='9d000000-0000-4000-8000-00000000000b'
     and k.field_key='title' and k.output_locale='cs';
  insert into tl(name,verdict,detail) values ('rollback_restores_canonical_and_translation',
    case when v_title is not distinct from v_expected and v_cnt = 0 then 'PASS' else 'FAIL' end,
    format('titleRestored=%s orphanTranslationRows=%s', v_title is not distinct from v_expected, v_cnt));
end $rb2$;

select 'TL|'||name||'|'||verdict||'|'||detail from tl order by seq;
`;

/**
 * Patch tamper pack. Every case is an attack or an illegal operation that must
 * be refused for the intended reason. Emits TAMPER|<id>|<category>|<verdict>|<sqlstate>|<detail>.
 *   REJECTED  refused for an intended reason
 *   ALLOWED   forbidden action unexpectedly succeeded (always a failure)
 *   WRONGFAIL refused, but for an unintended reason (not counted as a pass)
 */
const TAMPER_SQL = String.raw`
\pset pager off
create temp table tp(id int, cat text, verdict text, ss text, detail text);

create or replace function pg_temp.cls(p_id int, p_cat text, p_ss text, p_ok text[], p_detail text)
returns void language plpgsql as $fn$
begin
  insert into tp values (p_id, p_cat, case when p_ss = any(p_ok) then 'REJECTED' else 'WRONGFAIL' end,
                         p_ss, p_detail);
end $fn$;

-- A: internal engines and the system-only invalidation helper are unreachable
--    from every application role. EXECUTE is checked before the body runs.
do $blk$
declare
  r text; c text; i int := 100;
  roles text[] := array['anon','authenticated','service_role'];
  calls text[] := array[
    $c$select public.knowledge_transition_publication_state('process'::text,'9d000000-0000-4000-8000-00000000000a'::uuid,'published'::text,1,null::text,'r'::text,'publication_administrator'::text,'a'::text,null::uuid,null::text,null::uuid,false,'t'::text)$c$,
    $c$select public.fn_create_translation_candidate_core('process'::text,'9d000000-0000-4000-8000-00000000000a'::uuid,'title'::text,'en'::text,'X'::text,true,'p'::text,'m'::text,'authorized_reviewer'::text,'a'::text,null::text)$c$,
    $c$select public.knowledge_invalidate_translation_for_canonical_change('9d000000-0000-4000-8000-0000000000c1'::uuid)$c$,
    $c$select public.fn_canonical_content_changed_invalidate_translations()$c$
  ];
begin
  foreach r in array roles loop
    foreach c in array calls loop
      begin
        execute format('set local role %I', r);
        execute c;
        execute 'reset role';
        insert into tp values (i,'A_internal_engine_unreachable','ALLOWED','00000', r||' executed '||left(c,50));
      exception when others then execute 'reset role';
        perform pg_temp.cls(i,'A_internal_engine_unreachable',SQLSTATE,array['42501'], r||' '||left(c,50));
      end; i := i+1;
    end loop;
  end loop;
end $blk$;

-- B: direct DML on the three new tables is denied for every application role.
do $blk$
declare
  r text; t text; op text; stmt text; i int := 200;
  roles text[] := array['anon','authenticated','service_role'];
  tables text[] := array['knowledge_publication_states','knowledge_publication_state_transitions','knowledge_canonical_unit_translations'];
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
          insert into tp values (i,'B_direct_table_dml_denied','ALLOWED','00000', r||' '||op||' '||t);
        exception when others then execute 'reset role';
          perform pg_temp.cls(i,'B_direct_table_dml_denied',SQLSTATE,array['42501'], r||' '||op||' '||t);
        end; i := i+1;
      end loop;
    end loop;
  end loop;
end $blk$;

-- C: append-only transition history cannot be mutated, even by the owner.
do $blk$
declare i int := 300;
begin
  begin
    update public.knowledge_publication_state_transitions set transition_reason = 'tampered';
    insert into tp values (i,'C_history_append_only','ALLOWED','00000','owner UPDATE accepted');
  exception when others then perform pg_temp.cls(i,'C_history_append_only',SQLSTATE,array['P0001'],'owner UPDATE');
  end; i := i+1;
  begin
    delete from public.knowledge_publication_state_transitions;
    insert into tp values (i,'C_history_append_only','ALLOWED','00000','owner DELETE accepted');
  exception when others then perform pg_temp.cls(i,'C_history_append_only',SQLSTATE,array['P0001'],'owner DELETE');
  end;
end $blk$;

-- D: lifecycle and optimistic-concurrency negatives on the repaired wrappers.
do $blk$
declare
  v_s uuid := '9d000000-0000-4000-8000-000000001011';
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_ver int; v_state text; v_hist bigint; v_hist2 bigint; i int := 400;
begin
  perform public.knowledge_bootstrap_publication_subject('process', v_s, 'tp', 'tp-boot');

  -- duplicate bootstrap with a different idempotency key
  begin
    perform public.knowledge_bootstrap_publication_subject('process', v_s, 'tp', 'tp-boot-other');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','duplicate bootstrap accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'duplicate bootstrap');
  end; i := i+1;

  -- stale expected version, and proof that nothing moved
  perform public.knowledge_advance_publication_evidence_status('process', v_s, 'review_required', 1, 'r', 'tp', 'tp-e1');
  select count(*) into v_hist from public.knowledge_publication_state_transitions t where t.entity_id=v_s;
  begin
    perform public.knowledge_advance_publication_evidence_status('process', v_s, 'evidence_incomplete', 1, 'r', 'tp', 'tp-stale');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','stale expected_state_version accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'stale version: '||left(SQLERRM,60));
  end; i := i+1;
  select s.current_state, s.state_version into v_state, v_ver
    from public.knowledge_publication_states s where s.entity_id=v_s;
  select count(*) into v_hist2 from public.knowledge_publication_state_transitions t where t.entity_id=v_s;
  insert into tp values (i, 'D_lifecycle_negative',
    case when v_state='review_required' and v_ver=2 and v_hist=v_hist2 then 'REJECTED' else 'ALLOWED' end,
    '00000', format('post-stale state=%s version=%s historyUnchanged=%s', v_state, v_ver, v_hist=v_hist2));
  i := i+1;

  -- wrapper operation-scope violations: each wrapper refused outside its scope
  begin
    perform public.knowledge_advance_publication_lifecycle('process', v_s, 'publish', 2, null, 'tp', 'tp-scope1');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','publish from review_required accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'publish out of scope');
  end; i := i+1;

  begin
    perform public.knowledge_advance_publication_lifecycle('process', v_s, 'not_a_decision', 2, null, 'tp', 'tp-scope2');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','unknown decision accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'unknown decision');
  end; i := i+1;

  begin
    perform public.knowledge_supersede_publication_subject('process', v_s, 2, 'r', 'process', '9d000000-0000-4000-8000-00000000000f', 'tp', 'tp-scope3');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','supersede from review_required accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'supersede out of scope');
  end; i := i+1;

  begin
    perform public.knowledge_emergency_suspend_publication_subject('process', v_s, 2, 'r', 'tp', 'tp-scope4');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','emergency suspend from review_required accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'emergency out of scope');
  end; i := i+1;

  begin
    perform public.knowledge_suspend_publication_for_detected_issue('process', v_s, 2, 'emergency_governance_suspension', 'r', 'tp', 'tp-scope5');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','emergency reason via routine wrapper accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'emergency reason rejected by routine wrapper');
  end; i := i+1;

  begin
    perform public.knowledge_recall_publication_to_review('process', v_s, 2, 'r', 'tp', 'tp-scope6');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','recall from review_required accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'recall out of scope');
  end; i := i+1;

  begin
    perform public.knowledge_record_publication_review_decision('process', v_s, 'published', 2, v_rr, null, 'tp', 'tp-scope7');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','review decision to published accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'review decision target out of scope');
  end; i := i+1;

  begin
    perform public.knowledge_advance_publication_evidence_status('process', v_s, 'published', 2, 'r', 'tp', 'tp-scope8');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','evidence wrapper to published accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'evidence wrapper target out of scope');
  end; i := i+1;

  -- approval without a review record, and missing mandatory reasons
  begin
    perform public.knowledge_record_publication_review_decision('process', v_s, 'approved', 2, null, null, 'tp', 'tp-norev');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','approval without review record accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'approval requires review record');
  end; i := i+1;

  begin
    perform public.knowledge_withdraw_publication_subject('process', v_s, 2, null, 'tp', 'tp-noreason');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','withdrawal without reason accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'withdrawal requires reason');
  end; i := i+1;

  begin
    perform public.knowledge_bootstrap_publication_subject('process', v_s, 'tp', null);
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','null idempotency key accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'idempotency key required');
  end; i := i+1;

  begin
    perform public.knowledge_bootstrap_publication_subject('not_a_type', v_s, 'tp', 'tp-badtype');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','unknown entity_type accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'unknown entity_type');
  end; i := i+1;

  begin
    perform public.knowledge_bootstrap_publication_subject('process', '9d000000-0000-4000-8000-0000000099ff', 'tp', 'tp-noent');
    insert into tp values (i,'D_lifecycle_negative','ALLOWED','00000','nonexistent entity accepted');
  exception when others then perform pg_temp.cls(i,'D_lifecycle_negative',SQLSTATE,array['P0001'],'nonexistent entity');
  end;
end $blk$;

-- E: caller-supplied privileged actor text must never influence actor class.
-- One dedicated subject per privileged class, created here so no other pack can
-- have consumed it, and each case is driven to the precondition of the wrapper
-- that owns that class. The caller always passes a privileged class name as the
-- audit identifier; the persisted actor_class must still be the wrapper's own
-- hardcoded literal. Each case contains its own failure so a setup error is
-- reported as a case rather than silently rolling the whole block back.
do $blk$
declare
  i int := 500;
  k int;
  v_rr uuid := '9d000000-0000-4000-8000-0000000000aa';
  -- suffix | wrapper family under test | actor class the wrapper must assign |
  -- privileged class name the caller forges into the audit identifier
  v_cases text[][] := array[
    ['01','evidence',  'automated_ingestion_system',     'publication_administrator'],
    ['02','review',    'authorized_reviewer',            'migration_bootstrap_system_actor'],
    ['03','lifecycle', 'publication_administrator',      'authorized_reviewer'],
    ['04','emergency', 'emergency_suspension_authority', 'authorized_reviewer']
  ];
begin
  for k in 1..4 loop
    declare
      v_sfx      text := v_cases[k][1];
      v_family   text := v_cases[k][2];
      v_expected text := v_cases[k][3];
      v_forged   text := v_cases[k][4];
      v_s uuid := ('9d000000-0000-4000-8000-0000000030' || v_sfx)::uuid;
      v_good int; v_bad int;
    begin
      insert into public.knowledge_processes
        (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
      values (v_s, 'anmeldung_ummeldung_abmeldung', 'SYNTHETIC_9NP_ACTOR_'||v_sfx,
              '9d000000-0000-4000-8000-000000000003', 'low',
              'SYNTHETIC_9NP_ACTOR_AUSLOESER_'||v_sfx, 'SYNTHETIC_9NP_ACTOR_SCHRITT_'||v_sfx);
      perform public.knowledge_bootstrap_publication_subject('process', v_s, 'tp2-setup', 'tp2-boot-'||v_sfx);

      -- Drive to the precondition using neutral audit identifiers, then invoke
      -- the operation under test with the forged privileged identifier.
      if v_family = 'evidence' then
        perform public.knowledge_advance_publication_evidence_status(
          'process', v_s, 'review_required', 1, 'r', v_forged, 'tp2-op-'||v_sfx);
      elsif v_family = 'review' then
        perform public.knowledge_advance_publication_evidence_status(
          'process', v_s, 'review_required', 1, 'r', 'tp2-setup', 'tp2-pre1-'||v_sfx);
        perform public.knowledge_record_publication_review_decision(
          'process', v_s, 'approved', 2, v_rr, null, v_forged, 'tp2-op-'||v_sfx);
      elsif v_family = 'lifecycle' then
        perform public.knowledge_advance_publication_evidence_status(
          'process', v_s, 'review_required', 1, 'r', 'tp2-setup', 'tp2-pre1-'||v_sfx);
        perform public.knowledge_record_publication_review_decision(
          'process', v_s, 'approved', 2, v_rr, null, 'tp2-setup', 'tp2-pre2-'||v_sfx);
        perform public.knowledge_advance_publication_lifecycle(
          'process', v_s, 'mark_eligible', 3, null, v_forged, 'tp2-op-'||v_sfx);
      else
        perform public.knowledge_advance_publication_evidence_status(
          'process', v_s, 'review_required', 1, 'r', 'tp2-setup', 'tp2-pre1-'||v_sfx);
        perform public.knowledge_record_publication_review_decision(
          'process', v_s, 'approved', 2, v_rr, null, 'tp2-setup', 'tp2-pre2-'||v_sfx);
        perform public.knowledge_advance_publication_lifecycle(
          'process', v_s, 'mark_eligible', 3, null, 'tp2-setup', 'tp2-pre3-'||v_sfx);
        perform public.knowledge_advance_publication_lifecycle(
          'process', v_s, 'publish', 4, null, 'tp2-setup', 'tp2-pre4-'||v_sfx);
        perform public.knowledge_emergency_suspend_publication_subject(
          'process', v_s, 5, 'r', v_forged, 'tp2-op-'||v_sfx);
      end if;

      select count(*) filter (where t.actor_class = v_expected),
             count(*) filter (where t.actor_class <> v_expected)
        into v_good, v_bad
        from public.knowledge_publication_state_transitions t
       where t.entity_id = v_s and t.actor_identifier = v_forged;

      insert into tp values (i,'E_caller_actor_text_ignored',
        case when v_good = 1 and v_bad = 0 then 'REJECTED' else 'ALLOWED' end, '00000',
        format('expectedClass=%s forgedAuditIdentifier=%s assignedCorrectly=%s escalatedRows=%s',
               v_expected, v_forged, v_good, v_bad));
    exception when others then
      insert into tp values (i,'E_caller_actor_text_ignored','WRONGFAIL',SQLSTATE,
        format('expectedClass=%s setupOrCallFailed: %s', v_cases[k][3], left(SQLERRM,120)));
    end;
    i := i+1;
  end loop;
end $blk$;

-- F: translation negatives.
do $blk$
declare
  v_a uuid := '9d000000-0000-4000-8000-00000000000a';
  v_rr uuid := '9d000000-0000-4000-8000-0000000000bb';
  v_id uuid; v_cnt int; i int := 600;
begin
  begin
    perform public.knowledge_create_machine_translation_candidate('process', v_a, 'title', 'de', 'X', 'p', 'm', 'a', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','german output locale accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'german locale rejected');
  end; i := i+1;

  begin
    perform public.knowledge_create_machine_translation_candidate('process', v_a, 'title', 'xx', 'X', 'p', 'm', 'a', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','unsupported locale accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'unsupported locale rejected');
  end; i := i+1;

  begin
    perform public.knowledge_create_machine_translation_candidate('not_a_type', v_a, 'title', 'en', 'X', 'p', 'm', 'a', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','unsupported entity_type accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'unsupported entity_type rejected');
  end; i := i+1;

  begin
    perform public.knowledge_create_machine_translation_candidate('process', v_a, 'not_a_field', 'en', 'X', 'p', 'm', 'a', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','unsupported field_key accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'unsupported field_key rejected');
  end; i := i+1;

  -- forged canonical fingerprint supplied by the caller
  begin
    perform public.knowledge_create_machine_translation_candidate('process', v_a, 'title', 'hu', 'X', 'p', 'm', 'a',
      repeat('0', 64));
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','forged fingerprint accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'forged fingerprint rejected');
  end; i := i+1;

  -- stale fingerprint assertion from a previous canonical revision
  begin
    perform public.knowledge_create_machine_translation_candidate('process', v_a, 'title', 'hu', 'X', 'p', 'm', 'a',
      public.fn_normalize_and_fingerprint_text('SOME_OTHER_SYNTHETIC_CONTENT'));
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','stale fingerprint accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'stale fingerprint rejected');
  end; i := i+1;

  -- repeated rejection of an already-rejected candidate
  select rc.translation_id into v_id from public.knowledge_create_human_translation_candidate(
    'claim', '9d000000-0000-4000-8000-00000000000c', 'claim_text_canonical', 'hu', 'X', 'creator-a', null) as rc;
  perform public.knowledge_reject_translation(v_id, 'reviewer-a', 'first rejection');
  begin
    perform public.knowledge_approve_translation(v_id, 'reviewer-b', v_rr);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','approval of rejected candidate accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'approval after rejection refused');
  end; i := i+1;

  -- self-approval by the same audit identifier
  select rc2.translation_id into v_id from public.knowledge_create_human_translation_candidate(
    'claim', '9d000000-0000-4000-8000-00000000000c', 'claim_text_canonical', 'cs', 'X', 'same-identity', null) as rc2;
  begin
    perform public.knowledge_approve_translation(v_id, 'same-identity', v_rr);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','self approval accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'self approval blocked');
  end; i := i+1;

  -- approval without a review record
  begin
    perform public.knowledge_approve_translation(v_id, 'reviewer-c', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','approval without review record accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'review record required');
  end; i := i+1;

  -- rejection without a reason
  begin
    perform public.knowledge_reject_translation(v_id, 'reviewer-c', null);
    insert into tp values (i,'F_translation_negative','ALLOWED','00000','rejection without reason accepted');
  exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'rejection reason required');
  end; i := i+1;

  -- approval after the canonical text moved on underneath the candidate
  declare v_t uuid;
  begin
    select rc3.translation_id into v_t from public.knowledge_create_human_translation_candidate(
      'process_step', '9d000000-0000-4000-8000-00000000000b', 'description_canonical', 'pl', 'X', 'creator-z', null) as rc3;
    update public.knowledge_process_steps set description_canonical = 'SYNTHETIC_9NP_MOVED_ÄÖÜß'
      where id = '9d000000-0000-4000-8000-00000000000b';
    begin
      perform public.knowledge_approve_translation(v_t, 'reviewer-z', v_rr);
      insert into tp values (i,'F_translation_negative','ALLOWED','00000','approval after canonical change accepted');
    exception when others then perform pg_temp.cls(i,'F_translation_negative',SQLSTATE,array['P0001'],'stale canonical blocks approval');
    end;
  end;
end $blk$;

-- G: an approved translation's identity and content are immutable in place.
do $blk$
declare
  v_id uuid; i int := 700;
begin
  select k.id into v_id from public.knowledge_canonical_unit_translations k
   where k.translation_status='approved' and k.verified_at is not null limit 1;
  if v_id is null then
    insert into tp values (i,'G_verified_immutability','WRONGFAIL','00000','no approved row available');
  else
    begin
      update public.knowledge_canonical_unit_translations set translated_text='TAMPERED' where id=v_id;
      insert into tp values (i,'G_verified_immutability','ALLOWED','00000','verified content mutated');
    exception when others then perform pg_temp.cls(i,'G_verified_immutability',SQLSTATE,array['P0001'],'verified content immutable');
    end; i := i+1;
    begin
      update public.knowledge_canonical_unit_translations set canonical_content_fingerprint=repeat('0',64) where id=v_id;
      insert into tp values (i,'G_verified_immutability','ALLOWED','00000','verified fingerprint mutated');
    exception when others then perform pg_temp.cls(i,'G_verified_immutability',SQLSTATE,array['P0001'],'verified fingerprint immutable');
    end;
  end if;
end $blk$;

-- H: ambiguous-identifier regression probes. Each replaced function is invoked
--    at least once; any 42702 here is the original defect returning.
do $blk$
declare
  c text; i int := 800; v_ss text;
  calls text[] := array[
    $c$select * from public.knowledge_transition_publication_state('process','9d000000-0000-4000-8000-000000001011','published',99,null,'r','publication_administrator','a',null,null,null,false,'rg1')$c$,
    $c$select * from public.knowledge_advance_publication_evidence_status('process','9d000000-0000-4000-8000-000000001011','review_required',99,'r','a','rg2')$c$,
    $c$select * from public.knowledge_record_publication_review_decision('process','9d000000-0000-4000-8000-000000001011','approved',99,'9d000000-0000-4000-8000-0000000000bb',null,'a','rg3')$c$,
    $c$select * from public.knowledge_recall_publication_to_review('process','9d000000-0000-4000-8000-000000001011',99,'r','a','rg4')$c$,
    $c$select * from public.knowledge_advance_publication_lifecycle('process','9d000000-0000-4000-8000-000000001011','mark_eligible',99,null,'a','rg5')$c$,
    $c$select * from public.knowledge_supersede_publication_subject('process','9d000000-0000-4000-8000-000000001011',99,'r','process','9d000000-0000-4000-8000-00000000000f','a','rg6')$c$,
    $c$select * from public.knowledge_withdraw_publication_subject('process','9d000000-0000-4000-8000-000000001011',99,'r','a','rg7')$c$,
    $c$select * from public.knowledge_suspend_publication_for_detected_issue('process','9d000000-0000-4000-8000-000000001011',99,'conflict_suspension','r','a','rg8')$c$,
    $c$select * from public.knowledge_emergency_suspend_publication_subject('process','9d000000-0000-4000-8000-000000001011',99,'r','a','rg9')$c$,
    $c$select * from public.fn_create_translation_candidate_core('process','9d000000-0000-4000-8000-00000000000a','title','xx','X',true,'p','m','authorized_reviewer','a',null)$c$,
    $c$select * from public.knowledge_submit_translation_for_review('9d000000-0000-4000-8000-0000009999ff','a')$c$,
    $c$select * from public.knowledge_approve_translation('9d000000-0000-4000-8000-0000009999ff','a','9d000000-0000-4000-8000-0000000000bb')$c$,
    $c$select * from public.knowledge_reject_translation('9d000000-0000-4000-8000-0000009999ff','a','reason')$c$,
    $c$select * from public.knowledge_withdraw_translation('9d000000-0000-4000-8000-0000009999ff','a','reason')$c$
  ];
begin
  foreach c in array calls loop
    begin
      execute c;
      insert into tp values (i,'H_ambiguity_regression','REJECTED','00000','executed without 42702: '||left(c,60));
    exception when others then
      v_ss := SQLSTATE;
      insert into tp values (i,'H_ambiguity_regression',
        case when v_ss = '42702' then 'ALLOWED' else 'REJECTED' end, v_ss,
        case when v_ss = '42702' then 'AMBIGUITY REGRESSION: '||left(c,60)
             else 'no ambiguity, refused as '||v_ss||': '||left(c,60) end);
    end; i := i+1;
  end loop;
end $blk$;

select 'TAMPER|'||id||'|'||cat||'|'||verdict||'|'||ss||'|'||detail from tp order by id;
`;

/** Schema-shadowing attack against a repaired SECURITY DEFINER wrapper. */
const SHADOW_SQL = String.raw`
\pset pager off
create schema if not exists attacker_9np;

-- Hostile same-named helpers. If a repaired SECURITY DEFINER function resolved
-- through the caller's search_path, these would hijack it.
create or replace function attacker_9np.fn_normalize_and_fingerprint_text(p_text text)
returns text language sql as $$ select repeat('f', 64) $$;

create or replace function attacker_9np.fn_translation_target_exists(
  p_entity_type text, p_entity_id uuid, p_field_key text)
returns table(target_exists boolean, canonical_content text)
language sql as $$ select true, 'ATTACKER_CONTENT'::text $$;

create or replace function attacker_9np.fn_publication_subject_exists(p_entity_type text, p_entity_id uuid)
returns boolean language sql as $$ select true $$;

set search_path = attacker_9np, public, pg_catalog;

do $blk$
declare
  v_id uuid; v_fp text; v_expected text; v_state text;
begin
  -- A repaired translation wrapper must still derive the fingerprint from the
  -- trusted public helper, not the attacker's constant.
  select r.translation_id, r.canonical_content_fingerprint into v_id, v_fp
    from public.knowledge_create_human_translation_candidate(
      'authority_competence', '9d000000-0000-4000-8000-00000000000e', 'subject_matter', 'cs',
      'SYNTHETIC_9NP_SHADOW', 'shadow-audit', null) as r;
  select public.fn_normalize_and_fingerprint_text(a.subject_matter) into v_expected
    from public.knowledge_authority_competences a where a.id='9d000000-0000-4000-8000-00000000000e';
  raise notice 'SHADOW_RESULT|translation|%|trustedFingerprint=% attackerConstant=%',
    case when v_fp = v_expected and v_fp <> repeat('f', 64) then 'BLOCKED' else 'HIJACKED' end,
    v_fp = v_expected, v_fp = repeat('f', 64);

  -- A repaired publication wrapper must still resolve the trusted state table.
  -- The attacker's fn_publication_subject_exists always returns true, so if the
  -- wrapper resolved through the caller search_path this bogus id would be
  -- accepted.
  begin
    perform public.knowledge_bootstrap_publication_subject('process', '9d000000-0000-4000-8000-0000009999aa', 'shadow', 'shadow-1');
    raise notice 'SHADOW_RESULT|bootstrap|HIJACKED|nonexistent subject accepted';
  exception when others then
    raise notice 'SHADOW_RESULT|bootstrap|BLOCKED|refused: %', left(SQLERRM, 60);
  end;
end $blk$;

reset search_path;
drop schema attacker_9np cascade;
select 'SHADOW_DONE' as marker;
`;

// ============================================================================
// LIVE VALIDATION
// ============================================================================

interface FocusRow { rpc: string; verdict: string; sqlstate: string; detail: string }
interface MatrixRow { src: string; tgt: string; verdict: string; sqlstate: string; detail: string }
interface TlRow { name: string; verdict: string; detail: string }
interface TamperRow { id: number; category: string; verdict: string; sqlstate: string; detail: string }

interface LiveEvidence {
  attempted: boolean;
  dockerAvailable: boolean;
  dockerDaemonReachable: boolean;
  containerStarted: boolean;
  containerRemoved: boolean;
  volumeRemoved: boolean;
  containerAbsentAfterCleanup: boolean;
  port: number;
  postgresVersion: string;
  postgresMajorVersion: number;
  pgcryptoAvailable: boolean;
  bootstrappedRoles: string[];

  migration032Applied: boolean;
  migration033Applied: boolean;
  migration034Applied: boolean;
  migration034ExitCode: number;
  migration034Stderr: string;
  migration034Atomic: boolean;
  migration034AtomicDetail: string;

  contractRowsBefore: string[];
  contractRowsAfter: string[];
  contractDrift: string[];

  focusRows: FocusRow[];
  matrixRows: MatrixRow[];
  tlRows: TlRow[];
  tamperRows: TamperRow[];

  grantableRpcsExecutableByServiceRole: string[];
  grantableRpcsExecutableByAnon: string[];
  grantableRpcsExecutableByAuthenticated: string[];
  grantableRpcsExecutableByPublic: string[];
  internalFunctionGrantEvidence: string[];
  internalEnginesDirectlyGranted: boolean;

  securityDefinerCount: number;
  hardenedSearchPathCount: number;
  securityDefinerOwners: string[];
  newTableRlsEnabledCount: number;
  permissivePolicyCount: number;
  newTableRoleGrantCount: number;

  shadowAttackActive: boolean;
  shadowAttackBlocked: boolean;
  shadowDetail: string[];

  concurrentSessionsUsed: number;
  staleVersionRejected: boolean;
  lostUpdatePrevented: boolean;
  doubleTransitionPrevented: boolean;
  rowLockObserved: boolean;
  lockTimeoutObserved: boolean;
  residualLockCount: number;
  concurrencyDetail: string[];

  errors: string[];
}

function emptyLive(): LiveEvidence {
  return {
    attempted: false,
    dockerAvailable: false,
    dockerDaemonReachable: false,
    containerStarted: false,
    containerRemoved: false,
    volumeRemoved: false,
    containerAbsentAfterCleanup: false,
    port: 0,
    postgresVersion: "",
    postgresMajorVersion: 0,
    pgcryptoAvailable: false,
    bootstrappedRoles: [],
    migration032Applied: false,
    migration033Applied: false,
    migration034Applied: false,
    migration034ExitCode: -1,
    migration034Stderr: "",
    migration034Atomic: false,
    migration034AtomicDetail: "",
    contractRowsBefore: [],
    contractRowsAfter: [],
    contractDrift: [],
    focusRows: [],
    matrixRows: [],
    tlRows: [],
    tamperRows: [],
    grantableRpcsExecutableByServiceRole: [],
    grantableRpcsExecutableByAnon: [],
    grantableRpcsExecutableByAuthenticated: [],
    grantableRpcsExecutableByPublic: [],
    internalFunctionGrantEvidence: [],
    internalEnginesDirectlyGranted: true,
    securityDefinerCount: 0,
    hardenedSearchPathCount: 0,
    securityDefinerOwners: [],
    newTableRlsEnabledCount: 0,
    permissivePolicyCount: 0,
    newTableRoleGrantCount: 0,
    shadowAttackActive: false,
    shadowAttackBlocked: false,
    shadowDetail: [],
    concurrentSessionsUsed: 0,
    staleVersionRejected: false,
    lostUpdatePrevented: false,
    doubleTransitionPrevented: false,
    rowLockObserved: false,
    lockTimeoutObserved: false,
    residualLockCount: -1,
    concurrencyDetail: [],
    errors: [],
  };
}

const CONTRACT_SQL = `
select 'SIG|' || p.proname
    || '|args=' || pg_get_function_identity_arguments(p.oid)
    || '|argnames=' || coalesce(array_to_string(p.proargnames, ','), '')
    || '|result=' || pg_get_function_result(p.oid)
    || '|lang=' || l.lanname
    || '|secdef=' || p.prosecdef::text
    || '|volatile=' || p.provolatile::text
    || '|strict=' || p.proisstrict::text
    || '|retset=' || p.proretset::text
    || '|config=' || coalesce(array_to_string(p.proconfig, ','), '')
    || '|owner=' || pg_get_userbyid(p.proowner)
    || '|acl=' || coalesce(
         (select string_agg(a.grantee::regrole::text || ':' || a.privilege_type, ',' order by a.grantee::regrole::text, a.privilege_type)
            from aclexplode(p.proacl) as a), '<default>')
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  join pg_language l on l.oid = p.prolang
 where n.nspname = 'public'
   and (p.proname like 'knowledge\\_%' or p.proname like 'fn\\_%')
 order by p.proname, pg_get_function_identity_arguments(p.oid);
`;

function pickPort(dockerBin: string): number {
  for (const candidate of CANDIDATE_PORTS) {
    const probe = run(dockerBin, ["ps", "-a", "--filter", `publish=${candidate}`, "--format", "{{.Names}}"], 15000);
    if (probe.code === 0 && probe.stdout.trim() === "") return candidate;
  }
  return CANDIDATE_PORTS[0];
}

function performLiveValidation(workDir: string): LiveEvidence {
  const ev = emptyLive();
  const dockerBin = resolveDockerBinary();

  const version = run(dockerBin, ["--version"], 15000);
  ev.dockerAvailable = version.code === 0;
  if (!ev.dockerAvailable) {
    ev.errors.push("ENVIRONMENT: Docker CLI is not available; isolated validation cannot run.");
    return ev;
  }
  const info = run(dockerBin, ["info", "--format", "{{.ServerVersion}}"], 40000);
  ev.dockerDaemonReachable = info.code === 0;
  if (!ev.dockerDaemonReachable) {
    ev.errors.push("ENVIRONMENT: Docker daemon is not reachable; isolated validation cannot run.");
    return ev;
  }

  ev.attempted = true;
  ev.port = pickPort(dockerBin);

  try {
    run(dockerBin, ["rm", "-f", CONTAINER_NAME], 60000);
    const start = run(
      dockerBin,
      [
        "run", "-d", "--name", CONTAINER_NAME,
        "-e", "POSTGRES_PASSWORD=phase9np_disposable",
        "-e", `POSTGRES_DB=${DB_NAME}`,
        "-p", `${DB_HOST}:${ev.port}:5432`,
        POSTGRES_IMAGE,
      ],
      180000
    );
    if (start.code !== 0) {
      ev.errors.push(`ENVIRONMENT: container start failed: ${start.stderr.slice(0, 300)}`);
      return ev;
    }
    ev.containerStarted = true;

    let ready = false;
    for (let i = 0; i < 40; i++) {
      const probe = run(dockerBin, ["exec", CONTAINER_NAME, "pg_isready", "-U", "postgres", "-d", DB_NAME], 20000);
      if (probe.code === 0 && /accepting connections/i.test(probe.stdout)) { ready = true; break; }
      sleepMs(2000);
    }
    if (!ready) {
      ev.errors.push("ENVIRONMENT: PostgreSQL did not become ready within the timeout.");
      return ev;
    }

    ev.postgresVersion = psqlValue(dockerBin, "select version();");
    const serverVersion = psqlValue(dockerBin, "show server_version;");
    ev.postgresMajorVersion = Number.parseInt(serverVersion.split(".")[0] ?? "0", 10) || 0;
    if (ev.postgresMajorVersion !== 17) {
      ev.errors.push(`ENVIRONMENT: expected PostgreSQL 17, observed "${serverVersion}".`);
      return ev;
    }

    // Supabase-compatible roles required by the migration chain.
    for (const role of ["anon", "authenticated"]) {
      psql(dockerBin, `do $$ begin if not exists (select 1 from pg_roles where rolname='${role}') then create role ${role} nologin; end if; end $$;`);
    }
    psql(dockerBin, "do $$ begin if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin bypassrls; end if; end $$;");
    ev.bootstrappedRoles = psqlLines(
      dockerBin,
      "select rolname from pg_roles where rolname in ('anon','authenticated','service_role') order by 1;"
    );
    for (const required of ["anon", "authenticated", "service_role"]) {
      if (!ev.bootstrappedRoles.includes(required)) {
        ev.errors.push(`SETUP: role "${required}" is missing; role-scoped privilege tests would be meaningless.`);
      }
    }
    if (ev.errors.length > 0) return ev;

    // ---- migration chain ----
    const apply032 = psqlFileOn(dockerBin, DB_NAME, repoPath(MIGRATION_032_REL), "/tmp/032.sql", ["-v", "ON_ERROR_STOP=1"], 300000);
    ev.migration032Applied = apply032.code === 0;
    if (!ev.migration032Applied) {
      ev.errors.push(`MIGRATION 032 failed (exit ${apply032.code}): ${apply032.stderr.slice(0, 400)}`);
      return ev;
    }
    const apply033 = psqlFileOn(dockerBin, DB_NAME, repoPath(MIGRATION_033_REL), "/tmp/033.sql", ["-v", "ON_ERROR_STOP=1"], 300000);
    ev.migration033Applied = apply033.code === 0;
    if (!ev.migration033Applied) {
      ev.errors.push(`MIGRATION 033 failed (exit ${apply033.code}): ${apply033.stderr.slice(0, 400)}`);
      return ev;
    }

    // Contract snapshot BEFORE 034, from an independent 032+033 baseline
    // database, so contract preservation is proven rather than assumed.
    psqlOn(dockerBin, "postgres", `create database ${BASELINE_DB_NAME};`);
    psqlFileOn(dockerBin, BASELINE_DB_NAME, repoPath(MIGRATION_032_REL), "/tmp/032.sql", ["-v", "ON_ERROR_STOP=1"], 300000);
    psqlFileOn(dockerBin, BASELINE_DB_NAME, repoPath(MIGRATION_033_REL), "/tmp/033.sql", ["-v", "ON_ERROR_STOP=1"], 300000);
    const contractFile = writeTemp(workDir, "contract.sql", CONTRACT_SQL);
    const before = psqlFileOn(dockerBin, BASELINE_DB_NAME, contractFile, "/tmp/contract.sql");
    ev.contractRowsBefore = before.stdout.split("\n").map((s) => s.trim()).filter((s) => s.startsWith("SIG|"));

    // Atomicity: a copy of 034 with a deliberate trailing failure must leave the
    // baseline database completely unpatched when applied --single-transaction.
    const poisoned = readFileText(MIGRATION_034_REL) + "\nselect 1/0;\n";
    const poisonedFile = writeTemp(workDir, "034-forced-failure.sql", poisoned);
    const poisonedRun = psqlFileOn(
      dockerBin, BASELINE_DB_NAME, poisonedFile, "/tmp/034-poisoned.sql",
      ["--single-transaction", "-v", "ON_ERROR_STOP=1"], 300000
    );
    const afterPoison = psqlFileOn(dockerBin, BASELINE_DB_NAME, contractFile, "/tmp/contract.sql");
    const poisonRows = afterPoison.stdout.split("\n").map((s) => s.trim()).filter((s) => s.startsWith("SIG|"));
    // Any replacement surviving the rollback would change the stored body, which
    // shows up as a 034-only alias appearing in the baseline definitions.
    const baselineAliasLeak = Number.parseInt(
      psqlOn(dockerBin, BASELINE_DB_NAME,
        `select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          where n.nspname='public' and p.prosrc like '%as kps%';`).stdout.trim(), 10);
    ev.migration034Atomic =
      poisonedRun.code !== 0 &&
      baselineAliasLeak === 0 &&
      poisonRows.length === ev.contractRowsBefore.length &&
      poisonRows.every((r, i) => r === ev.contractRowsBefore[i]);
    ev.migration034AtomicDetail =
      `forcedFailureExit=${poisonedRun.code} replacedBodiesSurviving=${baselineAliasLeak} ` +
      `contractRowsUnchanged=${poisonRows.length === ev.contractRowsBefore.length}`;

    // ---- the real 034 application ----
    const apply034 = psqlFileOn(
      dockerBin, DB_NAME, repoPath(MIGRATION_034_REL), "/tmp/034.sql",
      ["--single-transaction", "-v", "ON_ERROR_STOP=1"], 300000
    );
    ev.migration034ExitCode = apply034.code;
    ev.migration034Applied = apply034.code === 0;
    ev.migration034Stderr = apply034.stderr.slice(0, 2000);
    if (!ev.migration034Applied) {
      ev.errors.push(`MIGRATION 034 failed (exit ${apply034.code}): ${apply034.stderr.slice(0, 400)}`);
      return ev;
    }

    const after = psqlFileOn(dockerBin, DB_NAME, contractFile, "/tmp/contract.sql");
    ev.contractRowsAfter = after.stdout.split("\n").map((s) => s.trim()).filter((s) => s.startsWith("SIG|"));
    if (ev.contractRowsBefore.length === 0 || ev.contractRowsAfter.length === 0) {
      ev.errors.push("CONTRACT: failed to capture function contract snapshots for comparison.");
    } else {
      const beforeSet = new Set(ev.contractRowsBefore);
      const afterSet = new Set(ev.contractRowsAfter);
      for (const row of ev.contractRowsBefore) if (!afterSet.has(row)) ev.contractDrift.push(`- ${row}`);
      for (const row of ev.contractRowsAfter) if (!beforeSet.has(row)) ev.contractDrift.push(`+ ${row}`);
    }

    ev.pgcryptoAvailable = psqlInt(dockerBin, "select count(*) from pg_extension where extname='pgcrypto';") === 1;

    // ---- fixtures ----
    const fixtureFile = writeTemp(workDir, "fixture.sql", FIXTURE_SQL);
    const fixture = psqlFileOn(dockerBin, DB_NAME, fixtureFile, "/tmp/fixture.sql", ["-v", "ON_ERROR_STOP=1"]);
    if (!fixture.stdout.includes("FIXTURE_OK")) {
      ev.errors.push(`FIXTURE: synthetic fixture load failed: ${fixture.stderr.slice(0, 400)}`);
      return ev;
    }

    // ---- focused RPC regression ----
    const focusFile = writeTemp(workDir, "focused.sql", FOCUSED_SQL);
    const focus = psqlFileOn(dockerBin, DB_NAME, focusFile, "/tmp/focused.sql", [], 300000);
    for (const line of focus.stdout.split("\n")) {
      const t = line.trim();
      if (!t.startsWith("FOCUS|")) continue;
      const parts = t.split("|");
      ev.focusRows.push({ rpc: parts[1], verdict: parts[2], sqlstate: parts[3], detail: parts.slice(4).join("|") });
    }
    if (ev.focusRows.length === 0) {
      ev.errors.push(`FOCUS: focused regression produced no rows: ${focus.stderr.slice(0, 400)}`);
    }

    // ---- concurrency (real competing sessions) ----
    runConcurrency(dockerBin, ev, workDir);

    // ---- full transition matrix ----
    const matrixFile = writeTemp(workDir, "matrix.sql", MATRIX_SQL);
    const matrix = psqlFileOn(dockerBin, DB_NAME, matrixFile, "/tmp/matrix.sql", [], 300000);
    for (const line of matrix.stdout.split("\n")) {
      const t = line.trim();
      if (!t.startsWith("MATRIX|")) continue;
      const parts = t.split("|");
      ev.matrixRows.push({ src: parts[1], tgt: parts[2], verdict: parts[3], sqlstate: parts[4], detail: parts.slice(5).join("|") });
    }
    if (ev.matrixRows.length === 0) {
      ev.errors.push(`MATRIX: transition matrix produced no rows: ${matrix.stderr.slice(0, 400)}`);
    }

    // ---- translation lifecycle + invalidation ----
    const tlFile = writeTemp(workDir, "translation.sql", TRANSLATION_SQL);
    const tl = psqlFileOn(dockerBin, DB_NAME, tlFile, "/tmp/translation.sql", [], 300000);
    for (const line of tl.stdout.split("\n")) {
      const t = line.trim();
      if (!t.startsWith("TL|")) continue;
      const parts = t.split("|");
      ev.tlRows.push({ name: parts[1], verdict: parts[2], detail: parts.slice(3).join("|") });
    }
    // Observations made inside a transaction that is deliberately rolled back
    // cannot be persisted to the results table, so they are raised as notices
    // (delivered to stderr immediately and unaffected by the rollback).
    for (const line of tl.stderr.split("\n")) {
      const idx = line.indexOf("TLN|");
      if (idx < 0) continue;
      const parts = line.slice(idx + 4).trim().split("|");
      ev.tlRows.push({ name: parts[0], verdict: parts[1], detail: parts.slice(2).join("|") });
    }
    if (ev.tlRows.length === 0) {
      ev.errors.push(`TRANSLATION: lifecycle pack produced no rows: ${tl.stderr.slice(0, 400)}`);
    }

    // ---- tamper pack ----
    const tamperFile = writeTemp(workDir, "tamper.sql", TAMPER_SQL);
    const tamper = psqlFileOn(dockerBin, DB_NAME, tamperFile, "/tmp/tamper.sql", [], 300000);
    for (const line of tamper.stdout.split("\n")) {
      const t = line.trim();
      if (!t.startsWith("TAMPER|")) continue;
      const parts = t.split("|");
      ev.tamperRows.push({
        id: Number.parseInt(parts[1], 10),
        category: parts[2],
        verdict: parts[3],
        sqlstate: parts[4],
        detail: parts.slice(5).join("|"),
      });
    }
    if (ev.tamperRows.length === 0) {
      ev.errors.push(`TAMPER: tamper pack produced no rows: ${tamper.stderr.slice(0, 400)}`);
    }

    // ---- catalog privilege boundaries ----
    collectPrivileges(dockerBin, ev);

    // ---- schema shadowing ----
    const shadowFile = writeTemp(workDir, "shadow.sql", SHADOW_SQL);
    const shadow = psqlFileOn(dockerBin, DB_NAME, shadowFile, "/tmp/shadow.sql", [], 180000);
    const shadowLines = (shadow.stdout + "\n" + shadow.stderr)
      .split("\n").map((s) => s.trim()).filter((s) => s.includes("SHADOW_RESULT|"));
    ev.shadowDetail = shadowLines;
    ev.shadowAttackActive = shadow.stdout.includes("SHADOW_DONE") && shadowLines.length >= 2;
    ev.shadowAttackBlocked =
      ev.shadowAttackActive &&
      shadowLines.every((l) => /\|BLOCKED\|/.test(l)) &&
      !shadowLines.some((l) => /\|HIJACKED\|/.test(l));
  } finally {
    const rm = run(dockerBin, ["rm", "-f", "-v", CONTAINER_NAME], 120000);
    ev.containerRemoved = rm.code === 0;
    ev.volumeRemoved = rm.code === 0;
    const check = run(dockerBin, ["ps", "-a", "--filter", `name=${CONTAINER_NAME}`, "--format", "{{.Names}}"], 40000);
    ev.containerAbsentAfterCleanup = check.code === 0 && check.stdout.trim() === "";
  }

  return ev;
}

/**
 * Wrapper-level concurrency with two independent psql sessions. PHASE 9N could
 * only observe table-level locking because every wrapper was broken; this
 * closes that gap.
 */
function runConcurrency(dockerBin: string, ev: LiveEvidence, workDir: string): void {
  // Background sessions write straight to file descriptors and are never
  // awaited through the event loop. The audit is synchronous end to end, so a
  // promise-based child could never settle: `sleepMs` uses `Atomics.wait`,
  // which parks the only thread that could deliver a 'close' event. Handing
  // the OS a real fd lets the competing session make progress while the main
  // thread blocks inside spawnSync.
  interface Background { proc: ReturnType<typeof spawn>; out: string; err: string }

  const startBackground = (tag: string, sql: string): Background => {
    const out = path.join(workDir, `conc-${tag}.out`);
    const err = path.join(workDir, `conc-${tag}.err`);
    const fdOut = fs.openSync(out, "w");
    const fdErr = fs.openSync(err, "w");
    const proc = spawn(
      dockerBin,
      ["exec", CONTAINER_NAME, "psql", "-U", "postgres", "-d", DB_NAME, "-t", "-A", "-v", "ON_ERROR_STOP=1", "-c", sql],
      { windowsHide: true, stdio: ["ignore", fdOut, fdErr], detached: false }
    );
    proc.unref();
    return { proc, out, err };
  };

  const readBackground = (bg: Background, marker: string, timeoutMs: number): RunResult => {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      const stdout = fs.existsSync(bg.out) ? fs.readFileSync(bg.out, "utf8") : "";
      const stderr = fs.existsSync(bg.err) ? fs.readFileSync(bg.err, "utf8") : "";
      if (stdout.includes(marker)) return { code: 0, stdout, stderr };
      if (stderr.trim().length > 0) return { code: 1, stdout, stderr };
      if (Date.now() >= deadline) return { code: 124, stdout, stderr: stderr || "background session timed out" };
      sleepMs(150);
    }
  };

  const freshSubject = (suffix: string, label: string): string => {
    const id = `9d000000-0000-4000-8000-0000000020${suffix}`;
    psql(
      dockerBin,
      `insert into public.knowledge_processes (id, process_group_id, title, jurisdiction_id, risk_level, trigger_description, safe_first_step)
       values ('${id}', 'anmeldung_ummeldung_abmeldung', 'SYNTHETIC_9NP_${label}',
               '9d000000-0000-4000-8000-000000000003', 'low', 'SYNTHETIC_9NP_${label}_AUSLOESER', 'SYNTHETIC_9NP_${label}_SCHRITT');`
    );
    psql(dockerBin, `select public.knowledge_bootstrap_publication_subject('process', '${id}', 'conc', 'boot-${suffix}');`);
    return id;
  };

  const stateOf = (id: string): string =>
    psqlValue(
      dockerBin,
      `select s.current_state || ':' || s.state_version from public.knowledge_publication_states s where s.entity_id='${id}';`
    );
  const historyOf = (id: string): number =>
    psqlInt(dockerBin, `select count(*) from public.knowledge_publication_state_transitions t where t.entity_id='${id}';`);

  ev.concurrentSessionsUsed = 2;

  // --- Scenario 1: two sessions race the same expected version ---------------
  // Both target an edge the evidence wrapper allows from `draft`, so both clear
  // the wrapper's operation-scope guard and the race is decided purely by the
  // row lock plus the optimistic version check in the internal engine.
  const raceSubject = freshSubject("01", "RACE");
  const sessionA = startBackground(
    "a",
    `begin;
     select public.knowledge_advance_publication_evidence_status(
       'process','${raceSubject}','evidence_incomplete',1,'r','sessionA','conc-a');
     select pg_sleep(4);
     commit;
     select 'SESSION_A_COMMITTED';`
  );
  // Let A take the row lock before B arrives.
  sleepMs(1200);
  const bStarted = Date.now();
  const bRes = psql(
    dockerBin,
    `set lock_timeout='30s'; set statement_timeout='45s';
     select public.knowledge_advance_publication_evidence_status(
       'process','${raceSubject}','review_required',1,'r','sessionB','conc-b');`,
    90000
  );
  const bWaitedMs = Date.now() - bStarted;
  const aRes = readBackground(sessionA, "SESSION_A_COMMITTED", 60000);

  const bConflicted = bRes.code !== 0 && /publication_state_version_conflict/i.test(bRes.stderr);
  const raceState = stateOf(raceSubject);
  const raceHistory = historyOf(raceSubject);

  // B must have physically waited on A's row lock rather than failing fast.
  ev.rowLockObserved = aRes.code === 0 && bConflicted && bWaitedMs >= 1500;
  // Exactly two history rows may exist: the bootstrap row and A's transition.
  ev.doubleTransitionPrevented = bConflicted && raceHistory === 2 && raceState === "evidence_incomplete:2";
  // B read version 1, A committed version 2, and B's write did not overwrite it.
  ev.lostUpdatePrevented = ev.doubleTransitionPrevented && aRes.code === 0;
  ev.concurrencyDetail.push(`sessionA exit=${aRes.code} committed=${aRes.stdout.includes("SESSION_A_COMMITTED")}`);
  ev.concurrencyDetail.push(
    `sessionB exit=${bRes.code} waitedMs=${bWaitedMs} err=${(bRes.stderr || "").trim().replace(/\s+/g, " ").slice(0, 140)}`
  );
  ev.concurrencyDetail.push(`afterRace state=${raceState} historyRows=${raceHistory} bRefused=${bConflicted}`);

  // --- Scenario 2: stale expected version, in scope, single session ----------
  // The subject is advanced to evidence_incomplete:2 first, so the retry at
  // expected version 1 is a genuine optimistic-concurrency rejection and not a
  // wrapper scope violation: evidence_incomplete -> review_required is in scope.
  const staleSubject = freshSubject("02", "STALE");
  const warm = psql(
    dockerBin,
    `select public.knowledge_advance_publication_evidence_status(
       'process','${staleSubject}','evidence_incomplete',1,'r','warm','stale-warm');`
  );
  const stale = psql(
    dockerBin,
    `select public.knowledge_advance_publication_evidence_status(
       'process','${staleSubject}','review_required',1,'r','stale','stale-probe');`
  );
  const staleState = stateOf(staleSubject);
  const staleHistory = historyOf(staleSubject);
  ev.staleVersionRejected =
    warm.code === 0 &&
    stale.code !== 0 &&
    /publication_state_version_conflict/i.test(stale.stderr) &&
    staleState === "evidence_incomplete:2" &&
    staleHistory === 2;
  ev.concurrencyDetail.push(
    `staleAttempt warmExit=${warm.code} staleExit=${stale.code} state=${staleState} historyRows=${staleHistory} ` +
      `reason=${/publication_state_version_conflict/i.test(stale.stderr) ? "version_conflict" : (stale.stderr || "").trim().replace(/\s+/g, " ").slice(0, 90)}`
  );
  // The correct expected version must still succeed against the same subject.
  const correct = psql(
    dockerBin,
    `select public.knowledge_advance_publication_evidence_status(
       'process','${staleSubject}','review_required',2,'r','correct','stale-correct');`
  );
  ev.concurrencyDetail.push(`correctVersionAccepted exit=${correct.code} state=${stateOf(staleSubject)}`);
  ev.staleVersionRejected = ev.staleVersionRejected && correct.code === 0;

  // --- Scenario 3: finite lock timeout, then no residual locks ---------------
  const lockSubject = freshSubject("03", "LOCK");
  const holder = startBackground(
    "hold",
    `begin;
     select 1 from public.knowledge_publication_states where entity_id='${lockSubject}' for update;
     select pg_sleep(8);
     commit;
     select 'HOLDER_DONE';`
  );
  sleepMs(1200);
  const timeoutStarted = Date.now();
  const timeoutRes = psql(
    dockerBin,
    `set lock_timeout='1500ms';
     select public.knowledge_advance_publication_evidence_status(
       'process','${lockSubject}','evidence_incomplete',1,'r','timeout','conc-timeout');`,
    60000
  );
  const timeoutWaitedMs = Date.now() - timeoutStarted;
  ev.lockTimeoutObserved =
    timeoutRes.code !== 0 && /lock timeout|canceling statement/i.test(timeoutRes.stderr) && timeoutWaitedMs < 30000;
  ev.concurrencyDetail.push(
    `lockTimeoutProbe exit=${timeoutRes.code} waitedMs=${timeoutWaitedMs} err=${(timeoutRes.stderr || "").trim().replace(/\s+/g, " ").slice(0, 110)}`
  );
  readBackground(holder, "HOLDER_DONE", 40000);

  // Nothing may still be queued once every probe has finished.
  sleepMs(1500);
  ev.residualLockCount = psqlInt(
    dockerBin,
    `select count(*) from pg_locks l join pg_class c on c.oid = l.relation
      where c.relname in ('knowledge_publication_states','knowledge_publication_state_transitions')
        and not l.granted;`
  );
  ev.concurrencyDetail.push(`residualUngrantedLocks=${ev.residualLockCount}`);
}

function collectPrivileges(dockerBin: string, ev: LiveEvidence): void {
  const roleCheck = (role: string, fn: string): boolean => {
    const v = psqlValue(
      dockerBin,
      `select bool_or(has_function_privilege('${role}', p.oid, 'EXECUTE'))::text
         from pg_proc p join pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname='${fn}';`
    );
    return v === "t" || v === "true";
  };

  for (const fn of GRANTABLE_RPCS) {
    if (roleCheck("service_role", fn)) ev.grantableRpcsExecutableByServiceRole.push(fn);
    if (roleCheck("anon", fn)) ev.grantableRpcsExecutableByAnon.push(fn);
    if (roleCheck("authenticated", fn)) ev.grantableRpcsExecutableByAuthenticated.push(fn);
    if (roleCheck("public", fn)) ev.grantableRpcsExecutableByPublic.push(fn);
  }

  let anyInternalGranted = false;
  for (const fn of INTERNAL_ONLY_FUNCTIONS) {
    const svc = roleCheck("service_role", fn);
    const an = roleCheck("anon", fn);
    const au = roleCheck("authenticated", fn);
    const pu = roleCheck("public", fn);
    if (svc || an || au || pu) anyInternalGranted = true;
    ev.internalFunctionGrantEvidence.push(
      `${fn}: service_role=${svc} anon=${an} authenticated=${au} public=${pu}`
    );
  }
  ev.internalEnginesDirectlyGranted = anyInternalGranted;

  ev.securityDefinerCount = psqlInt(
    dockerBin,
    `select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.prosecdef
        and (p.proname like 'knowledge\\_%' or p.proname like 'fn\\_%');`
  );
  ev.hardenedSearchPathCount = psqlInt(
    dockerBin,
    `select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.prosecdef
        and (p.proname like 'knowledge\\_%' or p.proname like 'fn\\_%')
        and array_to_string(p.proconfig, ',') like '%search_path=pg_catalog, public%';`
  );
  ev.securityDefinerOwners = psqlLines(
    dockerBin,
    `select distinct pg_get_userbyid(p.proowner) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.prosecdef
        and (p.proname like 'knowledge\\_%' or p.proname like 'fn\\_%');`
  );

  const tableList = NEW_TABLES.map((t) => `'${t}'`).join(",");
  ev.newTableRlsEnabledCount = psqlInt(
    dockerBin,
    `select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
      where n.nspname='public' and c.relname in (${tableList}) and c.relrowsecurity;`
  );
  ev.permissivePolicyCount = psqlInt(
    dockerBin,
    `select count(*) from pg_policies where schemaname='public' and tablename in (${tableList});`
  );
  ev.newTableRoleGrantCount = psqlInt(
    dockerBin,
    `select count(*) from information_schema.role_table_grants
      where table_schema='public' and table_name in (${tableList})
        and grantee in ('anon','authenticated','service_role','PUBLIC');`
  );
}

// ============================================================================
// PHASE 9N AUDIT RERUN (child process, unchanged file)
// ============================================================================

interface Phase9NRerun {
  executed: boolean;
  exitCode: number;
  outcome: string;
  passed: boolean;
  appliesMigration034: boolean;
  requiresOwnFileUntracked: boolean;
  pinnedExpectedCommit: string;
  blockingReasons: string[];
  stdoutTail: string;

  // Child-process execution evidence.
  spawnAttempted: boolean;
  spawnSucceeded: boolean;
  actuallyExecuted: boolean;
  signal: string | null;
  errorCode: string | null;
  stdoutCaptured: boolean;
  stderrCaptured: boolean;
  shellUsed: boolean;
  nodeExecPath: string;
  tsxCliPath: string;
  tsxResolutionStrategy: string;

  // Child output evidence.
  outputVerified: boolean;
  markerObserved: boolean;
  checkIdObserved: string;
  migration034Observed: boolean;
  positiveCaseCount: number;
  positiveCasesPassed: number;
  negativeCaseCount: number;
  negativeCasesRejected: number;
  outputFindings: string[];
}

/**
 * Locate the tsx CLI without downloading anything and without a shell.
 *
 * The most reliable source is this process itself: when the audit runs under
 * tsx, `process.execArgv` carries the absolute `tsx/dist/preflight.cjs` and
 * `tsx/dist/loader.mjs` paths of the exact runtime hosting it, and `cli.mjs`
 * sits beside them. That guarantees the child uses the same tsx build as the
 * parent regardless of where the package was installed. The remaining
 * strategies are ordinary on-disk lookups; none of them fetches a package.
 */
function resolveTsxCli(): { cliPath: string; strategy: string } {
  const candidateFromDist = (dist: string): string => path.join(dist, "cli.mjs");

  for (const raw of process.execArgv) {
    let value = raw;
    if (value.startsWith("file://")) {
      try {
        value = fileURLToPath(value);
      } catch {
        continue;
      }
    }
    const match = /^(.*[\\/]tsx[\\/]dist)[\\/](loader\.mjs|preflight\.cjs)$/i.exec(value);
    if (match) {
      const cli = candidateFromDist(match[1]);
      if (fs.existsSync(cli)) return { cliPath: cli, strategy: "process.execArgv tsx loader (hosting runtime)" };
    }
  }

  const local = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  if (fs.existsSync(local)) return { cliPath: local, strategy: "repository node_modules/tsx" };

  // Already-downloaded npx caches only; nothing is fetched here.
  const cacheRoots = [
    process.env.npm_config_cache,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "npm-cache") : "",
    process.env.HOME ? path.join(process.env.HOME, ".npm") : "",
    process.env.USERPROFILE ? path.join(process.env.USERPROFILE, ".npm") : "",
  ].filter((r): r is string => Boolean(r));

  for (const root of cacheRoots) {
    const npxDir = path.join(root, "_npx");
    let entries: string[];
    try {
      entries = fs.readdirSync(npxDir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const cli = path.join(npxDir, entry, "node_modules", "tsx", "dist", "cli.mjs");
      if (fs.existsSync(cli)) return { cliPath: cli, strategy: `npx cache (${root})` };
    }
  }

  return { cliPath: "", strategy: "unresolved" };
}

function runPhase9NAudit(): Phase9NRerun {
  const source = readFileText(PHASE_9N_AUDIT_REL);
  const appliesMigration034 = source.includes(MIGRATION_034_NAME);
  const requiresOwnFileUntracked = /untracked\.includes\(AUDIT_SELF_REL\)/.test(source);
  const pinned = /EXPECTED_SOURCE_COMMIT\s*=\s*"([^"]+)"/.exec(source)?.[1] ?? "";

  const { cliPath, strategy } = resolveTsxCli();
  const nodeExecPath = process.execPath;
  const auditAbs = path.join(process.cwd(), PHASE_9N_AUDIT_REL);
  const nodePresent = Boolean(nodeExecPath) && fs.existsSync(nodeExecPath);
  const cliPresent = Boolean(cliPath) && fs.existsSync(cliPath);

  const blocking: string[] = [];
  const findings: string[] = [];

  let exitCode = -1;
  let signal: string | null = null;
  let errorCode: string | null = null;
  let stdout = "";
  let stderr = "";
  let spawnAttempted = false;
  let spawnSucceeded = false;

  if (!nodePresent) blocking.push(`Node executable not resolvable at "${nodeExecPath}".`);
  if (!cliPresent) {
    blocking.push(
      "Could not resolve an already-installed tsx CLI (process.execArgv, node_modules/tsx, npx cache). " +
        "The child PHASE 9N audit cannot be executed without downloading a package, which is forbidden."
    );
  }

  if (nodePresent && cliPresent) {
    // Shell-free: argv is passed as an array to the real Node binary, so no
    // quoting or PATH resolution is involved. `spawnSync("npx", ...)` failed
    // here with ENOENT because Windows npx is a .cmd shim that Node cannot
    // execute without a shell, which meant the child never ran at all.
    spawnAttempted = true;
    const res = spawnSync(nodeExecPath, [cliPath, auditAbs], {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: 900000,
      maxBuffer: 64 * 1024 * 1024,
      env: process.env,
      shell: false,
      windowsHide: true,
    });
    stdout = res.stdout || "";
    stderr = res.stderr || "";
    if (res.error) {
      errorCode = (res.error as NodeJS.ErrnoException).code ?? res.error.name ?? "SPAWN_ERROR";
      blocking.push(`Child spawn failed: ${errorCode} ${res.error.message.slice(0, 160)}`);
    } else {
      spawnSucceeded = true;
    }
    signal = res.signal ?? null;
    exitCode = typeof res.status === "number" ? res.status : -1;
    if (spawnSucceeded && typeof res.status !== "number") {
      blocking.push(`Child produced no numeric exit status (signal=${signal ?? "null"}).`);
    }
  }

  // A numeric status alone proves nothing about WHAT ran, so the child's own
  // output must independently identify itself and the chain it validated.
  const combined = `${stdout}\n${stderr}`;
  const numericStatus = spawnSucceeded && exitCode >= 0;
  const actuallyExecuted = numericStatus && combined.trim().length > 0;

  const outcome = /"outcome":\s*"([^"]+)"/.exec(stdout)?.[1] ?? "";
  const checkIdObserved = /"checkId":\s*"([^"]+)"/.exec(stdout)?.[1] ?? "";
  const markerObserved = /PHASE\s+9N\s+RESULT/.test(combined);
  const allPassedObserved = /"allPassed":\s*true/.test(stdout);
  const migration034Observed =
    /"migration034Applied":\s*true/.test(stdout) && stdout.includes(MIGRATION_034_NAME);
  const chainObserved =
    /"migration032Applied":\s*true/.test(stdout) && /"migration033Applied":\s*true/.test(stdout);

  const readNumber = (field: string): number => {
    const m = new RegExp(`"${field}":\\s*(-?\\d+)`).exec(stdout);
    return m ? Number(m[1]) : -1;
  };
  const positiveCaseCount = readNumber("runtimePositiveCaseCount");
  const positiveCasesPassed = readNumber("runtimePositiveCasesPassed");
  const negativeCaseCount = readNumber("runtimeNegativeOrTamperCaseCount");
  const negativeCasesRejected = readNumber("runtimeNegativeOrTamperCasesRejected");

  if (actuallyExecuted) {
    if (checkIdObserved !== "9N") findings.push(`checkId="${checkIdObserved}" (expected "9N")`);
    if (!markerObserved) findings.push('missing "PHASE 9N RESULT" marker');
    if (outcome !== "PASSED") findings.push(`outcome="${outcome}" (expected "PASSED")`);
    if (!allPassedObserved) findings.push('missing "allPassed": true');
    if (!chainObserved) findings.push("migrations 032/033 not both reported applied");
    if (!migration034Observed) findings.push(`migration 034 not observed as applied by the child`);
    if (positiveCaseCount < EXPECTED_CHILD_POSITIVE_CASES) {
      findings.push(`positive cases ${positiveCaseCount} < ${EXPECTED_CHILD_POSITIVE_CASES}`);
    }
    if (positiveCasesPassed !== positiveCaseCount) {
      findings.push(`positive cases passed ${positiveCasesPassed}/${positiveCaseCount}`);
    }
    if (negativeCaseCount < EXPECTED_CHILD_NEGATIVE_CASES) {
      findings.push(`negative cases ${negativeCaseCount} < ${EXPECTED_CHILD_NEGATIVE_CASES}`);
    }
    if (negativeCasesRejected !== negativeCaseCount) {
      findings.push(`negative cases rejected ${negativeCasesRejected}/${negativeCaseCount}`);
    }
  } else if (spawnAttempted) {
    findings.push("child produced no output, so nothing about its run can be verified");
  }

  const outputVerified = actuallyExecuted && findings.length === 0;

  // Exit status and semantic output must agree in BOTH directions.
  const passed = actuallyExecuted && exitCode === 0 && signal === null && errorCode === null && outputVerified;

  if (!appliesMigration034) {
    blocking.push(
      `The PHASE 9N audit source never references ${MIGRATION_034_NAME}, so its container would run the ` +
        "unpatched schema."
    );
  }
  if (requiresOwnFileUntracked) {
    blocking.push(
      "The PHASE 9N audit still requires its own source file to appear as UNTRACKED in git status, which " +
        "cannot hold once it is committed."
    );
  }
  if (pinned) {
    blocking.push(
      `The PHASE 9N audit still pins EXPECTED_SOURCE_COMMIT="${pinned}", which fails after any later ` +
        "legitimate commit."
    );
  }
  if (actuallyExecuted && !outputVerified) {
    blocking.push(`Child PHASE 9N output did not verify: ${findings.join("; ")}`);
  }
  if (numericStatus && exitCode !== 0) {
    blocking.push(`Child PHASE 9N exited ${exitCode}.`);
  }

  return {
    executed: actuallyExecuted,
    exitCode,
    outcome,
    passed,
    appliesMigration034,
    requiresOwnFileUntracked,
    pinnedExpectedCommit: pinned,
    blockingReasons: blocking,
    stdoutTail: stdout.slice(-1200),

    spawnAttempted,
    spawnSucceeded,
    actuallyExecuted,
    signal,
    errorCode,
    stdoutCaptured: stdout.length > 0,
    stderrCaptured: stderr.length > 0,
    shellUsed: false,
    nodeExecPath,
    tsxCliPath: cliPath,
    tsxResolutionStrategy: strategy,

    outputVerified,
    markerObserved,
    checkIdObserved,
    migration034Observed,
    positiveCaseCount,
    positiveCasesPassed,
    negativeCaseCount,
    negativeCasesRejected,
    outputFindings: findings,
  };
}

// ============================================================================
// REPOSITORY SCOPE
// ============================================================================

interface ScopeEvidence {
  branch: string;
  headShort: string;
  untrackedFiles: string[];
  modifiedTrackedFiles: string[];
  migration033Modified: boolean;
  existingTrackedFileModified: boolean;
  onlyExpectedNewFiles: boolean;
  notes: string[];

  profile: string;
  profileRecognized: boolean;
  profileDescription: string;
  expectedModifiedTrackedFiles: string[];
  expectedUntrackedFiles: string[];
  unexpectedRepositoryPaths: string[];
  missingRequiredArtifacts: string[];
  migration034Present: boolean;
}

/**
 * Select the repository-state profile from the observed working tree, then
 * validate every dirty path against that profile's allowance sets.
 *
 * A completely clean tree means the artifacts are committed, so the durable
 * `committed_regression` profile applies. Any dirty path means the repair
 * sequence is still open, so `pre_commit_patch_closure` applies and every
 * dirty path must be one this phase is entitled to touch. Selecting a profile
 * never widens what is allowed; it only chooses which closed set applies.
 */
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
    if (filePath.startsWith(".next/")) continue;
    if (code.includes("?")) untracked.push(filePath);
    else modified.push(filePath);
  }

  const profileName: RepositoryStateProfileName =
    modified.length === 0 && untracked.length === 0 ? "committed_regression" : "pre_commit_patch_closure";
  const profile = REPOSITORY_STATE_PROFILES[profileName];

  const unexpectedModified = modified.filter(
    (f) => !(profile.allowedModified as readonly string[]).includes(f)
  );
  const unexpectedUntracked = untracked.filter(
    (f) => !(profile.allowedUntracked as readonly string[]).includes(f)
  );
  const unexpectedRepositoryPaths = [...unexpectedModified, ...unexpectedUntracked];

  const missingRequiredArtifacts = profile.requiredPresent.filter((rel) => !fileExists(rel));
  const migration034Present = fileExists(MIGRATION_034_REL);

  if (unexpectedModified.length > 0) {
    notes.push(`Modified tracked files outside profile "${profileName}": ${unexpectedModified.join(", ")}`);
  }
  if (unexpectedUntracked.length > 0) {
    notes.push(`Untracked files outside profile "${profileName}": ${unexpectedUntracked.join(", ")}`);
  }
  if (missingRequiredArtifacts.length > 0) {
    notes.push(`Required artifacts missing: ${missingRequiredArtifacts.join(", ")}`);
  }

  const migration033Modified = modified.includes(MIGRATION_033_REL);
  if (migration033Modified) notes.push(`Migration 033 is modified: ${MIGRATION_033_REL}`);

  return {
    branch,
    headShort,
    untrackedFiles: untracked,
    modifiedTrackedFiles: modified,
    migration033Modified,
    // Retains its original meaning as a security signal: an existing tracked
    // file was touched that this phase had no licence to touch.
    existingTrackedFileModified: unexpectedModified.length > 0,
    onlyExpectedNewFiles:
      unexpectedRepositoryPaths.length === 0 && missingRequiredArtifacts.length === 0 && !migration033Modified,
    notes,

    profile: profileName,
    profileRecognized: true,
    profileDescription: profile.description,
    expectedModifiedTrackedFiles: [...profile.allowedModified],
    expectedUntrackedFiles: [...profile.allowedUntracked],
    unexpectedRepositoryPaths,
    missingRequiredArtifacts,
    migration034Present,
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
  blocked: boolean;
  blockReason: string;
  outcome: string;

  sourceMigration032: string;
  sourceMigration033: string;
  sourceMigration034: string;
  sourcePhase9NAudit: string;
  sourceCommit: string;
  sourceCommitMatchesExpected: boolean;
  currentHeadCommit: string;
  migration032Sha256: string;
  migration033Sha256: string;
  migration034Sha256: string;

  repositoryScopeValid: boolean;
  workingTreeCleanBeforePhase: boolean;
  untrackedFiles: string[];
  modifiedTrackedFiles: string[];
  migration033Modified: boolean;
  existingTrackedFileModified: boolean;
  forwardMigrationUsed: boolean;

  postgresqlVersion: string;
  postgresqlMajorVersion: number;
  postgresqlVersionVerified: boolean;
  pgcryptoAvailable: boolean;
  isolatedDatabaseUsed: boolean;
  remoteDatabaseUsed: boolean;
  productionDatabaseUsed: boolean;
  realUserDataUsed: boolean;
  realGermanKnowledgeDataUsed: boolean;
  isolationMethod: string;
  containerName: string;
  containerRemoved: boolean;
  containerAbsentAfterCleanup: boolean;

  migration032Applied: boolean;
  migration033Applied: boolean;
  migration034Applied: boolean;
  migration034ApplicationAtomic: boolean;
  migration034AtomicEvidence: string;

  affectedFunctionCount: number;
  affectedFunctionsAudited: number;
  affectedFunctions: string[];
  replacedFunctionCount: number;
  previouslyBrokenGrantableRpcCount: number;
  previouslyBrokenGrantableRpcsTested: number;
  previouslyBrokenGrantableRpcsNowExecutable: number;
  ambiguousColumnFailuresRemaining: number;
  focusFailures: string[];

  internalTransitionEngineRuntimeValid: boolean;
  internalTranslationCoreRuntimeValid: boolean;
  internalEnginesDirectlyGranted: boolean;
  internalFunctionGrantEvidence: string[];

  functionSignaturesPreserved: boolean;
  returnContractsPreserved: boolean;
  transitionRulesPreserved: boolean;
  translationRulesPreserved: boolean;
  grantModelPreserved: boolean;
  rlsModelPreserved: boolean;
  securityDefinerModelPreserved: boolean;
  searchPathHardeningPreserved: boolean;
  contractDrift: string[];

  privilegedActorClassCallerControlled: boolean;
  genericPrivilegedTransitionEngineDirectlyGranted: boolean;
  actorClassDerivedFromTrustedOperation: boolean;
  reviewerActorClassCallerControlled: boolean;
  emergencyActorClassCallerControlled: boolean;
  administratorActorClassCallerControlled: boolean;
  systemActorClassCallerControlled: boolean;
  actorClassContainmentEvidence: string[];

  fullPhase9NAuditExecuted: boolean;
  fullPhase9NAuditPassed: boolean;
  fullPhase9NAuditExitCode: number;
  fullPhase9NAuditOutcome: string;
  fullPhase9NAuditOutputVerified: boolean;
  fullPhase9NAuditMigration034Observed: boolean;
  fullPhase9NAuditMarkerObserved: boolean;
  fullPhase9NAuditCheckId: string;
  fullPhase9NAuditPositiveCaseCount: number;
  fullPhase9NAuditPositiveCasesPassed: number;
  fullPhase9NAuditNegativeCaseCount: number;
  fullPhase9NAuditNegativeCasesRejected: number;
  fullPhase9NAuditOutputFindings: string[];
  phase9NAuditAppliesMigration034: boolean;
  phase9NAuditRequiresOwnFileUntracked: boolean;
  phase9NAuditPinnedCommit: string;
  phase9NAuditStructuralBlockers: string[];
  phase9NEquivalentSurfaceRevalidatedHere: boolean;

  childSpawnAttempted: boolean;
  childSpawnSucceeded: boolean;
  childProcessActuallyExecuted: boolean;
  childProcessExitCode: number;
  childProcessSignal: string | null;
  childProcessErrorCode: string | null;
  childStdoutCaptured: boolean;
  childStderrCaptured: boolean;
  childShellFree: boolean;
  childNodeExecPath: string;
  childNodeExecPathResolved: boolean;
  childTsxCliPath: string;
  childTsxCliResolved: boolean;
  childTsxResolutionStrategy: string;

  repositoryStateProfile: string;
  repositoryStateProfileRecognized: boolean;
  repositoryStateProfileDescription: string;
  expectedModifiedTrackedFiles: string[];
  actualModifiedTrackedFiles: string[];
  expectedUntrackedFiles: string[];
  actualUntrackedFiles: string[];
  unexpectedRepositoryPaths: string[];
  missingRequiredArtifacts: string[];
  migration034Present: boolean;
  migration034Sha256Recomputed: string;

  phase9NRunnerProxyFlagDebtRecorded: boolean;
  phase9NRunnerProxyFlags: string[];
  phase9NRunnerProxyFlagNote: string;

  harnessTamperCaseCount: number;
  harnessTamperCasesRejected: number;

  fullTransitionMatrixValidated: boolean;
  transitionMatrixCellCount: number;
  transitionMatrixAllowedCount: number;
  transitionMatrixRejectedCount: number;
  transitionMatrixSideEffectCount: number;
  publicationTransitionRuleCount: number;
  optimisticConcurrencyValidated: boolean;
  wrapperLevelConcurrencyValidated: boolean;
  concurrentSessionsUsed: number;
  rowLockingVerified: boolean;
  lostUpdatePrevented: boolean;
  doubleTransitionPrevented: boolean;
  timeoutCleanupVerified: boolean;
  residualLockCount: number;
  concurrencyEvidence: string[];

  bootstrapValidated: boolean;
  transitionHistoryValidated: boolean;
  applicationRoleHistoryImmutabilityValidated: boolean;
  historyImmutabilityBoundary: string;

  machineTranslationCandidateValidated: boolean;
  humanTranslationCandidateValidated: boolean;
  translationApprovalValidated: boolean;
  translationRejectionValidated: boolean;
  translationLifecycleValidated: boolean;
  canonicalFingerprintValidated: boolean;
  canonicalInvalidationTriggerCount: number;
  canonicalInvalidationTriggersValidated: boolean;
  activeApprovedTranslationUniquenessValidated: boolean;
  transactionRollbackValidated: boolean;
  translationLifecycleFailures: string[];

  rlsEnabledForAllNewTables: boolean;
  publicPrivilegesRevoked: boolean;
  anonDirectAccessBlocked: boolean;
  authenticatedDirectAccessBlocked: boolean;
  serviceRoleDirectAccessBlocked: boolean;
  grantableRpcsExecutableByServiceRole: number;
  grantableRpcsExecutableByAnon: number;
  grantableRpcsExecutableByAuthenticated: number;
  grantableRpcsExecutableByPublic: number;
  securityDefinerFunctionCount: number;
  hardenedSearchPathCount: number;
  securityDefinerSearchPathValidated: boolean;
  schemaShadowingAttackBlocked: boolean;
  schemaShadowingEvidence: string[];

  staticAnalysisMethod: string;
  unsafeAmbiguousReferencesBefore: number;
  unsafeAmbiguousReferencesAfter: number;
  staticFindingsBefore: string[];
  staticFindingsAfter: string[];
  staticHeuristicCalibrated: boolean;
  runtimeConfirmedBrokenFunctions: string[];

  patchPositiveCaseCount: number;
  patchPositiveCasesPassed: number;
  patchNegativeOrTamperCaseCount: number;
  patchNegativeOrTamperCasesRejected: number;
  patchCasesAllowedForbidden: number;
  patchCasesFailedForWrongReason: number;
  tamperCategoryBreakdown: Record<string, string>;

  migrationModificationPerformed: boolean;
  databasePatchPerformed: boolean;
  productionAuthorizationGranted: boolean;
  publicRuntimeAuthorized: boolean;
  realKnowledgeIngestionPerformed: boolean;

  readyForGeneratedDatabaseTypeDecisionClosure: boolean;
  readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: boolean;

  environmentBlocked: boolean;
  liveExecutionErrors: string[];
  nextRecommendedPhase: string;
  evidence: string[];
}

function buildResult(
  scope: ScopeEvidence,
  live: LiveEvidence,
  rerun: Phase9NRerun,
  staticBefore: StaticAmbiguityReport,
  staticAfter: StaticAmbiguityReport,
  sql033: string,
  sql034: string
): Result {
  const environmentBlocked =
    !live.attempted ||
    !live.dockerAvailable ||
    !live.dockerDaemonReachable ||
    !live.containerStarted ||
    live.postgresMajorVersion !== 17;

  // ---- focused RPC regression ----
  const focusByName = new Map(live.focusRows.map((r) => [r.rpc, r]));
  const testedBroken = PREVIOUSLY_BROKEN_RPCS.filter((n) => focusByName.has(n));
  const nowExecutable = PREVIOUSLY_BROKEN_RPCS.filter((n) => focusByName.get(n)?.verdict === "PASS");
  const ambiguousRemaining =
    live.focusRows.filter((r) => r.verdict === "AMBIG").length +
    live.tamperRows.filter((r) => r.category === "H_ambiguity_regression" && r.sqlstate === "42702").length;
  const focusFailures = live.focusRows.filter((r) => r.verdict !== "PASS").map((r) => `${r.rpc}: ${r.verdict} ${r.sqlstate} ${r.detail}`);

  const engineRow = focusByName.get("INTERNAL knowledge_transition_publication_state");
  const coreRow = focusByName.get("INTERNAL fn_create_translation_candidate_core");
  const internalTransitionEngineRuntimeValid = engineRow?.verdict === "PASS";
  const internalTranslationCoreRuntimeValid = coreRow?.verdict === "PASS";

  // ---- transition matrix ----
  const matrixAllowed = live.matrixRows.filter((r) => r.verdict === "ALLOWED");
  const matrixRejected = live.matrixRows.filter((r) => r.verdict === "REJECTED");
  const matrixSideEffect = live.matrixRows.filter((r) => r.verdict === "REJECTED_WITH_SIDE_EFFECT");
  const nonBootstrapRuleCount = (sql033.match(
    /when\s+v_current_state\s*=\s*'[a-z_]+'\s+and\s+p_to_state\s*=\s*'[a-z_]+'\s+then/gi
  ) || []).length;
  const publicationTransitionRuleCount = nonBootstrapRuleCount + 1;
  const fullTransitionMatrixValidated =
    live.matrixRows.length === REQUIRED_MATRIX_COVERAGE &&
    matrixSideEffect.length === 0 &&
    matrixAllowed.length === nonBootstrapRuleCount &&
    publicationTransitionRuleCount === REQUIRED_TRANSITION_RULE_COUNT;

  // ---- translation lifecycle ----
  const tlByName = new Map(live.tlRows.map((r) => [r.name, r]));
  const tlPass = (name: string): boolean => tlByName.get(name)?.verdict === "PASS";
  const invalidationRows = live.tlRows.filter((r) => r.name.startsWith("invalidation_trigger_"));
  const invalidationPassed = invalidationRows.filter((r) => r.verdict === "PASS");
  const canonicalInvalidationTriggersValidated =
    invalidationRows.length === REQUIRED_INVALIDATION_TRIGGER_COUNT &&
    invalidationPassed.length === REQUIRED_INVALIDATION_TRIGGER_COUNT;

  const machineTranslationCandidateValidated =
    focusByName.get("knowledge_create_machine_translation_candidate")?.verdict === "PASS" &&
    tlPass("machine_candidate_to_approved");
  const humanTranslationCandidateValidated =
    focusByName.get("knowledge_create_human_translation_candidate")?.verdict === "PASS" &&
    tlPass("human_candidate_to_rejected");
  const translationApprovalValidated =
    focusByName.get("knowledge_approve_translation")?.verdict === "PASS" &&
    tlPass("approval_metadata_complete") &&
    tlPass("reviewer_actor_class_is_literal");
  const translationRejectionValidated =
    focusByName.get("knowledge_reject_translation")?.verdict === "PASS" &&
    tlPass("human_candidate_to_rejected");
  const canonicalFingerprintValidated =
    tlPass("fingerprint_deterministic_and_trimmed") && tlPass("fingerprint_changes_with_content");
  const activeApprovedTranslationUniquenessValidated =
    tlPass("active_approved_duplicate_blocked") && tlPass("active_approved_other_locale_allowed");
  const transactionRollbackValidated =
    tlPass("rollback_invalidation_visible_in_txn") && tlPass("rollback_restores_canonical_and_translation");
  const translationLifecycleValidated =
    machineTranslationCandidateValidated &&
    humanTranslationCandidateValidated &&
    translationApprovalValidated &&
    translationRejectionValidated &&
    canonicalInvalidationTriggersValidated;

  // ---- tamper pack ----
  const tamperRejected = live.tamperRows.filter((r) => r.verdict === "REJECTED");
  const tamperAllowed = live.tamperRows.filter((r) => r.verdict === "ALLOWED");
  const tamperWrong = live.tamperRows.filter((r) => r.verdict === "WRONGFAIL");
  const tamperBreakdown: Record<string, string> = {};
  for (const cat of [...new Set(live.tamperRows.map((r) => r.category))].sort()) {
    const rows = live.tamperRows.filter((r) => r.category === cat);
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.verdict] = (counts[r.verdict] ?? 0) + 1;
    tamperBreakdown[cat] = Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(" ");
  }

  const historyImmutability =
    live.tamperRows.filter((r) => r.category === "C_history_append_only").length === 2 &&
    live.tamperRows.filter((r) => r.category === "C_history_append_only" && r.verdict === "REJECTED").length === 2;

  // ---- privileges ----
  const anonBlocked = live.grantableRpcsExecutableByAnon.length === 0;
  const authBlocked = live.grantableRpcsExecutableByAuthenticated.length === 0;
  const publicBlocked = live.grantableRpcsExecutableByPublic.length === 0;
  const serviceRoleComplete = live.grantableRpcsExecutableByServiceRole.length === GRANTABLE_RPCS.length;
  const directDmlRows = live.tamperRows.filter((r) => r.category === "B_direct_table_dml_denied");
  const directDmlAllDenied = directDmlRows.length === 36 && directDmlRows.every((r) => r.verdict === "REJECTED");

  const rlsModelPreserved =
    live.newTableRlsEnabledCount === NEW_TABLES.length &&
    live.permissivePolicyCount === 0 &&
    live.newTableRoleGrantCount === 0 &&
    directDmlAllDenied;

  const grantModelPreserved =
    serviceRoleComplete && anonBlocked && authBlocked && publicBlocked && !live.internalEnginesDirectlyGranted;

  const securityDefinerModelPreserved =
    live.securityDefinerCount > 0 &&
    live.securityDefinerCount === live.hardenedSearchPathCount &&
    live.securityDefinerOwners.length === 1;

  const contractPreserved = live.contractDrift.length === 0 && live.contractRowsAfter.length > 0;

  // ---- actor authorization (unchanged 9M-PATCH boundary) ----
  const grantableSet = new Set<string>(GRANTABLE_RPCS);
  const parsed034 = parseFunctions(sql034);
  const grantableWithActorParam = parsed034
    .filter((f) => grantableSet.has(f.name) && /\bp_(actor|reviewer|admin|emergency|system)[a-z_]*class\b/i.test(f.signature))
    .map((f) => f.name);
  const callerActorTextRows = live.tamperRows.filter((r) => r.category === "E_caller_actor_text_ignored");
  const callerActorTextIgnored =
    callerActorTextRows.length >= 4 && callerActorTextRows.every((r) => r.verdict === "REJECTED");
  // Each privileged class is proven separately by the wrapper family that owns
  // it, so one class cannot borrow another's evidence. A class counts as
  // caller-controlled unless its own case ran and refused the escalation.
  const classNotCallerControlled = (actorClass: string): boolean => {
    const row = callerActorTextRows.find((r) => r.detail.includes(`expectedClass=${actorClass}`));
    return row?.verdict === "REJECTED" && !grantableWithActorParam.length;
  };
  const systemActorClassCallerControlled = !classNotCallerControlled("automated_ingestion_system");
  const reviewerActorClassCallerControlled = !classNotCallerControlled("authorized_reviewer");
  const administratorActorClassCallerControlled = !classNotCallerControlled("publication_administrator");
  const emergencyActorClassCallerControlled = !classNotCallerControlled("emergency_suspension_authority");
  const privilegedActorClassCallerControlled =
    grantableWithActorParam.length > 0 ||
    !callerActorTextIgnored ||
    systemActorClassCallerControlled ||
    reviewerActorClassCallerControlled ||
    administratorActorClassCallerControlled ||
    emergencyActorClassCallerControlled;
  const genericEngineGranted = live.internalFunctionGrantEvidence.some(
    (e) => e.startsWith("knowledge_transition_publication_state") && /=true/.test(e)
  );
  const actorClassDerivedFromTrustedOperation =
    !privilegedActorClassCallerControlled && !genericEngineGranted && callerActorTextIgnored;

  // ---- static ambiguity ----
  const runtimeConfirmedBroken = [...PREVIOUSLY_BROKEN_RPCS, "knowledge_transition_publication_state", "fn_create_translation_candidate_core"];
  const affectedFunctions = staticBefore.functionsWithFindings;
  // Calibration: the lexical heuristic must flag exactly the functions that 034
  // replaces, and every function it flags must be one the runtime proved broken
  // (directly, or via the core that the two candidate wrappers delegate to).
  const replacedNames = parsed034.map((f) => f.name).sort();
  const staticHeuristicCalibrated =
    affectedFunctions.length === replacedNames.length &&
    affectedFunctions.every((f) => replacedNames.includes(f)) &&
    affectedFunctions.every((f) => runtimeConfirmedBroken.includes(f));

  const bootstrapValidated = focusByName.get("knowledge_bootstrap_publication_subject")?.verdict === "PASS";
  const transitionHistoryValidated =
    bootstrapValidated &&
    live.focusRows.filter((r) => /ActorRows=1|historyRows=1|replacementRows=1/.test(r.detail)).length >= 4;

  const optimisticConcurrencyValidated = live.staleVersionRejected;
  const wrapperLevelConcurrencyValidated =
    live.concurrentSessionsUsed >= 2 && live.doubleTransitionPrevented && live.staleVersionRejected;

  const positiveRows = [...live.focusRows, ...live.tlRows.map((r) => ({ verdict: r.verdict }))];
  const patchPositiveCaseCount = positiveRows.length;
  const patchPositiveCasesPassed = positiveRows.filter((r) => r.verdict === "PASS").length;

  const substantivePass =
    !environmentBlocked &&
    live.errors.length === 0 &&
    scope.onlyExpectedNewFiles &&
    !scope.migration033Modified &&
    !scope.existingTrackedFileModified &&
    live.migration032Applied &&
    live.migration033Applied &&
    live.migration034Applied &&
    live.migration034Atomic &&
    live.pgcryptoAvailable &&
    testedBroken.length === EXPECTED_PREVIOUSLY_BROKEN_COUNT &&
    nowExecutable.length === EXPECTED_PREVIOUSLY_BROKEN_COUNT &&
    ambiguousRemaining === 0 &&
    focusFailures.length === 0 &&
    internalTransitionEngineRuntimeValid &&
    internalTranslationCoreRuntimeValid &&
    !live.internalEnginesDirectlyGranted &&
    contractPreserved &&
    grantModelPreserved &&
    rlsModelPreserved &&
    securityDefinerModelPreserved &&
    !privilegedActorClassCallerControlled &&
    !genericEngineGranted &&
    actorClassDerivedFromTrustedOperation &&
    fullTransitionMatrixValidated &&
    optimisticConcurrencyValidated &&
    wrapperLevelConcurrencyValidated &&
    live.rowLockObserved &&
    live.lockTimeoutObserved &&
    live.residualLockCount === 0 &&
    historyImmutability &&
    translationLifecycleValidated &&
    canonicalFingerprintValidated &&
    activeApprovedTranslationUniquenessValidated &&
    transactionRollbackValidated &&
    live.shadowAttackBlocked &&
    staticAfter.totalReferences === 0 &&
    staticBefore.totalReferences > 0 &&
    staticHeuristicCalibrated &&
    affectedFunctions.length === EXPECTED_AFFECTED_FUNCTION_COUNT &&
    live.tamperRows.length >= MIN_PATCH_TAMPER_CASES &&
    tamperAllowed.length === 0 &&
    tamperWrong.length === 0 &&
    tamperRejected.length === live.tamperRows.length &&
    live.containerRemoved &&
    live.containerAbsentAfterCleanup;

  // The PHASE 9N runner is a required gate, and the gate only counts if the
  // child really ran: a numeric exit status, the child's own identifying
  // output, and the patched chain must all agree.
  const childGateSatisfied =
    rerun.spawnAttempted &&
    rerun.spawnSucceeded &&
    rerun.actuallyExecuted &&
    rerun.exitCode === 0 &&
    rerun.signal === null &&
    rerun.errorCode === null &&
    rerun.outputVerified &&
    rerun.migration034Observed &&
    rerun.markerObserved &&
    !rerun.shellUsed &&
    rerun.passed;

  const allPassed = substantivePass && childGateSatisfied;

  const blockReasons: string[] = [];
  if (environmentBlocked) blockReasons.push("Isolated PostgreSQL 17 environment unavailable.");
  if (!scope.onlyExpectedNewFiles) blockReasons.push(`Repository scope invalid: ${scope.notes.join("; ")}`);
  if (ambiguousRemaining > 0) blockReasons.push(`${ambiguousRemaining} function(s) still raise SQLSTATE 42702.`);
  if (focusFailures.length > 0) blockReasons.push(`Focused regression failures: ${focusFailures.join(" | ")}`);
  if (!contractPreserved) blockReasons.push(`Function contract drift: ${live.contractDrift.join(" | ")}`);
  if (tamperAllowed.length > 0) blockReasons.push(`${tamperAllowed.length} forbidden action(s) succeeded.`);
  if (tamperWrong.length > 0) blockReasons.push(`${tamperWrong.length} negative case(s) failed for the wrong reason.`);
  if (matrixSideEffect.length > 0) blockReasons.push(`${matrixSideEffect.length} rejected transition(s) left a side effect.`);
  if (substantivePass && !childGateSatisfied) {
    blockReasons.push(
      `The PHASE 9N child run did not satisfy the gate (exit=${rerun.exitCode}, outcome="${rerun.outcome}", ` +
        `executed=${rerun.actuallyExecuted}, outputVerified=${rerun.outputVerified}): ` +
        rerun.blockingReasons.join(" ")
    );
  }
  for (const e of live.errors) blockReasons.push(e);

  const outcome = environmentBlocked
    ? "BLOCKED — VALIDATION ENVIRONMENT"
    : !scope.onlyExpectedNewFiles
      ? "BLOCKED — REPOSITORY STATE"
      : allPassed
        ? "PASSED"
        : substantivePass
          ? "BLOCKED — PATCH RUNNER DEFECT"
          : "BLOCKED — PATCH DEFECT";

  return {
    checkId: CHECK_ID,
    phase: PHASE_NAME,
    implementationKind: IMPLEMENTATION_KIND,
    allPassed,
    blocked: !allPassed,
    blockReason: blockReasons.join(" | "),
    outcome,

    sourceMigration032: MIGRATION_032_REL,
    sourceMigration033: MIGRATION_033_REL,
    sourceMigration034: MIGRATION_034_REL,
    sourcePhase9NAudit: PHASE_9N_AUDIT_REL,
    sourceCommit: scope.headShort,
    sourceCommitMatchesExpected: scope.headShort === REFERENCE_SOURCE_COMMIT,
    currentHeadCommit: scope.headShort,
    migration032Sha256: sha256Hex(readFileText(MIGRATION_032_REL)),
    migration033Sha256: sha256Hex(sql033),
    migration034Sha256: sha256Hex(sql034),

    repositoryScopeValid: scope.onlyExpectedNewFiles,
    workingTreeCleanBeforePhase: scope.modifiedTrackedFiles.length === 0,
    untrackedFiles: scope.untrackedFiles,
    modifiedTrackedFiles: scope.modifiedTrackedFiles,
    migration033Modified: scope.migration033Modified,
    existingTrackedFileModified: scope.existingTrackedFileModified,
    forwardMigrationUsed: fileExists(MIGRATION_034_REL) && !scope.migration033Modified,

    postgresqlVersion: live.postgresVersion,
    postgresqlMajorVersion: live.postgresMajorVersion,
    postgresqlVersionVerified: live.postgresMajorVersion === 17,
    pgcryptoAvailable: live.pgcryptoAvailable,
    isolatedDatabaseUsed: live.containerStarted,
    remoteDatabaseUsed: false,
    productionDatabaseUsed: false,
    realUserDataUsed: false,
    realGermanKnowledgeDataUsed: false,
    isolationMethod: `disposable ${POSTGRES_IMAGE} Docker container bound to ${DB_HOST}, in-container psql only`,
    containerName: CONTAINER_NAME,
    containerRemoved: live.containerRemoved,
    containerAbsentAfterCleanup: live.containerAbsentAfterCleanup,

    migration032Applied: live.migration032Applied,
    migration033Applied: live.migration033Applied,
    migration034Applied: live.migration034Applied,
    migration034ApplicationAtomic: live.migration034Atomic,
    migration034AtomicEvidence: live.migration034AtomicDetail,

    affectedFunctionCount: affectedFunctions.length,
    affectedFunctionsAudited: affectedFunctions.length,
    affectedFunctions,
    replacedFunctionCount: parsed034.length,
    previouslyBrokenGrantableRpcCount: PREVIOUSLY_BROKEN_RPCS.length,
    previouslyBrokenGrantableRpcsTested: testedBroken.length,
    previouslyBrokenGrantableRpcsNowExecutable: nowExecutable.length,
    ambiguousColumnFailuresRemaining: ambiguousRemaining,
    focusFailures,

    internalTransitionEngineRuntimeValid,
    internalTranslationCoreRuntimeValid,
    internalEnginesDirectlyGranted: live.internalEnginesDirectlyGranted,
    internalFunctionGrantEvidence: live.internalFunctionGrantEvidence,

    functionSignaturesPreserved: contractPreserved,
    returnContractsPreserved: contractPreserved,
    transitionRulesPreserved: fullTransitionMatrixValidated,
    translationRulesPreserved: translationLifecycleValidated && activeApprovedTranslationUniquenessValidated,
    grantModelPreserved,
    rlsModelPreserved,
    securityDefinerModelPreserved,
    searchPathHardeningPreserved: live.securityDefinerCount === live.hardenedSearchPathCount && live.securityDefinerCount > 0,
    contractDrift: live.contractDrift,

    privilegedActorClassCallerControlled,
    genericPrivilegedTransitionEngineDirectlyGranted: genericEngineGranted,
    actorClassDerivedFromTrustedOperation,
    reviewerActorClassCallerControlled,
    emergencyActorClassCallerControlled,
    administratorActorClassCallerControlled,
    systemActorClassCallerControlled,
    actorClassContainmentEvidence: callerActorTextRows.map((r) => `${r.verdict} ${r.detail}`),

    fullPhase9NAuditExecuted: rerun.executed,
    fullPhase9NAuditPassed: rerun.passed,
    fullPhase9NAuditExitCode: rerun.exitCode,
    fullPhase9NAuditOutcome: rerun.outcome,
    fullPhase9NAuditOutputVerified: rerun.outputVerified,
    fullPhase9NAuditMigration034Observed: rerun.migration034Observed,
    fullPhase9NAuditMarkerObserved: rerun.markerObserved,
    fullPhase9NAuditCheckId: rerun.checkIdObserved,
    fullPhase9NAuditPositiveCaseCount: rerun.positiveCaseCount,
    fullPhase9NAuditPositiveCasesPassed: rerun.positiveCasesPassed,
    fullPhase9NAuditNegativeCaseCount: rerun.negativeCaseCount,
    fullPhase9NAuditNegativeCasesRejected: rerun.negativeCasesRejected,
    fullPhase9NAuditOutputFindings: rerun.outputFindings,

    childSpawnAttempted: rerun.spawnAttempted,
    childSpawnSucceeded: rerun.spawnSucceeded,
    childProcessActuallyExecuted: rerun.actuallyExecuted,
    childProcessExitCode: rerun.exitCode,
    childProcessSignal: rerun.signal,
    childProcessErrorCode: rerun.errorCode,
    childStdoutCaptured: rerun.stdoutCaptured,
    childStderrCaptured: rerun.stderrCaptured,
    childShellFree: !rerun.shellUsed,
    childNodeExecPath: rerun.nodeExecPath,
    childNodeExecPathResolved: Boolean(rerun.nodeExecPath) && fileExistsAbsolute(rerun.nodeExecPath),
    childTsxCliPath: rerun.tsxCliPath,
    childTsxCliResolved: Boolean(rerun.tsxCliPath) && fileExistsAbsolute(rerun.tsxCliPath),
    childTsxResolutionStrategy: rerun.tsxResolutionStrategy,

    repositoryStateProfile: scope.profile,
    repositoryStateProfileRecognized: scope.profileRecognized,
    repositoryStateProfileDescription: scope.profileDescription,
    expectedModifiedTrackedFiles: scope.expectedModifiedTrackedFiles,
    actualModifiedTrackedFiles: scope.modifiedTrackedFiles,
    expectedUntrackedFiles: scope.expectedUntrackedFiles,
    actualUntrackedFiles: scope.untrackedFiles,
    unexpectedRepositoryPaths: scope.unexpectedRepositoryPaths,
    missingRequiredArtifacts: scope.missingRequiredArtifacts,
    migration034Present: scope.migration034Present,
    migration034Sha256Recomputed: sha256Hex(readFileText(MIGRATION_034_REL)),

    phase9NRunnerProxyFlagDebtRecorded: true,
    phase9NRunnerProxyFlags: [...PHASE_9N_RUNNER_PROXY_FLAGS],
    phase9NRunnerProxyFlagNote:
      "In the PHASE 9N runner these four fields are assigned = allRpcsExecutable rather than measured " +
      "independently. This audit measures all four for real (90-cell matrix, two-session concurrency, " +
      "stale-version rejection, double-transition prevention), so the debt is recorded, not blocking. " +
      "Follow-up: PHASE 9N-MEASUREMENT-CLOSURE — Durable Transition Matrix and Concurrency Evidence Integration.",

    harnessTamperCaseCount: 0,
    harnessTamperCasesRejected: 0,
    phase9NAuditAppliesMigration034: rerun.appliesMigration034,
    phase9NAuditRequiresOwnFileUntracked: rerun.requiresOwnFileUntracked,
    phase9NAuditPinnedCommit: rerun.pinnedExpectedCommit,
    phase9NAuditStructuralBlockers: rerun.blockingReasons,
    phase9NEquivalentSurfaceRevalidatedHere: substantivePass,

    fullTransitionMatrixValidated,
    transitionMatrixCellCount: live.matrixRows.length,
    transitionMatrixAllowedCount: matrixAllowed.length,
    transitionMatrixRejectedCount: matrixRejected.length,
    transitionMatrixSideEffectCount: matrixSideEffect.length,
    publicationTransitionRuleCount,
    optimisticConcurrencyValidated,
    wrapperLevelConcurrencyValidated,
    concurrentSessionsUsed: live.concurrentSessionsUsed,
    rowLockingVerified: live.rowLockObserved,
    lostUpdatePrevented: live.lostUpdatePrevented,
    doubleTransitionPrevented: live.doubleTransitionPrevented,
    timeoutCleanupVerified: live.lockTimeoutObserved && live.residualLockCount === 0,
    residualLockCount: live.residualLockCount,
    concurrencyEvidence: live.concurrencyDetail,

    bootstrapValidated,
    transitionHistoryValidated,
    applicationRoleHistoryImmutabilityValidated: historyImmutability,
    historyImmutabilityBoundary:
      "application-role immutable: an append-only trigger rejects UPDATE and DELETE (SQLSTATE P0001) for every " +
      "role including the table owner in this run; absolute immutability against a superuser who first disables " +
      "the trigger is NOT claimed.",

    machineTranslationCandidateValidated,
    humanTranslationCandidateValidated,
    translationApprovalValidated,
    translationRejectionValidated,
    translationLifecycleValidated,
    canonicalFingerprintValidated,
    canonicalInvalidationTriggerCount: invalidationRows.length,
    canonicalInvalidationTriggersValidated,
    activeApprovedTranslationUniquenessValidated,
    transactionRollbackValidated,
    translationLifecycleFailures: live.tlRows
      .filter((r) => r.verdict !== "PASS")
      .map((r) => `${r.name}: ${r.verdict} ${r.detail}`),

    rlsEnabledForAllNewTables: live.newTableRlsEnabledCount === NEW_TABLES.length,
    publicPrivilegesRevoked: publicBlocked && live.newTableRoleGrantCount === 0,
    anonDirectAccessBlocked: anonBlocked && directDmlAllDenied,
    authenticatedDirectAccessBlocked: authBlocked && directDmlAllDenied,
    serviceRoleDirectAccessBlocked: directDmlAllDenied,
    grantableRpcsExecutableByServiceRole: live.grantableRpcsExecutableByServiceRole.length,
    grantableRpcsExecutableByAnon: live.grantableRpcsExecutableByAnon.length,
    grantableRpcsExecutableByAuthenticated: live.grantableRpcsExecutableByAuthenticated.length,
    grantableRpcsExecutableByPublic: live.grantableRpcsExecutableByPublic.length,
    securityDefinerFunctionCount: live.securityDefinerCount,
    hardenedSearchPathCount: live.hardenedSearchPathCount,
    securityDefinerSearchPathValidated:
      live.securityDefinerCount > 0 && live.securityDefinerCount === live.hardenedSearchPathCount,
    schemaShadowingAttackBlocked: live.shadowAttackBlocked,
    schemaShadowingEvidence: live.shadowDetail,

    staticAnalysisMethod:
      "LEXICAL HEURISTIC over migration text (comment/string masking, INSERT column-list and UPDATE SET-target " +
      "masking, then bare-identifier matching against RETURNS TABLE output names). This is NOT a SQL parser. It " +
      "enumerates and locates the ambiguity surface only; every pass/fail claim is decided by live PostgreSQL " +
      "execution, and the heuristic is calibrated against the runtime-confirmed PHASE 9N defect set.",
    unsafeAmbiguousReferencesBefore: staticBefore.totalReferences,
    unsafeAmbiguousReferencesAfter: staticAfter.totalReferences,
    staticFindingsBefore: staticBefore.findings.map((f) => `${f.functionName}.${f.identifier} x${f.occurrences}`),
    staticFindingsAfter: staticAfter.findings.map((f) => `${f.functionName}.${f.identifier} x${f.occurrences}`),
    staticHeuristicCalibrated,
    runtimeConfirmedBrokenFunctions: runtimeConfirmedBroken,

    patchPositiveCaseCount,
    patchPositiveCasesPassed,
    patchNegativeOrTamperCaseCount: live.tamperRows.length,
    patchNegativeOrTamperCasesRejected: tamperRejected.length,
    patchCasesAllowedForbidden: tamperAllowed.length,
    patchCasesFailedForWrongReason: tamperWrong.length,
    tamperCategoryBreakdown: tamperBreakdown,

    migrationModificationPerformed: fileExists(MIGRATION_034_REL),
    databasePatchPerformed: false,
    productionAuthorizationGranted: false,
    publicRuntimeAuthorized: false,
    realKnowledgeIngestionPerformed: false,

    readyForGeneratedDatabaseTypeDecisionClosure: allPassed,
    readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: false,

    environmentBlocked,
    liveExecutionErrors: live.errors,
    nextRecommendedPhase: allPassed
      ? "PHASE 9N-MEASUREMENT-CLOSURE — Durable Transition Matrix and Concurrency Evidence Integration, " +
        "then commit the PHASE 9N runner, this audit and migration 034 together, then PHASE 9O"
      : substantivePass
        ? "Repair the PHASE 9N child invocation or repository-state profile, then re-run"
        : "PHASE 9N-PATCH follow-up — remaining runtime defect",
    evidence: [
      `postgresql=${live.postgresVersion}`,
      `migrations=032:${live.migration032Applied} 033:${live.migration033Applied} 034:${live.migration034Applied}`,
      `034Atomic=${live.migration034Atomic} (${live.migration034AtomicDetail})`,
      `contractRows=${live.contractRowsBefore.length}->${live.contractRowsAfter.length} drift=${live.contractDrift.length}`,
      `previouslyBroken=${PREVIOUSLY_BROKEN_RPCS.length} tested=${testedBroken.length} nowExecutable=${nowExecutable.length} ambiguousRemaining=${ambiguousRemaining}`,
      `matrix cells=${live.matrixRows.length} allowed=${matrixAllowed.length} rejected=${matrixRejected.length} sideEffect=${matrixSideEffect.length}`,
      `concurrency sessions=${live.concurrentSessionsUsed} stale=${live.staleVersionRejected} doubleTransitionPrevented=${live.doubleTransitionPrevented} residualLocks=${live.residualLockCount}`,
      `translation invalidationTriggers=${invalidationPassed.length}/${invalidationRows.length}`,
      `tamper cases=${live.tamperRows.length} rejected=${tamperRejected.length} allowed=${tamperAllowed.length} wrongfail=${tamperWrong.length}`,
      `staticAmbiguity before=${staticBefore.totalReferences} after=${staticAfter.totalReferences} calibrated=${staticHeuristicCalibrated}`,
      `securityDefiner=${live.securityDefinerCount} hardenedSearchPath=${live.hardenedSearchPathCount} shadowBlocked=${live.shadowAttackBlocked}`,
      `phase9NRerun exit=${rerun.exitCode} outcome=${rerun.outcome} appliesMigration034=${rerun.appliesMigration034}`,
      `cleanup containerRemoved=${live.containerRemoved} absent=${live.containerAbsentAfterCleanup}`,
    ],
  };
}

// ============================================================================
// TAMPER SELF-TEST (the audit must reject a falsified result)
// ============================================================================

interface TamperCase {
  id: number;
  description: string;
  mutate: (r: Result) => void;
}

const TAMPER_CASES: TamperCase[] = [
  { id: 1, description: "migration 033 edited but claimed pass", mutate: (r) => { r.migration033Modified = true; r.allPassed = true; } },
  { id: 2, description: "tracked file modified but claimed pass", mutate: (r) => { r.existingTrackedFileModified = true; r.allPassed = true; } },
  { id: 3, description: "repository scope invalid but claimed pass", mutate: (r) => { r.repositoryScopeValid = false; r.allPassed = true; } },
  { id: 4, description: "forward migration not used", mutate: (r) => { r.forwardMigrationUsed = false; r.allPassed = true; } },
  { id: 5, description: "PostgreSQL is not major 17", mutate: (r) => { r.postgresqlMajorVersion = 16; r.postgresqlVersionVerified = false; r.allPassed = true; } },
  { id: 6, description: "version claimed verified while major is wrong", mutate: (r) => { r.postgresqlMajorVersion = 15; r.allPassed = true; } },
  { id: 7, description: "remote database used", mutate: (r) => { r.remoteDatabaseUsed = true; r.allPassed = true; } },
  { id: 8, description: "production database used", mutate: (r) => { r.productionDatabaseUsed = true; r.allPassed = true; } },
  { id: 9, description: "real user data used", mutate: (r) => { r.realUserDataUsed = true; r.allPassed = true; } },
  { id: 10, description: "real German knowledge data used", mutate: (r) => { r.realGermanKnowledgeDataUsed = true; r.allPassed = true; } },
  { id: 11, description: "migration 034 not applied", mutate: (r) => { r.migration034Applied = false; r.allPassed = true; } },
  { id: 12, description: "migration 034 not atomic", mutate: (r) => { r.migration034ApplicationAtomic = false; r.allPassed = true; } },
  { id: 13, description: "fewer than 14 previously broken RPCs tested", mutate: (r) => { r.previouslyBrokenGrantableRpcsTested = 13; r.allPassed = true; } },
  { id: 14, description: "fewer than 14 RPCs now executable", mutate: (r) => { r.previouslyBrokenGrantableRpcsNowExecutable = 13; r.allPassed = true; } },
  { id: 15, description: "42702 failures remain", mutate: (r) => { r.ambiguousColumnFailuresRemaining = 1; r.allPassed = true; } },
  { id: 16, description: "focused regression failure hidden", mutate: (r) => { r.focusFailures = ["knowledge_approve_translation: AMBIG"]; r.allPassed = true; } },
  { id: 17, description: "internal transition engine still ambiguous", mutate: (r) => { r.internalTransitionEngineRuntimeValid = false; r.allPassed = true; } },
  { id: 18, description: "internal translation core still ambiguous", mutate: (r) => { r.internalTranslationCoreRuntimeValid = false; r.allPassed = true; } },
  { id: 19, description: "internal engines became grantable", mutate: (r) => { r.internalEnginesDirectlyGranted = true; r.allPassed = true; } },
  { id: 20, description: "function signatures changed", mutate: (r) => { r.functionSignaturesPreserved = false; r.allPassed = true; } },
  { id: 21, description: "return contracts changed", mutate: (r) => { r.returnContractsPreserved = false; r.allPassed = true; } },
  { id: 22, description: "contract drift present but claimed pass", mutate: (r) => { r.contractDrift = ["- SIG|x"]; r.allPassed = true; } },
  { id: 23, description: "transition rules changed", mutate: (r) => { r.transitionRulesPreserved = false; r.allPassed = true; } },
  { id: 24, description: "translation rules changed", mutate: (r) => { r.translationRulesPreserved = false; r.allPassed = true; } },
  { id: 25, description: "grant model weakened", mutate: (r) => { r.grantModelPreserved = false; r.allPassed = true; } },
  { id: 26, description: "RLS model weakened", mutate: (r) => { r.rlsModelPreserved = false; r.allPassed = true; } },
  { id: 27, description: "SECURITY DEFINER model weakened", mutate: (r) => { r.securityDefinerModelPreserved = false; r.allPassed = true; } },
  { id: 28, description: "search path hardening lost", mutate: (r) => { r.searchPathHardeningPreserved = false; r.allPassed = true; } },
  { id: 29, description: "privileged actor class caller-controlled", mutate: (r) => { r.privilegedActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 30, description: "generic engine granted", mutate: (r) => { r.genericPrivilegedTransitionEngineDirectlyGranted = true; r.allPassed = true; } },
  { id: 31, description: "actor class no longer operation-derived", mutate: (r) => { r.actorClassDerivedFromTrustedOperation = false; r.allPassed = true; } },
  { id: 32, description: "reviewer actor class caller-controlled", mutate: (r) => { r.reviewerActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 33, description: "emergency actor class caller-controlled", mutate: (r) => { r.emergencyActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 34, description: "administrator actor class caller-controlled", mutate: (r) => { r.administratorActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 35, description: "system actor class caller-controlled", mutate: (r) => { r.systemActorClassCallerControlled = true; r.allPassed = true; } },
  { id: 36, description: "transition matrix incomplete", mutate: (r) => { r.transitionMatrixCellCount = 40; r.fullTransitionMatrixValidated = false; r.allPassed = true; } },
  { id: 37, description: "rejected transition left a side effect", mutate: (r) => { r.transitionMatrixSideEffectCount = 1; r.allPassed = true; } },
  { id: 38, description: "optimistic concurrency not validated", mutate: (r) => { r.optimisticConcurrencyValidated = false; r.allPassed = true; } },
  { id: 39, description: "wrapper-level concurrency not validated", mutate: (r) => { r.wrapperLevelConcurrencyValidated = false; r.allPassed = true; } },
  { id: 40, description: "single session claimed as concurrency", mutate: (r) => { r.concurrentSessionsUsed = 1; r.allPassed = true; } },
  { id: 41, description: "lost update possible", mutate: (r) => { r.lostUpdatePrevented = false; r.allPassed = true; } },
  { id: 42, description: "double transition possible", mutate: (r) => { r.doubleTransitionPrevented = false; r.allPassed = true; } },
  { id: 43, description: "residual locks remain", mutate: (r) => { r.residualLockCount = 2; r.timeoutCleanupVerified = false; r.allPassed = true; } },
  { id: 44, description: "history mutable by application role", mutate: (r) => { r.applicationRoleHistoryImmutabilityValidated = false; r.allPassed = true; } },
  { id: 45, description: "machine candidate not validated", mutate: (r) => { r.machineTranslationCandidateValidated = false; r.allPassed = true; } },
  { id: 46, description: "human candidate not validated", mutate: (r) => { r.humanTranslationCandidateValidated = false; r.allPassed = true; } },
  { id: 47, description: "approval not validated", mutate: (r) => { r.translationApprovalValidated = false; r.allPassed = true; } },
  { id: 48, description: "rejection not validated", mutate: (r) => { r.translationRejectionValidated = false; r.allPassed = true; } },
  { id: 49, description: "fingerprint behaviour not validated", mutate: (r) => { r.canonicalFingerprintValidated = false; r.allPassed = true; } },
  { id: 50, description: "fewer than 8 invalidation triggers", mutate: (r) => { r.canonicalInvalidationTriggerCount = 7; r.canonicalInvalidationTriggersValidated = false; r.allPassed = true; } },
  { id: 51, description: "active-approved uniqueness not validated", mutate: (r) => { r.activeApprovedTranslationUniquenessValidated = false; r.allPassed = true; } },
  { id: 52, description: "rollback not validated", mutate: (r) => { r.transactionRollbackValidated = false; r.allPassed = true; } },
  { id: 53, description: "RLS disabled on a new table", mutate: (r) => { r.rlsEnabledForAllNewTables = false; r.allPassed = true; } },
  { id: 54, description: "public privileges retained", mutate: (r) => { r.publicPrivilegesRevoked = false; r.allPassed = true; } },
  { id: 55, description: "anon direct access allowed", mutate: (r) => { r.anonDirectAccessBlocked = false; r.allPassed = true; } },
  { id: 56, description: "authenticated direct access allowed", mutate: (r) => { r.authenticatedDirectAccessBlocked = false; r.allPassed = true; } },
  { id: 57, description: "service_role direct table DML allowed", mutate: (r) => { r.serviceRoleDirectAccessBlocked = false; r.allPassed = true; } },
  { id: 58, description: "anon can execute a grantable RPC", mutate: (r) => { r.grantableRpcsExecutableByAnon = 1; r.allPassed = true; } },
  { id: 59, description: "authenticated can execute a grantable RPC", mutate: (r) => { r.grantableRpcsExecutableByAuthenticated = 1; r.allPassed = true; } },
  { id: 60, description: "PUBLIC can execute a grantable RPC", mutate: (r) => { r.grantableRpcsExecutableByPublic = 1; r.allPassed = true; } },
  { id: 61, description: "service_role lost a wrapper grant", mutate: (r) => { r.grantableRpcsExecutableByServiceRole = 14; r.allPassed = true; } },
  { id: 62, description: "search path not hardened on every definer", mutate: (r) => { r.hardenedSearchPathCount = r.securityDefinerFunctionCount - 1; r.securityDefinerSearchPathValidated = false; r.allPassed = true; } },
  { id: 63, description: "schema shadowing succeeded", mutate: (r) => { r.schemaShadowingAttackBlocked = false; r.allPassed = true; } },
  { id: 64, description: "ambiguous references remain after patch", mutate: (r) => { r.unsafeAmbiguousReferencesAfter = 3; r.allPassed = true; } },
  { id: 65, description: "no ambiguity found before patch (heuristic broken)", mutate: (r) => { r.unsafeAmbiguousReferencesBefore = 0; r.allPassed = true; } },
  { id: 66, description: "static heuristic not calibrated", mutate: (r) => { r.staticHeuristicCalibrated = false; r.allPassed = true; } },
  { id: 67, description: "affected function count mismatch", mutate: (r) => { r.affectedFunctionCount = 9; r.allPassed = true; } },
  { id: 68, description: "audited fewer functions than affected", mutate: (r) => { r.affectedFunctionsAudited = 5; r.allPassed = true; } },
  { id: 69, description: "tamper pack below the minimum", mutate: (r) => { r.patchNegativeOrTamperCaseCount = 12; r.allPassed = true; } },
  { id: 70, description: "tamper rejection parity broken", mutate: (r) => { r.patchNegativeOrTamperCasesRejected = r.patchNegativeOrTamperCaseCount - 1; r.allPassed = true; } },
  { id: 71, description: "forbidden action allowed", mutate: (r) => { r.patchCasesAllowedForbidden = 1; r.allPassed = true; } },
  { id: 72, description: "negative case failed for the wrong reason", mutate: (r) => { r.patchCasesFailedForWrongReason = 1; r.allPassed = true; } },
  { id: 73, description: "container left running", mutate: (r) => { r.containerRemoved = false; r.containerAbsentAfterCleanup = false; r.allPassed = true; } },
  { id: 74, description: "environment blocked but claimed pass", mutate: (r) => { r.environmentBlocked = true; r.allPassed = true; } },
  { id: 75, description: "live execution errors hidden", mutate: (r) => { r.liveExecutionErrors = ["MIGRATION 034 failed"]; r.allPassed = true; } },
  { id: 76, description: "9N rerun failed but claimed pass", mutate: (r) => { r.fullPhase9NAuditPassed = false; r.fullPhase9NAuditExitCode = 1; r.allPassed = true; } },
  { id: 77, description: "9N rerun not executed but claimed pass", mutate: (r) => { r.fullPhase9NAuditExecuted = false; r.allPassed = true; } },
  { id: 78, description: "database patched directly instead of by migration", mutate: (r) => { r.databasePatchPerformed = true; r.allPassed = true; } },
  { id: 79, description: "production authorization granted", mutate: (r) => { r.productionAuthorizationGranted = true; r.allPassed = true; } },
  { id: 80, description: "public runtime authorized", mutate: (r) => { r.publicRuntimeAuthorized = true; r.allPassed = true; } },
  { id: 81, description: "real knowledge ingestion performed", mutate: (r) => { r.realKnowledgeIngestionPerformed = true; r.allPassed = true; } },
  { id: 82, description: "readiness claimed while blocked", mutate: (r) => { r.blocked = true; r.readyForGeneratedDatabaseTypeDecisionClosure = true; r.allPassed = true; } },
  { id: 83, description: "ingestion readiness claimed", mutate: (r) => { r.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract = true; r.allPassed = true; } },
  { id: 84, description: "matrix allowed count exceeds the rule set", mutate: (r) => { r.transitionMatrixAllowedCount = r.publicationTransitionRuleCount + 5; r.allPassed = true; } },
  { id: 85, description: "transition rule count drifted", mutate: (r) => { r.publicationTransitionRuleCount = 25; r.allPassed = true; } },
  { id: 86, description: "positive cases claimed passed without running", mutate: (r) => { r.patchPositiveCaseCount = 0; r.patchPositiveCasesPassed = 0; r.allPassed = true; } },
  { id: 87, description: "positive case failures hidden", mutate: (r) => { r.patchPositiveCasesPassed = r.patchPositiveCaseCount - 3; r.allPassed = true; } },
  { id: 88, description: "bootstrap not validated", mutate: (r) => { r.bootstrapValidated = false; r.allPassed = true; } },
  { id: 89, description: "transition history not validated", mutate: (r) => { r.transitionHistoryValidated = false; r.allPassed = true; } },
  { id: 90, description: "pgcrypto unavailable", mutate: (r) => { r.pgcryptoAvailable = false; r.allPassed = true; } },
];

/**
 * Falsifications aimed at the validation harness itself rather than the
 * migration. These exist because the harness defects repaired in this phase
 * (a child process that never ran, a single-use repository shape) were exactly
 * the kind of failure the previous tamper pack could not see.
 */
const HARNESS_TAMPER_CASES: TamperCase[] = [
  { id: 101, description: "child executable path missing", mutate: (r) => { r.childNodeExecPathResolved = false; r.childNodeExecPath = ""; r.allPassed = true; } },
  { id: 102, description: "tsx CLI path missing", mutate: (r) => { r.childTsxCliResolved = false; r.childTsxCliPath = ""; r.allPassed = true; } },
  { id: 103, description: "child spawn returned ENOENT", mutate: (r) => { r.childProcessErrorCode = "ENOENT"; r.childSpawnSucceeded = false; r.allPassed = true; } },
  { id: 104, description: "child spawn returned null status", mutate: (r) => { r.childProcessExitCode = -1; r.childProcessActuallyExecuted = false; r.allPassed = true; } },
  { id: 105, description: "child exited non-zero", mutate: (r) => { r.childProcessExitCode = 1; r.fullPhase9NAuditExitCode = 1; r.allPassed = true; } },
  { id: 106, description: "child exited 0 but no PHASE 9N marker", mutate: (r) => { r.fullPhase9NAuditMarkerObserved = false; r.allPassed = true; } },
  { id: 107, description: "child reported PASSED but migration 034 marker missing", mutate: (r) => { r.fullPhase9NAuditMigration034Observed = false; r.allPassed = true; } },
  { id: 108, description: "child output contains BLOCKED", mutate: (r) => { r.fullPhase9NAuditOutcome = "BLOCKED — REPOSITORY STATE"; r.allPassed = true; } },
  { id: 109, description: "unexpected modified tracked path", mutate: (r) => { r.unexpectedRepositoryPaths = ["app/layout.tsx"]; r.actualModifiedTrackedFiles = ["app/layout.tsx"]; r.allPassed = true; } },
  { id: 110, description: "unexpected untracked path", mutate: (r) => { r.unexpectedRepositoryPaths = ["scripts/leftover.sql"]; r.actualUntrackedFiles = ["scripts/leftover.sql"]; r.allPassed = true; } },
  { id: 111, description: "invalid repository-state profile", mutate: (r) => { r.repositoryStateProfile = "anything_goes"; r.allPassed = true; } },
  { id: 112, description: "unrecognised repository-state profile flagged clean", mutate: (r) => { r.repositoryStateProfileRecognized = false; r.allPassed = true; } },
  { id: 113, description: "committed profile with dirty paths", mutate: (r) => { r.repositoryStateProfile = "committed_regression"; r.actualModifiedTrackedFiles = [AUDIT_SELF_REL]; r.allPassed = true; } },
  { id: 114, description: "pre-commit profile missing migration 034", mutate: (r) => { r.repositoryStateProfile = "pre_commit_patch_closure"; r.migration034Present = false; r.allPassed = true; } },
  { id: 115, description: "required artifact missing", mutate: (r) => { r.missingRequiredArtifacts = [MIGRATION_034_REL]; r.allPassed = true; } },
  { id: 116, description: "shell-based execution substituted", mutate: (r) => { r.childShellFree = false; r.allPassed = true; } },
  { id: 117, description: "migration 034 hash changed", mutate: (r) => { r.migration034Sha256 = "0".repeat(64); r.allPassed = true; } },
  { id: 118, description: "migration 034 fingerprint blanked", mutate: (r) => { r.migration034Sha256 = ""; r.migration034Sha256Recomputed = ""; r.allPassed = true; } },
  { id: 119, description: "child stdout not captured", mutate: (r) => { r.childStdoutCaptured = false; r.allPassed = true; } },
  { id: 120, description: "child stderr not captured", mutate: (r) => { r.childStderrCaptured = false; r.allPassed = true; } },
  { id: 121, description: "child killed by signal but claimed pass", mutate: (r) => { r.childProcessSignal = "SIGKILL"; r.allPassed = true; } },
  { id: 122, description: "child spawn never attempted", mutate: (r) => { r.childSpawnAttempted = false; r.allPassed = true; } },
  { id: 123, description: "execution claimed without a successful spawn", mutate: (r) => { r.childSpawnSucceeded = false; r.childProcessActuallyExecuted = true; } },
  { id: 124, description: "9N execution claimed while the child never ran", mutate: (r) => { r.childProcessActuallyExecuted = false; r.fullPhase9NAuditExecuted = true; } },
  { id: 125, description: "child output verification skipped", mutate: (r) => { r.fullPhase9NAuditOutputVerified = false; r.allPassed = true; } },
  { id: 126, description: "child output findings ignored", mutate: (r) => { r.fullPhase9NAuditOutputFindings = ["outcome=BLOCKED"]; r.allPassed = true; } },
  { id: 127, description: "wrong child checkId accepted", mutate: (r) => { r.fullPhase9NAuditCheckId = "9H"; r.allPassed = true; } },
  { id: 128, description: "child positive coverage decreased", mutate: (r) => { r.fullPhase9NAuditPositiveCaseCount = 18; r.fullPhase9NAuditPositiveCasesPassed = 18; r.allPassed = true; } },
  { id: 129, description: "child positive failures hidden", mutate: (r) => { r.fullPhase9NAuditPositiveCasesPassed = r.fullPhase9NAuditPositiveCaseCount - 4; r.allPassed = true; } },
  { id: 130, description: "child negative coverage decreased", mutate: (r) => { r.fullPhase9NAuditNegativeCaseCount = 40; r.fullPhase9NAuditNegativeCasesRejected = 40; r.allPassed = true; } },
  { id: 131, description: "child negative rejection parity broken", mutate: (r) => { r.fullPhase9NAuditNegativeCasesRejected = r.fullPhase9NAuditNegativeCaseCount - 2; r.allPassed = true; } },
  { id: 132, description: "child pass claimed with non-zero exit", mutate: (r) => { r.fullPhase9NAuditPassed = true; r.fullPhase9NAuditExitCode = 1; } },
  { id: 133, description: "proxy-flag debt no longer recorded", mutate: (r) => { r.phase9NRunnerProxyFlagDebtRecorded = false; r.allPassed = true; } },
];

/** Independent re-derivation of pass/fail from a (possibly falsified) result. */
function verifyResultConsistency(r: Result): boolean[] {
  return [
    !(r.allPassed && r.migration033Modified),
    !(r.allPassed && r.existingTrackedFileModified),
    !(r.allPassed && !r.repositoryScopeValid),
    !(r.allPassed && !r.forwardMigrationUsed),
    !(r.allPassed && r.postgresqlMajorVersion !== 17),
    !(r.allPassed && !r.postgresqlVersionVerified),
    !(r.allPassed && r.remoteDatabaseUsed),
    !(r.allPassed && r.productionDatabaseUsed),
    !(r.allPassed && r.realUserDataUsed),
    !(r.allPassed && r.realGermanKnowledgeDataUsed),
    !(r.allPassed && !r.migration032Applied),
    !(r.allPassed && !r.migration033Applied),
    !(r.allPassed && !r.migration034Applied),
    !(r.allPassed && !r.migration034ApplicationAtomic),
    !(r.allPassed && r.previouslyBrokenGrantableRpcCount !== EXPECTED_PREVIOUSLY_BROKEN_COUNT),
    !(r.allPassed && r.previouslyBrokenGrantableRpcsTested !== r.previouslyBrokenGrantableRpcCount),
    !(r.allPassed && r.previouslyBrokenGrantableRpcsNowExecutable !== r.previouslyBrokenGrantableRpcCount),
    !(r.allPassed && r.ambiguousColumnFailuresRemaining !== 0),
    !(r.allPassed && r.focusFailures.length > 0),
    !(r.allPassed && !r.internalTransitionEngineRuntimeValid),
    !(r.allPassed && !r.internalTranslationCoreRuntimeValid),
    !(r.allPassed && r.internalEnginesDirectlyGranted),
    !(r.allPassed && !r.functionSignaturesPreserved),
    !(r.allPassed && !r.returnContractsPreserved),
    !(r.allPassed && r.contractDrift.length > 0),
    !(r.allPassed && !r.transitionRulesPreserved),
    !(r.allPassed && !r.translationRulesPreserved),
    !(r.allPassed && !r.grantModelPreserved),
    !(r.allPassed && !r.rlsModelPreserved),
    !(r.allPassed && !r.securityDefinerModelPreserved),
    !(r.allPassed && !r.searchPathHardeningPreserved),
    !(r.allPassed && r.privilegedActorClassCallerControlled),
    !(r.allPassed && r.genericPrivilegedTransitionEngineDirectlyGranted),
    !(r.allPassed && !r.actorClassDerivedFromTrustedOperation),
    !(r.allPassed && r.reviewerActorClassCallerControlled),
    !(r.allPassed && r.emergencyActorClassCallerControlled),
    !(r.allPassed && r.administratorActorClassCallerControlled),
    !(r.allPassed && r.systemActorClassCallerControlled),
    !(r.allPassed && !r.fullTransitionMatrixValidated),
    !(r.allPassed && r.transitionMatrixCellCount !== REQUIRED_MATRIX_COVERAGE),
    !(r.allPassed && r.transitionMatrixSideEffectCount > 0),
    !(r.allPassed && r.transitionMatrixAllowedCount !== r.publicationTransitionRuleCount - 1),
    !(r.allPassed && r.publicationTransitionRuleCount !== REQUIRED_TRANSITION_RULE_COUNT),
    !(r.allPassed && !r.optimisticConcurrencyValidated),
    !(r.allPassed && !r.wrapperLevelConcurrencyValidated),
    !(r.allPassed && r.concurrentSessionsUsed < 2),
    !(r.allPassed && !r.rowLockingVerified),
    !(r.allPassed && !r.lostUpdatePrevented),
    !(r.allPassed && !r.doubleTransitionPrevented),
    !(r.allPassed && !r.timeoutCleanupVerified),
    !(r.allPassed && r.residualLockCount !== 0),
    !(r.allPassed && !r.bootstrapValidated),
    !(r.allPassed && !r.transitionHistoryValidated),
    !(r.allPassed && !r.applicationRoleHistoryImmutabilityValidated),
    !(r.allPassed && !r.machineTranslationCandidateValidated),
    !(r.allPassed && !r.humanTranslationCandidateValidated),
    !(r.allPassed && !r.translationApprovalValidated),
    !(r.allPassed && !r.translationRejectionValidated),
    !(r.allPassed && !r.translationLifecycleValidated),
    !(r.allPassed && !r.canonicalFingerprintValidated),
    !(r.allPassed && r.canonicalInvalidationTriggerCount !== REQUIRED_INVALIDATION_TRIGGER_COUNT),
    !(r.allPassed && !r.canonicalInvalidationTriggersValidated),
    !(r.allPassed && !r.activeApprovedTranslationUniquenessValidated),
    !(r.allPassed && !r.transactionRollbackValidated),
    !(r.allPassed && !r.rlsEnabledForAllNewTables),
    !(r.allPassed && !r.publicPrivilegesRevoked),
    !(r.allPassed && !r.anonDirectAccessBlocked),
    !(r.allPassed && !r.authenticatedDirectAccessBlocked),
    !(r.allPassed && !r.serviceRoleDirectAccessBlocked),
    !(r.allPassed && r.grantableRpcsExecutableByAnon !== 0),
    !(r.allPassed && r.grantableRpcsExecutableByAuthenticated !== 0),
    !(r.allPassed && r.grantableRpcsExecutableByPublic !== 0),
    !(r.allPassed && r.grantableRpcsExecutableByServiceRole !== GRANTABLE_RPCS.length),
    !(r.allPassed && !r.securityDefinerSearchPathValidated),
    !(r.allPassed && r.hardenedSearchPathCount !== r.securityDefinerFunctionCount),
    !(r.allPassed && !r.schemaShadowingAttackBlocked),
    !(r.allPassed && r.unsafeAmbiguousReferencesAfter !== 0),
    !(r.allPassed && r.unsafeAmbiguousReferencesBefore <= 0),
    !(r.allPassed && !r.staticHeuristicCalibrated),
    !(r.allPassed && r.affectedFunctionCount !== EXPECTED_AFFECTED_FUNCTION_COUNT),
    !(r.allPassed && r.affectedFunctionsAudited !== r.affectedFunctionCount),
    !(r.allPassed && r.patchNegativeOrTamperCaseCount < MIN_PATCH_TAMPER_CASES),
    !(r.allPassed && r.patchNegativeOrTamperCasesRejected !== r.patchNegativeOrTamperCaseCount),
    !(r.allPassed && r.patchCasesAllowedForbidden !== 0),
    !(r.allPassed && r.patchCasesFailedForWrongReason !== 0),
    !(r.allPassed && r.patchPositiveCaseCount <= 0),
    !(r.allPassed && r.patchPositiveCasesPassed !== r.patchPositiveCaseCount),
    !(r.allPassed && !r.containerRemoved),
    !(r.allPassed && !r.containerAbsentAfterCleanup),
    !(r.allPassed && r.environmentBlocked),
    !(r.allPassed && r.liveExecutionErrors.length > 0),
    !(r.allPassed && !r.fullPhase9NAuditExecuted),
    !(r.allPassed && !r.fullPhase9NAuditPassed),
    !(r.allPassed && r.fullPhase9NAuditExitCode !== 0),
    !(r.allPassed && !r.pgcryptoAvailable),
    !(r.allPassed && r.databasePatchPerformed),
    !(r.allPassed && r.productionAuthorizationGranted),
    !(r.allPassed && r.publicRuntimeAuthorized),
    !(r.allPassed && r.realKnowledgeIngestionPerformed),
    !(r.blocked && r.readyForGeneratedDatabaseTypeDecisionClosure),
    !(r.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract),

    // ---- Child-process execution harness ----
    !(r.allPassed && !r.childSpawnAttempted),
    !(r.allPassed && !r.childSpawnSucceeded),
    !(r.allPassed && !r.childProcessActuallyExecuted),
    !(r.allPassed && r.childProcessExitCode !== 0),
    !(r.allPassed && r.childProcessSignal !== null),
    !(r.allPassed && r.childProcessErrorCode !== null),
    !(r.allPassed && !r.childStdoutCaptured),
    !(r.allPassed && !r.childStderrCaptured),
    // A shell would reintroduce quoting and PATH-resolution risk on Windows.
    !(r.allPassed && !r.childShellFree),
    !(r.allPassed && !r.childNodeExecPathResolved),
    !(r.allPassed && !r.childTsxCliResolved),
    !(r.allPassed && r.childTsxCliPath.length === 0),
    // "Executed" may never be claimed without a real exit status behind it.
    !(r.childProcessActuallyExecuted && !r.childSpawnSucceeded),
    !(r.fullPhase9NAuditExecuted && !r.childProcessActuallyExecuted),

    // ---- Child output semantics ----
    !(r.allPassed && !r.fullPhase9NAuditOutputVerified),
    !(r.allPassed && !r.fullPhase9NAuditMarkerObserved),
    !(r.allPassed && !r.fullPhase9NAuditMigration034Observed),
    !(r.allPassed && r.fullPhase9NAuditCheckId !== "9N"),
    !(r.allPassed && r.fullPhase9NAuditOutcome !== "PASSED"),
    !(r.allPassed && r.fullPhase9NAuditOutputFindings.length > 0),
    !(r.allPassed && r.fullPhase9NAuditPositiveCaseCount < EXPECTED_CHILD_POSITIVE_CASES),
    !(r.allPassed && r.fullPhase9NAuditPositiveCasesPassed !== r.fullPhase9NAuditPositiveCaseCount),
    !(r.allPassed && r.fullPhase9NAuditNegativeCaseCount < EXPECTED_CHILD_NEGATIVE_CASES),
    !(r.allPassed && r.fullPhase9NAuditNegativeCasesRejected !== r.fullPhase9NAuditNegativeCaseCount),
    // Exit status and semantic output must agree in both directions.
    !(r.fullPhase9NAuditPassed && r.fullPhase9NAuditExitCode !== 0),
    !(r.fullPhase9NAuditPassed && !r.fullPhase9NAuditOutputVerified),

    // ---- Repository-state profiles ----
    !(r.allPassed && !r.repositoryStateProfileRecognized),
    !(
      r.allPassed &&
      r.repositoryStateProfile !== "pre_commit_patch_closure" &&
      r.repositoryStateProfile !== "committed_regression"
    ),
    !(r.allPassed && r.unexpectedRepositoryPaths.length > 0),
    !(r.allPassed && r.missingRequiredArtifacts.length > 0),
    !(r.allPassed && !r.migration034Present),
    !(
      r.allPassed &&
      r.repositoryStateProfile === "committed_regression" &&
      (r.actualModifiedTrackedFiles.length > 0 || r.actualUntrackedFiles.length > 0)
    ),
    !(
      r.allPassed &&
      r.repositoryStateProfile === "pre_commit_patch_closure" &&
      r.actualModifiedTrackedFiles.length === 0 &&
      r.actualUntrackedFiles.length === 0
    ),

    // ---- Migration fingerprinting ----
    // The reported 034 digest must match an independent recomputation, so a
    // substituted hash cannot ride along with a pass.
    !(r.allPassed && r.migration034Sha256 !== r.migration034Sha256Recomputed),
    !(r.allPassed && r.migration034Sha256.length !== 64),
    !(r.allPassed && r.migration032Sha256.length !== 64),
    !(r.allPassed && r.migration033Sha256.length !== 64),

    // ---- Recorded technical debt ----
    !(r.allPassed && !r.phase9NRunnerProxyFlagDebtRecorded),
    !(r.allPassed && r.phase9NRunnerProxyFlags.length !== PHASE_9N_RUNNER_PROXY_FLAGS.length),
  ];
}

function runTamperPack(
  base: Result,
  cases: TamperCase[]
): { total: number; rejected: number; escaped: string[] } {
  const escaped: string[] = [];
  for (const tc of cases) {
    const clone = JSON.parse(JSON.stringify(base)) as Result;
    tc.mutate(clone);
    const checks = verifyResultConsistency(clone);
    if (checks.every(Boolean)) escaped.push(`#${tc.id} ${tc.description}`);
  }
  return { total: cases.length, rejected: cases.length - escaped.length, escaped };
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const missing = [MIGRATION_032_REL, MIGRATION_033_REL, MIGRATION_034_REL, PHASE_9N_AUDIT_REL].filter((f) => !fileExists(f));
  if (missing.length > 0) {
    console.error(`PHASE 9N-PATCH: required source file(s) missing: ${missing.join(", ")}`);
    process.exit(1);
  }

  const sql033 = readFileText(MIGRATION_033_REL);
  const sql034 = readFileText(MIGRATION_034_REL);

  const staticBefore = analyseAmbiguity(parseFunctions(sql033));
  const staticAfter = analyseAmbiguity(effectiveFunctions(sql033, sql034));

  const scope = analyzeScope();

  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "phase9np-"));
  let live: LiveEvidence;
  try {
    live = performLiveValidation(workDir);
  } finally {
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch {
      /* best effort: the OS temp directory is outside repository scope */
    }
  }

  const rerun = runPhase9NAudit();

  const result = buildResult(scope, live, rerun, staticBefore, staticAfter, sql033, sql034);

  const selfTest = runTamperPack(result, TAMPER_CASES);
  const harnessTest = runTamperPack(result, HARNESS_TAMPER_CASES);
  result.harnessTamperCaseCount = harnessTest.total;
  result.harnessTamperCasesRejected = harnessTest.rejected;

  const escaped = [...selfTest.escaped, ...harnessTest.escaped];
  if (escaped.length > 0) {
    result.allPassed = false;
    result.blocked = true;
    result.readyForGeneratedDatabaseTypeDecisionClosure = false;
    result.blockReason = `${result.blockReason} | Audit tamper self-test escapes: ${escaped.join(", ")}`;
  }

  console.log(JSON.stringify({ ...result, tamperSelfTest: selfTest, harnessTamperTest: harnessTest }, null, 2));

  console.log("");
  console.log(`PHASE 9N-PATCH RESULT: ${result.outcome}`);
  console.log(`  PostgreSQL              : ${result.postgresqlVersion || "n/a"}`);
  console.log(`  migrations 032/033/034  : ${result.migration032Applied}/${result.migration033Applied}/${result.migration034Applied} (034 atomic=${result.migration034ApplicationAtomic})`);
  console.log(`  previously broken RPCs  : ${result.previouslyBrokenGrantableRpcsNowExecutable}/${result.previouslyBrokenGrantableRpcCount} executable, 42702 remaining=${result.ambiguousColumnFailuresRemaining}`);
  console.log(`  internal engines        : transition=${result.internalTransitionEngineRuntimeValid} core=${result.internalTranslationCoreRuntimeValid} granted=${result.internalEnginesDirectlyGranted}`);
  console.log(`  contract drift          : ${result.contractDrift.length}`);
  console.log(`  transition matrix       : ${result.transitionMatrixCellCount} cells, ${result.transitionMatrixAllowedCount} allowed, ${result.transitionMatrixRejectedCount} rejected, ${result.transitionMatrixSideEffectCount} with side effects`);
  console.log(`  concurrency             : sessions=${result.concurrentSessionsUsed} stale=${result.optimisticConcurrencyValidated} lostUpdatePrevented=${result.lostUpdatePrevented} residualLocks=${result.residualLockCount}`);
  console.log(`  translation lifecycle   : ${result.translationLifecycleValidated} (invalidation triggers ${result.canonicalInvalidationTriggerCount}/8)`);
  console.log(`  static ambiguity        : before=${result.unsafeAmbiguousReferencesBefore} after=${result.unsafeAmbiguousReferencesAfter} calibrated=${result.staticHeuristicCalibrated}`);
  console.log(`  patch tamper pack       : ${result.patchNegativeOrTamperCasesRejected}/${result.patchNegativeOrTamperCaseCount} rejected, ${result.patchCasesAllowedForbidden} allowed, ${result.patchCasesFailedForWrongReason} wrong-reason`);
  console.log(`  audit self-test         : ${selfTest.rejected}/${selfTest.total} falsifications rejected`);
  console.log(`  harness tamper pack     : ${harnessTest.rejected}/${harnessTest.total} falsifications rejected`);
  console.log(`  repository profile      : ${result.repositoryStateProfile} (unexpected paths=${result.unexpectedRepositoryPaths.length})`);
  console.log(`  child invocation        : ${result.childNodeExecPath} ${result.childTsxCliPath} [${result.childTsxResolutionStrategy}] shellFree=${result.childShellFree}`);
  console.log(`  child execution         : attempted=${result.childSpawnAttempted} spawned=${result.childSpawnSucceeded} executed=${result.childProcessActuallyExecuted} exit=${result.childProcessExitCode} signal=${result.childProcessSignal ?? "null"} error=${result.childProcessErrorCode ?? "null"}`);
  console.log(`  PHASE 9N rerun          : exit=${result.fullPhase9NAuditExitCode} outcome="${result.fullPhase9NAuditOutcome}" passed=${result.fullPhase9NAuditPassed} outputVerified=${result.fullPhase9NAuditOutputVerified} 034Observed=${result.fullPhase9NAuditMigration034Observed}`);
  console.log(`  PHASE 9N child coverage : positives ${result.fullPhase9NAuditPositiveCasesPassed}/${result.fullPhase9NAuditPositiveCaseCount}, negatives ${result.fullPhase9NAuditNegativeCasesRejected}/${result.fullPhase9NAuditNegativeCaseCount}`);
  for (const b of result.phase9NAuditStructuralBlockers) console.log(`      - ${b}`);
  console.log(`  cleanup                 : removed=${result.containerRemoved} absent=${result.containerAbsentAfterCleanup}`);
  console.log(`  allPassed               : ${result.allPassed}`);
  if (result.blockReason) console.log(`  blocker                 : ${result.blockReason}`);
  console.log(`  next phase              : ${result.nextRecommendedPhase}`);

  process.exit(result.allPassed ? 0 : 1);
}

main();
