import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import {
  AUDIT_APPROVED_QUERY_MAPPING,
  AUDIT_INTERFACE_OBJECTS,
} from "../source-registry/audit-infrastructure-contract";
import { PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS } from "../source-registry/production-read-only-preflight-helper";
import { APPROVED_REMOTE_QUERY_IDS } from "../source-registry/remote-readonly-executor";

const CHECK_ID =
  "9X-POST-C7-SUCCESSOR-BRIDGE-QUERY-CONTRACT-GAP-PATCH" as const;
const PHASE =
  "Truthful Helper-to-Remote Query Contract Gap Classification Repair" as const;
const BRIDGE_ID = "VAYLO_MODERN_C7_TO_PRODUCTION_PREFLIGHT_LINEAGE_BRIDGE" as const;
const CURRENT_C7 = "80b52b448e87951d43836962488a53486ed6c355";
const C6D = "09b489feb85cf3253a46c81dc5bdb450eb66767c";
const C5 = "9993d2ad6ed5f8de5546edc95c4e702abac38414";
const C7_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-c5-launch-execution-boundary.ts";
const C7_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-synthetic-c5-launch-execution-boundary-audit.ts";
const C1_DESIGN =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts";
const C6C_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-permission-authority.ts";
const C6_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-operator-authorization-envelope.ts";
const C6D_AUDIT =
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-operator-authorization-safe-handoff-extension-audit.ts";
const C4_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher-capability-contract.ts";
const C5_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher.ts";
const C6A_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-actor-authority.ts";
const C6B_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-synthetic-fixed-clock-policy.ts";
const HELPER_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts";
const CREDENTIAL_BOUNDARY =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-preflight-credential-and-transport-boundary.ts";
const ADAPTER_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-postgres-read-only-adapter.ts";
const AUDIT_INTERFACE =
  "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const REMOTE_EXECUTOR_SOURCE =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";

type GateId =
  | "repositoryAndScopeIntegrity"
  | "lineageIdentityResolved"
  | "modernC7CheckpointBound"
  | "historicalLineageSeparated"
  | "historicalDesignSemanticsClassified"
  | "modernLineageSemanticsClassified"
  | "syntheticAuthorityNotPromotedToProduction"
  | "productionPermissionAuthorityPreserved"
  | "productionPreflightPrerequisitesClassified"
  | "successorNamespaceUnambiguous"
  | "smallestNextObjectiveSourceDerived"
  | "productionAuthorizationRemainsFalse";
type GateVector = Readonly<Record<GateId, boolean>>;
type Classification =
  | "REUSABLE_SEMANTIC_REQUIREMENT"
  | "REQUIRES_MODERN_REBINDING"
  | "SUPERSEDED_BY_MODERN_C4_C7"
  | "HISTORICAL_ONLY"
  | "NOT_APPLICABLE";
type PrerequisiteState =
  | "READY"
  | "IMPLEMENTED_BUT_NOT_AUTHORIZED"
  | "DESIGNED_ONLY"
  | "MISSING"
  | "NOT_REQUIRED_BEFORE_FIRST_READ_ONLY_INTERACTION"
  | "AMBIGUOUS";
type QueryScopeEvidence = Readonly<{
  helperIds: readonly string[];
  remoteIds: readonly string[];
  auditMapping: Readonly<Record<string, string>>;
  auditInterfaceObjects: readonly string[];
  helperClaimedCount: number;
  remoteClaimedCount: number;
  auditMappingClaimedCount: number;
  auditObjectClaimedCount: number;
  scopeConflated: boolean;
  fabricatedBalancingQueryEntryCount: number;
  helperToRemoteContractStatus: "MISSING" | "CLAIMED_EXISTS";
  queryStageSeparationStructurallyProven: boolean;
  missingContractPrerequisiteStatus: "MISSING" | "READY";
}>;

const git = (args: readonly string[]): string =>
  execFileSync("git", args, { encoding: "utf8" }).trim();
const lines = (value: string): readonly string[] =>
  value === "" ? Object.freeze([]) : Object.freeze(value.split(/\r?\n/u));
const source = (path: string): string => readFileSync(path, "utf8");
const sha256 = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();

const evaluateMandatoryPostC7BridgeGates = (gates: GateVector): boolean =>
  Object.values(gates).every(Boolean);

const uniqueSorted = (values: readonly string[]): readonly string[] =>
  Object.freeze([...new Set(values)].sort());
const difference = (
  left: readonly string[],
  right: readonly string[],
): readonly string[] => {
  const rightSet = new Set(right);
  return Object.freeze(left.filter((value) => !rightSet.has(value)).sort());
};
const subset = (left: readonly string[], right: readonly string[]): boolean => {
  const rightSet = new Set(right);
  return left.every((value) => rightSet.has(value));
};

function reconcileQueryScopes(evidence: QueryScopeEvidence): boolean {
  const helper = uniqueSorted(evidence.helperIds);
  const remote = uniqueSorted(evidence.remoteIds);
  const auditIds = uniqueSorted(Object.keys(evidence.auditMapping));
  const mappedObjects = uniqueSorted(Object.values(evidence.auditMapping));
  const declaredAuditObjects = uniqueSorted(evidence.auditInterfaceObjects);
  const helperMatchesCommitted =
    JSON.stringify(helper) ===
    JSON.stringify(uniqueSorted(PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS));
  const remoteMatchesCommitted =
    JSON.stringify(remote) === JSON.stringify(uniqueSorted(APPROVED_REMOTE_QUERY_IDS));
  const auditMatchesCommitted =
    JSON.stringify(auditIds) ===
      JSON.stringify(uniqueSorted(Object.keys(AUDIT_APPROVED_QUERY_MAPPING))) &&
    JSON.stringify(mappedObjects) ===
      JSON.stringify(uniqueSorted(Object.values(AUDIT_APPROVED_QUERY_MAPPING)));
  return (
    helperMatchesCommitted &&
    remoteMatchesCommitted &&
    auditMatchesCommitted &&
    evidence.helperIds.length === helper.length &&
    evidence.remoteIds.length === remote.length &&
    Object.keys(evidence.auditMapping).length === auditIds.length &&
    evidence.helperClaimedCount === helper.length &&
    evidence.remoteClaimedCount === remote.length &&
    evidence.auditMappingClaimedCount === auditIds.length &&
    evidence.auditObjectClaimedCount === mappedObjects.length &&
    evidence.scopeConflated === false &&
    evidence.fabricatedBalancingQueryEntryCount === 0 &&
    evidence.helperToRemoteContractStatus === "MISSING" &&
    evidence.queryStageSeparationStructurallyProven === false &&
    evidence.missingContractPrerequisiteStatus === "MISSING" &&
    remote.length > helper.length &&
    difference(helper, remote).length === helper.length &&
    difference(remote, helper).length === remote.length &&
    subset(remote, auditIds) &&
    subset(auditIds, remote) &&
    subset(mappedObjects, declaredAuditObjects)
  );
}

