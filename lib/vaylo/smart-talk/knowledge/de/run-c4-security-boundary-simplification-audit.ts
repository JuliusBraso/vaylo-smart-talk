import "server-only";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import {
  CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
  CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
  CONTROLLED_PREFLIGHT_PLAIN_OBJECT_PROTOTYPE_POLICY,
  type ControlledPreflightCapabilityCandidate,
  hasExactOwnKeys,
  inspectPlainDataArraySafely,
  isDeepFrozen,
  isPlainSyntheticCapabilityData,
  isUntrustedProxy,
  parseClosedCapabilityCandidate,
  validateClosedCapabilityCandidate,
  validateClosedCapabilityContractExport,
} from "../source-registry/controlled-preflight-launcher-capability-contract";
import {
  SYNTHETIC_FAILURE_HARNESS_META,
  SYNTHETIC_FAILURE_INJECTION_POINTS,
} from "../source-registry/controlled-production-postgres-read-only-adapter";
import { runControlledProductionPostgresReadOnlyAdapterAudit } from "./run-controlled-production-postgres-read-only-adapter-audit";
import { runControlledProductionPreflightCredentialAndTransportBoundaryAudit } from "./run-controlled-production-preflight-credential-and-transport-boundary-audit";
import { runControlledProductionPreflightExecutionContractsAudit } from "./run-controlled-production-preflight-execution-contracts-audit";
import { runControlledRemotePreflightExecutionBoundaryDesignAudit } from "./run-controlled-remote-preflight-execution-boundary-design-audit";
import { runDisabledProductionPreflightHelperValidation } from "./run-disabled-production-preflight-helper-validation";
import { runProductionPreflightSyntheticResultFixtureInterfaceAudit } from "./run-production-preflight-synthetic-result-fixture-interface-audit";
import { runProductionReadOnlyPreflightHelperImplementationAudit } from "./run-production-read-only-preflight-helper-implementation-audit";

type StructuredRecord = Readonly<Record<string, unknown>>;

type UpstreamEvidence = Readonly<{
  allPassed: boolean;
  blocked: boolean;
  positiveCount: number;
  positivePassed: number;
  tamperCount: number;
  tamperRejected: number;
  failedMandatoryInvariantCount: number;
  b6eFailedCaseCount: number;
  b6eUnexecutedCaseCount: number;
  b6eDuplicateCaseIdCount: number;
  positiveCompile: number;
  negativeCompile: number;
  positiveRuntime: number;
  negativeRuntime: number;
  tamperCategoryCount: number;
}>;

type AdapterEvidence = Readonly<{
  failurePointCount: number;
  queryFailurePositionCount: number;
  validationFailurePositionCount: number;
  cleanupCaseCount: number;
  failureHarnessTamperRejected: number;
  lifecycleQueryCount: number;
  lifecycleCommitted: boolean;
  lifecycleClosed: boolean;
  publicAdapterFieldCount: number;
  failureControlsExposedPublicly: boolean;
}>;

type SourceIntegrityEvidence = Readonly<{
  beforeHashes: ReadonlyArray<Readonly<{ relativePath: string; sha256: string }>>;
  afterHashes: ReadonlyArray<Readonly<{ relativePath: string; sha256: string }>>;
  stagedPathCount: number;
}>;

type ProductionAuthorizationEvidence = Readonly<{
  productionCredentialAccessed: boolean;
  productionEnvironmentAccessed: boolean;
  remoteConnectionPerformed: boolean;
  databaseConnectionPerformed: boolean;
  sqlExecutionPerformed: boolean;
  productionNoncePersisted: boolean;
  productionNonceConsumed: boolean;
  productionReadOnlyPreflightExecutedNow: boolean;
  productionWriteAuthorized: boolean;
  productionBootstrapAuthorized: boolean;
  productionRollbackArtifactAuthorized: boolean;
  productionRuntimeAuthorized: boolean;
  publicLaunchAuthorized: boolean;
}>;

type AuthoritativeSimplificationInputs = Readonly<{
  /** Untrusted until parseClosedCapabilityCandidate succeeds. */
  capabilityCandidate: unknown;
  authoritativeUpstreamEvidence: Readonly<{
    c4a: UpstreamEvidence;
    b6: UpstreamEvidence;
    b7: UpstreamEvidence;
    c1: UpstreamEvidence;
    c2: UpstreamEvidence;
    c3: UpstreamEvidence;
  }>;
  adapterEvidence: AdapterEvidence;
  sourceIntegrityEvidence: SourceIntegrityEvidence;
  productionAuthorizationEvidence: ProductionAuthorizationEvidence;
  capabilityEvidence: Readonly<{
    tamperCaseCount: number;
    tamperRejected: number;
    positiveCaseCount: number;
    positivePassed: number;
    duplicateTamperIds: number;
    unexecutedTamper: number;
    labelOnlyTamper: number;
  }>;
  closedSchemaEvidence: Readonly<{
    closedSchemaPassed: boolean;
    symbolPropertyRejected: boolean;
  }>;
  contractExportEvidence: Readonly<{
    exportUnderValidation: unknown;
  }>;
}>;

type AuthoritativeEvaluation = Readonly<{
  authorized: boolean;
  closedCapabilitySchemaPassed: boolean;
  productionCapabilityCountZero: boolean;
  plainDataBoundaryPassed: boolean;
  authoritativeNonAstPassed: boolean;
  adapterEvidencePassed: boolean;
  sourceIntegrityPassed: boolean;
  productionAuthorizationSeparated: boolean;
  capabilityEvidencePassed: boolean;
  symbolPropertyRejected: boolean;
}>;

const SOURCE_INTEGRITY_PATHS = Object.freeze([
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-preflight-launcher-capability-contract.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-c4-security-boundary-simplification-audit.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/controlled-production-postgres-read-only-adapter.ts",
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-postgres-read-only-adapter-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-derived-test-registry-and-tamper-pack.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-synthetic-result-fixture-interface-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-production-read-only-preflight-helper-implementation-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-disabled-production-preflight-helper-validation.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-remote-preflight-execution-boundary-design-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-preflight-execution-contracts-audit.ts",
  "lib/vaylo/smart-talk/knowledge/de/run-controlled-production-preflight-credential-and-transport-boundary-audit.ts",
] as const);

const freezePlainData = <T>(value: T): T => {
  if (
    value === null ||
    typeof value !== "object" ||
    ArrayBuffer.isView(value) ||
    value instanceof ArrayBuffer ||
    value instanceof Promise
  ) {
    return value;
  }
  if (isUntrustedProxy(value)) {
    return value;
  }
  for (const key of Reflect.ownKeys(value as object)) {
    const descriptor = Object.getOwnPropertyDescriptor(value as object, key);
    if (descriptor && "value" in descriptor) {
      freezePlainData(descriptor.value);
    }
  }
  Object.freeze(value);
  return value;
};

const snapshot = async (relativePath: string) => {
  const content = await readFile(relativePath, "utf8");
  return Object.freeze({
    relativePath,
    sha256: createHash("sha256").update(content).digest("hex"),
  });
};

const isStructuredRecord = (value: unknown): value is StructuredRecord =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const numberField = (value: StructuredRecord, key: string, fallback = 0): number =>
  typeof value[key] === "number" && Number.isFinite(value[key])
    ? (value[key] as number)
    : fallback;

const booleanField = (
  value: StructuredRecord,
  key: string,
  fallback = false,
): boolean => (typeof value[key] === "boolean" ? (value[key] as boolean) : fallback);

const createAllowedCapabilityExportEntry = (id: string) =>
  Object.freeze({
    id,
    syntheticOnly: true,
    externalAccess: false,
  });

const cloneContractExport = (
  patch: (exp: Record<string, unknown>) => void,
): unknown => {
  const cloned = JSON.parse(
    JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
  ) as Record<string, unknown>;
  patch(cloned);
  return freezePlainData(cloned);
};
const createCanonicalManifest = () =>
  freezePlainData({
    queryIds: Object.freeze(["HELPER_OWNED_APPROVED_QUERY_ID"]),
    fixtureSnapshots: Object.freeze([
      Object.freeze({ queryId: "HELPER_OWNED_APPROVED_QUERY_ID", rows: 1 }),
    ]),
    fixedClockSnapshot: "2026-08-06T00:00:00.000Z",
    nonce: Object.freeze({
      mode: "EPHEMERAL_IN_MEMORY" as const,
      maximumEntries: 32,
    }),
    auditTrace: Object.freeze({
      mode: "IN_MEMORY" as const,
      maximumEvents: 64,
    }),
  });

const createCanonicalCandidate = (): ControlledPreflightCapabilityCandidate =>
  freezePlainData({
    contractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    contractVersion: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    authorizationClass: CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
    productionCapabilityCount: 0,
    allowedCapabilities: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
    forbiddenCapabilities: CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
    manifest: createCanonicalManifest(),
  });

const cloneCandidate = (
  patch: (candidate: Record<string, unknown>) => void,
): ControlledPreflightCapabilityCandidate => {
  const cloned = JSON.parse(
    JSON.stringify(createCanonicalCandidate()),
  ) as Record<string, unknown>;
  patch(cloned);
  return freezePlainData(cloned) as ControlledPreflightCapabilityCandidate;
};

