import "server-only";

import {
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  deepFreezeContract,
  isValidatedControlledProductionPreflightAuthorizationEnvelope,
  isValidatedControlledProductionPreflightBindingEvidence,
  isValidatedControlledProductionPreflightExecutionManifest,
  redactTargetFingerprint,
  type ControlledProductionPreflightAuthorizationEnvelope,
  type ControlledProductionPreflightBindingEvidence,
  type ControlledProductionPreflightExecutionManifest,
} from "./controlled-production-preflight-execution-contracts";
import {
  isControlledCredentialLease,
  validateTransportFactoryRequest,
  type CredentialLeasePublicView,
  type TransportFactoryRequest,
} from "./controlled-production-preflight-credential-and-transport-boundary";
import {
  createSyntheticProductionPreflightResultFixture,
  isHelperCreatedSyntheticProductionPreflightResultFixture,
  PRELIGHT_SAFETY_SETTINGS,
  PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER,
  PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY,
  type ProductionReadOnlyPreflightQueryId,
} from "./production-read-only-preflight-helper";

export const CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND =
  "CONTROLLED_POSTGRES_READ_ONLY_PREFLIGHT_ADAPTER" as const;
export const CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION = "1" as const;
export const CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE =
  "SYNTHETIC_VALIDATION_ONLY" as const;

export const CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_STATES = Object.freeze([
  "ADAPTER_CREATED",
  "SESSION_OPEN",
  "SAFETY_VERIFIED",
  "READ_ONLY_TRANSACTION_OPEN",
  "QUERY_EXECUTION_ACTIVE",
  "READ_ONLY_TRANSACTION_COMMITTED",
  "READ_ONLY_TRANSACTION_ROLLED_BACK",
  "CLOSE_REQUESTED",
  "CLOSED",
  "FAILED",
] as const);
export type ControlledPostgresReadOnlyAdapterState =
  (typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_STATES)[number];

export const SYNTHETIC_FAILURE_INJECTION_POINTS = Object.freeze([
  "SESSION_OPEN",
  "SAFETY_VERIFICATION",
  "TRANSACTION_BEGIN",
  "QUERY_01",
  "QUERY_02",
  "QUERY_03",
  "QUERY_04",
  "QUERY_05",
  "QUERY_06",
  "QUERY_07",
  "QUERY_08",
  "QUERY_09",
  "QUERY_10",
  "QUERY_11",
  "QUERY_12",
  "QUERY_13",
  "QUERY_14",
  "QUERY_15",
  "QUERY_16",
  "QUERY_17",
  "QUERY_18",
  "VALIDATION_01",
  "VALIDATION_02",
  "VALIDATION_03",
  "VALIDATION_04",
  "VALIDATION_05",
  "VALIDATION_06",
  "VALIDATION_07",
  "VALIDATION_08",
  "VALIDATION_09",
  "VALIDATION_10",
  "VALIDATION_11",
  "VALIDATION_12",
  "VALIDATION_13",
  "VALIDATION_14",
  "VALIDATION_15",
  "VALIDATION_16",
  "VALIDATION_17",
  "VALIDATION_18",
  "COMMIT",
  "ROLLBACK",
  "CLOSE",
] as const);
export type SyntheticFailureInjectionPoint =
  (typeof SYNTHETIC_FAILURE_INJECTION_POINTS)[number];

const CLEANUP_FAILURE_POINTS = Object.freeze(["ROLLBACK", "CLOSE"] as const);
type CleanupFailurePoint = (typeof CLEANUP_FAILURE_POINTS)[number];

export type SyntheticValidationOnlyFailurePlan = Readonly<{
  mode: "SYNTHETIC_VALIDATION_ONLY";
  primaryFailurePoint: SyntheticFailureInjectionPoint;
  cleanupFailurePoints: readonly CleanupFailurePoint[];
}>;

