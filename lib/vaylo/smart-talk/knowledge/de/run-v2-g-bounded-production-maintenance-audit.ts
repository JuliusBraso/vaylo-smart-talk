import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  BIRELLO_MAINTENANCE_ENV,
  BIRELLO_FIT_VISIBILITY_GRANT_STATEMENTS,
  BIRELLO_FIT_VISIBILITY_LOGICAL_MUTATION_COUNT,
  BIRELLO_FIT_VISIBILITY_OPERATION,
  BIRELLO_FIT_VISIBILITY_POLICY_STATEMENTS,
  BIRELLO_FIT_VISIBILITY_TABLES,
  BIRELLO_MAINTENANCE_GRANT_STATEMENTS,
  BIRELLO_MAINTENANCE_LOGICAL_MUTATION_COUNT,
  BIRELLO_MAINTENANCE_OPERATION,
  BIRELLO_MAINTENANCE_POLICY_NAME,
  BIRELLO_MAINTENANCE_POLICY_STATEMENTS,
  BIRELLO_MAINTENANCE_POLICY_USING,
  configurationFromBirelloMaintenanceEnvironment,
  runBirelloFitVisibilityMaintenance,
  runBirelloProductionMaintenance,
  type BirelloMaintenanceClientFactory,
  type BirelloMaintenanceConfiguration,
  type BirelloMaintenanceReport,
} from "../source-registry/birello-production-maintenance-executor";
import {
  BIRELLO_PREFLIGHT_REQUIRED_TABLES,
  BIRELLO_PREFLIGHT_ROLE,
  runBirelloProductionPreflight,
  type BirelloPreflightConfiguration,
} from "../source-registry/birello-production-preflight-executor";

const ROOT = process.cwd();
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const DATABASE = "birello_maintenance_proof";

function docker(args: readonly string[], input?: string, timeout = 180_000) {
  return spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout, input,
  });
}

function sql(container: string, text: string) {
  return docker([
    "exec", "-i", container, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-A", "-t",
  ], text);
}

function migration(name: string): string {
  return readFileSync(path.join(ROOT, "supabase", "migrations", name), "utf8");
}

function localConfiguration(url: string): BirelloMaintenanceConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: url,
    host: "127.0.0.1",
    port: Number(new URL(url).port),
    database: DATABASE,
    projectRef: PROJECT_REF,
    expectedUser: "postgres",
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
  });
}

function localPreflightConfiguration(url: string): BirelloPreflightConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: url,
    host: "127.0.0.1",
    port: Number(new URL(url).port),
    database: DATABASE,
    user: BIRELLO_PREFLIGHT_ROLE,
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
  });
}

function allTrue(value: Readonly<Record<string, boolean>>): boolean {
  return BIRELLO_PREFLIGHT_REQUIRED_TABLES.every((table) => value[table] === true);
}

function allFalse(value: Readonly<Record<string, boolean>>): boolean {
  return BIRELLO_PREFLIGHT_REQUIRED_TABLES.every((table) => value[table] === false);
}

async function fingerprint(client: Client): Promise<string> {
  const result = await client.query(`select jsonb_build_object(
    'claims',(select count(*) from public.knowledge_claims),
    'jurisdictions',(select count(*) from public.knowledge_jurisdictions),
    'scopes',(select count(*) from public.knowledge_territorial_scopes),
    'authorities',(select count(*) from public.knowledge_authorities),
    'competences',(select count(*) from public.knowledge_authority_competences),
    'sources',(select count(*) from public.knowledge_sources)
  )::text as value`);
  return String(result.rows[0]?.value);
}

async function denied(client: Client, statement: string): Promise<boolean> {
  try {
    await client.query(statement);
    return false;
  } catch {
    return true;
  }
}

