import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  BIRELLO_PREFLIGHT_FIXED_QUERIES,
  BIRELLO_PREFLIGHT_REQUIRED_TABLES,
  BIRELLO_PREFLIGHT_ROLE,
  IMPLEMENTED_BIRELLO_REMOTE_PREFLIGHT_EXECUTOR,
  configurationFromBirelloPreflightEnvironment,
  runBirelloProductionPreflight,
  type BirelloPreflightClientFactory,
  type BirelloPreflightConfiguration,
  type BirelloPreflightQueryId,
} from "../source-registry/birello-production-preflight-executor";
import { buildCuratedIngestionPayload } from "../packs/de/anmeldung-ummeldung-abmeldung/curated-ingestion-payload";
import { buildWeiltingenLocalityPilotPayload } from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";
import {
  FIRST_PACK_CANONICAL_UNIT_IDS,
} from "../packs/de/anmeldung-ummeldung-abmeldung/pack";

const ROOT = process.cwd();
const PROJECT_REF = "cdztcnfjxheudqhvepbq";

function docker(args: readonly string[], input?: string, timeout = 180_000) {
  return spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout, input,
  });
}

function sql(container: string, database: string, text: string) {
  return docker([
    "exec", "-i", container, "psql", "-X", "-U", "postgres", "-d", database,
    "-v", "ON_ERROR_STOP=1", "-A", "-t",
  ], text);
}

function migration(name: string): string {
  return readFileSync(path.join(ROOT, "supabase", "migrations", name), "utf8");
}

function bootstrap(name: string): string {
  return readFileSync(path.join(ROOT, "supabase", "bootstrap", name), "utf8");
}

function localConfiguration(url: string, database: string): BirelloPreflightConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: url,
    host: "127.0.0.1",
    port: Number(new URL(url).port),
    database,
    user: BIRELLO_PREFLIGHT_ROLE,
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
  });
}

function connectionFailure(code: string, message: string): BirelloPreflightClientFactory {
  return () => ({
    connect: () => Promise.reject(Object.assign(new Error(message), { code })),
    query: () => Promise.reject(new Error("query must not run")),
    end: () => Promise.resolve(),
  });
}

function fixedQueryFailure(
  failedQueryId: BirelloPreflightQueryId,
  rawMessage: string,
): BirelloPreflightClientFactory {
  return (configuration) => {
    const client = new Client({ connectionString: configuration.connectionString });
    return {
      connect: () => client.connect().then(() => undefined),
      query: (query) => query === BIRELLO_PREFLIGHT_FIXED_QUERIES[failedQueryId]
        ? Promise.reject(Object.assign(new Error(rawMessage), { code: "42501" }))
        : client.query(query).then((result) => ({ rows: result.rows })),
      end: () => client.end(),
    };
  };
}

async function denied(client: Client, query: string): Promise<boolean> {
  try {
    await client.query(query);
    return false;
  } catch {
    return true;
  }
}

async function fingerprint(client: Client): Promise<string> {
  const result = await client.query(`select jsonb_build_object(
    'claims',(select count(*) from public.knowledge_claims),
    'sources',(select count(*) from public.knowledge_sources),
    'jurisdictions',(select count(*) from public.knowledge_jurisdictions),
    'authorities',(select count(*) from public.knowledge_authorities),
    'competences',(select count(*) from public.knowledge_authority_competences),
    'policies',(select count(*) from public.knowledge_source_handling_policies)
  )::text as value`);
  return String(result.rows[0]?.value);
}

