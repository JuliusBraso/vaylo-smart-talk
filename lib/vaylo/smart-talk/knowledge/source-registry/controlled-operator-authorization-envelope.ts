import "server-only";

import {
  isControlledPreflightApprovalActor,
  isControlledPreflightOperatorActor,
  isValidControlledPreflightOperatorApproverPair,
} from "./controlled-preflight-actor-authority";
import {
  isUntrustedProxy,
} from "./controlled-preflight-launcher-capability-contract";
import {
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  CONTROLLED_PRODUCTION_PERMISSION_IDS,
  type ControlledProductionPermissionState,
  verifyAllControlledProductionPermissionsFalse,
} from "./controlled-production-permission-authority";
import { verifyControlledSyntheticFixedClockBinding } from "./controlled-synthetic-fixed-clock-policy";

export const CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE = Object.freeze({
  contractId: "VAYLO_CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE",
  version: 1,
  authorizationClass: "C6_SYNTHETIC_OPERATOR_INVOCATION_ONLY",
  executionScope: "SYNTHETIC_LOCAL_ONLY",
  requestedAction: "REQUEST_ONE_C5_SYNTHETIC_LAUNCH",
  c6SourceCheckpointCommit: "76e3e5c312cca27a9f28e5e5c5ae6d8d4e1458c9",
  c5BoundCheckpointCommit: "9993d2ad6ed5f8de5546edc95c4e702abac38414",
  requestedLaunchCount: 1,
  productionCapabilityCount: 0,
} as const);

export type ControlledOperatorAuthorizationFailureCode =
  | "INVALID_ENVELOPE_SHAPE"
  | "INVALID_CURRENT_EVIDENCE_SHAPE"
  | "CONTRACT_IDENTITY_MISMATCH"
  | "SOURCE_CHECKPOINT_MISMATCH"
  | "C5_CHECKPOINT_MISMATCH"
  | "ACTOR_AUTHORITY_MISMATCH"
  | "SELF_AUTHORIZATION_REJECTED"
  | "FIXED_CLOCK_BINDING_REJECTED"
  | "NONCE_DIGEST_INVALID"
  | "NONCE_DIGEST_MISMATCH"
  | "PRODUCTION_PERMISSION_STATE_REJECTED"
  | "PRODUCTION_PERMISSION_BINDING_MISMATCH"
  | "C1_C3_BOUNDARY_EVIDENCE_REJECTED"
  | "REQUEST_SCOPE_REJECTED";

export type ControlledOperatorAuthorizationBoundaryEvidence = Readonly<{
  backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED";
  backupRecoveryVerifiedNow: false;
  productionCredentialAccessed: false;
  remoteConnectionPerformed: false;
  productionReadOnlyPreflightExecutedNow: false;
  firstProductionWritePerformed: false;
}>;

export type ControlledOperatorAuthorizationEnvelope = Readonly<{
  contractId: string;
  version: number;
  authorizationClass: string;
  executionScope: string;
  requestedAction: string;
  c6SourceCheckpointCommit: string;
  c5BoundCheckpointCommit: string;
  operatorActorId: string;
  authorizationIssuerActorId: string;
  fixedClockSnapshot: string;
  nonceDigest: string;
  productionPermissionState: ControlledProductionPermissionState;
  boundaryEvidence: ControlledOperatorAuthorizationBoundaryEvidence;
  requestedLaunchCount: number;
}>;

export type ControlledOperatorAuthorizationCurrentEvidence = Readonly<{
  c6SourceCheckpointCommit: string;
  c5BoundCheckpointCommit: string;
  operatorActorId: string;
  authorizationIssuerActorId: string;
  fixedClockSnapshot: string;
  nonceDigest: string;
  productionPermissionState: ControlledProductionPermissionState;
  boundaryEvidence: ControlledOperatorAuthorizationBoundaryEvidence;
}>;

export type ControlledOperatorAuthorizationEvaluation =
  | Readonly<{
      ok: true;
      syntheticLaunchRequestAuthorized: true;
      requestedAction: "REQUEST_ONE_C5_SYNTHETIC_LAUNCH";
      requestedLaunchCount: 1;
      c5LauncherInvocationPerformed: false;
      syntheticLaunchPerformed: false;
      remoteExecutionPerformed: false;
      productionConnectionPerformed: false;
      productionReadOnlyPreflightExecutedNow: false;
      productionWritePerformed: false;
      productionRuntimeAuthorized: false;
      publicLaunchAuthorized: false;
    }>
  | Readonly<{
      ok: false;
      syntheticLaunchRequestAuthorized: false;
      failureCode: ControlledOperatorAuthorizationFailureCode;
    }>;

const ENVELOPE_KEYS = Object.freeze([
  "contractId",
  "version",
  "authorizationClass",
  "executionScope",
  "requestedAction",
  "c6SourceCheckpointCommit",
  "c5BoundCheckpointCommit",
  "operatorActorId",
  "authorizationIssuerActorId",
  "fixedClockSnapshot",
  "nonceDigest",
  "productionPermissionState",
  "boundaryEvidence",
  "requestedLaunchCount",
] as const);

