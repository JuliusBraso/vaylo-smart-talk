/**
 * CB-0E dedicated local audit for the EU health-insurance coordination core.
 * Disposable PostgreSQL 17 only. No production connection or public runtime.
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import { Client } from "pg";

import { KNOWLEDGE_FACTORY_DOMAINS, validateCuratedDomainPack } from "../source-registry/knowledge-factory-contracts";
import { COD_2016_0397_STATUS } from "../source-registry/cross-border-connector-contracts";
import { germanKindergeldFixture } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
  validateEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  EU_HEALTH_FUTURE_WATCH,
  EU_HEALTH_NEGATIVE_CONTROLS,
  EU_HEALTH_OFFICIAL_SOURCES,
  EU_HEALTH_PACK_ID,
  EU_HEALTH_PROCESS_GROUP,
  EU_HEALTH_PROCESSES,
  EU_SHARED_ART17_CLAIM_KEY,
  EU_SHARED_EHIC_CLAIM_KEY,
  EU_SHARED_S1_CLAIM_KEY,
  EU_SHARED_S2_CLAIM_KEY,
  GERMAN_HEALTH_PACK_BOUNDARY,
  buildEuHealthInsuranceCoordinationPack,
  detectMissingHealthFacts,
  euHealthPackSummary,
  validateEuHealthInsuranceCoordinationPack,
} from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0e_core";
const PASSWORD = `cb0e-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0e-${process.pid}-${randomUUID().slice(0, 8)}`;
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
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Wohnsitz|Kranken|Bescheinigung|Verordnung|Träger|Sachleistung|nicht|keine|kein/iu;
const OFFICIAL_HOSTS = new Set([
  "eur-lex.europa.eu",
  "ec.europa.eu",
  "europa.eu",
  "employment-social-affairs.ec.europa.eu",
]);

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
  const pack = buildEuHealthInsuranceCoordinationPack();
  const euAl = buildEuApplicableLegislationCorePack();
  const german = germanKindergeldFixture();
  const summary = euHealthPackSummary(pack);
  const validation = validateEuHealthInsuranceCoordinationPack(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "eu",
    "health-insurance-coordination", "eu-health-insurance-coordination-core-pack.ts",
  );
  const migration054 = source(
    "supabase", "migrations", "054_add_eu_health_insurance_coordination_ingestion.sql",
  );
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimKeys = new Set(pack.claims.map((claim) => String(claim.key)));
  const uniqueAlKeys = new Set(euAl.claims.map((claim) => String(claim.key)));
  const uniqueSourceUrls = new Set(pack.sources.map((item) => String(item.canonicalUrl)));
  const alUrls = new Set(euAl.sources.map((item) => String(item.canonicalUrl)));
  const keyOverlap = [...uniqueClaimKeys].filter((key) => uniqueAlKeys.has(key));
  const urlOverlap = [...uniqueSourceUrls].filter((url) => alUrls.has(url));

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes(EU_HEALTH_PACK_ID)
      && !factoryContracts.includes("eu_health_insurance_coordination")
      && validateCuratedDomainPack(german).valid,
    euJurisdiction: pack.trustDomain.code === "eu"
      && pack.jurisdictions[0]?.level === "eu"
      && pack.jurisdictions[0]?.countryCode === "EU"
      && pack.canonicalLanguage === "de"
      && pack.packId === EU_HEALTH_PACK_ID,
    applicableStateDependency: /nicht selbst neu/.test(claimText("health-requires-applicable-legislation-result"))
      && !/Lex loci laboris/.test(packSource)
      && !/Artikel 12 Absatz 1/.test(packSource)
      && /Artikel 11 nicht selbst neu/.test(claimText("health-requires-applicable-legislation-result")),
    noArt11Duplication: keyOverlap.length === 0 && urlOverlap.length === 0,
    article17: /Sachleistungen vom Wohnortträger/.test(claimText(EU_SHARED_ART17_CLAIM_KEY))
      && /nicht, dass die Person dort primär/.test(claimText("residence-healthcare-not-second-insurance"))
      && /nicht derselbe wie der Wohnortträger/.test(claimText("competent-institution-not-residence-institution")),
    article18: /Aufenthalts im zuständigen Mitgliedstaat/.test(claimText("art-18-healthcare-in-competent-state"))
      && /Anhang III/.test(claimText("art-18-2-frontier-family-rule"))
      && /nicht als Beschränkungsstaaten aufgeführt/.test(claimText("annex-iii-de-sk-not-listed"))
      && /Dänemark, Irland, Kroatien/.test(claimText("annex-iii-current-list")),
    article19: /medizinisch notwendig/.test(claimText("art-19-temporary-stay-medically-necessary"))
      && /keine Notfall-only-Karte/.test(claimText("ehic-not-emergency-only")),
    article20: /vorherigen Genehmigung/.test(claimText("art-20-planned-treatment-needs-authorisation"))
      && /medizinisch vertretbaren Zeitraums/.test(claimText("art-20-2-authorisation-conditions"))
      && /nicht automatisch S2/.test(claimText("waiting-list-not-automatic-s2")),
    implementing987: /Artikel 24 der Verordnung 987/.test(claimText("s1-registration-procedure-987-24"))
      && /genaue Höhe darf/.test(claimText("reimbursement-orientation-not-amount"))
      && /zuständigen Träger/.test(claimText("non-resident-s2-residence-forwards-competent-decides")),
    s1: /Wohnmitgliedstaat zur Gesundheitsversorgung/.test(claimText(EU_SHARED_S1_CLAIM_KEY))
      && /nicht A1/.test(claimText("s1-not-a1"))
      && /vollendet nicht automatisch die Eintragung/.test(claimText("s1-issued-not-residence-registration-complete"))
      && /unbefristeten Anspruch/.test(claimText("old-s1-not-entitlement-forever")),
    residenceVsStay: /Mittelpunkt der Interessen/.test(claimText("eu-residence-is-centre-of-interests"))
      && /trvalý pobyt ist nicht automatisch/.test(claimText("trvaly-pobyt-not-automatic-eu-residence"))
      && /deutsche Anmeldung ist nicht automatisch/.test(claimText("anmeldung-not-automatic-eu-residence"))
      && /nicht automatisch S1/.test(claimText("posting-not-automatic-s1")),
    ehic: /vorübergehenden Aufenthalts/.test(claimText(EU_SHARED_EHIC_CLAIM_KEY))
      && /zuständigen Versicherungsstaats/.test(claimText("ehic-issuer-is-competent-institution"))
      && /keine Reiseversicherung/.test(claimText("ehic-not-travel-insurance"))
      && /nicht die Ermächtigung/.test(claimText("ehic-not-planned-treatment"))
      && /Ersatzbescheinigung/.test(claimText("prc-same-entitlement-as-ehic")),
    s2: /Artikel 20 der Verordnung 883/.test(claimText(EU_SHARED_S2_CLAIM_KEY))
      && /Wohnortträger den Genehmigungsantrag/.test(claimText("non-resident-s2-residence-forwards-competent-decides")),
    directiveSeparated: /nicht derselbe Weg/.test(claimText("directive-2011-24-not-regulation-s2"))
      && /keine Erstattungsmaschine/.test(claimText("directive-engine-not-implemented")),
    gkvPkvBoundary: /Health-Insurance-Orientation-Pack/.test(claimText("gkv-pkv-classified-by-german-pack"))
      && GERMAN_HEALTH_PACK_BOUNDARY[0]?.pack === "health_insurance_orientation"
      && !packSource.includes("validateCuratedDomainPack"),
    slovakInsurerBoundary: /nicht automatisch der slowakische Krankenversicherungsträger/.test(
      claimText("socialna-poistovna-not-slovak-health-insurer"),
    ),
    cashBoundary: /nicht dieselben Leistungen wie Sachleistungen/.test(claimText("cash-sickness-not-benefits-in-kind")),
    processComplete: EU_HEALTH_PROCESSES.length === 25
      && PROCESS_COMPLETE_DIMENSIONS.length === 12
      && summary.processCompletenessPercent === 100
      && summary.blockedScenarioCount === 0
      && summary.totalScenarios === 48
      && summary.coveredScenarioCount === 43
      && summary.outOfScopeScenarioCount === 5
      && EU_HEALTH_NEGATIVE_CONTROLS.every((key) => uniqueClaimKeys.has(key)),
    officialSourcesOnly: EU_HEALTH_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === pack.sources.length
      && pack.sources.every((item) => !/#|wikipedia|reddit|expat|blog|forum/iu.test(String(item.canonicalUrl))),
    germanNormalizedLanguage: pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    proposedExcluded: COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && EU_HEALTH_FUTURE_WATCH.every((item) => item.ingestible === false)
      && detectMissingHealthFacts({}).includes("competentState"),
    noNationalHealthPacks: !packSource.includes("sk_health")
      && !packSource.includes("de_sk_health")
      && !/create table if not exists public\.knowledge_/i.test(migration054),
    validationPass: validation.valid && validation.productionEligible === false,
    euAlStillValid: validateEuApplicableLegislationCorePack(euAl).valid,
    noPublicRuntime: true,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0e",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let germanCreated = -1;
  let euAlCreated = -1;
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
    euAlCreated = semanticCreated((await ingestor.query(EU_RPC, [euAl])).rows[0]);
    firstCreated = semanticCreated((await ingestor.query(EU_RPC, [pack])).rows[0]);
    secondCreated = semanticCreated((await ingestor.query(EU_RPC, [pack])).rows[0]);

    const euClaims = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where j.jurisdiction_level='eu' and j.country_code='EU' and t.code='eu' and c.claim_language='de'
         and c.id = any($1::uuid[])`,
      [pack.claims.map((claim) => claim.id)],
    );
    const packClaims = await admin.query(
      "select count(*)::int n from public.knowledge_claims where id = any($1::uuid[])",
      [pack.claims.map((claim) => claim.id)],
    );
    const sourceDupes = await admin.query(
      `select canonical_url, count(*)::int n from public.knowledge_sources
        group by canonical_url having count(*)>1`,
    );
    const claimDupes = await admin.query(
      `select claim_text_canonical, count(*)::int n from public.knowledge_claims
        group by claim_text_canonical, jurisdiction_id having count(*)>1`,
    );
    const processesIngested = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id=$1",
      [EU_HEALTH_PROCESS_GROUP],
    );
    const alProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_applicable_legislation'",
    );
    const processLinks = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1`,
      [EU_HEALTH_PROCESS_GROUP],
    );
    const metadata = await admin.query(
      `select count(*)::int n from public.knowledge_retrieval_metadata r
        join public.knowledge_claims c on c.id=r.entity_id
       where r.entity_type='claim'
         and r.jurisdiction_filter_required
         and r.trust_domain_filter_required
         and r.effective_date_filter_required
         and c.id = any($1::uuid[])`,
      [pack.claims.map((claim) => claim.id)],
    );
    const skNational = await admin.query(
      `select count(*)::int n from public.knowledge_jurisdictions
        where country_code in ('SK','CZ','PL','HU')`,
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name='knowledge_ingest_curated_eu_jurisdiction_anchor'
          and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );
    const groupCheck = await admin.query(
      `select pg_get_constraintdef(oid) as def from pg_constraint
        where conname='knowledge_processes_process_group_id_check'`,
    );
    const proposedPack = {
      ...pack,
      claims: pack.claims.map((claim, index) => index === 0
        ? { ...claim, temporalClass: "PROPOSED_NOT_CURRENT" }
        : claim),
    };
    const skEu = {
      ...pack,
      jurisdictions: [{ ...pack.jurisdictions[0]!, countryCode: "SK", code: "SK" as const }],
    };

    live.germanRegression = germanCreated > 0;
    live.euAlRegression = euAlCreated > 0
      && Number(alProcesses.rows[0]?.n) === euAl.processes.length;
    live.firstSemanticCreatedPositive = firstCreated > 0;
    live.secondSemanticCreatedZero = secondCreated === 0;
    live.packClaimsOnce = Number(packClaims.rows[0]?.n) === pack.claims.length;
    live.euJurisdictionAndTrust = Number(euClaims.rows[0]?.n) === pack.claims.length;
    live.noSourceDuplicates = sourceDupes.rows.length === 0;
    live.noClaimDuplicates = claimDupes.rows.length === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length;
    live.processesIngested = Number(processesIngested.rows[0]?.n) === pack.processes.length;
    live.processLinksIngested = Number(processLinks.rows[0]?.n) === pack.processClaimLinks.length;
    live.noSkCzPlHuNational = Number(skNational.rows[0]?.n) === 0
      && await rejects(ingestor, EU_RPC, skEu, "EU_ANCHOR_FOREIGN_NATIONAL_FORBIDDEN");
    live.proposedExcluded = await rejects(ingestor, EU_RPC, proposedPack, "EU_ANCHOR_NON_CURRENT");
    live.activeCorridorsZero = Number(activeCorridors.rows[0]?.n) === 0;
    live.processGroupAllowed = String(groupCheck.rows[0]?.def ?? "").includes(EU_HEALTH_PROCESS_GROUP)
      && String(groupCheck.rows[0]?.def ?? "").includes("eu_applicable_legislation");
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.noPublicRuntime = true;
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
    euAlCreated,
    firstCreated,
    secondCreated,
    summary,
    keyOverlap,
    urlOverlap,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0E audit failed"}\n`);
  process.exitCode = 1;
});
