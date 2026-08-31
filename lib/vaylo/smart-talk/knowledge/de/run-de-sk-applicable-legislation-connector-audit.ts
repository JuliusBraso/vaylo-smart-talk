/**
 * CB-0D dedicated local audit for the DE↔SK applicable-legislation connector.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { KNOWLEDGE_FACTORY_DOMAINS, validateCuratedDomainPack } from "../source-registry/knowledge-factory-contracts";
import {
  COD_2016_0397_STATUS,
  CROSS_BORDER_SOURCE_JURISDICTIONS,
  FOREIGN_NATIONAL_ADAPTER_COUNTRIES,
  detectMissingCrossBorderFacts,
  validateCrossBorderCaseContext,
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import {
  SK_EMPLOYER_EFILING_EFFECTIVE,
  classifySkEmployerEfiling,
  validateForeignNationalAdapterPack,
} from "../source-registry/foreign-national-adapter-contracts";
import {
  germanKindergeldFixture,
  connectorWithForeignNationalRef,
  buildValidDeSkPlannedConnectorPack,
} from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  EU_SHARED_ARTICLE_12_CLAIM_KEY,
  EU_SHARED_ONE_LEGISLATION_CLAIM_KEY,
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
  validateEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  SK_AL_NEGATIVE_CONTROLS,
  SK_AL_OFFICIAL_SOURCES,
  SK_AL_PACK_ID,
  SK_AL_PRIMARY_PROCESS_KEY,
  SK_AL_PROCESSES,
  SK_AL_UNITS,
  buildSkApplicableLegislationAdapterPack,
} from "../packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack";
import {
  DE_AL_PRIMARY_PROCESS_KEY,
  DE_AL_UNITS,
  buildDeApplicableLegislationRoutingPack,
} from "../packs/de/applicable-legislation-routing/de-applicable-legislation-routing-pack";
import {
  DE_SK_CONNECTOR_STATUS,
  DE_SK_EU_CLAIM_KEYS,
  DE_SK_PROCESSES,
  buildDeSkApplicableLegislationConnectorPack,
  deSkConnectorSummary,
  evaluateDeSkProcessCompleteness,
} from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0d_core";
const PASSWORD = `cb0d-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0d-${process.pid}-${randomUUID().slice(0, 8)}`;
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
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_foreign_national_adapter_pack($1::jsonb) as result";
const DE_RPC = "select public.knowledge_ingest_curated_de_corridor_routing_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Entsendung|Sozial|Wohnsitz|Arbeit|Bescheinigung|Verordnung|Träger|Tätigkeit|keine|kein|nicht/iu;
const SK_HOSTS = new Set(["www.socpoist.sk", "eformulare.socpoist.sk", "www.employment.gov.sk", "www.slov-lex.sk"]);
const DE_HOSTS = new Set(["www.dvka.de"]);

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT, encoding: "utf8", timeout, windowsHide: true, shell: false, maxBuffer: 32 * 1024 * 1024,
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
async function rejects(client: Client, rpc: string, payload: unknown, token: string): Promise<boolean> {
  try {
    await client.query(rpc, [payload]);
    return false;
  } catch (error: unknown) {
    return String(error instanceof Error ? error.message : error).includes(token);
  }
}

async function main(): Promise<void> {
  const eu = buildEuApplicableLegislationCorePack();
  const sk = buildSkApplicableLegislationAdapterPack();
  const de = buildDeApplicableLegislationRoutingPack();
  const connector = buildDeSkApplicableLegislationConnectorPack();
  const german = germanKindergeldFixture();
  const completeness = evaluateDeSkProcessCompleteness();
  const summary = deSkConnectorSummary(connector);
  const eFilingClass = classifySkEmployerEfiling();
  const skSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "sk",
    "applicable-legislation", "sk-applicable-legislation-adapter-pack.ts",
  );
  const deSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "de",
    "applicable-legislation-routing", "de-applicable-legislation-routing-pack.ts",
  );
  const migration053 = source("supabase", "migrations", "053_add_sk_national_adapter_and_de_sk_connector_ingestion.sql");
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const claimText = (key: string) => String(
    [...sk.claims, ...de.claims, ...eu.claims].find((claim) => claim.key === key)?.text ?? "",
  );
  const skUrls = sk.sources.map((item) => String(item.canonicalUrl));
  const deUrls = de.sources.map((item) => String(item.canonicalUrl));

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("sk_applicable_legislation_adapter")
      && !factoryContracts.includes("sk_applicable_legislation_adapter")
      && validateCuratedDomainPack(german).valid,
    euCoreReused: validateEuApplicableLegislationCorePack(eu).valid
      && DE_SK_EU_CLAIM_KEYS.includes(EU_SHARED_ARTICLE_12_CLAIM_KEY)
      && DE_SK_EU_CLAIM_KEYS.includes(EU_SHARED_ONE_LEGISLATION_CLAIM_KEY)
      && DE_SK_EU_CLAIM_KEYS.includes("cjeu-c-203-24-hakamp")
      && !/Artikel 12 Absatz 1 der Verordnung 883/.test(skSource)
      && !/Hakamp/.test(skSource)
      && !/Portable Document A1 bescheinigt die für die Inhaberin/.test(skSource),
    skAdapter: validateForeignNationalAdapterPack(sk).valid
      && sk.packId === SK_AL_PACK_ID
      && sk.countryCode === "SK"
      && sk.trustDomain.code === "sk"
      && sk.canonicalLanguage === "de"
      && sk.jurisdictions[0]?.level === "foreign_national"
      && sk.jurisdictions[0]?.countryCode === "SK"
      && FOREIGN_NATIONAL_ADAPTER_COUNTRIES.join(",") === "SK"
      && SK_AL_PROCESSES.length === 12
      && PROCESS_COMPLETE_DIMENSIONS.length === 12
      && SK_AL_NEGATIVE_CONTROLS.every((key) => SK_AL_UNITS.some((unit) => unit.key === key)),
    skOfficialSources: SK_AL_OFFICIAL_SOURCES.every((item) => SK_HOSTS.has(item.officialDomain))
      && skUrls.every((url) => !url.includes("#"))
      && new Set(skUrls).size === skUrls.length
      && !/wikipedia|reddit|linkedin|kpmg|payroll|forum|financnykompas/iu.test(skUrls.join("\n")),
    germanRouting: de.packId === "de_applicable_legislation_routing"
      && de.trustDomain.code === "de"
      && de.jurisdictions[0]?.level === "de_federal"
      && DE_AL_UNITS.some((unit) => unit.key === "de-dvka-not-ordinary-posting-issuer")
      && DE_AL_UNITS.some((unit) => unit.key === "de-krankenkasse-not-art13-first")
      && deUrls.every((url) => DE_HOSTS.has("www.dvka.de") && url.startsWith("https://www.dvka.de/"))
      && !/Artikel 13 Absatz 1/.test(deSource),
    connectorPrepared: connector.status === DE_SK_CONNECTOR_STATUS
      && (connector.status as string) !== "active"
      && connector.originMarket === "DE"
      && connector.connectedCountry === "SK"
      && connector.activationFromLocaleAllowed === false
      && connector.activationRequiresVerifiedCaseContext === true
      && validateCuratedCrossBorderConnectorPack(connector).valid
      && CROSS_BORDER_SOURCE_JURISDICTIONS.join(",") === "DE,EU"
      && DE_SK_PROCESSES.length === 22
      && completeness.processCompletenessPercent === 100
      && completeness.blockedScenarioCount === 0
      && completeness.totalScenarios === 46
      && completeness.coveredScenarioCount === 45
      && completeness.outOfScopeScenarioCount === 1,
    germanNormalizedLanguage: sk.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text)))
      && de.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    localeAndNationality: /Ausgabesprache Slowakisch/.test(claimText("sk-locale-not-jurisdiction"))
      && /Staatsangehörigkeit bestimmt die anwendbaren Rechtsvorschriften/.test(
        claimText("nationality-not-applicable-legislation"),
      )
      && detectMissingCrossBorderFacts({ persons: [], period: null }, ["WORKER"], ["residenceState"]).includes("person:WORKER")
      && validateCrossBorderCaseContext({
        persons: [{ role: "WORKER", residenceState: "SK", employmentState: "DE", activityState: "SK" }],
        period: { from: "2026-09-01" },
      }).valid,
    eFilingGate: SK_EMPLOYER_EFILING_EFFECTIVE === "2026-09-01"
      && /1\. Juli 2026 ist nicht das geltende/.test(claimText("sk-july-2026-announcement-superseded"))
      && /1\. August 2026 ist nicht das geltende/.test(claimText("sk-august-2026-announcement-superseded"))
      && /2026-09-01/.test(claimText("sk-employer-efiling-effective-2026-09-01"))
      && /nicht pauschal für alle A1-Anträge/.test(claimText("sk-efiling-employers-not-all-persons"))
      && /keine Garantie für jeden Antragsteller/.test(claimText("sk-24h-not-guarantee"))
      && (eFilingClass === "FUTURE_ENACTED" || eFilingClass === "CURRENT"),
    teleworkAndRoles: /MPSVR SR ist nicht Sociálna poisťovňa/.test(claimText("sk-mpsvr-not-sp"))
      && /nicht für selbständig/.test(claimText("sk-framework-not-self-employed"))
      && /dritten Staat/.test(claimText("sk-framework-not-third-state"))
      && /bilaterale Telearbeitsvereinbarung Slowakei-Österreich ist nicht/.test(
        claimText("sk-at-bilateral-not-this-corridor"),
      )
      && /nicht automatisch deutsches Arbeitgeberstaatsrecht/.test(claimText("de-framework-not-automatic")),
    cb0bForeignStillBlocked: validateCuratedCrossBorderConnectorPack(connectorWithForeignNationalRef())
      .issues.includes("FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED")
      && validateCuratedCrossBorderConnectorPack(buildValidDeSkPlannedConnectorPack()).valid,
    no053SchemaTables: !/create table if not exists public\.knowledge_/i.test(migration053)
      && migration053.includes("foreign_national")
      && migration053.includes("FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED")
      && !migration053.includes("grant execute")
      && COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT",
    noPublicRuntime: summary.validation.productionEligible === false,
    noProductionInteraction: true,
  };

  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    process.stdout.write(`${JSON.stringify({
      phaseResult: "BLOCKED", reason: "docker unavailable", staticCases,
      publicRuntimeAuthorized: false, productionInteractionPerformed: false,
    }, null, 2)}\n`);
    process.exitCode = 1;
    return;
  }

  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0d",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let germanCreated = -1;
  let euCreated = -1;
  let deFirst = -1;
  let skFirst = -1;
  let skSecond = -1;
  let connectorFirst = -1;
  let connectorSecond = -1;
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
      if (applied.status !== 0) throw new Error(`apply ${file}: ${applied.stderr.slice(-2500)}`);
    }
    const escaped = INGESTOR_PASSWORD.replaceAll("'", "''");
    if (sql(`
      create role birello_knowledge_ingestor login password '${escaped}';
      grant connect on database ${DATABASE} to birello_knowledge_ingestor;
      grant usage on schema public to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_eu_jurisdiction_anchor(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_foreign_national_adapter_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_de_corridor_routing_pack(jsonb)
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

    germanCreated = semanticCreated((await ingestor.query(DOMAIN_RPC, [german])).rows[0]);
    euCreated = semanticCreated((await ingestor.query(EU_RPC, [eu])).rows[0]);
    deFirst = semanticCreated((await ingestor.query(DE_RPC, [de])).rows[0]);
    skFirst = semanticCreated((await ingestor.query(SK_RPC, [sk])).rows[0]);
    skSecond = semanticCreated((await ingestor.query(SK_RPC, [sk])).rows[0]);
    connectorFirst = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);
    connectorSecond = semanticCreated((await ingestor.query(CONNECTOR_RPC, [connector])).rows[0]);

    const stored = await admin.query(
      `select c.status, c.connected_country, c.activation_from_locale_allowed,
              p.foreign_claim_ids::text[] as foreign_ids,
              p.eu_coordination_claim_ids::text[] as eu_ids,
              p.foreign_process_reference
         from public.knowledge_cross_border_connectors c
         join public.knowledge_cross_border_processes p on p.cross_border_connector_id = c.id
        where c.connected_country='SK'`,
    );
    const skClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='foreign_national' and j.country_code='SK'
         and t.code='sk' and c.claim_language='de'`,
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const corridorProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='de_sk_applicable_legislation_connector'",
    );
    const sourceDupes = await admin.query(
      `select canonical_url, count(*)::int n from public.knowledge_sources
        group by canonical_url having count(*)>1`,
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_table_grants
        where table_schema='public' and table_name like 'knowledge_%'
          and grantee in ('anon','authenticated','public')`,
    );
    const czPack = { ...sk, countryCode: "CZ" as const, packId: SK_AL_PACK_ID };
    const plPack = { ...sk, countryCode: "PL" };
    const huPack = { ...sk, countryCode: "HU" };
    const unknownPack = { ...sk, countryCode: "XX" };

    live.germanIngested = germanCreated > 0;
    live.euIngested = euCreated > 0;
    live.deRoutingIngested = deFirst > 0;
    live.skFirstCreated = skFirst > 0;
    live.skSecondZero = skSecond === 0;
    live.connectorFirstCreated = connectorFirst > 0;
    live.connectorSecondZero = connectorSecond === 0;
    live.skJurisdiction = Number(skClaims.rows[0]?.n) === sk.claims.length;
    live.connectorPreparedNonActive = stored.rows[0]?.status === "prepared"
      && stored.rows[0]?.connected_country === "SK"
      && stored.rows[0]?.activation_from_locale_allowed === false
      && stored.rows[0]?.foreign_process_reference === SK_AL_PRIMARY_PROCESS_KEY
      && Array.isArray(stored.rows[0]?.foreign_ids)
      && stored.rows[0].foreign_ids.length === sk.claims.length
      && Array.isArray(stored.rows[0]?.eu_ids)
      && stored.rows[0].eu_ids.length === DE_SK_EU_CLAIM_KEYS.length
      && Number(activeCorridors.rows[0]?.n) === 0
      && Number(corridorProcesses.rows[0]?.n) === DE_SK_PROCESSES.length;
    live.noSourceDupes = sourceDupes.rows.length === 0;
    live.czBlocked = await rejects(ingestor, SK_RPC, czPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.plBlocked = await rejects(ingestor, SK_RPC, plPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.huBlocked = await rejects(ingestor, SK_RPC, huPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.unknownBlocked = await rejects(ingestor, SK_RPC, unknownPack, "FOREIGN_NATIONAL_COUNTRY_NOT_AUTHORIZED");
    live.cb0bForeignStillRejected = await rejects(
      ingestor, CONNECTOR_RPC, connectorWithForeignNationalRef(),
      "CONNECTOR_FOREIGN_NATIONAL_INGEST_NOT_AUTHORIZED",
    );
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.primaryProcessPresent = DE_AL_PRIMARY_PROCESS_KEY.length > 0;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const allPassed = Object.values(staticCases).every(Boolean) && Object.values(live).every(Boolean);
  process.stdout.write(`${JSON.stringify({
    phaseResult: allPassed ? "PASS" : "FAILED",
    staticCases,
    live,
    germanCreated,
    euCreated,
    deFirst,
    skFirst,
    skSecond,
    connectorFirst,
    connectorSecond,
    eFilingClassification: eFilingClass,
    eFilingEffective: SK_EMPLOYER_EFILING_EFFECTIVE,
    completeness,
    connectorStatus: connector.status,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0D audit failed"}\n`);
  process.exitCode = 1;
});
