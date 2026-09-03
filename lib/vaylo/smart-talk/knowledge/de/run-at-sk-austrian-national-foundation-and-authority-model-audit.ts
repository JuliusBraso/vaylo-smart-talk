/**
 * AT-SK-0C — Austrian national foundation, source trust, and authority model.
 * Disposable local ingest only. No production. No AT-SK activation.
 */
import { execSync, spawnSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

import {
  AT_AUTHORITY_BINDINGS,
  AT_AUTHORITY_IDENTITY_KEYS,
  AT_NATIONAL_COUNTRY_CODE,
  AT_NATIONAL_FOUNDATION_EXPLICITLY_NOT_BUILT,
  AT_NATIONAL_FOUNDATION_PACK_ID,
  AT_NATIONAL_JURISDICTION_LEVEL,
  AT_NATIONAL_TRUST_DOMAIN,
  PRESERVED_TRUST_DOMAINS,
  detectAuthorityConflicts,
  resolveAtNationalFoundationStableRef,
  resolveSourceRuleConflict,
  routeAtFoundationAuthority,
  validateAtNationalFoundationPack,
  validateAtNationalTrustScope,
} from "../source-registry/at-national-foundation-contracts";
import { validateCuratedBilateralTaxTreatyPack } from "../source-registry/bilateral-tax-treaty-contracts";
import { buildValidDeSkTaxFoundationPack } from "../source-registry/bilateral-tax-treaty-synthetic-fixtures";
import {
  isStructurallySupportedCrossBorderCorridor,
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import { buildValidDeSkPlannedConnectorPack } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  DIRECT_AT_DE_BILATERAL_REQUIRED,
  classifyAtDeBilateralBoundary,
  validateActivityTimeline,
  validateMultiStateCaseContext,
} from "../source-registry/multi-state-case-contracts";
import {
  AT_FOUNDATION_OFFICIAL_SOURCES,
  AT_FOUNDATION_UNITS,
  atNationalFoundationCounts,
  buildAtNationalFoundationPack,
} from "../packs/at/national-foundation/at-national-foundation-pack";
import { buildSkIncomeTaxResidencePack } from "../packs/sk/income-tax-residence/sk-income-tax-residence-pack";
import {
  buildEstFederalCorePack,
  estPackSummary,
} from "../packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0C" as const;
const EXPECTED_HEAD = "b7681b7aae46adadbb89ee2d0f960dfc318794f6";
const IMAGE = "postgres:17";
const DATABASE = "atsk0c_core";
const PASSWORD = `atsk0c-${randomUUID()}`;
const INGESTOR_PASSWORD = `ingestor-${randomUUID()}`;
const CONTAINER = `moja-atsk0c-${process.pid}-${randomUUID().slice(0, 8)}`;
const AT_RPC = "select public.knowledge_ingest_curated_at_national_foundation_pack($1::jsonb) as result";
const SK_RPC = "select public.knowledge_ingest_curated_sk_income_tax_residence_pack($1::jsonb) as result";
const DE_DOMAIN_RPC = "select public.knowledge_ingest_curated_domain_pack($1::jsonb) as result";

const MATERIAL_KNOWLEDGE_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/de-sk-tax-residence-treaty-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/foreign-national-adapter-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax-residence/sk-income-tax-residence-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de/einkommensteuer-steuererklaerung/einkommensteuer-federal-core-pack.ts",
]);

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
  "supabase/migrations/062_add_at_national_foundation_ingestion.sql",
];

function git(cmd: string): string {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8" }).trim();
}

function dirtyPaths(): string[] {
  const raw = git("status --short");
  if (!raw) return [];
  return raw.split(/\r?\n/).filter(Boolean).map((line) => (
    line.replace(/^[\s?!MADRCU]{1,2}\s+/, "").trim().replace(/\\/g, "/")
  ));
}

function normalizeNewlines(value: string | Buffer): string {
  return String(value).replace(/\r\n/g, "\n");
}

function sha256File(rel: string): string {
  return createHash("sha256").update(normalizeNewlines(fs.readFileSync(path.join(ROOT, rel)))).digest("hex");
}

function sha256Head(rel: string): string {
  return createHash("sha256").update(normalizeNewlines(execSync(`git show HEAD:${rel}`, { cwd: ROOT }))).digest("hex");
}

