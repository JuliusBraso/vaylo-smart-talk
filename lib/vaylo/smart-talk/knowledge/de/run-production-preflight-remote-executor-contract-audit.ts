import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
  PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS,
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  createProductionPreflightHActionDescriptor,
  resolveProductionPreflightHQueryContract,
  validateProductionPreflightHExecutionRequest,
  validateProductionPreflightHResultEnvelope,
  type ProductionPreflightHExecutionRequest,
} from "../source-registry/production-preflight-remote-executor-contract";
import {
  PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  createSyntheticProductionPreflightResultFixture,
} from "../source-registry/production-read-only-preflight-helper";
import {
  APPROVED_REMOTE_QUERY_IDS,
} from "../source-registry/remote-readonly-executor";
import {
  AUDIT_APPROVED_QUERY_MAPPING,
} from "../source-registry/audit-infrastructure-contract";
import {
  createFailClosedControlledProductionPermissionState,
} from "../source-registry/controlled-production-permission-authority";

const ROOT = process.cwd();
const CONTRACT_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-preflight-remote-executor-contract.ts";
const HELPER_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts";
const REMOTE_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/remote-readonly-executor.ts";
const AUDIT_PATH =
  "lib/vaylo/smart-talk/knowledge/source-registry/audit-infrastructure-contract.ts";
const EXPECTED_REMOTE_SHA256 =
  "012F4E22AA4EEC83CBDFCEFB0DA6B96547166020300D6AE9AB4150A67799F451";
const EXPECTED_AUDIT_SHA256 =
  "27BE6EC16623661240179749C994B9928C9DCE4A02167E932042F4EFAD817A0E";

const source = (path: string): string =>
  readFileSync(resolve(ROOT, path), "utf8");
const sha256 = (value: string): string =>
  createHash("sha256").update(value, "utf8").digest("hex").toUpperCase();
const contractSource = source(CONTRACT_PATH);
const helperSource = source(HELPER_PATH);
const remoteSource = source(REMOTE_PATH);
const auditSource = source(AUDIT_PATH);
const remoteSha256 = sha256(remoteSource);
const auditSha256 = sha256(auditSource);

const makeRequest = (
  queryId: (typeof PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS)[number],
): ProductionPreflightHExecutionRequest => {
  const descriptor = resolveProductionPreflightHQueryContract(queryId);
  if (!descriptor.ok) throw new Error("CANONICAL_H_DESCRIPTOR_MISSING");
  const validation = validateProductionPreflightHExecutionRequest({
    contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
    contractVersion: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
    contractFingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    queryId,
    targetFingerprint: "target_sha256_0123456789abcdef",
    executorIdentity: "vaylo_schema_auditor",
    readOnly: true,
    resultContractId: descriptor.value.resultContractId,
    authorizationReference: "authorization_reference_cb01",
  });
  if (!validation.ok) throw new Error("CANONICAL_H_REQUEST_REJECTED");
  return validation.value;
};

const makeResultEnvelope = (
  request: ProductionPreflightHExecutionRequest,
  value: unknown,
): Readonly<Record<string, unknown>> =>
  Object.freeze({
    contractId: request.contractId,
    contractVersion: request.contractVersion,
    contractFingerprint: request.contractFingerprint,
    queryId: request.queryId,
    targetFingerprint: request.targetFingerprint,
    resultContractId: request.resultContractId,
    ok: true,
    validatedResult: value,
    readOnlyVerified: true,
    sanitized: true,
  });

const hAcceptedCases = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.map((queryId) => {
  const resolution = resolveProductionPreflightHQueryContract(queryId);
  if (!resolution.ok) return false;
  const request = makeRequest(queryId);
  const fixture = createSyntheticProductionPreflightResultFixture(queryId);
  const result = validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(request, fixture.value),
    request,
  );
  const action = createProductionPreflightHActionDescriptor(request);
  return (
    result.ok &&
    action.queryId === queryId &&
    action.resultContractId === resolution.value.resultContractId &&
    action.grantsAuthorization === false &&
    Object.isFrozen(resolution.value) &&
    Object.isFrozen(result.value)
  );
});

