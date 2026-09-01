/**
 * CB-0I dedicated local audit for the EU unemployment-coordination core.
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
import { ALG_UNITS } from "../packs/de/arbeitslosengeld/arbeitslosengeld-federal-core-pack";
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
  buildEuFamilyBenefitsCoordinationPack,
  validateEuFamilyBenefitsCoordinationPack,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import {
  EU_SHARED_ART1F_CLAIM_KEY,
  EU_SHARED_ART61_CLAIM_KEY,
  EU_SHARED_ART62_CLAIM_KEY,
  EU_SHARED_ART64_CLAIM_KEY,
  EU_SHARED_ART65_CLAIM_KEY,
  EU_SHARED_ART65A_CLAIM_KEY,
  EU_UNEMP_REG_883_CURRENT_CELEX,
  EU_UNEMP_REG_883_CURRENT_CONSOLIDATION_DATE,
  EU_UNEMP_REG_987_CURRENT_CELEX,
  EU_UNEMP_REG_987_CURRENT_CONSOLIDATION_DATE,
  EU_SHARED_DECISION_U3_CLAIM_KEY,
  EU_SHARED_JELTES_CLAIM_KEY,
  EU_SHARED_PD_U1_CLAIM_KEY,
  EU_SHARED_PD_U2_CLAIM_KEY,
  EU_SHARED_PD_U3_CLAIM_KEY,
  EU_UNEMP_FUTURE_WATCH,
  EU_UNEMP_NEGATIVE_CONTROLS,
  EU_UNEMP_OFFICIAL_SOURCES,
  EU_UNEMP_PACK_ID,
  EU_UNEMP_PROCESS_GROUP,
  EU_UNEMP_PROCESSES,
  GERMAN_ALG_PACK_BOUNDARY,
  REUSED_EU_RESIDENCE_CLAIM_KEYS,
  buildEuUnemploymentCoordinationPack,
  detectMissingUnemploymentFacts,
  euUnempPackSummary,
  validateEuUnemploymentCoordinationPack,
} from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb0i_core";
const PASSWORD = `cb0i-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cb0i-${process.pid}-${randomUUID().slice(0, 8)}`;
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
const ALG_FORBIDDEN_KEYS = [
  "pd-u1-insurance-periods",
  "pd-u2-export-job-search",
  "u2-three-months-extend-six",
  "apply-u2-before-leaving",
  "u1-not-u2",
  "u2-not-ordinary-travel",
  "egvo-unemployment-export",
  "domestic-absence-not-u2",
] as const;

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
  const pack = buildEuUnemploymentCoordinationPack();
  const euAl = buildEuApplicableLegislationCorePack();
  const euHealth = buildEuHealthInsuranceCoordinationPack();
  const euFamily = buildEuFamilyBenefitsCoordinationPack();
  const german = germanKindergeldFixture();
  const summary = euUnempPackSummary(pack);
  const validation = validateEuUnemploymentCoordinationPack(pack);
  const packSource = source(
    "lib", "vaylo", "smart-talk", "knowledge", "packs", "eu",
    "unemployment-coordination", "eu-unemployment-coordination-core-pack.ts",
  );
  const migration058 = source(
    "supabase", "migrations", "058_add_eu_unemployment_coordination_ingestion.sql",
  );
  const factoryContracts = source(
    "lib", "vaylo", "smart-talk", "knowledge", "source-registry", "knowledge-factory-contracts.ts",
  );
  const claimText = (key: string) => String(pack.claims.find((claim) => claim.key === key)?.text ?? "");
  const uniqueClaimKeys = new Set(pack.claims.map((claim) => String(claim.key)));
  const uniqueAlKeys = new Set(euAl.claims.map((claim) => String(claim.key)));
  const uniqueHealthKeys = new Set(euHealth.claims.map((claim) => String(claim.key)));
  const uniqueFamilyKeys = new Set(euFamily.claims.map((claim) => String(claim.key)));
  const algKeys = new Set(ALG_UNITS.map((unit) => unit.key));
  const uniqueSourceUrls = new Set(pack.sources.map((item) => String(item.canonicalUrl)));
  const alUrls = new Set(euAl.sources.map((item) => String(item.canonicalUrl)));
  const healthUrls = new Set(euHealth.sources.map((item) => String(item.canonicalUrl)));
  const familyUrls = new Set(euFamily.sources.map((item) => String(item.canonicalUrl)));
  const keyOverlap = [...uniqueClaimKeys].filter((key) => (
    uniqueAlKeys.has(key) || uniqueHealthKeys.has(key) || uniqueFamilyKeys.has(key) || algKeys.has(key)
  ));
  const urlOverlap = [...uniqueSourceUrls].filter((url) => (
    alUrls.has(url) || healthUrls.has(url) || familyUrls.has(url)
  ));
  const algKeyReuse = ALG_FORBIDDEN_KEYS.filter((key) => uniqueClaimKeys.has(key));

  const staticCases = {
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes(EU_UNEMP_PACK_ID)
      && !factoryContracts.includes("eu_unemployment_coordination")
      && validateCuratedDomainPack(german).valid,
    euJurisdiction: pack.trustDomain.code === "eu"
      && pack.jurisdictions[0]?.level === "eu"
      && pack.jurisdictions[0]?.countryCode === "EU"
      && pack.canonicalLanguage === "de"
      && pack.packId === EU_UNEMP_PACK_ID,
    currentConsolidations: EU_UNEMP_REG_883_CURRENT_CELEX === "02004R0883-20190731"
      && EU_UNEMP_REG_987_CURRENT_CELEX === "02009R0987-20180101"
      && EU_UNEMP_REG_883_CURRENT_CONSOLIDATION_DATE === "2019-07-31"
      && EU_UNEMP_REG_987_CURRENT_CONSOLIDATION_DATE === "2018-01-01"
      && pack.sources.some((item) => String(item.canonicalUrl).includes(EU_UNEMP_REG_883_CURRENT_CELEX))
      && pack.sources.some((item) => String(item.canonicalUrl).includes(EU_UNEMP_REG_987_CURRENT_CELEX))
      && pack.sources.every((item) => !String(item.canonicalUrl).includes("02009R0987-20190731"))
      && !packSource.includes("02009R0987-20190731")
      && packSource.includes("02009R0987-20180101")
      && /31\. Juli 2019/.test(claimText("ue-current-883-987-baseline"))
      && /1\. Januar 2018/.test(claimText("ue-current-883-987-baseline")),
    frontierWorker: /täglich oder mindestens einmal wöchentlich/.test(claimText(EU_SHARED_ART1F_CLAIM_KEY))
      && /nicht automatisch Grenzarbeitnehmer/.test(claimText("ue-cross-border-not-auto-frontier"))
      && /Rückkehrhäufigkeit/.test(claimText("ue-return-frequency-required")),
    residenceReused: REUSED_EU_RESIDENCE_CLAIM_KEYS.includes("art-11-not-otherwise-covered-residence")
      && !uniqueClaimKeys.has("art-11-not-otherwise-covered-residence")
      && /Mittelpunkt der Interessen/.test(claimText("ue-residence-centre-of-interests"))
      && /nicht aus trvalý pobyt/.test(claimText("ue-residence-centre-of-interests")),
    unemploymentType: /Vollarbeitslosigkeit, Teilarbeitslosigkeit oder intermittierende/.test(claimText("ue-type-gate-mandatory"))
      && /vertragliches Beschäftigungsverhältnis/.test(claimText(EU_SHARED_DECISION_U3_CLAIM_KEY))
      && /nicht automatisch Vollarbeitslosigkeit/.test(claimText("ue-zero-hours-not-whole"))
      && /nicht das Portable Document U3/.test(claimText("ue-decision-u3-not-portable-u3")),
    article651: /teilweise oder intermittierend arbeitslose Person/.test(claimText("ue-art-65-1-partial-intermittent"))
      && /nicht automatisch zur Wohnsitz-Arbeitslosenleistung/.test(claimText("ue-partial-not-residence-route")),
    wholeFrontier: /Wohnmitgliedstaats/.test(claimText(EU_SHARED_ART65_CLAIM_KEY))
      && /nicht der leistende Staat/.test(claimText("ue-last-work-not-payer-frontier"))
      && /ergänzend/.test(claimText("ue-supplementary-registration"))
      && /keine zweite Arbeitslosenleistung/.test(claimText("ue-supplementary-not-second-benefit"))
      && /Jeltes/.test(claimText(EU_SHARED_JELTES_CLAIM_KEY))
      && /Miethe-Ausnahme/.test(claimText("ue-do-not-resurrect-miethe")),
    nonFrontier: /keine Grenzarbeitnehmer/.test(claimText("ue-decision-u2-non-frontier-scope"))
      && /nicht das Portable Document U2/.test(claimText("ue-decision-u2-not-portable-u2"))
      && /Wohnsitzweg/.test(claimText("ue-non-frontier-return-residence"))
      && /nicht in den Wohnmitgliedstaat zurück/.test(claimText("ue-non-frontier-remain-last-state"))
      && /Artikel 64 verlangen/.test(claimText("ue-art-65-5b-transition")),
    aggregation: /Versicherungs-, Beschäftigungs- oder Selbständigkeitszeiten/.test(claimText(EU_SHARED_ART61_CLAIM_KEY))
      && /nicht automatisch als Versicherungszeiten/.test(claimText("ue-art-61-category-compatibility"))
      && /Artikel 61 Absatz 2/.test(claimText("ue-art-61-2-recent-period"))
      && /nicht in Fällen des Artikels 65 Absatz 5 Buchstabe a/.test(claimText("ue-art-61-2-except-65-5a")),
    u1: /bescheinigt/.test(claimText(EU_SHARED_PD_U1_CLAIM_KEY))
      && /nicht Leistungsbewilligung/.test(claimText(EU_SHARED_PD_U1_CLAIM_KEY))
      && /nicht automatisch unmöglich/.test(claimText("ue-u1-absence-not-impossible"))
      && /Trägerweg/.test(claimText("ue-institutional-period-exchange")),
    calculation: /Entgeltquelle/.test(claimText(EU_SHARED_ART62_CLAIM_KEY))
      && /tatsächlich im Staat der letzten Tätigkeit/.test(claimText("ue-art-62-3-residence-uses-activity-salary"))
      && /keinen Mittelwert/.test(claimText("ue-not-average-both-states"))
      && /Artikel 54 Absatz 2/.test(claimText("ue-art-54-2-salary-exchange"))
      && /Beschluss U1 der Verwaltungskommission/.test(claimText("ue-decision-u1-family-increases")),
    export: /bestehenden Anspruch/.test(claimText(EU_SHARED_ART64_CLAIM_KEY))
      && /vier Wochen/.test(claimText("ue-art-64-four-week-default"))
      && /frühere Abreise genehmigen/.test(claimText("ue-four-week-not-absolute"))
      && /sieben Tagen/.test(claimText("ue-art-64-seven-day-registration"))
      && /drei Monate/.test(claimText("ue-art-64-three-month-standard"))
      && /höchstens sechs Monate/.test(claimText("ue-art-64-extend-max-six"))
      && /zuständige Träger/.test(claimText("ue-payer-remains-competent"))
      && /Artikel 55/.test(claimText("ue-destination-controls-art-55"))
      && /Genehmigung/.test(claimText(EU_SHARED_PD_U2_CLAIM_KEY)),
    portableU3: /Umstände entstanden sind/.test(claimText(EU_SHARED_PD_U3_CLAIM_KEY))
      && /keine automatische endgültige Einstellung/.test(claimText("ue-u3-not-auto-cancellation"))
      && /nicht das Portable Document U3/.test(claimText("ue-decision-u3-not-portable-u3")),
    reimbursement: /ersten drei Monate erstatten/.test(claimText("ue-art-65-reimburse-3-months"))
      && /fünf Monate/.test(claimText("ue-art-65-reimburse-5-months"))
      && /nicht zwei Leistungen/.test(claimText("ue-reimburse-not-two-benefits"))
      && /Beschluss U4/.test(claimText("ue-decision-u4-back-office")),
    article65a: /amtlich mitgeteilt/.test(claimText(EU_SHARED_ART65A_CLAIM_KEY))
      && /nicht automatisch unter Artikel 65a/.test(claimText("ue-self-employed-not-auto-65a"))
      && /Mitteilungslage/.test(claimText("ue-art-65a-notification-lookup"))
      && /Vier-Wochen-Bedingung/.test(claimText("ue-art-65a-no-four-week")),
    selfEmployedBranch: /beschäftigt oder selbständig tätig/.test(claimText(EU_SHARED_ART1F_CLAIM_KEY))
      && /Selbständigkeitszeiten/.test(claimText(EU_SHARED_ART61_CLAIM_KEY))
      && pack.passages.some((passage) => /Berufseinkommen/.test(String(passage.text)))
      && /Entgelt/.test(claimText(EU_SHARED_ART62_CLAIM_KEY))
      && /Wohnmitgliedstaats/.test(claimText(EU_SHARED_ART65_CLAIM_KEY))
      && /letzter selbständiger Tätigkeit/.test(claimText(EU_SHARED_ART65A_CLAIM_KEY))
      && /nicht automatisch unter Artikel 65a/.test(claimText("ue-self-employed-not-auto-65a"))
      && detectMissingUnemploymentFacts({ lastActivityType: "SELF_EMPLOYED" }).includes("article65aNotification"),
    civilServants: /besonderen Arbeitslosensystems für Beamte/.test(claimText("ue-art-57-civil-servant"))
      && /nicht automatisch über den gewöhnlichen Artikel-56-Weg/.test(claimText("ue-civil-servant-not-ordinary-56")),
    proposedExcluded: COD_2016_0397_STATUS === "PROPOSED_NOT_CURRENT"
      && EU_UNEMP_FUTURE_WATCH.every((item) => item.ingestible === false)
      && /nicht geltende Revision/.test(claimText("ue-pending-cod-not-current"))
      && /nicht geltendes Artikel-64-Recht/.test(claimText("ue-proposed-six-month-not-current"))
      && /nicht geltendes Artikel-65-Recht/.test(claimText("ue-proposed-22-week-not-current"))
      && detectMissingUnemploymentFacts({}).includes("residence")
      && detectMissingUnemploymentFacts({ lastActivityType: "SELF_EMPLOYED" }).includes("article65aNotification"),
    algNotDuplicated: keyOverlap.filter((key) => algKeys.has(key)).length === 0
      && algKeyReuse.length === 0
      && GERMAN_ALG_PACK_BOUNDARY[0]?.pack === "arbeitslosengeld"
      && /nicht dupliziert/.test(claimText("ue-alg-national-not-in-eu-core")),
    processComplete: EU_UNEMP_PROCESSES.length === 40
      && PROCESS_COMPLETE_DIMENSIONS.length === 12
      && summary.processCompletenessPercent === 100
      && summary.blockedScenarioCount === 0
      && summary.totalScenarios === 84
      && summary.coveredScenarioCount === 82
      && summary.outOfScopeScenarioCount === 2
      && EU_UNEMP_NEGATIVE_CONTROLS.every((key) => uniqueClaimKeys.has(key)),
    officialSourcesOnly: EU_UNEMP_OFFICIAL_SOURCES.every((item) => OFFICIAL_HOSTS.has(item.officialDomain))
      && uniqueSourceUrls.size === pack.sources.length
      && pack.sources.every((item) => !/#|wikipedia|reddit|expat|blog|forum/iu.test(String(item.canonicalUrl))),
    germanNormalizedLanguage: pack.claims.every((claim) => GERMAN_CLAIM.test(String(claim.text))),
    noKeyOrUrlOverlap: keyOverlap.length === 0 && urlOverlap.length === 0,
    noNationalUnemploymentPacks: !packSource.includes("de_sk_unemployment")
      && !packSource.includes("sk_unemployment")
      && /SK, CZ, PL oder HU/.test(claimText("ue-four-corridor-reuse"))
      && !/create table if not exists public\.knowledge_/i.test(migration058)
      && migration058.includes("eu_unemployment_coordination")
      && !migration058.includes("sk_unemployment")
      && !migration058.includes("GRANT EXECUTE"),
    validationPass: validation.valid && validation.productionEligible === false,
    euAlStillValid: validateEuApplicableLegislationCorePack(euAl).valid,
    euHealthStillValid: validateEuHealthInsuranceCoordinationPack(euHealth).valid,
    euFamilyStillValid: validateEuFamilyBenefitsCoordinationPack(euFamily).valid,
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb0i",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean> = {};
  let germanCreated = -1;
  let euAlCreated = -1;
  let euAlSecond = -1;
  let euHealthCreated = -1;
  let euHealthSecond = -1;
  let euFamilyCreated = -1;
  let euFamilySecond = -1;
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
    euAlSecond = semanticCreated((await ingestor.query(EU_RPC, [euAl])).rows[0]);
    euHealthCreated = semanticCreated((await ingestor.query(EU_RPC, [euHealth])).rows[0]);
    euHealthSecond = semanticCreated((await ingestor.query(EU_RPC, [euHealth])).rows[0]);
    euFamilyCreated = semanticCreated((await ingestor.query(EU_RPC, [euFamily])).rows[0]);
    euFamilySecond = semanticCreated((await ingestor.query(EU_RPC, [euFamily])).rows[0]);
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
      [EU_UNEMP_PROCESS_GROUP],
    );
    const alProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_applicable_legislation'",
    );
    const healthProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_health_insurance_coordination'",
    );
    const familyProcesses = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='eu_family_benefits_coordination'",
    );
    const processLinks = await admin.query(
      `select count(*)::int n from public.knowledge_process_claim_links l
        join public.knowledge_processes p on p.id=l.process_id
       where p.process_group_id=$1`,
      [EU_UNEMP_PROCESS_GROUP],
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
    const ingested987 = await admin.query(
      `select canonical_url from public.knowledge_sources where id = any($1::uuid[])`,
      [pack.sources.map((source) => source.id)],
    );
    const ingested987Urls = ingested987.rows.map((row) => String(row.canonical_url));
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
    live.euAlRegression = euAlCreated > 0 && euAlSecond === 0
      && Number(alProcesses.rows[0]?.n) === euAl.processes.length;
    live.euHealthRegression = euHealthCreated > 0 && euHealthSecond === 0
      && Number(healthProcesses.rows[0]?.n) === euHealth.processes.length;
    live.euFamilyRegression = euFamilyCreated > 0 && euFamilySecond === 0
      && Number(familyProcesses.rows[0]?.n) === euFamily.processes.length;
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
    live.processGroupAllowed = String(groupCheck.rows[0]?.def ?? "").includes(EU_UNEMP_PROCESS_GROUP)
      && String(groupCheck.rows[0]?.def ?? "").includes("eu_family_benefits_coordination")
      && String(groupCheck.rows[0]?.def ?? "").includes("eu_health_insurance_coordination")
      && String(groupCheck.rows[0]?.def ?? "").includes("eu_applicable_legislation");
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.reg987CurrentProvenance = ingested987Urls.some((url) => url.includes(EU_UNEMP_REG_987_CURRENT_CELEX))
      && ingested987Urls.some((url) => url.includes(EU_UNEMP_REG_883_CURRENT_CELEX))
      && ingested987Urls.every((url) => !url.includes("02009R0987-20190731"));
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
    euAlSecond,
    euHealthCreated,
    euHealthSecond,
    euFamilyCreated,
    euFamilySecond,
    firstCreated,
    secondCreated,
    summary,
    keyOverlap,
    urlOverlap,
    algKeyReuse,
    reg883CurrentCelex: EU_UNEMP_REG_883_CURRENT_CELEX,
    reg987CurrentCelex: EU_UNEMP_REG_987_CURRENT_CELEX,
    reg883CurrentConsolidationDate: EU_UNEMP_REG_883_CURRENT_CONSOLIDATION_DATE,
    reg987CurrentConsolidationDate: EU_UNEMP_REG_987_CURRENT_CONSOLIDATION_DATE,
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
  }, null, 2)}\n`);
  if (!allPassed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : "CB-0I audit failed"}\n`);
  process.exitCode = 1;
});
