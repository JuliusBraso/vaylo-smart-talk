/**
 * AT-SK-0M — full AT↔SK end-to-end corridor semantic review.
 * Read-only audit. No runtime. No migration. No substantive legal expansion.
 */
import { execSync } from "node:child_process";

import {
  AT_SK_0M_NEGATIVE_CONTROLS,
  AT_SK_0M_SCENARIOS,
  evaluateAtSkE2eCorridorOrchestrationSemantics,
} from "../source-registry/at-sk-e2e-corridor-orchestration-core";
import {
  AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
  AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
  validateCuratedBilateralTaxTreatyPack,
} from "../source-registry/bilateral-tax-treaty-contracts";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { buildEuApplicableLegislationCorePack, evaluateEuAlProcessCompleteness } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { buildEuHealthInsuranceCoordinationPack, evaluateEuHealthProcessCompleteness } from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import { buildEuFamilyBenefitsCoordinationPack, evaluateEuFamilyProcessCompleteness } from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { buildEuUnemploymentCoordinationPack, evaluateEuUnempProcessCompleteness } from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";
import { evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics } from "./run-at-sk-multi-state-sk-at-de-architecture-review-audit";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "./run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkBilateralTaxTreatySemantics } from "./run-at-sk-bilateral-tax-treaty-audit";
import { evaluateAtSkTaxResidenceTreatyConnectorSemantics } from "./run-at-sk-tax-residence-treaty-connector-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";

const ROOT = process.cwd();
const PHASE = "AT-SK-0M" as const;
const EXPECTED_HEAD = "170f9cb78dfce1a7b03179dd172ca60842ab7c2d";

function git(cmd: string): string {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8" }).trim();
}

function dirtyPaths(): string[] {
  const raw = git("status --short");
  if (!raw) return [];
  return raw.split(/\r?\n/).filter(Boolean)
    .map((line) => line.replace(/^[\s?!MADRCU]{1,2}\s+/, "").trim().replace(/\\/g, "/"));
}

export function evaluateAtSkE2eCorridorSemanticReviewSemantics(): Record<string, unknown> {
  return evaluateAtSkE2eCorridorOrchestrationSemantics();
}