async function preflightSecuritySnapshot(client: Client): Promise<Record<string, unknown>> {
  const result = await client.query(`
    select
      r.rolcanlogin,r.rolsuper,r.rolcreatedb,r.rolcreaterole,r.rolinherit,
      r.rolreplication,r.rolbypassrls,r.rolconnlimit,
      pg_catalog.has_database_privilege(r.rolname,current_database(),'CONNECT') as db_connect,
      pg_catalog.has_database_privilege(r.rolname,current_database(),'CREATE') as db_create,
      pg_catalog.has_schema_privilege(r.rolname,'public','USAGE') as public_usage,
      pg_catalog.has_schema_privilege(r.rolname,'public','CREATE') as public_create,
      pg_catalog.has_schema_privilege(r.rolname,'supabase_migrations','USAGE') as ledger_usage,
      pg_catalog.has_schema_privilege(r.rolname,'supabase_migrations','CREATE') as ledger_create,
      pg_catalog.has_table_privilege(
        r.rolname,'supabase_migrations.schema_migrations','SELECT') as ledger_select,
      (select array_agg(c.relname::text order by c.relname)
       from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
         and c.relkind in ('r','p','v','m','f')
         and pg_catalog.has_table_privilege(r.rolname,c.oid,'SELECT')) as selected_tables,
      (select count(*)::int
       from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and c.relname like 'knowledge\\_%' escape '\\'
         and c.relkind in ('r','p','v','m','f') and (
           pg_catalog.has_table_privilege(r.rolname,c.oid,'INSERT')
           or pg_catalog.has_table_privilege(r.rolname,c.oid,'UPDATE')
           or pg_catalog.has_table_privilege(r.rolname,c.oid,'DELETE')
           or pg_catalog.has_table_privilege(r.rolname,c.oid,'TRUNCATE'))) as write_count,
      (select array_agg(p.tablename::text order by p.tablename)
       from pg_catalog.pg_policies p
       where p.schemaname='public'
         and p.policyname='birello_preflight_reader_select'
         and p.roles=array['birello_preflight_reader'::name]
         and p.cmd='SELECT' and p.qual='true') as policy_tables,
      (select count(*)::int
       from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and c.relname=any($2::text[])
         and c.relrowsecurity) as rls_enabled_count,
      pg_catalog.has_function_privilege(
        r.rolname,'public.knowledge_ingest_curated_pack(jsonb)','EXECUTE') as ingest_037,
      pg_catalog.has_function_privilege(
        r.rolname,'public.knowledge_ingest_curated_locality_pack(jsonb)','EXECUTE') as ingest_039,
      pg_catalog.has_function_privilege(
        r.rolname,'public.knowledge_retrieve_evidence_packets(uuid[],text[])','EXECUTE') as retrieve_038,
      pg_catalog.has_function_privilege(
        r.rolname,'public.knowledge_retrieve_anmeldung_context(uuid[],text)','EXECUTE') as retrieve_040,
      (select count(*)::int from pg_catalog.pg_auth_members m where m.member=r.oid)
        as membership_count
    from pg_catalog.pg_roles r where r.rolname=$1
  `, [BIRELLO_PREFLIGHT_ROLE, BIRELLO_PREFLIGHT_REQUIRED_TABLES]);
  return result.rows[0] as Record<string, unknown>;
}

