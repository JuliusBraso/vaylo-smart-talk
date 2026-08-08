import "server-only";

import { createHash } from "node:crypto";

import {
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  createFailClosedControlledProductionPermissionState,
} from "./controlled-production-permission-authority";
import {
  CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_INGRESS_POLICY_ID,
  CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
  CONTROLLED_PRODUCTION_PREFLIGHT_PROVENANCE_POLICY_ID,
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  fingerprintAuthorizationEnvelope,
  isValidatedControlledProductionPreflightBindingEvidence,
  validateControlledProductionPreflightAuthorizationEnvelope,
  validateControlledProductionPreflightExecutionManifest,
  validateManifestAuthorizationBinding,
  type ControlledProductionPreflightAuthorizationEnvelope,
  type ControlledProductionPreflightBindingEvidence,
  type ControlledProductionPreflightExecutionManifest,
} from "./controlled-production-preflight-execution-contracts";
import {
  PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
  PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
  PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
  createProductionPreflightHActionDescriptor,
  validateProductionPreflightHExecutionRequest,
  type ProductionPreflightHActionDescriptor,
  type ProductionPreflightHExecutionRequest,
  type ProductionPreflightHQueryIdentity,
} from "./production-preflight-remote-executor-contract";

export const CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID =
  "VAYLO_CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT" as const;
export const CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION =
  1 as const;
export const CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CLASS =
  "PRODUCTION_PREFLIGHT_H_REMOTE_ACTION_ONLY" as const;
export const CONTROLLED_PRODUCTION_REMOTE_ACTION_EXECUTION_SCOPE =
  "CONTROLLED_PRODUCTION_READ_ONLY_PREFLIGHT" as const;
export const CONTROLLED_PRODUCTION_REMOTE_ACTION_ID =
  "EXECUTE_ONE_APPROVED_H_PREFLIGHT_QUERY" as const;

export const CONTROLLED_PRODUCTION_REMOTE_ACTION_BINDING_CATEGORIES =
  Object.freeze([
    "H_ACTION",
    "TARGET_FINGERPRINT",
    "ARTIFACT_FINGERPRINT_SET",
    "SOURCE_COMMIT",
    "NONCE_REFERENCE",
    "EXECUTION_WINDOW",
    "EXECUTOR_IDENTITY",
    "C6C_REMOTE_PERMISSION",
  ] as const);

export const CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT =
  Object.freeze({
    contractId: CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
    version: CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
    authorizationClass:
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CLASS,
    executionScope: CONTROLLED_PRODUCTION_REMOTE_ACTION_EXECUTION_SCOPE,
    allowedAction: CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
    boundedActionCount: 1,
    batchActionCount: 0,
    rawSqlActionCount: 0,
    writeActionCount: 0,
    bootstrapActionCount: 0,
    runtimeActionCount: 0,
    publicLaunchActionCount: 0,
    contractGrantsProductionWrite: false,
    contractGrantsBootstrap: false,
    contractGrantsRuntime: false,
    contractGrantsPublicLaunch: false,
    contractGrantsCredentialAccess: false,
    contractGrantsBatchExecution: false,
    hActionAuthority: "PKG-01_H_EXECUTOR_CONTRACT",
    c2BindingAuthority: "CONTROLLED_PRODUCTION_PREFLIGHT_EXECUTION_CONTRACTS",
    productionPermissionAuthority:
      CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    productionPermissionId: "AUTHORIZE_REMOTE_EXECUTION",
    callerPermissionOverrideAccepted: false,
    manifestPermissionOverrideAccepted: false,
    helperPermissionOverrideAccepted: false,
    permissionAloneSufficientForAuthorization: false,
    actionDescriptorAloneSufficientForAuthorization: false,
    c2EnvelopeAloneSufficientForAuthorization: false,
    credentialAccessRemainsSeparate: true,
  } as const);

