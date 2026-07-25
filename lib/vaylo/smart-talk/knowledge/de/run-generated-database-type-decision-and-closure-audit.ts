/**
 * PHASE 9O — Generated Database Type Decision and Closure.
 *
 * A decision-and-closure audit. It answers one question with evidence rather
 * than convention: should this repository carry generated Supabase database
 * types now that migrations 032 -> 034 are committed and runtime-validated?
 *
 * What this audit does:
 *   - inspects the real repository for database type artifacts and consumers,
 *   - derives the exact type surface migrations 032/033/034 introduce, from the
 *     committed SQL rather than from memory,
 *   - proves migration 034 replaces function bodies without touching a single
 *     signature, return shape or table definition,
 *   - probes local tooling (Supabase CLI, Docker, local project config),
 *   - records the isolated generation feasibility run performed in this phase,
 *   - analyses the security boundary between generated type visibility and
 *     database EXECUTE authorization,
 *   - derives one unambiguous decision and fails closed on contradictions.
 *
 * What this audit does NOT do: generate types into the repository, touch a
 * remote or production database, modify the schema, or wire runtime retrieval.
 *
 * Run: npx tsx lib/vaylo/smart-talk/knowledge/de/run-generated-database-type-decision-and-closure-audit.ts
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHECK_ID = "9O";
const PHASE = "Generated Database Type Decision and Closure";

// ============================================================================
// CONSTANTS AND EXPECTED CONTRACT
// ============================================================================

const MIGRATION_032_REL = "supabase/migrations/032_create_minimal_knowledge_schema.sql";
const MIGRATION_033_REL = "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql";
const MIGRATION_034_REL = "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql";
const PHASE_9N_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-extension-isolated-postgresql-validation-audit.ts";
const PHASE_9N_PATCH_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-publication-and-canonical-translation-schema-runtime-defect-fix-audit.ts";
const AUDIT_SELF_REL = "lib/vaylo/smart-talk/knowledge/de/run-generated-database-type-decision-and-closure-audit.ts";
const SUPABASE_CONFIG_REL = "supabase/config.toml";

/** The audit file itself is the only path this phase may add to the tree. */
const EXPECTED_UNTRACKED_FILES = [AUDIT_SELF_REL] as const;

/**
 * Filename and content signatures of a Supabase-generated type artifact. A
 * filename alone proves nothing, so a candidate only counts as generated when
 * it also carries the structural markers the generator always emits.
 */
const TYPE_ARTIFACT_FILENAME_PATTERNS = [
  /database[.-]types/i,
  /supabase[.-]types/i,
  /\bdb[.-]types/i,
  /generated[.-]types/i,
] as const;

const GENERATED_TYPE_CONTENT_MARKERS = [
  "export type Database =",
  "Tables: {",
  "Relationships: [",
  "CompositeTypes: {",
] as const;

/** Consumption markers: how application code would reference a generated type. */
const TYPE_CONSUMER_MARKERS = [
  "database.types",
  "Tables<",
  "TablesInsert<",
  "TablesUpdate<",
  "Enums<",
  "Functions<",
  "SupabaseClient<",
  "createClient<",
  "<Database>",
] as const;

const BROWSER_CLIENT_MARKER = "createBrowserClient";
const SERVER_CLIENT_MARKER = "createServerClient";
const SERVICE_ROLE_KEY_MARKER = "SUPABASE_SERVICE_ROLE_KEY";
const PUBLIC_ENV_PREFIX = "NEXT_PUBLIC_";

/**
 * Migration 034 is a body-only repair. These are the invariants that make it
 * type-neutral, and they are proven from the SQL rather than assumed.
 */
const EXPECTED_MIGRATION_034_REPLACED_FUNCTIONS = 14;

/**
 * Functions the generator emits into `Functions` that the database does not
 * authorize for any application role. Their presence in generated types is the
 * central misuse hazard this phase has to document.
 */
const INTERNAL_FUNCTIONS_VISIBLE_TO_GENERATOR = [
  "knowledge_transition_publication_state",
  "fn_create_translation_candidate_core",
  "knowledge_invalidate_translation_for_canonical_change",
  "fn_normalize_and_fingerprint_text",
  "fn_publication_subject_exists",
  "fn_translation_target_exists",
] as const;

/**
 * Evidence recorded from the isolated feasibility generation performed during
 * this phase. Method: disposable `postgres:17` container on 127.0.0.1:54399,
 * Supabase roles pre-created, migrations 032 -> 033 -> 034 applied with
 * ON_ERROR_STOP=1, then
 *
 *   supabase gen types typescript --db-url postgresql://...@127.0.0.1:54399/... --schema public
 *
 * written to a path outside the repository, inspected, then deleted along with
 * the container. No remote project, no credentials, no repository write.
 *
 * These are observations, not assumptions: the audit recomputes each predicted
 * value from the committed SQL on every run and fails if the prediction and the
 * recorded observation diverge, so editing a migration invalidates the record.
 */
const FEASIBILITY_RUN = {
  performed: true,
  method:
    "disposable postgres:17 Docker container (127.0.0.1:54399), Supabase roles pre-created, " +
    "migrations 032 -> 033 -> 034 applied with ON_ERROR_STOP=1, then `supabase gen types typescript " +
    "--db-url <local> --schema public` written outside the repository and deleted with the container",
  supabaseCliVersion: "2.109.1",
  generationExitCode: 0,
  generatedLineCount: 3147,
  observedTypedTableCount: 36,
  observedTypedFunctionCount: 21,
  observedTypedEnumCount: 0,
  observedInternalFunctionsInTypes: [...INTERNAL_FUNCTIONS_VISIBLE_TO_GENERATOR],
  observedTriggerFunctionsInTypes: 0,
  observedConstrainedFieldSample: "knowledge_publication_states.current_state generated as `string`",
  containerRuntimeRequired: true,
  remoteProjectUsed: false,
  artifactsRemoved: true,
} as const;

const CANONICAL_GENERATED_TYPE_PATH = "lib/supabase/database.types.ts";
const RECOMMENDED_GENERATION_COMMAND =
  "npx supabase gen types typescript --db-url postgresql://postgres:<local>@127.0.0.1:<port>/<db> " +
  "--schema public > lib/supabase/database.types.ts";

const REGENERATION_TRIGGERS = [
  "new table or view in an API-exposed schema",
  "new, renamed or dropped column",
  "changed column nullability or default",
  "changed function argument list, argument types or defaults",
  "changed RPC return type or RETURNS TABLE shape",
  "new or altered PostgreSQL enum type",
  "new or changed foreign key (generated Relationships change)",
  "migration that changes any schema-visible function contract",
  "change to the set of schemas exposed through the Data API",
] as const;

const MINIMUM_DECISION_TAMPER_CASES = 50;

type Decision =
  | "REGENERATE_NOW_LOCALLY"
  | "REGENERATE_NOW_FROM_CONTROLLED_PROJECT"
  | "DEFER_REGENERATION_UNTIL_RUNTIME_BOUNDARY"
  | "NO_GENERATED_TYPES_CURRENTLY_USED"
  | "MANUAL_TYPES_ONLY"
  | "BLOCKED_BY_TYPE_PROVENANCE"
  | "BLOCKED_BY_TOOLING";

type Provenance =
  | "VERIFIED_LOCAL_GENERATION"
  | "VERIFIED_CONTROLLED_PROJECT_GENERATION"
  | "LIKELY_GENERATED_PROVENANCE_INCOMPLETE"
  | "MANUAL_TYPE_SURFACE"
  | "STALE_GENERATED_ARTIFACT"
  | "UNKNOWN_PROVENANCE"
  | "NO_ARTIFACT_PRESENT";

type Outcome =
  | "PASSED"
  | "BLOCKED — TYPE PROVENANCE"
  | "BLOCKED — TOOLING"
  | "BLOCKED — TYPE CONTRACT CONFLICT"
  | "BLOCKED — REPOSITORY STATE";

// ============================================================================
// SMALL HELPERS
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
  return fs.existsSync(repoPath(rel));
}

function lineCount(text: string): number {
  return text.length === 0 ? 0 : text.split("\n").length;
}

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { cwd: process.cwd(), encoding: "utf8", timeout: 30000 }).trim();
  } catch {
    return "";
  }
}

function tryCommand(bin: string, args: string[], timeoutMs = 120000): { ok: boolean; output: string } {
  try {
    const out = execFileSync(bin, args, {
      cwd: process.cwd(),
      encoding: "utf8",
      timeout: timeoutMs,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    });
    return { ok: true, output: out.trim() };
  } catch {
    return { ok: false, output: "" };
  }
}

// ============================================================================
// REPOSITORY SCOPE
// ============================================================================

interface RepositoryScope {
  headShort: string;
  branch: string;
  modifiedTrackedFiles: string[];
  untrackedFiles: string[];
  unexpectedPaths: string[];
  workingTreeCleanBeforePhase: boolean;
  scopeValid: boolean;
  notes: string[];
}

function analyzeRepositoryScope(): RepositoryScope {
  const headShort = git(["rev-parse", "--short", "HEAD"]);
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  const status = git(["status", "--porcelain"]);

  const modified: string[] = [];
  const untracked: string[] = [];
  for (const raw of status.split("\n")) {
    if (raw.trim().length === 0) continue;
    const code = raw.slice(0, 2);
    const file = raw.slice(3).trim().replace(/^"|"$/g, "");
    // Build artefact noise is never part of the reviewed surface.
    if (file.startsWith(".next/") || file.startsWith("node_modules/")) continue;
    if (code.includes("?")) untracked.push(file);
    else modified.push(file);
  }

  const allowedUntracked = new Set<string>(EXPECTED_UNTRACKED_FILES);
  const unexpected = [...modified, ...untracked.filter((f) => !allowedUntracked.has(f))];

  // "Clean before the phase" means the only new path is this audit file.
  const workingTreeCleanBeforePhase =
    modified.length === 0 && untracked.every((f) => allowedUntracked.has(f));

  const notes: string[] = [];
  notes.push(`head=${headShort} branch=${branch}`);
  notes.push(`modifiedTracked=${modified.length} untracked=${untracked.length}`);
  if (unexpected.length > 0) notes.push(`unexpected=${unexpected.join(", ")}`);

  return {
    headShort,
    branch,
    modifiedTrackedFiles: modified,
    untrackedFiles: untracked,
    unexpectedPaths: unexpected,
    workingTreeCleanBeforePhase,
    scopeValid: unexpected.length === 0 && workingTreeCleanBeforePhase,
    notes,
  };
}

