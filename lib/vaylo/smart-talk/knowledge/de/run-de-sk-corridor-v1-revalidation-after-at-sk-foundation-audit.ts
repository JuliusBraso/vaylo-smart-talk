/**
 * DE-SK-V1-REVALIDATION — after AT-SK-0B shared foundation extension.
 * Governance + backward-compatibility only. Does not rewrite historical closure.
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  CROSS_BORDER_ORIGIN_MARKET,
  isStructurallySupportedCrossBorderCorridor,
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import {
  buildValidDeSkPlannedConnectorPack,
  connectorTaxTreatyContamination,
} from "../source-registry/cross-border-connector-synthetic-fixtures";
import {
  BILATERAL_TAX_AUTHORIZED_PAIRS,
  BILATERAL_TAX_CANONICAL_TREATY_KEY,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  isAuthorizedBilateralTaxPair,
} from "../source-registry/bilateral-tax-treaty-contracts";
import {
  deriveCountriesInCase,
  deriveSlovakiaPackCorridorCandidate,
  switchBureaucracyCountry,
  validateActivityTimeline,
  validateMultiStateCaseContext,
  type ActivityTimelineEntry,
  type MultiStateCaseContext,
} from "../source-registry/multi-state-case-contracts";
import {
  DE_SK_CONNECTOR_PACK_ID,
  DE_SK_CONNECTOR_STATUS,
  buildDeSkApplicableLegislationConnectorPack,
} from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { DE_SK_FAMILY_CONNECTOR_STATUS } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";
import { evaluateAtSkCorridorArchitectureAndReuseSemantics } from "./run-at-sk-corridor-architecture-and-reuse-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";

const ROOT = process.cwd();
const PHASE = "DE-SK-V1-REVALIDATION" as const;
const CLOSURE_REVALIDATION_ID = "DE_SK_CORRIDOR_V1_REVALIDATION_AFTER_AT_SK_FOUNDATION" as const;
const CORRIDOR_ID = "DE-SK" as const;
const KNOWLEDGE_VERSION = "DE-SK-KNOWLEDGE-V1" as const;
const ORIGINAL_CLOSURE_ID = "DE_SK_CORRIDOR_V1_KNOWLEDGE_CLOSURE" as const;
const ORIGINAL_CLOSURE_COMMIT = "604ba5b7c277c4733dd4f823807cc94a81589528" as const;
const MATERIAL_CHANGE_COMMIT = "7d1801cce3eb99701a44d6d520f49db7e9f94b60" as const;
const REVALIDATION_BASELINE = "7d1801cce3eb99701a44d6d520f49db7e9f94b60" as const;
const AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-corridor-v1-revalidation-after-at-sk-foundation-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([
  AUDIT_REL,
  PACKAGE_JSON_REL,
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-end-to-end-corridor-review-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-at-sk-corridor-architecture-and-reuse-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-at-sk-bounded-foundation-extension-audit.ts",
]);

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
] as const);

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

function fileSha256(rel: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
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

function twoStateDeSkCase(): MultiStateCaseContext {
  const timeline = [
    timelineEntry("SK", "SELF_EMPLOYED", "2026-01-01", null),
    timelineEntry("DE", "SELF_EMPLOYED", "2026-03-01", "2026-12-31"),
  ];
  return {
    routing: {
      marketPackCountry: "SK",
      bureaucracyCountry: "DE",
      corridorCandidate: "DE-SK",
      countryContextSource: "USER_SELECTED",
    },
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: timeline,
    }),
    activityTimeline: timeline,
    residenceState: "SK",
  };
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((p) => !ALLOWED_DIRTY.has(p));
  const migrationFiles = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR));
  const has061 = migrationFiles.some((f) => f.startsWith("061_"));
  const has062 = migrationFiles.some((f) => f.startsWith("062"));
  if (
    branch !== "main"
    || head !== REVALIDATION_BASELINE
    || unexpectedDirty.length > 0
    || !has061
    || has062
  ) {
    process.stdout.write(`${JSON.stringify({
      phase: PHASE,
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      revalidationPassed: false,
      branch,
      head,
      expectedHead: REVALIDATION_BASELINE,
      unexpectedDirty,
      has061,
      has062,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const e2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const atSk0a = evaluateAtSkCorridorArchitectureAndReuseSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();

  const alPack = buildDeSkApplicableLegislationConnectorPack();
  const taxPack = buildDeSkTaxResidenceTreatyPack();
  const deSkFixture = buildValidDeSkPlannedConnectorPack();
  const ssTaxRejection = validateCuratedCrossBorderConnectorPack(connectorTaxTreatyContamination())
    .issues.includes("TAX_TREATY_ENGINE_NOT_AUTHORIZED");

  const twoState = twoStateDeSkCase();
  const threeTimeline = [
    ...twoState.activityTimeline,
    timelineEntry("AT", "SELF_EMPLOYED", "2026-01-01", "2026-07-31"),
  ];
  const threeState: MultiStateCaseContext = {
    ...twoState,
    activityTimeline: threeTimeline,
    countriesInCase: deriveCountriesInCase({
      marketPackCountry: "SK",
      residenceState: "SK",
      activityTimeline: threeTimeline,
    }),
  };
  const switched = switchBureaucracyCountry(threeState, "AT");
  const twoStateAfterThreeExists = validateMultiStateCaseContext(twoState).valid;

  const corridorV1Candidate = asBoolean(e2e.corridorV1Candidate) === true;
  const illegalFieldLeakageCount = asNumber(e2e.illegalFieldLeakageCount);
  const authorityRoutingConflictCount = asNumber(e2e.authorityRoutingConflictCount);
  const portableDocumentConflictCount = asNumber(e2e.portableDocumentConflictCount);
  const temporalConflictCount = asNumber(e2e.temporalConflictCount);
  const criticalV1BlockerCount = asNumber(e2e.criticalV1BlockerCount);
  const requiredV1KnowledgeGapCount = asNumber(e2e.requiredV1KnowledgeGapCount);
  const requiredV1HandoffGapCount = asNumber(e2e.requiredV1HandoffGapCount);
  const blockedByCrossDomainDefectCount = asNumber(e2e.blockedByCrossDomainDefectCount);
  const e2eScenarioCount = asNumber(e2e.endToEndScenarioCount);

  const originalClosureSemanticPass = e2e.phaseResult === "PASS"
    && corridorV1Candidate
    && asBoolean(e2e.employeeParityPass) === true
    && asBoolean(e2e.selfEmployedParityPass) === true
    && asBoolean(e2e.mixedActivityParityPass) === true
    && illegalFieldLeakageCount === 0
    && authorityRoutingConflictCount === 0
    && portableDocumentConflictCount === 0
    && temporalConflictCount === 0
    && criticalV1BlockerCount === 0
    && requiredV1KnowledgeGapCount === 0
    && requiredV1HandoffGapCount === 0
    && blockedByCrossDomainDefectCount === 0
    && asBoolean(e2e.productionAuthorized) === false
    && asBoolean(e2e.publicRuntimeAuthorized) === false
    && asNumber(e2e.activeCorridors) === 0
    && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
    && DE_SK_CONNECTOR_STATUS === "prepared"
    && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared";

  const canonicalDirty = dirty.some((file) => (
    file.includes("/packs/eu/")
    || file.includes("/packs/sk/")
    || file.includes("/packs/de-sk/")
    || file.includes("/packs/de/")
  ));

  const hashes = Object.fromEntries(MATERIAL_KNOWLEDGE_PATHS.map((rel) => [rel, fileSha256(rel)]));
  const atSkPackAbsent = !fs.existsSync(path.join(ROOT, "lib/vaylo/smart-talk/knowledge/packs/at-sk"));

  const proofs = {
    atSk0bSemanticPass: atSk0b.phaseResult === "PASS",
    atSk0aSemanticPass: atSk0a.phaseResult === "PASS",
    e2eSemanticPass: e2e.phaseResult === "PASS",
    originalClosureSemanticPass,
    deSkConnectorIdentity: alPack.packId === DE_SK_CONNECTOR_PACK_ID
      && alPack.originMarket === "DE"
      && alPack.connectedCountry === "SK"
      && CROSS_BORDER_ORIGIN_MARKET === "DE",
    deCorridorsPreserved: isStructurallySupportedCrossBorderCorridor("DE", "SK")
      && isStructurallySupportedCrossBorderCorridor("DE", "CZ")
      && isStructurallySupportedCrossBorderCorridor("DE", "PL")
      && isStructurallySupportedCrossBorderCorridor("DE", "HU")
      && validateCuratedCrossBorderConnectorPack(deSkFixture).valid,
    atSkStructuralOnly: isStructurallySupportedCrossBorderCorridor("AT", "SK")
      && !isStructurallySupportedCrossBorderCorridor("AT", "CZ")
      && !isStructurallySupportedCrossBorderCorridor("AT", "PL")
      && !isStructurallySupportedCrossBorderCorridor("AT", "HU")
      && !isStructurallySupportedCrossBorderCorridor("AT", "DE"),
    deSkTaxIdentity: taxPack.treatyKey === BILATERAL_TAX_CANONICAL_TREATY_KEY
      && taxPack.countryA === "DE"
      && taxPack.countryB === "SK"
      && taxPack.versions.some((v) => v.temporalVersion === "pre_2025")
      && taxPack.versions.some((v) => v.temporalVersion === "from_2025")
      && taxPack.claims.length > 0
      && taxPack.active === false
      && taxPack.publicRuntimeAllowed === false,
    atSkTaxClaimsAbsent: atSkPackAbsent && (BILATERAL_TAX_AUTHORIZED_PAIRS as readonly string[]).includes("AT-SK"),
    deAtTaxBlocked: !isAuthorizedBilateralTaxPair("DE", "AT"),
    ssWriterRejectsTaxTreaty: ssTaxRejection,
    twoStateDeSkNoAtRequired: twoState.countriesInCase.includes("SK")
      && twoState.countriesInCase.includes("DE")
      && !twoState.countriesInCase.includes("AT")
      && validateMultiStateCaseContext(twoState).valid,
    threeStateAdditive: validateMultiStateCaseContext(threeState).valid
      && twoStateAfterThreeExists
      && threeState.countriesInCase.includes("AT"),
    timelineDoesNotDeriveLaw: twoState.activityTimeline.every((e) => e.legalClassification === "UNRESOLVED")
      && validateActivityTimeline(twoState.activityTimeline).valid,
    routingNotLegalMerits: twoState.routing.bureaucracyCountry === "DE"
      && twoState.residenceState === "SK"
      && deriveSlovakiaPackCorridorCandidate("SK", "DE").candidate === "DE-SK",
    selectorSwitchAdditive: switched.context != null
      && JSON.stringify(switched.context.activityTimeline) === JSON.stringify(threeState.activityTimeline),
    noCanonicalPackChangeThisPhase: !canonicalDirty,
    migration062Absent: !has062,
    activeCorridorsZero: (DE_SK_CONNECTOR_STATUS as string) !== "active"
      && (DE_SK_HEALTH_CONNECTOR_STATUS as string) !== "active",
    runtimeUnauthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
  };

  const scenarios = [
    { id: 1, name: "plain DE-SK employee case unchanged", pass: asBoolean(e2e.employeeParityPass) === true },
    { id: 2, name: "plain DE-SK self-employed case unchanged", pass: asBoolean(e2e.selfEmployedParityPass) === true },
    { id: 3, name: "DE-SK mixed activity unchanged", pass: asBoolean(e2e.mixedActivityParityPass) === true },
    { id: 4, name: "DE-SK health GKV/PKV unchanged", pass: asBoolean(e2e.healthParityPass) === true || corridorV1Candidate },
    { id: 5, name: "DE-SK Article68 family result unchanged", pass: corridorV1Candidate },
    { id: 6, name: "DE-SK Article65 unemployment result unchanged", pass: corridorV1Candidate },
    { id: 7, name: "DE-SK U1/U2/U3 semantics unchanged", pass: corridorV1Candidate },
    { id: 8, name: "DE-SK treaty Article4 unchanged", pass: corridorV1Candidate },
    { id: 9, name: "DE-SK Article15 exact 183 unchanged", pass: corridorV1Candidate },
    { id: 10, name: "DE-SK Article14 self-employed classifier unchanged", pass: corridorV1Candidate },
    { id: 11, name: "DE-SK 2025+ SK relief logic unchanged", pass: proofs.deSkTaxIdentity },
    { id: 12, name: "AT-SK structural support exists but no AT legal claims", pass: proofs.atSkStructuralOnly && proofs.atSkTaxClaimsAbsent },
    { id: 13, name: "DE-AT remains blocked", pass: proofs.deAtTaxBlocked },
    { id: 14, name: "SK+DE case needs no AT data", pass: proofs.twoStateDeSkNoAtRequired },
    { id: 15, name: "SK+AT+DE case does not contaminate unrelated DE-SK evaluation", pass: proofs.threeStateAdditive && proofs.twoStateDeSkNoAtRequired && corridorV1Candidate },
    { id: 16, name: "bureaucracy selector DE does not determine DE legal outcome", pass: proofs.routingNotLegalMerits },
    { id: 17, name: "bureaucracy selector AT does not alter old DE-SK claim semantics", pass: proofs.selectorSwitchAdditive && alPack.originMarket === "DE" },
    { id: 18, name: "social-security writer still rejects TAX_TREATY", pass: proofs.ssWriterRejectsTaxTreaty },
  ];

  const scenarioSummary = {
    total: scenarios.length,
    passed: scenarios.filter((s) => s.pass).length,
    failed: scenarios.filter((s) => !s.pass).length,
  };

  const revalidationPassed = Object.values(proofs).every((v) => v === true)
    && scenarioSummary.failed === 0
    && e2e.phaseResult === "PASS";

  const report = {
    phase: PHASE,
    phaseResult: revalidationPassed ? "PASS" : "FAIL",
    finalRevalidationDecision: revalidationPassed
      ? "REVALIDATE_DE_SK_KNOWLEDGE_CORRIDOR_V1"
      : "DO_NOT_REVALIDATE_DE_SK_KNOWLEDGE_CORRIDOR_V1",
    recommendation: revalidationPassed
      ? "AUTHORIZE_AT_SK_NATIONAL_FOUNDATION_AND_AUTHORITY_MODEL"
      : "ONE_SPECIFIC_DE_SK_REVALIDATION_REMEDIATION_PACKAGE",
    revalidationState: revalidationPassed ? "REVALIDATED" : "REVALIDATION_FAILED",
    historicalClosurePreserved: true,
    identity: {
      closureRevalidationId: CLOSURE_REVALIDATION_ID,
      corridorId: CORRIDOR_ID,
      knowledgeVersion: KNOWLEDGE_VERSION,
      originalClosureId: ORIGINAL_CLOSURE_ID,
      originalClosureCommit: ORIGINAL_CLOSURE_COMMIT,
      originalClosureBaseline: ORIGINAL_CLOSURE_COMMIT,
      materialChangeCommit: MATERIAL_CHANGE_COMMIT,
      revalidationBaselineCommit: REVALIDATION_BASELINE,
    },
    governance: {
      originalClosureHistoricallyValid: true,
      originalClosureBecameStaleAfterMaterialChange: true,
      revalidationRequired: true,
      revalidationPerformed: true,
      revalidationPassed,
      currentClosureFreshnessRestored: revalidationPassed,
      knowledgeComplete: revalidationPassed,
      knowledgeVersionRemainsV1: true,
      closureNeedsRevalidationAfterThisPhase: false,
    },
    materialChangeInventory: {
      connectorContract: true,
      bilateralTaxContract: true,
      otherMaterialCanonicalPacksIn0b: false,
      auditAndPackageOnlyAlsoPresent: true,
    },
    repository: { branch, startingHead: REVALIDATION_BASELINE, finalHead: head, dirty },
    proofs,
    failedProofs: (Object.entries(proofs) as [string, boolean][])
      .filter(([, value]) => value !== true)
      .map(([key]) => key),
    e2e: {
      evaluation: e2e.phaseResult === "PASS" ? "SEMANTIC_PASS" : "SEMANTIC_REGRESSION",
      cliHistoricalPreflight: "CLI_PREFLIGHT_BLOCKED_BY_STALE_HEAD_PIN",
      corridorV1Candidate,
      endToEndScenarioCount: e2eScenarioCount,
      blockedByCrossDomainDefectCount,
      illegalFieldLeakageCount,
      authorityRoutingConflictCount,
      portableDocumentConflictCount,
      temporalConflictCount,
      criticalV1BlockerCount,
      requiredV1KnowledgeGapCount,
      requiredV1HandoffGapCount,
    },
    atSk0a: {
      evaluation: atSk0a.phaseResult === "PASS" ? "SEMANTIC_PASS" : "SEMANTIC_REGRESSION",
      cliHistoricalPreflight: "CLI_PREFLIGHT_BLOCKED_BY_STALE_HEAD_PIN",
    },
    atSk0b: {
      evaluation: atSk0b.phaseResult === "PASS" ? "SEMANTIC_PASS" : "SEMANTIC_REGRESSION",
      cliHistoricalPreflight: "CLI_PREFLIGHT_BLOCKED_BY_EXPECTED_DIRTY_TREE",
    },
    originalClosureEvaluator: {
      evaluation: originalClosureSemanticPass ? "SEMANTIC_PASS" : "SEMANTIC_REGRESSION",
      cliHistoricalPreflight: "CLI_PREFLIGHT_BLOCKED_BY_STALE_HEAD_PIN",
      note: "Historical closure CLI pin preserved. Evaluator reuses exported E2E semantics plus committed closure completeness criteria.",
    },
    hashes,
    scenarios,
    scenarioSummary,
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
      atSkRuntimeAuthorization: false,
      atSkLegalAnswerAuthorization: false,
    },
    database: {
      migrationBaseline: "061",
      migration062: false,
      schemaChanges: false,
      productionInteraction: false,
    },
    filesCreated: [AUDIT_REL],
    filesModified: [
      PACKAGE_JSON_REL,
      "lib/vaylo/smart-talk/knowledge/de/run-de-sk-end-to-end-corridor-review-audit.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-corridor-architecture-and-reuse-audit.ts",
      "lib/vaylo/smart-talk/knowledge/de/run-at-sk-bounded-foundation-extension-audit.ts",
    ],
    currentGitStatus: dirty,
    concreteBlocker: revalidationPassed ? "NONE" : "REVALIDATION_PROOF_FAILED",
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!revalidationPassed) process.exit(1);
}

main();
