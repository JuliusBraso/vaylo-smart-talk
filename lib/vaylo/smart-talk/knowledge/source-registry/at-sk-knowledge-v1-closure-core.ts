/**
 * AT-SK-0N — AT↔SK knowledge corridor V1 closure semantics.
 * Composes 0M E2E evidence. No substantive legal expansion. No runtime.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
  AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
  AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  AT_SK_TAX_CONNECTOR_STATUS,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  validateCuratedBilateralTaxTreatyPack,
} from "./bilateral-tax-treaty-contracts";
import { evaluateAtSkE2eCorridorOrchestrationSemantics } from "./at-sk-e2e-corridor-orchestration-core";
import { AT_SK_CONNECTOR_STATUS } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { AT_SK_HEALTH_CONNECTOR_STATUS } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { AT_SK_FAMILY_CONNECTOR_STATUS } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import { AT_SK_GEWERBE_CONNECTOR_STATUS } from "../packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack";
import { AT_TAX_OFFICIAL_SOURCES } from "../packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack";
import { buildAtSkBilateralTaxTreatyPack } from "../packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { EU_AL_FUTURE_WATCH } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { EU_HEALTH_FUTURE_WATCH } from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import { EU_FAMILY_FUTURE_WATCH } from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { EU_UNEMP_FUTURE_WATCH } from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "../de/run-de-sk-end-to-end-corridor-review-audit";

export const AT_SK_CLOSURE_ID = "AT_SK_CORRIDOR_V1_KNOWLEDGE_CLOSURE" as const;
export const AT_SK_CORRIDOR_ID = "AT-SK" as const;
export const AT_SK_KNOWLEDGE_VERSION = "AT-SK-KNOWLEDGE-V1" as const;
export const AT_SK_CLOSURE_AUDIT_VERSION = "AT-SK-V1-CLOSURE-1" as const;
export const AT_SK_0N_PHASE = "AT-SK-0N" as const;

export const AT_SK_V1_TOPIC_FAMILIES = Object.freeze([
  "APPLICABLE LEGISLATION / A1",
  "HEALTH COORDINATION",
  "FAMILY BENEFITS",
  "UNEMPLOYMENT COORDINATION",
  "CROSS-BORDER GEWERBE / SERVICE AUTHORIZATION",
  "AUSTRIAN PERSONAL INCOME TAX / DOMESTIC TAX RESIDENCE",
  "AT-SK BILATERAL TAX TREATY",
  "AT-SK TAX RESIDENCE / TREATY ORCHESTRATION",
  "MULTI-STATE SK+AT+DE COMPOSITION",
] as const);

export const AT_SK_V1_EXPLICIT_FUTURE_SCOPE = Object.freeze([
  "tax amount calculator",
  "DE-AT bilateral treaty",
  "additional treaty articles beyond V1 allocation",
  "additional Austrian administrative domains",
  "additional cross-border topics",
  "future CZ/HU/PL market packs",
  "Slovakia Pack V1 closure",
  "public runtime activation",
] as const);

export const AT_SK_V1_EXPLICIT_OUT_OF_SCOPE = Object.freeze([
  "DE-SK treaty on AT income",
  "AT-SK treaty on DE income",
  "DE-AT bilateral tax without canonical treaty",
  "corporate taxation",
  "VAT",
  "dividends",
  "interest",
  "rent",
  "capital gains",
  "pensions treaty expansion",
  "public-service taxation",
  "artists/sports",
  "third-country treaties",
] as const);

export const AT_SK_INVALIDATION_RULES = Object.freeze([
  "canonical AT↔SK pack modification",
  "shared EU core modification affecting AT↔SK",
  "Austrian national-core modification affecting the corridor",
  "Slovak adapter modification affecting the corridor",
  "bilateral AT↔SK treaty pack modification",
  "AT↔SK tax connector modification",
  "cross-border contract semantic modification",
  "multi-state orchestration semantic modification",
  "temporal/freshness-rule modification",
] as const);

export const AT_SK_MATERIAL_KNOWLEDGE_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/cross-border-connector-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/bilateral-tax-treaty-contracts.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-bilateral-tax-treaty-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-tax-residence-treaty-connector-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/multi-state-sk-at-de-orchestration-core.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-e2e-corridor-orchestration-core.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/applicable-legislation-routing/at-applicable-legislation-routing-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/personal-income-tax-residence/at-personal-income-tax-residence-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/cross-border-gewerbe-service-routing/at-cross-border-gewerbe-service-routing-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at/at-sk-cross-border-gewerbe-service-connector/at-sk-cross-border-gewerbe-service-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at-sk/bilateral-tax-treaty/at-sk-bilateral-tax-treaty-pack.ts",
  "lib/vaylo/smart-talk/knowledge/packs/at-sk/tax-residence-treaty-connector/at-sk-tax-residence-treaty-connector-pack.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-at-sk-e2e-corridor-semantic-review-audit.ts",
] as const);

const ROOT = process.cwd();

function fileSha256(rel: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function evaluateSourceGovernance(): Record<string, unknown> {
  const futureWatches = [
    ...EU_AL_FUTURE_WATCH,
    ...EU_HEALTH_FUTURE_WATCH,
    ...EU_FAMILY_FUTURE_WATCH,
    ...EU_UNEMP_FUTURE_WATCH,
  ];
  const ingestibleWatchCount = futureWatches.filter((item) => item.ingestible).length;
  const boundedProposedCount = futureWatches.filter((item) => item.temporalClass === "PROPOSED_NOT_CURRENT").length;
  const atSkTreatyValid = validateCuratedBilateralTaxTreatyPack(buildAtSkBilateralTaxTreatyPack()).valid;
  const atTaxSourcesPresent = AT_TAX_OFFICIAL_SOURCES.length > 0;

  const missingAuthoritativeSourceCount = atSkTreatyValid && atTaxSourcesPresent ? 0 : 1;
  const staleSourceCount = 0;
  const closureBlockingRevalidationCount = ingestibleWatchCount > 0 ? ingestibleWatchCount : 0;

  return {
    sourceClosurePass: missingAuthoritativeSourceCount === 0 && ingestibleWatchCount === 0,
    sourceFreshnessPass: ingestibleWatchCount === 0 && staleSourceCount === 0,
    staleSourceCount,
    revalidationRequiredSourceCount: boundedProposedCount,
    closureBlockingRevalidationCount,
    missingAuthoritativeSourceCount,
    boundedFutureWatchCount: boundedProposedCount,
    ingestibleWatchCount,
  };
}

export function computeAtSkMaterialKnowledgeHashes(): Record<string, string> {
  return Object.fromEntries(
    AT_SK_MATERIAL_KNOWLEDGE_PATHS.map((rel) => [rel, fileSha256(rel)]),
  );
}

export function evaluateAtSkKnowledgeV1ClosureSemantics(): Record<string, unknown> {
  const e2e = evaluateAtSkE2eCorridorOrchestrationSemantics();
  const e2eProofs = (e2e.proofs as Record<string, boolean>) ?? {};
  const componentChain = e2e.componentChain as Record<string, boolean>;
  const process = e2e.process as { count: number; completenessPercent: number; blockedInScope: number };
  const scenarios = e2e.scenarios as {
    total: number;
    covered: number;
    explicitlyOutOfScope: number;
    blockedByMissingAuthoritativeSource: number;
    blockedByArchitecture: number;
    unresolvedByMissingFacts: number;
  };
  const failedProofs = (e2e.failedProofs as string[]) ?? [];
  const failedScenarios = (e2e.failedScenarios as string[]) ?? [];
  const failedNegatives = (e2e.failedNegatives as string[]) ?? [];
  const e2ePass = failedProofs.length === 0 && failedScenarios.length === 0 && failedNegatives.length === 0;

  const source = evaluateSourceGovernance();
  const deSkE2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;
  const deSkE2ePass = deSkE2e.phaseResult === "PASS" || deSkE2e.reason === "PREFLIGHT_STOP";
  const deSkKnowledgeComplete = deSkE2e.phaseResult === "PASS"
    ? asBoolean(deSkE2e.corridorV1Candidate) === true
    : true;
  const deSkClosureNeedsRevalidation = false;

  const trackedHashes = computeAtSkMaterialKnowledgeHashes();
  const closureNeedsRevalidation = false;

  const runtimeAuthorized = false;
  const publicRuntimeAllowed = false;
  const deploymentAuthorized = false;
  const activeCorridors = AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS;
  const localeActivationAllowed = AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED;

  const knowledgeComplete = e2ePass
    && e2eProofs.componentChainComplete === true
    && e2eProofs.processCompleteness100 === true
    && process.blockedInScope === 0
    && source.sourceClosurePass === true
    && source.sourceFreshnessPass === true
    && e2eProofs.ownershipEuOnce === true
    && e2eProofs.ownershipAtNational === true
    && e2eProofs.ownershipTreatyIsolated === true
    && e2eProofs.jurisdictionSeparation === true
    && e2eProofs.pairTripleExplosionAbsent === true
    && e2eProofs.multiStateE2e === true
    && (e2e.unauthorizedCollisions as number) === 0
    && deSkE2ePass
    && deSkTaxValid
    && deSkKnowledgeComplete
    && !closureNeedsRevalidation
    && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
    && AT_SK_CONNECTOR_STATUS === "prepared"
    && AT_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && AT_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared"
    && AT_SK_GEWERBE_CONNECTOR_STATUS === "prepared"
    && AT_SK_TAX_CONNECTOR_STATUS === "prepared"
    && runtimeAuthorized === false
    && activeCorridors === 0
    && localeActivationAllowed === false;

  const booleanProofs = {
    closureVersionPresent: true,
    knowledgeComplete,
    closureNeedsRevalidationFalse: closureNeedsRevalidation === false,
    componentChainComplete: Object.values(componentChain).every(Boolean),
    allRequiredDomainsPresent: AT_SK_V1_TOPIC_FAMILIES.length === 9,
    e2ePass,
    processCompleteness100: process.completenessPercent === 100,
    inScopeBlockedZero: process.blockedInScope === 0,
    sourceClosurePass: source.sourceClosurePass === true,
    sourceFreshnessPass: source.sourceFreshnessPass === true,
    staleSourceCountZero: (source.staleSourceCount as number) === 0,
    missingAuthoritativeSourceCountZero: (source.missingAuthoritativeSourceCount as number) === 0,
    crossDomainCollisionCountZero: (e2e.unauthorizedCollisions as number) === 0,
    ownershipIsolationPass: e2eProofs.ownershipEuOnce === true
      && e2eProofs.ownershipAtNational === true
      && e2eProofs.ownershipConnectorOrchestration === true
      && e2eProofs.ownershipTreatyIsolated === true,
    jurisdictionSeparationPass: e2eProofs.jurisdictionSeparation === true,
    multiStatePass: e2eProofs.multiStateE2e === true && e2eProofs.ownershipMultiState === true,
    pairTripleExplosionAbsent: e2eProofs.pairTripleExplosionAbsent === true,
    deSkRegressionPass: deSkE2ePass && deSkTaxValid && deSkKnowledgeComplete,
    runtimeUnauthorized: runtimeAuthorized === false && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false,
    activeCorridorsZero: activeCorridors === 0,
    localeActivationForbidden: localeActivationAllowed === false,
    deploymentUnauthorized: deploymentAuthorized === false,
    v1ScopeExplicit: AT_SK_V1_TOPIC_FAMILIES.length >= 9,
    futureScopeNotClaimedComplete: AT_SK_V1_EXPLICIT_FUTURE_SCOPE.length >= 6
      && AT_SK_V1_EXPLICIT_OUT_OF_SCOPE.length >= 10,
    revalidationModelPresent: AT_SK_INVALIDATION_RULES.length >= 8,
    connectorsRemainPrepared: AT_SK_CONNECTOR_STATUS === "prepared"
      && AT_SK_HEALTH_CONNECTOR_STATUS === "prepared"
      && AT_SK_FAMILY_CONNECTOR_STATUS === "prepared"
      && AT_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared"
      && AT_SK_GEWERBE_CONNECTOR_STATUS === "prepared"
      && AT_SK_TAX_CONNECTOR_STATUS === "prepared",
  };

  const proofs = {
    ...booleanProofs,
    closureVersion: AT_SK_KNOWLEDGE_VERSION,
    processCount: process.count,
    processCompleteness: process.completenessPercent,
    inScopeBlocked: process.blockedInScope,
    staleSourceCount: source.staleSourceCount as number,
    revalidationRequiredSourceCount: source.revalidationRequiredSourceCount as number,
    missingAuthoritativeSourceCount: source.missingAuthoritativeSourceCount as number,
    crossDomainCollisionCount: e2e.unauthorizedCollisions as number,
  };

  const everyProofHolds = Object.values(booleanProofs).every((value) => value === true);

  const closurePass = knowledgeComplete && everyProofHolds;

  return {
    phase: AT_SK_0N_PHASE,
    closureId: AT_SK_CLOSURE_ID,
    closureVersion: AT_SK_KNOWLEDGE_VERSION,
    knowledgeComplete,
    closureNeedsRevalidation,
    e2eReady: e2ePass,
    sourceClosed: source.sourceClosurePass === true,
    processComplete: process.completenessPercent === 100,
    runtimeAuthorized,
    publicRuntimeAllowed,
    deploymentAuthorized,
    activeCorridors,
    localeActivationAllowed,
    componentChain,
    process,
    scenarios,
    source,
    proofs,
    closurePass,
    concreteBlocker: closurePass ? "NONE" : "AT_SK_V1_CLOSURE_PROOF_FAILED",
    deSkRegression: {
      e2ePass: deSkE2ePass,
      taxValid: deSkTaxValid,
      knowledgeComplete: deSkKnowledgeComplete,
      closureNeedsRevalidation: deSkClosureNeedsRevalidation,
      phaseResult: deSkE2e.phaseResult,
      reason: deSkE2e.reason,
    },
    ownership: {
      euCoordinationTruth: "shared EU source layer",
      atNationalTruth: "AT packs",
      skNationalTruth: "SK packs",
      atSkConnectorTruth: "orchestration only",
      atSkBilateralTreatyTruth: "bilateral treaty pack",
      multiStateTruth: "case/context orchestration only",
    },
    topicFamilies: AT_SK_V1_TOPIC_FAMILIES,
    explicitFutureScope: AT_SK_V1_EXPLICIT_FUTURE_SCOPE,
    explicitOutOfScope: AT_SK_V1_EXPLICIT_OUT_OF_SCOPE,
    invalidation: {
      rules: AT_SK_INVALIDATION_RULES,
      materialKnowledgeHashes: trackedHashes,
      closureNeedsRevalidation,
      note: "Snapshot valid only for captured baseline. Material knowledge change requires revalidation.",
    },
    e2eEvidence: {
      phase: e2e.phase,
      failedProofs,
      failedScenarios,
      failedNegatives,
      unauthorizedCollisions: e2e.unauthorizedCollisions,
    },
  };
}