export const CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_ERROR_CODES = Object.freeze([
  "ADAPTER_PROVENANCE_INVALID",
  "ADAPTER_STATE_INVALID",
  "SESSION_ALREADY_OPEN",
  "SESSION_NOT_OPEN",
  "SESSION_OPEN_FAILED",
  "SAFETY_SETTINGS_INVALID",
  "SAFETY_NOT_VERIFIED",
  "TRANSACTION_ALREADY_OPEN",
  "TRANSACTION_NOT_OPEN",
  "TRANSACTION_BEGIN_FAILED",
  "QUERY_ID_NOT_APPROVED",
  "QUERY_ORDER_VIOLATION",
  "QUERY_ALREADY_EXECUTED",
  "QUERY_EXECUTION_ALREADY_ACTIVE",
  "QUERY_RESULT_NOT_VALIDATED",
  "QUERY_VALIDATION_ACKNOWLEDGEMENT_INVALID",
  "QUERY_EXECUTION_FAILED",
  "QUERY_RESULT_VALIDATION_FAILED",
  "COMMIT_PRECONDITION_FAILED",
  "COMMIT_FAILED",
  "ROLLBACK_NOT_ELIGIBLE",
  "ROLLBACK_FAILED",
  "CLOSE_FAILED",
  "ADAPTER_ALREADY_FAILED",
  "ADAPTER_CLOSED",
  "SYNTHETIC_FIXTURE_INVALID",
  "SYNTHETIC_HANDLER_MISSING",
  "SYNTHETIC_FAILURE_PLAN_INVALID",
  "ADAPTER_UNKNOWN_FAILURE",
] as const);
export type ControlledPostgresReadOnlyAdapterErrorCode =
  (typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_ERROR_CODES)[number];

const FAILURE_POINT_SAFE_CODES = Object.freeze({
  SESSION_OPEN: "SESSION_OPEN_FAILED",
  SAFETY_VERIFICATION: "SAFETY_SETTINGS_INVALID",
  TRANSACTION_BEGIN: "TRANSACTION_BEGIN_FAILED",
  QUERY_01: "QUERY_EXECUTION_FAILED",
  QUERY_02: "QUERY_EXECUTION_FAILED",
  QUERY_03: "QUERY_EXECUTION_FAILED",
  QUERY_04: "QUERY_EXECUTION_FAILED",
  QUERY_05: "QUERY_EXECUTION_FAILED",
  QUERY_06: "QUERY_EXECUTION_FAILED",
  QUERY_07: "QUERY_EXECUTION_FAILED",
  QUERY_08: "QUERY_EXECUTION_FAILED",
  QUERY_09: "QUERY_EXECUTION_FAILED",
  QUERY_10: "QUERY_EXECUTION_FAILED",
  QUERY_11: "QUERY_EXECUTION_FAILED",
  QUERY_12: "QUERY_EXECUTION_FAILED",
  QUERY_13: "QUERY_EXECUTION_FAILED",
  QUERY_14: "QUERY_EXECUTION_FAILED",
  QUERY_15: "QUERY_EXECUTION_FAILED",
  QUERY_16: "QUERY_EXECUTION_FAILED",
  QUERY_17: "QUERY_EXECUTION_FAILED",
  QUERY_18: "QUERY_EXECUTION_FAILED",
  VALIDATION_01: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_02: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_03: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_04: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_05: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_06: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_07: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_08: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_09: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_10: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_11: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_12: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_13: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_14: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_15: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_16: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_17: "QUERY_RESULT_VALIDATION_FAILED",
  VALIDATION_18: "QUERY_RESULT_VALIDATION_FAILED",
  COMMIT: "COMMIT_FAILED",
  ROLLBACK: "ROLLBACK_FAILED",
  CLOSE: "CLOSE_FAILED",
} as const satisfies Record<
  SyntheticFailureInjectionPoint,
  ControlledPostgresReadOnlyAdapterErrorCode
>);

export type ControlledPostgresReadOnlyAdapterCreationRequest = Readonly<{
  validatedManifest: ControlledProductionPreflightExecutionManifest;
  validatedAuthorization: ControlledProductionPreflightAuthorizationEnvelope;
  validatedBinding: ControlledProductionPreflightBindingEvidence;
  activeCredentialLease: CredentialLeasePublicView;
  validatedTransportFactoryRequest: TransportFactoryRequest;
  adapterId: string;
  adapterMode: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE;
}>;