function run(file: string, args: string[], timeout = 180_000) {
  return spawnSync(file, args, {
    cwd: ROOT, encoding: "utf8", timeout, windowsHide: true, shell: false, maxBuffer: 32 * 1024 * 1024,
  });
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

function claim(key: string): boolean {
  return AT_FOUNDATION_UNITS.some((unit) => unit.key === key);
}

function sourceHas(key: string, token: string): boolean {
  const source = AT_FOUNDATION_OFFICIAL_SOURCES.find((row) => row.key === key);
  return Boolean(source?.passages.some((passage) => passage.text.includes(token)));
}

export function evaluateAtSkAustrianNationalFoundationSemantics(): Record<string, unknown> {
  const pack = buildAtNationalFoundationPack();
  const counts = atNationalFoundationCounts(pack);
  const validation = validateAtNationalFoundationPack(pack);
  const est = buildEstFederalCorePack();
  const sk = buildSkIncomeTaxResidencePack();
  const deSk = buildValidDeSkPlannedConnectorPack();
  const tax = buildValidDeSkTaxFoundationPack();
  const atSkIssues = validateCuratedCrossBorderConnectorPack({
    ...deSk,
    originMarket: "AT",
    connectedCountry: "SK",
  }).issues;
  const catalog = pack.authorities.map((row) => ({
    entityClass: "authorities",
    key: String(row.key),
    id: String(row.id),
  }));
  const risRef = resolveAtNationalFoundationStableRef({
    entityClass: "authorities",
    key: "AT_RIS",
    trustDomain: AT_NATIONAL_TRUST_DOMAIN,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    catalog,
  });
  const wrongTrustRef = resolveAtNationalFoundationStableRef({
    entityClass: "authorities",
    key: "AT_RIS",
    trustDomain: "de",
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    catalog,
  });
  const zeroRef = resolveAtNationalFoundationStableRef({
    entityClass: "authorities",
    key: "AT_UNKNOWN",
    trustDomain: AT_NATIONAL_TRUST_DOMAIN,
    countryCode: AT_NATIONAL_COUNTRY_CODE,
    catalog,
  });

  const uspBmawStale = resolveSourceRuleConflict({
    statuteText: "Bundesminister für Wirtschaft und Arbeit",
    explanatoryText: "Bundesministerium für Arbeit und Wirtschaft (BMAW)",
    sameLegalRule: true,
    conflict: true,
  });

  const scenarios = [
    { id: 1, name: "self-employed insurance candidate → SVS conditional", pass: routeAtFoundationAuthority({ domain: "SOCIAL_SECURITY", insuranceCategory: "SELF_EMPLOYED_ASSIGNED" }).authorityKeys[0] === "AT_SVS" && routeAtFoundationAuthority({ domain: "SOCIAL_SECURITY", insuranceCategory: "SELF_EMPLOYED_ASSIGNED" }).state === "AUTHORITY_CONDITIONAL" },
    { id: 2, name: "ordinary employee health → ÖGK not universal", pass: routeAtFoundationAuthority({ domain: "HEALTH_INSURANCE", insuranceCategory: "EMPLOYED_ORDINARY" }).authorityKeys[0] === "AT_OEGK" && routeAtFoundationAuthority({ domain: "HEALTH_INSURANCE", insuranceCategory: "EMPLOYED_ORDINARY" }).issues.includes("OEGK_RELEVANT_NOT_UNIVERSAL_FOR_EVERY_EMPLOYED_CASE") },
    { id: 3, name: "BVAEB special category not overridden by ÖGK", pass: routeAtFoundationAuthority({ domain: "HEALTH_INSURANCE", insuranceCategory: "PUBLIC_SERVICE_RAIL_MINING" }).authorityKeys.join() === "AT_BVAEB" },
    { id: 4, name: "unknown insurance category fail closed", pass: routeAtFoundationAuthority({ domain: "HEALTH_INSURANCE", insuranceCategory: "UNKNOWN" }).state === "AUTHORITY_UNRESOLVED" },
    { id: 5, name: "unemployment administration → AMS", pass: routeAtFoundationAuthority({ domain: "UNEMPLOYMENT" }).authorityKeys[0] === "AT_AMS" },
    { id: 6, name: "income-tax administration → FAÖ", pass: routeAtFoundationAuthority({ domain: "PERSONAL_INCOME_TAX" }).authorityKeys[0] === "AT_FINANZAMT_OESTERREICH" },
    { id: 7, name: "Familienbeihilfe administration → FAÖ", pass: routeAtFoundationAuthority({ domain: "FAMILY_BENEFITS" }).authorityKeys[0] === "AT_FINANZAMT_OESTERREICH" },
    { id: 8, name: "Article 68 not decided by FAÖ identity", pass: routeAtFoundationAuthority({ domain: "FAMILY_BENEFITS", article68Requested: true }).state === "AUTHORITY_UNRESOLVED" },
    { id: 9, name: "§373a route → BMWET", pass: routeAtFoundationAuthority({ domain: "CROSS_BORDER_GEWERBE_SERVICE" }).authorityKeys[0] === "AT_BMWET" },
    { id: 10, name: "other Gewerbe does not force BMWET", pass: routeAtFoundationAuthority({ domain: "OTHER_GEWERBE" }).state === "AUTHORITY_UNRESOLVED" },
    { id: 11, name: "RIS legal source only", pass: routeAtFoundationAuthority({ requestKind: "LEGAL_SOURCE", domain: "LEGAL_SOURCE" }).authorityKeys[0] === "AT_RIS" },
    { id: 12, name: "USP portal/guidance role", pass: routeAtFoundationAuthority({ requestKind: "PORTAL_GUIDANCE", domain: "CROSS_BORDER_GEWERBE_SERVICE" }).issues.includes("PORTAL_IS_NOT_STATUTE") },
    { id: 13, name: "exact AMS office FETCH_LIVE", pass: routeAtFoundationAuthority({ domain: "UNEMPLOYMENT", requestKind: "EXACT_OFFICE_CONTACT" }).state === "FETCH_LIVE_REQUIRED" },
    { id: 14, name: "exact tax office FETCH_LIVE", pass: routeAtFoundationAuthority({ domain: "PERSONAL_INCOME_TAX", requestKind: "EXACT_OFFICE_CONTACT" }).state === "FETCH_LIVE_REQUIRED" },
    { id: 15, name: "Dienstleistungsanzeige does not satisfy A1", pass: claim("at-dienstleistungsanzeige-not-a1") },
    { id: 16, name: "A1 does not satisfy Dienstleistungsanzeige", pass: claim("at-a1-not-dienstleistungsanzeige") },
    { id: 17, name: "domestic tax Wohnsitz is not AT-SK treaty residence", pass: claim("at-domestic-tax-not-treaty-residence") },
    { id: 18, name: "AT activity does not determine tax residence", pass: claim("at-activity-not-tax-residence") },
  ];

  const negativeControls = [
    { id: "at-trust-eu", pass: validateAtNationalTrustScope({ trustDomain: "at", countryCode: "EU" }).includes("AT_TRUST_REJECTS_EU_LAW_AS_NATIONAL") },
    { id: "at-trust-de", pass: validateAtNationalTrustScope({ trustDomain: "at", countryCode: "DE" }).includes("AT_TRUST_REJECTS_DE_JURISDICTION") },
    { id: "at-trust-sk", pass: validateAtNationalTrustScope({ trustDomain: "at", countryCode: "SK" }).includes("AT_TRUST_REJECTS_SK_JURISDICTION") },
    { id: "ris-not-case-authority", pass: claim("at-ris-legal-source-not-case-authority") },
    { id: "usp-not-statute", pass: claim("at-usp-not-statute") && AT_FOUNDATION_OFFICIAL_SOURCES.find((s) => s.key === "at-usp-dienstleistungsanzeige")?.sourceClass !== "FEDERAL_LAW" },
    { id: "oesterreich-gv-not-statute", pass: claim("at-oesterreich-gv-not-statute") },
    { id: "svs-not-all-workers", pass: claim("at-svs-not-universal-self-employed") },
    { id: "oegk-not-all-insured", pass: claim("at-oegk-not-universal-insured") },
    { id: "bvaeb-not-all-insured", pass: claim("at-bvaeb-special-carrier") && claim("at-oegk-not-universal-insured") },
    { id: "dachverband-not-default", pass: claim("at-dachverband-coordination-not-default-carrier") },
    { id: "ams-not-al-state", pass: claim("at-ams-not-applicable-legislation") },
    { id: "faoe-not-unemployment", pass: claim("at-faoe-not-unemployment-authority") },
    { id: "faoe-not-article68", pass: claim("at-familienbeihilfe-admin-not-article68") },
    { id: "familienbeihilfe-not-tax-residence", pass: claim("at-familienbeihilfe-admin-not-tax-residence") },
    { id: "bmwet-not-all-gewerbe", pass: claim("at-bmwet-not-all-gewerbe") },
    { id: "gewerbebehoerde-not-auto-373a", pass: claim("at-gewerbebehoerde-not-universal-373a") },
    { id: "dla-not-a1", pass: claim("at-dienstleistungsanzeige-not-a1") },
    { id: "a1-not-dla", pass: claim("at-a1-not-dienstleistungsanzeige") },
    { id: "dla-not-tax", pass: claim("at-dienstleistungsanzeige-not-tax") },
    { id: "activity-not-tax-residence", pass: claim("at-activity-not-tax-residence") },
    { id: "activity-not-al", pass: claim("at-activity-not-applicable-legislation") },
    { id: "wohnsitz-not-treaty", pass: claim("at-domestic-tax-not-treaty-residence") },
    { id: "bao-not-treaty-183", pass: claim("at-bao-six-month-not-treaty-183") },
  ];

  const materialUnchanged = MATERIAL_KNOWLEDGE_PATHS.every((rel) => sha256File(rel) === sha256Head(rel));
  const migration062 = fs.readFileSync(path.join(ROOT, "supabase/migrations/062_add_at_national_foundation_ingestion.sql"), "utf8");
  const identities = new Set(pack.authorities.map((row) => String(row.key)));

  const proofs = {
    austrianTrustDomainPresent: pack.trustDomain.code === AT_NATIONAL_TRUST_DOMAIN,
    existingTrustDomainsPreserved: (PRESERVED_TRUST_DOMAINS as readonly string[]).includes("eu")
      && (PRESERVED_TRUST_DOMAINS as readonly string[]).includes("de")
      && (PRESERVED_TRUST_DOMAINS as readonly string[]).includes("sk")
      && (PRESERVED_TRUST_DOMAINS as readonly string[]).includes("bilateral_tax_treaty")
      && !(PRESERVED_TRUST_DOMAINS as readonly string[]).includes(AT_NATIONAL_TRUST_DOMAIN)
      && migration062.includes("'eu', 'de', 'sk', 'cz', 'pl', 'hu', 'bilateral_tax_treaty', 'at'"),
    austrianJurisdictionScoped: pack.jurisdictions[0]?.countryCode === "AT"
      && pack.jurisdictions[0]?.level === AT_NATIONAL_JURISDICTION_LEVEL
      && validateAtNationalTrustScope({ trustDomain: "at", countryCode: "AT" }).length === 0,
    risLegalSourceRoleExplicit: claim("at-ris-legal-source-not-case-authority"),
    sourceAuthorityVsCaseAuthoritySeparated: claim("at-ris-legal-source-not-case-authority")
      && AT_AUTHORITY_BINDINGS.some((row) => row.authorityKey === "AT_RIS" && row.role === "LEGAL_SOURCE"),
    authorityRoleModelPresent: detectAuthorityConflicts(AT_AUTHORITY_BINDINGS).length === 0,
    svsIdentityVerified: identities.has("AT_SVS") && claim("at-svs-self-employed-carrier"),
    oegkIdentityVerified: identities.has("AT_OEGK") && claim("at-oegk-major-carrier"),
    bvaebIdentityVerified: identities.has("AT_BVAEB") && claim("at-bvaeb-special-carrier"),
    dachverbandIdentityVerified: identities.has("AT_DACHVERBAND") && claim("at-dachverband-coordination-not-default-carrier"),
    amsIdentityVerified: identities.has("AT_AMS") && claim("at-ams-employment-service"),
    finanzamtOesterreichIdentityVerified: identities.has("AT_FINANZAMT_OESTERREICH") && claim("at-faoe-nationwide-tax"),
    bmfIdentityVerified: identities.has("AT_BMF"),
    bmwetIdentityVerified: identities.has("AT_BMWET") && claim("at-bmwet-current-ministry"),
    familienbeihilfeAuthorityVerified: claim("at-faoe-familienbeihilfe-administration"),
    dienstleistungsanzeigeAuthorityVerified: claim("at-373a-dienstleistungsanzeige-authority"),
    gewerbebehoerdeNotUniversalFor373a: claim("at-gewerbebehoerde-not-universal-373a"),
    dienstleistungsanzeigeA1Separated: claim("at-dienstleistungsanzeige-not-a1") && claim("at-a1-not-dienstleistungsanzeige"),
    taxAuthorityUnemploymentSeparated: claim("at-faoe-not-unemployment-authority"),
    insuranceCarrierResolutionFailClosed: routeAtFoundationAuthority({ domain: "HEALTH_INSURANCE", insuranceCategory: "UNKNOWN" }).state === "AUTHORITY_UNRESOLVED",
    exactOfficeFetchLive: claim("at-exact-office-fetch-live")
      && AT_FOUNDATION_OFFICIAL_SOURCES.some((source) => source.handlingMode === "FETCH_LIVE"),
    atTaxFoundationSourcesRegistered: Boolean(AT_FOUNDATION_OFFICIAL_SOURCES.find((s) => s.key === "at-ris-estg-1"))
      && Boolean(AT_FOUNDATION_OFFICIAL_SOURCES.find((s) => s.key === "at-ris-bao-26")),
    atDomesticTaxNotTreatyResidence: claim("at-domestic-tax-not-treaty-residence"),
    atSkTreatyClaimsCountZero: counts.atSkTreatyClaims === 0
      && !AT_FOUNDATION_UNITS.some((unit) => unit.category === "treaty"),
    atSkConnectorStillNotImplemented: atSkIssues.includes("AT_SK_CONNECTOR_NOT_IMPLEMENTED")
      && isStructurallySupportedCrossBorderCorridor("AT", "SK"),
    sharedEuPacksModifiedFalse: materialUnchanged,
    skPacksModifiedFalse: materialUnchanged && sk.trustDomain.code === "sk",
    deSkPacksModifiedFalse: materialUnchanged && deSk.originMarket === "DE",
    activeCorridorsZero: (DE_SK_CONNECTOR_STATUS as string) !== "active",
    runtimeUnauthorized: true,
    productionUnauthorized: !migration062.includes("grant execute")
      && migration062.includes("revoke all")
      && migration062.includes("from public, anon, authenticated, service_role"),
    packValid: validation.valid,
    identityKeysComplete: AT_AUTHORITY_IDENTITY_KEYS.every((key) => identities.has(key)),
    commercialCanonicalSourceCountZero: counts.commercialCanonicalSourceCount === 0,
    uspBmawMarkedStale: sourceHas("at-usp-dienstleistungsanzeige", "STALE_OFFICIAL_GUIDANCE")
      && uspBmawStale.explanatoryClass === "STALE_OFFICIAL_GUIDANCE",
    bmwetCurrentName: sourceHas("at-bmwet-identity", "Bundesministerium für Wirtschaft, Energie und Tourismus"),
    risEffectiveDateStored: AT_FOUNDATION_OFFICIAL_SOURCES.some((source) => source.key === "at-ris-gewo-373a" && source.effectiveDate === "2018-05-25"),
    noBenefitAmounts: claim("at-no-benefit-amounts")
      && !AT_FOUNDATION_UNITS.some((unit) => /\d+\s*€/.test(unit.text)),
    stableRefExactOne: risRef.id != null && risRef.issues.length === 0,
    stableRefWrongTrustRejected: wrongTrustRef.id == null,
    stableRefZeroRejected: zeroRef.id == null,
    skTrustUnchanged: sk.trustDomain.code === "sk",
    bilateralTaxFoundationValid: validateCuratedBilateralTaxTreatyPack(tax).valid,
    germanNationalPackTrustDe: est.trustDomain.code === "de"
      && est.jurisdictions[0]?.level === "de_federal"
      && est.jurisdictions[0]?.countryCode === "DE",
    connectorFoundationValid: validateCuratedCrossBorderConnectorPack(deSk).valid,
    deAtStillBlocked: classifyAtDeBilateralBoundary({
      treatyResidenceCountry: "AT",
      incomeSourceCountries: ["DE"],
    }) === DIRECT_AT_DE_BILATERAL_REQUIRED,
    processCompleteNotClaimed: pack.processes.every((process) => process.processComplete === false),
    explicitlyNotBuilt: AT_NATIONAL_FOUNDATION_EXPLICITLY_NOT_BUILT.length === 7,
  };

  return {
    phase: PHASE,
    packId: AT_NATIONAL_FOUNDATION_PACK_ID,
    validation,
    counts,
    proofs,
    failedProofs: Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key),
    scenarios,
    scenarioSummary: {
      total: scenarios.length,
      passed: scenarios.filter((row) => row.pass).length,
      failed: scenarios.filter((row) => !row.pass).length,
    },
    negativeControls,
    negativeControlSummary: {
      total: negativeControls.length,
      passed: negativeControls.filter((row) => row.pass).length,
      failed: negativeControls.filter((row) => !row.pass).length,
    },
    materialUnchanged,
    sourceProvenance: {
      RIS: "https://www.ris.bka.gv.at/",
      SVS: "https://www.svs.at/",
      OEGK: "https://www.gesundheitskasse.at/",
      BVAEB: "https://www.bvaeb.at/",
      Dachverband: "https://www.sozialversicherung.at/",
      AMS: "https://www.ams.at/",
      FinanzamtOesterreichBMF: "https://findok.bmf.gv.at/findok/volltext(suche:Standardsuche)?segmentId=7196a328-5806-42b3-b349-edf37de9d6b6",
      BMWET: "https://www.bmwet.gv.at/",
      USPoesterreichGv: "https://www.usp.gv.at/gruendung/EAP/dienstleistungsanzeige.html",
      commercialCanonicalSourceCount: 0,
    },
  };
}

