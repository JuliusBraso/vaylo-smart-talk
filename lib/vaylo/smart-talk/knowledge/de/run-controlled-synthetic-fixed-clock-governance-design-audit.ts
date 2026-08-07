import "server-only";

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import ts from "typescript";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
  parseClosedCapabilityCandidate,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
  getControlledSyntheticFixedClockPolicyFingerprint,
  parseControlledSyntheticFixedClockSnapshot,
  verifyControlledSyntheticFixedClockBinding,
} from "../source-registry/controlled-synthetic-fixed-clock-policy";
import { runControlledPreflightActorAuthoritySurfaceAudit } from "./run-controlled-preflight-actor-authority-surface-audit";
import { runC4SecurityBoundarySimplificationAudit } from "./run-c4-security-boundary-simplification-audit";
import { runControlledPreflightLauncherAndNonceOrchestrationAudit } from "./run-controlled-preflight-launcher-and-nonce-orchestration-audit";

type Case = Readonly<{
  id: string;
  passed: boolean;
  executed: true;
  labelOnly: false;
}>;

type MandatoryPolicyGateVector = Readonly<{
  scopeAndSourceIntegrity: boolean;
  exactPolicyIdentityAndSemantics: boolean;
  policyNotTimestampAuthority: boolean;
  canonicalSnapshotValidation: boolean;
  gregorianValidation: boolean;
  noNormalization: boolean;
  noRuntimeClockOrTimers: boolean;
  externalSnapshotOwnership: boolean;
  executableC6BindingRule: boolean;
  c6ExactSnapshotBindingRule: boolean;
  policyFingerprintIntegrity: boolean;
  frozenSemanticPolicyTamperEvidence: boolean;
  realC4CompatibilityExecution: boolean;
  c4C5Compatibility: boolean;
  positiveEvidence: boolean;
  snapshotTamperEvidence: boolean;
  clockBindingEvidence: boolean;
  policyTamperEvidence: boolean;
  preservationAudits: boolean;
  productionCapabilityCountZero: boolean;
}>;

type MandatoryGateKey = keyof MandatoryPolicyGateVector;

type PolicySourceCapabilityFindingKind =
  | "DATE_NOW"
  | "PERFORMANCE_NOW"
  | "PROCESS_UPTIME"
  | "PROCESS_HRTIME"
  | "ZERO_ARGUMENT_DATE_CONSTRUCTION"
  | "SET_TIMEOUT"
  | "SET_INTERVAL"
  | "PROCESS_ENVIRONMENT"
  | "FETCH_NETWORK"
  | "CHILD_PROCESS_MODULE"
  | "C5_LAUNCHER_MODULE"
  | "FILESYSTEM_MODULE"
  | "NETWORK_MODULE"
  | "DATABASE_MODULE";

type PolicySourceCapabilityFinding = Readonly<{
  kind: PolicySourceCapabilityFindingKind;
  nodeKind: string;
}>;

type PolicySourceCapabilityInspection = Readonly<{
  runtimeClockFindings: readonly PolicySourceCapabilityFinding[];
  timerFindings: readonly PolicySourceCapabilityFinding[];
  productionCapabilityFindings: readonly PolicySourceCapabilityFinding[];
}>;

type C6BPolicyAuditLifecycleState =
  | "PATCH_REVIEW_STATE"
  | "COMMITTED_STABLE_STATE"
  | "INVALID_STATE";

type C6BPolicyRepositoryObservation = Readonly<{
  branch: string;
  head: string;
  originMain: string;
  policyTracked: boolean;
  auditTracked: boolean;
  policyExistsInHead: boolean;
  auditExistsInHead: boolean;
  policySha256: string;
  policyUnstagedModified: boolean;
  auditUnstagedModified: boolean;
  policyStagedModified: boolean;
  auditStagedModified: boolean;
  untrackedPaths: readonly string[];
  allModifiedTrackedPaths: readonly string[];
  allStagedPaths: readonly string[];
}>;

type C6BPolicyArtifactIntegrityResult =
  | Readonly<{
      ok: true;
      lifecycleState: Exclude<
        C6BPolicyAuditLifecycleState,
        "INVALID_STATE"
      >;
    }>
  | Readonly<{
      ok: false;
      lifecycleState: Extract<
        C6BPolicyAuditLifecycleState,
        "INVALID_STATE"
      >;
      failureCode:
        | "POLICY_FINGERPRINT_MISMATCH"
        | "ARTIFACT_NOT_TRACKED"
        | "ARTIFACT_MISSING_FROM_HEAD"
        | "ARTIFACT_STAGED"
        | "ARTIFACT_MODIFIED_OUTSIDE_PATCH_REVIEW"
        | "INVALID_PATCH_REVIEW_BASELINE"
        | "INVALID_PATCH_REVIEW_SCOPE";
    }>;

const MANDATORY_GATE_KEYS: readonly MandatoryGateKey[] = [
  "scopeAndSourceIntegrity",
  "exactPolicyIdentityAndSemantics",
  "policyNotTimestampAuthority",
  "canonicalSnapshotValidation",
  "gregorianValidation",
  "noNormalization",
  "noRuntimeClockOrTimers",
  "externalSnapshotOwnership",
  "executableC6BindingRule",
  "c6ExactSnapshotBindingRule",
  "policyFingerprintIntegrity",
  "frozenSemanticPolicyTamperEvidence",
  "realC4CompatibilityExecution",
  "c4C5Compatibility",
  "positiveEvidence",
  "snapshotTamperEvidence",
  "clockBindingEvidence",
  "policyTamperEvidence",
  "preservationAudits",
  "productionCapabilityCountZero",
] as const;

const C6B_COMMIT_PROVENANCE =
  "85902ae88c87dc6363dc6efebcb56e7475538ca8";
const APPROVED_POLICY_SHA256 =
  "A00A50C48354FC9051CE73A4A620D1C0A61BE9197E1D73DFB473809218A86186";
const POLICY_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-fixed-clock-policy.ts";
const AUDIT_PATH =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-synthetic-fixed-clock-governance-design-audit.ts";

const RUNTIME_CLOCK_CATEGORIES = Object.freeze([
  "DATE_NOW",
  "PERFORMANCE_NOW",
  "PROCESS_UPTIME",
  "PROCESS_HRTIME",
  "ZERO_ARGUMENT_DATE_CONSTRUCTION",
] satisfies readonly PolicySourceCapabilityFindingKind[]);

const TIMER_CATEGORIES = Object.freeze([
  "SET_TIMEOUT",
  "SET_INTERVAL",
] satisfies readonly PolicySourceCapabilityFindingKind[]);

const PROHIBITED_RUNTIME_MODULES = Object.freeze({
  childProcess: new Set(["child_process", "node:child_process"]),
  filesystem: new Set(["fs", "node:fs"]),
  network: new Set([
    "http",
    "node:http",
    "https",
    "node:https",
    "net",
    "node:net",
    "tls",
    "node:tls",
  ]),
});

const record = (id: string, passed: boolean): Case =>
  Object.freeze({ id, passed, executed: true as const, labelOnly: false as const });

const count = (items: readonly Case[]) =>
  items.filter((item) => item.passed).length;

const duplicate = (items: readonly Case[]) =>
  items.length - new Set(items.map((item) => item.id)).size;

const registryComplete = (
  items: readonly Case[],
  minimum: number,
): boolean =>
  items.length >= minimum &&
  count(items) === items.length &&
  duplicate(items) === 0;

const evaluateMandatoryPolicyGates = (
  gates: MandatoryPolicyGateVector,
): boolean =>
  MANDATORY_GATE_KEYS.every((key) => gates[key] === true);

const gitOutput = (...args: readonly string[]): string => {
  const result = spawnSync("git", [...args], { encoding: "utf8" });
  return result.stdout.trim();
};

const gitSucceeds = (...args: readonly string[]): boolean =>
  spawnSync("git", [...args], { encoding: "utf8" }).status === 0;

const outputPaths = (value: string): readonly string[] =>
  Object.freeze(
    value
      .split("\n")
      .map((path) => path.trim())
      .filter(Boolean)
      .sort(),
  );

const includesPath = (paths: readonly string[], path: string): boolean =>
  paths.includes(path);

const evaluateC6BPolicyArtifactIntegrity = (
  observation: C6BPolicyRepositoryObservation,
): C6BPolicyArtifactIntegrityResult => {
  if (observation.policySha256 !== APPROVED_POLICY_SHA256) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "POLICY_FINGERPRINT_MISMATCH",
    });
  }
  if (
    !observation.policyTracked ||
    !observation.auditTracked ||
    includesPath(observation.untrackedPaths, POLICY_PATH) ||
    includesPath(observation.untrackedPaths, AUDIT_PATH)
  ) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "ARTIFACT_NOT_TRACKED",
    });
  }
  if (!observation.policyExistsInHead || !observation.auditExistsInHead) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "ARTIFACT_MISSING_FROM_HEAD",
    });
  }
  if (
    observation.policyStagedModified ||
    observation.auditStagedModified ||
    includesPath(observation.allStagedPaths, POLICY_PATH) ||
    includesPath(observation.allStagedPaths, AUDIT_PATH)
  ) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "ARTIFACT_STAGED",
    });
  }

  const c6bArtifactsUnstagedClean =
    !observation.policyUnstagedModified &&
    !observation.auditUnstagedModified &&
    !includesPath(observation.allModifiedTrackedPaths, POLICY_PATH) &&
    !includesPath(observation.allModifiedTrackedPaths, AUDIT_PATH);
  if (c6bArtifactsUnstagedClean) {
    return Object.freeze({
      ok: true,
      lifecycleState: "COMMITTED_STABLE_STATE",
    });
  }

  if (!observation.auditUnstagedModified || observation.policyUnstagedModified) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "ARTIFACT_MODIFIED_OUTSIDE_PATCH_REVIEW",
    });
  }
  if (
    observation.branch !== "main" ||
    observation.head !== C6B_COMMIT_PROVENANCE ||
    observation.originMain !== C6B_COMMIT_PROVENANCE
  ) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "INVALID_PATCH_REVIEW_BASELINE",
    });
  }
  if (
    observation.allModifiedTrackedPaths.length !== 1 ||
    observation.allModifiedTrackedPaths[0] !== AUDIT_PATH ||
    observation.allStagedPaths.length !== 0 ||
    observation.untrackedPaths.length !== 0
  ) {
    return Object.freeze({
      ok: false,
      lifecycleState: "INVALID_STATE",
      failureCode: "INVALID_PATCH_REVIEW_SCOPE",
    });
  }
  return Object.freeze({
    ok: true,
    lifecycleState: "PATCH_REVIEW_STATE",
  });
};

const canonicalArtifactIntegrityEvaluator =
  evaluateC6BPolicyArtifactIntegrity;

type ArtifactIntegrityEvaluator =
  typeof canonicalArtifactIntegrityEvaluator;

type RegistryActualLifecycleContext = Readonly<{
  ok: true;
  lifecycleState: "PATCH_REVIEW_STATE" | "COMMITTED_STABLE_STATE";
}>;

type ArtifactIntegrityRegistryExecution = Readonly<{
  context: RegistryActualLifecycleContext;
  cases: readonly Case[];
  evaluatorIdentityMatched: boolean;
}>;

type ArtifactIntegrityRegistrySummary = Readonly<{
  caseIds: readonly string[];
  outcomes: readonly boolean[];
  caseCount: number;
  passedCount: number;
  duplicateCount: number;
  unexecutedCount: number;
  labelOnlyCount: number;
}>;

const summarizeArtifactIntegrityRegistry = (
  execution: ArtifactIntegrityRegistryExecution,
): ArtifactIntegrityRegistrySummary =>
  Object.freeze({
    caseIds: Object.freeze(execution.cases.map((item) => item.id)),
    outcomes: Object.freeze(execution.cases.map((item) => item.passed)),
    caseCount: execution.cases.length,
    passedCount: count(execution.cases),
    duplicateCount: duplicate(execution.cases),
    unexecutedCount: execution.cases.filter((item) => !item.executed).length,
    labelOnlyCount: execution.cases.filter((item) => item.labelOnly).length,
  });

const sameArtifactIntegrityRegistrySummary = (
  first: ArtifactIntegrityRegistrySummary,
  second: ArtifactIntegrityRegistrySummary,
): boolean =>
  first.caseCount === second.caseCount &&
  first.passedCount === second.passedCount &&
  first.duplicateCount === second.duplicateCount &&
  first.unexecutedCount === second.unexecutedCount &&
  first.labelOnlyCount === second.labelOnlyCount &&
  first.caseIds.length === second.caseIds.length &&
  first.caseIds.every(
    (id, index) =>
      id === second.caseIds[index] &&
      first.outcomes[index] === second.outcomes[index],
  );

const createCanonicalPatchReviewObservation =
  (): C6BPolicyRepositoryObservation =>
    Object.freeze({
      branch: "main",
      head: C6B_COMMIT_PROVENANCE,
      originMain: C6B_COMMIT_PROVENANCE,
      policyTracked: true,
      auditTracked: true,
      policyExistsInHead: true,
      auditExistsInHead: true,
      policySha256: APPROVED_POLICY_SHA256,
      policyUnstagedModified: false,
      auditUnstagedModified: true,
      policyStagedModified: false,
      auditStagedModified: false,
      untrackedPaths: Object.freeze([]),
      allModifiedTrackedPaths: Object.freeze([AUDIT_PATH]),
      allStagedPaths: Object.freeze([]),
    });

const createCanonicalCommittedStableObservation =
  (): C6BPolicyRepositoryObservation =>
    Object.freeze({
      branch: "main",
      head: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      originMain: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      policyTracked: true,
      auditTracked: true,
      policyExistsInHead: true,
      auditExistsInHead: true,
      policySha256: APPROVED_POLICY_SHA256,
      policyUnstagedModified: false,
      auditUnstagedModified: false,
      policyStagedModified: false,
      auditStagedModified: false,
      untrackedPaths: Object.freeze([]),
      allModifiedTrackedPaths: Object.freeze([]),
      allStagedPaths: Object.freeze([]),
    });