const authorizationFingerprintPayload = Object.freeze({
  contract:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT,
  hExecutor: Object.freeze({
    contractId: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_ID,
    version: PRODUCTION_PREFLIGHT_H_REMOTE_EXECUTOR_CONTRACT_VERSION,
    fingerprint: PRODUCTION_PREFLIGHT_H_EXECUTOR_CONTRACT_FINGERPRINT,
    ingressPolicyId: PRODUCTION_PREFLIGHT_H_INGRESS_POLICY_ID,
  }),
  c2: Object.freeze({
    manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
    authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
    sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
    ingressPolicyId: CONTROLLED_PRODUCTION_PREFLIGHT_INGRESS_POLICY_ID,
    provenancePolicyId: CONTROLLED_PRODUCTION_PREFLIGHT_PROVENANCE_POLICY_ID,
  }),
  c6c: Object.freeze({
    authorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    authorityVersion: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
    permissionId: "AUTHORIZE_REMOTE_EXECUTION",
  }),
  bindingCategories:
    CONTROLLED_PRODUCTION_REMOTE_ACTION_BINDING_CATEGORIES,
  evaluatorSemanticsVersion: 1,
  helperRebindIdentity:
    "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER_PKG03_REBIND_V1",
});

export const CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT =
  createHash("sha256")
    .update(JSON.stringify(authorizationFingerprintPayload), "utf8")
    .digest("hex");

export type ControlledProductionRemoteActionAuthorizationCandidate =
  Readonly<{
    contractId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID;
    contractVersion: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION;
    actionId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_ID;
    executionManifest: unknown;
    authorizationEnvelope: unknown;
    bindingEvidence: unknown;
    hExecutionRequest: unknown;
    currentTimeIso: unknown;
  }>;

export type ControlledProductionRemoteActionStructuralBinding = Readonly<{
  contractId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID;
  contractVersion: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION;
  contractFingerprint: string;
  actionId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_ID;
  executionManifest: ControlledProductionPreflightExecutionManifest;
  authorizationEnvelope: ControlledProductionPreflightAuthorizationEnvelope;
  bindingEvidence: ControlledProductionPreflightBindingEvidence;
  hExecutionRequest: ProductionPreflightHExecutionRequest;
  hActionDescriptor: ProductionPreflightHActionDescriptor;
}>;

export type ControlledProductionRemoteActionStructuralFailureCode =
  | "INVALID_CANDIDATE_SHAPE"
  | "CONTRACT_IDENTITY_MISMATCH"
  | "ACTION_ID_MISMATCH"
  | "C2_MANIFEST_INVALID"
  | "C2_AUTHORIZATION_INVALID"
  | "C2_BINDING_INVALID"
  | "C2_BINDING_EVIDENCE_INVALID"
  | "H_EXECUTION_REQUEST_INVALID"
  | "H_ACTION_BINDING_MISMATCH"
  | "CREDENTIAL_OR_SQL_FIELD_REJECTED";

export type ControlledProductionRemoteActionStructuralResult =
  | Readonly<{
      ok: true;
      value: ControlledProductionRemoteActionStructuralBinding;
    }>
  | Readonly<{
      ok: false;
      failureCode: ControlledProductionRemoteActionStructuralFailureCode;
    }>;

export type ControlledProductionRemoteActionAuthorizationDecision =
  | Readonly<{
      status: "AUTHORIZED";
      reason: "ALL_CANONICAL_BINDINGS_AND_C6C_PERMISSION_VALID";
      contractId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID;
      contractVersion: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION;
      contractFingerprint: string;
      actionId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_ID;
      queryId: ProductionPreflightHQueryIdentity;
      resultContractId: string;
      hExecutorContractFingerprint: string;
      sourceCommit: string;
      artifactFingerprintSetId: string;
      targetFingerprint: string;
      singleAttemptNonceReference: string;
      executionWindowId: string;
      expectedExecutorIdentity: string;
      permissionAuthorityId: typeof CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID;
      permissionId: "AUTHORIZE_REMOTE_EXECUTION";
      permissionValue: true;
      c2BindingValid: true;
      grantsCredentialAccess: false;
    }>
  | Readonly<{
      status: "REJECTED";
      reason:
        | ControlledProductionRemoteActionStructuralFailureCode
        | "REMOTE_EXECUTION_PERMISSION_FALSE";
      contractId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID;
      contractVersion: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION;
      contractFingerprint: string;
      actionId: typeof CONTROLLED_PRODUCTION_REMOTE_ACTION_ID;
      permissionAuthorityId: typeof CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID;
      permissionId: "AUTHORIZE_REMOTE_EXECUTION";
      permissionValue: false;
      c2BindingValid: boolean;
      grantsCredentialAccess: false;
    }>;