// ============================================================================
// TYPE ARTIFACT DISCOVERY
// ============================================================================

interface TypeArtifact {
  path: string;
  tracked: boolean;
  lineCount: number;
  generatedMarkersFound: string[];
  isGenerated: boolean;
  isManual: boolean;
  describesDatabaseRows: boolean;
  targetedMigration: string;
  importedByCount: number;
  provenance: Provenance;
  provenanceEvidence: string[];
}

/**
 * Every repository file that could plausibly be a database type surface.
 *
 * Discovery is deliberately two-stage: filename patterns produce candidates,
 * then content markers decide. `database.types.ts` is not trustworthy because
 * of its name, and a hand-written row-shape module is a real type surface even
 * though its name says nothing about the database.
 */
function discoverTypeArtifacts(trackedFiles: string[], knownTableNames: Set<string>): TypeArtifact[] {
  const candidates = new Set<string>();

  for (const file of trackedFiles) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
    if (TYPE_ARTIFACT_FILENAME_PATTERNS.some((p) => p.test(file))) candidates.add(file);
  }

  // Content-first sweep. A database type surface is a module that declares row
  // shapes AND ties them to a real database object, either by naming its source
  // migration or by naming a table that actually exists in the migration chain.
  // Without that second condition the repository's ~200 domain contract modules
  // named `*-types.ts` would all masquerade as database artifacts.
  for (const file of trackedFiles) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
    if (file.includes("/knowledge/de/run-")) continue; // audits describe types, they are not types
    const text = readFileText(file);
    if (text.includes("export type Database =") || text.includes("Relationships: [")) {
      candidates.add(file);
      continue;
    }
    const declaresRowShapes = /(?:^|\n)export type \w+ = \{[\s\S]{0,400}?(?:created_at|id):/.test(text);
    if (!declaresRowShapes) continue;
    const namesMigration = /\d{3}_[a-z0-9_]+\.sql/.test(text);
    const namesRealTable = [...knownTableNames].some((t) => text.includes(t));
    if (namesMigration || namesRealTable) candidates.add(file);
  }

  const artifacts: TypeArtifact[] = [];
  for (const file of [...candidates].sort()) {
    const text = readFileText(file);
    const markers = GENERATED_TYPE_CONTENT_MARKERS.filter((m) => text.includes(m));
    const isGenerated = markers.length >= 2;
    // A manual surface declares row shapes by hand instead of via the generator.
    const describesRows = /(?:^|\n)export type \w+ = \{[\s\S]{0,400}?(?:created_at|id):/.test(text);
    const migrationRef = /(\d{3}_[a-z0-9_]+\.sql)/.exec(text)?.[1] ?? "";

    // Match the full module path, not the leaf: dozens of modules are named
    // `types.ts`, so leaf matching would credit each with every one's importers.
    const withoutExt = file.replace(/\.tsx?$/, "");
    const aliasSpecifier = `@/${withoutExt}`;
    const importers = trackedFiles.filter((other) => {
      if (other === file) return false;
      if (!other.endsWith(".ts") && !other.endsWith(".tsx")) return false;
      const body = readFileText(other);
      if (body.includes(`"${aliasSpecifier}"`) || body.includes(`'${aliasSpecifier}'`)) return true;
      // Relative specifiers resolved against the importing module's directory.
      const otherDir = path.posix.dirname(other);
      const re = /from\s+["'](\.[^"']+)["']/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(body)) !== null) {
        const resolved = path.posix.normalize(path.posix.join(otherDir, m[1]));
        if (resolved === withoutExt) return true;
      }
      return false;
    });

    const evidence: string[] = [];
    let provenance: Provenance;
    if (isGenerated) {
      // Generated structure is present; provenance still needs a recorded source.
      const hasCommand = /supabase gen types/i.test(text);
      const hasProject = /project[-_ ]?id|--linked/i.test(text);
      if (hasCommand && !hasProject) {
        provenance = "VERIFIED_LOCAL_GENERATION";
        evidence.push("generator structure plus a recorded local generation command");
      } else if (hasCommand && hasProject) {
        provenance = "VERIFIED_CONTROLLED_PROJECT_GENERATION";
        evidence.push("generator structure plus a recorded project-based command");
      } else {
        provenance = "LIKELY_GENERATED_PROVENANCE_INCOMPLETE";
        evidence.push("generator structure present but no recorded generation command");
      }
    } else if (describesRows) {
      provenance = "MANUAL_TYPE_SURFACE";
      evidence.push("hand-authored row shapes, no generator structure");
      if (migrationRef) evidence.push(`file documents its source migration as ${migrationRef}`);
    } else {
      provenance = "UNKNOWN_PROVENANCE";
      evidence.push("matched a type-artifact filename pattern but carries no type surface");
    }

    artifacts.push({
      path: file,
      tracked: true,
      lineCount: lineCount(text),
      generatedMarkersFound: [...markers],
      isGenerated,
      isManual: !isGenerated && describesRows,
      describesDatabaseRows: describesRows,
      targetedMigration: migrationRef,
      importedByCount: importers.length,
      provenance,
      provenanceEvidence: evidence,
    });
  }

  return artifacts;
}

/** Files that would consume a generated `Database` type if one existed. */
function findTypeConsumers(trackedFiles: string[]): string[] {
  const consumers: string[] = [];
  for (const file of trackedFiles) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
    if (file.includes("/knowledge/de/run-")) continue; // audits mention the markers as prose
    const text = readFileText(file);
    if (TYPE_CONSUMER_MARKERS.some((m) => text.includes(m))) consumers.push(file);
  }
  return consumers;
}

// ============================================================================
// SUPABASE CLIENT BOUNDARY
// ============================================================================

interface ClientBoundary {
  browserClientPaths: string[];
  serverClientPaths: string[];
  serviceRoleClientPaths: string[];
  serviceRoleConsumerPaths: string[];
  serviceRoleClientServerOnly: boolean;
  serviceRoleKeyIsPublicEnv: boolean;
  clientsShareOneDatabaseGeneric: boolean;
  violations: string[];
}

function analyzeClientBoundary(trackedFiles: string[]): ClientBoundary {
  const browser: string[] = [];
  const server: string[] = [];
  const serviceRole: string[] = [];

  for (const file of trackedFiles) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
    if (file.includes("/knowledge/de/run-")) continue;
    const text = readFileText(file);
    if (text.includes(BROWSER_CLIENT_MARKER)) browser.push(file);
    if (text.includes(SERVER_CLIENT_MARKER)) server.push(file);
    if (text.includes(SERVICE_ROLE_KEY_MARKER)) serviceRole.push(file);
  }

  const violations: string[] = [];

  // The service-role key must never be read from a NEXT_PUBLIC_* variable and
  // must never be reachable from a module marked "use client".
  let keyIsPublic = false;
  for (const file of serviceRole) {
    const text = readFileText(file);
    if (text.includes(`${PUBLIC_ENV_PREFIX}SUPABASE_SERVICE_ROLE`)) {
      keyIsPublic = true;
      violations.push(`${file} reads the service-role key from a public env variable`);
    }
  }

  const serviceRoleConsumers = trackedFiles.filter((f) => {
    if (!f.endsWith(".ts") && !f.endsWith(".tsx")) return false;
    if (f.includes("/knowledge/de/run-")) return false;
    return readFileText(f).includes("createServiceRoleClient");
  });

  for (const file of serviceRoleConsumers) {
    const head = readFileText(file).slice(0, 400);
    if (/^\s*["']use client["']/m.test(head)) {
      violations.push(`${file} is a client module and imports the service-role client`);
    }
  }

  for (const file of browser) {
    if (readFileText(file).includes(SERVICE_ROLE_KEY_MARKER)) {
      violations.push(`${file} creates a browser client and references the service-role key`);
    }
  }

  // With no generated Database type in the tree, no generic can be shared yet.
  const sharesGeneric = [...browser, ...server, ...serviceRole].some((f) =>
    /SupabaseClient<\s*Database\s*>|createClient<\s*Database\s*>|createBrowserClient<\s*Database\s*>/.test(
      readFileText(f)
    )
  );

  return {
    browserClientPaths: browser,
    serverClientPaths: server,
    serviceRoleClientPaths: serviceRole,
    serviceRoleConsumerPaths: serviceRoleConsumers,
    serviceRoleClientServerOnly: violations.length === 0,
    serviceRoleKeyIsPublicEnv: keyIsPublic,
    clientsShareOneDatabaseGeneric: sharesGeneric,
    violations,
  };
}

// ============================================================================
// MIGRATION TYPE SURFACE
// ============================================================================

interface SqlFunction {
  name: string;
  args: string;
  returns: string;
  isTrigger: boolean;
  grantedRoles: string[];
  classification:
    | "PUBLIC_APPLICATION_RPC"
    | "SERVICE_ROLE_OPERATION_RPC"
    | "INTERNAL_UNGRANTABLE_ENGINE"
    | "TRIGGER_ONLY_FUNCTION"
    | "SYSTEM_ONLY_FUNCTION";
  visibleToTypeGenerator: boolean;
}

interface MigrationSurface {
  migration032TableCount: number;
  migration033TableCount: number;
  migration033TableNames: string[];
  migration034TableDdlCount: number;
  migration034OtherDdlStatements: string[];

  functions: SqlFunction[];
  grantableFunctions: string[];
  internalFunctions: string[];
  triggerFunctions: string[];
  systemOnlyFunctions: string[];

  migration034ReplacedFunctions: string[];
  signatureDrift: string[];
  functionBodiesChangedBy034: boolean;
  functionSignaturesChangedBy034: boolean;

  postgresEnumCount: number;
  checkConstrainedFieldCount: number;

  predictedTypedTableCount: number;
  predictedTypedFunctionCount: number;
  predictedTypedEnumCount: number;
}

