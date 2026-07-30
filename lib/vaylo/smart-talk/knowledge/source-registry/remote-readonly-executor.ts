import "server-only";
import { createHash } from "node:crypto";

export const APPROVED_REMOTE_QUERY_IDS = [
  "SERVER_VERSION",
  "TRANSACTION_READ_ONLY_STATE",
  "STATEMENT_TIMEOUT_STATE",
  "LOCK_TIMEOUT_STATE",
  "PLATFORM_SCHEMA_PRESENCE",
  "REQUIRED_EXTENSION_INVENTORY",
  "MIGRATION_LEDGER_METADATA",
  "PUBLIC_TABLE_CATALOG",
  "PUBLIC_COLUMN_CATALOG",
  "PUBLIC_CONSTRAINT_CATALOG",
  "PUBLIC_INDEX_CATALOG",
  "PUBLIC_ENUM_CATALOG",
  "PUBLIC_FUNCTION_IDENTITY_CATALOG",
  "PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS",
  "PUBLIC_TRIGGER_CATALOG",
  "RLS_ENABLEMENT_CATALOG",
  "POLICY_DEFINITION_CATALOG",
  "TABLE_GRANT_CATALOG",
  "FUNCTION_GRANT_CATALOG",
  "INTERNAL_ENGINE_PRIVILEGE_CATALOG",
  "SOURCE_REGISTRY_COLLISION_CATALOG",
] as const;

export type ApprovedRemoteQueryId = (typeof APPROVED_REMOTE_QUERY_IDS)[number];

export type RemoteReadonlyQueryClass =
  | "POSTGRES_CATALOG_SELECT"
  | "INFORMATION_SCHEMA_SELECT"
  | "MIGRATION_LEDGER_SELECT"
  | "SERVER_SETTING_SHOW"
  | "PRIVILEGE_INSPECTION"
  | "FUNCTION_DEFINITION_INSPECTION";

export type SensitiveOutputPolicy =
  | "FINGERPRINT_ONLY"
  | "BOOLEAN_AND_COUNT"
  | "NORMALIZED_CATALOG";

export type ApprovedRemoteQueryDescriptor = Readonly<{
  queryId: ApprovedRemoteQueryId;
  queryClass: RemoteReadonlyQueryClass;
  readOnly: true;
  catalogOnly: true;
  mayReadApplicationRows: false;
  mayReadAuthRows: false;
  mayReadStorageRows: false;
  statementTimeoutMs: number;
  lockTimeoutMs: number;
  sensitiveOutputPolicy: SensitiveOutputPolicy;
  resultSanitizer: "REMOVE_HOST_URL_CREDENTIAL_AND_ROW_CONTENT";
}>;

const descriptor = (
  queryId: ApprovedRemoteQueryId,
  queryClass: RemoteReadonlyQueryClass,
  sensitiveOutputPolicy: SensitiveOutputPolicy,
): ApprovedRemoteQueryDescriptor =>
  Object.freeze({
    queryId,
    queryClass,
    readOnly: true,
    catalogOnly: true,
    mayReadApplicationRows: false,
    mayReadAuthRows: false,
    mayReadStorageRows: false,
    statementTimeoutMs: 5_000,
    lockTimeoutMs: 1_000,
    sensitiveOutputPolicy,
    resultSanitizer: "REMOVE_HOST_URL_CREDENTIAL_AND_ROW_CONTENT",
  });

export const APPROVED_REMOTE_QUERY_REGISTRY: Readonly<
  Record<ApprovedRemoteQueryId, ApprovedRemoteQueryDescriptor>
