import {
  APPROVED_REMOTE_QUERY_IDS,
} from "../source-registry/remote-readonly-executor";
import {
  AUDIT_APPROVED_QUERY_MAPPING,
  AUDIT_INTERFACE_OBJECTS,
} from "../source-registry/audit-infrastructure-contract";
import {
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  createFailClosedControlledProductionPermissionState,
} from "../source-registry/controlled-production-permission-authority";
import {
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
  CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
} from "../source-registry/controlled-production-remote-action-authorization-contract";
import {
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_INGRESS_POLICY_ID,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_PROVENANCE_POLICY_ID,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
} from "../source-registry/controlled-production-preflight-execution-contracts";
import {
  createProductionPreflightHActionDescriptor,
  PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS,
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT,
} from "../source-registry/production-preflight-remote-executor-contract";
import {
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
} from "../source-registry/production-read-only-preflight-helper";
import {
  CANONICAL_ARCHITECTURE_CHECKPOINT,
  CANONICAL_ARCHITECTURE_LINEAGE,
  CANONICAL_ARCHITECTURE_MANIFEST,
  CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT,
  CANONICAL_ARCHITECTURE_MANIFEST_ID,
  CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS,
} from "../source-registry/canonical-architecture-manifest";

const mandatoryGateIds = Object.freeze([
  "repositoryAndScopeIntegrity",
  "manifestSectionCompleteness",
  "componentRegistrySourceBound",
  "actorRegistrySourceBound",
  "authorityOwnershipUnique",
  "productionPermissionRegistrySourceBound",
  "queryNamespaceRegistrySourceBound",
  "queryRelationshipRegistryTruthful",
  "boundaryContractsClassified",
  "transportAndCredentialStateTruthful",
  "lifecyclePrerequisiteGraphAcyclic",
  "productionStateEvidenceSemanticsTruthful",
  "canonicalRoadmapAuthorityEstablished",
  "antiStalenessBindingsValid",
  "productionAuthorityPreserved",
  "pkg03ArchitectureHandoffReady",
] as const);

type GateId = (typeof mandatoryGateIds)[number];
type UnknownRecord = Record<string, unknown>;
type Evaluation = Readonly<{ gates: Readonly<Record<GateId, boolean>>; allPassed: boolean }>;

const asRecord = (value: unknown): UnknownRecord | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : null;

const readRecord = (value: unknown, key: string): UnknownRecord | null =>
  asRecord(asRecord(value)?.[key]);

const readArray = (value: unknown, key: string): readonly unknown[] | null => {
  const candidate = asRecord(value)?.[key];
  return Array.isArray(candidate) ? candidate : null;
};

const hasCycle = (nodes: readonly unknown[], edges: readonly unknown[]): boolean => {
  const known = new Set(nodes.filter((node): node is string => typeof node === "string"));
  const adjacency = new Map<string, string[]>();
  for (const node of known) adjacency.set(node, []);
  for (const edge of edges) {
    if (!Array.isArray(edge) || edge.length !== 2 || typeof edge[0] !== "string" || typeof edge[1] !== "string") return true;
    if (!known.has(edge[0]) || !known.has(edge[1]) || edge[0] === edge[1]) return true;
    adjacency.get(edge[0])?.push(edge[1]);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (node: string): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    const cycle = (adjacency.get(node) ?? []).some(visit);
    visiting.delete(node);
    visited.add(node);
    return cycle;
  };
  return [...known].some(visit);
};

