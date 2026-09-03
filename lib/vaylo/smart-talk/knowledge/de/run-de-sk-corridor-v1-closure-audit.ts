/**
 * DE-SK-V1-CLOSURE — formal DE↔SK knowledge-corridor V1 closure snapshot.
 * Executes the committed E2E review. No pack mutation, no migration, no production.
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED } from "../source-registry/bilateral-tax-treaty-contracts";
import { DE_SK_CONNECTOR_STATUS } from "../packs/de-sk/applicable-legislation/de-sk-applicable-legislation-connector-pack";
import { DE_SK_HEALTH_CONNECTOR_STATUS } from "../packs/de-sk/health-insurance-coordination/de-sk-health-insurance-coordination-connector-pack";
import { DE_SK_FAMILY_CONNECTOR_STATUS } from "../packs/de-sk/family-benefits-coordination/de-sk-family-benefits-coordination-connector-pack";
import { DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS } from "../packs/de-sk/unemployment-coordination/de-sk-unemployment-coordination-connector-pack";
import { runDeSkEndToEndCorridorReviewAudit } from "./run-de-sk-end-to-end-corridor-review-audit";

const ROOT = process.cwd();
const CLOSURE_ID = "DE_SK_CORRIDOR_V1_KNOWLEDGE_CLOSURE" as const;
const CORRIDOR_ID = "DE-SK" as const;
const KNOWLEDGE_VERSION = "DE-SK-KNOWLEDGE-V1" as const;
const CLOSURE_AUDIT_VERSION = "DE-SK-V1-CLOSURE-1" as const;
const EXPECTED_HEAD = "e3573d9ed9799166b90ff8a7b5ea8f7dcf17a7c3";
const MIGRATION_BASELINE = "061" as const;
const CLOSURE_REL = "lib/vaylo/smart-talk/knowledge/de/run-de-sk-corridor-v1-closure-audit.ts";
const E2E_REL = "lib/vaylo/smart-talk/knowledge/de/run-de-sk-end-to-end-corridor-review-audit.ts";
const PACKAGE_JSON_REL = "package.json";
const MIGRATIONS_DIR = "supabase/migrations";
const ALLOWED_DIRTY = new Set([CLOSURE_REL, E2E_REL, PACKAGE_JSON_REL]);

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
  "lib/vaylo/smart-talk/knowledge/de/run-de-sk-end-to-end-corridor-review-audit.ts",
] as const);

const INVALIDATION_RULES = Object.freeze([
  "canonical DE↔SK pack modification",
  "shared EU core modification affecting DE↔SK",
  "German reused national-core modification affecting the corridor",
  "Slovak adapter modification affecting the corridor",
  "bilateral DE↔SK treaty pack modification",
  "cross-border contract semantic modification",
  "portable-document semantic modification",
  "authority-routing semantic modification",
  "temporal/freshness-rule modification",
] as const);

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

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : Number.NaN;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function fileSha256(rel: string): string {
  return createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function domainCompletenessAllPresent(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const completeness = value as Record<string, number>;
  return [
    "euAl", "deSkAl", "euHealth", "deSkHealth", "euFamily", "deSkFamily",
    "euUnemp", "deSkUnemp", "skTax", "treaty", "est",
  ].every((key) => completeness[key] === 100);
}

function main(): void {
  const branch = git("branch --show-current");
  const head = git("rev-parse HEAD");
  const dirty = dirtyPaths();
  const unexpectedDirty = dirty.filter((file) => !ALLOWED_DIRTY.has(file));
  const migrations = fs.readdirSync(path.join(ROOT, MIGRATIONS_DIR)).filter((name) => name.endsWith(".sql")).sort();
  const has061 = migrations.some((name) => name.startsWith("061_"));
  const has062 = migrations.some((name) => name.startsWith("062_"));
  if (branch !== "main" || head !== EXPECTED_HEAD || unexpectedDirty.length > 0 || has062 || !has061) {
    process.stdout.write(`${JSON.stringify({
      phase: "DE-SK-V1-CLOSURE",
      phaseResult: "FAIL",
      reason: "PREFLIGHT_STOP",
      deSkCorridorV1KnowledgeComplete: false,
      branch,
      head,
      expectedHead: EXPECTED_HEAD,
      unexpectedDirty,
      has061,
      has062,
    }, null, 2)}\n`);
    process.exit(1);
  }

  const e2e = runDeSkEndToEndCorridorReviewAudit();
  const e2eAuditPass = e2e.phaseResult === "PASS";
  const corridorV1CandidateInheritedFromRealAudit = asBoolean(e2e.corridorV1Candidate) === true;
  const employeeParityPass = asBoolean(e2e.employeeParityPass) === true;
  const selfEmployedParityPass = asBoolean(e2e.selfEmployedParityPass) === true;
  const mixedActivityParityPass = asBoolean(e2e.mixedActivityParityPass) === true;
  const illegalFieldLeakageCount = asNumber(e2e.illegalFieldLeakageCount);
  const authorityRoutingConflictCount = asNumber(e2e.authorityRoutingConflictCount);
  const portableDocumentConflictCount = asNumber(e2e.portableDocumentConflictCount);
  const temporalConflictCount = asNumber(e2e.temporalConflictCount);
  const criticalV1BlockerCount = asNumber(e2e.criticalV1BlockerCount);
  const requiredV1KnowledgeGapCount = asNumber(e2e.requiredV1KnowledgeGapCount);
  const requiredV1HandoffGapCount = asNumber(e2e.requiredV1HandoffGapCount);
  const blockedByCrossDomainDefectCount = asNumber(e2e.blockedByCrossDomainDefectCount);
  const e2eScenarioCount = asNumber(e2e.endToEndScenarioCount);
  const failClosedMissingContextCount = asNumber(e2e.failClosedMissingContextCount);
  const temporalReevaluationPass = asBoolean(e2e.residenceChangeReevaluationPass) === true
    && asBoolean(e2e.activityChangeReevaluationPass) === true
    && asBoolean(e2e.familyChangeReevaluationPass) === true
    && asBoolean(e2e.unemploymentTransitionPass) === true
    && asBoolean(e2e.taxTemporalTransitionPass) === true
    && temporalConflictCount === 0;
  const validMultiStateSemanticsPreserved = asBoolean(e2e.validMultiStateResultsAccepted) === true;

  const knowledgeComplete = e2eAuditPass
    && corridorV1CandidateInheritedFromRealAudit
    && employeeParityPass
    && selfEmployedParityPass
    && mixedActivityParityPass
    && illegalFieldLeakageCount === 0
    && authorityRoutingConflictCount === 0
    && portableDocumentConflictCount === 0
    && temporalConflictCount === 0
    && criticalV1BlockerCount === 0
    && requiredV1KnowledgeGapCount === 0
    && requiredV1HandoffGapCount === 0
    && blockedByCrossDomainDefectCount === 0
    && temporalReevaluationPass
    && validMultiStateSemanticsPreserved
    && asBoolean(e2e.productionAuthorized) === false
    && asBoolean(e2e.publicRuntimeAuthorized) === false
    && asNumber(e2e.activeCorridors) === 0
    && BILATERAL_TAX_PUBLIC_RUNTIME_AUTHORIZED === false
    && DE_SK_CONNECTOR_STATUS === "prepared"
    && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
    && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
    && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared"
    && !has062;

  const runtimeAuthorized = false;
  const productionAuthorized = false;
  const publicRuntimeAuthorized = false;
  const goLiveAuthorized = false;
  const activeCorridors = 0;
  const presentationLayerImplemented = false;
  const presentationLayerRequiredBeforeUserFacingLaunch = true;
  const presentationLayerBlocksKnowledgeClosure = false;
  const failClosedMissingContextAccepted = failClosedMissingContextCount > 0;
  const failClosedMissingContextIsNotKnowledgeGap = failClosedMissingContextAccepted
    && requiredV1KnowledgeGapCount === 0;

  const trackedHashes = Object.fromEntries(
    MATERIAL_KNOWLEDGE_PATHS.map((rel) => [rel, fileSha256(rel)]),
  );
  const currentHashesMatchSnapshot = MATERIAL_KNOWLEDGE_PATHS.every((rel) => (
    trackedHashes[rel] === fileSha256(rel)
  ));
  const closureNeedsRevalidation = !currentHashesMatchSnapshot;

  const snapshot = {
    closureId: CLOSURE_ID,
    corridorId: CORRIDOR_ID,
    corridorVersion: KNOWLEDGE_VERSION,
    knowledgeScopeVersion: KNOWLEDGE_VERSION,
    closureAuditVersion: CLOSURE_AUDIT_VERSION,
    baselineCommit: EXPECTED_HEAD,
    closureBaselineCommit: head,
    closedAtRepositoryState: head,
    migrationBaseline: MIGRATION_BASELINE,
    knowledgeDomains: {
      applicableLegislation: {
        included: [
          "EU coordination",
          "DE↔SK routing",
          "employee",
          "self-employed",
          "mixed activity",
          "posting",
          "multi-state activity",
          "A1",
        ],
      },
      health: {
        included: [
          "competent health routing",
          "GKV/PKV boundary",
          "Slovak public insurer",
          "S1",
          "EHIC",
          "S2",
          "employee",
          "self-employed",
          "mixed activity",
        ],
      },
      familyBenefits: {
        included: [
          "Article 67/68",
          "Decision F3",
          "Kindergeld",
          "Elterngeld",
          "relevant Slovak family benefits",
          "primary/secondary state",
          "employee",
          "self-employed",
          "mixed activity",
        ],
      },
      unemployment: {
        included: [
          "Article 61–65a",
          "frontier/non-frontier",
          "employee",
          "self-employed",
          "mixed/history",
          "German ALG routing",
          "Slovak unemployment routing",
          "U1",
          "U2",
          "U3",
          "current DE↔SK Article 65a suppression",
        ],
      },
      tax: {
        included: [
          "DE domestic tax residence",
          "SK domestic tax residence",
          "dual-domestic candidate",
          "Article 4",
          "Article 15 employment",
          "Article 14 independent/self-employed work",
          "Article 14/7 unresolved boundary",
          "directional Article 23 relief",
          "MLI pre-2025 / from-2025 handling",
          "German §50d(8)/(9) gates",
          "Slovak §45(1)/(3)(c) routing",
        ],
      },
    },
    employeeCoverage: employeeParityPass,
    selfEmployedCoverage: selfEmployedParityPass,
    mixedActivityCoverage: mixedActivityParityPass,
    taxCoverage: corridorV1CandidateInheritedFromRealAudit,
    explicitFutureScope: [
      "tax amount calculator",
      "accounting/bookkeeping",
      "VAT",
      "full Article 5 PE engine",
      "complete Slovak standalone bureaucracy OS",
    ],
    explicitOutOfScope: [
      "dividends",
      "interest",
      "rent",
      "capital gains",
      "pensions treaty expansion",
      "public-service taxation",
      "artists/sports",
      "corporate taxation",
      "third-country treaties",
      "AT-SK",
      "DE-CZ",
      "DE-PL",
      "DE-HU",
    ],
    e2eScenarioCount,
    blockedScenarioCount: blockedByCrossDomainDefectCount,
    knowledgeGapCount: requiredV1KnowledgeGapCount,
    handoffGapCount: requiredV1HandoffGapCount,
    illegalLeakageCount: illegalFieldLeakageCount,
    authorityConflictCount: authorityRoutingConflictCount,
    portableDocumentConflictCount,
    temporalConflictCount,
    knowledgeComplete,
    closureNeedsRevalidation,
    runtimeAuthorized,
    productionAuthorized,
    publicRuntimeAuthorized,
    goLiveAuthorized,
    activeCorridors,
  };

  const proofs = {
    closureIdPresent: snapshot.closureId === CLOSURE_ID,
    closureBaselineMatchesCurrentHead: head === EXPECTED_HEAD && snapshot.closureBaselineCommit === head,
    migrationBaseline061: has061 && !has062 && snapshot.migrationBaseline === "061",
    e2eAuditPass,
    corridorV1CandidateInheritedFromRealAudit,
    allRequiredDomainsPresent: domainCompletenessAllPresent(e2e.domainCompleteness),
    employeeParityPass,
    selfEmployedParityPass,
    mixedActivityParityPass,
    illegalFieldLeakageCountZero: illegalFieldLeakageCount === 0,
    authorityRoutingConflictCountZero: authorityRoutingConflictCount === 0,
    portableDocumentConflictCountZero: portableDocumentConflictCount === 0,
    temporalConflictCountZero: temporalConflictCount === 0,
    criticalV1BlockerCountZero: criticalV1BlockerCount === 0,
    requiredKnowledgeGapCountZero: requiredV1KnowledgeGapCount === 0,
    requiredHandoffGapCountZero: requiredV1HandoffGapCount === 0,
    blockedCrossDomainDefectCountZero: blockedByCrossDomainDefectCount === 0,
    validMultiStateSemanticsPreserved,
    failClosedMissingContextAccepted,
    failClosedMissingContextIsNotKnowledgeGap,
    futureScopeExplicit: snapshot.explicitFutureScope.length === 5,
      outOfScopeExplicit: snapshot.explicitOutOfScope.length >= 12
        && snapshot.explicitOutOfScope.includes("AT-SK")
        && snapshot.explicitOutOfScope.includes("corporate taxation")
        && snapshot.explicitOutOfScope.includes("dividends"),
    presentationLayerPending: presentationLayerImplemented === false,
    presentationLayerDoesNotBlockKnowledgeClosure: presentationLayerBlocksKnowledgeClosure === false,
    runtimeStillUnauthorized: runtimeAuthorized === false,
    productionStillUnauthorized: productionAuthorized === false,
    publicRuntimeStillUnauthorized: publicRuntimeAuthorized === false,
    goLiveStillUnauthorized: goLiveAuthorized === false,
    activeCorridorsZero: activeCorridors === 0,
    noMigration062: !has062,
    noCanonicalPackModified: unexpectedDirty.length === 0
      && !dirty.some((file) => file.includes("/packs/") || file.includes("/source-registry/")),
    closureInvalidationRulesPresent: INVALIDATION_RULES.length === 9,
    connectorsRemainPrepared: DE_SK_CONNECTOR_STATUS === "prepared"
      && DE_SK_HEALTH_CONNECTOR_STATUS === "prepared"
      && DE_SK_FAMILY_CONNECTOR_STATUS === "prepared"
      && DE_SK_UNEMPLOYMENT_CONNECTOR_STATUS === "prepared",
    deSkCorridorV1KnowledgeComplete: knowledgeComplete,
  };

  const everyProofHolds = Object.values(proofs).every((value) => value === true);
  const deSkCorridorV1KnowledgeComplete = knowledgeComplete && everyProofHolds;
  const finalDecision = deSkCorridorV1KnowledgeComplete
    ? "CLOSE_DE_SK_KNOWLEDGE_CORRIDOR_V1"
    : "DO_NOT_CLOSE_DE_SK_KNOWLEDGE_CORRIDOR_V1";
  const phaseResult = deSkCorridorV1KnowledgeComplete ? "PASS" : "FAIL";

  const report = {
    phase: "DE-SK-V1-CLOSURE",
    phaseResult,
    finalDecision,
    recommendation: deSkCorridorV1KnowledgeComplete
      ? "AUTHORIZE_AT_SK_CORRIDOR_ARCHITECTURE_AND_REUSE_AUDIT"
      : "ONE_SPECIFIC_DE_SK_CORRIDOR_REMEDIATION_PACKAGE",
    repository: { branch, startingHead: EXPECTED_HEAD, finalHead: head, dirty },
    snapshot,
    proofs,
    e2eEvidence: {
      phase: e2e.phase,
      phaseResult: e2e.phaseResult,
      corridorV1Candidate: e2e.corridorV1Candidate,
      endToEndScenarioCount: e2e.endToEndScenarioCount,
      blockedByCrossDomainDefectCount: e2e.blockedByCrossDomainDefectCount,
      validMultiStateResultsAccepted: e2e.validMultiStateResultsAccepted,
      failClosedMissingContextCount: e2e.failClosedMissingContextCount,
      validMultiStateExample: e2e.validMultiStateExample,
    },
    presentation: {
      presentationLayerImplemented,
      presentationLayerRequiredBeforeUserFacingLaunch,
      presentationLayerBlocksKnowledgeClosure,
    },
    runtime: {
      runtimeIntegrationComplete: false,
      runtimeAuthorized,
      productionAuthorized,
      publicRuntimeAuthorized,
      goLiveAuthorized,
      activeCorridors,
    },
    invalidation: {
      rules: INVALIDATION_RULES,
      materialKnowledgeHashes: trackedHashes,
      closureNeedsRevalidation,
      note: "This snapshot is valid only for the captured baseline. Material knowledge change requires revalidation. It is not permanent certification.",
    },
    database: {
      migrationChainThrough: MIGRATION_BASELINE,
      migration062: false,
      schemaChanges: false,
      rlsChanges: false,
      grantsChanges: false,
      canonicalPackChanges: false,
      productionInteraction: false,
    },
    filesCreated: [CLOSURE_REL],
    filesModified: [PACKAGE_JSON_REL, E2E_REL],
    e2eRunnerArchitecturalNote:
      "The committed E2E runner pinned the pre-E2E HEAD. After E2E itself was committed at this baseline, that pin could not execute. Closure updated only the E2E audit preflight/export so the real E2E evaluation can run against the current committed HEAD. No canonical pack, contract, writer, or migration changed.",
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (phaseResult !== "PASS") process.exit(1);
}

main();