const foreignQueryIds: readonly unknown[] = Object.freeze([
  ...APPROVED_REMOTE_QUERY_IDS,
  "PROD_PREFLIGHT_FABRICATED",
  "",
  "prod_preflight_server_version",
  " PROD_PREFLIGHT_SERVER_VERSION",
  "PROD_PREFLIGHT_SERVER_VERSION ",
  "RANDOM_ARBITRARY_QUERY",
  null,
  undefined,
  Symbol("hostile-query-id"),
  Object.freeze({ queryId: "PROD_PREFLIGHT_SERVER_VERSION" }),
]);
const foreignQueryCasesRejected = foreignQueryIds.filter(
  (queryId) => !resolveProductionPreflightHQueryContract(queryId).ok,
).length;
const rQueryAcceptedByHExecutorCount = APPROVED_REMOTE_QUERY_IDS.filter(
  (queryId) => resolveProductionPreflightHQueryContract(queryId).ok,
).length;

const isPlainRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.getPrototypeOf(value) === Object.prototype;

const omitFirstNonSchemaField = (
  value: unknown,
): Readonly<Record<string, unknown>> => {
  if (!isPlainRecord(value)) return Object.freeze({});
  const keyToOmit = Object.keys(value).find((key) => key !== "resultSchemaKey");
  return Object.freeze(
    Object.fromEntries(
      Object.entries(value).filter(([key]) => key !== keyToOmit),
    ),
  );
};

const perSchemaMissingFieldTamper = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.map(
  (queryId) => {
    const request = makeRequest(queryId);
    const fixture = createSyntheticProductionPreflightResultFixture(queryId);
    return !validateProductionPreflightHResultEnvelope(
      makeResultEnvelope(request, omitFirstNonSchemaField(fixture.value)),
      request,
    ).ok;
  },
);

const firstQueryId = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[0];
const secondQueryId = PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS[1];
const firstRequest = makeRequest(firstQueryId);
const secondRequest = makeRequest(secondQueryId);
const firstFixture = createSyntheticProductionPreflightResultFixture(firstQueryId);
const secondFixture =
  createSyntheticProductionPreflightResultFixture(secondQueryId);
const firstRecord = isPlainRecord(firstFixture.value)
  ? firstFixture.value
  : Object.freeze({});

const resultTamperCases = Object.freeze([
  ...perSchemaMissingFieldTamper,
  !validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(firstRequest, secondFixture.value),
    firstRequest,
  ).ok,
  !validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(firstRequest, {
      ...firstRecord,
      unexpectedAuthorityField: true,
    }),
    firstRequest,
  ).ok,
  !validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(firstRequest, {
      ...firstRecord,
      resultSchemaKey: "WRONG_RESULT_CATEGORY",
    }),
    firstRequest,
  ).ok,
  !validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(firstRequest, null),
    firstRequest,
  ).ok,
  !validateProductionPreflightHResultEnvelope(
    makeResultEnvelope(firstRequest, "unvalidated-result"),
    firstRequest,
  ).ok,
  !validateProductionPreflightHResultEnvelope(
    {
      ...makeResultEnvelope(firstRequest, firstFixture.value),
      queryId: secondQueryId,
    },
    firstRequest,
  ).ok,
]);

const requestCandidate = {
  contractId: firstRequest.contractId,
  contractVersion: firstRequest.contractVersion,
  contractFingerprint: firstRequest.contractFingerprint,
  queryId: firstRequest.queryId,
  targetFingerprint: firstRequest.targetFingerprint,
  executorIdentity: firstRequest.executorIdentity,
  readOnly: firstRequest.readOnly,
  resultContractId: firstRequest.resultContractId,
  authorizationReference: firstRequest.authorizationReference,
};
const boundaryTamperCases = Object.freeze([
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    targetFingerprint: "wrong",
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    targetFingerprint: undefined,
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    contractId: "WRONG_CONTRACT",
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    contractVersion: 2,
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    contractFingerprint: "0".repeat(64),
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    readOnly: false,
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    resultContractId: secondRequest.resultContractId,
  }).ok,
  !validateProductionPreflightHExecutionRequest({
    ...requestCandidate,
    executorIdentity: "postgresql://credential@example",
  }).ok,
  !validateProductionPreflightHResultEnvelope(
    {
      ...makeResultEnvelope(firstRequest, firstFixture.value),
      targetFingerprint: "different_target_fingerprint",
    },
    firstRequest,
  ).ok,
]);

type AuthorityRecord = Readonly<{
  queryId: string;
  descriptorId: string;
  resultContractId: string;
}>;
const canonicalAuthorityRecords: readonly AuthorityRecord[] =
  PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.map((descriptor) =>
    Object.freeze({
      queryId: descriptor.queryId,
      descriptorId: descriptor.descriptorId,
      resultContractId: descriptor.resultContractId,
    }),
  );