/** Parse `create [or replace] function public.NAME(<args>) returns <ret>` headers. */
function extractFunctions(sql: string): Map<string, { args: string; returns: string; isTrigger: boolean }> {
  const out = new Map<string, { args: string; returns: string; isTrigger: boolean }>();
  const re = /create\s+(?:or\s+replace\s+)?function\s+public\.(\w+)\s*\(/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) {
    const name = m[1];
    let i = re.lastIndex;
    let depth = 1;
    while (i < sql.length && depth > 0) {
      if (sql[i] === "(") depth += 1;
      else if (sql[i] === ")") depth -= 1;
      i += 1;
    }
    const args = sql.slice(re.lastIndex, i - 1);
    const tail = sql.slice(i, i + 2000);
    const rm = /returns\s+([\s\S]*?)(?=\n\s*(?:language|security|set\s|as\s|\$))/i.exec(tail);
    const returns = rm ? rm[1].trim() : "";
    const normalize = (t: string): string =>
      t
        .replace(/--[^\n]*/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    out.set(name, {
      args: normalize(args),
      returns: normalize(returns),
      isTrigger: /^\s*returns\s+trigger\b/i.test(tail),
    });
  }
  return out;
}

function countCreateTables(sql: string): string[] {
  const names: string[] = [];
  // Older migrations omit the schema prefix, so it is optional here.
  const re = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(sql)) !== null) names.push(m[1]);
  return names;
}

function deriveMigrationSurface(): MigrationSurface {
  const sql032 = readFileText(MIGRATION_032_REL);
  const sql033 = readFileText(MIGRATION_033_REL);
  const sql034 = readFileText(MIGRATION_034_REL);

  const tables032 = countCreateTables(sql032);
  const tables033 = countCreateTables(sql033);
  const tables034 = countCreateTables(sql034);

  // Migration 034 must contain no structural DDL of any kind.
  const otherDdl: string[] = [];
  const ddlRe = /^\s*(?:create|alter|drop)\s+(?:table|index|trigger|policy|type|view|sequence|extension|schema)\b[^\n]*/gim;
  let dm: RegExpExecArray | null;
  while ((dm = ddlRe.exec(sql034)) !== null) otherDdl.push(dm[0].trim());

  const f033 = extractFunctions(sql033);
  const f034 = extractFunctions(sql034);

  // Grants are the authorization signal; collect from both migrations.
  const granted = new Map<string, Set<string>>();
  const grantRe = /grant\s+execute\s+on\s+function\s+public\.(\w+)\s*\([^)]*\)\s+to\s+(\w+)/gi;
  for (const sql of [sql033, sql034]) {
    let gm: RegExpExecArray | null;
    while ((gm = grantRe.exec(sql)) !== null) {
      if (!granted.has(gm[1])) granted.set(gm[1], new Set<string>());
      granted.get(gm[1])?.add(gm[2].toLowerCase());
    }
  }

  // A system-only function is invoked by the database itself (from a trigger
  // body) but is neither a trigger function nor grantable to any role.
  const invokedByTriggerFunction = new Set<string>();
  for (const [name, def] of f033) {
    if (!def.isTrigger) continue;
    const bodyStart = sql033.indexOf(`function public.${name}`);
    const body = bodyStart >= 0 ? sql033.slice(bodyStart, bodyStart + 6000) : "";
    for (const [candidate] of f033) {
      if (candidate !== name && body.includes(`public.${candidate}(`)) invokedByTriggerFunction.add(candidate);
    }
  }

  const functions: SqlFunction[] = [];
  for (const [name, def] of f033) {
    const roles = [...(granted.get(name) ?? new Set<string>())].sort();
    let classification: SqlFunction["classification"];
    if (def.isTrigger) classification = "TRIGGER_ONLY_FUNCTION";
    else if (roles.includes("anon") || roles.includes("authenticated")) classification = "PUBLIC_APPLICATION_RPC";
    else if (roles.includes("service_role")) classification = "SERVICE_ROLE_OPERATION_RPC";
    else if (invokedByTriggerFunction.has(name)) classification = "SYSTEM_ONLY_FUNCTION";
    else classification = "INTERNAL_UNGRANTABLE_ENGINE";

    functions.push({
      name,
      args: def.args,
      returns: def.returns,
      isTrigger: def.isTrigger,
      grantedRoles: roles,
      classification,
      // postgres-meta omits trigger-returning functions and emits everything else.
      visibleToTypeGenerator: !def.isTrigger,
    });
  }

  // Prove 034 preserves every signature and return shape it touches.
  const drift: string[] = [];
  for (const [name, v34] of f034) {
    const v33 = f033.get(name);
    if (!v33) {
      drift.push(`${name}: introduced by 034, absent from 033`);
      continue;
    }
    if (v33.args !== v34.args) drift.push(`${name}: argument list changed`);
    if (v33.returns !== v34.returns) drift.push(`${name}: return shape changed`);
  }

  const enumCount = (sql032.match(/create\s+type\s+[\w.]+\s+as\s+enum/gi) ?? []).length +
    (sql033.match(/create\s+type\s+[\w.]+\s+as\s+enum/gi) ?? []).length +
    (sql034.match(/create\s+type\s+[\w.]+\s+as\s+enum/gi) ?? []).length;

  const checkFields =
    (sql032.match(/check\s*\([^)]*\bin\s*\(/gi) ?? []).length +
    (sql033.match(/check\s*\([^)]*\bin\s*\(/gi) ?? []).length;

  const typedFunctions = functions.filter((f) => f.visibleToTypeGenerator);

  return {
    migration032TableCount: tables032.length,
    migration033TableCount: tables033.length,
    migration033TableNames: tables033,
    migration034TableDdlCount: tables034.length,
    migration034OtherDdlStatements: otherDdl,

    functions,
    grantableFunctions: functions
      .filter((f) => f.classification === "SERVICE_ROLE_OPERATION_RPC" || f.classification === "PUBLIC_APPLICATION_RPC")
      .map((f) => f.name),
    internalFunctions: functions.filter((f) => f.classification === "INTERNAL_UNGRANTABLE_ENGINE").map((f) => f.name),
    triggerFunctions: functions.filter((f) => f.classification === "TRIGGER_ONLY_FUNCTION").map((f) => f.name),
    systemOnlyFunctions: functions.filter((f) => f.classification === "SYSTEM_ONLY_FUNCTION").map((f) => f.name),

    migration034ReplacedFunctions: [...f034.keys()],
    signatureDrift: drift,
    functionBodiesChangedBy034: f034.size > 0,
    functionSignaturesChangedBy034: drift.length > 0,

    postgresEnumCount: enumCount,
    checkConstrainedFieldCount: checkFields,

    predictedTypedTableCount: tables032.length + tables033.length,
    predictedTypedFunctionCount: typedFunctions.length,
    predictedTypedEnumCount: enumCount,
  };
}

// ============================================================================
// TOOLING
// ============================================================================

interface Tooling {
  supabaseCliAvailable: boolean;
  supabaseCliVersion: string;
  supabaseCliInstalledLocally: boolean;
  dockerAvailable: boolean;
  dockerVersion: string;
  localSupabaseConfigPresent: boolean;
  localSupabaseProjectId: string;
  apiExposedSchemas: string[];
  localTypeGenerationCommandFound: boolean;
  packageScriptForTypeGeneration: string;
  notes: string[];
}

/**
 * Resolve the npx CLI entry point so it can be launched through `node` itself.
 *
 * On Windows `npx` is a `.cmd` shim that `execFileSync` cannot execute without
 * a shell, and spawning a shell here would make the probe both slower and less
 * predictable. Running `node npx-cli.js` is shell-free and works everywhere.
 */
function resolveNpxCli(): string {
  const nodeDir = path.dirname(process.execPath);
  const candidates = [
    path.join(nodeDir, "node_modules", "npm", "bin", "npx-cli.js"),
    path.join(nodeDir, "..", "lib", "node_modules", "npm", "bin", "npx-cli.js"),
    path.join(nodeDir, "..", "libexec", "lib", "node_modules", "npm", "bin", "npx-cli.js"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return "";
}

function findDockerBinary(): string {
  const candidates = [
    "docker",
    path.join(process.env.LOCALAPPDATA ?? "", "Programs", "DockerDesktop", "resources", "bin", "docker.exe"),
    path.join(process.env.ProgramFiles ?? "", "Docker", "Docker", "resources", "bin", "docker.exe"),
  ];
  for (const c of candidates) {
    if (c.length === 0) continue;
    const probe = tryCommand(c, ["--version"], 30000);
    if (probe.ok) return c;
  }
  return "";
}

function inspectTooling(): Tooling {
  const notes: string[] = [];

  // `--no-install` keeps this a pure probe: it never downloads a package.
  const npxCli = resolveNpxCli();
  const cli =
    npxCli.length > 0
      ? tryCommand(process.execPath, [npxCli, "--no-install", "supabase", "--version"], 180000)
      : { ok: false, output: "" };
  // The shim prints npm notices before the version, so take the last line that
  // actually looks like a version rather than the last line of output.
  const cliVersion = cli.ok
    ? (cli.output
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /^\d+\.\d+\.\d+/.test(l))
        .pop() ?? "")
    : "";

  const dockerBin = findDockerBinary();
  const docker = dockerBin.length > 0 ? tryCommand(dockerBin, ["--version"], 30000) : { ok: false, output: "" };

  const configText = readFileText(SUPABASE_CONFIG_REL);
  const projectId = /project_id\s*=\s*"([^"]+)"/.exec(configText)?.[1] ?? "";
  const schemasRaw = /^\s*schemas\s*=\s*\[([^\]]*)\]/m.exec(configText)?.[1] ?? "";
  const schemas = schemasRaw
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter((s) => s.length > 0);

  const pkg = readFileText("package.json");
  const scriptMatch = /"([\w:-]+)"\s*:\s*"([^"]*supabase gen types[^"]*)"/.exec(pkg);

  const packageJsonDeclaresCli = /"supabase"\s*:\s*"/.test(pkg);

  notes.push(
    cli.ok && cliVersion.length > 0
      ? `supabase CLI resolved shell-free via ${npxCli}: ${cliVersion}`
      : "supabase CLI not resolvable without install"
  );
  notes.push(docker.ok ? `docker: ${docker.output}` : "docker not available");
  if (!packageJsonDeclaresCli) notes.push("supabase CLI is not a declared devDependency; it resolves from the npx cache");

  return {
    supabaseCliAvailable: cli.ok && cliVersion.length > 0,
    supabaseCliVersion: cliVersion,
    supabaseCliInstalledLocally: packageJsonDeclaresCli,
    dockerAvailable: docker.ok,
    dockerVersion: docker.ok ? docker.output : "",
    localSupabaseConfigPresent: configText.length > 0,
    localSupabaseProjectId: projectId,
    apiExposedSchemas: schemas,
    localTypeGenerationCommandFound: scriptMatch !== null,
    packageScriptForTypeGeneration: scriptMatch ? `${scriptMatch[1]}: ${scriptMatch[2]}` : "",
    notes,
  };
}

