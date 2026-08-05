import "server-only";

import {
  CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
  EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
  deepFreezeContract,
  isValidatedControlledProductionPreflightAuthorizationEnvelope,
  isValidatedControlledProductionPreflightBindingEvidence,
  isValidatedControlledProductionPreflightExecutionManifest,
  redactTargetFingerprint,
  type ControlledProductionPreflightAuthorizationEnvelope,
  type ControlledProductionPreflightBindingEvidence,
  type ControlledProductionPreflightExecutionManifest,
} from "./controlled-production-preflight-execution-contracts";

export const CONTROLLED_CREDENTIAL_LEASE_KIND =
  "CONTROLLED_PRODUCTION_PREFLIGHT_CREDENTIAL_LEASE" as const;
export const LEASE_STATES = Object.freeze([
  "LEASE_ISSUED",
  "LEASE_ACTIVE",
  "LEASE_RELEASE_REQUESTED",
  "LEASE_RELEASED",
  "LEASE_FAILED",
] as const);
export type LeaseState = (typeof LEASE_STATES)[number];

export const CREDENTIAL_BOUNDARY_ERRORS = Object.freeze([
  "INVALID_CREDENTIAL_REQUEST",
  "MANIFEST_NOT_VALIDATED",
  "AUTHORIZATION_NOT_VALIDATED",
  "BINDING_NOT_VALIDATED",
  "CREDENTIAL_REQUEST_ID_INVALID",
  "CREDENTIAL_LEASE_PROVENANCE_INVALID",
  "CREDENTIAL_LEASE_STATE_INVALID",
  "CREDENTIAL_LEASE_ALREADY_RELEASED",
  "CREDENTIAL_LEASE_RELEASE_FAILED",
  "CREDENTIAL_PROVIDER_UNAVAILABLE",
  "CREDENTIAL_BOUNDARY_UNKNOWN_FAILURE",
  "INVALID_TRANSPORT_REQUEST",
  "TRANSPORT_CONSTRUCTION_ID_INVALID",
  "TRANSPORT_LEASE_BINDING_MISMATCH",
  "TRANSPORT_LEASE_NOT_ACTIVE",
  "TRANSPORT_LEASE_RELEASED",
  "TRANSPORT_LEASE_CREDENTIAL_UNAVAILABLE",
  "TRANSPORT_PROVENANCE_INVALID",
  "TRANSPORT_FACTORY_UNAVAILABLE",
  "TRANSPORT_BOUNDARY_UNKNOWN_FAILURE",
] as const);
export type BoundaryError = (typeof CREDENTIAL_BOUNDARY_ERRORS)[number];
export type BoundaryResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; code: BoundaryError }>;

const REQUEST_ID = /^creq_[a-z0-9-]{7,91}$/;
const CONSTRUCTION_ID = /^tcon_[a-z0-9-]{7,91}$/;

export type CredentialLeasePublicView = Readonly<{
  leaseKind: typeof CONTROLLED_CREDENTIAL_LEASE_KIND;
  leaseId: string;
  leaseState: LeaseState;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSetId: string;
  redactedTargetFingerprint: string;
  targetPurpose: "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT";
  expectedExecutorIdentity: typeof EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY;
  executionWindowId: string;
  credentialAvailable: boolean;
  released: boolean;
}>;
export type LeaseCleanupEvidence = Readonly<{
  leaseId: string;
  releaseRequested: boolean;
  released: boolean;
  credentialAvailable: boolean;
  providerCleanupConfirmed: boolean;
  rawCredentialCleared: boolean;
  safeFailureCode: BoundaryError | null;
}>;
export type CredentialRequest = Readonly<{
  validatedManifest: ControlledProductionPreflightExecutionManifest;
  validatedAuthorization: ControlledProductionPreflightAuthorizationEnvelope;
  validatedBinding: ControlledProductionPreflightBindingEvidence;
  credentialRequestId: string;
}>;
export type TransportFactoryRequest = Readonly<{
  validatedManifest: ControlledProductionPreflightExecutionManifest;
  validatedAuthorization: ControlledProductionPreflightAuthorizationEnvelope;
  validatedBinding: ControlledProductionPreflightBindingEvidence;
  activeCredentialLease: CredentialLeasePublicView;
  transportConstructionId: string;
}>;
export type ControlledPreflightTransport = Readonly<{
  openSession(): Promise<void>;
  verifySafetySettings(settings: unknown): Promise<void>;
  beginReadOnlyTransaction(): Promise<void>;
  executeApprovedQuery(queryId: string): Promise<unknown>;
  commitReadOnlyTransaction(): Promise<void>;
  rollbackReadOnlyTransaction(): Promise<void>;
  close(): Promise<void>;
}>;

