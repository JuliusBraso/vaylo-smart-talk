import "server-only";

import { createHash } from "node:crypto";

export const CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND =
  "CONTROLLED_PRODUCTION_READ_ONLY_PREFLIGHT_EXECUTION" as const;
export const CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION = "1" as const;
export const CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND =
  "PRODUCTION_READ_ONLY_PREFLIGHT_SINGLE_ATTEMPT" as const;
export const CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT = "8a9f3c8" as const;
export const EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY =
  "vaylo_schema_auditor" as const;

export const CONTROLLED_PRODUCTION_PREFLIGHT_TARGET_PURPOSES = Object.freeze([
  "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT",
] as const);
export type ControlledProductionPreflightTargetPurpose =
  (typeof CONTROLLED_PRODUCTION_PREFLIGHT_TARGET_PURPOSES)[number];

export const OPERATOR_ACKNOWLEDGEMENT_IDS = Object.freeze([
  "REPOSITORY_PATH_CONFIRMED",
  "MAIN_BRANCH_CONFIRMED",
  "SOURCE_COMMIT_CONFIRMED",
  "CLEAN_WORKING_TREE_CONFIRMED",
  "ARTIFACT_FINGERPRINTS_CONFIRMED",
  "TARGET_PURPOSE_CONFIRMED",
  "TARGET_FINGERPRINT_CONFIRMED",
  "EXPECTED_EXECUTOR_IDENTITY_CONFIRMED",
  "BACKUP_RECOVERY_EVIDENCE_CONFIRMED",
  "EXECUTION_WINDOW_ACTIVE_CONFIRMED",
  "NONCE_UNUSED_CONFIRMED",
  "REMOTE_EXECUTION_SEPARATELY_AUTHORIZED",
  "BOOTSTRAP_NOT_AUTHORIZED",
  "ROLLBACK_NOT_AUTHORIZED",
  "MIGRATIONS_NOT_AUTHORIZED",
  "RUNTIME_AND_PUBLIC_LAUNCH_NOT_AUTHORIZED",
] as const);
export type OperatorAcknowledgementId =
  (typeof OPERATOR_ACKNOWLEDGEMENT_IDS)[number];

export const COMMITTED_ARTIFACT_IDS = Object.freeze([
  "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER",
  "PRODUCTION_READ_ONLY_PREFLIGHT_IMPLEMENTATION_AUDIT",
  "DISABLED_PRODUCTION_PREFLIGHT_VALIDATION",
  "PRODUCTION_PREFLIGHT_DERIVED_TEST_REGISTRY",
  "PRODUCTION_PREFLIGHT_EXECUTABLE_VALIDATION_MATRIX",
] as const);
export type CommittedArtifactId = (typeof COMMITTED_ARTIFACT_IDS)[number];

export type CommittedArtifactDescriptor = Readonly<{
  artifactId: CommittedArtifactId;
  repositoryPath: string;
  required: true;
  expectedSourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
}>;

export const COMMITTED_ARTIFACT_INVENTORY: readonly CommittedArtifactDescriptor[] =
  Object.freeze([
    Object.freeze({
      artifactId: "PRODUCTION_READ_ONLY_PREFLIGHT_HELPER",
      repositoryPath:
        "lib/vaylo/smart-talk/knowledge/source-registry/production-read-only-preflight-helper.ts",
      required: true as const,
      expectedSourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    }),
    Object.freeze({
      artifactId: "PRODUCTION_READ_ONLY_PREFLIGHT_IMPLEMENTATION_AUDIT",
      repositoryPath:
        "lib/vaylo/smart-talk/knowledge/de/run-production-read-only-preflight-helper-implementation-audit.ts",
      required: true as const,
      expectedSourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    }),
    Object.freeze({
      artifactId: "DISABLED_PRODUCTION_PREFLIGHT_VALIDATION",
      repositoryPath:
        "lib/vaylo/smart-talk/knowledge/de/run-disabled-production-preflight-helper-validation.ts",
      required: true as const,
      expectedSourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    }),
    Object.freeze({
      artifactId: "PRODUCTION_PREFLIGHT_DERIVED_TEST_REGISTRY",
      repositoryPath:
        "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-derived-test-registry-and-tamper-pack.ts",
      required: true as const,
      expectedSourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    }),
    Object.freeze({
      artifactId: "PRODUCTION_PREFLIGHT_EXECUTABLE_VALIDATION_MATRIX",
      repositoryPath:
        "lib/vaylo/smart-talk/knowledge/de/run-production-preflight-executable-validation-matrix.ts",
      required: true as const,
      expectedSourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
    }),
  ]);

