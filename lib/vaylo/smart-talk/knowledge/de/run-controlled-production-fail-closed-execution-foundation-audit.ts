import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  CANONICAL_ARCHITECTURE_MANIFEST,
  CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT,
  CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS,
} from "../source-registry/canonical-architecture-manifest";
import {
  createAuditOnlyAuthorizedRemoteActionDecision,
  evaluateControlledProductionRemoteActionAuthorization,
  isAuditOnlyControlledProductionRemoteActionAuthorizationDecision,
} from "../source-registry/controlled-production-remote-action-authorization-contract";
import {
  COMMITTED_ARTIFACT_INVENTORY,
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  OPERATOR_ACKNOWLEDGEMENT_IDS,
  fingerprintAuthorizationEnvelope,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
} from "../source-registry/controlled-production-preflight-execution-contracts";
import {
  acquireAuditOnlyProductionExecutionCredentialLease,
  acquireProductionExecutionCredentialLease,
  consumeProductionExecutionCredentialLease,
  createOpaqueProductionCredentialMaterial,
  type ProductionExecutionCredentialProvider,
} from "../source-registry/controlled-production-preflight-credential-and-transport-boundary";
import {
  executeAuditOnlyWithInjectedPgClient,
  executeAuditOnlyBoundedHRequest,
  executeBoundedProductionHRequest,
  type ConcretePgExecutionCounters,
} from "../source-registry/controlled-production-remote-execution-boundary";
import {
  CURRENT_PRODUCTION_BACKUP_EVIDENCE,
  CURRENT_PRODUCTION_PRESENCE_EVIDENCE,
  createAuditOnlyVerifiedBackupEvidence,
  createAuditOnlyVerifiedPresenceEvidence,
  isCanonicalBackupEvidence,
  isCanonicalPresenceEvidence,
  isProductionUsableBackupEvidence,
} from "../source-registry/production-preflight-prerequisite-evidence";
import {
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  resolveProductionPreflightHQueryContract,
  validateProductionPreflightHExecutionRequest,
} from "../source-registry/production-preflight-remote-executor-contract";
import {
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  createSyntheticProductionPreflightResultFixture,
} from "../source-registry/production-read-only-preflight-helper";

const CURRENT_TIME = "2026-08-08T10:00:00Z";
const TARGET = `target_sha256:${"a".repeat(64)}`;
const SHA_A = `sha256:${"1".repeat(64)}`;
const SHA_B = `sha256:${"2".repeat(64)}`;
const SHA_C = `sha256:${"3".repeat(64)}`;

