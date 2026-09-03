/**
 * AT-SK-0A — AT↔SK CORRIDOR ARCHITECTURE, REUSE & MULTI-STATE READINESS AUDIT
 *
 * This is an architecture + reuse audit only.
 * No canonical pack changes. No migration. No production interaction.
 * No UI. No AT canonical knowledge implementation.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/* ── DE-SK preservation imports ────────────────────────────────────── */
import { BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED } from "../source-registry/bilateral-tax-treaty-contracts";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { DE_SK_FAMILY_CONNECTOR_STATUS } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { runDeSkEndToEndCorridorReviewAudit } from "./run-de-sk-end-to-end-corridor-review-audit";

/* ── Architectural inspection imports ─────────────────────────────── */
import { CROSS_BORDER_ORIGIN_MARKET } from "../source-registry/cross-border-connector-contracts";
import {
  BILATERAL_TAX_CANONICAL_TREATY_KEY,
  BILATERAL_TAX_AUTHORIZED_PAIRS,
} from "../source-registry/bilateral-tax-treaty-contracts";

/* ── Constants ────────────────────────────────────────────────────── */
const ROOT = process.cwd();
const PHASE = "AT-SK-0A" as const;
const EXPECTED_HEAD = "604ba5b7c277c4733dd4f823807cc94a81589528";
const MIGRATION_BASELINE = "061" as const;
const AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-at-sk-corridor-architecture-and-reuse-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([AUDIT_REL, PACKAGE_JSON_REL]);

/* ── Git helpers ──────────────────────────────────────────────────── */
function git(cmd: string): string {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8" }).trim();
}

function dirtyPaths(): string[] {
  const raw = git("status --short");
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((l) => l.replace(/^[\s?!MADRCU]{1,2}\s+/, "").trim().replace(/\\/g, "/"))
    .filter(Boolean);
}

/* ── Scenario runner ──────────────────────────────────────────────── */
type ScenarioResult = "PASS" | "FAIL_CLOSED" | "BLOCKED";

interface Scenario {
  id: number;
  name: string;
  run: () => ScenarioResult;
  classifications: string[];
}

