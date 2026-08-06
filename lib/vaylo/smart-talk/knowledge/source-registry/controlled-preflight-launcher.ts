import "server-only";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
  parseClosedCapabilityCandidate,
  type TrustedCapabilityCandidateSnapshot,
} from "./controlled-preflight-launcher-capability-contract";
import {
  COMMITTED_ARTIFACT_INVENTORY,
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  OPERATOR_ACKNOWLEDGEMENT_IDS,
  validateControlledProductionPreflightArtifactFingerprintSet,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
} from "./controlled-production-preflight-execution-contracts";
import {
  createSyntheticCredentialProviderHarness,
  transitionCredentialLease,
  validateCredentialRequest,
  validateTransportFactoryRequest,
} from "./controlled-production-preflight-credential-and-transport-boundary";
import {
  CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
  createControlledPostgresReadOnlyAdapter,
  type ControlledPostgresReadOnlyAdapter,
} from "./controlled-production-postgres-read-only-adapter";
import {
  PRELIGHT_SAFETY_SETTINGS,
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
  type ProductionReadOnlyPreflightQueryId,
} from "./production-read-only-preflight-helper";

const OPERATOR_NONCE_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;
const SUCCESS_AUDIT_EVENT_BUDGET = 4;
const TARGET_FINGERPRINT = `target_sha256:${"a".repeat(64)}`;
const FIXED_FAILURE_CLOCK = "2026-08-06T00:05:00.000Z";
const FIXED_FAILURE_NONCE = "opnonce_fixed_failure_path_evidence_01";

export const CONTROLLED_PREFLIGHT_LAUNCHER_NONCE_POLICY =
  "OPERATOR_OWNED_BOUNDED_STRING" as const;

export type ControlledPreflightLauncherFailureStatus =
  | "INVALID_NONCE"
  | "NONCE_REPLAY"
  | "NONCE_CAPACITY_REACHED"
  | "AUDIT_CAPACITY_REACHED"
  | "ADAPTER_REJECTED"
  | "ADAPTER_EXCEPTION"
  | "INVALID_ADAPTER_LIFECYCLE"
  | "TRUSTED_QUERY_MISMATCH"
  | "ADAPTER_INIT_FAILED";

export type ControlledPreflightLauncherCreationFailureStatus =
  | "CAPABILITY_REJECTED"
  | "TRUSTED_QUERY_MISMATCH"
  | "ADAPTER_INIT_FAILED";

export type ControlledPreflightLaunchResult =
  | Readonly<{
      ok: true;
      status: "COMPLETED";
      queryCount: number;
      committed: true;
      closed: true;
      nonceState: "CONSUMED";
    }>
  | Readonly<{
      ok: false;
      status: ControlledPreflightLauncherFailureStatus;
      adapterInvoked: boolean;
      nonceState: "NOT_RESERVED" | "CONSUMED";
    }>;

export type ControlledPreflightLauncherCreationResult =
  | Readonly<{
      ok: true;
      launcher: ControlledSyntheticPreflightLauncher;
    }>
  | Readonly<{
      ok: false;
      status: ControlledPreflightLauncherCreationFailureStatus;
    }>;

export type ControlledPreflightLauncherStateSnapshot = Readonly<{
  storedNonceCount: number;
  reservedNonceCount: number;
  consumedNonceCount: number;
  auditEventCount: number;
  adapterInvocationCount: number;
  launcherStatus: "ACTIVE";
}>;

export type ControlledPreflightAuditEventKind =
  | "LAUNCH_REJECTED"
  | "NONCE_RESERVED"
  | "ADAPTER_STARTED"
  | "ADAPTER_COMPLETED"
  | "NONCE_CONSUMED";

export type ControlledPreflightAuditEvent = Readonly<{
  sequence: number;
  fixedClockSnapshot: string;
  eventKind: ControlledPreflightAuditEventKind;
  outcomeCategory: "SUCCESS" | "FAILURE" | "INFO";
  queryCount: number | null;
  committed: boolean | null;
  closed: boolean | null;
}>;