> = Object.freeze({
  SERVER_VERSION: descriptor("SERVER_VERSION", "SERVER_SETTING_SHOW", "BOOLEAN_AND_COUNT"),
  TRANSACTION_READ_ONLY_STATE: descriptor(
    "TRANSACTION_READ_ONLY_STATE",
    "SERVER_SETTING_SHOW",
    "BOOLEAN_AND_COUNT",
  ),
  STATEMENT_TIMEOUT_STATE: descriptor(
    "STATEMENT_TIMEOUT_STATE",
    "SERVER_SETTING_SHOW",
    "BOOLEAN_AND_COUNT",
  ),
  LOCK_TIMEOUT_STATE: descriptor("LOCK_TIMEOUT_STATE", "SERVER_SETTING_SHOW", "BOOLEAN_AND_COUNT"),
  PLATFORM_SCHEMA_PRESENCE: descriptor(
    "PLATFORM_SCHEMA_PRESENCE",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  REQUIRED_EXTENSION_INVENTORY: descriptor(
    "REQUIRED_EXTENSION_INVENTORY",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  MIGRATION_LEDGER_METADATA: descriptor(
    "MIGRATION_LEDGER_METADATA",
    "MIGRATION_LEDGER_SELECT",
    "FINGERPRINT_ONLY",
  ),
  PUBLIC_TABLE_CATALOG: descriptor(
    "PUBLIC_TABLE_CATALOG",
    "INFORMATION_SCHEMA_SELECT",
    "NORMALIZED_CATALOG",
  ),
  PUBLIC_COLUMN_CATALOG: descriptor(
    "PUBLIC_COLUMN_CATALOG",
    "INFORMATION_SCHEMA_SELECT",
    "NORMALIZED_CATALOG",
  ),
  PUBLIC_CONSTRAINT_CATALOG: descriptor(
    "PUBLIC_CONSTRAINT_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  PUBLIC_INDEX_CATALOG: descriptor(
    "PUBLIC_INDEX_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  PUBLIC_ENUM_CATALOG: descriptor(
    "PUBLIC_ENUM_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  PUBLIC_FUNCTION_IDENTITY_CATALOG: descriptor(
    "PUBLIC_FUNCTION_IDENTITY_CATALOG",
    "FUNCTION_DEFINITION_INSPECTION",
    "FINGERPRINT_ONLY",
  ),
  PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS: descriptor(
    "PUBLIC_FUNCTION_DEFINITION_FINGERPRINTS",
    "FUNCTION_DEFINITION_INSPECTION",
    "FINGERPRINT_ONLY",
  ),
  PUBLIC_TRIGGER_CATALOG: descriptor(
    "PUBLIC_TRIGGER_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  RLS_ENABLEMENT_CATALOG: descriptor(
    "RLS_ENABLEMENT_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "NORMALIZED_CATALOG",
  ),
  POLICY_DEFINITION_CATALOG: descriptor(
    "POLICY_DEFINITION_CATALOG",
    "PRIVILEGE_INSPECTION",
    "NORMALIZED_CATALOG",
  ),
  TABLE_GRANT_CATALOG: descriptor(
    "TABLE_GRANT_CATALOG",
    "PRIVILEGE_INSPECTION",
    "NORMALIZED_CATALOG",
  ),
  FUNCTION_GRANT_CATALOG: descriptor(
    "FUNCTION_GRANT_CATALOG",
    "PRIVILEGE_INSPECTION",
    "NORMALIZED_CATALOG",
  ),
  INTERNAL_ENGINE_PRIVILEGE_CATALOG: descriptor(
    "INTERNAL_ENGINE_PRIVILEGE_CATALOG",
    "PRIVILEGE_INSPECTION",
    "BOOLEAN_AND_COUNT",
  ),
  SOURCE_REGISTRY_COLLISION_CATALOG: descriptor(
    "SOURCE_REGISTRY_COLLISION_CATALOG",
    "POSTGRES_CATALOG_SELECT",
    "BOOLEAN_AND_COUNT",
  ),
});

export type RemoteReadonlyExecutorErrorKind =
  | "SAFE_AUTHENTICATION_UNAVAILABLE"
  | "TARGET_IDENTITY_MISMATCH"
  | "READ_ONLY_ENFORCEMENT_FAILED"
  | "QUERY_NOT_ALLOWED"
  | "QUERY_EXECUTION_FAILED"
  | "RESULT_SANITIZATION_FAILED"
  | "REMOTE_TIMEOUT"
  | "REMOTE_LOCK_TIMEOUT"
  | "PLATFORM_DEPENDENCY_MISSING"
  | "UNEXPECTED_REMOTE_RESULT"
  | "INVALID_TARGET_FINGERPRINT";

export type RemoteReadonlyQueryRequest = Readonly<{
  queryId: ApprovedRemoteQueryId;
  targetFingerprint: string;
  readOnlySessionVerified: true;
  statementTimeoutMs: number;
  lockTimeoutMs: number;
}>;

export type RemoteReadonlyQuerySuccess = Readonly<{
  ok: true;
  queryId: ApprovedRemoteQueryId;
  executed: true;
  readOnlyVerified: true;
  rowCount: number;
  normalizedFingerprint: string;
  observedAt: string;
  statementTimeoutMs: number;
  lockTimeoutMs: number;
  sensitiveFieldsRemoved: true;
}>;

export type RemoteReadonlyQueryFailure = Readonly<{
  ok: false;
  queryId: ApprovedRemoteQueryId | null;
  kind: RemoteReadonlyExecutorErrorKind;
  message: string;
}>;

export type RemoteReadonlyQueryResult =
  | RemoteReadonlyQuerySuccess
  | RemoteReadonlyQueryFailure;

export type ExternalReadonlyCommandResult = Readonly<{
  exitCode: number;
  sanitizedStdoutFingerprint: string;
  rowCount: number;
  observedAt: string;
}>;

export interface ExternalReadonlyCommandBridge {
  executeApprovedQuery(
    request: RemoteReadonlyQueryRequest,
  ): Promise<ExternalReadonlyCommandResult>;
}

/** Fail-closed concrete CLI bridge module identity (no dynamic resolution). */
export const CONCRETE_CLI_READONLY_BRIDGE_MODULE =
  "supabase-cli-readonly-bridge" as const;
export const CONCRETE_AUTHENTICATED_BRIDGE_AVAILABLE_BY_DEFAULT = false;

export type LinkedTargetIdentityObservation = Readonly<{
  sanitizedFingerprint: string;
  rawProjectReferenceExposed: false;
  rawUrlExposed: false;
  credentialExposed: false;
}>;

export const TARGET_FINGERPRINT_ALGORITHM = "SHA-256" as const;
export const TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION =
  "vaylo-target-identity-v1" as const;
export const TARGET_FINGERPRINT_FIELD_SEPARATOR = "\u001f" as const;
export const TARGET_FINGERPRINT_USES_SECRET_MATERIAL = false;
export const TARGET_FINGERPRINT_FIELD_ORDER = [
  "applicationIdentity",
  "environmentClassification",
  "organizationFingerprint",
  "projectReferenceFingerprint",
  "regionClassification",
  "expectedPostgresMajor",
] as const;

export type CanonicalTargetIdentityFieldName =
  (typeof TARGET_FINGERPRINT_FIELD_ORDER)[number];

export type CanonicalTargetIdentityTuple = Readonly<{
  applicationIdentity: string;
  environmentClassification: "CONTROLLED_PRODUCTION" | "CONTROLLED_STAGING";
  organizationFingerprint: string;
  projectReferenceFingerprint: string;
  regionClassification: string;
  expectedPostgresMajor: number;
}>;

export type DerivedTargetFingerprintSuccess = Readonly<{
  available: true;
  targetFingerprint: string;
  fingerprintAlgorithm: typeof TARGET_FINGERPRINT_ALGORITHM;
  canonicalContractVersion: typeof TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION;
  derived: true;
  sensitiveInputRemoved: true;
  linkedTargetPresent: boolean;
  safeAuthenticationAvailable: boolean;
  remoteCatalogQueryCount: 0;
  remoteWriteStatementCount: 0;
}>;

export type DerivedTargetFingerprintUnavailable = Readonly<{
  available: false;
  reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE";
  derived: false;
  remoteCatalogQueryCount: 0;
  remoteWriteStatementCount: 0;
}>;

export type DerivedTargetFingerprintResult =
  | DerivedTargetFingerprintSuccess
  | DerivedTargetFingerprintUnavailable;

export interface ExternalTargetFingerprintDerivationBridge {
  deriveLinkedTargetFingerprint(): Promise<DerivedTargetFingerprintResult>;
}

const FINGERPRINT_FIELD_HEX = /^[a-f0-9]{64}$/;
const FORBIDDEN_DERIVATION_OUTPUT =
  /postgres(?:ql)?:\/\/|https?:\/\/|service.?role.?key|anon.?key|access.?token|eyJ[a-zA-Z0-9_-]+\.|project[_-]?(?:id|ref)\b|supabase\.co|password|username|hostname|connection.?string|organization.?id|cli.?session|credential/i;

function rejectEmptyNormalized(value: string, field: string): string {
  if (value.normalize("NFC") !== value) {
    throw new TypeError(`Canonical identity field ${field} must already be Unicode NFC`);
  }
  if (value.length === 0 || value.trim() !== value) {
    throw new TypeError(`Canonical identity field ${field} must be non-empty without surrounding whitespace`);
  }
  return value;
}

export function serializeCanonicalTargetIdentity(
  tuple: CanonicalTargetIdentityTuple,
): string {
  const keys = Object.keys(tuple) as CanonicalTargetIdentityFieldName[];
  if (keys.length !== TARGET_FINGERPRINT_FIELD_ORDER.length) {
    throw new TypeError("Canonical identity tuple has unexpected field count");
  }
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) {
      throw new TypeError("Canonical identity tuple rejects duplicate fields");
    }
    seen.add(key);
    if (
      !(TARGET_FINGERPRINT_FIELD_ORDER as readonly string[]).includes(key)
    ) {
      throw new TypeError("Canonical identity tuple rejects unknown fields");
    }
  }
  for (const field of TARGET_FINGERPRINT_FIELD_ORDER) {
    if (!(field in tuple)) {
      throw new TypeError(`Canonical identity tuple missing field ${field}`);
    }
  }
  const parts = TARGET_FINGERPRINT_FIELD_ORDER.map((field) => {
    if (field === "expectedPostgresMajor") {
      const major = tuple.expectedPostgresMajor;
      if (!Number.isInteger(major) || major < 1 || major > 99) {
        throw new TypeError("expectedPostgresMajor must be a bounded positive integer");
      }
      return String(major);
    }
    if (field === "environmentClassification") {
      const environment = tuple.environmentClassification;
      if (
        environment !== "CONTROLLED_PRODUCTION" &&
        environment !== "CONTROLLED_STAGING"
      ) {
        throw new TypeError("environmentClassification is outside the allowed set");
      }
      return environment;
    }
    const value = rejectEmptyNormalized(String(tuple[field]), field);
    if (
      (field === "organizationFingerprint" ||
        field === "projectReferenceFingerprint") &&
      !FINGERPRINT_FIELD_HEX.test(value)
    ) {
      throw new TypeError(`${field} must already be a 64-character lowercase hex digest`);
    }
    if (
      field === "applicationIdentity" &&
      /password|token|secret|postgres(?:ql)?:\/\/|https?:\/\//i.test(value)
    ) {
      throw new TypeError("applicationIdentity must not contain secret material");
    }
    return value;
  });
  return parts.join(TARGET_FINGERPRINT_FIELD_SEPARATOR);
}

