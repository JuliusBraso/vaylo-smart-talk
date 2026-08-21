/**
 * V2-B locality/authority-competence curated ingestion contract.
 * Disposable PostgreSQL 17 only. No production connection or ingestion.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { buildSyntheticLocalityIngestionPayload } from "./curated-locality-ingestion-payload";
import { FIRST_PACK_CANONICAL_UNIT_IDS, CANONICAL_UNITS } from "./pack";

const IMAGE = "postgres:17";
const DB = "v2b_locality";
const PASSWORD = `v2b-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-v2b-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
] as const;
const RPC = "public.knowledge_ingest_curated_locality_pack(jsonb)";
const FEDERAL_RPC = "public.knowledge_ingest_curated_pack(jsonb)";
const CONTROLLED =
  "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/controlled-runtime-retrieval.ts";
const MIGRATION_037 = "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql";
const MIGRATION_038 = "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql";
const MIGRATION_039 = "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql";

function run(file: string, args: string[], timeout = 120_000): { code: number; stdout: string; stderr: string } {
  const out = spawnSync(file, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 16 * 1024 * 1024,
  });
  return {
    code: out.status ?? (out.error ? 1 : 0),
    stdout: out.stdout ?? "",
    stderr: `${out.stderr ?? ""}${out.error ? `\n${out.error.message}` : ""}`,
  };
}

function sql(text: string, timeout = 120_000): { code: number; stdout: string; stderr: string } {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
    "-v", "ON_ERROR_STOP=1", "-P", "pager=off", "-A", "-t", "-c", text,
  ], timeout);
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

async function rejected(client: Client, payload: unknown): Promise<boolean> {
  try {
    await client.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb)", [payload]);
    return false;
  } catch {
    return true;
  }
}

async function denied(client: Client, text: string): Promise<boolean> {
  try {
    await client.query(text);
    return false;
  } catch {
    return true;
  }
}

function staticChecks(): Record<string, boolean> {
  const rpcSql = fs.readFileSync(path.join(process.cwd(), MIGRATION_039), "utf8");
  const controlled = fs.readFileSync(path.join(process.cwd(), CONTROLLED), "utf8");
  const bootstrap = fs.readFileSync(
    path.join(process.cwd(), "supabase/bootstrap/002_create_birello_knowledge_ingestor.sql"),
    "utf8",
  );
  return {
    noNewTables: !/create table/i.test(rpcSql),
    securityDefiner: /security definer/i.test(rpcSql),
    searchPath: /set search_path = pg_catalog, public/.test(rpcSql),
    noDynamicSql: !/execute\s+(format|pg_catalog\.format)/i.test(rpcSql) && !/\bexecute\s+v_/i.test(rpcSql),
    revokePublic: /revoke all on function public\.knowledge_ingest_curated_locality_pack\(jsonb\)/.test(rpcSql)
      && /from public, anon, authenticated, service_role/.test(rpcSql),
    packBound: rpcSql.includes("'anmeldung_ummeldung_abmeldung'")
      && rpcSql.includes("'residence_registration_lifecycle'"),
    noPilotHardcode: !/weiltingen|ansbach|de-by/i.test(rpcSql),
    allowlistPresent: rpcSql.includes("'packId','family','countryCode'"),
    competenceExplicit: rpcSql.includes("knowledge_authority_competences")
      && !/proximity|latitud|longitud|nearest/i.test(rpcSql),
    bootstrapGrant: bootstrap.includes("knowledge_ingest_curated_locality_pack(jsonb)"),
    migration037Untouched: !fs.readFileSync(path.join(process.cwd(), MIGRATION_037), "utf8").includes("knowledge_ingest_curated_locality_pack"),
    migration038Untouched: fs.readFileSync(path.join(process.cwd(), MIGRATION_038), "utf8").includes("knowledge_retrieve_evidence_packets")
      && !fs.readFileSync(path.join(process.cwd(), MIGRATION_038), "utf8").includes("knowledge_ingest_curated_locality_pack"),
    sourceUnits41: CANONICAL_UNITS.length === 41,
    deployedUnits28: FIRST_PACK_CANONICAL_UNIT_IDS.length === 28
      && FIRST_PACK_CANONICAL_UNIT_IDS.every((id) => CANONICAL_UNITS.some((unit) => unit.id === id)),
    controlledSelector28: controlled.includes("FIRST_PACK_CANONICAL_UNIT_IDS")
      && controlled.includes("PRODUCTION_DEPLOYED_UNIT_IDS")
      && /PRODUCTION_DEPLOYED_UNITS\.map/.test(controlled),
  };
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = {};
  const staticResult = staticChecks();
  Object.assign(cases, {
    staticNoNewTables: staticResult.noNewTables,
    staticSecurity: staticResult.securityDefiner && staticResult.searchPath && staticResult.noDynamicSql && staticResult.revokePublic,
    staticPackBound: staticResult.packBound && staticResult.noPilotHardcode && staticResult.allowlistPresent,
    staticCompetence: staticResult.competenceExplicit,
    staticBootstrap: staticResult.bootstrapGrant,
    B12: staticResult.sourceUnits41 && staticResult.deployedUnits28 && staticResult.controlledSelector28
      && staticResult.migration037Untouched && staticResult.migration038Untouched,
  });

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.code !== 0) {
    process.stdout.write(`${JSON.stringify({ result: "BLOCKED", reason: "docker unavailable", cases }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=v2-b",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  try {
    if (created.code !== 0) throw new Error(`container start failed: ${created.stderr}`);
    let ready = false;
    let consecutive = 0;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const probe = sql("select current_database();", 5_000);
      if (probe.code === 0 && probe.stdout.trim() === DB) {
        consecutive += 1;
        if (consecutive >= 3) {
          ready = true;
          break;
        }
      } else {
        consecutive = 0;
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (!ready) throw new Error("postgres not ready");

    const roleBootstrap = sql(`
      create role anon nologin nosuperuser nobypassrls;
      create role authenticated nologin nosuperuser nobypassrls;
      create role service_role nologin nosuperuser nobypassrls;
    `);
    if (roleBootstrap.code !== 0) throw new Error(roleBootstrap.stderr);

    for (const [index, file] of MIGRATIONS.entries()) {
      const target = `/tmp/m${index}.sql`;
      const copied = run("docker", ["cp", path.join(process.cwd(), file), `${CONTAINER}:${target}`]);
      if (copied.code !== 0) throw new Error(`copy ${file} failed`);
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.code !== 0) throw new Error(`apply ${file} failed: ${applied.stderr.slice(-1500)}`);
    }

    const escapedPassword = INGESTOR_PASSWORD.replaceAll("'", "''");
    const roleSql = sql(`
      create role birello_knowledge_ingestor login nosuperuser nocreatedb nocreaterole
        noinherit noreplication nobypassrls connection limit 2 password '${escapedPassword}';
      grant connect on database ${DB} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function ${FEDERAL_RPC} to birello_knowledge_ingestor;
      grant execute on function ${RPC} to birello_knowledge_ingestor;
    `);
    if (roleSql.code !== 0) throw new Error(roleSql.stderr);

    const portLine = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim();
    const port = portLine.split(":").at(-1);
    if (!port) throw new Error("missing published port");
    const adminUrl = `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const ingestorUrl = `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    admin = new Client({ connectionString: adminUrl });
    ingestor = new Client({ connectionString: ingestorUrl });
    await admin.connect();
    await ingestor.connect();

    const catalog = await admin.query(
      `select prosecdef as security_definer,
              (select setconfig from pg_catalog.pg_db_role_setting s where s.setrole=p.oid limit 1) is null as ignored,
              pg_catalog.obj_description(p.oid, 'pg_proc') as comment
         from pg_catalog.pg_proc p
         join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname='knowledge_ingest_curated_locality_pack'`,
    );
    const searchPath = await admin.query(
      `select pg_catalog.pg_get_functiondef(p.oid) as def
         from pg_catalog.pg_proc p
         join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname='knowledge_ingest_curated_locality_pack'`,
    );
    const def = String(searchPath.rows[0]?.def ?? "");
    cases.rpcExists = catalog.rows.length === 1 && catalog.rows[0]?.security_definer === true
      && /search_path/i.test(def) && /pg_catalog/i.test(def) && /public/i.test(def);
    const rpcGrantRow = (await admin.query(
      `select
         has_function_privilege('birello_knowledge_ingestor', $1, 'EXECUTE') as ingestor_ok,
         not has_function_privilege('anon', $1, 'EXECUTE') as anon_denied,
         not has_function_privilege('authenticated', $1, 'EXECUTE') as authenticated_denied,
         not has_function_privilege('service_role', $1, 'EXECUTE') as service_role_denied`,
      [RPC],
    )).rows[0];
    cases.rpcGrants = rpcGrantRow?.ingestor_ok === true
      && rpcGrantRow?.anon_denied === true
      && rpcGrantRow?.authenticated_denied === true
      && rpcGrantRow?.service_role_denied === true;

    const unrelatedExecute = await ingestor.query(
      `select coalesce(bool_and(not has_function_privilege(current_user,p.oid,'EXECUTE')), true) as denied
         from pg_catalog.pg_proc p
         join pg_catalog.pg_namespace n on n.oid=p.pronamespace
        where n.nspname='public' and p.proname in ('knowledge_register_official_source','knowledge_bootstrap_publication_subject')`,
    );
    const privilegeDenied = {
      directInsert: await denied(ingestor, "insert into public.knowledge_authorities(id) values('00000000-0000-4000-8000-000000000001')"),
      directSelect: await denied(ingestor, "select * from public.knowledge_authority_competences"),
      createTable: await denied(ingestor, "create table public.v2b_forbidden(id integer)"),
      createSchema: await denied(ingestor, "create schema v2b_forbidden"),
      unrelatedRpc: unrelatedExecute.rows[0]?.denied === true,
    };
    cases.B9 = Object.values(privilegeDenied).every(Boolean)
      && (await ingestor.query(
        "select has_schema_privilege(current_user,'public','CREATE') as c",
      )).rows[0]?.c === false;

    const federal = await ingestor.query("select public.knowledge_ingest_curated_pack($1::jsonb) as result", [buildCuratedIngestionPayload()]);
    const federalRepeat = await ingestor.query("select public.knowledge_ingest_curated_pack($1::jsonb) as result", [buildCuratedIngestionPayload()]);
    const federalCreated = Number((federal.rows[0]?.result as { semanticCreated?: number })?.semanticCreated ?? -1);
    const federalRepeatCreated = Number((federalRepeat.rows[0]?.result as { semanticCreated?: number })?.semanticCreated ?? -1);
    const federalClaims = Number((await admin.query("select count(*)::int as n from public.knowledge_claims")).rows[0]?.n ?? -1);
    cases.B11 = federalCreated > 0 && federalRepeatCreated === 0 && federalClaims === 41;

    const payload = buildSyntheticLocalityIngestionPayload() as Record<string, unknown>;
    const first = await ingestor.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result", [payload]);
    const firstResult = first.rows[0]?.result as Record<string, unknown>;
    const counts = await admin.query(
      `select
         (select count(*)::int from public.knowledge_jurisdictions where id=$1) as locality,
         (select count(*)::int from public.knowledge_authorities where id=$2) as authority,
         (select count(*)::int from public.knowledge_authority_competences where id=$3) as competence,
         (select jsonb_build_object(
            'authority_id', authority_id,
            'territorial_scope_id', territorial_scope_id,
            'subject_matter', subject_matter,
            'personal_scope', personal_scope,
            'effective_from', effective_from
          ) from public.knowledge_authority_competences where id=$3) as competence_row,
         (select default_handling_mode::text from public.knowledge_sources where id=$4) as source_handling,
         (select count(*)::int from public.knowledge_source_handling_policies where source_id=$4) as handling_count,
         (select count(*)::int from public.knowledge_processes where id=$5) as process_row`,
      [
        (payload.locality as { id: string }).id,
        (payload.authority as { id: string }).id,
        (payload.competence as { id: string }).id,
        (payload.source as { id: string }).id,
        (payload.processBinding as { id: string }).id,
      ],
    );
    const competenceRow = counts.rows[0]?.competence_row as Record<string, unknown> | null;
    cases.B1 = Number(firstResult?.semanticCreated) > 0
      && counts.rows[0]?.locality === 1
      && counts.rows[0]?.authority === 1
      && counts.rows[0]?.competence === 1
      && counts.rows[0]?.process_row === 1
      && counts.rows[0]?.handling_count === 3
      && counts.rows[0]?.source_handling === "CACHE_AND_REVALIDATE"
      && competenceRow?.subject_matter === "residence_registration_lifecycle"
      && competenceRow?.personal_scope === "residence_registration_lifecycle"
      && String(competenceRow?.authority_id) === (payload.authority as { id: string }).id
      && String(competenceRow?.territorial_scope_id) === (payload.territorialScope as { id: string }).id;

    const repeat = await ingestor.query("select public.knowledge_ingest_curated_locality_pack($1::jsonb) as result", [payload]);
    const afterRepeat = await admin.query(
      `select
         (select count(*)::int from public.knowledge_authorities where authority_name=$1) as authorities,
         (select count(*)::int from public.knowledge_authority_competences where authority_id=$2) as competences`,
      [
        (payload.authority as { name: string }).name,
        (payload.authority as { id: string }).id,
      ],
    );
    cases.B2 = Number((repeat.rows[0]?.result as { semanticCreated?: number })?.semanticCreated) === 0
      && afterRepeat.rows[0]?.authorities === 1
      && afterRepeat.rows[0]?.competences === 1;

    const conflicting = clone(payload);
    (conflicting.authority as Record<string, unknown>).name = "Conflicting synthetic authority";
    const originalName = await admin.query(
      "select authority_name from public.knowledge_authorities where id=$1",
      [(payload.authority as { id: string }).id],
    );
    cases.B3 = await rejected(ingestor, conflicting)
      && originalName.rows[0]?.authority_name === (payload.authority as { name: string }).name;

    const missingSource = clone(payload);
    (missingSource.source as Record<string, unknown>).canonicalUrl = "";
    (missingSource.source as Record<string, unknown>).officialDomain = "";
    cases.B4 = await rejected(ingestor, missingSource);

    const ambiguous = clone(payload);
    (ambiguous.locality as Record<string, unknown>).municipalityCode = "";
    (ambiguous.locality as Record<string, unknown>).name = "Neustadt";
    (ambiguous.locality as Record<string, unknown>).districtCode = "";
    (ambiguous.locality as Record<string, unknown>).parentJurisdictionId =
      (ambiguous.landJurisdiction as { id: string }).id;
    ambiguous.districtJurisdiction = null;
    cases.B5 = await rejected(ingestor, ambiguous);

    const wrongCountry = clone(payload);
    wrongCountry.countryCode = "SK";
    (wrongCountry.locality as Record<string, unknown>).countryCode = "SK";
    cases.B6 = await rejected(ingestor, wrongCountry);

    const unknownCompetence = clone(payload);
    (unknownCompetence.competence as Record<string, unknown>).subjectMatter = "parking";
    cases.B7 = await rejected(ingestor, unknownCompetence);

    cases.B8 = cases.B1 === true
      && competenceRow?.subject_matter === "residence_registration_lifecycle"
      && String(competenceRow?.authority_id) === (payload.authority as { id: string }).id
      && !/latitude|longitude|nearest address|proximity/i.test(JSON.stringify(payload));

    const beforeAtomic = await admin.query("select count(*)::int as n from public.knowledge_authorities");
    const atomic = clone(payload);
    const policies = clone(atomic.handlingPolicies) as Record<string, unknown>[];
    policies.push({
      id: "00000000-0000-4000-8000-000000000099",
      informationClass: "NOT_A_CLASS",
      handlingMode: "FETCH_LIVE",
      freshnessClass: "REAL_TIME",
      staleBehavior: "REVALIDATE_BEFORE_USE",
      riskClass: "LOW",
    });
    atomic.handlingPolicies = policies;
    (atomic.authority as Record<string, unknown>).id = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    (atomic.source as Record<string, unknown>).authorityId = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
    cases.B10 = await rejected(ingestor, atomic)
      && Number((await admin.query("select count(*)::int as n from public.knowledge_authorities")).rows[0]?.n)
        === Number(beforeAtomic.rows[0]?.n)
      && Number((await admin.query(
        "select count(*)::int as n from public.knowledge_authorities where id=$1",
        ["aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee"],
      )).rows[0]?.n) === 0;

    const invented = clone(payload);
    invented.targetTable = "knowledge_forms";
    cases.unknownCategoryRejected = await rejected(ingestor, invented);
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const required = ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11", "B12"] as const;
  const allPassed = required.every((key) => cases[key] === true)
    && cases.rpcExists === true
    && cases.rpcGrants === true
    && cases.unknownCategoryRejected === true
    && cases.staticNoNewTables === true
    && cases.staticSecurity === true
    && cases.staticPackBound === true
    && cases.staticCompetence === true
    && cases.staticBootstrap === true;
  const report = {
    phaseResult: allPassed ? "PASS" : "FAILED",
    allPassed,
    cases,
    productionConnectionAttempted: false,
    productionIngestionAttempted: false,
    productionRetrievalAttempted: false,
    publicRuntimeAuthorized: false,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  run("docker", ["rm", "-f", CONTAINER], 30_000);
  process.stderr.write(`${JSON.stringify({
    result: "FAILED",
    message: error instanceof Error ? error.message : "V2-B audit failed",
  })}\n`);
  process.exitCode = 1;
});