export type ControlledSyntheticPreflightLauncher = Readonly<{
  launch(nonce: unknown): Promise<ControlledPreflightLaunchResult>;
  getStateSnapshot(): ControlledPreflightLauncherStateSnapshot;
  getAuditTraceSnapshot(): ReadonlyArray<ControlledPreflightAuditEvent>;
}>;

export type FixedFailurePathScenarioEvidence = Readonly<{
  scenarioId:
    | "ADAPTER_REJECTED"
    | "ADAPTER_EXCEPTION"
    | "INVALID_ADAPTER_LIFECYCLE";
  initialLaunchAuthorized: boolean;
  initialStatus: ControlledPreflightLauncherFailureStatus | "COMPLETED";
  adapterInvocationCount: number;
  nonceReservedBeforeDriverInvocation: boolean;
  finalReservedNonceCount: number;
  finalConsumedNonceCount: number;
  replayRejected: boolean;
  replayStatus: ControlledPreflightLauncherFailureStatus | null;
  replayAdapterInvocationCount: number;
  uncaughtExceptionCount: number;
  rawErrorExposed: boolean;
  rawNonceExposed: boolean;
}>;

export type ControlledPreflightLauncherFixedFailurePathEvidence = Readonly<{
  sharedCoreUsed: true;
  productionCapable: false;
  externallyConfigurable: false;
  argumentCount: 0;
  scenarios: ReadonlyArray<FixedFailurePathScenarioEvidence>;
}>;

type NonceRecordState = "RESERVED" | "CONSUMED";

type AdapterDriverOutcome =
  | Readonly<{
      kind: "COMPLETED";
      queryCount: number;
      committed: boolean;
      closed: boolean;
      rolledBack: boolean;
      executedApprovedQueryCount: number;
      validatedApprovedQueryCount: number;
      canonicalOrderPreserved: boolean;
      sqlExecuted: boolean;
      remoteConnectionPerformed: boolean;
      productionCredentialAccessed: boolean;
      publicFieldCount: number;
    }>
  | Readonly<{
      kind: "REJECTED";
    }>;

type AdapterDriver = Readonly<{
  run(
    trustedQueryIds: ReadonlyArray<ProductionReadOnlyPreflightQueryId>,
    fixedClockSnapshot: string,
  ): Promise<AdapterDriverOutcome>;
}>;

const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object") return value;
  for (const key of Reflect.ownKeys(value as object)) {
    const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
    if (descriptor && "value" in descriptor) {
      deepFreeze(descriptor.value);
    }
  }
  return Object.freeze(value);
};

const hexFingerprint = (seed: string): string => {
  let out = "";
  for (let index = 0; out.length < 64; index += 1) {
    out += (seed.charCodeAt(index % seed.length) % 16).toString(16);
  }
  return `sha256:${out}`;
};

const trustedQueriesExact = (
  snapshot: TrustedCapabilityCandidateSnapshot,
): boolean => {
  const queryIds = snapshot.manifest.queryIds;
  const fixtures = snapshot.manifest.fixtureSnapshots;
  if (queryIds.length !== PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length) {
    return false;
  }
  if (fixtures.length !== queryIds.length) return false;
  for (let index = 0; index < queryIds.length; index += 1) {
    if (queryIds[index] !== PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[index]) {
      return false;
    }
    const fixture = fixtures[index];
    if (
      !fixture ||
      fixture.queryId !== queryIds[index] ||
      typeof fixture.rows !== "number" ||
      !Number.isInteger(fixture.rows) ||
      fixture.rows < 0
    ) {
      return false;
    }
  }
  return (
    snapshot.contractId === CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID &&
    snapshot.contractVersion ===
      CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION &&
    snapshot.authorizationClass ===
      CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS &&
    snapshot.productionCapabilityCount === 0 &&
    snapshot.allowedCapabilities.length ===
      CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length &&
    snapshot.forbiddenCapabilities.length ===
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length
  );
};