function buildCanonicalCandidate() {
  const artifactSetId = "afset_pkg04-audit";
  const nonceReference = "nonce_pkg04_single_attempt_0001";
  const executionWindowId = "ewin_pkg04-window-01";
  const manifest = validateControlledProductionPreflightExecutionManifest(
    {
      manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
      manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSet: {
        artifactFingerprintSetId: artifactSetId,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifacts: COMMITTED_ARTIFACT_INVENTORY.map((artifact, index) => ({
          artifactId: artifact.artifactId,
          repositoryPath: artifact.repositoryPath,
          fingerprint: `sha256:${String(index + 1).repeat(64).slice(0, 64)}`,
        })),
      },
      targetFingerprint: TARGET,
      targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
      executionWindow: {
        executionWindowId,
        notBeforeIso: "2026-08-08T09:55:00Z",
        expiresAtIso: "2026-08-08T10:05:00Z",
      },
      singleAttemptNonceReference: nonceReference,
      canonicalQueryRegistryFingerprint: SHA_A,
      canonicalExecutionOrderFingerprint: SHA_B,
      safetySettingsFingerprint: SHA_C,
      expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
      operatorAcknowledgements: OPERATOR_ACKNOWLEDGEMENT_IDS.map(
        (acknowledgementId) => ({ acknowledgementId, confirmed: true }),
      ),
    },
    CURRENT_TIME,
  );
  if (!manifest.ok) throw new Error(`MANIFEST:${manifest.code}`);
  const authorization = validateControlledProductionPreflightAuthorizationEnvelope({
    authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifactFingerprintSetId: artifactSetId,
    targetFingerprint: TARGET,
    targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
    executionWindowId,
    singleAttemptNonceReference: nonceReference,
    operatorEvidenceConfirmed: true,
    remoteExecutionSeparatelyAuthorized: true,
  });
  if (!authorization.ok) throw new Error(`AUTHORIZATION:${authorization.code}`);
  const binding = validateManifestAuthorizationBinding(
    manifest.value,
    authorization.value,
  );
  if (!binding.ok) throw new Error(`BINDING:${binding.code}`);
  const queryId = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[0];
  const query = resolveProductionPreflightHQueryContract(queryId);
  if (!query.ok) throw new Error("QUERY");
  const requestResult = validateProductionPreflightHExecutionRequest({
    contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
    contractVersion: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
    contractFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    queryId,
    targetFingerprint: TARGET,
    executorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
    readOnly: true,
    resultContractId: query.value.resultContractId,
    authorizationReference: fingerprintAuthorizationEnvelope(authorization.value),
  });
  if (!requestResult.ok) throw new Error("REQUEST");
  return Object.freeze({
    candidate: Object.freeze({
      contractId: "VAYLO_CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT",
      contractVersion: 1,
      actionId: "EXECUTE_ONE_APPROVED_H_PREFLIGHT_QUERY",
      executionManifest: manifest.value,
      authorizationEnvelope: authorization.value,
      bindingEvidence: binding.value,
      hExecutionRequest: requestResult.value,
      currentTimeIso: CURRENT_TIME,
    }),
    request: requestResult.value,
  });
}

function accessorObject(source: object, key: string) {
  const output = { ...source };
  Object.defineProperty(output, key, {
    get: () => Reflect.get(source, key),
    enumerable: true,
  });
  return output;
}

function symbolObject(source: object) {
  return Object.defineProperty({ ...source }, Symbol("tamper"), { value: true });
}

const evidenceHostiles = (canonical: object): readonly unknown[] => {
  const clone = structuredClone(canonical);
  const mutable = { ...clone };
  Reflect.set(mutable, "state", "VERIFIED");
  return Object.freeze([
    null,
    [],
    {},
    clone,
    mutable,
    Object.setPrototypeOf({ ...clone }, null),
    Object.setPrototypeOf({ ...clone }, { inherited: true }),
    accessorObject(clone, "state"),
    symbolObject(clone),
    new Proxy({ ...clone }, {}),
    Object.freeze({ ...clone, extra: true }),
    "VERIFIED",
    Object.freeze({ ...clone, targetFingerprint: "wrong-target" }),
    Object.freeze({ ...clone, kind: "WRONG_EVIDENCE_KIND" }),
    Object.freeze({ ...clone, verificationSource: "MANIFEST_ASSERTION" }),
    Object.freeze({ ...clone, sourceCommit: "wrong-source" }),
    Object.freeze({ ...clone, expiresAtIso: "STALE" }),
  ]);
};

const presenceHostiles = (canonical: object): readonly unknown[] =>
  Object.freeze([
    ...evidenceHostiles(canonical),
    Object.freeze({ ...canonical, expectedViewCount: 9 }),
    Object.freeze({ ...canonical, expectedFunctionCount: 8 }),
    Object.freeze({ ...canonical, expectedObjectCount: 18 }),
    Object.freeze({ ...canonical, expectedMappingCount: 20 }),
    Object.freeze({
      ...canonical,
      securityDefinerIdentity: "vaylo_audit.other()",
    }),
    Object.freeze({ ...canonical, extensionSchema: "public" }),
  ]);