export const VALIDATION_ERROR_CODES = Object.freeze([
  "INVALID_INPUT",
  "UNKNOWN_FIELD",
  "MANIFEST_KIND_MISMATCH",
  "MANIFEST_VERSION_MISMATCH",
  "SOURCE_COMMIT_MISMATCH",
  "ARTIFACT_SET_INVALID",
  "ARTIFACT_COUNT_MISMATCH",
  "ARTIFACT_ID_MISMATCH",
  "ARTIFACT_PATH_MISMATCH",
  "FINGERPRINT_INVALID",
  "TARGET_FINGERPRINT_INVALID",
  "TARGET_PURPOSE_INVALID",
  "EXECUTION_WINDOW_INVALID",
  "EXECUTION_WINDOW_NOT_ACTIVE",
  "EXECUTION_WINDOW_TOO_LONG",
  "NONCE_REFERENCE_INVALID",
  "ACKNOWLEDGEMENT_INVENTORY_INVALID",
  "ACKNOWLEDGEMENT_NOT_CONFIRMED",
  "EXECUTOR_IDENTITY_MISMATCH",
  "CONTRACT_FINGERPRINT_COLLISION",
  "AUTHORIZATION_KIND_MISMATCH",
  "AUTHORIZATION_NOT_CONFIRMED",
  "AUTHORIZATION_BINDING_MISMATCH",
  "SECRET_BEARING_FIELD_REJECTED",
] as const);
export type ValidationErrorCode = (typeof VALIDATION_ERROR_CODES)[number];

export type ContractValidationFailure = Readonly<{
  ok: false;
  code: ValidationErrorCode;
  blocker: string;
}>;

export type ContractValidationSuccess<T> = Readonly<{
  ok: true;
  value: T;
}>;

export type ContractValidationResult<T> =
  | ContractValidationSuccess<T>
  | ContractValidationFailure;

// Process-local validation provenance. The stores and their contents are never
// exported, serialized, persisted, or accepted as substitutes for validation.
const normalizedArtifactSetProvenance = new WeakSet<object>();
const normalizedManifestProvenance = new WeakSet<object>();
const normalizedAuthorizationProvenance = new WeakSet<object>();
const normalizedBindingProvenance = new WeakSet<object>();

const SHA256_FINGERPRINT = /^sha256:[0-9a-f]{64}$/;
const TARGET_FINGERPRINT = /^target_sha256:[0-9a-f]{64}$/;
const ARTIFACT_SET_ID = /^afset_[a-z0-9-]{6,90}$/;
const EXECUTION_WINDOW_ID = /^ewin_[a-z0-9-]{6,90}$/;
const NONCE_REFERENCE = /^nonce_[A-Za-z0-9_-]{18,122}$/;
const UTC_ISO =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z$/;
const SENSITIVE_FIELD =
  /^(password|passwd|secret|token|credential|connection|connectionstring|databaseurl|uri|host|hostname|port|servicerole|service_role|accesskey|privatekey|clientsecret|writeauthorization|bootstrapauthorization|rollbackauthorization|reusableauthorization)$/i;

const MAX_WINDOW_MS = 30 * 60 * 1000;
const MIN_WINDOW_MS = 60 * 1000;

function fail(code: ValidationErrorCode): ContractValidationFailure {
  return Object.freeze({
    ok: false as const,
    code,
    blocker:
      code === "AUTHORIZATION_BINDING_MISMATCH" ||
      code === "AUTHORIZATION_KIND_MISMATCH" ||
      code === "AUTHORIZATION_NOT_CONFIRMED"
        ? "BLOCKED — REMOTE PREFLIGHT NOT AUTHORIZED"
        : `BLOCKED — ${code.replaceAll("_", " ")}`,
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasSensitiveUnknownField(
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
): boolean {
  return Object.keys(value).some(
    (key) => !allowed.has(key) && SENSITIVE_FIELD.test(key),
  );
}

function hasUnknownField(
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
): boolean {
  return Object.keys(value).some((key) => !allowed.has(key));
}

export function deepFreezeContract<T>(value: T): T {
  if (value === null || typeof value !== "object") return value;
  if (Object.isFrozen(value)) return value;
  for (const nested of Object.values(value as Record<string, unknown>)) {
    deepFreezeContract(nested);
  }
  return Object.freeze(value);
}

export function isCanonicalSha256Fingerprint(value: unknown): value is string {
  return typeof value === "string" && SHA256_FINGERPRINT.test(value);
}

export function isCanonicalTargetFingerprint(value: unknown): value is string {
  return typeof value === "string" && TARGET_FINGERPRINT.test(value);
}

export function isCanonicalArtifactFingerprintSetId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.length >= 12 &&
    value.length <= 96 &&
    ARTIFACT_SET_ID.test(value) &&
    !/[/:\\]/.test(value) &&
    !/\s/.test(value)
  );
}

export function isCanonicalExecutionWindowId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 12 &&
    value.length <= 96 &&
    EXECUTION_WINDOW_ID.test(value)
  );
}

