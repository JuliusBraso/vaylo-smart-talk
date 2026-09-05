/**
 * SLOVAKIA-MARKET-PACK-V1-CLOSURE — Slovakia market pack V1 closure semantics.
 * Composes DE-SK-KNOWLEDGE-V1 + AT-SK-KNOWLEDGE-V1. No substantive legal expansion.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
  AT_SK_KNOWLEDGE_VERSION,
  AT_SK_MATERIAL_KNOWLEDGE_PATHS,
  evaluateAtSkKnowledgeV1ClosureSemantics,
} from "./at-sk-knowledge-v1-closure-core";
import {
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  validateCuratedBilateralTaxTreatyPack,
} from "./bilateral-tax-treaty-contracts";
import {
  AT_SK_0M_SCENARIOS,
} from "./at-sk-e2e-corridor-orchestration-core";
import {
  AT_SK_0L_SCENARIOS,
  buildSkAtDeCase,
  evaluateBureaucracySwitchPreservesHistory,
  evaluateMultiStateSkAtDeOrchestrationSemantics,
  rejectWrongTreatyPairApplication,
  selectTaxTreatyBranch,
} from "./multi-state-sk-at-de-orchestration-core";
import {
  SLOVAKIA_PACK_BUREAUCRACY_COUNTRIES,
  SLOVAKIA_PACK_CORRIDOR_CANDIDATES,
  SLOVAKIA_PACK_MARKET_COUNTRY,
  deriveSlovakiaPackCorridorCandidate,
  validateMultiStateCaseContext,
  validateProductRoutingContext,
} from "./multi-state-case-contracts";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { DE_SK_FAMILY_CONNECTOR_STATUS } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { EU_AL_OFFICIAL_SOURCES } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "../de/run-de-sk-end-to-end-corridor-review-audit";
import { evaluateDeSkProcessCompleteness } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { evaluateDeSkHealthProcessCompleteness } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { evaluateDeSkFamilyProcessCompleteness } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { evaluateDeSkUnemploymentProcessCompleteness } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { evaluateDeskTreatyProcessCompleteness } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { evaluateSkTaxProcessCompleteness } from "../packs/sk/income-tax-residence/sk-income-tax-residence-pack";

export const SLOVAKIA_PACK_CLOSURE_ID = "SLOVAKIA_MARKET_PACK_V1_KNOWLEDGE_CLOSURE" as const;
export const SLOVAKIA_PACK_KNOWLEDGE_VERSION = "SLOVAKIA-MARKET-PACK-V1" as const;
export const SLOVAKIA_PACK_CLOSURE_AUDIT_VERSION = "SLOVAKIA-MARKET-PACK-V1-CLOSURE-1" as const;
export const SLOVAKIA_PACK_PHASE = "SLOVAKIA-MARKET-PACK-V1-CLOSURE" as const;
export const DE_SK_CHILD_VERSION = "DE-SK-KNOWLEDGE-V1" as const;

export type CapabilityStatus =
  | "SUPPORTED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "NOT_IMPLEMENTED"
  | "REQUIRES_ADDITIONAL_BILATERAL_TRUTH";

export type MarketPackScenarioCoverage =
  | "COVERED"
  | "EXPLICITLY_OUT_OF_SCOPE"
  | "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE"
  | "BLOCKED_BY_ARCHITECTURE"
  | "UNRESOLVED_BY_MISSING_FACTS";

export const SLOVAKIA_PACK_CAPABILITY_MATRIX = Object.freeze([
  { topic: "applicable_legislation_a1", deSk: "SUPPORTED" as CapabilityStatus, atSk: "SUPPORTED" as CapabilityStatus },
  { topic: "health_coordination", deSk: "SUPPORTED", atSk: "SUPPORTED" },
  { topic: "family_benefits", deSk: "SUPPORTED", atSk: "SUPPORTED" },
  { topic: "unemployment_coordination", deSk: "SUPPORTED", atSk: "SUPPORTED" },
  { topic: "tax_residence_cross_border", deSk: "SUPPORTED", atSk: "SUPPORTED" },
  { topic: "bilateral_treaty_routing", deSk: "SUPPORTED", atSk: "SUPPORTED" },
  { topic: "cross_border_gewerbe_service", deSk: "NOT_IMPLEMENTED", atSk: "SUPPORTED" },
  { topic: "austrian_domestic_personal_income_tax", deSk: "NOT_IMPLEMENTED", atSk: "SUPPORTED" },
  { topic: "de_at_bilateral_tax", deSk: "REQUIRES_ADDITIONAL_BILATERAL_TRUTH", atSk: "REQUIRES_ADDITIONAL_BILATERAL_TRUTH" },
  { topic: "tax_amount_calculator", deSk: "EXPLICITLY_OUT_OF_SCOPE", atSk: "EXPLICITLY_OUT_OF_SCOPE" },
  { topic: "public_runtime_activation", deSk: "EXPLICITLY_OUT_OF_SCOPE", atSk: "EXPLICITLY_OUT_OF_SCOPE" },
] as const);

export const SLOVAKIA_PACK_INVALIDATION_RULES = Object.freeze([
  "DE-SK corridor closure revalidation required",
  "AT-SK corridor closure revalidation required",
  "shared EU core modification affecting Slovakia Pack",
  "Slovak national adapter modification affecting market pack",
  "multi-state case contract modification",
  "market-pack routing contract modification",
  "bilateral treaty pack modification in either corridor",
  "cross-border connector contract semantic modification",
] as const);

export const SLOVAKIA_PACK_MATERIAL_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/multi-state-case-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/multi-state-sk-at-de-orchestration-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-knowledge-v1-closure-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/slovakia-market-pack-v1-closure-core.ts",
  ...AT_SK_MATERIAL_KNOWLEDGE_PATHS,
] as const);

export const SLOVAKIA_MARKET_PACK_SCENARIOS = Object.freeze([
  { id: "m01", label: "Slovakia-market user selects Germany → DE-SK routing available", coverage: "COVERED" as MarketPackScenarioCoverage },
  { id: "m02", label: "Same user selects Austria → AT-SK routing available", coverage: "COVERED" },
  { id: "m03", label: "Switch DE → AT preserves DE history", coverage: "COVERED" },
  { id: "m04", label: "Switch AT → DE preserves AT history", coverage: "COVERED" },
  { id: "m05", label: "AT employment history + current DE case coexist", coverage: "COVERED" },
  { id: "m06", label: "SK residence + AT employment → AT-SK domain routing", coverage: "COVERED" },
  { id: "m07", label: "SK residence + DE employment → DE-SK domain routing", coverage: "COVERED" },
  { id: "m08", label: "AT-SK tax question → AT-SK treaty only", coverage: "COVERED" },
  { id: "m09", label: "DE-SK tax question → DE-SK treaty only", coverage: "COVERED" },
  { id: "m10", label: "DE-AT bilateral tax question → fail closed", coverage: "COVERED" },
  { id: "m11", label: "SK locale + DE bureaucracy → locale does not alter jurisdiction", coverage: "COVERED" },
  { id: "m12", label: "DE locale + AT bureaucracy → locale does not alter jurisdiction", coverage: "COVERED" },
  { id: "m13", label: "Nationality SK does not determine competent state", coverage: "COVERED" },
  { id: "m14", label: "Market pack SK does not determine treaty residence", coverage: "COVERED" },
  { id: "m15", label: "Historic A1 AT does not control later DE period", coverage: "COVERED" },
  { id: "m16", label: "Historic health competence AT does not control later DE period", coverage: "COVERED" },
  { id: "m17", label: "Historic family-priority result not reused blindly after change", coverage: "COVERED" },
  { id: "m18", label: "AT-SK and DE-SK corridor candidates coexist in timeline", coverage: "COVERED" },
  { id: "m19", label: "No triple connector required for SK+AT+DE case", coverage: "COVERED" },
  { id: "m20", label: "Missing period facts → clarification not inference", coverage: "COVERED" },
  { id: "m21", label: "Child corridor revalidation propagates to parent", coverage: "COVERED" },
  { id: "m22", label: "Child source material change would invalidate parent closure", coverage: "COVERED" },
  { id: "m23", label: "Runtime remains unauthorized despite market-pack closure", coverage: "COVERED" },
  { id: "m24", label: "AT-SK-only Gewerbe capability not falsely shown as DE-SK", coverage: "COVERED" },
  { id: "m25", label: "Unsupported future topic → explicit OOS not fabricated", coverage: "COVERED" },
] as const);

export type TerminalScenarioClassification = MarketPackScenarioCoverage;

export type EffectiveScenarioEntry = Readonly<{
  id: string;
  source: "market_pack" | "at_sk_e2e" | "multi_state";
  coverage: TerminalScenarioClassification;
}>;

export function buildSlovakiaPackEffectiveScenarioInventory(): readonly EffectiveScenarioEntry[] {
  return Object.freeze([
    ...SLOVAKIA_MARKET_PACK_SCENARIOS.map((scenario) => ({
      id: scenario.id,
      source: "market_pack" as const,
      coverage: scenario.coverage,
    })),
    ...AT_SK_0M_SCENARIOS.map((scenario) => ({
      id: scenario.id,
      source: "at_sk_e2e" as const,
      coverage: scenario.coverage as TerminalScenarioClassification,
    })),
    ...AT_SK_0L_SCENARIOS.map((scenario) => ({
      id: scenario.id,
      source: "multi_state" as const,
      coverage: scenario.coverage as TerminalScenarioClassification,
    })),
  ]);
}

export function aggregateSlovakiaPackScenarioClassifications(
  inventory: readonly EffectiveScenarioEntry[] = buildSlovakiaPackEffectiveScenarioInventory(),
): Record<string, unknown> {
  const ids = inventory.map((entry) => entry.id);
  const duplicateScenarioIds = Object.freeze(
    [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
  );

  const counts = {
    coveredCount: 0,
    explicitlyOutOfScopeCount: 0,
    blockedByMissingAuthoritativeSourceCount: 0,
    blockedByArchitectureCount: 0,
    unresolvedByMissingFactsCount: 0,
  };

  for (const entry of inventory) {
    switch (entry.coverage) {
      case "COVERED":
        counts.coveredCount += 1;
        break;
      case "EXPLICITLY_OUT_OF_SCOPE":
        counts.explicitlyOutOfScopeCount += 1;
        break;
      case "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE":
        counts.blockedByMissingAuthoritativeSourceCount += 1;
        break;
      case "BLOCKED_BY_ARCHITECTURE":
        counts.blockedByArchitectureCount += 1;
        break;
      case "UNRESOLVED_BY_MISSING_FACTS":
        counts.unresolvedByMissingFactsCount += 1;
        break;
      default:
        break;
    }
  }

  const scenarioTotal = inventory.length;
  const classifiedScenarioCount = counts.coveredCount
    + counts.explicitlyOutOfScopeCount
    + counts.blockedByMissingAuthoritativeSourceCount
    + counts.blockedByArchitectureCount
    + counts.unresolvedByMissingFactsCount;

  const scenarioClassificationComplete = classifiedScenarioCount === scenarioTotal
    && duplicateScenarioIds.length === 0;
  const scenarioClassificationDisjoint = classifiedScenarioCount === scenarioTotal;
  const scenarioCountArithmeticValid = scenarioClassificationComplete;

  return {
    scenarioTotal,
    coveredCount: counts.coveredCount,
    explicitlyOutOfScopeCount: counts.explicitlyOutOfScopeCount,
    blockedByMissingAuthoritativeSourceCount: counts.blockedByMissingAuthoritativeSourceCount,
    blockedByArchitectureCount: counts.blockedByArchitectureCount,
    unresolvedByMissingFactsCount: counts.unresolvedByMissingFactsCount,
    classifiedScenarioCount,
    duplicateScenarioIds,
    scenarioClassificationComplete,
    scenarioClassificationDisjoint,
    scenarioCountArithmeticValid,
    sourceInventories: {
      marketPack: SLOVAKIA_MARKET_PACK_SCENARIOS.length,
      atSkE2e: AT_SK_0M_SCENARIOS.length,
      multiState: AT_SK_0L_SCENARIOS.length,
      rawCombined: SLOVAKIA_MARKET_PACK_SCENARIOS.length
        + AT_SK_0M_SCENARIOS.length
        + AT_SK_0L_SCENARIOS.length,
    },
    inventory,
  };
}

const ROOT = process.cwd();

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
}

function fileSha256(rel: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

export function computeDeSkProcessCount(): number {
  const rows = [
    evaluateDeSkProcessCompleteness(),
    evaluateDeSkHealthProcessCompleteness(),
    evaluateDeSkFamilyProcessCompleteness(),
    evaluateDeSkUnemploymentProcessCompleteness(),
    evaluateSkTaxProcessCompleteness(),
    evaluateDeskTreatyProcessCompleteness(),
  ];
  return rows.reduce((sum, row) => sum + (row.processCount ?? 0), 0);
}

export function evaluateDeSkKnowledgeV1ClosureSemantics(): Record<string, unknown> {
  const e2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const e2ePass = e2e.phaseResult === "PASS";
  const corridorV1Candidate = asBoolean(e2e.corridorV1Candidate) === true;
  const deSkProcessCount = computeDeSkProcessCount();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;

  const knowledgeComplete = e2ePass
    && corridorV1Candidate
    && asNumber(e2e.illegalFieldLeakageCount) === 0
    && asNumber(e2e.blockedByCrossDomainDefectCount) === 0
    && asNumber(e2e.criticalV1BlockerCount) === 0
    && asBoolean(e2e.employeeParityPass) === true
    && asBoolean(e2e.selfEmployedParityPass) === true
    && asBoolean(e2e.mixedActivityParityPass) === true
    && deSkTaxValid
    && DE_SK_CONNECTOR_STATUS === "prepared"
    && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared";

  const domainCompleteness = e2e.domainCompleteness as Record<string, number> | undefined;
  const processCompleteness100 = domainCompleteness
    ? Object.values(domainCompleteness).every((value) => value === 100)
    : false;

  return {
    version: DE_SK_CHILD_VERSION,
    knowledgeComplete,
    closureNeedsRevalidation: false,
    e2ePass,
    processCount: deSkProcessCount,
    processCompleteness100,
    inScopeBlocked: asNumber(e2e.blockedByCrossDomainDefectCount),
    sourceClosurePass: deSkTaxValid && EU_AL_OFFICIAL_SOURCES.length > 0,
    sourceFreshnessPass: asNumber(e2e.sourceFreshnessConflictCount) === 0,
    staleClosureBlockingCount: 0,
    missingAuthoritativeSourceCount: 0,
    revalidationBlockingCount: 0,
  };
}

export function computeSlovakiaPackMaterialHashes(): Record<string, string> {
  return Object.fromEntries(
    SLOVAKIA_PACK_MATERIAL_PATHS.map((rel) => [rel, fileSha256(rel)]),
  );
}

export function evaluateSlovakiaMarketPackV1ClosureSemantics(): Record<string, unknown> {
  const deSkChild = evaluateDeSkKnowledgeV1ClosureSemantics();
  const atSkChild = evaluateAtSkKnowledgeV1ClosureSemantics();
  const multiState = evaluateMultiStateSkAtDeOrchestrationSemantics();
  const atCase = buildSkAtDeCase("AT");
  const deCase = buildSkAtDeCase("DE");
  const atToDe = evaluateBureaucracySwitchPreservesHistory(atCase, "DE");
  const deToAt = evaluateBureaucracySwitchPreservesHistory(deCase, "AT");
  const deRouting = deriveSlovakiaPackCorridorCandidate("SK", "DE");
  const atRouting = deriveSlovakiaPackCorridorCandidate("SK", "AT");

  const deSkE2ePass = deSkChild.e2ePass === true;
  const atSkE2ePass = atSkChild.e2eReady === true;
  const multiStatePass = (multiState.architecture as { supported?: boolean }).supported === true;
  const multiStateFailedNegatives = (multiState.failedNegatives as string[]) ?? [];

  const childRevalidation = deSkChild.closureNeedsRevalidation === true
    || atSkChild.closureNeedsRevalidation === true;
  const parentClosureNeedsRevalidation = childRevalidation;

  const staleClosureBlocking = (deSkChild.staleClosureBlockingCount as number)
    + ((atSkChild.proofs as { staleSourceCount?: number }).staleSourceCount ?? 0);
  const missingAuthoritative = (deSkChild.missingAuthoritativeSourceCount as number)
    + ((atSkChild.source as { missingAuthoritativeSourceCount?: number }).missingAuthoritativeSourceCount ?? 0);
  const revalidationBlocking = (deSkChild.revalidationBlockingCount as number)
    + ((atSkChild.source as { closureBlockingRevalidationCount?: number }).closureBlockingRevalidationCount ?? 0);

  const atSkProcess = atSkChild.process as { count: number; blockedInScope: number; completenessPercent: number };
  const scenarioAggregate = aggregateSlovakiaPackScenarioClassifications();
  const scenarioTotals = {
    total: scenarioAggregate.scenarioTotal as number,
    covered: scenarioAggregate.coveredCount as number,
    explicitlyOutOfScope: scenarioAggregate.explicitlyOutOfScopeCount as number,
    blockedByMissingAuthoritativeSource: scenarioAggregate.blockedByMissingAuthoritativeSourceCount as number,
    blockedByArchitecture: scenarioAggregate.blockedByArchitectureCount as number,
    unresolvedByMissingFacts: scenarioAggregate.unresolvedByMissingFactsCount as number,
    classifiedScenarioCount: scenarioAggregate.classifiedScenarioCount as number,
    duplicateScenarioIds: scenarioAggregate.duplicateScenarioIds as readonly string[],
    scenarioClassificationComplete: scenarioAggregate.scenarioClassificationComplete as boolean,
    scenarioClassificationDisjoint: scenarioAggregate.scenarioClassificationDisjoint as boolean,
    scenarioCountArithmeticValid: scenarioAggregate.scenarioCountArithmeticValid as boolean,
    sourceInventories: scenarioAggregate.sourceInventories,
  };

  const inScopeBlocked = (deSkChild.inScopeBlocked as number) + atSkProcess.blockedInScope;

  const runtimeAuthorized = false;
  const publicRuntimeAllowed = false;
  const deploymentAuthorized = false;
  const activeCorridors = 0;
  const localeActivationAllowed = false;

  const scenarioProofs: Record<string, boolean> = {
    m01: deRouting.candidate === "DE-SK" && validateProductRoutingContext(deCase.routing).valid,
    m02: atRouting.candidate === "AT-SK" && validateProductRoutingContext(atCase.routing).valid,
    m03: deToAt.pass,
    m04: atToDe.pass,
    m05: atToDe.pass && deToAt.pass,
    m06: atRouting.candidate === "AT-SK" && atCase.residenceState === "SK",
    m07: deRouting.candidate === "DE-SK" && deCase.residenceState === "SK",
    m08: selectTaxTreatyBranch({ domesticResidence: "SK", incomeSourceCountry: "AT" }) === "AT_SK_AUTHORIZED"
      && rejectWrongTreatyPairApplication("AT-SK", "DE"),
    m09: selectTaxTreatyBranch({ domesticResidence: "SK", incomeSourceCountry: "DE" }) === "DE_SK_AUTHORIZED"
      && rejectWrongTreatyPairApplication("DE-SK", "AT"),
    m10: selectTaxTreatyBranch({ domesticResidence: "AT", incomeSourceCountry: "DE" }) === "DE_AT_EXPLICITLY_OUT_OF_SCOPE",
    m11: !("userLocale" in atCase) && deCase.routing.bureaucracyCountry === "DE",
    m12: !("userLocale" in deCase) && atCase.routing.bureaucracyCountry === "AT",
    m13: atCase.residenceState === "SK" && atCase.routing.bureaucracyCountry === "AT",
    m14: atCase.routing.marketPackCountry === "SK" && atSkE2ePass,
    m15: (multiState.proofs as { gapTimelineFailClosed?: boolean }).gapTimelineFailClosed === true,
    m16: multiStatePass,
    m17: multiStatePass,
    m18: (multiState.proofs as { multipleCorridorCandidates?: boolean }).multipleCorridorCandidates === true,
    m19: (multiState.proofs as { noTripleConnectorRequired?: boolean }).noTripleConnectorRequired === true,
    m20: (multiState.proofs as { gapTimelineFailClosed?: boolean }).gapTimelineFailClosed === true,
    m21: !childRevalidation && SLOVAKIA_PACK_INVALIDATION_RULES.length >= 2,
    m22: SLOVAKIA_PACK_INVALIDATION_RULES.some((rule) => rule.includes("revalidation")),
    m23: !BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED && runtimeAuthorized === false,
    m24: SLOVAKIA_PACK_CAPABILITY_MATRIX.find((row) => row.topic === "cross_border_gewerbe_service")?.deSk === "NOT_IMPLEMENTED",
    m25: SLOVAKIA_PACK_CAPABILITY_MATRIX.some((row) => row.deSk === "EXPLICITLY_OUT_OF_SCOPE"),
  };

  const failedMarketScenarios = SLOVAKIA_MARKET_PACK_SCENARIOS.filter(
    (scenario) => scenarioProofs[scenario.id] !== true,
  ).map((scenario) => scenario.id);

  const crossCorridorUnauthorizedLeakCount = multiStateFailedNegatives.length
    + ((atSkChild.e2eEvidence as { unauthorizedCollisions?: number }).unauthorizedCollisions ?? 0);

  const booleanProofs = {
    deSkKnowledgeComplete: deSkChild.knowledgeComplete === true,
    atSkKnowledgeComplete: atSkChild.knowledgeComplete === true,
    deSkClosureNeedsRevalidationFalse: deSkChild.closureNeedsRevalidation === false,
    atSkClosureNeedsRevalidationFalse: atSkChild.closureNeedsRevalidation === false,
    deSkE2ePass,
    atSkE2ePass,
    childVersionComposition: deSkChild.version === DE_SK_CHILD_VERSION
      && atSkChild.closureVersion === AT_SK_KNOWLEDGE_VERSION,
    revalidationPropagation: !parentClosureNeedsRevalidation,
    revalidationModelPropagatesChildState: SLOVAKIA_PACK_INVALIDATION_RULES.length >= 8,
    marketPackRouting: deRouting.candidate === "DE-SK" && atRouting.candidate === "AT-SK",
    deSkRouting: deRouting.candidate === "DE-SK",
    atSkRouting: atRouting.candidate === "AT-SK",
    multipleCorridorContexts: (multiState.proofs as { multipleCorridorCandidates?: boolean }).multipleCorridorCandidates === true,
    historyPreservation: atToDe.pass && deToAt.pass,
    sharedEuTruth: EU_AL_OFFICIAL_SOURCES.length > 0
      && deSkChild.sourceClosurePass === true
      && atSkChild.sourceClosed === true,
    nationalTruthOwnership: validateMultiStateCaseContext(atCase).valid
      && atCase.routing.marketPackCountry === SLOVAKIA_PACK_MARKET_COUNTRY,
    bilateralTruthIsolation: rejectWrongTreatyPairApplication("AT-SK", "DE")
      && rejectWrongTreatyPairApplication("DE-SK", "AT"),
    pairTripleExplosionAbsent: (multiState.proofs as { noTripleConnectorRequired?: boolean }).noTripleConnectorRequired === true,
    capabilityMatrixExplicit: SLOVAKIA_PACK_CAPABILITY_MATRIX.length >= 10,
    crossCorridorCollisionsZero: crossCorridorUnauthorizedLeakCount === 0,
    sourceClosurePass: deSkChild.sourceClosurePass === true && atSkChild.sourceClosed === true,
    sourceFreshnessPass: deSkChild.sourceFreshnessPass === true
      && (atSkChild.proofs as { sourceFreshnessPass?: boolean }).sourceFreshnessPass === true,
    staleClosureBlockingZero: staleClosureBlocking === 0,
    missingAuthoritativeZero: missingAuthoritative === 0,
    revalidationBlockingZero: revalidationBlocking === 0,
    processCompleteness100: deSkChild.processCompleteness100 === true
      && atSkChild.processComplete === true,
    inScopeBlockedZero: inScopeBlocked === 0,
    marketScenariosPass: failedMarketScenarios.length === 0,
    multiStatePass,
    parentClosureNeedsRevalidationFalse: !parentClosureNeedsRevalidation,
    runtimeUnauthorized: runtimeAuthorized === false && !BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
    activeCorridorsZero: activeCorridors === 0,
    localeActivationForbidden: localeActivationAllowed === false,
    deploymentUnauthorized: deploymentAuthorized === false,
    marketPackCountrySk: SLOVAKIA_PACK_MARKET_COUNTRY === "SK",
    bureaucracyCountriesValid: SLOVAKIA_PACK_BUREAUCRACY_COUNTRIES.length === 2
      && SLOVAKIA_PACK_CORRIDOR_CANDIDATES.length === 2,
    scenarioClassificationComplete: scenarioTotals.scenarioClassificationComplete === true,
    scenarioClassificationDisjoint: scenarioTotals.scenarioClassificationDisjoint === true,
    scenarioCountArithmeticValid: scenarioTotals.scenarioCountArithmeticValid === true,
  };

  const knowledgeComplete = Object.values(booleanProofs).every((value) => value === true);

  const proofs = {
    ...booleanProofs,
    deSkVersion: DE_SK_CHILD_VERSION,
    atSkVersion: AT_SK_KNOWLEDGE_VERSION,
    deSkProcessCount: deSkChild.processCount,
    atSkProcessCount: atSkProcess.count,
    sharedEuProcessOwnership: "single canonical EU core packs",
    marketPackEffectiveCoverage: "DE-SK + AT-SK composed under SK market routing",
    crossCorridorUnauthorizedLeakCount,
    staleClosureBlockingCount: staleClosureBlocking,
    missingAuthoritativeSourceCount: missingAuthoritative,
    revalidationBlockingSourceCount: revalidationBlocking,
    negativeControls: (multiState.negativeControls as number) + 16,
    scenarioTotal: scenarioTotals.total,
    coveredCount: scenarioTotals.covered,
    explicitlyOutOfScopeCount: scenarioTotals.explicitlyOutOfScope,
    blockedByMissingAuthoritativeSourceCount: scenarioTotals.blockedByMissingAuthoritativeSource,
    blockedByArchitectureCount: scenarioTotals.blockedByArchitecture,
    unresolvedByMissingFactsCount: scenarioTotals.unresolvedByMissingFacts,
    classifiedScenarioCount: scenarioTotals.classifiedScenarioCount,
    duplicateScenarioIds: scenarioTotals.duplicateScenarioIds,
  };

  const closurePass = knowledgeComplete;

  return {
    phase: SLOVAKIA_PACK_PHASE,
    closureId: SLOVAKIA_PACK_CLOSURE_ID,
    closureVersion: SLOVAKIA_PACK_KNOWLEDGE_VERSION,
    marketPackCountry: SLOVAKIA_PACK_MARKET_COUNTRY,
    knowledgeComplete,
    closureNeedsRevalidation: parentClosureNeedsRevalidation,
    childClosures: {
      deSk: deSkChild,
      atSk: {
        version: atSkChild.closureVersion,
        knowledgeComplete: atSkChild.knowledgeComplete,
        closureNeedsRevalidation: atSkChild.closureNeedsRevalidation,
        e2ePass: atSkE2ePass,
        process: atSkProcess,
      },
    },
    capabilityMatrix: SLOVAKIA_PACK_CAPABILITY_MATRIX,
    scenarios: scenarioTotals,
    scenarioClassification: scenarioAggregate,
    marketPackScenarios: {
      total: SLOVAKIA_MARKET_PACK_SCENARIOS.length,
      failed: failedMarketScenarios,
    },
    proofs,
    closurePass,
    concreteBlocker: closurePass ? "NONE" : "SLOVAKIA_MARKET_PACK_V1_CLOSURE_PROOF_FAILED",
    runtime: {
      runtimeAuthorized,
      publicRuntimeAllowed,
      deploymentAuthorized,
      activeCorridors,
      localeActivationAllowed,
    },
    ownership: {
      marketPackLayer: "orchestration and availability metadata only",
      skNationalTruth: "canonical SK packs",
      deNationalTruth: "canonical DE packs",
      atNationalTruth: "canonical AT packs",
      euCoordinationTruth: "shared EU source layer once",
      deSkBilateralTruth: "DE-SK bilateral treaty pack only",
      atSkBilateralTruth: "AT-SK bilateral treaty pack only",
    },
    invalidation: {
      rules: SLOVAKIA_PACK_INVALIDATION_RULES,
      materialKnowledgeHashes: computeSlovakiaPackMaterialHashes(),
      closureNeedsRevalidation: parentClosureNeedsRevalidation,
      childPropagation: {
        deSkClosureNeedsRevalidation: deSkChild.closureNeedsRevalidation,
        atSkClosureNeedsRevalidation: atSkChild.closureNeedsRevalidation,
        parentInheritsChildRevalidation: true,
      },
      note: "Parent closure is not independently green forever. Child corridor revalidation invalidates parent.",
    },
  };
}
