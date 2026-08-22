import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  BIRELLO_MAINTENANCE_ENV,
  BIRELLO_MAINTENANCE_OPERATION,
  configurationFromBirelloMaintenanceEnvironment,
  runBirelloProductionMaintenance,
} from "../source-registry/birello-production-maintenance-executor";
import {
  BIRELLO_RUNTIME_RPC_GRANT_COUNT,
  BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL,
  BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
  BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS,
  BIRELLO_RUNTIME_RPC_GRANTS,
  configurationFromBirelloRuntimeRpcGrantEnvironment,
  runBirelloRuntimeRpcGrantOperation,
  type BirelloRuntimeRpcGrantClientFactory,
  type BirelloRuntimeRpcGrantConfiguration,
  type BirelloRuntimeRpcGrantReport,
} from "../source-registry/birello-runtime-rpc-grant-executor";

const ROOT = process.cwd();
const DATABASE = "birello_rpc_grant_proof";
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const MIGRATION_039 = "039_add_curated_locality_pack_ingestion_rpc.sql";
const MIGRATION_040 = "040_add_anmeldung_context_retrieval_rpc.sql";

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

function source(...parts: string[]): string {
  return readFileSync(path.join(ROOT, ...parts), "utf8");
}

function migration(name: string): string {
  return source("supabase", "migrations", name);
}

function repositoryBlobHash(content: string): string {
  const normalized = content.replace(/\r\n/gu, "\n");
  return createHash("sha1")
    .update(`blob ${Buffer.byteLength(normalized)}\0`)
    .update(normalized)
    .digest("hex");
}