const EVIDENCE_KEYS = Object.freeze([
  "c6SourceCheckpointCommit",
  "c5BoundCheckpointCommit",
  "operatorActorId",
  "authorizationIssuerActorId",
  "fixedClockSnapshot",
  "nonceDigest",
  "productionPermissionState",
  "boundaryEvidence",
] as const);

const BOUNDARY_KEYS = Object.freeze([
  "backupRecoveryStatus",
  "backupRecoveryVerifiedNow",
  "productionCredentialAccessed",
  "remoteConnectionPerformed",
  "productionReadOnlyPreflightExecutedNow",
  "firstProductionWritePerformed",
] as const);

const nonceDigestIsCanonical = (candidate: unknown): candidate is string =>
  typeof candidate === "string" && /^[a-f0-9]{64}$/.test(candidate);

const inspectClosedPlainDataRecord = (
  candidate: unknown,
  keys: readonly string[],
): Readonly<Record<string, unknown>> | null => {
  if (
    isUntrustedProxy(candidate) ||
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate) ||
    Object.getPrototypeOf(candidate) !== Object.prototype
  ) {
    return null;
  }
  const ownKeys = Reflect.ownKeys(candidate);
  if (
    ownKeys.length !== keys.length ||
    ownKeys.some((key) => typeof key !== "string" || !keys.includes(key))
  ) {
    return null;
  }
  const descriptors = Object.getOwnPropertyDescriptors(candidate);
  const snapshot: Record<string, unknown> = {};
  for (const key of keys) {
    const descriptor = descriptors[key];
    if (
      descriptor === undefined ||
      descriptor.get !== undefined ||
      descriptor.set !== undefined ||
      !("value" in descriptor)
    ) {
      return null;
    }
    snapshot[key] = descriptor.value;
  }
  return Object.freeze(snapshot);
};

const parseBoundaryEvidence = (
  candidate: unknown,
): ControlledOperatorAuthorizationBoundaryEvidence | null => {
  const source = inspectClosedPlainDataRecord(candidate, BOUNDARY_KEYS);
  if (
    source === null ||
    source.backupRecoveryStatus !== "REQUIRED_NOT_YET_VERIFIED" ||
    source.backupRecoveryVerifiedNow !== false ||
    source.productionCredentialAccessed !== false ||
    source.remoteConnectionPerformed !== false ||
    source.productionReadOnlyPreflightExecutedNow !== false ||
    source.firstProductionWritePerformed !== false
  ) {
    return null;
  }
  return Object.freeze({
    backupRecoveryStatus: "REQUIRED_NOT_YET_VERIFIED" as const,
    backupRecoveryVerifiedNow: false as const,
    productionCredentialAccessed: false as const,
    remoteConnectionPerformed: false as const,
    productionReadOnlyPreflightExecutedNow: false as const,
    firstProductionWritePerformed: false as const,
  });
};

const parsePermissionStateSafely = (
  candidate: unknown,
): ControlledProductionPermissionState | null => {
  const source = inspectClosedPlainDataRecord(
    candidate,
    CONTROLLED_PRODUCTION_PERMISSION_IDS,
  );
  if (source === null) return null;
  const safeSnapshot = Object.fromEntries(
    CONTROLLED_PRODUCTION_PERMISSION_IDS.map((permissionId) => [
      permissionId,
      source[permissionId],
    ]),
  );
  const verified = verifyAllControlledProductionPermissionsFalse(safeSnapshot);
  return verified.ok ? verified.value : null;
};

const permissionStatesMatch = (
  envelope: ControlledProductionPermissionState,
  evidence: ControlledProductionPermissionState,
): boolean =>
  CONTROLLED_PRODUCTION_PERMISSION_IDS.every(
    (permissionId) => envelope[permissionId] === evidence[permissionId],
  );

const failure = (
  failureCode: ControlledOperatorAuthorizationFailureCode,
): ControlledOperatorAuthorizationEvaluation =>
  Object.freeze({ ok: false as const, syntheticLaunchRequestAuthorized: false as const, failureCode });