export function deriveCanonicalTargetFingerprint(
  tuple: CanonicalTargetIdentityTuple,
): string {
  const serialized = serializeCanonicalTargetIdentity(tuple);
  return createHash("sha256").update(serialized, "utf8").digest("hex");
}

export function assertOperatorConfirmationSeparation(
  derivationModeActive: boolean,
  preflightModeActive: boolean,
): Readonly<{
  operatorConfirmationRequired: true;
  selfConfirmationAllowed: false;
  accepted: boolean;
}> {
  return Object.freeze({
    operatorConfirmationRequired: true,
    selfConfirmationAllowed: false,
    accepted: !(derivationModeActive && preflightModeActive),
  });
}

export function confirmExplicitFingerprintAgainstDerived(
  explicitFingerprint: string,
  derivedFingerprint: string,
): Readonly<{
  matched: boolean;
  remoteCatalogQueriesAllowed: boolean;
  remoteCatalogQueryCountBeforeConfirmation: 0;
}> {
  const matched =
    isValidTargetFingerprint(explicitFingerprint) &&
    isValidTargetFingerprint(derivedFingerprint) &&
    explicitFingerprint === derivedFingerprint;
  return Object.freeze({
    matched,
    remoteCatalogQueriesAllowed: matched,
    remoteCatalogQueryCountBeforeConfirmation: 0,
  });
}