export function isCanonicalNonceReference(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= 24 &&
    value.length <= 128 &&
    NONCE_REFERENCE.test(value) &&
    !/[/:\\]/.test(value) &&
    !/\s/.test(value)
  );
}

export function redactTargetFingerprint(value: string): string {
  if (!isCanonicalTargetFingerprint(value)) return "target_sha256:REDACTED";
  const body = value.slice("target_sha256:".length);
  return `target_sha256:${body.slice(0, 8)}...REDACTED...${body.slice(-6)}`;
}

function parseUtcIso(value: unknown): number | null {
  if (typeof value !== "string" || !UTC_ISO.test(value)) return null;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return null;
  const normalized = new Date(parsed).toISOString();
  if (value.includes(".")) {
    if (normalized !== value) return null;
  } else {
    const withoutMs = normalized.replace(/\.\d{3}Z$/, "Z");
    if (withoutMs !== value) return null;
  }
  return parsed;
}

export type ControlledProductionPreflightArtifactFingerprintEntry = Readonly<{
  artifactId: CommittedArtifactId;
  repositoryPath: string;
  fingerprint: string;
}>;

export type ControlledProductionPreflightArtifactFingerprintSet = Readonly<{
  artifactFingerprintSetId: string;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifacts: readonly ControlledProductionPreflightArtifactFingerprintEntry[];
}>;

export function isValidatedControlledProductionPreflightArtifactFingerprintSet(
  value: unknown,
): value is ControlledProductionPreflightArtifactFingerprintSet {
  return (
    !!value &&
    typeof value === "object" &&
    normalizedArtifactSetProvenance.has(value as object)
  );
}

const ARTIFACT_SET_FIELDS = new Set([
  "artifactFingerprintSetId",
  "sourceCommit",
  "artifacts",
]);

export function validateControlledProductionPreflightArtifactFingerprintSet(
  input: unknown,
): ContractValidationResult<ControlledProductionPreflightArtifactFingerprintSet> {
  if (!isPlainObject(input)) return fail("INVALID_INPUT");
  if (hasSensitiveUnknownField(input, ARTIFACT_SET_FIELDS)) {
    return fail("SECRET_BEARING_FIELD_REJECTED");
  }
  if (hasUnknownField(input, ARTIFACT_SET_FIELDS)) return fail("UNKNOWN_FIELD");
  if (!isCanonicalArtifactFingerprintSetId(input.artifactFingerprintSetId)) {
    return fail("ARTIFACT_SET_INVALID");
  }
  if (input.sourceCommit !== CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT) {
    return fail("SOURCE_COMMIT_MISMATCH");
  }
  if (!Array.isArray(input.artifacts)) return fail("ARTIFACT_SET_INVALID");
  if (input.artifacts.length !== COMMITTED_ARTIFACT_INVENTORY.length) {
    return fail("ARTIFACT_COUNT_MISMATCH");
  }

  const byId = new Map<string, ControlledProductionPreflightArtifactFingerprintEntry>();
  for (const entry of input.artifacts) {
    if (!isPlainObject(entry)) return fail("ARTIFACT_SET_INVALID");
    const allowed = new Set(["artifactId", "repositoryPath", "fingerprint"]);
    if (hasSensitiveUnknownField(entry, allowed)) {
      return fail("SECRET_BEARING_FIELD_REJECTED");
    }
    if (hasUnknownField(entry, allowed)) return fail("UNKNOWN_FIELD");
    if (
      typeof entry.artifactId !== "string" ||
      !(COMMITTED_ARTIFACT_IDS as readonly string[]).includes(entry.artifactId)
    ) {
      return fail("ARTIFACT_ID_MISMATCH");
    }
    if (byId.has(entry.artifactId)) return fail("ARTIFACT_ID_MISMATCH");
    const expected = COMMITTED_ARTIFACT_INVENTORY.find(
      (item) => item.artifactId === entry.artifactId,
    );
    if (!expected || entry.repositoryPath !== expected.repositoryPath) {
      return fail("ARTIFACT_PATH_MISMATCH");
    }
    if (!isCanonicalSha256Fingerprint(entry.fingerprint)) {
      return fail("FINGERPRINT_INVALID");
    }
    byId.set(
      entry.artifactId,
      Object.freeze({
        artifactId: entry.artifactId as CommittedArtifactId,
        repositoryPath: expected.repositoryPath,
        fingerprint: entry.fingerprint,
      }),
    );
  }

  const artifacts = COMMITTED_ARTIFACT_INVENTORY.map((descriptor) => {
    const entry = byId.get(descriptor.artifactId);
    if (!entry) throw new Error("ARTIFACT_SET_INTERNAL");
    return entry;
  });

  const normalized = deepFreezeContract(
    Object.freeze({
      artifactFingerprintSetId: input.artifactFingerprintSetId,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifacts: Object.freeze(artifacts),
    }),
  );
  normalizedArtifactSetProvenance.add(normalized);
  return Object.freeze({ ok: true as const, value: normalized });
}