export type ControlledPostgresReadOnlyAdapterLifecycleEvidence = Readonly<{
  checkId: "9X-C4-RERUN";
  phase: "Concrete PostgreSQL Read-Only Adapter Synthetic Implementation";
  adapterKind: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND;
  adapterVersion: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION;
  adapterMode: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE;
  adapterId: string;
  state: ControlledPostgresReadOnlyAdapterState;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSetId: string;
  redactedTargetFingerprint: string;
  targetPurpose: string;
  executionWindowId: string;
  expectedExecutorIdentity: string;
  sessionOpenAttemptCount: number;
  sessionOpened: boolean;
  safetyVerificationAttemptCount: number;
  safetyVerified: boolean;
  transactionBeginAttemptCount: number;
  readOnlyTransactionOpened: boolean;
  executedApprovedQueryCount: number;
  validatedApprovedQueryCount: number;
  nextExpectedQueryPosition: number;
  commitAttemptCount: number;
  committed: boolean;
  rollbackAttemptCount: number;
  rolledBack: boolean;
  closeAttemptCount: number;
  closed: boolean;
  primaryFailureCode: ControlledPostgresReadOnlyAdapterErrorCode | null;
  cleanupFailureCode: ControlledPostgresReadOnlyAdapterErrorCode | null;
  allResultsValidatedBeforeCommit: boolean;
  canonicalOrderPreserved: boolean;
  productionCredentialAccessed: false;
  remoteConnectionPerformed: false;
  sqlExecuted: false;
  productionReadOnlyPreflightExecutedNow: false;
  productionWriteAuthorized: false;
  productionBootstrapAuthorized: false;
  productionRollbackArtifactAuthorized: false;
  productionRuntimeAuthorized: false;
  publicLaunchAuthorized: false;
}>;

export type ControlledPostgresReadOnlyAdapter = Readonly<{
  adapterKind: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND;
  adapterVersion: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION;
  adapterMode: typeof CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE;
  adapterId: string;
  readonly state: ControlledPostgresReadOnlyAdapterState;
  openSession(): Promise<void>;
  verifySafetySettings(settings: unknown): Promise<void>;
  beginReadOnlyTransaction(): Promise<void>;
  executeApprovedQuery(queryId: ProductionReadOnlyPreflightQueryId): Promise<void>;
  commitReadOnlyTransaction(): Promise<void>;
  rollbackReadOnlyTransaction(): Promise<void>;
  close(): Promise<void>;
  getBoundedLifecycleEvidence(): ControlledPostgresReadOnlyAdapterLifecycleEvidence;
}>;

type ResultValidationAcknowledgement = Readonly<{
  adapter: ControlledPostgresReadOnlyAdapter;
  queryId: ProductionReadOnlyPreflightQueryId;
  position: number;
  resultSchemaId: string;
  result: object;
}>;
type AdapterResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; code: ControlledPostgresReadOnlyAdapterErrorCode }>;

const adapterProvenance = new WeakSet<object>();
const acknowledgementProvenance = new WeakSet<object>();
const failurePlanByAdapter = new WeakMap<object, SyntheticValidationOnlyFailurePlan>();
const failurePlanProvenance = new WeakSet<object>();
const adapterIdPattern = /^padapter_[a-z0-9-]{7,87}$/;
const PLAN_FIELDS = Object.freeze([
  "mode",
  "primaryFailurePoint",
  "cleanupFailurePoints",
] as const);
const FORBIDDEN_PLAN_FIELD =
  /^(password|passwd|secret|token|credential|connection|uri|host|port|sql|error|message|code|nonce|target|environment|env)$/i;

function adapterFailure(
  code: ControlledPostgresReadOnlyAdapterErrorCode,
): never {
  throw new Error(code);
}

function exactSafetySettings(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const expected = PRELIGHT_SAFETY_SETTINGS as Record<string, unknown>;
  const actual = value as Record<string, unknown>;
  const expectedKeys = Object.keys(expected);
  return (
    Object.keys(actual).length === expectedKeys.length &&
    expectedKeys.every((key) => actual[key] === expected[key])
  );
}

function hasValidAdapterId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 16 &&
    value.length <= 96 &&
    adapterIdPattern.test(value) &&
    !/[/:\\\s]/.test(value) &&
    !/(?:password|secret|token|credential|target|nonce|uri|host)/i.test(value)
  );
}