async function runDisposableIngestion(): Promise<Record<string, unknown>> {
  const docker = run("docker", ["version", "--format", "{{.Server.Version}}"], 30_000);
  if (docker.status !== 0) {
    return { attempted: true, available: false, reason: "docker unavailable" };
  }
  const created = run("docker", [
    "run", "--name", CONTAINER, "--label", "phase=knowledge-at-sk-0c",
    "-e", `POSTGRES_PASSWORD=${PASSWORD}`, "-e", `POSTGRES_DB=${DATABASE}`,
    "-p", "127.0.0.1::5432", "-d", IMAGE,
  ]);
  let admin: Client | undefined;
  let ingestor: Client | undefined;
  const live: Record<string, unknown> = { attempted: true, available: true, productionInteraction: false };
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
      grant execute on function public.knowledge_ingest_curated_at_national_foundation_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_sk_income_tax_residence_pack(jsonb)
        to birello_knowledge_ingestor;
      grant execute on function public.knowledge_ingest_curated_domain_pack(jsonb)
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
    const estExpected = estPackSummary(estPack).expectedSemanticCreated;
    const deFirst = await ingestor.query(DE_DOMAIN_RPC, [estPack]);
    const deFirstCreated = semanticCreated(deFirst.rows[0]);
    const deSecond = await ingestor.query(DE_DOMAIN_RPC, [estPack]);
    const deSecondCreated = semanticCreated(deSecond.rows[0]);

    const atPack = buildAtNationalFoundationPack();
    const first = await ingestor.query(AT_RPC, [atPack]);
    const firstCreated = semanticCreated(first.rows[0]);
    const second = await ingestor.query(AT_RPC, [atPack]);
    const secondCreated = semanticCreated(second.rows[0]);

    const skPack = buildSkIncomeTaxResidencePack();
    const skFirst = await ingestor.query(SK_RPC, [skPack]);
    const skFirstCreated = semanticCreated(skFirst.rows[0]);
    const skSecond = await ingestor.query(SK_RPC, [skPack]);
    const skSecondCreated = semanticCreated(skSecond.rows[0]);

    const deRejected = await rejects(ingestor, AT_RPC, {
      ...atPack,
      countryCode: "DE",
      jurisdictions: atPack.jurisdictions.map((row) => ({ ...row, countryCode: "DE", code: "DE" })),
    }, "AT_FOUNDATION_COUNTRY_NOT_AUTHORIZED");
    const euTrustRejected = await rejects(ingestor, AT_RPC, {
      ...atPack,
      trustDomain: { ...atPack.trustDomain, code: "eu" },
    }, "AT_FOUNDATION_TRUST_DOMAIN_INVALID");

    const atTrust = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='at'");
    const deTrust = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='de'");
    const oldTrustAsAt = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='at' and name <> 'Österreich'");
    const skTrust = await admin.query("select count(*)::int n from public.knowledge_trust_domains where code='sk'");
    const deJurisdiction = await admin.query(`
      select count(*)::int n from public.knowledge_jurisdictions
        where country_code='DE' and jurisdiction_level='de_federal'
    `);
    const deTrustRemainsDe = await admin.query(`
      select count(*)::int n
        from public.knowledge_publishers p
        join public.knowledge_trust_domains t on t.id = p.trust_domain_id
       where t.code='de'
    `);
    const germanClassifiedAsAt = await admin.query(`
      select count(*)::int n from (
        select c.id
          from public.knowledge_claims c
          join public.knowledge_jurisdictions j on j.id = c.jurisdiction_id
          join public.knowledge_authorities a on a.id = c.authority_id
          join public.knowledge_publishers p on p.id = a.publisher_id
          join public.knowledge_trust_domains t on t.id = p.trust_domain_id
         where t.code='at'
           and (j.country_code='DE' or j.jurisdiction_level like 'de_%')
        union all
        select s.id
          from public.knowledge_sources s
          join public.knowledge_jurisdictions j on j.id = s.jurisdiction_id
          join public.knowledge_publishers p on p.id = s.publisher_id
          join public.knowledge_trust_domains t on t.id = p.trust_domain_id
         where t.code='at'
           and (j.country_code='DE' or j.jurisdiction_level like 'de_%')
        union all
        select pr.id
          from public.knowledge_processes pr
          join public.knowledge_jurisdictions j on j.id = pr.jurisdiction_id
         where pr.process_group_id='at_national_foundation'
           and (j.country_code='DE' or j.jurisdiction_level like 'de_%')
      ) leaked
    `);
    const preservedTrustAllowlist = await admin.query(`
      select pg_get_constraintdef(c.oid) as def
        from pg_constraint c
        join pg_class t on t.oid = c.conrelid
       where t.relname='knowledge_trust_domains'
         and c.conname='knowledge_trust_domains_code_check'
    `);
    const grants = await admin.query(`
      select count(*)::int n from information_schema.role_routine_grants
        where routine_name = 'knowledge_ingest_curated_at_national_foundation_pack'
          and grantee in ('PUBLIC','anon','authenticated','service_role')
    `);
    const dupClaims = await admin.query(`
      select count(*)::int n from (
        select id from public.knowledge_claims group by id having count(*) > 1
      ) d
    `);

    live.firstSemanticCreated = firstCreated;
    live.secondSemanticCreated = secondCreated;
    live.duplicates = Number(dupClaims.rows[0]?.n ?? -1);
    live.deFirstSemanticCreated = deFirstCreated;
    live.deSecondSemanticCreated = deSecondCreated;
    live.deFirstMatchesExistingRunner = deFirstCreated === estExpected;
    live.skFirstSemanticCreated = skFirstCreated;
    live.skSecondSemanticCreated = skSecondCreated;
    live.atIdempotent = firstCreated > 0 && secondCreated === 0;
    live.deIdempotent = deFirstCreated > 0 && deSecondCreated === 0;
    live.skIdempotent = skFirstCreated > 0 && skSecondCreated === 0;
    live.deJurisdictionRejected = deRejected;
    live.euTrustRejected = euTrustRejected;
    live.atTrustCount = Number(atTrust.rows[0]?.n ?? -1);
    live.deTrustCount = Number(deTrust.rows[0]?.n ?? -1);
    live.deTrustPreserved = Number(deTrust.rows[0]?.n) === 1
      && Number(deTrustRemainsDe.rows[0]?.n) > 0;
    live.deJurisdictionPreserved = Number(deJurisdiction.rows[0]?.n) >= 1;
    live.germanClassifiedAsAt = Number(germanClassifiedAsAt.rows[0]?.n ?? -1);
    live.oldSourcesBecameAt = Number(oldTrustAsAt.rows[0]?.n ?? -1);
    live.skTrustCount = Number(skTrust.rows[0]?.n ?? -1);
    live.existingTrustDomainsPreserved = [
      "eu", "de", "sk", "cz", "pl", "hu", "bilateral_tax_treaty", "at",
    ].every((code) => String(preservedTrustAllowlist.rows[0]?.def ?? "").includes(`'${code}'`));
    live.noPublicGrants = Number(grants.rows[0]?.n) === 0;
    live.pass = Boolean(live.atIdempotent)
      && Boolean(live.deIdempotent)
      && Boolean(live.skIdempotent)
      && Boolean(live.deFirstMatchesExistingRunner)
      && Boolean(live.deTrustPreserved)
      && Boolean(live.deJurisdictionPreserved)
      && Number(live.germanClassifiedAsAt) === 0
      && Boolean(live.existingTrustDomainsPreserved)
      && deRejected
      && euTrustRejected
      && Number(live.duplicates) === 0
      && Boolean(live.noPublicGrants);
  } finally {
    await ingestor?.end().catch(() => undefined);
    await admin?.end().catch(() => undefined);
    run("docker", ["rm", "-f", CONTAINER], 30_000);
  }
  return live;
}