const authorizationDecisionProvenance = new WeakSet<object>();
const auditOnlyAuthorizationDecisionProvenance = new WeakSet<object>();

export const isCanonicalControlledProductionRemoteActionAuthorizationDecision = (
  value: unknown,
): value is ControlledProductionRemoteActionAuthorizationDecision =>
  value !== null &&
  typeof value === "object" &&
  authorizationDecisionProvenance.has(value);

export const isAuditOnlyControlledProductionRemoteActionAuthorizationDecision = (
  value: unknown,
): value is Extract<
  ControlledProductionRemoteActionAuthorizationDecision,
  { status: "AUTHORIZED" }
> =>
  value !== null &&
  typeof value === "object" &&
  auditOnlyAuthorizationDecisionProvenance.has(value);

const CANDIDATE_KEYS = Object.freeze([
  "contractId",
  "contractVersion",
  "actionId",
  "executionManifest",
  "authorizationEnvelope",
  "bindingEvidence",
  "hExecutionRequest",
  "currentTimeIso",
]);
const SENSITIVE_OR_UNBOUNDED_KEY =
  /(?:password|secret|token|credential|database|connection|url|uri|sql|querytext|batch|retry|permissionoverride)/i;

const safePlainDataRecord = (
  value: unknown,
  expectedKeys: readonly string[],
): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  let ownKeys: readonly PropertyKey[];
  let descriptors: PropertyDescriptorMap;
  try {
    if (Object.getPrototypeOf(value) !== Object.prototype) return false;
    ownKeys = Reflect.ownKeys(value);
    descriptors = Object.getOwnPropertyDescriptors(value);
  } catch {
    return false;
  }
  if (
    ownKeys.some((key) => typeof key !== "string") ||
    ownKeys.length !== expectedKeys.length ||
    !ownKeys.every((key) => expectedKeys.includes(key as string)) ||
    ownKeys.some(
      (key) =>
        typeof key === "string" &&
        !expectedKeys.includes(key) &&
        SENSITIVE_OR_UNBOUNDED_KEY.test(key),
    )
  ) {
    return false;
  }
  return Object.values(descriptors).every(
    (descriptor) =>
      "value" in descriptor &&
      descriptor.get === undefined &&
      descriptor.set === undefined,
  );
};

const structuralFailure = (
  failureCode: ControlledProductionRemoteActionStructuralFailureCode,
): ControlledProductionRemoteActionStructuralResult =>
  Object.freeze({ ok: false as const, failureCode });

const bindingEvidenceMatches = (
  supplied: ControlledProductionPreflightBindingEvidence,
  derived: ControlledProductionPreflightBindingEvidence,
): boolean =>
  supplied.sourceCommit === derived.sourceCommit &&
  supplied.artifactFingerprintSetId === derived.artifactFingerprintSetId &&
  supplied.targetFingerprint === derived.targetFingerprint &&
  supplied.targetPurpose === derived.targetPurpose &&
  supplied.executionWindowId === derived.executionWindowId &&
  supplied.singleAttemptNonceReference ===
    derived.singleAttemptNonceReference &&
  supplied.operatorEvidenceConfirmed === true &&
  supplied.remoteExecutionSeparatelyAuthorized === true &&
  supplied.bindingFieldCount === 6;

