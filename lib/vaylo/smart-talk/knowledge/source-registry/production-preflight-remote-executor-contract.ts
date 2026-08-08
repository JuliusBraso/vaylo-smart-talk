import "server-only";

import { createHash } from "node:crypto";

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

export const PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT = Object.freeze({
  contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  version: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  executionClass: PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
  queryNamespace: PRODUCTION_PREFLIGHT_H_QUERY_NAMESPACE,
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

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

const hasExactKeys = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => {
  const actual = Object.keys(value);
  return (
    actual.length === keys.length &&
    actual.every((key) => keys.some((expected) => expected === key))
  );
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
  if (!isPlainRecord(input) || !hasExactKeys(input, REQUEST_KEYS)) {
    return requestFailure("INVALID_REQUEST_SHAPE");
  }
  if (
    input.contractId !== PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID ||
    input.contractVersion !==
      PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION
  ) {
    return requestFailure("CONTRACT_IDENTITY_MISMATCH");
  }
  if (
    input.contractFingerprint !==
    PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT
  ) {
    return requestFailure("CONTRACT_FINGERPRINT_MISMATCH");
  }
  const resolution = resolveProductionPreflightHQueryContract(input.queryId);
  if (!resolution.ok) return requestFailure("QUERY_ID_REJECTED");
  if (input.resultContractId !== resolution.value.resultContractId) {
    return requestFailure("RESULT_CONTRACT_MISMATCH");
  }
  if (!safeBoundedIdentity(input.targetFingerprint)) {
    return requestFailure("TARGET_BINDING_INVALID");
  }
  if (!safeBoundedIdentity(input.executorIdentity)) {
    return requestFailure("EXECUTOR_IDENTITY_INVALID");
  }
  if (!safeBoundedIdentity(input.authorizationReference)) {
    return requestFailure("AUTHORIZATION_REFERENCE_INVALID");
  }
  if (input.readOnly !== true) return requestFailure("READ_ONLY_REQUIRED");

  return Object.freeze({
    ok: true as const,
    value: Object.freeze({
      contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
      contractVersion:
        PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
      contractFingerprint:
        PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
      queryId: resolution.value.queryId,
      targetFingerprint: input.targetFingerprint,
      executorIdentity: input.executorIdentity,
      readOnly: true as const,
      resultContractId: resolution.value.resultContractId,
      authorizationReference: input.authorizationReference,
    }),
  });
};

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
  if (!isPlainRecord(input) || !hasExactKeys(input, RESULT_KEYS)) {
    return Object.freeze({
      ok: false as const,
      failureCode: "INVALID_RESULT_ENVELOPE" as const,
    });
  }
  if (
    input.contractId !== request.contractId ||
    input.contractVersion !== request.contractVersion ||
    input.contractFingerprint !== request.contractFingerprint ||
    input.queryId !== request.queryId ||
    input.targetFingerprint !== request.targetFingerprint ||
    input.resultContractId !== request.resultContractId ||
    input.ok !== true ||
    input.readOnlyVerified !== true ||
    input.sanitized !== true
  ) {
    return Object.freeze({
      ok: false as const,
      failureCode: "RESULT_REQUEST_BINDING_MISMATCH" as const,
    });
  }
  const resolution = resolveProductionPreflightHQueryContract(request.queryId);
  if (!resolution.ok || !resolution.value.validateResult(input.validatedResult)) {
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
      validatedResult: Object.freeze({ ...input.validatedResult }),
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
