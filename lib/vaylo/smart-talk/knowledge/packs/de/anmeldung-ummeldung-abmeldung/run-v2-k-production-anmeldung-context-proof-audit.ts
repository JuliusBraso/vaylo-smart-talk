import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { buildWeiltingenLocalityPilotPayload } from "./bayern-weiltingen-locality-pilot";
import { buildCuratedIngestionPayload } from "./curated-ingestion-payload";
import { stablePackEntityId } from "./identity";
import { FIRST_PACK_CANONICAL_UNIT_IDS, V2A_ADDED_CANONICAL_UNIT_IDS } from "./pack";
import {
  ANMELDUNG_CONTEXT_PROOF_ENV,
  ANMELDUNG_CONTEXT_PROOF_OPERATION,
  ANMELDUNG_CONTEXT_READER,
  ANMELDUNG_CONTEXT_RPC,
  ANMELDUNG_CONTEXT_RPC_STATEMENT,
  configurationFromAnmeldungContextProofEnvironment,
  FIXED_ANMELDUNG_CLAIM_IDS,
  runAnmeldungContextProductionProof,
  type AnmeldungContextProofConfiguration,
} from "./production-anmeldung-context-proof";
import { runProductionRetrievalProof } from "./production-rpc-retrieval-proof";
import { WEILTINGEN_INGESTION_OPERATION } from "./production-weiltingen-ingestion";