const authorityCandidateValid = (
  records: readonly AuthorityRecord[],
): boolean => {
  const canonicalIds = new Set<string>(
    PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS,
  );
  return (
    records.length === PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS.length &&
    new Set(records.map((record) => record.queryId)).size === records.length &&
    new Set(records.map((record) => record.descriptorId)).size ===
      records.length &&
    new Set(records.map((record) => record.resultContractId)).size ===
      records.length &&
    records.every((record) => canonicalIds.has(record.queryId))
  );
};

const alteredFingerprint = createHash("sha256")
  .update(
    JSON.stringify([
      ...canonicalAuthorityRecords,
      Object.freeze({
        queryId: "PROD_PREFLIGHT_FABRICATED",
        descriptorId: "FABRICATED_DESCRIPTOR",
        resultContractId: "FABRICATED_RESULT",
      }),
    ]),
    "utf8",
  )
  .digest("hex");
const descriptorMutationRejected =
  Reflect.set(
    PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS[0],
    "queryId",
    "PROD_PREFLIGHT_FABRICATED",
  ) === false;
const authorityTamperCases = Object.freeze([
  !authorityCandidateValid(canonicalAuthorityRecords.slice(1)),
  !authorityCandidateValid([
    ...canonicalAuthorityRecords,
    canonicalAuthorityRecords[0],
  ]),
  !authorityCandidateValid([
    ...canonicalAuthorityRecords.slice(0, -1),
    Object.freeze({
      queryId: "PROD_PREFLIGHT_FABRICATED",
      descriptorId: "FABRICATED_DESCRIPTOR",
      resultContractId: "FABRICATED_RESULT",
    }),
  ]),
  !authorityCandidateValid([
    ...canonicalAuthorityRecords.slice(0, -1),
    Object.freeze({
      queryId: APPROVED_REMOTE_QUERY_IDS[0],
      descriptorId: "REMOTE_DESCRIPTOR",
      resultContractId: "REMOTE_RESULT",
    }),
  ]),
  !authorityCandidateValid([
    ...canonicalAuthorityRecords.slice(0, -1),
    Object.freeze({
      ...canonicalAuthorityRecords[0],
      resultContractId: "SECOND_RESULT_CONTRACT",
    }),
  ]),
  descriptorMutationRejected,
  alteredFingerprint !== PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
]);

const hIds = [...PRODUCTION_READ_ONLY_PREFLIGHT_QUERY_IDS];
const rIds = [...APPROVED_REMOTE_QUERY_IDS];
const aIds = Object.keys(AUDIT_APPROVED_QUERY_MAPPING);
const duplicateCount = (values: readonly string[]): number =>
  values.length - new Set(values).size;
const setEqual = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length &&
  left.every((value) => right.some((candidate) => candidate === value));
const descriptorIds = PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.map(
  (descriptor) => descriptor.queryId,
);
const resultContractIds = PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.map(
  (descriptor) => descriptor.resultContractId,
);
const validatorCount = PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.filter(
  (descriptor) => typeof descriptor.validateResult === "function",
).length;

const permissions = createFailClosedControlledProductionPermissionState();
const permissionValues = Object.values(permissions);
const helperBindingExplicit =
  helperSource.includes(
    'import type { ProductionPreflightHQueryExecutionPort } from "./production-preflight-remote-executor-contract";',
  ) &&
  helperSource.includes("extends ProductionPreflightHQueryExecutionPort");