const createSyntheticAdapter = (
  serial: number,
  fixedClockSnapshot: string,
): ControlledPostgresReadOnlyAdapter | null => {
  const suffix = String(serial).padStart(4, "0");
  const artifactSet = validateControlledProductionPreflightArtifactFingerprintSet({
    artifactFingerprintSetId: `afset_c5-launcher-${suffix}`,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifacts: COMMITTED_ARTIFACT_INVENTORY.map((item, index) => ({
      artifactId: item.artifactId,
      repositoryPath: item.repositoryPath,
      fingerprint: hexFingerprint(`${suffix}${index}c5`),
    })),
  });
  if (!artifactSet.ok) return null;

  const acknowledgements = OPERATOR_ACKNOWLEDGEMENT_IDS.map(
    (acknowledgementId) => ({
      acknowledgementId,
      confirmed: true,
    }),
  );

  const windowStart = "2026-08-06T00:00:00.000Z";
  const windowEnd = "2026-08-06T00:10:00.000Z";
  const manifest = validateControlledProductionPreflightExecutionManifest(
    {
      manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
      manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSet: artifactSet.value,
      targetFingerprint: TARGET_FINGERPRINT,
      targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
      executionWindow: {
        executionWindowId: `ewin_c5-launcher-${suffix}`,
        notBeforeIso: windowStart,
        expiresAtIso: windowEnd,
      },
      singleAttemptNonceReference: `nonce_c5_launcher_bound_${suffix}abcdef`,
      canonicalQueryRegistryFingerprint: hexFingerprint(`${suffix}reg`),
      canonicalExecutionOrderFingerprint: hexFingerprint(`${suffix}ord`),
      safetySettingsFingerprint: hexFingerprint(`${suffix}saf`),
      expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
      operatorAcknowledgements: acknowledgements,
    },
    fixedClockSnapshot,
  );
  if (!manifest.ok) return null;

  const authorization = validateControlledProductionPreflightAuthorizationEnvelope({
    authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    artifactFingerprintSetId: artifactSet.value.artifactFingerprintSetId,
    targetFingerprint: TARGET_FINGERPRINT,
    targetPurpose: manifest.value.targetPurpose,
    executionWindowId: manifest.value.executionWindow.executionWindowId,
    singleAttemptNonceReference: manifest.value.singleAttemptNonceReference,
    operatorEvidenceConfirmed: true,
    remoteExecutionSeparatelyAuthorized: true,
  });
  if (!authorization.ok) return null;

  const binding = validateManifestAuthorizationBinding(
    manifest.value,
    authorization.value,
  );
  if (!binding.ok) return null;

  const provider = createSyntheticCredentialProviderHarness();
  const credentialRequest = validateCredentialRequest({
    validatedManifest: manifest.value,
    validatedAuthorization: authorization.value,
    validatedBinding: binding.value,
    credentialRequestId: `creq_c5-launcher-${suffix}`,
  });
  if (!credentialRequest.ok) return null;
  const issued = provider.acquireCredentialLease(credentialRequest.value);
  if (!issued.ok) return null;
  const lease = transitionCredentialLease(issued.value, "LEASE_ACTIVE");
  if (!lease.ok) return null;

  const transportRequest = validateTransportFactoryRequest({
    validatedManifest: manifest.value,
    validatedAuthorization: authorization.value,
    validatedBinding: binding.value,
    activeCredentialLease: lease.value,
    transportConstructionId: `tcon_c5-launcher-${suffix}`,
  });
  if (!transportRequest.ok) return null;

  const created = createControlledPostgresReadOnlyAdapter({
    validatedManifest: manifest.value,
    validatedAuthorization: authorization.value,
    validatedBinding: binding.value,
    activeCredentialLease: lease.value,
    validatedTransportFactoryRequest: transportRequest.value,
    adapterId: `padapter_c5-launcher-${suffix}`,
    adapterMode: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
  });
  if (!created.ok) return null;
  return created.value;
};