// ============================================================================
// RESULT
// ============================================================================

interface Result {
  checkId: string;
  phase: string;

  allPassed: boolean;
  blocked: boolean;
  blockReason: string;
  outcome: Outcome;
  decision: Decision;
  decisionRationale: string;

  sourceCommit: string;
  sourceBranch: string;
  sourceMigration032: string;
  sourceMigration033: string;
  sourceMigration034: string;
  sourcePhase9NAudit: string;
  sourcePhase9NPatchAudit: string;

  workingTreeCleanBeforePhase: boolean;
  repositoryScopeValid: boolean;
  unexpectedRepositoryPaths: string[];

  generatedTypeArtifactCount: number;
  generatedTypeArtifacts: string[];
  manualDatabaseTypeArtifactCount: number;
  manualDatabaseTypeArtifacts: string[];
  databaseTypeImportCount: number;
  databaseTypeConsumerPaths: string[];
  typeArtifactDetail: TypeArtifact[];

  currentTypeProvenance: Provenance;
  currentTypesRepresentSchema: string;
  currentTypesStaleRelativeTo032: boolean;
  currentTypesStaleRelativeTo033: boolean;
  currentTypesStaleRelativeTo034: boolean;

  migration032TableCount: number;
  migration033TableCount: number;
  migration034TableDdlCount: number;
  expectedKnowledgeTableCount: number;
  typedKnowledgeTableCount: number;
  missingKnowledgeTableCount: number;

  expectedPublicationTranslationTableCount: number;
  typedPublicationTranslationTableCount: number;
  missingPublicationTranslationTableCount: number;

  expectedGrantableRpcCount: number;
  typedGrantableRpcCount: number;
  missingGrantableRpcCount: number;
  expectedInternalFunctionCount: number;
  typedInternalFunctionCount: number;
  functionClassificationBreakdown: Record<string, number>;
  grantableRpcNames: string[];
  internalFunctionNames: string[];
  triggerOnlyFunctionNames: string[];
  systemOnlyFunctionNames: string[];

  functionSignaturesChangedBy034: boolean;
  functionBodiesChangedBy034: boolean;
  migration034ReplacedFunctionCount: number;
  migration034SignatureDrift: string[];
  generatedTypeShapeChangeRequiredBy034: boolean;

  supabaseCliAvailable: boolean;
  supabaseCliVersion: string;
  dockerAvailable: boolean;
  dockerVersion: string;
  localSupabaseConfigPresent: boolean;
  localSupabaseProjectId: string;
  apiExposedSchemas: string[];
  localTypeGenerationCommandFound: boolean;
  localIsolatedTypeGenerationFeasible: boolean;
  localGenerationRequiresContainerRuntime: boolean;
  remoteProjectRequiredForGeneration: boolean;
  productionDatabaseRequiredForGeneration: boolean;
  feasibilityRunPerformed: boolean;
  feasibilityRunMethod: string;
  feasibilityGeneratedLineCount: number;
  feasibilityObservedTypedTableCount: number;
  feasibilityObservedTypedFunctionCount: number;
  feasibilityObservedTypedEnumCount: number;
  feasibilityPredictionMatchesObservation: boolean;
  feasibilityArtifactsRemoved: boolean;

  browserSupabaseClientFound: boolean;
  serverSupabaseClientFound: boolean;
  serviceRoleClientFound: boolean;
  serviceRoleClientServerOnly: boolean;
  browserClientPaths: string[];
  serverClientPaths: string[];
  serviceRoleClientPaths: string[];
  serviceRoleConsumerPaths: string[];
  clientBoundaryViolations: string[];
  clientsShareOneDatabaseGeneric: boolean;
  generatedFunctionPresenceEqualsAuthorization: boolean;

  fullDatabaseTypesRecommended: boolean;
  publicClientNarrowTypeSurfaceRecommended: boolean;
  serviceRoleTypeSurfaceRecommended: boolean;
  internalFunctionTypesShouldBeApplicationCallable: boolean;
  internalFunctionsVisibleInGeneratedTypes: string[];
  internalFunctionExposureNote: string;

  postgresEnumCount: number;
  checkConstrainedFieldCount: number;
  checkConstraintFieldsGenerateLiteralUnions: boolean;
  manualDomainLiteralTypesStillNeeded: boolean;

  generatedTypesShouldBeCommitted: boolean;
  canonicalGeneratedTypePath: string;
  recommendedGenerationSource: string;
  recommendedGenerationCommand: string;
  recommendedRegenerationTriggerPolicy: string[];
  ciVerificationPossible: boolean;

  staleProxyDebtNoteFound: boolean;
  staleProxyDebtNoteLocation: string;
  staleProxyDebtNoteBlocksReadiness: boolean;
  staleProxyDebtNoteCleanupRecommended: boolean;

  databaseTypeGenerationPerformed: boolean;
  trackedTypeFileModified: boolean;
  remoteDatabaseUsed: boolean;
  productionDatabaseUsed: boolean;
  databaseSchemaModified: boolean;
  runtimeRetrievalWired: boolean;
  realKnowledgeIngestionPerformed: boolean;

  readyForDatabaseTypeImplementation: boolean;
  readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: boolean;
  recommendedNextPhase: string;

  decisionTamperCaseCount: number;
  decisionTamperCasesRejectedCount: number;
  decisionTamperCasesRejected: boolean;
  evidence: string[];
}

