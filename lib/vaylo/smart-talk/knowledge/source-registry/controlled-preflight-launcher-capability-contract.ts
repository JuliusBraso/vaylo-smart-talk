import { types as nodeUtilTypes } from "node:util";

export const CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID =
  "9X-C4-C5-SYNTHETIC-CAPABILITY-BOUNDARY" as const;

export const CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION = 1 as const;

export const CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS =
  "C5_SYNTHETIC_ONLY" as const;

export const CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS = Object.freeze([
  "SYNTHETIC_READ_ONLY_QUERY_FIXTURES",
  "EPHEMERAL_IN_MEMORY_NONCE",
  "FIXED_CLOCK_SNAPSHOT",
  "IN_MEMORY_AUDIT_TRACE",
] as const);

export const CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS = Object.freeze([
  "CREDENTIALS",
  "SECRETS",
  "ENVIRONMENT_ACCESS",
  "PROCESS_ENVIRONMENT_ACCESS",
  "FILESYSTEM_READ",
  "FILESYSTEM_WRITE",
  "NETWORK",
  "DNS",
  "HTTP",
  "HTTPS",
  "SOCKETS",
  "WEBSOCKET",
  "DATABASE_CONNECTION",
  "POSTGRESQL_CLIENT",
  "SUPABASE_CLIENT",
  "SQL_TEXT",
  "ARBITRARY_QUERY_TEXT",
  "SUBPROCESS",
  "CHILD_PROCESS",
  "SHELL",
  "COMMAND_EXECUTION",
  "PRODUCTION_NONCE_PERSISTENCE",
  "PRODUCTION_NONCE_CONSUMPTION",
  "EXTERNAL_STORAGE",
  "BOOTSTRAP_EXECUTION",
  "ROLLBACK_ARTIFACT_EXECUTION",
  "MIGRATION_EXECUTION",
  "PRODUCTION_PREFLIGHT_EXECUTION",
  "PRODUCTION_WRITES",
  "DEPLOYMENT",
  "RUNTIME_ACTIVATION",
  "PUBLIC_LAUNCH",
] as const);

/** Accepted objects must use Object.prototype only. */
export const CONTROLLED_PREFLIGHT_PLAIN_OBJECT_PROTOTYPE_POLICY =
  "OBJECT_PROTOTYPE_ONLY" as const;

export const CONTROLLED_PREFLIGHT_CANDIDATE_KEYS = Object.freeze([
  "contractId",
  "contractVersion",
  "authorizationClass",
  "productionCapabilityCount",
  "allowedCapabilities",
  "forbiddenCapabilities",
  "manifest",
] as const);

export const CONTROLLED_PREFLIGHT_MANIFEST_KEYS = Object.freeze([
  "queryIds",
  "fixtureSnapshots",
  "fixedClockSnapshot",
  "nonce",
  "auditTrace",
] as const);

export const CONTROLLED_PREFLIGHT_FIXTURE_SNAPSHOT_KEYS = Object.freeze([
  "queryId",
  "rows",
] as const);

export const CONTROLLED_PREFLIGHT_NONCE_KEYS = Object.freeze([
  "mode",
  "maximumEntries",
] as const);

export const CONTROLLED_PREFLIGHT_AUDIT_TRACE_KEYS = Object.freeze([
  "mode",
  "maximumEvents",
] as const);

export const CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_ENTRY_KEYS = Object.freeze([
  "id",
  "syntheticOnly",
  "externalAccess",
] as const);

export const CONTROLLED_PREFLIGHT_CONTRACT_KEYS = Object.freeze([
  "contractId",
  "contractVersion",
  "authorizationClass",
  "productionCapabilityCount",
  "allowedCapabilities",
  "forbiddenCapabilities",
  "queryAuthority",
  "manifestPolicy",
  "noncePolicy",
  "tracePolicy",
] as const);

type PlainData =
  | null
  | boolean
  | number
  | string
  | readonly PlainData[]
  | { readonly [key: string]: PlainData };

export type ControlledPreflightCapabilityManifest = Readonly<{
  queryIds: ReadonlyArray<string>;
  fixtureSnapshots: ReadonlyArray<
    Readonly<{
      queryId: string;
      rows: number;
    }>
  >;
  fixedClockSnapshot: string;
  nonce: Readonly<{
    mode: "EPHEMERAL_IN_MEMORY";
    maximumEntries: number;
  }>;
  auditTrace: Readonly<{
    mode: "IN_MEMORY";
    maximumEvents: number;
  }>;
}>;