const createProductionAdapterDriver = (): AdapterDriver => {
  let serial = 0;
  return Object.freeze({
    async run(trustedQueryIds, fixedClockSnapshot) {
      const adapter = createSyntheticAdapter(
        (serial += 1),
        fixedClockSnapshot,
      );
      if (!adapter) {
        return Object.freeze({ kind: "REJECTED" as const });
      }
      await adapter.openSession();
      await adapter.verifySafetySettings(PRELIGHT_SAFETY_SETTINGS);
      await adapter.beginReadOnlyTransaction();
      let queryCount = 0;
      for (let index = 0; index < trustedQueryIds.length; index += 1) {
        await adapter.executeApprovedQuery(trustedQueryIds[index]!);
        queryCount += 1;
      }
      await adapter.commitReadOnlyTransaction();
      await adapter.close();
      const evidence = adapter.getBoundedLifecycleEvidence();
      return Object.freeze({
        kind: "COMPLETED" as const,
        queryCount,
        committed: evidence.committed === true,
        closed: evidence.closed === true,
        rolledBack: evidence.rolledBack === true,
        executedApprovedQueryCount: evidence.executedApprovedQueryCount,
        validatedApprovedQueryCount: evidence.validatedApprovedQueryCount,
        canonicalOrderPreserved: evidence.canonicalOrderPreserved === true,
        sqlExecuted: evidence.sqlExecuted,
        remoteConnectionPerformed: evidence.remoteConnectionPerformed,
        productionCredentialAccessed: evidence.productionCredentialAccessed,
        publicFieldCount: Object.keys(adapter).length,
      });
    },
  });
};

const isValidOperatorNonce = (value: unknown): value is string =>
  typeof value === "string" && OPERATOR_NONCE_PATTERN.test(value);

const failureResult = (
  status: ControlledPreflightLauncherFailureStatus,
  adapterInvoked: boolean,
  nonceState: "NOT_RESERVED" | "CONSUMED",
): ControlledPreflightLaunchResult =>
  deepFreeze({
    ok: false as const,
    status,
    adapterInvoked,
    nonceState,
  });

const successResult = (
  queryCount: number,
): ControlledPreflightLaunchResult =>
  deepFreeze({
    ok: true as const,
    status: "COMPLETED" as const,
    queryCount,
    committed: true as const,
    closed: true as const,
    nonceState: "CONSUMED" as const,
  });

/**
 * Shared launcher core: single nonce state machine and finally-consumption path
 * used by both the production factory and the fixed synthetic failure self-test.
 */
