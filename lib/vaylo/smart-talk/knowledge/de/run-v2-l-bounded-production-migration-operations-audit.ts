import { readFileSync } from "node:fs";
import path from "node:path";

import {
  BIRELLO_MIGRATIONS,
  BIRELLO_MIGRATION_ENV,
  BIRELLO_MIGRATION_STATE_SQL,
  BIRELLO_MIGRATION_STRUCTURE_SQL,
  configurationFromBirelloMigrationEnvironment,
  migrationFingerprint,
  runBirelloMigration,
  type BirelloMigration,
  type BirelloMigrationClientFactory,
  type BirelloMigrationConfiguration,
} from "../source-registry/birello-production-migration-executor";

const ROOT = process.cwd();
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const HOST = "aws-0-eu-central-1.pooler.supabase.com";
const PASSWORD = "audit-secret-not-reported";

const versions = (highest: number): string[] =>
  Array.from({ length: highest }, (_, index) => String(index + 1).padStart(3, "0"));

function configuration(
  authorizedMigration: BirelloMigration | null,
): BirelloMigrationConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: "postgresql://local-disposable-proof.invalid/postgres",
    host: "127.0.0.1",
    port: 5432,
    database: "postgres",
    projectRef: PROJECT_REF,
    expectedUser: "postgres",
    verifiedTls: false,
    authorizedMigration,
  });
}

function fakeFactory(
  initialVersions: readonly string[],
  trace: string[],
  options: Readonly<{
    database?: string;
    user?: string;
    failMigration?: boolean;
    badStructure?: boolean;
  }> = {},
): BirelloMigrationClientFactory {
  return () => {
    const ledger = [...initialVersions];
    return {
      connect: async () => { trace.push("CONNECT"); },
      query: async (sql) => {
        trace.push(sql);
        if (sql === BIRELLO_MIGRATION_STATE_SQL) {
          return { rows: [{
            database: options.database ?? "postgres",
            maintenance_user: options.user ?? "postgres",
            versions: [...ledger],
          }] };
        }
        if (sql.startsWith("-- KNOWLEDGE-FACTORY-COEXISTENCE-01")
          || sql.startsWith("-- ANMELDUNG-RETRIEVAL-COMPATIBILITY-01")) {
          if (options.failMigration) throw Object.assign(new Error("fixture failure"), {
            code: "XX001",
          });
          return { rows: [] };
        }
        const ledgerMatch =
          /insert into supabase_migrations\.schema_migrations\(version\) values \('(042|043)'\)/u
            .exec(sql);
        if (ledgerMatch) {
          ledger.push(ledgerMatch[1]!);
          return { rows: [] };
        }
        if (sql === BIRELLO_MIGRATION_STRUCTURE_SQL) {
          return { rows: [{
            internal_schema: !options.badStructure,
            internal_function_count: options.badStructure ? 0 : 3,
            factory_secure_count: 2,
            retrieval_secure_count: 2,
            g3_execute: true,
            g4_execute: true,
            rpc038_execute: true,
            rpc040_execute: true,
          }] };
        }
        return { rows: [] };
      },
      end: async () => { trace.push("END"); },
    };
  };
}

function isRejected(value: Readonly<Record<string, unknown>>, code: string): boolean {
  return value.result === "REJECTED" && value.failureCode === code;
}

function environment(): Record<string, string | undefined> {
  return {
    [BIRELLO_MIGRATION_ENV.enabled]: "true",
    [BIRELLO_MIGRATION_ENV.target]: "production",
    [BIRELLO_MIGRATION_ENV.authorization]: BIRELLO_MIGRATIONS["042"].operation,
    [BIRELLO_MIGRATION_ENV.databaseUrl]:
      `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@${HOST}/postgres`,
    [BIRELLO_MIGRATION_ENV.databaseName]: "postgres",
    [BIRELLO_MIGRATION_ENV.expectedHost]: HOST,
    [BIRELLO_MIGRATION_ENV.projectRef]: PROJECT_REF,
    [BIRELLO_MIGRATION_ENV.expectedUser]: "postgres",
    NODE_EXTRA_CA_CERTS: "local-audit-ca.pem",
  };
}