export function isSafeDerivedFingerprintPayload(
  payload: unknown,
): payload is DerivedTargetFingerprintSuccess {
  if (!payload || typeof payload !== "object") return false;
  const record = payload as Record<string, unknown>;
  if (record.available !== true) return false;
  if (record.derived !== true) return false;
  if (record.sensitiveInputRemoved !== true) return false;
  if (record.fingerprintAlgorithm !== TARGET_FINGERPRINT_ALGORITHM) return false;
  if (record.canonicalContractVersion !== TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION) {
    return false;
  }
  if (typeof record.targetFingerprint !== "string") return false;
  if (!isValidTargetFingerprint(record.targetFingerprint)) return false;
  if (typeof record.linkedTargetPresent !== "boolean") return false;
  if (typeof record.safeAuthenticationAvailable !== "boolean") return false;
  if (record.remoteCatalogQueryCount !== 0) return false;
  if (record.remoteWriteStatementCount !== 0) return false;
  if (FORBIDDEN_DERIVATION_OUTPUT.test(JSON.stringify(record))) return false;
  return true;
}

export async function deriveLinkedTargetFingerprintExternally(
  bridge: ExternalTargetFingerprintDerivationBridge,
): Promise<DerivedTargetFingerprintResult> {
  const result = await bridge.deriveLinkedTargetFingerprint();
  if (result.available === false) {
    return Object.freeze({
      available: false,
      reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      derived: false,
      remoteCatalogQueryCount: 0,
      remoteWriteStatementCount: 0,
    });
  }
  if (!isSafeDerivedFingerprintPayload(result)) {
    return Object.freeze({
      available: false,
      reason: "SAFE_TARGET_FINGERPRINT_DERIVATION_UNAVAILABLE",
      derived: false,
      remoteCatalogQueryCount: 0,
      remoteWriteStatementCount: 0,
    });
  }
  return Object.freeze({
    available: true,
    targetFingerprint: result.targetFingerprint,
    fingerprintAlgorithm: TARGET_FINGERPRINT_ALGORITHM,
    canonicalContractVersion: TARGET_FINGERPRINT_CANONICAL_CONTRACT_VERSION,
    derived: true,
    sensitiveInputRemoved: true,
    linkedTargetPresent: result.linkedTargetPresent,
    safeAuthenticationAvailable: result.safeAuthenticationAvailable,
    remoteCatalogQueryCount: 0,
    remoteWriteStatementCount: 0,
  });
}