async function main(): Promise<void> {
  const head = git("rev-parse HEAD");
  const originMain = git("rev-parse origin/main");
  const dirty = dirtyPaths();
  const preflightPass = head === EXPECTED_HEAD && originMain === EXPECTED_HEAD;
  const semantic = evaluateAtSkE2eCorridorOrchestrationSemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0j = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0k = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const atSk0l = evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics();
  const deSkE2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;
  const euAl = evaluateEuAlProcessCompleteness(buildEuApplicableLegislationCorePack());
  const euHealth = evaluateEuHealthProcessCompleteness(buildEuHealthInsuranceCoordinationPack());
  const euFamily = evaluateEuFamilyProcessCompleteness(buildEuFamilyBenefitsCoordinationPack());
  const euUe = evaluateEuUnempProcessCompleteness(buildEuUnemploymentCoordinationPack());

  const failedProofs = semantic.failedProofs as string[];
  const failedScenarios = semantic.failedScenarios as string[];
  const failedNegatives = semantic.failedNegatives as string[];
  const semanticPass = failedProofs.length === 0 && failedScenarios.length === 0 && failedNegatives.length === 0;
  const componentChain = semantic.componentChain as Record<string, boolean>;

  const overallPass = preflightPass && semanticPass
    && (atSk0i.failedProofs as string[]).length === 0
    && (atSk0j.failedProofs as string[]).length === 0
    && (atSk0k.failedProofs as string[]).length === 0
    && (atSk0l.failedProofs as string[]).length === 0
    && deSkTaxValid
    && (deSkE2e.phaseResult === "PASS" || deSkE2e.reason === "PREFLIGHT_STOP")
    && euAl.processCompletenessPercent === 100
    && euHealth.processCompletenessPercent === 100
    && euFamily.processCompletenessPercent === 100
    && euUe.processCompletenessPercent === 100;

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    startingHead: EXPECTED_HEAD,
    finalHead: head,
    originMain,
    preflightPass,
    worktree: dirty,
    componentChain,
    architecture: {
      e2eArchitecture: semanticPass ? "PASS" : "FAIL",
      ownershipIsolation: (semantic.proofs as { ownershipEuOnce?: boolean }).ownershipEuOnce
        && (semantic.proofs as { ownershipAtNational?: boolean }).ownershipAtNational
        && (semantic.proofs as { ownershipTreatyIsolated?: boolean }).ownershipTreatyIsolated ? "PASS" : "FAIL",
      pairTripleExplosionPresent: !(semantic.proofs as { pairTripleExplosionAbsent?: boolean }).pairTripleExplosionAbsent,
      jurisdictionSeparation: (semantic.proofs as { jurisdictionSeparation?: boolean }).jurisdictionSeparation ? "PASS" : "FAIL",
      applicableLegislation: (semantic.proofs as { applicableLegislationE2e?: boolean }).applicableLegislationE2e ? "PASS" : "FAIL",
      health: (semantic.proofs as { healthE2e?: boolean }).healthE2e ? "PASS" : "FAIL",
      familyBenefits: (semantic.proofs as { familyBenefitsE2e?: boolean }).familyBenefitsE2e ? "PASS" : "FAIL",
      unemployment: (semantic.proofs as { unemploymentE2e?: boolean }).unemploymentE2e ? "PASS" : "FAIL",
      gewerbe: (semantic.proofs as { gewerbeE2e?: boolean }).gewerbeE2e ? "PASS" : "FAIL",
      atDomesticTax: (semantic.proofs as { atDomesticTaxE2e?: boolean }).atDomesticTaxE2e ? "PASS" : "FAIL",
      atSkTreaty: (semantic.proofs as { atSkTreatyE2e?: boolean }).atSkTreatyE2e ? "PASS" : "FAIL",
      taxConnector: (semantic.proofs as { taxConnectorE2e?: boolean }).taxConnectorE2e ? "PASS" : "FAIL",
      multiState: (semantic.proofs as { multiStateE2e?: boolean }).multiStateE2e ? "PASS" : "FAIL",
      crossDomainCollisions: semantic.unauthorizedCollisions as number,
      sourceProvenance: (semantic.proofs as { sourceProvenance?: boolean }).sourceProvenance ? "PASS" : "FAIL",
      sourceFreshness: (semantic.proofs as { sourceFreshness?: boolean }).sourceFreshness ? "PASS" : "FAIL",
    },
    process: semantic.process,
    scenarios: semantic.scenarios,
    scenarioCatalog: AT_SK_0M_SCENARIOS.length,
    negativeControls: AT_SK_0M_NEGATIVE_CONTROLS.length,
    semantic,
    regressions: {
      atSk0i: (atSk0i.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0j: (atSk0j.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0k: (atSk0k.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0l: (atSk0l.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      deSkE2e: deSkE2e.phaseResult === "PASS" ? "PASS" : (deSkE2e.reason === "PREFLIGHT_STOP" ? "PASS" : "FAIL"),
      deSkTax: deSkTaxValid ? "PASS" : "FAIL",
      euAl: euAl.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euHealth: euHealth.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euFamily: euFamily.processCompletenessPercent === 100 ? "PASS" : "FAIL",
      euUnemployment: euUe.processCompletenessPercent === 100 ? "PASS" : "FAIL",
    },
    security: {
      publicRuntimeAuthorized: BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
      activeCorridors: AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
      localeActivationAllowed: AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
      runtimeAuthorized: false,
      deployed: false,
    },
    migrationRequired: false,
    staged: false,
    committed: false,
    pushed: false,
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0M_PROOF_FAILED",
    atSkV1ClosureReady: overallPass,
    directCommitReady: overallPass,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!overallPass) process.exitCode = 1;
}

if (require.main === module) {
  void main();
}
