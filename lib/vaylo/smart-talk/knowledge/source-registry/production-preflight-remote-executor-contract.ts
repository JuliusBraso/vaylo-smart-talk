import "server-only";

import { createHash } from "node:crypto";
import { types as nodeUtilTypes } from "node:util";

import {
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY,
  type NormalizedPreflightResult,
  type ProductionReadOnlyPreflightQueryId,
  type ProductionReadOnlyPreflightResultSchemaId,
} from "./production-read-only-preflight-helper";

export const PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID =
  "VAYLO_PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT" as const;
export const PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION = 1 as const;
export const PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS =
  "CONTROLLED_READ_ONLY_PREFLIGHT_QUERY_EXECUTION" as const;
export const PRODUCTION_PREFLIGHT_H_QUERY_NAMESPACE =
  "PRODUCTION_PREFLIGHT_H" as const;
export const PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID =
  "PKG01_DESCRIPTOR_SAFE_CANONICAL_SNAPSHOT_V1" as const;

export const PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT = Object.freeze({
  contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  version: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  executionClass: PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
  queryNamespace: PRODUCTION_PREFLIGHT_H_QUERY_NAMESPACE,
  ingressPolicyId: PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID,
  namespaceOwner: "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER",
  remoteAuthorizationRequiredSeparately: true,
  remoteCapabilityImplemented: false,
  credentialCapabilityImplemented: false,
  databaseCapabilityImplemented: false,
  productionAuthorizationGranted: false,
  rawSqlInputAccepted: false,
  callerSqlParametersAccepted: false,
  dynamicIdentifierInputAccepted: false,
  hToRTranslationAllowed: false,
  hToAuditInterfaceTranslationAllowed: false,
} as const);

export type ProductionPreflightHQueryIdentity =
  ProductionReadOnlyPreflightQueryId;
export type ProductionPreflightHUntrustedResult = unknown;

export type ProductionPreflightHExecutionDescriptor = Readonly<{
  queryId: ProductionPreflightHQueryIdentity;
  descriptorId: string;
  semanticPurpose: string;
  semanticCategory: ProductionReadOnlyPreflightResultSchemaId;
  resultContractId: string;
  expectedResultSchemaId: ProductionReadOnlyPreflightResultSchemaId;
  validatorIdentity: string;
  failureBlocker: string;
  failureTaxonomy: "FAIL_CLOSED_PREFLIGHT_QUERY";
  readOnly: true;
  catalogOnly: true;
  targetBindingRequired: true;
  sessionBindingRequired: true;
  sanitizationPolicy: "NORMALIZED_BOUNDED_RESULT_ONLY";
  rawSqlInputAccepted: false;
  callerParametersAccepted: false;
  dynamicIdentifiersAccepted: false;
  validateResult: (input: unknown) => input is NormalizedPreflightResult;
}>;

const descriptorFor = (
  queryId: ProductionPreflightHQueryIdentity,
): ProductionPreflightHExecutionDescriptor => {
  const entry = PRODUCTION_READ_ONLY_PREFLIGHT_REGISTRY[queryId];
  return Object.freeze({
    queryId,
    descriptorId: `H_EXECUTION_DESCRIPTOR_V1:${queryId}`,
    semanticPurpose: entry.intent,
    semanticCategory: entry.resultSchemaKey,
    resultContractId: `H_RESULT_CONTRACT_V1:${entry.resultSchemaKey}`,
    expectedResultSchemaId: entry.resultSchemaKey,
    validatorIdentity: `H_VALIDATOR_V1:${entry.resultSchemaKey}`,
    failureBlocker: entry.blocker,
    failureTaxonomy: "FAIL_CLOSED_PREFLIGHT_QUERY" as const,
    readOnly: true as const,
    catalogOnly: true as const,
    targetBindingRequired: true as const,
    sessionBindingRequired: true as const,
    sanitizationPolicy: "NORMALIZED_BOUNDED_RESULT_ONLY" as const,
    rawSqlInputAccepted: false as const,
    callerParametersAccepted: false as const,
    dynamicIdentifiersAccepted: false as const,
    validateResult: entry.validateResult,
  });
};

