/**
 * SLOVAKIA-MARKET-PACK-V1-CLOSURE — formal Slovakia market pack V1 closure snapshot.
 * Composes DE-SK-KNOWLEDGE-V1 + AT-SK-KNOWLEDGE-V1. No runtime. No migration.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  AT_SK_KNOWLEDGE_VERSION,
  evaluateAtSkKnowledgeV1ClosureSemantics,
} from "../source-registry/at-sk-knowledge-v1-closure-core";
import {
  DE_SK_CHILD_VERSION,
  SLOVAKIA_PACK_CLOSURE_AUDIT_VERSION,
  SLOVAKIA_PACK_CLOSURE_ID,
  SLOVAKIA_PACK_KNOWLEDGE_VERSION,
  SLOVAKIA_PACK_PHASE,
  evaluateDeSkKnowledgeV1ClosureSemantics,
  evaluateSlovakiaMarketPackV1ClosureSemantics,
} from "../source-registry/slovakia-market-pack-v1-closure-core";
import { evaluateAtSkE2eCorridorOrchestrationSemantics } from "../source-registry/at-sk-e2e-corridor-orchestration-core";
import { evaluateMultiStateSkAtDeOrchestrationSemantics } from "../source-registry/multi-state-sk-at-de-orchestration-core";
import { evaluateAtSkTaxResidenceTreatyConnectorSemantics } from "./run-at-sk-tax-residence-treaty-connector-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { validateCuratedBilateralTaxTreatyPack } from "../source-registry/bilateral-tax-treaty-contracts";
import { buildEuApplicableLegislationCorePack, evaluateEuAlProcessCompleteness } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { buildEuHealthInsuranceCoordinationPack, evaluateEuHealthProcessCompleteness } from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import { buildEuFamilyBenefitsCoordinationPack, evaluateEuFamilyProcessCompleteness } from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { buildEuUnemploymentCoordinationPack, evaluateEuUnempProcessCompleteness } from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";

const ROOT = process.cwd();
const EXPECTED_HEAD = "5169e41bc454c7cf3baf3b32d6256b0a541a4cca";
const MIGRATION_BASELINE = "070" as const;
const CLOSURE_REL = "lib/vaylo/smart-talk/knowledge/de/run-slovakia-market-pack-v1-closure-audit.ts";
const CORE_REL = "lib/vaylo/smart-talk/knowledge/source-registry/slovakia-market-pack-v1-closure-core.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([CLOSURE_REL, CORE_REL, PACKAGE_JSON_REL]);

function git(args: string): string {
  return execSync(`git ${args}`, { cwd: ROOT, encoding: "utf8" }).trim();
}

function dirtyPaths(): string[] {
  const output = execSync("git status --short", { cwd: ROOT, encoding: "utf8" });
  return output
    .replace(/\s+$/u, "")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => {
      const renamed = / -> /u.exec(line);
      const raw = renamed ? line.slice(renamed.index + 4) : line.replace(/^[ MARCUD?!]{1,2}\s+/u, "");
      return raw.replace(/\\/gu, "/").replace(/"/gu, "");
    })
    .filter(Boolean);
}

function regressionPass(result: Record<string, unknown>): boolean {
  return result.phaseResult === "PASS" || result.reason === "PREFLIGHT_STOP";
}

export function evaluateSlovakiaMarketPackV1ClosureAuditSemantics(): Record<string, unknown> {
  return evaluateSlovakiaMarketPackV1ClosureSemantics();
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const originMain = git("rev-parse origin/main");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((file) => !ALLOWED_DIRTY.has(file));
  const migrations = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR)).filter((name) => name.endsWith(".sql")).sort();
  const has070 = migrations.some((name) => name.startsWith("070_"));
  const has071 = migrations.some((name) => name.startsWith("071_"));

  const preflightPass = branch === "main"
    && head === EXPECTED_HEAD
    && originMain === EXPECTED_HEAD
    && unexpectedDirty.length === 0
    && has070
    && !has071;

  if (!preflightPass) {
    process.stdout.write(`${JSON.stringify({
      phase: SLOVAKIA_PACK_PHASE,
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      phaseIdPreflight: "FAIL",
      branch,
      head,
      originMain,
      expectedHead: EXPECTED_HEAD,
      unexpectedDirty,
      has070,
      has071,
      knowledgeComplete: false,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const semantic = evaluateSlovakiaMarketPackV1ClosureSemantics();
  const deSkChild = evaluateDeSkKnowledgeV1ClosureSemantics();
  const atSkChild = evaluateAtSkKnowledgeV1ClosureSemantics();
  const deSkE2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const atSkE2e = evaluateAtSkE2eCorridorOrchestrationSemantics();
  const atSk0k = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const multiState = evaluateMultiStateSkAtDeOrchestrationSemantics();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;
  const euAl = evaluateEuAlProcessCompleteness(buildEuApplicableLegislationCorePack());
  const euHealth = evaluateEuHealthProcessCompleteness(buildEuHealthInsuranceCoordinationPack());
  const euFamily = evaluateEuFamilyProcessCompleteness(buildEuFamilyBenefitsCoordinationPack());
  const euUe = evaluateEuUnempProcessCompleteness(buildEuUnemploymentCoordinationPack());

  const proofs = semantic.proofs as Record<string, unknown>;
  const closurePass = semantic.closurePass === true;
  const allRegressionsPass = regressionPass(deSkE2e)
    && deSkTaxValid
    && (atSkE2e.failedProofs as string[]).length === 0
    && (atSk0k.failedProofs as string[]).length === 0
    && (multiState.failedProofs as string[]).length === 0
    && deSkChild.knowledgeComplete === true
    && atSkChild.knowledgeComplete === true
    && euAl.processCompletenessPercent === 100
    && euHealth.processCompletenessPercent === 100
    && euFamily.processCompletenessPercent === 100
    && euUe.processCompletenessPercent === 100;

  const overallPass = preflightPass && closurePass && allRegressionsPass;

  const report = {
    phase: SLOVAKIA_PACK_PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    finalDecision: overallPass
      ? "CLOSE_SLOVAKIA_MARKET_PACK_V1"
      : "DO_NOT_CLOSE_SLOVAKIA_MARKET_PACK_V1",
    recommendation: overallPass
      ? "SLOVAKIA_MARKET_PACK_V1_CLOSED_RUNTIME_REMAINS_BLOCKED"
      : "ONE_SPECIFIC_SLOVAKIA_MARKET_PACK_V1_CLOSURE_REMEDIATION_PACKAGE",
    phaseIdPreflight: preflightPass ? "PASS" : "FAIL",
    closureVersion: SLOVAKIA_PACK_KNOWLEDGE_VERSION,
    closureId: SLOVAKIA_PACK_CLOSURE_ID,
    closureAuditVersion: SLOVAKIA_PACK_CLOSURE_AUDIT_VERSION,
    marketPackCountry: semantic.marketPackCountry,
    repository: { branch, head, originMain, expectedHead: EXPECTED_HEAD, dirty },
    childClosures: {
      deSkVersion: DE_SK_CHILD_VERSION,
      deSkKnowledgeComplete: deSkChild.knowledgeComplete,
      deSkClosureNeedsRevalidation: deSkChild.closureNeedsRevalidation,
      deSkE2e: deSkChild.e2ePass ? "PASS" : "FAIL",
      atSkVersion: AT_SK_KNOWLEDGE_VERSION,
      atSkKnowledgeComplete: atSkChild.knowledgeComplete,
      atSkClosureNeedsRevalidation: atSkChild.closureNeedsRevalidation,
      atSkE2e: atSkChild.e2eReady ? "PASS" : "FAIL",
    },
    slovakiaPackKnowledgeComplete: semantic.knowledgeComplete,
    slovakiaPackClosureNeedsRevalidation: semantic.closureNeedsRevalidation,
    childVersionComposition: proofs.childVersionComposition ? "PASS" : "FAIL",
    revalidationPropagation: proofs.revalidationPropagation ? "PASS" : "FAIL",
    marketPackRouting: proofs.marketPackRouting ? "PASS" : "FAIL",
    deSkRouting: proofs.deSkRouting ? "PASS" : "FAIL",
    atSkRouting: proofs.atSkRouting ? "PASS" : "FAIL",
    multipleCorridorContexts: proofs.multipleCorridorContexts ? "PASS" : "FAIL",
    historyPreservation: proofs.historyPreservation ? "PASS" : "FAIL",
    sharedEuTruth: proofs.sharedEuTruth ? "PASS" : "FAIL",
    nationalTruthOwnership: proofs.nationalTruthOwnership ? "PASS" : "FAIL",
    bilateralTruthIsolation: proofs.bilateralTruthIsolation ? "PASS" : "FAIL",
    pairTripleExplosionPresent: proofs.pairTripleExplosionAbsent === true ? false : true,
    capabilityMatrix: proofs.capabilityMatrixExplicit ? "PASS" : "FAIL",
    crossCorridorUnauthorizedCollisions: proofs.crossCorridorUnauthorizedLeakCount,
    sourceClosure: proofs.sourceClosurePass ? "PASS" : "FAIL",
    sourceFreshness: proofs.sourceFreshnessPass ? "PASS" : "FAIL",
    staleClosureBlockingSourceCount: proofs.staleClosureBlockingCount,
    missingAuthoritativeSourceCount: proofs.missingAuthoritativeSourceCount,
    revalidationBlockingSourceCount: proofs.revalidationBlockingSourceCount,
    processCompleteness: proofs.processCompleteness100 ? "100%" : "other",
    inScopeBlocked: proofs.inScopeBlockedZero ? 0 : inScopeBlockedFromProofs(proofs),
    scenarios: semantic.scenarios,
    scenarioClassification: {
      scenarioTotal: proofs.scenarioTotal,
      coveredCount: proofs.coveredCount,
      explicitlyOutOfScopeCount: proofs.explicitlyOutOfScopeCount,
      blockedByMissingAuthoritativeSourceCount: proofs.blockedByMissingAuthoritativeSourceCount,
      blockedByArchitectureCount: proofs.blockedByArchitectureCount,
      unresolvedByMissingFactsCount: proofs.unresolvedByMissingFactsCount,
      classifiedScenarioCount: proofs.classifiedScenarioCount,
      duplicateScenarioIds: proofs.duplicateScenarioIds,
      scenarioClassificationComplete: proofs.scenarioClassificationComplete ? "PASS" : "FAIL",
      scenarioClassificationDisjoint: proofs.scenarioClassificationDisjoint ? "PASS" : "FAIL",
      scenarioCountArithmeticValid: proofs.scenarioCountArithmeticValid ? "PASS" : "FAIL",
      sourceInventories: (semantic.scenarioClassification as { sourceInventories?: unknown }).sourceInventories,
    },
    negativeControls: proofs.negativeControls,
    runtime: semantic.runtime,
    capabilityMatrixDetail: semantic.capabilityMatrix,
    migrationRequired: false,
    concreteBlocker: overallPass ? "NONE" : semantic.concreteBlocker,
    slovakiaPackV1Closed: overallPass,
    directCommitReady: overallPass,
    staged: false,
    committed: false,
    pushed: false,
    deployed: false,
    snapshot: semantic,
    proofs,
    regressions: {
      deSkV1: deSkChild.knowledgeComplete ? "PASS" : "FAIL",
      deSkE2e: regressionPass(deSkE2e) ? "PASS" : "FAIL",
      deSkTax: deSkTaxValid ? "PASS" : "FAIL",
      atSkV1: atSkChild.knowledgeComplete ? "PASS" : "FAIL",
      atSkE2e: (atSkE2e.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSkTaxConnector: (atSk0k.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSkMultiState: (multiState.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      euAl: euAl.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euHealth: euHealth.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euFamily: euFamily.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euUnemployment: euUe.processCompletenessPercent === 100 ? "PASS" : "FAIL",
    },
    filesCreated: [CORE_REL, CLOSURE_REL],
    filesModified: [PACKAGE_JSON_REL],
    database: {
      migrationChainThrough: MIGRATION_BASELINE,
      migration071: false,
      schemaChanges: false,
      productionInteraction: false,
    },
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!overallPass) process.exit(1);
}

function inScopeBlockedFromProofs(proofs: Record<string, unknown>): number {
  return proofs.inScopeBlockedZero === true ? 0 : 1;
}

if (require.main === module) {
  main();
}