export type ControlledPreflightCapabilityCandidate = Readonly<{
  contractId: string;
  contractVersion: number;
  authorizationClass: string;
  productionCapabilityCount: number;
  allowedCapabilities: ReadonlyArray<string>;
  forbiddenCapabilities: ReadonlyArray<string>;
  manifest: ControlledPreflightCapabilityManifest;
}>;

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    for (const key of Reflect.ownKeys(value as object)) {
      const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
      if (descriptor && "value" in descriptor) {
        deepFreeze(descriptor.value);
      }
    }
    Object.freeze(value);
  }
  return value;
};

export const CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT = deepFreeze({
  contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
  contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
  authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
  productionCapabilityCount: 0,
  allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.map((id) => ({
    id,
    syntheticOnly: true,
    externalAccess: false,
  })),
  forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  queryAuthority: "HELPER_OWNED_APPROVED_QUERY_IDS_ONLY",
  manifestPolicy: "IMMUTABLE_PLAIN_DATA_ONLY",
  noncePolicy: "EPHEMERAL_IN_MEMORY_ONLY",
  tracePolicy: "BOUNDED_IN_MEMORY_ONLY",
});

const prohibitedString = (value: string): boolean =>
  /\b(select|insert|update|delete|drop|alter|create|grant|revoke)\b/i.test(value) ||
  /(?:postgres(?:ql)?:\/\/|https?:\/\/|wss?:\/\/|redis:\/\/)/i.test(value) ||
  /(?:[A-Za-z]:[\\/]|^\/|^\.\.?[\\/])/.test(value) ||
  /(?:process\.env|credential|secret|password|token|command|shell|\brm\b|\bcurl\b|\bpowershell\b|\bbash\b|\bcmd\.exe\b)/i.test(
    value,
  );

const isNonPrimitive = (value: unknown): value is object =>
  (typeof value === "object" && value !== null) || typeof value === "function";

/** Reject Proxy identity before any reflective or property-trapping operation. */
export const isUntrustedProxy = (value: unknown): boolean =>
  isNonPrimitive(value) && nodeUtilTypes.isProxy(value);

export function hasExactOwnKeys(
  candidate: object,
  expectedStringKeys: ReadonlyArray<string>,
): boolean {
  if (isUntrustedProxy(candidate)) return false;
  const ownKeys = Reflect.ownKeys(candidate);
  if (ownKeys.some((key) => typeof key === "symbol")) return false;
  if (ownKeys.length !== expectedStringKeys.length) return false;
  const expected = new Set(expectedStringKeys);
  if (expected.size !== expectedStringKeys.length) return false;
  return ownKeys.every(
    (key) => typeof key === "string" && expected.has(key),
  );
}

const hasOnlyDataDescriptors = (candidate: object): boolean => {
  if (isUntrustedProxy(candidate)) return false;
  const descriptors = Object.getOwnPropertyDescriptors(candidate);
  for (const key of Reflect.ownKeys(candidate)) {
    if (typeof key === "symbol") return false;
    const descriptor = descriptors[key as string];
    if (!descriptor) return false;
    if (descriptor.get !== undefined || descriptor.set !== undefined) return false;
    if (!("value" in descriptor)) return false;
  }
  return true;
};

const isCanonicalArrayIndexKey = (key: string, length: number): boolean => {
  if (!/^(0|[1-9]\d*)$/.test(key)) return false;
  if (key.length > 1 && key.startsWith("0")) return false;
  const index = Number(key);
  return Number.isInteger(index) && index >= 0 && index < length;
};

/**
 * Inspect an untrusted array without invoking index getters, iterators,
 * or array callback methods. Returns a newly created trusted value list
 * on success, otherwise null.
 */