const FORBIDDEN_SQL =
  /\b(?:insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|copy|call|do|vacuum|analyze|refresh|reindex|cluster|comment|security\s+label|listen|notify|set\s+role|set\s+session\s+authorization|create\s+temp|pg_advisory_lock|pg_terminate_backend|dblink|lo_export)\b/i;

const FORBIDDEN_FUNCTIONS =
  /\b(?:knowledge_transition_source_authorization_internal|knowledge_(?:register|update|record|authorize|suspend|reject|retire|assign)_)\b/i;

const APPLICATION_DATA =
  /\b(?:profiles|user_documents|auth\.users|storage\.objects|knowledge_sources|knowledge_translations)\b/i;

const SENSITIVE_RESULT =
  /postgres(?:ql)?:\/\/|https?:\/\/|service.?role.?key|anon.?key|access.?token|eyJ[a-zA-Z0-9_-]+\.|project[_-]?(?:id|ref)\b|supabase\.co/i;

export function isApprovedRemoteQueryId(
  value: string,
): value is ApprovedRemoteQueryId {
  return (APPROVED_REMOTE_QUERY_IDS as readonly string[]).includes(value);
}

export function isValidTargetFingerprint(value: string): boolean {
  return /^[a-f0-9]{64}$/.test(value);
}

export function assertValidTargetFingerprint(value: string): string {
  if (!isValidTargetFingerprint(value)) {
    throw new TypeError("Target fingerprint must be exactly 64 lowercase hex characters");
  }
  return value;
}