export type ControlledProductionPreflightExecutionWindow = Readonly<{
  executionWindowId: string;
  notBeforeIso: string;
  expiresAtIso: string;
}>;

const WINDOW_FIELDS = new Set([
  "executionWindowId",
  "notBeforeIso",
  "expiresAtIso",
]);

export function validateControlledProductionPreflightExecutionWindow(
  input: unknown,
  currentTimeIso: unknown,
): ContractValidationResult<ControlledProductionPreflightExecutionWindow> {
  if (!isPlainObject(input)) return fail("INVALID_INPUT");
  if (hasSensitiveUnknownField(input, WINDOW_FIELDS)) {
    return fail("SECRET_BEARING_FIELD_REJECTED");
  }
  if (hasUnknownField(input, WINDOW_FIELDS)) return fail("UNKNOWN_FIELD");
  if (!isCanonicalExecutionWindowId(input.executionWindowId)) {
    return fail("EXECUTION_WINDOW_INVALID");
  }
  const notBefore = parseUtcIso(input.notBeforeIso);
  const expiresAt = parseUtcIso(input.expiresAtIso);
  const current = parseUtcIso(currentTimeIso);
  if (notBefore === null || expiresAt === null || current === null) {
    return fail("EXECUTION_WINDOW_INVALID");
  }
  if (!(notBefore < expiresAt)) return fail("EXECUTION_WINDOW_INVALID");
  const duration = expiresAt - notBefore;
  if (duration < MIN_WINDOW_MS) return fail("EXECUTION_WINDOW_INVALID");
  if (duration > MAX_WINDOW_MS) return fail("EXECUTION_WINDOW_TOO_LONG");
  // Interval: notBeforeIso <= currentTimeIso < expiresAtIso
  if (!(notBefore <= current && current < expiresAt)) {
    return fail("EXECUTION_WINDOW_NOT_ACTIVE");
  }
  return Object.freeze({
    ok: true as const,
    value: deepFreezeContract(
      Object.freeze({
        executionWindowId: input.executionWindowId,
        notBeforeIso: input.notBeforeIso as string,
        expiresAtIso: input.expiresAtIso as string,
      }),
    ),
  });
}

export type ControlledProductionPreflightOperatorAcknowledgement = Readonly<{
  acknowledgementId: OperatorAcknowledgementId;
  confirmed: true;
}>;

export function validateOperatorAcknowledgements(
  input: unknown,
): ContractValidationResult<
  readonly ControlledProductionPreflightOperatorAcknowledgement[]
> {
  if (!Array.isArray(input)) return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
  if (input.length !== OPERATOR_ACKNOWLEDGEMENT_IDS.length) {
    return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
  }
  const seen = new Set<string>();
  const normalized: ControlledProductionPreflightOperatorAcknowledgement[] = [];
  for (const item of input) {
    if (!isPlainObject(item)) return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
    const allowed = new Set(["acknowledgementId", "confirmed"]);
    if (hasSensitiveUnknownField(item, allowed)) {
      return fail("SECRET_BEARING_FIELD_REJECTED");
    }
    if (hasUnknownField(item, allowed)) return fail("UNKNOWN_FIELD");
    if (
      typeof item.acknowledgementId !== "string" ||
      !(OPERATOR_ACKNOWLEDGEMENT_IDS as readonly string[]).includes(
        item.acknowledgementId,
      )
    ) {
      return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
    }
    if (seen.has(item.acknowledgementId)) {
      return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
    }
    seen.add(item.acknowledgementId);
    if (item.confirmed !== true) return fail("ACKNOWLEDGEMENT_NOT_CONFIRMED");
    normalized.push(
      Object.freeze({
        acknowledgementId: item.acknowledgementId as OperatorAcknowledgementId,
        confirmed: true as const,
      }),
    );
  }
  for (const id of OPERATOR_ACKNOWLEDGEMENT_IDS) {
    if (!seen.has(id)) return fail("ACKNOWLEDGEMENT_INVENTORY_INVALID");
  }
  const ordered = OPERATOR_ACKNOWLEDGEMENT_IDS.map((id) => {
    const item = normalized.find((entry) => entry.acknowledgementId === id);
    if (!item) throw new Error("ACK_INTERNAL");
    return item;
  });
  return Object.freeze({
    ok: true as const,
    value: deepFreezeContract(Object.freeze(ordered)),
  });
}