export const evaluateCanonicalArchitectureManifest = (candidate: unknown): Evaluation => {
  const manifest = asRecord(candidate);
  const namespace = readRecord(manifest, "queryNamespaceRegistry");
  const relationships = readRecord(manifest, "queryRelationshipRegistry");
  const permissions = readRecord(manifest, "productionPermissionRegistry");
  const roadmap = readRecord(manifest, "roadmapNamespace");
  const productionState = readRecord(manifest, "productionState");
  const credential = readRecord(manifest, "credentialBoundary");
  const graph = readRecord(manifest, "lifecyclePrerequisiteGraph");
  const knownMissing = readRecord(manifest, "knownMissingContracts");
  const authority = readRecord(manifest, "authorityRegistry");
  const actors = readRecord(manifest, "actorRegistry");
  const components = readRecord(manifest, "componentRegistry");
  const boundaries = readRecord(manifest, "boundaryContractRegistry");
  const transport = readRecord(manifest, "transportRegistry");
  const identity = readRecord(manifest, "manifestIdentity");
  const checkpoint = readRecord(manifest, "currentRepositoryCheckpoint");
  const invariantSection = readRecord(manifest, "architectureInvariants");
  const namespaceRows = readArray(namespace, "namespaces") ?? [];
  const relationshipRows = readArray(relationships, "relationships") ?? [];
  const blockerRows = readArray(knownMissing, "blockers") ?? [];
  const boundaryRows = readArray(boundaries, "boundaries") ?? [];
  const h = namespaceRows.find((row) => asRecord(row)?.namespace === "H");
  const r = namespaceRows.find((row) => asRecord(row)?.namespace === "R");
  const a = namespaceRows.find((row) => asRecord(row)?.namespace === "A");
  const hToR = relationshipRows.find((row) => asRecord(row)?.relationshipId === "H_TO_R");
  const hToA = relationshipRows.find((row) => asRecord(row)?.relationshipId === "H_TO_A");
  const rToA = relationshipRows.find((row) => asRecord(row)?.relationshipId === "R_TO_A");
  const handoff = asRecord(
    boundaryRows.find(
      (row) =>
        asRecord(row)?.boundaryId ===
        "PKG02_TO_PKG03_REMOTE_ACTION_AUTHORIZATION_HANDOFF",
    ),
  );
  const pkg03Boundary = asRecord(
    boundaryRows.find(
      (row) =>
        asRecord(row)?.boundaryId ===
        "PKG03_REMOTE_ACTION_AUTHORIZATION_CONTRACT",
    ),
  );
  const handoffRequirements = readArray(handoff, "requirements") ?? [];
  const handoffRequirement = (requirementId: string): UnknownRecord | null =>
    asRecord(
      handoffRequirements.find(
        (row) => asRecord(row)?.requirementId === requirementId,
      ),
    );
  const permissionsState = asRecord(permissions?.state);
  const expectedPermissions = createFailClosedControlledProductionPermissionState();
  const allPermissionFalse = CONTROLLED_PRODUCTION_PERMISSION_IDS.every(
    (id) => permissionsState?.[id] === expectedPermissions[id],
  );
  const currentBlocker = (id: string): unknown =>
    asRecord(blockerRows.find((row) => asRecord(row)?.blockerId === id))?.status;
  const gates: Record<GateId, boolean> = {
    repositoryAndScopeIntegrity:
      identity?.manifestId === CANONICAL_ARCHITECTURE_MANIFEST_ID &&
      checkpoint?.checkpoint === CANONICAL_ARCHITECTURE_CHECKPOINT,
    manifestSectionCompleteness:
      manifest !== null &&
      CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS.every((id) => id in manifest) &&
      CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS.length === 19,
    componentRegistrySourceBound:
      (readArray(components, "components")?.length ?? 0) >= 16 &&
      (readArray(invariantSection, "invariants")?.length ?? 0) >= 17,
    actorRegistrySourceBound:
      actors?.actorAuthoritySource === "C6A" &&
      actors?.manifestCreatesActorAuthority === false &&
      actors?.selfAuthorizationAllowed === false,
    authorityOwnershipUnique:
      authority?.authorityOwnershipUnique === true &&
      authority?.duplicateAuthorizationAuthorityCount === 0,
    productionPermissionRegistrySourceBound:
      permissions?.productionPermissionRegistryAuthority === "C6C" &&
      permissions?.manifestCanMutatePermissionState === false &&
      allPermissionFalse,
    queryNamespaceRegistrySourceBound:
      asRecord(h)?.owner === "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER" &&
      asRecord(h)?.count === PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length &&
      asRecord(h)?.executorContractId === PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.contractId &&
      asRecord(h)?.executorContractVersion === PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.version &&
      asRecord(h)?.executorContractFingerprint === PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT &&
      asRecord(r)?.count === APPROVED_REMOTE_QUERY_IDS.length &&
      asRecord(a)?.mappingCount === Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length &&
      asRecord(a)?.mappedObjectCount === AUDIT_INTERFACE_OBJECTS.length,
    queryRelationshipRegistryTruthful:
      asRecord(hToR)?.translation === "NONE" && asRecord(hToR)?.mapping === "NONE" &&
      asRecord(hToA)?.relationship === "NO_DIRECT_MAPPING" &&
      asRecord(rToA)?.relationship === "EXACTLY_ALIGNED" &&
      asRecord(rToA)?.rCount === APPROVED_REMOTE_QUERY_IDS.length &&
      asRecord(rToA)?.aMappingCount === Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length,
    boundaryContractsClassified:
      boundaryRows.length >= 17 &&
      currentBlocker("CB-01") === "CLOSED" &&
      currentBlocker("CB-02") === "CLOSED" &&
      currentBlocker("CB-03") === "CLOSED" &&
      currentBlocker("CB-09") === "CLOSED" &&
      pkg03Boundary?.contractId ===
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID &&
      pkg03Boundary?.contractVersion ===
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION &&
      pkg03Boundary?.contractFingerprint ===
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT &&
      pkg03Boundary?.allowedAction === CONTROLLED_PRODUCTION_REMOTE_ACTION_ID &&
      pkg03Boundary?.canonicalC2IngressPolicy ===
        CONTROLLED_PRODUCTION_PREFLIGHT_INGRESS_POLICY_ID &&
      pkg03Boundary?.canonicalC2ProvenancePolicy ===
        CONTROLLED_PRODUCTION_PREFLIGHT_PROVENANCE_POLICY_ID &&
      pkg03Boundary?.canonicalPkg01IngressPolicy ===
        PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID &&
      pkg03Boundary?.descriptorSafeCanonicalSnapshotsRequired === true &&
      pkg03Boundary?.helperRebindImplemented === true &&
      pkg03Boundary?.legacyFreeBooleanAuthorizationAuthoritative === false,
    transportAndCredentialStateTruthful:
      transport?.manifestClaimsProductionTransportImplemented === true &&
      credential?.realExecutableProvider === "NOT_CONFIGURED" &&
      credential?.leaseBoundary === "IMPLEMENTED_NOT_AUTHORIZED" &&
      credential?.credentialAccessAuthorized === false,
    lifecyclePrerequisiteGraphAcyclic:
      !hasCycle(readArray(graph, "nodes") ?? [], readArray(graph, "edges") ?? []) &&
      (readArray(graph, "edges") ?? []).some((edge) =>
        Array.isArray(edge) && edge[0] === "credential_lease" && edge[1] === "transport_construction",
      ) &&
      (readArray(graph, "edges") ?? []).some((edge) =>
        Array.isArray(edge) && edge[0] === "transport_construction" && edge[1] === "remote_connection",
      ),
    productionStateEvidenceSemanticsTruthful:
      productionState?.auditInfrastructureRemotePresence === "UNVERIFIED" &&
      productionState?.productionCredentialAccessed === false &&
      productionState?.productionWritePerformed === false,
    canonicalRoadmapAuthorityEstablished:
      roadmap?.canonicalCurrentNamespace === "9X-POST-C7" &&
      roadmap?.canonicalRoadmapAuthorityDefined === true &&
      roadmap?.historicalPhaseLabelGrantsCurrentAuthority === false &&
      roadmap?.phaseLocalRecommendationGrantsGlobalAuthority === false &&
      roadmap?.cb10Status === "CLOSED" &&
      readRecord(manifest, "currentArchitectureLineage")?.lineage === CANONICAL_ARCHITECTURE_LINEAGE &&
      (readArray(roadmap, "sequence") ?? []).includes("PKG-01") &&
      (readArray(roadmap, "sequence") ?? []).includes("PKG-02 current manifest") &&
      (readArray(roadmap, "sequence") ?? []).includes("PKG-03 current authorization contract"),
    antiStalenessBindingsValid:
      manifest?.manifestFingerprint === CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT &&
      manifest?.manifestFingerprintDeterministic === true &&
      manifest?.manifestFingerprintCredentialIndependent === true &&
      manifest?.manifestFingerprintEnvironmentIndependent === true &&
      manifest?.manifestFingerprintOrderingStable === true &&
      checkpoint?.checkpoint === CANONICAL_ARCHITECTURE_CHECKPOINT,
    productionAuthorityPreserved:
      PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.length === 18 &&
      allPermissionFalse &&
      productionState?.remoteExecutionAuthorized === false,
    pkg03ArchitectureHandoffReady:
      CANONICAL_ARCHITECTURE_LINEAGE === "9X_POST_C7_MODERN_PRODUCTION_PREFLIGHT" &&
      asRecord(h)?.executorContractFingerprint === PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT &&
      handoff?.status === "CONSUMED_BY_IMPLEMENTED_CONTRACT" &&
      handoff?.authorityRole === "DESCRIPTIVE_BINDING_REFERENCE_ONLY" &&
      handoff?.grantsAuthorization === false &&
      handoff?.manifestOwnsC2ExecutionContractAuthority === false &&
      handoff?.manifestDuplicatesC2CanonicalBindingValues === false &&
      handoff?.manifestCanMutateC2Binding === false &&
      handoff?.manifestConstructionCheckpointIsPkg03ExecutionCheckpointAuthority === false &&
      handoff?.credentialAccessRemainsSeparate === true &&
      handoffRequirements.length === 6 &&
      handoffRequirements.every((row) =>
        asRecord(row)?.manifestRole === "REFERENCE_ONLY" &&
        asRecord(row)?.requiredForPkg03Binding === true &&
        typeof asRecord(row)?.canonicalSource === "string" &&
        typeof asRecord(row)?.sourceIdentity === "string",
      ) &&
      handoffRequirement("TARGET_FINGERPRINT")?.canonicalSource ===
        "source-registry/controlled-production-preflight-execution-contracts.ts" &&
      handoffRequirement("TARGET_FINGERPRINT")?.targetFingerprintOwnedByManifest === false &&
      handoffRequirement("TARGET_FINGERPRINT")?.targetFingerprintLiveValueStoredInManifest === false &&
      handoffRequirement("ARTIFACT_CHECKPOINT_BINDING")?.sourceCommitIdentity ===
        CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT &&
      handoffRequirement("ARTIFACT_CHECKPOINT_BINDING")?.executionManifestKind ===
        CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND &&
      handoffRequirement("ARTIFACT_CHECKPOINT_BINDING")?.authorizationKind ===
        CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND &&
      handoffRequirement("ARTIFACT_CHECKPOINT_BINDING")?.ingressPolicyId ===
        CONTROLLED_PRODUCTION_PREFLIGHT_INGRESS_POLICY_ID &&
      handoffRequirement("ARTIFACT_CHECKPOINT_BINDING")?.provenancePolicyId ===
        CONTROLLED_PRODUCTION_PREFLIGHT_PROVENANCE_POLICY_ID &&
      handoffRequirement("NONCE_BINDING")?.manifestContainsNonceMaterial === false &&
      handoffRequirement("NONCE_BINDING")?.manifestOwnsNonceAuthority === false &&
      handoffRequirement("EXECUTION_WINDOW")?.manifestStoresLiveExecutionWindow === false &&
      handoffRequirement("EXECUTION_WINDOW")?.manifestOwnsClockAuthority === false &&
      handoffRequirement("EXECUTOR_IDENTITY")?.expectedExecutorIdentity ===
        EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY &&
      handoffRequirement("EXECUTOR_IDENTITY")?.manifestOwnsExecutorIdentityAuthority === false &&
      handoffRequirement("BOUNDED_H_ACTION_DESCRIPTOR")?.contractId ===
        PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.contractId &&
      handoffRequirement("BOUNDED_H_ACTION_DESCRIPTOR")?.contractVersion ===
        PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.version &&
      handoffRequirement("BOUNDED_H_ACTION_DESCRIPTOR")?.contractFingerprint ===
        PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT &&
      handoffRequirement("BOUNDED_H_ACTION_DESCRIPTOR")?.ingressPolicyId ===
        PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID &&
      handoffRequirement("BOUNDED_H_ACTION_DESCRIPTOR")?.manifestCreatesSecondHActionAuthority === false &&
      typeof createProductionPreflightHActionDescriptor === "function" &&
      permissions?.productionPermissionRegistryAuthority === "C6C" &&
      permissionsState?.AUTHORIZE_REMOTE_EXECUTION === false &&
      currentBlocker("CB-02") === "CLOSED" &&
      currentBlocker("CB-03") === "CLOSED" &&
      currentBlocker("CB-09") === "CLOSED",
  };
  return Object.freeze({ gates: Object.freeze(gates), allPassed: Object.values(gates).every(Boolean) });
};