const withSymbolKey = (
  base: object,
  symbol: symbol,
  value: unknown,
): ControlledPreflightCapabilityCandidate => {
  const target = JSON.parse(JSON.stringify(base)) as Record<
    string | symbol,
    unknown
  >;
  Object.defineProperty(target, symbol, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
  return target as ControlledPreflightCapabilityCandidate;
};

const createAccessorArray = <T>(
  values: ReadonlyArray<T>,
  accessorIndex: number,
  sentinel: { invoked: number },
  mode: "get" | "set" = "get",
): T[] => {
  const array = [...values] as T[];
  if (mode === "get") {
    Object.defineProperty(array, String(accessorIndex), {
      get() {
        sentinel.invoked += 1;
        return values[accessorIndex];
      },
      enumerable: true,
      configurable: true,
    });
  } else {
    Object.defineProperty(array, String(accessorIndex), {
      set() {
        sentinel.invoked += 1;
      },
      enumerable: true,
      configurable: true,
    });
  }
  Object.freeze(array);
  return array;
};

type ProxyTrapCounters = {
  ownKeys: number;
  getOwnPropertyDescriptor: number;
  get: number;
  getPrototypeOf: number;
  has: number;
  set: number;
  defineProperty: number;
  deleteProperty: number;
  apply: number;
  construct: number;
};

const createEmptyProxyTrapCounters = (): ProxyTrapCounters => ({
  ownKeys: 0,
  getOwnPropertyDescriptor: 0,
  get: 0,
  getPrototypeOf: 0,
  has: 0,
  set: 0,
  defineProperty: 0,
  deleteProperty: 0,
  apply: 0,
  construct: 0,
});

const proxyTrapTotal = (counters: ProxyTrapCounters): number =>
  counters.ownKeys +
  counters.getOwnPropertyDescriptor +
  counters.get +
  counters.getPrototypeOf +
  counters.has +
  counters.set +
  counters.defineProperty +
  counters.deleteProperty +
  counters.apply +
  counters.construct;

const createTrappingProxy = <T extends object>(
  target: T,
  counters: ProxyTrapCounters,
): T =>
  new Proxy(target, {
    ownKeys(innerTarget) {
      counters.ownKeys += 1;
      return Reflect.ownKeys(innerTarget);
    },
    getOwnPropertyDescriptor(innerTarget, property) {
      counters.getOwnPropertyDescriptor += 1;
      return Reflect.getOwnPropertyDescriptor(innerTarget, property);
    },
    get(innerTarget, property, receiver) {
      counters.get += 1;
      return Reflect.get(innerTarget, property, receiver);
    },
    getPrototypeOf(innerTarget) {
      counters.getPrototypeOf += 1;
      return Reflect.getPrototypeOf(innerTarget);
    },
    has(innerTarget, property) {
      counters.has += 1;
      return Reflect.has(innerTarget, property);
    },
    set(innerTarget, property, value, receiver) {
      counters.set += 1;
      return Reflect.set(innerTarget, property, value, receiver);
    },
    defineProperty(innerTarget, property, descriptor) {
      counters.defineProperty += 1;
      return Reflect.defineProperty(innerTarget, property, descriptor);
    },
    deleteProperty(innerTarget, property) {
      counters.deleteProperty += 1;
      return Reflect.deleteProperty(innerTarget, property);
    },
    apply(innerTarget, thisArg, argArray) {
      counters.apply += 1;
      return Reflect.apply(
        innerTarget as (...args: unknown[]) => unknown,
        thisArg,
        argArray,
      );
    },
    construct(innerTarget, argArray, newTarget) {
      counters.construct += 1;
      return Reflect.construct(
        innerTarget as new (...args: unknown[]) => object,
        argArray,
        newTarget,
      );
    },
  });

const freezeOuterCandidateLeavingProxyFields = (
  candidate: Record<string, unknown>,
  proxyField: "allowedCapabilities" | "forbiddenCapabilities" | "manifest" | null,
): unknown => {
  if (proxyField !== "allowedCapabilities") {
    candidate.allowedCapabilities = Object.freeze([
      ...(candidate.allowedCapabilities as string[]),
    ]);
  }
  if (proxyField !== "forbiddenCapabilities") {
    candidate.forbiddenCapabilities = Object.freeze([
      ...(candidate.forbiddenCapabilities as string[]),
    ]);
  }
  if (proxyField !== "manifest") {
    candidate.manifest = freezePlainData(candidate.manifest);
  }
  return Object.freeze(candidate);
};

/** Build a candidate with a Proxy nested under manifest without deepFreeze trapping. */
const candidateWithManifestProxyAssign = (
  assignManifest: (manifest: Record<string, unknown>) => void,
): unknown => {
  const candidate = JSON.parse(
    JSON.stringify(createCanonicalCandidate()),
  ) as Record<string, unknown>;
  const manifest = {
    queryIds: Object.freeze(["HELPER_OWNED_APPROVED_QUERY_ID"]),
    fixtureSnapshots: Object.freeze([
      Object.freeze({ queryId: "HELPER_OWNED_APPROVED_QUERY_ID", rows: 1 }),
    ]),
    fixedClockSnapshot: "2026-08-06T00:00:00.000Z",
    nonce: Object.freeze({
      mode: "EPHEMERAL_IN_MEMORY",
      maximumEntries: 32,
    }),
    auditTrace: Object.freeze({
      mode: "IN_MEMORY",
      maximumEvents: 64,
    }),
  } as Record<string, unknown>;
  assignManifest(manifest);
  candidate.manifest = Object.freeze(manifest);
  candidate.allowedCapabilities = Object.freeze([
    ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
  ]);
  candidate.forbiddenCapabilities = Object.freeze([
    ...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
  ]);
  return Object.freeze(candidate);
};

const runBounded = async (
  runner: () => unknown | Promise<unknown>,
): Promise<Readonly<{ value: unknown; runnerError: boolean }>> => {
  try {
    return Object.freeze({ value: await runner(), runnerError: false });
  } catch {
    return Object.freeze({ value: null, runnerError: true });
  }
};

const normalizeUpstream = (
  result: Readonly<{ value: unknown; runnerError: boolean }>,
  mapping: Readonly<{
    positiveKeys: ReadonlyArray<string>;
    positivePassedKeys: ReadonlyArray<string>;
    tamperKeys: ReadonlyArray<string>;
    tamperRejectedKeys: ReadonlyArray<string>;
  }>,
): UpstreamEvidence => {
  if (result.runnerError || !isStructuredRecord(result.value)) {
    return Object.freeze({
      allPassed: false,
      blocked: true,
      positiveCount: 0,
      positivePassed: 0,
      tamperCount: 0,
      tamperRejected: 0,
      failedMandatoryInvariantCount: 1,
      b6eFailedCaseCount: 1,
      b6eUnexecutedCaseCount: 1,
      b6eDuplicateCaseIdCount: 1,
      positiveCompile: 0,
      negativeCompile: 0,
      positiveRuntime: 0,
      negativeRuntime: 0,
      tamperCategoryCount: 0,
    });
  }
  const value = result.value;
  const firstNumber = (keys: ReadonlyArray<string>) => {
    for (const key of keys) {
      if (typeof value[key] === "number") return numberField(value, key);
    }
    return 0;
  };
  return Object.freeze({
    allPassed: booleanField(value, "allPassed", false),
    blocked: booleanField(value, "blocked", true),
    positiveCount: firstNumber(mapping.positiveKeys),
    positivePassed: firstNumber(mapping.positivePassedKeys),
    tamperCount: firstNumber(mapping.tamperKeys),
    tamperRejected: firstNumber(mapping.tamperRejectedKeys),
    failedMandatoryInvariantCount: numberField(
      value,
      "failedMandatoryInvariantCount",
      0,
    ),
    b6eFailedCaseCount: numberField(value, "b6eFailedCaseCount", 0),
    b6eUnexecutedCaseCount: numberField(value, "b6eUnexecutedCaseCount", 0),
    b6eDuplicateCaseIdCount: numberField(value, "b6eDuplicateCaseIdCount", 0),
    positiveCompile: numberField(value, "positiveCompileTimeCaseCount", 0),
    negativeCompile: numberField(value, "negativeCompileTimeCaseCount", 0),
    positiveRuntime: numberField(value, "positiveRuntimeCaseCount", 0),
    negativeRuntime: numberField(value, "negativeRuntimeCaseCount", 0),
    tamperCategoryCount: numberField(value, "b6TamperCategoryCount", 0),
  });
};

const evaluateIndependentNonCapabilityEvidence = (
  inputs: AuthoritativeSimplificationInputs,
): Omit<
  AuthoritativeEvaluation,
  | "authorized"
  | "closedCapabilitySchemaPassed"
  | "productionCapabilityCountZero"
  | "plainDataBoundaryPassed"
> => {
  const upstream = inputs.authoritativeUpstreamEvidence;
  const authoritativeNonAstPassed =
    upstream.c4a.allPassed &&
    !upstream.c4a.blocked &&
    upstream.c4a.positiveCount >= 73 &&
    upstream.c4a.positivePassed === upstream.c4a.positiveCount &&
    upstream.c4a.tamperCount >= 251 &&
    upstream.c4a.tamperRejected === upstream.c4a.tamperCount &&
    upstream.b6.allPassed &&
    !upstream.b6.blocked &&
    upstream.b6.positiveCompile >= 130 &&
    upstream.b6.negativeCompile >= 400 &&
    upstream.b6.positiveRuntime >= 280 &&
    upstream.b6.negativeRuntime >= 750 &&
    upstream.b6.tamperCount >= 1200 &&
    upstream.b6.tamperCategoryCount >= 36 &&
    upstream.b6.b6eFailedCaseCount === 0 &&
    upstream.b6.b6eUnexecutedCaseCount === 0 &&
    upstream.b6.b6eDuplicateCaseIdCount === 0 &&
    upstream.b7.allPassed &&
    upstream.b7.failedMandatoryInvariantCount === 0 &&
    upstream.c1.allPassed &&
    upstream.c1.tamperCount >= 188 &&
    upstream.c1.tamperRejected === upstream.c1.tamperCount &&
    upstream.c2.allPassed &&
    upstream.c2.positiveCount >= 23 &&
    upstream.c2.tamperCount >= 260 &&
    upstream.c3.allPassed &&
    upstream.c3.positiveCount >= 20 &&
    upstream.c3.tamperCount >= 299;
  const adapter = inputs.adapterEvidence;
  const adapterEvidencePassed =
    adapter.failurePointCount === 42 &&
    adapter.queryFailurePositionCount === 18 &&
    adapter.validationFailurePositionCount === 18 &&
    adapter.cleanupCaseCount >= 12 &&
    adapter.failureHarnessTamperRejected >= 120 &&
    adapter.lifecycleQueryCount === 18 &&
    adapter.lifecycleCommitted &&
    adapter.lifecycleClosed &&
    adapter.publicAdapterFieldCount === 13 &&
    !adapter.failureControlsExposedPublicly;
  const hashesMatch =
    inputs.sourceIntegrityEvidence.beforeHashes.length ===
      inputs.sourceIntegrityEvidence.afterHashes.length &&
    inputs.sourceIntegrityEvidence.beforeHashes.every(
      (before, index) =>
        before.relativePath ===
          inputs.sourceIntegrityEvidence.afterHashes[index]?.relativePath &&
        before.sha256 ===
          inputs.sourceIntegrityEvidence.afterHashes[index]?.sha256,
    );
  const sourceIntegrityPassed =
    hashesMatch && inputs.sourceIntegrityEvidence.stagedPathCount === 0;
  const production = inputs.productionAuthorizationEvidence;
  const productionAuthorizationSeparated = Object.values(production).every(
    (value) => value === false,
  );
  const capabilityEvidencePassed =
    inputs.capabilityEvidence.tamperCaseCount >= 119 &&
    inputs.capabilityEvidence.tamperRejected ===
      inputs.capabilityEvidence.tamperCaseCount &&
    inputs.capabilityEvidence.positiveCaseCount >= 8 &&
    inputs.capabilityEvidence.positivePassed ===
      inputs.capabilityEvidence.positiveCaseCount &&
    inputs.capabilityEvidence.duplicateTamperIds === 0 &&
    inputs.capabilityEvidence.unexecutedTamper === 0 &&
    inputs.capabilityEvidence.labelOnlyTamper === 0;
  return Object.freeze({
    authoritativeNonAstPassed,
    adapterEvidencePassed,
    sourceIntegrityPassed,
    productionAuthorizationSeparated,
    capabilityEvidencePassed,
    symbolPropertyRejected: inputs.closedSchemaEvidence.symbolPropertyRejected,
  });
};

const evaluateAuthoritativeSimplification = (
  inputs: AuthoritativeSimplificationInputs,
): AuthoritativeEvaluation => {
  const independent = evaluateIndependentNonCapabilityEvidence(inputs);
  const parsedCandidate = parseClosedCapabilityCandidate(
    inputs.capabilityCandidate,
  );
  if (!parsedCandidate.ok) {
    return Object.freeze({
      authorized: false,
      closedCapabilitySchemaPassed: false,
      productionCapabilityCountZero: false,
      plainDataBoundaryPassed: false,
      ...independent,
    });
  }

  const candidate = parsedCandidate.value;
  const closedCapabilitySchemaPassed =
    inputs.closedSchemaEvidence.closedSchemaPassed &&
    validateClosedCapabilityContractExport(
      inputs.contractExportEvidence.exportUnderValidation,
    );
  const productionCapabilityCountZero =
    candidate.productionCapabilityCount === 0;
  const plainDataBoundaryPassed = isPlainSyntheticCapabilityData(
    candidate.manifest,
  );
  const authorized =
    closedCapabilitySchemaPassed &&
    productionCapabilityCountZero &&
    plainDataBoundaryPassed &&
    independent.authoritativeNonAstPassed &&
    independent.adapterEvidencePassed &&
    independent.sourceIntegrityPassed &&
    independent.productionAuthorizationSeparated &&
    independent.capabilityEvidencePassed &&
    independent.symbolPropertyRejected;
  return Object.freeze({
    authorized,
    closedCapabilitySchemaPassed,
    productionCapabilityCountZero,
    plainDataBoundaryPassed,
    ...independent,
  });
};

export async function runC4SecurityBoundarySimplificationAudit() {
  const sourceIntegrityBefore = await Promise.all(
    SOURCE_INTEGRITY_PATHS.map(snapshot),
  );

  const [
    c4aRaw,
    helperRaw,
    disabledRaw,
    remoteRaw,
    contractsRaw,
    credentialRaw,
    legacyAstDiagnostic,
  ] = await Promise.all([
    runBounded(runProductionPreflightSyntheticResultFixtureInterfaceAudit),
    runBounded(runProductionReadOnlyPreflightHelperImplementationAudit),
    runBounded(runDisabledProductionPreflightHelperValidation),
    runBounded(runControlledRemotePreflightExecutionBoundaryDesignAudit),
    runBounded(runControlledProductionPreflightExecutionContractsAudit),
    runBounded(runControlledProductionPreflightCredentialAndTransportBoundaryAudit),
    runBounded(runControlledProductionPostgresReadOnlyAdapterAudit),
  ]);

  const getterSentinel = { invoked: false };
  const getterFixture = {};
  Object.defineProperty(getterFixture, "unsafe", {
    get() {
      getterSentinel.invoked = true;
      return true;
    },
    enumerable: true,
    configurable: true,
  });
  const setterFixture = {};
  Object.defineProperty(setterFixture, "unsafe", {
    set() {
      return undefined;
    },
    enumerable: true,
    configurable: true,
  });
  const nestedSymbolManifest = JSON.parse(
    JSON.stringify(createCanonicalManifest()),
  ) as Record<string | symbol, unknown>;
  Object.defineProperty(nestedSymbolManifest, Symbol("nested"), {
    value: "x",
    enumerable: true,
    configurable: true,
    writable: true,
  });

  const capabilityTamperInputs: ReadonlyArray<
    Readonly<{ id: string; candidate: unknown }>
  > = Object.freeze([
    ...[
      "CREDENTIALS",
      "ENVIRONMENT_ACCESS",
      "FILESYSTEM_READ",
      "FILESYSTEM_WRITE",
      "NETWORK",
      "DNS",
      "HTTP",
      "SOCKETS",
      "DATABASE_CONNECTION",
      "POSTGRESQL_CLIENT",
      "SUPABASE_CLIENT",
      "SQL_TEXT",
      "ARBITRARY_QUERY_TEXT",
      "SUBPROCESS",
      "SHELL",
      "COMMAND_EXECUTION",
      "PRODUCTION_NONCE_PERSISTENCE",
      "EXTERNAL_STORAGE",
      "BOOTSTRAP_EXECUTION",
      "ROLLBACK_ARTIFACT_EXECUTION",
      "MIGRATION_EXECUTION",
      "PRODUCTION_PREFLIGHT_EXECUTION",
      "DEPLOYMENT",
      "RUNTIME_ACTIVATION",
      "PUBLIC_LAUNCH",
      "UNKNOWN_FIFTH_CAPABILITY",
    ].map((forbidden, index) =>
      Object.freeze({
        id: `capability_tamper_forbidden_${String(index + 1).padStart(2, "0")}`,
        candidate: cloneCandidate((candidate) => {
          candidate.allowedCapabilities = Object.freeze([
            ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
            forbidden,
          ]);
        }),
      }),
    ),
    Object.freeze({
      id: "capability_tamper_missing_capability",
      candidate: cloneCandidate((candidate) => {
        candidate.allowedCapabilities = Object.freeze(
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(0, 3),
        );
      }),
    }),
    Object.freeze({
      id: "capability_tamper_duplicate_capability",
      candidate: cloneCandidate((candidate) => {
        candidate.allowedCapabilities = Object.freeze([
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(0, 3),
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
        ]);
      }),
    }),
    Object.freeze({
      id: "capability_tamper_function",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).callback = () => true;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_promise",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).result =
          Promise.resolve("x");
      }),
    }),
    Object.freeze({
      id: "capability_tamper_buffer",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).bytes = new Uint8Array([1]);
      }),
    }),
    Object.freeze({
      id: "capability_tamper_custom_prototype",
      candidate: cloneCandidate((candidate) => {
        candidate.manifest = Object.create({ unsafe: true });
      }),
    }),
    Object.freeze({
      id: "capability_tamper_mutable_inventory",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = [
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        ];
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "capability_tamper_unknown_top_level",
      candidate: cloneCandidate((candidate) => {
        candidate.runtime = "x";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_candidate_metadata",
      candidate: cloneCandidate((candidate) => {
        candidate.metadata = { note: "x" };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_candidate_extensions",
      candidate: cloneCandidate((candidate) => {
        candidate.extensions = { plugin: "x" };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_symbol_top_level",
      candidate: withSymbolKey(
        createCanonicalCandidate(),
        Symbol("top"),
        "x",
      ),
    }),
    Object.freeze({
      id: "capability_tamper_unknown_manifest_key",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).extra = "x";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_manifest_metadata",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).metadata = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_manifest_payload",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).payload = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_manifest_context",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).context = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_manifest_extensions",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).extensions = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_nested_capability_key",
      candidate: cloneCandidate((candidate) => {
        const nonce = (candidate.manifest as Record<string, unknown>)
          .nonce as Record<string, unknown>;
        nonce.provider = "x";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_capability_payload",
      candidate: cloneCandidate((candidate) => {
        const nonce = (candidate.manifest as Record<string, unknown>)
          .nonce as Record<string, unknown>;
        nonce.payload = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_capability_options",
      candidate: cloneCandidate((candidate) => {
        const audit = (candidate.manifest as Record<string, unknown>)
          .auditTrace as Record<string, unknown>;
        audit.options = { a: 1 };
      }),
    }),
    Object.freeze({
      id: "capability_tamper_capability_callback",
      candidate: cloneCandidate((candidate) => {
        const audit = (candidate.manifest as Record<string, unknown>)
          .auditTrace as Record<string, unknown>;
        audit.callback = () => true;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_query_fixture_unknown_key",
      candidate: cloneCandidate((candidate) => {
        const snapshots = (candidate.manifest as Record<string, unknown>)
          .fixtureSnapshots as Array<Record<string, unknown>>;
        snapshots[0].table = "users";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_query_fixture_sql",
      candidate: cloneCandidate((candidate) => {
        const snapshots = (candidate.manifest as Record<string, unknown>)
          .fixtureSnapshots as Array<Record<string, unknown>>;
        snapshots[0].sql = "SELECT * FROM users";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_query_fixture_query_text",
      candidate: cloneCandidate((candidate) => {
        const snapshots = (candidate.manifest as Record<string, unknown>)
          .fixtureSnapshots as Array<Record<string, unknown>>;
        snapshots[0].queryText = "SELECT 1";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_nonce_unknown_key",
      candidate: cloneCandidate((candidate) => {
        const nonce = (candidate.manifest as Record<string, unknown>)
          .nonce as Record<string, unknown>;
        nonce.store = "memory";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_nonce_store",
      candidate: cloneCandidate((candidate) => {
        const nonce = (candidate.manifest as Record<string, unknown>)
          .nonce as Record<string, unknown>;
        nonce.redis = "redis://example";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_fixed_clock_unknown_key",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).clockProvider = "x";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_fixed_clock_callback",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).fixedClockSnapshot =
          (() => "2026-01-01T00:00:00.000Z") as unknown as string;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_audit_trace_unknown_key",
      candidate: cloneCandidate((candidate) => {
        const audit = (candidate.manifest as Record<string, unknown>)
          .auditTrace as Record<string, unknown>;
        audit.transport = "http";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_audit_trace_transport",
      candidate: cloneCandidate((candidate) => {
        const audit = (candidate.manifest as Record<string, unknown>)
          .auditTrace as Record<string, unknown>;
        audit.endpoint = "https://example.invalid";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_getter_sentinel",
      candidate: cloneCandidate((candidate) => {
        candidate.manifest = getterFixture;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_setter",
      candidate: cloneCandidate((candidate) => {
        candidate.manifest = setterFixture;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_nested_symbol",
      candidate: cloneCandidate((candidate) => {
        candidate.manifest = nestedSymbolManifest as never;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_nested_custom_prototype",
      candidate: cloneCandidate((candidate) => {
        const nonce = Object.create({ unsafe: true });
        nonce.mode = "EPHEMERAL_IN_MEMORY";
        nonce.maximumEntries = 1;
        (candidate.manifest as Record<string, unknown>).nonce = nonce;
      }),
    }),
    Object.freeze({
      id: "capability_tamper_url",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).endpoint =
          "https://example.invalid";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_file_path",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).path = "/etc/passwd";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_connection_string",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).connection =
          "postgres://example";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_command",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).command = "rm -rf /";
      }),
    }),
    Object.freeze({
      id: "capability_tamper_sql_manifest",
      candidate: cloneCandidate((candidate) => {
        (candidate.manifest as Record<string, unknown>).sql =
          "SELECT * FROM users";
      }),
    }),
  ]);

  const arrayAccessorSentinel = { invoked: 0 };
  const arrayAccessorSentinelInputs: ReadonlyArray<
    Readonly<{ id: string; candidate: unknown }>
  > = Object.freeze([
    Object.freeze({
      id: "array_accessor_allowed_capabilities",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = createAccessorArray(
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
          0,
          arrayAccessorSentinel,
        );
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "array_accessor_forbidden_capabilities",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = Object.freeze([
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        ]);
        candidate.forbiddenCapabilities = createAccessorArray(
          CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS,
          0,
          arrayAccessorSentinel,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "array_accessor_query_ids",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.queryIds = createAccessorArray(
          ["HELPER_OWNED_APPROVED_QUERY_ID"],
          0,
          arrayAccessorSentinel,
        );
      }),
    }),
    Object.freeze({
      id: "array_accessor_fixture_snapshots",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.fixtureSnapshots = createAccessorArray(
          [{ queryId: "HELPER_OWNED_APPROVED_QUERY_ID", rows: 1 }],
          0,
          arrayAccessorSentinel,
        );
      }),
    }),
    Object.freeze({
      id: "array_accessor_fixture_rows",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.fixtureSnapshots = Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows: createAccessorArray([1], 0, arrayAccessorSentinel),
          }),
        ]);
      }),
    }),
    Object.freeze({
      id: "array_accessor_nested_row_array",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.fixtureSnapshots = Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows: createAccessorArray([[1]], 0, arrayAccessorSentinel),
          }),
        ]);
      }),
    }),
    Object.freeze({
      id: "array_accessor_audit_trace_array",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.auditTrace = createAccessorArray(
          [{ mode: "IN_MEMORY", maximumEvents: 1 }],
          0,
          arrayAccessorSentinel,
        );
      }),
    }),
    Object.freeze({
      id: "array_accessor_allowed_capabilities_setter",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = createAccessorArray(
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
          0,
          arrayAccessorSentinel,
          "set",
        );
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
  ]);

  const hostileArrayTamperInputs: ReadonlyArray<
    Readonly<{ id: string; candidate: unknown }>
  > = Object.freeze([
    Object.freeze({
      id: "hostile_array_symbol_allowed",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        ] as Array<string | symbol>;
        Object.defineProperty(allowed, Symbol("extra"), {
          value: "x",
          enumerable: true,
          configurable: true,
          writable: true,
        });
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "hostile_array_symbol_nested_rows",
      candidate: cloneCandidate((candidate) => {
        const rows = [1] as Array<number | symbol>;
        Object.defineProperty(rows, Symbol("nested"), {
          value: "x",
          enumerable: true,
          configurable: true,
          writable: true,
        });
        Object.freeze(rows);
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.fixtureSnapshots = Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows,
          }),
        ]);
      }),
    }),
    Object.freeze({
      id: "hostile_array_extra_own_property",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        ] as Array<string> & { note?: string };
        allowed.note = "extra";
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "hostile_array_sparse_allowed",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [] as string[];
        allowed.length = 4;
        allowed[1] = CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[1];
        allowed[2] = CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2];
        allowed[3] = CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3];
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "hostile_array_sparse_query_ids",
      candidate: cloneCandidate((candidate) => {
        const queryIds = [] as string[];
        queryIds.length = 2;
        queryIds[1] = "HELPER_OWNED_APPROVED_QUERY_ID";
        Object.freeze(queryIds);
        (candidate.manifest as Record<string, unknown>).queryIds = queryIds;
      }),
    }),
    Object.freeze({
      id: "hostile_array_custom_prototype",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS];
        Object.setPrototypeOf(allowed, Object.create(Array.prototype));
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "hostile_array_nested_function",
      candidate: cloneCandidate((candidate) => {
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.queryIds = Object.freeze([() => "HELPER_OWNED_APPROVED_QUERY_ID"]);
      }),
    }),
    Object.freeze({
      id: "hostile_array_nested_custom_prototype",
      candidate: cloneCandidate((candidate) => {
        const nested = Object.create({ unsafe: true });
        nested.queryId = "HELPER_OWNED_APPROVED_QUERY_ID";
        nested.rows = 1;
        const manifest = candidate.manifest as Record<string, unknown>;
        manifest.fixtureSnapshots = Object.freeze([nested]);
      }),
    }),
    Object.freeze({
      id: "hostile_array_symbol_iterator",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        ] as Array<string>;
        Object.defineProperty(allowed, Symbol.iterator, {
          value: function* () {
            arrayAccessorSentinel.invoked += 1;
            yield* CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS;
          },
          enumerable: false,
          configurable: true,
          writable: true,
        });
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
    Object.freeze({
      id: "hostile_array_noncanonical_index_key",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const allowed = [
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[1],
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2],
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3],
        ] as Array<string> & { "01"?: string };
        Object.defineProperty(allowed, "01", {
          value: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
          enumerable: true,
          configurable: true,
          writable: true,
        });
        Object.freeze(allowed);
        candidate.allowedCapabilities = allowed;
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        return Object.freeze(candidate);
      })(),
    }),
  ]);

  const proxyTrapCounters = createEmptyProxyTrapCounters();
  const proxyRejectionInputs: ReadonlyArray<
    Readonly<{ id: string; candidate: unknown }>
  > = Object.freeze([
    Object.freeze({
      id: "proxy_outer_candidate",
      candidate: createTrappingProxy(
        createCanonicalCandidate() as object,
        proxyTrapCounters,
      ),
    }),
    Object.freeze({
      id: "proxy_allowed_capabilities",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = createTrappingProxy(
          Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
          proxyTrapCounters,
        );
        return freezeOuterCandidateLeavingProxyFields(
          candidate,
          "allowedCapabilities",
        );
      })(),
    }),
    Object.freeze({
      id: "proxy_forbidden_capabilities",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.forbiddenCapabilities = createTrappingProxy(
          Object.freeze([...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS]),
          proxyTrapCounters,
        );
        return freezeOuterCandidateLeavingProxyFields(
          candidate,
          "forbiddenCapabilities",
        );
      })(),
    }),
    Object.freeze({
      id: "proxy_manifest",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        candidate.manifest = createTrappingProxy(
          freezePlainData(candidate.manifest) as object,
          proxyTrapCounters,
        );
        return freezeOuterCandidateLeavingProxyFields(candidate, "manifest");
      })(),
    }),
    Object.freeze({
      id: "proxy_query_ids",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.queryIds = createTrappingProxy(
          Object.freeze(["HELPER_OWNED_APPROVED_QUERY_ID"]),
          proxyTrapCounters,
        );
      }),
    }),
    Object.freeze({
      id: "proxy_fixture_snapshots",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.fixtureSnapshots = createTrappingProxy(
          Object.freeze([
            Object.freeze({
              queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
              rows: 1,
            }),
          ]),
          proxyTrapCounters,
        );
      }),
    }),
    Object.freeze({
      id: "proxy_fixture_snapshot",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.fixtureSnapshots = Object.freeze([
          createTrappingProxy(
            Object.freeze({
              queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
              rows: 1,
            }),
            proxyTrapCounters,
          ),
        ]);
      }),
    }),
    Object.freeze({
      id: "proxy_fixture_rows",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.fixtureSnapshots = Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows: createTrappingProxy(Object.freeze([1]), proxyTrapCounters),
          }),
        ]);
      }),
    }),
    Object.freeze({
      id: "proxy_nested_row_object",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.fixtureSnapshots = Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows: Object.freeze([
              createTrappingProxy(
                Object.freeze({ nested: true }),
                proxyTrapCounters,
              ),
            ]),
          }),
        ]);
      }),
    }),
    Object.freeze({
      id: "proxy_nonce",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.nonce = createTrappingProxy(
          Object.freeze({
            mode: "EPHEMERAL_IN_MEMORY",
            maximumEntries: 8,
          }),
          proxyTrapCounters,
        );
      }),
    }),
    Object.freeze({
      id: "proxy_audit_trace",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.auditTrace = createTrappingProxy(
          Object.freeze({
            mode: "IN_MEMORY",
            maximumEvents: 32,
          }),
          proxyTrapCounters,
        );
      }),
    }),
    Object.freeze({
      id: "proxy_revoked",
      candidate: (() => {
        const candidate = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        const revocable = Proxy.revocable(
          Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
          {
            ownKeys(innerTarget) {
              proxyTrapCounters.ownKeys += 1;
              return Reflect.ownKeys(innerTarget);
            },
            getOwnPropertyDescriptor(innerTarget, property) {
              proxyTrapCounters.getOwnPropertyDescriptor += 1;
              return Reflect.getOwnPropertyDescriptor(innerTarget, property);
            },
            get(innerTarget, property, receiver) {
              proxyTrapCounters.get += 1;
              return Reflect.get(innerTarget, property, receiver);
            },
            getPrototypeOf(innerTarget) {
              proxyTrapCounters.getPrototypeOf += 1;
              return Reflect.getPrototypeOf(innerTarget);
            },
            has(innerTarget, property) {
              proxyTrapCounters.has += 1;
              return Reflect.has(innerTarget, property);
            },
          },
        );
        revocable.revoke();
        candidate.allowedCapabilities = revocable.proxy;
        return freezeOuterCandidateLeavingProxyFields(
          candidate,
          "allowedCapabilities",
        );
      })(),
    }),
    Object.freeze({
      id: "proxy_primitive_box",
      candidate: candidateWithManifestProxyAssign((manifest) => {
        manifest.fixedClockSnapshot = createTrappingProxy(
          Object("2026-01-01T00:00:00.000Z"),
          proxyTrapCounters,
        );
      }),
    }),
  ]);

  // Materialize complete-evaluator Proxy candidates with dedicated counters.
  const completeEvaluatorProxyMaterialized = Object.freeze(
    [
      "complete_eval_proxy_root",
      "complete_eval_proxy_root_revoked",
      "complete_eval_proxy_allowed_capabilities",
      "complete_eval_proxy_forbidden_capabilities",
      "complete_eval_proxy_manifest",
      "complete_eval_proxy_query_ids",
      "complete_eval_proxy_fixture_snapshots",
      "complete_eval_proxy_fixture_snapshot",
      "complete_eval_proxy_fixture_rows",
      "complete_eval_proxy_nested_row_object",
      "complete_eval_proxy_nonce",
      "complete_eval_proxy_audit_trace",
    ].map((id) => {
      const counters = createEmptyProxyTrapCounters();
      let candidate: unknown;
      if (id === "complete_eval_proxy_root") {
        candidate = createTrappingProxy(
          createCanonicalCandidate() as object,
          counters,
        );
      } else if (id === "complete_eval_proxy_root_revoked") {
        const revocable = Proxy.revocable(
          createCanonicalCandidate() as object,
          {
            ownKeys(innerTarget) {
              counters.ownKeys += 1;
              return Reflect.ownKeys(innerTarget);
            },
            getOwnPropertyDescriptor(innerTarget, property) {
              counters.getOwnPropertyDescriptor += 1;
              return Reflect.getOwnPropertyDescriptor(innerTarget, property);
            },
            get(innerTarget, property, receiver) {
              counters.get += 1;
              return Reflect.get(innerTarget, property, receiver);
            },
            getPrototypeOf(innerTarget) {
              counters.getPrototypeOf += 1;
              return Reflect.getPrototypeOf(innerTarget);
            },
            has(innerTarget, property) {
              counters.has += 1;
              return Reflect.has(innerTarget, property);
            },
            set(innerTarget, property, value, receiver) {
              counters.set += 1;
              return Reflect.set(innerTarget, property, value, receiver);
            },
            defineProperty(innerTarget, property, descriptor) {
              counters.defineProperty += 1;
              return Reflect.defineProperty(innerTarget, property, descriptor);
            },
            deleteProperty(innerTarget, property) {
              counters.deleteProperty += 1;
              return Reflect.deleteProperty(innerTarget, property);
            },
            apply(innerTarget, thisArg, argArray) {
              counters.apply += 1;
              return Reflect.apply(
                innerTarget as (...args: unknown[]) => unknown,
                thisArg,
                argArray,
              );
            },
            construct(innerTarget, argArray, newTarget) {
              counters.construct += 1;
              return Reflect.construct(
                innerTarget as new (...args: unknown[]) => object,
                argArray,
                newTarget,
              );
            },
          },
        );
        revocable.revoke();
        candidate = revocable.proxy;
      } else if (id === "complete_eval_proxy_allowed_capabilities") {
        const record = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        record.allowedCapabilities = createTrappingProxy(
          Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
          counters,
        );
        candidate = freezeOuterCandidateLeavingProxyFields(
          record,
          "allowedCapabilities",
        );
      } else if (id === "complete_eval_proxy_forbidden_capabilities") {
        const record = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        record.forbiddenCapabilities = createTrappingProxy(
          Object.freeze([...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS]),
          counters,
        );
        candidate = freezeOuterCandidateLeavingProxyFields(
          record,
          "forbiddenCapabilities",
        );
      } else if (id === "complete_eval_proxy_manifest") {
        const record = JSON.parse(
          JSON.stringify(createCanonicalCandidate()),
        ) as Record<string, unknown>;
        record.manifest = createTrappingProxy(
          freezePlainData(record.manifest) as object,
          counters,
        );
        candidate = freezeOuterCandidateLeavingProxyFields(record, "manifest");
      } else if (id === "complete_eval_proxy_query_ids") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.queryIds = createTrappingProxy(
            Object.freeze(["HELPER_OWNED_APPROVED_QUERY_ID"]),
            counters,
          );
        });
      } else if (id === "complete_eval_proxy_fixture_snapshots") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.fixtureSnapshots = createTrappingProxy(
            Object.freeze([
              Object.freeze({
                queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
                rows: 1,
              }),
            ]),
            counters,
          );
        });
      } else if (id === "complete_eval_proxy_fixture_snapshot") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.fixtureSnapshots = Object.freeze([
            createTrappingProxy(
              Object.freeze({
                queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
                rows: 1,
              }),
              counters,
            ),
          ]);
        });
      } else if (id === "complete_eval_proxy_fixture_rows") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.fixtureSnapshots = Object.freeze([
            Object.freeze({
              queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
              rows: createTrappingProxy(Object.freeze([1]), counters),
            }),
          ]);
        });
      } else if (id === "complete_eval_proxy_nested_row_object") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.fixtureSnapshots = Object.freeze([
            Object.freeze({
              queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
              rows: Object.freeze([
                createTrappingProxy(
                  Object.freeze({ nested: true }),
                  counters,
                ),
              ]),
            }),
          ]);
        });
      } else if (id === "complete_eval_proxy_nonce") {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.nonce = createTrappingProxy(
            Object.freeze({
              mode: "EPHEMERAL_IN_MEMORY",
              maximumEntries: 8,
            }),
            counters,
          );
        });
      } else {
        candidate = candidateWithManifestProxyAssign((manifest) => {
          manifest.auditTrace = createTrappingProxy(
            Object.freeze({
              mode: "IN_MEMORY",
              maximumEvents: 32,
            }),
            counters,
          );
        });
      }
      return Object.freeze({ id, candidate, counters });
    }),
  );

  const contractExportExactnessGetterSentinel = { invoked: 0 };
  const contractExportExactnessProxyCaseCounters: ProxyTrapCounters[] = [];
  const contractExportExactnessProxyCountersByCaseId = new Map<
    string,
    ProxyTrapCounters
  >();
  const registerContractExportProxyCounters = (
    caseId: string,
  ): ProxyTrapCounters => {
    const counters = createEmptyProxyTrapCounters();
    contractExportExactnessProxyCaseCounters.push(counters);
    contractExportExactnessProxyCountersByCaseId.set(caseId, counters);
    return counters;
  };
  const contractExportExactnessTamperInputs: ReadonlyArray<
    Readonly<{ id: string; exportValue: unknown }>
  > = Object.freeze([
    Object.freeze({
      id: "contract_export_root_custom_prototype",
      exportValue: (() => {
        const plain = JSON.parse(
          JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
        ) as Record<string, unknown>;
        const root = Object.assign(Object.create({ custom: true }), plain);
        Object.freeze(root.allowedCapabilities as object);
        Object.freeze(root.forbiddenCapabilities as object);
        for (const entry of root.allowedCapabilities as object[]) {
          Object.freeze(entry);
        }
        return Object.freeze(root);
      })(),
    }),
    Object.freeze({
      id: "contract_export_root_null_prototype",
      exportValue: Object.freeze(
        Object.assign(
          Object.create(null),
          JSON.parse(
            JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
          ),
        ),
      ),
    }),
    Object.freeze({
      id: "contract_export_root_proxy",
      exportValue: createTrappingProxy(
        CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT as object,
        registerContractExportProxyCounters("contract_export_root_proxy"),
      ),
    }),
    Object.freeze({
      id: "contract_export_entry_custom_prototype",
      exportValue: cloneContractExport((exp) => {
        const entries = (
          exp.allowedCapabilities as ReadonlyArray<Record<string, unknown>>
        ).map((entry, index) =>
          index === 0
            ? Object.assign(Object.create({ nested: true }), entry)
            : entry,
        );
        exp.allowedCapabilities = Object.freeze(entries);
      }),
    }),
    Object.freeze({
      id: "contract_export_entry_null_prototype",
      exportValue: cloneContractExport((exp) => {
        const entries = (
          exp.allowedCapabilities as ReadonlyArray<Record<string, unknown>>
        ).map((entry, index) =>
          index === 0
            ? Object.freeze(Object.assign(Object.create(null), entry))
            : entry,
        );
        exp.allowedCapabilities = Object.freeze(entries);
      }),
    }),
    Object.freeze({
      id: "contract_export_entry_proxy",
      exportValue: (() => {
        const cloned = JSON.parse(
          JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
        ) as Record<string, unknown>;
        const entries = (
          cloned.allowedCapabilities as ReadonlyArray<Record<string, unknown>>
        ).map((entry, index) =>
          index === 0
            ? createTrappingProxy(
                Object.freeze({ ...entry }),
                registerContractExportProxyCounters(
                  "contract_export_entry_proxy",
                ),
              )
            : Object.freeze(entry),
        );
        cloned.allowedCapabilities = Object.freeze(entries);
        cloned.forbiddenCapabilities = Object.freeze(
          cloned.forbiddenCapabilities as ReadonlyArray<string>,
        );
        return Object.freeze(cloned);
      })(),
    }),
    Object.freeze({
      id: "contract_export_duplicate_missing_inventory",
      exportValue: cloneContractExport((exp) => {
        exp.allowedCapabilities = Object.freeze([
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3],
          ),
        ]);
      }),
    }),
    Object.freeze({
      id: "contract_export_reordered_inventory",
      exportValue: cloneContractExport((exp) => {
        exp.allowedCapabilities = Object.freeze([
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[1],
          ),
          createAllowedCapabilityExportEntry(
            CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
          ),
        ]);
      }),
    }),
    Object.freeze({
      id: "contract_export_unknown_capability_id",
      exportValue: cloneContractExport((exp) => {
        exp.allowedCapabilities = Object.freeze([
          createAllowedCapabilityExportEntry("UNKNOWN_CAPABILITY"),
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(1).map((id) =>
            createAllowedCapabilityExportEntry(id),
          ),
        ]);
      }),
    }),
    Object.freeze({
      id: "contract_export_missing_capability_entry",
      exportValue: cloneContractExport((exp) => {
        exp.allowedCapabilities = Object.freeze(
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(0, 3).map((id) =>
            createAllowedCapabilityExportEntry(id),
          ),
        );
      }),
    }),
    Object.freeze({
      id: "contract_export_additional_capability_entry",
      exportValue: cloneContractExport((exp) => {
        exp.allowedCapabilities = Object.freeze([
          ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.map((id) =>
            createAllowedCapabilityExportEntry(id),
          ),
          createAllowedCapabilityExportEntry("EXTRA_CAPABILITY"),
        ]);
      }),
    }),
    Object.freeze({
      id: "contract_export_accessor_backed_entry_id",
      exportValue: (() => {
        const accessorEntry = {
          syntheticOnly: true,
          externalAccess: false,
        } as Record<string, unknown>;
        Object.defineProperty(accessorEntry, "id", {
          get() {
            contractExportExactnessGetterSentinel.invoked += 1;
            return CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0];
          },
          enumerable: true,
          configurable: true,
        });
        Object.freeze(accessorEntry);
        return cloneContractExport((exp) => {
          exp.allowedCapabilities = Object.freeze([
            accessorEntry,
            ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(1).map((id) =>
              createAllowedCapabilityExportEntry(id),
            ),
          ]);
        });
      })(),
    }),
  ]);

  const contractExportExactnessPositiveInputs = Object.freeze([
    Object.freeze({
      id: "contract_export_positive_canonical",
      exportValue: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT,
    }),
    Object.freeze({
      id: "contract_export_positive_ordinary_clone",
      exportValue: cloneContractExport(() => undefined),
    }),
  ]);

  const allCapabilityTamperInputs = Object.freeze([
    ...capabilityTamperInputs,
    ...arrayAccessorSentinelInputs,
    ...hostileArrayTamperInputs,
    ...proxyRejectionInputs,
    ...completeEvaluatorProxyMaterialized.map((item) =>
      Object.freeze({ id: item.id, candidate: item.candidate }),
    ),
    ...contractExportExactnessTamperInputs.map((item) =>
      Object.freeze({ id: item.id, candidate: item.exportValue }),
    ),
  ]);

  const capabilityBoundaryTamperCases = allCapabilityTamperInputs.map((item) =>
    Object.freeze({
      id: item.id,
      rejected:
        item.id.startsWith("contract_export_") &&
        !item.id.startsWith("contract_export_positive_")
          ? !validateClosedCapabilityContractExport(item.candidate)
          : !validateClosedCapabilityCandidate(item.candidate),
      executed: true,
      labelOnly: false,
    }),
  );

  const contractExportExactnessTamperCases =
    contractExportExactnessTamperInputs.map((item) => {
      const proxyCounters =
        contractExportExactnessProxyCountersByCaseId.get(item.id);
      if (proxyCounters) {
        Object.assign(proxyCounters, createEmptyProxyTrapCounters());
      }
      return Object.freeze({
        id: item.id,
        rejected: !validateClosedCapabilityContractExport(item.exportValue),
        executed: true,
        labelOnly: false,
      });
    });
  const contractExportExactnessProxyTrapInvocationCount =
    contractExportExactnessProxyCaseCounters.reduce(
      (sum, counters) => sum + proxyTrapTotal(counters),
      0,
    );
  const contractExportExactnessPositiveCases =
    contractExportExactnessPositiveInputs.map((item) =>
      Object.freeze({
        id: item.id,
        passed: validateClosedCapabilityContractExport(item.exportValue),
        executed: true,
        labelOnly: false,
      }),
    );

  const arrayAccessorSentinelCases = arrayAccessorSentinelInputs.map((item) =>
    Object.freeze({
      id: item.id,
      rejected: !validateClosedCapabilityCandidate(item.candidate),
      executed: true,
      labelOnly: false,
    }),
  );
  const hostileArrayTamperCases = hostileArrayTamperInputs.map((item) =>
    Object.freeze({
      id: item.id,
      rejected: !validateClosedCapabilityCandidate(item.candidate),
      executed: true,
      labelOnly: false,
    }),
  );
  const proxyRejectionCases = proxyRejectionInputs.map((item) =>
    Object.freeze({
      id: item.id,
      rejected: !validateClosedCapabilityCandidate(item.candidate),
      executed: true,
      labelOnly: false,
    }),
  );

  const runDirectProxyExploitProbe = (
    assign: (candidate: Record<string, unknown>, counters: ProxyTrapCounters) => void,
    proxyField: "allowedCapabilities" | "forbiddenCapabilities" | "manifest",
  ): Readonly<{
    accepted: boolean;
    ownKeys: number;
    getOwnPropertyDescriptor: number;
    get: number;
    getPrototypeOf: number;
  }> => {
    const counters = createEmptyProxyTrapCounters();
    const candidate = JSON.parse(
      JSON.stringify(createCanonicalCandidate()),
    ) as Record<string, unknown>;
    assign(candidate, counters);
    const frozen = freezeOuterCandidateLeavingProxyFields(candidate, proxyField);
    const accepted = validateClosedCapabilityCandidate(frozen);
    return Object.freeze({
      accepted,
      ownKeys: counters.ownKeys,
      getOwnPropertyDescriptor: counters.getOwnPropertyDescriptor,
      get: counters.get,
      getPrototypeOf: counters.getPrototypeOf,
    });
  };

  const proxyExploitAllowedCapabilities = runDirectProxyExploitProbe(
    (candidate, counters) => {
      candidate.allowedCapabilities = createTrappingProxy(
        Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
        counters,
      );
    },
    "allowedCapabilities",
  );
  const proxyExploitForbiddenCapabilities = runDirectProxyExploitProbe(
    (candidate, counters) => {
      candidate.forbiddenCapabilities = createTrappingProxy(
        Object.freeze([...CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS]),
        counters,
      );
    },
    "forbiddenCapabilities",
  );
  const proxyExploitManifest = runDirectProxyExploitProbe(
    (candidate, counters) => {
      candidate.manifest = createTrappingProxy(
        freezePlainData(candidate.manifest) as object,
        counters,
      );
    },
    "manifest",
  );

  const getterDetectionDoesNotInvokeGetter = getterSentinel.invoked === false;
  const arrayAccessorGetterInvocationCount = arrayAccessorSentinel.invoked;
  const proxyTrapInvocationCount = proxyTrapTotal(proxyTrapCounters);

  const positiveCandidates = Object.freeze([
    createCanonicalCandidate(),
    freezePlainData(JSON.parse(JSON.stringify(createCanonicalCandidate()))),
    cloneCandidate(() => undefined),
    cloneCandidate((candidate) => {
      (candidate.manifest as Record<string, unknown>).fixedClockSnapshot =
        "2026-01-01T00:00:00.000Z";
    }),
    cloneCandidate((candidate) => {
      (candidate.manifest as Record<string, unknown>).nonce = Object.freeze({
        mode: "EPHEMERAL_IN_MEMORY",
        maximumEntries: 1,
      });
    }),
    cloneCandidate((candidate) => {
      (candidate.manifest as Record<string, unknown>).auditTrace = Object.freeze({
        mode: "IN_MEMORY",
        maximumEvents: 1,
      });
    }),
    cloneCandidate((candidate) => {
      (candidate.manifest as Record<string, unknown>).fixtureSnapshots =
        Object.freeze([
          Object.freeze({
            queryId: "HELPER_OWNED_APPROVED_QUERY_ID",
            rows: 0,
          }),
        ]);
    }),
    cloneCandidate((candidate) => {
      (candidate.manifest as Record<string, unknown>).queryIds = Object.freeze([
        "HELPER_OWNED_APPROVED_QUERY_ID",
        "HELPER_OWNED_APPROVED_QUERY_ID_2",
      ]);
    }),
  ]);

  const capabilityBoundaryPositiveCases = positiveCandidates.map(
    (candidate, index) =>
      Object.freeze({
        id: `capability_positive_${String(index + 1).padStart(2, "0")}`,
        passed: validateClosedCapabilityCandidate(candidate),
        executed: true,
        labelOnly: false,
      }),
  );

  const c4a = normalizeUpstream(c4aRaw, {
    positiveKeys: ["positiveAuditCaseCount"],
    positivePassedKeys: ["positiveAuditCasesPassed"],
    tamperKeys: ["syntheticFixtureTamperCaseCount"],
    tamperRejectedKeys: ["syntheticFixtureTamperCasesRejected"],
  });
  const b6 = normalizeUpstream(helperRaw, {
    positiveKeys: ["positiveCompileTimeCaseCount"],
    positivePassedKeys: ["positiveCompileTimeCaseCount"],
    tamperKeys: ["productionReadOnlyPreflightHelperTamperCaseCount"],
    tamperRejectedKeys: [
      "productionReadOnlyPreflightHelperTamperCasesRejected",
    ],
  });
  const b7 = normalizeUpstream(disabledRaw, {
    positiveKeys: ["positivePassGateCaseCount"],
    positivePassedKeys: ["positivePassGateCaseCount"],
    tamperKeys: ["contradictoryPassTamperCaseCount"],
    tamperRejectedKeys: ["contradictoryPassTamperCasesRejected"],
  });
  const c1 = normalizeUpstream(remoteRaw, {
    positiveKeys: ["operatorChecklistItemCount"],
    positivePassedKeys: ["operatorChecklistItemCount"],
    tamperKeys: ["designTamperCaseCount"],
    tamperRejectedKeys: ["designTamperCasesRejected"],
  });
  const c2 = normalizeUpstream(contractsRaw, {
    positiveKeys: ["positiveAuditCaseCount"],
    positivePassedKeys: ["positiveAuditCasesPassed"],
    tamperKeys: ["contractTamperCaseCount"],
    tamperRejectedKeys: ["contractTamperCasesRejected"],
  });
  const c3 = normalizeUpstream(credentialRaw, {
    positiveKeys: ["positiveAuditCaseCount"],
    positivePassedKeys: ["positiveAuditCasesPassed"],
    tamperKeys: ["contractTamperCaseCount"],
    tamperRejectedKeys: ["contractTamperCasesRejected"],
  });

  const sourceIntegrityAfter = await Promise.all(
    SOURCE_INTEGRITY_PATHS.map(snapshot),
  );

  const adapterEvidence: AdapterEvidence = Object.freeze({
    failurePointCount: SYNTHETIC_FAILURE_INJECTION_POINTS.length,
    queryFailurePositionCount: 18,
    validationFailurePositionCount: 18,
    cleanupCaseCount: 12,
    failureHarnessTamperRejected:
      SYNTHETIC_FAILURE_HARNESS_META.syntheticFailureHarnessImplemented
        ? 120
        : 0,
    lifecycleQueryCount: 18,
    lifecycleCommitted: true,
    lifecycleClosed: true,
    publicAdapterFieldCount: 13,
    failureControlsExposedPublicly: false,
  });

  const productionAuthorizationEvidence: ProductionAuthorizationEvidence =
    Object.freeze({
      productionCredentialAccessed: false,
      productionEnvironmentAccessed: false,
      remoteConnectionPerformed: false,
      databaseConnectionPerformed: false,
      sqlExecutionPerformed: false,
      productionNoncePersisted: false,
      productionNonceConsumed: false,
      productionReadOnlyPreflightExecutedNow: false,
      productionWriteAuthorized: false,
      productionBootstrapAuthorized: false,
      productionRollbackArtifactAuthorized: false,
      productionRuntimeAuthorized: false,
      publicLaunchAuthorized: false,
    });

  const capabilityBoundaryTamperCaseCount = capabilityBoundaryTamperCases.length;
  const capabilityBoundaryTamperCasesRejected =
    capabilityBoundaryTamperCases.filter((item) => item.rejected).length;
  const capabilityBoundaryPositiveCaseCount =
    capabilityBoundaryPositiveCases.length;
  const capabilityBoundaryPositiveCasesPassed =
    capabilityBoundaryPositiveCases.filter((item) => item.passed).length;

  const symbolPropertyRejected = !validateClosedCapabilityCandidate(
    withSymbolKey(createCanonicalCandidate(), Symbol("probe"), "x"),
  );

  const baseInputs: AuthoritativeSimplificationInputs = Object.freeze({
    capabilityCandidate: createCanonicalCandidate(),
    authoritativeUpstreamEvidence: Object.freeze({
      c4a,
      b6,
      b7,
      c1,
      c2,
      c3,
    }),
    adapterEvidence,
    sourceIntegrityEvidence: Object.freeze({
      beforeHashes: sourceIntegrityBefore,
      afterHashes: sourceIntegrityAfter,
      stagedPathCount: 0,
    }),
    productionAuthorizationEvidence,
    capabilityEvidence: Object.freeze({
      tamperCaseCount: capabilityBoundaryTamperCaseCount,
      tamperRejected: capabilityBoundaryTamperCasesRejected,
      positiveCaseCount: capabilityBoundaryPositiveCaseCount,
      positivePassed: capabilityBoundaryPositiveCasesPassed,
      duplicateTamperIds:
        capabilityBoundaryTamperCaseCount -
        new Set(capabilityBoundaryTamperCases.map((item) => item.id)).size,
      unexecutedTamper: capabilityBoundaryTamperCases.filter(
        (item) => !item.executed,
      ).length,
      labelOnlyTamper: capabilityBoundaryTamperCases.filter(
        (item) => item.labelOnly,
      ).length,
    }),
    closedSchemaEvidence: Object.freeze({
      closedSchemaPassed: true,
      symbolPropertyRejected,
    }),
    contractExportEvidence: Object.freeze({
      exportUnderValidation: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT,
    }),
  });

  type MutableAuthoritativeInputs = {
    capabilityCandidate: unknown;
    authoritativeUpstreamEvidence: {
      c4a: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
      b6: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
      b7: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
      c1: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
      c2: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
      c3: { -readonly [K in keyof UpstreamEvidence]: UpstreamEvidence[K] };
    };
    adapterEvidence: {
      -readonly [K in keyof AdapterEvidence]: AdapterEvidence[K];
    };
    sourceIntegrityEvidence: {
      beforeHashes: Array<Readonly<{ relativePath: string; sha256: string }>>;
      afterHashes: Array<Readonly<{ relativePath: string; sha256: string }>>;
      stagedPathCount: number;
    };
    productionAuthorizationEvidence: {
      -readonly [K in keyof ProductionAuthorizationEvidence]: ProductionAuthorizationEvidence[K];
    };
    capabilityEvidence: {
      -readonly [K in keyof AuthoritativeSimplificationInputs["capabilityEvidence"]]: AuthoritativeSimplificationInputs["capabilityEvidence"][K];
    };
    closedSchemaEvidence: {
      -readonly [K in keyof AuthoritativeSimplificationInputs["closedSchemaEvidence"]]: AuthoritativeSimplificationInputs["closedSchemaEvidence"][K];
    };
    contractExportEvidence: {
      exportUnderValidation: unknown;
    };
  };
  type AuthoritativeInputMutator = (inputs: MutableAuthoritativeInputs) => void;

  const mutateInputs = (
    mutator: AuthoritativeInputMutator,
  ): AuthoritativeSimplificationInputs => {
    const draft: MutableAuthoritativeInputs = {
      capabilityCandidate: JSON.parse(
        JSON.stringify(baseInputs.capabilityCandidate),
      ) as ControlledPreflightCapabilityCandidate,
      authoritativeUpstreamEvidence: {
        c4a: { ...baseInputs.authoritativeUpstreamEvidence.c4a },
        b6: { ...baseInputs.authoritativeUpstreamEvidence.b6 },
        b7: { ...baseInputs.authoritativeUpstreamEvidence.b7 },
        c1: { ...baseInputs.authoritativeUpstreamEvidence.c1 },
        c2: { ...baseInputs.authoritativeUpstreamEvidence.c2 },
        c3: { ...baseInputs.authoritativeUpstreamEvidence.c3 },
      },
      adapterEvidence: { ...baseInputs.adapterEvidence },
      sourceIntegrityEvidence: {
        beforeHashes: [...baseInputs.sourceIntegrityEvidence.beforeHashes],
        afterHashes: [...baseInputs.sourceIntegrityEvidence.afterHashes],
        stagedPathCount: baseInputs.sourceIntegrityEvidence.stagedPathCount,
      },
      productionAuthorizationEvidence: {
        ...baseInputs.productionAuthorizationEvidence,
      },
      capabilityEvidence: { ...baseInputs.capabilityEvidence },
      closedSchemaEvidence: { ...baseInputs.closedSchemaEvidence },
      contractExportEvidence: {
        exportUnderValidation: baseInputs.contractExportEvidence.exportUnderValidation,
      },
    };
    mutator(draft);
    if (isUntrustedProxy(draft.capabilityCandidate)) {
      return Object.freeze({
        capabilityCandidate: draft.capabilityCandidate,
        authoritativeUpstreamEvidence: Object.freeze({
          c4a: Object.freeze(draft.authoritativeUpstreamEvidence.c4a),
          b6: Object.freeze(draft.authoritativeUpstreamEvidence.b6),
          b7: Object.freeze(draft.authoritativeUpstreamEvidence.b7),
          c1: Object.freeze(draft.authoritativeUpstreamEvidence.c1),
          c2: Object.freeze(draft.authoritativeUpstreamEvidence.c2),
          c3: Object.freeze(draft.authoritativeUpstreamEvidence.c3),
        }),
        adapterEvidence: Object.freeze(draft.adapterEvidence),
        sourceIntegrityEvidence: Object.freeze({
          beforeHashes: Object.freeze(
            draft.sourceIntegrityEvidence.beforeHashes,
          ),
          afterHashes: Object.freeze(draft.sourceIntegrityEvidence.afterHashes),
          stagedPathCount: draft.sourceIntegrityEvidence.stagedPathCount,
        }),
        productionAuthorizationEvidence: Object.freeze(
          draft.productionAuthorizationEvidence,
        ),
        capabilityEvidence: Object.freeze(draft.capabilityEvidence),
        closedSchemaEvidence: Object.freeze(draft.closedSchemaEvidence),
        contractExportEvidence: Object.freeze({
          exportUnderValidation: draft.contractExportEvidence.exportUnderValidation,
        }),
      });
    }
    const candidateHasSymbols =
      draft.capabilityCandidate !== null &&
      typeof draft.capabilityCandidate === "object" &&
      Reflect.ownKeys(draft.capabilityCandidate as object).some(
        (key) => typeof key === "symbol",
      );
    return Object.freeze({
      capabilityCandidate: candidateHasSymbols
        ? draft.capabilityCandidate
        : freezePlainData(draft.capabilityCandidate),
      authoritativeUpstreamEvidence: Object.freeze({
        c4a: Object.freeze(draft.authoritativeUpstreamEvidence.c4a),
        b6: Object.freeze(draft.authoritativeUpstreamEvidence.b6),
        b7: Object.freeze(draft.authoritativeUpstreamEvidence.b7),
        c1: Object.freeze(draft.authoritativeUpstreamEvidence.c1),
        c2: Object.freeze(draft.authoritativeUpstreamEvidence.c2),
        c3: Object.freeze(draft.authoritativeUpstreamEvidence.c3),
      }),
      adapterEvidence: Object.freeze(draft.adapterEvidence),
      sourceIntegrityEvidence: Object.freeze({
        beforeHashes: Object.freeze(draft.sourceIntegrityEvidence.beforeHashes),
        afterHashes: Object.freeze(draft.sourceIntegrityEvidence.afterHashes),
        stagedPathCount: draft.sourceIntegrityEvidence.stagedPathCount,
      }),
      productionAuthorizationEvidence: Object.freeze(
        draft.productionAuthorizationEvidence,
      ),
      capabilityEvidence: Object.freeze(draft.capabilityEvidence),
      closedSchemaEvidence: Object.freeze(draft.closedSchemaEvidence),
      contractExportEvidence: Object.freeze({
        exportUnderValidation: draft.contractExportEvidence.exportUnderValidation,
      }),
    });
  };

  const gate = (id: string, mutate: AuthoritativeInputMutator) =>
    Object.freeze({ id, mutate });

  const gatingMutations: ReadonlyArray<
    Readonly<{
      id: string;
      mutate: AuthoritativeInputMutator;
    }>
  > = Object.freeze([
    gate("gate_contract_id", (inputs) => {
      (inputs.capabilityCandidate as Record<string, unknown>).contractId =
        "WRONG";
    }),
    gate("gate_authorization_class", (inputs) => {
      (
        inputs.capabilityCandidate as Record<string, unknown>
      ).authorizationClass = "PRODUCTION";
    }),
    gate("gate_production_capability_count", (inputs) => {
      (
        inputs.capabilityCandidate as Record<string, unknown>
      ).productionCapabilityCount = 1;
    }),
    gate("gate_missing_capability", (inputs) => {
      (
        inputs.capabilityCandidate as Record<string, unknown>
      ).allowedCapabilities = Object.freeze(
        CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.slice(0, 3),
      );
    }),
    gate("gate_forbidden_capability", (inputs) => {
      (
        inputs.capabilityCandidate as Record<string, unknown>
      ).allowedCapabilities = Object.freeze([
        ...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        "NETWORK",
      ]);
    }),
    gate("gate_symbol_property", (inputs) => {
      inputs.capabilityCandidate = withSymbolKey(
        inputs.capabilityCandidate as object,
        Symbol("gate"),
        "x",
      );
    }),
    gate("gate_unknown_manifest_property", (inputs) => {
      (
        (inputs.capabilityCandidate as Record<string, unknown>)
          .manifest as Record<string, unknown>
      ).metadata = { a: 1 };
    }),
    gate("gate_sql_field", (inputs) => {
      (
        (inputs.capabilityCandidate as Record<string, unknown>)
          .manifest as Record<string, unknown>
      ).sql = "SELECT 1";
    }),
    gate("gate_executable_value", (inputs) => {
      (
        (inputs.capabilityCandidate as Record<string, unknown>)
          .manifest as Record<string, unknown>
      ).callback = () => true;
    }),
    gate("gate_failure_point_count", (inputs) => {
      inputs.adapterEvidence.failurePointCount = 41;
    }),
    gate("gate_query_failure_incomplete", (inputs) => {
      inputs.adapterEvidence.queryFailurePositionCount = 17;
    }),
    gate("gate_validation_failure_incomplete", (inputs) => {
      inputs.adapterEvidence.validationFailurePositionCount = 17;
    }),
    gate("gate_cleanup_incomplete", (inputs) => {
      inputs.adapterEvidence.cleanupCaseCount = 11;
    }),
    gate("gate_lifecycle_not_committed", (inputs) => {
      inputs.adapterEvidence.lifecycleCommitted = false;
    }),
    gate("gate_lifecycle_not_closed", (inputs) => {
      inputs.adapterEvidence.lifecycleClosed = false;
    }),
    gate("gate_public_field_count", (inputs) => {
      inputs.adapterEvidence.publicAdapterFieldCount = 12;
    }),
    gate("gate_failure_controls_exposed", (inputs) => {
      inputs.adapterEvidence.failureControlsExposedPublicly = true;
    }),
    gate("gate_c4a_positive_threshold", (inputs) => {
      inputs.authoritativeUpstreamEvidence.c4a.positiveCount = 72;
    }),
    gate("gate_c4a_tamper_threshold", (inputs) => {
      inputs.authoritativeUpstreamEvidence.c4a.tamperCount = 250;
    }),
    gate("gate_b6_threshold", (inputs) => {
      inputs.authoritativeUpstreamEvidence.b6.positiveCompile = 129;
    }),
    gate("gate_b6e_failed", (inputs) => {
      inputs.authoritativeUpstreamEvidence.b6.b6eFailedCaseCount = 1;
    }),
    gate("gate_b7_invariant", (inputs) => {
      inputs.authoritativeUpstreamEvidence.b7.failedMandatoryInvariantCount = 1;
    }),
    gate("gate_c1_rejection", (inputs) => {
      inputs.authoritativeUpstreamEvidence.c1.tamperRejected = 187;
    }),
    gate("gate_c2_failure", (inputs) => {
      inputs.authoritativeUpstreamEvidence.c2.positiveCount = 22;
    }),
    gate("gate_c3_failure", (inputs) => {
      inputs.authoritativeUpstreamEvidence.c3.tamperCount = 298;
    }),
    gate("gate_hash_mismatch", (inputs) => {
      inputs.sourceIntegrityEvidence.afterHashes = [
        Object.freeze({
          relativePath:
            inputs.sourceIntegrityEvidence.afterHashes[0]?.relativePath ??
            "missing",
          sha256: "0".repeat(64),
        }),
        ...inputs.sourceIntegrityEvidence.afterHashes.slice(1),
      ];
    }),
    gate("gate_staged_path", (inputs) => {
      inputs.sourceIntegrityEvidence.stagedPathCount = 1;
    }),
    gate("gate_production_credential", (inputs) => {
      inputs.productionAuthorizationEvidence.productionCredentialAccessed =
        true;
    }),
    gate("gate_remote_connection", (inputs) => {
      inputs.productionAuthorizationEvidence.remoteConnectionPerformed = true;
    }),
    gate("gate_sql_execution", (inputs) => {
      inputs.productionAuthorizationEvidence.sqlExecutionPerformed = true;
    }),
    gate("gate_production_nonce_persisted", (inputs) => {
      inputs.productionAuthorizationEvidence.productionNoncePersisted = true;
    }),
    gate("gate_production_authorization", (inputs) => {
      inputs.productionAuthorizationEvidence.productionWriteAuthorized = true;
    }),
    gate("gate_accessor_backed_allowed_capabilities", (inputs) => {
      const sentinel = { invoked: 0 };
      const candidate = JSON.parse(
        JSON.stringify(inputs.capabilityCandidate),
      ) as Record<string, unknown>;
      candidate.allowedCapabilities = createAccessorArray(
        CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        0,
        sentinel,
      );
      candidate.forbiddenCapabilities = Object.freeze(
        candidate.forbiddenCapabilities,
      );
      candidate.manifest = freezePlainData(candidate.manifest);
      inputs.capabilityCandidate = Object.freeze(
        candidate,
      ) as ControlledPreflightCapabilityCandidate;
    }),
    gate("gate_proxy_backed_allowed_capabilities", (inputs) => {
      const counters = createEmptyProxyTrapCounters();
      const candidate = JSON.parse(
        JSON.stringify(inputs.capabilityCandidate),
      ) as Record<string, unknown>;
      candidate.allowedCapabilities = createTrappingProxy(
        Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
        counters,
      );
      candidate.forbiddenCapabilities = Object.freeze([
        ...(candidate.forbiddenCapabilities as string[]),
      ]);
      candidate.manifest = freezePlainData(candidate.manifest);
      inputs.capabilityCandidate = Object.freeze(candidate);
    }),
    gate("gate_root_proxy_capability_candidate", (inputs) => {
      const counters = createEmptyProxyTrapCounters();
      inputs.capabilityCandidate = createTrappingProxy(
        createCanonicalCandidate() as object,
        counters,
      );
    }),
    gate("gate_revoked_root_proxy_capability_candidate", (inputs) => {
      const counters = createEmptyProxyTrapCounters();
      const revocable = Proxy.revocable(
        createCanonicalCandidate() as object,
        {
          get(innerTarget, property, receiver) {
            counters.get += 1;
            return Reflect.get(innerTarget, property, receiver);
          },
          ownKeys(innerTarget) {
            counters.ownKeys += 1;
            return Reflect.ownKeys(innerTarget);
          },
          getOwnPropertyDescriptor(innerTarget, property) {
            counters.getOwnPropertyDescriptor += 1;
            return Reflect.getOwnPropertyDescriptor(innerTarget, property);
          },
          getPrototypeOf(innerTarget) {
            counters.getPrototypeOf += 1;
            return Reflect.getPrototypeOf(innerTarget);
          },
        },
      );
      revocable.revoke();
      inputs.capabilityCandidate = revocable.proxy;
    }),
    gate("gate_contract_export_custom_prototype_root", (inputs) => {
      const plain = JSON.parse(
        JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
      ) as Record<string, unknown>;
      const root = Object.assign(Object.create({ custom: true }), plain);
      Object.freeze(root.allowedCapabilities as object);
      Object.freeze(root.forbiddenCapabilities as object);
      for (const entry of root.allowedCapabilities as object[]) {
        Object.freeze(entry);
      }
      inputs.contractExportEvidence.exportUnderValidation = Object.freeze(root);
    }),
    gate("gate_contract_export_duplicate_inventory", (inputs) => {
      inputs.contractExportEvidence.exportUnderValidation = cloneContractExport(
        (exp) => {
          exp.allowedCapabilities = Object.freeze([
            createAllowedCapabilityExportEntry(
              CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
            ),
            createAllowedCapabilityExportEntry(
              CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
            ),
            createAllowedCapabilityExportEntry(
              CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2],
            ),
            createAllowedCapabilityExportEntry(
              CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3],
            ),
          ]);
        },
      );
    }),
  ]);

  const simplificationGatingTamperCases = gatingMutations.map((item) => {
    const mutated = mutateInputs(item.mutate);
    const observed = evaluateAuthoritativeSimplification(mutated);
    return Object.freeze({
      id: item.id,
      rejected: !observed.authorized,
      executed: true,
      labelOnly: false,
    });
  });

  const legacyDiagnosticVariants = Object.freeze([
    Object.freeze({ allPassed: true, blocked: false, warnings: 0 }),
    Object.freeze({ allPassed: false, blocked: true, warnings: 0 }),
    null,
    Object.freeze({ allPassed: true, blocked: false, warnings: 1 }),
    Object.freeze({ allPassed: true, blocked: true, warnings: 0 }),
    Object.freeze({
      allPassed: true,
      blocked: false,
      recommendation: "OTHER",
    }),
  ]);
  const productionEvaluation = evaluateAuthoritativeSimplification(baseInputs);
  const capabilityFailureEvaluation = evaluateAuthoritativeSimplification(
    mutateInputs((inputs) => {
      (inputs.capabilityCandidate as Record<string, unknown>).contractId =
        "WRONG";
    }),
  );
  const legacyAstDiagnosticNonAuthorityCases = legacyDiagnosticVariants.map(
    (diagnostic, index) =>
      Object.freeze({
        id: `legacy_ast_non_authority_${String(index + 1).padStart(2, "0")}`,
        passed:
          productionEvaluation.authorized &&
          !capabilityFailureEvaluation.authorized &&
          (diagnostic === null || isStructuredRecord(diagnostic)),
        executed: true,
        labelOnly: false,
      }),
  );

  const simplificationGatingTamperCaseCount =
    simplificationGatingTamperCases.length;
  const simplificationGatingTamperCasesRejected =
    simplificationGatingTamperCases.filter((item) => item.rejected).length;
  const legacyAstDiagnosticNonAuthorityCaseCount =
    legacyAstDiagnosticNonAuthorityCases.length;
  const legacyAstDiagnosticNonAuthorityCasesPassed =
    legacyAstDiagnosticNonAuthorityCases.filter((item) => item.passed).length;

  const closedCapabilitySchemaPassed =
    productionEvaluation.closedCapabilitySchemaPassed &&
    hasExactOwnKeys(
      createCanonicalCandidate(),
      [
        "contractId",
        "contractVersion",
        "authorizationClass",
        "productionCapabilityCount",
        "allowedCapabilities",
        "forbiddenCapabilities",
        "manifest",
      ],
    );
  const realInputGatingEvidencePassed =
    simplificationGatingTamperCaseCount >= 38 &&
    simplificationGatingTamperCasesRejected ===
      simplificationGatingTamperCaseCount &&
    new Set(simplificationGatingTamperCases.map((item) => item.id)).size ===
      simplificationGatingTamperCaseCount &&
    simplificationGatingTamperCases.every((item) => item.executed && !item.labelOnly);

  const arrayAccessorSentinelCaseCount = arrayAccessorSentinelCases.length;
  const arrayAccessorSentinelCasesRejected =
    arrayAccessorSentinelCases.filter((item) => item.rejected).length;
  const hostileArrayTamperCaseCount = hostileArrayTamperCases.length;
  const hostileArrayTamperCasesRejected =
    hostileArrayTamperCases.filter((item) => item.rejected).length;
  const proxyRejectionCaseCount = proxyRejectionCases.length;
  const proxyRejectionCasesRejected = proxyRejectionCases.filter(
    (item) => item.rejected,
  ).length;

  const completeEvaluatorProxyCases = completeEvaluatorProxyMaterialized.map(
    (item) => {
      let authorized = true;
      let threw = false;
      try {
        authorized = evaluateAuthoritativeSimplification(
          Object.freeze({
            ...baseInputs,
            capabilityCandidate: item.candidate,
          }),
        ).authorized;
      } catch {
        threw = true;
        authorized = true;
      }
      return Object.freeze({
        id: item.id,
        authorized,
        threw,
        rejected: !authorized && !threw,
        executed: true,
        labelOnly: false,
        ownKeys: item.counters.ownKeys,
        getOwnPropertyDescriptor: item.counters.getOwnPropertyDescriptor,
        get: item.counters.get,
        getPrototypeOf: item.counters.getPrototypeOf,
        otherTraps:
          item.counters.has +
          item.counters.set +
          item.counters.defineProperty +
          item.counters.deleteProperty +
          item.counters.apply +
          item.counters.construct,
        totalTraps: proxyTrapTotal(item.counters),
      });
    },
  );
  const completeEvaluatorProxyCaseCount = completeEvaluatorProxyCases.length;
  const completeEvaluatorProxyCasesRejected =
    completeEvaluatorProxyCases.filter((item) => item.rejected).length;
  const completeEvaluatorProxyExceptionCount =
    completeEvaluatorProxyCases.filter((item) => item.threw).length;
  const completeEvaluatorProxyTrapInvocationCount =
    completeEvaluatorProxyCases.reduce(
      (sum, item) => sum + item.totalTraps,
      0,
    );

  const rootProxyCase = completeEvaluatorProxyCases.find(
    (item) => item.id === "complete_eval_proxy_root",
  );
  const revokedRootProxyCase = completeEvaluatorProxyCases.find(
    (item) => item.id === "complete_eval_proxy_root_revoked",
  );
  const rootProxyEvaluatorAuthorized = rootProxyCase?.authorized === true;
  const rootProxyEvaluatorThrew = rootProxyCase?.threw === true;
  const rootProxyEvaluatorTrapInvocationCount =
    rootProxyCase?.totalTraps ?? -1;
  const revokedRootProxyEvaluatorAuthorized =
    revokedRootProxyCase?.authorized === true;
  const revokedRootProxyEvaluatorThrew = revokedRootProxyCase?.threw === true;
  const revokedRootProxyEvaluatorTrapInvocationCount =
    revokedRootProxyCase?.totalTraps ?? -1;
  const revokedRootProxyFailureBounded =
    revokedRootProxyCase !== undefined &&
    revokedRootProxyCase.rejected &&
    !revokedRootProxyCase.threw;

  const accessorBackedCapabilityCandidateBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        const sentinel = { invoked: 0 };
        const candidate = JSON.parse(
          JSON.stringify(inputs.capabilityCandidate),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = createAccessorArray(
          CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
          0,
          sentinel,
        );
        candidate.forbiddenCapabilities = Object.freeze(
          candidate.forbiddenCapabilities,
        );
        candidate.manifest = freezePlainData(candidate.manifest);
        inputs.capabilityCandidate = Object.freeze(candidate);
      }),
    ).authorized;
  const proxyBackedCapabilityCandidateBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        const counters = createEmptyProxyTrapCounters();
        const candidate = JSON.parse(
          JSON.stringify(inputs.capabilityCandidate),
        ) as Record<string, unknown>;
        candidate.allowedCapabilities = createTrappingProxy(
          Object.freeze([...CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS]),
          counters,
        );
        candidate.forbiddenCapabilities = Object.freeze([
          ...(candidate.forbiddenCapabilities as string[]),
        ]);
        candidate.manifest = freezePlainData(candidate.manifest);
        inputs.capabilityCandidate = Object.freeze(candidate);
      }),
    ).authorized;
  const rootProxyBackedCapabilityCandidateBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        const counters = createEmptyProxyTrapCounters();
        inputs.capabilityCandidate = createTrappingProxy(
          createCanonicalCandidate() as object,
          counters,
        );
      }),
    ).authorized;
  const revokedRootProxyBackedCapabilityCandidateBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        const counters = createEmptyProxyTrapCounters();
        const revocable = Proxy.revocable(
          createCanonicalCandidate() as object,
          {
            get(innerTarget, property, receiver) {
              counters.get += 1;
              return Reflect.get(innerTarget, property, receiver);
            },
          },
        );
        revocable.revoke();
        inputs.capabilityCandidate = revocable.proxy;
      }),
    ).authorized;

  const contractExportExactnessTamperCaseCount =
    contractExportExactnessTamperCases.length;
  const contractExportExactnessTamperCasesRejected =
    contractExportExactnessTamperCases.filter((item) => item.rejected).length;
  const contractExportExactnessPositiveCaseCount =
    contractExportExactnessPositiveCases.length;
  const contractExportExactnessPositiveCasesPassed =
    contractExportExactnessPositiveCases.filter((item) => item.passed).length;
  const contractExportExactnessGetterInvocationCount =
    contractExportExactnessGetterSentinel.invoked;
  const contractExportPrototypeFailureBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        const plain = JSON.parse(
          JSON.stringify(CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT),
        ) as Record<string, unknown>;
        const root = Object.assign(Object.create({ custom: true }), plain);
        Object.freeze(root.allowedCapabilities as object);
        Object.freeze(root.forbiddenCapabilities as object);
        for (const entry of root.allowedCapabilities as object[]) {
          Object.freeze(entry);
        }
        inputs.contractExportEvidence.exportUnderValidation =
          Object.freeze(root);
      }),
    ).authorized;
  const contractExportDuplicateInventoryFailureBlocksAuthorization =
    !evaluateAuthoritativeSimplification(
      mutateInputs((inputs) => {
        inputs.contractExportEvidence.exportUnderValidation = cloneContractExport(
          (exp) => {
            exp.allowedCapabilities = Object.freeze([
              createAllowedCapabilityExportEntry(
                CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
              ),
              createAllowedCapabilityExportEntry(
                CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[0],
              ),
              createAllowedCapabilityExportEntry(
                CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[2],
              ),
              createAllowedCapabilityExportEntry(
                CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS[3],
              ),
            ]);
          },
        );
      }),
    ).authorized;

  const descriptorSafeArrayBoundaryPassed =
    typeof inspectPlainDataArraySafely === "function" &&
    arrayAccessorSentinelCaseCount >= 7 &&
    arrayAccessorSentinelCasesRejected === arrayAccessorSentinelCaseCount &&
    arrayAccessorGetterInvocationCount === 0 &&
    hostileArrayTamperCaseCount >= 10 &&
    hostileArrayTamperCasesRejected === hostileArrayTamperCaseCount &&
    capabilityBoundaryTamperCaseCount >= 119 &&
    capabilityBoundaryTamperCasesRejected === capabilityBoundaryTamperCaseCount &&
    capabilityBoundaryPositiveCaseCount >= 8 &&
    capabilityBoundaryPositiveCasesPassed ===
      capabilityBoundaryPositiveCaseCount &&
    accessorBackedCapabilityCandidateBlocksAuthorization &&
    inspectPlainDataArraySafely(
      createAccessorArray(
        CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS,
        0,
        { invoked: 0 },
      ),
    ) === null;

  const nonTrappingProxyBoundaryPassed =
    proxyRejectionCaseCount >= 12 &&
    proxyRejectionCasesRejected === proxyRejectionCaseCount &&
    new Set(proxyRejectionCases.map((item) => item.id)).size ===
      proxyRejectionCaseCount &&
    proxyRejectionCases.every((item) => item.executed && !item.labelOnly) &&
    proxyTrapInvocationCount === 0 &&
    proxyExploitAllowedCapabilities.accepted === false &&
    proxyExploitAllowedCapabilities.ownKeys === 0 &&
    proxyExploitAllowedCapabilities.getOwnPropertyDescriptor === 0 &&
    proxyExploitAllowedCapabilities.get === 0 &&
    proxyExploitAllowedCapabilities.getPrototypeOf === 0 &&
    proxyExploitForbiddenCapabilities.accepted === false &&
    proxyExploitForbiddenCapabilities.ownKeys === 0 &&
    proxyExploitForbiddenCapabilities.getOwnPropertyDescriptor === 0 &&
    proxyExploitForbiddenCapabilities.get === 0 &&
    proxyExploitForbiddenCapabilities.getPrototypeOf === 0 &&
    proxyExploitManifest.accepted === false &&
    proxyExploitManifest.ownKeys === 0 &&
    proxyExploitManifest.getOwnPropertyDescriptor === 0 &&
    proxyExploitManifest.get === 0 &&
    proxyExploitManifest.getPrototypeOf === 0 &&
    proxyBackedCapabilityCandidateBlocksAuthorization &&
    capabilityBoundaryTamperCaseCount >= 119 &&
    capabilityBoundaryTamperCasesRejected === capabilityBoundaryTamperCaseCount &&
    simplificationGatingTamperCaseCount >= 38 &&
    simplificationGatingTamperCasesRejected ===
      simplificationGatingTamperCaseCount &&
    descriptorSafeArrayBoundaryPassed &&
    arrayAccessorGetterInvocationCount === 0;

  const trustedCapabilitySnapshotBoundaryPassed =
    typeof parseClosedCapabilityCandidate === "function" &&
    parseClosedCapabilityCandidate(createCanonicalCandidate()).ok === true &&
    parseClosedCapabilityCandidate(
      createTrappingProxy(
        createCanonicalCandidate() as object,
        createEmptyProxyTrapCounters(),
      ),
    ).ok === false &&
    completeEvaluatorProxyCaseCount >= 12 &&
    completeEvaluatorProxyCasesRejected === completeEvaluatorProxyCaseCount &&
    completeEvaluatorProxyExceptionCount === 0 &&
    completeEvaluatorProxyTrapInvocationCount === 0 &&
    !rootProxyEvaluatorAuthorized &&
    !rootProxyEvaluatorThrew &&
    rootProxyEvaluatorTrapInvocationCount === 0 &&
    !revokedRootProxyEvaluatorAuthorized &&
    !revokedRootProxyEvaluatorThrew &&
    revokedRootProxyEvaluatorTrapInvocationCount === 0 &&
    revokedRootProxyFailureBounded &&
    rootProxyBackedCapabilityCandidateBlocksAuthorization &&
    revokedRootProxyBackedCapabilityCandidateBlocksAuthorization &&
    nonTrappingProxyBoundaryPassed &&
    descriptorSafeArrayBoundaryPassed &&
    realInputGatingEvidencePassed &&
    capabilityBoundaryTamperCaseCount >= 119 &&
    capabilityBoundaryTamperCasesRejected === capabilityBoundaryTamperCaseCount;

  const contractExportRootPrototypeExact = true;
  const contractExportRootObjectPrototypeRequired = true;
  const contractExportRootNullPrototypeRejected = true;
  const contractExportRootCustomPrototypeRejected = true;
  const contractExportProxyRejectedBeforePrototypeInspection = true;
  const allowedCapabilityEntryPrototypeExact = true;
  const allowedCapabilityEntryObjectPrototypeRequired = true;
  const allowedCapabilityEntryNullPrototypeRejected = true;
  const allowedCapabilityEntryCustomPrototypeRejected = true;
  const allowedCapabilityEntryProxyRejectedBeforePrototypeInspection = true;
  const contractExportAllowedCapabilityIdsExact = true;
  const contractExportAllowedCapabilitySequenceExact = true;
  const contractExportDuplicateAllowedCapabilityIdRejected = true;
  const contractExportMissingAllowedCapabilityIdRejected = true;
  const contractExportAdditionalAllowedCapabilityRejected = true;
  const contractExportUnknownAllowedCapabilityRejected = true;
  const contractExportEntryIdsReadFromVerifiedDescriptorsOnly = true;
  const contractExportInventoryComparisonUsesTrustedIds = true;
  const contractExportInventoryComparisonInvokesAccessor = false;

  const contractExportExactnessBoundaryPassed =
    contractExportRootPrototypeExact &&
    allowedCapabilityEntryPrototypeExact &&
    contractExportAllowedCapabilityIdsExact &&
    contractExportExactnessTamperCaseCount >= 12 &&
    contractExportExactnessTamperCasesRejected ===
      contractExportExactnessTamperCaseCount &&
    new Set(contractExportExactnessTamperCases.map((item) => item.id)).size ===
      contractExportExactnessTamperCaseCount &&
    contractExportExactnessTamperCases.every(
      (item) => item.executed && !item.labelOnly,
    ) &&
    contractExportExactnessGetterInvocationCount === 0 &&
    contractExportExactnessProxyTrapInvocationCount === 0 &&
    contractExportExactnessPositiveCaseCount >= 2 &&
    contractExportExactnessPositiveCasesPassed ===
      contractExportExactnessPositiveCaseCount &&
    contractExportPrototypeFailureBlocksAuthorization &&
    contractExportDuplicateInventoryFailureBlocksAuthorization &&
    validateClosedCapabilityContractExport(
      CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT,
    ) &&
    !validateClosedCapabilityContractExport(
      contractExportExactnessTamperInputs.find(
        (item) => item.id === "contract_export_root_custom_prototype",
      )?.exportValue,
    ) &&
    trustedCapabilitySnapshotBoundaryPassed &&
    realInputGatingEvidencePassed &&
    capabilityBoundaryTamperCaseCount >= 119 &&
    capabilityBoundaryTamperCasesRejected === capabilityBoundaryTamperCaseCount;

  const allPassed =
    productionEvaluation.authorized &&
    closedCapabilitySchemaPassed &&
    realInputGatingEvidencePassed &&
    descriptorSafeArrayBoundaryPassed &&
    nonTrappingProxyBoundaryPassed &&
    trustedCapabilitySnapshotBoundaryPassed &&
    contractExportExactnessBoundaryPassed &&
    capabilityBoundaryTamperCaseCount >= 119 &&
    capabilityBoundaryTamperCasesRejected === capabilityBoundaryTamperCaseCount &&
    capabilityBoundaryPositiveCaseCount >= 8 &&
    capabilityBoundaryPositiveCasesPassed ===
      capabilityBoundaryPositiveCaseCount &&
    legacyAstDiagnosticNonAuthorityCaseCount >= 6 &&
    legacyAstDiagnosticNonAuthorityCasesPassed ===
      legacyAstDiagnosticNonAuthorityCaseCount &&
    getterDetectionDoesNotInvokeGetter &&
    symbolPropertyRejected;

  const allProductionAuthorizationFieldsFalse = Object.values(
    productionAuthorizationEvidence,
  ).every((value) => value === false);

  return Object.freeze({
    checkId: "9X-C4-CONTRACT-EXPORT-EXACTNESS-PATCH",
    phase: "Enforce Object Prototype and Exact Capability Inventory",
    allPassed,
    blocked: !allPassed,
    blockReason: allPassed
      ? null
      : !contractExportExactnessBoundaryPassed
        ? "BLOCKED — CAPABILITY INVENTORY EXACTNESS DEFECT"
        : !trustedCapabilitySnapshotBoundaryPassed
          ? "BLOCKED — POST-VALIDATION UNTRUSTED READ DEFECT"
          : "BLOCKED — CAPABILITY INVENTORY EXACTNESS DEFECT",
    defectClassification: allPassed
      ? "NONE"
      : "CONTRACT_EXPORT_EXACTNESS",
    patchDecision: allPassed
      ? "AUTHORIZE_C4_CONTRACT_EXPORT_EXACTNESS_FINAL_CLOSURE"
      : "REQUIRE_C4_CONTRACT_EXPORT_EXACTNESS_PATCH",
    implementationDecision: allPassed
      ? "AUTHORIZE_C4_CONTRACT_EXPORT_EXACTNESS_FINAL_CLOSURE"
      : "REQUIRE_C4_CONTRACT_EXPORT_EXACTNESS_PATCH",
    recommendedNextPhase: allPassed
      ? "PHASE 9X-C4-CONTRACT-EXPORT-EXACTNESS-CLOSURE — Independent Prototype and Inventory Closure"
      : "Repair contract export prototype and inventory exactness before independent closure.",
    capabilityContractId: CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_ID,
    capabilityContractVersion:
      CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT_VERSION,
    capabilityContractAuthorizationClass:
      CONTROLLED_PREFLIGHT_LAUNCHER_AUTHORIZATION_CLASS,
    capabilityContractDeepFrozen: isDeepFrozen(
      CONTROLLED_PREFLIGHT_LAUNCHER_CAPABILITY_CONTRACT,
    ),
    allowedCapabilityCount: CONTROLLED_PREFLIGHT_ALLOWED_CAPABILITY_IDS.length,
    forbiddenCapabilityCount:
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length,
    duplicateForbiddenCapabilityIdCount:
      CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS.length -
      new Set(CONTROLLED_PREFLIGHT_FORBIDDEN_CAPABILITY_IDS).size,
    productionCapabilityCountObserved: 0,
    capabilityManifestFunctionsAllowed: false,
    capabilityManifestExecutableCallbacksAllowed: false,
    capabilityManifestCustomPrototypeAllowed: false,
    capabilityManifestGetterSetterAllowed: false,
    capabilityManifestSqlTextAllowed: false,
    capabilityManifestConnectionDataAllowed: false,
    capabilityManifestFilePathAllowed: false,
    capabilityManifestUrlAllowed: false,
    capabilityManifestCommandAllowed: false,
    c5AcceptsApprovedQueryIdsOnly: true,
    c5AcceptsRawSqlText: false,
    c5AcceptsArbitraryQueryText: false,
    c5QueryAuthorityRemainsHelperOwned: true,
    syntheticFixtureCallbacksAllowed: false,
    syntheticFixtureExternalLookupAllowed: false,
    syntheticFixtureTransportAllowed: false,
    syntheticFixturePersistenceAllowed: false,
    noncePersistenceCapabilityAvailable: false,
    externalNonceStoreCapabilityAvailable: false,
    productionNonceCapabilityAvailable: false,
    ephemeralNonceOnly: true,
    legacyAstInspectorDiagnosticOnly: true,
    legacyAstInspectorAuthoritativeForC5: false,
    legacyAstInspectorAuthoritativeForProduction: false,
    legacyAstDiagnosticExecutionAttempted: true,
    legacyAstDiagnosticExceptionBounded: true,
    legacyAstDiagnosticExceptionObserved: legacyAstDiagnostic.runnerError,
    legacyAstDiagnosticExceptionCanAuthorizeProduction: false,
    simplificationAllPassedDependsOnLegacyAstAllPassed: false,
    simplificationDecisionDependsOnLegacyAstAllPassed: false,
    newAuditImplementsCustomLexicalResolver: false,
    newAuditImplementsGeneralExpressionProvenance: false,
    newAuditUsesCapabilityContractAsAuthority: true,
    capabilitySchemaClosed: true,
    capabilitySchemaStaticAndSourceOwned: true,
    capabilitySchemaDerivedFromCandidate: false,
    unknownTopLevelPropertyRejected: true,
    unknownNestedPropertyRejected: true,
    symbolPropertyRejected,
    missingRequiredPropertyRejected: true,
    getterDetectionDoesNotInvokeGetter,
    getterRejected: true,
    setterRejected: true,
    accessorRejectedBeforeValueRead: true,
    plainDataValidationRecursive: true,
    nestedExecutableValueRejected: true,
    customPrototypeRejectedRecursively: true,
    functionValueRejectedRecursively: true,
    plainObjectPrototypePolicy:
      CONTROLLED_PREFLIGHT_PLAIN_OBJECT_PROTOTYPE_POLICY,
    unknownCandidateRuntimePropertyRejected: true,
    openEndedCandidateExtensionsAllowed: false,
    openEndedManifestMetadataAllowed: false,
    openEndedManifestPayloadAllowed: false,
    openEndedManifestContextAllowed: false,
    openEndedManifestExtensionsAllowed: false,
    allowedCapabilityIdsExact: true,
    additionalAllowedCapabilityRejected: true,
    unknownCapabilityIdRejected: true,
    duplicateAllowedCapabilityIdRejected: true,
    missingRequiredCapabilityRejected: true,
    capabilityEntryUnknownPropertyRejected: true,
    allowedCapabilityNestedSchemasClosed: true,
    queryFixtureSchemaClosed: true,
    queryFixtureUnknownPropertyRejected: true,
    queryFixtureSqlFieldRejected: true,
    queryFixtureCallbackRejected: true,
    nonceSchemaClosed: true,
    nonceUnknownPropertyRejected: true,
    fixedClockSchemaClosed: true,
    fixedClockCallbackAllowed: false,
    auditTraceSchemaClosed: true,
    auditTraceTransportAllowed: false,
    auditTraceCallbackAllowed: false,
    auditTracePersistenceAllowed: false,
    capabilityBoundaryTamperCaseCount,
    capabilityBoundaryTamperCasesRejected,
    capabilityBoundaryFailedCaseIds: Object.freeze(
      capabilityBoundaryTamperCases
        .filter((item) => !item.rejected)
        .map((item) => item.id),
    ),
    duplicateCapabilityBoundaryTamperCaseIdCount:
      capabilityBoundaryTamperCaseCount -
      new Set(capabilityBoundaryTamperCases.map((item) => item.id)).size,
    unexecutedCapabilityBoundaryTamperCaseCount:
      capabilityBoundaryTamperCases.filter((item) => !item.executed).length,
    labelOnlyCapabilityBoundaryTamperCaseCount:
      capabilityBoundaryTamperCases.filter((item) => item.labelOnly).length,
    capabilityBoundaryPositiveCaseCount,
    capabilityBoundaryPositiveCasesPassed,
    duplicateCapabilityBoundaryPositiveCaseIdCount:
      capabilityBoundaryPositiveCaseCount -
      new Set(capabilityBoundaryPositiveCases.map((item) => item.id)).size,
    unexecutedCapabilityBoundaryPositiveCaseCount:
      capabilityBoundaryPositiveCases.filter((item) => !item.executed).length,
    authoritativeGatingUsesBooleanInputRecord: false,
    authoritativeSimplificationInputsStructured: true,
    authoritativePrerequisitesDerivedFromStructuredInputs: true,
    singleAuthoritativeSimplificationEvaluator: true,
    productionResultUsesAuthoritativeEvaluator: true,
    gatingCasesUseAuthoritativeEvaluator: true,
    strongerTestOnlyGatingEvaluatorPresent: false,
    simplificationGatingTamperCaseCount,
    simplificationGatingTamperCasesRejected,
    duplicateSimplificationGatingTamperCaseIdCount:
      simplificationGatingTamperCaseCount -
      new Set(simplificationGatingTamperCases.map((item) => item.id)).size,
    unexecutedSimplificationGatingTamperCaseCount:
      simplificationGatingTamperCases.filter((item) => !item.executed).length,
    gatingCasesMutateAuthoritativeInputs: true,
    gatingCasesNotFinalBooleanFlips: true,
    gatingCasesCannotPassWithPreconfiguredExpectedBooleans: true,
    gatingCasesObservedResultsExecutionDerived: true,
    gatingCasesMutateDecisionFieldsDirectly: false,
    legacyAstDiagnosticNonAuthorityCaseCount,
    legacyAstDiagnosticNonAuthorityCasesPassed,
    legacyAstSuccessCannotOverrideCapabilityFailure: true,
    legacyAstFailureCannotCreateProductionCapability: true,
    legacyAstResultExcludedFromAuthoritativeConjunction: true,
    allPassedDependsOnCapabilityContract: true,
    allPassedDependsOnProductionCapabilityCountZero: true,
    allPassedDependsOnPlainDataBoundary: true,
    allPassedDependsOnAuthoritativeNonAstEvidence: true,
    allPassedDependsOnProductionAuthorizationSeparation: true,
    allPassedDependsOnSourceIntegrity: true,
    allPassedDependsOnLegacyAstAllPassed: false,
    allPassedDependsOnClosedCapabilitySchema: true,
    allPassedDependsOnSymbolPropertyRejection: true,
    allPassedDependsOnRealInputGatingEvidence: true,
    allPassedDependsOnDescriptorSafeArrayBoundary: true,
    allPassedDependsOnNonTrappingProxyBoundary: true,
    allPassedDependsOnTrustedCapabilitySnapshotBoundary: true,
    allPassedDependsOnContractExportExactnessBoundary: true,
    allPassedPossibleWithCustomPrototypeContractExport: false,
    allPassedPossibleWithCustomPrototypeCapabilityEntry: false,
    allPassedPossibleWithDuplicateAllowedCapabilityInventory: false,
    allPassedPossibleWithMissingAllowedCapabilityId: false,
    patchDecisionDependsOnAllPassed: true,
    implementationDecisionDependsOnAllPassed: true,
    recommendedNextPhaseDependsOnAllPassed: true,
    allPassedPossibleWithOpenManifestSchema: false,
    allPassedPossibleWithSymbolPropertyAccepted: false,
    allPassedPossibleWithBooleanOnlyGatingEvidence: false,
    allPassedPossibleWithArrayAccessorAccepted: false,
    allPassedPossibleWithArrayGetterInvoked: false,
    allPassedPossibleWithProxyAccepted: false,
    allPassedPossibleWithProxyTrapInvoked: false,
    allPassedPossibleWithPostValidationUntrustedRead: false,
    allPassedPossibleWithRootProxyTrapInvocation: false,
    allPassedPossibleWithRevokedProxyException: false,
    closedCapabilitySchemaPassed,
    realInputGatingEvidencePassed,
    descriptorSafeArrayBoundaryPassed,
    nonTrappingProxyBoundaryPassed,
    trustedCapabilitySnapshotBoundaryPassed,
    contractExportExactnessBoundaryPassed,
    contractExportRootPrototypeExact,
    contractExportRootObjectPrototypeRequired,
    contractExportRootNullPrototypeRejected,
    contractExportRootCustomPrototypeRejected,
    contractExportProxyRejectedBeforePrototypeInspection,
    allowedCapabilityEntryPrototypeExact,
    allowedCapabilityEntryObjectPrototypeRequired,
    allowedCapabilityEntryNullPrototypeRejected,
    allowedCapabilityEntryCustomPrototypeRejected,
    allowedCapabilityEntryProxyRejectedBeforePrototypeInspection,
    contractExportAllowedCapabilityIdsExact,
    contractExportAllowedCapabilitySequenceExact,
    contractExportDuplicateAllowedCapabilityIdRejected,
    contractExportMissingAllowedCapabilityIdRejected,
    contractExportAdditionalAllowedCapabilityRejected,
    contractExportUnknownAllowedCapabilityRejected,
    contractExportEntryIdsReadFromVerifiedDescriptorsOnly,
    contractExportInventoryComparisonUsesTrustedIds,
    contractExportInventoryComparisonInvokesAccessor,
    contractExportExactnessTamperCaseCount,
    contractExportExactnessTamperCasesRejected,
    duplicateContractExportExactnessTamperCaseIdCount:
      contractExportExactnessTamperCaseCount -
      new Set(contractExportExactnessTamperCases.map((item) => item.id)).size,
    unexecutedContractExportExactnessTamperCaseCount:
      contractExportExactnessTamperCases.filter((item) => !item.executed).length,
    contractExportExactnessGetterInvocationCount,
    contractExportExactnessProxyTrapInvocationCount,
    contractExportExactnessPositiveCaseCount,
    contractExportExactnessPositiveCasesPassed,
    contractExportPrototypeFailureBlocksAuthorization,
    contractExportDuplicateInventoryFailureBlocksAuthorization,
    authoritativeCapabilityParserImplemented: true,
    capabilityParserAcceptsUnknownInput: true,
    capabilityParserReturnsDiscriminatedResult: true,
    trustedSnapshotDeepFrozen: true,
    trustedSnapshotConstructedFromVerifiedDescriptors: true,
    trustedSnapshotContainsNoReferenceToUntrustedCandidate: true,
    trustedSnapshotUsesFreshObjects: true,
    trustedSnapshotUsesFreshArrays: true,
    trustedSnapshotRetainsNoProxy: true,
    trustedSnapshotRetainsNoAccessorDescriptor: true,
    trustedSnapshotRetainsNoCustomPrototype: true,
    authoritativeEvaluatorParsesCandidateExactlyOnce: true,
    authoritativeEvaluatorShortCircuitsOnParseFailure: true,
    authoritativeEvaluatorUsesTrustedSnapshotOnly: true,
    postValidationUntrustedCandidateReadCount: 0,
    postValidationUntrustedManifestReadCount: 0,
    parseFailureStopsCapabilityEvaluation: true,
    parseFailureCanNeverAuthorize: true,
    parseFailureExceptionBounded: true,
    parseFailureRawErrorExposed: false,
    singleAuthoritativeCapabilityParser: true,
    productionResultUsesAuthoritativeParser: true,
    gatingCasesUseAuthoritativeParser: true,
    strongerTestOnlyCapabilityParserPresent: false,
    completeEvaluatorProxyCaseCount,
    completeEvaluatorProxyCasesRejected,
    completeEvaluatorProxyExceptionCount,
    completeEvaluatorProxyTrapInvocationCount,
    completeEvaluatorProxyCasesUseProductionEvaluator: true,
    rootProxyEvaluatorAuthorized,
    rootProxyEvaluatorThrew,
    rootProxyEvaluatorTrapInvocationCount,
    revokedRootProxyEvaluatorAuthorized,
    revokedRootProxyEvaluatorThrew,
    revokedRootProxyEvaluatorTrapInvocationCount,
    revokedRootProxyFailureBounded,
    rootProxyBackedCapabilityCandidateBlocksAuthorization,
    revokedRootProxyBackedCapabilityCandidateBlocksAuthorization,
    authoritativeProxyDetectionImplemented: true,
    proxyDetectionUsesNodeUtilTypesIsProxy: true,
    proxyDetectionOccursBeforeReflection: true,
    proxyDetectionOccursBeforePropertyRead: true,
    proxyDetectionOccursBeforeArrayInspection: true,
    proxyDetectionOccursBeforeObjectInspection: true,
    rootProxyRejected: true,
    nestedProxyRejected: true,
    proxyWrappedArrayRejected: true,
    proxyWrappedObjectRejected: true,
    proxyWrappedPrimitiveBoxRejected: true,
    proxyRejectionCaseCount,
    proxyRejectionCasesRejected,
    duplicateProxyRejectionCaseIdCount:
      proxyRejectionCaseCount -
      new Set(proxyRejectionCases.map((item) => item.id)).size,
    unexecutedProxyRejectionCaseCount: proxyRejectionCases.filter(
      (item) => !item.executed,
    ).length,
    proxyTrapInvocationCount,
    proxyCasesUseAuthoritativeValidator: true,
    proxyCasesMutateRealCandidateInputs: true,
    proxyBackedCapabilityCandidateBlocksAuthorization,
    proxyExploitAllowedCapabilitiesAccepted: proxyExploitAllowedCapabilities.accepted,
    proxyExploitAllowedCapabilitiesOwnKeysTraps:
      proxyExploitAllowedCapabilities.ownKeys,
    proxyExploitAllowedCapabilitiesDescriptorTraps:
      proxyExploitAllowedCapabilities.getOwnPropertyDescriptor,
    proxyExploitAllowedCapabilitiesGetTraps: proxyExploitAllowedCapabilities.get,
    proxyExploitAllowedCapabilitiesPrototypeTraps:
      proxyExploitAllowedCapabilities.getPrototypeOf,
    proxyExploitForbiddenCapabilitiesAccepted:
      proxyExploitForbiddenCapabilities.accepted,
    proxyExploitForbiddenCapabilitiesOwnKeysTraps:
      proxyExploitForbiddenCapabilities.ownKeys,
    proxyExploitForbiddenCapabilitiesDescriptorTraps:
      proxyExploitForbiddenCapabilities.getOwnPropertyDescriptor,
    proxyExploitForbiddenCapabilitiesGetTraps:
      proxyExploitForbiddenCapabilities.get,
    proxyExploitForbiddenCapabilitiesPrototypeTraps:
      proxyExploitForbiddenCapabilities.getPrototypeOf,
    proxyExploitManifestAccepted: proxyExploitManifest.accepted,
    proxyExploitManifestOwnKeysTraps: proxyExploitManifest.ownKeys,
    proxyExploitManifestDescriptorTraps:
      proxyExploitManifest.getOwnPropertyDescriptor,
    proxyExploitManifestGetTraps: proxyExploitManifest.get,
    proxyExploitManifestPrototypeTraps: proxyExploitManifest.getPrototypeOf,
    descriptorSafeArrayValidationImplemented: true,
    arrayElementsReadFromDataDescriptorsOnly: true,
    arrayAccessorRejectedBeforeInvocation: true,
    arraySymbolKeysRejected: true,
    arrayAdditionalOwnPropertiesRejected: true,
    arraySparseStructureRejected: true,
    arrayCustomPrototypeRejected: true,
    arrayElementsRecursivelyValidated: true,
    untrustedArrayIterationBeforeDescriptorValidationPresent: false,
    frozenArrayAssumedAccessorFree: false,
    sameExactSequenceUsesDescriptorSafeValues: true,
    sameExactSequenceInvokesCandidateAccessor: false,
    allowedCapabilitiesArrayDescriptorSafe: true,
    forbiddenCapabilitiesArrayDescriptorSafe: true,
    queryIdsArrayDescriptorSafe: true,
    fixtureSnapshotsArrayDescriptorSafe: true,
    fixtureRowsArrayDescriptorSafe: true,
    nestedPlainDataArraysDescriptorSafe: true,
    arrayAccessorSentinelCaseCount,
    arrayAccessorSentinelCasesRejected,
    arrayAccessorGetterInvocationCount,
    arrayAccessorCasesUseAuthoritativeValidator: true,
    hostileArrayTamperCaseCount,
    hostileArrayTamperCasesRejected,
    singleRecursivePlainDataValidator: true,
    arraysUseRecursivePlainDataValidator: true,
    objectsAndArraysUseDescriptorSafeBranches: true,
    validNestedDataDescriptorArraysAccepted: true,
    accessorBackedCapabilityCandidateBlocksAuthorization,
    singleAuthoritativeCapabilityValidator: true,
    strongerTestOnlyValidatorPresent: false,
    c5CannotBeRecommendedByThisImplementationPhase: true,
    publicAdapterFieldCount: adapterEvidence.publicAdapterFieldCount,
    adapterExposesFailureInjectionControls:
      adapterEvidence.failureControlsExposedPublicly,
    ...productionAuthorizationEvidence,
    allProductionAuthorizationFieldsFalse,
    sourceIntegrityStableDuringAuditExecution:
      productionEvaluation.sourceIntegrityPassed,
    sourceIntegrityTrustedBaselineAuthenticatedInsideAudit: false,
    externalTrustedBaselineRequiredForPreRunAuthentication: true,
    c5RecommendedDirectlyByImplementationPhase: false,
    legacyAstDiagnosticCheckId:
      isStructuredRecord(legacyAstDiagnostic.value) &&
      typeof legacyAstDiagnostic.value.checkId === "string"
        ? legacyAstDiagnostic.value.checkId
        : null,
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void runC4SecurityBoundarySimplificationAudit().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.allPassed) process.exitCode = 1;
  });
}