const GATE_IDS = Object.freeze([
  "repositoryAndScopeIntegrity",
  "canonicalAuthoritiesResolved",
  "backupPrerequisiteEvidenceBoundaryValid",
  "backupGatePrecedesCredentialAccess",
  "credentialLeaseBoundaryValid",
  "credentialLifecycleAndCleanupValid",
  "concreteApprovedReadOnlyTransportValid",
  "hNativeSingleQueryExecutionPreserved",
  "transportCannotAuthorize",
  "boundedRemoteExecutionBoundaryValid",
  "failClosedPrerequisiteOrderingValid",
  "productionPresenceEvidenceBoundaryValid",
  "localVsExternalEvidenceStateTruthful",
  "canonicalManifestUpdatedAndValid",
  "productionAuthorityPreserved",
  "downstreamScopeContained",
] as const);
type GateId = (typeof GATE_IDS)[number];
type GateValues = Readonly<Record<GateId, boolean>>;

function evaluate(values: GateValues) {
  const failedGateIds = GATE_IDS.filter((id) => !values[id]);
  return Object.freeze({
    allPassed: failedGateIds.length === 0,
    failedGateIds: Object.freeze(failedGateIds),
  });
}

async function runAudit(): Promise<void> {
  const canonical = buildCanonicalCandidate();
  const currentDecision = evaluateControlledProductionRemoteActionAuthorization(
    canonical.candidate,
  );
  const auditDecision = createAuditOnlyAuthorizedRemoteActionDecision(
    canonical.candidate,
  );
  if (!auditDecision) throw new Error("AUDIT_DECISION");

  const backup = createAuditOnlyVerifiedBackupEvidence(TARGET);
  const presence = createAuditOnlyVerifiedPresenceEvidence(TARGET);
  const backupTamperCases = evidenceHostiles(backup);
  const presenceTamperCases = presenceHostiles(presence);
  const backupTamperRejected = backupTamperCases.filter(
    (candidate) => !isCanonicalBackupEvidence(candidate),
  ).length;
  const presenceTamperRejected = presenceTamperCases.filter(
    (candidate) => !isCanonicalPresenceEvidence(candidate),
  ).length;

  let providerAcquireCount = 0;
  let providerReleaseCount = 0;
  const provider: ProductionExecutionCredentialProvider = Object.freeze({
    async acquire() {
      providerAcquireCount += 1;
      return createOpaqueProductionCredentialMaterial(
        "audit-only-not-used",
        "cmat_pkg04-audit-01",
      );
    },
    async release() {
      providerReleaseCount += 1;
    },
  });

  const rejectedDecisions = Object.freeze([
    currentDecision,
    evaluateControlledProductionRemoteActionAuthorization(null),
    evaluateControlledProductionRemoteActionAuthorization({}),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      contractId: "WRONG",
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      contractVersion: 2,
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      actionId: "WRONG",
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      executionManifest: {},
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      authorizationEnvelope: {},
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      bindingEvidence: {},
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      hExecutionRequest: {},
    }),
    evaluateControlledProductionRemoteActionAuthorization({
      ...canonical.candidate,
      currentTimeIso: "EXPIRED",
    }),
    evaluateControlledProductionRemoteActionAuthorization(
      Object.setPrototypeOf({ ...canonical.candidate }, null),
    ),
    evaluateControlledProductionRemoteActionAuthorization(
      accessorObject(canonical.candidate, "actionId"),
    ),
    evaluateControlledProductionRemoteActionAuthorization(
      symbolObject(canonical.candidate),
    ),
    evaluateControlledProductionRemoteActionAuthorization(
      new Proxy({ ...canonical.candidate }, {}),
    ),
  ]);
  const credentialRejectedResults = await Promise.all(
    rejectedDecisions.slice(0, 12).map((decision) =>
      acquireProductionExecutionCredentialLease(
        decision,
        backup,
        provider,
      ),
    ),
  );
  const credentialAuthorizationRejected = credentialRejectedResults.filter(
    (result) => !result.ok,
  ).length;
  const forgedLeaseBase = Object.freeze({
    kind: "PKG04_ONE_ATTEMPT_CREDENTIAL_LEASE",
    targetFingerprint: TARGET,
    queryId: canonical.request.queryId,
    actionId: "EXECUTE_ONE_APPROVED_H_PREFLIGHT_QUERY",
    nonceReference: "nonce_pkg04_single_attempt_0001",
    executionWindowId: "ewin_pkg04-window-01",
    executorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
    transport: "PG_CLIENT_ONE_SHOT",
    attemptCount: 0,
    released: false,
  });
  const credentialTamperCases = Object.freeze([
    forgedLeaseBase,
    { ...forgedLeaseBase, targetFingerprint: "wrong" },
    { ...forgedLeaseBase, queryId: "SERVER_VERSION" },
    { ...forgedLeaseBase, actionId: "WRITE" },
    { ...forgedLeaseBase, nonceReference: "wrong" },
    { ...forgedLeaseBase, executionWindowId: "wrong" },
    { ...forgedLeaseBase, executorIdentity: "wrong" },
    { ...forgedLeaseBase, transport: "BATCH" },
    { ...forgedLeaseBase, attemptCount: 1 },
    { ...forgedLeaseBase, released: true },
    Object.setPrototypeOf({ ...forgedLeaseBase }, null),
    accessorObject(forgedLeaseBase, "queryId"),
    symbolObject(forgedLeaseBase),
    structuredClone(forgedLeaseBase),
  ]);
  const forgedCredentialLeasesRejected = credentialTamperCases.filter(
    (lease) => consumeProductionExecutionCredentialLease(lease) === null,
  ).length;
  const credentialTamperRejected =
    credentialAuthorizationRejected + forgedCredentialLeasesRejected;

  const productionCounters: ConcretePgExecutionCounters = {
    clientConstructed: 0,
    connectCalls: 0,
    registryQueryCalls: 0,
    endCalls: 0,
  };
  const remoteResults = await Promise.all(
    rejectedDecisions.map((decision) =>
      executeBoundedProductionHRequest({
        decision,
        request: canonical.request,
        backupEvidence: CURRENT_PRODUCTION_BACKUP_EVIDENCE,
        credentialProvider: provider,
        counters: productionCounters,
      }),
    ),
  );
  const remoteTamperRejected = remoteResults.filter((result) => !result.ok).length;
  const currentPathProviderCalls = providerAcquireCount;

  const requestTamperCases: readonly unknown[] = Object.freeze([
    null,
    {},
    { ...canonical.request, sql: "select 1" },
    { ...canonical.request, queryId: "SERVER_VERSION" },
    { ...canonical.request, queryId: "UNKNOWN_H_QUERY" },
    {
      ...canonical.request,
      queryId: PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[1],
    },
    { ...canonical.request, targetFingerprint: "wrong-target" },
    { ...canonical.request, contractId: "WRONG" },
    { ...canonical.request, contractVersion: 2 },
    { ...canonical.request, contractFingerprint: "wrong" },
    { ...canonical.request, resultContractId: "wrong" },
    { ...canonical.request, executorIdentity: "wrong" },
    { ...canonical.request, authorizationReference: "wrong" },
    { ...canonical.request, readOnly: false },
    { ...canonical.request, batch: [canonical.request.queryId] },
    { ...canonical.request, write: true },
    { ...canonical.request, bootstrap: true },
    Object.setPrototypeOf({ ...canonical.request }, null),
    accessorObject(canonical.request, "queryId"),
    symbolObject(canonical.request),
    structuredClone(canonical.request),
  ]);
  let rejectedRequestConnectCalls = 0;
  const requestRejectingClient = Object.freeze({
    async connect() {
      rejectedRequestConnectCalls += 1;
    },
    async query() {
      return Object.freeze({ rows: Object.freeze([]) });
    },
    async end() {},
  });
  let transportTamperRejected = 0;
  for (const request of requestTamperCases) {
    try {
      await executeAuditOnlyWithInjectedPgClient(
        request,
        requestRejectingClient,
        {
          clientConstructed: 0,
          connectCalls: 0,
          registryQueryCalls: 0,
          endCalls: 0,
        },
      );
    } catch {
      transportTamperRejected += 1;
    }
  }

  const invalidRows: readonly unknown[] = Object.freeze([
    null, {}, [], "bad", 1, true,
    Object.freeze({ resultSchemaKey: "WRONG" }),
    Object.freeze({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }),
    Object.freeze({ extra: true }),
    Object.setPrototypeOf({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }, null),
    accessorObject({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }, "resultSchemaKey"),
    symbolObject({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }),
    new Proxy({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }, {}),
    structuredClone({ resultSchemaKey: "TARGET_IDENTITY_RESULT" }),
    Object.freeze({ resultSchemaKey: "TARGET_IDENTITY_RESULT", targetIdentityMatched: true }),
    Object.freeze({ resultSchemaKey: "TARGET_IDENTITY_RESULT", targetIdentityMatched: false }),
  ]);
  for (const invalidRow of invalidRows) {
    const counters: ConcretePgExecutionCounters = {
      clientConstructed: 0,
      connectCalls: 0,
      registryQueryCalls: 0,
      endCalls: 0,
    };
    const client = Object.freeze({
      async connect() {},
      async query(sql: string) {
        return Object.freeze({
          rows: sql === "BEGIN READ ONLY" || sql === "ROLLBACK"
            ? Object.freeze([])
            : Object.freeze([invalidRow]),
        });
      },
      async end() {},
    });
    try {
      await executeAuditOnlyWithInjectedPgClient(
        canonical.request,
        client,
        counters,
      );
    } catch {
      transportTamperRejected += 1;
    }
  }

  const fixture = createSyntheticProductionPreflightResultFixture(
    canonical.request.queryId,
  );
  const events: string[] = [];
  let canonicalQueryCount = 0;
  const injectedClient = Object.freeze({
    async connect() {
      events.push("connect");
    },
    async query(sql: string) {
      events.push(sql);
      if (sql === "BEGIN READ ONLY" || sql === "COMMIT") {
        return Object.freeze({ rows: Object.freeze([]) });
      }
      canonicalQueryCount += 1;
      return Object.freeze({ rows: Object.freeze([fixture.value]) });
    },
    async end() {
      events.push("end");
    },
  });
  const auditCounters: ConcretePgExecutionCounters = {
    clientConstructed: 0,
    connectCalls: 0,
    registryQueryCalls: 0,
    endCalls: 0,
  };
  let orderingClientCalls = 0;
  const orderingClient = Object.freeze({
    async connect() {
      orderingClientCalls += 1;
    },
    async query() {
      orderingClientCalls += 1;
      return Object.freeze({ rows: Object.freeze([]) });
    },
    async end() {
      orderingClientCalls += 1;
    },
  });
  const providerBeforeOrderingB = providerAcquireCount;
  const orderingB = await executeAuditOnlyBoundedHRequest({
    decision: auditDecision,
    request: canonical.request,
    backupEvidence: CURRENT_PRODUCTION_BACKUP_EVIDENCE,
    credentialProvider: provider,
    counters: auditCounters,
    client: orderingClient,
  });
  const providerAfterOrderingB = providerAcquireCount;
  const orderingC = await acquireAuditOnlyProductionExecutionCredentialLease(
    auditDecision,
    backup,
    null,
  );
  const deepResult = await executeAuditOnlyBoundedHRequest({
    decision: auditDecision,
    request: canonical.request,
    backupEvidence: backup,
    credentialProvider: provider,
    counters: auditCounters,
    client: injectedClient,
  });

  const source = readFileSync(
    resolve(
      process.cwd(),
      "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-remote-execution-boundary.ts",
    ),
    "utf8",
  );
  const blockers = CANONICAL_ARCHITECTURE_MANIFEST.knownMissingContracts.blockers;
  const blockerStatus = (id: string) =>
    blockers.find((entry) => entry.blockerId === id)?.status;
  const exactBlockerStates =
    blockerStatus("CB-04") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" &&
    blockerStatus("CB-05") ===
      "LOCAL_FOUNDATION_IMPLEMENTED_EXTERNAL_EVIDENCE_PENDING" &&
    blockerStatus("CB-06") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" &&
    blockerStatus("CB-07") === "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE" &&
    blockerStatus("CB-08") ===
      "LOCAL_FOUNDATION_IMPLEMENTED_EXTERNAL_EVIDENCE_PENDING";

  const gates: GateValues = Object.freeze({
    repositoryAndScopeIntegrity:
      COMMITTED_ARTIFACT_INVENTORY.length > 0 &&
      CANONICAL_ARCHITECTURE_MANIFEST.currentRepositoryCheckpoint.checkpoint ===
        "921caddaf6f6a65e176169807d00085993a0bbe4",
    canonicalAuthoritiesResolved:
      currentDecision.status === "REJECTED" &&
      auditDecision.queryId === canonical.request.queryId,
    backupPrerequisiteEvidenceBoundaryValid:
      isCanonicalBackupEvidence(backup) &&
      !isProductionUsableBackupEvidence(backup) &&
      backupTamperRejected === backupTamperCases.length,
    backupGatePrecedesCredentialAccess:
      currentPathProviderCalls === 0 &&
      remoteResults.every(
        (result) =>
          !result.ok && result.blocker === "PKG04_AUTHORIZATION_REJECTED",
      ),
    credentialLeaseBoundaryValid:
      credentialAuthorizationRejected === credentialRejectedResults.length &&
      forgedCredentialLeasesRejected === credentialTamperCases.length &&
      providerAcquireCount === 1,
    credentialLifecycleAndCleanupValid:
      providerReleaseCount === 1 &&
      events.at(-1) === "end",
    concreteApprovedReadOnlyTransportValid:
      source.includes('import { Client } from "pg"') &&
      source.includes("new Client({ connectionString })") &&
      auditCounters.clientConstructed === 0 &&
      auditCounters.connectCalls === 1 &&
      auditCounters.endCalls === 1 &&
      rejectedRequestConnectCalls === 0,
    hNativeSingleQueryExecutionPreserved:
      deepResult.ok &&
      canonicalQueryCount === 1 &&
      auditCounters.registryQueryCalls === 1,
    transportCannotAuthorize:
      !source.includes("evaluateControlledProductionRemoteActionAuthorization") &&
      !source.includes("createFailClosedControlledProductionPermissionState"),
    boundedRemoteExecutionBoundaryValid:
      deepResult.ok &&
      events[0] === "connect" &&
      events[1] === "BEGIN READ ONLY" &&
      events.at(-2) === "COMMIT",
    failClosedPrerequisiteOrderingValid:
      currentDecision.status === "REJECTED" &&
      remoteTamperRejected === remoteResults.length &&
      productionCounters.clientConstructed === 0 &&
      productionCounters.connectCalls === 0 &&
      productionCounters.registryQueryCalls === 0,
    productionPresenceEvidenceBoundaryValid:
      isCanonicalPresenceEvidence(presence) &&
      presenceTamperRejected === presenceTamperCases.length,
    localVsExternalEvidenceStateTruthful:
      CURRENT_PRODUCTION_BACKUP_EVIDENCE.state ===
        "REQUIRED_NOT_YET_VERIFIED" &&
      CURRENT_PRODUCTION_PRESENCE_EVIDENCE.state === "UNVERIFIED" &&
      backup.auditOnly &&
      presence.auditOnly,
    canonicalManifestUpdatedAndValid:
      CANONICAL_ARCHITECTURE_MANIFEST_FINGERPRINT.length === 64 &&
      CANONICAL_ARCHITECTURE_MANIFEST_SECTION_IDS.length === 19 &&
      exactBlockerStates,
    productionAuthorityPreserved:
      isAuditOnlyControlledProductionRemoteActionAuthorizationDecision(
        auditDecision,
      ) &&
      currentDecision.status === "REJECTED",
    downstreamScopeContained:
      source.includes("BEGIN READ ONLY") &&
      !source.includes("AUTHORIZE_PRODUCTION_WRITE") &&
      !source.includes("bootstrap"),
  });

  const baseline = evaluate(gates);
  const sensitivity = GATE_IDS.map((gateId) => {
    const mutated = Object.freeze({ ...gates, [gateId]: false });
    const result = evaluate(mutated);
    return Object.freeze({
      gateId,
      rejected: !result.allPassed &&
        result.failedGateIds.length === 1 &&
        result.failedGateIds[0] === gateId,
    });
  });
  const oneGateSensitivityPassed = sensitivity.every((entry) => entry.rejected);
  const allPassed =
    baseline.allPassed &&
    oneGateSensitivityPassed &&
    transportTamperRejected >= 16 &&
    backupTamperRejected >= 12 &&
    credentialTamperRejected >= 12 &&
    remoteTamperRejected >= 15 &&
    presenceTamperRejected >= 12;

  const report = Object.freeze({
    checkId: "9X-POST-C7-PKG-04-FAIL-CLOSED-EXECUTION-FOUNDATION",
    packageId: "PKG-04-FAIL-CLOSED-EXECUTION-FOUNDATION",
    blockerIds: Object.freeze([
      "CB-04-CREDENTIAL-BOUNDARY",
      "CB-05-LOCAL-BACKUP-EVIDENCE-FOUNDATION",
      "CB-06-PRODUCTION-READONLY-TRANSPORT",
      "CB-07-BOUNDED-REMOTE-EXECUTION-BOUNDARY",
      "CB-08-LOCAL-PRODUCTION-PRESENCE-EVIDENCE",
    ]),
    implementationDecision:
      "AUTHORIZE_PKG_04_FAIL_CLOSED_EXECUTION_FOUNDATION_CLOSURE",
    gates,
    mandatoryGateCount: GATE_IDS.length,
    mandatoryGatesPassed: GATE_IDS.filter((id) => gates[id]).length,
    sensitivity,
    oneGateSensitivityPassed,
    tamperRejections: Object.freeze({
      transport: transportTamperRejected,
      backup: backupTamperRejected,
      credential: credentialTamperRejected,
      remote: remoteTamperRejected,
      presence: presenceTamperRejected,
    }),
    orderingCases: Object.freeze({
      A_authorizationBeforeProvider: currentPathProviderCalls === 0,
      B_backupBeforeCredential:
        !orderingB.ok &&
        orderingB.blocker === "PKG04_BACKUP_NOT_VERIFIED" &&
        providerAfterOrderingB === providerBeforeOrderingB &&
        orderingClientCalls === 0,
      C_credentialBeforeTransport: !orderingC.ok && orderingClientCalls === 0,
      D_deepAuditExecution: deepResult.ok && providerReleaseCount === 1,
    }),
    concretePgSourcePathExists: source.includes("new Client"),
    realConnectionAuditCount: 0,
    productionCounters,
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed ? null : "PKG_04_AUDIT_GATE_FAILED",
    defectClassification: allPassed ? "NONE" : "IMPLEMENTATION_DEFECT",
  });
  console.log(JSON.stringify(report, null, 2));
  if (!allPassed) process.exitCode = 1;
}

void runAudit();