export type ControlledProductionPreflightExecutionManifest = Readonly<{
  manifestKind: typeof CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND;
  manifestVersion: typeof CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSet: ControlledProductionPreflightArtifactFingerprintSet;
  targetFingerprint: string;
  targetPurpose: ControlledProductionPreflightTargetPurpose;
  executionWindow: ControlledProductionPreflightExecutionWindow;
  singleAttemptNonceReference: string;
  canonicalQueryRegistryFingerprint: string;
  canonicalExecutionOrderFingerprint: string;
  safetySettingsFingerprint: string;
  expectedExecutorIdentity: typeof EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY;
  operatorAcknowledgements: readonly ControlledProductionPreflightOperatorAcknowledgement[];
}>;

export function isValidatedControlledProductionPreflightExecutionManifest(
  value: unknown,
): value is ControlledProductionPreflightExecutionManifest {
  return (
    !!value &&
    typeof value === "object" &&
    normalizedManifestProvenance.has(value as object)
  );
}

const MANIFEST_FIELDS = new Set([
  "manifestKind",
  "manifestVersion",
  "sourceCommit",
  "artifactFingerprintSet",
  "targetFingerprint",
  "targetPurpose",
  "executionWindow",
  "singleAttemptNonceReference",
  "canonicalQueryRegistryFingerprint",
  "canonicalExecutionOrderFingerprint",
  "safetySettingsFingerprint",
  "expectedExecutorIdentity",
  "operatorAcknowledgements",
]);

export function validateControlledProductionPreflightExecutionManifest(
  input: unknown,
  currentTimeIso: unknown,
): ContractValidationResult<ControlledProductionPreflightExecutionManifest> {
  if (!isPlainObject(input)) return fail("INVALID_INPUT");
  if (hasSensitiveUnknownField(input, MANIFEST_FIELDS)) {
    return fail("SECRET_BEARING_FIELD_REJECTED");
  }
  if (hasUnknownField(input, MANIFEST_FIELDS)) return fail("UNKNOWN_FIELD");
  if (input.manifestKind !== CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND) {
    return fail("MANIFEST_KIND_MISMATCH");
  }
  if (
    input.manifestVersion !== CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION
  ) {
    return fail("MANIFEST_VERSION_MISMATCH");
  }
  if (input.sourceCommit !== CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT) {
    return fail("SOURCE_COMMIT_MISMATCH");
  }
  const artifactSet = validateControlledProductionPreflightArtifactFingerprintSet(
    input.artifactFingerprintSet,
  );
  if (!artifactSet.ok) return artifactSet;
  if (!isCanonicalTargetFingerprint(input.targetFingerprint)) {
    return fail("TARGET_FINGERPRINT_INVALID");
  }
  if (
    input.targetPurpose !==
    "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT"
  ) {
    return fail("TARGET_PURPOSE_INVALID");
  }
  const window = validateControlledProductionPreflightExecutionWindow(
    input.executionWindow,
    currentTimeIso,
  );
  if (!window.ok) return window;
  if (!isCanonicalNonceReference(input.singleAttemptNonceReference)) {
    return fail("NONCE_REFERENCE_INVALID");
  }
  if (
    !isCanonicalSha256Fingerprint(input.canonicalQueryRegistryFingerprint) ||
    !isCanonicalSha256Fingerprint(input.canonicalExecutionOrderFingerprint) ||
    !isCanonicalSha256Fingerprint(input.safetySettingsFingerprint)
  ) {
    return fail("FINGERPRINT_INVALID");
  }
  const contractFingerprints = [
    input.canonicalQueryRegistryFingerprint,
    input.canonicalExecutionOrderFingerprint,
    input.safetySettingsFingerprint,
  ];
  if (new Set(contractFingerprints).size !== 3) {
    return fail("CONTRACT_FINGERPRINT_COLLISION");
  }
  if (
    input.expectedExecutorIdentity !==
    EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY
  ) {
    return fail("EXECUTOR_IDENTITY_MISMATCH");
  }
  const acknowledgements = validateOperatorAcknowledgements(
    input.operatorAcknowledgements,
  );
  if (!acknowledgements.ok) return acknowledgements;

  const normalized = deepFreezeContract(
    Object.freeze({
        manifestKind: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_KIND,
        manifestVersion: CONTROLLED_PRODUCTION_PREFLIGHT_MANIFEST_VERSION,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSet: artifactSet.value,
        targetFingerprint: input.targetFingerprint,
        targetPurpose:
          "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT" as const,
        executionWindow: window.value,
        singleAttemptNonceReference: input.singleAttemptNonceReference,
        canonicalQueryRegistryFingerprint:
          input.canonicalQueryRegistryFingerprint,
        canonicalExecutionOrderFingerprint:
          input.canonicalExecutionOrderFingerprint,
        safetySettingsFingerprint: input.safetySettingsFingerprint,
        expectedExecutorIdentity:
          EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
        operatorAcknowledgements: acknowledgements.value,
    }),
  );
  normalizedManifestProvenance.add(normalized);
  return Object.freeze({ ok: true as const, value: normalized });
}