export const PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS = Object.freeze(
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.map(descriptorFor),
);

const fingerprintPayload = PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.map(
  (descriptor) =>
    Object.freeze({
      queryId: descriptor.queryId,
      descriptorId: descriptor.descriptorId,
      semanticCategory: descriptor.semanticCategory,
      resultContractId: descriptor.resultContractId,
      validatorIdentity: descriptor.validatorIdentity,
      failureTaxonomy: descriptor.failureTaxonomy,
      readOnly: descriptor.readOnly,
      catalogOnly: descriptor.catalogOnly,
      targetBindingRequired: descriptor.targetBindingRequired,
      sessionBindingRequired: descriptor.sessionBindingRequired,
      sanitizationPolicy: descriptor.sanitizationPolicy,
      rawSqlInputAccepted: descriptor.rawSqlInputAccepted,
      callerParametersAccepted: descriptor.callerParametersAccepted,
      dynamicIdentifiersAccepted: descriptor.dynamicIdentifiersAccepted,
    }),
);

export const PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT =
  createHash("sha256")
    .update(
      JSON.stringify({
        contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
        version: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
        executionClass: PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
        queryNamespace: PRODUCTION_PREFLIGHT_H_QUERY_NAMESPACE,
        ingressPolicyId: PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID,
        descriptors: fingerprintPayload,
      }),
      "utf8",
    )
    .digest("hex");

export type ProductionPreflightHQueryResolution =
  | Readonly<{ ok: true; value: ProductionPreflightHExecutionDescriptor }>
  | Readonly<{
      ok: false;
      failureCode: "QUERY_ID_NOT_IN_PRODUCTION_PREFLIGHT_H_NAMESPACE";
    }>;

const isProductionPreflightHQueryIdentity = (
  value: unknown,
): value is ProductionPreflightHQueryIdentity =>
  typeof value === "string" &&
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.some((queryId) => queryId === value);

export const resolveProductionPreflightHQueryContract = (
  queryId: unknown,
): ProductionPreflightHQueryResolution => {
  if (!isProductionPreflightHQueryIdentity(queryId)) {
    return Object.freeze({
      ok: false as const,
      failureCode:
        "QUERY_ID_NOT_IN_PRODUCTION_PREFLIGHT_H_NAMESPACE" as const,
    });
  }
  const descriptor = PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.find(
    (candidate) => candidate.queryId === queryId,
  );
  if (!descriptor) {
    return Object.freeze({
      ok: false as const,
      failureCode:
        "QUERY_ID_NOT_IN_PRODUCTION_PREFLIGHT_H_NAMESPACE" as const,
    });
  }
  return Object.freeze({ ok: true as const, value: descriptor });
};

export type ProductionPreflightHExecutionRequest = Readonly<{
  contractId: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID;
  contractVersion: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION;
  contractFingerprint: string;
  queryId: ProductionPreflightHQueryIdentity;
  targetFingerprint: string;
  executorIdentity: string;
  readOnly: true;
  resultContractId: string;
  authorizationReference: string;
}>;

export type ProductionPreflightHActionDescriptor = Readonly<{
  contractId: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID;
  contractVersion: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION;
  contractFingerprint: string;
  executorContractIdentity: typeof PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS;
  queryId: ProductionPreflightHQueryIdentity;
  resultContractId: string;
  readOnlyClass: "READ_ONLY_CATALOG_PREFLIGHT";
  targetBindingRequired: true;
  grantsAuthorization: false;
}>;

export type ProductionPreflightHRequestValidation =
  | Readonly<{ ok: true; value: ProductionPreflightHExecutionRequest }>
  | Readonly<{
      ok: false;
      failureCode:
        | "INVALID_REQUEST_SHAPE"
        | "CONTRACT_IDENTITY_MISMATCH"
        | "CONTRACT_FINGERPRINT_MISMATCH"
        | "QUERY_ID_REJECTED"
        | "RESULT_CONTRACT_MISMATCH"
        | "TARGET_BINDING_INVALID"
        | "EXECUTOR_IDENTITY_INVALID"
        | "AUTHORIZATION_REFERENCE_INVALID"
        | "READ_ONLY_REQUIRED";
    }>;