async function resetBaseline(client: Client): Promise<void> {
  for (const table of BIRELLO_PREFLIGHT_REQUIRED_TABLES) {
    await client.query(`REVOKE SELECT ON TABLE public.${table} FROM ${BIRELLO_PREFLIGHT_ROLE}`);
    await client.query(
      `DROP POLICY IF EXISTS ${BIRELLO_MAINTENANCE_POLICY_NAME} ON public.${table}`,
    );
  }
}

function failureFactory(kind: "grant" | "policy", failureIndex: number):
  BirelloMaintenanceClientFactory {
  return (configuration) => {
    const client = new Client({ connectionString: configuration.connectionString });
    let seen = 0;
    return {
      connect: () => client.connect().then(() => undefined),
      query: (statement) => {
        const matches = kind === "grant"
          ? statement.startsWith("GRANT SELECT ON TABLE")
          : statement.startsWith("CREATE POLICY");
        if (matches) {
          seen += 1;
          if (seen === failureIndex) {
            return Promise.reject(Object.assign(new Error("fixture failure"), { code: "XX001" }));
          }
        }
        return client.query(statement).then((result) => ({ rows: result.rows }));
      },
      end: () => client.end(),
    };
  };
}

function rejectedCode(
  report: BirelloMaintenanceReport | BirelloMaintenanceConfiguration,
  code: string,
): boolean {
  return "result" in report
    && report.result === "REJECTED"
    && report.failureCode === code;
}

function rejectedWithoutTransaction(report: BirelloMaintenanceReport, code: string): boolean {
  return report.result === "REJECTED"
    && report.failureCode === code
    && !report.transactionBegan;
}

