import "server-only";

import { createHash } from "node:crypto";

import {
  AUDIT_APPROVED_QUERY_MAPPING,
  AUDIT_BOOTSTRAP_ARTIFACT_PATHS,
  AUDIT_INTERFACE_OBJECTS,
  AUDIT_ROLE_NAMES,
} from "./audit-infrastructure-contract";
import { CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY } from "./controlled-preflight-actor-authority";
import {
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  createFailClosedControlledProductionPermissionState,
} from "./controlled-production-permission-authority";
import {
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
} from "./controlled-production-preflight-execution-contracts";
import {
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT,
} from "./production-preflight-remote-executor-contract";
import { PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS } from "./production-read-only-preflight-helper";
import { APPROVED_REMOTE_QUERY_IDS } from "./remote-readonly-executor";

export const CANONICAL_ARCHITECTURE_MANIFEST_ID =
  "VAYLO_CANONICAL_ARCHITECTURE_MANIFEST" as const;
export const CANONICAL_ARCHITECTURE_MANIFEST_VERSION = 1 as const;
export const CANONICAL_ARCHITECTURE_LINEAGE =
  "9X_POST_C7_MODERN_PRODUCTION_PREFLIGHT" as const;
export const CANONICAL_ARCHITECTURE_CHECKPOINT =
  "921caddaf6f6a65e176169807d00085993a0bbe4" as const;

export const CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS = Object.freeze([
  "manifestIdentity",
  "currentRepositoryCheckpoint",
  "currentArchitectureLineage",
  "componentRegistry",
  "actorRegistry",
  "authorityRegistry",
  "productionPermissionRegistry",
  "queryNamespaceRegistry",
  "queryRelationshipRegistry",
  "boundaryContractRegistry",
  "transportRegistry",
  "credentialBoundary",
  "databaseAuditInterface",
  "lifecyclePrerequisiteGraph",
  "productionState",
  "roadmapNamespace",
  "historicalAndSupersededReferences",
  "architectureInvariants",
  "knownMissingContracts",
] as const);

type ManifestStatus =
  | "IMPLEMENTED"
  | "CLOSED"
  | "DESIGN_ONLY"
  | "MISSING"
  | "OPEN"
  | "UNVERIFIED"
  | "UNKNOWN"
  | "HISTORICAL"
  | "SUPERSEDED"
  | "NOT_APPLICABLE"
  | "NOT_AUTHORIZED"
  | "AUTHORIZED";

type AuthoritySection = Readonly<{
  authoritySource: string;
  authorityClassification: "CANONICAL_SOURCE" | "DERIVED_SOURCE" | "GIT_BOUND" | "HISTORICAL_METADATA";
}>;

const deepFreeze = <T>(value: T): T => {
  if (value && typeof value === "object") {
    for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
    if (!Object.isFrozen(value)) Object.freeze(value);
  }
  return value;
};

const component = (
  componentId: string,
  sourcePath: string,
  role: string,
  implementationState: ManifestStatus,
  authorizationState: ManifestStatus,
  executionCapabilityClass: string,
  authorityOwned: string,
  authorityConsumed: string,
  currentOrHistorical: "CURRENT" | "HISTORICAL",
) => deepFreeze({ componentId, sourcePath, role, implementationState, authorizationState, executionCapabilityClass, authorityOwned, authorityConsumed, currentOrHistorical });

const boundary = (
  boundaryId: string,
  producer: string,
  consumer: string,
  status: "EXPLICIT_AND_BOUND" | "EXPLICIT_DESIGN_ONLY" | "IMPLEMENTED_NOT_AUTHORIZED" | "MISSING" | "OPEN" | "HISTORICAL" | "SUPERSEDED" | "NOT_REQUIRED",
  blockerId: string | null,
) => deepFreeze({ boundaryId, producer, consumer, status, blockerId });

const invariant = (invariantId: string, statement: string) =>
  deepFreeze({ invariantId, statement, status: "VALIDATED" as const });