async function main(): Promise<void> {
  const checks: Record<string, boolean> = {};
  const executorSource = readFileSync(path.join(
    ROOT,
    "lib/vaylo/smart-talk/knowledge/source-registry/"
      + "birello-production-migration-executor.ts",
  ), "utf8");
  const cliSource = readFileSync(path.join(
    ROOT, "scripts/run-birello-production-migration.ts",
  ), "utf8");

  checks.M01 = JSON.stringify(Object.keys(BIRELLO_MIGRATIONS)) === '["042","043"]';
  checks.M02 = !/--path|--file|--sql|stdin|process\.stdin/iu.test(cliSource);
  checks.M03 = /^--migration=04\[23\]\$$/mu.test(cliSource)
    || cliSource.includes("/^--migration=04[23]$/");
  checks.M04 = executorSource.includes("rejectUnauthorized: true")
    && !executorSource.includes("rejectUnauthorized: false");
  checks.M05 = BIRELLO_MIGRATIONS["042"].sha256
      === migrationFingerprint("042")
    && BIRELLO_MIGRATIONS["043"].sha256 === migrationFingerprint("043");

  const validateTrace: string[] = [];
  const validate = await runBirelloMigration(
    configuration("042"), "042", "validate",
    fakeFactory(versions(41), validateTrace),
  );
  checks.M06 = validate.result === "PASS"
    && validate.mutationCount === 0
    && !validateTrace.includes("BEGIN")
    && !validateTrace.some((sql) => /^insert /iu.test(sql));

  const unauthorized = await runBirelloMigration(
    configuration(null), "042", "apply",
    () => { throw new Error("must not construct client"); },
  );
  checks.M07 = isRejected(unauthorized, "AUTHORIZATION_REQUIRED")
    && unauthorized.connectionAttempted === false;

  const drift = await runBirelloMigration(
    configuration("042"), "042", "validate",
    () => { throw new Error("must not construct client"); },
    (migration) => readFileSync(path.join(
      ROOT, "supabase", "migrations", BIRELLO_MIGRATIONS[migration].file,
    ), "utf8") + "\n-- reviewed-content-drift",
  );
  checks.M08 = isRejected(drift, "MIGRATION_SOURCE_MISMATCH")
    && drift.connectionAttempted === false;

  const trace042: string[] = [];
  const applied042 = await runBirelloMigration(
    configuration("042"), "042", "apply",
    fakeFactory(versions(41), trace042),
  );
  const begin042 = trace042.indexOf("BEGIN");
  const sql042 = trace042.findIndex((sql) =>
    sql.startsWith("-- KNOWLEDGE-FACTORY-COEXISTENCE-01"));
  const ledger042 = trace042.findIndex((sql) =>
    sql.includes("values ('042')"));
  const commit042 = trace042.indexOf("COMMIT");
  checks.M09 = applied042.result === "PASS"
    && begin042 >= 0 && sql042 > begin042 && ledger042 > sql042 && commit042 > ledger042
    && trace042.filter((item) => item === "BEGIN").length === 1
    && !trace042.some((item) => item.includes("043_add_"));

  const trace043: string[] = [];
  const applied043 = await runBirelloMigration(
    configuration("043"), "043", "apply",
    fakeFactory(versions(42), trace043),
  );
  checks.M10 = applied043.result === "PASS"
    && trace043.filter((item) => item === "BEGIN").length === 1
    && trace043.some((item) => item.includes("values ('043')"))
    && !trace043.some((item) => item.includes("values ('042')"));

  const rollbackTrace: string[] = [];
  const rollback = await runBirelloMigration(
    configuration("042"), "042", "apply",
    fakeFactory(versions(41), rollbackTrace, { failMigration: true }),
  );
  checks.M11 = isRejected(rollback, "EXECUTION_FAILED")
    && rollback.transactionRolledBack === true
    && rollbackTrace.includes("ROLLBACK") && !rollbackTrace.includes("COMMIT");

  const structureTrace: string[] = [];
  const structureRollback = await runBirelloMigration(
    configuration("042"), "042", "apply",
    fakeFactory(versions(41), structureTrace, { badStructure: true }),
  );
  checks.M12 = isRejected(structureRollback, "MIGRATION_POSTCONDITION_FAILED")
    && structureRollback.transactionRolledBack === true
    && !structureTrace.includes("COMMIT");

  checks.M13 = isRejected(await runBirelloMigration(
    configuration("043"), "043", "validate",
    fakeFactory(versions(41), []),
  ), "LEDGER_MISMATCH");
  checks.M14 = isRejected(await runBirelloMigration(
    configuration("042"), "042", "validate",
    fakeFactory(versions(42), []),
  ), "ALREADY_APPLIED");
  checks.M15 = isRejected(await runBirelloMigration(
    configuration("043"), "043", "validate",
    fakeFactory(versions(43), []),
  ), "ALREADY_APPLIED");
  checks.M16 = isRejected(await runBirelloMigration(
    configuration("042"), "042", "validate",
    fakeFactory([...versions(40), "999"], []),
  ), "LEDGER_MISMATCH");
  checks.M17 = isRejected(await runBirelloMigration(
    configuration("043"), "043", "validate",
    fakeFactory([...versions(41), "043"], []),
  ), "ALREADY_APPLIED");
  checks.M18 = isRejected(await runBirelloMigration(
    { ...configuration("042"), database: "wrong" }, "042", "validate",
    fakeFactory(versions(41), []),
  ), "TARGET_IDENTITY_MISMATCH");
  checks.M19 = isRejected(await runBirelloMigration(
    configuration("042"), "042", "validate",
    fakeFactory(versions(41), [], { user: "wrong_owner" }),
  ), "MAINTENANCE_IDENTITY_MISMATCH");

  const validEnvironment = environment();
  const accepts = (env: Record<string, string | undefined>) =>
    "target" in configurationFromBirelloMigrationEnvironment(env);
  const rejects = (env: Record<string, string | undefined>) =>
    !accepts(env);
  checks.M20 = accepts(validEnvironment);
  checks.M21 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.target]: "staging",
  });
  checks.M22 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.expectedHost]: "wrong.example",
  });
  checks.M23 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.projectRef]: "aaaaaaaaaaaaaaaaaaaa",
  });
  checks.M24 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.databaseName]: "wrong",
  });
  checks.M25 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.expectedUser]: "maintenance",
  });
  checks.M26 = rejects({
    ...validEnvironment, [BIRELLO_MIGRATION_ENV.forbiddenPublicUrl]: "forbidden",
  });
  checks.M27 = rejects({
    ...validEnvironment,
    [BIRELLO_MIGRATION_ENV.databaseUrl]:
      `${validEnvironment[BIRELLO_MIGRATION_ENV.databaseUrl]}?sslmode=disable`,
  });
  const wrongAuthorization = configurationFromBirelloMigrationEnvironment({
    ...validEnvironment,
    [BIRELLO_MIGRATION_ENV.authorization]: "WRONG",
  });
  checks.M28 = "target" in wrongAuthorization
    && wrongAuthorization.authorizedMigration === null;
  checks.M29 = !/NEXT_PUBLIC|PUBLIC_RUNTIME_AUTHORIZED\s*=\s*true/iu.test(cliSource)
    && !executorSource.includes("NEXT_PUBLIC_SUPABASE");
  const encoded = JSON.stringify([
    validate, unauthorized, drift, applied042, applied043, rollback, structureRollback,
  ]);
  checks.M30 = !encoded.includes(PASSWORD) && !encoded.includes("postgresql://")
    && [validate, unauthorized, drift, applied042, applied043, rollback]
      .every((item) => item.secretsPrinted === false);

  const allPassed = Object.values(checks).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    operationIds: Object.values(BIRELLO_MIGRATIONS).map(({ operation }) => operation),
    checks,
    productionConnectionAttempted: false,
    productionMutationPerformed: false,
    allPassed,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"phaseResult":"FAILED","message":"BOUNDED_MIGRATION_AUDIT_FAILED"}\n',
  );
  process.exitCode = 1;
});