const REQUEST_KEYS = Object.freeze([
  "contractId",
  "contractVersion",
  "contractFingerprint",
  "queryId",
  "targetFingerprint",
  "executorIdentity",
  "readOnly",
  "resultContractId",
  "authorizationReference",
]);
const SAFE_ID = /^[A-Za-z0-9_.:-]{12,128}$/;
const SECRET_MATERIAL =
  /(?:password|secret|token|credential|api[_-]?key|postgres(?:ql)?:\/\/|database_url)/i;
const normalizedHRequestProvenance = new WeakSet<object>();

const closedPlainDataRecordSnapshot = (
  value: unknown,
  keys: readonly string[],
): Readonly<Record<string, unknown>> | null => {
  if (
    nodeUtilTypes.isProxy(value) ||
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }
  try {
    if (Object.getPrototypeOf(value) !== Object.prototype) return null;
    const ownKeys = Reflect.ownKeys(value);
    if (
      ownKeys.length !== keys.length ||
      ownKeys.some(
        (key) => typeof key !== "string" || !keys.includes(key),
      )
    ) {
      return null;
    }
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const snapshot: Record<string, unknown> = {};
    for (const key of keys) {
      const descriptor = descriptors[key];
      if (
        !descriptor ||
        !("value" in descriptor) ||
        descriptor.get !== undefined ||
        descriptor.set !== undefined
      ) {
        return null;
      }
      snapshot[key] = descriptor.value;
    }
    return Object.freeze(snapshot);
  } catch {
    return null;
  }
};

const safeDataSnapshot = (
  value: unknown,
  seen: WeakSet<object> = new WeakSet<object>(),
): unknown => {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (nodeUtilTypes.isProxy(value) || typeof value !== "object") {
    throw new Error("UNSAFE_RESULT_DATA");
  }
  if (seen.has(value)) throw new Error("CYCLIC_RESULT_DATA");
  seen.add(value);
  try {
    if (Array.isArray(value)) {
      if (Object.getPrototypeOf(value) !== Array.prototype) {
        throw new Error("UNSAFE_RESULT_ARRAY");
      }
      const ownKeys = Reflect.ownKeys(value);
      const descriptors = Object.getOwnPropertyDescriptors(value);
      const lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length");
      const length =
        lengthDescriptor && "value" in lengthDescriptor
          ? lengthDescriptor.value
          : -1;
      if (
        typeof length !== "number" ||
        !Number.isSafeInteger(length) ||
        length < 0
      ) {
        throw new Error("UNSAFE_RESULT_ARRAY");
      }
      const expected = new Set([
        "length",
        ...Array.from({ length }, (_, index) => String(index)),
      ]);
      if (
        ownKeys.some(
          (key) => typeof key !== "string" || !expected.has(key),
        ) ||
        ownKeys.length !== expected.size
      ) {
        throw new Error("UNSAFE_RESULT_ARRAY");
      }
      const snapshot: unknown[] = [];
      for (let index = 0; index < length; index += 1) {
        const descriptor = descriptors[String(index)];
        if (!descriptor || !("value" in descriptor)) {
          throw new Error("UNSAFE_RESULT_ARRAY");
        }
        snapshot.push(safeDataSnapshot(descriptor.value, seen));
      }
      return Object.freeze(snapshot);
    }
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      throw new Error("UNSAFE_RESULT_RECORD");
    }
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some((key) => typeof key !== "string")) {
      throw new Error("UNSAFE_RESULT_RECORD");
    }
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const snapshot: Record<string, unknown> = {};
    for (const key of ownKeys as string[]) {
      const descriptor = descriptors[key];
      if (!descriptor || !("value" in descriptor)) {
        throw new Error("UNSAFE_RESULT_RECORD");
      }
      snapshot[key] = safeDataSnapshot(descriptor.value, seen);
    }
    return Object.freeze(snapshot);
  } finally {
    seen.delete(value);
  }
};