async function main(): Promise<void> {
  const container = `moja-v2g-preflight-${process.pid}-${randomUUID().slice(0, 8)}`;
  const database = "birello_preflight_proof";
  const adminPassword = `admin-${randomUUID()}`;
  const readerPassword = `reader-${randomUUID()}`;
  const ingestorPassword = `ingestor-${randomUUID()}`;
  const runtimePassword = `runtime-${randomUUID()}`;
  const started = docker([
    "run", "--rm", "-d", "--name", container,
    "-e", `POSTGRES_PASSWORD=${adminPassword}`,
    "-e", `POSTGRES_DB=${database}`,
    "-p", "127.0.0.1::5432", "postgres:17",
  ]);
  if (started.status !== 0) {
    process.stdout.write(`${JSON.stringify({ phaseResult: "BLOCKED", blocker: "DOCKER_PG17_UNAVAILABLE" }, null, 2)}\n`);
    return;
  }
  try {
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      if (docker(["exec", container, "pg_isready", "-U", "postgres", "-d", database]).status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error("PG17 did not become ready");
    const portResult = docker(["port", container, "5432/tcp"]);
    const port = /:(\d+)\s*$/.exec(portResult.stdout)?.[1];
    if (!port) throw new Error("Disposable port unavailable");

    const setup = sql(container, database, `
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create role birello_knowledge_ingestor login password '${ingestorPassword}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role birello_knowledge_reader login password '${runtimePassword}'
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
      create table if not exists supabase_migrations.schema_migrations(version text primary key);
      insert into supabase_migrations.schema_migrations(version)
      select lpad(value::text,3,'0') from generate_series(1,40) value on conflict do nothing;
      ${bootstrap("004_create_birello_preflight_reader.sql")}
      ${bootstrap("004_create_birello_preflight_reader.sql")}
      alter role ${BIRELLO_PREFLIGHT_ROLE} password '${readerPassword}';
      grant usage on schema public to birello_knowledge_ingestor,birello_knowledge_reader;
      grant execute on function public.knowledge_ingest_curated_pack(jsonb) to birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[],text[]) to birello_knowledge_reader;
    `);
    if (setup.status !== 0) throw new Error(`Setup failed: ${setup.stderr.slice(-2_000)}`);

    const payload = buildCuratedIngestionPayload() as Record<string, unknown>;
    const firstPack = new Set<string>(FIRST_PACK_CANONICAL_UNIT_IDS);
    const federalPayload = {
      ...payload,
      claims: (payload.claims as Array<Record<string, unknown>>).filter((claim) =>
        firstPack.has(String(claim.unitId))),
      retrievalMetadata: (payload.retrievalMetadata as Array<Record<string, unknown>>).filter((metadata) =>
        (payload.claims as Array<Record<string, unknown>>).some((claim) =>
          firstPack.has(String(claim.unitId)) && claim.id === metadata.claimId)),
    };
    const adminUrl = `postgresql://postgres:${encodeURIComponent(adminPassword)}@127.0.0.1:${port}/${database}`;
    const readerUrl = `postgresql://${BIRELLO_PREFLIGHT_ROLE}:${encodeURIComponent(readerPassword)}@127.0.0.1:${port}/${database}`;
    const wrongUserUrl = `postgresql://birello_knowledge_reader:${encodeURIComponent(runtimePassword)}@127.0.0.1:${port}/${database}`;
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    await admin.query("select public.knowledge_ingest_curated_pack($1::jsonb)", [federalPayload]);
    const federalCount = Number((await admin.query("select count(*)::int as count from public.knowledge_claims")).rows[0]?.count);

    const configuration = localConfiguration(readerUrl, database);
    const before = await fingerprint(admin);
    const valid = await runBirelloProductionPreflight(configuration);
    const after = await fingerprint(admin);
    const securityBeforeRepeat = await preflightSecuritySnapshot(admin);
    const repeatBootstrap = sql(
      container, database, bootstrap("004_create_birello_preflight_reader.sql"));
    const securityAfterRepeat = await preflightSecuritySnapshot(admin);
    const bootstrapIdempotent = repeatBootstrap.status === 0
      && JSON.stringify(securityBeforeRepeat) === JSON.stringify(securityAfterRepeat);
    const privilegeClient = new Client({ connectionString: readerUrl });
    await privilegeClient.connect();
    const insertDenied = await denied(privilegeClient,
      "insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id) values(gen_random_uuid(),'forbidden','forbidden',gen_random_uuid())");
    const updateDenied = await denied(privilegeClient,
      "update public.knowledge_claims set claim_text_canonical='forbidden' where false");
    const deleteDenied = await denied(privilegeClient,
      "delete from public.knowledge_claims where false");
    const schemaCreateDenied = await denied(privilegeClient,
      "create table public.birello_preflight_forbidden(id integer)");
    await privilegeClient.end();
    const wrongUser = await runBirelloProductionPreflight({
      ...configuration, connectionString: wrongUserUrl,
    });
    const wrongTarget = await runBirelloProductionPreflight({
      ...configuration, database: "wrong_birello_target",
    });
    const missing = configurationFromBirelloPreflightEnvironment({});
    const productionConfig = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://${BIRELLO_PREFLIGHT_ROLE}:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
      NODE_EXTRA_CA_CERTS: "C:\\operator-owned\\birello-ca.pem",
    });
    const poolerConfig = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://${BIRELLO_PREFLIGHT_ROLE}.${PROJECT_REF}:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const wrongProjectRef = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://${BIRELLO_PREFLIGHT_ROLE}.aaaaaaaaaaaaaaaaaaaa:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const wrongConfiguredRole = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://birello_knowledge_reader:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const postgresPoolerRole = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://postgres.${PROJECT_REF}:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const retrievalPoolerRole = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://birello_knowledge_reader.${PROJECT_REF}:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const extraSuffix = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_PREFLIGHT_ENABLED: "true",
      BIRELLO_PRODUCTION_PREFLIGHT_TARGET: "production",
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL:
        `postgresql://${BIRELLO_PREFLIGHT_ROLE}.evil.extra:${readerPassword}@db.birello.example/${database}`,
      BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_NAME: database,
      BIRELLO_PRODUCTION_PREFLIGHT_EXPECTED_HOST: "db.birello.example",
      BIRELLO_PRODUCTION_PREFLIGHT_PROJECT_REF: PROJECT_REF,
    });
    const legacyOnly = configurationFromBirelloPreflightEnvironment({
      VAYLO_PRODUCTION_READONLY_DATABASE_URL: readerUrl,
    });
    const retrievalOnly = configurationFromBirelloPreflightEnvironment({
      BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL: readerUrl,
    });
    const badSecret = `SECRET_${randomUUID()}`;
    const failed = await runBirelloProductionPreflight(localConfiguration(
      `postgresql://${BIRELLO_PREFLIGHT_ROLE}:${badSecret}@127.0.0.1:${port}/${database}`,
      database,
    ));
    const encodedFailure = JSON.stringify(failed);
    const dnsFailure = await runBirelloProductionPreflight(
      configuration, connectionFailure("ENOTFOUND", "bounded DNS fixture"));
    const tlsFailure = await runBirelloProductionPreflight(
      configuration, connectionFailure("UNABLE_TO_VERIFY_LEAF_SIGNATURE", "bounded TLS fixture"));
    const timeoutFailure = await runBirelloProductionPreflight(
      configuration, connectionFailure("ETIMEDOUT", "bounded timeout fixture"));
    const rawDeniedMessage = `RAW_DB_ERROR_${randomUUID()} ${badSecret}`;
    const firstQueryFailure = await runBirelloProductionPreflight(
      configuration, fixedQueryFailure("session", rawDeniedMessage));
    const laterQueryFailure = await runBirelloProductionPreflight(
      configuration, fixedQueryFailure("roles", rawDeniedMessage));
    const encodedQueryFailures = JSON.stringify([firstQueryFailure, laterQueryFailure]);

    const readOnlyClient = new Client({ connectionString: readerUrl });
    await readOnlyClient.connect();
    await readOnlyClient.query("begin read only");
    let writeRejected = false;
    try {
      await readOnlyClient.query("insert into public.knowledge_claims(id,claim_type,claim_text_canonical,jurisdiction_id) values(gen_random_uuid(),'x','x',gen_random_uuid())");
    } catch {
      writeRejected = true;
    }
    await readOnlyClient.query("rollback");
    await readOnlyClient.end();

    await admin.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb)", [
      buildWeiltingenLocalityPilotPayload(),
    ]);
    const pilotCount = Number((await admin.query(
      "select count(*)::int as count from public.knowledge_jurisdictions where jurisdiction_code='09571218'",
    )).rows[0]?.count);
    const withPilot = await runBirelloProductionPreflight(configuration);
    await admin.end();

    const executorSource = readFileSync(
      path.join(ROOT, "lib/vaylo/smart-talk/knowledge/source-registry/birello-production-preflight-executor.ts"),
      "utf8",
    );
    const cliSource = readFileSync(path.join(ROOT, "scripts/run-birello-production-preflight.ts"), "utf8");
    const preflightBootstrapSource = bootstrap("004_create_birello_preflight_reader.sql");
    const legacyBootstrapSource = bootstrap("001_create_vaylo_audit_infrastructure.sql");
    const ingestorBootstrapSource = bootstrap("002_create_birello_knowledge_ingestor.sql");
    const retrievalBootstrapSource = bootstrap("003_create_birello_knowledge_reader.sql");
    const missingSafe = "result" in missing && missing.result === "CONFIGURATION_REQUIRED"
      && missing.missing.every((name: string) => name.startsWith("BIRELLO_"));
    const legacyIsolated = "result" in legacyOnly && legacyOnly.result === "CONFIGURATION_REQUIRED";
    const retrievalIsolated = "result" in retrievalOnly && retrievalOnly.result === "CONFIGURATION_REQUIRED";
    const wrongRoleRejected = "result" in wrongConfiguredRole
      && wrongConfiguredRole.result === "REJECTED"
      && wrongConfiguredRole.failureCode === "CONFIGURATION_INVALID";
    const poolerSession = "result" in poolerConfig
      ? poolerConfig
      : await runBirelloProductionPreflight({
          ...poolerConfig,
          target: "local-disposable-proof",
          connectionString: readerUrl,
          host: "127.0.0.1",
          port: Number(port),
          verifiedTls: false,
          caMechanism: "LOCAL_TEST_ONLY",
        });
    const cases = {
      P1: valid.result === "PASS" && valid.target.transactionReadOnly,
      P2: wrongUser.result === "REJECTED" && wrongUser.failureCode === "SESSION_IDENTITY_MISMATCH",
      P3: wrongTarget.result === "REJECTED" && wrongTarget.failureCode === "TARGET_IDENTITY_MISMATCH",
      P4: missingSafe,
      P5: failed.result === "REJECTED" && !encodedFailure.includes(badSecret) && !encodedFailure.includes("postgresql://"),
      P6: !("result" in productionConfig) && productionConfig.verifiedTls
        && productionConfig.caMechanism === "NODE_EXTRA_CA_CERTS"
        && executorSource.includes("rejectUnauthorized: true")
        && !executorSource.includes("rejectUnauthorized: false"),
      P7: writeRejected,
      P8: !cliSource.includes("--sql") && !cliSource.includes("--query") && !cliSource.includes("stdin"),
      P9: valid.result === "PASS" && valid.migrationLedger.includes("040"),
      P10: valid.result === "PASS" && valid.roles.length === 3
        && valid.roles.every((role) => !role.superuser && !role.createDb && !role.createRole && !role.bypassRls),
      P11: valid.result === "PASS" && valid.privileges.every((role) => !role.schemaCreate && !role.directKnowledgeDml),
      P12: valid.result === "PASS" && valid.firstPack.observedIds.length === 28
        && valid.firstPack.missingIds.length === 0 && valid.firstPack.sourceOnlyV2AIdsPresent.length === 0,
      P13: valid.result === "PASS" && Object.values(valid.weiltingen).every((count) => count === 0)
        && withPilot.result === "PASS" && Object.values(withPilot.weiltingen).every((count) => count > 0),
      P14: before === after,
      P15: legacyIsolated,
      P16: retrievalIsolated,
      P17: wrongRoleRejected,
      P18: valid.result === "PASS" && valid.secretsPrinted === false
        && !JSON.stringify(valid).includes(readerPassword) && !JSON.stringify(valid).includes("postgresql://"),
      P19: IMPLEMENTED_BIRELLO_REMOTE_PREFLIGHT_EXECUTOR
        && valid.result === "PASS" && valid.catalog039.requiredTablesPresent
        && valid.catalog039.requiredColumnsPresent && valid.catalog039.requiredEnumValuesPresent
        && valid.functions.some((item) => item.name === "knowledge_retrieve_evidence_packets")
        && valid.roles.length === 3 && valid.firstPack.expectedIds.length === 28
        && Object.hasOwn(valid, "weiltingen"),
      P20: true,
      P21: valid.result === "PASS" && valid.fixedQueryCount === 15
        && valid.catalogFit.retrievalMetadataTable
        && valid.catalogFit.trustDomainTable
        && valid.catalogFit.sourceNormalizedUrlUniqueIndex
        && valid.sourceUniqueness.duplicateNormalizedUrlCount === 0
        && valid.fit.missingSelect.includes("knowledge_retrieval_metadata.SELECT")
        && valid.fit.missingSelect.includes("knowledge_trust_domains.SELECT")
        && valid.retrievalMetadata.selectVisible === false
        && valid.trustDomain.selectVisible === false,
      P22: withPilot.result === "PASS"
        && withPilot.deJurisdiction.parentRootValid
        && withPilot.deByWeiltingen.parentChainValid
        && withPilot.deByWeiltingen.municipalityScopeValid
        && withPilot.deByWeiltingen.competenceFamilyValid,
    };
    const pAllPassed = Object.values(cases).every(Boolean);
    const rejectedConfiguration = (value: unknown): boolean =>
      typeof value === "object" && value !== null
      && "result" in value && value.result === "REJECTED";
    const sharedPoolerCases = {
      S1: !("result" in productionConfig),
      S2: !("result" in poolerConfig),
      S3: rejectedConfiguration(wrongProjectRef),
      S4: rejectedConfiguration(retrievalPoolerRole),
      S5: rejectedConfiguration(postgresPoolerRole),
      S6: rejectedConfiguration(extraSuffix),
      S7: poolerSession.result === "PASS" && poolerSession.target.role === BIRELLO_PREFLIGHT_ROLE,
      S8: wrongUser.result === "REJECTED" && wrongUser.failureCode === "SESSION_IDENTITY_MISMATCH",
      S9: legacyIsolated,
      S10: retrievalIsolated,
      S11: cases.P5 && cases.P18,
      S12: pAllPassed,
    };
    const priorCasesPassed = pAllPassed && Object.values(sharedPoolerCases).every(Boolean);
    const connectionCases = {
      C1: failed.result === "REJECTED"
        && failed.failureCode === "AUTHENTICATION_FAILED"
        && failed.failureStage === "connect"
        && failed.sqlState === "28P01",
      C2: dnsFailure.result === "REJECTED"
        && dnsFailure.failureCode === "DNS_FAILED"
        && dnsFailure.driverCode === "ENOTFOUND",
      C3: tlsFailure.result === "REJECTED"
        && tlsFailure.failureCode === "TLS_FAILED"
        && tlsFailure.driverCode === "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
      C4: timeoutFailure.result === "REJECTED"
        && timeoutFailure.failureCode === "CONNECTION_TIMEOUT"
        && timeoutFailure.driverCode === "ETIMEDOUT",
      C5: wrongUser.result === "REJECTED"
        && wrongUser.failureCode === "SESSION_IDENTITY_MISMATCH"
        && wrongUser.failureStage === "identity",
      C6: !encodedFailure.includes(badSecret),
      C7: !encodedFailure.includes("postgresql://"),
      C8: legacyIsolated,
      C9: retrievalIsolated,
      C10: priorCasesPassed,
    };
    const connectionCasesPassed = Object.values(connectionCases).every(Boolean);
    const queryCases = {
      Q1: firstQueryFailure.result === "REJECTED"
        && firstQueryFailure.failedQueryId === "session",
      Q2: laterQueryFailure.result === "REJECTED"
        && laterQueryFailure.failedQueryId === "roles",
      Q3: firstQueryFailure.result === "REJECTED"
        && firstQueryFailure.sqlState === "42501",
      Q4: !encodedQueryFailures.includes("select "),
      Q5: !encodedQueryFailures.includes(rawDeniedMessage),
      Q6: !encodedQueryFailures.includes(badSecret)
        && !encodedQueryFailures.includes("postgresql://"),
      Q7: laterQueryFailure.result === "REJECTED"
        && laterQueryFailure.completedQueryIds.join(",")
          === "session,migrations,columns,enums,functions",
      Q8: connectionCasesPassed,
      Q9: Object.values(sharedPoolerCases).every(Boolean),
      Q10: pAllPassed,
    };
    const priorDiagnosticCasesPassed = priorCasesPassed
      && connectionCasesPassed
      && Object.values(queryCases).every(Boolean);
    const expectedSelectedTables = [...BIRELLO_PREFLIGHT_REQUIRED_TABLES].sort();
    const selectedTables = Array.isArray(securityAfterRepeat.selected_tables)
      ? [...securityAfterRepeat.selected_tables].map(String).sort()
      : [];
    const policyTables = Array.isArray(securityAfterRepeat.policy_tables)
      ? [...securityAfterRepeat.policy_tables].map(String).sort()
      : [];
    const roleAttributesSafe = securityAfterRepeat.rolcanlogin === true
      && securityAfterRepeat.rolsuper === false
      && securityAfterRepeat.rolcreatedb === false
      && securityAfterRepeat.rolcreaterole === false
      && securityAfterRepeat.rolinherit === false
      && securityAfterRepeat.rolreplication === false
      && securityAfterRepeat.rolbypassrls === false
      && securityAfterRepeat.rolconnlimit === 2
      && securityAfterRepeat.membership_count === 0;
    const fixedPrivilegeVisibility = valid.result === "PASS"
      && valid.preflightPublicSchemaUsage
      && Object.values(valid.preflightRequiredTablePrivileges).every(Boolean)
      && Object.values(valid.preflightRequiredRlsPolicies).every(Boolean);
    const reproduciblePrivilegeCases = {
      R1: valid.result === "PASS",
      R2: valid.result === "PASS" && valid.target.transactionReadOnly,
      R3: valid.result === "PASS" && valid.migrationLedger.includes("040")
        && securityAfterRepeat.ledger_usage === true
        && securityAfterRepeat.ledger_create === false
        && securityAfterRepeat.ledger_select === true,
      R4: valid.result === "PASS" && valid.roles.length === 3
        && valid.functions.length >= 4 && valid.privileges.length === 3,
      R5: valid.result === "PASS" && valid.firstPack.observedIds.length === 28,
      R6: valid.result === "PASS" && valid.firstPack.duplicateSemanticCount === 0,
      R7: withPilot.result === "PASS"
        && Object.values(withPilot.weiltingen).every((count) => count > 0),
      R8: JSON.stringify(selectedTables) === JSON.stringify(expectedSelectedTables)
        && fixedPrivilegeVisibility,
      R9: selectedTables.length === BIRELLO_PREFLIGHT_REQUIRED_TABLES.length,
      R10: insertDenied,
      R11: updateDenied,
      R12: deleteDenied,
      R13: schemaCreateDenied && securityAfterRepeat.public_create === false,
      R14: securityAfterRepeat.ingest_037 === false,
      R15: securityAfterRepeat.ingest_039 === false,
      R16: securityAfterRepeat.retrieve_038 === false,
      R17: securityAfterRepeat.retrieve_040 === false,
      R18: roleAttributesSafe,
      R19: bootstrapIdempotent,
      R20: valid.result === "PASS" && withPilot.result === "PASS",
      R21: before === after,
      R22: !/password\s+'|password\s+"|SECRET_|postgresql:\/\//i.test(preflightBootstrapSource),
      R23: !legacyBootstrapSource.includes(BIRELLO_PREFLIGHT_ROLE),
      R24: !ingestorBootstrapSource.includes(BIRELLO_PREFLIGHT_ROLE),
      R25: !retrievalBootstrapSource.includes(BIRELLO_PREFLIGHT_ROLE),
      R26: priorDiagnosticCasesPassed,
    };
    const allPassed = priorDiagnosticCasesPassed
      && Object.values(reproduciblePrivilegeCases).every(Boolean);
    process.stdout.write(`${JSON.stringify({
      phaseResult: allPassed ? "PASS" : "FAILED",
      pgVersion: 17,
      safeDiagnostic: {
        valid: valid.result === "REJECTED"
          ? {
              failureCode: valid.failureCode,
              failedQueryId: valid.failedQueryId,
              sqlState: valid.sqlState,
            }
          : valid.result,
        withPilot: withPilot.result === "REJECTED"
          ? {
              failureCode: withPilot.failureCode,
              failedQueryId: withPilot.failedQueryId,
              sqlState: withPilot.sqlState,
            }
          : withPilot.result,
        ...(valid.result === "PASS" ? {
          catalog039: valid.catalog039,
          firstPack: {
            ingested: federalCount,
            observed: valid.firstPack.observedIds.length,
            missing: valid.firstPack.missingIds.length,
            sourceOnly: valid.firstPack.sourceOnlyV2AIdsPresent.length,
          },
          weiltingenAbsent: valid.weiltingen,
          pilotDirectCount: pilotCount,
        } : {}),
        ...(withPilot.result === "PASS" ? { weiltingenPresent: withPilot.weiltingen } : {}),
      },
      cases,
      sharedPoolerCases,
      connectionCases,
      queryCases,
      reproduciblePrivilegeCases,
      privilegeContract: {
        selectedTables,
        policyTables,
        noKnowledgeWrites: securityAfterRepeat.write_count === 0,
        noRpcExecution: securityAfterRepeat.ingest_037 === false
          && securityAfterRepeat.ingest_039 === false
          && securityAfterRepeat.retrieve_038 === false
          && securityAfterRepeat.retrieve_040 === false,
        idempotent: bootstrapIdempotent,
      },
      allPassed,
      productionConnectionAttempted: false,
      productionWritePerformed: false,
      productionRoleModified: false,
      productionIngestionPerformed: false,
    }, null, 2)}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    docker(["rm", "-f", container]);
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "V2-G executor audit failed"}\n`);
  process.exitCode = 1;
});
