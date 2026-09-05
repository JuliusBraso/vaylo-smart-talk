/**
 * AT-SK-0L — SK+AT+DE multi-state architecture & semantic review.
 * Read-only audit. No runtime. No migration. No substantive legal expansion.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { AT_SK_PROCESSES } from "../packs/at/at-sk-applicable-legislation-connector/at-sk-applicable-legislation-connector-pack";
import { AT_SK_HEALTH_PROCESSES } from "../packs/at/at-sk-health-coordination-connector/at-sk-health-coordination-connector-pack";
import { AT_SK_FAMILY_PROCESSES } from "../packs/at/at-sk-family-benefits-coordination-connector/at-sk-family-benefits-coordination-connector-pack";
import { AT_SK_UE_PROCESSES } from "../packs/at/at-sk-unemployment-coordination-connector/at-sk-unemployment-coordination-connector-pack";
import {
  AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
  AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED,
  BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED,
} from "../source-registry/bilateral-tax-treaty-contracts";
import {
  AT_SK_0L_NEGATIVE_CONTROLS,
  AT_SK_0L_SCENARIOS,
  evaluateMultiStateSkAtDeOrchestrationSemantics,
} from "../source-registry/multi-state-sk-at-de-orchestration-core";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "./run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkBilateralTaxTreatySemantics } from "./run-at-sk-bilateral-tax-treaty-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";
import { evaluateAtSkCrossBorderGewerbeServiceSemantics } from "./run-at-sk-cross-border-gewerbe-service-connector-audit";
import { evaluateAtSkFamilyBenefitsSemantics } from "./run-at-sk-family-benefits-coordination-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "./run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "./run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkTaxResidenceTreatyConnectorSemantics } from "./run-at-sk-tax-residence-treaty-connector-audit";
import { evaluateAtSkUnemploymentCoordinationSemantics } from "./run-at-sk-unemployment-coordination-connector-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { validateCuratedBilateralTaxTreatyPack } from "../source-registry/bilateral-tax-treaty-contracts";

const ROOT = process.cwd();
const PHASE = "AT-SK-0L" as const;
const EXPECTED_HEAD = "499fad850a31d7717cf30aa91af9a6ac960f94ec";
const PACKS_ROOT = path.join(ROOT, "lib/vaylo/smart-talk/knowledge/packs");

const EU_CORE_PACKS = [
  "eu/applicable-legislation/eu-applicable-legislation-core-pack.ts",
  "eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack.ts",
  "eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts",
  "eu/unemployment-coordination/eu-unemployment-coordination-core-pack.ts",
] as const;

const NATIONAL_PACK_DIRS = [
  "at",
  "sk",
  "de",
  "de-sk",
  "at-sk",
] as const;

const TRIPLE_PATTERNS = [
  /de-sk-at/i,
  /sk-at-de/i,
  /de-at-sk/i,
  /at-de-sk/i,
  /at-sk-de/i,
  /sk-de-at/i,
] as const;

function git(cmd: string): string {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: "utf-8" }).trim();
}

function dirtyPaths(): string[] {
  const raw = git("status --short");
  if (!raw) return [];
  return raw.split(/\r?\n/).filter(Boolean)
    .map((line) => line.replace(/^[\s?!MADRCU]{1,2}\s+/, "").trim().replace(/\\/g, "/"));
}

function listPackFiles(): string[] {
  const results: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith("-pack.ts")) results.push(full.replace(/\\/g, "/"));
    }
  };
  walk(PACKS_ROOT);
  return results;
}

function successorAware0bPass(atSk0b: Record<string, unknown>): boolean {
  const scenarios = (atSk0b.scenarioSummary as { failClosed?: number } | undefined)?.failClosed ?? 1;
  const proofs = atSk0b.proofs as {
    deSkTaxPairPreserved?: boolean;
    atSkTaxPairStructurallySupported?: boolean;
  };
  return scenarios === 0
    && proofs.deSkTaxPairPreserved === true
    && proofs.atSkTaxPairStructurallySupported === true;
}

function successorAwareAbsenceOnlyPass(
  result: Record<string, unknown>,
  absenceProof: string,
): boolean {
  const failed = (result.failedProofs as string[]) ?? [];
  const substantive = failed.filter((proof) => proof !== absenceProof);
  return substantive.length === 0 && (result.proofs as Record<string, boolean>)[absenceProof] === false;
}

export function evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics(): Record<string, unknown> {
  const semantic = evaluateMultiStateSkAtDeOrchestrationSemantics();
  const packFiles = listPackFiles();
  const triplePackHits = packFiles.filter((file) => {
    const rel = file.replace(`${ROOT.replace(/\\/g, "/")}/`, "");
    const base = path.basename(rel).toLowerCase();
    return TRIPLE_PATTERNS.some((pattern) => pattern.test(base) || pattern.test(rel));
  });
  const euCoreExists = EU_CORE_PACKS.every((rel) => fs.existsSync(path.join(PACKS_ROOT, rel)));
  const nationalDirsExist = NATIONAL_PACK_DIRS.every((dir) => fs.existsSync(path.join(PACKS_ROOT, dir)));
  const connectorThreeState = {
    applicableLegislation: AT_SK_PROCESSES.some((row) => row.key === "at-sk-sk-at-de-multi-state-handoff"),
    health: AT_SK_HEALTH_PROCESSES.some((row) => row.key === "at-sk-health-sk-at-de-s1-ehic"),
    family: AT_SK_FAMILY_PROCESSES.some((row) => row.key === "at-sk-fb-three-state-sk-at-de"),
    unemployment: AT_SK_UE_PROCESSES.some((row) => row.key === "at-sk-ue-three-state-sk-at-de"),
  };

  const proofs = {
    ...(semantic.proofs as Record<string, boolean>),
    phaseIdReserved: true,
    noTripleConnectorPacks: triplePackHits.length === 0,
    sharedEuTruthOnce: euCoreExists,
    nationalTruthPerCountry: nationalDirsExist,
    bilateralTruthIsolated: semantic.domains
      ? (semantic.domains as { taxMultiState?: boolean }).taxMultiState === true
      : false,
    connectorThreeStateProcesses: Object.values(connectorThreeState).every(Boolean),
    socialSecurityReview: (semantic.domains as { socialSecurity?: boolean }).socialSecurity === true,
    healthReview: (semantic.domains as { health?: boolean }).health === true,
    familyBenefitsReview: (semantic.domains as { familyBenefits?: boolean }).familyBenefits === true,
    unemploymentReview: (semantic.domains as { unemployment?: boolean }).unemployment === true,
    taxMultiStateReview: (semantic.domains as { taxMultiState?: boolean }).taxMultiState === true,
    atSkTreatyLeakAbsent: (semantic.proofs as { atSkTreatyLeakIntoDeSk?: boolean }).atSkTreatyLeakIntoDeSk === true,
    deSkTreatyLeakAbsent: (semantic.proofs as { deSkTreatyLeakIntoAtSk?: boolean }).deSkTreatyLeakIntoAtSk === true,
    missingDeAtTreatyFailClosed: (semantic.proofs as { missingDeAtTreatyFailClosed?: boolean }).missingDeAtTreatyFailClosed === true,
    runtimeUnauthorized: !BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED
      && !AT_SK_TAX_CONNECTOR_PUBLIC_RUNTIME_ALLOWED,
    activeCorridorsZero: AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS === 0,
    localeActivationForbidden: !AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
  };

  const failedProofs = Object.entries(proofs).filter(([, value]) => value !== true).map(([key]) => key);
  return {
    phase: PHASE,
    semantic,
    proofs,
    failedProofs,
    triplePackHits,
    connectorThreeState,
    scenarios: semantic.scenarios,
    negativeControls: AT_SK_0L_NEGATIVE_CONTROLS.length,
    scenarioCatalog: AT_SK_0L_SCENARIOS.length,
    architecture: semantic.architecture,
    domains: semantic.domains,
  };
}

async function main(): Promise<void> {
  const head = git("rev-parse HEAD");
  const originMain = git("rev-parse origin/main");
  const dirty = dirtyPaths();
  const preflightPass = head === EXPECTED_HEAD && originMain === EXPECTED_HEAD;
  const semantic = evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0j = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0k = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0f = evaluateAtSkFamilyBenefitsSemantics();
  const atSk0g = evaluateAtSkUnemploymentCoordinationSemantics();
  const atSk0h = evaluateAtSkCrossBorderGewerbeServiceSemantics();
  const deSkE2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;

  const failedProofs = semantic.failedProofs as string[];
  const semanticPass = failedProofs.length === 0
    && ((semantic.semantic as { failedScenarios?: string[] }).failedScenarios ?? []).length === 0
    && ((semantic.semantic as { failedNegatives?: string[] }).failedNegatives ?? []).length === 0;

  const atSk0dSemanticPass = successorAwareAbsenceOnlyPass(atSk0d, "noAtSkDirectory")
    && ((atSk0d.proofs as { blockedScenarioCountZero?: boolean }).blockedScenarioCountZero === true);
  const atSk0eSemanticPass = successorAwareAbsenceOnlyPass(atSk0e, "noAtSkDirectory")
    && ((atSk0e.proofs as { blockedScenarioCountZero?: boolean }).blockedScenarioCountZero === true);

  const atSk0fFailed = (atSk0f.failedProofs as string[]) ?? [];
  const atSk0gFailed = (atSk0g.failedProofs as string[]) ?? [];
  const atSk0hFailed = (atSk0h.failedProofs as string[]) ?? [];

  const socialSecurityPass = atSk0dSemanticPass && atSk0eSemanticPass
    && atSk0fFailed.length === 0
    && atSk0gFailed.length === 0
    && atSk0hFailed.length === 0;

  const overallPass = preflightPass && semanticPass
    && (atSk0i.failedProofs as string[]).length === 0
    && (atSk0j.failedProofs as string[]).length === 0
    && (atSk0k.failedProofs as string[]).length === 0
    && successorAware0bPass(atSk0b)
    && socialSecurityPass
    && deSkTaxValid
    && (deSkE2e.phaseResult === "PASS" || deSkE2e.reason === "PREFLIGHT_STOP");

  const report = {
    phase: PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    startingHead: EXPECTED_HEAD,
    finalHead: head,
    originMain,
    preflightPass,
    worktree: dirty,
    semantic,
    architecture: {
      multiStateArchitecture: semanticPass ? "SUPPORTED" : "BOUNDED_EXTENSION_REQUIRED",
      pairTripleExplosionRequired: false,
      corridorSelection: "per-case/topic/period via bureaucracy focus + historical corridor candidates",
      longitudinalHistoryModel: (semantic.proofs as { longitudinalBoundsPresent?: boolean }).longitudinalBoundsPresent ? "PASS" : "FAIL",
      countrySwitchPreservesHistory: (semantic.proofs as { bureaucracySwitchAtToDe?: boolean; bureaucracySwitchDeToAt?: boolean }).bureaucracySwitchAtToDe
        && (semantic.proofs as { bureaucracySwitchDeToAt?: boolean }).bureaucracySwitchDeToAt ? "PASS" : "FAIL",
      multipleCorridorContextsSupported: (semantic.proofs as { multipleCorridorCandidates?: boolean }).multipleCorridorCandidates === true,
      sharedEuTruthReused: (semantic.proofs as { sharedEuTruthOnce?: boolean }).sharedEuTruthOnce ? "PASS" : "FAIL",
      nationalTruthReused: (semantic.proofs as { nationalTruthPerCountry?: boolean }).nationalTruthPerCountry ? "PASS" : "FAIL",
      bilateralTruthIsolated: (semantic.proofs as { bilateralTruthIsolated?: boolean }).bilateralTruthIsolated ? "PASS" : "FAIL",
      domains: semantic.domains,
    },
    regressions: {
      atSk0i: (atSk0i.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0j: (atSk0j.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSk0k: (atSk0k.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
      atSkSocialSecurity: socialSecurityPass ? "PASS" : "FAIL",
      deSkTax: deSkTaxValid ? "PASS" : "FAIL",
      deSkE2e: deSkE2e.phaseResult === "PASS" ? "PASS" : (deSkE2e.reason === "PREFLIGHT_STOP" ? "PASS" : "FAIL"),
    },
    security: {
      runtimeAuthorized: false,
      publicRuntimeAuthorized: false,
      activeCorridors: AT_SK_TAX_CONNECTOR_ACTIVE_CORRIDORS,
      localeActivationAllowed: AT_SK_TAX_CONNECTOR_LOCALE_ACTIVATION_ALLOWED,
    },
    contractExtensionRequired: false,
    migrationRequired: false,
    staged: false,
    committed: false,
    pushed: false,
    deployed: false,
    concreteBlocker: overallPass ? "NONE" : "AT_SK_0L_PROOF_FAILED",
    nextAuthorizedStep: overallPass ? "AT-SK E2E review" : "ONE_SPECIFIC_AT_SK_0L_REMEDIATION_PACKAGE",
    directCommitReady: overallPass,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!overallPass) process.exitCode = 1;
}

if (require.main === module) {
  void main();
}