export type ControlledProductionPreflightAuthorizationEnvelope = Readonly<{
  authorizationKind: typeof CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSetId: string;
  targetFingerprint: string;
  targetPurpose: ControlledProductionPreflightTargetPurpose;
  executionWindowId: string;
  singleAttemptNonceReference: string;
  operatorEvidenceConfirmed: true;
  remoteExecutionSeparatelyAuthorized: true;
}>;

export function isValidatedControlledProductionPreflightAuthorizationEnvelope(
  value: unknown,
): value is ControlledProductionPreflightAuthorizationEnvelope {
  return (
    !!value &&
    typeof value === "object" &&
    normalizedAuthorizationProvenance.has(value as object)
  );
}

const AUTHORIZATION_FIELDS = new Set([
  "authorizationKind",
  "sourceCommit",
  "artifactFingerprintSetId",
  "targetFingerprint",
  "targetPurpose",
  "executionWindowId",
  "singleAttemptNonceReference",
  "operatorEvidenceConfirmed",
  "remoteExecutionSeparatelyAuthorized",
]);

export function validateControlledProductionPreflightAuthorizationEnvelope(
  input: unknown,
): ContractValidationResult<ControlledProductionPreflightAuthorizationEnvelope> {
  if (!isPlainObject(input)) return fail("INVALID_INPUT");
  if (hasSensitiveUnknownField(input, AUTHORIZATION_FIELDS)) {
    return fail("SECRET_BEARING_FIELD_REJECTED");
  }
  if (hasUnknownField(input, AUTHORIZATION_FIELDS)) return fail("UNKNOWN_FIELD");
  if (
    input.authorizationKind !==
    CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND
  ) {
    return fail("AUTHORIZATION_KIND_MISMATCH");
  }
  if (input.sourceCommit !== CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT) {
    return fail("SOURCE_COMMIT_MISMATCH");
  }
  if (!isCanonicalArtifactFingerprintSetId(input.artifactFingerprintSetId)) {
    return fail("ARTIFACT_SET_INVALID");
  }
  if (!isCanonicalTargetFingerprint(input.targetFingerprint)) {
    return fail("TARGET_FINGERPRINT_INVALID");
  }
  if (
    input.targetPurpose !==
    "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT"
  ) {
    return fail("TARGET_PURPOSE_INVALID");
  }
  if (!isCanonicalExecutionWindowId(input.executionWindowId)) {
    return fail("EXECUTION_WINDOW_INVALID");
  }
  if (!isCanonicalNonceReference(input.singleAttemptNonceReference)) {
    return fail("NONCE_REFERENCE_INVALID");
  }
  if (
    input.operatorEvidenceConfirmed !== true ||
    input.remoteExecutionSeparatelyAuthorized !== true
  ) {
    return fail("AUTHORIZATION_NOT_CONFIRMED");
  }
  const normalized = deepFreezeContract(
    Object.freeze({
        authorizationKind: CONTROLLED_PRODUCTION_PREFLIGHT_AUTHORIZATION_KIND,
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSetId: input.artifactFingerprintSetId,
        targetFingerprint: input.targetFingerprint,
        targetPurpose:
          "CONTROLLED_PRODUCTION_SCHEMA_AUDIT_PREFLIGHT" as const,
        executionWindowId: input.executionWindowId,
        singleAttemptNonceReference: input.singleAttemptNonceReference,
        operatorEvidenceConfirmed: true as const,
        remoteExecutionSeparatelyAuthorized: true as const,
    }),
  );
  normalizedAuthorizationProvenance.add(normalized);
  return Object.freeze({ ok: true as const, value: normalized });
}

export type ControlledProductionPreflightBindingEvidence = Readonly<{
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSetId: string;
  targetFingerprint: string;
  targetPurpose: ControlledProductionPreflightTargetPurpose;
  executionWindowId: string;
  singleAttemptNonceReference: string;
  operatorEvidenceConfirmed: true;
  remoteExecutionSeparatelyAuthorized: true;
  bindingFieldCount: 6;
}>;