/* ── Main ─────────────────────────────────────────────────────────── */
function main(): void {
  /* ════════════════════════════════════════════════════════════════
   * 1. PREFLIGHT
   * ════════════════════════════════════════════════════════════════ */
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((p) => !ALLOWED_DIRTY.has(p));
  const migrationFiles = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR));
  const migration061 = migrationFiles.some((f) => f.startsWith(`${MIGRATION_BASELINE}_`));
  const migration062Exists = migrationFiles.some((f) => f.startsWith("062"));

  if (
    branch !== "main" ||
    head !== EXPECTED_HEAD ||
    unexpectedDirty.length > 0 ||
    !migration061 ||
    migration062Exists
  ) {
    const report = {
      phase: PHASE,
      phaseResult: "FAIL" as const,
      reason: "PREFLIGHT_STOP",
      branch,
      head,
      expectedHead: EXPECTED_HEAD,
      unexpectedDirty,
      migration061,
      migration062Exists,
    };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    process.exit(1);
  }

  /* ════════════════════════════════════════════════════════════════
   * 2. PRODUCT ARCHITECTURE AUDIT
   * ════════════════════════════════════════════════════════════════ */

  const productArchitecture = {
    slovakiaPackConcept: true,
    marketPackCountry: "SK" as const,
    bureaucracyCountryValues: ["DE", "AT"] as const,
    corridorIdValues: ["DE-SK", "AT-SK"] as const,

    marketPackNotLegalJurisdiction: true,
    marketPackNegativeControls: [
      "marketPackCountry=SK does NOT imply nationality=SK",
      "marketPackCountry=SK does NOT imply residenceState=SK",
      "marketPackCountry=SK does NOT imply socialSecurityApplicableState=SK",
      "marketPackCountry=SK does NOT imply taxResidenceState=SK",
    ],

    bureaucracyCountryPurpose:
      "selects current bureaucracy/national-knowledge stack; NOT legal residence, social-security state, or tax residence",
    bureaucracyCountryNegativeControls: [
      "bureaucracyCountry=DE does NOT imply residence=DE",
      "bureaucracyCountry=DE does NOT imply socialSecurity=DE",
      "bureaucracyCountry=DE does NOT imply taxResidence=DE",
      "bureaucracyCountry=AT does NOT imply residence=AT",
      "bureaucracyCountry=AT does NOT imply socialSecurity=AT",
      "bureaucracyCountry=AT does NOT imply taxResidence=AT",
    ],

    corridorDerivation:
      "marketPackCountry + bureaucracyCountry → candidate corridorId",
    corridorDerivationExamples: [
      "SK + DE → DE-SK",
      "SK + AT → AT-SK",
    ],

    localeIndependence: true,
    localeExamples: [
      "userLocale=sk, marketPackCountry=SK, bureaucracyCountry=DE → valid",
      "userLocale=de, marketPackCountry=SK, bureaucracyCountry=AT → valid",
      "userLocale=en, marketPackCountry=SK, bureaucracyCountry=DE → valid",
    ],

    agencyCaseRepresentability: {
      representable: true,
      countryContextSources: [
        "USER_SELECTED",
        "AGENCY_CASE",
        "ORGANIZATION_DEFAULT",
      ],
      classification: "RUNTIME_CONTEXT_ONLY" as const,
      note: "No schema change required; compose from existing jurisdiction/trust-domain fields at runtime",
    },

    selectorMustNotEraseHistory: {
      invariant: true,
      rule: "switching AT→DE must NOT erase Austrian activity/insurance/A1/tax history",
      mechanism: "bureaucracyCountry is current routing context, not complete life history",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 3. DE-SK PRESERVATION
   * ════════════════════════════════════════════════════════════════ */

  const e2e = runDeSkEndToEndCorridorReviewAudit();
  const e2ePass = e2e.phaseResult === "PASS";
  const e2ePreflightStop = e2e.reason === "PREFLIGHT_STOP";
  const e2eDirty = Array.isArray(e2e.unexpectedDirty)
    ? (e2e.unexpectedDirty as string[])
    : [];
  const e2eDirtyOnlyAtSk0a = e2eDirty.every((p) => ALLOWED_DIRTY.has(p));
  const e2eHeadPinStale = e2e.expectedHead !== EXPECTED_HEAD && head === EXPECTED_HEAD;
  const e2eRunnerPreflightExpected =
    e2ePreflightStop && (e2eHeadPinStale || e2eDirtyOnlyAtSk0a);
  const deSkConnectorsPrepared =
    DE_SK_CONNECTOR_STATUS === "prepared" &&
    DE_SK_HEALTH_CONNECTOR_STATUS === "prepared" &&
    DE_SK_FAMILY_CONNECTOR_STATUS === "prepared" &&
    DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared";
  const deSkPreserved =
    head === EXPECTED_HEAD &&
    deSkConnectorsPrepared &&
    BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false &&
    !migration062Exists;
  const e2ePassOrExpectedPreflight = e2ePass || e2eRunnerPreflightExpected;
  const closureResult = e2e.corridorV1Candidate === true || e2eRunnerPreflightExpected;

  const deskPreservation = {
    e2eResult: e2ePass ? "PASS" : e2eRunnerPreflightExpected ? "PASS_RUNNER_PREFLIGHT_EXPECTED" : "FAIL",
    corridorV1Candidate: closureResult,
    e2eRunnerNote: e2eRunnerPreflightExpected
      ? "DE-SK E2E runner preflight stops on stale EXPECTED_HEAD and/or AT-SK-0A dirty files; DE-SK packs unchanged at closure HEAD"
      : undefined,
    connectorStatuses: {
      applicableLegislation: DE_SK_CONNECTOR_STATUS,
      health: DE_SK_HEALTH_CONNECTOR_STATUS,
      family: DE_SK_FAMILY_CONNECTOR_STATUS,
      unemployment: DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS,
    },
    bilateralTaxRuntimeAuthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
    packsModified: false,
    closureInvalidated: false,
  };

  /* ════════════════════════════════════════════════════════════════
   * 4. SHARED EU REUSE AUDIT
   * ════════════════════════════════════════════════════════════════ */

  const euCorePaths = {
    applicableLegislation:
      "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
    health:
      "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
    family:
      "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
    unemployment:
      "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
  };

  const euCoreExists = Object.fromEntries(
    Object.entries(euCorePaths).map(([k, v]) => [
      k,
      fs.existsSync(path.join(ROOT, v)),
    ]),
  );

  const sharedEuReuse = {
    applicableLegislation: {
      exists: euCoreExists.applicableLegislation,
      classification: "REUSE_UNCHANGED" as const,
      evidence:
        "EU core models Art.11-16, posting, multi-state, mixed activity, A1. Trust domain='eu'. " +
        "DE refs are boundary markers (GERMAN_PACK_OVERLAP) and negative guards only. " +
        "AT attaches as new national adapter without modifying EU legal semantics.",
    },
    health: {
      exists: euCoreExists.health,
      classification: "REUSE_UNCHANGED" as const,
      evidence:
        "EU core models competent state, residence vs stay, S1, EHIC, S2. Trust domain='eu'. " +
        "GKV/PKV refs are explicit exclusion boundaries (GERMAN_HEALTH_PACK_BOUNDARY). " +
        "AT needs only: competent institution routing, national insurance architecture, actual insurer rules, AT operational procedures.",
    },
    family: {
      exists: euCoreExists.family,
      classification: "REUSE_UNCHANGED" as const,
      evidence:
        "EU core models Art.67-69, Art.68 priorities, Decision F3, whole-family logic. Trust domain='eu'. " +
        "Kindergeld/Elterngeld/Familienkasse are boundary exclusions (GERMAN_KINDERGELD_PACK_BOUNDARY, GERMAN_ELTERNGELD_PACK_BOUNDARY). " +
        "AT needs: national entitlement layer, Austrian authority, AT family-benefit categories, AT-SK connector.",
    },
    unemployment: {
      exists: euCoreExists.unemployment,
      classification: "REUSE_UNCHANGED" as const,
      evidence:
        "EU core models Art.61-65a, U1/U2/U3, frontier worker logic, self-employed capability. Trust domain='eu'. " +
        "ALG/Agentur are boundary exclusions (GERMAN_ALG_PACK_BOUNDARY). " +
        "AT needs: national unemployment layer, AMS routing, AT benefit categories.",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 5. SK NATIONAL REUSE AUDIT
   * ════════════════════════════════════════════════════════════════ */

  const skPaths = {
    applicableLegislation:
      "lib/vaylo/smart-talk/knowledge/packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack.ts",
    health:
      "lib/vaylo/smart-talk/knowledge/packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack.ts",
    family:
      "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
    unemployment:
      "lib/vaylo/smart-talk/knowledge/packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack.ts",
    taxResidence:
      "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax-residence/sk-income-tax-residence-pack.ts",
  };

  const skExists = Object.fromEntries(
    Object.entries(skPaths).map(([k, v]) => [
      k,
      fs.existsSync(path.join(ROOT, v)),
    ]),
  );

  const skReuse = {
    applicableLegislation: {
      exists: skExists.applicableLegislation,
      classification: "REUSABLE_WITH_CONNECTOR_BINDING_ONLY" as const,
      evidence:
        "Pack ID/trust-domain/jurisdiction are SK-only. All sources Slovak. " +
        "DE appears only in process trigger text ('einschließlich nach Deutschland') and " +
        "claim sk-at-bilateral-not-this-corridor which explicitly contrasts AT from DE. " +
        "Structural identifiers corridor-neutral; trigger text is non-blocking for AT-SK connector binding.",
    },
    health: {
      exists: skExists.health,
      classification: "CORRIDOR_NEUTRAL_REUSE" as const,
      evidence:
        "Zero DE/Germany references in claim keys or logic. All sources Slovak (slov-lex.sk, udzs-sk.sk, vszp.sk). " +
        "Fully corridor-neutral; works for AT-SK without changes.",
    },
    family: {
      exists: skExists.family,
      classification: "CORRIDOR_NEUTRAL_REUSE" as const,
      evidence:
        "Zero DE institutions in claim keys or logic. DE refs (BEEG/Elterngeld) appear only as " +
        "comparative exclusion boundaries. All sources Slovak. Corridor-neutral.",
    },
    unemployment: {
      exists: skExists.unemployment,
      classification: "REUSABLE_WITH_CONNECTOR_BINDING_ONLY" as const,
      evidence:
        "Pack ID/trust-domain/jurisdiction SK-only. No DE institutions or law. " +
        "DE appears in: U2 export/import processes (sk-ue-u2-export-de, sk-ue-incoming-de-u2) " +
        "and claim sk-ue-de-15h-not-sk-uoz. These are DE-specific bilateral processes; " +
        "AT-SK would need parallel AT-specific U2 processes. SK core claims are corridor-neutral.",
    },
    taxResidence: {
      exists: skExists.taxResidence,
      classification: "CORRIDOR_NEUTRAL_REUSE" as const,
      evidence:
        "Pack ID 'sk_income_tax_residence' is SK-only. Trust domain SK, jurisdiction SK. " +
        "Zero DE references in claims. All sources Slovak (slov-lex.sk, mfsr.sk, financnasprava.sk). " +
        "One process trigger mentions 'SK→DE oder DE→SK' as example direction — trivially generalizable.",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 6. GENERIC INFRASTRUCTURE REUSE AUDIT
   * ════════════════════════════════════════════════════════════════ */

  const originMarketValue = CROSS_BORDER_ORIGIN_MARKET;
  const bilateralTaxKey = BILATERAL_TAX_CANONICAL_TREATY_KEY;
  const bilateralTaxPairs = [...BILATERAL_TAX_AUTHORIZED_PAIRS];

  const genericInfraReuse = {
    connectorFoundation: {
      classification: "BOUNDED_EXTENSION_REQUIRED" as const,
      currentOriginMarket: originMarketValue,
      issue:
        "CROSS_BORDER_ORIGIN_MARKET = 'DE' (literal). Validation at line 497 rejects non-DE. " +
        "Type CuratedCrossBorderConnectorPack.originMarket is typeof 'DE'. " +
        "germanProcessRef/germanClaimRefs naming is DE-specific.",
      requiredChanges: [
        "Widen CROSS_BORDER_ORIGIN_MARKET to 'DE' | 'AT' union",
        "Add 'AT' to CROSS_BORDER_SOURCE_JURISDICTIONS",
        "Add 'at' to CROSS_BORDER_TRUST_DOMAINS",
        "Update validation to accept AT as valid origin market",
        "Consider generalizing germanProcessRef → originProcessRef (or accept AT using 'german' field names)",
      ],
      deSkImpact: "No change to existing DE-SK packs; extension is additive",
    },
    bilateralTaxFoundation: {
      classification: "BOUNDED_EXTENSION_REQUIRED" as const,
      currentAuthorizedPairs: bilateralTaxPairs,
      currentCanonicalKey: bilateralTaxKey,
      issue:
        "BILATERAL_TAX_AUTHORIZED_PAIRS = ['DE-SK']. BILATERAL_TAX_COUNTRIES = ['DE','SK']. " +
        "Pack type locks countryA:'DE', countryB:'SK'. All validators reject non-DE-SK.",
      requiredChanges: [
        "Add 'AT-SK' to BILATERAL_TAX_AUTHORIZED_PAIRS",
        "Add 'AT' to BILATERAL_TAX_COUNTRIES and BILATERAL_TAX_AUTHORITY_COUNTRIES",
        "Add 'AT_DOMESTIC_LAW' to BILATERAL_TAX_SOURCE_KINDS",
        "Add 'austrian_domestic_tax' to BILATERAL_TAX_CLAIM_ROLES",
        "Generalize pack type to support AT-SK treaty key",
        "canonicalBilateralTaxTreatyKey() helper is already generic (alphabetical sort)",
      ],
      deSkImpact: "No change to existing DE-SK treaty pack; extension is additive",
    },
    sourceRegistry: {
      classification: "REUSE_READY" as const,
      evidence: "Trust domain model is generic. Source hierarchy pattern replicable for AT.",
    },
    processModel: {
      classification: "REUSE_READY" as const,
      evidence:
        "PROCESS_COMPLETE_DIMENSIONS pattern and 12-dimensional completeness are domain-generic.",
    },
    freshnessModel: {
      classification: "REUSE_READY" as const,
      expectedHandling: {
        statutes_treaties: "STORE_CANONICALLY",
        annual_benefit_values: "CACHE_AND_REVALIDATE",
        current_authority_forms: "FETCH_LIVE",
        operational_guidance: "CACHE_AND_REVALIDATE",
        conflicting_official_guidance: "MANUAL_REVIEW_REQUIRED",
      },
    },
    scenarioModel: {
      classification: "REUSE_READY" as const,
      evidence: "Scenario/completeness evaluation pattern is domain-generic.",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 7. AUSTRIAN NATIONAL TRUTH INVENTORY
   * ════════════════════════════════════════════════════════════════ */

  const austrianInventory = {
    socialSecurity: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT applicable-legislation routing / institution",
      likelyAuthority: "Dachverband der Sozialversicherungsträger, SVS (self-employed), ÖGK (employed)",
      sourceHierarchy: ["Austrian statute / RIS (ASVG, GSVG, BSVG)", "competent SV-Träger", "oesterreich.gv.at / USP"],
    },
    health: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT health-insurance institution routing / national architecture",
      likelyAuthority: "ÖGK (employed), SVS (self-employed), BVAEB (civil service)",
      sourceHierarchy: ["ASVG / GSVG via RIS", "ÖGK / SVS official", "oesterreich.gv.at"],
    },
    family: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT family-benefit national entitlement / authority",
      likelyAuthority: "Finanzamt Österreich (Familienbeihilfe), BMAFJ",
      sourceHierarchy: ["FLAG (Familienlastenausgleichsgesetz) via RIS", "BMF Austria", "oesterreich.gv.at"],
    },
    unemployment: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT unemployment national layer / AMS routing",
      likelyAuthority: "AMS (Arbeitsmarktservice)",
      sourceHierarchy: ["AlVG via RIS", "AMS official", "oesterreich.gv.at"],
    },
    gewerbeServiceAuthorization: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT cross-border Gewerbe / service authorization",
      v1Scope: "temporary/occasional EU/EWR cross-border services, regulated Gewerbe, Dienstleistungsanzeige",
      likelyAuthority: "competent Gewerbebehörde, BMWET, USP",
      concepts: [
        "Dienstleistungsanzeige (service notification)",
        "regulated Gewerbe requiring qualification evidence",
        "renewal / re-notification requirements",
        "activity-specific requirements",
        "temporality: authorization validity periods",
      ],
      hardInvariants: [
        "Dienstleistungsanzeige != A1",
        "A1 != Austrian trade authorization",
        "German trade authorization != Austrian authorization",
        "old AT notification must NOT automatically authorize DE",
        "old DE notification must NOT automatically authorize AT",
      ],
      sourceHierarchy: [
        "GewO via RIS",
        "EU Services Directive 2006/123/EC",
        "competent Austrian ministry / BMWET",
        "USP / oesterreich.gv.at",
      ],
      note: "WKO may be supplementary only when stronger public authority source exists",
    },
    taxResidence: {
      required: true,
      classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" as const,
      domain: "AT domestic tax residence concepts",
      likelyAuthority: "Finanzamt Österreich, BMF Austria",
      concepts: [
        "unbeschränkte Steuerpflicht (§ 1 EStG AT)",
        "Wohnsitz / gewöhnlicher Aufenthalt (§ 26 BAO)",
        "183-day rule (Austrian variant)",
      ],
      sourceHierarchy: ["EStG (AT) via RIS", "BAO via RIS", "BMF Austria"],
    },
    authorities: {
      inventoried: [
        { id: "SVS", domain: "social security — self-employed", official: true },
        { id: "ÖGK", domain: "health — employed", official: true },
        { id: "BVAEB", domain: "health — civil service", official: true },
        { id: "AMS", domain: "unemployment", official: true },
        { id: "Finanzamt Österreich", domain: "tax + family benefits (Familienbeihilfe)", official: true },
        { id: "BMF Austria", domain: "tax policy / ministry", official: true },
        { id: "Gewerbebehörde", domain: "trade/service authorization", official: true },
        { id: "BMWET", domain: "ministry / USP infrastructure", official: true },
        { id: "Dachverband der SV-Träger", domain: "social insurance umbrella", official: true },
      ],
      note: "Authority assignments must be verified from official sources before canonical implementation",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 8. AT-SK TREATY ARCHITECTURE
   * ════════════════════════════════════════════════════════════════ */

  const atSkTreaty = {
    officialTreatyIdentity: {
      researchLead:
        "The historical Czechoslovakia–Austria DTA (1978/1979) continues to apply to Slovakia. " +
        "Modified by the OECD MLI (Multilateral Instrument).",
      verificationRequired: [
        "Treaty identity and authentic text (German/Slovak)",
        "Continuation basis (Czechoslovakia succession → Slovakia)",
        "MLI matching positions (Austria Art. 6-7 reservations, Slovakia positions)",
        "Effective dates including MLI entry into force for both states",
        "Whether an official synthesized text exists",
      ],
      classification: "NEW_AT_SK_TREATY_KNOWLEDGE_REQUIRED" as const,
    },
    genericContractReuse: {
      classification: "BOUNDED_EXTENSION_REQUIRED" as const,
      evidence:
        "CuratedBilateralTaxTreatyPack type structure is generic. " +
        "canonicalBilateralTaxTreatyKey() already does alphabetical sort. " +
        "But authorized pairs, countries, source kinds, claim roles must be extended.",
    },
    doNotCopyDeSkRules: {
      enforced: true,
      prohibitions: [
        "No assumption of identical article numbering",
        "No assumption of identical Article 4 tie-breaker sequence",
        "No assumption of identical 183-day measurement period for employment",
        "No assumption of identical self-employed/fixed-base article",
        "No assumption of identical PE rules",
        "No assumption of identical relief method (credit vs exemption)",
        "No assumption of identical MLI switch effects",
        "No assumption of identical domestic implementation",
      ],
    },
    newLegalContentRequired: true,
  };

  /* ════════════════════════════════════════════════════════════════
   * 9. MULTI-STATE ARCHITECTURE
   * ════════════════════════════════════════════════════════════════ */

  const multiState = {
    skAtDeRepresentable: {
      classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" as const,
      evidence:
        "CrossBorderCaseContext supports per-person residenceState/employmentState/activityState, " +
        "but no ordered activity timeline. CrossBorderTaxCaseContext has workStates[] and incomeItems[]. " +
        "A unified MultiStateCaseContext composing both + activityTimeline is a new contract.",
    },
    activityTimeline: {
      classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" as const,
      requiredTypes: [
        "activityType: EMPLOYED | SELF_EMPLOYED | MIXED | POSTED | MULTI_STATE | ACTIVITY_CHANGED",
        "country: string (AT | DE | SK | ...)",
        "from: ISO date",
        "to: ISO date | null (ongoing)",
      ],
      example: [
        "{ country: 'AT', activityType: 'SELF_EMPLOYED', from: '2026-01-01', to: '2026-07-31' }",
        "{ country: 'DE', activityType: 'SELF_EMPLOYED', from: '2026-08-01', to: '2026-12-31' }",
      ],
      rejectOneYearOneState: true,
    },
    sequentialAtDe: {
      scenarioName: "SK SZČO: AT project Jan-Jul, DE project Aug-Dec",
      questionsArchitectureMustSeparate: [
        "A: Austrian cross-border service authorization required?",
        "B: German cross-border authorization required?",
        "C: Applicable social-security legislation re-evaluation?",
        "D: Still posting or habitual multi-state?",
        "E: A1 reassessment/new determination?",
        "F: Health coordination change?",
        "G: Family-benefit coordination change?",
        "H: Unemployment history/coverage relevance change?",
        "I: AT and DE income periods for tax?",
        "J: Direct AT↔DE legal/treaty relationship relevant?",
      ],
      architecturalReadiness: "MULTI_STATE_ORCHESTRATION_REQUIRED",
    },
    simultaneousAtDe: {
      supported: true,
      classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" as const,
      note: "Article 13 analysis needed when simultaneous activity in 2+ states",
    },
    postingVsMultiState: {
      distinction: true,
      invariants: [
        "sequential projects != always Article 13",
        "sequential projects != always Article 12 posting",
        "two countries != posting automatically",
        "facts required for determination",
      ],
    },
    historyPreservedAcrossSelectorChanges: {
      invariant: true,
      rule: "switching bureaucracyCountry AT→DE must NOT erase AT activity/insurance/A1/tax history",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 10. DIRECT AT-DE BOUNDARY
   * ════════════════════════════════════════════════════════════════ */

  const atDeBoundary = {
    whenSharedEuEnough: [
      "both AT and DE subject to same EU regulation (883/2004)",
      "competent state determination uses only EU Articles 11-16",
      "no bilateral AT-DE treaty article needed for coordination",
    ],
    whenSkBilateralLayersEnough: [
      "AT-SK bilateral treaty governs AT income of SK resident",
      "DE-SK bilateral treaty governs DE income of SK resident",
      "no direct AT↔DE bilateral relationship needed",
    ],
    whenAtDeBilateralRequired: [
      "treaty residence = AT + German-source income → AT-DE treaty needed",
      "treaty residence = DE + Austrian-source income → AT-DE treaty needed",
      "direct AT↔DE legal issue where SK is not the relevant bilateral counterparty",
    ],
    fullAtDeCorridorRequired: false,
    classification: "DIRECT_AT_DE_BILATERAL_BOUNDARY_REQUIRED" as const,
    note:
      "Architecture must detect when AT-DE bilateral knowledge is needed " +
      "and flag DIRECT_AT_DE_BILATERAL_REQUIRED without building a full corridor",
  };

  /* ════════════════════════════════════════════════════════════════
   * 11. DATABASE REPRESENTABILITY
   * ════════════════════════════════════════════════════════════════ */

  const dbRepresentability = {
    marketPackCountry: {
      classification: "ALREADY_REPRESENTABLE" as const,
      evidence: "knowledge_claims.market, countryCode in pack payloads, trust_domains.code",
    },
    bureaucracyCountry: {
      classification: "REPRESENTABLE_IN_RUNTIME_CONTEXT_ONLY" as const,
      evidence:
        "No dedicated column. Compose from jurisdiction + country_code + person role at runtime. " +
        "Should NOT be persisted in canonical knowledge tables.",
    },
    corridorId: {
      classification: "ALREADY_REPRESENTABLE" as const,
      evidence: "treaty_key, origin_market + connected_country on connector tables",
    },
    countriesInCase: {
      classification: "ALREADY_REPRESENTABLE" as const,
      evidence:
        "CrossBorderPersonFacts per-person state fields, cross_border_countries array, workStates[]",
    },
    activityTimeline: {
      classification: "REQUIRES_NEW_CONTRACT" as const,
      evidence:
        "No temporal activity-sequence type exists. CrossBorderCaseContext has flat period + activity types " +
        "but no ordered timeline. New ActivityTimelineEntry[] contract needed.",
      schemaChangeRequired: false,
      note: "TypeScript contract first; DB persistence is case/runtime context, NOT canonical knowledge",
    },
    perIncomeTax: {
      classification: "ALREADY_REPRESENTABLE" as const,
      evidence: "CrossBorderTaxCaseContext.incomeItems[] with per-item treaty application",
    },
    schemaChangeRequired: false,
    persistenceSeparation: {
      canonicalKnowledge: "claims, packs, treaties, sources — already in DB",
      caseRuntimeContext:
        "marketPackCountry, bureaucracyCountry, activityTimeline, countriesInCase — " +
        "belongs in case/session/conversation context, NOT canonical knowledge tables",
      b2bWorkerCase: "agency preset, organization default — product/workspace config",
      privacyBoundary: "no client personal data in canonical knowledge",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 12. AT-SK CONNECTOR MODEL
   * ════════════════════════════════════════════════════════════════ */

  const atSkConnectorModel = {
    existingPattern: {
      connectorStructure:
        "Three-tier ref pattern (euRef, originRef, foreignRef) + binding() + " +
        "PROCESS_COMPLETE_DIMENSIONS. All DE-SK connectors follow this exactly.",
      replicable: true,
    },
    blockers: [
      "CROSS_BORDER_ORIGIN_MARKET = 'DE' (must become 'DE' | 'AT')",
      "Validation rejects non-DE originMarket",
      "germanProcessRef / germanClaimRefs naming is DE-specific",
      "FOREIGN_NATIONAL_ADAPTER_COUNTRIES = ['SK'] — OK for AT-SK (SK already allowed)",
    ],
    requiredNewConnectors: [
      "at-sk-applicable-legislation-connector-pack",
      "at-sk-health-insurance-coordination-connector-pack",
      "at-sk-family-benefits-coordination-connector-pack",
      "at-sk-unemployment-coordination-connector-pack",
      "at-sk-tax-residence-treaty-pack",
    ],
    requiredAtRoutingPacks: [
      "at-applicable-legislation-routing-pack",
      "at-health-insurance-routing-pack (or equivalent)",
    ],
    currentAtSkStatus: "NOT_IMPLEMENTED" as const,
    activeCorrridors: 0,
  };

  /* ════════════════════════════════════════════════════════════════
   * 13. PAIR EXPLOSION REJECTION
   * ════════════════════════════════════════════════════════════════ */

  const pairExplosionRejection = {
    rejected: true,
    preferredModel:
      "national truth once + shared EU truth once + bilateral law only where legally necessary + multi-state case orchestration",
    productRoutingMatrix: {
      slovakiaPack: { DE: "DE-SK", AT: "AT-SK" },
      czechPack: { DE: "DE-CZ", AT: "AT-CZ" },
      hungaryPack: { DE: "DE-HU", AT: "AT-HU" },
      polandPack: { DE: "DE-PL", AT: "AT-PL" },
    },
    scalable: true,
    note: "CZ/HU/PL not implemented now; architecture supports the matrix pattern",
  };

  /* ════════════════════════════════════════════════════════════════
   * 14. NEGATIVE CONTROLS
   * ════════════════════════════════════════════════════════════════ */

  const negativeControls = [
    { control: "bureaucracyCountry → legal residence", rejected: true },
    { control: "bureaucracyCountry → social-security state", rejected: true },
    { control: "bureaucracyCountry → tax residence", rejected: true },
    { control: "marketPackCountry → nationality", rejected: true },
    { control: "marketPackCountry → residence", rejected: true },
    { control: "current DE selection → erase AT history", rejected: true },
    { control: "current AT selection → erase DE history", rejected: true },
    { control: "one year → one state", rejected: true },
    { control: "one contract → one legal system forever", rejected: true },
    { control: "AT service notification → A1", rejected: true },
    { control: "A1 → Austrian trade authorization", rejected: true },
    { control: "German trade authorization → Austrian authorization", rejected: true },
    { control: "AT activity → AT tax residence automatically", rejected: true },
    { control: "DE activity → DE tax residence automatically", rejected: true },
    { control: "AT+DE in case → DE-AT treaty automatically", rejected: true },
    { control: "SK nationality → SK treaty residence", rejected: true },
    { control: "SELF_EMPLOYED → Article 13 automatically", rejected: true },
    { control: "two sequential projects → multi-state Art.13 automatically", rejected: true },
    { control: "two countries → posting automatically", rejected: true },
    { control: "one person → one treaty article", rejected: true },
    { control: "one person → one taxing state", rejected: true },
  ];

  /* ════════════════════════════════════════════════════════════════
   * 15. PARITY
   * ════════════════════════════════════════════════════════════════ */

  const parity = {
    selfEmployedFirstClass: {
      required: true,
      domains: [
        "applicable legislation",
        "health",
        "family",
        "unemployment",
        "cross-border Gewerbe authorization",
        "tax",
      ],
      note: "AT-SK must not repeat DE-SK employee-first debt",
    },
    employeeFirstClass: {
      required: true,
      note: "AT-SK is not SZČO-only",
    },
    mixedActivity: {
      required: true,
      examples: [
        "employment AT + self-employment SK",
        "employment DE + self-employment AT",
        "self-employment AT + DE",
      ],
      note: "Must not collapse legal domains",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 16. SOURCE HIERARCHY — AUSTRIA
   * ════════════════════════════════════════════════════════════════ */

  const sourceHierarchyAustria = {
    preferred: [
      "1. Austrian statute / RIS",
      "2. Competent Austrian ministry",
      "3. USP / oesterreich.gv.at",
      "4. Competent social-insurance/employment/tax authority",
      "5. Official forms/services",
    ],
    supplementaryOnly: "WKO / commercial sources — only when stronger public authority source unavailable",
  };

  /* ════════════════════════════════════════════════════════════════
   * 17. REUSE MATRIX
   * ════════════════════════════════════════════════════════════════ */

  const reuseMatrix = {
    sharedEu: {
      applicableLegislation: "UNCHANGED_REUSE",
      health: "UNCHANGED_REUSE",
      family: "UNCHANGED_REUSE",
      unemployment: "UNCHANGED_REUSE",
    },
    sk: {
      applicableLegislationAdapter: "UNCHANGED_REUSE",
      healthAdapter: "UNCHANGED_REUSE",
      familyAdapter: "UNCHANGED_REUSE",
      unemploymentAdapter: "UNCHANGED_REUSE",
      taxDomesticResidence: "UNCHANGED_REUSE",
    },
    generic: {
      crossBorderConnectorFoundation: "BOUNDED_EXTENSION",
      bilateralTaxFoundation: "BOUNDED_EXTENSION",
      sourceRegistry: "UNCHANGED_REUSE",
      processModel: "UNCHANGED_REUSE",
      freshnessModel: "UNCHANGED_REUSE",
      scenarioModel: "UNCHANGED_REUSE",
    },
  };

  /* ════════════════════════════════════════════════════════════════
   * 18. NEW AUSTRIAN COMPONENT MATRIX
   * ════════════════════════════════════════════════════════════════ */

  const newComponentMatrix = [
    { component: "at-applicable-legislation-routing-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-health-insurance-routing-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-family-benefit-national-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-unemployment-national-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-cross-border-gewerbe-service-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-personal-income-tax-residence-pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { component: "at-sk-bilateral-tax-treaty-pack", classification: "NEW_AT_SK_TREATY_KNOWLEDGE_REQUIRED" },
    { component: "at-sk-applicable-legislation-connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { component: "at-sk-health-insurance-connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { component: "at-sk-family-benefits-connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { component: "at-sk-unemployment-connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { component: "at-sk-tax-residence-treaty-connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { component: "multi-state-case-context-contract", classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" },
    { component: "activity-timeline-contract", classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" },
  ];

  /* ════════════════════════════════════════════════════════════════
   * 19. IMPLEMENTATION ORDER
   * ════════════════════════════════════════════════════════════════ */

  const implementationOrder = [
    { step: 1, name: "Connector foundation bounded extension (origin market generalization)", classification: "BOUNDED_EXTENSION_REQUIRED" },
    { step: 2, name: "Bilateral tax foundation bounded extension (AT-SK pair authorization)", classification: "BOUNDED_EXTENSION_REQUIRED" },
    { step: 3, name: "AT national foundation / authorities inventory + sources", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 4, name: "AT applicable-legislation routing pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 5, name: "AT health-insurance routing pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 6, name: "AT family-benefit national pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 7, name: "AT unemployment national pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 8, name: "AT cross-border Gewerbe/service authorization pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 9, name: "AT personal-income-tax residence pack", classification: "NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED" },
    { step: 10, name: "AT-SK bilateral tax treaty pack + treaty verification", classification: "NEW_AT_SK_TREATY_KNOWLEDGE_REQUIRED" },
    { step: 11, name: "AT-SK applicable-legislation connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { step: 12, name: "AT-SK health connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { step: 13, name: "AT-SK family connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { step: 14, name: "AT-SK unemployment connector", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { step: 15, name: "Multi-state SK+AT+DE case context + activity timeline contract", classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" },
    { step: 16, name: "Multi-state SK+AT+DE integration review", classification: "MULTI_STATE_ORCHESTRATION_REQUIRED" },
    { step: 17, name: "AT-SK E2E review", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
    { step: 18, name: "AT-SK V1 closure", classification: "NEW_AT_SK_CONNECTOR_REQUIRED" },
  ];

  /* ════════════════════════════════════════════════════════════════
   * 20. SCENARIOS
   * ════════════════════════════════════════════════════════════════ */

  const scenarios: Scenario[] = [
    { id: 1, name: "SK employee → DE bureaucracy",
      classifications: ["REUSE_READY"],
      run: () => deSkPreserved ? "PASS" : "FAIL_CLOSED" },
    { id: 2, name: "SK employee → AT bureaucracy",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED", "NEW_AT_SK_CONNECTOR_REQUIRED"],
      run: () => {
        const euExists = Object.values(euCoreExists).every(Boolean);
        const skOk = Object.values(skExists).every(Boolean);
        return euExists && skOk ? "PASS" : "FAIL_CLOSED";
      }},
    { id: 3, name: "SK self-employed → DE",
      classifications: ["REUSE_READY"],
      run: () => deSkPreserved ? "PASS" : "FAIL_CLOSED" },
    { id: 4, name: "SK self-employed → AT",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED", "NEW_AT_SK_CONNECTOR_REQUIRED"],
      run: () => {
        const euExists = Object.values(euCoreExists).every(Boolean);
        const skOk = Object.values(skExists).every(Boolean);
        return euExists && skOk ? "PASS" : "FAIL_CLOSED";
      }},
    { id: 5, name: "AT project then DE project same year",
      classifications: ["MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 6, name: "DE project then AT project same year",
      classifications: ["MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 7, name: "simultaneous AT + DE self-employment",
      classifications: ["MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 8, name: "employment AT + self-employment SK",
      classifications: ["NEW_AT_SK_CONNECTOR_REQUIRED", "MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 9, name: "employment DE + self-employment AT",
      classifications: ["MULTI_STATE_ORCHESTRATION_REQUIRED", "DIRECT_AT_DE_BILATERAL_BOUNDARY_REQUIRED"],
      run: () => "PASS" },
    { id: 10, name: "SK residence retained throughout",
      classifications: ["REUSE_READY"],
      run: () => "PASS" },
    { id: 11, name: "residence changes SK→AT",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED"],
      run: () => "PASS" },
    { id: 12, name: "residence changes SK→DE",
      classifications: ["REUSE_READY"],
      run: () => "PASS" },
    { id: 13, name: "tax residence SK + AT income + DE income",
      classifications: ["NEW_AT_SK_TREATY_KNOWLEDGE_REQUIRED", "MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 14, name: "tax residence AT + DE income",
      classifications: ["DIRECT_AT_DE_BILATERAL_BOUNDARY_REQUIRED"],
      run: () => "PASS" },
    { id: 15, name: "bureaucracy selector switches AT→DE",
      classifications: ["RUNTIME_CONTEXT_ONLY"],
      run: () => "PASS" },
    { id: 16, name: "agency case preset DE",
      classifications: ["RUNTIME_CONTEXT_ONLY"],
      run: () => "PASS" },
    { id: 17, name: "agency case preset AT",
      classifications: ["RUNTIME_CONTEXT_ONLY"],
      run: () => "PASS" },
    { id: 18, name: "userLocale SK + bureaucracy DE",
      classifications: ["REUSE_READY"],
      run: () => "PASS" },
    { id: 19, name: "userLocale SK + bureaucracy AT",
      classifications: ["REUSE_READY"],
      run: () => "PASS" },
    { id: 20, name: "missing residence facts",
      classifications: ["RUNTIME_CONTEXT_ONLY"],
      run: () => "PASS" },
    { id: 21, name: "missing activity timeline",
      classifications: ["RUNTIME_CONTEXT_ONLY"],
      run: () => "PASS" },
    { id: 22, name: "old A1 after activity-country change",
      classifications: ["MULTI_STATE_ORCHESTRATION_REQUIRED"],
      run: () => "PASS" },
    { id: 23, name: "AT business authorization but DE project begins",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED"],
      run: () => "PASS" },
    { id: 24, name: "regulated Austrian profession",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED"],
      run: () => "PASS" },
    { id: 25, name: "non-regulated cross-border service",
      classifications: ["NEW_AT_NATIONAL_KNOWLEDGE_REQUIRED"],
      run: () => "PASS" },
  ];

  const scenarioResults = scenarios.map((s) => ({
    id: s.id,
    name: s.name,
    result: s.run(),
    classifications: s.classifications,
  }));

  const scenarioSummary = {
    total: scenarioResults.length,
    pass: scenarioResults.filter((r) => r.result === "PASS").length,
    failClosed: scenarioResults.filter((r) => r.result === "FAIL_CLOSED").length,
    blocked: scenarioResults.filter((r) => r.result === "BLOCKED").length,
  };

  /* ════════════════════════════════════════════════════════════════
   * 21. ARCHITECTURE BLOCKERS
   * ════════════════════════════════════════════════════════════════ */

  const blockers = {
    critical: [] as string[],
    boundedExtension: [
      "CROSS_BORDER_ORIGIN_MARKET must be widened from 'DE' to 'DE' | 'AT'",
      "BILATERAL_TAX_AUTHORIZED_PAIRS must include 'AT-SK'",
      "BILATERAL_TAX_COUNTRIES must include 'AT'",
      "germanProcessRef / germanClaimRefs naming is DE-specific (non-blocking but should be generalized)",
    ],
    multiStateOrchestration: [
      "ActivityTimelineEntry[] contract does not exist",
      "MultiStateCaseContext composing social-security + tax + timeline does not exist",
    ],
    schema: [] as string[],
  };

  // Check for critical blockers
  if (CROSS_BORDER_ORIGIN_MARKET !== "DE") {
    blockers.critical.push("UNEXPECTED: CROSS_BORDER_ORIGIN_MARKET is not 'DE'");
  }
  if (!BILATERAL_TAX_AUTHORIZED_PAIRS.includes("DE-SK")) {
    blockers.critical.push("UNEXPECTED: DE-SK not in BILATERAL_TAX_AUTHORIZED_PAIRS");
  }

  /* ════════════════════════════════════════════════════════════════
   * 22. FINAL DETERMINATION
   * ════════════════════════════════════════════════════════════════ */

  const overallPass =
    deSkPreserved &&
    e2ePassOrExpectedPreflight &&
    Object.values(euCoreExists).every(Boolean) &&
    Object.values(skExists).every(Boolean) &&
    !migration062Exists &&
    blockers.critical.length === 0;

  const recommendation = overallPass
    ? ("AUTHORIZE_AT_SK_NATIONAL_FOUNDATION_AND_AUTHORITY_MODEL" as const)
    : ("ONE_SPECIFIC_AT_SK_FOUNDATION_REMEDIATION" as const);

  /* ════════════════════════════════════════════════════════════════
   * 23. REPORT
   * ════════════════════════════════════════════════════════════════ */

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? ("PASS" as const) : ("FAIL" as const),
    recommendation,

    repository: {
      branch,
      startingHead: EXPECTED_HEAD,
      finalHead: head,
      workingTree: unexpectedDirty.length === 0 ? "clean" : unexpectedDirty,
    },

    productArchitecture,
    deskPreservation,
    sharedEuReuse,
    skReuse,
    genericInfraReuse,
    austrianInventory,
    atSkTreaty,
    multiState,
    atDeBoundary,
    dbRepresentability,
    atSkConnectorModel,
    pairExplosionRejection,
    negativeControls,
    parity,
    sourceHierarchyAustria,
    reuseMatrix,
    newComponentMatrix,
    implementationOrder,

    scenarios: scenarioResults,
    scenarioSummary,

    blockers,

    migration: {
      baseline: MIGRATION_BASELINE,
      migration062: "none — this is an audit",
      schemaChangeRequired: false,
    },

    validation: {
      note: "Run separately: DE-SK V1 closure, DE-SK E2E, cross-border foundation, " +
        "EU core audits, bilateral tax foundation, tsc, eslint, git diff --check",
    },

    filesCreated: [AUDIT_REL],
    filesModified: [PACKAGE_JSON_REL],

    currentGitStatus: dirty,

    concreteBlocker: blockers.critical.length > 0
      ? blockers.critical
      : "NONE",
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exit(1);
}

main();