const createLauncherCore = (
  trustedSnapshot: TrustedCapabilityCandidateSnapshot,
  adapterDriver: AdapterDriver,
): ControlledSyntheticPreflightLauncher => {
  const nonceRegistry = new Map<string, NonceRecordState>();
  const auditTrace: ControlledPreflightAuditEvent[] = [];
  let adapterInvocationCount = 0;
  const fixedClockSnapshot = trustedSnapshot.manifest.fixedClockSnapshot;
  const trustedQueryIds = Object.freeze(
    trustedSnapshot.manifest.queryIds.map((queryId) =>
      queryId as ProductionReadOnlyPreflightQueryId,
    ),
  );
  const maximumNonceEntries = trustedSnapshot.manifest.nonce.maximumEntries;
  const maximumAuditEvents = trustedSnapshot.manifest.auditTrace.maximumEvents;

  const appendAuditEvent = (
    eventKind: ControlledPreflightAuditEventKind,
    outcomeCategory: "SUCCESS" | "FAILURE" | "INFO",
    queryCount: number | null,
    committed: boolean | null,
    closed: boolean | null,
  ): boolean => {
    if (auditTrace.length >= maximumAuditEvents) return false;
    auditTrace.push(
      deepFreeze({
        sequence: auditTrace.length + 1,
        fixedClockSnapshot,
        eventKind,
        outcomeCategory,
        queryCount,
        committed,
        closed,
      }),
    );
    return true;
  };

  const launch = async (
    nonce: unknown,
  ): Promise<ControlledPreflightLaunchResult> => {
    if (!isValidOperatorNonce(nonce)) {
      if (auditTrace.length < maximumAuditEvents) {
        appendAuditEvent("LAUNCH_REJECTED", "FAILURE", null, null, null);
      }
      return failureResult("INVALID_NONCE", false, "NOT_RESERVED");
    }

    if (auditTrace.length + SUCCESS_AUDIT_EVENT_BUDGET > maximumAuditEvents) {
      return failureResult("AUDIT_CAPACITY_REACHED", false, "NOT_RESERVED");
    }

    const existing = nonceRegistry.get(nonce);
    if (existing === "RESERVED" || existing === "CONSUMED") {
      appendAuditEvent("LAUNCH_REJECTED", "FAILURE", null, null, null);
      return failureResult("NONCE_REPLAY", false, "NOT_RESERVED");
    }

    if (nonceRegistry.size >= maximumNonceEntries) {
      appendAuditEvent("LAUNCH_REJECTED", "FAILURE", null, null, null);
      return failureResult("NONCE_CAPACITY_REACHED", false, "NOT_RESERVED");
    }

    // Synchronous reservation before any await boundary.
    nonceRegistry.set(nonce, "RESERVED");
    appendAuditEvent("NONCE_RESERVED", "INFO", null, null, null);

    let adapterInvoked = false;
    let queryCount = 0;
    let committed = false;
    let closed = false;

    try {
      adapterInvoked = true;
      adapterInvocationCount += 1;
      appendAuditEvent("ADAPTER_STARTED", "INFO", null, null, null);

      const outcome = await adapterDriver.run(
        trustedQueryIds,
        fixedClockSnapshot,
      );

      if (outcome.kind === "REJECTED") {
        appendAuditEvent("ADAPTER_COMPLETED", "FAILURE", 0, false, false);
        return failureResult("ADAPTER_REJECTED", true, "CONSUMED");
      }

      queryCount = outcome.queryCount;
      committed = outcome.committed;
      closed = outcome.closed;
      const lifecycleValid =
        outcome.committed &&
        outcome.closed &&
        outcome.rolledBack === false &&
        outcome.executedApprovedQueryCount === trustedQueryIds.length &&
        outcome.validatedApprovedQueryCount === trustedQueryIds.length &&
        outcome.canonicalOrderPreserved === true &&
        outcome.sqlExecuted === false &&
        outcome.remoteConnectionPerformed === false &&
        outcome.productionCredentialAccessed === false &&
        outcome.publicFieldCount === 13;

      appendAuditEvent(
        "ADAPTER_COMPLETED",
        lifecycleValid ? "SUCCESS" : "FAILURE",
        queryCount,
        committed,
        closed,
      );

      if (!lifecycleValid) {
        return failureResult("INVALID_ADAPTER_LIFECYCLE", true, "CONSUMED");
      }
      return successResult(queryCount);
    } catch {
      appendAuditEvent(
        "ADAPTER_COMPLETED",
        "FAILURE",
        queryCount,
        committed,
        closed,
      );
      return failureResult("ADAPTER_EXCEPTION", adapterInvoked, "CONSUMED");
    } finally {
      // First non-trivial finally operation: consume reserved nonce.
      nonceRegistry.set(nonce, "CONSUMED");
      appendAuditEvent("NONCE_CONSUMED", "INFO", queryCount, committed, closed);
    }
  };

  const getStateSnapshot = (): ControlledPreflightLauncherStateSnapshot => {
    let reservedNonceCount = 0;
    let consumedNonceCount = 0;
    for (const state of nonceRegistry.values()) {
      if (state === "RESERVED") reservedNonceCount += 1;
      if (state === "CONSUMED") consumedNonceCount += 1;
    }
    return deepFreeze({
      storedNonceCount: nonceRegistry.size,
      reservedNonceCount,
      consumedNonceCount,
      auditEventCount: auditTrace.length,
      adapterInvocationCount,
      launcherStatus: "ACTIVE" as const,
    });
  };

  const getAuditTraceSnapshot = (): ReadonlyArray<ControlledPreflightAuditEvent> =>
    deepFreeze(
      auditTrace.map((event) =>
        deepFreeze({
          sequence: event.sequence,
          fixedClockSnapshot: event.fixedClockSnapshot,
          eventKind: event.eventKind,
          outcomeCategory: event.outcomeCategory,
          queryCount: event.queryCount,
          committed: event.committed,
          closed: event.closed,
        }),
      ),
    );

  return Object.freeze({
    launch,
    getStateSnapshot,
    getAuditTraceSnapshot,
  });
};

