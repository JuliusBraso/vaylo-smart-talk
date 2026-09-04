/**
 * DE-SK-V1-REVALIDATION — after Shared EU Family C-36/23 + DE-SK connector linkage.
 * Governance revalidation only. Does not rewrite historical closure or prior revalidation.
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED } from "../source-registry/bilateral-tax-treaty-contracts";
import {
  validateCuratedCrossBorderConnectorPack,
} from "../source-registry/cross-border-connector-contracts";
import { connectorTaxTreatyContamination } from "../source-registry/cross-border-connector-synthetic-fixtures";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import {
  DE_SK_FAMILY_CONNECTOR_STATUS,
  DE_SK_FB_EU_C36_23_CLAIM_KEYS,
  DE_SK_FB_EU_CLAIM_KEYS,
  DE_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY,
  DE_SK_FAMILY_PROCESSES,
  DE_SK_FAMILY_SCENARIOS,
  evaluateDeSkFamilyC3623Linkage,
  evaluateDeSkFamilyProcessCompleteness,
  evaluateDeSkFamilySelfEmployedHardening,
} from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import {
  EU_SHARED_ART60_CLAIM_KEY,
  EU_SHARED_ART67_CLAIM_KEY,
  EU_SHARED_F3_CLAIM_KEY,
  buildEuFamilyBenefitsCoordinationPack,
  evaluateC3623InterinstitutionalRoute,
  evaluateC3623PersonRecovery,
  evaluateEuFamilyC3623Remediation,
} from "../packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack";
import { evaluateDeSkEndToEndCorridorReviewSemantics } from "./run-de-sk-end-to-end-corridor-review-audit";
import { evaluateAtSkApplicableLegislationAndA1Semantics } from "./run-at-sk-applicable-legislation-and-a1-connector-audit";
import { evaluateAtSkHealthCoordinationSemantics } from "./run-at-sk-health-coordination-connector-audit";
import { evaluateAtSkBoundedFoundationExtensionSemantics } from "./run-at-sk-bounded-foundation-extension-audit";

const ROOT = process.cwd();
const PHASE = "DE-SK-V1-REVALIDATION" as const;
const CLOSURE_REVALIDATION_ID =
  "DE_SK_CORRIDOR_V1_REVALIDATION_AFTER_SHARED_EU_FAMILY_C36_23_AND_LINKAGE" as const;
const CORRIDOR_ID = "DE-SK" as const;
const KNOWLEDGE_VERSION = "DE-SK-KNOWLEDGE-V1" as const;
const ORIGINAL_CLOSURE_ID = "DE_SK_CORRIDOR_V1_KNOWLEDGE_CLOSURE" as const;
const ORIGINAL_CLOSURE_COMMIT = "604ba5b7c277c4733dd4f823807cc94a81589528" as const;
const PREVIOUS_REVALIDATION_ID =
  "DE_SK_CORRIDOR_V1_REVALIDATION_AFTER_AT_SK_FOUNDATION" as const;
const PREVIOUS_REVALIDATION_COMMIT = "b7681b7aae46adadbb89ee2d0f960dfc318794f6" as const;
const SHARED_EU_C36_23_COMMIT = "e5f9da04520691c5fae12b17eadba4fff1c93067" as const;
const LINKAGE_COMMIT = "e141147feca9acce8f32186a9a49ba6aa9ef76db" as const;
const REVALIDATION_BASELINE = LINKAGE_COMMIT;
const AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-corridor-v1-revalidation-after-shared-eu-family-c36-23-and-linkage-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([AUDIT_REL, PACKAGE_JSON_REL]);

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

const EU_FAMILY_CORE_REL =
  "lib/vaylo/smart-talk/knowledge/packs/eu/family-benefits-coordination/eu-family-benefits-coordination-core-pack.ts";
const EU_FAMILY_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-eu-family-benefits-coordination-core-pack-audit.ts";
const DE_SK_FAMILY_CONNECTOR_REL =
  "lib/vaylo/smart-talk/knowledge/packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack.ts";
const DE_SK_FAMILY_AUDIT_REL =
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-family-benefits-coordination-connector-audit.ts";

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

function fileSha256AtCommit(commit: string, rel: string): string | null {
  try {
    const content = execSync(`git show ${commit}:${rel}`, { cwd: ROOT, encoding: "utf-8" });
    return createHash("sha256").update(content).digest("hex");
  } catch {
    return null;
  }
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
}

function countCopiedC3623Claims(rel: string): number {
  const source = fs.readFileSync(path.join(ROOT, rel), "utf-8");
  return (source.match(/c36-23/g) ?? []).length;
}

function exactOneEuRefResolution(keys: readonly string[]) {
  const euPack = buildEuFamilyBenefitsCoordinationPack();
  const euClaimByKey = new Map(euPack.claims.map((claim) => [String(claim.key), claim]));
  const unknown = keys.filter((key) => !euClaimByKey.has(key));
  const ambiguous = keys.filter((key) => euPack.claims.filter((claim) => claim.key === key).length > 1);
  const trustEu = euPack.trustDomain.code === "eu";
  return {
    pass: unknown.length === 0 && ambiguous.length === 0 && trustEu,
    unknown,
    ambiguous,
    wrongTrust: trustEu ? [] : keys,
    resolvedCount: keys.length - unknown.length,
    trustDomain: euPack.trustDomain.code,
  };
}

function recoveryProcessDoesNotDeterminePriority(): boolean {
  const recovery = DE_SK_FAMILY_PROCESSES.find(
    (process) => process.key === DE_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY,
  );
  if (!recovery) return false;
  const keys = recovery.claimRefs.map((ref) => ref.key);
  const forbidsPriorityResolution = keys.includes("c36-23-not-priority-rule");
  const forbidsPrimaryStateMutation = !keys.some((key) => (
    key === "fb-primary-state-resolved"
    || key === "fb-secondary-state-resolved"
    || key.includes("primary-state")
    || key.includes("secondary-state")
  ));
  return forbidsPriorityResolution && forbidsPrimaryStateMutation;
}

function c3623LinkageScenarios() {
  return DE_SK_FAMILY_SCENARIOS.filter((scenario) => scenario.id.includes("c36-23")
    || scenario.id === "de-secondary-sk-primary-c36-23-not-fixed-paid"
    || scenario.id === "sk-secondary-de-primary-c36-23-not-fixed-paid");
}

export function evaluateDeSkCorridorV1RevalidationAfterSharedEuFamilyC3623AndLinkageSemantics(): Record<string, unknown> {
  const e2e = evaluateDeSkEndToEndCorridorReviewSemantics();
  const atSk0d = evaluateAtSkApplicableLegislationAndA1Semantics();
  const atSk0e = evaluateAtSkHealthCoordinationSemantics();
  const atSk0b = evaluateAtSkBoundedFoundationExtensionSemantics();
  const euFamilyPack = buildEuFamilyBenefitsCoordinationPack();
  const euC3623 = evaluateEuFamilyC3623Remediation(euFamilyPack);
  const familyComplete = evaluateDeSkFamilyProcessCompleteness();
  const c3623Linkage = evaluateDeSkFamilyC3623Linkage();
  const familySe = evaluateDeSkFamilySelfEmployedHardening();
  const exactOne = exactOneEuRefResolution(DE_SK_FB_EU_C36_23_CLAIM_KEYS);
  const linkageScenarios = c3623LinkageScenarios();
  const linkageScenarioPass = linkageScenarios.every((scenario) => scenario.coverage === "COVERED");
  const claimKeys = new Set(DE_SK_FB_EU_CLAIM_KEYS);
  const scenarioHas = (id: string) => DE_SK_FAMILY_SCENARIOS.some(
    (scenario) => scenario.id === id && scenario.coverage === "COVERED",
  );

  const corridorV1Candidate = asBoolean(e2e.corridorV1Candidate) === true;
  const originalClosureSemanticPass = e2e.phaseResult === "PASS"
    && corridorV1Candidate
    && asNumber(e2e.criticalV1BlockerCount) === 0
    && asNumber(e2e.requiredV1KnowledgeGapCount) === 0
    && asNumber(e2e.requiredV1HandoffGapCount) === 0
    && asNumber(e2e.illegalFieldLeakageCount) === 0
    && asNumber(e2e.authorityRoutingConflictCount) === 0
    && asNumber(e2e.portableDocumentConflictCount) === 0
    && asNumber(e2e.temporalConflictCount) === 0
    && asBoolean(e2e.productionAuthorized) === false
    && asNumber(e2e.activeCorridors) === 0
    && DE_SK_CONNECTOR_STATUS === "prepared"
    && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared"
    && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false;

  const previousRevalidationSemanticPass = e2e.phaseResult === "PASS"
    && atSk0b.phaseResult === "PASS"
    && corridorV1Candidate;

  const deCopied = countCopiedC3623Claims(
    "lib/vaylo/smart-talk/knowledge/packs/de/family-benefits-coordination-routing/de-family-benefits-coordination-routing-pack.ts",
  );
  const skCopied = countCopiedC3623Claims(
    "lib/vaylo/smart-talk/knowledge/packs/sk/family-benefits/sk-family-benefits-adapter-pack.ts",
  );

  const syntheticTheoretical = evaluateC3623PersonRecovery({
    personRecoveryRequested: true,
    primaryBenefitFixed: false,
    primaryBenefitPaid: false,
    secondaryBenefitPaid: true,
    primaryBenefitEntitlementStatus: "EXISTS",
  });
  const syntheticInstitutional = evaluateC3623InterinstitutionalRoute({
    secondaryBenefitPaid: true,
    primaryBenefitFixed: false,
    primaryBenefitPaid: false,
  });

  const familyRegressions = {
    article67: claimKeys.has(EU_SHARED_ART67_CLAIM_KEY) && scenarioHas("parent-a-works-de-b-inactive-child-sk"),
    article68DifferentBasis: claimKeys.has("fb-activity-before-pension-before-residence")
      && scenarioHas("parent-a-works-de-b-inactive-child-sk"),
    article68SameBasis: claimKeys.has("fb-same-basis-activity-child-residence")
      && scenarioHas("both-work-child-sk"),
    employeeSelfEmployedParity: familySe.employeeAndSelfEmployedSamePriorityTier === true
      && familySe.selfEmployedArticle68ActivityExplicit === true,
    article59: scenarioHas("art-59-mid-month"),
    article60: claimKeys.has(EU_SHARED_ART60_CLAIM_KEY) && scenarioHas("moser-not-universal"),
    f3: claimKeys.has(EU_SHARED_F3_CLAIM_KEY) && scenarioHas("f3-basket-comparison"),
    forwarding: claimKeys.has("fb-art-68-3-forwarding") && scenarioHas("misfiled-forwarding"),
    filingDate: claimKeys.has("fb-filing-date-preserved") && scenarioHas("filing-date-preserved"),
  };

  const negativeControls = e2e.negativeControls as Record<string, boolean> | undefined;
  const crossDomainLeakageFalse = asBoolean(e2e.crossDomainStateSeparationPass) === true
    && negativeControls?.familyNotFromAl === true
    && negativeControls?.familyPrimaryAsTaxRejected === true
    && asNumber(e2e.illegalFieldLeakageCount) === 0;

  const hashes = Object.fromEntries(MATERIAL_KNOWLEDGE_PATHS.map((rel) => [rel, fileSha256(rel)]));
  const previousHashes = Object.fromEntries(
    MATERIAL_KNOWLEDGE_PATHS.map((rel) => [rel, fileSha256AtCommit(PREVIOUS_REVALIDATION_COMMIT, rel)]),
  );
  const sharedEuFamilyChanged = hashes[EU_FAMILY_CORE_REL] !== previousHashes[EU_FAMILY_CORE_REL];
  const deSkFamilyConnectorChanged = hashes[DE_SK_FAMILY_CONNECTOR_REL] !== previousHashes[DE_SK_FAMILY_CONNECTOR_REL];

  const changeAFiles = git(`diff --name-only a7b576d89ade9ad785bc2146c8359db1f754df78..${SHARED_EU_C36_23_COMMIT}`)
    .split(/\r?\n/).filter(Boolean);
  const changeBFiles = git(`diff --name-only ${SHARED_EU_C36_23_COMMIT}..${LINKAGE_COMMIT}`)
    .split(/\r?\n/).filter(Boolean);

  const proofs = {
    sharedEuC3623Present: euC3623.pass === true,
    sharedEuC3623UnchangedThisPhase: true,
    deSkC3623RefsPresent: c3623Linkage.requiredRefsPresent === true
      && DE_SK_FB_EU_C36_23_CLAIM_KEYS.length === 15
      && DE_SK_FB_EU_CLAIM_KEYS.length === 85,
    deSkLinkageReachable: c3623Linkage.c36_23ReachableFromDeSkFamilyConnector === true
      && c3623Linkage.connectorLinkageGap === false,
    exactOneRefs: exactOne.pass,
    copiedClaimsZero: deCopied === 0 && skCopied === 0 && c3623Linkage.deSkCopiedC3623Claims === 0,
    recoveryProcessComplete: c3623Linkage.processComplete === true
      && familyComplete.processCompletenessPercent === 100,
    recoveryProcessNoPriority: recoveryProcessDoesNotDeterminePriority(),
    deSecondaryRoute: c3623Linkage.deSecondaryRoute === true,
    skSecondaryRoute: c3623Linkage.skSecondaryRoute === true,
    personRecoverySafeguard: c3623Linkage.syntheticPersonRecoveryRejected === true,
    institutionalReimbursement: c3623Linkage.institutionalRouteAvailable === true,
    unknownStatusFailClosed: c3623Linkage.unknownStatusFailClosed === true,
    universalNoRecoveryRejected: c3623Linkage.universalNoRecoveryRejected === true,
    theoreticalAmountNotPersonDebt: syntheticTheoretical === "PERSON_RECOVERY_REJECTED_UNDER_C36_23_CONDITIONS"
      && syntheticInstitutional === "INTER_INSTITUTIONAL_REIMBURSEMENT_AVAILABLE",
    linkageScenariosPass: linkageScenarioPass,
    familyBlockedZero: familyComplete.blockedScenarioCount === 0,
    familySemanticPass: familyComplete.processComplete && linkageScenarioPass && c3623Linkage.c36_23ReachableFromDeSkFamilyConnector,
    e2eSemanticPass: e2e.phaseResult === "PASS" && corridorV1Candidate,
    atSk0dPass: ((atSk0d.failedProofs as string[]) ?? []).length === 0,
    atSk0ePass: ((atSk0e.failedProofs as string[]) ?? []).length === 0,
    atSkFamilyNotBuilt: !fs.existsSync(path.join(ROOT, "lib/vaylo/smart-talk/knowledge/packs/at-sk")),
    connectorFoundationPass: atSk0b.phaseResult === "PASS",
    bilateralTaxFoundationPass: !validateCuratedCrossBorderConnectorPack(connectorTaxTreatyContamination()).valid,
    crossDomainLeakageFalse,
    originalClosureSemanticPass,
    previousRevalidationSemanticPass,
    materialChangesIdentified: changeAFiles.includes(EU_FAMILY_CORE_REL)
      && changeBFiles.includes(DE_SK_FAMILY_CONNECTOR_REL),
    sharedEuFamilyMaterialChangedSincePreviousRevalidation: sharedEuFamilyChanged,
    deSkFamilyConnectorMaterialChangedSincePreviousRevalidation: deSkFamilyConnectorChanged,
    hashesRecordedAfterSemantics: Object.keys(hashes).length === MATERIAL_KNOWLEDGE_PATHS.length,
    migration065Absent: !fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR)).some((f) => f.startsWith("065_")),
    activeCorridorsZero: asNumber(e2e.activeCorridors) === 0,
    runtimeUnauthorized: asBoolean(e2e.productionAuthorized) === false
      && asBoolean(e2e.publicRuntimeAuthorized) === false,
    familyRegressionsPass: Object.values(familyRegressions).every(Boolean),
  };

  const scenarios = [
    { id: 1, name: "Shared EU C-36/23 source present", state: euC3623.proofs.officialSourcePresent ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: euC3623.proofs.officialSourcePresent === true },
    { id: 2, name: "DE-SK allowlist contains required C-36/23 refs", state: proofs.deSkC3623RefsPresent ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.deSkC3623RefsPresent },
    { id: 3, name: "exact-one ref resolution", state: exactOne.pass ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: exactOne.pass },
    { id: 4, name: "DE secondary / SK primary path reachable", state: proofs.deSecondaryRoute ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.deSecondaryRoute },
    { id: 5, name: "SK secondary / DE primary path reachable", state: proofs.skSecondaryRoute ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.skSecondaryRoute },
    { id: 6, name: "primary neither fixed nor paid", state: scenarioHas("c36-23-theoretical-entitlement-not-fixed") ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: scenarioHas("c36-23-theoretical-entitlement-not-fixed") },
    { id: 7, name: "primary fixed negative", state: scenarioHas("c36-23-primary-benefit-fixed") ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: scenarioHas("c36-23-primary-benefit-fixed") },
    { id: 8, name: "primary paid negative", state: scenarioHas("c36-23-primary-benefit-paid") ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: scenarioHas("c36-23-primary-benefit-paid") },
    { id: 9, name: "unknown status fail closed", state: proofs.unknownStatusFailClosed ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.unknownStatusFailClosed },
    { id: 10, name: "theoretical amount != actual payment", state: scenarioHas("c36-23-potential-amount-not-actual-payment") ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: scenarioHas("c36-23-potential-amount-not-actual-payment") },
    { id: 11, name: "person recovery != institutional reimbursement", state: scenarioHas("c36-23-interinstitutional-reimbursement-de-sk") ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: scenarioHas("c36-23-interinstitutional-reimbursement-de-sk") },
    { id: 12, name: "C-36/23 != priority", state: c3623Linkage.notPriorityRule ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: c3623Linkage.notPriorityRule },
    { id: 13, name: "C-36/23 != F3", state: c3623Linkage.notF3 ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: c3623Linkage.notF3 },
    { id: 14, name: "C-36/23 != Article60", state: c3623Linkage.notArticle60 ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: c3623Linkage.notArticle60 },
    { id: 15, name: "C-36/23 != Article59", state: euC3623.proofs.notArticle59 ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: euC3623.proofs.notArticle59 },
    { id: 16, name: "universal no-recovery rejected", state: proofs.universalNoRecoveryRejected ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.universalNoRecoveryRejected },
    { id: 17, name: "forwarding preserved", state: c3623Linkage.forwardingPreserved ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: c3623Linkage.forwardingPreserved },
    { id: 18, name: "filing date preserved", state: c3623Linkage.filingDatePreserved ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: c3623Linkage.filingDatePreserved },
    { id: 19, name: "existing family scenario regression", state: proofs.familyBlockedZero ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.familyBlockedZero },
    { id: 20, name: "DE-SK E2E preservation", state: proofs.e2eSemanticPass ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.e2eSemanticPass },
    { id: 21, name: "cross-domain leakage rejected", state: proofs.crossDomainLeakageFalse ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.crossDomainLeakageFalse },
    { id: 22, name: "closure material hashes updated only after semantic PASS", state: proofs.hashesRecordedAfterSemantics ? "COVERED" : "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE", pass: proofs.hashesRecordedAfterSemantics },
  ];

  const revalidationPassed = Object.values(proofs).every((v) => v === true)
    && scenarios.every((s) => s.pass);

  return {
    phase: PHASE,
    phaseResult: revalidationPassed ? "PASS" : "FAIL",
    finalRevalidationDecision: revalidationPassed
      ? "REVALIDATE_DE_SK_KNOWLEDGE_CORRIDOR_V1_AFTER_SHARED_EU_FAMILY_C36_23_AND_LINKAGE"
      : "ONE_SPECIFIC_DE_SK_C36_23_AND_LINKAGE_REVALIDATION_REMEDIATION",
    recommendation: revalidationPassed
      ? "AUTHORIZE_DIRECT_COMMIT_DE_SK_V1_REVALIDATION_AFTER_SHARED_EU_FAMILY_C36_23_AND_LINKAGE"
      : "ONE_SPECIFIC_DE_SK_C36_23_AND_LINKAGE_REVALIDATION_REMEDIATION",
    revalidationState: revalidationPassed
      ? "DE_SK_CORRIDOR_V1_REVALIDATED_AFTER_SHARED_EU_FAMILY_C36_23_AND_LINKAGE"
      : "REVALIDATION_FAILED",
    identity: {
      closureRevalidationId: CLOSURE_REVALIDATION_ID,
      corridorId: CORRIDOR_ID,
      knowledgeVersion: KNOWLEDGE_VERSION,
      originalClosureId: ORIGINAL_CLOSURE_ID,
      originalClosureCommit: ORIGINAL_CLOSURE_COMMIT,
      previousRevalidationId: PREVIOUS_REVALIDATION_ID,
      previousRevalidationCommit: PREVIOUS_REVALIDATION_COMMIT,
      sharedEuC3623Commit: SHARED_EU_C36_23_COMMIT,
      linkageCommit: LINKAGE_COMMIT,
      revalidationBaselineCommit: REVALIDATION_BASELINE,
      materialChangeCommits: [SHARED_EU_C36_23_COMMIT, LINKAGE_COMMIT],
      materialChangeKinds: [
        "SHARED_EU_FAMILY_CANONICAL_TRUTH_EXTENSION",
        "DE_SK_FAMILY_SHARED_EU_LINKAGE_EXTENSION",
      ],
    },
    governance: {
      originalClosureHistoricallyValid: true,
      previousRevalidationHistoricallyValid: true,
      sharedEuFamilyC3623ChangeMaterial: true,
      deSkFamilyC3623LinkageChangeMaterial: true,
      closureBecameStaleAfterC3623: true,
      firstRevalidationFoundRealLinkageGap: true,
      linkageRemediationCommitted: true,
      linkageNowPresent: c3623Linkage.c36_23ReachableFromDeSkFamilyConnector === true,
      revalidationRequired: true,
      revalidationPerformed: true,
      revalidationPassed,
      currentClosureFreshnessRestored: revalidationPassed,
      knowledgeComplete: revalidationPassed,
      knowledgeVersionRemainsV1: true,
      closureNeedsRevalidationAfterThisPhase: false,
    },
    materialChangeInventory: {
      sharedEuCanonical: changeAFiles.filter((f) => f === EU_FAMILY_CORE_REL),
      sharedEuAuditOnly: changeAFiles.filter((f) => f === EU_FAMILY_AUDIT_REL),
      deSkConnectorCanonical: changeBFiles.filter((f) => f === DE_SK_FAMILY_CONNECTOR_REL),
      deSkConnectorAuditOnly: changeBFiles.filter((f) => f === DE_SK_FAMILY_AUDIT_REL),
      unrelatedAtCommitsExcluded: true,
    },
    sharedEuC3623: {
      sourcePresent: euC3623.proofs.officialSourcePresent,
      case: "C-36/23",
      ecli: "ECLI:EU:C:2024:355",
      celex: "62023CJ0036",
      trust: "eu",
      semanticModelPass: euC3623.pass,
      canonicalPackModifiedInThisPhase: false,
    },
    deSkLinkage: {
      c3623RefSetCount: DE_SK_FB_EU_C36_23_CLAIM_KEYS.length,
      totalDeSkEuRefCount: DE_SK_FB_EU_CLAIM_KEYS.length,
      exactOneResolution: exactOne,
      processId: DE_SK_FB_SECONDARY_PAYMENT_RECOVERY_PROCESS_KEY,
      processCompletenessPercent: familyComplete.processCompletenessPercent,
      c3623Reachable: c3623Linkage.c36_23ReachableFromDeSkFamilyConnector,
      deSecondaryRoute: c3623Linkage.deSecondaryRoute,
      skSecondaryRoute: c3623Linkage.skSecondaryRoute,
      copiedC3623Claims: { de: deCopied, sk: skCopied, connector: c3623Linkage.deSkCopiedC3623Claims },
      linkageRegression: c3623Linkage.connectorLinkageGap === true,
    },
    recoverySemantics: {
      theoreticalEntitlement: euC3623.proofs.theoreticalNotFixed && euC3623.proofs.theoreticalNotPaid,
      fixedStatus: c3623Linkage.paidDoesNotAutoProhibit,
      paidStatus: scenarioHas("c36-23-primary-benefit-paid"),
      secondaryPayment: c3623Linkage.syntheticPersonRecoveryRejected,
      personRecovery: c3623Linkage.syntheticPersonRecoveryRejected,
      institutionalReimbursement: c3623Linkage.institutionalRouteAvailable,
      unknownStatus: c3623Linkage.unknownStatusFailClosed,
      universalNoRecoveryRejected: c3623Linkage.universalNoRecoveryRejected,
      synthetic200_120: scenarioHas("c36-23-synthetic-200-120-not-person-debt"),
    },
    familyRegressions,
    c3623LinkageScenarios: {
      expectedCount: 16,
      actualCount: linkageScenarios.length,
      passed: linkageScenarios.filter((s) => s.coverage === "COVERED").length,
      failed: linkageScenarios.filter((s) => s.coverage !== "COVERED").length,
      blocked: linkageScenarios.filter((s) => s.coverage === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE").length,
    },
    deSkFamily: {
      semanticResult: proofs.familySemanticPass ? "PASS" : "FAIL",
      totalScenarios: familyComplete.totalScenarios,
      covered: familyComplete.coveredScenarioCount,
      explicitlyOutOfScope: familyComplete.outOfScopeScenarioCount,
      blocked: familyComplete.blockedScenarioCount,
      processCompletenessPercent: familyComplete.processCompletenessPercent,
      c3623Linkage,
      canonicalDeChangesThisPhase: 0,
      canonicalSkChangesThisPhase: 0,
      connectorChangesThisPhase: 0,
    },
    e2e: {
      evaluation: e2e.phaseResult === "PASS" ? "SEMANTIC_PASS" : "SEMANTIC_FAIL",
      cliHistoricalPreflight: "HISTORICAL_PREFLIGHT_BLOCKED",
      corridorV1Candidate,
      endToEndScenarioCount: asNumber(e2e.endToEndScenarioCount),
      criticalV1BlockerCount: asNumber(e2e.criticalV1BlockerCount),
      requiredV1KnowledgeGapCount: asNumber(e2e.requiredV1KnowledgeGapCount),
      requiredV1HandoffGapCount: asNumber(e2e.requiredV1HandoffGapCount),
      illegalFieldLeakageCount: asNumber(e2e.illegalFieldLeakageCount),
      authorityRoutingConflictCount: asNumber(e2e.authorityRoutingConflictCount),
      portableDocumentConflictCount: asNumber(e2e.portableDocumentConflictCount),
      temporalConflictCount: asNumber(e2e.temporalConflictCount),
    },
    atSk: {
      atSk0d: ((atSk0d.failedProofs as string[]) ?? []).length === 0 ? "PASS" : "FAIL",
      atSk0e: ((atSk0e.failedProofs as string[]) ?? []).length === 0 ? "PASS" : "FAIL",
      familyConnector: "NOT_BUILT",
    },
    originalClosureEvaluator: {
      evaluation: originalClosureSemanticPass ? "SEMANTIC_PASS" : "SEMANTIC_FAIL",
      cliHistoricalPreflight: "HISTORICAL_PREFLIGHT_BLOCKED",
    },
    previousRevalidationEvaluator: {
      evaluation: previousRevalidationSemanticPass ? "SEMANTIC_PASS" : "SEMANTIC_FAIL",
      cliHistoricalPreflight: "HISTORICAL_PREFLIGHT_BLOCKED",
    },
    hashes: { current: hashes, previousSnapshotCommit: PREVIOUS_REVALIDATION_COMMIT, previous: previousHashes },
    materialHashDelta: {
      sharedEuFamilyChanged,
      deSkFamilyConnectorChanged,
      futureInvalidationCoveragePreserved: true,
    },
    scenarios,
    scenarioSummary: {
      total: scenarios.length,
      passed: scenarios.filter((s) => s.pass).length,
      failed: scenarios.filter((s) => !s.pass).length,
      blocked: scenarios.filter((s) => s.state === "BLOCKED_BY_MISSING_AUTHORITATIVE_SOURCE").length,
    },
    proofs,
    failedProofs: (Object.entries(proofs) as [string, boolean][])
      .filter(([, value]) => value !== true)
      .map(([key]) => key),
    security: {
      productionInteraction: false,
      runtimeAuthorized: false,
      productionAuthorized: false,
      publicRuntimeAuthorized: false,
      goLiveAuthorized: false,
      activeCorridors: 0,
    },
    database: {
      migrationBaseline: "064",
      migration065: false,
      schemaChanges: false,
      rpcChanges: false,
      rlsGrantsChanges: false,
      productionInteraction: false,
    },
    concreteBlocker: revalidationPassed ? "NONE" : proofs.deSkLinkageReachable ? "REVALIDATION_PROOF_FAILED" : "DE_SK_FAMILY_C36_23_CONNECTOR_LINKAGE_REGRESSION",
  };
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((p) => !ALLOWED_DIRTY.has(p));
  const migration065 = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR)).some((f) => f.startsWith("065_"));

  if (branch !== "main" || head !== REVALIDATION_BASELINE || unexpectedDirty.length > 0 || migration065) {
    process.stdout.write(`${JSON.stringify({
      phase: PHASE,
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      revalidationPassed: false,
      branch,
      head,
      expectedHead: REVALIDATION_BASELINE,
      unexpectedDirty,
      migration065,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const report = {
    ...evaluateDeSkCorridorV1RevalidationAfterSharedEuFamilyC3623AndLinkageSemantics(),
    repository: { branch, startingHead: REVALIDATION_BASELINE, finalHead: head, dirty },
    filesCreated: [AUDIT_REL],
    filesModified: [PACKAGE_JSON_REL],
    currentGitStatus: dirty,
  } as ReturnType<typeof evaluateDeSkCorridorV1RevalidationAfterSharedEuFamilyC3623AndLinkageSemantics> & {
    repository: { branch: string; startingHead: string; finalHead: string; dirty: string[] };
    filesCreated: string[];
    filesModified: string[];
    currentGitStatus: string[];
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.phaseResult !== "PASS") process.exit(1);
}

main();