export function isValidatedControlledProductionPreflightBindingEvidence(
  value: unknown,
): value is ControlledProductionPreflightBindingEvidence {
  return (
    !!value &&
    typeof value === "object" &&
    normalizedBindingProvenance.has(value as object)
  );
}

export function validateManifestAuthorizationBinding(
  manifest: ControlledProductionPreflightExecutionManifest,
  authorization: ControlledProductionPreflightAuthorizationEnvelope,
): ContractValidationResult<ControlledProductionPreflightBindingEvidence> {
  if (
    manifest.sourceCommit !== authorization.sourceCommit ||
    manifest.artifactFingerprintSet.artifactFingerprintSetId !==
      authorization.artifactFingerprintSetId ||
    manifest.targetFingerprint !== authorization.targetFingerprint ||
    manifest.targetPurpose !== authorization.targetPurpose ||
    manifest.executionWindow.executionWindowId !==
      authorization.executionWindowId ||
    manifest.singleAttemptNonceReference !==
      authorization.singleAttemptNonceReference ||
    authorization.operatorEvidenceConfirmed !== true ||
    authorization.remoteExecutionSeparatelyAuthorized !== true
  ) {
    return fail("AUTHORIZATION_BINDING_MISMATCH");
  }
  const normalized = deepFreezeContract(
    Object.freeze({
        sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
        artifactFingerprintSetId:
          manifest.artifactFingerprintSet.artifactFingerprintSetId,
        targetFingerprint: manifest.targetFingerprint,
        targetPurpose: manifest.targetPurpose,
        executionWindowId: manifest.executionWindow.executionWindowId,
        singleAttemptNonceReference: manifest.singleAttemptNonceReference,
        operatorEvidenceConfirmed: true as const,
        remoteExecutionSeparatelyAuthorized: true as const,
        bindingFieldCount: 6 as const,
    }),
  );
  normalizedBindingProvenance.add(normalized);
  return Object.freeze({ ok: true as const, value: normalized });
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | readonly JsonValue[] | { readonly [k: string]: JsonValue };

function assertJsonSafe(value: unknown, seen: WeakSet<object>): JsonValue {
  if (value === null) return null;
  const kind = typeof value;
  if (kind === "string" || kind === "number" || kind === "boolean") {
    if (kind === "number" && !Number.isFinite(value as number)) {
      throw new Error("UNSUPPORTED_JSON");
    }
    return value as JsonPrimitive;
  }
  if (kind === "undefined" || kind === "function" || kind === "symbol" || kind === "bigint") {
    throw new Error("UNSUPPORTED_JSON");
  }
  if (typeof value !== "object") throw new Error("UNSUPPORTED_JSON");
  if (seen.has(value as object)) throw new Error("CIRCULAR_JSON");
  seen.add(value as object);
  if (Array.isArray(value)) {
    return Object.freeze(value.map((item) => assertJsonSafe(item, seen)));
  }
  const out: Record<string, JsonValue> = {};
  for (const key of Object.keys(value as Record<string, unknown>).sort()) {
    out[key] = assertJsonSafe((value as Record<string, unknown>)[key], seen);
  }
  return Object.freeze(out);
}

function stringifyCanonical(value: JsonValue): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyCanonical(item)).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${stringifyCanonical(
          (value as Record<string, JsonValue>)[key]!,
        )}`,
    )
    .join(",")}}`;
}

export function serializeArtifactFingerprintSetCanonical(
  value: ControlledProductionPreflightArtifactFingerprintSet,
): string {
  return stringifyCanonical(assertJsonSafe(value, new WeakSet()));
}

export function serializeExecutionManifestCanonical(
  value: ControlledProductionPreflightExecutionManifest,
): string {
  return stringifyCanonical(assertJsonSafe(value, new WeakSet()));
}

export function serializeAuthorizationEnvelopeCanonical(
  value: ControlledProductionPreflightAuthorizationEnvelope,
): string {
  return stringifyCanonical(assertJsonSafe(value, new WeakSet()));
}

export function serializeBindingEvidenceCanonical(
  value: ControlledProductionPreflightBindingEvidence,
): string {
  return stringifyCanonical(assertJsonSafe(value, new WeakSet()));
}

function sha256Fingerprint(canonical: string): string {
  return `sha256:${createHash("sha256").update(canonical, "utf8").digest("hex")}`;
}

export function fingerprintArtifactFingerprintSet(
  value: ControlledProductionPreflightArtifactFingerprintSet,
): string {
  return sha256Fingerprint(serializeArtifactFingerprintSetCanonical(value));
}

export function fingerprintExecutionManifest(
  value: ControlledProductionPreflightExecutionManifest,
): string {
  return sha256Fingerprint(serializeExecutionManifestCanonical(value));
}

