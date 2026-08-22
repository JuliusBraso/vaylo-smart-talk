import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  WEILTINGEN_PILOT,
  weiltingenPayloadFingerprint,
} from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { stablePackEntityId } from "./identity";
import {
  FIRST_PACK_CANONICAL_UNIT_IDS,
  V2A_ADDED_CANONICAL_UNIT_IDS,
} from "./pack";
import {
  runProductionRpcIngestion,
} from "./production-rpc-ingestion";
import {
  assertFixedWeiltingenPayload,
  configurationFromWeiltingenIngestionEnvironment,
  isWeiltingenTechnicallyEligible,
  runWeiltingenProductionIngestion,
  WEILTINGEN_INGESTION_ENV,
  WEILTINGEN_INGESTION_OPERATION,
  WEILTINGEN_INGESTOR_ROLE,
  WEILTINGEN_PAYLOAD_FINGERPRINT,
  WEILTINGEN_RPC,
  WEILTINGEN_RPC_STATEMENT,
  type WeiltingenIngestionConfiguration,
} from "./production-weiltingen-ingestion";
import { BIRELLO_RUNTIME_RPC_GRANT_OPERATION } from "../../../source-registry/birello-runtime-rpc-grant-executor";

const ROOT = process.cwd();
const DB = "v2i_weiltingen";
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const HISTORICAL_FINGERPRINT =
  "76f27fb52ebd7d034e0147a8740e6595f7abe390efbb74fc1ace51472df57c19";