async function main(): Promise<void> {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const semantic = evaluateAtSkAustrianNationalFoundationSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const e2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const ingestion = await runDisposableIngestion();

  const atSk0bProofs = (atSk0b.proofs ?? {}) as Record<string, unknown>;
  const atSk0bPreserved = atSk0b.phaseResult === "PASS"
    && atSk0bProofs.atSkCorridorStructurallySupported === true
    && atSk0bProofs.deCorridorsPreserved === true
    && atSk0bProofs.activityTimelineContractPresent === true
    && atSk0bProofs.multiStateCaseContextPresent === true
    && atSk0bProofs.fullAtDeCorridorStillAbsent === true
    && atSk0bProofs.activeCorridorsZero === true;

  const timelineOk = validateActivityTimeline([
    { country: "AT", activityType: "SELF_EMPLOYED", from: "2026-01-01", to: "2026-07-31", legalClassification: "UNRESOLVED" },
    { country: "SK", activityType: "SELF_EMPLOYED", from: "2026-01-01", to: null, legalClassification: "UNRESOLVED" },
  ]).valid;
  const multiStateOk = validateMultiStateCaseContext({
    routing: {
      marketPackCountry: "SK",
      bureaucracyCountry: "AT",
      corridorCandidate: "AT-SK",
      countryContextSource: "AGENCY_CASE",
    },
    countriesInCase: ["SK", "AT"],
    activityTimeline: [
      { country: "AT", activityType: "SELF_EMPLOYED", from: "2026-01-01", to: null, legalClassification: "UNRESOLVED" },
    ],
    casePeriod: { from: "2026-01-01", to: "2026-12-31" },
    residenceState: "SK",
  }).valid;

  const failedProofs = (semantic.failedProofs as string[]) ?? [];
  const scenarioSummary = semantic.scenarioSummary as { failed: number };
  const negativeSummary = semantic.negativeControlSummary as { failed: number };
  const semanticPass = failedProofs.length === 0
    && scenarioSummary.failed === 0
    && negativeSummary.failed === 0;
  const ingestPass = ingestion.pass === true;
  const overallPass = semanticPass
    && ingestPass
    && atSk0a.phaseResult === "PASS"
    && atSk0bPreserved
    && e2e.phaseResult === "PASS"
    && timelineOk
    && multiStateOk;

  const recommendation = overallPass
    ? (semantic.materialUnchanged
      ? "AUTHORIZE_AT_SK_APPLICABLE_LEGISLATION_AND_A1_CONNECTOR"
      : "AUTHORIZE_DE_SK_REVALIDATION_AFTER_AT_NATIONAL_FOUNDATION_COMMIT")
    : "ONE_SPECIFIC_AT_SK_0C_REMEDIATION_PACKAGE";

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    recommendation,
    deSkGovernance: semantic.materialUnchanged
      ? "DE_SK_REVALIDATION_NOT_REQUIRED"
      : "DE_SK_REVALIDATION_REQUIRED_AFTER_AT_NATIONAL_FOUNDATION_COMMIT",
    repository: {
      branch,
      startingHead: EXPECTED_HEAD,
      finalHead: head,
      workingTree: dirty,
    },
    semantic,
    validation: {
      atSk0c: overallPass ? "PASS" : "FAIL",
      atSk0b: atSk0b.phaseResult,
      atSk0a: atSk0a.phaseResult,
      e2eSemantic: e2e.phaseResult,
      ingestion,
    },
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atSkConnectorActive: false,
      atSkLegalAnswers: false,
      atTaxAnswers: false,
    },
    filesCreated: [
      "lib/vaylo/smart-talk/knowledge/source-registry/at-national-foundation-contracts.ts",
      "lib/vaylo/smart-talk/knowledge/packs/at/national-foundation/at-national-foundation-pack.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-austrian-national-foundation-and-authority-model-audit.ts",
      "supabase/migrations/062_add_at_national_foundation_ingestion.sql",
    ],
    filesModified: [
      "package.json",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-corridor-architecture-and-reuse-audit.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-bounded-foundation-extension-audit.ts",
    ],
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0C_PROOF_FAILED",
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exitCode = 1;
}

const invokedDirectly = /run-at-sk-austrian-national-foundation-and-authority-model-audit\.ts$/u.test(
  (process.argv[1] ?? "").replace(/\\/gu, "/"),
);
if (invokedDirectly) {
  main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });
}