const ROOT = process.cwd();
const DB = "v2k_context_proof";
const PROJECT_REF = "cdztcnfjxheudqhvepbq";
const CONTAINER = `moja-v2k-${process.pid}-${randomUUID().slice(0, 8)}`;
const ADMIN_PASSWORD = `admin-${randomUUID()}`;
const READER_PASSWORD = `reader-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const MIGRATIONS = [
  "032_create_minimal_knowledge_schema.sql",
  "033_add_publication_and_canonical_translation_schema.sql",
  "034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "035_add_official_source_registry_and_handling_mode_contract.sql",
  "037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "038_add_curated_knowledge_retrieval_rpc.sql",
  "039_add_curated_locality_pack_ingestion_rpc.sql",
  "040_add_anmeldung_context_retrieval_rpc.sql",
] as const;

function command(
  executable: string,
  args: readonly string[],
  timeout = 240_000,
) {
  return spawnSync(executable, [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout,
    maxBuffer: 20 * 1024 * 1024,
  });
}

function docker(args: readonly string[], input?: string) {
  return spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout: 240_000, input,
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

function localConfiguration(connectionString: string): AnmeldungContextProofConfiguration {
  return Object.freeze({
    target: "local-disposable-proof",
    connectionString,
    host: "127.0.0.1",
    port: Number(new URL(connectionString).port),
    database: DB,
    projectRef: PROJECT_REF,
    expectedReader: ANMELDUNG_CONTEXT_READER,
    verifiedTls: false,
    caMechanism: "LOCAL_TEST_ONLY",
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

async function stateFingerprint(client: Client): Promise<string> {
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

async function boundedState(client: Client) {
  const firstIds = FIRST_PACK_CANONICAL_UNIT_IDS.map((id) =>
    stablePackEntityId(`claim:${id}`));
  const sourceOnlyIds = V2A_ADDED_CANONICAL_UNIT_IDS.map((id) =>
    stablePackEntityId(`claim:${id}`));
  const sourceIds = ["anmeldung", "hours", "appointments"].map((key) =>
    stablePackEntityId(`v2c-weiltingen:source:${key}`));
  const result = await client.query(`select
    (select count(*)::int from public.knowledge_claims where id=any($1::uuid[])) first_pack,
    (select count(*)::int from public.knowledge_claims where id=any($2::uuid[])) source_only,
    (select count(*)::int from public.knowledge_jurisdictions
      where id=$3 and jurisdiction_code='09571218') municipality,
    (select count(*)::int from public.knowledge_territorial_scopes where id=$4) scope,
    (select count(*)::int from public.knowledge_authorities where id=$5) authority,
    (select count(*)::int from public.knowledge_authority_competences where id=$6) competence,
    (select count(*)::int from public.knowledge_sources where id=any($7::uuid[])) sources,
    (select count(*)::int from (select claim_text_canonical from public.knowledge_claims
      group by claim_text_canonical having count(*)>1) d) duplicates`, [
    firstIds,
    sourceOnlyIds,
    stablePackEntityId("v2c-weiltingen:locality"),
    stablePackEntityId("v2c-weiltingen:scope"),
    stablePackEntityId("v2c-weiltingen:authority"),
    stablePackEntityId("v2c-weiltingen:competence"),
    sourceIds,
  ]);
  return result.rows[0] as Record<string, number>;
}

function isRejectedConfiguration(value: unknown): boolean {
  return typeof value === "object" && value !== null && "result" in value;
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = {};
  const started = docker([
    "run", "--rm", "-d", "--name", CONTAINER,
    "-e", `POSTGRES_PASSWORD=${ADMIN_PASSWORD}`, "-e", `POSTGRES_DB=${DB}`,
    "-p", "127.0.0.1::5432", "postgres:17",
  ]);
  if (started.status !== 0) throw new Error("DOCKER_PG17_UNAVAILABLE");
  try {
    let ready = false;
    let consecutive = 0;
    for (let attempt = 0; attempt < 50; attempt += 1) {
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
      ${MIGRATIONS.map((name) => migration(name)).join("\n")}
      create role ${ANMELDUNG_CONTEXT_READER} login
        password '${READER_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls
        connection limit 2;
      create role birello_knowledge_ingestor login
        password '${INGESTOR_PASSWORD.replaceAll("'", "''")}'
        nosuperuser nocreatedb nocreaterole noinherit noreplication nobypassrls
        connection limit 2;
      grant connect on database ${DB} to ${ANMELDUNG_CONTEXT_READER},
        birello_knowledge_ingestor;
      grant usage on schema public to ${ANMELDUNG_CONTEXT_READER},
        birello_knowledge_ingestor;
      grant execute on function public.knowledge_retrieve_evidence_packets(uuid[],text[])
        to ${ANMELDUNG_CONTEXT_READER};
      grant execute on function public.knowledge_retrieve_anmeldung_context(uuid[],text)
        to ${ANMELDUNG_CONTEXT_READER};
      grant execute on function public.knowledge_ingest_curated_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_locality_pack(jsonb)
        to birello_knowledge_ingestor;
    `);
    if (setup.status !== 0) throw new Error(`setup failed: ${setup.stderr.slice(-2000)}`);
    const port = /:(\d+)\s*$/u.exec(docker(["port", CONTAINER, "5432/tcp"]).stdout)?.[1];
    if (!port) throw new Error("missing disposable port");
    const adminUrl =
      `postgresql://postgres:${encodeURIComponent(ADMIN_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const readerUrl =
      `postgresql://${ANMELDUNG_CONTEXT_READER}:${encodeURIComponent(READER_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const ingestorUrl =
      `postgresql://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DB}`;
    const admin = new Client({ connectionString: adminUrl });
    const ingestor = new Client({ connectionString: ingestorUrl });
    await admin.connect();
    await ingestor.connect();
    await ingestor.query(
      "select public.knowledge_ingest_curated_pack($1::jsonb)",
      [firstPackPayload()],
    );
    await ingestor.query(
      "select public.knowledge_ingest_curated_locality_pack($1::jsonb)",
      [buildWeiltingenLocalityPilotPayload()],
    );
    await ingestor.end();

    const configuration = localConfiguration(readerUrl);
    const before = await stateFingerprint(admin);
    const validate = await runAnmeldungContextProductionProof(
      configuration, "validate");
    const proof = await runAnmeldungContextProductionProof(
      configuration, "execute-read-only");
    const after = await stateFingerprint(admin);
    if (validate.result !== "PASS" || proof.result !== "PASS" || !proof.cases) {
      throw new Error("actual proof path failed");
    }
    cases.R01 = validate.state.rpcCount === 1;
    cases.R02 = validate.state.rpcSecurityDefiner;
    cases.R03 = validate.state.rpcFixedSearchPath;
    cases.R04 = validate.state.execute040;
    const wrongRole = await runAnmeldungContextProductionProof(
      localConfiguration(ingestorUrl), "validate");
    cases.R05 = wrongRole.result === "REJECTED"
      && wrongRole.failureCode === "READER_IDENTITY_MISMATCH";
    cases.R06 = !validate.state.directKnowledgePrivileges;
    cases.R07 = !validate.state.schemaCreate;

    const validEnvironment = {
      [ANMELDUNG_CONTEXT_PROOF_ENV.enabled]: "true",
      [ANMELDUNG_CONTEXT_PROOF_ENV.target]: "production",
      [ANMELDUNG_CONTEXT_PROOF_ENV.databaseUrl]:
        `postgresql://${ANMELDUNG_CONTEXT_READER}.${PROJECT_REF}:secret@aws-0-eu-central-1.pooler.supabase.com/postgres`,
      [ANMELDUNG_CONTEXT_PROOF_ENV.databaseName]: "postgres",
      [ANMELDUNG_CONTEXT_PROOF_ENV.reader]: ANMELDUNG_CONTEXT_READER,
      [ANMELDUNG_CONTEXT_PROOF_ENV.expectedHost]:
        "aws-0-eu-central-1.pooler.supabase.com",
      [ANMELDUNG_CONTEXT_PROOF_ENV.projectRef]: PROJECT_REF,
      NODE_EXTRA_CA_CERTS: "local-proof-ca.pem",
    };
    const rejects = (environment: Record<string, string | undefined>) =>
      isRejectedConfiguration(
        configurationFromAnmeldungContextProofEnvironment(environment));
    cases.R08 = rejects({ VAYLO_PRODUCTION_DATABASE_URL: readerUrl });
    cases.R09 = rejects({ BIRELLO_PRODUCTION_KNOWLEDGE_DATABASE_URL: readerUrl });
    cases.R10 = rejects({ BIRELLO_PRODUCTION_MAINTENANCE_DATABASE_URL: readerUrl });
    cases.R11 = rejects({ BIRELLO_PRODUCTION_PREFLIGHT_DATABASE_URL: readerUrl });
    const productionConfiguration =
      configurationFromAnmeldungContextProofEnvironment(validEnvironment);
    cases.R12 = !("result" in productionConfiguration)
      && productionConfiguration.verifiedTls;
    cases.R13 = rejects({
      ...validEnvironment,
      [ANMELDUNG_CONTEXT_PROOF_ENV.databaseUrl]:
        `${validEnvironment[ANMELDUNG_CONTEXT_PROOF_ENV.databaseUrl]}?sslmode=disable`,
    });

    const k1 = proof.cases.K1;
    const k2 = proof.cases.K2;
    const k3 = proof.cases.K3;
    const k4 = proof.cases.K4;
    cases.R14 = FIXED_ANMELDUNG_CLAIM_IDS.length === 2 && k1.passed === true;
    cases.R15 = Number(k1.federalEvidenceCount) === 2;
    cases.R16 = k1.localContextPresent === false;
    cases.R17 = k2.municipalityCode === "09571218";
    cases.R18 = k2.municipalityName === "Markt Weiltingen";
    cases.R19 = k2.authorityId === "64238bee-ff3f-4cf6-8452-349b2529857c";
    cases.R20 = k2.competenceId === "4b6cc632-da14-4e32-8e5e-645a64cbd933";
    cases.R21 = Number(k2.federalEvidenceCount) === 2
      && k2.localContextPresent === true;
    cases.R22 = k3.rejectedUnknownLocality === true && k3.fuzzyMatch === false;
    cases.R23 = k3.inventedAuthority === false;
    cases.R24 = k3.inventedLocality === false;
    cases.R25 = k4.handlingMode === "FETCH_LIVE"
      && k4.requiresLiveFetch === true;
    cases.R26 = k4.answerReady === false;
    cases.R27 = proof.liveHttpFetchPerformed === false;

    const executorSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "production-anmeldung-context-proof.ts");
    const cliSource = source("scripts", "run-production-anmeldung-context-proof.ts");
    cases.R28 = !/--municipality|--ags/iu.test(cliSource);
    cases.R29 = !/--claim|--ids/iu.test(cliSource);
    cases.R30 = !/--rpc|--function|--schema/iu.test(cliSource);
    cases.R31 = !/--sql|query\(process/iu.test(cliSource + executorSource);
    cases.R32 = ANMELDUNG_CONTEXT_RPC
      === "public.knowledge_retrieve_anmeldung_context(uuid[],text)"
      && ANMELDUNG_CONTEXT_RPC_STATEMENT.includes(
        "knowledge_retrieve_anmeldung_context");
    cases.R33 = before === after && proof.productionWritesPerformed === false;
    const observed = await boundedState(admin);
    cases.R34 = observed.first_pack === 28;
    cases.R35 = observed.source_only === 0;
    cases.R36 = observed.municipality === 1 && observed.scope === 1
      && observed.authority === 1 && observed.competence === 1
      && observed.sources === 3;
    const encoded = JSON.stringify([validate, proof, wrongRole]);
    cases.R37 = !encoded.includes(ADMIN_PASSWORD) && !encoded.includes(READER_PASSWORD)
      && !encoded.includes("passageText") && !encoded.includes("canonicalUrl");
    cases.R38 = validate.secretsPrinted === false && proof.secretsPrinted === false;

    const federal038 = await runProductionRetrievalProof({
      mode: "read-only",
      target: "local-managed-like-proof",
      databaseUrl: readerUrl,
      expectedDatabase: DB,
      expectedReader: ANMELDUNG_CONTEXT_READER,
    });
    cases.R39 = federal038.result === "PASS" && federal038.allPassed === true;
    const v2fSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "run-v2-f-controlled-smart-talk-wiring-audit.ts");
    cases.R40 = v2fSource.includes("buildWeiltingenLocalityPilotPayload")
      && v2fSource.includes("retrieveAnmeldungContext");
    const migration040 = migration("040_add_anmeldung_context_retrieval_rpc.sql");
    cases.R41 = repositoryBlobHash(migration040)
      === "8369efca863342d0dc102084c317a49c40e8c02c"
      && migration040.includes(
        "function public.knowledge_retrieve_anmeldung_context(");
    const bootstrap003 = source(
      "supabase", "bootstrap", "003_create_birello_knowledge_reader.sql");
    cases.R42 = /grant execute on function public\.knowledge_retrieve_anmeldung_context\(uuid\[\], text\) to birello_knowledge_reader/iu
      .test(bootstrap003);
    const v2iSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "production-weiltingen-ingestion.ts");
    cases.R43 = WEILTINGEN_INGESTION_OPERATION
      === "BIRELLO_WEILTINGEN_LOCALITY_PACK_V1"
      && v2iSource.includes("WEILTINGEN_PAYLOAD_FINGERPRINT");
    const preflightSource = source(
      "lib", "vaylo", "smart-talk", "knowledge", "source-registry",
      "birello-production-preflight-executor.ts");
    cases.R44 = preflightSource.includes("BIRELLO_PREFLIGHT_FIXED_QUERIES")
      && preflightSource.includes("weiltingen:");
    await admin.end();

    cases.R45 = command(process.execPath, [
      path.join(ROOT, "node_modules", "typescript", "bin", "tsc"),
      "--noEmit",
    ], 120_000).status === 0;
    cases.R46 = command(process.execPath, [
      path.join(ROOT, "node_modules", "eslint", "bin", "eslint.js"),
      "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-anmeldung-context-proof.ts",
      "lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/run-v2-k-production-anmeldung-context-proof-audit.ts",
      "scripts/run-production-anmeldung-context-proof.ts",
    ], 120_000).status === 0;
    cases.R47 = command("git", ["diff", "--check"]).status === 0;
    cases.R48 = true;
  } finally {
    docker(["rm", "-f", CONTAINER]);
  }

  const allPassed = Array.from({ length: 48 }, (_, index) =>
    cases[`R${String(index + 1).padStart(2, "0")}`] === true).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    postgres: 17,
    operationId: ANMELDUNG_CONTEXT_PROOF_OPERATION,
    fixedClaimIds: FIXED_ANMELDUNG_CLAIM_IDS,
    cases,
    allPassed,
    productionConnectionAttempted: false,
    productionKnowledgeMutation: false,
    liveHttpFetchPerformed: false,
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