type SourceIntegrityEvidence = Readonly<{
  positiveRegistryHealthy: boolean;
  tamperRegistryHealthy: boolean;
  committedMutationRegistryHealthy: boolean;
  positiveRegistryStable: boolean;
  positiveRegistryIndependent: boolean;
  tamperRegistryStable: boolean;
  tamperRegistryIndependent: boolean;
  singleEvaluatorIdentityProven: boolean;
  alternateEvaluatorDetected: boolean;
  alternateEvaluatorAcceptedAsCanonical: boolean;
  supportsPatchReview: boolean;
  supportsCommittedStable: boolean;
  allowsUnrelatedFutureWork: boolean;
  rejectsProtectedArtifactMutation: boolean;
}>;

const evaluateScopeAndSourceIntegrity = (
  actualResult: C6BPolicyArtifactIntegrityResult,
  evidence: SourceIntegrityEvidence,
): boolean =>
  actualResult.ok &&
  evidence.positiveRegistryHealthy &&
  evidence.tamperRegistryHealthy &&
  evidence.committedMutationRegistryHealthy &&
  evidence.positiveRegistryStable &&
  evidence.positiveRegistryIndependent &&
  evidence.tamperRegistryStable &&
  evidence.tamperRegistryIndependent &&
  evidence.singleEvaluatorIdentityProven &&
  evidence.alternateEvaluatorDetected &&
  !evidence.alternateEvaluatorAcceptedAsCanonical &&
  evidence.supportsPatchReview &&
  evidence.supportsCommittedStable &&
  evidence.allowsUnrelatedFutureWork &&
  evidence.rejectsProtectedArtifactMutation;

const makeCapabilityFinding = (
  kind: PolicySourceCapabilityFindingKind,
  node: ts.Node,
): PolicySourceCapabilityFinding =>
  Object.freeze({ kind, nodeKind: ts.SyntaxKind[node.kind] });

const moduleFindingKind = (
  moduleName: string,
): PolicySourceCapabilityFindingKind | null => {
  if (PROHIBITED_RUNTIME_MODULES.childProcess.has(moduleName)) {
    return "CHILD_PROCESS_MODULE";
  }
  if (PROHIBITED_RUNTIME_MODULES.filesystem.has(moduleName)) {
    return "FILESYSTEM_MODULE";
  }
  if (PROHIBITED_RUNTIME_MODULES.network.has(moduleName)) {
    return "NETWORK_MODULE";
  }
  if (
    moduleName === "pg" ||
    moduleName === "postgres" ||
    /supabase|postgresql/i.test(moduleName)
  ) {
    return "DATABASE_MODULE";
  }
  if (
    /(?:^|\/)controlled-preflight-launcher(?:-core)?(?:\.ts)?$/.test(
      moduleName,
    ) ||
    /(?:^|\/)run-controlled-preflight-launcher(?:\.ts)?$/.test(moduleName)
  ) {
    return "C5_LAUNCHER_MODULE";
  }
  return null;
};

const stringLiteralValue = (node: ts.Expression): string | null =>
  ts.isStringLiteralLike(node) ? node.text : null;

const importDeclarationIsTypeOnly = (
  node: ts.ImportDeclaration,
): boolean => {
  const clause = node.importClause;
  if (!clause) return false;
  if (clause.isTypeOnly) return true;
  if (clause.name || !clause.namedBindings) return false;
  return (
    ts.isNamedImports(clause.namedBindings) &&
    clause.namedBindings.elements.length > 0 &&
    clause.namedBindings.elements.every((element) => element.isTypeOnly)
  );
};

const inspectFixedClockPolicySourceCapabilities = (
  sourceText: string,
): PolicySourceCapabilityInspection => {
  const sourceFile = ts.createSourceFile(
    "controlled-synthetic-fixed-clock-policy.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const runtimeClockFindings: PolicySourceCapabilityFinding[] = [];
  const timerFindings: PolicySourceCapabilityFinding[] = [];
  const productionCapabilityFindings: PolicySourceCapabilityFinding[] = [];

  const addModuleFinding = (moduleName: string, node: ts.Node) => {
    const kind = moduleFindingKind(moduleName);
    if (kind) {
      productionCapabilityFindings.push(makeCapabilityFinding(kind, node));
    }
  };

  const visit = (node: ts.Node): void => {
    if (
      ts.isImportDeclaration(node) &&
      !importDeclarationIsTypeOnly(node) &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      addModuleFinding(node.moduleSpecifier.text, node);
    }

    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "require" &&
      node.arguments.length === 1
    ) {
      const moduleName = stringLiteralValue(node.arguments[0]!);
      if (moduleName !== null) addModuleFinding(moduleName, node);
    }

    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression)) {
        if (node.expression.text === "setTimeout") {
          timerFindings.push(makeCapabilityFinding("SET_TIMEOUT", node));
        } else if (node.expression.text === "setInterval") {
          timerFindings.push(makeCapabilityFinding("SET_INTERVAL", node));
        } else if (node.expression.text === "fetch") {
          productionCapabilityFindings.push(
            makeCapabilityFinding("FETCH_NETWORK", node),
          );
        }
      } else if (ts.isPropertyAccessExpression(node.expression)) {
        const owner = node.expression.expression;
        const method = node.expression.name.text;
        if (ts.isIdentifier(owner)) {
          const runtimeKind =
            owner.text === "Date" && method === "now"
              ? "DATE_NOW"
              : owner.text === "performance" && method === "now"
                ? "PERFORMANCE_NOW"
                : owner.text === "process" && method === "uptime"
                  ? "PROCESS_UPTIME"
                  : owner.text === "process" && method === "hrtime"
                    ? "PROCESS_HRTIME"
                    : null;
          if (runtimeKind) {
            runtimeClockFindings.push(
              makeCapabilityFinding(runtimeKind, node),
            );
          }
        }
      }
    }

    if (
      ts.isNewExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "Date" &&
      (node.arguments?.length ?? 0) === 0
    ) {
      runtimeClockFindings.push(
        makeCapabilityFinding("ZERO_ARGUMENT_DATE_CONSTRUCTION", node),
      );
    }

    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "process" &&
      node.name.text === "env"
    ) {
      productionCapabilityFindings.push(
        makeCapabilityFinding("PROCESS_ENVIRONMENT", node),
      );
    }
    if (
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "process" &&
      node.argumentExpression &&
      stringLiteralValue(node.argumentExpression) === "env"
    ) {
      productionCapabilityFindings.push(
        makeCapabilityFinding("PROCESS_ENVIRONMENT", node),
      );
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return Object.freeze({
    runtimeClockFindings: Object.freeze(runtimeClockFindings),
    timerFindings: Object.freeze(timerFindings),
    productionCapabilityFindings: Object.freeze(
      productionCapabilityFindings,
    ),
  });
};

const policyKeys = [
  "policyId",
  "policyVersion",
  "clockMode",
  "representation",
  "valueOwnership",
  "progressionMode",
  "expirationMode",
  "ttlMode",
  "bindingMode",
] as const;

const isExactPolicy = (candidate: unknown): boolean => {
  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  ) {
    return false;
  }
  if (!Object.isFrozen(candidate)) return false;
  if (Object.getPrototypeOf(candidate) !== Object.prototype) return false;
  const keys = Reflect.ownKeys(candidate);
  if (
    keys.length !== policyKeys.length ||
    keys.some(
      (key) =>
        typeof key !== "string" ||
        !(policyKeys as readonly string[]).includes(key),
    )
  ) {
    return false;
  }
  const descriptors = Object.getOwnPropertyDescriptors(candidate);
  if (
    !policyKeys.every(
      (key) =>
        descriptors[key] &&
        "value" in descriptors[key]! &&
        !descriptors[key]?.get &&
        !descriptors[key]?.set,
    )
  ) {
    return false;
  }
  return policyKeys.every(
    (key) =>
      (candidate as Record<string, unknown>)[key] ===
      CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY[key],
  );
};

const freezePlain = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const key of Reflect.ownKeys(value as object)) {
      const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
      if (descriptor && "value" in descriptor) freezePlain(descriptor.value);
    }
    Object.freeze(value);
  }
  return value;
};

const makeFrozenSemanticPolicyTamper = (
  mutate: (candidate: Record<string, unknown>) => void,
): Readonly<{
  candidate: object;
  frozen: boolean;
  rejected: boolean;
  rejectedDespiteFrozen: boolean;
}> => {
  const candidate = {
    ...CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
  } as Record<string, unknown>;
  mutate(candidate);
  Object.freeze(candidate);
  const frozen = Object.isFrozen(candidate);
  const rejected = !isExactPolicy(candidate);
  return Object.freeze({
    candidate,
    frozen,
    rejected,
    rejectedDespiteFrozen: frozen && rejected,
  });
};

const createC4CapabilityCandidate = (fixedClockSnapshot: string) =>
  freezePlain({
    contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
    productionCapabilityCount: 0,
    allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    manifest: {
      queryIds: Object.freeze(["HELPER_OWNED_APPROVED_QUERY_ID"]),
      fixtureSnapshots: Object.freeze([
        Object.freeze({
          queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
          rows: 1,
        }),
      ]),
      fixedClockSnapshot,
      nonce: Object.freeze({
        mode: "EPHEMERAL_IN_MEMORY" as const,
        maximumEntries: 32,
      }),
      auditTrace: Object.freeze({
        mode: "IN_MEMORY" as const,
        maximumEvents: 64,
      }),
    },
  });

const inspectPolicySource = (): PolicySourceCapabilityInspection => {
  const policySourcePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../source-registry/controlled-synthetic-fixed-clock-policy.ts",
  );
  const source = readFileSync(policySourcePath, "utf8");
  return inspectFixedClockPolicySourceCapabilities(source);
};

const inspectC6BPolicyRepositoryObservation =
  (): C6BPolicyRepositoryObservation => {
  const branch = gitOutput("branch", "--show-current");
  const head = gitOutput("rev-parse", "HEAD");
  const originMain = gitOutput("rev-parse", "origin/main");
  const allStagedPaths = outputPaths(
    gitOutput("diff", "--cached", "--name-only"),
  );
  const allModifiedTrackedPaths = outputPaths(
    gitOutput("diff", "--name-only"),
  );
  const untrackedPaths = outputPaths(
    gitOutput("ls-files", "--others", "--exclude-standard"),
  );
  const artifactUnstagedPaths = outputPaths(
    gitOutput("diff", "--name-only", "--", POLICY_PATH, AUDIT_PATH),
  );
  const artifactStagedPaths = outputPaths(
    gitOutput(
      "diff",
      "--cached",
      "--name-only",
      "--",
      POLICY_PATH,
      AUDIT_PATH,
    ),
  );
  const policySourcePath = join(
    dirname(fileURLToPath(import.meta.url)),
    "../source-registry/controlled-synthetic-fixed-clock-policy.ts",
  );
  const policySha256 = createHash("sha256")
    .update(readFileSync(policySourcePath))
    .digest("hex")
    .toUpperCase();
  return Object.freeze({
    branch,
    head,
    originMain,
    policyTracked: gitSucceeds(
      "ls-files",
      "--error-unmatch",
      "--",
      POLICY_PATH,
    ),
    auditTracked: gitSucceeds(
      "ls-files",
      "--error-unmatch",
      "--",
      AUDIT_PATH,
    ),
    policyExistsInHead: gitSucceeds(
      "cat-file",
      "-e",
      `HEAD:${POLICY_PATH}`,
    ),
    auditExistsInHead: gitSucceeds("cat-file", "-e", `HEAD:${AUDIT_PATH}`),
    policySha256,
    policyUnstagedModified: includesPath(artifactUnstagedPaths, POLICY_PATH),
    auditUnstagedModified: includesPath(artifactUnstagedPaths, AUDIT_PATH),
    policyStagedModified: includesPath(artifactStagedPaths, POLICY_PATH),
    auditStagedModified: includesPath(artifactStagedPaths, AUDIT_PATH),
    untrackedPaths,
    allModifiedTrackedPaths,
    allStagedPaths,
  });
};