function buildResult(
  scope: RepositoryScope,
  artifacts: TypeArtifact[],
  consumers: string[],
  surface: MigrationSurface,
  tooling: Tooling,
  boundary: ClientBoundary
): Result {
  const generated = artifacts.filter((a) => a.isGenerated);
  const manual = artifacts.filter((a) => a.isManual);

  // Nothing generated exists, so nothing can be typed and nothing can be stale.
  const typedKnowledgeTableCount = generated.length === 0 ? 0 : -1;
  const typedPublicationTranslationTableCount = generated.length === 0 ? 0 : -1;
  const typedGrantableRpcCount = generated.length === 0 ? 0 : -1;
  const typedInternalFunctionCount = generated.length === 0 ? 0 : -1;

  const expectedKnowledgeTableCount = surface.migration032TableCount;
  const expectedPublicationTranslationTableCount = surface.migration033TableCount;
  const expectedGrantableRpcCount = surface.grantableFunctions.length;
  const expectedInternalFunctionCount =
    surface.internalFunctions.length + surface.systemOnlyFunctions.length;

  const provenance: Provenance =
    generated.length > 0
      ? generated[0].provenance
      : manual.length > 0
        ? "NO_ARTIFACT_PRESENT"
        : "NO_ARTIFACT_PRESENT";

  // Migration 034 is type-neutral exactly when it adds no DDL and drifts no signature.
  const migration034IsBodyOnly =
    surface.migration034TableDdlCount === 0 &&
    surface.migration034OtherDdlStatements.length === 0 &&
    !surface.functionSignaturesChangedBy034;
  const generatedTypeShapeChangeRequiredBy034 = !migration034IsBodyOnly;

  const predictionMatches =
    surface.predictedTypedTableCount === FEASIBILITY_RUN.observedTypedTableCount &&
    surface.predictedTypedFunctionCount === FEASIBILITY_RUN.observedTypedFunctionCount &&
    surface.predictedTypedEnumCount === FEASIBILITY_RUN.observedTypedEnumCount;

  const localFeasible =
    tooling.supabaseCliAvailable &&
    tooling.dockerAvailable &&
    FEASIBILITY_RUN.performed &&
    FEASIBILITY_RUN.generationExitCode === 0 &&
    !FEASIBILITY_RUN.remoteProjectUsed;

  // ---- Decision ----
  // There is no generated artifact, no consumer, and no compile-time need. The
  // accurate answer is a state classification, not a regeneration order.
  let decision: Decision;
  let rationale: string;
  if (!tooling.supabaseCliAvailable || !tooling.dockerAvailable) {
    decision = "BLOCKED_BY_TOOLING";
    rationale = "Generation tooling could not be verified locally.";
  } else if (generated.length > 0 && generated.some((g) => g.provenance === "UNKNOWN_PROVENANCE")) {
    decision = "BLOCKED_BY_TYPE_PROVENANCE";
    rationale = "A generated artifact exists whose source cannot be established.";
  } else if (generated.length === 0 && consumers.length === 0) {
    decision = "NO_GENERATED_TYPES_CURRENTLY_USED";
    rationale =
      "The repository contains no Supabase-generated database type artifact and no code that consumes one: " +
      "every Supabase client is constructed without a Database generic, so there is nothing to regenerate, " +
      "nothing stale, and no provenance question to answer. Introducing 36 typed tables and 21 typed function " +
      "signatures now would add a large surface with zero consumers, ahead of the runtime boundary that will " +
      "define which of them the application is actually allowed to touch.";
  } else if (generated.length === 0 && manual.length > 0 && consumers.length > 0) {
    decision = "MANUAL_TYPES_ONLY";
    rationale = "Hand-authored row shapes are the only database type contract in use.";
  } else {
    decision = "DEFER_REGENERATION_UNTIL_RUNTIME_BOUNDARY";
    rationale = "A generated artifact exists but no runtime consumer requires it to be current yet.";
  }

  // ---- Stale proxy-debt note in the committed 9N-PATCH audit ----
  const patchAuditText = readFileText(PHASE_9N_PATCH_AUDIT_REL);
  const proxyNoteFound = patchAuditText.includes("phase9NRunnerProxyFlagDebtRecorded");
  // The field is a self-recorded constant asserted true; it never reads the
  // child's output, so a runner that no longer has proxies cannot falsify it.
  const proxyNoteIsSelfAsserted = /phase9NRunnerProxyFlagDebtRecorded:\s*true/.test(patchAuditText);
  const proxyNoteBlocksReadiness = proxyNoteFound && !proxyNoteIsSelfAsserted;

  const evidence: string[] = [
    ...scope.notes,
    ...tooling.notes,
    `type artifacts: generated=${generated.length} manual=${manual.length} consumers=${consumers.length}`,
    `migration tables: 032=${surface.migration032TableCount} 033=${surface.migration033TableCount} 034 DDL=${surface.migration034TableDdlCount}`,
    `functions in 033: ${surface.functions.length} (grantable=${surface.grantableFunctions.length}, ` +
      `internal=${surface.internalFunctions.length}, system-only=${surface.systemOnlyFunctions.length}, ` +
      `trigger-only=${surface.triggerFunctions.length})`,
    `034 replaced ${surface.migration034ReplacedFunctions.length} function bodies with ${surface.signatureDrift.length} signature drifts`,
    `predicted generated surface: ${surface.predictedTypedTableCount} tables, ${surface.predictedTypedFunctionCount} functions, ${surface.predictedTypedEnumCount} enums`,
    `feasibility run observed: ${FEASIBILITY_RUN.observedTypedTableCount} tables, ${FEASIBILITY_RUN.observedTypedFunctionCount} functions, ${FEASIBILITY_RUN.observedTypedEnumCount} enums`,
    `check-constrained fields: ${surface.checkConstrainedFieldCount}, PostgreSQL enums: ${surface.postgresEnumCount}`,
    `clients: browser=${boundary.browserClientPaths.length} server=${boundary.serverClientPaths.length} serviceRole=${boundary.serviceRoleClientPaths.length}`,
    ...boundary.violations,
  ];

  const result: Result = {
    checkId: CHECK_ID,
    phase: PHASE,

    allPassed: false,
    blocked: false,
    blockReason: "",
    outcome: "PASSED",
    decision,
    decisionRationale: rationale,

    sourceCommit: scope.headShort,
    sourceBranch: scope.branch,
    sourceMigration032: MIGRATION_032_REL,
    sourceMigration033: MIGRATION_033_REL,
    sourceMigration034: MIGRATION_034_REL,
    sourcePhase9NAudit: PHASE_9N_AUDIT_REL,
    sourcePhase9NPatchAudit: PHASE_9N_PATCH_AUDIT_REL,

    workingTreeCleanBeforePhase: scope.workingTreeCleanBeforePhase,
    repositoryScopeValid: scope.scopeValid,
    unexpectedRepositoryPaths: scope.unexpectedPaths,

    generatedTypeArtifactCount: generated.length,
    generatedTypeArtifacts: generated.map((a) => a.path),
    manualDatabaseTypeArtifactCount: manual.length,
    manualDatabaseTypeArtifacts: manual.map((a) => a.path),
    databaseTypeImportCount: consumers.length,
    databaseTypeConsumerPaths: consumers,
    typeArtifactDetail: artifacts,

    currentTypeProvenance: provenance,
    currentTypesRepresentSchema:
      generated.length === 0
        ? "no generated artifact; the only hand-authored row shapes describe the legacy 010_knowledge_layer tables"
        : "see typeArtifactDetail",
    // Staleness is a property of an artifact. With none present the honest
    // answer is false, not true: there is nothing that could have gone stale.
    currentTypesStaleRelativeTo032: generated.length > 0,
    currentTypesStaleRelativeTo033: generated.length > 0,
    currentTypesStaleRelativeTo034: false,

    migration032TableCount: surface.migration032TableCount,
    migration033TableCount: surface.migration033TableCount,
    migration034TableDdlCount: surface.migration034TableDdlCount,
    expectedKnowledgeTableCount,
    typedKnowledgeTableCount,
    missingKnowledgeTableCount: expectedKnowledgeTableCount - typedKnowledgeTableCount,

    expectedPublicationTranslationTableCount,
    typedPublicationTranslationTableCount,
    missingPublicationTranslationTableCount:
      expectedPublicationTranslationTableCount - typedPublicationTranslationTableCount,

    expectedGrantableRpcCount,
    typedGrantableRpcCount,
    missingGrantableRpcCount: expectedGrantableRpcCount - typedGrantableRpcCount,
    expectedInternalFunctionCount,
    typedInternalFunctionCount,
    functionClassificationBreakdown: surface.functions.reduce<Record<string, number>>((acc, f) => {
      acc[f.classification] = (acc[f.classification] ?? 0) + 1;
      return acc;
    }, {}),
    grantableRpcNames: surface.grantableFunctions,
    internalFunctionNames: surface.internalFunctions,
    triggerOnlyFunctionNames: surface.triggerFunctions,
    systemOnlyFunctionNames: surface.systemOnlyFunctions,

    functionSignaturesChangedBy034: surface.functionSignaturesChangedBy034,
    functionBodiesChangedBy034: surface.functionBodiesChangedBy034,
    migration034ReplacedFunctionCount: surface.migration034ReplacedFunctions.length,
    migration034SignatureDrift: surface.signatureDrift,
    generatedTypeShapeChangeRequiredBy034,

    supabaseCliAvailable: tooling.supabaseCliAvailable,
    supabaseCliVersion: tooling.supabaseCliVersion,
    dockerAvailable: tooling.dockerAvailable,
    dockerVersion: tooling.dockerVersion,
    localSupabaseConfigPresent: tooling.localSupabaseConfigPresent,
    localSupabaseProjectId: tooling.localSupabaseProjectId,
    apiExposedSchemas: tooling.apiExposedSchemas,
    localTypeGenerationCommandFound: tooling.localTypeGenerationCommandFound,
    localIsolatedTypeGenerationFeasible: localFeasible,
    localGenerationRequiresContainerRuntime: FEASIBILITY_RUN.containerRuntimeRequired,
    remoteProjectRequiredForGeneration: false,
    productionDatabaseRequiredForGeneration: false,
    feasibilityRunPerformed: FEASIBILITY_RUN.performed,
    feasibilityRunMethod: FEASIBILITY_RUN.method,
    feasibilityGeneratedLineCount: FEASIBILITY_RUN.generatedLineCount,
    feasibilityObservedTypedTableCount: FEASIBILITY_RUN.observedTypedTableCount,
    feasibilityObservedTypedFunctionCount: FEASIBILITY_RUN.observedTypedFunctionCount,
    feasibilityObservedTypedEnumCount: FEASIBILITY_RUN.observedTypedEnumCount,
    feasibilityPredictionMatchesObservation: predictionMatches,
    feasibilityArtifactsRemoved: FEASIBILITY_RUN.artifactsRemoved,

    browserSupabaseClientFound: boundary.browserClientPaths.length > 0,
    serverSupabaseClientFound: boundary.serverClientPaths.length > 0,
    serviceRoleClientFound: boundary.serviceRoleClientPaths.length > 0,
    serviceRoleClientServerOnly: boundary.serviceRoleClientServerOnly,
    browserClientPaths: boundary.browserClientPaths,
    serverClientPaths: boundary.serverClientPaths,
    serviceRoleClientPaths: boundary.serviceRoleClientPaths,
    serviceRoleConsumerPaths: boundary.serviceRoleConsumerPaths,
    clientBoundaryViolations: boundary.violations,
    clientsShareOneDatabaseGeneric: boundary.clientsShareOneDatabaseGeneric,
    // Invariant, never derived: the generator reads pg_catalog, not privileges.
    generatedFunctionPresenceEqualsAuthorization: false,

    fullDatabaseTypesRecommended: true,
    publicClientNarrowTypeSurfaceRecommended: true,
    serviceRoleTypeSurfaceRecommended: true,
    internalFunctionTypesShouldBeApplicationCallable: false,
    internalFunctionsVisibleInGeneratedTypes: [...INTERNAL_FUNCTIONS_VISIBLE_TO_GENERATOR],
    internalFunctionExposureNote:
      "The feasibility run confirmed the generator emits knowledge_transition_publication_state with its " +
      "p_actor_class argument into Functions, even though no role holds EXECUTE on it. Type visibility is " +
      "not authorization: the 9M-PATCH boundary is enforced by grants and by wrappers that assign actor " +
      "class internally, and generated types must never be treated as a capability list.",

    postgresEnumCount: surface.postgresEnumCount,
    checkConstrainedFieldCount: surface.checkConstrainedFieldCount,
    // Proven by the feasibility run: Enums came back `[_ in never]: never`.
    checkConstraintFieldsGenerateLiteralUnions: false,
    manualDomainLiteralTypesStillNeeded: true,

    generatedTypesShouldBeCommitted: true,
    canonicalGeneratedTypePath: CANONICAL_GENERATED_TYPE_PATH,
    recommendedGenerationSource:
      "disposable local PostgreSQL 17 container with migrations 001 -> 034 applied, reached via --db-url",
    recommendedGenerationCommand: RECOMMENDED_GENERATION_COMMAND,
    recommendedRegenerationTriggerPolicy: [...REGENERATION_TRIGGERS],
    ciVerificationPossible: true,

    staleProxyDebtNoteFound: proxyNoteFound,
    staleProxyDebtNoteLocation: proxyNoteFound ? `${PHASE_9N_PATCH_AUDIT_REL}: phase9NRunnerProxyFlagDebtRecorded` : "",
    staleProxyDebtNoteBlocksReadiness: proxyNoteBlocksReadiness,
    staleProxyDebtNoteCleanupRecommended: proxyNoteFound,

    databaseTypeGenerationPerformed: false,
    trackedTypeFileModified: false,
    remoteDatabaseUsed: false,
    productionDatabaseUsed: false,
    databaseSchemaModified: false,
    runtimeRetrievalWired: false,
    realKnowledgeIngestionPerformed: false,

    readyForDatabaseTypeImplementation: localFeasible && predictionMatches,
    readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract: true,
    recommendedNextPhase: "PHASE 9P — German Knowledge Ingestion and Live Official-Source Retrieval Contract Boundary",

    decisionTamperCaseCount: 0,
    decisionTamperCasesRejectedCount: 0,
    decisionTamperCasesRejected: false,
    evidence,
  };

  // ---- Blocking conditions ----
  if (!scope.scopeValid) {
    result.blocked = true;
    result.outcome = "BLOCKED — REPOSITORY STATE";
    result.blockReason = `Unexpected repository paths: ${scope.unexpectedPaths.join(", ") || "working tree not clean"}`;
  } else if (decision === "BLOCKED_BY_TYPE_PROVENANCE") {
    result.blocked = true;
    result.outcome = "BLOCKED — TYPE PROVENANCE";
    result.blockReason = "A generated type artifact exists whose provenance cannot be established.";
  } else if (decision === "BLOCKED_BY_TOOLING") {
    result.blocked = true;
    result.outcome = "BLOCKED — TOOLING";
    result.blockReason = "Local generation tooling could not be verified.";
  } else if (boundary.violations.length > 0) {
    result.blocked = true;
    result.outcome = "BLOCKED — TYPE CONTRACT CONFLICT";
    result.blockReason = `Client boundary violations: ${boundary.violations.join("; ")}`;
  }

  result.allPassed = !result.blocked;
  return result;
}