export function inspectPlainDataArraySafely(
  candidate: unknown,
): ReadonlyArray<unknown> | null {
  if (isUntrustedProxy(candidate)) return null;
  if (!Array.isArray(candidate)) return null;
  if (Object.getPrototypeOf(candidate) !== Array.prototype) return null;

  const ownKeys = Reflect.ownKeys(candidate);
  if (ownKeys.some((key) => typeof key === "symbol")) return null;

  const descriptors = Object.getOwnPropertyDescriptors(candidate) as Record<
    string,
    PropertyDescriptor | undefined
  >;
  const lengthDescriptor = descriptors.length;
  if (
    !lengthDescriptor ||
    lengthDescriptor.get !== undefined ||
    lengthDescriptor.set !== undefined ||
    !("value" in lengthDescriptor) ||
    typeof lengthDescriptor.value !== "number" ||
    !Number.isInteger(lengthDescriptor.value) ||
    lengthDescriptor.value < 0 ||
    !Number.isSafeInteger(lengthDescriptor.value)
  ) {
    return null;
  }

  const length = lengthDescriptor.value;
  const expectedKeys = new Set<string>(["length"]);
  for (let index = 0; index < length; index += 1) {
    expectedKeys.add(String(index));
  }
  if (ownKeys.length !== expectedKeys.size) return null;

  const trustedValues: unknown[] = [];
  for (const key of ownKeys) {
    if (typeof key !== "string") return null;
    if (!expectedKeys.has(key)) return null;
    const descriptor = descriptors[key];
    if (!descriptor) return null;
    if (descriptor.get !== undefined || descriptor.set !== undefined) return null;
    if (!("value" in descriptor)) return null;
    if (key === "length") continue;
    if (!isCanonicalArrayIndexKey(key, length)) return null;
    trustedValues[Number(key)] = descriptor.value;
  }

  for (let index = 0; index < length; index += 1) {
    if (!Object.prototype.hasOwnProperty.call(descriptors, String(index))) {
      return null;
    }
    if (!Object.prototype.hasOwnProperty.call(trustedValues, index)) {
      return null;
    }
  }

  return trustedValues;
}

export function isPlainSyntheticCapabilityData(
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): value is PlainData {
  if (value === null) return true;
  if (typeof value === "string") return !prohibitedString(value);
  if (
    typeof value === "boolean" ||
    (typeof value === "number" && Number.isFinite(value))
  ) {
    return true;
  }
  if (typeof value === "function" || typeof value === "symbol") return false;
  if (typeof value !== "object") return false;
  if (isUntrustedProxy(value)) return false;
  if (
    value instanceof Promise ||
    value instanceof Uint8Array ||
    value instanceof ArrayBuffer
  ) {
    return false;
  }
  if (seen.has(value)) return false;
  seen.add(value);

  if (Array.isArray(value)) {
    const trusted = inspectPlainDataArraySafely(value);
    if (trusted === null) return false;
    for (let index = 0; index < trusted.length; index += 1) {
      if (!isPlainSyntheticCapabilityData(trusted[index], seen)) return false;
    }
    return true;
  }

  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  if (!hasOnlyDataDescriptors(value)) return false;
  if (Reflect.ownKeys(value).some((key) => typeof key === "symbol")) return false;
  for (const key of Reflect.ownKeys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor)) return false;
    if (!isPlainSyntheticCapabilityData(descriptor.value, seen)) return false;
  }
  return true;
}

export function isDeepFrozen(
  value: unknown,
  seen: WeakSet<object> = new WeakSet(),
): boolean {
  if (value === null || typeof value !== "object") return true;
  if (isUntrustedProxy(value)) return false;
  if (seen.has(value)) return true;
  seen.add(value);
  if (!Object.isFrozen(value)) return false;
  if (Array.isArray(value)) {
    const trusted = inspectPlainDataArraySafely(value);
    if (trusted === null) return false;
    for (let index = 0; index < trusted.length; index += 1) {
      if (!isDeepFrozen(trusted[index], seen)) return false;
    }
    return true;
  }
  return Reflect.ownKeys(value).every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !("value" in descriptor)) return false;
    return isDeepFrozen(descriptor.value, seen);
  });
}

const sameExactSequence = (
  actual: unknown,
  expected: ReadonlyArray<string>,
): boolean => {
  const trusted = inspectPlainDataArraySafely(actual);
  if (trusted === null) return false;
  if (trusted.length !== expected.length) return false;
  for (let index = 0; index < expected.length; index += 1) {
    if (trusted[index] !== expected[index]) return false;
  }
  return true;
};

const sameSet = (
  actual: unknown,
  expected: ReadonlyArray<string>,
): boolean => {
  const trusted = inspectPlainDataArraySafely(actual);
  if (trusted === null) return false;
  if (trusted.length !== expected.length) return false;
  const unique = new Set<string>();
  for (let index = 0; index < trusted.length; index += 1) {
    const value = trusted[index];
    if (typeof value !== "string") return false;
    if (!expected.includes(value)) return false;
    unique.add(value);
  }
  return unique.size === trusted.length;
};