export const validateControlledProductionRemoteActionStructuralBinding = (
  candidate: unknown,
): ControlledProductionRemoteActionStructuralResult => {
  if (!safePlainDataRecord(candidate, CANDIDATE_KEYS)) {
    return structuralFailure("INVALID_CANDIDATE_SHAPE");
  }
  if (
    candidate.contractId !==
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID ||
    candidate.contractVersion !==
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION
  ) {
    return structuralFailure("CONTRACT_IDENTITY_MISMATCH");
  }
  if (candidate.actionId !== CONTROLLED_PRODUCTION_REMOTE_ACTION_ID) {
    return structuralFailure("ACTION_ID_MISMATCH");
  }

  const executionManifest =
    validateControlledProductionPreflightExecutionManifest(
      candidate.executionManifest,
      candidate.currentTimeIso,
    );
  if (!executionManifest.ok) {
    return structuralFailure("C2_MANIFEST_INVALID");
  }
  const authorizationEnvelope =
    validateControlledProductionPreflightAuthorizationEnvelope(
      candidate.authorizationEnvelope,
    );
  if (!authorizationEnvelope.ok) {
    return structuralFailure("C2_AUTHORIZATION_INVALID");
  }
  const derivedBinding = validateManifestAuthorizationBinding(
    executionManifest.value,
    authorizationEnvelope.value,
  );
  if (!derivedBinding.ok) {
    return structuralFailure("C2_BINDING_INVALID");
  }
  if (
    !isValidatedControlledProductionPreflightBindingEvidence(
      candidate.bindingEvidence,
    ) ||
    !bindingEvidenceMatches(candidate.bindingEvidence, derivedBinding.value)
  ) {
    return structuralFailure("C2_BINDING_EVIDENCE_INVALID");
  }

  const hRequest = validateProductionPreflightHExecutionRequest(
    candidate.hExecutionRequest,
  );
  if (!hRequest.ok) {
    return structuralFailure("H_EXECUTION_REQUEST_INVALID");
  }
  if (
    hRequest.value.targetFingerprint !==
      executionManifest.value.targetFingerprint ||
    hRequest.value.executorIdentity !==
      executionManifest.value.expectedExecutorIdentity ||
    hRequest.value.authorizationReference !==
      fingerprintAuthorizationEnvelope(authorizationEnvelope.value)
  ) {
    return structuralFailure("H_ACTION_BINDING_MISMATCH");
  }
  const hActionDescriptor = createProductionPreflightHActionDescriptor(
    hRequest.value,
  );

  return Object.freeze({
    ok: true as const,
    value: Object.freeze({
      contractId:
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
      contractVersion:
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
      contractFingerprint:
        CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT,
      actionId: CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
      executionManifest: executionManifest.value,
      authorizationEnvelope: authorizationEnvelope.value,
      bindingEvidence: derivedBinding.value,
      hExecutionRequest: hRequest.value,
      hActionDescriptor,
    }),
  });
};

const rejectedDecision = (
  reason:
    | ControlledProductionRemoteActionStructuralFailureCode
    | "REMOTE_EXECUTION_PERMISSION_FALSE",
  c2BindingValid: boolean,
): ControlledProductionRemoteActionAuthorizationDecision => {
  const decision = Object.freeze({
    status: "REJECTED" as const,
    reason,
    contractId:
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_ID,
    contractVersion:
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_VERSION,
    contractFingerprint:
      CONTROLLED_PRODUCTION_REMOTE_ACTION_AUTHORIZATION_CONTRACT_FINGERPRINT,
    actionId: CONTROLLED_PRODUCTION_REMOTE_ACTION_ID,
    permissionAuthorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    permissionId: "AUTHORIZE_REMOTE_EXECUTION" as const,
    permissionValue: false as const,
    c2BindingValid,
    grantsCredentialAccess: false as const,
  });
  authorizationDecisionProvenance.add(decision);
  return decision;
};