const safeBoundedIdentity = (value: unknown): value is string =>
  typeof value === "string" &&
  SAFE_ID.test(value) &&
  !SECRET_MATERIAL.test(value);

const requestFailure = (
  failureCode: Extract<ProductionPreflightHRequestValidation, { ok: false }>["failureCode"],
): ProductionPreflightHRequestValidation =>
  Object.freeze({ ok: false as const, failureCode });

export const validateProductionPreflightHExecutionRequest = (
  input: unknown,
): ProductionPreflightHRequestValidation => {
  const source = closedPlainDataRecordSnapshot(input, REQUEST_KEYS);
  if (!source) {
    return requestFailure("INVALID_REQUEST_SHAPE");
  }
  if (
    source.contractId !== PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID ||
    source.contractVersion !==
      PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION
  ) {
    return requestFailure("CONTRACT_IDENTITY_MISMATCH");
  }
  if (
    source.contractFingerprint !==
    PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT
  ) {
    return requestFailure("CONTRACT_FINGERPRINT_MISMATCH");
  }
  const resolution = resolveProductionPreflightHQueryContract(source.queryId);
  if (!resolution.ok) return requestFailure("QUERY_ID_REJECTED");
  if (source.resultContractId !== resolution.value.resultContractId) {
    return requestFailure("RESULT_CONTRACT_MISMATCH");
  }
  if (!safeBoundedIdentity(source.targetFingerprint)) {
    return requestFailure("TARGET_BINDING_INVALID");
  }
  if (!safeBoundedIdentity(source.executorIdentity)) {
    return requestFailure("EXECUTOR_IDENTITY_INVALID");
  }
  if (!safeBoundedIdentity(source.authorizationReference)) {
    return requestFailure("AUTHORIZATION_REFERENCE_INVALID");
  }
  if (source.readOnly !== true) return requestFailure("READ_ONLY_REQUIRED");

  const value = Object.freeze({
    contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
    contractVersion:
      PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
    contractFingerprint:
      PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    queryId: resolution.value.queryId,
    targetFingerprint: source.targetFingerprint,
    executorIdentity: source.executorIdentity,
    readOnly: true as const,
    resultContractId: resolution.value.resultContractId,
    authorizationReference: source.authorizationReference,
  });
  normalizedHRequestProvenance.add(value);
  return Object.freeze({
    ok: true as const,
    value,
  });
};

export const isValidatedProductionPreflightHExecutionRequest = (
  value: unknown,
): value is ProductionPreflightHExecutionRequest =>
  value !== null &&
  typeof value === "object" &&
  normalizedHRequestProvenance.has(value);

export const createProductionPreflightHActionDescriptor = (
  request: ProductionPreflightHExecutionRequest,
): ProductionPreflightHActionDescriptor =>
  Object.freeze({
    contractId: request.contractId,
    contractVersion: request.contractVersion,
    contractFingerprint: request.contractFingerprint,
    executorContractIdentity: PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
    queryId: request.queryId,
    resultContractId: request.resultContractId,
    readOnlyClass: "READ_ONLY_CATALOG_PREFLIGHT" as const,
    targetBindingRequired: true as const,
    grantsAuthorization: false as const,
  });

export type ProductionPreflightHValidatedResultEnvelope = Readonly<{
  contractId: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID;
  contractVersion: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION;
  contractFingerprint: string;
  queryId: ProductionPreflightHQueryIdentity;
  targetFingerprint: string;
  resultContractId: string;
  ok: true;
  validatedResult: NormalizedPreflightResult;
  readOnlyVerified: true;
  sanitized: true;
}>;

export type ProductionPreflightHResultValidation =
  | Readonly<{ ok: true; value: ProductionPreflightHValidatedResultEnvelope }>
  | Readonly<{
      ok: false;
      failureCode:
        | "INVALID_RESULT_ENVELOPE"
        | "RESULT_REQUEST_BINDING_MISMATCH"
        | "RESULT_SCHEMA_VALIDATION_FAILED";
    }>;