function requestMatches(
  request: ControlledPostgresReadOnlyAdapterCreationRequest,
): boolean {
  const {
    validatedManifest: manifest,
    validatedAuthorization: authorization,
    validatedBinding: binding,
  } = request;
  if (
    !isValidatedControlledProductionPreflightExecutionManifest(manifest) ||
    !isValidatedControlledProductionPreflightAuthorizationEnvelope(
      authorization,
    ) ||
    !isValidatedControlledProductionPreflightBindingEvidence(binding) ||
    !isControlledCredentialLease(request.activeCredentialLease) ||
    request.adapterMode !== CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE ||
    !hasValidAdapterId(request.adapterId)
  ) {
    return false;
  }
  const transportRequest = validateTransportFactoryRequest(
    request.validatedTransportFactoryRequest,
  );
  if (!transportRequest.ok) return false;
  const lease = request.activeCredentialLease;
  return (
    manifest.sourceCommit === CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT &&
    authorization.sourceCommit === manifest.sourceCommit &&
    binding.sourceCommit === manifest.sourceCommit &&
    manifest.artifactFingerprintSet.artifactFingerprintSetId ===
      authorization.artifactFingerprintSetId &&
    binding.artifactFingerprintSetId === authorization.artifactFingerprintSetId &&
    manifest.targetPurpose === authorization.targetPurpose &&
    binding.targetPurpose === authorization.targetPurpose &&
    manifest.executionWindow.executionWindowId ===
      authorization.executionWindowId &&
    binding.executionWindowId === authorization.executionWindowId &&
    manifest.expectedExecutorIdentity === lease.expectedExecutorIdentity &&
    lease.credentialAvailable === true &&
    lease.released === false &&
    transportRequest.value.activeCredentialLease === lease
  );
}

function queryPoint(index: number): SyntheticFailureInjectionPoint {
  return `QUERY_${String(index + 1).padStart(2, "0")}` as SyntheticFailureInjectionPoint;
}

function validationPoint(index: number): SyntheticFailureInjectionPoint {
  return `VALIDATION_${String(index + 1).padStart(2, "0")}` as SyntheticFailureInjectionPoint;
}

export function isControlledPostgresReadOnlyAdapter(
  value: unknown,
): value is ControlledPostgresReadOnlyAdapter {
  return !!value && typeof value === "object" && adapterProvenance.has(value);
}

export function validateSyntheticValidationOnlyFailurePlan(
  input: unknown,
): AdapterResult<SyntheticValidationOnlyFailurePlan> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  const record = input as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.some((key) => FORBIDDEN_PLAN_FIELD.test(key))) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (
    keys.length !== PLAN_FIELDS.length ||
    PLAN_FIELDS.some((key) => !(key in record))
  ) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (keys.some((key) => !(PLAN_FIELDS as readonly string[]).includes(key))) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (record.mode !== "SYNTHETIC_VALIDATION_ONLY") {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (
    typeof record.primaryFailurePoint !== "string" ||
    !(SYNTHETIC_FAILURE_INJECTION_POINTS as readonly string[]).includes(
      record.primaryFailurePoint,
    )
  ) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (!Array.isArray(record.cleanupFailurePoints)) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  if (record.cleanupFailurePoints.length > 2) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  const cleanup: CleanupFailurePoint[] = [];
  for (const point of record.cleanupFailurePoints) {
    if (
      typeof point !== "string" ||
      !(CLEANUP_FAILURE_POINTS as readonly string[]).includes(point)
    ) {
      return Object.freeze({
        ok: false as const,
        code: "SYNTHETIC_FAILURE_PLAN_INVALID",
      });
    }
    if (cleanup.includes(point as CleanupFailurePoint)) {
      return Object.freeze({
        ok: false as const,
        code: "SYNTHETIC_FAILURE_PLAN_INVALID",
      });
    }
    cleanup.push(point as CleanupFailurePoint);
  }
  if (
    record.error !== undefined ||
    record.message !== undefined ||
    record.code !== undefined ||
    record.sql !== undefined
  ) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  const normalized = deepFreezeContract(
    Object.freeze({
      mode: "SYNTHETIC_VALIDATION_ONLY" as const,
      primaryFailurePoint:
        record.primaryFailurePoint as SyntheticFailureInjectionPoint,
      cleanupFailurePoints: Object.freeze([...cleanup]),
    }),
  );
  failurePlanProvenance.add(normalized);
  return Object.freeze({ ok: true as const, value: normalized });
}

export function isSyntheticValidationOnlyFailurePlan(
  value: unknown,
): value is SyntheticValidationOnlyFailurePlan {
  return !!value && typeof value === "object" && failurePlanProvenance.has(value);
}

