/**
 * CB-TAX-0C dedicated local audit for the DE↔SK tax residence and treaty core.
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
  validateCuratedBilateralTaxTreatyPack,
} from "../source-registry/bilateral-tax-treaty-contracts";
import { buildValidDeSkTaxFoundationPack } from "../source-registry/bilateral-tax-treaty-synthetic-fixtures";
import {
  ARTICLE4_SEQUENCE,
  GERMAN_ADDED_CLAIM_KEYS,
  GERMAN_REUSED_CLAIM_KEYS,
  NEGATIVE_CONTROLS,
  TAMPER_REJECTIONS,
  TAX_CORE_SCENARIOS,
  evaluateArticle15ConditionA,
  evaluateArticle15Two,
  evaluateGermanDomesticResidence,
  evaluateGermanRelief,
  evaluateSkDomestic183,
  evaluateSlovakRelief,
  evaluateArticle4,
  classifyIndependentActivity,
} from "../source-registry/de-sk-tax-residence-treaty-core";
import {
  EST_PROCESSES,
  buildEstFederalCorePack,
  estPackSummary,
} from "../packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack";
import {
  SK_TAX_PACK_ID,
  SK_TAX_PROCESSES,
  SK_TAX_UNITS,
  buildSkIncomeTaxResidencePack,
  evaluateSkTaxProcessCompleteness,
} from "../packs/sk/income-tax-residence/sk-income-tax-residence-pack";
import {
  DESK_TREATY_PROCESSES,
  DESK_TREATY_UNITS,
  buildDeSkTaxResidenceTreatyPack,
  evaluateDeskTreatyProcessCompleteness,
} from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";

const ROOT = process.cwd();
const IMAGE = "postgres:17";
const DATABASE = "cb_tax_0c_core";
const PASSWORD = `cbtax0c-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-cbtax0c-${process.pid}-${randomUUID().slice(0, 8)}`;
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
  "supabase/migrations/061_add_de_sk_tax_residence_and_treaty_core_ingestion.sql",
];
const DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_sk_income_tax_residence_pack($1::jsonb) as result";
const TAX_RPC = "select public.knowledge_ingest_curated_bilateral_tax_treaty_pack($1::jsonb) as result";
const CONNECTOR_RPC = "select public.knowledge_ingest_curated_cross_border_connector_pack($1::jsonb) as result";

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

function buildStaticCases() {
  const est = buildEstFederalCorePack();
  const sk = buildSkIncomeTaxResidencePack();
  const treaty = buildDeSkTaxResidenceTreatyPack();
  const estText = source("lib", "vaylo", "smart-talk", "knowledge", "packs", "de", "einkommensteuer-steuererklaerung", "einkommensteuer-federal-core-pack.ts");
  const skText = source("lib", "vaylo", "smart-talk", "knowledge", "packs", "sk", "income-tax-residence", "sk-income-tax-residence-pack.ts");
  const treatyText = source("lib", "vaylo", "smart-talk", "knowledge", "packs", "de-sk", "tax-residence-treaty", "de-sk-tax-residence-treaty-pack.ts");
  const coreText = source("lib", "vaylo", "smart-talk", "knowledge", "source-registry", "de-sk-tax-residence-treaty-core.ts");
  const migration060 = source("supabase", "migrations", "060_add_bilateral_tax_treaty_foundation.sql");
  const migration061 = source("supabase", "migrations", "061_add_de_sk_tax_residence_and_treaty_core_ingestion.sql");
  const skCompleteness = evaluateSkTaxProcessCompleteness();
  const treatyCompleteness = evaluateDeskTreatyProcessCompleteness();
  const covered = TAX_CORE_SCENARIOS.filter((row) => row.coverage === "COVERED");
  const outOfScope = TAX_CORE_SCENARIOS.filter((row) => row.coverage === "EXPLICITLY_OUT_OF_SCOPE");
  const blocked = TAX_CORE_SCENARIOS.filter((row) => row.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE");
  const tamperOk = Object.values(TAMPER_REJECTIONS).every(Boolean);
  return {
    germanDomesticCoreReused: GERMAN_REUSED_CLAIM_KEYS.every((key) => est.claims.some((claim) => claim.key === key)),
    germanAbmeldungBoundaryCovered: estText.includes("abmeldung-not-tax-non-residence"),
    deemedUnlimitedNotTreatyResidence: estText.includes("DEEMED_UNLIMITED_TAX_TREATMENT")
      && evaluateGermanDomesticResidence({ estg13Application: true }).status === "DEEMED_UNLIMITED_TAX_TREATMENT",
    skDomesticResidenceExplicit: SK_TAX_UNITS.some((unit) => unit.key === "sk-tax-domestic-candidate-or"),
    skTrvalyPobytExplicit: SK_TAX_UNITS.some((unit) => unit.key === "sk-tax-trvaly-pobyt"),
    skBydliskoExplicit: SK_TAX_UNITS.some((unit) => unit.key === "sk-tax-bydlisko"),
    skDomestic183Explicit: SK_TAX_UNITS.some((unit) => unit.key === "sk-tax-domestic-183"),
    skExact183Passes: evaluateSkDomestic183(183) && !evaluateSkDomestic183(182) && evaluateSkDomestic183(184),
    staleSkCommuterGuidanceRejected: skText.includes("STALE_OFFICIAL_GUIDANCE")
      && skText.includes("MANUAL_REVIEW_REQUIRED")
      && skText.includes("sk-tax-no-obsolete-commuter-statute"),
    skTreatyOverrideExplicit: SK_TAX_UNITS.some((unit) => unit.key === "sk-tax-section-2e-override"),
    dualDomesticCandidateExplicit: treatyText.includes("DUAL_DOMESTIC_RESIDENCE_CANDIDATE"),
    article4ExactSequence: ARTICLE4_SEQUENCE.join(">") === "PERMANENT_HOME>CENTRE_OF_VITAL_INTERESTS>HABITUAL_ABODE",
    article4NationalityRejected: evaluateArticle4({
      permanentHomeDE: true, permanentHomeSK: true, nationalityAsTiebreaker: true,
    }).issues.includes("NATIONALITY_AS_ARTICLE4_TIEBREAKER"),
    article4MapStepRejected: evaluateArticle4({
      permanentHomeDE: true, permanentHomeSK: true, mapAsAutomaticTiebreaker: true,
    }).issues.includes("GENERIC_OECD_MAP_STEP"),
    article4UnresolvedFailClosed: evaluateArticle4({
      permanentHomeDE: true, permanentHomeSK: true, centreDE: "unresolved", habitualDE: "unresolved",
    }).state === "TREATY_RESIDENCE_UNRESOLVED",
    article15PhysicalWorkRule: treatyText.includes("EMPLOYER_STATE ist nicht PHYSICAL_WORK_STATE"),
    article15CalendarYear: treatyText.includes("Kalenderjahr") && treatyText.includes("rollierenden"),
    article15Exact183Passes: evaluateArticle15ConditionA(182)
      && evaluateArticle15ConditionA(183)
      && evaluateArticle15ConditionA(184) === false,
    article15ThreeConditionsRequired: evaluateArticle15Two(183, true, "PE_VERIFIED_NO") === "PASS"
      && evaluateArticle15Two(183, false, "PE_VERIFIED_NO") === "FAIL"
      && evaluateArticle15Two(182, "unresolved", "PE_UNRESOLVED") === "UNRESOLVED",
    homeOfficeRepresentable: treatyText.includes("Homeoffice ist ein materieller Artikel-15-Ort"),
    selfEmployedFirstClass: treatyText.includes("SELF_EMPLOYED ist first-class"),
    article14StandalonePresent: DESK_TREATY_UNITS.some((unit) => unit.key === "desk-art14-standalone"),
    article14Vs7FailClosed: classifyIndependentActivity({ szcoLabel: true }) === "UNRESOLVED",
    fixedBasePeSeparated: treatyText.includes("fixedBaseState und permanentEstablishmentState bleiben getrennt"),
    deArticle23Directional: treatyText.includes("keine globale DE_SK_RELIEF_METHOD"),
    de50d8Gate: estText.includes("estg-50d-8-employment-exemption-proof")
      && evaluateGermanRelief({
        treatyResidence: "TREATY_RESIDENT_DE", incomeArticle: "ARTICLE15",
        slovakiaMayTax: true, foreignTaxProof: false,
      }) === "GERMAN_50D8_PROOF_REQUIRED",
    de50d9Gate: estText.includes("estg-50d-9-switchover-gate"),
    skPre2025ReliefRepresented: evaluateSlovakRelief({
      treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2024, germanyMayTax: true, incomeArticle: "ARTICLE15",
    }) === "EXEMPTION_WITH_PROGRESSION_CANDIDATE",
    sk2025MliCreditRepresented: DESK_TREATY_UNITS.some((unit) => unit.key === "desk-mli-art5-credit" && unit.role === "mli"),
    sk45_3_cEmploymentOverrideExplicit: skText.includes("sk-tax-45-3-c-employment"),
    sk45_3_cNotAppliedToSelfEmployment: evaluateSlovakRelief({
      treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2025, germanyMayTax: true,
      incomeArticle: "ARTICLE14", apply453cToSelfEmployment: true,
    }) === "RELIEF_METHOD_UNRESOLVED",
    reliefComparisonFailClosedWithoutAmounts: evaluateSlovakRelief({
      treatyResidence: "TREATY_RESIDENT_SK", taxYear: 2025, germanyMayTax: true,
      incomeArticle: "ARTICLE15", foreignEmploymentTaxed: true, amountsComplete: false,
    }) === "SK_45_3_C_COMPARISON_REQUIRED",
    taxCalculatorAbsent: BILATERAL_TAX_IS_NOT_TAX_CALCULATOR
      && BILATERAL_TAX_IS_NOT_ACCOUNTING_ENGINE
      && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
      && coreText.includes("TAX_AMOUNT_NOT_AUTHORIZED"),
    socialSecurityTaxSeparationPreserved: validateCuratedCrossBorderConnectorPack(
      connectorTaxTreatyContamination(),
    ).issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED")
      && skText.includes("sk-tax-not-social-security")
      && treatyText.includes("A1-Staat entscheidet nicht"),
    processCompletenessPercent: skCompleteness.processCompletenessPercent === 100
      && treatyCompleteness.processCompletenessPercent === 100
      ? 100 : 0,
    skProcessCount: SK_TAX_PROCESSES.length,
    bilateralProcessCount: DESK_TREATY_PROCESSES.length,
    germanReusedProcessCount: EST_PROCESSES.length,
    germanAddedClaimCount: GERMAN_ADDED_CLAIM_KEYS.length,
    germanReusedClaimCount: GERMAN_REUSED_CLAIM_KEYS.length,
    skClaimCount: SK_TAX_UNITS.length,
    treatyClaimCount: DESK_TREATY_UNITS.filter((unit) => unit.role === "bilateral_treaty").length,
    mliClaimCount: DESK_TREATY_UNITS.filter((unit) => unit.role === "mli").length,
    scenarioTotal: TAX_CORE_SCENARIOS.length,
    scenarioCovered: covered.length,
    scenarioOutOfScope: outOfScope.length,
    scenarioBlocked: blocked.length,
    negativeControlCount: NEGATIVE_CONTROLS.length,
    tamperRejected: tamperOk,
    treatyPackValid: validateCuratedBilateralTaxTreatyPack(treaty).valid,
    skPackTrustSk: sk.trustDomain.code === "sk" && sk.packId === SK_TAX_PACK_ID,
    factoryUnchanged: KNOWLEDGE_FACTORY_DOMAINS.length === 17
      && !(KNOWLEDGE_FACTORY_DOMAINS as readonly string[]).includes("sk_income_tax"),
    migration060Unchanged: !migration060.includes("sk_income_tax_residence")
      && !migration060.includes("process_key"),
    migration061Present: migration061.includes("knowledge_ingest_curated_sk_income_tax_residence_pack")
      && migration061.includes("process_key")
      && migration061.includes("revoke all on function public.knowledge_ingest_curated_sk_income_tax_residence_pack"),
    noRlsLoosening: !/create policy/i.test(migration061)
      && !/grant execute on function public\.knowledge_ingest_curated_sk_income_tax_residence_pack/.test(
        migration061.replaceAll("revoke all on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb)\n  from public, anon, authenticated, service_role", ""),
      ),
    estPackValid: est.packId === "einkommensteuer_steuererklaerung",
    estSummary: estPackSummary(est),
  };
}

async function main(): Promise<void> {
  const staticCases = buildStaticCases();
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
    "run", "--name", CONTAINER, "--label", "phase=knowledge-cb-tax-0c",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, boolean | number> = {};
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
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb)
        to birello_knowledge_ingestor;
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

    const estPack = buildEstFederalCorePack();
    const estFirst = await ingestor.query(DOMAIN_RPC, [estPack]);
    const estFirstCreated = semanticCreated(estFirst.rows[0]);
    const estSecond = await ingestor.query(DOMAIN_RPC, [estPack]);
    const estSecondCreated = semanticCreated(estSecond.rows[0]);

    const skPack = buildSkIncomeTaxResidencePack();
    const skFirst = await ingestor.query(SK_RPC, [skPack]);
    const skFirstCreated = semanticCreated(skFirst.rows[0]);
    const skSecond = await ingestor.query(SK_RPC, [skPack]);
    const skSecondCreated = semanticCreated(skSecond.rows[0]);

    const treatyPack = buildDeSkTaxResidenceTreatyPack();
    let treatyFirst;
    try {
      treatyFirst = await ingestor.query(TAX_RPC, [treatyPack]);
    } catch (error: unknown) {
      throw new Error(`TAX_INGEST:${error instanceof Error ? error.message : "unknown"}`);
    }
    const treatyFirstCreated = semanticCreated(treatyFirst.rows[0]);
    const treatySecond = await ingestor.query(TAX_RPC, [treatyPack]);
    const treatySecondCreated = semanticCreated(treatySecond.rows[0]);

    const foundation = buildValidDeSkTaxFoundationPack();
    const foundationFirst = await ingestor.query(TAX_RPC, [foundation]);
    const foundationFirstCreated = semanticCreated(foundationFirst.rows[0]);
    const foundationSecond = await ingestor.query(TAX_RPC, [foundation]);
    const foundationSecondCreated = semanticCreated(foundationSecond.rows[0]);

    const treatyCount = await admin.query("select count(*)::int n from public.knowledge_bilateral_tax_treaties");
    const versionCount = await admin.query("select count(*)::int n from public.knowledge_bilateral_tax_treaty_versions");
    const processCount = await admin.query("select count(*)::int n from public.knowledge_bilateral_tax_processes");
    const linkCount = await admin.query("select count(*)::int n from public.knowledge_bilateral_tax_process_claim_links");
    const skProcessCount = await admin.query(
      "select count(*)::int n from public.knowledge_processes where process_group_id='sk_income_tax_residence'",
    );
    const skTrust = await admin.query(
      `select count(*)::int n from public.knowledge_claims c
        join public.knowledge_authorities a on a.id = c.authority_id
        join public.knowledge_publishers p on p.id = a.publisher_id
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
        join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
       where t.code='sk' and j.country_code='SK' and c.claim_text_canonical like '%trvalý pobyt%'`,
    );
    const activeCorridors = await admin.query(
      "select count(*)::int n from public.knowledge_cross_border_connectors where status='active'",
    );
    const activeTreaties = await admin.query(
      "select count(*)::int n from public.knowledge_bilateral_tax_treaties where active or public_runtime_allowed",
    );
    const grants = await admin.query(
      `select count(*)::int n from information_schema.role_routine_grants
        where routine_name in (
          'knowledge_ingest_curated_sk_income_tax_residence_pack',
          'knowledge_ingest_curated_bilateral_tax_treaty_pack'
        ) and grantee in ('PUBLIC','anon','authenticated','service_role')`,
    );

    live.estFirstCreated = estFirstCreated;
    live.estSecondCreated = estSecondCreated;
    live.estFirstExpected = estFirstCreated === staticCases.estSummary.expectedSemanticCreated ? 1 : 0;
    live.estIdempotent = estFirstCreated > 0 && estSecondCreated === 0 ? 1 : 0;
    live.skFirstCreated = skFirstCreated;
    live.skSecondCreated = skSecondCreated;
    live.skIdempotent = skFirstCreated > 0 && skSecondCreated === 0 ? 1 : 0;
    live.treatyFirstCreated = treatyFirstCreated;
    live.treatySecondCreated = treatySecondCreated;
    live.treatyIdempotent = treatyFirstCreated > 0 && treatySecondCreated === 0 ? 1 : 0;
    live.foundationFirstCreated = foundationFirstCreated;
    live.foundationSecondCreated = foundationSecondCreated;
    live.foundationIdempotent = foundationSecondCreated === 0 ? 1 : 0;
    live.treatyIdentityOne = Number(treatyCount.rows[0]?.n) === 1 ? 1 : 0;
    live.versionsCoexist = Number(versionCount.rows[0]?.n) === 2 ? 1 : 0;
    live.bilateralProcessRows = Number(processCount.rows[0]?.n);
    live.bilateralLinkRows = Number(linkCount.rows[0]?.n);
    live.skProcessRows = Number(skProcessCount.rows[0]?.n);
    live.skTrustClaims = Number(skTrust.rows[0]?.n);
    live.oldSsWriterRejectsTaxTreaty = await rejects(
      ingestor, CONNECTOR_RPC, connectorTaxTreatyContamination(),
      "CONNECTOR_TAX_TREATY_ENGINE_NOT_AUTHORIZED",
    ) ? 1 : 0;
    live.noActiveCorridor = Number(activeCorridors.rows[0]?.n) === 0
      && Number(activeTreaties.rows[0]?.n) === 0 ? 1 : 0;
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0 ? 1 : 0;
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }

  const named = {
    germanDomesticCoreReused: staticCases.germanDomesticCoreReused,
    germanAbmeldungBoundaryCovered: staticCases.germanAbmeldungBoundaryCovered,
    deemedUnlimitedNotTreatyResidence: staticCases.deemedUnlimitedNotTreatyResidence,
    skDomesticResidenceExplicit: staticCases.skDomesticResidenceExplicit,
    skTrvalyPobytExplicit: staticCases.skTrvalyPobytExplicit,
    skBydliskoExplicit: staticCases.skBydliskoExplicit,
    skDomestic183Explicit: staticCases.skDomestic183Explicit,
    skExact183Passes: staticCases.skExact183Passes,
    staleSkCommuterGuidanceRejected: staticCases.staleSkCommuterGuidanceRejected,
    skTreatyOverrideExplicit: staticCases.skTreatyOverrideExplicit,
    dualDomesticCandidateExplicit: staticCases.dualDomesticCandidateExplicit,
    article4ExactSequence: staticCases.article4ExactSequence,
    article4NationalityRejected: staticCases.article4NationalityRejected,
    article4MapStepRejected: staticCases.article4MapStepRejected,
    article4UnresolvedFailClosed: staticCases.article4UnresolvedFailClosed,
    article15PhysicalWorkRule: staticCases.article15PhysicalWorkRule,
    article15CalendarYear: staticCases.article15CalendarYear,
    article15Exact183Passes: staticCases.article15Exact183Passes,
    article15ThreeConditionsRequired: staticCases.article15ThreeConditionsRequired,
    homeOfficeRepresentable: staticCases.homeOfficeRepresentable,
    selfEmployedFirstClass: staticCases.selfEmployedFirstClass,
    article14StandalonePresent: staticCases.article14StandalonePresent,
    article14Vs7FailClosed: staticCases.article14Vs7FailClosed,
    fixedBasePeSeparated: staticCases.fixedBasePeSeparated,
    deArticle23Directional: staticCases.deArticle23Directional,
    de50d8Gate: staticCases.de50d8Gate,
    de50d9Gate: staticCases.de50d9Gate,
    skPre2025ReliefRepresented: staticCases.skPre2025ReliefRepresented,
    sk2025MliCreditRepresented: staticCases.sk2025MliCreditRepresented,
    sk45_3_cEmploymentOverrideExplicit: staticCases.sk45_3_cEmploymentOverrideExplicit,
    sk45_3_cNotAppliedToSelfEmployment: staticCases.sk45_3_cNotAppliedToSelfEmployment,
    reliefComparisonFailClosedWithoutAmounts: staticCases.reliefComparisonFailClosedWithoutAmounts,
    taxCalculatorAbsent: staticCases.taxCalculatorAbsent,
    socialSecurityTaxSeparationPreserved: staticCases.socialSecurityTaxSeparationPreserved,
    processCompletenessPercent: staticCases.processCompletenessPercent,
    tamperRejected: staticCases.tamperRejected,
    blockedScenarioCountZero: staticCases.scenarioBlocked === 0,
    estDisposable: live.estIdempotent === 1 && live.estFirstExpected === 1,
    skDisposable: live.skIdempotent === 1,
    treatyDisposable: live.treatyIdempotent === 1,
    foundationDisposable: live.foundationIdempotent === 1,
    treatyVersionsCoexist: live.versionsCoexist === 1 && live.treatyIdentityOne === 1,
    oldSsWriterRejectsTaxTreaty: live.oldSsWriterRejectsTaxTreaty === 1,
    noActiveCorridor: live.noActiveCorridor === 1,
    noPublicGrants: live.noPublicGrants === 1,
  };
  const failed = Object.entries(named).filter(([, value]) => value !== true && value !== 100);
  const report = {
    phase: "CB-TAX-0C",
    phaseResult: failed.length === 0 ? "PASS" : "FAIL",
    publicRuntimeAuthorized: false,
    productionInteractionPerformed: false,
    namedProofs: named,
    failedProofs: failed.map(([name]) => name),
    counts: {
      germanReused: staticCases.germanReusedClaimCount,
      germanAdded: staticCases.germanAddedClaimCount,
      skClaims: staticCases.skClaimCount,
      treatyClaims: staticCases.treatyClaimCount,
      mliClaims: staticCases.mliClaimCount,
      skProcesses: staticCases.skProcessCount,
      bilateralProcesses: staticCases.bilateralProcessCount,
      germanReusedProcesses: staticCases.germanReusedProcessCount,
      scenarios: staticCases.scenarioTotal,
      covered: staticCases.scenarioCovered,
      outOfScope: staticCases.scenarioOutOfScope,
      blocked: staticCases.scenarioBlocked,
      negativeControls: staticCases.negativeControlCount,
    },
    live,
    staticOk: staticCases.treatyPackValid && staticCases.skPackTrustSk && staticCases.factoryUnchanged
      && staticCases.migration060Unchanged && staticCases.migration061Present,
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.phaseResult !== "PASS" || report.staticOk !== true) process.exitCode = 1;
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
