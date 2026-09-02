/**
 * CB-TAX-0B dedicated local audit for the DE↔SK bilateral tax-treaty foundation.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { KNOWLEDGE_FACTORY_DOMAINS } from "../source-registry/knowledge-factory-contracts";
import { validateCuratedCrossBorderConnectorPack } from "../source-registry/cross-border-connector-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE,
  BILATERAL_TAX_IS_NOT_TAX_CALCULATOR,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  BILATERAL_TAX_TRUST_DOMAIN,
  FIXED_BASE_AND_PE_ARE_SEPARATE,
  TAX_ACTIVITY_TYPES,
  canonicalBilateralTaxTreatyKey,
  classifyMliTrustDomain,
  isAuthorizedBilateralTaxPair,
  resolveBilateralTaxStableRef,
  validateCrossBorderTaxCaseContext,
  validateCrossBorderTaxIncomeItem,
  validateCuratedBilateralTaxTreatyPack,
  validateTaxResidenceDetermination,
} from "../source-registry/bilateral-tax-treaty-contracts";
import {
  buildValidDeSkTaxFoundationPack,
  employedIncomeItem,
  employerToTaxingRightShortcut,
  incompleteTaxCaseContext,
  mixedIncomeItem,
  nationalityResidenceShortcut,
  selfEmployedAutoArticle14Item,
  taxPackWithAmbiguousClaimRefs,
  taxPackWithClaimRefDatabaseUuid,
  taxPackWithEuTrust,
  taxPackWithHardcodedUuid,
  taxPackWithLocale,
  taxPackWithUnsupportedPair,
  taxPackWithZeroClaimRefs,
  unresolvedSelfEmployedIncomeItem,
} from "../source-registry/bilateral-tax-treaty-synthetic-fixtures";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb_tax_0b_core";
const PASSWORD = `cbtax0b-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cbtax0b-${process.pid}-${randomUUID().slice(0, 8)}`;
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
  "supabase/migrations/037_add_curated_knowledge_pack_ingestion_rpc.sql",
  "supabase/migrations/038_add_curated_knowledge_retrieval_rpc.sql",
  "supabase/migrations/039_add_curated_locality_pack_ingestion_rpc.sql",
  "supabase/migrations/040_add_anmeldung_context_retrieval_rpc.sql",
  "supabase/migrations/041_add_generalized_curated_knowledge_ingestion.sql",
  "supabase/migrations/042_make_knowledge_factory_ingestion_coexist.sql",
  "supabase/migrations/043_add_anmeldung_retrieval_compatibility.sql",
  "supabase/migrations/044_add_arbeitslosengeld_knowledge_factory_domain.sql",
  "supabase/migrations/045_add_einkommensteuer_knowledge_factory_domain.sql",
  "supabase/migrations/046_add_wohngeld_knowledge_factory_domain.sql",
  "supabase/migrations/047_add_versicherungsvertraege_knowledge_factory_domain.sql",
  "supabase/migrations/048_add_banking_zahlungsverkehr_knowledge_factory_domain.sql",
  "supabase/migrations/049_add_verkehrsordnungswidrigkeiten_knowledge_factory_domain.sql",
  "supabase/migrations/050_add_elterngeld_knowledge_factory_domain.sql",
  "supabase/migrations/051_add_cross_border_connector_ingestion.sql",
  "supabase/migrations/052_expand_eu_jurisdiction_foundation_ingestion.sql",
  "supabase/migrations/053_add_sk_national_adapter_and_de_sk_connector_ingestion.sql",
  "supabase/migrations/054_add_eu_health_insurance_coordination_ingestion.sql",
  "supabase/migrations/055_add_de_sk_health_insurance_coordination_ingestion.sql",
  "supabase/migrations/056_add_eu_family_benefits_coordination_ingestion.sql",
  "supabase/migrations/057_add_de_sk_family_benefits_coordination_ingestion.sql",
  "supabase/migrations/058_add_eu_unemployment_coordination_ingestion.sql",
  "supabase/migrations/059_add_de_sk_unemployment_coordination_ingestion.sql",
  "supabase/migrations/060_add_bilateral_tax_treaty_foundation.sql",
];
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const TAX_RPC = "select public.knowledge_ingest_curated_bilateral_tax_treaty_pack($1::jsonb) as result";

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT,
    encoding: "utf8",
    timeout,
    windowsHide: true,
    shell: false,
    maxBuffer: 32 * 1024 * 1024,
  });
}

function source(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

function sql(text: string, timeout = 120_000) {
  return run("docker", [
    "exec", "-i", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
    "-v", "ON_ERROR_STOP=1", "-A", "-t", "-c", text,
  ], timeout);
}

function semanticCreated(row: unknown): number {
  const result = row as { result?: { semanticCreated?: number } };
  return Number(result.result?.semanticCreated ?? -1);
}

async function rejects(
  client: Client,
  rpc: string,
  payload: unknown,
  token: string,
): Promise<boolean> {
  try {
    await client.query(rpc, [payload]);
    return false;
  } catch (error: unknown) {
    return String(error instanceof Error ? error.message : error).includes(token);
  }
}

function buildStaticCases() {
  const pack = buildValidDeSkTaxFoundationPack();
  const packValidation = validateCuratedBilateralTaxTreatyPack(pack);
  const incomplete = incompleteTaxCaseContext();
  const contracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "bilateral-tax-treaty-contracts.ts",
  );
  const connectorContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "cross-border-connector-contracts.ts",
  );
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const migration060 = source("supabase", "migrations", "060_add_bilateral_tax_treaty_foundation.sql");
  const migration059 = source("supabase", "migrations", "059_add_de_sk_unemployment_coordination_ingestion.sql");
  const validItem = unresolvedSelfEmployedIncomeItem();
  const employed = employedIncomeItem();
  const mixed = mixedIncomeItem();

  return {
    separateTaxContractExists: packValidation.valid
      && pack.topicFamily === "TAX_TREATY"
      && !contracts.includes("export type CuratedCrossBorderConnectorPack")
      && !factoryContracts.includes("CuratedBilateralTaxTreatyPack"),
    separateTaxCaseContextExists: validateCrossBorderTaxCaseContext(incomplete).valid
      && contracts.includes("export type CrossBorderTaxCaseContext")
      && !connectorContracts.includes("CrossBorderTaxCaseContext"),
    incomeItemModelExists: validateCrossBorderTaxIncomeItem(validItem).valid
      && contracts.includes("export type CrossBorderTaxIncomeItem"),
    selfEmployedFirstClass: (TAX_ACTIVITY_TYPES as readonly string[]).includes("SELF_EMPLOYED")
      && validItem.activityType === "SELF_EMPLOYED"
      && validateCrossBorderTaxIncomeItem(selfEmployedAutoArticle14Item())
        .issues.includes("SELF_EMPLOYED_NOT_ARTICLE_14_AUTOMATICALLY"),
    taxTreatyPairDirectionNeutral: canonicalBilateralTaxTreatyKey("SK", "DE") === "DE-SK"
      && canonicalBilateralTaxTreatyKey("DE", "SK") === "DE-SK"
      && pack.treatyKey === "DE-SK"
      && pack.countryA === "DE"
      && pack.countryB === "SK",
    deSkOnlyCurrentlyAuthorized: isAuthorizedBilateralTaxPair("DE", "SK")
      && !isAuthorizedBilateralTaxPair("DE", "CZ")
      && !isAuthorizedBilateralTaxPair("DE", "PL")
      && !isAuthorizedBilateralTaxPair("DE", "HU")
      && !isAuthorizedBilateralTaxPair("SK", "CZ")
      && validateCuratedBilateralTaxTreatyPack(taxPackWithUnsupportedPair("DE-CZ") as never)
        .issues.includes("UNSUPPORTED_COUNTRY_PAIR")
      && validateCuratedBilateralTaxTreatyPack(taxPackWithUnsupportedPair("DE-PL") as never)
        .issues.includes("UNSUPPORTED_COUNTRY_PAIR")
      && validateCuratedBilateralTaxTreatyPack(taxPackWithUnsupportedPair("DE-HU") as never)
        .issues.includes("UNSUPPORTED_COUNTRY_PAIR")
      && validateCuratedBilateralTaxTreatyPack(taxPackWithUnsupportedPair("XX-YY") as never)
        .issues.includes("UNSUPPORTED_COUNTRY_PAIR"),
    oldConnectorStillRejectsTaxTreaty: validateCuratedCrossBorderConnectorPack(
      connectorTaxTreatyContamination(),
    ).issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED")
      && migration059.includes("CONNECTOR_TAX_TREATY_ENGINE_NOT_AUTHORIZED"),
    newTaxWriterAcceptsValidTaxTreatyStructure: packValidation.valid
      && packValidation.productionEligible === false
      && migration060.includes("knowledge_ingest_curated_bilateral_tax_treaty_pack"),
    mliNotClassifiedAsEu: classifyMliTrustDomain() === BILATERAL_TAX_TRUST_DOMAIN
      && (classifyMliTrustDomain() as string) !== "eu"
      && pack.versions.some((version) => version.sourceKind === "AUTHENTIC_BEPS_MLI"
        && version.mliModified
        && version.effectiveFrom === "2025-01-01"),
    euTrustRejectedForBilateralTreaty: validateCuratedBilateralTaxTreatyPack(taxPackWithEuTrust())
      .issues.includes("EU_TRUST_REJECTED_FOR_BILATERAL_TREATY")
      && (BILATERAL_TAX_TRUST_DOMAIN as string) !== "eu",
    socialSecurityStateCannotPopulateTaxResidence: validateTaxResidenceDetermination({
      treatyResidenceState: "TREATY_RESIDENT_DE",
      residenceDeterminationStatus: "DETERMINED",
      taxResidenceBasis: "SOCIAL_SECURITY_COMPETENT_STATE",
      socialSecurityCompetentState: "DE",
    }).issues.includes("SOCIAL_SECURITY_COMPETENT_STATE_CANNOT_POPULATE_TAX_RESIDENCE"),
    nationalityCannotPopulateTaxResidence: validateTaxResidenceDetermination(
      nationalityResidenceShortcut(),
    ).issues.includes("NATIONALITY_CANNOT_POPULATE_TAX_RESIDENCE"),
    localeCannotPopulateTaxJurisdiction: validateCuratedBilateralTaxTreatyPack(
      taxPackWithLocale() as never,
    ).issues.some((issue) => issue.includes("LOCALE")),
    stableRefsUsed: packValidation.authoringUsesKeysNotDatabaseUuids
      && pack.claimUnits.every((ref) => !("id" in ref)),
    hardcodedDbUuidRejected: validateCuratedBilateralTaxTreatyPack(taxPackWithHardcodedUuid())
      .issues.some((issue) => issue.startsWith("HARDCODED_DB_UUID_REJECTED"))
      && resolveBilateralTaxStableRef(
        [{ ...pack.claimUnits[0]!, ...{ id: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee" } } as never],
        pack.claimUnits[0]!.key,
        "claims",
      ).issues.some((issue) => issue.includes("HARDCODED_DB_UUID_REJECTED")),
    zeroRefRejected: validateCuratedBilateralTaxTreatyPack(taxPackWithZeroClaimRefs())
      .issues.includes("ZERO_REF_REJECTED:claimUnits")
      && resolveBilateralTaxStableRef([], "missing", "claims").issues.includes("ZERO_REF_REJECTED"),
    ambiguousRefRejected: validateCuratedBilateralTaxTreatyPack(taxPackWithAmbiguousClaimRefs())
      .issues.some((issue) => issue.startsWith("AMBIGUOUS_REF_REJECTED")),
    fixedBaseAndPeSeparated: FIXED_BASE_AND_PE_ARE_SEPARATE
      && "fixedBaseState" in validItem
      && "permanentEstablishmentState" in validItem
      && validItem.fixedBaseState === null
      && validItem.permanentEstablishmentState === null,
    temporalTreatyVersionsSupported: pack.versions.length === 2
      && pack.versions[0]?.temporalVersion === "pre_2025"
      && pack.versions[1]?.temporalVersion === "from_2025",
    prePost2025Representable: pack.versions[0]?.effectiveTo === "2024-12-31"
      && pack.versions[1]?.effectiveFrom === "2025-01-01"
      && pack.versions[1]?.mliModified === true,
    taxCalculatorAbsent: BILATERAL_TAX_IS_NOT_TAX_CALCULATOR
      && BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE
      && !contracts.includes("solidarity surcharge")
      && !contracts.includes("church tax")
      && !contracts.includes("tax brackets")
      && !contracts.includes("Slovak tax rates")
      && !/tax bracket|solidarity surcharge|church tax|net salary/i.test(migration060),
    productionRuntimeBlocked: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
      && pack.active === false
      && pack.publicRuntimeAllowed === false
      && packValidation.productionEligible === false,
    employeeSelfEmployedMixed: validateCrossBorderTaxIncomeItem(employed).valid
      && validateCrossBorderTaxIncomeItem(mixed).valid
      && employed.activityType === "EMPLOYED"
      && mixed.activityType === "MIXED_EMPLOYED_SELF_EMPLOYED"
      && validItem.treatyArticleState === "ARTICLE_UNRESOLVED",
    sourceWorkEmployerSeparated: employed.employerState === "DE"
      && employed.payerState === "DE"
      && employed.physicalWorkStates.includes("SK")
      && employed.sourceStateVerified === null
      && validateCrossBorderTaxIncomeItem(employerToTaxingRightShortcut())
        .issues.includes("EMPLOYER_STATE_CANNOT_POPULATE_TAXING_RIGHT"),
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("sk_income_tax"),
    migration060Present: /create table if not exists public\.knowledge_bilateral_tax_treaties/.test(migration060)
      && /create table if not exists public\.knowledge_bilateral_tax_treaty_versions/.test(migration060)
      && /create table if not exists public\.knowledge_bilateral_tax_processes/.test(migration060)
      && /create table if not exists public\.knowledge_bilateral_tax_process_claim_links/.test(migration060),
    migration059Unchanged: !/knowledge_bilateral_tax/.test(migration059)
      && migration059.includes("CONNECTOR_TAX_TREATY_ENGINE_NOT_AUTHORIZED")
      && migration059.includes("de_sk_unemployment_coordination_connector"),
    newTablesRlsEnabled: /alter table public\.knowledge_bilateral_tax_treaties enable row level security/.test(migration060)
      && /alter table public\.knowledge_bilateral_tax_treaty_versions enable row level security/.test(migration060)
      && /alter table public\.knowledge_bilateral_tax_processes enable row level security/.test(migration060)
      && /alter table public\.knowledge_bilateral_tax_process_claim_links enable row level security/.test(migration060),
    publicRevoked: /revoke all on public\.knowledge_bilateral_tax_treaties from public, anon, authenticated/.test(migration060),
    anonRevoked: /revoke all on public\.knowledge_bilateral_tax_treaties from public, anon, authenticated/.test(migration060),
    authenticatedRevoked: /revoke all on function public\.knowledge_ingest_curated_bilateral_tax_treaty_pack\(jsonb\)/.test(migration060)
      && migration060.includes("from public, anon, authenticated, service_role"),
    noDrop: !/drop table/i.test(migration060) && !/drop column/i.test(migration060),
    noRename: !/rename to/i.test(migration060),
    noRlsLoosening: !/create policy/i.test(migration060)
      && !/grant select/i.test(migration060)
      && !/to service_role/i.test(migration060.replaceAll("from public, anon, authenticated, service_role", "")),
    noActiveCorridor: !/status\s*=\s*'active'/.test(migration060)
      && /active boolean not null default false check \(active = false\)/.test(migration060),
    noProductionWrite: !/grant execute on function public\.knowledge_ingest_curated_bilateral_tax_treaty_pack/.test(migration060)
      && !/insert into public\.knowledge_bilateral_tax_treaties/i.test(
        migration060.split("create or replace function public.knowledge_ingest_curated_bilateral_tax_treaty_pack")[0] ?? "",
      ),
    existingKnowledgeTablesPreserved: migration060.includes("references public.knowledge_claims")
      && migration060.includes("references public.knowledge_trust_domains")
      && !/create table if not exists public\.knowledge_claims/.test(migration060)
      && !/create table if not exists public\.knowledge_sources/.test(migration060),
  };
}

async function main(): Promise<void> {
  const staticCases = buildStaticCases();
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED",
      reason: "docker unavailable",
      staticCases,
      publicRuntimeAuthorized: false,
      productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb-tax-0b",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let firstCreated = -1;
  let secondCreated = -1;
  try {
    if (created.status !== 0) throw new Error(created.stderr);
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (sql("select 1;").status === 0) {
        ready = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 350));
    }
    if (!ready) throw new Error("PostgreSQL 17 did not become ready");
    if (sql("create role anon nologin; create role authenticated nologin; create role service_role nologin;").status !== 0) {
      throw new Error("role bootstrap");
    }
    for (const file of MIGRATIONS) {
      const target = `/tmp/${path.basename(file)}`;
      if (run("docker", ["cp", path.join(ROOT, file), `${CONTAINER}:${target}`]).status !== 0) {
        throw new Error(`copy ${file}`);
      }
      const applied = run("docker", [
        "exec", CONTAINER, "psql", "-X", "-U", "postgres", "-d", DATABASE,
        "-v", "ON_ERROR_STOP=1", "-f", target,
      ], 240_000);
      if (applied.status !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-2000)}`);
    }
    const escaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login password '${escaped}';
      grant connect on database ${DATABASE} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_bilateral_tax_treaty_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_cross_border_connector_pack(jsonb)
        to birello_knowledge_ingestor;
    `).status !== 0) throw new Error("grants");

    const port = run("docker", ["port", CONTAINER, "5432/tcp"]).stdout.trim().split(":").at(-1);
    if (!port) throw new Error("port");
    admin = new Client({
      connectionString: `postgres://postgres:${encodeURIComponent(PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await admin.connect();
    ingestor = new Client({
      connectionString: `postgres://birello_knowledge_ingestor:${encodeURIComponent(INGESTOR_PASSWORD)}@127.0.0.1:${port}/${DATABASE}`,
    });
    await ingestor.connect();

    const pack = buildValidDeSkTaxFoundationPack();
    let firstQuery;
    try {
      firstQuery = await ingestor.query(TAX_RPC, [pack]);
    } catch (error: unknown) {
      throw new Error(`TAX_INGEST:${error instanceof Error ? error.message : "unknown"}`);
    }
    firstCreated = semanticCreated(firstQuery.rows[0]);
    const firstPayload = firstQuery.rows[0] as {
      result?: { semanticCreated?: number; publicRuntimeAuthorized?: boolean };
    };
    const secondRow = await ingestor.query(TAX_RPC, [pack]);
    secondCreated = semanticCreated(secondRow.rows[0]);

    const treatyCount = await admin.query(
      "select count(*)::int n from public.knowledge_bilateral_tax_treaties",
    );
    const versionCount = await admin.query(
      "select count(*)::int n from public.knowledge_bilateral_tax_treaty_versions",
    );
    const processCount = await admin.query(
      "select count(*)::int n from public.knowledge_bilateral_tax_processes",
    );
    const connectorCount = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors",
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const activeTreaties = await admin.query(
      "select count(*)::int n from public.knowledge_bilateral_tax_treaties where active or public_runtime_allowed",
    );
    const rls = await admin.query(
      `select count(*)::int n from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public'
         and c.relname in (
           'knowledge_bilateral_tax_treaties',
           'knowledge_bilateral_tax_treaty_versions',
           'knowledge_bilateral_tax_processes',
           'knowledge_bilateral_tax_process_claim_links'
         )
         and c.relrowsecurity`,
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name = 'knowledge_ingest_curated_bilateral_tax_treaty_pack'
          and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );
    const tableGrants = await admin.query(
      `select count(*)::int n from information_schema.role_table_grants
        where table_name like 'knowledge_bilateral_tax%'
          and grantee in ('PUBLIC','anon','authenticated')`,
    );
    const trust = await admin.query(
      "select code from public.knowledge_trust_domains where code = 'bilateral_tax_treaty'",
    );
    const euTrustMisuse = await admin.query(
      "select count(*)::int n from public.knowledge_trust_domains t join public.knowledge_bilateral_tax_treaties b on b.trust_domain_id = t.id where t.code = 'eu'",
    );

    live.firstCreatedPositive = firstCreated > 0;
    live.secondIngestionIdempotent = secondCreated === 0;
    live.duplicatesZero = Number(treatyCount.rows[0]?.n) === 1
      && Number(versionCount.rows[0]?.n) === 2
      && Number(processCount.rows[0]?.n) === 2;
    live.oldSsWriterRejectsFixture = await rejects(
      ingestor, CONNECTOR_RPC, pack, "CONNECTOR_PARTIAL_PAYLOAD",
    );
    live.oldConnectorRejectsTaxTreaty = await rejects(
      ingestor, CONNECTOR_RPC, connectorTaxTreatyContamination(),
      "CONNECTOR_TAX_TREATY_ENGINE_NOT_AUTHORIZED",
    );
    live.newTaxWriterAcceptsValidTaxTreatyStructure = firstCreated > 0
      && firstPayload.result?.publicRuntimeAuthorized === false;
    live.deCzBlocked = await rejects(
      ingestor, TAX_RPC, taxPackWithUnsupportedPair("DE-CZ"), "TAX_PAIR_NOT_AUTHORIZED",
    );
    live.dePlBlocked = await rejects(
      ingestor, TAX_RPC, taxPackWithUnsupportedPair("DE-PL"), "TAX_PAIR_NOT_AUTHORIZED",
    );
    live.deHuBlocked = await rejects(
      ingestor, TAX_RPC, taxPackWithUnsupportedPair("DE-HU"), "TAX_PAIR_NOT_AUTHORIZED",
    );
    live.unknownPairBlocked = await rejects(
      ingestor, TAX_RPC, taxPackWithUnsupportedPair("XX-YY"), "TAX_PAIR_NOT_AUTHORIZED",
    );
    live.euTrustRejected = await rejects(
      ingestor, TAX_RPC, taxPackWithEuTrust(), "TAX_EU_TRUST_REJECTED_FOR_BILATERAL_TREATY",
    );
    live.hardcodedUuidRejected = await rejects(
      ingestor, TAX_RPC, taxPackWithHardcodedUuid(), "TAX_HARDCODED_DB_UUID_REJECTED",
    )
      && await rejects(
        ingestor, TAX_RPC, taxPackWithClaimRefDatabaseUuid(), "TAX_HARDCODED_DB_UUID_REJECTED",
      );
    live.zeroRefRejected = await rejects(
      ingestor, TAX_RPC, taxPackWithZeroClaimRefs(), "TAX_ZERO_REF_REJECTED",
    );
    live.ambiguousRefRejected = await rejects(
      ingestor, TAX_RPC, taxPackWithAmbiguousClaimRefs(), "TAX_AMBIGUOUS_REF_REJECTED",
    );
    live.ssWriterDidNotIngestTax = Number(connectorCount.rows[0]?.n) === 0;
    live.noActiveCorridor = Number(activeCorridors.rows[0]?.n) === 0
      && Number(activeTreaties.rows[0]?.n) === 0;
    live.rlsEnabled = Number(rls.rows[0]?.n) === 4;
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0
      && Number(tableGrants.rows[0]?.n) === 0;
    live.bilateralTrustStored = trust.rows[0]?.code === "bilateral_tax_treaty"
      && Number(euTrustMisuse.rows[0]?.n) === 0;
    live.temporalVersionsStored = Number(versionCount.rows[0]?.n) === 2;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const named = {
    separateTaxContractExists: staticCases.separateTaxContractExists,
    separateTaxCaseContextExists: staticCases.separateTaxCaseContextExists,
    incomeItemModelExists: staticCases.incomeItemModelExists,
    selfEmployedFirstClass: staticCases.selfEmployedFirstClass,
    taxTreatyPairDirectionNeutral: staticCases.taxTreatyPairDirectionNeutral,
    deSkOnlyCurrentlyAuthorized: staticCases.deSkOnlyCurrentlyAuthorized,
    oldConnectorStillRejectsTaxTreaty: staticCases.oldConnectorStillRejectsTaxTreaty
      && live.oldConnectorRejectsTaxTreaty === true,
    newTaxWriterAcceptsValidTaxTreatyStructure: staticCases.newTaxWriterAcceptsValidTaxTreatyStructure
      && live.newTaxWriterAcceptsValidTaxTreatyStructure === true,
    euTrustRejectedForBilateralTreaty: staticCases.euTrustRejectedForBilateralTreaty
      && live.euTrustRejected === true,
    mliNotClassifiedAsEu: staticCases.mliNotClassifiedAsEu,
    socialSecurityStateCannotPopulateTaxResidence: staticCases.socialSecurityStateCannotPopulateTaxResidence,
    nationalityCannotPopulateTaxResidence: staticCases.nationalityCannotPopulateTaxResidence,
    localeCannotPopulateTaxJurisdiction: staticCases.localeCannotPopulateTaxJurisdiction,
    stableRefsUsed: staticCases.stableRefsUsed,
    hardcodedDbUuidRejected: staticCases.hardcodedDbUuidRejected
      && live.hardcodedUuidRejected === true,
    zeroRefRejected: staticCases.zeroRefRejected && live.zeroRefRejected === true,
    ambiguousRefRejected: staticCases.ambiguousRefRejected && live.ambiguousRefRejected === true,
    fixedBaseAndPeSeparated: staticCases.fixedBaseAndPeSeparated,
    temporalTreatyVersionsSupported: staticCases.temporalTreatyVersionsSupported
      && live.temporalVersionsStored === true,
    prePost2025Representable: staticCases.prePost2025Representable,
    taxCalculatorAbsent: staticCases.taxCalculatorAbsent,
    productionRuntimeBlocked: staticCases.productionRuntimeBlocked
      && live.noActiveCorridor === true,
  };
  const migrationAudit = {
    migration060Present: staticCases.migration060Present,
    migration059Unchanged: staticCases.migration059Unchanged,
    newTablesRlsEnabled: staticCases.newTablesRlsEnabled && live.rlsEnabled === true,
    publicRevoked: staticCases.publicRevoked && live.noPublicGrants === true,
    anonRevoked: staticCases.anonRevoked,
    authenticatedRevoked: staticCases.authenticatedRevoked,
    noDrop: staticCases.noDrop,
    noRename: staticCases.noRename,
    noRlsLoosening: staticCases.noRlsLoosening,
    noActiveCorridor: staticCases.noActiveCorridor && live.noActiveCorridor === true,
    noProductionWrite: staticCases.noProductionWrite,
    existingKnowledgeTablesPreserved: staticCases.existingKnowledgeTablesPreserved,
  };
  const allPassed = Object.values(staticCases).every(Boolean)
    && Object.values(live).every(Boolean)
    && Object.values(named).every(Boolean)
    && Object.values(migrationAudit).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phase: "CB-TAX-0B",
    phaseResult: allPassed ? "PASS" : "FAILED",
    named,
    migrationAudit,
    staticCases,
    live,
    firstCreated,
    secondCreated,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
    activeCorridors: 0,
    taxAnswersAuthorized: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-TAX-0B audit failed"}\n`);
  process.exitCode = 1;
});