const createFixedTrustedCandidate = () =>
  deepFreeze({
    contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
    productionCapabilityCount: 0,
    allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    manifest: {
      queryIds: Object.freeze([...PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER]),
      fixtureSnapshots: Object.freeze(
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.map((queryId) =>
          Object.freeze({ queryId, rows: 1 }),
        ),
      ),
      fixedClockSnapshot: FIXED_FAILURE_CLOCK,
      nonce: Object.freeze({
        mode: "EPHEMERAL_IN_MEMORY" as const,
        maximumEntries: 8,
      }),
      auditTrace: Object.freeze({
        mode: "IN_MEMORY" as const,
        maximumEvents: 64,
      }),
    },
  });

/** Module-private fixed drivers for synthetic failure-path evidence only. */
const createFixedRejectedDriver = (): AdapterDriver =>
  Object.freeze({
    async run() {
      return Object.freeze({ kind: "REJECTED" as const });
    },
  });

const createFixedExceptionDriver = (): AdapterDriver =>
  Object.freeze({
    async run() {
      throw new Error("FIXED_SYNTHETIC_ADAPTER_EXCEPTION");
    },
  });

const createFixedInvalidLifecycleDriver = (): AdapterDriver =>
  Object.freeze({
    async run(trustedQueryIds) {
      return Object.freeze({
        kind: "COMPLETED" as const,
        queryCount: trustedQueryIds.length,
        committed: false,
        closed: false,
        rolledBack: false,
        executedApprovedQueryCount: trustedQueryIds.length,
        validatedApprovedQueryCount: trustedQueryIds.length,
        canonicalOrderPreserved: true,
        sqlExecuted: false,
        remoteConnectionPerformed: false,
        productionCredentialAccessed: false,
        publicFieldCount: 13,
      });
    },
  });

const observeFixedScenario = async (
  scenarioId: FixedFailurePathScenarioEvidence["scenarioId"],
  expectedStatus: ControlledPreflightLauncherFailureStatus,
  driver: AdapterDriver,
  trustedSnapshot: TrustedCapabilityCandidateSnapshot,
): Promise<FixedFailurePathScenarioEvidence> => {
  const launcher = createLauncherCore(trustedSnapshot, driver);
  let uncaughtExceptionCount = 0;
  let initial: ControlledPreflightLaunchResult;
  try {
    initial = await launcher.launch(FIXED_FAILURE_NONCE);
  } catch {
    uncaughtExceptionCount += 1;
    initial = failureResult(expectedStatus, true, "CONSUMED");
  }
  const afterInitial = launcher.getStateSnapshot();
  const auditAfterInitial = launcher.getAuditTraceSnapshot();
  const reservedIdx = auditAfterInitial.findIndex(
    (event) => event.eventKind === "NONCE_RESERVED",
  );
  const startedIdx = auditAfterInitial.findIndex(
    (event) => event.eventKind === "ADAPTER_STARTED",
  );
  let replay: ControlledPreflightLaunchResult;
  const adapterCountBeforeReplay = afterInitial.adapterInvocationCount;
  try {
    replay = await launcher.launch(FIXED_FAILURE_NONCE);
  } catch {
    uncaughtExceptionCount += 1;
    replay = failureResult("NONCE_REPLAY", false, "NOT_RESERVED");
  }
  const afterReplay = launcher.getStateSnapshot();
  const encoded = JSON.stringify({
    initial,
    replay,
    state: afterReplay,
    audit: launcher.getAuditTraceSnapshot(),
  });
  return deepFreeze({
    scenarioId,
    initialLaunchAuthorized: initial.ok === true,
    initialStatus: initial.ok ? ("COMPLETED" as const) : initial.status,
    adapterInvocationCount: afterInitial.adapterInvocationCount,
    nonceReservedBeforeDriverInvocation:
      reservedIdx >= 0 && startedIdx > reservedIdx,
    finalReservedNonceCount: afterReplay.reservedNonceCount,
    finalConsumedNonceCount: afterReplay.consumedNonceCount,
    replayRejected: replay.ok === false && replay.status === "NONCE_REPLAY",
    replayStatus: !replay.ok ? replay.status : null,
    replayAdapterInvocationCount: Math.max(
      0,
      afterReplay.adapterInvocationCount - adapterCountBeforeReplay,
    ),
    uncaughtExceptionCount,
    rawErrorExposed: encoded.includes("FIXED_SYNTHETIC_ADAPTER_EXCEPTION"),
    rawNonceExposed: encoded.includes(FIXED_FAILURE_NONCE),
  });
};