const validateFixtureSnapshot = (value: unknown): boolean => {
  if (isUntrustedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (!hasExactOwnKeys(value, CONTROLLED_PREFLIGHT_FIXTURE_SNAPSHOT_KEYS)) {
    return false;
  }
  if (!hasOnlyDataDescriptors(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const queryId = descriptors.queryId?.value;
  const rows = descriptors.rows?.value;
  return (
    typeof queryId === "string" &&
    !prohibitedString(queryId) &&
    typeof rows === "number" &&
    Number.isFinite(rows) &&
    Number.isInteger(rows) &&
    rows >= 0
  );
};

const validateNonce = (value: unknown): boolean => {
  if (isUntrustedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (!hasExactOwnKeys(value, CONTROLLED_PREFLIGHT_NONCE_KEYS)) return false;
  if (!hasOnlyDataDescriptors(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return (
    descriptors.mode?.value === "EPHEMERAL_IN_MEMORY" &&
    typeof descriptors.maximumEntries?.value === "number" &&
    Number.isFinite(descriptors.maximumEntries.value) &&
    Number.isInteger(descriptors.maximumEntries.value) &&
    descriptors.maximumEntries.value > 0
  );
};

const validateAuditTrace = (value: unknown): boolean => {
  if (isUntrustedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (!hasExactOwnKeys(value, CONTROLLED_PREFLIGHT_AUDIT_TRACE_KEYS)) {
    return false;
  }
  if (!hasOnlyDataDescriptors(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  return (
    descriptors.mode?.value === "IN_MEMORY" &&
    typeof descriptors.maximumEvents?.value === "number" &&
    Number.isFinite(descriptors.maximumEvents.value) &&
    Number.isInteger(descriptors.maximumEvents.value) &&
    descriptors.maximumEvents.value > 0
  );
};

const validateManifest = (value: unknown): boolean => {
  if (isUntrustedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (!hasExactOwnKeys(value, CONTROLLED_PREFLIGHT_MANIFEST_KEYS)) return false;
  if (!hasOnlyDataDescriptors(value)) return false;
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  if (!isPlainSyntheticCapabilityData(value)) return false;

  const descriptors = Object.getOwnPropertyDescriptors(value);
  const queryIds = inspectPlainDataArraySafely(descriptors.queryIds?.value);
  if (queryIds === null || queryIds.length < 1) return false;
  for (let index = 0; index < queryIds.length; index += 1) {
    const queryId = queryIds[index];
    if (typeof queryId !== "string" || prohibitedString(queryId)) return false;
  }

  const fixtureSnapshots = inspectPlainDataArraySafely(
    descriptors.fixtureSnapshots?.value,
  );
  if (fixtureSnapshots === null) return false;
  for (let index = 0; index < fixtureSnapshots.length; index += 1) {
    if (!validateFixtureSnapshot(fixtureSnapshots[index])) return false;
  }

  const fixedClockSnapshot = descriptors.fixedClockSnapshot?.value;
  if (
    typeof fixedClockSnapshot !== "string" ||
    prohibitedString(fixedClockSnapshot) ||
    Number.isNaN(Date.parse(fixedClockSnapshot))
  ) {
    return false;
  }
  return (
    validateNonce(descriptors.nonce?.value) &&
    validateAuditTrace(descriptors.auditTrace?.value)
  );
};

export type FixedCapabilityFailureCode =
  | "PROXY_REJECTED"
  | "SCHEMA_INVALID"
  | "PLAIN_DATA_INVALID"
  | "CAPABILITY_MISMATCH"
  | "MANIFEST_INVALID";

export type TrustedCapabilityCandidateSnapshot = Readonly<{
  contractId: string;
  contractVersion: number;
  authorizationClass: string;
  productionCapabilityCount: number;
  allowedCapabilities: ReadonlyArray<string>;
  forbiddenCapabilities: ReadonlyArray<string>;
  manifest: ControlledPreflightCapabilityManifest;
}>;

export type CapabilityCandidateParseResult =
  | Readonly<{
      ok: false;
      failureCode: FixedCapabilityFailureCode;
    }>
  | Readonly<{
      ok: true;
      value: TrustedCapabilityCandidateSnapshot;
    }>;

const parseFailure = (
  failureCode: FixedCapabilityFailureCode,
): CapabilityCandidateParseResult =>
  Object.freeze({ ok: false as const, failureCode });

const freezeTrustedSnapshot = (
  snapshot: TrustedCapabilityCandidateSnapshot,
): TrustedCapabilityCandidateSnapshot => {
  Object.freeze(snapshot.allowedCapabilities);
  Object.freeze(snapshot.forbiddenCapabilities);
  Object.freeze(snapshot.manifest.queryIds);
  Object.freeze(snapshot.manifest.fixtureSnapshots);
  for (const fixture of snapshot.manifest.fixtureSnapshots) {
    Object.freeze(fixture);
  }
  Object.freeze(snapshot.manifest.nonce);
  Object.freeze(snapshot.manifest.auditTrace);
  Object.freeze(snapshot.manifest);
  return Object.freeze(snapshot);
};

/**
 * Parse-once authoritative boundary: reject Proxies before reflection,
 * validate closed schema, and return a freshly constructed trusted snapshot.
 * Never returns or aliases the untrusted input object.
 */
export function parseClosedCapabilityCandidate(
  candidate: unknown,
): CapabilityCandidateParseResult {
  if (isUntrustedProxy(candidate)) return parseFailure("PROXY_REJECTED");
  if (candidate === null || typeof candidate !== "object" || Array.isArray(candidate)) {
    return parseFailure("SCHEMA_INVALID");
  }
  if (!hasExactOwnKeys(candidate, CONTROLLED_PREFLIGHT_CANDIDATE_KEYS)) {
    return parseFailure("SCHEMA_INVALID");
  }
  if (!hasOnlyDataDescriptors(candidate)) return parseFailure("SCHEMA_INVALID");
  if (Object.getPrototypeOf(candidate) !== Object.prototype) {
    return parseFailure("SCHEMA_INVALID");
  }
  const descriptors = Object.getOwnPropertyDescriptors(candidate);
  if (
    descriptors.contractId?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID
  ) {
    return parseFailure("SCHEMA_INVALID");
  }
  if (
    descriptors.contractVersion?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION
  ) {
    return parseFailure("SCHEMA_INVALID");
  }
  if (
    descriptors.authorizationClass?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS
  ) {
    return parseFailure("SCHEMA_INVALID");
  }
  if (descriptors.productionCapabilityCount?.value !== 0) {
    return parseFailure("CAPABILITY_MISMATCH");
  }

  const allowedCapabilities = descriptors.allowedCapabilities?.value;
  if (isUntrustedProxy(allowedCapabilities)) return parseFailure("PROXY_REJECTED");
  if (
    !Array.isArray(allowedCapabilities) ||
    !Object.isFrozen(allowedCapabilities) ||
    !sameExactSequence(
      allowedCapabilities,
      CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    )
  ) {
    return parseFailure("CAPABILITY_MISMATCH");
  }

  const forbiddenCapabilities = descriptors.forbiddenCapabilities?.value;
  if (isUntrustedProxy(forbiddenCapabilities)) {
    return parseFailure("PROXY_REJECTED");
  }
  if (
    !Array.isArray(forbiddenCapabilities) ||
    !sameSet(
      forbiddenCapabilities,
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    )
  ) {
    return parseFailure("CAPABILITY_MISMATCH");
  }

  const manifest = descriptors.manifest?.value;
  if (isUntrustedProxy(manifest)) return parseFailure("PROXY_REJECTED");
  if (!isDeepFrozen(manifest)) return parseFailure("PLAIN_DATA_INVALID");
  if (!validateManifest(manifest)) return parseFailure("MANIFEST_INVALID");

  const allowedTrusted = inspectPlainDataArraySafely(allowedCapabilities);
  const forbiddenTrusted = inspectPlainDataArraySafely(forbiddenCapabilities);
  if (allowedTrusted === null || forbiddenTrusted === null) {
    return parseFailure("CAPABILITY_MISMATCH");
  }

  const manifestDescriptors = Object.getOwnPropertyDescriptors(manifest as object);
  const queryIdsTrusted = inspectPlainDataArraySafely(
    manifestDescriptors.queryIds?.value,
  );
  const fixtureSnapshotsTrusted = inspectPlainDataArraySafely(
    manifestDescriptors.fixtureSnapshots?.value,
  );
  if (queryIdsTrusted === null || fixtureSnapshotsTrusted === null) {
    return parseFailure("MANIFEST_INVALID");
  }

  const trustedQueryIds = Object.freeze(
    queryIdsTrusted.map((queryId) => String(queryId)),
  );
  const trustedFixtureSnapshots = Object.freeze(
    fixtureSnapshotsTrusted.map((snapshot) => {
      const snapshotDescriptors = Object.getOwnPropertyDescriptors(
        snapshot as object,
      );
      return Object.freeze({
        queryId: String(snapshotDescriptors.queryId?.value),
        rows: Number(snapshotDescriptors.rows?.value),
      });
    }),
  );
  const nonceDescriptors = Object.getOwnPropertyDescriptors(
    manifestDescriptors.nonce?.value as object,
  );
  const auditDescriptors = Object.getOwnPropertyDescriptors(
    manifestDescriptors.auditTrace?.value as object,
  );

  const trustedManifest = Object.freeze({
    queryIds: trustedQueryIds,
    fixtureSnapshots: trustedFixtureSnapshots,
    fixedClockSnapshot: String(manifestDescriptors.fixedClockSnapshot?.value),
    nonce: Object.freeze({
      mode: "EPHEMERAL_IN_MEMORY" as const,
      maximumEntries: Number(nonceDescriptors.maximumEntries?.value),
    }),
    auditTrace: Object.freeze({
      mode: "IN_MEMORY" as const,
      maximumEvents: Number(auditDescriptors.maximumEvents?.value),
    }),
  });

  return Object.freeze({
    ok: true as const,
    value: freezeTrustedSnapshot({
      contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
      contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
      authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
      productionCapabilityCount: 0,
      allowedCapabilities: Object.freeze(
        allowedTrusted.map((value) => String(value)),
      ),
      forbiddenCapabilities: Object.freeze(
        forbiddenTrusted.map((value) => String(value)),
      ),
      manifest: trustedManifest,
    }),
  });
}

export function validateClosedCapabilityCandidate(
  candidate: unknown,
): candidate is ControlledPreflightCapabilityCandidate {
  return parseClosedCapabilityCandidate(candidate).ok;
}

export function validateClosedCapabilityContractExport(
  value: unknown,
): boolean {
  if (isUntrustedProxy(value)) return false;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) return false;
  if (!hasExactOwnKeys(value, CONTROLLED_PREFLIGHT_CONTRACT_KEYS)) return false;
  if (!hasOnlyDataDescriptors(value)) return false;
  if (!isDeepFrozen(value)) return false;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  if (
    descriptors.contractId?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID
  ) {
    return false;
  }
  if (
    descriptors.contractVersion?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION
  ) {
    return false;
  }
  if (
    descriptors.authorizationClass?.value !==
    CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS
  ) {
    return false;
  }
  if (descriptors.productionCapabilityCount?.value !== 0) return false;

  const allowedCapabilities = inspectPlainDataArraySafely(
    descriptors.allowedCapabilities?.value,
  );
  if (allowedCapabilities === null || allowedCapabilities.length !== 4) {
    return false;
  }

  const trustedEntryIds: string[] = [];
  for (let index = 0; index < allowedCapabilities.length; index += 1) {
    const entry = allowedCapabilities[index];
    if (isUntrustedProxy(entry)) return false;
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) {
      return false;
    }
    if (Object.getPrototypeOf(entry) !== Object.prototype) return false;
    if (
      !hasExactOwnKeys(entry, CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_ENTRY_KEYS)
    ) {
      return false;
    }
    if (!hasOnlyDataDescriptors(entry)) return false;
    const entryDescriptors = Object.getOwnPropertyDescriptors(entry);
    const id = entryDescriptors.id?.value;
    if (
      typeof id !== "string" ||
      entryDescriptors.syntheticOnly?.value !== true ||
      entryDescriptors.externalAccess?.value !== false
    ) {
      return false;
    }
    trustedEntryIds.push(id);
  }

  if (
    !sameExactSequence(
      trustedEntryIds,
      CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    )
  ) {
    return false;
  }

  return (
    sameSet(
      descriptors.forbiddenCapabilities?.value,
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    ) &&
    descriptors.queryAuthority?.value ===
      "HELPER_OWNED_APPROVED_QUERY_IDS_ONLY" &&
    descriptors.manifestPolicy?.value === "IMMUTABLE_PLAIN_DATA_ONLY" &&
    descriptors.noncePolicy?.value === "EPHEMERAL_IN_MEMORY_ONLY" &&
    descriptors.tracePolicy?.value === "BOUNDED_IN_MEMORY_ONLY"
  );
}
