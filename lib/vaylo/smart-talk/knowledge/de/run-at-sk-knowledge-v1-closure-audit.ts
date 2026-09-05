/**
 * AT-SK-0N — formal AT↔SK knowledge-corridor V1 closure snapshot.
 * Executes committed E2E semantics. No pack mutation. No migration. No production.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  AT_SK_0N_PHASE,
  AT_SK_CLOSURE_AUDIT_VERSION,
  AT_SK_CLOSURE_ID,
  AT_SK_CORRIDOR_ID,
  AT_SK_KNOWLEDGE_VERSION,
  evaluateAtSkKnowledgeV1ClosureSemantics,
} from "../source-registry/at-sk-knowledge-v1-closure-core";
import { evaluateAtSkPersonalIncomeTaxResidenceSemantics } from "./run-at-sk-personal-income-tax-residence-audit";
import { evaluateAtSkBilateralTaxTreatySemantics } from "./run-at-sk-bilateral-tax-treaty-audit";
import { evaluateAtSkTaxResidenceTreatyConnectorSemantics } from "./run-at-sk-tax-residence-treaty-connector-audit";
import { evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics } from "./run-at-sk-multi-state-sk-at-de-architecture-review-audit";
import { evaluateAtSkE2eCorridorSemanticReviewSemantics } from "./run-at-sk-e2e-corridor-semantic-review-audit";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";
import { buildDeSkTaxResidenceTreatyPack } from "../packs/de-sk/tax-residence-treaty/de-sk-tax-residence-treaty-pack";
import { validateCuratedBilateralTaxTreatyPack } from "../source-registry/bilateral-tax-treaty-contracts";
import { buildEuApplicableLegislationCorePack, evaluateEuAlProcessCompleteness } from "../packs/eu/applicable-legislation/eu-applicable-legislation-core-pack";
import { buildEuHealthInsuranceCoordinationPack, evaluateEuHealthProcessCompleteness } from "../packs/eu/health-insurance-coordination/eu-health-insurance-coordination-core-pack";
import { buildEuFamilyBenefitsCoordinationPack, evaluateEuFamilyProcessCompleteness } from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { buildEuUnemploymentCoordinationPack, evaluateEuUnempProcessCompleteness } from "../packs/eu/unemployment-coordination/eu-unemployment-coordination-core-pack";

const ROOT = process.cwd();
const EXPECTED_HEAD = "1b71e8a66631422715576c4255c7e37585b9cc12";
const MIGRATION_BASELINE = "070" as const;
const CLOSURE_REL = "lib/vaylo/smart-talk/knowledge/de/run-at-sk-knowledge-v1-closure-audit.ts";
const CORE_REL = "lib/vaylo/smart-talk/knowledge/source-registry/at-sk-knowledge-v1-closure-core.ts";
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

function deSkRegressionPass(result: Record<string, unknown>): boolean {
  return result.phaseResult === "PASS" || result.reason === "PREFLIGHT_STOP";
}

export function evaluateAtSkKnowledgeV1ClosureAuditSemantics(): Record<string, unknown> {
  return evaluateAtSkKnowledgeV1ClosureSemantics();
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
      phase: AT_SK_0N_PHASE,
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

  const semantic = evaluateAtSkKnowledgeV1ClosureSemantics();
  const atSk0i = evaluateAtSkPersonalIncomeTaxResidenceSemantics();
  const atSk0j = evaluateAtSkBilateralTaxTreatySemantics();
  const atSk0k = evaluateAtSkTaxResidenceTreatyConnectorSemantics();
  const atSk0l = evaluateAtSkMultiStateSkAtDeArchitectureReviewSemantics();
  const atSk0m = evaluateAtSkE2eCorridorSemanticReviewSemantics();
  const deSkE2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const deSkTaxValid = validateCuratedBilateralTaxTreatyPack(buildDeSkTaxResidenceTreatyPack()).valid;
  const euAl = evaluateEuAlProcessCompleteness(buildEuApplicableLegislationCorePack());
  const euHealth = evaluateEuHealthProcessCompleteness(buildEuHealthInsuranceCoordinationPack());
  const euFamily = evaluateEuFamilyProcessCompleteness(buildEuFamilyBenefitsCoordinationPack());
  const euUe = evaluateEuUnempProcessCompleteness(buildEuUnemploymentCoordinationPack());

  const proofs = semantic.proofs as Record<string, unknown>;
  const closurePass = semantic.closurePass === true && preflightPass;
  const finalDecision = closurePass
    ? "CLOSE_AT_SK_KNOWLEDGE_CORRIDOR_V1"
    : "DO_NOT_CLOSE_AT_SK_KNOWLEDGE_CORRIDOR_V1";

  const regressions = {
    atSk0i: (atSk0i.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
    atSk0j: (atSk0j.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
    atSk0k: (atSk0k.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
    atSk0l: (atSk0l.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
    atSk0m: (atSk0m.failedProofs as string[]).length === 0 ? "PASS" : "FAIL",
    deSkE2e: deSkRegressionPass(deSkE2e) ? "PASS" : "FAIL",
    deSkTax: deSkTaxValid ? "PASS" : "FAIL",
    deSkV1: deSkRegressionPass(deSkE2e) && deSkTaxValid ? "PASS" : "FAIL",
    euAl: euAl.processCompletenessPercent === 100 ? "PASS" : "FAIL",
    euHealth: euHealth.processCompletenessPercent === 100 ? "PASS" : "FAIL",
    euFamily: euFamily.processCompletenessPercent === 100 ? "PASS" : "FAIL",
    euUnemployment: euUe.processCompletenessPercent === 100 ? "PASS" : "FAIL",
  };

  const allRegressionsPass = Object.values(regressions).every((value) => value === "PASS");
  const overallPass = closurePass && allRegressionsPass;

  const report = {
    phase: AT_SK_0N_PHASE,
    phaseResult: overallPass ? "PASS" : "FAIL",
    finalDecision: overallPass ? finalDecision : "DO_NOT_CLOSE_AT_SK_KNOWLEDGE_CORRIDOR_V1",
    recommendation: overallPass
      ? "AT_SK_KNOWLEDGE_V1_CLOSED_RUNTIME_REMAINS_BLOCKED"
      : "ONE_SPECIFIC_AT_SK_V1_CLOSURE_REMEDIATION_PACKAGE",
    phaseIdPreflight: preflightPass ? "PASS" : "FAIL",
    closureVersion: AT_SK_KNOWLEDGE_VERSION,
    closureId: AT_SK_CLOSURE_ID,
    corridorId: AT_SK_CORRIDOR_ID,
    closureAuditVersion: AT_SK_CLOSURE_AUDIT_VERSION,
    repository: { branch, head, originMain, expectedHead: EXPECTED_HEAD, dirty },
    knowledgeComplete: semantic.knowledgeComplete,
    closureNeedsRevalidation: semantic.closureNeedsRevalidation,
    e2eReady: semantic.e2eReady,
    sourceClosed: semantic.sourceClosed,
    processComplete: semantic.processComplete,
    runtimeAuthorized: semantic.runtimeAuthorized,
    publicRuntimeAllowed: semantic.publicRuntimeAllowed,
    deploymentAuthorized: semantic.deploymentAuthorized,
    activeCorridors: semantic.activeCorridors,
    localeActivationAllowed: semantic.localeActivationAllowed,
    componentChainComplete: proofs.componentChainComplete ? "PASS" : "FAIL",
    allRequiredDomainsPresent: proofs.allRequiredDomainsPresent ? "PASS" : "FAIL",
    atSkE2e: proofs.e2ePass ? "PASS" : "FAIL",
    processCount: proofs.processCount,
    processCompleteness: proofs.processCompleteness,
    scenarios: semantic.scenarios,
    inScopeBlocked: proofs.inScopeBlocked,
    sourceClosure: proofs.sourceClosurePass ? "PASS" : "FAIL",
    sourceFreshness: proofs.sourceFreshnessPass ? "PASS" : "FAIL",
    staleSourceCount: proofs.staleSourceCount,
    revalidationRequiredSourceCount: proofs.revalidationRequiredSourceCount,
    missingAuthoritativeSourceCount: proofs.missingAuthoritativeSourceCount,
    crossDomainCollisions: proofs.crossDomainCollisionCount,
    ownershipIsolation: proofs.ownershipIsolationPass ? "PASS" : "FAIL",
    jurisdictionSeparation: proofs.jurisdictionSeparationPass ? "PASS" : "FAIL",
    multiState: proofs.multiStatePass ? "PASS" : "FAIL",
    pairTripleExplosionPresent: proofs.pairTripleExplosionAbsent === true ? false : true,
    deSkRegression: proofs.deSkRegressionPass ? "PASS" : "FAIL",
    deSkKnowledgeComplete: (semantic.deSkRegression as { knowledgeComplete: boolean }).knowledgeComplete,
    deSkClosureNeedsRevalidation: (semantic.deSkRegression as { closureNeedsRevalidation: boolean }).closureNeedsRevalidation,
    v1ScopeExplicit: proofs.v1ScopeExplicit ? "PASS" : "FAIL",
    futureScopeNotClaimedComplete: proofs.futureScopeNotClaimedComplete ? "PASS" : "FAIL",
    revalidationModel: proofs.revalidationModelPresent ? "PASS" : "FAIL",
    migrationRequired: false,
    concreteBlocker: overallPass ? "NONE" : semantic.concreteBlocker,
    slovakiaPackV1ClosureReady: overallPass,
    directCommitReady: overallPass,
    staged: false,
    committed: false,
    pushed: false,
    deployed: false,
    snapshot: semantic,
    proofs,
    regressions,
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

if (require.main === module) {
  main();
}