const lifecycleNodes = Object.freeze([
  "architecture_contract_closure", "canonical_manifest_checkpoint", "bounded_remote_action_definition",
  "authorization_binding", "backup_recovery_evidence", "credential_authorization", "credential_lease",
  "transport_construction", "remote_connection", "read_only_transaction", "approved_h_query_execution",
  "production_presence_verification", "bootstrap_authorization", "bootstrap_write",
  "production_authorization_review", "runtime_authorization", "public_launch",
]);

const lifecycleEdges = Object.freeze([
  ["architecture_contract_closure", "canonical_manifest_checkpoint"],
  ["canonical_manifest_checkpoint", "bounded_remote_action_definition"],
  ["bounded_remote_action_definition", "authorization_binding"],
  ["authorization_binding", "credential_authorization"],
  ["backup_recovery_evidence", "credential_authorization"],
  ["credential_authorization", "credential_lease"],
  ["credential_lease", "transport_construction"],
  ["transport_construction", "remote_connection"],
  ["remote_connection", "read_only_transaction"],
  ["read_only_transaction", "approved_h_query_execution"],
  ["approved_h_query_execution", "production_presence_verification"],
  ["backup_recovery_evidence", "bootstrap_authorization"],
  ["production_presence_verification", "bootstrap_authorization"],
  ["bootstrap_authorization", "bootstrap_write"],
  ["production_authorization_review", "runtime_authorization"],
  ["runtime_authorization", "public_launch"],
] as const);

const section = <T extends object>(authority: AuthoritySection, payload: T) =>
  deepFreeze({ ...authority, ...payload });

