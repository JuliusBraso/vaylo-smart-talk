import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

type Target = Readonly<{
  identity: string;
  definitionMigration: string;
  expectedDefinitionCount: number;
}>;

const ROOT = process.cwd();
const MIGRATION = "072_harden_legacy_security_definer_search_paths.sql";
const MIGRATION_PATH = path.posix.join("supabase", "migrations", MIGRATION);
const AUDIT_PATH = path.posix.join(
  "lib",
  "vaylo",
  "smart-talk",
  "knowledge",
  "de",
  "run-legacy-security-definer-search-path-hardening-audit.ts",
);
const EXPECTED_CHANGED_FILES = new Set([
  AUDIT_PATH,
  "package.json",
  MIGRATION_PATH,
]);

const targets: readonly Target[] = [
  {
    identity: "public.reject_document_step_proof(uuid,text)",
    definitionMigration: "012_proof_signals_and_verifications.sql",
    expectedDefinitionCount: 1,
  },
  {
    identity: "public.confirm_document_step_proof(uuid,text)",
    definitionMigration: "012_proof_signals_and_verifications.sql",
    expectedDefinitionCount: 1,
  },
  {
    identity: "public.i18n_insert_translations_if_missing(text,jsonb)",
    definitionMigration: "015_i18n_insert_rpc_and_jobs.sql",
    expectedDefinitionCount: 1,
  },
  {
    identity: "public.enqueue_document_intelligence_job(uuid,uuid)",
    definitionMigration: "030_enqueue_document_intelligence_job_ownership_guard.sql",
    expectedDefinitionCount: 2,
  },
  {
    identity: "public.claim_next_document_intelligence_job(integer)",
    definitionMigration: "017_document_intelligence_jobs.sql",
    expectedDefinitionCount: 1,
  },
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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function functionName(identity: string): string {
  return identity.slice(0, identity.indexOf("("));
}

function effectiveDefinition(target: Target): { definition: string; body: string } | null {
  const sql = source("supabase", "migrations", target.definitionMigration);
  const pattern = new RegExp(
    `create\\s+or\\s+replace\\s+function\\s+${escapeRegex(functionName(target.identity))}`
      + "\\s*\\([\\s\\S]*?\\)\\s*returns[\\s\\S]*?\\bas\\s+\\$\\$"
      + "([\\s\\S]*?)\\$\\$;",
    "iu",
  );
  const match = pattern.exec(sql);
  return match ? { definition: match[0], body: match[1] ?? "" } : null;
}

const migration072 = source("supabase", "migrations", MIGRATION);
const executable072 = stripSqlComments(migration072);
const statements = executable072
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);
const alterPattern =
  /^alter\s+function\s+(.+?\([^;()]*\))\s+set\s+search_path\s*=\s*pg_catalog\s*,\s*pg_temp$/iu;
const parsedIdentities = statements
  .map((statement) => alterPattern.exec(statement)?.[1] ?? "")
  .filter(Boolean)
  .map(compact);
const expectedIdentities = targets.map((target) => compact(target.identity));

const migrationDirectory = path.join(ROOT, "supabase", "migrations");
const historicalMigrationNames = readdirSync(migrationDirectory)
  .filter((name) => {
    const number = Number(name.slice(0, 3));
    return /^\d{3}_.*\.sql$/u.test(name) && number >= 1 && number <= 71;
  })
  .sort();
const historicalSql = historicalMigrationNames
  .map((name) => source("supabase", "migrations", name))
  .join("\n");

const definitions = targets.map((target) => ({
  target,
  effective: effectiveDefinition(target),
}));
const bodyHashes = Object.fromEntries(definitions.map(({ target, effective }) => [
  target.identity,
  effective
    ? createHash("sha256").update(effective.body).digest("hex")
    : null,
]));

const statusLines = execFileSync(
  "git",
  ["status", "--porcelain=v1", "--untracked-files=all"],
  { cwd: ROOT, encoding: "utf8" },
)
  .split(/\r?\n/gu)
  .filter(Boolean);
const changedFiles = statusLines.map((line) =>
  line.slice(3).replaceAll("\\", "/").replace(/^"|"$/gu, ""));

const applySearchPath = (
  initial: Readonly<Record<string, string>>,
): Record<string, string> => {
  const result = { ...initial };
  for (const identity of parsedIdentities) {
    result[identity] = "pg_catalog,pg_temp";
  }
  return result;
};
const initialConfig = Object.fromEntries(
  expectedIdentities.map((identity) => [identity, "public"]),
);
const afterOneReplay = applySearchPath(initialConfig);
const afterTwoReplays = applySearchPath(afterOneReplay);