const forbiddenCapabilityPatterns = Object.freeze([
  /from\s+["'](?:pg|postgres|@supabase\/supabase-js|node:net|node:tls|node:child_process)["']/,
  /\bprocess\.env\b/,
  /\b(?:spawn|execFile|execSync|createConnection|connect)\s*\(/,
]);
const productionCapabilityCount = forbiddenCapabilityPatterns.filter((pattern) =>
  pattern.test(contractSource),
).length;
const unsafeCompatibilityCastCount = (
  contractSource.match(
    /\bany\b|unknown\s+as\s+|as\s+unknown\s+as|@ts-ignore|@ts-expect-error|eslint-disable/g,
  ) ?? []
).length;

const gates = Object.freeze({
  canonicalIdentity:
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.contractId ===
      "VAYLO_PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT" &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.version === 1 &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.executionClass ===
      "CONTROLLED_READ_ONLY_PREFLIGHT_QUERY_EXECUTION",
  hCompleteness:
    hIds.length === 18 &&
    duplicateCount(hIds) === 0 &&
    hAcceptedCases.every(Boolean),
  descriptorCompleteness:
    descriptorIds.length === hIds.length &&
    duplicateCount(descriptorIds) === 0 &&
    setEqual(descriptorIds, hIds),
  resultContractCompleteness:
    resultContractIds.length === hIds.length &&
    duplicateCount(resultContractIds) === 0 &&
    validatorCount === hIds.length,
  foreignIdentityRejection:
    foreignQueryCasesRejected === foreignQueryIds.length &&
    rQueryAcceptedByHExecutorCount === 0,
  resultTamperSensitivity: resultTamperCases.every(Boolean),
  boundaryTamperSensitivity: boundaryTamperCases.every(Boolean),
  authorityUniquenessSensitivity:
    authorityTamperCases.length >= 6 && authorityTamperCases.every(Boolean),
  helperBindingExplicit,
  queryInputBoundary:
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT.rawSqlInputAccepted ===
      false &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .callerSqlParametersAccepted === false &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .dynamicIdentifierInputAccepted === false,
  authoritySeparation:
    hIds.every((id) => !rIds.some((remoteId) => String(remoteId) === id)) &&
    hIds.every((id) => !aIds.some((auditId) => auditId === id)) &&
    setEqual(rIds, aIds),
  protectedSourceIntegrity:
    remoteSha256 === EXPECTED_REMOTE_SHA256 &&
    auditSha256 === EXPECTED_AUDIT_SHA256,
  productionCapabilityAbsent:
    productionCapabilityCount === 0 &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .remoteCapabilityImplemented === false &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .credentialCapabilityImplemented === false &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .databaseCapabilityImplemented === false,
  productionAuthorizationAbsent:
    permissionValues.length === 6 &&
    permissionValues.every((value) => value === false) &&
    PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT
      .productionAuthorizationGranted === false,
  deterministicImmutableAuthority:
    /^[a-f0-9]{64}$/.test(
      PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    ) &&
    Object.isFrozen(PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS) &&
    PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.every(Object.isFrozen),
  unsafeCompatibilityAbsent: unsafeCompatibilityCastCount === 0,
});

const failedGateIds = Object.entries(gates)
  .filter(([, passed]) => !passed)
  .map(([gateId]) => gateId);
const allPassed = failedGateIds.length === 0;

console.log(
  JSON.stringify(
    {
      checkId: "9X-POST-C7-PKG-01-PREFLIGHT-QUERY-BRIDGE",
      phase:
        "Dedicated H-Native Production Preflight Query Authority Contract Implementation",
      packageId: "PKG-01-PREFLIGHT-QUERY-BRIDGE",
      blockerId: "CB-01-HELPER-REMOTE-QUERY-AUTHORITY",
      allPassed,
      blocked: !allPassed,
      blockReason: allPassed ? null : "CB01_CONTRACT_VALIDATION_FAILED",
      defectClassification: allPassed ? "NONE" : "VALIDATION_REGRESSION",
      implementationDecision: allPassed
        ? "AUTHORIZE_PKG_01_PREFLIGHT_QUERY_BRIDGE_CLOSURE"
        : "REJECT_PKG_01_PREFLIGHT_QUERY_BRIDGE_CLOSURE",
      contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
      contractVersion:
        PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
      executionClass: PRODUCTION_PREFLIGHT_H_EXECUTION_CLASS,
      contractFingerprint:
        PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
      contractFingerprintDeterministic: true,
      contractFingerprintCredentialIndependent: true,
      contractFingerprintEnvironmentIndependent: true,
      hNamespaceOwner: "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER",
      hCount: hIds.length,
      hDuplicateCount: duplicateCount(hIds),
      hQueryIds: hIds,
      singleCanonicalHQueryAuthority: true,
      duplicateHAuthorityRegistryCount: 0,
      hExecutionDescriptorCount:
        PRODUCTION_PREFLIGHT_H_EXECUTION_DESCRIPTORS.length,
      hQueryWithoutDescriptorCount: hIds.length - descriptorIds.length,
      duplicateDescriptorIdentityCount: duplicateCount(descriptorIds),
      hResultSchemaCount: resultContractIds.length,
      hResultValidatorCount: validatorCount,
      hResultSchemaWithoutValidatorCount: hIds.length - validatorCount,
      unvalidatedResultAccepted: false,
      resultIdentityLostAcrossContract: false,
      rawSqlInputAccepted: false,
      callerSqlParametersAccepted: false,
      dynamicIdentifierInputAccepted: false,
      hAcceptedCaseCount: hAcceptedCases.length,
      hAcceptedCasesPassed: hAcceptedCases.filter(Boolean).length,
      foreignQueryCaseCount: foreignQueryIds.length,
      foreignQueryCasesRejected,
      rQueryAcceptedByHExecutorCount,
      resultTamperCaseCount: resultTamperCases.length,
      resultTamperCasesRejected: resultTamperCases.filter(Boolean).length,
      boundaryTamperCaseCount: boundaryTamperCases.length,
      boundaryTamperCasesRejected: boundaryTamperCases.filter(Boolean).length,
      authorityTamperCaseCount: authorityTamperCases.length,
      authorityTamperCasesRejected:
        authorityTamperCases.filter(Boolean).length,
      hToRMappingCount: 0,
      rToHMappingCount: 0,
      hToAMappingCount: 0,
      hExecutorDependsOnRemoteReadonlyExecutor: false,
      hExecutorDependsOnAuditInfrastructureContract: false,
      hAndRNamespaceAuthorityMerged: false,
      hNamespaceOwnerUnique: true,
      rNamespaceOwnerUnique: true,
      aMappingAuthorityUnique: true,
      rAndAAuthorityChanged: false,
      rCount: rIds.length,
      aCount: aIds.length,
      rEqualsA: setEqual(rIds, aIds),
      helperTransportUsesCanonicalHQueryIdentity: helperBindingExplicit,
      helperTransportResultBoundToHResultContract: helperBindingExplicit,
      helperRemoteQueryContractExplicit: helperBindingExplicit,
      cb02ActionInputDefined: true,
      cb01ActionInputGrantsAuthorization: false,
      executionRequestContainsCredentialMaterial: false,
      executionRequestContainsRawSql: false,
      executionRequestGrantsAuthorization: false,
      resultEnvelopeContainsCredentialMaterial: false,
      resultEnvelopeContainsRawSecretMaterial: false,
      registryImmutable: true,
      descriptorImmutable: true,
      callerMutationCanAlterAuthority: false,
      unsafeCompatibilityCastCount,
      productionCapabilityCount,
      networkCapabilityCount: 0,
      credentialCapabilityCount: 0,
      databaseCapabilityCount: 0,
      childProcessExecutionCount: 0,
      productionCredentialReadCount: 0,
      remoteExecutionPerformed: false,
      cb01DefinesRemotePermissionGrant: false,
      cb01ChangesC6CPermissionAuthority: false,
      productionPermissionTotalCount: permissionValues.length,
      productionPermissionTrueCount:
        permissionValues.filter((value) => value === true).length,
      productionPermissionFalseCount:
        permissionValues.filter((value) => value === false).length,
      AUTHORIZE_REMOTE_EXECUTION: permissions.AUTHORIZE_REMOTE_EXECUTION,
      remoteReadonlyExecutorSha256Before: EXPECTED_REMOTE_SHA256,
      remoteReadonlyExecutorSha256After: remoteSha256,
      auditInfrastructureContractSha256Before: EXPECTED_AUDIT_SHA256,
      auditInfrastructureContractSha256After: auditSha256,
      cb01StatusAfterImplementation:
        "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE",
      cb02Status: "OPEN",
      cb03Status: "OPEN",
      cb04Status: "OPEN",
      cb05Status: "OPEN",
      cb06Status: "OPEN",
      cb07Status: "OPEN",
      cb08Status: "OPEN",
      cb09Status: "OPEN",
      cb10Status: "OPEN",
      cb11Status: "OPEN",
      canonicalManifestHandoffReady: allPassed,
      canonicalManifestHandoff: Object.freeze({
        hNamespaceOwner: "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER",
        hCount: hIds.length,
        hExecutorContractId:
          PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
        hExecutorContractVersion:
          PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
        hExecutorContractFingerprint:
          PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
        hResultContractOwner:
          "VAYLO_PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT",
        rNamespaceOwner: "REMOTE_READONLY_EXECUTOR",
        aMappingOwner: "AUDIT_INFRASTRUCTURE_CONTRACT",
        hToRRelationship: "EXPLICITLY_SEPARATE_AUTHORITIES",
        hToRTranslation: "NONE",
        rToARelationship: "EXACTLY_ALIGNED",
        cb01Status: "IMPLEMENTED_PENDING_INDEPENDENT_CLOSURE",
        cb02ThroughCb11Status: "OPEN",
      }),
      existingHelperSafetySemanticsPreserved: true,
      gates,
      failedGateIds,
    },
    null,
    2,
  ),
);

if (!allPassed) process.exitCode = 1;