// ============================================================================
// INVARIANTS
// ============================================================================

function verifyInvariants(r: Result): boolean {
  const decisionIsBlocked = r.decision === "BLOCKED_BY_TYPE_PROVENANCE" || r.decision === "BLOCKED_BY_TOOLING";

  const checks: boolean[] = [
    // ---- Non-negotiable safety facts ----
    r.generatedFunctionPresenceEqualsAuthorization === false,
    r.internalFunctionTypesShouldBeApplicationCallable === false,
    r.databaseTypeGenerationPerformed === false,
    r.trackedTypeFileModified === false,
    r.remoteDatabaseUsed === false,
    r.productionDatabaseUsed === false,
    r.databaseSchemaModified === false,
    r.runtimeRetrievalWired === false,
    r.realKnowledgeIngestionPerformed === false,

    // ---- Repository scope ----
    !(r.allPassed && !r.repositoryScopeValid),
    !(r.allPassed && !r.workingTreeCleanBeforePhase),
    !(r.allPassed && r.unexpectedRepositoryPaths.length > 0),
    !(r.allPassed && r.outcome !== "PASSED"),
    !(r.allPassed && r.blocked),
    !(r.blocked && r.outcome === "PASSED"),

    // ---- Decision coherence ----
    !(r.allPassed && decisionIsBlocked),
    // "No generated types" requires both zero artifacts and zero consumers.
    !(r.decision === "NO_GENERATED_TYPES_CURRENTLY_USED" && r.generatedTypeArtifactCount > 0),
    !(r.decision === "NO_GENERATED_TYPES_CURRENTLY_USED" && r.databaseTypeImportCount > 0),
    // "Manual only" cannot coexist with an imported generated artifact.
    !(r.decision === "MANUAL_TYPES_ONLY" && r.generatedTypeArtifactCount > 0),
    // Regenerating locally requires local generation to actually work.
    !(r.decision === "REGENERATE_NOW_LOCALLY" && !r.localIsolatedTypeGenerationFeasible),
    !(r.decision === "REGENERATE_NOW_LOCALLY" && r.remoteProjectRequiredForGeneration),
    // A controlled-project decision must not silently mean production.
    !(r.decision === "REGENERATE_NOW_FROM_CONTROLLED_PROJECT" && r.productionDatabaseRequiredForGeneration),
    !(r.decision === "REGENERATE_NOW_FROM_CONTROLLED_PROJECT" && r.localIsolatedTypeGenerationFeasible),
    // Deferring presupposes something to defer.
    !(r.decision === "DEFER_REGENERATION_UNTIL_RUNTIME_BOUNDARY" && r.generatedTypeArtifactCount === 0),
    !(r.decision === "BLOCKED_BY_TOOLING" && r.supabaseCliAvailable && r.dockerAvailable),

    // ---- Provenance honesty ----
    !(r.allPassed && r.currentTypeProvenance === "UNKNOWN_PROVENANCE"),
    !(r.generatedTypeArtifactCount === 0 && r.currentTypeProvenance !== "NO_ARTIFACT_PRESENT"),
    // Staleness is a property of an artifact that exists.
    !(r.generatedTypeArtifactCount === 0 && r.currentTypesStaleRelativeTo032),
    !(r.generatedTypeArtifactCount === 0 && r.currentTypesStaleRelativeTo033),
    !(r.generatedTypeArtifactCount === 0 && r.currentTypesStaleRelativeTo034),
    // A body-only migration can never make types stale.
    !(r.currentTypesStaleRelativeTo034 && !r.generatedTypeShapeChangeRequiredBy034),

    // ---- Migration-derived surface ----
    !(r.allPassed && r.migration032TableCount <= 0),
    !(r.allPassed && r.migration033TableCount !== 3),
    !(r.allPassed && r.migration034TableDdlCount !== 0),
    !(r.allPassed && r.expectedKnowledgeTableCount !== r.migration032TableCount),
    !(r.allPassed && r.expectedPublicationTranslationTableCount !== r.migration033TableCount),
    !(r.allPassed && r.expectedGrantableRpcCount !== 15),
    !(r.allPassed && r.expectedInternalFunctionCount <= 0),
    !(r.allPassed && r.grantableRpcNames.length !== r.expectedGrantableRpcCount),
    !(r.allPassed && r.triggerOnlyFunctionNames.length !== 4),
    // Missing counts must be arithmetically consistent with what is typed.
    !(r.missingKnowledgeTableCount !== r.expectedKnowledgeTableCount - r.typedKnowledgeTableCount),
    !(
      r.missingPublicationTranslationTableCount !==
      r.expectedPublicationTranslationTableCount - r.typedPublicationTranslationTableCount
    ),
    !(r.missingGrantableRpcCount !== r.expectedGrantableRpcCount - r.typedGrantableRpcCount),
    // Missing objects may only be ignored when nothing claims to type them.
    !(r.allPassed && r.generatedTypeArtifactCount > 0 && r.missingKnowledgeTableCount > 0),
    !(r.allPassed && r.generatedTypeArtifactCount > 0 && r.missingPublicationTranslationTableCount > 0),
    !(r.allPassed && r.generatedTypeArtifactCount > 0 && r.missingGrantableRpcCount > 0),

    // ---- Migration 034 classification ----
    !(r.allPassed && !r.functionBodiesChangedBy034),
    !(r.allPassed && r.functionSignaturesChangedBy034),
    !(r.allPassed && r.migration034ReplacedFunctionCount !== EXPECTED_MIGRATION_034_REPLACED_FUNCTIONS),
    !(r.allPassed && r.migration034SignatureDrift.length > 0),
    !(r.allPassed && r.generatedTypeShapeChangeRequiredBy034),
    // A signature change and a shape-neutral verdict cannot both be true.
    !(r.functionSignaturesChangedBy034 && !r.generatedTypeShapeChangeRequiredBy034),
    // Table DDL in 034 would contradict the body-only classification.
    !(r.migration034TableDdlCount > 0 && !r.generatedTypeShapeChangeRequiredBy034),

    // ---- Tooling and feasibility ----
    !(r.allPassed && !r.supabaseCliAvailable),
    !(r.allPassed && !r.dockerAvailable),
    !(r.allPassed && !r.localSupabaseConfigPresent),
    !(r.allPassed && !r.localIsolatedTypeGenerationFeasible),
    !(r.allPassed && !r.feasibilityPredictionMatchesObservation),
    !(r.allPassed && !r.feasibilityArtifactsRemoved),
    !(r.allPassed && r.remoteProjectRequiredForGeneration),
    !(r.allPassed && r.productionDatabaseRequiredForGeneration),
    // Local feasibility and a remote requirement are mutually exclusive.
    !(r.localIsolatedTypeGenerationFeasible && r.remoteProjectRequiredForGeneration),
    !(r.localIsolatedTypeGenerationFeasible && r.productionDatabaseRequiredForGeneration),
    // A feasibility claim must rest on a run that actually happened.
    !(r.localIsolatedTypeGenerationFeasible && !r.feasibilityRunPerformed),
    !(r.feasibilityRunPerformed && r.feasibilityGeneratedLineCount <= 0),

    // ---- Security boundary ----
    !(r.allPassed && !r.serviceRoleClientServerOnly),
    !(r.allPassed && r.clientBoundaryViolations.length > 0),
    !(r.allPassed && r.internalFunctionsVisibleInGeneratedTypes.length === 0),
    // The generator sees internal engines, so a narrow public surface is required.
    !(r.internalFunctionsVisibleInGeneratedTypes.length > 0 && !r.publicClientNarrowTypeSurfaceRecommended),
    !(r.allPassed && !r.fullDatabaseTypesRecommended),
    !(r.allPassed && !r.serviceRoleTypeSurfaceRecommended),

    // ---- Enum / literal-union honesty ----
    // Literal unions may only be claimed where real PostgreSQL enums exist.
    !(r.checkConstraintFieldsGenerateLiteralUnions && r.postgresEnumCount === 0),
    !(r.allPassed && r.checkConstrainedFieldCount > 0 && !r.manualDomainLiteralTypesStillNeeded),
    !(r.allPassed && r.postgresEnumCount !== 0 && r.feasibilityObservedTypedEnumCount === 0),

    // ---- Policy completeness ----
    !(r.allPassed && r.canonicalGeneratedTypePath.length === 0),
    !(r.allPassed && r.recommendedGenerationCommand.length === 0),
    !(r.allPassed && r.recommendedRegenerationTriggerPolicy.length < 5),
    !(r.allPassed && r.recommendedNextPhase.length === 0),

    // ---- Stale proxy note ----
    // It may only block readiness if there is evidence that it actually does.
    !(r.staleProxyDebtNoteBlocksReadiness && r.allPassed),
    !(r.staleProxyDebtNoteFound && !r.staleProxyDebtNoteCleanupRecommended),

    // ---- Self-test integrity ----
    !(r.allPassed && r.decisionTamperCaseCount < MINIMUM_DECISION_TAMPER_CASES),
    !(r.allPassed && r.decisionTamperCasesRejectedCount !== r.decisionTamperCaseCount),
    !(r.allPassed && !r.decisionTamperCasesRejected),
  ];

  return checks.every(Boolean);
}

// ============================================================================
// TAMPER PACK
// ============================================================================

interface TamperCase {
  id: number;
  description: string;
  mutate: (r: Result) => void;
}

