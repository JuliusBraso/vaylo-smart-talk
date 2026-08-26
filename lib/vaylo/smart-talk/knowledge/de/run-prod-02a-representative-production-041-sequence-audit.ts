/**
 * REPRESENTATIVE_PRODUCTION_041_BASELINE.
 *
 * Real execution: committed Knowledge migrations 032-035 and 037-041.
 * Fixture/bootstrap representation: unrelated ledger history 001-031 and
 * migration 036 are represented in the migration ledger; bounded production
 * roles, grants, and preflight SELECT policies are reproduced explicitly.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { Client } from "pg";

import {
  BIRELLO_FIT_VISIBILITY_TABLES,
} from "../source-registry/birello-production-maintenance-executor";
import {
  BIRELLO_PREFLIGHT_REQUIRED_TABLES,
  BIRELLO_PREFLIGHT_ROLE,
  type BirelloPreflightConfiguration,
} from "../source-registry/birello-production-preflight-executor";
import {
  runBirelloMigration,
  type BirelloMigrationConfiguration,
} from "../source-registry/birello-production-migration-executor";
import {
  runBirelloMigrationReadOnlyProof,
  type BirelloMigrationProofConfiguration,
} from "../source-registry/birello-production-migration-proof";
import {
  buildCuratedIngestionPayload,
} from "../packs/de/anmeldung-ummeldung-abmeldung/curated-ingestion-payload";
import {
  buildWeiltingenLocalityPilotPayload,
} from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";
import {
  runCityStateProductionIngestion,
  type CityStateIngestionConfiguration,
} from "../packs/de/anmeldung-ummeldung-abmeldung/production-city-state-service-area-ingestion";
import {
  runCityStateContextProductionProof,
} from "../packs/de/anmeldung-ummeldung-abmeldung/production-city-state-context-proof";
import {
  type AnmeldungContextProofConfiguration,
} from "../packs/de/anmeldung-ummeldung-abmeldung/production-anmeldung-context-proof";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "prod02a_representative_041";
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const CONTAINER = `moja-prod02a-${process.pid}-${randomUUID().slice(0, 8)}`;
const ADMIN_PASSWORD = `admin-${randomUUID()}`;
const ROLE_PASSWORD = `role-${randomUUID()}`;
const KNOWLEDGE_MIGRATIONS = [
  "032_create_minimal_knowledge_schema.sql",
  "033_add_publication_and_canonical_translation_schema.sql",
  "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "035_add_official_source_registry_and_handling_mode_contract.sql",
  "037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "038_add_curated_knowledge_retrieval_rpc.sql",
  "039_add_curated_locality_pack_ingestion_rpc.sql",
  "040_add_anmeldung_context_retrieval_rpc.sql",
  "041_add_generalized_curated_knowledge_ingestion.sql",
] as const;

function run(args: readonly string[], input?: string, timeout = 240_000) {
  return spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout, input,
    maxBuffer: 32 * 1024 * 1024,
  });
}

function psql(text: string) {
  return run([
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-A", "-t",
  ], text);
}

function applyMigration(name: string): void {
  const local = path.join(ROOT, "supabase", "migrations", name);
  const remote = `/tmp/${name}`;
  const copied = run(["cp", local, `${CONTAINER}:${remote}`]);
  if (copied.status !== 0) throw new Error(`copy failed: ${name}`);
  const applied = run([
    "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-f", remote,
  ]);
  if (applied.status !== 0) {
    throw new Error(`migration failed ${name}: ${applied.stderr.slice(-2_000)}`);
  }
}

function migrationConfiguration(
  url: string,
  authorizedMigration: "042" | "043" | null,
): BirelloMigrationConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: url,
    host: "127.0.0.1",
    port: Number(new URL(url).port),
    database: DATABASE,
    projectRef: PROJECT_REF,
    expectedUser: "postgres",
    verifiedTls: false,
    authorizedMigration,
  });
}

function cityConfiguration(url: string): CityStateIngestionConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString: url,
    host: "127.0.0.1",
    port: Number(new URL(url).port),
    database: DATABASE,
    projectRef: PROJECT_REF,
    expectedWriter: "birello_knowledge_ingestor",
    verifiedTls: false,
    authorizedForApply: true,
  });
}

function proofConfiguration(
  preflightUrl: string,
  readerUrl: string,
): BirelloMigrationProofConfiguration {
  const preflight: BirelloPreflightConfiguration = Object.freeze({
    target: "local-disposable-proof",
    connectionString: preflightUrl,
    host: "127.0.0.1",
    port: Number(new URL(preflightUrl).port),
    database: DATABASE,
    user: BIRELLO_PREFLIGHT_ROLE,
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
  });
  const reader: AnmeldungContextProofConfiguration = Object.freeze({
    target: "local-disposable-proof",
    connectionString: readerUrl,
    host: "127.0.0.1",
    port: Number(new URL(readerUrl).port),
    database: DATABASE,
    projectRef: PROJECT_REF,
    expectedReader: "birello_knowledge_reader",
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
  });
  return Object.freeze({ preflight, reader });
}

async function state(client: Client): Promise<Record<string, unknown>> {
  const query = await client.query(`select
    (select count(*)::int from public.knowledge_claims c
      join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
      where j.jurisdiction_level='de_federal' and j.jurisdiction_code='DE')
      federal_claims,
    (select count(*)::int from public.knowledge_retrieval_metadata rm
      join public.knowledge_claims c
        on rm.entity_type='claim' and rm.entity_id=c.id
      join public.knowledge_jurisdictions j on j.id=c.jurisdiction_id
      where j.jurisdiction_level='de_federal' and j.jurisdiction_code='DE')
      federal_metadata,
    (select count(*)::int from public.knowledge_jurisdictions
      where jurisdiction_level='de_gemeinde' and jurisdiction_code='09571218')
      weiltingen,
    (select count(*)::int from public.knowledge_authority_competences c
      join public.knowledge_territorial_scopes s on s.id=c.territorial_scope_id
      where s.municipality_codes=array['09571218']) weiltingen_competence,
    (select pg_catalog.md5(jsonb_agg(to_jsonb(x) order by x.role)::text) from (
      select r.rolname role,r.rolsuper,r.rolcreatedb,r.rolcreaterole,
        r.rolreplication,r.rolbypassrls,
        pg_catalog.has_schema_privilege(r.rolname,'public','CREATE') schema_create,
        pg_catalog.has_function_privilege(r.rolname,
          'public.knowledge_ingest_curated_service_area_pack(jsonb)','EXECUTE') g4,
        pg_catalog.has_function_privilege(r.rolname,
          'public.knowledge_retrieve_anmeldung_context(uuid[],text)','EXECUTE') rpc040
      from pg_catalog.pg_roles r where r.rolname in
        ('birello_knowledge_ingestor','birello_knowledge_reader',
          '${BIRELLO_PREFLIGHT_ROLE}')
    ) x) privilege_fingerprint`);
  return query.rows[0]!;
}

function pass(report: Readonly<Record<string, unknown>>): boolean {
  return report.result === "PASS";
}

async function main(): Promise<void> {
  const started = run([
    "run", "--rm", "-d", "--name", CONTAINER,
    "-e", `POSTGRES_PASSWORD=${ADMIN_PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", IMAGE,
  ]);
  if (started.status !== 0) {
    process.stdout.write(JSON.stringify({
      phaseResult: "BLOCKED", blocker: "DOCKER_PG17_UNAVAILABLE",
    }, null, 2));
    return;
  }
  let admin: Client | undefined;
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (run(["exec", CONTAINER, "pg_isready", "-U", "postgres", "-d", DATABASE])
        .status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!ready) throw new Error("PostgreSQL 17 unavailable");

    const roles = psql(`
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create role birello_knowledge_ingestor login password
        '${ROLE_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role birello_knowledge_reader login password
        '${ROLE_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
      create role ${BIRELLO_PREFLIGHT_ROLE} login password
        '${ROLE_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls;
    `);
    if (roles.status !== 0) throw new Error(`role setup failed: ${roles.stderr}`);
    for (const migration of KNOWLEDGE_MIGRATIONS) applyMigration(migration);

    const visibleTables = [
      ...BIRELLO_PREFLIGHT_REQUIRED_TABLES,
      ...BIRELLO_FIT_VISIBILITY_TABLES,
    ];
    const bootstrap = psql(`
      create schema supabase_migrations;
      create table supabase_migrations.schema_migrations(version text primary key);
      insert into supabase_migrations.schema_migrations(version)
        select lpad(value::text,3,'0') from generate_series(1,41) value;
      grant connect on database ${DATABASE} to birello_knowledge_ingestor,
        birello_knowledge_reader,${BIRELLO_PREFLIGHT_ROLE};
      grant usage on schema public to birello_knowledge_ingestor,
        birello_knowledge_reader,${BIRELLO_PREFLIGHT_ROLE};
      grant usage on schema supabase_migrations to birello_knowledge_ingestor,
        ${BIRELLO_PREFLIGHT_ROLE};
      grant select on supabase_migrations.schema_migrations
        to birello_knowledge_ingestor,${BIRELLO_PREFLIGHT_ROLE};
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_service_area_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[],text[])
        to birello_knowledge_reader;
      grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[],text)
        to birello_knowledge_reader;
      ${visibleTables.map((table) => `
        grant select on table public.${table} to ${BIRELLO_PREFLIGHT_ROLE};
        create policy birello_preflight_reader_select on public.${table}
          for select to ${BIRELLO_PREFLIGHT_ROLE} using (true);
      `).join("\n")}
    `);
    if (bootstrap.status !== 0) {
      throw new Error(`bootstrap failed: ${bootstrap.stderr.slice(-2_000)}`);
    }

    const port = /:(\d+)\s*$/u.exec(
      run(["port", CONTAINER, "5432/tcp"]).stdout,
    )?.[1];
    if (!port) throw new Error("disposable port missing");
    const url = (role: string, password: string) =>
      `postgresql://${role}:${encodeURIComponent(password)}@127.0.0.1:${port}/${DATABASE}`;
    const adminUrl = url("postgres", ADMIN_PASSWORD);
    const ingestorUrl = url("birello_knowledge_ingestor", ROLE_PASSWORD);
    const readerUrl = url("birello_knowledge_reader", ROLE_PASSWORD);
    const preflightUrl = url(BIRELLO_PREFLIGHT_ROLE, ROLE_PASSWORD);
    admin = new Client({ connectionString: adminUrl });
    const ingestor = new Client({ connectionString: ingestorUrl });
    await admin.connect();
    await ingestor.connect();
    await ingestor.query(
      "select public.knowledge_ingest_curated_pack($1::jsonb)",
      [buildCuratedIngestionPayload()],
    );
    await ingestor.query(
      "select public.knowledge_ingest_curated_locality_pack($1::jsonb)",
      [buildWeiltingenLocalityPilotPayload()],
    );
    await ingestor.end();

    const baseline = await state(admin);
    const migration042 = migrationConfiguration(adminUrl, "042");
    const migration043 = migrationConfiguration(adminUrl, "043");
    const proof = proofConfiguration(preflightUrl, readerUrl);
    const city = cityConfiguration(ingestorUrl);

    const validate042 = await runBirelloMigration(migration042, "042", "validate");
    const apply042 = await runBirelloMigration(migration042, "042", "apply");
    const proof042 = await runBirelloMigrationReadOnlyProof(
      proof, "042", "execute-read-only",
    );
    const replay042 = await runBirelloMigration(migration042, "042", "apply");
    const validate043 = await runBirelloMigration(migration043, "043", "validate");
    const apply043 = await runBirelloMigration(migration043, "043", "apply");
    const proof043 = await runBirelloMigrationReadOnlyProof(
      proof, "043", "execute-read-only",
    );
    const replay043 = await runBirelloMigration(migration043, "043", "apply");

    const cityReports: Record<string, unknown> = {};
    const firstCounts: Record<string, number> = {};
    const secondCounts: Record<string, number> = {};
    for (const target of ["berlin", "bremen", "hamburg"] as const) {
      const validate = await runCityStateProductionIngestion(
        city, target, "validate",
      );
      const first = await runCityStateProductionIngestion(city, target, "apply");
      const context = await runCityStateContextProductionProof(
        proof.reader, target, "execute-read-only",
      );
      const second = await runCityStateProductionIngestion(city, target, "apply");
      firstCounts[target] = Number(first.semanticCreated);
      secondCounts[target] = Number(second.semanticCreated);
      cityReports[target] = { validate, first, context, second };
    }
    const finalState = await state(admin);
    const checks = {
      representativeBaseline:
        Number(baseline.federal_claims) === 41
        && Number(baseline.federal_metadata) === 41
        && Number(baseline.weiltingen) === 1
        && Number(baseline.weiltingen_competence) === 1,
      migration042: pass(validate042) && pass(apply042) && pass(proof042),
      migration042Replay:
        replay042.result === "REJECTED"
        && replay042.failureCode === "ALREADY_APPLIED",
      migration043: pass(validate043) && pass(apply043) && pass(proof043),
      migration043Replay:
        replay043.result === "REJECTED"
        && replay043.failureCode === "ALREADY_APPLIED",
      citySequence: Object.values(cityReports).every((entry) => {
        const reports = entry as Record<string, Record<string, unknown>>;
        return pass(reports.validate!) && pass(reports.first!)
          && pass(reports.context!) && pass(reports.second!);
      }),
      firstCounts: firstCounts.berlin === 15 && firstCounts.bremen === 16
        && firstCounts.hamburg === 15,
      replayCounts: Object.values(secondCounts).every((count) => count === 0),
      federalUnchanged:
        finalState.federal_claims === baseline.federal_claims,
      metadataUnchanged:
        finalState.federal_metadata === baseline.federal_metadata,
      weiltingenUnchanged:
        finalState.weiltingen === baseline.weiltingen
        && finalState.weiltingen_competence === baseline.weiltingen_competence,
      privilegesUnchanged:
        finalState.privilege_fingerprint === baseline.privilege_fingerprint,
      bremerhavenNegative:
        (cityReports.bremen as Record<string, Record<string, unknown>>)
          .context?.bremerhavenRejected === true,
    };
    const allPassed = Object.values(checks).every(Boolean);
    process.stdout.write(`${JSON.stringify({
      phaseResult: allPassed ? "PASS" : "FAILED",
      baseline: {
        name: "REPRESENTATIVE_PRODUCTION_041_BASELINE",
        realMigrationsExecuted: KNOWLEDGE_MIGRATIONS,
        fixtureRepresentedLedger: "001-041",
        fixtureRepresentedMigrations: ["001-031", "036"],
        state: baseline,
      },
      sequence: {
        validate042, apply042, proof042, replay042,
        validate043, apply043, proof043, replay043,
        firstCounts, secondCounts, cityReports,
      },
      checks,
      productionConnectionAttempted: false,
      productionMutationPerformed: false,
      allPassed,
    }, null, 2)}\n`);
    if (!allPassed) process.exitCode = 1;
  } finally {
    if (admin) await admin.end().catch(() => undefined);
    run(["rm", "-f", CONTAINER]);
  }
}

void main().catch((error: unknown) => {
  run(["rm", "-f", CONTAINER]);
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    message: error instanceof Error
      ? error.message.replace(/postgres(?:ql)?:\/\/\S+/giu, "[redacted]")
      : "REPRESENTATIVE_SEQUENCE_FAILED",
    productionConnectionAttempted: false,
  }, null, 2)}\n`);
  process.exitCode = 1;
});