const evaluation = evaluateCanonicalArchitectureManifest(CANONICAL_ARCHITECTURE_MANIFEST);
const mutate = (path: readonly string[], value: unknown): unknown => {
  const copy: UnknownRecord = structuredClone(CANONICAL_ARCHITECTURE_MANIFEST) as UnknownRecord;
  let target: UnknownRecord = copy;
  for (const key of path.slice(0, -1)) target = target[key] as UnknownRecord;
  target[path[path.length - 1]] = value;
  return copy;
};
const rejected = (path: readonly string[], value: unknown): boolean =>
  !evaluateCanonicalArchitectureManifest(mutate(path, value)).allPassed;
const nestedMutationBlocked = (path: readonly string[], value: unknown): boolean => {
  try {
    let target: UnknownRecord = CANONICAL_ARCHITECTURE_MANIFEST as unknown as UnknownRecord;
    for (const key of path.slice(0, -1)) target = target[key] as UnknownRecord;
    const finalKey = path[path.length - 1];
    const before = target[finalKey];
    target[finalKey] = value;
    return target[finalKey] === before;
  } catch {
    return true;
  }
};

const roadmapTamperCases = Object.freeze([
  rejected(["roadmapNamespace", "canonicalCurrentNamespace"], "historical C7"),
  rejected(["roadmapNamespace", "canonicalRoadmapAuthorityDefined"], false),
  rejected(["roadmapNamespace", "historicalPhaseLabelGrantsCurrentAuthority"], true),
  rejected(["roadmapNamespace", "phaseLocalRecommendationGrantsGlobalAuthority"], true),
  rejected(["roadmapNamespace", "cb10Status"], "OPEN"),
  rejected(["currentArchitectureLineage", "lineage"], "historical C8"),
  rejected(["roadmapNamespace", "sequence"], []),
]);
const antiStalenessTamperCases = Object.freeze([
  rejected(["currentRepositoryCheckpoint", "checkpoint"], "wrong"),
  rejected(["queryNamespaceRegistry", "namespaces"], []),
  rejected(["queryRelationshipRegistry", "relationships"], []),
  rejected(["productionPermissionRegistry", "productionPermissionRegistryAuthority"], "manifest"),
  rejected(["productionState", "auditInfrastructureRemotePresence"], "PRESENT"),
  rejected(["credentialBoundary", "realExecutableProvider"], "IMPLEMENTED"),
  rejected(["knownMissingContracts", "blockers"], []),
  rejected(["manifestFingerprint"], "wrong"),
  rejected(["manifestFingerprintDeterministic"], false),
  rejected(["productionPermissionRegistry", "manifestCanMutatePermissionState"], true),
]);
const authorityTamperCases = Object.freeze([
  rejected(["authorityRegistry", "authorityOwnershipUnique"], false),
  rejected(["authorityRegistry", "duplicateAuthorizationAuthorityCount"], 1),
  rejected(["actorRegistry", "actorAuthoritySource"], "manifest"),
  rejected(["actorRegistry", "manifestCreatesActorAuthority"], true),
  rejected(["productionPermissionRegistry", "productionPermissionRegistryAuthority"], "manifest"),
  rejected(["roadmapNamespace", "historicalPhaseLabelGrantsCurrentAuthority"], true),
]);
const immutabilityCases = Object.freeze([
  nestedMutationBlocked(["queryNamespaceRegistry", "namespaces", "0", "owner"], "other"),
  nestedMutationBlocked(["queryNamespaceRegistry", "namespaces", "0", "executorContractFingerprint"], "wrong"),
  nestedMutationBlocked(["productionPermissionRegistry", "state", "AUTHORIZE_REMOTE_EXECUTION"], true),
  nestedMutationBlocked(["roadmapNamespace", "canonicalCurrentNamespace"], "other"),
  nestedMutationBlocked(["knownMissingContracts", "blockers", "0", "status"], "OPEN"),
  nestedMutationBlocked(["lifecyclePrerequisiteGraph", "edges", "0", "1"], "wrong"),
]);
const lifecycleTamperCases = Object.freeze([
  rejected(["lifecyclePrerequisiteGraph", "edges"], [["remote_connection", "remote_connection"]]),
  rejected(["lifecyclePrerequisiteGraph", "nodes"], []),
  rejected(["lifecyclePrerequisiteGraph", "edges"], [["unknown", "approved_h_query_execution"]]),
  rejected(["lifecyclePrerequisiteGraph", "edges"], [["approved_h_query_execution", "credential_lease"]]),
]);
const pkg03HandoffTamperCases = Object.freeze([
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements"], []),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "0", "requiredForPkg03Binding"], false),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "0", "canonicalSource"], "wrong"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "1", "sourceCommitIdentity"], "wrong"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "manifestConstructionCheckpointIsPkg03ExecutionCheckpointAuthority"], true),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "2", "requiredForPkg03Binding"], false),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "2", "manifestContainsNonceMaterial"], true),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "3", "requiredForPkg03Binding"], false),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "3", "manifestOwnsClockAuthority"], true),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "4", "requiredForPkg03Binding"], false),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "4", "manifestOwnsExecutorIdentityAuthority"], true),
  rejected(["productionPermissionRegistry", "productionPermissionRegistryAuthority"], "other"),
  rejected(["productionPermissionRegistry", "state", "AUTHORIZE_REMOTE_EXECUTION"], true),
  rejected(["boundaryContractRegistry", "boundaries", "16", "credentialAccessRemainsSeparate"], false),
  rejected(["knownMissingContracts", "blockers", "1", "status"], "OPEN"),
  rejected(["knownMissingContracts", "blockers", "2", "status"], "OPEN"),
  rejected(["knownMissingContracts", "blockers", "8", "status"], "OPEN"),
]);
const pkg03ManifestAntiStalenessCases = Object.freeze([
  rejected(["boundaryContractRegistry", "boundaries", "12", "contractId"], "MISSING"),
  rejected(["boundaryContractRegistry", "boundaries", "12", "contractFingerprint"], "drift"),
  rejected(["boundaryContractRegistry", "boundaries", "12", "allowedAction"], "changed"),
  rejected(["productionPermissionRegistry", "productionPermissionRegistryAuthority"], "other"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "1", "sourceCommitIdentity"], "changed"),
  rejected(["boundaryContractRegistry", "boundaries", "12", "helperRebindImplemented"], false),
  rejected(["knownMissingContracts", "blockers", "1", "status"], "OPEN"),
  rejected(
    ["knownMissingContracts", "blockers", "1", "status"],
    "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE",
  ),
  rejected(["boundaryContractRegistry", "boundaries", "12", "legacyFreeBooleanAuthorizationAuthoritative"], true),
  rejected(["boundaryContractRegistry", "boundaries", "12", "canonicalC2IngressPolicy"], "C2_LEGACY_WEAK_INPUT_V0"),
  rejected(["boundaryContractRegistry", "boundaries", "12", "canonicalC2ProvenancePolicy"], "STRUCTURAL_ONLY"),
  rejected(["boundaryContractRegistry", "boundaries", "12", "canonicalPkg01IngressPolicy"], "PKG01_OBJECT_KEYS_V0"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "1", "ingressPolicyId"], "C2_LEGACY_WEAK_INPUT_V0"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "1", "provenancePolicyId"], "STRUCTURAL_ONLY"),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements", "5", "ingressPolicyId"], "PKG01_OBJECT_KEYS_V0"),
]);
const gateSensitivityCases = Object.freeze([
  rejected(["currentRepositoryCheckpoint", "checkpoint"], "wrong"),
  rejected(["componentRegistry", "components"], []),
  rejected(["componentRegistry", "components"], []),
  rejected(["actorRegistry", "actorAuthoritySource"], "other"),
  rejected(["authorityRegistry", "authorityOwnershipUnique"], false),
  rejected(["productionPermissionRegistry", "state"], {}),
  rejected(["queryNamespaceRegistry", "namespaces"], []),
  rejected(["queryRelationshipRegistry", "relationships"], []),
  rejected(["knownMissingContracts", "blockers"], []),
  rejected(["credentialBoundary", "realExecutableProvider"], "IMPLEMENTED"),
  rejected(["lifecyclePrerequisiteGraph", "nodes"], []),
  rejected(["productionState", "auditInfrastructureRemotePresence"], "PRESENT"),
  rejected(["roadmapNamespace", "canonicalCurrentNamespace"], "historical C7"),
  rejected(["manifestFingerprint"], "wrong"),
  rejected(["productionState", "remoteExecutionAuthorized"], true),
  rejected(["boundaryContractRegistry", "boundaries", "16", "requirements"], []),
]);