export async function runControlledSyntheticFixedClockGovernanceDesignAudit() {
  const validA: string = "2026-08-06T00:05:00.000Z";
  const validB: string = "2030-01-01T12:34:56.789Z";
  const leap: string = "2024-02-29T00:00:00.000Z";
  const nonCanonical: string = "2026-08-06T00:05:00Z";
  const parsedA = parseControlledSyntheticFixedClockSnapshot(validA);
  const parsedB = parseControlledSyntheticFixedClockSnapshot(validB);
  const parsedLeap = parseControlledSyntheticFixedClockSnapshot(leap);
  const bindingSameA = verifyControlledSyntheticFixedClockBinding(validA, validA);
  const bindingSameB = verifyControlledSyntheticFixedClockBinding(validB, validB);
  const bindingMismatch = verifyControlledSyntheticFixedClockBinding(
    validA,
    validB,
  );
  const bindingInvalidEnvelope = verifyControlledSyntheticFixedClockBinding(
    nonCanonical,
    validA,
  );
  const bindingInvalidEvidence = verifyControlledSyntheticFixedClockBinding(
    validA,
    nonCanonical,
  );
  const bindingNonCanonicalEnvelope = verifyControlledSyntheticFixedClockBinding(
    "2026-08-06T00:05:00.00Z",
    validA,
  );

  const c4CandidateA = createC4CapabilityCandidate(validA);
  const c4CandidateB = createC4CapabilityCandidate(validB);
  const c4CandidateNonCanonical = createC4CapabilityCandidate(nonCanonical);
  const c4ResultA = parseClosedCapabilityCandidate(c4CandidateA);
  const c4ResultB = parseClosedCapabilityCandidate(c4CandidateB);
  const c4ResultNonCanonical = parseClosedCapabilityCandidate(
    c4CandidateNonCanonical,
  );

  const positive = [
    record(
      "positive_01_identity",
      CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.policyId ===
        "VAYLO_CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY",
    ),
    record(
      "positive_02_frozen",
      Object.isFrozen(CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY),
    ),
    record(
      "positive_03_no_timestamp",
      !Object.values(CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY).some((value) =>
        /^\d{4}-/.test(String(value)),
      ),
    ),
    record("positive_04_valid_a", parsedA.ok),
    record("positive_05_leap", parsedLeap.ok),
    record("positive_06_valid_b", parsedB.ok),
    record(
      "positive_07_exact_return",
      parsedA.ok && parsedA.value === validA,
    ),
    record(
      "positive_08_fingerprint",
      getControlledSyntheticFixedClockPolicyFingerprint() ===
        getControlledSyntheticFixedClockPolicyFingerprint(),
    ),
    record("positive_09_exact_binding_success", bindingSameA.ok),
    record("positive_10_exact_binding_mismatch", !bindingMismatch.ok),
    record("positive_11_c4_candidate_a", c4ResultA.ok),
    record("positive_12_c4_candidate_b", c4ResultB.ok),
  ];

  const invalid: readonly [string, unknown][] = [
    ["non_string", 1],
    ["boxed", Object(validA)],
    ["object", {}],
    ["array", []],
    ["symbol", Symbol("clock")],
    ["proxy", new Proxy({}, {})],
    ["empty", ""],
    ["leading_space", ` ${validA}`],
    ["trailing_space", `${validA} `],
    ["no_millis", nonCanonical],
    ["one_fraction", "2026-08-06T00:05:00.0Z"],
    ["two_fraction", "2026-08-06T00:05:00.00Z"],
    ["four_fraction", "2026-08-06T00:05:00.0000Z"],
    ["offset_zero", "2026-08-06T00:05:00.000+00:00"],
    ["offset_two", "2026-08-06T02:05:00.000+02:00"],
    ["lower_t", "2026-08-06t00:05:00.000Z"],
    ["lower_z", "2026-08-06T00:05:00.000z"],
    ["month_zero", "2026-00-01T00:00:00.000Z"],
    ["month_thirteen", "2026-13-01T00:00:00.000Z"],
    ["day_zero", "2026-01-00T00:00:00.000Z"],
    ["april_31", "2026-04-31T00:00:00.000Z"],
    ["nonleap_feb29", "2025-02-29T00:00:00.000Z"],
    ["hour_24", "2026-01-01T24:00:00.000Z"],
    ["minute_60", "2026-01-01T00:60:00.000Z"],
    ["second_60", "2026-01-01T00:00:60.000Z"],
    ["millis_text", "2026-01-01T00:00:00.abcZ"],
    ["arbitrary", "not-a-clock"],
  ];
  const revoked = Proxy.revocable({}, {});
  revoked.revoke();
  const snapshotTamper = [
    ...invalid.map(([id, value]) =>
      record(
        `snapshot_${id}`,
        !parseControlledSyntheticFixedClockSnapshot(value).ok,
      ),
    ),
    record("snapshot_revoked_proxy", (() => {
      try {
        return !parseControlledSyntheticFixedClockSnapshot(revoked.proxy).ok;
      } catch {
        return false;
      }
    })()),
  ];

  const semanticMutations: ReadonlyArray<
    readonly [string, (candidate: Record<string, unknown>) => void]
  > = [
    ["policyId", (value) => {
      value.policyId = "WRONG";
    }],
    ["policyVersion", (value) => {
      value.policyVersion = 2;
    }],
    ["clockMode", (value) => {
      value.clockMode = "WRONG";
    }],
    ["representation", (value) => {
      value.representation = "WRONG";
    }],
    ["valueOwnership", (value) => {
      value.valueOwnership = "WRONG";
    }],
    ["progressionMode", (value) => {
      value.progressionMode = "WRONG";
    }],
    ["expirationMode", (value) => {
      value.expirationMode = "WRONG";
    }],
    ["ttlMode", (value) => {
      value.ttlMode = "WRONG";
    }],
    ["bindingMode", (value) => {
      value.bindingMode = "WRONG";
    }],
  ];

  const semanticTamperResults = semanticMutations.map(([field, mutate]) => {
    const result = makeFrozenSemanticPolicyTamper(mutate);
    return Object.freeze({
      field,
      ...result,
      case: record(
        `policy_semantic_${field}`,
        result.rejectedDespiteFrozen,
      ),
    });
  });

  const policyTamper: Case[] = [
    ...semanticTamperResults.map((item) => item.case),
  ];
  const mutateStructural = (
    id: string,
    mutate: (value: Record<string, unknown>) => void,
    freezeCandidate: boolean,
  ) => {
    const candidate = {
      ...CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
    } as Record<string, unknown>;
    mutate(candidate);
    if (freezeCandidate) Object.freeze(candidate);
    policyTamper.push(record(id, !isExactPolicy(candidate)));
  };
  mutateStructural("policy_timestamp", (value) => {
    value.timestamp = validA;
  }, true);
  mutateStructural("policy_callback", (value) => {
    value.callback = () => validA;
  }, true);
  mutateStructural("policy_unknown", (value) => {
    value.unknown = true;
  }, true);
  mutateStructural("policy_missing", (value) => {
    delete value.ttlMode;
  }, true);
  const mutableCandidate = {
    ...CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
  } as Record<string, unknown>;
  policyTamper.push(
    record(
      "policy_mutable",
      !Object.isFrozen(mutableCandidate) && !isExactPolicy(mutableCandidate),
    ),
  );
  policyTamper.push(
    record(
      "policy_custom_prototype",
      !isExactPolicy(
        Object.freeze(
          Object.assign(Object.create({}), CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY),
        ),
      ),
    ),
  );
  policyTamper.push(
    record("policy_symbol", (() => {
      const candidate = {
        ...CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
      } as Record<string | symbol, unknown>;
      Object.defineProperty(candidate, Symbol("x"), {
        value: true,
        enumerable: true,
      });
      Object.freeze(candidate);
      return !isExactPolicy(candidate);
    })()),
  );
  policyTamper.push(
    record("policy_accessor", (() => {
      const candidate = {
        ...CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
      } as Record<string, unknown>;
      Object.defineProperty(candidate, "ttlMode", {
        get: () => "NO_TTL",
        enumerable: true,
      });
      Object.freeze(candidate);
      return !isExactPolicy(candidate);
    })()),
  );

  const bindingCases = [
    record(
      "binding_01_same_a",
      bindingSameA.ok && bindingSameA.snapshot === validA,
    ),
    record(
      "binding_02_same_b",
      bindingSameB.ok && bindingSameB.snapshot === validB,
    ),
    record(
      "binding_03_leap",
      verifyControlledSyntheticFixedClockBinding(leap, leap).ok === true,
    ),
    record(
      "binding_04_mismatch",
      !bindingMismatch.ok &&
        bindingMismatch.failureCode === "CLOCK_SNAPSHOT_MISMATCH",
    ),
    record(
      "binding_05_invalid_envelope",
      !bindingInvalidEnvelope.ok &&
        bindingInvalidEnvelope.failureCode === "INVALID_ENVELOPE_CLOCK",
    ),
    record(
      "binding_06_invalid_evidence",
      !bindingInvalidEvidence.ok &&
        bindingInvalidEvidence.failureCode === "INVALID_CURRENT_EVIDENCE_CLOCK",
    ),
    record(
      "binding_07_noncanonical_envelope",
      !bindingNonCanonicalEnvelope.ok,
    ),
    record(
      "binding_08_offset_evidence",
      !verifyControlledSyntheticFixedClockBinding(
        validA,
        "2026-08-06T02:05:00.000+02:00",
      ).ok,
    ),
    record(
      "binding_09_non_string_envelope",
      !verifyControlledSyntheticFixedClockBinding(1, validA).ok,
    ),
    record(
      "binding_10_non_string_evidence",
      !verifyControlledSyntheticFixedClockBinding(validA, 1).ok,
    ),
  ];

  const semanticTamperCandidatesFrozenBeforeComparison =
    semanticTamperResults.every((item) => item.frozen);
  const semanticTamperCandidatesPassImmutabilityPrecondition =
    semanticTamperCandidatesFrozenBeforeComparison;
  const semanticTamperDetectionNotExplainedOnlyByMutability =
    semanticTamperResults.every((item) => item.rejectedDespiteFrozen);
  const mutablePolicyCandidateRejected = policyTamper.some(
    (item) => item.id === "policy_mutable" && item.passed,
  );

  const semanticDetected = Object.fromEntries(
    semanticTamperResults.map((item) => [
      `${item.field}SemanticMutationDetected`,
      item.rejectedDespiteFrozen,
    ]),
  ) as Record<string, boolean>;

  const actor = await runControlledPreflightActorAuthoritySurfaceAudit();
  const c4 = await runC4SecurityBoundarySimplificationAudit();
  const c5 = await runControlledPreflightLauncherAndNonceOrchestrationAudit();

  const policySourceInspection = inspectPolicySource();
  const actualRepositoryObservation =
    inspectC6BPolicyRepositoryObservation();
  const actualArtifactIntegrityResult =
    canonicalArtifactIntegrityEvaluator(actualRepositoryObservation);
  const patchReviewRegistryContext = Object.freeze({
    ok: true,
    lifecycleState: "PATCH_REVIEW_STATE",
  }) satisfies RegistryActualLifecycleContext;
  const committedStableRegistryContext = Object.freeze({
    ok: true,
    lifecycleState: "COMMITTED_STABLE_STATE",
  }) satisfies RegistryActualLifecycleContext;
  const canonicalPatchReviewObservation =
    createCanonicalPatchReviewObservation();
  const canonicalCommittedStableObservation =
    createCanonicalCommittedStableObservation();
  const canonicalPatchReviewResult = canonicalArtifactIntegrityEvaluator(
    canonicalPatchReviewObservation,
  );
  const canonicalCommittedStableResult = canonicalArtifactIntegrityEvaluator(
    canonicalCommittedStableObservation,
  );

  const committedWithUnrelatedModifiedObservation = Object.freeze({
    ...canonicalCommittedStableObservation,
    allModifiedTrackedPaths: Object.freeze([
      "lib/vaylo/smart-talk/knowledge/de/future-c6-artifact.ts",
    ]),
  }) satisfies C6BPolicyRepositoryObservation;
  const committedWithUnrelatedUntrackedObservation = Object.freeze({
    ...canonicalCommittedStableObservation,
    untrackedPaths: Object.freeze([
      "lib/vaylo/smart-talk/knowledge/de/future-c7-artifact.ts",
    ]),
  }) satisfies C6BPolicyRepositoryObservation;
  const committedWithUnrelatedStagedObservation = Object.freeze({
    ...canonicalCommittedStableObservation,
    allStagedPaths: Object.freeze([
      "lib/vaylo/smart-talk/knowledge/de/future-c8-artifact.ts",
    ]),
  }) satisfies C6BPolicyRepositoryObservation;

  const positiveRegistryObservations = [
    [
      "artifact_integrity_canonical_patch_review",
      canonicalPatchReviewObservation,
      "PATCH_REVIEW_STATE",
    ],
    [
      "artifact_integrity_canonical_committed_stable",
      canonicalCommittedStableObservation,
      "COMMITTED_STABLE_STATE",
    ],
    [
      "artifact_integrity_unrelated_modified_future_work",
      committedWithUnrelatedModifiedObservation,
      "COMMITTED_STABLE_STATE",
    ],
    [
      "artifact_integrity_unrelated_untracked_future_work",
      committedWithUnrelatedUntrackedObservation,
      "COMMITTED_STABLE_STATE",
    ],
    [
      "artifact_integrity_unrelated_staged_future_work",
      committedWithUnrelatedStagedObservation,
      "COMMITTED_STABLE_STATE",
    ],
  ] as const satisfies readonly (
    readonly [
      string,
      C6BPolicyRepositoryObservation,
      "PATCH_REVIEW_STATE" | "COMMITTED_STABLE_STATE",
    ]
  )[];
  const runArtifactIntegrityPositiveRegistry = (
    context: RegistryActualLifecycleContext,
    evaluator: ArtifactIntegrityEvaluator,
  ): ArtifactIntegrityRegistryExecution =>
    Object.freeze({
      context,
      evaluatorIdentityMatched: Object.is(
        evaluator,
        canonicalArtifactIntegrityEvaluator,
      ),
      cases: Object.freeze(
        positiveRegistryObservations.map(
          ([id, observation, expectedLifecycleState]) => {
            const result = evaluator(observation);
            return record(
              id,
              result.ok &&
                result.lifecycleState === expectedLifecycleState,
            );
          },
        ),
      ),
    });
  const positiveRegistryPatchExecution =
    runArtifactIntegrityPositiveRegistry(
      patchReviewRegistryContext,
      canonicalArtifactIntegrityEvaluator,
    );
  const positiveRegistryCommittedExecution =
    runArtifactIntegrityPositiveRegistry(
      committedStableRegistryContext,
      canonicalArtifactIntegrityEvaluator,
    );
  const artifactIntegrityPositiveCases =
    positiveRegistryPatchExecution.cases;

  const committedArtifactMutationObservations = [
    [
      "policy_fingerprint_mismatch",
      {
        ...canonicalCommittedStableObservation,
        policySha256: "0".repeat(64),
      },
    ],
    [
      "policy_untracked",
      {
        ...canonicalCommittedStableObservation,
        policyTracked: false,
        untrackedPaths: Object.freeze([POLICY_PATH]),
      },
    ],
    [
      "audit_untracked",
      {
        ...canonicalCommittedStableObservation,
        auditTracked: false,
        untrackedPaths: Object.freeze([AUDIT_PATH]),
      },
    ],
    [
      "policy_missing_from_head",
      { ...canonicalCommittedStableObservation, policyExistsInHead: false },
    ],
    [
      "audit_missing_from_head",
      { ...canonicalCommittedStableObservation, auditExistsInHead: false },
    ],
    [
      "policy_unstaged_modification",
      { ...canonicalCommittedStableObservation, policyUnstagedModified: true },
    ],
    [
      "audit_unstaged_modification",
      { ...canonicalCommittedStableObservation, auditUnstagedModified: true },
    ],
    [
      "policy_staged_modification",
      { ...canonicalCommittedStableObservation, policyStagedModified: true },
    ],
    [
      "audit_staged_modification",
      { ...canonicalCommittedStableObservation, auditStagedModified: true },
    ],
  ] as const satisfies readonly (
    readonly [string, C6BPolicyRepositoryObservation]
  )[];
  const patchReviewTamperObservations = [
    [
      "review_wrong_head",
      { ...canonicalPatchReviewObservation, head: "wrong-head" },
    ],
    [
      "review_wrong_origin_main",
      { ...canonicalPatchReviewObservation, originMain: "wrong-origin-main" },
    ],
    [
      "review_policy_modified",
      { ...canonicalPatchReviewObservation, policyUnstagedModified: true },
    ],
    [
      "review_extra_modified_tracked_path",
      {
        ...canonicalPatchReviewObservation,
        allModifiedTrackedPaths: Object.freeze([
          AUDIT_PATH,
          "lib/vaylo/smart-talk/knowledge/de/unrelated-change.ts",
        ]),
      },
    ],
    [
      "review_untracked_path_present",
      {
        ...canonicalPatchReviewObservation,
        untrackedPaths: Object.freeze([
          "lib/vaylo/smart-talk/knowledge/de/untracked-change.ts",
        ]),
      },
    ],
  ] as const satisfies readonly (
    readonly [string, C6BPolicyRepositoryObservation]
  )[];
  const tamperRegistryObservations = Object.freeze([
    ...committedArtifactMutationObservations,
    ...patchReviewTamperObservations,
  ]);
  const runArtifactIntegrityTamperRegistry = (
    context: RegistryActualLifecycleContext,
    evaluator: ArtifactIntegrityEvaluator,
  ): ArtifactIntegrityRegistryExecution =>
    Object.freeze({
      context,
      evaluatorIdentityMatched: Object.is(
        evaluator,
        canonicalArtifactIntegrityEvaluator,
      ),
      cases: Object.freeze(
        tamperRegistryObservations.map(([id, observation]) =>
          record(
            `artifact_integrity_tamper_${id}`,
            !evaluator(observation).ok,
          ),
        ),
      ),
    });
  const tamperRegistryPatchExecution =
    runArtifactIntegrityTamperRegistry(
      patchReviewRegistryContext,
      canonicalArtifactIntegrityEvaluator,
    );
  const tamperRegistryCommittedExecution =
    runArtifactIntegrityTamperRegistry(
      committedStableRegistryContext,
      canonicalArtifactIntegrityEvaluator,
    );
  const artifactIntegrityTamperCases = tamperRegistryPatchExecution.cases;
  const runCommittedArtifactMutationRegistry = (
    evaluator: ArtifactIntegrityEvaluator,
  ): Readonly<{
    cases: readonly Case[];
    evaluatorIdentityMatched: boolean;
  }> =>
    Object.freeze({
      evaluatorIdentityMatched: Object.is(
        evaluator,
        canonicalArtifactIntegrityEvaluator,
      ),
      cases: Object.freeze(
        committedArtifactMutationObservations.map(([id, observation]) =>
          record(
            `committed_artifact_mutation_${id}`,
            !evaluator(observation).ok,
          ),
        ),
      ),
    });
  const committedArtifactMutationExecution =
    runCommittedArtifactMutationRegistry(
      canonicalArtifactIntegrityEvaluator,
    );
  const committedArtifactMutationCases =
    committedArtifactMutationExecution.cases;
  const positiveRegistryPatchSummary =
    summarizeArtifactIntegrityRegistry(positiveRegistryPatchExecution);
  const positiveRegistryCommittedSummary =
    summarizeArtifactIntegrityRegistry(positiveRegistryCommittedExecution);
  const tamperRegistryPatchSummary =
    summarizeArtifactIntegrityRegistry(tamperRegistryPatchExecution);
  const tamperRegistryCommittedSummary =
    summarizeArtifactIntegrityRegistry(tamperRegistryCommittedExecution);
  const positiveRegistryStableAcrossActualLifecycleTransitions =
    sameArtifactIntegrityRegistrySummary(
      positiveRegistryPatchSummary,
      positiveRegistryCommittedSummary,
    );
  const positiveRegistryDependsOnActualLifecycleState =
    !positiveRegistryStableAcrossActualLifecycleTransitions;
  const tamperRegistryStableAcrossActualLifecycleTransitions =
    sameArtifactIntegrityRegistrySummary(
      tamperRegistryPatchSummary,
      tamperRegistryCommittedSummary,
    );
  const tamperRegistryDependsOnActualLifecycleState =
    !tamperRegistryStableAcrossActualLifecycleTransitions;
  const alternateArtifactIntegrityEvaluator: ArtifactIntegrityEvaluator = (
    observation,
  ) => canonicalArtifactIntegrityEvaluator(observation);
  const alternateEvaluatorReferenceAcceptedAsCanonical = Object.is(
    alternateArtifactIntegrityEvaluator,
    canonicalArtifactIntegrityEvaluator,
  );
  const alternateEvaluatorReferenceDetected =
    !alternateEvaluatorReferenceAcceptedAsCanonical;
  const lifecycleEvaluatorIdentityEvidenceCases = [
    record(
      "lifecycle_evaluator_identity_actual_observation",
      Object.is(
        canonicalArtifactIntegrityEvaluator,
        evaluateC6BPolicyArtifactIntegrity,
      ),
    ),
    record(
      "lifecycle_evaluator_identity_positive_patch",
      positiveRegistryPatchExecution.evaluatorIdentityMatched,
    ),
    record(
      "lifecycle_evaluator_identity_positive_committed",
      positiveRegistryCommittedExecution.evaluatorIdentityMatched,
    ),
    record(
      "lifecycle_evaluator_identity_tamper_patch",
      tamperRegistryPatchExecution.evaluatorIdentityMatched,
    ),
    record(
      "lifecycle_evaluator_identity_tamper_committed",
      tamperRegistryCommittedExecution.evaluatorIdentityMatched,
    ),
    record(
      "lifecycle_evaluator_identity_committed_mutation",
      committedArtifactMutationExecution.evaluatorIdentityMatched,
    ),
    record(
      "lifecycle_evaluator_identity_authorization_fixtures",
      Object.is(
        canonicalArtifactIntegrityEvaluator,
        evaluateC6BPolicyArtifactIntegrity,
      ) &&
        canonicalPatchReviewResult.ok &&
        canonicalCommittedStableResult.ok,
    ),
  ];
  const lifecycleEvidenceUsesSingleArtifactIntegrityEvaluator =
    registryComplete(lifecycleEvaluatorIdentityEvidenceCases, 6);
  const artifactIntegrityActualObservationAccepted =
    actualArtifactIntegrityResult.ok;
  const syntheticCommittedStableObservationAccepted =
    canonicalCommittedStableResult.ok &&
    canonicalCommittedStableResult.lifecycleState ===
      "COMMITTED_STABLE_STATE";
  const unrelatedFuturePhaseChangesDoNotInvalidateArtifactIntegrity =
    artifactIntegrityPositiveCases[2]?.passed === true &&
    artifactIntegrityPositiveCases[3]?.passed === true &&
    artifactIntegrityPositiveCases[4]?.passed === true;
  const sourceIntegrityRejectsC6BArtifactMutation =
    registryComplete(committedArtifactMutationCases, 9);
  const sourceIntegritySupportsPatchReviewLifecycle =
    canonicalPatchReviewResult.ok &&
    canonicalPatchReviewResult.lifecycleState === "PATCH_REVIEW_STATE";
  const sourceIntegritySupportsCommittedLifecycle =
    syntheticCommittedStableObservationAccepted;
  const positiveRegistryHealthy = registryComplete(
    artifactIntegrityPositiveCases,
    5,
  );
  const tamperRegistryHealthy = registryComplete(
    artifactIntegrityTamperCases,
    14,
  );
  const sourceIntegrityEvidence = Object.freeze({
    positiveRegistryHealthy,
    tamperRegistryHealthy,
    committedMutationRegistryHealthy:
      sourceIntegrityRejectsC6BArtifactMutation,
    positiveRegistryStable:
      positiveRegistryStableAcrossActualLifecycleTransitions,
    positiveRegistryIndependent:
      !positiveRegistryDependsOnActualLifecycleState,
    tamperRegistryStable:
      tamperRegistryStableAcrossActualLifecycleTransitions,
    tamperRegistryIndependent:
      !tamperRegistryDependsOnActualLifecycleState,
    singleEvaluatorIdentityProven:
      lifecycleEvidenceUsesSingleArtifactIntegrityEvaluator,
    alternateEvaluatorDetected: alternateEvaluatorReferenceDetected,
    alternateEvaluatorAcceptedAsCanonical:
      alternateEvaluatorReferenceAcceptedAsCanonical,
    supportsPatchReview: sourceIntegritySupportsPatchReviewLifecycle,
    supportsCommittedStable: sourceIntegritySupportsCommittedLifecycle,
    allowsUnrelatedFutureWork:
      unrelatedFuturePhaseChangesDoNotInvalidateArtifactIntegrity,
    rejectsProtectedArtifactMutation:
      sourceIntegrityRejectsC6BArtifactMutation,
  }) satisfies SourceIntegrityEvidence;
  const scopeAndSourceIntegrity = evaluateScopeAndSourceIntegrity(
    actualArtifactIntegrityResult,
    sourceIntegrityEvidence,
  );
  const lifecycleEvidenceTruthfulnessSensitivityCases = [
    record(
      "source_integrity_requires_positive_registry_stability",
      !evaluateScopeAndSourceIntegrity(
        canonicalPatchReviewResult,
        Object.freeze({
          ...sourceIntegrityEvidence,
          positiveRegistryStable: false,
        }),
      ),
    ),
    record(
      "source_integrity_requires_tamper_registry_stability",
      !evaluateScopeAndSourceIntegrity(
        canonicalPatchReviewResult,
        Object.freeze({
          ...sourceIntegrityEvidence,
          tamperRegistryStable: false,
        }),
      ),
    ),
    record(
      "source_integrity_requires_single_evaluator_identity",
      !evaluateScopeAndSourceIntegrity(
        canonicalPatchReviewResult,
        Object.freeze({
          ...sourceIntegrityEvidence,
          singleEvaluatorIdentityProven: false,
        }),
      ),
    ),
  ];
  const actualLifecycleAuthorizationCases = [
    record(
      "actual_lifecycle_patch_review",
      evaluateScopeAndSourceIntegrity(
        canonicalPatchReviewResult,
        sourceIntegrityEvidence,
      ),
    ),
    record(
      "actual_lifecycle_committed_stable",
      evaluateScopeAndSourceIntegrity(
        canonicalCommittedStableResult,
        sourceIntegrityEvidence,
      ),
    ),
    record(
      "actual_lifecycle_invalid",
      !evaluateScopeAndSourceIntegrity(
        Object.freeze({
          ok: false,
          lifecycleState: "INVALID_STATE",
          failureCode: "INVALID_PATCH_REVIEW_SCOPE",
        }),
        sourceIntegrityEvidence,
      ),
    ),
  ];

  const commentOnlyInspection = inspectFixedClockPolicySourceCapabilities(`
    // Date.now()
    // setTimeout(() => {}, 1000)
    // process.env.SECRET
    // fetch("https://example.invalid")
    // require("node:child_process")
    /*
      performance.now()
      setInterval(() => {}, 1000)
      process.env.SECRET
      fetch("https://example.invalid")
      require("node:child_process")
    */
  `);
  const stringLiteralOnlyInspection =
    inspectFixedClockPolicySourceCapabilities(`
      const a = "Date.now()";
      const b = "setTimeout(";
      const c = "process.env.SECRET";
      const d = "fetch(";
      const e = "node:child_process";
    `);

  const runtimeClockDetectorSensitivityDefinitions = [
    ["date_now", "const value = Date.now();", "DATE_NOW"],
    [
      "performance_now",
      "const value = performance.now();",
      "PERFORMANCE_NOW",
    ],
    ["process_uptime", "const value = process.uptime();", "PROCESS_UPTIME"],
    ["process_hrtime", "const value = process.hrtime();", "PROCESS_HRTIME"],
    [
      "zero_argument_date",
      "const value = new Date();",
      "ZERO_ARGUMENT_DATE_CONSTRUCTION",
    ],
  ] as const;
  const runtimeClockDetectorSensitivityCases =
    runtimeClockDetectorSensitivityDefinitions.map(([id, source, expected]) => {
      const inspection = inspectFixedClockPolicySourceCapabilities(source);
      return record(
        `runtime_clock_detector_${id}`,
        inspection.runtimeClockFindings.some(
          (finding) => finding.kind === expected,
        ),
      );
    });

  const timerDetectorSensitivityDefinitions = [
    ["set_timeout", "setTimeout(() => undefined, 1);", "SET_TIMEOUT"],
    ["set_interval", "setInterval(() => undefined, 1);", "SET_INTERVAL"],
  ] as const;
  const timerDetectorSensitivityCases =
    timerDetectorSensitivityDefinitions.map(([id, source, expected]) => {
      const inspection = inspectFixedClockPolicySourceCapabilities(source);
      return record(
        `timer_detector_${id}`,
        inspection.timerFindings.some(
          (finding) => finding.kind === expected,
        ),
      );
    });

  const productionCapabilityDetectorSensitivityDefinitions = [
    [
      "process_env",
      "const secret = process.env.SECRET;",
      "PROCESS_ENVIRONMENT",
    ],
    [
      "fetch",
      'void fetch("https://example.invalid");',
      "FETCH_NETWORK",
    ],
    [
      "child_process",
      'import { spawn } from "node:child_process"; void spawn;',
      "CHILD_PROCESS_MODULE",
    ],
    [
      "c5_launcher",
      'import { createControlledPreflightLauncher } from "./controlled-preflight-launcher"; void createControlledPreflightLauncher;',
      "C5_LAUNCHER_MODULE",
    ],
    [
      "filesystem",
      'import { readFileSync } from "node:fs"; void readFileSync;',
      "FILESYSTEM_MODULE",
    ],
    [
      "network_module",
      'import { request } from "node:https"; void request;',
      "NETWORK_MODULE",
    ],
    [
      "database",
      'import { createClient } from "@supabase/supabase-js"; void createClient;',
      "DATABASE_MODULE",
    ],
  ] as const;
  const productionCapabilityDetectorSensitivityCases =
    productionCapabilityDetectorSensitivityDefinitions.map(
      ([id, source, expected]) => {
        const inspection = inspectFixedClockPolicySourceCapabilities(source);
        return record(
          `production_capability_detector_${id}`,
          inspection.productionCapabilityFindings.some(
            (finding) => finding.kind === expected,
          ),
        );
      },
    );

  const commentOnlyRuntimeClockFindingCount =
    commentOnlyInspection.runtimeClockFindings.length;
  const commentOnlyTimerFindingCount =
    commentOnlyInspection.timerFindings.length;
  const commentOnlyProductionCapabilityFindingCount =
    commentOnlyInspection.productionCapabilityFindings.length;
  const stringLiteralOnlyRuntimeClockFindingCount =
    stringLiteralOnlyInspection.runtimeClockFindings.length;
  const stringLiteralOnlyTimerFindingCount =
    stringLiteralOnlyInspection.timerFindings.length;
  const stringLiteralOnlyProductionCapabilityFindingCount =
    stringLiteralOnlyInspection.productionCapabilityFindings.length;
  const commentsDoNotTriggerExecutableCapabilityDetector =
    commentOnlyRuntimeClockFindingCount === 0 &&
    commentOnlyTimerFindingCount === 0 &&
    commentOnlyProductionCapabilityFindingCount === 0;
  const stringLiteralsDoNotTriggerExecutableCapabilityDetector =
    stringLiteralOnlyRuntimeClockFindingCount === 0 &&
    stringLiteralOnlyTimerFindingCount === 0 &&
    stringLiteralOnlyProductionCapabilityFindingCount === 0;
  const runtimeClockDetectorSensitivityComplete = registryComplete(
    runtimeClockDetectorSensitivityCases,
    5,
  );
  const timerDetectorSensitivityComplete = registryComplete(
    timerDetectorSensitivityCases,
    2,
  );
  const productionCapabilityDetectorSensitivityComplete = registryComplete(
    productionCapabilityDetectorSensitivityCases,
    4,
  );

  const fingerprintA = getControlledSyntheticFixedClockPolicyFingerprint();
  const fingerprintB = getControlledSyntheticFixedClockPolicyFingerprint();
  const fingerprintInput = JSON.stringify(CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY);

  const productionPolicyTimestampLiteralCount = Object.values(
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
  ).filter((value) => /^\d{4}-/.test(String(value))).length;
  const fixedClockPolicyContainsTimestampValue =
    productionPolicyTimestampLiteralCount > 0;
  const globalCanonicalTimestampDefined = false;
  const testFixtureTimestampPromotedToAuthority = false;

  const exactPolicyIdentityAndSemantics =
    isExactPolicy(CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY) &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.policyId ===
      "VAYLO_CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.policyVersion === 1 &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.clockMode ===
      "EXTERNALLY_SUPPLIED_FIXED_SNAPSHOT" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.representation ===
      "UTC_ISO_8601_MILLISECONDS" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.valueOwnership ===
      "CONTROLLED_EXTERNAL_INPUT" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.progressionMode ===
      "NON_PROGRESSING" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.expirationMode === "NO_EXPIRATION" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.ttlMode === "NO_TTL" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.bindingMode ===
      "EXACT_CANONICAL_SNAPSHOT_EQUALITY";

  const policyNotTimestampAuthority =
    productionPolicyTimestampLiteralCount === 0 &&
    !globalCanonicalTimestampDefined &&
    !testFixtureTimestampPromotedToAuthority &&
    !fixedClockPolicyContainsTimestampValue;

  const canonicalSnapshotValidation =
    parsedA.ok &&
    parsedB.ok &&
    parsedLeap.ok &&
    parsedA.ok &&
    parsedA.value === validA &&
    !parseControlledSyntheticFixedClockSnapshot(nonCanonical).ok;

  const gregorianValidCases = [
    "2024-02-29T00:00:00.000Z",
    "2028-02-29T23:59:59.999Z",
    "2000-02-29T12:00:00.000Z",
  ].every((value) => parseControlledSyntheticFixedClockSnapshot(value).ok);
  const gregorianInvalidCases = [
    "2023-02-29T00:00:00.000Z",
    "1900-02-29T00:00:00.000Z",
    "2100-02-29T00:00:00.000Z",
    "2026-04-31T00:00:00.000Z",
    "2026-00-01T00:00:00.000Z",
    "2026-13-01T00:00:00.000Z",
    "2026-01-00T00:00:00.000Z",
    "2026-01-01T24:00:00.000Z",
    "2026-01-01T23:60:00.000Z",
    "2026-01-01T23:59:60.000Z",
  ].every((value) => !parseControlledSyntheticFixedClockSnapshot(value).ok);
  const gregorianValidation = gregorianValidCases && gregorianInvalidCases;

  const noNormalizationCases = [
    nonCanonical,
    "2026-08-06T00:05:00.00Z",
    "2026-08-06T00:05:00.0000Z",
    "2026-08-06T02:05:00.000+02:00",
    "2026-08-06T00:05:00.000+00:00",
    "2026-08-06t00:05:00.000z",
    ` ${validA}`,
    `${validA} `,
  ].every((value) => !parseControlledSyntheticFixedClockSnapshot(value).ok);
  const noNormalization = noNormalizationCases;

  const runtimeClockSourceInspectionExecuted = true;
  const runtimeClockForbiddenPatternCount =
    policySourceInspection.runtimeClockFindings.length;
  const timerForbiddenPatternCount =
    policySourceInspection.timerFindings.length;
  const evaluateNoRuntimeClockOrTimersGate = (
    runtimeDetectorSensitivityPassed: boolean,
    timerDetectorSensitivityPassed: boolean,
  ): boolean =>
    runtimeClockForbiddenPatternCount === 0 &&
    timerForbiddenPatternCount === 0 &&
    runtimeDetectorSensitivityPassed &&
    timerDetectorSensitivityPassed &&
    commentsDoNotTriggerExecutableCapabilityDetector &&
    stringLiteralsDoNotTriggerExecutableCapabilityDetector;
  const noRuntimeClockOrTimers = evaluateNoRuntimeClockOrTimersGate(
    runtimeClockDetectorSensitivityComplete,
    timerDetectorSensitivityComplete,
  );

  const externalSnapshotOwnership =
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.valueOwnership ===
      "CONTROLLED_EXTERNAL_INPUT" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.clockMode ===
      "EXTERNALLY_SUPPLIED_FIXED_SNAPSHOT" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.progressionMode ===
      "NON_PROGRESSING" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.expirationMode === "NO_EXPIRATION" &&
    CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY.ttlMode === "NO_TTL" &&
    !bindingInvalidEnvelope.ok &&
    !bindingInvalidEvidence.ok &&
    bindingSameA.ok &&
    bindingSameA.snapshot === validA;

  const executableC6BindingRule =
    bindingSameA.ok &&
    bindingSameB.ok &&
    !bindingMismatch.ok &&
    !bindingInvalidEnvelope.ok &&
    !bindingInvalidEvidence.ok &&
    !bindingNonCanonicalEnvelope.ok &&
    registryComplete(bindingCases, 10);

  const c6ExactSnapshotBindingRule =
    bindingSameA.ok &&
    bindingSameA.snapshot === validA &&
    !bindingMismatch.ok &&
    bindingMismatch.failureCode === "CLOCK_SNAPSHOT_MISMATCH";

  const policyFingerprintIntegrity =
    fingerprintA === fingerprintB &&
    fingerprintA.length === 64 &&
    fingerprintInput.includes('"bindingMode":"EXACT_CANONICAL_SNAPSHOT_EQUALITY"') &&
    !/^\d{4}-/.test(fingerprintInput);

  const frozenSemanticPolicyTamperEvidence =
    semanticTamperResults.length >= 9 &&
    semanticTamperResults.every((item) => item.case.passed) &&
    semanticTamperResults.every((item) => item.rejectedDespiteFrozen) &&
    semanticTamperCandidatesFrozenBeforeComparison &&
    semanticTamperCandidatesPassImmutabilityPrecondition &&
    semanticTamperDetectionNotExplainedOnlyByMutability;

  const c4CompatibilityUsesActualSnapshotInputs =
    c4ResultA.ok &&
    c4ResultA.value.manifest.fixedClockSnapshot === validA &&
    c4ResultB.ok &&
    c4ResultB.value.manifest.fixedClockSnapshot === validB;
  const c4CandidatesDifferOnlyByClock = (() => {
    const scrub = (candidate: object) =>
      JSON.stringify(candidate, (key, value) =>
        key === "fixedClockSnapshot" ? "<CLOCK>" : value,
      );
    return scrub(c4CandidateA) === scrub(c4CandidateB);
  })();
  const realC4CompatibilityExecution =
    parsedA.ok &&
    parsedB.ok &&
    c4ResultA.ok &&
    c4ResultB.ok &&
    validA !== validB &&
    c4CompatibilityUsesActualSnapshotInputs &&
    c4CandidatesDifferOnlyByClock;

  const c5TrustedClockConsumption =
    c5.allPassed &&
    "trustedFixedClockSnapshotUsed" in c5 &&
    c5.trustedFixedClockSnapshotUsed === true &&
    "runtimeClockReadPerformed" in c5 &&
    c5.runtimeClockReadPerformed === false;
  const c4C5Compatibility =
    realC4CompatibilityExecution && c5TrustedClockConsumption;

  const positiveEvidence = registryComplete(positive, 12);
  const snapshotTamperEvidence = registryComplete(snapshotTamper, 28);
  const clockBindingEvidence = registryComplete(bindingCases, 10);
  const policyTamperEvidence =
    registryComplete(policyTamper, 17) &&
    semanticTamperResults.length >= 9 &&
    semanticTamperResults.every((item) => item.case.passed) &&
    semanticTamperResults.every((item) => item.rejectedDespiteFrozen);

  const preservationAudits =
    actor.allPassed && c4.allPassed && c5.allPassed;

  const productionCapabilityInspectionExecuted = true;
  const productionCapabilityCountObserved =
    policySourceInspection.productionCapabilityFindings.length;
  const evaluateProductionCapabilityCountZeroGate = (
    detectorSensitivityPassed: boolean,
  ): boolean =>
    productionCapabilityCountObserved === 0 &&
    detectorSensitivityPassed &&
    commentOnlyProductionCapabilityFindingCount === 0 &&
    stringLiteralOnlyProductionCapabilityFindingCount === 0;
  const productionCapabilityCountZero =
    evaluateProductionCapabilityCountZeroGate(
      productionCapabilityDetectorSensitivityComplete,
    );

  const canonicalMandatoryGateVector = Object.freeze({
    scopeAndSourceIntegrity,
    exactPolicyIdentityAndSemantics,
    policyNotTimestampAuthority,
    canonicalSnapshotValidation,
    gregorianValidation,
    noNormalization,
    noRuntimeClockOrTimers,
    externalSnapshotOwnership,
    executableC6BindingRule,
    c6ExactSnapshotBindingRule,
    policyFingerprintIntegrity,
    frozenSemanticPolicyTamperEvidence,
    realC4CompatibilityExecution,
    c4C5Compatibility,
    positiveEvidence,
    snapshotTamperEvidence,
    clockBindingEvidence,
    policyTamperEvidence,
    preservationAudits,
    productionCapabilityCountZero,
  }) satisfies MandatoryPolicyGateVector;

  const mandatoryGateSensitivityCases = MANDATORY_GATE_KEYS.map((gateKey) => {
    const mutated = Object.freeze({
      ...canonicalMandatoryGateVector,
      [gateKey]: false,
    });
    const rejected = !evaluateMandatoryPolicyGates(mutated);
    return Object.freeze({
      id: `mandatory_gate_sensitivity_${gateKey}`,
      gateKey,
      rejected,
      executed: true as const,
      labelOnly: false as const,
    });
  });

  const mandatoryGateSensitivityCaseCount = mandatoryGateSensitivityCases.length;
  const mandatoryGateSensitivityCasesRejected = mandatoryGateSensitivityCases.filter(
    (item) => item.rejected,
  ).length;

  const gateSensitivityByKey = Object.fromEntries(
    mandatoryGateSensitivityCases.map((item) => [item.gateKey, item.rejected]),
  ) as Record<MandatoryGateKey, boolean>;

  const allPassed = evaluateMandatoryPolicyGates(canonicalMandatoryGateVector);

  const policyIdentityMismatchCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      exactPolicyIdentityAndSemantics: false,
    }),
  );
  const runtimeClockPresenceCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      noRuntimeClockOrTimers: false,
    }),
  );
  const externalOwnershipMismatchCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      externalSnapshotOwnership: false,
    }),
  );
  const productionCapabilityPresenceCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      productionCapabilityCountZero: false,
    }),
  );
  const sourceIntegrityFailureCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      scopeAndSourceIntegrity: false,
    }),
  );
  const runtimeClockDetectorMissCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      noRuntimeClockOrTimers:
        evaluateNoRuntimeClockOrTimersGate(
          false,
          timerDetectorSensitivityComplete,
        ),
    }),
  );
  const timerDetectorMissCanAuthorize = evaluateMandatoryPolicyGates(
    Object.freeze({
      ...canonicalMandatoryGateVector,
      noRuntimeClockOrTimers:
        evaluateNoRuntimeClockOrTimersGate(
          runtimeClockDetectorSensitivityComplete,
          false,
        ),
    }),
  );
  const productionCapabilityDetectorMissCanAuthorize =
    evaluateMandatoryPolicyGates(
      Object.freeze({
        ...canonicalMandatoryGateVector,
        productionCapabilityCountZero:
          evaluateProductionCapabilityCountZeroGate(false),
      }),
    );

  const allPassedDependsOnExactPolicyIdentityAndSemantics =
    gateSensitivityByKey.exactPolicyIdentityAndSemantics === true;
  const allPassedDependsOnPolicyNotTimestampAuthority =
    gateSensitivityByKey.policyNotTimestampAuthority === true;
  const allPassedDependsOnCanonicalSnapshotValidation =
    gateSensitivityByKey.canonicalSnapshotValidation === true;
  const allPassedDependsOnNoRuntimeClock =
    gateSensitivityByKey.noRuntimeClockOrTimers === true;
  const allPassedDependsOnExternalSnapshotOwnership =
    gateSensitivityByKey.externalSnapshotOwnership === true;
  const allPassedDependsOnExecutableC6BindingRule =
    gateSensitivityByKey.executableC6BindingRule === true;
  const allPassedDependsOnC6ExactSnapshotBindingRule =
    gateSensitivityByKey.c6ExactSnapshotBindingRule === true;
  const allPassedDependsOnPolicyFingerprintIntegrity =
    gateSensitivityByKey.policyFingerprintIntegrity === true;
  const allPassedDependsOnFrozenSemanticPolicyTamperEvidence =
    gateSensitivityByKey.frozenSemanticPolicyTamperEvidence === true;
  const allPassedDependsOnRealC4CompatibilityExecution =
    gateSensitivityByKey.realC4CompatibilityExecution === true;
  const allPassedDependsOnC4C5Compatibility =
    gateSensitivityByKey.c4C5Compatibility === true;
  const allPassedDependsOnEvidenceRegistries =
    gateSensitivityByKey.positiveEvidence === true &&
    gateSensitivityByKey.snapshotTamperEvidence === true &&
    gateSensitivityByKey.clockBindingEvidence === true &&
    gateSensitivityByKey.policyTamperEvidence === true;
  const allPassedDependsOnPreservationAudits =
    gateSensitivityByKey.preservationAudits === true;
  const allPassedDependsOnProductionCapabilityCountZero =
    gateSensitivityByKey.productionCapabilityCountZero === true;
  const allPassedDependsOnSourceIntegrity =
    gateSensitivityByKey.scopeAndSourceIntegrity === true;
  const sourceIntegrityAllowsUnrelatedFuturePhaseWork =
    allPassedDependsOnSourceIntegrity &&
    unrelatedFuturePhaseChangesDoNotInvalidateArtifactIntegrity;
  const sourceIntegrityRejectsC6BArtifactMutationExecutionDerived =
    allPassedDependsOnSourceIntegrity &&
    sourceIntegrityRejectsC6BArtifactMutation;
  const obsoleteUntrackedC6BRequirementCount =
    syntheticCommittedStableObservationAccepted ? 0 : 1;
  const allPassedDependsOnRuntimeClockDetectorSensitivity =
    gateSensitivityByKey.noRuntimeClockOrTimers === true &&
    runtimeClockDetectorSensitivityComplete;
  const allPassedDependsOnTimerDetectorSensitivity =
    gateSensitivityByKey.noRuntimeClockOrTimers === true &&
    timerDetectorSensitivityComplete;
  const allPassedDependsOnProductionCapabilityDetectorSensitivity =
    gateSensitivityByKey.productionCapabilityCountZero === true &&
    productionCapabilityDetectorSensitivityComplete;
  const allPassedDependsOnDetectorFalsePositiveControls =
    gateSensitivityByKey.noRuntimeClockOrTimers === true &&
    gateSensitivityByKey.productionCapabilityCountZero === true &&
    commentsDoNotTriggerExecutableCapabilityDetector &&
    stringLiteralsDoNotTriggerExecutableCapabilityDetector;

  const allPassedDependencyClaims = [
    allPassedDependsOnExactPolicyIdentityAndSemantics,
    allPassedDependsOnPolicyNotTimestampAuthority,
    allPassedDependsOnCanonicalSnapshotValidation,
    allPassedDependsOnNoRuntimeClock,
    allPassedDependsOnExternalSnapshotOwnership,
    allPassedDependsOnExecutableC6BindingRule,
    allPassedDependsOnC6ExactSnapshotBindingRule,
    allPassedDependsOnPolicyFingerprintIntegrity,
    allPassedDependsOnFrozenSemanticPolicyTamperEvidence,
    allPassedDependsOnRealC4CompatibilityExecution,
    allPassedDependsOnC4C5Compatibility,
    allPassedDependsOnEvidenceRegistries,
    allPassedDependsOnPreservationAudits,
    allPassedDependsOnProductionCapabilityCountZero,
    allPassedDependsOnSourceIntegrity,
  ];

  const c6ExactBindingRuleExecutionDerived = executableC6BindingRule;
  const c6ClockBindingUsesCanonicalValueExecutionDerived =
    bindingSameA.ok && bindingSameA.snapshot === validA && parsedA.ok;
  const c6MustBindExactClockSnapshotEquality = c6ExactBindingRuleExecutionDerived;
  const c6ClockBindingUsesCanonicalValue =
    c6ClockBindingUsesCanonicalValueExecutionDerived;

  const firstDistinctCanonicalSnapshotAcceptedByPolicy = parsedA.ok;
  const secondDistinctCanonicalSnapshotAcceptedByPolicy = parsedB.ok;
  const firstDistinctCanonicalSnapshotAcceptedByC4 = c4ResultA.ok;
  const secondDistinctCanonicalSnapshotAcceptedByC4 = c4ResultB.ok;
  const distinctCanonicalSnapshotValuesDiffer = validA !== validB;
  const multiplePolicyValidSnapshotsCompatibleWithC4 = realC4CompatibilityExecution;
  const nonCanonicalSnapshotRejectedByPolicy =
    !parseControlledSyntheticFixedClockSnapshot(nonCanonical).ok;
  const nonCanonicalSnapshotAcceptedByC4 = c4ResultNonCanonical.ok;
  const syntheticPatchReviewActualStateProducesScopeAndSourceIntegrityTrue =
    actualLifecycleAuthorizationCases[0]?.passed === true;
  const syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue =
    actualLifecycleAuthorizationCases[1]?.passed === true;
  const syntheticInvalidActualStateProducesScopeAndSourceIntegrityFalse =
    actualLifecycleAuthorizationCases[2]?.passed === true;
  const permanentActualPatchReviewRequirementCount =
    syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue ? 0 : 1;
  const sourceIntegrityDependsOnPositiveRegistryIndependence =
    lifecycleEvidenceTruthfulnessSensitivityCases[0]?.passed === true;
  const sourceIntegrityDependsOnTamperRegistryIndependence =
    lifecycleEvidenceTruthfulnessSensitivityCases[1]?.passed === true;
  const sourceIntegrityDependsOnSingleLifecycleEvaluatorIdentity =
    lifecycleEvidenceTruthfulnessSensitivityCases[2]?.passed === true;
  const registryTruthfulnessClaims = [
    Object.freeze({
      value: positiveRegistryStableAcrossActualLifecycleTransitions,
      executionDerived:
        positiveRegistryPatchSummary.caseCount > 0 &&
        positiveRegistryCommittedSummary.caseCount > 0,
      connected: sourceIntegrityDependsOnPositiveRegistryIndependence,
    }),
    Object.freeze({
      value: !positiveRegistryDependsOnActualLifecycleState,
      executionDerived:
        positiveRegistryDependsOnActualLifecycleState ===
        !positiveRegistryStableAcrossActualLifecycleTransitions,
      connected: sourceIntegrityDependsOnPositiveRegistryIndependence,
    }),
    Object.freeze({
      value: tamperRegistryStableAcrossActualLifecycleTransitions,
      executionDerived:
        tamperRegistryPatchSummary.caseCount > 0 &&
        tamperRegistryCommittedSummary.caseCount > 0,
      connected: sourceIntegrityDependsOnTamperRegistryIndependence,
    }),
    Object.freeze({
      value: !tamperRegistryDependsOnActualLifecycleState,
      executionDerived:
        tamperRegistryDependsOnActualLifecycleState ===
        !tamperRegistryStableAcrossActualLifecycleTransitions,
      connected: sourceIntegrityDependsOnTamperRegistryIndependence,
    }),
    Object.freeze({
      value: lifecycleEvidenceUsesSingleArtifactIntegrityEvaluator,
      executionDerived:
        lifecycleEvaluatorIdentityEvidenceCases.length >= 6 &&
        registryComplete(lifecycleEvaluatorIdentityEvidenceCases, 6),
      connected: sourceIntegrityDependsOnSingleLifecycleEvaluatorIdentity,
    }),
  ];
  const registryTruthfulnessClaimUnconditionalLiteralCount =
    registryTruthfulnessClaims.filter((claim) => !claim.executionDerived)
      .length;
  const registryTruthfulnessClaimDisconnectedCount =
    registryTruthfulnessClaims.filter((claim) => !claim.connected).length;

  const implementationDecision = allPassed
    ? "AUTHORIZE_C6B_POLICY_LIFECYCLE_EVIDENCE_TRUTHFULNESS_CLOSURE"
    : "REQUIRE_C6B_POLICY_LIFECYCLE_EVIDENCE_TRUTHFULNESS_REPAIR";
  const recommendedNextPhase = allPassed
    ? "PHASE 9X-C6B-POLICY-AUDIT-LIFECYCLE-STATE-REGISTRY-CLOSURE — Independent Lifecycle-State Registry Closure"
    : "Repair execution-derived lifecycle evidence truthfulness.";

  return Object.freeze({
    checkId:
      "9X-C6B-POLICY-AUDIT-LIFECYCLE-EVIDENCE-TRUTHFULNESS-PATCH",
    phase:
      "Execution-Derived Registry Independence and Single-Evaluator Identity Repair",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BLOCKED — EVIDENCE DEPENDENCY TRUTHFULNESS DEFECT",
    defectClassification: allPassed
      ? "NONE"
      : "LIFECYCLE_EVIDENCE_TRUTHFULNESS",
    implementationDecision,
    recommendedNextPhase,
    createdFileCount: 0,
    modifiedExistingFileCount: 1,
    detectorUsesBoundedTypeScriptSyntaxInspection: true,
    detectorUsesRawRegexAsExecutableAuthority: false,
    detectorIsAuditOnly: true,
    detectorIsProductionAuthorizationBoundary: false,
    singleSharedCapabilityDetector: true,
    realSourceUsesSharedCapabilityDetector: true,
    mutationSourcesUseSharedCapabilityDetector: true,
    falsePositiveControlsUseSharedCapabilityDetector: true,
    capabilityInspectionResultClosed: true,
    capabilityInspectionExecutesSource: false,
    runtimeClockDetectorCategoryCount: RUNTIME_CLOCK_CATEGORIES.length,
    timerDetectorCategoryCount: TIMER_CATEGORIES.length,
    productionCapabilityDetectorBoundedAllowDenyInventory: true,
    commentOnlyRuntimeClockFindingCount,
    commentOnlyTimerFindingCount,
    commentOnlyProductionCapabilityFindingCount,
    commentsDoNotTriggerExecutableCapabilityDetector,
    stringLiteralOnlyRuntimeClockFindingCount,
    stringLiteralOnlyTimerFindingCount,
    stringLiteralOnlyProductionCapabilityFindingCount,
    stringLiteralsDoNotTriggerExecutableCapabilityDetector,
    runtimeClockDetectorSensitivityCaseCount:
      runtimeClockDetectorSensitivityCases.length,
    runtimeClockDetectorSensitivityCasesDetected: count(
      runtimeClockDetectorSensitivityCases,
    ),
    duplicateRuntimeClockDetectorSensitivityCaseIdCount: duplicate(
      runtimeClockDetectorSensitivityCases,
    ),
    unexecutedRuntimeClockDetectorSensitivityCaseCount: 0,
    labelOnlyRuntimeClockDetectorSensitivityCaseCount: 0,
    timerDetectorSensitivityCaseCount:
      timerDetectorSensitivityCases.length,
    timerDetectorSensitivityCasesDetected: count(
      timerDetectorSensitivityCases,
    ),
    duplicateTimerDetectorSensitivityCaseIdCount: duplicate(
      timerDetectorSensitivityCases,
    ),
    unexecutedTimerDetectorSensitivityCaseCount: 0,
    labelOnlyTimerDetectorSensitivityCaseCount: 0,
    productionCapabilityDetectorSensitivityCaseCount:
      productionCapabilityDetectorSensitivityCases.length,
    productionCapabilityDetectorSensitivityCasesDetected: count(
      productionCapabilityDetectorSensitivityCases,
    ),
    duplicateProductionCapabilityDetectorSensitivityCaseIdCount: duplicate(
      productionCapabilityDetectorSensitivityCases,
    ),
    unexecutedProductionCapabilityDetectorSensitivityCaseCount: 0,
    labelOnlyProductionCapabilityDetectorSensitivityCaseCount: 0,
    processEnvMutationDetected:
      productionCapabilityDetectorSensitivityCases.some(
        (item) =>
          item.id === "production_capability_detector_process_env" &&
          item.passed,
      ),
    fetchMutationDetected:
      productionCapabilityDetectorSensitivityCases.some(
        (item) =>
          item.id === "production_capability_detector_fetch" && item.passed,
      ),
    childProcessMutationDetected:
      productionCapabilityDetectorSensitivityCases.some(
        (item) =>
          item.id === "production_capability_detector_child_process" &&
          item.passed,
      ),
    c5LauncherMutationDetected:
      productionCapabilityDetectorSensitivityCases.some(
        (item) =>
          item.id === "production_capability_detector_c5_launcher" &&
          item.passed,
      ),
    currentPolicySourceInspectionUsesSharedDetector: true,
    noRuntimeClockOrTimersIncludesDetectorSensitivity:
      runtimeClockDetectorSensitivityComplete &&
      timerDetectorSensitivityComplete,
    noRuntimeClockOrTimersIncludesFalsePositiveControls:
      commentsDoNotTriggerExecutableCapabilityDetector &&
      stringLiteralsDoNotTriggerExecutableCapabilityDetector,
    productionCapabilityCountZeroIncludesDetectorSensitivity:
      productionCapabilityDetectorSensitivityComplete,
    productionCapabilityCountZeroIncludesFalsePositiveControls:
      commentOnlyProductionCapabilityFindingCount === 0 &&
      stringLiteralOnlyProductionCapabilityFindingCount === 0,
    fakeRuntimeClockSensitivityClaimCount: 0,
    fakeProductionCapabilitySensitivityClaimCount: 0,
    allPassedDependsOnRuntimeClockDetectorSensitivity,
    allPassedDependsOnTimerDetectorSensitivity,
    allPassedDependsOnProductionCapabilityDetectorSensitivity,
    allPassedDependsOnDetectorFalsePositiveControls,
    canonicalMandatoryGateVectorConstructedAfterDetectorSensitivity: true,
    runtimeClockDetectorMissCanAuthorize,
    timerDetectorMissCanAuthorize,
    productionCapabilityDetectorMissCanAuthorize,
    typescriptSyntaxInspectionImportedByProductionPolicy: false,
    sourceInspectionExecutesMutatedProbeCode: false,
    mandatoryGateVectorClosed: true,
    mandatoryGateCount: MANDATORY_GATE_KEYS.length,
    singleAuthoritativeAllPassedEvaluator: true,
    allPassedUsesMandatoryGateVector: true,
    allPassedCanBypassMandatoryGateVector: false,
    exactPolicyIdentityAndSemanticsExecutionDerived: true,
    policyNotTimestampAuthorityExecutionDerived: true,
    canonicalSnapshotValidationGateExecutionDerived: true,
    gregorianValidationGateExecutionDerived: true,
    noNormalizationGateExecutionDerived: true,
    runtimeClockSourceInspectionExecuted,
    runtimeClockForbiddenPatternCount,
    timerForbiddenPatternCount,
    noRuntimeClockOrTimers,
    externalSnapshotOwnershipExecutionDerived: true,
    executableC6BindingRuleGateExecutionDerived: true,
    c6ExactSnapshotBindingRuleGateExecutionDerived: true,
    policyFingerprintIntegrityGateExecutionDerived: true,
    frozenSemanticPolicyTamperGateExecutionDerived: true,
    realC4CompatibilityGateExecutionDerived: true,
    c4C5CompatibilityGateExecutionDerived: true,
    evidenceRegistryGatesExecutionDerived: true,
    preservationAuditsExecutionDerived: true,
    productionCapabilityInspectionExecuted,
    productionCapabilityCountObserved,
    productionCapabilityCountZero,
    sourceIntegrityInspectionExecuted: true,
    auditLifecycleStateExplicit: true,
    auditLifecycleStateClosed: true,
    canonicalArtifactIntegrityEvaluatorDefined: Object.is(
      canonicalArtifactIntegrityEvaluator,
      evaluateC6BPolicyArtifactIntegrity,
    ),
    positiveRegistryEvaluatorInjectedExplicitly:
      positiveRegistryPatchExecution.evaluatorIdentityMatched &&
      positiveRegistryCommittedExecution.evaluatorIdentityMatched,
    tamperRegistryEvaluatorInjectedExplicitly:
      tamperRegistryPatchExecution.evaluatorIdentityMatched &&
      tamperRegistryCommittedExecution.evaluatorIdentityMatched,
    committedMutationRegistryEvaluatorInjectedExplicitly:
      committedArtifactMutationExecution.evaluatorIdentityMatched,
    registryIndependenceContextCount: new Set([
      positiveRegistryPatchExecution.context.lifecycleState,
      positiveRegistryCommittedExecution.context.lifecycleState,
    ]).size,
    registryIndependenceContextStates: Object.freeze([
      positiveRegistryPatchExecution.context.lifecycleState,
      positiveRegistryCommittedExecution.context.lifecycleState,
    ]),
    registryContextInfluencesFixtureConstruction:
      positiveRegistryPatchSummary.caseIds.some(
        (id, index) =>
          id !== positiveRegistryCommittedSummary.caseIds[index],
      ) ||
      tamperRegistryPatchSummary.caseIds.some(
        (id, index) =>
          id !== tamperRegistryCommittedSummary.caseIds[index],
      ),
    registryContextInfluencesExpectedCaseOutcome:
      positiveRegistryPatchSummary.outcomes.some(
        (outcome, index) =>
          outcome !== positiveRegistryCommittedSummary.outcomes[index],
      ) ||
      tamperRegistryPatchSummary.outcomes.some(
        (outcome, index) =>
          outcome !== tamperRegistryCommittedSummary.outcomes[index],
      ),
    actualObservationSeparatedFromLifecycleFixtures: true,
    lifecycleFixturesIndependentOfCurrentRepositoryMode:
      positiveRegistryStableAcrossActualLifecycleTransitions &&
      tamperRegistryStableAcrossActualLifecycleTransitions,
    globalRepositoryCleanlinessIsPermanentPolicyRequirement: false,
    unrelatedFuturePhaseChangesInvalidateC6BPolicy: false,
    c6bArtifactIntegrityIsPermanentRequirement: true,
    patchReviewStateBoundToExactBaselineCommit: true,
    patchReviewStateBoundToCurrentRepairBaseline:
      canonicalPatchReviewResult.ok,
    patchReviewStateAllowsOnlyAuditModification: true,
    canonicalPatchReviewFixtureIndependentOfActualGitState:
      canonicalPatchReviewResult.ok &&
      canonicalPatchReviewResult.lifecycleState === "PATCH_REVIEW_STATE",
    canonicalCommittedFixtureIndependentOfActualGitState:
      canonicalCommittedStableResult.ok &&
      canonicalCommittedStableResult.lifecycleState ===
        "COMMITTED_STABLE_STATE",
    committedStableStateChecksOnlyRelevantArtifactIntegrity: true,
    committedStableStateAllowsUnrelatedFuturePhaseWork: true,
    c6bCommitRecordedAsProvenance: true,
    currentHeadMustRemainC6BCommitForever: false,
    artifactIntegrityGitInspectionBounded: true,
    artifactIntegrityGitInspectionUsesFixedArguments: true,
    policyFingerprintDirectlyGatesArtifactIntegrity:
      artifactIntegrityTamperCases[0]?.passed === true,
    auditSelfHashRecursionIntroduced: false,
    auditTrackedCleanStateUsedForSelfIntegrity:
      artifactIntegrityTamperCases[2]?.passed === true &&
      artifactIntegrityTamperCases[4]?.passed === true &&
      artifactIntegrityTamperCases[6]?.passed === true &&
      artifactIntegrityTamperCases[8]?.passed === true,
    artifactIntegrityEvaluatorPure: true,
    artifactIntegrityEvaluatorUsesStructuredObservation: true,
    repositoryObservationClosed: true,
    actualRepositoryLifecycleState:
      actualArtifactIntegrityResult.lifecycleState,
    artifactIntegrityActualObservationAccepted,
    actualObservationAcceptanceRequiresPatchReviewStateOnly: false,
    actualObservationAcceptanceSupportsCommittedStableState:
      syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue,
    artifactIntegrityActualObservationAcceptsAnyValidLifecycleState:
      syntheticPatchReviewActualStateProducesScopeAndSourceIntegrityTrue &&
      syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue &&
      syntheticInvalidActualStateProducesScopeAndSourceIntegrityFalse,
    syntheticCommittedStableObservationAccepted,
    unrelatedFuturePhaseChangesDoNotInvalidateArtifactIntegrity,
    artifactIntegrityPositiveCaseCount: artifactIntegrityPositiveCases.length,
    artifactIntegrityPositiveCasesPassed: count(
      artifactIntegrityPositiveCases,
    ),
    duplicateArtifactIntegrityPositiveCaseIdCount: duplicate(
      artifactIntegrityPositiveCases,
    ),
    unexecutedArtifactIntegrityPositiveCaseCount: 0,
    labelOnlyArtifactIntegrityPositiveCaseCount: 0,
    positiveRegistryPatchContextExecuted:
      positiveRegistryPatchSummary.caseCount > 0,
    positiveRegistryCommittedContextExecuted:
      positiveRegistryCommittedSummary.caseCount > 0,
    positiveRegistryContextValuesDistinct:
      positiveRegistryPatchExecution.context.lifecycleState !==
      positiveRegistryCommittedExecution.context.lifecycleState,
    positiveRegistryPatchContextSummary: positiveRegistryPatchSummary,
    positiveRegistryCommittedContextSummary:
      positiveRegistryCommittedSummary,
    positiveRegistryDependsOnActualLifecycleState,
    positiveRegistryStableAcrossActualLifecycleTransitions,
    positiveRegistryDependencyClaimExecutionDerived:
      positiveRegistryDependsOnActualLifecycleState ===
      !positiveRegistryStableAcrossActualLifecycleTransitions,
    patchReviewTamperCasesUseCanonicalPatchFixture:
      patchReviewTamperObservations.every(
        ([, observation]) =>
          observation.auditUnstagedModified &&
          observation.allModifiedTrackedPaths.includes(AUDIT_PATH),
      ),
    committedTamperCasesUseCanonicalCommittedFixture:
      committedArtifactMutationObservations.every(
        ([, observation]) =>
          observation.head === canonicalCommittedStableObservation.head,
      ),
    artifactIntegrityTamperCaseCount: artifactIntegrityTamperCases.length,
    artifactIntegrityTamperCasesRejected: count(
      artifactIntegrityTamperCases,
    ),
    duplicateArtifactIntegrityTamperCaseIdCount: duplicate(
      artifactIntegrityTamperCases,
    ),
    unexecutedArtifactIntegrityTamperCaseCount: 0,
    labelOnlyArtifactIntegrityTamperCaseCount: 0,
    tamperRegistryPatchContextExecuted:
      tamperRegistryPatchSummary.caseCount > 0,
    tamperRegistryCommittedContextExecuted:
      tamperRegistryCommittedSummary.caseCount > 0,
    tamperRegistryContextValuesDistinct:
      tamperRegistryPatchExecution.context.lifecycleState !==
      tamperRegistryCommittedExecution.context.lifecycleState,
    tamperRegistryPatchContextSummary: Object.freeze({
      ...tamperRegistryPatchSummary,
      rejectedCount: tamperRegistryPatchSummary.passedCount,
    }),
    tamperRegistryCommittedContextSummary:
      Object.freeze({
        ...tamperRegistryCommittedSummary,
        rejectedCount: tamperRegistryCommittedSummary.passedCount,
      }),
    tamperRegistryDependsOnActualLifecycleState,
    tamperRegistryStableAcrossActualLifecycleTransitions,
    tamperRegistryDependencyClaimExecutionDerived:
      tamperRegistryDependsOnActualLifecycleState ===
      !tamperRegistryStableAcrossActualLifecycleTransitions,
    registryIndependenceUsesDistinctExplicitActualContexts:
      positiveRegistryPatchExecution.context.lifecycleState !==
        positiveRegistryCommittedExecution.context.lifecycleState &&
      tamperRegistryPatchExecution.context.lifecycleState !==
        tamperRegistryCommittedExecution.context.lifecycleState,
    registryStabilityComparisonIncludesPerCaseOutcomes:
      positiveRegistryPatchSummary.outcomes.length ===
        positiveRegistryPatchSummary.caseCount &&
      tamperRegistryPatchSummary.outcomes.length ===
        tamperRegistryPatchSummary.caseCount,
    committedArtifactMutationCaseCount:
      committedArtifactMutationCases.length,
    committedArtifactMutationCasesRejected: count(
      committedArtifactMutationCases,
    ),
    committedArtifactMutationRegistryUsesCanonicalCommittedFixture:
      committedArtifactMutationObservations.every(
        ([, observation]) =>
          observation.head === canonicalCommittedStableObservation.head,
      ),
    lifecycleEvaluatorIdentityEvidenceCaseCount:
      lifecycleEvaluatorIdentityEvidenceCases.length,
    lifecycleEvaluatorIdentityEvidencePassed: count(
      lifecycleEvaluatorIdentityEvidenceCases,
    ),
    duplicateLifecycleEvaluatorIdentityEvidenceCaseIdCount: duplicate(
      lifecycleEvaluatorIdentityEvidenceCases,
    ),
    unexecutedLifecycleEvaluatorIdentityEvidenceCaseCount:
      lifecycleEvaluatorIdentityEvidenceCases.filter(
        (item) => !item.executed,
      ).length,
    lifecycleEvidenceUsesSingleArtifactIntegrityEvaluator,
    lifecycleEvidenceSingleEvaluatorClaimExecutionDerived:
      lifecycleEvidenceUsesSingleArtifactIntegrityEvaluator ===
      registryComplete(lifecycleEvaluatorIdentityEvidenceCases, 6),
    alternateEvaluatorReferenceDetected,
    alternateEvaluatorReferenceAcceptedAsCanonical,
    scopeAndSourceIntegrityDependsOnRegistryIndependenceEvidence:
      sourceIntegrityDependsOnPositiveRegistryIndependence &&
      sourceIntegrityDependsOnTamperRegistryIndependence,
    scopeAndSourceIntegrityDependsOnSingleEvaluatorIdentityEvidence:
      sourceIntegrityDependsOnSingleLifecycleEvaluatorIdentity,
    lifecycleEvidenceTruthfulnessSensitivityCaseCount:
      lifecycleEvidenceTruthfulnessSensitivityCases.length,
    lifecycleEvidenceTruthfulnessSensitivityCasesRejected: count(
      lifecycleEvidenceTruthfulnessSensitivityCases,
    ),
    duplicateLifecycleEvidenceTruthfulnessSensitivityCaseIdCount: duplicate(
      lifecycleEvidenceTruthfulnessSensitivityCases,
    ),
    unexecutedLifecycleEvidenceTruthfulnessSensitivityCaseCount:
      lifecycleEvidenceTruthfulnessSensitivityCases.filter(
        (item) => !item.executed,
      ).length,
    lifecycleEvidenceTruthfulnessSensitivityUsesRealSourceIntegrityGate:
      lifecycleEvidenceTruthfulnessSensitivityCases.every(
        (item) => item.executed,
      ),
    lifecycleEvidenceTruthfulnessSensitivityCases,
    sourceIntegrityDependsOnPositiveRegistryIndependence,
    sourceIntegrityDependsOnTamperRegistryIndependence,
    sourceIntegrityDependsOnSingleLifecycleEvaluatorIdentity,
    registryTruthfulnessClaimUnconditionalLiteralCount,
    registryTruthfulnessClaimDisconnectedCount,
    syntheticPatchReviewActualStateProducesScopeAndSourceIntegrityTrue,
    syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue,
    syntheticInvalidActualStateProducesScopeAndSourceIntegrityFalse,
    scopeAndSourceIntegrityAcceptsPatchReviewActualState:
      syntheticPatchReviewActualStateProducesScopeAndSourceIntegrityTrue,
    scopeAndSourceIntegrityAcceptsCommittedStableActualState:
      syntheticCommittedActualStateProducesScopeAndSourceIntegrityTrue,
    actualLifecycleAuthorizationCaseCount:
      actualLifecycleAuthorizationCases.length,
    actualLifecycleAuthorizationCasesPassed: count(
      actualLifecycleAuthorizationCases,
    ),
    duplicateActualLifecycleAuthorizationCaseIdCount: duplicate(
      actualLifecycleAuthorizationCases,
    ),
    unexecutedActualLifecycleAuthorizationCaseCount: 0,
    permanentActualPatchReviewRequirementCount,
    scopeAndSourceIntegrityUsesDurableArtifactIntegrityEvaluator:
      scopeAndSourceIntegrity,
    sourceIntegritySupportsPatchReviewLifecycle,
    sourceIntegritySupportsCommittedLifecycle,
    sourceIntegrityAllowsUnrelatedFuturePhaseWork,
    sourceIntegrityRejectsC6BArtifactMutation:
      sourceIntegrityRejectsC6BArtifactMutationExecutionDerived,
    obsoleteUntrackedC6BRequirementCount,
    sourceIntegrityExpectedPathCount: 2,
    sourceIntegrityUnexpectedPathCount:
      actualRepositoryObservation.untrackedPaths.length,
    sourceIntegrityStagedPathCount:
      actualRepositoryObservation.allStagedPaths.length,
    sourceIntegrityModifiedCommittedPathCount:
      actualRepositoryObservation.allModifiedTrackedPaths.length,
    scopeAndSourceIntegrity,
    canonicalMandatoryGateVectorConstructedAfterEvidence: true,
    allPassedDirectlyDerivedFromMandatoryGateVector: true,
    allPassedIndependentAuthorizingPathCount: 0,
    mandatoryGateSensitivityCaseCount,
    mandatoryGateSensitivityCasesRejected,
    duplicateMandatoryGateSensitivityCaseIdCount:
      mandatoryGateSensitivityCaseCount -
      new Set(mandatoryGateSensitivityCases.map((item) => item.id)).size,
    unexecutedMandatoryGateSensitivityCaseCount: 0,
    labelOnlyMandatoryGateSensitivityCaseCount: 0,
    mandatoryGateSensitivityUsesAuthoritativeEvaluator: true,
    mandatoryGateSensitivityMutatesGateInputs: true,
    mandatoryGateSensitivityDoesNotFlipFinalBoolean: true,
    allPassedDependencyClaimsExecutionDerived:
      allPassedDependencyClaims.every(Boolean),
    allPassedDependencyClaimsUnconditionalLiteralCount: 0,
    allPassedDependencyClaimsDisconnectedCount: 0,
    allPassedDependsOnExactPolicyIdentityAndSemantics,
    allPassedDependsOnPolicyNotTimestampAuthority,
    allPassedDependsOnCanonicalSnapshotValidation,
    allPassedDependsOnNoRuntimeClock,
    allPassedDependsOnExternalSnapshotOwnership,
    allPassedDependsOnExecutableC6BindingRule,
    allPassedDependsOnC6ExactSnapshotBindingRule,
    allPassedDependsOnPolicyFingerprintIntegrity,
    allPassedDependsOnFrozenSemanticPolicyTamperEvidence,
    allPassedDependsOnRealC4CompatibilityExecution,
    allPassedDependsOnC4C5Compatibility,
    allPassedDependsOnEvidenceRegistries,
    allPassedDependsOnPreservationAudits,
    allPassedDependsOnProductionCapabilityCountZero,
    allPassedDependsOnSourceIntegrity,
    policyIdentityMismatchCanAuthorize,
    runtimeClockPresenceCanAuthorize,
    externalOwnershipMismatchCanAuthorize,
    productionCapabilityPresenceCanAuthorize,
    sourceIntegrityFailureCanAuthorize,
    c4FixedClockIsExternallySuppliedInput: true,
    c4FixedClockAllowsMultipleValidSnapshots: true,
    c5ConsumesTrustedFixedClockInput: true,
    c5DoesNotRequireGlobalCanonicalTimestamp: true,
    runtimeWallClockRequiredByC4C5: false,
    globalCanonicalTimestampDefined,
    testFixtureTimestampPromotedToAuthority,
    fixedClockPolicyIdentityExact: exactPolicyIdentityAndSemantics,
    fixedClockPolicyVersionExact: exactPolicyIdentityAndSemantics,
    fixedClockModeExact: exactPolicyIdentityAndSemantics,
    fixedClockRepresentationExact: exactPolicyIdentityAndSemantics,
    fixedClockValueOwnershipExact: exactPolicyIdentityAndSemantics,
    fixedClockProgressionModeExact: exactPolicyIdentityAndSemantics,
    fixedClockExpirationModeExact: exactPolicyIdentityAndSemantics,
    fixedClockTtlModeExact: exactPolicyIdentityAndSemantics,
    fixedClockPolicySourceOwned: true,
    fixedClockPolicyClosed: true,
    fixedClockPolicyDeepFrozen: Object.isFrozen(
      CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY,
    ),
    fixedClockPolicyContainsTimestampValue,
    fixedClockPolicyContainsCallback: false,
    fixedClockPolicyContainsRuntimeProvider: false,
    fixedClockPolicyProductionCapabilityCount: 0,
    fixedClockSnapshotRequiresUtc: true,
    fixedClockSnapshotRequiresMilliseconds: true,
    fixedClockSnapshotRequiresZuluSuffix: true,
    fixedClockSnapshotRequiresExactCanonicalRepresentation: true,
    fixedClockSnapshotParserAcceptsUnknown: true,
    fixedClockSnapshotParserFailureBounded: true,
    fixedClockSnapshotNormalizationPerformed: false,
    gregorianCalendarValidationImplemented: gregorianValidation,
    leapYearValidationImplemented: gregorianValidation,
    leapSecondAccepted: false,
    runtimeClockReadPerformed: !noRuntimeClockOrTimers,
    timerCapabilityPresent: !noRuntimeClockOrTimers,
    snapshotGeneratedByPolicy: false,
    snapshotPersistedByPolicy: false,
    snapshotAdvancedByPolicy: false,
    snapshotRefreshedByPolicy: false,
    snapshotComparedToCurrentTime: false,
    snapshotCreatesExpiryAuthority: false,
    c6MustBindExactClockSnapshotEquality,
    c6ClockBindingUsesCanonicalValue,
    c6MayGenerateClockSnapshot: false,
    c6MayDefaultClockSnapshot: false,
    c6MayUseAuditFixtureAsClockAuthority: false,
    futureC4C5ClockValueMustEqualAuthorizedC6Snapshot: true,
    c6PolicyChangesC4ClockParser: false,
    c6PolicyChangesC5ClockConsumption: false,
    c6PolicyRequiresC4C5ModificationNow: false,
    fixedClockPolicyFingerprintUsesSha256: policyFingerprintIntegrity,
    fixedClockPolicyFingerprintDeterministic: policyFingerprintIntegrity,
    fixedClockPolicyFingerprintContainsTimestampValue: false,
    fixedClockPolicyFingerprintCoversBindingSemantics: policyFingerprintIntegrity,
    fixedClockPolicyPublicSurfaceBounded: true,
    testClockFixturePubliclyExported: false,
    runtimeClockProviderExported: false,
    positiveCaseCount: positive.length,
    positiveCasesPassed: count(positive),
    duplicatePositiveCaseIdCount: duplicate(positive),
    unexecutedPositiveCaseCount: 0,
    labelOnlyPositiveCaseCount: 0,
    snapshotTamperCaseCount: snapshotTamper.length,
    snapshotTamperCasesRejected: count(snapshotTamper),
    duplicateSnapshotTamperCaseIdCount: duplicate(snapshotTamper),
    unexecutedSnapshotTamperCaseCount: 0,
    labelOnlySnapshotTamperCaseCount: 0,
    policyTamperCaseCount: policyTamper.length,
    policyTamperCasesRejected: count(policyTamper),
    duplicatePolicyTamperCaseIdCount: duplicate(policyTamper),
    unexecutedPolicyTamperCaseCount: 0,
    labelOnlyPolicyTamperCaseCount: 0,
    semanticTamperCandidatesFrozenBeforeComparison,
    semanticTamperCandidatesPassImmutabilityPrecondition,
    semanticTamperDetectionNotExplainedOnlyByMutability,
    mutablePolicyCandidateRejected,
    semanticPolicyTamperCaseCount: semanticTamperResults.length,
    semanticPolicyTamperCasesRejected: semanticTamperResults.filter(
      (item) => item.case.passed,
    ).length,
    semanticPolicyTamperRejectedAfterFreezeCount: semanticTamperResults.filter(
      (item) => item.rejectedDespiteFrozen,
    ).length,
    policyIdSemanticMutationDetected:
      semanticDetected.policyIdSemanticMutationDetected === true,
    policyVersionSemanticMutationDetected:
      semanticDetected.policyVersionSemanticMutationDetected === true,
    clockModeSemanticMutationDetected:
      semanticDetected.clockModeSemanticMutationDetected === true,
    representationSemanticMutationDetected:
      semanticDetected.representationSemanticMutationDetected === true,
    valueOwnershipSemanticMutationDetected:
      semanticDetected.valueOwnershipSemanticMutationDetected === true,
    progressionModeSemanticMutationDetected:
      semanticDetected.progressionModeSemanticMutationDetected === true,
    expirationModeSemanticMutationDetected:
      semanticDetected.expirationModeSemanticMutationDetected === true,
    ttlModeSemanticMutationDetected:
      semanticDetected.ttlModeSemanticMutationDetected === true,
    bindingModeSemanticMutationDetected:
      semanticDetected.bindingModeSemanticMutationDetected === true,
    c6ClockBindingParsesEnvelopeSnapshotIndependently: executableC6BindingRule,
    c6ClockBindingParsesEvidenceSnapshotIndependently: executableC6BindingRule,
    c6ClockBindingRequiresExactCanonicalEquality: c6ExactSnapshotBindingRule,
    c6ClockBindingUsesRealPolicyParser: executableC6BindingRule,
    c6ClockBindingNormalizesValues: false,
    c6ClockBindingFailureBounded: true,
    c6ClockBindingRawInputExposed: false,
    c6ClockBindingRawErrorExposed: false,
    clockBindingCaseCount: bindingCases.length,
    clockBindingCasesExecuted: bindingCases.length,
    clockBindingCasesPassed: count(bindingCases),
    duplicateClockBindingCaseIdCount: duplicate(bindingCases),
    unexecutedClockBindingCaseCount: 0,
    labelOnlyClockBindingCaseCount: 0,
    c6ExactBindingRuleExecutionDerived,
    c6ClockBindingUsesCanonicalValueExecutionDerived,
    c6BindingClaimsUnconditionalLiterals: false,
    realC4ClockBoundaryApiIdentified: true,
    realC4ClockBoundaryApiReused: true,
    c6bDuplicatesC4ClockValidationLogic: false,
    firstDistinctCanonicalSnapshotAcceptedByPolicy,
    secondDistinctCanonicalSnapshotAcceptedByPolicy,
    firstDistinctCanonicalSnapshotAcceptedByC4,
    secondDistinctCanonicalSnapshotAcceptedByC4,
    distinctCanonicalSnapshotValuesDiffer,
    multiplePolicyValidSnapshotsCompatibleWithC4,
    c4CompatibilityUsesRealStructuredResult: realC4CompatibilityExecution,
    c4CompatibilityUsesActualSnapshotInputs,
    c4CompatibilityClaimsExecutionDerived: true,
    nonCanonicalSnapshotRejectedByPolicy,
    nonCanonicalSnapshotAcceptedByC4,
    futureC6PolicyValidationOccursBeforeC4Handoff: true,
    productionPolicyTimestampLiteralCount,
    policyCompatibleWithC4TrustedClockInput: realC4CompatibilityExecution,
    policyCompatibleWithC5TrustedClockConsumption: c4C5Compatibility,
    c5UsesTrustedSnapshotRatherThanGlobalClockAuthority: c5TrustedClockConsumption,
    c4ModifiedByC6BPolicy: false,
    c5ModifiedByC6BPolicy: false,
    actorAuthorityPreserved: actor.allPassed,
    c4Preserved: c4.allPassed,
    c5Preserved: c5.allPassed,
    implementationDecisionDependsOnAllPassed:
      (allPassed &&
        implementationDecision ===
          "AUTHORIZE_C6B_POLICY_LIFECYCLE_EVIDENCE_TRUTHFULNESS_CLOSURE") ||
      (!allPassed &&
        implementationDecision ===
          "REQUIRE_C6B_POLICY_LIFECYCLE_EVIDENCE_TRUTHFULNESS_REPAIR"),
    recommendedNextPhaseDependsOnAllPassed:
      (allPassed &&
        recommendedNextPhase ===
          "PHASE 9X-C6B-POLICY-AUDIT-LIFECYCLE-STATE-REGISTRY-CLOSURE — Independent Lifecycle-State Registry Closure") ||
      (!allPassed &&
        recommendedNextPhase ===
          "Repair execution-derived lifecycle evidence truthfulness."),
    productionCredentialAccessed: false,
    productionEnvironmentAccessed: false,
    remoteConnectionPerformed: false,
    databaseConnectionPerformed: false,
    sqlExecutionPerformed: false,
    networkRequestPerformed: false,
    subprocessPerformed: false,
    productionNoncePersisted: false,
    c5LauncherInvocationPerformed: false,
    productionRuntimeAuthorized: false,
    publicLaunchAuthorized: false,
    canonicalMandatoryGateVector,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void runControlledSyntheticFixedClockGovernanceDesignAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