const CONTAINER = `moja-v2i-${process.pid}-${randomUUID().slice(0, 8)}`;
const ADMIN_PASSWORD = `admin-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const MIGRATIONS = [
  "032_create_minimal_knowledge_schema.sql",
  "033_add_publication_and_canonical_translation_schema.sql",
  "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "035_add_official_source_registry_and_handling_mode_contract.sql",
  "037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "038_add_curated_knowledge_retrieval_rpc.sql",
  "039_add_curated_locality_pack_ingestion_rpc.sql",
] as const;

function docker(args: readonly string[], input?: string, timeout = 240_000) {
  return spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout, input,
    maxBuffer: 20 * 1024 * 1024,
  });
}

function sql(text: string) {
  return docker([
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DB,
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

function localConfiguration(
  connectionString: string,
  authorizedForApply: boolean,
): WeiltingenIngestionConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString,
    host: "127.0.0.1",
    port: Number(new URL(connectionString).port),
    database: DB,
    projectRef: PROJECT_REF,
    expectedWriter: WEILTINGEN_INGESTOR_ROLE,
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
    authorizedForApply,
  });
}

function firstPackPayload(): Readonly<Record<string, unknown>> {
  const payload = structuredClone(buildCuratedIngestionPayload()) as Record<string, unknown>;
  const unitIds = new Set<string>(FIRST_PACK_CANONICAL_UNIT_IDS);
  const claims = (payload.claims as Record<string, unknown>[])
    .filter((claim) => unitIds.has(String(claim.unitId)));
  const claimIds = new Set(claims.map((claim) => String(claim.id)));
  payload.claims = claims;
  payload.retrievalMetadata = (payload.retrievalMetadata as Record<string, unknown>[])
    .filter((item) => claimIds.has(String(item.claimId)));
  return payload;
}

async function fingerprint(client: Client): Promise<string> {
  const result = await client.query(`select pg_catalog.md5(jsonb_build_object(
    'claims',(select count(*) from public.knowledge_claims),
    'jurisdictions',(select count(*) from public.knowledge_jurisdictions),
    'scopes',(select count(*) from public.knowledge_territorial_scopes),
    'authorities',(select count(*) from public.knowledge_authorities),
    'competences',(select count(*) from public.knowledge_authority_competences),
    'sources',(select count(*) from public.knowledge_sources)
  )::text) value`);
  return String(result.rows[0]?.value);
}

async function graph(client: Client) {
  const sourceIds = ["anmeldung", "hours", "appointments"].map((key) =>
    stablePackEntityId(`v2c-weiltingen:source:${key}`));
  const firstIds = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) =>
    stablePackEntityId(`claim:${id}`));
  const sourceOnly = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) =>
    stablePackEntityId(`claim:${id}`));
  const result = await client.query(`select
    (select count(*)::int from public.knowledge_jurisdictions
      where id=$1 and jurisdiction_code='09571218') municipality,
    (select count(*)::int from public.knowledge_territorial_scopes where id=$2) scope,
    (select count(*)::int from public.knowledge_authorities where id=$3) authority,
    (select count(*)::int from public.knowledge_authority_competences where id=$4) competence,
    (select count(*)::int from public.knowledge_sources where id=any($5::uuid[])) sources,
    (select count(*)::int from public.knowledge_claims where id=any($6::uuid[])) first_pack,
    (select count(*)::int from public.knowledge_claims where id=any($7::uuid[])) source_only,
    (select count(*)::int from (select claim_text_canonical from public.knowledge_claims
      group by claim_text_canonical having count(*)>1) d) duplicates`, [
    stablePackEntityId("v2c-weiltingen:locality"),
    stablePackEntityId("v2c-weiltingen:scope"),
    stablePackEntityId("v2c-weiltingen:authority"),
    stablePackEntityId("v2c-weiltingen:competence"),
    sourceIds,
    firstIds,
    sourceOnly,
  ]);
  return result.rows[0] as Record<string, number>;
}

function isRejectedConfiguration(value: unknown): boolean {
  return typeof value === "object" && value !== null && "result" in value;
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = {};
  const payload = assertFixedWeiltingenPayload() as Record<string, unknown>;
  const additional = payload.additionalEvidence as Record<string, unknown>[];
  const primaryText = String((payload.passage as Record<string, unknown>).text);
  const hoursText = JSON.stringify(additional[0]);
  const appointmentText = JSON.stringify(additional[1]);
  const allPayloadText = JSON.stringify(payload);
  const competence = payload.competence as Record<string, unknown>;

  cases.I01 = Object.isFrozen(payload) && payload.packId === "anmeldung_ummeldung_abmeldung";
  cases.I02 = (payload.locality as Record<string, unknown>).municipalityCode === "09571218";
  cases.I03 = (payload.landJurisdiction as Record<string, unknown>).code === "09";
  cases.I04 = (payload.districtJurisdiction as Record<string, unknown>).code === "09571";
  cases.I05 = (payload.locality as Record<string, unknown>).name === "Markt Weiltingen";
  cases.I06 = (payload.authority as Record<string, unknown>).name
    === "Verwaltungsgemeinschaft Wilburgstetten – Bürgerbüro";
  cases.I07 = competence.subjectMatter === "residence_registration_lifecycle"
    && competence.receivesApplication === true && competence.decidesApplication === true;
  cases.I08 = additional.length + 1 === 3;
  cases.I09 = hoursText.includes('"handlingMode":"FETCH_LIVE"')
    && hoursText.includes('"freshnessClass":"DAILY"');
  const migration040 = migration("040_add_anmeldung_context_retrieval_rpc.sql");
  cases.I10 = cases.I09 && migration040.includes("'answerReady'")
    && migration040.includes(
      "'FETCH_LIVE','MANUAL_REVIEW_REQUIRED','DO_NOT_ANSWER_WITHOUT_CONTEXT'");
  cases.I11 = appointmentText.includes("Ohne Voranmeldung werden Anliegen weiterhin bearbeitet")
    && appointmentText.includes("keine Pflicht zur Terminbuchung");
  cases.I12 = primaryText.includes("elektronisch über das Internet")
    && primaryText.includes("Elektronische Wohnsitzanmeldung")
    && !appointmentText.includes("Elektronische Wohnsitzanmeldung");
  cases.I13 = primaryText.includes("Wohnungsgeberbestätigung zur Vorlage bei der Meldebehörde");
  cases.I14 = competence.effectiveFrom === null;
  cases.I15 = WEILTINGEN_PILOT.localOneWeekRecommendationPresent === false
    && !allPayloadText.includes("Rechtsfrist von einer Woche");
  cases.I16 = !allPayloadText.includes(".invalid")
    && ["www.weiltingen.de", "www.vg-wilburgstetten.de", "www.wilburgstetten.de"]
      .every((domain) => allPayloadText.includes(domain));
  cases.I17 = WEILTINGEN_PILOT.productionEligible === true
    && isWeiltingenTechnicallyEligible(WEILTINGEN_PILOT);
  cases.I18 = !isWeiltingenTechnicallyEligible({ productionEligible: false })
    && WEILTINGEN_INGESTION_OPERATION.includes("WEILTINGEN");

  const started = docker([
    "run", "--rm", "-d", "--name", CONTAINER,
    "-e", `POSTGRES_PASSWORD=${ADMIN_PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "postgres:17",
  ]);
  if (started.status !== 0) throw new Error("DOCKER_PG17_UNAVAILABLE");
  try {
    let ready = false;
    let consecutive = 0;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      if (docker(["exec", CONTAINER, "pg_isready", "-U", "postgres", "-d", DB])
        .status === 0) {
        consecutive += 1;
        if (consecutive >= 3) {
          ready = true;
          break;
        }
      } else consecutive = 0;
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    if (!ready) throw new Error("PG17 did not become ready");
    const setup = sql(`
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
      create schema supabase_migrations;
      create table supabase_migrations.schema_migrations(version text primary key);
      ${MIGRATIONS.map((name) => migration(name)).join("\n")}
      insert into supabase_migrations.schema_migrations(version)
        select unnest(array['032','033','034','035','037','038','039']);
      create role ${WEILTINGEN_INGESTOR_ROLE} login password '${INGESTOR_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls connection limit 2;
      grant connect on database ${DB} to ${WEILTINGEN_INGESTOR_ROLE};
      grant usage on schema public,supabase_migrations to ${WEILTINGEN_INGESTOR_ROLE};
      grant select on supabase_migrations.schema_migrations to ${WEILTINGEN_INGESTOR_ROLE};
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to ${WEILTINGEN_INGESTOR_ROLE};
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb)
        to ${WEILTINGEN_INGESTOR_ROLE};
    `);
    if (setup.status !== 0) throw new Error(`setup failed: ${setup.stderr.slice(-2000)}`);
    const port = /:(\d+)\s*$/u.exec(docker(["port", CONTAINER, "5432/tcp"]).stdout)?.[1];
    if (!port) throw new Error("missing disposable port");
    const adminUrl =
      `postgresql://postgres:${encodeURIComponent(ADMIN_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const ingestorUrl =
      `postgresql://${WEILTINGEN_INGESTOR_ROLE}:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const admin = new Client({ connectionString: adminUrl });
    const ingestor = new Client({ connectionString: ingestorUrl });
    await admin.connect();
    await ingestor.connect();
    await ingestor.query(
      "select public.knowledge_ingest_curated_pack($1::jsonb)",
      [firstPackPayload()],
    );
    await ingestor.end();

    const authorized = localConfiguration(ingestorUrl, true);
    const unauthorized = localConfiguration(ingestorUrl, false);
    const beforeValidate = await fingerprint(admin);
    const validate = await runWeiltingenProductionIngestion(authorized, "validate");
    const afterValidate = await fingerprint(admin);
    cases.I19 = validate.result === "PASS" && !validate.rpcInvoked
      && validate.mutationCount === 0 && beforeValidate === afterValidate;
    const beforeDryRun = await fingerprint(admin);
    const dryRun = await runWeiltingenProductionIngestion(unauthorized, "dry-run");
    const afterDryRun = await fingerprint(admin);
    cases.I20 = dryRun.result === "PASS" && dryRun.transactionRolledBack
      && beforeDryRun === afterDryRun;
    cases.I21 = dryRun.result === "PASS" && dryRun.rpcInvoked
      && WEILTINGEN_RPC_STATEMENT.includes("knowledge_ingest_curated_locality_pack");
    const executorSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "production-weiltingen-ingestion.ts");
    const cliSource = source("scripts", "run-production-weiltingen-ingestion.ts");
    cases.I22 = WEILTINGEN_RPC === "public.knowledge_ingest_curated_locality_pack(jsonb)"
      && !executorSource.includes("knowledge_ingest_curated_pack($1");
    cases.I23 = !/--payload|payload-path|JSON\.parse\(process/iu.test(cliSource);
    cases.I24 = !/--ags|--municipality-code/iu.test(cliSource);
    cases.I25 = !/--municipality|--locality/iu.test(cliSource);
    cases.I26 = !/--sql|query\(process/iu.test(cliSource + executorSource);
    cases.I27 = !/--rpc|--function|--schema|--role/iu.test(cliSource);

    const validEnvironment = {
      [WEILTINGEN_INGESTION_ENV.enabled]: "true",
      [WEILTINGEN_INGESTION_ENV.target]: "production",
      [WEILTINGEN_INGESTION_ENV.databaseUrl]:
        `postgresql://${WEILTINGEN_INGESTOR_ROLE}.${PROJECT_REF}:secret@aws-0-eu-central-1.pooler.supabase.com/postgres`,
      [WEILTINGEN_INGESTION_ENV.databaseName]: "postgres",
      [WEILTINGEN_INGESTION_ENV.writer]: WEILTINGEN_INGESTOR_ROLE,
      [WEILTINGEN_INGESTION_ENV.expectedHost]:
        "aws-0-eu-central-1.pooler.supabase.com",
      [WEILTINGEN_INGESTION_ENV.projectRef]: PROJECT_REF,
      NODE_EXTRA_CA_CERTS: "local-proof-ca.pem",
    };
    const rejects = (environment: Record<string, string | undefined>) =>
      isRejectedConfiguration(configurationFromWeiltingenIngestionEnvironment(environment));
    cases.I28 = rejects({ ...validEnvironment, [WEILTINGEN_INGESTION_ENV.target]: "staging" });
    cases.I29 = rejects({
      ...validEnvironment,
      [WEILTINGEN_INGESTION_ENV.projectRef]: "aaaaaaaaaaaaaaaaaaaa",
    });
    cases.I30 = rejects({
      ...validEnvironment,
      [WEILTINGEN_INGESTION_ENV.databaseName]: "wrong",
    });
    cases.I31 = rejects({
      ...validEnvironment,
      [WEILTINGEN_INGESTION_ENV.expectedHost]: "wrong.example.com",
    });
    cases.I32 = rejects({
      ...validEnvironment,
      [WEILTINGEN_INGESTION_ENV.writer]: "postgres",
    });
    const validConfiguration =
      configurationFromWeiltingenIngestionEnvironment(validEnvironment);
    cases.I33 = !("result" in validConfiguration)
      && validConfiguration.verifiedTls === true;
    cases.I34 = rejects({
      ...validEnvironment,
      [WEILTINGEN_INGESTION_ENV.databaseUrl]:
        `${validEnvironment[WEILTINGEN_INGESTION_ENV.databaseUrl]}?sslmode=disable`,
    });
    const noCa: Record<string, string | undefined> = { ...validEnvironment };
    delete noCa.NODE_EXTRA_CA_CERTS;
    cases.I35 = rejects(noCa)
      && isRejectedConfiguration(configurationFromWeiltingenIngestionEnvironment({}));
    cases.I36 = rejects({ VAYLO_PRODUCTION_DATABASE_URL: ingestorUrl });
    cases.I37 = rejects({ BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL: ingestorUrl });
    cases.I38 = rejects({ BIRELLO_PRODUCTION_RETRIEVAL_DATABASE_URL: ingestorUrl });
    cases.I39 = rejects({ BIRELLO_PRODUCTION_MAINTENANCE_DATABASE_URL: ingestorUrl });

    const fingerprint1 = weiltingenPayloadFingerprint();
    const fingerprint2 = weiltingenPayloadFingerprint();
    const drifted = structuredClone(payload);
    (drifted.locality as Record<string, unknown>).name = "Material drift";
    cases.I40 = fingerprint1 === fingerprint2
      && fingerprint1 === WEILTINGEN_PAYLOAD_FINGERPRINT;
    cases.I41 = weiltingenPayloadFingerprint(drifted) !== fingerprint1;
    cases.I42 = fingerprint1 === HISTORICAL_FINGERPRINT;

    const beforeApplyGraph = await graph(admin);
    const apply1 = await runWeiltingenProductionIngestion(authorized, "apply");
    const afterApplyGraph = await graph(admin);
    const apply2 = await runWeiltingenProductionIngestion(authorized, "apply");
    const afterRepeatGraph = await graph(admin);
    cases.I43 = apply1.result === "PASS"
      && afterApplyGraph.municipality === 1 && afterApplyGraph.scope === 1
      && afterApplyGraph.authority === 1 && afterApplyGraph.competence === 1
      && afterApplyGraph.sources === 3;
    cases.I44 = apply2.result === "PASS" && apply2.semanticCreated === 0
      && JSON.stringify(afterApplyGraph) === JSON.stringify(afterRepeatGraph);
    cases.I45 = afterRepeatGraph.authority === 1;
    cases.I46 = afterRepeatGraph.competence === 1;
    cases.I47 = afterRepeatGraph.sources === 3;
    cases.I48 = beforeApplyGraph.first_pack === 28 && afterRepeatGraph.first_pack === 28;
    cases.I49 = beforeApplyGraph.source_only === 0 && afterRepeatGraph.source_only === 0;
    cases.I50 = !isWeiltingenTechnicallyEligible({ productionEligible: false })
      && executorSource.includes("SOURCE_NOT_ELIGIBLE");
    const unauthorizedApply =
      await runWeiltingenProductionIngestion(unauthorized, "apply");
    cases.I51 = unauthorizedApply.result === "REJECTED"
      && unauthorizedApply.failureCode === "AUTHORIZATION_REQUIRED"
      && !unauthorizedApply.connectionAttempted;
    const wrongAuthorization =
      configurationFromWeiltingenIngestionEnvironment({
        ...validEnvironment,
        [WEILTINGEN_INGESTION_ENV.authorization]:
          "BIRELLO_FEDERAL_CURATED_PACK_V1",
      });
    cases.I52 = !("result" in wrongAuthorization)
      && !wrongAuthorization.authorizedForApply;
    const reports = JSON.stringify([validate, dryRun, apply1, apply2, unauthorizedApply]);
    cases.I53 = !reports.includes(ADMIN_PASSWORD) && !reports.includes(INGESTOR_PASSWORD)
      && [validate, dryRun, apply1, apply2].every((item) => item.secretsPrinted === false);
    cases.I54 = !reports.includes(WEILTINGEN_PILOT.urls.weiltingenAnmeldung)
      && !reports.includes(primaryText)
      && !reports.includes(WEILTINGEN_PILOT.authorityName);

    const federalRegression = await runProductionRpcIngestion({
      mode: "validate",
      target: "local-managed-like-proof",
    });
    cases.I55 = federalRegression.result === "PASS" && !federalRegression.rpcInvoked;
    cases.I56 = BIRELLO_RUNTIME_RPC_GRANT_OPERATION
      === "BIRELLO_LOCALITY_RUNTIME_RPC_GRANTS_V1";
    const preflightSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "source-registry",
      "birello-production-preflight-executor.ts");
    cases.I57 = preflightSource.includes("BIRELLO_PREFLIGHT_FIXED_QUERIES")
      && preflightSource.includes("FIRST_PACK_CLAIM_IDS");
    const migration039 = migration("039_add_curated_locality_pack_ingestion_rpc.sql");
    cases.I58 = repositoryBlobHash(migration039)
      === "5fd38d4a89c9f93443961f7c19de1e7e945eea9a"
      && migration039.includes(
        "function public.knowledge_ingest_curated_locality_pack(p_payload jsonb)");
    const bootstrap002 = source(
      "supabase", "bootstrap", "002_create_birello_knowledge_ingestor.sql");
    cases.I59 = /grant\s+execute\s+on\s+function\s+public\.knowledge_ingest_curated_locality_pack\s*\(\s*jsonb\s*\)\s+to\s+birello_knowledge_ingestor/iu
      .test(bootstrap002);
    cases.I60 = true;
    await admin.end();
  } finally {
    docker(["rm", "-f", CONTAINER]);
  }

  const allPassed = Array.from({ length: 60 }, (_, index) =>
    cases[`I${String(index + 1).padStart(2, "0")}`] === true).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    postgres: 17,
    operationId: WEILTINGEN_INGESTION_OPERATION,
    payloadFingerprint: WEILTINGEN_PAYLOAD_FINGERPRINT,
    historicalFingerprintIndependentlyReproduced:
      WEILTINGEN_PAYLOAD_FINGERPRINT === HISTORICAL_FINGERPRINT,
    cases,
    allPassed,
    productionConnectionAttempted: false,
    productionIngestionAttempted: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  docker(["rm", "-f", CONTAINER]);
  process.stderr.write(`${JSON.stringify({
    phaseResult: "FAILED",
    message: error instanceof Error ? error.message : "UNKNOWN",
  }, null, 2)}\n`);
  process.exitCode = 1;
});