export function isApprovedReadOnlySqlTemplate(sql: string): boolean {
  const normalized = sql.trim();
  if (!normalized || normalized.includes(";")) return false;
  if (!/^(?:select|show)\b/i.test(normalized)) return false;
  if (FORBIDDEN_SQL.test(normalized)) return false;
  if (FORBIDDEN_FUNCTIONS.test(normalized)) return false;
  if (APPLICATION_DATA.test(normalized)) return false;
  if (/^show\s+(transaction_read_only|statement_timeout|lock_timeout)$/i.test(normalized)) {
    return true;
  }
  return /(?:pg_catalog|information_schema|supabase_migrations|\bpg_)/i.test(normalized);
}

export function sanitizeRemoteCatalogPayload(value: unknown): {
  sanitized: true;
  rejected: boolean;
  fingerprintSeed: string;
} {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return {
    sanitized: true,
    rejected: SENSITIVE_RESULT.test(text),
    fingerprintSeed: text,
  };
}

export function createRemoteReadonlyExecutor(
  bridge: ExternalReadonlyCommandBridge,
): {
  execute(
    request: RemoteReadonlyQueryRequest,
    linkedObservation: LinkedTargetIdentityObservation | null,
  ): Promise<RemoteReadonlyQueryResult>;
} {
  return Object.freeze({
    async execute(
      request: RemoteReadonlyQueryRequest,
      linkedObservation: LinkedTargetIdentityObservation | null,
    ): Promise<RemoteReadonlyQueryResult> {
      if (!isValidTargetFingerprint(request.targetFingerprint)) {
        return Object.freeze({
          ok: false,
          queryId: null,
          kind: "INVALID_TARGET_FINGERPRINT",
          message: "Explicit sanitized target fingerprint is required",
        });
      }
      if (!isApprovedRemoteQueryId(request.queryId)) {
        return Object.freeze({
          ok: false,
          queryId: null,
          kind: "QUERY_NOT_ALLOWED",
          message: "Query identifier is outside the approved registry",
        });
      }
      if (!request.readOnlySessionVerified) {
        return Object.freeze({
          ok: false,
          queryId: request.queryId,
          kind: "READ_ONLY_ENFORCEMENT_FAILED",
          message: "Read-only session verification is required",
        });
      }
      if (request.statementTimeoutMs <= 0 || request.lockTimeoutMs <= 0) {
        return Object.freeze({
          ok: false,
          queryId: request.queryId,
          kind: "READ_ONLY_ENFORCEMENT_FAILED",
          message: "Bounded statement and lock timeouts are required",
        });
      }
      if (
        !linkedObservation ||
        linkedObservation.rawProjectReferenceExposed ||
        linkedObservation.rawUrlExposed ||
        linkedObservation.credentialExposed ||
        linkedObservation.sanitizedFingerprint !== request.targetFingerprint
      ) {
        return Object.freeze({
          ok: false,
          queryId: request.queryId,
          kind: "TARGET_IDENTITY_MISMATCH",
          message: "Linked target fingerprint must match the explicit selector",
        });
      }
      try {
        const external = await bridge.executeApprovedQuery(request);
        if (external.exitCode !== 0) {
          return Object.freeze({
            ok: false,
            queryId: request.queryId,
            kind: "QUERY_EXECUTION_FAILED",
            message: "External read-only command failed",
          });
        }
        if (SENSITIVE_RESULT.test(external.sanitizedStdoutFingerprint)) {
          return Object.freeze({
            ok: false,
            queryId: request.queryId,
            kind: "RESULT_SANITIZATION_FAILED",
            message: "Remote result retained sensitive content",
          });
        }
        return Object.freeze({
          ok: true,
          queryId: request.queryId,
          executed: true,
          readOnlyVerified: true,
          rowCount: external.rowCount,
          normalizedFingerprint: external.sanitizedStdoutFingerprint,
          observedAt: external.observedAt,
          statementTimeoutMs: request.statementTimeoutMs,
          lockTimeoutMs: request.lockTimeoutMs,
          sensitiveFieldsRemoved: true,
        });
      } catch {
        return Object.freeze({
          ok: false,
          queryId: request.queryId,
          kind: "SAFE_AUTHENTICATION_UNAVAILABLE",
          message: "External read-only authentication bridge is unavailable",
        });
      }
    },
  });
}