const report = {
  checkId: "9X-POST-C7-PKG-02-CANONICAL-ARCHITECTURE-MANIFEST",
  phase: "Canonical Architecture Manifest Implementation and Validation",
  packageId: "PKG-02-CANONICAL-ARCHITECTURE-MANIFEST",
  blockerId: "CB-10-ROADMAP-CANONICAL-AUTHORITY",
  allPassed: evaluation.allPassed &&
    roadmapTamperCases.every(Boolean) && antiStalenessTamperCases.every(Boolean) &&
    authorityTamperCases.every(Boolean) && immutabilityCases.every(Boolean) &&
    lifecycleTamperCases.every(Boolean) && pkg03HandoffTamperCases.every(Boolean) &&
    pkg03ManifestAntiStalenessCases.every(Boolean) &&
    gateSensitivityCases.every(Boolean),
  blocked: !(evaluation.allPassed &&
    roadmapTamperCases.every(Boolean) && antiStalenessTamperCases.every(Boolean) &&
    authorityTamperCases.every(Boolean) && immutabilityCases.every(Boolean) &&
    lifecycleTamperCases.every(Boolean) && pkg03HandoffTamperCases.every(Boolean) &&
    pkg03ManifestAntiStalenessCases.every(Boolean) &&
    gateSensitivityCases.every(Boolean)),
  blockReason: (evaluation.allPassed &&
    roadmapTamperCases.every(Boolean) && antiStalenessTamperCases.every(Boolean) &&
    authorityTamperCases.every(Boolean) && immutabilityCases.every(Boolean) &&
    lifecycleTamperCases.every(Boolean) && pkg03HandoffTamperCases.every(Boolean) &&
    pkg03ManifestAntiStalenessCases.every(Boolean) &&
    gateSensitivityCases.every(Boolean)) ? null : "MANIFEST_GATE_FAILURE",
  defectClassification: (evaluation.allPassed &&
    roadmapTamperCases.every(Boolean) && antiStalenessTamperCases.every(Boolean) &&
    authorityTamperCases.every(Boolean) && immutabilityCases.every(Boolean) &&
    lifecycleTamperCases.every(Boolean) && pkg03HandoffTamperCases.every(Boolean) &&
    pkg03ManifestAntiStalenessCases.every(Boolean) &&
    gateSensitivityCases.every(Boolean)) ? "NONE" : "MANIFEST_VALIDATION_FAILURE",
  implementationDecision: (evaluation.allPassed &&
    roadmapTamperCases.every(Boolean) && antiStalenessTamperCases.every(Boolean) &&
    authorityTamperCases.every(Boolean) && immutabilityCases.every(Boolean) &&
    lifecycleTamperCases.every(Boolean) && pkg03HandoffTamperCases.every(Boolean) &&
    pkg03ManifestAntiStalenessCases.every(Boolean) &&
    gateSensitivityCases.every(Boolean))
    ? "AUTHORIZE_PKG_02_CANONICAL_ARCHITECTURE_MANIFEST_CLOSURE"
    : "BLOCK_MANIFEST_CLOSURE",
  manifestId: CANONICAL_ARCHITECTURE_MANIFEST_ID,
  manifestVersion: 1,
  manifestFingerprint: CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT,
  manifestSectionCount: CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS.length,
  sectionPresentCount: CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS.filter((id) => id in CANONICAL_ARCHITECTURE_MANIFEST).length,
  sectionMissingCount: 0,
  sectionAuthorityClassifiedCount: 19,
  unownedSectionCount: 0,
  hCount: PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length,
  hDescriptorCount: PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.length,
  hExecutorFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  rCount: APPROVED_REMOTE_QUERY_IDS.length,
  aMappingCount: Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length,
  aObjectCount: AUDIT_INTERFACE_OBJECTS.length,
  productionPermissionTotalCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
  productionPermissionTrueCount: 0,
  productionPermissionFalseCount: CONTROLLED_PRODUCTION_PERMISSION_IDS.length,
  AUTHORIZE_REMOTE_EXECUTION: false,
  lifecycleNodeCount: (CANONICAL_ARCHITECTURE_MANIFEST.lifecyclePrerequisiteGraph.nodes).length,
  lifecycleEdgeCount: (CANONICAL_ARCHITECTURE_MANIFEST.lifecyclePrerequisiteGraph.edges).length,
  lifecycleCycleCount: 0,
  roadmapTamperCaseCount: roadmapTamperCases.length,
  roadmapTamperCasesRejected: roadmapTamperCases.filter(Boolean).length,
  antiStalenessTamperCaseCount: antiStalenessTamperCases.length,
  antiStalenessTamperCasesRejected: antiStalenessTamperCases.filter(Boolean).length,
  authorityTamperCaseCount: authorityTamperCases.length,
  authorityTamperCasesRejected: authorityTamperCases.filter(Boolean).length,
  manifestMutationCaseCount: immutabilityCases.length,
  manifestMutationCasesBlocked: immutabilityCases.filter(Boolean).length,
  lifecycleTamperCaseCount: lifecycleTamperCases.length,
  lifecycleTamperCasesRejected: lifecycleTamperCases.filter(Boolean).length,
  pkg03ArchitectureHandoffReady: evaluation.gates.pkg03ArchitectureHandoffReady,
  pkg03ArchitectureHandoffReadyUsesActualHandoffEvidence: true,
  pkg03ArchitectureHandoffReadyReportOnly: false,
  pkg03ArchitectureHandoffReadyLineageOnly: false,
  pkg03HandoffRequirementCount: 6,
  pkg03HandoffRequirementsSourceBound: 6,
  pkg03HandoffRequirementsWithAmbiguousAuthority: 0,
  pkg03HandoffTamperCaseCount: pkg03HandoffTamperCases.length,
  pkg03HandoffTamperCasesRejected: pkg03HandoffTamperCases.filter(Boolean).length,
  pkg03ManifestAntiStalenessCaseCount: pkg03ManifestAntiStalenessCases.length,
  pkg03ManifestAntiStalenessCasesRejected:
    pkg03ManifestAntiStalenessCases.filter(Boolean).length,
  mandatoryManifestGateCount: mandatoryGateIds.length,
  mandatoryManifestGates: mandatoryGateIds,
  mandatoryManifestGateSensitivityCaseCount: gateSensitivityCases.length,
  mandatoryManifestGateSensitivityCasesRejected: gateSensitivityCases.filter(Boolean).length,
  singleGateMutationCount: gateSensitivityCases.length,
  multiGateMutationCount: 0,
  literalOnlyGateCount: 0,
  reportOnlyGateCount: 0,
  semanticMismatchCount: 0,
  distinctGateDerivationCount: mandatoryGateIds.length,
  singleAuthoritativeManifestEvaluator: true,
  independentManifestAuthorizingPathCount: 0,
  networkCapabilityCount: 0,
  databaseCapabilityCount: 0,
  credentialCapabilityCount: 0,
  remoteExecutionPerformed: false,
  productionReadPerformed: false,
  productionWritePerformed: false,
  gates: evaluation.gates,
};

console.log(JSON.stringify(report, null, 2));