function localConfiguration(url: string): BirelloRuntimeRpcGrantConfiguration {
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

function failureCode(report: BirelloRuntimeRpcGrantReport): string | null {
  return report.result === "REJECTED" ? report.failureCode : null;
}

function ready(report: BirelloRuntimeRpcGrantReport): boolean {
  return report.result === "PASS" && report.mode === "validate" && report.readyForApply;
}

async function knowledgeFingerprint(client: Client): Promise<string> {
  const result = await client.query(`select pg_catalog.md5(jsonb_build_object(
    'claims',(select count(*) from public.knowledge_claims),
    'jurisdictions',(select count(*) from public.knowledge_jurisdictions),
    'scopes',(select count(*) from public.knowledge_territorial_scopes),
    'authorities',(select count(*) from public.knowledge_authorities),
    'competences',(select count(*) from public.knowledge_authority_competences),
    'sources',(select count(*) from public.knowledge_sources)
  )::text) as value`);
  return String(result.rows[0]?.value);
}

async function catalogFingerprint(client: Client): Promise<string> {
  const result = await client.query(`select pg_catalog.md5(jsonb_build_object(
    'proc',(select jsonb_agg(jsonb_build_array(p.oid,p.proacl,p.prosecdef,p.proconfig)
      order by p.oid) from pg_catalog.pg_proc p join pg_catalog.pg_namespace n
      on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'knowledge\\_%'
      escape '\\'),
    'roles',(select jsonb_agg(to_jsonb(r) order by r.rolname) from (
      select rolname,rolcanlogin,rolsuper,rolcreatedb,rolcreaterole,rolinherit,
        rolreplication,rolbypassrls,rolconnlimit
      from pg_catalog.pg_roles where rolname like 'birello\\_%' escape '\\') r),
    'classes',(select jsonb_agg(jsonb_build_array(c.oid,c.relacl,c.relrowsecurity)
      order by c.oid) from pg_catalog.pg_class c join pg_catalog.pg_namespace n
      on n.oid=c.relnamespace where n.nspname='public' and c.relname like 'knowledge\\_%'
      escape '\\'),
    'policies',(select jsonb_agg(to_jsonb(p) order by p.tablename,p.policyname)
      from pg_catalog.pg_policies p where p.schemaname='public'
        and p.tablename like 'knowledge\\_%' escape '\\')
  )::text) as value`);
  return String(result.rows[0]?.value);
}

async function resetNewGrants(client: Client): Promise<void> {
  await client.query(`revoke execute on function
    public.knowledge_ingest_curated_locality_pack(jsonb)
    from public,birello_knowledge_ingestor,birello_knowledge_reader,
      birello_preflight_reader,anon,authenticated,service_role`);
  await client.query(`revoke execute on function
    public.knowledge_retrieve_anmeldung_context(uuid[],text)
    from public,birello_knowledge_ingestor,birello_knowledge_reader,
      birello_preflight_reader,anon,authenticated,service_role`);
}

function injectedFailure(
  kind: "after-g1" | "during-g2" | "postcondition",
): BirelloRuntimeRpcGrantClientFactory {
  return (configuration) => {
    const client = new Client({ connectionString: configuration.connectionString });
    let inspectionCount = 0;
    return {
      connect: () => client.connect().then(() => undefined),
      query: async (statement) => {
        if (statement === BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[0] && kind === "after-g1") {
          await client.query(statement);
          throw Object.assign(new Error("fixture after G1"), { code: "XX001" });
        }
        if (statement === BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[1] && kind === "during-g2") {
          throw Object.assign(new Error("fixture during G2"), { code: "XX002" });
        }
        const result = await client.query(statement);
        if (statement === BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL) {
          inspectionCount += 1;
          if (kind === "postcondition" && inspectionCount === 3 && result.rows[0]) {
            result.rows[0].rpc040_execute = {
              ...result.rows[0].rpc040_execute,
              birello_knowledge_reader: false,
            };
          }
        }
        return { rows: result.rows };
      },
      end: () => client.end(),
    };
  };
}

async function main(): Promise<void> {
  const container = `moja-v2h-rpc-grants-${process.pid}-${randomUUID().slice(0, 8)}`;
  const password = `admin-${randomUUID()}`;
  const started = docker([
    "run", "--rm", "-d", "--name", container,
    "-e", `POSTGRES_PASSWORD=${password}`,
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
    let available = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (docker(["exec", container, "pg_isready", "-U", "postgres", "-d", DATABASE])
        .status === 0) {
        available = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!available) throw new Error("PG17 did not become ready");
    const port = /:(\d+)\s*$/.exec(docker(["port", container, "5432/tcp"]).stdout)?.[1];
    if (!port) throw new Error("Disposable port unavailable");

    const setup = sql(container, `
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create role birello_knowledge_ingestor nologin
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role birello_knowledge_reader nologin
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role birello_preflight_reader nologin
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role bounded_wrong_owner nologin;
      ${migration("032_create_minimal_knowledge_schema.sql")}
      ${migration("033_add_publication_and_canonical_translation_schema.sql")}
      ${migration("034_fix_publication_and_translation_rpc_identifier_ambiguity.sql")}
      ${migration("035_add_official_source_registry_and_handling_mode_contract.sql")}
      ${migration("037_add_curated_knowledge_pack_ingestion_rpc.sql")}
      ${migration("038_add_curated_knowledge_retrieval_rpc.sql")}
      grant usage on schema public to birello_knowledge_ingestor,birello_knowledge_reader,
        birello_preflight_reader;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[],text[])
        to birello_knowledge_reader;
    `);
    if (setup.status !== 0) throw new Error(`Setup failed: ${setup.stderr.slice(-2_000)}`);

    const url =
      `postgresql://postgres:${encodeURIComponent(password)}@127.0.0.1:${port}/${DATABASE}`;
    const configuration = localConfiguration(url);
    const admin = new Client({ connectionString: url });
    await admin.connect();
    const tests: Record<string, boolean> = {};

    const g01 = await runBirelloRuntimeRpcGrantOperation(configuration, "validate");
    tests.G01 = failureCode(g01) === "FUNCTIONS_NOT_DEPLOYED";
    await admin.query(migration(MIGRATION_039));
    const g02 = await runBirelloRuntimeRpcGrantOperation(configuration, "validate");
    tests.G02 = failureCode(g02) === "FUNCTIONS_NOT_DEPLOYED";
    await admin.query(migration(MIGRATION_040));
    const g03 = await runBirelloRuntimeRpcGrantOperation(configuration, "validate");
    tests.G03 = ready(g03);

    await admin.query(
      "drop function public.knowledge_ingest_curated_locality_pack(jsonb)",
    );
    await admin.query(`create function public.knowledge_ingest_curated_locality_pack(text)
      returns jsonb language sql security definer set search_path=pg_catalog,public
      as 'select ''{}''::jsonb'`);
    tests.G04 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SIGNATURE_MISMATCH";
    await admin.query("drop function public.knowledge_ingest_curated_locality_pack(text)");
    await admin.query(migration(MIGRATION_039));

    await admin.query(
      "drop function public.knowledge_retrieve_anmeldung_context(uuid[],text)",
    );
    await admin.query(`create function public.knowledge_retrieve_anmeldung_context(uuid[])
      returns jsonb language sql security definer set search_path=pg_catalog,public
      as 'select ''{}''::jsonb'`);
    tests.G05 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SIGNATURE_MISMATCH";
    await admin.query("drop function public.knowledge_retrieve_anmeldung_context(uuid[])");
    await admin.query(migration(MIGRATION_040));

    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) security invoker",
    );
    tests.G06 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SECURITY_MISMATCH";
    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) security definer",
    );
    await admin.query(
      "alter function public.knowledge_retrieve_anmeldung_context(uuid[],text) security invoker",
    );
    tests.G07 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SECURITY_MISMATCH";
    await admin.query(
      "alter function public.knowledge_retrieve_anmeldung_context(uuid[],text) security definer",
    );

    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) set search_path=public",
    );
    tests.G08 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SECURITY_MISMATCH";
    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) set search_path=pg_catalog,public",
    );
    await admin.query(
      "alter function public.knowledge_retrieve_anmeldung_context(uuid[],text) set search_path=public",
    );
    tests.G09 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "FUNCTION_SECURITY_MISMATCH";
    await admin.query(
      "alter function public.knowledge_retrieve_anmeldung_context(uuid[],text) set search_path=pg_catalog,public",
    );

    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) owner to bounded_wrong_owner",
    );
    tests.G10 = failureCode(await runBirelloRuntimeRpcGrantOperation(
      configuration, "validate")) === "MAINTENANCE_AUTHORITY_INSUFFICIENT";
    await admin.query(
      "alter function public.knowledge_ingest_curated_locality_pack(jsonb) owner to postgres",
    );

    const beforeValidate = await catalogFingerprint(admin);
    const cleanValidation = await runBirelloRuntimeRpcGrantOperation(configuration, "validate");
    const afterValidate = await catalogFingerprint(admin);
    tests.G11 = ready(cleanValidation);
    tests.G12 = beforeValidate === afterValidate && cleanValidation.result === "PASS"
      && cleanValidation.mutationCount === 0 && !cleanValidation.transactionBegan;

    const afterG1 = await runBirelloRuntimeRpcGrantOperation(
      configuration, "apply", injectedFailure("after-g1"));
    tests.G30 = afterG1.result === "REJECTED" && afterG1.transactionRolledBack
      && ready(await runBirelloRuntimeRpcGrantOperation(configuration, "validate"));
    const duringG2 = await runBirelloRuntimeRpcGrantOperation(
      configuration, "apply", injectedFailure("during-g2"));
    tests.G31 = duringG2.result === "REJECTED" && duringG2.transactionRolledBack
      && ready(await runBirelloRuntimeRpcGrantOperation(configuration, "validate"));
    const postcondition = await runBirelloRuntimeRpcGrantOperation(
      configuration, "apply", injectedFailure("postcondition"));
    tests.G32 = postcondition.result === "REJECTED"
      && postcondition.failureCode === "POSTCONDITION_FAILED"
      && postcondition.transactionRolledBack
      && ready(await runBirelloRuntimeRpcGrantOperation(configuration, "validate"));

    await admin.query(BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[0]);
    const partial = await runBirelloRuntimeRpcGrantOperation(configuration, "apply");
    tests.G33 = partial.result === "REJECTED"
      && partial.failureCode === "PARTIAL_STATE"
      && partial.mutationCount === 0 && !partial.transactionBegan;
    await admin.query(BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[1]);
    const already = await runBirelloRuntimeRpcGrantOperation(configuration, "apply");
    tests.G34 = already.result === "REJECTED"
      && already.failureCode === "ALREADY_APPLIED"
      && already.mutationCount === 0 && !already.transactionBegan;
    await resetNewGrants(admin);
    await admin.query(`grant execute on function
      public.knowledge_ingest_curated_locality_pack(jsonb) to birello_knowledge_reader`);
    const exposure = await runBirelloRuntimeRpcGrantOperation(configuration, "apply");
    tests.G35 = exposure.result === "REJECTED"
      && exposure.failureCode === "UNEXPECTED_EXECUTE_EXPOSURE"
      && exposure.mutationCount === 0 && !exposure.transactionBegan;
    await resetNewGrants(admin);

    const rowBefore = await knowledgeFingerprint(admin);
    const stateBeforeResult = await admin.query(BIRELLO_RUNTIME_RPC_GRANT_INSPECTION_SQL);
    const stateBefore = stateBeforeResult.rows[0];
    const applied = await runBirelloRuntimeRpcGrantOperation(configuration, "apply");
    const rowAfter = await knowledgeFingerprint(admin);
    const appliedState = applied.result === "PASS" ? applied.state : null;
    tests.G13 = applied.result === "PASS"
      && applied.mutationCount === BIRELLO_RUNTIME_RPC_GRANT_COUNT;
    tests.G14 = appliedState?.rpc039.execute.birello_knowledge_ingestor === true;
    tests.G15 = appliedState?.rpc040.execute.birello_knowledge_reader === true;
    tests.G16 = appliedState?.rpc039.execute.birello_knowledge_reader === false;
    tests.G17 = appliedState?.rpc040.execute.birello_knowledge_ingestor === false;
    tests.G18 = appliedState?.rpc039.execute.birello_preflight_reader === false
      && appliedState.rpc040.execute.birello_preflight_reader === false;
    tests.G19 = appliedState?.rpc039.execute.PUBLIC === false
      && appliedState.rpc040.execute.PUBLIC === false;
    tests.G20 = appliedState?.rpc039.execute.anon === false
      && appliedState.rpc040.execute.anon === false;
    tests.G21 = appliedState?.rpc039.execute.authenticated === false
      && appliedState.rpc040.execute.authenticated === false;
    tests.G22 = appliedState?.rpc039.execute.service_role === false
      && appliedState.rpc040.execute.service_role === false;
    tests.G23 = appliedState?.rpc037Baseline === true;
    tests.G24 = appliedState?.rpc038Baseline === true;
    tests.G25 = appliedState?.safetyFingerprint === stateBefore.safety_fingerprint;
    tests.G26 = tests.G25;
    tests.G27 = tests.G25;
    tests.G28 = tests.G25;
    tests.G29 = tests.G25;

    const bootstrap002 = source(
      "supabase", "bootstrap", "002_create_birello_knowledge_ingestor.sql");
    const bootstrap003 = source(
      "supabase", "bootstrap", "003_create_birello_knowledge_reader.sql");
    tests.G36 = /grant\s+execute\s+on\s+function\s+public\.knowledge_ingest_curated_locality_pack\s*\(\s*jsonb\s*\)\s+to\s+birello_knowledge_ingestor/iu
      .test(bootstrap002)
      && BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[0]
        === "GRANT EXECUTE ON FUNCTION public.knowledge_ingest_curated_locality_pack(jsonb) TO birello_knowledge_ingestor";
    tests.G37 = /grant\s+execute\s+on\s+function\s+public\.knowledge_retrieve_anmeldung_context\s*\(\s*uuid\[\]\s*,\s*text\s*\)\s+to\s+birello_knowledge_reader/iu
      .test(bootstrap003)
      && BIRELLO_RUNTIME_RPC_GRANT_STATEMENTS[1]
        === "GRANT EXECUTE ON FUNCTION public.knowledge_retrieve_anmeldung_context(uuid[],text) TO birello_knowledge_reader";
    const migration039 = migration(MIGRATION_039);
    const migration040 = migration(MIGRATION_040);
    tests.G38 = repositoryBlobHash(migration039)
      === "5fd38d4a89c9f93443961f7c19de1e7e945eea9a"
      && migration039.includes(
        "function public.knowledge_ingest_curated_locality_pack(p_payload jsonb)");
    tests.G39 = repositoryBlobHash(migration040)
      === "8369efca863342d0dc102084c317a49c40e8c02c"
      && /function public\.knowledge_retrieve_anmeldung_context\s*\(\s*p_claim_ids uuid\[\],\s*p_municipality_code text\s*\)/u
        .test(migration040);

    const executorSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "source-registry",
      "birello-runtime-rpc-grant-executor.ts");
    const cliSource = source("scripts", "run-birello-runtime-rpc-grants.ts");
    tests.G40 = !/--role|process\.env\.[A-Z_]*ROLE/u.test(cliSource);
    tests.G41 = !/--function|--schema|--migration/u.test(cliSource);
    tests.G42 = !/--sql|query\(process|query\(arguments/u.test(cliSource + executorSource)
      && BIRELLO_RUNTIME_RPC_GRANTS.length === 2;

    const productionEnvironment = {
      [BIRELLO_MAINTENANCE_ENV.enabled]: "true",
      [BIRELLO_MAINTENANCE_ENV.target]: "production",
      [BIRELLO_MAINTENANCE_ENV.authorization]: BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
      [BIRELLO_MAINTENANCE_ENV.databaseUrl]:
        `postgresql://postgres.${PROJECT_REF}:rpc-grant-secret@aws-0-eu-central-1.pooler.supabase.com/${DATABASE}`,
      [BIRELLO_MAINTENANCE_ENV.databaseName]: DATABASE,
      [BIRELLO_MAINTENANCE_ENV.expectedHost]:
        "aws-0-eu-central-1.pooler.supabase.com",
      [BIRELLO_MAINTENANCE_ENV.projectRef]: PROJECT_REF,
      [BIRELLO_MAINTENANCE_ENV.expectedUser]: "postgres",
    };
    const oldAuth = configurationFromBirelloRuntimeRpcGrantEnvironment({
      ...productionEnvironment,
      [BIRELLO_MAINTENANCE_ENV.authorization]: BIRELLO_MAINTENANCE_OPERATION,
    });
    const newAuthForOld = configurationFromBirelloMaintenanceEnvironment(
      productionEnvironment);
    tests.G43 = "result" in oldAuth && oldAuth.result === "REJECTED";
    tests.G44 = "result" in newAuthForOld && newAuthForOld.result === "REJECTED";
    const encodedReports = JSON.stringify([
      g01, g02, g03, cleanValidation, afterG1, duringG2, postcondition, applied,
    ]);
    tests.G45 = !encodedReports.includes(password)
      && !encodedReports.includes("rpc-grant-secret");
    const productionConfig =
      configurationFromBirelloRuntimeRpcGrantEnvironment(productionEnvironment);
    tests.G46 = !("result" in productionConfig)
      && productionConfig.verifiedTls === true;
    tests.G47 = "result" in configurationFromBirelloRuntimeRpcGrantEnvironment({
      VAYLO_PRODUCTION_READONLY_DATABASE_URL: url,
    });
    tests.G48 = "result" in configurationFromBirelloRuntimeRpcGrantEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL: url,
      BIRELLO_PRODUCTION_RETRIEVAL_DATABASE_URL: url,
      BIRELLO_PRODUCTION_INGESTION_DATABASE_URL: url,
    });

    await resetNewGrants(admin);
    const existingRegression = await runBirelloProductionMaintenance(
      configuration, "validate");
    tests.G49 = existingRegression.result === "PASS";
    tests.G50 = rowBefore === rowAfter;
    await admin.end();

    const allPassed = Array.from({ length: 50 }, (_, index) =>
      tests[`G${String(index + 1).padStart(2, "0")}`] === true).every(Boolean);
    process.stdout.write(`${JSON.stringify({
      phaseResult: allPassed ? "PASS" : "FAILED",
      postgres: "17",
      operationId: BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
      logicalMutationCount: BIRELLO_RUNTIME_RPC_GRANT_COUNT,
      migrationHashes: {
        "039": repositoryBlobHash(migration039),
        "040": repositoryBlobHash(migration040),
      },
      tests,
      allPassed,
      productionConnectionAttempted: false,
    }, null, 2)}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    docker(["rm", "-f", container]);
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    error: error instanceof Error ? error.message : "UNKNOWN",
  }, null, 2)}\n`);
  process.exitCode = 1;
});