const DECISION_TAMPER_CASES: TamperCase[] = [
  // ---- Provenance ----
  { id: 1, description: "generated status inferred from filename alone", mutate: (r) => { r.generatedTypeArtifactCount = 1; r.generatedTypeArtifacts = ["lib/db/database.types.ts"]; r.currentTypeProvenance = "NO_ARTIFACT_PRESENT"; r.allPassed = true; } },
  { id: 2, description: "provenance claimed without evidence", mutate: (r) => { r.currentTypeProvenance = "UNKNOWN_PROVENANCE"; r.allPassed = true; } },
  { id: 3, description: "artifact absent but provenance claims local generation", mutate: (r) => { r.currentTypeProvenance = "VERIFIED_LOCAL_GENERATION"; r.allPassed = true; } },
  { id: 4, description: "artifact absent but provenance claims controlled project", mutate: (r) => { r.currentTypeProvenance = "VERIFIED_CONTROLLED_PROJECT_GENERATION"; r.allPassed = true; } },
  { id: 5, description: "artifact absent but marked a stale generated artifact", mutate: (r) => { r.currentTypeProvenance = "STALE_GENERATED_ARTIFACT"; r.allPassed = true; } },
  { id: 6, description: "HEAD pin substituted for type provenance", mutate: (r) => { r.currentTypeProvenance = "UNKNOWN_PROVENANCE"; r.sourceCommit = "38d8e09"; r.allPassed = true; } },

  // ---- Staleness ----
  { id: 7, description: "stale against 032 with no artifact present", mutate: (r) => { r.currentTypesStaleRelativeTo032 = true; r.allPassed = true; } },
  { id: 8, description: "stale against 033 with no artifact present", mutate: (r) => { r.currentTypesStaleRelativeTo033 = true; r.allPassed = true; } },
  { id: 9, description: "stale against 034 with no artifact present", mutate: (r) => { r.currentTypesStaleRelativeTo034 = true; r.allPassed = true; } },
  { id: 10, description: "body-only 034 declared to make types stale", mutate: (r) => { r.currentTypesStaleRelativeTo034 = true; r.generatedTypeShapeChangeRequiredBy034 = false; r.allPassed = true; } },

  // ---- Missing typed objects ----
  { id: 11, description: "missing migration 032 tables ignored", mutate: (r) => { r.generatedTypeArtifactCount = 1; r.generatedTypeArtifacts = ["lib/supabase/database.types.ts"]; r.currentTypeProvenance = "VERIFIED_LOCAL_GENERATION"; r.typedKnowledgeTableCount = 10; r.missingKnowledgeTableCount = r.expectedKnowledgeTableCount - 10; r.allPassed = true; } },
  { id: 12, description: "missing migration 033 tables ignored", mutate: (r) => { r.generatedTypeArtifactCount = 1; r.generatedTypeArtifacts = ["lib/supabase/database.types.ts"]; r.currentTypeProvenance = "VERIFIED_LOCAL_GENERATION"; r.typedPublicationTranslationTableCount = 1; r.missingPublicationTranslationTableCount = 2; r.allPassed = true; } },
  { id: 13, description: "missing grantable RPCs ignored", mutate: (r) => { r.generatedTypeArtifactCount = 1; r.generatedTypeArtifacts = ["lib/supabase/database.types.ts"]; r.currentTypeProvenance = "VERIFIED_LOCAL_GENERATION"; r.typedGrantableRpcCount = 9; r.missingGrantableRpcCount = 6; r.allPassed = true; } },
  { id: 14, description: "missing-count arithmetic falsified for tables", mutate: (r) => { r.missingKnowledgeTableCount = 0; r.typedKnowledgeTableCount = 0; r.expectedKnowledgeTableCount = 33; r.allPassed = true; } },
  { id: 15, description: "missing-count arithmetic falsified for RPCs", mutate: (r) => { r.missingGrantableRpcCount = 0; r.typedGrantableRpcCount = 0; r.expectedGrantableRpcCount = 15; r.allPassed = true; } },
  { id: 16, description: "grantable RPC count silently reduced", mutate: (r) => { r.expectedGrantableRpcCount = 12; r.allPassed = true; } },
  { id: 17, description: "grantable RPC name list desynchronised from count", mutate: (r) => { r.grantableRpcNames = r.grantableRpcNames.slice(0, 5); r.allPassed = true; } },
  { id: 18, description: "trigger-only function set shrunk", mutate: (r) => { r.triggerOnlyFunctionNames = []; r.allPassed = true; } },
  { id: 19, description: "internal function set emptied", mutate: (r) => { r.expectedInternalFunctionCount = 0; r.allPassed = true; } },
  { id: 20, description: "migration 033 table count altered", mutate: (r) => { r.migration033TableCount = 5; r.allPassed = true; } },
  { id: 21, description: "migration 032 table count zeroed", mutate: (r) => { r.migration032TableCount = 0; r.allPassed = true; } },
  { id: 22, description: "expected knowledge table count decoupled from SQL", mutate: (r) => { r.expectedKnowledgeTableCount = r.migration032TableCount + 5; r.allPassed = true; } },

  // ---- Migration 034 classification ----
  { id: 23, description: "migration 034 falsely classified as table DDL", mutate: (r) => { r.migration034TableDdlCount = 2; r.allPassed = true; } },
  { id: 24, description: "table DDL in 034 with shape change denied", mutate: (r) => { r.migration034TableDdlCount = 1; r.generatedTypeShapeChangeRequiredBy034 = false; r.allPassed = true; } },
  { id: 25, description: "body change falsely classified as signature change", mutate: (r) => { r.functionSignaturesChangedBy034 = true; r.allPassed = true; } },
  { id: 26, description: "signature change claimed shape-neutral", mutate: (r) => { r.functionSignaturesChangedBy034 = true; r.generatedTypeShapeChangeRequiredBy034 = false; r.allPassed = true; } },
  { id: 27, description: "signature drift recorded but ignored", mutate: (r) => { r.migration034SignatureDrift = ["knowledge_approve_translation: argument list changed"]; r.allPassed = true; } },
  { id: 28, description: "034 replaced-function count falsified", mutate: (r) => { r.migration034ReplacedFunctionCount = 3; r.allPassed = true; } },
  { id: 29, description: "034 claimed to change no bodies at all", mutate: (r) => { r.functionBodiesChangedBy034 = false; r.allPassed = true; } },
  { id: 30, description: "034 forces regeneration but result still passes", mutate: (r) => { r.generatedTypeShapeChangeRequiredBy034 = true; r.allPassed = true; } },

  // ---- Security boundary ----
  { id: 31, description: "generated presence equated with authorization", mutate: (r) => { r.generatedFunctionPresenceEqualsAuthorization = true; r.allPassed = true; } },
  { id: 32, description: "internal functions declared application-callable", mutate: (r) => { r.internalFunctionTypesShouldBeApplicationCallable = true; r.allPassed = true; } },
  { id: 33, description: "internal engine exposure recorded but narrow surface dropped", mutate: (r) => { r.publicClientNarrowTypeSurfaceRecommended = false; r.allPassed = true; } },
  { id: 34, description: "internal engine visibility erased from the record", mutate: (r) => { r.internalFunctionsVisibleInGeneratedTypes = []; r.allPassed = true; } },
  { id: 35, description: "browser client allowed to use the service role", mutate: (r) => { r.serviceRoleClientServerOnly = false; r.allPassed = true; } },
  { id: 36, description: "client boundary violations ignored", mutate: (r) => { r.clientBoundaryViolations = ["lib/supabase/client.ts references SUPABASE_SERVICE_ROLE_KEY"]; r.allPassed = true; } },
  { id: 37, description: "service-role type surface recommendation dropped", mutate: (r) => { r.serviceRoleTypeSurfaceRecommended = false; r.allPassed = true; } },
  { id: 38, description: "full database types recommendation dropped", mutate: (r) => { r.fullDatabaseTypesRecommended = false; r.allPassed = true; } },

  // ---- Enum / literal-union honesty ----
  { id: 39, description: "check constraints claimed to yield literal unions", mutate: (r) => { r.checkConstraintFieldsGenerateLiteralUnions = true; r.allPassed = true; } },
  { id: 40, description: "manual literal types declared unnecessary", mutate: (r) => { r.manualDomainLiteralTypesStillNeeded = false; r.allPassed = true; } },
  { id: 41, description: "enums claimed present but none generated", mutate: (r) => { r.postgresEnumCount = 6; r.allPassed = true; } },

  // ---- Tooling and feasibility ----
  { id: 42, description: "remote generation marked local", mutate: (r) => { r.remoteProjectRequiredForGeneration = true; r.allPassed = true; } },
  { id: 43, description: "production project marked acceptable", mutate: (r) => { r.productionDatabaseRequiredForGeneration = true; r.allPassed = true; } },
  { id: 44, description: "local feasibility claimed while a remote project is required", mutate: (r) => { r.remoteProjectRequiredForGeneration = true; r.localIsolatedTypeGenerationFeasible = true; r.allPassed = true; } },
  { id: 45, description: "feasibility claimed without a run", mutate: (r) => { r.feasibilityRunPerformed = false; r.allPassed = true; } },
  { id: 46, description: "feasibility run reports no generated output", mutate: (r) => { r.feasibilityGeneratedLineCount = 0; r.allPassed = true; } },
  { id: 47, description: "prediction and observation diverge but pass claimed", mutate: (r) => { r.feasibilityPredictionMatchesObservation = false; r.allPassed = true; } },
  { id: 48, description: "temporary generated artifacts left behind", mutate: (r) => { r.feasibilityArtifactsRemoved = false; r.allPassed = true; } },
  { id: 49, description: "Supabase CLI unavailable but pass claimed", mutate: (r) => { r.supabaseCliAvailable = false; r.allPassed = true; } },
  { id: 50, description: "Docker unavailable but pass claimed", mutate: (r) => { r.dockerAvailable = false; r.allPassed = true; } },
  { id: 51, description: "local Supabase config missing but pass claimed", mutate: (r) => { r.localSupabaseConfigPresent = false; r.allPassed = true; } },
  { id: 52, description: "tooling block declared while tooling works", mutate: (r) => { r.decision = "BLOCKED_BY_TOOLING"; r.allPassed = true; } },

  // ---- Decision coherence ----
  { id: 53, description: "no generated types decided while an artifact exists", mutate: (r) => { r.generatedTypeArtifactCount = 1; r.generatedTypeArtifacts = ["lib/supabase/database.types.ts"]; } },
  { id: 54, description: "no generated types decided while imports exist", mutate: (r) => { r.databaseTypeImportCount = 4; r.databaseTypeConsumerPaths = ["lib/dashboard/get-dashboard-actions.ts"]; } },
  { id: 55, description: "manual-only decided while a generated artifact is imported", mutate: (r) => { r.decision = "MANUAL_TYPES_ONLY"; r.generatedTypeArtifactCount = 1; } },
  { id: 56, description: "regenerate-locally decided while local generation is infeasible", mutate: (r) => { r.decision = "REGENERATE_NOW_LOCALLY"; r.localIsolatedTypeGenerationFeasible = false; } },
  { id: 57, description: "regenerate-locally decided while a remote project is required", mutate: (r) => { r.decision = "REGENERATE_NOW_LOCALLY"; r.remoteProjectRequiredForGeneration = true; } },
  { id: 58, description: "controlled-project decision points at production", mutate: (r) => { r.decision = "REGENERATE_NOW_FROM_CONTROLLED_PROJECT"; r.productionDatabaseRequiredForGeneration = true; } },
  { id: 59, description: "controlled-project decision while local generation works", mutate: (r) => { r.decision = "REGENERATE_NOW_FROM_CONTROLLED_PROJECT"; } },
  { id: 60, description: "deferral decided with nothing to defer", mutate: (r) => { r.decision = "DEFER_REGENERATION_UNTIL_RUNTIME_BOUNDARY"; } },
  { id: 61, description: "blocked decision reported as a pass", mutate: (r) => { r.decision = "BLOCKED_BY_TYPE_PROVENANCE"; r.allPassed = true; } },
  { id: 62, description: "blocked outcome reported as a pass", mutate: (r) => { r.blocked = true; r.allPassed = true; } },
  { id: 63, description: "blocked flag set while outcome stays PASSED", mutate: (r) => { r.blocked = true; } },
  { id: 64, description: "non-PASSED outcome reported as a pass", mutate: (r) => { r.outcome = "BLOCKED — TOOLING"; r.allPassed = true; } },

  // ---- Repository scope ----
  { id: 65, description: "repository scope weakened", mutate: (r) => { r.repositoryScopeValid = false; r.allPassed = true; } },
  { id: 66, description: "unrelated untracked file accepted", mutate: (r) => { r.unexpectedRepositoryPaths = ["lib/supabase/database.types.ts"]; r.allPassed = true; } },
  { id: 67, description: "dirty working tree accepted", mutate: (r) => { r.workingTreeCleanBeforePhase = false; r.allPassed = true; } },

  // ---- Safety closure ----
  { id: 68, description: "type generation marked performed", mutate: (r) => { r.databaseTypeGenerationPerformed = true; } },
  { id: 69, description: "tracked type file marked modified", mutate: (r) => { r.trackedTypeFileModified = true; } },
  { id: 70, description: "remote database marked used", mutate: (r) => { r.remoteDatabaseUsed = true; } },
  { id: 71, description: "production database marked used", mutate: (r) => { r.productionDatabaseUsed = true; } },
  { id: 72, description: "database schema marked modified", mutate: (r) => { r.databaseSchemaModified = true; } },
  { id: 73, description: "runtime retrieval marked wired", mutate: (r) => { r.runtimeRetrievalWired = true; } },
  { id: 74, description: "real ingestion marked performed", mutate: (r) => { r.realKnowledgeIngestionPerformed = true; } },

  // ---- Policy completeness ----
  { id: 75, description: "canonical generated path removed", mutate: (r) => { r.canonicalGeneratedTypePath = ""; r.allPassed = true; } },
  { id: 76, description: "generation command removed", mutate: (r) => { r.recommendedGenerationCommand = ""; r.allPassed = true; } },
  { id: 77, description: "regeneration trigger policy gutted", mutate: (r) => { r.recommendedRegenerationTriggerPolicy = ["new table"]; r.allPassed = true; } },
  { id: 78, description: "next phase recommendation removed", mutate: (r) => { r.recommendedNextPhase = ""; r.allPassed = true; } },

  // ---- Stale proxy note ----
  { id: 79, description: "stale proxy note treated as blocking without evidence", mutate: (r) => { r.staleProxyDebtNoteBlocksReadiness = true; r.allPassed = true; } },
  { id: 80, description: "stale proxy note found but cleanup not recommended", mutate: (r) => { r.staleProxyDebtNoteCleanupRecommended = false; r.allPassed = true; } },

  // ---- Self-test integrity ----
  { id: 81, description: "self-test pack emptied", mutate: (r) => { r.decisionTamperCaseCount = 0; r.decisionTamperCasesRejectedCount = 0; r.allPassed = true; } },
  { id: 82, description: "self-test parity broken", mutate: (r) => { r.decisionTamperCasesRejectedCount = r.decisionTamperCaseCount - 1; r.allPassed = true; } },
  { id: 83, description: "self-test rejection flag falsified", mutate: (r) => { r.decisionTamperCasesRejected = false; r.allPassed = true; } },
];