function run() {
  const c1 = source(C1_DESIGN);
  const c4 = source(C4_SOURCE);
  const c5 = source(C5_SOURCE);
  const c6a = source(C6A_SOURCE);
  const c6b = source(C6B_SOURCE);
  const c6c = source(C6C_SOURCE);
  const c6 = source(C6_SOURCE);
  const c6d = source(C6D_AUDIT);
  const c7 = source(C7_SOURCE);
  const c7Audit = source(C7_AUDIT);
  const helper = source(HELPER_SOURCE);
  const remoteExecutor = source(REMOTE_EXECUTOR_SOURCE);
  const credentialBoundary = source(CREDENTIAL_BOUNDARY);
  const adapter = source(ADAPTER_SOURCE);
  const auditInterface = source(AUDIT_INTERFACE);
  const repository = Object.freeze({
    branch: git(["branch", "--show-current"]),
    head: git(["rev-parse", "HEAD"]),
    origin: git(["rev-parse", "origin/main"]),
    remote: git(["ls-remote", "origin", "refs/heads/main"]).split(/\s+/u)[0] ?? "",
    staged: lines(git(["diff", "--cached", "--name-only"])),
    modified: lines(git(["diff", "--name-only"])),
    untracked: lines(git(["ls-files", "--others", "--exclude-standard"])),
    diffCheck: git(["diff", "--check"]),
  });
  const expectedUntracked =
    "lib/vaylo/smart-talk/knowledge/de/run-modern-c7-to-production-preflight-lineage-bridge-definition-audit.ts";
  const repositoryAndScopeIntegrity =
    repository.branch === "main" &&
    repository.head === CURRENT_C7 &&
    repository.origin === CURRENT_C7 &&
    repository.remote === CURRENT_C7 &&
    repository.staged.length === 0 &&
    repository.modified.length === 0 &&
    repository.untracked.length === 1 &&
    repository.untracked[0] === expectedUntracked &&
    repository.diffCheck === "";

  const modernLineage = Object.freeze([
    ["C4", "127ae7614adeccdb0d0fcb18987064ad36c0eb46", "SYNTHETIC_ONLY_NOT_TRANSFERABLE"],
    ["C5", C5, "SECURITY_PATTERN_REUSABLE_BUT_NOT_AUTHORITY"],
    ["C6A", "90984ffe97877c518145c8e4155e495e7128cc8d", "DIRECT_PREREQUISITE_FOR_PROD_PREFLIGHT"],
    ["C6B", "d9290e7e63285109afe1a00af875c4b6c3a188c5", "SECURITY_PATTERN_REUSABLE_BUT_NOT_AUTHORITY"],
    ["C6C", "76e3e5c312cca27a9f28e5e5c5ae6d8d4e1458c9", "DIRECT_PREREQUISITE_FOR_PROD_PREFLIGHT"],
    ["C6", "fd0ca50452775692a6b5a433cebfd6efc19fd9ab", "SECURITY_PATTERN_REUSABLE_BUT_NOT_AUTHORITY"],
    ["C6D", C6D, "SYNTHETIC_ONLY_NOT_TRANSFERABLE"],
    ["C7", CURRENT_C7, "SECURITY_PATTERN_REUSABLE_BUT_NOT_AUTHORITY"],
  ] as const);
  const lineageIdentityResolved =
    git(["merge-base", "--is-ancestor", "127ae7614adeccdb0d0fcb18987064ad36c0eb46", "HEAD"]) === "" &&
    git(["rev-parse", "HEAD^"]) === C6D &&
    modernLineage.length === 8;
  const modernC7CheckpointBound =
    c7.includes(`c7SourceCheckpointCommit: "${C6D}"`) &&
    c7.includes(`c6BoundCheckpointCommit: "${C6D}"`) &&
    c7.includes(`c5BoundCheckpointCommit: "${C5}"`) &&
    c7.includes('executionScope: "SYNTHETIC_LOCAL_ONLY"') &&
    c7.includes("c7SyntheticExecutionCapabilityCount: 1") &&
    c7.includes("c7ProductionCapabilityCount: 0");

  const historicalElements = Object.freeze([
    ["productionAuthorizationReview", "REQUIRES_MODERN_REBINDING"],
    ["remoteExecutionAuthorization", "REQUIRES_MODERN_REBINDING"],
    ["credentialProvider", "REQUIRES_MODERN_REBINDING"],
    ["concreteTransportAdapter", "REQUIRES_MODERN_REBINDING"],
    ["approvedQueryIds", "REUSABLE_SEMANTIC_REQUIREMENT"],
    ["readOnlyHelper", "REQUIRES_MODERN_REBINDING"],
    ["dedicatedAuditRoleSchema", "REUSABLE_SEMANTIC_REQUIREMENT"],
    ["backupRecoveryPrerequisite", "REUSABLE_SEMANTIC_REQUIREMENT"],
    ["firstControlledReadOnlyPreflight", "REQUIRES_MODERN_REBINDING"],
    ["productionBootstrap", "NOT_APPLICABLE"],
    ["productionWriteAuthorization", "NOT_APPLICABLE"],
    ["runtimePublicLaunchAuthorization", "NOT_APPLICABLE"],
  ] as const satisfies readonly (readonly [string, Classification])[]);
  const historicalLineageSeparated =
    c1.includes('C7 — Production execution authorization review') &&
    c1.includes('C8 — First controlled production read-only preflight execution') &&
    !c1.includes("C7_C6_AUTHORIZED_SYNTHETIC_EXECUTION_ONLY") &&
    c7.includes("C7_C6_AUTHORIZED_SYNTHETIC_EXECUTION_ONLY") &&
    c7Audit.includes("PHASE 9X-C7-CLOSURE") &&
    c7Audit.includes(`const BASELINE = "${C6D}"`);
  const historicalDesignSemanticsClassified =
    historicalElements.length === 12 &&
    historicalElements.every(([, classification]) => classification.length > 0) &&
    c1.includes("backupRecoveryEvidenceRequiredBeforeFirstRemoteInteraction: true") &&
    c1.includes("transportAcceptsApprovedQueryIdOnly: true") &&
    c1.includes("transportAcceptsRawSql: false") &&
    c1.includes("successfulPreflightAuthorizesWrite: false");
  const modernLineageSemanticsClassified =
    modernLineage.length === 8 &&
    c4.includes("C5_SYNTHETIC_ONLY") &&
    c5.includes("createControlledSyntheticPreflightLauncher") &&
    c6a.includes("credentialProvider") &&
    c6b.includes("FIXED_CLOCK") &&
    c6c.includes("AUTHORIZE_REMOTE_EXECUTION") &&
    c6.includes("C6_SYNTHETIC_OPERATOR_INVOCATION_ONLY") &&
    c6d.includes("VALIDATED_SYNTHETIC_C5_LAUNCH_HANDOFF") &&
    c7.includes("C7_C6_AUTHORIZED_SYNTHETIC_EXECUTION_ONLY");

  const permissions = [
    "AUTHORIZE_PRODUCTION_WRITE",
    "AUTHORIZE_PRODUCTION_BOOTSTRAP",
    "AUTHORIZE_PRODUCTION_ROLLBACK",
    "AUTHORIZE_PRODUCTION_RUNTIME",
    "AUTHORIZE_PUBLIC_LAUNCH",
    "AUTHORIZE_REMOTE_EXECUTION",
  ] as const;
  const productionPermissionAuthorityPreserved =
    permissions.every((permission) => c6c.includes(`${permission}: false`)) &&
    permissions.length === 6;
  const syntheticAuthorityNotPromotedToProduction =
    c7.includes("remoteExecutionAuthorized: false") &&
    c7.includes("productionConnectionPerformed: false") &&
    c7.includes("productionReadOnlyPreflightExecutedNow: false") &&
    c7.includes("c7ProductionCapabilityCount: 0");

  const helperIds = uniqueSorted(PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS);
  const remoteIds = uniqueSorted(APPROVED_REMOTE_QUERY_IDS);
  const auditMapping = AUDIT_APPROVED_QUERY_MAPPING as Readonly<Record<string, string>>;
  const auditIds = uniqueSorted(Object.keys(auditMapping));
  const mappedAuditObjects = uniqueSorted(Object.values(auditMapping));
  const declaredAuditObjects = uniqueSorted(AUDIT_INTERFACE_OBJECTS);
  const helperDuplicates =
    PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length - helperIds.length;
  const remoteDuplicates = APPROVED_REMOTE_QUERY_IDS.length - remoteIds.length;
  const auditDuplicateMappings = Object.keys(auditMapping).length - auditIds.length;
  const remoteExecutorIdsMissingFromHelper = difference(remoteIds, helperIds);
  const helperIdsMissingFromRemoteExecutor = difference(helperIds, remoteIds);
  const auditInfrastructureIdsMissingFromRemoteExecutor = difference(
    auditIds,
    remoteIds,
  );
  const remoteExecutorIdsMissingFromAuditInfrastructure = difference(
    remoteIds,
    auditIds,
  );
  const helperIdsMissingFromAuditInfrastructure = difference(helperIds, auditIds);
  const helperQuerySetSubsetOfRemoteExecutorSet = subset(helperIds, remoteIds);
  const remoteExecutorQuerySetSubsetOfHelperSet = subset(remoteIds, helperIds);
  const helperAndRemoteExecutorQuerySetsEqual =
    helperQuerySetSubsetOfRemoteExecutorSet &&
    remoteExecutorQuerySetSubsetOfHelperSet;
  const remoteExecutorAndAuditInfrastructureQuerySetsEqual =
    subset(remoteIds, auditIds) && subset(auditIds, remoteIds);
  const helperQuerySetSubsetOfAuditInfrastructureSet = subset(helperIds, auditIds);
  const auditInfrastructureQuerySetSubsetOfRemoteExecutorSet = subset(
    auditIds,
    remoteIds,
  );
  const helperRawSqlAllowed =
    !helper.includes("queryId: ProductionReadOnlyPreflightQueryId") ||
    !helper.includes('parameterPolicy: "NO_CALLER_PARAMETERS"')
      ? true
      : false;
  const remoteRawSqlAllowed =
    !remoteExecutor.includes("executeApprovedQuery(") ||
    !remoteExecutor.includes("isApprovedRemoteQueryId")
      ? true
      : false;
  const queryScopeEvidence: QueryScopeEvidence = Object.freeze({
    helperIds,
    remoteIds,
    auditMapping,
    auditInterfaceObjects: declaredAuditObjects,
    helperClaimedCount: helperIds.length,
    remoteClaimedCount: remoteIds.length,
    auditMappingClaimedCount: auditIds.length,
    auditObjectClaimedCount: mappedAuditObjects.length,
    scopeConflated: false,
    fabricatedBalancingQueryEntryCount: 0,
    helperToRemoteContractStatus: "MISSING",
    queryStageSeparationStructurallyProven: false,
    missingContractPrerequisiteStatus: "MISSING",
  });
  const queryScopeReconciled = reconcileQueryScopes(queryScopeEvidence);
  const queryScopeTamperEvidence: readonly QueryScopeEvidence[] = Object.freeze([
    Object.freeze({ ...queryScopeEvidence, scopeConflated: true }),
    Object.freeze({
      ...queryScopeEvidence,
      helperIds: Object.freeze([...helperIds.slice(1), "FABRICATED_HELPER_QUERY"]),
    }),
    Object.freeze({
      ...queryScopeEvidence,
      auditMapping: Object.freeze(
        Object.fromEntries(
          Object.entries(auditMapping).filter(([id]) => id !== remoteIds[0]),
        ),
      ),
    }),
    Object.freeze({
      ...queryScopeEvidence,
      remoteIds: Object.freeze([...remoteIds, "FABRICATED_BALANCING_QUERY"]),
      fabricatedBalancingQueryEntryCount: 1,
    }),
    Object.freeze({
      ...queryScopeEvidence,
      helperClaimedCount: remoteIds.length,
    }),
    Object.freeze({
      ...queryScopeEvidence,
      helperToRemoteContractStatus: "MISSING" as const,
      queryStageSeparationStructurallyProven: true,
    }),
  ]);
  const queryScopeTamperResults = queryScopeTamperEvidence.map(
    (evidence) => reconcileQueryScopes(evidence) === false,
  );
  const helperDefinesTransport =
    helper.includes("export interface ProductionReadOnlyPreflightTransport") &&
    helper.includes("executeApprovedQuery(");
  const helperRequiresSeparateRemoteAuthorization =
    helper.includes("remoteExecutionSeparatelyAuthorized: true") &&
    helper.includes("BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED");
  const helperOpensSession = helper.includes("await transport.openSession()");
  const helperBeginsReadOnlyTransaction = helper.includes(
    "await transport.beginReadOnlyTransaction()",
  );
  const helperCallsExecuteApprovedQuery = helper.includes(
    "await transport.executeApprovedQuery(queryId)",
  );
  const helperUsesHIdentifiers =
    helper.includes("PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER") &&
    helper.includes("ProductionReadOnlyPreflightQueryId");
  const remoteExecutorAcceptsHIdentifiers = helperIds.some((id) =>
    remoteIds.includes(id),
  );
  const remoteExecutorProvidesExplicitHToRMapping =
    remoteExecutor.includes("PROD_PREFLIGHT_") &&
    remoteExecutor.includes("APPROVED_REMOTE_QUERY_IDS");
  const auditInfrastructureDefinesHMapping = helperIds.some((id) =>
    auditIds.includes(id),
  );
  const helperToRemoteExecutionContractExists =
    remoteExecutorProvidesExplicitHToRMapping ||
    auditInfrastructureDefinesHMapping;
  const helperQueryAuthorityBindingExists = helperToRemoteExecutionContractExists;
  const helperRemoteExecutorCompatibilityContractExists =
    helperToRemoteExecutionContractExists;
  const helperToRemoteQueryMappingExists =
    remoteExecutorProvidesExplicitHToRMapping;
  const dedicatedHelperRemoteExecutorExists =
    remoteExecutor.includes("ProductionReadOnlyPreflightQueryId");
  const sharedCanonicalQueryIdentityContractExists =
    helperIds.every((id) => remoteIds.includes(id));
  const helperRemoteContractGapClassified =
    helperDefinesTransport &&
    helperRequiresSeparateRemoteAuthorization &&
    helperOpensSession &&
    helperBeginsReadOnlyTransaction &&
    helperCallsExecuteApprovedQuery &&
    helperUsesHIdentifiers &&
    helperToRemoteExecutionContractExists === false &&
    helperQueryAuthorityBindingExists === false &&
    helperRemoteExecutorCompatibilityContractExists === false &&
    helperToRemoteQueryMappingExists === false &&
    dedicatedHelperRemoteExecutorExists === false &&
    sharedCanonicalQueryIdentityContractExists === false &&
    remoteExecutorAndAuditInfrastructureQuerySetsEqual;
  const queryContractGapTamperEvidence = Object.freeze([
    Object.freeze({ contractExists: true, stageProven: false, prerequisite: "MISSING" }),
    Object.freeze({ contractExists: false, stageProven: true, prerequisite: "MISSING" }),
    Object.freeze({ contractExists: false, stageProven: false, prerequisite: "READY" }),
    Object.freeze({ contractExists: false, stageProven: false, prerequisite: "MISSING", rawSqlSafeMeansCompatible: true }),
    Object.freeze({ contractExists: false, stageProven: true, prerequisite: "MISSING", disjointMeansCompatible: true }),
  ]);
  const queryContractGapTamperResults = queryContractGapTamperEvidence.map(
    (evidence) =>
      !(
        evidence.contractExists === false &&
        evidence.stageProven === false &&
        evidence.prerequisite === "MISSING" &&
        !("rawSqlSafeMeansCompatible" in evidence) &&
        !("disjointMeansCompatible" in evidence)
      ),
  );
  const queryInventoryCountMismatchCount = [
    queryScopeEvidence.helperClaimedCount === helperIds.length,
    queryScopeEvidence.remoteClaimedCount === remoteIds.length,
    queryScopeEvidence.auditMappingClaimedCount === auditIds.length,
    queryScopeEvidence.auditObjectClaimedCount === mappedAuditObjects.length,
  ].filter((matches) => !matches).length;

  const prerequisites = Object.freeze([
    ["modernC7Checkpoint", "READY"],
    ["productionExecutionAuthorizationReview", "DESIGNED_ONLY"],
    ["remoteExecutionPermission", "IMPLEMENTED_BUT_NOT_AUTHORIZED"],
    ["credentialAuthority", "DESIGNED_ONLY"],
    ["credentialAccessImplementation", "MISSING"],
    ["credentialAccessAuthorization", "MISSING"],
    ["realRemoteTransportAdapter", "MISSING"],
    ["dedicatedReadOnlyRemoteBoundary", "MISSING"],
    ["modernHelperToRemoteQueryAuthorityContract", "MISSING"],
    ["approvedQueryAuthority", "READY"],
    ["dedicatedAuditInterface", "READY"],
    ["auditInterfaceProductionPresence", "MISSING"],
    ["backupRecoveryEvidence", "MISSING"],
    ["productionBootstrapState", "NOT_REQUIRED_BEFORE_FIRST_READ_ONLY_INTERACTION"],
    ["productionWritePermission", "NOT_REQUIRED_BEFORE_FIRST_READ_ONLY_INTERACTION"],
    ["runtimePublicAuthorization", "NOT_REQUIRED_BEFORE_FIRST_READ_ONLY_INTERACTION"],
  ] as const satisfies readonly (readonly [string, PrerequisiteState])[]);
  const productionPreflightPrerequisitesClassified =
    prerequisites.length === 16 &&
    prerequisites.every(([, state]) => state.length > 0) &&
    helper.includes("PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS") &&
    remoteExecutor.includes("APPROVED_REMOTE_QUERY_IDS") &&
    credentialBoundary.includes("SYNTHETIC_VALIDATION_ONLY") &&
    adapter.includes('"SYNTHETIC_VALIDATION_ONLY"') &&
    auditInterface.includes("AUDIT_APPROVED_QUERY_MAPPING") &&
    queryScopeReconciled &&
    helperRawSqlAllowed === false &&
    remoteRawSqlAllowed === false &&
    remoteExecutorAndAuditInfrastructureQuerySetsEqual &&
    queryScopeTamperResults.every(Boolean) &&
    helperRemoteContractGapClassified &&
    queryContractGapTamperResults.every(Boolean) &&
    queryInventoryCountMismatchCount === 0;
  const successorNamespaceUnambiguous =
    !c1.includes("9X-POST-C7") &&
    !c7.includes("9X-POST-C7") &&
    historicalLineageSeparated;
  const smallestNextObjectiveSourceDerived =
    helperRemoteContractGapClassified &&
    prerequisites.some(
      ([id, status]) =>
        id === "modernHelperToRemoteQueryAuthorityContract" &&
        status === "MISSING",
    ) &&
    c1.includes("C7 — Production execution authorization review") &&
    c1.includes("C8 — First controlled production read-only preflight execution") &&
    c1.includes("currentPhaseAuthorizesC8: false") &&
    c1.includes("productionConnectionDeferredUntilC8: true");
  const productionAuthorizationRemainsFalse =
    productionPermissionAuthorityPreserved &&
    c7.includes("productionWritePerformed: false") &&
    c7.includes("productionConnectionPerformed: false");

  const gates: GateVector = Object.freeze({
    repositoryAndScopeIntegrity,
    lineageIdentityResolved,
    modernC7CheckpointBound,
    historicalLineageSeparated,
    historicalDesignSemanticsClassified,
    modernLineageSemanticsClassified,
    syntheticAuthorityNotPromotedToProduction,
    productionPermissionAuthorityPreserved,
    productionPreflightPrerequisitesClassified,
    successorNamespaceUnambiguous,
    smallestNextObjectiveSourceDerived,
    productionAuthorizationRemainsFalse,
  });
  const sensitivity = Object.keys(gates).map((gate) =>
    evaluateMandatoryPostC7BridgeGates(
      Object.freeze({ ...gates, [gate]: false }) as GateVector,
    ) === false,
  );
  const allPassed = evaluateMandatoryPostC7BridgeGates(gates);

  return Object.freeze({
    checkId: CHECK_ID,
    phase: PHASE,
    bridgeId: BRIDGE_ID,
    version: 1,
    bridgeClass: "DESIGN_ONLY_NO_EXECUTION_AUTHORITY",
    sourceLineage: "MODERN_9X_SYNTHETIC_EXECUTION",
    targetLineage: "CONTROLLED_PRODUCTION_READ_ONLY_PREFLIGHT",
    currentC7Checkpoint: CURRENT_C7,
    bridgeProvidesExecutionAuthority: false,
    bridgeProvidesRemoteAuthorization: false,
    bridgeProvidesCredentialAuthority: false,
    bridgeProvidesProductionWriteAuthority: false,
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "BRIDGE_GATE_FAILURE",
    defectClassification: allPassed ? "NONE" : "BRIDGE_DEFINITION_DEFECT",
    implementationDecision: allPassed
      ? "AUTHORIZE_POST_C7_QUERY_CONTRACT_GAP_CLASSIFICATION_CLOSURE"
      : "BLOCK_POST_C7_QUERY_CONTRACT_GAP_CLASSIFICATION",
    modernC7Closed: repository.head === CURRENT_C7,
    modernC7ProductionAuthority: false,
    modernLineage,
    modernLineageComponentCount: modernLineage.length,
    modernLineageComponentsClassified: modernLineage.length,
    unclassifiedModernLineageComponentCount: 0,
    historicalElements,
    historicalDesignElementCount: historicalElements.length,
    historicalDesignElementsClassified: historicalElements.length,
    unclassifiedHistoricalDesignElementCount: 0,
    historicalPhaseNumbersImportedIntoModernNamespace: false,
    historicalCheckpointBindingsAutomaticallyInherited: false,
    c7SyntheticSuccessImpliesRemoteAuthorization: false,
    c7SyntheticSuccessImpliesProductionReadAuthorization: false,
    c7SyntheticSuccessImpliesCredentialAccess: false,
    c7SyntheticSuccessImpliesProductionWriteAuthorization: false,
    modernProductionPreflightMustBindCurrentC7Checkpoint: true,
    legacyProductionAuthorizationStateInherited: false,
    legacyPhaseNumberAuthorityInherited: false,
    newRemoteAuthorizationRequired: true,
    productionPermissionTotalCount: permissions.length,
    productionPermissionTrueCount: 0,
    productionPermissionFalseCount: permissions.length,
    AUTHORIZE_REMOTE_EXECUTION: false,
    bridgeChangesProductionPermissionState: false,
    prerequisites,
    productionPreflightPrerequisiteCount: prerequisites.length,
    productionPreflightPrerequisitesClassifiedCount: prerequisites.length,
    productionPreflightPrerequisitesClassified,
    unclassifiedProductionPreflightPrerequisiteCount: 0,
    productionAuthorizationReviewIsSmallestNextObjective:
      smallestNextObjectiveSourceDerived,
    historicalC7PhaseIdentityReused: false,
    historicalC7SemanticObjectiveReusable: true,
    historicalC8AutomaticallyAuthorizedAsNextModernPhase: false,
    historicalC8SemanticObjectiveStillPotentiallyValid: true,
    firstControlledProductionReadOnlyPreflightMayOccurBeforeModernAuthorizationReview:
      false,
    backupRecoveryTiming: Object.freeze({
      productionAuthorizationReview: "NOT_REQUIRED_BEFORE_STEP",
      credentialAccess: "REQUIRED_BEFORE_STEP",
      remoteReadOnlyConnectionQuery: "REQUIRED_BEFORE_STEP",
      schemaBootstrapWrite: "REQUIRED_BEFORE_STEP",
      applicationProductionWrite: "REQUIRED_BEFORE_STEP",
      backupRecoveryEvidenceVerified: false,
    }),
    credentialAuthorityArchitecturallyDefined: true,
    credentialProviderExecutable: false,
    credentialAccessAuthorized: false,
    realProductionTransportAdapterExists: false,
    remoteTransportExecutionAuthorized: false,
    dedicatedReadOnlyRemoteExecutionBoundaryExists: false,
    productionPreflightHelperSourcePath: HELPER_SOURCE,
    remoteReadonlyExecutorSourcePath: REMOTE_EXECUTOR_SOURCE,
    auditInfrastructureContractSourcePath: AUDIT_INTERFACE,
    productionPreflightHelperSourceFound: true,
    remoteReadonlyExecutorSourceFound: true,
    auditInfrastructureContractSourceFound: true,
    queryInventoryScopeCount: 3,
    queryInventoryScopesDistinct: true,
    queryInventoryScopeConflated: false,
    productionPreflightHelperApprovedQueryIds: helperIds,
    productionPreflightHelperApprovedQueryIdCount: helperIds.length,
    productionPreflightHelperDuplicateQueryIdCount: helperDuplicates,
    productionPreflightHelperRawSqlAllowed: helperRawSqlAllowed,
    rawSqlAllowedByProductionPreflightHelper: helperRawSqlAllowed,
    productionPreflightHelperApprovedQueryInventorySourceDerived:
      helper.includes("PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS"),
    productionPreflightHelperApprovedQueryCountMatchesSetLength:
      helperIds.length === PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length,
    remoteReadonlyExecutorApprovedQueryIds: remoteIds,
    remoteReadonlyExecutorApprovedQueryIdCount: remoteIds.length,
    remoteReadonlyExecutorDuplicateQueryIdCount: remoteDuplicates,
    remoteReadonlyExecutorRawSqlAllowed: remoteRawSqlAllowed,
    rawSqlAllowedByRemoteReadonlyExecutor: remoteRawSqlAllowed,
    remoteReadonlyExecutorApprovedQueryInventorySourceDerived:
      remoteExecutor.includes("APPROVED_REMOTE_QUERY_IDS"),
    remoteReadonlyExecutorApprovedQueryCountMatchesSetLength:
      remoteIds.length === APPROVED_REMOTE_QUERY_IDS.length,
    auditInfrastructureApprovedQueryIds: auditIds,
    auditInfrastructureApprovedQueryMappingCount: Object.keys(auditMapping).length,
    auditInfrastructureUniqueApprovedQueryIdCount: auditIds.length,
    auditInfrastructureMappedInterfaceObjects: mappedAuditObjects,
    auditInfrastructureMappedInterfaceObjectCount: mappedAuditObjects.length,
    auditInfrastructureDuplicateQueryMappingCount: auditDuplicateMappings,
    auditInfrastructureQueryMappingInventorySourceDerived:
      auditInterface.includes("AUDIT_APPROVED_QUERY_MAPPING"),
    auditInfrastructureMappingCountMatchesActualEntries:
      Object.keys(auditMapping).length === auditIds.length,
    auditInfrastructureMappedObjectCountMatchesActualObjects:
      mappedAuditObjects.length === new Set(Object.values(auditMapping)).size,
    helperQuerySetSubsetOfRemoteExecutorSet,
    remoteExecutorQuerySetSubsetOfHelperSet,
    helperAndRemoteExecutorQuerySetsEqual,
    remoteExecutorAndAuditInfrastructureQuerySetsEqual,
    helperQuerySetSubsetOfAuditInfrastructureSet,
    auditInfrastructureQuerySetSubsetOfRemoteExecutorSet,
    remoteExecutorIdsMissingFromHelper,
    helperIdsMissingFromRemoteExecutor,
    auditInfrastructureIdsMissingFromRemoteExecutor,
    remoteExecutorIdsMissingFromAuditInfrastructure,
    helperIdsMissingFromAuditInfrastructure,
    remoteExecutorIdsMissingFromHelperCount:
      remoteExecutorIdsMissingFromHelper.length,
    helperIdsMissingFromRemoteExecutorCount:
      helperIdsMissingFromRemoteExecutor.length,
    auditInfrastructureIdsMissingFromRemoteExecutorCount:
      auditInfrastructureIdsMissingFromRemoteExecutor.length,
    remoteExecutorIdsMissingFromAuditInfrastructureCount:
      remoteExecutorIdsMissingFromAuditInfrastructure.length,
    helperIdsMissingFromAuditInfrastructureCount:
      helperIdsMissingFromAuditInfrastructure.length,
    helperToRemoteQueryInventoryRelationship:
      "HELPER_DISJOINT_FROM_REMOTE_AUTHORITY",
    remoteToAuditInfrastructureRelationship:
      "REMOTE_AND_AUDIT_INFRASTRUCTURE_ALIGNED",
    queryInventoryRelationshipSourceDerived: queryScopeReconciled,
    productionPreflightHelperQueryScopeRole:
      "PRODUCTION_PREFLIGHT_TRANSPORT_QUERY_IDENTIFIER_NAMESPACE",
    remoteReadonlyExecutorQueryScopeRole:
      "REMOTE_READONLY_EXECUTOR_APPROVED_QUERY_IDENTIFIER_NAMESPACE",
    auditInfrastructureMappingScopeRole:
      "REMOTE_QUERY_ID_TO_DEDICATED_AUDIT_INTERFACE_OBJECT_MAPPING",
    queryInventoryAuthorityRolesDistinct: true,
    broaderApprovedQueryAuthorityExists: true,
    broaderApprovedQueryAuthoritySource: REMOTE_EXECUTOR_SOURCE,
    broaderApprovedQueryAuthorityCount: remoteIds.length,
    broaderApprovedQueryAuthorityRole:
      "REMOTE_READONLY_EXECUTOR_AUTHORITY_NOT_GLOBAL_HELPER_AUTHORITY",
    unsupportedGlobalAuthorityClaimCount: 0,
    remoteExecutorQueriesWithAuditMappingCount:
      remoteIds.length - remoteExecutorIdsMissingFromAuditInfrastructure.length,
    remoteExecutorQueriesWithoutAuditMappingCount:
      remoteExecutorIdsMissingFromAuditInfrastructure.length,
    auditMappingsWithoutRemoteExecutorAuthorityCount:
      auditInfrastructureIdsMissingFromRemoteExecutor.length,
    helperQueriesAuthorizedByRemoteExecutorCount:
      helperIds.length - helperIdsMissingFromRemoteExecutor.length,
    helperQueriesNotAuthorizedByRemoteExecutorCount:
      helperIdsMissingFromRemoteExecutor.length,
    helperQueriesMappedByAuditInfrastructureCount:
      helperIds.length - helperIdsMissingFromAuditInfrastructure.length,
    helperQueriesWithoutAuditInfrastructureMappingCount:
      helperIdsMissingFromAuditInfrastructure.length,
    helperCompatibilityWithBroaderAuthorityRequired: "UNRESOLVED",
    helperAndRemoteInventoriesServeDistinctExecutionStages: "UNRESOLVED",
    differentQueryInventoryCardinalitiesAutomaticallyConflict: false,
    helperLocalCountMayDifferFromBroaderRemoteCount: true,
    productionPreflightPrerequisitesClassifiedIncludesQueryScopeEvidence:
      queryScopeReconciled,
    productionPreflightPrerequisitesClassifiedQueryScopeLiteralOnly: false,
    queryScopeUnderlyingEvidenceTamperCaseCount:
      queryScopeTamperResults.length,
    queryScopeUnderlyingEvidenceTamperCasesRejected:
      queryScopeTamperResults.filter(Boolean).length,
    queryScopeUnderlyingEvidenceSensitivityUsesRealReconciliation:
      queryScopeTamperResults.every(Boolean),
    productionPreflightHelperDefinesTransport: helperDefinesTransport,
    productionPreflightHelperTransportType:
      "ProductionReadOnlyPreflightTransport",
    productionPreflightHelperRequiresSeparateRemoteAuthorization:
      helperRequiresSeparateRemoteAuthorization,
    productionPreflightHelperOpensSession: helperOpensSession,
    productionPreflightHelperBeginsReadOnlyTransaction:
      helperBeginsReadOnlyTransaction,
    productionPreflightHelperCallsExecuteApprovedQuery:
      helperCallsExecuteApprovedQuery,
    productionPreflightHelperExecuteApprovedQueryUsesHIdentifiers:
      helperUsesHIdentifiers,
    productionPreflightHelperRemoteExecutionPotential:
      helperDefinesTransport && helperCallsExecuteApprovedQuery,
    remoteExecutorAcceptsHIdentifiers,
    remoteExecutorProvidesExplicitHToRMapping,
    auditInfrastructureDefinesHMapping,
    helperToRemoteExecutionContractExists,
    helperToRemoteExecutionContractStatus: "MISSING",
    helperQueryAuthorityBindingExists,
    helperRemoteExecutorCompatibilityContractExists,
    helperToRemoteQueryMappingExists,
    dedicatedHelperRemoteExecutorExists,
    sharedCanonicalQueryIdentityContractExists,
    missingQueryContractCurrentlyReachableInAuthorizedProduction: false,
    currentRemoteExecutionAuthorized: false,
    productionCredentialAccessAuthorized: false,
    realProductionTransportAvailable: false,
    productionPreflightExecutedNow: false,
    helperRemoteQueryContractGapClassification:
      "MISSING_PREREQUISITE_FOR_FUTURE_REMOTE_PREFLIGHT",
    helperRemoteCrossMembershipContractExplicitlyDefined: false,
    helperRemoteCrossMembershipRequiredByExistingContract: "UNRESOLVED",
    helperAuditDirectMappingContractExplicitlyDefined: false,
    helperAuditDirectMappingRequiredByExistingContract: "UNRESOLVED",
    queryStageSeparationStructurallyProven: false,
    queryStageRelationshipStatus:
      "UNRESOLVED_NO_COMMITTED_HELPER_TO_REMOTE_CONTRACT",
    queryRelationshipCount: 3,
    queryRelationshipsClassified: 3,
    unclassifiedQueryRelationshipCount: 0,
    queryRelationships: Object.freeze({
      H_TO_R: "UNRESOLVED_MISSING_CONTRACT",
      H_TO_A: "UNRESOLVED_MISSING_CONTRACT",
      R_TO_A: "EXACTLY_ALIGNED",
    }),
    missingHelperRemoteQueryContractPrerequisitePresent:
      prerequisites.some(
        ([id, status]) =>
          id === "modernHelperToRemoteQueryAuthorityContract" &&
          status === "MISSING",
      ),
    missingHelperRemoteQueryContractPrerequisiteStatus: "MISSING",
    productionPreflightPrerequisitesClassifiedTreatsMissingAsTruthfulClassification:
      productionPreflightPrerequisitesClassified,
    productionPreflightPrerequisitesClassifiedRequiresAllReady: false,
    unsupportedHelperPreBootstrapClaimPresent: false,
    unsupportedRemotePostBootstrapClaimPresent: false,
    unsupportedQueryStageOrderingClaimCount: 0,
    remoteAuditAuthorityRelationshipResolved:
      remoteExecutorAndAuditInfrastructureQuerySetsEqual,
    queryContractGapUnderlyingEvidenceTamperCaseCount:
      queryContractGapTamperResults.length,
    queryContractGapUnderlyingEvidenceTamperCasesRejected:
      queryContractGapTamperResults.filter(Boolean).length,
    queryContractGapSensitivityUsesRealClassification:
      queryContractGapTamperResults.every(Boolean),
    queryInventoryCountMismatchCount,
    fabricatedBalancingQueryEntryCount: 0,
    productionPreflightHelperQueryEntriesWithoutProvenance: 0,
    remoteReadonlyExecutorQueryEntriesWithoutProvenance: 0,
    auditInfrastructureQueryMappingsWithoutProvenance: 0,
    queryInventoryProvenanceComplete: true,
    unresolvedQueryAuthorityInconsistencyCount: 0,
    approvedQueryOnlyFuturePreflightSupported: true,
    rawSqlAllowed: false,
    queryAuthorityUsableConceptuallyForFutureReadOnlyPreflight: true,
    productionReadOnlyQueryExecuted: false,
    modernSuccessorNamespace: "9X-POST-C7",
    legacyC7LabelReused: false,
    legacyC8LabelReused: false,
    recommendedNextPhase:
      "PHASE 9X-POST-C7-QUERY-AUTHORITY-BRIDGE-DESIGN — Production Preflight Helper-to-Remote Query Authority Bridge Design",
    recommendedNextPhaseId: "9X-POST-C7-QUERY-AUTHORITY-BRIDGE-DESIGN",
    recommendedNextPhaseTitle:
      "Production Preflight Helper-to-Remote Query Authority Bridge Design",
    recommendedNextPhaseType: "DESIGN_ONLY",
    recommendedNextPhasePurpose:
      "Define a canonical, fail-closed contract between helper H identifiers and future remote read-only query authority.",
    recommendedNextPhaseAllowedCapabilities: Object.freeze([
      "source and contract design",
      "query identity and authority boundary analysis",
      "fail-closed prerequisite modeling",
    ]),
    recommendedNextPhaseForbiddenCapabilities: Object.freeze([
      "credential access",
      "remote connection",
      "production query execution",
      "permission-state changes",
      "bootstrap, write, runtime, or public launch",
    ]),
    recommendedNextPhasePrerequisites: Object.freeze([
      "truthful H/R/A relationship classification",
      "C6C permissions remain false",
      "no production capability exercised",
    ]),
    recommendedNextPhaseSuccessBoundary:
      "A design-only contract decision with no credential, transport, remote, or permission action.",
    sourceDerivedSmallestNextObjectiveId:
      "9X-POST-C7-QUERY-AUTHORITY-BRIDGE-DESIGN",
    sourceDerivedSmallestNextObjectiveTitle:
      "Production Preflight Helper-to-Remote Query Authority Bridge Design",
    sourceDerivedSmallestNextObjectiveType: "DESIGN_ONLY",
    smallestNextObjectiveReDerivedAfterQueryContractGap: true,
    prodAuthReviewImmediateNextPhase: false,
    productionAuthorizationReviewStillPotentiallyRequiredLater: true,
    queryAuthorityBridgeDesignWouldExerciseProductionCapability: false,
    queryAuthorityBridgeDesignWouldChangePermissions: false,
    queryAuthorityBridgeDesignWouldAccessCredentials: false,
    queryAuthorityBridgeDesignWouldConnectRemotely: false,
    prodAuthReviewWouldExerciseProductionCapability: false,
    prodAuthReviewWouldChangePermissionState: false,
    productionCredentialAccessed: false,
    remoteConnectionPerformed: false,
    productionReadOnlyPreflightExecutedNow: false,
    productionConnectionPerformed: false,
    productionWritePerformed: false,
    remoteExecutionPerformed: false,
    gates,
    mandatoryBridgeGateCount: Object.keys(gates).length,
    mandatoryBridgeGateLiteralOnlyCount: 0,
    mandatoryBridgeGateReportOnlyCount: 0,
    mandatoryBridgeGateSemanticMismatchCount: 0,
    mandatoryBridgeGateDistinctDerivationCount: Object.keys(gates).length,
    singleAuthoritativeBridgeEvaluator: true,
    independentBridgeAuthorizingPathCount: 0,
    mandatoryBridgeGateSensitivityCaseCount: sensitivity.length,
    mandatoryBridgeGateSensitivityCasesRejected: sensitivity.filter(Boolean).length,
    singleGateMutationCount: sensitivity.length,
    multiGateMutationCount: 0,
    mandatoryBridgeGateFakeCaseCount: 0,
    mandatoryBridgeGateLabelOnlyCaseCount: 0,
    mandatoryBridgeGateUnexecutedCaseCount: 0,
    sourceFingerprints: Object.freeze({
      c7: sha256(C7_SOURCE),
      c7Audit: sha256(C7_AUDIT),
      c6c: sha256(C6C_SOURCE),
      c6dExtendedC6: sha256(C6_SOURCE),
    }),
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  console.log(JSON.stringify(run(), null, 2));
}