function createAdapterInternal(
  request: ControlledPostgresReadOnlyAdapterCreationRequest,
  failurePlan: SyntheticValidationOnlyFailurePlan | null,
): AdapterResult<ControlledPostgresReadOnlyAdapter> {
  if (!requestMatches(request)) {
    return Object.freeze({
      ok: false as const,
      code: "ADAPTER_PROVENANCE_INVALID",
    });
  }
  if (failurePlan && !isSyntheticValidationOnlyFailurePlan(failurePlan)) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  const normalizedRequest = deepFreezeContract({ ...request });
  let state: ControlledPostgresReadOnlyAdapterState = "ADAPTER_CREATED";
  let sessionOpenAttemptCount = 0;
  let safetyVerificationAttemptCount = 0;
  let transactionBeginAttemptCount = 0;
  let commitAttemptCount = 0;
  let rollbackAttemptCount = 0;
  let closeAttemptCount = 0;
  let primaryFailureCode: ControlledPostgresReadOnlyAdapterErrorCode | null =
    null;
  let cleanupFailureCode: ControlledPostgresReadOnlyAdapterErrorCode | null =
    null;
  let committed = false;
  let rolledBack = false;
  let safetyVerified = false;
  const executed: ProductionReadOnlyPreflightQueryId[] = [];
  const validated: ProductionReadOnlyPreflightQueryId[] = [];
  let activeAcknowledgement: ResultValidationAcknowledgement | null = null;
  const plan = failurePlan;

  const failPrimary = (
    code: ControlledPostgresReadOnlyAdapterErrorCode,
  ): never => {
    if (!primaryFailureCode) primaryFailureCode = code;
    state = "FAILED";
    return adapterFailure(code);
  };
  const failCleanup = (
    code: ControlledPostgresReadOnlyAdapterErrorCode,
  ): never => {
    if (!cleanupFailureCode) cleanupFailureCode = code;
    return adapterFailure(code);
  };
  const injectPrimary = (point: SyntheticFailureInjectionPoint): void => {
    if (plan?.primaryFailurePoint === point) {
      failPrimary(FAILURE_POINT_SAFE_CODES[point]);
    }
  };
  const injectCleanup = (point: CleanupFailurePoint): void => {
    if (plan?.cleanupFailurePoints.includes(point)) {
      failCleanup(FAILURE_POINT_SAFE_CODES[point]);
    }
  };
  const requireOpen = () => {
    if (state === "CLOSED" || state === "CLOSE_REQUESTED") {
      failPrimary("ADAPTER_CLOSED");
    }
    if (state === "FAILED") failPrimary("ADAPTER_ALREADY_FAILED");
  };
  const evidence = (): ControlledPostgresReadOnlyAdapterLifecycleEvidence =>
    deepFreezeContract({
      checkId: "9X-C4-RERUN" as const,
      phase:
        "Concrete PostgreSQL Read-Only Adapter Synthetic Implementation" as const,
      adapterKind: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND,
      adapterVersion: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION,
      adapterMode: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
      adapterId: normalizedRequest.adapterId,
      state,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSetId:
        normalizedRequest.validatedManifest.artifactFingerprintSet
          .artifactFingerprintSetId,
      redactedTargetFingerprint: redactTargetFingerprint(
        normalizedRequest.validatedManifest.targetFingerprint,
      ),
      targetPurpose: normalizedRequest.validatedManifest.targetPurpose,
      executionWindowId:
        normalizedRequest.validatedManifest.executionWindow.executionWindowId,
      expectedExecutorIdentity:
        normalizedRequest.validatedManifest.expectedExecutorIdentity,
      sessionOpenAttemptCount,
      sessionOpened: sessionOpenAttemptCount > 0 && state !== "ADAPTER_CREATED",
      safetyVerificationAttemptCount,
      safetyVerified,
      transactionBeginAttemptCount,
      readOnlyTransactionOpened:
        state === "READ_ONLY_TRANSACTION_OPEN" ||
        state === "QUERY_EXECUTION_ACTIVE" ||
        committed ||
        rolledBack ||
        (primaryFailureCode !== null && transactionBeginAttemptCount > 0),
      executedApprovedQueryCount: executed.length,
      validatedApprovedQueryCount: validated.length,
      nextExpectedQueryPosition: executed.length,
      commitAttemptCount,
      committed,
      rollbackAttemptCount,
      rolledBack,
      closeAttemptCount,
      closed: state === "CLOSED",
      primaryFailureCode,
      cleanupFailureCode,
      allResultsValidatedBeforeCommit:
        validated.length ===
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length &&
        committed,
      canonicalOrderPreserved: executed.every(
        (id, index) =>
          id === PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[index],
      ),
      productionCredentialAccessed: false as const,
      remoteConnectionPerformed: false as const,
      sqlExecuted: false as const,
      productionReadOnlyPreflightExecutedNow: false as const,
      productionWriteAuthorized: false as const,
      productionBootstrapAuthorized: false as const,
      productionRollbackArtifactAuthorized: false as const,
      productionRuntimeAuthorized: false as const,
      publicLaunchAuthorized: false as const,
    });

  const adapter = Object.freeze({
    adapterKind: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_KIND,
    adapterVersion: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_VERSION,
    adapterMode: CONTROLLED_POSTGRES_READ_ONLY_ADAPTER_MODE,
    adapterId: normalizedRequest.adapterId,
    get state() {
      return state;
    },
    async openSession() {
      requireOpen();
      if (sessionOpenAttemptCount > 0) failPrimary("SESSION_ALREADY_OPEN");
      if (state !== "ADAPTER_CREATED") failPrimary("ADAPTER_STATE_INVALID");
      sessionOpenAttemptCount += 1;
      injectPrimary("SESSION_OPEN");
      state = "SESSION_OPEN";
    },
    async verifySafetySettings(settings: unknown) {
      requireOpen();
      if (state !== "SESSION_OPEN") failPrimary("SESSION_NOT_OPEN");
      safetyVerificationAttemptCount += 1;
      injectPrimary("SAFETY_VERIFICATION");
      if (!exactSafetySettings(settings)) {
        failPrimary("SAFETY_SETTINGS_INVALID");
      }
      safetyVerified = true;
      state = "SAFETY_VERIFIED";
    },
    async beginReadOnlyTransaction() {
      requireOpen();
      if (state === "READ_ONLY_TRANSACTION_OPEN") {
        failPrimary("TRANSACTION_ALREADY_OPEN");
      }
      if (state !== "SAFETY_VERIFIED") failPrimary("SAFETY_NOT_VERIFIED");
      transactionBeginAttemptCount += 1;
      injectPrimary("TRANSACTION_BEGIN");
      state = "READ_ONLY_TRANSACTION_OPEN";
    },
    async executeApprovedQuery(queryId: ProductionReadOnlyPreflightQueryId) {
      requireOpen();
      if (state === "QUERY_EXECUTION_ACTIVE") {
        failPrimary("QUERY_EXECUTION_ALREADY_ACTIVE");
      }
      if (state !== "READ_ONLY_TRANSACTION_OPEN") {
        failPrimary("TRANSACTION_NOT_OPEN");
      }
      if (
        typeof queryId !== "string" ||
        !(
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER as readonly string[]
        ).includes(queryId)
      ) {
        failPrimary("QUERY_ID_NOT_APPROVED");
      }
      const expected =
        PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER[executed.length];
      if (queryId !== expected) {
        failPrimary(
          executed.includes(queryId)
            ? "QUERY_ALREADY_EXECUTED"
            : "QUERY_ORDER_VIOLATION",
        );
      }
      const position = executed.length;
      state = "QUERY_EXECUTION_ACTIVE";
      injectPrimary(queryPoint(position));
      const fixture = createSyntheticProductionPreflightResultFixture(queryId);
      const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
      if (
        !isHelperCreatedSyntheticProductionPreflightResultFixture(fixture) ||
        fixture.queryId !== queryId ||
        fixture.resultSchemaId !== entry.resultSchemaKey
      ) {
        failPrimary("SYNTHETIC_FIXTURE_INVALID");
      }
      executed.push(queryId);
      injectPrimary(validationPoint(position));
      if (!entry.validateResult(fixture.value)) {
        failPrimary("QUERY_RESULT_VALIDATION_FAILED");
      }
      const acknowledgement = deepFreezeContract({
        adapter,
        queryId,
        position,
        resultSchemaId: fixture.resultSchemaId,
        result: fixture.value as object,
      });
      acknowledgementProvenance.add(acknowledgement);
      activeAcknowledgement = acknowledgement;
      if (
        !acknowledgementProvenance.has(activeAcknowledgement) ||
        activeAcknowledgement.adapter !== adapter ||
        activeAcknowledgement.queryId !== queryId ||
        activeAcknowledgement.position !== position ||
        activeAcknowledgement.resultSchemaId !== entry.resultSchemaKey
      ) {
        failPrimary("QUERY_VALIDATION_ACKNOWLEDGEMENT_INVALID");
      }
      validated.push(queryId);
      activeAcknowledgement = null;
      state = "READ_ONLY_TRANSACTION_OPEN";
    },
    async commitReadOnlyTransaction() {
      requireOpen();
      if (state !== "READ_ONLY_TRANSACTION_OPEN") {
        failPrimary("COMMIT_PRECONDITION_FAILED");
      }
      commitAttemptCount += 1;
      if (
        executed.length !==
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length ||
        validated.length !==
          PRODUCTION_PREFLIGHT_CANONICAL_EXECUTION_ORDER.length ||
        activeAcknowledgement !== null
      ) {
        failPrimary("COMMIT_PRECONDITION_FAILED");
      }
      injectPrimary("COMMIT");
      committed = true;
      state = "READ_ONLY_TRANSACTION_COMMITTED";
    },
    async rollbackReadOnlyTransaction() {
      if (state === "READ_ONLY_TRANSACTION_COMMITTED") {
        adapterFailure("ROLLBACK_NOT_ELIGIBLE");
      }
      if (state !== "FAILED" && state !== "READ_ONLY_TRANSACTION_ROLLED_BACK") {
        adapterFailure("ROLLBACK_NOT_ELIGIBLE");
      }
      if (state === "READ_ONLY_TRANSACTION_ROLLED_BACK") {
        adapterFailure("ROLLBACK_NOT_ELIGIBLE");
      }
      rollbackAttemptCount += 1;
      injectCleanup("ROLLBACK");
      if (plan?.primaryFailurePoint === "ROLLBACK") {
        failPrimary("ROLLBACK_FAILED");
      }
      rolledBack = true;
      state = "READ_ONLY_TRANSACTION_ROLLED_BACK";
    },
    async close() {
      if (state === "CLOSED") return;
      closeAttemptCount += 1;
      state = "CLOSE_REQUESTED";
      injectCleanup("CLOSE");
      if (plan?.primaryFailurePoint === "CLOSE") {
        if (!primaryFailureCode) primaryFailureCode = "CLOSE_FAILED";
        state = "FAILED";
        return adapterFailure("CLOSE_FAILED");
      }
      state = "CLOSED";
    },
    getBoundedLifecycleEvidence: evidence,
  } satisfies ControlledPostgresReadOnlyAdapter);
  adapterProvenance.add(adapter);
  if (plan) failurePlanByAdapter.set(adapter, plan);
  return Object.freeze({ ok: true as const, value: adapter });
}