async function main(): Promise<void> {
  const container = `moja-v2g-maintenance-${process.pid}-${randomUUID().slice(0, 8)}`;
  const adminPassword = `admin-${randomUUID()}`;
  const readerPassword = `reader-${randomUUID()}`;
  const started = docker([
    "run", "--rm", "-d", "--name", container,
    "-e", `POSTGRES_PASSWORD=${adminPassword}`,
    "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "postgres:17",
  ]);
  if (started.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED", blocker: "DOCKER_PG17_UNAVAILABLE",
    }, null, 2)}\n`);
    return;
  }

  try {
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (docker(["exec", container, "pg_isready", "-U", "postgres", "-d", DATABASE]).status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error("PG17 did not become ready");
    const port = /:(\d+)\s*$/.exec(docker(["port", container, "5432/tcp"]).stdout)?.[1];
    if (!port) throw new Error("Disposable port unavailable");

    const setup = sql(container, `
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create role birello_knowledge_ingestor nologin;
      create role birello_knowledge_reader nologin;
      create role ${BIRELLO_PREFLIGHT_ROLE} login password '${readerPassword}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      ${migration("032_create_minimal_knowledge_schema.sql")}
      ${migration("033_add_publication_and_canonical_translation_schema.sql")}
      ${migration("034_fix_publication_and_translation_rpc_identifier_ambiguity.sql")}
      ${migration("035_add_official_source_registry_and_handling_mode_contract.sql")}
      ${migration("037_add_curated_knowledge_pack_ingestion_rpc.sql")}
      ${migration("038_add_curated_knowledge_retrieval_rpc.sql")}
      ${migration("039_add_curated_locality_pack_ingestion_rpc.sql")}
      ${migration("040_add_anmeldung_context_retrieval_rpc.sql")}
      create schema if not exists supabase_migrations;
      create table if not exists supabase_migrations.schema_migrations(
        version text primary key
      );
      insert into supabase_migrations.schema_migrations(version)
      select lpad(value::text,3,'0') from generate_series(1,40) value
      on conflict do nothing;
      grant usage on schema public to ${BIRELLO_PREFLIGHT_ROLE};
      grant usage on schema supabase_migrations to ${BIRELLO_PREFLIGHT_ROLE};
      grant select on table supabase_migrations.schema_migrations
        to ${BIRELLO_PREFLIGHT_ROLE};
    `);
    if (setup.status !== 0) throw new Error(`Setup failed: ${setup.stderr.slice(-2_000)}`);

    const adminUrl =
      `postgresql://postgres:${encodeURIComponent(adminPassword)}@127.0.0.1:${port}/${DATABASE}`;
    const readerUrl =
      `postgresql://${BIRELLO_PREFLIGHT_ROLE}:${encodeURIComponent(readerPassword)}@127.0.0.1:${port}/${DATABASE}`;
    const configuration = localConfiguration(adminUrl);
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const initialFingerprint = await fingerprint(admin);

    const baselineBefore = await runBirelloProductionMaintenance(configuration, "validate");
    const baselineFingerprint = await fingerprint(admin);
    const baselineState = baselineBefore.result === "PASS" ? baselineBefore.state : null;
    const missing = configurationFromBirelloMaintenanceEnvironment({});
    const productionEnvironment = {
      [BIRELLO_MAINTENANCE_ENV.enabled]: "true",
      [BIRELLO_MAINTENANCE_ENV.target]: "production",
      [BIRELLO_MAINTENANCE_ENV.authorization]: BIRELLO_MAINTENANCE_OPERATION,
      [BIRELLO_MAINTENANCE_ENV.databaseUrl]:
        `postgresql://postgres.${PROJECT_REF}:secret@aws-0-eu-central-1.pooler.supabase.com/${DATABASE}`,
      [BIRELLO_MAINTENANCE_ENV.databaseName]: DATABASE,
      [BIRELLO_MAINTENANCE_ENV.expectedHost]: "aws-0-eu-central-1.pooler.supabase.com",
      [BIRELLO_MAINTENANCE_ENV.projectRef]: PROJECT_REF,
      [BIRELLO_MAINTENANCE_ENV.expectedUser]: "postgres",
    };
    const visibilityProductionConfiguration =
      configurationFromBirelloMaintenanceEnvironment({
        ...productionEnvironment,
        [BIRELLO_MAINTENANCE_ENV.authorization]:
          BIRELLO_FIT_VISIBILITY_OPERATION,
      }, BIRELLO_FIT_VISIBILITY_OPERATION);
    const wrongTarget = configurationFromBirelloMaintenanceEnvironment({
      ...productionEnvironment,
      [BIRELLO_MAINTENANCE_ENV.target]: "staging",
    });
    const wrongHost = configurationFromBirelloMaintenanceEnvironment({
      ...productionEnvironment,
      [BIRELLO_MAINTENANCE_ENV.expectedHost]: "wrong.birello.example",
    });
    const wrongProject = configurationFromBirelloMaintenanceEnvironment({
      ...productionEnvironment,
      [BIRELLO_MAINTENANCE_ENV.projectRef]: "aaaaaaaaaaaaaaaaaaaa",
    });
    const wrongDatabase = await runBirelloProductionMaintenance(
      { ...configuration, database: "wrong_database" }, "validate");
    const wrongIdentity = await runBirelloProductionMaintenance(
      { ...configuration, expectedUser: "bounded_wrong_owner" }, "validate");

    const policyRollback = await runBirelloProductionMaintenance(
      configuration, "apply", failureFactory("policy", 3));
    const afterPolicyRollback = await runBirelloProductionMaintenance(configuration, "validate");
    const grantRollback = await runBirelloProductionMaintenance(
      configuration, "apply", failureFactory("grant", 4));
    const afterGrantRollback = await runBirelloProductionMaintenance(configuration, "validate");

    await admin.query(
      `GRANT SELECT ON TABLE public.knowledge_claims TO ${BIRELLO_PREFLIGHT_ROLE}`,
    );
    const selectDrift = await runBirelloProductionMaintenance(configuration, "apply");
    await resetBaseline(admin);
    await admin.query(
      `CREATE POLICY ${BIRELLO_MAINTENANCE_POLICY_NAME} ON public.knowledge_claims`
      + ` FOR SELECT TO ${BIRELLO_PREFLIGHT_ROLE} USING (true)`,
    );
    const policyDrift = await runBirelloProductionMaintenance(configuration, "apply");
    await resetBaseline(admin);
    await admin.query(
      `CREATE POLICY ${BIRELLO_MAINTENANCE_POLICY_NAME} ON public.knowledge_claims`
      + ` FOR SELECT TO ${BIRELLO_PREFLIGHT_ROLE} USING (false)`,
    );
    const collision = await runBirelloProductionMaintenance(configuration, "apply");
    await resetBaseline(admin);

    const applied = await runBirelloProductionMaintenance(configuration, "apply");
    const secondApply = await runBirelloProductionMaintenance(configuration, "apply");
    const compliantValidation = await runBirelloProductionMaintenance(configuration, "validate");
    const appliedState = applied.result === "PASS" ? applied.state : null;

    const readerBefore = new Client({ connectionString: readerUrl });
    await readerBefore.connect();
    const metadataSelectBefore = await denied(
      readerBefore,
      "select count(*) from public.knowledge_retrieval_metadata",
    );
    const trustSelectBefore = await denied(
      readerBefore,
      "select count(*) from public.knowledge_trust_domains",
    );
    await readerBefore.end();

    const visibilityValidation = await runBirelloFitVisibilityMaintenance(
      configuration,
      "validate",
    );
    const visibilityApplied = await runBirelloFitVisibilityMaintenance(
      configuration,
      "apply",
    );
    const visibilitySecondApply = await runBirelloFitVisibilityMaintenance(
      configuration,
      "apply",
    );
    const visibilityCompliantValidation = await runBirelloFitVisibilityMaintenance(
      configuration,
      "validate",
    );
    const extendedPreflight = await runBirelloProductionPreflight(
      localPreflightConfiguration(readerUrl),
    );
    const finalFingerprint = await fingerprint(admin);

    const reader = new Client({ connectionString: readerUrl });
    await reader.connect();
    const metadataSelectAfter = !await denied(
      reader,
      "select count(*) from public.knowledge_retrieval_metadata",
    );
    const trustSelectAfter = !await denied(
      reader,
      "select count(*) from public.knowledge_trust_domains",
    );
    const insertDenied = await denied(reader,
      "insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id) values(gen_random_uuid(),'x','x',gen_random_uuid())");
    const updateDenied = await denied(reader,
      "update public.knowledge_claims set claim_text_canonical='x' where false");
    const deleteDenied = await denied(reader,
      "delete from public.knowledge_claims where false");
    const truncateDenied = await denied(reader, "truncate public.knowledge_claims");
    const metadataInsertDenied = await denied(
      reader,
      "insert into public.knowledge_retrieval_metadata(entity_type,entity_id) values('claim',gen_random_uuid())",
    );
    const metadataUpdateDenied = await denied(
      reader,
      "update public.knowledge_retrieval_metadata set full_text_indexed=false where false",
    );
    const metadataDeleteDenied = await denied(
      reader,
      "delete from public.knowledge_retrieval_metadata where false",
    );
    const trustInsertDenied = await denied(
      reader,
      "insert into public.knowledge_trust_domains(code,name) values('sk','forbidden')",
    );
    const schemaCreateDenied = await denied(reader,
      "create table public.maintenance_forbidden(id integer)");
    await reader.end();

    const unaffectedRoles = await admin.query(`
      select r.rolname,
        pg_catalog.has_table_privilege(
          r.rolname,'public.knowledge_retrieval_metadata','SELECT'
        ) metadata_select,
        pg_catalog.has_table_privilege(
          r.rolname,'public.knowledge_trust_domains','SELECT'
        ) trust_select
      from pg_catalog.pg_roles r
      where r.rolname=any(array['anon','authenticated'])
      order by r.rolname
    `);
    const publicSelectGrantCount = Number((await admin.query(`
      select count(*)::int count
      from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid=c.relnamespace
      cross join lateral pg_catalog.aclexplode(coalesce(c.relacl,'{}'::aclitem[])) acl
      where n.nspname='public'
        and c.relname=any(array[
          'knowledge_retrieval_metadata','knowledge_trust_domains'
        ])
        and acl.grantee=0
        and acl.privilege_type='SELECT'
    `)).rows[0]?.count);
    await admin.end();

    const executorPath = path.join(
      ROOT, "lib/vaylo/smart-talk/knowledge/source-registry/birello-production-maintenance-executor.ts");
    const cliPath = path.join(ROOT, "scripts/run-birello-production-maintenance.ts");
    const bootstrapPath = path.join(
      ROOT, "supabase/bootstrap/004_create_birello_preflight_reader.sql");
    const executorSource = readFileSync(executorPath, "utf8");
    const cliSource = readFileSync(cliPath, "utf8");
    const bootstrapSource = readFileSync(bootstrapPath, "utf8");
    const parity = {
      tables: BIRELLO_PREFLIGHT_REQUIRED_TABLES.every((table) =>
        bootstrapSource.includes(`public.${table}`)
        && BIRELLO_MAINTENANCE_GRANT_STATEMENTS.some((item) =>
          item.includes(`public.${table}`))
        && BIRELLO_MAINTENANCE_POLICY_STATEMENTS.some((item) =>
          item.includes(`public.${table}`))),
      policies: bootstrapSource.includes(
        `create policy ${BIRELLO_MAINTENANCE_POLICY_NAME}`)
        && BIRELLO_MAINTENANCE_POLICY_STATEMENTS.every((item) =>
          item.startsWith(`CREATE POLICY ${BIRELLO_MAINTENANCE_POLICY_NAME}`)),
      commands: bootstrapSource.includes("for select")
        && BIRELLO_MAINTENANCE_POLICY_STATEMENTS.every((item) =>
          item.includes(" FOR SELECT ")),
      role: bootstrapSource.includes(`to ${BIRELLO_PREFLIGHT_ROLE}`)
        && BIRELLO_MAINTENANCE_GRANT_STATEMENTS.every((item) =>
          item.endsWith(`TO ${BIRELLO_PREFLIGHT_ROLE}`)),
      using: bootstrapSource.includes(`using (${BIRELLO_MAINTENANCE_POLICY_USING})`)
        && BIRELLO_MAINTENANCE_POLICY_STATEMENTS.every((item) =>
          item.endsWith(`USING (${BIRELLO_MAINTENANCE_POLICY_USING})`)),
    };
    const parityPassed = Object.values(parity).every(Boolean);
    const encodedReports = JSON.stringify([
      baselineBefore, policyRollback, grantRollback, applied, compliantValidation,
      visibilityValidation, visibilityApplied, visibilityCompliantValidation,
    ]);
    const legacyIsolated = "result" in configurationFromBirelloMaintenanceEnvironment({
      VAYLO_PRODUCTION_READONLY_DATABASE_URL: adminUrl,
    });
    const preflightIsolated = "result" in configurationFromBirelloMaintenanceEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL: adminUrl,
    });
    const retrievalIsolated = "result" in configurationFromBirelloMaintenanceEnvironment({
      BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL: adminUrl,
    });

    const cases = {
      M1: baselineBefore.result === "PASS" && baselineBefore.mutationCount === 0
        && initialFingerprint === baselineFingerprint,
      M2: "result" in missing && missing.result === "CONFIGURATION_REQUIRED"
        && missing.missing.every((name: string) =>
          name.startsWith("BIRELLO_PRODUCTION_MAINTENANCE_")),
      M3: rejectedCode(wrongTarget, "CONFIGURATION_INVALID"),
      M4: rejectedCode(wrongDatabase, "TARGET_IDENTITY_MISMATCH"),
      M5: rejectedCode(wrongHost, "CONFIGURATION_INVALID")
        && rejectedCode(wrongProject, "CONFIGURATION_INVALID"),
      M6: rejectedCode(wrongIdentity, "MAINTENANCE_IDENTITY_MISMATCH"),
      M7: executorSource.includes(`BIRELLO_PREFLIGHT_ROLE`)
        && !cliSource.includes("--role"),
      M8: !cliSource.includes("--table"),
      M9: !cliSource.includes("--sql") && !cliSource.includes("--query")
        && !cliSource.includes("stdin"),
      M10: baselineState !== null && allFalse(baselineState.tableSelect)
        && allFalse(baselineState.canonicalPolicies),
      M11: appliedState !== null && allTrue(appliedState.tableSelect),
      M12: appliedState !== null && allTrue(appliedState.canonicalPolicies),
      M13: applied.result === "PASS" && applied.mutationCount === 12,
      M14: insertDenied,
      M15: updateDenied,
      M16: deleteDenied,
      M17: truncateDenied,
      M18: schemaCreateDenied && appliedState?.schemaCreate === false,
      M19: appliedState?.bypassRls === false,
      M20: appliedState?.rpc037 === false,
      M21: appliedState?.rpc039 === false,
      M22: appliedState?.rpc038 === false,
      M23: appliedState?.rpc040 === false,
      M24: appliedState?.membershipCount === 0,
      M25: !executorSource.includes("SELECT ON ALL TABLES")
        && !executorSource.includes("ALTER DEFAULT PRIVILEGES"),
      M26: BIRELLO_MAINTENANCE_LOGICAL_MUTATION_COUNT === 12
        && BIRELLO_MAINTENANCE_GRANT_STATEMENTS.length === 6
        && BIRELLO_MAINTENANCE_POLICY_STATEMENTS.length === 6,
      M27: policyRollback.result === "REJECTED"
        && policyRollback.transactionRolledBack
        && afterPolicyRollback.result === "PASS"
        && allFalse(afterPolicyRollback.state.tableSelect)
        && allFalse(afterPolicyRollback.state.canonicalPolicies),
      M28: grantRollback.result === "REJECTED"
        && grantRollback.transactionRolledBack
        && afterGrantRollback.result === "PASS"
        && allFalse(afterGrantRollback.state.tableSelect)
        && allFalse(afterGrantRollback.state.canonicalPolicies),
      M29: rejectedWithoutTransaction(selectDrift, "PARTIAL_STATE"),
      M30: rejectedWithoutTransaction(policyDrift, "PARTIAL_STATE"),
      M31: rejectedWithoutTransaction(collision, "POLICY_COLLISION"),
      M32: rejectedWithoutTransaction(secondApply, "ALREADY_APPLIED"),
      M33: compliantValidation.result === "PASS"
        && allTrue(compliantValidation.state.tableSelect)
        && allTrue(compliantValidation.state.canonicalPolicies),
      M34: !encodedReports.includes(adminPassword)
        && !encodedReports.includes(adminUrl) && !encodedReports.includes("postgresql://"),
      M35: executorSource.includes("rejectUnauthorized: true")
        && !executorSource.includes("rejectUnauthorized: false")
        && !("result" in configurationFromBirelloMaintenanceEnvironment(
          productionEnvironment)),
      M36: legacyIsolated,
      M37: preflightIsolated,
      M38: retrievalIsolated,
      M39: executorSource.includes("BIRELLO_PREFLIGHT_REQUIRED_TABLES"),
      M40: initialFingerprint === finalFingerprint,
      M41: visibilityValidation.result === "PASS"
        && visibilityValidation.mutationCount === 0
        && Object.values(visibilityValidation.state.targetTableSelect).every(
          (value) => value === false,
        )
        && Object.values(visibilityValidation.state.targetCanonicalPolicies).every(
          (value) => value === false,
        ),
      M42: visibilityApplied.result === "PASS"
        && visibilityApplied.operationId === BIRELLO_FIT_VISIBILITY_OPERATION
        && visibilityApplied.mutationCount
          === BIRELLO_FIT_VISIBILITY_LOGICAL_MUTATION_COUNT
        && Object.values(visibilityApplied.state.targetTableSelect).every(Boolean)
        && Object.values(visibilityApplied.state.targetCanonicalPolicies).every(Boolean),
      M43: visibilitySecondApply.result === "REJECTED"
        && visibilitySecondApply.failureCode === "ALREADY_APPLIED"
        && !visibilitySecondApply.transactionBegan,
      M44: visibilityCompliantValidation.result === "PASS"
        && visibilityCompliantValidation.mutationCount === 0
        && visibilityCompliantValidation.state.knowledgeWritePrivilegeCount === 0
        && visibilityCompliantValidation.state.executableFunctionCount === 0,
      M45: metadataSelectBefore && trustSelectBefore
        && metadataSelectAfter && trustSelectAfter,
      M46: metadataInsertDenied && metadataUpdateDenied && metadataDeleteDenied
        && trustInsertDenied,
      M47: unaffectedRoles.rows.length === 2
        && unaffectedRoles.rows.every((row) =>
          row.metadata_select === false && row.trust_select === false)
        && publicSelectGrantCount === 0,
      M48: extendedPreflight.result === "PASS"
        && extendedPreflight.fit.missingSelect.length === 0
        && extendedPreflight.retrievalMetadata.selectVisible
        && extendedPreflight.trustDomain.selectVisible
        && extendedPreflight.retrievalMetadata.metadataCount === 0
        && extendedPreflight.trustDomain.semanticDeCount === 0,
      M49: BIRELLO_FIT_VISIBILITY_TABLES.length === 2
        && BIRELLO_FIT_VISIBILITY_GRANT_STATEMENTS.length === 2
        && BIRELLO_FIT_VISIBILITY_POLICY_STATEMENTS.length === 2
        && BIRELLO_FIT_VISIBILITY_GRANT_STATEMENTS.every((statement) =>
          statement.startsWith("GRANT SELECT ON TABLE public."))
        && BIRELLO_FIT_VISIBILITY_POLICY_STATEMENTS.every((statement) =>
          statement.includes(` FOR SELECT TO ${BIRELLO_PREFLIGHT_ROLE} USING (true)`)),
      M50: !("result" in visibilityProductionConfiguration)
        && cliSource.includes("--operation=preflight-reader-fit-visibility")
        && !cliSource.includes("--table")
        && !cliSource.includes("--role"),
    };
    const allPassed = Object.values(cases).every(Boolean) && parityPassed;
    process.stdout.write(`${JSON.stringify({
      phaseResult: allPassed ? "PASS" : "FAILED",
      pgVersion: 17,
      cases,
      bootstrapParity: { ...parity, allPassed: parityPassed },
      safeEvidence: {
        operationId: BIRELLO_MAINTENANCE_OPERATION,
        targetRole: BIRELLO_PREFLIGHT_ROLE,
        tables: BIRELLO_PREFLIGHT_REQUIRED_TABLES,
        policyName: BIRELLO_MAINTENANCE_POLICY_NAME,
        mutationCount: applied.result === "PASS" ? applied.mutationCount : 0,
        rollbackPolicy3: policyRollback.result === "REJECTED"
          && policyRollback.transactionRolledBack,
        rollbackGrant4: grantRollback.result === "REJECTED"
          && grantRollback.transactionRolledBack,
        visibilityOperationId: BIRELLO_FIT_VISIBILITY_OPERATION,
        visibilityTables: BIRELLO_FIT_VISIBILITY_TABLES,
        visibilityMutationCount: visibilityApplied.result === "PASS"
          ? visibilityApplied.mutationCount
          : 0,
        extendedPreflightMissingSelect: extendedPreflight.result === "PASS"
          ? extendedPreflight.fit.missingSelect
          : null,
      },
      productionConnectionAttempted: false,
      productionMutationPerformed: false,
      allPassed,
    }, null, 2)}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    docker(["rm", "-f", container]);
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error
    ? error.message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted]")
    : "Bounded maintenance audit failed"}\n`);
  process.exitCode = 1;
});
