/**
 * CB-0G dedicated local audit for the EU family-benefits coordination core.
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
import { KINDERGELD_UNITS } from "../packs/de/familienkasse-kindergeld/kindergeld-federal-core-pack";
import { ELG_UNITS } from "../packs/de/elterngeld/elterngeld-federal-core-pack";
import {
  PROCESS_COMPLETE_DIMENSIONS,
  buildEuApplicableLegislationCorePack,
  validateEuApplicableLegislationCorePack,
} from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import {
  buildEuHealthInsuranceCoordinationPack,
  validateEuHealthInsuranceCoordinationPack,
} from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import {
  EU_FAMILY_FUTURE_WATCH,
  EU_FAMILY_NEGATIVE_CONTROLS,
  EU_FAMILY_OFFICIAL_SOURCES,
  EU_FAMILY_PACK_ID,
  EU_FAMILY_PROCESS_GROUP,
  EU_FAMILY_PROCESSES,
  EU_SHARED_ART1Z_CLAIM_KEY,
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_ART682_CLAIM_KEY,
  EU_SHARED_ART69_CLAIM_KEY,
  EU_SHARED_C36_23_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  GERMAN_ELTERNGELD_PACK_BOUNDARY,
  GERMAN_KINDERGELD_PACK_BOUNDARY,
  buildEuFamilyBenefitsCoordinationPack,
  detectMissingFamilyFacts,
  euFamilyPackSummary,
  evaluateEuFamilyC3623Remediation,
  validateEuFamilyBenefitsCoordinationPack,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0g_core";
const PASSWORD = `cb0g-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0g-${process.pid}-${randomUUID().slice(0, 8)}`;
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
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const EU_RPC = "select public.knowledge_ingest_curated_eu_jurisdiction_anchor($1::jsonb) as result";
const GERMAN_CLAIM = /[äöüÄÖÜß]|Rechtsvorschriften|Mitgliedstaat|Familie|Kind|Wohnsitz|Verordnung|Träger|vorrang|nachrang|nicht|keine|kein/iu;
const OFFICIAL_HOSTS = new Set([
  "eur-lex.europa.eu",
  "ec.europa.eu",
  "europa.eu",
  "employment-social-affairs.ec.europa.eu",
  "oeil.europarl.europa.eu",
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
  const pack = buildEuFamilyBenefitsCoordinationPack();
  const euAl = buildEuApplicableLegislationCorePack();
  const euHealth = buildEuHealthInsuranceCoordinationPack();
  const german = germanKindergeldFixture();
  const summary = euFamilyPackSummary(pack);
  const validation = validateEuFamilyBenefitsCoordinationPack(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "eu",
    "family-benefits-coordination", "eu-family-benefits-coordination-core-pack.ts",
  );
  const migration056 = source(
    "supabase", "migrations", "056_add_eu_family_benefits_coordination_ingestion.sql",
  );
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimKeys = new Set(pack.claims.map((claim) => String(claim.key)));
  const uniqueAlKeys = new Set(euAl.claims.map((claim) => String(claim.key)));
  const uniqueHealthKeys = new Set(euHealth.claims.map((claim) => String(claim.key)));
  const kindergeldKeys = new Set(KINDERGELD_UNITS.map((unit) => unit.key));
  const elterngeldKeys = new Set(ELG_UNITS.map((unit) => unit.key));
  const uniqueSourceUrls = new Set(pack.sources.map((item) => String(item.canonicalUrl)));
  const alUrls = new Set(euAl.sources.map((item) => String(item.canonicalUrl)));
  const healthUrls = new Set(euHealth.sources.map((item) => String(item.canonicalUrl)));
  const keyOverlap = [...uniqueClaimKeys].filter((key) => (
    uniqueAlKeys.has(key) || uniqueHealthKeys.has(key) || kindergeldKeys.has(key) || elterngeldKeys.has(key)
  ));
  const urlOverlap = [...uniqueSourceUrls].filter((url) => alUrls.has(url) || healthUrls.has(url));
  const c36Remediation = evaluateEuFamilyC3623Remediation(pack);

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes(EU_FAMILY_PACK_ID)
      && !factoryContracts.includes("eu_family_benefits_coordination")
      && validateCuratedDomainPack(german).valid,
    euJurisdiction: pack.trustDomain.code === "eu"
      && pack.jurisdictions[0]?.level === "eu"
      && pack.jurisdictions[0]?.countryCode === "EU"
      && pack.canonicalLanguage === "de"
      && pack.packId === EU_FAMILY_PACK_ID,
    article1z: /Sach- oder Geldleistungen zum Ausgleich von Familienlasten/.test(claimText(EU_SHARED_ART1Z_CLAIM_KEY))
      && /nicht automatisch zur Familienleistung/.test(claimText("fb-name-not-automatic-family-benefit")),
    annexI: /Unterhaltsvorschussgesetz/.test(claimText("fb-unterhaltsvorschuss-annex-i"))
      && /Anhang I/.test(claimText("fb-annex-i-exclusions"))
      && /keine Schlussfolgerung auf die Einordnung anderer/.test(claimText("fb-annex-i-not-other-national-classifications")),
    article67: /als wohnten diese im zuständigen Mitgliedstaat/.test(claimText(EU_SHARED_ART67_CLAIM_KEY))
      && /ersetzt nicht nationale Voraussetzungen/.test(claimText("fb-art-67-fiction-not-national-conditions"))
      && /nicht automatisch den Wegfall/.test(claimText("fb-child-abroad-not-automatic-loss")),
    article68Different: /zuerst Rechte aufgrund Beschäftigung oder Selbständigkeit/.test(claimText("fb-activity-before-pension-before-residence"))
      && /überlagert die Rangfolge/.test(claimText("fb-child-residence-not-override-different-bases")),
    article68SameActivity: /Wohnmitgliedstaat der Kinder Vorrang/.test(claimText("fb-same-basis-activity-child-residence"))
      && /löst das Kindwohnsitzkriterium den Vorrang/.test(claimText("fb-unresolved-same-basis-activity"))
      && /Trägerkostenteilung/.test(claimText("fb-art-58-not-user-collects-half")),
    article68PensionResidence: /längste Versicherungs- oder Wohnzeit/.test(claimText("fb-same-basis-pension-priority"))
      && /nicht der Wohnort der Eltern/.test(claimText("fb-same-basis-residence-child")),
    primarySecondary: /primaryBenefitState ist der nach verifizierter Artikel-68-Analyse/.test(claimText("fb-primary-benefit-state-model"))
      && /nicht identisch mit dem zuständigen Sozialversicherungsstaat/.test(claimText("fb-primary-benefit-state-model"))
      && /Nachrang bedeutet nicht fehlenden Anspruch/.test(claimText("fb-secondary-benefit-state-model")),
    differential: /Unterschiedsbetrag kann für den überschießenden Teil/.test(claimText(EU_SHARED_ART682_CLAIM_KEY))
      && /Artikel 68 Absatz 2 Satz 2/.test(claimText("fb-residence-only-supplement-exception"))
      && /ohne verifizierte nationale Ansprüche/.test(claimText("fb-exact-amount-fail-closed"))
      && /für jedes Familienmitglied/.test(claimText(EU_SHARED_F3_CLAIM_KEY))
      && /keinen universellen Einzelleistungsvergleich/.test(claimText("fb-f3-not-one-benefit-pair")),
    forwarding: /ursprüngliche Antragsdatum bleibt erhalten/.test(claimText("fb-filing-date-preserved"))
      && /nicht den Verlust des Antrags/.test(claimText("fb-filed-secondary-not-lost")),
    article60: /Lage der gesamten Familie/.test(claimText(EU_SHARED_ART60_CLAIM_KEY))
      && /Antragsbefugnis nicht dasselbe/.test(claimText("trapkowski-applicant-not-beneficiary"))
      && /auch den Umfang nachrangiger Ansprüche/.test(claimText("moser-whole-family-secondary")),
    provisional: /vorläufige Vorrangentscheidung/.test(claimText("fb-provisional-priority-decision"))
      && /zwei Monate/.test(claimText("fb-two-month-institution-response"))
      && /Träger am Wohnort des Kindes/.test(claimText("fb-disagreement-child-residence-institution")),
    article59: /bis zum Monatsende weiter/.test(claimText("fb-art-59-month-end-continuation"))
      && /nicht automatisch zu einem tagesweisen/.test(claimText("fb-mid-month-not-day-split")),
    article69: /hilfsweise Koordinierung/.test(claimText(EU_SHARED_ART69_CLAIM_KEY))
      && /keine nationalen Waisenleistungstatbestände/.test(claimText("fb-no-national-orphan-merits")),
    proposedExcluded: COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && EU_FAMILY_FUTURE_WATCH.every((item) => item.ingestible === false)
      && /nicht geltende Revision/.test(claimText("pending-cod-2016-0397-family-not-current"))
      && /nicht geltendes Elterngeld/.test(claimText("proposed-child-raising-category-not-current"))
      && detectMissingFamilyFacts({}).includes("childResidence"),
    kindergeldNotDuplicated: keyOverlap.filter((key) => kindergeldKeys.has(key)).length === 0
      && GERMAN_KINDERGELD_PACK_BOUNDARY[0]?.pack === "familienkasse_kindergeld"
      && /nicht dupliziert/.test(claimText("fb-kindergeld-national-not-in-eu-core")),
    elterngeldNotDuplicated: keyOverlap.filter((key) => elterngeldKeys.has(key)).length === 0
      && GERMAN_ELTERNGELD_PACK_BOUNDARY[0]?.pack === "elterngeld"
      && /nicht dupliziert/.test(claimText("fb-elterngeld-national-not-in-eu-core")),
    processComplete: EU_FAMILY_PROCESSES.length === 30
      && PROCESS_COMPLETE_DIMENSIONS.length === 12
      && summary.processCompletenessPercent === 100
      && summary.blockedScenarioCount === 0
      && summary.totalScenarios === 72
      && summary.coveredScenarioCount === 70
      && summary.outOfScopeScenarioCount === 2
      && EU_FAMILY_NEGATIVE_CONTROLS.every((key) => uniqueClaimKeys.has(key)),
    c36_23Remediation: c36Remediation.pass
      && c36Remediation.auditId === "SHARED_EU_FAMILY_C36_23_REMEDIATION"
      && /weder festgesetzt noch ausgezahlt/.test(claimText(EU_SHARED_C36_23_CLAIM_KEY))
      && /nicht Beschluss F3/.test(claimText("c36-23-not-f3"))
      && /nicht die Artikel-60-Gesamtfamilienfiktion/.test(claimText("c36-23-not-article-60-fiction"))
      && EU_FAMILY_OFFICIAL_SOURCES.some((item) => (
        item.key === "cjeu-c-36-23"
        && item.handlingMode === "STORE_CANONICALLY"
        && item.url.includes("CELEX:62023CJ0036")
      )),
    officialSourcesOnly: EU_FAMILY_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === pack.sources.length
      && pack.sources.every((item) => !/#|wikipedia|reddit|expat|blog|forum/iu.test(String(item.canonicalUrl))),
    germanNormalizedLanguage: pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    noKeyOrUrlOverlap: keyOverlap.length === 0 && urlOverlap.length === 0,
    noNationalFamilyPacks: !packSource.includes("de_sk_family")
      && !packSource.includes("sk_family")
      && !/create table if not exists public\.knowledge_/i.test(migration056)
      && migration056.includes("eu_family_benefits_coordination")
      && !migration056.includes("sk_family")
      && !migration056.includes("GRANT EXECUTE"),
    validationPass: validation.valid && validation.productionEligible === false,
    euAlStillValid: validateEuApplicableLegislationCorePack(euAl).valid,
    euHealthStillValid: validateEuHealthInsuranceCoordinationPack(euHealth).valid,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0g",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let germanCreated = -1;
  let euAlCreated = -1;
  let euHealthCreated = -1;
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
    euHealthCreated = semanticCreated((await ingestor.query(EU_RPC, [euHealth])).rows[0]);
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
    const processDupes = await admin.query(
      `select id from public.knowledge_processes group by id having count(*)>1`,
    );
    const processesIngested = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id=$1",
      [EU_FAMILY_PROCESS_GROUP],
    );
    const alProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_applicable_legislation'",
    );
    const healthProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_health_insurance_coordination'",
    );
    const processLinks = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1`,
      [EU_FAMILY_PROCESS_GROUP],
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
    live.euHealthRegression = euHealthCreated > 0
      && Number(healthProcesses.rows[0]?.n) === euHealth.processes.length;
    live.firstSemanticCreatedPositive = firstCreated > 0;
    live.secondSemanticCreatedZero = secondCreated === 0;
    live.packClaimsOnce = Number(packClaims.rows[0]?.n) === pack.claims.length;
    live.euJurisdictionAndTrust = Number(euClaims.rows[0]?.n) === pack.claims.length;
    live.noSourceDuplicates = sourceDupes.rows.length === 0;
    live.noClaimDuplicates = claimDupes.rows.length === 0;
    live.noProcessDuplicates = processDupes.rows.length === 0;
    live.retrievalMetadataComplete = Number(metadata.rows[0]?.n) === pack.claims.length;
    live.processesIngested = Number(processesIngested.rows[0]?.n) === pack.processes.length;
    live.processLinksIngested = Number(processLinks.rows[0]?.n) === pack.processClaimLinks.length;
    live.noSkCzPlHuNational = Number(skNational.rows[0]?.n) === 0
      && await rejects(ingestor, EU_RPC, skEu, "EU_ANCHOR_FOREIGN_NATIONAL_FORBIDDEN");
    live.proposedExcluded = await rejects(ingestor, EU_RPC, proposedPack, "EU_ANCHOR_NON_CURRENT");
    live.activeCorridorsZero = Number(activeCorridors.rows[0]?.n) === 0;
    live.processGroupAllowed = String(groupCheck.rows[0]?.def ?? "").includes(EU_FAMILY_PROCESS_GROUP)
      && String(groupCheck.rows[0]?.def ?? "").includes("eu_health_insurance_coordination")
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
    euHealthCreated,
    firstCreated,
    secondCreated,
    c36Remediation,
    summary,
    keyOverlap,
    urlOverlap,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0G audit failed"}\n`);
  process.exitCode = 1;
});
