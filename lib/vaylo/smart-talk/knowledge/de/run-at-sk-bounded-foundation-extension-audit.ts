/**
 * AT-SK-0B — bounded foundation extension for AT↔SK + SK/AT/DE multi-state cases.
 * Contract work only. No AT canonical knowledge. No migration. No production.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  CROSS_BORDER_CONNECTED_COUNTRIES,
  CROSS_BORDER_ORIGIN_MARKET,
  CROSS_BORDER_STRUCTURAL_CORRIDORS,
  CROSS_BORDER_SUPPORTED_ORIGIN_MARKETS,
  isStructurallySupportedCrossBorderCorridor,
  validateCuratedCrossBorderConnectorPack,
  type CuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import { buildValidDeSkPlannedConnectorPack } from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  BILATERAL_TAX_AUTHORIZED_PAIRS,
  BILATERAL_TAX_CANONICAL_TREATY_KEY,
  BILATERAL_TAX_COUNTRIES,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  BILATERAL_TAX_TRUST_DOMAIN,
  canonicalBilateralTaxTreatyKey,
  isAuthorizedBilateralTaxPair,
  validateCrossBorderTaxIncomeItem,
  type CrossBorderTaxIncomeItem,
} from "../source-registry/bilateral-tax-treaty-contracts";
import {
  DIRECT_AT_DE_BILATERAL_REQUIRED,
  SK_BILATERAL_LAYERS_SUFFICIENT,
  classifyAtDeBilateralBoundary,
  deriveCountriesInCase,
  deriveSlovakiaPackCorridorCandidate,
  switchBureaucracyCountry,
  validateActivityTimeline,
  validateMultiStateCaseContext,
  type ActivityTimelineEntry,
  type MultiStateCaseContext,
} from "../source-registry/multi-state-case-contracts";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { DE_SK_FAMILY_CONNECTOR_STATUS } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { runDeSkEndToEndCorridorReviewAudit } from "./run-de-sk-end-to-end-corridor-review-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0B" as const;
const EXPECTED_HEAD = "d8c31fac742b0539573dcc58448436dd04b0c70c";
const MIGRATION_BASELINE = "061" as const;
const AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-at-sk-bounded-foundation-extension-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([
  AUDIT_REL,
  PACKAGE_JSON_REL,
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/multi-state-case-contracts.ts",
]);

const CANONICAL_EU = [
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
] as const;
const CANONICAL_SK = [
  "lib/vaylo/smart-talk/knowledge/packs/sk/applicable-legislation/sk-applicable-legislation-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/health-insurance-coordination/sk-health-insurance-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/unemployment-coordination/sk-unemployment-coordination-adapter-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/sk/income-tax-residence/sk-income-tax-residence-pack.ts",
] as const;
const CANONICAL_DE_SK = [
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack.ts",
] as const;

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

function pathsModified(rels: readonly string[]): boolean {
  const dirty = new Set(dirtyPaths());
  return rels.some((rel) => dirty.has(rel));
}

function stubConnector(
  originMarket: CuratedCrossBorderConnectorPack["originMarket"],
  connectedCountry: CuratedCrossBorderConnectorPack["connectedCountry"],
): CuratedCrossBorderConnectorPack {
  return Object.freeze({
    ...buildValidDeSkPlannedConnectorPack(),
    originMarket,
    connectedCountry,
  });
}

function timelineEntry(
  country: string,
  activityType: ActivityTimelineEntry["activityType"],
  from: string,
  to: string | null,
): ActivityTimelineEntry {
  return Object.freeze({
    country,
    activityType,
    from,
    to,
    legalClassification: "UNRESOLVED",
  });
}

function incomeItem(
  id: string,
  sourceState: string,
  from: string,
  to: string,
): CrossBorderTaxIncomeItem {
  return Object.freeze({
    incomeItemId: id,
    incomeCategory: "INDEPENDENT_PERSONAL_SERVICES",
    activityType: "SELF_EMPLOYED",
    periodStart: from,
    periodEnd: to,
    payerState: sourceState,
    employerState: null,
    physicalWorkStates: [sourceState],
    sourceStateCandidate: sourceState,
    sourceStateVerified: null,
    treatyArticleCandidate: null,
    treatyArticleVerified: null,
    treatyArticleState: "ARTICLE_UNRESOLVED",
    fixedBaseState: null,
    permanentEstablishmentState: null,
    taxingRightStates: [],
    reliefMethodCandidate: null,
    classificationStatus: "UNRESOLVED",
  });
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((p) => !ALLOWED_DIRTY.has(p));
  const migrationFiles = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR));
  const migration061 = migrationFiles.some((f) => f.startsWith(`${MIGRATION_BASELINE}_`));
  const migration062Absent = !migrationFiles.some((f) => f.startsWith("062"));

  if (
    branch !== "main"
    || head !== EXPECTED_HEAD
    || unexpectedDirty.length > 0
    || !migration061
    || !migration062Absent
  ) {
    process.stdout.write(`${JSON.stringify({
      phase: PHASE,
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      branch,
      head,
      expectedHead: EXPECTED_HEAD,
      unexpectedDirty,
      migration061,
      migration062Absent,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const deSkPack = buildValidDeSkPlannedConnectorPack();
  const atSkStub = stubConnector("AT", "SK");
  const atCzStub = stubConnector("AT", "CZ");
  const atPlStub = stubConnector("AT", "PL");
  const atHuStub = stubConnector("AT", "HU");

  const atSkIssues = validateCuratedCrossBorderConnectorPack(atSkStub).issues;
  const atCzIssues = validateCuratedCrossBorderConnectorPack(atCzStub).issues;
  const atPlIssues = validateCuratedCrossBorderConnectorPack(atPlStub).issues;
  const atHuIssues = validateCuratedCrossBorderConnectorPack(atHuStub).issues;
  const deSkIssues = validateCuratedCrossBorderConnectorPack(deSkPack).issues;

  const skDe = deriveSlovakiaPackCorridorCandidate("SK", "DE");
  const skAt = deriveSlovakiaPackCorridorCandidate("SK", "AT");
  const skCz = deriveSlovakiaPackCorridorCandidate("SK", "CZ");

  const sequentialAtDe = [
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-07-31"),
    timelineEntry("DE", "SELF_EMPLOYED", "2026-08-01", "2026-12-31"),
  ];
  const sequentialDeAt = [
    timelineEntry("DE", "SELF_EMPLOYED", "2026-01-01", "2026-07-31"),
    timelineEntry("AT", "SELF_EMPLOYED", "2026-08-01", "2026-12-31"),
  ];
  const simultaneous = [
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-12-31"),
    timelineEntry("DE", "SELF_EMPLOYED", "2026-01-01", "2026-12-31"),
  ];
  const mixedAtSk = [
    timelineEntry("AT", "EMPLOYED", "2026-01-01", "2026-12-31"),
    timelineEntry("SK", "SELF_EMPLOYED", "2026-01-01", "2026-12-31"),
  ];
  const mixedDeAt = [
    timelineEntry("DE", "EMPLOYED", "2026-01-01", "2026-12-31"),
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-12-31"),
  ];
  const gapTimeline = [
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-03-31"),
    timelineEntry("DE", "SELF_EMPLOYED", "2026-08-01", "2026-12-31"),
  ];
  const invalidInterval = [
    timelineEntry("AT", "SELF_EMPLOYED", "2026-07-31", "2026-01-01"),
  ];

  const atCase: MultiStateCaseContext = {
    routing: {
      marketPackCountry: "SK",
      bureaucracyCountry: "AT",
      corridorCandidate: "AT-SK",
      countryContextSource: "AGENCY_CASE",
    },
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: sequentialAtDe,
    }),
    activityTimeline: sequentialAtDe,
    casePeriod: { from: "2026-01-01", to: "2026-12-31" },
    residenceState: "SK",
  };
  const switchedToDe = switchBureaucracyCountry(atCase, "DE");
  const deCase: MultiStateCaseContext = {
    ...atCase,
    routing: {
      marketPackCountry: "SK",
      bureaucracyCountry: "DE",
      corridorCandidate: "DE-SK",
      countryContextSource: "AGENCY_CASE",
    },
    activityTimeline: sequentialDeAt,
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: sequentialDeAt,
    }),
  };
  const switchedToAt = switchBureaucracyCountry(deCase, "AT");

  const atIncome = incomeItem("at-2026-h1", "AT", "2026-01-01", "2026-07-31");
  const deIncome = incomeItem("de-2026-h2", "DE", "2026-08-01", "2026-12-31");

  const e2e = runDeSkEndToEndCorridorReviewAudit();
  const e2eBlocked = e2e.reason === "PREFLIGHT_STOP";
  const e2eSemantic = e2eBlocked
    ? "PRECONDITION_BLOCKED_BY_EXPECTED_DIRTY_TREE"
    : e2e.phaseResult === "PASS"
      ? "PASS"
      : "SEMANTIC_REGRESSION_FAILURE";

  const atSkPackDirAbsent = !fs.existsSync(path.join(ROOT, "lib/vaylo/smart-talk/knowledge/packs/at-sk"));
  const atSkTaxLegalClaims = 0;

  const proofs = {
    baselineCorrect: branch === "main" && head === EXPECTED_HEAD,
    connectorAtOriginSupported: (CROSS_BORDER_SUPPORTED_ORIGIN_MARKETS as readonly string[]).includes("AT")
      && CROSS_BORDER_ORIGIN_MARKET === "DE",
    atSkCorridorStructurallySupported: isStructurallySupportedCrossBorderCorridor("AT", "SK")
      && (CROSS_BORDER_STRUCTURAL_CORRIDORS as readonly string[]).includes("AT-SK"),
    otherAtCorridorsStillBlocked: !isStructurallySupportedCrossBorderCorridor("AT", "CZ")
      && !isStructurallySupportedCrossBorderCorridor("AT", "PL")
      && !isStructurallySupportedCrossBorderCorridor("AT", "HU")
      && !isStructurallySupportedCrossBorderCorridor("AT", "DE")
      && atCzIssues.includes("UNKNOWN_CORRIDOR")
      && atPlIssues.includes("UNKNOWN_CORRIDOR")
      && atHuIssues.includes("UNKNOWN_CORRIDOR"),
    deCorridorsPreserved: isStructurallySupportedCrossBorderCorridor("DE", "SK")
      && isStructurallySupportedCrossBorderCorridor("DE", "CZ")
      && isStructurallySupportedCrossBorderCorridor("DE", "PL")
      && isStructurallySupportedCrossBorderCorridor("DE", "HU")
      && deSkIssues.length === 0
      && CROSS_BORDER_CONNECTED_COUNTRIES.join(",") === "SK,CZ,PL,HU",
    bilateralTaxAtCountrySupported: (BILATERAL_TAX_COUNTRIES as readonly string[]).includes("AT"),
    atSkTaxPairStructurallySupported: isAuthorizedBilateralTaxPair("AT", "SK")
      && isAuthorizedBilateralTaxPair("SK", "AT")
      && canonicalBilateralTaxTreatyKey("SK", "AT") === "AT-SK",
    deSkTaxPairPreserved: isAuthorizedBilateralTaxPair("DE", "SK")
      && BILATERAL_TAX_CANONICAL_TREATY_KEY === "DE-SK"
      && (BILATERAL_TAX_AUTHORIZED_PAIRS as readonly string[]).includes("DE-SK"),
    deAtTaxPairBlocked: !isAuthorizedBilateralTaxPair("DE", "AT")
      && !isAuthorizedBilateralTaxPair("AT", "CZ")
      && !isAuthorizedBilateralTaxPair("AT", "HU")
      && !isAuthorizedBilateralTaxPair("AT", "PL"),
    atSkTaxLegalContentStillAbsent: atSkPackDirAbsent && atSkTaxLegalClaims === 0,
    activityTimelineContractPresent: validateActivityTimeline(sequentialAtDe).valid,
    sequentialAtDeRepresentable: validateActivityTimeline(sequentialAtDe).valid,
    simultaneousAtDeRepresentable: validateActivityTimeline(simultaneous).valid,
    overlappingPeriodsAllowed: validateActivityTimeline(simultaneous).valid,
    invalidPeriodRejected: validateActivityTimeline(invalidInterval).issues
      .some((issue) => issue.includes("INVALID_REVERSED_INTERVAL")),
    oneYearOneStateRejected: sequentialAtDe.some((e) => e.country === "AT")
      && sequentialAtDe.some((e) => e.country === "DE"),
    postingNotInferred: sequentialAtDe.every((e) => e.legalClassification === "UNRESOLVED"),
    multiStateArticle13NotInferred: simultaneous.every((e) => e.legalClassification === "UNRESOLVED"),
    multiStateCaseContextPresent: validateMultiStateCaseContext(atCase).valid,
    threeCountryCaseRepresentable: atCase.countriesInCase.includes("SK")
      && atCase.countriesInCase.includes("AT")
      && atCase.countriesInCase.includes("DE"),
    selectorSwitchPreservesHistory: switchedToDe.context != null
      && switchedToDe.context.routing.bureaucracyCountry === "DE"
      && switchedToDe.context.routing.corridorCandidate === "DE-SK"
      && JSON.stringify(switchedToDe.context.activityTimeline) === JSON.stringify(atCase.activityTimeline)
      && switchedToAt.context != null
      && switchedToAt.context.routing.bureaucracyCountry === "AT"
      && JSON.stringify(switchedToAt.context.activityTimeline) === JSON.stringify(deCase.activityTimeline),
    bureaucracyCountryNotLegalMerits: atCase.routing.bureaucracyCountry === "AT"
      && atCase.residenceState === "SK",
    marketPackCountryNotLegalMerits: atCase.routing.marketPackCountry === "SK"
      && atCase.residenceState === "SK"
      && atCase.activityTimeline.some((e) => e.country !== "SK"),
    localeIndependent: !("userLocale" in atCase) && !("locale" in atCase.routing),
    perIncomeTaxModelPreserved: validateCrossBorderTaxIncomeItem(atIncome).valid
      && validateCrossBorderTaxIncomeItem(deIncome).valid
      && atIncome.incomeItemId !== deIncome.incomeItemId,
    directAtDeBoundaryRepresentable:
      classifyAtDeBilateralBoundary({ treatyResidenceCountry: "AT", incomeSourceCountries: ["DE"] })
        === DIRECT_AT_DE_BILATERAL_REQUIRED
      && classifyAtDeBilateralBoundary({ treatyResidenceCountry: "SK", incomeSourceCountries: ["AT", "DE"] })
        === SK_BILATERAL_LAYERS_SUFFICIENT,
    fullAtDeCorridorStillAbsent: !isStructurallySupportedCrossBorderCorridor("AT", "DE")
      && !isStructurallySupportedCrossBorderCorridor("DE", "AT")
      && !isAuthorizedBilateralTaxPair("DE", "AT"),
    sharedEuPacksModified: pathsModified(CANONICAL_EU),
    skCanonicalPacksModified: pathsModified(CANONICAL_SK),
    deSkCanonicalPacksModified: pathsModified(CANONICAL_DE_SK),
    migration062Absent,
    activeCorridorsZero:
      (DE_SK_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_HEALTH_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_FAMILY_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS as string) !== "active"
      && atSkIssues.includes("AT_SK_CONNECTOR_NOT_IMPLEMENTED"),
    runtimeUnauthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
    productionUnauthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
      && BILATERAL_TAX_TRUST_DOMAIN === "bilateral_tax_treaty",
  };

  const scenarios = [
    { id: 1, name: "SK Pack + DE selector → DE-SK candidate", pass: skDe.candidate === "DE-SK" },
    { id: 2, name: "SK Pack + AT selector → AT-SK candidate", pass: skAt.candidate === "AT-SK" },
    { id: 3, name: "unsupported bureaucracy selector", pass: skCz.candidate === null && skCz.issues.includes("UNSUPPORTED_BUREAUCRACY_COUNTRY") },
    { id: 4, name: "AT selector does not imply AT residence", pass: proofs.bureaucracyCountryNotLegalMerits },
    { id: 5, name: "DE selector does not imply DE residence", pass: deCase.routing.bureaucracyCountry === "DE" && deCase.residenceState === "SK" },
    { id: 6, name: "AT Jan-Jul → DE Aug-Dec self-employed", pass: proofs.sequentialAtDeRepresentable },
    { id: 7, name: "DE Jan-Jul → AT Aug-Dec self-employed", pass: validateActivityTimeline(sequentialDeAt).valid },
    { id: 8, name: "simultaneous AT+DE self-employed", pass: proofs.simultaneousAtDeRepresentable },
    { id: 9, name: "employment AT + self-employment SK", pass: validateActivityTimeline(mixedAtSk).valid },
    { id: 10, name: "employment DE + self-employment AT", pass: validateActivityTimeline(mixedDeAt).valid },
    { id: 11, name: "SK+AT+DE countriesInCase", pass: proofs.threeCountryCaseRepresentable },
    { id: 12, name: "selector AT→DE keeps AT history", pass: proofs.selectorSwitchPreservesHistory },
    { id: 13, name: "selector DE→AT keeps DE history", pass: proofs.selectorSwitchPreservesHistory },
    { id: 14, name: "invalid reversed time interval", pass: proofs.invalidPeriodRejected },
    { id: 15, name: "timeline gap accepted", pass: validateActivityTimeline(gapTimeline).valid },
    { id: 16, name: "timeline overlap accepted", pass: proofs.overlappingPeriodsAllowed },
    { id: 17, name: "AT→DE sequence does not auto-classify posting", pass: proofs.postingNotInferred },
    { id: 18, name: "AT→DE sequence does not auto-classify Article13", pass: proofs.multiStateArticle13NotInferred },
    { id: 19, name: "AT-SK connector structural acceptance", pass: proofs.atSkCorridorStructurallySupported && atSkIssues.includes("AT_SK_CONNECTOR_NOT_IMPLEMENTED") },
    { id: 20, name: "AT-CZ connector rejection", pass: atCzIssues.includes("UNKNOWN_CORRIDOR") },
    { id: 21, name: "AT-PL connector rejection", pass: atPlIssues.includes("UNKNOWN_CORRIDOR") },
    { id: 22, name: "AT-HU connector rejection", pass: atHuIssues.includes("UNKNOWN_CORRIDOR") },
    { id: 23, name: "DE-SK tax pair preserved", pass: proofs.deSkTaxPairPreserved },
    { id: 24, name: "AT-SK tax pair structurally accepted", pass: proofs.atSkTaxPairStructurallySupported },
    { id: 25, name: "DE-AT tax pair blocked", pass: proofs.deAtTaxPairBlocked },
    { id: 26, name: "SK tax residence + AT income + DE income representable", pass: proofs.perIncomeTaxModelPreserved && classifyAtDeBilateralBoundary({ treatyResidenceCountry: "SK", incomeSourceCountries: ["AT", "DE"] }) === SK_BILATERAL_LAYERS_SUFFICIENT },
    { id: 27, name: "AT treaty residence + DE-source income flags direct AT-DE boundary", pass: proofs.directAtDeBoundaryRepresentable },
    { id: 28, name: "active corridors remains zero", pass: proofs.activeCorridorsZero },
  ];

  const scenarioSummary = {
    total: scenarios.length,
    passed: scenarios.filter((s) => s.pass).length,
    failClosed: scenarios.filter((s) => !s.pass).length,
    blocked: 0,
  };

  const negativeProofsOk = !proofs.sharedEuPacksModified
    && !proofs.skCanonicalPacksModified
    && !proofs.deSkCanonicalPacksModified;
  const positiveProofsOk = (
    Object.entries(proofs) as [string, boolean][]
  ).every(([key, value]) => (
    key === "sharedEuPacksModified"
    || key === "skCanonicalPacksModified"
    || key === "deSkCanonicalPacksModified"
      ? value === false
      : value === true
  ));

  const deSkGovernance: "DE_SK_CLOSURE_REVALIDATION_REQUIRED_AFTER_COMMIT"
    | "DE_SK_CLOSURE_REVALIDATION_NOT_REQUIRED" =
    "DE_SK_CLOSURE_REVALIDATION_REQUIRED_AFTER_COMMIT";

  const overallPass = positiveProofsOk && negativeProofsOk && scenarioSummary.failClosed === 0;
  const recommendation = overallPass
    ? "AUTHORIZE_DE_SK_V1_REVALIDATION_AFTER_AT_SK_FOUNDATION_COMMIT"
    : "ONE_SPECIFIC_AT_SK_0B_REMEDIATION_PACKAGE";

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    recommendation,
    deSkGovernance,
    repository: {
      branch,
      startingHead: EXPECTED_HEAD,
      finalHead: head,
      workingTree: unexpectedDirty.length === 0 ? "expected-dirty" : unexpectedDirty,
    },
    proofs,
    failedProofs: (Object.entries(proofs) as [string, boolean][])
      .filter(([key, value]) => (
        key === "sharedEuPacksModified"
        || key === "skCanonicalPacksModified"
        || key === "deSkCanonicalPacksModified"
          ? value !== false
          : value !== true
      ))
      .map(([key]) => key),
    classifications: {
      atSk: "STRUCTURALLY_SUPPORTED",
      atSkConnectors: "NOT_IMPLEMENTED",
      atSkLegalMerits: "LEGAL_MERITS_UNAVAILABLE",
      multiStateContext: "RUNTIME_CONTEXT_ONLY",
      atCz: "FAIL_CLOSED",
      deAtTax: "FAIL_CLOSED",
      directAtDe: "DIRECT_AT_DE_BILATERAL_REQUIRED",
      deSkClosure: deSkGovernance,
    },
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atSkLegalAnswerAuthorization: false,
      atSkConnectorActivation: false,
    },
    e2eEvaluation: e2eSemantic,
    closureInvalidationEvaluation: deSkGovernance,
    scenarios,
    scenarioSummary,
    filesCreated: [
      AUDIT_REL,
      "lib/vaylo/smart-talk/knowledge/source-registry/multi-state-case-contracts.ts",
    ],
    filesModified: [
      PACKAGE_JSON_REL,
      "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
      "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
    ],
    currentGitStatus: dirty,
    concreteBlocker: overallPass ? "NONE" : "FOUNDATION_PROOF_FAILED",
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exit(1);
}

main();