export interface ControlledCredentialProvider {
  acquireCredentialLease(input: CredentialRequest): BoundaryResult<CredentialLeasePublicView>;
  releaseCredentialLease(lease: CredentialLeasePublicView): BoundaryResult<LeaseCleanupEvidence>;
}
export interface ControlledTransportFactory {
  createControlledProductionPreflightTransport(
    input: TransportFactoryRequest,
  ): BoundaryResult<ControlledPreflightTransport>;
}

const leaseProvenance = new WeakSet<object>();
const transportProvenance = new WeakSet<object>();
const leaseStates = new WeakMap<object, LeaseState>();

function fail<T>(code: BoundaryError): BoundaryResult<T> {
  return Object.freeze({ ok: false as const, code });
}
function validId(value: unknown, pattern: RegExp): value is string {
  return typeof value === "string" && value.length >= 12 && value.length <= 96 && pattern.test(value);
}
function exactKeys(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actual = Object.keys(value);
  return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
function bindingMatches(
  manifest: ControlledProductionPreflightExecutionManifest,
  authorization: ControlledProductionPreflightAuthorizationEnvelope,
  binding: ControlledProductionPreflightBindingEvidence,
): boolean {
  return (
    binding.sourceCommit === manifest.sourceCommit &&
    binding.artifactFingerprintSetId === manifest.artifactFingerprintSet.artifactFingerprintSetId &&
    binding.targetFingerprint === manifest.targetFingerprint &&
    binding.targetPurpose === manifest.targetPurpose &&
    binding.executionWindowId === manifest.executionWindow.executionWindowId &&
    binding.singleAttemptNonceReference === manifest.singleAttemptNonceReference &&
    authorization.sourceCommit === manifest.sourceCommit &&
    authorization.artifactFingerprintSetId === binding.artifactFingerprintSetId &&
    authorization.targetFingerprint === binding.targetFingerprint &&
    authorization.targetPurpose === binding.targetPurpose &&
    authorization.executionWindowId === binding.executionWindowId &&
    authorization.singleAttemptNonceReference === binding.singleAttemptNonceReference &&
    authorization.operatorEvidenceConfirmed === true &&
    authorization.remoteExecutionSeparatelyAuthorized === true
  );
}

export function validateCredentialRequest(input: unknown): BoundaryResult<CredentialRequest> {
  const keys = ["validatedManifest", "validatedAuthorization", "validatedBinding", "credentialRequestId"];
  if (!exactKeys(input, keys)) return fail("INVALID_CREDENTIAL_REQUEST");
  const value = input as Record<string, unknown>;
  const manifest = value.validatedManifest as ControlledProductionPreflightExecutionManifest;
  const authorization = value.validatedAuthorization as ControlledProductionPreflightAuthorizationEnvelope;
  const binding = value.validatedBinding as ControlledProductionPreflightBindingEvidence;
  if (!isValidatedControlledProductionPreflightExecutionManifest(manifest)) {
    return fail("MANIFEST_NOT_VALIDATED");
  }
  if (!isValidatedControlledProductionPreflightAuthorizationEnvelope(authorization)) {
    return fail("AUTHORIZATION_NOT_VALIDATED");
  }
  if (!isValidatedControlledProductionPreflightBindingEvidence(binding)) {
    return fail("BINDING_NOT_VALIDATED");
  }
  if (!validId(value.credentialRequestId, REQUEST_ID)) return fail("CREDENTIAL_REQUEST_ID_INVALID");
  if (!bindingMatches(manifest, authorization, binding)) return fail("BINDING_NOT_VALIDATED");
  return Object.freeze({ ok: true as const, value: deepFreezeContract(Object.freeze({
    validatedManifest: manifest, validatedAuthorization: authorization, validatedBinding: binding,
    credentialRequestId: value.credentialRequestId,
  })) });
}

export function isControlledCredentialLease(value: unknown): value is CredentialLeasePublicView {
  return !!value && typeof value === "object" && leaseProvenance.has(value as object);
}
export function isControlledTransport(value: unknown): value is ControlledPreflightTransport {
  return !!value && typeof value === "object" && transportProvenance.has(value as object);
}
export function transitionCredentialLease(
  lease: CredentialLeasePublicView,
  next: LeaseState,
): BoundaryResult<CredentialLeasePublicView> {
  if (!isControlledCredentialLease(lease)) return fail("CREDENTIAL_LEASE_PROVENANCE_INVALID");
  const current = leaseStates.get(lease);
  const allowed: Record<LeaseState, readonly LeaseState[]> = {
    LEASE_ISSUED: ["LEASE_ACTIVE", "LEASE_FAILED"],
    LEASE_ACTIVE: ["LEASE_RELEASE_REQUESTED", "LEASE_FAILED"],
    LEASE_RELEASE_REQUESTED: ["LEASE_RELEASED", "LEASE_FAILED"],
    LEASE_RELEASED: [],
    LEASE_FAILED: [],
  };
  if (!current || !allowed[current].includes(next)) return fail("CREDENTIAL_LEASE_STATE_INVALID");
  const updated = deepFreezeContract(Object.freeze({
    ...lease,
    leaseState: next,
    credentialAvailable: next === "LEASE_ACTIVE" || next === "LEASE_RELEASE_REQUESTED",
    released: next === "LEASE_RELEASED",
  }));
  leaseProvenance.add(updated);
  leaseStates.set(updated, next);
  return Object.freeze({ ok: true as const, value: updated });
}

/** SYNTHETIC_VALIDATION_ONLY: no secrets, remote access, or real provider. */
export function createSyntheticCredentialProviderHarness(): ControlledCredentialProvider {
  return Object.freeze({
    acquireCredentialLease(input: CredentialRequest): BoundaryResult<CredentialLeasePublicView> {
      const request = validateCredentialRequest(input);
      if (!request.ok) return request;
      const manifest = request.value.validatedManifest;
      const lease = deepFreezeContract(Object.freeze({
        leaseKind: CONTROLLED_CREDENTIAL_LEASE_KIND,
        leaseId: `lease_${request.value.credentialRequestId.slice(5)}`,
        leaseState: "LEASE_ISSUED" as const,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSetId: manifest.artifactFingerprintSet.artifactFingerprintSetId,
        redactedTargetFingerprint: redactTargetFingerprint(manifest.targetFingerprint),
        targetPurpose: manifest.targetPurpose,
        expectedExecutorIdentity: EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
        executionWindowId: manifest.executionWindow.executionWindowId,
        credentialAvailable: false,
        released: false,
      }));
      leaseProvenance.add(lease); leaseStates.set(lease, "LEASE_ISSUED");
      return Object.freeze({ ok: true as const, value: lease });
    },
    releaseCredentialLease(lease: CredentialLeasePublicView): BoundaryResult<LeaseCleanupEvidence> {
      if (!isControlledCredentialLease(lease)) return fail("CREDENTIAL_LEASE_PROVENANCE_INVALID");
      const state = leaseStates.get(lease);
      if (state === "LEASE_RELEASED") {
        return Object.freeze({ ok: true as const, value: deepFreezeContract(Object.freeze({
          leaseId: lease.leaseId, releaseRequested: true, released: true, credentialAvailable: false,
          providerCleanupConfirmed: true, rawCredentialCleared: false, safeFailureCode: null,
        })) });
      }
      if (state !== "LEASE_RELEASE_REQUESTED") return fail("CREDENTIAL_LEASE_STATE_INVALID");
      const released = transitionCredentialLease(lease, "LEASE_RELEASED");
      if (!released.ok) return fail(released.code);
      return Object.freeze({ ok: true as const, value: deepFreezeContract(Object.freeze({
        leaseId: lease.leaseId, releaseRequested: true, released: true, credentialAvailable: false,
        providerCleanupConfirmed: true, rawCredentialCleared: false, safeFailureCode: null,
      })) });
    },
  });
}

export function validateTransportFactoryRequest(input: unknown): BoundaryResult<TransportFactoryRequest> {
  const keys = ["validatedManifest", "validatedAuthorization", "validatedBinding", "activeCredentialLease", "transportConstructionId"];
  if (!exactKeys(input, keys)) return fail("INVALID_TRANSPORT_REQUEST");
  const value = input as Record<string, unknown>;
  const request = validateCredentialRequest({
    validatedManifest: value.validatedManifest, validatedAuthorization: value.validatedAuthorization,
    validatedBinding: value.validatedBinding, credentialRequestId: "creq_transport-validation-01",
  });
  if (!request.ok) return fail("TRANSPORT_LEASE_BINDING_MISMATCH");
  if (!validId(value.transportConstructionId, CONSTRUCTION_ID)) return fail("TRANSPORT_CONSTRUCTION_ID_INVALID");
  const lease = value.activeCredentialLease;
  if (!isControlledCredentialLease(lease)) return fail("CREDENTIAL_LEASE_PROVENANCE_INVALID");
  const publicLease = lease as CredentialLeasePublicView;
  if (leaseStates.get(publicLease) === "LEASE_RELEASED" || publicLease.released) return fail("TRANSPORT_LEASE_RELEASED");
  if (leaseStates.get(publicLease) !== "LEASE_ACTIVE") return fail("TRANSPORT_LEASE_NOT_ACTIVE");
  if (!publicLease.credentialAvailable) return fail("TRANSPORT_LEASE_CREDENTIAL_UNAVAILABLE");
  const manifest = request.value.validatedManifest;
  if (
    publicLease.sourceCommit !== manifest.sourceCommit ||
    publicLease.artifactFingerprintSetId !== manifest.artifactFingerprintSet.artifactFingerprintSetId ||
    publicLease.redactedTargetFingerprint !== redactTargetFingerprint(manifest.targetFingerprint) ||
    publicLease.targetPurpose !== manifest.targetPurpose ||
    publicLease.expectedExecutorIdentity !== manifest.expectedExecutorIdentity ||
    publicLease.executionWindowId !== manifest.executionWindow.executionWindowId
  ) return fail("TRANSPORT_LEASE_BINDING_MISMATCH");
  return Object.freeze({ ok: true as const, value: deepFreezeContract(Object.freeze({
    validatedManifest: request.value.validatedManifest, validatedAuthorization: request.value.validatedAuthorization,
    validatedBinding: request.value.validatedBinding, activeCredentialLease: publicLease,
    transportConstructionId: value.transportConstructionId,
  })) });
}

/** SYNTHETIC_VALIDATION_ONLY: lifecycle recorder, never a database adapter. */
export function createSyntheticTransportFactoryHarness(): ControlledTransportFactory {
  return Object.freeze({
    createControlledProductionPreflightTransport(
      input: TransportFactoryRequest,
    ): BoundaryResult<ControlledPreflightTransport> {
      const request = validateTransportFactoryRequest(input);
      if (!request.ok) return request;
      const events: string[] = [];
      const transport: ControlledPreflightTransport = deepFreezeContract(Object.freeze({
        async openSession() { events.push("open"); },
        async verifySafetySettings() { events.push("verify"); },
        async beginReadOnlyTransaction() { events.push("begin"); },
        async executeApprovedQuery(queryId: string) {
          if (!/^PROD_PREFLIGHT_[A-Z_]+$/.test(queryId)) throw new Error("APPROVED_QUERY_ID_REQUIRED");
          events.push(`approved:${queryId}`); return Object.freeze({ resultSchemaKey: "SYNTHETIC" });
        },
        async commitReadOnlyTransaction() { events.push("commit"); },
        async rollbackReadOnlyTransaction() { events.push("rollback"); },
        async close() { events.push("close"); },
      }));
      void events;
      transportProvenance.add(transport);
      return Object.freeze({ ok: true as const, value: transport });
    },
  });
}

export const CREDENTIAL_TRANSPORT_BOUNDARY_META = Object.freeze({
  c2ContractTypesReused: true,
  credentialLeaseStateCount: LEASE_STATES.length,
  credentialLeaseTransitionMatrixDefined: true,
  credentialLeaseIssuancePrerequisiteCount: 14,
  transportConstructionPrerequisiteCount: 12,
  factoryLeaseBindingFieldCount: 10,
  secretContainmentBoundaryDefined: true,
  syntheticCredentialProviderHarnessPresent: true,
  syntheticTransportFactoryHarnessPresent: true,
});