export function fingerprintAuthorizationEnvelope(
  value: ControlledProductionPreflightAuthorizationEnvelope,
): string {
  return sha256Fingerprint(serializeAuthorizationEnvelopeCanonical(value));
}

export function fingerprintBindingEvidence(
  value: ControlledProductionPreflightBindingEvidence,
): string {
  return sha256Fingerprint(serializeBindingEvidenceCanonical(value));
}

export type ControlledProductionPreflightValidationEvidence = Readonly<{
  checkId: "9X-C2-EVIDENCE";
  phase: "Execution Manifest and Authorization Contract Validation Evidence";
  manifestValid: boolean;
  authorizationValid: boolean;
  bindingValid: boolean;
  sourceCommit: typeof CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT;
  artifactFingerprintSetId: string;
  redactedTargetFingerprint: string;
  targetPurpose: ControlledProductionPreflightTargetPurpose;
  executionWindowId: string;
  expectedExecutorIdentity: typeof EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY;
  operatorAcknowledgementCount: number;
  manifestFingerprint: string;
  authorizationFingerprint: string;
  bindingFingerprint: string;
  productionCredentialAccessed: false;
  remoteConnectionPerformed: false;
  productionReadOnlyPreflightExecutedNow: false;
  productionWriteAuthorized: false;
  productionBootstrapAuthorized: false;
  productionRollbackAuthorized: false;
  productionRuntimeAuthorized: false;
  publicLaunchAuthorized: false;
}>;

export function buildControlledProductionPreflightValidationEvidence(
  manifest: ControlledProductionPreflightExecutionManifest,
  authorization: ControlledProductionPreflightAuthorizationEnvelope,
  binding: ControlledProductionPreflightBindingEvidence,
): ControlledProductionPreflightValidationEvidence {
  return deepFreezeContract(
    Object.freeze({
      checkId: "9X-C2-EVIDENCE" as const,
      phase:
        "Execution Manifest and Authorization Contract Validation Evidence" as const,
      manifestValid: true,
      authorizationValid: true,
      bindingValid: true,
      sourceCommit: CONTROLLED_PRODUCTION_PREFLIGHT_SOURCE_COMMIT,
      artifactFingerprintSetId:
        manifest.artifactFingerprintSet.artifactFingerprintSetId,
      redactedTargetFingerprint: redactTargetFingerprint(
        manifest.targetFingerprint,
      ),
      targetPurpose: manifest.targetPurpose,
      executionWindowId: manifest.executionWindow.executionWindowId,
      expectedExecutorIdentity:
        EXPECTED_PRODUCTION_PREFLIGHT_EXECUTOR_IDENTITY,
      operatorAcknowledgementCount: manifest.operatorAcknowledgements.length,
      manifestFingerprint: fingerprintExecutionManifest(manifest),
      authorizationFingerprint: fingerprintAuthorizationEnvelope(authorization),
      bindingFingerprint: fingerprintBindingEvidence(binding),
      productionCredentialAccessed: false as const,
      remoteConnectionPerformed: false as const,
      productionReadOnlyPreflightExecutedNow: false as const,
      productionWriteAuthorized: false as const,
      productionBootstrapAuthorized: false as const,
      productionRollbackAuthorized: false as const,
      productionRuntimeAuthorized: false as const,
      publicLaunchAuthorized: false as const,
    }),
  );
}

export const CONTRACT_META = Object.freeze({
  committedArtifactCount: COMMITTED_ARTIFACT_INVENTORY.length,
  artifactIdsUnique:
    new Set(COMMITTED_ARTIFACT_INVENTORY.map((item) => item.artifactId)).size ===
    COMMITTED_ARTIFACT_INVENTORY.length,
  artifactPathsUnique:
    new Set(COMMITTED_ARTIFACT_INVENTORY.map((item) => item.repositoryPath))
      .size === COMMITTED_ARTIFACT_INVENTORY.length,
  allArtifactsRequired: COMMITTED_ARTIFACT_INVENTORY.every(
    (item) => item.required === true,
  ),
  targetPurposeCount: CONTROLLED_PRODUCTION_PREFLIGHT_TARGET_PURPOSES.length,
  operatorAcknowledgementCount: OPERATOR_ACKNOWLEDGEMENT_IDS.length,
  maximumWindowDurationMinutes: 30,
  executionWindowUsesInjectedTime: true,
  executionWindowReadsSystemClock: false,
  nonceShapeValidated: true,
  noncePersistedByContract: false,
  nonceConsumedByContract: false,
  nonceGlobalUniquenessEnforcedByContract: false,
  backupRecoveryAcknowledgementRequired: true,
  allAcknowledgementsMustBeTrue: true,
  contractFingerprintCount: 3,
  bindingFieldCount: 6,
  bindingMismatchFailsClosed: true,
});