const manifestSemanticPayload = deepFreeze({
  manifestIdentity: section(
    { authoritySource: "PKG-02 immutable manifest identity", authorityClassification: "CANONICAL_SOURCE" },
    {
      manifestId: CANONICAL_ARCHITECTURE_MANIFEST_ID,
      version: CANONICAL_ARCHITECTURE_MANIFEST_VERSION,
      manifestClass: "DESCRIPTIVE_NON_AUTHORIZING_ARCHITECTURE_TRUTH",
      manifestMayGrantExecutionAuthority: false,
      manifestMayGrantProductionPermission: false,
      manifestMayContainCredentials: false,
      manifestMayAssertUnverifiedRemoteState: false,
    },
  ),
  currentRepositoryCheckpoint: section(
    { authoritySource: "Git-bound manifest identity", authorityClassification: "GIT_BOUND" },
    { checkpoint: CANONICAL_ARCHITECTURE_CHECKPOINT, checkpointSemantics: "Identifies the committed architecture baseline from which this manifest was constructed; it becomes STALE, MISMATCHED, or SUPERSEDED after later source evolution without rewriting this fact.", validationStates: Object.freeze(["CURRENT", "STALE", "MISMATCHED", "SUPERSEDED"]) },
  ),
  currentArchitectureLineage: section(
    { authoritySource: "Modern post-C7 architecture lineage", authorityClassification: "CANONICAL_SOURCE" },
    { lineage: CANONICAL_ARCHITECTURE_LINEAGE, status: "CURRENT" },
  ),
  componentRegistry: section(
    { authoritySource: "Committed source component modules", authorityClassification: "DERIVED_SOURCE" },
    { components: Object.freeze([
      component("C4", "source-registry/controlled-preflight-launcher-capability-contract.ts", "synthetic capability boundary", "IMPLEMENTED", "NOT_AUTHORIZED", "SYNTHETIC_ONLY", "C4", "none", "CURRENT"),
      component("C5", "source-registry/controlled-preflight-launcher.ts", "controlled launcher", "IMPLEMENTED", "NOT_AUTHORIZED", "SYNTHETIC_ONLY", "C5", "C4", "CURRENT"),
      component("C6A", "source-registry/controlled-preflight-actor-authority.ts", "actor authority", "IMPLEMENTED", "NOT_APPLICABLE", "NO_EXECUTION", "C6A", "none", "CURRENT"),
      component("C6B", "source-registry/controlled-synthetic-fixed-clock-policy.ts", "fixed-clock policy", "IMPLEMENTED", "NOT_APPLICABLE", "SYNTHETIC_ONLY", "C6B", "none", "CURRENT"),
      component("C6C", "source-registry/controlled-production-permission-authority.ts", "production permission authority", "IMPLEMENTED", "NOT_AUTHORIZED", "NO_EXECUTION", "C6C", "none", "CURRENT"),
      component("C6", "source-registry/controlled-operator-authorization-envelope.ts", "operator authorization envelope", "IMPLEMENTED", "OPEN", "CONTRACT_ONLY", "C6", "C6A/C6B/C6C", "CURRENT"),
      component("C6D", "source-registry/controlled-production-preflight-execution-contracts.ts", "validated synthetic handoff", "IMPLEMENTED", "NOT_AUTHORIZED", "CONTRACT_ONLY", "C6D", "C6", "CURRENT"),
      component("C7", "source-registry/controlled-synthetic-c5-launch-execution-boundary.ts", "synthetic execution boundary", "IMPLEMENTED", "NOT_AUTHORIZED", "SYNTHETIC_ONLY", "C7", "C6D", "CURRENT"),
      component("H_HELPER", "source-registry/production-read-only-preflight-helper.ts", "production read-only preflight helper", "IMPLEMENTED", "NOT_AUTHORIZED", "CONTRACT_ONLY", "H", "C6C", "CURRENT"),
      component("H_EXECUTOR", "source-registry/production-preflight-remote-executor-contract.ts", "dedicated H executor contract", "IMPLEMENTED", "NOT_AUTHORIZED", "CONTRACT_ONLY", "H executor", "H", "CURRENT"),
      component("R_EXECUTOR", "source-registry/remote-readonly-executor.ts", "remote R executor", "IMPLEMENTED", "NOT_AUTHORIZED", "CONTRACT_ONLY", "R", "none", "CURRENT"),
      component("A_CONTRACT", "source-registry/audit-infrastructure-contract.ts", "audit infrastructure mapping", "IMPLEMENTED", "NOT_AUTHORIZED", "CONTRACT_ONLY", "A", "R", "CURRENT"),
      component("CREDENTIAL_TRANSPORT", "source-registry/controlled-production-preflight-credential-and-transport-boundary.ts", "credential and transport design contracts", "DESIGN_ONLY", "NOT_AUTHORIZED", "INTERFACE_ONLY", "future credential authority", "C6D", "CURRENT"),
      component("BOOTSTRAP", AUDIT_BOOTSTRAP_ARTIFACT_PATHS.bootstrapSql, "bootstrap artifact", "IMPLEMENTED", "NOT_AUTHORIZED", "NO_EXECUTION", "bootstrap authority", "C6C", "CURRENT"),
      component("BACKUP_EVIDENCE", "external operator evidence", "backup/recovery evidence boundary", "MISSING", "NOT_AUTHORIZED", "NO_EXECUTION", "external evidence", "none", "CURRENT"),
      component("TARGET_EVIDENCE", "external remote evidence", "production target evidence boundary", "UNVERIFIED", "NOT_AUTHORIZED", "NO_EXECUTION", "external evidence", "none", "CURRENT"),
    ]) },
  ),
  actorRegistry: section(
    { authoritySource: "C6A controlled-preflight-actor-authority.ts", authorityClassification: "CANONICAL_SOURCE" },
    { actorAuthoritySource: "C6A", actors: CONTROLLED_PREFLIGHT_ACTOR_AUTHORITY, implementationEntities: Object.freeze(["H executor contract", "R executor", "database audit role", "production target"]), manifestCreatesActorAuthority: false, selfAuthorizationAllowed: false },
  ),
  authorityRegistry: section(
    { authoritySource: "Distinct committed authority modules", authorityClassification: "DERIVED_SOURCE" },
    { authorityOwnershipUnique: true, duplicateAuthorizationAuthorityCount: 0, domains: Object.freeze([
      ["synthetic capability", "C4", "IMPLEMENTED"], ["actor", "C6A", "IMPLEMENTED"], ["fixed-clock", "C6B", "IMPLEMENTED"], ["production permission", "C6C", "IMPLEMENTED"], ["H query namespace", "H helper", "IMPLEMENTED"], ["H executor contract", "PKG-01", "IMPLEMENTED"], ["R remote query", "R executor", "IMPLEMENTED"], ["A mapping", "A contract", "IMPLEMENTED"], ["credential", "future provider", "MISSING"], ["remote-action authorization", "future PKG-03", "OPEN"], ["bootstrap", "C6C", "NOT_AUTHORIZED"], ["production write", "C6C", "NOT_AUTHORIZED"], ["runtime/public launch", "C6C", "NOT_AUTHORIZED"],
    ].map(([domain, owner, status]) => deepFreeze({ domain, owner, status }))) },
  ),
  productionPermissionRegistry: section(
    { authoritySource: "C6C controlled-production-permission-authority.ts", authorityClassification: "CANONICAL_SOURCE" },
    { productionPermissionRegistryAuthority: "C6C", authorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID, permissionIds: CONTROLLED_PRODUCTION_PERMISSION_IDS, state: createFailClosedControlledProductionPermissionState(), manifestCanMutatePermissionState: false },
  ),
  queryNamespaceRegistry: section(
    { authoritySource: "H helper, PKG-01 H executor, R executor, A contract", authorityClassification: "DERIVED_SOURCE" },
    { queryNamespaceOwnershipUnique: true, manifestDefinesNewQueryIds: false, namespaces: Object.freeze([
      deepFreeze({ namespace: "H", owner: "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER", count: PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length, executorContractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.contractId, executorContractVersion: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.version, executorContractFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT, remoteExecutionImplemented: false }),
      deepFreeze({ namespace: "R", owner: "REMOTE_READONLY_EXECUTOR", count: APPROVED_REMOTE_QUERY_IDS.length }),
      deepFreeze({ namespace: "A", owner: "AUDIT_INFRASTRUCTURE_CONTRACT", mappingCount: Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length, mappedObjectCount: AUDIT_INTERFACE_OBJECTS.length }),
    ]) },
  ),
  queryRelationshipRegistry: section(
    { authoritySource: "PKG-01, R executor, A contract", authorityClassification: "DERIVED_SOURCE" },
    { relationships: Object.freeze([
      deepFreeze({ relationshipId: "H_TO_R", relationship: "EXPLICITLY_SEPARATE_AUTHORITIES", translation: "NONE", mapping: "NONE", authorityMerger: false }),
      deepFreeze({ relationshipId: "H_TO_A", relationship: "NO_DIRECT_MAPPING", translation: "NONE", mapping: "NONE", authorityMerger: false }),
      deepFreeze({ relationshipId: "R_TO_A", relationship: "EXACTLY_ALIGNED", rCount: APPROVED_REMOTE_QUERY_IDS.length, aMappingCount: Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length, mappedObjectCount: AUDIT_INTERFACE_OBJECTS.length }),
    ]) },
  ),
  boundaryContractRegistry: section(
    { authoritySource: "Committed contract boundaries and known blockers", authorityClassification: "DERIVED_SOURCE" },
    { boundaries: Object.freeze([
      boundary("C4_TO_C5", "C4", "C5", "EXPLICIT_AND_BOUND", null), boundary("C5_TO_C6", "C5", "C6", "EXPLICIT_DESIGN_ONLY", null),
      boundary("C6ABC_TO_C6", "C6A/C6B/C6C", "C6", "EXPLICIT_DESIGN_ONLY", "CB-03"), boundary("C6_TO_C6D", "C6", "C6D", "EXPLICIT_AND_BOUND", null),
      boundary("C6D_TO_C7", "C6D", "C7", "EXPLICIT_AND_BOUND", null), boundary("C7_TO_C5", "C7", "C5", "EXPLICIT_AND_BOUND", null),
      boundary("HELPER_TO_H_EXECUTOR", "H helper", "H executor", "IMPLEMENTED_NOT_AUTHORIZED", null), boundary("R_TO_A", "R", "A", "EXPLICIT_AND_BOUND", null),
      boundary("C6C_TO_REMOTE_ACTION", "C6C", "future bounded remote action", "OPEN", "CB-02"), boundary("C6C_TO_AUTHORIZATION", "C6C", "C6 authorization envelope", "OPEN", "CB-03"),
      boundary("HELPER_C2_AUTH_REBIND", "helper/C2", "remote authorization state", "OPEN", "CB-09"), boundary("CREDENTIAL_TO_TRANSPORT", "credential provider", "transport", "MISSING", "CB-04"),
      boundary("TRANSPORT_TO_H", "transport", "future H execution boundary", "MISSING", "CB-06"), boundary("BACKUP_TO_CREDENTIAL", "backup evidence", "credential gate", "OPEN", "CB-05"),
      boundary("TARGET_TO_BOOTSTRAP", "production target evidence", "bootstrap decision", "OPEN", "CB-08"),
      deepFreeze({
        boundaryId: "PKG02_TO_PKG03_REMOTE_ACTION_AUTHORIZATION_HANDOFF",
        producer: "PKG-02 canonical architecture manifest",
        consumer: "future PKG-03 remote-action authorization contract",
        status: "OPEN_DESIGN_INPUT_READY",
        blockerIds: Object.freeze(["CB-02", "CB-03", "CB-09"]),
        authorityRole: "DESCRIPTIVE_BINDING_REFERENCE_ONLY",
        grantsAuthorization: false,
        manifestOwnsC2ExecutionContractAuthority: false,
        manifestDuplicatesC2CanonicalBindingValues: false,
        manifestCanMutateC2Binding: false,
        manifestConstructionCheckpointIsPkg03ExecutionCheckpointAuthority: false,
        credentialAccessRemainsSeparate: true,
        requirements: Object.freeze([
          deepFreeze({
            requirementId: "TARGET_FINGERPRINT",
            canonicalSource: "source-registry/controlled-production-preflight-execution-contracts.ts",
            sourceIdentity: "ControlledProductionPreflightExecutionManifest.targetFingerprint; ControlledProductionPreflightAuthorizationEnvelope.targetFingerprint; ControlledProductionPreflightBindingEvidence.targetFingerprint",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "C2 controlled production preflight execution contracts",
            requiredForPkg03Binding: true,
            targetFingerprintOwnedByManifest: false,
            targetFingerprintLiveValueStoredInManifest: false,
            readiness: "OPEN",
          }),
          deepFreeze({
            requirementId: "ARTIFACT_CHECKPOINT_BINDING",
            canonicalSource: "source-registry/controlled-production-preflight-execution-contracts.ts",
            sourceIdentity: "ControlledProductionPreflightExecutionManifest.sourceCommit; artifactFingerprintSet.artifactFingerprintSetId; ControlledProductionPreflightAuthorizationEnvelope.sourceCommit; artifactFingerprintSetId; validateManifestAuthorizationBinding",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "C2 controlled production preflight execution contracts",
            sourceCommitIdentity: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
            executionManifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
            authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
            requiredForPkg03Binding: true,
            readiness: "OPEN",
          }),
          deepFreeze({
            requirementId: "NONCE_BINDING",
            canonicalSource: "source-registry/controlled-production-preflight-execution-contracts.ts",
            sourceIdentity: "singleAttemptNonceReference on ControlledProductionPreflightExecutionManifest, ControlledProductionPreflightAuthorizationEnvelope, and ControlledProductionPreflightBindingEvidence",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "C2 controlled production preflight execution contracts",
            rawNoncePermittedInManifest: false,
            manifestContainsNonceMaterial: false,
            manifestOwnsNonceAuthority: false,
            requiredForPkg03Binding: true,
            readiness: "OPEN",
          }),
          deepFreeze({
            requirementId: "EXECUTION_WINDOW",
            canonicalSource: "source-registry/controlled-production-preflight-execution-contracts.ts",
            sourceIdentity: "ControlledProductionPreflightExecutionManifest.executionWindow; ControlledProductionPreflightAuthorizationEnvelope.executionWindowId; ControlledProductionPreflightBindingEvidence.executionWindowId",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "C2 controlled production preflight execution contracts",
            manifestStoresLiveExecutionWindow: false,
            manifestOwnsClockAuthority: false,
            requiredForPkg03Binding: true,
            readiness: "OPEN",
          }),
          deepFreeze({
            requirementId: "EXECUTOR_IDENTITY",
            canonicalSource: "source-registry/controlled-production-preflight-execution-contracts.ts",
            sourceIdentity: "ControlledProductionPreflightExecutionManifest.expectedExecutorIdentity",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "C2 controlled production preflight execution contracts",
            expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
            manifestOwnsExecutorIdentityAuthority: false,
            requiredForPkg03Binding: true,
            readiness: "OPEN",
          }),
          deepFreeze({
            requirementId: "BOUNDED_H_ACTION_DESCRIPTOR",
            canonicalSource: "source-registry/production-preflight-remote-executor-contract.ts",
            sourceIdentity: "ProductionPreflightHActionDescriptor; createProductionPreflightHActionDescriptor; ProductionPreflightHExecutionRequest",
            manifestRole: "REFERENCE_ONLY",
            authorityOwner: "PKG-01 H executor contract",
            contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.contractId,
            contractVersion: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.version,
            contractFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
            grantsAuthorization: false,
            manifestCreatesSecondHActionAuthority: false,
            requiredForPkg03Binding: true,
            readiness: "OPEN",
          }),
        ]),
      }),
    ]) },
  ),
  transportRegistry: section(
    { authoritySource: "Transport interface and executor source contracts", authorityClassification: "DERIVED_SOURCE" },
    { manifestClaimsProductionTransportImplemented: false, transports: Object.freeze([
      deepFreeze({ name: "ProductionReadOnlyPreflightTransport", state: "INTERFACE_ONLY" }), deepFreeze({ name: "ProductionPreflightHQueryExecutionPort", state: "CONTRACT_ONLY" }),
      deepFreeze({ name: "ControlledPreflightTransport", state: "INTERFACE_ONLY" }), deepFreeze({ name: "ControlledPostgresReadOnlyAdapter", state: "SYNTHETIC_ONLY" }),
      deepFreeze({ name: "ExternalReadonlyCommandBridge", state: "CONTRACT_ONLY" }), deepFreeze({ name: "real production network transport", state: "MISSING" }),
    ]) },
  ),
  credentialBoundary: section(
    { authoritySource: "C6A and credential/transport boundary design", authorityClassification: "DERIVED_SOURCE" },
    { credentialProviderActor: "defined architecturally", realExecutableProvider: "MISSING", credentialAccessAuthorized: false, credentialMaterialStoredInManifest: false, remoteExecutionPermissionImpliesCredentialAccess: false, backupRecoveryPrerequisite: "REQUIRED_UNVERIFIED" },
  ),
  databaseAuditInterface: section(
    { authoritySource: "audit-infrastructure-contract.ts and bootstrap source", authorityClassification: "DERIVED_SOURCE" },
    { schema: AUDIT_ROLE_NAMES.schema, expectedRoles: AUDIT_ROLE_NAMES, viewCount: 10, functionCount: 9, objectCount: AUDIT_INTERFACE_OBJECTS.length, approvedMappingCount: Object.keys(AUDIT_APPROVED_QUERY_MAPPING).length, soleSecurityDefiner: "vaylo_audit.migration_ledger()", pgcryptoRequirement: "extensions.digest(text,text)", bootstrapArtifactState: "SOURCE_PRESENT_NOT_AUTHORIZED", remotePresence: "UNVERIFIED" },
  ),
  lifecyclePrerequisiteGraph: section(
    { authoritySource: "Source-derived prerequisite contracts", authorityClassification: "DERIVED_SOURCE" },
    { nodes: lifecycleNodes, edges: lifecycleEdges },
  ),
  productionState: section(
    { authoritySource: "Committed local architecture baseline; remote facts require evidence", authorityClassification: "DERIVED_SOURCE" },
    { productionCredentialAccessed: false, remoteConnectionPerformed: false, productionReadOnlyPreflightExecuted: false, productionWritePerformed: false, productionRuntimeAuthorized: false, publicLaunchAuthorized: false, remoteExecutionAuthorized: false, backupRecoveryVerified: false, auditInfrastructureRemotePresence: "UNVERIFIED" },
  ),
  roadmapNamespace: section(
    { authoritySource: "This canonical modern roadmap declaration", authorityClassification: "CANONICAL_SOURCE" },
    { canonicalCurrentNamespace: "9X-POST-C7", canonicalRoadmapAuthorityDefined: true, historicalPhaseLabelGrantsCurrentAuthority: false, phaseLocalRecommendationGrantsGlobalAuthority: false, sequence: Object.freeze(["modern C4", "C5", "C6A/B/C", "C6", "C6D", "C7", "POST-C7 successor bridge", "PKG-01", "PKG-02 current manifest", "future PKG-03", "future PKG-04", "future PKG-05"]), cb10Status: "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" },
  ),
  historicalAndSupersededReferences: section(
    { authoritySource: "Explicit historical metadata only", authorityClassification: "HISTORICAL_METADATA" },
    { references: Object.freeze([
      deepFreeze({ identity: "historical C7 roadmap labels", historicalRole: "former phase-local roadmap", status: "HISTORICAL", currentReplacement: "9X-POST-C7" }),
      deepFreeze({ identity: "historical C8 roadmap labels", historicalRole: "former phase-local successor labels", status: "HISTORICAL", currentReplacement: "9X-POST-C7" }),
      deepFreeze({ identity: "phase-local recommendedNextPhase", historicalRole: "local audit handoff", status: "HISTORICAL", currentReplacement: "canonical roadmapNamespace" }),
    ]) },
  ),
  architectureInvariants: section(
    { authoritySource: "Source-supported architecture safety rules", authorityClassification: "DERIVED_SOURCE" },
    { invariants: Object.freeze([
      invariant("I01", "Synthetic success never grants production authority."), invariant("I02", "Remote execution authorization never implies credential access."),
      invariant("I03", "Credential access never implies database write authority."), invariant("I04", "Read-only query authority never implies bootstrap authority."),
      invariant("I05", "Controlled read-only paths reject raw SQL."), invariant("I06", "Every query identity has exactly one authority owner."),
      invariant("I07", "Cross-namespace execution requires an explicit mapping, adapter, or authority contract."), invariant("I08", "H and R are explicitly separate authorities."),
      invariant("I09", "H has no H-to-R translation."), invariant("I10", "R and A are exactly aligned."),
      invariant("I11", "Historical phase identities never grant current authority."), invariant("I12", "Committed migration source does not prove production presence."),
      invariant("I13", "MISSING and UNVERIFIED prerequisites can be truthful without being READY."), invariant("I14", "Production permissions remain fail-closed until separately authorized."),
      invariant("I15", "The manifest itself cannot grant authority."), invariant("I16", "The manifest cannot contain secrets."),
      invariant("I17", "Production facts requiring remote evidence cannot be invented from source."),
    ]) },
  ),
  knownMissingContracts: section(
    { authoritySource: "Current blocker architecture and committed PKG-01 truth", authorityClassification: "DERIVED_SOURCE" },
    { manifestDoesNotGrantBlockerClosureByAssertion: true, blockers: Object.freeze([
      deepFreeze({ blockerId: "CB-01", status: "CLOSED", basis: "PKG-01 dedicated H authority contract" }),
      ...["CB-02", "CB-03", "CB-04", "CB-05", "CB-06", "CB-07", "CB-08", "CB-09"].map((blockerId) => deepFreeze({ blockerId, status: "OPEN", basis: "downstream contract remains absent" })),
      deepFreeze({ blockerId: "CB-10", status: "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE", basis: "canonical roadmap manifest" }),
      deepFreeze({ blockerId: "CB-11", status: "OPEN", basis: "production authorization review remains absent" }),
    ]) },
  ),
});

const fingerprintPayload = JSON.stringify(manifestSemanticPayload);
export const CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT = createHash("sha256")
  .update(fingerprintPayload, "utf8").digest("hex");

export const CANONICAL_ARCHITECTURE_MANIFEST = deepFreeze({
  ...manifestSemanticPayload,
  manifestFingerprint: CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT,
  manifestFingerprintDeterministic: true,
  manifestFingerprintCredentialIndependent: true,
  manifestFingerprintEnvironmentIndependent: true,
  manifestFingerprintOrderingStable: true,
});

export type CanonicalArchitectureManifest = typeof CANONICAL_ARCHITECTURE_MANIFEST;

export const getCanonicalArchitectureManifest = (): CanonicalArchitectureManifest =>
  CANONICAL_ARCHITECTURE_MANIFEST;

export const isCanonicalArchitectureManifest = (
  value: unknown,
): value is CanonicalArchitectureManifest =>
  value === CANONICAL_ARCHITECTURE_MANIFEST;