export const evaluateControlledOperatorAuthorizationEnvelope = (
  envelopeCandidate: unknown,
  currentEvidenceCandidate: unknown,
): ControlledOperatorAuthorizationEvaluation => {
  const envelopeSource = inspectClosedPlainDataRecord(
    envelopeCandidate,
    ENVELOPE_KEYS,
  );
  if (envelopeSource === null) {
    return failure("INVALID_ENVELOPE_SHAPE");
  }
  const evidenceSource = inspectClosedPlainDataRecord(
    currentEvidenceCandidate,
    EVIDENCE_KEYS,
  );
  if (evidenceSource === null) {
    return failure("INVALID_CURRENT_EVIDENCE_SHAPE");
  }
  const envelopePermissions = parsePermissionStateSafely(
    envelopeSource.productionPermissionState,
  );
  const evidencePermissions = parsePermissionStateSafely(
    evidenceSource.productionPermissionState,
  );
  if (envelopePermissions === null || evidencePermissions === null) {
    return failure("PRODUCTION_PERMISSION_STATE_REJECTED");
  }
  const envelopeBoundary = parseBoundaryEvidence(envelopeSource.boundaryEvidence);
  const evidenceBoundary = parseBoundaryEvidence(evidenceSource.boundaryEvidence);
  if (envelopeBoundary === null || evidenceBoundary === null) {
    return failure("C1_C3_BOUNDARY_EVIDENCE_REJECTED");
  }
  const envelope = Object.freeze({
    ...envelopeSource,
    productionPermissionState: envelopePermissions,
    boundaryEvidence: envelopeBoundary,
  }) as ControlledOperatorAuthorizationEnvelope;
  const evidence = Object.freeze({
    ...evidenceSource,
    productionPermissionState: evidencePermissions,
    boundaryEvidence: evidenceBoundary,
  }) as ControlledOperatorAuthorizationCurrentEvidence;

  if (
    envelope.contractId !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.contractId ||
    envelope.version !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.version ||
    envelope.authorizationClass !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.authorizationClass ||
    envelope.executionScope !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.executionScope ||
    envelope.requestedAction !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedAction ||
    envelope.requestedLaunchCount !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.requestedLaunchCount
  ) {
    return failure("CONTRACT_IDENTITY_MISMATCH");
  }
  if (
    envelope.executionScope !== "SYNTHETIC_LOCAL_ONLY" ||
    envelope.requestedAction !== "REQUEST_ONE_C5_SYNTHETIC_LAUNCH" ||
    envelope.requestedLaunchCount !== 1
  ) {
    return failure("REQUEST_SCOPE_REJECTED");
  }
  if (
    envelope.c6SourceCheckpointCommit !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c6SourceCheckpointCommit ||
    evidence.c6SourceCheckpointCommit !== envelope.c6SourceCheckpointCommit
  ) return failure("SOURCE_CHECKPOINT_MISMATCH");
  if (
    envelope.c5BoundCheckpointCommit !== CONTROLLED_OPERATOR_AUTHORIZATION_ENVELOPE.c5BoundCheckpointCommit ||
    evidence.c5BoundCheckpointCommit !== envelope.c5BoundCheckpointCommit
  ) return failure("C5_CHECKPOINT_MISMATCH");
  if (envelope.operatorActorId === envelope.authorizationIssuerActorId) {
    return failure("SELF_AUTHORIZATION_REJECTED");
  }
  if (
    !isControlledPreflightOperatorActor(envelope.operatorActorId) ||
    !isControlledPreflightApprovalActor(envelope.authorizationIssuerActorId) ||
    !isValidControlledPreflightOperatorApproverPair(envelope.operatorActorId, envelope.authorizationIssuerActorId) ||
    evidence.operatorActorId !== envelope.operatorActorId ||
    evidence.authorizationIssuerActorId !== envelope.authorizationIssuerActorId
  ) return failure("ACTOR_AUTHORITY_MISMATCH");

  if (!verifyControlledSyntheticFixedClockBinding(envelope.fixedClockSnapshot, evidence.fixedClockSnapshot).ok) {
    return failure("FIXED_CLOCK_BINDING_REJECTED");
  }
  if (!nonceDigestIsCanonical(envelope.nonceDigest) || !nonceDigestIsCanonical(evidence.nonceDigest)) {
    return failure("NONCE_DIGEST_INVALID");
  }
  if (envelope.nonceDigest !== evidence.nonceDigest) return failure("NONCE_DIGEST_MISMATCH");

  if (!permissionStatesMatch(envelopePermissions, evidencePermissions)) {
    return failure("PRODUCTION_PERMISSION_BINDING_MISMATCH");
  }
  if (
    BOUNDARY_KEYS.some(
      (key) =>
        envelopeBoundary[key as keyof ControlledOperatorAuthorizationBoundaryEvidence] !==
        evidenceBoundary[key as keyof ControlledOperatorAuthorizationBoundaryEvidence],
    )
  ) return failure("C1_C3_BOUNDARY_EVIDENCE_REJECTED");

  return Object.freeze({
    ok: true as const,
    syntheticLaunchRequestAuthorized: true as const,
    requestedAction: "REQUEST_ONE_C5_SYNTHETIC_LAUNCH" as const,
    requestedLaunchCount: 1 as const,
    c5LauncherInvocationPerformed: false as const,
    syntheticLaunchPerformed: false as const,
    remoteExecutionPerformed: false as const,
    productionConnectionPerformed: false as const,
    productionReadOnlyPreflightExecutedNow: false as const,
    productionWritePerformed: false as const,
    productionRuntimeAuthorized: false as const,
    publicLaunchAuthorized: false as const,
  });
};

export const CONTROLLED_OPERATOR_AUTHORIZATION_PRODUCTION_AUTHORITY = Object.freeze({
  authorityId: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_ID,
  authorityVersion: CONTROLLED_PRODUCTION_PERMISSION_AUTHORITY_VERSION,
  permissionIds: CONTROLLED_PRODUCTION_PERMISSION_IDS,
  productionCapabilityCount: 0,
});