/**
 * Create a controlled synthetic preflight launcher bound to a trusted C4
 * capability snapshot. The factory parses the unknown candidate exactly once
 * and never retains the untrusted input.
 */
export function createControlledSyntheticPreflightLauncher(
  capabilityCandidate: unknown,
): ControlledPreflightLauncherCreationResult {
  const parsed = parseClosedCapabilityCandidate(capabilityCandidate);
  if (!parsed.ok) {
    return deepFreeze({
      ok: false as const,
      status: "CAPABILITY_REJECTED" as const,
    });
  }

  const trustedSnapshot = parsed.value;
  if (!trustedQueriesExact(trustedSnapshot)) {
    return deepFreeze({
      ok: false as const,
      status: "TRUSTED_QUERY_MISMATCH" as const,
    });
  }

  const probe = createSyntheticAdapter(
    1,
    trustedSnapshot.manifest.fixedClockSnapshot,
  );
  if (!probe) {
    return deepFreeze({
      ok: false as const,
      status: "ADAPTER_INIT_FAILED" as const,
    });
  }

  const launcher = createLauncherCore(
    trustedSnapshot,
    createProductionAdapterDriver(),
  );

  return deepFreeze({
    ok: true as const,
    launcher,
  });
}

/**
 * INTERNAL / SYNTHETIC / AUDIT-ONLY.
 * Zero-argument fixed failure-path evidence over the shared launcher core.
 * Not part of the public three-method launcher surface and not production-capable.
 */
export async function runControlledPreflightLauncherFixedFailurePathEvidence(): Promise<ControlledPreflightLauncherFixedFailurePathEvidence> {
  const parsed = parseClosedCapabilityCandidate(createFixedTrustedCandidate());
  if (!parsed.ok || !trustedQueriesExact(parsed.value)) {
    return deepFreeze({
      sharedCoreUsed: true as const,
      productionCapable: false as const,
      externallyConfigurable: false as const,
      argumentCount: 0 as const,
      scenarios: Object.freeze([]),
    });
  }
  const trustedSnapshot = parsed.value;
  const scenarios = Object.freeze([
    await observeFixedScenario(
      "ADAPTER_REJECTED",
      "ADAPTER_REJECTED",
      createFixedRejectedDriver(),
      trustedSnapshot,
    ),
    await observeFixedScenario(
      "ADAPTER_EXCEPTION",
      "ADAPTER_EXCEPTION",
      createFixedExceptionDriver(),
      trustedSnapshot,
    ),
    await observeFixedScenario(
      "INVALID_ADAPTER_LIFECYCLE",
      "INVALID_ADAPTER_LIFECYCLE",
      createFixedInvalidLifecycleDriver(),
      trustedSnapshot,
    ),
  ]);
  return deepFreeze({
    sharedCoreUsed: true as const,
    productionCapable: false as const,
    externallyConfigurable: false as const,
    argumentCount: 0 as const,
    scenarios,
  });
}