export const evaluateControlledProductionRemoteActionAuthorization = (
  candidate: unknown,
): ControlledProductionRemoteActionAuthorizationDecision => {
  const structural =
    validateControlledProductionRemoteActionStructuralBinding(candidate);
  if (!structural.ok) {
    return rejectedDecision(structural.failureCode, false);
  }
  const canonicalPermissionState =
    createFailClosedControlledProductionPermissionState();
  if (canonicalPermissionState.AUTHORIZE_REMOTE_EXECUTION !== true) {
    return rejectedDecision("REMOTE_EXECUTION_PERMISSION_FALSE", true);
  }

  const binding = structural.value;
  const decision = Object.freeze({
    status: "AUTHORIZED" as const,
    reason: "ALL_CANONICAL_BINDINGS_AND_C6C_PERMISSION_VALID" as const,
    contractId: binding.contractId,
    contractVersion: binding.contractVersion,
    contractFingerprint: binding.contractFingerprint,
    actionId: binding.actionId,
    queryId: binding.hActionDescriptor.queryId,
    resultContractId: binding.hActionDescriptor.resultContractId,
    hExecutorContractFingerprint:
      binding.hActionDescriptor.contractFingerprint,
    sourceCommit: binding.executionManifest.sourceCommit,
    artifactFingerprintSetId:
      binding.executionManifest.artifactFingerprintSet
        .artifactFingerprintSetId,
    targetFingerprint: binding.executionManifest.targetFingerprint,
    singleAttemptNonceReference:
      binding.executionManifest.singleAttemptNonceReference,
    executionWindowId:
      binding.executionManifest.executionWindow.executionWindowId,
    expectedExecutorIdentity:
      binding.executionManifest.expectedExecutorIdentity,
    permissionAuthorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    permissionId: "AUTHORIZE_REMOTE_EXECUTION" as const,
    permissionValue: true as const,
    c2BindingValid: true as const,
    grantsCredentialAccess: false as const,
  });
  authorizationDecisionProvenance.add(decision);
  return decision;
};

/**
 * AUDIT_ONLY: derives a provenance-recognized positive fixture from the same
 * structural evaluator without changing or overriding canonical C6C state.
 */
export const createAuditOnlyAuthorizedRemoteActionDecision = (
  candidate: unknown,
): Extract<
  ControlledProductionRemoteActionAuthorizationDecision,
  { status: "AUTHORIZED" }
> | null => {
  const structural =
    validateControlledProductionRemoteActionStructuralBinding(candidate);
  if (!structural.ok) return null;
  const binding = structural.value;
  const decision = Object.freeze({
    status: "AUTHORIZED" as const,
    reason: "ALL_CANONICAL_BINDINGS_AND_C6C_PERMISSION_VALID" as const,
    contractId: binding.contractId,
    contractVersion: binding.contractVersion,
    contractFingerprint: binding.contractFingerprint,
    actionId: binding.actionId,
    queryId: binding.hActionDescriptor.queryId,
    resultContractId: binding.hActionDescriptor.resultContractId,
    hExecutorContractFingerprint:
      binding.hActionDescriptor.contractFingerprint,
    sourceCommit: binding.executionManifest.sourceCommit,
    artifactFingerprintSetId:
      binding.executionManifest.artifactFingerprintSet
        .artifactFingerprintSetId,
    targetFingerprint: binding.executionManifest.targetFingerprint,
    singleAttemptNonceReference:
      binding.executionManifest.singleAttemptNonceReference,
    executionWindowId:
      binding.executionManifest.executionWindow.executionWindowId,
    expectedExecutorIdentity:
      binding.executionManifest.expectedExecutorIdentity,
    permissionAuthorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
    permissionId: "AUTHORIZE_REMOTE_EXECUTION" as const,
    permissionValue: true as const,
    c2BindingValid: true as const,
    grantsCredentialAccess: false as const,
  });
  auditOnlyAuthorizationDecisionProvenance.add(decision);
  return decision;
};