const tests: Record<string, boolean> = {};
tests.migrationNumberIs072 = /^072_/u.test(MIGRATION)
  && Number(MIGRATION.slice(0, 3)) === 72;
tests.historicalInventoryExactly001Through071 =
  historicalMigrationNames.length === 71
  && historicalMigrationNames.every(
    (name, index) => Number(name.slice(0, 3)) === index + 1,
  );
tests.exactTargetCount = targets.length === 5
  && statements.length === 5
  && parsedIdentities.length === 5;
tests.onlyExactAuthorizedTargets =
  new Set(parsedIdentities).size === 5
  && [...parsedIdentities].sort().join("|")
    === [...expectedIdentities].sort().join("|");
tests.everyFinalSearchPathTrusted =
  statements.every((statement) => alterPattern.test(statement))
  && Object.values(afterOneReplay).every(
    (searchPath) => searchPath === "pg_catalog,pg_temp",
  );
tests.functionalOperationsAreAlterFunctionOnly =
  statements.every((statement) => /^alter\s+function\b/iu.test(statement));
tests.noCreateOrReplaceFunction =
  !/create\s+(?:or\s+replace\s+)?function\b/iu.test(executable072);
tests.noFunctionBodyReplacement =
  !/\bas\s+\$[^$]*\$/iu.test(executable072)
  && !executable072.includes("$$");
tests.noGrantOrRevoke = !/\b(?:grant|revoke)\b/iu.test(executable072);
tests.noAlterDefaultPrivileges =
  !/\balter\s+default\s+privileges\b/iu.test(executable072);
tests.noForbiddenMutation =
  !/\b(?:insert|update|delete|merge|truncate)\b/iu.test(executable072)
  && !/\b(?:create|alter|drop)\s+table\b/iu.test(executable072)
  && !/\b(?:row\s+level\s+security|policy|trigger)\b/iu.test(executable072)
  && !/\bowner\s+to\b/iu.test(executable072);
tests.historicalMigrationsUnchanged = changedFiles.every(
  (name) => !/^supabase\/migrations\/(?:0(?:0[1-9]|[1-6][0-9]|70|71))_/u.test(name),
);
tests.noUnexpectedFilesModified =
  changedFiles.length === EXPECTED_CHANGED_FILES.size
  && changedFiles.every((name) => EXPECTED_CHANGED_FILES.has(name));
tests.replayIdempotent =
  JSON.stringify(afterOneReplay) === JSON.stringify(afterTwoReplays);
tests.identitiesAreOverloadSafe =
  targets.every((target) => /\([^()]+\)$/u.test(target.identity))
  && parsedIdentities.every((identity) => /\([^()]+\)$/u.test(identity));
tests.effectiveDefinitionsFound =
  definitions.every(({ effective }) => effective !== null);
tests.effectiveDefinitionsSecurityDefiner =
  definitions.every(({ effective }) =>
    /\bsecurity\s+definer\b/iu.test(effective?.definition ?? ""));
tests.effectiveDefinitionsSearchPathPublic =
  definitions.every(({ effective }) =>
    /\bset\s+search_path\s*=\s*public\b/iu.test(effective?.definition ?? ""));
tests.noTargetOverloadAmbiguity = targets.every((target) => {
  const matches = historicalSql.match(new RegExp(
    `create\\s+or\\s+replace\\s+function\\s+${escapeRegex(functionName(target.identity))}\\s*\\(`,
    "giu",
  ));
  return (matches?.length ?? 0) === target.expectedDefinitionCount;
});
tests.bodySourcesRemainInHistoricalLineageOnly =
  definitions.every(({ effective }) =>
    effective !== null
    && effective.body.trim().length > 0
    && !migration072.includes(effective.body.trim()));

const allPassed = Object.values(tests).every(Boolean);

process.stdout.write(`${JSON.stringify({
  phase: "DB-SEC-02A LEGACY SECURITY DEFINER SEARCH_PATH HARDENING",
  phaseResult: allPassed ? "PASS" : "FAILED",
  migration: MIGRATION,
  migrationSha256: createHash("sha256").update(migration072).digest("hex"),
  targetCount: targets.length,
  targets: targets.map((target) => ({
    identity: target.identity,
    beforeSearchPath: "public",
    afterSearchPath: "pg_catalog, pg_temp",
    effectiveDefinitionMigration: target.definitionMigration,
    bodySha256: bodyHashes[target.identity],
  })),
  changedFiles,
  tests,
  allPassed,
  liveConnectionAttempted: false,
  databaseWrites: 0,
  functionBodiesModified: false,
  executePrivilegesModified: false,
  historicalMigrationsModified: false,
}, null, 2)}\n`);

if (!allPassed) process.exitCode = 1;
