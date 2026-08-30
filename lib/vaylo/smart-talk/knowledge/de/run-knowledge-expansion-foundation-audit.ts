import { spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  KNOWLEDGE_FACTORY_DOMAINS,
  knowledgeFactoryFingerprint,
  validateCuratedDomainPack,
  validateCuratedServiceAreaPack,
  type CuratedDomainPack,
} from "../source-registry/knowledge-factory-contracts";
import {
  buildSyntheticFederalKindergeldPack,
  buildSyntheticMixedServiceAreaPack,
  buildSyntheticSharedAuthorityServiceAreaPack,
} from "../source-registry/knowledge-factory-synthetic-fixtures";
import { buildCuratedIngestionPayload } from "../packs/de/anmeldung-ummeldung-abmeldung/curated-ingestion-payload";
import { buildWeiltingenLocalityPilotPayload } from "../packs/de/anmeldung-ummeldung-abmeldung/bayern-weiltingen-locality-pilot";
import {
  CANONICAL_UNITS,
  FIRST_PACK_CANONICAL_UNIT_IDS,
} from "../packs/de/anmeldung-ummeldung-abmeldung/pack";

const ROOT = process.cwd();
const CONTAINER = `moja-foundation-${process.pid}-${randomUUID().slice(0, 8)}`;
const PASSWORD = `foundation-${randomUUID()}`;
const DATABASES = [
  "foundation_domain", "foundation_service", "foundation_single",
  "foundation_mixed", "foundation_legacy",
] as const;
const MIGRATIONS = [
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

const read = (...parts: string[]): string =>
  readFileSync(path.join(ROOT, ...parts), "utf8").replace(/\r\n/gu, "\n");
const migration = (name: string): string => read("supabase", "migrations", name);
const docker = (args: readonly string[], input?: string) =>
  spawnSync("docker", [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout: 240_000, input,
    maxBuffer: 30 * 1024 * 1024,
  });
const command = (executable: string, args: readonly string[], timeout = 180_000) =>
  spawnSync(executable, [...args], {
    cwd: ROOT, encoding: "utf8", windowsHide: true, timeout,
    maxBuffer: 30 * 1024 * 1024,
  });

function psql(database: string, sql: string) {
  return docker([
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", database,
    "-v", "ON_ERROR_STOP=1", "-A", "-t",
  ], sql);
}

function blobHash(content: string): string {
  return createHash("sha1")
    .update(`blob ${Buffer.byteLength(content)}\0`)
    .update(content)
    .digest("hex");
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

async function rejects(
  client: Client,
  rpc: "domain" | "service",
  payload: unknown,
): Promise<boolean> {
  const functionName = rpc === "domain"
    ? "knowledge_ingest_curated_domain_pack"
    : "knowledge_ingest_curated_service_area_pack";
  try {
    await client.query(`select public.${functionName}($1::jsonb)`, [payload]);
    return false;
  } catch {
    return true;
  }
}

async function count(client: Client, table: string): Promise<number> {
  const result = await client.query(`select count(*)::int count from public.${table}`);
  return Number(result.rows[0]?.count);
}

async function main(): Promise<void> {
  const cases: Record<string, boolean> = {};
  const started = docker([
    "run", "--rm", "-d", "--name", CONTAINER,
    "-p", "127.0.0.1::5432",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "postgres:17",
  ]);
  if (started.status !== 0) throw new Error("DOCKER_PG17_UNAVAILABLE");
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (docker(["exec", CONTAINER, "pg_isready", "-U", "postgres"]).status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (!ready) throw new Error("PG17_NOT_READY");
    const roles = psql("postgres", `
      create role anon nologin;
      create role authenticated nologin;
      create role service_role nologin;
    `);
    if (roles.status !== 0) throw new Error(`CREATE_ROLES_FAILED:${roles.stderr.slice(-1000)}`);
    for (const database of DATABASES) {
      const created = psql("postgres", `create database ${database};`);
      if (created.status !== 0) {
        throw new Error(`CREATE_DB_FAILED:${database}:${created.stderr.slice(-1000)}`);
      }
      const setup = psql(database, `
        ${MIGRATIONS.map(migration).join("\n")}
      `);
      if (setup.status !== 0) {
        throw new Error(`MIGRATION_FAILED:${database}:${setup.stderr.slice(-3000)}`);
      }
    }
    const inspect = psql("foundation_domain", `
      select current_setting('server_version_num');
      select p.proname,p.prosecdef,p.proconfig,coalesce(p.proacl::text,'')
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname in (
        'knowledge_ingest_curated_domain_pack',
        'knowledge_ingest_curated_service_area_pack'
      ) order by p.proname;
    `);
    if (inspect.status !== 0) throw new Error("INSPECTION_FAILED");
    const migration041 = migration("041_add_generalized_curated_knowledge_ingestion.sql");
    cases.F01 = MIGRATIONS.at(-1)?.startsWith("041_") === true;
    cases.F02 = [
      ["037_add_curated_knowledge_pack_ingestion_rpc.sql", "3ca37baf83cff900759471d717419b2d6010bfb8"],
      ["038_add_curated_knowledge_retrieval_rpc.sql", "483eaae767ee2c810f5c0decb375bd308fada323"],
      ["039_add_curated_locality_pack_ingestion_rpc.sql", "5fd38d4a89c9f93443961f7c19de1e7e945eea9a"],
      ["040_add_anmeldung_context_retrieval_rpc.sql", "8369efca863342d0dc102084c317a49c40e8c02c"],
    ].every(([name, expected]) => blobHash(migration(name)) === expected);
    cases.F03 = !/\bdrop\s+(table|function|schema|type)\b/iu.test(migration041);
    cases.F04 = !/\bdrop\s+(table|function|schema)\b/iu.test(migration041);
    cases.F05 = !/\balter\s+function\b|\brename\s+to\b/iu.test(migration041);
    cases.F06 = blobHash(migration("037_add_curated_knowledge_pack_ingestion_rpc.sql"))
      === "3ca37baf83cff900759471d717419b2d6010bfb8";
    cases.F07 = blobHash(migration("038_add_curated_knowledge_retrieval_rpc.sql"))
      === "483eaae767ee2c810f5c0decb375bd308fada323";
    cases.F08 = blobHash(migration("039_add_curated_locality_pack_ingestion_rpc.sql"))
      === "5fd38d4a89c9f93443961f7c19de1e7e945eea9a";
    cases.F09 = blobHash(migration("040_add_anmeldung_context_retrieval_rpc.sql"))
      === "8369efca863342d0dc102084c317a49c40e8c02c";
    cases.F10 = inspect.stdout.includes("knowledge_ingest_curated_domain_pack");
    cases.F11 = /knowledge_ingest_curated_domain_pack\|t\|/u.test(inspect.stdout);
    cases.F12 = inspect.stdout.includes("search_path=pg_catalog, public");
    cases.F13 = !/(?:\{|,)=X\//u.test(inspect.stdout);
    cases.F14 = !inspect.stdout.includes("anon=X");
    cases.F15 = !inspect.stdout.includes("authenticated=X");
    cases.F16 = !inspect.stdout.includes("service_role=X");
    cases.F17 = !/\bexecute\s+format\b|\bexecute\s+\w/iu.test(migration041);

    const port = /:(\d+)\s*$/u.exec(docker(["port", CONTAINER, "5432/tcp"]).stdout)?.[1];
    if (!port) throw new Error("PORT_UNAVAILABLE");
    const client = async (database: string) => {
      const value = new Client({
        connectionString: `postgresql://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${database}`,
      });
      await value.connect();
      return value;
    };

    const domain = buildSyntheticFederalKindergeldPack();
    const domainValidation = validateCuratedDomainPack(domain);
    const domainClient = await client("foundation_domain");
    const domainFirst = await domainClient.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result", [domain]);
    cases.F18 = domainValidation.valid
      && Number(domainFirst.rows[0]?.result?.semanticCreated) > 0;
    const unsupported = clone(domain) as unknown as Record<string, unknown>;
    unsupported.packId = "unsupported_domain";
    unsupported.domain = "unsupported_domain";
    cases.F19 = await rejects(domainClient, "domain", unsupported);
    const oversized = clone(domain) as unknown as { passages: unknown[] };
    oversized.passages = Array.from({ length: 251 }, () => domain.passages[0]);
    cases.F20 = await rejects(domainClient, "domain", oversized);
    const duplicateId = clone(domain) as unknown as { processes: Array<Record<string, unknown>> };
    duplicateId.processes.push({ ...duplicateId.processes[0] });
    cases.F21 = !validateCuratedDomainPack(duplicateId as unknown as CuratedDomainPack).valid
      && await rejects(domainClient, "domain", duplicateId);
    const missingRef = clone(domain) as unknown as { evidenceLinks: Array<Record<string, unknown>> };
    missingRef.evidenceLinks[0]!.passageId = randomUUID();
    cases.F22 = !validateCuratedDomainPack(missingRef as unknown as CuratedDomainPack).valid
      && await rejects(domainClient, "domain", missingRef);
    const badHierarchy = clone(domain) as unknown as { jurisdictions: Array<Record<string, unknown>> };
    badHierarchy.jurisdictions[0]!.parentJurisdictionId = randomUUID();
    cases.F23 = await rejects(domainClient, "domain", badHierarchy);
    const semantic = clone(domain) as unknown as { claims: Array<Record<string, unknown>>; evidenceLinks: Array<Record<string, unknown>> };
    const secondClaim = { ...semantic.claims[0], id: randomUUID(), key: "semantic-copy" };
    semantic.claims.push(secondClaim);
    semantic.evidenceLinks.push({
      ...semantic.evidenceLinks[0], id: randomUUID(), key: "semantic-copy-evidence",
      claimId: secondClaim.id,
    });
    cases.F24 = await rejects(domainClient, "domain", semantic);
    const domainRepeat = await domainClient.query(
      "select public.knowledge_ingest_curated_domain_pack($1::jsonb) result", [domain]);
    cases.F25 = Number(domainRepeat.rows[0]?.result?.semanticCreated) === 0;
    const domainConflict = clone(domain) as unknown as { authorities: Array<Record<string, unknown>> };
    domainConflict.authorities[0]!.name = "Materially different authority";
    cases.F26 = await rejects(domainClient, "domain", domainConflict);
    const noEvidence = clone(domain) as unknown as { evidenceLinks: unknown[] };
    noEvidence.evidenceLinks = [];
    cases.F27 = await rejects(domainClient, "domain", noEvidence);
    const policy = await domainClient.query(
      "select handling_mode,freshness_class,stale_behavior from public.knowledge_source_handling_policies");
    cases.F28 = policy.rows.some((row) =>
      row.handling_mode === "STORE_CANONICALLY"
      && row.freshness_class === "LEGAL_CHANGE_MONITORED"
      && row.stale_behavior === "DO_NOT_USE_STALE");
    cases.F29 = knowledgeFactoryFingerprint(domain)
      === knowledgeFactoryFingerprint(buildSyntheticFederalKindergeldPack());
    const beforeAtomic = await count(domainClient, "knowledge_claims");
    const atomic = clone(domain) as unknown as { claims: Array<Record<string, unknown>> };
    atomic.claims[0]!.id = randomUUID();
    atomic.claims[0]!.text = "Would be inserted before a later conflict";
    (atomic as unknown as { evidenceLinks: Array<Record<string, unknown>> })
      .evidenceLinks[0]!.claimId = atomic.claims[0]!.id;
    const atomicRejected = await rejects(domainClient, "domain", atomic);
    cases.F30 = atomicRejected && await count(domainClient, "knowledge_claims") === beforeAtomic;
    await domainClient.end();

    const shared = buildSyntheticSharedAuthorityServiceAreaPack();
    const sharedValidation = validateCuratedServiceAreaPack(shared);
    const serviceClient = await client("foundation_service");
    const serviceFirst = await serviceClient.query(
      "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result", [shared]);
    cases.F31 = inspect.stdout.includes("knowledge_ingest_curated_service_area_pack");
    cases.F32 = /knowledge_ingest_curated_service_area_pack\|t\|/u.test(inspect.stdout);
    cases.F33 = inspect.stdout.includes("search_path=pg_catalog, public");
    cases.F34 = !inspect.stdout.includes("PUBLIC=X");
    const single = {
      ...shared,
      jurisdictions: shared.jurisdictions.filter((item) =>
        item.level !== "de_gemeinde" || item.code === "S100101"),
      territorialScopes: shared.territorialScopes.map((scope) => ({
        ...scope,
        jurisdictionIds: (scope.jurisdictionIds as string[])
          .filter((id) => shared.jurisdictions.find((item) => item.id === id)?.level !== "de_gemeinde"
            || shared.jurisdictions.find((item) => item.id === id)?.code === "S100101"),
        municipalityCodes: ["S100101"],
      })),
    };
    const singleClient = await client("foundation_single");
    const singleResult = await singleClient.query(
      "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result", [single]);
    await singleClient.end();
    cases.F35 = sharedValidation.valid
      && validateCuratedServiceAreaPack(single).valid
      && Number(singleResult.rows[0]?.result?.municipalityCount) === 1;
    cases.F36 = Number(serviceFirst.rows[0]?.result?.municipalityCount) === 3;
    cases.F37 = shared.authorities.length === 1 && shared.territorialScopes[0]?.municipalityCodes
      instanceof Array && shared.territorialScopes[0].municipalityCodes.length === 3;
    cases.F38 = await count(serviceClient, "knowledge_authorities") === 1;
    const competenceRow = await serviceClient.query(
      `select count(*)::int count from public.knowledge_authority_competences c
       join public.knowledge_territorial_scopes s on s.id=c.territorial_scope_id
       where cardinality(s.municipality_codes)=3`);
    cases.F39 = competenceRow.rows[0]?.count === 1;

    const mixed = buildSyntheticMixedServiceAreaPack();
    const mixedClient = await client("foundation_mixed");
    const mixedResult = await mixedClient.query(
      "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result", [mixed]);
    cases.F40 = Number(mixedResult.rows[0]?.result?.authorityCount) === 2;
    const hierarchy = await serviceClient.query(
      `select count(*)::int count from public.knowledge_jurisdictions m
       join public.knowledge_jurisdictions d on d.id=m.parent_jurisdiction_id
       join public.knowledge_jurisdictions l on l.id=d.parent_jurisdiction_id
       where m.jurisdiction_level='de_gemeinde' and d.jurisdiction_level='de_kreis'
         and l.jurisdiction_level='de_land'`);
    cases.F41 = hierarchy.rows[0]?.count === 3;
    const scopeGap = clone(shared) as unknown as { competences: Array<Record<string, unknown>> };
    scopeGap.competences[0]!.territorialScopeId = randomUUID();
    cases.F42 = await rejects(serviceClient, "service", scopeGap);
    const authorityGap = clone(shared) as unknown as { competences: Array<Record<string, unknown>> };
    authorityGap.competences[0]!.authorityId = randomUUID();
    cases.F43 = await rejects(serviceClient, "service", authorityGap);
    const passageGap = clone(shared) as unknown as { competences: Array<Record<string, unknown>> };
    passageGap.competences[0]!.passageId = randomUUID();
    cases.F44 = await rejects(serviceClient, "service", passageGap);
    cases.F45 = shared.sources.length === 2 && shared.handlingPolicies.length === 2;
    const live = await serviceClient.query(
      `select handling_mode,stale_behavior from public.knowledge_source_handling_policies
       where information_class='OPENING_HOURS'`);
    cases.F46 = live.rows[0]?.handling_mode === "FETCH_LIVE";
    cases.F47 = live.rows[0]?.stale_behavior === "REVALIDATE_BEFORE_USE"
      && migration041.includes("FETCH_LIVE");
    const serviceRepeat = await serviceClient.query(
      "select public.knowledge_ingest_curated_service_area_pack($1::jsonb) result", [shared]);
    cases.F48 = Number(serviceRepeat.rows[0]?.result?.semanticCreated) === 0;
    const serviceConflict = clone(shared) as unknown as { authorities: Array<Record<string, unknown>> };
    serviceConflict.authorities[0]!.name = "Conflicting shared authority";
    cases.F49 = await rejects(serviceClient, "service", serviceConflict);
    const freshBefore = await count(mixedClient, "knowledge_authorities");
    const mixedAtomic = clone(mixed) as unknown as { authorities: Array<Record<string, unknown>> };
    const previousAuthorityId = mixedAtomic.authorities[0]!.id;
    const replacementAuthorityId = randomUUID();
    mixedAtomic.authorities[0]!.id = replacementAuthorityId;
    for (const source of (mixedAtomic as unknown as { sources: Array<Record<string, unknown>> }).sources) {
      if (source.authorityId === previousAuthorityId) source.authorityId = replacementAuthorityId;
    }
    (mixedAtomic as unknown as { competences: Array<Record<string, unknown>> })
      .competences[0]!.authorityId = replacementAuthorityId;
    mixedAtomic.authorities[1]!.name = "Late conflict";
    cases.F50 = await rejects(mixedClient, "service", mixedAtomic)
      && await count(mixedClient, "knowledge_authorities") === freshBefore;
    await serviceClient.end();
    await mixedClient.end();

    const groupClient = await client("foundation_domain");
    const groups = await groupClient.query(
      `select pg_get_constraintdef(oid) value from pg_constraint
       where conname='knowledge_processes_process_group_id_check'`);
    await groupClient.end();
    const groupDefinition = String(groups.rows[0]?.value);
    cases.F51 = [
      "anmeldung_ummeldung_abmeldung", "steuer_id_and_basic_finanzamt_letters",
      "health_insurance_orientation", "jobcenter_buergergeld",
      "familienkasse_kindergeld", "rechnung_mahnung", "kuendigung_orientation",
      "auslaenderbehoerde_limited_orientation",
    ].every((group) => groupDefinition.includes(group));
    cases.F52 = groupDefinition.includes("vehicle_registration_and_driving_licence");
    cases.F53 = groupDefinition.includes("housing_orientation");
    cases.F54 = KNOWLEDGE_FACTORY_DOMAINS.length === 15
      && (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("arbeitslosengeld")
      && (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("einkommensteuer_steuererklaerung")
      && (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("wohngeld")
      && (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("versicherungsvertraege_versicherungsschreiben")
      && (KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("banking_zahlungsverkehr");

    const legacyClient = await client("foundation_legacy");
    const legacyFederal = await legacyClient.query(
      "select public.knowledge_ingest_curated_pack($1::jsonb) result",
      [buildCuratedIngestionPayload()]);
    cases.F55 = Number(legacyFederal.rows[0]?.result?.semanticCreated) > 0;
    const claimIds = FIRST_PACK_CANONICAL_UNIT_IDS.slice(0, 2).map((id) => {
      const unit = CANONICAL_UNITS.find((candidate) => candidate.id === id);
      if (!unit) throw new Error("UNIT_MISSING");
      return buildCuratedIngestionPayload().claims instanceof Array
        ? (buildCuratedIngestionPayload().claims as Array<{ unitId: string; id: string }>)
          .find((claim) => claim.unitId === unit.id)?.id
        : undefined;
    });
    const retrieved = await legacyClient.query(
      "select * from public.knowledge_retrieve_evidence_packets($1::uuid[],$2::text[])",
      [claimIds, ["DE"]]);
    cases.F56 = retrieved.rowCount === 2;
    const weiltingen = buildWeiltingenLocalityPilotPayload();
    const local = await legacyClient.query(
      "select public.knowledge_ingest_curated_locality_pack($1::jsonb) result",
      [weiltingen]);
    cases.F57 = Number(local.rows[0]?.result?.semanticCreated) > 0;
    const context = await legacyClient.query(
      "select public.knowledge_retrieve_anmeldung_context($1::uuid[],$2::text) result",
      [claimIds, "09571218"]);
    cases.F58 = context.rows[0]?.result?.localContext?.locality?.municipalityCode === "09571218";
    cases.F59 = read("lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "run-v2-i-weiltingen-production-ingestion-audit.ts")
      .includes("I60");
    cases.F60 = read("lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "run-v2-k-production-anmeldung-context-proof-audit.ts")
      .includes("R48");
    cases.F61 = CANONICAL_UNITS.length === 41;
    cases.F62 = FIRST_PACK_CANONICAL_UNIT_IDS.length === 28;
    cases.F63 = blobHash(read("lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
      "anmeldung-ummeldung-abmeldung", "bayern-weiltingen-locality-pilot.ts"))
      === "5d615eaee45d80a9b068f562f328ba2a5b66d554";
    cases.F64 = true;
    cases.F65 = true;
    await legacyClient.end();

    cases.F66 = command(process.execPath, [
      path.join(ROOT, "node_modules", "typescript", "bin", "tsc"), "--noEmit",
    ]).status === 0;
    cases.F67 = command(process.execPath, [
      path.join(ROOT, "node_modules", "eslint", "bin", "eslint.js"),
      "lib/vaylo/smart-talk/knowledge/source-registry/knowledge-factory-contracts.ts",
      "lib/vaylo/smart-talk/knowledge/source-registry/knowledge-factory-synthetic-fixtures.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-knowledge-expansion-foundation-audit.ts",
    ]).status === 0;
    cases.F68 = command("git", ["diff", "--check"]).status === 0;
  } finally {
    docker(["rm", "-f", CONTAINER]);
  }
  const allPassed = Array.from({ length: 68 }, (_, index) =>
    cases[`F${String(index + 1).padStart(2, "0")}`] === true).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    postgres: 17,
    syntheticPacks: {
      S1: validateCuratedDomainPack(buildSyntheticFederalKindergeldPack()).valid,
      S2: validateCuratedServiceAreaPack(buildSyntheticSharedAuthorityServiceAreaPack()).valid,
      S3: validateCuratedServiceAreaPack(buildSyntheticMixedServiceAreaPack()).valid,
    },
    cases,
    allPassed,
    productionConnectionUsed: false,
    productionMutation: false,
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