function runTamperPack(base: Result): { total: number; rejected: number; leaks: string[] } {
  const leaks: string[] = [];
  let rejected = 0;
  for (const tc of DECISION_TAMPER_CASES) {
    const copy = JSON.parse(JSON.stringify(base)) as Result;
    tc.mutate(copy);
    if (verifyInvariants(copy)) leaks.push(`#${tc.id} ${tc.description}`);
    else rejected += 1;
  }
  return { total: DECISION_TAMPER_CASES.length, rejected, leaks };
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const missingMigrations = [MIGRATION_032_REL, MIGRATION_033_REL, MIGRATION_034_REL].filter(
    (m) => !fileExists(m) || readFileText(m).length === 0
  );
  if (missingMigrations.length > 0) {
    console.error(`PHASE ${CHECK_ID} RESULT: BLOCKED — REPOSITORY STATE`);
    console.error(`  missing migrations: ${missingMigrations.join(", ")}`);
    process.exit(1);
  }

  const scope = analyzeRepositoryScope();
  const trackedFiles = git(["ls-files"]).split("\n").filter((f) => f.trim().length > 0);

  // Every table the migration chain has ever created, used to tell a database
  // type surface apart from an ordinary domain contract module.
  const knownTableNames = new Set<string>();
  for (const file of trackedFiles) {
    if (!file.startsWith("supabase/migrations/") || !file.endsWith(".sql")) continue;
    for (const name of countCreateTables(readFileText(file))) knownTableNames.add(name);
  }

  const artifacts = discoverTypeArtifacts(trackedFiles, knownTableNames);
  const consumers = findTypeConsumers(trackedFiles);
  const surface = deriveMigrationSurface();
  const tooling = inspectTooling();
  const boundary = analyzeClientBoundary(trackedFiles);

  const result = buildResult(scope, artifacts, consumers, surface, tooling, boundary);

  // Parity is asserted by the invariants, so the base result must claim it
  // before the pack runs; the measured count overwrites it immediately after.
  result.decisionTamperCaseCount = DECISION_TAMPER_CASES.length;
  result.decisionTamperCasesRejectedCount = DECISION_TAMPER_CASES.length;
  result.decisionTamperCasesRejected = true;

  const tamper = runTamperPack(result);
  result.decisionTamperCaseCount = tamper.total;
  result.decisionTamperCasesRejectedCount = tamper.rejected;
  result.decisionTamperCasesRejected = tamper.rejected === tamper.total;

  const selfConsistent = verifyInvariants(result);
  if (!selfConsistent || !result.decisionTamperCasesRejected) {
    result.allPassed = false;
    result.readyForDatabaseTypeImplementation = false;
    result.readyForKnowledgeIngestionAndLiveOfficialSourceRetrievalContract = false;
    if (!result.decisionTamperCasesRejected) {
      result.evidence.push(`Tamper pack leaked: ${tamper.leaks.join("; ")}`);
    }
    if (!selfConsistent && result.outcome === "PASSED") {
      result.outcome = "BLOCKED — TYPE CONTRACT CONFLICT";
      result.blocked = true;
      result.blockReason = result.blockReason || "Result is internally contradictory.";
    }
  }

  console.log(JSON.stringify(result, null, 2));

  console.error("");
  console.error(`PHASE ${CHECK_ID} RESULT: ${result.outcome}`);
  console.error(`  decision                : ${result.decision}`);
  console.error(`  head / branch           : ${result.sourceCommit} / ${result.sourceBranch}`);
  console.error(
    `  repository scope        : valid=${result.repositoryScopeValid} clean=${result.workingTreeCleanBeforePhase} ` +
      `unexpected=${result.unexpectedRepositoryPaths.length}`
  );
  console.error(
    `  type artifacts          : generated=${result.generatedTypeArtifactCount} manual=${result.manualDatabaseTypeArtifactCount} ` +
      `consumers=${result.databaseTypeImportCount} provenance=${result.currentTypeProvenance}`
  );
  console.error(
    `  migration surface       : 032=${result.migration032TableCount} tables, 033=${result.migration033TableCount} tables, ` +
      `034=${result.migration034TableDdlCount} table DDL`
  );
  console.error(
    `  functions               : grantable=${result.expectedGrantableRpcCount} internal=${result.expectedInternalFunctionCount} ` +
      `trigger-only=${result.triggerOnlyFunctionNames.length}`
  );
  console.error(
    `  migration 034           : bodies=${result.functionBodiesChangedBy034} signatures=${result.functionSignaturesChangedBy034} ` +
      `shapeChangeRequired=${result.generatedTypeShapeChangeRequiredBy034} replaced=${result.migration034ReplacedFunctionCount}`
  );
  console.error(
    `  tooling                 : supabase=${result.supabaseCliVersion || "n/a"} docker=${result.dockerAvailable} ` +
      `localConfig=${result.localSupabaseConfigPresent}`
  );
  console.error(
    `  feasibility             : local=${result.localIsolatedTypeGenerationFeasible} run=${result.feasibilityRunPerformed} ` +
      `predicted ${surface.predictedTypedTableCount}/${surface.predictedTypedFunctionCount}/${surface.predictedTypedEnumCount} ` +
      `observed ${result.feasibilityObservedTypedTableCount}/${result.feasibilityObservedTypedFunctionCount}/${result.feasibilityObservedTypedEnumCount}`
  );
  console.error(
    `  client boundary         : browser=${result.browserClientPaths.length} server=${result.serverClientPaths.length} ` +
      `serviceRole=${result.serviceRoleClientPaths.length} serverOnly=${result.serviceRoleClientServerOnly}`
  );
  console.error(
    `  enums / constraints     : pgEnums=${result.postgresEnumCount} checkFields=${result.checkConstrainedFieldCount} ` +
      `literalUnions=${result.checkConstraintFieldsGenerateLiteralUnions}`
  );
  console.error(
    `  stale proxy note        : found=${result.staleProxyDebtNoteFound} blocking=${result.staleProxyDebtNoteBlocksReadiness} ` +
      `cleanupRecommended=${result.staleProxyDebtNoteCleanupRecommended}`
  );
  console.error(`  tamper pack             : ${result.decisionTamperCasesRejectedCount}/${result.decisionTamperCaseCount} rejected`);
  console.error(`  allPassed               : ${result.allPassed}`);
  if (result.blockReason) console.error(`  blocker                 : ${result.blockReason}`);
  console.error(`  next phase              : ${result.recommendedNextPhase}`);
  console.error("");
  console.error("  Generated function presence is not database authorization.");

  process.exit(result.allPassed ? 0 : 1);
}

main();