const RESULT_KEYS = Object.freeze([
  "contractId",
  "contractVersion",
  "contractFingerprint",
  "queryId",
  "targetFingerprint",
  "resultContractId",
  "ok",
  "validatedResult",
  "readOnlyVerified",
  "sanitized",
]);

export const validateProductionPreflightHResultEnvelope = (
  input: unknown,
  request: ProductionPreflightHExecutionRequest,
): ProductionPreflightHResultValidation => {
  if (!isValidatedProductionPreflightHExecutionRequest(request)) {
    return Object.freeze({
      ok: false as const,
      failureCode: "RESULT_REQUEST_BINDING_MISMATCH" as const,
    });
  }
  const source = closedPlainDataRecordSnapshot(input, RESULT_KEYS);
  if (!source) {
    return Object.freeze({
      ok: false as const,
      failureCode: "INVALID_RESULT_ENVELOPE" as const,
    });
  }
  if (
    source.contractId !== request.contractId ||
    source.contractVersion !== request.contractVersion ||
    source.contractFingerprint !== request.contractFingerprint ||
    source.queryId !== request.queryId ||
    source.targetFingerprint !== request.targetFingerprint ||
    source.resultContractId !== request.resultContractId ||
    source.ok !== true ||
    source.readOnlyVerified !== true ||
    source.sanitized !== true
  ) {
    return Object.freeze({
      ok: false as const,
      failureCode: "RESULT_REQUEST_BINDING_MISMATCH" as const,
    });
  }
  const resolution = resolveProductionPreflightHQueryContract(request.queryId);
  let validatedResultSnapshot: unknown;
  try {
    validatedResultSnapshot = safeDataSnapshot(source.validatedResult);
  } catch {
    return Object.freeze({
      ok: false as const,
      failureCode: "INVALID_RESULT_ENVELOPE" as const,
    });
  }
  if (
    !resolution.ok ||
    !resolution.value.validateResult(validatedResultSnapshot)
  ) {
    return Object.freeze({
      ok: false as const,
      failureCode: "RESULT_SCHEMA_VALIDATION_FAILED" as const,
    });
  }
  return Object.freeze({
    ok: true as const,
    value: Object.freeze({
      contractId: request.contractId,
      contractVersion: request.contractVersion,
      contractFingerprint: request.contractFingerprint,
      queryId: request.queryId,
      targetFingerprint: request.targetFingerprint,
      resultContractId: request.resultContractId,
      ok: true as const,
      validatedResult: validatedResultSnapshot,
      readOnlyVerified: true as const,
      sanitized: true as const,
    }),
  });
};

export type ProductionPreflightHSafeFailureCode =
  | "QUERY_REJECTED"
  | "EXECUTION_UNAVAILABLE"
  | "RESULT_REJECTED"
  | "TARGET_BINDING_REJECTED"
  | "READ_ONLY_ENFORCEMENT_REJECTED";

export type ProductionPreflightHSafeFailureEnvelope = Readonly<{
  contractId: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID;
  contractVersion: typeof PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION;
  queryId: ProductionPreflightHQueryIdentity;
  targetFingerprint: string;
  ok: false;
  failureCode: ProductionPreflightHSafeFailureCode;
  rawDetailsSuppressed: true;
  credentialMaterialPresent: false;
}>;

export const createProductionPreflightHSafeFailureEnvelope = (
  request: ProductionPreflightHExecutionRequest,
  failureCode: ProductionPreflightHSafeFailureCode,
): ProductionPreflightHSafeFailureEnvelope =>
  Object.freeze({
    contractId: request.contractId,
    contractVersion: request.contractVersion,
    queryId: request.queryId,
    targetFingerprint: request.targetFingerprint,
    ok: false as const,
    failureCode,
    rawDetailsSuppressed: true as const,
    credentialMaterialPresent: false as const,
  });

export interface ProductionPreflightHQueryExecutionPort {
  executeApprovedQuery(
    queryId: ProductionPreflightHQueryIdentity,
  ): Promise<ProductionPreflightHUntrustedResult>;
}