export function createControlledPostgresReadOnlyAdapter(
  request: ControlledPostgresReadOnlyAdapterCreationRequest,
): AdapterResult<ControlledPostgresReadOnlyAdapter> {
  if (
    request &&
    typeof request === "object" &&
    ("failurePlan" in request ||
      "primaryFailurePoint" in request ||
      "cleanupFailurePoints" in request)
  ) {
    return Object.freeze({
      ok: false as const,
      code: "SYNTHETIC_FAILURE_PLAN_INVALID",
    });
  }
  return createAdapterInternal(request, null);
}

export function createSyntheticValidationOnlyPostgresAdapterHarness(
  request: ControlledPostgresReadOnlyAdapterCreationRequest,
  failurePlan: unknown,
): AdapterResult<ControlledPostgresReadOnlyAdapter> {
  const plan = validateSyntheticValidationOnlyFailurePlan(failurePlan);
  if (!plan.ok) return plan;
  return createAdapterInternal(request, plan.value);
}

export const SYNTHETIC_FAILURE_HARNESS_META = Object.freeze({
  syntheticFailureHarnessImplemented: true,
  syntheticFailureHarnessMode: "SYNTHETIC_VALIDATION_ONLY" as const,
  syntheticFailureInjectionPointCount: SYNTHETIC_FAILURE_INJECTION_POINTS.length,
  failurePointToSafeCodeMappingComplete:
    Object.keys(FAILURE_POINT_SAFE_CODES).length ===
    SYNTHETIC_FAILURE_INJECTION_POINTS.length,
  failurePointCountMapped: Object.keys(FAILURE_POINT_SAFE_CODES).length,
  productionAdapterFactoryAcceptsFailureInjection: false,
  syntheticFailureInjectionPubliclyExposedOnAdapter: false,
});
